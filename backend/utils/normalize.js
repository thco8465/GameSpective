// /utils/normalize.js
const normalizeGameName = (name) => {
    if (!name) return '';
  
    // Trim whitespace
    let normalized = name.trim();
  
    // Convert to title case
    normalized = normalized.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  
    // Remove special characters (except hyphens and apostrophes)
    normalized = normalized.replace(/[^\w\s'-]/g, '');
  
    // Replace multiple spaces with a single space
    normalized = normalized.replace(/\s+/g, ' ');
  
    return normalized;
  };
  
  module.exports = { normalizeGameName };
  