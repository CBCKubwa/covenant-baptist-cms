import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[1000] focus:bg-gold focus:text-navy focus:px-4 focus:py-3 focus:font-bold"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
