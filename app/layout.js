import '../globals.css'
import { DataProvider } from "../app/components/Layout";

export const metadata = {
  title: 'Lora Manager',
  description: 'Lora manager for model collections',
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
