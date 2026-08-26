

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/5 bg-background text-center">
      <div className="max-w-4xl mx-auto px-4">
        <p className="font-mono text-xs text-gray-600 mb-2">
          FOR RESEARCH AND EDUCATIONAL PURPOSES ONLY.
        </p>
        <p className="font-sans text-xs text-gray-700 max-w-2xl mx-auto">
          This application is a demonstration of AI classification capabilities using the Dual-Branch ResNet-50 architecture. 
          It is not a diagnostic tool, medical device, or replacement for professional radiological analysis. 
          Always consult a qualified healthcare provider for medical diagnosis and treatment.
        </p>
      </div>
    </footer>
  );
}
