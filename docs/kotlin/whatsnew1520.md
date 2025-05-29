[//]: # (title: Kotlin 1.5.20 的新特性)

_[发布日期：24 June 2021](releases.md#release-details)_

Kotlin 1.5.20 修复了在 1.5.0 新特性中发现的问题，同时还包括了各种工具链改进。

你可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和此视频中找到更改概述：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台获得了以下更新：
* [通过 invokedynamic 进行字符串拼接](#string-concatenation-via-invokedynamic)
* [支持 JSpecify 可空性注解](#support-for-jspecify-nullness-annotations)
* [支持在包含 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 通过 invokedynamic 进行字符串拼接

Kotlin 1.5.20 将字符串拼接编译成 JVM 9+ 目标上的[动态调用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)（`invokedynamic`），从而跟上现代 Java 版本。
更确切地说，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 进行字符串拼接。

要切换回之前版本中使用的通过 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 进行的拼接，请添加编译器选项 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令行编译器](compiler-reference.md#compiler-options)中添加编译器选项。

### 支持 JSpecify 可空性注解

Kotlin 编译器可以读取各种类型的[可空性注解](java-interop.md#nullability-annotations)，以将可空性信息从 Java 传递到 Kotlin。1.5.20 版本引入了对 [JSpecify 项目](https://jspecify.dev/)的支持，该项目包含一套标准的统一 Java 可空性注解。

借助 JSpecify，你可以提供更详细的可空性信息，以帮助 Kotlin 保持与 Java 互操作的空安全。你可以为声明、包或模块范围设置默认可空性，指定参数化可空性等等。你可以在 [JSpecify 用户指南](https://jspecify.dev/docs/user-guide)中找到更多详细信息。

以下是 Kotlin 如何处理 JSpecify 注解的示例：

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

在 1.5.20 中，根据 JSpecify 提供的可空性信息报告的所有可空性不匹配都将作为警告。
使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 编译器选项可在使用 JSpecify 时启用严格模式（带错误报告）。
请注意，JSpecify 项目正在积极开发中。其 API 和实现可能随时发生重大变化。

[了解更多关于空安全和平台类型](java-interop.md#null-safety-and-platform-types)。

### 支持在包含 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成方法

> Lombok 编译器插件是[实验性的](components-stability.md)。
> 它可能随时被取消或更改。仅将其用于评估目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 上提供反馈。
>
{style="warning"}

Kotlin 1.5.20 引入了一个实验性的 [Lombok 编译器插件](lombok.md)。该插件使得在包含 Kotlin 和 Java 代码的模块中生成和使用 Java 的 [Lombok](https://projectlombok.org/) 声明成为可能。Lombok 注解仅在 Java 源码中有效，如果你在 Kotlin 代码中使用它们，则会被忽略。

该插件支持以下注解：
* `@Getter`、`@Setter`
* `@NoArgsConstructor`、`@RequiredArgsConstructor` 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我们正在继续开发此插件。要了解详细的当前状态，请访问 [Lombok 编译器插件的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我们没有支持 `@Builder` 注解的计划。但是，如果你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-46959) 中投票支持 `@Builder`，我们可以考虑。

[了解如何配置 Lombok 编译器插件](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新特性和工具链改进的预览：

* [（选择性启用）将 KDoc 注释导出到生成的 Objective-C 头文件](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [编译器错误修复](#compiler-bug-fixes)
* [改进同一数组内 Array.copyInto() 的性能](#improved-performance-of-array-copyinto-inside-one-array)

### （选择性启用）将 KDoc 注释导出到生成的 Objective-C 头文件

> 将 KDoc 注释导出到生成的 Objective-C 头文件的能力是[实验性的](components-stability.md)。
> 它可能随时被取消或更改。
> 需要选择性启用（详见下文），并且你应仅将其用于评估目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 上提供反馈。
>
{style="warning"}

现在你可以将 Kotlin/Native 编译器设置为将 Kotlin 代码中的[文档注释 (KDoc)](kotlin-doc.md) 导出到从其生成的 Objective-C 框架中，使其对框架的消费者可见。

例如，以下带有 KDoc 的 Kotlin 代码：

```kotlin
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

会生成以下 Objective-C 头文件：

```objc
/**
 * Prints the sum of the arguments.
 * Properly handles the case when the sum doesn't fit in 32-bit integer.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

这也适用于 Swift。

要尝试将 KDoc 注释导出到 Objective-C 头文件的功能，请使用 `-Xexport-kdoc` 编译器选项。将以下行添加到你要导出注释的 Gradle 项目的 `build.gradle(.kts)` 中：

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

如果您能通过此 [YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-38600)与我们分享您的反馈，我们将不胜感激。

### 编译器错误修复

Kotlin/Native 编译器在 1.5.20 中收到了多项错误修复。你可以在[更新日志](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)中找到完整列表。

有一个重要的错误修复会影响兼容性：在以前的版本中，包含不正确 UTF [代理对](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)的字符串常量在编译期间会丢失其值。现在这些值被保留下来。应用程序开发者可以安全地更新到 1.5.20——不会有任何破坏。然而，使用 1.5.20 编译的库与早期编译器版本不兼容。
有关详细信息，请参阅[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-33175)。

### 改进同一数组内 Array.copyInto() 的性能

我们改进了 `Array.copyInto()` 在其源和目标是同一个数组时的工作方式。现在，由于对此用例进行了内存管理优化，此类操作的完成速度提高了多达 20 倍（取决于复制的对象数量）。

## Kotlin/JS

在 1.5.20 中，我们发布了一份指南，它将帮助你将项目迁移到 Kotlin/JS 的新[基于 IR 的后端](js-ir-compiler.md)。

### JS IR 后端迁移指南

新的 [JS IR 后端迁移指南](js-ir-migration.md)指出了你在迁移过程中可能遇到的问题，并提供了解决方案。如果你发现指南中未涵盖的任何问题，请向我们的[问题跟踪器](http://kotl.in/issue)报告。

## Gradle

Kotlin 1.5.20 引入了以下可以改善 Gradle 体验的特性：

* [kapt 中注解处理器类加载器的缓存](#caching-for-annotation-processors-classloaders-in-kapt)
* [弃用 `kotlin.parallel.tasks.in.project` 构建属性](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中注解处理器类加载器的缓存

> kapt 中注解处理器类加载器的缓存是[实验性的](components-stability.md)。
> 它可能随时被取消或更改。仅将其用于评估目的。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 上提供反馈。
>
{style="warning"}

现在有一个新的实验性特性，可以缓存 [kapt](kapt.md) 中注解处理器的类加载器。
此特性可以提高连续 Gradle 运行中 kapt 的速度。

要启用此特性，请在 `gradle.properties` 文件中使用以下属性：

```none
# positive value will enable caching
# use the same value as the number of modules that use kapt
kapt.classloaders.cache.size=5

# disable for caching to work
kapt.include.compile.classpath=false
```

了解更多关于 [kapt](kapt.md) 的信息。

### 弃用 `kotlin.parallel.tasks.in.project` 构建属性

在此版本中，Kotlin 并行编译由 [Gradle 并行执行标志 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。
使用此标志，Gradle 会并发执行任务，从而提高编译任务的速度并更有效地利用资源。

你不再需要使用 `kotlin.parallel.tasks.in.project` 属性。此属性已被弃用，并将在下一个主要版本中移除。

## 标准库

Kotlin 1.5.20 更改了几个处理字符的函数的平台特定实现，从而实现了跨平台的统一：
* [Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 对所有 Unicode 数字的支持](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [跨平台统一 Char.isLowerCase()/isUpperCase() 实现](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native 和 Kotlin/JS 中 Char.digitToInt() 对所有 Unicode 数字的支持

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 返回字符所表示的十进制数字的数值。在 1.5.20 之前，该函数仅支持 Kotlin/JVM 的所有 Unicode 数字字符：Native 和 JS 平台上的实现仅支持 ASCII 数字。

从现在开始，无论在 Kotlin/Native 还是 Kotlin/JS 中，你都可以在任何 Unicode 数字字符上调用 `Char.digitToInt()` 并获取其数字表示。

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // ARABIC-INDIC DIGIT ONE + DIGIT NINE
    println(ten)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

### 跨平台统一 Char.isLowerCase()/isUpperCase() 实现

函数 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和
[`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 返回一个布尔值，取决于字符的大小写。对于 Kotlin/JVM，其实现会同时检查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 属性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台上的实现方式不同，只考虑通用类别。
在 1.5.20 中，各平台上的实现已统一，并使用这两个属性来确定字符的大小写：

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