---
title: "Kotlin 1.5.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發佈：2021 年 5 月 5 日](releases#release-details)_

Kotlin 1.5.0 引入了新的語言特性、穩定的基於 IR 的 JVM 編譯器後端、效能改進，以及演進式變更，例如穩定實驗性功能和棄用過時的功能。

您也可以在[發佈部落格文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)中找到變更的概述。

## 語言特性

Kotlin 1.5.0 帶來了新的語言特性的穩定版本，這些特性在 [1.4.30 中進行了預覽](whatsnew1430#language-features)：
* [JVM records 支援](#jvm-records-support)
* [密封介面 (Sealed interfaces)](#sealed-interfaces) 和 [密封類別 (Sealed class) 增強](#package-wide-sealed-class-hierarchies)
* [內聯類別 (Inline classes)](#inline-classes)

這些功能的詳細說明可在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)和 Kotlin 文件中對應的頁面中找到。

### JVM records 支援

Java 正在快速發展，為了確保 Kotlin 保持與它的互通性，我們引入了對其最新功能之一的支援 – [record 類別](https://openjdk.java.net/jeps/395)。

Kotlin 對 JVM records 的支援包括雙向互通性：
* 在 Kotlin 程式碼中，您可以像使用具有屬性的典型類別一樣使用 Java record 類別。
* 若要將 Kotlin 類別用作 Java 程式碼中的 record，請將其設為 `data` 類別，並使用 `@JvmRecord` 註釋標記它。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[瞭解更多關於在 Kotlin 中使用 JVM records 的資訊](jvm-records)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### 密封介面 (Sealed interfaces)

Kotlin 介面現在可以具有 `sealed` 修飾符，它在介面上以與在類別上相同的方式工作：密封介面的所有實作在編譯時都是已知的。

```kotlin
sealed interface Polygon
```

您可以依賴於這個事實，例如，編寫詳盡的 `when` 表達式。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle `->` // ...
   is Triangle `->` // ...
   // else is not needed - all possible implementations are covered
}

```

此外，密封介面 (Sealed interfaces) 實現了更靈活的受限類別層次結構，因為一個類別可以直接繼承多個密封介面。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[瞭解更多關於密封介面 (Sealed interfaces) 的資訊](sealed-classes)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### 套件範圍的密封類別 (Sealed class) 層次結構

密封類別現在可以在相同編譯單元和相同套件的所有檔案中具有子類別。 以前，所有子類別都必須出現在同一個檔案中。

直接子類別可以是頂層或巢狀在任何數量的其他命名類別、命名介面或命名物件中。

密封類別的子類別必須具有正確限定的名稱 – 它們不能是區域或匿名物件。

[瞭解更多關於密封類別 (Sealed class) 層次結構的資訊](sealed-classes#inheritance)。

### 內聯類別 (Inline classes)

內聯類別是僅持有值的[基於值的](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)類別的子集。 您可以將它們用作某種類型值的包裝器，而無需使用記憶體配置所帶來的額外負擔。

可以使用 `value` 修飾符在類別名稱之前宣告內聯類別 (Inline classes)：

```kotlin
value class Password(val s: String)
```

JVM 後端還需要一個特殊的 `@JvmInline` 註釋：

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` 修飾符現在已棄用並發出警告。

[瞭解更多關於內聯類別 (Inline classes) 的資訊](inline-classes)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM 收到了一些改進，包括內部和面向使用者的改進。 以下是其中最值得注意的：

* [穩定的 JVM IR 後端](#stable-jvm-ir-backend)
* [新的預設 JVM 目標：1.8](#new-default-jvm-target-1-8)
* [透過 invokedynamic 的 SAM 适配器](#sam-adapters-via-invokedynamic)
* [透過 invokedynamic 的 Lambdas](#lambdas-via-invokedynamic)
* [棄用 @JvmDefault 和舊的 Xjvm-default 模式](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [改進了對可空性註釋的處理](#improvements-to-handling-nullability-annotations)

### 穩定的 JVM IR 後端

Kotlin/JVM 編譯器的[基於 IR 的後端](whatsnew14#new-jvm-ir-backend)現在是[穩定的](components-stability)並且預設啟用。

從 [Kotlin 1.4.0](whatsnew14) 開始，基於 IR 的後端的早期版本可用於預覽，並且現在已成為語言版本 `1.5` 的預設後端。 舊的後端仍然是較早語言版本的預設後端。

您可以在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中找到關於 IR 後端的優勢及其未來發展的更多詳細資訊。

如果您需要在 Kotlin 1.5.0 中使用舊的後端，您可以將以下幾行新增到專案的組態檔中：

* 在 Gradle 中：

 <Tabs groupId="build-script">
 <TabItem value="kotlin" label="Kotlin" default>

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 <TabItem value="groovy" label="Groovy" default>

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </TabItem>
 </Tabs>

* 在 Maven 中：

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 新的預設 JVM 目標：1.8

Kotlin/JVM 編譯的預設目標版本現在是 `1.8`。 `1.6` 目標已棄用。

如果您需要 JVM 1.6 的建置，您仍然可以切換到此目標。 瞭解如何：

* [在 Gradle 中](gradle-compiler-options#attributes-specific-to-jvm)
* [在 Maven 中](maven#attributes-specific-to-jvm)
* [在命令列編譯器中](compiler-reference#jvm-target-version)

### 透過 invokedynamic 的 SAM 适配器

Kotlin 1.5.0 現在使用動態調用 (`invokedynamic`) 來編譯 SAM (Single Abstract Method) 轉換：
* 如果 SAM 類型是 [Java 介面](java-interop#sam-conversions)，則在任何表達式上
* 如果 SAM 類型是 [Kotlin 函數式介面](fun-interfaces#sam-conversions)，則在 lambda 上

新的實作使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)
並且在編譯期間不再產生輔助包裝器類別。 這減少了應用程式 JAR 的大小，從而提高了 JVM 啟動效能。

若要回滾到基於匿名類別產生的舊實作方案，請新增編譯器選項 `-Xsam-conversions=class`。

瞭解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和 [命令列編譯器](compiler-reference#compiler-options) 中新增編譯器選項。

### 透過 invokedynamic 的 Lambdas

:::note
將普通的 Kotlin lambdas 編譯為 invokedynamic 是 [實驗性的](components-stability)。 它可能隨時被刪除或更改。
需要選擇加入（請參閱下面的詳細資訊），您應該僅將其用於評估目的。 我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375) 上提供有關它的回饋。

Kotlin 1.5.0 引入了對將普通的 Kotlin lambdas（未轉換為函數式介面的實例）編譯為動態調用 (`invokedynamic`) 的實驗性支援。 該實作透過使用
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-) 來產生更輕量的二進位檔案，
這實際上會在執行時產生必要的類別。 目前，與普通的 lambda 編譯相比，它有三個限制：

* 編譯為 invokedynamic 的 lambda 不可序列化。
* 在這樣的 lambda 上呼叫 `toString()` 會產生可讀性較差的字串表示形式。
* 實驗性的 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支援使用 `LambdaMetafactory` 建立的 lambdas。

若要試用此功能，請新增 `-Xlambdas=indy` 編譯器選項。 如果您可以使用
此 [YouTrack 工單](https://youtrack.jetbrains.com/issue/KT-45375) 分享您對它的回饋，我們將不勝感激。

瞭解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和 [命令列編譯器](compiler-reference#compiler-options) 中新增編譯器選項。

### 棄用 @JvmDefault 和舊的 Xjvm-default 模式

在 Kotlin 1.4.0 之前，存在 `@JvmDefault` 註釋以及 `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`
模式。 它們用於為 Kotlin 介面中的任何特定非抽象成員建立 JVM 預設方法。

在 Kotlin 1.4.0 中，我們[引入了新的 `Xjvm-default` 模式](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)，
它為整個專案切換預設方法產生。

在 Kotlin 1.5.0 中，我們棄用了 `@JvmDefault` 和舊的 Xjvm-default 模式：`-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`。

[瞭解更多關於 Java 互通性中的預設方法](java-to-kotlin-interop#default-methods-in-interfaces)。

### 改進了對可空性註釋的處理

Kotlin 支援使用 [可空性註釋](java-interop#nullability-annotations) 處理來自 Java 的類型可空性資訊。
Kotlin 1.5.0 為該功能引入了許多改進：

* 它讀取用作依賴項的已編譯 Java 程式庫中類型引數上的可空性註釋。
* 它支援具有 `TYPE_USE` 目標的可空性註釋，適用於：
  * 陣列
  * Varargs
  * 欄位
  * 類型參數及其邊界
  * 基底類別和介面的類型引數
* 如果可空性註釋具有適用於某個類型的多個目標，並且其中一個目標是 `TYPE_USE`，則優先選擇 `TYPE_USE`。
  例如，如果 `@Nullable` 同時支援
  `TYPE_USE` 和 `METHOD` 作為目標，則方法簽章 `@Nullable String[] f()` 變為 `fun f(): Array<String?>!`。

對於這些新支援的情況，從 Kotlin 呼叫 Java 時使用錯誤的類型可空性會產生警告。
使用 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項來啟用這些情況的嚴格模式（具有錯誤報告）。

[瞭解更多關於空安全和平台類型](java-interop#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Native 現在效能更高且更穩定。 值得注意的變更是：
* [效能改進](#performance-improvements)
* [停用記憶體洩漏檢查器](#deactivation-of-the-memory-leak-checker)

### 效能改進

在 1.5.0 中，Kotlin/Native 收到了一系列效能改進，這些改進加速了編譯和執行。

[編譯器快取](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native) 現在在
`linuxX64`（僅在 Linux 主機上）和 `iosArm64` 目標的除錯模式下受支援。 啟用編譯器快取後，除了第一個之外，大多數除錯編譯
完成得更快。 測量顯示我們的測試專案的效能提高了約 200%。

若要將編譯器快取用於新目標，請將以下幾行新增到專案的 `gradle.properties` 中以選擇加入：
* 對於 `linuxX64`：`kotlin.native.cacheKind.linuxX64=static`
* 對於 `iosArm64`：`kotlin.native.cacheKind.iosArm64=static`

如果您在啟用編譯器快取後遇到任何問題，請將它們報告給我們的問題追蹤器 [YouTrack](https://kotl.in/issue)。

其他改進加速了 Kotlin/Native 程式碼的執行：
* 內聯了簡單的屬性存取器。
* 在編譯期間評估字串文字上的 `trimIndent()`。

### 停用記憶體洩漏檢查器

預設情況下，已停用內建的 Kotlin/Native 記憶體洩漏檢查器。

它最初是為內部使用而設計的，並且只能在有限數量的案例中找到洩漏，而不是所有案例。
此外，後來發現它存在可能導致應用程式崩潰的問題。 因此，我們決定關閉記憶體洩漏檢查器。

記憶體洩漏檢查器在某些情況下仍然有用，例如，單元測試。 對於這些情況，您可以透過新增以下程式碼行來啟用它：

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

請注意，不建議為應用程式執行時啟用檢查器。

## Kotlin/JS

Kotlin/JS 在 1.5.0 中收到演進式變更。 我們正在繼續我們的工作，將 [JS IR 編譯器後端](js-ir-compiler)
轉向穩定並發佈其他更新：

* [將 webpack 升級到版本 5](#upgrade-to-webpack-5)
* [適用於 IR 編譯器的框架和程式庫](#frameworks-and-libraries-for-the-ir-compiler)

### 升級到 webpack 5

Kotlin/JS Gradle 外掛程式現在使用 webpack 5 作為瀏覽器目標，而不是 webpack 4。 這是 webpack 的一次重大升級，
帶來了不相容的變更。 如果您使用的是自訂 webpack 組態，請務必查看 [webpack 5 版本資訊](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)。

[瞭解更多關於使用 webpack 捆綁 Kotlin/JS 專案的資訊](js-project-setup#webpack-bundling)。

### 適用於 IR 編譯器的框架和程式庫

Kotlin/JS IR 編譯器處於 [Alpha](components-stability) 階段。 它可能會以不相容的方式變更，並且將來需要手動遷移。
我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供有關它的回饋。

在致力於 Kotlin/JS 編譯器的基於 IR 的後端的同時，我們鼓勵並協助程式庫作者以 `both` 模式建置他們的
專案。 這意味著它們能夠為 Kotlin/JS 編譯器產生工件，從而擴大新編譯器的生態系統。

許多知名的框架和程式庫已可用於 IR 後端：[KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、
[doodle](https://github.com/nacular/doodle) 等。 如果您在專案中使用它們，您已經可以使用 IR 後端建置它
並看到它帶來的優勢。

如果您正在編寫自己的程式庫，請[以 'both' 模式編譯它](js-ir-compiler#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)，
以便您的客戶也可以將其與新編譯器一起使用。

## Kotlin Multiplatform

在 Kotlin 1.5.0 中，[簡化了為每個平台選擇測試依賴項](#simplified-test-dependencies-usage-in-multiplatform-projects)，
現在由 Gradle 外掛程式自動完成。

新的 [API 用於在多平台專案中獲取字元類別，現在可用](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 標準程式庫

標準程式庫收到了一系列變更和改進，從穩定實驗性部分到新增新功能：

* [穩定的不帶正負號的整數類型](#stable-unsigned-integer-types)
* [穩定的不區分地區設定的 API，用於大寫/小寫文字](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [穩定的字元到整數轉換 API](#stable-char-to-integer-conversion-api)
* [穩定的路徑 API](#stable-path-api)
* [Floored 除法和 mod 運算符](#floored-division-and-the-mod-operator)
* [Duration API 變更](#duration-api-changes)
* [新的 API 用於在多平台程式碼中獲取字元類別，現在可用](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新的集合函數 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean() 的嚴格版本](#strict-version-of-string-toboolean)

您可以在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)中瞭解更多關於標準程式庫變更的資訊。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 穩定的不帶正負號的整數類型

`UInt`、`ULong`、`UByte`、`UShort` 不帶正負號的整數類型現在是[穩定的](components-stability)。 對於這些類型的運算、範圍和進度也是如此。 不帶正負號的陣列及其上的運算仍然處於 Beta 階段。

[瞭解更多關於不帶正負號的整數類型的資訊](unsigned-integer-types)。

### 穩定的不區分地區設定的 API，用於大寫/小寫文字

此版本帶來了新的不區分地區設定的 API，用於大寫/小寫文字轉換。 它提供了 `toLowerCase()`、`toUpperCase()`、`capitalize()` 和 `decapitalize()` API 函數的替代方案，這些函數對地區設定敏感。 新的 API 可協助您避免因不同的地區設定而導致的錯誤。

Kotlin 1.5.0 提供了以下完全[穩定的](components-stability)替代方案：

* 對於 `String` 函數：

  |**早期版本**|**1.5.0 替代方案**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 對於 `Char` 函數：

  |**早期版本**|**1.5.0 替代方案**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

對於 Kotlin/JVM，還有具有顯式 `Locale` 參數的重載 `uppercase()`、`lowercase()` 和 `titlecase()` 函數。

:::

舊的 API 函數已標記為已棄用，並將在未來的版本中刪除。

請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions) 中文字處理函數變更的完整清單。

### 穩定的字元到整數轉換 API

從 Kotlin 1.5.0 開始，新的字元到程式碼和字元到數字轉換函數是[穩定的](components-stability)。 這些函數取代了目前的 API 函數，這些函數經常與類似的字串到 Int 轉換混淆。

新的 API 消除了這種命名混淆，使程式碼行為更加透明和明確。

此版本引入了 `Char` 轉換，這些轉換分為以下幾組明確命名的函數：

* 獲取 `Char` 的整數程式碼並從給定程式碼構造 `Char` 的函數：

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* 將 `Char` 轉換為它表示的數字的數值的函數：

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* `Int` 的擴展函數，用於將它表示的非負單個數字轉換為對應的 `Char` 表示形式：

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

舊的轉換 API，包括 `Number.toChar()` 及其實作（除了 `Int.toChar()` 之外的所有實作）和用於轉換為數字類型的 `Char` 擴展，例如 `Char.toInt()`，現在已棄用。

[在 KEEP 中瞭解更多關於字元到整數轉換 API 的資訊](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions)。

### 穩定的路徑 API

`java.nio.file.Path` 的具有擴展的 [實驗性路徑 API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/) 現在是[穩定的](components-stability)。

```kotlin
// construct path with the div (/) operator
// 使用 div (/) 運算符構造路徑
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
// 列出目錄中的檔案
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[瞭解更多關於路徑 API 的資訊](whatsnew1420#extensions-for-java-nio-file-path)。

### Floored 除法和 mod 運算符

已將用於模數算術的新運算新增到標準程式庫：
* `floorDiv()` 傳回 [floored 除法](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) 的結果。 它可用於整數類型。
* `mod()` 傳回 floored 除法的餘數（_模數_）。 它可用於所有數字類型。

這些運算看起來與現有的[整數除法](numbers#operations-on-numbers) 和 [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)
函數（或 `%` 運算符）非常相似，但它們在負數上的工作方式不同：
* `a.floorDiv(b)` 與常規 `/` 的不同之處在於 `floorDiv` 將結果向下捨入（朝向較小的整數），
  而 `/` 將結果截斷為更接近 0 的整數。
* `a.mod(b)` 是 `a` 和 `a.floorDiv(b) * b` 之間的差。 它是零或具有與 `b` 相同的符號，
  而 `a % b` 可以具有不同的符號。

```kotlin
fun main() {

    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")

}
```

### Duration API 變更

:::caution
Duration API 是 [實驗性的](components-stability)。 它可能隨時被刪除或更改。
僅將其用於評估目的。 我們將不勝感激您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供有關它的回饋。

:::

有一個實驗性的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別，用於表示
不同時間單位的持續時間量。 在 1.5.0 中，Duration API 收到了以下變更：

* 內部值表示現在使用 `Long` 而不是 `Double` 來提供更好的精度。
* 有一個新的 API 用於轉換為 `Long` 中的特定時間單位。 它用於取代舊的 API，該 API 使用
  `Double` 值運算，現在已棄用。 例如，[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html) 傳回以 `Long` 表示的持續時間值，
  並取代 `Duration.inMinutes`。
* 有新的伴隨函數用於從數字構造 `Duration`。 例如，[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)
  建立一個 `Duration` 物件，表示整數秒數。 舊的擴展屬性（如 `Int.seconds`）現在已棄用。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {

    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")

}
```

### 新的 API 用於在多平台程式碼中獲取字元類別，現在可用

Kotlin 1.5.0 引入了新的 API，用於在多平台專案中根據 Unicode 獲取字元的類別。
現在，所有平台和通用程式碼中都提供了一些函數。

用於檢查字元是否為字母或數字的函數：
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {

    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]

}
```

用於檢查字元大小寫的函數：
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {

    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]

}
```

其他一些函數：
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

屬性 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) 及其回傳類型
enum class [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)，它指示
根據 Unicode 的字元一般類別，現在也可用於多平台專案。

[瞭解更多關於字元的資訊](characters)。

### 新的集合函數 firstNotNullOf()

新的 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 和 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
函數將 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)
與 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 結合在一起。
它們使用自訂選取器函數對原始集合進行對應，並傳回第一個非空值。 如果沒有這樣的值，
`firstNotNullOf()` 會擲回例外狀況，而 `firstNotNullOfOrNull()` 傳回 null。

```kotlin
fun main() {

    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))

}
```

### String?.toBoolean() 的嚴格版本

兩個新函數引入了現有 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html) 的區分大小寫的嚴格版本：
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html) 對於除了文字 `true` 和 `false` 之外的所有輸入，都會擲回例外狀況。
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html) 對於除了文字 `true` 和 `false` 之外的所有輸入，都會傳回 null。

```kotlin
fun main() {

    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception

}
```

## kotlin-test 程式庫
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 程式庫引入了一些新功能：
* [簡化了多平台專案中的測試依賴項用法](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [自動選擇 Kotlin/JVM 原始碼集的測試框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [斷言函數更新](#assertion-function-updates)

### 簡化了多平台專案中的測試依賴項用法

現在，您可以使用 `kotlin-test` 依賴項在 `commonTest` 原始碼集中新增測試依賴項，並且
Gradle 外掛程式將推斷每個測試原始碼集的對應平台依賴項：
* 用於 JVM 原始碼集的 `kotlin-test-junit`，請參閱 [自動選擇 Kotlin/JVM 原始碼集的測試框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* 用於 Kotlin/JS 原始碼集的 `kotlin-test-js`
* 用於通用原始碼集的 `kotlin-test-common` 和 `kotlin-test-annotations-common`
* 沒有用於 Kotlin/Native 原始碼集的額外工件

此外，您可以在任何共用或平台特定的原始碼集中使用 `kotlin-test` 依賴項。

具有顯式依賴項的現有 kotlin-test