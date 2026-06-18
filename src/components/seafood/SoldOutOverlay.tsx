import { Link } from 'react-router-dom'
import type { SeafoodItem } from '@/lib/types'

interface SoldOutOverlayProps {
  isSoldOut: boolean
  substitute?: SeafoodItem
}

export default function SoldOutOverlay({
  isSoldOut,
  substitute,
}: SoldOutOverlayProps) {
  if (!isSoldOut) return null

  return (
    <div className="sold-out-overlay flex-col gap-2">
      <span className="text-2xl font-bold text-amber-500">售罄</span>
      {substitute && (
        <Link
          to={`/seafood/${substitute.id}`}
          className="text-sm text-foam-200 hover:text-coral-500 transition-colors"
        >
          推荐替代: {substitute.emoji} {substitute.name}
        </Link>
      )}
    </div>
  )
}
