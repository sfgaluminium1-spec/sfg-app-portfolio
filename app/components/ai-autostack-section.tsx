
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Users, TrendingUp, Sparkles, ExternalLink, Star } from 'lucide-react'
import Image from 'next/image'

export function AIAutoStackSection() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const partnershipBenefits = [
    {
      icon: Users,
      title: "Shared AI Audience",
      description: "Cross-promote to 50K+ users interested in AI automation and productivity tools",
      metric: "50K+ Users"
    },
    {
      icon: TrendingUp,
      title: "Revenue Synergy",
      description: "Combined sales platform with shared checkout and bundled offerings",
      metric: "+35% Revenue"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Workflows",
      description: "Seamless integration between Chrome extension and AI-AutoStack automation",
      metric: "10x Efficiency"
    },
    {
      icon: Zap,
      title: "Cross-Platform Promotion",
      description: "Featured placement on both platforms with shared marketing campaigns",
      metric: "2x Visibility"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-purple-500/50 text-purple-300">
            Strategic Partnership
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI-AutoStack</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join forces with AI-AutoStack to revolutionize workplace automation. Share audiences, boost revenues, and create the ultimate AI ecosystem.
          </p>
        </div>

        {/* Partnership Visual */}
        <div className="mb-16 flex justify-center">
          <div className="relative max-w-5xl w-full">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* SFG Chrome Extension Side */}
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">SFG Chrome Suite</h3>
                    </div>
                    <p className="text-gray-300 mb-4">Browser-based AI automation, text processing, and productivity tools</p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">Chrome Extension</Badge>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">Text Processing</Badge>
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">Bookmarks</Badge>
                    </div>
                  </div>

                  {/* Connection Indicator */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <ArrowRight className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* AI-AutoStack Side */}
                  <div className="text-center lg:text-right">
                    <div className="flex items-center justify-center lg:justify-end mb-4">
                      <h3 className="text-2xl font-bold text-white mr-3">AI-AutoStack</h3>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">Enterprise-grade workflow automation and AI-powered business solutions</p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Workflow Automation</Badge>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">AI Processing</Badge>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Enterprise</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Partnership Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnershipBenefits.map((benefit, index) => (
            <Card
              key={index}
              className="group cursor-pointer bg-slate-800/30 backdrop-blur-sm border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <CardHeader className="text-center pb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <CardTitle className="text-lg text-white group-hover:text-purple-300 transition-colors">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-400 text-sm mb-3 group-hover:text-gray-300 transition-colors">
                  {benefit.description}
                </p>
                <Badge 
                  variant="outline" 
                  className={`border-purple-500/50 text-purple-300 font-semibold ${
                    hoveredFeature === index ? 'bg-purple-500/20' : ''
                  } transition-all duration-300`}
                >
                  {benefit.metric}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Experience the Power of Partnership</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of users leveraging both platforms for maximum productivity and automation efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full"
                >
                  Try Both Platforms
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 font-semibold px-8 py-3 rounded-full"
                  onClick={() => window.open('https://Ai-AutoStack.abacusai.app', '_blank')}
                >
                  Visit AI-AutoStack
                  <ExternalLink className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
