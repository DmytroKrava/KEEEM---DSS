import React from "react";

import './pseudo.css'

import {tooltip} from "../../interactive-hints/interactive-hints.js";

export const Pseudo = ({setOpened, parentDataContent})=>{
    return(
      <div onClick={()=>{setOpened(prev=>!prev)}} className="pseudo" data-content={parentDataContent} onMouseMove={tooltip}/>
    )
  }