import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fcfbf9] font-sans text-stone-800">
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Terms of Service</h1>
        <div className="space-y-6 text-stone-600 leading-relaxed">
          <p>This is a placeholder for your Terms of Service.</p>
          <p>
            By accessing this website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Still's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
          <h2 className="text-2xl font-serif text-stone-800 pt-8">Disclaimer</h2>
          <p>
           The materials on Still's website are provided on an 'as is' basis. Still makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
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
