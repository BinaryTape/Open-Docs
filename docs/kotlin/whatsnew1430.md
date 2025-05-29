[//]: # (title: Kotlin 1.4.30 有什么新变化)

_[发布时间：2021 年 2 月 3 日](releases.md#release-details)_

Kotlin 1.4.30 提供了新语言特性的预览版，将 Kotlin/JVM 编译器的新 IR 后端提升到 Beta 版，并提供了各种性能和功能改进。

你还可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)中了解新特性。

## 语言特性

Kotlin 1.5.0 将带来新的语言特性——JVM record 支持、密封接口和稳定的内联类。在 Kotlin 1.4.30 中，你可以在预览模式下试用这些特性和改进。如果你能在相应的 YouTrack 工单中与我们分享你的反馈，我们将不胜感激，因为这将使我们能够在 1.5.0 版本发布之前解决这些问题。

* [JVM record 支持](#jvm-records-support)
* [密封接口](#sealed-interfaces)和[密封类改进](#package-wide-sealed-class-hierarchies)
* [改进的内联类](#improved-inline-classes)

要在预览模式下启用这些语言特性和改进，你需要通过添加特定的编译器选项来选择启用。详见以下各节。

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)中了解更多关于新特性预览的信息。

### JVM record 支持

> JVM record 特性是[实验性](components-stability.md)的。它可能随时被删除或更改。需要选择启用（详见下文），并且你应仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 中提供反馈。
>
{style="warning"}

[JDK 16 发布](https://openjdk.java.net/projects/jdk/16/)计划稳定一种名为 `record` 的新 Java 类类型。为了提供 Kotlin 的所有优势并保持与 Java 的互操作性，Kotlin 正在引入实验性的 record 类支持。

你可以像 Kotlin 中的带属性的类一样使用在 Java 中声明的 record 类。无需额外的步骤。

从 1.4.30 开始，你可以使用 `@JvmRecord` 注解在 Kotlin 中为[数据类](data-classes.md)声明 record 类：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要试用 JVM record 的预览版，请添加编译器选项 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我们正在继续开发 JVM record 支持，如果你能使用[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42430)与我们分享你的反馈，我们将不胜感激。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) 中了解更多关于实现、限制和语法的信息。

### 密封接口

> 密封接口是[实验性](components-stability.md)的。它们可能随时被删除或更改。需要选择启用（详见下文），并且你应仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供反馈。
>
{style="warning"}

在 Kotlin 1.4.30 中，我们正在发布_密封接口_的原型。它们补充了密封类，并使得构建更灵活的受限类层次结构成为可能。

它们可以作为“内部”接口，不能在同一模块之外实现。你可以依赖这个事实，例如，编写穷举 `when` 表达式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是穷举的：在模块编译后，不会出现其他多边形实现
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

另一个用例：使用密封接口，你可以从两个或多个密封超类继承一个类。

```kotlin
sealed interface Fillable {
   fun fill()
}
sealed interface Polygon {
   val vertices: List<Point>
}

class Rectangle(override val vertices: List<Point>): Fillable, Polygon {
   override fun fill() { /*...*/ }
}
```

要试用密封接口的预览版，请添加编译器选项 `-language-version 1.5`。一旦你切换到此版本，你就可以在接口上使用 `sealed` 修饰符。如果你能使用[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)与我们分享你的反馈，我们将不胜感激。

[了解更多关于密封接口的信息](sealed-classes.md)。

### 包级密封类层次结构

> 密封类的包级层次结构是[实验性](components-stability.md)的。它们可能随时被删除或更改。需要选择启用（详见下文），并且你应仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供反馈。
>
{style="warning"}

密封类现在可以形成更灵活的层次结构。它们可以在同一编译单元和同一包的所有文件中拥有子类。以前，所有子类都必须出现在同一文件中。

直接子类可以是顶层类，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。密封类的子类必须具有正确限定的名称——它们不能是局部对象或匿名对象。

要试用密封类的包级层次结构，请添加编译器选项 `-language-version 1.5`。如果你能使用[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)与我们分享你的反馈，我们将不胜感激。

[了解更多关于密封类的包级层次结构的信息](sealed-classes.md#inheritance)。

### 改进的内联类

> 内联值类处于 [Beta](components-stability.md) 阶段。它们几乎稳定，但未来可能需要迁移步骤。我们将尽最大努力减少你必须进行的任何更改。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 中提供关于内联类特性的反馈。
>
{style="warning"}

Kotlin 1.4.30 将[内联类](inline-classes.md)提升到 [Beta](components-stability.md) 版，并为它们带来了以下特性和改进：

* 由于内联类是[基于值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，你可以使用 `value` 修饰符定义它们。`inline` 和 `value` 修饰符现在彼此等效。在未来的 Kotlin 版本中，我们计划弃用 `inline` 修饰符。

  从现在开始，Kotlin 要求在 JVM 后端的类声明前添加 `@JvmInline` 注解：
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // For JVM backends
  @JvmInline
  value class Name(private val s: String)
  ```

* 内联类可以有 `init` 块。你可以添加在类实例化后立即执行的代码：
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 从 Java 代码调用内联类函数：在 Kotlin 1.4.30 之前，由于名称混淆（mangling），你无法从 Java 调用接受内联类的函数。
  从现在开始，你可以手动禁用名称混淆。要从 Java 代码调用此类函数，你应在函数声明前添加 `@JvmName` 注解：

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在此版本中，我们更改了函数的名称混淆方案以修复不正确的行为。这些更改导致了 ABI 变更。

  从 1.4.30 开始，Kotlin 编译器默认使用新的名称混淆方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 编译器标志可以强制编译器使用旧的 1.4.0 名称混淆方案并保持二进制兼容性。

Kotlin 1.4.30 将内联类提升到 Beta 版，我们计划在未来版本中使其稳定。如果你能使用[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42434)与我们分享你的反馈，我们将不胜感激。

要试用内联类的预览版，请添加编译器选项 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中了解更多关于名称混淆算法的信息。

[了解更多关于内联类的信息](inline-classes.md)。

## Kotlin/JVM

### JVM IR 编译器后端达到 Beta 阶段

Kotlin/JVM 的[基于 IR 的编译器后端](whatsnew14.md#unified-backends-and-extensibility)于 1.4.0 中以 [Alpha](components-stability.md) 版发布，现已达到 Beta 阶段。这是 IR 后端成为 Kotlin/JVM 编译器默认后端之前的最后一个预稳定级别。

我们现在取消了对使用 IR 编译器生成的二进制文件的限制。以前，你只能在启用新后端的情况下才能使用由新的 JVM IR 后端编译的代码。从 1.4.30 开始，没有这种限制，因此你可以使用新后端为第三方用途（如库）构建组件。试用新后端的 Beta 版本并在我们的[问题跟踪器](https://kotl.in/issue)中分享你的反馈。

要启用新的 JVM IR 后端，请将以下行添加到项目的配置文件中：
* 在 Gradle 中：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </tab>
  <tab title="Groovy" group-key="groovy">
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```

  </tab>
  </tabs>

* 在 Maven 中：

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)中了解更多关于 JVM IR 后端带来的变化。

## Kotlin/Native

### 性能改进

Kotlin/Native 在 1.4.30 中获得了各种性能改进，这导致了更快的编译时间。例如，在 [Networking and data storage with Kotlin Multiplatform Mobile](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 示例中重建框架所需的时间已从 9.5 秒（1.4.10 中）减少到 4.5 秒（1.4.30 中）。

### Apple watchOS 64 位模拟器目标

自 7.0 版本以来，watchOS 的 x86 模拟器目标已被弃用。为了跟上最新的 watchOS 版本，Kotlin/Native 有一个新的目标 `watchosX64`，用于在 64 位架构上运行模拟器。

### 支持 Xcode 12.2 库

我们增加了对 Xcode 12.2 附带的新库的支持。你现在可以从 Kotlin 代码中使用它们。

## Kotlin/JS

### 顶层属性的惰性初始化

> 顶层属性的惰性初始化是[实验性](components-stability.md)的。它可能随时被删除或更改。仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 中提供反馈。
>
{style="warning"}

Kotlin/JS 的 [IR 后端](js-ir-compiler.md)正在接收顶层属性的惰性初始化原型实现。这减少了应用程序启动时初始化所有顶层属性的需要，并且应显著提高应用程序启动时间。

我们将继续致力于惰性初始化，并请你试用当前的原型，并在[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-44320)或官方 [Kotlin Slack](https://kotlinlang.slack.com) 中的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道（[在此处获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）中分享你的想法和结果。

要使用惰性初始化，请在使用 JS IR 编译器编译代码时添加 `-Xir-property-lazy-initialization` 编译器选项。

## Gradle 项目改进

### 支持 Gradle 配置缓存

从 1.4.30 开始，Kotlin Gradle 插件支持[配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)功能。它加快了构建过程：一旦你运行命令，Gradle 就会执行配置阶段并计算任务图。Gradle 会缓存结果并将其用于后续构建。

要开始使用此功能，你可以[使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)或[设置基于 IntelliJ 的 IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 标准库

### 与区域设置无关的 API，用于文本大小写转换

> 与区域设置无关的 API 特性是[实验性](components-stability.md)的。它可能随时被删除或更改。仅将其用于评估目的。
> 我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 中提供反馈。
>
{style="warning"}

此版本引入了用于字符串和字符大小写转换的实验性与区域设置无关的 API。当前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函数是区域设置敏感的。这意味着不同的平台区域设置可能会影响代码行为。例如，在土耳其语区域设置中，当字符串 "kotlin" 使用 `toUpperCase` 转换时，结果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

* 对于 `String` 函数：

  |**早期版本**|**1.4.30 替代方案**| 
  | --- | --- |
  |`String.toUpperCase()`|`String.uppercase()`|
  |`String.toLowerCase()`|`String.lowercase()`|
  |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
  |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

* 对于 `Char` 函数：

  |**早期版本**|**1.4.30 替代方案**| 
  | --- | --- |
  |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
  |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
  |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 对于 Kotlin/JVM，还有带有显式 `Locale` 参数的重载 `uppercase()`、`lowercase()` 和 `titlecase()` 函数。
>
{style="note"}

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md) 中查看文本处理函数更改的完整列表。

### 清晰的 Char 到代码和 Char 到数字转换

> 用于 `Char` 转换的明确 API 特性是[实验性](components-stability.md)的。它可能随时被删除或更改。
> 仅将其用于评估目的。
> 我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 中提供反馈。
>
{style="warning"}

当前的 `Char` 到数字转换函数返回以不同数字类型表示的 UTF-16 编码，它们经常与类似的字符串到整数转换混淆，后者返回字符串的数值：

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

为了避免这种混淆，我们决定将 `Char` 转换分为以下两组名称明确的函数：

* 获取 `Char` 的整数编码并从给定编码构造 `Char` 的函数：
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 将 `Char` 转换为它所表示数字的数值的函数：

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* 一个 `Int` 的扩展函数，用于将其表示的非负单数字转换为对应的 `Char` 表示：

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md) 中查看更多细节。

## 序列化更新

与 Kotlin 1.4.30 同时，我们发布了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，它包含一些新特性：

* 内联类序列化支持
* 无符号原始类型序列化支持

### 内联类序列化支持

从 Kotlin 1.4.30 开始，你可以使内联类[可序列化](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 此特性需要新的 1.4.30 IR 编译器。
>
{style="note"}

当可序列化内联类用于其他可序列化类时，序列化框架不会对它们进行装箱。

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)中了解更多信息。

### 无符号原始类型序列化支持

从 1.4.30 开始，你可以使用 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的标准 JSON 序列化器来处理无符号原始类型：`UInt`、`ULong`、`UByte` 和 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)中了解更多信息。