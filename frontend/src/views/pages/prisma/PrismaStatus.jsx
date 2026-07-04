import { useEffect, useState } from 'react';
import { getPrismaHealth } from '../../../services/api.config';

const PrismaStatus = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const data = await getPrismaHealth();
        setStatus(data);
      } catch (err) {
        setError(err.message || 'No se pudo conectar con Prisma');
      }
    };

    loadStatus();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Estado de Prisma</h3>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {status ? (
        <pre>{JSON.stringify(status, null, 2)}</pre>
      ) : (
        <p>Cargando estado de Prisma...</p>
      )}
    </div>
  );
};

export default PrismaStatus;
