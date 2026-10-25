import { z } from 'zod'

const blankToUndefined = (value: string | undefined) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** The Home route's URL search params: `?q=<name>&region=<region slug>`. */
export const homeSearchSchema = z.object({
  q: z.string().optional().catch(undefined).transform(blankToUndefined),
  region: z.string().optional().catch(undefined).transform(blankToUndefined),
})

export type HomeSearch = z.infer<typeof homeSearchSchema>
