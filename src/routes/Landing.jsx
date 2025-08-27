import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, BarChart3 } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-white">JobTracker</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 relative"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Track Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Dream Job</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto">
            Organize your job applications, discover new opportunities, and land your perfect role with our comprehensive tracking platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Login to Continue
            </Link>
            <Link 
              to="/signup"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Create Account
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-xl font-semibold mb-2">Track Applications</h3>
              <p className="text-gray-300">Keep all your job applications organized in one place</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">Connect with Companies</h3>
              <p className="text-gray-300">Discover new opportunities from top companies</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Analyze Progress</h3>
              <p className="text-gray-300">Get insights into your job search journey</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;