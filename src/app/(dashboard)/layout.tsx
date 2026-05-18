'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Toast } from '@/components/ui/Layout'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<any[]>([])
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', message: '3 goals require your attention' },
    { id: 2, type: 'success', message: 'Emily approved your Q1 goals' },
    { id: 3, type: 'info', message: 'Weekly digest ready' }
  ])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-white/10 glass backdrop-blur-xl flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <p className="font-bold text-white">ALIGNIQ</p>
              <p className="text-xs text-slate-400">Performance OS</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { href: '/dashboard', label: '📊 Dashboard', icon: 'dashboard' },
            { href: '/goals/create', label: '🎯 Create Goal', icon: 'create' },
            { href: '/goals', label: '📋 My Goals', icon: 'goals' },
            { href: '/team/dashboard', label: '👥 Team', icon: 'team' },
            { href: '/analytics', label: '📈 Analytics', icon: 'analytics' },
            { href: '/admin/dashboard', label: '⚙️ Admin', icon: 'admin' }
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Settings
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full px-4 py-2 glass text-slate-200 rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Sign Out
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl px-8 py-4 flex items-center justify-between sticky top-0 z-40"
        >
          <div>
            <p className="text-slate-400 text-sm">Good morning,</p>
            <p className="text-white font-semibold">Sarah Chen</p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-6">
            {/* Notifications Bell */}
            <motion.div className="relative">
              <button className="text-slate-400 hover:text-white transition-colors relative">
                🔔
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>
            </motion.div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 px-4 py-2 bg-white/5 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-slate-400">On Track</p>
                <p className="text-lg font-bold text-emerald-400">12/15</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-xs text-slate-400">At Risk</p>
                <p className="text-lg font-bold text-red-400">3</p>
              </div>
            </div>

            {/* Profile */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-white font-bold">SC</span>
            </motion.div>
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 right-8 space-y-3 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}
