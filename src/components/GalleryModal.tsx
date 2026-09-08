import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GalleryImage {
  src: string;
  alt: string;
  spanClass: string;
}

interface GalleryModalProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GalleryModal({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: GalleryModalProps) {
  // Keypress event handler
  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, onNext, onPrev, onClose]);

  if (currentIndex === null) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface hover:text-primary transition-colors flex items-center justify-center bg-white/10 hover:bg-white/20 p-3 rounded-full z-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 md:left-8 text-on-surface hover:text-primary transition-colors flex items-center justify-center bg-white/10 hover:bg-white/20 p-4 rounded-full z-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px]">arrow_back_ios</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 md:right-8 text-on-surface hover:text-primary transition-colors flex items-center justify-center bg-white/10 hover:bg-white/20 p-4 rounded-full z-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[32px]">arrow_forward_ios</span>
        </button>

        {/* Image Content Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
          />
          <div className="text-center mt-4">
            <h4 className="font-headline-md text-xl text-primary font-bold">
              {currentImage.alt}
            </h4>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
