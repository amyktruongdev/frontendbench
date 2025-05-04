import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem("accessToken"));
  const role = localStorage.getItem("role") || "user";

  useEffect(() => {
    const updateLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", updateLoginStatus);
    window.addEventListener("loginStatusChanged", updateLoginStatus);

    return () => {
      window.removeEventListener("storage", updateLoginStatus);
      window.removeEventListener("loginStatusChanged", updateLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setIsLoggedIn(false);

    // Trigger sidebar update across tabs & same tab
    window.dispatchEvent(new Event("loginStatusChanged"));

    try {
      await fetch(`${process.env.REACT_APP_DOMAIN_NAME}api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/");
  };

  const MenuButtons = ({ close }: { close?: () => void }) => (
    <div className="flex flex-col gap-3 mt-2">
    {!isLoggedIn && (
      <>
        <Link to="/login"><Button className="w-full bg-red-500 text-white" onClick={close}>Login</Button></Link>
        <Link to="/registration"><Button className="w-full bg-red-500 text-white" onClick={close}>Register</Button></Link>
        <Link to="/dashboard"><Button className="w-full bg-red-500 text-white" onClick={close}>Dashboard</Button></Link>
        <Link to="/equipment-map"><Button className="w-full bg-red-500 text-white" onClick={close}>Equipment Map</Button></Link>
      </>
    )}

    {isLoggedIn && (
      <>
        <Link to="/dashboard"><Button className="w-full bg-red-500 text-white" onClick={close}>Dashboard</Button></Link>
        <Link to="/equipment-map"><Button className="w-full bg-red-500 text-white" onClick={close}>Equipment Map</Button></Link>

        {(role === "admin" || role === "technician") && (
          <>
            <Link to="/equipment"><Button className="w-full bg-red-500 text-white" onClick={close}>Gym Equipment</Button></Link>
            <Link to="/sensors"><Button className="w-full bg-red-500 text-white" onClick={close}>Sensor Status</Button></Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin"><Button className="w-full bg-red-500 text-white" onClick={close}>Admin Panel</Button></Link>
        )}

        {role === "technician" && (
          <Link to="/technician"><Button className="w-full bg-red-500 text-white" onClick={close}>Technician Tools</Button></Link>
        )}

        <Button
          onClick={() => {
            handleLogout();
            if (close) close();
          }}
          className="w-full bg-gray-300 text-black hover:bg-gray-400"
        >
          Logout
        </Button>
      </>
    )}
  </div>
);

  return (
    <>
      {/* 🍔 Hamburger Button (Mobile Only) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl text-red-600 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white shadow-xl p-6 overflow-y-auto pt-20">
          {/* Remove 'Navigation' title on mobile for clean UI */}
          <MenuButtons close={() => setOpen(false)} />
        </div>
      )}

      {/* 💻 Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-red-200 p-6 flex-col z-30">
        <div className="text-xl font-bold text-red-600 mb-4">Navigation</div>
        <MenuButtons />
      </div>
    </>
  );
}
