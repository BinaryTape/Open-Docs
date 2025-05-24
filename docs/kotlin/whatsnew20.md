---
title: "Kotlin 2.0.0 中的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布日期：2024年5月21日](releases#release-details)_

Kotlin 2.0.0 版本已发布，并且 [新的 Kotlin K2 编译器](#kotlin-k2-compiler) 已经稳定！ 此外，以下是一些其他的亮点：

* [新的 Compose 编译器 Gradle 插件](#new-compose-compiler-gradle-plugin)
* [使用 invokedynamic 生成 lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 库现在已稳定](#the-kotlinx-metadata-jvm-library-is-stable)
* [使用 Apple 平台上的信标 (signpost) 监控 Kotlin/Native 中的 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [解决 Kotlin/Native 中与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
* [支持 Kotlin/Wasm 中的命名导出 (named export)](#support-for-named-export)
* [支持 Kotlin/Wasm 中带有 @JsExport 注解的函数中的无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
* [多平台项目中编译器选项的新的 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
* [enum class values 泛型函数的稳定替代方案](#stable-replacement-of-the-enum-class-values-generic-function)
* [稳定的 AutoCloseable 接口](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 团队的一个重大里程碑。这个版本是 KotlinConf 2024 的中心。请观看开幕主题演讲，我们在其中宣布了令人兴奋的更新，并讨论了最近在 Kotlin 语言方面所做的工作：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支持

支持 Kotlin 2.0.0 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需要在你的构建脚本中[更改 Kotlin 版本](releases#update-to-a-new-kotlin-version)到 Kotlin 2.0.0。

* 有关 IntelliJ IDEA 对 Kotlin K2 编译器的支持的详细信息，请参阅 [IDE 中的支持](#support-in-ides)。
* 有关 IntelliJ IDEA 对 Kotlin 的支持的更多详细信息，请参阅 [Kotlin 版本](releases#ide-support)。

## Kotlin K2 编译器

通往 K2 编译器的道路漫长，但现在 JetBrains 团队终于准备好宣布其稳定。
在 Kotlin 2.0.0 中，默认使用新的 Kotlin K2 编译器，并且它对所有目标平台（JVM、Native、Wasm 和 JS）都是[稳定的](components-stability)。
新的编译器带来了重大的性能改进，加速了新语言特性的开发，统一了 Kotlin 支持的所有平台，并为多平台项目提供了更好的架构。

JetBrains 团队通过成功编译来自选定的用户和内部项目的 1000 万行代码，确保了新编译器的质量。
18,000 名开发人员参与了稳定过程，测试了总共 80,000 个项目中的新 K2 编译器，并报告了他们发现的任何问题。

为了帮助尽可能顺利地完成向新编译器的迁移过程，我们创建了一个 [K2 编译器迁移指南](k2-compiler-migration-guide)。
本指南解释了编译器的许多优点，强调了你可能遇到的任何更改，并描述了如何在必要时回滚到以前的版本。

在一篇 [博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/) 中，
我们探讨了 K2 编译器在不同项目中的性能。 如果你想查看有关 K2 编译器性能的真实数据，并查找有关如何从你自己的项目中收集性能基准的说明，请查看它。

你还可以观看 KotlinConf 2024 的本次演讲，其中首席语言设计师 Michail Zarečenskij 讨论了 Kotlin 中的特性演变和 K2 编译器：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 当前 K2 编译器限制

在你的 Gradle 项目中启用 K2 存在某些限制，这些限制可能会影响在以下情况下使用低于 8.3 的 Gradle 版本的项目：

* 编译来自 `buildSrc` 的源代码。
* 编译包含的构建中的 Gradle 插件。
* 如果其他 Gradle 插件在 Gradle 版本低于 8.3 的项目中使用，则编译它们。
* 构建 Gradle 插件依赖项。

如果遇到上述任何问题，你可以采取以下步骤来解决它们：

* 设置 `buildSrc`、任何 Gradle 插件及其依赖项的语言版本：

  ```kotlin
  kotlin {
      compilerOptions {
          languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
          apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
      }
  }
  ```

  > 如果你为特定任务配置语言和 API 版本，这些值将覆盖 `compilerOptions` 扩展设置的值。 在这种情况下，语言和 API 版本不应高于 1.9。
  >
  

* 将项目中的 Gradle 版本更新到 8.3 或更高版本。

### 智能类型转换 (smart cast) 改进

在特定情况下，Kotlin 编译器可以自动将对象转换为类型，从而省去你必须显式转换它的麻烦。 这被称为 [智能类型转换](typecasts#smart-casts)。
与之前相比，Kotlin K2 编译器现在在更多场景中执行智能类型转换。

在 Kotlin 2.0.0 中，我们对以下领域的智能类型转换进行了改进：

* [局部变量和更远的范围](#local-variables-and-further-scopes)
* [使用逻辑 `or` 运算符的类型检查](#type-checks-with-logical-or-operator)
* [内联函数](#inline-functions)
* [具有函数类型的属性](#properties-with-function-types)
* [异常处理](#exception-handling)
* [递增和递减运算符](#increment-and-decrement-operators)

#### 局部变量和更远的范围

以前，如果在 `if` 条件中将变量评估为非 `null`，则该变量将被智能类型转换。
然后，有关此变量的信息将在 `if` 块的范围内进一步共享。

但是，如果在 `if` 条件 **之外** 声明变量，则在 `if` 条件内将没有关于该变量的信息，因此无法对其进行智能类型转换。 在 `when` 表达式和 `while` 循环中也观察到了这种行为。

从 Kotlin 2.0.0 开始，如果在 `if`、`when` 或 `while` 条件中使用变量之前声明变量，那么编译器收集的关于该变量的任何信息都将在相应的块中可用于智能类型转换。

当你想做诸如将布尔条件提取到变量中之类的事情时，这会很有用。 然后，你可以为变量指定一个有意义的名称，这将提高代码的可读性，并使以后在代码中重用该变量成为可能。 例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 在 Kotlin 2.0.0 中，编译器可以访问关于 isCat 的信息，因此它知道
        // animal 已智能类型转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 关于智能类型转换的信息，因此调用 purr()
        // 函数会触发错误。
        animal.purr()
    }
}

fun main() {
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 使用逻辑 or 运算符的类型检查

在 Kotlin 2.0.0 中，如果将对象的类型检查与 `or` 运算符 (`||`) 组合在一起，则会对其最接近的公共超类型进行智能类型转换。 在此更改之前，始终对 `Any` 类型进行智能类型转换。

在这种情况下，你仍然必须在之后手动检查对象类型，然后才能访问其任何属性或调用其函数。 例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换为公共超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智能类型转换
        // 为 Any 类型，因此调用 signal() 函数会触发一个
        // Unresolved reference 错误。 只有在另一个类型检查之后才能成功调用 signal() 函数：

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
公共超类型是联合类型的**近似值**。 Kotlin 不支持 [联合类型](https://en.wikipedia.org/wiki/Union_type)。

:::

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器以不同的方式处理内联函数，允许它与其他编译器分析结合使用，以确定智能类型转换是否安全。

具体来说，现在将内联函数视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。 这意味着传递给内联函数的任何 lambda 函数都会在适当的位置调用。 由于 lambda 函数在适当的位置调用，因此编译器知道 lambda 函数无法泄漏对其函数体中包含的任何变量的引用。

编译器使用此知识以及其他编译器分析来决定智能类型转换任何捕获的变量是否安全。 例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () `->` Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，编译器知道 processor
        // 是一个局部变量，并且 inlineAction() 是一个内联函数，所以
        // 对 processor 的引用不会被泄漏。 因此，智能类型转换 processor 是安全的。

        // 如果 processor 不是 null，则 processor 会被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不是 null，因此不需要安全调用
            processor.process()

            // 在 Kotlin 1.9.20 中，你必须执行安全调用：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具有函数类型的属性

在以前版本的 Kotlin 中，存在一个 bug，这意味着具有函数类型的类属性不会被智能类型转换。
我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。 例如：

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不是 null，则
        // provider 会被智能类型转换
        if (provider != null) {
            // 编译器知道 provider 不是 null
            provider()

            // 在 1.9.20 中，编译器不知道 provider 不是
            // null，因此它会触发一个错误：
            // Reference has a nullable type '(() `->` Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果你重载 `invoke` 运算符，此更改也适用。 例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 在 1.9.20 中，编译器会触发一个错误：
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 异常处理

在 Kotlin 2.0.0 中，我们对异常处理进行了改进，以便智能类型转换信息可以传递到 `catch` 和 `finally` 块。 此更改使你的代码更安全，因为编译器会跟踪你的对象是否具有可空类型。 例如：

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不是 null
        println(stringInput.length)
        // 0

        // 编译器拒绝之前智能类型转换的 stringInput 信息。 现在 stringInput 具有 String? 类型。
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，编译器知道 stringInput
        // 可以为 null，因此 stringInput 保持可空。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，编译器说不需要安全调用，但这是不正确的。
    }
}

fun main() {
    testString()
}
```

#### 递增和递减运算符

在 Kotlin 2.0.0 之前，编译器不理解在使用递增或递减运算符后，对象的类型可能会发生变化。 由于编译器无法准确跟踪对象类型，因此你的代码可能会导致未解析的引用错误。 在 Kotlin 2.0.0 中，此问题已得到修复：

```kotlin
interface Rho {
    operator fun inc(): Sigma = TODO()
}

interface Sigma : Rho {
    fun sigma() = Unit
}

interface Tau {
    fun tau() = Unit
}

fun main(input: Rho) {
    var unknownObject: Rho = input

    // 检查 unknownObject 是否继承自 Tau 接口
    // 注意，unknownObject 可能同时继承自
    // Rho 和 Tau 接口。
    if (unknownObject is Tau) {

        // 使用接口 Rho 中重载的 inc() 运算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的类型会被智能类型转换为
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有类型
        // Sigma，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，调用 inc() 时，编译器不执行智能类型转换
        // 因此编译器仍然认为 unknownObject 具有类型 Tau。 调用 sigma() 函数
        // 会引发编译时错误。
        
        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有类型
        // Sigma，因此调用 tau() 函数会引发编译时
        // 错误。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为
        // unknownObject 具有类型 Tau，因此可以调用 tau() 函数，
        // 但它会抛出 ClassCastException。
    }
}
```

### Kotlin 多平台改进

在 Kotlin 2.0.0 中，我们在 K2 编译器中对 Kotlin 多平台进行了改进，涉及以下领域：

* [编译期间通用和平台源的分离](#separation-of-common-and-platform-sources-during-compilation)
* [expected 和 actual 声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译期间通用和平台源的分离

以前，Kotlin 编译器的设计阻止了它在编译时保持通用和平台源集的分离。
因此，通用代码可以访问平台代码，这会导致平台之间的行为不同。
此外，来自通用代码的一些编译器设置和依赖项过去会泄漏到平台代码中。

在 Kotlin 2.0.0 中，我们对新的 Kotlin K2 编译器的实现包括对编译方案的重新设计，以确保通用和平台源集之间严格分离。
当你使用 [expected 和 actual 函数](multiplatform-expect-actual#expected-and-actual-functions) 时，此更改最为明显。
以前，你的通用代码中的函数调用可能会解析为平台代码中的函数。 例如：
<table>
<tr>
<td>
通用代码
</td>
<td>
平台代码
</td>
</tr>
<tr>
<td>

```kotlin
fun foo(x: Any) = println("common foo")

fun exampleFunction() {
    foo(42)
}
```
</td>
<td>

```kotlin
// JVM
fun foo(x: Int) = println("platform foo")

// JavaScript
// 在 JavaScript 平台上没有 foo() 函数重载
```
</td>
</tr>
</table>

在此示例中，通用代码根据其运行的平台具有不同的行为：

* 在 JVM 平台上，在通用代码中调用 `foo()` 函数会导致调用平台代码中的 `foo()` 函数，显示为 `platform foo`。
* 在 JavaScript 平台上，在通用代码中调用 `foo()` 函数会导致调用通用代码中的 `foo()` 函数，显示为 `common foo`，因为平台代码中没有这样的函数可用。

在 Kotlin 2.0.0 中，通用代码无法访问平台代码，因此两个平台都成功将 `foo()` 函数解析为通用代码中的 `foo()` 函数：`common foo`。

除了提高跨平台行为的一致性之外，我们还努力修复 IntelliJ IDEA 或 Android Studio 和编译器之间存在冲突行为的情况。 例如，当你使用 [expected 和 actual 类](multiplatform-expect-actual#expected-and-actual-classes) 时，会发生以下情况：
<table>
<tr>
<td>
通用代码
</td>
<td>
平台代码
</td>
</tr>
<tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前，
    // 它会触发仅 IDE 错误
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity 没有默认构造函数。
}
```
</td>
<td>

```kotlin
actual class Identity {
    actual fun confirmIdentity() = "expect class fun: jvm"
}
```
</td>
</tr>
</table>

在此示例中，expected 类 `Identity` 没有默认构造函数，因此无法在通用代码中成功调用它。
以前，仅由 IDE 报告错误，但代码仍然在 JVM 上成功编译。 但是，现在编译器会正确报告错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何时解析行为不会更改

我们仍在迁移到新的编译方案的过程中，因此当你调用不在同一源集中的函数时，解析行为仍然相同。
当你使用通用代码中的多平台库中的重载时，你主要会注意到这种差异。

假设你有一个库，它有两个具有不同签名的 `whichFun()` 函数：

```kotlin
// 示例库

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果在你的通用代码中调用 `whichFun()` 函数，则会解析库中具有最相关参数类型的函数：

```kotlin
// 一个使用 JVM 目标的示例库的项目

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果在同一源集中声明 `whichFun()` 的重载，则会解析来自通用代码的函数，因为你的代码无法访问平台特定的版本：

```kotlin
// 不使用示例库

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

与多平台库类似，由于 `commonTest` 模块位于单独的源集中，因此它仍然可以访问平台特定的代码。
因此，对 `commonTest` 模块中的函数调用的解析表现出与旧编译方案相同的行为。

将来，这些剩余情况将与新的编译方案更加一致。

#### expected 和 actual 声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果在你的 Kotlin 多平台项目中使用 [expected 和 actual 声明](multiplatform-expect-actual)，它们必须具有相同的 [可见性级别](visibility-modifiers)。
Kotlin 2.0.0 现在还支持不同的可见性级别，但**仅当**实际声明比预期声明 _更_ 宽松时。 例如：

```kotlin
expect internal class Attribute // 可见性为 internal
actual class Attribute          // 可见性默认为 public，
                                // 这更宽松
```

同样，如果在你的实际声明中使用 [类型别名](type-aliases)，则**底层类型**的可见性应与预期声明相同或更宽松。 例如：

```kotlin
expect internal class Attribute                 // 可见性为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可见性默认为 public，
                                                // 这更宽松
```

### 编译器插件支持

目前，Kotlin K2 编译器支持以下 Kotlin 编译器插件：

* [`all-open`](all-open-plugin)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok)
* [`no-arg`](no-arg-plugin)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [SAM with receiver](sam-with-receiver-plugin)
* [serialization](serialization)
* [Power-assert](power-assert)

此外，Kotlin K2 编译器还支持：

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 编译器插件 2.0.0，该插件已[移至 Kotlin 存储库](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
* [Kotlin 符号处理 (KSP) 插件](ksp-overview)，因为 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html)。

:::note
如果你使用任何其他编译器插件，请查看其文档以查看它们是否与 K2 兼容。

### 实验性的 Kotlin Power-assert 编译器插件

Kotlin Power-assert 插件是 [实验性的](components-stability#stability-levels-explained)。
它可能随时更改。

Kotlin 2.0.0 引入了一个实验性的 Power-assert 编译器插件。此插件通过在失败消息中包含上下文信息来改善编写测试的体验，从而使调试更容易、更有效。

开发人员通常需要使用复杂的断言库来编写有效的测试。 Power-assert 插件通过自动生成包含断言表达式的中间值的失败消息来简化此过程。这有助于开发人员快速了解测试失败的原因。

当测试中的断言失败时，改进的错误消息会显示断言中所有变量和子表达式的值，从而清楚地表明条件的哪一部分导致了失败。这对于检查多个条件的复杂断言尤其有用。

要在项目中启用该插件，请在 `build.gradle(.kts)` 文件中对其进行配置：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</TabItem>
</Tabs>

在 [文档](power-assert) 中了解更多关于 Kotlin Power-assert 插件的信息。

### 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，默认情况下启用 Kotlin K2 编译器。 无需其他操作。

### 在 Kotlin Playground 中试用 Kotlin K2 编译器

Kotlin Playground 支持 2.0.0 版本。 [快来看看！](https://pl.kotl.in/czuoQprce)

### IDE 中的支持

默认情况下，IntelliJ IDEA 和 Android Studio 仍然使用以前的编译器进行代码分析、代码完成、突出显示和其他 IDE 相关功能。 要在 IDE 中获得完整的 Kotlin 2.0 体验，请启用 K2 模式。

在你的 IDE 中，转到 **Settings** | **Languages & Frameworks** | **Kotlin** 并选择 **Enable K2 mode** 选项。 IDE 将使用其 K2 模式分析你的代码。

<img src="/img/k2-mode.png" alt="启用 K2 模式" width="200" style={{verticalAlign: 'middle'}}/>

启用 K2 模式后，由于编译器行为的更改，你可能会注意到 IDE 分析中的差异。 在我们的 [迁移指南](k2-compiler-migration-guide) 中了解新的 K2 编译器与以前的编译器有何不同。

* 在 [我们的博客](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 中了解更多关于 K2 模式的信息。
* 我们正在积极收集关于 K2 模式的反馈，请在我们的 [公共 Slack 频道](https://kotlinlang.slack.com/archives/C0B8H786P) 中分享你的想法。

### 留下你对新 K2 编译器的反馈

我们将不胜感激你的任何反馈！

* 在 [我们的问题跟踪器](https://kotl.in/issue) 中报告你使用新 K2 编译器遇到的任何问题。
* [启用“发送使用情况统计信息”选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允许 JetBrains 收集关于 K2 使用情况的匿名数据。

## Kotlin/JVM

从 2.0.0 版本开始，编译器可以生成包含 Java 22 字节码的类。
此版本还带来了以下更改：

* [使用 invokedynamic 生成 lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
* [kotlinx-metadata-jvm 库现在已稳定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 lambda 函数

Kotlin 2.0.0 引入了一种新的默认方法，用于使用 `invokedynamic` 生成 lambda 函数。 与传统的匿名类生成相比，此更改减少了应用程序的二进制大小。

自第一个版本以来，Kotlin 一直将 lambda 生成为匿名类。 但是，从 [Kotlin 1.5.0](whatsnew15#lambdas-via-invokedynamic) 开始，
可以通过使用 `-Xlambdas=indy` 编译器选项来使用 `invokedynamic` 生成的选项。 在 Kotlin 2.0.0 中，`invokedynamic` 已成为 lambda 生成的默认方法。
此方法产生更轻的二进制文件，并使 Kotlin 与 JVM 优化保持一致，从而确保应用程序受益于 JVM 性能的持续和未来的改进。

目前，与普通 lambda 编译相比，它有三个限制：

* 编译为 `invokedynamic` 的 lambda 不可序列化。
* 实验性的 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支持 `invokedynamic` 生成的 lambda。
* 在这样的 lambda 上调用 `.toString()` 会产生可读性较差的字符串表示形式：

```kotlin
fun main() {
    println({})

    // 使用 Kotlin 1.9.24 和反射，返回
    // () `->` kotlin.Unit
    
    // 使用 Kotlin 2.0.0，返回
    // FileKt$$Lambda$13/0x00007f88a0004608@506e1b77
}
```

要保留生成 lambda 函数的旧版行为，你可以：

* 使用 `@JvmSerializableLambda` 注释特定的 lambda。
* 使用编译器选项 `-Xlambdas=class` 来生成模块中使用旧版方法的所有 lambda。

### kotlinx-metadata-jvm 库现在已稳定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 库已变为 [稳定](components-stability#stability-levels-explained)。 既然该库已更改为 `kotlin` 包和坐标，你可以将其查找为 `kotlin-metadata-jvm`（没有“x”）。

以前，`kotlinx-metadata-jvm` 库有自己的发布方案和版本。 现在，我们将构建和发布 `kotlin-metadata-jvm` 更新作为 Kotlin 发布周期的一部分，并具有与 Kotlin 标准库相同的向后兼容性保证。

`kotlin-metadata-jvm` 库提供了一个 API 来读取和修改 Kotlin/JVM 编译器生成的二进制文件的元数据。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm). -->

## Kotlin/Native

此版本带来了以下更改：

* [使用信标 (signpost) 监控 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
* [解决与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
* [更改了 Kotlin/Native 中编译器参数的日志级别](#changed-log-level-for-compiler-arguments-in-kotlin-native)
* [显式地将标准库和平台依赖项添加到 Kotlin/Native](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
* [Gradle 配置缓存中的任务错误](#tasks-error-in-gradle-configuration-cache)

### 使用 Apple 平台上的信标 (signpost) 监控 GC 性能

以前，只能通过查看日志来监控 Kotlin/Native 垃圾收集器 (GC) 的性能。
但是，这些日志未与 Xcode Instruments 集成，Xcode Instruments 是一种流行的工具包，用于调查 iOS 应用的性能问题。

自 Kotlin 2.0.0 以来，GC 使用 Instruments 中可用的信标 (signpost) 报告暂停。
信标允许在你的应用中进行自定义日志记录，因此现在，当调试 iOS 应用性能时，你可以检查 GC 暂停是否对应于应用冻结。

在 [文档](native-memory-manager#monitor-gc-performance) 中了解更多关于 GC 性能分析的信息。

### 解决与 Objective-C 方法的冲突

Objective-C 方法可以有不同的名称，但具有相同数量和类型的参数。 例如，
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。
在 Kotlin 中，这些方法具有相同的签名，因此尝试使用它们会触发冲突的重载错误。

以前，你必须手动抑制冲突的重载才能避免此编译错误。 为了改善 Kotlin 与 Objective-C 的互操作性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 注解。

该注解指示 Kotlin 编译器忽略冲突的重载，以防从 Objective-C 类继承了具有相同参数类型但参数名称不同的多个函数。

应用此注解也比一般的错误抑制更安全。 此注解只能在覆盖 Objective-C 方法的情况下使用，这些方法受支持并经过测试，而一般的抑制可能会隐藏重要的错误并导致代码在不知不觉中损坏。

### 更改了编译器参数的日志级别

在此版本中，Kotlin/Native Gradle 任务（例如 `compile`、`link` 和 `cinterop`）中编译器参数的日志级别已从 `info` 更改为 `debug`。

由于 `debug` 是其默认值，因此日志级别与其他 Gradle 编译任务一致，并提供详细的调试信息，包括所有编译器参数。

### 显式地将标准库和平台依赖项添加到 Kotlin/Native

以前，Kotlin/Native 编译器隐式地解析标准库和平台依赖项，这导致 Kotlin Gradle 插件在 Kotlin 目标中的工作方式不一致。

现在，每个 Kotlin/Native Gradle 编译都通过 `compileDependencyFiles` [编译参数](multiplatform-dsl-reference#compilation-parameters) 显式地在其编译时库路径中包含标准库和平台依赖项。

### Gradle 配置缓存中的任务错误

自 Kotlin 2.0.0 以来，你可能会遇到配置缓存错误，其消息指示：
`invocation of Task.project at execution time is unsupported`。

此错误出现在诸如 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 之类的任务中。

但是，这是一个假阳性错误。 根本问题是存在与 Gradle 配置缓存不兼容的任务，例如 `publish*` 任务。

由于错误消息建议了不同的根本原因，因此这种差异可能不会立即显现出来。

由于错误报告中未明确说明确切原因，因此 [Gradle 团队已在解决该问题以修复报告](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0 提高了性能以及与 JavaScript 的互操作性：

* [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
* [支持命名导出 (named export)](#support-for-named-export)
* [支持 @JsExport 函数中的无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
* [在 Kotlin/Wasm 中生成 TypeScript 声明文件](#generation-of-typescript-declaration-files-in-kotlin-wasm)
* [支持捕获 JavaScript 异常](#support-for-catching-javascript-exceptions)
* [作为选项，现在支持新的异常处理提案](#new-exception-handling-proposal-is-now-supported-as-an-option)
* [`withWasm()` 函数已拆分为 JS 和 WASI 变体](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 默认使用 Binaryen 优化生产构建

Kotlin/Wasm