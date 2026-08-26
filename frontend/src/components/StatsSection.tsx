
import { motion } from 'framer-motion';

const stats = [
  { value: "98.4%", label: "ACCURACY (F1 SCORE)" },
  { value: "3,064", label: "MRI SCANS IN DATASET" },
  { value: "ResNet-50", label: "DUAL-BRANCH ARCHITECTURE" }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel dicom-border p-8 rounded flex flex-col items-center justify-center text-center cursor-default transition-all duration-300 hover:border-medicalTeal/50 hover:bg-surface/80"
            >
              <div className="text-4xl md:text-5xl font-sans font-light text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-gray-500 tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
