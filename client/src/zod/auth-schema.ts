import { z } from "zod";
export const loginSchema = z.object({
  login: z
    .string()
    .min(1, "This field cannot be empty")
    .refine(
      (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(val);
        const isUsername = /^[a-zA-Z0-9_]{3,}$/.test(val);
        return isEmail || isUsername;
      },
      {
        message: "Please enter a valid username or password",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  profilePicture: z
    .any(),

  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
