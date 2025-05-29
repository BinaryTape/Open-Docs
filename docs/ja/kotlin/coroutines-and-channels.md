<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンとチャネル − チュートリアル)

このチュートリアルでは、IntelliJ IDEAでコルーチンを使用して、基盤となるスレッドやコールバックをブロックせずにネットワークリクエストを実行する方法を学習します。

> コルーチンに関する事前の知識は必要ありませんが、Kotlinの基本的な構文に精通していることが前提となります。
>
{style="tip"}

学習内容：

*   ネットワークリクエストを実行するためにサスペンド関数を使用する理由と方法。
*   コルーチンを使用してリクエストを並行して送信する方法。
*   チャネルを使用して異なるコルーチン間で情報を共有する方法。

ネットワークリクエストには[Retrofit](https://square.github.io/retrofit/)ライブラリが必要ですが、このチュートリアルで示すアプローチは、コルーチンをサポートする他のどのライブラリでも同様に機能します。

> すべてのタスクのソリューションは、[プロジェクトのリポジトリ](http://github.com/kotlin-hands-on/intro-coroutines)の`solutions`ブランチで見つけることができます。
>
{style="tip"}

## はじめる前に

1.  最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)をダウンロードしてインストールします。
2.  Welcome画面で**Get from VCS**を選択するか、**File | New | Project from Version Control**を選択して、[プロジェクトテンプレート](http://github.com/kotlin-hands-on/intro-coroutines)をクローンします。

    コマンドラインからもクローンできます。

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### GitHub開発者トークンの生成

プロジェクトではGitHub APIを使用します。アクセスするには、GitHubアカウント名とパスワードまたはトークンを提供します。二段階認証（Two-factor authentication）が有効になっている場合は、トークンだけで十分です。

[あなたのアカウント](https://github.com/settings/tokens/new)でGitHub APIを使用するための新しいGitHubトークンを生成します。

1.  トークン名を指定します（例: `coroutines-tutorial`）。

    ![新しいGitHubトークンを生成](generating-token.png){width=700}

2.  スコープは何も選択しないでください。ページ下部の**Generate token**をクリックします。
3.  生成されたトークンをコピーします。

### コードの実行

このプログラムは、指定された組織（デフォルトでは「kotlin」）配下にあるすべてのリポジトリのコントリビューターを読み込みます。後で、貢献数に基づいてユーザーをソートするロジックを追加します。

1.  `src/contributors/main.kt`ファイルを開き、`main()`関数を実行します。以下のウィンドウが表示されます。

    ![最初のウィンドウ](initial-window.png){width=500}

    フォントが小さすぎる場合は、`main()`関数内の`setDefaultFontSize(18f)`の値を変更して調整してください。

2.  対応するフィールドにGitHubのユーザー名とトークン（またはパスワード）を入力します。
3.  _Variant_ドロップダウンメニューで_BLOCKING_オプションが選択されていることを確認します。
4.  _Load contributors_をクリックします。UIはしばらくフリーズした後、コントリビューターのリストが表示されます。
5.  データが読み込まれたことを確認するために、プログラムの出力を開きます。コントリビューターのリストは、各リクエストが成功した後にログに記録されます。

このロジックを実装する方法はいくつかあります。たとえば、[ブロッキングリクエスト](#blocking-requests)や[コールバック](#callbacks)を使用する方法です。これらのソリューションと、[コルーチン](#coroutines)を使用するソリューションを比較し、[チャネル](#channels)が異なるコルーチン間で情報を共有するためにどのように使用できるかを確認します。

## ブロッキングリクエスト

[Retrofit](https://square.github.io/retrofit/)ライブラリを使用してGitHubへのHTTPリクエストを実行します。これにより、指定された組織のリポジトリリストと、各リポジトリのコントリビューターリストをリクエストできます。

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    fun getOrgReposCall(
        @Path("org") org: String
    ): Call<List<Repo>>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    fun getRepoContributorsCall(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): Call<List<User>>
}
```

このAPIは、指定された組織のコントリビューターリストをフェッチするために`loadContributorsBlocking()`関数によって使用されます。

1.  `src/tasks/Request1Blocking.kt`を開いて、その実装を確認します。

    ```kotlin
    fun loadContributorsBlocking(
        service: GitHubService,
        req: RequestData
    ): List<User> {
        val repos = service
            .getOrgReposCall(req.org)   // #1
            .execute()                  // #2
            .also { logRepos(req, it) } // #3
            .body() ?: emptyList()      // #4
    
        return repos.flatMap { repo ->
            service
                .getRepoContributorsCall(req.org, repo.name) // #1
                .execute()                                   // #2
                .also { logUsers(repo, it) }                 // #3
                .bodyList()                                  // #4
        }.aggregate()
    }
    ```

    *   まず、指定された組織のリポジトリリストを取得し、`repos`リストに格納します。次に、各リポジトリについてコントリビューターのリストがリクエストされ、すべてのリストが1つの最終的なコントリビューターリストにマージされます。
    *   `getOrgReposCall()`と`getRepoContributorsCall()`はどちらも`*Call`クラスのインスタンスを返します（`#1`）。この時点では、リクエストは送信されていません。
    *   次に、リクエストを実行するために`*Call.execute()`が呼び出されます（`#2`）。`execute()`は、基盤となるスレッドをブロックする同期呼び出しです。
    *   レスポンスを受け取ると、結果は特定の`logRepos()`および`logUsers()`関数を呼び出すことによってログに記録されます（`#3`）。HTTPレスポンスにエラーが含まれている場合、そのエラーはここにログに記録されます。
    *   最後に、必要なデータが含まれるレスポンスのボディを取得します。このチュートリアルでは、エラーが発生した場合の結果として空のリストを使用し、対応するエラーをログに記録します（`#4`）。

2.  `.body() ?: emptyList()`の繰り返しを避けるために、拡張関数`bodyList()`が宣言されています。

    ```kotlin
    fun <T> Response<List<T>>.bodyList(): List<T> {
        return body() ?: emptyList()
    }
    ```

3.  プログラムをもう一度実行し、IntelliJ IDEAのシステム出力を確認してください。次のような表示になるはずです。

    ```text
    1770 [AWT-EventQueue-0] INFO  Contributors - kotlin: loaded 40 repos
    2025 [AWT-EventQueue-0] INFO  Contributors - kotlin-examples: loaded 23 contributors
    2229 [AWT-EventQueue-0] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    ```

    *   各行の最初の項目はプログラム開始からのミリ秒数、次に角括弧内にスレッド名が表示されます。どのスレッドからロードリクエストが呼び出されているかを確認できます。
    *   各行の最後の項目は実際のメッセージで、ロードされたリポジトリまたはコントリビューターの数を示します。

    このログ出力は、すべての結果がメインスレッドからログに記録されたことを示しています。コードを_BLOCKING_オプションで実行すると、ロードが完了するまでウィンドウがフリーズし、入力に反応しなくなります。すべてのリクエストは`loadContributorsBlocking()`が呼び出されたのと同じスレッド、つまりメインUIスレッド（SwingではAWTイベントディスパッチスレッド）から実行されます。このメインスレッドがブロックされるため、UIがフリーズします。

    ![ブロックされたメインスレッド](blocking.png){width=700}

    コントリビューターのリストがロードされた後、結果が更新されます。

4.  `src/contributors/Contributors.kt`で、コントリビューターのロード方法を選択する`loadContributors()`関数を見つけ、`loadContributorsBlocking()`がどのように呼び出されているかを確認します。

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()`の呼び出しは、`loadContributorsBlocking()`の呼び出しの直後に行われます。
    *   `updateResults()`はUIを更新するため、常にUIスレッドから呼び出される必要があります。
    *   `loadContributorsBlocking()`もUIスレッドから呼び出されるため、UIスレッドがブロックされ、UIがフリーズします。

### タスク1

最初のタスクは、タスクドメインに慣れるのに役立ちます。現在、各コントリビューターの名前は、参加したすべてのプロジェクトについて複数回繰り返されています。各コントリビューターが一度だけ追加されるように、ユーザーを結合する`aggregate()`関数を実装してください。`User.contributions`プロパティには、特定のユーザーが_すべての_プロジェクトに行った貢献の合計数を含める必要があります。結果のリストは、貢献数の降順でソートする必要があります。

`src/tasks/Aggregation.kt`を開き、`List<User>.aggregate()`関数を実装します。ユーザーは、貢献の合計数でソートする必要があります。

対応するテストファイル`test/tasks/AggregationKtTest.kt`には、期待される結果の例が示されています。

> [IntelliJ IDEAのショートカット](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation)`Ctrl+Shift+T` / `⇧ ⌘ T`を使用して、ソースコードとテストクラス間を自動で移動できます。
>
{style="tip"}

このタスクを実装すると、「kotlin」組織の結果リストは次のようになります。

![「kotlin」組織のリスト](aggregate.png){width=500}

#### タスク1のソリューション {initial-collapse-state="collapsed" collapsible="true"}

1.  ユーザーをログイン名でグループ化するには、ログイン名から異なるリポジトリにおけるこのログイン名のユーザーのすべての出現箇所へのマップを返す[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)を使用します。
2.  各マップエントリについて、各ユーザーの貢献の合計数を数え、指定された名前と貢献の合計を持つ`User`クラスの新しいインスタンスを作成します。
3.  結果のリストを降順でソートします。

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

別の解決策として、`groupBy()`の代わりに[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)関数を使用することもできます。

## コールバック

前のソリューションは機能しますが、スレッドをブロックするため、UIがフリーズします。これを回避する伝統的なアプローチは、_コールバック_を使用することです。

操作が完了した直後に呼び出されるべきコードを呼び出す代わりに、それを別のコールバック（多くの場合ラムダ）に抽出し、後で呼び出されるようにそのラムダを呼び出し元に渡すことができます。

UIを応答性のあるものにするには、計算全体を別のスレッドに移動するか、ブロッキング呼び出しの代わりにコールバックを使用するRetrofit APIに切り替えるかのいずれかを行うことができます。

### バックグラウンドスレッドの使用

1.  `src/tasks/Request2Background.kt`を開き、その実装を確認します。まず、計算全体が別のスレッドに移動されます。`thread()`関数は新しいスレッドを開始します。

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    これでロード全体が別のスレッドに移動されたため、メインスレッドは空き状態になり、他のタスクに使用できるようになります。

    ![解放されたメインスレッド](background.png){width=700}

2.  `loadContributorsBackground()`関数のシグネチャが変更されます。すべてのロードが完了した後に呼び出す`updateResults()`コールバックを最後の引数として取ります。

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  これで`loadContributorsBackground()`が呼び出されると、`updateResults()`の呼び出しは、以前のようにすぐ後ではなく、コールバック内で行われます。

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    `SwingUtilities.invokeLater`を呼び出すことで、結果を更新する`updateResults()`の呼び出しがメインUIスレッド（AWTイベントディスパッチスレッド）で行われることを保証します。

しかし、`BACKGROUND`オプションを介してコントリビューターをロードしようとすると、リストは更新されますが、何も変更されないことがわかります。

### タスク2

`src/tasks/Request2Background.kt`の`loadContributorsBackground()`関数を修正し、結果のリストがUIに表示されるようにしてください。

#### タスク2のソリューション {initial-collapse-state="collapsed" collapsible="true"}

コントリビューターをロードしようとすると、ログにはコントリビューターがロードされていることが示されますが、結果は表示されません。これを修正するには、結果のユーザーリストに対して`updateResults()`を呼び出します。

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

コールバックで渡されたロジックを明示的に呼び出すようにしてください。そうしないと、何も起こりません。

### RetrofitコールバックAPIの使用

前のソリューションでは、ロードロジック全体がバックグラウンドスレッドに移動されましたが、それでもリソースの最適な使用法ではありません。すべてのロードリクエストは順次実行され、スレッドはロード結果を待つ間ブロックされますが、他のタスクに使用することもできました。具体的には、スレッドは別のリクエストのロードを開始して、結果全体をより早く受け取ることができたはずです。

その後、各リポジトリのデータの処理は、ロードと結果のレスポンスの処理の2つの部分に分けるべきです。2番目の_処理_部分は、コールバックに抽出されるべきです。

その後、各リポジトリのロードは、前のリポジトリの結果が受信される前（および対応するコールバックが呼び出される前）に開始できます。

![コールバックAPIの使用](callbacks.png){width=700}

RetrofitコールバックAPIはこれを達成するのに役立ちます。`Call.enqueue()`関数はHTTPリクエストを開始し、引数としてコールバックを取ります。このコールバックでは、各リクエスト後に何をする必要があるかを指定する必要があります。

`src/tasks/Request3Callbacks.kt`を開き、このAPIを使用する`loadContributorsCallbacks()`の実装を確認してください。

```kotlin
fun loadContributorsCallbacks(
    service: GitHubService, req: RequestData,
    updateResults: (List<User>) -> Unit
) {
    service.getOrgReposCall(req.org).onResponse { responseRepos ->  // #1
        logRepos(req, responseRepos)
        val repos = responseRepos.bodyList()

        val allUsers = mutableListOf<User>()
        for (repo in repos) {
            service.getRepoContributorsCall(req.org, repo.name)
                .onResponse { responseUsers ->  // #2
                    logUsers(repo, responseUsers)
                    val users = responseUsers.bodyList()
                    allUsers += users
                }
            }
        }
        // TODO: Why doesn't this code work? How to fix that?
        updateResults(allUsers.aggregate())
    }
```

*   便宜上、このコードフラグメントは同じファイルで宣言された`onResponse()`拡張関数を使用しています。これは、オブジェクト式ではなくラムダを引数として取ります。
*   レスポンスを処理するロジックはコールバックに抽出されます。対応するラムダは`#1`行と`#2`行で始まります。

しかし、提供されたソリューションは機能しません。プログラムを実行し、_CALLBACKS_オプションを選択してコントリビューターをロードすると、何も表示されないことがわかります。しかし、`Request3CallbacksKtTest`のテストは、成功した結果をすぐに返します。

与えられたコードが期待どおりに機能しない理由を考え、それを修正してみてください。または、以下のソリューションを参照してください。

### タスク3 (オプション)

`src/tasks/Request3Callbacks.kt`ファイル内のコードを書き換えて、ロードされたコントリビューターのリストが表示されるようにしてください。

#### タスク3の最初の試行ソリューション {initial-collapse-state="collapsed" collapsible="true"}

現在のソリューションでは、多くのリクエストが並行して開始され、全体のロード時間が短縮されます。しかし、結果はロードされていません。これは、`allUsers`リストにデータが入力される前に、すべてのロードリクエストが開始された直後に`updateResults()`コールバックが呼び出されるためです。

次のような変更でこれを修正しようとすることができます。

```kotlin
val allUsers = mutableListOf<User>()
for ((index, repo) in repos.withIndex()) {   // #1
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            logUsers(repo, responseUsers)
            val users = responseUsers.bodyList()
            allUsers += users
            if (index == repos.lastIndex) {    // #2
                updateResults(allUsers.aggregate())
            }
        }
}
```

*   まず、リポジトリのリストをインデックス付きでイテレートします（`#1`）。
*   次に、各コールバックから、それが最後のイテレーションであるかどうかを確認します（`#2`）。
*   そして、そうである場合に結果が更新されます。

しかし、このコードも私たちの目的を達成できません。自分で答えを見つけるか、以下のソリューションを参照してください。

#### タスク3の2番目の試行ソリューション {initial-collapse-state="collapsed" collapsible="true"}

ロードリクエストは並行して開始されるため、最後のリクエストの結果が最後に返されるという保証はありません。結果は任意の順序で返される可能性があります。

したがって、完了の条件として現在のインデックスを`lastIndex`と比較すると、一部のリポジトリの結果が失われるリスクがあります。

最後のリポジトリを処理するリクエストが、それより前のリクエストよりも速く戻ってきた場合（これは起こりやすい）、より時間がかかるリクエストのすべての結果が失われます。

これを修正する方法の1つは、インデックスを導入し、すべてのリポジトリがすでに処理されたかどうかを確認することです。

```kotlin
val allUsers = Collections.synchronizedList(mutableListOf<User>())
val numberOfProcessed = AtomicInteger()
for (repo in repos) {
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            logUsers(repo, responseUsers)
            val users = responseUsers.bodyList()
            allUsers += users
            if (numberOfProcessed.incrementAndGet() == repos.size) {
                updateResults(allUsers.aggregate())
            }
        }
}
```

このコードは、リストの同期バージョンと`AtomicInteger()`を使用しています。なぜなら、一般に、`getRepoContributors()`リクエストを処理する異なるコールバックが常に同じスレッドから呼び出されるという保証がないためです。

#### タスク3の3番目の試行ソリューション {initial-collapse-state="collapsed" collapsible="true"}

さらに良い解決策は、`CountDownLatch`クラスを使用することです。これはリポジトリの数で初期化されたカウンターを格納します。このカウンターは、各リポジトリの処理後にデクリメントされます。その後、ラッチがゼロになるまで待機してから結果を更新します。

```kotlin
val countDownLatch = CountDownLatch(repos.size)
for (repo in repos) {
    service.getRepoContributorsCall(req.org, repo.name)
        .onResponse { responseUsers ->
            // processing repository
            countDownLatch.countDown()
        }
}
countDownLatch.await()
updateResults(allUsers.aggregate())
```

結果はメインスレッドから更新されます。これは、ロジックを子スレッドに委譲するよりも直接的です。

これらの3つのソリューション試行をレビューすると、コールバックで正しいコードを書くことは、特に複数の基盤となるスレッドと同期が発生する場合、非自明でエラーが発生しやすいことがわかります。

> 追加の演習として、RxJavaライブラリを使用したリアクティブなアプローチで同じロジックを実装することもできます。必要な依存関係とRxJavaを使用するためのソリューションは、別の`rx`ブランチにあります。このチュートリアルを完了し、適切な比較のために提案されたRxバージョンを実装または確認することも可能です。
>
{style="tip"}

## サスペンド関数

サスペンド関数（Suspending functions）を使用して同じロジックを実装できます。`Call<List<Repo>>`を返す代わりに、API呼び出しを次のように[サスペンド関数](composing-suspending-functions.md)として定義します。

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()`は`suspend`関数として定義されています。サスペンド関数を使用してリクエストを実行する場合、基盤となるスレッドはブロックされません。これがどのように機能するかについては、後のセクションで詳しく説明します。
*   `getOrgRepos()`は`Call`を返す代わりに、結果を直接返します。結果が失敗した場合は、例外がスローされます。

あるいは、Retrofitは結果を`Response`でラップして返すことを許可しています。この場合、結果のボディが提供され、手動でエラーをチェックすることが可能です。このチュートリアルでは、`Response`を返すバージョンを使用します。

`src/contributors/GitHubService.kt`で、`GitHubService`インターフェースに次の宣言を追加します。

```kotlin
interface GitHubService {
    // getOrgReposCall & getRepoContributorsCall declarations

    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): Response<List<Repo>>

    @GET("repos/{owner}/{repo}/contributors?per_page=100")
    suspend fun getRepoContributors(
        @Path("owner") owner: String,
        @Path("repo") repo: String
    ): Response<List<User>>
}
```

### タスク4

あなたのタスクは、コントリビューターをロードする関数のコードを変更し、2つの新しいサスペンド関数`getOrgRepos()`と`getRepoContributors()`を利用するようにすることです。新しい`loadContributorsSuspend()`関数は、新しいAPIを使用するために`suspend`としてマークされています。

> サスペンド関数はどこからでも呼び出せるわけではありません。`loadContributorsBlocking()`からサスペンド関数を呼び出すと、「Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function」というメッセージのエラーが発生します。
>
{style="note"}

1.  `src/tasks/Request1Blocking.kt`で定義されている`loadContributorsBlocking()`の実装を、`src/tasks/Request4Suspend.kt`で定義されている`loadContributorsSuspend()`にコピーします。
2.  `Call`を返す関数ではなく、新しいサスペンド関数が使用されるようにコードを変更します。
3.  _SUSPEND_オプションを選択してプログラムを実行し、GitHubリクエストの実行中もUIが応答性のある状態であることを確認します。

#### タスク4のソリューション {initial-collapse-state="collapsed" collapsible="true"}

`.getOrgReposCall(req.org).execute()`を`.getOrgRepos(req.org)`に置き換え、2番目の「コントリビューター」リクエストについても同様の置き換えを繰り返します。

```kotlin
suspend fun loadContributorsSuspend(service: GitHubService, req: RequestData): List<User> {
    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    return repos.flatMap { repo ->
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }.aggregate()
}
```

*   `loadContributorsSuspend()`は`suspend`関数として定義する必要があります。
*   以前`Response`を返していた`execute`を呼び出す必要はなくなりました。これは、API関数が`Response`を直接返すようになったためです。この詳細はRetrofitライブラリに固有のものであることに注意してください。他のライブラリではAPIは異なりますが、概念は同じです。

## コルーチン

サスペンド関数を持つコードは「ブロッキング」バージョンと似ています。ブロッキングバージョンとの大きな違いは、スレッドをブロックする代わりに、コルーチンが中断されることです。

```text
block -> suspend
thread -> coroutine
```

> コルーチンは、スレッド上でコードを実行するのと同様に、コルーチン上でコードを実行できるため、軽量スレッド（lightweight threads）と呼ばれることがよくあります。以前はブロッキングであり（避けるべきだった）操作は、代わりにコルーチンを中断できるようになりました。
>
{style="note"}

### 新しいコルーチンの開始

`src/contributors/Contributors.kt`で`loadContributorsSuspend()`がどのように使用されているかを見ると、`launch`の内部で呼び出されていることがわかります。`launch`はラムダを引数として取るライブラリ関数です。

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

ここで`launch`は、データのロードと結果の表示を担当する新しい計算を開始します。この計算は中断可能であり、ネットワークリクエストを実行する際に中断され、基盤となるスレッドを解放します。ネットワークリクエストが結果を返すと、計算は再開されます。

このような中断可能な計算を_コルーチン_と呼びます。したがって、この場合、`launch`はデータのロードと結果の表示を担当する_新しいコルーチンを開始します_。

コルーチンはスレッド上で実行され、中断することができます。コルーチンが中断されると、対応する計算は一時停止され、スレッドから削除されてメモリに保存されます。一方、スレッドは他のタスクに使用できるようになります。

![コルーチンのサスペンド](suspension-process.gif){width=700}

計算が続行できる状態になると、スレッド（必ずしも同じスレッドとは限りません）に返されます。

`loadContributorsSuspend()`の例では、各「コントリビューター」リクエストが中断メカニズムを使用して結果を待機するようになりました。まず、新しいリクエストが送信されます。次に、応答を待つ間、`launch`関数によって開始された「コントリビューターのロード」コルーチン全体が中断されます。

コルーチンは、対応する応答が受信された後にのみ再開されます。

![リクエストのサスペンド](suspend-requests.png){width=700}

応答が受信されるのを待つ間、スレッドは他のタスクに使用できます。すべてのリクエストがメインUIスレッドで行われているにもかかわらず、UIは応答性のある状態を維持します。

1.  _SUSPEND_オプションを使用してプログラムを実行します。ログは、すべてのリクエストがメインUIスレッドに送信されていることを確認します。

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  ログは、対応するコードがどのコルーチン上で実行されているかを表示できます。これを有効にするには、**Run | Edit configurations**を開き、`-Dkotlinx.coroutines.debug`VMオプションを追加します。

    ![実行構成の編集](run-configuration.png){width=500}

    `main()`がこのオプションで実行される間、コルーチン名がスレッド名に付加されます。すべてのKotlinファイルを実行するためのテンプレートを変更し、このオプションをデフォルトで有効にすることもできます。

これで、すべてのコードが1つのコルーチン、つまり上記で言及した「コントリビューターのロード」コルーチン（`@coroutine#1`と表記）で実行されます。結果を待つ間、コードが順次記述されているため、他のリクエストを送信するためにスレッドを再利用すべきではありません。新しいリクエストは、前の結果が受信された後にのみ送信されます。

サスペンド関数はスレッドを公平に扱い、「待機」のためにブロックしません。しかし、これだけではまだ並行性をもたらすものではありません。

## 並行性

Kotlinのコルーチンは、スレッドよりもはるかにリソース消費が少ないです。非同期に新しい計算を開始したい場合は、代わりに新しいコルーチンを作成できます。

新しいコルーチンを開始するには、主要な_コルーチンビルダー_のいずれか（`launch`、`async`、または`runBlocking`）を使用します。異なるライブラリは、追加のコルーチンビルダーを定義できます。

`async`は新しいコルーチンを開始し、`Deferred`オブジェクトを返します。`Deferred`は、`Future`や`Promise`といった他の名前で知られる概念を表します。それは計算を格納しますが、最終結果を得る瞬間を_遅らせます_。それは_将来_のある時点で結果を_約束します_。

`async`と`launch`の主な違いは、`launch`が特定の結果を返すと期待されない計算を開始するために使用されることです。`launch`はコルーチンを表す`Job`を返します。`Job.join()`を呼び出すことで、完了するまで待機することが可能です。

`Deferred`は`Job`を拡張するジェネリック型です。`async`呼び出しは、ラムダが返すもの（ラムダ内の最後の式が結果）に応じて、`Deferred<Int>`または`Deferred<CustomType>`を返すことができます。

コルーチンの結果を取得するには、`Deferred`インスタンスで`await()`を呼び出します。結果を待つ間、この`await()`が呼び出されたコルーチンは中断されます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val deferred: Deferred<Int> = async {
        loadData()
    }
    println("waiting...")
    println(deferred.await())
}

suspend fun loadData(): Int {
    println("loading...")
    delay(1000L)
    println("loaded!")
    return 42
}
```

`runBlocking`は、通常の関数とサスペンド関数、またはブロッキングの世界と非ブロッキングの世界の間の橋渡しとして使用されます。これは、トップレベルのメインコルーチンを開始するためのアダプターとして機能します。主に`main()`関数やテストでの使用を意図しています。

> コルーチンについてより深く理解するには、[このビデオ](https://www.youtube.com/watch?v=zEZc5AmHQhk)をご覧ください。
>
{style="tip"}

Deferredオブジェクトのリストがある場合、`awaitAll()`を呼び出すことで、それらすべての結果を待つことができます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking {
    val deferreds: List<Deferred<Int>> = (1..3).map {
        async {
            delay(1000L * it)
            println("Loading $it")
            it
        }
    }
    val sum = deferreds.awaitAll().sum()
    println("$sum")
}
```

各「コントリビューター」リクエストが新しいコルーチンで開始されると、すべてのリクエストは非同期で開始されます。新しいリクエストは、前のリクエストの結果が受信される前に送信できます。

![並行するコルーチン](concurrency.png){width=700}

全体のロード時間は_CALLBACKS_バージョンとほぼ同じですが、コールバックは必要ありません。さらに、`async`はコード内でどの部分が並行して実行されるかを明示的に強調します。

### タスク5

`Request5Concurrent.kt`ファイルで、以前の`loadContributorsSuspend()`関数を使用して`loadContributorsConcurrent()`関数を実装してください。

#### タスク5のヒント {initial-collapse-state="collapsed" collapsible="true"}

新しいコルーチンはコルーチンスコープ（coroutine scope）内でのみ開始できます。`loadContributorsSuspend()`の内容を`coroutineScope`呼び出しにコピーして、そこで`async`関数を呼び出せるようにします。

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService,
    req: RequestData
): List<User> = coroutineScope {
    // ...
}
```

次のスキームに基づいてソリューションを構築してください。

```kotlin
val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
    async {
        // load contributors for each repo
    }
}
deferreds.awaitAll() // List<List<User>>
```

#### タスク5のソリューション {initial-collapse-state="collapsed" collapsible="true"}

各「コントリビューター」リクエストを`async`でラップして、リポジトリの数だけコルーチンを作成します。`async`は`Deferred<List<User>>`を返します。新しいコルーチンの作成はリソース消費が少ないため、必要なだけ作成できるため、これは問題ありません。

1.  `map`の結果がリストのリストではなく`Deferred`オブジェクトのリストになったため、`flatMap`は使用できません。`awaitAll()`は`List<List<User>>`を返すので、`flatten().aggregate()`を呼び出して結果を取得します。

    ```kotlin
    suspend fun loadContributorsConcurrent(
        service: GitHubService, 
        req: RequestData
    ): List<User> = coroutineScope {
        val repos = service
            .getOrgRepos(req.org)
            .also { logRepos(req, it) }
            .bodyList()
    
        val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
            async {
                service.getRepoContributors(req.org, repo.name)
                    .also { logUsers(repo, it) }
                    .bodyList()
            }
        }
        deferreds.awaitAll().flatten().aggregate()
    }
    ```

2.  コードを実行し、ログを確認します。マルチスレッドがまだ利用されていないため、すべてのコルーチンはメインUIスレッド上で実行されますが、コルーチンを並行して実行することの利点はすでに確認できます。
3.  このコードを、共通のスレッドプールからの異なるスレッドで「コントリビューター」コルーチンを実行するように変更するには、`Dispatchers.Default`を`async`関数のコンテキスト引数として指定します。

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher`は、対応するコルーチンが実行されるスレッドまたはスレッドを決定します。引数として指定しない場合、`async`は外部スコープからのディスパッチャを使用します。
    *   `Dispatchers.Default`は、JVM上のスレッドの共有プールを表します。このプールは並行実行の手段を提供します。利用可能なCPUコアと同じ数のスレッドで構成されますが、コアが1つしかない場合でも2つのスレッドを持ちます。

