[//]: # (title: Kotlin 1.7.20 有哪些新特性)

<tldr>
   <p>IntelliJ IDEA 2021.3、2022.1 和 2022.2 支持 Kotlin 1.7.20 的 IDE。</p>
</tldr>

_[发布日期：2022 年 9 月 29 日](releases.md#release-details)_

Kotlin 1.7.20 版本发布！以下是此版本的一些亮点：

* [新的 Kotlin K2 编译器支持 `all-open`、带有接收者的 SAM、Lombok 及其他编译器插件](#support-for-kotlin-k2-compiler-plugins)
* [我们引入了 `..<` 运算符的预览版，用于创建开放区间](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 内存管理器现在默认启用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我们为 JVM 引入了一项新的实验性特性：具有泛型底层类型的内联类](#generic-inline-classes)

你也可以通过此视频简要了解这些变更：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## 支持 Kotlin K2 编译器插件

Kotlin 团队持续稳定 K2 编译器。
K2 仍处于 **Alpha** 阶段（正如 [Kotlin 1.7.0 版本](whatsnew17.md#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中宣布的），
但它现在支持多种编译器插件。你可以关注 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604)
以获取 Kotlin 团队关于新编译器的最新动态。

从 1.7.20 版本开始，Kotlin K2 编译器支持以下插件：

* [`all-open`](all-open-plugin.md)
* [`no-arg`](no-arg-plugin.md)
* [带有接收者的 SAM](sam-with-receiver-plugin.md)
* [Lombok](lombok.md)
* AtomicFU
* `jvm-abi-gen`

> 新 K2 编译器的 Alpha 版本仅适用于 JVM 项目。
> 它不支持 Kotlin/JS、Kotlin/Native 或其他多平台项目。
>
{style="warning"}

通过以下视频了解有关新编译器及其优势的更多信息：
* [新 Kotlin 编译器之路](https://www.youtube.com/watch?v=iTdJJq_LyoY)
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

在你的 JVM 项目上查看性能提升，并将其与旧编译器的结果进行比较。

### 留下你对新 K2 编译器的反馈

我们非常感谢你以任何形式提供的反馈：
* 直接在 Kotlin Slack 中向 K2 开发者提供反馈：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 向 [我们的问题跟踪器](https://kotl.in/issue) 报告你使用新 K2 编译器遇到的任何问题。
* [启用 **Send usage statistics** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

Kotlin 1.7.20 引入了新语言功能的预览版本，并对构建器类型推断 (builder type inference) 施加了限制：

* [用于创建开放区间 (open-ended ranges) 的 `..<` 运算符预览版](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的数据对象 (data object) 声明](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [构建器类型推断 (builder type inference) 限制](#new-builder-type-inference-restrictions)

### 用于创建开放区间 (open-ended ranges) 的 `..<` 运算符预览版

> 新运算符是 [实验性功能 (Experimental)](components-stability.md#stability-levels-explained)，并且在 IDE 中的支持有限。
>
{style="warning"}

此版本引入了新的 `..<` 运算符。Kotlin 有 `..` 运算符来表示值范围。新的 `..<` 运算符作用类似于 `until` 函数，可以帮助你定义开放区间 (open-ended range)。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

我们的研究表明，这个新运算符能更好地表达开放区间，并明确表明不包含上限 (upper bound)。

以下是在 `when` 表达式中使用 `..<` 运算符的示例：

```kotlin
when (value) {
    in 0.0..<0.25 -> // 第一季度
    in 0.25..<0.5 -> // 第二季度
    in 0.5..<0.75 -> // 第三季度
    in 0.75..1.0 ->  // 最后一季度  <- 注意这里是闭区间
}
```
{validate="false"}

#### 标准库 API 变更

以下新类型和操作将在公共 Kotlin 标准库的 `kotlin.ranges` 包中引入：

##### 新的 OpenEndRange&lt;T&gt; 接口

表示开放区间的新接口与现有 `ClosedRange<T>` 接口非常相似：

```kotlin
interface OpenEndRange<T : Comparable<T>> {
    // 下限
    val start: T
    // 上限，不包含在范围内
    val endExclusive: T
    operator fun contains(value: T): Boolean = value >= start && value < endExclusive
    fun isEmpty(): Boolean = start >= endExclusive
}
```
{validate="false"}

##### 在现有可迭代区间中实现 OpenEndRange

当开发者需要获取一个不包含上限的区间时，他们目前使用 `until` 函数来有效地生成一个具有相同值的闭合可迭代区间。为了使这些区间在接受 `OpenEndRange<T>` 的新 API 中可用，我们希望在现有可迭代区间中实现该接口：`IntRange`、`LongRange`、`CharRange`、`UIntRange` 和 `ULongRange`。因此，它们将同时实现 `ClosedRange<T>` 和 `OpenEndRange<T>` 接口。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```
{validate="false"}

##### 标准类型的 rangeUntil 运算符

`rangeUntil` 运算符将为目前由 `rangeTo` 运算符定义的相同类型和组合提供。我们将其作为扩展函数用于原型目的，但为了保持一致性，我们计划在开放区间 API 稳定之前将其作为成员。

#### 如何启用 `..<` 运算符

要使用 `..<` 运算符或为你自己的类型实现该运算符约定，请启用 `-language-version 1.8` 编译器选项。

为支持标准类型的开放区间而引入的新 API 元素需要选择加入 (opt-in)，这与实验性标准库 API 的惯例一样：`@OptIn(ExperimentalStdlibApi::class)`。或者，你可以使用 `-opt-in=kotlin.ExperimentalStdlibApi` 编译器选项。

[在此 KEEP 文档中阅读有关新运算符的更多信息](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)。

### 使用数据对象 (data objects) 改进单例和密封类层次结构的字符串表示

> 数据对象 (Data objects) 是 [实验性功能 (Experimental)](components-stability.md#stability-levels-explained)，目前在 IDE 中的支持有限。
>
{style="warning"}

此版本引入了一种你可以使用的新 `object` 声明类型：`data object`。[数据对象](https://youtrack.jetbrains.com/issue/KT-4107) 在概念上与常规 `object` 声明相同，但开箱即用地提供了清晰的 `toString` 表示。

<video src="https://www.youtube.com/v/ovAqcwFhEGc" title="Data objects in Kotlin 1.7.20"/>

```kotlin
package org.example
object MyObject
data object MyDataObject

fun main() {
    println(MyObject) // org.example.MyObject@1f32e575
    println(MyDataObject) // MyDataObject
}
```

这使得 `data object` 声明非常适合密封类层次结构，你可以在其中与 `data class` 声明一起使用它们。在此代码片段中，将 `EndOfFile` 声明为 `data object` 而不是普通的 `object` 意味着它将获得一个漂亮的 `toString` 而无需手动重写，从而与伴随的 `data class` 定义保持对称性：

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

#### 如何启用数据对象 (data objects)

要在代码中使用数据对象声明，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，你可以通过将以下内容添加到 `build.gradle(.kts)` 来实现：

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

[在此 KEEP 文档中阅读有关数据对象的更多信息](https://github.com/Kotlin/KEEP/pull/316)，并分享你对其实现的反馈。

### 新的构建器类型推断 (builder type inference) 限制

Kotlin 1.7.20 对 [构建器类型推断的使用](using-builders-with-builder-inference.md) 施加了一些主要限制，这可能会影响你的代码。这些限制适用于包含构建器 lambda 函数的代码，在这种情况下，如果不分析 lambda 本身，则无法推导出参数。该参数用作参数。现在，编译器将始终对此类代码显示错误，并要求你明确指定类型。

这是一个重大变更 (breaking change)，但我们的研究表明这些情况非常罕见，并且这些限制不应影响你的代码。如果它们确实影响了，请考虑以下情况：

* 带有隐藏成员的扩展的构建器推断。

  如果你的代码包含一个在构建器推断期间将使用的同名扩展函数，编译器将显示错误：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList {
            this.add(Data())
            this.get(0).doSmth() // 解析为 2 并导致错误
        }
    }
    ```
    {validate="false"} 
  
  要修复此代码，你应该明确指定类型：

    ```kotlin
    class Data {
        fun doSmth() {} // 1
    }
    
    fun <T> T.doSmth() {} // 2
    
    fun test() {
        buildList<Data> { // 类型参数！
            this.add(Data())
            this.get(0).doSmth() // 解析为 1
        }
    }
    ```

* 具有多个 lambda 且未明确指定类型参数的构建器推断。

  如果构建器推断中有两个或更多 lambda 块，它们会影响类型。为了防止错误，编译器要求你指定类型：

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

  要修复此错误，你应该明确指定类型并修复类型不匹配：

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

如果你没有找到上述情况，请向 [我们的团队提交 issue](https://kotl.in/issue)。

[在此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797) 中了解有关此构建器推断更新的更多信息。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型内联类 (generic inline classes)，为委托属性 (delegated properties) 增加了更多字节码优化，并支持 kapt 存根生成任务中的 IR，从而可以使用 kapt 支持所有最新的 Kotlin 特性：

* [泛型内联类 (Generic inline classes)](#generic-inline-classes)
* [更多委托属性 (delegated properties) 优化案例](#more-optimized-cases-of-delegated-properties)
* [kapt 存根生成任务中对 JVM IR 后端 (backend) 的支持](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型内联类 (Generic inline classes)

> 泛型内联类是 [实验性功能 (Experimental)](components-stability.md#stability-levels-explained)。它可能随时被删除或更改。需要选择加入 (opt-in)（详见下文），并且你应仅将其用于评估目的。我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上提供反馈。
>
{style="warning"}

Kotlin 1.7.20 允许 JVM 内联类 (inline classes) 的底层类型为类型参数。编译器将其映射到 `Any?` 或通常映射到类型参数的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

考虑以下示例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 编译器生成 fun compute-<hashcode>(s: Any?)
```

该函数接受内联类作为参数。该参数被映射到上限 (upper bound)，而不是类型参数 (type argument)。

要启用此功能，请使用 `-language-version 1.8` 编译器选项。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 上对此功能提供反馈。

### 更多委托属性 (delegated properties) 的优化案例

在 Kotlin 1.6.0 中，我们通过省略 `$delegate` 字段并[生成对引用属性的即时访问](whatsnew16.md#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)来优化委托给属性的情况。在 1.7.20 中，我们为更多情况实现了此优化。
如果委托是以下情况，现在将省略 `$delegate` 字段：

* 一个命名对象 (named object)：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  {validate="false"}

* 一个在同一模块中具有 [支持字段 (backing field)](properties.md#backing-fields) 和默认 getter 的 `final val` 属性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  {validate="false"}

* 一个常量表达式 (constant expression)、枚举条目 (enum entry)、`this` 或 `null`。以下是 `this` 的示例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  {validate="false"}

[了解有关委托属性 (delegated properties) 的更多信息](delegated-properties.md)。

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 上对此功能提供反馈。

### kapt 存根生成任务中对 JVM IR 后端 (backend) 的支持

> kapt 存根生成任务中对 JVM IR 后端的支持是 [实验性功能 (Experimental)](components-stability.md)。它可能随时被更改。需要选择加入 (opt-in)（详见下文），并且你应仅将其用于评估目的。
>
{style="warning"}

在 1.7.20 之前，kapt 存根生成任务使用旧后端，并且 [可重复注解 (repeatable annotations)](annotations.md#repeatable-annotations) 不适用于 [kapt](kapt.md)。在 Kotlin 1.7.20 中，我们增加了对 kapt 存根生成任务中 [JVM IR 后端](whatsnew15.md#stable-jvm-ir-backend) 的支持。这使得使用 kapt 可以支持所有最新的 Kotlin 特性，包括可重复注解。

要在 kapt 中使用 IR 后端，请将以下选项添加到你的 `gradle.properties` 文件中：

```none
kapt.use.jvm.ir=true
```

我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 上对此功能提供反馈。

## Kotlin/Native

Kotlin 1.7.20 默认启用了新的 Kotlin/Native 内存管理器，并为你提供了自定义 `Info.plist` 文件的选项：

* [新的默认内存管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自定义 Info.plist 文件](#customizing-the-info-plist-file)

### 新的 Kotlin/Native 内存管理器默认启用

此版本为新内存管理器带来了进一步的稳定性和性能改进，使我们能够将新内存管理器提升到 [Beta](components-stability.md) 阶段。

以前的内存管理器使编写并发和异步代码变得复杂，包括实现 `kotlinx.coroutines` 库的问题。这阻碍了 Kotlin 多平台移动 (Kotlin Multiplatform Mobile) 的采用，因为并发限制导致在 iOS 和 Android 平台之间共享 Kotlin 代码时出现问题。新的内存管理器最终为 [将 Kotlin Multiplatform Mobile 提升到 Beta 阶段](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 铺平了道路。

新的内存管理器还支持编译器缓存，使编译时间与以前的版本相当。有关新内存管理器优势的更多信息，请参阅我们关于预览版的原始 [博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。你可以在[文档](native-memory-manager.md)中找到更多技术细节。

#### 配置与设置

从 Kotlin 1.7.20 开始，新的内存管理器是默认的。不需要太多额外设置。

如果你已手动启用它，则可以从 `gradle.properties` 中删除 `kotlin.native.binary.memoryModel=experimental` 选项，或从 `build.gradle(.kts)` 文件中删除 `binaryOptions["memoryModel"] = "experimental"`。

如有必要，你可以通过在 `gradle.properties` 中添加 `kotlin.native.binary.memoryModel=strict` 选项来切换回旧版内存管理器。然而，旧版内存管理器不再支持编译器缓存，因此编译时间可能会变差。

#### 冻结 (Freezing)

在新的内存管理器中，冻结已被弃用。除非你的代码需要与旧版管理器（仍需要冻结）配合使用，否则请勿使用它。这可能对需要维护对旧版内存管理器支持的库作者或在遇到新内存管理器问题时希望有回退方案的开发者有所帮助。

在这种情况下，你可以暂时支持新旧内存管理器的代码。要忽略弃用警告，请执行以下操作之一：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 注解已弃用 API 的用法。
* 将 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 应用到 Gradle 中所有 Kotlin 源集 (source sets)。
* 传递编译器标志 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 从 Swift/Objective-C 调用 Kotlin suspend 函数

新的内存管理器仍然限制从主线程以外的其他线程从 Swift 和 Objective-C 调用 Kotlin `suspend` 函数，但你可以通过新的 Gradle 选项解除此限制。

此限制最初是在旧版内存管理器中引入的，原因是代码在某些情况下会将延续调度到原始线程上恢复。如果此线程没有受支持的事件循环，则任务将永远不会运行，协程 (coroutine) 也将永远不会恢复。

在某些情况下，此限制不再需要，但无法轻易实现对所有必要条件的检查。因此，我们决定在新内存管理器中保留它，同时引入一个选项供你禁用它。为此，请将以下选项添加到你的 `gradle.properties` 中：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

> 如果你使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他采用相同“调度到原始线程”方法的库，请勿添加此选项。
>
{style="warning"}

Kotlin 团队非常感谢 [Ahmed El-Helw](https://github.com/ahmedre) 实现了此选项。

#### 留下你的反馈

这是我们生态系统的一个重大变化。我们感谢你的反馈，以帮助使其变得更好。

在你的项目中尝试新的内存管理器，并在 [我们的问题跟踪器 YouTrack 中分享反馈](https://youtrack.jetbrains.com/issue/KT-48525)。

### 自定义 Info.plist 文件

在生成框架时，Kotlin/Native 编译器会生成信息属性列表文件 `Info.plist`。以前，自定义其内容很麻烦。使用 Kotlin 1.7.20，你可以直接设置以下属性：

| 属性                     | 二进制选项              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

为此，请使用相应的二进制选项。传递 `-Xbinary=$option=$value` 编译器标志，或为所需的框架设置 `binaryOption(option, value)` Gradle DSL。

Kotlin 团队非常感谢 Mads Ager 实现了此功能。

## Kotlin/JS

Kotlin/JS 获得了一些增强功能，这些功能改善了开发者体验并提升了性能：

* 由于依赖加载效率的提高，Klib 生成在增量构建和完全构建中都更快。
* [用于开发二进制文件的增量编译](js-ir-compiler.md#incremental-compilation-for-development-binaries) 已得到重构，从而在完全构建场景中实现了重大改进，加快了增量构建速度，并修复了稳定性问题。
* 我们改进了嵌套对象、密封类和构造函数中可选参数的 `.d.ts` 生成。

## Gradle

Kotlin Gradle 插件的更新重点在于与新的 Gradle 功能和最新 Gradle 版本的兼容性。

Kotlin 1.7.20 包含支持 Gradle 7.1 的更改。已删除或替换弃用方法和属性，减少了 Kotlin Gradle 插件生成的弃用警告数量，并为将来支持 Gradle 8.0 解除了阻碍。

但是，有一些潜在的重大变更可能需要你的注意：

### 目标配置

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 现在有一个泛型参数 `SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 约定已被弃用。你可以继续使用 `kotlin.targets { fromPreset() }`，但我们建议 [明确设置目标](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#targets)。
* Gradle 自动生成的目标访问器不再在 `kotlin.targets { }` 块内可用。请改用 `findByName("targetName")` 方法。

  请注意，此类访问器在 `kotlin.targets` 的情况下仍然可用，例如 `kotlin.targets.linuxX64`。

### 源目录配置

Kotlin Gradle 插件现在将 Kotlin `SourceDirectorySet` 作为 `kotlin` 扩展添加到 Java 的 `SourceSet` 组中。这使得在 `build.gradle.kts` 文件中配置源目录成为可能，类似于在 [Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中配置它们的方式：

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

你不再需要使用已弃用的 Gradle 约定并为 Kotlin 指定源目录。

请记住，你也可以使用 `kotlin` 扩展来访问 `KotlinSourceSet`：

```kotlin
kotlin {
    sourceSets {
        main {
        // ...
        }
    }
}
```

### 用于 JVM 工具链配置的新方法

此版本提供了一个新的 `jvmToolchain()` 方法，用于启用 [JVM 工具链功能](gradle-configure-project.md#gradle-java-toolchains-support)。如果你不需要任何额外的 [配置字段](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，例如 `implementation` 或 `vendor`，你可以从 Kotlin 扩展中使用此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

这简化了 Kotlin 项目的设置过程，无需任何额外配置。
在此版本之前，你只能通过以下方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 标准库

Kotlin 1.7.20 为 `java.nio.file.Path` 类提供了新的 [扩展函数 (extension functions)](extensions.md#extension-functions)，允许你遍历文件树：

* `walk()` 惰性遍历以指定路径为根的文件树。
* `fileVisitor()` 使得可以单独创建 `FileVisitor`。`FileVisitor` 定义了遍历目录和文件时的操作。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 接收一个准备好的 `FileVisitor`，并在底层使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() -> Unit)` 使用 `builderAction` 创建一个 `FileVisitor`，并调用 `visitFileTree(fileVisitor, ...)` 函数。
* `FileVisitResult` 作为 `FileVisitor` 的返回类型，其默认值为 `CONTINUE`，表示继续处理文件。

> `java.nio.file.Path` 的新扩展函数是 [实验性功能 (Experimental)](components-stability.md)。它们可能随时被更改。需要选择加入 (opt-in)（详见下文），并且你应仅将其用于评估目的。
>
{style="warning"}

以下是你可以使用这些新扩展函数执行的一些操作：

* 显式创建 `FileVisitor`，然后使用：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes ->
          // 访问目录时的一些逻辑
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 访问文件时的一些逻辑
          FileVisitResult.CONTINUE
      }
  }
  
  // 这里可能有一些逻辑
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 创建 `FileVisitor` 并立即使用它：

  ```kotlin
  projectDirectory.visitFileTree {
  // builderAction 的定义：
      onPreVisitDirectory { directory, attributes ->
          // 访问目录时的一些逻辑
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes ->
          // 访问文件时的一些逻辑
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函数遍历以指定路径为根的文件树：

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
  
   
  // 使用 walk 函数：
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

与实验性 API 的惯例一样，新扩展需要选择加入 (opt-in)：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi`。或者，你可以使用编译器选项：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我们感谢你在 YouTrack 上对 [`walk()` 函数](https://youtrack.jetbrains.com/issue/KT-52909) 和 [访问扩展函数](https://youtrack.jetbrains.com/issue/KT-52910) 提供反馈。

## 文档更新

自上一版本以来，Kotlin 文档进行了一些显著更改：

### 重新设计和改进的页面

* [基本类型概述](basic-types.md) – 了解 Kotlin 中使用的基本类型：数字、布尔值、字符、字符串、数组和无符号整数。
* [用于 Kotlin 开发的 IDE](kotlin-ide.md) – 查看支持 Kotlin 的官方 IDE 列表以及拥有社区支持插件的工具。

### Kotlin 多平台期刊中的新文章

* [原生与跨平台应用开发：如何选择？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 查看我们对跨平台应用开发和原生方法的概述和优势。
* [六个最佳跨平台应用开发框架](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 阅读有关关键方面的信息，帮助你为跨平台项目选择合适的框架。

### 新的和更新的教程

* [Kotlin 多平台入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 进行跨平台移动开发，并创建一个同时适用于 Android 和 iOS 的应用程序。
* [使用 React 和 Kotlin/JS 构建 Web 应用程序](js-react.md) – 创建一个浏览器应用程序，探索 Kotlin 的 DSL 和典型 React 程序的特性。

### 发布文档中的变更

我们不再为每个版本提供推荐的 kotlinx 库列表。此列表仅包含与 Kotlin 本身推荐和测试的版本。它没有考虑到某些库相互依赖并需要特殊的 kotlinx 版本，这可能与推荐的 Kotlin 版本不同。

我们正在努力寻找一种方法来提供有关库如何相互关联和依赖的信息，以便你在项目中升级 Kotlin 版本时，可以清楚地知道应该使用哪个 kotlinx 库版本。

## 安装 Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.7.20。

> 对于 Android Studio Dolphin (213)、Electric Eel (221) 和 Flamingo (222)，Kotlin 插件 1.7.20 将随即将发布的 Android Studio 更新一起提供。
>
{style="note"}

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20) 下载。

### Kotlin 1.7.20 兼容性指南

尽管 Kotlin 1.7.20 是一个增量版本，但我们仍然不得不进行一些不兼容的更改，以限制 Kotlin 1.7.0 中引入的问题的蔓延。

在 [Kotlin 1.7.20 兼容性指南](compatibility-guide-1720.md) 中查找此类更改的详细列表。