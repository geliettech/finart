import { z } from "zod";

const email = z
  .string()
  .trim()
  .email("Enter a valid email address.");

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Enter your full name (at least 2 characters).")
      .max(100, "Name must be 100 characters or fewer."),
    email,
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[a-z]/, "Add at least one lowercase letter.")
      .regex(/[A-Z]/, "Add at least one uppercase letter.")
      .regex(/[0-9]/, "Add at least one number."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const forgotPasswordSchema = z.object({ email });
