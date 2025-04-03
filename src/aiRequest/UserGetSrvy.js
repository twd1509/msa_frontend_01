import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import "../aiRequest/css/reqStyle.css";
import {MemberInfoContext} from '../components/MemberInfoContext';

const UserGetSrvy = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const { email: paramEmail, groupNo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();  // 뒤로 가기 기능 추가
    const [email, setEmail] = useState('');
    const [questions, setQuestions] = useState([]);
    //const [answers, setAnswers] = useState([]);
    const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState([]); // 객관식 답변 배열
    const [shortAnswerResponses, setShortAnswerResponses] = useState([]); // 단답형 답변 배열
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paramEmail) {
            setEmail(paramEmail);
        }
    }, [location.search]);

    useEffect(() => {
        fetch(`http://localhost:9193/api/SrvyResponse/check?email=${email}&groupNo=${groupNo}`)
            .then(response => {
                if (response.status === 403) {
                    alert("이미 응답한 설문입니다.");
                    navigate(-1);  // ❗ 자동으로 뒤로 가기
                    return;
                }
                return response.json();
            })
            .catch(error => {
                console.error("❌ 오류 발생:", error);
                alert("설문 응답 여부 확인 중 문제가 발생했습니다.");
                navigate(-1);
            });

        const fetchQuestions = async () => {
            if (!email || !groupNo) return; // 값이 없으면 실행 안 함
    
            try {
                const response = await fetch(`http://localhost:9193/api/UserGetSrvy/${email}/${groupNo}`);
    
                if (!response.ok) {
                    throw new Error(`네트워크 오류: ${response.status}`);
                }
    
                const data = await response.json();
                console.log('받은 데이터:', data);
    
                if (Array.isArray(data)) {
                    setQuestions(data);
                    //setAnswers(new Array(data.length).fill(''));
                    setMultipleChoiceAnswers(new Array(data.filter(q => q.srvyType === '객관식').length).fill(''));
                    setShortAnswerResponses(new Array(data.filter(q => q.srvyType === '단답형').length).fill(''));
                } else {
                    throw new Error('받은 데이터가 배열이 아닙니다.');
                }
            } catch (error) {
                console.error('질문 불러오기 오류:', error);
                setError(error.message);
            }
        };
    
        fetchQuestions();
    }, [email, groupNo]); // email과 groupNo가 설정된 후 실행
    //console.log('questions:', questions); // 질문 목록
    //console.log('answers:', answers); // 답변 목록

    const handleChange = (event) => {
        const { name, value } = event.target;
        const questionIndex = parseInt(name.split('-')[1]);
        //const index = parseInt(name.split('-')[1]);
        if (event.target.type === 'radio') {
            setMultipleChoiceAnswers(prevAnswers => {
                const newAnswers = [...prevAnswers];
                newAnswers[questionIndex] = value; // 객관식 답변
                return newAnswers;
            });
        } else if (event.target.type === 'text') {
            setShortAnswerResponses(prevAnswers => {
                const newAnswers = [...prevAnswers];
                newAnswers[questionIndex] = value; // 단답형 답변
                return newAnswers;
            });
        }
    };

    const handleSubmit = async (event) => { 
        event.preventDefault();

        const unansweredQuestions = questions.filter((_, index) => {
            const isMultipleChoice = questions[index].srvyType === '객관식';
            const isShortAnswer = questions[index].srvyType === '단답형';
            return (isMultipleChoice && !multipleChoiceAnswers[index]) || (isShortAnswer && !shortAnswerResponses[index]);
        });

        if (unansweredQuestions.length > 0) {
            alert("모든 질문에 답변을 입력해 주세요.");
            return;
        }

        const user = {
            email: paramEmail,
            groupNo: groupNo,
            submittedSrvys: questions.map((question, index) => {
                const answer = question.srvyType === '객관식'
                    ? multipleChoiceAnswers[index]
                    : question.srvyType === '단답형'
                    ? shortAnswerResponses[index]
                    : null;

                return {
                    memId: memberInfo.email,
                    srvyCn: question.srvyCn, 
                    chcRslt: question.srvyType === '객관식' ? answer : null,
                    textRslt: question.srvyType === '단답형' ? answer : null,
                };
            })
        };

        try {
            const response = await fetch('http://localhost:9193/api/SrvyResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }

            alert('답변이 제출되었습니다!');
            window.location.href = "/requirements/RequirementList";
        } catch (error) {
            console.error('제출 오류:', error);
            alert('답변 제출에 실패했습니다.');
            window.location.href = "/requirements/RequirementList";
        }
    };

    if(memberInfo.loading) {
        return <div>로딩 중...</div>
    }

    if(!memberInfo.email) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/lgn/Lgn" replace />
    }
    return (
        <div className="aiR-container">
            <h1>만족도 조사</h1>
            {error && <p className="error">{error}</p>}
            <form id="aiR-box" onSubmit={handleSubmit}>
                {questions.length > 0 ? (
                    questions.map((question, questionIndex) => (
                        console.log(question.chc), // 이 부분으로 chc 값을 확인
                        <div className="aiR-box" key={question.surveyNo}>
                            <h2>{question.srvyCn}</h2>
                            {question.srvyType === '객관식' ? (
                                <ul className="options">
                                    {question.chc && question.chc.split(',').map((option, index) => {
                                        const optionId = `q${question.surveyNo}-option-${index}`; // 고유한 id 생성
                                        return (
                                            <li key={optionId}>
                                                <input 
                                                    type="radio" 
                                                    name={`q${question.surveyNo || 'default'}-${questionIndex}`} // 기본값 'default' 제공
                                                    id={optionId}
                                                    value={option.trim()} 
                                                    checked={multipleChoiceAnswers[questionIndex] === option.trim()} 
                                                    onChange={handleChange} 
                                                />
                                                <label htmlFor={optionId}>{option.trim()}</label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : question.srvyType === '단답형' ? (
                                <input 
                                    type="text" 
                                    name={`q${question.surveyNo || 'default'}-${questionIndex}`} // 고유한 이름 설정
                                    id={`q${question.surveyNo}-text`} // 고유한 id 추가
                                    value={shortAnswerResponses[questionIndex] || ''} 
                                    onChange={handleChange} 
                                    placeholder="답변을 입력하세요" 
                                />
                            ) : null}
                        </div>
                    ))
                ) : (
                    <p>질문이 없습니다.</p>
                )}
                <div className="button-container">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => window.history.back()}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default UserGetSrvy;