"use client";

import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PricingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: 200 }), // $2.00 in cents
      });

      const session = await response.json();
      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-100 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold mt-20 text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Create your professional resume for just $2 per generation
            </p>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden lg:max-w-none lg:flex">
            <div className="px-6 py-8 lg:flex-shrink-1 lg:p-12">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Resume Generation
              </h3>
              <p className="mt-6 text-base text-gray-500">
                Get a professionally designed resume tailored to your needs
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-indigo-600">
                    What's included
                  </h4>
                  <div className="flex-1 border-t-2 border-gray-200"></div>
                </div>
                <ul className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
                  {[
                    'Professional templates',
                    'ATS-friendly formats',
                    'Customizable sections',
                    'Expert tips and guidance',
                    'Multiple download formats',
                    'One-time purchase'
                  ].map((feature) => (
                    <li key={feature} className="flex items-start lg:col-span-1">
                      <div className="flex-shrink-0">
                        <FaCheck className="h-5 w-5 text-green-400" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
              <p className="text-lg leading-6 font-medium text-gray-900">
                Pay per generation
              </p>
              <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-gray-900">
                <span>$2</span>
                <span className="ml-3 text-xl font-medium text-gray-500">
                  USD
                </span>
              </div>
              <div className="mt-6">
                <div className="rounded-md shadow">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm">
                <a href="/pricing/pricedetail" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Learn about our membership options
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PricingPage;
