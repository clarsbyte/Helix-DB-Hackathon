import { NextRequest, NextResponse } from 'next/server';
import { getPDFsByUser, getRelatedPDFs } from '@/lib/helix';
import { getTokenFromCookie } from '@/lib/auth-cookies';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { getCognitoClient } from '@/lib/cognito';

// Color palette for PDFs
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

function getColorForPDF(pdfId: number): string {
  return COLORS[pdfId % COLORS.length];
}

export async function GET(request: NextRequest) {
  console.log('[Graph API] Request received');
  try {
    // Get authenticated user
    const accessToken = getTokenFromCookie(request, 'accessToken');
    console.log('[Graph API] Access token present:', !!accessToken);

    if (!accessToken) {
      console.log('[Graph API] No access token - returning 401');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user info from Cognito
    console.log('[Graph API] Fetching user from Cognito...');
    const command = new GetUserCommand({ AccessToken: accessToken });
    const cognitoClient = getCognitoClient();
    const userResponse = await cognitoClient.send(command);
    console.log('[Graph API] Cognito response received');

    // Extract user ID (sub attribute)
    const userIdAttr = userResponse.UserAttributes?.find(attr => attr.Name === 'sub');
    const userId = userIdAttr?.Value;

    console.log('[Graph API] Authenticated user ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400 }
      );
    }

    // Fetch PDFs for this user from Helix
    console.log('[Graph API] Fetching PDFs from Helix for user:', userId);
    const pdfsResponse = await getPDFsByUser(userId);
    console.log('[Graph API] Helix response:', JSON.stringify(pdfsResponse, null, 2));

    // Handle different response formats from Helix
    let allPdfs = [];
    if (Array.isArray(pdfsResponse)) {
      allPdfs = pdfsResponse;
    } else if (pdfsResponse && pdfsResponse.pdfs) {
      if (Array.isArray(pdfsResponse.pdfs)) {
        allPdfs = pdfsResponse.pdfs;
      } else if (typeof pdfsResponse.pdfs === 'object') {
        console.log('[Graph API] Single PDF found, wrapping in array');
        allPdfs = [pdfsResponse.pdfs];
      }
    }

    // Filter by user_id (since Helix query returns all PDFs)
    const pdfs = allPdfs.filter((pdf: any) => pdf.user_id === userId);
    console.log('[Graph API] Total PDFs:', allPdfs.length, 'User PDFs:', pdfs.length);

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
    console.error('[Graph API] Error fetching graph data:', error);
    console.error('[Graph API] Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      stack: (error as any)?.stack,
    });

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
