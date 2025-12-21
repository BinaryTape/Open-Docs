# 変更履歴

## 未リリース

### 追加
-   [Gradle プラグイン] スキーマの開始バージョンが 1 でなく `verifyMigrations` が true の場合にビルドが失敗する問題を修正 (#6017 by @neilgmiller)
-   [Gradle プラグイン] `SqlDelightWorkerTask` をより設定可能にし、Windows での開発をサポートするためにデフォルト設定を更新 (#5215 by @MSDarwish2000)
-   [SQLite ダイアレクト] `FTS5` 仮想テーブルでの合成列のサポートを追加 (#5986 by @watbe)

### 変更
-   [コンパイラ] パッケージ名でのアンダースコアの使用を許可。以前はアンダースコアがサニタイズされていたため、予期せぬ動作が発生していました (#6027 by @BierDav)
-   [ページング拡張] AndroidX Paging に切り替え (#5910 by @jeffdgr8)

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 追加
-   [PostgreSQL ダイアレクト] Postgres の `numeric`/`integer`/`biginteger` 型マッピングを修正 (#5994 by @griffio)
-   [コンパイラ] `CAST` が必要な場合に、ソースファイルの位置を含めるようにコンパイラのエラーメッセージを改善 (#5979 by @griffio)
-   [PostgreSQL ダイアレクト] Postgres JSON オペレーターのパス抽出のサポートを追加 (#5971 by @griffio)
-   [SQLite ダイアレクト] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントの `Sqlite 3.35` サポートを追加 (#5961 by @griffio)
-   [PostgreSQL ダイアレクト] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントのサポートを追加 (#5961 by @griffio)
-   [PostgreSQL ダイアレクト] Postgres JSON 集約 `FILTER` のサポートを追加 (#5957 by @griffio)
-   [PostgreSQL ダイアレクト] Postgres `Enum` のサポートを追加 (#5935 by @griffio)
-   [PostgreSQL ダイアレクト] Postgres `Triggers` の限定的なサポートを追加 (#5932 by @griffio)
-   [PostgreSQL ダイアレクト] `SQL` 式が `JSON` として解析できるかをチェックする述語を追加 (#5843 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql Comment On` ステートメントに対する限定的なサポートを追加 (#5808 by @griffio)
-   [MySQL ダイアレクト] インデックス可視性オプションのサポートを追加 (#5785 by @orenkislev-faire)
-   [PostgreSQL ダイアレクト] `TSQUERY` データ型のサポートを追加 (#5779 by @griffio)
-   [Gradle プラグイン] モジュール追加時のバージョンカタログ (`version catalogs`) のサポートを追加 (#5755 by @DRSchlaubi)

### 変更
-   開発中のスナップショット (`In-development snapshots`) は、`https://central.sonatype.com/repository/maven-snapshots/` の Central Portal Snapshots リポジトリに公開されるようになりました。
-   [コンパイラ] コンストラクタ参照 (`constructor references`) を使用して、デフォルトで生成されるクエリを簡素化 (#5814 by @jonapoul)

### 修正
-   [コンパイラ] 共通テーブル式 (`Common Table Expression`) を含む `View` を使用する際のスタックオーバーフロー (`stack overflow`) を修正 (#5928 by @griffio)
-   [Gradle プラグイン] `SqlDelight` ツールウィンドウ (`tool window`) で「新しい接続 (`New Connection`)」を追加する際のクラッシュを修正 (#5906 by @griffio)
-   [IntelliJ プラグイン] コピー・トゥ・SQLiteガターアクション (`copy-to-sqlite gutter action`) におけるスレッド関連のクラッシュを回避 (#5901 by @griffio)
-   [IntelliJ プラグイン] `CREATE INDEX` および `CREATE VIEW` スキーマステートメント (`schema statements`) 使用時の `PostgreSql` ダイアレクトの修正 (#5772 by @griffio)
-   [コンパイラ] 列参照時の `FTS` スタックオーバーフロー (`stack overflow`) を修正 (#5896 by @griffio)
-   [コンパイラ] `WITH RECURSIVE` スタックオーバーフロー (`stack overflow`) を修正 (#5892 by @griffio)
-   [コンパイラ] `INSERT|UPDATE|DELETE RETURNING` ステートメントの通知 (`Notify`) を修正 (#5851 by @griffio)
-   [コンパイラ] `Long` を返すトランザクションブロック (`transaction blocks`) の非同期結果型 (`async result type`) を修正 (#5836 by @griffio)
-   [コンパイラ] `SQL` パラメータバインディング (`SQL parameter binding`) の複雑度 (`complexity`) を `O(n²)` から `O(n)` に最適化 (#5898 by @chenf7)
-   [SQLite ダイアレクト] `Sqlite 3.18` で不足していた関数を修正 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

一部の成果物が公開されて失敗したリリースです。2.2.1 を使用してください！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 追加
-   [WASM ドライバー] `wasmJs` の `web worker driver` へのサポートを追加 (#5534 by @IlyaGulya)
-   [PostgreSQL ダイアレクト] `PostgreSql UnNest Array to rows` をサポート (#5673 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql TSRANGE/TSTZRANGE` のサポート (#5297 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql Right Full Join` のサポート (#5086 by @griffio)
-   [PostgreSQL ダイアレクト] `temporal types` からの `Postrgesql extract` をサポート (#5273 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql array contains operators` のサポート (#4933 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql drop constraint` をサポート (#5288 by @griffio)
-   [PostgreSQL ダイアレクト] `Postgresql type casting` をサポート (#5089 by @griffio)
-   [PostgreSQL ダイアレクト] サブクエリ (`subquery`) 用の `PostgreSql lateral join operator` をサポート (#5122 by @griffio)
-   [PostgreSQL ダイアレクト] `Postgresql ILIKE operator` をサポート (#5330 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql XML type` をサポート (#5331 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql AT TIME ZONE` をサポート (#5243 by @griffio)
-   [PostgreSQL ダイアレクト] PostgreSQL の `order by nulls` のサポートを追加 (#5199 by @griffio)
-   [PostgreSQL ダイアレクト] PostgreSQL の現在日時関数 (`current date/time function`) サポートを追加 (#5226 by @drewd)
-   [PostgreSQL ダイアレクト] `PostgreSql Regex operators` をサポート (#5137 by @griffio)
-   [PostgreSQL ダイアレクト] `brin gist` を追加 (#5059 by @griffio)
-   [MySQL ダイアレクト] `MySql` ダイアレクトの `RENAME INDEX` をサポート (#5212 by @orenkislev-faire)
-   [JSON 拡張] `json table function` にエイリアスを追加 (#5372 by @griffio)

### 変更
-   [コンパイラ] 生成されるクエリファイルが、シンプルなミューテーター (`mutators`) の行数 (`row counts`) を返すように変更 (#4578 by @MariusVolkhart)
-   [ネイティブドライバー] `NativeSqlDatabase.kt` を更新し、`DELETE`、`INSERT`、および `UPDATE` ステートメントの読み取り専用フラグ (`readonly flag`) を変更 (#5680 by @griffio)
-   [PostgreSQL ダイアレクト] `PgInterval` を `String` に変更 (#5403 by @griffio)
-   [PostgreSQL ダイアレクト] `SqlDelight` モジュールが `PostgreSql` 拡張を実装 (`implement PostgreSql extensions`) できるようにサポート (#5677 by @griffio)

### 修正
-   [コンパイラ] 修正: 結果を伴うグループステートメント (`group statements`) 実行時にクエリに通知するよう修正 (#5006 by @vitorhugods)
-   [コンパイラ] `SqlDelightModule` 型リゾルバー (`type resolver`) を修正 (#5625 by @griffio)
-   [コンパイラ] `5501` の挿入オブジェクトエスケープ列 (`insert object escaped column`) を修正 (#5503 by @griffio)
-   [コンパイラ] コンパイラ: エラーメッセージ (`error message`) を改善し、パスリンク (`path links`) が正しい行 (`line`) と文字位置 (`char position`) でクリック可能 (`clickable`) になるように修正 (#5604 by @vanniktech)
-   [コンパイラ] `issue 5298` を修正: キーワードをテーブル名として使用できるように修正
-   [コンパイラ] 名前付き実行 (`named executes`) を修正し、テストを追加
-   [コンパイラ] 初期化ステートメント (`initialization statements`) のソート時に外部キーテーブル制約 (`foreign key table constraints`) を考慮 (#5325 by @TheMrMilchmann)
-   [コンパイラ] タブ (`tabs`) が関係する場合にエラー下線 (`error underlines`) を適切に揃えるよう修正 (#5224 by @drewd)
-   [JDBC ドライバー] トランザクション終了時の `connectionManager` のメモリリーク (`memory leak`) を修正
-   [JDBC ドライバー] ドキュメントに記載されているように、SQLite のマイグレーションをトランザクション内で実行するよう修正 (#5218 by @morki)
-   [JDBC ドライバー] トランザクションコミット/ロールバック (`commit / rollback`) 後の接続リーク (`leaking connections`) を修正 (#5205 by @morki)
-   [Gradle プラグイン] `DriverInitializer` を `GenerateSchemaTask` の前に実行するように修正 (#5562 by @nwagu)
-   [ランタイム] 実際のドライバーが `Async` の場合に `LogSqliteDriver` でクラッシュする問題を修正 (#5723 by @edenman)
-   [ランタイム] `StringBuilder` の容量 (`capacity`) を修正 (#5192 by @janbina)
-   [PostgreSQL ダイアレクト] `PostgreSql create or replace view` を修正 (#5407 by @griffio)
-   [PostgreSQL ダイアレクト] `Postgresql to_json` を修正 (#5606 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql numeric resolver` を修正 (#5399 by @griffio)
-   [PostgreSQL ダイアレクト] `sqlite windows function` を修正 (#2799 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql SELECT DISTINCT ON` を修正 (#5345 by @griffio)
-   [PostgreSQL ダイアレクト] `alter table add column if not exists` を修正 (#5309 by @griffio)
-   [PostgreSQL ダイアレクト] `Postgresql async bind parameter` を修正 (#5313 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql boolean literals` を修正 (#5262 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql window functions` を修正 (#5155 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql isNull isNotNull types` を修正 (#5173 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql select distinct` を修正 (#5172 by @griffio)
-   [ページング拡張] ページングの初期ロード時のリフレッシュ (`paging refresh initial load`) を修正 (#5615 by @evant)
-   [ページング拡張] `MacOS native targets` を追加 (#5324 by @vitorhugods)
-   [IntelliJ プラグイン] K2 サポート

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 追加
-   [PostgreSQL ダイアレクト] PostgreSQL の `STRING_AGG` 関数を追加 (#4950 by @anddani)
-   [PostgreSQL ダイアレクト] `pg` ダイアレクトに `SET` ステートメントを追加 (#4927 by @de-luca)
-   [PostgreSQL ダイアレクト] `PostgreSql alter column sequence parameters` を追加 (#4916 by @griffio)
-   [PostgreSQL ダイアレクト] `INSERT` ステートメントの `postgresql alter column default` サポートを追加 (#4912 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSql alter sequence` と `drop sequence` を追加 (#4920 by @griffio)
-   [PostgreSQL ダイアレクト] 追加の `Postgres Regex function definitions` を追加 (#5025 by @MariusVolkhart)
-   [PostgreSQL ダイアレクト] `GIN` の文法 (`grammar`) を追加 (#5027 by @griffio)

### 変更
-   [IDE Plugin] 最低バージョン (`Minimum version`) を `2023.1 / Android Studio Iguana` に引き上げ
-   [コンパイラ] `encapsulatingType` での型の `null` 許容の上書き (`override the type nullability`) を許可 (#4882 by @eygraber)
-   [コンパイラ] `SELECT *` の列名 (`column names`) をインライン化 (`Inline`)
-   [Gradle プラグイン] `processIsolation` に切り替え (#5068 by @nwagu)
-   [Android ランタイム] Android の `minSDK` を `21` に引き上げ (#5094 by @hfhbd)
-   [ドライバー] ダイアレクト作者 (`dialect authors`) 向けに `JDBC/R2DBC` ステートメントメソッドをさらに公開 (`Expose more JDBC/R2DBC statement methods`) (#5098 by @hfhbd)

### 修正
-   [PostgreSQL ダイアレクト] `postgresql alter table alter column` を修正 (#4868 by @griffio)
-   [PostgreSQL ダイアレクト] `4448` のテーブルモデル (`table model`) のインポート不足 (`missing import`) を修正 (#4885 by @griffio)
-   [PostgreSQL ダイアレクト] `4932` の `postgresql default constraint functions` を修正 (#4934 by @griffio)
-   [PostgreSQL ダイアレクト] `4879` のマイグレーション中の `alter table rename column` での `postgresql class-cast error` を修正 (#4880 by @griffio)
-   [PostgreSQL ダイアレクト] `4474 PostgreSql create extension` を修正 (#4541 by @griffio)
-   [PostgreSQL ダイアレクト] `5018 PostgreSql add Primary Key not nullable types` を修正 (#5020 by @griffio)
-   [PostgreSQL ダイアレクト] `4703 aggregate expressions` を修正 (#5071 by @griffio)
-   [PostgreSQL ダイアレクト] `5028 PostgreSql json` を修正 (#5030 by @griffio)
-   [PostgreSQL ダイアレクト] `5040 PostgreSql json operators` を修正 (#5041 by @griffio)
-   [PostgreSQL ダイアレクト] `5040` の `json operator binding` を修正 (#5100 by @griffio)
-   [PostgreSQL ダイアレクト] `5082 tsvector` を修正 (#5104 by @griffio)
-   [PostgreSQL ダイアレクト] `5032 PostgreSql UPDATE FROM statement` での `column adjacency` を修正 (#5035 by @griffio)
-   [SQLite ダイアレクト] `4897 sqlite alter table rename column` を修正 (#4899 by @griffio)
-   [IDE Plugin] エラーハンドラ (`error handler`) のクラッシュを修正 (#4988 by @aperfilyev)
-   [IDE Plugin] `BugSnag` の初期化に失敗 (`fails to init`) (by @aperfilyev)
-   [IDE Plugin] プラグイン (`plugin`) を介して `IntelliJ` で `.sq` ファイルを開く際の `PluginException` を修正 (by @aperfilyev)
-   [IDE Plugin] Kotlin ライブラリがすでにプラグインの依存関係 (`plugin dependency`) にあるため、`IntelliJ` プラグインにバンドルしないよう修正 (#5126)
-   [IDE Plugin] ストリーム (`stream`) の代わりに `extensions` 配列を使用するよう修正 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 追加
-   [コンパイラ] `SELECT` 実行時に複数列式 (`multi-column-expr`) をサポート (#4453 by @Adriel-M)
-   [PostgreSQL ダイアレクト] `PostgreSQL CREATE INDEX CONCURRENTLY` のサポートを追加 (#4531 by @griffio)
-   [PostgreSQL ダイアレクト] `PostgreSQL CTEs auxiliary statements` が互いを参照 (`reference each other`) できるように許可 (#4493 by @griffio)
-   [PostgreSQL ダイアレクト] `binary expr` と `sum` の `PostgreSQL types` のサポートを追加 (#4539 by @Adriel-M)
-   [PostgreSQL ダイアレクト] `PostgreSQL SELECT DISTINCT ON` 構文のサポートを追加 (#4584 by @griffio)
-   [PostgreSQL ダイアレクト] `SELECT` ステートメントにおける `PostgreSQL JSON functions` サポートを追加 (#4590 by @MariusVolkhart)
-   [PostgreSQL ダイアレクト] `generate_series PostgreSQL function` を追加 (#4717 by @griffio)
-   [PostgreSQL ダイアレクト] 追加の `Postgres String function definitions` を追加 (#4752 by @MariusVolkhart)
-   [PostgreSQL ダイアレクト] `min` および `max aggregate functions` に `DATE PostgreSQL type` を追加 (#4816 by @anddani)
-   [PostgreSQL ダイアレクト] `SqlBinaryExpr` に `PostgreSql temporal types` を追加 (#4657 by @griffio)
-   [PostgreSQL ダイアレクト] `postgres` ダイアレクトに `TRUNCATE` を追加 (#4817 by @de-luca)
-   [SQLite 3.35 ダイアレクト] 順序通りに評価 (`evaluated in order`) される複数の `ON CONFLICT` 句 (`clauses`) を許可 (#4551 by @griffio)
-   [JDBC ドライバー] より快適な `SQL` 編集 (`pleasant SQL editing`) のために `Language annotations` を追加 (#4602 by @MariusVolkhart)
-   [ネイティブドライバー] ネイティブドライバー (`Native-driver`): `linuxArm64` のサポートを追加 (#4792 by @hfhbd)
-   [Android ドライバー] `AndroidSqliteDriver` に `windowSizeBytes parameter` を追加 (#4804 by @BoD)
-   [Paging3 拡張] 機能: `OffsetQueryPagingSource` に `initialOffset` を追加 (#4802 by @MohamadJaara)

### 変更
-   [コンパイラ] 適切な場合に `Kotlin types` を優先 (`Prefer Kotlin types where appropriate`) するよう変更 (#4517 by @eygraber)
-   [コンパイラ] `value type insert` を行う場合、常に列名 (`column names`) を含める (`always include`) ように変更 (#4864)
-   [PostgreSQL ダイアレクト] `PostgreSQL` ダイアレクトから実験的ステータス (`experimental status`) を削除 (#4443 by @hfhbd)
-   [PostgreSQL ダイアレクト] `PostgreSQL types` のドキュメント (`docs`) を更新 (#4569 by @MariusVolkhart)
-   [R2DBC ドライバー] PostgreSQL で整数データ型 (`integer data types`) を扱う際のパフォーマンス (`performance`) を最適化 (`Optimize`) (#4588 by @MariusVolkhart)

### 削除
-   [SQLite Javascript ドライバー] `sqljs-driver` を削除 (#4613, #4670 by @dellisd)

### 修正
-   [コンパイラ] 戻り値があり、パラメータのないグループ化されたステートメント (`grouped statements`) のコンパイル (`compilation`) を修正 (#4699 by @griffio)
-   [コンパイラ] `SqlBinaryExpr` で引数をバインド (`Bind arguments`) するように修正 (#4604 by @griffio)
-   [IDE Plugin] 設定されている場合、`IDEA Project JDK` を使用するよう修正 (#4689 by @griffio)
-   [IDE Plugin] `IDEA 2023.2` 以降での「`Unknown element type: TYPE_NAME`」エラーを修正 (#4727)
-   [IDE Plugin] `2023.2` とのいくつかの互換性問題 (`compatibility issues`) を修正
-   [Gradle プラグイン] `verifyMigrationTask Gradle task` のドキュメント (`documentation`) を修正 (#4713 by @joshfriend)
-   [Gradle プラグイン] ユーザーがデータベースを検証する前にデータベースを生成するのに役立つ `Gradle task output message` を追加 (#4684 by @jingwei99)
-   [PostgreSQL ダイアレクト] `PostgreSQL columns` の複数回の名前変更 (`renaming`) を修正 (#4566 by @griffio)
-   [PostgreSQL ダイアレクト] `4714 postgresql alter column nullability` を修正 (#4831 by @griffio)
-   [PostgreSQL ダイアレクト] `4837 alter table alter column` を修正 (#4846 by @griffio)
-   [PostgreSQL ダイアレクト] `4501 PostgreSql sequence` を修正 (#4528 by @griffio)
-   [SQLite ダイアレクト] `JSON binary operator` が列式 (`column expression`) で使用できるように許可 (#4776 by @eygraber)
-   [SQLite ダイアレクト] 名前で複数の列が見つかった場合の `Update From` の誤検出 (`false positive`) を修正 (#4777 by @eygraber)
-   [ネイティブドライバー] 名前付きインメモリデータベース (`named in-memory databases`) をサポート (#4662 by @05nelsonm)
-   [ネイティブドライバー] クエリリスナーコレクション (`query listener collection`) のスレッドセーフティ (`thread safety`) を保証 (#4567 by @kpgalligan)
-   [JDBC ドライバー] `ConnectionManager` における接続リーク (`connection leak`) を修正 (#4589 by @MariusVolkhart)
-   [JDBC ドライバー] `ConnectionManager` 型を選択する際の `JdbcSqliteDriver` の URL 解析 (`url parsing`) を修正 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 追加
-   [MySQL ダイアレクト] MySQL: `IF expression` での `timestamp/bigint` のサポート (#4329 by @shellderp)
-   [MySQL ダイアレクト] MySQL: `now` を追加 (#4431 by @hfhbd)
-   [Web ドライバー] `NPM package publishing` を有効化 (#4364)
-   [IDE Plugin] `gradle tooling` 接続 (`connect`) が失敗した場合に、スタックトレース (`stacktrace`) を表示できるようにユーザーを許可 (#4383)

### 変更
-   [Sqlite ドライバー] `JdbcSqliteDriver` のスキーママイグレーション (`schema migrations`) の使用を簡素化 (`Simplify`) (#3737 by @morki)
-   [R2DBC ドライバー] 真の非同期 `R2DBC cursor` (#4387 by @hfhbd)

### 修正
-   [IDE Plugin] 必要になるまでデータベースプロジェクトサービス (`database project service`) をインスタンス化 (`instantiate`) しないように修正 (#4382)
-   [IDE