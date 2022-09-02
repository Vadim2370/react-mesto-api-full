import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ handleRegister }) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    setData((oldData) => ({
      ...oldData,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    // eslint-disable-next-line prefer-const
    let { email, password } = data;
    handleRegister(email, password);
  }

  return (
    <section className="popup popup__page popup-register popup_opened">
      <form
        className="popup__form poup__form-register"
        name="register"
        onSubmit={handleSubmit}
      >
        <h2 className="popup__title popup__title-page">Регистрация</h2>
        <input
          className="popup__input popup__input-page popup__input_type_email"
          id="input-email"
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          minLength="2"
          maxLength="30"
          required
        />
        <input
          className="popup__input popup__input-page popup__input_type_password"
          id="input-password"
          type="password"
          name="password"
          placeholder="Пароль"
          value={data.password}
          onChange={handleChange}
          minLength="8"
          maxLength="32"
          required
        />
        <button
          className="popup__submit popup__submit-page popup__submit-register"
          type="submit"
        >
          Зарегистрироваться
        </button>
        <div className="popup__subtitle">
          <span className="popup__subtitle-text">Уже зарегистрированы?</span>
          <Link className="button popup__subtitle-button" to="/sign-in">
            Войти
          </Link>
        </div>
      </form>
    </section>
  );
}

export default Register;
