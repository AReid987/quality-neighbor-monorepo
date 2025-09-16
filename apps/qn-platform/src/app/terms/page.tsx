import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Quality Neighbor',
  description: 'Terms of Service for using the Quality Neighbor platform and services.',
}

export default function TermsOfServicePage() {
  return (
    <main className="py-16 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-10">Effective Date: January 1, 2025</p>

        <section className="space-y-4 mb-8">
          <p className="text-gray-600">
            These Terms of Service (&quot;Terms&quot;) govern your use of the Quality Neighbor website and
            services (the &quot;Services&quot;). By accessing or using the Services, you agree to be bound by
            these Terms. If you do not agree, do not use the Services.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">1. Eligibility and Accounts</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>You must be at least 13 years old to use the Services.</li>
            <li>
              You are responsible for maintaining the confidentiality of your account credentials and for all
              activities under your account.
            </li>
            <li>
              You agree to provide accurate information and update it as necessary (e.g., name, location).
            </li>
          </ul>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">2. Acceptable Use</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Be respectful and lawful in all interactions and content you post.</li>
            <li>No harassment, hate speech, fraud, or illegal activities.</li>
            <li>
              Do not attempt to interfere with the Services or access other users’ data without permission.
            </li>
          </ul>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">3. Listings and Exchanges</h2>
          <p className="text-gray-600">
            Residents may post offers or requests for services, tools, or skills. You are solely responsible
            for your listings and for complying with any applicable laws. We are not a party to any agreements
            between users and do not guarantee outcomes or quality.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">4. Business Features</h2>
          <p className="text-gray-600">
            Business owners may create profiles and participate in advertising programs. Performance analytics
            and metrics are provided for informational purposes only. Advertisers must comply with applicable
            laws and guidelines and are responsible for their content.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">5. User Content and License</h2>
          <p className="text-gray-600">
            You retain ownership of content you submit. By posting content, you grant us a non-exclusive,
            worldwide, royalty-free license to use, reproduce, display, and distribute it solely to operate
            and improve the Services.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">6. Privacy</h2>
          <p className="text-gray-600">
            Your use of the Services is subject to our{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">7. Third-Party Services</h2>
          <p className="text-gray-600">
            We may integrate with third-party services (e.g., identity verification, email delivery). Your
            use of those services may be subject to their terms and privacy policies.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">8. Disclaimer of Warranties</h2>
          <p className="text-gray-600">
            The Services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
            whether express or implied, including but not limited to merchantability, fitness for a
            particular purpose, and non-infringement.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">9. Limitation of Liability</h2>
          <p className="text-gray-600">
            To the fullest extent permitted by law, Quality Neighbor will not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out of or related to your use of
            the Services.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">10. Termination</h2>
          <p className="text-gray-600">
            We may suspend or terminate your access to the Services at any time if we believe you have
            violated these Terms or to protect users and the platform.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">11. Governing Law</h2>
          <p className="text-gray-600">
            These Terms are governed by the laws of the State of Texas, without regard to its conflict of
            law principles.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">12. Changes to the Terms</h2>
          <p className="text-gray-600">
            We may update these Terms from time to time. We will post the updated Terms with a new effective
            date. Your continued use of the Services after changes become effective constitutes acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-gray-600">
            For questions about these Terms, contact us at{' '}
            <a className="text-blue-600 hover:underline" href="mailto:support@qualityneighbor.com">
              support@qualityneighbor.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}