4.  `loadContributorsConcurrent()`関数のコードを変更して、共通のスレッドプールから異なるスレッドで新しいコルーチンを開始します。また、リクエストを送信する前に追加のログを追加します。

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  プログラムをもう一度実行します。ログで、各コルーチンがスレッドプールの1つのスレッドで開始され、別のスレッドで再開できることがわかります。

    ```text
    1946 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    1946 [DefaultDispatcher-worker-3 @coroutine#5] INFO  Contributors - starting loading for dokka
    1946 [DefaultDispatcher-worker-1 @coroutine#3] INFO  Contributors - starting loading for ts2kt
    ...
    2178 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    2569 [DefaultDispatcher-worker-1 @coroutine#5] INFO  Contributors - dokka: loaded 36 contributors
    2821 [DefaultDispatcher-worker-2 @coroutine#3] INFO  Contributors - ts2kt: loaded 11 contributors
    ```

    たとえば、このログの抜粋では、`coroutine#4`は`worker-2`スレッドで開始され、`worker-1`スレッドで続行されます。

`src/contributors/Contributors.kt`で、_CONCURRENT_オプションの実装を確認します。

1.  メインUIスレッドでのみコルーチンを実行するには、`Dispatchers.Main`を引数として指定します。

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   メインスレッドがビジー状態のときに新しいコルーチンを開始すると、そのコルーチンは中断され、このスレッドでの実行がスケジュールされます。コルーチンは、スレッドが空きになるまで再開されません。
    *   各エンドポイントで明示的にディスパッチャを指定するのではなく、外部スコープからのディスパッチャを使用することが良いプラクティスとされています。`Dispatchers.Default`を引数として渡さずに`loadContributorsConcurrent()`を定義した場合、この関数は任意のコンテキスト（`Default`ディスパッチャ、メインUIスレッド、またはカスタムディスパッチャ）で呼び出すことができます。
    *   後でわかるように、テストから`loadContributorsConcurrent()`を呼び出す場合、`TestDispatcher`のコンテキストで呼び出すことができ、テストが簡素化されます。これにより、このソリューションははるかに柔軟になります。

