/**
 * PDF API Client
 * Handles communication with the Python backend for PDF operations
 */

export async function deletePdf(
  pdfId: number,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`http://localhost:8000/pdf/${pdfId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        delete_file: true, // Always delete physical file
      }),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return { success: true };
    } else {
      return {
        success: false,
        error: result.message || 'Failed to delete PDF',
      };
    }
  } catch (error) {
    console.error('Delete PDF error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}
