## dbへのマイグレーション
1.ファイル作成
```bash
migrate create -ext sql -dir db/migrations -seq create_ファイル名
```
2. コマンド実行
```bash
migrate -source file://db/migrations -database "mysqlのURL" up
```
## 要 backendコンテナ内でのAWS CLIのインストール
credential情報が登録されているかの確認
```bash
aws configure list
```
されていなければ以下のコマンドで設定
```bash
aws configure
```
