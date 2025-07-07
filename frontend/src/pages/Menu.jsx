import React from "react";
import "./Menu.css";


export default function Menu( {children}) {
    return(
        <header className="menu"> 
            {children}
        </header>
    );
}
