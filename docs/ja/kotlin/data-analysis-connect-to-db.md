[//]: # (title: データベースへの接続とデータの取得)

[Kotlin Notebook](kotlin-notebook-overview.md)は、MariaDB、PostgreSQL、MySQL、SQLiteなどのさまざまな種類のSQLデータベースへの接続と、そこからのデータ取得機能を提供しています。
[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)を活用することで、Kotlin Notebookはデータベースへの接続を確立し、SQLクエリを実行し、その結果をインポートしてさらなる操作を行うことができます。

詳細な例については、[KotlinDataFrame SQL ExamplesのGitHubリポジトリにあるNotebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)を参照してください。

## 始める前に

Kotlin Notebookは[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、このプラグインはデフォルトでIntelliJ IDEAにバンドルされ、有効になっています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境のセットアップ](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成します。

1. **File** | **New** | **Kotlin Notebook** を選択します。

2. MariaDBやMySQLなどのSQLデータベースへのアクセス権があることを確認してください。

## データベースへの接続

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)の特定の関数を使用して、SQLデータベースに接続し、対話することができます。
`DatabaseConfiguration`を使用してデータベースへの接続を確立し、`getSchemaForAllSqlTables()`を使用してその中のすべてのテーブルのスキーマを取得できます。

例を見てみましょう：

1. Kotlin Notebookファイル（`.ipynb`）を開きます。
2. JDBC（Java Database Connectivity）ドライバの依存関係を追加し、JDBCドライバのバージョンを指定します。
この例ではMariaDBを使用します。

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. データ操作タスクに不可欠なKotlin DataFrameライブラリと、SQL接続およびユーティリティ関数に必要なJavaライブラリをインポートします。

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. `DatabaseConfiguration`クラスを使用して、URL、ユーザー名、パスワードを含むデータベースの接続パラメータを定義します。

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 接続されたら、`getSchemaForAllSqlTables()`関数を使用して、データベース内の各テーブルのスキーマ情報を取得して表示します。

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > SQLデータベースへの接続の詳細については、[Kotlin DataFrameドキュメントの「Read from SQL databases」](https://kotlin.github.io/dataframe/readsqldatabases.html)を参照してください。
   > 
   {style="tip"}

## データの取得と操作

[データベースへの接続を確立](#connect-to-database)した後、Kotlin DataFrameライブラリを活用して、Kotlin Notebookでデータを取得および操作できます。
データの取得には`readSqlTable()`関数を使用できます。データの操作には、[`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)などのメソッドを使用できます。

IMDBデータベースに接続し、クエンティン・タランティーノが監督した映画に関するデータを取得する例を見てみましょう：

1. `readSqlTable()`関数を使用して「movies」テーブルからデータを取得します。効率化のために、クエリを最初の100レコードに制限する`limit`を設定します。

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. SQLクエリを使用して、クエンティン・タランティーノ監督の映画に関連する特定のデータセットを取得します。
このクエリは映画の詳細を選択し、各映画のジャンルを結合します。

   ```kotlin
   val props = Properties()
   props.setProperty("user", USER_NAME)
   props.setProperty("password", PASSWORD)
   
   val TARANTINO_FILMS_SQL_QUERY = """
       SELECT name, year, rank, GROUP_CONCAT(genre) as "genres"
       FROM movies JOIN movies_directors ON movie_id = movies.id
       JOIN directors ON directors.id=director_id LEFT JOIN movies_genres ON movies.id = movies_genres.movie_id
       WHERE directors.first_name = "Quentin" AND directors.last_name = "Tarantino"
       GROUP BY name, year, rank
       ORDER BY year
       """
   
   // 名前、年、ランク、および全ジャンルの連結文字列を含む、クエンティン・タランティーノの映画リストを取得します。
   // 結果は名前、年、ランクでグループ化され、年順にソートされます。
   
   var dfTarantinoMovies: DataFrame<*>
   
   DriverManager.getConnection(URL, props).use { connection ->
      connection.createStatement().use { st ->
         st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs ->
            val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
            dfTarantinoFilmsSchema.print()
   
            dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
            dfTarantinoMovies
         }
      }
   }
   ```

3. タランティーノ映画のデータセットを取得した後、さらにデータの操作やフィルタリングを行うことができます。

   ```kotlin
   val df = dfTarantinoMovies
       // 「year」列の欠損値を0に置き換えます。
       .fillNA { year }.with { 0 }
       
       // 「year」列を整数に変換します。
       .convert { year }.toInt()
   
       // 2000年以降に公開された映画のみを含むようにデータをフィルタリングします。
       .filter { year > 2000 }
   df
   ```

結果として出力されるのは、[`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna)メソッドを使用してyear列の欠損値が0に置き換えられたDataFrameです。year列は[`convert`](https://kotlin.github.io/dataframe/convert.html)メソッドで整数値に変換され、[`filter`](https://kotlin.github.io/dataframe/filter.html)メソッドを使用して2000年以降の行のみが含まれるようにフィルタリングされています。

## Kotlin Notebookでのデータ分析

[データベースへの接続を確立](#connect-to-database)した後、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)を活用して、Kotlin Notebookで詳細なデータ分析を行うことができます。これには、データのグループ化、ソート、集計のための関数が含まれており、データ内のパターンを発見し理解するのに役立ちます。

映画データベースのアクターデータを分析し、最も頻繁に登場するアクターのの名前に焦点を当てた例を見てみましょう：

1. [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables)関数を使用して「actors」テーブルからデータを抽出します。

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 取得したデータを処理して、最も一般的なアクターの名前の上位20個を特定します。この分析には、いくつかのDataFrameメソッドを使用します。

   ```kotlin
   val top20ActorNames = actorDf
       // first_name列でデータをグループ化し、アクターの名前に基づいて整理します。
      .groupBy { first_name }
   
       // 各ユニークな名前の出現回数をカウントし、頻度分布を提供します。
      .count()
   
       // カウントの降順で結果をソートし、最も一般的な名前を特定します。
      .sortByDesc("count")
   
       // 分析のために上位20個の最も頻繁な名前を選択します。
      .take(20)
   top20ActorNames
   ```

## 次のステップ

* [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータの可視化を試す
* [Kandyを使用したKotlin Notebookでのデータの可視化](data-analysis-visualization.md)でデータの可視化に関する追加情報を見つける
* Kotlinでのデータサイエンスと分析に利用可能なツールとリソースの広範な概要については、[データ分析用のKotlinおよびJavaライブラリ](data-analysis-libraries.md)を参照してください