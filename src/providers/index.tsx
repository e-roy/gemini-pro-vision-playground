import { ReactNode } from "react";
import { ControlProvider } from "./ControlContext";

export const Providers = ({ children }: { children: ReactNode }) => {
  return <ControlProvider>{children}</ControlProvider>;
};
