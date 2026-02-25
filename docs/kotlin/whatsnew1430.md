[//]: # (title: Kotlin 1.4.30 最新变化)

<web-summary>阅读 Kotlin 1.4.30 发布说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 构建工具的支持。</web-summary>

_[发布日期：2021 年 2 月 3 日](releases.md#release-history)_

Kotlin 1.4.30 提供了新语言功能的预览版本，将 Kotlin/JVM 编译器的全新 IR 后端提升至 Beta 阶段，并交付了多种性能和功能改进。

您也可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)中了解新功能。

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 语言功能

Kotlin 1.5.0 将交付新的语言功能——JVM record 支持、密封接口（sealed interfaces）以及稳定版内联类（inline classes）。在 Kotlin 1.4.30 中，您可以在预览模式下尝试这些功能和改进。如果您能在相应的 YouTrack 工单中与我们分享您的反馈，我们将不胜感激，这能让我们在 1.5.0 发布之前解决相关问题。

* [JVM record 支持](#jvm-records-support)
* [密封接口](#sealed-interfaces) 和 [密封类改进](#package-wide-sealed-class-hierarchies)
* [改进的内联类](#improved-inline-classes)

要在预览模式下启用这些语言功能和改进，您需要通过添加特定的编译器选项来开启。详情请参阅以下章节。

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)中详细了解新功能预览。

### JVM record 支持

> JVM record 功能是[实验性的](components-stability.md)。它可能随时被删除或更改。需要启用（详情见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 上提供反馈。
>
{style="warning"}

[JDK 16 发布计划](https://openjdk.java.net/projects/jdk/16/)中包括稳定一种名为 [record](https://openjdk.java.net/jeps/395) 的新 Java 类类型。为了提供 Kotlin 的所有优势并保持与 Java 的互操作性，Kotlin 正在引入实验性的 record 类支持。

您可以像使用 Kotlin 中带属性的类一样，使用在 Java 中声明的 record 类。无需额外步骤。

从 1.4.30 开始，您可以使用 `@JvmRecord` 注解为 [数据类](data-classes.md)（data class）在 Kotlin 中声明 record 类：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要尝试 JVM record 的预览版本，请添加编译器选项 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我们正在继续完善对 JVM record 的支持，如果您能通过此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42430)分享您的反馈，我们将不胜感激。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md) 中详细了解其实现、限制和语法。

### 密封接口

> 密封接口（Sealed interfaces）是[实验性的](components-stability.md)。它们可能随时被删除或更改。需要启用（详情见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供反馈。
>
{style="warning"}

在 Kotlin 1.4.30 中，我们交付了“密封接口”的原型。它们是对密封类（sealed classes）的补充，使构建更灵活的受限类层次结构成为可能。

它们可以作为“内部”接口，不能在同一模块之外实现。您可以利用这一特性，例如编写详尽的 `when` 表达式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是详尽的：在模块编译后，
// 不会出现其他的 polygon 实现
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

另一个用例：通过密封接口，您可以让一个类继承两个或多个密封超类。

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

要尝试密封接口的预览版本，请添加编译器选项 `-language-version 1.5`。一旦切换到此版本，您将能够在接口上使用 `sealed` 修饰符。如果您能通过此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)分享您的反馈，我们将不胜感激。

[详细了解密封接口](sealed-classes.md)。

### 包级密封类层次结构

> 包级密封类层次结构是[实验性的](components-stability.md)。它们可能随时被删除或更改。需要启用（详情见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上提供反馈。
>
{style="warning"}

密封类现在可以形成更灵活的层次结构。它们可以在同一编译单元和同一软件包的所有文件中拥有子类。此前，所有子类都必须出现在同一个文件中。

直接子类可以是顶层的，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。密封类的子类必须具有正确限定的名称——它们不能是局部对象或匿名对象。

要尝试包级密封类层次结构，请添加编译器选项 `-language-version 1.5`。如果您能通过此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)分享您的反馈，我们将不胜感激。

