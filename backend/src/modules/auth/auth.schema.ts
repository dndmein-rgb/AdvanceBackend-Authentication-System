import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/~`+=;']/,
      "Password must contain at least one special character",
    ),
}).strict();

export const loginUserSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),
  password:z.string().min(1,"Password is required")
})


export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;