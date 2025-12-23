import { error } from 'console';
import { z } from 'zod';

export const updateUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  firstname: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/).optional(),
  lastname: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().optional()
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);

export function zErrorHandler(error) {
  if (!(error instanceof z.ZodError)) {
    return null;
  }
  const zError = JSON.parse(error.message);
  const fieldList = zError[0].path[0];
  return {
    code: 400,
    message: `Invalid inputs: ${fieldList}`
  };
}
