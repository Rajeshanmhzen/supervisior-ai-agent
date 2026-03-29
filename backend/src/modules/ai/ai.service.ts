import { spawn } from 'child_process';
import path from 'path';

export const analyzeWithAI = async (text: string) => {
  const scriptPath = path.resolve(process.cwd(), 'python_ai', 'analyze.py');

  return new Promise<any>((resolve, reject) => {
    const proc = spawn('python', [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || 'AI process failed'));
      }
      const output = stdout.trim();
      try {
        const parsed = JSON.parse(output);
        return resolve(parsed);
      } catch {
        return resolve({
          topics: [],
          summary: output,
          importantQuestions: [],
        });
      }
    });

    proc.stdin.write(text);
    proc.stdin.end();
  });
};
