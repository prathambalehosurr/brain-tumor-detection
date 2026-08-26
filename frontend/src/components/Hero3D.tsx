import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { BrainModel, AmbientParticles } from './BrainModel';
import { motion } from 'framer-motion';

interface Hero3DProps {
  onScrollToUpload: () => void;
  scanning: boolean;
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center font-mono text-accent text-sm tracking-widest">
      LOADING ASSETS...
    </div>
  );
}

export function Hero3D({ onScrollToUpload, scanning }: Hero3DProps) {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<Loader />}>
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <BrainModel />
            <AmbientParticles />
          </Canvas>
        </Suspense>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-sans font-light tracking-tight text-white mb-4">
            AI-Powered <span className="font-medium">Neurological Screening</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Advanced multi-class tumor classification using Dual-Branch ResNet-50. 
            Designed for clinical precision and rapid automated diagnostics.
          </p>
          
          <button 
            onClick={onScrollToUpload}
            className="pointer-events-auto group relative inline-flex items-center justify-center px-8 py-3 font-mono text-sm tracking-widest text-black bg-medicalTeal hover:bg-accent transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 font-bold">INITIALIZE SCANNER</span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs font-mono text-gray-500 tracking-widest">SCROLL</span>
        <motion.div 
          className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"
          animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
