export const metadata = {
  title: 'Task Manager',
  description: 'A simple and efficient task management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
