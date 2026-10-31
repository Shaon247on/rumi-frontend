type CsvRow = Record<string, string | number | null | undefined>

const toCell = (value: CsvRow[string]) => {
  let text = String(value ?? '')

  // Stop spreadsheet apps treating customer-entered text as a formula
  if (/^[=@]/.test(text) || /^[+-]\D/.test(text)) {
    text = `'${text}`
  }

  return `"${text.replace(/"/g, '""')}"`
}

export const downloadCsv = (filename: string, rows: CsvRow[]) => {
  if (rows.length === 0) return

  const headers = Object.keys(rows[0])
  const lines = [
    headers.map(toCell).join(','),
    ...rows.map((row) => headers.map((header) => toCell(row[header])).join(',')),
  ]

  // The BOM makes Excel read Arabic text correctly
  const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
