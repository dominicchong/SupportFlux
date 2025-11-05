import { useState, useRef } from "react";

export const PreviewImage = ({ previewImage, setPreviewImage }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleImageClick = (e) => {
    e.stopPropagation();

    const container = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - container.left - container.width / 2;
    const clickY = e.clientY - container.top - container.height / 2;

    if (!isZoomed) {
      // Make zoom center relative to click position
      const zoomFactor = 2;
      setScale(zoomFactor);
      setOffset({
        x: -clickX * (zoomFactor - 1) * 0.6, // multiplier for natural feel when hover zoom
        y: -clickY * (zoomFactor - 1) * 0.6,
      });
      setIsZoomed(true);
    } else {
      // Zoom out to reset
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setIsZoomed(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const container = containerRef.current.getBoundingClientRect();
    const moveX = e.clientX - (container.left + container.width / 2);
    const moveY = e.clientY - (container.top + container.height / 2);

    // The movement multiplier controls how much the image moves
    const moveStrength = 0.75; 
    setOffset({
      x: -moveX * moveStrength,
      y: -moveY * moveStrength,
    });
  };

  if (!previewImage) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 cursor-zoom-in"
      onClick={() => setPreviewImage(null)} // click background to close
      onMouseMove={handleMouseMove}
    >
      <img
        src={previewImage}
        alt="Preview"
        onClick={handleImageClick} // click image to zoom in/out
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: isZoomed ? "transform 0.2s ease-out" : "transform 0.15s ease-in",
          cursor: isZoomed ? "zoom-out" : "zoom-in",
        }}
        className="max-w-full max-h-full rounded-lg shadow-lg select-none"
        draggable="false"
      />
    </div>
  );
};
