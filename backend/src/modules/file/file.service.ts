import fs from 'fs';
import pdf from 'pdf-parse';

export const extractPdfText = async (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  if (buffer.length === 0) {
    throw new Error('File is empty');
  }
  const data = await pdf(buffer);
  return data.text || '';
};

export const extractPdfPages = async (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const buffer = fs.readFileSync(filePath);
  if (buffer.length === 0) {
    throw new Error('File is empty');
  }

  const pages: string[] = [];
  const data = await pdf(buffer, {
    pagerender: async (pageData) => {
      const textContent = await pageData.getTextContent();
      const pageText = textContent.items
        .map((item: any) => (item.str ? item.str : ''))
        .join(' ');
      pages.push(pageText);
      return pageText;
    },
  });

  // ensure at least one page exists
  if (pages.length === 0 && data.text) {
    pages.push(data.text);
  }

  return pages;
};
