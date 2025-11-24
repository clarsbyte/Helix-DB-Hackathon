import { NextResponse } from 'next/server';
import { getAllPDFs, getRelatedPDFs } from '@/lib/helix';

// Color palette for PDFs
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

function getColorForPDF(pdfId: number): string {
  return COLORS[pdfId % COLORS.length];
}

export async function GET() {
  try {
    // Fetch all PDFs from Helix
    const pdfsResponse = await getAllPDFs();
    const pdfs = pdfsResponse.pdfs || [];

    // Build nodes
    const nodes = pdfs.map((pdf: any) => ({
      id: `pdf_${pdf.pdf_id}`,
      name: pdf.title,
      type: 'pdf',
      color: getColorForPDF(pdf.pdf_id),
      val: 16, // Size of the node
      summary: pdf.summary,
      filename: pdf.filename,
      upload_date: pdf.upload_date,
    }));

    // Build links by fetching relationships for each PDF
    const links: Array<{ source: string; target: string }> = [];
    const relationshipPromises = pdfs.map((pdf: any) =>
      getRelatedPDFs(pdf.pdf_id).catch(() => ({ related: [] }))
    );

    const relationshipsResults = await Promise.all(relationshipPromises);

    relationshipsResults.forEach((result, index) => {
      const sourcePdfId = pdfs[index].pdf_id;
      const related = result.related || [];

      related.forEach((relatedPdf: any) => {
        links.push({
          source: `pdf_${sourcePdfId}`,
          target: `pdf_${relatedPdf.pdf_id}`,
        });
      });
    });

    // Remove duplicate links
    const uniqueLinks = Array.from(
      new Map(links.map(link => [`${link.source}-${link.target}`, link])).values()
    );

    return NextResponse.json({
      nodes,
      links: uniqueLinks,
    });
  } catch (error) {
    console.error('Error fetching graph data:', error);

    // Return mock data as fallback
    return NextResponse.json({
      nodes: [
        { id: 'pdf_1', name: 'Sample PDF 1', type: 'pdf', color: '#ef4444', val: 16 },
        { id: 'pdf_2', name: 'Sample PDF 2', type: 'pdf', color: '#3b82f6', val: 16 },
        { id: 'pdf_3', name: 'Sample PDF 3', type: 'pdf', color: '#10b981', val: 16 },
      ],
      links: [
        { source: 'pdf_1', target: 'pdf_2' },
        { source: 'pdf_2', target: 'pdf_3' },
      ],
    });
  }
}
