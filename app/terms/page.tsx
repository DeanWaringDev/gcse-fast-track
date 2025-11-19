/**
 * Terms of Service Page
 * 
 * Legal terms and conditions governing the use of GCSE FastTrack.
 * Outlines user rights, responsibilities, and platform policies.
 * 
 * Key Sections:
 * - Agreement to terms
 * - Use license and restrictions
 * - Account registration requirements
 * - Payment and subscription details (free vs paid)
 * - Intellectual property rights
 * - User content policies
 * - Disclaimers and limitations of liability
 * - Termination policies
 * - Governing law (UK)
 * - Contact information
 * 
 * Layout:
 * - Card-based design matching Privacy Policy
 * - Clear hierarchical structure
 * - Easy-to-scan sections
 * 
 * Last Updated: November 18, 2025
 * 
 * @page
 */

export default function Terms() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Terms of Service</h1>
        <p className="text-sm text-white/90 text-center mb-8">
        <strong>Last Updated:</strong> November 18, 2025
      </p>
      
      <div className="space-y-6">
        {/* Agreement to Terms */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Agreement to Terms</h2>
          <p className="text-gray-700">
            By accessing or using GCSE FastTrack, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        {/* Use License */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Use License</h2>
          <p className="mb-3 text-gray-700">Permission is granted to access our learning materials for personal, non-commercial educational use only. This license shall automatically terminate if you violate any of these restrictions.</p>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">You may not:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            <li>Share your account credentials with others</li>
          </ul>
        </section>

        {/* Account Registration */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Account Registration</h2>
          <p className="mb-3 text-gray-700">To access certain features, you must register for an account. You agree to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and update your information to keep it accurate</li>
            <li>Maintain the security of your password</li>
            <li>Accept all responsibility for activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>
        </section>

        {/* Payment and Subscriptions */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Payment and Subscriptions</h2>
          <p className="mb-3 text-gray-700">GCSE FastTrack offers both free and paid content:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Free Access:</strong> Limited to 25 lessons across all courses</li>
            <li><strong>Paid Access:</strong> Full access to all courses and lessons</li>
            <li>All payments are processed securely through third-party payment processors</li>
            <li>Prices are subject to change with notice</li>
            <li>Refunds may be available within 14 days of purchase, subject to our refund policy</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, features, and functionality on GCSE FastTrack, including but not limited to text, graphics, logos, videos, and software, are owned by GCSE FastTrack or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        {/* User Content */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. User Content</h2>
          <p className="mb-3 text-gray-700">If you submit any content (e.g., comments, feedback), you grant us:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>A worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content</li>
            <li>The right to use your feedback to improve our services</li>
          </ul>
          <p className="mt-3 text-gray-700">You represent that you own or have the necessary rights to any content you submit.</p>
        </section>

        {/* Disclaimer */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Disclaimer</h2>
          <p className="text-gray-700">
            The materials on GCSE FastTrack are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee exam results or specific grades.
          </p>
        </section>

        {/* Limitations of Liability */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Limitations of Liability</h2>
          <p className="text-gray-700">
            In no event shall GCSE FastTrack or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use our services, even if we have been notified of the possibility of such damage.
          </p>
        </section>

        {/* Termination */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
          </p>
        </section>

        {/* Governing Law */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last Updated" date. Your continued use of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Contact Us</h2>
          <p className="mb-3 text-gray-700">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-none space-y-2 ml-4 text-gray-700">
            <li><strong>Email:</strong> <a href="mailto:contact@deanwaring.co.uk" className="text-blue-600 hover:text-blue-800 underline">contact@deanwaring.co.uk</a></li>
            <li><strong>Website:</strong> <a href="/contact" className="text-blue-600 hover:text-blue-800 underline">Contact Form</a></li>
          </ul>
        </section>
      </div>
      </div>
    </div>
  );
}
