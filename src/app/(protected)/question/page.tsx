"use client";

import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
const faqItems = [
  {
    id: "item-1",
    question: "When will I receive my Debit Card?",
    answer: "You will receive your Debit Card within two weeks from your hire date. A message will be sent to you via WhatsApp once it is ready for collection.",
  },
  {
    id: "item-2",
    question: "What is the status of my medical reimbursement?",
    answer: "Please follow up on the status of your medical reimbursement through the Next Care application, 'Lumi by Next Care'.",
  },
  {
    id: "item-3",
    question: "How can I reset my password?",
    answer: "To reset your password, please contact the Payroll Team via email or WhatsApp. They will assist you with the process.",
  },
  {
    id: "item-4",
    question: "How can I view my payslip?",
    answer: "You can view your payslip through the Human Plus self-service application. Just log in and navigate to the payslip or salary section, and you'll be able to see and download your payslips there.",
  },
  {
    id: "item-5",
    question: "What benefits do I have with Khazna?",
    answer: "Khazna offers a range of financial wellness tools including salary advances, savings, and more.",
  },
  {
    id: "item-6",
    question: "When will I get my salary in my account?",
    answer: "Salaries are typically transferred to your bank account around the 27th of each month. If the scheduled payment date falls on a public holiday or weekend, the transfer will be processed on the first official working day thereafter.",
  },
  {
    id: "item-7",
    question: "What is the maximum amount of coverage of our medical insurance?",
    answer: "The insurer will cover up to 250,000 in eligible medical expenses per year.",
  },
  {
    id: "item-8",
    question: "How do I know my annual leave balance, and when can I start taking leave?",
    answer: "Your annual leave balance will be updated in our HR system, Kelio where you can view it. You will be eligible to start utilizing annual leave after completing your probation period, which is typically 3 months. Please refer to the company's leave policy for more detailed information.",
  },
  {
    id: "item-9",
    question: "When can I expect to receive my first salary, and what is the regular payroll schedule?",
    answer: "Your first salary will be paid on the next scheduled payroll date following your start date. Our standard payroll cycle is 16th of the current month till 15th of the next month. Salaries are typically paid around the 27th of each month. Any variations due to public holidays will be communicated in advance.",
  },
  {
    id: "item-10",
    question: "How will my social insurance contributions be managed, and what do I need to do?",
    answer: "Your social insurance contributions will be automatically deducted from your monthly salary in accordance with local regulations. The company will handle the registration process with the relevant social insurance authority. You don't need to take any independent action from your end.",
  }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();
  const { empcode } = useParams();

  // RTL/LTL handling
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }
    setMounted(true);
  }, [i18n.language]);

  const filteredItems = faqItems.filter((item) => {
    // Get translated versions
    const translatedQuestion = t(`faq.items.${item.id}.question`);
    const translatedAnswer = t(`faq.items.${item.id}.answer`);
    // const translatedCategory = t(`faq.items.${item.id}.category`);

    // Check if search term matches any of the translated versions
    return (
      translatedQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translatedAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // translatedCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Also include original English versions for completeness
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) 
      // item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 xs:p-4 md:p-8"
      style={{
        backgroundImage: "url('/assets/bg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="w-full h-auto m-2 xs:m-4 rounded-lg shadow-lg overflow-hidden grid grid-rows 
                bg-gray-100/90 dark:bg-gray-800/90 
                text-gray-900 dark:text-gray-100 
                backdrop-blur-sm md:backdrop-blur-md"
      >
        <div className="items-center justify-center m-3 xs:m-6">
          <h1 className="text-center text-xl xs:text-2xl sm:text-3xl font-bold px-2">
            {t("faq.title")}
          </h1>

          <div className="items-center justify-center m-3 xs:m-6">
            <Input
              placeholder={t("faq.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-[800px] mb-4 xs:mb-6 mx-auto dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border border-gray-400 dark:border-gray-600 rounded-md"
            />
            {filteredItems.length === 0 ? (
              <p className="text-center text-sm xs:text-base text-gray-500 dark:text-gray-400 px-2">
                {t("faq.noResults")}
              </p>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger className="text-base xs:text-lg hover:no-underline px-2 xs:px-4">
                      {t(`faq.items.${item.id}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="px-2 xs:px-4 pb-3">
                      <div className="text-sm xs:text-base">
                        {t(`faq.items.${item.id}.answer`)}
                      </div>
                      {/* <div className="mt-2 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                        {t("faq.category")}:{" "}
                        {t(`faq.items.${item.id}.category`)}
                      </div> */}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
