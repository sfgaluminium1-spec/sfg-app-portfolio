
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroVideoProps {
  className?: string
}

export default function AdvancedHeroVideo({ className }: HeroVideoProps) {
  const [mounted, setMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    experience: 0,
    projects: 0,
    quality: 0,
    service: 0
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Video sources for different devices (Currently using fallback image until videos are provided)
  const videoSources = {
    desktop: '/videos/hero-desktop-1920x1080.mp4',
    tablet: '/videos/hero-tablet-1024x768.mp4', 
    mobile: '/videos/hero-mobile-375x667.mp4',
    fallback: 'https://www.finishfacades.co.uk/wp-content/uploads/2024/11/shutterstock_2467913365-scaled.jpg'
  }

  // For now, use static image until video files are provided
  const useStaticFallback = true

  // Detect device and reduced motion preference
  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    if (!mounted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting) {
          animateStats()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [mounted])

  // Animate statistics counters
  const animateStats = () => {
    const targets = { experience: 25, projects: 5000, quality: 100, service: 100 }
    const duration = 2000
    const steps = 60

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedStats({
        experience: Math.round(targets.experience * easeOutQuart),
        projects: Math.round(targets.projects * easeOutQuart),
        quality: Math.round(targets.quality * easeOutQuart),
        service: Math.round(targets.service * easeOutQuart)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)
  }

  // Video control handlers
  const togglePlayPause = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Video progress tracking
  const handleVideoProgress = () => {
    if (!videoRef.current) return
    
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setVideoProgress(progress)
  }

  // Get appropriate video source based on screen size
  const getVideoSource = () => {
    if (typeof window === 'undefined') return videoSources.desktop
    
    const width = window.innerWidth
    if (width < 768) return videoSources.mobile
    if (width < 1024) return videoSources.tablet
    return videoSources.desktop
  }

  if (!mounted) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-gray-900/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Premium <span className="text-blue-400">Aluminium</span> Solutions
          </h1>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef}
      className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Background or Fallback Image */}
      {!prefersReducedMotion && !useStaticFallback ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onTimeUpdate={handleVideoProgress}
          onLoadedData={() => setIsPlaying(true)}
          poster={videoSources.fallback}
        >
          <source src={getVideoSource()} type="video/mp4" />
          <source src="/videos/hero-fallback.webm" type="video/webm" />
          {/* Fallback for browsers that don't support video */}
          <img 
            src={videoSources.fallback} 
            alt="SFG Aluminium architectural installation"
            className="w-full h-full object-cover"
          />
        </video>
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${videoSources.fallback})` }}
        />
      )}
      
      {/* Warren Executive Theme Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-gray-900/40 to-blue-900/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      {/* Video Controls */}
      {!prefersReducedMotion && !useStaticFallback && (
        <div className={cn(
          "absolute top-6 right-6 z-30 flex items-center space-x-2 transition-all duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="secondary"
            size="sm"
            onClick={togglePlayPause}
            className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleMute}
            className="bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/40"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Video Progress Bar */}
      {!prefersReducedMotion && !useStaticFallback && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-blue-400 transition-all duration-100"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading with Metallic Animation */}
        <div className="mb-8">
          <h1 className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight",
            "transform transition-all duration-1000",
            isIntersecting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}>
            Premium{" "}
            <span className="relative text-blue-400">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Aluminium
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                Aluminium
              </span>
            </span>{" "}
            Solutions
          </h1>
          
          <p className={cn(
            "text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed",
            "transform transition-all duration-1000 delay-300",
            isIntersecting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}>
            Transform your space with expertly crafted windows, doors, and architectural systems.{" "}
            <span className="text-blue-300 font-semibold">Quality engineering meets exceptional design.</span>
          </p>
        </div>

        {/* Animated CTAs */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 justify-center mb-16",
          "transform transition-all duration-1000 delay-500",
          isIntersecting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <Button 
            size="lg" 
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg",
              "transform transition-all duration-300 hover:scale-105 hover:shadow-2xl",
              "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
              "relative overflow-hidden group"
            )}
            asChild
          >
            <Link href="/contact">
              <span className="relative z-10">Get Free Quote</span>
              <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className={cn(
              "border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg",
              "transform transition-all duration-300 hover:scale-105 hover:shadow-2xl",
              "backdrop-blur-sm bg-white/10 hover:bg-white",
              "relative overflow-hidden group"
            )}
            asChild
          >
            <Link href="/products">
              <span className="relative z-10">Book Survey</span>
              <Settings className="ml-2 h-5 w-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </Button>
        </div>

        {/* Animated Trust Indicators */}
        <div className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto",
          "transform transition-all duration-1000 delay-700",
          isIntersecting ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                {animatedStats.experience}+
              </span>
            </div>
            <div className="text-sm text-gray-300 font-medium">Years Experience</div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                {animatedStats.projects.toLocaleString()}+
              </span>
            </div>
            <div className="text-sm text-gray-300 font-medium">Projects Completed</div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                {animatedStats.quality}%
              </span>
            </div>
            <div className="text-sm text-gray-300 font-medium">Quality Guaranteed</div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                PPM
              </span>
            </div>
            <div className="text-sm text-gray-300 font-medium">Maintenance Ready</div>
            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={cn(
        "absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60",
        "animate-bounce cursor-pointer hover:text-white transition-colors duration-300",
        isIntersecting ? "opacity-100" : "opacity-0",
        "transition-opacity duration-1000 delay-1000"
      )}>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-xs font-medium tracking-wide uppercase">Scroll Down</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Accessibility Screen Reader Content */}
      <div className="sr-only">
        <h2>Hero Video Description</h2>
        <p>
          Time-lapse video showing SFG Aluminium's precision manufacturing process, 
          professional installation of windows and doors, and beautiful finished results 
          on modern commercial and residential projects. Features the Warren Executive 
          Theme with blues and metallic finishes.
        </p>
      </div>
    </section>
  )
}
