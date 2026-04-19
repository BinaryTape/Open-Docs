[//]: # (title: Kotlin 1.5.20 最新变化)

<web-summary>阅读 Kotlin 1.5.20 版本说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布于：2021 年 6 月 24 日](releases.md#release-history)_

Kotlin 1.5.20 修复了 1.5.0 新功能中发现的问题，并包含多项工具改进。

您可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)和此视频中找到更改概览：

<video src="https://www.youtube.com/v/SV8CgSXQe44" title="Kotlin 1.5.20"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## Kotlin/JVM

Kotlin 1.5.20 在 JVM 平台上获得了以下更新： 
* [通过 invokedynamic 进行字符串串联](#string-concatenation-via-invokedynamic)
* [支持 JSpecify 为 null 性注解](#support-for-jspecify-nullness-annotations)
* [支持在包含 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成的方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 通过 invokedynamic 进行字符串串联

Kotlin 1.5.20 在 JVM 9+ 目标上将字符串串联编译为[动态调用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic) (`invokedynamic`)，从而紧跟现代 Java 版本。更准确地说，它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 进行字符串串联。

要切换回以前版本中使用的通过 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-) 进行串联的方式，请添加编译器选项 `-Xstring-concat=inline`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven-kotlin-compiler.md#specify-compiler-options) 和[命令行编译器](compiler-reference.md#compiler-options)中添加编译器选项。

### 支持 JSpecify 为 null 性注解

Kotlin 编译器可以读取各种类型的[为 null 性注解](java-interop.md#nullability-annotations)，以便将为 null 性信息从 Java 传递给 Kotlin。1.5.20 版本引入了对 [JSpecify 项目](https://jspecify.dev/)的支持，该项目包含标准的统一 Java 为 null 性注解集。

通过 JSpecify，您可以提供更详细的为 null 性信息，以帮助 Kotlin 在与 Java 互操作时保持 null 安全。您可以为声明、软件包或模块范围设置默认为 null 性，指定参数化为 null 性等。您可以在 [JSpecify 用户指南](https://jspecify.dev/docs/user-guide)中找到有关此内容的更多详细信息。

以下是 Kotlin 处理 JSpecify 注解的示例：

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

在 1.5.20 中，根据 JSpecify 提供的为 null 性信息，所有为 null 性不匹配都会报告为警告。在使用 JSpecify 时，使用 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 编译器选项可启用严格模式（带有错误报告）。请注意，JSpecify 项目正处于活跃开发中。其 API 和实现随时可能发生重大变化。

[详细了解 null 安全和平台类型](java-interop.md#null-safety-and-platform-types)。

### 支持在包含 Kotlin 和 Java 代码的模块中调用 Java 的 Lombok 生成的方法

> Lombok 编译器插件是[实验性功能](components-stability.md)。它可能随时被丢弃或更改。请仅用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-7112) 中提供反馈。
>
{style="warning"}

Kotlin 1.5.20 引入了一个实验性的 [Lombok 编译器插件](lombok.md)。该插件使得在包含 Kotlin 和 Java 代码的模块中生成并使用 Java 的 [Lombok](https://projectlombok.org/) 声明成为可能。Lombok 注解仅在 Java 源代码中有效，如果在 Kotlin 代码中使用则会被忽略。

该插件支持以下注解：
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我们正在继续开发此插件。要了解详细的当前状态，请访问 [Lombok 编译器插件的 README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)。

目前，我们没有支持 `@Builder` 注解的计划。但是，如果您在 [YouTrack 中为 `@Builder` 投票](https://youtrack.jetbrains.com/issue/KT-46959)，我们会考虑这一点。

[了解如何配置 Lombok 编译器插件](lombok.md#gradle)。

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新功能预览和工具改进：

* [选择性地将 KDoc 注释导出到生成的 Objective-C 头文件](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [编译器错误修复](#compiler-bug-fixes)
* [提高了单个数组内部 Array.copyInto() 的性能](#improved-performance-of-array-copyinto-inside-one-array)

### 选择性地将 KDoc 注释导出到生成的 Objective-C 头文件

> 将 KDoc 注释导出到生成的 Objective-C 头文件的能力是[实验性功能](components-stability.md)。它可能随时被丢弃或更改。需要选择性启用（详见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-38600) 中提供反馈。
>
{style="warning"}

您现在可以设置 Kotlin/Native 编译器，将 [文档注释 (KDoc)](kotlin-doc.md) 从 Kotlin 代码导出到从中生成的 Objective-C 框架中，使其对框架的使用者可见。

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

这在 Swift 中也运行良好。

要尝试这种将 KDoc 注释导出到 Objective-C 头文件的能力，请使用 `-Xexport-kdoc` 编译器选项。在您想要导出注释的 Gradle 项目的 `build.gradle(.kts)` 中添加以下行：

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

如果您能使用此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-38600) 与我们分享您的反馈，我们将不胜感激。

### 编译器错误修复

Kotlin/Native 编译器在 1.5.20 中获得了多项错误修复。您可以在[更新日志](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20)中找到完整列表。

有一项影响兼容性的重要错误修复：在以前的版本中，包含不正确 UTF [代理对](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)的字符串常量在编译过程中会丢失其值。现在这些值将被保留。应用程序开发者可以安全地更新到 1.5.20 —— 不会发生破坏。但是，使用 1.5.20 编译的库与早期的编译器版本不兼容。详情请参阅[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-33175)。

### 提高了单个数组内部 Array.copyInto() 的性能

我们改进了当 `Array.copyInto()` 的源和目标是同一个数组时的运行方式。由于针对此用例的内存管理优化，此类操作的完成速度现在最高可提升 20 倍（取决于复制的对象数量）。

## Kotlin/JS

在 1.5.20 中，我们发布了一份指南，帮助您将项目迁移到新的 Kotlin/JS [基于 IR 的后端](js-ir-compiler.md)。

### JS IR 后端的迁移指南

新的 JS IR 后端迁移指南识别了您在迁移过程中可能遇到的问题，并为其提供了解决方案。如果您发现指南中未涵盖的任何问题，请将其报告到我们的[问题跟踪器](http://kotl.in/issue)。

## Gradle

Kotlin 1.5.20 引入了以下可以提升 Gradle 体验的功能：

* [kapt 中注解处理器类加载器的缓存](#caching-for-annotation-processors-classloaders-in-kapt)
* [弃用 `kotlin.parallel.tasks.in.project` 构建属性](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### kapt 中注解处理器类加载器的缓存

> kapt 中注解处理器类加载器的缓存是[实验性功能](components-stability.md)。它可能随时被丢弃或更改。请仅用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-28901) 中提供反馈。
>
{style="warning"}

现在有一项新的实验性功能，可以缓存 [kapt](kapt.md) 中注解处理器的类加载器。此功能可以提高连续 Gradle 运行中 kapt 的速度。

要启用此功能，请在您的 `gradle.properties` 文件中使用以下属性：

```none
# 正值将启用缓存
# 使用与使用 kapt 的模块数量相同的值
kapt.classloaders.cache.size=5

# 禁用此项以使缓存生效
kapt.include.compile.classpath=false
```

详细了解 [kapt](kapt.md)。

### 弃用 kotlin.parallel.tasks.in.project 构建属性

在此版本中，Kotlin 并行编译由 [Gradle 并行执行标志 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 控制。使用此标志，Gradle 会并发执行任务，从而提高编译任务的速度并更有效地利用资源。

您不再需要使用 `kotlin.parallel.tasks.in.project` 属性。该属性已被弃用，并将在下一个主要版本中移除。

## 标准库

Kotlin 1.5.20 更改了几个用于处理字符的函数的平台特定实现，从而实现了跨平台统一：
* [Kotlin/Native 和 Kotlin/JS 的 Char.digitToInt() 支持所有 Unicode 数字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js)。
* [跨平台统一 Char.isLowerCase()/isUpperCase() 实现](#unification-of-char-islowercase-isuppercase-implementations-across-platforms)。

### Kotlin/Native 和 Kotlin/JS 的 Char.digitToInt() 支持所有 Unicode 数字

[`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html) 返回字符所代表的十进制数字的数值。在 1.5.20 之前，该函数仅在 Kotlin/JVM 上支持所有 Unicode 数字字符：Native 和 JS 平台上的实现仅支持 ASCII 数字。

从现在起，在 Kotlin/Native 和 Kotlin/JS 中，您都可以在任何 Unicode 数字字符上调用 `Char.digitToInt()` 并获取其数值表示。

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

函数 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和 [`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html) 根据字符的大小写返回布尔值。对于 Kotlin/JVM，其实现会同时检查 `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` [Unicode 属性](https://en.wikipedia.org/wiki/Unicode_character_property)。

在 1.5.20 之前，其他平台的实现方式不同，仅考虑常规类别。在 1.5.20 中，各平台的实现已统一，并使用这两个属性来确定字符大小写：

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // 具有 "Lu" 常规类别
    val circledLatinCapitalA = 'Ⓐ' // 具有 "Other_Uppercase" 属性
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}