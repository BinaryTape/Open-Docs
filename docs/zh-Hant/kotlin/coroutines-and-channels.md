<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程與通道 − 教程)

在本教程中，您將學習如何在 IntelliJ IDEA 中使用協程執行網路請求，而不會阻塞底層執行緒或回呼。

> 不需要事先了解協程，但您需要熟悉 Kotlin 基本語法。
>
{style="tip"}

您將學習：

*   為何以及如何使用暫停函式來執行網路請求。
*   如何使用協程並發地傳送請求。
*   如何使用通道在不同的協程之間共享資訊。

對於網路請求，您將需要 [Retrofit](https://square.github.io/retrofit/) 函式庫，但本教程中所示的方法對於任何其他支援協程的函式庫也同樣適用。

> 您可以在 [專案的儲存庫](http://github.com/kotlin-hands-on/intro-coroutines) 的 `solutions` 分支上找到所有任務的解決方案。
>
{style="tip"}

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  在歡迎畫面選擇 **Get from VCS** 或選擇 **File | New | Project from Version Control** 來複製 [專案範本](http://github.com/kotlin-hands-on/intro-coroutines)。

    您也可以從命令列複製：

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### 產生 GitHub 開發者權杖

您將在專案中使用 GitHub API。要取得存取權限，請提供您的 GitHub 帳戶名稱以及密碼或權杖。如果您啟用了雙因素驗證，則僅使用權杖就足夠了。

透過 [您的帳戶](https://github.com/settings/tokens/new) 產生一個新的 GitHub 權杖以使用 GitHub API：

1.  指定權杖的名稱，例如 `coroutines-tutorial`：

    ![產生新的 GitHub 權杖](generating-token.png){width=700}

2.  不要選擇任何 Scope。點擊頁面底部的 **Generate token**。
3.  複製產生的權杖。

### 執行程式碼

該程式會載入給定組織（預設為「kotlin」）下所有儲存庫的貢獻者。稍後您將添加邏輯，根據貢獻數量對使用者進行排序。

1.  開啟 `src/contributors/main.kt` 檔案並執行 `main()` 函式。您將看到以下視窗：

    ![第一個視窗](initial-window.png){width=500}

    如果字體太小，請透過更改 `main()` 函式中 `setDefaultFontSize(18f)` 的值來調整它。

2.  在相應欄位中提供您的 GitHub 使用者名稱和權杖（或密碼）。
3.  確保在 _Variant_ 下拉選單中選擇了 _BLOCKING_ 選項。
4.  點擊 _Load contributors_。UI 應該會凍結一段時間，然後顯示貢獻者列表。
5.  開啟程式輸出，確保資料已載入。每次成功請求後都會記錄貢獻者列表。

有不同的方法可以實現此邏輯：使用[阻塞請求](#blocking-requests)或[回呼](#callbacks)。您將比較這些解決方案與使用[協程](#coroutines)的解決方案，並了解[通道](#channels)如何用於在不同協程之間共享資訊。

## 阻塞請求

您將使用 [Retrofit](https://square.github.io/retrofit/) 函式庫來對 GitHub 執行 HTTP 請求。它允許請求給定組織下的儲存庫列表以及每個儲存庫的貢獻者列表：

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

此 API 由 `loadContributorsBlocking()` 函式使用，用於取得給定組織的貢獻者列表。

1.  開啟 `src/tasks/Request1Blocking.kt` 查看其實現：

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

    *   首先，您取得給定組織下的儲存庫列表並將其儲存在 `repos` 列表中。然後對於每個儲存庫，請求貢獻者列表，並將所有列表合併為一個最終的貢獻者列表。
    *   `getOrgReposCall()` 和 `getRepoContributorsCall()` 都會回傳 `*Call` 類別的實例（`#1`）。此時，尚未傳送任何請求。
    *   然後調用 `*Call.execute()` 以執行請求（`#2`）。`execute()` 是一個同步呼叫，它會阻塞底層執行緒。
    *   當您收到回應時，透過呼叫特定的 `logRepos()` 和 `logUsers()` 函式來記錄結果（`#3`）。如果 HTTP 回應包含錯誤，此錯誤將在此處記錄。
    *   最後，取得回應的主體，其中包含您需要的資料。對於本教程，如果發生錯誤，您將使用空列表作為結果，並記錄相應的錯誤（`#4`）。

2.  為了避免重複 `.body() ?: emptyList()`，聲明了一個擴充函式 `bodyList()`：

    ```kotlin
    fun <T> Response<List<T>>.bodyList(): List<T> {
        return body() ?: emptyList()
    }
    ```

3.  再次執行程式並查看 IntelliJ IDEA 中的系統輸出。它應該類似於：

    ```text
    1770 [AWT-EventQueue-0] INFO  Contributors - kotlin: loaded 40 repos
    2025 [AWT-EventQueue-0] INFO  Contributors - kotlin-examples: loaded 23 contributors
    2229 [AWT-EventQueue-0] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    ```

    *   每行的第一個項目是自程式啟動以來經過的毫秒數，然後是方括號中的執行緒名稱。您可以看到載入請求是從哪個執行緒呼叫的。
    *   每行的最後一個項目是實際訊息：載入了多少個儲存庫或貢獻者。

    此日誌輸出表明所有結果都是從主執行緒記錄的。當您使用 _BLOCKING_ 選項執行程式碼時，視窗會凍結並且在載入完成之前不會對輸入做出反應。所有請求都是從呼叫 `loadContributorsBlocking()` 的同一個執行緒執行，該執行緒是主 UI 執行緒（在 Swing 中，它是 AWT 事件分發執行緒）。此主執行緒被阻塞，這就是 UI 凍結的原因：

    ![被阻塞的主執行緒](blocking.png){width=700}

    貢獻者列表載入後，結果會更新。

4.  在 `src/contributors/Contributors.kt` 中，找到負責選擇如何載入貢獻者的 `loadContributors()` 函式，並查看 `loadContributorsBlocking()` 的呼叫方式：

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 呼叫緊隨 `loadContributorsBlocking()` 呼叫之後。
    *   `updateResults()` 會更新 UI，因此它必須始終從 UI 執行緒呼叫。
    *   由於 `loadContributorsBlocking()` 也從 UI 執行緒呼叫，UI 執行緒被阻塞，UI 凍結。

### 任務 1

第一個任務可協助您熟悉任務領域。目前，每個貢獻者的名稱會重複數次，每個他們參與的專案重複一次。實作 `aggregate()` 函式以組合使用者，使每個貢獻者只被新增一次。`User.contributions` 屬性應包含該使用者對**所有**專案的總貢獻數量。結果列表應根據貢獻數量以降序排序。

開啟 `src/tasks/Aggregation.kt` 並實作 `List<User>.aggregate()` 函式。使用者應依其總貢獻數排序。

對應的測試檔案 `test/tasks/AggregationKtTest.kt` 顯示了一個預期結果的範例。

> 您可以使用 [IntelliJ IDEA 捷徑](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation) `Ctrl+Shift+T` / `⇧ ⌘ T` 在原始碼和測試類別之間自動跳轉。
>
{style="tip"}

完成此任務後，"kotlin" 組織的結果列表應類似於以下內容：

![“kotlin”組織的列表](aggregate.png){width=500}

#### 任務 1 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

1.  要按登入名分組使用者，請使用 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)，它會回傳一個從登入名到該登入名使用者在不同儲存庫中所有出現次數的 Map。
2.  對於每個 Map 項目，計算每個使用者的總貢獻數，並透過給定的名稱和總貢獻數建立 `User` 類別的新實例。
3.  將結果列表降序排序：

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

另一種解決方案是使用 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 函式而非 `groupBy()`。

## 回呼

之前的解決方案有效，但它會阻塞執行緒，因此會凍結 UI。避免這種情況的傳統方法是使用 _回呼_。

您可以將在操作完成後應立即呼叫的程式碼提取到一個單獨的回呼中（通常是 Lambda 運算式），並將該 Lambda 傳遞給呼叫者，以便稍後呼叫它。

為了使 UI 保持響應，您可以將整個計算移至單獨的執行緒，或切換到使用回呼而非阻塞呼叫的 Retrofit API。

### 使用背景執行緒

1.  開啟 `src/tasks/Request2Background.kt` 並查看其實現。首先，整個計算被移動到一個不同的執行緒。`thread()` 函式會啟動一個新的執行緒：

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    現在所有載入都已移至單獨的執行緒，主執行緒是空閒的，可以被其他任務佔用：

    ![空閒的主執行緒](background.png){width=700}

2.  `loadContributorsBackground()` 函式的簽名會更改。它將 `updateResults()` 回呼作為最後一個參數，以便在所有載入完成後呼叫它：

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  現在，當呼叫 `loadContributorsBackground()` 時，`updateResults()` 呼叫會進入回呼，而不是像以前那樣立即執行：

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    透過呼叫 `SwingUtilities.invokeLater`，您可以確保 `updateResults()` 呼叫（它會更新結果）發生在主 UI 執行緒（AWT 事件分派執行緒）上。

然而，如果您嘗試透過 `BACKGROUND` 選項載入貢獻者，您可能會看到列表已更新但沒有任何變化。

### 任務 2

修復 `src/tasks/Request2Background.kt` 中的 `loadContributorsBackground()` 函式，以便在 UI 中顯示結果列表。

#### 任務 2 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

如果您嘗試載入貢獻者，您可以在日誌中看到貢獻者已載入但未顯示結果。要解決此問題，請在結果使用者列表上呼叫 `updateResults()`：

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

請務必明確呼叫回呼中傳遞的邏輯。否則，什麼都不會發生。

### 使用 Retrofit 回呼 API

在先前的解決方案中，整個載入邏輯都移至背景執行緒，但這仍然不是對資源的最佳利用。所有載入請求都按順序進行，並且在等待載入結果時執行緒被阻塞，而此時它本可以被其他任務佔用。具體而言，執行緒可以開始載入另一個請求以更早地接收整個結果。

每個儲存庫的資料處理應分為兩部分：載入和處理結果回應。第二個 _處理_ 部分應提取到回呼中。

然後，可以在收到先前儲存庫的結果（並呼叫相應的回呼）之前啟動每個儲存庫的載入：

![使用回呼 API](callbacks.png){width=700}

Retrofit 回呼 API 可以幫助實現這一點。`Call.enqueue()` 函式會啟動一個 HTTP 請求並將回呼作為參數。在此回呼中，您需要指定每個請求完成後需要做什麼。

開啟 `src/tasks/Request3Callbacks.kt` 並查看使用此 API 的 `loadContributorsCallbacks()` 實作：

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

*   為方便起見，此程式碼片段使用了在同一個檔案中宣告的 `onResponse()` 擴充函式。它接受一個 Lambda 作為參數，而不是一個物件表達式。
*   處理回應的邏輯被提取到回呼中：相應的 Lambda 從 `#1` 和 `#2` 行開始。

然而，提供的解決方案不起作用。如果您執行程式並選擇 _CALLBACKS_ 選項載入貢獻者，您會看到沒有任何顯示。但是，`Request3CallbacksKtTest` 中的測試會立即回傳成功通過的結果。

思考一下為什麼給定的程式碼沒有按預期工作，並嘗試修復它，或者查看下面的解決方案。

### 任務 3 (可選)

重寫 `src/tasks/Request3Callbacks.kt` 檔案中的程式碼，以便顯示載入的貢獻者列表。

#### 任務 3 的第一次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

在目前的解決方案中，許多請求並發啟動，這減少了總載入時間。但是，結果並未載入。這是因為 `updateResults()` 回呼在所有載入請求啟動後立即呼叫，而 `allUsers` 列表尚未填入資料。

您可以嘗試透過以下更改來修復此問題：

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

*   首先，您會遍歷帶有索引的儲存庫列表（`#1`）。
*   然後，從每個回呼中，檢查它是否是最後一次迭代（`#2`）。
*   如果是這樣，則更新結果。

然而，這段程式碼也未能實現我們的目標。請自行尋找答案，或查看下面的解決方案。

#### 任務 3 的第二次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

由於載入請求是並發啟動的，因此無法保證最後一個請求的結果是最後一個到達的。結果可以以任何順序到達。

因此，如果您將目前索引與 `lastIndex` 作為完成條件進行比較，則可能會丟失某些儲存庫的結果。

如果處理最後一個儲存庫的請求比某些先前請求返回得更快（這很可能發生），則所有耗時較長的請求的結果都將丟失。

一種修復方法是引入一個索引並檢查是否已處理所有儲存庫：

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

此程式碼使用列表的同步版本和 `AtomicInteger()`，因為一般來說，不能保證處理 `getRepoContributors()` 請求的不同回呼將始終從同一個執行緒呼叫。

#### 任務 3 的第三次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

一個更好的解決方案是使用 `CountDownLatch` 類別。它儲存一個計數器，該計數器以儲存庫數量初始化。處理每個儲存庫後，此計數器會遞減。然後它會等到計數器歸零後再更新結果：

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

然後從主執行緒更新結果。這比將邏輯委派給子執行緒更直接。

在審查了這三種解決方案嘗試後，您會發現使用回呼編寫正確的程式碼並非易事且容易出錯，尤其是在涉及多個底層執行緒和同步的情況下。

> 作為額外練習，您可以使用 RxJava 函式庫以響應式方法實作相同的邏輯。所有必要的依賴項和使用 RxJava 的解決方案都可以在單獨的 `rx` 分支中找到。也可以完成本教程並實作或檢查建議的 Rx 版本以進行適當比較。
>
{style="tip"}

## 暫停函式

您可以使用暫停函式實作相同的邏輯。不是回傳 `Call<List<Repo>>`，而是將 API 呼叫定義為[暫停函式](composing-suspending-functions.md)，如下所示：

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()` 被定義為 `suspend` 函式。當您使用暫停函式執行請求時，底層執行緒不會被阻塞。有關其工作原理的更多詳細資訊將在後續章節中介紹。
*   `getOrgRepos()` 直接回傳結果，而不是回傳 `Call`。如果結果不成功，則會拋出異常。

或者，Retrofit 允許回傳包裝在 `Response` 中的結果。在這種情況下，會提供結果主體，並且可以手動檢查錯誤。本教程使用回傳 `Response` 的版本。

在 `src/contributors/GitHubService.kt` 中，將以下宣告添加到 `GitHubService` 介面：

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

### 任務 4

您的任務是更改載入貢獻者的函式程式碼，以利用兩個新的暫停函式 `getOrgRepos()` 和 `getRepoContributors()`。新的 `loadContributorsSuspend()` 函式被標記為 `suspend` 以使用新的 API。

> 暫停函式不能隨處呼叫。從 `loadContributorsBlocking()` 呼叫暫停函式將導致錯誤，訊息為「Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function」。
>
{style="note"}

1.  將定義在 `src/tasks/Request1Blocking.kt` 中的 `loadContributorsBlocking()` 實作複製到定義在 `src/tasks/Request4Suspend.kt` 中的 `loadContributorsSuspend()`。
2.  修改程式碼，以便使用新的暫停函式，而不是回傳 `Call` 的函式。
3.  選擇 _SUSPEND_ 選項執行程式，並確保在執行 GitHub 請求時 UI 仍然保持響應。

#### 任務 4 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

將 `.getOrgReposCall(req.org).execute()` 替換為 `.getOrgRepos(req.org)`，並對第二個「貢獻者」請求重複相同的替換：

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

*   `loadContributorsSuspend()` 應該被定義為一個 `suspend` 函式。
*   您不再需要呼叫 `execute`（它之前回傳 `Response`），因為現在 API 函式直接回傳 `Response`。請注意，此細節特定於 Retrofit 函式庫。對於其他函式庫，API 會有所不同，但概念是相同的。

## 協程

使用暫停函式的程式碼看起來與「阻塞」版本相似。與阻塞版本的主要區別在於，協程不是阻塞執行緒，而是被暫停：

```text
阻塞 -> 暫停
執行緒 -> 協程
```

> 協程通常被稱為輕量級執行緒，因為您可以在協程上執行程式碼，類似於您在執行緒上執行程式碼的方式。以前會阻塞（並且必須避免）的操作現在可以改為暫停協程。
>
{style="note"}

### 啟動新的協程

如果您查看 `loadContributorsSuspend()` 在 `src/contributors/Contributors.kt` 中的使用方式，您會看到它是在 `launch` 內部呼叫的。`launch` 是一個接受 Lambda 作為參數的函式庫函式：

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

在這裡，`launch` 啟動一個新的計算，負責載入資料並顯示結果。該計算是可暫停的——當執行網路請求時，它會被暫停並釋放底層執行緒。當網路請求回傳結果時，計算會恢復。

這種可暫停的計算稱為 _協程_。因此，在這種情況下，`launch` _啟動了一個新的協程_，負責載入資料並顯示結果。

協程在執行緒之上執行並且可以被暫停。當協程被暫停時，相應的計算會暫停，從執行緒中移除，並儲存在記憶體中。同時，執行緒可以自由地被其他任務佔用：

![暫停協程](suspension-process.gif){width=700}

當計算準備好繼續時，它會被回傳到一個執行緒（不一定是同一個）。

在 `loadContributorsSuspend()` 範例中，每個「貢獻者」請求現在都使用暫停機制等待結果。首先，發送新的請求。然後，在等待回應的同時，由 `launch` 函式啟動的整個「載入貢獻者」協程被暫停。

協程僅在收到相應回應後才恢復：

![暫停請求](suspend-requests.png){width=700}

當回應等待接收時，執行緒可以自由地被其他任務佔用。UI 保持響應，儘管所有請求都在主 UI 執行緒上進行：

1.  使用 _SUSPEND_ 選項執行程式。日誌確認所有請求都已傳送到主 UI 執行緒：

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  日誌可以顯示相應程式碼正在哪個協程上執行。要啟用它，請開啟 **Run | Edit configurations** 並添加 `-Dkotlinx.coroutines.debug` VM 選項：

    ![編輯執行組態](run-configuration.png){width=500}

    當 `main()` 以此選項執行時，協程名稱將附加到執行緒名稱。您也可以修改用於執行所有 Kotlin 檔案的範本並預設啟用此選項。

現在所有程式碼都在一個協程上執行，即上面提到的「載入貢獻者」協程，表示為 `@coroutine#1`。在等待結果時，您不應該重複利用該執行緒來發送其他請求，因為程式碼是按順序編寫的。只有在收到前一個結果後才會發送新的請求。

暫停函式公平對待執行緒，不會「等待」而阻塞它。然而，這尚未帶來任何並發性。

## 並發

Kotlin 協程比執行緒所需的資源少得多。每次您想要異步啟動新計算時，都可以改為建立一個新的協程。

要啟動一個新的協程，請使用主要的 _協程建構器_ 之一：`launch`、`async` 或 `runBlocking`。不同的函式庫可以定義額外的協程建構器。

`async` 啟動一個新的協程並回傳一個 `Deferred` 物件。`Deferred` 代表一個在其他名稱中也已知的概念，例如 `Future` 或 `Promise`。它儲存一個計算，但它會 _延遲_ 您取得最終結果的時刻；它 _承諾_ 未來某個時候的結果。

`async` 和 `launch` 的主要區別在於 `launch` 用於啟動預期不會回傳特定結果的計算。`launch` 會回傳一個表示該協程的 `Job`。可以透過呼叫 `Job.join()` 來等待它完成。

`Deferred` 是一種擴展 `Job` 的泛型型別。`async` 呼叫可以回傳 `Deferred<Int>` 或 `Deferred<CustomType>`，具體取決於 Lambda 回傳的內容（Lambda 內的最後一個表達式是結果）。

要取得協程的結果，您可以呼叫 `Deferred` 實例上的 `await()`。在等待結果時，呼叫此 `await()` 的協程會被暫停：

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

`runBlocking` 用作常規函式與暫停函式之間，或阻塞世界與非阻塞世界之間的橋樑。它作為啟動頂層主協程的轉接器。它主要用於 `main()` 函式和測試。

> 觀看[此影片](https://www.youtube.com/watch?v=zEZc5AmHQhk)以更好地了解協程。
>
{style="tip"}

如果有一個 `Deferred` 物件列表，您可以呼叫 `awaitAll()` 來等待所有物件的結果：

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

當每個「貢獻者」請求在新的協程中啟動時，所有請求都會異步啟動。可以在收到前一個請求的結果之前發送新的請求：

![並發協程](concurrency.png){width=700}

總載入時間與 _CALLBACKS_ 版本大致相同，但它不需要任何回呼。更重要的是，`async` 明確強調程式碼中哪些部分是並發執行的。

### 任務 5

在 `Request5Concurrent.kt` 檔案中，使用先前的 `loadContributorsSuspend()` 函式實作 `loadContributorsConcurrent()` 函式。

#### 任務 5 的提示 {initial-collapse-state="collapsed" collapsible="true"}

您只能在協程作用域內啟動新的協程。將 `loadContributorsSuspend()` 中的內容複製到 `coroutineScope` 呼叫中，以便您可以在其中呼叫 `async` 函式：

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService,
    req: RequestData
): List<User> = coroutineScope {
    // ...
}
```

您的解決方案應基於以下方案：

```kotlin
val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
    async {
        // load contributors for each repo
    }
}
deferreds.awaitAll() // List<List<User>>
```

#### 任務 5 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

將每個「貢獻者」請求用 `async` 包裝起來，以建立與儲存庫數量一樣多的協程。`async` 回傳 `Deferred<List<User>>`。這不是問題，因為建立新的協程對資源消耗不大，所以您可以建立任意數量的協程。

1.  您不能再使用 `flatMap`，因為 `map` 的結果現在是一個 `Deferred` 物件列表，而不是一個列表的列表。`awaitAll()` 回傳 `List<List<User>>`，因此呼叫 `flatten().aggregate()` 以取得結果：

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

2.  執行程式碼並檢查日誌。所有協程仍然在主 UI 執行緒上執行，因為尚未採用多執行緒，但您已經可以看到並發執行協程的好處。
3.  要更改此程式碼以在常用執行緒池中於不同執行緒上執行「貢獻者」協程，請將 `Dispatchers.Default` 指定為 `async` 函式的上下文參數：

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher` 決定相應的協程應在哪個執行緒或哪些執行緒上執行。如果您不指定一個作為參數，`async` 將使用外部作用域中的調度器。
    *   `Dispatchers.Default` 代表 JVM 上執行緒的共享池。此池提供了一種並行執行的手段。它包含與可用 CPU 核心數量一樣多的執行緒，但如果只有一個核心，它仍然會有兩個執行緒。

4.  修改 `loadContributorsConcurrent()` 函式中的程式碼，以在常用執行緒池中的不同執行緒上啟動新的協程。此外，在傳送請求之前添加額外日誌：

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  再次執行程式。在日誌中，您可以看到每個協程都可以在執行緒池中的一個執行緒上啟動並在另一個執行緒上恢復：

    ```text
    1946 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    1946 [DefaultDispatcher-worker-3 @coroutine#5] INFO  Contributors - starting loading for dokka
    1946 [DefaultDispatcher-worker-1 @coroutine#3] INFO  Contributors - starting loading for ts2kt
    ...
    2178 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    2569 [DefaultDispatcher-worker-1 @coroutine#5] INFO  Contributors - dokka: loaded 36 contributors
    2821 [DefaultDispatcher-worker-2 @coroutine#3] INFO  Contributors - ts2kt: loaded 11 contributors
    ```

    例如，在此日誌摘錄中，`coroutine#4` 在 `worker-2` 執行緒上啟動，並在 `worker-1` 執行緒上繼續。

在 `src/contributors/Contributors.kt` 中，檢查 _CONCURRENT_ 選項的實作：

1.  要僅在主 UI 執行緒上執行協程，請將 `Dispatchers.Main` 指定為參數：

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   如果主執行緒在您啟動新協程時繁忙，協程會被暫停並安排在此執行緒上執行。協程只會在執行緒空閒時恢復。
    *   最佳實踐是使用外部作用域的調度器，而不是在每個端點明確指定它。如果您在不傳遞 `Dispatchers.Default` 作為參數的情況下定義 `loadContributorsConcurrent()`，您可以在任何上下文中呼叫此函式：使用 `Default` 調度器、主 UI 執行緒或自訂調度器。
    *   正如您稍後將看到的，從測試中呼叫 `loadContributorsConcurrent()` 時，您可以在 `TestDispatcher` 的上下文中呼叫它，這簡化了測試。這使得此解決方案更加靈活。

2.  要在呼叫端指定調度器，請將以下更改應用於專案，同時讓 `loadContributorsConcurrent` 在繼承的上下文中啟動協程：

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 應在主 UI 執行緒上呼叫，因此您使用 `Dispatchers.Main` 的上下文呼叫它。
    *   `withContext()` 會使用指定的協程上下文呼叫給定的程式碼，暫停直到它完成並回傳結果。另一種更冗長的方式來表達這一點是啟動一個新的協程並明確等待（透過暫停）直到它完成：`launch(context) { ... }.join()`。

3.  執行程式碼並確保協程在執行緒池中的執行緒上執行。

## 結構化並發

*   _協程作用域_ 負責不同協程之間的結構和父子關係。新的協程通常需要在作用域內啟動。
*   _協程上下文_ 儲存用於執行給定協程的額外技術資訊，例如協程的自訂名稱或指定協程應排程在哪些執行緒上的調度器。

當使用 `launch`、`async` 或 `runBlocking` 啟動新的協程時，它們會自動建立相應的作用域。所有這些函式都接受一個帶有接收器的 Lambda 作為參數，而 `CoroutineScope` 是隱式接收器型別：

```kotlin
launch { /* this: CoroutineScope */ }
```

*   新的協程只能在作用域內啟動。
*   `launch` 和 `async` 被宣告為 `CoroutineScope` 的擴展，因此在呼叫它們時必須始終傳遞隱式或顯式接收器。
*   由 `runBlocking` 啟動的協程是唯一的例外，因為 `runBlocking` 被定義為頂層函式。但由於它會阻塞目前執行緒，因此它主要用於 `main()` 函式和測試中作為橋接函式。

`runBlocking`、`launch` 或 `async` 內部的新協程會自動在作用域內啟動：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

當您在 `runBlocking` 內部呼叫 `launch` 時，它是作為 `CoroutineScope` 型別的隱式接收器的擴展來呼叫的。或者，您可以明確寫 `this.launch`。

巢狀協程（本範例中由 `launch` 啟動）可以被視為外部協程（由 `runBlocking` 啟動）的子協程。這種「父子」關係透過作用域工作；子協程是從與父協程相對應的作用域啟動的。

可以不啟動新的協程就建立一個新的作用域，透過使用 `coroutineScope` 函式。為了在 `suspend` 函式內以結構化的方式啟動新的協程，而無法存取外部作用域時，您可以建立一個新的協程作用域，它會自動成為呼叫此 `suspend` 函式的外部作用域的子作用域。`loadContributorsConcurrent()` 是一個很好的範例。

您也可以使用 `GlobalScope.async` 或 `GlobalScope.launch` 從全域作用域啟動新的協程。這將建立一個頂層「獨立」協程。

協程結構背後的機制稱為 _結構化並發_。它提供了以下優於全域作用域的優點：

*   作用域通常負責子協程，子協程的生命週期與作用域的生命週期綁定。
*   如果出現問題或使用者改變主意並決定撤銷操作，作用域可以自動取消子協程。
*   作用域會自動等待所有子協程完成。因此，如果作用域對應於一個協程，則父協程不會完成，直到在其作用域內啟動的所有協程都已完成。

當使用 `GlobalScope.async` 時，沒有將幾個協程綁定到較小作用域的結構。從全域作用域啟動的協程都是獨立的——它們的生命週期僅受整個應用程式生命週期的限制。可以儲存從全域作用域啟動的協程的引用，並等待其完成或明確取消它，但這不會像結構化並發那樣自動發生。

### 取消貢獻者載入

建立兩個版本的函式來載入貢獻者列表。比較當您嘗試取消父協程時這兩個版本的行為。第一個版本將使用 `coroutineScope` 來啟動所有子協程，而第二個版本將使用 `GlobalScope`。

1.  在 `Request5Concurrent.kt` 中，為 `loadContributorsConcurrent()` 函式添加 3 秒延遲：

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

    延遲會影響所有傳送請求的協程，以便有足夠的時間在協程啟動後但在請求傳送之前取消載入。

2.  建立載入函式的第二個版本：將 `loadContributorsConcurrent()` 的實作複製到 `Request5NotCancellable.kt` 中的 `loadContributorsNotCancellable()`，然後移除新的 `coroutineScope` 的建立。
3.  現在 `async` 呼叫無法解析，因此使用 `GlobalScope.async` 啟動它們：

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

    *   該函式現在直接回傳結果，而不是作為 Lambda 內的最後一個表達式（`#1` 和 `#3` 行）。
    *   所有「貢獻者」協程都在 `GlobalScope` 內部啟動，而不是協程作用域的子協程（`#2` 行）。

4.  執行程式並選擇 _CONCURRENT_ 選項來載入貢獻者。
5.  等待所有「貢獻者」協程啟動，然後點擊 _Cancel_。日誌顯示沒有新的結果，這表示所有請求確實已被取消：

    ```text
    2896 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 40 repos
    2901 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2909 [DefaultDispatcher-worker-5 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* no requests are sent */
    ```

6.  重複步驟 5，但這次選擇 `NOT_CANCELLABLE` 選項：

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

    在這種情況下，沒有協程被取消，並且所有請求仍然被傳送。

7.  檢查「貢獻者」程式中取消是如何觸發的。當點擊 _Cancel_ 按鈕時，主「載入」協程會被明確取消，子協程會自動取消：

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

`launch` 函式會回傳 `Job` 的實例。`Job` 會儲存對「載入協程」的引用，該協程會載入所有資料並更新結果。您可以在其上呼叫 `setUpCancellation()` 擴展函式（`#1` 行），並將 `Job` 的實例作為接收器傳遞。

另一種表達方式是明確地寫：

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   為了可讀性，您可以在函式內部用新的 `loadingJob` 變數（`#2` 行）來指代 `setUpCancellation()` 函式的接收器。
*   然後，您可以為 _Cancel_ 按鈕添加一個監聽器，以便在點擊時，`loadingJob` 會被取消（`#3` 行）。

透過結構化並發，您只需要取消父協程，這會自動將取消傳播到所有子協程。

### 使用外部作用域的上下文

當您在給定作用域內啟動新的協程時，更容易確保它們都使用相同的上下文執行。替換上下文也更容易。

現在是時候學習如何使用外部作用域的調度器了。由 `coroutineScope` 或協程建構器建立的新作用域總是從外部作用域繼承上下文。在這種情況下，外部作用域是呼叫 `suspend loadContributorsConcurrent()` 函式的作用域：

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

所有巢狀協程都會自動以繼承的上下文啟動。調度器是此上下文的一部分。這就是為什麼所有由 `async` 啟動的協程都會以預設調度器的上下文啟動：

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

透過結構化並發，您可以在建立頂層協程時一次指定主要的上下文元素（例如調度器）。所有巢狀協程然後會繼承該上下文並僅在需要時修改它。

> 當您為 UI 應用程式（例如 Android 應用程式）編寫協程程式碼時，通常的做法是預設為頂層協程使用 `CoroutineDispatchers.Main`，然後在需要於不同執行緒上執行程式碼時明確放置不同的調度器。
>
{style="tip"}

您可以在呼叫端指定調度器，將以下更改應用於專案，同時讓 `loadContributorsConcurrent` 在繼承的上下文中啟動協程：

```kotlin
launch(Dispatchers.Default) {
    val users = loadContributorsConcurrent(service, req)
    withContext(Dispatchers.Main) {
        updateResults(users, startTime)
    }
}
```

*   `updateResults()` 應在主 UI 執行緒上呼叫，因此您使用 `Dispatchers.Main` 的上下文呼叫它。
*   `withContext()` 會使用指定的協程上下文呼叫給定的程式碼，暫停直到它完成並回傳結果。另一種更冗長的方式來表達這一點是啟動一個新的協程並明確等待（透過暫停）直到它完成：`launch(context) { ... }.join()`。

執行程式碼並確保協程在執行緒池中的執行緒上執行。

## 顯示進度

儘管某些儲存庫的資訊載入得相當快，但使用者只有在所有資料都載入後才能看到結果列表。在此之前，載入圖示會顯示進度，但沒有關於目前狀態或已載入哪些貢獻者的資訊。

您可以更早地顯示中間結果，並在載入每個儲存庫的資料後顯示所有貢獻者：

![載入資料](loading.gif){width=500}

為了實作此功能，在 `src/tasks/Request6Progress.kt` 中，您需要將更新 UI 的邏輯作為回呼傳遞，以便在每個中間狀態呼叫它：

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

在 `Contributors.kt` 的呼叫端，回呼被傳遞以從 `Main` 執行緒更新 _PROGRESS_ 選項的結果：

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()` 參數在 `loadContributorsProgress()` 中被宣告為 `suspend`。必須在相應的 Lambda 參數內部呼叫 `withContext`，這是一個 `suspend` 函式。
*   `updateResults()` 回呼接受一個額外的布林參數作為參數，指定載入是否已完成並且結果是否為最終結果。

### 任務 6

在 `Request6Progress.kt` 檔案中，實作 `loadContributorsProgress()` 函式，該函式會顯示中間進度。請以 `Request4Suspend.kt` 中的 `loadContributorsSuspend()` 函式為基礎。

*   使用不帶並發的簡單版本；您將在下一節中添加它。
*   中間貢獻者列表應以「聚合」狀態顯示，而不僅僅是為每個儲存庫載入的使用者列表。
*   載入每個新儲存庫的資料時，每個使用者的總貢獻數應增加。

#### 任務 6 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

為了在「聚合」狀態下儲存已載入貢獻者的中間列表，定義一個 `allUsers` 變數來儲存使用者列表，然後在載入每個新儲存庫的貢獻者後更新它：

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

#### 依序與並發

`updateResults()` 回呼在每個請求完成後呼叫：

![請求進度](progress.png){width=700}

此程式碼不包含並發。它是循序的，因此您不需要同步。

最好的選擇是並發傳送請求，並在取得每個儲存庫的回應後更新中間結果：

![並發請求](progress-and-concurrency.png){width=700}

要添加並發，請使用 _通道_。

## 通道

編寫具有共享可變狀態的程式碼相當困難且容易出錯（就像在回呼解決方案中一樣）。一種更簡單的方法是透過通訊而不是使用公共可變狀態來共享資訊。協程可以透過 _通道_ 相互通訊。

通道是通訊原語，允許資料在協程之間傳遞。一個協程可以向通道 _傳送_ 一些資訊，而另一個協程可以從中 _接收_ 該資訊：

![使用通道](using-channel.png)

傳送（生產）資訊的協程通常稱為生產者，而接收（消費）資訊的協程稱為消費者。一個或多個協程可以向同一個通道傳送資訊，一個或多個協程可以從中接收資料：

![許多協程使用通道](using-channel-many-coroutines.png)

當許多協程從同一個通道接收資訊時，每個元素只會由其中一個消費者處理一次。一旦元素被處理，它會立即從通道中移除。

您可以將通道視為類似於元素的集合，或者更準確地說，一個佇列，其中元素從一端添加並從另一端接收。然而，有一個重要的區別：與集合不同，即使是它們的同步版本，通道也可以 _暫停_ `send()` 和 `receive()` 操作。當通道為空或已滿時，就會發生這種情況。如果通道大小有上限，則通道可能已滿。

`Channel` 由三個不同的介面表示：`SendChannel`、`ReceiveChannel` 和 `Channel`，其中後者擴展了前兩個。您通常會建立一個通道並將其作為 `SendChannel` 實例提供給生產者，以便只有它們可以將資訊傳送到通道。您將通道作為 `ReceiveChannel` 實例提供給消費者，以便只有它們可以從中接收資料。`send` 和 `receive` 方法都聲明為 `suspend`：

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

生產者可以關閉通道，表示不再有元素傳入。

函式庫中定義了幾種型別的通道。它們的區別在於可以內部儲存多少個元素以及 `send()` 呼叫是否可以被暫停。對於所有通道型別，`receive()` 呼叫的行為相似：如果通道不為空，它會接收一個元素；否則，它會被暫停。

<deflist collapsible="true">
   <def title="無限制通道">
       <p>無限制通道最接近佇列：生產者可以將元素傳送到此通道，並且它會無限期地增長。<code>send()</code> 呼叫永遠不會被暫停。如果程式記憶體不足，您將會得到 <code>OutOfMemoryException</code>。無限制通道和佇列之間的區別在於，當消費者嘗試從空通道接收時，它會被暫停，直到傳送一些新的元素。</p>
       <img src="unlimited-channel.png" alt="無限制通道" width="500"/>
   </def>
   <def title="緩衝通道">
       <p>緩衝通道的大小受指定數量限制。生產者可以將元素傳送到此通道，直到達到大小限制。所有元素都內部儲存。當通道已滿時，對其的下一個 <code>send</code> 呼叫將被暫停，直到有更多的可用空間。</p>
       <img src="buffered-channel.png" alt="緩衝通道" width="500"/>
   </def>
   <def title="會合通道">
       <p>「會合」通道是沒有緩衝區的通道，與零大小的緩衝通道相同。其中一個函式（<code>send()</code> 或 <code>receive()</code>）總是會暫停，直到另一個被呼叫。如果呼叫了 <code>send()</code> 函式，並且沒有暫停的 <code>receive()</code> 呼叫準備好處理元素，那麼 <code>send()</code> 會暫停。類似地，如果呼叫了 <code>receive()</code> 函式，並且通道是空的，或者換句話說，沒有暫停的 <code>send()</code> 呼叫準備好傳送元素，那麼 <code>receive()</code> 呼叫會暫停。「會合」名稱（「在約定的時間和地點會面」）指的是 <code>send()</code> 和 <code>receive()</code> 應該「準時會合」的事實。</p>
       <img src="rendezvous-channel.png" alt="會合通道" width="500"/>
   </def>
   <def title="匯流通道">
       <p>傳送到匯流通道的新元素將覆蓋先前傳送的元素，因此接收者將始終只接收到最新的元素。<code>send()</code> 呼叫永遠不會暫停。</p>
       <img src="conflated-channel.gif" alt="匯流通道" width="500"/>
   </def>
</deflist>

當您建立通道時，請指定其型別或緩衝區大小（如果您需要緩衝通道）：

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

預設情況下，會建立一個「會合」通道。

在以下任務中，您將建立一個「會合」通道、兩個生產者協程和一個消費者協程：

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

> 觀看[此影片](https://www.youtube.com/watch?v=HpWQUoVURWQ)以更好地了解通道。
>
{style="tip"}

### 任務 7

在 `src/tasks/Request7Channels.kt` 中，實作 `loadContributorsChannels()` 函式，該函式同時並發請求所有 GitHub 貢獻者並顯示中間進度。

使用先前的函式：`Request5Concurrent.kt` 中的 `loadContributorsConcurrent()` 和 `Request6Progress.kt` 中的 `loadContributorsProgress()`。

#### 任務 7 的提示 {initial-collapse-state="collapsed" collapsible="true"}

並發接收不同儲存庫貢獻者列表的不同協程可以將所有接收到的結果傳送到同一個通道：

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

然後可以逐一接收並處理來自此通道的元素：

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

由於 `receive()` 呼叫是循序的，因此不需要額外的同步。

#### 任務 7 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

與 `loadContributorsProgress()` 函式一樣，您可以建立一個 `allUsers` 變數來儲存「所有貢獻者」列表的中間狀態。從通道接收到的每個新列表都會被添加到所有使用者列表中。您會聚合結果並使用 `updateResults` 回呼更新狀態：

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

*   不同儲存庫的結果會在準備就緒後立即添加到通道中。最初，當所有請求都已傳送且未接收到任何資料時，`receive()` 呼叫會被暫停。在這種情況下，整個「載入貢獻者」協程會被暫停。
*   然後，當使用者列表傳送到通道時，「載入貢獻者」協程會恢復，`receive()` 呼叫會回傳此列表，並且結果會立即更新。

您現在可以執行程式並選擇 _CHANNELS_ 選項來載入貢獻者並查看結果。

儘管協程和通道都不能完全消除並發帶來的複雜性，但當您需要了解發生了什麼時，它們會讓事情變得更容易。

## 測試協程

現在讓我們測試所有解決方案，以檢查使用並發協程的解決方案是否比使用 `suspend` 函式的解決方案更快，並檢查使用通道的解決方案是否比簡單的「進度」解決方案更快。

在以下任務中，您將比較解決方案的總執行時間。您將模擬一個 GitHub 服務，並使該服務在給定逾時後回傳結果：

```text
repos 請求 - 在 1000 毫秒延遲內回傳答案
repo-1 - 1000 毫秒延遲
repo-2 - 1200 毫秒延遲
repo-3 - 800 毫秒延遲
```

使用 `suspend` 函式的循序解決方案應該需要約 4000 毫秒（4000 = 1000 + (1000 + 1200 + 800)）。並發解決方案應該需要約 2200 毫秒（2200 = 1000 + max(1000, 1200, 800)）。

對於顯示進度的解決方案，您還可以檢查帶有時間戳的中間結果。

相應的測試資料定義在 `test/contributors/testData.kt` 中，檔案 `Request4SuspendKtTest`、`Request7ChannelsKtTest` 等包含使用模擬服務呼叫的簡單測試。

然而，這裡有兩個問題：

*   這些測試執行時間過長。每個測試大約需要 2 到 4 秒，而且您每次都需要等待結果。這不是很有效率。
*   您不能依賴解決方案的確切執行時間，因為準備和執行程式碼仍需要額外時間。您可以添加一個常數，但隨後時間會因機器而異。模擬服務延遲應該高於此常數，以便您可以看到差異。如果常數是 0.5 秒，那麼將延遲設定為 0.1 秒是不夠的。

一種更好的方法是使用特殊框架在多次執行相同程式碼的同時測試時間（這會進一步增加總時間），但這學習和設置起來很複雜。

為了解決這些問題，並確保具有所提供測試延遲的解決方案按預期執行，即一個比另一個快，請使用具有特殊測試調度器的 _虛擬_ 時間。該調度器會記錄從開始經過的虛擬時間，並立即即時執行所有內容。當您在此調度器上執行協程時，`delay` 將立即回傳並推進虛擬時間。

使用此機制的測試執行速度很快，但您仍然可以檢查虛擬時間不同時刻發生的情況。總執行時間顯著減少：

![總執行時間比較](time-comparison.png){width=700}

要使用虛擬時間，請將 `runBlocking` 呼叫替換為 `runTest`。`runTest` 接受一個擴充 Lambda 給 `TestScope` 作為參數。當您在此特殊作用域內從 `suspend` 函式中呼叫 `delay` 時，`delay` 將會增加虛擬時間，而不是實時延遲：

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

您可以使用 `TestScope` 的 `currentTime` 屬性來檢查目前的虛擬時間。

本範例中實際執行時間為數毫秒，而虛擬時間等於延遲參數，即 1000 毫秒。

為了在子協程中獲得「虛擬」`delay` 的完整效果，請使用 `TestDispatcher` 啟動所有子協程。否則，它將無法運作。此調度器會自動從其他 `TestScope` 繼承，除非您提供不同的調度器：

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

如果上述範例中 `launch` 在 `Dispatchers.Default` 的上下文中被呼叫，則測試將失敗。您將會收到一個例外，表示 Job 尚未完成。

只有當 `loadContributorsConcurrent()` 函式以繼承的上下文啟動子協程，而不使用 `Dispatchers.Default` 調度器修改其上下文時，您才能以這種方式測試該函式。

您可以在 _呼叫_ 函式時指定上下文元素（如調度器），而不是在 _定義_ 函式時指定，這提供了更大的靈活性和更簡單的測試。

> 支援虛擬時間的測試 API 為 [實驗性](components-stability.md) 功能，將來可能會有所變更。
>
{style="warning"}

預設情況下，如果您使用實驗性測試 API，編譯器會顯示警告。若要抑制這些警告，請使用 `@OptIn(ExperimentalCoroutinesApi::class)` 註解測試函式或包含測試的整個類別。新增編譯器參數，指示編譯器您正在使用實驗性 API：

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

在本教程對應的專案中，編譯器參數已添加到 Gradle 腳本中。

### 任務 8

重構 `tests/tasks/` 中的以下測試，使其使用虛擬時間而非實時：

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

比較重構前後的總執行時間。

#### 任務 8 的提示 {initial-collapse-state="collapsed" collapsible="true"}

1.  將 `runBlocking` 呼叫替換為 `runTest`，並將 `System.currentTimeMillis()` 替換為 `currentTime`：

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  取消檢查確切虛擬時間的斷言註解。
3.  不要忘記添加 `@UseExperimental(ExperimentalCoroutinesApi::class)`。

#### 任務 8 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

以下是並發和通道案例的解決方案：

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

首先，檢查結果是否剛好在預期的虛擬時間可用，然後再檢查結果本身：

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

通道的最後一個版本的第一個中間結果比進度版本更早可用，您可以在使用虛擬時間的測試中看到差異。

> 其餘「暫停」和「進度」任務的測試非常相似——您可以在專案的 `solutions` 分支中找到它們。
>
{style="tip"}

## 接下來是什麼

*   查看 KotlinConf 上的 [Asynchronous Programming with Kotlin](https://kotlinconf.com/workshops/) 工作坊。
*   了解更多關於使用 [虛擬時間和實驗性測試套件](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/) 的資訊。