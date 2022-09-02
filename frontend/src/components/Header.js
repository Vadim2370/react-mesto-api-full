import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header({ loggedIn, handleLogOut, userEmail }) {
  const location = useLocation();

  function HeaderLink() {
    return (
      <Link
        to={location.pathname === '/sign-in' ? '/sign-up' : '/sign-in'}
        className="header__button"
      >
        {location.pathname === '/sign-in' ? 'Регистрация' : 'Войти'}
      </Link>
    );
  }

  function HederNav() {
    return (
      <nav className="header__nav">
        <p className="header__email">{userEmail}</p>
        <button className="header__exit-button" onClick={handleLogOut}>
          Выйти
        </button>
      </nav>
    );
  }

  return (
    <header className="header page__section">
      <img className="header__logo" src={logo} alt="Логотип Mesto" />
      {loggedIn ? <HederNav /> : <HeaderLink />}
    </header>
  );
}

export default Header;
