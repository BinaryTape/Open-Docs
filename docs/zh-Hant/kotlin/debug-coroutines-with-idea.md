<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 偵錯協程 – 教學課程)

本教學課程示範如何建立 Kotlin 協程並使用 IntelliJ IDEA 偵錯它們。

本教學課程假定您對 [協程](coroutines-guide.md) 概念已有先備知識。

## 建立協程

1. 在 IntelliJ IDEA 中開啟一個 Kotlin 專案。如果您沒有專案，請[建立一個](jvm-get-started.md#create-a-project)。
2. 若要在 Gradle 專案中使用 `kotlinx.coroutines` 函式庫，請將以下依賴項新增至 `build.gradle(.kts)`：

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

    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含將列印 `Hello World!` 的範例程式碼。

4. 變更 `main()` 函式中的程式碼：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 區塊來包裝一個協程。
    * 使用 [`async()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 函式來建立計算延遲值 `a` 和 `b` 的協程。
    * 使用 [`await()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-deferred/await.html) 函式來等待計算結果。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函式將計算狀態和乘法結果列印到輸出。

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

5. 透過點擊 **Build Project** 來建置程式碼。

    ![Build an application](flow-build-project.png)

## 偵錯協程

1. 在呼叫 `println()` 函式的行上設定中斷點：

    ![Build a console application](coroutine-breakpoint.png)

2. 透過點擊螢幕上方執行組態旁的 **Debug** 來以偵錯模式執行程式碼。

    ![Build a console application](flow-debug-project.png)

    **Debug** 工具視窗隨即出現：
    * **框架 (Frames)** 索引標籤包含呼叫堆疊。
    * **變數 (Variables)** 索引標籤包含目前環境中的變數。
    * **協程 (Coroutines)** 索引標籤包含執行中或暫停的協程資訊。它顯示有三個協程。
    第一個協程的狀態為 **RUNNING**，另外兩個的狀態為 **CREATED**。

    ![Debug the coroutine](coroutine-debug-1.png)

3. 透過點擊 **Debug** 工具視窗中的 **Resume Program** 來恢復偵錯會話：

    ![Debug the coroutine](coroutine-debug-2.png)
    
    現在 **協程 (Coroutines)** 索引標籤顯示如下：
    * 第一個協程的狀態為 **SUSPENDED** – 它正在等待值以便進行乘法運算。
    * 第二個協程正在計算 `a` 值 – 它的狀態為 **RUNNING**。
    * 第三個協程的狀態為 **CREATED** 且未計算 `b` 的值。

4. 透過點擊 **Debug** 工具視窗中的 **Resume Program** 來恢復偵錯會話：

    ![Build a console application](coroutine-debug-3.png)

    現在 **協程 (Coroutines)** 索引標籤顯示如下：
    * 第一個協程的狀態為 **SUSPENDED** – 它正在等待值以便進行乘法運算。
    * 第二個協程已計算出其值並消失了。
    * 第三個協程正在計算 `b` 的值 – 它的狀態為 **RUNNING**。

使用 IntelliJ IDEA 偵錯器，您可以深入探究每個協程來偵錯您的程式碼。

### 最佳化移除的變數

如果您使用 `suspend` 函式，在偵錯器中，您可能會在變數名稱旁邊看到「was optimized out」文字：

![Variable "a" was optimized out](variable-optimised-out.png){width=480}

這段文字表示變數的生命週期已縮短，且該變數已不再存在。
偵錯帶有最佳化變數的程式碼很困難，因為您看不到它們的值。
您可以透過 `-Xdebug` 編譯器選項來禁用此行為。

> __切勿在生產環境中使用此旗標__：`-Xdebug` 可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}