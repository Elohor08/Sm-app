import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Widget from "./components/widget";
import { Outlet } from "react-router-dom";
import ThemeModal from "./components/ThemeModal";
import { useSelector } from "react-redux";

const RootLayout = () => {
  const { themeModalIsOpen } = useSelector((state) => state?.ui);
  const { primaryColor, backgroundColor } = useSelector(
    (state) => state?.ui?.theme
  );

  useEffect(() => {
    const body = document.body;
    body.className = `${primaryColor} ${backgroundColor}`;
  }, [primaryColor, backgroundColor]);

  return (
    <>
      <Navbar />

      <main className="main">
        <div className="container main__container">
          <Sidebar />
          <Outlet />
          <Widget />
          {themeModalIsOpen && <ThemeModal />}
        </div>
      </main>
    </>
  );
};

export default RootLayout;
