/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import {
  Route, Routes, useNavigate, Navigate,
} from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import ConfirmPopup from './ConfirmPopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from '../utils/Api';
import * as auth from '../utils/auth';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';
import preAvatar from '../images/loading.webp';

function App() {
  const navigate = useNavigate();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deletedCard, setDeletedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: 'Загрузка...',
    about: 'Загрузка...',
    avatar: preAvatar,
  });
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      navigate('/');
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfile(), api.getCards()])
        .then(([userData, userCard]) => {
          setCurrentUser(userData);
          setCards(userCard);
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    }
  }, [loggedIn]);

  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getToken(jwt)
        .then((res) => {
          if (res.email) {
            setLoggedIn(true);
            setUserEmail(res.email);
          }
        })
        .catch((err) => console.log(`Ошибка: ${err}`));
    }
  }

  function handleLogin(email, password) {
    auth
      .login({ email, password })
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
        }
        setLoggedIn(true);
        setUserEmail(email);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        setIsInfoToolTipOpen(true);
        setIsRegistered(false);
      });
  }

  function handleRegister(email, password) {
    auth
      .register({ email, password })
      .then((data) => {
        if (data.email) {
          localStorage.setItem('jwt', data.token);
          setUserEmail(email);
        }
        setIsRegistered(true);
        setIsInfoToolTipOpen(true);
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
        setIsRegistered(false);
        setIsInfoToolTipOpen(true);
      });
  }

  function handleLogOut() {
    auth
      .logout()
      .then(() => {
        setLoggedIn(false);
        localStorage.removeItem('jwt');
        navigate('/sign-in');
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeleteCardClick(card) {
    setDeletedCard(card);
    setIsConfirmPopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(`Ошибка: ${err}`));
  }

  function handleCardDelete(card) {
    setIsLoading(true);
    api
      .removeCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api
      .editProfile(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(data) {
    setIsLoading(true);
    api
      .editAvatar(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  function handleAddCards(data) {
    setIsLoading(true);
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(`Ошибка: ${err}`))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    const handleEscClose = (evt) => {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    return () => document.removeEventListener('keydown', handleEscClose);
  });

  function closeAllPopups() {
    setIsInfoToolTipOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setDeletedCard(null);
    setSelectedCard(null);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          userEmail={userEmail}
          loggedIn={loggedIn}
          handleLogOut={handleLogOut}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                component={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCardClick}
                cards={cards}
              />
            }
          />
          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />
            }
          />
          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} />}
          />
          <Route
            path="/sign-up"
            element={<Register handleRegister={handleRegister} />}
          />
        </Routes>

        {loggedIn ? <Footer /> : null}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddCards}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          card={deletedCard}
          isLoading={isLoading}
        />

        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          isRegistered={isRegistered}
        />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
