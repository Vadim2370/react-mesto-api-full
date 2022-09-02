import { useContext } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardDelete,
  onCardLike,
  cards,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile page__section">
        <img
          className="profile__avatar"
          src={currentUser.avatar}
          alt="Аватар"
        />
        <button
          type="button"
          className="profile__avatar-edit"
          onClick={onEditAvatar}
        ></button>
        <div className="profile__info">
          <div className="profile__discription">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              type="button"
              className="profile__edit"
              aria-label="Редактировать профиль"
              onClick={onEditProfile}
            ></button>
          </div>
          <p className="profile__about">{currentUser.about}</p>
        </div>
        <button
          type="button"
          className="profile__add"
          aria-label="Добавить фото"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="elements page__section">
        <ul className="elements__grid">
          {cards.map((card) => (
            <Card
              card={card}
              key={card._id}
              onCardClick={onCardClick}
              onCardDelete={onCardDelete}
              onCardLike={onCardLike}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
