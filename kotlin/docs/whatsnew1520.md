---
title: "Kotlin 1.5.20 中的新增功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2021 年 6 月 24 日](releases#release-details)_

Kotlin 1.5.20 修复了在 1.5.0 新特性中发现的问题，并且还包含各种工具改进。

你可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和此视频中找到更改的概述：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台接收以下更新：
* [通过 invokedynamic 进行字符串连接](#string-concatenation-via-invokedynamic)
* [支持 JSpecify 空值注解](#support-for-jspecify-nullness-annotations)
* [支持在具有 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 通过 invokedynamic 进行字符串连接

Kotlin 1.5.20 将字符串连接编译为 JVM 9+ 目标上的[动态调用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)（`invokedynamic`），从而与现代 Java 版本保持同步。更准确地说，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...) 进行字符串连接。

要切换回通过以前版本中使用的 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 进行的连接，请添加编译器选项 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和[命令行编译器](compiler-reference#compiler-options)中添加编译器选项。

### 支持 JSpecify 空值注解

Kotlin 编译器可以读取各种类型的[可空性注解](java-interop#nullability-annotations)，以将可空性信息从 Java 传递到 Kotlin。1.5.20 版本引入了对 [JSpecify 项目](https://jspecify.dev/)的支持，其中包括 Java 空值注解的标准统一集。

借助 JSpecify，你可以提供更详细的可空性信息，以帮助 Kotlin 保持与 Java 的空安全互操作。你可以为声明、包或模块范围设置默认可空性，指定参数化可空性等等。你可以在 [JSpecify 用户指南](https://jspecify.dev/docs/user-guide) 中找到有关此的更多详细信息。

这是一个 Kotlin 如何处理 JSpecify 注解的示例：

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

在 1.5.20 中，根据 JSpecify 提供的可空性信息，所有可空性不匹配都报告为警告。使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 编译器选项在使用 JSpecify 时启用严格模式（带有错误报告）。请注意，JSpecify 项目正在积极开发中。其 API 和实现可能随时发生重大变化。

[了解有关空安全和平台类型的更多信息](java-interop#null-safety-and-platform-types)。

### 支持在具有 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成方法

:::caution
Lombok 编译器插件是 [Experimental（实验性的）](components-stability)。
它可能随时被删除或更改。 仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 中对此的反馈。

:::

Kotlin 1.5.20 引入了一个实验性的 [Lombok 编译器插件](lombok)。 此插件使生成和使用 Java 的 [Lombok](https://projectlombok.org/) 声明成为可能，这些声明位于具有 Kotlin 和 Java 代码的模块中。 Lombok 注解仅在 Java 源代码中有效，如果在 Kotlin 代码中使用它们，则会被忽略。

该插件支持以下注解：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我们正在继续开发此插件。 要了解详细的当前状态，请访问 [Lombok 编译器插件的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我们没有计划支持 `@Builder` 注解。 但是，如果你在 [YouTrack 中为 `@Builder`](https://youtrack.jetbrains.com/issue/KT-46959) 投票，我们可以考虑这一点。

[了解如何配置 Lombok 编译器插件](lombok#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新特性和工具改进的预览：

* [选择性导出 KDoc 注释到生成的 Objective-C 标头](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [编译器错误修复](#compiler-bug-fixes)
* [改进 Array.copyInto() 在一个数组中的性能](#improved-performance-of-array-copyinto-inside-one-array)

### 选择性导出 KDoc 注释到生成的 Objective-C 标头

:::caution
将 KDoc 注释导出到生成的 Objective-C 标头的功能是 [Experimental（实验性的）](components-stability)。
它可能随时被删除或更改。
需要选择加入（请参阅下面的详细信息），并且你应仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 中对此的反馈。

:::

你现在可以设置 Kotlin/Native 编译器以将 [文档注释 (KDoc)](kotlin-doc) 从 Kotlin 代码导出到从中生成的 Objective-C 框架，从而使框架的使用者可以看到它们。

例如，以下带有 KDoc 的 Kotlin 代码：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

生成以下 Objective-C 标头：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

这也适用于 Swift。

要试用此将 KDoc 注释导出到 Objective-C 标头的功能，请使用 `-Xexport-kdoc` 编译器选项。 将以下行添加到要从中导出注释的 Gradle 项目的 `build.gradle(.kts)` 中：

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

如果你使用此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-38600) 与我们分享你的反馈，我们将不胜感激。

### 编译器错误修复

Kotlin/Native 编译器在 1.5.20 中收到了多个错误修复。 你可以在 [changelog](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20) 中找到完整列表。

有一个重要的错误修复会影响兼容性：在以前的版本中，包含不正确的 UTF [代理项对](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)的字符串常量在编译期间会丢失其值。 现在保留此类值。 应用程序开发人员可以安全地更新到 1.5.20 – 不会发生任何中断。 但是，使用 1.5.20 编译的库与早期编译器版本不兼容。 有关详细信息，请参见 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-33175)。

### 改进 Array.copyInto() 在一个数组中的性能

我们改进了当 `Array.copyInto()` 的源和目标是同一个数组时的工作方式。 现在，由于此用例的内存管理优化，此类操作的完成速度提高了 20 倍（具体取决于要复制的对象数量）。

## Kotlin/JS

使用 1.5.20，我们发布了一个指南，该指南将帮助你将项目迁移到 Kotlin/JS 的新 [基于 IR 的后端](js-ir-compiler)。

### JS IR 后端的迁移指南

新的 [JS IR 后端的迁移指南](js-ir-migration) 确定了你在迁移过程中可能遇到的问题，并提供了解决方案。 如果你发现指南中未涵盖的任何问题，请将其报告给我们的 [问题跟踪器](http://kotl.in/issue)。

## Gradle

Kotlin 1.5.20 引入了以下可以改善 Gradle 体验的功能：

* [kapt 中注解处理器类加载器的缓存](#caching-for-annotation-processors-classloaders-in-kapt)
* [`kotlin.parallel.tasks.in.project` 构建属性的弃用](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中注解处理器类加载器的缓存

:::caution
kapt 中注解处理器类加载器的缓存是 [Experimental（实验性的）](components-stability)。
它可能随时被删除或更改。 仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中对此的反馈。

:::

现在有一个新的实验性功能，可以缓存 [kapt](kapt) 中注解处理器的类加载器。 此功能可以提高 kapt 对于连续 Gradle 运行的速度。

要启用此功能，请在你的 `gradle.properties` 文件中使用以下属性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

了解有关 [kapt](kapt) 的更多信息。

### kotlin.parallel.tasks.in.project 构建属性的弃用

在此版本中，Kotlin 并行编译由 [Gradle 并行执行标志 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。 使用此标志，Gradle 并发执行任务，从而提高编译任务的速度并更有效地利用资源。

你不再需要使用 `kotlin.parallel.tasks.in.project` 属性。 此属性已被弃用，将在下一个主要版本中删除。

## 标准库

Kotlin 1.5.20 更改了多个用于处理字符的函数的平台特定实现，并因此带来了跨平台的统一：
* [在 Kotlin/Native 和 Kotlin/JS 中支持 Char.digitToInt() 中的所有 Unicode 数字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [统一跨平台的 Char.isLowerCase()/isUpperCase() 实现](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### 在 Kotlin/Native 和 Kotlin/JS 中支持 Char.digitToInt() 中的所有 Unicode 数字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 返回字符表示的十进制数字的数值。 在 1.5.20 之前，该函数仅对 Kotlin/JVM 支持所有 Unicode 数字字符：Native 和 JS 平台上的实现仅支持 ASCII 数字。

从现在开始，在 Kotlin/Native 和 Kotlin/JS 中，你都可以在任何 Unicode 数字字符上调用 `Char.digitToInt()` 并获得其数值表示形式。

```kotlin
fun main() {

    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)

}
```

### 统一跨平台的 Char.isLowerCase()/isUpperCase() 实现

函数 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 返回一个布尔值，具体取决于字符的大小写。 对于 Kotlin/JVM，该实现检查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 属性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的实现方式有所不同，并且仅考虑了一般类别。 在 1.5.20 中，实现跨平台统一，并使用这两个属性来确定字符大小写：

```kotlin
fun main() {

    val latinCapitalA = 'A' // has "Lu" general category
    val circledLatinCapitalA = 'Ⓐ' // has "Other_Uppercase" property
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())

}
```