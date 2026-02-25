[//]: # (title: Kotlin 1.4.30 的新功能)

<web-summary>閱讀 Kotlin 1.4.30 版本說明，內容涵蓋新的語言特性、Kotlin 多平台更新、JVM、Native、JS 以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發佈日期：2021 年 2 月 3 日](releases.md#release-history)_

Kotlin 1.4.30 提供了新語言特性的預覽版本，將 Kotlin/JVM 編譯器的新 IR 後端提升至 Beta 階段，並交付了多項效能與功能改進。

您也可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)中了解新功能。

> 有關 Kotlin 發佈週期的資訊，請參閱 [Kotlin 發佈流程](releases.md)。
>
{style="tip"}

## 語言特性

Kotlin 1.5.0 將提供新的語言特性：JVM record 支援、密封介面以及穩定的內嵌類別。
在 Kotlin 1.4.30 中，您可以透過預覽模式嘗試這些特性與改進。如果您能在對應的 YouTrack 票證中與我們分享您的回饋，我們將不勝感激，這將使我們能夠在 1.5.0 發佈之前解決相關問題。

* [JVM record 支援](#jvm-records-support)
* [密封介面](#sealed-interfaces) 與 [密封類別改進](#package-wide-sealed-class-hierarchies)
* [改進的內嵌類別](#improved-inline-classes)

若要在預覽模式下啟用這些語言特性與改進，您需要透過新增特定的編譯器選項來選擇加入。詳情請參閱以下章節。

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)中了解更多關於新特性預覽的資訊。

### JVM record 支援

> JVM record 特性目前處於 [Experimental](components-stability.md) 階段。它可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 上提供回饋。
>
{style="warning"}

[JDK 16 發佈計畫](https://openjdk.java.net/projects/jdk/16/)中包含將名為 [record](https://openjdk.java.net/jeps/395) 的新 Java 類別類型穩定化的計畫。為了提供 Kotlin 的所有優勢並保持其與 Java 的互通性，Kotlin 正在引入實驗性的 record 類別支援。

您可以像使用 Kotlin 中具有屬性的類別一樣，使用在 Java 中宣告的 record 類別。無需額外步驟。

從 1.4.30 開始，您可以使用 `@JvmRecord` 註解為 [資料類別](data-classes.md) 在 Kotlin 中宣告 record 類別：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

若要嘗試 JVM record 的預覽版本，請新增編譯器選項 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我們正在持續改進 JVM record 的支援，如果您能透過此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42430)分享您的回饋，我們將不勝感激。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) 中了解更多關於實作、限制及語法的資訊。

### 密封介面

> 密封介面目前處於 [Experimental](components-stability.md) 階段。它們可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅出於評估目的使用它們。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供回饋。
>
{style="warning"}

在 Kotlin 1.4.30 中，我們交付了「密封介面」的原型。它們補充了密封類別，並使構建更具彈性的受限類別階層結構成為可能。

它們可以作為「內部」介面，無法在同一個模組之外被實作。您可以利用這一點，例如撰寫窮舉式的 `when` 運算式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是窮舉式的：在模組編譯後，
// 不會出現其他的 polygon 實作
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

另一個使用案例：透過密封介面，您可以讓一個類別繼承自兩個或多個密封超類別。

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

若要嘗試密封介面的預覽版本，請新增編譯器選項 `-language-version 1.5`。切換到此版本後，您將能在介面上使用 `sealed` 修飾符。如果您能透過此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42433)分享您的回饋，我們將不勝感激。

[了解更多關於密封介面的資訊](sealed-classes.md)。

### 整個軟件包範圍的密封類別階層結構

> 整個軟件包範圍的密封類別階層結構目前處於 [Experimental](components-stability.md) 階段。它們可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅出於評估目的使用它們。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供回饋。
>
{style="warning"}

密封類別現在可以形成更具彈性的階層結構。它們可以在同一個編譯單元且同一個軟件包的所有檔案中擁有子類別。在此之前，所有子類別都必須出現在同一個檔案中。

直接子類別可以是頂層的，也可以巢狀於任何數量的其他具名類別、具名介面或具名物件中。密封類別的子類別必須具有正確限定的名稱——它們不能是區域物件或匿名物件。

若要嘗試整個軟件包範圍的密封類別階層結構，請新增編譯器選項 `-language-version 1.5`。如果您能透過此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42433)分享您的回饋，我們將不勝感激。

