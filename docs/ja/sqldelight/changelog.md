# 変更履歴

## 未リリース

### 追加
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
-   `Dialect`と`Driver`クラスは`final`になりました。代わりに委譲を使用してください。

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
-   [IDE Plugin] `insert-stmt`からのパラメータヒントを表示 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] テーブルエイリアスインテンションアクションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 列名修飾インテンションを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Kotlinプロパティへの宣言に移動 (by [Alexander Perfilyev][aperfilyev])

### 変更
-   [Native Driver] 可能な限りフリーズや共有可能データ構造を避け、ネイティブトランザクションのパフォーマンスを改善 (by [Anders Ha][andersio])
-   [Paging 3] Paging3バージョンを3.0.0 stableにバンプ
-   [JS Driver] `sql.js`を1.5.0にアップグレード

### 修正
-   [JDBC SQLite Driver] `ThreadLocal`をクリアする前に接続に対して`close()`を呼び出すように修正 (#2444 by [Hannes Struß][hannesstruss])
-   [RX extensions] サブスクリプション/解放の競合によるリークを修正 (#2403 by [Pierre Yves Ricau][pyricau])
-   [Coroutines extension] 通知前にクエリリスナーを登録することを保証
-   [Compiler] `notifyQueries`をソートし、一貫したKotlin出力ファイルになるように修正 (by [Jiayu Chen][thomascjy])
-   [Compiler] `SELECT`クエリクラスプロパティに`@JvmField`アノテーションを付けないように修正 (by [Eliezer Graber][eygraber])
-   [IDE Plugin] インポートオプティマイザを修正 (#2350 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用列の検査を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インポート検査とクラスアノテーターにネストされたクラスのサポートを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `CopyPasteProcessor`の`npe`を修正 (#2363 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `InlayParameterHintsProvider`のクラッシュを修正 (#2359 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `CREATE TABLE`ステートメントに任意のテキストをコピー&ペーストする際に空白行が挿入される問題を修正 (#2431 by [Alexander Perfilyev][aperfilyev])

## [1.5.0] - 2021-04-23
### 追加
-   [SQLite Javascript Driver] `sqljs-driver`の公開を有効化 (#1667 by [Derek Ellis][dellisd])
-   [Paging3 Extension] Android Paging 3ライブラリの拡張 (#1786 by [Kevin Cianfarini][kevincianfarini])

## [1.5.0] - 2021-04-23
### 追加
-   [SQLite Javascript Driver] `sqljs-driver`の公開を有効化 (#1667 by [Derek Ellis][dellisd])
-   [Paging3 Extension] Android Paging 3ライブラリの拡張 (#1786 by [Kevin Cianfarini][kevincianfarini])
-   [MySQL Dialect] MySQLの`ON DUPLICATE KEY UPDATE`競合解決のサポートを追加 (by [Ryan Harter][rharter])
-   [SQLite Dialect] SQLite `offsets()`のコンパイラサポートを追加 (by [Quinton Roberts][qjroberts])
-   [IDE Plugin] 未知の型に対するインポートのクイックフィックスを追加 (#683 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用インポート検査を追加 (#1161 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用クエリ検査を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用列検査を追加 (#569 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] コピー/ペースト時にインポートを自動的に取り込むように変更 (#684 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Gradle/IntelliJプラグインのバージョン間に非互換性がある場合にバルーンを表示
-   [IDE Plugin] `INSERT INTO ... VALUES(?)`パラメータヒントを追加 (#506 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インラインパラメータヒントを追加 (by [Alexander Perfilyev][aperfilyev])
-   [Runtime] コールバック付きでマイグレーションを実行するためのAPIをランタイムに含める (#1844)

### 変更
-   [Compiler] `IS NOT NULL`クエリをスマートキャストするよう変更 (#867)
-   [Compiler] 実行時に失敗するキーワードから保護するよう変更 (#1471, #1629)
-   [Gradle Plugin] Gradleプラグインのサイズを60MBから13MBに削減。
-   [Gradle Plugin] Androidバリアントを適切にサポートし、KMMターゲット固有のSQLのサポートを削除 (#1039)
-   [Gradle Plugin] `minSdk`に基づいて最小SQLiteバージョンを選択するように変更 (#1684)
-   [Native Driver] ネイティブドライバーの接続プールとパフォーマンスを更新

### 修正
-   [Compiler] ラムダ前の`NBSP`を修正 (by [Benoît Quenaudon][oldergod])
-   [Compiler] 生成された`bind*`および`cursor.get*`ステートメントにおける互換性のない型を修正
-   [Compiler] SQL句が適応された型を保持するように修正 (#2067)
-   [Compiler] `NULL`キーワードのみの列はnull許容であるべき
-   [Compiler] 型アノテーションを持つマッパーラムダを生成しないように修正 (#1957)
-   [Compiler] カスタムクエリが競合する場合、ファイル名を追加のパッケージサフィックスとして使用するように修正 (#1057, #1278)
-   [Compiler] 外部キーのCASCADEがクエリリスナーに通知するように保証 (#1325, #1485)
-   [Compiler] 同じ型の2つをUNIONする場合、テーブル型を返すように修正 (#1342)
-   [Compiler] `ifnull`と`coalesce`のパラメータがnull許容であることを保証 (#1263)
-   [Compiler] クエリによって課せられたnull許容を式に正しく使用
-   [MySQL Dialect] MySQL `IF`ステートメントをサポート
-   [PostgreSQL Dialect] PostgreSQLで`NUMERIC`と`DECIMAL`を`Double`として取得するように修正 (#2118)
-   [SQLite Dialect] `UPSERT`通知が`BEFORE`/`AFTER UPDATE`トリガーを考慮するように修正 (#2198 by [Anders Ha][andersio])
-   [SQLite Driver] インメモリでない限り、`SqliteDriver`内のスレッドに複数の接続を使用するように修正 (#1832)
-   [JDBC Driver] JDBC Driverが`autoCommit`を`true`と仮定する問題を修正 (#2041)
-   [JDBC Driver] 例外発生時に接続を閉じることを保証 (#2306)
-   [IDE Plugin] Windowsでのパス区切り文字のバグによる`GoToDeclaration`/`FindUsages`の破損を修正 (#2054 by [Angus Holder][AngusH])
-   [IDE Plugin] Gradleエラーを無視し、IDEでクラッシュしないように修正。
-   [IDE Plugin] `sqldelight`ファイルが`non-sqldelight`モジュールに移動された場合、コード生成を試みないように修正
-   [IDE Plugin] IDEでコード生成エラーを無視
-   [IDE Plugin] 負のサブストリングを試みないように保証 (#2068)
-   [IDE Plugin] Gradleアクション実行前にプロジェクトが破棄されていないことを保証 (#2155)
-   [IDE Plugin] null許容型に対する算術演算もnull許容であるべき
-   [IDE Plugin] 「expand * intention」が追加のプロジェクションで機能するように修正 (#2173 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] GoTo中にKotlinの解決が失敗した場合、`sqldelight`ファイルに移動しようとしないように修正
-   [IDE Plugin] SQLDelightがインデックス作成中にIntelliJが例外に遭遇した場合、クラッシュしないように修正
-   [IDE Plugin] IDEでコード生成前のエラー検出中に発生する例外を処理
-   [IDE Plugin] IDEプラグインがダイナミックプラグインと互換性があるように修正 (#1536)
-   [Gradle Plugin] `WorkerApi`を使用したデータベース生成の競合状態を修正 (#2062 by [Stéphane Nicolas][stephanenicolas])
-   [Gradle Plugin] `classLoaderIsolation`がカスタム`jdbc`の使用を妨げる問題を修正 (#2048 by [Ben Asher][BenA])
-   [Gradle Plugin] 欠落している`packageName`のエラーメッセージを改善 (by [Niklas Baudy][vanniktech])
-   [Gradle Plugin] SQLDelightがIntelliJの依存関係を`buildscript classpath`に漏洩させる問題を修正 (#1998)
-   [Gradle Plugin] Gradleビルドキャッシュを修正 (#2075)
-   [Gradle Plugin] Gradleプラグインで`kotlin-native-utils`に依存しないように修正 (by [Ilya Matveev][ilmat192])
-   [Gradle Plugin] マイグレーションファイルのみの場合もデータベースを書き込むように修正 (#2094)
-   [Gradle Plugin] 最終コンパイルユニットでダイヤモンド依存関係が一度だけピックアップされるように保証 (#1455)

また、今回のリリースでSQLDelightのインフラストラクチャを大幅に改善してくれた[Matthew Haughton][3flex]氏に感謝します。

## [1.4.4] - 2020-10-08
### 追加
-   [PostgreSQL Dialect] `WITH`句でのデータ変更ステートメントをサポート
-   [PostgreSQL Dialect] `substring`関数をサポート
-   [Gradle Plugin] SQLDelightのコンパイル中にマイグレーションを検証するための`verifyMigrations`フラグを追加 (#1872)

### 変更
-   [Compiler] 非SQLiteダイアレクトでSQLite固有の関数を不明としてフラグ付け
-   [Gradle Plugin] `sqldelight`プラグインが適用されているがデータベースが設定されていない場合に警告を表示 (#1421)

### 修正
-   [Compiler] `ORDER BY`句で列名をバインドする際にエラーを報告するように修正 (#1187 by [Eliezer Graber][eygraber])
-   [Compiler] `db interface`の生成時にレジストリ警告が表示される問題を修正 (#1792)
-   [Compiler] `CASE`ステートメントの不正確な型推論を修正 (#1811)
-   [Compiler] バージョンなしのマイグレーションファイルに対してより良いエラーメッセージを提供するように修正 (#2006)
-   [Compiler] `ColumnAdapter`の`marshal`に必要なデータベース型が一部不正確な問題を修正 (#2012)
-   [Compiler] `CAST`のnull許容を修正 (#1261)
-   [Compiler] クエリラッパーで多数の名前シャドウ警告が出る問題を修正 (#1946 by [Eliezer Graber][eygraber])
-   [Compiler] 生成されたコードが完全修飾名を使用している問題を修正 (#1939)
-   [IDE Plugin] Gradle同期からSQLDelightコード生成をトリガーするように修正
-   [IDE Plugin] `.sq`ファイル変更時にプラグインがデータベースインターフェースを再生成しない問題を修正 (#1945)
-   [IDE Plugin] ファイルを新しいパッケージに移動する際の問題 (#444)
-   [IDE Plugin] カーソルを移動する場所がない場合、クラッシュする代わりに何もしないように修正 (#1994)
-   [IDE Plugin] Gradleプロジェクト外のファイルには空のパッケージ名を使用するように修正 (#1973)
-   [IDE Plugin] 無効な型に対して適切に失敗するように修正 (#1943)
-   [IDE Plugin] 未知の式に遭遇した場合、より良いエラーメッセージをスローするように修正 (#1958)
-   [Gradle Plugin] SQLDelightがIntelliJの依存関係を`buildscript classpath`に漏洩させる問題を修正 (#1998)
-   [Gradle Plugin] `*.sq`ファイルにメソッドドキュメントを追加すると「JavadocIntegrationKt not found」コンパイルエラーが発生する問題を修正 (#1982)
-   [Gradle Plugin] SQLDelight GradleプラグインがConfiguration Caching (CoCa)をサポートしない問題を修正 (#1947 by [Stéphane Nicolas][stephanenicolas])
-   [SQLite JDBC Driver] `SQLException: database in auto-commit mode`を修正 (#1832)
-   [Coroutines Extension] コルーチン拡張のIRバックエンドを修正 (#1918 by [Derek Ellis][dellisd])

## [1.4.3] - 2020-09-04
### 追加
-   [MySQL Dialect] MySQLの`last_insert_id`関数のサポートを追加 (by [Kelvin Law][lawkai])
-   [PostgreSQL Dialect] `SERIAL`データ型をサポート (by [Veyndan Stuart][VeyndanS] & [Felipe Lima][felipecsl])
-   [PostgreSQL Dialect] PostgreSQLの`RETURNING`をサポート (by [Veyndan Stuart][VeyndanS])

### 修正
-   [MySQL Dialect] MySQLの`AUTO_INCREMENT`をデフォルト値を持つものとして扱うように修正 (#1823)
-   [Compiler] `UPSERT`ステートメントのコンパイラエラーを修正 (#1809 by [Eliezer Graber][eygraber])
-   [Compiler] 無効なKotlinが生成される問題を修正 (#1925 by [Eliezer Graber][eygraber])
-   [Compiler] 未知の関数に対してより良いエラーメッセージを提供するように修正 (#1843)
-   [Compiler] `instr`の2番目のパラメータの型として`string`を公開
-   [IDE Plugin] デーモンの肥大化とIDEプラグインのUIスレッドの停止を修正 (#1916)
-   [IDE Plugin] `null`モジュールのシナリオを処理 (#1902)
-   [IDE Plugin] 未設定の`sq`ファイルでパッケージ名に空文字列を返すように修正 (#1920)
-   [IDE Plugin] グループ化されたステートメントを修正し、統合テストを追加 (#1820)
-   [IDE Plugin] 要素のモジュールを見つけるために組み込みの`ModuleUtil`を使用 (#1854)
-   [IDE Plugin] 有効な要素のみをルックアップに追加 (#1909)
-   [IDE Plugin] `Parent`は`null`になる可能性あり (#1857)

## [1.4.2] - 2020-08-27
### 追加
-   [Runtime] 新しいJS IRバックエンドをサポート
-   [Gradle Plugin] `generateSqlDelightInterface` Gradleタスクを追加 (by [Niklas Baudy][vanniktech])
-   [Gradle Plugin] `verifySqlDelightMigration` Gradleタスクを追加 (by [Niklas Baudy][vanniktech])

### 修正
-   [IDE Plugin] GradleツーリングAPIを使用してIDEとGradle間のデータ共有を促進
-   [IDE Plugin] スキーマ導出のデフォルトを`false`に設定
-   [IDE Plugin] `commonMain`ソースセットを適切に取得
-   [MySQL Dialect] `mySqlFunctionType()`に`minute`を追加 (by [MaaxGr][maaxgr])

## [1.4.1] - 2020-08-21
### 追加
-   [Runtime] Kotlin 1.4.0をサポート (#1859)

### 変更
-   [Gradle Plugin] AGP依存関係を`compileOnly`にするよう変更 (#1362)

### 修正
-   [Compiler] 列定義ルールとテーブルインターフェースジェネレーターにオプションの`javadoc`を追加 (#1224 by [Daniel Eke][endanke])
-   [SQLite Dialect] sqlite `fts5`補助関数`highlight`、`snippet`、`bm25`のサポートを追加 (by [Daniel Rampelt][drampelt])
-   [MySQL Dialect] MySQL `BIT`データ型をサポート
-   [MySQL Dialect] MySQLバイナリリテラルをサポート
-   [PostgreSQL Dialect] `sql-psi`から`SERIAL`を公開 (by [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] `BOOLEAN`データ型を追加 (by [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] `NULL`列制約を追加 (by [Veyndan Stuart][VeyndanS])
-   [HSQL Dialect] HSQLに`AUTO_INCREMENT`サポートを追加 (by [Ryan Harter][rharter])

## [1.4.0] - 2020-06-22
### 追加
-   [MySQL Dialect] MySQLサポート (by [Jeff Gulbronson][JeffG] & [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] 実験的なPostgreSQLサポート (by [Veyndan Stuart][VeyndanS])
-   [HSQL Dialect] 実験的なH2サポート (by [Marius Volkhart][MariusV])
-   [SQLite Dialect] SQLite FTS5サポート (by [Ben Asher][BenA] & [James Palawaga][JamesP])
-   [SQLite Dialect] `ALTER TABLE RENAME COLUMN`をサポート (#1505 by [Angus Holder][AngusH])
-   [IDE] マイグレーション(`*.sqm`)ファイルのIDEサポート
-   [IDE] 組み込みのSQLライブテンプレートを模倣したSQLDelightライブテンプレートを追加 (#1154 by [Veyndan Stuart][VeyndanS])
-   [IDE] 新しいSqlDelightファイルアクションを追加 (#42 by [Roman Zavarnitsyn][RomanZ])
-   [Runtime] 結果を返すトランザクションのための`transactionWithReturn` API
-   [Compiler] 複数のSQLステートメントを`*.sq`ファイルにグループ化するための構文
-   [Compiler] マイグレーションファイルからスキーマを生成するサポート
-   [Gradle Plugin] マイグレーションファイルを有効なSQLとして出力するタスクを追加

### 変更
-   [Documentation] ドキュメントウェブサイトを全面的に見直し (by [Saket Narayan][SaketN])
-   [Gradle Plugin] サポートされていないダイアレクトのエラーメッセージを改善 (by [Veyndan Stuart][VeyndanS])
-   [IDE] ダイアレクトに基づいてファイルアイコンを動的に変更 (by [Veyndan Stuart][VeyndanS])
-   [JDBC Driver] `javax.sql.DataSource`から`JdbcDriver`コンストラクタを公開 (#1614)

### 修正
-   [Compiler] テーブルのJavadocをサポートし、1つのファイルに複数のJavadocがある問題を修正 (#1224)
-   [Compiler] 合成された列に値を挿入できるように修正 (#1351)
-   [Compiler] ディレクトリ名のサニタイジングにおける不整合を修正 (by [Zac Sweers][ZacSweers])
-   [Compiler] 合成された列が結合時にnull許容を保持するように修正 (#1656)
-   [Compiler] `DELETE`キーワードに`DELETE`ステートメントを固定するように修正 (#1643)
-   [Compiler] クォーティングを修正 (#1525 by [Angus Holder][AngusH])
-   [Compiler] `BETWEEN`演算子が式に適切に再帰するように修正 (#1279)
-   [Compiler] インデックス作成時にテーブル/列が見つからない場合、より良いエラーを出すように修正 (#1372)
-   [Compiler] 外部クエリのプロジェクションを結合制約で使用できるように有効化 (#1346)
-   [Native Driver] `execute`が`transactionPool`を使用するように修正 (by [Ben Asher][BenA])
-   [JDBC Driver] SQLiteではなくJDBCトランザクションAPIを使用するように修正 (#1693)
-   [IDE] `virtualFile`参照が常に元のファイルになるように修正 (#1782)
-   [IDE] Bugsnagにエラーを報告する際に正しい`throwable`を使用するように修正 (#1262)
-   [Paging Extension] リークする`DataSource`を修正 (#1628)
-   [Gradle Plugin] スキーマ生成時に出力`db`ファイルがすでに存在する場合、削除するように修正 (#1645)
-   [Gradle Plugin] ギャップがある場合、マイグレーションの検証を失敗させるように修正
-   [Gradle Plugin] 設定したファイルインデックスを明示的に使用するように修正 (#1644)

## [1.3.0] - 2020-04-03

*   新機能: [Gradle] コンパイル対象のSQLダイアレクトを指定するための`dialect`プロパティ。
*   新機能: [Compiler] #1009 MySQLダイアレクトの実験的サポート。
*   新機能: [Compiler] #1436 sqlite:3.24ダイアレクトと`UPSERT`のサポート。
*   新機能: [JDBC Driver] SQLite JVMドライバーからJDBCドライバーを分離。
*   修正: [Compiler] #1199 あらゆる長さのラムダをサポート。
*   修正: [Compiler] #1610 `avg()`の戻り値の型がnull許容になるように修正。
*   修正: [IntelliJ] #1594 Windowsでの`Goto`と`Find Usages`を壊していたパス区切り文字の処理を修正。

## [1.2.2] - 2020-01-22

*   新機能: [Runtime] Windows (`mingW`)、tvOS、watchOS、macOSアーキテクチャをサポート。
*   修正: [Compiler] `sum()`の戻り値の型がnull許容であるべき。
*   修正: [Paging] 競合状態を避けるため、`QueryDataSourceFactory`に`Transacter`を渡すように修正。
*   修正: [IntelliJ Plugin] ファイルのパッケージ名を検索する際に依存関係を検索しないように修正。
*   修正: [Gradle] #862 Gradleのバリデーターログをデバッグレベルに変更。
*   改善: [Gradle] `GenerateSchemaTask`をGradleワーカーを使用するように変換。
*   注意: `sqldelight-runtime`アーティファクトは`runtime`に名前が変更されました。

## [1.2.1] - 2019-12-11

*   修正: [Gradle] Kotlin Native 1.3.60をサポート。
*   修正: [Gradle] #1287 同期時の警告を修正。
*   修正: [Compiler] #1469 クエリの`SynetheticAccessor`作成を修正。
*   修正: [JVM Driver] メモリリークを修正。
*   注意: コルーチン拡張アーティファクトは、`buildscript`に`kotlinx bintray maven`リポジトリを追加する必要があります。

## [1.2.0] - 2019-08-30

*   新機能: [Runtime] 安定版`Flow` API。
*   修正: [Gradle] Kotlin Native 1.3.50をサポート。
*   修正: [Gradle] #1380 クリーンビルドが時々失敗する問題を修正。
*   修正: [Gradle] #1348 `verify`タスクを実行すると「Could not retrieve functions」と表示される問題を修正。
*   修正: [Compile] #1405 FTSテーブルが結合されたクエリが含まれるプロジェクトをビルドできない問題を修正。
*   修正: [Gradle] #1266 複数のデータベースモジュールがある場合にGradleビルドが断続的に失敗する問題を修正。

## [1.1.4] - 2019-07-11

*   新機能: [Runtime] 実験的なKotlin Flow API。
*   修正: [Gradle] Kotlin/Native 1.3.40との互換性。
*   修正: [Gradle] #1243 Gradleのオンデマンド設定でSQLDelightを使用する際の修正。
*   修正: [Gradle] #1385 インクリメンタルアノテーション処理でSQLDelightを使用する際の修正。
*   修正: [Gradle] Gradleタスクのキャッシュを許可。
*   修正: [Gradle] #1274 Kotlin DSLで`sqldelight`拡張の使用を有効化。
*   修正: [Compiler] 各クエリに対して確定的にユニークなIDが生成されるように修正。
*   修正: [Compiler] トランザクション完了時にのみリスニング中のクエリに通知するように修正。
*   修正: [JVM Driver] #1370 `JdbcSqliteDriver`ユーザーにDB URLの提供を強制。

## [1.1.3] - 2019-04-14

*   Gradle Metadata 1.0リリース。

## [1.1.2] - 2019-04-14

*   新機能: [Runtime] #1267 ロギングドライバーデコレーター。
*   修正: [Compiler] #1254 2^16文字より長い文字列リテラルを分割するように修正。
*   修正: [Gradle] #1260 生成されたソースがマルチプラットフォームプロジェクトでiOSソースとして認識される問題を修正。
*   修正: [IDE] #1290 `kotlin.KotlinNullPointerException` in `CopyAsSqliteAction.kt:43`を修正。
*   修正: [Gradle] #1268 最近のバージョンで`linkDebugFrameworkIos*`タスクの実行が失敗する問題を修正。

## [1.1.1] - 2019-03-01

*   修正: [Gradle] Androidプロジェクトのモジュール依存関係のコンパイルを修正。
*   修正: [Gradle] #1246 `afterEvaluate`でAPI依存関係を設定するように修正。
*   修正: [Compiler] 配列型が正しく出力されるように修正。

## [1.1.0] - 2019-02-27

*   新機能: [Gradle] #502 スキーマモジュールの依存関係を指定できるように許可。
*   改善: [Compiler] #1111 テーブルのエラーが他のエラーの前にソートされるように改善。
*   修正: [Compiler] #1225 `REAL`リテラルに対して正しい型を返すように修正。
*   修正: [Compiler] #1218 `docid`がトリガーを通じて伝播するように修正。

## [1.0.3] - 2019-01-30

*   改善: [Runtime] #1195 Native Driver/Runtime Arm32。
*   改善: [Runtime] #1190 `Query`型から`mapper`を公開。

## [1.0.2] - 2019-01-26

*   修正: [Gradle Plugin] Kotlin 1.3.20にアップデート。
*   修正: [Runtime] トランザクションが例外を飲み込まないように修正。

## [1.0.1] - 2019-01-21

*   改善: [Native Driver] `DatabaseConfiguration`にディレクトリ名を渡せるように許可。
*   改善: [Compiler] #1173 パッケージのないファイルがコンパイルに失敗するように変更。
*   修正: [IDE] IDEエラーをSquareに適切に報告。
*   修正: [IDE] #1162 同じパッケージ内の型がエラーとして表示されるが、実際には問題なく動作する問題を修正。
*   修正: [IDE] #1166 テーブルの名前変更が`NPE`で失敗する問題を修正。
*   修正: [Compiler] #1167 `UNION`と`SELECT`を含む複雑なSQLステートメントを解析しようとすると例外がスローされる問題を修正。

## [1.0.0] - 2019-01-08

*   新機能: 生成コードが全面的に見直され、Kotlinになりました。
*   新機能: RxJava2拡張アーティファクト。
*   新機能: Android Paging拡張アーティファクト。
*   新機能: Kotlin Multiplatformをサポート。
*   新機能: Android、iOS、JVM SQLiteドライバーアーティファクト。
*   新機能: トランザクションAPI。

## [0.7.0] - 2018-02-12

*   新機能: 生成されたコードがSupport SQLiteライブラリのみを使用するように更新されました。すべてのクエリは、生の文字列ではなく、ステートメントオブジェクトを生成するようになりました。
*   新機能: IDEでのステートメント折りたたみ機能。
*   新機能: Boolean型が自動的に処理されるようになりました。
*   修正: コード生成から非推奨の`marshal`を削除。
*   修正: `avg` SQL関数の型マッピングを`REAL`に正しく修正。
*   修正: `julianday` SQL関数を正しく検出するように修正。

## [0.6.1] - 2017-03-22

*   新機能: 引数なしの`DELETE`、`UPDATE`、`INSERT`ステートメントに対してコンパイル済みステートメントが生成されるようになりました。
*   修正: サブクエリで使用されるビュー内の`USING`句がエラーを発生しないように修正。
*   修正: 生成されたマッパー上の重複する型を削除。
*   修正: サブクエリが引数と照合する式で使用できるようになりました。

## [0.6.0] - 2017-03-06

*   新機能: `SELECT`クエリが文字列定数ではなく`SqlDelightStatement`ファクトリとして公開されるようになりました。
*   新機能: クエリのJavadocがステートメントおよびマッパーファクトリにコピーされるようになりました。
*   新機能: ビュー名に文字列定数を出力。
*   修正: ファクトリを必要とするビュー上のクエリが、それらのファクトリを引数として正しく要求するように修正。
*   修正: `INSERT`の引数の数が指定された列数と一致するか検証するように修正。
*   修正: `WHERE`句で使用される`BLOB`リテラルを正しくエンコードするように修正。
*   このリリースにはGradle 3.3以降が必要です。

## [0.5.1] - 2016-10-24

*   新機能: コンパイル済みステートメントが抽象型を継承するように変更。
*   修正: パラメータのプリミティブ型は、null許容の場合にボックス化されるように修正。
*   修正: `bind`引数に必要なすべてのファクトリがファクトリメソッドに存在するように修正。
*   修正: エスケープされた列名が`Cursor`から取得された場合に`RuntimeException`をスローしないように修正。

## [0.5.0] - 2016-10-19

*   新機能: SQLiteの引数を`Factory`を通じて型安全に渡せるようになりました。
*   新機能: IntelliJプラグインが`.sq`ファイルのフォーマットを実行するようになりました。
*   新機能: SQLiteのtimestampリテラルをサポート。
*   修正: パラメータ化された型をIntelliJでクリックして移動できるように修正。
*   修正: エスケープされた列名が`Cursor`から取得された場合に`RuntimeException`をスローしないように修正。
*   修正: Gradleプラグインが例外を出力しようとしてクラッシュしないように修正。

## [0.4.4] - 2016-07-20

*   新機能: 列のJava型として`short`をネイティブサポート。
*   新機能: 生成されたマッパーとファクトリメソッドにJavadocを追加。
*   修正: `group_concat`および`nullif`関数が適切なnull許容を持つように修正。
*   修正: Android Studio 2.2-alphaとの互換性を修正。
*   修正: `WITH RECURSIVE`がプラグインをクラッシュさせないように修正。

## [0.4.3] - 2016-07-07

*   新機能: コンパイルエラーがソースファイルにリンクするようになりました。
*   新機能: 右クリックでSQLDelightコードを有効なSQLiteとしてコピーできるようになりました。
*   新機能: 名前付きステートメントのJavadocが生成された`String`に表示されるようになりました。
*   修正: 生成されたビューモデルにnull許容アノテーションが含まれるように修正。
*   修正: `UNION`から生成されたコードが、すべての可能な列をサポートするために適切な型とnull許容を持つように修正。
*   修正: `sum`および`round` SQLite関数が生成されたコードで適切な型を持つように修正。
*   修正: `CAST`、内部`SELECT`のバグ修正。
*   修正: `CREATE TABLE`ステートメントの自動補完。
*   修正: SQLiteキーワードがパッケージで使用できるようになりました。

## [0.4.2] - 2016-06-16

*   新機能: `Marshal`が`Factory`から作成できるようになりました。
*   修正: IntelliJプラグインが適切なジェネリック順序でファクトリメソッドを生成するように修正。
*   修正: 関数名があらゆるケースを使用できるようになりました。

## [0.4.1] - 2016-06-14

*   修正: IntelliJプラグインが適切なジェネリック順序でクラスを生成するように修正。
*   修正: 列定義があらゆるケースを使用できるようになりました。

## [0.4.0] - 2016-06-14

*   新機能: マッパーがテーブルごとではなくクエリごとに生成されるようになりました。
*   新機能: `.sq`ファイルでJava型をインポートできるようになりました。
*   新機能: SQLite関数が検証されるようになりました。
*   修正: 重複するエラーを削除。
*   修正: 大文字の列名とJavaキーワードの列名がエラーを発生しないように修正。

## [0.3.2] - 2016-05-14

*   新機能: 自動補完と使用箇所の検索がビューとエイリアスで機能するようになりました。
*   修正: コンパイル時検証で関数が`SELECT`で使用できるようになりました。
*   修正: デフォルト値のみを宣言する`INSERT`ステートメントをサポート。
*   修正: SQLDelightを使用していないプロジェクトがインポートされたときにプラグインがクラッシュしないように修正。

## [0.3.1] - 2016-04-27

*   修正: インターフェースの可視性が`public`に戻され、メソッド参照からのIllegal Accessランタイム例外を回避。
*   修正: サブ式が適切に評価されるように修正。

## [0.3.0] - 2016-04-26

*   新機能: 列定義がSQLite型を使用し、Java型を指定するための追加の`AS`制約を持つことができるようになりました。
*   新機能: IDEからバグレポートを送信できるようになりました。
*   修正: 自動補完関数を適切に修正。
*   修正: SQLDelightモデルファイルが`.sq`ファイル編集時に更新されるように修正。
*   削除: 接続されたデータベースはサポートされなくなりました。

## [0.2.2] - 2016-03-07

*   新機能: `INSERT`、`UPDATE`、`DELETE`、`INDEX`、`TRIGGER`ステートメントで使用される列のコンパイル時検証。
*   修正: ファイルの移動/作成時にIDEプラグインがクラッシュしないように修正。

## [0.2.1] - 2016-03-07

*   新機能: `Ctrl`+`/`（OSXでは`Cmd`+`/`）で選択した行のコメントを切り替え。
*   新機能: SQLクエリで使用される列のコンパイル時検証。
*   修正: IDEおよびGradleプラグインの両方でWindowsパスをサポート。

## [0.2.0] - 2016-02-29

*   新機能: `Marshal`クラスにコピーコンストラクタを追加。
*   新機能: Kotlin 1.0 Finalに更新。
*   修正: 「`sqldelight`フォルダ構造の問題」を失敗しない方法で報告。
*   修正: `table_name`という名前の列を禁止。それらの生成された定数がテーブル名定数と衝突するため。
*   修正: IDEプラグインがモデルクラスを即座に生成し、`.sq`ファイルが開かれたかどうかにかかわらず行うように保証。
*   修正: IDEおよびGradleプラグインの両方でWindowsパスをサポート。

## [0.1.2] - 2016-02-13

*   修正: Gradleプラグインがほとんどのプロジェクトで使用されるのを妨げていたコードを削除。
*   修正: Antlrランタイムへの不足しているコンパイラ依存関係を追加。

## [0.1.1] - 2016-02-12

*   修正: Gradleプラグインが自身と同じバージョンのランタイムを指すように保証。

## [0.1.0] - 2016-02-12

初回リリース。

[JeffG]: https://github.com/JGulbronson
[VeyndanS]: https://github.com/veyndan
[BenA]: https://github.com/benasher44
[JamesP]: https://github.com/jpalawaga
[MariusV]: https://github.com/MariusVolkhart
[SaketN]: https://github.com/saket
[RomanZ]: https://github.com/romtsn
[ZacSweers]: https://github.com/ZacSweers
[AngusH]: https://github.com/angusholder
[drampelt]: https://github.com/drampelt
[endanke]: https://github.com/endanke
[rharter]: https://github.com/rharter
[vanniktech]: https://github.com/vanniktech
[maaxgr]: https://github.com/maaxgr
[eygraber]: https://github.com/eygraber
[lawkai]: https://github.com/lawkai
[felipecsl]: https://github.com/felipecsl
[dellisd]: https://github.com/dellisd
[stephanenicolas]: https://github.com/stephanenicolas
[oldergod]: https://github.com/oldergod
[qjroberts]: https://github.com/qjroberts
[kevincianfarini]: https://github.com/kevincianfarini
[andersio]: https://github.com/andersio
[ilmat192]: https://github.com/ilmat192
[3flex]: https://github.com/3flex
[aperfilyev]: https://github.com/aperfilyev
[satook]: https://github.com/Satook
[thomascjy]: https://github.com/ThomasCJY
[pyricau]: https://github.com/pyricau
[hannesstruss]: https://github.com/hannesstruss
[martinbonnin]: https://github.com/martinbonnin
[enginegl]: https://github.com/enginegl
[pchmielowski]: https://github.com/pchmielowski
[chippmann]: https://github.com/chippmann
[IliasRedissi]: https://github.com/IliasRedissi
[ahmedre]: https://github.com/ahmedre
[pabl0rg]: https://github.com/pabl0rg
[hfhbd]: https://github.com/hfhbd
[sdoward]: https://github.com/sdoward
[PhilipDukhov]: https://github.com/PhilipDukhov
[julioromano]: https://github.com/julioromano
[PaulWoitaschek]: https://github.com/PaulWoitaschek
[kpgalligan]: https://github.com/kpgalligan
[robx]: https://github.com/robxyy
[madisp]: https://github.com/madisp
[svenjacobs]: https://github.com/svenjacobs
[jeffdgr8]: https://github.com/jeffdgr8
[bellatoris]: https://github.com/bellatoris
[sachera]: https://github.com/sachera
[sproctor]: https://github.com/sproctor
[davidwheeler123]: https://github.com/davidwheeler123
[C2H6O]: https://github.com/C2H6O
[griffio]: https://github.com/griffio
[shellderp]: https://github.com/shellderp
[joshfriend]: https://github.com/joshfriend
[daio]: https://github.com/daio
[morki]: https://github.com/morki
[Adriel-M]: https://github.com/Adriel-M
[05nelsonm]: https://github.com/05nelsonm
[jingwei99]: https://github.com/jingwei99
[anddani]: https://github.com/anddani
[BoD]: https://github.com/BoD
[de-luca]: https://github.com/de-luca
[MohamadJaara]: https://github.com/MohamadJaara
[nwagu]: https://github.com/nwagu
[IlyaGulya]: https://github.com/IlyaGulya
[edenman]: https://github.com/edenman
[vitorhugods]: https://github.com/vitorhugods
[evant]: https://github.com/evant
[TheMrMilchmann]: https://github.com/TheMrMilchmann
[drewd]: https://github.com/drewd
[orenkislev-faire]: https://github.com/orenkislev-faire
[janbina]: https://github.com/janbina
[DRSchlaubi]: https://github.com/DRSchlaubi
[jonapoul]: https://github.com/jonapoul