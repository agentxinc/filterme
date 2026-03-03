export async function generatePdfFromText(text: string, filename = "document.pdf") {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxY = pageHeight - margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const paragraphs = text.split("\n");
  let y = margin;

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") {
      y += lineHeight;
      if (y > maxY) {
        doc.addPage();
        y = margin;
      }
      continue;
    }

    const lines = doc.splitTextToSize(paragraph, maxWidth) as string[];
    for (const line of lines) {
      if (y > maxY) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += lineHeight;
    }
  }

  doc.save(filename);
}
