// ============================================
// PDF GENERATION UTILITIES
// client/src/utils/pdfGenerator.js
// ============================================

/**
 * Print a component by opening it in a new window
 * @param {React.RefObject} componentRef - Ref to the component to print
 * @param {string} title - Title for the print window
 */
export const printComponent = (componentRef, title = 'Print') => {
  if (!componentRef?.current) {
    console.error('No component ref provided');
    return;
  }

  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to print');
    return;
  }

  const html = componentRef.current.innerHTML;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f5f5f5;
        }
        .bg-gray-100 { background-color: #f3f4f6; }
        .bg-gray-50 { background-color: #f9fafb; }
        .bg-gray-800 { background-color: #1f2937; color: white; }
        .bg-blue-600 { background-color: #2563eb; color: white; }
        .bg-blue-50 { background-color: #eff6ff; }
        .bg-blue-100 { background-color: #dbeafe; }
        .bg-green-50 { background-color: #f0fdf4; }
        .bg-purple-50 { background-color: #faf5ff; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-800 { color: #1f2937; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-800 { color: #1e40af; }
        .text-green-600 { color: #16a34a; }
        .text-red-600 { color: #dc2626; }
        .text-purple-600 { color: #9333ea; }
        .font-bold { font-weight: bold; }
        .font-medium { font-weight: 500; }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-lg { font-size: 1.125rem; }
        .text-xl { font-size: 1.25rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .uppercase { text-transform: uppercase; }
        .capitalize { text-transform: capitalize; }
        .italic { font-style: italic; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        .mt-8 { margin-top: 2rem; }
        .mt-12 { margin-top: 3rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-8 { padding: 2rem; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .px-8 { padding-left: 2rem; padding-right: 2rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .pb-4 { padding-bottom: 1rem; }
        .pt-2 { padding-top: 0.5rem; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .space-y-2 > * + * { margin-top: 0.5rem; }
        .border { border: 1px solid #ddd; }
        .border-t { border-top: 1px solid #ddd; }
        .border-b { border-bottom: 1px solid #ddd; }
        .border-b-2 { border-bottom: 2px solid; }
        .border-b-4 { border-bottom: 4px solid; }
        .border-gray-400 { border-color: #9ca3af; }
        .border-gray-800 { border-color: #1f2937; }
        .border-blue-600 { border-color: #2563eb; }
        .rounded { border-radius: 0.25rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-full { border-radius: 9999px; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-cols-7 { grid-template-columns: repeat(7, 1fr); }
        .flex { display: flex; }
        .inline-block { display: inline-block; }
        .justify-center { justify-content: center; }
        .items-center { align-items: center; }
        .w-16 { width: 4rem; }
        .h-16 { height: 4rem; }
        .w-20 { width: 5rem; }
        .w-24 { width: 6rem; }
        .w-32 { width: 8rem; }
        .w-full { width: 100%; }
        .max-w-2xl { max-width: 42rem; }
        .max-w-3xl { max-width: 48rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

/**
 * Download a component as PDF using window.print()
 * This is a simple approach that works without external libraries
 */
export const downloadAsPDF = (componentRef, filename = 'document') => {
  printComponent(componentRef, filename);
};

/**
 * Format filename with date
 */
export const generateFilename = (prefix, extension = 'pdf') => {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}.${extension}`;
};
