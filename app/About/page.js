import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            About GetMeFund
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering creators to turn their passion into sustainable income through direct community support
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-stretch mb-20">
          <div className='bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm'>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">Our Mission</h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              We believe that creators should be able to focus on what they do best—creating amazing content—without 
              worrying about financial sustainability. GetMeFund bridges the gap between creators and their communities, 
              enabling direct support that fuels creativity and innovation.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Whether you're an artist, developer, educator, or any type of content creator, our platform provides 
              the tools you need to build a sustainable creator economy around your work.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
                Our mission is to democratize funding for creators worldwide, fostering a vibrant ecosystem where creativity thrives and communities flourish.
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">Why GetMeFund?</h3>
            <ul className="space-y-6 text-gray-300">
              <li className="flex items-start text-lg">
                <span className="text-cyan-400 mr-3 text-xl mt-1">•</span>
                <div>
                  <span className="font-semibold text-white">Direct creator-to-supporter relationships</span>
                  <p className="text-base mt-1 text-gray-300">Build meaningful connections with your audience without intermediaries. Your supporters know exactly where their contributions go, creating trust and encouraging repeat donations.</p>
                </div>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-cyan-400 mr-3 text-xl mt-1">•</span>
                <div>
                  <span className="font-semibold text-white">Transparent and secure payment processing</span>
                  <p className="text-base mt-1 text-gray-300">Every transaction is protected by industry-leading security measures. Clear fee structures with no hidden costs, and real-time tracking of all payments and transfers to your account.</p>
                </div>
              </li>
              <li className="flex items-start text-lg">
                <span className="text-cyan-400 mr-3 text-xl mt-1">•</span>
                <div>
                  <span className="font-semibold text-white">Easy setup and customizable creator profiles</span>
                  <p className="text-base mt-1 text-gray-300">Get started in minutes with our intuitive setup process. Customize your profile to reflect your unique brand, add your story, set funding goals, and showcase your work to potential supporters.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Create Your Profile</h3>
              <p className="text-gray-300">
                Set up your creator profile with your story, goals, and payment information. Customize your page to reflect your brand.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Share Your Work</h3>
              <p className="text-gray-300">
                Share your GetMeFund page with your audience across social media, your website, or anywhere your community gathers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Receive Support</h3>
              <p className="text-gray-300">
                Your supporters can contribute directly to your work with secure payments, helping you continue creating amazing content.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-cyan-400">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Transparency</h3>
              <p className="text-gray-300 text-sm">
                Clear fees, open processes, and honest communication with our creator community.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Security</h3>
              <p className="text-gray-300 text-sm">
                Bank-level security for all transactions, protecting both creators and supporters.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Innovation</h3>
              <p className="text-gray-300 text-sm">
                Continuously improving our platform with new features and better user experiences.
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-3 text-cyan-300">Community</h3>
              <p className="text-gray-300 text-sm">
                Building strong connections between creators and their supporters worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-12 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building sustainable income through community support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dashboard" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105">
              Start Creating
            </a>
            <a href="/" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105">
              Browse Creators
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

export const metadata = {
  title: 'About - GetMeFund'
}