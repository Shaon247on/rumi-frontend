'use client'

import { Button } from '@/components/ui'
import { downloadCsv } from '@/lib/export-csv'
import { useState } from 'react'
import toast from 'react-hot-toast'

export const EXPORT_PAGE_SIZE = 1000

/**
 * Downloads a CSV of everything matching the current filters,
 * or only the ticked rows when some are selected.
 */
export const ExportButton = ({
  filename,
  loadRows,
  selectedCount = 0,
}: {
  filename: string
  loadRows: () => Promise<Record<string, string | number | null | undefined>[]>
  selectedCount?: number
}) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const rows = await loadRows()
      if (rows.length === 0) {
        toast('Nothing to export yet.')
        return
      }
      downloadCsv(filename, rows)
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-white/30 bg-transparent text-white"
      disabled={isExporting}
      onClick={() => void handleExport()}
    >
      {isExporting ? 'EXPORTING...' : selectedCount > 0 ? `EXPORT (${selectedCount})` : 'EXPORT'}
    </Button>
  )
}
