import DOMPurify from 'dompurify';

export const sanitizeGeneratedHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ['script', 'style', 'iframe', 'link'], // Allow necessary tags for the preview
    ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'sandbox', 'class', 'style', 'id'],
    WHOLE_DOCUMENT: true, // Preserve html/head/body structure
    // Hook to prevent top navigation
    FORBID_TAGS: ['base'], 
    FORBID_ATTR: ['action', 'formaction'],
  });
};