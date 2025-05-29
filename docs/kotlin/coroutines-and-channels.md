<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 协程与通道 - 教程)

在本教程中，你将学习如何在 IntelliJ IDEA 中使用协程执行网络请求，而无需阻塞底层线程或使用回调。

> 无需协程的先验知识，但需熟悉 Kotlin 基本语法。
>
{style="tip"}

你将学到：

*   为何以及如何使用挂起函数执行网络请求。
*   如何使用协程并发发送请求。
*   如何使用通道在不同协程间共享信息。

对于网络请求，你需要 [Retrofit](https://square.github.io/retrofit/) 库，但本教程中展示的方法也适用于其他支持协程的库。

> 所有任务的解决方案都可以在[项目仓库](http://github.com/kotlin-hands-on/intro-coroutines)的 `solutions` 分支中找到。
>
{style="tip"}

## 开始之前

1.  下载并安装最新版 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。
2.  通过在欢迎界面选择 **Get from VCS** 或选择 **File | New | Project from Version Control** 克隆[项目模板](http://github.com/kotlin-hands-on/intro-coroutines)。

    你也可以通过命令行克隆：

    ```Bash
    git clone https://github.com/kotlin-hands-on/intro-coroutines
    ```

### 生成 GitHub 开发者令牌

你将在项目中用到 GitHub API。要获取访问权限，请提供你的 GitHub 账户名以及密码或令牌。如果启用了双重认证，令牌就足够了。

使用[你的账户](https://github.com/settings/tokens/new)生成新的 GitHub 令牌以使用 GitHub API：

1.  指定令牌的名称，例如 `coroutines-tutorial`：

    ![Generate a new GitHub token](generating-token.png){width=700}

2.  不要选择任何范围。点击页面底部的 **Generate token**。
3.  复制生成的令牌。

### 运行代码

程序会加载给定组织（默认为“kotlin”）下所有仓库的贡献者。稍后你将添加逻辑，根据用户的贡献数量进行排序。

1.  打开 `src/contributors/main.kt` 文件并运行 `main()` 函数。你将看到以下窗口：

    ![First window](initial-window.png){width=500}

    如果字体太小，可以通过修改 `main()` 函数中 `setDefaultFontSize(18f)` 的值进行调整。

2.  在相应字段中提供你的 GitHub 用户名和令牌（或密码）。
3.  确保在 _Variant_ 下拉菜单中选中 _BLOCKING_ 选项。
4.  点击 _Load contributors_。UI 会冻结一段时间，然后显示贡献者列表。
5.  打开程序输出，确保数据已加载。每次成功请求后，贡献者列表都会被记录下来。

实现此逻辑有多种方式：通过[阻塞请求](#blocking-requests)或[回调](#callbacks)。你将把这些解决方案与使用[协程](#coroutines)的解决方案进行比较，并了解[通道](#channels)如何用于在不同协程之间共享信息。

## 阻塞请求

你将使用 [Retrofit](https://square.github.io/retrofit/) 库向 GitHub 执行 HTTP 请求。它允许请求给定组织下的仓库列表以及每个仓库的贡献者列表：

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

此 API 由 `loadContributorsBlocking()` 函数使用，用于获取给定组织的贡献者列表。

1.  打开 `src/tasks/Request1Blocking.kt` 查看其实现：

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

    *   首先，你获取给定组织下的仓库列表并将其存储在 `repos` 列表中。然后对于每个仓库，请求贡献者列表，并将所有列表合并为一个最终的贡献者列表。
    *   `getOrgReposCall()` 和 `getRepoContributorsCall()` 都返回 `*Call` 类的一个实例（`#1`）。此时，尚未发送任何请求。
    *   然后调用 `*Call.execute()` 来执行请求（`#2`）。`execute()` 是一个同步调用，会阻塞底层线程。
    *   当你收到响应时，通过调用特定的 `logRepos()` 和 `logUsers()` 函数记录结果（`#3`）。如果 HTTP 响应包含错误，该错误将在此处记录。
    *   最后，获取响应体，其中包含你需要的数据。在本教程中，如果发生错误，你将使用空列表作为结果，并记录相应的错误（`#4`）。

2.  为了避免重复 `.body() ?: emptyList()`，声明了一个扩展函数 `bodyList()`：

    ```kotlin
    fun <T> Response<List<T>>.bodyList(): List<T> {
        return body() ?: emptyList()
    }
    ```

3.  再次运行程序，查看 IntelliJ IDEA 中的系统输出。它应该类似这样：

    ```text
    1770 [AWT-EventQueue-0] INFO  Contributors - kotlin: loaded 40 repos
    2025 [AWT-EventQueue-0] INFO  Contributors - kotlin-examples: loaded 23 contributors
    2229 [AWT-EventQueue-0] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    ```

    *   每行中的第一项是程序启动以来经过的毫秒数，然后是方括号中的线程名。你可以看到加载请求是从哪个线程调用的。
    *   每行中的最后一项是实际消息：加载了多少个仓库或贡献者。

    此日志输出表明所有结果都是从主线程记录的。当你使用 _BLOCKING_ 选项运行代码时，窗口会冻结并且不响应输入，直到加载完成。所有请求都从调用 `loadContributorsBlocking()` 的同一线程执行，即主 UI 线程（在 Swing 中，它是 AWT 事件分发线程）。这个主线程被阻塞，这就是 UI 冻结的原因：

    ![The blocked main thread](blocking.png){width=700}

    贡献者列表加载完成后，结果会更新。

4.  在 `src/contributors/Contributors.kt` 中，找到负责选择如何加载贡献者的 `loadContributors()` 函数，并查看 `loadContributorsBlocking()` 是如何调用的：

    ```kotlin
    when (getSelectedVariant()) {
        BLOCKING -> { // Blocking UI thread
            val users = loadContributorsBlocking(service, req)
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 调用紧跟在 `loadContributorsBlocking()` 调用之后。
    *   `updateResults()` 更新 UI，因此它必须始终从 UI 线程调用。
    *   由于 `loadContributorsBlocking()` 也是从 UI 线程调用的，因此 UI 线程被阻塞，UI 冻结。

### 任务 1

第一个任务帮助你熟悉任务领域。目前，每个贡献者的姓名都会重复出现多次，每个他们参与的项目一次。请实现 `aggregate()` 函数，将用户组合起来，使每个贡献者只添加一次。`User.contributions` 属性应包含给定用户对_所有_项目的总贡献数量。结果列表应按贡献数量降序排序。

打开 `src/tasks/Aggregation.kt` 并实现 `List<User>.aggregate()` 函数。用户应按其总贡献数量排序。

相应的测试文件 `test/tasks/AggregationKtTest.kt` 展示了预期结果的示例。

> 你可以使用 [IntelliJ IDEA 快捷键](https://www.jetbrains.com/help/idea/create-tests.html#test-code-navigation) `Ctrl+Shift+T` / `⇧ ⌘ T` 在源代码和测试类之间自动跳转。
>
{style="tip"}

完成此任务后，“kotlin”组织的最终列表应类似于以下内容：

![The list for the "kotlin" organization](aggregate.png){width=500}

#### 任务 1 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

1.  要按登录名对用户进行分组，请使用 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)，它返回一个从登录名到此登录名用户在不同仓库中所有出现次数的映射。
2.  对于每个映射条目，计算每个用户的总贡献数量，并根据给定名称和总贡献创建 `User` 类的新实例。
3.  将结果列表按降序排序：

    ```kotlin
    fun List<User>.aggregate(): List<User> =
        groupBy { it.login }
            .map { (login, group) -> User(login, group.sumOf { it.contributions }) }
            .sortedByDescending { it.contributions }
    ```

另一种解决方案是使用 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函数而不是 `groupBy()`。

## 回调

之前的解决方案有效，但它会阻塞线程并因此冻结 UI。避免这种情况的传统方法是使用_回调_。

你可以将本应在操作完成后立即调用的代码提取到一个单独的回调（通常是 lambda 表达式）中，并将该 lambda 传递给调用者，以便稍后调用它。

为了使 UI 响应式，你可以将整个计算移动到单独的线程，或者切换到使用回调而不是阻塞调用的 Retrofit API。

### 使用后台线程

1.  打开 `src/tasks/Request2Background.kt` 查看其实现。首先，整个计算被移动到一个不同的线程。`thread()` 函数会启动一个新线程：

    ```kotlin
    thread {
        loadContributorsBlocking(service, req)
    }
    ```

    现在，所有加载都已移至单独的线程，主线程得以释放，可以被其他任务占用：

    ![The freed main thread](background.png){width=700}

2.  `loadContributorsBackground()` 函数的签名会改变。它将 `updateResults()` 回调作为最后一个参数，以便在所有加载完成后调用它：

    ```kotlin
    fun loadContributorsBackground(
        service: GitHubService, req: RequestData,
        updateResults: (List<User>) -> Unit
    )
    ```

3.  现在当 `loadContributorsBackground()` 被调用时，`updateResults()` 调用会在回调中执行，而不是像以前那样立即执行：

    ```kotlin
    loadContributorsBackground(service, req) { users ->
        SwingUtilities.invokeLater {
            updateResults(users, startTime)
        }
    }
    ```

    通过调用 `SwingUtilities.invokeLater`，你可以确保 `updateResults()` 调用（它负责更新结果）发生在主 UI 线程（AWT 事件分发线程）上。

然而，如果你尝试通过 `BACKGROUND` 选项加载贡献者，你会发现列表已更新但没有任何变化。

### 任务 2

修复 `src/tasks/Request2Background.kt` 中的 `loadContributorsBackground()` 函数，使结果列表在 UI 中显示。

#### 任务 2 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

如果你尝试加载贡献者，你会在日志中看到贡献者已加载但结果未显示。要修复此问题，请在结果用户列表上调用 `updateResults()`：

```kotlin
thread {
    updateResults(loadContributorsBlocking(service, req))
}
```

确保显式调用回调中传递的逻辑。否则，什么都不会发生。

### 使用 Retrofit 回调 API

在之前的解决方案中，整个加载逻辑被移动到后台线程，但这仍然不是最佳的资源利用方式。

所有加载请求都按顺序执行，并且线程在等待加载结果时被阻塞，而此时它本可以被其他任务占用。具体来说，线程可以开始加载另一个请求，以便更快地接收整个结果。

然后，每个仓库的数据处理应分为两部分：加载和处理结果响应。第二部分_处理_应提取到回调中。

然后，可以在收到前一个仓库的结果（并调用相应的回调）之前开始每个仓库的加载：

![Using callback API](callbacks.png){width=700}

Retrofit 回调 API 可以帮助实现这一点。`Call.enqueue()` 函数会启动一个 HTTP 请求并接收一个回调作为参数。在此回调中，你需要指定每个请求完成后需要执行的操作。

打开 `src/tasks/Request3Callbacks.kt` 查看使用此 API 的 `loadContributorsCallbacks()` 实现：

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

*   为方便起见，此代码片段使用在同一文件中声明的 `onResponse()` 扩展函数。它接受一个 lambda 表达式作为参数，而不是对象表达式。
*   处理响应的逻辑被提取到回调中：相应的 lambda 表达式从 `#1` 和 `#2` 行开始。

然而，提供的解决方案不起作用。如果你运行程序并选择 _CALLBACKS_ 选项加载贡献者，你会发现什么都没有显示。然而，来自 `Request3CallbacksKtTest` 的测试却立即返回了成功通过的结果。

思考一下为什么给定的代码没有按预期工作并尝试修复它，或者查看下面的解决方案。

### 任务 3 (可选)

重写 `src/tasks/Request3Callbacks.kt` 文件中的代码，以便显示加载的贡献者列表。

#### 任务 3 的第一次尝试解决方案 {initial-collapse-state="collapsed" collapsible="true"}

在当前解决方案中，许多请求并发启动，这减少了总加载时间。然而，结果并未加载。

这是因为 `updateResults()` 回调在所有加载请求启动后立即调用，此时 `allUsers` 列表尚未填充数据。

你可以尝试通过如下更改来修复此问题：

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

*   首先，你使用索引迭代仓库列表（`#1`）。
*   然后，从每个回调中，你检查它是否是最后一次迭代（`#2`）。
*   如果是这种情况，则更新结果。

然而，此代码也未能实现我们的目标。请尝试自己寻找答案，或查看下面的解决方案。

#### 任务 3 的第二次尝试解决方案 {initial-collapse-state="collapsed" collapsible="true"}

由于加载请求是并发启动的，因此无法保证最后一个请求的结果最后返回。结果可以以任何顺序返回。

因此，如果你将当前索引与 `lastIndex` 比较作为完成条件，则可能会丢失某些仓库的结果。

如果处理最后一个仓库的请求比之前的一些请求更快返回（这种情况很可能发生），那么所有耗时较长的请求的结果都将丢失。

一种修复方法是引入一个索引，并检查是否所有仓库都已处理：

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

此代码使用列表的同步版本和 `AtomicInteger()`，因为通常无法保证处理 `getRepoContributors()` 请求的不同回调将始终从同一线程调用。

#### 任务 3 的第三次尝试解决方案 {initial-collapse-state="collapsed" collapsible="true"}

一个更好的解决方案是使用 `CountDownLatch` 类。它存储一个用仓库数量初始化的计数器。处理每个仓库后，此计数器会递减。然后，它会等待计数器归零后再更新结果：

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

然后从主线程更新结果。这比将逻辑委托给子线程更直接。

回顾这三种解决方案尝试，你会发现使用回调编写正确的代码并非易事且容易出错，尤其是在涉及多个底层线程和同步时。

> 作为一项额外的练习，你可以使用 RxJava 库以响应式方法实现相同的逻辑。所有必要的依赖项和使用 RxJava 的解决方案都可以在单独的 `rx` 分支中找到。也可以完成本教程并实现或检查建议的 Rx 版本以进行适当比较。
>
{style="tip"}

## 挂起函数

你可以使用挂起函数实现相同的逻辑。除了返回 `Call<List<Repo>>`，将 API 调用定义为[挂起函数](composing-suspending-functions.md)，如下所示：

```kotlin
interface GitHubService {
    @GET("orgs/{org}/repos?per_page=100")
    suspend fun getOrgRepos(
        @Path("org") org: String
    ): List<Repo>
}
```

*   `getOrgRepos()` 被定义为一个 `suspend` 函数。当你使用挂起函数执行请求时，底层线程不会被阻塞。有关其工作原理的更多详细信息将在后续章节中介绍。
*   `getOrgRepos()` 直接返回结果，而不是返回 `Call`。如果结果不成功，则会抛出异常。

或者，Retrofit 允许将结果包装在 `Response` 中返回。在这种情况下，会提供结果体，并且可以手动检查错误。本教程使用返回 `Response` 的版本。

在 `src/contributors/GitHubService.kt` 中，将以下声明添加到 `GitHubService` 接口中：

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

### 任务 4

你的任务是修改加载贡献者的函数代码，使其使用两个新的挂起函数 `getOrgRepos()` 和 `getRepoContributors()`。新的 `loadContributorsSuspend()` 函数被标记为 `suspend` 以使用新的 API。

> 挂起函数不能在任何地方调用。从 `loadContributorsBlocking()` 调用挂起函数将导致错误，错误消息为“Suspend function 'getOrgRepos' should be called only from a coroutine or another suspend function”。
>
{style="note"}

1.  将 `src/tasks/Request1Blocking.kt` 中定义的 `loadContributorsBlocking()` 的实现复制到 `src/tasks/Request4Suspend.kt` 中定义的 `loadContributorsSuspend()` 中。
2.  修改代码，使其使用新的挂起函数，而不是那些返回 `Call` 的函数。
3.  选择 _SUSPEND_ 选项运行程序，并确保在执行 GitHub 请求时 UI 仍然响应。

#### 任务 4 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

将 `.getOrgReposCall(req.org).execute()` 替换为 `.getOrgRepos(req.org)`，并对第二个“贡献者”请求重复相同的替换：

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

*   `loadContributorsSuspend()` 应该被定义为一个 `suspend` 函数。
*   你不再需要调用 `execute`（它以前返回 `Response`），因为现在 API 函数直接返回 `Response`。请注意，此细节特定于 Retrofit 库。对于其他库，API 将有所不同，但概念是相同的。

## 协程

使用挂起函数的代码看起来与“阻塞”版本相似。与阻塞版本的主要区别在于，协程不再阻塞线程，而是挂起：

```text
block -> suspend
thread -> coroutine
```

> 协程常被称为轻量级线程 (lightweight threads)，因为你可以在协程上运行代码，类似于在线程上运行代码。以前会阻塞（并且需要避免）的操作现在可以改为挂起协程。
>
{style="note"}

### 启动新协程

如果你查看 `src/contributors/Contributors.kt` 中 `loadContributorsSuspend()` 的使用方式，你会发现它在 `launch` 内部被调用。`launch` 是一个接受 lambda 表达式作为参数的库函数：

```kotlin
launch {
    val users = loadContributorsSuspend(req)
    updateResults(users, startTime)
}
```

这里 `launch` 启动了一个新的计算，负责加载数据和显示结果。该计算是可挂起的 (suspendable)——在执行网络请求时，它会挂起并释放底层线程。当网络请求返回结果时，计算会恢复 (resumed)。

这种可挂起的计算被称为_协程_ (coroutine)。因此，在这种情况下，`launch` _启动了一个新的协程_，负责加载数据和显示结果。

协程运行在线程之上，并且可以被挂起。当一个协程被挂起时，相应的计算会暂停，从线程中移除，并存储在内存中。同时，线程可以自由地被其他任务占用：

![Suspending coroutines](suspension-process.gif){width=700}

当计算准备好继续时，它会被返回到一个线程（不一定是同一个线程）。

在 `loadContributorsSuspend()` 示例中，每个“贡献者”请求现在都使用挂起机制等待结果。首先，发送新请求。然后，在等待响应时，由 `launch` 函数启动的整个“加载贡献者”协程会挂起。

协程仅在收到相应响应后才恢复：

![Suspending request](suspend-requests.png){width=700}

在等待接收响应时，线程可以自由地被其他任务占用。尽管所有请求都在主 UI 线程上发生，但 UI 仍然保持响应：

1.  使用 _SUSPEND_ 选项运行程序。日志确认所有请求都发送到主 UI 线程：

    ```text
    2538 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 30 repos
    2729 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - ts2kt: loaded 11 contributors
    3029 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-koans: loaded 45 contributors
    ...
    11252 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin-coroutines-workshop: loaded 1 contributors
    ```

2.  日志可以显示相应的代码正在哪个协程上运行。要启用它，请打开 **Run | Edit configurations** 并添加 `-Dkotlinx.coroutines.debug` VM 选项：

    ![Edit run configuration](run-configuration.png){width=500}

    使用此选项运行 `main()` 时，协程名称将附加到线程名称。你也可以修改运行所有 Kotlin 文件的模板并默认启用此选项。

现在所有代码都在一个协程上运行，即上面提到的“加载贡献者”协程，表示为 `@coroutine#1`。在等待结果时，你不应该重用线程来发送其他请求，因为代码是顺序编写的。只有在收到上一个结果后，才会发送新请求。

挂起函数公平对待线程，不会因“等待”而阻塞它。然而，这尚未引入任何并发性 (concurrency)。

## 并发

Kotlin 协程比线程的资源开销小得多。每次你想异步启动一个新的计算时，你可以创建一个新的协程。

要启动一个新的协程，请使用主要的_协程构建器_ (coroutine builders) 之一：`launch`、`async` 或 `runBlocking`。不同的库可以定义额外的协程构建器。

`async` 启动一个新的协程并返回一个 `Deferred` 对象。`Deferred` 代表一个在其他地方被称为 `Future` 或 `Promise` 的概念。它存储一个计算，但它_推迟_了你获得最终结果的时刻；它_承诺_在_未来_的某个时候给出结果。

`async` 和 `launch` 的主要区别在于，`launch` 用于启动一个不期望返回特定结果的计算。`launch` 返回一个 `Job` 对象，它代表着协程。可以通过调用 `Job.join()` 来等待它完成。

`Deferred` 是一个泛型类型，它扩展了 `Job`。`async` 调用可以返回 `Deferred<Int>` 或 `Deferred<CustomType>`，这取决于 lambda 表达式的返回值（lambda 表达式中的最后一个表达式就是结果）。

要获取协程的结果，你可以对 `Deferred` 实例调用 `await()`。在等待结果时，调用 `await()` 的协程会被挂起：

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

`runBlocking` 用作普通函数和挂起函数之间，或阻塞世界和非阻塞世界之间的桥梁。它充当启动顶级主协程的适配器。它主要用于 `main()` 函数和测试中。

> 观看[此视频](https://www.youtube.com/watch?v=zEZc5AmHQhk)以更好地理解协程。
>
{style="tip"}

如果有一个 `Deferred` 对象列表，你可以调用 `awaitAll()` 来等待所有结果：

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

当每个“贡献者”请求都在一个新的协程中启动时，所有请求都会异步启动。在收到前一个请求的结果之前，可以发送新请求：

![Concurrent coroutines](concurrency.png){width=700}

总加载时间与 _CALLBACKS_ 版本大致相同，但它不需要任何回调。更重要的是，`async` 明确强调了代码中哪些部分是并发运行的。

### 任务 5

在 `Request5Concurrent.kt` 文件中，使用之前的 `loadContributorsSuspend()` 函数实现 `loadContributorsConcurrent()` 函数。

#### 任务 5 的提示 {initial-collapse-state="collapsed" collapsible="true"}

你只能在协程作用域 (coroutine scope) 内启动新的协程。将 `loadContributorsSuspend()` 的内容复制到 `coroutineScope` 调用中，以便你可以在其中调用 `async` 函数：

```kotlin
suspend fun loadContributorsConcurrent(
    service: GitHubService,
    req: RequestData
): List<User> = coroutineScope {
    // ...
}
```

你的解决方案应基于以下方案：

```kotlin
val deferreds: List<Deferred<List<User>>> = repos.map { repo ->
    async {
        // load contributors for each repo
    }
}
deferreds.awaitAll() // List<List<User>>
```

#### 任务 5 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

用 `async` 包装每个“贡献者”请求，以创建与仓库数量相同的协程。`async` 返回 `Deferred<List<User>>`。这不是问题，因为创建新协程的资源开销不大，因此你可以根据需要创建任意数量的协程。

1.  你不能再使用 `flatMap`，因为 `map` 的结果现在是 `Deferred` 对象的列表，而不是列表的列表。`awaitAll()` 返回 `List<List<User>>`，因此调用 `flatten().aggregate()` 来获取结果：

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

2.  运行代码并检查日志。所有协程仍然在主 UI 线程上运行，因为尚未采用多线程，但你已经可以看到并发运行协程的好处。
3.  要修改此代码以在公共线程池中的不同线程上运行“贡献者”协程，请将 `Dispatchers.Default` 指定为 `async` 函数的上下文参数：

    ```kotlin
    async(Dispatchers.Default) { }
    ```

    *   `CoroutineDispatcher` 决定了相应的协程应该在哪个线程或哪些线程上运行。如果你不指定一个作为参数，`async` 将使用外部作用域的调度器。
    *   `Dispatchers.Default` 代表 JVM 上一个共享的线程池。这个线程池提供了一种并行执行的方式。它包含与可用 CPU 核心数量一样多的线程，但如果只有一个核心，它仍然会有两个线程。

4.  修改 `loadContributorsConcurrent()` 函数中的代码，使其在公共线程池中的不同线程上启动新的协程。另外，在发送请求之前添加额外的日志记录：

    ```kotlin
    async(Dispatchers.Default) {
        log("starting loading for ${repo.name}")
        service.getRepoContributors(req.org, repo.name)
            .also { logUsers(repo, it) }
            .bodyList()
    }
    ```

5.  再次运行程序。在日志中，你可以看到每个协程都可以在线程池中的一个线程上启动并在另一个线程上恢复：

    ```text
    1946 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    1946 [DefaultDispatcher-worker-3 @coroutine#5] INFO  Contributors - starting loading for dokka
    1946 [DefaultDispatcher-worker-1 @coroutine#3] INFO  Contributors - starting loading for ts2kt
    ...
    2178 [DefaultDispatcher-worker-1 @coroutine#4] INFO  Contributors - kotlin-koans: loaded 45 contributors
    2569 [DefaultDispatcher-worker-1 @coroutine#5] INFO  Contributors - dokka: loaded 36 contributors
    2821 [DefaultDispatcher-worker-2 @coroutine#3] INFO  Contributors - ts2kt: loaded 11 contributors
    ```

    例如，在此日志摘录中，`coroutine#4` 在 `worker-2` 线程上启动，并在 `worker-1` 线程上继续执行。

在 `src/contributors/Contributors.kt` 中，检查 _CONCURRENT_ 选项的实现：

1.  要在主 UI 线程上运行协程，请将 `Dispatchers.Main` 指定为参数：

    ```kotlin
    launch(Dispatchers.Main) {
        updateResults()
    }
    ```

    *   如果你在主线程上启动一个新的协程时主线程正忙，协程会挂起并被调度在该线程上执行。协程只会在线程空闲时恢复。
    *   通常认为，最佳实践是使用外部作用域的调度器，而不是在每个端点显式指定。如果你定义 `loadContributorsConcurrent()` 时不传递 `Dispatchers.Default` 作为参数，你可以在任何上下文中调用此函数：使用 `Default` 调度器、主 UI 线程或自定义调度器。
    *   正如你稍后将看到的，从测试中调用 `loadContributorsConcurrent()` 时，你可以在 `TestDispatcher` 的上下文中调用它，这简化了测试。这使得此解决方案更加灵活。

2.  要在调用方指定调度器，请对项目进行以下更改，同时让 `loadContributorsConcurrent` 在继承的上下文中启动协程：

    ```kotlin
    launch(Dispatchers.Default) {
        val users = loadContributorsConcurrent(service, req)
        withContext(Dispatchers.Main) {
            updateResults(users, startTime)
        }
    }
    ```

    *   `updateResults()` 应该在主 UI 线程上调用，所以你用 `Dispatchers.Main` 的上下文调用它。
    *   `withContext()` 使用指定的协程上下文调用给定代码，挂起直到完成，并返回结果。表达此意图的另一种（但更冗长）方式是启动一个新的协程并显式等待（通过挂起）直到它完成：`launch(context) { ... }.join()`。

3.  运行代码并确保协程在线程池中的线程上执行。

## 结构化并发

*   _协程作用域_ (coroutine scope) 负责不同协程之间的结构和父子关系。新协程通常需要在作用域内启动。
*   _协程上下文_ (coroutine context) 存储用于运行给定协程的额外技术信息，例如协程自定义名称，或指定协程应调度到哪些线程的调度器。

当使用 `launch`、`async` 或 `runBlocking` 启动新协程时，它们会自动创建相应的作用域。所有这些函数都接受一个带接收者的 lambda 表达式作为参数，并且 `CoroutineScope` 是隐式接收者类型：

```kotlin
launch { /* this: CoroutineScope */ }
```

*   新协程只能在作用域内启动。
*   `launch` 和 `async` 被声明为 `CoroutineScope` 的扩展函数，因此在调用它们时必须始终传递隐式或显式接收者。
*   由 `runBlocking` 启动的协程是唯一例外，因为 `runBlocking` 被定义为顶级函数。但因为它会阻塞当前线程，所以它主要用作 `main()` 函数和测试中的桥接函数。

在 `runBlocking`、`launch` 或 `async` 内部，新的协程会自动在作用域内启动：

```kotlin
import kotlinx.coroutines.*

fun main() = runBlocking { /* this: CoroutineScope */
    launch { /* ... */ }
    // the same as:   
    this.launch { /* ... */ }
}
```

当你在 `runBlocking` 内部调用 `launch` 时，它是作为 `CoroutineScope` 类型的隐式接收者的扩展函数被调用的。或者，你也可以显式地写 `this.launch`。

嵌套协程（本例中由 `launch` 启动）可以被视为外部协程（由 `runBlocking` 启动）的子协程。这种“父子”关系通过作用域工作；子协程是从与父协程对应的作用域启动的。

可以通过使用 `coroutineScope` 函数来创建一个新的作用域而无需启动新的协程。为了在 `suspend` 函数内部以结构化方式启动新的协程，同时又不直接访问外部作用域，你可以创建一个新的协程作用域，它会自动成为此 `suspend` 函数被调用时所处外部作用域的子作用域。`loadContributorsConcurrent()` 就是一个很好的例子。

你也可以使用 `GlobalScope.async` 或 `GlobalScope.launch` 从全局作用域 (global scope) 启动新的协程。这将创建一个顶层的“独立”协程。

协程结构背后的机制称为_结构化并发_ (structured concurrency)。它比全局作用域提供以下好处：

*   作用域通常负责子协程，其生命周期与作用域的生命周期绑定。
*   如果出现问题或用户改变主意决定撤销操作，作用域可以自动取消子协程。
*   作用域会自动等待所有子协程完成。因此，如果作用域对应一个协程，则父协程不会完成，直到在其作用域内启动的所有协程都完成。

当使用 `GlobalScope.async` 时，没有将多个协程绑定到较小作用域的结构。从全局作用域启动的协程都是独立的——它们的生命周期仅受整个应用程序生命周期的限制。可以存储从全局作用域启动的协程的引用，并等待其完成或显式取消，但这不会像结构化并发那样自动发生。

### 取消贡献者加载

创建两个加载贡献者列表的函数版本。比较当尝试取消父协程时，两个版本的行为有何不同。第一个版本将使用 `coroutineScope` 启动所有子协程，而第二个版本将使用 `GlobalScope`。

1.  在 `Request5Concurrent.kt` 中，为 `loadContributorsConcurrent()` 函数添加 3 秒延迟：

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

    该延迟会影响所有发送请求的协程，以便在协程启动后但在请求发送之前有足够的时间取消加载。

2.  创建加载函数的第二个版本：将 `loadContributorsConcurrent()` 的实现复制到 `Request5NotCancellable.kt` 中的 `loadContributorsNotCancellable()`，然后移除新 `coroutineScope` 的创建。
3.  `async` 调用现在无法解析，因此使用 `GlobalScope.async` 启动它们：

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

    *   函数现在直接返回结果，而不是作为 lambda 表达式中的最后一个表达式（`#1` 和 `#3` 行）。
    *   所有“贡献者”协程都在 `GlobalScope` 内启动，而不是作为协程作用域的子协程（`#2` 行）。

4.  运行程序并选择 _CONCURRENT_ 选项加载贡献者。
5.  等待所有“贡献者”协程启动，然后点击 _Cancel_。日志中没有新的结果，这意味着所有请求确实已被取消：

    ```text
    2896 [AWT-EventQueue-0 @coroutine#1] INFO  Contributors - kotlin: loaded 40 repos
    2901 [DefaultDispatcher-worker-2 @coroutine#4] INFO  Contributors - starting loading for kotlin-koans
    ...
    2909 [DefaultDispatcher-worker-5 @coroutine#36] INFO  Contributors - starting loading for mpp-example
    /* click on 'cancel' */
    /* no requests are sent */
    ```

6.  重复步骤 5，但这次选择 `NOT_CANCELLABLE` 选项：

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

    在这种情况下，没有协程被取消，所有请求仍然被发送。

7.  检查“贡献者”程序中如何触发取消。当点击 _Cancel_ 按钮时，主要的“加载”协程被显式取消，并且子协程自动取消：

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

`launch` 函数返回一个 `Job` 实例。`Job` 存储了“加载协程”的引用，该协程负责加载所有数据并更新结果。你可以在它上面调用 `setUpCancellation()` 扩展函数（`#1` 行），将 `Job` 实例作为接收者传递。

另一种表达方式是显式地写：

```kotlin
val job = launch { }
job.setUpCancellation()
```

*   为了可读性，你可以在函数内部使用新的 `loadingJob` 变量（`#2` 行）引用 `setUpCancellation()` 函数的接收者。
*   然后你可以为 _Cancel_ 按钮添加一个监听器，这样当它被点击时，`loadingJob` 会被取消（`#3` 行）。

借助结构化并发，你只需取消父协程，这会自动将取消操作传播到所有子协程。

### 使用外部作用域的上下文

当你在给定作用域内启动新协程时，更容易确保它们都使用相同的上下文运行。如果需要，替换上下文也更容易。

现在是时候学习如何使用外部作用域的调度器了。由 `coroutineScope` 或协程构建器创建的新作用域总是从外部作用域继承上下文。在本例中，外部作用域是调用 `suspend loadContributorsConcurrent()` 函数的作用域：

```kotlin
launch(Dispatchers.Default) {  // outer scope
    val users = loadContributorsConcurrent(service, req)
    // ...
}
```

所有嵌套协程都会自动以继承的上下文启动。调度器是此上下文的一部分。这就是为什么所有由 `async` 启动的协程都以默认调度器的上下文启动：

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

借助结构化并发，你可以在创建顶级协程时一次性指定主要的上下文元素（如调度器）。所有嵌套协程随后都会继承上下文，并且只在需要时修改它。

> 当你在 UI 应用程序（例如 Android 应用程序）中编写协程代码时，通常的做法是默认使用 `CoroutineDispatchers.Main` 作为顶级协程的调度器，然后在需要将代码运行在不同线程上时显式设置不同的调度器。
>
{style="tip"}

## 显示进度

尽管某些仓库的信息加载速度很快，但用户只有在所有数据加载完成后才能看到最终结果列表。在此之前，加载图标会运行显示进度，但没有关于当前状态或已加载哪些贡献者的信息。

你可以更早地显示中间结果，并在加载完每个仓库的数据后显示所有贡献者：

![Loading data](loading.gif){width=500}

要实现此功能，在 `src/tasks/Request6Progress.kt` 中，你需要将更新 UI 的逻辑作为回调传递，以便在每个中间状态时调用它：

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

在 `Contributors.kt` 的调用点，回调被传递以从 `Main` 线程更新 _PROGRESS_ 选项的结果：

```kotlin
launch(Dispatchers.Default) {
    loadContributorsProgress(service, req) { users, completed ->
        withContext(Dispatchers.Main) {
            updateResults(users, startTime, completed)
        }
    }
}
```

*   `updateResults()` 参数在 `loadContributorsProgress()` 中被声明为 `suspend`。因此，有必要在相应的 lambda 参数内部调用 `withContext`，它是一个 `suspend` 函数。
*   `updateResults()` 回调接受一个额外的布尔参数，该参数指定加载是否已完成以及结果是否为最终结果。

### 任务 6

在 `Request6Progress.kt` 文件中，实现 `loadContributorsProgress()` 函数以显示中间进度。请基于 `Request4Suspend.kt` 中的 `loadContributorsSuspend()` 函数进行实现。

*   使用一个不带并发的简单版本；你将在下一节中添加并发。
*   贡献者中间列表应以“聚合”状态显示，而不仅仅是为每个仓库加载的用户列表。
*   当加载每个新仓库的数据时，每个用户的总贡献数量应增加。

#### 任务 6 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

为了以“聚合”状态存储已加载贡献者的中间列表，定义一个 `allUsers` 变量来存储用户列表，然后在加载每个新仓库的贡献者后更新它：

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

#### 顺序与并发

`updateResults()` 回调在每个请求完成后被调用：

![Progress on requests](progress.png){width=700}

此代码不包含并发。它是顺序执行的，因此你不需要同步。

最佳选择是并发发送请求，并在收到每个仓库的响应后更新中间结果：

![Concurrent requests](progress-and-concurrency.png){width=700}

要添加并发，请使用_通道_ (channels)。

## 通道

编写带有共享可变状态的代码相当困难且容易出错（例如使用回调的解决方案）。一个更简单的方法是通过通信而不是使用公共可变状态来共享信息。协程可以通过_通道_相互通信。

通道是通信原语 (communication primitives)，允许数据在协程之间传递。一个协程可以向通道_发送_一些信息，而另一个协程可以从通道_接收_该信息：

![Using channels](using-channel.png)

发送（生产）信息的协程通常被称为生产者 (producer)，接收（消费）信息的协程被称为消费者 (consumer)。一个或多个协程可以向同一个通道发送信息，一个或多个协程可以从中接收数据：

![Using channels with many coroutines](using-channel-many-coroutines.png)

当多个协程从同一个通道接收信息时，每个元素只会被其中一个消费者处理一次。一旦元素被处理，它会立即从通道中移除。

你可以把通道想象成一个元素集合，或者更精确地说，是一个队列，其中元素从一端添加，从另一端接收。然而，有一个重要的区别：与集合不同，即使是其同步版本，通道也可以_挂起_ `send()` 和 `receive()` 操作。当通道为空或已满时会发生这种情况。如果通道大小有上限，则通道可能会满。

`Channel` 由三个不同的接口表示：`SendChannel`、`ReceiveChannel` 和 `Channel`，其中后者扩展了前两个。你通常会创建一个通道并将其作为 `SendChannel` 实例提供给生产者，以便只有它们可以向通道发送信息。你将通道作为 `ReceiveChannel` 实例提供给消费者，以便只有它们可以从中接收信息。`send` 和 `receive` 方法都被声明为 `suspend`：

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

生产者可以关闭通道，以指示不再有元素到来。

库中定义了多种通道类型。它们在内部可以存储多少元素以及 `send()` 调用是否可以挂起方面有所不同。对于所有通道类型，`receive()` 调用的行为类似：如果通道不为空，它会接收一个元素；否则，它会挂起。

<deflist collapsible="true">
   <def title="无限容量通道">
       <p>无限容量通道 (Unlimited channel) 是队列最接近的模拟：生产者可以将元素发送到此通道，并且它将无限增长。<code>send()</code> 调用永远不会挂起。如果程序内存耗尽，你将得到一个 <code>OutOfMemoryException</code>。无限容量通道与队列的区别在于，当消费者尝试从空通道接收时，它会挂起，直到发送新的元素。</p>
       <img src="unlimited-channel.png" alt="Unlimited channel" width="500"/>
   </def>
   <def title="缓冲通道">
       <p>缓冲通道 (Buffered channel) 的大小受指定数量的限制。生产者可以将元素发送到此通道，直到达到大小限制。所有元素都在内部存储。当通道已满时，对其的下一个 <code>send</code> 调用会挂起，直到有更多可用空间。</p>
       <img src="buffered-channel.png" alt="Buffered channel" width="500"/>
   </def>
   <def title="集合通道">
       <p>“集合”通道 (Rendezvous channel) 是一个不带缓冲区的通道，与大小为零的缓冲通道相同。其中一个函数 (<code>send()</code> 或 <code>receive()</code>) 总是挂起，直到另一个被调用。</p>
       <p>如果调用了 <code>send()</code> 函数，并且没有准备好处理元素的挂起 <code>receive()</code> 调用，则 <code>send()</code> 会挂起。类似地，如果调用了 <code>receive()</code> 函数并且通道为空，或者换句话说，没有准备好发送元素的挂起 <code>send()</code> 调用，则 <code>receive()</code> 调用会挂起。</p>
       <p>“集合”这个名字（“在约定时间地点见面”）指的是 <code>send()</code> 和 <code>receive()</code> 应该“准时会合”的事实。</p>
       <img src="rendezvous-channel.png" alt="Rendezvous channel" width="500"/>
   </def>
   <def title="融合通道">
       <p>发送到融合通道 (Conflated channel) 的新元素将覆盖之前发送的元素，因此接收者将始终只获取最新的元素。<code>send()</code> 调用永远不会挂起。</p>
       <img src="conflated-channel.gif" alt="Conflated channel" width="500"/>
   </def>
</deflist>

当你创建一个通道时，指定其类型或缓冲区大小（如果你需要缓冲通道）：

```kotlin
val rendezvousChannel = Channel<String>()
val bufferedChannel = Channel<String>(10)
val conflatedChannel = Channel<String>(CONFLATED)
val unlimitedChannel = Channel<String>(UNLIMITED)
```

默认情况下，会创建一个“集合”通道。

在接下来的任务中，你将创建一个“集合”通道、两个生产者协程和一个消费者协程：

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

> 观看[此视频](https://www.youtube.com/watch?v=HpWQUoVURWQ)以更好地理解通道。
>
{style="tip"}

### 任务 7

在 `src/tasks/Request7Channels.kt` 中，实现 `loadContributorsChannels()` 函数，该函数并发请求所有 GitHub 贡献者并同时显示中间进度。

使用之前的函数，来自 `Request5Concurrent.kt` 的 `loadContributorsConcurrent()` 和来自 `Request6Progress.kt` 的 `loadContributorsProgress()`。

#### 任务 7 的提示 {initial-collapse-state="collapsed" collapsible="true"}

并发接收不同仓库贡献者列表的不同协程可以将所有接收到的结果发送到同一个通道：

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

然后可以逐个接收并处理来自此通道的元素：

```kotlin
repeat(repos.size) {
    val users = channel.receive()
    // ...
}
```

由于 `receive()` 调用是顺序的，因此不需要额外的同步。

#### 7 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

与 `loadContributorsProgress()` 函数一样，你可以创建一个 `allUsers` 变量来存储“所有贡献者”列表的中间状态。从通道接收到的每个新列表都会添加到所有用户列表中。你聚合结果并使用 `updateResults` 回调更新状态：

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

*   不同仓库的结果一旦准备好就会添加到通道中。起初，当所有请求都已发送但未收到数据时，`receive()` 调用会挂起。在这种情况下，整个“加载贡献者”协程会挂起。
*   然后，当用户列表发送到通道时，“加载贡献者”协程恢复，`receive()` 调用返回此列表，结果立即更新。

你现在可以运行程序并选择 _CHANNELS_ 选项加载贡献者并查看结果。

尽管协程和通道都不能完全消除并发带来的复杂性，但当需要理解正在发生的事情时，它们会使事情变得更容易。

## 测试协程

现在让我们测试所有解决方案，以检查并发协程的解决方案是否比使用 `suspend` 函数的解决方案更快，并检查通道的解决方案是否比简单的“进度”解决方案更快。

在接下来的任务中，你将比较解决方案的总运行时间。你将模拟一个 GitHub 服务，并使该服务在给定超时后返回结果：

```text
repos request - returns an answer within 1000 ms delay
repo-1 - 1000 ms delay
repo-2 - 1200 ms delay
repo-3 - 800 ms delay
```

使用 `suspend` 函数的顺序解决方案大约需要 4000 毫秒（4000 = 1000 + (1000 + 1200 + 800)）。并发解决方案大约需要 2200 毫秒（2200 = 1000 + max(1000, 1200, 800)）。

对于显示进度的解决方案，你还可以通过时间戳检查中间结果。

相应的测试数据定义在 `test/contributors/testData.kt` 中，`Request4SuspendKtTest`、`Request7ChannelsKtTest` 等文件包含使用模拟服务调用的直接测试。

然而，这里有两个问题：

*   这些测试运行时间过长。每个测试大约需要 2 到 4 秒，而且每次都需要等待结果。效率不高。
*   你不能依赖解决方案运行的精确时间，因为它仍然需要额外的时间来准备和运行代码。你可以添加一个常数，但那样时间会因机器而异。模拟服务的延迟应高于此常数，这样你才能看到差异。如果常数是 0.5 秒，那么将延迟设为 0.1 秒将不够。

更好的方法是使用特殊框架来测试时间，同时多次运行相同的代码（这会进一步增加总时间），但这学习和设置起来很复杂。

为了解决这些问题并确保具有给定测试延迟的解决方案按预期运行，一个比另一个更快，可以使用_虚拟时间_ (virtual time) 和特殊的测试调度器 (test dispatcher)。这个调度器会跟踪从开始经过的虚拟时间，并立即在实时中运行所有内容。当你在此调度器上运行协程时，`delay` 会立即返回并推进虚拟时间。

使用此机制的测试运行速度很快，但你仍然可以在虚拟时间的不同时刻检查发生的事情。总运行时间显著减少：

![Comparison for total running time](time-comparison.png){width=700}

要使用虚拟时间，请将 `runBlocking` 调用替换为 `runTest`。`runTest` 接受一个 `TestScope` 的扩展 lambda 作为参数。当你在该特殊作用域内的 `suspend` 函数中调用 `delay` 时，`delay` 将增加虚拟时间，而不是在实时中延迟：

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

你可以使用 `TestScope` 的 `currentTime` 属性检查当前虚拟时间。本例中的实际运行时间是几毫秒，而虚拟时间等于延迟参数，即 1000 毫秒。

为了在子协程中完全实现“虚拟” `delay` 的效果，请使用 `TestDispatcher` 启动所有子协程。否则，它将无法工作。这个调度器会自动从其他 `TestScope` 继承，除非你提供不同的调度器：

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

如果在上面的例子中 `launch` 是在 `Dispatchers.Default` 的上下文中调用的，则测试将失败。你将收到一个异常，表明作业尚未完成。

只有当 `loadContributorsConcurrent()` 函数以继承的上下文启动子协程，而不使用 `Dispatchers.Default` 调度器修改上下文时，才能以这种方式对其进行测试。你可以在_调用_函数时而不是在_定义_函数时指定上下文元素（如调度器），这使得测试更加灵活和容易。

> 支持虚拟时间的测试 API 属于 [实验性](components-stability.md) 功能，未来可能会发生变化。
>
{style="warning"}

默认情况下，如果你使用实验性测试 API，编译器会显示警告。要抑制这些警告，请使用 `@OptIn(ExperimentalCoroutinesApi::class)` 注解测试函数或包含测试的整个类。添加编译器参数，指示编译器你正在使用实验性 API：

```kotlin
compileTestKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=kotlin.Experimental"
    }
}
```

在本教程对应的项目中，编译器参数已添加到 Gradle 脚本中。

### 任务 8

重构 `tests/tasks/` 中的以下测试，使其使用虚拟时间而不是实时：

*   Request4SuspendKtTest.kt
*   Request5ConcurrentKtTest.kt
*   Request6ProgressKtTest.kt
*   Request7ChannelsKtTest.kt

比较重构前后总运行时间。

#### 任务 8 的提示 {initial-collapse-state="collapsed" collapsible="true"}

1.  将 `runBlocking` 调用替换为 `runTest`，并将 `System.currentTimeMillis()` 替换为 `currentTime`：

    ```kotlin
    @Test
    fun test() = runTest {
        val startTime = currentTime
        // action
        val totalTime = currentTime - startTime
        // testing result
    }
    ```

2.  取消检查精确虚拟时间的断言的注释。
3.  别忘了添加 `@UseExperimental(ExperimentalCoroutinesApi::class)`。

#### 任务 8 的解决方案 {initial-collapse-state="collapsed" collapsible="true"}

以下是并发和通道情况下的解决方案：

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

首先，检查结果是否在预期的虚拟时间精确可用，然后检查结果本身：

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

通道版本的第一个中间结果比进度版本更早可用，你可以在使用虚拟时间的测试中看到这种差异。

> 其余“挂起”和“进度”任务的测试非常相似——你可以在项目的 `solutions` 分支中找到它们。
>
{style="tip"}

## 接下来

*   查看 KotlinConf 上的 [Kotlin 异步编程](https://kotlinconf.com/workshops/) 研讨会。
*   了解更多关于使用[虚拟时间](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)和[实验性测试包](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-test/)的信息。