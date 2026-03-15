import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Droplets } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("add-watermark")!;

export default function AddWatermarkPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
  }, []);

  const addWatermark = useCallback(async () => {
    if (files.length === 0 || !watermarkText) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      const pages = pdf.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        const fontSize = Math.min(width, height) * 0.08;
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

        page.drawText(watermarkText, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity,
          rotate: { type: "degrees" as any, angle: -45 },
        });
      });

      const result = await pdf.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `watermarked-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Watermark failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, watermarkText, opacity]);

  return (
    <ToolPageLayout
      tool={tool}
      steps={["Upload your PDF", "Customize your watermark", "Download watermarked PDF"]}
      faqs={[
        { q: "Can I customize the watermark?", a: "Yes, you can set custom text and adjust the opacity." },
      ]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload accept=".pdf" onFilesSelected={handleFilesSelected} files={files} onRemoveFile={() => setFiles([])} />
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Watermark text:</label>
              <input data-testid="input-watermark-text" type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-black/5 dark:border-white/10 text-foreground text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Opacity: {Math.round(opacity * 100)}%</label>
              <input data-testid="input-watermark-opacity" type="range" min="0.05" max="0.8" step="0.05" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-primary" />
            </div>
            <Button data-testid="button-watermark" onClick={addWatermark} disabled={processing} className="w-full" size="lg">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Adding Watermark...</> : <><Droplets className="w-4 h-4 mr-2" />Add Watermark & Download</>}
            </Button>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
