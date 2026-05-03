import { Code2 } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Link href="/" className="flex items-center space-x-2 mb-8">
        <Code2 className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">Devling</span>
      </Link>
      {children}
    </div>
  );
}
