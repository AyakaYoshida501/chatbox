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
    // "strings"
    // "html"
    // "image"
    // "regexp"
    "io"

    "github.com/joho/godotenv"
    "github.com/comail/colog"

    "github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"

    _ "github.com/go-sql-driver/mysql"
    _ "image/gif"
	_ "image/png"
	_ "image/jpeg"
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
    //log.Println(dsn)
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
    if err := json.Unmarshal(jsonBytes, data); err != nil { // dataにバイト列を格納
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
    //log.Printf(buf.String())

    _, err := fmt.Fprint(w, buf.String()) 
    if err != nil {
        return
    }
}

type Icon struct {
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
    if err := enc.Encode(&resultIcon); err != nil {
        log.Fatal(err)
    }
    //log.Printf(buf.String())

    _, err := fmt.Fprint(w, buf.String()) 
    if err != nil {
        return
    }
}

func postIcons(w http.ResponseWriter, r *http.Request) {
    db :=connectionDB()
    defer db.Close()
    log.Println("r.Body:",r.Body)
    // req := html.EscapeString(r.Body)
    // log.Println("req:",req)
    b, err := ioutil.ReadAll(r.Body)//b, err := ioutil.ReadAll(req)
    log.Println("b:",b)
    if err != nil {
        log.Println("io error")
        return
    }

    jsonBytes := ([]byte)(b)
    log.Println("jsonBytes:",jsonBytes)
    data := new(Icon)
    log.Println("data:",data)
    if err := json.Unmarshal(jsonBytes, data); err != nil {
        log.Println("JSON Unmarshal error:", err)
        return
    }

    _, err = db.Exec("INSERT INTO skillIcons (icons) VALUES(?)", data.Icons) // スペースありの一列で入ってくるから\nで改行する必要あり
    if err != nil {
        log.Println("insert error!", err)//sql: database is closed
    }
}

type pic struct {
    Id int `json:id`
    Picture string `json:picture`
}

