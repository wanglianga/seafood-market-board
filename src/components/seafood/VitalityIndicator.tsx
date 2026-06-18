import { cn } from '@/lib/utils'
import type { SeafoodItem } from '@/lib/types'

interface VitalityIndicatorProps {
  status: SeafoodItem['vitalityStatus']
  showLabel?: boolean
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<
  SeafoodItem['vitalityStatus'],
  { className: string; label: string }
> = {
  alive: { className: 'vitality-alive', label: '鲜活' },
  weak: { className: 'vitality-weak', label: '活力不足' },
  dead: { className: 'vitality-dead', label: '已死亡' },
  low_oxygen: { className: 'vitality-low-oxygen', label: '缺氧⚠' },
}

export default function VitalityIndicator({
  status,
  showLabel = false,
  size = 'md',
}: VitalityIndicatorProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'rounded-full',
          size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5',
          config.className,
        )}
      />
      {showLabel && (
        <span className="text-xs text-foam-300">{config.label}</span>
      )}
    </span>
  )
}
