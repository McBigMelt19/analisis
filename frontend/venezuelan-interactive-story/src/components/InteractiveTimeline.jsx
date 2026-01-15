import React from 'react';
import { Timeline } from 'react-chrono'; // Asegúrate de instalar react-chrono
import './InteractiveTimeline.scss'; // Archivo de estilos específico para la línea de tiempo

const InteractiveTimeline = () => {
  const items = [
    {
      title: 'Inicio de la Historia',
      cardTitle: 'Bienvenido a Venezuela',
      cardSubtitle: 'Descubre la belleza de Venezuela a través de esta historia interactiva.',
      cardDetailedText: 'Venezuela es un país lleno de cultura, historia y paisajes impresionantes. ¡Comencemos nuestra aventura!',
    },
    {
      title: 'La Bandera de Venezuela',
      cardTitle: 'Símbolos Patrios',
      cardSubtitle: 'Conoce la bandera y su significado.',
      cardDetailedText: 'La bandera de Venezuela tiene tres franjas horizontales: amarillo, azul y rojo. Cada color tiene un significado especial.',
    },
    {
      title: 'Los Andes',
      cardTitle: 'Montañas Majestuosas',
      cardSubtitle: 'Explora la cordillera de los Andes.',
      cardDetailedText: 'Los Andes son una de las cadenas montañosas más largas del mundo y ofrecen vistas espectaculares.',
    },
    {
      title: 'La Selva Amazónica',
      cardTitle: 'Naturaleza Exuberante',
      cardSubtitle: 'Descubre la biodiversidad de la selva.',
      cardDetailedText: 'La selva amazónica en Venezuela es hogar de miles de especies de plantas y animales.',
    },
    {
      title: 'Las Playas de Venezuela',
      cardTitle: 'Paraísos Tropicales',
      cardSubtitle: 'Relájate en las hermosas playas.',
      cardDetailedText: 'Venezuela cuenta con algunas de las playas más hermosas del Caribe, perfectas para disfrutar del sol.',
    },
    {
      title: 'Cultura y Tradiciones',
      cardTitle: 'Riqueza Cultural',
      cardSubtitle: 'Celebra las tradiciones venezolanas.',
      cardDetailedText: 'La música, la danza y la gastronomía son parte fundamental de la cultura venezolana.',
    },
  ];

  return (
    <div className="interactive-timeline">
      <h2>Historia Interactiva de Venezuela</h2>
      <Timeline items={items} />
    </div>
  );
};

export default InteractiveTimeline;