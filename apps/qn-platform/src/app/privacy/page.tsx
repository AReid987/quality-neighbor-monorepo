import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Quality Neighbor',
  description: 'Privacy Policy for Quality Neighbor, explaining what data we collect, how we use it, and your rights.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="py-16 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Effective Date: January 1, 2025</p>

        <section className="space-y-4 mb-8">
          <p className="text-gray-600">
            Quality Neighbor ("we", "us", or "our") is committed to protecting your privacy. This Privacy
            Policy explains what information we collect, how we use it, and the choices you have. By using
            our website and services, you agree to the terms of this policy.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              Account Information: name, email, location, role (Resident/Business Owner), interests you
              choose to share.
            </li>
            <li>
              Usage Information: interactions with features (e.g., listings you create, profile updates).
            </li>
            <li>
              Communications: messages, support requests, and newsletter subscriptions.
            </li>
            <li>
              Technical Data: device, browser, and log data used to improve reliability and security.
            </li>
          </ul>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Provide and improve the platform and its features.</li>
            <li>Facilitate resident-to-resident and resident-to-business interactions.</li>
            <li>Communicate with you about your account, updates, and newsletters (with your consent).</li>
            <li>Maintain trust and safety, including fraud prevention and security monitoring.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Sharing Your Information</h2>
          <p className="text-gray-600">
            We do not sell your personal information. We may share limited data with service providers
            who help us operate the platform (e.g., hosting, analytics, email delivery) under contractual
            obligations to protect your data. We may also disclose information if required by law or to
            protect our rights and the safety of users.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Data Retention</h2>
          <p className="text-gray-600">
            We retain personal information for as long as necessary to provide services and for legitimate
            business or legal purposes. You may request deletion of your account data, subject to applicable
            legal requirements.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
          <p className="text-gray-600">
            Depending on your location, you may have rights to access, correct, delete, or restrict the
            processing of your personal information, and to opt out of certain communications. To exercise
            these rights, contact us using the information below.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Children&apos;s Privacy</h2>
          <p className="text-gray-600">
            Our services are not directed to children under 13. We do not knowingly collect personal
            information from children. If you believe a child has provided us personal information,
            please contact us and we will take appropriate steps to remove it.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">International Users</h2>
          <p className="text-gray-600">
            If you access the services from outside the United States, you acknowledge that your
            information may be processed in the U.S. where data protection laws may differ.
          </p>
        </section>

        <section className="space-y-2 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Changes to this Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. We will post the updated policy with a
            new effective date. Your continued use of the services after changes become effective
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
          <p className="text-gray-600">
            If you have questions about this Privacy Policy, please contact us at
            {' '}
            <a className="text-blue-600 hover:underline" href="mailto:support@qualityneighbor.com">
              support@qualityneighbor.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}