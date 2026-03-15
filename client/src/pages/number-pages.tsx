import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Loader2, Hash } from "lucide-react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { UpgradeModal } from "@/components/upgrade-modal";
import { getToolById } from "@/lib/tools-data";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";

const tool = getToolById("number-pages")!;

export default function NumberPagesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<"bottom-center" | "bottom-right" | "top-center">("bottom-center");
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles([newFiles[0]]);
  }, []);

  const numberPages = useCallback(async () => {
    if (files.length === 0) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let x = width / 2 - textWidth / 2;
        let y = 30;

        if (position === "bottom-right") { x = width - textWidth - 40; y = 30; }
        else if (position === "top-center") { x = width / 2 - textWidth / 2; y = height - 40; }

        page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.4, 0.4, 0.4) });
      });

      const result = await pdf.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `numbered-${files[0].name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Numbering failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [files, position]);

  const positions = [
    { id: "bottom-center" as const, label: "Bottom Center" },
    { id: "bottom-right" as const, label: "Bottom Right" },
    { id: "top-center" as const, label: "Top Center" },
  ];

  return (
    <ToolPageLayout
      tool={tool}
      steps={["Upload your PDF", "Choose position for page numbers", "Download numbered PDF"]}
      faqs={[{ q: "Can I choose the starting number?", a: "Currently numbering starts from 1. Custom starting numbers will be available soon." }]}
    >
      <div className="glass-card-premium rounded-2xl p-6">
        <FileUpload accept=".pdf" onFilesSelected={handleFilesSelected} files={files} onRemoveFile={() => setFiles([])} />
        {files.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2">Position:</label>
              <div className="flex gap-2 flex-wrap">
                {positions.map((pos) => (
                  <button key={pos.id} data-testid={`button-position-${pos.id}`} onClick={() => setPosition(pos.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${position === pos.id ? "bg-primary text-foreground" : "bg-black/[0.04] dark:bg-white/5 text-muted-foreground hover:bg-white/10"}`}>{pos.label}</button>
                ))}
              </div>
            </div>
            <Button data-testid="button-number" onClick={numberPages} disabled={processing} className="w-full" size="lg">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Numbering...</> : <><Hash className="w-4 h-4 mr-2" />Add Numbers & Download</>}
            </Button>
          </motion.div>
        )}
      </div>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </ToolPageLayout>
  );
}
