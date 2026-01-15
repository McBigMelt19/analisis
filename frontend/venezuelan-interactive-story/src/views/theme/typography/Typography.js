import React from 'react';
import './Typography.scss'; // Importa los estilos específicos de tipografía

const Typography = () => {
  return (
    <div className="typography">
      <h1 className="title">¡Bienvenidos a la Historia Interactiva de Venezuela!</h1>
      <h2 className="subtitle">Explora, Aprende y Diviértete</h2>
      <p className="body-text">
        En esta historia, descubrirás los hermosos paisajes, la rica cultura y la historia fascinante de Venezuela. 
        ¡Prepárate para una aventura inolvidable!
      </p>
      <p className="body-text">
        A medida que avances, encontrarás personajes divertidos y emocionantes desafíos que te ayudarán a aprender 
        más sobre este maravilloso país.
      </p>
      <h3 className="section-title">¿Listo para comenzar?</h3>
      <p className="body-text">
        Haz clic en el botón de abajo para iniciar tu aventura.
      </p>
      <button className="start-button">¡Comenzar!</button>
    </div>
  );
};

export default Typography;