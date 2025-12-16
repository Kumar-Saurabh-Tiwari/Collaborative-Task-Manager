import '../globals.css';

export const metadata = {
  title: 'Task Manager',
  description: 'A comprehensive task management application with real-time collaboration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
