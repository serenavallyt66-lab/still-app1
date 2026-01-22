import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-stone-800">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>This is a placeholder for your Privacy Policy.</p>
          <p>
            Your privacy is important to us. It is Still's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>
          <p>
            For users who create an account, we store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.
          </p>
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Security</h2>
          <p>
            The security of your data is important to us. We use Firebase Authentication and Firestore Security Rules to protect your data. Your drafts are stored securely and are only accessible by you.
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
