[//]: # (title: Kotlin 1.7.20 有哪些新特性)

<tldr>
   <p>Kotlin 1.7.20 的 IDE 支持适用于 IntelliJ IDEA 2021.3、2022.1 和 2022.2。</p>
</tldr>

_[发布日期：2022 年 9 月 29 日](releases.md#release-details)_

Kotlin 1.7.20 版本已发布！以下是本次发布的一些亮点：

* [新的 Kotlin K2 编译器支持 `all-open`、带接收者的 SAM、Lombok 和其他编译器插件](#support-for-kotlin-k2-compiler-plugins)
* [我们引入了用于创建开放区间的 `..<` 操作符预览版](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 内存管理器现在默认启用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我们为 JVM 引入了一项新的实验性特性：具有泛型底层类型的内联类](#generic-inline-classes)

你还可以通过此视频了解更改的简要概述：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="Kotlin 1.7.20 有哪些新特性"/>

## 对 Kotlin K2 编译器插件的支持

Kotlin 团队持续稳定化 K2 编译器。
K2 仍处于 **Alpha** 阶段（正如在 [Kotlin 1.7.0 发布](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中宣布的），但它现在支持多种编译器插件。你可以关注 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604) 以获取 Kotlin 团队关于新编译器的更新。

从 Kotlin 1.7.20 发布开始，Kotlin K2 编译器支持以下插件：

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新的 K2 编译器的 Alpha 版本仅适用于 JVM 项目。
> 它不支持 Kotlin/JS、Kotlin/Native 或其他多平台项目。
>
{style="warning"}

在以下视频中了解更多关于新编译器及其优势：
* [通往新 Kotlin 编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 编译器：自上而下的视图](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用 Kotlin K2 编译器并进行测试，请使用以下编译器选项：

```bash
-Xuse-k2
```

你可以在 `build.gradle(.kts)` 文件中指定它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</tab>
</tabs>

查看 JVM 项目的性能提升，并将其与旧编译器的结果进行比较。

### 留下你对新 K2 编译器的反馈

我们非常感谢你以任何形式提供的反馈：
* 在 Kotlin Slack 中直接向 K2 开发者提供反馈：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 向 [我们的 issue 追踪器](https://kotl.in/issue) 报告你使用新 K2 编译器时遇到的任何问题。
* [启用 **发送使用统计** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允许 JetBrains 收集关于 K2 使用情况的匿名数据。

## 语言

Kotlin 1.7.20 引入了新语言特性的预览版，并对构建器类型推断施加了限制：

* [用于创建开放区间的 `..<` 操作符预览版](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的数据对象声明](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [新的构建器类型推断限制](#new-builder-type-inference-restrictions)

### 用于创建开放区间的 `..<` 操作符预览版

> 新的操作符是[实验性的](components-stability.md#stability-levels-explained)，目前在 IDE 中支持有限。
>
{style="warning"}

本次发布引入了新的 `..<` 操作符。Kotlin 拥有 `..` 操作符来表示一个值区间。新的 `..<`
操作符作用类似于 `until` 函数，可以帮助你定义开放区间。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="用于开放区间的新操作符"/>

我们的研究表明，这个新的操作符能更好地表达开放区间，并明确表明上限不包含在内。

以下是在 `when` 表达式中使用 `..<` 操作符的示例：

```kotlin
when (value) {
    in 0.0..<0.25 -> // First quarter
    in 0.25..<0.5 -> // Second quarter
    in 0.5..<0.75 -> // Third quarter
    in 0.75..1.0 ->  // Last quarter  <- Note closed range here
}
```
{validate="false"}

#### 标准库 API 变更

以下新的类型和操作将在公共 Kotlin 标准库的 `kotlin.ranges` 包中引入：

##### 新的 OpenEndRange&lt;T&gt; 接口

用于表示开放区间的新接口与现有的 `ClosedRange<T>` 接口非常相似：

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // Lower bound
    val start: T
    // Upper bound, not included in the range
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 在现有可迭代区间中实现 OpenEndRange

当开发者需要获取一个不包含上限的区间时，他们目前使用 `until` 函数来有效地生成一个包含相同值的闭合可迭代区间。为了使这些区间在新 API 中（该 API 接收 `OpenEndRange<T>`）可接受，我们希望在现有的可迭代区间（`IntRange`、`LongRange`、`CharRange`、`UIntRange` 和 `ULongRange`）中实现该接口。因此它们将同时实现 `ClosedRange<T>` 和 `OpenEndRange<T>` 接口。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 标准类型的 rangeUntil 操作符

`rangeUntil` 操作符将为目前由 `rangeTo` 操作符定义的相同类型和组合提供。我们以扩展函数形式提供它们用于原型目的，但为保持一致性，我们计划在稳定开放区间 API 之前将它们转换为成员。

#### 如何启用 `..<` 操作符

要使用 `..<` 操作符或为自己的类型实现该操作符约定，请启用 `-language-version 1.8` 编译器选项。

为支持标准类型的开放区间而引入的新 API 元素需要选择性加入，这对于实验性标准库 API 来说是惯例：`@OptIn(ExperimentalStdlibApi::class)`。或者，你可以使用 `-opt-in=kotlin.ExperimentalStdlibApi` 编译器选项。

[在此 KEEP 文档中阅读更多关于新操作符的信息](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### 数据对象改进单例和密封类层次结构的字符串表示

> 数据对象是[实验性的](components-stability.md#stability-levels-explained)，目前在 IDE 中支持有限。
>
{style="warning"}

本次发布引入了一种新的 `object` 声明类型供你使用：`data object`。[数据对象](https://youtrack.jetbrains.com/issue/KT-4107) 在概念上与常规 `object` 声明行为相同，但自带清晰的 `toString` 表示。

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Kotlin 1.7.20 中的数据对象"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

这使得 `data object` 声明非常适合密封类层次结构，你可以在其中将它们与 `data class` 声明一起使用。在此代码片段中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它将获得一个漂亮的 `toString`，无需手动覆盖，与附带的 `data class` 定义保持对称：

```kotlin
sealed class ReadResult {
    data class Number(val value: Int) : ReadResult()
    data class Text(val value: String) : ReadResult()
    data object EndOfFile : ReadResult()
}

fun main() {
    println(ReadResult.Number(1)) // Number(value=1)
    println(ReadResult.Text("Foo")) // Text(value=Foo)
    println(ReadResult.EndOfFile) // EndOfFile
}
```

#### 如何启用数据对象

要在代码中使用数据对象声明，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过在 `build.gradle(.kts)` 中添加以下内容来实现：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</tab>
</tabs>

在[相应的 KEEP 文档](https://github.com/Kotlin/KEEP/pull/316)中阅读更多关于数据对象的信息，并分享你对其实现的反馈。

### 新的构建器类型推断限制

Kotlin 1.7.20 对[构建器类型推断的使用](using-builders-with-builder-inference.md)施加了一些主要限制，这可能会影响你的代码。这些限制适用于包含构建器 lambda 表达式的函数，在这种情况下，在不分析 lambda 表达式本身的情况下无法推导出形参。该形参用作实参。现在，编译器总是会为此类代码显示错误，并要求你显式指定类型。

这是一个破坏性更改，但我们的研究表明，这些情况非常罕见，这些限制不应该影响你的代码。如果确实影响了，请考虑以下情况：

* 带有隐藏成员的扩展的构建器推断。

  如果你的代码包含一个在构建器推断期间使用的同名扩展函数，编译器会显示错误：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // Resolves to 2 and leads to error
        }
    }
    ```
    {validate="false"} 
  
  要修复代码，你应该显式指定类型：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // Type argument!
            this.add(Data())
            this.get(0).doSmth() // Resolves to 1
        }
    }
    ```

* 具有多个 lambda 表达式且类型实参未显式指定的构建器推断。

  如果在构建器推断中有两个或更多 lambda 代码块，它们会影响类型。为防止出现错误，编译器要求你指定类型：

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() -> Unit, 
        second: MutableList<T>.() -> Unit
    ): List<T> {
        val list = mutableListOf<T>()
        list.first()
        list.second()
        return list 
    }
    
    fun main() {
        buildList(
            first = { // this: MutableList<String>
                add("")
            },
            second = { // this: MutableList<Int> 
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```
    {validate="false"}

  要修复此错误，你应该显式指定类型并修复类型不匹配：

    ```kotlin
    fun main() {
        buildList<Int>(
            first = { // this: MutableList<Int>
                add(0)
            },
            second = { // this: MutableList<Int>
                val i: Int = get(0)
                println(i)
            }
        )
    }
    ```

如果你没有找到你上述提及的情况，请向我们团队[提交 issue](https://kotl.in/issue)。

关于此构建器推断更新的更多信息，请参阅此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797)。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型内联类，增加了对委托属性的字节码优化，并支持 kapt stub 生成任务中的 IR，使得可以将所有最新的 Kotlin 特性与 kapt 一起使用：

* [泛型内联类](#generic-inline-classes)
* [委托属性的更多优化用例](#more-optimized-cases-of-delegated-properties)
* [kapt stub 生成任务中对 JVM IR 后端的支持](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型内联类

> 泛型内联类是一项[实验性的](components-stability.md#stability-levels-explained)特性。
> 它随时可能被取消或更改。需要选择性加入（详见下文），且仅应将其用于评估目的。
> 我们期待你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供关于此功能的反馈。
>
{style="warning"}

Kotlin 1.7.20 允许 JVM 内联类的底层类型作为类型形参。编译器将其映射到 `Any?`，或者通常映射到类型形参的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Kotlin 1.7.20 中的泛型内联类"/>

请看以下示例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

该函数将内联类作为形参。该形参映射到上限，而不是类型实参。

要启用此特性，请使用 `-language-version 1.8` 编译器选项。

我们期待你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供关于此特性的反馈。

### 委托属性的更多优化用例

在 Kotlin 1.6.0 中，我们通过省略 `$delegate` 字段并[生成对引用属性的即时访问](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)来优化委托给属性的用例。在 1.7.20 中，我们将此优化应用于更多用例。
如果委托是以下情况，现在将省略 `$delegate` 字段：

* 具名对象：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 一个带有[幕后字段](properties.md#backing-fields)且在同一模块中具有默认 getter 的 final `val` 属性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 一个常量表达式、一个枚举项、`this` 或 `null`。以下是 `this` 的示例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

了解更多关于[委托属性](delegated-properties.md)的信息。

我们期待你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 上提供关于此特性的反馈。

### kapt stub 生成任务中对 JVM IR 后端的支持

> kapt stub 生成任务中对 JVM IR 后端的支持是一项[实验性的](components-stability.md)特性。
> 它随时可能被更改。需要选择性加入（详见下文），且仅应将其用于评估目的。
>
{style="warning"}

在 1.7.20 之前，kapt stub 生成任务使用旧后端，并且[可重复注解](annotations.md#repeatable-annotations)不适用于 [kapt](kapt.md)。通过 Kotlin 1.7.20，我们增加了对 kapt stub 生成任务中 [JVM IR 后端](whatsnew15.md#stable-jvm-ir-backend)的支持。这使得可以将所有最新的 Kotlin 特性与 kapt 一起使用，包括可重复注解。

要在 kapt 中使用 IR 后端，请将以下选项添加到你的 `gradle.properties` 文件中：

```none
kapt.use.jvm.ir=true
```

我们期待你能在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上提供关于此特性的反馈。

## Kotlin/Native

Kotlin 1.7.20 自带默认启用的新 Kotlin/Native 内存管理器，并提供自定义 `Info.plist` 文件的选项：

* [新的默认内存管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自定义 Info.plist 文件](#customizing-the-info-plist-file)

### 新的 Kotlin/Native 内存管理器默认启用

本次发布为新的内存管理器带来了进一步的稳定性和性能改进，使我们能够将新的内存管理器提升到 [Beta](components-stability.md) 版。

以前的内存管理器使编写并发和异步代码变得复杂，包括在实现 `kotlinx.coroutines` 库时遇到的问题。这阻碍了 Kotlin Multiplatform Mobile 的采用，因为并发限制在 iOS 和 Android 平台之间共享 Kotlin 代码时造成了问题。新的内存管理器最终为[将 Kotlin Multiplatform Mobile 提升到 Beta 版](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/)铺平了道路。

新的内存管理器还支持编译器缓存，这使得编译时间与以前的版本相当。有关新的内存管理器的更多优势，请参阅我们关于预览版的原始[博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。你可以在[文档](native-memory-manager.md)中找到更多技术细节。

#### 配置和设置

从 Kotlin 1.7.20 开始，新的内存管理器是默认设置。无需太多额外设置。

如果你已经手动开启了它，你可以从 `gradle.properties` 中移除 `kotlin.native.binary.memoryModel=experimental` 选项，或者从 `build.gradle(.kts)` 文件中移除 `binaryOptions["memoryModel"] = "experimental"`。

如有必要，你可以使用 `gradle.properties` 文件中的 `kotlin.native.binary.memoryModel=strict` 选项切换回旧版内存管理器。然而，编译器缓存支持不再适用于旧版内存管理器，因此编译时间可能会变长。

#### 冻结

在新的内存管理器中，冻结已被废弃。除非你的代码需要与旧版管理器一起使用（旧版管理器仍然需要冻结），否则请勿使用它。这可能对需要维护对旧版内存管理器支持的库作者，或希望在新的内存管理器遇到问题时有备用方案的开发者有所帮助。

在这种情况下，你可以暂时支持新旧内存管理器代码。要忽略废弃警告，请执行以下操作之一：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 注解废弃 API 的用法。
* 将 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 应用于 Gradle 中的所有 Kotlin 源代码集。
* 传递编译器标志 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 从 Swift/Objective-C 调用 Kotlin 挂起函数

新的内存管理器仍然限制从主线程以外的线程从 Swift 和 Objective-C 调用 Kotlin `suspend` 函数，但你可以通过新的 Gradle 选项解除它。

此限制最初是在旧版内存管理器中引入的，原因是代码分派了一个续体以在原始线程上恢复。如果此线程没有受支持的事件循环，任务将永远不会运行，并且协程将永远不会恢复。

在某些情况下，此限制不再需要，但对所有必要条件的检测无法轻易实现。因此，我们决定将其保留在新内存管理器中，同时引入一个选项供你禁用它。

为此，请将以下选项添加到你的 `gradle.properties` 中：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果你使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他具有相同“分派到原始线程”方法的库，请勿添加此选项。
>
{style="warning"}

Kotlin 团队非常感谢 [Ahmed El-Helw](https://github.com/ahmedre) 实现了此选项。

#### 留下你的反馈

这是我们生态系统的一个重大更改。我们期待你提供反馈，以帮助我们使其变得更好。

在你的项目中试用新的内存管理器，并在[我们的 issue 追踪器 YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 自定义 Info.plist 文件

当生成 framework 时，Kotlin/Native 编译器会生成信息属性列表文件 `Info.plist`。此前，自定义其内容很繁琐。通过 Kotlin 1.7.20，你可以直接设置以下属性：

| 属性                     | 二进制选项              |
|--------------------------|-------------------------|
| `CFBundleIdentifier`     | `bundleId`              |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`        | `bundleVersion`         |

为此，请使用相应的二进制选项。传递 `-Xbinary=$option=$value` 编译器标志，或为所需的 framework 设置 `binaryOption(option, value)` Gradle DSL。

Kotlin 团队非常感谢 Mads Ager 实现了此特性。

## Kotlin/JS

Kotlin/JS 获得了一些增强，提升开发者体验并提高性能：

* Klib 生成在增量构建和干净构建中都更快，这得益于依赖项加载的效率提升。
* [开发二进制文件的增量编译](js-ir-compiler.md#incremental-compilation-for-development-binaries)已重做，从而在干净构建场景中取得了重大改进，实现了更快的增量构建和稳定性修复。
* 我们改进了 `.d.ts` 的生成，以支持嵌套对象、密封类和构造函数中具有默认值的形参。

## Gradle

Kotlin Gradle 插件的更新专注于与新的 Gradle 特性和最新的 Gradle 版本的兼容性。

Kotlin 1.7.20 包含对 Gradle 7.1 的支持更改。废弃的方法和属性已移除或替换，减少了 Kotlin Gradle 插件产生的废弃警告数量，并解除了对 Gradle 8.0 未来支持的阻碍。

然而，有一些潜在的破坏性更改可能需要你关注：

### 目标配置

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 现在有一个泛型形参：`SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 约定已被废弃。作为替代，你仍然可以使用 `kotlin.targets { fromPreset() }`，但我们建议[显式设置目标](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html#targets)。
* 由 Gradle 自动生成的目标访问器在 `kotlin.targets { }` 代码块中不再可用。请改用 `findByName("targetName")` 方法。

  请注意，此类访问器在 `kotlin.targets` 的情况下仍然可用，例如 `kotlin.targets.linuxX64`。

### 源代码目录配置

Kotlin Gradle 插件现在将 Kotlin `SourceDirectorySet` 作为 `kotlin` 扩展添加到 Java 的 `SourceSet` 组。这使得可以在 `build.gradle.kts` 文件中配置源代码目录，类似于在 [Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中配置的方式：

```kotlin
sourceSets {
    main {
        kotlin {
            java.setSrcDirs(listOf("src/java"))
            kotlin.setSrcDirs(listOf("src/kotlin"))
        }
    }
}
```

你不再需要使用废弃的 Gradle 约定并指定 Kotlin 的源代码目录。

请记住，你还可以使用 `kotlin` 扩展来访问 `KotlinSourceSet`：

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### JVM 工具链配置的新方法

本次发布提供了一种新的 `jvmToolchain()` 方法来启用 [JVM 工具链特性](gradle-configure-project.md#gradle-java-toolchains-support)。如果你不需要任何额外的[配置字段](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，例如 `implementation` 或 `vendor`，你可以从 Kotlin 扩展中使用此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

这简化了 Kotlin 项目设置过程，无需任何额外配置。
在此发布之前，你只能通过以下方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 标准库

Kotlin 1.7.20 为 `java.nio.file.Path` 类提供了新的[扩展函数](extensions.md#extension-functions)，允许你遍历文件树：

* `walk()` 惰性遍历以指定路径为根的文件树。
* `fileVisitor()` 使得可以单独创建 `FileVisitor`。`FileVisitor` 定义了遍历目录和文件时的操作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 接受一个已准备好的 `FileVisitor` 并在底层使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用 `builderAction` 创建一个 `FileVisitor` 并调用 `visitFileTree(fileVisitor, ...)` 函数。
* `FileVisitResult` 是 `FileVisitor` 的返回类型，其默认值为 `CONTINUE`，它会继续处理文件。

> 为 `java.nio.file.Path` 提供的新扩展函数是[实验性的](components-stability.md)。
> 它们随时可能被更改。需要选择性加入（详见下文），且仅应将其用于评估目的。
>
{style="warning"}

以下是你使用这些新扩展函数可以做的一些事情：

* 显式创建一个 `FileVisitor`，然后使用：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 创建一个 `FileVisitor` 并立即使用：

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes ->
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* 遍历以指定路径为根的文件树，使用 `walk()` 函数：

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ ->
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ ->
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory ->
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory ->
          buildDirectory.createDirectory()
          buildDirectory.resolve("Project.jar").createFile()
      }
  
   
  // Use walk function:
      val directoryStructure = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructure, "[, build, build/Project.jar, src, src/A.class, src/A.kt]")
  
      rootDirectory.visitFileTree(cleanVisitor)
  
      val directoryStructureAfterClean = rootDirectory.walk(PathWalkOption.INCLUDE_DIRECTORIES)
          .map { it.relativeTo(rootDirectory).toString() }
          .toList().sorted()
      assertPrints(directoryStructureAfterClean, "[, src, src/A.kt]")
  //sampleEnd
  }
  ```

正如实验性 API 的惯例，新的扩展需要选择性加入：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi`。或者，你可以使用编译器选项：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我们期待你能在 YouTrack 中提供关于 [`walk()` 函数](https://youtrack.jetbrains.com/issue/KT-52909)和 [visit 扩展函数](https://youtrack.jetbrains.com/issue/KT-52910)的反馈。

## 文档更新

自上次发布以来，Kotlin 文档获得了一些显著的更改：

### 改进和增强的页面

* [基本类型概述](types-overview.md) – 了解 Kotlin 中使用的基本类型：数字、布尔值、字符、字符串、数组和无符号整数。
* [用于 Kotlin 开发的 IDE](kotlin-ide.md) – 查看具有官方 Kotlin 支持的 IDE 列表以及具有社区支持插件的工具。

### Kotlin 多平台期刊中的新文章

* [原生和跨平台应用开发：如何选择？](https://kotlinlang.org/docs/multiplatform/native-and-cross-platform.html) – 查看我们关于跨平台应用开发和原生方法的概述和优势。
* [六个最佳跨平台应用开发框架](https://kotlinlang.org/docs/multiplatform/cross-platform-frameworks.html) – 阅读关于关键方面的内容，帮助你为跨平台项目选择合适的框架。

### 新的和更新的教程

* [Kotlin 多平台入门](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html) – 了解使用 Kotlin 进行跨平台移动开发，并创建一个可在 Android 和 iOS 上运行的应用。
* [使用 React 和 Kotlin/JS 构建 Web 应用程序](js-react.md) – 创建一个浏览器应用，探索 Kotlin 的 DSL 和典型 React 程序的特性。

### 发布文档中的更改

我们不再为每个版本提供推荐的 kotlinx 库列表。此列表仅包含与 Kotlin 本身推荐和测试的版本。它没有考虑到某些库相互依赖，并且需要特殊的 kotlinx 版本，这可能与推荐的 Kotlin 版本不同。

我们正在寻找一种方式来提供关于库如何相互关联和依赖的信息，以便明确在升级项目中 Kotlin 版本时应使用哪个 kotlinx 库版本。

## 安装 Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.7.20。

> 对于 Android Studio Dolphin (213)、Electric Eel (221) 和 Flamingo (222)，Kotlin 插件 1.7.20 将随即将到来的 Android Studio 更新一同交付。
>
{style="note"}

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20)下载。

### Kotlin 1.7.20 兼容性指南

尽管 Kotlin 1.7.20 是一个增量发布，但为了限制 Kotlin 1.7.0 中引入的问题扩散，我们仍然不得不做出一些不兼容更改。

有关此类更改的详细列表，请参阅 [Kotlin 1.7.20 兼容性指南](compatibility-guide-1720.md)。