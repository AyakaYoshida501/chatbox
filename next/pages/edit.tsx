import Head from 'next/head'
import { useState } from 'react'


export default function Home() {
    const [history, setHistory] = useState<string>('')
    const [skill, setSkill] = useState<string>('')

    const postHistory = () =>{ //toDo
        const data = {
            myHis: history 
        }
        console.log(data)
    }
    const postSkill = () =>{ //toDo
        const data = {
            skills: skill 
        }
        console.log(data)
    }

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
                </div>
                <div className='projects'>
                    <h2>作ったもの</h2>
                </div>
                <div className='skills'>
                    <h2>skills</h2>
                    <p text-align="left">{/*imgタグ１つ準備して、srcの中身をAPIで拾ってループ回す */}
                    <div className='myHistoryEdit'>
                        <textarea className='skill' cols={50} rows={10} value={skill} onChange={(e) => setSkill(e.target.value)}></textarea>
                        <button className='postHSkillBtn' onClick={postSkill}>決定</button>
                    </div>

                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original-wordmark.svg" alt="go" width="40" height="40"/> 
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg" alt="php" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" alt="next.js" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> 
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain-wordmark.svg" alt="firebase" width="40" height="40"/>
                    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/>
                    </p>
                </div>

            </main>
        </div>

    )
}