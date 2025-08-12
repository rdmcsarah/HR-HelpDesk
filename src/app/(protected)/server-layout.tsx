import { cookies } from "next/headers";
import ClientLayout from "./client-layout";

export default async function ProtectedServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionAuth = (await cookies()).get("session_auth")?.value;
  
  return (
    <ClientLayout sessionAuth={sessionAuth}>
      {children}
    </ClientLayout>
  );
}
