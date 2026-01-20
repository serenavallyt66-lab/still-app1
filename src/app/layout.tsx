import "@/styles/globals.css";

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
