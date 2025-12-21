[//]: # (title: Kotlin 1.4.30 新特性)

_[发布日期：2021 年 2 月 3 日](releases.md#release-details)_

Kotlin 1.4.30 提供了新语言特性的预览版本，将 Kotlin/JVM 编译器的新 IR 后端提升为 Beta 版，并提供了各种性能和功能性改进。

你还可以通过[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/kotlin-1-4-30-released/)了解新特性。

## 语言特性

Kotlin 1.5.0 将带来新的语言特性——JVM records 支持、密封接口和稳定 inline class。在 Kotlin 1.4.30 中，你可以尝试这些特性和改进的预览模式。如果你能将反馈分享到对应的 YouTrack 工单中，我们将不胜感激，因为这有助于我们在 1.5.0 发布前解决问题。

*   [JVM records 支持](#jvm-records-support)
*   [密封接口](#sealed-interfaces)与[密封类改进](#package-wide-sealed-class-hierarchies)
*   [改进的 inline class](#improved-inline-classes)

要在预览模式下启用这些语言特性和改进，你需要通过添加特定的编译器选项来选择启用。详情请参见以下章节。

关于新特性预览的更多信息，请参阅[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/new-language-features-preview-in-kotlin-1-4-30/)。

### JVM records 支持

> JVM records 特性是[实验性的](components-stability.md)。它可能随时移除或更改。
> 需要选择启用（详情请参见下文），并且你应仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42430) 上，我们将不胜感激。
>
{style="warning"}

[JDK 16 发布](https://openjdk.java.net/projects/jdk/16/)计划稳定一种新的 Java 类类型，称为 [record](https://openjdk.java.net/jeps/395)。为了提供 Kotlin 的所有优势并保持其与 Java 的互操作性，Kotlin 正在引入实验性的 record class 支持。

你可以像 Kotlin 中带有属性的类一样使用在 Java 中声明的 record class。无需额外步骤。

从 1.4.30 开始，你可以在 Kotlin 中使用 `@JvmRecord` 注解为[数据类](data-classes.md)声明 record class：

```kotlin
@JvmRecord
data class User(val name: String, val age: Int)
```

要尝试 JVM records 的预览版本，请添加编译器选项 `-Xjvm-enable-preview` 和 `-language-version 1.5`。

我们将继续致力于 JVM records 支持，如果你能通过这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42430)向我们分享你的反馈，我们将不胜感激。

关于实现、限制和语法的更多信息，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/jvm-records.md)。

### 密封接口

> 密封接口是[实验性的](components-stability.md)。它们可能随时移除或更改。
> 需要选择启用（详情请参见下文），并且你应仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上，我们将不胜感激。
>
{style="warning"}

在 Kotlin 1.4.30 中，我们发布了 _密封接口_ 的原型。它们补充了密封类，使得构建更灵活的受限类层次结构成为可能。

它们可以作为“内部”接口，不能在同一模块之外实现。你可以依赖这个事实，例如，编写穷尽式 `when` 表达式。

```kotlin
sealed interface Polygon

class Rectangle(): Polygon
class Triangle(): Polygon

// when() 是穷尽的：在模块编译后，不会出现其他 polygon 实现
fun draw(polygon: Polygon) = when (polygon) {
    is Rectangle -> // ...
    is Triangle -> // ...
}

```

另一个用例是：通过密封接口，你可以让一个类继承自两个或多个密封超类。

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

要尝试密封接口的预览版本，请添加编译器选项 `-language-version 1.5`。一旦你切换到此版本，你将能够在接口上使用 `sealed` 修饰符。如果你能通过这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)向我们分享你的反馈，我们将不胜感激。

[关于密封接口的更多信息](sealed-classes.md)。

### 包范围内的密封类层次结构

> 包范围内的密封类层次结构是[实验性的](components-stability.md)。它们可能随时移除或更改。
> 需要选择启用（详情请参见下文），并且你应仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42433) 上，我们将不胜感激。
>
{style="warning"}

密封类现在可以形成更灵活的层次结构。它们可以在同一编译单元和同一包的所有文件中拥有子类。以前，所有子类都必须出现在同一文件中。

直接子类可以是顶层的，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。密封类的子类必须具有适当限定的名称——它们不能是局部对象或匿名对象。

要尝试包范围内的密封类层次结构，请添加编译器选项 `-language-version 1.5`。如果你能通过这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42433)向我们分享你的反馈，我们将不胜感激。

