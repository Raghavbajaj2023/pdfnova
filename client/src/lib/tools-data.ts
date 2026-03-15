import {
  FileText, Merge, Scissors, Archive, RotateCw, Trash2, FileOutput, GripVertical,
  FileType, Image, FileSpreadsheet, Presentation, Code,
  Type, MessageSquare, Highlighter, Pencil, ImagePlus, Droplets,
  Lock, Unlock, EyeOff,
  PenTool, Send,
  Hash, Wrench, Crop,
  LucideIcon
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  path: string;
  color: string;
  keywords: string[];
}

export const toolCategories = [
  { id: "core", name: "Core Tools", description: "Essential PDF operations" },
  { id: "convert", name: "Conversion", description: "Convert between formats" },
  { id: "edit", name: "Editing", description: "Modify your PDFs" },
  { id: "security", name: "Security", description: "Protect your documents" },
  { id: "sign", name: "Signatures", description: "Sign and request signatures" },
  { id: "utility", name: "Utilities", description: "Additional PDF tools" },
];

export const tools: Tool[] = [
  { id: "edit-pdf", name: "PDF Editor", description: "Full-featured PDF editor with text, images, and annotations", icon: FileText, category: "core", path: "/edit-pdf", color: "#6366f1", keywords: ["edit pdf online", "pdf editor"] },
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDF files into a single document", icon: Merge, category: "core", path: "/merge-pdf", color: "#8b5cf6", keywords: ["merge pdf", "combine pdf"] },
  { id: "split-pdf", name: "Split PDF", description: "Split a PDF into multiple separate files", icon: Scissors, category: "core", path: "/split-pdf", color: "#ec4899", keywords: ["split pdf", "separate pdf"] },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size while maintaining quality", icon: Archive, category: "core", path: "/compress-pdf", color: "#f59e0b", keywords: ["compress pdf", "reduce pdf size"] },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate PDF pages to any angle", icon: RotateCw, category: "core", path: "/rotate-pdf", color: "#14b8a6", keywords: ["rotate pdf"] },
  { id: "delete-pages", name: "Delete Pages", description: "Remove unwanted pages from your PDF", icon: Trash2, category: "core", path: "/delete-pages", color: "#ef4444", keywords: ["delete pdf pages"] },
  { id: "extract-pages", name: "Extract Pages", description: "Extract specific pages from a PDF", icon: FileOutput, category: "core", path: "/extract-pages", color: "#22c55e", keywords: ["extract pdf pages"] },
  { id: "organize-pages", name: "Organize Pages", description: "Reorder and organize PDF pages", icon: GripVertical, category: "core", path: "/organize-pages", color: "#3b82f6", keywords: ["organize pdf pages"] },

  { id: "pdf-to-jpg", name: "PDF to JPG", description: "Convert PDF pages to JPG images", icon: Image, category: "convert", path: "/pdf-to-jpg", color: "#f97316", keywords: ["pdf to jpg", "pdf to image"] },
  { id: "jpg-to-pdf", name: "JPG to PDF", description: "Convert JPG images to PDF", icon: FileText, category: "convert", path: "/jpg-to-pdf", color: "#06b6d4", keywords: ["jpg to pdf", "image to pdf"] },
  { id: "pdf-to-png", name: "PDF to PNG", description: "Convert PDF pages to PNG images", icon: Image, category: "convert", path: "/pdf-to-png", color: "#a855f7", keywords: ["pdf to png"] },
  { id: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images to PDF", icon: FileText, category: "convert", path: "/png-to-pdf", color: "#10b981", keywords: ["png to pdf"] },
  { id: "html-to-pdf", name: "HTML to PDF", description: "Convert HTML content to PDF", icon: Code, category: "convert", path: "/html-to-pdf", color: "#6366f1", keywords: ["html to pdf"] },

  { id: "add-text", name: "Add Text", description: "Add text to any page of your PDF", icon: Type, category: "edit", path: "/add-text", color: "#8b5cf6", keywords: ["add text to pdf"] },
  { id: "annotate-pdf", name: "Annotate PDF", description: "Add annotations and comments to PDF", icon: MessageSquare, category: "edit", path: "/annotate-pdf", color: "#f59e0b", keywords: ["annotate pdf"] },
  { id: "highlight-pdf", name: "Highlight PDF", description: "Highlight text and sections in PDF", icon: Highlighter, category: "edit", path: "/highlight-pdf", color: "#eab308", keywords: ["highlight pdf"] },
  { id: "draw-on-pdf", name: "Draw on PDF", description: "Draw freely on your PDF documents", icon: Pencil, category: "edit", path: "/draw-on-pdf", color: "#ec4899", keywords: ["draw on pdf"] },
  { id: "add-images", name: "Add Images", description: "Insert images into your PDF", icon: ImagePlus, category: "edit", path: "/add-images", color: "#14b8a6", keywords: ["add images to pdf"] },
  { id: "add-watermark", name: "Add Watermark", description: "Add custom watermarks to PDF pages", icon: Droplets, category: "edit", path: "/add-watermark", color: "#3b82f6", keywords: ["add watermark to pdf"] },

  { id: "protect-pdf", name: "Protect PDF", description: "Add password protection to your PDF", icon: Lock, category: "security", path: "/protect-pdf", color: "#22c55e", keywords: ["protect pdf", "password pdf"] },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Remove password from PDF files", icon: Unlock, category: "security", path: "/unlock-pdf", color: "#ef4444", keywords: ["unlock pdf", "remove password pdf"] },
  { id: "redact-pdf", name: "Redact PDF", description: "Permanently redact sensitive information", icon: EyeOff, category: "security", path: "/redact-pdf", color: "#1e293b", keywords: ["redact pdf"] },

  { id: "sign-pdf", name: "Sign PDF", description: "Add your signature to PDF documents", icon: PenTool, category: "sign", path: "/sign-pdf", color: "#6366f1", keywords: ["sign pdf", "e-sign pdf"] },
  { id: "request-signature", name: "Request Signature", description: "Send PDFs for others to sign", icon: Send, category: "sign", path: "/request-signature", color: "#8b5cf6", keywords: ["request signature"] },

  { id: "number-pages", name: "Number Pages", description: "Add page numbers to your PDF", icon: Hash, category: "utility", path: "/number-pages", color: "#f59e0b", keywords: ["number pdf pages"] },
  { id: "repair-pdf", name: "Repair PDF", description: "Fix corrupted or damaged PDF files", icon: Wrench, category: "utility", path: "/repair-pdf", color: "#ef4444", keywords: ["repair pdf", "fix pdf"] },
  { id: "crop-pdf", name: "Crop PDF", description: "Crop and resize PDF pages", icon: Crop, category: "utility", path: "/crop-pdf", color: "#14b8a6", keywords: ["crop pdf"] },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(t => t.id === id);
}
