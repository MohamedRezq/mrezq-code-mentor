import { HomeHeader } from "@/components/layout/home-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HomeHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
