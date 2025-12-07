// ========== PDF MANAGEMENT ==========

// Add a new PDF document
QUERY addPDF(pdf_id: I32, title: String, summary: String, filename: String, upload_date: String, user_id: String) =>
    pdf <- AddN<PDF>({
        pdf_id: pdf_id,
        title: title,
        summary: summary,
        filename: filename,
        upload_date: upload_date,
        user_id: user_id
    })
    RETURN pdf


// Get all PDFs
QUERY getAllPDFs() =>
    pdfs <- N<PDF>
    RETURN pdfs::{
        pdf_id,
        title,
        summary,
        filename,
        upload_date,
        user_id
    }


// Get a specific PDF by ID
QUERY getPDF(pdf_id: I32) =>
    pdf <- N<PDF>({pdf_id: pdf_id})
    RETURN pdf::{
        pdf_id,
        title,
        summary,
        filename,
        upload_date,
        user_id
    }


// Get all PDFs (filter by user_id in application code)
QUERY getPDFsByUser(user_id: String) =>
    pdfs <- N<PDF>
    RETURN pdfs::{
        pdf_id,
        title,
        summary,
        filename,
        upload_date,
        user_id
    }


// ========== RELATIONSHIP MANAGEMENT ==========

// Create a relationship between two PDFs
QUERY relatePDFs(from_id: I32, to_id: I32, relationship_type: String, confidence: F64) =>
    pdf1 <- N<PDF>({pdf_id: from_id})
    pdf2 <- N<PDF>({pdf_id: to_id})

    AddE<RelatedTo>({relationship_type: relationship_type, confidence: confidence})::From(pdf1)::To(pdf2)

    RETURN pdf2::{
        pdf_id,
        title,
        summary
    }


// Get all PDFs related to a specific PDF (outgoing edges only)
QUERY getRelatedPDFs(pdf_id: I32) =>
    pdf <- N<PDF>({pdf_id: pdf_id})

    // Get outgoing relationships
    related <- pdf::Out<RelatedTo>

    RETURN related::{
        pdf_id,
        title,
        summary,
        filename
    }


// Get the full graph of connections for a PDF (with edge properties)
QUERY getPDFConnections(pdf_id: I32) =>
    pdf <- N<PDF>({pdf_id: pdf_id})

    // Get outgoing relationships
    related <- pdf::Out<RelatedTo>

    RETURN related::{
        pdf_id,
        title,
        summary
    }
