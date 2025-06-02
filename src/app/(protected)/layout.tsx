import Navigation from "@/components/Navigation";
// import LanguageSwitcher from "@/app/components/LanguageSwitcher";
interface Data {
  navMain: {
    title: string;
    icon?: string;
    isActive?: boolean;
    url: string;
    items?: {
      title: string;
      icon?: string;
      disabled?: boolean;
      target?: boolean;
      url: string;
      isActive?: boolean;
    }[];
  }[];
} 

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  const data: Data = {
   navMain: [
        {
          title: "Getting Started",
          url: "#",
          items: [
            {
              title: "Home",
              url: "/",
              icon: 'HomeIcon',
            },
            {
              title: "Tasks",
              url: "/tasks",
              icon: 'ClipboardCheckIcon',
            },
          ],
        },
        {
          title: "Communication",
          url: "#",
          items: [
            {
              title: "Newsletter",
              url: "/newsletter",
              icon: 'Calendar',
             
            },
            {
              title: "E-Business Card",
              url: "/ebussinesscard",
              icon: 'IdCard',
              disabled: true,
            },
            {
              title: "Training Center",
              url: "/trainingcenter",
              icon: 'GalleryVertical',
              disabled: true,
            },
          ],
        }, 
        {
          title: "Department",
          url: "#",
          items: [
            {
              title: "Customer Service",
              url: "/cs",
              icon: 'Calendar',
             
            },
            {
              title: "Maintance",
              url: "/mc",
              icon: 'IdCard',
         
            },
            {
              title: "Performance",
              url: "/performance",
              icon: 'GalleryVertical',
             
            },  {
              title: "Operation",
              url: "/operation",
              icon: 'SlackIcon',
             
            },
          ],
        },
        {
          title: "Human Resources",
          url: "#",
          items: [
            {
              title: "HR Documents",
              url: "/hrdocuments",
              icon: 'FileStack',
             
            },
            {
              title: "HR Service Disk",
              url: "/hrservicedisk",
              icon: 'Users2Icon',
              disabled: true,
            },
            {
              title: "Kelio",
              url: "https://attendance.mobilitycairo.com/open/login",
              target: true,
              icon: 'AlarmClock',
            },
            {
              title: "TalentSoft",
              url: "https://ratpdev.talent-soft.com/",
              target: true,
              icon: 'Crown',
            },
            {
              title: "Payslip",
              url: "https://hrservices.mobilitycairo.com/selfservice/",
              target: true,
              icon: 'EuroIcon',
            },
          ],
        },
        {
          title: "Documents",
          url: "#",
          items: [
            {
              title: "Policies",
              url: "/policies",
              icon: 'ScrollTextIcon',
              disabled: true,
            },
            {
              title: "Templates",
              url: "/templates",
              icon: 'FileSpreadsheet',
              disabled: true,
            },
            {
              title: "Compliance",
              url: "/compliance",
              icon: 'ScaleIcon',
              disabled: true,
            },
          ],
        },
        {
          title: "Digital",
          url: "#",
          items: [
            {
              title: "User Guide",
              url: "/digital",
              icon: 'TvMinimalIcon',
              disabled: true,
            },
            {
              title: "Digital Service Disk",
              url: "/digitalservicedisk",
              icon: 'UsersIcon',
              disabled: true,
            },
          ],
        },
      ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation data={data}>{children}</Navigation>
    </div>
  );
}
