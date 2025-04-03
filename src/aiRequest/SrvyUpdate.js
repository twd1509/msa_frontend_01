import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom'; 
import "../aiRequest/css/reqStyle.css";
import {MemberInfoContext} from '../components/MemberInfoContext';

const SrvyUpdate = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const { email: paramEmail, groupNo } = useParams();
    const { email: memberEmail } = useContext(MemberInfoContext);

    // email을 URL 파라미터에서 가져오되, 없으면 로그인한 사용자 정보에서 가져옴
    const email = paramEmail || memberEmail;

    const [formData, setFormData] = useState([]);

    // 만족도 조사 데이터 불러오기
    useEffect(() => {
        if (!email || !groupNo) return;

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9193/api/GetSurveyData/${email}/${groupNo}`, {
                        method: "GET"
                    }
                );
                const result = await response.json();
                setFormData(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [email, groupNo]);

    // 입력값 변경 핸들러 (조사 유형, 조사 내용 변경)
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        setFormData((prevData) =>
            prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item))
        );
    };

    // 객관식 보기 변경 핸들러
    const handleOptionChange = (index, optionIndex, e) => {
        const { value } = e.target;
        setFormData((prevData) =>
            prevData.map((item, i) => {
                if (i === index) {
                    const options = (item.chc || '').split(',');
                    options[optionIndex] = value;
                    return { ...item, chc: options.join(',') };
                }
                return item;
            })
        );
    };

    // 질문 추가 핸들러
    const handleAddQuestion = () => {
        setFormData((prevData) => [
            ...prevData,
            {
                srvyType: '',
                srvyCn: '',
                chc: Array(5).fill('').join(','), // 보기 5개 추가
            },
        ]);
    };

    // 질문 삭제 핸들러
    const handleDeleteQuestion = (index) => {
        setFormData((prevData) => prevData.filter((_, i) => i !== index));
    };

    // 조사 수정 요청 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            email: email,
            groupNo : groupNo,
            submittedSrvys: formData.map((q) => ({
                svyType: q.srvyType,
                srvyCn: q.srvyCn,
                chc: q.chc || '',
            })),
        };

        console.log('전송할 데이터:', updatedData);

        try {
            const response = await fetch(`http://localhost:9193/api/SrvyUpdate/${email}/${groupNo}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('만족도 조사가 성공적으로 수정되었습니다.');
                window.location.href = "/"
            } else {
                alert('만족도 조사 수정 실패: ' + response.status);
            }
        } catch (error) {
            console.error('Error updating survey:', error);
            alert('오류 발생: 만족도 조사 수정 중 문제가 발생했습니다.');
        }
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

    if (formData.length === 0) return <div>Loading...</div>;

    return (
        <div className="aiR-container">
            <form onSubmit={handleSubmit}>
                {formData.map((item, index) => (
                    <div key={index}>
                        <h3>만족도 조사 {index + 1}</h3>
                        <div>
                            <label>
                                조사 유형:
                                <select name="srvyType" value={item.srvyType} onChange={(e) => handleChange(index, e)}>
                                    <option value="">선택하세요</option>
                                    <option value="객관식">객관식</option>
                                    <option value="단답형">단답형</option>
                                </select>
                            </label>
                        </div>
                        <div>
                            <label>
                                조사 내용:
                                <textarea name="srvyCn" value={item.srvyCn} onChange={(e) => handleChange(index, e)} />
                            </label>
                        </div>
                        {item.srvyType === '객관식' && (
                            <div>
                                <h4>보기 입력:</h4>
                                {item.chc.split(',').map((option, optionIndex) => (
                                    <div key={optionIndex}>
                                        <label>
                                            보기 {optionIndex + 1}:
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => handleOptionChange(index, optionIndex, e)}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button type="button" onClick={() => handleDeleteQuestion(index)}>
                            삭제
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestion}>
                    질문 추가
                </button>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
};

export default SrvyUpdate;