[关于包范围内的密封类层次结构的更多信息](sealed-classes.md#inheritance)。

### 改进的 inline class

> Inline value class 处于 [Beta 版](components-stability.md)。它们几乎稳定，但未来可能需要迁移步骤。我们将尽力减少你需要进行的任何更改。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42434) 上，我们将不胜感激。
>
{style="warning"}

Kotlin 1.4.30 将 [inline class](inline-classes.md) 提升为 [Beta 版](components-stability.md)，并为它们带来了以下特性和改进：

*   由于 inline class 是[基于值的](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/doc-files/ValueBased.html)，你可以使用 `value` 修饰符定义它们。`inline` 和 `value` 修饰符现在彼此等效。在未来的 Kotlin 版本中，我们计划弃用 `inline` 修饰符。

    从现在起，Kotlin 要求在类声明前为 JVM 后端添加 `@JvmInline` 注解：

    ```kotlin
    inline class Name(private val s: String)

    value class Name(private val s: String)

    // For JVM backends
    @JvmInline
    value class Name(private val s: String)
    ```

*   Inline class 可以拥有 `init` 代码块。你可以在类实例化后立即添加要执行的代码：

    ```kotlin
    @JvmInline
    value class Negative(val x: Int) {
      init {
          require(x < 0) { }
      }
    }
    ```

*   从 Java 代码调用带有 inline class 的函数：在 Kotlin 1.4.30 之前，由于名字修饰，你无法从 Java 调用接受 inline class 的函数。
    从现在起，你可以手动禁用名字修饰。要从 Java 代码调用此类函数，你应在函数声明前添加 `@JvmName` 注解：

    ```kotlin
    inline class UInt(val x: Int)

    fun compute(x: Int) { }

    @JvmName("computeUInt")
    fun compute(x: UInt) { }
    ```

*   在此版本中，我们更改了函数的**名字修饰**方案以修复不正确的行为。这些更改导致了 ABI 变更。

    从 1.4.30 开始，Kotlin 编译器默认使用新的**名字修饰**方案。使用 `-Xuse-14-inline-classes-mangling-scheme` 编译器标志强制编译器使用旧的 1.4.0 **名字修饰**方案并保留二进制兼容性。

Kotlin 1.4.30 将 inline class 提升为 Beta 版，我们计划在未来版本中使其稳定。如果你能通过这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-42434)向我们分享你的反馈，我们将不胜感激。

要尝试 inline class 的预览版本，请添加编译器选项 `-Xinline-classes` 或 `-language-version 1.5`。

关于**名字修饰**算法的更多信息，请参阅 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes.md)。

[关于 inline class 的更多信息](inline-classes.md)。

## Kotlin/JVM

### JVM IR 编译器后端达到 Beta