[了解更多關於整個軟件包範圍的密封類別階層結構的資訊](sealed-classes.md#inheritance)。

### 改進的內嵌類別

> 內嵌值類別目前處於 [Beta](components-stability.md) 階段。它們已接近穩定，但未來可能需要遷移步驟。我們將盡力減少您必須進行的任何更改。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 上提供關於內嵌類別特性的回饋。
>
{style="warning"}

Kotlin 1.4.30 將 [內嵌類別](inline-classes.md) 提升至 [Beta](components-stability.md) 階段，並為其帶來以下特性與改進：

* 由於內嵌類別是 [基於值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，您可以使用 `value` 修飾符來定義它們。現在 `inline` 與 `value` 修飾符彼此等價。在未來的 Kotlin 版本中，我們計畫棄用 `inline` 修飾符。

  從現在起，若使用 JVM 後端，Kotlin 要求在類別宣告前加上 `@JvmInline` 註解：
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // 用於 JVM 後端
  @JvmInline
  value class Name(private val s: String)
  ```

* 內嵌類別可以擁有 `init` 區塊。您可以加入在類別具現化後立即執行的程式碼：
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 從 Java 程式碼呼叫具有內嵌類別的函式：在 Kotlin 1.4.30 之前，由於命名混淆（mangling）的原因，您無法從 Java 呼叫接受內嵌類別作為參數的函式。
  從現在起，您可以手動停用命名混淆。若要從 Java 程式碼呼叫此類函式，您應在函式宣告前新增 `@JvmName` 註解：

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在此版本中，我們更改了函式的命名混淆配置以修正錯誤行為。這些更改導致了 ABI 的變更。

  從 1.4.30 開始，Kotlin 編譯器預設使用新的命名混淆配置。使用 `-Xuse-14-inline-classes-mangling-scheme` 編譯器旗標可強制編譯器使用舊的 1.4.0 命名混淆配置，並保持二進制相容性。

Kotlin 1.4.30 將內嵌類別提升至 Beta 階段，我們計畫在未來的版本中將其設為 Stable。如果您能透過此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-42434)與我們分享您的回饋，我們將不勝感激。

若要嘗試內嵌類別的預覽版本，請新增編譯器選項 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多關於命名混淆演算法的資訊。

[了解更多關於內嵌類別的資訊](inline-classes.md)。

## Kotlin/JVM

### JVM IR 編譯器後端進入 Beta 階段

用於 Kotlin/JVM 的 [基於 IR 的編譯器後端](whatsnew14.md#unified-backends-and-extensibility)（曾在 1.4.0 的 [Alpha](components-stability.md) 階段推出）已進入 Beta 階段。這是 IR 後端成為 Kotlin/JVM 編譯器預設設定之前的最後一個預先穩定階段。

我們現在取消了對使用 IR 編譯器產生的二進制檔案的限制。先前，只有在您啟用了新後端的情況下，才能使用由新 JVM IR 後端編譯的程式碼。從 1.4.30 開始，不再有此限制，因此您可以使用新後端來組建供第三方使用的組件（例如程式庫）。請嘗試新後端的 Beta 版本，並在我們的 [問題追蹤器](https://kotl.in/issue) 中分享您的回饋。

若要啟用新的 JVM IR 後端，請在專案的設定檔中加入以下內容：
* 在 Gradle 中：

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

* 在 Maven 中：

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中了解更多關於 JVM IR 後端帶來的變化。

## Kotlin/Native

### 效能改進

Kotlin/Native 在 1.4.30 中獲得了多項效能改進，從而縮短了編譯時間。
例如，在 [Networking and data storage with Kotlin Multiplatform Mobile](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 範例中，重新組建架構所需的時間從 9.5 秒（1.4.10 版）減少到 4.5 秒（1.4.30 版）。

### Apple watchOS 64 位元模擬器目標

自 7.0 版本以來，watchOS 已棄用 x86 模擬器目標。為了緊跟最新的 watchOS 版本，Kotlin/Native 提供了新的目標 `watchosX64`，用於在 64 位元架構上執行模擬器。

### 支援 Xcode 12.2 程式庫

我們新增了對 Xcode 12.2 交付的新程式庫的支援。您現在可以從 Kotlin 程式碼中使用它們。

## Kotlin/JS

### 頂層屬性的延遲初始化

> 頂層屬性的延遲初始化目前處於 [Experimental](components-stability.md) 階段。它可能隨時被刪除或更改。需要選擇加入（詳見下文），且您應僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 上提供回饋。
>
{style="warning"}

用於 Kotlin/JS 的 [IR 後端](js-ir-compiler.md) 正在接收頂層屬性延遲初始化的原型實作。這減少了在應用程式啟動時初始化所有頂層屬性的需求，並應顯著改善應用程式的啟動時間。

我們將繼續改進延遲初始化，請您嘗試目前的原型，並在 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-44320) 或官方 [Kotlin Slack](https://kotlinlang.slack.com) 的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 頻道（在此獲取[邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）中分享您的想法與結果。

若要使用延遲初始化，請在使用 JS IR 編譯器編譯程式碼時新增 `-Xir-property-lazy-initialization` 編譯器選項。

## Gradle 專案改進

### 支援 Gradle 配置快取

從 1.4.30 開始，Kotlin Gradle 外掛程式支援 [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html) 功能。它加快了組建過程：一旦您執行指令，Gradle 就會執行配置階段並計算任務圖。Gradle 會快取結果並在後續組建中重複使用。

若要開始使用此功能，您可以 [使用 Gradle 指令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 或 [設定基於 IntelliJ 的 IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 標準程式庫

### 與語言區域無關的文字大小寫轉換 API

> 與語言區域無關的 API 特性目前處於 [Experimental](components-stability.md) 階段。它可能隨時被刪除或更改。請僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 上提供回饋。
>
{style="warning"}

此版本引入了實驗性的、與語言區域無關的 API，用於更改字串與字元的文字大小寫。
目前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函式是語言區域感知的（locale-sensitive）。這意味著不同的平台語言區域設定會影響程式碼行為。例如，在土耳其語言區域中，當使用 `toUpperCase` 轉換字串 "kotlin" 時，結果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// 目前的 API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// 新的 API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

* 對於 `String` 函式：

  |**早期版本**|**1.4.30 替代方案**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 對於 `Char` 函式：

  |**早期版本**|**1.4.30 替代方案**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 對於 Kotlin/JVM，還有帶有明確 `Locale` 參數的多載 `uppercase()`、`lowercase()` 與 `titlecase()` 函式。
>
{style="note"}

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md) 中查看文字處理函式的完整變更清單。

### 明確的 Char-to-code 與 Char-to-digit 轉換

> 用於 `Char` 轉換的明確 API 特性目前處於 [Experimental](components-stability.md) 階段。它可能隨時被刪除或更改。請僅出於評估目的使用它。我們歡迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 上提供回饋。
>
{style="warning"}

目前的 `Char` 到數字的轉換函式（回傳以不同數字型別表示的 UTF-16 編碼），經常與類似的 String-to-Int 轉換（回傳字串的數值）混淆：

```kotlin
"4".toInt() // 回傳 4
'4'.toInt() // 回傳 52
// 並且以前沒有通用的函式能讓 Char '4' 回傳數值 4
```

為了避免這種混淆，我們決定將 `Char` 轉換拆分為以下兩組命名明確的函式：

* 獲取 `Char` 的整數編碼以及從給定編碼建構 `Char` 的函式：
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 將 `Char` 轉換為其所代表數字的數值的函式：

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* 一個用於 `Int` 的擴充函式，將其代表的非負個位數字轉換為對應的 `Char` 表示：

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

詳見 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md) 中的詳細資訊。

## 序列化更新

隨著 Kotlin 1.4.30 的發佈，我們也發佈了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包含一些新特性：

* 內嵌類別序列化支援
* 無符號基本型別序列化支援

### 內嵌類別序列化支援

從 Kotlin 1.4.30 開始，您可以使內嵌類別變得 [可序列化](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 該特性需要新的 1.4.30 IR 編譯器。
>
{style="note"}

當可序列化的內嵌類別被用於其他可序列化類別時，序列化架構不會對其進行裝箱（box）。

在 `kotlinx.serialization` [文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes) 中了解更多資訊。

### 無符號基本型別序列化支援

從 1.4.30 開始，您可以為無符號基本型別使用 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的標準 JSON 序列化器：`UInt`、`ULong`、`UByte` 與 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

在 `kotlinx.serialization` [文件](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only) 中了解更多資訊。