---
title: "Kotlin 1.4.30 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2021 年 2 月 3 日](releases#release-details)_

Kotlin 1.4.30 提供了新語言功能的預覽版本，將 Kotlin/JVM 編譯器的新 IR 後端提升至 Beta 版，並提供各種效能和功能改進。

您也可以在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)中了解新功能。

## 語言功能

Kotlin 1.5.0 將會提供新的語言功能 – JVM records 支援、sealed interfaces（密封介面）和 Stable inline classes（穩定內聯類別）。
在 Kotlin 1.4.30 中，您可以嘗試這些功能的預覽模式。如果您能在相應的 YouTrack issue 中分享您的反饋，我們將不勝感激，因為這將使我們能夠在 1.5.0 發布之前解決這些問題。

* [JVM records 支援](#jvm-records-support)
* [Sealed interfaces（密封介面）](#sealed-interfaces) 和 [sealed class（密封類別）改進](#package-wide-sealed-class-hierarchies)
* [Improved inline classes（改進的內聯類別）](#improved-inline-classes)

若要在預覽模式中啟用這些語言功能和改進，您需要新增特定的編譯器選項來選擇加入。
請參閱下面的章節以取得詳細資訊。

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)中了解關於新功能預覽的更多資訊。

### JVM records 支援

:::note
JVM records 功能是 [Experimental（實驗性）](components-stability)。它可能會在任何時候被刪除或變更。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 中提供關於它的反饋。

[JDK 16 版本](https://openjdk.java.net/projects/jdk/16/)包含穩定一種名為
[record](https://openjdk.java.net/jeps/395) 的新 Java 類別類型的計畫。為了提供 Kotlin 的所有優勢並保持其與 Java 的互通性，Kotlin 引入了實驗性的 record class 支援。

您可以像使用 Kotlin 中具有屬性的類別一樣使用在 Java 中宣告的 record classes。不需要額外的步驟。

從 1.4.30 開始，您可以使用 `@JvmRecord` 註釋為 [data class（資料類別）](data-classes) 在 Kotlin 中宣告 record class：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

若要嘗試 JVM records 的預覽版本，請新增編譯器選項 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我們將繼續努力支援 JVM records，如果您能使用這個 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-42430) 與我們分享您的反饋，我們將不勝感激。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records) 中了解關於實現、限制和語法的更多資訊。

### Sealed interfaces（密封介面）

Sealed interfaces（密封介面）是 [Experimental（實驗性）](components-stability)。它們可能會在任何時候被刪除或變更。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將它們用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供關於它們的反饋。

在 Kotlin 1.4.30 中，我們發布了 _sealed interfaces（密封介面）_ 的原型。它們補充了 sealed classes（密封類別），並使其能夠建構更靈活的受限類別層次結構。

它們可以作為「內部」介面，不能在同一個模組之外實現。您可以依靠這一點，例如，編寫詳盡的 `when` 表達式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是詳盡的：在模組編譯後，不會出現其他的 polygon 實現
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle `->` // ...
    is Triangle `->` // ...
}

```

另一個用例：使用 sealed interfaces（密封介面），您可以從兩個或多個密封的超類別繼承一個類別。

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

若要嘗試 sealed interfaces（密封介面）的預覽版本，請新增編譯器選項 `-language-version 1.5`。一旦您切換到此版本，您就可以在介面上使用 `sealed` 修飾符。如果您能使用這個 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-42433) 與我們分享您的反饋，我們將不勝感激。

[了解關於 sealed interfaces（密封介面）的更多資訊](sealed-classes)。

### Package-wide sealed class hierarchies（套件範圍的密封類別層次結構）

Package-wide hierarchies of sealed classes（套件範圍的密封類別層次結構）是 [Experimental（實驗性）](components-stability)。它們可能會在任何時候被刪除或變更。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將它們用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供關於它們的反饋。

Sealed classes（密封類別）現在可以形成更靈活的層次結構。它們可以在同一個編譯單元和同一個套件的所有檔案中擁有子類別。先前，所有子類別都必須出現在同一個檔案中。

Direct subclasses（直接子類別）可以是頂層或巢狀在任意數量的其他命名類別、命名介面或命名物件中。
Sealed class（密封類別）的子類別必須具有適當限定的名稱 – 它們不能是 local nor anonymous objects（區域或匿名物件）。

若要嘗試 package-wide hierarchies of sealed classes（套件範圍的密封類別層次結構），請新增編譯器選項 `-language-version 1.5`。如果您能使用這個 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-42433) 與我們分享您的反饋，我們將不勝感激。

[了解關於 package-wide hierarchies of sealed classes（套件範圍的密封類別層次結構）的更多資訊](sealed-classes#inheritance)。

### Improved inline classes（改進的內聯類別）

Inline value classes（內聯值類別）處於 [Beta](components-stability) 階段。它們幾乎是穩定的，但在未來可能需要遷移步驟。
我們將盡最大努力減少您必須進行的任何變更。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 中提供關於內聯類別功能的反饋。

Kotlin 1.4.30 將 [inline classes（內聯類別）](inline-classes) 提升至 [Beta](components-stability) 並為它們帶來以下
功能和改進：

* 由於 inline classes（內聯類別）是 [value-based](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，
  您可以使用 `value` 修飾符來定義它們。`inline` 和 `value` 修飾符現在彼此等效。
  在未來的 Kotlin 版本中，我們計畫棄用 `inline` 修飾符。

  從現在開始，Kotlin 需要在 JVM 後端的類別宣告之前使用 `@JvmInline` 註釋：
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // For JVM backends（對於 JVM 後端）
  @JvmInline
  value class Name(private val s: String)
  ```

* Inline classes（內聯類別）可以有 `init` 區塊。您可以新增程式碼以在類別實例化後立即執行：
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 從 Java 程式碼呼叫具有 inline classes（內聯類別）的函數：在 Kotlin 1.4.30 之前，您無法從 Java 呼叫接受
  inline classes（內聯類別）的函數，因為名稱修飾 (mangling)。
  從現在開始，您可以手動禁用名稱修飾。若要從 Java 程式碼呼叫此類函數，您應該在函數宣告之前新增 `@JvmName`
  註釋：

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在此版本中，我們變更了函數的名稱修飾方案以修正不正確的行為。這些變更導致了 ABI
  變更。

  從 1.4.30 開始，Kotlin 編譯器預設使用新的名稱修飾方案。使用 `-Xuse-14-inline-classes-mangling-scheme`
  編譯器標誌來強制編譯器使用舊的 1.4.0 名稱修飾方案並保持二進制相容性。

Kotlin 1.4.30 將 inline classes（內聯類別）提升至 Beta 階段，我們計畫在未來的版本中使它們穩定。如果您能使用這個 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-42434) 與我們分享您的反饋，我們將不勝感激。

