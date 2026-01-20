import { Feather, FileText, Zap } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const About = () => {
  const features = [
    {
      icon: <Feather className="h-8 w-8 text-primary" />,
      title: "Minimalist Design",
      description:
        "A clean and intuitive interface that puts your content first, eliminating clutter and noise.",
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Focus on Content",
      description:
        "Designed to be a blank canvas, allowing your ideas to take center stage without distraction.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Built for Speed",
      description:
        "Lightweight and optimized for performance, ensuring a fast and responsive experience.",
    },
  ];

  return (
    <section id="about" className="w-full py-20 md:py-28 lg:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              What is White Canvas?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              White Canvas is a philosophy and a starting point. It's about
              providing a perfectly clean, beautiful, and performant foundation for
              your Next.js projects, so you can focus on what truly matters:
              building your application.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-1 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-none bg-transparent">
              <CardHeader className="items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="pt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
