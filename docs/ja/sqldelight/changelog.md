# 変更履歴

## 未リリース

### 追加
- [Gradle プラグイン] スキーマの開始バージョンが 1 でなく `verifyMigrations` が true の場合にビルドが失敗する問題を修正 (#6017 by @neilgmiller)
- [Gradle プラグイン] `SqlDelightWorkerTask` をより設定可能にし、Windows での開発をサポートするためにデフォルト設定を更新 (#5215 by @MSDarwish2000)
- [SQLite ダイアレクト] `FTS5` 仮想テーブルでの合成列のサポートを追加 (#5986 by @watbe)

### 変更
- [コンパイラ] パッケージ名でのアンダースコアの使用を許可。以前はアンダースコアがサニタイズされていたため、予期せぬ動作が発生していました (#6027 by @BierDav)
- [ページング拡張] AndroidX Paging に切り替え (#5910 by @jeffdgr8)

### 修正
- [SQLite ダイアレクト] カスタム列タイプを使用する場合、`group_concat` 関数に `String` 型を使用するように修正 (#6082 by @griffio)
- [Gradle プラグイン] 複雑なスキーマでハングアップする問題を解決するため、`VerifyMigrationTask` のパフォーマンスを改善 (#6073 by @Lightwood13)

## [2.2.1] - 2025-11-13
[2.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.1

### 追加
- [PostgreSQL ダイアレクト] Postgres の `numeric`/`integer`/`biginteger` 型マッピングを修正 (#5994 by @griffio)
- [コンパイラ] `CAST` が必要な場合に、ソースファイルの位置を含めるようにコンパイラのエラーメッセージを改善 (#5979 by @griffio)
- [PostgreSQL ダイアレクト] Postgres JSON オペレーターのパス抽出のサポートを追加 (#5971 by @griffio)
- [SQLite ダイアレクト] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントの `Sqlite 3.35` サポートを追加 (#5961 by @griffio)
- [PostgreSQL ダイアレクト] 共通テーブル式 (`Common Table Expressions`) を使用した `MATERIALIZED` クエリプランナーヒントのサポートを追加 (#5961 by @griffio)
- [PostgreSQL ダイアレクト] Postgres JSON 集約 `FILTER` のサポートを追加 (#5957 by @griffio)
- [PostgreSQL ダイアレクト] Postgres `Enum` のサポートを追加 (#5935 by @griffio)
- [PostgreSQL ダイアレクト] Postgres `Triggers` の限定的なサポートを追加 (#5932 by @griffio)
- [PostgreSQL ダイアレクト] SQL 式が JSON として解析できるかをチェックする述語を追加 (#5843 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql Comment On` ステートメントに対する限定的なサポートを追加 (#5808 by @griffio)
- [MySQL ダイアレクト] インデックス可視性オプションのサポートを追加 (#5785 by @orenkislev-faire)
- [PostgreSql ダイアレクト] `TSQUERY` データ型のサポートを追加 (#5779 by @griffio)
- [Gradle プラグイン] モジュール追加時のバージョンカタログ (`version catalogs`) のサポートを追加 (#5755 by @DRSchlaubi)

### 変更
- 開発中のスナップショット (`In-development snapshots`) は、`https://central.sonatype.com/repository/maven-snapshots/` の Central Portal Snapshots リポジトリに公開されるようになりました。
- [コンパイラ] コンストラクタ参照 (`constructor references`) を使用して、デフォルトで生成されるクエリを簡素化 (#5814 by @jonapoul)

### 修正
- [コンパイラ] 共通テーブル式 (`Common Table Expression`) を含む `View` を使用する際のスタックオーバーフロー (`stack overflow`) を修正 (#5928 by @griffio)
- [Gradle プラグイン] `SqlDelight` ツールウィンドウ (`tool window`) で「新しい接続 (`New Connection`)」を追加する際のクラッシュを修正 (#5906 by @griffio)
- [IntelliJ プラグイン] コピー・トゥ・SQLiteガターアクション (`copy-to-sqlite gutter action`) におけるスレッド関連のクラッシュを回避 (#5901 by @griffio)
- [IntelliJ プラグイン] `CREATE INDEX` および `CREATE VIEW` スキーマステートメント (`schema statements`) 使用時の `PostgreSql` ダイアレクトの修正 (#5772 by @griffio)
- [コンパイラ] 列参照時の `FTS` スタックオーバーフロー (`stack overflow`) を修正 (#5896 by @griffio)
- [コンパイラ] `WITH RECURSIVE` スタックオーバーフロー (`stack overflow`) を修正 (#5892 by @griffio)
- [コンパイラ] `INSERT|UPDATE|DELETE RETURNING` ステートメントの通知 (`Notify`) を修正 (#5851 by @griffio)
- [コンパイラ] `Long` を返すトランザクションブロック (`transaction blocks`) の非同期結果型 (`async result type`) を修正 (#5836 by @griffio)
- [コンパイラ] SQL パラメータバインディング (`SQL parameter binding`) の複雑度 (`complexity`) を `O(n²)` から `O(n)` に最適化 (#5898 by @chenf7)
- [SQLite ダイアレクト] `Sqlite 3.18` で不足していた関数を修正 (#5759 by @griffio)

## [2.2.0] - 2025-11-13
[2.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.2.0

一部の成果物が公開されて失敗したリリースです。2.2.1 を使用してください！

## [2.1.0] - 2025-05-16
[2.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.1.0

### 追加
- [WASM Driver] `wasmJs` の Web Worker ドライバー (`web worker driver`) へのサポートを追加 (#5534 by @IlyaGulya)
- [PostgreSQL ダイアレクト] `PostgreSql UnNest Array to rows` をサポート (#5673 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql TSRANGE/TSTZRANGE` のサポート (#5297 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql Right Full Join` のサポート (#5086 by @griffio)
- [PostgreSQL ダイアレクト] 時刻型からの `Postrgesql extract` をサポート (#5273 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql array contains operators` のサポート (#4933 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql drop constraint` をサポート (#5288 by @griffio)
- [PostgreSQL ダイアレクト] `Postgresql type casting` をサポート (#5089 by @griffio)
- [PostgreSQL ダイアレクト] サブクエリ (`subquery`) 用の `PostgreSql lateral join operator` をサポート (#5122 by @griffio)
- [PostgreSQL ダイアレクト] `Postgresql ILIKE operator` をサポート (#5330 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql XML type` をサポート (#5331 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql AT TIME ZONE` をサポート (#5243 by @griffio)
- [PostgreSQL ダイアレクト] PostgreSQL の `order by nulls` のサポートを追加 (#5199 by @griffio)
- [PostgreSQL ダイアレクト] PostgreSQL の現在日時関数 (`current date/time function`) サポートを追加 (#5226 by @drewd)
- [PostgreSQL ダイアレクト] `PostgreSql Regex operators` をサポート (#5137 by @griffio)
- [PostgreSQL ダイアレクト] `brin gist` を追加 (#5059 by @griffio)
- [MySQL ダイアレクト] `MySql` ダイアレクトの `RENAME INDEX` をサポート (#5212 by @orenkislev-faire)
- [JSON 拡張] `json table function` にエイリアスを追加 (#5372 by @griffio)

### 変更
- [コンパイラ] 生成されるクエリファイルが、シンプルなミューテーター (`mutators`) の行数 (`row counts`) を返すように変更 (#4578 by @MariusVolkhart)
- [ネイティブドライバー] `NativeSqlDatabase.kt` を更新し、`DELETE`、`INSERT`、および `UPDATE` ステートメントの読み取り専用フラグ (`readonly flag`) を変更 (#5680 by @griffio)
- [PostgreSQL ダイアレクト] `PgInterval` を `String` に変更 (#5403 by @griffio)
- [PostgreSQL ダイアレクト] `SqlDelight` モジュールが `PostgreSql` 拡張を実装 (`implement PostgreSql extensions`) できるようにサポート (#5677 by @griffio)

### 修正
- [コンパイラ] 修正: 結果を伴うグループステートメント (`group statements`) 実行時にクエリに通知するよう修正 (#5006 by @vitorhugods)
- [コンパイラ] `SqlDelightModule` 型リゾルバー (`type resolver`) を修正 (#5625 by @griffio)
- [コンパイラ] `5501` の挿入オブジェクトエスケープ列 (`insert object escaped column`) を修正 (#5503 by @griffio)
- [コンパイラ] コンパイラ: エラーメッセージ (`error message`) を改善し、パスリンク (`path links`) が正しい行 (`line`) と文字位置 (`char position`) でクリック可能 (`clickable`) になるように修正 (#5604 by @vanniktech)
- [コンパイラ] `issue 5298` を修正: キーワードをテーブル名として使用できるように修正
- [コンパイラ] 名前付き実行 (`named executes`) を修正し、テストを追加
- [コンパイラ] 初期化ステートメント (`initialization statements`) のソート時に外部キーテーブル制約 (`foreign key table constraints`) を考慮 (#5325 by @TheMrMilchmann)
- [コンパイラ] タブ (`tabs`) が関係する場合にエラー下線 (`error underlines`) を適切に揃えるよう修正 (#5224 by @drewd)
- [JDBC ドライバー] トランザクション終了時の `connectionManager` のメモリリーク (`memory leak`) を修正
- [JDBC ドライバー] ドキュメントに記載されているように、SQLite のマイグレーションをトランザクション内で実行するよう修正 (#5218 by @morki)
- [JDBC ドライバー] トランザクションコミット/ロールバック (`commit / rollback`) 後の接続リーク (`leaking connections`) を修正 (#5205 by @morki)
- [Gradle プラグイン] `DriverInitializer` を `GenerateSchemaTask` の前に実行するように修正 (#5562 by @nwagu)
- [ランタイム] 実際のドライバーが非同期 (`Async`) の場合に `LogSqliteDriver` でクラッシュする問題を修正 (#5723 by @edenman)
- [ランタイム] `StringBuilder` の容量 (`capacity`) を修正 (#5192 by @janbina)
- [PostgreSQL ダイアレクト] `PostgreSql create or replace view` を修正 (#5407 by @griffio)
- [PostgreSQL ダイアレクト] `Postgresql to_json` を修正 (#5606 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql numeric resolver` を修正 (#5399 by @griffio)
- [PostgreSQL ダイアレクト] `sqlite windows function` を修正 (#2799 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql SELECT DISTINCT ON` を修正 (#5345 by @griffio)
- [PostgreSQL ダイアレクト] `alter table add column if not exists` を修正 (#5309 by @griffio)
- [PostgreSQL ダイアレクト] `Postgresql async bind parameter` を修正 (#5313 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql boolean literals` を修正 (#5262 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql window functions` を修正 (#5155 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql isNull isNotNull types` を修正 (#5173 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql select distinct` を修正 (#5172 by @griffio)
- [ページング拡張] ページングの初期ロード時のリフレッシュ (`paging refresh initial load`) を修正 (#5615 by @evant)
- [ページング拡張] `MacOS native targets` を追加 (#5324 by @vitorhugods)
- [IntelliJ プラグイン] K2 サポート

## [2.0.2] - 2024-04-05
[2.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.2

### 追加
- [PostgreSQL ダイアレクト] PostgreSQL の `STRING_AGG` 関数を追加 (#4950 by @anddani)
- [PostgreSQL ダイアレクト] `pg` ダイアレクトに `SET` ステートメントを追加 (#4927 by @de-luca)
- [PostgreSQL ダイアレクト] `PostgreSql alter column sequence parameters` を追加 (#4916 by @griffio)
- [PostgreSQL ダイアレクト] `INSERT` ステートメントの `postgresql alter column default` サポートを追加 (#4912 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSql alter sequence` と `drop sequence` を追加 (#4920 by @griffio)
- [PostgreSQL ダイアレクト] 追加の Postgres 正規表現関数定義 (`Postgres Regex function definitions`) を追加 (#5025 by @MariusVolkhart)
- [PostgreSQL ダイアレクト] `GIN` の文法 (`grammar`) を追加 (#5027 by @griffio)

### 変更
- [IDE プラグイン] 最低バージョン (`Minimum version`) を `2023.1 / Android Studio Iguana` に引き上げ
- [コンパイラ] `encapsulatingType` での型の `null` 許容の上書き (`override the type nullability`) を許可 (#4882 by @eygraber)
- [コンパイラ] `SELECT *` の列名 (`column names`) をインライン化 (`Inline`)
- [Gradle プラグイン] `processIsolation` に切り替え (#5068 by @nwagu)
- [Android ランタイム] Android の `minSDK` を `21` に引き上げ (#5094 by @hfhbd)
- [ドライバー] ダイアレクト作成者 (`dialect authors`) 向けに `JDBC/R2DBC` ステートメントメソッドをさらに公開 (`Expose more JDBC/R2DBC statement methods`) (#5098 by @hfhbd)

### 修正
- [PostgreSQL ダイアレクト] `postgresql alter table alter column` を修正 (#4868 by @griffio)
- [PostgreSQL ダイアレクト] `4448` のテーブルモデル (`table model`) のインポート不足 (`missing import`) を修正 (#4885 by @griffio)
- [PostgreSQL ダイアレクト] `4932` の `postgresql default constraint functions` を修正 (#4934 by @griffio)
- [PostgreSQL ダイアレクト] `4879` のマイグレーション中の `alter table rename column` での `postgresql class-cast error` を修正 (#4880 by @griffio)
- [PostgreSQL ダイアレクト] `4474 PostgreSql create extension` を修正 (#4541 by @griffio)
- [PostgreSQL ダイアレクト] `5018 PostgreSql add Primary Key not nullable types` を修正 (#5020 by @griffio)
- [PostgreSQL ダイアレクト] `4703 aggregate expressions` を修正 (#5071 by @griffio)
- [PostgreSQL ダイアレクト] `5028 PostgreSql json` を修正 (#5030 by @griffio)
- [PostgreSQL ダイアレクト] `5040 PostgreSql json operators` を修正 (#5041 by @griffio)
- [PostgreSQL ダイアレクト] `5040` の `json operator binding` を修正 (#5100 by @griffio)
- [PostgreSQL ダイアレクト] `5082 tsvector` を修正 (#5104 by @griffio)
- [PostgreSQL ダイアレクト] `5032` の `PostgreSql UPDATE FROM statement` における列の隣接性 (`column adjacency`) を修正 (#5035 by @griffio)
- [SQLite ダイアレクト] `4897 sqlite alter table rename column` を修正 (#4899 by @griffio)
- [IDE プラグイン] エラーハンドラ (`error handler`) のクラッシュを修正 (#4988 by @aperfilyev)
- [IDE プラグイン] `BugSnag` が `IDEA 2023.3` で初期化に失敗 (`fails to init`) (by @aperfilyev)
- [IDE プラグイン] プラグイン (`plugin`) を介して `IntelliJ` で `.sq` ファイルを開く際の `PluginException` を修正 (by @aperfilyev)
- [IDE プラグイン] `Kotlin` ライブラリがすでにプラグインの依存関係 (`plugin dependency`) にあるため、`IntelliJ` プラグインにバンドルしないよう修正 (#5126)
- [IDE プラグイン] ストリーム (`stream`) の代わりに `extensions` 配列を使用するよう修正 (#5127)

## [2.0.1] - 2023-12-01
[2.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.1

### 追加
- [コンパイラ] `SELECT` 実行時に複数列式 (`multi-column-expr`) をサポート (#4453 by @Adriel-M)
- [PostgreSQL ダイアレクト] `PostgreSQL CREATE INDEX CONCURRENTLY` のサポートを追加 (#4531 by @griffio)
- [PostgreSQL ダイアレクト] `PostgreSQL CTEs` 補助ステートメント (`auxiliary statements`) が互いを参照 (`reference each other`) できるように許可 (#4493 by @griffio)
- [PostgreSQL ダイアレクト] `binary expr` と `sum` の `PostgreSQL` 型のサポートを追加 (#4539 by @Adriel-M)
- [PostgreSQL ダイアレクト] `PostgreSQL SELECT DISTINCT ON` 構文のサポートを追加 (#4584 by @griffio)
- [PostgreSQL ダイアレクト] `SELECT` ステートメントにおける `PostgreSQL JSON functions` サポートを追加 (#4590 by @MariusVolkhart)
- [PostgreSQL ダイアレクト] `generate_series PostgreSQL function` を追加 (#4717 by @griffio)
- [PostgreSQL ダイアレクト] 追加の Postgres 文字列関数定義 (`Postgres String function definitions`) を追加 (#4752 by @MariusVolkhart)
- [PostgreSQL ダイアレクト] `min` および `max aggregate functions` に `DATE PostgreSQL type` を追加 (#4816 by @anddani)
- [PostgreSQL ダイアレクト] `SqlBinaryExpr` に `PostgreSql temporal types` を追加 (#4657 by @griffio)
- [PostgreSQL ダイアレクト] `postgres` ダイアレクトに `TRUNCATE` を追加 (#4817 by @de-luca)
- [SQLite 3.35 ダイアレクト] 順序通りに評価 (`evaluated in order`) される複数の `ON CONFLICT` 句 (`clauses`) を許可 (#4551 by @griffio)
- [JDBC ドライバー] より快適な SQL 編集 (`pleasant SQL editing`) のために言語アノテーション (`Language annotations`) を追加 (#4602 by @MariusVolkhart)
- [ネイティブドライバー] ネイティブドライバー (`Native-driver`): `linuxArm64` のサポートを追加 (#4792 by @hfhbd)
- [Android ドライバー] `AndroidSqliteDriver` に `windowSizeBytes parameter` を追加 (#4804 by @BoD)
- [Paging3 拡張] 機能: `OffsetQueryPagingSource` に `initialOffset` を追加 (#4802 by @MohamadJaara)

### 変更
- [コンパイラ] 適切な場合に `Kotlin` 型 (`Kotlin types`) を優先 (`Prefer Kotlin types`) するよう変更 (#4517 by @eygraber)
- [コンパイラ] 値型挿入 (`value type insert`) を行う場合、常に列名 (`column names`) を含める (`always include`) ように変更 (#4864)
- [PostgreSQL ダイアレクト] `PostgreSQL` ダイアレクトから実験的ステータス (`experimental status`) を削除 (#4443 by @hfhbd)
- [PostgreSQL ダイアレクト] `PostgreSQL` 型のドキュメント (`docs`) を更新 (#4569 by @MariusVolkhart)
- [R2DBC ドライバー] PostgreSQL で整数データ型 (`integer data types`) を扱う際のパフォーマンス (`performance`) を最適化 (`Optimize`) (#4588 by @MariusVolkhart)

### 削除
- [SQLite Javascript ドライバー] `sqljs-driver` を削除 (#4613, #4670 by @dellisd)

### 修正
- [コンパイラ] 戻り値があり、パラメータのないグループ化されたステートメント (`grouped statements`) のコンパイル (`compilation`) を修正 (#4699 by @griffio)
- [コンパイラ] `SqlBinaryExpr` で引数をバインド (`Bind arguments`) するように修正 (#4604 by @griffio)
- [IDE プラグイン] 設定されている場合、`IDEA Project JDK` を使用するよう修正 (#4689 by @griffio)
- [IDE プラグイン] `IDEA 2023.2` 以降での「`Unknown element type: TYPE_NAME`」エラーを修正 (#4727)
- [IDE プラグイン] `2023.2` とのいくつかの互換性問題 (`compatibility issues`) を修正
- [Gradle プラグイン] `verifyMigrationTask Gradle` タスクのドキュメント (`documentation`) を修正 (#4713 by @joshfriend)
- [Gradle プラグイン] ユーザーがデータベースを検証する前にデータベースを生成するのに役立つ `Gradle task output message` を追加 (#4684 by @jingwei99)
- [PostgreSQL ダイアレクト] `PostgreSQL columns` の複数回の名前変更 (`renaming`) を修正 (#4566 by @griffio)
- [PostgreSQL ダイアレクト] `4714 postgresql alter column nullability` を修正 (#4831 by @griffio)
- [PostgreSQL ダイアレクト] `4837 alter table alter column` を修正 (#4846 by @griffio)
- [PostgreSQL ダイアレクト] `4501 PostgreSql sequence` を修正 (#4528 by @griffio)
- [SQLite ダイアレクト] `JSON binary operator` が列式 (`column expression`) で使用できるように許可 (#4776 by @eygraber)
- [SQLite ダイアレクト] 名前で複数の列が見つかった場合の `Update From` の誤検出 (`false positive`) を修正 (#4777 by @eygraber)
- [ネイティブドライバー] 名前付きインメモリデータベース (`named in-memory databases`) をサポート (#4662 by @05nelsonm)
- [ネイティブドライバー] クエリリスナーコレクション (`query listener collection`) のスレッドセーフティ (`thread safety`) を保証 (#4567 by @kpgalligan)
- [JDBC ドライバー] `ConnectionManager` における接続リーク (`connection leak`) を修正 (#4589 by @MariusVolkhart)
- [JDBC ドライバー] `ConnectionManager` 型を選択する際の `JdbcSqliteDriver` の URL 解析 (`url parsing`) を修正 (#4656 by @05nelsonm)

## [2.0.0] - 2023-07-26
[2.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0

### 追加
- [MySQL ダイアレクト] MySQL: `IF expression` での `timestamp/bigint` のサポート (#4329 by @shellderp)
- [MySQL ダイアレクト] MySQL: `now` を追加 (#4431 by @hfhbd)
- [Web ドライバー] `NPM package publishing` を有効化 (#4364)
- [IDE プラグイン] `gradle tooling` 接続 (`connect`) が失敗した場合に、スタックトレース (`stacktrace`) を表示できるようにユーザーを許可 (#4383)

### 変更
- [Sqlite ドライバー] `JdbcSqliteDriver` のスキーマのマイグレーション (`schema migrations`) の使用を簡素化 (`Simplify`) (#3737 by @morki)
- [R2DBC ドライバー] 真の非同期 `R2DBC cursor` (#4387 by @hfhbd)

### 修正
- [IDE プラグイン] 必要になるまでデータベースプロジェクトサービス (`database project service`) をインスタンス化 (`instantiate`) しないように修正 (#4382)
- [IDE プラグイン] 使用箇所の検索 (`find usages`) 中のプロセスキャンセル (`process cancellation`) を処理 (#4340)
- [IDE プラグイン] IDE の非同期コード (`async code`) 生成を修正 (#4406)
- [IDE プラグイン] パッケージ構造のアセンブリ (`assembly of the package structure`) を一度だけ計算され (`one-time computed`)、EDT の外で行われるように移動 (#4417)
- [IDE プラグイン] `2023.2` の `Kotlin` 型解決 (`kotlin type resolution`) に正しいスタブインデックスキー (`stub index key`) を使用 (#4416)
- [IDE プラグイン] 検索を実行する前にインデックス (`index`) の準備が整うまで待機 (#4419)
- [IDE プラグイン] インデックスが利用できない場合、ジャンプ (`goto`) を実行しない (#4420)
- [コンパイラ] グループ化されたステートメントの結果式 (`result expression`) を修正 (#4378)
- [コンパイラ] 仮想テーブル (`virtual table`) をインターフェース型 (`interface type`) として使用しない (#4427 by @hfhbd)

## [2.0.0-rc02] - 2023-06-27
[2.0.0-rc02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc02

### 追加
- [MySQL ダイアレクト] 小文字の日付型 (`lowercase date types`) と日付型での最小値/最大値 (`min and max on date types`) をサポート (#4243 by @shellderp)
- [MySQL ダイアレクト] バイナリ式 (`binary expr`) と合計 (`sum`) の `MySQL` 型をサポート (#4254 by @shellderp)
- [MySQL ダイアレクト] 表示幅なし符号なし整数 (`unsigned ints without display width`) をサポート (#4306 by @shellderp)
- [MySQL ダイアレクト] `LOCK IN SHARED MODE` をサポート
- [PostgreSQL ダイアレクト] `boolean` と `Timestamp` の最小値/最大値 (`min max`) を追加 (#4245 by @griffio)
- [PostgreSQL ダイアレクト] Postgres: ウィンドウ関数サポート (`window function support`) を追加 (#4283 by @hfhbd)
- [ランタイム] `linuxArm64`、`androidNative`、`watchosDeviceArm` ターゲットをランタイムに追加 (#4258 by @hfhbd)
- [ページング拡張] `linux` と `mingw x64` ターゲットをページング拡張 (`paging extension`) に追加 (#4280 by @chippman)

### 変更
- [Gradle プラグイン] `Android API 34` の自動ダイアレクトサポート (`automatic dialect support`) を追加 (#4251)
- [ページング拡張] `QueryPagingSource` での `SuspendingTransacter` のサポートを追加 (#4292 by @daio)
- [ランタイム] `addListener` API を改善 (#4244 by @hfhbd)
- [ランタイム] マイグレーションバージョン (`migration version`) として `Long` を使用 (#4297 by @hfhbd)

### 修正
- [Gradle プラグイン] 生成されたソース (`Generated source`) の安定した出力パス (`stable output path`) を使用 (#4269 by @joshfriend)
- [Gradle プラグイン] `Gradle tweaks` (#4222 by @3flex)

## [2.0.0-rc01] - 2023-05-29
[2.0.0-rc01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-rc01

### 追加
- [ページング] `js browser` ターゲットをページング拡張 (`paging extensions`) に追加 (#3843 by @sproctor)
- [ページング] `androidx-paging3` 拡張に `iosSimulatorArm64` ターゲットを追加 (#4117)
- [PostgreSQL ダイアレクト] `gen_random_uuid()` のサポートとテストを追加 (#3855 by @davidwheeler123)
- [PostgreSQL ダイアレクト] `Alter table add constraint` (`ALTER TABLE ADD CONSTRAINT`) Postgres を追加 (#4116 by @griffio)
- [PostgreSQL ダイアレクト] `Alter table add constraint check` (`CONSTRAINT CHECK を追加`) (#4120 by @griffio)
- [PostgreSQL ダイアレクト] `postgreSql character length functions` (`PostgreSQL 文字長関数`) を追加 (#4121 by @griffio)
- [PostgreSQL ダイアレクト] `postgreSql column default interval` (`PostgreSQL 列のデフォルト間隔`) を追加 (#4142 by @griffio)
- [PostgreSQL ダイアレクト] `postgreSql interval column result` (`PostgreSQL 間隔列の結果`) を追加 (#4152 by @griffio)
- [PostgreSQL ダイアレクト] `postgreSql Alter Column` (`PostgreSQL ALTER COLUMN`) を追加 (#4165 by @griffio)
- [PostgreSQL ダイアレクト] PostgreSQL: `date_part` を追加 (#4198 by @hfhbd)
- [MySQL ダイアレクト] `sql char length functions` (`SQL 文字長関数`) を追加 (#4134 by @griffio)
- [IDE プラグイン] `sqldelight` ディレクトリの提案 (`directory suggestions`) を追加 (#3976 by @aperfilyev)
- [IDE プラグイン] プロジェクトツリーの中間パッケージをコンパクト化 (`Compact middle packages in project tree`) (#3992 by @aperfilyev)
- [IDE プラグイン] 結合句の補完 (`join clause completion`) を追加 (#4086 by @aperfilyev)
- [IDE プラグイン] ビュー作成のインテンションとライブテンプレート (`Create view intention and live template`) (#4074 by @aperfilyev)
- [IDE プラグイン] `DELETE` または `UPDATE` 内の `WHERE` 句の不足に関する警告 (`Warn about missing WHERE inside DELETE or UPDATE`) (#4058 by @aperfilyev)
- [Gradle プラグイン] タイプセーフなプロジェクトアクセサ (`typesafe project accessors`) を有効化 (#4005 by @hfhbd)

### 変更
- [Gradle プラグイン] `ServiceLoader` メカニズムで `VerifyMigrationTask` 用の `DriverInitializer` の登録を許可 (#3986 by @C2H6O)
- [Gradle プラグイン] 明示的なコンパイラ環境 (`explicit compiler env`) を作成 (#4079 by @hfhbd)
- [JS Driver] Web Worker ドライバーを別のアートファクトに分割 (`Split web worker driver into separate artifact`)
- [JS Driver] `JsWorkerSqlCursor` を公開しない (#3874 by @hfhbd)
- [JS Driver] `sqljs` ドライバーの公開を無効化 (`Disable publication`) (#4108)
- [ランタイム] 同期ドライバー (`synchronous drivers`) が同期スキーマ初期化子 (`synchronous schema initializer`) を要求するように強制 (#4013)
- [ランタイム] カーソル (`Cursors`) の非同期サポート (`async support`) を改善 (#4102)
- [ランタイム] 非推奨ターゲット (`deprecated targets`) を削除 (#4149 by @hfhbd)
- [ランタイム] 古い MM (`old MM`) のサポートを削除 (#4148 by @hfhbd)

### 修正
- [R2DBC ドライバー] `R2DBC`: ドライバーのクローズを待機 (`Await closing the driver`) (#4139 by @hfhbd)
- [コンパイラ] マイグレーションからの `PRAGMA` を `database create(SqlDriver)` に含める (#3845 by @MariusVolkhart)
- [コンパイラ] `RETURNING` 句のコード生成 (`codegen for RETURNING clause`) を修正 (#3872 by @MariusVolkhart)
- [コンパイラ] 仮想テーブル (`virtual tables`) の型を生成しない (#4015)
- [Gradle プラグイン] `Gradle` プラグインの細かな `QoL` 改善 (`Small Gradle plugin QoL improvements`) (#3930 by @zacsweers)
- [IDE プラグイン] 解決されていない `Kotlin` 型 (`unresolved kotlin types`) を修正 (#3924 by @aperfilyev)
- [IDE プラグイン] 修飾子 (`qualifier`) を使用してワイルドカード展開のインテンション (`expand wildcard intention`) が動作するように修正 (#3979 by @aperfilyev)
- [IDE プラグイン] `java home` が不足している場合、利用可能な `JDK` (`available jdk`) を使用する (#3925 by @aperfilyev)
- [IDE プラグイン] パッケージ名での使用箇所検索 (`find usages on package names`) を修正 (#4010)
- [IDE プラグイン] 無効な要素の自動インポート (`show auto imports for invalid elements`) を表示しない (#4008)
- [IDE プラグイン] ダイアレクトが見つからない場合に解決 (`resolve if a dialect is missing`) しない (#4009)
- [IDE プラグイン] 無効化された状態での `IDE` によるコンパイラの実行 (`Ignore IDE runs of the compiler during an invalidated state`) を無視 (#4016)
- [IDE プラグイン] `IntelliJ 2023.1` のサポートを追加 (#4037 by @madisp)
- [IDE プラグイン] 列名変更時の名前付き引数の使用箇所をリネーム (`Rename named argument usage on column rename`) (#4027 by @aperfilyev)
- [IDE プラグイン] マイグレーション追加ポップアップ (`add migration popup`) を修正 (#4105 by @aperfilyev)
- [IDE プラグイン] マイグレーションファイルでの `SchemaNeedsMigrationInspection` を無効化 (`Disable SchemaNeedsMigrationInspection in migration files`) (#4106 by @aperfilyev)
- [IDE プラグイン] 型名ではなく `SQL` 列名をマイグレーション生成に使用 (`Use sql column name for migration generation instead of type name`) (#4112 by @aperfilyev)

## [2.0.0-alpha05] - 2023-01-20
[2.0.0-alpha05]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha05

### 追加
- [ページング] マルチプラットフォームページング拡張 (`Multiplatform paging extension`) (by @jeffdgr8)
- [ランタイム] `Listener` インターフェースに `fun` 修飾子 (`fun modifier to Listener interface`) を追加。
- [SQLite ダイアレクト] `SQLite 3.33` (UPDATE FROM) のサポート (`SQLite 3.33 support (UPDATE FROM)`) (by @eygraber)
- [PostgreSQL ダイアレクト] PostgreSQL での `UPDATE FROM` をサポート (by @eygraber)

### 変更
- [RDBC Driver] 接続を公開 (`Expose the connection`) (by @hfhbd)
- [ランタイム] 主要な `migrate` 関数へのマイグレーションコールバック (`migration callbacks into main `migrate` fun`) を移動
- [Gradle プラグイン] 下流プロジェクトからの設定を非表示 (`Hide Configurations from downstream projects`)
- [Gradle プラグイン] `IntelliJ` のみをシェード (`Only shade Intellij`) (by @hfhbd)
- [Gradle プラグイン] `Kotlin 1.8.0-Beta` をサポートし、複数バージョン `Kotlin` テスト (`multi version Kotlin test`) を追加 (by @hfhbd)

### 修正
- [RDBC Driver] `javaObjectType` を使用 (by @hfhbd)
- [RDBC Driver] `bindStatement` でのプリミティブな `null` 値 (`primitive null values`) を修正 (by @hfhbd)
- [RDBC Driver] `R2DBC 1.0` (`R2DBC 1.0`) をサポート (by @hfhbd)
- [PostgreSQL ダイアレクト] Postgres: 型パラメータなしの配列 (`Array without type parameter`) を修正 (by @hfhbd)
- [IDE プラグイン] `intellij` を `221.6008.13` にバンプ (`Bump intellij to 221.6008.13`) (by @hfhbd)
- [コンパイラ] 純粋なビューから再帰的な元テーブルを解決 (`Resolve recursive origin table from pure views`) (by @hfhbd)
- [コンパイラ] テーブルの外部キー句からの値クラス (`value classes from table foreign key clause`) を使用 (by @hfhbd)
- [コンパイラ] `SelectQueryGenerator` が括弧なしのバインド式 (`bind expression without parenthesis`) をサポートするように修正 (by @bellatoris)
- [コンパイラ] トランザクション使用時の `${name}Indexes` 変数の重複生成 (`duplicate generation of ${name}Indexes variables when using transactions`) を修正 (by @sachera)

## [1.5.5] - 2023-01-20
[1.5.5]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.5

これは `Kotlin 1.8` および `IntelliJ 2021+` の互換性リリースであり、`JDK 17` をサポートします。

## [1.5.4] - 2022-10-06
[1.5.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.4

これは `Kotlin 1.7.20` および `AGP 7.3.0` の互換性アップデートです。

## [2.0.0-alpha04] - 2022-10-03
[2.0.0-alpha04]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha04

### 破壊的変更

- ページング 3 拡張 API は、カウントに `int` 型のみを許可するように変更されました。
- コルーチン拡張は、デフォルトではなくディスパッチャを渡す必要があります。
- ダイアレクトとドライバークラスは `final` であり、代わりに委譲を使用してください。

### 追加
- [HSQL ダイアレクト] Hsql: `INSERT` で生成される列の `DEFAULT` の使用をサポート (#3372 by @hfhbd)
- [PostgreSQL ダイアレクト] PostgreSQL: `INSERT` で生成される列の `DEFAULT` の使用をサポート (#3373 by @hfhbd)
- [PostgreSQL ダイアレクト] PostgreSQL に `NOW()` を追加 (#3403 by @hfhbd)
- [PostgreSQL ダイアレクト] PostgreSQL に `NOT` オペレーターを追加 (#3504 by @hfhbd)
- [ページング] `*QueryPagingSource` に `CoroutineContext` を渡せるようにする (#3384)
- [Gradle プラグイン] ダイアレクト向けバージョンカタログサポートの改善 (`better version catalog support for dialects`) を追加 (#3435)
- [ネイティブドライバー] `NativeSqliteDriver` の `DatabaseConfiguration` 作成にフックするコールバック (`callback to hook into DatabaseConfiguration creation of NativeSqliteDriver`) を追加 (#3512 by @svenjacobs)

### 変更
- [ページング] `KeyedQueryPagingSource` に裏打ちされた `QueryPagingSource` 関数にデフォルトディスパッチャ (`default dispatcher`) を追加 (#3385)
- [ページング] `OffsetQueryPagingSource` を `Int` のみで動作させる (`Make OffsetQueryPagingSource only work with Int`) (#3386)
- [非同期ランタイム] `await*` を上位クラス `ExecutableQuery` に移動 (`Move await* to upper class ExecutableQuery`) (#3524 by @hfhbd)
- [コルーチン拡張] フロー拡張へのデフォルトパラメータを削除 (`Remove default params to flow extensions`) (#3489)

### 修正
- [Gradle プラグイン] `Kotlin 1.7.20` に更新 (#3542 by @zacsweers)
- [R2DBC ドライバー] 常に値を送信しない `R2DBC` の変更 (`Adopt R2DBC changes which do not always send a value`) を採用 (#3525 by @hfhbd)
- [HSQL ダイアレクト] `Hsql` を使用した `SQLite VerifyMigrationTask` の失敗 (`failing sqlite VerifyMigrationTask with Hsql`) を修正 (#3380 by @hfhbd)
- [Gradle プラグイン] タスクを遅延設定 API (`lazy configuration API`) を使用するように変換 (by @3flex)
- [Gradle プラグイン] `Kotlin 1.7.20` での `NPE` を回避 (`Avoid NPEs in Kotlin 1.7.20`) (#3398 by @ZacSweers)
- [Gradle プラグイン] スカッシュマイグレーションタスク (`squash migrations task`) の説明を修正 (#3449)
- [IDE プラグイン] 新しい `Kotlin` プラグインでの `NoSuchFieldError` を修正 (#3422 by @madisp)
- [IDE プラグイン] `IDEA`: `UnusedQueryInspection` - `ArrayIndexOutOfBoundsException` を修正 (#3427 by @vanniktech)
- [IDE プラグイン] 古い `Kotlin` プラグイン参照にリフレクション (`reflection for old kotlin plugin references`) を使用
- [コンパイラ] 拡張関数を持つカスタムダイアレクトはインポートを作成しない (`Custom dialect with extension function don't create imports`) (#3338 by @hfhbd)
- [コンパイラ] `CodeBlock.of("${CodeBlock.toString()}")` のエスケープを修正 (#3340 by @hfhbd)
- [コンパイラ] マイグレーションでの非同期実行ステートメントを待機 (`Await async execute statements in migrations`) (#3352)
- [コンパイラ] `AS` を修正 (#3370 by @hfhbd)
- [コンパイラ] `getObject` メソッドが実際の型の自動補完をサポート (`getObject method supports automatic filling of the actual type`) (#3401 by @robxyy)
- [コンパイラ] 非同期グループ化された returning ステートメントのコード生成 (`codegen for async grouped returning statements`) を修正 (#3411)
- [コンパイラ] 可能であればバインドパラメータの `Kotlin` 型を推論し、そうでなければより良いエラーメッセージで失敗する (`Infer the Kotlin type of bind parameter, if possible, or fail with a better error message`) (#3413 by @hfhbd)
- [コンパイラ] `ABS("foo")` を許可しない (#3430 by @hfhbd)
- [コンパイラ] 他のパラメータから `Kotlin` 型を推論するのをサポート (`Support inferring kotlin type from other parameters`) (#3431 by @hfhbd)
- [コンパイラ] 常にデータベース実装を作成 (`Always create the database implementation`) (#3540 by @hfhbd)
- [コンパイラ] `javaDoc` を緩和し、カスタムマッパー関数にも追加 (`Relax javaDoc and add it to custom mapper function too`) (#3554 @hfhbd)
- [コンパイラ] バインディングの `DEFAULT` を修正 (by @hfhbd)
- [ページング] `Paging 3` の修正 (#3396)
- [ページング] `OffsetQueryPagingSource` を `Long` で構築できるようにする (`Allow construction of OffsetQueryPagingSource with Long`) (#3409)
- [ページング] `Dispatchers.Main` を静的にスワップしない (`Don't statically swap Dispatchers.Main`) (#3428)

## [2.0.0-alpha03] - 2022-06-17
[2.0.0-alpha03]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha03

### 破壊的変更

- ダイアレクトは、実際の `Gradle` 依存関係のように参照されるようになりました。
```groovy
sqldelight {
  MyDatabase {
    dialect("app.cash.sqldelight:postgres-dialect:2.0.0-alpha03")
  }
}
```
- `AfterVersionWithDriver` 型は削除され、常にドライバーを持つ `AfterVersion` が優先されます。
- `Schema` 型は `SqlDriver` のサブタイプではなくなりました。
- `PreparedStatement` API はゼロベースのインデックスで呼び出されるようになりました。

### 追加
- [IDE プラグイン] 実行中のデータベースに対して `SQLite`、`MySQL`、`PostgreSQL` コマンドを実行するサポートを追加 (#2718 by @aperfilyev)
- [IDE プラグイン] `Android Studio DB inspector` のサポートを追加 (#3107 by @aperfilyev)
- [ランタイム] 非同期ドライバー (`async drivers`) のサポートを追加 (#3168 by @dellisd)
- [ネイティブドライバー] 新しい `Kotlin Native memory model` をサポート (#3177 by @kpgalligan)
- [JS Driver] `SqlJs` ワーカー (`SqlJs workers`) 用のドライバーを追加 (#3203 by @dellisd)
- [Gradle プラグイン] `SQLDelight` タスクのクラスパスを公開 (`Expose the classpath for SQLDelight tasks`)
- [Gradle プラグイン] マイグレーションをスカッシュするための `Gradle` タスク (`gradle task for squashing migrations`) を追加
- [Gradle プラグイン] マイグレーションチェック中にスキーマ定義を無視するフラグ (`flag to ignore schema definitions during migration checks`) を追加
- [MySQL ダイアレクト] `MySQL` での `FOR SHARE` および `FOR UPDATE` をサポート (#3098)
- [MySQL ダイアレクト] `MySQL` インデックスヒント (`MySQL index hints`) をサポート (#3099)
- [PostgreSQL ダイアレクト] `date_trunc` を追加 (#3295 by @hfhbd)
- [JSON 拡張] `JSON` テーブル関数 (`JSON table functions`) をサポート (#3090)

### 変更
- [ランタイム] ドライバーなしの `AfterVersion` 型を削除 (`Remove the AfterVersion type without the driver`) (#3091)
- [ランタイム] `Schema` 型をトップレベルに移動 (`Move Schema type to top-level`)
- [ランタイム] サードパーティの実装をサポートするためにダイアレクトとリゾルバーを公開 (`Open dialect and resolver to support 3rd party implementations`) (#3232 by @hfhbd)
- [コンパイラ] 失敗レポートにコンパイルに使用されたダイアレクトを含める (`Include the dialect used to compile in failure reports`) (#3086)
- [コンパイラ] 未使用のアダプターをスキップ (`Skip unused adapters`) (#3162 by @eygraber)
- [コンパイラ] `PrepareStatement` でゼロベースのインデックスを使用 (`Use zero based index in PrepareStatement`) (#3269 by @hfhbd)
- [Gradle プラグイン] ダイアレクトを文字列ではなく適切な `Gradle` 依存関係にする (`make the dialect a proper gradle dependency instead of a string`) (#3085)
- [Gradle プラグイン] `Gradle Verify Task`: データベースファイルが見つからない場合にエラーをスロー (`Throw when missing database file`) (#3126 by @vanniktech)

### 修正
- [Gradle プラグイン] `Gradle` プラグインの細かなクリーンアップと調整 (`Minor cleanups and tweaks to the Gradle plugin`) (#3171 by @3flex)
- [Gradle プラグイン] 生成されたディレクトリに `AGP` 文字列を使用しない (`Dont use an AGP string for the generated directory`)
- [Gradle プラグイン] `AGP namespace attribute` を使用 (#3220)
- [Gradle プラグイン] `kotlin-stdlib` を `Gradle` プラグインのランタイム依存関係として追加しない (`Do not add kotlin-stdlib as a runtime dependency of the Gradle plugin`) (#3245 by @mbonnin)
- [Gradle プラグイン] マルチプラットフォーム設定を簡素化 (`Simplify the multiplatform configuration`) (#3246 by @mbonnin)
- [Gradle プラグイン] `js only projects` をサポート (`Support js only projects`) (#3310 by @hfhbd)
- [IDE プラグイン] `gradle tooling API` に `java home` を使用 (#3078)
- [IDE プラグイン] `IDE` プラグイン内で適切なクラスローダーに `JDBC` ドライバーをロード (`Load the JDBC driver on the correct classLoader inside the IDE plugin`) (#3080)
- [IDE プラグイン] 既存の `PSI` 変更中のエラーを避けるため、無効化する前にファイル要素を `null` としてマーク (`Mark the file element as null before invalidating to avoid errors during already existing PSI changes`) (#3082)
- [IDE プラグイン] `ALTER TABLE` ステートメントで新しいテーブル名の使用箇所を検索する際にクラッシュしない (`Dont crash finding usages of the new table name in an ALTER TABLE statement`) (#3106)
- [IDE プラグイン] インスペクターを最適化し、予期される例外タイプに対してサイレントに失敗できるようにする (`Optimize the inspectors and enable them to fail silently for expected exception types`) (#3121)
- [IDE プラグイン] 生成されるべきディレクトリのファイルを削除 (`Delete files that should be generated directories`) (#3198)
- [IDE プラグイン] `not-safe` オペレーター呼び出しを修正
- [コンパイラ] `RETURNING` ステートメントを含む更新および削除がクエリを実行することを保証 (`Ensure updates and deletes with RETURNING statements execute queries`) (#3084)
- [コンパイラ] 複合 `SELECT` で引数型を正しく推論 (`Correctly infer argument types in compound selects`) (#3096)
- [コンパイラ] 共通テーブルはデータクラスを生成しないため、それらを返さない (`Common tables do not generate data classes so dont return them`) (#3097)
- [コンパイラ] トップのマイグレーションファイルをより速く見つける (`Find the top migration file faster`) (#3108)
- [コンパイラ] パイプオペレーターで `null` 許容を適切に継承 (`Properly inherit nullability on the pipe operator`)
- [コンパイラ] `iif ANSI SQL` 関数をサポート
- [コンパイラ] 空のクエリファイルを生成しない (`Don't generate empty query files`) (#3300 by @hfhbd)
- [コンパイラ] 疑問符のみのアダプターを修正 (`Fix adapter with question mark only`) (#3314 by @hfhbd)
- [PostgreSQL ダイアレクト] Postgres の主キー列は常に非 `null` (#3092)
- [PostgreSQL ダイアレクト] 複数のテーブルで同じ名前のコピーを修正 (`Fix copy with same name in multiple tables`) (#3297 by @hfhbd)
- [SQLite 3.35 ダイアレクト] `ALTER TABLE` で変更されたテーブルからインデックス付き列を削除する場合のみエラーを表示 (`Only show an error when dropping an indexed column from the altered table`) (#3158 by @eygraber)

## [2.0.0-alpha02] - 2022-04-13
[2.0.0-alpha02]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha02

### 破壊的変更

- `app.cash.sqldelight.runtime.rx` のすべての出現箇所を `app.cash.sqldelight.rx2` に置き換える必要があります。

### 追加
- [コンパイラ] グループ化されたステートメントの最後に返すのをサポート
- [コンパイラ] ダイアレクトモジュールを介したコンパイラ拡張をサポートし、`SQLite JSON` 拡張を追加 (#1379, #2087)
- [コンパイラ] 値を返す `PRAGMA` ステートメントをサポート (#1106)
- [コンパイラ] マークされた列の値型生成をサポート
- [コンパイラ] 楽観的ロックと検証のサポートを追加 (#1952)
- [コンパイラ] 複数更新ステートメントをサポート
- [PostgreSQL] Postgres の returning ステートメントをサポート
- [PostgreSQL] Postgres の日付型をサポート
- [PostgreSQL] `PG` の `interval` をサポート
- [PostgreSQL] `PG` の `Boolean` をサポートし、`ALTER TABLE` での挿入を修正
- [PostgreSQL] Postgres のオプションの `LIMIT` をサポート
- [PostgreSQL] `PG` の `BYTEA` 型をサポート
- [PostgreSQL] Postgres の `SERIAL` 型のテストを追加
- [PostgreSQL] 更新 Postgres 構文をサポート
- [PostgreSQL] `PostgreSQL` の配列型をサポート
- [PostgreSQL] `PG` で `UUID` 型を適切に保存/取得
- [PostgreSQL] `PostgreSQL` の `NUMERIC` 型をサポート (#1882)
- [PostgreSQL] 共通テーブル式内でクエリを返すのをサポート (#2471)
- [PostgreSQL] `JSON` 固有のオペレーターをサポート
- [PostgreSQL] Postgres Copy を追加 (by @hfhbd)
- [MySQL] `MySQL Replace` をサポート
- [MySQL] `NUMERIC/BigDecimal MySQL` 型をサポート (#2051)
- [MySQL] `MySQL TRUNCATE` ステートメントをサポート
- [MySQL] `MySQL` で `JSON` 固有のオペレーターをサポート (by @eygraber)
- [MySQL] `MySql INTERVAL` をサポート (#2969 by @eygraber)
- [HSQL] `HSQL` ウィンドウ機能を追加
- [SQLite] `WHERE` 句で `null` 許容パラメータの等価性チェックを置き換えない (#1490 by @eygraber)
- [SQLite] `SQLite 3.35` の returning ステートメントをサポート (#1490 by @eygraber)
- [SQLite] `GENERATED` 句をサポート
- [SQLite] `Sqlite 3.38` ダイアレクトのサポートを追加 (by @eygraber)

### 変更
- [コンパイラ] 生成されたコードを少しクリーンアップ
- [コンパイラ] グループ化されたステートメントでのテーブルパラメータの使用を禁止 (#1822)
- [コンパイラ] グループ化されたクエリをトランザクション内に入れる (#2785)
- [ランタイム] ドライバーの `execute` メソッドから更新された行数を返す
- [ランタイム] `SqlCursor` を接続にアクセスするクリティカルセクションに限定 (#2123 by @andersio)
- [Gradle プラグイン] マイグレーションのスキーマ定義を比較 (#841)
- [PostgreSQL] `PG` で二重引用符を禁止
- [MySQL] `MySQL` での `==` の使用時にエラー (#2673)

### 修正
- [コンパイラ] 異なるテーブルの同じアダプター型が `2.0 alpha` でコンパイルエラーを引き起こす問題を修正
- [コンパイラ] `upsert` ステートメントのコンパイル問題 (#2791)
- [コンパイラ] 複数のマッチがある場合、クエリ結果は `SELECT` 内のテーブルを使用すべき (#1874, #2313)
- [コンパイラ] `INSTEAD OF` トリガーを持つビューの更新をサポート (#1018)
- [コンパイラ] 関数名に 'from' と 'for' をサポート
- [コンパイラ] 関数式で `SEPARATOR` キーワードを許可
- [コンパイラ] `ORDER BY` でエイリアスされたテーブルの `ROWID` にアクセスできない
- [コンパイラ] `MySQL` の `HAVING` 句でエイリアスされた列名が認識されない
- [コンパイラ] 誤った「複数の列が見つかりました」エラー
- [コンパイラ] `PRAGMA locking_mode = EXCLUSIVE` を設定できない
- [PostgreSQL] `Postgresql` の列名変更
- [MySQL] `UNIX_TIMESTAMP`、`TO_SECONDS`、`JSON_ARRAYAGG MySQL` 関数が認識されない
- [SQLite] `SQLite` ウィンドウ機能の修正
- [IDE プラグイン] 空のプログレスインジケーターで `goto` ハンドラーを実行 (#2990)
- [IDE プラグイン] プロジェクトが設定されていない場合、ハイライトビジターが実行されないようにする (#2981, #2976)
- [IDE プラグイン] 推移的に生成されたコードも `IDE` で更新されるようにする (#1837)
- [IDE プラグイン] ダイアレクト更新時にインデックスを無効化

## [2.0.0-alpha01] - 2022-03-31
[2.0.0-alpha01]: https://github.com/sqldelight/sqldelight/releases/tag/2.0.0-alpha01

これは `2.0` の最初のアルファリリースであり、いくつかの破壊的変更が含まれています。今後も `ABI` 破壊的変更が予想されるため、このリリースに依存するライブラリは公開しないでください（アプリケーションは問題ありません）。

### 破壊的変更

- まず、`com.squareup.sqldelight` のすべての出現箇所を `app.cash.sqldelight` に置き換える必要があります。
- 次に、`app.cash.sqldelight.android` のすべての出現箇所を `app.cash.sqldelight.driver.android` に置き換える必要があります。
- 3 番目に、`app.cash.sqldelight.sqlite.driver` のすべての出現箇所を `app.cash.sqldelight.driver.jdbc.sqlite` に置き換える必要があります。
- 4 番目に、`app.cash.sqldelight.drivers.native` のすべての出現箇所を `app.cash.sqldelight.driver.native` に置き換える必要があります。
- `IDE` プラグインは `2.X` バージョンにアップデートする必要があります。これは [alpha または eap チャンネル](https://plugins.jetbrains.com/plugin/8191-sqldelight/versions/alpha)で見つけることができます。
- ダイアレクトは、`Gradle` 内で指定できる依存関係になりました。

```gradle
sqldelight {
  MyDatabase {
    packageName = "com.example"
    dialect = "app.cash.sqldelight:mysql-dialect:2.0.0-alpha01"
  }
}
```

現在サポートされているダイアレクトは `mysql-dialect`、`postgresql-dialect`、`hsql-dialect`、`sqlite-3-18-dialect`、`sqlite-3-24-dialect`、`sqlite-3-25-dialect`、`sqlite-3-30-dialect`、および `sqlite-3-35-dialect` です。

- プリミティブ型はインポートする必要があります（例: `INTEGER AS Boolean` の場合は `import kotlin.Boolean` が必要）。以前サポートされていた一部の型にはアダプターが必要です。ほとんどの変換（`Integer AS kotlin.Int` のための `IntColumnAdapter` など）には、`app.cash.sqldelight:primitive-adapters:2.0.0-alpha01` でプリミティブアダプターが利用可能です。

### 追加
- [IDE プラグイン] 基本的な提案マイグレーション (by @aperfilyev)
- [IDE プラグイン] インポートヒントアクションを追加 (by @aperfilyev)
- [IDE プラグイン] `Kotlin` クラス補完を追加 (by @aperfilyev)
- [Gradle プラグイン] `Gradle` タイプセーフプロジェクトアクセサのショートカットを追加 (by @hfhbd)
- [コンパイラ] ダイアレクトに基づいたコード生成をカスタマイズ (by @MariusVolkhart)
- [JDBC ドライバー] `JdbcDriver` に共通型を追加 (by @MariusVolkhart)
- [SQLite] `sqlite 3.35` のサポートを追加 (by @eygraber)
- [SQLite] `ALTER TABLE DROP COLUMN` のサポートを追加 (by @eygraber)
- [SQLite] `Sqlite 3.30` ダイアレクトのサポートを追加 (by @eygraber)
- [SQLite] `sqlite` で `NULLS FIRST/LAST` をサポート (by @eygraber)
- [HSQL] `HSQL` で生成句のサポートを追加 (by @MariusVolkhart)
- [HSQL] `HSQL` で名前付きパラメータのサポートを追加 (by @MariusVolkhart)
- [HSQL] `HSQL` `insert` クエリをカスタマイズ (by @MariusVolkhart)

### 変更
- [すべて] パッケージ名が `com.squareup.sqldelight` から `app.cash.sqldelight` に変更されました。
- [ランタイム] ダイアレクトを独自の隔離された `Gradle` モジュールに移動
- [ランタイム] ドライバー実装のクエリ通知に切り替え。
- [ランタイム] デフォルトの列アダプターを別のモジュールに抽出 (#2056, #2060)
- [コンパイラ] 各モジュールでクエリ実装を再実行するのではなく、モジュールに生成させる
- [コンパイラ] 生成されたデータクラスのカスタム `toString` 生成を削除。(by @PaulWoitaschek)
- [JS Driver] `sql.js` 依存関係を `sqljs-driver` から削除 (by @dellisd)
- [ページング] `Android Paging 2` 拡張機能を削除
- [IDE プラグイン] `SQLDelight` が同期している間、エディタバナーを追加 (#2511)
- [IDE プラグイン] サポートされる `IntelliJ` の最小バージョンは `2021.1`

### 修正
- [ランタイム] リスナリストをフラット化して、割り当てとポインタチェイシングを削減。(by @andersio)
- [IDE プラグイン] エラーメッセージを修正し、エラーへのジャンプを可能にする (by @hfhbd)
- [IDE プラグイン] 不足しているインスペクションの説明を追加 (#2768 by @aperfilyev)
- [IDE プラグイン] `GotoDeclarationHandler` での例外を修正 (#2531, #2688, #2804 by @aperfilyev)
- [IDE プラグイン] `import` キーワードをハイライト (by @aperfilyev)
- [IDE プラグイン] 解決されていない `Kotlin` 型を修正 (#1678 by @aperfilyev)
- [IDE プラグイン] 解決されていないパッケージのハイライトを修正 (#2543 by @aperfilyev)
- [IDE プラグイン] プロジェクトインデックスがまだ初期化されていない場合、不一致の列を検査しようとしない
- [IDE プラグイン] `Gradle` 同期が発生するまでファイルインデックスを初期化しない
- [IDE プラグイン] `Gradle` 同期が開始された場合、`SQLDelight` のインポートをキャンセル
- [IDE プラグイン] 元に戻すアクションが実行されたスレッドの外でデータベースを再生成する
- [IDE プラグイン] 参照が解決できない場合、空の `Java` 型を使用する
- [IDE プラグイン] ファイル解析中はメインスレッドから適切に移動し、書き込み時のみメインスレッドに戻る
- [IDE プラグイン] 以前の `IntelliJ` バージョンとの互換性を改善 (by @3flex)
- [IDE プラグイン] 高速なアノテーション API を使用
- [Gradle プラグイン] ランタイムを追加する際に `js/android` プラグインを明示的にサポート (by @ZacSweers)
- [Gradle プラグイン] マイグレーションからスキーマを導出せずにマイグレーション出力タスクを登録 (#2744 by @kevincianfarini)
- [Gradle プラグイン] マイグレーションタスクがクラッシュした場合、実行中にクラッシュしたファイルを出力する
- [Gradle プラグイン] べき等な出力を保証するためにコード生成時にファイルをソート (by @ZacSweers)
- [コンパイラ] ファイルを反復処理するための高速な API を使用し、`PSI` グラフ全体を探索しない
- [コンパイラ] `SELECT` 関数パラメータにキーワードのマングルを追加 (#2759 by @aperfilyev)
- [コンパイラ] マイグレーションアダプターの `packageName` を修正 (by @hfhbd)
- [コンパイラ] 型ではなくプロパティにアノテーションを出力する (#2798 by @aperfilyev)
- [コンパイラ] クエリサブタイプに渡す前に引数をソート (#2379 by @aperfilyev)

## [1.5.3] - 2021-11-23
[1.5.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.3

### 追加
- [JDBC ドライバー] サードパーティドライバーの実装のために `JdbcDriver` を公開 (#2672 by @hfhbd)
- [MySQL ダイアレクト] 時刻増分に関する不足している関数を追加 (#2671 by @sdoward)
- [コルーチン拡張] `コルーチン拡張機能`に `M1` ターゲットを追加 (by @PhilipDukhov)

### 変更
- [Paging3 拡張] `sqldelight-android-paging3` を `AAR` ではなく `JAR` として配布 (#2634 by @julioromano)
- ソフトキーワードでもあるプロパティ名は、アンダースコアがサフィックスとして追加されるようになりました。例えば `value` は `value_` として公開されます。

### 修正
- [コンパイラ] 重複する配列パラメータの変数抽出を行わない (by @aperfilyev)
- [Gradle プラグイン] `kotlin.mpp.enableCompatibilityMetadataVariant` を追加 (#2628 by @martinbonnin)
- [IDE プラグイン] 使用箇所の検索処理には読み取りアクションが必要

## [1.5.2] - 2021-10-12
[1.5.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.2

### 追加
- [Gradle プラグイン] `HMPP` のサポート (#2548 by @martinbonnin)
- [IDE プラグイン] `NULL` 比較インスペクションを追加 (by @aperfilyev)
- [IDE プラグイン] インスペクションサプレッサーを追加 (#2519 by @aperfilyev)
- [IDE プラグイン] 混合された名前付き/位置指定パラメータのインスペクションを追加 (by @aperfilyev)
- [SQLite ドライバー] `mingwX86` ターゲットを追加 (#2558 by @enginegl)
- [SQLite ドライバー] `M1` ターゲットを追加
- [SQLite ドライバー] `linuxX64` のサポートを追加 (#2456 by @chippmann)
- [MySQL ダイアレクト] `MySQL` に `ROW_COUNT` 関数を追加 (#2523)
- [PostgreSQL ダイアレクト] Postgres の列名変更、列の削除 (by @pabl0rg)
- [PostgreSQL ダイアレクト] `PostgreSQL` 文法が `CITEXT` を認識しない
- [PostgreSQL ダイアレクト] `TIMESTAMP WITH TIME ZONE` と `TIMESTAMPTZ` を含める
- [PostgreSQL ダイアレクト] `PostgreSQL GENERATED` 列の文法を追加
- [ランタイム] `SqlDriver` を `AfterVersion` のパラメータとして提供 (#2534, 2614 by @ahmedre)

### 変更
- [Gradle プラグイン] `Gradle 7.0` を明示的に要求 (#2572 by @martinbonnin)
- [Gradle プラグイン] `VerifyMigrationTask` が `Gradle` の最新チェックをサポートするようにする (#2533 by @3flex)
- [IDE プラグイン] `null` 許容型と非 `null` 許容型を結合する際に「`Join compares two columns of different types`」という警告を表示しない (#2550 by @pchmielowski)
- [IDE プラグイン] 列型における小文字の `'as'` のエラーを明確化 (by @aperfilyev)

### 修正
- [IDE プラグイン] プロジェクトがすでに破棄されている場合、新しいダイアレクトで再解析しない (#2609)
- [IDE プラグイン] 関連付けられた仮想ファイルが `null` の場合、モジュールは `null` になる (#2607)
- [IDE プラグイン] 未使用クエリの検査中にクラッシュするのを回避 (#2610)
- [IDE プラグイン] データベース同期書き込みを書き込みアクション内で実行 (#2605)
- [IDE プラグイン] `IDE` が `SQLDelight` の同期をスケジュールできるようにする
- [IDE プラグイン] `JavaTypeMixin` での `npe` を修正 (#2603 by @aperfilyev)
- [IDE プラグイン] `MismatchJoinColumnInspection` での `IndexOutOfBoundsException` を修正 (#2602 by @aperfilyev)
- [IDE プラグイン] `UnusedColumnInspection` の説明を追加 (#2600 by @aperfilyev)
- [IDE プラグイン] `PsiElement.generatedVirtualFiles` を読み取りアクションでラップする (#2599 by @aperfilyev)
- [IDE プラグイン] 不要な非 `null` キャストを削除 (#2596)
- [IDE プラグイン] 使用箇所の検索 (`find usages`) で `null` を適切に処理 (#2595)
- [IDE プラグイン] `Android` 用の生成ファイルの `IDE` 自動補完を修正 (#2573 by @martinbonnin)
- [IDE プラグイン] `SqlDelightGotoDeclarationHandler` での `npe` を修正 (by @aperfilyev)
- [IDE プラグイン] `insert` ステートメント内の引数で `Kotlin` キーワードをマングルする (#2433 by @aperfilyev)
- [IDE プラグイン] `SqlDelightFoldingBuilder` での `npe` を修正 (#2382 by @aperfilyev)
- [IDE プラグイン] `CopyPasteProcessor` での `ClassCastException` をキャッチ (#2369 by @aperfilyev)
- [IDE プラグイン] ライブテンプレートの更新を修正 (by @IliasRedissi)
- [IDE プラグイン] インテンションアクションに説明を追加 (#2489 by @aperfilyev)
- [IDE プラグイン] テーブルが見つからない場合に `CreateTriggerMixin` での例外を修正 (by @aperfilyev)
- [コンパイラ] テーブル作成ステートメントをトポロジカルソートする
- [コンパイラ] ディレクトリに対して `forDatabaseFiles` コールバックを呼び出すのを停止 (#2532)
- [Gradle プラグイン] `generateDatabaseInterface` タスクの依存関係を潜在的なコンシューマに伝播 (#2518 by @martinbonnin)

## [1.5.1] - 2021-07-16
[1.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.1

### 追加
- [PostgreSQL ダイアレクト] `PostgreSQL JSONB` および `ON Conflict Do Nothing` (by @satook)
- [PostgreSQL ダイアレクト] `PostgreSQL ON CONFLICT (column, ...) DO UPDATE` のサポートを追加 (by @satook)
- [MySQL ダイアレクト] `MySQL` 生成列をサポート (by @JGulbronson)
- [ネイティブドライバー] `watchosX64` のサポートを追加
- [IDE プラグイン] パラメータ型とアノテーションを追加 (by @aperfilyev)
- [IDE プラグイン] 「`select all`」クエリを生成するアクションを追加 (by @aperfilyev)
- [IDE プラグイン] 自動補完で列型を表示 (by @aperfilyev)
- [IDE プラグイン] 自動補完にアイコンを追加 (by @aperfilyev)
- [IDE プラグイン] 「主キーによる選択」クエリを生成するアクションを追加 (by @aperfilyev)
- [IDE プラグイン] 「`insert into`」クエリを生成するアクションを追加 (by @aperfilyev)
- [IDE プラグイン] 列名、ステートメント識別子、関数名のハイライトを追加 (by @aperfilyev)
- [IDE プラグイン] 残りのクエリ生成アクションを追加 (#489 by @aperfilyev)
- [IDE プラグイン] `insert-stmt` からのパラメータヒントを表示 (by @aperfilyev)
- [IDE プラグイン] テーブルエイリアスインテンションアクション (by @aperfilyev)
- [IDE プラグイン] 列名修飾インテンション (by @aperfilyev)
- [IDE プラグイン] `Kotlin` プロパティへの宣言へジャンプ (by @aperfilyev)

### 変更
- [ネイティブドライバー] フリーズや共有可能なデータ構造を可能な限り回避することで、ネイティブトランザクションのパフォーマンスを向上 (by @andersio)
- [Paging 3] `Paging3` バージョンを `3.0.0 stable` にバンプ
- [JS Driver] `sql.js` を `1.5.0` にアップグレード

### 修正
- [JDBC SQLite Driver] `ThreadLocal` をクリアする前に接続で `close()` を呼び出す (#2444 by @hannesstruss)
- [RX extensions] サブスクリプション/破棄競合リークを修正 (#2403 by @pyricau)
- [コルーチン拡張] 通知前にクエリリスナーを確実に登録する
- [コンパイラ] 一貫した `Kotlin` 出力ファイルを得るために `notifyQueries` をソート (by @thomascjy)
- [コンパイラ] `SELECT` クエリクラスのプロパティに `@JvmField` アノテーションを付けない (by @eygraber)
- [IDE プラグイン] インポート最適化機能を修正 (#2350 by @aperfilyev)
- [IDE プラグイン] 未使用列の検査を修正 (by @aperfilyev)
- [IDE プラグイン] インポート検査とクラスアノテーターにネストされたクラスのサポートを追加 (by @aperfilyev)
- [IDE プラグイン] `CopyPasteProcessor` での `npe` を修正 (#2363 by @aperfilyev)
- [IDE プラグイン] `InlayParameterHintsProvider` でのクラッシュを修正 (#2359 by @aperfilyev)
- [IDE プラグイン] 任意のテキストを `create table stmt` にコピー＆ペーストする際に空白行が挿入される問題を修正 (#2431 by @aperfilyev)

## [1.5.0] - 2021-04-23
[1.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.5.0

### 追加
- [SQLite Javascript Driver] `sqljs-driver` の公開を有効化 (#1667 by @dellisd)
- [Paging3 拡張] `Android Paging 3 Library` の拡張機能 (#1786 by @kevincianfarini)
- [MySQL ダイアレクト] `mysql` の `ON DUPLICATE KEY UPDATE` 競合解決のサポートを追加 (by @rharter)
- [SQLite ダイアレクト] `SQLite offsets()` のコンパイラサポートを追加 (by @qjroberts)
- [IDE プラグイン] 未知の型のインポートクイックフィックスを追加 (#683 by @aperfilyev)
- [IDE プラグイン] 未使用インポートの検査を追加 (#1161 by @aperfilyev)
- [IDE プラグイン] 未使用クエリの検査を追加 (by @aperfilyev)
- [IDE プラグイン] 未使用列の検査を追加 (#569 by @aperfilyev)
- [IDE プラグイン] コピー/ペースト時に自動的にインポートを処理 (#684 by @aperfilyev)
- [IDE プラグイン] `Gradle`/`IntelliJ` プラグインのバージョン間に非互換性がある場合にバルーンを表示
- [IDE プラグイン] `Insert Into ... VALUES(?)` パラメータヒント (#506 by @aperfilyev)
- [IDE プラグイン] インラインパラメータヒント (by @aperfilyev)
- [ランタイム] コールバック付きでマイグレーションを実行するための `API` をランタイムに含める (#1844)

### 変更
- [コンパイラ] 「`IS NOT NULL`」クエリをスマートキャスト (#867)
- [コンパイラ] ランタイムで失敗するキーワードから保護 (#1471, #1629)
- [Gradle プラグイン] `Gradle` プラグインのサイズを `60MB` から `13MB` に削減。
- [Gradle プラグイン] `Android` バリアントを適切にサポートし、`KMM` ターゲット固有の `SQL` のサポートを削除 (#1039)
- [Gradle プラグイン] `minSDK` に基づいて最小 `SQLite` バージョンを選択 (#1684)
- [ネイティブドライバー] ネイティブドライバーの接続プールとパフォーマンスの更新

### 修正
- [コンパイラ] ラムダの前の `NBSP` (by @oldergod)
- [コンパイラ] 生成された `bind*` および `cursor.get*` ステートメントの互換性のない型を修正
- [コンパイラ] `SQL` 句は適合した型を保持すべき (#2067)
- [コンパイラ] `NULL` キーワードのみの列は `null` 許容であるべき
- [コンパイラ] 型アノテーション付きのマッパーラムダを生成しない (#1957)
- [コンパイラ] カスタムクエリが衝突する場合、ファイル名を追加のパッケージサフィックスとして使用する (#1057, #1278)
- [コンパイラ] 外部キーカスケードがクエリリスナーに通知されることを保証 (#1325, #1485)
- [コンパイラ] 同じ型の `2` つをユニオンする場合、テーブル型を返す (#1342)
- [コンパイラ] `ifnull` および `coalesce` のパラメータが `null` 許容であることを保証 (#1263)
- [コンパイラ] 式に対してクエリによって課せられる `null` 許容性を正しく使用する
- [MySQL ダイアレクト] `MySQL` の `if` ステートメントをサポート
- [PostgreSQL ダイアレクト] `PostgreSQL` で `NUMERIC` および `DECIMAL` を `Double` として取得 (#2118)
- [SQLite ダイアレクト] `UPSERT` 通知は `BEFORE/AFTER UPDATE` トリガーを考慮すべき (#2198 by @andersio)
- [SQLite ドライバー] メモリ内にない限り、`SqliteDriver` でスレッドに複数の接続を使用する (#1832)
- [JDBC ドライバー] `JDBC Driver` は `autoCommit` が `true` であると仮定する (#2041)
- [JDBC ドライバー] 例外発生時に接続を確実にクローズする (#2306)
- [IDE プラグイン] パス区切り文字のバグにより `Windows` で `GoToDeclaration/FindUsages` が破損する問題を修正 (#2054 by @angusholder)
- [IDE プラグイン] `IDE` でクラッシュするのではなく、`Gradle` エラーを無視する。
- [IDE プラグイン] `sqldelight` ファイルが非 `sqldelight` モジュールに移動された場合、コード生成を試行しない
- [IDE プラグイン] `IDE` でコード生成エラーを無視する
- [IDE プラグイン] 負のサブストリングを試行しないことを保証 (#2068)
- [IDE プラグイン] `Gradle` アクションを実行する前にプロジェクトが破棄されていないことも保証 (#2155)
- [IDE プラグイン] `null` 許容型での算術演算も `null` 許容であるべき (#1853)
- [IDE プラグイン] 「`expand * intention`」が追加のプロジェクションで動作するように修正 (#2173 by @aperfilyev)
- [IDE プラグイン] `Kotlin` 解決が `GoTo` 中に失敗した場合、`sqldelight` ファイルに移動しようとしない
- [IDE プラグイン] `sqldelight` がインデックス作成中に `IntelliJ` が例外に遭遇した場合でもクラッシュしない
- [IDE プラグイン] `IDE` でコード生成前のエラー検出中に発生する例外を処理
- [IDE プラグイン] `IDE` プラグインをダイナミックプラグインと互換性を持たせる (#1536)
- [Gradle プラグイン] `WorkerApi` を使用してデータベースを生成する際の競合状態 (#2062 by @stephanenicolas)
- [Gradle プラグイン] `classLoaderIsolation` がカスタム `jdbc` の使用を妨げる (#2048 by @benasher44)
- [Gradle プラグイン] 不足している `packageName` エラーメッセージを改善 (by @vanniktech)
- [Gradle プラグイン] `SQLDelight` が `IntelliJ` の依存関係をビルドスクリプトのクラスパスに漏らす (#1998)
- [Gradle プラグイン] `Gradle` ビルドキャッシュを修正 (#2075)
- [Gradle プラグイン] `Gradle` プラグインで `kotlin-native-utils` に依存しない (by @ilmat192)
- [Gradle プラグイン] マイグレーションファイルのみがある場合もデータベースを書き込む (#2094)
- [Gradle プラグイン] 最終的なコンパイル単位で菱形依存関係が一度だけピックアップされるようにする (#1455)

また、今回のリリースで `SQLDelight` インフラストラクチャの改善に多大な貢献をしてくれた `@3flex` にも感謝を申し上げます。

## [1.4.4] - 2020-10-08
[1.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.4

### 追加
- [PostgreSQL ダイアレクト] `WITH` 句でのデータ変更ステートメントをサポート
- [PostgreSQL ダイアレクト] `substring` 関数をサポート
- [Gradle プラグイン] `SQLDelight` コンパイル中にマイグレーションを検証するための `verifyMigrations` フラグを追加 (#1872)

### 変更
- [コンパイラ] 非 `SQLite` ダイアレクトで `SQLite` 固有の関数を不明としてフラグ付け
- [Gradle プラグイン] `sqldelight` プラグインが適用されているがデータベースが設定されていない場合に警告を表示 (#1421)

### 修正
- [コンパイラ] `ORDER BY` 句で列名をバインディングする際にエラーを報告 (#1187 by @eygraber)
- [コンパイラ] データベースインターフェース生成時にレジストリ警告が表示される (#1792)
- [コンパイラ] `case` ステートメントの型推論が不正確 (#1811)
- [コンパイラ] バージョンがないマイグレーションファイルに対してより良いエラーを提供する (#2006)
- [コンパイラ] 一部のデータベース型 `ColumnAdapter` に対して、マーシャリングに必要なデータベース型が正しくない (#2012)
- [コンパイラ] `CAST` の `null` 許容性 (#1261)
- [コンパイラ] クエリラッパーで多くの名前シャドー警告が発生 (#1946 by @eygraber)
- [コンパイラ] 生成されたコードが完全修飾名を使用している (#1939)
- [IDE プラグイン] `Gradle` 同期から `sqldelight` コード生成をトリガー
- [IDE プラグイン] `.sq` ファイル変更時にプラグインがデータベースインターフェースを再生成しない (#1945)
- [IDE プラグイン] ファイルを新しいパッケージに移動する際の問題 (#444)
- [IDE プラグイン] カーソルを移動する場所がない場合、クラッシュせずに何もしない (#1994)
- [IDE プラグイン] `Gradle` プロジェクト外のファイルに対して空のパッケージ名を使用する (#1973)
- [IDE プラグイン] 無効な型に対して適切に失敗する (#1943)
- [IDE プラグイン] 未知の式に遭遇した場合、より良いエラーメッセージをスローする (#1958)
- [Gradle プラグイン] `SQLDelight` が `IntelliJ` の依存関係をビルドスクリプトのクラスパスに漏らす (#1998)
- [Gradle プラグイン] `*.sq` ファイルにメソッドドキュメントを追加すると「`JavadocIntegrationKt not found`」コンパイルエラーが発生 (#1982)
- [Gradle プラグイン] `SqlDeslight gradle plugin` が `Configuration Caching (CoCa)` をサポートしない (#1947 by @stephanenicolas)
- [SQLite JDBC Driver] `SQLException: database in auto-commit mode` (#1832)
- [コルーチン拡張] `コルーチン拡張機能`の `IR` バックエンドを修正 (#1918 by @dellisd)

## [1.4.3] - 2020-09-04
[1.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.3

### 追加
- [MySQL ダイアレクト] `MySQL` の `last_insert_id` 関数のサポートを追加 (by @lawkai)
- [PostgreSQL ダイアレクト] `SERIAL` データ型をサポート (by @veyndan & @felipecsl)
- [PostgreSQL ダイアレクト] `PostgreSQL RETURNING` をサポート (by @veyndan)

### 修正
- [MySQL ダイアレクト] `MySQL AUTO_INCREMENT` をデフォルト値を持つものとして扱う (#1823)
- [コンパイラ] `Upsert` ステートメントのコンパイラエラーを修正 (#1809 by @eygraber)
- [コンパイラ] 無効な `Kotlin` が生成される問題を修正 (#1925 by @eygraber)
- [コンパイラ] 未知の関数に対してより良いエラーメッセージを提供する (#1843)
- [コンパイラ] `instr` の `2` 番目のパラメータの型を `string` として公開する
- [IDE プラグイン] `IDE` プラグインのデーモンの肥大化と `UI` スレッドの停止を修正 (#1916)
- [IDE プラグイン] `null` モジュールシナリオを処理 (#1902)
- [IDE プラグイン] 未設定の `.sq` ファイルではパッケージ名に空文字列を返す (#1920)
- [IDE プラグイン] グループ化されたステートメントを修正し、それらの統合テストを追加 (#1820)
- [IDE プラグイン] `ModuleUtil` を使用して要素のモジュールを検索する (#1854)
- [IDE プラグイン] 有効な要素のみをルックアップに追加する (#1909)
- [IDE プラグイン] 親は `null` になり得る (#1857)

## [1.4.2] - 2020-08-27
[1.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.2

### 追加
- [ランタイム] 新しい `JS IR` バックエンドをサポート
- [Gradle プラグイン] `generateSqlDelightInterface Gradle` タスクを追加 (by @vanniktech)
- [Gradle プラグイン] `verifySqlDelightMigration Gradle` タスクを追加 (by @vanniktech)

### 修正
- [IDE プラグイン] `Gradle tooling API` を使用して `IDE` と `Gradle` 間でのデータ共有を促進する
- [IDE プラグイン] スキーマ導出のデフォルトを `false` にする
- [IDE プラグイン] `commonMain` ソースセットを適切に取得する
- [MySQL ダイアレクト] `mySqlFunctionType()` に `minute` を追加 (by @maaxgr)

## [1.4.1] - 2020-08-21
[1.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.1

### 追加
- [ランタイム] `Kotlin 1.4.0` をサポート (#1859)

### 変更
- [Gradle プラグイン] `AGP` 依存関係を `compileOnly` にする (#1362)

### 修正
- [コンパイラ] 列定義ルールとテーブルインターフェースジェネレーターにオプションの `Javadoc` を追加 (#1224 by @endanke)
- [SQLite ダイアレクト] `sqlite fts5` の補助関数 `highlight`、`snippet`、`bm25` のサポートを追加 (by @drampelt)
- [MySQL ダイアレクト] `MySQL bit` データ型をサポート
- [MySQL ダイアレクト] `MySQL` バイナリリテラルをサポート
- [PostgreSQL ダイアレクト] `sql-psi` から `SERIAL` を公開する (by @veyndan)
- [PostgreSQL ダイアレクト] `BOOLEAN` データ型を追加 (by @veyndan)
- [PostgreSQL ダイアレクト] `NULL` 列制約を追加 (by @veyndan)
- [HSQL ダイアレクト] `HSQL` に `AUTO_INCREMENT` サポートを追加 (by @rharter)

## [1.4.0] - 2020-06-22
[1.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.4.0

### 追加
- [MySQL ダイアレクト] `MySQL` のサポート (by @JGulbronson & @veyndan)
- [PostgreSQL ダイアレクト] 実験的な `PostgreSQL` のサポート (by @veyndan)
- [HSQL ダイアレクト] 実験的な `H2` のサポート (by @MariusVolkhart)
- [SQLite ダイアレクト] `SQLite FTS5` のサポート (by @benasher44 & @jpalawaga)
- [SQLite ダイアレクト] `alter table rename column` のサポート (#1505 by @angusholder)
- [IDE] マイグレーション (`.sqm`) ファイルの `IDE` サポート
- [IDE] 組み込みの `SQL` ライブテンプレートに似た `SQLDelight` ライブテンプレートを追加 (#1154 by @veyndan)
- [IDE] 新しい `SqlDelight` ファイルアクションを追加 (#42 by @romtsn)
- [ランタイム] 結果を返すトランザクションのための `transactionWithReturn API`
- [コンパイラ] 複数の `SQL` ステートメントを `.sq` ファイルにグループ化するための構文
- [コンパイラ] マイグレーションファイルからスキーマを生成するサポート
- [Gradle プラグイン] マイグレーションファイルを有効な `SQL` として出力するタスクを追加

### 変更
- [ドキュメント] ドキュメントウェブサイトの全面的な見直し (by @saket)
- [Gradle プラグイン] 未サポートのダイアレクトエラーメッセージを改善 (by @veyndan)
- [IDE] ダイアレクトに基づいてファイルアイコンを動的に変更 (by @veyndan)
- [JDBC ドライバー] `javax.sql.DataSource` から `JdbcDriver` コンストラクタを公開 (#1614)

### 修正
- [コンパイラ] テーブルの `Javadoc` をサポートし、`1` つのファイル内の複数の `Javadoc` を修正 (#1224)
- [コンパイラ] 合成列の値を挿入できるようにする (#1351)
- [コンパイラ] ディレクトリ名サニタイズにおける不整合を修正 (by @ZacSweers)
- [コンパイラ] 合成列が結合全体で `null` 許容性を保持するようにする (#1656)
- [コンパイラ] `delete` キーワードで `delete` ステートメントをピン留めする (#1643)
- [コンパイラ] クォーティングを修正 (#1525 by @angusholder)
- [コンパイラ] `between` オペレーターが式に適切に再帰するように修正 (#1279)
- [コンパイラ] インデックス作成時にテーブル/列が見つからない場合、より良いエラーを提供する (#1372)
- [コンパイラ] 結合制約で外部クエリのプロジェクションを使用できるようにする (#1346)
- [ネイティブドライバー] `execute` で `transationPool` を使用するようにする (by @benasher44)
- [JDBC ドライバー] `sqlite` ではなく `jdbc` トランザクション API を使用する (#1693)
- [IDE] `virtualFile` 参照が常に元のファイルになるように修正 (#1782)
- [IDE] `Bugsnag` にエラーを報告する際に正しい `throwable` を使用する (#1262)
- [Paging 拡張] リークする `DataSource` を修正 (#1628)
- [Gradle プラグイン] スキーマ生成時に出力 `DB` ファイルがすでに存在する場合、それを削除する (#1645)
- [Gradle プラグイン] ギャップがある場合、マイグレーション検証を失敗させる
- [Gradle プラグイン] 設定したファイルインデックスを明示的に使用する (#1644)

また、今回のリリースで `SQLDelight` インフラストラクチャの改善に多大な貢献をしてくれた `@3flex` にも感謝を申し上げます。

## [1.3.0] - 2020-04-03
[1.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.3.0

* 新規: [Gradle] コンパイル対象の `SQL` ダイアレクトを指定する `Dialect` プロパティ。
* 新規: [コンパイラ] #1009 `MySQL` ダイアレクトの実験的サポート。
* 新規: [コンパイラ] #1436 `sqlite:3.24` ダイアレクトと `upsert` のサポート。
* 新規: [JDBC Driver] `sqlite jvm` ドライバーから `JDBC` ドライバーを分離。
* 修正: [コンパイラ] #1199 あらゆる長さのラムダをサポート。
* 修正: [コンパイラ] #1610 `avg()` の戻り値の型が `null` 許容になるように修正。
* 修正: [IntelliJ] #1594 `Windows` でパス区切り文字の処理が原因で `GoTo` と `Find Usages` が破損する問題を修正。

## [1.2.2] - 2020-01-22
[1.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.2

* 新規: [ランタイム] `Windows (mingW)`、`tvOS`、`watchOS`、`macOS` アーキテクチャをサポート。
* 修正: [コンパイラ] `sum()` の戻り値の型は `null` 許容であるべき。
* 修正: [ページング] 競合状態を避けるため、`Transacter` を `QueryDataSourceFactory` に渡す。
* 修正: [IntelliJ Plugin] ファイルのパッケージ名を検索する際に依存関係を検索しない。
* 修正: [Gradle] #862 `Gradle` のバリデータログをデバッグレベルに変更。
* 機能強化: [Gradle] `GenerateSchemaTask` を `Gradle` ワーカーを使用するように変換。
* 注意: `sqldelight-runtime` アーティファクトは `runtime` に名称変更されました。

## [1.2.1] - 2019-12-11
[1.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.1

* 修正: [Gradle] `Kotlin Native 1.3.60` をサポート。
* 修正: [Gradle] #1287 同期時の警告。
* 修正: [コンパイル] #1469 クエリのための `SynetheticAccessor` 作成。
* 修正: [JVM Driver] メモリリークを修正。
* 注意: コルーチン拡張アーティファクトは、ビルドスクリプトに `kotlinx bintray maven` リポジトリを追加する必要があります。

## [1.2.0] - 2019-08-30
[1.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.2.0

* 新規: [ランタイム] 安定版 `Flow` `API`。
* 修正: [Gradle] `Kotlin Native 1.3.50` をサポート。
* 修正: [Gradle] #1380 クリーンビルドが時々失敗する問題を修正。
* 修正: [Gradle] #1348 検証タスク実行時に「`Could not retrieve functions`」と表示される問題を修正。
* 修正: [コンパイル] #1405 `FTS` テーブルが結合されたクエリを含むプロジェクトをビルドできない問題を修正。
* 修正: [Gradle] #1266 複数のデータベースモジュールがある場合の断続的な `Gradle` ビルド失敗を修正。

## [1.1.4] - 2019-07-11
[1.1.4]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.4

* 新規: [ランタイム] 実験的な `Kotlin Flow API`。
* 修正: [Gradle] `Kotlin/Native 1.3.40` との互換性。
* 修正: [Gradle] #1243 `Gradle` のオンデマンド設定で `SQLDelight` を使用する際の修正。
* 修正: [Gradle] #1385 増加的なアノテーション処理で `SQLDelight` を使用する際の修正。
* 修正: [Gradle] `Gradle` タスクのキャッシュを許可。
* 修正: [Gradle] #1274 `Kotlin DSL` で `sqldelight` 拡張機能を使用できるようにする。
* 修正: [コンパイラ] 各クエリに対して一意の `ID` が決定論的に生成される。
* 修正: [コンパイラ] トランザクションが完了した場合にのみ、リッスンしているクエリに通知する。
* 修正: [JVM Driver] #1370 `JdbcSqliteDriver` ユーザーに `DB URL` の提供を強制。

## [1.1.3] - 2019-04-14
[1.1.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.3

* `Gradle Metadata 1.0` リリース。

## [1.1.2] - 2019-04-14
[1.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.2

* 新規: [ランタイム] #1267 ロギングドライバーデコレーター。
* 修正: [コンパイラ] #1254 `2^16` 文字より長い文字列リテラルを分割。
* 修正: [Gradle] #1260 生成されたソースがマルチプラットフォームプロジェクトで `iOS` ソースとして認識される。
* 修正: [IDE] #1290 `kotlin.KotlinNullPointerException` in `CopyAsSqliteAction.kt:43`。
* 修正: [Gradle] #1268 最新バージョンで `linkDebugFrameworkIos*` タスクの実行が失敗する問題を修正。

## [1.1.1] - 2019-03-01
[1.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.1

* 修正: [Gradle] `Android` プロジェクトのモジュール依存関係のコンパイルを修正。
* 修正: [Gradle] #1246 `afterEvaluate` で `API` 依存関係を設定。
* 修正: [コンパイラ] 配列型が適切に表示される。

## [1.1.0] - 2019-02-27
[1.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.1.0

* 新規: [Gradle] #502 スキーマモジュールの依存関係を指定できるようにする。
* 機能強化: [コンパイラ] #1111 テーブルエラーが他のエラーよりも前にソートされる。
* 修正: [コンパイラ] #1225 `REAL` リテラルの正しい型を返す。
* 修正: [コンパイラ] #1218 `docid` がトリガーを介して伝播する。

## [1.0.3] - 2019-01-30
[1.0.3]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.3

* 機能強化: [ランタイム] #1195 ネイティブドライバー/ランタイム `Arm32`。
* 機能強化: [ランタイム] #1190 `Query` 型からマッパーを公開する。

## [1.0.2] - 2019-01-26
[1.0.2]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.2

* 修正: [Gradle Plugin] `Kotlin 1.3.20` に更新。
* 修正: [ランタイム] トランザクションが例外を飲み込まないようになった。

## [1.0.1] - 2019-01-21
[1.0.1]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.1

* 機能強化: [ネイティブドライバー] `DatabaseConfiguration` にディレクトリ名を渡せるようにする。
* 機能強化: [コンパイラ] #1173 パッケージのないファイルはコンパイルに失敗する。
* 修正: [IDE] `IDE` エラーを `Square` に適切に報告する。
* 修正: [IDE] #1162 同じパッケージ内の型がエラーとして表示されるが正常に動作する。
* 修正: [IDE] #1166 テーブルの名前変更が `NPE` で失敗する。
* 修正: [コンパイラ] #1167 `UNION` と `SELECT` を含む複雑な `SQL` ステートメントを解析しようとすると例外がスローされる。

## [1.0.0] - 2019-01-08
[1.0.0]: https://github.com/sqldelight/sqldelight/releases/tag/1.0.0

* 新規: 生成されたコードの全面的な見直し、現在は `Kotlin` で記述されています。
* 新規: `RxJava2` 拡張アーティファクト。
* 新規: `Android Paging` 拡張アーティファクト。
* 新規: `Kotlin Multiplatform` のサポート。
* 新規: `Android`、`iOS`、`JVM SQLite` ドライバーアーティファクト。
* 新規: トランザクション `API`。

## [0.7.0] - 2018-02-12
[0.7.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.7.0

* 新規: 生成されたコードは `Support SQLite` ライブラリのみを使用するように更新されました。すべてのクエリは、生の文字列ではなくステートメントオブジェクトを生成するようになりました。
* 新規: `IDE` でのステートメントの折りたたみ。
* 新規: ブール型が自動的に処理されるようになりました。
* 修正: コード生成から非推奨のマーシャルを削除。
* 修正: `avg` `SQL` 関数の型マッピングを `REAL` に修正。
* 修正: `julianday` `SQL` 関数を正しく検出。

## [0.6.1] - 2017-03-22
[0.6.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.1

* 新規: 引数なしの `Delete`、`Update`、`Insert` ステートメントに対してコンパイル済みステートメントが生成される。
* 修正: サブクエリで使用されるビュー内の `Using` 句でエラーが発生しない。
* 修正: 生成されたマッパーの重複型を削除。
* 修正: サブクエリが引数をチェックする式で使用できる。

## [0.6.0] - 2017-03-06
[0.6.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.6.0

* 新規: `Select` クエリが文字列定数ではなく `SqlDelightStatement` ファクトリとして公開されるようになりました。
* 新規: クエリの `JavaDoc` がステートメントおよびマッパーファクトリにコピーされるようになりました。
* 新規: ビュー名の文字列定数を出力。
* 修正: ファクトリを必要とするビューに対するクエリが、それらのファクトリを引数として正しく要求するように修正。
* 修正: `insert` の引数の数が指定された列の数と一致することを検証。
* 修正: `where` 句で使用される `blob` リテラルを適切にエンコード。
* このリリースには `Gradle 3.3` 以降が必要です。

## [0.5.1] - 2016-10-24
[0.5.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.1

* 新規: コンパイル済みステートメントは抽象型を拡張します。
* 修正: パラメータ内のプリミティブ型は `null` 許容の場合ボックス化されます。
* 修正: バインド引数に必要なすべてのファクトリがファクトリメソッドに存在するように修正。
* 修正: エスケープされた列名が正しくマーシャリングされる。

## [0.5.0] - 2016-10-19
[0.5.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.5.0

* 新規: `SQLite` の引数をファクトリを介して型安全に渡せるようになりました
* 新規: `IntelliJ` プラグインが `.sq` ファイルのフォーマットを実行
* 新規: `SQLite` のタイムスタンプリテラルをサポート
* 修正: パラメータ化された型を `IntelliJ` でクリックできるようになりました
* 修正: エスケープされた列名が `Cursor` から取得された場合でも `RuntimeException` をスローしない
* 修正: `Gradle` プラグインが例外の出力時にクラッシュしない

## [0.4.4] - 2016-07-20
[0.4.4]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.4

* 新規: 列の `Java` 型として `short` のネイティブサポート
* 新規: 生成されたマッパーとファクトリメソッドの `Javadoc`
* 修正: `group_concat` および `nullif` 関数の適切な `null` 許容性
* 修正: `Android Studio 2.2-alpha` との互換性
* 修正: `WITH RECURSIVE` でプラグインがクラッシュしない

## [0.4.3] - 2016-07-07
[0.4.3]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.3

* 新規: コンパイルエラーがソースファイルにリンクされる。
* 新規: 右クリックで `SQLDelight` コードを有効な `SQLite` としてコピーできる。
* 新規: 名前付きステートメントの `Javadoc` が生成された文字列に表示される。
* 修正: 生成されたビューモデルに `null` 許容アノテーションが含まれる。
* 修正: ユニオンから生成されたコードが、すべての可能な列をサポートするために適切な型と `null` 許容性を持つ。
* 修正: `sum` および `round SQLite` 関数の生成コードでの適切な型。
* 修正: `CAST`、内部 `select` のバグ修正。
* 修正: `CREATE TABLE` ステートメントでの自動補完。
* 修正: `SQLite` キーワードがパッケージで使用できる。

## [0.4.2] - 2016-06-16
[0.4.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.2

* 新規: マーシャルをファクトリから作成できる。
* 修正: `IntelliJ` プラグインが適切な汎用順序でファクトリメソッドを生成する。
* 修正: 関数名があらゆるケースを使用できる。

## [0.4.1] - 2016-06-14
[0.4.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.1

* 修正: `IntelliJ` プラグインが適切なジェネリック順序でクラスを生成する。
* 修正: 列定義があらゆるケースを使用できる。

## [0.4.0] - 2016-06-14
[0.4.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.4.0

* 新規: マッパーはテーブルごとではなくクエリごとに生成される。
* 新規: `.sq` ファイルで `Java` 型をインポートできる。
* 新規: `SQLite` 関数が検証される。
* 修正: 重複エラーを削除。
* 修正: 大文字の列名と `Java` キーワードの列名でエラーが発生しない。

## [0.3.2] - 2016-05-14
[0.3.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.2

* 新規: 自動補完と使用箇所の検索が、ビューとエイリアスで動作するようになった。
* 修正: コンパイル時検証により、関数を `select` で使用できるようになった。
* 修正: デフォルト値のみを宣言する `insert` ステートメントをサポート。
* 修正: `SQLDelight` を使用しないプロジェクトがインポートされたときに、プラグインがクラッシュしない。

## [0.3.1] - 2016-04-27
[0.3.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.1

* 修正: メソッド参照による `Illegal Access` ランタイム例外を避けるため、インターフェースの可視性を `public` に戻しました。
* 修正: サブ式が適切に評価される。

## [0.3.0] - 2016-04-26
[0.3.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.3.0

* 新規: 列定義は `SQLite` 型を使用し、`Java` 型を指定するための追加の「`AS`」制約を持つことができる。
* 新規: `IDE` からバグレポートを送信できる。
* 修正: 自動補完関数が適切に動作する。
* 修正: `SQLDelight` モデルファイルが `.sq` ファイルの編集時に更新される。
* 削除済み: 添付されたデータベースはサポートされなくなりました。

## [0.2.2] - 2016-03-07
[0.2.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.2

* 新規: `insert`、`update`、`delete`、`index`、`trigger` ステートメントで使用される列のコンパイル時検証。
* 修正: ファイルの移動/作成時に `IDE` プラグインがクラッシュしない。

## [0.2.1] - 2016-03-07
[0.2.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.1

* 新規: `Ctrl+/` (`OSX` では `Cmd+/`) で選択された行のコメントを切り替える。
* 新規: `SQL` クエリで使用される列のコンパイル時検証。
* 修正: `IDE` および `Gradle` プラグインの両方で `Windows` パスをサポート。

## [0.2.0] - 2016-02-29
[0.2.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.2.0

* 新規: `Marshal` クラスにコピーコンストラクタを追加。
* 新規: `Kotlin 1.0 Final` にアップデート。
* 修正: `sqldelight` フォルダ構造の問題を失敗しない方法で報告。
* 修正: `table_name` という名前の列を禁止。生成された定数がテーブル名定数と衝突するため。
* 修正: `IDE` プラグインが `.sq` ファイルが開かれているかどうかにかかわらず、モデルクラスを即座に生成することを保証。
* 修正: `IDE` および `Gradle` プラグインの両方で `Windows` パスをサポート。

## [0.1.2] - 2016-02-13
[0.1.2]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.2

* 修正: `Gradle` プラグインがほとんどのプロジェクトで使用されるのを妨げていたコードを削除。
* 修正: `Antlr` ランタイムに不足しているコンパイラ依存関係を追加。

## [0.1.1] - 2016-02-12
[0.1.1]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.1

* 修正: `Gradle` プラグインがランタイムと同じバージョンを指すようにする。

## [0.1.0] - 2016-02-12
[0.1.0]: https://github.com/sqldelight/sqldelight/releases/tag/0.1.0

初回リリース。