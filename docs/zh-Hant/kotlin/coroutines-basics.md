<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 協程基礎)

為了建立能同時執行多項任務的應用程式，這項概念稱為**併發**，
Kotlin 使用_協程_。協程是一種可暫停計算，可讓您以清晰、循序的風格撰寫併發程式碼。
協程可以與其他協程並行執行，並可能平行運作。

在 JVM 和 Kotlin/Native 中，所有併發程式碼（例如協程）都在由作業系統管理的_執行緒_上執行。
協程可以暫停其執行，而不是阻塞執行緒。
這允許一個協程在等待某些資料到達時暫停，而另一個協程在同一個執行緒上運行，從而確保有效的資源利用率。

![Comparing parallel and concurrent threads](parallelism-and-concurrency.svg){width="700"}

有關協程與執行緒之間差異的更多資訊，請參閱[比較協程與 JVM 執行緒](#comparing-coroutines-and-jvm-threads)。

## 暫停函式

協程最基本的組成部分是_暫停函式_。
它允許執行中的操作暫停並稍後恢復，而不會影響程式碼的結構。

要宣告一個暫停函式，請使用 `suspend` 關鍵字：

```kotlin
suspend fun greet() {
    println("Hello world from a suspending function")
}
```

您只能從另一個暫停函式中呼叫暫停函式。
要在 Kotlin 應用程式的進入點呼叫暫停函式，請使用 `suspend` 關鍵字標記 `main()` 函式：

```kotlin
suspend fun main() {
    showUserInfo()
}

suspend fun showUserInfo() {
    println("Loading user...")
    greet()
    println("User: John Smith")
}

suspend fun greet() {
    println("Hello world from a suspending function")
}
```
{kotlin-runnable="true"}

這個範例尚未用到併發，但透過使用 `suspend` 關鍵字標記函式，
您允許它們呼叫其他暫停函式並在內部執行併發程式碼。

儘管 `suspend` 關鍵字是 Kotlin 核心語言的一部分，但大多數協程功能
都是透過 [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines) 函式庫提供的。

## 將 kotlinx.coroutines 函式庫加入您的專案

要將 `kotlinx.coroutines` 函式庫包含在您的專案中，請根據您的建置工具新增對應的依賴配置：

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
}
```
</tab>

<tab title="Maven" group-key="maven">

```xml
<!-- pom.xml -->
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlinx</groupId>
            <artifactId>kotlinx-coroutines-core</artifactId>
            <version>%coroutinesVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

</tab>
</tabs>

## 建立您的第一個協程

