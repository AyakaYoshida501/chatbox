package main
import (
    "net/http"
	"fmt"
    "database/sql"
    "log"
    "os"

    "github.com/joho/godotenv"
    "github.com/comail/colog"
    _ "github.com/go-sql-driver/mysql"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "<h1>Hello, World</h1>")//固定値を返してる
}

func envLoad() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading env target")
	}
}

func connectionDB() *sql.DB {
    dsn := fmt.Sprintf("%s:%s@%s(%s:%s)/%s", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_PROTOCOL"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB"))
    log.Println(dsn)
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Println("Err1")
    }
    // log.Println("接続OK");
    defer db.Close()
    return db
}

type his struct {
    History string `json:history`
}
func postMyhis(w http.ResponseWriter, r *http.Request) {
    connectionDB();//connectionDB実行するときに出来る変数 db を利用した関数内でも使えるのか？？エラーでるかも

    b, err := ioutil.ReadAll(r.Body)
    if err != nil {
        log.Println("io error")
        return
    }

    jsonBytes := ([]byte)(b)
    data := new(his)
    if err := json.Unmarshal(jsonBytes, data); err != nil {
        log.Println("JSON Unmarshal error:", err)
        return
    }

    db, err = db.Exec("INSERT INTO histories (his) VALUES(?)", data.History) // スペースありの一列で入ってくるから\nで改行する必要あり
    if err != nil {
        log.Println("insert error!")
    }
}

func main() {
    envLoad()
    colog.SetDefaultLevel(colog.LDebug)
    colog.SetMinLevel(colog.LTrace)
    colog.SetFormatter(&colog.StdFormatter{
        Colors: true,
        Flag:   log.Ldate | log.Ltime | log.Lshortfile,
    })
    connectionDB()

    http.HandleFunc("/", helloHandler)
    // // http.HandleFunc("/postMyhis", postMyhis)
    http.ListenAndServe(":8080", nil)
}