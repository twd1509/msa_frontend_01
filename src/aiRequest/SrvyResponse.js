import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import "../aiRequest/css/reqStyle.css";
import { MemberInfoContext } from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const SrvyResponse = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const { email, groupNo } = useParams();  // URL에서 email 가져오기
    //const groupNo = 1;  // groupNo를 고정값 1로 설정
    const navigate = useNavigate();  // 뒤로 가기 기능 추가
    const [surveyData, setSurveyData] = useState([]);
    const [responses, setResponses] = useState([]);

    console.log("Router param email:", email, "groupNo:", groupNo);

    // ✅ 1. 설문 응답 여부 확인 후 차단
    useEffect(() => {
        if (!email || !groupNo) {
            console.error("email or groupNo is undefined.");
            return;
        }

        fetch(`${LocalHostInfoContext.aiRequest}/api/SrvyResponse/check?email=${email}&groupNo=${groupNo}`)
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
    }, [email, groupNo, navigate]);

     // 이메일을 바탕으로 설문조사 데이터 불러오기
     useEffect(() => {
        if (!email || !groupNo) {
            console.error("email or groupNo is undefined.");
            return;
        }

    // UserGetSrvy API 호출
        fetch(`${LocalHostInfoContext.aiRequest}/api/UserGetSrvy?email=${email}&groupNo=${groupNo}`)
        .then(response => response.json())
        .then(data => {
            console.log('Received survey data:', data);
            setSurveyData(data);
        })
        .catch(error => {
            console.error("Error fetching survey data:", error);
            alert("설문 데이터를 가져오는 중 오류가 발생했습니다.");
        });
    }, [email, groupNo]);

    const handleResponseChange = (questionIndex, value) => {
        const newResponses = [...responses];
        newResponses[questionIndex] = value;
        setResponses(newResponses);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            email: email,
            groupNo: groupNo,
            responses: responses
        };

        console.log('Responses:', formData);
        fetch('${LocalHostInfoContext.aiRequest}/api/SrvyResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert("응답이 성공적으로 제출되었습니다.");
            } else {
                alert("응답 제출 실패: " + response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("응답 제출 중 문제가 발생했습니다.");
        });
    };

    if (!surveyData || !surveyData.questions === 0) {
        return <div>조사 데이터를 불러오는 중...</div>;
    }
    if(memberInfo.loading) {
        return <div>로딩 중...</div>
    }

    if(!memberInfo.email) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/lgn/Lgn" replace />
    }

    return (
        <div className="aiR-container">
            <h1>만족도 조사 응답</h1>
            <form onSubmit={handleSubmit}>
                {surveyData.questions.map((question, index) => (
                    <div key={index} className="aiR-box">
                        <h3>{question.srvyCn}</h3>
                        {question.svyType === '객관식' ? (
                            <div>
                                {question.chc.split(',').map((choice, optionIndex) => (
                                    <div key={optionIndex}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={choice}
                                            onChange={(e) => handleResponseChange(index, e.target.value)}
                                            required
                                        />
                                        <label>{choice}</label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={responses[index] || ''}
                                onChange={(e) => handleResponseChange(index, e.target.value)}
                                required
                            />
                        )}
                    </div>
                ))}
                <div className="button-container">
                    <button type="submit">응답 제출</button>
                </div>
            </form>
        </div>
    );
};

export default SrvyResponse;
