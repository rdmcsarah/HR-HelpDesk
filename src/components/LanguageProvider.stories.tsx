import React from "react";
import { LanguageProvider, useLanguage } from "./LanguageProvider";

export default {
  title: "Components/LanguageProvider",
  component: LanguageProvider,
};

const LanguageSwitcherDemo = () => {
  const { language, changeLanguage } = useLanguage();
  return (
    <div style={{ padding: 24 }}>
      <h3>Current language: <b>{language}</b></h3>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => changeLanguage("en")}>English</button>{" "}
        <button onClick={() => changeLanguage("fr")}>Français</button>{" "}
        <button onClick={() => changeLanguage("ar")}>العربية</button>
      </div>
    </div>
  );
};

export const Default = () => (
  <LanguageProvider>
    <LanguageSwitcherDemo />
  </LanguageProvider>
);
