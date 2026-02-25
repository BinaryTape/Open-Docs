[//]: # (title: Kotlin 1.5.20 的新功能)

<web-summary>閱讀 Kotlin 1.5.20 發行說明，涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發行日期：2021 年 6 月 24 日](releases.md#release-history)_

Kotlin 1.5.20 修正了 1.5.0 新功能中發現的問題，並包含各種工具改進。

您可以在 [發行部落格文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/) 和此影片中找到變更總覽：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

> 有關 Kotlin 發行週期的資訊，請參閱 [Kotlin 發行程序](releases.md)。
>
{style="tip"}

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台上有以下更新： 
* [透過 invokedynamic 進行字串連接](#string-concatenation-via-invokedynamic)
* [支援 JSpecify 可 null 性註解](#support-for-jspecify-nullness-annotations)
* [支援在同時包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 產生的方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 透過 invokedynamic 進行字串連接

Kotlin 1.5.20 在 JVM 9+ 目標上將字串連接編譯為 [dynamic invocation](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`)，從而跟上現代 Java 版本的步伐。更確切地說，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 進行字串連接。

若要切換回先前版本使用的透過 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 進行的連接方式，請加入編譯器選項 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven-compile-package.md#specify-compiler-options) 和 [命令列編譯器](compiler-reference.md#compiler-options) 中加入編譯器選項。

### 支援 JSpecify 可 null 性註解

Kotlin 編譯器可以讀取各種類型的 [可 null 性註解](java-interop.md#nullability-annotations)，以便將可 null 性資訊從 Java 傳遞到 Kotlin。1.5.20 版本引入了對 [JSpecify 專案](https://jspecify.dev/) 的支援，該專案包含標準統一的 Java 可 null 性註解集。

透過 JSpecify，您可以提供更詳細的可 null 性資訊，幫助 Kotlin 在與 Java 互通時保持 null 安全。您可以為宣告、套件或模組範圍設定預設可 null 性，指定參數化可 null 性等。您可以在 [JSpecify 使用指南](https://jspecify.dev/docs/user-guide) 中找到更多相關詳細資訊。

以下是 Kotlin 如何處理 JSpecify 註解的範例：

```java
// JavaClass.java
import org.jspecify.nullness.*;

@NullMarked
public class JavaClass {
  public String notNullableString() { return ""; }
  public @Nullable String nullableString() { return ""; }
}
```

```kotlin
// Test.kt
fun kotlinFun() = with(JavaClass()) {
  notNullableString().length // OK
  nullableString().length    // 警告：接收者可 null 性不符
}
```

在 1.5.20 中，根據 JSpecify 提供的可 null 性資訊，所有的可 null 性不符都會被回報為警告。使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項，可以在使用 JSpecify 時啟用嚴格模式（包含錯誤回報）。請注意，JSpecify 專案正在積極開發中，其 API 和實作可能隨時發生重大變化。

[進一步了解 null 安全性和平台型別](java-interop.md#null-safety-and-platform-types)。

### 支援在同時包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 產生的方法

> Lombok 編譯器外掛程式是 [實驗性的](components-stability.md)。它可能隨時被刪除或更改。請僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.20 引入了實驗性的 [Lombok 編譯器外掛程式](lombok.md)。此外掛程式使得在同時包含 Kotlin 和 Java 程式碼的模組中產生和使用 Java 的 [Lombok](https://projectlombok.org/) 宣告成為可能。Lombok 註解僅在 Java 原始碼中有效，如果在 Kotlin 程式碼中使用它們則會被忽略。

該外掛程式支援以下註解：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們正在繼續開發此外掛程式。要了解詳細的現狀，請造訪 [Lombok 編譯器外掛程式的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有支援 `@Builder` 註解的計畫。但是，如果您在 [YouTrack 中為 `@Builder` 投票](https://youtrack.jetbrains.com/issue/KT-46959)，我們可以考慮這一點。

[了解如何配置 Lombok 編譯器外掛程式](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供新功能的預覽和工具改進：

* [選擇性將 KDoc 註解匯出至產生的 Objective-C 標頭檔](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [編譯器錯誤修正](#compiler-bug-fixes)
* [提升 Array.copyInto() 在單一陣列內的操作效能](#improved-performance-of-array-copyinto-inside-one-array)

### 選擇性將 KDoc 註解匯出至產生的 Objective-C 標頭檔

> 將 KDoc 註解匯出至產生的 Objective-C 標頭檔的功能是 [實驗性的](components-stability.md)。它可能隨時被刪除或更改。需要手動啟用（見下文詳情），且您應僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 上提供回饋。
>
{style="warning"}

您現在可以設定 Kotlin/Native 編譯器，將 Kotlin 程式碼中的 [文件註解 (KDoc)](kotlin-doc.md) 匯出到從中產生的 Objective-C 框架，使其對框架的使用者可見。

例如，以下包含 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

會產生以下 Objective-C 標頭檔：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

這在 Swift 中也運作良好。

要嘗試此將 KDoc 註解匯出到 Objective-C 標頭檔的功能，請使用 `-Xexport-kdoc` 編譯器選項。在您想要匯出註解的 Gradle 專案的 `build.gradle(.kts)` 中加入以下幾行：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</tab>
</tabs>

如果您能使用此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-38600) 與我們分享您的回饋，我們將不勝感激。

### 編譯器錯誤修正

Kotlin/Native 編譯器在 1.5.20 中進行了多項錯誤修正。您可以在 [變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20) 中找到完整清單。

有一個影響相容性的重要錯誤修正：在先前版本中，包含錯誤 UTF [代理對 (surrogate pair)](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates) 的字串常數在編譯期間會丟失其值。現在這些值會被保留。應用程式開發人員可以放心更新到 1.5.20 – 不會發生損壞。但是，使用 1.5.20 編譯的程式庫與早期的編譯器版本不相容。詳情請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-33175)。

### 提升 Array.copyInto() 在單一陣列內的操作效能

我們改進了 `Array.copyInto()` 在來源與目的地為同一個陣列時的運作方式。由於對此使用案例進行了記憶體管理最佳化，現在這類操作的完成速度最高可提升 20 倍（取決於複製的物件數量）。

## Kotlin/JS

隨 1.5.20 一起，我們發布了一份指南，將幫助您將專案遷移到 Kotlin/JS 的新 [基於 IR 的後端](js-ir-compiler.md)。

### JS IR 後端的遷移指南

新的 JS IR 後端遷移指南識別了您在遷移過程中可能遇到的問題，並提供了解決方案。如果您發現任何指南中未涵蓋的問題，請向我們的 [問題追蹤器](http://kotl.in/issue) 回報。

## Gradle

Kotlin 1.5.20 引入了以下可以提升 Gradle 體驗的功能：

* [在 kapt 中快取註解處理器的類別載入器](#caching-for-annotation-processors-classloaders-in-kapt)
* [棄用 `kotlin.parallel.tasks.in.project` 建置屬性](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### 在 kapt 中快取註解處理器的類別載入器

> 在 kapt 中快取註解處理器的類別載入器是 [實驗性的](components-stability.md)。它可能隨時被刪除或更改。請僅將其用於評估目的。我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上提供回饋。
>
{style="warning"}

現在有一個新的實驗性功能，可以在 [kapt](kapt.md) 中快取註解處理器的類別載入器。此功能可以提高連續執行 Gradle 時 kapt 的速度。

要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# 正值將啟用快取
# 使用與使用 kapt 的模組數量相同的值
kapt.classloaders.cache.size=5

# 停用後快取才能運作
kapt.include.compile.classpath=false
```

進一步了解 [kapt](kapt.md)。

### 棄用 kotlin.parallel.tasks.in.project 建置屬性

在此版本中，Kotlin 並行編譯由 [Gradle 並行執行旗標 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。使用此旗標，Gradle 會同步執行任務，提高編譯任務的速度並更有效地利用資源。

您不再需要使用 `kotlin.parallel.tasks.in.project` 屬性。該屬性已被棄用，並將在下一個主要版本中移除。

## 標準程式庫

Kotlin 1.5.20 更改了幾個用於處理字元的函式在特定平台上的實作，從而實現了跨平台的統一：
* [Kotlin/Native 和 Kotlin/JS 的 Char.digitToInt() 支援所有 Unicode 數字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [跨平台統一 Char.isLowerCase()/isUpperCase() 的實作](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native 和 Kotlin/JS 的 Char.digitToInt() 支援所有 Unicode 數字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 傳回字元所代表的十進位數字的數值。在 1.5.20 之前，該函式僅在 Kotlin/JVM 上支援所有 Unicode 數字字元：Native 和 JS 平台的實作僅支援 ASCII 數字。

從現在起，無論是 Kotlin/Native 還是 Kotlin/JS，您都可以在任何 Unicode 數字字元上呼叫 `Char.digitToInt()` 並獲取其數字表示。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 跨平台統一 Char.isLowerCase()/isUpperCase() 的實作

函式 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 根據字元的大小寫傳回布林值。對於 Kotlin/JVM，實作會同時檢查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 屬性 (Unicode property)](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的實作方式不同，僅考慮一般類別。在 1.5.20 中，各平台的實作已統一，皆使用這兩個屬性來判斷字元的大小寫：

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // 具有 "Lu" 一般類別
    val circledLatinCapitalA = 'Ⓐ' // 具有 "Other_Uppercase" 屬性
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}