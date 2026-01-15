import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CButton, CForm, CFormInput } from '@coreui/react';

const GamifiedQuiz = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const questions = [
    {
      question: "¿Cuál es la capital de Venezuela?",
      options: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto"],
      correctAnswer: 0
    },
    {
      question: "¿Qué colores tiene la bandera de Venezuela?",
      options: ["Rojo, Amarillo, Azul", "Verde, Blanco, Rojo", "Azul, Negro, Amarillo", "Rojo, Azul, Verde"],
      correctAnswer: 0
    },
    {
      question: "¿Quién es el libertador de Venezuela?",
      options: ["Simón Bolívar", "Hugo Chávez", "Francisco de Miranda", "José Antonio Páez"],
      correctAnswer: 0
    }
  ];

  const handleAnswer = (index) => {
    setAnswers([...answers, index]);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      alert("Cuestionario completado! Tus respuestas: " + answers.join(", ") + ", " + index);
    }
  };

  return (
    <CCard>
      <CCardHeader>
        <h5>Cuestionario Interactivo</h5>
      </CCardHeader>
      <CCardBody>
        {questionIndex < questions.length ? (
          <div>
            <h6>{questions[questionIndex].question}</h6>
            <CForm>
              {questions[questionIndex].options.map((option, index) => (
                <CButton key={index} onClick={() => handleAnswer(index)} className="m-1">
                  {option}
                </CButton>
              ))}
            </CForm>
          </div>
        ) : (
          <h6>¡Gracias por participar!</h6>
        )}
      </CCardBody>
    </CCard>
  );
};

export default GamifiedQuiz;