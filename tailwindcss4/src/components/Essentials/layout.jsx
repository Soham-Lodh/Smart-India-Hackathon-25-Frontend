import { SidebarProvider } from "@/components/ui/sidebar";
import MemberTopNavbar from "../Navbar/navbar";
import { AdminSidebar } from "../SSidebar/dashbaord-sidebar";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {!isLoginPage && <AdminSidebar />}

        <div className="flex flex-col flex-1 w-full">
          {!isLoginPage && <MemberTopNavbar />}

          <main className="bg-[#fbf8f3] flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}


