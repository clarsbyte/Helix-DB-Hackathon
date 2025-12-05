// Simple PDF Graph Schema

// PDF node - represents a processed PDF document
N::PDF {
    title: String,
    summary: String,
    filename: String,
    upload_date: String,
    INDEX pdf_id: I32
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
