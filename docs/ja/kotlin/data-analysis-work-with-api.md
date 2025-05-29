[//]: # (title: WebソースおよびAPIからのデータ取得)

[Kotlin Notebook](kotlin-notebook-overview.md)は、さまざまなWebソースやAPIからデータにアクセスし、操作するための強力なプラットフォームを提供します。これにより、すべてのステップを明確に可視化できる反復的な環境を提供することで、データ抽出と分析タスクを簡素化します。このため、慣れていないAPIを探索する際に特に役立ちます。

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)と組み合わせて使用すると、Kotlin NotebookはAPIからJSONデータに接続して取得できるだけでなく、包括的な分析と可視化のためにこのデータを整形するのにも役立ちます。

> Kotlin Notebookの例については、[GitHub上のDataFrameの例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb)を参照してください。
> 
{style="tip"}

## はじめる前に

Kotlin Notebookは、[Kotlin Notebookプラグイン](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)に依存しています。このプラグインは、IntelliJ IDEAにデフォルトでバンドルされ、有効化されています。

Kotlin Notebookの機能が利用できない場合は、プラグインが有効になっていることを確認してください。詳細については、[環境のセットアップ](kotlin-notebook-set-up-env.md)を参照してください。

新しいKotlin Notebookを作成するには:

1. **File** | **New** | **Kotlin Notebook**を選択します。
2. Kotlin Notebookで、次のコマンドを実行してKotlin DataFrameライブラリをインポートします:

   ```kotlin
   %use dataframe
   ```

## APIからのデータ取得

