---
title: ファイルからデータを取得する
---
[Kotlin Notebook](kotlin-notebook-overview)は、[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)と組み合わせることで、非構造化データと構造化データの両方を扱うことができます。この組み合わせにより、TXTファイルにあるデータのような非構造化データを、構造化されたデータセットに柔軟に変換できます。

データ変換には、[`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)などのメソッドを使用できます。さらに、このツールセットを使用すると、CSV、JSON、XLS、XLSX、Apache Arrowなどのさまざまな構造化ファイル形式のデータを取得および操作できます。

このガイドでは、複数の例を通して、データを取得、改良、および処理する方法を学ぶことができます。

## 始める前に

1. 最新バージョンの[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac)をダウンロードしてインストールします。
2. IntelliJ IDEAに[Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)をインストールします。

   > または、IntelliJ IDEA内の**Settings** | **Plugins** | **Marketplace**からKotlin Notebook pluginにアクセスします。
   >
   

3. **File** | **New** | **Kotlin Notebook**を選択して、新しいKotlin Notebookを作成します。
4. Kotlin Notebookで、次のコマンドを実行してKotlin DataFrameライブラリをインポートします。

   ```kotlin
   %use dataframe
   ```

## ファイルからデータを取得する

Kotlin Notebookでファイルからデータを取得するには：

1. Kotlin Notebookファイル（`.ipynb`）を開きます。
2. Notebookの先頭にあるコードセルに`%use dataframe`を追加して、Kotlin DataFrameライブラリをインポートします。
   > Kotlin DataFrameライブラリに依存する他のコードセルを実行する前に、`%use dataframe`行を含むコードセルを実行してください。
   >
   

3. Kotlin DataFrameライブラリの[`.read()`](https://kotlin.github.io/dataframe/read.html)関数を使用して、データを取得します。たとえば、CSVファイルを読み取るには、`DataFrame.read("example.csv")`を使用します。

`.read()`関数は、ファイル拡張子とコンテンツに基づいて入力形式を自動的に検出します。`delimiter = ';'`で区切り文字を指定するなど、他の引数を追加して関数をカスタマイズすることもできます。

:::tip
追加のファイル形式とさまざまな読み取り関数の包括的な概要については、[Kotlin DataFrameライブラリのドキュメント](https://kotlin.github.io/dataframe/read.html)を参照してください。

:::

## データを表示する

[Notebookにデータを取り込んだら](#retrieve-data-from-a-file)、簡単に変数に格納し、コードセルで次を実行してアクセスできます。

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

このコードは、CSV、JSON、XLS、XLSX、Apache Arrowなど、選択したファイルのデータを表示します。

<img src="/img/display-data.png" alt="Display data" width="700" style={{verticalAlign: 'middle'}}/>

データの構造またはスキーマに関する洞察を得るには、DataFrame変数に`.schema()`関数を適用します。たとえば、`dfJson.schema()`は、JSONデータセット内の各列の型をリストします。

<img src="/img/schema-data-analysis.png" alt="Schema example" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebookのオートコンプリート機能を使用して、DataFrameのプロパティにすばやくアクセスして操作することもできます。データをロードした後、DataFrame変数の後にドットを入力するだけで、使用可能な列とその型のリストが表示されます。

<img src="/img/auto-completion-data-analysis.png" alt="Available properties" width="700" style={{verticalAlign: 'middle'}}/>

## データを改良する

Kotlin DataFrameライブラリで利用可能なデータセットを改良するためのさまざまな操作の中でも、主な例としては、[grouping](https://kotlin.github.io/dataframe/group.html)、[filtering](https://kotlin.github.io/dataframe/filter.html)、[updating](https://kotlin.github.io/dataframe/update.html)、および[新しい列の追加](https://kotlin.github.io/dataframe/add.html)があります。これらの関数はデータ分析に不可欠であり、データを効果的に整理、クリーンアップ、および変換できます。

データに映画のタイトルと対応する公開年が同じセルに含まれている例を見てみましょう。目標は、分析を容易にするためにこのデータセットを改良することです。

1. `.read()`関数を使用して、データをNotebookにロードします。この例では、`movies.csv`という名前のCSVファイルからデータを読み取り、`movies`というDataFrameを作成します。

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 正規表現を使用して映画のタイトルから公開年を抽出し、新しい列として追加します。

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

3. 各タイトルから公開年を削除して、映画のタイトルを変更します。これにより、タイトルの一貫性が保たれます。

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. `filter`メソッドを使用して、特定のデータに焦点を当てます。この場合、データセットは、1996年以降に公開された映画に焦点を当てるようにフィルタリングされています。

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

比較のために、改良前のデータセットを次に示します。

<img src="/img/original-dataset.png" alt="Original dataset" width="700" style={{verticalAlign: 'middle'}}/>

改良されたデータセット：

<img src="/img/refined-data.png" alt="Data refinement result" width="700" style={{verticalAlign: 'middle'}}/>

これは、Kotlin DataFrameライブラリの`add`、`update`、および`filter`のようなメソッドを使用して、Kotlinでデータを効果的に改良および分析する方法の実用的なデモンストレーションです。

:::tip
追加のユースケースと詳細な例については、[Kotlin Dataframeの例](https://github.com/Kotlin/dataframe/tree/master/examples)を参照してください。

:::

## DataFrameを保存する

Kotlin DataFrameライブラリを使用して[Kotlin Notebookでデータを改良した後](#refine-data)、処理されたデータを簡単にエクスポートできます。この目的のために、さまざまな[`.write()`](https://kotlin.github.io/dataframe/write.html)関数を利用できます。これらの関数は、CSV、JSON、XLS、XLSX、Apache Arrow、さらにはHTMLテーブルなど、複数の形式での保存をサポートしています。これは、調査結果の共有、レポートの作成、またはデータを利用してさらに分析する場合に特に役立ちます。

DataFrameをフィルタリングし、列を削除し、改良されたデータをJSONファイルに保存し、HTMLテーブルをブラウザで開く方法は次のとおりです。

1. Kotlin Notebookで、`.read()`関数を使用して、`movies.csv`という名前のファイルを`moviesDf`というDataFrameにロードします。

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. `.filter`メソッドを使用して、DataFrameをフィルタリングして、「Action」ジャンルに属する映画のみを含めます。

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. `.remove`を使用して、DataFrameから`movieId`列を削除します。

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrameライブラリには、さまざまな形式でデータを保存するためのさまざまな書き込み関数が用意されています。この例では、[`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json)関数を使用して、変更された`movies.csv`をJSONファイルとして保存します。

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. `.toStandaloneHTML()`関数を使用して、DataFrameをスタンドアロンのHTMLテーブルに変換し、デフォルトのWebブラウザで開きます。

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 次のステップ

* [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータの可視化について調べる
* [Kandyを使用したKotlin Notebookでのデータの可視化](data-analysis-visualization)で、データの可視化に関する追加情報を探す
* Kotlinでのデータサイエンスと分析に利用できるツールとリソースの包括的な概要については、[データ分析用のKotlinおよびJavaライブラリ](data-analysis-libraries)を参照してください