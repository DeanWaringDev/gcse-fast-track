/**
 * Cookie Policy Page
 * 
 * Detailed explanation of cookie usage on GCSE FastTrack platform.
 * Covers cookie types, purposes, and user control options.
 * 
 * Key Sections:
 * - What are cookies (definition)
 * - How we use cookies
 * - Types of cookies:
 *   - Strictly necessary (essential functionality)
 *   - Functionality (preferences, personalization)
 *   - Analytics & performance (usage tracking)
 * - Third-party cookies
 * - Session vs persistent cookies
 * - How to manage/disable cookies
 * - Impact of blocking cookies
 * - Do Not Track signals
 * - Contact information
 * 
 * Layout:
 * - Consistent card-based design
 * - Clear subsections for different cookie types
 * - User-friendly language
 * 
 * Last Updated: November 18, 2025
 * 
 * @page
 */

export default function Cookies() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Cookie Policy</h1>
        <p className="text-sm text-white/90 text-center mb-8">
        <strong>Last Updated:</strong> November 18, 2025
      </p>
      
      <div className="space-y-6">
        {/* What Are Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. What Are Cookies</h2>
          <p className="text-gray-700">
            Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, understanding how you use our site, and improving our services.
          </p>
        </section>

        {/* How We Use Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. How We Use Cookies</h2>
          <p className="mb-3 text-gray-700">We use cookies for the following purposes:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., authentication, security)</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
            <li><strong>Performance Cookies:</strong> Improve website speed and performance</li>
          </ul>
        </section>

        {/* Types of Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Types of Cookies We Use</h2>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">3.1 Strictly Necessary Cookies</h3>
          <p className="mb-4 text-gray-700">
            These cookies are essential for you to browse our website and use its features. Without these cookies, services you have asked for cannot be provided. These cookies do not gather information about you for marketing purposes.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">3.2 Functionality Cookies</h3>
          <p className="mb-4 text-gray-700">
            These cookies allow our website to remember choices you make (such as your user name, language, or region) and provide enhanced, more personal features. They may also be used to track your learning progress and provide personalized course recommendations.
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">3.3 Analytics and Performance Cookies</h3>
          <p className="text-gray-700">
            These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us optimize our website and improve user experience. All information collected is aggregated and anonymous.
          </p>
        </section>

        {/* Third-Party Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Third-Party Cookies</h2>
          <p className="mb-3 text-gray-700">We may use third-party services that set cookies on your device:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Payment Processors:</strong> To securely process payments</li>
            <li><strong>Analytics Services:</strong> To analyze website traffic and usage patterns</li>
            <li><strong>Authentication Services:</strong> To manage user login and security</li>
          </ul>
          <p className="mt-3 text-gray-700">
            These third parties have their own privacy policies governing their use of information.
          </p>
        </section>

        {/* Session vs Persistent Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Session vs. Persistent Cookies</h2>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser. Used for authentication and navigation.</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until you delete them. Used to remember your preferences and settings.</li>
          </ul>
        </section>

        {/* Managing Cookies */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. How to Manage Cookies</h2>
          <p className="mb-3 text-gray-700">
            You can control and manage cookies in various ways:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Browser Settings</h3>
          <p className="mb-3 text-gray-700">Most browsers allow you to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
            <li>View what cookies are stored and delete them individually</li>
            <li>Block third-party cookies</li>
            <li>Block all cookies from specific websites</li>
            <li>Block all cookies entirely</li>
            <li>Delete all cookies when you close your browser</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800">Impact of Blocking Cookies</h3>
          <p className="text-gray-700">
            Please note that blocking or deleting cookies may impact your ability to use certain features of our website. Essential cookies are necessary for the site to function, and blocking them may prevent you from accessing key features like your account or progress tracking.
          </p>
        </section>

        {/* Do Not Track */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Do Not Track Signals</h2>
          <p className="text-gray-700">
            Some browsers include a "Do Not Track" feature. Our website currently does not respond to "Do Not Track" signals, as there is no industry standard for how to respond to such signals.
          </p>
        </section>

        {/* Changes to Cookie Policy */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Changes to This Cookie Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check this page periodically for updates.
          </p>
        </section>

        {/* Contact Us */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Contact Us</h2>
          <p className="mb-3 text-gray-700">
            If you have any questions about our use of cookies, please contact us:
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
