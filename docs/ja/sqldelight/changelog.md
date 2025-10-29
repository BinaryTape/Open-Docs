# 変更履歴

## 未リリース

### 追加
-   [Compiler] `CAST` が必要な場合に、ソースファイルの位置を含めるようにコンパイラのエラーメッセージを改善 (#5979 by [Griffio][griffio])
-   [PostgreSQL Dialect] Postgres `JSON` オペレーターのパス抽出のサポートを追加 (#5971 by [Griffio][griffio])
-   [SQLite Dialect] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントの `Sqlite 3.35` サポートを追加 (#5961 by [Griffio][griffio])
-   [PostgreSQL Dialect] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントのサポートを追加 (#5961 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgres JSON Aggregate FILTER` のサポートを追加 (#5957 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgres Enum` のサポートを追加 (#5935 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgres Triggers` の限定的なサポートを追加 (#5932 by [Griffio][griffio])
-   [PostgreSQL Dialect] `SQL` 式が `JSON` として解析できるかをチェックする述語を追加 (#5843 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql Comment On` ステートメントに対する限定的なサポートを追加 (#5808 by [Griffio][griffio])
-   [MySQL Dialect] インデックス可視性オプションのサポートを追加 (#5785 by [Oren Kislev][orenkislev-faire])
-   [PostgreSql Dialect] `TSQUERY` データ型のサポートを追加 (#5779 by [Griffio][griffio])
-   [Gradle Plugin] モジュール追加時のバージョンカタログ (`version catalogs`) のサポートを追加 (#5755 by [Michael Rittmeister][DRSchlaubi])

### 変更
-   開発中のスナップショット (`In-development snapshots`) は、`https://central.sonatype.com/repository/maven-snapshots/` の Central Portal Snapshots リポジトリに公開されるようになりました。
-   [Compiler] コンストラクタ参照 (`constructor references`) を使用して、デフォルトで生成されるクエリを簡素化 (#5814 by [Jon Poulton][jonapoul])

### 修正
-   [Compiler] 共通テーブル式 (`Common Table Expression`) を含む `View` を使用する際のスタックオーバーフロー (`stack overflow`) を修正 (#5928 by [Griffio][griffio])
-   [Gradle Plugin] `SqlDelight` ツールウィンドウ (`tool window`) で「新しい接続 (`New Connection`)」を追加する際のクラッシュを修正 (#5906 by [Griffio][griffio])
-   [IntelliJ Plugin] コピー・トゥ・SQLiteガターアクション (`copy-to-sqlite gutter action`) におけるスレッド関連のクラッシュを回避 (#5901 by [Griffio][griffio])
-   [IntelliJ Plugin] `CREATE INDEX` および `CREATE VIEW` スキーマステートメント (`schema statements`) 使用時の `PostgreSql` ダイアレクトの修正 (#5772 by [Griffio][griffio])
-   [Compiler] 列参照時の `FTS` スタックオーバーフロー (`stack overflow`) を修正 (#5896 by [Griffio][griffio])
-   [Compiler] `WITH RECURSIVE` スタックオーバーフロー (`stack overflow`) を修正 (#5892 by [Griffio][griffio])
-   [Compiler] `INSERT|UPDATE|DELETE RETURNING` ステートメントの通知 (`Notify`) を修正 (#5851 by [Griffio][griffio])
-   [Compiler] `Long` を返すトランザクションブロック (`transaction blocks`) の非同期結果型 (`async result type`) を修正 (#5836 by [Griffio][griffio])
-   [Compiler] `SQL` パラメータバインディング (`SQL parameter binding`) の複雑度 (`complexity`) を `O(n²)` から `O(n)` に最適化 (#5898 by [Chen Frenkel][chenf7])
-   [SQLite Dialect] `Sqlite 3.18` で不足していた関数を修正 (#5759 by [Griffio][griffio])

## [2.1.0] - 2025-05-16

### 追加
-   [WASM Driver] `wasmJs` の `web worker driver` へのサポートを追加 (#5534 by [Ilya Gulya][IlyaGulya])
-   [PostgreSQL Dialect] `PostgreSql UnNest Array to rows` をサポート (#5673 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql TSRANGE/TSTZRANGE` のサポート (#5297 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql Right Full Join` のサポート (#5086 by [Griffio][griffio])
-   [PostgreSQL Dialect] `temporal types` からの `Postrgesql extract` をサポート (#5273 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql array contains operators` のサポート (#4933 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql drop constraint` をサポート (#5288 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgresql type casting` をサポート (#5089 by [Griffio][griffio])
-   [PostgreSQL Dialect] サブクエリ (`subquery`) 用の `PostgreSql lateral join operator` をサポート (#5122 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgresql ILIKE operator` をサポート (#5330 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql XML type` をサポート (#5331 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql AT TIME ZONE` をサポート (#5243 by [Griffio][griffio])
-   [PostgreSQL Dialect] `postgresql order by nulls` のサポートを追加 (#5199 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQL の現在日時関数 (`current date/time function`) サポートを追加 (#5226 by [Drew Dobson][drewd])
-   [PostgreSQL Dialect] `PostgreSql Regex operators` をサポート (#5137 by [Griffio][griffio])
-   [PostgreSQL Dialect] `brin gist` を追加 (#5059 by [Griffio][griffio])
-   [MySQL Dialect] `MySql` ダイアレクトの `RENAME INDEX` をサポート (#5212 by [Oren Kislev][orenkislev-faire])
-   [JSON Extension] `json table function` にエイリアスを追加 (#5372 by [Griffio][griffio])

### 変更
-   [Compiler] 生成されるクエリファイルが、シンプルなミューテーター (`mutators`) の行数 (`row counts`) を返すように変更 (#4578 by [Marius Volkhart][MariusV])
-   [Native Driver] `NativeSqlDatabase.kt` を更新し、`DELETE`、`INSERT`、および `UPDATE` ステートメントの読み取り専用フラグ (`readonly flag`) を変更 (#5680 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PgInterval` を `String` に変更 (#5403 by [Griffio][griffio])
-   [PostgreSQL Dialect] `SqlDelight` モジュールが `PostgreSql` 拡張を実装 (`implement PostgreSql extensions`) できるようにサポート (#5677 by [Griffio][griffio])

### 修正
-   [Compiler] 修正: 結果を伴うグループステートメント (`group statements`) 実行時にクエリに通知するよう修正 (#5006 by [Vitor Hugo Schwaab][vitorhugods])
-   [Compiler] `SqlDelightModule` 型リゾルバー (`type resolver`) を修正 (#5625 by [Griffio][griffio])
-   [Compiler] `5501` の挿入オブジェクトエスケープ列 (`insert object escaped column`) を修正 (#5503 by [Griffio][griffio])
-   [Compiler] コンパイラ: エラーメッセージ (`error message`) を改善し、パスリンク (`path links`) が正しい行 (`line`) と文字位置 (`char position`) でクリック可能 (`clickable`) になるように修正 (#5604 by [Niklas Baudy][vanniktech])
-   [Compiler] `issue 5298` を修正: キーワードをテーブル名として使用できるように修正
-   [Compiler] 名前付き実行 (`named executes`) を修正し、テストを追加
-   [Compiler] 初期化ステートメント (`initialization statements`) のソート時に外部キーテーブル制約 (`foreign key table constraints`) を考慮 (#5325 by [Leon Linhart][TheMrMilchmann])
-   [Compiler] タブ (`tabs`) が関係する場合にエラー下線 (`error underlines`) を適切に揃えるよう修正 (#5224 by [Drew Dobson][drewd])
-   [JDBC Driver] トランザクション終了時の `connectionManager` のメモリリーク (`memory leak`) を修正
-   [JDBC Driver] ドキュメントに記載されているように、SQLite のマイグレーションをトランザクション内で実行するよう修正 (#5218 by [Lukáš Moravec][morki])
-   [JDBC Driver] トランザクションコミット/ロールバック (`commit / rollback`) 後の接続リーク (`leaking connections`) を修正 (#5205 by [Lukáš Moravec][morki])
-   [Gradle Plugin] `DriverInitializer` を `GenerateSchemaTask` の前に実行するように修正 (#5562 by [Emeka Nwagu][nwagu])
-   [Runtime] 実際のドライバーが `Async` の場合に `LogSqliteDriver` でクラッシュする問題を修正 (#5723 by [Eric Denman][edenman])
-   [Runtime] `StringBuilder` の容量 (`capacity`) を修正 (#5192 by [Jan Bína][janbina])
-   [PostgreSQL Dialect] `PostgreSql create or replace view` を修正 (#5407 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgresql to_json` を修正 (#5606 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql numeric resolver` を修正 (#5399 by [Griffio][griffio])
-   [PostgreSQL Dialect] `sqlite windows function` を修正 (#2799 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql SELECT DISTINCT ON` を修正 (#5345 by [Griffio][griffio])
-   [PostgreSQL Dialect] `alter table add column if not exists` を修正 (#5309 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Postgresql async bind parameter` を修正 (#5313 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql boolean literals` を修正 (#5262 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql window functions` を修正 (#5155 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql isNull isNotNull types` を修正 (#5173 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql select distinct` を修正 (#5172 by [Griffio][griffio])
-   [Paging Extension] ページングの初期ロード時のリフレッシュ (`paging refresh initial load`) を修正 (#5615 by [Eva][evant])
-   [Paging Extension] `MacOS native targets` を追加 (#5324 by [Vitor Hugo Schwaab][vitorhugods])
-   [IntelliJ Plugin] `K2 Support`

## [2.0.2] - 2024-04-05

### 追加
-   [PostgreSQL Dialect] PostgreSQL の `STRING_AGG` 関数を追加 (#4950 by [André Danielsson][anddani])
-   [PostgreSQL Dialect] `pg` ダイアレクトに `SET` ステートメントを追加 (#4927 by [Bastien de Luca][de-luca])
-   [PostgreSQL Dialect] `PostgreSql alter column sequence parameters` を追加 (#4916 by [Griffio][griffio])
-   [PostgreSQL Dialect] `INSERT` ステートメントの `postgresql alter column default` サポートを追加 (#4912 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSql alter sequence` と `drop sequence` を追加 (#4920 by [Griffio][griffio])
-   [PostgreSQL Dialect] 追加の `Postgres Regex function definitions` を追加 (#5025 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `GIN` の文法 (`grammar`) を追加 (#5027 by [Griffio][griffio])

### 変更
-   [IDE Plugin] 最低バージョン (`Minimum version`) を `2023.1 / Android Studio Iguana` に引き上げ
-   [Compiler] `encapsulatingType` での型の `null` 許容の上書き (`override the type nullability`) を許可 (#4882 by [Eliezer Graber][eygraber])
-   [Compiler] `SELECT *` の列名 (`column names`) をインライン化 (`Inline`)
-   [Gradle Plugin] `processIsolation` に切り替え (#5068 by [Emeka Nwagu][nwagu])
-   [Android Runtime] Android の `minSDK` を `21` に引き上げ (#5094 by [Philip Wedemann][hfhbd])
-   [Drivers] ダイアレクト作者 (`dialect authors`) 向けに `JDBC/R2DBC` ステートメントメソッドをさらに公開 (`Expose more JDBC/R2DBC statement methods`) (#5098 by [Philip Wedemann][hfhbd])

### 修正
-   [PostgreSQL Dialect] `postgresql alter table alter column` を修正 (#4868 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4448` のテーブルモデル (`table model`) のインポート不足 (`missing import`) を修正 (#4885 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4932` の `postgresql default constraint functions` を修正 (#4934 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4879` のマイグレーション中の `alter table rename column` での `postgresql class-cast error` を修正 (#4880 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4474 PostgreSql create extension` を修正 (#4541 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5018 PostgreSql add Primary Key not nullable types` を修正 (#5020 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4703 aggregate expressions` を修正 (#5071 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5028 PostgreSql json` を修正 (#5030 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5040 PostgreSql json operators` を修正 (#5041 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5040` の `json operator binding` を修正 (#5100 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5082 tsvector` を修正 (#5104 by [Griffio][griffio])
-   [PostgreSQL Dialect] `5032 PostgreSql UPDATE FROM statement` での `column adjacency` を修正 (#5035 by [Griffio][griffio])
-   [SQLite Dialect] `4897 sqlite alter table rename column` を修正 (#4899 by [Griffio][griffio])
-   [IDE Plugin] エラーハンドラ (`error handler`) のクラッシュを修正 (#4988 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `IDEA 2023.3` で `BugSnag` の初期化に失敗 (`fails to init`) (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] プラグイン (`plugin`) を介して `IntelliJ` で `.sq` ファイルを開く際の `PluginException` を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] Kotlin ライブラリがすでにプラグインの依存関係 (`plugin dependency`) にあるため、`IntelliJ` プラグインにバンドルしないよう修正 (#5126)
-   [IDE Plugin] ストリーム (`stream`) の代わりに `extensions` 配列を使用するよう修正 (#5127)

## [2.0.1] - 2023-12-01

### 追加
-   [Compiler] `SELECT` 実行時に複数列式 (`multi-column-expr`) をサポート (#4453 by [Adriel Martinez][Adriel-M])
-   [PostgreSQL Dialect] `PostgreSQL CREATE INDEX CONCURRENTLY` のサポートを追加 (#4531 by [Griffio][griffio])
-   [PostgreSQL Dialect] `PostgreSQL CTEs auxiliary statements` が互いを参照 (`reference each other`) できるように許可 (#4493 by [Griffio][griffio])
-   [PostgreSQL Dialect] `binary expr` と `sum` の `PostgreSQL types` のサポートを追加 (#4539 by [Adriel Martinez][Adriel-M])
-   [PostgreSQL Dialect] `PostgreSQL SELECT DISTINCT ON` 構文のサポートを追加 (#4584 by [Griffio][griffio])
-   [PostgreSQL Dialect] `SELECT` ステートメントにおける `PostgreSQL JSON functions` サポートを追加 (#4590 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `generate_series PostgreSQL function` を追加 (#4717 by [Griffio][griffio])
-   [PostgreSQL Dialect] 追加の `Postgres String function definitions` を追加 (#4752 by [Marius Volkhart][MariusV])
-   [PostgreSQL Dialect] `min` および `max aggregate functions` に `DATE PostgreSQL type` を追加 (#4816 by [André Danielsson][anddani])
-   [PostgreSQL Dialect] `SqlBinaryExpr` に `PostgreSql temporal types` を追加 (#4657 by [Griifio][griffio])
-   [PostgreSQL Dialect] `postgres` ダイアレクトに `TRUNCATE` を追加 (#4817 by [Bastien de Luca][de-luca])
-   [SQLite 3.35 Dialect] 順序通りに評価 (`evaluated in order`) される複数の `ON CONFLICT` 句 (`clauses`) を許可 (#4551 by [Griffio][griffio])
-   [JDBC Driver] より快適な `SQL` 編集 (`pleasant SQL editing`) のために `Language annotations` を追加 (#4602 by [Marius Volkhart][MariusV])
-   [Native Driver] ネイティブドライバー (`Native-driver`): `linuxArm64` のサポートを追加 (#4792 by [Philip Wedemann][hfhbd])
-   [Android Driver] `AndroidSqliteDriver` に `windowSizeBytes parameter` を追加 (#4804 by [Benoit Lubek][BoD])
-   [Paging3 Extension] 機能: `OffsetQueryPagingSource` に `initialOffset` を追加 (#4802 by [Mohamad Jaara][MohamadJaara])

### 変更
-   [Compiler] 適切な場合に `Kotlin types` を優先 (`Prefer Kotlin types where appropriate`) するよう変更 (#4517 by [Eliezer Graber][eygraber])
-   [Compiler] `value type insert` を行う場合、常に列名 (`column names`) を含める (`always include`) ように変更 (#4864)
-   [PostgreSQL Dialect] `PostgreSQL` ダイアレクトから実験的ステータス (`experimental status`) を削除 (#4443 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] `PostgreSQL types` のドキュメント (`docs`) を更新 (#4569 by [Marius Volkhart][MariusV])
-   [R2DBC Driver] PostgreSQL で整数データ型 (`integer data types`) を扱う際のパフォーマンス (`performance`) を最適化 (`Optimize`) (#4588 by [Marius Volkhart][MariusV])

### 削除
-   [SQLite Javascript Driver] `sqljs-driver` を削除 (#4613, #4670 by [Derek Ellis][dellisd])

### 修正
-   [Compiler] 戻り値があり、パラメータのないグループ化されたステートメント (`grouped statements`) のコンパイル (`compilation`) を修正 (#4699 by [Griffio][griffio])
-   [Compiler] `SqlBinaryExpr` で引数をバインド (`Bind arguments`) するように修正 (#4604 by [Griffio][griffio])
-   [IDE Plugin] 設定されている場合、`IDEA Project JDK` を使用するよう修正 (#4689 by [Griffio][griffio])
-   [IDE Plugin] `IDEA 2023.2` 以降での「`Unknown element type: TYPE_NAME`」エラーを修正 (#4727)
-   [IDE Plugin] `2023.2` とのいくつかの互換性問題 (`compatibility issues`) を修正
-   [Gradle Plugin] `verifyMigrationTask Gradle task` のドキュメント (`documentation`) を修正 (#4713 by [Josh Friend][joshfriend])
-   [Gradle Plugin] ユーザーがデータベースを検証する前にデータベースを生成するのに役立つ `Gradle task output message` を追加 (#4684 by [Jingwei][jingwei99])
-   [PostgreSQL Dialect] `PostgreSQL columns` の複数回の名前変更 (`renaming`) を修正 (#4566 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4714 postgresql alter column nullability` を修正 (#4831 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4837 alter table alter column` を修正 (#4846 by [Griffio][griffio])
-   [PostgreSQL Dialect] `4501 PostgreSql sequence` を修正 (#4528 by [Griffio][griffio])
-   [SQLite Dialect] `JSON binary operator` が列式 (`column expression`) で使用できるように許可 (#4776 by [Eliezer Graber][eygraber])
-   [SQLite Dialect] 名前で複数の列が見つかった場合の `Update From false positive` を修正 (#4777 by [Eliezer Graber][eygraber])
-   [Native Driver] 名前付きインメモリデータベース (`named in-memory databases`) をサポート (#4662 by [Matthew Nelson][05nelsonm])
-   [Native Driver] クエリリスナーコレクション (`query listener collection`) のスレッドセーフティ (`thread safety`) を保証 (#4567 by [Kevin Galligan][kpgalligan])
-   [JDBC Driver] `ConnectionManager` における接続リーク (`connection leak`) を修正 (#4589 by [Marius Volkhart][MariusV])
-   [JDBC Driver] `ConnectionManager` 型を選択する際の `JdbcSqliteDriver url parsing` を修正 (#4656 by [Matthew Nelson][05nelsonm])

## [2.0.0] - 2023-07-26

### 追加
-   [MySQL Dialect] MySQL: `IF expression` での `timestamp/bigint` のサポート (#4329 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] MySQL: `now` を追加 (#4431 by [Philip Wedemann][hfhbd])
-   [Web Driver] `NPM package publishing` を有効化 (#4364)
-   [IDE Plugin] `gradle tooling` 接続 (`connect`) が失敗した場合に、スタックトレース (`stacktrace`) を表示できるようにユーザーを許可 (#4383)

### 変更
-   [Sqlite Driver] `JdbcSqliteDriver` のスキーママイグレーション (`schema migrations`) の使用を簡素化 (`Simplify`) (#3737 by [Lukáš Moravec][morki])
-   [R2DBC Driver] 真の非同期 `R2DBC cursor` (#4387 by [Philip Wedemann][hfhbd])

### 修正
-   [IDE Plugin] 必要になるまでデータベースプロジェクトサービス (`database project service`) をインスタンス化 (`instantiate`) しないように修正 (#4382)
-   [IDE Plugin] 使用箇所の検索 (`find usages`) 中のプロセスキャンセル (`process cancellation`) を処理 (#4340)
-   [IDE Plugin] `IDE`での非同期コード生成 (`async code`) を修正 (#4406)
-   [IDE Plugin] パッケージ構造 (`package structure`) のアセンブリ (`assembly`) を `EDT` から離れた一度計算 (`one-time computed`) されるように移動 (#4417)
-   [IDE Plugin] `2023.2` での `kotlin type resolution` に正しいスタブインデックスキー (`stub index key`) を使用するように修正 (#4416)
-   [IDE Plugin] 検索 (`search`) を実行する前にインデックス (`index`) が準備できるのを待つ (`Wait for the index to be ready`) ように修正 (#4419)
-   [IDE Plugin] インデックスが利用できない場合 (`index is unavailable`) に `goto` を実行しないように修正 (#4420)
-   [Compiler] グループ化されたステートメント (`grouped statements`) の結果式 (`result expression`) を修正 (#4378)
-   [Compiler] 仮想テーブル (`virtual table`) をインターフェース型 (`interface type`) として使用しないように修正 (#4427 by [Philip Wedemann][hfhbd])

## [2.0.0-rc02] - 2023-06-27

### 追加
-   [MySQL Dialect] 小文字の日付型 (`lowercase date types`) と日付型の最小/最大値 (`min and max on date types`) のサポート (#4243 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] `binary expr` と `sum` の `mysql types` をサポート (#4254 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] 表示幅なしの符号なし整数 (`unsigned ints without display width`) をサポート (#4306 by [Mike Gershunovsky][shellderp])
-   [MySQL Dialect] `LOCK IN SHARED MODE` をサポート
-   [PostgreSQL Dialect] `min max` に `boolean` と `Timestamp` を追加 (#4245 by [Griffio][griffio])
-   [PostgreSQL Dialect] Postgres: ウィンドウ関数 (`window function`) サポートを追加 (#4283 by [Philip Wedemann][hfhbd])
-   [Runtime] `runtime` に `linuxArm64`、`androidNative`、`watchosDeviceArm` ターゲットを追加 (#4258 by [Philip Wedemann][hfhbd])
-   [Paging Extension] ペイジング拡張 (`paging extension`) に `linux` と `mingw x64` ターゲットを追加 (#4280 by [Cedric Hippmann][chippman])

### 変更
-   [Gradle Plugin] Android `API 34` の自動ダイアレクトサポート (`automatic dialect support`) を追加 (#4251)
-   [Paging Extension] `QueryPagingSource` で `SuspendingTransacter` をサポート (#4292 by [Ilya Polenov][daio])
-   [Runtime] `addListener api` を改善 (#4244 by [Philip Wedemann][hfhbd])
-   [Runtime] マイグレーションバージョン (`migration version`) に `Long` を使用するように変更 (#4297 by [Philip Wedemann][hfhbd])

### 修正
-   [Gradle Plugin] 生成されたソース (`generated source`) の安定した出力パス (`stable output path`) を使用するように修正 (#4269 by [Josh Friend][joshfriend])
-   [Gradle Plugin] `Gradle tweaks` を修正 (#4222 by [Matthew Haughton][3flex])

## [2.0.0-rc01] - 2023-05-29

### 追加
-   [Paging] ペイジング拡張 (`paging extensions`) に `js browser` ターゲットを追加 (#3843 by [Sean Proctor][sproctor])
-   [Paging] `androidx-paging3` 拡張に `iosSimulatorArm64` ターゲットを追加 (#4117)
-   [PostgreSQL Dialect] `gen_random_uuid()` のサポートとテストを追加 (#3855 by [David Wheeler][davidwheeler123])
-   [PostgreSQL Dialect] `Alter table add constraint postgres` をサポート (#4116 by [Griffio][griffio])
-   [PostgreSQL Dialect] `Alter table add constraint check` をサポート (#4120 by [Griffio][griffio])
-   [PostgreSQL Dialect] `postgreSql character length functions` を追加 (#4121 by [Griffio][griffio])
-   [PostgreSQL Dialect] `postgreSql column default interval` を追加 (#4142 by [Griffio][griffio])
-   [PostgreSQL Dialect] `postgreSql interval column result` を追加 (#4152 by [Griffio][griffio])
-   [PostgreSQL Dialect] `postgreSql Alter Column` を追加 (#4165 by [Griffio][griffio])
-   [PostgreSQL Dialect] PostgreSQL: `date_part` を追加 (#4198 by [Philip Wedemann][hfhbd])
-   [MySQL Dialect] `sql char length functions` を追加 (#4134 by [Griffio][griffio])
-   [IDE Plugin] `sqldelight directory suggestions` を追加 (#3976 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] プロジェクトツリー (`project tree`) のミドルパッケージ (`middle packages`) を圧縮 (`Compact`) (#3992 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `join clause completion` を追加 (#4086 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `Create view intention` と `live template` を追加 (#4074 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `DELETE` または `UPDATE` 内の `WHERE` 句の欠落 (`missing WHERE`) について警告 (`Warn`) (#4058 by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] 型安全なプロジェクトアクセッサ (`typesafe project accessors`) を有効化 (`Enable`) (#4005 by [Philip Wedemann][hfhbd])

### 変更
-   [Gradle Plugin] `ServiceLoader` メカニズムによる `VerifyMigrationTask` への `DriverInitializer` の登録 (`registering DriverInitializer`) を許可 (#3986 by [Alex Doubov][C2H6O])
-   [Gradle Plugin] 明示的なコンパイラ環境 (`explicit compiler env`) を作成 (#4079 by [Philip Wedemann][hfhbd])
-   [JS Driver] `web worker driver` を別のアーティファクト (`separate artifact`) に分割 (`Split`)
-   [JS Driver] `JsWorkerSqlCursor` を公開しない (`Don't expose`) ように修正 (#3874 by [Philip Wedemann][hfhbd])
-   [JS Driver] `sqljs driver` の公開 (`publication`) を無効化 (`Disable`) (#4108)
-   [Runtime] 同期ドライバー (`synchronous drivers`) が同期スキーマ初期化子 (`synchronous schema initializer`) を必要とすることを強制 (`Enforce`) (#4013)
-   [Runtime] カーソル (`Cursors`) の非同期サポート (`async support`) を改善 (#4102)
-   [Runtime] 非推奨のターゲット (`deprecated targets`) を削除 (#4149 by [Philip Wedemann][hfhbd])
-   [Runtime] 古い `MM` のサポートを削除 (#4148 by [Philip Wedemann][hfhbd])

### 修正
-   [R2DBC Driver] `R2DBC`: ドライバーのクローズ (`closing the driver`) を待機 (`Await`) するように修正 (#4139 by [Philip Wedemann][hfhbd])
-   [Compiler] `database create(SqlDriver)` にマイグレーションからの `PRAGMAs` を含めるように修正 (#3845 by [Marius Volkhart][MariusV])
-   [Compiler] `RETURNING` 句のコード生成 (`codegen`) を修正 (#3872 by [Marius Volkhart][MariusV])
-   [Compiler] 仮想テーブル (`virtual tables`) の型を生成しない (`Dont generate types`) ように修正 (#4015)
-   [Gradle Plugin] 小規模な `Gradle plugin QoL improvements` を修正 (#3930 by [Zac Sweers][zacsweers])
-   [IDE Plugin] 未解決の Kotlin 型 (`unresolved kotlin types`) を修正 (#3924 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] ワイルドカード展開インテンション (`expand wildcard intention`) がクオリファイア (`qualifier`) で機能するように修正 (#3979 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `java home` が欠落している場合、利用可能な `jdk` を使用するように修正 (#3925 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] パッケージ名 (`package names`) に対する使用箇所の検索 (`find usages`) を修正 (#4010)
-   [IDE Plugin] 無効な要素 (`invalid elements`) に対して自動インポート (`auto imports`) を表示しないように修正 (#4008)
-   [IDE Plugin] ダイアレクトが欠落している場合、解決しない (`Do not resolve if a dialect is missing`) ように修正 (#4009)
-   [IDE Plugin] 無効な状態 (`invalidated state`) でのコンパイラの `IDE` 実行を無視 (`Ignore IDE runs of the compiler`) (#4016)
-   [IDE Plugin] `IntelliJ 2023.1` のサポートを追加 (#4037 by [Madis Pink][madisp])
-   [IDE Plugin] 列名 (`column rename`) の名前変更時に名前付き引数 (`named argument`) の使用を名前変更するように修正 (#4027 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] マイグレーション追加ポップアップ (`add migration popup`) を修正 (#4105 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] マイグレーションファイル (`migration files`) での `SchemaNeedsMigrationInspection` を無効化 (`Disable`) (#4106 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 型名 (`type name`) の代わりに `sql column name` をマイグレーション生成 (`migration generation`) に使用するように修正 (#4112 by [Alexander Perfilyev][aperfilyev])

## [2.0.0-alpha05] - 2023-01-20

### 追加
-   [Paging] マルチプラットフォームページング拡張 (`Multiplatform paging extension`) (by [Jeff Lockhart][jeffdgr8])
-   [Runtime] `Listener` インターフェースに `fun` 修飾子 (`fun modifier`) を追加。
-   [SQLite Dialect] `SQLite 3.33` サポート (`UPDATE FROM`) を追加 (by [Eliezer Graber][eygraber])
-   [PostgreSQL Dialect] Postgres で `UPDATE FROM` をサポート (by [Eliezer Graber][eygraber])

### 変更
-   [RDBC Driver] 接続 (`connection`) を公開 (`Expose`) (by [Philip Wedemann][hfhbd])
-   [Runtime] マイグレーションコールバック (`migration callbacks`) をメインの `migrate` 関数に移動 (`Move migration callbacks into main migrate fun`)
-   [Gradle Plugin] ダウンストリームプロジェクト (`downstream projects`) から設定 (`Configurations`) を非表示 (`Hide`) に
-   [Gradle Plugin] `IntelliJ` のみをシェード (`Only shade Intellij`) するように変更 (by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] `Kotlin 1.8.0-Beta` をサポートし、マルチバージョン `Kotlin` テスト (`multi version Kotlin test`) を追加 (by [Philip Wedemann][hfhbd])

### 修正
-   [RDBC Driver] `javaObjectType` を使用するように変更 (by [Philip Wedemann][hfhbd])
-   [RDBC Driver] `bindStatement` におけるプリミティブな `NULL` 値 (`primitive null values`) を修正 (by [Philip Wedemann][hfhbd])
-   [RDBC Driver] `R2DBC 1.0` をサポート (by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] Postgres: 型パラメータなしの配列 (`Array without type parameter`) を修正 (by [Philip Wedemann][hfhbd])
-   [IDE Plugin] `intellij` を `221.6008.13` にバンプ (`Bump intellij to 221.6008.13`) (by [Philip Wedemann][hfhbd])
-   [Compiler] 純粋なビュー (`pure views`) からの再帰的な `origin table` を解決 (`Resolve recursive origin table`) (by [Philip Wedemann][hfhbd])
-   [Compiler] テーブル外部キー句 (`table foreign key clause`) から値クラス (`value classes`) を使用 (`Use value classes from table foreign key clause`) (by [Philip Wedemann][hfhbd])
-   [Compiler] `SelectQueryGenerator` が括弧なしのバインド式 (`bind expression without parenthesis`) をサポートするように修正 (by [Doogie Min][bellatoris])
-   [Compiler] トランザクション使用時に `${name}Indexes` 変数の重複生成 (`duplicate generation`) を修正 (by [Andreas Sacher][sachera])

## [1.5.5] - 2023-01-20

これは Kotlin 1.8 および IntelliJ 2021+ に対応した互換性リリースで、JDK 17 をサポートします。

## [1.5.4] - 2022-10-06

これは Kotlin 1.7.20 および AGP 7.3.0 に対応した互換性アップデートです。

## [2.0.0-alpha04] - 2022-10-03

### 破壊的変更点

-   Paging 3 拡張 `API` は変更され、カウント (`count`) の `int` 型のみが許可されるようになりました。
-   コルーチン拡張 (`coroutines extension`) は、デフォルトではなくディスパッチャ (`dispatcher`) を渡すことが必須になりました。
-   ダイアレクト (`Dialect`) およびドライバー (`Driver`) クラスは `final` になりました。代わりに委譲 (`delegation`) を使用してください。

### 追加
-   [HSQL Dialect] `Hsql`: `Insert` で生成された列 (`generated columns`) に `DEFAULT` を使用することをサポート (#3372 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQL: `INSERT` で生成された列 (`generated columns`) に `DEFAULT` を使用することをサポート (#3373 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQL に `NOW()` を追加 (#3403 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] PostgreSQL に `NOT` 演算子 (`operator`) を追加 (#3504 by [Philip Wedemann][hfhbd])
-   [Paging] `*QueryPagingSource` に `CoroutineContext` を渡せるように許可 (#3384)
-   [Gradle Plugin] ダイアレクト (`dialects`) のバージョンカタログ (`version catalog`) サポートを改善 (#3435)
-   [Native Driver] `NativeSqliteDriver` の `DatabaseConfiguration` 作成にフック (`hook into`) するコールバック (`callback`) を追加 (#3512 by [Sven Jacobs][svenjacobs])

### 変更
-   [Paging] `KeyedQueryPagingSource` に裏打ちされた `QueryPagingSource` 関数にデフォルトディスパッチャ (`default dispatcher`) を追加 (#3385)
-   [Paging] `OffsetQueryPagingSource` が `Int` でのみ動作するように変更 (#3386)
-   [Async Runtime] `await*` を上位クラス `ExecutableQuery` に移動 (#3524 by [Philip Wedemann][hfhbd])
-   [Coroutines Extensions] `flow` 拡張のデフォルトパラメータ (`default params`) を削除 (#3489)

### 修正
-   [Gradle Plugin] Kotlin `1.7.20` にアップデート (#3542 by [Zac Sweers][zacsweers])
-   [R2DBC Driver] 常に値を送信しない `R2DBC changes` を採用 (#3525 by [Philip Wedemann][hfhbd])
-   [HSQL Dialect] `Hsql` で `sqlite VerifyMigrationTask` が失敗する問題を修正 (#3380 by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] タスクをレイジー設定 `API` (`lazy configuration API`) を使用するように変換 (by [Matthew Haughton][3flex])
-   [Gradle Plugin] Kotlin `1.7.20` での `NPEs` を回避 (#3398 by [Zac Sweers][ZacSweers])
-   [Gradle Plugin] `squash migrations task` の説明 (`description`) を修正 (#3449)
-   [IDE Plugin] 新しい `Kotlin` プラグインでの `NoSuchFieldError` を修正 (#3422 by [Madis Pink][madisp])
-   [IDE Plugin] IDEA: `UnusedQueryInspection` - `ArrayIndexOutOfBoundsException` を修正 (#3427 by [Niklas Baudy][vanniktech])
-   [IDE Plugin] 古い `kotlin` プラグインの参照にリフレクション (`reflection`) を使用
-   [Compiler] 拡張関数 (`extension function`) を持つカスタムダイアレクト (`Custom dialect`) がインポート (`imports`) を作成しない問題を修正 (#3338 by [Philip Wedemann][hfhbd])
-   [Compiler] `CodeBlock.of("${CodeBlock.toString()}")` のエスケープ (`escaping`) を修正 (#3340 by [Philip Wedemann][hfhbd])
-   [Compiler] マイグレーション (`migrations`) で非同期実行ステートメント (`async execute statements`) を待機 (`Await`) するように修正 (#3352)
-   [Compiler] `AS` を修正 (#3370 by [Philip Wedemann][hfhbd])
-   [Compiler] `getObject` メソッドが実際の型の自動埋め込み (`automatic filling of the actual type`) をサポートするように修正 (#3401 by [Rob X][robx])
-   [Compiler] 非同期グループ化 `returning` ステートメント (`async grouped returning statements`) のコード生成 (`codegen`) を修正 (#3411)
-   [Compiler] 可能であればバインドパラメータ (`bind parameter`) の `Kotlin` 型を推論 (`Infer the Kotlin type`) し、そうでなければより良いエラーメッセージ (`better error message`) で失敗するように修正 (#3413 by [Philip Wedemann][hfhbd])
-   [Compiler] `ABS("foo")` を許可しないように修正 (#3430 by [Philip Wedemann][hfhbd])
-   [Compiler] 他のパラメータから `kotlin type` を推論 (`inferring kotlin type`) するサポートを追加 (#3431 by [Philip Wedemann][hfhbd])
-   [Compiler] 常にデータベースの実装 (`database implementation`) を作成するように修正 (#3540 by [Philip Wedemann][hfhbd])
-   [Compiler] `javaDoc` を緩和し、カスタムマッパー関数 (`custom mapper function`) にも追加するように修正 (#3554 [Philip Wedemann][hfhbd])
-   [Compiler] バインディング (`binding`) の `DEFAULT` を修正 (by [Philip Wedemann][hfhbd])
-   [Paging] Paging 3 を修正 (#3396)
-   [Paging] `OffsetQueryPagingSource` を `Long` で構築できるように許可 (#3409)
-   [Paging] `Dispatchers.Main` を静的にスワップ (`statically swap`) しないように修正 (#3428)

## [2.0.0-alpha03] - 2022-06-17

### 破壊的変更点

-   ダイアレクトは実際の Gradle 依存関係 (`actual gradle dependencies`) として参照 (`references`) されるようになりました。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
-   `AfterVersionWithDriver` 型は削除され、常にドライバーを持つ `AfterVersion` が代わりに利用されるようになりました。
-   `Schema` 型はもはや `SqlDriver` のサブタイプ (`subtype`) ではありません。
-   `PreparedStatement` `API` は、`0` ベースのインデックス (`zero-based indexes`) で呼び出されるようになりました。

### 追加
-   [IDE Plugin] 実行中のデータベースに対して `SQLite`、`MySQL`、および `PostgreSQL` コマンドを実行するサポートを追加 (#2718 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `Android Studio DB inspector` のサポートを追加 (#3107 by [Alexander Perfilyev][aperfilyev])
-   [Runtime] 非同期ドライバー (`async drivers`) のサポートを追加 (#3168 by [Derek Ellis][dellisd])
-   [Native Driver] 新しい `kotlin native memory model` をサポート (#3177 by [Kevin Galligan][kpgalligan])
-   [JS Driver] `SqlJs workers` 用のドライバー (`driver`) を追加 (#3203 by [Derek Ellis][dellisd])
-   [Gradle Plugin] `SQLDelight` タスクのクラスパス (`classpath`) を公開 (`Expose`)
-   [Gradle Plugin] マイグレーションをスカッシュ (`squashing migrations`) するための `gradle task` を追加
-   [Gradle Plugin] マイグレーションチェック (`migration checks`) 中にスキーマ定義 (`schema definitions`) を無視 (`ignore`) するフラグ (`flag`) を追加
-   [MySQL Dialect] MySQL で `FOR SHARE` と `FOR UPDATE` をサポート (#3098)
-   [MySQL Dialect] MySQL のインデックスヒント (`index hints`) をサポート (#3099)
-   [PostgreSQL Dialect] `date_trunc` を追加 (#3295 by [Philip Wedemann][hfhbd])
-   [JSON Extensions] `JSON table functions` をサポート (#3090)

### 変更
-   [Runtime] ドライバーなしの `AfterVersion` 型を削除 (#3091)
-   [Runtime] `Schema` 型をトップレベル (`top-level`) に移動
-   [Runtime] サードパーティの実装 (`3rd party implementations`) をサポートするためにダイアレクト (`dialect`) とリゾルバー (`resolver`) を公開 (`Open`) (#3232 by [Philip Wedemann][hfhbd])
-   [Compiler] 失敗レポート (`failure reports`) にコンパイル (`compile`) に使用されたダイアレクト (`dialect`) を含める (`Include`) ように変更 (#3086)
-   [Compiler] 未使用のアダプター (`unused adapters`) をスキップ (`Skip`) (#3162 by [Eliezer Graber][eygraber])
-   [Compiler] `PrepareStatement` で `0` ベースのインデックス (`zero based index`) を使用するように変更 (#3269 by [Philip Wedemann][hfhbd])
-   [Gradle Plugin] ダイアレクト (`dialect`) も文字列 (`string`) ではなく、適切な `gradle` 依存関係 (`proper gradle dependency`) にする (`make the dialect a proper gradle dependency`) ように変更 (#3085)
-   [Gradle Plugin] Gradle Verify Task: データベースファイルが欠落 (`missing database file`) している場合にエラーをスロー (`Throw when missing database file`) するように修正 (#3126 by [Niklas Baudy][vanniktech])

### 修正
-   [Gradle Plugin] Gradle プラグインの軽微なクリーンアップと調整 (`Minor cleanups and tweaks`) を修正 (#3171 by [Matthew Haughton][3flex])
-   [Gradle Plugin] 生成されたディレクトリ (`generated directory`) に `AGP` 文字列を使用しないように変更
-   [Gradle Plugin] `AGP namespace attribute` を使用するように修正 (#3220)
-   [Gradle Plugin] `kotlin-stdlib` を Gradle プラグインのランタイム依存関係 (`runtime dependency`) として追加しないように修正 (#3245 by [Martin Bonnin][mbonnin])
-   [Gradle Plugin] マルチプラットフォーム設定 (`multiplatform configuration`) を簡素化 (`Simplify`) (#3246 by [Martin Bonnin][mbonnin])
-   [Gradle Plugin] `js only projects` をサポート (#3310 by [Philip Wedemann][hfhbd])
-   [IDE Plugin] `gradle tooling API` に `java home` を使用するように修正 (#3078)
-   [IDE Plugin] `IDE` プラグイン内で `JDBC` ドライバーを正しい `classLoader` にロード (`Load the JDBC driver on the correct classLoader`) するように修正 (#3080)
-   [IDE Plugin] 既存の `PSI` 変更中 (`already existing PSI changes`) のエラーを避けるため、無効化 (`invalidating`) する前にファイル要素 (`file element`) を `null` としてマーク (`Mark the file element as null`) するように修正 (#3082)
-   [IDE Plugin] `ALTER TABLE` ステートメントで新しいテーブル名 (`new table name`) の使用箇所を検索 (`finding usages`) する際にクラッシュしないように修正 (#3106)
-   [IDE Plugin] インスペクター (`inspectors`) を最適化し、予期される例外タイプ (`expected exception types`) に対してサイレントに失敗 (`fail silently`) できるように有効化 (`enable them to fail silently`) (#3121)
-   [IDE Plugin] 生成されるべきディレクトリ (`generated directories`) であるファイルを削除 (`Delete files`) するように修正 (#3198)
-   [IDE Plugin] `not-safe operator call` を修正
-   [Compiler] `RETURNING` ステートメントを持つ更新 (`updates`) と削除 (`deletes`) がクエリを実行 (`execute queries`) するように保証 (#3084)
-   [Compiler] 複合 `SELECT` で引数型 (`argument types`) を正しく推論 (`Correctly infer`) するように修正 (#3096)
-   [Compiler] 共通テーブル (`Common tables`) はデータクラス (`data classes`) を生成しないため、それらを返さないように修正 (#3097)
-   [Compiler] 最上位のマイグレーションファイル (`top migration file`) をより速く見つける (`Find the top migration file faster`) ように修正 (#3108)
-   [Compiler] パイプ演算子 (`pipe operator`) で `null` 許容性 (`nullability`) を適切に継承 (`Properly inherit`)
-   [Compiler] `iif ANSI SQL function` をサポート
-   [Compiler] 空のクエリファイル (`empty query files`) を生成しない (`Don't generate empty query files`) ように修正 (#3300 by [Philip Wedemann][hfhbd])
-   [Compiler] 疑問符のみのアダプター (`adapter with question mark only`) を修正 (#3314 by [Philip Wedemann][hfhbd])
-   [PostgreSQL Dialect] Postgres の主キー列 (`primary key columns`) は常に `non-null` になるように修正 (#3092)
-   [PostgreSQL Dialect] 複数のテーブルで同じ名前のコピー (`copy with same name`) を修正 (#3297 by [Philip Wedemann][hfhbd])
-   [SQLite 3.35 Dialect] 変更されたテーブル (`altered table`) からインデックス付き列 (`indexed column`) を削除 (`dropping`) する場合にのみエラーを表示するように修正 (#3158 by [Eliezer Graber][eygraber])

## [2.0.0-alpha02] - 2022-04-13

### 破壊的変更点

-   `app.cash.sqldelight.runtime.rx` のすべての出現箇所 (`all occurrences`) を `app.cash.sqldelight.rx2` に置き換える (`replace`) 必要があります。

### 追加
-   [Compiler] グループ化されたステートメント (`grouped statement`) の最後に `returning` をサポート
-   [Compiler] ダイアレクトモジュール (`dialect modules`) によるコンパイラ拡張 (`compiler extensions`) をサポートし、`SQLite JSON` 拡張を追加 (#1379, #2087)
-   [Compiler] 値 (`value`) を返す `PRAGMA` ステートメント (`PRAGMA statements`) をサポート (#1106)
-   [Compiler] マークされた列 (`marked columns`) の値型 (`value types`) 生成をサポート
-   [Compiler] 楽観的ロック (`optimistic locks`) とバリデーション (`validation`) のサポートを追加 (#1952)
-   [Compiler] マルチ更新ステートメント (`multi-update statements`) をサポート
-   [PostgreSQL] `postgres returning statements` をサポート
-   [PostgreSQL] `postgres date types` をサポート
-   [PostgreSQL] `pg intervals` をサポート
-   [PostgreSQL] `PG Booleans` をサポートし、`alter tables` での挿入 (`inserts`) を修正
-   [PostgreSQL] Postgres でのオプションの `LIMIT` をサポート
-   [PostgreSQL] `PG BYTEA type` をサポート
-   [PostgreSQL] `postgres serials` のテストを追加
-   [PostgreSQL] `for update postgres syntax` をサポート
-   [PostgreSQL] `PostgreSQL array types` をサポート
-   [PostgreSQL] `PG` で `UUID` 型を適切に保存/取得 (`Properly store/retrieve UUID types`)
-   [PostgreSQL] `PostgreSQL NUMERIC type` をサポート (#1882)
-   [PostgreSQL] 共通テーブル式 (`common table expressions`) 内の `returning queries` をサポート (#2471)
-   [PostgreSQL] `json specific operators` をサポート
-   [PostgreSQL] `Postgres Copy` を追加 (by [Philip Wedemann][hfhbd])
-   [MySQL] `MySQL Replace` をサポート
-   [MySQL] `NUMERIC/BigDecimal MySQL types` をサポート (#2051)
-   [MySQL] `MySQL truncate statement` をサポート
-   [MySQL] `Mysql` で `json specific operators` をサポート (by [Eliezer Graber][eygraber])
-   [MySQL] `MySql INTERVAL` をサポート (#2969 by [Eliezer Graber][eygraber])
-   [HSQL] `HSQL Window functionality` を追加
-   [SQLite] `WHERE` 句で `nullable parameters` の等価チェック (`equality checks`) を置き換えない (`Don't replace`) ように修正 (#1490 by [Eliezer Graber][eygraber])
-   [SQLite] `Sqlite 3.35 returning statements` をサポート (#1490 by [Eliezer Graber][eygraber])
-   [SQLite] `GENERATED` 句をサポート
-   [SQLite] `Sqlite 3.38 dialect` のサポートを追加 (by [Eliezer Graber][eygraber])

### 変更
-   [Compiler] 生成されたコード (`generated code`) を少しクリーンアップ (`Clean up`)
-   [Compiler] グループ化されたステートメント (`grouped statements`) でのテーブルパラメータ (`table parameters`) の使用を禁止 (`Forbid usage`) (#1822)
-   [Compiler] グループ化されたクエリ (`grouped queries`) をトランザクション内 (`inside a transaction`) に入れるように変更 (#2785)
-   [Runtime] ドライバーの `execute` メソッドから更新された行数 (`updated row count`) を返すように変更
-   [Runtime] `SqlCursor` を接続にアクセスするクリティカルセクション (`critical section accessing the connection`) に限定 (`Confine`) するように変更 (#2123 by [Anders Ha][andersio])
-   [Gradle Plugin] マイグレーション (`migrations`) のスキーマ定義 (`schema definitions`) を比較 (`Compare`) するように変更 (#841)
-   [PostgreSQL] `PG` での二重引用符 (`double quotes`) を禁止 (`Disallow`) するように変更
-   [MySQL] `MySQL` での `==` の使用時にエラーを出す (`Error on usage of ==`) ように変更 (#2673)

### 修正
-   [Compiler] `2.0 alpha` で異なるテーブルからの同じアダプター型 (`Same adapter type from different tables`) がコンパイルエラー (`compilation error`) を引き起こす問題を修正
-   [Compiler] `upsert` ステートメント (`upsert statement`) のコンパイル問題 (`Problem compiling`) (#2791)
-   [Compiler] 複数の一致 (`multiple matches`) がある場合、クエリ結果 (`Query result`) が `SELECT` 内のテーブル (`tables in the select`) を使用するように修正 (#1874, #2313)
-   [Compiler] `INSTEAD OF` トリガー (`trigger`) を持つビュー (`view`) の更新をサポート (#1018)
-   [Compiler] 関数名 (`function names`) における `from` と `for` のサポート
-   [Compiler] 関数式 (`function expressions`) における `SEPARATOR` キーワードを許可
-   [Compiler] `ORDER BY` でエイリアス化されたテーブル (`aliased table`) の `ROWID` にアクセスできない問題を修正
-   [Compiler] `MySQL` の `HAVING` 句でエイリアス化された列名 (`aliased column name`) が認識されない問題を修正
-   [Compiler] 誤った「`Multiple columns found`」エラーを修正
-   [Compiler] `PRAGMA locking_mode = EXCLUSIVE;` を設定できない問題を修正
-   [PostgreSQL] `Postgresql rename column` を修正
-   [MySQL] `UNIX_TIMESTAMP`、`TO_SECONDS`、`JSON_ARRAYAGG MySQL functions` が認識されない問題を修正
-   [SQLite] `SQLite window functionality` を修正
-   [IDE Plugin] 空のプログレスインジケータ (`empty progress indicator`) で `goto handler` を実行するように修正 (#2990)
-   [IDE Plugin] プロジェクトが設定されていない場合 (`project isnt configured`)、ハイライトビジター (`highlight visitor`) が実行されないように保証 (#2981, #2976)
-   [IDE Plugin] `IDE` で推移的に生成されたコード (`transitive generated code`) も更新されるように保証 (#1837)
-   [IDE Plugin] ダイアレクト (`dialect`) 更新時にインデックス (`indexes`) を無効化 (`Invalidate`)

## [2.0.0-alpha01] - 2022-03-31

これは `2.0` の最初のアルファリリースであり、いくつかの破壊的変更 (`breaking changes`) が含まれています。今後も `ABI` の破壊的変更が予想されるため、このリリースに依存するライブラリは公開しないでください（アプリケーションは問題ありません）。

### 破壊的変更点

-   まず、`com.squareup.sqldelight` のすべての出現箇所 (`all occurrences`) を `app.cash.sqldelight` に置き換える (`replace`) 必要があります。
-   第二に、`app.cash.sqldelight.android` のすべての出現箇所を `app.cash.sqldelight.driver.android` に置き換える必要があります。
-   第三に、`app.cash.sqldelight.sqlite.driver` のすべての出現箇所を `app.cash.sqldelight.driver.jdbc.sqlite` に置き換える必要があります。
-   第四に、`app.cash.sqldelight.drivers.native` のすべての出現箇所を `app.cash.sqldelight.driver.native` に置き換える必要があります。
-   `IDE` プラグインは、[アルファまたは `EAP` チャンネル](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)で利用可能な `2.X` バージョンに更新 (`updated`) する必要があります。
-   ダイアレクト (`Dialects`) は、Gradle 内で指定 (`specify`) できる依存関係 (`dependencies`) になりました。

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

現在サポートされているダイアレクトは、`mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、`sqlite-3-35-dialect` です。

-   プリミティブ型 (`Primitive types`) はインポート (`imported`) が必要になりました（例：`INTEGER AS Boolean` は `import kotlin.Boolean` が必要）。以前サポートされていた型の中にはアダプター (`adapter`) が必要なものもあります。ほとんどの変換（`IntColumnAdapter` のような変換）に対応するプリミティブアダプター (`Primitive adapters`) は、`app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` で利用可能です。

### 追加
-   [IDE Plugin] 基本的な推奨マイグレーション (`Basic suggested migration`) (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インポートヒントアクション (`import hint action`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `kotlin class completion` を追加 (by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] `Gradle type safe project accessors` のショートカット (`shortcut`) を追加 (by [Philip Wedemann][hfhbd])
-   [Compiler] ダイアレクト (`dialect`) に基づいてコード生成 (`codegen`) をカスタマイズ (`Customize`) (by [Marius Volkhart][MariusV])
-   [JDBC Driver] `JdbcDriver` に共通型 (`common types`) を追加 (by [Marius Volkhart][MariusV])
-   [SQLite] `sqlite 3.35` のサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] `ALTER TABLE DROP COLUMN` のサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] `Sqlite 3.30 dialect` のサポートを追加 (by [Eliezer Graber][eygraber])
-   [SQLite] `sqlite` で `NULLS FIRST/LAST` をサポート (by [Eliezer Graber][eygraber])
-   [HSQL] 生成された句 (`generated clause`) の `HSQL` サポートを追加 (by [Marius Volkhart][MariusV])
-   [HSQL] `HSQL` での名前付きパラメータ (`named parameters`) のサポートを追加 (by [Marius Volkhart][MariusV])
-   [HSQL] `HSQL insert query` をカスタマイズ (`Customize`) (by [Marius Volkhart][MariusV])

### 変更
-   [Everything] パッケージ名 (`Package name`) が `com.squareup.sqldelight` から `app.cash.sqldelight` に変更されました。
-   [Runtime] ダイアレクト (`dialects`) を独自の隔離された `gradle modules` に移動 (`Move`)
-   [Runtime] ドライバーによって実装されるクエリ通知 (`driver-implemented query notifications`) に切り替え (`Switch`)。
-   [Runtime] デフォルトの列アダプター (`default column adapters`) を別のモジュール (`separate module`) に抽出 (`Extract`) (#2056, #2060)
-   [Compiler] 各モジュールで再実行 (`redoing`) する代わりに、モジュールがクエリ実装 (`queries implementations`) を生成 (`generate`) するように変更
-   [Compiler] 生成されたデータクラス (`generated data classes`) のカスタム `toString` 生成を削除 (by [Paul Woitaschek][PaulWoitaschek])
-   [JS Driver] `sql.js` 依存関係 (`dependency`) を `sqljs-driver` から削除 (by [Derek Ellis][dellisd])
-   [Paging] `android paging 2 extension` を削除
-   [IDE Plugin] `SQLDelight` が同期中 (`syncing`) にエディタバナー (`editor banner`) を追加 (#2511)
-   [IDE Plugin] サポートされる `IntelliJ` の最小バージョン (`Minimum supported IntelliJ version`) は `2021.1` になりました。

### 修正
-   [Runtime] リスナリスト (`listener list`) をフラット化 (`Flatten`) し、割り当て (`allocations`) とポインタチェイス (`pointer chasing`) を削減 (by [Anders Ha][andersio])
-   [IDE Plugin] エラーメッセージ (`error message`) を修正し、エラー箇所にジャンプ (`jumping to error`) できるように修正 (by [Philip Wedemann][hfhbd])
-   [IDE Plugin] 欠落しているインスペクションの説明 (`missing inspection descriptions`) を追加 (#2768 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `GotoDeclarationHandler` での例外 (`exception`) を修正 (#2531, #2688, #2804 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `import` キーワードをハイライト表示 (`Highlight import keyword`) (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未解決の `kotlin types` を修正 (#1678 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未解決のパッケージ (`unresolved package`) のハイライト (`highlighting`) を修正 (#2543 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] プロジェクトインデックス (`project index`) がまだ初期化されていない場合 (`not yet initialized`)、不一致の列 (`mismatched columns`) の検査 (`inspect`) を試みない (`Dont attempt`) ように修正
-   [IDE Plugin] `gradle sync` が発生するまでファイルインデックス (`file index`) を初期化 (`initialize`) しないように修正
-   [IDE Plugin] `gradle sync` が開始された場合、`SQLDelight` のインポート (`import`) をキャンセル (`Cancel`) するように修正
-   [IDE Plugin] 元に戻すアクション (`undo action`) が実行されたスレッドの外 (`outside of the thread`) でデータベース (`database`) を再生成 (`Regenerate`) するように修正
-   [IDE Plugin] 参照 (`reference`) が解決できない場合 (`cannot be resolves`)、空の `java type` を使用 (`use a blank java type`) するように修正
-   [IDE Plugin] ファイル解析 (`file parsing`) 中にメインスレッド (`main thread`) から適切に移動 (`Correctly move off`) し、書き込み時 (`write`) のみメインスレッドに戻る (`move back on`) ように修正
-   [IDE Plugin] 古い `IntelliJ` バージョンとの互換性 (`compatibility`) を改善 (by [Matthew Haughton][3flex])
-   [IDE Plugin] 高速なアノテーション `API` (`faster annotation API`) を使用
-   [Gradle Plugin] ランタイム (`runtime`) 追加時に `js/android` プラグインを明示的にサポート (`Explicitly support`) (by [Zac Sweers][ZacSweers])
-   [Gradle Plugin] マイグレーション (`migrations`) からスキーマ (`schemas`) を導出 (`derviving`) せずにマイグレーション出力タスク (`migration output task`) を登録 (`Register`) するように修正 (#2744 by [Kevin Cianfarini][kevincianfarini])
-   [Gradle Plugin] マイグレーションタスク (`migration task`) がクラッシュ (`crashes`) した場合、クラッシュしたファイル (`file it crashed running`) をログに出力 (`print the file it crashed running`) するように修正
-   [Gradle Plugin] コード生成 (`generating code`) 時にファイルをソート (`Sort files`) し、出力が冪等 (`idempotent outputs`) であることを保証 (by [Zac Sweers][ZacSweers])
-   [Compiler] ファイルを反復処理 (`iterating files`) するための高速な `API` (`faster APIs`) を使用し、`PSI` グラフ全体 (`entire PSI graph`) を探索 (`explore`) しないように修正
-   [Compiler] `select function parameters` にキーワードマングリング (`keyword mangling`) を追加 (#2759 by [Alexander Perfilyev][aperfilyev])
-   [Compiler] マイグレーションアダプター (`migration adapter`) の `packageName` を修正 (by [Philip Wedemann][hfhbd])
-   [Compiler] 型 (`types`) の代わりにプロパティ (`properties`) にアノテーション (`annotations`) を出力 (`Emit`) するように修正 (#2798 by [Alexander Perfilyev][aperfilyev])
-   [Compiler] `Query subtype` に渡す前に引数をソート (`Sort arguments`) するように修正 (#2379 by [Alexander Perfilyev][aperfilyev])

## [1.5.3] - 2021-11-23

### 追加
-   [JDBC Driver] サードパーティドライバー実装 (`3rd party driver implementations`) のために `JdbcDriver` を公開 (`Open`) (#2672 by [Philip Wedemann][hfhbd])
-   [MySQL Dialect] 時間増分 (`time increments`) 用の不足している関数 (`missing functions`) を追加 (#2671 by [Sam Doward][sdoward])
-   [Coroutines Extension] コルーチン拡張 (`coroutines-extensions`) に `M1` ターゲット (`M1 targets`) を追加 (by [Philip Dukhov][PhilipDukhov])

### 変更
-   [Paging3 Extension] `sqldelight-android-paging3` を `AAR` ではなく `JAR` として配布 (`Distribute`) するように変更 (#2634 by [Marco Romano][julioromano])
-   ソフトキーワードでもあるプロパティ名 (`Property names which are also soft keywords`) にはアンダースコア (`underscores`) がサフィックスとして追加されるようになりました。例えば、`value` は `value_` として公開されます。

### 修正
-   [Compiler] 重複する配列パラメータ (`duplicate array parameters`) の変数 (`variables`) を抽出しない (`Don't extract`) ように修正 (by [Alexander Perfilyev][aperfilyev])
-   [Gradle Plugin] `kotlin.mpp.enableCompatibilityMetadataVariant` を追加 (#2628 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] 使用箇所の検索 (`Find usages`) 処理には読み取りアクション (`read action`) が必要

## [1.5.2] - 2021-10-12

### 追加
-   [Gradle Plugin] `HMPP` サポート (#2548 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] `NULL` 比較インスペクション (`NULL comparison inspection`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インスペクションサプレッサー (`inspection suppressor`) を追加 (#2519 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 混合された名前付き/位置パラメータインスペクション (`Mixed named and positional parameters inspection`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [SQLite Driver] `mingwX86` ターゲットを追加 (#2558 by [Nikita Kozhemyakin][enginegl])
-   [SQLite Driver] `M1` ターゲットを追加
-   [SQLite Driver] `linuxX64` サポートを追加 (#2456 by [Cedric Hippmann][chippmann])
-   [MySQL Dialect] `MySQL` に `ROW_COUNT` 関数を追加 (#2523)
-   [PostgreSQL Dialect] postgres の列名変更 (`rename`)、列削除 (`drop column`) をサポート (by [Juan Liska][pabl0rg])
-   [PostgreSQL Dialect] `PostgreSQL` 文法が `CITEXT` を認識しない問題を修正
-   [PostgreSQL Dialect] `TIMESTAMP WITH TIME ZONE` と `TIMESTAMPTZ` を含める
-   [PostgreSQL Dialect] `PostgreSQL GENERATED columns` の文法 (`grammar`) を追加
-   [Runtime] `SqlDriver` を `AfterVersion` のパラメータとして提供 (#2534, 2614 by [Ahmed El-Helw][ahmedre])

### 変更
-   [Gradle Plugin] Gradle `7.0` を明示的に要求 (`explicitly require`) するように変更 (#2572 by [Martin Bonnin][martinbonnin])
-   [Gradle Plugin] `VerifyMigrationTask` が `Gradle` の最新チェック (`up-to-date checks`) をサポートするように変更 (#2533 by [Matthew Haughton][3flex])
-   [IDE Plugin] `null` 許容型 (`nullable type`) と非 `null` 許容型 (`non-nullable type`) を結合する際に、「`Join compares two columns of different types`」という警告を出さないように修正 (#2550 by [Piotr Chmielowski][pchmielowski])
-   [IDE Plugin] 列型 (`column type`) の小文字の「`as`」に対するエラーを明確化 (`Clarify the error`) (by [Alexander Perfilyev][aperfilyev])

### 修正
-   [IDE Plugin] プロジェクトがすでに破棄されている場合 (`project is already disposed`)、新しいダイアレクト (`new dialect`) で再解析 (`reparse`) しないように修正 (#2609)
-   [IDE Plugin] 関連する仮想ファイル (`associated virtual file`) が `null` の場合、モジュール (`module`) も `null` となるように修正 (#2607)
-   [IDE Plugin] 未使用クエリの検査 (`unused query inspection`) 中にクラッシュしないように回避 (`Avoid crashing`) (#2610)
-   [IDE Plugin] データベース同期書き込み (`database sync write`) を書き込みアクション (`write action`) 内で実行するように修正 (#2605)
-   [IDE Plugin] `IDE` が `SQLDelight` の同期 (`syncronization`) をスケジュール (`schedule`) するように変更
-   [IDE Plugin] `JavaTypeMixin` の `npe` を修正 (#2603 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `MismatchJoinColumnInspection` の `IndexOutOfBoundsException` を修正 (#2602 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `UnusedColumnInspection` の説明 (`description`) を追加 (#2600 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `PsiElement.generatedVirtualFiles` を読み取りアクション (`read action`) でラップ (`Wrap`) するように修正 (#2599 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 不要な `nonnull` キャスト (`cast`) を削除 (#2596)
-   [IDE Plugin] 使用箇所の検索 (`find usages`) で `null` を適切に処理するように修正 (#2595)
-   [IDE Plugin] `Android` 向けの生成されたファイル (`generated files`) の `IDE` 自動補完 (`autocomplete`) を修正 (#2573 by [Martin Bonnin][martinbonnin])
-   [IDE Plugin] `SqlDelightGotoDeclarationHandler` の `npe` を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `INSERT` ステートメント内の引数で `Kotlin` キーワードをマングリング (`Mangle kotlin keywords`) するように修正 (#2433 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `SqlDelightFoldingBuilder` の `npe` を修正 (#2382 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `CopyPasteProcessor` での `ClassCastException` をキャッチ (`Catch`) するように修正 (#2369 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] ライブテンプレート (`live template`) の更新を修正 (by [Ilias Redissi][IliasRedissi])
-   [IDE Plugin] インテンションアクション (`intention actions`) に説明 (`descriptions`) を追加 (#2489 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] テーブルが見つからない場合 (`table is not found`) の `CreateTriggerMixin` での例外 (`exception`) を修正 (by [Alexander Perfilyev][aperfilyev])
-   [Compiler] テーブル作成ステートメント (`table creation statemenets`) をトポロジカルにソート (`Topologically sort`)
-   [Compiler] ディレクトリ (`directories`) に対する `forDatabaseFiles` コールバックの呼び出しを停止 (`Stop invoking`) するように修正 (#2532)
-   [Gradle Plugin] `generateDatabaseInterface task` の依存関係 (`dependency`) を潜在的なコンシューマ (`potential consumers`) に伝播 (`Propagate`) するように修正 (#2518 by [Martin Bonnin][martinbonnin])

## [1.5.1] - 2021-07-16

### 追加
-   [PostgreSQL Dialect] `PostgreSQL JSONB` と `ON Conflict Do Nothing` をサポート (by [Andrew Stewart][satook])
-   [PostgreSQL Dialect] `PostgreSQL ON CONFLICT (column, ...) DO UPDATE` のサポートを追加 (by [Andrew Stewart][satook])
-   [MySQL Dialect] `MySQL generated columns` をサポート (by [Jeff Gulbronson][JeffG])
-   [Native Driver] `watchosX64` サポートを追加
-   [IDE Plugin] パラメータ型 (`parameter types`) とアノテーション (`annotations`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 「`select all`」クエリ生成アクション (`query generation action`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 自動補完 (`autocomplete`) に列型 (`column types`) を表示 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 自動補完 (`autocomplete`) にアイコン (`icons`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 主キー (`primary key`) による「`select by primary key`」クエリ生成アクション (`query generation action`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 「`insert into`」クエリ生成アクション (`query generation action`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 列名 (`column names`)、ステートメント識別子 (`stmt identifiers`)、関数名 (`function names`) のハイライト (`highlighting`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 残りのクエリ生成アクション (`remaining query generation actions`) を追加 (#489 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `insert-stmt` からパラメータヒント (`parameter hints`) を表示 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] テーブルエイリアスインテンションアクション (`Table alias intention action`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 列名修飾インテンション (`Qualify column name intention`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `kotlin property` の宣言へ移動 (`Go to declaration`) を追加 (by [Alexander Perfilyev][aperfilyev])

### 変更
-   [Native Driver] フリーズ (`freezing`) と共有可能データ構造 (`shareable data structures`) を可能な限り回避 (`avoiding`) することで、ネイティブトランザクション (`native transaction`) のパフォーマンス (`performance`) を改善 (by [Anders Ha][andersio])
-   [Paging 3] Paging3 バージョンを `3.0.0 stable` にバンプ (`Bump`)
-   [JS Driver] `sql.js` を `1.5.0` にアップグレード

### 修正
-   [JDBC SQLite Driver] `ThreadLocal` をクリアする前に接続 (`connection`) で `close()` を呼び出す (#2444 by [Hannes Struß][hannesstruss])
-   [RX extensions] サブスクリプション/破棄競合リーク (`subscription / disposal race leak`) を修正 (#2403 by [Pierre Yves Ricau][pyricau])
-   [Coroutines extension] 通知 (`notifying`) する前にクエリリスナー (`query listener`) を登録 (`register`) することを保証
-   [Compiler] 一貫した `kotlin output file` を持つよう `notifyQueries` をソート (`Sort notifyQueries`) (by [Jiayu Chen][thomascjy])
-   [Compiler] `select query class properties` に `@JvmField` アノテーションを付けない (`Don't annotate`) (by [Eliezer Graber][eygraber])
-   [IDE Plugin] インポートオプティマイザ (`import optimizer`) を修正 (#2350 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用列の検査 (`unused column inspection`) を修正 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インポート検査 (`import inspection`) とクラスアノテーター (`class annotator`) にネストされたクラス (`nested classes`) のサポートを追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `CopyPasteProcessor` の `npe` を修正 (#2363 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `InlayParameterHintsProvider` でのクラッシュ (`crash`) を修正 (#2359 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `create table stmt` に任意のテキスト (`any text`) をコピーペースト (`copy-pasting`) する際の空白行 (`blank lines`) の挿入 (`insertion`) を修正 (#2431 by [Alexander Perfilyev][aperfilyev])

## [1.5.0] - 2021-04-23

### 追加
-   [SQLite Javascript Driver] `sqljs-driver publication` を有効化 (#1667 by [Derek Ellis][dellisd])
-   [Paging3 Extension] `Android Paging 3 Library` の拡張 (#1786 by [Kevin Cianfarini][kevincianfarini])
-   [MySQL Dialect] `mysql's ON DUPLICATE KEY UPDATE` 競合解決 (`conflict resolution`) のサポートを追加 (by [Ryan Harter][rharter])
-   [SQLite Dialect] `SQLite offsets()` のコンパイラサポート (`compiler support`) を追加 (by [Quinton Roberts][qjroberts])
-   [IDE Plugin] 未知の型 (`unknown type`) のインポートクイックフィックス (`import quick fix`) を追加 (#683 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用インポートの検査 (`unused import inspection`) を追加 (#1161 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用クエリの検査 (`unused query inspection`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] 未使用列の検査 (`unused column inspection`) を追加 (#569 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] コピー/ペースト (`copy/paste`) 時にインポートを自動的に追加 (`Automatically bring imports`) (#684 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `gradle/intellij plugin versions` 間に非互換性 (`incompatibilities`) がある場合にバルーン (`balloon`) を表示
-   [IDE Plugin] `Insert Into ... VALUES(?)` パラメータヒント (`parameter hints`) を追加 (#506 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] インラインパラメータヒント (`Inline parameter hints`) を追加 (by [Alexander Perfilyev][aperfilyev])
-   [Runtime] コールバック (`callbacks`) 付きでマイグレーションを実行 (`running migrations`) するためのランタイム `API` (`API in the runtime`) を含む (#1844)

### 変更
-   [Compiler] 「`IS NOT NULL`」クエリ (`queries`) をスマートキャスト (`Smart cast`) (#867)
-   [Compiler] 実行時に失敗する可能性のあるキーワード (`keywords that will fail at runtime`) から保護 (`Protect against`) (#1471, #1629)
-   [Gradle Plugin] `gradle plugin` のサイズを `60MB` から `13MB` に削減。
-   [Gradle Plugin] `android variants` を適切にサポートし、`KMM target-specific sql` のサポートを削除 (#1039)
-   [Gradle Plugin] `minsdk` に基づいて最小の `sqlite` バージョンを選択 (`Pick a minimum sqlite version based on minsdk`) (#1684)
-   [Native Driver] ネイティブドライバ接続プール (`connection pool`) とパフォーマンス (`performance`) の更新

### 修正
-   [Compiler] ラムダ (`lambdas`) の前の `NBSP` を修正 (by [Benoît Quenaudon][oldergod])
-   [Compiler] 生成された `bind*` および `cursor.get*` ステートメント (`statements`) での互換性のない型 (`incompatible types`) を修正
-   [Compiler] `SQL clause` はアダプトされた型 (`adapted type`) を保持 (`persist`) すべき (#2067)
-   [Compiler] `NULL` キーワードのみの列 (`Column with only NULL keyword`) は `null` 許容であるべき
-   [Compiler] 型アノテーション (`type annotations`) 付きマッパーラムダ (`mapper lambda`) を生成しない (`Dont generate`) (#1957)
-   [Compiler] カスタムクエリ (`custom queries`) が衝突 (`clash`) する場合、ファイル名 (`file name`) を追加のパッケージサフィックス (`additional package suffix`) として使用 (#1057, #1278)
-   [Compiler] 外部キーカスケード (`foreign key cascades`) によってクエリリスナー (`query listeners`) が通知 (`notified`) されることを保証 (#1325, #1485)
-   [Compiler] 同じ型の `2` つを結合 (`unioning two of the same type`) する場合、テーブル型 (`table type`) を返す (#1342)
-   [Compiler] `ifnull` と `coalesce` のパラメータ (`params`) は `null` 許容にできる (`can be nullable`) ことを保証 (#1263)
-   [Compiler] クエリによって課せられる式 (`expressions`) の `null` 許容性 (`nullability`) を正しく使用
-   [MySQL Dialect] `MySQL if statements` をサポート
-   [PostgreSQL Dialect] `PostgreSQL` で `NUMERIC` と `DECIMAL` を `Double` として取得 (#2118)
-   [SQLite Dialect] `UPSERT` 通知 (`notifications`) は `BEFORE/AFTER UPDATE` トリガー (`triggers`) を考慮すべき (#2198 by [Anders Ha][andersio])
-   [SQLite Driver] インメモリでない限り (`unless we are in memory`)、`SqliteDriver` でスレッド (`threads`) に複数の接続 (`multiple connections`) を使用 (#1832)
-   [JDBC Driver] `JDBC Driver` は `autoCommit` が `true` であると仮定 (`assumes autoCommit is true`) (#2041)
-   [JDBC Driver] 例外発生時 (`on exception`) に接続 (`connections`) を閉じる (`close`) ことを保証 (#2306)
-   [IDE Plugin] パスセパレータ (`path separator`) のバグにより `Windows` で `GoToDeclaration/FindUsages` が破損する (`broken`) のを修正 (#2054 by [Angus Holder][AngusH])
-   [IDE Plugin] `IDE` でクラッシュ (`crashing`) する代わりに `gradle errors` を無視 (`Ignore`)。
-   [IDE Plugin] `sqldelight` ファイルが `non-sqldelight module` に移動 (`moved`) された場合、コード生成 (`codegen`) を試みない (`do not attempt`)
-   [IDE Plugin] `IDE` でコード生成エラー (`codegen errors`) を無視 (`Ignore`)
-   [IDE Plugin] 負のサブストリング (`negatively substring`) を試みない (`dont try`) ことを保証 (#2068)
-   [IDE Plugin] プロジェクト (`project`) が破棄 (`disposed`) されていないことも保証 (#2155)
-   [IDE Plugin] `null` 許容型 (`nullable types`) での算術演算 (`Arithmetic`) も `null` 許容であるべき (#1853)
-   [IDE Plugin] 「ワイルドカード展開インテンション (`expand * intention`)」が追加のプロジェクション (`additional projections`) で機能するように修正 (#2173 by [Alexander Perfilyev][aperfilyev])
-   [IDE Plugin] `GoTo` 中に `Kotlin resolution` が失敗した場合 (`fails`)、`sqldelight` ファイルへ移動 (`go to sqldelight files`) を試みない
-   [IDE Plugin] `SQLDelight` がインデックス作成 (`indexing`) 中に `IntelliJ` が例外 (`exception`) を検出した場合、クラッシュしない
-   [IDE Plugin] `IDE` でコード生成前 (`before codegen`) にエラー検出 (`detecting errors`) 中に発生する例外 (`exceptions`) を処理
-   [IDE Plugin] `IDE` プラグインを `Dynamic Plugins` と互換性を持たせる (`compatible`) (#1536)
-   [Gradle Plugin] `WorkerApi` を使用したデータベース生成 (`generating a database`) での競合状態 (`Race condition`) (#2062 by [Stéphane Nicolas][stephanenicolas])
-   [Gradle Plugin] `classLoaderIsolation` がカスタム `jdbc` の使用 (`custom jdbc usage`) を妨げる (`prevents`) (#2048 by [Ben Asher][BenA])
-   [Gradle Plugin] 欠落している `packageName` エラーメッセージ (`error message`) を改善 (by [Niklas Baudy][vanniktech])
-   [Gradle Plugin] `SQLDelight` が `IntelliJ` の依存関係 (`dependencies`) をビルドスクリプトクラスパス (`buildscript class path`) に漏らす (`bleeds`) (#1998)
-   [Gradle Plugin] `Gradle build caching` を修正 (#2075)
-   [Gradle Plugin] `Gradle plugin` で `kotlin-native-utils` に依存しない (`Do not depend on`) (by [Ilya Matveev][ilmat192])
-   [Gradle Plugin] マイグレーションファイル (`migration files`) のみの場合もデータベース (`database`) を書き込む (`write`) (#2094)
-   [Gradle Plugin] ダイヤモンド依存関係 (`diamond dependencies`) が最終コンパイルユニット (`final compilation unit`) で一度だけ選択 (`picked up once`) されることを保証 (#1455)

また、今回のリリースで `SQLDelight` インフラ (`infrastructure`) を改善するために多大な貢献をした [Matthew Haughton][3flex] 氏に心から感謝します。

## [1.4.4] - 2020-10-08

### 追加
-   [PostgreSQL Dialect] `WITH` 句内のデータ変更ステートメント (`data-modifying statements`) をサポート
-   [PostgreSQL Dialect] `substring` 関数をサポート
-   [Gradle Plugin] `SQLDelight` コンパイル中 (`compilation`) にマイグレーション (`migrations`) を検証 (`validating`) するための `verifyMigrations` フラグ (`flag`) を追加 (#1872)

### 変更
-   [Compiler] 非 `SQLite` ダイアレクト (`non-SQLite dialects`) で `SQLite` 固有の関数 (`SQLite specific functions`) を不明 (`unknown`) としてフラグ付け (`Flag`)
-   [Gradle Plugin] `sqldelight plugin` が適用 (`applied`) されているがデータベースが設定されていない (`no databases are configured`) 場合に警告 (`warning`) を表示 (#1421)

### 修正
-   [Compiler] `ORDER BY` 句で列名 (`column name`) をバインド (`binding`) する際にエラーを報告 (`Report an error`) (#1187 by [Eliezer Graber][eygraber])
-   [Compiler] `db interface` 生成時にレジストリ警告 (`Registry warnings`) が表示される (#1792)
-   [Compiler] `CASE` ステートメント (`case statement`) の誤った型推論 (`Incorrect type inference`) (#1811)
-   [Compiler] バージョンがないマイグレーションファイル (`migration files with no version`) に対してより良いエラー (`better errors`) を提供 (#2006)
-   [Compiler] `ColumnAdapter` の一部のデータベース型 (`database type`) をマーシャル (`marshal`) するために必要なデータベース型が不正 (#2012)
-   [Compiler] `CAST` の `Null` 許容性 (`Nullability`) (#1261)
-   [Compiler] クエリラッパー (`query wrappers`) で多数の名前シャドウ警告 (`name shadowed warnings`) (#1946 by [Eliezer Graber][eygraber])
-   [Compiler] 生成されたコード (`Generated code`) が完全修飾名 (`full qualifier names`) を使用している (#1939)
-   [IDE Plugin] `gradle syncs` から `sqldelight code gen` をトリガー (`Trigger`)
-   [IDE Plugin] `.sq` ファイル変更時 (`changing .sq files`) にプラグインがデータベースインターフェース (`database interface`) を再生成しない (`not regenerating`) (#1945)
-   [IDE Plugin] ファイルを新しいパッケージ (`new packages`) に移動 (`moving files`) する際の問題 (`Issue`) (#444)
-   [IDE Plugin] カーソルを移動する場所がない場合 (`nowhere to move the cursor`)、クラッシュ (`crashing`) する代わりに何もしない (`do nothing`) (#1994)
-   [IDE Plugin] `gradle project` 外のファイル (`files outside of a gradle project`) には空のパッケージ名 (`empty package name`) を使用 (#1973)
-   [IDE Plugin] 無効な型 (`invalid types`) に対しては適切に失敗 (`Fail gracefully`) する (#1943)
-   [IDE Plugin] 未知の式 (`unknown expression`) に遭遇した場合 (`encountering`) に、より良いエラーメッセージ (`better error message`) をスロー (`Throw`) する (#1958)
-   [Gradle Plugin] `SQLDelight` が `IntelliJ` の依存関係 (`dependencies`) をビルドスクリプトクラスパス (`buildscript class path`) に漏らす (`bleeds`) (#1998)
-   [Gradle Plugin] `*.sq` ファイルにメソッドドキュメント (`method doc`) を追加する際に「`JavadocIntegrationKt not found`」コンパイルエラー (`compilation error`) (#1982)
-   [Gradle Plugin] `SqlDeslight gradle plugin` は `Configuration Caching (CoCa)` をサポートしていない (`doesn't support`) (#1947 by [Stéphane Nicolas][stephanenicolas])
-   [SQLite JDBC Driver] `SQLException`: `database in auto-commit mode` (#1832)
-   [Coroutines Extension] `coroutines-extensions` の `IR backend` を修正 (#1918 by [Derek Ellis][dellisd])

## [1.4.3] - 2020-09-04

### 追加
-   [MySQL Dialect] `MySQL last_insert_id function` のサポートを追加 (by [Kelvin Law][lawkai])
-   [PostgreSQL Dialect] `SERIAL` データ型 (`data type`) をサポート (by [Veyndan Stuart][VeyndanS] & [Felipe Lima][felipecsl])
-   [PostgreSQL Dialect] `PostgreSQL RETURNING` をサポート (by [Veyndan Stuart][VeyndanS])

### 修正
-   [MySQL Dialect] `MySQL AUTO_INCREMENT` をデフォルト値 (`default value`) を持つものとして扱う (#1823)
-   [Compiler] `Upsert statement compiler error` を修正 (#1809 by [Eliezer Graber][eygraber])
-   [Compiler] 無効な `Kotlin` が生成される (`invalid Kotlin being generated`) 問題を修正 (#1925 by [Eliezer Graber][eygraber])
-   [Compiler] 未知の関数 (`unknown functions`) に対してより良いエラーメッセージ (`better error message`) を提供 (#1843)
-   [Compiler] `instr` の `2` 番目のパラメータの型 (`type for the second parameter`) として `string` を公開
-   [IDE Plugin] `IDE` プラグインのデーモン肥大化 (`daemon bloat`) と `UI` スレッド停止 (`UI thread stalling`) を修正 (#1916)
-   [IDE Plugin] `null module scenario` を処理 (#1902)
-   [IDE Plugin] 未設定の `sq files` でパッケージ名 (`package name`) に空文字列 (`empty string`) を返す (#1920)
-   [IDE Plugin] グループ化されたステートメント (`grouped statements`) を修正し、統合テスト (`integration test`) を追加 (#1820)
-   [IDE Plugin] 要素のモジュール (`module for an element`) を見つけるために組み込みの `ModuleUtil` を使用 (#1854)
-   [IDE Plugin] 有効な要素 (`valid elements`) のみ (`Only add valid elements`) をルックアップ (`lookups`) に追加 (#1909)
-   [IDE Plugin] 親 (`Parent`) は `null` にできる (#1857)

## [1.4.2] - 2020-08-27

### 追加
-   [Runtime] 新しい `JS IR backend` をサポート
-   [Gradle Plugin] `generateSqlDelightInterface Gradle task` を追加 (by [Niklas Baudy][vanniktech])
-   [Gradle Plugin] `verifySqlDelightMigration Gradle task` を追加 (by [Niklas Baudy][vanniktech])

### 修正
-   [IDE Plugin] `IDE` と `gradle` 間のデータ共有 (`data sharing`) を容易 (`facilitate`) にするために `gradle tooling API` を使用
-   [IDE Plugin] スキーマ導出 (`schema derivation`) のデフォルトを `false` に設定
-   [IDE Plugin] `commonMain source set` を適切に取得
-   [MySQL Dialect] `mySqlFunctionType()` に `minute` を追加 (by [MaaxGr][maaxgr])

## [1.4.1] - 2020-08-21

### 追加
-   [Runtime] `Kotlin 1.4.0` をサポート (#1859)

### 変更
-   [Gradle Plugin] `AGP` 依存関係 (`dependency`) を `compileOnly` に (#1362)

### 修正
-   [Compiler] 列定義ルール (`column defintion rule`) とテーブルインターフェースジェネレータ (`table interface generator`) にオプションの `javadoc` を追加 (#1224 by [Daniel Eke][endanke])
-   [SQLite Dialect] `sqlite fts5 auxiliary functions highlight, snippet, and bm25` のサポートを追加 (by [Daniel Rampelt][drampelt])
-   [MySQL Dialect] `MySQL bit data type` をサポート
-   [MySQL Dialect] `MySQL binary literals` をサポート
-   [PostgreSQL Dialect] `sql-psi` から `SERIAL` を公開 (by [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] `BOOLEAN data type` を追加 (by [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] `NULL column constraint` を追加 (by [Veyndan Stuart][VeyndanS])
-   [HSQL Dialect] `HSQL` に `AUTO_INCREMENT` サポートを追加 (by [Ryan Harter][rharter])

## [1.4.0] - 2020-06-22

### 追加
-   [MySQL Dialect] MySQL サポート (by [Jeff Gulbronson][JeffG] & [Veyndan Stuart][VeyndanS])
-   [PostgreSQL Dialect] 実験的な `PostgreSQL` サポート (by [Veyndan Stuart][VeyndanS])
-   [HSQL Dialect] 実験的な `H2` サポート (by [Marius Volkhart][MariusV])
-   [SQLite Dialect] `SQLite FTS5` サポート (by [Ben Asher][BenA] & [James Palawaga][JamesP])
-   [SQLite Dialect] `alter table rename column` のサポート (#1505 by [Angus Holder][AngusH])
-   [IDE] マイグレーション (`.sqm`) ファイルの `IDE` サポート
-   [IDE] 組み込みの `SQL Live Templates` を模倣した `SQLDelight Live Templates` を追加 (#1154 by [Veyndan Stuart][VeyndanS])
-   [IDE] 新しい `SqlDelight file action` を追加 (#42 by [Roman Zavarnitsyn][RomanZ])
-   [Runtime] 結果を返すトランザクション (`transactions that return results`) 用の `transactionWithReturn API`
-   [Compiler] `.sq` ファイルで複数の `SQL` ステートメント (`SQL statements`) をグループ化 (`grouping`) する構文
-   [Compiler] マイグレーションファイル (`migration files`) からスキーマ (`schemas`) を生成 (`generating`) するサポート
-   [Gradle Plugin] マイグレーションファイル (`migration files`) を有効な `sql` として出力 (`outputting`) するタスクを追加

### 変更
-   [Documentation] ドキュメントウェブサイト (`documentation website`) の大幅な刷新 (`Overhaul`) (by [Saket Narayan][SaketN])
-   [Gradle Plugin] サポートされていないダイアレクト (`unsupported dialect`) のエラーメッセージ (`error message`) を改善 (by [Veyndan Stuart][VeyndanS])
-   [IDE] ダイアレクト (`dialect`) に基づいてファイルアイコン (`file icon`) を動的に変更 (by [Veyndan Stuart][VeyndanS])
-   [JDBC Driver] `javax.sql.DataSource` から `JdbcDriver` コンストラクタ (`constructor`) を公開 (#1614)

### 修正
-   [Compiler] テーブルの `Javadoc` をサポートし、`1` ファイル内の複数の `Javadoc` を修正 (#1224)
-   [Compiler] 合成列 (`synthesized columns`) に値 (`value`) を挿入 (`inserting`) できるようにする (#1351)
-   [Compiler] ディレクトリ名 (`directory name`) のサニタイズ (`sanitizing`) における不整合 (`inconsistency`) を修正 (by [Zac Sweers][ZacSweers])
-   [Compiler] 合成列 (`Synthesized columns`) は結合全体 (`across joins`) で `null` 許容性 (`nullability`) を保持 (`retain`) すべき (#1656)
-   [Compiler] `DELETE` キーワードに `DELETE` ステートメント (`statement`) を固定 (`Pin`) (#1643)
-   [Compiler] クォーティング (`quoting`) を修正 (#1525 by [Angus Holder][AngusH])
-   [Compiler] `BETWEEN` 演算子 (`operator`) が式 (`expressions`) に適切に再帰 (`properly recurse`) するように修正 (#1279)
-   [Compiler] インデックス作成時 (`creating an index`) にテーブル/列が欠落している場合 (`missing table/column`)、より良いエラー (`better error`) を提供 (#1372)
-   [Compiler] 結合制約 (`join constraints`) で外部クエリ (`outer querys`) のプロジェクション (`projection`) を使用できるようにする (#1346)
-   [Native Driver] `execute` で `transactionPool` を使用するようにする (by [Ben Asher][BenA])
-   [JDBC Driver] `SQLite` の代わりに `jdbc transaction APIs` を使用する (#1693)
-   [IDE] `virtualFile` 参照 (`references`) が常に元のファイル (`original file`) になるように修正 (#1782)
-   [IDE] `bugsnag` にエラー (`errors`) を報告 (`reporting`) する際に正しい `Throwable` を使用する (#1262)
-   [Paging Extension] リークする `DataSource` (`leaky DataSource`) を修正 (#1628)
-   [Gradle Plugin] スキーマ生成時 (`generating a schema`)、出力 `db file` (`output db file`) がすでに存在する場合、それを削除 (`delete`) する (#1645)
-   [Gradle Plugin] ギャップ (`gaps`) がある場合、マイグレーション検証 (`migration validation`) を失敗させる
-   [Gradle Plugin] 設定したファイルインデックス (`file index`) を明示的に使用 (`Explicitly use`) (#1644)

## [1.3.0] - 2020-04-03

*   新規: [Gradle] コンパイル対象の `sql` ダイアレクト (`sql dialect to compile against`) を指定する `Dialect` プロパティ。
*   新規: [Compiler] `#1009 mysql` ダイアレクトの実験的サポート (`Experimental support`)。
*   新規: [Compiler] `#1436 sqlite:3.24` ダイアレクトと `upsert` のサポート。
*   新規: [JDBC Driver] `sqlite jvm driver` から `JDBC` ドライバー (`JDBC driver`) を分割 (`Split out`)。
*   修正: [Compiler] `#1199` あらゆる長さのラムダ (`lambdas of any length`) をサポート。
*   修正: [Compiler] `#1610 avg()` の戻り値の型 (`return type`) を `null` 許容に修正。
*   修正: [IntelliJ] `#1594` `Windows` で `Goto` および `Find Usages` が破損 (`broke`) する原因となっていたパスセパレータ (`path separator`) の処理を修正。

## [1.2.2] - 2020-01-22

*   新規: [Runtime] `Windows (mingW)`、`tvOS`、`watchOS`、および `macOS` アーキテクチャ (`architectures`) のサポート。
*   修正: [Compiler] `sum()` の戻り値の型 (`Return type`) は `null` 許容であるべき。
*   修正: [Paging] 競合状態 (`race conditions`) を避けるため、`Transacter` を `QueryDataSourceFactory` に渡す。
*   修正: [IntelliJ Plugin] ファイルのパッケージ名 (`package name`) を検索 (`looking for a file's package name`) する際に依存関係 (`dependencies`) を検索しない。
*   修正: [Gradle] `#862 Gradle` のバリデーターログ (`validator logs`) をデバッグレベル (`debug level`) に変更。
*   改善: [Gradle] `GenerateSchemaTask` を `Gradle worker` を使用するように変換。
*   注: `sqldelight-runtime` アーティファクトは `runtime` に名称変更されました。

## [1.2.1] - 2019-12-11

*   修正: [Gradle] `Kotlin Native 1.3.60` をサポート。
*   修正: [Gradle] `#1287` 同期時 (`syncing`) の警告 (`Warning`)。
*   修正: [Compiler] `#1469 Query` の `SynetheticAccessor` 作成。
*   修正: [JVM Driver] メモリリーク (`memory leak`) を修正。
*   注: コルーチン拡張 (`coroutine extension`) アーティファクトには、`buildscript` に `kotlinx bintray maven` リポジトリ (`repository`) を追加する必要があります。

## [1.2.0] - 2019-08-30

*   新規: [Runtime] 安定版 `Flow api`。
*   修正: [Gradle] `Kotlin Native 1.3.50` をサポート。
*   修正: [Gradle] `#1380` クリーンビルド (`Clean build`) が時々失敗 (`sometimes fails`) する。
*   修正: [Gradle] `#1348 verify tasks` 実行時に「`Could not retrieve functions`」と表示される。
*   修正: [Compile] `#1405 query` が `FTS table` を結合 (`joined`) している場合、プロジェクト (`project`) をビルドできない。
*   修正: [Gradle] `#1266` 複数のデータベースモジュール (`multiple database modules`) がある場合の散発的な `gradle build failure`。

## [1.1.4] - 2019-07-11

*   新規: [Runtime] 実験的 `kotlin Flow api`。
*   修正: [Gradle] `Kotlin/Native 1.3.40` との互換性 (`compatibility`)。
*   修正: [Gradle] `#1243 Gradle` のオンデマンド構成 (`configure on demand`) での `SQLDelight` の使用を修正。
*   修正: [Gradle] `#1385 incremental annotation processing` での `SQLDelight` の使用を修正。
*   修正: [Gradle] `gradle tasks` のキャッシュ (`cache`) を許可。
*   修正: [Gradle] `#1274 kotlin dsl` での `sqldelight extension` の使用を有効化。
*   修正: [Compiler] 各クエリ (`query`) に対して一意の `ID` が決定論的に生成される (`deterministically generated`)。
*   修正: [Compiler] トランザクション (`transaction`) が完了 (`complete`) したときにのみリスニングクエリ (`listening queries`) に通知 (`notify`) する。
*   修正: [JVM Driver] `#1370 JdbcSqliteDriver` ユーザーに `DB URL` の提供 (`supply a DB URL`) を強制する。

## [1.1.3] - 2019-04-14

*   Gradle メタデータ `1.0` リリース。

## [1.1.2] - 2019-04-14

*   新規: [Runtime] `#1267 Logging driver decorator` を追加。
*   修正: [Compiler] `#1254` `2^16` 文字より長い文字列リテラル (`string literals`) を分割 (`Split`)。
*   修正: [Gradle] `#1260` マルチプラットフォームプロジェクト (`Multiplatform Project`) で生成されたソース (`generated sources`) が `iOS` ソースとして認識 (`recognized`) される。
*   修正: [IDE] `#1290 kotlin.KotlinNullPointerException` in `CopyAsSqliteAction.kt:43`。
*   修正: [Gradle] `#1268 linkDebugFrameworkIos* tasks` が最近のバージョンで失敗 (`fail`) する。

## [1.1.1] - 2019-03-01

*   修正: [Gradle] `android projects` のモジュール依存関係コンパイル (`module dependency compilation`) を修正。
*   修正: [Gradle] `#1246 afterEvaluate` で `api dependencies` を設定。
*   修正: [Compiler] 配列型 (`Array types`) が適切に出力される。

## [1.1.0] - 2019-02-27

*   新規: [Gradle] `#502 schema module dependencies` の指定を許可。
*   改善: [Compiler] `#1111` テーブルエラー (`Table errors`) が他のエラー (`other errors`) より前にソート (`sorted`) される。
*   修正: [Compiler] `#1225 REAL literals` の正しい型 (`correct type`) を返す。
*   修正: [Compiler] `#1218 docid` がトリガー (`triggers`) を通じて伝播 (`propagates`) する。

## [1.0.3] - 2019-01-30

*   改善: [Runtime] `#1195 Native Driver/Runtime Arm32` を改善。
*   改善: [Runtime] `#1190 Query` 型からマッパー (`mapper`) を公開 (`Expose`) する。

## [1.0.2] - 2019-01-26

*   修正: [Gradle Plugin] `kotlin 1.3.20` にアップデート。
*   修正: [Runtime] トランザクション (`Transactions`) が例外 (`exceptions`) を飲み込まない (`swallow`) ように。

## [1.0.1] - 2019-01-21

*   改善: [Native Driver] `DatabaseConfiguration` にディレクトリ名 (`directory name`) を渡すことを許可。
*   改善: [Compiler] `#1173` パッケージのないファイル (`Files without a package`) はコンパイルに失敗 (`fail compilation`) する。
*   修正: [IDE] `Square` に `IDE` エラーを適切に報告 (`Properly report IDE errors`) する。
*   修正: [IDE] `#1162` 同じパッケージ内の型 (`Types in the same package`) がエラーとして表示されるが正常に動作する。
*   修正: [IDE] `#1166` テーブルの名前変更 (`Renaming a table`) が `NPE` で失敗する。
*   修正: [Compiler] `#1167 UNION` と `SELECT` を含む複雑な `SQL` ステートメント (`complex SQL statements`) を解析 (`parse`) しようとすると例外 (`exception`) をスロー (`Throws`) する。

## [1.0.0] - 2019-01-08

*   新規: 生成されたコード (`generated code`) を完全に刷新 (`Complete overhaul`) し、`Kotlin` になった。
*   新規: `RxJava2` 拡張アーティファクト (`extensions artifact`)。
*   新規: `Android Paging` 拡張アーティファクト (`extensions artifact`)。
*   新規: `Kotlin Multiplatform` サポート。
*   新規: `Android`、`iOS`、`JVM SQLite driver artifacts`。
*   新規: トランザクション `API`。

## [0.7.0] - 2018-02-12

*   新規: 生成されたコード (`Generated code`) は `Support SQLite` ライブラリ (`library`) のみを使用するように更新されました。すべてのクエリ (`queries`) は、生の文字列 (`raw strings`) ではなくステートメントオブジェクト (`statement objects`) を生成 (`generate`) するようになりました。
*   新規: `IDE` でのステートメント折りたたみ (`Statement folding`)。
*   新規: `Boolean` 型は自動的に処理 (`automatically handled`) されるようになりました。
*   修正: コード生成 (`code generation`) から非推奨のマーシャル (`deprecated marshals`) を削除。
*   修正: `avg SQL function` の型マッピング (`type mapping`) を `REAL` に修正。
*   修正: `julianday SQL function` を正しく検出 (`Correctly detect`)。

## [0.6.1] - 2017-03-22

*   新規: 引数なしの `Delete Update` および `Insert` ステートメント (`statements`) に対してコンパイル済みステートメント (`compiled statements`) が生成される。
*   修正: サブクエリ (`subquery`) で使用されるビュー (`view`) 内の `Using` 句 (`clause`) がエラーにならない。
*   修正: 生成された `Mapper` の重複型 (`Duplicate types`) を削除。
*   修正: サブクエリ (`Subqueries`) を引数と照合する式 (`expressions that check against arguments`) で使用できる。

## [0.6.0] - 2017-03-06

*   新規: `Select queries` は、文字列定数 (`string constants`) ではなく `SqlDelightStatement` ファクトリ (`factory`) として公開 (`exposed`) されるようになりました。
*   新規: クエリ (`Query`) の `JavaDoc` は、ステートメント (`statement`) およびマッパーファクトリ (`mapper factories`) にコピー (`copied`) されるようになりました。
*   新規: ビュー名 (`view names`) に文字列定数 (`string constants`) を出力 (`Emit`)。
*   修正: ファクトリ (`factories`) を必要とするビュー (`views`) に対するクエリ (`Queries`) が、そのファクトリを引数 (`arguments`) として正しく要求 (`correctly require`) するように。
*   修正: 挿入 (`insert`) の引数の数 (`number of arguments`) が指定された列の数 (`number of columns specified`) と一致することを検証 (`Validate`)。
*   修正: `where` 句で (`where clauses`) 使用される `blob literals` を適切にエンコード (`Properly encode`)。
*   このリリースには `Gradle 3.3` 以降が必要です。

## [0.5.1] - 2016-10-24

*   新規: コンパイル済みステートメント (`Compiled statements`) が抽象型 (`abstract type`) を拡張 (`extend`)。
*   修正: パラメータ (`parameters`) 内のプリミティブ型 (`Primitive types`) は `null` 許容の場合、ボックス化 (`boxed`) される。
*   修正: バインド引数 (`bind args`) に必要なすべてのファクトリ (`required factories`) がファクトリメソッド (`factory method`) に存在。
*   修正: エスケープされた列名 (`Escaped column names`) が正しくマーシャリング (`marshalled correctly`) される。

## [0.5.0] - 2016-10-19

*   新規: `SQLite` 引数 (`arguments`) を `Factory` を通じて型安全 (`typesafely`) に渡せるように。
*   新規: `IntelliJ` プラグインが `.sq` ファイルの書式設定 (`formatting`) を実行。
*   新規: `SQLite timestamp literals` のサポート。
*   修正: パラメータ化された型 (`Parameterized types`) を `IntelliJ` でクリックスルー (`clicked through`) できる。
*   修正: エスケープされた列名 (`Escaped column names`) がカーソル (`Cursor`) から取得された場合 (`grabbed`) に `RuntimeException` をスローしなくなった。
*   修正: `Gradle` プラグインが例外 (`exceptions`) を出力 (`print`) しようとしてクラッシュしない。

## [0.4.4] - 2016-07-20

*   新規: `short` 型を列の `java type` としてネイティブでサポート
*   新規: 生成されたマッパー (`mappers`) およびファクトリメソッド (`factory methods`) に `Javadoc`
*   修正: `group_concat` および `nullif` 関数が適切な `null` 許容性 (`proper nullability`) を持つ
*   修正: `Android Studio 2.2-alpha` との互換性 (`Compatibility`)
*   修正: `WITH RECURSIVE` がプラグイン (`plugin`) をクラッシュさせない

## [0.4.3] - 2016-07-07

*   新規: コンパイルエラー (`Compilation errors`) がソースファイル (`source file`) にリンク (`link`) される。
*   新規: 右クリック (`Right-click`) で `SQLDelight` コードを有効な `SQLite` としてコピー。
*   新規: 名前付きステートメント (`named statements`) の `Javadoc` が生成された文字列 (`generated Strings`) に表示される。
*   修正: 生成されたビューモデル (`Generated view models`) に `null` 許容性アノテーション (`nullability annotations`) が含まれる。
*   修正: `unions` から生成されたコード (`Generated code from unions`) が、すべての可能な列 (`possible columns`) をサポートするための適切な型 (`proper type`) と `null` 許容性 (`nullability`) を持つ。
*   修正: `sum` および `round SQLite functions` が生成コード (`generated code`) で適切な型 (`proper type`) を持つ。
*   修正: `CAST`、内部 `SELECT` のバグ修正。
*   修正: `CREATE TABLE` ステートメントでの自動補完 (`Autocomplete`)。
*   修正: `SQLite` キーワードをパッケージで使用できる。

## [0.4.2] - 2016-06-16

*   新規: `Marshal` をファクトリ (`factory`) から作成できる。
*   修正: `IntelliJ` プラグインが適切なジェネリック順序 (`proper generic order`) でファクトリメソッド (`factory methods`) を生成する。
*   修正: 関数名 (`Function names`) で任意の大文字/小文字 (`any casing`) を使用できる。

## [0.4.1] - 2016-06-14

*   修正: `IntelliJ` プラグインが適切なジェネリック順序 (`proper generic order`) でクラスを生成する。
*   修正: 列定義 (`Column definitions`) で任意の大文字/小文字 (`any casing`) を使用できる。

## [0.4.0] - 2016-06-14

*   新規: マッパー (`Mappers`) がテーブルごと (`per table`) ではなくクエリごと (`per query`) に生成される。
*   新規: `Java` 型を `.sq` ファイルでインポート (`imported`) できる。
*   新規: `SQLite` 関数が検証 (`validated`) される。
*   修正: 重複エラー (`duplicate errors`) を削除。
*   修正: 大文字の列名 (`Uppercase column names`) と `java` キーワードの列名 (`java keyword column names`) がエラーにならない。

## [0.3.2] - 2016-05-14

*   新規: 自動補完 (`Autocompletion`) と使用箇所の検索 (`find usages`) がビュー (`views`) とエイリアス (`aliases`) で機能するようになった。
*   修正: コンパイル時検証 (`Compile-time validation`) で関数を `selects` で使用できるように。
*   修正: デフォルト値 (`default values`) のみを宣言 (`declare`) する `insert statements` をサポート。
*   修正: `SQLDelight` を使用しないプロジェクト (`project not using SQLDelight`) がインポートされたとき (`imported`) にプラグインがクラッシュしなくなった。

## [0.3.1] - 2016-04-27

*   修正: メソッド参照 (`method references`) からの `Illegal Access runtime exceptions` を回避するため、インターフェースの可視性 (`Interface visibility`) を `public` に戻した。
*   修正: サブ式 (`Subexpressions`) が適切に評価 (`evaluated`) される。

## [0.3.0] - 2016-04-26

*   新規: 列定義 (`Column definitions`) が `SQLite` 型を使用し、`java type` を指定するための追加の「`AS`」制約 (`constraint`) を持つことができる。
*   新規: `IDE` からバグレポート (`Bug reports`) を送信できる。
*   修正: 自動補完 (`Autocomplete`) が適切に機能する。
*   修正: `SQLDelight` モデルファイル (`model files`) が `.sq` ファイル編集時 (`.sq file edit`) に更新される。
*   削除: 添付データベース (`Attached databases`) はサポートされなくなった。

## [0.2.2] - 2016-03-07

*   新規: `insert`、`update`、`delete`、`index`、および `trigger` ステートメントで使用される列のコンパイル時検証 (`Compile-time validation`)。
*   修正: ファイルの移動/作成時 (`file move/create`) に `IDE` プラグインがクラッシュしないように。

## [0.2.1] - 2016-03-07

*   新規: `Ctrl`+`/` (`OSX` では `Cmd`+`/`) で選択した行のコメント (`comment`) を切り替える (`toggles`)。
*   新規: `SQL` クエリで使用される列のコンパイル時検証 (`Compile-time validation`)。
*   修正: `IDE` と `Gradle` プラグインの両方で `Windows` パス (`Windows paths`) をサポート。

## [0.2.0] - 2016-02-29

*   新規: `Marshal` クラスにコピーコンストラクタ (`copy constructor`) を追加。
*   新規: `Kotlin 1.0 final` にアップデート。
*   修正: 「`sqldelight`」フォルダ構造 (`folder structure`) の問題 (`problems`) を、失敗しない方法 (`non-failing way`) で報告 (`Report`) する。
*   修正: `table_name` という名前の列 (`columns named table_name`) を禁止 (`Forbid`)。生成された定数 (`generated constant`) がテーブル名定数 (`table name constant`) と衝突 (`clashes`) するため。
*   修正: `IDE` プラグインが、`.sq` ファイルが開かれたかどうかに関わらず、すぐにモデルクラス (`model classes`) を生成 (`generates`) することを保証。
*   修正: `IDE` と `Gradle` プラグインの両方で `Windows` パス (`Windows paths`) をサポート。

## [0.1.2] - 2016-02-13

*   修正: ほとんどのプロジェクトで `Gradle` プラグインの使用 (`being used`) を妨げていた (`prevented`) コードを削除。
*   修正: `Antlr runtime` への不足しているコンパイラ依存関係 (`missing compiler dependency`) を追加。

## [0.1.1] - 2016-02-12

*   修正: `Gradle` プラグインが、それ自体と同じバージョンのランタイム (`runtime`) を指す (`points to`) ように保証。

## [0.1.0] - 2016-02-12

初回リリース。