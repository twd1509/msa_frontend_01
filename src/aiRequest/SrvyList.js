import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../aiRequest/css/reqStyle.css";
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const SrvyList = ({ email }) => {
    //const userEmail = email || "test1@naver.com"; // 이메일 임의 설정
    const [surveyList, setSurveyList] = useState([]);
    const [surveyResults, setSurveyResults] = useState([]);  // 설문 결과 상태 추가
    const [surveyNo, setSurveyNo] = useState(null);  // surveyNo 상태 추가
    const navigate = useNavigate();

    // 만족도 조사 데이터 불러오기
    useEffect(() => {
        fetchSurveyData();
    }, [email]);

    useEffect(() => {
        if (surveyNo) {
            fetch(`${LocalHostInfoContext.aiRequest}/api/GetSurveyResults?surveyNo=${surveyNo}`)
                .then(response => response.json())
                .then(data => setSurveyResults(data))
                .catch(error => console.error('Error fetching survey results:', error));
        }
    }, [surveyNo]);
    
    const fetchSurveyData = () => {
        if (email) {
            fetch(`${LocalHostInfoContext.aiRequest}/api/GetSurveyData?email=${email}`)
                .then(response => response.json())
                .then(data => setSurveyList(data))
                .catch(error => console.error('Error fetching survey list:', error));
        }
    };
    // 수정 버튼 핸들러
    const handleUpdate = (email, surveyNo) => {
        setSurveyNo(surveyNo);  // surveyNo 상태 업데이트
        navigate(`/SrvyUpdate?email=${email}&surveyNo=${surveyNo}`);
    };

    // 삭제 버튼 핸들러
    const handleDelete = async (email, surveyNo) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`${LocalHostInfoContext.aiRequest}/api/SrvyDelete?email=${email}&surveyNo=${surveyNo}`, {
                method: "POST"
            });

            if (response.ok) {
                alert("삭제되었습니다.");
                fetchSurveyData(); // 목록 다시 불러오기
            } else {
                alert("삭제 실패: " + response.status);
            }
            } catch (error) {
            console.error("삭제 오류:", error);
            alert("삭제 중 문제가 발생했습니다.");
            }
        }
    };

    return (
        <div className="aiR-container">
            <h1>{email}의 만족도 조사 목록</h1>
            <table>
                <thead>
                    <tr>
                        <th>조사 유형</th>
                        <th>문항</th>
                        <th>보기</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {surveyList.length > 0 ? (
                        surveyList.map((survey, index) => (
                            <tr key={index}>
                                <td>{survey.srvyType}</td>
                                <td>{survey.srvyCn}</td>
                                <td>{survey.chc || 'N/A'}</td>
                                <td>
                                    <button onClick={() => handleUpdate(email, survey.surveyNo)}>수정</button>
                                    <button onClick={() => handleDelete(email, survey.surveyNo)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">등록된 만족도 조사가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SrvyList;
