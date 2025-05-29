[//]: # (title: Kotlin 1.5.20 有什麼新功能)

_[發行時間：2021 年 6 月 24 日](releases.md#release-details)_

Kotlin 1.5.20 修正了 1.5.0 版新功能中發現的問題，同時也包含各種工具改進。

您可以在[發行部落格文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和此影片中找到變更概覽：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台收到以下更新：
* [透過 invokedynamic 進行字串串接](#string-concatenation-via-invokedynamic)
* [支援 JSpecify 可空性註解](#support-for-jspecify-nullness-annotations)
* [支援在包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 生成方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 透過 invokedynamic 進行字串串接

Kotlin 1.5.20 在 JVM 9+ 目標上將字串串接編譯為[動態呼叫](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`)，從而與現代 Java 版本保持同步。
更確切地說，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 進行字串串接。

若要切換回透過 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 進行串接（先前版本中使用），請新增編譯器選項 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令列編譯器](compiler-reference.md#compiler-options)中新增編譯器選項。

### 支援 JSpecify 可空性註解

Kotlin 編譯器可以讀取各種類型的[可空性註解](java-interop.md#nullability-annotations)以將可空性資訊從 Java 傳遞至 Kotlin。1.5.20 版引入了對 [JSpecify 專案](https://jspecify.dev/)的支援，該專案包含 Java 可空性註解的標準統一集合。

藉助 JSpecify，您可以提供更詳細的可空性資訊，以協助 Kotlin 保持與 Java 的空值安全互通。您可以設定宣告、套件或模組範圍的預設可空性，指定參數化可空性等等。您可以在 [JSpecify 使用者指南](https://jspecify.dev/docs/user-guide)中找到更多詳細資訊。

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
  nullableString().length    // Warning: receiver nullability mismatch
}
```

在 1.5.20 中，根據 JSpecify 提供的可空性資訊，所有可空性不匹配問題都將報告為警告。
使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項可在使用 JSpecify 時啟用嚴格模式（附帶錯誤報告）。
請注意，JSpecify 專案正在積極開發中。其 API 和實作隨時可能發生重大變化。

[深入了解空值安全和平台類型](java-interop.md#null-safety-and-platform-types)。

### 支援在包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 生成方法

> Lombok 編譯器外掛是 [實驗性的](components-stability.md)。
> 它隨時可能被棄用或更改。僅用於評估目的。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 上提供回饋。
>
{style="warning"}

Kotlin 1.5.20 引入了一個[實驗性 Lombok 編譯器外掛](lombok.md)。此外掛使得在包含 Kotlin 和 Java 程式碼的模組中生成和使用 Java 的 [Lombok](https://projectlombok.org/) 宣告成為可能。Lombok 註解僅適用於 Java 原始碼，若在 Kotlin 程式碼中使用則會被忽略。

此外掛支援以下註解：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們將持續致力於此外掛。要了解詳細的目前狀態，請訪問 [Lombok 編譯器外掛的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有支援 `@Builder` 註解的計畫。但是，如果您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46959) 中投票支持 `@Builder`，我們可以考慮此功能。

[了解如何配置 Lombok 編譯器外掛](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新功能和工具改進的預覽：

* [選擇性匯出 KDoc 註解至生成的 Objective-C 標頭檔](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [編譯器錯誤修正](#compiler-bug-fixes)
* [改善 Array.copyInto() 在同一陣列內的效能](#improved-performance-of-array-copyinto-inside-one-array)

### 選擇性匯出 KDoc 註解至生成的 Objective-C 標頭檔

> 匯出 KDoc 註解至生成的 Objective-C 標頭檔的功能是 [實驗性的](components-stability.md)。
> 它隨時可能被棄用或更改。
> 需要選擇啟用（詳情見下文），且僅用於評估目的。
> 我們感謝您在 [YouTrack](https://youtrack.com/issue/KT-38600) 上提供回饋。
>
{style="warning"}

您現在可以設定 Kotlin/Native 編譯器，將 Kotlin 程式碼中的[文件註解 (KDoc)](kotlin-doc.md) 匯出到從中生成的 Objective-C 框架，使其對框架的使用者可見。

例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

生成以下 Objective-C 標頭檔：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

這也適用於 Swift。

若要試用此將 KDoc 註解匯出至 Objective-C 標頭檔的功能，請使用 `-Xexport-kdoc` 編譯器選項。將以下行新增到您要匯出註解的 Gradle 專案的 `build.gradle(.kts)` 中：

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

如果您能透過此 [YouTrack 票證](https://youtrack.jetbrains.com/issue/KT-38600) 與我們分享您的回饋，我們將不勝感激。

### 編譯器錯誤修正

Kotlin/Native 編譯器在 1.5.20 中收到了多個錯誤修正。您可以在[變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)中找到完整的列表。

有一個影響相容性的重要錯誤修正：在先前版本中，包含不正確 UTF [代理對](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)的字串常數在編譯期間會丟失其值。現在這些值將被保留。應用程式開發人員可以安全地更新到 1.5.20 – 不會出現任何問題。但是，使用 1.5.20 編譯的函式庫與早期編譯器版本不相容。
有關詳細資訊，請參見此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-33175)。

### 改善 Array.copyInto() 在同一陣列內的效能

我們改進了 `Array.copyInto()` 在其來源和目標為同一陣列時的運作方式。現在這類操作可加快最多 20 倍的速度（取決於複製物件的數量），這是由於針對此用例的記憶體管理最佳化所致。

## Kotlin/JS

在 1.5.20 中，我們發布了一份指南，將協助您將專案遷移到新的[基於 IR 的 Kotlin/JS 後端](js-ir-compiler.md)。

### 適用於 JS IR 後端的遷移指南

新的 [JS IR 後端遷移指南](js-ir-migration.md) 指出您在遷移過程中可能遇到的問題並提供解決方案。如果您發現指南中未涵蓋的任何問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

## Gradle

Kotlin 1.5.20 引入了以下可以改善 Gradle 體驗的功能：

* [kapt 中註解處理器類別載入器的快取功能](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` 建置屬性已棄用](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中註解處理器類別載入器的快取功能

> kapt 中註解處理器類別載入器的快取功能是 [實驗性的](components-stability.md)。
> 它隨時可能被棄用或更改。僅用於評估目的。
> 我們感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上提供回饋。
>
{style="warning"}

現在有一個新的實驗性功能，使得在 [kapt](kapt.md) 中快取註解處理器的類別載入器成為可能。
此功能可以提高 kapt 在連續 Gradle 執行時的速度。

要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

深入了解 [kapt](kapt.md)。

### `kotlin.parallel.tasks.in.project` 建置屬性已棄用

在此版本中，Kotlin 平行編譯由 Gradle 平行執行標誌 `--parallel` 控制。
使用此標誌，Gradle 會同時執行任務，提高編譯任務的速度並更有效地利用資源。

您不再需要使用 `kotlin.parallel.tasks.in.project` 屬性。此屬性已棄用，並將在下一個主要版本中移除。

## 標準函式庫

Kotlin 1.5.20 更改了幾個用於處理字元的平台特定實作，從而實現了跨平台的統一：
* [Char.digitToInt() 在 Kotlin/Native 和 Kotlin/JS 中支援所有 Unicode 數字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [統一跨平台 Char.isLowerCase()/isUpperCase() 實作](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Char.digitToInt() 在 Kotlin/Native 和 Kotlin/JS 中支援所有 Unicode 數字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 返回字元所代表的十進位數字的數值。在 1.5.20 之前，該功能僅在 Kotlin/JVM 中支援所有 Unicode 數字字元：Native 和 JS 平台上的實作僅支援 ASCII 數字。

從現在開始，無論是 Kotlin/Native 還是 Kotlin/JS，您都可以在任何 Unicode 數字字元上呼叫 `Char.digitToInt()` 並獲取其數值表示。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 統一跨平台 Char.isLowerCase()/isUpperCase() 實作

[`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 函數根據字元的大小寫返回一個布林值。對於 Kotlin/JVM，實作同時檢查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 屬性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的實作方式不同，僅考慮一般類別。
在 1.5.20 中，實作在各平台之間統一，並使用這兩個屬性來判斷字元的大小寫：

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}