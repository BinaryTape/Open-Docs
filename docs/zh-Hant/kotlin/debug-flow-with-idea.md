<contribute-url>https://github.com/Kotlin/kotlinx.coroutines/edit/master/docs/topics/</contribute-url>

[//]: # (title: 使用 IntelliJ IDEA 除錯 Kotlin Flow – 教學課程)

本教學課程示範如何建立 Kotlin Flow 並使用 IntelliJ IDEA 除錯它。

本教學課程假設您已具備 [協程](coroutines-guide.md) 和 [Kotlin Flow](flow.md#flows) 概念的先備知識。

## 建立 Kotlin Flow

建立一個具有慢速發射器和慢速收集器的 Kotlin [Flow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/flow.html)：

1.  在 IntelliJ IDEA 中開啟一個 Kotlin 專案。如果您沒有專案，請[建立一個](jvm-get-started.md#create-a-project)。
2.  若要在 Gradle 專案中使用 `kotlinx.coroutines` 函式庫，請將以下依賴項新增至 `build.gradle(.kts)`：
    
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
    
    對於其他建構系統，請參閱 [`kotlinx.coroutines` README](https://github.com/Kotlin/kotlinx.coroutines#using-in-your-projects) 中的說明。

3.  開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

    `src` 目錄包含 Kotlin 原始碼檔案和資源。`Main.kt` 檔案包含將會印出 `Hello World!` 的範例程式碼。

4.  建立會回傳一個包含三個數字的 `simple()` 函式：

    *   使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函式來模擬耗費 CPU 的阻塞式程式碼。它會將協程暫停 100 毫秒而不阻塞執行緒。
    *   在 `for` 迴圈中使用 [`emit()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow-collector/emit.html) 函式來產生值。

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

5.  變更 `main()` 函式中的程式碼：

    *   使用 [`runBlocking()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/run-blocking.html) 區塊來包裹一個協程。
    *   使用 [`collect()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/collect.html) 函式來收集發射出來的值。
    *   使用 [`delay()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/delay.html) 函式來模擬耗費 CPU 的程式碼。它會將協程暫停 300 毫秒而不阻塞執行緒。
    *   使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函式來印出從 Flow 收集到的值。

    ```kotlin
    fun main() = runBlocking {
        simple()
            .collect { value ->
                delay(300)
                println(value)
            }
    }
    ```

6.  點擊「**建構專案**」來建構程式碼。

    ![建構應用程式](flow-build-project.png)

## 除錯協程

1.  在呼叫 `emit()` 函式的行設定中斷點：

    ![建構控制台應用程式](flow-breakpoint.png)

2.  點擊螢幕上方執行設定旁的「**除錯**」來以除錯模式執行程式碼。

    ![建構控制台應用程式](flow-debug-project.png)

    「**除錯**」工具視窗隨即出現： 
    *   「**框架 (Frames)**」分頁包含呼叫堆疊。
    *   「**變數 (Variables)**」分頁包含目前上下文中的變數。它告訴我們 Flow 正在發射第一個值。
    *   「**協程 (Coroutines)**」分頁包含執行中或已暫停的協程資訊。

    ![除錯協程](flow-debug-1.png)

3.  點擊「**除錯**」工具視窗中的「**恢復程式 (Resume Program)**」來恢復除錯器會話。程式會在相同的中斷點停止。

    ![除錯協程](flow-resume-debug.png)

    現在 Flow 發射第二個值。

    ![除錯協程](flow-debug-2.png)

### 最佳化掉的變數

如果您使用 `suspend` 函式，在除錯器中，您可能會看到變數名稱旁出現「已最佳化掉」的文字：

![變數「a」已最佳化掉](variable-optimised-out.png)

這段文字表示變數的生命週期已縮短，且該變數已不存在。除錯包含最佳化變數的程式碼會很困難，因為您看不到它們的值。您可以使用 `-Xdebug` 編譯器選項來停用此行為。

> __切勿在生產環境中使用此旗標__：`-Xdebug` 可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

## 新增一個併發執行的協程

1.  開啟 `src/main/kotlin` 中的 `Main.kt` 檔案。

2.  增強程式碼以讓發射器和收集器併發執行：

    *   新增對 [`buffer()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/buffer.html) 函式的呼叫，以讓發射器和收集器併發執行。`buffer()` 會儲存發射出來的值，並在單獨的協程中執行 Flow 收集器。 
 
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

3.  點擊「**建構專案**」來建構程式碼。

## 除錯具有兩個協程的 Kotlin Flow

1.  在 `println(value)` 處設定新的中斷點。

2.  點擊螢幕上方執行設定旁的「**除錯**」來以除錯模式執行程式碼。

    ![建構控制台應用程式](flow-debug-3.png)

    「**除錯**」工具視窗隨即出現。

    在「**協程 (Coroutines)**」分頁中，您可以看到有兩個協程正在併發執行。由於 `buffer()` 函式，Flow 收集器和發射器在單獨的協程中執行。`buffer()` 函式會緩衝 (buffer) 從 Flow 發射出來的值。發射器協程處於**執行中 (RUNNING)** 狀態，而收集器協程處於**暫停中 (SUSPENDED)** 狀態。

3.  點擊「**除錯**」工具視窗中的「**恢復程式 (Resume Program)**」來恢復除錯器會話。

    ![除錯協程](flow-debug-4.png)

    現在收集器協程處於**執行中 (RUNNING)** 狀態，而發射器協程處於**暫停中 (SUSPENDED)** 狀態。

    您可以深入探究每個協程以除錯您的程式碼。