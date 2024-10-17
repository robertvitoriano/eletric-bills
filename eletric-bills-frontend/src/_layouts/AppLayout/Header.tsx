import logo from "./../../assets/logo.svg";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-primary flex flex-col gap-8 p-4 justify-center lg:items-center lg:justify-start">
      <img src={logo} className="h-10" />
      <div className="flex justify-center gap-8">
        <div
          className={classNames(
            "bg-secondary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-secondary"
          )}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>
        <div
          className={classNames(
            "bg-secondary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-secondary"
          )}
          onClick={() => navigate("/invoices")}
        >
          Faturas
        </div>
      </div>
    </div>
  );
};
