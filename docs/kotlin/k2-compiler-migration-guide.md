---
title: "K2 编译器迁移指南"
---
随着 Kotlin 语言和生态系统的不断发展，Kotlin 编译器也在不断演进。第一步是引入新的 JVM 和 JS IR（中间表示）后端，它们共享逻辑，简化了不同平台上目标的 代码生成。现在，其演进的下一阶段带来了名为 K2 的新前端。

<img src="/img/k2-compiler-architecture.svg" alt="Kotlin K2 compiler architecture" width="700" style={{verticalAlign: 'middle'}}/>

随着 K2 编译器的到来，Kotlin 前端已经完全重写，并具有一种新的、更高效的架构。新编译器带来的根本性变化是使用一种统一的 数据结构，其中包含更多的语义信息。这个前端负责执行语义分析、调用解析和类型推断。

新的架构和丰富的数据结构使 K2 编译器能够提供以下优势：

* **改进的调用解析和类型推断**。编译器表现得更加一致，并且能够更好地理解您的代码。
* **更容易为新的语言特性引入语法糖**。将来，当引入新特性时，您将能够使用更简洁、可读性更强的代码。
* **更快的编译时间**。编译时间可以[显著加快](#performance-improvements)。
* **增强的 IDE 性能**。如果您在 IntelliJ IDEA 中启用 K2 模式，那么 IntelliJ IDEA 将使用 K2 编译器前端来分析您的 Kotlin 代码，从而带来稳定性和性能的提升。有关更多信息，请参见[IDE 中的支持](#support-in-ides)。

本指南：

* 解释了新的 K2 编译器的优势。
* 重点介绍了您在迁移期间可能遇到的更改，以及如何相应地调整您的代码。
* 描述了如何回滚到以前的版本。

:::note
从 2.0.0 开始，新的 K2 编译器默认启用。有关 Kotlin 2.0.0 中提供的新特性以及新的 K2 编译器的更多信息，请参见 [Kotlin 2.0.0 中的新特性](whatsnew20)。

:::

## 性能改进

为了评估 K2 编译器的性能，我们对两个开源项目进行了性能测试：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我们发现的主要性能改进：

* K2 编译器带来了高达 94% 的编译速度提升。例如，在 Anki-Android 项目中，完全构建时间从 Kotlin 1.9.23 中的 57.7 秒减少到 Kotlin 2.0.0 中的 29.7 秒。
* 使用 K2 编译器，初始化阶段的速度提高了高达 488%。例如，在 Anki-Android 项目中，增量构建的初始化阶段从 Kotlin 1.9.23 中的 0.126 秒缩减到 Kotlin 2.0.0 中的 0.022 秒。
* 与以前的编译器相比，Kotlin K2 编译器在分析阶段的速度提高了高达 376%。例如，在 Anki-Android 项目中，增量构建的分析时间从 Kotlin 1.9.23 中的 0.581 秒缩减到 Kotlin 2.0.0 中的 0.122 秒。

有关这些改进的更多详细信息，并了解更多关于我们如何分析 K2 编译器的性能的信息，请参见我们的 [博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 语言特性改进

Kotlin K2 编译器改进了与 [智能类型转换](#smart-casts) 和 [Kotlin 多平台](#kotlin-multiplatform) 相关的语言特性。

### 智能类型转换

在特定情况下，Kotlin 编译器可以自动将对象转换为类型，从而省去您自己显式指定类型的麻烦。这被称为 [智能类型转换](typecasts#smart-casts)。Kotlin K2 编译器现在比以前在更多场景中执行智能类型转换。

在 Kotlin 2.0.0 中，我们对以下领域的智能类型转换进行了改进：

* [局部变量和进一步的作用域](#local-variables-and-further-scopes)
* [使用逻辑 `or` 运算符的类型检查](#type-checks-with-the-logical-or-operator)
* [内联函数](#inline-functions)
* [具有函数类型的属性](#properties-with-function-types)
* [异常处理](#exception-handling)
* [递增和递减运算符](#increment-and-decrement-operators)

#### 局部变量和进一步的作用域

以前，如果在 `if` 条件中将变量评估为非 `null`，则该变量将被智能类型转换。然后，关于此变量的信息将在 `if` 代码块的作用域内进一步共享。

但是，如果您在 `if` 条件**之外**声明变量，则关于该变量的任何信息在 `if` 条件内都不可用，因此无法对其进行智能类型转换。`when` 表达式和 `while` 循环也观察到这种行为。

从 Kotlin 2.0.0 开始，如果您在使用变量之前在 `if`、`when` 或 `while` 条件中声明了它，那么编译器收集的关于该变量的任何信息都将在相应的代码块中可用于智能类型转换。

当您想要执行诸如将布尔条件提取到变量中的操作时，这会很有用。然后，您可以为变量指定一个有意义的名称，这将提高代码的可读性，并使以后在代码中重用该变量成为可能。例如：

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
        // animal 被智能类型转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 智能类型转换，因此调用 purr()
        // 函数会触发错误。
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // Purr purr
}
```

#### 使用逻辑 or 运算符的类型检查

在 Kotlin 2.0.0 中，如果您将对象的类型检查与 `or` 运算符 (`||`) 组合在一起，则会将其智能类型转换为其最接近的公共超类型。在此更改之前，始终会智能类型转换为 `Any` 类型。

在这种情况下，您仍然需要在之后手动检查对象类型，然后才能访问其任何属性或调用其函数。例如：

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
        // 未解析的引用错误。signal() 函数只能在
        // 另一次类型检查后才能成功调用：
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

:::note
公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。Kotlin 目前[不支持联合类型](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。

:::

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器以不同的方式处理内联函数，使其能够与其他编译器分析结合起来确定是否可以安全地进行智能类型转换。

具体来说，现在将内联函数视为具有隐式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 函数都会就地调用。由于 lambda 函数是就地调用的，因此编译器知道 lambda 函数不能泄漏对其函数体中包含的任何变量的引用。

编译器使用此知识以及其他编译器分析来决定是否可以安全地智能类型转换任何捕获的变量。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -
:::note
 Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 在 Kotlin 2.0.0 中，编译器知道 processor
        // 是一个局部变量，而 inlineAction() 是一个内联函数，因此
        // processor 的引用不会被泄漏。因此，可以安全地
        // 智能类型转换 processor。
      
        // 如果 processor 不是 null，则 processor 被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不是 null，因此不需要安全调用
            // 是必需的
            processor.process()

            // 在 Kotlin 1.9.20 中，您必须执行安全调用：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 具有函数类型的属性

在以前的 Kotlin 版本中，存在一个 bug，这意味着具有函数类型的类属性未被智能类型转换。我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。例如：

```kotlin
class Holder(val provider: (() `->` Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不是 null，
        // 它将被智能类型转换
        if (provider != null) {
            // 编译器知道 provider 不是 null
            provider()

            // 在 1.9.20 中，编译器不知道 provider 不是
            // null，因此会触发错误：
            // 引用具有可空类型 '(() `->` Unit)?'，请使用显式的 '?.invoke()' 来进行类似函数的调用
        }
    }
}
```

如果您重载了 `invoke` 运算符，则此更改也适用。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () `->` String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 在 1.9.20 中，编译器会触发错误：
            // 引用具有可空类型 'Provider?'，请使用显式的 '?.invoke()' 来进行类似函数的调用
        }
    }
}
```

#### 异常处理

在 Kotlin 2.0.0 中，我们对异常处理进行了改进，以便智能类型转换信息可以传递给 `catch` 和 `finally` 代码块。此更改使您的代码更安全，因为编译器会跟踪您的对象是否具有可空类型。例如：

```kotlin

fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不是 null
        println(stringInput.length)
        // 0

        // 编译器拒绝 stringInput 以前的智能类型转换信息。现在 stringInput 具有 String? 类型。
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

在 Kotlin 2.0.0 之前，编译器不理解对象类型在使用递增或递减运算符后会发生变化。由于编译器无法准确地跟踪对象类型，因此您的代码可能会导致未解析的引用错误。在 Kotlin 2.0.0 中，此问题已得到修复：

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

        // 使用 Rho 接口中的重载 inc() 运算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的类型被智能类型转换为
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有类型
        // Sigma，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，当调用 inc() 时，编译器不会执行智能类型转换，因此编译器仍然认为
        // unknownObject 具有 Tau 类型。调用 sigma() 函数
        // 会抛出一个编译时错误。
        
        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 具有类型
        // Sigma，因此调用 tau() 函数会抛出一个编译时
        // 错误。
        unknownObject.tau()
        // 未解析的引用 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为
        // unknownObject 具有 Tau 类型，因此可以调用 tau() 函数，
        // 但它会抛出一个 ClassCastException。
    }
}
```

### Kotlin Multiplatform

K2 编译器在以下领域的 Kotlin Multiplatform 中进行了改进：

* [编译期间通用代码和平台代码的分离](#separation-of-common-and-platform-sources-during-compilation)
* [expected 和 actual 声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译期间通用代码和平台代码的分离

以前，Kotlin 编译器的设计阻止其在编译时将通用代码和平台代码源集分开。因此，通用代码可以访问平台代码，这导致了平台之间的不同行为。此外，来自通用代码的一些编译器设置和依赖项过去会泄漏到平台代码中。

在 Kotlin 2.0.0 中，我们对新的 Kotlin K2 编译器的实现包括对编译方案的重新设计，以确保通用代码和平台代码源集之间的严格分离。当您使用 [expected 和 actual 函数](multiplatform-expect-actual#expected-and-actual-functions)时，此更改最为明显。以前，通用代码中的函数调用可能会解析为平台代码中的函数。例如：
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
// JavaScript 平台上没有 foo() 函数重载
```
</td>
</tr>
</table>

在此示例中，通用代码具有不同的行为，具体取决于它在哪个平台上运行：

* 在 JVM 平台上，调用通用代码中的 `foo()` 函数会导致调用平台代码中的 `foo()` 函数，显示 `platform foo`。
* 在 JavaScript 平台上，调用通用代码中的 `foo()` 函数会导致调用通用代码中的 `foo()` 函数，显示 `common foo`，因为平台代码中没有这样的函数可用。

在 Kotlin 2.0.0 中，通用代码无法访问平台代码，因此两个平台都成功地将 `foo()` 函数解析为通用代码中的 `foo()` 函数：`common foo`。

除了提高跨平台行为的一致性之外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间存在冲突行为的情况。例如，当您使用 [expected 和 actual 类](multiplatform-expect-actual#expected-and-actual-classes)时，会发生以下情况：
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
    // 在 2.0.0 之前，它会触发仅 IDE 错误
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : Expected class Identity has no default constructor.
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

在此示例中，expected 类 `Identity` 没有默认构造函数，因此无法在通用代码中成功调用它。以前，只有 IDE 报告错误，但代码仍然可以在 JVM 上成功编译。但是，现在编译器正确地报告了一个错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何时解析行为不变

我们仍在迁移到新的编译方案的过程中，因此当您调用不在同一源集中的函数时，解析行为仍然相同。当您在通用代码中使用来自多平台库的重载时，您会主要注意到这种差异。

假设您有一个库，它有两个具有不同签名的 `whichFun()` 函数：

```kotlin
// 示例库

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用代码中调用 `whichFun()` 函数，则将解析库中具有最相关参数类型的函数：

```kotlin
// 一个使用 JVM 目标的示例库的项目

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一源集中声明 `whichFun()` 的重载，则将解析来自通用代码的函数，因为您的代码无法访问平台特定的版本：

```kotlin
// 未使用示例库

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

与多平台库类似，由于 `commonTest` 模块位于单独的源集中，因此它仍然可以访问平台特定的代码。因此，对 `commonTest` 模块中函数的调用解析表现出与旧编译方案中相同的行为。

将来，这些剩余的情况将与新的编译方案更加一致。

#### expected 和 actual 声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果您在 Kotlin Multiplatform 项目中使用 [expected 和 actual 声明](multiplatform-expect-actual)，则它们必须具有相同的[可见性级别](visibility-modifiers)。Kotlin 2.0.0 现在还支持不同的可见性级别，但**仅当** actual 声明比 expected 声明_更_宽松时。例如：

```kotlin
expect internal class Attribute // 可见性是 internal
actual class Attribute          // 可见性默认为 public，
                                // 这更宽松
```

同样，如果您在 actual 声明中使用 [类型别名](type-aliases)，则**基础类型**的可见性应与 expected 声明相同或更宽松。例如：

```kotlin
expect internal class Attribute                 // 可见性是 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 可见性默认为 public，
                                                // 这更宽松
```

## 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，默认启用 Kotlin K2 编译器。

要升级 Kotlin 版本，请在您的 [Gradle](gradle-configure-project#apply-the-plugin) 和 [Maven](maven#configure-and-enable-the-plugin) 构建脚本中将其更改为 2.0.0 或更高版本。

为了获得 IntelliJ IDEA 或 Android Studio 的最佳体验，请考虑在 IDE 中[启用 K2 模式](#support-in-ides)。

### 将 Kotlin 构建报告与 Gradle 结合使用

Kotlin [构建报告](gradle-compilation-and-caches#build-reports)提供了有关 Kotlin 编译器任务在不同编译阶段所花费的时间的信息，以及使用的编译器和 Kotlin 版本，以及编译是否是增量的。这些构建报告对于评估您的构建性能非常有用。与 [Gradle 构建扫描](https://scans.gradle.com/) 相比，它们提供了对 Kotlin 编译管道的更多洞察力，因为它们为您提供了所有 Gradle 任务的性能概述。

#### 如何启用构建报告

要启用构建报告，请在您的 `gradle.properties` 文件中声明您想要将构建报告输出保存在哪里：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| 选项 | 描述 |
|---|---|
| `file` | 以人类可读的格式将构建报告保存到本地文件。默认情况下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 以对象的格式将构建报告保存到指定的本地文件。 |
| `build_scan` | 将构建报告保存在 [构建扫描](https://scans.gradle.com/) 的 `custom values` 部分中。请注意，Gradle Enterprise 插件限制了自定义值的数量及其长度。在大型项目中，可能会丢失一些值。 |
| `http` | 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。您可以在 [Kotlin 存储库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看发送数据的当前版本。您可以在 [此博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports) 中找到 HTTP 端点的示例 |
| `json` | 以 JSON 格式将构建报告保存到本地文件。在 `kotlin.build.report.json.directory` 中设置构建报告的位置。默认情况下，它的名称是 `${project_name}-build-<date-time>-<index>.json`。 |

有关构建报告的更多信息，请参见 [构建报告](gradle-compilation-and-caches#build-reports)。

## IDE 中的支持

默认情况下，IntelliJ IDEA 和 Android Studio 2024.1 都使用以前的编译器进行代码分析、代码完成、
突出显示和其他与 IDE 相关的功能。这是为了在集成
新的 Kotlin K2 编译器时确保性能和稳定性。

如果您想尝试使用新 Kotlin K2 编译器的相同功能，IntelliJ IDEA 和
Android Studio 2024.1 提供了支持。要启用 K2 模式：

1. 在您的 IDE 中，转到 **Settings** | **Languages & Frameworks** | **Kotlin**。
2. 选择 **Enable K2 mode** 选项。

在我们的 [博客](https://blog.jetbrains.com/idea/2024/11/k2-mode-becomes-stable/) 中了解有关 K2 模式的更多信息。

:::note
我们计划在 Kotlin 2.1.0 之后引入 [Stable](components-stability#stability-levels-explained) 语言功能。
在此之前，您可以继续使用以前的编译器进行代码分析，并且不会遇到任何因无法识别的语言功能而导致的代码突出显示
问题。

:::

重要的是要注意，无论您使用哪个编译器在 IDE 中进行代码分析，构建系统使用的编译器都是**独立的**，并且在构建脚本中单独配置。如果您[将 Kotlin 版本升级到构建脚本中的 Kotlin 2.0.0](#how-to-enable-the-kotlin-k2-compiler)，则默认情况下，新的 K2 编译器将仅由您的构建系统使用。

## 在 Kotlin Playground 中尝试 Kotlin K2 编译器

Kotlin Playground 支持 Kotlin 2.0.0 及更高版本。[立即查看！](https://pl.kotl.in/czuoQprce)

## 如何回滚到以前的编译器

要在 Kotlin 2.0.0 及更高版本中使用以前的编译器，请执行以下操作之一：

* 在您的 `build.gradle.kts` 文件中，[将您的语言版本设置为](gradle-compiler-options#example-of-setting-languageversion) `1.9`。

  或者
* 使用以下编译器选项：`-language-version 1.9`。

## 变更

随着新前端的引入，Kotlin 编译器经历了一些变化。让我们首先重点介绍
影响您代码的最重要修改，解释已更改的内容并详细说明
未来的最佳实践。如果您想了解更多信息，我们已将这些更改组织到 [主题领域](#per-subject-area) 中，以方便您进一步阅读。

本节重点介绍以下修改：

* [使用 backing field 立即初始化 open 属性](#immediate-initialization-of-open-properties-with-backing-fields)
* [弃用投影接收器上的 synthetic setter](#deprecated-synthetics-setter-on-a-projected-receiver)
* [禁止使用无法访问的泛型类型](#forbidden-use-of-inaccessible-generic-types)
* [Kotlin 属性和具有相同名称的 Java 字段的一致解析顺序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [改进 Java 原始类型数组的 null 安全性](#improved-null-safety-for-java-primitive-arrays)
* [expected 类中 abstract 成员的更严格规则](#stricter-rules-for-abstract-members-in-expected-classes)

### 使用 backing field 立即初始化 open 属性

**发生了什么变化？**

在 Kotlin 2.0 中，所有带有 backing field 的 `open` 属性都必须立即初始化；否则，您将收到
编译错误。以前，只有 `open var` 属性需要立即初始化，但现在这扩展到也带有 backing field 的 `open val` 属性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 从 Kotlin 2.0 开始出现错误，而早期版本可以成功编译
        this.a = 1 //错误：open val 必须具有初始化器
        // 始终是一个错误
        this.b = 1 // 错误：open var 必须具有初始化器
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

此更改使编译器的行为更可预测。考虑一个示例，其中 `open val` 属性被带有自定义 setter 的 `var` 属性覆盖。

如果使用自定义 setter，则延迟初始化可能会导致混淆，因为不清楚您是想要
初始化 backing field 还是调用 setter。过去，如果您想调用 setter，则旧编译器
无法保证 setter 会初始化 backing field。

**现在的最佳实践是什么？**

我们鼓励您始终初始化带有 backing field 的 open 属性，因为我们相信这种做法既更
高效，也不容易出错。

但是，如果您不想立即初始化属性，您可以：

* 使该属性 `final`。
* 使用允许延迟初始化的私有 backing 属性。

有关更多信息，请参见 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-57555)。

### 弃用投影接收器上的 synthetic setter

**发生了什么变化？**

如果您使用 Java 类的 synthetic setter 来分配与该类的投影类型冲突的类型，
则会触发错误。

假设您有一个名为 `Container` 的 Java 类，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 代码，其中 `Container` 类的实例具有投影类型，则使用 `setFoo()`
方法将始终生成错误。但是，只有从 Kotlin 2.0.0 开始，synthetic `foo` 属性才会触发错误：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 以来的错误

    // Synthetic setter `foo` 被解析为 `setFoo()` 方法
    starProjected.foo = sampleString
    // 自 Kotlin 2.0.0 以来的错误

    inProjected.setFoo(sampleString)
    // 自 Kotlin 1.0 以来的错误

    // Synthetic setter `foo` 被解析为 `setFoo()` 方法
    inProjected.foo = sampleString
    // 自 Kotlin 2.0.0 以来的错误
}
```

**现在的最佳实践是什么？**

如果您看到此更改在您的代码中引入了错误，您可能希望重新考虑如何构建类型
声明。可能是您不需要使用类型投影，或者您需要从代码中删除任何分配。

有关更多信息，请参见 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用无法访问的泛型类型

**发生了什么变化？**

由于我们的 K2 编译器的新架构，我们更改了处理无法访问的泛型类型的方式。通常，您
永远不应在代码中依赖于无法访问的泛型类型，因为这表明您的项目
构建配置中存在错误配置，阻止编译器访问编译所需的必要信息。在 Kotlin 2.0.0 中，您
无法声明或调用带有无法访问的泛型类型的函数文字，也无法将泛型类型与无法访问的泛型类型参数一起使用。此限制有助于您避免代码中稍后出现的编译器错误。

例如，假设您在一个模块中声明了一个泛型类：

```kotlin
// 模块一
class Node<V>(val value: V)
```

如果您有另一个模块（模块二），该模块配置了对模块一的依赖项，则您的代码可以访问 `Node<V>`
类，并将其用作函数类型中的类型：

```kotlin
// 模块二
fun execute(func: (Node<Int>) `->` Unit) {}
// 函数成功编译
```

但是，如果您的项目配置错误，导致您有第三个模块（模块三）仅依赖于模块
二，则 Kotlin 编译器在编译第三个模块时将无法访问**模块一**中的 `Node<V>` 类。现在，在模块三中使用 `Node<V>` 类型的任何 lambda 或匿名函数都会在 Kotlin 2.0.0 中触发错误，从而
避免了代码中稍后出现的编译器错误、崩溃和运行时异常：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为隐式
    // lambda 参数 (it) 的类型解析为 Node，该类型无法访问
    execute {}

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的
    // lambda 参数 (_) 的类型解析为 Node，该类型无法访问
    execute { _ `->` }

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的
    // 匿名函数参数 (_) 的类型解析为 Node，该类型无法访问
    execute(fun (_) {})
}
```

除了函数文字在它们包含无法访问的泛型类型的值参数时触发错误之外，当类型具有无法访问的泛型类型参数时，也会发生
错误。

例如，您在模块一中具有相同的泛型类声明。在模块二中，您声明另一个泛型类：
`Container<C>`。此外，您在模块二中声明使用带有泛型类 `Node<V>` 的 `Container<C>` 的函数作为
类型参数：
<table>
<tr>
<td>
模块一
</td>
<td>
模块二
</td>
</tr>
<tr>
<td>

```kotlin
// 模块一
class Node<V>(val value: V)
```
</td>
<td>

```kotlin
// 模块二
class Container<C>(vararg val content: C)

// 具有泛型类类型的函数，
// 这些函数还具有泛型类类型参数
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```
</td>
</tr>
</table>

如果您尝试在模块三中调用这些函数，则会在 Kotlin 2.0.0 中触发错误，因为泛型类
`Node<V>` 无法从模块三访问：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为泛型类 Node<V> 无法
    // 访问
    consume(produce())
}
```

在未来的版本中，我们将继续弃用通常使用无法访问的类型。我们已经在
Kotlin 2.0.0 中开始，通过为某些具有无法访问类型（包括非泛型类型）的场景添加警告。

例如，让我们使用与先前示例相同的模块设置，但将泛型类 `Node<V>` 转换为非泛型类
`IntNode`，所有函数都在模块二中声明：
<table>
<tr>
<td>
模块一
</td>
<td>
模块二
</td>
</tr>
<tr>
<td>

```kotlin
// 模块一
class IntNode(val value: Int)
```
</td>
<td>

```kotlin
// 模块二
// 包含 lambda
// 具有 `IntNode` 类型的参数的函数
fun execute(func: (IntNode) `->` Unit) {}

class Container<C>(vararg val content: C)

// 具有泛型类类型的函数，
// 具有 `IntNode` 作为类型参数
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```
</td>
</tr>
</table>

如果您在模块三中调用这些函数，则会触发一些警告：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发警告，因为类 IntNode 无法
    // 访问。

    execute {}
    // 参数 'it' 的类 'IntNode' 无法访问。

    execute { _ `->` }
    execute(fun (_) {})
    // 参数 '_' 的类 'IntNode' 无法访问。

    // 将在未来的 Kotlin 版本中触发警告，因为 IntNode 无法
    // 访问。
    consume(produce())
}
```

**现在的最佳实践是什么？**

如果您遇到有关无法访问的泛型类型的新警告，则很可能您的
构建系统配置存在问题。我们建议检查您的构建脚本和配置。

作为最后的手段，您可以配置模块三对模块一的直接依赖项。或者，您可以修改
您的代码，以使这些类型在同一模块中可访问。

有关更多信息，请参见 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-64474)。

### Kotlin 属性和具有相同名称的 Java 字段的一致解析顺序