[详细了解包级密封类层次结构](sealed-classes.md#inheritance)。

### 改进的内联类

> 内联值类（Inline value classes）处于 [Beta](components-stability.md) 阶段。它们已接近稳定，但未来可能需要迁移步骤。我们将尽力减少您必须进行的更改。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 上提供有关内联类功能的反馈。
>
{style="warning"}

Kotlin 1.4.30 将 [内联类](inline-classes.md) 提升至 [Beta](components-stability.md) 阶段，并为其带来了以下功能和改进：

* 由于内联类是[基于值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，您可以使用 `value` 修饰符来定义它们。`inline` 和 `value` 修饰符现在是等效的。在未来的 Kotlin 版本中，我们计划弃用 `inline` 修饰符。

  从现在起，对于 JVM 后端，Kotlin 要求在类声明前加上 `@JvmInline` 注解：
  
  ```kotlin
  inline class Name(private val s: String)
  
  value class Name(private val s: String)
  
  // 对于 JVM 后端
  @JvmInline
  value class Name(private val s: String)
  ```

* 内联类可以拥有 `init` 块。您可以添加在类实例化后立即执行的代码：
  
  ```kotlin
  @JvmInline
  value class Negative(val x: Int) {
    init {
        require(x < 0) { }
    }
  }
  ```

* 从 Java 代码调用带内联类的函数：在 Kotlin 1.4.30 之前，由于名称修饰（mangling），您无法从 Java 调用接受内联类的函数。从现在起，您可以手动禁用名称修饰。要从 Java 代码调用此类函数，应在函数声明前添加 `@JvmName` 注解：

  ```kotlin
  inline class UInt(val x: Int)
  
  fun compute(x: Int) { }
  
  @JvmName("computeUInt")
  fun compute(x: UInt) { }
  ```

* 在此版本中，我们更改了函数的名称修饰方案以修复不正确的行为。这些更改导致了 ABI 变更。

  从 1.4.30 开始，Kotlin 编译器默认使用新的名称修饰方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 编译器标志强制编译器使用旧的 1.4.0 名称修饰方案，并保持二进制兼容性。

Kotlin 1.4.30 将内联类提升至 Beta 阶段，我们计划在未来的版本中使其达到稳定（Stable）。如果您能通过此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42434)分享您的反馈，我们将不胜感激。

要尝试内联类的预览版本，请添加编译器选项 `-Xinline-classes` 或 `-language-version 1.5`。

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md) 中详细了解名称修饰算法。

[详细了解内联类](inline-classes.md)。

## Kotlin/JVM

### JVM IR 编译器后端进入 Beta 阶段

