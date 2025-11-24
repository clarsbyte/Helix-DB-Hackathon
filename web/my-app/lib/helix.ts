/**
 * Helix DB Client
 * Communicates with the local Helix database
 */

const HELIX_URL = process.env.NEXT_PUBLIC_HELIX_URL || 'http://localhost:6969';

export async function queryHelix(queryName: string, args: Record<string, any> = {}) {
  try {
    const response = await fetch(`${HELIX_URL}/query/${queryName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      throw new Error(`Helix query failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error querying Helix (${queryName}):`, error);
    throw error;
  }
}

// ========== PDF QUERIES ==========

export async function getAllPDFs() {
  return queryHelix('getAllPDFs');
}

export async function getPDF(pdfId: number) {
  return queryHelix('getPDF', { pdf_id: pdfId });
}

export async function addPDF(pdf: {
  pdf_id: number;
  title: string;
  summary: string;
  filename: string;
  upload_date: string;
}) {
  return queryHelix('addPDF', pdf);
}

// ========== RELATIONSHIP QUERIES ==========

export async function relatePDFs(fromId: number, toId: number, relationshipType: string, confidence: number) {
  return queryHelix('relatePDFs', {
    from_id: fromId,
    to_id: toId,
    relationship_type: relationshipType,
    confidence: confidence,
  });
}

export async function getRelatedPDFs(pdfId: number) {
  return queryHelix('getRelatedPDFs', { pdf_id: pdfId });
}

export async function getPDFConnections(pdfId: number) {
  return queryHelix('getPDFConnections', { pdf_id: pdfId });
}