2.  呼び出し側でディスパッチャを指定するには、`loadContributorsConcurrent`が継承されたコンテキストでコルーチンを開始するようにしながら、プロジェクトに次の変更を適用します。

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()`はメインUIスレッドで呼び出す必要があるため、`Dispatchers.Main`のコンテキストで呼び出します。
    *   `withContext()`は、指定されたコルーチンコンテキストで与えられたコードを呼び出し、完了するまで中断し、結果を返します。これを表現する別の、しかしより冗長な方法は、新しいコルーチンを開始し、完了するまで明示的に待機することです（中断によって）：`launch(context) { ... }.join()`。

3.  コードを実行し、コルーチンがスレッドプールからのスレッド上で実行されていることを確認します。

## 構造化された並行処理

*   _コルーチンスコープ_は、異なるコルーチン間の構造と親子関係を担当します。新しいコルーチンは通常、スコープ内で開始する必要があります。
*   _コルーチンコンテキスト_は、コルーチンのカスタム名やコルーチンがスケジュールされるスレッドを指定するディスパッチャ（dispatcher）など、特定のコルーチンを実行するために使用される追加の技術情報を格納します。

`launch`、`async`、または`runBlocking`を使用して新しいコルーチンを開始すると、それらは自動的に対応するスコープを作成します。これらの関数はすべて、レシーバーを持つラムダを引数として取り、`CoroutineScope`が暗黙のレシーバー型になります。

```kotlin
launch { /* this: CoroutineScope */ }
```

*   新しいコルーチンはスコープ内でのみ開始できます。
*   `launch`と`async`は`CoroutineScope`の拡張として宣言されているため、これらを呼び出すときは常に暗黙的または明示的なレシーバーを渡す必要があります。
*   `runBlocking`によって開始されるコルーチンは唯一の例外です。なぜなら、`runBlocking`はトップレベル関数として定義されているからです。しかし、現在のスレッドをブロックするため、主に`main()`関数やテストでブリッジ関数として使用されることを意図しています。

`runBlocking`、`launch`、または`async`の内部で新しいコルーチンは、スコープ内で自動的に開始されます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

`runBlocking`の内部で`launch`を呼び出すと、それは`CoroutineScope`型の暗黙のレシーバーの拡張として呼び出されます。あるいは、明示的に`this.launch`と書くこともできます。

ネストされたコルーチン（この例では`launch`によって開始されたもの）は、外側のコルーチン（`runBlocking`によって開始されたもの）の子と見なすことができます。この「親子」関係はスコープを介して機能します。子コルーチンは、親コルーチンに対応するスコープから開始されます。

`coroutineScope`関数を使用すると、新しいコルーチンを開始せずに新しいスコープを作成することができます。`suspend`関数内で外側のスコープにアクセスせずに構造化された方法で新しいコルーチンを開始するには、この`suspend`関数が呼び出された外側のスコープの子として自動的になる新しいコルーチンスコープを作成できます。`loadContributorsConcurrent()`はその良い例です。

また、`GlobalScope.async`または`GlobalScope.launch`を使用してグローバルスコープから新しいコルーチンを開始することもできます。これにより、トップレベルの「独立した」コルーチンが作成されます。

コルーチンの構造の背後にあるメカニズムは、_構造化された並行処理_（Structured concurrency）と呼ばれます。これはグローバルスコープよりも以下の利点を提供します。

*   スコープは通常、その寿命がスコープの寿命に結びついている子コルーチンを担当します。
*   スコープは、何か問題が発生した場合、またはユーザーが考えを変えて操作を取り消すことを決定した場合に、子コルーチンを自動的にキャンセルできます。
*   スコープは、すべての子コルーチンの完了を自動的に待ちます。したがって、スコープがコルーチンに対応する場合、親コルーチンは、そのスコープ内で起動されたすべてのコルーチンが完了するまで完了しません。

`GlobalScope.async`を使用する場合、複数のコルーチンを小さなスコープに結びつける構造はありません。グローバルスコープから開始されたコルーチンはすべて独立しており、その寿命はアプリケーション全体の寿命によってのみ制限されます。グローバルスコープから開始されたコルーチンへの参照を格納し、その完了を待つか、明示的にキャンセルすることは可能ですが、構造化された並行処理の場合のように自動的には行われません。

### コントリビューターのロードのキャンセル

コントリビューターのリストをロードする関数の2つのバージョンを作成します。親コルーチンをキャンセルしようとしたときに、両方のバージョンがどのように動作するかを比較します。最初のバージョンでは`coroutineScope`を使用してすべての子コルーチンを開始し、2番目のバージョンでは`GlobalScope`を使用します。

1.  `Request5Concurrent.kt`で、`loadContributorsConcurrent()`関数に3秒の遅延を追加します。

    ```kotlin
    suspend fun loadContributorsConcurrent(
        service: GitHubService, 
        req: RequestData
    ): List<User> = coroutineScope {
        // ...
        async {
            log("starting loading for ${repo.name}")
            delay(3000)
            // load repo contributors
        }
        // ...
    }
    ```

    この遅延は、すべてのリクエストを送信するコルーチンに影響を与えるため、コルーチンが開始されてからリクエストが送信されるまでの間にロードをキャンセルするのに十分な時間があります。

2.  ロード関数の2番目のバージョンを作成します。`loadContributorsConcurrent()`の実装を`Request5NotCancellable.kt`の`loadContributorsNotCancellable()`にコピーし、新しい`coroutineScope`の作成を削除します。
3.  `async`呼び出しは解決に失敗するため、`GlobalScope.async`を使用して開始します。

    ```kotlin
    suspend fun loadContributorsNotCancellable(
        service: GitHubService,
        req: RequestData
    ): List<User> {   // #1
        // ...
        GlobalScope.async {   // #2
            log("starting loading for ${repo.name}")
            // load repo contributors
        }
        // ...
        return deferreds.awaitAll().flatten().aggregate()  // #3
    }
    ```

    *   関数はラムダ内の最後の式としてではなく、結果を直接返すようになりました（`#1`行と`#3`行）。
    *   すべての「コントリビューター」コルーチンはコルーチンスコープの子としてではなく、`GlobalScope`内で開始されます（`#2`行）。

