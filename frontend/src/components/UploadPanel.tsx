import { useCallback, useState } from 'react';
import { Upload, AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadPanelProps {
  onUploadStart: () => void;
  onUploadSuccess: (data: any, file: File) => void;
  onUploadError: (error: string, file?: File) => void;
}

export function UploadPanel({ onUploadStart, onUploadSuccess, onUploadError }: UploadPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateAndProcess = async (file: File) => {
    setErrorMsg(null);
    setCurrentFile(file);
    
    if (!file.type.startsWith('image/')) {
      const err = 'Invalid file type. Please upload a valid DICOM, JPEG, or PNG image.';
      setErrorMsg(err);
      onUploadError(err);
      return;
    }

    setIsUploading(true);
    onUploadStart();
    
    try {
      const { predictTumor } = await import('../api');
      const data = await predictTumor(file);
      setIsUploading(false);
      onUploadSuccess(data, file);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg(err.message || 'System Error: Connection failed.');
      onUploadError(err.message || 'System Error', file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcess(e.target.files[0]);
    }
  };

  const handleRetry = () => {
    if (currentFile) {
      validateAndProcess(currentFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel dicom-border p-8 rounded-lg relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <h2 className="text-xl font-mono text-gray-300 uppercase tracking-widest">Select Scan</h2>
        <span className="text-xs font-mono text-medicalTeal bg-medicalTeal/10 px-2 py-1 rounded">SYS_READY</span>
      </div>

      <AnimatePresence mode="wait">
        {errorMsg ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-red-500/50 bg-red-950/30 p-6 rounded flex flex-col items-center justify-center text-center"
          >
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 font-mono mb-6">{errorMsg}</p>
            <div className="flex gap-4">
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-900/50 hover:bg-red-800/50 text-red-200 px-4 py-2 font-mono text-sm transition-colors border border-red-700/50"
              >
                <RefreshCcw className="w-4 h-4" /> RETRY UPLOAD
              </button>
              <button 
                onClick={() => setErrorMsg(null)}
                className="flex items-center gap-2 bg-surface text-gray-400 hover:text-gray-200 px-4 py-2 font-mono text-sm transition-colors border border-white/10"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form 
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center transition-colors ${
                dragActive ? 'border-accent bg-accent/5' : 'border-medicalGray bg-surfaceHighlight/50'
              } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleChange}
                accept="image/*"
              />
              <Upload className={`w-12 h-12 mb-4 transition-colors ${dragActive ? 'text-accent' : 'text-gray-500'}`} />
              <p className="font-sans text-gray-300 text-lg mb-2">
                Drag and drop MRI scan here
              </p>
              <p className="font-mono text-sm text-gray-500">
                or click to browse local files (DICOM, PNG, JPEG)
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {isUploading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-64 h-1 bg-medicalGray overflow-hidden relative mb-4">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-accent"
              initial={{ width: '0%', left: '0%' }}
              animate={{ width: ['0%', '100%', '0%'], left: ['0%', '0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <p className="font-mono text-accent text-sm tracking-widest animate-pulse">ANALYZING TENSOR DATA...</p>
        </div>
      )}
    </div>
  );
}
