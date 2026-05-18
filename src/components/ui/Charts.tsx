'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#6C5CE7', '#00B5D8', '#7FBA00', '#FFB900', '#E81123']

interface ChartProps {
  data: any[]
  title?: string
  height?: number
}

export const AnimatedBarChart = ({ data, title, height = 300 }: ChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-xl"
  >
    {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis stroke="rgba(255,255,255,0.3)" />
        <YAxis stroke="rgba(255,255,255,0.3)" />
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
          formatter={(value: any) => [value, 'Value']}
        />
        <Legend />
        <Bar dataKey="value" fill="#6C5CE7" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </motion.div>
)

export const AnimatedLineChart = ({ data, title, height = 300 }: ChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-xl"
  >
    {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis stroke="rgba(255,255,255,0.3)" />
        <YAxis stroke="rgba(255,255,255,0.3)" />
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6C5CE7"
          strokeWidth={2}
          dot={{ fill: '#6C5CE7', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </motion.div>
)

export const AnimatedAreaChart = ({ data, title, height = 300 }: ChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-xl"
  >
    {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis stroke="rgba(255,255,255,0.3)" />
        <YAxis stroke="rgba(255,255,255,0.3)" />
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#6C5CE7"
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  </motion.div>
)

export const AnimatedPieChart = ({ data, title, height = 300 }: ChartProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-6 rounded-xl"
  >
    {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  </motion.div>
)
