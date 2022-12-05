import axios from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

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
          <div key={i}>
          <img src={icon.Icons} alt="typescript" width="40" height="40"/>
          </div>
      ))} 
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>MyPortfolio</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='styleMain'>
        <h1>my portfolio</h1>
        <div className='introduceMe'>
        <img src="/mypic.JPG" alt="mypic" width={200} height={200} />  {/* 変更可能にする */}
          <p>名前：よしだあやか</p>
        </div>
        <div className='myHistory'>
          <h2>経歴</h2>
          {showHistory()}
        </div>
        <div className='projects'>
          <h2>作ったもの</h2>
        </div>
        <div className='skills'>
          <h2>skills</h2>
          {showIcons()}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
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
