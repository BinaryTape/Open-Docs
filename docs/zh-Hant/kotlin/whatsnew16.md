`$` 之後的第一個數字始終被視為群組參考的一部分。隨後的數字只有在形成有效的群組參考時才會合併到 `index` 中。只有數字 '0'–'9' 被視為群組參考的潛在組件。請注意，捕獲群組的索引從 '1' 開始。索引為 '0' 的群組代表整個相符項。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或數字 '0'–'9' 組成。第一個字元必須是字母。

    > 替換模式中的命名群組目前僅在 JVM 上支援。
    >
    {style="note"}

* 若要在替換字串中包含後續字元作為常值，請使用反斜線字元 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替換字串必須被視為常值字串，您可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 現有 API 的改進

* 1.6.0 版為 `Comparable.compareTo()` 增加了中置 (infix) 擴充函式。您現在可以使用中置形式來比較兩個物件的順序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 現在也不是內嵌的 (inline)，以統一所有平台的實作。
* 字串的 `compareTo()` 和 `equals()` 函式，以及 CharSequence 的 `isBlank()` 函式現在在 JS 中的行為與在 JVM 上的行為完全相同。以前在涉及非 ASCII 字元時存在偏差。

### 棄用事項

在 Kotlin 1.6.0 中，我們開始對某些僅限 JS 的標準函式庫 API 進行棄用週期並發出警告。

#### concat()、match() 和 matches() 字串函式

* 要將字串與給定其他物件的字串表示形式串接，請使用 `plus()` 代替 `concat()`。
* 要尋找輸入中正規表示式的所有相符項，請使用 Regex 類別的 `findAll()` 代替 `String.match(regex: String)`。
* 要檢查正規表示式是否與整個輸入相符，請使用 Regex 類別的 `matches()` 代替 `String.matches(regex: String)`。

#### 接受比較函式的陣列 sort()

我們已棄用 `Array<out T>.sort()` 函式以及內嵌函式 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，這些函式按照比較函式傳遞的順序對陣列進行排序。請使用其他標準函式庫函式進行陣列排序。

參考 [集合排序](collection-ordering.md) 部分。

## 工具

### Kover – Kotlin 的程式碼涵蓋率工具

> Kover Gradle 外掛程式是實驗性的 (Experimental)。我們歡迎您在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 提供回饋。
>
{style="warning"}

透過 Kotlin 1.6.0，我們引入了 Kover – 一款針對 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 程式碼涵蓋率代理的 Gradle 外掛程式。它適用於所有語言結構，包括內嵌函式。

在 [GitHub 儲存庫](https://github.com/Kotlin/kotlinx-kover) 或此影片中進一步了解 Kover：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – 程式碼涵蓋率外掛程式"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已經發布，具有多項特性和改進：

* 支援 [新的 Kotlin/Native 記憶體管理員](#preview-of-the-new-memory-manager)
* 引入分配器視圖 (views) API，允許在不建立額外執行緒的情況下限制並行性
* 從 Java 6 遷移到 Java 8 目標
* `kotlinx-coroutines-test` 具有全新重新設計的 API 和多平台支援
* 引入 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它賦予協同程式對 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 變數的執行緒安全寫入權限

在 [變更記錄](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 中進一步了解。

## 遷移至 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 將在 Kotlin 外掛程式 1.6.0 可用時建議更新。

要將現有專案遷移到 Kotlin 1.6.0，請將 Kotlin 版本更改為 `1.6.0` 並重新匯入您的 Gradle 或 Maven 專案。[了解如何更新至 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 開始新專案，請更新 Kotlin 外掛程式並從 **File** | **New** | **Project** 執行專案精靈。

新的命令列工具編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0) 下載。

Kotlin 1.6.0 是一個特性版本，因此可能會帶來與您為該語言早期版本編寫的程式碼不相容的變更。在 [Kotlin 1.6 相容性指南](compatibility-guide-16.md) 中可以找到此類變更的詳細列表。