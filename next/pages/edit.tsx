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
    {console.log(resOfHistory.resOfHistory[0].His)}
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
                    {resOfHistory.resOfHistory[0].His}
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
                    <div className='myHistoryEdit'>
                        <textarea className='skill' cols={50} rows={10} value={skill} onChange={(e) => setSkill(e.target.value)}></textarea>
                        <button className='postHSkillBtn' onClick={postSkill}>送信する</button>
                    </div>

                    {/* <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original-wordmark.svg" alt="go" width="40" height="40"/> 
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg" alt="php" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" alt="next.js" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> 
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain-wordmark.svg" alt="firebase" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> */}
                    </div>
                </div>
            </main>
        </div>

    )
}

export async function getServerSideProps() {
    const res = await axios.get(`${process.env.API}/getHistories`, {
    });
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
