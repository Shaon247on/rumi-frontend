import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownContentProps = {
  content: string
  className?: string
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-5 text-4xl leading-tight font-semibold text-inherit first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-4 text-3xl leading-tight font-semibold text-inherit first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-3 text-2xl leading-tight font-semibold text-inherit first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-5 mb-3 text-xl leading-tight font-semibold text-inherit first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-5 border-l-4 border-current/20 pl-4 italic opacity-90">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="underline underline-offset-4 transition-opacity hover:opacity-75"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer noopener' : undefined}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-current/15" />,
  code: ({ children, className }) => {
    if (className) {
      return <code className={className}>{children}</code>
    }

    return (
      <code className="rounded bg-current/10 px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-2xl bg-current/5 p-4 text-sm leading-relaxed">
      {children}
    </pre>
  ),
}

const MarkdownContent = ({ content, className }: MarkdownContentProps) => {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
