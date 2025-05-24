---
title: "Kotlin Notebook に依存関係を追加する"
---
:::info
<p>
   これは、<strong>Kotlin Notebook入門</strong>チュートリアルの第3部です。続行する前に、必ず前の手順を完了してください。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env">環境をセットアップする</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create">Kotlin Notebookを作成する</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Kotlin Notebookに依存関係を追加する</strong><br/>
</p>

:::

最初の[Kotlin Notebook](kotlin-notebook-overview)を作成しましたね！次に、ライブラリに依存関係を追加する方法を学びましょう。これは、高度な機能をアンロックするために必要です。

:::note
Kotlin標準ライブラリはすぐに使用できるため、インポートする必要はありません。

:::

Gradleスタイルの構文を使用して、座標を指定することにより、Mavenリポジトリから任意のライブラリをロードできます。
ただし、Kotlin Notebookには、[`%use` statement](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)の形式で、一般的なライブラリをロードする簡単な方法があります。

```kotlin
// Replace libraryName with the library dependency you want to add
%use libraryName
```

Kotlin Notebookのオートコンプリート機能を使用して、利用可能なライブラリにすばやくアクセスすることもできます。

<img src="/img/autocompletion-feature-notebook.png" alt="Autocompletion feature in Kotlin Notebook" width="700" style={{verticalAlign: 'middle'}}/>

## Kotlin DataFrameおよびKandyライブラリをKotlin Notebookに追加する

2つの一般的なKotlinライブラリの依存関係をKotlin Notebookに追加してみましょう。
* [Kotlin DataFrame library](https://kotlin.github.io/dataframe/gettingstarted.html)を使用すると、Kotlinプロジェクトでデータを操作できます。
これを使用して、[API](data-analysis-work-with-api)、[SQL databases](data-analysis-connect-to-db)、およびCSVやJSONなどの[various file formats](data-analysis-work-with-data-sources)からデータを取得できます。
* [Kandy library](https://kotlin.github.io/kandy/welcome.html)は、[creating charts](data-analysis-visualization)のための強力で柔軟なDSLを提供します。

これらのライブラリを追加するには:

1. **Add Code Cell**をクリックして、新しいコードセルを作成します。
2. コードセルに次のコードを入力します。

    ```kotlin
    // Ensures that the latest available library versions are used
    %useLatestDescriptors
    
    // Imports the Kotlin DataFrame library
    %use dataframe
    
    // Imports the Kotlin Kandy library
    %use kandy
    ```

3. コードセルを実行します。

    `%use`ステートメントが実行されると、ライブラリの依存関係がダウンロードされ、デフォルトのインポートがノートブックに追加されます。

    > `%use libraryName`行を含むコードセルを、そのライブラリに依存する他のコードセルを実行する前に実行してください。
    >
    

4. Kotlin DataFrameライブラリを使用してCSVファイルからデータをインポートするには、新しいコードセルで`.read()`関数を使用します。

    ```kotlin
    // Creates a DataFrame by importing data from the "netflix_titles.csv" file.
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // Displays the raw DataFrame data
    rawDf
    ```

    > このCSVの例は、[Kotlin DataFrame examples GitHub repository](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv)からダウンロードできます。
    > プロジェクトディレクトリに追加してください。
    > 
    

    <img src="/img/add-dataframe-dependency.png" alt="Using DataFrame to display data" width="700" style={{verticalAlign: 'middle'}}/>

5. 新しいコードセルで、`.plot`メソッドを使用して、DataFrame内のTV番組と映画の分布を視覚的に表現します。

    ```kotlin
    rawDf
        // Counts the occurrences of each unique value in the column named "type"
        .valueCounts(sort = false) { type }
        // Visualizes data in a bar chart specifying the colors
        .plot {
            bars {
                x(type)
                y("count")
                fillColor(type) {
                    scale = categorical(range = listOf(Color.hex("#00BCD4"), Color.hex("#009688")))
                }
            }
    
            // Configures the layout of the chart and sets the title
            layout {
                title = "Count of TV Shows and Movies"
                size = 900 to 550
            }
        }
    ```

結果のグラフ:

<img src="/img/kandy-library.png" alt="Visualization using the Kandy library" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin Notebookでこれらのライブラリを追加して利用できたことをおめでとうございます!
これは、Kotlin Notebookとその[supported libraries](data-analysis-libraries)で実現できることのほんの一例です。

## 次のステップ

* [share your Kotlin Notebook](kotlin-notebook-share) の方法を学ぶ
* [adding dependencies to your Kotlin Notebook](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies) の詳細を見る
* Kotlin DataFrameライブラリを使用したより広範なガイドについては、[Retrieve data from files](data-analysis-work-with-data-sources)を参照してください。
* Kotlinでのデータサイエンスと分析に利用できるツールとリソースの詳細な概要については、[Kotlin and Java libraries for data analysis](data-analysis-libraries)を参照してください。