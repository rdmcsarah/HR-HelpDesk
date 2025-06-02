import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Suspense } from "react";

export default function ChangeLanguagePage() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <Suspense fallback={<div>Loading language switcher...</div>}>
        <LanguageSwitcher />
      </Suspense>
    </div>
  );
}