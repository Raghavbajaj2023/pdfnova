import { motion } from "framer-motion";
import { Upload, FileText, X, CloudUpload } from "lucide-react";
import { useCallback, useState } from "react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected: (files: File[]) => void;
  files?: File[];
  onRemoveFile?: (index: number) => void;
  label?: string;
}

export function FileUpload({
  accept = ".pdf",
  multiple = false,
  maxSize = Infinity,
  onFilesSelected,
  files = [],
  onRemoveFile,
  label = "Drop your PDF here or click to browse",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = Array.from(e.dataTransfer.files).filter(
        (f) => f.size <= maxSize
      );
      if (dropped.length > 0) {
        onFilesSelected(multiple ? dropped : [dropped[0]]);
      }
    },
    [maxSize, multiple, onFilesSelected]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selected = Array.from(e.target.files).filter(
          (f) => f.size <= maxSize
        );
        if (selected.length > 0) {
          onFilesSelected(multiple ? selected : [selected[0]]);
        }
      }
    },
    [maxSize, multiple, onFilesSelected]
  );

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="w-full">
      <motion.label
        data-testid="dropzone-upload"
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className={`relative flex flex-col items-center justify-center w-full min-h-[220px] rounded-2xl border-2 border-dashed transition-all duration-400 cursor-pointer ${
          isDragOver
            ? "border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/10"
            : "border-black/10 dark:border-white/10 hover:border-violet-500/30 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
        }`}
      >
        <input
          data-testid="input-file-upload"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          animate={isDragOver ? { scale: 1.08, y: -8 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center gap-4 p-6"
        >
          <motion.div
            animate={isDragOver ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/10 border border-violet-500/10 flex items-center justify-center"
          >
            <CloudUpload className={`w-7 h-7 transition-colors duration-300 ${isDragOver ? "text-violet-500 dark:text-violet-300" : "text-violet-500 dark:text-violet-400"}`} />
          </motion.div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground mb-1">{label}</p>
            <p className="text-xs text-muted-foreground">Supports PDF files — no size limits</p>
          </div>
        </motion.div>
      </motion.label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <motion.div
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 hover:border-primary/10 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-violet-500 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              {onRemoveFile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  data-testid={`button-remove-file-${i}`}
                  onClick={() => onRemoveFile(i)}
                  className="w-7 h-7 rounded-lg bg-black/[0.03] dark:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
