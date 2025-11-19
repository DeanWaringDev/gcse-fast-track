/**
 * Contact Us Page
 * 
 * A visually engaging contact form integrated with EmailJS for email delivery.
 * Features a purple gradient background and modern card-based layout.
 * 
 * Key Features:
 * - EmailJS integration for client-side email sending
 * - Form validation with required fields
 * - Real-time status feedback (sending, success, error)
 * - Responsive 2-column layout (stacks on mobile)
 * - Purple gradient theme matching brand colors
 * - Animated loading spinner during submission
 * - Information cards for support categories
 * 
 * Dependencies:
 * - @emailjs/browser: For email sending functionality
 * - Environment variables required (see .env.local.example)
 * 
 * @component
 */

'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  // Form state management
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Submission status tracking
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Handles form submission and EmailJS integration
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Load EmailJS configuration from environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      // Validate configuration exists
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS is not configured. Please check your environment variables.');
      }

      // Send email via EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'contact@deanwaring.co.uk'
        },
        publicKey
      );

      // Reset form on success
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      // Handle errors gracefully
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    }
  };

  /**
   * Updates form data as user types
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    // Full-height container with purple gradient background
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Get In Touch</h1>
          <p className="text-xl text-white/90">
            Have a question or need help? We'd love to hear from you!
          </p>
        </div>

        {/* Two-column layout: Form on left, Info cards on right. Stacks on mobile */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="John Smith"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-green-800 font-semibold">✓ Message sent successfully!</p>
                  <p className="text-green-700 text-sm mt-1">We'll get back to you as soon as possible.</p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-800 font-semibold">✗ Failed to send message</p>
                  <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button with gradient background and loading state */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 px-6 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                style={{ 
                  background: status === 'sending' ? '#9CA3AF' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {status === 'sending' ? (
                  // Animated spinner during submission
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Information Cards */}
          <div className="space-y-6">
            
            {/* Direct Email Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✉️</div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Email Us Directly</h3>
                  <a 
                    href="mailto:contact@deanwaring.co.uk" 
                    className="text-purple-600 hover:text-purple-800 font-semibold text-lg underline"
                  >
                    contact@deanwaring.co.uk
                  </a>
                </div>
              </div>
            </div>

            {/* Support Categories Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="font-bold text-xl text-gray-900 mb-6">How Can We Help?</h3>
              <div className="space-y-4">
                
                {/* General Inquiries */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">General Inquiries</h4>
                    <p className="text-sm text-gray-600">Questions about courses or how GCSE FastTrack works</p>
                  </div>
                </div>

                {/* Technical Support */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl">🛠️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Technical Support</h4>
                    <p className="text-sm text-gray-600">Having trouble accessing lessons or technical issues</p>
                  </div>
                </div>

                {/* Billing Questions */}
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl">💳</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Billing Questions</h4>
                    <p className="text-sm text-gray-600">Questions about payments or subscriptions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚡</div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">Quick Response</h3>
                  <p className="text-gray-600">We typically respond within 24 hours during weekdays.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
