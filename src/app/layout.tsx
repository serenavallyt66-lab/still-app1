import "@/styles/globals.css";

export const metadata = {
  title: "Still — A quiet place to write",
  description:
    "Still is a calm, private writing space where you can think clearly and write without pressure, tracking, or distractions.",
  keywords: [
    "writing app",
    "private notes",
    "minimal writing",
    "distraction free writing",
    "calm writing space",
    "simple journal",
    "online notebook",
  ],
  authors: [{ name: "Still" }],
  creator: "Still",
  metadataBase: new URL("https://stillspace.vercel.app/"),
  openGraph: {
    title: "Still — Write slowly, think clearly",
    description:
      "A quiet digital space for focused, private writing. No tracking. No noise.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fcfbf9] text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
