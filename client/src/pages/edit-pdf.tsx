import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2, Type, Pencil, Highlighter, Square, ImagePlus,
  MessageSquare, PenTool, Eraser, Download, Upload, ZoomIn, ZoomOut,
  RotateCw, Undo2, Redo2, ChevronLeft, FileText, Loader2
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { UpgradeModal } from "@/components/upgrade-modal";
import { canPerformAction, recordAction } from "@/lib/usage-tracker";
import { Link } from "wouter";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

type EditorTool = "select" | "text" | "draw" | "highlight" | "shapes" | "images" | "comment" | "signature" | "erase";

const editorTools: { id: EditorTool; icon: any; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Text" },
  { id: "draw", icon: Pencil, label: "Draw" },
  { id: "highlight", icon: Highlighter, label: "Highlight" },
  { id: "shapes", icon: Square, label: "Shapes" },
  { id: "images", icon: ImagePlus, label: "Images" },
  { id: "comment", icon: MessageSquare, label: "Comment" },
  { id: "signature", icon: PenTool, label: "Signature" },
  { id: "erase", icon: Eraser, label: "Erase" },
];

interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  page: number;
}

interface DrawPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  page: number;
}

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [drawPaths, setDrawPaths] = useState<DrawPath[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[] | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: zoom * 1.5 });
    const canvas = canvasRef.current;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  }, [pdfDoc, zoom]);

  useEffect(() => {
    if (pdfDoc) renderPage(currentPage);
  }, [pdfDoc, currentPage, zoom, renderPage]);

  const loadPdf = useCallback(async (f: File) => {
    setFile(f);
    const bytes = await f.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
    setPdfDoc(doc);
    setTotalPages(doc.numPages);
    setCurrentPage(1);
    setTextAnnotations([]);
    setDrawPaths([]);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) loadPdf(e.target.files[0]);
  }, [loadPdf]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "text" || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    const id = Date.now().toString();
    setTextAnnotations((prev) => [
      ...prev,
      { id, x, y, text: "Text", fontSize: 16, color: "#000000", page: currentPage },
    ]);
    setEditingText(id);
  }, [activeTool, currentPage, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "draw" && activeTool !== "highlight") return;
    if (!overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  }, [activeTool, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !overlayRef.current || !currentPath) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setCurrentPath((prev) => prev ? [...prev, { x, y }] : [{ x, y }]);
  }, [isDrawing, currentPath, zoom]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentPath || currentPath.length < 2) {
      setIsDrawing(false);
      setCurrentPath(null);
      return;
    }

    const newPath: DrawPath = {
      id: Date.now().toString(),
      points: currentPath,
      color: activeTool === "highlight" ? "rgba(255, 255, 0, 0.3)" : "#000000",
      width: activeTool === "highlight" ? 20 : 2,
      page: currentPage,
    };

    setDrawPaths((prev) => [...prev, newPath]);
    setIsDrawing(false);
    setCurrentPath(null);
  }, [isDrawing, currentPath, activeTool, currentPage]);

  const exportPdf = useCallback(async () => {
    if (!file) return;
    if (!canPerformAction()) { setShowUpgrade(true); return; }

    setProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      const scale = 1.5;

      for (const ann of textAnnotations) {
        const page = pdf.getPage(ann.page - 1);
        const { height } = page.getSize();
        page.drawText(ann.text, {
          x: ann.x / scale,
          y: height - ann.y / scale,
          size: ann.fontSize / scale,
          font,
          color: rgb(0, 0, 0),
        });
      }

      for (const path of drawPaths) {
        if (path.points.length < 2) continue;
        const page = pdf.getPage(path.page - 1);
        const { height } = page.getSize();
        const isHighlight = path.color.includes("yellow") || path.color.includes("255, 255, 0");
        const lineColor = isHighlight ? rgb(1, 1, 0) : rgb(0, 0, 0);
        const lineOpacity = isHighlight ? 0.3 : 1;

        for (let i = 1; i < path.points.length; i++) {
          const p1 = path.points[i - 1];
          const p2 = path.points[i];
          page.drawLine({
            start: { x: p1.x / scale, y: height - p1.y / scale },
            end: { x: p2.x / scale, y: height - p2.y / scale },
            thickness: path.width / scale,
            color: lineColor,
            opacity: lineOpacity,
          });
        }
      }

      const result = await pdf.save();
      const blob = new Blob([result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      recordAction();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setProcessing(false);
    }
  }, [file, textAnnotations, drawPaths]);

  if (!file) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full mx-auto px-4"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h1 data-testid="text-editor-title" className="text-3xl font-bold text-foreground mb-3">
                PDF Editor
              </h1>
              <p className="text-muted-foreground">
                Full-featured PDF editor. Add text, draw, highlight, and more.
              </p>
            </div>

            <motion.label
              data-testid="dropzone-editor-upload"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex flex-col items-center justify-center w-full min-h-[220px] rounded-xl border-2 border-dashed border-black/5 dark:border-white/10 hover:border-primary/40 bg-white/[0.02] cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                data-testid="input-editor-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-primary mb-3" />
              <p className="text-sm font-medium text-foreground">Drop your PDF here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </motion.label>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-12 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-4 px-4 bg-background/95 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">PDF<span className="text-primary">NOVA</span></span>
            </span>
          </Link>
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{file.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 rounded-lg px-2 py-1">
            <button data-testid="button-zoom-out" onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="text-muted-foreground hover:text-foreground p-1">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-foreground min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
            <button data-testid="button-zoom-in" onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="text-muted-foreground hover:text-foreground p-1">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/5 rounded-lg px-2 py-1">
            <button data-testid="button-prev-page" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-foreground min-w-[60px] text-center">{currentPage} / {totalPages}</span>
            <button data-testid="button-next-page" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="text-muted-foreground hover:text-foreground p-1 disabled:opacity-30 rotate-180">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <Button data-testid="button-export" onClick={exportPdf} disabled={processing} size="sm">
          {processing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
          Export PDF
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-14 border-r border-black/5 dark:border-white/5 flex flex-col items-center py-3 gap-1 bg-background/95">
          {editorTools.map((tool) => (
            <button
              key={tool.id}
              data-testid={`button-tool-${tool.id}`}
              onClick={() => setActiveTool(tool.id)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeTool === tool.id
                  ? "bg-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/5"
              }`}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-auto flex items-start justify-center p-8 bg-gray-100 dark:bg-[rgba(10,15,30,0.8)]"
        >
          <div
            ref={overlayRef}
            className="relative shadow-2xl"
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas ref={canvasRef} className="block" />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
              {drawPaths
                .filter((p) => p.page === currentPage)
                .map((path) => (
                  <polyline
                    key={path.id}
                    points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={path.color}
                    strokeWidth={path.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              {currentPath && currentPath.length > 1 && (
                <polyline
                  points={currentPath.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={activeTool === "highlight" ? "rgba(255, 255, 0, 0.3)" : "#000000"}
                  strokeWidth={activeTool === "highlight" ? 20 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>

            {textAnnotations
              .filter((ann) => ann.page === currentPage)
              .map((ann) => (
                <div
                  key={ann.id}
                  className="absolute"
                  style={{ left: ann.x, top: ann.y }}
                >
                  {editingText === ann.id ? (
                    <input
                      data-testid={`input-annotation-${ann.id}`}
                      type="text"
                      value={ann.text}
                      onChange={(e) =>
                        setTextAnnotations((prev) =>
                          prev.map((a) => (a.id === ann.id ? { ...a, text: e.target.value } : a))
                        )
                      }
                      onBlur={() => setEditingText(null)}
                      onKeyDown={(e) => e.key === "Enter" && setEditingText(null)}
                      autoFocus
                      className="bg-white/90 text-black px-1 py-0.5 text-sm border border-primary rounded outline-none min-w-[60px]"
                      style={{ fontSize: ann.fontSize }}
                    />
                  ) : (
                    <span
                      onClick={(e) => { e.stopPropagation(); setEditingText(ann.id); }}
                      className="cursor-text select-none text-black"
                      style={{ fontSize: ann.fontSize }}
                    >
                      {ann.text}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="w-52 border-l border-black/5 dark:border-white/5 p-4 bg-background/95">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Properties</h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Active Tool</p>
              <p className="text-sm text-foreground font-medium capitalize">{activeTool}</p>
            </div>

            {activeTool === "text" && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Click on the canvas to add text. Click text to edit.</p>
              </div>
            )}

            {(activeTool === "draw" || activeTool === "highlight") && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">Click and drag on the canvas to {activeTool}.</p>
              </div>
            )}

            {activeTool === "select" && (
              <p className="text-xs text-muted-foreground">Select and move elements on the canvas.</p>
            )}

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <p className="text-xs text-muted-foreground mb-2">Annotations</p>
              <p className="text-xs text-muted-foreground">
                {textAnnotations.length} text, {drawPaths.length} drawings
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <p className="text-xs text-muted-foreground mb-2">Document</p>
              <p className="text-xs text-muted-foreground">{totalPages} pages</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
          </div>
        </div>
      </div>

      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
