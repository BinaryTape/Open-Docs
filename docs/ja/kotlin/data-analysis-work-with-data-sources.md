[//]: # (title: ファイルからデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md)は、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)と組み合わせることで、非構造化データと構造化データの両方を扱うことができます。この組み合わせにより、TXTファイルに含まれるデータなどの非構造化データを構造化データセットに変換する柔軟性が提供されます。

データ変換には、[`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)などのメソッドを使用できます。さらに、このツールセットは、CSV、JSON、XLS、XLSX、Apache Arrowなどの様々な構造化ファイル形式からのデータの取得と操作を可能にします。

このガイドでは、複数の例を通して、データの取得、整形、および処理の方法を学ぶことができます。

## 始める前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、このプラグインはIntelliJ IDEAにデフォルトでバンドルされ、有効化されています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成する:

1.  **File** | **New** | **Kotlin Notebook**を選択します。
2.  Kotlin Notebookで、次のコマンドを実行してKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use dataframe
    ```

## ファイルからデータを取得する

Kotlin Notebookでファイルからデータを取得するには:

1.  Kotlin Notebookファイル (`.ipynb`) を開きます。
2.  ノートブックの先頭にあるコードセルに`%use dataframe`を追加して、Kotlin DataFrameライブラリをインポートします。
    > Kotlin DataFrameライブラリに依存する他のコードセルを実行する前に、`%use dataframe`行を含むコードセルを必ず実行してください。
    >
    {style="note"}

3.  Kotlin DataFrameライブラリの[`.read()`](https://kotlin.github.io/dataframe/read.html)関数を使用してデータを取得します。例えば、CSVファイルを読み込むには、`DataFrame.read("example.csv")`を使用します。

`.read()`関数は、ファイル拡張子と内容に基づいて入力形式を自動的に検出します。`delimiter = ';'`でデリミタを指定するなど、関数をカスタマイズするために他の引数を追加することもできます。

> その他のファイル形式と様々な読み取り関数の包括的な概要については、[Kotlin DataFrameライブラリのドキュメント](https://kotlin.github.io/dataframe/read.html)を参照してください。
>
{style="tip"}

## データを表示する

ノートブックにデータを取り込んだら、変数をに簡単に保存し、コードセルで次を実行することでアクセスできます。

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

このコードは、CSV、JSON、XLS、XLSX、Apache Arrowなど、選択したファイルからのデータを表示します。

![Display data](display-data.png){width=700}

データの構造やスキーマに関する洞察を得るには、DataFrame変数に`.schema()`関数を適用します。例えば、`dfJson.schema()`はJSONデータセットの各列の型をリストします。

![Schema example](schema-data-analysis.png){width=700}

Kotlin Notebookのオートコンプリート機能を使用して、DataFrameのプロパティに素早くアクセスして操作することもできます。データをロードした後、DataFrame変数の後にドットを入力するだけで、利用可能な列とその型のリストが表示されます。

![Available properties](auto-completion-data-analysis.png){width=700}

## データを整形する

データセットを整形するためにKotlin DataFrameライブラリで利用可能な様々な操作の中でも、主な例としては[グループ化](https://kotlin.github.io/dataframe/group.html)、[フィルタリング](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html)、[新しい列の追加](https://kotlin.github.io/dataframe/add.html)などがあります。これらの関数はデータ分析に不可欠であり、データを効果的に整理、クリーンアップ、変換することができます。

データに映画のタイトルとそれに対応する公開年が同じセルに含まれている例を見てみましょう。目標は、分析を容易にするためにこのデータセットを整形することです。

1.  `.read()`関数を使用してデータをノートブックにロードします。この例では、`movies.csv`という名前のCSVファイルからデータを読み込み、`movies`というDataFrameを作成します。

    ```kotlin
    val movies = DataFrame.read("movies.csv")
    ```

2.  正規表現を使用して映画のタイトルから公開年を抽出し、新しい列として追加します。

    ```kotlin
    val moviesWithYear = movies
        .add("year") {
            "\\d{4}".toRegex()
                .findAll(title)
                .lastOrNull()
                ?.value
                ?.toInt()
                ?: -1
        }
    ```

3.  各タイトルから公開年を削除して、映画のタイトルを修正します。これにより、タイトルが整形され、一貫性が保たれます。

    ```kotlin
    val moviesTitle = moviesWithYear
        .update("title") {
            "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
        }
    ```

4.  `filter`メソッドを使用して特定のデータに焦点を当てます。この場合、データセットは1996年以降に公開された映画に焦点を当てるようにフィルタリングされます。

    ```kotlin
    val moviesNew = moviesWithYear.filter { year >= 1996 }
    moviesNew
    ```

比較のため、整形前のデータセットを次に示します。

![Original dataset](original-dataset.png){width=700}

整形されたデータセット:

![Data refinement result](refined-data.png){width=700}

これは、Kotlinで`add`、`update`、`filter`などのKotlin DataFrameライブラリのメソッドを使用してデータを効果的に整形し、分析する方法を実践的に示すものです。

> 追加のユースケースと詳細な例については、[Examples of Kotlin Dataframe](https://github.com/Kotlin/dataframe/tree/master/examples)を参照してください。
>
{style="tip"}

## DataFrameを保存する

Kotlin DataFrameライブラリを使用して[Kotlin Notebookでデータを整形](#refine-data)した後、処理されたデータを簡単にエクスポートできます。この目的のために、CSV、JSON、XLS、XLSX、Apache Arrow、さらにはHTMLテーブルを含む複数の形式での保存をサポートする様々な[`.write()`](https://kotlin.github.io/dataframe/write.html)関数を利用できます。これは、調査結果の共有、レポートの作成、またはさらなる分析のためにデータを利用可能にするのに特に役立ちます。

DataFrameをフィルタリングし、列を削除し、整形されたデータをJSONファイルに保存し、ブラウザでHTMLテーブルを開く方法を次に示します。

1.  Kotlin Notebookで、`.read()`関数を使用して`movies.csv`という名前のファイルを`moviesDf`というDataFrameにロードします。

    ```kotlin
    val moviesDf = DataFrame.read("movies.csv")
    ```

2.  `.filter`メソッドを使用して、"Action"ジャンルに属する映画のみを含めるようにDataFrameをフィルタリングします。

    ```kotlin
    val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
    ```

3.  `.remove`を使用して、DataFrameから`movieId`列を削除します。

    ```kotlin
    val refinedMoviesDf = actionMoviesDf.remove { movieId }
    refinedMoviesDf
    ```

4.  Kotlin DataFrameライブラリは、異なる形式でデータを保存するための様々な書き込み関数を提供しています。この例では、[`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json)関数を使用して、変更された`movies.csv`をJSONファイルとして保存します。

    ```kotlin
    refinedMoviesDf.writeJson("movies.json")
    ```

5.  `.toStandaloneHTML()`関数を使用してDataFrameをスタンドアロンHTMLテーブルに変換し、デフォルトのWebブラウザで開きます。

    ```kotlin
    refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
    ```

## 次に

*   [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータ可視化を探求する
*   [Kandyを使用したKotlin Notebookでのデータ可視化](data-analysis-visualization.md)でデータ可視化に関する追加情報を見つける
*   Kotlinでのデータサイエンスと分析のための利用可能なツールとリソースの広範な概要については、[KotlinとJavaのデータ分析ライブラリ](data-analysis-libraries.md)を参照してください