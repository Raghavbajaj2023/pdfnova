import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, RotateCw } from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("rotate-pdf")!;

const rotationOptions = [
  { label: "90° Clockwise", value: 90 },
  { label: "180°", value: 180 },
  { label: "90° Counter-clockwise", value: 270 },
];

export default function RotatePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
  }, []);

  const rotatePdf = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        page.setRotation(degrees(page.getRotation().angle + rotation));
      });

      const rotatedBytes = await pdf.save();
      const blob = new Blob([rotatedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rotated-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Rotation failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, rotation]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        "Upload your PDF file",
        "Choose rotation angle",
        "Download the rotated PDF",
      ]}
      faqs={[
        { q: "Can I rotate specific pages?", a: "Currently, rotation applies to all pages. Use the PDF editor for page-specific rotation." },
        { q: "Does rotation change the content?", a: "No, rotation only changes the page orientation. All content remains intact." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept=".pdf"
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
        />

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Rotation:</label>
              <div className="flex gap-2 flex-wrap">
                {rotationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    data-testid={`button-rotate-${opt.value}`}
                    onClick={() => setRotation(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      rotation === opt.value
                        ? "bg-primary text-foreground"
                        : "bg-black/[0.04] dark:bg-white/5 text-muted-foreground hover:bg-white/10"
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5 inline mr-1.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              data-testid="button-rotate"
              onClick={rotatePdf}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rotating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Rotate & Download
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
