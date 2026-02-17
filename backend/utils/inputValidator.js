import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(3).max(15).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  firstname: z.string().min(3).max(15).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/).optional(),
  lastname: z.string().min(3).max(15).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional()
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

export const passwordValidator = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
export function zErrorHandler(error) {
  if (!(error instanceof z.ZodError)) {
    return null;
  }
  const zError = JSON.parse(error.message);
  const fieldList = zError[0].path[0];
  return {
    code: 400,
    error: "INVALID_INPUT",
    fields: fieldList
  };
}
