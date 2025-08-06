[//]: # (title: ウェブソースとAPIからデータを取得する)

[Kotlin Notebook](kotlin-notebook-overview.md)は、様々なウェブソースやAPIからデータにアクセスし、操作するための強力なプラットフォームを提供します。各ステップを可視化して明確にするための反復的な環境を提供することで、データ抽出と分析のタスクを簡素化します。これにより、慣れていないAPIを探索する際に特に役立ちます。

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)と組み合わせて使用すると、Kotlin NotebookはAPIへの接続やJSONデータの取得を可能にするだけでなく、包括的な分析と視覚化のためにこのデータを整形するのにも役立ちます。

> Kotlin Notebookの例については、[GitHubのDataFrameの例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)を参照してください。
>
{style="tip"}

## 始める前に

Kotlin Notebookは[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しており、このプラグインはIntelliJ IDEAにデフォルトでバンドルされ、有効になっています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境のセットアップ](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成するには：

1.  **File** | **New** | **Kotlin Notebook** を選択します。
2.  Kotlin Notebookで、以下のコマンドを実行してKotlin DataFrameライブラリをインポートします。

    ```kotlin
    %use dataframe
    ```

## APIからデータを取得する

Kotlin NotebookとKotlin DataFrameライブラリを使用してAPIからデータを取得するには、[`.read()`](https://kotlin.github.io/dataframe/read.html)関数を使用します。これは、CSVやJSONなどの[ファイルからデータを取得する](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)のと似ています。ただし、ウェブベースのソースを扱う場合、生APIデータを構造化された形式に変換するために、追加のフォーマットが必要になる場合があります。

[YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com)からデータを取得する例を見てみましょう。

1.  Kotlin Notebookファイル（`.ipynb`）を開きます。

2.  データ操作タスクに不可欠なKotlin DataFrameライブラリをインポートします。これはコードセルで以下のコマンドを実行して行います。

    ```kotlin
    %use dataframe
    ```

3.  YouTube Data APIへのリクエストを認証するために必要なAPIキーを新しいコードセルに安全に追加します。APIキーは[認証情報タブ](https://console.cloud.google.com/apis/credentials)から取得できます。

    ```kotlin
    val apiKey = "YOUR-API_KEY"
    ```

4.  パスを文字列として受け取り、DataFrameの`.read()`関数を使用してYouTube Data APIからデータを取得するロード関数を作成します。

    ```kotlin
    fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
    ```

5.  取得したデータを各行に整理し、YouTube APIのページネーションを`nextPageToken`で処理します。これにより、複数のページにわたってデータを収集できます。

    ```kotlin
    fun load(path: String, maxPages: Int): AnyFrame {
    
        // Initializes a mutable list to store rows of data.
        val rows = mutableListOf<AnyRow>()
    
        // Sets the initial page path for data loading.
        var pagePath = path
        do {
    
            // Loads data from the current page path.
            val row = load(pagePath)
            // Adds the loaded data as a row to the list.
            rows.add(row)
           
            // Retrieves the token for the next page, if available.
            val next = row.getValueOrNull<String>("nextPageToken")
            // Updates the page path for the next iteration, including the new token.
            pagePath = path + "&pageToken=" + next
    
            // Continues loading pages until there's no next page.
        } while (next != null && rows.size < maxPages) 
        
        // Concatenates and returns all loaded rows as a DataFrame.
        return rows.concat() 
    }
    ```

6.  以前に定義した`load()`関数を使用してデータを取得し、新しいコードセルにDataFrameを作成します。この例では、Kotlinに関連するデータ、この場合は動画を、1ページあたり最大50件、最大5ページまで取得します。結果は`df`変数に格納されます。

    ```kotlin
    val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
    df
    ```

7.  最後に、DataFrameからアイテムを抽出し、連結します。

    ```kotlin
    val items = df.items.concat()
    items
    ```

## データのクリーンアップと整形

データのクリーンアップと整形は、分析のためにデータセットを準備する上で非常に重要なステップです。[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)は、これらのタスクに強力な機能を提供します。[`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)、[`join`](https://kotlin.github.io/dataframe/join.html)などのメソッドは、データの整理と変換に役立ちます。

データがすでに[YouTubeのData APIを使用して取得されている](#fetch-data-from-an-api)例を見てみましょう。目標は、詳細な分析のためにデータセットをクリーンアップし、再構築することです。

1.  データを再編成し、クリーンアップすることから始められます。これには、特定の列を新しいヘッダーの下に移動したり、明確にするために不要な列を削除したりすることが含まれます。

    ```kotlin
    val videos = items.dropNulls { id.videoId }
        .select { id.videoId named "id" and snippet }
        .distinct()
    videos
    ```

2.  クリーンアップされたデータからチャンクIDを抽出し、対応する動画の統計情報をロードします。これには、データをより小さなバッチに分割し、追加の詳細情報を取得することが含まれます。

    ```kotlin
    val statPages = clean.id.chunked(50).map {
        val ids = it.joinToString("%2C")
        load("videos?part=statistics&id=$ids")
    }
    statPages
    ```

3.  取得した統計情報を連結し、関連する列を選択します。

    ```kotlin
    val stats = statPages.items.concat().select { id and statistics.all() }.parse()
    stats
    ```

4.  既存のクリーンアップされたデータを新しく取得した統計情報と結合します。これにより、2つのデータセットが包括的なDataFrameにマージされます。

    ```kotlin
    val joined = clean.join(stats)
    joined
    ```

この例は、Kotlin DataFrameの様々な関数を使用してデータセットをクリーンアップ、再編成、および強化する方法を示しています。各ステップは、データを洗練し、[詳細な分析](#analyze-data-in-kotlin-notebook)により適したものにするように設計されています。

## Kotlin Notebookでデータを分析する

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)の関数を使用して、データを正常に[取得](#fetch-data-from-an-api)し、[クリーンアップおよび整形](#clean-and-refine-data)した後、次のステップは、準備されたデータセットを分析して意味のある洞察を抽出することです。

データの分類には[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、[要約統計量](https://kotlin.github.io/dataframe/summarystatistics.html)の計算には[`sum`](https://kotlin.github.io/dataframe/sum.html)や[`maxBy`](https://kotlin.github.io/dataframe/maxby.html)、データの順序付けには[`sortBy`](https://kotlin.github.io/dataframe/sortby.html)といったメソッドが特に役立ちます。これらのツールを使用すると、複雑なデータ分析タスクを効率的に実行できます。

`groupBy`を使用して動画をチャンネル別に分類し、`sum`を使用してカテゴリごとの総視聴回数を計算し、`maxBy`を使用して各グループで最新または最も視聴された動画を見つける例を見てみましょう。

1.  参照を設定することで、特定の列へのアクセスを簡素化します。

    ```kotlin
    val view by column<Int>()
    ```

2.  `groupBy`メソッドを使用して、`channel`列でデータをグループ化し、ソートします。

    ```kotlin
    val channels = joined.groupBy { channel }.sortByCount()
    ```

結果のテーブルでは、データをインタラクティブに探索できます。チャンネルに対応する行の`group`フィールドをクリックすると、その行が展開され、そのチャンネルの動画に関する詳細が表示されます。

![行を展開して詳細を表示](results-of-expanding-group-data-analysis.png){width=700}

左下のテーブルアイコンをクリックすると、グループ化されたデータセットに戻ることができます。

![左下のテーブルアイコンをクリックして戻る](return-to-grouped-dataset.png){width=700}

3.  `aggregate`、`sum`、`maxBy`、`flatten`を使用して、各チャンネルの総視聴回数とその最新または最も視聴された動画の詳細をまとめたDataFrameを作成します。

    ```kotlin
    val aggregated = channels.aggregate {
        viewCount.sum() into view
    
        val last = maxBy { publishedAt }
        last.title into "last title"
        last.publishedAt into "time"
        last.viewCount into "viewCount"
        // Sorts the DataFrame in descending order by view count and transform it into a flat structure.
    }.sortByDesc(view).flatten()
    aggregated
    ```

分析結果：

![分析結果](kotlin-analysis.png){width=700}

より高度なテクニックについては、[Kotlin DataFrameのドキュメント](https://kotlin.github.io/dataframe/gettingstarted.html)を参照してください。

## 次に行うこと

*   [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータ視覚化を探索する
*   [Kandyを使用したKotlin Notebookでのデータ視覚化](data-analysis-visualization.md)でデータ視覚化に関する追加情報を見つける
*   Kotlinでデータサイエンスと分析に利用できるツールとリソースの広範な概要については、[データ分析のためのKotlinおよびJavaライブラリ](data-analysis-libraries.md)を参照してください