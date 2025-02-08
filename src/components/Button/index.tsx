import React, { ReactNode, MouseEvent } from "react";
interface ButtonProps {
  active?: boolean;
  onMouseDown: (event: MouseEvent) => void;
  children: ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
  active,
  onMouseDown,
  children,
}) => {
  return (
    <span
      style={{ backgroundColor: active ? "#ddd" : "transparent" }}
      onMouseDown={onMouseDown}
    >
      {" "}
      {children}{" "}
    </span>
  );
};
