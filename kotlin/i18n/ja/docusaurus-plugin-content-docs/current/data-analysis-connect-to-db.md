---
title: データベースに接続してデータを取得する
---
[Kotlin Notebook](kotlin-notebook-overview) は、MariaDB、PostgreSQL、MySQL、SQLite などのさまざまな種類の SQL データベースに接続してデータを取得する機能を提供します。
[Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html) を利用することで、Kotlin Notebook はデータベースへの接続を確立し、SQL クエリを実行し、結果をインポートしてさらなる操作を行うことができます。

詳細な例については、[KotlinDataFrame SQL Examples GitHub リポジトリの Notebook](https://github.com/zaleslaw/KotlinDataFrame-SQL-Examples/blob/master/notebooks/imdb.ipynb) を参照してください。

## 開始する前に

1. 最新バージョンの [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac) をダウンロードしてインストールします。
2. IntelliJ IDEA に [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) をインストールします。

   > または、IntelliJ IDEA 内の **Settings** | **Plugins** | **Marketplace** から Kotlin Notebook プラグインにアクセスします。
   >
   

3. **File** | **New** | **Kotlin Notebook** を選択して、新しい Kotlin Notebook を作成します。
4. MariaDB や MySQL などの SQL データベースにアクセスできることを確認します。

## データベースに接続する

[Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html) の特定の関数を使用して、SQL データベースに接続して操作できます。
`DatabaseConfiguration` を使用してデータベースへの接続を確立し、`getSchemaForAllSqlTables()` を使用してデータベース内のすべてのテーブルのスキーマを取得できます。

例を見てみましょう。

1. Kotlin Notebook ファイル (`.ipynb`) を開きます。
2. JDBC (Java Database Connectivity) ドライバーの依存関係を追加し、JDBC ドライバーのバージョンを指定します。
この例では MariaDB を使用します。

   ```kotlin
   USE {
      dependencies("org.mariadb.jdbc:mariadb-java-client:$version")
   }
   ```

3. データ操作タスクに不可欠な Kotlin DataFrame ライブラリと、SQL 接続とユーティリティ関数に必要な Java ライブラリをインポートします。

   ```kotlin
   %use dataframe
   import java.sql.DriverManager
   import java.util.*
   ```

4. `DatabaseConfiguration` クラスを使用して、URL、ユーザー名、パスワードなど、データベースの接続パラメーターを定義します。

   ```kotlin
   val URL = "YOUR_URL"
   val USER_NAME = "YOUR_USERNAME"
   val PASSWORD = "YOUR_PASSWORD"
   
   val dbConfig = DatabaseConfiguration(URL, USER_NAME, PASSWORD)
   ```

5. 接続したら、`getSchemaForAllSqlTables()` 関数を使用して、データベース内の各テーブルのスキーマ情報を取得して表示します。

   ```kotlin
   val dataschemas = DataFrame.getSchemaForAllSqlTables(dbConfig)
   
   dataschemas.forEach { 
       println("---Yet another table schema---")
       println(it)
       println()
   }
   ```

   > SQL データベースへの接続の詳細については、[Kotlin DataFrame ドキュメントの SQL データベースからの読み取り](https://kotlin.github.io/dataframe/readsqldatabases.html) を参照してください。
   > 
   

## データを取得および操作する

[SQL データベースへの接続を確立](#connect-to-database) した後、Kotlin DataFrame ライブラリを利用して、Kotlin Notebook でデータを取得および操作できます。
`readSqlTable()` 関数を使用してデータを取得できます。データを操作するには、[`filter`](https://kotlin.github.io/dataframe/filter.html)、[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html) などのメソッドを使用できます。

IMDB データベースに接続し、クエンティン・タランティーノが監督した映画に関するデータを取得する例を見てみましょう。

1. `readSqlTable()` 関数を使用して「movies」テーブルからデータを取得し、効率のために `limit` を設定してクエリを最初の 100 レコードに制限します。

   ```kotlin
   val dfs = DataFrame.readSqlTable(dbConfig, tableName = "movies", limit = 100)
   ```

2. SQL クエリを使用して、クエンティン・タランティーノが監督した映画に関連する特定のデータセットを取得します。
このクエリは、映画の詳細を選択し、各映画のジャンルを結合します。

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
   
   // クエンティン・タランティーノの映画のリストを、名前、年、ランク、およびすべてのジャンルを連結した文字列を含めて取得します。
   // 結果は名前、年、ランクでグループ化され、年でソートされます。
   
   var dfTarantinoMovies: DataFrame<*>
   
   DriverManager.getConnection(URL, props).use { connection `->`
      connection.createStatement().use { st `->`
         st.executeQuery(TARANTINO_FILMS_SQL_QUERY).use { rs `->`
            val dfTarantinoFilmsSchema = DataFrame.getSchemaForResultSet(rs, connection)
            dfTarantinoFilmsSchema.print()
   
            dfTarantinoMovies = DataFrame.readResultSet(rs, connection)
            dfTarantinoMovies
         }
      }
   }
   ```

3. タランティーノの映画データセットを取得した後、データをさらに操作およびフィルタリングできます。

   ```kotlin
   val df = dfTarantinoMovies
       // 'year' 列の欠損値を 0 に置き換えます。
       .fillNA { year }.with { 0 }
       
       // 'year' 列を整数に変換します。
       .convert { year }.toInt()
   
       // 2000 年以降に公開された映画のみを含むようにデータをフィルタリングします。
       .filter { year > 2000 }
   df
   ```

結果の出力は、[`fillNA`](https://kotlin.github.io/dataframe/fill.html#fillna) メソッドを使用して year 列の欠損値が 0 に置き換えられた DataFrame です。
year 列は [`convert`](https://kotlin.github.io/dataframe/convert.html) メソッドを使用して整数値に変換され、データは [`filter`](https://kotlin.github.io/dataframe/filter.html) メソッドを使用して 2000 年以降の行のみを含むようにフィルタリングされます。

## Kotlin Notebook でデータを分析する

[SQL データベースへの接続を確立](#connect-to-database) した後、[Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html) を利用して、Kotlin Notebook を詳細なデータ分析に使用できます。
これには、データのグループ化、ソート、集計の機能が含まれており、データ内のパターンを発見して理解するのに役立ちます。

映画データベースから俳優データを分析し、俳優の最も頻繁に出現する名前 (名) に焦点を当てた例を見てみましょう。

1. [`readSqlTable()`](https://kotlin.github.io/dataframe/readsqldatabases.html#reading-specific-tables) 関数を使用して、「actors」テーブルからデータを抽出します。

   ```kotlin
   val actorDf = DataFrame.readSqlTable(dbConfig, "actors", 10000)
   ```

2. 取得したデータを処理して、最も一般的な俳優の名前 (名) の上位 20 件を特定します。この分析には、いくつかの DataFrame メソッドが含まれます。

   ```kotlin
   val top20ActorNames = actorDf
       // 俳優の名前 (名) に基づいてデータを整理するために、first_name 列でデータをグループ化します。
      .groupBy { first_name }
   
       // 一意の名前 (名) の出現回数をカウントし、頻度分布を提供します。
      .count()
   
       // 最も一般的な名前を特定するために、カウントの降順で結果をソートします。
      .sortByDesc("count")
   
       // 分析のために、上位 20 件の最も頻繁な名前を選択します。
      .take(20)
   top20ActorNames
   ```

## 次のステップ

* [Kandy library](https://kotlin.github.io/kandy/examples.html) を使用したデータ視覚化について調べる
* [Kotlin Notebook での Kandy を使用したデータ視覚化](data-analysis-visualization) でデータ視覚化に関する追加情報を見つける
* Kotlin でのデータサイエンスと分析に利用できるツールとリソースの包括的な概要については、[データ分析用の Kotlin および Java ライブラリ](data-analysis-libraries) を参照してください