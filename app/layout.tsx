import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Covenant Baptist Church | Byazhin-Kubwa, Abuja",
    template: "%s | Covenant Baptist Church",
  },
  description:
    "Covenant Baptist Church, Byazhin-Kubwa, Abuja — a people called to know Christ deeply, live in the power of His resurrection, and share in the fellowship of His sufferings.",
  openGraph: {
    title: "Covenant Baptist Church, Byazhin-Kubwa, Abuja",
    description:
      "Know Christ deeply. Live in the power of His resurrection. Share in the fellowship of His sufferings.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Church",
  name: "Covenant Baptist Church",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yerima Street, Byazhin-Kubwa, Opp. YAM Market",
    addressLocality: "Kubwa, Abuja",
    addressCountry: "NG",
  },
  telephone: "+234 703 137 5406",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-parchment text-ink antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
