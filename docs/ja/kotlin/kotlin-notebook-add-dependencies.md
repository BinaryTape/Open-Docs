[//]: # (title: Kotlin Notebookに依存関係を追加する)

<tldr>
   <p>これは、**Kotlin Notebookを使ってみる**チュートリアルの第3部です。進む前に、前の手順を完了していることを確認してください。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">環境をセットアップする</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">Kotlin Notebookを作成する</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> **Kotlin Notebookに依存関係を追加する**<br/>
  </p>
</tldr>

最初の[Kotlin Notebook](kotlin-notebook-overview.md)をすでに作成しましたね！次に、高度な機能をアンロックするために必要な、ライブラリへの依存関係の追加方法を学びましょう。

> Kotlin標準ライブラリはすぐに使えるため、インポートする必要はありません。
> 
{style="note"}

任意のコードセルでGradle形式の構文を使用して座標を指定することで、Mavenリポジトリから任意のライブラリをロードできます。
ただし、Kotlin Notebookには、人気のあるライブラリをロードするための簡略化された方法として、[`%use`ステートメント](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)があります。

```kotlin
// Replace libraryName with the library dependency you want to add
%use libraryName
```

Kotlin Notebookのオートコンプリート機能を使用して、利用可能なライブラリにすばやくアクセスすることもできます。

![Kotlin Notebookのオートコンプリート機能](autocompletion-feature-notebook.png){width=700}

## Kotlin DataFrameとKandyライブラリをKotlin Notebookに追加する

Kotlin Notebookに2つの人気のあるKotlinライブラリの依存関係を追加してみましょう。
* [Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)は、Kotlinプロジェクトでデータを操作する機能を提供します。
[API](data-analysis-work-with-api.md)、[SQLデータベース](data-analysis-connect-to-db.md)、およびCSVやJSONなどの[さまざまなファイル形式](data-analysis-work-with-data-sources.md)からデータを取得するために使用できます。
* [Kandyライブラリ](https://kotlin.github.io/kandy/welcome.html)は、[グラフの作成](data-analysis-visualization.md)のための強力で柔軟なDSLを提供します。

これらのライブラリを追加するには：

1. **Add Code Cell**をクリックして、新しいコードセルを作成します。
2. コードセルに以下のコードを入力します。

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

    > ライブラリに依存する他のコードセルを実行する前に、`%use libraryName`行を含むコードセルを実行していることを確認してください。
    >
    {style="note"}

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
    {style="tip"}

    ![DataFrameを使用してデータを表示する](add-dataframe-dependency.png){width=700}

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

結果のグラフ：

![Kandyライブラリを使用した可視化](kandy-library.png){width=700}

Kotlin Notebookでこれらのライブラリを追加し、活用できたことをお祝いします！
これは、Kotlin Notebookとその[サポートされているライブラリ](data-analysis-libraries.md)で達成できることのほんの一部に過ぎません。

## 次のステップ

* [Kotlin Notebookを共有する](kotlin-notebook-share.md)方法を学ぶ
* [Kotlin Notebookに依存関係を追加する](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)ことについてさらに詳しく見る
* Kotlin DataFrameライブラリを使用したより広範なガイドについては、[ファイルからデータを取得する](data-analysis-work-with-data-sources.md)を参照してください
* Kotlinにおけるデータサイエンスと分析に利用可能なツールとリソースの包括的な概要については、[データ分析のためのKotlinとJavaライブラリ](data-analysis-libraries.md)を参照してください