---
title: "Kotlin 1.7.20 中的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   Kotlin 1.7.20 的 IDE 支持适用于 IntelliJ IDEA 2021.3、2022.1 和 2022.2。
</p>

:::

_[已发布：2022 年 9 月 29 日](releases#release-details)_

Kotlin 1.7.20 版本已发布！以下是此版本的一些亮点：

* [新的 Kotlin K2 编译器支持 `all-open`、带接收者的 SAM（SAM with receiver）、Lombok 和其他编译器插件](#support-for-kotlin-k2-compiler-plugins)
* [我们引入了用于创建开放范围的 `..<` 运算符的预览](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 Kotlin/Native 内存管理器现在默认启用](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [我们为 JVM 引入了一个新的实验性功能：具有泛型底层类型的内联类](#generic-inline-classes)

您还可以在此视频中找到更改的简短概述：

<video src="https://www.youtube.com/v/OG9npowJgE8" title="What's new in Kotlin 1.7.20"/>

## 支持 Kotlin K2 编译器插件

Kotlin 团队正在继续稳定 K2 编译器。
正如在 [Kotlin 1.7.0 版本](whatsnew17#new-kotlin-k2-compiler-for-the-jvm-in-alpha)中宣布的那样，K2 仍处于 **Alpha** 阶段，
但它现在支持几个编译器插件。您可以关注 [此 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-52604)
以获取 Kotlin 团队关于新编译器的更新。

从 1.7.20 版本开始，Kotlin K2 编译器支持以下插件：

* [`all-open`](all-open-plugin)
* [`no-arg`](no-arg-plugin)
* [带接收者的 SAM（SAM with receiver）](sam-with-receiver-plugin)
* [Lombok](lombok)
* AtomicFU
* `jvm-abi-gen`

:::note
新 K2 编译器的 Alpha 版本仅适用于 JVM 项目。
它不支持 Kotlin/JS、Kotlin/Native 或其他多平台项目。

在以下视频中了解有关新编译器及其优势的更多信息：
* [The Road to the New Kotlin Compiler](https://www.youtube.com/watch?v=iTdJJq_LyoY)
* [K2 Compiler: a Top-Down View](https://www.youtube.com/watch?v=db19VFLZqJM)

### 如何启用 Kotlin K2 编译器

要启用 Kotlin K2 编译器并对其进行测试，请使用以下编译器选项：

```bash
-Xuse-k2
```

您可以在 `build.gradle(.kts)` 文件中指定它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions.useK2 = true
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    kotlinOptions.useK2 = true
}
```
</TabItem>
</Tabs>

检查您的 JVM 项目的性能提升，并将其与旧编译器的结果进行比较。

### 留下您对新 K2 编译器的反馈

我们非常感谢您以任何形式提供的反馈：
* 在 Kotlin Slack 中直接向 K2 开发人员提供您的反馈：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) 频道。
* 向 [我们的问题跟踪器](https://kotl.in/issue) 报告您在使用新 K2 编译器时遇到的任何问题。
* [启用 **发送使用情况统计信息** 选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## 语言

Kotlin 1.7.20 引入了新语言功能的预览版本，并对构建器类型推断施加了限制：

* [创建开放范围的 ..< 运算符的预览](#preview-of-the-operator-for-creating-open-ended-ranges)
* [新的 data object 声明](#improved-string-representations-for-singletons-and-sealed-class-hierarchies-with-data-objects)
* [构建器类型推断限制](#new-builder-type-inference-restrictions)

### 创建开放范围的 ..< 运算符的预览

新运算符是 [Experimental](components-stability#stability-levels-explained)，并且在 IDE 中的支持有限。

此版本引入了新的 `..<` 运算符。Kotlin 具有 `..` 运算符来表示一系列值。新的 `..<`
运算符的作用类似于 `until` 函数，可帮助您定义开放范围。

<video src="https://www.youtube.com/watch?v=v0AHdAIBnbs" title="New operator for open-ended ranges"/>

我们的研究表明，这种新运算符在表达开放范围方面做得更好，并且可以清楚地表明
不包含上限。

以下是在 `when` 表达式中使用 `..<` 运算符的示例：

```kotlin
when (value) {
    in 0.0..&lt;0.25 `->` // First quarter
    in 0.25..&lt;0.5 `->` // Second quarter
    in 0.5..&lt;0.75 `->` // Third quarter
    in 0.75..1.0 `->`  // Last quarter  `<-` Note closed range here
}
```

#### 标准库 API 更改

以下新类型和操作将在公共 Kotlin 标准库的 `kotlin.ranges` 包中引入：

##### 新的 OpenEndRange&lt;T&gt; 接口

用于表示开放范围的新接口与现有的 `ClosedRange<T>` 接口非常相似：

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

##### 在现有的可迭代范围中实现 OpenEndRange

当开发人员需要获取具有排除的上限的范围时，他们目前使用 `until` 函数来有效地
生成具有相同值的封闭可迭代范围。为了使这些范围在新 API（采用 `OpenEndRange<T>`）中可接受，
我们希望在现有的可迭代范围中实现该接口：`IntRange`、`LongRange`、`CharRange`、`UIntRange` 和
`ULongRange`。因此，它们将同时实现 `ClosedRange<T>` 和 `OpenEndRange<T>` 接口。

```kotlin
class IntRange : IntProgression(...), ClosedRange<Int>, OpenEndRange<Int> {
    override val start: Int
    override val endInclusive: Int
    override val endExclusive: Int
}
```

##### 标准类型的 rangeUntil 运算符

`rangeUntil` 运算符将为当前由 `rangeTo` 运算符定义的相同类型和组合提供。
我们将它们作为扩展函数提供，用于原型目的，但为了保持一致性，我们计划在稳定开放范围 API 之前
使它们成为成员。

#### 如何启用 ..&lt; 运算符

要使用 `..<` 运算符或为自己的类型实现该运算符约定，请启用 `-language-version 1.8`
编译器选项。

为支持标准类型的开放范围而引入的新 API 元素需要选择加入，就像
实验性 stdlib API 一样：`@OptIn(ExperimentalStdlibApi::class)`。或者，您可以使用
`-opt-in=kotlin.ExperimentalStdlibApi` 编译器选项。

[在此 KEEP 文档中阅读有关新运算符的更多信息](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges)。

### 改进了具有 data object 的单例和密封类层次结构的字符串表示形式

Data object 是 [Experimental](components-stability#stability-levels-explained)，目前在 IDE 中的支持有限。

此版本引入了一种新的 `object` 声明供您使用：`data object`。[Data object](https://youtrack.jetbrains.com/issue/KT-4107)
在概念上与常规 `object` 声明完全相同，但开箱即用地提供了干净的 `toString` 表示形式。

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

这使得 `data object` 声明非常适合密封类层次结构，您可以在其中将它们与 `data class`
声明一起使用。在此代码段中，将 `EndOfFile` 声明为 `data object` 而不是普通的 `object` 意味着它将
获得一个漂亮的 `toString`，而无需手动覆盖它，从而与随附的 `data class`
定义保持对称：

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

#### 如何启用 data object

要在代码中使用 data object 声明，请启用 `-language-version 1.9` 编译器选项。在 Gradle 项目中，
您可以通过将以下内容添加到 `build.gradle(.kts)` 中来实现：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile>().configureEach {
    // ...
    kotlinOptions.languageVersion = "1.9"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
compileKotlin {
    // ...
    kotlinOptions.languageVersion = '1.9'
}
```
</TabItem>
</Tabs>

阅读有关 data object 的更多信息，并在 [相应的 KEEP 文档](https://github.com/Kotlin/KEEP/pull/316) 中分享您对其实现的反馈。

### 新的构建器类型推断限制

Kotlin 1.7.20 对 [构建器类型推断的使用](using-builders-with-builder-inference)施加了一些主要限制，
这些限制可能会影响您的代码。这些限制适用于包含构建器 lambda 函数的代码，在这些代码中，不可能
在不分析 lambda 本身的情况下推导出参数。该参数用作参数。现在，编译器将
始终显示此类代码的错误，并要求您显式指定类型。

这是一个重大更改，但我们的研究表明这些情况非常罕见，并且这些限制不应影响
您的代码。如果它们确实影响了，请考虑以下情况：

* 带有隐藏成员的扩展的构建器推断。

  如果您的代码包含一个具有相同名称的扩展函数，该扩展函数将在构建器推断期间使用，
  编译器将向您显示一个错误：

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
     
  
  要修复代码，您应该显式指定类型：

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

* 带有多个 lambda 的构建器推断，并且未显式指定类型参数。

  如果在构建器推断中有两个或多个 lambda 块，它们会影响类型。为了防止出现错误，编译器
  要求您指定类型：

    ```kotlin
    fun <T: Any> buildList(
        first: MutableList<T>.() `->` Unit, 
        second: MutableList<T>.() `->` Unit
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
    

  要修复错误，您应该显式指定类型并修复类型不匹配：

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

如果您没有找到上面提到的情况，请 [提交 issue](https://kotl.in/issue) 给我们的团队。

有关此构建器推断更新的更多信息，请参见此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-53797)。

## Kotlin/JVM

Kotlin 1.7.20 引入了泛型内联类，为委托属性添加了更多字节码优化，并支持
kapt 存根生成任务中的 IR（Intermediate Representation，中间表示），从而可以使用所有最新的 Kotlin 功能与 kapt：

* [泛型内联类](#generic-inline-classes)
* [委托属性的更多优化案例](#more-optimized-cases-of-delegated-properties)
* [在 kapt 存根生成任务中支持 JVM IR 后端](#support-for-the-jvm-ir-backend-in-kapt-stub-generating-task)

### 泛型内联类

泛型内联类是一项 [Experimental](components-stability#stability-levels-explained) 功能。
它可能随时被删除或更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。
我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 中提供的反馈。

Kotlin 1.7.20 允许 JVM 内联类的底层类型为类型参数。编译器将其映射到 `Any?`，或者通常映射到
类型参数的上限。

<video src="https://www.youtube.com/v/0JRPA0tt9og" title="Generic inline classes in Kotlin 1.7.20"/>

考虑以下示例：

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // Compiler generates fun compute-<hashcode>(s: Any?)
```

该函数接受内联类作为参数。该参数映射到上限，而不是类型参数。

要启用此功能，请使用 `-language-version 1.8` 编译器选项。

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-52994) 中提供的有关此功能的反馈。

### 委托属性的更多优化案例

在 Kotlin 1.6.0 中，我们通过省略 `$delegate` 字段并 [生成
对引用属性的直接访问](whatsnew16#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)来优化了委托给属性的情况。在 1.7.20 中，我们为更多情况实现了此优化。
如果委托是：

* 命名对象：

  ```kotlin
  object NamedObject {
      operator fun getValue(thisRef: Any?, property: KProperty<*>): String = ...
  }
  
  val s: String by NamedObject
  ```
  

* 具有 [后备字段](properties#backing-fields) 和同一模块中默认 getter 的最终 `val` 属性：

  ```kotlin
  val impl: ReadOnlyProperty<Any?, String> = ...
  
  class A {
      val s: String by impl
  }
  ```
  

* 常量表达式、枚举条目、`this` 或 `null`。这是一个 `this` 的示例：

  ```kotlin
  class A {
      operator fun getValue(thisRef: Any?, property: KProperty<*>) ...
   
      val s by this
  }
  ```
  

了解有关 [委托属性](delegated-properties) 的更多信息。

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23397) 中提供的有关此功能的反馈。

### 在 kapt 存根生成任务中支持 JVM IR 后端

在 kapt 存根生成任务中支持 JVM IR 后端是一项 [Experimental](components-stability) 功能。
它可能随时被更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。

在 1.7.20 之前，kapt 存根生成任务使用旧后端，并且 [可重复注解](annotations#repeatable-annotations)
不适用于 [kapt](kapt)。使用 Kotlin 1.7.20，我们在 kapt 存根生成任务中添加了对 [JVM IR 后端](whatsnew15#stable-jvm-ir-backend) 的支持。
这使得可以使用所有最新的 Kotlin 功能与 kapt，包括
可重复注解。

要在 kapt 中使用 IR 后端，请将以下选项添加到您的 `gradle.properties` 文件中：

```none
kapt.use.jvm.ir=true
```

我们感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-49682) 中提供的有关此功能的反馈。

## Kotlin/Native

Kotlin 1.7.20 默认启用新的 Kotlin/Native 内存管理器，并为您提供自定义
`Info.plist` 文件的选项：

* [新的默认内存管理器](#the-new-kotlin-native-memory-manager-enabled-by-default)
* [自定义 Info.plist 文件](#customizing-the-info-plist-file)

### 新的 Kotlin/Native 内存管理器现在默认启用

此版本为新的内存管理器带来了进一步的稳定性和性能改进，使我们能够将
新的内存管理器提升到 [Beta](components-stability)。

先前的内存管理器使编写并发和异步代码变得复杂，包括实现
`kotlinx.coroutines` 库的问题。这阻碍了 Kotlin Multiplatform Mobile 的采用，因为并发限制
在 iOS 和 Android 平台之间共享 Kotlin 代码时造成了问题。新的内存管理器最终为
[将 Kotlin Multiplatform Mobile 提升到 Beta](https://blog.jetbrains.com/kotlin/2022/05/kotlin-multiplatform-mobile-beta-roadmap-update/) 铺平了道路。

新的内存管理器还支持编译器缓存，这使得编译时间与以前的版本相当。
有关新内存管理器的优点的更多信息，请参阅我们的原始 [博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)
以获取预览版本。您可以在 [文档](native-memory-manager) 中找到更多技术详细信息。

#### 配置和设置

从 Kotlin 1.7.20 开始，新的内存管理器是默认设置。不需要太多额外的设置。

如果您已经手动将其打开，则可以从 `gradle.properties` 文件中删除 `kotlin.native.binary.memoryModel=experimental` 选项，或者从 `build.gradle(.kts)` 文件中删除 `binaryOptions["memoryModel"] = "experimental"`。

如有必要，您可以使用 `gradle.properties` 中的 `kotlin.native.binary.memoryModel=strict` 选项切换回旧的内存管理器。
但是，编译器缓存支持不再适用于旧的内存管理器，
因此编译时间可能会变差。

#### 冻结

在新的内存管理器中，冻结已被弃用。除非您需要您的代码与旧的管理器一起使用，否则不要使用它
（在旧的管理器中仍然需要冻结）。这可能对需要维护对旧的管理器支持的库作者
或遇到新内存管理器问题的开发人员有所帮助。

在这种情况下，您可以暂时支持新旧内存管理器的代码。要忽略弃用警告，
请执行以下操作之一：

* 使用 `@OptIn(FreezingIsDeprecated::class)` 注释已弃用 API 的用法。
* 将 `languageSettings.optIn("kotlin.native.FreezingIsDeprecated")` 应用于 Gradle 中的所有 Kotlin 源代码集。
* 传递编译器标志 `-opt-in=kotlin.native.FreezingIsDeprecated`。

#### 从 Swift/Objective-C 调用 Kotlin 挂起函数

新的内存管理器仍然限制从主线程以外的线程从 Swift 和 Objective-C 调用 Kotlin `suspend` 函数，
但是您可以使用新的 Gradle 选项来取消它。

此限制最初是在旧的内存管理器中引入的，原因是代码调度了一个延续，该延续将在原始线程上恢复。
如果此线程没有受支持的事件循环，则该任务将永远不会运行，
并且协程将永远不会恢复。

在某些情况下，不再需要此限制，但是无法轻松地实现对所有必要条件的检查。
因此，我们决定将其保留在新的内存管理器中，同时引入一个选项供您禁用
它。为此，请将以下选项添加到您的 `gradle.properties` 中：

```none
kotlin.native.binary.objcExportSuspendFunctionLaunchThreadRestriction=none
```

如果您使用 `kotlinx.coroutines` 的 `native-mt` 版本或其他具有相同
“调度到原始线程” 方法的库，请勿添加此选项。

Kotlin 团队非常感谢 [Ahmed El-Helw](https://github.com/ahmedre) 实现此选项。

#### 留下您的反馈

这是对我们生态系统的一项重大更改。我们感谢您的反馈，以帮助使其变得更好。

在您的项目上尝试新的内存管理器，并在我们的问题跟踪器 YouTrack 中 [分享反馈](https://youtrack.jetbrains.com/issue/KT-48525)。

### 自定义 Info.plist 文件

在生成框架时，Kotlin/Native 编译器会生成信息属性列表文件 `Info.plist`。
以前，自定义其内容很麻烦。使用 Kotlin 1.7.20，您可以直接设置以下属性：

| 属性                     | 二进制选项              |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

为此，请使用相应的二进制选项。传递
`-Xbinary=$option=$value` 编译器标志或为必要的框架设置 `binaryOption(option, value)` Gradle DSL。

Kotlin 团队非常感谢 Mads Ager 实现此功能。

## Kotlin/JS

Kotlin/JS 收到了一些增强功能，可改善开发人员体验并提高性能：

* 由于加载依赖项的效率提高，Klib 生成在增量构建和全新构建中都更快。
* [开发二进制文件的增量编译](js-ir-compiler#incremental-compilation-for-development-binaries)
  已得到改进，从而大大改善了全新构建方案、更快的增量构建和稳定性修复。
* 我们改进了嵌套对象、密封类和构造函数中可选参数的 `.d.ts` 生成。

## Gradle

Kotlin Gradle 插件的更新侧重于与新的 Gradle 功能和最新的 Gradle
版本的兼容性。

Kotlin 1.7.20 包含支持 Gradle 7.1 的更改。已删除或替换已弃用的方法和属性，
从而减少了 Kotlin Gradle 插件产生的弃用警告数量，并取消阻止了对 Gradle 8.0 的未来支持。

但是，有一些可能需要您注意的潜在重大更改：

### 目标配置

* `org.jetbrains.kotlin.gradle.dsl.SingleTargetExtension` 现在具有泛型参数 `SingleTargetExtension<T : KotlinTarget>`。
* `kotlin.targets.fromPreset()` 约定已弃用。相反，您仍然可以使用 `kotlin.targets { fromPreset() }`，
  但我们建议 [显式设置目标](multiplatform-discover-project#targets)。
* 由 Gradle 自动生成的目标访问器在 `kotlin.targets { }` 块内不再可用。请改用 `findByName("targetName")`
  方法。

  请注意，在 `kotlin.targets` 的情况下，此类访问器仍然可用，例如 `kotlin.targets.linuxX64`。

### 源代码目录配置

Kotlin Gradle 插件现在将 Kotlin `SourceDirectorySet` 作为 `kotlin` 扩展添加到 Java 的 `SourceSet` 组。
这使得可以在 `build.gradle.kts` 文件中配置源代码目录，类似于在
[Java、Groovy 和 Scala](https://docs.gradle.org/7.1/release-notes.html#easier-source-set-configuration-in-kotlin-dsl) 中配置源代码目录的方式：

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

您不再需要使用已弃用的 Gradle 约定并为 Kotlin 指定源代码目录。

请记住，您还可以使用 `kotlin` 扩展来访问 `KotlinSourceSet`：

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

此版本提供了一个新的 `jvmToolchain()` 方法，用于启用 [JVM 工具链功能](gradle-configure-project#gradle-java-toolchains-support)。
如果您不需要任何额外的 [配置字段](https://docs.gradle.org/current/javadoc/org/gradle/jvm/toolchain/JavaToolchainSpec.html)，
例如 `implementation` 或 `vendor`，则可以从 Kotlin 扩展中使用此方法：

```kotlin
kotlin {
    jvmToolchain(17)
}
```

这简化了 Kotlin 项目设置过程，而无需任何额外的配置。
在此版本之前，您只能通过以下方式指定 JDK 版本：

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}
```

## 标准库

Kotlin 1.7.20 为 `java.nio.file.Path` 类提供了新的 [扩展函数](extensions#extension-functions)，
这使您可以遍历文件树：

* `walk()` 延迟遍历以指定路径为根的文件树。
* `fileVisitor()` 使您可以单独创建 `FileVisitor`。`FileVisitor` 定义了对目录的
  操作以及遍历它们时的文件。
* `visitFileTree(fileVisitor: FileVisitor, ...)` 使用一个就绪的 `FileVisitor` 并在底层使用 `java.nio.file.Files.walkFileTree()`。
* `visitFileTree(..., builderAction: FileVisitorBuilder.() `->` Unit)` 创建一个带有 `builderAction` 的 `FileVisitor` 并
  调用 `visitFileTree(fileVisitor, ...)` 函数。
* `FileVisitResult`，`FileVisitor` 的返回类型，具有 `CONTINUE` 默认值，该默认值继续处理
  文件。

用于 `java.nio.file.Path` 的新扩展函数是 [Experimental](components-stability)。
它们可能随时被更改。需要选择加入（请参阅下面的详细信息），您应该仅将其用于评估目的。

以下是您可以使用这些新扩展函数执行的一些操作：

* 显式创建一个 `FileVisitor` 然后使用：

  ```kotlin
  val cleanVisitor = fileVisitor {
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  
  // Some logic may go here
  
  projectDirectory.visitFileTree(cleanVisitor)
  ```

* 使用 `builderAction` 创建一个 `FileVisitor` 并立即使用它：

  ```kotlin
  projectDirectory.visitFileTree {
  // Definition of the builderAction:
      onPreVisitDirectory { directory, attributes `->`
          // Some logic on visiting directories
          FileVisitResult.CONTINUE
      }
  
      onVisitFile { file, attributes `->`
          // Some logic on visiting files
          FileVisitResult.CONTINUE
      }
  }
  ```

* 使用 `walk()` 函数遍历以指定路径为根的文件树：

  ```kotlin
  @OptIn(kotlin.io.path.ExperimentalPathApi::class)
  fun traverseFileTree() {
      val cleanVisitor = fileVisitor {
          onPreVisitDirectory { directory, _ `->`
              if (directory.name == "build") {
                  directory.toFile().deleteRecursively()
                  FileVisitResult.SKIP_SUBTREE
              } else {
                  FileVisitResult.CONTINUE
              }
          }
  
          onVisitFile { file, _ `->`
              if (file.extension == "class") {
                  file.deleteExisting()
              }
              FileVisitResult.CONTINUE
          }
      }
  
      val rootDirectory = createTempDirectory("Project")
  
      rootDirectory.resolve("src").let { srcDirectory `->`
          srcDirectory.createDirectory()
          srcDirectory.resolve("A.kt").createFile()
          srcDirectory.resolve("A.class").createFile()
      }
  
      rootDirectory.resolve("build").let { buildDirectory `->`
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

  }
  ```

与实验性 API 常见的情况一样，新的扩展需要选择加入：`@OptIn(kotlin.io.path.ExperimentalPathApi::class)`
或 `@kotlin.io.path.ExperimentalPathApi`。或者，您可以使用编译器选项：`-opt-in=kotlin.io.path.ExperimentalPathApi`。

我们感谢您在 YouTrack 中对 [`walk()` 函数](https://youtrack.jetbrains.com/issue/KT-52909) 和
[访问扩展函数](https://youtrack.jetbrains.com/issue/KT-52910) 提供的反馈。

## 文档更新

自上一个版本以来，Kotlin 文档收到了一些值得注意的更改：

### 改进和完善的页面

* [基本类型概述](basic-types) – 了解 Kotlin 中使用的基本类型：数字、布尔值、字符、字符串、数组和无符号整数。
* [用于 Kotlin 开发的 IDE](kotlin-ide) – 查看具有官方 Kotlin 支持的 IDE 列表以及具有社区支持插件的工具。

### Kotlin Multiplatform 杂志中的新文章

* [原生和跨平台应用开发：如何选择？](https://www.jetbrains.com/help/kotlin-multiplatform-dev/native-and-cross-platform.html) – 查看我们对跨平台应用开发和原生方法的概述和优势。
* [六大最佳跨平台应用开发框架](https://www.jetbrains.com/help/kotlin-multiplatform-dev/cross-platform-frameworks.html) – 阅读有关关键方面的信息，以帮助您为跨平台项目选择合适的框架。

### 新的和更新的教程

* [Kotlin Multiplatform 入门](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 进行跨平台移动开发，并创建一个可在 Android 和 iOS 上运行的应用。
* [使用 React 和 Kotlin/JS 构建 Web 应用程序](js-react) – 创建一个浏览器应用，探索 Kotlin 的 DSL（领域特定语言）和典型 React 程序的特性。

### 版本文档中的更改

我们不再为每个版本提供推荐的 kotlinx 库列表。此列表仅包含
推荐并经过 Kotlin 本身测试的版本。它没有考虑到某些库相互依赖并且需要
特殊的 kotlinx 版本，该版本可能与推荐的 Kotlin 版本不同。

我们正在努力寻找一种方法来提供有关库如何相互关联和依赖的信息，以便
清楚地了解在项目中升级 Kotlin 版本时应使用哪个 kotlinx 库版本。

## 安装 Kotlin 1.7.20

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 会自动建议将 Kotlin 插件更新到 1.7.20。

对于 Android Studio Dolphin (213)、Electric Eel (221) 和 Flamingo (222)，Kotlin 插件 1.7.20 将通过即将到来的 Android Studios 更新提供。

:::

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.7.20) 上下载。

### Kotlin 1.7.20 的兼容性指南

尽管 Kotlin 1.7.20 是一个增量版本，但我们仍然必须进行不兼容的更改，以限制
Kotlin 1.7.0 中引入的问题的蔓延。

在 [Kotlin 1.7.20 兼容性指南](compatibility-guide-1720) 中查找此类更改的详细列表。