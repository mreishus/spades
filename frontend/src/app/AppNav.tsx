import React, { useState } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import useAuth from "../hooks/useAuth";
import ProfileLink from "../features/auth/ProfileLink";
import useWindowDimensions from "../hooks/useWindowDimensions";

interface Props {}

export const AppNav: React.FC<Props> = () => {
  const { authToken, logOut } = useAuth();
  //const { height, width } = useWindowDimensions();
  const headerLinkClass =
    "mt-1 sm:mt-0 sm:ml-2 block px-2 py-1 text-white font-light hover:font-normal rounded no-underline";
  // if (height < 500) return null;
  // const aspectRatio = width/height;
  // alert(aspectRatio)
  // if (aspectRatio > 2) return null;
  return (
    <header className="bg-gray-700 flex justify-between items-center px-4" style={{height:"3vh",fontFamily:"Roboto", }}>
      <div className="flex items-center justify-between p-0 h-full">
        <div className="h-full">
          <Link
            to="/"
            className="text-white font-light text-lg tracking-tight no-underline h-full"
          >
            {/*
            <img
              className="h-8 rounded"
              src="https://placekitten.com/650/150"
              alt="Logo "
            />
                */}
            <span style={{fontSize: "2vh"}}>Dragn <img className="mb-2" style={{display:"inline", height: "80%"}} src={process.env.PUBLIC_URL + '/logosvg.svg'}/> Cards</span>
          </Link>
        </div>
      </div>
      <div
        className={cx({
          "px-2 pt-2 pb-4 flex p-0": true,
          block: true,
          // hidden: !isOpen,
        })}
        style={{fontSize: "2vh"}}
      >
        <ProfileLink className={headerLinkClass} />
        {!authToken && (
          <>
            <Link to="/login" className={headerLinkClass}>
              Log In
            </Link>
            <Link to="/signup" className={headerLinkClass}>
              Sign Up
            </Link>
          </>
        )}
        {authToken && (
          <>
            <span
              className={headerLinkClass + " underline cursor-pointer"}
              onClick={() => logOut()}
            >
              Sign out
            </span>
          </>
        )}
      </div>
    </header>
  );
};
export default AppNav;
