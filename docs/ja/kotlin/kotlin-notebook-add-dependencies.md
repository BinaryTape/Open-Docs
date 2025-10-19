[//]: # (title: Kotlin Notebookに依存関係を追加する)

<tldr>
   <p>これは**Kotlin Notebookの利用開始**チュートリアルの3番目のパートです。先に進む前に、前の手順を完了していることを確認してください。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="kotlin-notebook-set-up-env.md">環境をセットアップする</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="kotlin-notebook-create.md">Kotlin Notebookを作成する</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>Kotlin Notebookに依存関係を追加する</strong><br/>
  </p>
</tldr>

最初の[Kotlin Notebook](kotlin-notebook-overview.md)を作成しましたね！次に、高度な機能を利用するために必要な、ライブラリへの依存関係を追加する方法を学びましょう。

> Kotlin標準ライブラリはすぐに使用できるため、インポートする必要はありません。
> 
{style="note"}

Mavenリポジトリから任意のライブラリを、任意のコードセルでGradleスタイル構文を使用してその座標を指定することでロードできます。
ただし、Kotlin Notebookには、人気のあるライブラリをロードするための簡略化された方法として、[`%use`ステートメント](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)があります。

```kotlin
// Replace libraryName with the library dependency you want to add
%use libraryName
// Specify a version, if required
%use libraryName(version)
// Add v= to trigger autocomplete
%use libraryName(v=version)
// Example: kotlinx.datetime:0.7.1
%use datetime(v=0.7.1)
```

Kotlin Notebookのオートコンプリート機能を使用して、利用可能なライブラリにすばやくアクセスすることもできます。

![Autocompletion feature in Kotlin Notebook](autocompletion-feature-notebook.png){width=700}

> Kotlin Notebookには、ディープラーニングからHTTPネットワーキングまで、さまざまなタスクを実行するための統合されたライブラリセットがあります。
> [サポートされているライブラリのインポート](https://www.jetbrains.com/help/idea/kotlin-notebook.html#import-libraries)を参照してください。
> 
> Kotlin Notebookにまだ統合されていないライブラリも追加して使用できます。 [新しいライブラリの統合](https://www.jetbrains.com/help/idea/kotlin-notebook.html#integrate-new-libraries)を参照してください。
>
{style="note"}

## Kotlin DataFrameおよびKandyライブラリをKotlin Notebookに追加する

Kotlin Notebookに、2つの人気のあるKotlinライブラリの依存関係を追加しましょう。
*   [Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/home.html)は、Kotlinプロジェクトでデータを操作する機能を提供します。
    これを使用して、[API](data-analysis-work-with-api.md)、[SQLデータベース](data-analysis-connect-to-db.md)、およびCSVやJSONなどの[さまざまなファイル形式](data-analysis-work-with-data-sources.md)からデータを取得できます。
*   [Kandyライブラリ](https://kotlin.github.io/kandy/welcome.html)は、[チャートを作成](data-analysis-visualization.md)するための強力で柔軟なDSLを提供します。

これらのライブラリを追加するには：

1.  **Add Code Cell**をクリックして、新しいコードセルを作成します。
2.  コードセルに次のコードを入力します。

    ```kotlin
    // Ensures that the latest available library versions are used
    %useLatestDescriptors
    
    // Imports the Kotlin DataFrame library
    %use dataframe
    
    // Imports the Kotlin Kandy library
    %use kandy
    ```

3.  コードセルを実行します。

    `%use`ステートメントが実行されると、ライブラリの依存関係がダウンロードされ、デフォルトのインポートがノートブックに追加されます。

    > ライブラリに依存する他のコードセルを実行する前に、`%use libraryName`行のあるコードセルを実行するようにしてください。
    >
    {style="note"}

4.  Kotlin DataFrameライブラリを使用してCSVファイルからデータをインポートするには、新しいコードセルで`.read()`関数を使用します。

    ```kotlin
    // Creates a DataFrame by importing data from the "netflix_titles.csv" file.
    val rawDf = DataFrame.read("netflix_titles.csv")
    
    // Displays the raw DataFrame data
    rawDf
    ```

    > このCSVファイルの例は、[Kotlin DataFrame examples GitHubリポジトリ](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/netflix/netflix_titles.csv)からダウンロードできます。
    > プロジェクトディレクトリに追加してください。
    > 
    {style="tip"}

    ![Using DataFrame to display data](add-dataframe-dependency.png){width=700}

5.  新しいコードセルで、`.plot`メソッドを使用して、DataFrame内のテレビ番組と映画の分布を視覚的に表現します。

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

結果のチャート：

![Visualization using the Kandy library](kandy-library.png){width=700}

Kotlin Notebookでこれらのライブラリを追加し、活用できたことをお祝いします！
これは、Kotlin Notebookとその[サポートされているライブラリ](data-analysis-libraries.md)で達成できることのほんの一端にすぎません。

## 次のステップ

*   [Kotlin Notebookを共有](kotlin-notebook-share.md)する方法を学ぶ
*   [Kotlin Notebookへの依存関係の追加](https://www.jetbrains.com/help/idea/kotlin-notebook.html#add-dependencies)に関する詳細を見る
*   Kotlin DataFrameライブラリを使用したより広範なガイドについては、「[ファイルからデータを取得する](data-analysis-work-with-data-sources.md)」を参照する
*   Kotlinにおけるデータサイエンスと分析に利用可能なツールとリソースの広範な概要については、「[データ分析のためのKotlinおよびJavaライブラリ](data-analysis-libraries.md)」を参照する