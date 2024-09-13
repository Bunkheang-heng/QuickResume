import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';

const PriceDetail: React.FC = () => {
  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      features: [
        { text: 'Single resume template', included: true },
        { text: 'Basic customization options', included: true },
        { text: 'Export to PDF', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced AI suggestions', included: false },
        { text: 'Multiple resume versions', included: false },
      ],
    },
    {
      name: 'Pro',
      price: 19.99,
      features: [
        { text: 'All Basic features', included: true },
        { text: 'Multiple resume templates', included: true },
        { text: 'Advanced customization options', included: true },
        { text: 'Export to PDF and Word', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Advanced AI suggestions', included: true },
        { text: 'Multiple resume versions', included: true },
      ],
    },
    {
      name: 'Enterprise',
      price: 49.99,
      features: [
        { text: 'All Pro features', included: true },
        { text: 'Custom branding options', included: true },
        { text: 'API access', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Team collaboration tools', included: true },
        { text: 'Advanced analytics', included: true },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 text-center mb-12">Select the perfect plan to boost your career with our professional resume builder.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                  <h2 className="text-2xl font-bold text-gray-900 text-center">{plan.name}</h2>
                  <p className="mt-4 text-center">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          {feature.included ? (
                            <FaCheck className="h-5 w-5 text-green-500" />
                          ) : (
                            <FaTimes className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-8 bg-gray-50">
                  <button className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PriceDetail;
