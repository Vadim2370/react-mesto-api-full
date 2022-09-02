import { useState } from 'react';

function Login({ handleLogin }) {
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
    const { email, password } = data;
    handleLogin(email, password);
  }

  return (
    <section className="popup popup__page popup-login popup_opened">
      <form
        className="popup__form poup__form-login"
        name="login"
        onSubmit={handleSubmit}
      >
        <h2 className="popup__title popup__title-page">Вход</h2>
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
          className="popup__submit popup__submit-page popup__submit-login"
          type="submit"
        >
          Войти
        </button>
      </form>
    </section>
  );
}

export default Login;
