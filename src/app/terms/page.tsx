import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-stone-800">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Terms of Service</h1>
        <div className="space-y-6 text-stone-600 leading-relaxed">
            <p className="text-sm text-stone-400">Last updated: (Date will be added)</p>

            <p>Welcome to Still. By using this website or creating an account, you agree to the following terms. Please read them carefully.</p>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">1. Purpose of the Service</h2>
            <p>Still provides a quiet, distraction-free space for writing and personal thinking.</p>
            <p>The service is designed to be simple and calm. We do not offer productivity analytics, AI feedback, or content analysis in Phase 1.</p>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">2. Accounts and Access</h2>
            <p>You may use Still in two ways:</p>
            <h3 className="text-lg font-serif text-stone-800 pt-2 font-medium">Guest mode</h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>You may write without creating an account.</li>
                <li>Guest drafts are stored locally in your browser.</li>
                <li>Clearing browser data may permanently delete guest drafts.</li>
            </ul>
             <h3 className="text-lg font-serif text-stone-800 pt-2 font-medium">Registered users</h3>
             <ul className="list-disc list-inside space-y-2 pl-2">
                <li>If you create an account, your drafts are saved securely using Firebase Authentication and Firestore.</li>
                <li>You are responsible for maintaining access to your account credentials.</li>
            </ul>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">3. Your Content</h2>
            <p>You retain full ownership of everything you write in Still.</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>We do not read, analyze, sell, or share your content.</li>
              <li>Your drafts are private and accessible only by you.</li>
              <li>Still does not claim any rights over your writing.</li>
            </ul>
            
            <h2 className="text-2xl font-serif text-stone-800 pt-8">4. Data Storage and Availability</h2>
             <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Guest drafts are stored only on your device.</li>
                <li>Registered user drafts are stored securely in the cloud.</li>
                <li>While we take care to protect your data, Still is provided “as is” and we cannot guarantee uninterrupted access or permanent availability.</li>
                <li>We recommend keeping personal backups for important writing.</li>
            </ul>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">5. Acceptable Use</h2>
            <p>You agree not to use Still to:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Violate any applicable laws</li>
                <li>Attempt to access other users’ data</li>
                <li>Abuse or disrupt the service</li>
            </ul>
            <p>Still is intended for personal, lawful use.</p>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">6. Account Termination</h2>
             <ul className="list-disc list-inside space-y-2 pl-2">
                <li>You may stop using the service at any time.</li>
                <li>We may suspend or terminate accounts that violate these terms or misuse the service.</li>
            </ul>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">7. Changes to the Service</h2>
            <p>Still is evolving. Features may change, be added, or removed over time.</p>
            <p>If these terms change, updates will be reflected on this page.</p>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">8. Limitation of Liability</h2>
            <p>Still is provided without warranties of any kind. We are not liable for:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Loss of drafts due to device issues, browser clearing, or external failures</li>
                <li>Temporary service interruptions</li>
            </ul>

            <h2 className="text-2xl font-serif text-stone-800 pt-8">9. Contact</h2>
            <p>If you have questions about these terms, you may contact us through the website.</p>

           <div className="pt-12">
             <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors">
                &larr; Back to home
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
