import { TerminalIcon, UserIcon, Gamepad2Icon, FolderClosedIcon } from "lucide-react";
import { GrTechnology } from "react-icons/gr";
import { MdArrowDropDown, MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

export default function AboutMePage() {
  const sideIcons = [
    { icon: <TerminalIcon className="w-6 h-6" />, name: "professional_info" },
    { icon: <UserIcon className="w-6 h-6" />, name: "personal_info" },
    { icon: <GrTechnology className="w-6 h-6" />, name: "tech_stack" },
    { icon: <Gamepad2Icon className="w-6 h-6" />, name: "hobbies" },
  ];

  const professionalInfo = {
    title: "professional_info",
    nav: [
      {
        leading: <MdKeyboardArrowRight className="w-5 h-5" />,
        icon: <FolderClosedIcon className="w-4 h-4 text-emerald-400" />,
        name: "experience",
      },
      {
        leading: <MdKeyboardArrowDown className="w-5 h-5" />,
        icon: <FolderClosedIcon className="w-4 h-4 text-blue-400" />,
        name: "soft_skills",
      },
    ],
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Main side icon bar */}
      <aside className="flex flex-row md:flex-col justify-between border-b md:border-r backdrop-blur-sm bg-white/8 md:w-16 w-full md:h-full overflow-auto">
        <ul className="flex flex-row md:flex-col w-full md:w-auto">
          {sideIcons.map((item) => (
            <li
              key={item.name}
              className="text-muted-foreground hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer flex justify-center md:justify-start items-center px-4 py-3 border-b md:border-b-0 md:border-b"
            >
              {item.icon}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Nested sidebar for professional info */}
        <aside className="hidden md:flex flex-col border-r backdrop-blur-sm bg-white/8 w-64 h-full overflow-auto">
          <p className="px-4 py-3 text-sm border-b text-muted-foreground flex items-center gap-2">
            <MdArrowDropDown className="w-5 h-5" />
            {professionalInfo.title}
          </p>
          <ul className="flex flex-col">
            {professionalInfo.nav.map((item) => (
              <li
                key={item.name}
                className="text-muted-foreground hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer px-4 py-2 border-b flex items-center space-x-2"
              >
                {item.leading}
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content placeholder */}
        <div className="flex-1 p-4 overflow-auto">
          <h1 className="text-2xl font-bold text-white">Content Area</h1>
          <p className="text-muted-foreground mt-2">
            Your page content goes here. Scrollable if content grows.
          </p>
          <div className="mt-4 h-[1200px] bg-gray-800/20">Dummy tall content for testing scroll</div>
        </div>
      </main>
    </div>
  );
}
