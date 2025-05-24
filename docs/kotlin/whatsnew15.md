---
title: "Kotlin 1.5.0 新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2021 年 5 月 5 日](releases#release-details)_

Kotlin 1.5.0 引入了新的语言特性、稳定的基于 IR 的 JVM 编译器后端、性能改进以及演进式变更，例如稳定实验性特性和弃用过时的特性。

您还可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-released/)中找到有关更改的概述。

## 语言特性

Kotlin 1.5.0 带来了新的语言特性的稳定版本，这些特性已在 [1.4.30 中预览](whatsnew1430#language-features)过：
* [JVM 记录类支持](#jvm-records-support)
* [密封接口](#sealed-interfaces) 和 [密封类改进](#package-wide-sealed-class-hierarchies)
* [内联类](#inline-classes)

这些特性的详细说明可在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)和 Kotlin 文档的相应页面中找到。

### JVM 记录类支持

Java 发展迅速，为了确保 Kotlin 仍然可以与之互操作，我们引入了对其最新特性之一——[记录类](https://openjdk.java.net/jeps/395)的支持。

Kotlin 对 JVM 记录类的支持包括双向互操作性：
* 在 Kotlin 代码中，您可以像使用具有属性的典型类一样使用 Java 记录类。
* 要在 Java 代码中使用 Kotlin 类作为记录，请将其设为 `data` 类并使用 `@JvmRecord` 注解对其进行标记。

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

[了解更多关于在 Kotlin 中使用 JVM 记录的信息](jvm-records)。

<video src="https://www.youtube.com/v/iyEWXyuuseU" title="Support for JVM Records in Kotlin 1.5.0"/>

### 密封接口

Kotlin 接口现在可以具有 `sealed` 修饰符，它在接口上的工作方式与在类上的工作方式相同：密封接口的所有实现都在编译时已知。

```kotlin
sealed interface Polygon
```

您可以依靠这一事实，例如，编写详尽的 `when` 表达式。

```kotlin
fun draw(polygon: Polygon) = when (polygon) {
   is Rectangle `->` // ...
   is Triangle `->` // ...
   // else is not needed - all possible implementations are covered
}

```

此外，密封接口支持更灵活的受限类层次结构，因为一个类可以直接继承多个密封接口。

```kotlin
class FilledRectangle: Polygon, Fillable
```

[了解更多关于密封接口的信息](sealed-classes)。

<video src="https://www.youtube.com/v/d_Mor21W_60" title="Sealed Interfaces and Sealed Classes Improvements"/>

### 包级密封类层级

密封类现在可以在同一编译单元和同一包的所有文件中拥有子类。 以前，所有子类都必须出现在同一文件中。

直接子类可以是顶级的，也可以嵌套在任何数量的其他命名类、命名接口或命名对象中。

密封类的子类必须具有正确限定的名称——它们不能是局部或匿名对象。

[了解更多关于密封类层级的信息](sealed-classes#inheritance)。

### 内联类

内联类是仅保存值的[基于值](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes)的类的子集。 您可以使用它们作为某种类型的值的包装器，而无需使用内存分配带来的额外开销。

可以使用类名之前的 `value` 修饰符声明内联类：

```kotlin
value class Password(val s: String)
```

JVM 后端还需要一个特殊的 `@JvmInline` 注解：

```kotlin
@JvmInline
value class Password(val s: String)
```

`inline` 修饰符现在已弃用，并带有警告。

[了解更多关于内联类的信息](inline-classes)。

<video src="https://www.youtube.com/v/LpqvtgibbsQ" title="From Inline to Value Classes"/>

## Kotlin/JVM

Kotlin/JVM 收到了一些改进，包括内部改进和面向用户的改进。 以下是其中最值得注意的：

* [稳定的 JVM IR 后端](#stable-jvm-ir-backend)
* [新的默认 JVM 目标：1.8](#new-default-jvm-target-1-8)
* [通过 invokedynamic 实现 SAM 适配器](#sam-adapters-via-invokedynamic)
* [通过 invokedynamic 实现 Lambdas](#lambdas-via-invokedynamic)
* [弃用 @JvmDefault 和旧的 Xjvm-default 模式](#deprecation-of-jvmdefault-and-old-xjvm-default-modes)
* [改进了对可空性注解的处理](#improvements-to-handling-nullability-annotations)

### 稳定的 JVM IR 后端

用于 Kotlin/JVM 编译器的 [基于 IR 的后端](whatsnew14#new-jvm-ir-backend) 现在是[稳定的](components-stability) 并且默认启用。

从 [Kotlin 1.4.0](whatsnew14) 开始，基于 IR 的后端的早期版本可用于预览，现在它已成为语言版本 `1.5` 的默认设置。旧后端仍然是早期语言版本的默认设置。

您可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中找到有关 IR 后端的优势及其未来发展的更多详细信息。

如果您需要在 Kotlin 1.5.0 中使用旧后端，可以将以下行添加到项目的配置文件中：

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

### 新的默认 JVM 目标：1.8

Kotlin/JVM 编译的默认目标版本现在是 `1.8`。 `1.6` 目标已弃用。

如果您需要构建 JVM 1.6，您仍然可以切换到此目标。 了解方法：

* [在 Gradle 中](gradle-compiler-options#attributes-specific-to-jvm)
* [在 Maven 中](maven#attributes-specific-to-jvm)
* [在命令行编译器中](compiler-reference#jvm-target-version)

### 通过 invokedynamic 实现 SAM 适配器

Kotlin 1.5.0 现在使用动态调用 (`invokedynamic`) 来编译 SAM (Single Abstract Method) 转换：
* 如果 SAM 类型是 [Java 接口](java-interop#sam-conversions)，则可以应用于任何表达式
* 如果 SAM 类型是 [Kotlin 函数式接口](fun-interfaces#sam-conversions)，则可以应用于 lambda 表达式

新的实现使用 [`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)
并且在编译期间不再生成辅助包装器类。 这减少了应用程序 JAR 的大小，从而提高了 JVM 启动性能。

要回滚到基于匿名类生成的旧实现方案，请添加编译器选项 `-Xsam-conversions=class`。

了解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和 [命令行编译器](compiler-reference#compiler-options) 中添加编译器选项。

### 通过 invokedynamic 实现 Lambdas

:::note
将纯 Kotlin lambda 编译为 invokedynamic 是 [Experimental](components-stability) 的。 它可能随时被删除或更改。
需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-45375) 上分享您的反馈。

Kotlin 1.5.0 引入了对将纯 Kotlin lambda（未转换为函数式接口实例）编译为动态调用 (`invokedynamic`) 的实验性支持。 该实现通过使用
[`LambdaMetafactory.metafactory()`](https://docs.oracle.com/javase/8/docs/api/java/lang/invoke/LambdaMetafactory.html#metafactory-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.invoke.MethodType-java.lang.invoke.MethodHandle-java.lang.invoke.MethodType-)
来生成更轻量级的二进制文件，它有效地在运行时生成必要的类。 目前，与普通 lambda 编译相比，它有三个限制：

* 编译为 invokedynamic 的 lambda 不可序列化。
* 在这样的 lambda 上调用 `toString()` 会产生可读性较差的字符串表示形式。
* 实验性的 [`reflect`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支持使用 `LambdaMetafactory` 创建的 lambda。

要尝试此功能，请添加 `-Xlambdas=indy` 编译器选项。 如果您能使用此 [YouTrack ticket](https://youtrack.jetbrains.com/issue/KT-45375) 分享您的反馈，我们将不胜感激。

了解如何在 [Gradle](gradle-compiler-options)、[Maven](maven#specify-compiler-options) 和 [命令行编译器](compiler-reference#compiler-options) 中添加编译器选项。

### 弃用 @JvmDefault 和旧的 Xjvm-default 模式

在 Kotlin 1.4.0 之前，存在 `@JvmDefault` 注解以及 `-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`
模式。 它们用于为 Kotlin 接口中的任何特定非抽象成员创建 JVM 默认方法。

在 Kotlin 1.4.0 中，我们[引入了新的 `Xjvm-default` 模式](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)，它为整个项目启用了默认方法生成。

在 Kotlin 1.5.0 中，我们弃用了 `@JvmDefault` 和旧的 Xjvm-default 模式：`-Xjvm-default=enable` 和 `-Xjvm-default=compatibility`。

[了解更多关于 Java 互操作中的默认方法的信息](java-to-kotlin-interop#default-methods-in-interfaces)。

### 改进了对可空性注解的处理

Kotlin 支持使用[可空性注解](java-interop#nullability-annotations)处理来自 Java 的类型可空性信息。
Kotlin 1.5.0 引入了该功能的许多改进：

* 它读取用作依赖项的已编译 Java 库中类型参数的可空性注解。
* 它支持具有 `TYPE_USE` 目标的可空性注解：
  * 数组
  * Varargs
  * 字段
  * 类型参数及其边界
  * 基类和接口的类型参数
* 如果可空性注解具有适用于类型的多个目标，并且其中一个目标是 `TYPE_USE`，则首选 `TYPE_USE`。
  例如，如果 `@Nullable` 同时支持 `TYPE_USE` 和 `METHOD` 作为目标，则方法签名 `@Nullable String[] f()` 变为 `fun f(): Array<String?>!`。

对于这些新支持的情况，从 Kotlin 调用 Java 时使用错误的类型可空性会产生警告。
使用 `-Xtype-enhancement-improvements-strict-mode` 编译器选项可为此类情况启用严格模式（带有错误报告）。

[了解更多关于 null-safety 和平台类型的信息](java-interop#null-safety-and-platform-types)。

## Kotlin/Native

Kotlin/Native 现在更具性能且更稳定。 值得注意的变化是：
* [性能改进](#performance-improvements)
* [停用内存泄漏检查器](#deactivation-of-the-memory-leak-checker)

### 性能改进

在 1.5.0 中，Kotlin/Native 获得了一系列性能改进，这些改进加快了编译和执行速度。

[编译器缓存](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)现在在 `linuxX64`（仅在 Linux 主机上）和 `iosArm64` 目标的调试模式下受支持。 启用编译器缓存后，除了第一个编译之外，大多数调试编译都完成得更快。 测量表明，在我们的测试项目中，速度提高了约 200%。

要将编译器缓存用于新目标，请通过将以下行添加到项目的 `gradle.properties` 中来选择加入：
* 对于 `linuxX64`：`kotlin.native.cacheKind.linuxX64=static`
* 对于 `iosArm64`：`kotlin.native.cacheKind.iosArm64=static`

如果您在启用编译器缓存后遇到任何问题，请将其报告给我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。

其他改进加快了 Kotlin/Native 代码的执行速度：
* 琐碎的属性访问器是内联的。
* 在编译期间评估字符串文字上的 `trimIndent()`。

### 停用内存泄漏检查器

默认情况下，已禁用内置的 Kotlin/Native 内存泄漏检查器。

它最初是为内部使用而设计的，并且只能在有限数量的情况下找到泄漏，而不是全部。
此外，后来发现它存在可能导致应用程序崩溃的问题。 因此，我们决定关闭内存泄漏检查器。

在某些情况下，内存泄漏检查器仍然有用，例如，单元测试。 对于这些情况，您可以启用
它通过添加以下代码行：

```kotlin
Platform.isMemoryLeakCheckerActive = true
```

请注意，不建议为应用程序运行时启用检查器。

## Kotlin/JS

Kotlin/JS 在 1.5.0 中收到了一些演进式更改。 我们正在继续努力将 [JS IR 编译器后端](js-ir-compiler)
朝着稳定方向发展并发布其他更新：

* [将 webpack 升级到版本 5](#upgrade-to-webpack-5)
* [IR 编译器的框架和库](#frameworks-and-libraries-for-the-ir-compiler)

### 升级到 webpack 5

Kotlin/JS Gradle 插件现在为浏览器目标使用 webpack 5 而不是 webpack 4。这是一个主要的 webpack 升级
带来了不兼容的更改。 如果您使用的是自定义 webpack 配置，请务必查看 [webpack 5 发行说明](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)。

[了解更多关于使用 webpack 打包 Kotlin/JS 项目的信息](js-project-setup#webpack-bundling)。

### IR 编译器的框架和库

Kotlin/JS IR 编译器是 [Alpha](components-stability) 版本的。 它可能会发生不兼容的更改，并且将来可能需要手动迁移。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上分享您的反馈。

在开发 Kotlin/JS 编译器的基于 IR 的后端的同时，我们鼓励并帮助库作者以 `both` 模式构建他们的
项目。 这意味着他们能够为 Kotlin/JS 编译器生成构件，从而扩大新编译器的生态系统。

许多知名的框架和库已经可用于 IR 后端：[KVision](https://kvision.io/)、[fritz2](https://www.fritz2.dev/)、
[doodle](https://github.com/nacular/doodle) 等。 如果您在项目中使用它们，则可以使用 IR 后端构建它
并查看它带来的好处。

如果您正在编写自己的库，请[以“both”模式编译它](js-ir-compiler#authoring-libraries-for-the-ir-compiler-with-backwards-compatibility)
以便您的客户端也可以将它与新编译器一起使用。

## Kotlin Multiplatform

在 Kotlin 1.5.0 中，[简化了为每个平台选择测试依赖项的过程](#simplified-test-dependencies-usage-in-multiplatform-projects)
现在由 Gradle 插件自动完成。

一个新的 [用于获取字符类别的 API 现在在多平台项目中可用](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)。

## 标准库

标准库收到了一系列更改和改进，从稳定实验性部分到添加新功能：

* [稳定的无符号整数类型](#stable-unsigned-integer-types)
* [稳定的与区域设置无关的用于大写/小写文本的 API](#stable-locale-agnostic-api-for-upper-lowercasing-text)
* [稳定的 Char 到整数转换 API](#stable-char-to-integer-conversion-api)
* [稳定的 Path API](#stable-path-api)
* [向下取整除法和 mod 运算符](#floored-division-and-the-mod-operator)
* [Duration API 更改](#duration-api-changes)
* [用于获取字符类别的新的 API 现在在多平台代码中可用](#new-api-for-getting-a-char-category-now-available-in-multiplatform-code)
* [新的集合函数 firstNotNullOf()](#new-collections-function-firstnotnullof)
* [String?.toBoolean() 的严格版本](#strict-version-of-string-toboolean)

您可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/04/kotlin-1-5-0-rc-released/)中了解更多关于标准库更改的信息。

<video src="https://www.youtube.com/v/MyTkiT2I6-8" title="New Standard Library Features"/>

### 稳定的无符号整数类型

`UInt`、`ULong`、`UByte`、`UShort` 无符号整数类型现在是 [Stable](components-stability) 的。 同样的还有
对这些类型的操作、范围和级数。 无符号数组及其上的操作仍处于 Beta 阶段。

[了解更多关于无符号整数类型的信息](unsigned-integer-types)。

### 稳定的与区域设置无关的用于大写/小写文本的 API

此版本带来了一个新的与区域设置无关的 API，用于大写/小写文本转换。 它提供了对
`toLowerCase()`、`toUpperCase()`、`capitalize()` 和 `decapitalize()` API 函数的替代方案，这些函数对区域设置敏感。
新的 API 可帮助您避免因不同的区域设置而导致的错误。

Kotlin 1.5.0 提供了以下完全 [Stable](components-stability) 的替代方案：

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

对于 Kotlin/JVM，还有带有显式 `Locale` 参数的重载 `uppercase()`、`lowercase()` 和 `titlecase()` 函数。

旧的 API 函数标记为已弃用，将在未来的版本中删除。

请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-case-conversions) 中文本处理函数的完整更改列表。

### 稳定的 char 到整数转换 API

从 Kotlin 1.5.0 开始，新的 char 到代码和 char 到数字转换函数是 [Stable](components-stability) 的。
这些函数替换了当前的 API 函数，这些函数经常与类似的 string-to-Int 转换混淆。

新的 API 消除了这种命名混乱，使代码行为更加透明和明确。

此版本引入了 `Char` 转换，这些转换分为以下明确命名的函数集：

* 用于获取 `Char` 的整数代码以及从给定代码构造 `Char` 的函数：

 ```kotlin
 fun Char(code: Int): Char
 fun Char(code: UShort): Char
 val Char.code: Int
 ```

* 用于将 `Char` 转换为其表示的数字值的函数：

 ```kotlin
 fun Char.digitToInt(radix: Int): Int
 fun Char.digitToIntOrNull(radix: Int): Int?
 ```

* `Int` 的扩展函数，用于将其表示的非负单个数位转换为相应的 `Char` 表示形式：

 ```kotlin
 fun Int.digitToChar(radix: Int): Char
 ```

旧的转换 API，包括 `Number.toChar()` 及其实现（除了 `Int.toChar()`）和用于转换为
数字类型的 `Char` 扩展，例如 `Char.toInt()`，现在已弃用。

[了解更多关于 KEEP 中的 char 到整数转换 API 的信息](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions)。

### 稳定的 Path API

具有 `java.nio.file.Path` 扩展的 [实验性 Path API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/)
现在是 [Stable](components-stability) 的。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory"

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

[了解更多关于 Path API 的信息](whatsnew1420#extensions-for-java-nio-file-path)。

### 向下取整除法和 mod 运算符

新的用于模运算的操作已添加到标准库中：
* `floorDiv()` 返回[向下取整除法](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions)的结果。 它适用于整数类型。
* `mod()` 返回向下取整除法的余数（_模数_）。 它适用于所有数字类型。

这些操作看起来与现有的[整数除法](numbers#operations-on-numbers)和 [rem()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int/rem.html)
函数（或 `%` 运算符）非常相似，但它们对负数的处理方式不同：
* `a.floorDiv(b)` 与常规 `/` 的不同之处在于 `floorDiv` 将结果向下舍入（朝向较小的整数），
  而 `/` 将结果截断为更接近 0 的整数。
* `a.mod(b)` 是 `a` 和 `a.floorDiv(b) * b` 之间的差。 它是零或具有与 `b` 相同的符号，
  而 `a % b` 可以具有不同的符号。

```kotlin
fun main() {

    println("Floored division -5/3: ${(-5).floorDiv(3)}")
    println( "Modulus: ${(-5).mod(3)}")
    
    println("Truncated division -5/3: ${-5 / 3}")
    println( "Remainder: ${-5 % 3}")

}
```

### Duration API 更改

:::caution
Duration API 是 [Experimental](components-stability) 的。 它可能随时被删除或更改。
仅将其用于评估目的。 我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上分享您的反馈。

:::

有一个实验性的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类，用于表示
不同时间单位的持续时间量。 在 1.5.0 中，Duration API 进行了以下更改：

* 内部值表示现在使用 `Long` 而不是 `Double` 以提供更好的精度。
* 有一个新的 API 用于转换为 `Long` 中特定时间单位。 它取代了旧的 API，该 API 使用
  `Double` 值并且现在已弃用。 例如，[`Duration.inWholeMinutes`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/in-whole-minutes.html) 返回以 `Long` 表示的持续时间值
  并替换 `Duration.inMinutes`。
* 有新的伴随函数用于从数字构造 `Duration`。 例如，[`Duration.seconds(Int)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/seconds.html)
  创建一个 `Duration` 对象，表示整数秒数。 像 `Int.seconds` 这样的旧扩展属性现在已弃用。

```kotlin
import kotlin.time.Duration
import kotlin.time.ExperimentalTime

@ExperimentalTime
fun main() {

    val duration = Duration.milliseconds(120000)
    println("There are ${duration.inWholeSeconds} seconds in ${duration.inWholeMinutes} minutes")

}
```

### 用于获取字符类别的新的 API 现在在多平台代码中可用

Kotlin 1.5.0 引入了新的 API，用于在多平台项目中根据 Unicode 获取字符的类别。
现在，所有平台和公共代码中都提供了几个函数。

用于检查字符是否为字母或数字的函数：
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

用于检查字符大小写的函数：
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

其他一些函数：
* [`Char.isDefined()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-defined.html)
* [`Char.isISOControl()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-i-s-o-control.html)

属性 [`Char.category`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/category.html) 及其返回类型
枚举类 [`CharCategory`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-char-category/)，它指示
根据 Unicode 字符的一般类别，现在也可在多平台项目中使用。

[了解更多关于字符的信息](characters)。

### 新的集合函数 firstNotNullOf()

新的 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html) 和 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
函数结合了 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html)
与 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)。
它们使用自定义选择器函数映射原始集合，并返回第一个非空值。 如果没有这样的值，
`firstNotNullOf()` 抛出异常，`firstNotNullOfOrNull()` 返回 null。

```kotlin
fun main() {

    val data = listOf("Kotlin", "1.5")
    println(data.firstNotNullOf(String::toDoubleOrNull))
    println(data.firstNotNullOfOrNull(String::toIntOrNull))

}
```

### String?.toBoolean() 的严格版本

两个新函数引入了现有 [String?.toBoolean()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean.html) 的区分大小写的严格版本：
* [`String.toBooleanStrict()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict.html) 为除字面量 `true` 和 `false` 之外的所有输入抛出异常。
* [`String.toBooleanStrictOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-boolean-strict-or-null.html) 为除字面量 `true` 和 `false` 之外的所有输入返回 null。

```kotlin
fun main() {

    println("true".toBooleanStrict())
    println("1".toBooleanStrictOrNull())
    // println("1".toBooleanStrict()) // Exception

}
```

## kotlin-test 库
[kotlin-test](https://kotlinlang.org/api/latest/kotlin.test/) 库引入了一些新功能：
* [简化了多平台项目中测试依赖项的用法](#simplified-test-dependencies-usage-in-multiplatform-projects)
* [自动选择 Kotlin/JVM 源集的测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* [断言函数更新](#assertion-function-updates)

### 简化了多平台项目中测试依赖项的用法

现在您可以使用 `kotlin-test` 依赖项在 `commonTest` 源集中添加测试依赖项，并且
Gradle 插件将推断每个测试源集的相应平台依赖项：
* 用于 JVM 源集的 `kotlin-test-junit`，请参阅 [自动选择 Kotlin/JVM 源集的测试框架](#automatic-selection-of-a-testing-framework-for-kotlin-jvm-source-sets)
* 用于 Kotlin/JS 源集的 `kotlin-test-js`
* 用于公共源集的 `kotlin-test-common` 和 `kotlin-test-annotations-common`
* 用于 Kotlin/Native 源集，无需额外的构件

此外，您可以在任何共享或平台特定的源集中使用 `kotlin-test` 依赖项。

具有显式依赖项的现有 kotlin-test 设置将在 Gradle 和 Maven 中继续工作。

了解更多关于 [设置测试库的依赖项](gradle-configure-project#set-dependencies-on-test-libraries) 的信息。

### 自动选择 Kotlin/JVM 源集的测试框架

Gradle 插件现在会自动选择并添加测试框架的依赖项。 您需要做的就是添加
在公共源集中添加依赖项 `kotlin-test`。

默认情况下，Gradle 使用 JUnit 4。 因此，`kotlin("test")` 依赖项解析为 JUnit 4 的变体，
即 `kotlin-test-junit`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

您可以通过在测试任务中调用 [`useJUnitPlatform()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) 来选择 JUnit 5 或 TestNG：

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

您可以通过将 `kotlin.test.infer.jvm.variant=false` 行添加到
项目的 `gradle.properties` 中来禁用自动测试框架选择。

了解更多关于 [设置测试库的依赖项](gradle-configure-project#set-dependencies-on-test-libraries) 的信息。

### 断言函数更新

此版本带来了新的断言函数并改进了现有的断言函数。

`kotlin-test` 库现在具有以下功能：

* **检查值的类型**

  您可以使用新的 `assertIs<T>` 和 `assertIsNot<T>` 来检查值的类型：

  ```kotlin
  @Test
  fun testFunction() {
      val s: Any = "test"
      assertIs<String>(s)  // throws AssertionError mentioning the actual type of s if the assertion fails