import React, { useState, useEffect, useContext } from 'react';
import {Link, useParams, Navigate} from 'react-router-dom'
import "../aiRequest/css/reqStyle.css";
import { MemberInfoContext } from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const SrvyReg = () => {
    const memberInfo = useContext(MemberInfoContext);
    console.log("현재 로그인 정보:", memberInfo.email);
    const [questions, setQuestions] = useState([{ 
        svyType: '', 
        srvyCn: '', 
        chc: '',
        groupNo: ''
    }]);

    const handleInputChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index][event.target.name] = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const newQuestions = [...questions];
        const value = event.target.value;
        const options = newQuestions[questionIndex].chc ? newQuestions[questionIndex].chc.split(',') : [];
        options[optionIndex] = value;
        newQuestions[questionIndex].chc = options.join(',');
        setQuestions(newQuestions);
    };
    
    const addQuestion = () => {
        if (questions.length < 15) {
            setQuestions([...questions, { svyType: '', srvyCn: '', chc: '', groupNo: '' }]);
        } else {
            alert("질문은 최대 15개까지 추가할 수 있습니다.");
        }
    };

    const deleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!memberInfo || !memberInfo.email) {
            alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
            return;
        }

        const formData = {
            email: memberInfo.email,
            submittedSrvys: questions.map(q => ({
                svyType: q.svyType,
                srvyCn: q.srvyCn,
                chc: q.chc,
                groupNo: q.groupNo
            }))
        };

        fetch(`${LocalHostInfoContext.aiRequest}/api/SrvyReg`, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                alert("만족도 조사가 성공적으로 등록되었습니다.");
                setQuestions([{ svyType: '', srvyCn: '', chc: '', groupNo: '' }]);
                window.location.href ="/"
            } else {
                alert("만족도 조사 등록 실패: " + response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("오류 발생: 만족도 조사 등록 중 문제가 발생했습니다.");
        });
    };
    if(memberInfo.loading) {
            return <div>로딩 중...</div>
        }
    
        if(!memberInfo.email) {
            alert("로그인이 필요합니다.");
            return <Navigate to="/lgn/Lgn" replace />
        }
    
        if(memberInfo.grade != 3) {
            alert("권한이 없습니다.");
            return <Navigate to="/" replace />
        }

    return (
        <div className="aiR-container">
            <h1>만족도 조사 작성</h1>
            <form id="survey-form" onSubmit={handleSubmit}>
                <label htmlFor="email">회원 이메일</label>
                <input
                    type="email"
                    value={memberInfo?.email || ""}
                    readOnly
                    required
                /> 
                {questions.map((question, index) => (
                    <div key={index} className="aiR-box">
                        <label htmlFor={`svyType-${index}`}>조사 유형</label>
                        <select
                            name="svyType"
                            value={question.svyType}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                        >
                            <option value="">-- 선택하세요 --</option>
                            <option value="객관식">객관식</option>
                            <option value="단답형">단답형</option>
                        </select>
                        <label htmlFor={`srvyCn-${index}`}>만족도 조사 문항</label>
                        <input
                            type="text"
                            name="srvyCn"
                            placeholder="만족도 조사 문항 입력"
                            value={question.srvyCn}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                        />
                        <label htmlFor={`groupNo-${index}`}>그룹 번호</label>
                        <input
                            type="text"
                            name="groupNo"
                            placeholder="그룹 번호 입력"
                            value={question.groupNo}
                            onChange={(event) => handleInputChange(index, event)}
                        />

                        {question.svyType === '객관식' && (
                            <div>
                                <h4>보기를 입력하세요:</h4>
                                {Array(5).fill(0).map((_, optionIndex) => (
                                    <input
                                        key={`option-${index}-${optionIndex}`}
                                        type="text"
                                        name={`option-${index}-${optionIndex}`}
                                        placeholder={`보기 ${optionIndex + 1}`}
                                        onChange={(event) => handleOptionChange(index, optionIndex, event)}
                                        required
                                    />
                                ))}
                            </div>
                        )}
                        <button type="button" className="delete-button" onClick={() => deleteQuestion(index)}>
                            삭제
                        </button>
                    </div>
                ))}
                <div className="button-container">
                    <button type="button" id="add-button" onClick={addQuestion}>
                        추가
                    </button>
                </div>
                <div className="button-container">
                    <button type="submit">등록</button>
                    <button type="button" onClick={() => window.history.back()}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default SrvyReg;