若要嘗試 inline classes（內聯類別）的預覽版本，請新增編譯器選項 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) 中了解關於名稱修飾演算法的更多資訊。

[了解關於 inline classes（內聯類別）的更多資訊](inline-classes)。

## Kotlin/JVM

### JVM IR compiler backend（JVM IR 編譯器後端）達到 Beta 階段

用於 Kotlin/JVM 的 [IR-based compiler backend（基於 IR 的編譯器後端）](whatsnew14#unified-backends-and-extensibility)，已在
1.4.0 中以 [Alpha](components-stability) 階段呈現，現已達到 Beta 階段。這是 IR 後端
成為 Kotlin/JVM 編譯器的預設值之前的最後一個 pre-stable（預穩定）級別。

我們現在取消了對使用 IR 編譯器產生的二進制檔案的限制。先前，只有在您啟用了新的後端時，才能使用由新的 JVM IR 後端編譯的程式碼。從 1.4.30 開始，沒有這樣的限制，
因此您可以使用新的後端來建構供第三方使用的元件，例如 libraries（程式庫）。嘗試 Beta 版本的
新後端，並在我們的 [issue tracker](https://kotl.in/issue) 中分享您的反饋。

若要啟用新的 JVM IR 後端，請將以下幾行新增至專案的配置文件：
* 在 Gradle 中：

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </TabItem>
  <TabItem value="groovy" label="Groovy" default>
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```

  </TabItem>
  </Tabs>

* 在 Maven 中：

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

在[這篇部落格文章](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)中了解關於 JVM IR 後端帶來的變更的更多資訊。

## Kotlin/Native

### Performance improvements（效能改進）

Kotlin/Native 在 1.4.30 中進行了各種效能改進，從而縮短了編譯時間。
例如，在 [使用 Kotlin Multiplatform Mobile 進行網路和資料儲存](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 中重建 framework（框架）所需的時間
範例已從 9.5 秒（在 1.4.10 中）減少到 4.5 秒（在 1.4.30 中）。

### Apple watchOS 64-bit simulator target（Apple watchOS 64 位元模擬器目標）

自 7.0 版以來，x86 模擬器目標已棄用 watchOS。為了跟上最新的 watchOS 版本，
Kotlin/Native 具有新的目標 `watchosX64`，用於在 64 位元架構上執行模擬器。

### Support for Xcode 12.2 libraries（支援 Xcode 12.2 程式庫）

我們新增了對 Xcode 12.2 提供的新的程式庫的支援。您現在可以從 Kotlin 程式碼中使用它們。

## Kotlin/JS

### Lazy initialization of top-level properties（頂層屬性的延遲初始化）

Lazy initialization of top-level properties（頂層屬性的延遲初始化）是 [Experimental（實驗性）](components-stability)。它可能會在任何時候被刪除或變更。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將其用於評估目的。我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 中提供關於它的反饋。

用於 Kotlin/JS 的 [IR backend（IR 後端）](js-ir-compiler) 正在接收頂層屬性的延遲初始化的原型實現。
這減少了在應用程式啟動時初始化所有頂層屬性的需要，並且
應顯著改善應用程式啟動時間。

我們將繼續努力進行延遲初始化，我們要求您嘗試當前的原型並分享您的想法和
結果在這個 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-44320) 或 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69)
官方 [Kotlin Slack](https://kotlinlang.slack.com) 中的頻道（在此處取得邀請 [here](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

若要使用延遲初始化，請在使用
JS IR 編譯器編譯程式碼時新增 `-Xir-property-lazy-initialization` 編譯器選項。

## Gradle project improvements（Gradle 專案改進）

### Support the Gradle configuration cache（支援 Gradle 配置快取）

從 1.4.30 開始，Kotlin Gradle 插件支援 [configuration cache](https://docs.gradle.org/current/userguide/configuration_cache.html)
功能。它可以加速建置過程：一旦您執行命令，Gradle 就會執行配置階段並計算
task graph（任務圖）。Gradle 會快取結果並將其重複用於後續的建置。

若要開始使用此功能，您可以[使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)
或 [設定基於 IntelliJ 的 IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## Standard library（標準函式庫）

### Locale-agnostic API for upper/lowercasing text（用於文字大小寫轉換的 Locale-agnostic API）

The locale-agnostic API feature（locale-agnostic API 功能）是 [Experimental（實驗性）](components-stability)。它可能會在任何時候被刪除或變更。
Use it only for evaluation purposes.（僅將其用於評估目的。）
We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437).（我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 中提供關於它的反饋。）

此版本引入了實驗性的 locale-agnostic API（locale-agnostic API），用於變更字串和字元的案例。
當前的 `toLowerCase()`, `toUpperCase()`, `capitalize()`, `decapitalize()` API 函數是 locale-sensitive（與地區設定相關）。
這表示不同的平台地區設定可能會影響程式碼行為。例如，在土耳其地區設定中，當
使用 `toUpperCase` 轉換字串 "kotlin" 時，結果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// current API（當前 API）
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API（新的 API）
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

* 對於 `String` 函數：

  |**Earlier versions（較早的版本）**|**1.4.30 alternative（1.4.30 替代方案）**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 對於 `Char` 函數：

  |**Earlier versions（較早的版本）**|**1.4.30 alternative（1.4.30 替代方案）**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

對於 Kotlin/JVM，還有具有顯式
`Locale` 參數的重載 `uppercase()`、`lowercase()` 和 `titlecase()` 函數。

:::

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions) 中查看對文字處理函數的完整變更清單。

### Clear Char-to-code and Char-to-digit conversions（清除 Char-to-code 和 Char-to-digit 轉換）

:::note
The unambiguous API for the `Char` conversion feature（用於 `Char` 轉換功能的明確 API）是 [Experimental（實驗性）](components-stability)。它可能會在任何時候被刪除或變更。
Use it only for evaluation purposes.（僅將其用於評估目的。）
We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333).（我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 中提供關於它的反饋。）

當前的 `Char` to numbers conversion functions（Char 到數字的轉換函數）傳回以不同數值類型表示的 UTF-16 程式碼，通常與類似的 String-to-Int conversion（字串到整數的轉換）混淆，後者傳回字串的數值：

```kotlin
"4".toInt() // returns 4（傳回 4）
'4'.toInt() // returns 52（傳回 52）
// and there was no common function that would return the numeric value 4 for Char '4'（而且沒有通用函數會傳回 Char '4' 的數值 4）
```

為了避免這種混淆，我們決定將 `Char` 轉換分為以下兩組明確命名的函數：

* 獲取 `Char` 的整數程式碼並從給定的程式碼建構 `Char` 的函數：
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 將 `Char` 轉換為其表示的數字值的函數：

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* 用於 `Int` 的擴展函數，用於將其表示的非負單個數字轉換為相應的 `Char`
  表示：

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions) 中查看更多詳細資訊。

## Serialization updates（序列化更新）

Along with Kotlin 1.4.30（與 Kotlin 1.4.30 一起），we are releasing `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC), which includes some new features:（我們正在發布 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包括一些新功能：）

* Inline classes serialization support（內聯類別序列化支援）
* Unsigned primitive type serialization support（無符號原始類型序列化支援）

### Inline classes serialization support（內聯類別序列化支援）

Starting with Kotlin 1.4.30（從 Kotlin 1.4.30 開始），you can make inline classes [serializable](serialization):（您可以使 inline classes（內聯類別）[可序列化](serialization)：）

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

The feature requires the new 1.4.30 IR compiler.（該功能需要新的 1.4.30 IR 編譯器。）

:::

The serialization framework does not box serializable inline classes when they are used in other serializable classes.（當可序列化的內聯類別在其他可序列化的類別中使用時，序列化框架不會對其進行裝箱。）

Learn more in the `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#serializable-inline-classes).（在 `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#serializable-inline-classes) 中了解更多資訊。）

### Unsigned primitive type serialization support（無符號原始類型序列化支援）

Starting from 1.4.30（從 1.4.30 開始），you can use standard JSON serializers of [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)
for unsigned primitive types: `UInt`, `ULong`, `UByte`, and `UShort`:（您可以將 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的標準 JSON 序列化器用於無符號原始類型：`UInt`、`ULong`、`UByte` 和 `UShort`：）

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

Learn more in the `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#unsigned-types-support-json-only).（在 `kotlinx.serialization` [docs](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#unsigned-types-support-json-only) 中了解更多資訊。）

  ```