> 本頁上的範例使用明確的 `this` 運算式與協程建構器函式 `CoroutineScope.launch()` 和 `CoroutineScope.async()`。
> 這些協程建構器是 `CoroutineScope` 上的[擴充函式](extensions.md)，而 `this` 運算式則指的是作為接收者的當前 `CoroutineScope`。
>
> 如需實用範例，請參閱[從協程作用域中提取協程建構器](#extract-coroutine-builders-from-the-coroutine-scope)。
>
{style="note"}

要在 Kotlin 中建立協程，您需要以下幾項：

*   [暫停函式](#suspending-functions)。
*   可供其運行的[協程作用域](#coroutine-scope-and-structured-concurrency)，例如在 `withContext()` 函式內部。
*   [協程建構器](#coroutine-builder-functions)，例如 `CoroutineScope.launch()` 來啟動它。
*   [協程調度器](#coroutine-dispatchers) 來控制它使用哪些執行緒。

讓我們來看一個在多執行緒環境中使用多個協程的範例：

1.  匯入 `kotlinx.coroutines` 函式庫：

    ```kotlin
    import kotlinx.coroutines.*
    ```

2.  使用 `suspend` 關鍵字標記可以暫停和恢復的函式：

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
    }
    
    suspend fun main() {}
    ```

    > 雖然您可以在某些專案中將 `main()` 函式標記為 `suspend`，但在與現有程式碼整合或使用框架時可能無法實現。
    > 在這種情況下，請查閱框架的文件以了解它是否支援呼叫暫停函式。
    > 如果不支援，請使用 [`runBlocking()`](#runblocking) 透過阻塞當前執行緒來呼叫它們。
    > 
    {style="note"}

3.  新增 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html#) 函式來模擬暫停任務，例如擷取資料或寫入資料庫：

    ```kotlin
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        delay(1000L)
    }
   ```

    <!-- > Use [`kotlin.time.Duration`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-duration/) from the Kotlin standard library to express durations like `delay(1.seconds)` instead of using milliseconds.
    >
    {style="tip"} -->

4.  使用 [`withContext(Dispatchers.Default)`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#) 來定義多執行緒併發程式碼的進入點，這些程式碼在共用執行緒池上執行：

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) {
            // Add the coroutine builders here
        }
    }
    ```

   > 暫停的 `withContext()` 函式通常用於[上下文切換](coroutine-context-and-dispatchers.md#jumping-between-threads)，但在本範例中，
   > 它也定義了一個用於併發程式碼的非阻塞進入點。
   > 它使用 [`Dispatchers.Default` 調度器](#coroutine-dispatchers) 在共用執行緒池上執行程式碼以進行多執行緒執行。
   > 預設情況下，此執行緒池使用的執行緒數量上限與執行時可用的 CPU 核心數相同，最少為兩個執行緒。
   > 
   > 在 `withContext()` 區塊內啟動的協程共用相同的協程作用域，這確保了[結構化併發](#coroutine-scope-and-structured-concurrency)。
   > 
   {style="note"}

5.  使用[協程建構器函式](#coroutine-builder-functions)（例如 [`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)）來啟動協程：

    ```kotlin
    suspend fun main() {
        withContext(Dispatchers.Default) { // this: CoroutineScope
            // Starts a coroutine inside the scope with CoroutineScope.launch()
            this.launch { greet() }
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```

6.  組合這些部分以在共用執行緒池上同時執行多個協程：

    ```kotlin
    // Imports the coroutines library
    import kotlinx.coroutines.*

    // Imports the kotlin.time.Duration to express duration in seconds
    import kotlin.time.Duration.Companion.seconds

    // Defines a suspending function
    suspend fun greet() {
        println("The greet() on the thread: ${Thread.currentThread().name}")
        // Suspends for 1 second and releases the thread
        delay(1.seconds) 
        // The delay() function simulates a suspending API call here
        // You can add suspending API calls here like a network request
    }

    suspend fun main() {
        // Runs the code inside this block on a shared thread pool
        withContext(Dispatchers.Default) { // this: CoroutineScope
            this.launch() {
                greet()
            }
   
            // Starts another coroutine
            this.launch() {
                println("The CoroutineScope.launch() on the thread: ${Thread.currentThread().name}")
                delay(1.seconds)
                // The delay function simulates a suspending API call here
                // You can add suspending API calls here like a network request
            }
    
            println("The withContext() on the thread: ${Thread.currentThread().name}")
        }
    }
    ```
    {kotlin-runnable="true"}

嘗試多次執行此範例。
您可能會注意到每次執行程式時，輸出順序和執行緒名稱可能會有所不同，因為作業系統決定執行緒何時執行。

> 您可以在程式碼輸出中顯示協程名稱旁邊的執行緒名稱以獲取更多資訊。
> 為此，請在您的建置工具或 IDE 執行配置中傳遞 `-Dkotlinx.coroutines.debug` VM 選項。
>
> 有關更多資訊，請參閱[偵錯協程](https://github.com/Kotlin/kotlinx.coroutines/blob/master/docs/topics/debugging.md)。
>
{style="tip"}

## 協程作用域與結構化併發

當您在應用程式中執行許多協程時，您需要一種將它們分組管理的方式。
Kotlin 協程依賴於一個稱為_結構化併發_的原則來提供這種結構。

根據此原則，協程形成一個具有連結生命週期的父子任務樹狀結構。
協程的生命週期是從建立到完成、失敗或取消的狀態序列。

父協程會等待其子協程完成後才會結束。
如果父協程失敗或被取消，其所有子協程也會遞迴地被取消。
以這種方式保持協程連接，使得取消和錯誤處理變得可預測且安全。

為了維護結構化併發，新的協程只能在定義和管理其生命週期的 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) 中啟動。
`CoroutineScope` 包含_協程上下文_，它定義了調度器和其他執行屬性。
當您在另一個協程內部啟動協程時，它會自動成為其父作用域的子協程。

在 `CoroutineScope` 上呼叫[協程建構器函式](#coroutine-builder-functions)，例如 `CoroutineScope.launch()`，會啟動與該作用域相關聯的協程的子協程。
在建構器區塊內部，[接收者](lambdas.md#function-literals-with-receiver)是一個巢狀的 `CoroutineScope`，因此您在其中啟動的任何協程都會成為其子協程。

### 使用 `coroutineScope()` 函式建立協程作用域

要使用當前的協程上下文建立新的協程作用域，請使用
[`coroutineScope()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) 函式。
此函式會建立協程子樹的根協程。
它是區塊內部啟動的協程的直接父級，也是它們啟動的任何協程的間接父級。
`coroutineScope()` 會執行暫停區塊並等待該區塊及其內部啟動的任何協程完成。

以下是一個範例：

```kotlin
// Imports the kotlin.time.Duration to express duration in seconds
import kotlin.time.Duration.Companion.seconds

import kotlinx.coroutines.*

// If the coroutine context doesn't specify a dispatcher,
// CoroutineScope.launch() uses Dispatchers.Default
//sampleStart
suspend fun main() {
    // Root of the coroutine subtree
    coroutineScope { // this: CoroutineScope
        this.launch {
            this.launch {
                delay(2.seconds)
                println("Child of the enclosing coroutine completed")
            }
            println("Child coroutine 1 completed")
        }
        this.launch {
            delay(1.seconds)
            println("Child coroutine 2 completed")
        }
    }
    // Runs only after all children in the coroutineScope have completed
    println("Coroutine scope completed")
}
//sampleEnd
```
{kotlin-runnable="true"}

由於此範例中未指定[調度器](#coroutine-dispatchers)，因此 `coroutineScope()` 區塊中的 `CoroutineScope.launch()` 建構器函式會繼承當前的上下文。
如果該上下文沒有指定的調度器，`CoroutineScope.launch()` 會使用 `Dispatchers.Default`，它在共用執行緒池上執行。

### 從協程作用域中提取協程建構器

在某些情況下，您可能希望將協程建構器呼叫（例如 [`CoroutineScope.launch()`](#coroutinescope-launch)）提取到單獨的函式中。

請考慮以下範例：

```kotlin
suspend fun main() {
    coroutineScope { // this: CoroutineScope
        // Calls CoroutineScope.launch() where CoroutineScope is the receiver
        this.launch { println("1") }
        this.launch { println("2") }
    } 
}
```

> 您也可以將 `this.launch` 寫作 `launch`，而無需明確的 `this` 運算式。
> 這些範例使用明確的 `this` 運算式來強調它是 `CoroutineScope` 上的擴充函式。
>
> 有關帶有接收者的 Lambda 運算式如何在 Kotlin 中運作的更多資訊，請參閱[帶有接收者的函式字面值](lambdas.md#function-literals-with-receiver)。
>
{style="tip"}

`coroutineScope()` 函式接受一個帶有 `CoroutineScope` 接收者的 Lambda 運算式。
在此 Lambda 運算式內部，隱式接收者是一個 `CoroutineScope`，因此諸如 `CoroutineScope.launch()` 和 [`CoroutineScope.async()`](#coroutinescope-async) 之類的建構器函式會解析為
該接收者上的[擴充函式](extensions.md#extension-functions)。

要將協程建構器提取到另一個函式中，該函式必須宣告一個 `CoroutineScope` 接收者，否則會發生編譯錯誤：

```kotlin
import kotlinx.coroutines.*
//sampleStart
suspend fun main() {
    coroutineScope {
        launchAll()
    }
}

fun CoroutineScope.launchAll() { // this: CoroutineScope
    // Calls .launch() on CoroutineScope
    this.launch { println("1") }
    this.launch { println("2") } 
}
//sampleEnd
/* -- Calling launch without declaring CoroutineScope as the receiver results in a compilation error --

fun launchAll() {
    // Compilation error: this is not defined
    this.launch { println("1") }
    this.launch { println("2") }
}
 */
```
{kotlin-runnable="true"}

## 協程建構器函式

協程建構器函式是一個接受 `suspend` [Lambda 運算式](lambdas.md)的函式，該 Lambda 運算式定義要執行的協程。
以下是一些範例：

*   [`CoroutineScope.launch()`](#coroutinescope-launch)
*   [`CoroutineScope.async()`](#coroutinescope-async)
*   [`runBlocking()`](#runblocking)
*   [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html)
*   [`coroutineScope()`](#create-a-coroutine-scope-with-the-coroutinescope-function)

協程建構器函式需要一個 `CoroutineScope` 才能執行。
這可以是現有的作用域，也可以是您使用輔助函式（例如 `coroutineScope()`、[`runBlocking()`](#runblocking) 或 [`withContext()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/with-context.html#)）建立的作用域。
每個建構器都定義了協程如何啟動以及您如何與其結果互動。

### `CoroutineScope.launch()`

[`CoroutineScope.launch()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html#) 協程建構器函式是 `CoroutineScope` 上的擴充函式。
它在現有的[協程作用域](#coroutine-scope-and-structured-concurrency)內部啟動一個新的協程，而不會阻塞作用域的其餘部分。

當不需要結果或不想等待結果時，請使用 `CoroutineScope.launch()` 來執行與其他工作同時進行的任務：

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        performBackgroundWork()
    }
}

//sampleStart
suspend fun performBackgroundWork() = coroutineScope { // this: CoroutineScope
    // Starts a coroutine that runs without blocking the scope
    this.launch {
        // Suspends to simulate background work
        delay(100.milliseconds)
        println("Sending notification in background")
    }

    // Main coroutine continues while a previous one suspends
    println("Scope continues")
}
//sampleEnd
```
{kotlin-runnable="true"}

執行此範例後，您可以看到 `main()` 函式不會被 `CoroutineScope.launch()` 阻塞，並在協程在背景執行時繼續執行其他程式碼。

> `CoroutineScope.launch()` 函式會返回一個 [`Job`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) 句柄。
> 使用此句柄等待啟動的協程完成。
> 有關更多資訊，請參閱[取消和逾時](cancellation-and-timeouts.md#cancel-coroutines)。
> 
{style="tip"}

### `CoroutineScope.async()`

[`CoroutineScope.async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 協程建構器函式是 `CoroutineScope` 上的擴充函式。
它在現有的[協程作用域](#coroutine-scope-and-structured-concurrency)內部啟動併發計算，並返回一個 [`Deferred`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/) 句柄，該句柄代表一個最終結果。
使用 `.await()` 函式暫停程式碼，直到結果準備就緒：

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    // Starts downloading the first page
    val firstPage = this.async {
        delay(50.milliseconds)
        "First page"
    }

    // Starts downloading the second page in parallel
    val secondPage = this.async {
        delay(100.milliseconds)
        "Second page"
    }

    // Awaits both results and compares them
    val pagesAreEqual = firstPage.await() == secondPage.await()
    println("Pages are equal: $pagesAreEqual")
}
//sampleEnd
```
{kotlin-runnable="true"}

### `runBlocking()`

[`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 協程建構器函式會建立一個協程作用域，並阻塞當前[執行緒](#comparing-coroutines-and-jvm-threads)，直到
該作用域內啟動的協程完成。

僅當沒有其他選項可以從非暫停程式碼呼叫暫停程式碼時，才使用 `runBlocking()`：

```kotlin
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.*

// A third-party interface you can't change
interface Repository {
    fun readItem(): Int
}

object MyRepository : Repository {
    override fun readItem(): Int {
        // Bridges to a suspending function
        return runBlocking {
            myReadItem()
        }
    }
}

suspend fun myReadItem(): Int {
    delay(100.milliseconds)
    return 4
}
```

## 協程調度器

一個_協程調度器_ 控制著協程用於其執行的執行緒或執行緒池。
協程不總是綁定到單一執行緒。
它們可以根據調度器在一個執行緒上暫停，並在另一個執行緒上恢復。
這讓您可以同時執行許多協程，而無需為每個協程分配單獨的執行緒。

> 儘管協程可以在不同的執行緒上暫停和恢復，
> 但在協程暫停之前寫入的值，當它恢復時，仍保證在同一個協程內可用。
>
{style="tip"}

調度器與[協程作用域](#coroutine-scope-and-structured-concurrency)協同工作，以定義協程何時運行以及在哪裡運行。
協程作用域控制協程的生命週期，而調度器則控制用於執行的執行緒。

> 您不必為每個協程指定調度器。
> 預設情況下，協程會從其父作用域繼承調度器。
> 您可以指定一個調度器，以便在不同的上下文中執行協程。
> 
> 如果協程上下文不包含調度器，協程建構器會使用 `Dispatchers.Default`。
>
{style="note"}

`kotlinx.coroutines` 函式庫包含用於不同使用案例的不同調度器。
例如，[`Dispatchers.Default`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-default.html) 在共用執行緒池上執行協程，在背景執行工作，
與主執行緒分離。這使其成為 CPU 密集型操作（如資料處理）的理想選擇。

要為協程建構器（例如 `CoroutineScope.launch()`）指定調度器，請將其作為參數傳遞：

```kotlin
suspend fun runWithDispatcher() = coroutineScope { // this: CoroutineScope
    this.launch(Dispatchers.Default) {
        println("Running on ${Thread.currentThread().name}")
    }
}
```

或者，您可以使用 `withContext()` 區塊，讓其中的所有程式碼在指定的調度器上執行：

```kotlin
// Imports the kotlin.time.Duration to enable expressing duration in milliseconds
import kotlin.time.Duration.Companion.milliseconds

import kotlinx.coroutines.*

//sampleStart
suspend fun main() = withContext(Dispatchers.Default) { // this: CoroutineScope
    println("Running withContext block on ${Thread.currentThread().name}")

    val one = this.async {
        println("First calculation starting on ${Thread.currentThread().name}")
        val sum = (1L..500_000L).sum()
        delay(200L)
        println("First calculation done on ${Thread.currentThread().name}")
        sum
    }

    val two = this.async {
        println("Second calculation starting on ${Thread.currentThread().name}")
        val sum = (500_001L..1_000_000L).sum()
        println("Second calculation done on ${Thread.currentThread().name}")
        sum
    }

    // Waits for both calculations and prints the result
    println("Combined total: ${one.await() + two.await()}")
}
//sampleEnd
```
{kotlin-runnable="true"}

要了解有關協程調度器及其用法的更多資訊，包括其他調度器（例如 [`Dispatchers.IO`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-i-o.html) 和 [`Dispatchers.Main`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)），請參閱[協程上下文和調度器](coroutine-context-and-dispatchers.md)。

## 比較協程與 JVM 執行緒

雖然協程是可暫停計算，與 JVM 上的執行緒一樣並行執行程式碼，但它們的底層運作方式不同。

_執行緒_由作業系統管理。執行緒可以在多個 CPU 核心上平行執行任務，是 JVM 上併發的標準方法。
當您建立執行緒時，作業系統會為其堆疊分配記憶體，並使用核心在執行緒之間切換。
這使得執行緒功能強大但也耗用大量資源。
每個執行緒通常需要數 MB 的記憶體，而且 JVM 通常一次只能處理數千個執行緒。

另一方面，協程不綁定到特定執行緒。
它可以在一個執行緒上暫停，並在另一個執行緒上恢復，因此許多協程可以共用同一個執行緒池。
當協程暫停時，執行緒不會被阻塞，並保持空閒以執行其他任務。
這使得協程比執行緒輕量得多，並允許在一個程序中執行數百萬個協程而不會耗盡系統資源。

![Comparing coroutines and threads](coroutines-and-threads.svg){width="700"}

讓我們來看一個範例，其中 50,000 個協程各自等待五秒鐘，然後列印一個點（`.`）：

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.*

suspend fun main() {
    withContext(Dispatchers.Default) {
        // Launches 50,000 coroutines that each wait five seconds, then print a period
        printPeriods()
    }
}

//sampleStart
suspend fun printPeriods() = coroutineScope { // this: CoroutineScope
    // Launches 50,000 coroutines that each wait five seconds, then print a period
    repeat(50_000) {
        this.launch {
            delay(5.seconds)
            print(".")
        }
    }
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

現在讓我們來看使用 JVM 執行緒的相同範例：

```kotlin
import kotlin.concurrent.thread

fun main() {
    repeat(50_000) {
        thread {
            Thread.sleep(5000L)
            print(".")
        }
    }
}
```
{kotlin-runnable="true" validate="false"}

執行此版本會使用更多的記憶體，因為每個執行緒都需要自己的記憶體堆疊。
對於 50,000 個執行緒，這可能高達 100 GB，而相同數量的協程大約需要 500 MB。

根據您的作業系統、JDK 版本和設定，
JVM 執行緒版本可能會拋出記憶體不足錯誤，或減慢執行緒建立速度以避免同時執行過多的執行緒。

## 接下來

*   在[組合暫停函式](composing-suspending-functions.md)中了解更多關於組合暫停函式的資訊。
*   在[取消和逾時](cancellation-and-timeouts.md)中學習如何取消協程和處理逾時。
*   在[協程上下文和調度器](coroutine-context-and-dispatchers.md)中深入了解協程執行和執行緒管理。
*   在[非同步流程](flow.md)中學習如何返回多個非同步計算的值。