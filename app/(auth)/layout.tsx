export const metadata = {
  title: 'Magellan',
  description: 'One for all and all for One',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
