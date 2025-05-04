import Sidebar from "./SideBar";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar open={open} setOpen={setOpen}/>
      <main className={`w-full min-h-screen bg-red-50 px-4 transition-all duration-300
          ${open ? "pt-[280px]" : "pt-6"} lg:pt-6 lg:pl-64`}>{children}</main>
    </div>
  );
}
