import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Image } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const tool = getToolById("pdf-to-png")!;

export default function PdfToPngPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
    setImages([]);
  }, []);

  const convertToPng = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const converted: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        converted.push(canvas.toDataURL("image/png"));
      }

      setImages(converted);
      recordAction();
    } catch (err) {
      console.error("Conversion failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files]);

  const downloadImage = useCallback((dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `page-${index + 1}.png`;
    a.click();
  }, []);

  return (
    <ToolPageLayout tool={tool} steps={["Upload your PDF", "Convert to PNG images", "Download individual or all pages"]}
      faqs={[{ q: "What's the difference vs JPG?", a: "PNG supports transparency and lossless compression, making it better for documents with sharp text and graphics." }]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload accept=".pdf" onFilesSelected={handleFilesSelected} files={files} onRemoveFile={() => { setFiles([]); setImages([]); }} />
        {files.length > 0 && images.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <Button data-testid="button-convert-png" onClick={convertToPng} disabled={processing} className="w-full" size="lg">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Converting...</> : <><Image className="w-4 h-4 mr-2" />Convert to PNG</>}
            </Button>
          </motion.div>
        )}
        {images.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{images.length} page(s) converted</p>
              <Button data-testid="button-download-all-png" onClick={() => images.forEach((img, i) => downloadImage(img, i))} size="sm">
                <Download className="w-3.5 h-3.5 mr-1.5" />Download All
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden border border-black/5 dark:border-white/5 cursor-pointer" onClick={() => downloadImage(img, i)}>
                  <img src={img} alt={`Page ${i + 1}`} className="w-full" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white">Page {i + 1}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
