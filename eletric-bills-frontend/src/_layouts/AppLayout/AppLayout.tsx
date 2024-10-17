import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col gap-4 relative overflow-hidden bg-secondary">
      <Header />
      <div className="flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
