import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { type Tool } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

interface GenericToolPageProps {
  tool: Tool;
}

export default function GenericToolPage({ tool }: GenericToolPageProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
  }, []);

  const processFile = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) {
      setShowUpgrade(true);
      return;
    }

    setProcessing(true);
    try {
      const file = files[0];
      const bytes = await file.arrayBuffer();
      const isImage = file.type.startsWith("image/");
      let resultBytes: Uint8Array;

      if (isImage) {
        const pdf = await PDFDocument.create();
        const uint8 = new Uint8Array(bytes);
        let image;
        if (file.type === "image/png") {
          image = await pdf.embedPng(uint8);
        } else {
          image = await pdf.embedJpg(uint8);
        }
        const page = pdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        resultBytes = await pdf.save();
      } else {
        const pdf = await PDFDocument.load(bytes);
        resultBytes = await pdf.save();
      }

      const blob = new Blob([resultBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `processed-${file.name.replace(/\.[^.]+$/, "")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Processing failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const acceptTypes = tool.category === "convert" && tool.id.startsWith("jpg") ? ".jpg,.jpeg,.png" :
    tool.category === "convert" && tool.id.startsWith("png") ? ".png" :
    ".pdf";

  return (
    <ToolPageLayout
      tool={tool}
      steps={[
        `Upload your file`,
        `${tool.name} will process your document`,
        "Download the result",
      ]}
      faqs={[
        { q: `Is ${tool.name} free?`, a: "Yes! It's completely free with unlimited usage. No accounts or sign-ups required." },
        { q: "Are my files safe?", a: "All processing happens locally in your browser. Files never leave your device." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload
          accept={acceptTypes}
          onFilesSelected={handleFilesSelected}
          files={files}
          onRemoveFile={() => setFiles([])}
        />

        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              data-testid="button-process"
              onClick={processFile}
              disabled={processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {tool.name} & Download
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
