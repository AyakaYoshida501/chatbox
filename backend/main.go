package main
import (
    "net/http"
	"fmt"
    "database/sql"
    "log"
    "os"
    "io/ioutil"
    "encoding/json"
    "bytes"

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
    log.Println("接続OK");
    //defer db.Close()
    return db
}

type History struct {
    Id int `json:id`
    His string `json:his`
}
func postMyhis(w http.ResponseWriter, r *http.Request) {
    db :=connectionDB()//connectionDB実行するときに出来る変数 db を利用した関数内でも使えるのか？？エラーでるかも
    defer db.Close()
    b, err := ioutil.ReadAll(r.Body)
    if err != nil {
        log.Println("io error")
        return
    }

    jsonBytes := ([]byte)(b)
    data := new(History)
    if err := json.Unmarshal(jsonBytes, data); err != nil {
        log.Println("JSON Unmarshal error:", err)
        return
    }

    _, err = db.Exec("INSERT INTO histories (his) VALUES(?)", data.His) // スペースありの一列で入ってくるから\nで改行する必要あり
    if err != nil {
        log.Println("insert error!", err)//sql: database is closed
    }
}

func getHistoriesRows(db *sql.DB) *sql.Rows { 
    rows, err := db.Query("SELECT * FROM histories")
    if err != nil {
        log.Println("get histories error!", err)    
    }
    return rows
}

func getHistories(w http.ResponseWriter, r *http.Request) {
    db := connectionDB()
    defer db.Close()
    rows := getHistoriesRows(db) // 行データ取得
    history := History{}//
    var resulthistory [] History//
    for rows.Next() {
        error := rows.Scan(&history.Id, &history.His)//
        if error != nil {
            log.Println("scan error", error)
        } else {
            resulthistory = append(resulthistory, history)
        }
    }
    var buf bytes.Buffer 
    enc := json.NewEncoder(&buf) 
    if err := enc.Encode(&resulthistory); err != nil {
        log.Fatal(err)
    }
    log.Printf(buf.String())

    _, err := fmt.Fprint(w, buf.String()) 
    if err != nil {
        return
    }
}

type skillicon struct {
    Id int `json:id`
    Icons string `json:icon`
}

func getIconsRows(db *sql.DB) *sql.Rows { 
    rows, err := db.Query("SELECT * FROM skillIcons")
    if err != nil {
        log.Println("get skillIcons error!", err)    
    }
    return rows
}

func getIcons(w http.ResponseWriter, r *http.Request) {
    db := connectionDB()
    defer db.Close()
    rows :=  getIconsRows(db) // 行データ取得
    icon := Icon{}//
    var resultIcon [] Icon
    for rows.Next() {
        error := rows.Scan(&icon.Id, &icon.Icons)//
        if error != nil {
            log.Println("scan error", error)
        } else {
            resultIcon = append(resultIcon, icon)
        }
    }
    var buf bytes.Buffer 
    enc := json.NewEncoder(&buf) 
    if err := enc.Encode(&resulthistory); err != nil {
        log.Fatal(err)
    }
    log.Printf(buf.String())

    _, err := fmt.Fprint(w, buf.String()) 
    if err != nil {
        return
    }
}

func postIcons(w http.ResponseWriter, r *http.Request) {
    db :=connectionDB()//connectionDB実行するときに出来る変数 db を利用した関数内でも使えるのか？？エラーでるかも
    defer db.Close()
    b, err := ioutil.ReadAll(r.Body)
    if err != nil {
        log.Println("io error")
        return
    }

    jsonBytes := ([]byte)(b)
    data := new(skillicon)
    if err := json.Unmarshal(jsonBytes, data); err != nil {
        log.Println("JSON Unmarshal error:", err)
        return
    }

    _, err = db.Exec("INSERT INTO skillIcons (icons) VALUES(?)", data.Icons) // スペースありの一列で入ってくるから\nで改行する必要あり
    if err != nil {
        log.Println("insert error!", err)//sql: database is closed
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
    http.HandleFunc("/postMyhis", postMyhis)
    http.HandleFunc("/getHistories", getHistories)
    http.HandleFunc("/postIcons", postIcons)
    http.HandleFunc("/getIcons", getIcons)
    http.ListenAndServe(":8080", nil)
}