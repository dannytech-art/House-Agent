import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, ZoomIn, ZoomOut, Maximize2, Minimize2, Activity, Navigation } from 'lucide-react';
import { Property } from '../types';

interface AdminMapViewProps {
  properties: Property[];
  height?: string;
}

// Lagos area coordinates (normalized to 0-100 for canvas)
interface AreaCoords {
  x: number; // 0-100
  y: number; // 0-100
  name: string;
}

const AREA_COORDS: { [key: string]: AreaCoords } = {
  'Lekki': { x: 65, y: 45, name: 'Lekki' },
  'Ikate': { x: 68, y: 47, name: 'Ikate' },
  'Victoria Island': { x: 45, y: 40, name: 'Victoria Island' },
  'Ikeja': { x: 35, y: 35, name: 'Ikeja' },
  'Ajah': { x: 72, y: 50, name: 'Ajah' },
  'Sangotedo': { x: 70, y: 52, name: 'Sangotedo' },
  'Yaba': { x: 40, y: 45, name: 'Yaba' },
  'Chevron': { x: 66, y: 46, name: 'Chevron' },
};

export function AdminMapView({ properties, height = '500px' }: AdminMapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'heatmap'>('heatmap');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  // Get property coordinates (memoized per property)
  const getPropertyCoords = (property: Property, index: number): { x: number; y: number } => {
    for (const [key, coords] of Object.entries(AREA_COORDS)) {
      if (property.location.toLowerCase().includes(key.toLowerCase()) || 
          property.area.toLowerCase().includes(key.toLowerCase())) {
        // Use index for consistent positioning
        const variation = 3;
        const offset = (index % 5) * 0.6 - 1.2;
        return {
          x: coords.x + offset,
          y: coords.y + offset,
        };
      }
    }
    // Default to center Lagos
    return { x: 50, y: 45 };
  };

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Try again if container not ready
        requestAnimationFrame(render);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = rect.width;
      const displayHeight = rect.height;
      const actualWidth = displayWidth * dpr;
      const actualHeight = displayHeight * dpr;

      // Always set canvas size
      canvas.width = actualWidth;
      canvas.height = actualHeight;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      
      // Reset transform and scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Clear canvas
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Draw background
      ctx.fillStyle = viewMode === 'heatmap' ? '#1a1a1a' : '#0f0f0f';
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Apply transformations
      ctx.save();
      ctx.translate(pan.x + displayWidth / 2, pan.y + displayHeight / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-displayWidth / 2, -displayHeight / 2);

      if (viewMode === 'heatmap') {
        // Draw heatmap
        properties.forEach((prop, idx) => {
          const coords = getPropertyCoords(prop, idx);
          const x = (coords.x / 100) * displayWidth;
          const y = (coords.y / 100) * displayHeight;

          // Create gradient for heat point
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
          gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw property markers
        properties.forEach((prop, idx) => {
          const coords = getPropertyCoords(prop, idx);
          const x = (coords.x / 100) * displayWidth;
          const y = (coords.y / 100) * displayHeight;

          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      } else {
        // Draw map background
        const landGradient = ctx.createLinearGradient(0, 0, displayWidth, displayHeight);
        landGradient.addColorStop(0, '#2d5016');
        landGradient.addColorStop(1, '#1a3009');
        ctx.fillStyle = landGradient;
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.moveTo((i * displayWidth) / 10, 0);
          ctx.lineTo((i * displayWidth) / 10, displayHeight);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, (i * displayHeight) / 10);
          ctx.lineTo(displayWidth, (i * displayHeight) / 10);
          ctx.stroke();
        }

        // Draw area labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = `${12 * Math.min(zoom, 2)}px sans-serif`;
        Object.values(AREA_COORDS).forEach((area) => {
          const x = (area.x / 100) * displayWidth;
          const y = (area.y / 100) * displayHeight;
          ctx.fillText(area.name, x + 10, y - 10);
        });

        // Draw property markers
        properties.forEach((prop, idx) => {
          const coords = getPropertyCoords(prop, idx);
          const x = (coords.x / 100) * displayWidth;
          const y = (coords.y / 100) * displayHeight;

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.beginPath();
          ctx.arc(x + 2, y + 2, 6, 0, Math.PI * 2);
          ctx.fill();

          // Marker
          ctx.fillStyle = '#D4AF37';
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Hover effect
          if (hoveredProperty?.id === prop.id) {
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
      }

      ctx.restore();
    };

    // Initial render
    const timeoutId = setTimeout(() => {
      render();
    }, 100);
    
    const handleResize = () => {
      render();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [properties, viewMode, zoom, pan, hoveredProperty, isFullscreen, height]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Check for hover
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x - rect.width / 2) / zoom + rect.width / 2;
      const y = (e.clientY - rect.top - pan.y - rect.height / 2) / zoom + rect.height / 2;

      const hovered = properties.find((prop, idx) => {
        const coords = getPropertyCoords(prop, idx);
        const px = (coords.x / 100) * rect.width;
        const py = (coords.y / 100) * rect.height;
        const dist = Math.sqrt(Math.pow(x - px, 2) + Math.pow(y - py, 2));
        return dist < 20;
      });
      setHoveredProperty(hovered || null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={`relative bg-bg-secondary border border-border-color rounded-xl overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
      style={{ 
        height: isFullscreen ? 'calc(100vh - 2rem)' : height,
        minHeight: height 
      }}
    >
      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full" 
        style={{ 
          height: '100%',
          minHeight: height 
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-move block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ 
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {/* View Mode Toggle */}
        <div className="bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === 'heatmap'
                ? 'bg-primary text-black'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-1" />
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-2 text-sm font-medium transition-colors border-l border-border-color ${
              viewMode === 'map'
                ? 'bg-primary text-black'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
            }`}
          >
            <MapPin className="w-4 h-4 inline mr-1" />
            Map
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-bg-tertiary transition-colors border-b border-border-color"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-bg-tertiary transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={resetView}
          className="w-10 h-10 flex items-center justify-center bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors"
          title="Reset View"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 flex items-center justify-center bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-4 left-4 bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg p-4 max-w-xs z-10">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-primary" />
          <h4 className="font-semibold text-text-primary">Platform Activity Map</h4>
        </div>
        <div className="space-y-1 text-xs text-text-secondary">
          <p>
            <span className="font-medium">{properties.length}</span> properties visualized
          </p>
          <p>
            Mode: <span className="font-medium capitalize">{viewMode}</span>
          </p>
          {viewMode === 'heatmap' && (
            <p className="text-text-tertiary">
              Red/yellow areas indicate higher property concentration
            </p>
          )}
          {hoveredProperty && (
            <div className="mt-2 p-2 bg-bg-primary rounded border border-border-color">
              <p className="font-medium text-text-primary text-xs">{hoveredProperty.title}</p>
              <p className="text-text-tertiary text-xs">₦{hoveredProperty.price.toLocaleString()}</p>
              <p className="text-text-tertiary text-xs">{hoveredProperty.location}</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend for Heatmap */}
      {viewMode === 'heatmap' && (
        <div className="absolute top-4 left-4 bg-bg-secondary/95 backdrop-blur-sm border border-border-color rounded-lg p-3 z-10">
          <p className="text-xs font-semibold text-text-primary mb-2">Activity Intensity</p>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className="w-4 h-16 rounded"
                style={{
                  background: 'linear-gradient(to top, rgba(255,255,0,0.8), rgba(255,165,0,0.8), rgba(255,0,0,0.8))',
                }}
              />
              <span className="text-xs text-text-tertiary mt-1">Low</span>
              <span className="text-xs text-text-tertiary">High</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
