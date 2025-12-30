import { useState, useRef, useEffect } from 'react';
interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
}
export function useSwipe(handlers: SwipeHandlers) {
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({
    x: 0,
    y: 0
  });
  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setIsDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    };
    setTouchEnd(currentTouch);
    setDragOffset({
      x: currentTouch.x - touchStart.x,
      y: currentTouch.y - touchStart.y
    });
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset({
        x: 0,
        y: 0
      });
      return;
    }
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    if (isLeftSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      handlers.onSwipeLeft?.();
    } else if (isRightSwipe && Math.abs(distanceX) > Math.abs(distanceY)) {
      handlers.onSwipeRight?.();
    } else if (isUpSwipe && Math.abs(distanceY) > Math.abs(distanceX)) {
      handlers.onSwipeUp?.();
    }
    setIsDragging(false);
    setDragOffset({
      x: 0,
      y: 0
    });
    setTouchStart(null);
    setTouchEnd(null);
  };
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    dragOffset
  };
}