import React from "react";
import { NavLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { GoMail } from "react-icons/go";
import { FaRegBookmark } from "react-icons/fa";
import { PiPaintBrushBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { uiSliceActions } from "../store/ui-slide";

const Sidebar = () => {

  const dispatch = useDispatch()
  const openThemeModal = () => {
    dispatch(uiSliceActions.openThemeModal());
  };
  return (
    <menu className="sidebar">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `sidebar__item ${isActive ? "active" : ""}`
        }
      >
        <i className="side__icon">
          <AiOutlineHome />
        </i>
        <p>Home</p>
      </NavLink>

      <NavLink
        to="/messages"
        className={({ isActive }) =>
          `sidebar__item ${isActive ? "active" : ""}`
        }
      >
        <i className="side__icon">
          <GoMail />
        </i>
        <p>Messages</p>
      </NavLink>

      <NavLink
        to="/bookmarks"
        className={({ isActive }) =>
          `sidebar__item ${isActive ? "active" : ""}`
        }
      >
        <i className="side__icon">
          <FaRegBookmark />
        </i>
        <p>Bookmarks</p>
      </NavLink>

      <a className="sidebar__item" onClick={openThemeModal}>
        <i className="side__icon">
          <PiPaintBrushBold />
        </i>
        <p>Theme</p>
      </a>
    </menu>
  );
};

export default Sidebar;
