import { z } from "zod";

export const CreateNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content too long"),
});

export const UpdateNoteSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(200, "Title too long")
      .optional(),
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(5000, "Content too long")
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field (title or content) must be provided",
  });

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const NoteParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  count: z.number().optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const DeleteResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type Note = z.infer<typeof NoteSchema>;
export type CreateNoteRequest = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteRequest = z.infer<typeof UpdateNoteSchema>;
export type NoteParams = z.infer<typeof NoteParamsSchema>;
