import axios from 'axios'
import Head from 'next/head'
import { useState } from 'react'
import { Axios } from "../lib/api";
// import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

// interface iconObj {
//     [key: string]: Array<{ Id?: number; Icons?: string }>
// }

interface responceObj {
    responce?: history[];
    iconResonce?: icon[];
}

interface history {
    Id: number;
    His: string
}
interface icon {
    Id: number;
    Icons: string
}

export default function Home(responce: responceObj) {
    const [history, setHistory] = useState<string>('')
    const [skill, setSkill] = useState<string>('')
    //const [session, loading] = useSession();
    const { data: loading }  = useSession(); //todo
    const { data: session }  = useSession(); //todo
    

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
        if(responce.responce) {
            console.log("responce",responce)
            return responce.responce[0].His
        }
    }
    const showIcons = () => {
        if(responce.iconResonce) {
            console.log(responce.iconResonce)
            return responce.iconResonce.map((icon: icon, i:number) => (
                <div key={i} className='icons'>
                <img src={icon.Icons} alt="typescript" width="40" height="40"/>
                </div>
            ))} 
        }
        console.log(responce)
    return (
        <>
          {!session && (
        <>
          {loading ? (
            <>Loading ...</>
          ) : (
            <>
              Not signed in <br />
              <button onClick={() => signIn()}>Sign in</button>
            </>
          )}
        </>
      )}
      {session && (
        <>
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
                            <input className='skill' size={100} value={skill} onChange={(e) => setSkill(e.target.value)}></input>
                        </div>
                        <button className='postHSkillBtn' onClick={postSkill}>送信する</button>
                        <br></br>
                        <div className='skillIcons'>
                            {showIcons()}
                        </div>
                    </div>
                    </div>
                </div>
                <button onClick={() => signOut()}>Sign out</button> 
            </main>
        </div>
        </>
        )}
    </>
    )
}

export async function getServerSideProps() {
    const res = await axios.get(`${process.env.API}/getHistories`, {
    });
    const iconRes = await axios.get(`${process.env.API}/getIcons`, {
    });
    const responce = await res.data;
    const iconResonce = await iconRes.data;
    return {
        props: {
            responce, iconResonce
        },
    };
  }
