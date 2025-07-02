import type { Locale } from '../i18n';

export default function DownloadButtons({ locale }: { locale: Locale }) {
  const base = `/Guillermo_Lam_CV_${locale}`;
  return (
    <nav class="my-6 space-x-3">
      <a class="btn" href={`${base}.docx`} download="">DOCX</a>
      <a class="btn" href={`${base}_markdown.zip`} download="">MD</a>
      <a class="btn" href={`${base}.pdf`}  download="">PDF</a>
      <a class="btn" href={`/index.html`}  download="">HTML</a>
    </nav>
  );
}