Kotlin/JVM 的[基于 IR 的编译器后端](whatsnew14.md#unified-backends-and-extensibility)已达到 Beta，该后端于 1.4.0 以 [Alpha 版](components-stability.md)推出。这是在 IR 后端成为 Kotlin/JVM 编译器默认后端之前的最后一个稳定前阶段。

我们现在取消了对使用 IR 编译器生成的二进制文件的限制。以前，你只能在启用新后端的情况下使用由新的 JVM IR 后端编译的代码。从 1.4.30 开始，不再有此限制，因此你可以使用新后端为第三方使用（例如库）构建组件。请尝试新后端的 Beta 版本，并在我们的[问题跟踪器](https://kotl.in/issue)中分享你的反馈。

要启用新的 JVM IR 后端，请将以下行添加到项目的配置文件中：
*   在 Gradle 中：

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

*   在 Maven 中：

    ```xml
    <configuration>
        <args>
            <arg>-Xuse-ir</arg>
        </args>
    </configuration>
    ```

关于 JVM IR 后端带来的更改的更多信息，请参阅[这篇博客文章](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)。

## Kotlin/Native

### 性能改进

Kotlin/Native 在 1.4.30 中获得了各种性能改进，从而缩短了编译时间。例如，在 [使用 Kotlin Multiplatform Mobile 进行网络和数据存储](https://github.com/kotlin-hands-on/kmm-networking-and-data-storage/tree/final) 示例中，重建 `framework` 所需的时间已从 9.5 秒（在 1.4.10 中）减少到 4.5 秒（在 1.4.30 中）。

### Apple watchOS 64 位模拟器目标平台

watchOS 的 x86 模拟器**目标平台**自 7.0 版本起已被弃用。为了跟上最新的 watchOS 版本，Kotlin/Native 提供了新的**目标平台** `watchosX64`，用于在 64 位架构上运行模拟器。

### 支持 Xcode 12.2 库

我们添加了对 Xcode 12.2 随附的新库的支持。你现在可以从 Kotlin 代码中使用它们。

## Kotlin/JS

### 顶层属性的惰性初始化

> 顶层属性的惰性初始化是[实验性的](components-stability.md)。它可能随时移除或更改。
> 仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44320) 上，我们将不胜感激。
>
{style="warning"}

Kotlin/JS 的 [IR 后端](js-ir-compiler.md)正在获得顶层属性惰性初始化的原型实现。这减少了应用程序启动时初始化所有顶层属性的需要，并应显著改善应用程序启动时间。

我们将继续致力于惰性初始化，请你尝试当前原型，并将你的想法和结果分享到这个 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-44320)或官方 [Kotlin Slack](https://kotlinlang.slack.com) 中的 [`#javascript`](https://kotlinlang.slack.com/archives/C0B8L3U69) 频道（在此[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）。

要使用惰性初始化，在使用 JS IR 编译器编译代码时添加 `-Xir-property-lazy-initialization` 编译器选项。

## Gradle 项目改进

### 支持 Gradle 配置缓存

从 1.4.30 开始，Kotlin Gradle 插件支持[配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)特性。它加快了构建过程：一旦你运行命令，Gradle 就会执行配置阶段并计算任务图。Gradle 会缓存结果并将其重复用于后续构建。

要开始使用此特性，你可以[使用 Gradle 命令](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)或[设置基于 IntelliJ 的 IDE]( https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:ide:intellij)。

## 标准库

### 用于文本大小写转换的与区域设置无关的 API

> 与区域设置无关的 API **特性**是[实验性的](components-stability.md)。它可能随时移除或更改。
> 仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-42437) 上，我们将不胜感激。
>
{style="warning"}

此版本引入了实验性的与区域设置无关的 API，用于更改字符串和字符的大小写。当前的 `toLowerCase()`、`toUpperCase()`、`capitalize()`、`decapitalize()` API 函数是区域设置敏感的。这意味着不同的平台区域设置会影响代码行为。例如，在土耳其语区域设置中，当字符串 "kotlin" 使用 `toUpperCase` 转换时，结果是 "KOTLİN"，而不是 "KOTLIN"。

```kotlin
// current API
println("Needs to be capitalized".toUpperCase()) // NEEDS TO BE CAPITALIZED

// new API
println("Needs to be capitalized".uppercase()) // NEEDS TO BE CAPITALIZED
```

Kotlin 1.4.30 提供了以下替代方案：

*   对于 `String` 函数：

    |**早期版本**|**1.4.30 替代方案**|
    | --- | --- |
    |`String.toUpperCase()`|`String.uppercase()`|
    |`String.toLowerCase()`|`String.lowercase()`|
    |`String.capitalize()`|`String.replaceFirstChar { it.uppercase() }`|
    |`String.decapitalize()`|`String.replaceFirstChar { it.lowercase() }`|

*   对于 `Char` 函数：

    |**早期版本**|**1.4.30 替代方案**|
    | --- | --- |
    |`Char.toUpperCase()`|`Char.uppercaseChar(): Char`<br/>`Char.uppercase(): String`|
    |`Char.toLowerCase()`|`Char.lowercaseChar(): Char`<br/>`Char.lowercase(): String`|
    |`Char.toTitleCase()`|`Char.titlecaseChar(): Char`<br/>`Char.titlecase(): String`|

> 对于 Kotlin/JVM，还存在带有显式 `Locale` 形参的重载 `uppercase()`、`lowercase()` 和 `titlecase()` 函数。
>
{style="note"}

关于文本处理函数的完整更改列表，请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/locale-agnostic-string-conversions.md)。

