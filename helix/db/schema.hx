// Simple PDF Graph Schema

// PDF node - represents a processed PDF document
N::PDF {
    INDEX pdf_id: I32,      // Unique identifier for each PDF
    user_id: String,        // User who uploaded the PDF
    title: String,
    summary: String,
    filename: String,
    upload_date: String
}

// Edge: PDF is related to another PDF
E::RelatedTo {
    From: PDF,
    To: PDF,
    Properties: {
        relationship_type: String,  // e.g., "similar_topic", "references", "prerequisite"
        confidence: F64
    }
}
