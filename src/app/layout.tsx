import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import Providers from "~/components/Providers";
import { UserProvider } from "~/components/AuthComponent";
import { Toaster } from "~/components/ui/sonner";
import MyLayout from "~/components/MyLayout";
import { ThemeProvider } from "~/components/theme-provider";

export const metadata: Metadata = {
  title: "The Brielle App | Home",
  description: "Give a Desc",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <MyLayout>{children}</MyLayout>
              <Toaster />
            </ThemeProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
