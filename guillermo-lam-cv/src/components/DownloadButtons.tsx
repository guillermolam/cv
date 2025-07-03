import type { Locale } from "../i18n";
import { jsPDF } from "jspdf";

export default function DownloadButtons({ locale }: { locale: Locale }) {
  // Function to get the rendered HTML content from the article element
  const getRenderedContent = () => {
    const article = document.querySelector("article");
    return article ? article.innerHTML : "";
  };

  // Function to download as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    const content = getRenderedContent();
    doc.html(content, {
      callback: function (doc) {
        doc.save(`Guillermo_Lam_CV_${locale}.pdf`);
      },
      x: 10,
      y: 10,
    });
  };

  // Function to download as DOCX - Temporarily disabled due to library error
  const downloadDOCX = async () => {
    alert("DOCX download is temporarily disabled due to a technical issue.");
  };

  // Function to download as HTML
  const downloadHTML = () => {
    const content = getRenderedContent();
    const blob = new Blob([content], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Guillermo_Lam_CV_${locale}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Placeholder for Markdown download (could be implemented if raw markdown is accessible)
  const downloadMD = () => {
    alert("Markdown download is not implemented yet.");
  };

  return (
    <nav class="my-6 space-x-3">
      <button class="btn" onClick={downloadDOCX} disabled>
        DOCX (Disabled)
      </button>
      <button class="btn" onClick={downloadMD}>
        MD
      </button>
      <button class="btn" onClick={downloadPDF}>
        PDF
      </button>
      <button class="btn" onClick={downloadHTML}>
        HTML
      </button>
    </nav>
  );
}