### Char 到数字与代码的清晰转换

> 用于 `Char` 转换**特性**的明确 API 是[实验性的](components-stability.md)。它可能随时移除或更改。
> 仅将其用于求值目的。如果你能将反馈提交到 [YouTrack](https://youtrack.jetbrains.com/issue/KT-44333) 上，我们将不胜感激。
>
{style="warning"}

当前的 `Char` 到数字的转换函数（返回以不同数字类型表示的 UTF-16 代码）经常与类似的 String 到 Int 转换（返回字符串的数值）混淆：

```kotlin
"4".toInt() // 返回 4
'4'.toInt() // 返回 52
// 并且没有返回 Char '4' 的数值 4 的通用函数
```

为了避免这种混淆，我们决定将 `Char` 转换分为以下两组命名清晰的函数：

*   获取 `Char` 的整数代码并根据给定代码构造 `Char` 的函数：

    ```kotlin
    fun Char(code: Int): Char
    fun Char(code: UShort): Char
    val Char.code: Int
    ```

*   将 `Char` 转换为其所代表数字的数值的函数：

    ```kotlin
    fun Char.digitToInt(radix: Int): Int
    fun Char.digitToIntOrNull(radix: Int): Int?
    ```
*   一个 `Int` 的扩展函数，用于将其所代表的非负单个数字转换为相应的 `Char` 表示：

    ```kotlin
    fun Int.digitToChar(radix: Int): Char
    ```

更多详情请参见 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/stdlib/char-int-conversions.md)。

## 序列化更新

随着 Kotlin 1.4.30 的发布，我们同时发布了 `kotlinx.serialization` [1.1.0-RC](https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.1.0-RC)，它包含一些新特性：

*   Inline class 序列化支持
*   无符号原生类型序列化支持

### Inline class 序列化支持

从 Kotlin 1.4.30 开始，你可以使 inline class [可序列化](serialization.md)：

```kotlin
@Serializable
inline class Color(val rgb: Int)
```

> 该**特性**需要新的 1.4.30 IR 编译器。
>
{style="note"}

序列化框架在可序列化的 inline class 被用于其他可序列化类时不会对其进行装箱。

更多信息请参阅 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#serializable-inline-classes)。

### 无符号原生类型序列化支持

从 1.4.30 开始，你可以使用 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization) 的标准 JSON 序列化器来处理无符号原生类型：`UInt`、`ULong`、`UByte` 和 `UShort`：

```kotlin
@Serializable
class Counter(val counted: UByte, val description: String)
fun main() {
   val counted = 239.toUByte()
   println(Json.encodeToString(Counter(counted, "tries")))
}
```

更多信息请参阅 `kotlinx.serialization` [文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/inline-classes.md#unsigned-types-support-json-only)。