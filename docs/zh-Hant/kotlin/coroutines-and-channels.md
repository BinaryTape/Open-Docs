<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程與通道 – 教程)

在本教程中，您將學習如何在 IntelliJ IDEA 中使用協程 (coroutines) 來執行網路請求，而不會阻塞底層執行緒或回調 (callbacks)。

> 讀者無需具備協程先備知識，但預期應熟悉基本的 Kotlin 語法。
>
{style="tip"}

您將學到：

*   為何以及如何使用暫停函數 (suspending functions) 來執行網路請求。
*   如何使用協程並行 (concurrently) 發送請求。
*   如何使用通道 (channels) 在不同協程之間共享資訊。

對於網路請求，您需要 [Retrofit](https://square.github.io/retrofit/) 函式庫，但本教程中所示的方法對於任何其他支援協程的函式庫也同樣適用。

> 您可以在本專案儲存庫 (repository) 的 `solutions` 分支中找到所有任務的解決方案：[project's repository](http://github.com/kotlin-hands-on/intro-coroutines)。
>
{style="tip"}

## 開始之前

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  透過在歡迎畫面選擇 **Get from VCS** 或選擇 **File | New | Project from Version Control** 來克隆 (clone) [專案模板](http://github.com/kotlin-hands-on/intro-coroutines)。

    您也可以從命令列克隆：

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### 生成 GitHub 開發者令牌

您將在專案中使用 GitHub API。為了獲得存取權限，請提供您的 GitHub 帳戶名稱以及密碼或令牌。如果您啟用了雙重驗證，則令牌就足夠了。

前往 [您的帳戶](https://github.com/settings/tokens/new) 以生成一個新的 GitHub 令牌來使用 GitHub API：

1.  指定令牌的名稱，例如 `coroutines-tutorial`：

    ![Generate a new GitHub token](generating-token.png){width=700}

2.  不要選擇任何作用域 (scopes)。點擊頁面底部的 **Generate token**。
3.  複製生成的令牌。

### 執行程式碼

該程式會載入給定組織（預設為「kotlin」）下所有儲存庫的貢獻者。稍後，您將添加邏輯來根據貢獻數量對使用者進行排序。

1.  開啟 `src/contributors/main.kt` 檔案並執行 `main()` 函數。您將看到以下視窗：

    ![First window](initial-window.png){width=500}

    如果字體太小，請透過修改 `main()` 函數中的 `setDefaultFontSize(18f)` 值來調整。

2.  在相應欄位中提供您的 GitHub 使用者名稱和令牌（或密碼）。
3.  確保在 _Variant_ 下拉選單中選擇了 _BLOCKING_ 選項。
4.  點擊 _Load contributors_。UI 會凍結一段時間，然後顯示貢獻者列表。
5.  開啟程式輸出以確保數據已載入。每次成功請求後，貢獻者列表都會被記錄下來。

有不同的方式來實現此邏輯：使用 [阻塞請求](#blocking-requests) 或 [回調](#callbacks)。您將把這些解決方案與使用 [協程](#coroutines) 的解決方案進行比較，並了解 [通道](#channels) 如何用於在不同協程之間共享資訊。

## 阻塞請求

您將使用 [Retrofit](https://square.github.io/retrofit/) 函式庫向 GitHub 執行 HTTP 請求。它允許請求給定組織下的儲存庫列表以及每個儲存庫的貢獻者列表：

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

這個 API 被 `loadContributorsBlocking()` 函數用於獲取給定組織的貢獻者列表。

1.  開啟 `src/tasks/Request1Blocking.kt` 以查看其實現：

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

    *   首先，您會獲取給定組織下的儲存庫列表並將其儲存在 `repos` 列表中。然後對於每個儲存庫，都會請求其貢獻者列表，並將所有列表合併成一個最終的貢獻者列表。
    *   `getOrgReposCall()` 和 `getRepoContributorsCall()` 都返回一個 `*Call` 類別的實例 (`#1`)。此時，尚未發送請求。
    *   然後調用 `*Call.execute()` 來執行請求 (`#2`)。`execute()` 是一個同步 (synchronous) 調用，它會阻塞底層執行緒。
    *   當您收到響應時，會透過調用特定的 `logRepos()` 和 `logUsers()` 函數來記錄結果 (`#3`)。如果 HTTP 響應包含錯誤，該錯誤將在此處記錄。
    *   最後，獲取響應的主體 (body)，其中包含您需要的數據。在本教程中，如果出現錯誤，您將使用空列表作為結果，並記錄相應的錯誤 (`#4`)。

2.  為避免重複 `.body() ?: emptyList()`，聲明了一個擴充函數 `bodyList()`：

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

    *   每行的第一個項目是程式啟動以來經過的毫秒數，然後是方括號中的執行緒名稱。您可以從中看到是哪個執行緒調用了載入請求。
    *   每行的最後一個項目是實際訊息：載入了多少個儲存庫或貢獻者。

    此日誌輸出表明所有結果都是從主執行緒記錄的。當您使用 _BLOCKING_ 選項執行程式碼時，視窗會凍結，直到載入完成才會對輸入作出反應。所有請求都從與調用 `loadContributorsBlocking()` 相同的執行緒執行，該執行緒是主 UI 執行緒（在 Swing 中，它是 AWT 事件分派執行緒）。這個主執行緒被阻塞，這就是 UI 凍結的原因：

    ![The blocked main thread](blocking.png){width=700}

    貢獻者列表載入後，結果會更新。

4.  在 `src/contributors/Contributors.kt` 中，找到負責選擇貢獻者載入方式的 `loadContributors()` 函數，並查看 `loadContributorsBlocking()` 是如何被調用的：

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 調用緊跟在 `loadContributorsBlocking()` 調用之後。
    *   `updateResults()` 會更新 UI，因此它必須始終從 UI 執行緒調用。
    *   由於 `loadContributorsBlocking()` 也是從 UI 執行緒調用的，UI 執行緒因此被阻塞，導致 UI 凍結。

### 任務 1

第一個任務幫助您熟悉任務領域。目前，每個貢獻者的名字會重複多次，每個他們參與的專案都會重複一次。請實現 `aggregate()` 函數，將使用者合併，使每個貢獻者只被添加一次。`User.contributions` 屬性應包含該使用者對*所有*專案的總貢獻數。結果列表應根據貢獻數降序排序。

開啟 `src/tasks/Aggregation.kt` 並實現 `List<User>.aggregate()` 函數。使用者應按其總貢獻數排序。

相應的測試檔案 `test/tasks/AggregationKtTest.kt` 顯示了一個預期結果的範例。

> 您可以使用 [IntelliJ IDEA 快捷鍵](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation) `Ctrl+Shift+T` / `⇧ ⌘ T` 在原始碼和測試類別之間自動跳轉。
>
{style="tip"}

完成此任務後，「kotlin」組織的結果列表應類似於以下內容：

![The list for the "kotlin" organization](aggregate.png){width=500}

#### 任務 1 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

1.  若要按登入名分組使用者，請使用 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)，它返回一個從登入名到該登入名在不同儲存庫中所有出現的使用者實例的映射。
2.  對於每個映射條目，計算每個使用者的總貢獻數，並透過給定的名稱和總貢獻數創建一個新的 `User` 類別實例。
3.  將結果列表降序排序：

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

另一個解決方案是使用 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) 函數而不是 `groupBy()`。

## 回調

前面的解決方案有效，但它會阻塞執行緒，從而凍結 UI。一種避免這種情況的傳統方法是使用*回調 (callbacks)*。

您可以將操作完成後應調用的程式碼提取到一個單獨的回調中（通常是一個 lambda），並將該 lambda 傳遞給調用者，以便稍後調用它。

為了使 UI 響應迅速，您可以將整個計算移到一個單獨的執行緒，或者切換到使用回調而不是阻塞調用的 Retrofit API。

### 使用背景執行緒

1.  開啟 `src/tasks/Request2Background.kt` 並查看其實現。首先，將整個計算移到另一個執行緒。`thread()` 函數會啟動一個新執行緒：

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    現在，所有載入都已移至單獨的執行緒，主執行緒是空閒的，可以被其他任務佔用：

    ![The freed main thread](background.png){width=700}

2.  `loadContributorsBackground()` 函數的簽名 (signature) 發生了變化。它將 `updateResults()` 回調作為最後一個參數，以便在所有載入完成後調用它：

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  現在當 `loadContributorsBackground()` 被調用時，`updateResults()` 調用會進入回調，而不是像以前那樣立即調用：

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    透過調用 `SwingUtilities.invokeLater`，您可以確保 `updateResults()` 調用（它會更新結果）發生在主 UI 執行緒（AWT 事件分派執行緒）上。

然而，如果您嘗試透過 `BACKGROUND` 選項載入貢獻者，您會發現列表已更新但沒有任何變化。

### 任務 2

修復 `src/tasks/Request2Background.kt` 中的 `loadContributorsBackground()` 函數，以便結果列表顯示在 UI 中。

#### 任務 2 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

如果您嘗試載入貢獻者，您可以在日誌中看到貢獻者已載入，但結果並未顯示。為了解決這個問題，請對結果使用者列表調用 `updateResults()`：

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

請務必明確調用回調中傳遞的邏輯。否則，什麼都不會發生。

### 使用 Retrofit 回調 API

在之前的解決方案中，整個載入邏輯被移到了背景執行緒，但這仍然不是資源的最佳利用方式。所有載入請求都是循序執行的，並且執行緒在等待載入結果時被阻塞，而它本可以被其他任務佔用。具體來說，執行緒可以開始載入另一個請求以提前接收整個結果。

然後，每個儲存庫的數據處理應分為兩部分：載入和處理結果響應。第二個*處理 (processing)*部分應提取到回調中。

然後，可以在收到前一個儲存庫的結果（並調用相應的回調）之前，啟動每個儲存庫的載入：

![Using callback API](callbacks.png){width=700}

Retrofit 回調 API 可以幫助實現這一點。`Call.enqueue()` 函數啟動一個 HTTP 請求並將回調作為參數。在這個回調中，您需要指定每個請求後需要做什麼。

開啟 `src/tasks/Request3Callbacks.kt` 並查看使用此 API 的 `loadContributorsCallbacks()` 實現：

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

*   為方便起見，此程式碼片段使用了在同一檔案中聲明的 `onResponse()` 擴充函數。它將 lambda 作為參數，而不是物件表達式。
*   處理響應的邏輯被提取到回調中：相應的 lambda 從 `#1` 和 `#2` 行開始。

但是，提供的解決方案不起作用。如果您執行程式並選擇 _CALLBACKS_ 選項載入貢獻者，您會發現什麼都沒有顯示。然而，`Request3CallbacksKtTest` 中的測試會立即返回其成功通過的結果。

思考一下為什麼給定的程式碼沒有按預期工作，並嘗試修復它，或查看下面的解決方案。

### 任務 3 (可選)

重寫 `src/tasks/Request3Callbacks.kt` 檔案中的程式碼，使載入的貢獻者列表顯示出來。

#### 任務 3 的第一次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

在目前的解決方案中，許多請求同時開始，這減少了總載入時間。但是，結果沒有載入。這是因為 `updateResults()` 回調在所有載入請求開始後立即調用，此時 `allUsers` 列表尚未填充數據。

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

*   首先，您使用索引遍歷儲存庫列表 (`#1`)。
*   然後，從每個回調中，您檢查是否是最後一次迭代 (`#2`)。
*   如果是這種情況，則更新結果。

然而，這段程式碼也未能實現我們的目標。請嘗試自己找到答案，或查看下面的解決方案。

#### 任務 3 的第二次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

由於載入請求是同時開始的，因此無法保證最後一個請求的結果最後才到達。結果可能以任何順序到達。

因此，如果您將當前索引與 `lastIndex` 作為完成條件進行比較，您可能會丟失某些儲存庫的結果。

如果處理最後一個儲存庫的請求比某些先前的請求更快地返回（這很可能會發生），則需要更多時間的請求的所有結果都將丟失。

一種修復方法是引入一個索引並檢查所有儲存庫是否都已處理：

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

此程式碼使用列表的同步版本和 `AtomicInteger()`，因為一般而言，無法保證處理 `getRepoContributors()` 請求的不同回調將始終從同一執行緒調用。

#### 任務 3 的第三次嘗試解決方案 {initial-collapse-state="collapsed" collapsible="true"}

更好的解決方案是使用 `CountDownLatch` 類別。它儲存一個計數器，該計數器以儲存庫數量初始化。在處理每個儲存庫後，此計數器遞減。然後它會等到計數器歸零後才更新結果：

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

結果然後從主執行緒更新。這比將邏輯委託給子執行緒更直接。

在審查了這三種解決方案嘗試後，您可以看到使用回調編寫正確的程式碼並非易事且容易出錯，尤其是在涉及多個底層執行緒和同步的情況下。

> 作為額外練習，您可以使用 RxJava 函式庫以反應式 (reactive) 方法實現相同的邏輯。所有必要的依賴項和使用 RxJava 的解決方案都可以在單獨的 `rx` 分支中找到。也可以完成本教程並實現或檢查建議的 Rx 版本以進行適當的比較。
>
{style="tip"}

## 暫停函數

您可以使用暫停函數 (suspending functions) 來實現相同的邏輯。與其返回 `Call<List<Repo>>`，不如將 API 調用定義為 [暫停函數](composing-suspending-functions.md) 如下：

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()` 被定義為一個 `suspend` 函數。當您使用暫停函數來執行請求時，底層執行緒不會被阻塞。有關其工作原理的更多細節將在後續章節中介紹。
*   `getOrgRepos()` 直接返回結果，而不是返回 `Call`。如果結果不成功，則拋出異常。

或者，Retrofit 允許將結果包裝在 `Response` 中返回。在這種情況下，會提供結果主體，並且可以手動檢查錯誤。本教程使用返回 `Response` 的版本。

在 `src/contributors/GitHubService.kt` 中，向 `GitHubService` 介面添加以下聲明：

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

您的任務是更改載入貢獻者的函數程式碼，以利用兩個新的暫停函數 `getOrgRepos()` 和 `getRepoContributors()`。新的 `loadContributorsSuspend()` 函數被標記為 `suspend` 以使用新的 API。

> 暫停函數不能在任何地方調用。從 `loadContributorsBlocking()` 調用暫停函數將導致錯誤，訊息為「Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function」。
>
{style="note"}

1.  將 `src/tasks/Request1Blocking.kt` 中定義的 `loadContributorsBlocking()` 實現複製到 `src/tasks/Request4Suspend.kt` 中定義的 `loadContributorsSuspend()` 中。
2.  修改程式碼，使其使用新的暫停函數，而不是返回 `Call` 的函數。
3.  選擇 _SUSPEND_ 選項執行程式，並確保在執行 GitHub 請求時 UI 仍然響應迅速。

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

*   `loadContributorsSuspend()` 應定義為 `suspend` 函數。
*   您不再需要調用之前返回 `Response` 的 `execute`，因為現在 API 函數直接返回 `Response`。請注意，此細節特定於 Retrofit 函式庫。對於其他函式庫，API 會有所不同，但概念是相同的。

## 協程

使用暫停函數的程式碼看起來與「阻塞 (blocking)」版本相似。與阻塞版本的主要區別在於，協程不是阻塞執行緒，而是被暫停：

```text
block -> suspend
thread -> coroutine
```

> 協程通常被稱為輕量級執行緒，因為您可以在協程上執行程式碼，類似於在執行緒上執行程式碼的方式。以前會阻塞的操作（必須避免）現在可以暫停協程。
>
{style="note"}

### 啟動新的協程

如果您查看 `src/contributors/Contributors.kt` 中 `loadContributorsSuspend()` 的用法，您會發現它是在 `launch` 內部調用的。`launch` 是一個函式庫函數，它接受一個 lambda 作為參數：

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

這裡 `launch` 啟動了一個新的計算，負責載入數據並顯示結果。該計算是可暫停的——當執行網路請求時，它會被暫停並釋放底層執行緒。當網路請求返回結果時，計算會恢復。

這種可暫停的計算稱為*協程 (coroutine)*。因此，在這種情況下，`launch` *啟動了一個新的協程*，負責載入數據和顯示結果。

協程在執行緒之上運行並可以被暫停。當協程被暫停時，相應的計算會被暫停，從執行緒中移除，並儲存在記憶體中。同時，執行緒可以自由地被其他任務佔用：

![Suspending coroutines](suspension-process.gif){width=700}

當計算準備好繼續時，它會返回到一個執行緒（不一定是同一個）。

在 `loadContributorsSuspend()` 範例中，每個「貢獻者」請求現在都使用暫停機制等待結果。首先，發送新的請求。然後，在等待響應時，由 `launch` 函數啟動的整個「載入貢獻者」協程被暫停。

協程僅在收到相應響應後才會恢復：

![Suspending request](suspend-requests.png){width=700}

在等待響應時，執行緒可以自由地被其他任務佔用。儘管所有請求都在主 UI 執行緒上進行，但 UI 仍然保持響應迅速：

1.  使用 _SUSPEND_ 選項執行程式。日誌確認所有請求都已發送到主 UI 執行緒：

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  日誌可以顯示對應程式碼正在哪個協程上運行。要啟用它，請開啟 **Run | Edit configurations** 並添加 `-Dkotlinx.coroutines.debug` VM 選項：

    ![Edit run configuration](run-configuration.png){width=500}

    使用此選項運行 `main()` 時，協程名稱將附加到執行緒名稱。您也可以修改運行所有 Kotlin 檔案的模板，並預設啟用此選項。

現在所有程式碼都在一個協程上運行，即上面提到的「載入貢獻者」協程，表示為 `@coroutine#1`。在等待結果時，您不應將執行緒重用於發送其他請求，因為程式碼是循序寫入的。新的請求只會在收到前一個結果時發送。

暫停函數對待執行緒公平，不會為了「等待」而阻塞它。然而，這尚未將任何並行性 (concurrency) 帶入其中。

## 並行

Kotlin 協程比執行緒佔用的資源少得多。每次您想要非同步 (asynchronously) 啟動新計算時，都可以創建一個新的協程。

要啟動新的協程，請使用主要*協程構建器 (coroutine builders)* 之一：`launch`、`async` 或 `runBlocking`。不同的函式庫可以定義額外的協程構建器。

`async` 啟動一個新的協程並返回一個 `Deferred` 物件。`Deferred` 代表一個在其他名稱下也已知的概念，例如 `Future` 或 `Promise`。它儲存一個計算，但它*延遲 (defers)* 您獲取最終結果的時刻；它*承諾 (promises)* 未來某個時候的結果。

`async` 和 `launch` 的主要區別在於，`launch` 用於啟動預期不會返回特定結果的計算。`launch` 返回一個代表協程的 `Job`。可以透過調用 `Job.join()` 來等待它完成。

`Deferred` 是一個通用類型，它擴展了 `Job`。`async` 調用可以返回 `Deferred<Int>` 或 `Deferred<CustomType>`，具體取決於 lambda 返回的內容（lambda 內的最後一個表達式就是結果）。

要獲取協程的結果，您可以對 `Deferred` 實例調用 `await()`。在等待結果時，調用此 `await()` 的協程會被暫停：

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

`runBlocking` 用作常規函數和暫停函數之間，或阻塞世界和非阻塞世界之間的橋樑。它作為啟動頂層主協程的適配器。它主要用於 `main()` 函數和測試中。

> 觀看 [此影片](https://www.youtube.com/watch?v=zEZc5AmHQhk) 以更好地理解協程。
>
{style="tip"}

如果有一個延遲物件 (deferred objects) 列表，您可以調用 `awaitAll()` 來等待它們所有結果：

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

當每個「貢獻者」請求在新協程中啟動時，所有請求都會非同步啟動。新的請求可以在收到前一個請求的結果之前發送：

![Concurrent coroutines](concurrency.png){width=700}

總載入時間與 _CALLBACKS_ 版本大致相同，但它不需要任何回調。更重要的是，`async` 明確強調了程式碼中哪些部分是並行執行的。

### 任務 5

在 `Request5Concurrent.kt` 檔案中，使用先前的 `loadContributorsSuspend()` 函數實現 `loadContributorsConcurrent()` 函數。

#### 任務 5 的提示 {initial-collapse-state="collapsed" collapsible="true"}

您只能在協程作用域 (coroutine scope) 內啟動新的協程。將 `loadContributorsSuspend()` 的內容複製到 `coroutineScope` 調用中，這樣您就可以在那裡調用 `async` 函數：

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

將每個「貢獻者」請求用 `async` 包裹，以創建與儲存庫數量相同的協程。`async` 返回 `Deferred<List<User>>`。這不是問題，因為創建新的協程的資源消耗非常小，因此您可以創建任意數量的協程。

1.  您不能再使用 `flatMap`，因為 `map` 的結果現在是一個 `Deferred` 物件列表，而不是一個列表的列表。`awaitAll()` 返回 `List<List<User>>`，因此調用 `flatten().aggregate()` 來獲取結果：

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

2.  執行程式碼並檢查日誌。所有協程仍然在主 UI 執行緒上運行，因為尚未啟用多執行緒，但您已經可以看到並行運行協程的好處。
3.  要將此程式碼更改為在通用執行緒池的不同執行緒上運行「貢獻者」協程，請將 `Dispatchers.Default` 指定為 `async` 函數的上下文參數：

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher` 決定相應的協程應在哪個或哪些執行緒上運行。如果您未將其指定為參數，`async` 將使用外部作用域的分派器 (dispatcher)。
    *   `Dispatchers.Default` 表示 JVM 上執行緒的共享池。此池提供了一種並行執行的手段。它包含與可用 CPU 核心數相同的執行緒數，但如果只有一個核心，它仍然會有兩個執行緒。

4.  修改 `loadContributorsConcurrent()` 函數中的程式碼，以在通用執行緒池的不同執行緒上啟動新協程。此外，在發送請求之前添加額外的日誌記錄：

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  再次執行程式。在日誌中，您可以看到每個協程都可以在執行緒池中的一個執行緒上啟動，並在另一個執行緒上恢復：

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

在 `src/contributors/Contributors.kt` 中，檢查 _CONCURRENT_ 選項的實現：

1.  若要僅在主 UI 執行緒上執行協程，請將 `Dispatchers.Main` 指定為參數：

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   如果主執行緒在您啟動新協程時正忙，則該協程將被暫停並安排在此執行緒上執行。協程只有在執行緒空閒時才會恢復。
    *   通常認為使用外部作用域的分派器而不是在每個終點顯式指定它是個好習慣。如果您定義 `loadContributorsConcurrent()` 時不傳遞 `Dispatchers.Default` 作為參數，則可以在任何上下文調用此函數：使用 `Default` 分派器，使用主 UI 執行緒，或使用自訂分派器。
    *   正如您稍後將看到的，從測試中調用 `loadContributorsConcurrent()` 時，您可以在 `TestDispatcher` 的上下文中調用它，這簡化了測試。這使得該解決方案更加靈活。

2.  要在調用端指定分派器，請對專案應用以下更改，同時讓 `loadContributorsConcurrent` 在繼承的上下文中啟動協程：

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 應在主 UI 執行緒上調用，因此您使用 `Dispatchers.Main` 的上下文調用它。
    *   `withContext()` 使用指定的協程上下文調用給定的程式碼，暫停直到它完成，並返回結果。另一種更冗長地表達此方式的方法是啟動一個新協程並明確等待（透過暫停）直到它完成：`launch(context) { ... }.join()`。

3.  執行程式碼並確保協程在執行緒池中的執行緒上執行。

## 結構化並行

*   *協程作用域 (coroutine scope)* 負責不同協程之間的結構和父子關係。新的協程通常需要在作用域內部啟動。
*   *協程上下文 (coroutine context)* 儲存用於運行給定協程的額外技術資訊，例如協程自訂名稱，或指定協程應在哪些執行緒上排程的分派器。

當使用 `launch`、`async` 或 `runBlocking` 啟動新協程時，它們會自動創建相應的作用域。所有這些函數都接受一個帶有接收器的 lambda 作為參數，而 `CoroutineScope` 是隱式接收器類型：

```kotlin
launch { /* this: CoroutineScope */ }
```

*   新的協程只能在作用域內啟動。
*   `launch` 和 `async` 被聲明為 `CoroutineScope` 的擴展，因此在調用它們時必須始終傳遞隱式或顯式接收器。
*   由 `runBlocking` 啟動的協程是唯一的例外，因為 `runBlocking` 被定義為頂層函數。但由於它會阻塞當前執行緒，因此主要用於 `main()` 函數和測試中作為橋接函數。

`runBlocking`、`launch` 或 `async` 內部的新協程會自動在作用域內啟動：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

當您在 `runBlocking` 內部調用 `launch` 時，它會作為 `CoroutineScope` 類型的隱式接收器的擴展來調用。或者，您也可以顯式寫 `this.launch`。

巢狀協程（在此範例中由 `launch` 啟動）可以被視為外部協程（由 `runBlocking` 啟動）的子協程。這種「父子」關係透過作用域起作用；子協程從與父協程相對應的作用域啟動。

可以使用 `coroutineScope` 函數創建一個新的作用域而不啟動新的協程。要在沒有外部作用域訪問權限的 `suspend` 函數中以結構化方式啟動新協程，您可以創建一個新的協程作用域，該作用域會自動成為調用此 `suspend` 函數的外部作用域的子作用域。`loadContributorsConcurrent()` 是一個很好的範例。

您還可以從全域作用域 (global scope) 使用 `GlobalScope.async` 或 `GlobalScope.launch` 啟動新的協程。這將創建一個頂層的「獨立」協程。

協程結構背後的機制稱為*結構化並行 (structured concurrency)*。它比全域作用域提供以下好處：

*   作用域通常負責子協程，它們的生命週期與作用域的生命週期相關聯。
*   如果出現問題或使用者改變主意並決定撤銷操作，作用域可以自動取消子協程。
*   作用域會自動等待所有子協程完成。因此，如果作用域對應於一個協程，則父協程不會完成，直到在其作用域內啟動的所有協程都已完成。

當使用 `GlobalScope.async` 時，沒有結構將多個協程綁定到一個較小的作用域。從全域作用域啟動的協程都是獨立的——它們的生命週期僅受整個應用程式的生命週期限制。可以儲存從全域作用域啟動的協程的引用並等待其完成或明確取消它，但這不會像結構化並行那樣自動發生。

### 取消貢獻者載入

創建兩個版本的函數來載入貢獻者列表。比較當您嘗試取消父協程時這兩個版本的行為。第一個版本將使用 `coroutineScope` 來啟動所有子協程，而第二個版本將使用 `GlobalScope`。

1.  在 `Request5Concurrent.kt` 中，將 3 秒延遲添加到 `loadContributorsConcurrent()` 函數中：

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

    延遲會影響所有發送請求的協程，這樣就有足夠的時間在協程啟動但請求發送之前取消載入。

2.  創建載入函數的第二個版本：將 `loadContributorsConcurrent()` 的實現複製到 `Request5NotCancellable.kt` 中的 `loadContributorsNotCancellable()` 中，然後刪除新的 `coroutineScope` 的創建。
3.  `async` 調用現在無法解析，因此使用 `GlobalScope.async` 啟動它們：

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

    *   函數現在直接返回結果，而不是作為 lambda 內部最後一個表達式返回（行 `#1` 和 `#3`）。
    *   所有「貢獻者」協程都在 `GlobalScope` 內部啟動，而不是作為協程作用域的子協程啟動（行 `#2`）。

4.  執行程式並選擇 _CONCURRENT_ 選項載入貢獻者。
5.  等待所有「貢獻者」協程啟動，然後點擊 _Cancel_。日誌顯示沒有新結果，這意味著所有請求確實已取消：

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

    在這種情況下，沒有協程被取消，並且所有請求仍然被發送。

7.  檢查「貢獻者」程式中取消是如何觸發的。當點擊 _Cancel_ 按鈕時，主要「載入」協程會被明確取消，而子協程則會自動取消：

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

`launch` 函數返回一個 `Job` 實例。`Job` 儲存著「載入協程」的引用，該協程負責載入所有數據並更新結果。您可以對它調用 `setUpCancellation()` 擴展函數（行 `#1`），將 `Job` 實例作為接收器傳遞。

另一種您可以表達此方式的方法是明確寫下：

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   為提高可讀性，您可以在函數內部使用新的 `loadingJob` 變數來引用 `setUpCancellation()` 函數接收器（行 `#2`）。
*   然後您可以為 _Cancel_ 按鈕添加一個監聽器，以便在點擊時取消 `loadingJob`（行 `#3`）。

透過結構化並行，您只需要取消父協程，這會自動將取消傳播到所有子協程。

### 使用外部作用域的上下文

當您在給定作用域內啟動新協程時，更容易確保所有協程都使用相同的上下文。如果需要，替換上下文也更容易。

現在是時候了解使用外部作用域的分派器如何工作了。由 `coroutineScope` 或協程構建器創建的新作用域總是繼承外部作用域的上下文。在本例中，外部作用域是調用 `suspend loadContributorsConcurrent()` 函數的作用域：

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

所有巢狀協程都會自動以繼承的上下文啟動。分派器是此上下文的一部分。這就是為什麼所有由 `async` 啟動的協程都以預設分派器的上下文啟動：

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

透過結構化並行，您可以在創建頂層協程時一次性指定主要上下文元素（如分派器）。然後，所有巢狀協程都會繼承該上下文，並且僅在需要時才修改它。

> 當您為 UI 應用程式（例如 Android 應用程式）編寫協程程式碼時，通常會預設為頂層協程使用 `CoroutineDispatchers.Main`，然後在需要將程式碼運行在不同執行緒時明確放置不同的分派器。
>
{style="tip"}

## 顯示進度

儘管某些儲存庫的資訊載入速度相當快，但使用者只有在所有數據載入完畢後才能看到結果列表。在此之前，載入圖示會一直運行以顯示進度，但沒有關於當前狀態或已載入哪些貢獻者的資訊。

您可以提前顯示中間結果，並在載入每個儲存庫的數據後顯示所有貢獻者：

![Loading data](loading.gif){width=500}

要實現此功能，在 `src/tasks/Request6Progress.kt` 中，您需要將更新 UI 的邏輯作為回調傳遞，以便在每個中間狀態調用它：

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

在 `Contributors.kt` 的調用端，將回調傳遞給 `Main` 執行緒以更新 _PROGRESS_ 選項的結果：

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()` 參數在 `loadContributorsProgress()` 中聲明為 `suspend`。必須在相應的 lambda 參數內部調用 `withContext`，它是一個 `suspend` 函數。
*   `updateResults()` 回調接受一個額外的布林參數作為參數，指定載入是否已完成並且結果是否為最終結果。

### 任務 6

在 `Request6Progress.kt` 檔案中，實現 `loadContributorsProgress()` 函數，該函數會顯示中間進度。基於 `Request4Suspend.kt` 中的 `loadContributorsSuspend()` 函數。

*   使用不帶並行 (concurrency) 的簡單版本；稍後在下一節中您將添加它。
*   貢獻者的中間列表應以「聚合 (aggregated)」狀態顯示，而不僅僅是為每個儲存庫載入的使用者列表。
*   當每個新儲存庫的數據載入後，每個使用者的總貢獻數應增加。

#### 任務 6 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

要以「聚合」狀態儲存已載入貢獻者的中間列表，請定義一個 `allUsers` 變數來儲存使用者列表，然後在每個新儲存庫的貢獻者載入後更新它：

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

#### 循序與並行

`updateResults()` 回調在每個請求完成後調用：

![Progress on requests](progress.png){width=700}

此程式碼不包含並行。它是循序執行的，因此您不需要同步。

最好的選擇是同時發送請求，並在獲取每個儲存庫的響應後更新中間結果：

![Concurrent requests](progress-and-concurrency.png){width=700}

要添加並行，請使用*通道 (channels)*。

## 通道

用共享可變狀態編寫程式碼非常困難且容易出錯（就像使用回調的解決方案中那樣）。一個更簡單的方法是透過通信而不是使用共同的可變狀態來共享資訊。協程可以透過*通道 (channels)* 相互通信。

通道是通信原語，允許在協程之間傳遞數據。一個協程可以*發送 (send)* 某些資訊到通道，而另一個協程可以從中*接收 (receive)* 該資訊：

![Using channels](using-channel.png)

發送（生產）資訊的協程通常稱為生產者，而接收（消費）資訊的協程稱為消費者。一個或多個協程可以向同一個通道發送資訊，並且一個或多個協程可以從中接收數據：

![Using channels with many coroutines](using-channel-many-coroutines.png)

當許多協程從同一個通道接收資訊時，每個元素只會被其中一個消費者處理一次。一旦元素被處理，它會立即從通道中移除。

您可以將通道視為類似於元素集合，或更準確地說，一個佇列 (queue)，其中元素從一端添加，從另一端接收。然而，有一個重要的區別：與集合不同，即使是同步版本，通道也可以*暫停 (suspend)* `send()` 和 `receive()` 操作。當通道為空或已滿時，就會發生這種情況。如果通道大小有上限，通道可能會已滿。

`Channel` 由三個不同的介面表示：`SendChannel`、`ReceiveChannel` 和 `Channel`，其中後者擴展了前兩者。您通常會創建一個通道並將其作為 `SendChannel` 實例給予生產者，以便只有它們才能向通道發送資訊。您將通道作為 `ReceiveChannel` 實例給予消費者，以便只有它們才能從中接收數據。`send` 和 `receive` 方法都聲明為 `suspend`：

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

生產者可以關閉通道，以表示不再有元素傳入。

函式庫中定義了幾種類型的通道。它們的區別在於它們可以內部儲存多少元素以及 `send()` 調用是否可以被暫停。對於所有通道類型，`receive()` 調用的行為相似：如果通道不為空，它會接收一個元素；否則，它會被暫停。

<deflist collapsible="true">
   <def title="無限通道 (Unlimited channel)">
       <p>無限通道是與佇列 (queue) 最接近的類比：生產者可以向此通道發送元素，並且它會無限期地增長。<code>send()</code> 調用將永遠不會被暫停。如果程式記憶體不足，您將收到 <code>OutOfMemoryException</code>。無限通道和佇列之間的區別在於，當消費者嘗試從空通道接收時，它會被暫停，直到發送一些新元素為止。</p>
       <img src="unlimited-channel.png" alt="Unlimited channel" width="500"/>
   </def>
   <def title="緩衝通道 (Buffered channel)">
       <p>緩衝通道的大小受指定數量限制。生產者可以向此通道發送元素，直到達到大小限制。所有元素都在內部儲存。當通道已滿時，下一個对其的 <code>send</code> 調用會被暫停，直到有更多可用空間為止。</p>
       <img src="buffered-channel.png" alt="Buffered channel" width="500"/>
   </def>
   <def title="會合通道 (Rendezvous channel)">
       <p>「會合 (Rendezvous)」通道是一個沒有緩衝區的通道，與零大小的緩衝通道相同。其中一個函數（<code>send()</code> 或 <code>receive()</code>）總是會被暫停，直到另一個被調用。如果調用 <code>send()</code> 函數且沒有準備好處理元素的暫停 <code>receive()</code> 調用，則 <code>send()</code> 會被暫停。類似地，如果調用 <code>receive()</code> 函數且通道為空，或者換句話說，沒有準備好發送元素的暫停 <code>send()</code> 調用，則 <code>receive()</code> 調用會被暫停。「會合」這個名字（「在約定的時間和地點會面」）指的是 <code>send()</code> 和 <code>receive()</code> 應該「按時會面」的事實。</p>
       <img src="rendezvous-channel.png" alt="Rendezvous channel" width="500"/>
   </def>
   <def title="匯流通道 (Conflated channel)">
       <p>發送到匯流通道的新元素將覆蓋先前發送的元素，因此接收者將始終只獲得最新的元素。<code>send()</code> 調用永遠不會被暫停。</p>
       <img src="conflated-channel.gif" alt="Conflated channel" width="500"/>
   </def>
</deflist>

當您創建通道時，請指定其類型或緩衝區大小（如果您需要緩衝區）：

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

預設情況下，會創建一個「會合」通道。

在下面的任務中，您將創建一個「會合」通道、兩個生產者協程和一個消費者協程：

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

> 觀看 [此影片](https://www.youtube.com/watch?v=HpWQUoVURWQ) 以更好地理解通道。
>
{style="tip"}

### 任務 7

在 `src/tasks/Request7Channels.kt` 中，實現 `loadContributorsChannels()` 函數，該函數會並行請求所有 GitHub 貢獻者並同時顯示中間進度。

使用之前的函數，`Request5Concurrent.kt` 中的 `loadContributorsConcurrent()` 和 `Request6Progress.kt` 中的 `loadContributorsProgress()`。

#### 任務 7 的提示 {initial-collapse-state="collapsed" collapsible="true"}

並行接收不同儲存庫貢獻者列表的不同協程可以將所有接收到的結果發送到同一個通道：

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

然後可以一個接一個地接收來自此通道的元素並進行處理：

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

由於 `receive()` 調用是循序的，因此不需要額外的同步。

#### 任務 7 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

與 `loadContributorsProgress()` 函數一樣，您可以創建一個 `allUsers` 變數來儲存「所有貢獻者」列表的中間狀態。從通道接收到的每個新列表都會添加到所有使用者列表中。您聚合結果並使用 `updateResults` 回調更新狀態：

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

*   不同儲存庫的結果在準備好後會立即添加到通道中。最初，當所有請求都已發送且未收到任何數據時，`receive()` 調用會被暫停。在這種情況下，整個「載入貢獻者」協程會被暫停。
*   然後，當使用者列表被發送到通道時，「載入貢獻者」協程恢復，`receive()` 調用返回此列表，結果立即更新。

您現在可以運行程式並選擇 _CHANNELS_ 選項來載入貢獻者並查看結果。

儘管協程和通道都不能完全消除並行帶來的複雜性，但它們在您需要了解正在發生什麼時使生活更輕鬆。

## 測試協程

現在讓我們測試所有解決方案，以檢查使用並行協程的解決方案是否比使用 `suspend` 函數的解決方案更快，並檢查使用通道的解決方案是否比簡單的「進度」解決方案更快。

在下面的任務中，您將比較解決方案的總運行時間。您將模擬 GitHub 服務並使該服務在給定超時後返回結果：

```text
repos request - returns an answer within 1000 ms delay
repo-1 - 1000 ms delay
repo-2 - 1200 ms delay
repo-3 - 800 ms delay
```

帶有 `suspend` 函數的循序解決方案大約需要 4000 毫秒（4000 = 1000 + (1000 + 1200 + 800)）。並行解決方案大約需要 2200 毫秒（2200 = 1000 + max(1000, 1200, 800)）。

對於顯示進度的解決方案，您還可以檢查帶有時間戳的中間結果。

相應的測試數據在 `test/contributors/testData.kt` 中定義，而 `Request4SuspendKtTest`、`Request7ChannelsKtTest` 等檔案則包含使用模擬服務調用的直接測試。

然而，這裡有兩個問題：

*   這些測試運行時間過長。每個測試大約需要 2 到 4 秒，您每次都需要等待結果。這不是很有效率。
*   您不能依賴解決方案的確切運行時間，因為它仍然需要額外的時間來準備和運行程式碼。您可以添加一個常數，但這樣時間會因機器而異。模擬服務延遲應該高於此常數，這樣您才能看到差異。如果常數是 0.5 秒，那麼將延遲設置為 0.1 秒將不夠。

更好的方法是使用特殊框架來測試時間，同時多次運行相同的程式碼（這會進一步增加總時間），但這學習和設置起來很複雜。

為了解決這些問題並確保帶有提供測試延遲的解決方案按預期運行（一個比另一個快），請使用帶有特殊測試分派器的*虛擬 (virtual)* 時間。此分派器會追蹤從開始經過的虛擬時間，並立即即時運行所有內容。當您在此分派器上運行協程時，`delay` 將立即返回並推進虛擬時間。

使用此機制的測試運行速度快，但您仍然可以檢查虛擬時間不同時刻發生的情況。總運行時間急劇減少：

![Comparison for total running time](time-comparison.png){width=700}

要使用虛擬時間，請將 `runBlocking` 調用替換為 `runTest`。`runTest` 將一個擴展 lambda 接受為 `TestScope` 的參數。當您在此特殊作用域內調用 `suspend` 函數中的 `delay` 時，`delay` 將增加虛擬時間而不是即時延遲：

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

您可以使用 `TestScope` 的 `currentTime` 屬性檢查當前的虛擬時間。

此範例中的實際運行時間為數毫秒，而虛擬時間等於延遲參數，即 1000 毫秒。

為了獲得子協程中「虛擬」`delay` 的完整效果，請使用 `TestDispatcher` 啟動所有子協程。否則，它將不起作用。除非您提供不同的分派器，否則此分派器會自動從其他 `TestScope` 繼承：

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

如果上述範例中 `launch` 是在 `Dispatchers.Default` 的上下文下調用的，則測試將失敗。您會收到一個異常，說明任務尚未完成。

您只能在 `loadContributorsConcurrent()` 函數以繼承上下文啟動子協程（而不使用 `Dispatchers.Default` 分派器修改它）的情況下，才能以這種方式測試它。

您可以在*調用*函數時指定上下文元素（例如分派器），而不是在*定義*函數時指定，這提供了更大的靈活性和更輕鬆的測試。

> 支援虛擬時間的測試 API 處於 [實驗階段 (Experimental)](components-stability.md)，未來可能會發生變化。
>
{style="warning"}

預設情況下，如果您使用實驗性測試 API，編譯器會顯示警告。若要抑制這些警告，請使用 `@OptIn(ExperimentalCoroutinesApi::class)` 註解測試函數或包含測試的整個類別。添加編譯器參數，指示編譯器您正在使用實驗性 API：

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

在本教程對應的專案中，編譯器參數已經添加到 Gradle 腳本中。

### 任務 8

重構 `tests/tasks/` 中的以下測試，以使用虛擬時間代替即時時間：

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

比較重構前後的總運行時間。

#### 任務 8 的提示 {initial-collapse-state="collapsed" collapsible="true"}

1.  將 `runBlocking` 調用替換為 `runTest`，並將 `System.currentTimeMillis()` 替換為 `currentTime`：

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  取消註釋檢查精確虛擬時間的斷言。
3.  不要忘記添加 `@UseExperimental(ExperimentalCoroutinesApi::class)`。

#### 任務 8 的解決方案 {initial-collapse-state="collapsed" collapsible="true"}

以下是並行和通道案例的解決方案：

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

首先，檢查結果是否在預期的虛擬時間點可用，然後檢查結果本身：

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

最後一個帶有通道的版本的第一個中間結果比進度版本更快可用，您可以在使用虛擬時間的測試中看到差異。

> 其餘「暫停」和「進度」任務的測試非常相似——您可以在專案的 `solutions` 分支中找到它們。
>
{style="tip"}

## 接下來

*   查看 KotlinConf 上的 [使用 Kotlin 進行非同步程式設計](https://kotlinconf.com/workshops/) 工作坊。
*   了解更多關於使用 [虛擬時間和實驗性測試包](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/) 的資訊。