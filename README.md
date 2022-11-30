## dbへのマイグレーション
### ①ファイル作成
### ②　```bash
migrate -source file://db/migrations -database "mysql://user:pass@tcp(db:3306)/aikon_db" up
``` 実行
