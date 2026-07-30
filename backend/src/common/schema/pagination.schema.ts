import {z} from "zod";

export const paginationSchema = z.object({
  cursor: z.uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
});
export type PaginationDTO=z.infer<typeof paginationSchema>