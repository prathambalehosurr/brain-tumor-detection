import { useRef, useState } from 'react';
import { Hero3D } from './components/Hero3D';
import { UploadPanel } from './components/UploadPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { HowItWorks } from './components/HowItWorks';
import { StatsSection } from './components/StatsSection';
import { Footer } from './components/Footer';
import type { PredictResponse } from './api';

function App() {
  const uploadRef = useRef<HTMLDivElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [resultData, setResultData] = useState<PredictResponse | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadStart = () => {
    setIsScanning(true);
    setResultData(null);
  };

  const handleUploadSuccess = (data: PredictResponse, file: File) => {
    setIsScanning(false);
    setResultData(data);
    setCurrentFile(file);
    // Slight delay before scrolling to results (which replace the upload panel)
    setTimeout(() => {
      uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleUploadError = (_error: string) => {
    setIsScanning(false);
    // Error is handled inside UploadPanel visually
  };

  const handleReset = () => {
    setResultData(null);
    setCurrentFile(null);
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-background text-gray-200">
      <Hero3D onScrollToUpload={scrollToUpload} scanning={isScanning} />
      
      <main className="relative z-10 bg-background">
        <section ref={uploadRef} className="py-24 px-4 min-h-[80vh] flex items-center justify-center">
          <div className="w-full">
            {resultData ? (
              <ResultsPanel data={resultData} file={currentFile} onReset={handleReset} />
            ) : (
              <UploadPanel 
                onUploadStart={handleUploadStart}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            )}
          </div>
        </section>
        
        <HowItWorks />
        <StatsSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
