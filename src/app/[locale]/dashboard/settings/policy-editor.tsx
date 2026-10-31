'use client'

import { useAdminPolicy, useSaveAdminPolicy } from '@/api/api-hooks/admin/dashboard.api-hooks'
import type { PolicyKind } from '@/api/query-list/admin/dashboard-query'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Plus } from 'lucide-react'
import { useRef, useState } from 'react'

const TOOLBAR = [
  { label: 'H', title: 'Section heading', className: '', linePrefix: '## ' },
  { label: 'B', title: 'Bold', className: 'font-bold', wrap: '**' },
  { label: 'I', title: 'Italic', className: 'italic', wrap: '*' },
  { label: '•', title: 'Bullet list', className: '', linePrefix: '- ' },
  { label: '1.', title: 'Numbered list', className: '', linePrefix: '1. ' },
]

export const PolicyEditor = ({
  kind,
  title,
  description,
  placeholder,
  allowNewBox = false,
}: {
  kind: PolicyKind
  title: string
  description: string
  placeholder: string
  allowNewBox?: boolean
}) => {
  const { data: policy, isLoading } = useAdminPolicy(kind)
  const { mutateAsync: savePolicy, isPending } = useSaveAdminPolicy(kind)
  const [draft, setDraft] = useState<string | null>(null)
  const [newBox, setNewBox] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const content = draft ?? policy?.content ?? ''

  const applyFormat = (tool: (typeof TOOLBAR)[number]) => {
    const textarea = textareaRef.current
    const start = textarea?.selectionStart ?? content.length
    const end = textarea?.selectionEnd ?? content.length

    if (tool.wrap) {
      const selected = content.slice(start, end) || title
      setDraft(
        `${content.slice(0, start)}${tool.wrap}${selected}${tool.wrap}${content.slice(end)}`
      )
    } else {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1
      setDraft(`${content.slice(0, lineStart)}${tool.linePrefix}${content.slice(lineStart)}`)
    }

    textarea?.focus()
  }

  const addBox = () => {
    const heading = newBox.trim()
    if (!heading) return

    setDraft(`${content.trimEnd()}${content.trim() ? '\n\n' : ''}## ${heading}\n\n`)
    setNewBox('')
    textareaRef.current?.focus()
  }

  const handleSave = async () => {
    try {
      await savePolicy({ title: policy?.title ?? title, content })
      setDraft(null)
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="size-5 text-white" />
        <h2 className="text-xl font-medium text-white">{title}</h2>
      </div>
      <p className="text-sm text-white/70">{description}</p>

      {/* Toolbar */}
      <div className="flex justify-end gap-1">
        {TOOLBAR.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            aria-label={tool.title}
            className={`rounded border border-white/30 px-2 py-1 text-xs text-white hover:bg-white/10 ${tool.className}`}
            onClick={() => applyFormat(tool)}
          >
            {tool.label}
          </button>
        ))}
      </div>

      <Textarea
        ref={textareaRef}
        aria-label={title}
        placeholder={isLoading ? 'Loading...' : placeholder}
        className="min-h-[220px] resize-y border-white/30 bg-white/10 text-white placeholder:text-white/50"
        value={content}
        disabled={isLoading}
        onChange={(event) => setDraft(event.target.value)}
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-white/60">
          {policy?.updated_at
            ? `Last saved ${new Date(policy.updated_at).toLocaleString()}`
            : 'Not saved yet. The site shows its default text until you save.'}
        </p>
        <Button
          type="button"
          className="text-dashboard bg-[#f5f4f3] px-12 hover:bg-[#e8e6e3]"
          disabled={isPending || isLoading || !content.trim()}
          onClick={() => void handleSave()}
        >
          {isPending ? 'SAVING...' : 'SAVE'}
        </Button>
      </div>

      {allowNewBox ? (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add new box"
            aria-label="New section heading"
            className="bg-dashboard flex-1 border-white/30 text-white placeholder:text-white/50"
            value={newBox}
            onChange={(event) => setNewBox(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addBox()
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            aria-label="Add section"
            className="text-dashboard bg-[#f5f4f3] hover:bg-[#e8e6e3]"
            onClick={addBox}
          >
            <Plus className="size-5" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
