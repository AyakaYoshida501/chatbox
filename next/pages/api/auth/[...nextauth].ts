import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import CredentialsProvider from "next-auth/providers/credentials";

// NextAuth.js関数に渡すオプション
// const options = {
//     providers: [
//       Providers.Credentials({
//         // NextAuthの認証関数。credentialsにログイン情報が格納される。
//         authorize: async credentials => {
//           if (
//             // ログインID・パスワードは環境変数にて設定する。
//             credentials.login === process.env.NEXT_PUBLIC_LOGIN_ID &&
//             credentials.password === process.env.NEXT_PUBLIC_PASSWORD
//           ) {
//             // ログイン成功後ユーザー情報を返却する。値はsessionに格納される。
//             return Promise.resolve({ name: 'admin' })
//           } else {
//             // ログイン失敗後認証を拒否し、エラーメッセージを返却する。
//             return Promise.resolve(null)
//           }
//         },
//       }),
//     ],
//     // ログインページを指定する。今回はトップページのため'/'を指定。
//     pages: {
//       signIn: '/',
//     },
//   }
  
//   export default (req, res) => NextAuth(req, res, options)

export default NextAuth({
  providers: [
    CredentialsProvider({
      // サインインフォームに表示する名前 (例: "Sign in with...")
      name: "Credentials POC",
      // 認証情報は、サインインページに適切なフォームを生成するために使用されます。
      // 送信されることを期待するフィールドを何でも指定することができます。
      // 例: ドメイン、ユーザー名、パスワード、2FAトークンなど。
      // オブジェクトを通して、任意の HTML 属性を <input> タグに渡すことができます。
      credentials: {
        username: { label: "ユーザー名", type: "text", placeholder: "ユーザー名" },
        password: {  label: "パスワード", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials
        // ここにロジックを追加して、提供されたクレデンシャルからユーザーを検索します。
        const user = { id: 1, name: "太郎", email: "tarou@example.com" }

        if (user) {
          // 返されたオブジェクトはすべて、JWTの `user` プロパティに保存されます。
          return user
        } else {
          // もし、NULLを返した場合は、ユーザーに詳細を確認するよう促すエラーが表示されます。
          return null

          // また、このコールバックをエラーで拒否することもできます。この場合、ユーザーはエラーメッセージをクエリパラメータとして持つエラーページに送られます。
        }
      }
    }),
  ],
})