Kotlin NotebookとKotlin DataFrameライブラリを使用してAPIからデータを取得するには、[`.read()`](https://kotlin.github.io/dataframe/read.html)関数を使用します。これは、CSVやJSONなどの[ファイルからのデータ取得](data-analysis-work-with-data-sources.md#retrieve-data-from-a-file)と同様です。
ただし、Webベースのソースを扱う場合、生のAPIデータを構造化された形式に変換するために、追加のフォーマットが必要になる場合があります。

[YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com)からデータを取得する例を見てみましょう:

1. Kotlin Notebookファイル (`.ipynb`) を開きます。

2. データ操作タスクに不可欠なKotlin DataFrameライブラリをインポートします。これは、コードセルで次のコマンドを実行することで行われます:

   ```kotlin
   %use dataframe
   ```

3. YouTube Data APIへのリクエストを認証するために必要なAPIキーを、新しいコードセルに安全に追加します。APIキーは[認証情報タブ](https://console.cloud.google.com/apis/credentials)から取得できます:

   ```kotlin
   val apiKey = "YOUR-API_KEY"
   ```

4. パスを文字列として受け取り、DataFrameの`.read()`関数を使用してYouTube Data APIからデータを取得するロード関数を作成します:

   ```kotlin
   fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
   ```

5. 取得したデータを列として整理し、`nextPageToken`を介してYouTube APIのページネーションを処理します。これにより、複数のページにわたるデータを確実に収集できます:

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

6. 以前に定義した`load()`関数を使用してデータを取得し、新しいコードセルでDataFrameを作成します。この例では、Kotlin関連の動画データを、1ページあたり最大50件、最大5ページまで取得します。結果は`df`変数に保存されます:

   ```kotlin
   val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
   df
   ```

7. 最後に、DataFrameからアイテムを抽出して結合します:

   ```kotlin
   val items = df.items.concat()
   items
   ```

## データのクリーンアップと整形

データのクリーンアップと整形は、分析のためにデータセットを準備する上で非常に重要なステップです。[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)は、これらのタスクに強力な機能を提供します。[`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)、[`join`](https://kotlin.github.io/dataframe/join.html)などのメソッドは、データの整理と変換に不可欠です。

データがすでに[YouTubeのData APIを使用して取得されている](#fetch-data-from-an-api)例を見てみましょう。目標は、詳細な分析に備えるためにデータセットをクリーンアップし、再構築することです:

1. データの再編成とクリーンアップから始めることができます。これには、特定の列を新しいヘッダーの下に移動させたり、明確にするために不要な列を削除したりすることが含まれます:

   ```kotlin
   val videos = items.dropNulls { id.videoId }
       .select { id.videoId named "id" and snippet }
       .distinct()
   videos
   ```

2. クリーンアップされたデータからIDをチャンク化し、対応する動画統計をロードします。これには、データをより小さなバッチに分割し、追加の詳細を取得することが含まれます:

   ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
   ```

3. 取得した統計情報を結合し、関連する列を選択します:

   ```kotlin
   val stats = statPages.items.concat().select { id and statistics.all() }.parse()
   stats
   ```

4. 既存のクリーンアップされたデータと、新しく取得した統計情報を結合します。これにより、2つのデータセットが包括的なDataFrameに結合されます:

   ```kotlin
   val joined = clean.join(stats)
   joined
   ```

この例は、Kotlin DataFrameのさまざまな関数を使用して、データセットをクリーンアップし、再編成し、強化する方法を示しています。各ステップはデータを整形し、[詳細な分析](#analyze-data-in-kotlin-notebook)により適したものにするように設計されています。

## Kotlin Notebookでのデータ分析

[Kotlin DataFrameライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html)の関数を使用してデータを正常に[取得](#fetch-data-from-an-api)し、[クリーンアップおよび整形](#clean-and-refine-data)した後、次のステップは、この準備されたデータセットを分析して有意義な洞察を抽出することです。

データのカテゴリ分けには[`groupBy`](https://kotlin.github.io/dataframe/groupby.html)、[要約統計量](https://kotlin.github.io/dataframe/summarystatistics.html)には[`sum`](https://kotlin.github.io/dataframe/sum.html)と[`maxBy`](https://kotlin.github.io/dataframe/maxby.html)、データの順序付けには[`sortBy`](https://kotlin.github.io/dataframe/sortby.html)といったメソッドが特に役立ちます。これらのツールを使用すると、複雑なデータ分析タスクを効率的に実行できます。

では、`groupBy`を使用して動画をチャンネルごとに分類し、`sum`を使用してカテゴリごとの総視聴回数を計算し、`maxBy`を使用して各グループの最新または最も視聴された動画を見つける例を見てみましょう:

1. 参照を設定することで、特定の列へのアクセスを簡素化します:

   ```kotlin
   val view by column<Int>()
   ```

2. `groupBy`メソッドを使用して、`channel`列でデータをグループ化し、ソートします。

   ```kotlin
   val channels = joined.groupBy { channel }.sortByCount()
   ```

結果のテーブルでは、データをインタラクティブに探索できます。チャンネルに対応する行の`group`フィールドをクリックすると、その行が展開され、そのチャンネルの動画に関する詳細が表示されます。

![行を展開して詳細を表示する](results-of-expanding-group-data-analysis.png){width=700}

左下にあるテーブルアイコンをクリックすると、グループ化されたデータセットに戻ることができます。

![左下のテーブルアイコンをクリックして戻る](return-to-grouped-dataset.png){width=700}

3. `aggregate`、`sum`、`maxBy`、`flatten`を使用して、各チャンネルの総視聴回数とその最新または最も視聴された動画の詳細を要約するDataFrameを作成します:

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

分析結果:

![分析結果](kotlin-analysis.png){width=700}

より高度なテクニックについては、[Kotlin DataFrameドキュメント](https://kotlin.github.io/dataframe/gettingstarted.html)を参照してください。

## 次にすること

* [Kandyライブラリ](https://kotlin.github.io/kandy/examples.html)を使用したデータ可視化を探索する
* [Kandyを使用したKotlin Notebookでのデータ可視化](data-analysis-visualization.md)でデータ可視化に関する追加情報を探す
* Kotlinでのデータサイエンスと分析に利用できるツールとリソースの広範な概要については、[KotlinとJavaのデータ分析ライブラリ](data-analysis-libraries.md)を参照してください