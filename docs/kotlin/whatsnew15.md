[//]: # (title: Kotlin 1.5.0 新特性)

_[发布时间：2021 年 5 月 5 日](releases.md#release-details)_

Kotlin 1.5.0 引入了新的语言特性、稳定的基于 IR 的 JVM 编译器后端、性能改进以及演进性变更，例如稳定实验性特性和弃用过时特性。

你还可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)中找到这些变更的概述。

## 语言特性

Kotlin 1.5.0 带来了在 [1.4.30 中预览](whatsnew1430.md#language-features)的新语言特性的稳定版本：
* [JVM 记录支持](#jvm-records-support)
* [密封接口](#sealed-interfaces)和[密封类改进](#package-wide-sealed-class-hierarchies)
* [内联类](#inline-classes)

这些特性的详细描述可在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)和 Kotlin 文档的相应页面中找到。

### JVM 记录支持

Java 发展迅速，为确保 Kotlin 与其保持互操作性，我们引入了对其最新特性之一——[记录类](https://openjdk.java.net/jeps/395)——的支持。

Kotlin 对 JVM 记录的支持包括双向互操作性：
* 在 Kotlin 代码中，你可以像使用普通类和属性一样使用 Java 记录类。
* 要在 Java 代码中将 Kotlin 类用作记录，请将其设为 `data` 类并用 `@JvmRecord` 注解标记它。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[了解更多关于在 Kotlin 中使用 JVM 记录](jvm-records.md)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### 密封接口

Kotlin 接口现在可以拥有 `sealed` 修饰符，其作用于接口的方式与作用于类的方式相同：密封接口的所有实现都在编译时可知。

```kotlin
sealed interface Polygon
```

你可以依赖这一事实，例如，编写详尽的 `when` 表达式。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle -> // ...
   is Triangle -> // ...
   // else is not needed - all possible implementations are covered
}

```

此外，密封接口允许更灵活的受限类层级结构，因为一个类可以直接继承多个密封接口。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[了解更多关于密封接口](sealed-classes.md)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### 包范围的密封类层级结构

密封类现在可以在同一编译单元和同一包内的所有文件中拥有子类。以前，所有子类都必须出现在同一文件中。

直接子类可以是顶层的，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。

密封类的子类必须具有完整限定名——它们不能是局部或匿名对象。

[了解更多关于密封类层级结构](sealed-classes.md#inheritance)。

### 内联类

内联类是[基于值](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md)的类的子集，它们只保存值。你可以将它们用作特定类型值的包装器，而不会带来额外的内存分配开销。

内联类可以在类名前使用 `value` 修饰符声明：

```kotlin
value class Password(val s: String)
```

JVM 后端还需要一个特殊的 `@JvmInline` 注解：

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` 修饰符现在已弃用并发出警告。

[了解更多关于内联类](inline-classes.md)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM 获得了多项内部和面向用户的改进。其中最值得关注的是：

* [稳定的 JVM IR 后端](#stable-jvm-ir-backend)
* [新的默认 JVM 目标版本：1.8](#new-default-jvm-target-1-8)
* [通过 invokedynamic 实现 SAM 适配器](#sam-adapters-via-invokedynamic)
* [通过 invokedynamic 实现 Lambda 表达式](#lambdas-via-invokedynamic)
* [弃用 @JvmDefault 和旧的 Xjvm-default 模式](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [处理可空性注解的改进](#improvements-to-handling-nullability-annotations)

### 稳定的 JVM IR 后端

Kotlin/JVM 编译器的[基于 IR 的后端](whatsnew14.md#new-jvm-ir-backend)现在已[稳定](components-stability.md)，并默认启用。

从 [Kotlin 1.4.0](whatsnew14.md) 开始，早期版本的基于 IR 的后端可供预览，现在它已成为语言版本 `1.5` 的默认设置。旧的后端默认仍用于更早的语言版本。

你可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中找到有关 IR 后端优势及其未来发展的更多详细信息。

如果你需要在 Kotlin 1.5.0 中使用旧的后端，可以将以下行添加到项目的配置文件中：

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

### 新的默认 JVM 目标版本：1.8

Kotlin/JVM 编译的默认目标版本现在是 `1.8`。`1.6` 目标版本已弃用。

如果你需要为 JVM 1.6 构建，你仍然可以切换到此目标版本。了解如何操作：

* [在 Gradle 中](gradle-compiler-options.md#attributes-specific-to-jvm)
* [在 Maven 中](maven.md#attributes-specific-to-jvm)
* [在命令行编译器中](compiler-reference.md#jvm-target-version)

### 通过 invokedynamic 实现 SAM 适配器

Kotlin 1.5.0 现在使用动态调用 (`invokedynamic`) 来编译 SAM (Single Abstract Method) 转换：
* 如果 SAM 类型是 [Java 接口](java-interop.md#sam-conversions)，则对任何表达式进行转换
* 如果 SAM 类型是 [Kotlin 函数式接口](fun-interfaces.md#sam-conversions)，则对 lambda 表达式进行转换

新的实现使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)，编译期间不再生成辅助包装类。这减小了应用程序 JAR 的大小，从而提高了 JVM 启动性能。

要回滚到基于匿名类生成的旧实现方案，请添加编译器选项 `-Xsam-conversions=class`。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令行编译器](compiler-reference.md#compiler-options)中添加编译器选项。

### 通过 invokedynamic 实现 Lambda 表达式

> 将普通的 Kotlin lambda 表达式编译为 invokedynamic 是[实验性](components-stability.md)功能。它可能随时被取消或更改。
> 需要选择启用（详情见下文），并且你应仅将其用于评估目的。我们非常感谢你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375) 中提供反馈。
>
{style="warning"}

Kotlin 1.5.0 引入了将普通的 Kotlin lambda 表达式（未转换为函数式接口实例的）编译为动态调用 (`invokedynamic`) 的实验性支持。该实现通过使用
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-) 生成更轻量级的二进制文件，它有效地在运行时生成所需的类。目前，与普通 lambda 编译相比，它有三个限制：

* 编译为 invokedynamic 的 lambda 表达式不可序列化。
* 对此类 lambda 表达式调用 `toString()` 会产生可读性较差的字符串表示。
* 实验性 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支持使用 `LambdaMetafactory` 创建的 lambda 表达式。

要尝试此功能，请添加 `-Xlambdas=indy` 编译器选项。如果你能通过此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-45375)分享你的反馈，我们将不胜感激。

了解如何在 [Gradle](gradle-compiler-options.md)、[Maven](maven.md#specify-compiler-options) 和[命令行编译器](compiler-reference.md#compiler-options)中添加编译器选项。

### 弃用 @JvmDefault 和旧的 Xjvm-default 模式

在 Kotlin 1.4.0 之前，有 `@JvmDefault` 注解以及 `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility` 模式。它们用于为 Kotlin 接口中的任何特定非抽象成员创建 JVM 默认方法。

在 Kotlin 1.4.0 中，我们[引入了新的 `Xjvm-default` 模式](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)，这些模式为整个项目启用了默认方法生成。

在 Kotlin 1.5.0 中，我们正在弃用 `@JvmDefault` 和旧的 Xjvm-default 模式：`-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`。

[了解更多关于 Java 互操作中的默认方法](java-to-kotlin-interop.md#default-methods-in-interfaces)。

### 处理可空性注解的改进

Kotlin 支持使用[可空性注解](java-interop.md#nullability-annotations)处理来自 Java 的类型可空性信息。Kotlin 1.5.0 为此功能引入了多项改进：

* 它读取作为依赖项使用的已编译 Java 库中类型参数上的可空性注解。
* 它支持带有 `TYPE_USE` 目标的可空性注解，适用于：
  * 数组
  * 变长参数 (Varargs)
  * 字段
  * 类型参数及其界限
  * 基类和接口的类型参数
* 如果可空性注解有多个适用于类型的目标，并且其中一个目标是 `TYPE_USE`，则优先选择 `TYPE_USE`。例如，如果 `@Nullable` 同时支持 `TYPE_USE` 和 `METHOD` 作为目标，则方法签名 `@Nullable String[] f()` 变为 `fun f(): Array<String?>!`。

对于这些新支持的情况，从 Kotlin 调用 Java 时使用错误的类型可空性会产生警告。
使用 `-Xtype-enhancement-improvements-strict-mode` 编译器选项可为这些情况启用严格模式（并报告错误）。

[了解更多关于空安全和平台类型](java-interop.md#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Native 现在性能更高且更稳定。值得关注的变更是：
* [性能改进](#performance-improvements)
* [内存泄漏检查器停用](#deactivation-of-the-memory-leak-checker)

### 性能改进

在 1.5.0 中，Kotlin/Native 获得了一系列性能改进，加快了编译和执行速度。

[编译器缓存](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)现在在调试模式下支持 `linuxX64`（仅在 Linux 主机上）和 `iosArm64` 目标平台。启用编译器缓存后，大多数调试编译完成得更快，除了第一次。测量结果显示，在我们的测试项目中速度提升了约 200%。

要为新目标使用编译器缓存，请通过将以下行添加到项目的 `gradle.properties` 来选择启用：
* 对于 `linuxX64`：`kotlin.native.cacheKind.linuxX64=static`
* 对于 `iosArm64`：`kotlin.native.cacheKind.iosArm64=static`

如果在启用编译器缓存后遇到任何问题，请向我们的问题追踪器 [YouTrack](https://kotl.in/issue) 报告。

其他改进加快了 Kotlin/Native 代码的执行速度：
* 简单的属性访问器被内联。
* 字符串字面量上的 `trimIndent()` 在编译期间求值。

### 内存泄漏检查器停用

内置的 Kotlin/Native 内存泄漏检查器已默认禁用。

它最初是为内部使用而设计的，并且只能在有限的情况下（并非所有情况）发现泄漏。此外，后来发现它存在可能导致应用程序崩溃的问题。因此，我们决定关闭内存泄漏检查器。

内存泄漏检查器在某些情况下仍然有用，例如单元测试。对于这些情况，你可以通过添加以下代码行来启用它：

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

请注意，不建议为应用程序运行时启用该检查器。

## Kotlin/JS

Kotlin/JS 在 1.5.0 中获得了一些演进性变更。我们正在继续将 [JS IR 编译器后端](js-ir-compiler.md)推向稳定并发布其他更新：

* [升级 webpack 到版本 5](#upgrade-to-webpack-5)
* [IR 编译器的框架和库](#frameworks-and-libraries-for-the-ir-compiler)

### 升级 webpack 到版本 5

Kotlin/JS Gradle 插件现在对浏览器目标使用 webpack 5，而不是 webpack 4。这是一次重要的 webpack 升级，带来了不兼容的变更。如果你正在使用自定义 webpack 配置，请务必查看 [webpack 5 发布说明](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)。

[了解更多关于使用 webpack 打包 Kotlin/JS 项目](js-project-setup.md#webpack-bundling)。

### IR 编译器的框架和库

> Kotlin/JS IR 编译器处于 [Alpha 版](components-stability.md)。它将来可能会发生不兼容变更并需要手动迁移。我们非常感谢你能在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

在开发基于 IR 的 Kotlin/JS 编译器后端的同时，我们也鼓励并帮助库作者以 `both` 模式构建他们的项目。这意味着他们能够为两种 Kotlin/JS 编译器生成 artifact，从而扩大新编译器的生态系统。

许多知名框架和库已经可用于 IR 后端：[KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、
[doodle](https://github.com/nacular/doodle) 等。如果你在项目中使用它们，你已经可以使用 IR 后端构建并体验它带来的好处。

如果你正在编写自己的库，请[以 'both' 模式编译它](js-ir-compiler.md#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)，以便你的客户端也能使用新编译器。

## Kotlin 多平台

在 Kotlin 1.5.0 中，[简化了为每个平台选择测试依赖项的过程](#simplified-test-dependencies-usage-in-multiplatform-projects)，现在由 Gradle 插件自动完成。

现在多平台项目中提供了[获取字符类别的新 API](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 标准库

标准库获得了一系列变更和改进，从稳定实验性部分到添加新特性：

* [稳定的无符号整型](#stable-unsigned-integer-types)
* [稳定的与区域设置无关的文本大小写转换 API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [稳定的字符到整数转换 API](#stable-char-to-integer-conversion-api)
* [稳定的 Path API](#stable-path-api)
* [向下取整除法和取模运算符](#floored-division-and-the-mod-operator)
* [Duration API 变更](#duration-api-changes)
* [现在多平台代码中提供了获取字符类别的新 API](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新的集合函数 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean() 的严格版本](#strict-version-of-string-toboolean)

你可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released)中了解更多关于标准库的变更。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 稳定的无符号整型

`UInt`、`ULong`、`UByte`、`UShort` 无符号整型现在已[稳定](components-stability.md)。这些类型上的操作、它们的范围和数列也已稳定。无符号数组及其操作仍处于 Beta 版。

[了解更多关于无符号整型](unsigned-integer-types.md)。

### 稳定的与区域设置无关的文本大小写转换 API

此版本带来了新的与区域设置无关的文本大小写转换 API。它提供了 `toLowerCase()`、`toUpperCase()`、`capitalize()` 和 `decapitalize()` 等 API 函数的替代方案，这些函数是区域设置敏感的。新的 API 可帮助你避免因不同区域设置而导致的错误。

Kotlin 1.5.0 提供了以下完全[稳定](components-stability.md)的替代方案：

* 对于 `String` 函数：

  |**早期版本**|**1.5.0 替代方案**|
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 对于 `Char` 函数：

  |**早期版本**|**1.5.0 替代方案**|
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 对于 Kotlin/JVM，还有带有显式 `Locale` 参数的重载 `uppercase()`、`lowercase()` 和 `titlecase()` 函数。
>
{style="note"}

旧的 API 函数已标记为弃用，并将在未来版本中移除。

有关文本处理函数的所有变更列表，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions.md)。

### 稳定的字符到整数转换 API

从 Kotlin 1.5.0 开始，新的字符到编码和字符到数字转换函数已[稳定](components-stability.md)。这些函数取代了当前的 API 函数，后者经常与类似的字符串到 Int 转换混淆。

新的 API 消除了这种命名混淆，使代码行为更透明、更明确。

此版本引入了 `Char` 转换，分为以下几组命名清晰的函数：

* 用于获取 `Char` 的整数编码并从给定编码构造 `Char` 的函数：

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* 用于将 `Char` 转换为其所代表的数字值的函数：

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* 一个用于 `Int` 的扩展函数，用于将其所代表的非负单数字转换为相应的 `Char` 表示：

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

旧的转换 API，包括 `Number.toChar()` 及其实现（除了 `Int.toChar()` 的所有实现）以及用于转换为数字类型的 `Char` 扩展（如 `Char.toInt()`）现在已弃用。

[了解更多关于 KEEP 中的字符到整数转换 API](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)。

### 稳定的 Path API

对 `java.nio.file.Path` 的[实验性 Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/) 扩展现在已[稳定](components-stability.md)。

```kotlin
// 使用除法 (/) 运算符构造路径
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// 列出目录中的文件
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[了解更多关于 Path API](whatsnew1420.md#extensions-for-java-nio-file-path)。

### 向下取整除法和取模运算符

标准库中添加了新的模运算操作：
* `floorDiv()` 返回[向下取整除法](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)的结果。它适用于整型。
* `mod()` 返回向下取整除法的余数（模数）。它适用于所有数值类型。

这些操作与现有的[整型除法](numbers.md#operations-on-numbers)和 [`rem()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html) 函数（或 `%` 运算符）看起来非常相似，但它们在负数上的工作方式不同：
* `a.floorDiv(b)` 与常规的 `/` 不同之处在于，`floorDiv` 将结果向下取整（朝向较小的整数），而 `/` 将结果截断为更接近 0 的整数。
* `a.mod(b)` 是 `a` 和 `a.floorDiv(b) * b` 之间的差值。它要么为零，要么与 `b` 具有相同的符号，而 `a % b` 可以具有不同的符号。

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

### Duration API 变更

> Duration API 是[实验性](components-stability.md)功能。它可能随时被取消或更改。
> 仅将其用于评估目的。我们非常感谢你能在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 中提供反馈。
>
{style="warning"}

有一个实验性的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类，用于表示不同时间单位的时长。在 1.5.0 中，Duration API 获得了以下变更：

* 内部值表示现在使用 `Long` 而不是 `Double` 以提供更好的精度。
* 有一个新的 API 用于将时长转换为特定 `Long` 类型的时间单位。它取代了旧的 API，后者使用 `Double` 值操作并且现在已弃用。例如，[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html) 返回以 `Long` 表示的时长值，并取代了 `Duration.inMinutes`。
* 有新的伴生函数用于从数字构造 `Duration`。例如，[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html) 创建一个表示整数秒数的 `Duration` 对象。旧的扩展属性（如 `Int.seconds`）现在已弃用。

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

### 现在多平台代码中提供了获取字符类别的新 API

Kotlin 1.5.0 引入了新的 API，用于在多平台项目中根据 Unicode 获取字符的类别。
现在所有平台和通用代码中都提供了多个函数。

用于检查字符是否为字母或数字的函数：
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

用于检查字符大小写的函数：
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

其他一些函数：
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

[`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) 属性及其返回类型枚举类 [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)（指示字符在 Unicode 中的通用类别）现在也可用于多平台项目。

[了解更多关于字符](characters.md)。

### 新的集合函数 firstNotNullOf()

新的 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 和 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
函数将 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 与 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 结合起来。
它们使用自定义选择器函数映射原始集合并返回第一个非空值。如果没有这样的值，`firstNotNullOf()` 会抛出异常，而 `firstNotNullOfOrNull()` 返回 null。

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

### String?.toBoolean() 的严格版本

两个新函数引入了现有 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html) 的区分大小写的严格版本：
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html) 对于除字面量 `true` 和 `false` 以外的所有输入都抛出异常。
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html) 对于除字面量 `true` 和 `false` 以外的所有输入都返回 null。

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

## kotlin-test 库
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 库引入了一些新特性：
* [简化了多平台项目中测试依赖项的使用](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [为 Kotlin/JVM 源集自动选择测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [断言函数更新](#assertion-function-updates)

### 简化了多平台项目中测试依赖项的使用

现在你可以使用 `kotlin-test` 依赖项在 `commonTest` 源集中添加测试依赖项，并且 Gradle 插件将为每个测试源集推断相应的平台依赖项：
* JVM 源集的 `kotlin-test-junit`，请参阅[为 Kotlin/JVM 源集自动选择测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* Kotlin/JS 源集的 `kotlin-test-js`
* 通用源集的 `kotlin-test-common` 和 `kotlin-test-annotations-common`
* Kotlin/Native 源集无需额外 artifact

此外，你可以在任何共享或特定于平台的源集中使用 `kotlin-test` 依赖项。

现有的带有显式依赖项的 kotlin-test 设置将在 Gradle 和 Maven 中继续工作。

了解更多关于[设置测试库依赖项](gradle-configure-project.md#set-dependencies-on-test-libraries)。

### 为 Kotlin/JVM 源集自动选择测试框架

Gradle 插件现在会自动选择并添加测试框架的依赖项。你只需在通用源集中添加 `kotlin-test` 依赖项即可。

Gradle 默认使用 JUnit 4。因此，`kotlin("test")` 依赖项解析为 JUnit 4 的变体，即 `kotlin-test-junit`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test")) // 这会传递性地引入对 JUnit 4 的依赖
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
                implementation kotlin("test") // 这会传递性地引入对 JUnit 4 的依赖
            }
        }
    }
}
```

</tab>
</tabs>

你可以通过在测试任务中调用 [`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform) 或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) 来选择 JUnit 5 或 TestNG：

```groovy
tasks {
    test {
        // 启用 TestNG 支持
        useTestNG()
        // 或
        // 启用 JUnit Platform（又称 JUnit 5）支持
        useJUnitPlatform()
    }
}
```

你可以通过将 `kotlin.test.infer.jvm.variant=false` 行添加到项目的 `gradle.properties` 来禁用自动测试框架选择。

了解更多关于[设置测试库依赖项](gradle-configure-project.md#set-dependencies-on-test-libraries)。

### 断言函数更新

此版本带来了新的断言函数并改进了现有函数。

`kotlin-test` 库现在具有以下特性：

* **检查值的类型**

  你可以使用新的 `assertIs<T>` 和 `assertIsNot<T>` 来检查值的类型：

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // 如果断言失败，将抛出 AssertionError 并提及 s 的实际类型
      // 现在可以因为 assertIs 中的契约打印 s.length
      println("${s.length}")
  }
  ```

  由于类型擦除，此断言函数仅检查 `value` 是否为 `List` 类型（在以下示例中），而不检查它是否为特定 `String` 元素类型的列表：`assertIs<List<String>>(value)`。

* **比较数组、序列和任意可迭代容器的内容**

  有一组新的重载 `assertContentEquals()` 函数，用于比较未实现[结构相等性](equality.md#structural-equality)的不同集合的内容：

  ```kotlin
  @Test
  fun test() {
      val expectedArray = arrayOf(1, 2, 3)
      val actualArray = Array(3) { it + 1 }
      assertContentEquals(expectedArray, actualArray)
  }
  ```

* **为 `Double` 和 `Float` 数值提供 `assertEquals()` 和 `assertNotEquals()` 的新重载**

  `assertEquals()` 函数的新重载允许以绝对精度比较两个 `Double` 或 `Float` 数值。精度值指定为函数的第三个参数：

  ```kotlin
   @Test
  fun test() {
      val x = sin(PI)

      // 精度参数
      val tolerance = 0.000001

      assertEquals(0.0, x, tolerance)
  }
  ```

* **检查集合和元素内容的新函数**

  你现在可以使用 `assertContains()` 函数检查集合或元素是否包含某物。
  你可以将其用于 Kotlin 集合和具有 `contains()` 运算符的元素，例如 `IntRange`、`String` 等：

  ```kotlin
  @Test
  fun test() {
      val sampleList = listOf<String>("sample", "sample2")
      val sampleString = "sample"
      assertContains(sampleList, sampleString)  // 集合中的元素
      assertContains(sampleString, "amp")       // 字符串中的子字符串
  }
  ```

* **`assertTrue()`、`assertFalse()`、`expect()` 函数现在为内联函数**

  从现在起，你可以将这些函数用作内联函数，因此可以在 lambda 表达式中调用[挂起函数](composing-suspending-functions.md)：

  ```kotlin
  @Test
  fun test() = runBlocking<Unit> {
      val deferred = async { "Kotlin is nice" }
      assertTrue("Kotlin substring should be present") {
          deferred.await() .contains("Kotlin")
      }
  }
  ```

## kotlinx 库

与 Kotlin 1.5.0 同时，我们正在发布新版本的 kotlinx 库：
* `kotlinx.coroutines` [1.5.0-RC](#coroutines-1-5-0-rc)
* `kotlinx.serialization` [1.2.1](#serialization-1-2-1)
* `kotlinx-datetime` [0.2.0](#datetime-0-2-0)

### Coroutines 1.5.0-RC

`kotlinx.coroutines` [1.5.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC) 带来了：
* [新的通道 API](channels.md)
* 稳定的[响应式集成](async-programming.md#reactive-extensions)
* 还有更多

从 Kotlin 1.5.0 开始，[实验性协程](whatsnew14.md#exclusion-of-the-deprecated-experimental-coroutines)已禁用，并且不再支持 `-Xcoroutines=experimental` 标志。

在[更新日志](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.5.0-RC)和 [`kotlinx.coroutines` 1.5.0 发布博客文章](https://blog.jetbrains.com/kotlin/2021/05/kotlin-coroutines-1-5-0-released/)中了解更多信息。

<video src="https://www.youtube.com/v/EVLnWOcR0is" title="kotlinx.coroutines 1.5.0"/>

### Serialization 1.2.1

`kotlinx.serialization` [1.2.1](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1) 带来了：
* JSON 序列化性能改进
* JSON 序列化支持多个名称
* 从 `@Serializable` 类生成实验性 .proto 模式
* 还有更多

在[更新日志](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.2.1)和 [`kotlinx.serialization` 1.2.1 发布博客文章](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-serialization-1-2-released/)中了解更多信息。

<video src="https://www.youtube.com/v/698I_AH8h6s" title="kotlinx.serialization 1.2.1"/>

### dateTime 0.2.0

`kotlinx-datetime` [0.2.0](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0) 带来了：
* `@Serializable` 日期时间对象
* `DateTimePeriod` 和 `DatePeriod` 的标准化 API
* 还有更多

在[更新日志](https://github.com/Kotlin/kotlinx-datetime/releases/tag/v0.2.0)和 [`kotlinx-datetime` 0.2.0 发布博客文章](https://blog.jetbrains.com/kotlin/2021/05/kotlinx-datetime-0-2-0-is-out/)中了解更多信息。

## 迁移到 Kotlin 1.5.0

一旦 Kotlin 插件 1.5.0 可用，IntelliJ IDEA 和 Android Studio 将建议更新 Kotlin 插件。

要将现有项目迁移到 Kotlin 1.5.0，只需将 Kotlin 版本更改为 `1.5.0` 并重新导入你的 Gradle 或 Maven 项目。[了解如何更新到 Kotlin 1.5.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.5.0 启动新项目，请更新 Kotlin 插件并从 **File** | **New** | **Project** 运行项目向导。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.5.0)下载。

Kotlin 1.5.0 是一个[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来不兼容的语言变更。在 [Kotlin 1.5 兼容性指南](compatibility-guide-15.md)中查找此类变更的详细列表。