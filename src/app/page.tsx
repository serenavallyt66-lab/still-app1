import Navigation from "@/components/landing/navigation";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Contact from "@/components/landing/contact";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 animate-in fade-in duration-1000">
        <Hero />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
