import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Importing the CSS file
import useWindowDimensions from './useWindowDimensions';
const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { width } = useWindowDimensions();

  const toggleSidebar = () => {
    if (width <= 700 ) {setShowSidebar(!showSidebar);}
  };

  return (
    <nav className="navbar">
      <div className="brand">MoneyManagement</div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <ul className={`navLinks ${showSidebar ? 'active' : ''}`}>
        <li className="navItem"><Link to="/"><button className='navButton' id='home' onClick={toggleSidebar}>Home</button></Link></li>
        <li className="navItem"><Link to="/expenses"><button className='navButton' onClick={toggleSidebar}>Expenses</button></Link></li>
        <li className="navItem"><Link to="/about" ><button className='navButton' onClick={toggleSidebar}>About</button></Link></li>
        <li className="navItem"><Link to="/contact" ><button className='navButton' onClick={toggleSidebar}>Contact</button></Link></li>
        {/* <li className="navItem"><Link to="/signin" ><button className='navButton' onClick={toggleSidebar}>SignIn</button></Link></li> */}
        {/* {/* <li className="navItem"><Link to="/signin" ><button className='navButton' onClick={toggleSidebar}>SignIn</button></Link></li> */}
        {/* <li className="navItem"><Link to="/ signin" ><button className='navButton' onClick={toggleSidebar}>SignUp</button></Link></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
