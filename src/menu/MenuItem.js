import React from 'react';
import {Link} from 'react-router-dom'
const MenuItem = (props) => {
    const { menu, index } = props;
    const {no,menuNm, menuLnkg,rlsMbrAuthrt,mngrPageRlsYn,userPageRlsYn,useYn} = props.menu;
    let auth,mngr,user;
    switch(rlsMbrAuthrt){
        case 1:auth="일반";break;
        case 3:auth="관리자";break;
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if(window.confirm("삭제 하시겠습니까?")) {
            fetch('http://localhost:9191/api/menudelete',{
                method:"POST",
                headers:{
                    "Content-Type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({no:no})
            })
            .then((response)=>{
                if(response.status==200){
                    window.location.reload();
                    alert("삭제되었습니다.");
                }
            });
        }
    };
    return (
        
        <tr>
            <td>{index}</td>
            <td>{menuNm}</td>
            <td>{menuLnkg}</td>
            <td>{auth}</td>
            <td>{useYn}</td>
            <td>
                <button type="button"><Link to={`/menu/MenuReg?no=${no}`}>수정</Link></button>
                <button type="button" onClick={handleSubmit}>삭제</button>
            </td>
        </tr>
        
    );
};
export default MenuItem;