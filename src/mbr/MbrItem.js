import React from 'react';
import {Link} from 'react-router-dom'

const MbrItem = ({ mbr = {}, index }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        if(window.confirm("삭제 하시겠습니까?")) {
            fetch('http://localhost:9191/api/mbr/mbrdelete',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({email:mbr.email})
            })
            .then((response)=>{
                if(response.status==200){
                    window.location.reload();
                    alert("삭제되었습니다.");
                }
            });
        }
    };

    return(
        <tr>
            <td>{index}</td>
            <td><Link to={`/mbr/MbrDtl/${mbr.email}`}>{mbr.email}</Link></td>
            <td>{mbr.name}</td>
            <td>{mbr.phone}</td>
            <td>
                <div class="buttons">
                    <Link to={`/aiRequest/SrvyRslt?groupNo=1&email=${mbr.email}`}><button class="edit-btn">확인</button></Link>
                </div>
            </td>
            <td>
                <div class="buttons">
                    <Link to={`/mbr/MbrJoin/${mbr.email}`}><button class="edit-btn">수정</button></Link>
                    
                    <button class="edit-btn" onClick={handleSubmit}>삭제</button>
                </div>
            </td>
        </tr>
    );
}
export default MbrItem;