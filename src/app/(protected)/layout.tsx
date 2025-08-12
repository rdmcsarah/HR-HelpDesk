import { cookies } from "next/headers";
import ClientLayout from "./client-layout";

export default async function ProtectedServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get cookies in the server component
  const cookieStore = await cookies();
  const sessionAuth = cookieStore.get("session_auth")?.value;
  
  return (
    <ClientLayout sessionAuth={sessionAuth}>
      {children}
    </ClientLayout>
  );
}

