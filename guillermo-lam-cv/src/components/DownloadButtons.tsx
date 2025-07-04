import type { Locale } from "../i18n";
import { jsPDF } from "jspdf";
import HTMLtoDOCX from "html-to-docx";
import { getLocaleParts } from "../markdown";

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

  // Function to download as DOCX using html-to-docx
  const downloadDOCX = async () => {
    const html = getRenderedContent();
    const blob = await HTMLtoDOCX(html);
    const url = window.URL.createObjectURL(blob as Blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Guillermo_Lam_CV_${locale}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);
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

  // Function to download as Markdown
  const downloadMD = () => {
    const md = getLocaleParts(locale);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Guillermo_Lam_CV_${locale}.md`;
    link.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <nav class="download-nav">
      <button class="btn" onClick={downloadDOCX}>
        DOCX
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
