<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 偵錯 Kotlin Flow – 教學)

本教學示範如何建立 Kotlin Flow 並使用 IntelliJ IDEA 對其進行偵錯。

本教學假設您已具備[協同程式](coroutines-basics.md)和 [flow](coroutines-flow.md) 概念的先驗知識。

## 建立 Kotlin flow

建立一個具有慢速發射器（emitter）和慢速收集器（collector）的 Kotlin [flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html)：

1. 在 IntelliJ IDEA 中開啟一個 Kotlin 專案。如果您沒有專案，請[建立一個](jvm-get-started.md#create-a-project)。
2. 要在 Gradle 專案中使用 `kotlinx.coroutines` 程式庫，請將以下相依性新增至 `build.gradle(.kts)`：
   
   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   dependencies {
       implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
   }
   ``` 
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
   }
   ```
   
   </tab>
   </tabs>
   
   對於其他建置系統，請參閱 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) 中的說明。

3. 開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含會印出 `Hello World!` 的範例程式碼。

4. 建立傳回三個數字之 flow 的 `simple()` 函式：

    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函式來模擬耗費 CPU 的阻塞程式碼。它會掛起協同程式 100 ms 而不會阻塞執行緒。
    * 在 `for` 迴圈中使用 [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 函式產生值。

    ```kotlin
    import kotlinx.coroutines.*
    import kotlinx.coroutines.flow.*
    import kotlin.system.*
 
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            emit(i)
        }
    }
    ```

5. 更改 `main()` 函式中的程式碼：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 區塊來包裝協同程式。
    * 使用 [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 函式收集發射出的值。
    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函式來模擬耗費 CPU 的程式碼。它會掛起協同程式 300 ms 而不會阻塞執行緒。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函式印出從 flow 收集到的值。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. 點擊 **Build Project** 來組建程式碼。

    ![組建應用程式](flow-build-project.png)

## 偵錯協同程式

1. 在呼叫 `emit()` 函式的行設置一個中斷點：

    ![組建主控台應用程式](flow-breakpoint.png)

2. 點擊畫面頂部執行組態旁邊的 **Debug**，以偵錯模式執行程式碼。

    ![組建主控台應用程式](flow-debug-project.png)

    **Debug** 工具視窗隨即出現： 
    * **Frames** 分頁包含呼叫堆疊。
    * **Variables** 分頁包含目前內容中的變數。它告訴我們 flow 正在發射第一個值。
    * **Coroutines** 分頁包含有關執行中或已掛起協同程式的資訊。

    ![偵錯協同程式](flow-debug-1.png)

3. 在 **Debug** 工具視窗中點擊 **Resume Program** 恢復偵錯工作階段。程式會停在同一個中斷點。

    ![偵錯協同程式](flow-resume-debug.png)

    現在 flow 發射第二個值。

    ![偵錯協同程式](flow-debug-2.png)

### 優化掉的變數

如果您使用 `suspend` 函式，在偵錯工具中，您可能會在變數名稱旁邊看到 "was optimized out" 文字：

![變數 "a" 已被優化掉](variable-optimised-out.png)

這段文字表示該變數的生命週期已縮短，且該變數已不存在。
對含有優化變數的程式碼進行偵錯很困難，因為您看不到它們的值。
您可以使用 `-Xdebug` 編譯器選項停用此行為。

> __切勿在生產環境中使用此標記__：`-Xdebug` 可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

## 新增並行執行的協同程式

1. 開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

2. 增強程式碼以並行執行發射器和收集器：

    * 新增對 [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 函式的呼叫以並行執行發射器和收集器。`buffer()` 會儲存發射的值，並在單獨的協同程式中執行 flow 收集器。 
 
    ```kotlin
    fun main() = runBlocking<Unit> {
        simple()
            .buffer()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

3. 點擊 **Build Project** 來組建程式碼。

## 偵錯具有兩個協同程式的 Kotlin flow

1. 在 `println(value)` 處設置一個新的中斷點。

2. 點擊畫面頂部執行組態旁邊的 **Debug**，以偵錯模式執行程式碼。

    ![組建主控台應用程式](flow-debug-3.png)

    **Debug** 工具視窗隨即出現。

    在 **Coroutines** 分頁中，您可以看到有兩個協同程式正在並行執行。由於 `buffer()` 函式，flow 收集器和發射器在單獨的協同程式中執行。
    `buffer()` 函式會緩衝來自 flow 發射的值。
    發射器協同程式的狀態為 **RUNNING**，而收集器協同程式的狀態為 **SUSPENDED**。

3. 在 **Debug** 工具視窗中點擊 **Resume Program** 恢復偵錯工作階段。

    ![偵錯協同程式](flow-debug-4.png)

    現在收集器協同程式的狀態為 **RUNNING**，而發射器協同程式的狀態為 **SUSPENDED**。

    您可以深入研究每個協同程式以對您的程式碼進行偵錯。