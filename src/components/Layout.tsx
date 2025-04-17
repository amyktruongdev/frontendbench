import Sidebar from "./SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-red-50 min-h-screen">{children}</main>
    </div>
  );
}
