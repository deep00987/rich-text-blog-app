import React from "react";
import Logo2 from "../img/logo2.png";
import {FaReact} from 'react-icons/fa'

const Footer = () => {
  return (
    <footer>
      <img src={Logo2} alt="" />
      <p>
        Made with ❤️ and <b>React.js</b>.
      </p>
    </footer>
  );
};

export default Footer;
