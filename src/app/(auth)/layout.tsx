import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center justify-center min-h-full p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        {children}
      </div>
    </main>
  );
}