4.  プログラムを実行し、_CONCURRENT_オプションを選択してコントリビューターをロードします。
5.  すべての「コントリビューター」コルーチンが開始されるまで待機し、_Cancel_をクリックします。ログには新しい結果が表示されず、すべてのリクエストが実際にキャンセルされたことを意味します。

    ```text
    2896 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 40 repos
    2901 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2909 [DefaultDispatcher-worker-5 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* no requests are sent */
    ```

6.  ステップ5を繰り返しますが、今回は`NOT_CANCELLABLE`オプションを選択します。

    ```text
    2570 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2579 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2586 [DefaultDispatcher-worker-6 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* but all the requests are still sent: */
    6402 [DefaultDispatcher-worker-5 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    9555 [DefaultDispatcher-worker-8 @coroutine#36] INFO  Contributors - mpp-example: loaded 8 contributors
    ```

    この場合、コルーチンはキャンセルされず、すべてのリクエストがまだ送信されます。

7.  「コントリビューター」プログラムでキャンセルがどのようにトリガーされるかを確認します。_Cancel_ボタンがクリックされると、メインの「ロード」コルーチンが明示的にキャンセルされ、子コルーチンが自動的にキャンセルされます。

    ```kotlin
    interface Contributors {
    
        fun loadContributors() {
            // ...
            when (getSelectedVariant()) {
                CONCURRENT -> {
                    launch {
                        val users = loadContributorsConcurrent(service, req)
                        updateResults(users, startTime)
                    }.setUpCancellation()      // #1
                }
            }
        }
    
        private fun Job.setUpCancellation() {
            val loadingJob = this              // #2
    
            // cancel the loading job if the 'cancel' button was clicked:
            val listener = ActionListener {
                loadingJob.cancel()            // #3
                updateLoadingStatus(CANCELED)
            }
            // add a listener to the 'cancel' button:
            addCancelListener(listener)
    
            // update the status and remove the listener
            // after the loading job is completed
        }
    }   
    ```

