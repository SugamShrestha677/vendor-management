import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart3, 
  Truck, 
  CheckCircle,
  Menu,
  X,
  Star,
  Users,
  Clock
} from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 fixed top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with animation */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-800">Vendor<span className="text-blue-600">Procure</span></span>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:flex items-center space-x-8"
            >
              {['Features', 'How It Works', 'Pricing', 'About'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item}
                </a>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex items-center space-x-4"
            >
              <a 
                href="/login" 
                className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Sign In
              </a>
              <a 
                href="/register" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </a>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {['Features', 'How It Works', 'Pricing', 'About'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block text-gray-600 hover:text-blue-600 py-2 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <a 
                  href="/login" 
                  className="block text-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </a>
                <a 
                  href="/register" 
                  className="block text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-block">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                🚀 Streamline Your Procurement
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold text-gray-900 mt-6 leading-tight"
            >
              Smart Vendor <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Procurement Management
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 mt-6 leading-relaxed"
            >
              Automate your purchase requests, approvals, and vendor management in one seamless platform. Save time, reduce costs, and improve efficiency.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-4 mt-8"
            >
              <a 
                href="/register" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-medium hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#demo" 
                className="px-8 py-4 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
              >
                Watch Demo
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap gap-8 mt-12"
            >
              {[
                { number: '10K+', label: 'Active Users', icon: Users },
                { number: '50K+', label: 'Orders Processed', icon: CheckCircle },
                { number: '99.9%', label: 'Uptime', icon: Clock }
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-1">
              <div className="bg-white rounded-2xl p-6">
                {/* Dashboard Preview */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-8 bg-blue-600 rounded-lg"></div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        animate={floatingAnimation}
                        transition={{ delay: i * 0.2 }}
                        className="bg-gray-50 rounded-lg p-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg mb-2"></div>
                        <div className="w-12 h-4 bg-gray-200 rounded"></div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Table Preview */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                            <div className="w-16 h-3 bg-gray-100 rounded mt-1"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-green-100 rounded-full"></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div 
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-20 h-20 bg-green-400 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.span variants={fadeInUp} className="text-blue-600 font-semibold">
            FEATURES
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Everything you need to manage <br />
            <span className="text-blue-600">procurement efficiently</span>
          </motion.h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {[
            {
              icon: Zap,
              title: 'Fast Approvals',
              description: 'Streamlined approval workflow with real-time notifications and multi-level approval hierarchy.',
              color: 'from-yellow-400 to-orange-400'
            },
            {
              icon: Shield,
              title: 'Secure & Compliant',
              description: 'Enterprise-grade security with role-based access control and audit trails for compliance.',
              color: 'from-blue-400 to-indigo-400'
            },
            {
              icon: BarChart3,
              title: 'Advanced Analytics',
              description: 'Real-time insights and reporting to track spending, vendor performance, and procurement trends.',
              color: 'from-purple-400 to-pink-400'
            },
            {
              icon: Truck,
              title: 'Vendor Management',
              description: 'Comprehensive vendor profiles, performance tracking, and automated communication.',
              color: 'from-green-400 to-emerald-400'
            },
            {
              icon: Users,
              title: 'Multi-role Support',
              description: 'Dedicated interfaces for employees, managers, and vendors with tailored features for each.',
              color: 'from-red-400 to-pink-400'
            },
            {
              icon: CheckCircle,
              title: 'Automated Workflows',
              description: 'End-to-end automation from purchase requests to order fulfillment and invoicing.',
              color: 'from-teal-400 to-cyan-400'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
              }}
              className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold">
              How VendorProcure Works
            </h2>
            <p className="text-xl text-blue-100 mt-4 max-w-2xl mx-auto">
              Three simple steps to streamline your procurement process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                step: '01',
                title: 'Create Request',
                description: 'Employees create purchase requests with item details, budget codes, and preferred vendors.',
                icon: '📝'
              },
              {
                step: '02',
                title: 'Smart Approval',
                description: 'Managers review and approve requests with optional comments and multi-level workflows.',
                icon: '✅'
              },
              {
                step: '03',
                title: 'Fulfillment',
                description: 'Vendors receive orders, update status, and deliver products seamlessly.',
                icon: '🚚'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="text-7xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  {item.icon}
                </div>
                <div className="text-5xl font-bold text-white/20 absolute top-0 right-0">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mt-4">{item.title}</h3>
                <p className="text-blue-100 mt-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-blue-600 font-semibold">TESTIMONIALS</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            Trusted by thousands of businesses
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              quote: "VendorProcure has transformed how we manage procurement. We've reduced processing time by 70%.",
              author: "Sarah Johnson",
              role: "Procurement Manager",
              company: "TechCorp Inc."
            },
            {
              quote: "The vendor management features are incredible. We can track performance and communicate seamlessly.",
              author: "Michael Chen",
              role: "Operations Director",
              company: "Global Solutions"
            },
            {
              quote: "As a vendor, the platform makes it easy to receive orders and update status. Highly recommended!",
              author: "Emily Rodriguez",
              role: "Sales Director",
              company: "SupplyPro"
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Ready to transform your procurement?
          </h2>
          <p className="text-xl text-blue-100 mt-4 max-w-2xl mx-auto">
            Join thousands of companies that have streamlined their vendor management with VendorProcure.
          </p>
          <motion.a
            href="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-8 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200"
          >
            Get Started Free
          </motion.a>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required. Free 14-day trial.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Vendor<span className="text-blue-400">Procure</span></span>
              </div>
              <p className="text-sm">Smart procurement management for modern businesses.</p>
            </div>
            {['Product', 'Company'].map((section) => (
              <div key={section}>
                <h4 className="text-white font-semibold mb-4">{section}</h4>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        Link {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © 2026 VendorProcure. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}