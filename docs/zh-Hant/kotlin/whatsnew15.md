[//]: # (title: Kotlin 1.5.0 的新功能)

_[發布日期：2021 年 5 月 5 日](releases.md#release-details)_

Kotlin 1.5.0 引入了新的語言功能、穩定基於 IR 的 JVM 編譯器後端、效能改進，以及如穩定實驗性功能和棄用過時功能等演進性變更。

您也可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)中找到這些變更的概覽。

## 語言功能

Kotlin 1.5.0 帶來了在 [1.4.30 中預覽](whatsnew1430.md#language-features)的新語言功能的穩定版本：
* [JVM 記錄支援](#jvm-records-support)
* [密封介面](#sealed-interfaces)及[密封類別改進](#package-wide-sealed-class-hierarchies)
* [行內類別](#inline-classes)

這些功能的詳細說明可在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)和 Kotlin 文件相應的頁面中找到。

### JVM 記錄支援

Java 正在快速演進，為了確保 Kotlin 能與其保持互通性，我們引入了對其最新功能之一 — [記錄類別](https://openjdk.java.net/jeps/395)的支援。

Kotlin 對 JVM 記錄的支援包括雙向互通性：
* 在 Kotlin 程式碼中，您可以像使用帶有屬性的典型類別一樣使用 Java 記錄類別。
* 要在 Java 程式碼中將 Kotlin 類別用作記錄，請將其設為 `data` 類別並使用 `@JvmRecord` 註解標記它。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[進一步了解如何在 Kotlin 中使用 JVM 記錄](jvm-records.md)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### 密封介面

Kotlin 介面現在可以使用 `sealed` 修飾符，其作用於介面的方式與作用於類別相同：密封介面的所有實作在編譯時都是已知的。

```kotlin
sealed interface Polygon
```

您可以依賴此事實，例如，撰寫詳盡的 `when` 運算式。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // else is not needed - all possible implementations are covered
}

```

此外，密封介面允許更彈性的受限類別階層，因為一個類別可以直接繼承多個密封介面。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[進一步了解密封介面](sealed-classes.md)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### 套件範圍的密封類別階層

密封類別現在可以在同一編譯單元和同一套件的所有檔案中擁有子類別。以前，所有子類別都必須出現在同一個檔案中。

直接子類別可以是頂層類別，也可以巢狀於任意數量的其他具名類別、具名介面或具名物件中。

密封類別的子類別必須具有適當限定的名稱 – 它們不能是區域性或匿名物件。

[進一步了解密封類別階層](sealed-classes.md#inheritance)。

### 行內類別

行內類別是[基於值的](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)類別的一個子集，它們只持有值。您可以將它們用作特定類型值的包裝器，而無需因記憶體分配而產生的額外開銷。

行內類別可以使用 `value` 修飾符在類別名稱前宣告：

```kotlin
value class Password(val s: String)
```

JVM 後端也需要一個特殊的 `@JvmInline` 註解：

```kotlin
@JvmInline
value class Password(val s: String)
```

現在 `inline` 修飾符已被棄用並發出警告。

[進一步了解行內類別](inline-classes.md)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM 獲得了許多改進，包括內部和使用者面向的。其中最值得注意的是：

* [穩定 JVM IR 後端](#stable-jvm-ir-backend)
* [新的預設 JVM 目標：1.8](#new-default-jvm-target-1-8)
* [透過 invokedynamic 的 SAM 轉接器](#sam-adapters-via-invokedynamic)
* [透過 invokedynamic 的 Lambda 運算式](#lambdas-via-invokedynamic)
* [棄用 @JvmDefault 和舊版 Xjvm-default 模式](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [處理可空性註解的改進](#improvements-to-handling-nullability-annotations)

### 穩定 JVM IR 後端

Kotlin/JVM 編譯器的[基於 IR 的後端](whatsnew14.md#new-jvm-ir-backend)現在已[穩定](components-stability.md)並預設啟用。

從 [Kotlin 1.4.0](whatsnew14.md) 開始，基於 IR 的後端早期版本已可供預覽，現在它已成為語言版本 `1.5` 的預設後端。舊版後端仍預設用於較早的語言版本。

您可以在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中找到有關 IR 後端優點及其未來發展的更多詳細資訊。

如果您需要在 Kotlin 1.5.0 中使用舊版後端，您可以將以下行加入專案的設定檔中：

* 在 Gradle 中：

 <tabs group="build-script">
 <tab title="Kotlin" group-key="kotlin">

 ```kotlin
 tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
   kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 <tab title="Groovy" group-key="groovy">

 ```groovy
 tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
  kotlinOptions.useOldBackend = true
 }
 ```

 </tab>
 </tabs>

* 在 Maven 中：

 ```xml
 <configuration>
     <args>
         <arg>-Xuse-old-backend</arg>
     </args>
 </configuration>
 ```

### 新的預設 JVM 目標：1.8

Kotlin/JVM 編譯的預設目標版本現在是 `1.8`。`1.6` 目標已被棄用。

如果您需要為 JVM 1.6 建置，您仍然可以切換到此目標。了解如何操作：

* [在 Gradle 中](gradle-compiler-options.md#attributes-specific-to-jvm)
* [在 Maven 中](maven.md#attributes-specific-to-jvm)
* [在命令列編譯器中](compiler-reference.md#jvm-target-version)

### 透過 invokedynamic 的 SAM 轉接器

Kotlin 1.5.0 現在使用動態調用 (`invokedynamic`) 來編譯 SAM (單一抽象方法) 轉換：
* 如果 SAM 類型是 [Java 介面](java-interop.md#sam-conversions)，則適用於任何表達式。
* 如果 SAM 類型是 [Kotlin 函式介面](fun-interfaces.md#sam-conversions)，則適用於 Lambda 運算式。

新的實作使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)，並且在編譯期間不再產生輔助包裝器類別。這減少了應用程式 JAR 的大小，從而提高了 JVM 的啟動效能。

要回溯到基於匿名類別生成的舊實作方案，請加入編譯器選項 `-Xsam-conversions=class`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令列編譯器](compiler-reference.md#compiler-options)中加入編譯器選項。

### 透過 invokedynamic 的 Lambda 運算式

> 將普通 Kotlin Lambda 編譯為 invokedynamic 屬於[實驗性](components-stability.md)功能。它可能隨時被移除或更改。需要啟用 (詳情見下文)，並且您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375) 中提供相關回饋。
>
{style="warning"}

Kotlin 1.5.0 引入了對將普通 Kotlin Lambda (未轉換為函式介面實例的 Lambda) 編譯為動態調用 (`invokedynamic`) 的實驗性支援。該實作透過使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-) 來產生更輕量的二進位檔，這有效地在執行時生成了必要的類別。目前，與普通 Lambda 編譯相比，它有三個限制：

* 編譯為 invokedynamic 的 Lambda 不可序列化。
* 在此類 Lambda 上呼叫 `toString()` 會產生可讀性較差的字串表示。
* 實驗性 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支援使用 `LambdaMetafactory` 建立的 Lambda。

要嘗試此功能，請加入 `-Xlambdas=indy` 編譯器選項。如果您能使用此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-45375)分享您的回饋，我們將不勝感激。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令列編譯器](compiler-reference.md#compiler-options)中加入編譯器選項。

### 棄用 @JvmDefault 和舊版 Xjvm-default 模式

在 Kotlin 1.4.0 之前，有 `@JvmDefault` 註解以及 `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility` 模式。它們用於為 Kotlin 介面中的任何特定非抽象成員建立 JVM 預設方法。

在 Kotlin 1.4.0 中，我們[引入了新的 `Xjvm-default` 模式](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)，這些模式為整個專案開啟預設方法生成。

在 Kotlin 1.5.0 中，我們正在棄用 `@JvmDefault` 和舊版 Xjvm-default 模式：`-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`。

[進一步了解 Java 互通性中的預設方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

### 處理可空性註解的改進

Kotlin 支援使用[可空性註解](java-interop.md#nullability-annotations)處理來自 Java 的類型可空性資訊。Kotlin 1.5.0 引入了該功能的多項改進：

* 它讀取在作為依賴項使用的已編譯 Java 函式庫中類型引數上的可空性註解。
* 它支援具有 `TYPE_USE` 目標的可空性註解，適用於：
  * 陣列
  * 變數引數 (Varargs)
  * 欄位
  * 類型參數及其邊界
  * 基礎類別和介面的類型引數
* 如果可空性註解有多個適用於某個類型的目標，並且其中一個目標是 `TYPE_USE`，那麼 `TYPE_USE` 會被優先考慮。例如，如果 `@Nullable` 同時支援 `TYPE_USE` 和 `METHOD` 作為目標，則方法簽章 `@Nullable String[] f()` 會變成 `fun f(): Array<String?>!`。

對於這些新支援的案例，從 Kotlin 呼叫 Java 時使用錯誤的類型可空性會產生警告。使用 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項為這些案例啟用嚴格模式 (並附帶錯誤報告)。

[進一步了解空值安全和平台類型](java-interop.md#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Native 現在效能更佳且更穩定。值得注意的變更包括：
* [效能改進](#performance-improvements)
* [停用記憶體洩漏檢查器](#deactivation-of-the-memory-leak-checker)

### 效能改進

在 1.5.0 中，Kotlin/Native 獲得了一系列效能改進，可加速編譯和執行。

現在在偵錯模式下，`linuxX64` (僅限 Linux 主機) 和 `iosArm64` 目標支援[編譯器快取](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。啟用編譯器快取後，除了首次編譯外，大多數偵錯編譯都能更快完成。測量結果顯示，在我們的測試專案中，速度約提高了 200%。

要將編譯器快取用於新目標，請在專案的 `gradle.properties` 中加入以下行以選擇啟用：
* 對於 `linuxX64` : `kotlin.native.cacheKind.linuxX64=static`
* 對於 `iosArm64`: `kotlin.native.cacheKind.iosArm64=static`

如果您在啟用編譯器快取後遇到任何問題，請向我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 回報。

其他改進加快了 Kotlin/Native 程式碼的執行速度：
* 瑣碎的屬性存取器會被行內化。
* `trimIndent()` 字串常值上的在編譯期間進行求值。

### 停用記憶體洩漏檢查器

內建的 Kotlin/Native 記憶體洩漏檢查器已預設停用。

它最初是為內部使用而設計的，並且只能在有限的案例中找到洩漏，而非所有案例。此外，後來發現它存在可能導致應用程式崩潰的問題。因此，我們決定關閉記憶體洩漏檢查器。

記憶體洩漏檢查器在某些情況下仍然有用，例如單元測試。對於這些情況，您可以透過加入以下程式碼行來啟用它：

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

請注意，不建議在應用程式執行時啟用此檢查器。

## Kotlin/JS

Kotlin/JS 在 1.5.0 中獲得了演進性變更。我們正在繼續將 [JS IR 編譯器後端](js-ir-compiler.md)推向穩定版，並發布其他更新：

* [將 webpack 升級到版本 5](#upgrade-to-webpack-5)
* [用於 IR 編譯器的框架和函式庫](#frameworks-and-libraries-for-the-ir-compiler)

### 升級到 webpack 5

Kotlin/JS Gradle 外掛程式現在針對瀏覽器目標使用 webpack 5 而非 webpack 4。這是 webpack 的主要升級，帶來了不相容的變更。如果您正在使用自訂的 webpack 設定，請務必查看 [webpack 5 發布說明](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)。

[進一步了解如何使用 webpack 捆綁 Kotlin/JS 專案](js-project-setup.md#webpack-bundling)。

### 用於 IR 編譯器的框架和函式庫

> Kotlin/JS IR 編譯器處於 [Alpha](components-stability.md) 階段。未來它可能會發生不相容的變更並需要手動遷移。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供相關回饋。
>
{style="warning"}

除了開發 Kotlin/JS 編譯器基於 IR 的後端之外，我們還鼓勵並協助函式庫作者以 `both` 模式建置其專案。這表示他們能夠為兩種 Kotlin/JS 編譯器產生構件，從而為新編譯器擴展生態系統。

許多知名的框架和函式庫已可供 IR 後端使用：[KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、[doodle](https://github.com/nacular/doodle) 等。如果您在專案中使用它們，您已經可以使用 IR 後端建置它並看到其帶來的優勢。

如果您正在編寫自己的函式庫，請[以「both」模式編譯它](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)，以便您的客戶也能使用新編譯器。

## Kotlin 多平台

在 Kotlin 1.5.0 中，[為每個平台選擇測試依賴項已簡化](#simplified-test-dependencies-usage-in-multiplatform-projects)，現在由 Gradle 外掛程式自動完成。

現在[在多平台專案中提供了用於取得字元類別的新 API](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 標準函式庫

標準函式庫獲得了一系列變更和改進，從穩定實驗性部分到新增功能：

* [穩定無符號整數型別](#stable-unsigned-integer-types)
* [用於大寫/小寫文字的穩定區域設定無關 API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [穩定字元轉整數轉換 API](#stable-char-to-integer-conversion-api)
* [穩定路徑 API](#stable-path-api)
* [向下取整除法和模數運算子](#floored-division-and-the-mod-operator)
* [持續時間 API 變更](#duration-api-changes)
* [現在在多平台程式碼中提供了用於取得字元類別的新 API](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新的集合函式 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean() 的嚴格版本](#strict-version-of-string-toboolean)

您可以在[此部落格文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)中了解更多關於標準函式庫的變更。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 穩定無符號整數型別

`UInt`、`ULong`、`UByte`、`UShort` 無符號整數型別現在已[穩定](components-stability.md)。這些型別的操作、範圍和進程也是如此。無符號陣列及其操作仍處於 Beta 階段。

[進一步了解無符號整數型別](unsigned-integer-types.md)。

### 用於大寫/小寫文字的穩定區域設定無關 API

此版本帶來了用於大寫/小寫文字轉換的新區域設定無關 API。它提供了 `toLowerCase()`、`toUpperCase()`、`capitalize()` 和 `decapitalize()` 等區域設定敏感的 API 函式的替代方案。新 API 可協助您避免因不同區域設定而產生的錯誤。

Kotlin 1.5.0 提供了以下完全[穩定](components-stability.md)的替代方案：

* 對於 `String` 函式：

  |**舊版**|**1.5.0 替代方案**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 對於 `Char` 函式：

  |**舊版**|**1.5.0 替代方案**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 對於 Kotlin/JVM，還有帶有明確 `Locale` 參數的重載 `uppercase()`、`lowercase()` 和 `titlecase()` 函式。
>
{style="note"}

舊版 API 函式已被標記為棄用，並將在未來版本中移除。

請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md) 中文字處理功能的完整變更清單。

### 穩定字元轉整數轉換 API

從 Kotlin 1.5.0 開始，新的字元轉程式碼和字元轉數字轉換函式已[穩定](components-stability.md)。這些函式取代了現有的 API 函式，這些函式經常與類似的字串轉 Int 轉換混淆。

新的 API 消除了這種命名混淆，使程式碼行為更加透明和明確。

此版本引入了 `Char` 轉換，這些轉換分為以下幾組名稱清晰的函式：

* 取得 `Char` 的整數程式碼並從給定程式碼建構 `Char` 的函式：

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* 將 `Char` 轉換為其所代表數字的數值之函式：

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* 用於 `Int` 的擴展函式，將其所代表的非負單一數字轉換為相應的 `Char` 表示：

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

舊版轉換 API，包括 `Number.toChar()` 及其實作 (除了 `Int.toChar()` 之外的所有實作) 和用於轉換為數值型別的 `Char` 擴展，例如 `Char.toInt()`，現在已棄用。

[進一步了解 KEEP 中的字元轉整數轉換 API](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)。

### 穩定路徑 API

具有 `java.nio.file.Path` 擴展功能的[實驗性路徑 API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/) 現在已[穩定](components-stability.md)。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[進一步了解路徑 API](whatsnew1420.md#extensions-for-java-nio-file-path)。

### 向下取整除法和模數運算子

標準函式庫已新增模組化算術運算：
* `floorDiv()` 返回[向下取整除法](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)的結果。它適用於整數型別。
* `mod()` 返回向下取整除法的餘數 ( _模數_ )。它適用於所有數值型別。

這些運算看起來與現有的[整數除法](numbers.md#operations-on-numbers)和 [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html) 函式 (或 `%` 運算子) 頗為相似，但它們在負數上的運作方式不同：
* `a.floorDiv(b)` 與常規的 `/` 不同之處在於，`floorDiv` 會將結果向下取整 (朝向較小的整數)，而 `/` 則會將結果截斷為更接近 0 的整數。
* `a.mod(b)` 是 `a` 與 `a.floorDiv(b) * b` 之間的差值。它要麼為零，要麼與 `b` 具有相同的符號，而 `a % b` 則可能不同。

```kotlin
fun main() {
//sampleStart
    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 持續時間 API 變更

> 持續時間 API 屬於[實驗性](components-stability.md)功能。它可能隨時被移除或更改。僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供相關回饋。
>
{style="warning"}

有一個實驗性的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別，用於表示不同時間單位的持續時間量。在 1.5.0 中，持續時間 API 獲得了以下變更：

* 內部值表示現在使用 `Long` 而非 `Double` 以提供更好的精確度。
* 有一個新的 API 用於將持續時間轉換為 `Long` 型別的特定時間單位。它取代了操作 `Double` 值的舊版 API，舊版 API 現在已被棄用。例如，[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html) 返回表示為 `Long` 的持續時間值，並取代 `Duration.inMinutes`。
* 有一些新的伴隨函式用於從數字建構 `Duration`。例如，[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html) 建立一個表示整數秒數的 `Duration` 物件。舊版擴展屬性如 `Int.seconds` 現在已棄用。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {
//sampleStart
    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")
//sampleEnd
}
```
{validate="false"}

### 現在在多平台程式碼中提供了用於取得字元類別的新 API

Kotlin 1.5.0 引入了在多平台專案中根據 Unicode 取得字元類別的新 API。現在所有平台和通用程式碼中都提供了多個函式。

檢查字元是否為字母或數字的函式：
* [`Char.isDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-digit.html)
* [`Char.isLetter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter.html)
* [`Char.isLetterOrDigit()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-letter-or-digit.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('a', '1', '+')
    val (letterOrDigitList, notLetterOrDigitList) = chars.partition { it.isLetterOrDigit() }
    println(letterOrDigitList) // [a, 1]
    println(notLetterOrDigitList) // [+]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

檢查字元大小寫的函式：
* [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
* [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html)
* [`Char.isTitleCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-title-case.html)

```kotlin
fun main() {
//sampleStart
    val chars = listOf('ǅ', 'ǈ', 'ǋ', 'ǲ', '1', 'A', 'a', '+')
    val (titleCases, notTitleCases) = chars.partition { it.isTitleCase() }
    println(titleCases) // [ǅ, ǈ, ǋ, ǲ]
    println(notTitleCases) // [1, A, a, +]
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

其他一些函式：
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

屬性 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) 及其傳回類型列舉類別 [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/) (表示字元根據 Unicode 的通用類別) 現在也已在多平台專案中可用。

[進一步了解字元](characters.md)。

### 新的集合函式 firstNotNullOf()

新的 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 和 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 函式將 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 與 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 結合。它們使用自訂選擇器函式映射原始集合，並傳回第一個非空值。如果沒有此類值，`firstNotNullOf()` 會拋出異常，而 `firstNotNullOfOrNull()` 則傳回 null。

```kotlin
fun main() {
//sampleStart
    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### String?.toBoolean() 的嚴格版本

兩個新函式引入了現有 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html) 的區分大小寫的嚴格版本：
* `String.toBooleanStrict()` 會對除常值 `true` 和 `false` 以外的所有輸入拋出異常。
* `String.toBooleanStrictOrNull()` 會對除常值 `true` 和 `false` 以外的所有輸入傳回 null。

```kotlin
fun main() {
//sampleStart
    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception
//sampleEnd    
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## kotlin-test 函式庫
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 函式庫引入了一些新功能：
* [簡化多平台專案中的測試依賴項使用](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [自動選擇 Kotlin/JVM 原始碼集的測試框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [斷言函式更新](#assertion-function-updates)

### 簡化多平台專案中的測試依賴項使用

現在您可以使用 `kotlin-test` 依賴項在 `commonTest` 原始碼集中加入測試依賴項，並且 Gradle 外掛程式將為每個測試原始碼集推斷出相應的平台依賴項：
* `kotlin-test-junit` 用於 JVM 原始碼集，請參閱[自動選擇 Kotlin/JVM 原始碼集的測試框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* `kotlin-test-js` 用於 Kotlin/JS 原始碼集
* `kotlin-test-common` 和 `kotlin-test-annotations-common` 用於通用原始碼集
* Kotlin/Native 原始碼集沒有額外的構件

此外，您可以在任何共享或平台特定的原始碼集中使用 `kotlin-test` 依賴項。

現有的具有明確依賴項的 kotlin-test 設定將繼續在 Gradle 和 Maven 中運作。

進一步了解[設定測試函式庫的依賴項](gradle-configure-project.md#set-dependencies-on-test-libraries)。

### 自動選擇 Kotlin/JVM 原始碼集的測試框架

Gradle 外掛程式現在會自動選擇並加入測試框架的依賴項。您只需在通用原始碼集中加入 `kotlin-test` 依賴項即可。

Gradle 預設使用 JUnit 4。因此，`kotlin("test")` 依賴項會解析為 JUnit 4 的變體，即 `kotlin-test-junit`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // This brings the dependency
                                               // on JUnit 4 transitively
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings the dependency 
                                              // on JUnit 4 transitively
            }
        }
    }
}
```

</tab>
</tabs>

您可以透過在測試任務中呼叫 [`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform) 或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) 來選擇 JUnit 5 或 TestNG：

```groovy
tasks {
    test {
        // enable TestNG support
        useTestNG()
        // or
        // enable JUnit Platform (a.k.a. JUnit 5) support
        useJUnitPlatform()
    }
}
```

您可以透過在專案的 `gradle.properties` 中加入行 `kotlin.test.infer.jvm.variant=false` 來停用自動測試框架選擇。

進一步了解[設定測試函式庫的依賴項](gradle-configure-project.md#set-dependencies-on-test-libraries)。

### 斷言函式更新

此版本帶來了新的斷言函式並改進了現有的函式。

`kotlin-test` 函式庫現在具有以下功能：

* **檢查值的類型**

  您可以使用新的 `assertIs<T>` 和 `assertIsNot<T>` 來檢查值的類型：

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // throws AssertionError mentioning the actual type of s if the assertion fails
      // can now print s.length because of contract in assertIs
      println("${s.length}")
  }
  ```

  由於類型擦除，此斷言函式在以下範例中僅檢查 `value` 是否為 `List` 類型，而不檢查它是否為特定 `String` 元素類型的列表：`assertIs<List<String>>(value)`。

* **比較陣列、序列和任意可疊代容器的內容**

  有一組新的重載 `assertContentEquals()` 函式，用於比較未實作[結構相等性](equality.md#structural-equality)的不同集合的內容：

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **Double 和 Float 數字的 assertEquals() 和 assertNotEquals() 新重載**

  `assertEquals()` 函式有一些新的重載，可以絕對精度比較兩個 `Double` 或 `Float` 數字。精度值被指定為函式的第三個參數：

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // precision parameter
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **檢查集合和元素內容的新函式**

  您現在可以使用 `assertContains()` 函式檢查集合或元素是否包含某些內容。您可以將其與具有 `contains()` 運算子的 Kotlin 集合和元素一起使用，例如 `IntRange`、`String` 等：

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // element in collection
      assertContains(sampleString, "amp")       // substring in string
  }
  ```

* **assertTrue()、assertFalse()、expect() 函式現在為行內函式**

  從現在起，您可以將這些函式作為行內函式使用，因此可以在 Lambda 運算式中呼叫[暫停函式](composing-suspending-functions.md)：

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await() .contains("Kotlin")
      }
  }
  ```

## kotlinx 函式庫

隨著 Kotlin 1.5.0 的發布，我們也發布了 kotlinx 函式庫的新版本：
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) 隨以下內容而來：
* [新通道 API](channels.md)
* 穩定[反應式整合](async-programming.md#reactive-extensions)
* 及更多

從 Kotlin 1.5.0 開始，[實驗性協程](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)已被停用，且不再支援 `-Xcoroutines=experimental` 旗標。

在[變更日誌](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)和 [`kotlinx.coroutines` 1.5.0 發布部落格文章](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/)中了解更多。

<video src="https://www.youtube.com/v/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) 隨以下內容而來：
* JSON 序列化效能改進
* JSON 序列化中支援多個名稱
* 從 `@Serializable` 類別生成實驗性 .proto 綱要
* 及更多

在[變更日誌](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)和 [`kotlinx.serialization` 1.2.1 發布部落格文章](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/)中了解更多。

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) 隨以下內容而來：
* `@Serializable` 日期時間物件
* DateTimePeriod 和 DatePeriod 的標準化 API
* 及更多

在[變更日誌](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)和 [`kotlinx-datetime` 0.2.0 發布部落格文章](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/)中了解更多。

## 遷移至 Kotlin 1.5.0

一旦 Kotlin 外掛程式可用，IntelliJ IDEA 和 Android Studio 將建議更新 Kotlin 外掛程式到 1.5.0。

要將現有專案遷移到 Kotlin 1.5.0，只需將 Kotlin 版本更改為 `1.5.0` 並重新匯入您的 Gradle 或 Maven 專案。 [了解如何更新到 Kotlin 1.5.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.5.0 開始一個新專案，請更新 Kotlin 外掛程式並從 **File** | **New** | **Project** 執行專案精靈 (Project Wizard)。

新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0)下載。

Kotlin 1.5.0 是一個[功能發布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能為語言帶來不相容的變更。在 [Kotlin 1.5 相容性指南](compatibility-guide-15.md)中找到此類變更的詳細清單。