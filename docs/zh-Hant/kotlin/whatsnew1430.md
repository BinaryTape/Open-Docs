[//]: # (title: Kotlin 1.4.30 新功能)

_[發佈日期：2021 年 2 月 3 日](releases.md#release-details)_

Kotlin 1.4.30 提供了新語言功能的預覽版本，將 Kotlin/JVM 編譯器的新 IR 後端提升為 Beta 版，並帶來了各種效能和功能改進。

您也可以透過[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)了解更多新功能。

## 語言功能

Kotlin 1.5.0 將會帶來新的語言功能——JVM records 支援、密封介面以及穩定的行內類別。在 Kotlin 1.4.30 中，您可以在預覽模式下試用這些功能和改進。如果您能在相應的 YouTrack 票證中與我們分享您的回饋，我們將不勝感激，因為這將使我們能夠在 1.5.0 發佈之前解決問題。

*   [JVM records 支援](#jvm-records-support)
*   [密封介面](#sealed-interfaces)和[密封類別改進](#package-wide-sealed-class-hierarchies)
*   [改進行內類別](#improved-inline-classes)

若要在預覽模式下啟用這些語言功能和改進，您需要透過新增特定的編譯器選項來選擇啟用。詳情請參閱以下章節。

透過[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)了解更多關於新功能預覽的資訊。

### JVM records 支援

> JVM records 功能為[實驗性](components-stability.md)。它可能隨時被刪除或更改。
> 需要選擇啟用（詳情請參閱下方），您應該僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 上提供回饋。
>
{style="warning"}

[JDK 16 發佈版](https://openjdk.java.net/projects/jdk/16/)包含了穩定一種名為 [record](https://openjdk.java.net/jeps/395) 的新 Java 類別類型的計劃。為了提供 Kotlin 的所有優勢並維持其與 Java 的互通性，Kotlin 正在引入實驗性的 record 類別支援。

您可以像 Kotlin 中具有屬性的類別一樣使用在 Java 中聲明的 record 類別。無需額外步驟。

從 1.4.30 開始，您可以使用 `@JvmRecord` 註釋在 Kotlin 中為[資料類別](data-classes.md)聲明 record 類別：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

若要試用 JVM records 的預覽版本，請新增編譯器選項 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我們正在繼續致力於 JVM records 支援，如果您能透過這個 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42430)與我們分享您的回饋，我們將不勝感激。

透過 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) 了解更多關於實作、限制和語法的資訊。

### 密封介面

> 密封介面為[實驗性](components-stability.md)。它可能隨時被刪除或更改。
> 需要選擇啟用（詳情請參閱下方），您應該僅將它們用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.4.30 中，我們正在發佈 _密封介面_ 的原型。它們補充了密封類別，並使得建立更靈活的受限類別階層成為可能。

它們可以作為「內部」介面，無法在同一個模組之外實作。您可以依賴這個事實，例如，來編寫詳盡的 `when` 運算式。

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

另一個用例：透過密封介面，您可以讓一個類別繼承自兩個或更多密封超類別。

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

若要試用密封介面的預覽版本，請新增編譯器選項 `-language-version 1.5`。一旦切換到此版本，您將能夠在介面上使用 `sealed` 修飾符。如果您能透過這個 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42433)與我們分享您的回饋，我們將不勝感激。

[了解更多關於密封介面](sealed-classes.md)。

### 套件範圍的密封類別階層

> 套件範圍的密封類別階層為[實驗性](components-stability.md)。它們可能隨時被刪除或更改。
> 需要選擇啟用（詳情請參閱下方），您應該僅將它們用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供回饋。
>
{style="warning"}

密封類別現在可以形成更靈活的階層。它們可以在同一編譯單元和同一套件的所有檔案中擁有子類別。以前，所有子類別都必須出現在同一個檔案中。

直接子類別可以是頂層的，也可以巢狀在任意數量的其他具名類別、具名介面或具名物件中。密封類別的子類別必須具有適當限定的名稱——它們不能是局部或匿名物件。

若要試用套件範圍的密封類別階層，請新增編譯器選項 `-language-version 1.5`。如果您能透過這個 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42433)與我們分享您的回饋，我們將不勝感激。

[了解更多關於套件範圍的密封類別階層](sealed-classes.md#inheritance)。

### 改進行內類別

> 行內值類別處於 [Beta](components-stability.md) 版。它們幾乎是穩定的，但未來可能需要遷移步驟。我們將盡最大努力減少您必須進行的任何更改。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 上提供關於行內類別功能的回饋。
>
{style="warning"}

Kotlin 1.4.30 將[行內類別](inline-classes.md)提升至 [Beta](components-stability.md) 版，並為它們帶來以下功能和改進：

*   由於行內類別是[基於值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，您可以使用 `value` 修飾符定義它們。`inline` 和 `value` 修飾符現在彼此等效。在未來的 Kotlin 版本中，我們計劃棄用 `inline` 修飾符。

    從現在開始，Kotlin 要求在 JVM 後端的類別聲明之前加上 `@JvmInline` 註釋：

    ```kotlin
    inline class Name(private val s: String)

    value class Name(private val s: String)

    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   行內類別可以擁有 `init` 區塊。您可以新增在類別實例化後立即執行的程式碼：

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   從 Java 程式碼呼叫帶有行內類別的函式：在 Kotlin 1.4.30 之前，由於名字修飾，您無法從 Java 呼叫接受行內類別的函式。
    從現在開始，您可以手動禁用名字修飾。若要從 Java 程式碼呼叫此類函式，您應該在函式聲明之前新增 `@JvmName` 註釋：

    ```kotlin
    inline class UInt(val x: Int)

    fun compute(x: Int) { }

    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   在此版本中，我們更改了函式的名字修飾方案以修復不正確的行為。這些更改導致了 ABI 變更。

    從 1.4.30 開始，Kotlin 編譯器預設使用新的名字修飾方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 編譯器旗標來強制編譯器使用舊的 1.4.0 名字修飾方案並保留二進位相容性。

Kotlin 1.4.30 將行內類別提升至 Beta 版，我們計劃在未來版本中使其穩定。如果您能透過這個 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42434)與我們分享您的回饋，我們將不勝感激。

若要試用行內類別的預覽版本，請新增編譯器選項 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於名字修飾演算法的資訊。

[了解更多關於行內類別](inline-classes.md)。

## Kotlin/JVM

### JVM IR 編譯器後端達到 Beta 版

用於 Kotlin/JVM 的 [基於 IR 的編譯器後端](whatsnew14.md#unified-backends-and-extensibility) 在 1.4.0 中以 [Alpha](components-stability.md) 版形式推出，現已達到 Beta 版。這是 IR 後端成為 Kotlin/JVM 編譯器預設後端之前的最後一個預穩定級別。

我們現在取消了對 IR 編譯器產生二進位檔的消費限制。以前，只有在啟用新後端的情況下，您才能使用由新 JVM IR 後端編譯的程式碼。從 1.4.30 開始，沒有此類限制，因此您可以使用新後端為第三方用途（例如函式庫）建構組件。試用新後端的 Beta 版本，並在我們的[問題追蹤器](https://kotl.in/issue)中分享您的回饋。

若要啟用新的 JVM IR 後端，請將以下行新增到專案的設定檔中：
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

透過[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)了解更多關於 JVM IR 後端帶來的變更。

## Kotlin/Native

### 效能改進

Kotlin/Native 在 1.4.30 中獲得了各種效能改進，從而縮短了編譯時間。例如，在 [Networking and data storage with Kotlin Multiplatform Mobile](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 範例中重建框架所需的時間從 9.5 秒（在 1.4.10 中）減少到 4.5 秒（在 1.4.30 中）。

### Apple watchOS 64 位元模擬器目標

自 7.0 版以來，watchOS 已棄用 x86 模擬器目標。為跟上最新的 watchOS 版本，Kotlin/Native 為在 64 位元架構上執行模擬器提供了新目標 `watchosX64`。

### 支援 Xcode 12.2 函式庫

我們新增了對 Xcode 12.2 隨附的新函式庫的支援。您現在可以從 Kotlin 程式碼中使用它們。

## Kotlin/JS

### 頂層屬性的惰性初始化

> 頂層屬性的惰性初始化為[實驗性](components-stability.md)。它可能隨時被刪除或更改。
> 需要選擇啟用（詳情請參閱下方），您應該僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 上提供回饋。
>
{style="warning"}

用於 Kotlin/JS 的 [IR 後端](js-ir-compiler.md)正在接收頂層屬性的惰性初始化原型實作。這減少了應用程式啟動時初始化所有頂層屬性的需求，並且應該顯著縮短應用程式啟動時間。

我們將繼續致力於惰性初始化，並請您試用當前的原型，並在[這個 YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-44320)或官方 [Kotlin Slack](https://kotlinlang.slack.com) 中的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道（在此處[取得邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）中分享您的想法和結果。

若要使用惰性初始化，請在編譯程式碼時使用 JS IR 編譯器新增 `-Xir-property-lazy-initialization` 編譯器選項。

## Gradle 專案改進

### 支援 Gradle 設定快取

從 1.4.30 開始，Kotlin Gradle plugin 支援[設定快取](https://docs.gradle.org/current/userguide/configuration_cache.html)功能。它能加速建構過程：一旦您執行命令，Gradle 就會執行設定階段並計算任務圖。Gradle 會快取結果並將其用於後續的建構。

若要開始使用此功能，您可以[使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)或[設定基於 IntelliJ 的 IDE](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 標準函式庫

### 區域設定無關的文字大小寫轉換 API

> 區域設定無關的 API 功能為[實驗性](components-stability.md)。它可能隨時被刪除或更改。
> 僅用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 上提供回饋。
>
{style="warning"}

此版本引入了用於更改字串和字元大小寫的實驗性區域設定無關 API。
當前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函式是區域設定敏感的。
這意味著不同的平台區域設定可能會影響程式碼行為。例如，在土耳其語區域設定中，當字串 "kotlin" 使用 `toUpperCase` 轉換時，結果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

*   對於 `String` 函式：

    |**早期版本**|**1.4.30 替代方案**|
    | --- | --- |
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   對於 `Char` 函式：

    |**早期版本**|**1.4.30 替代方案**|
    | --- | --- |
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 對於 Kotlin/JVM，還有帶有明確 `Locale` 參數的重載 `uppercase()`、`lowercase()` 和 `titlecase()` 函式。
>
{style="note"}

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md) 中查看文字處理函式的完整更改列表。

### 清晰的 Char-to-code 和 Char-to-digit 轉換

> `Char` 轉換的明確 API 功能為[實驗性](components-stability.md)。它可能隨時被刪除或更改。
> 僅用於評估目的。
> 我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 上提供回饋。
>
{style="warning"}

當前的 `Char` 到數字轉換函式會返回以不同數字類型表示的 UTF-16 程式碼，這些函式經常與類似的 String-to-Int 轉換混淆，後者返回字串的數字值：

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

為了避免這種混淆，我們決定將 `Char` 轉換分為以下兩組命名清晰的函式：

*   取得 `Char` 整數程式碼並從給定程式碼建構 `Char` 的函式：

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   將 `Char` 轉換為其所代表數字值的函式：

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   `Int` 的擴充函式，用於將其所代表的非負單一數字轉換為相應的 `Char` 表示：

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md) 中查看更多詳細資訊。

## 序列化更新

除了 Kotlin 1.4.30，我們還發佈了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包含一些新功能：

*   行內類別序列化支援
*   無符號原生型別序列化支援

### 行內類別序列化支援

從 Kotlin 1.4.30 開始，您可以使行內類別[可序列化](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 此功能需要新的 1.4.30 IR 編譯器。
>
{style="note"}

當可序列化的行內類別用於其他可序列化類別時，序列化框架不會對其進行裝箱。

在 `kotlinx.serialization` [文件中](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)了解更多資訊。

### 無符號原生型別序列化支援

從 1.4.30 開始，您可以將 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的標準 JSON 序列化器用於無符號原生型別：`UInt`、`ULong`、`UByte` 和 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

在 `kotlinx.serialization` [文件中](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)了解更多資訊。