`launch`関数は`Job`のインスタンスを返します。`Job`は、すべてのデータをロードして結果を更新する「ロードコルーチン」への参照を格納します。`Job`のインスタンスをレシーバーとして渡し、その上で`setUpCancellation()`拡張関数を呼び出すことができます（`#1`行）。

これを表現する別の方法として、明示的に次のように記述することもできます。

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   読みやすさのために、関数内で`setUpCancellation()`関数のレシーバーを新しい`loadingJob`変数で参照できます（`#2`行）。
*   次に、_Cancel_ボタンにリスナーを追加し、クリックされたときに`loadingJob`がキャンセルされるようにします（`#3`行）。

構造化された並行処理では、親コルーチンをキャンセルするだけでよく、これにより子コルーチンへのキャンセルが自動的に伝播されます。

### 外側のスコープのコンテキストの使用

与えられたスコープ内で新しいコルーチンを開始する場合、それらすべてが同じコンテキストで実行されることを保証するのがはるかに簡単になります。また、必要に応じてコンテキストを置き換えることもはるかに簡単です。

さて、外側のスコープからディスパッチャを使用する方法を学ぶ時が来ました。`coroutineScope`またはコルーチンビルダーによって作成された新しいスコープは、常に外側のスコープからコンテキストを継承します。この場合、外側のスコープは、`suspend loadContributorsConcurrent()`関数が呼び出されたスコープです。

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

