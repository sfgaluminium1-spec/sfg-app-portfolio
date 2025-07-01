
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SharePoint iframe detection utility
export function isInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

// SharePoint environment detection
export function isSharePointEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.location.hostname.includes('sharepoint.com') ||
    window.location.hostname.includes('.sharepoint.') ||
    (window as any)._spPageContextInfo ||
    (window as any).SP ||
    isInIframe()
  );
}

// Get optimal container classes for SharePoint embedding
export function getContainerClasses(isSharePointEmbed: boolean = false): string {
  if (isSharePointEmbed) {
    return "w-full px-4 sm:px-6"; // No max-width constraints for iframe
  }
  return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"; // Normal centered layout
}

// Get optimal section height for SharePoint
export function getSectionHeight(isSharePointEmbed: boolean = false, isHero: boolean = false): string {
  if (isSharePointEmbed) {
    return isHero ? "py-16 md:py-20" : "py-12 md:py-16"; // Reduced heights for iframe
  }
  return isHero ? "min-h-screen" : "py-20"; // Full heights for standalone
}

// Format numbers with animation
export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void
) {
  const startTime = performance.now();
  
  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const current = start + (end - start) * easeOutQuart(progress);
    callback(Math.round(current));
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

// Generate responsive image placeholder URLs
export function getImagePlaceholder(width: number, height: number, text?: string): string {
  const baseUrl = "https://i.pinimg.com/736x/c6/11/f2/c611f24276d6fe8bc5495a35c6653924.jpg";
  const dimensions = `${width}x${height}`;
  const bgColor = "1a1a1a";
  const textColor = "00bfff";
  const displayText = text ? encodeURIComponent(text) : "Image";
  
  return `${baseUrl}/${dimensions}/${bgColor}/${textColor}?text=${displayText}`;
}
