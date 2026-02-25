<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 偵錯協同程式 – 教學)

本教學示範如何建立 Kotlin 協同程式，並使用 IntelliJ IDEA 對其進行偵錯。

本教學假設您已具備[協同程式](coroutines-guide.md)概念的背景知識。

## 建立協同程式

1. 在 IntelliJ IDEA 中開啟一個 Kotlin 專案。如果您沒有專案，請[建立一個](jvm-get-started.md#create-a-project)。
2. 若要在 Gradle 專案中使用 `kotlinx.coroutines` 程式庫，請將以下相依性新增至 `build.gradle(.kts)`：

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

    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含會列印 `Hello World!` 的範例程式碼。

4. 修改 `main()` 函式中的程式碼：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 區塊來包裝一個協同程式。
    * 使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函式建立協同程式，以計算延後值 `a` 和 `b`。
    * 使用 [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函式等待計算結果。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函式將運算狀態與乘法結果列印到輸出。

    ```kotlin
    import kotlinx.coroutines.*
    
    fun main() = runBlocking<Unit> {
        val a = async {
            println("I'm computing part of the answer")
            6
        }
        val b = async {
            println("I'm computing another part of the answer")
            7
        }
        println("The answer is ${a.await() * b.await()}")
    }
    ```

5. 點擊 **Build Project** 來組建程式碼。

    ![組建應用程式](flow-build-project.png)

## 偵錯協同程式

1. 在呼叫 `println()` 函式的行設置中斷點：

    ![組建主控台應用程式](coroutine-breakpoint.png)

2. 點擊畫面頂部執行配置旁的 **Debug**，以偵錯模式執行程式碼。

    ![組建主控台應用程式](flow-debug-project.png)

    **偵錯 (Debug)** 工具視窗隨即出現： 
    * **Frames** 索引標籤包含呼叫堆疊。
    * **Variables** 索引標籤包含目前上下文中的變數。
    * **Coroutines** 索引標籤包含執行中或已暫掛協同程式的資訊。它顯示目前有三個協同程式。
    第一個處於 **RUNNING** 狀態，另外兩個處於 **CREATED** 狀態。

    ![偵錯協同程式](coroutine-debug-1.png)

3. 點擊 **偵錯 (Debug)** 工具視窗中的 **Resume Program** 恢復偵錯工作階段：

    ![偵錯協同程式](coroutine-debug-2.png)
    
    現在 **Coroutines** 索引標籤顯示如下：
    * 第一個協同程式處於 **SUSPENDED** 狀態 — 正在等待值以便進行乘法運算。
    * 第二個協同程式正在計算 `a` 的值 — 處於 **RUNNING** 狀態。
    * 第三個協同程式處於 **CREATED** 狀態，尚未計算 `b` 的值。

4. 點擊 **偵錯 (Debug)** 工具視窗中的 **Resume Program** 恢復偵錯工作階段：

    ![組建主控台應用程式](coroutine-debug-3.png)

    現在 **Coroutines** 索引標籤顯示如下：
    * 第一個協同程式處於 **SUSPENDED** 狀態 — 正在等待值以便進行乘法運算。
    * 第二個協同程式已計算出值並消失。
    * 第三個協同程式正在計算 `b` 的值 — 處於 **RUNNING** 狀態。

使用 IntelliJ IDEA 偵錯工具，您可以深入探索每個協同程式以偵錯您的程式碼。

### 被優化掉的變數

如果您使用 `suspend` 函式，在偵錯工具中，您可能會在變數名稱旁邊看到 "was optimized out" 文字：

![變數 "a" 被優化掉](variable-optimised-out.png){width=480}

這段文字表示變數的生命週期已縮短，該變數已不存在。
由於看不到變數的值，偵錯具有被優化變數的程式碼會很困難。您可以透過 `-Xdebug` 編譯器選項停用此行為。

> __切勿在生產環境中使用此旗標__：`-Xdebug` 可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}