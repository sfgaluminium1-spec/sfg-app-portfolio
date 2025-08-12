
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { 
  Award,
  Users,
  Calendar,
  Target,
  Shield,
  Lightbulb,
  Heart,
  Globe
} from 'lucide-react'

const teamMembers = [
  {
    name: 'David Thompson',
    role: 'Managing Director',
    experience: '25+ years',
    description: 'Industry veteran with expertise in commercial glazing and architectural aluminium systems.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Sarah Mitchell',
    role: 'Technical Director',
    experience: '20+ years',
    description: 'Specialist in curtain wall design and building performance optimization.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Minister_Mitchell_July_20_headshot_DSC6710a.jpg/320px-Minister_Mitchell_July_20_headshot_DSC6710a.jpg'
  },
  {
    name: 'James Wilson',
    role: 'Operations Manager',
    experience: '15+ years',
    description: 'Expert in project management and quality assurance across all installations.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  },
  {
    name: 'Emma Clarke',
    role: 'Design Consultant',
    experience: '12+ years',
    description: 'Creative specialist in architectural design and customer consultation.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
  }
]

const values = [
  {
    icon: Shield,
    title: 'Quality First',
    description: 'We never compromise on quality, using only the finest materials and most rigorous standards.'
  },
  {
    icon: Heart,
    title: 'Customer Focus',
    description: 'Every decision we make is centered around delivering exceptional value and service to our customers.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously invest in new technologies and techniques to stay at the forefront of our industry.'
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description: 'Committed to environmentally responsible practices and energy-efficient solutions.'
  }
]

const achievements = [
  { icon: Award, title: 'Industry Recognition', value: '15+ Awards' },
  { icon: Users, title: 'Expert Team', value: '45 Professionals' },
  { icon: Calendar, title: 'Years Experience', value: '25+ Years' },
  { icon: Target, title: 'Projects Completed', value: '5000+' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About SFG Aluminium
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            For over 25 years, we've been at the forefront of aluminium innovation, 
            delivering exceptional solutions that combine engineering excellence with architectural beauty.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 1999, SFG Aluminium Ltd began as a small family business with a simple mission: 
                  to provide the highest quality aluminium solutions backed by exceptional service.
                </p>
                <p>
                  From our humble beginnings in a small workshop, we've grown to become one of the UK's 
                  most trusted names in architectural aluminium systems. Our success is built on a 
                  foundation of technical expertise, unwavering quality standards, and genuine care for our customers.
                </p>
                <p>
                  Today, we continue to push the boundaries of what's possible with aluminium, embracing 
                  new technologies and sustainable practices while never losing sight of the craftsmanship 
                  and personal service that sets us apart.
                </p>
              </div>
            </div>
            
            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://mavericksteelbuildings.com/wp-content/uploads/2022/08/Stair-South-3-Casey-McDonough-1024x615.jpg"
                alt="SFG Aluminium facility"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Achievements</h2>
            <p className="text-xl text-blue-100">Milestones that reflect our commitment to excellence</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <achievement.icon className="h-8 w-8" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold">{achievement.value}</div>
                <div className="text-blue-100">{achievement.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and define who we are as a company.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The experienced professionals who lead our company and ensure every project exceeds expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative aspect-square bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.experience}</p>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm">
                    {member.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            "To be the UK's leading provider of innovative aluminium solutions, delivering exceptional 
            quality, unmatched service, and sustainable value to every customer we serve. We're not just 
            building with aluminium – we're building lasting relationships and creating spaces that inspire."
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
