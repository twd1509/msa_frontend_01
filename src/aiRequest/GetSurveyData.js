import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom'; 
import "../aiRequest/css/reqStyle.css";
import {MemberInfoContext} from '../components/MemberInfoContext';
import SrvyUpdate from '../aiRequest/SrvyUpdate'; // 수정 컴포넌트 가져오기

const GetSurveyData = () => {
    const { email: paramEmail, groupNo } = useParams();
    const { email: memberEmail } = useContext(MemberInfoContext);

    // email을 URL 파라미터에서 가져오되, 없으면 로그인한 사용자 정보에서 가져옴
    const email = paramEmail || memberEmail;

    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 만족도 조사 데이터 불러오기
    useEffect(() => {
        console.log("email:", email, "groupNo:", groupNo); // 값 확인
        if (!email || !groupNo) return;

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9193/api/GetSurveyData/${email}/${groupNo}`, {
                        method: "GET"
                    }
                );
                const result = await response.json();
                console.log('Survey Data:', result); // 응답 데이터 확인
                setFormData(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [email, groupNo]);

    if (loading) return <div>데이터 불러오는 중...</div>;

    return (
        <SrvyUpdate formData={formData} setFormData={setFormData} />
    );
};

export default GetSurveyData;