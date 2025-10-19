[//]: # (title: ファイルからデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md)は、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)と組み合わせることで、非構造化データと構造化データの両方を扱えるようになります。この組み合わせにより、TXTファイルのような非構造化データを構造化データセットに変換する柔軟性が得られます。

データ変換には、[`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)などのメソッドを使用できます。さらに、このツールセットを使用すると、CSV、JSON、XLS、XLSX、Apache Arrowなど、さまざまな構造化ファイル形式からデータを取得および操作できます。

このガイドでは、複数の例を通して、データの取得、整形、処理の方法を学ぶことができます。

## 開始する前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、このプラグインはIntelliJ IDEAにデフォルトでバンドルされ、有効化されています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境をセットアップする](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成する:

1. **File** | **New** | **Kotlin Notebook** を選択します。

2. Kotlin Notebookで、次のコマンドを実行してKotlin DataFrameライブラリをインポートします:

   ```kotlin
   %use dataframe
   ```

## ファイルからデータを取得する

Kotlin Notebookでファイルからデータを取得するには:

1. Kotlin Notebookファイル（`.ipynb`）を開きます。
2. ノートブックの先頭にあるコードセルに `%use dataframe` を追加して、Kotlin DataFrameライブラリをインポートします。
   > `%use dataframe` の行があるコードセルは、Kotlin DataFrameライブラリに依存する他のコードセルを実行する前に必ず実行してください。
   >
   {style="note"}

3. Kotlin DataFrameライブラリの [`.read()`](https://kotlin.github.io/dataframe/read.html) 関数を使用してデータを取得します。たとえば、CSVファイルを読み込むには `DataFrame.read("example.csv")` を使用します。

`.read()` 関数は、ファイル拡張子とコンテンツに基づいて入力形式を自動的に検出します。また、`delimiter = ';'` で区切り文字を指定するなど、関数をカスタマイズするための他の引数を追加することもできます。

> 追加のファイル形式とさまざまな読み込み関数の詳細については、[Kotlin DataFrameライブラリのドキュメント](https://kotlin.github.io/dataframe/read.html)を参照してください。
>
{style="tip"}

## データを表示する

ノートブックに[データを取り込んだら](#retrieve-data-from-a-file)、次のコードセルを実行することで、簡単に変数に保存してアクセスできます:

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

このコードは、CSV、JSON、XLS、XLSX、Apache Arrowなど、選択したファイルからデータを表示します。

![Display data](display-data.png){width=700}

データの構造またはスキーマを把握するには、DataFrame変数に `.schema()` 関数を適用します。たとえば、`dfJson.schema()` はJSONデータセット内の各列の型をリスト表示します。

![Schema example](schema-data-analysis.png){width=700}

Kotlin Notebookのオートコンプリート機能を使用すると、DataFrameのプロパティに素早くアクセスして操作できます。データをロードした後、DataFrame変数の後にドットを入力するだけで、利用可能な列とその型の一覧が表示されます。

![Available properties](auto-completion-data-analysis.png){width=700}

## データを整形する

Kotlin DataFrameライブラリでデータセットを整形するために利用できるさまざまな操作の中でも、主な例として[グルーピング](https://kotlin.github.io/dataframe/group.html)、[フィルタリング](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html)、[新しい列の追加](https://kotlin.github.io/dataframe/add.html)があります。これらの関数はデータ分析に不可欠であり、データを効果的に整理、クリーンアップ、変換するのに役立ちます。

データに映画のタイトルと対応する公開年が同じセルに含まれている例を見てみましょう。目標は、このデータセットを分析しやすくするために整形することです:

1. `.read()` 関数を使用してデータをノートブックにロードします。この例では、`movies.csv`という名前のCSVファイルからデータを読み込み、`movies`というDataFrameを作成します:

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 正規表現を使用して映画のタイトルから公開年を抽出し、新しい列として追加します:

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

3. 各タイトルから公開年を削除して、映画のタイトルを変更します。これにより、タイトルが整形され、一貫性が保たれます:

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. `filter` メソッドを使用して特定のデータに焦点を当てます。この場合、データセットは1996年以降に公開された映画に絞り込まれます:

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

比較のために、整形前のデータセットを次に示します。

![Original dataset](original-dataset.png){width=700}

整形されたデータセット:

![Data refinement result](refined-data.png){width=700}

これは、Kotlinでデータを効果的に整形および分析するために、Kotlin DataFrameライブラリの `add`、`update`、`filter` などのメソッドをどのように使用できるかを示す実用的なデモンストレーションです。

> 追加のユースケースと詳細な例については、[Kotlin Dataframeの例](https://github.com/Kotlin/dataframe/tree/master/examples)を参照してください。
> 
{style="tip"}

## DataFrameを保存する

Kotlin DataFrameライブラリを使用してKotlin Notebookで[データを整形した](#refine-data)後、処理済みのデータを簡単にエクスポートできます。この目的のために、さまざまな[`.write()`](https://kotlin.github.io/dataframe/write.html) 関数を利用できます。これらは、CSV、JSON、XLS、XLSX、Apache Arrow、さらにはHTMLテーブルなど、複数の形式での保存をサポートしています。これは、調査結果の共有、レポートの作成、またはさらなる分析のためにデータを利用可能にするのに特に役立ちます。

DataFrameをフィルタリングし、列を削除し、整形されたデータをJSONファイルに保存し、HTMLテーブルをブラウザで開く方法を次に示します:

1. Kotlin Notebookで、`.read()` 関数を使用して `movies.csv` という名前のファイルを `moviesDf` という名前のDataFrameにロードします:

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. `.filter` メソッドを使用して、DataFrameを「アクション」ジャンルに属する映画のみにフィルタリングします:

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. `.remove` を使用してDataFrameから `movieId` 列を削除します:

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrameライブラリは、さまざまな形式でデータを保存するためのさまざまな書き込み関数を提供します。この例では、[`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 関数が使用され、変更された `movies.csv` をJSONファイルとして保存します:

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. `.toStandaloneHTML()` 関数を使用してDataFrameをスタンドアロンHTMLテーブルに変換し、デフォルトのWebブラウザで開きます:

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 次のステップ

* [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用してデータ視覚化を探索する
* [Kandyを使用したKotlin Notebookでのデータ視覚化](data-analysis-visualization.md)でデータ視覚化に関する追加情報を見つける
* Kotlinにおけるデータサイエンスと分析に利用できるツールとリソースの広範な概要については、[KotlinおよびJavaのデータ分析用ライブラリ](data-analysis-libraries.md)を参照してください。