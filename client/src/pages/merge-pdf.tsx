import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, GripVertical } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("merge-pdf")!;

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const moveFile = useCallback((from: number, to: number) => {
    setFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const mergePdfs = useCallback(async () => {
    if (files.length < 2) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Merge failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        "Upload two or more PDF files",
        "Drag to reorder if needed",
        "Click merge and download your combined PDF",
      ]}
      faqs={[
        { q: "How many PDFs can I merge?", a: "You can merge as many PDFs as you need. All processing happens in your browser." },
        { q: "Will the merged PDF lose quality?", a: "No. The merge process preserves all content, formatting, and quality of the original files." },
        { q: "Is there a file size limit?", a: "There are no file size limits. Process files of any size directly in your browser." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept=".pdf"
          multiple
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={removeFile}
          label="Drop PDF files here or click to browse"
        />

        {files.length >= 2 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Reorder by clicking arrows:</p>
            {files.map((file, i) => (
              <div key={`order-${i}`} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
                <div className="flex gap-1">
                  {i > 0 && (
                    <button
                      data-testid={`button-move-up-${i}`}
                      onClick={() => moveFile(i, i - 1)}
                      className="text-xs text-muted-foreground hover:text-foreground px-1"
                    >
                      Up
                    </button>
                  )}
                  {i < files.length - 1 && (
                    <button
                      data-testid={`button-move-down-${i}`}
                      onClick={() => moveFile(i, i + 1)}
                      className="text-xs text-muted-foreground hover:text-foreground px-1"
                    >
                      Down
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              data-testid="button-merge"
              onClick={mergePdfs}
              disabled={processing}
              className="w-full btn-glow"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Merge & Download
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
