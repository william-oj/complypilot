import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph } from "docx";

function lookup(path: string, data: Record<string, any>) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), data);
}

export function renderTemplate(template: string, data: Record<string, any>) {
  return template.replace(/{{\s*([\w\.]+)\s*}}/g, (_, key) => {
    const value = lookup(key, data);
    return value === undefined || value === null ? "" : String(value);
  });
}

export async function generatePdf(content: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    content.split("\n").forEach((line) => {
      doc.text(line, { lineGap: 4 });
    });
    doc.end();
  });
}

export async function generateDocx(content: string): Promise<Buffer> {
  const paragraphs = content.split("\n").map((line) => new Paragraph(line));
  const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
  return Packer.toBuffer(doc);
}