すべてのネストされたコルーチンは、継承されたコンテキストで自動的に開始されます。ディスパッチャはこのコンテキストの一部です。そのため、`async`によって開始されたすべてのコルーチンは、デフォルトのディスパッチャのコンテキストで開始されます。

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService, req: RequestData
): List<User> = coroutineScope {
    // this scope inherits the context from the outer scope
    // ...
    async {   // nested coroutine started with the inherited context
        // ...
    }
    // ...
}
```

構造化された並行処理では、トップレベルのコルーチンを作成する際に、主要なコンテキスト要素（ディスパッチャなど）を一度指定できます。その後、すべてのネストされたコルーチンはコンテキストを継承し、必要に応じてのみそれを変更します。

> UIアプリケーション、たとえばAndroidアプリケーションのコルーチンコードを書く場合、トップレベルのコルーチンにはデフォルトで`CoroutineDispatchers.Main`を使用し、別のスレッドでコードを実行する必要がある場合に異なるディスパッチャを明示的に指定するのが一般的な慣習です。
>
{style="tip"}

## 進捗の表示

一部のリポジトリの情報はかなり早くロードされるにもかかわらず、ユーザーはすべてのデータがロードされてから最終的なリストを見るだけです。それまでの間、ローダーアイコンは進捗を示していますが、現在の状態やロード済みのコントリビューターに関する情報はありません。

中間結果をより早く表示し、各リポジトリのデータをロードした後にすべてのコントリビューターを表示できます。

![データのロード中](loading.gif){width=500}

この機能を実装するには、`src/tasks/Request6Progress.kt`で、UIを更新するロジックをコールバックとして渡す必要があります。これにより、各中間状態で呼び出されます。

```kotlin
suspend fun loadContributorsProgress(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) {
    // loading the data
    // calling `updateResults()` on intermediate states
}
```

`Contributors.kt`の呼び出しサイトでは、_PROGRESS_オプションについて、`Main`スレッドから結果を更新するためにコールバックが渡されます。

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()`パラメーターは`loadContributorsProgress()`で`suspend`として宣言されています。対応するラムダ引数の内部で`suspend`関数である`withContext`を呼び出す必要があります。
*   `updateResults()`コールバックは、ロードが完了したか、結果が最終であるかを指定する追加のブール型パラメーターを引数として取ります。

### タスク6

`Request6Progress.kt`ファイルで、中間進捗を表示する`loadContributorsProgress()`関数を実装してください。`Request4Suspend.kt`の`loadContributorsSuspend()`関数をベースにします。

*   並行処理のないシンプルなバージョンを使用してください。並行処理は次のセクションで後で追加します。
*   コントリビューターの中間リストは、各リポジトリでロードされたユーザーのリストだけでなく、「集約された（aggregated）」状態で表示されるべきです。
*   各ユーザーの貢献の合計数は、新しいリポジトリのデータがロードされるたびに増加するべきです。

#### タスク6のソリューション {initial-collapse-state="collapsed" collapsible="true"}

ロードされたコントリビューターの中間リストを「集約された」状態で格納するには、ユーザーのリストを格納する`allUsers`変数を定義し、各新しいリポジトリのコントリビューターがロードされた後にそれを更新します。

```kotlin
suspend fun loadContributorsProgress(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) {
    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    var allUsers = emptyList<User>()
    for ((index, repo) in repos.withIndex()) {
        val users = service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()

        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, index == repos.lastIndex)
    }
}
```

#### 逐次 vs 並行

各リクエストが完了した後、`updateResults()`コールバックが呼び出されます。

![リクエストの進捗](progress.png){width=700}

このコードには並行処理は含まれていません。逐次実行なので、同期は必要ありません。

最良のオプションは、リクエストを並行して送信し、各リポジトリの応答を受け取った後に中間結果を更新することです。

![並行リクエスト](progress-and-concurrency.png){width=700}

並行処理を追加するには、_チャネル_を使用します。

## チャネル

共有可能な可変状態を持つコードを書くことは、非常に困難でエラーが発生しやすいです（コールバックを使用するソリューションのように）。より簡単な方法は、共通の可変状態を使用するのではなく、通信によって情報を共有することです。コルーチンは_チャネル_を介して互いに通信できます。

チャネルは、コルーチン間でデータを渡すことを可能にする通信プリミティブです。あるコルーチンは情報をチャネルに_送信_でき、別のコルーチンはその情報をチャネルから_受信_できます。

![チャネルの使用](using-channel.png)

情報を送信する（生成する）コルーチンはプロデューサー、情報を受信する（消費する）コルーチンはコンシューマーとよく呼ばれます。1つまたは複数のコルーチンが同じチャネルに情報を送信でき、1つまたは複数のコルーチンがチャネルからデータを受信できます。

![複数のコルーチンでのチャネルの使用](using-channel-many-coroutines.png)

多くのコルーチンが同じチャネルから情報を受信する場合、各要素はコンシューマーのいずれかによって一度だけ処理されます。要素が処理されると、すぐにチャネルから削除されます。

