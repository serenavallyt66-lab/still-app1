import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative w-full py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Your Blank Slate for Creativity
            </h1>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              White Canvas gives you the space to imagine, create, and innovate
              without distractions. A minimal starting point for your next big
              idea.
            </p>
          </div>
          <Link href="#contact">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
