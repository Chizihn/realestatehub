import { Home, Users, Shield, MapPin, Heart, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Home,
      title: "Comprehensive Listings",
      description:
        "Browse thousands of properties across Nigeria, from luxury apartments to affordable homes and commercial land.",
    },
    {
      icon: MapPin,
      title: "Location-Based Search",
      description:
        "Find properties in your preferred locations with our interactive map and advanced location filters.",
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description:
        "All property listings are verified by our team to ensure authenticity and prevent fraud.",
    },
    {
      icon: Users,
      title: "Connect with Agents",
      description:
        "Connect directly with verified real estate agents and property owners for seamless transactions.",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description:
        "Create your personal collection of favorite properties and track price changes over time.",
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description:
        "Get access to market trends, price analytics, and neighborhood insights to make informed decisions.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Properties Listed" },
    { number: "5,000+", label: "Happy Customers" },
    { number: "500+", label: "Verified Agents" },
    { number: "36", label: "States Covered" },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About RealEstateHub
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Nigeria's leading real estate platform connecting property seekers
          with their dream homes. We're revolutionizing how Nigerians buy, sell,
          and rent properties across the country.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            To democratize access to real estate opportunities across Nigeria by
            providing a transparent, secure, and user-friendly platform that
            connects property seekers with verified listings and trusted real
            estate professionals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Transparency
              </h3>
              <p className="text-gray-600">
                Clear pricing, verified listings, and honest property
                information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">
                Building connections between buyers, sellers, and agents.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">
                Leveraging technology to simplify real estate transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 rounded-2xl text-white p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-primary-100 text-lg">
            Trusted by thousands of Nigerians in their property journey
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-primary-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose RealEstateHub?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to make informed real estate
            decisions in Nigeria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Founded in 2024, RealEstateHub was born from the vision to solve
              the challenges faced by property seekers and real estate
              professionals in Nigeria. Our founders, having experienced
              firsthand the difficulties of finding reliable property
              information and connecting with trustworthy agents, set out to
              create a platform that would transform the Nigerian real estate
              landscape.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we're proud to serve thousands of users across all 36
              states of Nigeria, providing them with the tools and information
              they need to make confident real estate decisions. Our commitment
              to transparency, innovation, and customer satisfaction continues
              to drive our growth and success.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl text-white p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerians who have found their perfect homes through
          RealEstateHub
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Properties
          </a>
          <a
            href="/register"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
