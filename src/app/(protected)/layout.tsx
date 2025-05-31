import Navigation from "@/app/components/Navigation";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
   
   
           <Navigation >
   
        {children}
       

        </Navigation>
       
        </div>
     
      
        
  );
}