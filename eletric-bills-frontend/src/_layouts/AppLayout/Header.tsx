import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import logo from "./../../assets/logo.svg";
export const Header = () => {
  const location = useLocation();
  return (
    <div className="w-full bg-transparent flex p-4 gap-2 justify-center lg:items-center lg:justify-start">
      <img src={logo} />
    </div>
  );
};
