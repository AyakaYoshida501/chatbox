import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { Axios } from "../lib/api";
// import type { NextPage } from "next";

export default function Home(resOfHistory: any) {
    const [history, setHistory] = useState<string>('')
    const [skill, setSkill] = useState<string>('')

    const postHistory = () =>{ 
        const data = {
            "His": history 
        }
        Axios.post(`api/proxy/postMyhis`, data)
        .then(res => {
            console.log(res);
        })
    }
    const postSkill = () =>{ 
        const data = {
            "Icons": skill 
        }
        Axios.post(`api/proxy/postIcons`, data)
        .then(res => {
            console.log(res);
        })
    }
    const showHistory  = () => {
        if(resOfHistory.resOfHistory[0].His) {
            return resOfHistory.resOfHistory[0].His
        }
    }
    // {console.log(resOfHistory.resOfHistory[0].His)}
//     const plusTextarea = () => { //skillの入力タグ追加用
//         const skills: HTMLElement | null = document.querySelector<HTMLElement>(".plusSkill")
//         const pulsTag:HTMLInputElement = document.createElement('input');//<input className='skill' cols={50} rows={10} value={skill} onChange={(e) => setSkill(e.target.value)}></input>
//         pulsTag.type = "text";
//         pulsTag.className = "pulsTag"
//         pulsTag.value = skill;
//         onchange=(e) => setSkill(e.target.value)}
//         pulsTag.onmouseover = function(event:MouseEvent) { // ここ
//         alert(event);
// }
//         document.body.appendChild(pulsTag)
//         console.log("test")
//         return (
//             <textarea className='skill' cols={50} rows={10} value={skill} onChange={(e) => setSkill(e.target.value)}></textarea>
//         )
//     }
    return (
        <div className='container'>
            <Head>
            <title>MyPortfolio edit page</title>
            </Head>

            <main className='mainContainer'>
            <h1>my portfolio</h1>
                <div className='introduceMe'>
                    <img src="/mypic.JPG" alt="mypic" width={200} height={200} />  {/* 変更可能にする S3*/}
                </div>
                <div className='myHistory'>
                    <h2>経歴</h2>
                    <div className='myHistoryEdit'>
                        <textarea className='history' cols={50} rows={10} value={history} onChange={(e) => setHistory(e.target.value)}></textarea>
                        <button className='postHistoryBtn' onClick={postHistory}>決定</button>
                    </div>
                    {showHistory()}
                </div>
                <div className='projects'>
                    <h2>作ったもの</h2>
                    <form method="post" encType="multipart/form-data">
                        <input type="file" name="sakuhin" accept='image/*' multiple/>
                        <button type="submit">送信する</button>
                    </form>
                </div>
                <div className='skills'>
                    <h2>skills</h2>
                    <div text-align="left">{/*imgタグ１つ準備して、srcの中身をAPIで拾ってループ回す */}
                    <div className='myskillsEdit'>
                        <div className='plusSkill'>
                            <textarea className='skill' cols={50} rows={10} value={skill} onChange={(e) => setSkill(e.target.value)}></textarea>
                        </div>
                        {/* <button className='plusTextarea' onClick={plusTextarea}>入力欄追加</button> */}
                        <button className='postHSkillBtn' onClick={postSkill}>送信する</button>
                    </div>
                    </div>
                </div>
            </main>
        </div>

    )
}

export async function getServerSideProps() {
    const res = await axios.get(`${process.env.API}/getHistories`, {
    });
    // const iconRes = 
    const resOfHistory = await res.data;
    // {console.log(history)}
    // {console.log(typeof history)}
    // {console.log(typeof history[0])}
    // {console.log(history[0].His)}
    // {console.log(typeof history[0].His)}
  
    return {
        props: {
            resOfHistory
        },
    };
  }
