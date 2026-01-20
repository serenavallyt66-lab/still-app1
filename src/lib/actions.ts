"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormState = {
  message: string;
  status: "success" | "error" | "idle";
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.message?.[0] || "Invalid data provided.",
      status: "error",
    };
  }

  try {
    // Here you would typically send an email, save to a database, etc.
    // For this example, we'll just log it.
    console.log("New contact form submission:", validatedFields.data);

    revalidatePath("/");
    return {
      message: "Thank you for your message! We'll be in touch soon.",
      status: "success",
    };
  } catch (e) {
    console.error(e);
    return {
      message: "An unexpected error occurred. Please try again.",
      status: "error",
    };
  }
}
