[//]: # (title: Kotlin 1.4.30 有什麼新功能)

[發佈日期：2021 年 2 月 3 日](releases.md#release-details)

Kotlin 1.4.30 提供了新語言功能的預覽版本，將 Kotlin/JVM 編譯器的新 IR 後端提升至 Beta，並帶來了各種效能和功能上的改進。

您也可以透過 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/) 了解新功能。

## 語言功能

Kotlin 1.5.0 將帶來新的語言功能——JVM 記錄 (record) 支援、密封 (sealed) 介面以及穩定的內聯 (inline) 類別。在 Kotlin 1.4.30 中，您可以在預覽模式下試用這些功能和改進。如果您能在相應的 YouTrack 議題中與我們分享您的回饋，我們將不勝感激，因為這將使我們能夠在 1.5.0 發佈前解決問題。

*   [JVM 記錄 (record) 支援](#jvm-records-support)
*   [密封 (sealed) 介面](#sealed-interfaces) 和 [密封 (sealed) 類別的改進](#package-wide-sealed-class-hierarchies)
*   [改進的內聯 (inline) 類別](#improved-inline-classes)

要啟用這些語言功能和改進的預覽模式，您需要透過新增特定的編譯器選項 (compiler options) 來選擇啟用。詳情請參閱下方章節。

透過 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30) 了解更多關於新功能預覽的資訊。

### JVM 記錄 (record) 支援

> JVM 記錄 (record) 功能為 [實驗性 (Experimental)](components-stability.md)。它可能隨時被移除或更改。
> 需要選擇啟用（詳情請參閱下方），且您應僅用於評估目的。如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 中提供回饋，我們將不勝感激。
>
{style="warning"}

[JDK 16 發佈](https://openjdk.java.net/projects/jdk/16/) 計劃穩定一種新的 Java 類別型別，稱為 [record](https://openjdk.java.net/jeps/395)。為了提供 Kotlin 的所有優勢並保持其與 Java 的互操作性 (interoperability)，Kotlin 正在引入實驗性的記錄 (record) 類別支援。

您可以像 Kotlin 中帶有屬性 (properties) 的類別一樣使用在 Java 中宣告的記錄 (record) 類別。無需額外步驟。

從 1.4.30 開始，您可以在 Kotlin 中使用 `@JvmRecord` 註解為 [資料類別 (data class)](data-classes.md) 宣告記錄 (record) 類別：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要試用 JVM 記錄 (record) 的預覽版本，請新增編譯器選項 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我們將繼續致力於 JVM 記錄 (record) 支援，如果您能使用此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-42430) 與我們分享您的回饋，我們將不勝感激。

深入了解實作、限制和語法，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。

### 密封 (sealed) 介面

> 密封 (sealed) 介面為 [實驗性 (Experimental)](components-stability.md)。它們可能隨時被移除或更改。
> 需要選擇啟用（詳情請參閱下方），且您應僅用於評估目的。如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供回饋，我們將不勝感激。
>
{style="warning"}

在 Kotlin 1.4.30 中，我們正在推出 _密封介面 (sealed interfaces)_ 的原型 (prototype)。它們補充了密封類別 (sealed classes)，並使得建立更靈活的受限制類別階層 (class hierarchies) 成為可能。

它們可以作為無法在同一個模組 (module) 之外實作的「內部」介面。您可以依賴此事實，例如，撰寫窮盡 (exhaustive) 的 `when` 表達式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() is exhaustive: no other polygon implementations can appear
// after the module is compiled
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}
```

另一個使用案例：透過密封介面 (sealed interfaces)，您可以從兩個或更多密封父類別 (sealed superclasses) 繼承一個類別。

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

要試用密封 (sealed) 介面的預覽版本，請新增編譯器選項 `-language-version 1.5`。一旦您切換到此版本，您將能夠在介面 (interfaces) 上使用 `sealed` 修飾符 (modifier)。如果您能使用此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-42433) 與我們分享您的回饋，我們將不勝感激。

[深入了解密封 (sealed) 介面](sealed-classes.md)。

### 密封 (sealed) 類別的套件範圍階層 (package-wide hierarchies)

> 密封 (sealed) 類別的套件範圍階層為 [實驗性 (Experimental)](components-stability.md)。它們可能隨時被移除或更改。
> 需要選擇啟用（詳情請參閱下方），且您應僅用於評估目的。如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供回饋，我們將不勝感激。
>
{style="warning"}

密封 (sealed) 類別現在可以形成更靈活的階層。它們可以在同一編譯單元 (compilation unit) 和同一套件 (package) 的所有檔案中擁有子類別 (subclasses)。以前，所有子類別都必須出現在同一檔案中。

直接子類別可以是頂層的 (top-level) 或巢狀 (nested) 在任何數量其他命名類別 (named classes)、命名介面 (named interfaces) 或命名物件 (named objects) 內。密封類別的子類別必須具有適當限定的名稱 – 它們不能是局部 (local) 或匿名物件 (anonymous objects)。

要試用密封 (sealed) 類別的套件範圍階層，請新增編譯器選項 `-language-version 1.5`。如果您能使用此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-42433) 與我們分享您的回饋，我們將不勝感激。

[深入了解密封 (sealed) 類別的套件範圍階層](sealed-classes.md#inheritance)。

### 改進的內聯 (inline) 類別

> 內聯值類別 (Inline value classes) 處於 [Beta](components-stability.md) 階段。它們幾乎穩定，但未來可能需要遷移步驟。我們將盡最大努力盡量減少您必須進行的任何更改。如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 中提供內聯類別功能的回饋，我們將不勝感激。
>
{style="warning"}

Kotlin 1.4.30 將 [內聯類別 (inline classes)](inline-classes.md) 提升至 [Beta](components-stability.md) 階段，並為其帶來以下功能和改進：

*   由於內聯類別是 [基於值 (value-based)](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html) 的，因此您可以使用 `value` 修飾符 (modifier) 來定義它們。`inline` 和 `value` 修飾符現在彼此等價。在未來的 Kotlin 版本中，我們計劃棄用 (deprecate) `inline` 修飾符。

    從現在開始，對於 JVM 後端 (backend)，Kotlin 要求在類別宣告 (class declaration) 前加上 `@JvmInline` 註解：

    ```kotlin
    inline class Name(private val s: String)
    
    value class Name(private val s: String)
    
    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   內聯類別可以有 `init` 區塊。您可以新增在類別實例化 (instantiated) 後立即執行的程式碼：

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   從 Java 程式碼呼叫帶有內聯類別的函式 (functions)：在 Kotlin 1.4.30 之前，由於名稱混淆 (mangling)，您無法從 Java 呼叫接受內聯類別的函式。
    從現在開始，您可以手動禁用名稱混淆 (mangling)。要從 Java 程式碼呼叫此類函式，您應該在函式宣告 (function declaration) 前新增 `@JvmName` 註解：

    ```kotlin
    inline class UInt(val x: Int)
    
    fun compute(x: Int) { }
    
    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   在此版本中，我們更改了函式的名稱混淆 (mangling) 方案以修正不正確的行為。這些更改導致了 ABI (Application Binary Interface) 變更。

    從 1.4.30 開始，Kotlin 編譯器預設使用新的名稱混淆 (mangling) 方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 編譯器標誌 (compiler flag) 以強制編譯器使用舊的 1.4.0 名稱混淆 (mangling) 方案並保留二進位兼容性 (binary compatibility)。

Kotlin 1.4.30 將內聯類別提升至 Beta 階段，我們計劃在未來版本中使其穩定 (Stable)。如果您能使用此 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-42434) 與我們分享您的回饋，我們將不勝感激。

要試用內聯類別的預覽版本，請新增編譯器選項 `-Xinline-classes` 或 `-language-version 1.5`。

深入了解名稱混淆 (mangling) 演算法，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)。

[深入了解內聯 (inline) 類別](inline-classes.md)。

## Kotlin/JVM

### JVM IR 編譯器後端達到 Beta

Kotlin/JVM 的 [基於 IR 的編譯器後端 (IR-based compiler backend)](whatsnew14.md#unified-backends-and-extensibility) 在 1.4.0 中以 [Alpha](components-stability.md) 呈現，現已達到 Beta。這是 IR 後端成為 Kotlin/JVM 編譯器預設後端之前的最後一個預穩定 (pre-stable) 階段。

我們現在正在解除對使用 IR 編譯器產生的二進位檔 (binaries) 的限制。以前，您只能在啟用新後端的情況下使用由新的 JVM IR 後端編譯的程式碼。從 1.4.30 開始，沒有此類限制，因此您可以使用新後端為第三方用途（例如函式庫）建立元件。試用新後端的 Beta 版本，並在我們的 [問題追蹤器 (issue tracker)](https://kotl.in/issue) 中分享您的回饋。

要啟用新的 JVM IR 後端，請將以下行新增至專案的配置檔 (configuration file) 中：
*   在 Gradle 中：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
      kotlinOptions.useIR = true
    }
    ```

    </tab>
    </tabs>

*   在 Maven 中：

    ```xml
    <configuration>
        <args>
            <arg>-Xuse-ir</arg>
        </args>
    </configuration>
    ```

深入了解 JVM IR 後端帶來了哪些變化，請參閱 [這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)。

## Kotlin/Native

### 效能改進

Kotlin/Native 在 1.4.30 中收到了各種效能改進，這導致編譯時間更快。
例如，在 [使用 Kotlin Multiplatform Mobile 進行網路和資料儲存](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 範例中，重建框架所需的時間從 9.5 秒（在 1.4.10 中）減少到 4.5 秒（在 1.4.30 中）。

### Apple watchOS 64 位元模擬器目標

自 watchOS 7.0 版起，x86 模擬器目標已被棄用 (deprecated)。為了跟上最新的 watchOS 版本，Kotlin/Native 提供了新的 `watchosX64` 目標，用於在 64 位元架構 (architecture) 上執行模擬器。

### 支援 Xcode 12.2 函式庫

我們增加了對 Xcode 12.2 隨附的新函式庫的支援。您現在可以從 Kotlin 程式碼中使用它們。

## Kotlin/JS

### 頂層屬性 (top-level properties) 的延遲初始化 (lazy initialization)

> 頂層屬性 (top-level properties) 的延遲初始化為 [實驗性 (Experimental)](components-stability.md)。它可能隨時被移除或更改。
> 需要選擇啟用（詳情請參閱下方），且您應僅用於評估目的。如果您能在 [YouTrack](https://youtrack.com/issue/KT-44320) 中提供回饋，我們將不勝感激。
>
{style="warning"}

Kotlin/JS 的 [IR 後端 (IR backend)](js-ir-compiler.md) 正在接收頂層屬性 (top-level properties) 延遲初始化 (lazy initialization) 的原型實作 (prototype implementation)。這減少了應用程式啟動時初始化所有頂層屬性的需求，並應能顯著改善應用程式啟動時間。

我們將繼續致力於延遲初始化，並請您試用當前原型，並在 [YouTrack 議題](https://youtrack.jetbrains.com/issue/KT-44320) 或官方 [Kotlin Slack](https://kotlinlang.slack.com) 的 [`#javascript` 頻道](https://kotlinlang.slack.com/archives/C0B8L3U69) 中分享您的想法和結果（在 [此處](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 取得邀請）。

要使用延遲初始化，請在使用 JS IR 編譯器編譯程式碼時新增 `-Xir-property-lazy-initialization` 編譯器選項。

## Gradle 專案改進

### 支援 Gradle 配置快取 (configuration cache)

從 1.4.30 開始，Kotlin Gradle 外掛程式支援 [配置快取 (configuration cache)](https://docs.gradle.org/current/userguide/configuration_cache.html) 功能。它加快了建置過程：一旦您執行指令，Gradle 就會執行配置階段 (configuration phase) 並計算任務圖 (task graph)。Gradle 會快取 (caches) 結果並將其用於後續建置。

要開始使用此功能，您可以 [使用 Gradle 指令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 或 [設定基於 IntelliJ 的 IDE](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 標準函式庫

### 適用於文字大小寫轉換的與語系無關 (locale-agnostic) API

> 與語系無關 (locale-agnostic) API 功能為 [實驗性 (Experimental)](components-stability.md)。它可能隨時被移除或更改。
> 僅用於評估目的。
> 如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 中提供回饋，我們將不勝感激。
>
{style="warning"}

此版本引入了實驗性的與語系無關 (locale-agnostic) API，用於更改字串 (strings) 和字元 (characters) 的大小寫。
當前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函式是與語系相關 (locale-sensitive) 的。這意味著不同的平台語系設定 (platform locale settings) 可能會影響程式碼行為。例如，在土耳其語系中，當字串「kotlin」使用 `toUpperCase` 轉換時，結果是「KOTLİN」，而不是「KOTLIN」。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

*   對於 `String` 函式：

    |**早期版本**|**1.4.30 替代方案**|
    |---|---|
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   對於 `Char` 函式：

    |**早期版本**|**1.4.30 替代方案**|
    |---|---|
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 對於 Kotlin/JVM，還有帶有明確 `Locale` 參數的重載 (overloaded) `uppercase()`、`lowercase()` 和 `titlecase()` 函式。
>
{style="note"}

文字處理函式 (text processing functions) 的完整變更清單，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md)。

### 明確的字元 (Char) 到編碼 (code) 和字元到數字 (digit) 的轉換

> `Char` 轉換功能的不含糊 (unambiguous) API 為 [實驗性 (Experimental)](components-stability.md)。它可能隨時被移除或更改。
> 僅用於評估目的。
> 如果您能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 中提供回饋，我們將不勝感激。
>
{style="warning"}

當前的字元 (Char) 到數字轉換函式，這些函式返回以不同數字型別表示的 UTF-16 編碼 (codes)，經常與類似的字串 (String) 到整數 (Int) 轉換混淆，後者返回字串的數值：

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

為了避免這種混淆，我們決定將字元 (Char) 轉換分為以下兩組命名清晰的函式：

*   取得字元 (Char) 的整數編碼 (integer code) 並從給定編碼建構字元 (Char) 的函式：

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   將字元 (Char) 轉換為其所代表數字的數值 (numeric value) 的函式：

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   一個用於 `Int` 的擴展函式 (extension function)，用於將其表示的非負單一數字轉換為相應的字元 (Char) 表示：

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

更多詳細資訊請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)。

## 序列化 (Serialization) 更新

隨著 Kotlin 1.4.30 的發佈，我們同時發佈了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包括一些新功能：

*   內聯類別 (inline classes) 序列化 (serialization) 支援
*   無符號基本型別 (unsigned primitive type) 序列化 (serialization) 支援

### 內聯類別 (inline classes) 序列化 (serialization) 支援

從 Kotlin 1.4.30 開始，您可以使內聯類別 (inline classes) 可 [序列化 (serializable)](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 此功能需要新的 1.4.30 IR 編譯器。
>
{style="note"}

序列化框架 (serialization framework) 在可序列化的內聯類別 (inline classes) 用於其他可序列化類別時，不會對其進行裝箱 (box)。

深入了解，請參閱 `kotlinx.serialization` [文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)。

### 無符號基本型別 (unsigned primitive type) 序列化 (serialization) 支援

從 1.4.30 開始，您可以使用 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的標準 JSON 序列化器 (serializers) 來處理無符號基本型別 (unsigned primitive types)：`UInt`、`ULong`、`UByte` 和 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

深入了解，請參閱 `kotlinx.serialization` [文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)。