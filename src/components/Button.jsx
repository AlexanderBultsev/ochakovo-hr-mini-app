import { useState } from "react";
import { colors } from "../theme/colors";
import '../styles/Buttons.css';


export function Button_handmade({ 
    color, 
    text, 
    onClick,
    hoverMode,
    disabled = false,
    children, 
    ...rest 
}) {


  return (
    <button
      type="button"
      className="btn1"
      style={{ backgroundColor: color }}
      onClick={onClick}
      {...rest}
    >
      {text ?? children}
    </button>
  );
}