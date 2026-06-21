import { Link } from 'react-router-dom'
import { Droplets, Sparkles, AlertTriangle, ArrowRight, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SeafoodItem } from '@/lib/types'
import { useSeafoodStore } from '@/hooks/useSeafoodStore'
import VitalityIndicator from './VitalityIndicator'
import SoldOutOverlay from './SoldOutOverlay'

interface SeafoodCardProps {
  seafood: SeafoodItem
  index?: number
}

export default function SeafoodCard({ seafood, index = 0 }: SeafoodCardProps) {
  const getSubstituteInfo = useSeafoodStore((s) => s.getSubstituteInfo)
  const substitute = (seafood.isSoldOut || seafood.isLowOxygen || seafood.needsOrderReconfirm)
    ? getSubstituteInfo(seafood.id)
    : undefined

  const getEventBadge = () => {
    if (seafood.isNewArrival) {
      return (
        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20 animate-pulse">
          <Sparkles className="w-3 h-3" />
          新货
        </div>
      )
    }
    if (seafood.isLowOxygen) {
      return (
        <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          缺氧
        </div>
      )
    }
    if (seafood.isTemporaryTransferred) {
      return (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
          <ArrowRight className="w-3 h-3" />
          换池
        </div>
      )
    }
    if (seafood.isSoldOut) {
      return (
        <div className="absolute -top-2 -right-2 bg-ocean-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-20">
          <XCircle className="w-3 h-3" />
          售罄
        </div>
      )
    }
    return null
  }

  return (
    <Link
      to={seafood.isSoldOut ? '#' : `/seafood/${seafood.id}`}
      className={cn(
        'relative block bg-ocean-800 rounded-xl overflow-hidden card-hover animate-slide-in',
        seafood.isSoldOut && 'grayscale opacity-60 pointer-events-none',
        seafood.isNewArrival && 'ring-2 ring-emerald-500/50',
        seafood.isLowOxygen && 'ring-2 ring-amber-500/50',
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {getEventBadge()}

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
          {seafood.isTemporaryTransferred && (
            <span className="text-xs text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full">
              原{seafood.originalPoolNumber}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-foam-100 mb-2">
          {seafood.name}
        </h3>

        {seafood.eventMessage && !seafood.isSoldOut && (
          <div className={cn(
            "text-xs mb-2 px-2 py-1 rounded",
            seafood.isLowOxygen && "bg-amber-500/20 text-amber-400",
            seafood.isTemporaryTransferred && "bg-blue-500/20 text-blue-400",
            seafood.isNewArrival && "bg-emerald-500/20 text-emerald-400"
          )}>
            {seafood.eventMessage}
          </div>
        )}

        <p className="font-price text-2xl text-coral-500 price-glow mb-1">
          ¥{seafood.pricePerJin}/斤
        </p>

        <p className="text-sm text-foam-300">
          {seafood.weightMin}-{seafood.weightMax}{seafood.unit}
        </p>

        {substitute && (
          <div className="mt-3 pt-3 border-t border-ocean-700/50">
            <p className="text-xs text-foam-400 mb-2">推荐替代：</p>
            <div className="flex items-center gap-2 bg-ocean-900/50 rounded-lg p-2">
              <span className="text-xl">{substitute.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foam-200 truncate">
                  {substitute.name}
                </p>
                <p className="text-xs text-foam-400">
                  ¥{substitute.pricePerJin}/斤
                  <span className={cn(
                    "ml-1",
                    substitute.priceDiff > 0 ? "text-amber-400" : "text-jade-400"
                  )}>
                    ({substitute.priceDiff > 0 ? "+" : ""}¥{substitute.priceDiff})
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <SoldOutOverlay isSoldOut={seafood.isSoldOut} />
    </Link>
  )
}
