import { useRef } from 'react'
import { useCountUp } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface KPICardProps {
  value: number
  suffix?: string
  label: string
  description: string
  trend: 'up' | 'down'
  className?: string
}

export default function KPICard({ value, suffix = '', label, description, trend, className }: KPICardProps) {
  const valueRef = useRef<HTMLElement>(null)
  useCountUp(valueRef, value, 2.5, suffix)

  return (
    <div className={cn('bg-card rounded-xl border p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow', className)}>
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>{label}</span>
        <span className={cn(
          'text-xs font-semibold',
          trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
        )}>
          {trend === 'up' ? '↑' : '↓'} 12%
        </span>
      </div>
      <span ref={valueRef} className='text-2xl sm:text-3xl font-bold tracking-tight'>0{suffix}</span>
      <p className='text-xs text-muted-foreground mt-1'>{description}</p>
    </div>
  )
}
