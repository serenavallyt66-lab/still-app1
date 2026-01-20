import { ContactForm } from "./contact-form";

const Contact = () => {
  return (
    <section id="contact" className="w-full py-20 md:py-28 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Get in Touch
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have a question or want to work together? Fill out the form below.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Contact;
