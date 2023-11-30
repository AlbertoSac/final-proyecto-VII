import React from "react";
import "../styles/Topbar.css";

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <i className="topbar-icon fa fa-shield" aria-hidden="true"></i>
        Tablero
      </div>
      <div className="topbar-right">
        <i className="topbar-icon fa fa-user-circle" aria-hidden="true"></i>
      </div>
    </div>
  );
}

export default TopBar;