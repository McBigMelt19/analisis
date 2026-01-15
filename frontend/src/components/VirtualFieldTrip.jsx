import React from 'react';
import { CCard, CCardHeader, CCardBody, CAlert, CFormSelect } from '@coreui/react';

// Datos de ejemplo para diferentes viajes virtuales por grado
const virtualTripsData = {
  '1': [
    { id: 'cave-art', name: 'Arte Rupestre de Cueva del Guácharo', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo1' },
    { id: 'indigenous-village', name: 'Aldea Indígena Yanomami (Documental)', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo2' },
  ],
  '2': [
    { id: 'timoto-cuica', name: 'Ruinas Timoto-Cuica (Simulación)', type: 'iframe', url: 'https://www.ejemplo-tour-360.com/timoto-cuica' },
    { id: 'precolombian-museum', name: 'Museo Precolombino de Venezuela', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo3' },
  ],
  '3': [
    { id: 'conquistador-ship', name: 'Nave de Conquistadores (Recreación 3D)', type: 'iframe', url: 'https://www.ejemplo-tour-360.com/nave' },
    { id: 'colon-route', name: 'Ruta de Colón en el Caribe', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo4' },
  ],
  '4': [
    { id: 'colonial-caracas', name: 'Paseo por la Caracas Colonial (360)', type: 'iframe', url: 'https://www.ejemplo-tour-360.com/caracas-colonial' },
    { id: 'hacienda-sugar', name: 'Hacienda Azucarera Colonial', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo5' },
  ],
  '5': [
    { id: 'battle-carabobo', name: 'Campo de Batalla de Carabobo (360)', type: 'iframe', url: 'https://www.ejemplo-tour-360.com/carabobo' },
    { id: 'bolivar-house', name: 'Casa Natal de Bolívar', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo6' },
  ],
  '6': [
    { id: 'oil-field', name: 'Campo Petrolero (Recorrido virtual)', type: 'iframe', url: 'https://www.ejemplo-tour-360.com/petroleo' },
    { id: 'national-pantheon', name: 'Panteón Nacional de Venezuela', type: 'youtube', url: 'https://www.youtube.com/embed/ejemplo7' },
  ],
};

const VirtualFieldTrip = ({ gradeLevel }) => {
  const [selectedTrip, setSelectedTrip] = React.useState(''); // Estado para la URL seleccionada

  const tripsForGrade = virtualTripsData[gradeLevel] || [];

  // Establecer el primer viaje como predeterminado si hay alguno
  React.useEffect(() => {
    if (tripsForGrade.length > 0 && !selectedTrip) {
      setSelectedTrip(tripsForGrade[0].url);
    } else if (tripsForGrade.length === 0) {
      setSelectedTrip(''); // Limpiar si no hay viajes para este grado
    }
  }, [gradeLevel, tripsForGrade, selectedTrip]);

  const handleTripChange = (event) => {
    setSelectedTrip(event.target.value);
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>Viaje de Campo Virtual para el {gradeLevel}° Grado</h5>
      </CCardHeader>
      <CCardBody>
        <p className="text-medium-emphasis mb-4">
          Explora lugares históricos y culturales de Venezuela a través de experiencias inmersivas.
        </p>

        {tripsForGrade.length > 0 ? (
          <>
            <div className="mb-3">
              <CFormSelect
                aria-label="Seleccionar viaje virtual"
                value={selectedTrip}
                onChange={handleTripChange}
              >
                {tripsForGrade.map(trip => (
                  <option key={trip.id} value={trip.url}>
                    {trip.name}
                  </option>
                ))}
              </CFormSelect>
            </div>

            {selectedTrip ? (
              <div className="embed-responsive embed-responsive-16by9" style={{ height: '450px', width: '100%' }}>
                <iframe
                  className="embed-responsive-item"
                  src={selectedTrip}
                  allowFullScreen
                  title="Viaje Virtual"
                  style={{ border: 0, width: '100%', height: '100%' }}
                ></iframe>
              </div>
            ) : (
              <CAlert color="warning" className="text-center">
                Selecciona un viaje virtual para empezar.
              </CAlert>
            )}
          </>
        ) : (
          <CAlert color="info" className="text-center">
            No hay viajes virtuales disponibles para el {gradeLevel}° Grado todavía.
          </CAlert>
        )}
      </CCardBody>
    </CCard>
  );
};

export default VirtualFieldTrip;