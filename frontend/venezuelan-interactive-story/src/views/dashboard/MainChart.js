import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from '@coreui/react';

const MainChart = () => {
  const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Progreso de la Historia',
        backgroundColor: 'rgba(255, 193, 7, 0.5)', // Color amarillo
        borderColor: 'rgba(255, 193, 7, 1)', // Color amarillo
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Color de la cuadrícula
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Color de la cuadrícula
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color de las etiquetas de la leyenda
        },
      },
    },
  };

  return (
    <Card className="bg-primary text-white">
      <CardBody>
        <CardTitle tag="h5">Gráfico de Progreso</CardTitle>
        <div style={{ height: '300px' }}>
          <Line data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default MainChart;