Kotlin/JVM 的[基于 IR 的编译器后端](whatsnew14.md#unified-backends-and-extensibility)已进入 Beta 阶段。该后端在 1.4.0 中以 [Alpha](components-stability.md) 形式发布。这是 IR 后端成为 Kotlin/JVM 编译器默认后端之前的最后一个预稳定阶段。

我们现在取消了对使用 IR 编译器生成的二进制文件的限制。此前，只有在启用了新后端的情况下，才能使用由新 JVM IR 后端编译的代码。从 1.4.30 开始，不再有此类限制，因此您可以使用新后端构建供第三方使用的组件（如库）。请尝试新后端的 Beta 版本，并在我们的[问题跟踪器](https://kotl.in/issue)中分享反馈。

要启用新的 JVM IR 后端，请在项目的构建配置文件中添加以下行：
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

在[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)中详细了解 JVM IR 后端带来的变化。

## Kotlin/Native

### 性能改进

Kotlin/Native 在 1.4.30 中获得了多项性能改进，从而缩短了编译时间。例如，在 [使用 Kotlin Multiplatform Mobile 进行网络连接和数据存储](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 示例中，重新构建框架所需的时间从 9.5 秒（1.4.10 版本）减少到 4.5 秒（1.4.30 版本）。

### Apple watchOS 64 位模拟器目标平台

自 7.0 版本起，watchOS 已弃用 x86 模拟器目标平台。为了跟上最新的 watchOS 版本，Kotlin/Native 增加了新的目标平台 `watchosX64`，用于在 64 位架构上运行模拟器。

### 对 Xcode 12.2 库的支持

我们增加了对 Xcode 12.2 交付的新库的支持。您现在可以从 Kotlin 代码中使用它们。

## Kotlin/JS

### 顶层属性的延迟初始化

> 顶层属性的延迟初始化是[实验性的](components-stability.md)。它可能随时被删除或更改。需要启用（详情见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 上提供反馈。
>
{style="warning"}

Kotlin/JS 的 [IR 后端](js-ir-compiler.md) 正在接收顶层属性延迟初始化的原型实现。这减少了应用启动时初始化所有顶层属性的需求，从而显著缩短应用的启动时间。

我们将继续完善延迟初始化功能，请您尝试当前的原型，并在此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-44320)或官方 [Kotlin Slack](https://kotlinlang.slack.com) 的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道（在此获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）中分享您的想法和结果。

要使用延迟初始化，请在使用 JS IR 编译器编译代码时添加 `-Xir-property-lazy-initialization` 编译器选项。

## Gradle 项目改进

### 支持 Gradle 配置缓存

从 1.4.30 开始，Kotlin Gradle 插件支持 [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)（configuration cache）功能。它加快了构建过程：一旦运行命令，Gradle 就会执行配置阶段并计算任务图。Gradle 会缓存结果并在后续构建中重用它。

要开始使用此功能，您可以 [使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage) 或 [设置基于 IntelliJ 的 IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 标准库

### 与区域性无关的文本大/小写转换 API

> 与区域性无关的 API 功能是[实验性的](components-stability.md)。它可能随时被删除或更改。请仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 上提供反馈。
>
{style="warning"}

此版本引入了实验性的、与区域性无关的 API，用于更改字符串和字符的大小写。目前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函数是区域性相关的。这意味着不同的平台区域设置会影响代码行为。例如，在土耳其语区域设置中，当使用 `toUpperCase` 转换字符串 "kotlin" 时，结果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// 当前 API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// 新 API
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

> 对于 Kotlin/JVM，还有带显式 `Locale` 形参的重载函数 `uppercase()`、`lowercase()` 和 `titlecase()`。
>
{style="note"}

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md) 中查看文本处理函数的完整变更列表。

### 清晰的 Char 到代码及 Char 到数字转换

> `Char` 转换的无歧义 API 功能是[实验性的](components-stability.md)。它可能随时被删除或更改。请仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 上提供反馈。
>
{style="warning"}

目前的 `Char` 到数字转换函数（返回以不同数值类型表示的 UTF-16 代码）经常与类似的 String-to-Int 转换（返回字符串的数值）混淆：

```kotlin
"4".toInt() // 返回 4
'4'.toInt() // 返回 52
// 并且没有通用函数能为 Char '4' 返回数值 4
```

为了避免这种混淆，我们决定将 `Char` 转换拆分为以下两组名称清晰的函数：

* 获取 `Char` 的整数代码以及从给定代码构造 `Char` 的函数：
 
  ```kotlin
  fun Char(code: Int): Char
  fun Char(code: UShort): Char
  val Char.code: Int
  ```

* 将 `Char` 转换为它所代表的数字数值的函数：

  ```kotlin
  fun Char.digitToInt(radix: Int): Int
  fun Char.digitToIntOrNull(radix: Int): Int?
  ```
* `Int` 的扩展函数，将其代表的非负单个数字转换为相应的 `Char` 表示：

  ```kotlin
  fun Int.digitToChar(radix: Int): Char
  ```

在 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md) 中查看更多详情。

## 序列化更新

伴随 Kotlin 1.4.30，我们发布了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，其中包括一些新功能：

* 内联类序列化支持
* 无符号原生类型序列化支持

### 内联类序列化支持

从 Kotlin 1.4.30 开始，您可以使内联类成为[可序列化的](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 该功能需要新的 1.4.30 IR 编译器。
>
{style="note"}

当可序列化内联类被用于其他可序列化类中时，序列化框架不会对其进行装箱。

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)中了解更多信息。

### 无符号原生类型序列化支持

从 1.4.30 开始，您可以为无符号原生类型（`UInt`、`ULong`、`UByte` 和 `UShort`）使用 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的标准 JSON 序列化程序：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

在 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)中了解更多信息。