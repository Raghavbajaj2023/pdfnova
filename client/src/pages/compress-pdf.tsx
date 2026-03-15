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

const tool = getToolById("compress-pdf")!;

export default function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
    setResult(null);
  }, []);

  const compressPdf = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const originalSize = files[0].size;
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const compressedBytes = await pdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const compressedSize = compressedBytes.length;
      setResult({ original: originalSize, compressed: compressedSize });

      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Compression failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        "Upload your PDF file",
        "Click compress to optimize",
        "Download the compressed version",
      ]}
      faqs={[
        { q: "How much can I reduce the file size?", a: "Compression results vary depending on the PDF content. Files with large images typically see the greatest reduction." },
        { q: "Will compression affect quality?", a: "Our compression optimizes the PDF structure while preserving visual quality." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept=".pdf"
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => { setFiles([]); setResult(null); }}
        />

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            {result && (
              <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-sm text-green-400 font-medium mb-1">Compression Complete</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Original: {formatSize(result.original)}</span>
                  <span>Compressed: {formatSize(result.compressed)}</span>
                  <span className="text-green-400 font-medium">
                    {Math.round((1 - result.compressed / result.original) * 100)}% smaller
                  </span>
                </div>
              </div>
            )}

            <Button
              data-testid="button-compress"
              onClick={compressPdf}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Compress & Download
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
