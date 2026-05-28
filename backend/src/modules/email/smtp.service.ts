import net from 'node:net';
import tls from 'node:tls';

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

const readResponse = (socket: net.Socket) =>
  new Promise<string>((resolve, reject) => {
    let buffer = '';
    const onData = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];
      if (lastLine && /^\d{3} /.test(lastLine)) {
        socket.off('data', onData);
        resolve(buffer);
      }
    };
    socket.on('data', onData);
    socket.once('error', reject);
  });

const writeCommand = async (socket: net.Socket, command: string, expectedCodes: string[]) => {
  socket.write(`${command}\r\n`);
  const response = await readResponse(socket);
  if (!expectedCodes.some((code) => response.startsWith(code))) {
    throw new Error(`SMTP command failed: ${response.trim()}`);
  }
  return response;
};

const encodeAddress = (name: string, email: string) => `"${name.replace(/"/g, '')}" <${email}>`;

const dotEscape = (value: string) => value.replace(/\r?\n\./g, '\r\n..');

const getEnv = (key: string) => process.env[key]?.trim();

export const sendMail = async ({ to, subject, text, html }: MailOptions) => {
  const host = getEnv('SMTP_HOST');
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');
  const port = Number(getEnv('SMTP_PORT') || '587');
  const secure = String(getEnv('SMTP_SECURE') || '').toLowerCase() === 'true' || port === 465;
  const fromEmail = getEnv('SMTP_FROM') || 'no-reply@moniveo.local';
  const fromName = getEnv('SMTP_FROM_NAME') || 'Moniveo';

  if (!host || !user || !pass || !fromEmail) {
    throw new Error('SMTP configuration is incomplete');
  }
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`SMTP_PORT is invalid: ${process.env.SMTP_PORT}`);
  }

  const socket = secure
    ? tls.connect({ host, port, servername: host })
    : net.connect({ host, port });

  try {
    await new Promise<void>((resolve, reject) => {
      socket.once(secure ? 'secureConnect' : 'connect', resolve);
      socket.once('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOTFOUND' || error.code === 'ENOENT') {
          reject(new Error(`SMTP host could not be resolved: ${host}`));
          return;
        }
        reject(error);
      });
      socket.setTimeout(15000, () => reject(new Error('SMTP connection timed out')));
    });

    const greeting = await readResponse(socket);
    if (!greeting.startsWith('220')) throw new Error(`SMTP greeting failed: ${greeting.trim()}`);

    await writeCommand(socket, `EHLO ${process.env.SMTP_HELO_NAME || 'localhost'}`, ['250']);
    await writeCommand(socket, 'AUTH LOGIN', ['334']);
    await writeCommand(socket, Buffer.from(user).toString('base64'), ['334']);
    await writeCommand(socket, Buffer.from(pass).toString('base64'), ['235']);
    await writeCommand(socket, `MAIL FROM:<${fromEmail}>`, ['250']);
    await writeCommand(socket, `RCPT TO:<${to}>`, ['250', '251']);
    await writeCommand(socket, 'DATA', ['354']);

    const boundary = `moniveo-${Date.now()}`;
    const body = html
      ? [
          `--${boundary}`,
          'Content-Type: text/plain; charset=utf-8',
          '',
          text,
          `--${boundary}`,
          'Content-Type: text/html; charset=utf-8',
          '',
          html,
          `--${boundary}--`,
        ].join('\r\n')
      : text;
    const headers = [
      `From: ${encodeAddress(fromName, fromEmail)}`,
      `To: <${to}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      html ? `Content-Type: multipart/alternative; boundary="${boundary}"` : 'Content-Type: text/plain; charset=utf-8',
      '',
      dotEscape(body),
      '.',
    ].join('\r\n');

    socket.write(`${headers}\r\n`);
    const sent = await readResponse(socket);
    if (!sent.startsWith('250')) throw new Error(`SMTP send failed: ${sent.trim()}`);
    await writeCommand(socket, 'QUIT', ['221']);
  } finally {
    socket.end();
  }
};
