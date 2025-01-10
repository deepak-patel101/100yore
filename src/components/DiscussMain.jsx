import React, { useState, useEffect } from "react";
import ThreadList from "./Discussion/ThreadList";
import NewThread from "./Discussion/NewThread";
import GoBackCom from "./GoBackCom";
import DiscussionControl from "./Discussion/DiscussionControl";
import WhatsNew from "./Discussion/WhatsNew";
import { FaRegNewspaper } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { useGlobalContext } from "../Context/GlobalContextOne";
import "./DiscussMain.css";

function DiscussMain() {
  const { threadControl } = useGlobalContext();
  const [showNewThread, setNewThread] = useState(false);
  const [threadsUpdated, setThreadsUpdated] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [vP, setVP] = useState(false);
  const [openNews, setOpenNews] = useState(false);
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const [newThreadPosted, setNewThreadPosted] = useState(0);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setVP(
      threadControl.explore === "Videos" || threadControl.explore === "Photos"
    );
  }, [threadControl]);

  const handleThreadCreated = () => {
    setNewThreadPosted(newThreadPosted + 1);
    setThreadsUpdated((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBtnClick = (btn) => {
    if (btn === "menu") setOpenMenu(!openMenu);
    if (btn === "news") setOpenNews(!openNews);
  };

  useEffect(() => {
    if (openMenu) {
      console.log("Dm openMenuMobile", openMenuMobile);
    }
  }, [openMenuMobile]);

  return (
    <div className="container">
      <div className="row papaDiv">
        {screenSize.width < 770 ? (
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => handleBtnClick("menu")}
            >
              <GiHamburgerMenu />
            </button>
            <h6>Let us Know, What is in your mind..?</h6>
            {/* <button
              className="btn btn-sm btn-outline-dark"
              onClick={() => handleBtnClick("news")}
            >
              <FaRegNewspaper />
            </button> */}
          </div>
        ) : (
          <div className="col-12 col-md-3">
            <DiscussionControl />
          </div>
        )}

        {/* Mobile Menu Overlay */}
        <div
          className={`overlay-menu ${openMenu ? "open" : ""}`}
          onClick={() => setOpenMenu(false)}
        >
          <div className="menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="close-icon" onClick={() => setOpenMenu(false)}>
              <IoCloseCircleSharp />
            </div>
            <DiscussionControl
              setOpenMenuMobile={setOpenMenuMobile}
              openMenuMobile={openMenuMobile}
            />
          </div>
        </div>

        {/* News Overlay */}
        <div
          className={`overlay-news ${openNews ? "open" : ""}`}
          onClick={() => setOpenNews(false)}
        >
          {/* <div className="news-content" onClick={(e) => e.stopPropagation()}>
            <div className="close-icon" onClick={() => setOpenNews(false)}>
              <IoCloseCircleSharp />
            </div>
            {!vP && <WhatsNew />}
          </div> */}
        </div>

        <div className={`col-12 col-md-${vP ? "9" : "9"}`}>
          {/* change it to from  -${vP ? "9" : "9"} to -${vP ? "9" : "6"} and uncomment whatsnew*/}
          {!vP && (
            <div className="row papaDiv mb-2 m-1">
              {screenSize.width >= 770 && (
                <h6>Let them Know, What is in your mind..?</h6>
              )}
              <NewThread onThreadCreated={handleThreadCreated} />
            </div>
          )}
          <div className="row">
            <ThreadList
              newThreadPosted={newThreadPosted}
              threadsUpdated={threadsUpdated}
            />
          </div>
        </div>

        {/* {screenSize.width >= 770 && !vP && (
          <div className="col-12 col-md-3">
            <WhatsNew />
          </div>
        )} */}
      </div>
    </div>
  );
}

export default DiscussMain;
