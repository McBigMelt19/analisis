import React, { useState, useCallback, useEffect } from 'react';
import { 
    CCard, 
    CCardHeader, 
    CCardBody, 
    CButton, 
    CProgress, 
    CSpinner,
    CRow, 
    CCol 
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCheckCircle } from '@coreui/icons';
import { getBaseURL, apiFetch } from '../services/api.config';

const GamifiedQuiz = ({ gradeLevel }) => {
    const [quizData, setQuizData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar quiz desde el backend
    const loadQuiz = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const base = getBaseURL();
            const response = await apiFetch(`${base}/chatbot/quiz`, {
                method: 'POST',
                body: JSON.stringify({
                    id_tema: null,
                    cantidad: 5,
                    dificultad: 'media'
                })
            });

            if (!response.ok) throw new Error('Error al generar quiz');

            const data = await response.json();
            const preguntas = data.preguntas || data;

            if (Array.isArray(preguntas) && preguntas.length > 0) {
                // Adaptar formato del backend al del componente
                const formattedQuiz = preguntas.map(p => ({
                    question: p.pregunta || p.question,
                    options: p.opciones || p.options || [],
                    answer: p.respuesta_correcta || p.answer || p.opciones?.[0]
                }));
                setQuizData(formattedQuiz);
            } else {
                // Fallback: preguntas locales si el backend no devuelve formato esperado
                setQuizData(getFallbackQuestions());
            }
        } catch (err) {
            console.warn('Quiz IA no disponible, usando preguntas locales:', err.message);
            setQuizData(getFallbackQuestions());
        } finally {
            setLoading(false);
        }
    }, []);

    // Preguntas de respaldo si la IA no está disponible
    const getFallbackQuestions = () => [
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
        {
            question: "¿Cuál fue la primera ciudad fundada en Venezuela?",
            options: ["Caracas", "Cumaná", "Coro", "Maracaibo"],
            answer: "Cumaná"
        },
        {
            question: "¿Qué batalla selló la independencia de Venezuela?",
            options: ["Batalla de Boyacá", "Batalla de Carabobo", "Batalla de Ayacucho", "Batalla de Junín"],
            answer: "Batalla de Carabobo"
        },
        {
            question: "¿Quién fue el primer presidente de Venezuela?",
            options: ["Simón Bolívar", "José Antonio Páez", "Cristóbal Mendoza", "Francisco de Miranda"],
            answer: "José Antonio Páez"
        }
    ];

    useEffect(() => {
        loadQuiz();
    }, [loadQuiz]);

    if (loading) {
        return (
            <CCard className="text-center p-5">
                <CSpinner color="primary" />
                <p className="mt-3 text-muted">Generando quiz con IA...</p>
            </CCard>
        );
    }

    if (quizData.length === 0) {
        return (
            <CCard className="text-center p-4">
                <p className="text-muted">No se pudieron cargar las preguntas.</p>
                <CButton color="primary" onClick={loadQuiz}>Reintentar</CButton>
            </CCard>
        );
    }

    const currentQuestion = quizData[currentQuestionIndex];
    const totalQuestions = quizData.length;

    const handleAnswerOptionClick = (selectedOption) => {
        if (selectedOption === currentQuestion.answer) {
            setScore(prevScore => prevScore + 1);
        }

        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < totalQuestions) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    // Resultado final
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
                    <div className="d-flex gap-2 justify-content-center">
                        <CButton color="primary" onClick={() => {
                            setCurrentQuestionIndex(0);
                            setScore(0);
                            setShowScore(false);
                        }}>
                            Reiniciar Quiz
                        </CButton>
                        <CButton color="success" variant="outline" onClick={() => {
                            setCurrentQuestionIndex(0);
                            setScore(0);
                            setShowScore(false);
                            loadQuiz();
                        }}>
                            🔄 Nuevas Preguntas (IA)
                        </CButton>
                    </div>
                </CCardBody>
            </CCard>
        );
    }
    
    const progress = (currentQuestionIndex / totalQuestions) * 100;

    return (
        <CCard>
            <CCardHeader>
                <h5>Examen Gamificado - {gradeLevel}° Grado</h5>
            </CCardHeader>
            <CCardBody>
                <div className="mb-4">
                    <p className="small text-medium-emphasis">Pregunta {currentQuestionIndex + 1} de {totalQuestions}</p>
                    <CProgress value={progress} color="info" thin />
                </div>

                <div className="mb-4 p-3 border rounded">
                    <h4 className="mb-3">{currentQuestion.question}</h4>
                </div>

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