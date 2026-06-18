import { Link } from 'react-router-dom'
import { Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SeafoodItem } from '@/lib/types'
import VitalityIndicator from './VitalityIndicator'
import SoldOutOverlay from './SoldOutOverlay'

interface SeafoodCardProps {
  seafood: SeafoodItem
  index?: number
}

export default function SeafoodCard({ seafood, index = 0 }: SeafoodCardProps) {
  return (
    <Link
      to={seafood.isSoldOut ? '#' : `/seafood/${seafood.id}`}
      className={cn(
        'relative block bg-ocean-800 rounded-xl overflow-hidden card-hover animate-slide-in',
        seafood.isSoldOut && 'grayscale opacity-60 pointer-events-none',
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-5xl leading-none">{seafood.emoji}</span>
          <VitalityIndicator status={seafood.vitalityStatus} showLabel size="sm" />
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <Droplets className="w-3.5 h-3.5 text-ocean-500" />
          <span className="text-xs text-foam-300 bg-ocean-700 px-2 py-0.5 rounded-full">
            池 {seafood.poolNumber}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foam-100 mb-2">
          {seafood.name}
        </h3>

        <p className="font-price text-2xl text-coral-500 price-glow mb-1">
          ¥{seafood.pricePerJin}/斤
        </p>

        <p className="text-sm text-foam-300">
          {seafood.weightMin}-{seafood.weightMax}{seafood.unit}
        </p>
      </div>

      <SoldOutOverlay isSoldOut={seafood.isSoldOut} />
    </Link>
  )
}
