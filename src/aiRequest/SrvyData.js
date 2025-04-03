import React, { useEffect, useState, useContext } from "react";
import {Link, useParams, Navigate} from 'react-router-dom';
import "../aiRequest/css/reqStyle.css";
import {MemberInfoContext} from '../components/MemberInfoContext';
import { LocalHostInfoContext } from '../components/LocalHostInfoContext';

const params = new URLSearchParams(window.location.search);
let groupNo = params.get("groupNo") == null ? '' : params.get("groupNo");

const SrvyData = () => {
    const memberInfo  = useContext(MemberInfoContext);
    const [surveyResults, setSurveyResults] = useState({});

    useEffect(() => {
        console.log("📌 React - API 요청 시작, groupNo:", groupNo);
        fetch(`${LocalHostInfoContext.aiRequest}/api/SrvyData?groupNo=${groupNo}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                console.log("📊 만족도 조사 통계 API 응답 데이터:", data);

                if (data.length > 0) {
                    // 같은 srvyCn(만족도 조사 질문)끼리 그룹화 및 totalCount 가져오기
                    const groupedResults = data.reduce((acc, item) => {
                        // 🔹 개별 응답 데이터 로그 확인
                        console.log("📊 개별 응답 데이터:", item);
                        console.log("🟢 responsePercentages:", item.responsePercentages);

                        if (!acc[item.srvyCn]) {
                            acc[item.srvyCn] = {
                                totalCount: 0,
                                multipleChoiceResponses: [],  // 객관식 응답 배열
                                textResponses: [], // 단답형 응답 저장할 배열 추가
                                responsePercentages: {} // 객관식 응답 퍼센트 저장
                            };
                        }
                        // 객관식 응답 처리
                        if (item.multipleChoiceResponses && item.multipleChoiceResponses.length > 0) {
                            acc[item.srvyCn].multipleChoiceResponses = item.multipleChoiceResponses;
                            acc[item.srvyCn].totalCount = item.multipleChoiceCount;  // 객관식 응답 수 추가
                            
                            // 백엔드에서 받은 `personPercentage` 값을 매핑
                            if (item.responsePercentages) {
                                acc[item.srvyCn].responsePercentages = item.responsePercentages;
                        }
                
                        }

                        // 단답형 응답 처리
                        if (item.shortAnswerResponses && item.shortAnswerResponses.length > 0) {
                            acc[item.srvyCn].textResponses = item.shortAnswerResponses;
                            acc[item.srvyCn].totalCount += item.shortAnswerResponses.length;  // 단답형 응답 수 추가
                        }
                        return acc;
                    }, {});

                    setSurveyResults(groupedResults);
                } else {
                    console.warn("⚠️ 만족도 조사 데이터가 없습니다.");
                }
            })
            .catch(error => {
                console.error("❌ Error fetching survey results:", error);
            });
    }, [groupNo]);

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
            <h1>📊 분석 만족도 조사 통계</h1>
            {Object.keys(surveyResults).length === 0 ? (
                <p>⚠️ 만족도 조사 데이터가 없습니다.</p>
            ) : (
                <form>
                    {Object.entries(surveyResults)
                        //.reverse() // 문항 순서 반대로 정렬
                        .map(([question, { multipleChoiceResponses, responsePercentages, totalCount, textResponses }], qIndex) => (
                            <div className="question" key={qIndex}>
                                <label>{question}</label>

                                {/* 객관식 응답 표시 */}
                                {multipleChoiceResponses && multipleChoiceResponses.length > 0 && (
                                    <div className="satisfaction-options">
                                        {multipleChoiceResponses.map((response, index) => {
                                            const percentage = responsePercentages && responsePercentages[index] !== undefined
                                            ? parseFloat(responsePercentages[index])  // 배열에서 퍼센트를 가져와서 실수로 변환
                                            : 0;  // Default to 0 if percentage is not found
                                            return (
                                                <div key={index}>
                                                    <input
                                                        type="radio"
                                                        id={`satisfaction-${qIndex}-${index}`}
                                                        name={`satisfaction-${qIndex}`}
                                                        value={response}
                                                        disabled
                                                        checked={false} // 라디오 버튼이 항상 선택되지 않도록
                                                    />
                                                    <label htmlFor={`satisfaction-${qIndex}-${index}`}>
                                                        {response}
                                                    </label>
                                                    <span className="result">{percentage.toFixed(2)}%</span> {/* 퍼센트 표시 */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* 단답형 응답 표시 */}
                                {textResponses && textResponses.length > 0 && (
                                    <div className="text-responses">
                                        <h4>단답형 응답:</h4>
                                        <ul>
                                            {textResponses.map((text, idx) => (
                                                <li key={idx}>📝 {text}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                             {/* totalCount 표시 */}
                             <div className="total-count">
                                    <p>응답 수: {totalCount}</p>
                                </div>
                            </div>
                        ))}
                    <div className="submit-section">
                        <button type="button" onClick={() => window.history.back()}>뒤로가기</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SrvyData;
