import { useEffect, useRef, useState } from 'react'

const variants = {
  up: 'animate-fade-up',
  fade: 'animate-fade-in',
  left: 'animate-slide-left',
  scale: 'animate-scale-in'
}

const Reveal = ({ children, delay = 0, variant = 'up', className = '' }) => {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${visible ? variants[variant] : 'opacity-0'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default Reveal