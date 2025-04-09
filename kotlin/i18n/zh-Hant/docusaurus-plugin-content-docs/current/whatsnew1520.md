---
title: "Kotlin 1.5.20 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[已發布：2021 年 6 月 24 日](releases#release-details)_

Kotlin 1.5.20 修復了在 1.5.0 新功能中發現的問題，並且還包含各種工具改進。

你可以在[發布部落格文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和此影片中找到變更的概述：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台上收到了以下更新：
* [透過 invokedynamic 進行字串串連](#string-concatenation-via-invokedynamic)
* [支援 JSpecify 空值註解](#support-for-jspecify-nullness-annotations)
* [支援在具有 Kotlin 和 Java 代碼的模組中呼叫 Java 的 Lombok 產生的方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 透過 invokedynamic 進行字串串連

Kotlin 1.5.20 將字串串連編譯為 JVM 9+ 目標上的[動態調用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`)，從而跟上現代 Java 版本。
更精確地說，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)
進行字串串連。

若要切換回透過 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 進行串連，該串連在先前的版本中使用，請新增編譯器選項 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和[命令行編譯器](compiler-reference#compiler-options)中新增編譯器選項。

### 支援 JSpecify 空值註解

Kotlin 編譯器可以讀取各種類型的[空值註解](java-interop#nullability-annotations)以將空值資訊從 Java 傳遞到 Kotlin。 1.5.20 版本引入了對 [JSpecify 專案](https://jspecify.dev/)的支援，
其中包括標準的統一 Java 空值註解集。

使用 JSpecify，你可以提供更詳細的空值資訊，以幫助 Kotlin 保持與 Java 之間的空值安全互操作。 你可以為宣告、套件或模組範圍設定預設空值，指定參數化空值等等。 你可以在 [JSpecify 使用者指南](https://jspecify.dev/docs/user-guide)中找到有關此的更多詳細資訊。

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

在 1.5.20 中，根據 JSpecify 提供的空值資訊的所有空值不符都會報告為警告。
使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 編譯器選項來啟用嚴格模式（具有錯誤報告）以使用 JSpecify。
請注意，JSpecify 專案正在積極開發中。 它的 API 和實作可以隨時發生重大變更。

[了解更多關於空值安全和平台類型](java-interop#null-safety-and-platform-types)。

### 支援在具有 Kotlin 和 Java 代碼的模組中呼叫 Java 的 Lombok 產生的方法

:::caution
Lombok 編譯器外掛程式是[實驗性的](components-stability)。
它可能會隨時被刪除或變更。 僅將其用於評估目的。
我們將感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 中對它的意見反應。

:::

Kotlin 1.5.20 引入了一個實驗性的 [Lombok 編譯器外掛程式](lombok)。 此外掛程式可以產生並在具有 Kotlin 和 Java 代碼的模組中使用 Java 的 [Lombok](https://projectlombok.org/) 宣告。 Lombok 註解僅在 Java 原始碼中有效，如果你在 Kotlin 代碼中使用它們，則會被忽略。

此外掛程式支援以下註解：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我們將繼續研究此外掛程式。 若要了解詳細的目前狀態，請造訪 [Lombok 編譯器外掛程式的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我們沒有計畫支援 `@Builder` 註解。 但是，如果你在 [YouTrack 中投票支援 `@Builder`](https://youtrack.jetbrains.com/issue/KT-46959)，我們可以考慮。

[了解如何設定 Lombok 編譯器外掛程式](lombok#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新功能和工具改進的預覽：

* [選擇性地將 KDoc 註解匯出到產生的 Objective-C 標頭](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [編譯器錯誤修復](#compiler-bug-fixes)
* [改進了 Array.copyInto() 在一個陣列內的效能](#improved-performance-of-array-copyinto-inside-one-array)

### 選擇性地將 KDoc 註解匯出到產生的 Objective-C 標頭

:::caution
將 KDoc 註解匯出到產生的 Objective-C 標頭的功能是[實驗性的](components-stability)。
它可能會隨時被刪除或變更。
需要選擇加入（請參閱下面的詳細資訊），並且你應僅將其用於評估目的。
我們將感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 中對它的意見反應。

:::

你現在可以設定 Kotlin/Native 編譯器以將 [文件註解 (KDoc)](kotlin-doc) 從 Kotlin 代碼匯出到從其產生的 Objective-C 框架，使其對框架的消費者可見。

例如，以下具有 KDoc 的 Kotlin 代碼：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

產生以下 Objective-C 標頭：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

這也適用於 Swift。

若要試用此將 KDoc 註解匯出到 Objective-C 標頭的功能，請使用 `-Xexport-kdoc` 編譯器選項。 將以下程式碼行新增到你要從中匯出註解的 Gradle 專案的 `build.gradle(.kts)` 中：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</TabItem>
</Tabs>

如果你使用此 [YouTrack 問題追蹤器](https://youtrack.jetbrains.com/issue/KT-38600) 與我們分享你的意見反應，我們將非常感激。

### 編譯器錯誤修復

Kotlin/Native 編譯器在 1.5.20 中收到了多個錯誤修復。 你可以在[變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)中找到完整的清單。

有一個重要的錯誤修復會影響相容性：在先前的版本中，包含不正確 UTF [代理配對](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates) 的字串常數在編譯期間會遺失其值。 現在保留了這些值。 應用程式開發人員可以安全地更新到 1.5.20 – 不會發生任何中斷。 但是，使用 1.5.20 編譯的函式庫與先前的編譯器版本不相容。
有關詳細資訊，請參閱 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-33175)。

### 改進了 Array.copyInto() 在一個陣列內的效能

我們改進了 `Array.copyInto()` 在其來源和目的地是同一陣列時的工作方式。 現在，由於此使用案例的記憶體管理最佳化，此類操作的完成速度提高了 20 倍（取決於複製的物件數量）。

## Kotlin/JS

使用 1.5.20，我們發布了一個指南，該指南將幫助你將專案遷移到 Kotlin/JS 的新 [基於 IR 的後端](js-ir-compiler)。

### JS IR 後端的遷移指南

新的 [JS IR 後端的遷移指南](js-ir-migration) 識別了你在遷移期間可能遇到的問題，並提供了這些問題的解決方案。 如果你發現指南中未涵蓋的任何問題，請將其報告給我們的 [問題追蹤器](http://kotl.in/issue)。

## Gradle

Kotlin 1.5.20 引入了以下可以改善 Gradle 體驗的功能：

* [kapt 中註解處理器類別載入器的快取](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` 建置屬性的棄用](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中註解處理器的類別載入器的快取

:::caution
kapt 中註解處理器類別載入器的快取是[實驗性的](components-stability)。
它可能會隨時被刪除或變更。 僅將其用於評估目的。
我們將感謝你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中對它的意見反應。

:::

現在有一個新的實驗性功能可以快取 [kapt](kapt) 中註解處理器的類別載入器。
此功能可以提高連續 Gradle 執行的 kapt 速度。

若要啟用此功能，請在你的 `gradle.properties` 檔案中使用以下屬性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

了解更多關於 [kapt](kapt)。

### `kotlin.parallel.tasks.in.project` 建置屬性的棄用

在此版本中，Kotlin 並行編譯由 [Gradle 並行執行標誌 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。
使用此標誌，Gradle 並行執行任務，從而提高了編譯任務的速度並更有效地利用了資源。

你不再需要使用 `kotlin.parallel.tasks.in.project` 屬性。 此屬性已被棄用，將在下一個主要版本中刪除。

## 標準函式庫

Kotlin 1.5.20 變更了多個用於處理字元的函數的平台特定實作，因此實現了跨平台的統一：
* [支援 Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 的所有 Unicode 數字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [統一了跨平台的 Char.isLowerCase()/isUpperCase() 實作](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### 支援 Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 的所有 Unicode 數字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 傳回字元表示的十進制數字的數值。 在 1.5.20 之前，該函數僅支援 Kotlin/JVM 的所有 Unicode 數字字元：Native 和 JS 平台上的實作僅支援 ASCII 數字。

從現在開始，使用 Kotlin/Native 和 Kotlin/JS，你可以在任何 Unicode 數字字元上呼叫 `Char.digitToInt()` 並取得其數值表示。

```kotlin
fun main() {

    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)

}
```

### 統一了跨平台的 Char.isLowerCase()/isUpperCase() 實作

函數 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和
[`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 根據字元的大小寫傳回布林值。 對於 Kotlin/JVM，該實作會檢查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 屬性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的實作以不同的方式工作，並且僅考慮一般類別。
在 1.5.20 中，實作在跨平台之間統一，並使用這兩個屬性來判斷字元大小寫：

```kotlin
fun main() {

    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())

}
```