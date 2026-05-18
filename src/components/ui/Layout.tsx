'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

interface TabsProps {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>
  defaultTab?: string
}

export const Tabs = React.memo(function Tabs({ tabs, defaultTab }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0].id)

  return (
    <div className="w-full">
      <div className="flex gap-2 border-b border-white/10 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`
              pb-3 px-4 font-medium transition-all
              ${active === tab.id
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tabs.find(t => t.id === active)?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }

export const Modal = React.memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeMap[size]} bg-gradient-to-b from-gray-900 to-black border border-white/10 rounded-xl p-6 z-50`}
          >
            <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
            <div className="mb-6">
              {children}
            </div>
            {actions && (
              <div className="flex gap-3 justify-end">
                {actions}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  onClose: () => void
}

const typeStyles = {
  success: 'bg-emerald-500/20 border-emerald-500 text-emerald-200',
  error: 'bg-red-500/20 border-red-500 text-red-200',
  info: 'bg-blue-500/20 border-blue-500 text-blue-200',
  warning: 'bg-amber-500/20 border-amber-500 text-amber-200'
}

export const Toast = React.memo(function Toast({
  id,
  type,
  message,
  onClose
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`glass border ${typeStyles[type]} px-4 py-3 rounded-lg flex items-center gap-3`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-sm hover:opacity-70 transition-opacity"
      >
        ✕
      </button>
    </motion.div>
  )
})

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
  children: React.ReactNode
}

export const Sidebar = React.memo(function Sidebar({
  isOpen,
  onClose,
  children
}: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black border-r border-white/10 z-30"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
        />
      )}
    </>
  )
})
