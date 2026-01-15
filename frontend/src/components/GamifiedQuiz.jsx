import React, { useState, useCallback } from 'react';
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CButton, 
    CProgress, 
    CAlert,
    CRow, 
    CCol 
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle, cilXCircle } from '@coreui/icons';

// Datos simulados del Quiz (Ejemplo de pregunta)
const quizData = [
    {
        question: "¿Quién es conocido como el 'Padre de la Patria' en Venezuela?",
        options: ["Francisco de Miranda", "Antonio José de Sucre", "Simón Bolívar", "José Antonio Páez"],
        answer: "Simón Bolívar"
    },
    {
        question: "¿En qué año se firmó el Acta de la Declaración de Independencia de Venezuela?",
        options: ["1810", "1811", "1821", "1830"],
        answer: "1811"
    },
    // ... más preguntas
];

const GamifiedQuiz = ({ gradeLevel }) => {
    // 1. Estado de la partida
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    
    // Obtenemos la pregunta actual
    const currentQuestion = quizData[currentQuestionIndex];
    const totalQuestions = quizData.length;

    // 2. Función para manejar la respuesta del usuario
    const handleAnswerOptionClick = useCallback((selectedOption) => {
        if (selectedOption === currentQuestion.answer) {
            setScore(prevScore => prevScore + 1);
        }

        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowScore(true);
        }
    }, [currentQuestionIndex, currentQuestion.answer, totalQuestions]);

    // 3. Renderizado del resultado
    if (showScore) {
        return (
            <CCard className="text-center">
                <CCardHeader className="bg-success text-white">
                    <h5>¡Quiz Finalizado!</h5>
                </CCardHeader>
                <CCardBody>
                    <CIcon icon={cilCheckCircle} size="3xl" className="text-success mb-3" />
                    <h2 className="mb-4">Has obtenido {score} de {totalQuestions} puntos.</h2>
                    <p className="text-medium-emphasis">Excelente desempeño en el contenido de {gradeLevel}° Grado.</p>
                    <CButton color="primary" onClick={() => {
                        setCurrentQuestionIndex(0);
                        setScore(0);
                        setShowScore(false);
                    }}>
                        Reiniciar Quiz
                    </CButton>
                </CCardBody>
            </CCard>
        );
    }
    
    // 4. Renderizado de la pregunta
    const progress = (currentQuestionIndex / totalQuestions) * 100;

    return (
        <CCard>
            <CCardHeader>
                <h5>Examen Gamificado - {gradeLevel}° Grado</h5>
            </CCardHeader>
            <CCardBody>
                
                {/* Indicador de Progreso */}
                <div className="mb-4">
                    <p className="small text-medium-emphasis">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</p>
                    <CProgress value={progress} color="info" thin />
                </div>

                {/* Área de la Pregunta */}
                <div className="mb-4 p-3 border rounded">
                    <h4 className="mb-3">{currentQuestion.question}</h4>
                </div>

                {/* Opciones de Respuesta */}
                <CRow className="g-3">
                    {currentQuestion.options.map((option, index) => (
                        <CCol xs={12} md={6} key={index}>
                            <CButton 
                                color="light" 
                                className="w-100 py-3 text-start" 
                                onClick={() => handleAnswerOptionClick(option)}
                            >
                                {option}
                            </CButton>
                        </CCol>
                    ))}
                </CRow>
                
            </CCardBody>
        </CCard>
    );
};

export default GamifiedQuiz;