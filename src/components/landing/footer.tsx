import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
    { name: "GitHub", icon: <Github className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
  ];

  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} White Canvas. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
          {socialLinks.map((social) => (
            <Button key={social.name} variant="ghost" size="icon" asChild>
              <Link href={social.href}>
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
