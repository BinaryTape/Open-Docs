[//]: # (title: Kotlin 2.0.0 中的新特性)

_[发布日期：2024 年 5 月 21 日](releases.md#release-details)_

Kotlin 2.0.0 版本已发布，并且[新的 Kotlin K2 编译器](#kotlin-k2-compiler)已稳定！此外，以下是一些其他亮点：

*   [新的 Compose 编译器 Gradle 插件](#new-compose-compiler-gradle-plugin)
*   [使用 invokedynamic 生成 lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 库现已稳定](#the-kotlinx-metadata-jvm-library-is-stable)
*   [使用 signpost 在 Apple 平台上监控 Kotlin/Native 的 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解决 Kotlin/Native 中与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
*   [支持 Kotlin/Wasm 中的命名导出](#support-for-named-export)
*   [支持 Kotlin/Wasm 中带 @JsExport 的函数中使用无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
*   [多平台项目中编译器选项的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [enum class values 泛型函数的稳定替代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [稳定的 AutoCloseable 接口](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 团队的一个重要里程碑。此次发布是 KotlinConf 2024 的核心。请观看开幕主题演讲，我们在其中宣布了激动人心的更新，并介绍了 Kotlin 语言的最新工作：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - 主题演讲"/>

## IDE 支持

支持 Kotlin 2.0.0 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改为 Kotlin 2.0.0。

*   有关 IntelliJ IDEA 对 Kotlin K2 编译器支持的详细信息，请参见 [IDE 支持](#support-in-ides)。
*   有关 IntelliJ IDEA 对 Kotlin 支持的更多详细信息，请参见 [Kotlin 版本发布](releases.md#ide-support)。

## Kotlin K2 编译器

通往 K2 编译器的道路漫长，但现在 JetBrains 团队终于准备好宣布其稳定版发布。
在 Kotlin 2.0.0 中，新的 Kotlin K2 编译器已默认使用，并且对于所有[目标](components-stability.md)平台——JVM、Native、Wasm 和 JS——都是稳定的。新编译器带来了显著的性能提升，加速了新语言特性开发，统一了 Kotlin 支持的所有平台，并为多平台项目提供了更好的架构。

JetBrains 团队通过成功编译选定的用户和内部项目中的 1000 万行代码，确保了新编译器的质量。18,000 名开发人员参与了稳定化过程，在总计 80,000 个项目中测试了新的 K2 编译器，并报告了他们发现的任何问题。

为了帮助 K2 编译器的迁移过程尽可能顺利，我们创建了 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。
本指南解释了编译器的诸多优点，强调了您可能遇到的任何变化，并描述了在必要时如何回滚到上一个版本。

在[一篇博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)中，我们探讨了 K2 编译器在不同项目中的性能。如果您想查看 K2 编译器性能的真实数据，并了解如何从您自己的项目中收集性能基准，请查阅该文章。

您还可以观看 Michail Zarečenskij（首席语言设计者）在 KotlinConf 2024 上进行的此次演讲，他讨论了 Kotlin 中的特性演进和 K2 编译器：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin 2.0 及更高版本的语言特性"/>

### 当前 K2 编译器限制

在您的 Gradle 项目中启用 K2 会有一些限制，这些限制可能会影响使用 Gradle 8.3 以下版本的项目，包括以下情况：

*   从 `buildSrc` 编译源代码。
*   在 included build 中编译 Gradle 插件。
*   如果在 Gradle 8.3 以下版本项目中使用其他 Gradle 插件，则会编译这些插件。
*   构建 Gradle 插件依赖项。

如果您遇到上述任何问题，可以采取以下步骤来解决：

*   为 `buildSrc`、任何 Gradle 插件及其依赖项设置语言版本：

    ```kotlin
    kotlin {
        compilerOptions {
            languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
            apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        }
    }
    ```

    > 如果您为特定任务配置语言和 API 版本，则这些值将覆盖 `compilerOptions` 扩展设置的值。在这种情况下，语言和 API 版本不应高于 1.9。
    >
    {style="note"}

*   将您项目中的 Gradle 版本更新到 8.3 或更高版本。

### 智能转换改进

Kotlin 编译器可以在特定情况下自动将对象转换为某种类型，省去了您手动进行显式转换的麻烦。这被称为[智能转换](typecasts.md#smart-casts)。
Kotlin K2 编译器现在在比以前更多的场景下执行智能转换。

在 Kotlin 2.0.0 中，我们改进了以下方面的智能转换：

*   [局部变量及更广阔的作用域](#local-variables-and-further-scopes)
*   [使用逻辑或操作符进行类型检测](#type-checks-with-logical-or-operator)
*   [内联函数](#inline-functions)
*   [函数类型的属性](#properties-with-function-types)
*   [异常处理](#exception-handling)
*   [递增和递减操作符](#increment-and-decrement-operators)

#### 局部变量及更广阔的作用域

此前，如果一个变量在 `if` 条件内求值结果为非 `null`，该变量会被智能转换。有关此变量的信息随后会在 `if` 代码块的作用域内进一步共享。

然而，如果您在 `if` 条件**之外**声明变量，则在 `if` 条件内将没有关于该变量的信息可用，因此无法进行智能转换。`when` 表达式和 `while` 循环也存在这种行为。

从 Kotlin 2.0.0 开始，如果您在使用 `if`、`when` 或 `while` 条件之前声明变量，那么编译器收集到的关于该变量的任何信息都将在相应的代码块中可访问，以便进行智能转换。

当您想将布尔条件提取到变量中时，这会很有用。然后，您可以为变量提供有意义的名称，这将提高代码可读性，并使其能够在代码中重复使用。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 在 Kotlin 2.0.0 中，编译器可以访问
        // 有关 isCat 的信息，因此它知道
        // animal 被智能转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 有关智能转换的信息，因此调用 purr()
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 使用逻辑或操作符进行类型检测

在 Kotlin 2.0.0 中，如果您将对象的类型检测与或操作符 (`||`) 结合使用，则会智能转换为它们最近的公共超类型。在此更改之前，智能转换总是针对 `Any` 类型进行的。

在这种情况下，您仍然需要在此后手动检测对象类型，然后才能访问其任何属性或调用其函数。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能转换为公共超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智能转换
        // 为 Any 类型，因此调用 signal() 函数会触发
        // 未解析引用错误。signal() 函数只有在
        // 再次进行类型检测后才能成功调用：

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似**。Kotlin 不支持联合类型。
>
{style="note"}

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器以不同的方式处理内联函数，
结合其他编译器分析，判断进行智能转换是否安全。

具体来说，内联函数现在被视为具有隐式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 函数都会在原地调用。由于 lambda 函数是在原地调用的，编译器知道 lambda 函数不会泄露对其函数体中包含的任何变量的引用。

编译器使用此知识以及其他编译器分析来决定智能转换任何捕获的变量是否安全。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，编译器知道 processor 
        // 是一个局部变量，并且 inlineAction() 是一个内联函数，因此
        // 对 processor 的引用不会泄露。因此，进行智能转换是安全的。

        // 如果 processor 不为 null，则 processor 会被智能转换
        if (processor != null) {
            // 编译器知道 processor 不为 null，因此无需安全调用
            processor.process()

            // 在 Kotlin 1.9.20 中，您必须执行安全调用：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 函数类型的属性

在 Kotlin 的先前版本中，存在一个错误，导致函数类型的类属性无法智能转换。
我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不为 null，则
        // provider 会被智能转换
        if (provider != null) {
            // 编译器知道 provider 不为 null
            provider()

            // 在 1.9.20 中，编译器不知道 provider 不为
            // null，因此会触发错误：
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您重载 `invoke` 操作符，此更改也适用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider()
            // 在 1.9.20 中，编译器会触发错误： 
            // Reference has a nullable type 'Provider?' use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 异常处理

在 Kotlin 2.0.0 中，我们改进了异常处理，以便智能转换信息可以传递到 `catch`
和 `finally` 代码块。此更改使您的代码更安全，因为编译器会跟踪您的对象是否具有可空类型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智能转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 0

        // 编译器会拒绝 stringInput 的先前智能转换信息。
        // 现在 stringInput 具有 String? 类型。
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，编译器知道 stringInput 
        // 可以为 null，因此 stringInput 保持可空。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，编译器会说不需要安全调用，
        // 但这是不正确的。
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 递增和递减操作符

在 Kotlin 2.0.0 之前，编译器不理解对象类型在使用递增或递减操作符后会发生变化。由于编译器无法准确地跟踪对象类型，您的代码可能导致未解析引用错误。在 Kotlin 2.0.0 中，此问题已修复：

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

    // 检测 unknownObject 是否继承自 Tau 接口
    // 请注意，unknownObject 可能同时继承自
    // Rho 和 Tau 接口。
    if (unknownObject is Tau) {

        // 使用来自接口 Rho 的重载 inc() 操作符。
        // 在 Kotlin 2.0.0 中，unknownObject 的类型被智能转换为
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型为
        // Sigma，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，当调用 inc() 时，编译器不会执行智能转换，
        // 因此编译器仍然认为 unknownObject 的类型是 Tau。调用 sigma() 函数
        // 会抛出编译期错误。
        
        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型为
        // Sigma，因此调用 tau() 函数会抛出编译期错误。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为
        // unknownObject 的类型是 Tau，因此可以调用 tau() 函数，
        // 但会抛出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台改进

在 Kotlin 2.0.0 中，我们在 K2 编译器中对 Kotlin 多平台进行了以下方面的改进：

*   [编译期间公共源和平台源的分离](#separation-of-common-and-platform-sources-during-compilation)
*   [expected 和 actual 声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译期间公共源和平台源的分离

此前，Kotlin 编译器的设计使其无法在编译期保持公共和平台源代码集的分离。结果是，公共代码可以访问平台代码，这导致了不同平台之间行为不一致。此外，一些编译器设置和公共代码的依赖项也曾泄露到平台代码中。

在 Kotlin 2.0.0 中，我们新的 Kotlin K2 编译器实现包括对编译方案的重新设计，以确保公共和平台源代码集之间的严格分离。当您使用 [expected 和 actual 函数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)时，此更改最为明显。此前，您的公共代码中的函数调用可能解析为平台代码中的函数。例如：

<table>
   <tr>
       <td>公共代码</td>
       <td>平台代码</td>
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
// JavaScript 平台上没有
// foo() 函数重载
```

</td>
</tr>
</table>

在此示例中，公共代码的行为因其运行平台的不同而异：

*   在 JVM 平台上，调用公共代码中的 `foo()` 函数会导致平台代码中的 `foo()` 函数被调用，显示为 `platform foo`。
*   在 JavaScript 平台上，调用公共代码中的 `foo()` 函数会导致公共代码中的 `foo()` 函数被调用，显示为 `common foo`，因为平台代码中没有这样的函数可用。

在 Kotlin 2.0.0 中，公共代码无法访问平台代码，因此两个平台都成功将 `foo()` 函数解析为公共代码中的 `foo()` 函数：`common foo`。

除了跨平台行为一致性得到改进之外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间行为冲突的情况。例如，当您使用 [expected 和 actual 类](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)时，会出现以下情况：

<table>
   <tr>
       <td>公共代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 2.0.0 之前，
    // 它只会触发 IDE 错误
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class
    // Identity has no default constructor.
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

在此示例中，expected 类 `Identity` 没有默认构造函数，因此无法在公共代码中成功调用。
此前，只有 IDE 报告了错误，但代码在 JVM 上仍然成功编译。然而，现在编译器正确地报告了错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何时解析行为不变

我们仍在迁移到新的编译方案，因此当您调用不在同一源代码集中的函数时，解析行为仍然相同。您主要会在公共代码中使用多平台库中的重载时注意到这种差异。

假设您有一个库，其中有两个 `whichFun()` 函数，具有不同的签名：

```kotlin
// 示例库

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在公共代码中调用 `whichFun()` 函数，则会解析库中具有最相关实参类型的函数：

```kotlin
// 一个在 JVM 目标上使用示例库的项目

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果您在同一源代码集中声明 `whichFun()` 的重载，则会解析来自公共代码的函数，因为您的代码无法访问平台特有版本：

```kotlin
// 未使用示例库

// MODULE: common
fun whichFun(x: Any) = println("common function")

fun main() {
    whichFun(2)
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

与多平台库类似，由于 `commonTest` 模块位于单独的源代码集中，它仍然可以访问平台特有代码。因此，`commonTest` 模块中函数调用的解析表现出与旧编译方案相同的行为。

将来，这些剩余的案例将与新的编译方案更加一致。

#### expected 和 actual 声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台项目中使用 [expected 和 actual 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它们必须具有相同的[可见性级别](visibility-modifiers.md)。
Kotlin 2.0.0 现在也支持不同的可见性级别，但**仅当** actual 声明比 expected 声明_更宽松_时。例如：

```kotlin
expect internal class Attribute // 可见性为 internal
actual class Attribute          // 默认可见性为 public，
                                // 这更宽松
```

类似地，如果您在 actual 声明中使用[类型别名](type-aliases.md)，则**底层类型**的可见性应与 expected 声明相同或更宽松。例如：

```kotlin
expect internal class Attribute                 // 可见性为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 默认可见性为 public，
                                                // 这更宽松
```

### 编译器插件支持

目前，Kotlin K2 编译器支持以下 Kotlin 编译器插件：

*   [`all-open`](all-open-plugin.md)
*   [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
*   [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
*   [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
*   [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
*   [Lombok](lombok.md)
*   [`no-arg`](no-arg-plugin.md)
*   [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
*   [SAM with receiver](sam-with-receiver-plugin.md)
*   [serialization](serialization.md)
*   [Power-assert](power-assert.md)

此外，Kotlin K2 编译器还支持：

*   Jetpack Compose 编译器插件 2.0.0，该插件已[移至 Kotlin 版本库](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 以来的 [Kotlin 符号处理 (KSP) 插件](ksp-overview.md)。

> 如果您使用任何其他编译器插件，请查看其文档以了解它们是否与 K2 兼容。
>
{style="tip"}

### 实验性的 Kotlin Power-assert 编译器插件

> Kotlin Power-assert 插件是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时更改。
>
{style="warning"}

Kotlin 2.0.0 引入了一个实验性的 Power-assert 编译器插件。此插件通过在失败消息中包含上下文信息来改进测试编写体验，使调试更轻松高效。

开发人员通常需要使用复杂的断言库来编写有效的测试。Power-assert 插件通过自动生成包含断言表达式中间值的失败消息来简化此过程。这有助于开发人员快速理解测试失败的原因。

当测试中的断言失败时，改进的错误消息会显示断言中所有变量和子表达式的值，清楚地表明条件的哪一部分导致了失败。这对于检查多个条件的复杂断言特别有用。

要在您的项目中启用该插件，请在 `build.gradle(.kts)` 文件中配置它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "2.0.0"
    kotlin("plugin.power-assert") version "2.0.0"
}

powerAssert {
    functions = listOf("kotlin.assert", "kotlin.test.assertTrue")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.0.0'
    id 'org.jetbrains.kotlin.plugin.power-assert' version '2.0.0'
}

powerAssert {
    functions = ["kotlin.assert", "kotlin.test.assertTrue"]
}
```

</tab>
</tabs>

在[文档](power-assert.md)中了解有关 Kotlin Power-assert 插件的更多信息。

### 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，Kotlin K2 编译器默认启用。无需额外操作。

### 在 Kotlin Playground 中试用 Kotlin K2 编译器

Kotlin Playground 支持 2.0.0 版本。[去试试吧！](https://pl.kotl.in/czuoQprce)

### IDE 支持

默认情况下，IntelliJ IDEA 和 Android Studio 仍然使用旧版编译器进行代码分析、代码补全、高亮显示及其他 IDE 相关特性。要在您的 IDE 中获得完整的 Kotlin 2.0 体验，请启用 K2 模式。

在您的 IDE 中，转到 **Settings** | **Languages & Frameworks** | **Kotlin** 并选择 **Enable K2 mode** 选项。
IDE 将使用其 K2 模式分析您的代码。

![Enable K2 mode](k2-mode.png){width=200}

启用 K2 模式后，由于编译器行为变化，您可能会注意到 IDE 分析中的差异。在我们的[迁移指南](k2-compiler-migration-guide.md)中了解新 K2 编译器与旧编译器的不同之处。

*   在[我们的博客](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)中了解更多关于 K2 模式的信息。
*   我们正在积极收集关于 K2 模式的反馈，请在我们的[公共 Slack 频道](https://kotlinlang.slack.com/archives/C0B8H786P)分享您的想法。

### 对新 K2 编译器提出您的反馈

我们感谢您的任何反馈！

*   在我们的[问题跟踪器](https://kotl.in/issue)中报告您使用新 K2 编译器遇到的任何问题。
*   [启用“发送使用情况统计信息”选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## Kotlin/JVM

从 2.0.0 版本开始，编译器可以生成包含 Java 22 字节码的类。
此版本还带来了以下更改：

*   [使用 invokedynamic 生成 lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 库现已稳定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 lambda 函数

Kotlin 2.0.0 引入了一种新的默认方法，即使用 `invokedynamic` 生成 lambda 函数。与传统的匿名类生成相比，此更改减少了应用程序的二进制大小。

自第一个版本以来，Kotlin 一直将 lambda 作为匿名类生成。然而，从 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 开始，通过使用 `-Xlambdas=indy` 编译器选项，`invokedynamic` 生成选项已可用。在 Kotlin 2.0.0 中，`invokedynamic` 已成为 lambda 生成的默认方法。此方法生成更轻量级的二进制文件，并使 Kotlin 与 JVM 优化保持一致，确保应用程序受益于正在进行和未来的 JVM 性能改进。

目前，与普通 lambda 编译相比，它有三个限制：

*   编译为 `invokedynamic` 的 lambda 不可序列化。
*   实验性的 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支持由 `invokedynamic` 生成的 lambda。
*   在此类 lambda 上调用 `.toString()` 会生成可读性较差的字符串表示：

    ```kotlin
    fun main() {
        println({})

        // 在 Kotlin 1.9.24 及反射下，返回
        // () -> kotlin.Unit
        
        // 在 Kotlin 2.0.0 下，返回
        // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
    }
    ```

要保留生成 lambda 函数的旧行为，您可以：

*   使用 `@JvmSerializableLambda` 注解特定的 lambda。
*   使用编译器选项 `-Xlambdas=class` 以旧方法生成模块中的所有 lambda。

### kotlinx-metadata-jvm 库已稳定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 库变得[稳定](components-stability.md#stability-levels-explained)。现在，该库已更改为 `kotlin` 包和坐标，您可以在 `kotlin-metadata-jvm`（不带“x”）中找到它。

此前，`kotlinx-metadata-jvm` 库有自己的发布方案和版本。现在，我们将作为 Kotlin 发布周期的一部分构建和发布 `kotlin-metadata-jvm` 更新，并提供与 Kotlin 标准库相同的向后兼容性保证。

`kotlin-metadata-jvm` 库提供了一个 API，用于读取和修改由 Kotlin/JVM 编译器生成的二进制文件的元数据。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

此版本带来了以下更改：

*   [使用 signpost 监控 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解决与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Native 中编译器实参的日志级别已更改](#changed-log-level-for-compiler-arguments)
*   [显式地将标准库和平台依赖项添加到 Kotlin/Native](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle 配置缓存中的任务错误](#tasks-error-in-gradle-configuration-cache)

### 使用 signpost 监控 GC 性能

此前，只能通过查看日志来监控 Kotlin/Native 垃圾收集器 (GC) 的性能。然而，这些日志未与 Xcode Instruments（一个用于调查 iOS 应用程序性能问题的流行工具包）集成。

自 Kotlin 2.0.0 以来，GC 会使用 Instruments 中可用的 signpost 报告暂停。Signpost 允许在您的应用程序中进行自定义日志记录，因此现在，在调试 iOS 应用性能时，您可以检查 GC 暂停是否对应于应用程序冻结。

在[文档](native-memory-manager.md#monitor-gc-performance)中了解有关 GC 性能分析的更多信息。

### 解决与 Objective-C 方法的冲突

Objective-C 方法可以有不同的名称，但形参的数量和类型相同。例如，
[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc)
和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。
在 Kotlin 中，这些方法具有相同的签名，因此尝试使用它们会触发冲突的重载错误。

此前，您必须手动抑制冲突的重载以避免此编译错误。为了改进 Kotlin 与 Objective-C 的互操作性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 注解。

当从 Objective-C 类继承多个具有相同实参类型但不同实参名称的函数时，此注解指示 Kotlin 编译器忽略冲突的重载。

应用此注解也比一般的错误抑制更安全。此注解仅可在覆盖 Objective-C 方法的情况下使用，这些方法已受支持并经过测试，而一般的抑制可能会隐藏重要的错误并导致代码静默地出现问题。

### Kotlin/Native 中编译器实参的日志级别已更改

在此版本中，Kotlin/Native Gradle 任务（例如 `compile`、`link` 和 `cinterop`）中编译器实参的日志级别已从 `info` 更改为 `debug`。

将 `debug` 作为其默认值，日志级别与其他的 Gradle 编译任务保持一致，并提供详细的调试信息，包括所有编译器实参。

### 显式地将标准库和平台依赖项添加到 Kotlin/Native

此前，Kotlin/Native 编译器隐式地解析标准库和平台依赖项，这导致 Kotlin Gradle 插件在不同 Kotlin 目标之间工作方式不一致。

现在，每个 Kotlin/Native Gradle 编译都通过 `compileDependencyFiles` [编译形参](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters)显式地将标准库和平台依赖项包含在其编译期库路径中。

### Gradle 配置缓存中的任务错误

自 Kotlin 2.0.0 起，您可能会遇到配置缓存错误，消息指示：
`invocation of Task.project at execution time is unsupported`。

此错误出现在 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 等任务中。

然而，这是一个误报。根本问题是存在与 Gradle 配置缓存不兼容的任务，例如 `publish*` 任务。

这种差异可能不会立即显现，因为错误消息暗示了不同的根本原因。

由于错误报告中未明确说明确切原因，[Gradle 团队已在着手解决此问题以修复报告](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0 改进了性能和与 JavaScript 的互操作性：

*   [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
*   [支持命名导出](#support-for-named-export)
*   [支持带 @JsExport 的函数中使用无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [在 Kotlin/Wasm 中生成 TypeScript 声明文件](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [支持捕获 JavaScript 异常](#support-for-catching-javascript-exceptions)
*   [现在支持将新的异常处理提案作为一个选项](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [withWasm() 函数被拆分为 JS 和 WASI 变体](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 默认使用 Binaryen 优化生产构建

Kotlin/Wasm 工具链现在在生产编译期间将 Binaryen 工具应用于所有项目，而不是之前的手动设置方法。根据我们的估计，这应该可以提高项目的运行时性能并减小二进制大小。

> 此更改仅影响生产编译。开发编译过程保持不变。
>
{style="note"}

### 支持命名导出

此前，Kotlin/Wasm 的所有导出声明都使用默认导出导入到 JavaScript 中：

```javascript
//JavaScript:
import Module from "./index.mjs"

Module.add()
```

现在，您可以按名称导入每个用 `@JsExport` 标记的 Kotlin 声明：

```kotlin
// Kotlin:
@JsExport
fun add(a: Int, b: Int) = a + b
```

```javascript
//JavaScript:
import { add } from "./index.mjs"
```

命名导出使得 Kotlin 和 JavaScript 模块之间共享代码变得更容易。它们提高了可读性，并帮助您管理模块之间的依赖项。

### 支持带 @JsExport 的函数中使用无符号原始类型

从 Kotlin 2.0.0 开始，您可以在外部声明和带有 `@JsExport` 注解的函数中使用[无符号原始类型](unsigned-integer-types.md)，该注解使 Kotlin/Wasm 函数在 JavaScript 代码中可用。

这有助于缓解此前阻止[无符号原始类型](unsigned-integer-types.md)直接用于导出和外部声明的限制。现在您可以导出以无符号原始类型作为返回或形参类型的函数，并使用返回或消费无符号原始类型的外部声明。

有关 Kotlin/Wasm 与 JavaScript 互操作性的更多信息，请参见[文档](wasm-js-interop.md#use-javascript-code-in-kotlin)。

### 在 Kotlin/Wasm 中生成 TypeScript 声明文件

> 在 Kotlin/Wasm 中生成 TypeScript 声明文件是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时放弃或更改。
>
{style="warning"}

在 Kotlin 2.0.0 中，Kotlin/Wasm 编译器现在能够从 Kotlin 代码中的任何 `@JsExport` 声明生成 TypeScript 定义。这些定义可被 IDE 和 JavaScript 工具使用，以提供代码自动补全，帮助进行类型检测，并使在 JavaScript 中包含 Kotlin 代码变得更容易。

Kotlin/Wasm 编译器会收集任何用 `@JsExport` 标记的[顶层函数](wasm-js-interop.md#functions-with-the-jsexport-annotation)，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

要生成 TypeScript 定义，请在 `wasmJs {}` 代码块中的 `build.gradle(.kts)` 文件中添加 `generateTypeScriptDefinitions()` 函数：

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

### 支持捕获 JavaScript 异常

此前，Kotlin/Wasm 代码无法捕获 JavaScript 异常，这使得处理源自 JavaScript 端的错误变得困难。

在 Kotlin 2.0.0 中，我们实现了对捕获 Kotlin/Wasm 中 JavaScript 异常的支持。此实现允许您使用 `try-catch` 代码块，通过特定类型（如 `Throwable` 或 `JsException`）来正确处理这些错误。

此外，`finally` 代码块（无论是否抛出异常都能帮助执行代码）现在也能正常工作。尽管我们引入了对捕获 JavaScript 异常的支持，但当 JavaScript 异常（例如调用堆栈）发生时，不会提供额外信息。然而，[我们正在开发这些实现](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 现在支持将新的异常处理提案作为一个选项

在此版本中，我们引入了对 WebAssembly [异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md)新版本在 Kotlin/Wasm 中的支持。

此更新确保新提案与 Kotlin 要求保持一致，允许在仅支持该提案最新版本的虚拟机上使用 Kotlin/Wasm。

通过使用 `-Xwasm-use-new-exception-proposal` 编译器选项激活新的异常处理提案，该选项默认是关闭的。

### withWasm() 函数被拆分为 JS 和 WASI 变体

`withWasm()` 函数（曾用于为层次结构模板提供 Wasm 目标）已被弃用，取而代之的是专用的 `withWasmJs()` 和 `withWasmWasi()` 函数。

现在您可以将 WASI 和 JS 目标分离到树定义中的不同组。

## Kotlin/JS

除了其他更改，此版本还为 Kotlin 带来了现代化 JS 编译，支持 ES2015 标准的更多特性：

*   [新的编译目标](#new-compilation-target)
*   [将挂起函数作为 ES2015 生成器](#suspend-functions-as-es2015-generators)
*   [向 main 函数传递实参](#passing-arguments-to-the-main-function)
*   [Kotlin/JS 项目的按文件编译](#per-file-compilation-for-kotlin-js-projects)
*   [改进的集合互操作性](#improved-collection-interoperability)
*   [支持 createInstance()](#support-for-createinstance)
*   [支持类型安全的普通 JavaScript 对象](#support-for-type-safe-plain-javascript-objects)
*   [支持 npm 包管理器](#support-for-npm-package-manager)
*   [编译任务的更改](#changes-to-compilation-tasks)
*   [停止支持旧版 Kotlin/JS JAR artifact](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新的编译目标

在 Kotlin 2.0.0 中，我们正在为 Kotlin/JS 添加一个新的编译目标 `es2015`。这是一种新的方式，让您一次性启用 Kotlin 支持的所有 ES2015 特性。

您可以在 `build.gradle(.kts)` 文件中这样设置它：

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新目标自动启用 [ES 类和模块](whatsnew19.md#experimental-support-for-es2015-classes-and-modules)
以及新支持的 [ES 生成器](#suspend-functions-as-es2015-generators)。

### 将挂起函数作为 ES2015 生成器

此版本引入了将[挂起函数](composing-suspending-functions.md)编译为 ES2015 生成器的[实验性](components-stability.md#stability-levels-explained)支持。

使用生成器而不是状态机应该会减小项目最终打包的大小。例如，JetBrains 团队通过使用 ES2015 生成器成功将其 Space 项目的打包大小减少了 20%。

在[官方文档](https://262.ecma-international.org/6.0/)中了解有关 ES2015 (ECMAScript 2015, ES6) 的更多信息。

### 向 main 函数传递实参

从 Kotlin 2.0.0 开始，您可以为 `main()` 函数指定 `args` 的来源。此特性使得使用命令行和传递实参变得更容易。

为此，请定义带有新的 `passAsArgumentToMainFunction()` 函数的 `js {}` 代码块，该函数返回一个字符串数组：

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

该函数在运行时执行。它接受 JavaScript 表达式并将其用作 `args: Array<String>` 实参，而不是 `main()` 函数调用。

此外，如果您使用 Node.js 运行时，您可以利用一个特殊别名。它允许您将 `process.argv` 一次性传递给 `args` 形参，而无需每次手动添加：

```kotlin
kotlin {
    js {
        binary.executable()
        nodejs {
            passProcessArgvToMainFunction()
        }
    }
}
```

### Kotlin/JS 项目的按文件编译

Kotlin 2.0.0 引入了 Kotlin/JS 项目输出的新粒度选项。您现在可以设置按文件编译，即为每个 Kotlin 文件生成一个 JavaScript 文件。这有助于显著优化最终打包的大小并提高程序的加载时间。

此前，只有两种输出选项。Kotlin/JS 编译器可以为整个项目生成一个单独的 `.js` 文件。然而，该文件可能过大且不方便使用。无论何时您想使用项目中的函数，都必须将整个 JavaScript 文件作为依赖项包含在内。或者，您可以配置为每个项目模块编译一个单独的 `.js` 文件。这仍然是默认选项。

由于模块文件也可能过大，从 Kotlin 2.0.0 开始，我们添加了更精细的输出，即为每个 Kotlin 文件生成一个（如果文件包含导出声明，则为两个）JavaScript 文件。要启用按文件编译模式：

1.  将 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 函数添加到您的构建文件中以支持 ECMAScript 模块：

    ```kotlin
    // build.gradle.kts
    kotlin {
        js(IR) {
            useEsModules() // Enables ES2015 modules
            browser()
        }
    }
    ```

    您也可以使用新的 `es2015` [编译目标](#new-compilation-target)来实现。

2.  应用 `-Xir-per-file` 编译器选项或更新您的 `gradle.properties` 文件：

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` 是默认值
    ```

### 改进的集合互操作性

从 Kotlin 2.0.0 开始，可以将带有 Kotlin 集合类型的签名声明导出到 JavaScript（和 TypeScript）。这适用于 Set、Map 和 List 集合类型及其可变对应类型。

要在 JavaScript 中使用 Kotlin 集合，首先使用 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解标记必要的声明：

```kotlin
// Kotlin
@JsExport
data class User(
    val name: String,
    val friends: List<User> = emptyList()
)

@JsExport
val me = User(
    name = "Me",
    friends = listOf(User(name = "Kodee"))
)
```

然后，您可以从 JavaScript 中将它们作为常规 JavaScript 数组使用：

```javascript
// JavaScript
import { User, me, KtList } from "my-module"

const allMyFriendNames = me.friends
    .asJsReadonlyArrayView()
    .map(x => x.name) // ['Kodee']
```

> 遗憾的是，目前仍无法从 JavaScript 创建 Kotlin 集合。我们计划在 Kotlin 2.0.20 中添加此功能。
>
{style="note"}

### 支持 createInstance()

从 Kotlin 2.0.0 开始，您可以使用 Kotlin/JS 目标中的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函数。此前，它仅在 JVM 上可用。

`KClass` 接口中的此函数创建指定类的新实例，这对于获取 Kotlin 类的运行时引用很有用。

### 支持类型安全的普通 JavaScript 对象

> `js-plain-objects` 插件是[实验性的](components-stability.md#stability-levels-explained)。
> 它可能随时放弃或更改。`js-plain-objects` 插件**仅**支持 K2 编译器。
>
{style="warning"}

为了使使用 JavaScript API 变得更容易，在 Kotlin 2.0.0 中，我们提供了一个新插件：[`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)，
您可以使用它来创建类型安全的普通 JavaScript 对象。该插件会检查您的代码中是否有任何带有 `@JsPlainObject` 注解的外部接口，并添加：

*   伴生对象中的内联 `invoke` 操作符函数，您可以将其用作构造函数。
*   一个 `.copy()` 函数，您可以使用它创建对象的副本，同时调整其某些属性。

例如：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface User {
    var name: String
    val age: Int
    val email: String?
}

fun main() {
    // 创建一个 JavaScript 对象
    val user = User(name = "Name", age = 10)
    // 复制对象并添加电子邮件
    val copy = user.copy(age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

通过这种方法创建的任何 JavaScript 对象都更安全，因为您不仅可以在运行时看到错误，还可以在编译期看到它们，甚至由 IDE 高亮显示。

请看这个示例，它使用 `fetch()` 函数通过外部接口与 JavaScript API 交互，以描述 JavaScript 对象的形状：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch 的包装器
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 由于“metod”未被识别，会触发编译期错误
// 为 method
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// 由于 method 是必需的，会触发编译期错误
fetch("https://google.com", options = FetchOptions(body = "SOME STRING")) 
```

相比之下，如果您改用 `js()` 函数创建 JavaScript 对象，则错误只会在运行时发现或根本不会触发：

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 没有错误触发。由于“metod”未被识别，使用了错误的方法
// (GET)。
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// 默认情况下使用 GET 方法。会触发运行时错误，因为
// body 不应存在。
fetch("https://google.com", options = js("{ body: 'SOME STRING' }"))
// TypeError: Window.fetch: HEAD or GET Request cannot have a body
```

要使用 `js-plain-objects` 插件，请将以下内容添加到您的 `build.gradle(.kts)` 文件中：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.js-plain-objects") version "2.0.0"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.js-plain-objects" version "2.0.0"
}
```

</tab>
</tabs>

### 支持 npm 包管理器

此前，Kotlin 多平台 Gradle 插件只能使用 [Yarn](https://yarnpkg.com/lang/en/) 作为包管理器来下载和安装 npm 依赖项。从 Kotlin 2.0.0 开始，您可以改为使用 [npm](https://www.npmjs.com/) 作为您的包管理器。使用 npm 作为包管理器意味着您在设置期间需要管理的一个工具更少。

为了向后兼容，Yarn 仍然是默认的包管理器。要使用 npm 作为您的包管理器，请在您的 `gradle.properties` 文件中设置以下属性：

```kotlin
kotlin.js.yarn = false
```

### 编译任务的更改

此前，`webpack` 和 `distributeResources` 编译任务都指向相同的目录。此外，`distribution` 任务也将 `dist` 声明为其输出目录。这导致输出重叠并产生了编译警告。

因此，从 Kotlin 2.0.0 开始，我们实现了以下更改：

*   `webpack` 任务现在指向一个单独的文件夹。
*   `distributeResources` 任务已被完全移除。
*   `distribution` 任务现在具有 `Copy` 类型并指向 `dist` 文件夹。

### 停止支持旧版 Kotlin/JS JAR artifact

从 Kotlin 2.0.0 开始，Kotlin 发行版不再包含带有 `.jar` 扩展名的旧版 Kotlin/JS artifact。旧版 artifact 用于不受支持的旧版 Kotlin/JS 编译器，而对于使用 `klib` 格式的 IR 编译器来说是不必要的。

## Gradle 改进

Kotlin 2.0.0 完全兼容 Gradle 6.8.3 到 8.5。您还可以使用最高到最新 Gradle 版本的 Gradle 版本，但如果您这样做，请记住您可能会遇到弃用警告或某些新的 Gradle 特性可能无法正常工作。

此版本带来了以下更改：

*   [多平台项目中编译器选项的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新的 Compose 编译器 Gradle 插件](#new-compose-compiler-gradle-plugin)
*   [区分 JVM 和 Android 已发布库的新属性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [改进了 Kotlin/Native 中 CInteropProcess 的 Gradle 依赖项处理](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradle 中的可见性更改](#visibility-changes-in-gradle)
*   [Gradle 项目中 Kotlin 数据的新目录](#new-directory-for-kotlin-data-in-gradle-projects)
*   [仅在需要时下载 Kotlin/Native 编译器](#kotlin-native-compiler-downloaded-when-needed)
*   [弃用旧的编译器选项定义方式](#deprecated-old-ways-of-defining-compiler-options)
*   [提升了最低支持的 AGP 版本](#bumped-minimum-supported-agp-version)
*   [用于尝试最新语言版本的新 Gradle 属性](#new-gradle-property-for-trying-the-latest-language-version)
*   [构建报告的新 JSON 输出格式](#new-json-output-format-for-build-reports)
*   [kapt 配置从超配置继承注解处理器](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradle 插件不再使用弃用的 Gradle 约定](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 多平台项目中编译器选项的新 Gradle DSL

> 此特性是[实验性的](components-stability.md#stability-levels-explained)。它可能随时放弃或更改。
> 仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

在 Kotlin 2.0.0 之前，在 Gradle 多平台项目中配置编译器选项只能在较低级别进行，例如按任务、编译或源代码集。为了使在项目中更普遍地配置编译器选项变得更容易，Kotlin 2.0.0 引入了新的 Gradle DSL。

通过这个新的 DSL，您可以在扩展级别为所有目标和共享源代码集（如 `commonMain`）以及在目标级别为特定目标配置编译器选项：

```kotlin
kotlin {
    compilerOptions {
        // 扩展级别的公共编译器选项，用作
        // 所有目标和共享源代码集的默认值
        allWarningsAsErrors.set(true)
    }
    jvm {
        compilerOptions {
            // 目标级别的 JVM 编译器选项，用作
            // 此目标中所有编译的默认值
            noJdk.set(true)
        }
    }
}
```

整个项目配置现在有三层。最高层是扩展级别，然后是目标级别，最低层是编译单元（通常是编译任务）：

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

较高层次的设置用作较低层次的约定（默认值）：

*   扩展编译器选项的值是目标编译器选项的默认值，包括共享源代码集，如 `commonMain`、`nativeMain` 和 `commonTest`。
*   目标编译器选项的值用作编译单元（任务）编译器选项的默认值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务。

反过来，在较低层次进行的配置会覆盖较高层次的相关设置：

*   任务级别的编译器选项会覆盖目标或扩展级别的相关配置。
*   目标级别的编译器选项会覆盖扩展级别的相关配置。

配置项目时，请记住某些旧的编译器选项设置方式已被[弃用](#deprecated-old-ways-of-defining-compiler-options)。

我们鼓励您在多平台项目中尝试新的 DSL，并在 [YouTrack](https://kotl.in/issue) 中留下反馈，因为我们计划将此 DSL 作为配置编译器选项的推荐方法。

### 新的 Compose 编译器 Gradle 插件

Jetpack Compose 编译器（将可组合项转换为 Kotlin 代码）现已合并到 Kotlin 版本库中。这将有助于 Compose 项目过渡到 Kotlin 2.0.0，因为 Compose 编译器将始终与 Kotlin 同步发布。这还将 Compose 编译器版本提升到 2.0.0。

要在您的项目中使用新的 Compose 编译器，请在 `build.gradle(.kts)` 文件中应用 `org.jetbrains.kotlin.plugin.compose` Gradle 插件，并将其版本设置为与 Kotlin 2.0.0 相同。

要了解有关此更改的更多信息并查看迁移说明，请参见 [Compose 编译器](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 文档。

### 区分 JVM 和 Android 已发布库的新属性

从 Kotlin 2.0.0 开始，[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle 属性默认随所有 Kotlin 变体发布。

该属性有助于区分 Kotlin 多平台库的 JVM 和 Android 变体。它表明某个库变体更适合某个 JVM 环境。目标环境可以是“android”、“standard-jvm”或“no-jvm”。

发布此属性应能使非多平台客户端（例如仅 Java 项目）使用带有 JVM 和 Android 目标的 Kotlin 多平台库更加健壮。

如有必要，您可以禁用属性发布。为此，请将以下 Gradle 选项添加到您的 `gradle.properties` 文件中：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### 改进了 Kotlin/Native 中 CInteropProcess 的 Gradle 依赖项处理

在此版本中，我们增强了 `defFile` 属性的处理，以确保 Kotlin/Native 项目中更好的 Gradle 任务依赖项管理。

在此更新之前，如果 `defFile` 属性被指定为尚未执行的另一个任务的输出，Gradle 构建可能会失败。此问题的变通方法是为此任务添加依赖项：

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    defFileProperty.set(createDefFileTask.flatMap { it.defFile.asFile })
                    project.tasks.named(interopProcessingTaskName).configure {
                        dependsOn(createDefFileTask)
                    }
                }
            }
        }
    }
}
```

为了解决此问题，新增了一个名为 `definitionFile` 的 `RegularFileProperty` 属性。现在，Gradle 会在构建过程稍后关联任务运行后惰性地验证 `definitionFile` 属性是否存在。这种新方法消除了对额外依赖项的需求。

`CInteropProcess` 任务和 `CInteropSettings` 类使用 `definitionFile` 属性而不是 `defFile` 和 `defFileProperty`：

<tabs group ="build-script">
<tab id="kotlin" title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    macosArm64("native") {
        compilations.getByName("main") {
            cinterops {
                val cinterop by creating {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
<tab id="groovy" title="Groovy" group-key="groovy">

```groovy
kotlin {
    macosArm64("native") {
        compilations.main {
            cinterops {
                cinterop {
                    definitionFile.set(project.file("def-file.def"))
                }
            }
        }
    }
}
```

</tab>
</tabs>

> `defFile` 和 `defFileProperty` 形参已被弃用。
>
{style="warning"}

### Gradle 中的可见性更改

> 此更改仅影响 Kotlin DSL 用户。
>
{style="note"}

在 Kotlin 2.0.0 中，我们修改了 Kotlin Gradle 插件，以更好地控制构建脚本并提高安全性。此前，某些原本用于特定 DSL 上下文的 Kotlin DSL 函数和属性会无意中泄露到其他 DSL 上下文中。这种泄露可能导致使用不正确的编译器选项、设置被多次应用以及其他错误配置：

```kotlin
kotlin {
    // 目标 DSL 无法访问在
    // kotlin{} 扩展 DSL 中定义的方法和属性
    jvm {
        // 编译 DSL 无法访问在
        // kotlin{} 扩展 DSL 和 Kotlin jvm{} 目标 DSL 中定义的方法和属性
        compilations.configureEach {
            // 编译任务 DSL 无法访问在
            // kotlin{} 扩展、Kotlin jvm{}
            // 目标或 Kotlin 编译 DSL 中定义的方法和属性
            compileTaskProvider.configure {
                // 例如：
                explicitApi()
                // 错误，因为它在 kotlin{} 扩展 DSL 中定义
                mavenPublication {}
                // 错误，因为它在 Kotlin jvm{} 目标 DSL 中定义
                defaultSourceSet {}
                // 错误，因为它在 Kotlin 编译 DSL 中定义
            }
        }
    }
}
```

为了解决此问题，我们添加了 `@KotlinGradlePluginDsl` 注解，防止 Kotlin Gradle 插件 DSL 函数和属性暴露到其不应可用的级别。以下级别彼此分离：

*   Kotlin extension
*   Kotlin target
*   Kotlin compilation
*   Kotlin compilation task

对于最常见的情况，我们添加了编译器警告，并提供了关于如何修复构建脚本配置不正确的建议。例如：

```kotlin
kotlin {
    jvm {
        sourceSets.getByName("jvmMain").dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.7.3")
        }
    }
}
```

在这种情况下，`sourceSets` 的警告消息是：

```none
[DEPRECATION] 'sourceSets: NamedDomainObjectContainer<KotlinSourceSet>' is deprecated.Accessing 'sourceSets' container on the Kotlin target level DSL is deprecated. Consider configuring 'sourceSets' on the Kotlin extension level.
```

我们感谢您对这项更改的反馈！请在我们的 [#gradle Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)直接向 Kotlin 开发人员分享您的评论。[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### Gradle 项目中 Kotlin 数据的新目录

> 不要将 `.kotlin` 目录提交到版本控制。
> 例如，如果您使用 Git，请将 `.kotlin` 添加到项目的 `.gitignore` 文件中。
>
{style="warning"}

在 Kotlin 1.8.20 中，Kotlin Gradle 插件更改为将其数据存储在 Gradle 项目缓存目录中：`<project-root-directory>/.gradle/kotlin`。然而，`.gradle` 目录仅供 Gradle 使用，因此它并非面向未来。

为了解决此问题，从 Kotlin 2.0.0 开始，我们将默认将 Kotlin 数据存储在您的 `<项目根目录>/.kotlin` 中。
我们将继续将部分数据存储在 `.gradle/kotlin` 目录中以实现向后兼容。

您可以配置的新 Gradle 属性是：

| Gradle 属性                                     | 描述                                                                                                       |
|-------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                 | 配置项目级别数据的存储位置。默认值：`<项目根目录>/.kotlin`                                               |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 一个布尔值，控制是否禁用向 `.gradle` 目录写入 Kotlin 数据。默认值：`false`                             |

将这些属性添加到项目中的 `gradle.properties` 文件中，使其生效。

### 仅在需要时下载 Kotlin/Native 编译器

在 Kotlin 2.0.0 之前，如果您在多平台项目的 Gradle 构建脚本中配置了 [Kotlin/Native 目标](native-target-support.md)，Gradle 始终会在[配置阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)下载 Kotlin/Native 编译器。

即使没有要在[执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)运行的用于编译 Kotlin/Native 目标代码的任务，这种情况也会发生。以这种方式下载 Kotlin/Native 编译器对于只希望检查项目中 JVM 或 JavaScript 代码的用户来说效率特别低。例如，作为 CI 流程的一部分，对他们的 Kotlin 项目执行测试或检测。

在 Kotlin 2.0.0 中，我们更改了 Kotlin Gradle 插件中的此行为，以便 Kotlin/Native 编译器在[执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)下载，并且**仅当**请求编译 Kotlin/Native 目标时。

反过来，Kotlin/Native 编译器的依赖项现在不再作为编译器的一部分下载，而是在执行阶段下载。

如果您遇到新行为的任何问题，可以通过将以下 Gradle 属性添加到 `gradle.properties` 文件中暂时切换回之前的行为：

```none
kotlin.native.toolchain.enabled=false
```

从 Kotlin 1.9.20-Beta 开始，Kotlin/Native 发行版已与 CDN 一同发布到 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)。

这使我们能够更改 Kotlin 查找和下载所需 artifact 的方式。默认情况下，它不再使用 CDN，而是使用您在项目 `repositories {}` 代码块中指定的 Maven 仓库。

您可以通过在 `gradle.properties` 文件中设置以下 Gradle 属性来暂时切换回此行为：

```none
kotlin.native.distribution.downloadFromMaven=false
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。这两个改变默认行为的 Gradle 属性都是临时的，并将在未来版本中移除。

### 弃用旧的编译器选项定义方式

在此版本中，我们继续完善您设置编译器选项的方式。它应该会解决不同方式之间的歧义，并使项目配置更直接。

从 Kotlin 2.0.0 开始，以下用于指定编译器选项的 DSL 已被弃用：

*   实现所有 Kotlin 编译任务的 `KotlinCompile` 接口中的 `kotlinOptions` DSL。请改用 `KotlinCompilationTask<CompilerOptions>`。
*   来自 `KotlinCompilation` 接口的带有 `HasCompilerOptions` 类型的 `compilerOptions` 属性。此 DSL 与其他 DSL 不一致，并且配置与 `KotlinCompilation.compileTaskProvider` 编译任务内部的 `compilerOptions` 相同的 `KotlinCommonCompilerOptions` 对象，这令人困惑。

    相反，我们建议使用 Kotlin 编译任务中的 `compilerOptions` 属性：

    ```kotlin
    kotlinCompilation.compileTaskProvider.configure {
        compilerOptions { ... }
    }
    ```

    例如：

    ```kotlin
    kotlin {
        js(IR) {
            compilations.all {
                compileTaskProvider.configure {
                    compilerOptions.freeCompilerArgs.add("-Xir-minimized-member-names=false")
                }
            }
        }
    }
    ```

*   `KotlinCompilation` 接口中的 `kotlinOptions` DSL。
*   `KotlinNativeArtifactConfig` 接口、`KotlinNativeLink` 类和 `KotlinNativeLinkArtifactTask` 类中的 `kotlinOptions` DSL。请改用 `toolOptions` DSL。
*   `KotlinJsDce` 接口中的 `dceOptions` DSL。请改用 `toolOptions` DSL。

有关如何在 Kotlin Gradle 插件中指定编译器选项的更多信息，请参见[如何定义选项](gradle-compiler-options.md#how-to-define-options)。

### 提升了最低支持的 AGP 版本

从 Kotlin 2.0.0 开始，最低支持的 Android Gradle 插件版本为 7.1.3。

### 用于尝试最新语言版本的新 Gradle 属性

在 Kotlin 2.0.0 之前，我们有以下 Gradle 属性用于试用新的 K2 编译器：`kotlin.experimental.tryK2`。
现在 K2 编译器在 Kotlin 2.0.0 中默认启用，我们决定将此属性演变为一种新形式，您可以使用它来尝试最新的语言版本：`kotlin.experimental.tryNext`。当您在 `gradle.properties` 文件中使用此属性时，Kotlin Gradle 插件会将语言版本增加到比您 Kotlin 版本默认值高一个的版本。例如，在 Kotlin 2.0.0 中，默认语言版本是 2.0，因此该属性配置语言版本为 2.1。

这个新的 Gradle 属性在[构建报告](gradle-compilation-and-caches.md#build-reports)中产生与之前使用 `kotlin.experimental.tryK2` 类似的指标。配置的语言版本包含在输出中。例如：

```none
##### 'kotlin.experimental.tryNext' 结果 #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) 任务已使用 Kotlin 2.1 编译 #####
```

要了解更多关于如何启用构建报告及其内容的信息，请参见[构建报告](gradle-compilation-and-caches.md#build-reports)。

### 构建报告的新 JSON 输出格式

在 Kotlin 1.7.0 中，我们引入了构建报告以帮助跟踪编译器性能。随着时间的推移，我们添加了更多指标，使这些报告在调查性能问题时更加详细和有帮助。此前，本地文件的唯一输出格式是 `*.txt` 格式。在 Kotlin 2.0.0 中，我们支持 JSON 输出格式，使其更容易使用其他工具进行分析。

要为您的构建报告配置 JSON 输出格式，请在您的 `gradle.properties` 文件中声明以下属性：

```none
kotlin.build.report.output=json

// 存储构建报告的目录
kotlin.build.report.json.directory=my/directory/path
```

或者，您可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
``` 

配置完成后，Gradle 将在您指定的目录中生成构建报告，名称格式为：`${project_name}-日期-时间-<序列号>.json`。

以下是一个 JSON 输出格式的构建报告示例片段，其中包含构建指标和聚合指标：

```json
"buildOperationRecord": [
    {
     "path": ":lib:compileKotlin",
      "classFqName": "org.jetbrains.kotlin.gradle.tasks.KotlinCompile_Decorated",
      "startTimeMs": 1714730820601,
      "totalTimeMs": 2724,
      "buildMetrics": {
        "buildTimes": {
          "buildTimesNs": {
            "CLEAR_OUTPUT": 713417,
            "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 19699333,
            "IR_TRANSLATION": 281000000,
            "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14088042,
            "CALCULATE_OUTPUT_SIZE": 1301500,
            "GRADLE_TASK": 2724000000,
            "COMPILER_INITIALIZATION": 263000000,
            "IR_GENERATION": 74000000,
...
          }
        }
...
 "aggregatedMetrics": {
    "buildTimes": {
      "buildTimesNs": {
        "CLEAR_OUTPUT": 782667,
        "SHRINK_AND_SAVE_CURRENT_CLASSPATH_SNAPSHOT_AFTER_COMPILATION": 22031833,
        "IR_TRANSLATION": 333000000,
        "NON_INCREMENTAL_LOAD_CURRENT_CLASSPATH_SNAPSHOT": 14890292,
        "CALCULATE_OUTPUT_SIZE": 2370750,
        "GRADLE_TASK": 3234000000,
        "COMPILER_INITIALIZATION": 292000000,
        "IR_GENERATION": 89000000,
...
      }
    }
```

### kapt 配置从超配置继承注解处理器

在 Kotlin 2.0.0 之前，如果您想在单独的 Gradle 配置中定义一组公共注解处理器，并在子项目的 kapt 特定配置中扩展此配置，kapt 会跳过注解处理，因为它找不到任何注解处理器。在 Kotlin 2.0.0 中，kapt 可以成功检测到对您的注解处理器的间接依赖项。

例如，对于使用 [Dagger](https://dagger.dev/) 的子项目，在您的 `build.gradle(.kts)` 文件中，使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此示例中，`commonAnnotationProcessors` Gradle 配置是您的注解处理的公共配置，您希望将其用于所有项目。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法将 `commonAnnotationProcessors` 添加为超配置。kapt 会发现 `commonAnnotationProcessors` Gradle 配置对 Dagger 注解处理器有依赖项。因此，kapt 会在其注解处理配置中包含 Dagger 注解处理器。

感谢 Christoph Loy 的[实现](https://github.com/JetBrains/kotlin/pull/5198)！

### Kotlin Gradle 插件不再使用弃用的 Gradle 约定

在 Kotlin 2.0.0 之前，如果您使用 Gradle 8.2 或更高版本，Kotlin Gradle 插件会错误地使用 Gradle 8.2 中已弃用的 Gradle 约定。这导致 Gradle 报告构建弃用。在 Kotlin 2.0.0 中，Kotlin Gradle 插件已更新，当您使用 Gradle 8.2 或更高版本时，不再触发这些弃用警告。

## 标准库

此版本为 Kotlin 标准库带来了进一步的稳定性，并使更多现有函数成为所有平台的通用函数：

*   [enum class values 泛型函数的稳定替代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [稳定的 AutoCloseable 接口](#stable-autocloseable-interface)
*   [AbstractMutableList.modCount 保护属性通用化](#common-protected-property-abstractmutablelist-modcount)
*   [AbstractMutableList.removeRange 保护函数通用化](#common-protected-function-abstractmutablelist-removerange)
*   [String.toCharArray(destination) 通用函数](#common-string-tochararray-destination-function)

### enum class values 泛型函数的稳定替代

在 Kotlin 2.0.0 中，`enumEntries<T>()` 函数变得[稳定](components-stability.md#stability-levels-explained)。
`enumEntries<T>()` 函数用于替代泛型 `enumValues<T>()` 函数。新函数返回给定枚举类型 `T` 的所有枚举条目列表。`enum` 类的 `entries` 属性此前已引入并稳定，以替代合成的 `values()` 函数。有关 `entries` 属性的更多信息，请参见 [Kotlin 1.8.20 中的新特性](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

> `enumValues<T>()` 函数仍受支持，但我们建议您使用 `enumEntries<T>()` 函数，因为它对性能影响较小。每次调用 `enumValues<T>()` 都会创建一个新数组，而每次调用 `enumEntries<T>()` 都会返回相同的列表，这效率更高。
>
{style="tip"}

例如：

```kotlin
enum class RGB { RED, GREEN, BLUE }

inline fun <reified T : Enum<T>> printAllValues() {
    print(enumEntries<T>().joinToString { it.name })
}

printAllValues<RGB>()
// RED, GREEN, BLUE
```

### 稳定的 AutoCloseable 接口

在 Kotlin 2.0.0 中，通用的 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)
接口变得[稳定](components-stability.md#stability-levels-explained)。它允许您轻松关闭资源，并包含一些有用的函数：

*   `use()` 扩展函数，它在选定的资源上执行给定的代码块函数，然后正确关闭资源，无论是否抛出异常。
*   `AutoCloseable()` 构造函数，它创建 `AutoCloseable` 接口的实例。

在下面的示例中，我们定义了 `XMLWriter` 接口，并假设存在一个实现了它的资源。
例如，该资源可以是一个类，它打开文件，写入 XML 内容，然后关闭它：

```kotlin
interface XMLWriter {
    fun document(encoding: String, version: String, content: XMLWriter.() -> Unit)
    fun element(name: String, content: XMLWriter.() -> Unit)
    fun attribute(name: String, value: String)
    fun text(value: String)

    fun flushAndClose()
}

fun writeBooksTo(writer: XMLWriter) {
    val autoCloseable = AutoCloseable { writer.flushAndClose() }
    autoCloseable.use {
        writer.document(encoding = "UTF-8", version = "1.0") {
            element("bookstore") {
                element("book") {
                    attribute("category", "fiction")
                    element("title") { text("Harry Potter and the Prisoner of Azkaban") }
                    element("author") { text("J. K. Rowling") }
                    element("year") { text("1999") }
                    element("price") { text("29.99") }
                }
                element("book") {
                    attribute("category", "programming")
                    element("title") { text("Kotlin in Action") }
                    element("author") { text("Dmitry Jemerov") }
                    element("author") { text("Svetlana Isakova") }
                    element("year") { text("2017") }
                    element("price") { text("25.19") }
                }
            }
        }
    }
}
```

### AbstractMutableList.modCount 保护属性通用化

在此版本中，`AbstractMutableList` 接口的 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html) 保护属性变得通用。此前，`modCount` 属性在每个平台上都可用，但对于公共目标不可用。现在，您可以创建 `AbstractMutableList` 的自定义实现，并在公共代码中访问该属性。

该属性跟踪对集合进行的结构修改的数量。这包括更改集合大小或以可能导致正在进行的迭代返回不正确结果的方式更改列表的操作。

您可以使用 `modCount` 属性在实现自定义列表时注册并检测并发修改。

### AbstractMutableList.removeRange 保护函数通用化

在此版本中，`AbstractMutableList` 接口的 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html) 保护函数变得通用。此前，它在每个平台上都可用，但对于公共目标不可用。现在，您可以创建 `AbstractMutableList` 的自定义实现，并在公共代码中覆盖该函数。

该函数按照指定区间从此列表中移除元素。通过覆盖此函数，您可以利用自定义实现并提高列表操作的性能。

### String.toCharArray(destination) 通用函数

此版本引入了一个通用的 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函数。此前，它仅在 JVM 上可用。

让我们将其与现有 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函数进行比较。它会创建一个新的 `CharArray`，其中包含指定字符串中的字符。而新的通用 `String.toCharArray(destination)` 函数则将 `String` 字符移动到现有目标 `CharArray` 中。如果您已经有一个想要填充的缓冲区，这将很有用：

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 转换字符串并存储在 destinationArray 中：
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e ! 
    }
}
```
{kotlin-runnable="true"}

## 安装 Kotlin 2.0.0

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件包含在您的 IDE 中分发。这意味着您不能再从 JetBrains Marketplace 安装插件。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改为 2.0.0。