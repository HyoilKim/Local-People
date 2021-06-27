import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

const Button = ({ primary, label, to }) => {
  if (primary) {
    return (
      <Link className="button button__primary" to={to}>
        {label}
      </Link>
    );
  } else {
    return (
      <Link className="button button__secondary" to={to}>
        {label}
      </Link>
    );
  }
};

export default Button;
