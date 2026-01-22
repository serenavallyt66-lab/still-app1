import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-stone-800">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>
            Your privacy is important to us. Still is designed to give you a quiet, private space to write without surveillance, tracking, or analysis.
          </p>
          
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Information We Collect</h2>
          <p>
            We collect the minimum amount of information necessary to provide our service.
          </p>
          
          <h3 className="text-xl font-serif text-stone-800 pt-4 font-medium">Guest users:</h3>
          <p>
            If you use Still without creating an account, your writing is stored locally in your browser. We do not receive, store, or process guest drafts on our servers.
          </p>
          
          <h3 className="text-xl font-serif text-stone-800 pt-4 font-medium">Registered users:</h3>
          <p>
            If you choose to create an account, we store your email address and your drafts securely using Firebase Authentication and Firestore. Your drafts are private and accessible only to you.
          </p>
          <p>
            We do not sell, share, or analyze your writing. Your content is never used for advertising or AI training.
          </p>

          <h2 className="text-2xl font-serif text-stone-800 pt-8">Security</h2>
          <p>
            We take data security seriously. We use Firebase Authentication and Firestore Security Rules to ensure that your data is protected and only accessible by you.
          </p>

          <h2 className="text-2xl font-serif text-stone-800 pt-8">Your Control</h2>
          <p>
            You may delete your drafts or stop using the service at any time. If you log out, your data remains secure and tied to your account.
          </p>
          
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Changes</h2>
          <p>
            This policy may be updated as the product evolves. Any changes will be reflected on this page.
          </p>

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
