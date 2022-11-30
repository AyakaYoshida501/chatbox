## dbへのマイグレーション
1.ファイル作成
```bash
migrate create -ext sql -dir db/migrations -seq create_ファイル名
```
2. コマンド実行
```bash
migrate -source file://db/migrations -database "mysqlのURL" up
```
