
import { motion } from 'framer-motion';
import { Cpu, Network, ScanText, FileHeart } from 'lucide-react';

const steps = [
  {
    icon: <ScanText className="w-6 h-6" />,
    title: "PRE-PROCESSING",
    desc: "DICOM/Image ingestion, normalization, and resizing to 224x224 tensor."
  },
  {
    icon: <Network className="w-6 h-6" />,
    title: "FEATURE EXTRACTION",
    desc: "Dual-branch ResNet-50 architecture extracts hierarchical spatial features."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "CLASSIFICATION",
    desc: "Fully connected layers compute probabilities across Meningioma, Glioma, and Pituitary classes."
  },
  {
    icon: <FileHeart className="w-6 h-6" />,
    title: "REPORT GENERATION",
    desc: "Confidence scoring and radiological report synthesis."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-surface border-y border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-sans font-light tracking-tight text-white mb-2">SYSTEM ARCHITECTURE</h2>
          <p className="font-mono text-sm text-gray-500">END-TO-END PIPELINE</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-background border border-white/10 flex items-center justify-center mb-6 text-gray-400 group-hover:text-medicalTeal group-hover:border-medicalTeal/50 transition-colors relative">
                  {step.icon}
                  <div className="absolute -inset-2 rounded-full border border-medicalTeal/0 group-hover:border-medicalTeal/20 transition-colors animate-pulse" />
                </div>
                <h3 className="font-mono text-sm text-gray-300 mb-2">{step.title}</h3>
                <p className="text-sm font-sans text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
