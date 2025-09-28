# 変更履歴

## 未リリース

### 追加
-   [PostgreSQL Dialect] Postgres Triggersの限定的なサポートを追加 (#5932 by [Griffio][griffio])
-   [PostgreSQL Dialect] SQL式がJSONとして解析できるかをチェックする述語を追加 (#5843 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのComment Onステートメントに対する限定的なサポートを追加 (#5808 by [Griffio][griffio])
-   [MySQL Dialect] インデックス可視性オプションのサポートを追加 (#5785 by [Oren Kislev][orenkislev-faire])
-   [PostgreSql Dialect] TSQUERYデータ型のサポートを追加 (#5779 by [Griffio][griffio])
-   [Gradle Plugin] モジュール追加時のバージョンカタログのサポートを追加 (#5755 by [Michael Rittmeister][DRSchlaubi])

### 変更
-   開発中のスナップショットは、https://central.sonatype.com/repository/maven-snapshots/ のCentral Portal Snapshotsリポジトリに公開されるようになりました。
-   [Compiler] コンストラクタ参照を使用して、デフォルトで生成されるクエリを簡素化 (#5814 by [Jon Poulton][jonapoul])

### 修正
-   [Compiler] 共通テーブル式を含むViewを使用する際のスタックオーバーフローを修正 (#5928 by [Griffio][griffio])
-   [Gradle Plugin] SqlDelightツールウィンドウで「新しい接続」を追加する際のクラッシュを修正 (#5906 by [Griffio][griffio])
-   [IntelliJ Plugin] コピー・トゥ・SQLiteガターアクションにおけるスレッド関連のクラッシュを回避 (#5901 by [Griffio][griffio])
-   [IntelliJ Plugin] CREATE INDEXおよびCREATE VIEWスキーマステートメント使用時のPostgreSql Dialectの修正 (#5772 by [Griffio][griffio])
-   [Compiler] 列参照時のFTSスタックオーバーフローを修正 (#5896 by [Griffio][griffio])
-   [Compiler] WITH RECURSIVEスタックオーバーフローを修正 (#5892 by [Griffio][griffio])
-   [Compiler] INSERT|UPDATE|DELETE RETURNINGステートメントの通知を修正 (#5851 by [Griffio][griffio])
-   [Compiler] Longを返すトランザクションブロックの非同期結果型を修正 (#5836 by [Griffio][griffio])
-   [Compiler] SQLパラメータバインディングの複雑度をO(n²)からO(n)に最適化 (#5898 by [Chen Frenkel][chenf7])
-   [SQLite Dialect] Sqlite 3.18で不足していた関数を修正 (#5759 by [Griffio][griffio])

## [2.1.0] - 2025-05-16

### 追加
-   [WASM Driver] Web Worker DriverへのwasmJsのサポートを追加 (#5534 by [Ilya Gulya][IlyaGulya])
-   [PostgreSQL Dialect] PostgreSqlのUnNest Array to rowsをサポート (#5673 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのTSRANGE/TSTZRANGEをサポート (#5297 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのRight Full Join (#5086 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのtemporal typesからの抽出をサポート (#5273 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのarray contains演算子 (#4933 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの制約削除 (#5288 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの型キャスト (#5089 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのサブクエリ用lateral join演算子 (#5122 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのILIKE演算子 (#5330 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのXML型 (#5331 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのAT TIME ZONE (#5243 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのORDER BY NULLSをサポート (#5199 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの現在日時関数サポートを追加 (#5226 by [Drew Dobson][drewd])
-   [PostgreSQL Dialect] PostgreSqlの正規表現演算子 (#5137 by [Griffio][griffio])
-   [PostgreSQL Dialect] brin gistを追加 (#5059 by [Griffio][griffio])
-   [MySQL Dialect] MySQL DialectのRENAME INDEXをサポート (#5212 by [Oren Kislev][orenkislev-faire])
-   [JSON Extension] JSONテーブル関数にエイリアスを追加 (#5372 by [Griffio][griffio])

### 変更
-   [Compiler] 生成されるクエリファイルが、シンプルなミューテーターの行数を返すように変更 (#4578 by [Marius Volkhart][MariusV])
-   [Native Driver] `NativeSqlDatabase.kt`を更新し、`DELETE`、`INSERT`、`UPDATE`ステートメントの読み取り専用フラグを変更 (#5680 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PgInterval`を`String`に変更 (#5403 by [Griffio][griffio])
-   [PostgreSQL Dialect] SqlDelightモジュールがPostgreSql拡張を実装できるようにサポート (#5677 by [Griffio][griffio])

### 修正
-   [Compiler] 修正: 結果を伴うグループステートメント実行時にクエリに通知するよう修正 (#5006 by [Vitor Hugo Schwaab][vitorhugods])
-   [Compiler] `SqlDelightModule`型リゾルバーを修正 (#5625 by [Griffio][griffio])
-   [Compiler] 5501の挿入オブジェクトエスケープ列を修正 (#5503 by [Griffio][griffio])
-   [Compiler] コンパイラ: エラーメッセージを改善し、パスリンクが正しい行と文字位置でクリック可能になるように修正 (#5604 by [Niklas Baudy][vanniktech])
-   [Compiler] issue 5298を修正: キーワードをテーブル名として使用できるように修正
-   [Compiler] 名前付き実行を修正し、テストを追加
-   [Compiler] 初期化ステートメントのソート時に外部キーテーブル制約を考慮 (#5325 by [Leon Linhart][TheMrMilchmann])
-   [Compiler] タブが関係する場合にエラー下線を適切に揃えるよう修正 (#5224 by [Drew Dobson][drewd])
-   [JDBC Driver] トランザクション終了時の`connectionManager`のメモリリークを修正
-   [JDBC Driver] ドキュメントに記載されているように、SQLiteのマイグレーションをトランザクション内で実行するよう修正 (#5218 by [Lukáš Moravec][morki])
-   [JDBC Driver] トランザクションコミット/ロールバック後の接続リークを修正 (#5205 by [Lukáš Moravec][morki])
-   [Gradle Plugin] `GenerateSchemaTask`の前に`DriverInitializer`を実行するように修正 (#5562 by [Emeka Nwagu][nwagu])
-   [Runtime] 実際のドライバーが`Async`の場合に`LogSqliteDriver`でクラッシュする問題を修正 (#5723 by [Eric Denman][edenman])
-   [Runtime] `StringBuilder`の容量を修正 (#5192 by [Jan Bína][janbina])
-   [PostgreSQL Dialect] PostgreSqlの`CREATE OR REPLACE VIEW`を修正 (#5407 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの`TO_JSON`を修正 (#5606 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの`numeric resolver`を修正 (#5399 by [Griffio][griffio])
-   [PostgreSQL Dialect] SQLiteのウィンドウ関数を修正 (#2799 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの`SELECT DISTINCT ON`を修正 (#5345 by [Griffio][griffio])
-   [PostgreSQL Dialect] `ALTER TABLE ADD COLUMN IF NOT EXISTS`を修正 (#5309 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの非同期バインドパラメータを修正 (#5313 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのbooleanリテラルを修正 (#5262 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlのウィンドウ関数を修正 (#5155 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの`isNull`/`isNotNull`型を修正 (#5173 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの`SELECT DISTINCT`を修正 (#5172 by [Griffio][griffio])
-   [Paging Extension] ページングの初期ロード時のリフレッシュを修正 (#5615 by [Eva][evant])
-   [Paging Extension] MacOSネイティブターゲットを追加 (#5324 by [Vitor Hugo Schwaab][vitorhugods])
-   [IntelliJ Plugin] K2サポート

## [2.0.2] - 2024-04-05

### 追加
-   [PostgreSQL Dialect] PostgreSQLの`STRING_AGG`関数を追加 (#4950 by [André Danielsson][anddani])
-   [PostgreSQL Dialect] PG Dialectに`SET`ステートメントを追加 (#4927 by [Bastien de Luca][de-luca])
-   [PostgreSQL Dialect] PostgreSqlの`ALTER COLUMN SEQUENCE`パラメータを追加 (#4916 by [Griffio][griffio])
-   [PostgreSQL Dialect] `INSERT`ステートメントのPostgreSQL `ALTER COLUMN DEFAULT`サポートを追加 (#4912 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSqlの`ALTER SEQUENCE`と`DROP SEQUENCE`を追加 (#4920 by [Griffio][griffio])
-   [PostgreSQL Dialect] Postgresの正規表現関数定義を追加 (#5025 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `GIN`の文法を追加 (#5027 by [Griffio][griffio])

### 変更
-   [IDE Plugin] 最低バージョンを2023.1 / Android Studio Iguanaに変更
-   [Compiler] `encapsulatingType`での型null許容の上書きを許可 (#4882 by [Eliezer Graber][eygraber])
-   [Compiler] `SELECT *`の列名をインライン化
-   [Gradle Plugin] `processIsolation`に切り替え (#5068 by [Emeka Nwagu][nwagu])
-   [Android Runtime] Androidの`minSDK`を21に引き上げ (#5094 by [Philip Wedemann][hfhbd])
-   [Drivers] Dialect作者向けにJDBC/R2DBCステートメントメソッドをさらに公開 (#5098 by [Philip Wedemann][hfhbd])

### 修正
-   [PostgreSQL Dialect] PostgreSQLの`ALTER TABLE ALTER COLUMN`を修正 (#4868 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4448のテーブルモデルのインポート不足を修正 (#4885 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4932のPostgreSQLデフォルト制約関数を修正 (#4934 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4879のマイグレーション中の`ALTER TABLE RENAME COLUMN`でのPostgreSQLクラスキャストエラーを修正 (#4880 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4474のPostgreSql `CREATE EXTENSION`を修正 (#4541 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5018のPostgreSql `ADD PRIMARY KEY NOT NULLABLE TYPES`を修正 (#5020 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4703の集約式を修正 (#5071 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5028のPostgreSql `json`を修正 (#5030 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5040のPostgreSql `json`演算子を修正 (#5041 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5040の`json`演算子のバインディングを修正 (#5100 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5082の`tsvector`を修正 (#5104 by [Griffio][griffio])
-   [PostgreSQL Dialect] 5032のPostgreSql `UPDATE FROM`ステートメントでの列隣接を修正 (#5035 by [Griffio][griffio])
-   [SQLite Dialect] 4897のSQLite `ALTER TABLE RENAME COLUMN`を修正 (#4899 by [Griffio][griffio])
-   [IDE Plugin] エラーハンドラのクラッシュを修正 (#4988 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] BugSnagがIDEA 2023.3で初期化に失敗する問題を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] IntelliJでプラグイン経由で`.sq`ファイルを開く際の`PluginException`を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Kotlinライブラリがすでにプラグインの依存関係にあるため、IntelliJプラグインにバンドルしないよう修正 (#5126)
-   [IDE Plugin] ストリームの代わりに`extensions`配列を使用するよう修正 (#5127)

## [2.0.1] - 2023-12-01

### 追加
-   [Compiler] `SELECT`実行時に複数列式をサポート (#4453 by [Adriel Martinez][Adriel-M])
-   [PostgreSQL Dialect] PostgreSQL `CREATE INDEX CONCURRENTLY`のサポートを追加 (#4531 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのCTE補助ステートメントが互いを参照できるように許可 (#4493 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのバイナリ式および`SUM`の型サポートを追加 (#4539 by [Adriel Martinez][Adriel-M])
-   [PostgreSQL Dialect] PostgreSQL `SELECT DISTINCT ON`構文のサポートを追加 (#4584 by [Griffio][griffio])
-   [PostgreSQL Dialect] `SELECT`ステートメントにおけるPostgreSQLの`JSON`関数サポートを追加 (#4590 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `generate_series` PostgreSQL関数を追加 (#4717 by [Griffio][griffio])
-   [PostgreSQL Dialect] 追加のPostgres `String`関数定義を追加 (#4752 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `DATE` PostgreSQL型を`MIN`および`MAX`集約関数に追加 (#4816 by [André Danielsson][anddani])
-   [PostgreSQL Dialect] `SqlBinaryExpr`にPostgreSqlの temporal typesを追加 (#4657 by [Griifio][griffio])
-   [PostgreSQL Dialect] postgres dialectに`TRUNCATE`を追加 (#4817 by [Bastien de Luca][de-luca])
-   [SQLite 3.35 Dialect] `ON CONFLICT`句が複数ある場合、順序通りに評価するように許可 (#4551 by [Griffio][griffio])
-   [JDBC Driver] より快適なSQL編集のために`Language`アノテーションを追加 (#4602 by [Marius Volkhart][MariusV])
-   [Native Driver] Native-driver: `linuxArm64`のサポートを追加 (#4792 by [Philip Wedemann][hfhbd])
-   [Android Driver] `AndroidSqliteDriver`に`windowSizeBytes`パラメータを追加 (#4804 by [Benoit Lubek][BoD])
-   [Paging3 Extension] 機能: `OffsetQueryPagingSource`に`initialOffset`を追加 (#4802 by [Mohamad Jaara][MohamadJaara])

### 変更
-   [Compiler] 適切な場合にKotlin型を優先するよう変更 (#4517 by [Eliezer Graber][eygraber])
-   [Compiler] 値型を挿入する場合、常に列名を含めるように変更 (#4864)
-   [PostgreSQL Dialect] PostgreSQL dialectから実験的ステータスを削除 (#4443 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQLの型に関するドキュメントを更新 (#4569 by [Marius Volkhart][MariusV])
-   [R2DBC Driver] PostgreSQLで整数データ型を扱う際のパフォーマンスを最適化 (#4588 by [Marius Volkhart][MariusV])

### 削除
-   [SQLite Javascript Driver] `sqljs-driver`を削除 (#4613, #4670 by [Derek Ellis][dellisd])

### 修正
-   [Compiler] 戻り値があり、パラメータのないグループ化されたステートメントのコンパイルを修正 (#4699 by [Griffio][griffio])
-   [Compiler] `SqlBinaryExpr`で引数をバインドするように修正 (#4604 by [Griffio][griffio])
-   [IDE Plugin] 設定されている場合、IDEAプロジェクトJDKを使用するよう修正 (#4689 by [Griffio][griffio])
-   [IDE Plugin] IDEA 2023.2以降での「Unknown element type: TYPE_NAME」エラーを修正 (#4727)
-   [IDE Plugin] 2023.2とのいくつかの互換性問題を修正
-   [Gradle Plugin] `verifyMigrationTask` Gradleタスクのドキュメントを修正 (#4713 by [Josh Friend][joshfriend])
-   [Gradle Plugin] ユーザーがデータベースを検証する前にデータベースを生成するのに役立つGradleタスク出力メッセージを追加 (#4684 by [Jingwei][jingwei99])
-   [PostgreSQL Dialect] PostgreSQL列の複数回のリネームを修正 (#4566 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4714のPostgreSQL列のnull許容を修正 (#4831 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4837の`ALTER TABLE ALTER COLUMN`を修正 (#4846 by [Griffio][griffio])
-   [PostgreSQL Dialect] 4501のPostgreSql `SEQUENCE`を修正 (#4528 by [Griffio][griffio])
-   [SQLite Dialect] JSONバイナリ演算子が列式で使用できるように許可 (#4776 by [Eliezer Graber][eygraber])
-   [SQLite Dialect] 複数列が名前で見つかった場合の`UPDATE FROM`の誤検出を修正 (#4777 by [Eliezer Graber][eygraber])
-   [Native Driver] 名前付きインメモリデータベースをサポート (#4662 by [Matthew Nelson][05nelsonm])
-   [Native Driver] クエリリスナーコレクションのスレッドセーフティを保証 (#4567 by [Kevin Galligan][kpgalligan])
-   [JDBC Driver] `ConnectionManager`における接続リークを修正 (#4589 by [Marius Volkhart][MariusV])
-   [JDBC Driver] `ConnectionManager`の種類を選択する際の`JdbcSqliteDriver`のURL解析を修正 (#4656 by [Matthew Nelson][05nelsonm])

## [2.0.0] - 2023-07-26

### 追加
-   [MySQL Dialect] MySQL: `IF`式でのtimestamp/bigintのサポート (#4329 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] MySQL: `NOW`を追加 (#4431 by [Philip Wedemann][hfhbd])
-   [Web Driver] NPMパッケージの公開を有効化 (#4364)
-   [IDE Plugin] Gradleツール接続が失敗した場合に、スタックトレースを表示できるようにユーザーを許可 (#4383)

### 変更
-   [Sqlite Driver] `JdbcSqliteDriver`のスキーママイグレーションの使用を簡素化 (#3737 by [Lukáš Moravec][morki])
-   [R2DBC Driver] 真の非同期R2DBCカーソル (#4387 by [Philip Wedemann][hfhbd])

### 修正
-   [IDE Plugin] 必要になるまでデータベースプロジェクトサービスをインスタンス化しないように修正 (#4382)
-   [IDE Plugin] 使用箇所の検索中のプロセスキャンセルを処理 (#4340)
-   [IDE Plugin] IDEでの非同期コード生成を修正 (#4406)
-   [IDE Plugin] パッケージ構造のアセンブリをEDTから離れた一度計算されるように移動 (#4417)
-   [IDE Plugin] 2023.2のKotlin型解決で正しいスタブインデックスキーを使用するように修正 (#4416)
-   [IDE Plugin] 検索を実行する前にインデックスが準備できるのを待つように修正 (#4419)
-   [IDE Plugin] インデックスが利用できない場合に`goto`を実行しないように修正 (#4420)
-   [Compiler] グループ化されたステートメントの結果式を修正 (#4378)
-   [Compiler] 仮想テーブルをインターフェース型として使用しないように修正 (#4427 by [Philip Wedemann][hfhbd])

## [2.0.0-rc02] - 2023-06-27

### 追加
-   [MySQL Dialect] 小文字の日付型と日付型の最小/最大値のサポート (#4243 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] バイナリ式と`SUM`のMySQL型をサポート (#4254 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] 表示幅なしの符号なし整数をサポート (#4306 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] `LOCK IN SHARED MODE`をサポート
-   [PostgreSQL Dialect] `MIN`と`MAX`にbooleanとTimestampを追加 (#4245 by [Griffio][griffio])
-   [PostgreSQL Dialect] Postgres: ウィンドウ関数サポートを追加 (#4283 by [Philip Wedemann][hfhbd])
-   [Runtime] `runtime`に`linuxArm64`、`androidNative`、`watchosDeviceArm`ターゲットを追加 (#4258 by [Philip Wedemann][hfhbd])
-   [Paging Extension] ペイジング拡張に`linux`と`mingw x64`ターゲットを追加 (#4280 by [Cedric Hippmann][chippman])

### 変更
-   [Gradle Plugin] Android API 34の自動ダイアレクトサポートを追加 (#4251)
-   [Paging Extension] `QueryPagingSource`で`SuspendingTransacter`をサポート (#4292 by [Ilya Polenov][daio])
-   [Runtime] `addListener` APIを改善 (#4244 by [Philip Wedemann][hfhbd])
-   [Runtime] マイグレーションバージョンに`Long`を使用するように変更 (#4297 by [Philip Wedemann][hfhbd])

### 修正
-   [Gradle Plugin] 生成されたソースの安定した出力パスを使用するように修正 (#4269 by [Josh Friend][joshfriend])
-   [Gradle Plugin] Gradleの調整 (#4222 by [Matthew Haughton][3flex])

## [2.0.0-rc01] - 2023-05-29

### 追加
-   [Paging] ペイジング拡張に`js browser`ターゲットを追加 (#3843 by [Sean Proctor][sproctor])
-   [Paging] `androidx-paging3`拡張に`iosSimulatorArm64`ターゲットを追加 (#4117)
-   [PostgreSQL Dialect] `gen_random_uuid()`のサポートとテストを追加 (#3855 by [David Wheeler][davidwheeler123])
-   [PostgreSQL Dialect] `ALTER TABLE ADD CONSTRAINT` Postgresをサポート (#4116 by [Griffio][griffio])
-   [PostgreSQL Dialect] `ALTER TABLE ADD CONSTRAINT CHECK`をサポート (#4120 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの文字長関数を追加 (#4121 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの列デフォルトインターバルを追加 (#4142 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLのインターバル列結果を追加 (#4152 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQLの`ALTER COLUMN`を追加 (#4165 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQL: `date_part`を追加 (#4198 by [Philip Wedemann][hfhbd])
-   [MySQL Dialect] SQL文字長関数を追加 (#4134 by [Griffio][griffio])
-   [IDE Plugin] `sqldelight`ディレクトリの提案を追加 (#3976 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] プロジェクトツリーのミドルパッケージを圧縮 (#3992 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `JOIN`句の補完を追加 (#4086 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] ビュー作成インテンションとライブテンプレートを追加 (#4074 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `DELETE`または`UPDATE`内の`WHERE`句の欠落について警告 (#4058 by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] 型安全なプロジェクトアクセッサを有効化 (#4005 by [Philip Wedemann][hfhbd])

### 変更
-   [Gradle Plugin] `ServiceLoader`メカニズムによる`VerifyMigrationTask`への`DriverInitializer`の登録を許可 (#3986 by [Alex Doubov][C2H6O])
-   [Gradle Plugin] 明示的なコンパイラ環境を作成 (#4079 by [Philip Wedemann][hfhbd])
-   [JS Driver] Web Worker Driverを別のアーティファクトに分割
-   [JS Driver] `JsWorkerSqlCursor`を公開しないように修正 (#3874 by [Philip Wedemann][hfhbd])
-   [JS Driver] `sqljs`ドライバーの公開を無効化 (#4108)
-   [Runtime] 同期ドライバが同期スキーマ初期化子を必要とすることを強制 (#4013)
-   [Runtime] カーソルの非同期サポートを改善 (#4102)
-   [Runtime] 非推奨のターゲットを削除 (#4149 by [Philip Wedemann][hfhbd])
-   [Runtime] 古いMMのサポートを削除 (#4148 by [Philip Wedemann][hfhbd])

### 修正
-   [R2DBC Driver] R2DBC: ドライバーのクローズを待機するように修正 (#4139 by [Philip Wedemann][hfhbd])
-   [Compiler] マイグレーションからの`PRAGMA`を`database create(SqlDriver)`に含めるように修正 (#3845 by [Marius Volkhart][MariusV])
-   [Compiler] `RETURNING`句のコード生成を修正 (#3872 by [Marius Volkhart][MariusV])
-   [Compiler] 仮想テーブルの型を生成しないように修正 (#4015)
-   [Gradle Plugin] GradleプラグインのQoLを小規模改善 (#3930 by [Zac Sweers][zacsweers])
-   [IDE Plugin] 未解決のKotlin型を修正 (#3924 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] qualifierで機能するようにワイルドカード展開インテンションを修正 (#3979 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `java home`が欠落している場合、利用可能なjdkを使用するように修正 (#3925 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] パッケージ名に対する使用箇所の検索を修正 (#4010)
-   [IDE Plugin] 無効な要素に対して自動インポートを表示しないように修正 (#4008)
-   [IDE Plugin] dialectが欠落している場合、解決しないように修正 (#4009)
-   [IDE Plugin] 無効な状態でのIDEでのコンパイラ実行を無視 (#4016)
-   [IDE Plugin] IntelliJ 2023.1のサポートを追加 (#4037 by [Madis Pink][madisp])
-   [IDE Plugin] 列名のリネーム時に名前付き引数の使用をリネームするように修正 (#4027 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] マイグレーション追加ポップアップを修正 (#4105 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] マイグレーションファイルでの`SchemaNeedsMigrationInspection`を無効化 (#4106 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] マイグレーション生成で型名ではなくSQL列名を使用するように修正 (#4112 by [Alexander Perfilyev][aperfilyev])

## [2.0.0-alpha05] - 2023-01-20

### 追加
-   [Paging] マルチプラットフォームページング拡張 (by [Jeff Lockhart][jeffdgr8])
-   [Runtime] `Listener`インターフェースに`fun`修飾子を追加。
-   [SQLite Dialect] SQLite 3.33サポート (`UPDATE FROM`)を追加 (by [Eliezer Graber][eygraber])
-   [PostgreSQL Dialect] postgresqlで`UPDATE FROM`をサポート (by [Eliezer Graber][eygraber])

### 変更
-   [RDBC Driver] 接続を公開 (by [Philip Wedemann][hfhbd])
-   [Runtime] マイグレーションコールバックをメインの`migrate`関数に移動
-   [Gradle Plugin] ダウンストリームプロジェクトから設定を非表示に
-   [Gradle Plugin] Intellijのみをシェードするように変更 (by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] Kotlin 1.8.0-Betaをサポートし、マルチバージョンKotlinテストを追加 (by [Philip Wedemann][hfhbd])

### 修正
-   [RDBC Driver] `javaObjectType`を使用するように変更 (by [Philip Wedemann][hfhbd])
-   [RDBC Driver] `bindStatement`におけるプリミティブなNULL値を修正 (by [Philip Wedemann][hfhbd])
-   [RDBC Driver] R2DBC 1.0をサポート (by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] Postgres: 型パラメータなしの配列を修正 (by [Philip Wedemann][hfhbd])
-   [IDE Plugin] intellijを221.6008.13にバンプ (by [Philip Wedemann][hfhbd])
-   [Compiler] 純粋なビューからの再帰的な`origin table`を解決 (by [Philip Wedemann][hfhbd])
-   [Compiler] テーブルの外部キー句から値クラスを使用 (by [Philip Wedemann][hfhbd])
-   [Compiler] `SelectQueryGenerator`が括弧なしのバインド式をサポートするように修正 (by [Doogie Min][bellatoris])
-   [Compiler] トランザクション使用時に`${name}Indexes`変数の重複生成を修正 (by [Andreas Sacher][sachera])

## [1.5.5] - 2023-01-20

これはKotlin 1.8およびIntelliJ 2021+に対応した互換性リリースで、JDK 17をサポートします。

## [1.5.4] - 2022-10-06

これはKotlin 1.7.20およびAGP 7.3.0に対応した互換性アップデートです。

## [2.0.0-alpha04] - 2022-10-03

### 破壊的変更点

-   Paging 3拡張APIが変更され、`count`には`Int`型のみが許可されるようになりました。
-   コルーチン拡張で、デフォルトではなく`dispatcher`を渡すことが必須になりました。
-   DialectとDriverクラスは`final`になりました。代わりに委譲を使用してください。

### 追加
-   [HSQL Dialect] HSQL: `INSERT`での生成された列に`DEFAULT`を使用することをサポート (#3372 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQL: `INSERT`での生成された列に`DEFAULT`を使用することをサポート (#3373 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQLに`NOW()`を追加 (#3403 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQLに`NOT`演算子を追加 (#3504 by [Philip Wedemann][hfhbd])
-   [Paging] `*QueryPagingSource`に`CoroutineContext`を渡せるように許可 (#3384)
-   [Gradle Plugin] ダイアレクトのバージョンカタログサポートを改善 (#3435)
-   [Native Driver] `NativeSqliteDriver`の`DatabaseConfiguration`作成にフックするコールバックを追加 (#3512 by [Sven Jacobs][svenjacobs])

### 変更
-   [Paging] `KeyedQueryPagingSource`によってバックアップされる`QueryPagingSource`関数にデフォルト`dispatcher`を追加 (#3385)
-   [Paging] `OffsetQueryPagingSource`が`Int`でのみ動作するように変更 (#3386)
-   [Async Runtime] `await*`を上位クラス`ExecutableQuery`に移動 (#3524 by [Philip Wedemann][hfhbd])
-   [Coroutines Extensions] `flow`拡張のデフォルトパラメータを削除 (#3489)

### 修正
-   [Gradle Plugin] Kotlin 1.7.20にアップデート (#3542 by [Zac Sweers][zacsweers])
-   [R2DBC Driver] 常に値を送信しないR2DBC変更を採用 (#3525 by [Philip Wedemann][hfhbd])
-   [HSQL Dialect] HSQLでSQLite `VerifyMigrationTask`が失敗する問題を修正 (#3380 by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] タスクをレイジー設定APIを使用するように変換 (by [Matthew Haughton][3flex])
-   [Gradle Plugin] Kotlin 1.7.20での`NPE`を回避 (#3398 by [Zac Sweers][ZacSweers])
-   [Gradle Plugin] squash migrationsタスクの説明を修正 (#3449)
-   [IDE Plugin] 新しいKotlinプラグインでの`NoSuchFieldError`を修正 (#3422 by [Madis Pink][madisp])
-   [IDE Plugin] IDEA: `UnusedQueryInspection` - `ArrayIndexOutOfBoundsException`を修正 (#3427 by [Niklas Baudy][vanniktech])
-   [IDE Plugin] 古いKotlinプラグインの参照にリフレクションを使用
-   [Compiler] 拡張関数を持つカスタムダイアレクトがインポートを作成しない問題を修正 (#3338 by [Philip Wedemann][hfhbd])
-   [Compiler] `CodeBlock.of("${CodeBlock.toString()}")`のエスケープを修正 (#3340 by [Philip Wedemann][hfhbd])
-   [Compiler] 非同期`execute`ステートメントをマイグレーションで待機するように修正 (#3352)
-   [Compiler] `AS`を修正 (#3370 by [Philip Wedemann][hfhbd])
-   [Compiler] `getObject`メソッドが実際の型の自動埋め込みをサポートするように修正 (#3401 by [Rob X][robx])
-   [Compiler] 非同期グループ化`RETURNING`ステートメントのコード生成を修正 (#3411)
-   [Compiler] 可能であればバインドパラメータのKotlin型を推論し、そうでなければより良いエラーメッセージで失敗するように修正 (#3413 by [Philip Wedemann][hfhbd])
-   [Compiler] `ABS("foo")`を許可しないように修正 (#3430 by [Philip Wedemann][hfhbd])
-   [Compiler] 他のパラメータからのKotlin型推論をサポートするように修正 (#3431 by [Philip Wedemann][hfhbd])
-   [Compiler] 常にデータベースの実装を作成するように修正 (#3540 by [Philip Wedemann][hfhbd])
-   [Compiler] `javaDoc`を緩和し、カスタムマッパー関数にも追加するように修正 (#3554 [Philip Wedemann][hfhbd])
-   [Compiler] バインディングの`DEFAULT`を修正 (by [Philip Wedemann][hfhbd])
-   [Paging] Paging 3を修正 (#3396)
-   [Paging] `OffsetQueryPagingSource`を`Long`で構築できるように許可 (#3409)
-   [Paging] `Dispatchers.Main`を静的にスワップしないように修正 (#3428)

## [2.0.0-alpha03] - 2022-06-17

### 破壊的変更点

-   ダイアレクトは実際のGradle依存関係として参照されるようになりました。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
-   `AfterVersionWithDriver`型は削除され、常にドライバーを持つ`AfterVersion`が代わりに利用されるようになりました。
-   `Schema`型は`SqlDriver`のサブタイプではなくなりました。
-   `PreparedStatement` APIは、0ベースのインデックスで呼び出されるようになりました。

### 追加
-   [IDE Plugin] 実行中のデータベースに対してSQLite、MySQL、PostgreSQLコマンドを実行するサポートを追加 (#2718 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Android StudioのDBインスペクターのサポートを追加 (#3107 by [Alexander Perfilyev][aperfilyev])
-   [Runtime] 非同期ドライバーのサポートを追加 (#3168 by [Derek Ellis][dellisd])
-   [Native Driver] 新しいKotlin Nativeメモリモデルをサポート (#3177 by [Kevin Galligan][kpgalligan])
-   [JS Driver] `SqlJs`ワーカー用のドライバーを追加 (#3203 by [Derek Ellis][dellisd])
-   [Gradle Plugin] SQLDelightタスクのクラスパスを公開
-   [Gradle Plugin] マイグレーションをスカッシュするためのGradleタスクを追加
-   [Gradle Plugin] マイグレーションチェック中にスキーマ定義を無視するフラグを追加
-   [MySQL Dialect] MySQLでの`FOR SHARE`と`FOR UPDATE`をサポート (#3098)
-   [MySQL Dialect] MySQLのインデックスヒントをサポート (#3099)
-   [PostgreSQL Dialect] `date_trunc`を追加 (#3295 by [Philip Wedemann][hfhbd])
-   [JSON Extensions] JSONテーブル関数をサポート (#3090)

### 変更
-   [Runtime] ドライバーなしの`AfterVersion`型を削除 (#3091)
-   [Runtime] `Schema`型をトップレベルに移動
-   [Runtime] サードパーティの実装をサポートするためにダイアレクトとリゾルバーを公開 (#3232 by [Philip Wedemann][hfhbd])
-   [Compiler] コンパイルに使用されたダイアレクトを失敗レポートに含めるように変更 (#3086)
-   [Compiler] 未使用のアダプターをスキップ (#3162 by [Eliezer Graber][eygraber])
-   [Compiler] `PrepareStatement`で0ベースのインデックスを使用するように変更 (#3269 by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] ダイアレクトも文字列ではなく、適切なGradle依存関係にするように変更 (#3085)
-   [Gradle Plugin] Gradle Verify Task: データベースファイルがない場合にエラーをスローするように修正 (#3126 by [Niklas Baudy][vanniktech])

### 修正
-   [Gradle Plugin] Gradleプラグインの軽微なクリーンアップと調整 (#3171 by [Matthew Haughton][3flex])
-   [Gradle Plugin] 生成されたディレクトリにAGP文字列を使用しないように変更
-   [Gradle Plugin] AGPの`namespace`属性を使用するように修正 (#3220)
-   [Gradle Plugin] `kotlin-stdlib`をGradleプラグインのランタイム依存関係として追加しないように修正 (#3245 by [Martin Bonnin][mbonnin])
-   [Gradle Plugin] マルチプラットフォーム設定を簡素化 (#3246 by [Martin Bonnin][mbonnin])
-   [Gradle Plugin] JSのみのプロジェクトをサポート (#3310 by [Philip Wedemann][hfhbd])
-   [IDE Plugin] GradleツーリングAPIに`java home`を使用するように修正 (#3078)
-   [IDE Plugin] JDBCドライバーをIDEプラグイン内で正しい`classLoader`にロードするように修正 (#3080)
-   [IDE Plugin] 既存のPSI変更中にエラーを避けるため、無効化する前にファイル要素を`null`としてマークするように修正 (#3082)
-   [IDE Plugin] `ALTER TABLE`ステートメントで新しいテーブル名の使用箇所を検索する際にクラッシュしないように修正 (#3106)
-   [IDE Plugin] インスペクターを最適化し、予期される例外タイプに対してサイレントに失敗できるように有効化 (#3121)
-   [IDE Plugin] 生成されたディレクトリであるべきファイルを削除するように修正 (#3198)
-   [IDE Plugin] 不安全な演算子の呼び出しを修正
-   [Compiler] `RETURNING`ステートメントを持つ更新と削除がクエリを実行するように保証 (#3084)
-   [Compiler] 複合`SELECT`での引数型を正しく推論するように修正 (#3096)
-   [Compiler] 共通テーブルはデータクラスを生成しないため、それらを返さないように修正 (#3097)
-   [Compiler] 最上位のマイグレーションファイルをより速く見つけるように修正 (#3108)
-   [Compiler] パイプ演算子でnull許容を適切に継承
-   [Compiler] `iif` ANSI SQL関数をサポート
-   [Compiler] 空のクエリファイルを生成しないように修正 (#3300 by [Philip Wedemann][hfhbd])
-   [Compiler] 疑問符のみのアダプターを修正 (#3314 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] Postgresの主キー列は常に`non-null`になるように修正 (#3092)
-   [PostgreSQL Dialect] 複数のテーブルで同じ名前のコピーを修正 (#3297 by [Philip Wedemann][hfhbd])
-   [SQLite 3.35 Dialect] `ALTER TABLE`からインデックス付き列を削除する際にのみエラーを表示するように修正 (#3158 by [Eliezer Graber][eygraber])

## [2.0.0-alpha02] - 2022-04-13

### 破壊的変更点

-   `app.cash.sqldelight.runtime.rx`のすべての出現箇所を`app.cash.sqldelight.rx2`に置き換える必要があります。

### 追加
-   [Compiler] グループ化されたステートメントの最後に`returning`をサポート
-   [Compiler] ダイアレクトモジュールによるコンパイラ拡張をサポートし、SQLite JSON拡張を追加 (#1379, #2087)
-   [Compiler] 値を返す`PRAGMA`ステートメントをサポート (#1106)
-   [Compiler] マークされた列の値型生成をサポート
-   [Compiler] 楽観的ロックとバリデーションのサポートを追加 (#1952)
-   [Compiler] マルチ更新ステートメントをサポート
-   [PostgreSQL] Postgresの`returning`ステートメントをサポート
-   [PostgreSQL] Postgresの日付型をサポート
-   [PostgreSQL] PGのインターバルをサポート
-   [PostgreSQL] PGの`BOOLEAN`型をサポートし、`ALTER TABLE`での`INSERT`を修正
-   [PostgreSQL] Postgresでのオプションの`LIMIT`をサポート
-   [PostgreSQL] PGの`BYTEA`型をサポート
-   [PostgreSQL] Postgres `SERIAL`型のテストを追加
-   [PostgreSQL] `FOR UPDATE` Postgres構文をサポート
-   [PostgreSQL] PostgreSQLの配列型をサポート
-   [PostgreSQL] UUID型をPGに適切に保存/取得
-   [PostgreSQL] PostgreSQLの`NUMERIC`型をサポート (#1882)
-   [PostgreSQL] 共通テーブル式内の`returning`クエリをサポート (#2471)
-   [PostgreSQL] `json`固有の演算子をサポート
-   [PostgreSQL] Postgres `Copy`を追加 (by [Philip Wedemann][hfhbd])
-   [MySQL] MySQL `REPLACE`をサポート
-   [MySQL] `NUMERIC`/`BigDecimal` MySQL型をサポート (#2051)
-   [MySQL] MySQLの`TRUNCATE`ステートメントをサポート
-   [MySQL] Mysqlの`json`固有の演算子をサポート (by [Eliezer Graber][eygraber])
-   [MySQL] MySqlの`INTERVAL`をサポート (#2969 by [Eliezer Graber][eygraber])
-   [HSQL] HSQL `Window`機能を追加
-   [SQLite] `WHERE`句でnull許容パラメータの等価チェックを置き換えないように修正 (#1490 by [Eliezer Graber][eygraber])
-   [SQLite] Sqlite 3.35の`returning`ステートメントをサポート (#1490 by [Eliezer Graber][eygraber])
-   [SQLite] `GENERATED`句をサポート
-   [SQLite] Sqlite 3.38 dialectのサポートを追加 (by [Eliezer Graber][eygraber])

### 変更
-   [Compiler] 生成されたコードを少しクリーンアップ
-   [Compiler] グループ化されたステートメントでのテーブルパラメータの使用を禁止 (#1822)
-   [Compiler] グループ化されたクエリをトランザクション内に入れるように変更 (#2785)
-   [Runtime] ドライバの`execute`メソッドから更新された行数を返すように変更
-   [Runtime] `SqlCursor`を接続にアクセスするクリティカルセクションに限定するように変更 (#2123 by [Anders Ha][andersio])
-   [Gradle Plugin] マイグレーションのスキーマ定義を比較するように変更 (#841)
-   [PostgreSQL] PGでの二重引用符を禁止するように変更
-   [MySQL] MySQLでの`==`の使用時にエラーを出すように変更 (#2673)

### 修正
-   [Compiler] 2.0 alphaで異なるテーブルからの同じアダプター型がコンパイルエラーを引き起こす問題を修正
-   [Compiler] upsertステートメントのコンパイル問題 (#2791)
-   [Compiler] 複数の一致がある場合、クエリ結果が`SELECT`内のテーブルを使用するように修正 (#1874, #2313)
-   [Compiler] `INSTEAD OF`トリガーを持つビューの更新をサポート (#1018)
-   [Compiler] 関数名における`from`と`for`のサポート
-   [Compiler] 関数式における`SEPARATOR`キーワードを許可
-   [Compiler] `ORDER BY`句でエイリアス化されたテーブルの`ROWID`にアクセスできない問題を修正
-   [Compiler] MySQLの`HAVING`句でエイリアス化された列名が認識されない問題を修正
-   [Compiler] 誤った「Multiple columns found」エラーを修正
-   [Compiler] `PRAGMA locking_mode = EXCLUSIVE`を設定できない問題を修正
-   [PostgreSQL] Postgresqlの列名変更を修正
-   [MySQL] `UNIX_TIMESTAMP`、`TO_SECONDS`、`JSON_ARRAYAGG` MySQL関数が認識されない問題を修正
-   [SQLite] SQLiteウィンドウ機能を修正
-   [IDE Plugin] 空のプログレスインジケータでgotoハンドラを実行するように修正 (#2990)
-   [IDE Plugin] プロジェクトが設定されていない場合、ハイライトビジターが実行されないように保証 (#2981, #2976)
-   [IDE Plugin] IDEで推移的に生成されたコードも更新されるように保証 (#1837)
-   [IDE Plugin] ダイアレクト更新時にインデックスを無効化

## [2.0.0-alpha01] - 2022-03-31

これは2.0の最初のアルファリリースであり、いくつかの破壊的変更が含まれています。今後もABIの破壊的変更が予想されるため、このリリースに依存するライブラリは公開しないでください（アプリケーションは問題ありません）。

### 破壊的変更点

-   まず、`com.squareup.sqldelight`のすべての出現箇所を`app.cash.sqldelight`に置き換える必要があります。
-   第二に、`app.cash.sqldelight.android`のすべての出現箇所を`app.cash.sqldelight.driver.android`に置き換える必要があります。
-   第三に、`app.cash.sqldelight.sqlite.driver`のすべての出現箇所を`app.cash.sqldelight.driver.jdbc.sqlite`に置き換える必要があります。
-   第四に、`app.cash.sqldelight.drivers.native`のすべての出現箇所を`app.cash.sqldelight.driver.native`に置き換える必要があります。
-   IDEプラグインは、[アルファまたはEAPチャンネル](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)で利用可能な2.Xバージョンに更新する必要があります。
-   ダイアレクトは、Gradle内で指定できる依存関係になりました:

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

現在サポートされているダイアレクトは、`mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect`です。

-   プリミティブ型はインポートが必要になりました（例：`INTEGER AS Boolean`は`import kotlin.Boolean`が必要）。以前サポートされていた型の中にはアダプターが必要なものもあります。ほとんどの変換（`IntColumnAdapter`のような変換）に対応するプリミティブアダプターは、`app.cash.sqldelight:primitive-adapters:2.0.0-alpha01`で利用可能です。

### 追加
-   [IDE Plugin] 基本的な推奨マイグレーションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インポートヒントアクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Kotlinクラス補完を追加 (by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] Gradle型安全なプロジェクトアクセッサのショートカットを追加 (by [Philip Wedemann][hfhbd])
-   [Compiler] ダイアレクトに基づいてコード生成をカスタマイズ (by [Marius Volkhart][MariusV])
-   [JDBC Driver] `JdbcDriver`に共通型を追加 (by [Marius Volkhart][MariusV])
-   [SQLite] SQLite 3.35のサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] `ALTER TABLE DROP COLUMN`のサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] Sqlite 3.30 dialectのサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] SQLiteでの`NULLS FIRST`/`LAST`をサポート (by [Eliezer Graber][eygraber])
-   [HSQL] HSQLの`GENERATED`句のサポートを追加 (by [Marius Volkhart][MariusV])
-   [HSQL] HSQLでの名前付きパラメータのサポートを追加 (by [Marius Volkhart][MariusV])
-   [HSQL] HSQLの`INSERT`クエリをカスタマイズ (by [Marius Volkhart][MariusV])

### 変更
-   [Everything] パッケージ名が`com.squareup.sqldelight`から`app.cash.sqldelight`に変更されました。
-   [Runtime] ダイアレクトを独自の隔離されたGradleモジュールに移動
-   [Runtime] ドライバーによって実装されるクエリ通知に切り替え。
-   [Runtime] デフォルトの列アダプターを別のモジュールに抽出 (#2056, #2060)
-   [Compiler] モジュールがクエリ実装を生成するようにし、各モジュールで再実行しないように変更
-   [Compiler] 生成されたデータクラスのカスタム`toString`生成を削除 (by [Paul Woitaschek][PaulWoitaschek])
-   [JS Driver] `sql.js`の依存関係を`sqljs-driver`から削除 (by [Derek Ellis][dellisd])
-   [Paging] Android Paging 2拡張を削除
-   [IDE Plugin] SQLDelightの同期中にエディタバナーを表示するように変更 (#2511)
-   [IDE Plugin] サポートされるIntelliJの最小バージョンは2021.1になりました。

### 修正
-   [Runtime] リスナリストをフラット化し、割り当てとポインタチェイスを削減 (by [Anders Ha][andersio])
-   [IDE Plugin] エラーメッセージを修正し、エラー箇所にジャンプできるように修正 (by [Philip Wedemann][hfhbd])
-   [IDE Plugin] 欠落しているインスペクションの説明を追加 (#2768 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `GotoDeclarationHandler`での例外を修正 (#2531, #2688, #2804 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `import`キーワードをハイライト表示 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未解決のKotlin型を修正 (#1678 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未解決のパッケージのハイライトを修正 (#2543 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] プロジェクトインデックスがまだ初期化されていない場合、不一致の列の検査を試みないように修正
-   [IDE Plugin] Gradle同期が発生するまでファイルインデックスを初期化しないように修正
-   [IDE Plugin] Gradle同期が開始された場合、SQLDelightのインポートをキャンセルするように修正
-   [IDE Plugin] 元に戻すアクションが実行されたスレッドの外でデータベースを再生成するように修正
-   [IDE Plugin] 参照が解決できない場合、空のJava型を使用するように修正
-   [IDE Plugin] ファイル解析中にメインスレッドから適切に移動し、書き込み時のみメインスレッドに戻るように修正
-   [IDE Plugin] 古いIntelliJバージョンとの互換性を改善 (by [Matthew Haughton][3flex])
-   [IDE Plugin] 高速なアノテーションAPIを使用
-   [Gradle Plugin] ランタイム追加時に`js`/`android`プラグインを明示的にサポート (by [Zac Sweers][ZacSweers])
-   [Gradle Plugin] マイグレーションからスキーマを導出せずにマイグレーション出力タスクを登録するように修正 (#2744 by [Kevin Cianfarini][kevincianfarini])
-   [Gradle Plugin] マイグレーションタスクがクラッシュした場合、クラッシュしたファイルをログに出力するように修正
-   [Gradle Plugin] コード生成時にファイルをソートし、出力が冪等であることを保証 (by [Zac Sweers][ZacSweers])
-   [Compiler] ファイルを反復処理するための高速なAPIを使用し、PSIグラフ全体を探索しないように修正
-   [Compiler] `SELECT`関数パラメータにキーワードマングリングを追加 (#2759 by [Alexander Perfilyev][aperfilyev])
-   [Compiler] マイグレーションアダプターの`packageName`を修正 (by [Philip Wedemann][hfhbd])
-   [Compiler] 型ではなくプロパティにアノテーションを出力するように修正 (#2798 by [Alexander Perfilyev][aperfilyev])
-   [Compiler] `Query`サブタイプに渡す前に引数をソートするように修正 (#2379 by [Alexander Perfilyev][aperfilyev])

## [1.5.3] - 2021-11-23

### 追加
-   [JDBC Driver] サードパーティドライバー実装のために`JdbcDriver`を公開 (#2672 by [Philip Wedemann][hfhbd])
-   [MySQL Dialect] 時間増分用の不足している関数を追加 (#2671 by [Sam Doward][sdoward])
-   [Coroutines Extension] コルーチン拡張にM1ターゲットを追加 (by [Philip Dukhov][PhilipDukhov])

### 変更
-   [Paging3 Extension] `sqldelight-android-paging3`をAARではなくJARとして配布するように変更 (#2634 by [Marco Romano][julioromano])
-   ソフトキーワードでもあるプロパティ名にはアンダースコアがサフィックスとして追加されるようになりました。例えば、`value`は`value_`として公開されます。

### 修正
-   [Compiler] 重複する配列パラメータの変数を抽出しないように修正 (by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] `kotlin.mpp.enableCompatibilityMetadataVariant`を追加 (#2628 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] 使用箇所の検索処理には読み取りアクションが必要

## [1.5.2] - 2021-10-12

### 追加
-   [Gradle Plugin] HMPPサポート (#2548 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] `NULL`比較インスペクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インスペクションサプレッサーを追加 (#2519 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 混合された名前付き/位置パラメータインスペクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [SQLite Driver] `mingwX86`ターゲットを追加 (#2558 by [Nikita Kozhemyakin][enginegl])
-   [SQLite Driver] M1ターゲットを追加
-   [SQLite Driver] `linuxX64`サポートを追加 (#2456 by [Cedric Hippmann][chippmann])
-   [MySQL Dialect] MySQLに`ROW_COUNT`関数を追加 (#2523)
-   [PostgreSQL Dialect] Postgresの列名変更、列削除をサポート (by [Juan Liska][pabl0rg])
-   [PostgreSQL Dialect] PostgreSQLの文法が`CITEXT`を認識しない問題を修正
-   [PostgreSQL Dialect] `TIMESTAMP WITH TIME ZONE`と`TIMESTAMPTZ`を含める
-   [PostgreSQL Dialect] PostgreSQL `GENERATED`列の文法を追加
-   [Runtime] `SqlDriver`を`AfterVersion`のパラメータとして提供 (#2534, 2614 by [Ahmed El-Helw][ahmedre])

### 変更
-   [Gradle Plugin] Gradle 7.0を明示的に要求 (#2572 by [Martin Bonnin][martinbonnin])
-   [Gradle Plugin] `VerifyMigrationTask`がGradleの最新チェックをサポートするように変更 (#2533 by [Matthew Haughton][3flex])
-   [IDE Plugin] null許容型と非null許容型を結合する際に、「Join compares two columns of different types」という警告を出さないように修正 (#2550 by [Piotr Chmielowski][pchmielowski])
-   [IDE Plugin] 列型の小文字の「as」に対するエラーメッセージを明確化 (by [Alexander Perfilyev][aperfilyev])

### 修正
-   [IDE Plugin] プロジェクトがすでに破棄されている場合、新しいダイアレクトで再解析しないように修正 (#2609)
-   [IDE Plugin] 関連する仮想ファイルがnullの場合、モジュールもnullとなるように修正 (#2607)
-   [IDE Plugin] 未使用クエリの検査中にクラッシュしないように回避 (#2610)
-   [IDE Plugin] データベース同期書き込みを書き込みアクション内で実行するように修正 (#2605)
-   [IDE Plugin] IDEがSQLDelightの同期をスケジュールするように変更
-   [IDE Plugin] `JavaTypeMixin`の`npe`を修正 (#2603 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `MismatchJoinColumnInspection`の`IndexOutOfBoundsException`を修正 (#2602 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `UnusedColumnInspection`の説明を追加 (#2600 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `PsiElement.generatedVirtualFiles`を読み取りアクションでラップするように修正 (#2599 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 不要な`nonnull`キャストを削除 (#2596)
-   [IDE Plugin] 使用箇所の検索で`null`を適切に処理するように修正 (#2595)
-   [IDE Plugin] Android向けの生成されたファイルのIDE自動補完を修正 (#2573 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] `SqlDelightGotoDeclarationHandler`の`npe`を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `INSERT`ステートメント内の引数でKotlinキーワードをマングリングするように修正 (#2433 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `SqlDelightFoldingBuilder`の`npe`を修正 (#2382 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `CopyPasteProcessor`での`ClassCastException`をキャッチするように修正 (#2369 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] ライブテンプレートの更新を修正 (by [Ilias Redissi][IliasRedissi])
-   [IDE Plugin] インテンションアクションに説明を追加 (#2489 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] テーブルが見つからない場合の`CreateTriggerMixin`での例外を修正 (by [Alexander Perfilyev][aperfilyev])
-   [Compiler] テーブル作成ステートメントをトポロジカルにソート
-   [Compiler] ディレクトリに対する`forDatabaseFiles`コールバックの呼び出しを停止 (#2532)
-   [Gradle Plugin] `generateDatabaseInterface`タスクの依存関係を潜在的なコンシューマに伝播 (#2518 by [Martin Bonnin][martinbonnin])

## [1.5.1] - 2021-07-16

### 追加
-   [PostgreSQL Dialect] PostgreSQL `JSONB`と`ON CONFLICT DO NOTHING`をサポート (by [Andrew Stewart][satook])
-   [PostgreSQL Dialect] PostgreSQL `ON CONFLICT (column, ...) DO UPDATE`のサポートを追加 (by [Andrew Stewart][satook])
-   [MySQL Dialect] MySQLの生成された列をサポート (by [Jeff Gulbronson][JeffG])
-   [Native Driver] `watchosX64`サポートを追加
-   [IDE Plugin] パラメータ型とアノテーションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 「select all」クエリ生成アクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 自動補完に列型を表示 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 自動補完にアイコンを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 主キーによる「select by primary key」クエリ生成アクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 「insert into」クエリ生成アクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 列名、ステートメント識別子、関数名のハイライトを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 残りのクエリ生成アクションを追加 (#489 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `insert-stmt`からの