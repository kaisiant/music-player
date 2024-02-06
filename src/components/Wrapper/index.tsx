import { useTypedSelector } from "hooks";
import { PropsWithChildren, useEffect } from "react";
import { Toaster } from "sonner";

const Wrapper = ({ children }: PropsWithChildren) => {
  const isDarkMode = useTypedSelector((state) => state.player.isDark);

  useEffect(() => {
    isDarkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <>
      {children}
      <Toaster position="top-center" theme={isDarkMode ? "dark" : "light"} />
    </>
  );
};

export default Wrapper;
