// @ts-ignore: side-effect import for global CSS
import '../styles/globals.css'

export const metadata = {
  title: 'ALIGNIQ | Goal Intelligence Operating System',
  description: 'Enterprise-grade AI-powered performance management'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