func uploadS3(w http.ResponseWriter, r *http.Request) {
    sess := session.Must(session.NewSession(&aws.Config{
        Region: aws.String("ap-northeast-3")},))
    // sess, err := session.NewSession(&aws.Config{
    //     Region: aws.String("ap-northeast-3")},
    // )
    // if err != nil {
    //     log.Fatal("failed to make session, %v", err)
    //     //return fmt.Errorf("failed to upload file, %v\n", err)
    // }

    //     sess := session.Must(session.NewSessionWithOptions(session.Options{
    //     SharedConfigState: session.SharedConfigEnable, //オプションの「SharedConfigState」に「SharedConfigEnable」を設定することで、設定している ~/.aws/config内を参照してくれる
    //     Config: aws.Config{
    //         Region: aws.String("ap-northeast-3"),
    //     },
    // })) //%vNoCredentialProviders: no valid providers in chain.


    // sess := session.Must(session.NewSessionWithOptions(session.Options{
	// 	Config:  aws.Config{Region: aws.String("ap-northeast-3")},
    //     SharedConfigState: session.SharedConfigEnable,
	// 	Profile: "default",
	// }))    

    // sess := session.Must(session.NewSession(&aws.Config{
    //     Region:      aws.String("ap-northeast-3"),
    //     Credentials: credentials.NewSharedCredentials("", "profile"),
    // }))
    uploader := s3manager.NewUploader(sess)

    //dbにアップロードする用の式
    // b, err := ioutil.ReadAll(r.Body)//todo 
    // if err != nil {
    //     log.Println("io error")
    //     return
    // }

    // jsonBytes := ([]byte)(b)
    // data := new(pic)
    // // data := &pic{}
    // if err := json.Unmarshal(jsonBytes, data); err != nil {
    //     log.Println("JSON Unmarshal error:", err)
    //     return
    // }
    // var uppic *string 
    // uppic = &data.Picture // *string型が格納
    // log.Println("uppic:", uppic)



    //フォームで読み取る画像ファイルの方→　multipart.File
    // file, _, err := r.FormFile("image")
    // upData := strings.NewReader(data.Picture)//文字列として読み込んてるから画像が表示されない

    // fileA, _ := os.Open(data.Picture)
    // log.Println("file:", file)
    // file, _ := os.Open(data.Picture) //%vReadRequestBody: unable to initialize upload
    // log.Println("data.Picture:", data.Picture)
    // log.Println("os.Open(data.Picture):", os.Open(data.Picture))
    // defer fileA.Close()

    // //ファイル名をローカルと同じに
    // reg := regexp.MustCompile(`([^\\]*jpeg)$`)
    // // // upPic := reg.ReplaceAllString(data.Picture, "")
    // picName := reg.FindString(data.Picture)
    // // //upPic := strings.Replace(data.Picture, "C:/fakepath/", "", 1) // [Cから始まって最後の/] までが理想
    // // log.Println("upPic:", upPic)


	// if _, err := os.Stat(upPic); err == nil {
	// 	fmt.Println("存在します")
	// } else {
	// 	panic("Couldn't stat image: " + err.Error())
	// }
    // file, _ := os.Open(upPic)
    // defer file.Close()
    
    //写真が上がるかチェック
    // var uppic = "./mypic.JPG" //uppic := "../next/public/mypic.JPG"
    // if _, err := os.Stat(*uppic); err == nil {
	// 	fmt.Println("have a file")
	// } else {
	// 	panic("Couldn't stat image: " + err.Error())
	// }

    // file, _ := os.Open(*uppic) //failed to upload file, %vReadRequestBody: unable to initialize upload caused by: invalid argument
    //👆openするファイルのパスがmain.goからの相対パスではなく、絶対パスだから...?
    // log.Println("file:", file)
    // defer file.Close()

    // fmt.Println("r:", r) 
    log.Print("method:", r.Method) //リクエストを受け取るメソッド
    r.ParseMultipartForm(32 << 20) //画像データをデコードしてファイルとして保存  引数にはメモリに保存する最大バイト長を指定 32MB
    // file, handler, err := r.FormFile("sakuhin") //パースした画像データをファイルとして扱う パース...データを解析しプログラムにとって扱いやすい形にする htmlタグのnameの名前
    file, handler, err := r.FormFile("Picture")
    if err != nil {
        log.Printf("パースするときのerr:", err)
        // http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()
    
    
    fmt.Fprintf(w, "%v", handler.Header)
    f, err := os.OpenFile("./upload/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
    // f.Header.Add("Content-Type", r.FormDataContentType())
    // O_WRONLY int = syscall.O_WRONLY // ファイルをライトオンリーでオープン
    // O_CREATE int = syscall.O_CREAT // ファイルが存在しなければ新しいファイルを作成
    if err != nil {
        log.Printf("ファイルを読み取って作成するときのerr:", err)
        return
    }

    defer f.Close()
    io.Copy(f, file)
    fmt.Println("f:", f)



    // Upload the file to S3.
    myBucket :=os.Getenv("Bucket_name")
    result, err := uploader.Upload(&s3manager.UploadInput{
        Bucket: aws.String(myBucket), 
        Key:    aws.String(handler.Filename),//aws.String("file"),//aws.String(picName), 
        Body:   f,//strings.NewReader(*uppic),//file, strings.NewReader(*uppic)に変えたらダウンロードしなくなった！画像になった！ ⇦サイズが合わない＆画像見れないのはファイルを読み込んでないから？？
        // ContentType:   aws.String("image/jpeg"),
    })
    if err != nil {
        log.Fatal("failed to upload file, %v", err)
        //return fmt.Errorf("failed to upload file, %v\n", err)
    }
    fmt.Println("アップロード関数通過")
    fmt.Printf("file uploaded to, %s\n", aws.String(result.Location))
    fmt.Printf("file uploaded to, %T\n", aws.String(result.Location))
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
    http.HandleFunc("/uploadS3", uploadS3)
    http.ListenAndServe(":8080", nil)
}