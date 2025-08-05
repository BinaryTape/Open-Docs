<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: コルーチンとチャネル − チュートリアル)

このチュートリアルでは、IntelliJ IDEA でコルーチンを使用して、基になるスレッドやコールバックをブロックせずにネットワークリクエストを実行する方法を学びます。

> コルーチンに関する事前の知識は不要ですが、Kotlin の基本的な構文に精通していることが求められます。
>
{style="tip"}

学ぶこと：

*   サスペンド関数を使用してネットワークリクエストを実行する理由と方法。
*   コルーチンを使用してリクエストを並行して送信する方法。
*   チャネルを使用して異なるコルーチン間で情報を共有する方法。

ネットワークリクエストには [Retrofit](https://square.github.io/retrofit/) ライブラリが必要ですが、このチュートリアルで示すアプローチは、コルーチンをサポートする他のライブラリでも同様に機能します。

> すべてのタスクの解決策は、[プロジェクトのリポジトリ](http://github.com/kotlin-hands-on/intro-coroutines)の `solutions` ブランチにあります。
>
{style="tip"}

## 始める前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) の最新バージョンをダウンロードしてインストールします。
2.  ウェルカム画面で **Get from VCS** を選択するか、**File | New | Project from Version Control** を選択して、[プロジェクトテンプレート](http://github.com/kotlin-hands-on/intro-coroutines)をクローンします。

    コマンドラインからクローンすることもできます：

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### GitHub 開発者トークンを生成する

プロジェクトで GitHub API を使用します。アクセスするには、GitHub アカウント名とパスワードまたはトークンを提供する必要があります。二段階認証を有効にしている場合は、トークンだけで十分です。

[あなたのアカウント](https://github.com/settings/tokens/new)で GitHub API を使用するための新しい GitHub トークンを生成します：

1.  トークンの名前を指定します。例えば、`coroutines-tutorial`：

    ![Generate a new GitHub token](generating-token.png){width=700}

2.  スコープは何も選択しないでください。ページの下部にある **Generate token** をクリックします。
3.  生成されたトークンをコピーします。

### コードを実行する

このプログラムは、指定された組織（デフォルトでは「kotlin」と命名）の下にあるすべてのリポジトリのコントリビューターをロードします。後で、ユーザーを貢献数でソートするロジックを追加します。

1.  `src/contributors/main.kt` ファイルを開き、`main()` 関数を実行します。次のウィンドウが表示されます：

    ![First window](initial-window.png){width=500}

    フォントが小さすぎる場合は、`main()` 関数内の `setDefaultFontSize(18f)` の値を変更して調整してください。

2.  対応するフィールドに GitHub のユーザー名とトークン（またはパスワード）を入力します。
3.  _Variant_ ドロップダウンメニューで _BLOCKING_ オプションが選択されていることを確認します。
4.  _Load contributors_ をクリックします。UI がしばらくフリーズし、その後コントリビューターのリストが表示されます。
5.  プログラムの出力を開き、データがロードされたことを確認します。コントリビューターのリストは、各リクエストが成功するたびにログに記録されます。

このロジックを実装する方法はいくつかあります。例えば、[ブロッキングリクエスト](#blocking-requests)や[コールバック](#callbacks)を使用する方法です。これらの解決策を[コルーチン](#coroutines)を使用する解決策と比較し、[チャネル](#channels)を使用して異なるコルーチン間で情報を共有する方法を確認します。

## ブロッキングリクエスト

GitHub への HTTP リクエストを実行するために、[Retrofit](https://square.github.io/retrofit/) ライブラリを使用します。これにより、指定された組織の下にあるリポジトリのリストと、各リポジトリのコントリビューターのリストをリクエストできます。

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

この API は `loadContributorsBlocking()` 関数によって使用され、指定された組織のコントリビューターのリストをフェッチします。

1.  `src/tasks/Request1Blocking.kt` を開いてその実装を確認します：

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

    *   まず、指定された組織の下にあるリポジトリのリストを取得し、`repos` リストに保存します。次に、各リポジトリに対してコントリビューターのリストをリクエストし、すべてのリストを1つの最終的なコントリビューターリストにマージします。
    *   `getOrgReposCall()` と `getRepoContributorsCall()` はどちらも `*Call` クラスのインスタンスを返します (`#1`)。この時点では、リクエストは送信されません。
    *   `*Call.execute()` が呼び出されてリクエストが実行されます (`#2`)。`execute()` は基になるスレッドをブロックする同期呼び出しです。
    *   応答を受け取ると、特定の `logRepos()` と `logUsers()` 関数を呼び出して結果がログに記録されます (`#3`)。HTTP 応答にエラーが含まれている場合、このエラーはここにログに記録されます。
    *   最後に、必要なデータを含む応答の本文を取得します。このチュートリアルでは、エラーが発生した場合の戻り値として空のリストを使用し、対応するエラーをログに記録します (`#4`)。

2.  `.body() ?: emptyList()` の繰り返しを避けるため、拡張関数 `bodyList()` が宣言されています：

    ```kotlin
    fun <T> Response<List<T>>.bodyList(): List<T> {
        return body() ?: emptyList()
    }
    ```

3.  プログラムを再度実行し、IntelliJ IDEA のシステム出力を確認します。次のような内容が表示されるはずです：

    ```text
    1770 [AWT-EventQueue-0] INFO  Contributors - kotlin: loaded 40 repos
    2025 [AWT-EventQueue-0] INFO  Contributors - kotlin-examples: loaded 23 contributors
    2229 [AWT-EventQueue-0] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    ```

    *   各行の最初の項目は、プログラム開始からのミリ秒数、次に角括弧内のスレッド名です。ロードリクエストがどのスレッドから呼び出されたかを確認できます。
    *   各行の最後の項目は、実際のアメッセージです。ロードされたリポジトリまたはコントリビューターの数を示します。

    このログ出力は、すべての結果がメインスレッドからログに記録されたことを示しています。`_BLOCKING_` オプションでコードを実行すると、UI はフリーズし、ロードが完了するまで入力に反応しません。すべてのリクエストは `loadContributorsBlocking()` が呼び出されたスレッドと同じスレッド（Swing では AWT イベントディスパッチスレッド）から実行され、このメインスレッドがブロックされるため、UI がフリーズします：

    ![The blocked main thread](blocking.png){width=700}

    コントリビューターのリストがロードされた後、結果が更新されます。

4.  `src/contributors/Contributors.kt` で、コントリビューターのロード方法を選択する `loadContributors()` 関数を見つけ、`loadContributorsBlocking()` がどのように呼び出されているかを確認します：

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` の呼び出しは `loadContributorsBlocking()` の呼び出しのすぐ後に行われます。
    *   `updateResults()` は UI を更新するため、常に UI スレッドから呼び出す必要があります。
    *   `loadContributorsBlocking()` も UI スレッドから呼び出されるため、UI スレッドがブロックされ、UI がフリーズします。

### タスク 1

最初のタスクは、タスクドメインに慣れるのに役立ちます。現在、各コントリビューターの名前は、参加したすべてのプロジェクトで複数回繰り返されています。各コントリビューターが一度だけ追加されるように、ユーザーを結合する `aggregate()` 関数を実装してください。`User.contributions` プロパティには、指定されたユーザーの**すべての**プロジェクトへの総貢献数が含まれるべきです。結果のリストは、貢献数の降順でソートされるべきです。

`src/tasks/Aggregation.kt` を開き、`List<User>.aggregate()` 関数を実装してください。ユーザーは総貢献数でソートされるべきです。

対応するテストファイル `test/tasks/AggregationKtTest.kt` には、期待される結果の例が示されています。

> [IntelliJ IDEA のショートカット](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation) `Ctrl+Shift+T` / `⇧ ⌘ T` を使用して、ソースコードとテストクラス間を自動的にジャンプできます。
>
{style="tip"}

このタスクを実装した後、「kotlin」組織の結果リストは次のようになるはずです：

![The list for the "kotlin" organization](aggregate.png){width=500}

#### タスク 1 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

1.  ユーザーをログイン名でグループ化するには、[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) を使用します。これは、ログイン名から、このログイン名を持つユーザーの異なるリポジトリでのすべての出現へのマップを返します。
2.  各マップエントリに対して、各ユーザーの総貢献数をカウントし、指定された名前と総貢献数を持つ `User` クラスの新しいインスタンスを作成します。
3.  結果のリストを降順にソートします：

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

代替の解決策として、`groupBy()` の代わりに [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 関数を使用することもできます。

## コールバック

前の解決策は機能しますが、スレッドをブロックするため、UI をフリーズさせます。これを回避する伝統的なアプローチは、_コールバック_ を使用することです。

操作が完了した直後に呼び出されるべきコードを呼び出す代わりに、それを別のコールバック（多くの場合ラムダ）に抽出し、後で呼び出すためにそのラムダを呼び出し元に渡すことができます。

UI を応答性のある状態にするには、計算全体を別のスレッドに移動するか、ブロッキング呼び出しの代わりにコールバックを使用する Retrofit API に切り替えるかのいずれかです。

### バックグラウンドスレッドを使用する

1.  `src/tasks/Request2Background.kt` を開いて、その実装を確認します。まず、計算全体が別のスレッドに移動されます。`thread()` 関数は新しいスレッドを開始します：

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    これで、すべてのロードが別のスレッドに移動されたため、メインスレッドは空きになり、他のタスクで使用できるようになります：

    ![The freed main thread](background.png){width=700}

2.  `loadContributorsBackground()` 関数のシグネチャが変更されます。すべてのロードが完了した後に呼び出すために、`updateResults()` コールバックを最後の引数として取ります：

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  `loadContributorsBackground()` が呼び出されると、`updateResults()` の呼び出しは以前のように直後ではなく、コールバック内で行われます：

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    `SwingUtilities.invokeLater` を呼び出すことで、結果を更新する `updateResults()` の呼び出しがメイン UI スレッド (AWT イベントディスパッチスレッド) で行われることを保証します。

ただし、`BACKGROUND` オプションを介してコントリビューターをロードしようとすると、リストは更新されますが、何も変更されないことがわかります。

### タスク 2

`src/tasks/Request2Background.kt` の `loadContributorsBackground()` 関数を修正し、結果のリストが UI に表示されるようにします。

#### タスク 2 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

コントリビューターをロードしようとすると、ログにコントリビューターがロードされたことが示されますが、結果は表示されません。これを修正するには、結果のユーザーリストで `updateResults()` を呼び出します：

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

コールバックで渡されたロジックを明示的に呼び出すことを確認してください。そうしないと何も起こりません。

### Retrofit コールバック API を使用する

前の解決策では、すべてのロードロジックがバックグラウンドスレッドに移動されましたが、それでもリソースの最適な使用法ではありません。すべてのロードリクエストは順次実行され、ロード結果を待つ間スレッドがブロックされますが、他のタスクで使用することもできました。具体的には、スレッドは別のリクエストのロードを開始して、全体の結果をより早く受け取ることができました。

各リポジトリのデータを処理することは、ロードと結果応答の処理の 2 つの部分に分ける必要があります。2 番目の_処理_部分は、コールバックに抽出する必要があります。

各リポジトリのロードは、前のリポジトリの結果が受信される前（および対応するコールバックが呼び出される前）に開始できます：

![Using callback API](callbacks.png){width=700}

Retrofit コールバック API がこれを実現するのに役立ちます。`Call.enqueue()` 関数は HTTP リクエストを開始し、引数としてコールバックを取ります。このコールバックでは、各リクエスト後に何をする必要があるかを指定する必要があります。

`src/tasks/Request3Callbacks.kt` を開いて、この API を使用する `loadContributorsCallbacks()` の実装を確認します：

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

*   便宜上、このコードフラグメントは同じファイルで宣言されている `onResponse()` 拡張関数を使用しています。これはオブジェクト式ではなく、ラムダを引数として取ります。
*   応答を処理するロジックはコールバックに抽出されています。対応するラムダは行 `#1` と `#2` から始まります。

しかし、提供された解決策は機能しません。プログラムを実行し、_CALLBACKS_ オプションを選択してコントリビューターをロードしても、何も表示されません。しかし、`Request3CallbacksKtTest` のテストはすぐに結果を返し、正常に合格したと表示されます。

与えられたコードが期待どおりに機能しない理由を考えて、それを修正してみてください。または、以下の解決策を参照してください。

### タスク 3 (オプション)

`src/tasks/Request3Callbacks.kt` ファイルのコードを書き直し、ロードされたコントリビューターのリストが表示されるようにします。

#### タスク 3 の最初の試み解決策 {initial-collapse-state="collapsed" collapsible="true"}

現在のソリューションでは、多くのリクエストが並行して開始され、全体のロード時間が短縮されます。しかし、結果はロードされません。これは、`updateResults()` コールバックがすべてのロードリクエストが開始された直後に呼び出され、`allUsers` リストにデータがまだ入力されていないためです。

次のように変更してこれを修正してみることができます：

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

*   まず、インデックス付きでリポジトリのリストをイテレートします (`#1`)。
*   次に、各コールバックから、それが最後のイテレーションであるかどうかを確認します (`#2`)。
*   そして、そうである場合は、結果が更新されます。

しかし、このコードも目的を達成できません。自分で答えを見つけるか、以下の解決策を参照してください。

#### タスク 3 の 2 番目の試み解決策 {initial-collapse-state="collapsed" collapsible="true"}

ロードリクエストは並行して開始されるため、最後のリクエストの結果が最後に届く保証はありません。結果は任意の順序で届く可能性があります。

したがって、完了条件として現在のインデックスを `lastIndex` と比較すると、一部のリポジトリの結果を失うリスクがあります。

もし最後のリポジトリを処理するリクエストが以前のいくつかのリクエストよりも早く返された場合（これは起こり得ます）、より時間がかかるリクエストのすべての結果は失われます。

これを修正する1つの方法は、インデックスを導入し、すべてのリポジトリがすでに処理されたかどうかを確認することです：

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

このコードは、同期バージョンのリストと `AtomicInteger()` を使用しています。なぜなら、一般に、`getRepoContributors()` リクエストを処理する異なるコールバックが常に同じスレッドから呼び出される保証がないからです。

#### タスク 3 の 3 番目の試み解決策 {initial-collapse-state="collapsed" collapsible="true"}

さらに良い解決策は、`CountDownLatch` クラスを使用することです。これは、リポジトリの数で初期化されたカウンターを保持します。このカウンターは、各リポジトリを処理した後でデクリメントされます。そして、ラッチがゼロにカウントダウンされるまで待機してから結果を更新します：

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

これら 3 つの解決策の試みを確認すると、コールバックで正しいコードを書くことは、特に複数の基になるスレッドと同期が発生する場合に、非自明でエラーが発生しやすいことがわかります。

> 追加の演習として、RxJava ライブラリを使用してリアクティブなアプローチで同じロジックを実装することもできます。必要なすべての依存関係と RxJava を使用するための解決策は、別の `rx` ブランチにあります。このチュートリアルを完了し、適切な比較のために提案された Rx バージョンを実装または確認することも可能です。
>
{style="tip"}

## サスペンド関数

同じロジックをサスペンド関数を使用して実装できます。`Call<List<Repo>>` を返す代わりに、API 呼び出しを[サスペンド関数](composing-suspending-functions.md)として次のように定義します：

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()` は `suspend` 関数として定義されています。サスペンド関数を使用してリクエストを実行する場合、基になるスレッドはブロックされません。この仕組みの詳細については、後続のセクションで説明します。
*   `getOrgRepos()` は `Call` を返す代わりに直接結果を返します。結果が失敗した場合は、例外がスローされます。

あるいは、Retrofit は結果を `Response` でラップして返すこともできます。この場合、結果ボディが提供され、手動でエラーをチェックすることが可能です。このチュートリアルでは、`Response` を返すバージョンを使用します。

`src/contributors/GitHubService.kt` に、`GitHubService` インターフェースに次の宣言を追加します：

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

### タスク 4

あなたのタスクは、コントリビューターをロードする関数のコードを変更して、2 つの新しいサスペンド関数 `getOrgRepos()` と `getRepoContributors()` を使用することです。新しい `loadContributorsSuspend()` 関数は、新しい API を使用するために `suspend` とマークされています。

> サスペンド関数はどこからでも呼び出せるわけではありません。`loadContributorsBlocking()` からサスペンド関数を呼び出すと、「Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function」というメッセージのエラーが発生します。
>
{style="note"}

1.  `src/tasks/Request1Blocking.kt` で定義されている `loadContributorsBlocking()` の実装を、`src/tasks/Request4Suspend.kt` で定義されている `loadContributorsSuspend()` にコピーします。
2.  `Call` を返す関数ではなく、新しいサスペンド関数が使用されるようにコードを修正します。
3.  _SUSPEND_ オプションを選択してプログラムを実行し、GitHub リクエストが実行されている間も UI が応答性があることを確認します。

#### タスク 4 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

`.getOrgReposCall(req.org).execute()` を `.getOrgRepos(req.org)` に置き換え、2 番目の「コントリビューター」リクエストについても同じ置き換えを繰り返します。

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

*   `loadContributorsSuspend()` は `suspend` 関数として定義する必要があります。
*   以前 `Response` を返していた `execute` を呼び出す必要はなくなりました。なぜなら、API 関数が直接 `Response` を返すようになったからです。この詳細は Retrofit ライブラリに特有のものであることに注意してください。他のライブラリでは API は異なりますが、概念は同じです。

## コルーチン

サスペンド関数を使ったコードは、「ブロッキング」バージョンと似ています。ブロッキングバージョンとの大きな違いは、スレッドをブロックする代わりに、コルーチンがサスペンドされる点です。

```text
ブロック -> サスペンド
スレッド -> コルーチン
```

> コルーチンは、スレッド上でコードを実行するのと同様にコルーチン上でコードを実行できるため、しばしば軽量スレッドと呼ばれます。以前はブロックされていた（そして避ける必要があった）操作は、代わりにコルーチンをサスペンドできるようになりました。
>
{style="note"}

### 新しいコルーチンの開始

`src/contributors/Contributors.kt` で `loadContributorsSuspend()` がどのように使われているかを見ると、`launch` の内部で呼び出されていることがわかります。`launch` はラムダを引数として取るライブラリ関数です。

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

ここで `launch` は、データのロードと結果の表示を担当する新しい計算を開始します。この計算はサスペンド可能で、ネットワークリクエストを実行している間はサスペンドされ、基になるスレッドを解放します。ネットワークリクエストが結果を返すと、計算は再開されます。

このようなサスペンド可能な計算は _コルーチン_ と呼ばれます。したがって、この場合、`launch` はデータをロードして結果を表示する新しいコルーチンを _開始します_。

コルーチンはスレッド上で実行され、サスペンドすることができます。コルーチンがサスペンドされると、対応する計算は一時停止され、スレッドから削除されてメモリに保存されます。その間、スレッドは他のタスクに占有されることができます：

![Suspending coroutines](suspension-process.gif){width=700}

計算の続行準備ができると、それはスレッド（必ずしも同じスレッドとは限らない）に戻されます。

`loadContributorsSuspend()` の例では、各「コントリビューター」リクエストは、サスペンションメカニズムを使用して結果を待機します。まず、新しいリクエストが送信されます。次に、応答を待っている間、`launch` 関数によって開始された「コントリビューターをロードする」コルーチン全体がサスペンドされます。

コルーチンは、対応する応答が受信された後にのみ再開されます。

![Suspending request](suspend-requests.png){width=700}

応答の受信を待っている間、スレッドは他のタスクに占有されることができます。すべてのリクエストがメイン UI スレッドで実行されているにもかかわらず、UI は応答性を維持します。

1.  _SUSPEND_ オプションを使用してプログラムを実行します。ログは、すべてのリクエストがメイン UI スレッドに送信されていることを確認します：

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  ログは、対応するコードがどのコルーチンで実行されているかを表示できます。これを有効にするには、**Run | Edit configurations** を開き、`-Dkotlinx.coroutines.debug` VM オプションを追加します：

    ![Edit run configuration](run-configuration.png){width=500}

    このオプションで `main()` を実行すると、コルーチン名がスレッド名に付加されます。また、すべての Kotlin ファイルを実行するためのテンプレートを変更し、このオプションをデフォルトで有効にすることもできます。

これで、すべてのコードは単一のコルーチン、上記の「コントリビューターをロードする」コルーチン、`@coroutine#1` で実行されます。結果を待っている間、コードが順次書かれているため、スレッドを他のリクエストの送信に再利用すべきではありません。新しいリクエストは、前の結果が受信された後にのみ送信されます。

サスペンド関数はスレッドを公平に扱い、「待機」のためにブロックすることはありません。しかし、これはまだ並行性をもたらしていません。

## 並行性

Kotlin のコルーチンはスレッドよりもはるかにリソース集約的ではありません。新しい計算を非同期に開始したいときはいつでも、新しいコルーチンを作成できます。

新しいコルーチンを開始するには、主要な_コルーチンビルダー_のいずれか、`launch`、`async`、または `runBlocking` を使用します。異なるライブラリは追加のコルーチンビルダーを定義できます。

`async` は新しいコルーチンを開始し、`Deferred` オブジェクトを返します。`Deferred` は `Future` や `Promise` などの他の名前で知られる概念を表します。これは計算を保存しますが、最終結果を取得するタイミングを_遅延させます_。つまり、_将来_のある時点で結果を_約束します_。

`async` と `launch` の主な違いは、`launch` が特定の結果を返すことを期待されない計算を開始するために使用されることです。`launch` はコルーチンを表す `Job` を返します。`Job.join()` を呼び出すことで、完了するまで待機することが可能です。

`Deferred` は `Job` を継承するジェネリック型です。`async` 呼び出しは、ラムダが何を返すか（ラムダ内の最後の式が結果）に応じて、`Deferred<Int>` または `Deferred<CustomType>` を返すことができます。

コルーチンの結果を取得するには、`Deferred` インスタンスで `await()` を呼び出すことができます。結果を待つ間、この `await()` が呼び出されたコルーチンはサスペンドされます。

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

`runBlocking` は通常の関数とサスペンド関数との間の、あるいはブロッキングと非ブロッキングの世界との間の架け橋として使用されます。これは、トップレベルのメインコルーチンを開始するためのアダプターとして機能します。主に `main()` 関数やテストでの使用を意図しています。

> コルーチンをよりよく理解するために、[このビデオ](https://www.youtube.com/watch?v=zEZc5AmHQhk)をご覧ください。
>
{style="tip"}

遅延オブジェクトのリストがある場合、`awaitAll()` を呼び出して、それらすべての結果を待機できます。

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

各「コントリビューター」リクエストが新しいコルーチンで開始されると、すべてのリクエストが非同期に開始されます。新しいリクエストは、前のリクエストの結果が受信される前に送信できます。

![Concurrent coroutines](concurrency.png){width=700}

合計ロード時間は _CALLBACKS_ バージョンとほぼ同じですが、コールバックは不要です。さらに、`async` はコード内でどの部分が並行して実行されるかを明確に強調します。

### タスク 5

`Request5Concurrent.kt` ファイルで、以前の `loadContributorsSuspend()` 関数を使用して `loadContributorsConcurrent()` 関数を実装します。

#### タスク 5 のヒント {initial-collapse-state="collapsed" collapsible="true"}

コルーチンはコルーチンスコープ内でしか開始できません。`loadContributorsSuspend()` の内容を `coroutineScope` 呼び出しにコピーして、そこで `async` 関数を呼び出せるようにします。

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService,
    req: RequestData
): List<User> = coroutineScope {
    // ...
}
```

以下のスキームに基づいて解決策を作成してください：

```kotlin
val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
    async {
        // load contributors for each repo
    }
}
deferreds.awaitAll() // List<List<User>>
```

#### タスク 5 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

各「コントリビューター」リクエストを `async` でラップして、リポジトリの数だけコルーチンを作成します。`async` は `Deferred<List<User>>` を返します。これは問題ありません。なぜなら、新しいコルーチンの作成はリソース集約的ではないため、必要なだけ作成できるからです。

1.  `flatMap` はもう使えません。なぜなら、`map` の結果はリストのリストではなく、`Deferred` オブジェクトのリストになったからです。`awaitAll()` は `List<List<User>>` を返すので、`flatten().aggregate()` を呼び出して結果を取得します。

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

2.  コードを実行し、ログを確認します。マルチスレッド処理はまだ採用されていませんが、すべてのコルーチンがメイン UI スレッドで実行されていることがわかりますが、コルーチンを並行して実行することの利点はすでに確認できます。
3.  このコードを変更して、共通スレッドプールから異なるスレッドで「コントリビューター」コルーチンを実行するには、`async` 関数のコンテキスト引数として `Dispatchers.Default` を指定します。

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher` は、対応するコルーチンがどのスレッドで実行されるべきかを決定します。引数として指定しない場合、`async` は外側のスコープからディスパッチャーを使用します。
    *   `Dispatchers.Default` は JVM 上の共有スレッドプールを表します。このプールは並列実行の手段を提供します。利用可能な CPU コアの数と同じ数のスレッドで構成されますが、コアが1つしかない場合でも2つのスレッドを持ちます。

4.  `loadContributorsConcurrent()` 関数のコードを修正して、共通スレッドプールから異なるスレッドで新しいコルーチンを開始するようにします。また、リクエストを送信する前に追加のログを追加します。

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  プログラムをもう一度実行します。ログでは、各コルーチンがスレッドプールから1つのスレッドで開始され、別のスレッドで再開されることがわかります。

    ```text
    1946 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    1946 [DefaultDispatcher-worker-3 @coroutine#5] INFO  Contributors - starting loading for dokka
    1946 [DefaultDispatcher-worker-1 @coroutine#3] INFO  Contributors - starting loading for ts2kt
    ...
    2178 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    2569 [DefaultDispatcher-worker-1 @coroutine#5] INFO  Contributors - dokka: loaded 36 contributors
    2821 [DefaultDispatcher-worker-2 @coroutine#3] INFO  Contributors - ts2kt: loaded 11 contributors
    ```

    たとえば、このログ抜粋では、`coroutine#4` は `worker-2` スレッドで開始され、`worker-1` スレッドで継続されています。

`src/contributors/Contributors.kt` で、_CONCURRENT_ オプションの実装を確認します。

1.  コルーチンをメイン UI スレッドでのみ実行するには、`Dispatchers.Main` を引数として指定します。

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   メインスレッドがビジー状態のときに新しいコルーチンをそのスレッドで開始すると、コルーチンはサスペンドされ、そのスレッドでの実行がスケジュールされます。コルーチンはスレッドが空きになるまで再開されません。
    *   各エンドポイントで明示的にディスパッチャーを指定するよりも、外側のスコープからディスパッチャーを使用するのが良いプラクティスとされています。`loadContributorsConcurrent()` を `Dispatchers.Default` を引数として渡さずに定義した場合、この関数を任意のコンテキストで呼び出すことができます。`Default` ディスパッチャー、メイン UI スレッド、またはカスタムディスパッチャーを使用できます。
    *   後で説明するように、テストから `loadContributorsConcurrent()` を呼び出す場合、`TestDispatcher` のコンテキストで呼び出すことができ、これによりテストが簡素化されます。これにより、この解決策ははるかに柔軟になります。

2.  呼び出し元側でディスパッチャーを指定するには、`loadContributorsConcurrent` が継承されたコンテキストでコルーチンを開始できるようにプロジェクトに次の変更を適用します：

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` はメイン UI スレッドで呼び出す必要があるため、`Dispatchers.Main` のコンテキストで呼び出します。
    *   `withContext()` は、指定されたコルーチンコンテキストで与えられたコードを呼び出し、完了するまでサスペンドされ、結果を返します。これを表現するもう一つの方法として、新しいコルーチンを開始し、完了するまで明示的に待機（サスペンド）するという、より冗長な方法があります：`launch(context) { ... }.join()`。

3.  コードを実行し、コルーチンがスレッドプールからスレッド上で実行されることを確認します。

## 構造化並行性

*   _コルーチンスコープ_は、異なるコルーチン間の構造と親子関係を担当します。新しいコルーチンは通常、スコープ内で開始する必要があります。
*   _コルーチンコンテキスト_は、コルーチンのカスタム名や、コルーチンがスケジュールされるスレッドを指定するディスパッチャーなど、特定のコルーチンを実行するために使用される追加の技術情報を格納します。

`launch`、`async`、または `runBlocking` を使用して新しいコルーチンを開始すると、それらは自動的に対応するスコープを作成します。これらの関数はすべてレシーバー付きラムダを引数として取り、`CoroutineScope` は暗黙的なレシーバー型です。

```kotlin
launch { /* this: CoroutineScope */ }
```

*   新しいコルーチンはスコープ内でのみ開始できます。
*   `launch` と `async` は `CoroutineScope` の拡張として宣言されているため、呼び出す際には常に暗黙的または明示的なレシーバーを渡す必要があります。
*   `runBlocking` によって開始されたコルーチンは唯一の例外です。なぜなら、`runBlocking` はトップレベル関数として定義されているからです。しかし、これは現在のスレッドをブロックするため、主に `main()` 関数やテストでブリッジ関数として使用することを目的としています。

`runBlocking`、`launch`、`async` の内部で新しいコルーチンは自動的にスコープ内で開始されます。

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

`runBlocking` 内で `launch` を呼び出すと、それは `CoroutineScope` 型の暗黙的なレシーバーの拡張として呼び出されます。あるいは、明示的に `this.launch` と書くこともできます。

ネストされたコルーチン（この例では `launch` によって開始されたもの）は、外側のコルーチン（`runBlocking` によって開始されたもの）の子と見なすことができます。この「親子」関係はスコープを介して機能します。子コルーチンは親コルーチンに対応するスコープから開始されます。

`coroutineScope` 関数を使用して、新しいコルーチンを開始せずに新しいスコープを作成することが可能です。`suspend` 関数内で外側のスコープにアクセスせずに構造化された方法で新しいコルーチンを開始するには、`suspend` 関数が呼び出された外側のスコープの子として自動的になる新しいコルーチンスコープを作成できます。`loadContributorsConcurrent()` は良い例です。

`GlobalScope.async` や `GlobalScope.launch` を使用して、グローバルスコープから新しいコルーチンを開始することもできます。これにより、トップレベルの「独立した」コルーチンが作成されます。

コルーチンの構造の背後にあるメカニズムは、_構造化並行性_と呼ばれます。これはグローバルスコープと比較して以下の利点を提供します。

*   スコープは通常、子のコルーチンを管理し、そのライフタイムはスコープのライフタイムに結びつけられます。
*   何らかの異常が発生した場合や、ユーザーが心変わりして操作を取り消すことにした場合、スコープは子のコルーチンを自動的にキャンセルできます。
*   スコープは、すべての子コルーチンの完了を自動的に待ちます。したがって、スコープがコルーチンに対応する場合、そのスコープで起動されたすべてのコルーチンが完了するまで、親コルーチンは完了しません。

`GlobalScope.async` を使用する場合、いくつかのコルーチンをより小さなスコープにバインドする構造はありません。グローバルスコープから開始されたコルーチンはすべて独立しており、そのライフタイムはアプリケーション全体のライフタイムによってのみ制限されます。グローバルスコープから開始されたコルーチンへの参照を保存し、その完了を待つか、明示的にキャンセルすることは可能ですが、構造化並行性の場合のように自動的には行われません。

### コントリビューターのロードをキャンセルする

コントリビューターのリストをロードする関数の2つのバージョンを作成します。親コルーチンをキャンセルしようとしたときに、両方のバージョンがどのように動作するかを比較します。最初のバージョンは `coroutineScope` を使用してすべての子コルーチンを開始し、2番目のバージョンは `GlobalScope` を使用します。

1.  `Request5Concurrent.kt` に、`loadContributorsConcurrent()` 関数に 3 秒の遅延を追加します。

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

    この遅延は、リクエストを送信するすべてのコルーチンに影響を与えるため、コルーチンが開始された後、リクエストが送信される前にロードをキャンセルするのに十分な時間があります。

2.  ロード関数の2番目のバージョンを作成します。`loadContributorsConcurrent()` の実装を `Request5NotCancellable.kt` の `loadContributorsNotCancellable()` にコピーし、新しい `coroutineScope` の作成を削除します。
3.  `async` 呼び出しは解決に失敗するため、`GlobalScope.async` を使用して開始します。

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

    *   この関数は、ラムダ内の最後の式としてではなく、直接結果を返します（行 `#1` と `#3`）。
    *   すべての「コントリビューター」コルーチンは、コルーチンスコープの子としてではなく、`GlobalScope` 内で開始されます（行 `#2`）。

4.  プログラムを実行し、_CONCURRENT_ オプションを選択してコントリビューターをロードします。
5.  すべての「コントリビューター」コルーチンが開始されるまで待機し、_Cancel_ をクリックします。ログには新しい結果が表示されず、すべてのリクエストが実際にキャンセルされたことを意味します。

    ```text
    2896 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 40 repos
    2901 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2909 [DefaultDispatcher-worker-5 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* 'cancel' をクリック */
    /* リクエストは送信されない */
    ```

6.  ステップ 5 を繰り返しますが、今回は `NOT_CANCELLABLE` オプションを選択します。

    ```text
    2570 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2579 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2586 [DefaultDispatcher-worker-6 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* 'cancel' をクリック */
    /* しかし、すべてのリクエストはまだ送信されている: */
    6402 [DefaultDispatcher-worker-5 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    9555 [DefaultDispatcher-worker-8 @coroutine#36] INFO  Contributors - mpp-example: loaded 8 contributors
    ```

    この場合、コルーチンはキャンセルされず、すべてのリクエストは引き続き送信されます。

7.  「コントリビューター」プログラムでキャンセルがどのようにトリガーされるかを確認します。_Cancel_ ボタンがクリックされると、メインの「ローディング」コルーチンが明示的にキャンセルされ、子コルーチンが自動的にキャンセルされます。

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

`launch` 関数は `Job` のインスタンスを返します。`Job` は、すべてのデータをロードし、結果を更新する「ローディングコルーチン」への参照を格納します。`setUpCancellation()` 拡張関数をレシーバーとして `Job` のインスタンスを渡して呼び出すことができます（行 `#1`）。

これを表現する別の方法は、明示的に次のように書くことです。

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   可読性を高めるために、関数内で `setUpCancellation()` 関数のレシーバーを新しい `loadingJob` 変数で参照できます（行 `#2`）。
*   次に、_Cancel_ ボタンにリスナーを追加して、クリックされたときに `loadingJob` がキャンセルされるようにします（行 `#3`）。

構造化並行性を使用すると、親コルーチンをキャンセルするだけで、自動的にすべての子コルーチンにキャンセルが伝播されます。

### 外側のスコープのコンテキストを使用する

与えられたスコープ内で新しいコルーチンを開始すると、それらすべてが同じコンテキストで実行されることを確認するのがはるかに簡単になります。また、必要に応じてコンテキストを置き換えることもはるかに簡単です。

さて、外側のスコープからディスパッチャーを使用する方法を学ぶ時です。`coroutineScope` またはコルーチンビルダーによって作成された新しいスコープは、常に外側のスコープからコンテキストを継承します。この場合、外側のスコープは `suspend loadContributorsConcurrent()` 関数が呼び出されたスコープです。

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

すべてのネストされたコルーチンは、継承されたコンテキストで自動的に開始されます。ディスパッチャーはこのコンテキストの一部です。そのため、`async` によって開始されたすべてのコルーチンは、デフォルトディスパッチャーのコンテキストで開始されます。

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

構造化並行性を使用すると、トップレベルのコルーチンを作成するときに、主要なコンテキスト要素（ディスパッチャーなど）を一度だけ指定できます。その後、すべてのネストされたコルーチンはコンテキストを継承し、必要に応じてのみ変更します。

> UI アプリケーション（例えば Android アプリケーション）でコルーチンを使ったコードを書く場合、トップコルーチンにはデフォルトで `CoroutineDispatchers.Main` を使い、異なるスレッドでコードを実行する必要がある場合にのみ別のディスパッチャーを明示的に指定するのが一般的なプラクティスです。
>
{style="tip"}

## 進行状況の表示

いくつかのリポジトリの情報はかなり迅速にロードされるにもかかわらず、ユーザーはすべてのデータがロードされて初めて結果リストを見ることができます。それまで、ローダーアイコンは進行状況を表示し続けますが、現在の状態や既にロードされたコントリビューターに関する情報はありません。

中間結果を早期に表示し、各リポジトリのデータがロードされた後、すべてのコントリビューターを表示することができます。

![Loading data](loading.gif){width=500}

この機能を実装するには、`src/tasks/Request6Progress.kt` で UI を更新するロジックをコールバックとして渡し、各中間状態が呼ばれるようにする必要があります。

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

`Contributors.kt` の呼び出しサイトでは、_PROGRESS_ オプションのために `Main` スレッドから結果を更新するようにコールバックが渡されます。

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()` パラメーターは `loadContributorsProgress()` で `suspend` と宣言されています。対応するラムダ引数内で `suspend` 関数である `withContext` を呼び出す必要があります。
*   `updateResults()` コールバックは、ロードが完了し、結果が最終的なものであるかどうかを指定する追加の Boolean パラメーターを引数として取ります。

### タスク 6

`Request6Progress.kt` ファイルで、中間進行状況を表示する `loadContributorsProgress()` 関数を実装します。`Request4Suspend.kt` の `loadContributorsSuspend()` 関数をベースにしてください。

*   並行性のない単純なバージョンを使用してください。並行性は次のセクションで追加します。
*   コントリビューターの中間リストは、「集計された」状態で表示されるべきであり、各リポジトリにロードされたユーザーのリストだけではありません。
*   各ユーザーの総貢献数は、新しいリポジトリのデータがロードされるときに増加させる必要があります。

#### タスク 6 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

ロードされたコントリビューターの中間リストを「集計された」状態で保存するには、ユーザーのリストを保存する `allUsers` 変数を定義し、新しいリポジトリのコントリビューターがロードされた後にそれを更新します。

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

#### 連続 vs 並行

`updateResults()` コールバックは、各リクエストが完了した後に呼び出されます。

![Progress on requests](progress.png){width=700}

このコードには並行性は含まれていません。シーケンシャルなので、同期は必要ありません。

最良のオプションは、リクエストを並行して送信し、各リポジトリの応答を受け取った後で中間結果を更新することです。

![Concurrent requests](progress-and-concurrency.png){width=700}

並行性を追加するには、_チャネル_を使用します。

## チャネル

共有可能な可変状態を持つコードを書くことは非常に難しく、エラーが発生しやすい（コールバックを使用する解決策のように）。より簡単な方法は、共通の可変状態を使用するのではなく、コミュニケーションによって情報を共有することです。コルーチンは_チャネル_を介して互いに通信できます。

チャネルは、コルーチン間でデータを渡すことを可能にする通信プリミティブです。1つのコルーチンはチャネルに情報を_送信_でき、別のコルーチンはそこからその情報を_受信_できます。

![Using channels](using-channel.png)

情報を送信（生成）するコルーチンはプロデューサーと呼ばれることが多く、情報を受信（消費）するコルーチンはコンシューマーと呼ばれます。1つまたは複数のコルーチンが同じチャネルに情報を送信でき、1つまたは複数のコルーチンがそこからデータを受信できます。

![Using channels with many coroutines](using-channel-many-coroutines.png)

多くのコルーチンが同じチャネルから情報を受信する場合、各要素はコンシューマーのいずれかによって一度だけ処理されます。要素が処理されると、すぐにチャネルから削除されます。

チャネルは要素のコレクション、より正確にはキューに似ていると考えることができます。要素は一方の端に追加され、もう一方の端から受信されます。ただし、重要な違いがあります。同期バージョンであっても、コレクションとは異なり、チャネルは `send()` と `receive()` 操作を_サスペンド_できます。これは、チャネルが空または満杯の場合に発生します。チャネルのサイズに上限がある場合、チャネルは満杯になる可能性があります。

`Channel` は、`SendChannel`、`ReceiveChannel`、そして後者 2 つを拡張する `Channel` の 3 つの異なるインターフェースによって表現されます。通常、チャネルを作成し、プロデューサーには `SendChannel` インスタンスとして渡して、それだけがチャネルに情報を送信できるようにします。コンシューマーには `ReceiveChannel` インスタンスとして渡して、それだけがチャネルからデータを受信できるようにします。`send` と `receive` の両方のメソッドは `suspend` として宣言されています。

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

プロデューサーはチャネルを閉じて、これ以上要素が来ないことを示すことができます。

ライブラリにはいくつかのチャネル型が定義されています。これらは、内部に格納できる要素の数と、`send()` 呼び出しがサスペンドできるかどうかが異なります。すべてのチャネル型で、`receive()` 呼び出しは同様に動作します。チャネルが空でなければ要素を受信し、そうでなければサスペンドされます。

<deflist collapsible="true">
   <def title="無制限チャネル (Unlimited channel)">
       <p>無制限チャネルはキューに最も近いアナログです。プロデューサーはこのチャネルに要素を送信でき、それは無制限に増え続けます。<code>send()</code> 呼び出しは決してサスペンドされません。プログラムがメモリ不足になると、<code>OutOfMemoryException</code> が発生します。無制限チャネルとキューの違いは、コンシューマーが空のチャネルから受信しようとすると、新しい要素が送信されるまでサスペンドされることです。</p>
       <img src="unlimited-channel.png" alt="Unlimited channel" width="500"/>
   </def>
   <def title="バッファリングされたチャネル (Buffered channel)">
       <p>バッファリングされたチャネルのサイズは、指定された数によって制約されます。プロデューサーはサイズ制限に達するまでこのチャネルに要素を送信できます。すべての要素は内部に保存されます。チャネルが満杯になると、次の <code>send</code> 呼び出しは、より多くの空きスペースが利用可能になるまでサスペンドされます。</p>
       <img src="buffered-channel.png" alt="Buffered channel" width="500"/>
   </def>
   <def title="ランデブーチャネル (Rendezvous channel)">
       <p>「ランデブー」チャネルはバッファのないチャネルで、サイズゼロのバッファリングされたチャネルと同じです。一方の関数（<code>send()</code> または <code>receive()</code>）は、もう一方が呼び出されるまで常にサスペンドされます。</p>
       <p><code>send()</code> 関数が呼び出され、要素を処理する準備ができているサスペンドされた <code>receive()</code> 呼び出しがない場合、<code>send()</code> はサスペンドされます。同様に、<code>receive()</code> 関数が呼び出され、チャネルが空であるか、言い換えれば要素を送信する準備ができているサスペンドされた <code>send()</code> 呼び出しがない場合、<code>receive()</code> 呼び出しはサスペンドされます。</p>
       <p>「ランデブー」という名前（「合意された日時と場所での会合」）は、<code>send()</code> と <code>receive()</code> が「時間通りに会う」べきであるという事実に言及しています。</p>
       <img src="rendezvous-channel.png" alt="Rendezvous channel" width="500"/>
   </def>
   <def title="コンフラクテッドチャネル (Conflated channel)">
       <p>コンフラクテッドチャネルに送信された新しい要素は、以前に送信された要素を上書きするため、レシーバーは常に最新の要素のみを取得します。<code>send()</code> 呼び出しは決してサスペンドされません。</p>
       <img src="conflated-channel.gif" alt="Conflated channel" width="500"/>
   </def>
</deflist>

チャネルを作成する際には、その型またはバッファサイズ（バッファ付きが必要な場合）を指定します。

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

> チャネルについてさらに理解を深めるには、[このビデオ](https://www.youtube.com/watch?v=HpWQUoVURWQ)をご覧ください。
>
{style="tip"}

### タスク 7

`src/tasks/Request7Channels.kt` で、すべての GitHub コントリビューターを並行してリクエストし、同時に中間進行状況を表示する `loadContributorsChannels()` 関数を実装します。

以前の関数、`Request5Concurrent.kt` の `loadContributorsConcurrent()` と `Request6Progress.kt` の `loadContributorsProgress()` を使用してください。

#### タスク 7 のヒント {initial-collapse-state="collapsed" collapsible="true"}

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

次に、このチャネルからの要素を1つずつ受信して処理できます。

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

`receive()` 呼び出しは順次行われるため、追加の同期は必要ありません。

#### タスク 7 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

`loadContributorsProgress()` 関数と同様に、「すべてのコントリビューター」リストの中間状態を保存するための `allUsers` 変数を作成できます。チャネルから受信した新しいリストは、すべてのユーザーのリストに追加されます。結果を集計し、`updateResults` コールバックを使用して状態を更新します。

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

*   異なるリポジトリの結果は、準備が整い次第チャネルに追加されます。まず、すべてのリクエストが送信され、データが受信されていない場合、`receive()` 呼び出しはサスペンドされます。この場合、「コントリビューターをロードする」コルーチン全体がサスペンドされます。
*   次に、ユーザーのリストがチャネルに送信されると、「コントリビューターをロードする」コルーチンは再開され、`receive()` 呼び出しはこのリストを返し、結果はすぐに更新されます。

これで、プログラムを実行し、_CHANNELS_ オプションを選択してコントリビューターをロードし、結果を確認できます。

コルーチンもチャネルも、並行性に伴う複雑さを完全に排除するわけではありませんが、何が起こっているかを理解する必要がある場合には、生活を楽にしてくれます。

## コルーチンのテスト

コルーチンを用いた並行処理の解決策がサスペンド関数を用いた解決策よりも速いこと、そしてチャネルを用いた解決策が単純な「進行状況」の解決策よりも速いことを確認するために、すべての解決策をテストしてみましょう。

次のタスクでは、解決策の総実行時間を比較します。GitHub サービスをモックし、このサービスが指定されたタイムアウト後に結果を返すようにします。

```text
リポジトリリクエスト - 1000 ミリ秒の遅延で応答を返す
リポジトリ-1 - 1000 ミリ秒の遅延
リポジトリ-2 - 1200 ミリ秒の遅延
リポジトリ-3 - 800 ミリ秒の遅延
```

`suspend` 関数を使用したシーケンシャルな解決策は、約 4000 ミリ秒（4000 = 1000 + (1000 + 1200 + 800)）かかるはずです。並行処理の解決策は、約 2200 ミリ秒（2200 = 1000 + max(1000, 1200, 800)）かかるはずです。

進行状況を表示する解決策の場合、タイムスタンプ付きの中間結果も確認できます。

対応するテストデータは `test/contributors/testData.kt` に定義されており、`Request4SuspendKtTest`、`Request7ChannelsKtTest` などには、モックサービス呼び出しを使用する簡単なテストが含まれています。

しかし、ここには 2 つの問題があります。

*   これらのテストは実行に時間がかかりすぎます。各テストは約 2 ～ 4 秒かかり、毎回結果を待つ必要があります。これは非常に効率が悪いです。
*   コードの準備と実行に余分な時間がかかるため、解決策が実行される正確な時間に頼ることはできません。定数を追加することはできますが、その場合、時間はマシンごとに異なります。モックサービスの遅延は、違いを確認できるように、この定数よりも高くする必要があります。定数が 0.5 秒の場合、遅延を 0.1 秒にしても十分ではありません。

より良い方法は、特殊なフレームワークを使用して、同じコードを複数回実行しながらタイミングをテストすることですが（これにより合計時間はさらに増加します）、これは学習とセットアップが複雑です。

これらの問題を解決し、提供されたテスト遅延を持つ解決策が期待どおりに動作することを確認するために、特に一方が他方よりも高速であるということを確認するために、特殊なテストディスパッチャーを使用した_仮想時間_を使用します。このディスパッチャーは、開始からの仮想時間を追跡し、すべてをリアルタイムで即座に実行します。このディスパッチャーでコルーチンを実行すると、`delay` はすぐに戻り、仮想時間を進めます。

このメカニズムを使用するテストは高速で実行されますが、仮想時間の異なる瞬間に何が起こるかを確認できます。総実行時間は劇的に減少します。

![Comparison for total running time](time-comparison.png){width=700}

仮想時間を使用するには、`runBlocking` の呼び出しを `runTest` に置き換えます。`runTest` は `TestScope` への拡張ラムダを引数として取ります。この特殊なスコープ内で `suspend` 関数で `delay` を呼び出すと、`delay` はリアルタイムで遅延する代わりに仮想時間を進めます。

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

この例での実際の実行時間は数ミリ秒ですが、仮想時間は遅延引数と同じ 1000 ミリ秒です。

子のコルーチンで「仮想」`delay` の完全な効果を得るには、すべての子コルーチンを `TestDispatcher` で開始します。そうしないと機能しません。このディスパッチャーは、異なるディスパッチャーを提供しない限り、他の `TestScope` から自動的に継承されます。

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

上記の例で `launch` が `Dispatchers.Default` のコンテキストで呼び出された場合、テストは失敗します。ジョブがまだ完了していないという例外が発生します。

`loadContributorsConcurrent()` 関数は、子コルーチンを `Dispatchers.Default` ディスパッチャーを使用して変更せずに、継承されたコンテキストで開始する場合にのみ、このようにテストできます。

ディスパッチャーのようなコンテキスト要素は、関数を_定義する_ときではなく、_呼び出す_ときに指定できます。これにより、柔軟性が増し、テストが容易になります。

> 仮想時間をサポートするテスト API は [Experimental](components-stability.md) であり、将来変更される可能性があります。
>
{style="warning"}

デフォルトでは、コンパイラは実験的なテスト API を使用している場合に警告を表示します。これらの警告を抑制するには、テスト関数またはテストを含むクラス全体に `@OptIn(ExperimentalCoroutinesApi::class)` をアノテーションします。コンパイラに実験的な API を使用していることを指示するコンパイラ引数を追加します。

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

このチュートリアルに対応するプロジェクトでは、コンパイラ引数はすでに Gradle スクリプトに追加されています。

### タスク 8

`tests/tasks/` にある以下のテストを、実時間ではなく仮想時間を使用するようにリファクタリングします。

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

リファクタリング適用前と後の総実行時間を比較してください。

#### タスク 8 のヒント {initial-collapse-state="collapsed" collapsible="true"}

1.  `runBlocking` 呼び出しを `runTest` に、`System.currentTimeMillis()` を `currentTime` に置き換えます。

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  正確な仮想時間をチェックするアサーションのコメントを解除します。
3.  `@UseExperimental(ExperimentalCoroutinesApi::class)` を追加することを忘れないでください。

#### タスク 8 の解決策 {initial-collapse-state="collapsed" collapsible="true"}

並行処理とチャネルのケースの解決策を以下に示します。

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

チャネルを使用する最後のバージョンの中間結果は、プログレスバージョンよりも早く利用可能になり、仮想時間を使用するテストでその違いを確認できます。

> 残りの「サスペンド」および「プログレス」タスクのテストは非常に似ています。プロジェクトの `solutions` ブランチでそれらを見つけることができます。
>
{style="tip"}

## 次に学ぶこと

*   KotlinConf の [Asynchronous Programming with Kotlin](https://kotlinconf.com/workshops/) ワークショップをチェックしてください。
*   [仮想時間と実験的なテストパッケージ](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)の使用についてさらに詳しく調べてください。