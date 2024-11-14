"use client";
import React, { ReactNode, use, useState } from "react";

function Button({
  children,
  action,
  ...props
}: { children: ReactNode; action?: () => void } & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const [isLoading, setLoading] = useState(false);

  function handler() {
    try {
      setLoading(true);
      action && action();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handler} {...props}>
      {isLoading ? "Loading" : children}
    </button>
  );
}

export default Button;