チャネルは要素のコレクション、より正確にはキューに似ていると考えることができます。キューでは要素が一方の端に追加され、もう一方の端から受信されます。しかし、重要な違いがあります。同期バージョンであってもコレクションとは異なり、チャネルは`send()`および`receive()`操作を_中断_できます。これはチャネルが空であるか、または満杯である場合に発生します。チャネルのサイズに上限がある場合、チャネルは満杯になることがあります。

`Channel`は、`SendChannel`、`ReceiveChannel`、および`Channel`の3つの異なるインターフェースによって表されます。後者は最初の2つを拡張しています。通常、チャネルを作成し、プロデューサーには`SendChannel`インスタンスとして渡して、彼らだけがチャネルに情報を送信できるようにします。コンシューマーには`ReceiveChannel`インスタンスとしてチャネルを渡して、彼らだけがチャネルから受信できるようにします。`send`メソッドと`receive`メソッドは両方とも`suspend`として宣言されています。

```kotlin
interface SendChannel<in E> {
    suspend fun send(element: E)
    fun close(): Boolean
}

interface ReceiveChannel<out E> {
    suspend fun receive(): E
}

interface Channel<E> : SendChannel<E>, ReceiveChannel<E>
```

プロデューサーはチャネルを閉じることができ、これ以上要素が送られてこないことを示します。

ライブラリにはいくつかの種類のチャネルが定義されています。それらは、内部に格納できる要素の数と、`send()`呼び出しが中断できるかどうかで異なります。すべてのチャネルタイプについて、`receive()`呼び出しは同様に動作します。チャネルが空でなければ要素を受信し、そうでない場合は中断されます。

<deflist collapsible="true">
   <def title="無制限チャネル">
       <p>無制限チャネルはキューに最も近いアナログです。プロデューサーはこのチャネルに要素を送信でき、それは無限に成長し続けます。<code>send()</code>呼び出しは決して中断されません。プログラムのメモリが不足した場合、<code>OutOfMemoryException</code>が発生します。無制限チャネルとキューの違いは、コンシューマーが空のチャネルから受信しようとすると、新しい要素が送信されるまで中断されることです。</p>
       <img src="unlimited-channel.png" alt="無制限チャネル" width="500"/>
   </def>
   <def title="バッファ付きチャネル">
       <p>バッファ付きチャネルのサイズは、指定された数によって制限されます。プロデューサーはサイズ制限に達するまでこのチャネルに要素を送信できます。すべての要素は内部に格納されます。チャネルが満杯の場合、次にその上で<code>send</code>呼び出しは、より多くの空きスペースが利用可能になるまで中断されます。</p>
       <img src="buffered-channel.png" alt="バッファ付きチャネル" width="500"/>
   </def>
   <def title="ランデブーチャネル">
       <p>「ランデブー」チャネルは、バッファを持たないチャネルであり、サイズゼロのバッファ付きチャネルと同じです。いずれかの関数（<code>send()</code>または<code>receive()</code>）は、もう一方が呼び出されるまで常に中断されます。 </p>
       <p><code>send()</code>関数が呼び出され、要素を処理する準備ができていない中断された<code>receive()</code>呼び出しがない場合、<code>send()</code>は中断されます。同様に、<code>receive()</code>関数が呼び出され、チャネルが空であるか、言い換えれば要素を送信する準備ができていない中断された<code>send()</code>呼び出しがない場合、<code>receive()</code>呼び出しは中断されます。 </p>
       <p>「ランデブー」という名前（「合意された日時と場所での会合」）は、<code>send()</code>と<code>receive()</code>が「時間通りに会う」べきであるという事実に言及しています。</p>
       <img src="rendezvous-channel.png" alt="ランデブーチャネル" width="500"/>
   </def>
   <def title="コンフレーションチャネル">
       <p>コンフレーションチャネルに送信された新しい要素は、以前に送信された要素を上書きするため、レシーバーは常に最新の要素のみを取得します。<code>send()</code>呼び出しは決して中断されません。</p>
       <img src="conflated-channel.gif" alt="コンフレーションチャネル" width="500"/>
   </def>
</deflist>

チャネルを作成するときは、その型またはバッファサイズ（バッファ付きが必要な場合）を指定します。

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

デフォルトでは、「ランデブー」チャネルが作成されます。

次のタスクでは、「ランデブー」チャネル、2つのプロデューサーコルーチン、および1つのコンシューマーコルーチンを作成します。

```kotlin
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.*

fun main() = runBlocking<Unit> {
    val channel = Channel<String>()
    launch {
        channel.send("A1")
        channel.send("A2")
        log("A done")
    }
    launch {
        channel.send("B1")
        log("B done")
    }
    launch {
        repeat(3) {
            val x = channel.receive()
            log(x)
        }
    }
}

fun log(message: Any?) {
    println("[${Thread.currentThread().name}] $message")
}
```

