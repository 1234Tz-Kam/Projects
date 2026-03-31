import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'ERCS — Emergency Response Coordination System',
  description: 'Report, manage, and track emergency incidents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
