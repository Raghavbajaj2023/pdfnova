import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("split-pdf")!;

export default function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [splitRange, setSplitRange] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    const file = newFiles[0];
    setFiles([file]);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
      setSplitRange(`1-${Math.ceil(pdf.getPageCount() / 2)}, ${Math.ceil(pdf.getPageCount() / 2) + 1}-${pdf.getPageCount()}`);
    } catch {
      setPageCount(0);
    }
  }, []);

  const splitPdf = useCallback(async () => {
    if (files.length === 0 || !splitRange) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const ranges = splitRange.split(",").map((r) => r.trim());

      for (let ri = 0; ri < ranges.length; ri++) {
        const range = ranges[ri];
        const newPdf = await PDFDocument.create();
        const match = range.match(/^(\d+)\s*-\s*(\d+)$/);

        if (match) {
          const start = parseInt(match[1]) - 1;
          const end = parseInt(match[2]) - 1;
          const indices = [];
          for (let i = start; i <= Math.min(end, sourcePdf.getPageCount() - 1); i++) {
            indices.push(i);
          }
          const pages = await newPdf.copyPages(sourcePdf, indices);
          pages.forEach((p) => newPdf.addPage(p));
        } else {
          const pageNum = parseInt(range) - 1;
          if (pageNum >= 0 && pageNum < sourcePdf.getPageCount()) {
            const [page] = await newPdf.copyPages(sourcePdf, [pageNum]);
            newPdf.addPage(page);
          }
        }

        if (newPdf.getPageCount() > 0) {
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `split-part-${ri + 1}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      recordAction();
    } catch (err) {
      console.error("Split failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, splitRange]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        "Upload a PDF file",
        "Enter page ranges to split",
        "Download your split PDF files",
      ]}
      faqs={[
        { q: "How do I specify pages to split?", a: "Use comma-separated ranges like '1-3, 4-6' or individual pages like '1, 3, 5'." },
        { q: "Can I split into individual pages?", a: "Yes! Enter each page number separated by commas, like '1, 2, 3, 4'." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept=".pdf"
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => { setFiles([]); setPageCount(0); }}
          label="Drop your PDF here to split"
        />

        {pageCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total pages: <span className="text-foreground font-medium">{pageCount}</span>
              </p>
              <label className="text-sm text-muted-foreground block mb-2">
                Page ranges (comma-separated):
              </label>
              <input
                data-testid="input-split-range"
                type="text"
                value={splitRange}
                onChange={(e) => setSplitRange(e.target.value)}
                placeholder="e.g., 1-3, 4-6"
                className="w-full px-3 py-2.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <Button
              data-testid="button-split"
              onClick={splitPdf}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Splitting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Split & Download
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