> チャネルについてより深く理解するには、[このビデオ](https://www.youtube.com/watch?v=HpWQUoVURWQ)をご覧ください。
>
{style="tip"}

### タスク7

`src/tasks/Request7Channels.kt`で、すべてのGitHubコントリビューターを並行してリクエストし、同時に中間進捗を表示する`loadContributorsChannels()`関数を実装します。

以前の関数、`Request5Concurrent.kt`の`loadContributorsConcurrent()`と`Request6Progress.kt`の`loadContributorsProgress()`を使用します。

#### タスク7のヒント {initial-collapse-state="collapsed" collapsible="true"}

異なるリポジトリのコントリビューターリストを並行して受信する異なるコルーチンは、受信したすべての結果を同じチャネルに送信できます。

```kotlin
val channel = Channel<List<User>>()
for (repo in repos) {
    launch {
        val users = TODO()
        // ...
        channel.send(users)
    }
}
```

その後、このチャネルからの要素は1つずつ受信され、処理されます。

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

`receive()`呼び出しは逐次であるため、追加の同期は必要ありません。

#### タスク7のソリューション {initial-collapse-state="collapsed" collapsible="true"}

`loadContributorsProgress()`関数と同様に、`allUsers`変数を`allUsers`のリストの中間状態を格納するために作成し、チャネルから受信した各新しいリストがすべてのユーザーのリストに追加されます。結果を集約し、`updateResults`コールバックを使用して状態を更新します。

```kotlin
suspend fun loadContributorsChannels(
    service: GitHubService,
    req: RequestData,
    updateResults: suspend (List<User>, completed: Boolean) -> Unit
) = coroutineScope {

    val repos = service
        .getOrgRepos(req.org)
        .also { logRepos(req, it) }
        .bodyList()

    val channel = Channel<List<User>>()
    for (repo in repos) {
        launch {
            val users = service.getRepoContributors(req.org, repo.name)
                .also { logUsers(repo, it) }
                .bodyList()
            channel.send(users)
        }
    }
    var allUsers = emptyList<User>()
    repeat(repos.size) {
        val users = channel.receive()
        allUsers = (allUsers + users).aggregate()
        updateResults(allUsers, it == repos.lastIndex)
    }
}
```

*   異なるリポジトリの結果は、準備ができ次第チャネルに追加されます。最初は、すべてのリクエストが送信され、データが受信されていない場合、`receive()`呼び出しは中断されます。この場合、「コントリビューターのロード」コルーチン全体が中断されます。
*   その後、ユーザーのリストがチャネルに送信されると、「コントリビューターのロード」コルーチンは再開され、`receive()`呼び出しはこのリストを返し、結果はすぐに更新されます。

これでプログラムを実行し、_CHANNELS_オプションを選択してコントリビューターをロードし、結果を確認できます。

コルーチンもチャネルも、並行処理に伴う複雑さを完全に排除するわけではありませんが、何が起こっているかを理解する必要がある場合に、それらをより簡単にします。

## コルーチンのテスト

並行コルーチンを使用したソリューションが`suspend`関数を使用したソリューションよりも高速であること、およびチャネルを使用したソリューションがシンプルな「進捗」ソリューションよりも高速であることを確認するために、すべてのソリューションをテストしてみましょう。

次のタスクでは、ソリューションの合計実行時間を比較します。GitHubサービスをモックし、このサービスが指定されたタイムアウト後に結果を返すようにします。

```text
repos request - returns an answer within 1000 ms delay
repo-1 - 1000 ms delay
repo-2 - 1200 ms delay
repo-3 - 800 ms delay
```

`suspend`関数を使用した逐次ソリューションは、約4000ミリ秒かかるはずです（4000 = 1000 + (1000 + 1200 + 800)）。並行ソリューションは、約2200ミリ秒かかるはずです（2200 = 1000 + max(1000, 1200, 800)）。

進捗を表示するソリューションについては、タイムスタンプ付きの中間結果も確認できます。

対応するテストデータは`test/contributors/testData.kt`に定義されており、`Request4SuspendKtTest`、`Request7ChannelsKtTest`などのファイルには、モックサービス呼び出しを使用する簡単なテストが含まれています。

しかし、ここには2つの問題があります。

*   これらのテストは実行に時間がかかりすぎます。各テストには約2〜4秒かかり、毎回結果を待つ必要があります。これはあまり効率的ではありません。
*   ソリューションの正確な実行時間に頼ることはできません。コードの準備と実行に追加の時間がかかるためです。定数を追加することもできますが、その場合、時間はマシンによって異なります。モックサービスの遅延は、違いを確認できるように、この定数よりも高く設定する必要があります。定数が0.5秒の場合、遅延を0.1秒にしても十分ではありません。

より良い方法は、同じコードを複数回実行しながらタイミングをテストするために特別なフレームワークを使用することですが（これにより合計時間はさらに増加します）、学習と設定が複雑です。

これらの問題を解決し、提供されたテスト遅延を持つソリューションが期待どおりに動作することを確認するために、_仮想時間_（virtual time）を特別なテストディスパッチャ（test dispatcher）とともに使用します。このディスパッチャは、開始からの仮想時間の経過を追跡し、すべてをリアルタイムですぐに実行します。このディスパッチャでコルーチンを実行すると、`delay`はすぐに戻り、仮想時間を進めます。

このメカニズムを使用するテストは高速に実行されますが、仮想時間における異なる瞬間に何が起こるかを確認することはできます。合計実行時間は大幅に短縮されます。

![総実行時間の比較](time-comparison.png){width=700}

仮想時間を使用するには、`runBlocking`の呼び出しを`runTest`に置き換えます。`runTest`は、`TestScope`への拡張ラムダを引数として取ります。この特殊なスコープ内で`suspend`関数内の`delay`を呼び出すと、`delay`はリアルタイムで遅延する代わりに仮想時間を増加させます。

```kotlin
@Test
fun testDelayInSuspend() = runTest {
    val realStartTime = System.currentTimeMillis() 
    val virtualStartTime = currentTime
        
    foo()
    println("${System.currentTimeMillis() - realStartTime} ms") // ~ 6 ms
    println("${currentTime - virtualStartTime} ms")             // 1000 ms
}

suspend fun foo() {
    delay(1000)    // auto-advances without delay
    println("foo") // executes eagerly when foo() is called
}
```

`TestScope`の`currentTime`プロパティを使用して、現在の仮想時間を確認できます。

この例での実際の実行時間は数ミリ秒ですが、仮想時間は遅延引数と同じで1000ミリ秒です。

子コルーチンで「仮想」`delay`の完全な効果を得るには、すべての子コルーチンを`TestDispatcher`で開始します。そうしないと機能しません。このディスパッチャは、異なるディスパッチャを提供しない限り、他の`TestScope`から自動的に継承されます。

```kotlin
@Test
fun testDelayInLaunch() = runTest {
    val realStartTime = System.currentTimeMillis()
    val virtualStartTime = currentTime

    bar()

    println("${System.currentTimeMillis() - realStartTime} ms") // ~ 11 ms
    println("${currentTime - virtualStartTime} ms")             // 1000 ms
}

suspend fun bar() = coroutineScope {
    launch {
        delay(1000)    // auto-advances without delay
        println("bar") // executes eagerly when bar() is called
    }
}
```

上の例で`launch`が`Dispatchers.Default`のコンテキストで呼び出された場合、テストは失敗します。ジョブがまだ完了していないことを示す例外が発生します。

`loadContributorsConcurrent()`関数は、`Dispatchers.Default`ディスパッチャを使用して変更することなく、継承されたコンテキストで子コルーチンを開始する場合にのみ、このようにテストできます。

ディスパッチャなどのコンテキスト要素は、関数を_定義する_ときではなく、_呼び出す_ときに指定できます。これにより、柔軟性が向上し、テストが容易になります。

> 仮想時間をサポートするテストAPIは[実験的](components-stability.md)であり、将来変更される可能性があります。
>
{style="warning"}

デフォルトでは、実験的なテストAPIを使用するとコンパイラは警告を表示します。これらの警告を抑制するには、テスト関数またはテストを含むクラス全体に`@OptIn(ExperimentalCoroutinesApi::class)`アノテーションを付けます。コンパイラに実験的APIを使用していることを指示するコンパイラ引数を追加します。

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

このチュートリアルに対応するプロジェクトでは、コンパイラ引数はすでにGradleスクリプトに追加されています。

### タスク8

`tests/tasks/`にある以下のテストを、リアルタイムではなく仮想時間を使用するようにリファクタリングしてください。

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

リファクタリング適用前と後の総実行時間を比較してください。

#### タスク8のヒント {initial-collapse-state="collapsed" collapsible="true"}

1.  `runBlocking`の呼び出しを`runTest`に置き換え、`System.currentTimeMillis()`を`currentTime`に置き換えます。

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  正確な仮想時間を確認するアサーションのコメントを解除します。
3.  `@UseExperimental(ExperimentalCoroutinesApi::class)`の追加を忘れないでください。

#### タスク8のソリューション {initial-collapse-state="collapsed" collapsible="true"}

以下は、並行ケースとチャネルケースのソリューションです。

```kotlin
fun testConcurrent() = runTest {
    val startTime = currentTime
    val result = loadContributorsConcurrent(MockGithubService, testRequestData)
    Assert.assertEquals("Wrong result for 'loadContributorsConcurrent'", expectedConcurrentResults.users, result)
    val totalTime = currentTime - startTime

    Assert.assertEquals(
        "The calls run concurrently, so the total virtual time should be 2200 ms: " +
                "1000 for repos request plus max(1000, 1200, 800) = 1200 for concurrent contributors requests)",
        expectedConcurrentResults.timeFromStart, totalTime
    )
}
```

まず、結果が期待される仮想時間に正確に利用可能であることを確認し、次に結果自体を確認します。

```kotlin
fun testChannels() = runTest {
    val startTime = currentTime
    var index = 0
    loadContributorsChannels(MockGithubService, testRequestData) { users, _ ->
        val expected = concurrentProgressResults[index++]
        val time = currentTime - startTime
        Assert.assertEquals(
            "Expected intermediate results after ${expected.timeFromStart} ms:",
            expected.timeFromStart, time
        )
        Assert.assertEquals("Wrong intermediate results after $time:", expected.users, users)
    }
}
```

チャネルを使用した最後のバージョンの中間結果は、プログレスバージョンよりも早く利用可能になり、仮想時間を使用するテストでその違いを確認できます。

> 残りの「suspend」および「progress」タスクのテストも非常によく似ています。それらはプロジェクトの`solutions`ブランチで見つけることができます。
>
{style="tip"}

## 次のステップ

*   KotlinConfの[Kotlinによる非同期プログラミング](https://kotlinconf.com/workshops/)ワークショップをチェックしてください。
*   [仮想時間と実験的なテストパッケージ](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)の使用についてさらに詳しく調べてください。