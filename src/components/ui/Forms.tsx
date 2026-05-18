'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import React from 'react'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-500/50',
  secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
  glass: 'glass text-slate-200 hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700'
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    children,
    ...props
  }, ref) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        ref={ref}
        className={`
          font-semibold rounded-lg transition-all
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className = '', ...props }, ref) {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white/5 border border-white/10
            text-slate-100 placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-purple-500
            transition-all
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, options, error, className = '', ...props }, ref) {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white/5 border border-white/10
            text-slate-100
            focus:outline-none focus:ring-2 focus:ring-purple-500
            transition-all
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className = '', ...props }, ref) {
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
        <textarea
          ref={ref}
          className={`
            w-full px-3 py-2 rounded-lg
            bg-white/5 border border-white/10
            text-slate-100 placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-purple-500
            transition-all resize-none
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }
)
