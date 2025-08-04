<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 偵錯 Kotlin Flow – 教學課程)

本教學課程示範如何建立 Kotlin Flow 並使用 IntelliJ IDEA 偵錯。

本教學課程假設您已具備 [協程](coroutines-guide.md) 和 [Kotlin Flow](flow.md#flows) 概念的基礎知識。

## 建立 Kotlin Flow

建立一個具有慢速發射器和慢速收集器的 Kotlin [flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html)：

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

    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含將印出 `Hello World!` 的範例程式碼。

4. 建立傳回三個數字流的 `simple()` 函數：

    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函數模仿耗費 CPU 的阻塞程式碼。它會暫停協程 100 毫秒而不會阻塞執行緒。
    * 使用 [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 函數在 `for` 迴圈中產生值。

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

5. 更改 `main()` 函數中的程式碼：

    * 使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 區塊來包裝協程。
    * 使用 [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 函數收集發射的值。
    * 使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函數模仿耗費 CPU 的程式碼。它會暫停協程 300 毫秒而不會阻塞執行緒。
    * 使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函數印出從流中收集的值。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6. 點擊 **Build Project** (建置專案) 來建置程式碼。

    ![Build an application](flow-build-project.png)

## 偵錯協程

1. 在呼叫 `emit()` 函數的行上設定斷點：

    ![Build a console application](flow-breakpoint.png)

2. 點擊畫面頂部執行組態旁的 **Debug** (偵錯) 來以偵錯模式執行程式碼。

    ![Build a console application](flow-debug-project.png)

    **Debug** (偵錯) 工具視窗隨即出現：
    * **Frames** (堆疊影格) 索引標籤包含呼叫堆疊。
    * **Variables** (變數) 索引標籤包含當前上下文中的變數。它告訴我們流正在發射第一個值。
    * **Coroutines** (協程) 索引標籤包含有關執行中或已暫停協程的資訊。

    ![Debug the coroutine](flow-debug-1.png)

3. 點擊 **Debug** (偵錯) 工具視窗中的 **Resume Program** (繼續程式) 以繼續偵錯工作階段。程式會停在相同的斷點。

    ![Debug the coroutine](flow-resume-debug.png)

    現在流發射第二個值。

    ![Debug the coroutine](flow-debug-2.png)

### 優化移除的變數

如果您使用 `suspend` 函數，在偵錯器中，您可能會在變數名稱旁邊看到「was optimized out」(已優化移除) 的文字：

![Variable "a" was optimized out](variable-optimised-out.png)

此文字表示變數的生命週期已縮短，並且該變數已不再存在。
由於您看不到它們的值，因此很難偵錯帶有優化變數的程式碼。
您可以使用 `-Xdebug` 編譯器選項停用此行為。

> __切勿在生產環境中使用此標誌__：`-Xdebug` 可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

## 新增一個並行執行的協程

1. 開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

2. 增強程式碼以並行執行發射器和收集器：

    * 新增一個對 [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 函數的呼叫，以並行執行發射器和收集器。`buffer()` 會儲存發射的值並在單獨的協程中執行流收集器。
 
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

3. 點擊 **Build Project** (建置專案) 來建置程式碼。

## 偵錯帶有兩個協程的 Kotlin Flow

1. 在 `println(value)` 處設定一個新斷點。

2. 點擊畫面頂部執行組態旁的 **Debug** (偵錯) 來以偵錯模式執行程式碼。

    ![Build a console application](flow-debug-3.png)

    **Debug** (偵錯) 工具視窗隨即出現。

    在 **Coroutines** (協程) 索引標籤中，您可以看到有兩個協程正在並行執行。由於 `buffer()` 函數，流收集器和發射器在單獨的協程中執行。
    `buffer()` 函數會緩衝從流中發射的值。
    發射器協程處於 **RUNNING** (執行中) 狀態，而收集器協程處於 **SUSPENDED** (已暫停) 狀態。

3. 點擊 **Debug** (偵錯) 工具視窗中的 **Resume Program** (繼續程式) 以繼續偵錯工作階段。

    ![Debugging coroutines](flow-debug-4.png)

    現在收集器協程處於 **RUNNING** (執行中) 狀態，而發射器協程處於 **SUSPENDED** (已暫停) 狀態。

    您可以深入探究每個協程來偵錯您的程式碼。