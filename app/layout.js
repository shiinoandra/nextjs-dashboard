import '../globals.css'

export const metadata = {
  title: 'File Manager',
  description: 'A Next.js file manager application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
