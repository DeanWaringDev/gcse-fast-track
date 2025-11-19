/**
 * Acceptable Use Policy Page
 * 
 * Guidelines for appropriate use of GCSE FastTrack platform.
 * Outlines permitted activities and prohibited behaviors.
 * 
 * Key Sections:
 * - Introduction and policy overview
 * - Permitted uses
 * - Prohibited activities:
 *   - Illegal activities
 *   - Account misuse
 *   - Content violations
 *   - Security violations
 *   - Harmful conduct
 * - Commercial use restrictions
 * - Academic integrity expectations
 * - Monitoring and enforcement policies
 * - Consequences of violations
 * - Reporting violations
 * - Contact information
 * 
 * Layout:
 * - Card-based sections for clarity
 * - Organized by violation categories
 * - Clear consequences outlined
 * 
 * Last Updated: November 18, 2025
 * 
 * @page
 */

export default function AcceptableUse() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Acceptable Use Policy</h1>
        <p className="text-sm text-white/90 text-center mb-8">
        <strong>Last Updated:</strong> November 18, 2025
      </p>
      
      <div className="space-y-6">
        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Introduction</h2>
          <p className="text-gray-700">
            This Acceptable Use Policy outlines the permitted and prohibited uses of GCSE FastTrack. By using our services, you agree to comply with this policy. Violation of this policy may result in suspension or termination of your account.
          </p>
        </section>

        {/* Permitted Use */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Permitted Use</h2>
          <p className="mb-3 text-gray-700">You may use GCSE FastTrack for:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Personal educational purposes and GCSE exam preparation</li>
            <li>Accessing and studying course materials you are authorized to view</li>
            <li>Tracking your own learning progress</li>
            <li>Communicating with our support team for legitimate inquiries</li>
            <li>Providing feedback to improve our services</li>
          </ul>
        </section>

        {/* Prohibited Activities */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Prohibited Activities</h2>
          <p className="mb-3 text-gray-700">You must not use GCSE FastTrack to:</p>
          
          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-800">3.1 Illegal Activities</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Engage in any illegal or fraudulent activity</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-800">3.2 Account Misuse</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Share your account credentials with others</li>
            <li>Create multiple accounts to circumvent free lesson limits</li>
            <li>Use another person's account without permission</li>
            <li>Impersonate any person or entity</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-800">3.3 Content Violations</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Copy, distribute, or republish our course materials</li>
            <li>Scrape, download, or systematically extract content</li>
            <li>Modify, adapt, or create derivative works from our content</li>
            <li>Remove copyright or proprietary notices</li>
            <li>Use automated systems (bots, scrapers) to access our services</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-800">3.4 Security Violations</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt our services or servers</li>
            <li>Introduce viruses, malware, or other malicious code</li>
            <li>Circumvent security measures or access controls</li>
            <li>Probe, scan, or test vulnerabilities of our systems</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4 text-gray-800">3.5 Harmful Conduct</h3>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Harass, abuse, or threaten other users or our staff</li>
            <li>Submit false, misleading, or fraudulent information</li>
            <li>Use our services in a way that harms our reputation</li>
            <li>Engage in any activity that could damage our services</li>
          </ul>
        </section>

        {/* Commercial Use Restrictions */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Commercial Use Restrictions</h2>
          <p className="mb-3 text-gray-700">Without our prior written consent, you may not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Use our services for commercial purposes</li>
            <li>Resell or redistribute our content</li>
            <li>Use our materials in a commercial training program</li>
            <li>Display our content on other websites or platforms</li>
          </ul>
        </section>

        {/* Academic Integrity */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Academic Integrity</h2>
          <p className="text-gray-700">
            GCSE FastTrack is designed to help you learn and prepare for exams. While we provide comprehensive study materials, you are expected to use them ethically. Do not use our services to cheat on actual exams or assessments. Our content is for study and preparation purposes only.
          </p>
        </section>

        {/* Monitoring and Enforcement */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Monitoring and Enforcement</h2>
          <p className="mb-3 text-gray-700">We reserve the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Monitor use of our services to ensure compliance with this policy</li>
            <li>Investigate potential violations</li>
            <li>Remove or disable access to any content that violates this policy</li>
            <li>Suspend or terminate accounts that violate this policy</li>
            <li>Cooperate with law enforcement when necessary</li>
          </ul>
        </section>

        {/* Consequences of Violations */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Consequences of Violations</h2>
          <p className="mb-3 text-gray-700">Violations of this Acceptable Use Policy may result in:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>Warning and request to cease the violating activity</li>
            <li>Temporary suspension of your account</li>
            <li>Permanent termination of your account</li>
            <li>Loss of access to paid content without refund</li>
            <li>Legal action if warranted</li>
          </ul>
        </section>

        {/* Reporting Violations */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Reporting Violations</h2>
          <p className="text-gray-700">
            If you become aware of any violation of this Acceptable Use Policy, please report it to us immediately at <a href="mailto:contact@deanwaring.co.uk" className="text-blue-600 hover:text-blue-800 underline">contact@deanwaring.co.uk</a>.
          </p>
        </section>

        {/* Changes to This Policy */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Acceptable Use Policy from time to time. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Contact Us</h2>
          <p className="mb-3 text-gray-700">
            If you have questions about this Acceptable Use Policy, please contact us:
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
