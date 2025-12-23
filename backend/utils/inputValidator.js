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


export const registrationUserSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  firstname: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  lastname: z.string().min(2).max(50).regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  email: z.string().email(),
}).refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' }
);
// erroring for zod
// export function zErrorHandler(error) {
//   if (!(error instanceof z.ZodError)) {
//     return null;
//   }
//   const zError = JSON.parse(error.message);
//   console.log("===============error obj :", zError.path[0]);
  
//   return {
//     code: 400,
//     message: `Invalid inputs: ${fieldList}`
//   };
// }

export function zErrorHandler(error) {
  if (error instanceof z.ZodError) {
    error.issues.forEach(issue => {
      const field = issue.path[0];
      const message = issue.message;

      console.log(field, message);
    });

  }
}