/**
 * Privacy Policy Page
 * 
 * Comprehensive privacy policy explaining data collection, usage, and user rights.
 * Features card-based layout for improved readability and visual appeal.
 * 
 * Key Sections:
 * - Data collection (personal & usage information)
 * - How we use data
 * - Information sharing policies
 * - Security measures
 * - User rights (GDPR compliant)
 * - Cookie usage
 * - Children's privacy
 * - Data retention
 * - Contact information
 * 
 * Layout:
 * - Max width container (max-w-5xl)
 * - Each section in white card with subtle border and shadow
 * - Hover effects on cards for interactivity
 * - Responsive spacing and typography
 * 
 * Last Updated: November 18, 2025
 * 
 * @page
 */

export default function Privacy() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Privacy Policy</h1>
        <p className="text-sm text-white/90 text-center mb-8">
        <strong>Last Updated:</strong> November 18, 2025
      </p>
      
      <div className="space-y-6">
        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
          <p className="text-gray-700">
            Welcome to GCSE FastTrack ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">2.1 Personal Information</h3>
          <p className="mb-3 text-gray-700">We may collect the following personal information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Name and email address</li>
            <li>Account credentials (username and password)</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Profile information (optional)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">2.2 Usage Information</h3>
          <p className="mb-3 text-gray-700">We automatically collect certain information about your device and usage:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>IP address</li>
            <li>Pages visited and time spent on pages</li>
            <li>Learning progress and quiz results</li>
            <li>Course enrollment and completion data</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. How We Use Your Information</h2>
          <p className="mb-3 text-gray-700">We use the collected information for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>To provide and maintain our services</li>
            <li>To manage your account and provide customer support</li>
            <li>To process payments and prevent fraud</li>
            <li>To track your learning progress and provide personalized recommendations</li>
            <li>To send you important updates about our services</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        {/* Information Sharing */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Information Sharing and Disclosure</h2>
          <p className="mb-3 text-gray-700">We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Service Providers:</strong> Third-party companies that help us operate our services (e.g., payment processors, hosting providers)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Your Rights */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Your Rights</h2>
          <p className="mb-3 text-gray-700">You have the following rights regarding your personal information:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Objection:</strong> Object to our processing of your data</li>
            <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700">
            We use cookies and similar tracking technologies to enhance your experience. You can control cookies through your browser settings. For more information, please see our <a href="/cookies" className="text-blue-600 hover:text-blue-800 underline">Cookie Policy</a>.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Children's Privacy</h2>
          <p className="text-gray-700">
            Our services may be used by students under 18 with parental consent. We do not knowingly collect personal information from children under 13 without verifiable parental consent. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        {/* Data Retention */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Data Retention</h2>
          <p className="text-gray-700">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Contact Us</h2>
          <p className="mb-3 text-gray-700">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
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
