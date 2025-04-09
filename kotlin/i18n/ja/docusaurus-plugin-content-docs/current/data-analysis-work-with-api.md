---
title: WebソースおよびAPIからデータを取得する
---
[Kotlin Notebook](kotlin-notebook-overview) は、さまざまな Web ソースや API からのデータへのアクセスと操作のための強力なプラットフォームを提供します。
明確にするためにすべてのステップを視覚化できる反復的な環境を提供することで、データ抽出と分析のタスクを簡素化します。これにより、使い慣れていない API を探索する場合に特に役立ちます。

[Kotlin DataFrame ライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html) と組み合わせて使用​​すると、Kotlin Notebook は API から JSON データに接続してフェッチできるだけでなく、包括的な分析と視覚化のためにこのデータを再形成するのにも役立ちます。

:::tip
Kotlin Notebook の例については、[GitHub の DataFrame の例](https://github.com/Kotlin/dataframe/blob/master/examples/notebooks/youtube/Youtube.ipynb) を参照してください。

:::

## 開始する前に

1. 最新バージョンの [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/?section=mac) をダウンロードしてインストールします。
2. IntelliJ IDEA に [Kotlin Notebook plugin](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) をインストールします。

   > または、IntelliJ IDEA 内の **Settings** | **Plugins** | **Marketplace** から Kotlin Notebook plugin にアクセスします。
   >
   

3. **File** | **New** | **Kotlin Notebook** を選択して、新しい Kotlin Notebook を作成します。
4. Kotlin Notebook で、次のコマンドを実行して Kotlin DataFrame ライブラリをインポートします。

   ```kotlin
   %use dataframe
   ```

## API からデータをフェッチする

Kotlin DataFrame ライブラリを備えた Kotlin Notebook を使用して API からデータをフェッチするには、[`.read()`](https://kotlin.github.io/dataframe/read.html) 関数を使用します。これは、CSV や JSON などの [ファイルからデータを取得する](data-analysis-work-with-data-sources#retrieve-data-from-a-file) のと同様です。ただし、Web ベースのソースを扱う場合は、生の API データを構造化された形式に変換するために、追加のフォーマットが必要になる場合があります。

[YouTube Data API](https://console.cloud.google.com/apis/library/youtube.googleapis.com) からデータをフェッチする例を見てみましょう。

1. Kotlin Notebook ファイル (`.ipynb`) を開きます。

2. データ操作タスクに不可欠な Kotlin DataFrame ライブラリをインポートします。
これは、コードセルで次のコマンドを実行することで行われます。

   ```kotlin
   %use dataframe
   ```

3. YouTube Data API へのリクエストを認証するために必要な API キーを新しいコードセルに安全に追加します。
API キーは、[認証情報タブ](https://console.cloud.google.com/apis/credentials) から取得できます。

   ```kotlin
   val apiKey = "YOUR-API_KEY"
   ```

4. パスを文字列として受け取り、DataFrame の `.read()` 関数を使用して YouTube Data API からデータをフェッチするロード関数を作成します。

   ```kotlin
   fun load(path: String): AnyRow = DataRow.read("https://www.googleapis.com/youtube/v3/$path&key=$apiKey")
   ```

5. フェッチされたデータを行に編成し、`nextPageToken` を使用して YouTube API のページネーションを処理します。
これにより、複数のページにわたってデータを収集できます。

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

6. 前述の `load()` 関数を使用してデータをフェッチし、新しいコードセルに DataFrame を作成します。
この例では、最大 5 ページまで、ページあたり最大 50 件の結果で、Kotlin に関連するデータ (またはこの場合は動画) をフェッチします。
結果は `df` 変数に格納されます。

   ```kotlin
   val df = load("search?q=kotlin&maxResults=50&part=snippet", 5)
   df
   ```

7. 最後に、DataFrame からアイテムを抽出して連結します。

   ```kotlin
   val items = df.items.concat()
   items
   ```

## データをクリーンアップして絞り込む

データをクリーンアップして絞り込むことは、分析のためにデータセットを準備する上で重要なステップです。[Kotlin DataFrame ライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html) は、これらのタスクのための強力な機能を提供します。[`move`](https://kotlin.github.io/dataframe/move.html)、[`concat`](https://kotlin.github.io/dataframe/concatdf.html)、[`select`](https://kotlin.github.io/dataframe/select.html)、[`parse`](https://kotlin.github.io/dataframe/parse.html)、[`join`](https://kotlin.github.io/dataframe/join.html) などのメソッドは、データを整理および変換するのに役立ちます。

データが [YouTube のデータ API を使用してすでにフェッチされている](#fetch-data-from-an-api) 例を見てみましょう。
目標は、詳細な分析の準備のために、データセットをクリーンアップして再構築することです。

1. データの再編成とクリーンアップから始めることができます。これには、明確にするために、特定の列を新しいヘッダーの下に移動し、不要な列を削除することが含まれます。

   ```kotlin
   val videos = items.dropNulls { id.videoId }
       .select { id.videoId named "id" and snippet }
       .distinct()
   videos
   ```

2. クリーンアップされたデータから ID をチャンク化し、対応する動画の統計情報をロードします。これには、データをより小さなバッチに分割し、追加の詳細をフェッチすることが含まれます。

   ```kotlin
   val statPages = clean.id.chunked(50).map {
       val ids = it.joinToString("%2C")
       load("videos?part=statistics&id=$ids")
   }
   statPages
   ```

3. フェッチされた統計情報を連結し、関連する列を選択します。

   ```kotlin
   val stats = statPages.items.concat().select { id and statistics.all() }.parse()
   stats
   ```

4. 既存のクリーンアップされたデータを、新しくフェッチされた統計情報と結合します。これにより、2 つのデータセットが包括的な DataFrame にマージされます。

   ```kotlin
   val joined = clean.join(stats)
   joined
   ```

この例では、Kotlin DataFrame のさまざまな関数を使用してデータセットをクリーンアップ、再編成、および拡張する方法を示します。
各ステップは、データを絞り込み、[詳細な分析](#analyze-data-in-kotlin-notebook) により適したものにするように設計されています。

## Kotlin Notebook でデータを分析する

[Kotlin DataFrame ライブラリ](https://kotlin.github.io/dataframe/gettingstarted.html) の関数を使用して、データを [フェッチ](#fetch-data-from-an-api) し、[クリーンアップおよび絞り込み](#clean-and-refine-data) が完了したら、次のステップは、この準備されたデータセットを分析して、意味のある洞察を抽出することです。

データを分類するための [`groupBy`](https://kotlin.github.io/dataframe/groupby.html) などのメソッド、[要約統計](https://kotlin.github.io/dataframe/summarystatistics.html) 用の [`sum`](https://kotlin.github.io/dataframe/sum.html) および [`maxBy`](https://kotlin.github.io/dataframe/maxby.html)、データを並べ替えるための [`sortBy`](https://kotlin.github.io/dataframe/sortby.html) が特に役立ちます。
これらのツールを使用すると、複雑なデータ分析タスクを効率的に実行できます。

`groupBy` を使用して動画をチャンネル別に分類し、`sum` を使用してカテゴリごとの合計再生回数を計算し、`maxBy` を使用して各グループの最新または最も視聴された動画を見つける例を見てみましょう。

1. 参照を設定して、特定の列へのアクセスを簡素化します。

   ```kotlin
   val view by column<Int>()
   ```

2. `groupBy` メソッドを使用して、`channel` 列でデータをグループ化し、並べ替えます。

   ```kotlin
   val channels = joined.groupBy { channel }.sortByCount()
   ```

結果のテーブルでは、データをインタラクティブに調べることができます。チャンネルに対応する行の `group` フィールドをクリックすると、そのチャンネルの動画に関する詳細が表示されます。

<img src="/img/results-of-expanding-group-data-analysis.png" alt="行を展開して詳細を表示する" width="700" style={{verticalAlign: 'middle'}}/>

左下のテーブル アイコンをクリックして、グループ化されたデータセットに戻ることができます。

<img src="/img/return-to-grouped-dataset.png" alt="左下のテーブル アイコンをクリックして戻る" width="700" style={{verticalAlign: 'middle'}}/>

3. `aggregate`、`sum`、`maxBy`、および `flatten` を使用して、各チャンネルの合計再生回数と、最新または最も視聴された動画の詳細を要約する DataFrame を作成します。

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

<img src="/img/kotlin-analysis.png" alt="分析結果" width="700" style={{verticalAlign: 'middle'}}/>

より高度な手法については、[Kotlin DataFrame ドキュメント](https://kotlin.github.io/dataframe/gettingstarted.html) を参照してください。

## 次のステップ

* [Kandy ライブラリ](https://kotlin.github.io/kandy/examples.html) を使用したデータの視覚化について調べる
* [Kotlin Notebook での Kandy を使用したデータの視覚化](data-analysis-visualization) で、データ視覚化に関する追加情報を見つける
* Kotlin でのデータサイエンスと分析に利用できるツールとリソースの包括的な概要については、[データ分析用の Kotlin および Java ライブラリ](data-analysis-libraries) を参照してください