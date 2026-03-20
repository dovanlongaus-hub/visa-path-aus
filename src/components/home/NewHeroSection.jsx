// NewHeroSection.jsx - UI/UX Pro Max Trust & Authority Hero
import React from 'react';
import { ArrowRight, CheckCircle, MapPin, Calendar, FileText, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TrustBadge, { ImmigrationTrustBadges } from '@/components/ui/TrustBadge';

const NewHeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-neutral-200">
              <CheckCircle className="w-5 h-5 text-success-500" />
              <span className="text-sm font-medium text-neutral-700">
                Trusted by <span className="text-primary-600 font-semibold">1,000+</span> successful applicants
              </span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight">
              Your <span className="text-primary-600">Pathway</span> to<br />
              <span className="text-secondary-600">Australia</span> Starts Here
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl text-neutral-600 max-w-2xl">
              Get expert guidance from registered migration agents. 
              Our AI-powered platform simplifies your visa journey with 
              <span className="font-semibold text-primary-600"> 98% success rate</span>.
            </p>
            
            {/* Key benefits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">All Visa Types</p>
                  <p className="text-sm text-neutral-500">Student, Work, PR</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Fast Processing</p>
                  <p className="text-sm text-neutral-500">2-4 weeks average</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Document Help</p>
                  <p className="text-sm text-neutral-500">Checklist & review</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-warning-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Agent Support</p>
                  <p className="text-sm text-neutral-500">MARA registered</p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl">
                Start Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button size="lg" variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-xl">
                Book Consultation
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-4">
              <p className="text-sm text-neutral-500 mb-3">Trusted by applicants from:</p>
              <div className="flex items-center space-x-6 opacity-70">
                <div className="text-2xl font-bold text-neutral-300">🇦🇺</div>
                <div className="text-2xl font-bold text-neutral-300">🇺🇸</div>
                <div className="text-2xl font-bold text-neutral-300">🇬🇧</div>
                <div className="text-2xl font-bold text-neutral-300">🇮🇳</div>
                <div className="text-2xl font-bold text-neutral-300">🇨🇳</div>
                <div className="text-2xl font-bold text-neutral-300">🇻🇳</div>
              </div>
            </div>
          </div>
          
          {/* Right column - Visual/Form */}
          <div className="relative">
            {/* Glassmorphism card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">Free Visa Assessment</h3>
                <p className="text-neutral-600 mt-2">Get your eligibility score in 2 minutes</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    What's your current situation?
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none">
                    <option>Select your situation</option>
                    <option>Student looking to study in Australia</option>
                    <option>Professional seeking work visa</option>
                    <option>Looking for permanent residency</option>
                    <option>Business/investor visa</option>
                    <option>Family sponsorship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Your nationality
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none">
                    <option>Select country</option>
                    <option>Vietnam</option>
                    <option>India</option>
                    <option>China</option>
                    <option>United Kingdom</option>
                    <option>United States</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Age
                  </label>
                  <input 
                    type="number" 
                    placeholder="e.g., 28"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email address
                  </label>
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-semibold"
                >
                  Check My Eligibility
                </Button>
                
                <p className="text-center text-xs text-neutral-500">
                  By continuing, you agree to our Terms and Privacy Policy
                </p>
              </form>
              
              {/* Success badge on card */}
              <div className="absolute -top-3 -right-3 bg-success-500 text-white px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">No spam, guaranteed</span>
                </div>
              </div>
            </div>
            
            {/* Floating trust elements */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-primary-700">1,000+</p>
                  <p className="text-sm text-neutral-600">Success stories</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 border border-neutral-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-secondary-700">98%</p>
                  <p className="text-sm text-neutral-600">Success rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust badges section below hero */}
        <div className="mt-16">
          <ImmigrationTrustBadges />
        </div>
      </div>
      
      {/* CSS for grid pattern */}
      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(30, 58, 95, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 58, 95, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
};

export default NewHeroSection;