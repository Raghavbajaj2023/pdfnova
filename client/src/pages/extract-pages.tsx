import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, FileOutput } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("extract-pages")!;

export default function ExtractPagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToExtract, setPagesToExtract] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    const file = newFiles[0];
    setFiles([file]);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      setPagesToExtract(`1-${pdf.getPageCount()}`);
    } catch { setPageCount(0); }
  }, []);

  const extractPages = useCallback(async () => {
    if (files.length === 0 || !pagesToExtract) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const extractSet = new Set<number>();

      pagesToExtract.split(",").forEach((part) => {
        const trimmed = part.trim();
        const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
        if (rangeMatch) {
          for (let i = parseInt(rangeMatch[1]); i <= parseInt(rangeMatch[2]); i++) {
            extractSet.add(i - 1);
          }
        } else {
          const num = parseInt(trimmed);
          if (!isNaN(num)) extractSet.add(num - 1);
        }
      });

      const indices = Array.from(extractSet).filter((i) => i >= 0 && i < pdf.getPageCount()).sort((a, b) => a - b);
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(pdf, indices);
      pages.forEach((p) => newPdf.addPage(p));

      const result = await newPdf.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `extracted-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Extract failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, pagesToExtract]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={["Upload your PDF", "Specify pages to extract", "Download extracted pages"]}
      faqs={[
        { q: "What format is the output?", a: "Extracted pages are saved as a new PDF file." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload accept=".pdf" onFilesSelected={handleFilesSelected} files={files} onRemoveFile={() => { setFiles([]); setPageCount(0); }} />
        {pageCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Total pages: <span className="text-foreground font-medium">{pageCount}</span></p>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Pages to extract:</label>
              <input data-testid="input-pages-extract" type="text" value={pagesToExtract} onChange={(e) => setPagesToExtract(e.target.value)} placeholder="e.g., 1-3, 5" className="w-full px-3 py-2.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
            </div>
            <Button data-testid="button-extract" onClick={extractPages} disabled={processing} className="w-full" size="lg">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Extracting...</> : <><FileOutput className="w-4 h-4 mr-2" />Extract & Download</>}
            </Button>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
