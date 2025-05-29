[//]: # (title: データベースに接続してデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md)は、MariaDB、PostgreSQL、MySQL、SQLiteなど、様々な種類のSQLデータベースに接続し、データを取得する機能を提供します。
[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)を活用することで、Kotlin Notebookはデータベースへの接続を確立し、SQLクエリを実行し、結果をインポートしてさらなる操作を行うことができます。

詳細な例については、[KotlinDataFrame SQL Examples GitHubリポジトリのNotebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb)を参照してください。

## 始める前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。
このプラグインは、IntelliJ IDEAにデフォルトでバンドルされ、有効化されています。

Kotlin Notebookの機能が利用できない場合、プラグインが有効になっていることを確認してください。詳細については、[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成します：

1.  **File** | **New** | **Kotlin Notebook**を選択します。
2.  MariaDBやMySQLなどのSQLデータベースにアクセスできることを確認してください。

## データベースに接続する

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)の特定の関数を使用して、SQLデータベースに接続し、操作することができます。
`DatabaseConfiguration`を使用してデータベースへの接続を確立し、`getSchemaForAllSqlTables()`を使用してその中のすべてのテーブルのスキーマを取得できます。

例を見てみましょう：

1.  Kotlin Notebookファイル（`.ipynb`）を開きます。
2.  JDBC (Java Database Connectivity) ドライバーの依存関係を追加し、JDBCドライバーのバージョンを指定します。
    この例ではMariaDBを使用しています：

    ```kotlin
    USE {
       dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
    }
    ```

3.  データ操作タスクに不可欠なKotlin DataFrameライブラリと、SQL接続およびユーティリティ関数に必要なJavaライブラリをインポートします：

    ```kotlin
    %use dataframe
    import java.sql.DriverManager
    import java.util.*
    ```

4.  `DatabaseConfiguration`クラスを使用して、URL、ユーザー名、パスワードを含むデータベースの接続パラメータを定義します：

    ```kotlin
    val URL = "YOUR_URL"
    val USER_NAME = "YOUR_USERNAME"
    val PASSWORD = "YOUR_PASSWORD"
    
    val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
    ```

5.  接続が確立されたら、`getSchemaForAllSqlTables()`関数を使用して、データベース内の各テーブルのスキーマ情報を取得して表示します：

    ```kotlin
    val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
    
    dataschemas.forEach { 
        println("---Yet another table schema---")
        println(it)
        println()
    }
    ```

    > SQLデータベースへの接続に関する詳細については、[Kotlin DataFrameドキュメントの「Read from SQL databases」](https://kotlin.github.io/dataframe/readsqldatabases.html)を参照してください。
    > 
    {style="tip"}

## データを取得し操作する

[SQLデータベースへの接続を確立した後](#connect-to-database)、Kotlin DataFrameライブラリを活用して、Kotlin Notebookでデータを取得し操作することができます。
`readSqlTable()`関数を使用してデータを取得できます。データを操作するには、[`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)などのメソッドを使用できます。

IMDBデータベースに接続し、クエンティン・タランティーノが監督した映画に関するデータを取得する例を見てみましょう：

1.  `readSqlTable()`関数を使用して、"movies"テーブルからデータを取得します。効率のためにクエリを最初の100レコードに制限するように`limit`を設定します：

    ```kotlin
    val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
    ```

2.  クエンティン・タランティーノが監督した映画に関連する特定のデータセットを取得するためにSQLクエリを使用します。
    このクエリは映画の詳細を選択し、各映画のジャンルを結合します：

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
    
    // クエンティン・タランティーノ監督の映画のリストを、その名前、年、ランク、およびすべてのジャンルを連結した文字列を含めて取得します。 
    // 結果は名前、年、ランクでグループ化され、年でソートされます。
    
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

3.  タランティーノ映画のデータセットを取得した後、さらにデータを操作およびフィルタリングすることができます。

    ```kotlin
    val df = dfTarantinoMovies
        // 'year'列の欠損値を0に置換します。
        .fillNA { year }.with { 0 }
        
        // 'year'列を整数に変換します。
        .convert { year }.toInt()
    
        // 2000年以降に公開された映画のみを含むようにデータをフィルタリングします。
        .filter { year > 2000 }
    df
    ```

結果として得られる出力は、[`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna)メソッドを使用してyear列の欠損値が0に置換されたDataFrameです。year列は[`convert`](https://kotlin.github.io/dataframe/convert.html)メソッドで整数値に変換され、データは[`filter`](https://kotlin.github.io/dataframe/filter.html)メソッドを使用して2000年以降の行のみを含むようにフィルタリングされます。

## Kotlin Notebookでデータを分析する

[SQLデータベースへの接続を確立した後](#connect-to-database)、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)を活用して、Kotlin Notebookで詳細なデータ分析を行うことができます。これには、データのグループ化、ソート、集計のための関数が含まれており、データ内のパターンを発見し理解するのに役立ちます。

映画データベースから俳優データを分析する例を見てみましょう。ここでは、俳優の最も頻繁に現れるファーストネームに焦点を当てています：

1.  [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables)関数を使用して、"actors"テーブルからデータを抽出します：

    ```kotlin
    val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
    ```

2.  取得したデータを処理して、最も一般的な俳優のファーストネーム上位20を特定します。この分析にはいくつかのDataFrameメソッドが含まれます：

    ```kotlin
    val top20ActorNames = actorDf
        // 俳優のファーストネームに基づいてデータを整理するために、first_name列でデータをグループ化します。
       .groupBy { first_name }
    
        // 各ユニークなファーストネームの出現回数を数え、頻度分布を提供します。
       .count()
    
        // 最も一般的な名前を特定するために、結果をカウントの降順でソートします。
       .sortByDesc("count")
    
        // 分析のために最も頻繁に現れる名前の上位20を選択します。
       .take(20)
    top20ActorNames
    ```

## 次のステップ

*   [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータ可視化を探索する
*   [Kotlin NotebookでのKandyによるデータ可視化](data-analysis-visualization.md)でデータ可視化に関する追加情報を見つける
*   Kotlinでのデータサイエンスおよび分析に利用可能なツールとリソースの広範な概要については、[データ分析のためのKotlinおよびJavaライブラリ](data-analysis-libraries.md)を参照してください