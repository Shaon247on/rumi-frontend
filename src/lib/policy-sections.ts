type PolicySection = { title: string; content: string; list?: string[] }

const stripInlineMarks = (text: string) => text.replace(/\*\*|\*/g, '').trim()

/** Turns the dashboard's markdown policy text into sections for the legal page layout. */
export const parsePolicySections = (markdown: string, fallbackTitle: string): PolicySection[] => {
  const sections: PolicySection[] = []
  let current: PolicySection | null = null
  let paragraphs: string[] = []

  const flush = () => {
    if (current) {
      current.content = paragraphs.join('\n\n')
      sections.push(current)
    }
    paragraphs = []
  }

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim()
    const heading = line.match(/^#{1,6}\s+(.*)$/)
    const listItem = line.match(/^(?:[-*•]|\d+\.)\s+(.*)$/)

    if (heading) {
      flush()
      current = { title: stripInlineMarks(heading[1]), content: '' }
    } else if (line) {
      current ??= { title: fallbackTitle, content: '' }
      if (listItem) {
        current.list = [...(current.list ?? []), stripInlineMarks(listItem[1])]
      } else {
        paragraphs.push(stripInlineMarks(line))
      }
    }
  }

  flush()
  return sections
}
