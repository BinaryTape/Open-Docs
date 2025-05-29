[//]: # (title: Kotlin 2.0.0 有哪些新特性)

_[发布日期：2024 年 5 月 21 日](releases.md#release-details)_

Kotlin 2.0.0 版本已发布，[新的 Kotlin K2 编译器](#kotlin-k2-compiler)已稳定！此外，还有以下亮点：

*   [新的 Compose 编译器 Gradle 插件](#new-compose-compiler-gradle-plugin)
*   [使用 invokedynamic 生成 Lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 库现已稳定](#the-kotlinx-metadata-jvm-library-is-stable)
*   [在 Apple 平台上使用标志位 (signposts) 监控 Kotlin/Native 中的 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解决 Kotlin/Native 与 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Wasm 中对命名导出 (named export) 的支持](#support-for-named-export)
*   [Kotlin/Wasm 中在带有 @JsExport 的函数中支持无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
*   [多平台项目中编译器选项的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [枚举类 values 泛型函数的稳定替代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [稳定的 AutoCloseable 接口](#stable-autocloseable-interface)

Kotlin 2.0 是 JetBrains 团队的一个重要里程碑。此次发布是 KotlinConf 2024 的核心。请观看开幕主题演讲，我们在其中宣布了激动人心的更新并介绍了最近在 Kotlin 语言方面的工作：

<video src="https://www.youtube.com/v/Ar73Axsz2YA" title="KotlinConf'24 - Keynote"/>

## IDE 支持

支持 Kotlin 2.0.0 的 Kotlin 插件已捆绑在最新的 IntelliJ IDEA 和 Android Studio 中。
您无需在 IDE 中更新 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改为 Kotlin 2.0.0。

*   有关 IntelliJ IDEA 对 Kotlin K2 编译器的支持详情，请参阅 [IDE 支持](#support-in-ides)。
*   有关 IntelliJ IDEA 对 Kotlin 支持的更多详情，请参阅 [Kotlin 版本](releases.md#ide-support)。

## Kotlin K2 编译器

K2 编译器的发展历程漫长，但现在 JetBrains 团队终于准备好宣布其稳定版发布。
在 Kotlin 2.0.0 中，新的 Kotlin K2 编译器默认使用，并且对于所有目标平台：JVM、Native、Wasm 和 JS 都是[稳定](components-stability.md)的。新编译器带来了显著的性能改进，加速了新语言功能开发，统一了 Kotlin 支持的所有平台，并为多平台项目提供了更好的架构。

JetBrains 团队通过成功编译选定的用户和内部项目中的 1000 万行代码，确保了新编译器的质量。18,000 名开发者参与了稳定化过程，在总计 80,000 个项目中测试了新的 K2 编译器，并报告了他们发现的任何问题。

为了帮助 K2 编译器的迁移过程尽可能顺利，我们创建了 [K2 编译器迁移指南](k2-compiler-migration-guide.md)。
本指南解释了编译器的诸多优点，强调了您可能会遇到的任何变化，并描述了必要时如何回滚到以前的版本。

在一篇[博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)中，我们探讨了 K2 编译器在不同项目中的性能。如果您想查看 K2 编译器性能的真实数据，并查找如何从您自己的项目中收集性能基准的说明，请查阅该文章。

您还可以观看 KotlinConf 2024 上 Michail Zarečenskij（首席语言设计师）的演讲，他讨论了 Kotlin 中的功能演进和 K2 编译器：

<video src="https://www.youtube.com/v/tAGJ5zJXJ7w" title="Kotlin Language Features in 2.0 and Beyond"/>

### 当前 K2 编译器的限制

在 Gradle 项目中启用 K2 会带来某些限制，在以下情况下可能会影响使用低于 8.3 版本的 Gradle 的项目：

*   编译 `buildSrc` 中的源代码。
*   编译包含构建中的 Gradle 插件。
*   如果其他 Gradle 插件在 Gradle 版本低于 8.3 的项目中使用，则会编译它们。
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

    > 如果您为特定任务配置语言和 API 版本，这些值将覆盖由 `compilerOptions` 扩展设置的值。在这种情况下，语言和 API 版本不应高于 1.9。
    >
    {style="note"}

*   将项目中的 Gradle 版本更新到 8.3 或更高。

### 智能类型转换改进

Kotlin 编译器可以在特定情况下自动将对象强制转换为某种类型，省去了您手动显式转换的麻烦。这称为[智能类型转换 (smart casting)](typecasts.md#smart-casts)。
Kotlin K2 编译器现在在比以前更多的场景中执行智能类型转换。

在 Kotlin 2.0.0 中，我们对以下方面的智能类型转换进行了改进：

*   [局部变量和更远的作用域](#local-variables-and-further-scopes)
*   [使用逻辑 `or` 运算符进行类型检查](#type-checks-with-logical-or-operator)
*   [内联函数](#inline-functions)
*   [函数类型的属性](#properties-with-function-types)
*   [异常处理](#exception-handling)
*   [递增和递减运算符](#increment-and-decrement-operators)

#### 局部变量和更远的作用域

以前，如果变量在 `if` 条件中评估为非 `null`，则该变量将进行智能类型转换。然后，有关该变量的信息将在 `if` 块的作用域内进一步共享。

但是，如果您在 `if` 条件**外部**声明了变量，则在 `if` 条件内将没有关于该变量的信息可用，因此无法进行智能类型转换。`when` 表达式和 `while` 循环也存在这种行为。

从 Kotlin 2.0.0 开始，如果您在使用变量之前在 `if`、`when` 或 `while` 条件中声明它，则编译器收集的任何关于该变量的信息都可以在相应块中访问以进行智能类型转换。

当您想将布尔条件提取到变量中时，这很有用。然后，您可以为变量指定一个有意义的名称，这将提高代码可读性，并使您可以在代码中稍后重用该变量。例如：

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
        // 关于 isCat 的信息，因此它知道
        // animal 已智能类型转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 智能类型转换，因此调用 purr()
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

#### 使用逻辑 or 运算符进行类型检查

在 Kotlin 2.0.0 中，如果您将对象的类型检查与 `or` 运算符 (`||`) 结合使用，则会智能类型转换为它们最近的公共超类型。在此更改之前，智能类型转换始终转换为 `Any` 类型。

在这种情况下，您之后仍需手动检查对象类型，然后才能访问其任何属性或调用其函数。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 已智能类型转换为公共超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 智能类型转换为
        // Any 类型，因此调用 signal() 函数会触发
        // 未解析引用错误。signal() 函数只能在
        // 另一次类型检查后成功调用：

        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 公共超类型是联合类型 (union type) 的**近似值**。[联合类型](https://en.wikipedia.org/wiki/Union_type) 在 Kotlin 中不受支持。
>
{style="note"}

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器以不同方式处理内联函数，使其能够结合其他编译器分析来确定进行智能类型转换是否安全。

具体来说，内联函数现在被视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 Lambda 函数都在原地调用。由于 Lambda 函数在原地调用，编译器知道 Lambda 函数不能泄露其函数体内包含的任何变量的引用。

编译器利用此知识以及其他编译器分析来决定智能类型转换任何捕获的变量是否安全。例如：

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
        // processor 的引用不会被泄露。因此，进行
        // 智能类型转换是安全的。

        // 如果 processor 不为 null，则 processor 进行智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不为 null，因此不需要安全调用
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

在 Kotlin 的以前版本中，存在一个错误，这意味着函数类型的类属性无法进行智能类型转换。
我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不为 null，则
        // provider 进行智能类型转换
        if (provider != null) {
            // 编译器知道 provider 不为 null
            provider()

            // 在 1.9.20 中，编译器不知道 provider 不为
            // null，因此它会触发错误：
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

如果您重载 `invoke` 运算符，此更改也适用。例如：

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

在 Kotlin 2.0.0 中，我们对异常处理进行了改进，以便智能类型转换信息可以传递给 `catch` 和 `finally` 块。此更改使您的代码更安全，因为编译器会跟踪您的对象是否具有可空类型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 已智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 0

        // 编译器拒绝 stringInput 以前的智能类型转换信息。
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

        // 在 Kotlin 1.9.20 中，编译器表示不需要安全调用，
        // 但这是不正确的。
    }
}

//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 递增和递减运算符

在 Kotlin 2.0.0 之前，编译器不理解在使用递增或递减运算符后对象的类型可能会发生变化。由于编译器无法准确跟踪对象类型，您的代码可能导致未解析引用错误。在 Kotlin 2.0.0 中，此问题已得到修复：

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
    // 注意，unknownObject 可能同时继承自 Rho 和 Tau 接口。
    if (unknownObject is Tau) {

        // 使用 Rho 接口中重载的 inc() 运算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的类型智能类型转换为
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有
        // Sigma 类型，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，当调用 inc() 时，编译器不执行智能类型转换，
        // 因此编译器仍然认为 unknownObject 具有 Tau 类型。
        // 调用 sigma() 函数会抛出编译时错误。

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有
        // Sigma 类型，因此调用 tau() 函数会抛出编译时错误。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为
        // unknownObject 具有 Tau 类型，tau() 函数可以被调用，
        // 但它会抛出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台改进

在 Kotlin 2.0.0 中，我们对 K2 编译器中与 Kotlin 多平台相关的功能进行了以下改进：

*   [编译期间通用和平台源的分离](#separation-of-common-and-platform-sources-during-compilation)
*   [expect 和 actual 声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译期间通用和平台源的分离

以前，Kotlin 编译器的设计使其无法在编译时将通用和平台源集分开。因此，通用代码可以访问平台代码，这导致了平台之间的行为不同。此外，通用代码中的一些编译器设置和依赖项曾经会泄露到平台代码中。

在 Kotlin 2.0.0 中，我们对新 Kotlin K2 编译器的实现包括重新设计编译方案，以确保通用和平台源集之间严格分离。当您使用 [expect 和 actual 函数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions) 时，这种变化最为明显。以前，通用代码中的函数调用可能会解析到平台代码中的函数。例如：

<table>
   <tr>
       <td>通用代码</td>
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
// There is no foo() function overload
// on the JavaScript platform
```

</td>
</tr>
</table>

在此示例中，通用代码的行为因其运行平台而异：

*   在 JVM 平台上，在通用代码中调用 `foo()` 函数会导致调用平台代码中的 `foo()` 函数，显示为 `platform foo`。
*   在 JavaScript 平台上，在通用代码中调用 `foo()` 函数会导致调用通用代码中的 `foo()` 函数，显示为 `common foo`，因为平台代码中没有这样的函数可用。

在 Kotlin 2.0.0 中，通用代码无法访问平台代码，因此两个平台都成功地将 `foo()` 函数解析为通用代码中的 `foo()` 函数：`common foo`。

除了提高跨平台行为的一致性外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间行为冲突的情况。例如，当您使用 [expect 和 actual 类](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes) 时，会发生以下情况：

<table>
   <tr>
       <td>通用代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
expect class Identity {
    fun confirmIdentity(): String
}

fun common() {
    // 在 2.0.0 之前，
    // 它会触发仅 IDE 的错误
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

在此示例中，expect 类 `Identity` 没有默认构造函数，因此无法在通用代码中成功调用。
以前，错误仅由 IDE 报告，但代码仍然在 JVM 上成功编译。但是，现在编译器正确地报告了错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何时解析行为不变

我们仍在迁移到新的编译方案，因此当您调用不在同一源集中的函数时，解析行为仍然相同。您主要会在通用代码中使用多平台库中的重载函数时注意到这种差异。

假设您有一个库，其中有两个具有不同签名的 `whichFun()` 函数：

```kotlin
// 示例库

// MODULE: common
fun whichFun(x: Any) = println("common function")

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用代码中调用 `whichFun()` 函数，则会解析库中参数类型最相关的函数：

```kotlin
// 使用 JVM 目标的示例项目

// MODULE: common
fun main() {
    whichFun(2)
    // platform function
}
```

相比之下，如果您在同一源集内声明 `whichFun()` 的重载，则会解析通用代码中的函数，因为您的代码无法访问平台特定版本：

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

与多平台库类似，由于 `commonTest` 模块位于单独的源集中，它仍然可以访问平台特定代码。因此，对 `commonTest` 模块中函数的调用解析表现出与旧编译方案相同的行为。

将来，这些剩余的情况将与新的编译方案更加一致。

#### expect 和 actual 声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台项目中使用 [expect 和 actual 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它们必须具有相同的[可见性级别](visibility-modifiers.md)。
Kotlin 2.0.0 现在也支持不同的可见性级别，但**仅当** actual 声明比 expect 声明的权限_更宽松_时。例如：

```kotlin
expect internal class Attribute // 可见性为 internal
actual class Attribute          // 可见性默认为 public，
                                // 这更宽松
```

同样，如果您在 actual 声明中使用[类型别名](type-aliases.md)，则**底层类型**的可见性应与 expect 声明相同或更宽松。例如：

```kotlin
expect internal class Attribute                 // 可见性为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可见性默认为 public，
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

*   Jetpack Compose 编译器插件 2.0.0，它已[移至 Kotlin 仓库](https://android-developers.googleblog.com/2024/04/jetpack-compose-compiler-moving-to-kotlin-repository.html)。
*   自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起支持 [Kotlin 符号处理 (KSP) 插件](ksp-overview.md)。

> 如果您使用任何额外的编译器插件，请查阅其文档以了解它们是否与 K2 兼容。
>
{style="tip"}

### 实验性 Kotlin Power-assert 编译器插件

> Kotlin Power-assert 插件是[实验性功能](components-stability.md#stability-levels-explained)。
> 它随时可能更改。
>
{style="warning"}

Kotlin 2.0.0 引入了一个实验性的 Power-assert 编译器插件。此插件通过在失败消息中包含上下文信息来改进编写测试的体验，使调试更简单高效。

开发者通常需要使用复杂的断言库来编写有效的测试。Power-assert 插件通过自动生成包含断言表达式中间值的失败消息来简化此过程。这有助于开发者快速了解测试失败的原因。

当测试中的断言失败时，改进的错误消息会显示断言中所有变量和子表达式的值，从而清楚是条件的哪一部分导致了失败。这对于检查多个条件的复杂断言尤其有用。

要启用此插件，请在您的 `build.gradle(.kts)` 文件中配置它：

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

在[文档](power-assert.md)中了解更多关于 Kotlin Power-assert 插件的信息。

### 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，Kotlin K2 编译器默认启用。无需额外操作。

### 在 Kotlin Playground 中试用 Kotlin K2 编译器

Kotlin Playground 支持 2.0.0 版本。[点击查看！](https://pl.kotl.in/czuoQprce)

### IDE 支持

默认情况下，IntelliJ IDEA 和 Android Studio 仍使用旧编译器进行代码分析、代码补全、高亮显示及其他 IDE 相关功能。要在 IDE 中获得完整的 Kotlin 2.0 体验，请启用 K2 模式。

在您的 IDE 中，转到 **Settings** | **Languages & Frameworks** | **Kotlin** 并选择 **Enable K2 mode** 选项。
IDE 将使用其 K2 模式分析您的代码。

![启用 K2 模式](k2-mode.png){width=200}

启用 K2 模式后，由于编译器行为的变化，您可能会注意到 IDE 分析中的差异。在我们的[迁移指南](k2-compiler-migration-guide.md)中了解新的 K2 编译器与旧编译器的不同之处。

*   在[我们的博客](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/)中了解更多关于 K2 模式的信息。
*   我们正在积极收集关于 K2 模式的反馈，请在我们的[公开 Slack 频道](https://kotlinlang.slack.com/archives/C0B8H786P)中分享您的想法。

### 留下您对新 K2 编译器的反馈

我们感谢您提供任何反馈！

*   在我们的[问题追踪器](https://kotl.in/issue)中报告您在新 K2 编译器中遇到的任何问题。
*   [启用“发送使用统计”选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集有关 K2 使用情况的匿名数据。

## Kotlin/JVM

从 2.0.0 版本开始，编译器可以生成包含 Java 22 字节码的类。
此版本还带来了以下变化：

*   [使用 invokedynamic 生成 Lambda 函数](#generation-of-lambda-functions-using-invokedynamic)
*   [kotlinx-metadata-jvm 库现已稳定](#the-kotlinx-metadata-jvm-library-is-stable)

### 使用 invokedynamic 生成 Lambda 函数

Kotlin 2.0.0 引入了一种新的默认方法，即使用 `invokedynamic` 生成 Lambda 函数。与传统的匿名类生成相比，此更改减小了应用程序的二进制大小。

从第一个版本开始，Kotlin 就将 Lambda 生成为匿名类。然而，从 [Kotlin 1.5.0](whatsnew15.md#lambdas-via-invokedynamic) 开始，通过使用 `-Xlambdas=indy` 编译器选项，就可以使用 `invokedynamic` 生成选项。在 Kotlin 2.0.0 中，`invokedynamic` 已成为 Lambda 生成的默认方法。此方法生成更轻量的二进制文件，并使 Kotlin 与 JVM 优化保持一致，确保应用程序受益于 JVM 性能的持续和未来改进。

目前，与普通 Lambda 编译相比，它有三个限制：

*   编译为 `invokedynamic` 的 Lambda 不可序列化。
*   实验性的 [`reflect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.jvm/reflect.html) API 不支持由 `invokedynamic` 生成的 Lambda。
*   在此类 Lambda 上调用 `.toString()` 会产生可读性较差的字符串表示：

```kotlin
fun main() {
    println({})

    // 使用 Kotlin 1.9.24 和反射，返回
    // () -> kotlin.Unit

    // 使用 Kotlin 2.0.0，返回
    // FileKt$Lambda$13/0x00007f88a0004608@506e1b77
}
```

要保留生成 Lambda 函数的传统行为，您可以：

*   使用 `@JvmSerializableLambda` 注解特定的 Lambda。
*   使用编译器选项 `-Xlambdas=class` 以传统方法生成模块中的所有 Lambda。

### kotlinx-metadata-jvm 库现已稳定

在 Kotlin 2.0.0 中，`kotlinx-metadata-jvm` 库已 [稳定](components-stability.md#stability-levels-explained)。现在该库已更改为 `kotlin` 包和坐标，您可以将其作为 `kotlin-metadata-jvm`（不带“x”）找到。

以前，`kotlinx-metadata-jvm` 库有自己的发布方案和版本。现在，我们将 `kotlin-metadata-jvm` 更新作为 Kotlin 发布周期的一部分进行构建和发布，并提供与 Kotlin 标准库相同的向后兼容性保证。

`kotlin-metadata-jvm` 库提供了一个 API，用于读取和修改 Kotlin/JVM 编译器生成的二进制文件的元数据。

<!-- Learn more about the `kotlinx-metadata-jvm` library in the [documentation](kotlin-metadata-jvm.md). -->

## Kotlin/Native

此版本带来了以下变化：

*   [在 Apple 平台上使用标志位 (signposts) 监控 GC 性能](#monitoring-gc-performance-with-signposts-on-apple-platforms)
*   [解决 Objective-C 方法的冲突](#resolving-conflicts-with-objective-c-methods)
*   [Kotlin/Native 中编译器参数的日志级别已更改](#changed-log-level-for-compiler-arguments)
*   [Kotlin/Native 中显式添加的标准库和平台依赖项](#explicitly-added-standard-library-and-platform-dependencies-to-kotlin-native)
*   [Gradle 配置缓存中的任务错误](#tasks-error-in-gradle-configuration-cache)

### 在 Apple 平台上使用标志位 (signposts) 监控 GC 性能

以前，只能通过查看日志来监控 Kotlin/Native 垃圾收集器 (GC) 的性能。然而，这些日志未与 Xcode Instruments 集成，而 Xcode Instruments 是用于调查 iOS 应用性能问题的流行工具包。

从 Kotlin 2.0.0 开始，GC 使用 Instruments 中可用的标志位 (signposts) 报告暂停情况。标志位允许在您的应用程序内进行自定义日志记录，因此现在，在调试 iOS 应用性能时，您可以检查 GC 暂停是否与应用程序冻结相对应。

在[文档](native-memory-manager.md#monitor-gc-performance)中了解更多关于 GC 性能分析的信息。

### 解决 Objective-C 方法的冲突

Objective-C 方法可以有不同的名称，但参数的数量和类型相同。例如，[`locationManager:didEnterRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423560-locationmanager?language=objc) 和 [`locationManager:didExitRegion:`](https://developer.apple.com/documentation/corelocation/cllocationmanagerdelegate/1423630-locationmanager?language=objc)。
在 Kotlin 中，这些方法具有相同的签名，因此尝试使用它们会触发冲突的重载错误。

以前，您必须手动抑制冲突的重载以避免此编译错误。为了改善 Kotlin 与 Objective-C 的互操作性，Kotlin 2.0.0 引入了新的 `@ObjCSignatureOverride` 注解。

当从 Objective-C 类继承了多个具有相同参数类型但参数名称不同的函数时，此注解指示 Kotlin 编译器忽略冲突的重载。

应用此注解也比一般的错误抑制更安全。此注解只能在覆盖 Objective-C 方法的情况下使用，这些方法已受支持并经过测试，而一般的抑制可能会隐藏重要错误并导致代码默默地损坏。

### Kotlin/Native 中编译器参数的日志级别已更改

在此版本中，Kotlin/Native Gradle 任务（例如 `compile`、`link` 和 `cinterop`）中编译器参数的日志级别已从 `info` 更改为 `debug`。

`debug` 作为其默认值，日志级别与其他 Gradle 编译任务保持一致，并提供详细的调试信息，包括所有编译器参数。

### Kotlin/Native 中显式添加的标准库和平台依赖项

以前，Kotlin/Native 编译器隐式解析标准库和平台依赖项，这导致 Kotlin Gradle 插件在 Kotlin 目标之间工作方式不一致。

现在，每个 Kotlin/Native Gradle 编译都通过 `compileDependencyFiles` [编译参数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compilation-parameters)显式地在其编译时库路径中包含标准库和平台依赖项。

### Gradle 配置缓存中的任务错误

从 Kotlin 2.0.0 开始，您可能会遇到配置缓存错误，消息指示：
`invocation of Task.project at execution time is unsupported`。

此错误出现在 `NativeDistributionCommonizerTask` 和 `KotlinNativeCompile` 等任务中。

然而，这是一个假阳性错误。根本问题是存在与 Gradle 配置缓存不兼容的任务，例如 `publish*` 任务。

这种差异可能不会立即显现，因为错误消息暗示了不同的根本原因。

由于错误报告中未明确说明确切原因，[Gradle 团队已在解决此问题以修复报告](https://github.com/gradle/gradle/issues/21290)。

## Kotlin/Wasm

Kotlin 2.0.0 提高了与 JavaScript 的性能和互操作性：

*   [默认使用 Binaryen 优化生产构建](#optimized-production-builds-by-default-using-binaryen)
*   [命名导出 (named export) 支持](#support-for-named-export)
*   [在带有 `@JsExport` 的函数中支持无符号原始类型](#support-for-unsigned-primitive-types-in-functions-with-jsexport)
*   [在 Kotlin/Wasm 中生成 TypeScript 声明文件](#generation-of-typescript-declaration-files-in-kotlin-wasm)
*   [支持捕获 JavaScript 异常](#support-for-catching-javascript-exceptions)
*   [新的异常处理提案现已作为选项支持](#new-exception-handling-proposal-is-now-supported-as-an-option)
*   [`withWasm()` 函数拆分为 JS 和 WASI 变体](#the-withwasm-function-is-split-into-js-and-wasi-variants)

### 默认使用 Binaryen 优化生产构建

Kotlin/Wasm 工具链现在在生产编译期间将 [Binaryen](https://github.com/WebAssembly/binaryen) 工具应用于所有项目，而不是以前的手动设置方法。根据我们的估计，它应该可以提高项目的运行时性能并减小二进制文件大小。

> 此更改仅影响生产编译。开发编译过程保持不变。
>
{style="note"}

### 命名导出 (named export) 支持

以前，所有从 Kotlin/Wasm 导出的声明都使用默认导出导入到 JavaScript 中：

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

命名导出使得在 Kotlin 和 JavaScript 模块之间共享代码变得更容易。它们提高了可读性，并帮助您管理模块之间的依赖关系。

### 在带有 @JsExport 的函数中支持无符号原始类型

从 Kotlin 2.0.0 开始，您可以在带有 `@JsExport` 注解的外部声明和函数中使用[无符号原始类型](unsigned-integer-types.md)，这使得 Kotlin/Wasm 函数在 JavaScript 代码中可用。

这有助于减轻以前的限制，即阻止[无符号原始类型](unsigned-integer-types.md)直接在导出和外部声明中使用。现在，您可以导出带有无符号原始类型作为返回或参数类型的函数，并使用返回或消耗无符号原始类型的外部声明。

有关 Kotlin/Wasm 与 JavaScript 互操作性的更多信息，请参阅[文档](wasm-js-interop.md#use-javascript-code-in-kotlin)。

### 在 Kotlin/Wasm 中生成 TypeScript 声明文件

> 在 Kotlin/Wasm 中生成 TypeScript 声明文件是[实验性功能](components-stability.md#stability-levels-explained)。
> 它随时可能被删除或更改。
>
{style="warning"}

在 Kotlin 2.0.0 中，Kotlin/Wasm 编译器现在能够从 Kotlin 代码中的任何 `@JsExport` 声明生成 TypeScript 定义。这些定义可供 IDE 和 JavaScript 工具使用，以提供代码自动补全、帮助进行类型检查，并使在 JavaScript 中包含 Kotlin 代码变得更容易。

Kotlin/Wasm 编译器会收集任何用 `@JsExport` 标记的[顶级函数](wasm-js-interop.md#functions-with-the-jsexport-annotation)，并自动在 `.d.ts` 文件中生成 TypeScript 定义。

要生成 TypeScript 定义，请在您的 `build.gradle(.kts)` 文件中的 `wasmJs {}` 块中，添加 `generateTypeScriptDefinitions()` 函数：

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

以前，Kotlin/Wasm 代码无法捕获 JavaScript 异常，这使得处理源自 JavaScript 端的错误变得困难。

在 Kotlin 2.0.0 中，我们实现了对在 Kotlin/Wasm 中捕获 JavaScript 异常的支持。此实现允许您使用 `try-catch` 块，配合 `Throwable` 或 `JsException` 等特定类型，来正确处理这些错误。

此外，`finally` 块（无论是否抛出异常都能执行代码）也正常工作。虽然我们正在引入对捕获 JavaScript 异常的支持，但在发生 JavaScript 异常（例如调用堆栈）时，不提供额外信息。然而，[我们正在开发这些实现](https://youtrack.jetbrains.com/issue/KT-68185/WasmJs-Attach-js-exception-object-to-JsException)。

### 新的异常处理提案现已作为选项支持

在此版本中，我们引入了对新版 WebAssembly [异常处理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 的支持，此支持内置于 Kotlin/Wasm 中。

此更新确保新提案符合 Kotlin 要求，使得 Kotlin/Wasm 能够在仅支持最新版本提案的虚拟机上使用。

通过使用 `-Xwasm-use-new-exception-proposal` 编译器选项来激活新的异常处理提案，该选项默认关闭。

### `withWasm()` 函数拆分为 JS 和 WASI 变体

`withWasm()` 函数以前为层次结构模板提供 Wasm 目标，现已弃用，取而代之的是专用的 `withWasmJs()` 和 `withWasmWasi()` 函数。

现在您可以在树定义中的不同组之间分离 WASI 和 JS 目标。

## Kotlin/JS

除了其他更改外，此版本还为 Kotlin 带来了现代 JS 编译，支持 ES2015 标准的更多特性：

*   [新的编译目标](#new-compilation-target)
*   [Suspend 函数作为 ES2015 生成器](#suspend-functions-as-es2015-generators)
*   [向 main 函数传递参数](#passing-arguments-to-the-main-function)
*   [Kotlin/JS 项目的按文件编译](#per-file-compilation-for-kotlin-js-projects)
*   [改进的集合互操作性](#improved-collection-interoperability)
*   [支持 createInstance()](#support-for-createinstance)
*   [支持类型安全的普通 JavaScript 对象](#support-for-type-safe-plain-javascript-objects)
*   [支持 npm 包管理器](#support-for-npm-package-manager)
*   [编译任务的更改](#changes-to-compilation-tasks)
*   [停用旧版 Kotlin/JS JAR 工件](#discontinuing-legacy-kotlin-js-jar-artifacts)

### 新的编译目标

在 Kotlin 2.0.0 中，我们为 Kotlin/JS 添加了一个新的编译目标 `es2015`。这是一种新的方式，让您可以一次性启用 Kotlin 中支持的所有 ES2015 特性。

您可以像这样在 `build.gradle(.kts)` 文件中进行设置：

```kotlin
kotlin {
    js {
        compilerOptions {
            target.set("es2015")
        }
    }
}
```

新目标自动启用 [ES 类和模块](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 以及新支持的 [ES 生成器](#suspend-functions-as-es2015-generators)。

### Suspend 函数作为 ES2015 生成器

此版本引入了对 ES2015 生成器的[实验性](components-stability.md#stability-levels-explained)支持，用于编译 [suspend 函数](composing-suspending-functions.md)。

使用生成器而不是状态机应该会改善项目的最终捆绑包大小。例如，JetBrains 团队通过使用 ES2015 生成器，成功地将其 Space 项目的捆绑包大小减少了 20%。

[在官方文档中了解更多关于 ES2015 (ECMAScript 2015, ES6) 的信息](https://262.ecma-international.org/6.0/)。

### 向 main 函数传递参数

从 Kotlin 2.0.0 开始，您可以为 `main()` 函数指定 `args` 的来源。此功能使得使用命令行并传递参数变得更容易。

为此，请定义 `js {}` 块，并使用新的 `passAsArgumentToMainFunction()` 函数，该函数返回一个字符串数组：

```kotlin
kotlin {
    js {
        binary.executable()
        passAsArgumentToMainFunction("Deno.args")
    }
}
```

该函数在运行时执行。它接受 JavaScript 表达式并将其用作 `args: Array<String>` 参数，而不是 `main()` 函数调用。

此外，如果您使用 Node.js 运行时，您可以利用一个特殊的别名。它允许您一次性将 `process.argv` 传递给 `args` 参数，而无需每次手动添加：

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

Kotlin 2.0.0 引入了 Kotlin/JS 项目输出的新粒度选项。您现在可以设置按文件编译，为每个 Kotlin 文件生成一个 JavaScript 文件。这有助于显著优化最终捆绑包的大小并缩短程序的加载时间。

以前，只有两个输出选项。Kotlin/JS 编译器可以为整个项目生成一个单独的 `.js` 文件。然而，此文件可能太大且不方便使用。每当您想使用项目中的函数时，都必须将整个 JavaScript 文件作为依赖项包含进来。或者，您可以配置为每个项目模块编译一个单独的 `.js` 文件。这仍然是默认选项。

由于模块文件也可能太大，在 Kotlin 2.0.0 中，我们添加了更细粒度的输出，为每个 Kotlin 文件生成一个（如果文件包含导出声明，则为两个）JavaScript 文件。要启用按文件编译模式：

1.  将 [`useEsModules()`](whatsnew19.md#experimental-support-for-es2015-classes-and-modules) 函数添加到构建文件中以支持 ECMAScript 模块：

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

2.  应用 `-Xir-per-file` 编译器选项或更新 `gradle.properties` 文件：

    ```none
    # gradle.properties
    kotlin.js.ir.output.granularity=per-file // `per-module` 是默认值
    ```

### 改进的集合互操作性

从 Kotlin 2.0.0 开始，可以将签名中包含 Kotlin 集合类型的声明导出到 JavaScript（和 TypeScript）。这适用于 `Set`、`Map` 和 `List` 集合类型及其可变对应物。

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

从 Kotlin 2.0.0 开始，您可以使用 Kotlin/JS 目标中的 [`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html) 函数。以前，它只在 JVM 上可用。

此函数来自 [KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 接口，它创建指定类的新实例，对于获取 Kotlin 类的运行时引用很有用。

### 支持类型安全的普通 JavaScript 对象

> `js-plain-objects` 插件是[实验性功能](components-stability.md#stability-levels-explained)。
> 它随时可能被删除或更改。`js-plain-objects` 插件**仅**支持 K2 编译器。
>
{style="warning"}

为了使与 JavaScript API 的交互变得更容易，在 Kotlin 2.0.0 中，我们提供了一个新的插件：[`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)，您可以使用它来创建类型安全的普通 JavaScript 对象。该插件会检查您的代码中是否有带有 `@JsPlainObject` 注解的[外部接口](wasm-js-interop.md#external-interfaces)，并添加：

*   在伴生对象中添加一个内联 `invoke` 运算符函数，您可以将其用作构造函数。
*   一个 `.copy()` 函数，您可以使用它来创建对象的副本，同时调整其某些属性。

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

通过这种方法创建的任何 JavaScript 对象都更安全，因为您可以在编译时看到错误，甚至在 IDE 中看到高亮显示，而不仅仅是在运行时才发现错误。

考虑这个示例，它使用 `fetch()` 函数通过外部接口描述 JavaScript 对象的形状来与 JavaScript API 交互：

```kotlin
import kotlinx.js.JsPlainObject

@JsPlainObject
external interface FetchOptions {
    val body: String?
    val method: String
}

// Window.fetch 的包装器
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 触发编译时错误，因为“metod”未被识别
// 为方法
fetch("https://google.com", options = FetchOptions(metod = "POST"))
// 触发编译时错误，因为方法是必需的
fetch("https://google.com", options = FetchOptions(body = "SOME STRING"))
```

相比之下，如果您改用 `js()` 函数来创建 JavaScript 对象，则错误只在运行时才发现，或者根本不触发：

```kotlin
suspend fun fetch(url: String, options: FetchOptions? = null) = TODO("Add your custom behavior here")

// 未触发错误。由于“metod”未被识别，使用了错误的方法
// (GET)。
fetch("https://google.com", options = js("{ metod: 'POST' }"))

// 默认使用 GET 方法。触发运行时错误，因为
// body 不应该存在。
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

以前，Kotlin 多平台 Gradle 插件只能使用 [Yarn](https://yarnpkg.com/lang/en/) 作为包管理器来下载和安装 npm 依赖项。从 Kotlin 2.0.0 开始，您可以使用 [npm](https://www.npmjs.com/) 作为您的包管理器。使用 npm 作为包管理器意味着您在设置过程中需要管理的工具更少。

为了向后兼容性，Yarn 仍然是默认的包管理器。要使用 npm 作为您的包管理器，请在 `gradle.properties` 文件中设置以下属性：

```kotlin
kotlin.js.yarn = false
```

### 编译任务的更改

以前，`webpack` 和 `distributeResources` 编译任务都目标是相同的目录。此外，`distribution` 任务也将 `dist` 声明为其输出目录。这导致了输出重叠并产生了编译警告。

因此，从 Kotlin 2.0.0 开始，我们实施了以下更改：

*   `webpack` 任务现在目标是单独的文件夹。
*   `distributeResources` 任务已完全删除。
*   `distribution` 任务现在具有 `Copy` 类型，并目标 `dist` 文件夹。

### 停用旧版 Kotlin/JS JAR 工件

从 Kotlin 2.0.0 开始，Kotlin 分发版不再包含带有 `.jar` 扩展名的旧版 Kotlin/JS 工件。旧版工件用于不受支持的旧版 Kotlin/JS 编译器，并且对于使用 `klib` 格式的 IR 编译器来说是不必要的。

## Gradle 改进

Kotlin 2.0.0 完全兼容 Gradle 6.8.3 到 8.5。您也可以使用最新的 Gradle 版本，但如果您这样做，请记住您可能会遇到弃用警告或某些新的 Gradle 功能可能无法正常工作。

此版本带来了以下变化：

*   [多平台项目中编译器选项的新 Gradle DSL](#new-gradle-dsl-for-compiler-options-in-multiplatform-projects)
*   [新的 Compose 编译器 Gradle 插件](#new-compose-compiler-gradle-plugin)
*   [区分 JVM 和 Android 发布库的新属性](#new-attribute-to-distinguish-jvm-and-android-published-libraries)
*   [改进了 Kotlin/Native 中 CInteropProcess 的 Gradle 依赖处理](#improved-gradle-dependency-handling-for-cinteropprocess-in-kotlin-native)
*   [Gradle 中的可见性更改](#visibility-changes-in-gradle)
*   [Gradle 项目中 Kotlin 数据的新目录](#new-directory-for-kotlin-data-in-gradle-projects)
*   [Kotlin/Native 编译器按需下载](#kotlin-native-compiler-downloaded-when-needed)
*   [弃用旧的编译器选项定义方式](#deprecated-old-ways-of-defining-compiler-options)
*   [最低支持的 AGP 版本已提升](#bumped-minimum-supported-agp-version)
*   [用于尝试最新语言版本的新 Gradle 属性](#new-gradle-property-for-trying-the-latest-language-version)
*   [构建报告的新 JSON 输出格式](#new-json-output-format-for-build-reports)
*   [kapt 配置从父配置继承注解处理器](#kapt-configurations-inherit-annotation-processors-from-superconfigurations)
*   [Kotlin Gradle 插件不再使用已弃用的 Gradle 约定](#kotlin-gradle-plugin-no-longer-uses-deprecated-gradle-conventions)

### 多平台项目中编译器选项的新 Gradle DSL

> 此功能是[实验性功能](components-stability.md#stability-levels-explained)。它随时可能被删除或更改。
> 仅用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 中提供的反馈。
>
{style="warning"}

在 Kotlin 2.0.0 之前，在 Gradle 多平台项目中配置编译器选项只能在低级别进行，例如按任务、编译或源集。为了更容易地在项目中更普遍地配置编译器选项，Kotlin 2.0.0 附带了一个新的 Gradle DSL。

通过此新的 DSL，您可以在扩展级别为所有目标和共享源集（如 `commonMain`）配置编译器选项，并可以在目标级别为特定目标配置：

```kotlin
kotlin {
    compilerOptions {
        // 扩展级别的通用编译器选项，用作
        // 所有目标和共享源集的默认值
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

整个项目配置现在有三层。最高是扩展级别，然后是目标级别，最低是编译单元（通常是一个编译任务）：

![Kotlin 编译器选项级别](compiler-options-levels.svg){width=700}

较高级别的设置用作较低级别的约定（默认值）：

*   扩展编译器选项的值是目标编译器选项（包括共享源集，如 `commonMain`、`nativeMain` 和 `commonTest`）的默认值。
*   目标编译器选项的值用作编译单元（任务）编译器选项（例如，`compileKotlinJvm` 和 `compileTestKotlinJvm` 任务）的默认值。

反过来，在较低级别进行的配置会覆盖较高级别的相关设置：

*   任务级别的编译器选项会覆盖目标或扩展级别的相关配置。
*   目标级别的编译器选项会覆盖扩展级别的相关配置。

在配置项目时，请记住一些旧的设置编译器选项的方式已被[弃用](#deprecated-old-ways-of-defining-compiler-options)。

我们鼓励您在多平台项目中试用新的 DSL，并在 [YouTrack](https://kotl.in/issue) 中留下反馈，因为我们计划将此 DSL 作为配置编译器选项的推荐方法。

### 新的 Compose 编译器 Gradle 插件

Jetpack Compose 编译器（将可组合项转换为 Kotlin 代码）现已合并到 Kotlin 仓库中。这将有助于将 Compose 项目过渡到 Kotlin 2.0.0，因为 Compose 编译器将始终与 Kotlin 同时发布。这也将 Compose 编译器版本提升到 2.0.0。

要在项目中使用新的 Compose 编译器，请在 `build.gradle(.kts)` 文件中应用 `org.jetbrains.kotlin.plugin.compose` Gradle 插件，并将其版本设置为 Kotlin 2.0.0。

要了解有关此更改的更多信息并查看迁移说明，请参阅 [Compose 编译器](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-compiler.html) 文档。

### 区分 JVM 和 Android 发布库的新属性

从 Kotlin 2.0.0 开始，[`org.gradle.jvm.environment`](https://docs.gradle.org/current/userguide/variant_attributes.html#sub:jvm_default_attributes) Gradle 属性默认情况下随所有 Kotlin 变体发布。

此属性有助于区分 Kotlin 多平台库的 JVM 和 Android 变体。它表明某个库变体更适合某个 JVM 环境。目标环境可以是“android”、“standard-jvm”或“no-jvm”。

发布此属性应该会使非多平台客户端（例如仅限 Java 的项目）使用带有 JVM 和 Android 目标的 Kotlin 多平台库更加健壮。

如有必要，您可以禁用属性发布。为此，请在 `gradle.properties` 文件中添加以下 Gradle 选项：

```none
kotlin.publishJvmEnvironmentAttribute=false
```

### 改进了 Kotlin/Native 中 CInteropProcess 的 Gradle 依赖处理

在此版本中，我们增强了 `defFile` 属性的处理，以确保 Kotlin/Native 项目中更好的 Gradle 任务依赖管理。

在此更新之前，如果 `defFile` 属性被指定为尚未执行的另一个任务的输出，Gradle 构建可能会失败。解决此问题的方法是添加对此任务的依赖：

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

为了解决这个问题，现在有一个名为 `definitionFile` 的新 `RegularFileProperty` 属性。现在，Gradle 在构建过程后期相关任务运行后，会延迟验证 `definitionFile` 属性是否存在。这种新方法消除了对额外依赖项的需求。

`CInteropProcess` 任务和 `CInteropSettings` 类使用 `definitionFile` 属性代替 `defFile` 和 `defFileProperty`：

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

> `defFile` 和 `defFileProperty` 参数已弃用。
>
{style="warning"}

### Gradle 中的可见性更改

> 此更改仅影响 Kotlin DSL 用户。
>
{style="note"}

在 Kotlin 2.0.0 中，我们修改了 Kotlin Gradle 插件，以提供更好的控制和安全性，用于您的构建脚本。以前，旨在用于特定 DSL 上下文的某些 Kotlin DSL 函数和属性会无意中泄露到其他 DSL 上下文。这种泄露可能导致使用不正确的编译器选项、设置被多次应用以及其他配置错误：

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

为了解决此问题，我们添加了 `@KotlinGradlePluginDsl` 注解，防止 Kotlin Gradle 插件 DSL 函数和属性暴露到它们不应该可用的级别。以下级别彼此独立：

*   Kotlin 扩展
*   Kotlin 目标
*   Kotlin 编译
*   Kotlin 编译任务

对于最常见的情况，如果您的构建脚本配置不正确，我们添加了编译器警告，并附带如何修复它们的建议。例如：

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

我们感谢您对此更改的反馈！请在我们的 [#gradle Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)中直接向 Kotlin 开发者分享您的评论。[获取 Slack 邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)。

### Gradle 项目中 Kotlin 数据的新目录

> 请勿将 `.kotlin` 目录提交到版本控制。
> 例如，如果您使用 Git，请将 `.kotlin` 添加到项目的 `.gitignore` 文件中。
>
{style="warning"}

在 Kotlin 1.8.20 中，Kotlin Gradle 插件改为将其数据存储在 Gradle 项目缓存目录中：`<project-root-directory>/.gradle/kotlin`。然而，`.gradle` 目录仅供 Gradle 使用，因此它不具备面向未来的能力。

为了解决这个问题，从 Kotlin 2.0.0 开始，我们将默认将 Kotlin 数据存储在您的 `<project-root-directory>/.kotlin` 中。
为了向后兼容性，我们将继续在 `.gradle/kotlin` 目录中存储一些数据。

您可以配置的新 Gradle 属性是：

| Gradle 属性                                         | 描述                                                                                                           |
| :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `kotlin.project.persistent.dir`                     | 配置项目级别数据的存储位置。默认值：`<project-root-directory>/.kotlin`                                         |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 一个布尔值，控制是否禁用向 `.gradle` 目录写入 Kotlin 数据。默认值：`false`                                         |

将这些属性添加到项目的 `gradle.properties` 文件中以使其生效。

### Kotlin/Native 编译器按需下载

在 Kotlin 2.0.0 之前，如果您在多平台项目的 Gradle 构建脚本中配置了 [Kotlin/Native 目标](native-target-support.md)，Gradle 始终会在[配置阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:configuration)下载 Kotlin/Native 编译器。

即使没有要在[执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)运行的用于编译 Kotlin/Native 目标代码的任务，也会发生这种情况。以这种方式下载 Kotlin/Native 编译器对于只想检查项目中的 JVM 或 JavaScript 代码的用户来说效率特别低。例如，作为 CI 过程的一部分，对其 Kotlin 项目执行测试或检查。

在 Kotlin 2.0.0 中，我们改变了 Kotlin Gradle 插件中的这种行为，以便 Kotlin/Native 编译器在[执行阶段](https://docs.gradle.org/current/userguide/build_lifecycle.html#sec:execution)下载，并且**仅在**请求编译 Kotlin/Native 目标时才下载。

反过来，Kotlin/Native 编译器的依赖项现在也不再作为编译器的一部分下载，而是也在执行阶段下载。

如果您遇到新行为的任何问题，可以通过将以下 Gradle 属性添加到 `gradle.properties` 文件中来暂时切换回以前的行为：

```none
kotlin.native.toolchain.enabled=false
```

从 Kotlin 1.9.20-Beta 开始，Kotlin/Native 分发版与 CDN 一起发布到 [Maven Central](https://repo.maven.apache.org/maven2/org/jetbrains/kotlin/kotlin-native-prebuilt/)。

这使我们能够改变 Kotlin 查找和下载必要工件的方式。默认情况下，它现在使用您在项目 `repositories {}` 块中指定的 Maven 仓库，而不是 CDN。

您可以通过将以下 Gradle 属性设置到 `gradle.properties` 文件中来暂时切换回此行为：

```none
kotlin.native.distribution.downloadFromMaven=false
```

请将任何问题报告到我们的问题追踪器 [YouTrack](https://kotl.in/issue)。这两个改变默认行为的 Gradle 属性都是临时的，并将在未来的版本中删除。

### 弃用旧的编译器选项定义方式

在此版本中，我们继续完善如何设置编译器选项。它应该可以解决不同方式之间的歧义，并使项目配置更直接。

从 Kotlin 2.0.0 开始，以下用于指定编译器选项的 DSL 已弃用：

*   来自 `KotlinCompile` 接口的 `kotlinOptions` DSL，该接口实现了所有 Kotlin 编译任务。请改用 `KotlinCompilationTask<CompilerOptions>`。
*   来自 `KotlinCompilation` 接口的、具有 `HasCompilerOptions` 类型的 `compilerOptions` 属性。此 DSL 与其他 DSL 不一致，并配置与 `KotlinCompilation.compileTaskProvider` 编译任务中 `compilerOptions` 相同的 `KotlinCommonCompilerOptions` 对象，这令人困惑。

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

*   来自 `KotlinCompilation` 接口的 `kotlinOptions` DSL。
*   来自 `KotlinNativeArtifactConfig` 接口、`KotlinNativeLink` 类和 `KotlinNativeLinkArtifactTask` 类的 `kotlinOptions` DSL。请改用 `toolOptions` DSL。
*   来自 `KotlinJsDce` 接口的 `dceOptions` DSL。请改用 `toolOptions` DSL。

有关如何在 Kotlin Gradle 插件中指定编译器选项的更多信息，请参阅[如何定义选项](gradle-compiler-options.md#how-to-define-options)。

### 最低支持的 AGP 版本已提升

从 Kotlin 2.0.0 开始，支持的最低 Android Gradle 插件版本是 7.1.3。

### 用于尝试最新语言版本的新 Gradle 属性

在 Kotlin 2.0.0 之前，我们有以下 Gradle 属性用于试用新的 K2 编译器：`kotlin.experimental.tryK2`。
现在 K2 编译器在 Kotlin 2.0.0 中默认启用，我们决定将此属性演变为一种新的形式，您可以使用它来尝试项目中的最新语言版本：`kotlin.experimental.tryNext`。当您在 `gradle.properties` 文件中使用此属性时，Kotlin Gradle 插件会将语言版本增加到比 Kotlin 版本默认值高一个的版本。例如，在 Kotlin 2.0.0 中，默认语言版本是 2.0，因此此属性配置语言版本 2.1。

此新的 Gradle 属性在[构建报告](gradle-compilation-and-caches.md#build-reports)中生成与以前使用 `kotlin.experimental.tryK2` 类似的指标。配置的语言版本包含在输出中。例如：

```none
##### 'kotlin.experimental.tryNext' results #####
:app:compileKotlin: 2.1 language version
:lib:compileKotlin: 2.1 language version
##### 100% (2/2) tasks have been compiled with Kotlin 2.1 #####
```

要了解有关如何启用构建报告及其内容的更多信息，请参阅[构建报告](gradle-compilation-and-caches.md#build-reports)。

### 构建报告的新 JSON 输出格式

在 Kotlin 1.7.0 中，我们引入了构建报告以帮助跟踪编译器性能。随着时间的推移，我们添加了更多指标，使这些报告在调查性能问题时更加详细和有用。以前，本地文件的唯一输出格式是 `*.txt` 格式。在 Kotlin 2.0.0 中，我们支持 JSON 输出格式，以便使用其他工具进行分析变得更加容易。

要为您的构建报告配置 JSON 输出格式，请在 `gradle.properties` 文件中声明以下属性：

```none
kotlin.build.report.output=json

// 存储构建报告的目录
kotlin.build.report.json.directory=my/directory/path
```

或者，您可以运行以下命令：

```shell
./gradlew assemble -Pkotlin.build.report.output=json -Pkotlin.build.report.json.directory="my/directory/path"
```

配置后，Gradle 将在您指定的目录中生成构建报告，名称格式为：
`${project_name}-date-time-<sequence_number>.json`。

以下是包含构建指标和聚合指标的构建报告的 JSON 输出格式示例片段：

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

### kapt 配置从父配置继承注解处理器

在 Kotlin 2.0.0 之前，如果您想在单独的 Gradle 配置中定义一组通用的注解处理器，并在子项目的 kapt 特定配置中扩展此配置，kapt 会跳过注解处理，因为它找不到任何注解处理器。在 Kotlin 2.0.0 中，kapt 可以成功检测到注解处理器存在间接依赖。

例如，对于使用 [Dagger](https://dagger.dev/) 的子项目，在您的 `build.gradle(.kts)` 文件中，使用以下配置：

```kotlin
val commonAnnotationProcessors by configurations.creating
configurations.named("kapt") { extendsFrom(commonAnnotationProcessors) }

dependencies {
    implementation("com.google.dagger:dagger:2.48.1")
    commonAnnotationProcessors("com.google.dagger:dagger-compiler:2.48.1")
}
```

在此示例中，`commonAnnotationProcessors` Gradle 配置是您的通用注解处理配置，您希望将其用于所有项目。您使用 [`extendsFrom()`](https://docs.gradle.org/current/dsl/org.gradle.api.artifacts.Configuration.html#org.gradle.api.artifacts.Configuration:extendsFrom) 方法将 `commonAnnotationProcessors` 添加为父配置。kapt 看到 `commonAnnotationProcessors` Gradle 配置依赖于 Dagger 注解处理器。因此，kapt 将 Dagger 注解处理器包含在其注解处理配置中。

感谢 Christoph Loy 提供的[实现](https://github.com/JetBrains/kotlin/pull/5198)！

### Kotlin Gradle 插件不再使用已弃用的 Gradle 约定

在 Kotlin 2.0.0 之前，如果您使用 Gradle 8.2 或更高版本，Kotlin Gradle 插件错误地使用了在 Gradle 8.2 中已弃用的 Gradle 约定。这导致 Gradle 报告构建弃用警告。在 Kotlin 2.0.0 中，Kotlin Gradle 插件已更新为不再触发这些弃用警告，当您使用 Gradle 8.2 或更高版本时。

## 标准库

此版本进一步提高了 Kotlin 标准库的稳定性，并使更多现有函数成为所有平台的通用函数：

*   [枚举类 values 泛型函数的稳定替代](#stable-replacement-of-the-enum-class-values-generic-function)
*   [稳定的 AutoCloseable 接口](#stable-autocloseable-interface)
*   [通用 protected 属性 AbstractMutableList.modCount](#common-protected-property-abstractmutablelist-modcount)
*   [通用 protected 函数 AbstractMutableList.removeRange](#common-protected-function-abstractmutablelist-removerange)
*   [通用 String.toCharArray(destination) 函数](#common-string-tochararray-destination-function)

### 枚举类 values 泛型函数的稳定替代

在 Kotlin 2.0.0 中，`enumEntries<T>()` 函数已[稳定](components-stability.md#stability-levels-explained)。
`enumEntries<T>()` 函数是泛型 `enumValues<T>()` 函数的替代品。新函数返回给定枚举类型 `T` 的所有枚举条目的列表。枚举类的 `entries` 属性之前已被引入并稳定，以替换合成的 `values()` 函数。有关 entries 属性的更多信息，请参阅 [Kotlin 1.8.20 有哪些新特性](whatsnew1820.md#a-modern-and-performant-replacement-of-the-enum-class-values-function)。

> `enumValues<T>()` 函数仍然支持，但我们建议您改用 `enumEntries<T>()` 函数，因为它对性能的影响较小。每次调用 `enumValues<T>()` 时，都会创建一个新数组，而每次调用 `enumEntries<T>()` 时，都会返回相同的列表，效率要高得多。
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

在 Kotlin 2.0.0 中，通用的 [`AutoCloseable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 接口已[稳定](components-stability.md#stability-levels-explained)。它让您可以轻松关闭资源，并包含一些有用的函数：

*   `use()` 扩展函数，它在选定的资源上执行给定的块函数，然后正确关闭它，无论是否抛出异常。
*   `AutoCloseable()` 构造函数，它创建 `AutoCloseable` 接口的实例。

在下面的示例中，我们定义 `XMLWriter` 接口并假设有一个资源实现了它。
例如，此资源可以是一个打开文件、写入 XML 内容然后关闭它的类：

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

### 通用 protected 属性 AbstractMutableList.modCount

在此版本中，`AbstractMutableList` 接口的 [`modCount`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/mod-count.html) `protected` 属性变为通用。以前，`modCount` 属性在每个平台都可用，但不在通用目标中可用。现在，您可以创建 `AbstractMutableList` 的自定义实现，并在通用代码中访问该属性。

此属性跟踪对集合进行的结构修改的数量。这包括更改集合大小或以可能导致正在进行的迭代返回不正确结果的方式更改列表的操作。

您可以使用 `modCount` 属性在实现自定义列表时注册并检测并发修改。

### 通用 protected 函数 AbstractMutableList.removeRange

在此版本中，`AbstractMutableList` 接口的 [`removeRange()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-mutable-list/remove-range.html) `protected` 函数变为通用。以前，它在每个平台都可用，但不在通用目标中可用。现在，您可以创建 `AbstractMutableList` 的自定义实现，并在通用代码中覆盖该函数。

此函数从指定范围的列表中删除元素。通过覆盖此函数，您可以利用自定义实现并提高列表操作的性能。

### 通用 String.toCharArray(destination) 函数

此版本引入了一个通用的 [`String.toCharArray(destination)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函数。以前，它只在 JVM 上可用。

让我们将其与现有的 [`String.toCharArray()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-char-array.html) 函数进行比较。它创建一个新的 `CharArray`，其中包含指定字符串中的字符。然而，新的通用 `String.toCharArray(destination)` 函数将 `String` 字符移动到现有的目标 `CharArray` 中。如果您已经有一个想要填充的缓冲区，这会很有用：

```kotlin
fun main() {
    val myString = "Kotlin is awesome!"
    val destinationArray = CharArray(myString.length)

    // 转换字符串并将其存储在 destinationArray 中：
    myString.toCharArray(destinationArray)

    for (char in destinationArray) {
        print("$char ")
        // K o t l i n   i s   a w e s o m e !
    }
}
```
{kotlin-runnable="true"}

## 安装 Kotlin 2.0.0

从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始，Kotlin 插件作为捆绑插件包含在您的 IDE 中。这意味着您无法再从 JetBrains Marketplace 安装该插件。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改为 2.0.0。