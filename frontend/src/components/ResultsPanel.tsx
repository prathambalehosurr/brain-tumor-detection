import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight, Activity } from 'lucide-react';
import type { PredictResponse } from '../api';

interface ResultsPanelProps {
  data: PredictResponse;
  file: File | null;
  onReset: () => void;
}

export function ResultsPanel({ data, file, onReset }: ResultsPanelProps) {
  const imageUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return null;
  }, [file]);

  const sortedProbs = useMemo(() => {
    return Object.entries(data.all_probs)
      .map(([label, prob]) => ({ label, prob }))
      .sort((a, b) => b.prob - a.prob);
  }, [data.all_probs]);

  const isLowConfidence = data.confidence < 60;

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel dicom-border rounded-lg overflow-hidden flex flex-col md:flex-row">
      {/* Left side: Image Viewer */}
      <div className="w-full md:w-1/2 bg-black relative min-h-[400px] border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4 text-xs font-mono text-gray-500">
          <span>T1_AXIAL_POST</span>
          <span>SERIES: 402</span>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center border border-white/5 overflow-hidden">
          {imageUrl && (
            <>
              <img src={imageUrl} alt="Uploaded MRI" className="object-contain w-full h-full grayscale" />
              {/* Fake crosshair/scanning UI overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-accent/20" />
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-accent/20" />
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-accent/50" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-accent/50" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-accent/50" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-accent/50" />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center text-xs font-mono text-gray-500">
          <span>ZOOM: 1.0x</span>
          <span>WW/WL: 800/400</span>
        </div>
      </div>

      {/* Right side: Analysis Results */}
      <div className="w-full md:w-1/2 bg-surfaceHighlight p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-mono text-gray-300 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" /> Analysis Complete
            </h2>
            <p className="text-sm font-mono text-gray-500">MODEL_ID: RESNET-50_DUAL</p>
          </div>
          <button 
            onClick={onReset}
            className="text-xs font-mono border border-white/10 px-3 py-1 hover:bg-white/5 transition-colors"
          >
            NEW SCAN
          </button>
        </div>

        {isLowConfidence && (
          <div className="mb-6 border border-accent/50 bg-accent/10 p-3 flex gap-3 items-start rounded">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-accent">
              INCONCLUSIVE RESULT. Primary confidence below threshold (60%). Manual radiological review highly recommended.
            </p>
          </div>
        )}

        <div className="flex-1">
          <div className="mb-8">
            <p className="text-sm font-mono text-gray-400 mb-2">PRIMARY DIAGNOSIS</p>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-sans font-light tracking-tight text-white">{data.label}</span>
              <span className={`text-xl font-mono ${isLowConfidence ? 'text-accent' : 'text-medicalTeal'}`}>
                {data.confidence.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-mono text-gray-400 border-b border-white/10 pb-2">PROBABILITY DISTRIBUTION</p>
            {sortedProbs.map((item, index) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col gap-1"
              >
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-300 uppercase">{item.label}</span>
                  <span className="text-gray-500">{item.prob.toFixed(2)}%</span>
                </div>
                <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.prob}%` }}
                    transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                    className={`h-full ${index === 0 ? (isLowConfidence ? 'bg-accent' : 'bg-medicalTeal') : 'bg-gray-700'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs font-mono text-gray-500">AUTO-GENERATED REPORT</span>
          <button className="flex items-center gap-1 text-xs font-mono text-medicalTeal hover:text-white transition-colors">
            EXPORT DICOMDIR <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
