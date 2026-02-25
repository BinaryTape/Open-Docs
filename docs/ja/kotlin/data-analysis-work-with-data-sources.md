[//]: # (title: ファイルからデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md) は、[Kotlin DataFrame ライブラリ](https://kotlin.github.io/dataframe/home.html)と組み合わせることで、非構造化データと構造化データの両方を扱うことができます。この組み合わせにより、TXT ファイルに含まれるデータなどの非構造化データを、構造化されたデータセットに変換する柔軟性が得られます。

データの変換には、[`add`](https://kotlin.github.io/dataframe/adddf.html)、[`split`](https://kotlin.github.io/dataframe/split.html)、[`convert`](https://kotlin.github.io/dataframe/convert.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html) などのメソッドを使用できます。さらに、このツールセットを使用すると、CSV、JSON、XLS、XLSX、Apache Arrow など、さまざまな構造化ファイル形式からデータを取得し、操作することができます。

このガイドでは、複数の例を通して、データの取得、精製、および処理の方法を学ぶことができます。

## 始める前に

Kotlin Notebook は、IntelliJ IDEA にデフォルトでバンドルされ、有効になっている [Kotlin Notebook プラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。

Kotlin Notebook の機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、「[環境の設定](kotlin-notebook-set-up-env.md)」を参照してください。

新しい Kotlin Notebook を作成します：

1. **File** | **New** | **Kotlin Notebook** を選択します。

2. Kotlin Notebook で、次のコマンドを実行して Kotlin DataFrame ライブラリをインポートします：

   ```kotlin
   %use dataframe
   ```

## ファイルからデータを取得する

Kotlin Notebook でファイルからデータを取得するには：

1. Kotlin Notebook ファイル（`.ipynb`）を開きます。
2. ノートブックの冒頭のコードセルに `%use dataframe` を追加して、Kotlin DataFrame ライブラリをインポートします。
   > Kotlin DataFrame ライブラリに依存する他のコードセルを実行する前に、必ず `%use dataframe` の行を含むコードセルを実行してください。
   >
   {style="note"}

3. データの取得には、Kotlin DataFrame ライブラリの [`.read()`](https://kotlin.github.io/dataframe/read.html) 関数を使用します。例えば、CSV ファイルを読み込むには、`DataFrame.read("example.csv")` を使用します。

`.read()` 関数は、ファイルの拡張子と内容に基づいて入力形式を自動的に検出します。また、`delimiter = ';'` で区切り文字を指定するなど、関数をカスタマイズするための引数を追加することもできます。

> 追加のファイル形式やさまざまな読み込み関数の包括的な概要については、[Kotlin DataFrame ライブラリのドキュメント](https://kotlin.github.io/dataframe/read.html)を参照してください。
> 
{style="tip"}

## データの表示

[データをノートブックに読み込んだら](#ファイルからデータを取得する)、それを変数に保存し、コードセルで次を実行することで簡単にアクセスできます：

```kotlin
val dfJson = DataFrame.read("jsonFile.json")
dfJson
```

このコードは、CSV、JSON、XLS、XLSX、Apache Arrow など、選択したファイルからのデータを表示します。

![データの表示](display-data.png){width=700}

データの構造やスキーマを把握するには、DataFrame 変数に `.schema()` 関数を適用します。例えば、`dfJson.schema()` は JSON データセット内の各列の型をリスト表示します。

![スキーマの例](schema-data-analysis.png){width=700}

また、Kotlin Notebook のオートコンプリート機能を使用して、DataFrame のプロパティに素早くアクセスし、操作することもできます。データを読み込んだ後、DataFrame 変数の後にドットを入力するだけで、利用可能な列とその型の一覧が表示されます。

![利用可能なプロパティ](auto-completion-data-analysis.png){width=700}

## データの精製

データセットを精製するために Kotlin DataFrame ライブラリで利用できるさまざまな操作のうち、主な例として[グルーピング](https://kotlin.github.io/dataframe/group.html)、[フィルタリング](https://kotlin.github.io/dataframe/filter.html)、[更新](https://kotlin.github.io/dataframe/update.html)、[新しい列の追加](https://kotlin.github.io/dataframe/add.html)などがあります。これらの関数はデータ分析に不可欠であり、データを効果的に整理、クリーンアップ、変換することができます。

映画のタイトルと同じセルに対応する公開年が含まれているデータの例を見てみましょう。目標は、分析しやすくするためにこのデータセットを精製することです：

1. `.read()` 関数を使用して、ノートブックにデータを読み込みます。この例では、`movies.csv` という名前の CSV ファイルからデータを読み込み、`movies` という名前の DataFrame を作成します：

   ```kotlin
   val movies = DataFrame.read("movies.csv")
   ```

2. 正規表現を使用して映画のタイトルから公開年を抽出し、新しい列として追加します：

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

3. 各タイトルから公開年を削除して、映画のタイトルを修正します。これにより、一貫性を保つためにタイトルがクリーンアップされます：

   ```kotlin
   val moviesTitle = moviesWithYear
       .update("title") {
           "\\s*\\(\\d{4}\\)\\s*$".toRegex().replace(title, "")
       }
   ```

4. `filter` メソッドを使用して、特定のデータに焦点を当てます。このケースでは、1996 年以降に公開された映画に焦点を当てるよう、データセットをフィルタリングします：

   ```kotlin
   val moviesNew = moviesWithYear.filter { year >= 1996 }
   moviesNew
   ```

比較のために、精製前のデータセットを以下に示します：

![元のデータセット](original-dataset.png){width=700}

精製後のデータセット：

![データ精製の結果](refined-data.png){width=700}

これは、Kotlin でデータを効果的に精製および分析するために、`add`、`update`、`filter` といった Kotlin DataFrame ライブラリのメソッドをどのように使用できるかを示す実用的なデモンストレーションです。

> 追加のユースケースや詳細な例については、[Kotlin Dataframe の例](https://github.com/Kotlin/dataframe/tree/master/examples)を参照してください。
> 
{style="tip"}

## DataFrame の保存

[Kotlin Notebook でデータを精製した](#データの精製)後、Kotlin DataFrame ライブラリを使用して、処理済みのデータを簡単にエクスポートできます。この目的のためにさまざまな [`.write()`](https://kotlin.github.io/dataframe/write.html) 関数を利用でき、CSV、JSON、XLS、XLSX、Apache Arrow、さらには HTML テーブルなど、複数の形式での保存をサポートしています。
これは、知見を共有したり、レポートを作成したり、さらなる分析のためにデータを利用可能にしたりするのに特に役立ちます。

DataFrame をフィルタリングし、列を削除し、精製したデータを JSON ファイルに保存し、ブラウザで HTML テーブルを開く方法は次のとおりです：

1. Kotlin Notebook で、`.read()` 関数を使用して `movies.csv` という名前のファイルを `moviesDf` という名前の DataFrame に読み込みます：

   ```kotlin
   val moviesDf = DataFrame.read("movies.csv")
   ```

2. `.filter` メソッドを使用して、"Action" ジャンルに属する映画のみが含まれるように DataFrame をフィルタリングします：

   ```kotlin
   val actionMoviesDf = moviesDf.filter { genres.equals("Action") }
   ```

3. `.remove` を使用して、DataFrame から `movieId` 列を削除します：

   ```kotlin
   val refinedMoviesDf = actionMoviesDf.remove { movieId }
   refinedMoviesDf
   ```

4. Kotlin DataFrame ライブラリは、さまざまな形式でデータを保存するための各種書き込み関数を提供しています。この例では、[`.writeJson()`](https://kotlin.github.io/dataframe/write.html#writing-to-json) 関数を使用して、修正した `movies.csv` を JSON ファイルとして保存します：

   ```kotlin
   refinedMoviesDf.writeJson("movies.json")
   ```

5. `.toStandaloneHTML()` 関数を使用して DataFrame をスタンドアロンの HTML テーブルに変換し、デフォルトの Web ブラウザで開きます：

   ```kotlin
   refinedMoviesDf.toStandaloneHTML(DisplayConfiguration(rowsLimit = null)).openInBrowser()
   ```

## 次のステップ

* [Kandy ライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータの可視化を探索する
* [Kandy を使用した Kotlin Notebook でのデータの可視化](data-analysis-visualization.md)でデータの可視化に関する追加情報を見つける
* Kotlin でのデータサイエンスと分析に利用可能なツールとリソースの広範な概要については、[データ分析用の Kotlin および Java ライブラリ](data-analysis-libraries.md)を参照してください。