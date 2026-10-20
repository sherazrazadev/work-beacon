import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CookieConsent } from "@/components/cookie-consent";
import { BRAND } from "@/lib/brand";
import { siteUrl } from "@/lib/seo-routes";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const base = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: `${BRAND.name} — Enterprise platform for HR, Finance & IT`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BRAND.name,
    title: `${BRAND.name} — Enterprise platform for HR, Finance & IT`,
    description: BRAND.description,
    url: base,
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: BRAND.accent,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip font-[family-name:var(--font-body)]">
        <AuthProvider>
          {children}
          <CookieConsent />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
