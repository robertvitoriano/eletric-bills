import logo from "./../../assets/logo.svg";
import classNames from "classnames";
export const Header = () => {
  return (
    <div className="w-full bg-primary flex flex-col gap-8 p-4  justify-center lg:items-center lg:justify-start">
      <img src={logo} className="h-10" />
      <div className="flex justify-center gap-8 ">
        <div
          className={classNames(
            "bg-secondary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-secondary"
          )}
        >
          Dashboard
        </div>
        <div
          className={classNames(
            "bg-secondary p-2 md:p-4 text-bold rounded-xl cursor-pointer hover:bg-white hover:text-secondary"
          )}
        >
          Faturas
        </div>
      </div>
    </div>
  );
};
