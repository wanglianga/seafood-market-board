import { cn } from '@/lib/utils'
import type { SeafoodItem, DeviceType } from '@/lib/types'
import SeafoodCard from './SeafoodCard'

interface SeafoodGridProps {
  seafoodList: SeafoodItem[]
  deviceType: DeviceType
}

const GRID_COLS: Record<DeviceType, string> = {
  phone: 'grid-cols-1',
  tablet: 'grid-cols-2 md:grid-cols-3',
  desktop: 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  board: 'grid-cols-5',
}

export default function SeafoodGrid({
  seafoodList,
  deviceType,
}: SeafoodGridProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-foam-100 mb-6">🦞 今日活鲜</h2>
      <div
        className={cn(
          'grid',
          GRID_COLS[deviceType],
          deviceType === 'phone' ? 'gap-4' : 'gap-6',
        )}
      >
        {seafoodList.map((seafood, index) => (
          <SeafoodCard key={seafood.id} seafood={seafood} index={index} />
        ))}
      </div>
    </section>
  )
}
