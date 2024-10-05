import '../globals.css'
import { DataProvider } from "../app/components/Layout";

export const metadata = {
  title: 'File Manager',
  description: 'A Next.js file manager application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
