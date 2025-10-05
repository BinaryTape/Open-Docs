[//]: # (title: データベースに接続してデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md)は、MariaDB、PostgreSQL、MySQL、SQLiteなど、さまざまな種類のSQLデータベースに接続し、データを取得する機能を提供します。
[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)を利用することで、Kotlin Notebookはデータベースへの接続を確立し、SQLクエリを実行し、結果をインポートしてさらなる操作を行うことができます。

詳細な例については、[KotlinDataFrame SQL Examples GitHubリポジトリ](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)にあるNotebookを参照してください。

## 始める前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、
このプラグインはIntelliJ IDEAにデフォルトでバンドルされ、有効になっています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、
[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成します。

1.  **File** | **New** | **Kotlin Notebook**を選択します。
2.  MariaDBやMySQLなどのSQLデータベースにアクセスできることを確認してください。

## データベースに接続する

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)の特定の関数を使用することで、SQLデータベースに接続し、操作できます。
`DatabaseConfiguration`を使用してデータベースへの接続を確立し、`getSchemaForAllSqlTables()`を使用してその中のすべてのテーブルのスキーマを取得できます。

例を見てみましょう。

1.  Kotlin Notebookファイル (`.ipynb`) を開きます。
2.  JDBC (Java Database Connectivity) ドライバーの依存関係を追加し、JDBCドライバーのバージョンを指定します。
    この例ではMariaDBを使用しています。

    ```kotlin
    USE {
       dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
    }
    ```

3.  データ操作タスクに不可欠なKotlin DataFrameライブラリと、SQL接続およびユーティリティ関数に必要なJavaライブラリをインポートします。

    ```kotlin
    %use dataframe
    import java.sql.DriverManager
    import java.util.*
    ```

4.  `DatabaseConfiguration`クラスを使用して、URL、ユーザー名、パスワードなどのデータベース接続パラメーターを定義します。

    ```kotlin
    val URL = "YOUR_URL"
    val USER_NAME = "YOUR_USERNAME"
    val PASSWORD = "YOUR_PASSWORD"
    
    val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
    ```

5.  接続後、`getSchemaForAllSqlTables()`関数を使用して、データベース内の各テーブルのスキーマ情報を取得して表示します。

    ```kotlin
    val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
    
    dataschemas.forEach { 
        println("---Yet another table schema---")
        println(it)
        println()
    }
    ```

    > SQLデータベースへの接続の詳細については、[Kotlin DataFrameドキュメントの「SQLデータベースからの読み取り」](https://kotlin.github.io/dataframe/readsqldatabases.html)を参照してください。
    >
    {style="tip"}

## データの取得と操作

[SQLデータベースへの接続を確立](#connect-to-database)した後、Kotlin DataFrameライブラリを活用して、Kotlin Notebookでデータを取得および操作できます。
`readSqlTable()`関数を使用してデータを取得できます。データを操作するには、[`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、
および[`convert`](https://kotlin.github.io/dataframe/convert.html)などのメソッドを使用できます。

IMDBデータベースに接続し、クエンティン・タランティーノ監督の映画に関するデータを取得する例を見てみましょう。

1.  `readSqlTable()`関数を使用して「movies」テーブルからデータを取得し、効率のためにクエリを最初の100レコードに制限するように`limit`を設定します。

    ```kotlin
    val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
    ```

2.  SQLクエリを使用して、クエンティン・タランティーノ監督の映画に関連する特定のデータセットを取得します。
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
    
    // クエンティン・タランティーノ監督の映画のリストを、名前、年、ランク、および結合されたすべてのジャンルの文字列を含めて取得します。結果は名前、年、ランクでグループ化され、年でソートされます。
    
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

3.  タランティーノ監督の映画データセットを取得した後、さらにデータを操作およびフィルタリングできます。

    ```kotlin
    val df = dfTarantinoMovies
        // 'year'列の欠損値をすべて0に置換します。
        .fillNA { year }.with { 0 }
        
        // 'year'列を整数に変換します。
        .convert { year }.toInt()
    
        // 2000年以降に公開された映画のみを含むようにデータをフィルタリングします。
        .filter { year > 2000 }
    df
    ```

結果として得られる出力は、[`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna)メソッドを使用してyear列の欠損値が0に置換され、
[`convert`](https://kotlin.github.io/dataframe/convert.html)メソッドでyear列が整数値に変換され、
[`filter`](https://kotlin.github.io/dataframe/filter.html)メソッドを使用して2000年以降の行のみを含むようにデータがフィルタリングされたDataFrameです。

## Kotlin Notebookでデータを分析する

[SQLデータベースへの接続を確立](#connect-to-database)した後、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)を活用して、Kotlin Notebookで綿密なデータ分析を行うことができます。
これには、データのグループ化、ソート、集計を行う関数が含まれており、データ内のパターンを明らかにし、理解するのに役立ちます。

映画データベースから俳優データを分析し、最も頻繁に出現する俳優のファーストネームに焦点を当てる例を見てみましょう。

1.  [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables)関数を使用して「actors」テーブルからデータを抽出します。

    ```kotlin
    val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
    ```

2.  取得したデータを処理して、最も一般的な俳優のファーストネーム上位20を特定します。この分析にはいくつかのDataFrameメソッドが含まれます。

    ```kotlin
    val top20ActorNames = actorDf
        // 俳優のファーストネームに基づいてデータを整理するため、first_name列でデータをグループ化します。
       .groupBy { first_name }
    
        // 各一意のファーストネームの出現回数を数え、頻度分布を提供します。
       .count()
    
        // 最も一般的な名前を特定するため、結果をカウントの降順でソートします。
       .sortByDesc("count")
    
        // 分析のため、頻度が高い上位20の名前を選択します。
       .take(20)
    top20ActorNames
    ```

## 次に行うこと

*   [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータ視覚化の探索
*   [Kandyを使用したKotlin Notebookでのデータ視覚化](data-analysis-visualization.md)に関する追加情報を見つける
*   Kotlinでのデータサイエンスと分析に利用できるツールとリソースの広範な概要については、[KotlinとJavaのデータ分析ライブラリ](data-analysis-libraries.md)を参照してください