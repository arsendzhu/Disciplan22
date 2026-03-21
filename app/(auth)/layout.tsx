export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[720px] items-center px-lg py-xxl sm:px-xl">
      {children}
    </main>
  );
}
