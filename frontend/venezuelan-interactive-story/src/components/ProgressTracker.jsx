import React from 'react';
import { Progress } from 'reactstrap';

const ProgressTracker = ({ steps, currentStep }) => {
  return (
    <div className="progress-tracker">
      <h3 className="text-center">Progreso de la Historia</h3>
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= currentStep ? 'completed' : ''}`}>
            <span className="step-number">{index + 1}</span>
            <span className="step-title">{step}</span>
          </div>
        ))}
      </div>
      <Progress value={(currentStep / (steps.length - 1)) * 100} />
    </div>
  );
};

export default ProgressTracker;