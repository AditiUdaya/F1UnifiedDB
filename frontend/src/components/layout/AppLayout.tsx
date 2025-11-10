import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { Navbar } from "./Navbar";

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto bg-gradient-dark">
          <Outlet />
        </main>
        
        <StatusBar />
      </div>
    </div>
  );
};
