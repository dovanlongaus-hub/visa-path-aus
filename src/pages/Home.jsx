// HomeV2.jsx - UI/UX Pro Max Redesign for Visa Path Australia
import React from 'react';
import NewHeroSection from '@/components/home/NewHeroSection';
import { Button } from '@/components/ui/button';
import { 
  Map, FileText, MessageCircle, CheckSquare, Upload, 
  Calculator, Shield, Clock, Users, Award, Globe, 
  BookOpen, Headphones, TrendingUp, Lock, Zap 
} from 'lucide-react';

const HomeV2 = () => {
  // Visa pathway features
  const visaFeatures = [
    {
      icon: Map,
      title: 'Personalized Visa Pathway',
      description: 'AI-powered roadmap from current visa to permanent residency',
      color: 'bg-primary-50 text-primary-700',
      iconColor: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Calculator,
      title: 'EOI Score Calculator',
      description: 'Calculate your points for skilled migration visas',
      color: 'bg-secondary-50 text-secondary-700',
      iconColor: 'bg-secondary-100 text-secondary-600'
    },
    {
      icon: FileText,
      title: 'Document Checklist',
      description: 'Complete checklist for each visa type with validation',
      color: 'bg-success-50 text-success-700',
      iconColor: 'bg-success-100 text-success-600'
    },
    {
      icon: Shield,
      title: 'Agent Verification',
      description: 'All documents reviewed by MARA registered agents',
      color: 'bg-warning-50 text-warning-700',
      iconColor: 'bg-warning-100 text-warning-600'
    },
    {
      icon: Clock,
      title: 'Timeline Tracker',
      description: 'Real-time tracking of your application progress',
      color: 'bg-purple-50 text-purple-700',
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with other applicants and share experiences',
      color: 'bg-cyan-50 text-cyan-700',
      iconColor: 'bg-cyan-100 text-cyan-600'
    }
  ];

  // Visa types
  const visaTypes = [
    {
      name: 'Student Visa',
      description: 'Study at Australian institutions',
      duration: 'Up to 5 years',
      successRate: '95%',
      color: 'border-l-4 border-primary-500'
    },
    {
      name: 'Skilled Work Visa',
      description: 'Work in high-demand occupations',
      duration: '2-4 years',
      successRate: '92%',
      color: 'border-l-4 border-secondary-500'
    },
    {
      name: 'Permanent Residency',
      description: 'Pathway to Australian citizenship',
      duration: 'Permanent',
      successRate: '88%',
      color: 'border-l-4 border-success-500'
    },
    {
      name: 'Business/Investor',
      description: 'For entrepreneurs and investors',
      duration: '4+ years',
      successRate: '85%',
      color: 'border-l-4 border-warning-500'
    },
    {
      name: 'Family Sponsorship',
      description: 'Join family members in Australia',
      duration: 'Varies',
      successRate: '90%',
      color: 'border-l-4 border-purple-500'
    },
    {
      name: 'Visitor/Tourist',
      description: 'Short-term visits and tourism',
      duration: '3-12 months',
      successRate: '98%',
      color: 'border-l-4 border-cyan-500'
    }
  ];

  // Process steps
  const processSteps = [
    {
      step: '01',
      title: 'Free Assessment',
      description: 'Complete our 2-minute eligibility check',
      icon: Calculator
    },
    {
      step: '02',
      title: 'Consultation',
      description: 'Speak with a registered migration agent',
      icon: Headphones
    },
    {
      step: '03',
      title: 'Document Preparation',
      description: 'We help gather and verify all required documents',
      icon: FileText
    },
    {
      step: '04',
      title: 'Application Submission',
      description: 'We submit your application to the Department',
      icon: Upload
    },
    {
      step: '05',
      title: 'Tracking & Updates',
      description: 'Real-time updates on your application status',
      icon: TrendingUp
    },
    {
      step: '06',
      title: 'Visa Grant',
      description: 'Celebrate your Australian visa approval!',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <NewHeroSection />
      
      {/* Visa Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Everything You Need for Your<br />
              <span className="text-primary-600">Australian Visa Journey</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our comprehensive platform combines technology with expert guidance 
              to maximize your chances of success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`inline-flex p-3 rounded-xl ${feature.iconColor} mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Visa Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Choose Your <span className="text-primary-600">Visa Pathway</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We specialize in all major Australian visa categories with 
              proven success rates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visaTypes.map((visa, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-200 ${visa.color} hover:translate-y-[-4px]`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900">{visa.name}</h3>
                    <p className="text-neutral-600 mt-1">{visa.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary-700">
                      {visa.successRate} success
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Duration</span>
                    <span className="font-semibold text-neutral-900">{visa.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Processing time</span>
                    <span className="font-semibold text-neutral-900">2-4 months</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">Agent support</span>
                    <span className="font-semibold text-success-600">Included</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6" variant="outline">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Our <span className="text-primary-600">6-Step Process</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              From initial assessment to visa grant, we guide you every step of the way.
            </p>
          </div>
          
          <div className="relative">
            {/* Process line */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-success-500 -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{step.step}</span>
                      </div>
                      
                      <div className="mb-4">
                        <Icon className="w-8 h-8 mx-auto text-primary-600" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Step connector for mobile */}
                    {index < processSteps.length - 1 && (
                      <div className="md:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-primary-500 to-secondary-500"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl">
              Start Your Journey Today
            </Button>
            <p className="text-sm text-neutral-500 mt-4">
              Average processing time: 2-4 months with our expedited service
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Begin Your Australian Adventure?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of successful applicants who trusted us with their visa journey. 
              Your pathway to Australia starts with a simple conversation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary-700 hover:bg-neutral-100 px-8 py-3 rounded-xl font-semibold"
              >
                Book Free Consultation
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl"
              >
                Call Us: +61 2 8000 0000
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-80">Support Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-80">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-sm opacity-80">Successful Cases</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9★</div>
                <div className="text-sm opacity-80">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer note */}
      <div className="bg-neutral-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">
            © 2026 Visa Path Australia. All rights reserved. 
            <span className="block md:inline"> Registered Migration Agents: MARA 0000000</span>
          </p>
          <p className="text-xs opacity-60 mt-2">
            This website provides information only and does not constitute legal advice. 
            Please consult a registered migration agent for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeV2;