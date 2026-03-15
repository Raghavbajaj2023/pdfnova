import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("organize-pages")!;

export default function OrganizePagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback(async (newFiles: File[]) => {
    const file = newFiles[0];
    setFiles([file]);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageOrder(Array.from({ length: pdf.getPageCount() }, (_, i) => i));
    } catch {
      setPageOrder([]);
    }
  }, []);

  const movePage = useCallback((from: number, to: number) => {
    setPageOrder((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      return updated;
    });
  }, []);

  const organizePdf = useCallback(async () => {
    if (files.length === 0 || pageOrder.length === 0) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const sourcePdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(sourcePdf, pageOrder);
      pages.forEach((p) => newPdf.addPage(p));

      const result = await newPdf.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `organized-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Organize failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, pageOrder]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={["Upload your PDF", "Drag pages to reorder", "Download reorganized PDF"]}
      faqs={[
        { q: "Can I also delete pages while organizing?", a: "Use the Delete Pages tool to remove unwanted pages first, then organize the remaining ones." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload accept=".pdf" onFilesSelected={handleFilesSelected} files={files} onRemoveFile={() => { setFiles([]); setPageOrder([]); }} />

        {pageOrder.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">Reorder pages:</p>
            <div className="space-y-1.5">
              {pageOrder.map((pageIdx, i) => (
                <div key={`${pageIdx}-${i}`} className="flex items-center gap-3 p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground flex-1">Page {pageIdx + 1}</span>
                  <div className="flex gap-1">
                    {i > 0 && (
                      <button data-testid={`button-page-up-${i}`} onClick={() => movePage(i, i - 1)} className="p-1 text-muted-foreground hover:text-foreground">
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {i < pageOrder.length - 1 && (
                      <button data-testid={`button-page-down-${i}`} onClick={() => movePage(i, i + 1)} className="p-1 text-muted-foreground hover:text-foreground">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button data-testid="button-organize" onClick={organizePdf} disabled={processing} className="w-full" size="lg">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Organizing...</> : <><Download className="w-4 h-4 mr-2" />Save & Download</>}
            </Button>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
