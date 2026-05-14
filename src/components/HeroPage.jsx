import { NavLink } from "react-router-dom";
export const HeroPage = () => {
  return (
    <div>
      <NavLink to="/dashboard" className="text-3xl font-bold">
        Ir al Dashboard
      </NavLink>
    </div>
  );
};