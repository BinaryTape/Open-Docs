---
title: "Kotlin 1.4.30 中的新增功能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布时间：2021年2月3日](releases#release-details)_

Kotlin 1.4.30 提供了新语言功能的预览版本，将 Kotlin/JVM 编译器的新的 IR 后端提升到 Beta 版，并提供各种性能和功能改进。

您还可以通过[这篇博文](https://blog.jetbrains.com/kotlin/2021/01/kotlin-1-4-30-released/)了解新功能。

## 语言功能

Kotlin 1.5.0 将提供新的语言功能 —— JVM records 支持、密封接口 (sealed interfaces) 和稳定的内联类 (inline classes)。在 Kotlin 1.4.30 中，您可以尝试这些功能的预览模式。如果您能在相应的 YouTrack 工单中与我们分享您的反馈，我们将不胜感激，因为这能让我们在 1.5.0 发布之前解决这些问题。

* [JVM records 支持](#jvm-records-support)
* [密封接口 (Sealed interfaces)](#sealed-interfaces) 和 [密封类 (sealed class) 的改进](#package-wide-sealed-class-hierarchies)
* [改进的内联类 (inline classes)](#improved-inline-classes)

要在预览模式下启用这些语言特性和改进，您需要通过添加特定的编译器选项来选择启用。请参阅下面的章节了解详细信息。

通过[这篇博文](https://blog.jetbrains.com/kotlin/2021/01/new-language-features-preview-in-kotlin-1-4-30)了解更多关于新功能预览的信息。

### JVM records 支持

:::note
JVM records 功能是 [Experimental](components-stability)。它可能随时被删除或更改。
需要选择启用（参见下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 中提供有关它的反馈。

[JDK 16 发布](https://openjdk.java.net/projects/jdk/16/)包含稳定一种名为 [record](https://openjdk.java.net/jeps/395) 的新 Java 类类型的计划。为了提供 Kotlin 的所有优势并保持其与 Java 的互操作性，Kotlin 正在引入实验性的 record 类支持。

您可以像使用 Kotlin 中的属性类一样使用在 Java 中声明的 record 类。无需额外的步骤。

从 1.4.30 开始，您可以使用 `@JvmRecord` 注解为 [data class](data-classes) 在 Kotlin 中声明 record 类：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要尝试 JVM records 的预览版，请添加编译器选项 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我们正在继续努力改进 JVM records 支持，如果您使用这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42430) 与我们分享您的反馈，我们将不胜感激。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records) 中了解更多关于实现、限制和语法的信息。

### 密封接口 (Sealed interfaces)

Sealed interfaces 是 [Experimental](components-stability)。它们可能随时被删除或更改。
需要选择启用（参见下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供有关它们的反馈。

在 Kotlin 1.4.30 中，我们发布了 *sealed interfaces* 的原型。它们补充了密封类 (sealed classes)，并使得构建更灵活的受限类层次结构成为可能。

它们可以作为“内部 (internal)”接口，不能在同一模块外部实现。您可以依赖这个事实，例如，编写详尽的 `when` 表达式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是详尽的：在模块编译后，不会出现其他的 polygon 实现
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle `->` // ...
    is Triangle `->` // ...
}

```

另一个用例：使用 sealed interfaces，您可以从两个或多个密封超类继承一个类。

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

要尝试 sealed interfaces 的预览版本，请添加编译器选项 `-language-version 1.5`。一旦您切换到这个版本，您就可以在接口上使用 `sealed` 修饰符。如果您使用这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433) 与我们分享您的反馈，我们将不胜感激。

[了解更多关于 sealed interfaces 的信息](sealed-classes)。

### 包范围的密封类 (sealed class) 层次结构

包范围的密封类 (sealed class) 层次结构是 [Experimental](components-stability)。它们可能随时被删除或更改。
需要选择启用（参见下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 中提供有关它们的反馈。

密封类 (sealed classes) 现在可以形成更灵活的层次结构。它们可以在同一编译单元和同一包的所有文件中拥有子类。以前，所有子类都必须出现在同一个文件中。

直接子类可以是顶级的，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。密封类 (sealed class) 的子类必须具有完全限定的名称 —— 它们不能是局部对象或匿名对象。

要尝试包范围的密封类 (sealed class) 层次结构，请添加编译器选项 `-language-version 1.5`。如果您使用这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433) 与我们分享您的反馈，我们将不胜感激。

[了解更多关于包范围的密封类 (sealed class) 层次结构的信息](sealed-classes#inheritance)。

### 改进的内联类 (inline classes)

内联值类 (inline value classes) 处于 [Beta](components-stability) 阶段。它们几乎是稳定的，但在未来可能需要迁移步骤。我们将尽最大努力减少您必须做出的任何更改。我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 中提供有关内联类 (inline classes) 功能的反馈。

Kotlin 1.4.30 将 [inline classes](inline-classes) 提升到 [Beta](components-stability) 阶段，并为它们带来了以下功能和改进：

* 由于内联类 (inline classes) 是 [基于值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，您可以使用 `value` 修饰符来定义它们。`inline` 和 `value` 修饰符现在彼此等效。在未来的 Kotlin 版本中，我们计划弃用 `inline` 修饰符。

  从现在开始，Kotlin 需要在 JVM 后端的类声明之前使用 `@JvmInline` 注解：
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // For JVM backends
  @JvmInline
  value class Name(private val s: String)
  ```

* 内联类 (inline classes) 可以有 `init` 代码块。您可以添加在类实例化后立即执行的代码：
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 从 Java 代码调用带有内联类 (inline classes) 的函数：在 Kotlin 1.4.30 之前，由于名称重整 (mangling)，您无法从 Java 调用接受内联类 (inline classes) 的函数。
  从现在开始，您可以手动禁用名称重整 (mangling)。要从 Java 代码调用此类函数，您应该在函数声明之前添加 `@JvmName` 注解：

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在此版本中，我们更改了函数的名称重整 (mangling) 方案以修复不正确的行为。这些更改导致了 ABI 更改。

  从 1.4.30 开始，Kotlin 编译器默认使用新的名称重整 (mangling) 方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 编译器标志强制编译器使用旧的 1.4.0 名称重整 (mangling) 方案并保持二进制兼容性。

Kotlin 1.4.30 将内联类 (inline classes) 提升到 Beta 版，我们计划在未来的版本中使它们稳定。如果您使用这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42434) 与我们分享您的反馈，我们将不胜感激。

要尝试内联类 (inline classes) 的预览版本，请添加编译器选项 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes) 中了解更多关于名称重整 (mangling) 算法的信息。

[了解更多关于 inline classes 的信息](inline-classes)。

## Kotlin/JVM

### JVM IR 编译器后端达到 Beta 阶段

基于 [IR 的编译器后端](whatsnew14#unified-backends-and-extensibility) for Kotlin/JVM 在 1.4.0 中以 [Alpha](components-stability) 阶段发布，现在已经达到 Beta 阶段。这是在 IR 后端成为 Kotlin/JVM 编译器的默认后端之前的最后一个预稳定阶段。

我们现在取消了对使用 IR 编译器生成的二进制文件的限制。以前，只有在启用了新的后端时，才能使用由新的 JVM IR 后端编译的代码。从 1.4.30 开始，没有这样的限制，因此您可以使用新的后端来构建第三方使用的组件，例如库。尝试新的后端的 Beta 版本，并在我们的 [问题跟踪器](https://kotl.in/issue) 中分享您的反馈。

要启用新的 JVM IR 后端，请将以下行添加到项目的配置文件中：
* 在 Gradle 中：

  <Tabs groupId="build-script">
  <TabItem value="kotlin" label="Kotlin" default>

  ```kotlin
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile::class) {
    kotlinOptions.useIR = true
  }
  ```
  
  </TabItem>
  <TabItem value="groovy" label="Groovy" default>
  
  ```groovy
  tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
    kotlinOptions.useIR = true
  }
  ```

  </TabItem>
  </Tabs>

* 在 Maven 中：

  ```xml
  <configuration>
      <args>
          <arg>-Xuse-ir</arg>
      </args>
  </configuration>
  ```

通过[这篇博文](https://blog.jetbrains.com/kotlin/2021/01/the-jvm-backend-is-in-beta-let-s-make-it-stable-together)了解更多关于 JVM IR 后端带来的变化的信息。

## Kotlin/Native

### 性能提升

Kotlin/Native 在 1.4.30 中获得了一系列的性能提升，从而加快了编译时间。例如，在 [使用 Kotlin Multiplatform Mobile 进行网络和数据存储](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 示例中重建框架所需的时间从 9.5 秒（在 1.4.10 中）减少到 4.5 秒（在 1.4.30 中）。

### Apple watchOS 64 位模拟器目标

自 7.0 版本以来，x86 模拟器目标已弃用于 watchOS。为了跟上最新的 watchOS 版本，Kotlin/Native 具有新的目标 `watchosX64`，用于在 64 位架构上运行模拟器。

### 支持 Xcode 12.2 库

我们添加了对 Xcode 12.2 附带的新库的支持。您现在可以从 Kotlin 代码中使用它们。

## Kotlin/JS

### 顶层属性的延迟初始化

顶层属性的延迟初始化是 [Experimental](components-stability)。它可能随时被删除或更改。
需要选择启用（参见下面的详细信息），并且您应该仅将其用于评估目的。 我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 中提供有关它的反馈。

Kotlin/JS 的 [IR 后端](js-ir-compiler) 正在接收顶层属性的延迟初始化的原型实现。这减少了在应用程序启动时初始化所有顶层属性的需要，并且应该显着提高应用程序的启动时间。

我们将继续努力改进延迟初始化，并要求您尝试当前的prototype并在 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-44320) 或官方 [Kotlin Slack](https://kotlinlang.slack.com) 中的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道中分享您的想法和结果（在此处获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

要使用延迟初始化，请在使用 JS IR 编译器编译代码时添加 `-Xir-property-lazy-initialization` 编译器选项。

## Gradle 项目改进

### 支持 Gradle 配置缓存

从 1.4.30 开始，Kotlin Gradle 插件支持 [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html) 功能。它加快了构建过程：一旦运行命令，Gradle 就会执行配置阶段并计算任务图。Gradle 缓存结果并在后续构建中重用它。

要开始使用此功能，您可以[使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)或[设置基于 IntelliJ 的 IDE](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 标准库

### 用于大写/小写文本的 Locale-agnostic API

locale-agnostic API 功能是 [Experimental](components-stability)。它可能随时被删除或更改。
仅将其用于评估目的。
我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 中提供有关它的反馈。

此版本引入了实验性的 locale-agnostic API，用于更改字符串和字符的大小写。当前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函数是 locale-sensitive 的。这意味着不同的平台 locale 设置会影响代码行为。例如，在土耳其 locale 中，当使用 `toUpperCase` 转换字符串“kotlin”时，结果是“KOTLİN”，而不是“KOTLIN”。

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

对于 Kotlin/JVM，还有带有显式 `Locale` 参数的重载 `uppercase()`、`lowercase()` 和 `titlecase()` 函数。

:::

请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions) 中的文本处理函数的完整更改列表。

### 清晰的 Char 到代码和 Char 到数字的转换

:::note
用于 `Char` 转换功能的明确 API 是 [Experimental](components-stability)。它可能随时被删除或更改。
仅将其用于评估目的。
我们将感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 中提供有关它的反馈。

当前 `Char` 到数字的转换函数返回以不同数字类型表示的 UTF-16 代码，通常与类似的 String 到 Int 的转换混淆，后者返回字符串的数值：

```kotlin
"4".toInt() // returns 4
'4'.toInt() // returns 52
// and there was no common function that would return the numeric value 4 for Char '4'
```

为了避免这种混淆，我们决定将 `Char` 转换分为以下两组命名清晰的函数：

* 用于获取 `Char` 的整数代码并从给定代码构造 `Char` 的函数：
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 用于将 `Char` 转换为它表示的数字的数值的函数：

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* `Int` 的扩展函数，用于将它表示的非负单数字转换为相应的 `Char` 表示形式：

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions) 中的更多详细信息。

## 序列化更新

与 Kotlin 1.4.30 一起，我们发布了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包括一些新功能：

* 内联类 (inline classes) 序列化支持
* 无符号原始类型序列化支持

### 内联类 (inline classes) 序列化支持

从 Kotlin 1.4.30 开始，您可以使内联类 (inline classes) [可序列化](serialization)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

此功能需要新的 1.4.30 IR 编译器。

:::

当序列化内联类 (inline classes) 在其他可序列化类中使用时，序列化框架不会对其进行装箱 (box)。

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#serializable-inline-classes) 中了解更多信息。

### 无符号原始类型序列化支持

从 1.4.30 开始，您可以将 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的标准 JSON 序列化器用于无符号原始类型：`UInt`、`ULong`、`UByte` 和 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes#unsigned-types-support-json-only) 中了解更多信息。