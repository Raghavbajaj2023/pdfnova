import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, FileText } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("jpg-to-pdf")!;

export default function JpgToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const convertToPdf = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const uint8 = new Uint8Array(bytes);

        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(uint8);
        } else {
          image = await pdf.embedJpg(uint8);
        }

        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images-to-pdf.pdf";
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Conversion failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        "Upload one or more images",
        "Reorder images if needed",
        "Click convert and download your PDF",
      ]}
      faqs={[
        { q: "What image formats are supported?", a: "JPG, JPEG, and PNG images are supported." },
        { q: "Can I control the page size?", a: "Pages are automatically sized to match each image's dimensions." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept=".jpg,.jpeg,.png"
          multiple
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={removeFile}
          label="Drop images here (JPG, PNG)"
        />

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              data-testid="button-convert-to-pdf"
              onClick={convertToPdf}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Convert to PDF
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
