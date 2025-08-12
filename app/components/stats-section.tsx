
"use client"

import { useState, useEffect, useRef } from 'react'

const stats = [
  { id: 1, name: 'Projects Completed', value: 5000 },
  { id: 2, name: 'Years of Experience', value: 25 },
  { id: 3, name: 'Satisfied Customers', value: 3500 },
  { id: 4, name: 'Expert Technicians', value: 45 },
]

function useIntersectionObserver(ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [ref, options])

  return isIntersecting
}

function AnimatedCounter({ end, isVisible }: { end: number, isVisible: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const increment = end / (duration / 16) // 60fps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, isVisible])

  return <span>{count.toLocaleString()}+</span>
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.3 })

  return (
    <section ref={ref} className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-blue-100">
            Our track record speaks for itself
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat) => (
            <div key={stat.id} className="space-y-2">
              <div className="text-4xl lg:text-5xl font-bold">
                <AnimatedCounter end={stat.value} isVisible={isVisible} />
              </div>
              <div className="text-lg text-blue-100">{stat.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
