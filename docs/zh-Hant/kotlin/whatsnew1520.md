[//]: # (title: Kotlin 1.5.20 的新功能)

_[發布日期：2021 年 6 月 24 日](releases.md#release-details)_

Kotlin 1.5.20 修正了在 1.5.0 新功能中發現的問題，同時也包含各種工具改進。

您可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和這段影片中找到變更的概覽：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台上有以下更新：
* [透過 invokedynamic 進行字串串接](#string-concatenation-via-invokedynamic)
* [支援 JSpecify nullability 註解](#support-for-jspecify-nullness-annotations)
* [支援在包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 產生方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 透過 invokedynamic 進行字串串接

Kotlin 1.5.20 在 JVM 9+ 目標上將字串串接編譯為[動態呼叫](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`)，從而與現代 Java 版本保持一致。
更精確地說，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 進行字串串接。

若要切換回先前版本中使用的透過 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 進行的串接，請新增編譯器選項 `-Xstring-concat=inline`。

瞭解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令列編譯器](compiler-reference.md#compiler-options)中新增編譯器選項。

### 支援 JSpecify nullability 註解

Kotlin 編譯器可以讀取各種類型的[nullability 註解](java-interop.md#nullability-annotations)，以將 nullability 資訊從 Java 傳遞給 Kotlin。1.5.20 版本引入了對 [JSpecify 專案](https://jspecify.dev/)的支援，該專案包含了一組標準統一的 Java nullness 註解。

透過 JSpecify，您可以提供更詳細的 nullability 資訊，幫助 Kotlin 維護與 Java 的 null 安全互通。您可以為宣告、套件或模組範圍設定預設 nullability，指定參數化 nullability 等。您可以在 [JSpecify 使用者指南](https://jspecify.dev/docs/user-guide)中找到更多詳細資訊。

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

在 1.5.20 中，所有根據 JSpecify 提供的 nullability 資訊判斷的 nullability 不符都將報告為警告。使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項可以在使用 JSpecify 時啟用嚴格模式（帶錯誤報告）。請注意，JSpecify 專案仍在積極開發中。其 API 和實作可能隨時發生重大變更。

[深入瞭解 null 安全和平台類型](java-interop.md#null-safety-and-platform-types)。

### 支援在包含 Kotlin 和 Java 程式碼的模組中呼叫 Java 的 Lombok 產生方法

> Lombok 編譯器外掛程式是[實驗性功能](components-stability.md)。
> 它可能隨時被移除或變更。僅供評估用途。
> 若您有任何回饋，請透過 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 告知我們。
>
{style="warning"}

Kotlin 1.5.20 引入了一個實驗性的 [Lombok 編譯器外掛程式](lombok.md)。這個外掛程式使得在包含 Kotlin 和 Java 程式碼的模組中產生和使用 Java 的 [Lombok](https://projectlombok.org/) 宣告成為可能。Lombok 註解僅在 Java 原始碼中有效，若在 Kotlin 程式碼中使用則會被忽略。

此外掛程式支援以下註解：
* `@Getter`、`@Setter`
* `@NoArgsConstructor`、`@RequiredArgsConstructor` 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們正在持續開發此外掛程式。要了解詳細的目前狀態，請造訪 [Lombok 編譯器外掛程式的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有支援 `@Builder` 註解的計畫。但是，如果您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46959) 中投票支持 `@Builder`，我們可以考慮。

[瞭解如何設定 Lombok 編譯器外掛程式](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供新功能和工具改進的預覽：

* [KDoc 註解選擇性匯出到產生後的 Objective-C 標頭檔](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [編譯器錯誤修正](#compiler-bug-fixes)
* [改善 Array.copyInto() 在同一陣列內部的效能](#improved-performance-of-array-copyinto-inside-one-array)

### KDoc 註解選擇性匯出到產生後的 Objective-C 標頭檔

> 將 KDoc 註解匯出到產生後的 Objective-C 標頭檔的功能是[實驗性功能](components-stability.md)。
> 它可能隨時被移除或變更。
> 需要選擇加入（詳情請見下文），且您僅應將其用於評估目的。
> 若您有任何回饋，請透過 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 告知我們。
>
{style="warning"}

您現在可以設定 Kotlin/Native 編譯器，將 Kotlin 程式碼中的[文件註解 (KDoc)](kotlin-doc.md) 匯出到從其產生的 Objective-C 框架，使其對框架的取用者可見。

例如，以下帶有 KDoc 的 Kotlin 程式碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

產生以下 Objective-C 標頭檔：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

這也適用於 Swift。

要嘗試將 KDoc 註解匯出到 Objective-C 標頭檔的功能，請使用 `-Xexport-kdoc` 編譯器選項。將以下行新增到您想要匯出註解的 Gradle 專案的 `build.gradle(.kts)` 中：

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

如果您能透過此 [YouTrack 問題單](https://youtrack.jetbrains.com/issue/KT-38600) 與我們分享您的回饋，我們將不勝感激。

### 編譯器錯誤修正

Kotlin/Native 編譯器在 1.5.20 中獲得了多項錯誤修正。您可以在[變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)中找到完整清單。

有一個重要的錯誤修正會影響相容性：在之前的版本中，包含不正確 UTF [代理對](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)的字串常數在編譯期間會遺失其值。現在這些值已得到保留。應用程式開發人員可以安全地更新到 1.5.20 – 不會造成任何問題。然而，使用 1.5.20 編譯的函式庫與早期編譯器版本不相容。請參閱[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-33175)以了解詳細資訊。

### 改善 Array.copyInto() 在同一陣列內部的效能

我們改進了 `Array.copyInto()` 在其來源和目的地為同一陣列時的工作方式。現在，由於此用例的記憶體管理最佳化，此類操作的完成速度提高了多達 20 倍（取決於複製的物件數量）。

## Kotlin/JS

隨著 1.5.20 的發布，我們正在發布一份指南，將協助您將專案遷移到適用於 Kotlin/JS 的新[基於 IR 的後端](js-ir-compiler.md)。

### JS IR 後端遷移指南

新的 [JS IR 後端遷移指南](js-ir-migration.md)指出了您在遷移過程中可能遇到的問題並提供了解決方案。如果您發現任何指南中未涵蓋的問題，請向我們的[問題追蹤器](http://kotl.in/issue)報告。

## Gradle

Kotlin 1.5.20 引入了以下功能，可以改善 Gradle 體驗：

* [kapt 中註解處理器類別載入器的快取](#caching-for-annotation-processors-classloaders-in-kapt)
* [kotlin.parallel.tasks.in.project 建置屬性的棄用](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中註解處理器類別載入器的快取

> kapt 中註解處理器類別載入器的快取是[實驗性功能](components-stability.md)。
> 它可能隨時被移除或變更。僅供評估用途。
> 若您有任何回饋，請透過 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 告知我們。
>
{style="warning"}

現在有一個新的實驗性功能，可以在 [kapt](kapt.md) 中快取註解處理器的類別載入器。此功能可以提高 kapt 在連續 Gradle 執行時的速度。

若要啟用此功能，請在您的 `gradle.properties` 檔案中使用以下屬性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

深入瞭解 [kapt](kapt.md)。

### kotlin.parallel.tasks.in.project 建置屬性的棄用

在此版本中，Kotlin 平行編譯由 [Gradle 平行執行旗標 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。使用此旗標，Gradle 可以並行執行任務，從而提高編譯任務的速度並更有效率地利用資源。

您不再需要使用 `kotlin.parallel.tasks.in.project` 屬性。此屬性已被棄用，並將在下一個主要版本中移除。

## 標準函式庫

Kotlin 1.5.20 變更了數個處理字元函式的平台特定實作，從而實現了跨平台的統一：
* [Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 支援所有 Unicode 數字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [Char.isLowerCase()/isUpperCase() 實作在跨平台上的統一](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 支援所有 Unicode 數字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 回傳字元所代表的十進位數字值。在 1.5.20 之前，此函式僅在 Kotlin/JVM 上支援所有 Unicode 數字字元：Native 和 JS 平台上的實作僅支援 ASCII 數字。

從現在起，無論是 Kotlin/Native 還是 Kotlin/JS，您都可以對任何 Unicode 數字字元呼叫 `Char.digitToInt()` 並取得其數值表示。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### Char.isLowerCase()/isUpperCase() 實作在跨平台上的統一

函式 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 根據字元的大小寫回傳布林值。對於 Kotlin/JVM，實作會檢查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` 這兩個 [Unicode 屬性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的實作方式不同，僅考慮一般類別。
在 1.5.20 中，實作在跨平台統一，並使用這兩個屬性來判斷字元的大小寫：

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