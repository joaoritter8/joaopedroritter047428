import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components'

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (next: number) => void
}) {
  const canPrev = page > 0
  const canNext = page + 1 < pageCount

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-zinc-600">
        Página <span className="font-semibold">{page + 1}</span> de <span className="font-semibold">{pageCount}</span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft size={16} />
          Anterior
        </Button>
        <Button variant="secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Próxima
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
