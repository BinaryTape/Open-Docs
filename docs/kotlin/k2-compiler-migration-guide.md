[//]: # (title: K2 编译器迁移指南)

随着 Kotlin 语言和生态系统的不断演进，Kotlin 编译器也在不断发展。第一步是在之前引入了共享逻辑的新 JVM 与 JS IR (中间表示) 后端，这简化了针对不同平台目标的代码生成。现在，其演进的下一个阶段带来了被称为 K2 的新前端。

![Kotlin K2 编译器架构](k2-compiler-architecture.svg){width=700}

随着 K2 编译器的到来，Kotlin 前端已被完全重写，并采用了全新的、更高效的架构。新编译器带来的根本变化是使用了一个包含更多语义信息的统一数据结构。该前端负责执行语义分析、调用解析和类型推断。

新的架构和丰富的数据结构使 K2 编译器能够提供以下优势：

* **改进的调用解析和类型推断**。编译器的行为更加一致，并且能更好地理解您的代码。
* **更容易为新语言功能引入语法糖**。未来，在引入新功能时，您将能够使用更简洁、更具可读性的代码。
* **更快的编译时间**。编译速度可以得到[显著提升](#performance-improvements)。
* **增强的 IDE 性能**。IntelliJ IDEA 和 Android Studio 使用 K2 编译器来分析您的 Kotlin 代码，提高了稳定性并提供了性能改进。有关更多信息，请参阅 [IDE 支持](#support-in-ides)。

本指南：

* 说明了新 K2 编译器的优势。
* 重点介绍了迁移过程中可能遇到的变化以及如何相应地调整代码。
* 介绍了如何回退到之前的版本。

> 从 2.0.0 开始，新的 K2 编译器已默认启用。有关 Kotlin 2.0.0 中提供的新功能以及新 K2 编译器的更多信息，请参阅 [Kotlin 2.0.0 的最新变化](whatsnew20.md)。
>
{style="note"}

## 性能改进

为了评估 K2 编译器的性能，我们在两个开源项目上运行了性能测试：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我们发现的关键性能改进：

* K2 编译器带来了高达 94% 的编译速度提升。例如，在 Anki-Android 项目中，全新构建时间从 Kotlin 1.9.23 的 57.7 秒减少到 Kotlin 2.0.0 的 29.7 秒。
* K2 编译器的初始化阶段速度提升高达 488%。例如，在 Anki-Android 项目中，增量构建的初始化阶段从 Kotlin 1.9.23 的 0.126 秒缩减到 Kotlin 2.0.0 的仅 0.022 秒。
* 与之前的编译器相比，Kotlin K2 编译器在分析阶段的速度提升高达 376%。例如，在 Anki-Android 项目中，增量构建的分析时间从 Kotlin 1.9.23 的 0.581 秒锐减到 Kotlin 2.0.0 的仅 0.122 秒。

有关这些改进的更多细节，以及了解更多关于我们如何分析 K2 编译器性能的信息，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 语言功能改进

Kotlin K2 编译器改进了与[智能转换](#smart-casts)和 [Kotlin Multiplatform](#kotlin-multiplatform) 相关的语言功能。

### 智能转换

Kotlin 编译器可以在特定情况下自动将对象转换为某种类型，为您免去显式指定类型的麻烦。这被称为[智能转换](typecasts.md#smart-casts)。Kotlin K2 编译器现在在比以前更多的场景中执行智能转换。

在 Kotlin 2.0.0 中，我们在以下领域的智能转换方面进行了改进：

* [局部变量和后续作用域](#local-variables-and-further-scopes)
* [使用逻辑 `or` 运算符进行类型检查](#type-checks-with-the-logical-or-operator)
* [内联函数](#inline-functions)
* [包含函数类型的属性](#properties-with-function-types)
* [异常处理](#exception-handling)
* [自增和自减运算符](#increment-and-decrement-operators)

#### 局部变量和后续作用域

以前，如果一个变量在 `if` 条件内被评估为非 `null`，该变量将被智能转换。关于该变量的信息随后会在 `if` 块的作用域内进一步共享。

然而，如果您在 `if` 条件**之外**声明该变量，那么在 `if` 条件内将无法获得该变量的信息，因此它无法被智能转换。这种行为也出现在 `when` 表达式和 `while` 循环中。

从 Kotlin 2.0.0 开始，如果您在 `if`、`when` 或 `while` 条件中使用变量之前声明了它，那么编译器收集到的关于该变量的任何信息都将在相应的块中可用于智能转换。

当您想要将布尔条件提取到变量中等操作时，这非常有用。然后，您可以为变量赋予一个有意义的名称，这将提高代码的可读性，并使以后在代码中重用该变量成为可能。例如：

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
        // animal 已被智能转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 关于智能转换的信息，因此调用 purr()
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-local-variables" validate="false"}

#### 使用逻辑 or 运算符进行类型检查

在 Kotlin 2.0.0 中，如果您使用 `or` 运算符 (`||`) 组合对象的类型检查，系统会将它们智能转换为最接近的公共超类型。在此更改之前，智能转换总是转换为 `Any` 类型。

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
        // signalStatus 被智能转换为公共超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智能转换 
        // 为 Any 类型，因此调用 signal() 函数会触发
        // 未解析的引用错误。signal() 函数只有 
        // 在另一次类型检查后才能成功调用：
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 公共超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的一种**近似**。联合类型[目前在 Kotlin 中尚不支持](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器以不同方式处理内联函数，使其能够结合其他编译器分析来确定进行智能转换是否安全。

具体而言，内联函数现在被视为具有隐式的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 函数都会在原地调用。由于 lambda 函数是在原地调用的，编译器知道 lambda 函数不会泄露对其函数体内包含的任何变量的引用。

编译器利用这一知识结合其他编译器分析来决定对任何捕获的变量进行智能转换是否安全。例如：

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
        // 对 processor 的引用不会泄露。因此，对 processor 
        // 进行智能转换是安全的。
      
        // 如果 processor 不为 null，则 processor 被智能转换
        if (processor != null) {
            // 编译器知道 processor 不为 null，因此不需要
            // 安全调用
            processor.process()

            // 在 Kotlin 1.9.20 中，您必须执行安全调用：
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 包含函数类型的属性

在之前的 Kotlin 版本中，存在一个错误，即包含函数类型的类属性不会被智能转换。我们在 Kotlin 2.0.0 和 K2 编译器中修复了这一行为。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不为 null，
        // 它将被智能转换
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

如果您重载了 `invoke` 运算符，此更改也同样适用。例如：

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
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 异常处理

在 Kotlin 2.0.0 中，我们改进了异常处理，使得智能转换信息可以传递给 `catch` 和 `finally` 块。此更改使您的代码更安全，因为编译器会跟踪您的对象是否具有可为 null 类型。例如：

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

        // 编译器拒绝对 stringInput 之前的智能转换信息。
        // 现在 stringInput 具有 String? 类型。
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，编译器知道 stringInput 
        // 可能为 null，因此 stringInput 保持为可为 null。
        println(stringInput?.length)
        // null

        // 在 Kotlin 1.9.20 中，编译器会提示不需要
        // 安全调用，但这是不正确的。
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 自增和自减运算符

在 Kotlin 2.0.0 之前，编译器不理解对象类型在使用了自增或自减运算符后可能会发生变化。由于编译器无法准确跟踪对象类型，您的代码可能会导致未解析的引用错误。在 Kotlin 2.0.0 中，这已被修复：

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

        // 使用 Rho 接口中重载的 inc() 运算符。
        // 在 Kotlin 2.0.0 中，unknownObject 的类型被智能转换
        // 为 Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型是
        // Sigma，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，编译器在调用 inc() 时 
        // 不执行智能转换，因此编译器仍然认为 
        // unknownObject 的类型是 Tau。调用 sigma() 函数 
        // 会抛出编译时错误。
        
        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型是
        // Sigma，因此调用 tau() 函数会抛出编译时 
        // 错误。
        unknownObject.tau()
        // Unresolved reference 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为 
        // unknownObject 的类型是 Tau，因此可以调用 tau() 函数，
        // 但它会抛出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform

K2 编译器在以下领域改进了与 Kotlin Multiplatform 相关的语言功能：

* [编译期间公共源集和平台源集的分离](#separation-of-common-and-platform-sources-during-compilation)
* [预期声明和实际声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译期间公共源集和平台源集的分离

以前，Kotlin 编译器的设计使其无法在编译时保持公共源集和平台源集的分离。结果，公共代码可以访问平台代码，从而导致不同平台之间的行为不一致。此外，来自公共代码的一些编译器设置和依赖项以前会泄露到平台代码中。

在 Kotlin 2.0.0 中，我们对新 Kotlin K2 编译器的实现包括了对编译方案的重新设计，以确保公共源集和平台源集之间的严格分离。当您使用[预期声明和实际函数](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-functions)时，这种变化最为明显。以前，公共代码中的函数调用可能会解析为平台代码中的函数。例如：

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
// JavaScript 平台上没有 foo() 函数重载
```

</td>
</tr>
</table>

在此示例中，公共代码的行为取决于其运行的平台：

* 在 JVM 平台上，调用公共代码中的 `foo()` 函数会导致调用平台代码中的 `foo()` 函数，输出为 `platform foo`。
* 在 JavaScript 平台上，调用公共代码中的 `foo()` 函数会导致调用公共代码中的 `foo()` 函数，输出为 `common foo`，因为平台代码中没有这样的可用函数。

在 Kotlin 2.0.0 中，公共代码无法访问平台代码，因此两个平台都成功将 `foo()` 函数解析为公共代码中的 `foo()` 函数：`common foo`。

除了提高各平台行为的一致性外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间存在行为冲突的情况。例如，当您使用[预期声明和实际类](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html#expected-and-actual-classes)时，会发生以下情况：

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
    // 在 2.0.0 之前，它会触发仅限 IDE 的错误
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

在此示例中，预期类 `Identity` 没有默认构造函数，因此无法在公共代码中成功调用。以前，错误仅由 IDE 报告，但在 JVM 上代码仍然编译成功。然而，现在编译器会正确报告错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行为不发生变化的情况

我们仍处于向新编译方案迁移的过程中，因此当您调用不在同一源集内的函数时，解析行为仍然保持不变。您会主要在公共代码中使用来自多平台库的重载时注意到这种差异。

假设您有一个库，它有两个具有不同签名的 `whichFun()` 函数：

```kotlin
// 示例库

// 模块: common
fun whichFun(x: Any) = println("common function") 

// 模块: JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在公共代码中调用 `whichFun()` 函数，库中具有最相关参数类型的函数将被解析：

```kotlin
// 一个针对 JVM 目标使用示例库的项目

// 模块: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一源集中声明 `whichFun()` 的重载，公共代码中的函数将被解析，因为您的代码无法访问平台特定的版本：

```kotlin
// 未使用示例库

// 模块: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// 模块: JVM
fun whichFun(x: Int) = println("platform function")
```

与多平台库类似，由于 `commonTest` 模块位于单独的源集中，它仍然可以访问平台特定的代码。因此，解析对 `commonTest` 模块中函数的调用表现出与旧编译方案相同的行为。

将来，这些剩余情况将与新编译方案更加一致。

#### 预期声明和实际声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果您在 Kotlin Multiplatform 项目中使用[预期声明和实际声明](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)，它们必须具有相同的[可见性级别](visibility-modifiers.md)。Kotlin 2.0.0 现在也支持不同的可见性级别，但**仅当**实际声明比预期声明更具包容性 (more permissive) 时。例如：

```kotlin
expect internal class Attribute // 可见性为 internal
actual class Attribute          // 默认为 public 可见性，
                                // 这更具包容性
```

同样，如果您在实际声明中使用[类型别名](type-aliases.md)，则**底层类型**的可见性应与预期声明相同或更具包容性。例如：

```kotlin
expect internal class Attribute                 // 可见性为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 默认为 public 可见性，
                                                // 这更具包容性
```

## 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，Kotlin K2 编译器已默认启用。

要升级 Kotlin 版本，请在您的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven-configure-project.md) 构建脚本中将其更改为 2.0.0 或更高版本。

### 在 Gradle 中使用 Kotlin 构建报告

Kotlin [构建报告](gradle-compilation-and-caches.md#build-reports)提供了关于 Kotlin 编译器任务在不同编译阶段所花费时间的信息，以及使用了哪个编译器和 Kotlin 版本，以及编译是否为增量编译。这些构建报告对于评估构建性能非常有用。与 [Gradle 构建扫描](https://scans.gradle.com/)相比，它们提供了更多关于 Kotlin 编译流水线的洞察，因为它们为您提供了所有 Gradle 任务性能的概览。

#### 如何启用构建报告

要启用构建报告，请在您的 `gradle.properties` 文件中声明您希望保存构建报告输出的位置：

```none
kotlin.build.report.output=file
```

输出可以使用以下值及其组合：

| 选项 | 描述 |
|---|---|
| `file` | 将构建报告以人类可读的格式保存到本地文件。默认情况下，它是 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 将构建报告以对象格式保存到指定的本地文件。 |
| `build_scan` | 将构建报告保存在[构建扫描](https://scans.gradle.com/)的 `custom values` 部分。请注意，Gradle Enterprise 插件限制了自定义值的数量及其长度。在大型项目中，某些值可能会丢失。 |
| `http` | 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。您可以在 [Kotlin 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看发送数据的当前版本。您可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端点示例。 |
| `json` | 将构建报告以 JSON 格式保存到本地文件。在 `kotlin.build.report.json.directory` 中设置构建报告的位置。默认情况下，其名称为 `${project_name}-build-<date-time>-<index>.json`。 |

有关构建报告功能的更多信息，请参阅[构建报告](gradle-compilation-and-caches.md#build-reports)。

## IDE 支持

IntelliJ IDEA 和 Android Studio 均完全支持 K2 编译器，并默认使用它来改进代码分析、代码补全和高亮显示。
您不需要进行任何配置。请更新到最新版本以体验其优势。

## 在 Kotlin Playground 中尝试 Kotlin K2 编译器

Kotlin Playground 支持 Kotlin 2.0.0 及更高版本。[快来看看吧！](https://pl.kotl.in/czuoQprce)

## 如何回退到之前的编译器

要在 Kotlin 2.0.0–2.3.21 中使用之前的编译器，请执行以下任一操作：

* 在您的 `build.gradle.kts` 文件中，[将语言版本设置为](gradle-compiler-options.md#example-of-setting-languageversion) `1.9`。

  或者
* 使用以下编译器选项：`-language-version 1.9`。

从 Kotlin 2.4.0 开始，您将无法回退到之前的编译器。

## 变化

随着新前端的引入，Kotlin 编译器经历了几处变化。让我们先重点介绍影响您代码的最重要修改，解释发生了什么变化，并详细说明今后的最佳做法。如果您想了解更多信息，我们将这些变化按[主题领域](#per-subject-area)进行了组织，以便您进一步阅读。

本节重点介绍以下修改：

* [带有支持字段的 open 属性必须立即初始化](#immediate-initialization-of-open-properties-with-backing-fields)
* [弃用在投影接收者上的合成 Setter](#deprecated-synthetics-setter-on-a-projected-receiver)
* [禁止使用不可访问的泛型类型](#forbidden-use-of-inaccessible-generic-types)
* [同名的 Kotlin 属性和 Java 字段具有一致的解析顺序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
* [改进了 Java 原生数组的 null 安全性](#improved-null-safety-for-java-primitive-arrays)
* [预期类中抽象成员的更严格规则](#stricter-rules-for-abstract-members-in-expected-classes)

### 带有支持字段的 open 属性必须立即初始化

**发生了什么变化？**

在 Kotlin 2.0 中，所有带有支持字段的 `open` 属性必须立即初始化；否则，您将收到编译错误。以前，只有 `open var` 属性需要立即初始化，但现在这扩展到了带有支持字段的 `open val` 属性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 从 Kotlin 2.0 开始报错，之前可以成功编译 
        this.a = 1 // 错误：open val must have initializer
        // 始终是错误
        this.b = 1 // 错误：open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

这一变化使编译器的行为更加可预测。考虑一个示例，其中 `open val` 属性被带有自定义 Setter 的 `var` 属性重写。

如果使用了自定义 Setter，延迟初始化可能会导致混淆，因为不清楚您是要初始化支持字段还是调用 Setter。在过去，如果您想调用 Setter，旧编译器无法保证 Setter 随后会初始化支持字段。

**现在的最佳做法是什么？**

我们鼓励您始终初始化带有支持字段的 open 属性，因为我们相信这种做法既更高效也更不容易出错。

但是，如果您不想立即初始化属性，可以：

* 将属性设为 `final`。
* 使用允许延迟初始化的私有支持属性。

有关更多信息，请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-57555)。

### 弃用在投影接收者上的合成 Setter

**发生了什么变化？**

如果您使用 Java 类的合成 Setter 分配一个与该类的投影类型冲突的类型，则会触发错误。

假设您有一个名为 `Container` 的 Java 类，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 代码，其中 `Container` 类的实例具有投影类型，则使用 `setFoo()` 方法将始终生成错误。但是，仅从 Kotlin 2.0.0 开始，合成的 `foo` 属性才会触发错误：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 从 Kotlin 1.0 开始报错

    // 合成 Setter `foo` 解析为 `setFoo()` 方法
    starProjected.foo = sampleString
    // 从 Kotlin 2.0.0 开始报错

    inProjected.setFoo(sampleString)
    // 从 Kotlin 1.0 开始报错

    // 合成 Setter `foo` 解析为 `setFoo()` 方法
    inProjected.foo = sampleString
    // 从 Kotlin 2.0.0 开始报错
}
```

**现在的最佳做法是什么？**

如果您发现此更改在代码中引入了错误，您可能需要重新考虑如何构建类型声明。可能是您不需要使用类型投影，或者您需要从代码中删除任何赋值。

有关更多信息，请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用不可访问的泛型类型

**发生了什么变化？**

由于 K2 编译器的新架构，我们改变了处理不可访问泛型类型的方式。通常，您绝不应在代码中依赖不可访问的泛型类型，因为这表示项目构建配置中存在配置错误，导致编译器无法访问编译所需的信息。在 Kotlin 2.0.0 中，您不能声明或调用具有不可访问泛型类型形参的函数字面量，也不能使用具有不可访问泛型类型实参的泛型类型。此限制有助于您避免稍后在代码中出现编译器错误。

例如，假设您在一个模块中声明了一个泛型类：

```kotlin
// 模块 1
class Node<V>(val value: V)
```

如果您有另一个模块（模块 2）配置了对模块 1 的依赖，您的代码可以访问 `Node<V>` 类并将其用作函数类型中的类型：

```kotlin
// 模块 2
fun execute(func: (Node<Int>) -> Unit) {}
// 函数编译成功
```

但是，如果您的项目配置有误，使得有第三个模块（模块 3）仅依赖于模块 2，那么在编译第三个模块时，Kotlin 编译器将无法访问**模块 1** 中的 `Node<V>` 类。现在，在模块 3 中使用 `Node<V>` 类型的任何 lambda 或匿名函数在 Kotlin 2.0.0 中都会触发错误，从而防止以后代码中出现本可避免的编译器错误、崩溃和运行时异常：

```kotlin
// 模块 3
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为隐式 
    // lambda 形参 (it) 的类型解析为 Node，它是不可访问的
    execute {}

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的 
    // lambda 形参 (_) 的类型解析为 Node，它是不可访问的
    execute { _ -> }

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的
    // 匿名函数形参 (_) 的类型解析为 Node，它是不可访问的
    execute(fun (_) {})
}
```

除了当函数字面量包含不可访问泛型类型的实参时会触发错误外，当一个类型具有不可访问的泛型类型实参时也会发生错误。

例如，您在模块 1 中具有相同的泛型类声明。在模块 2 中，您声明了另一个泛型类：`Container<C>`。此外，您在模块 2 中声明了使用 `Container<C>` 且将泛型类 `Node<V>` 作为类型实参的函数：

<table>
   <tr>
       <td>模块 1</td>
       <td>模块 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 模块 1
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// 模块 2
class Container<C>(vararg val content: C)

// 具有泛型类类型的函数，
// 该类型还具有泛型类类型实参
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

如果您尝试在模块 3 中调用这些函数，由于泛型类 `Node<V>` 从模块 3 无法访问，在 Kotlin 2.0.0 中会触发错误：

```kotlin
// 模块 3
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为泛型类 Node<V> 
    // 不可访问
    consume(produce())
}
```

在未来的版本中，我们将继续弃用一般不可访问类型的使用。我们已经在 Kotlin 2.0.0 中通过为一些涉及不可访问类型（包括非泛型类型）的场景添加警告开始了这项工作。

例如，让我们使用与前面示例相同的模块设置，但将泛型类 `Node<V>` 变为非泛型类 `IntNode`，所有函数都在模块 2 中声明：

<table>
   <tr>
       <td>模块 1</td>
       <td>模块 2</td>
   </tr>
   <tr>
<td>

```kotlin
// 模块 1
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// 模块 2
// 一个包含带有 `IntNode` 类型的 lambda 
// 形参的函数
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// 具有泛型类类型的函数，
// 该类型具有 `IntNode` 作为类型实参
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

如果您在模块 3 中调用这些函数，会触发一些警告：

```kotlin
// 模块 3
fun test() {
    // 在 Kotlin 2.0.0 中触发警告，因为类 IntNode 
    // 不可访问。

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // 在未来的 Kotlin 版本中将触发警告，因为 IntNode 
    // 不可访问。
    consume(produce())
}
```

**现在的最佳做法是什么？**

如果您遇到有关不可访问泛型类型的新警告，极有可能是您的构建系统配置存在问题。我们建议检查您的构建脚本和配置。 

作为最后手段，您可以为模块 3 配置对模块 1 的直接依赖。或者，您可以修改代码以使这些类型在同一模块内可访问。

有关更多信息，请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-64474)。

### 同名的 Kotlin 属性和 Java 字段具有一致的解析顺序

**发生了什么变化？**

在 Kotlin 2.0.0 之前，如果您使用的 Java 和 Kotlin 类相互继承且包含同名的 Kotlin 属性和 Java 字段，则该重复名称的解析行为是不一致的。IntelliJ IDEA 与编译器之间也存在行为冲突。在为 Kotlin 2.0.0 开发新的解析行为时，我们的目标是给用户带来最小的影响。

例如，假设有一个 Java 类 `Base`：

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

假设还有一个 Kotlin 类 `Derived` 继承自上述 `Base` 类：

```kotlin
class Derived : Base() {
    val a = "aa"

    // 声明自定义 get() 函数
    val b get() = "bb"
}

fun main() {
    // 解析为 Derived.a
    println(a)
    // aa

    // 解析为 Base.b
    println(b)
    // b
}
```

在 Kotlin 2.0.0 之前，`a` 解析为 `Derived` Kotlin 类中的 Kotlin 属性，而 `b` 解析为 `Base` Java 类中的 Java 字段。

在 Kotlin 2.0.0 中，示例中的解析行为是一致的，确保 Kotlin 属性优于同名的 Java 字段。现在，`b` 解析为：`Derived.b`。

> 在 Kotlin 2.0.0 之前，如果您使用 IntelliJ IDEA 转到 `a` 的声明或用法，它会错误地导航到 Java 字段，而它本应导航到 Kotlin 属性。
> 
> 从 Kotlin 2.0.0 开始，IntelliJ IDEA 会正确地导航到与编译器相同的位置。
>
{style="note"}

一般规则是子类优先。前面的示例演示了这一点，因为 `Derived` 类中的 Kotlin 属性 `a` 被解析，因为 `Derived` 是 `Base` Java 类的子类。

如果继承关系反转，即 Java 类继承自 Kotlin 类，则子类中的 Java 字段优先于同名的 Kotlin 属性。

考虑这个示例：

<table>
   <tr>
       <td>Kotlin</td>
       <td>Java</td>
   </tr>
   <tr>
<td>

```kotlin
open class Base {
    val a = "aa"
}
```

</td>
<td>

```java
public class Derived extends Base {
    public String a = "a";
}
```

</td>
</tr>
</table>

现在在以下代码中：

```kotlin
fun main() {
    // 解析为 Derived.a
    println(a)
    // a
}
```

**现在的最佳做法是什么？**

如果此更改影响了您的代码，请考虑您是否真的需要使用重复的名称。如果您希望 Java 或 Kotlin 类各包含一个同名的字段或属性且相互继承，请记住子类中的字段或属性将具有优先级。

有关更多信息，请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-55017)。

### 改进了 Java 原生数组的 null 安全性

**发生了什么变化？**

从 Kotlin 2.0.0 开始，编译器能正确推断导入到 Kotlin 的 Java 原生数组的为 null 性。现在，它保留了与 Java 原生数组一起使用的 `TYPE_USE` 注解中的原生为 null 性，并在其值未根据注解使用时发出错误。

通常，当从 Kotlin 调用带有 `@Nullable` 和 `@NotNull` 注解的 Java 类型时，它们会获得适当的原生为 null 性：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

然而以前，当 Java 原生数组导入到 Kotlin 时，所有 `TYPE_USE` 注解都会丢失，导致平台为 null 性以及可能不安全的代码：

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// 没有错误，即使根据注解 `dataService.fetchData()` 可能为 `null`
// 这可能会导致 NullPointerException
dataService.fetchData()[0]
```
请注意，此问题从未影响声明本身的为 null 性注解，仅影响 `TYPE_USE` 注解。

**现在的最佳做法是什么？**

在 Kotlin 2.0.0 中，Java 原生数组的 null 安全性现在是 Kotlin 中的标准，因此如果您使用它们，请检查您的代码是否有新的警告和错误：

* 任何在没有显式为 null 性检查的情况下使用 `@Nullable` Java 原生数组，或尝试向期望非 nullable 原生数组的 Java 方法传递 `null` 的代码，现在都将无法通过编译。
* 将 `@NotNull` 原生数组用于为 null 性检查现在会发出“Unnecessary safe call”（不必要的安全调用）或“Comparison with null always false”（与 null 比较结果始终为 false）警告。

有关更多信息，请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-54521)。

### 预期类中抽象成员的更严格规则

> 预期声明和实际类处于 [Beta](components-stability.md#stability-levels-explained) 阶段。
> 它们已基本稳定，但您将来可能需要执行迁移步骤。
> 我们将尽最大努力减少您需要进行的任何进一步更改。
>
{style="warning"}

**发生了什么变化？**

由于 K2 编译器在编译期间分离了公共源集和平台源集，我们对预期类中的抽象成员实施了更严格的规则。

使用之前的编译器，预期的非抽象类可以在不[重写方法](inheritance.md#overriding-rules)的情况下继承抽象函数。由于编译器可以同时访问公共代码和平台代码，因此编译器可以查看抽象函数在实际类中是否有相应的重写和定义。

现在公共源集和平台源集是分开编译的，继承的函数必须在预期类中显式重写，以便编译器知道该函数不是抽象的。否则，编译器会报告 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 错误。

例如，假设您有一个公共源集，其中声明了一个名为 `FileSystem` 的抽象类，该类具有一个抽象函数 `listFiles()`。您在平台源集中将 `listFiles()` 函数定义为实际声明的一部分。

在您的公共代码中，如果您有一个名为 `PlatformFileSystem` 的预期非抽象类继承自 `FileSystem` 类，则 `PlatformFileSystem` 类会继承抽象函数 `listFiles()`。但是，在 Kotlin 中，非抽象类中不能有抽象函数。要使 `listFiles()` 函数变为非抽象，您必须将其声明为不带 `abstract` 关键字的重写 (override)：

<table>
   <tr>
       <td>公共代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // 在 Kotlin 2.0.0 中，需要显式重写
    expect override fun listFiles()
    // 在 Kotlin 2.0.0 之前，不需要重写
}
```

</td>
<td>

```kotlin
actual open class PlatformFileSystem : FileSystem {
    actual override fun listFiles() {}
}
```

</td>
</tr>
</table>

**现在的最佳做法是什么？**

如果您在预期的非抽象类中继承了抽象函数，请添加非抽象重写。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual) 中的相应问题。

### 按主题领域

这些主题领域列出了不太可能影响您的代码的变化，但提供了相关 YouTrack 问题的链接以供进一步阅读。问题 ID 旁边带有星号 (*) 的变化在本节开头已有说明。

#### 类型推断 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 如果显式指定类型为 Normal，属性引用编译后的函数签名中类型不正确 |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 禁止在构建器推断上下文中隐式将类型变量推断为上界 |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2：要求为数组字面量中的泛型注解调用显式指定类型实参 |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 遗漏了交集类型的子类型检查 |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 更改 Kotlin 中基于 Java 类型形参的类型的默认表示形式 |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 将前缀自增的推断类型更改为访问器的返回值类型，而不是 inc() 运算符的返回值类型 |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2：停止针对逆变参数依赖 @UnsafeVariance 的存在 |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2：禁止在原生类型中解析为归并成员 |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2：正确推断带有扩展函数形参的可调用对象的可调用引用类型 |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 使析构变量的实际类型与指定的显式类型保持一致 |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2：修复整数字面量溢出的不一致行为 |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名类型可以从类型实参的匿名函数中暴露出来 |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 带有 break 的 while 循环条件可能产生不合理的智能转换 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2：禁止在公共代码中为预期声明/实际顶层属性进行智能转换 |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 更改返回值类型的自增和加法运算符必须影响智能转换 |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2：在 K1 正常工作的一些情况下，显式指定变量类型会破坏绑定的智能转换 |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [弃用在投影接收者上使用合成 Setter](#deprecated-synthetics-setter-on-a-projected-receiver) |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600) | 禁止使用泛型类型形参重写具有原生类型形参的 Java 方法 |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663) | 禁止将可能为 null 的类型形参传递给 `in` 投影的 DNN 形参 |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066) | 弃用 typealias 构造函数中的上界违规 |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404) | 修复基于 Java 类的逆变捕获类型的不合理性 |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718) | 禁止使用具有自身上界和捕获类型的不合理代码 |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749) | 禁止泛型外部类的泛型内部类中不合理的边界冲突 |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923) | K2：为内部类的外部超类型的投影引入 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243) | 当继承自带有来自另一个超类型的额外专用实现的原生集合时，报告 MANY_IMPL_MEMBER_NOT_IMPLEMENTED |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305) | K2：禁止在扩展类型中具有变体修饰符的类型别名上进行构造函数调用和继承 |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965) | 修复由对具有自身上界的捕获类型处理不当导致的类型漏洞 |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966) | 禁止对泛型形参使用错误类型的泛型委托构造函数调用 |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712) | 当上界为捕获类型时，报告遗漏的上界冲突 |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在与基类 Java 字段的重载解析期间，选择派生类中的 Kotlin 属性](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260) | 使调用约定工作与预期的脱糖一致 |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866) | K2：当伴生对象相对于静态作用域被首选时，更改限定符解析行为 |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750) | 在解析类型且具有同名类的星号导入时报告歧义错误 |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558) | K2：围绕 COMPATIBILITY_WARNING 迁移解析 |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194) | 当依赖类包含在同一依赖项的两个不同版本中时，误报 CONFLICTING_INHERITED_MEMBERS |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592) | 具有接收者的函数类型的属性调用优先于扩展函数调用 |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666) | 限定的 this：引入/优先考虑以类型限定的 this 情况 |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166) | 确认类路径中 FQ 名称冲突时的未指定行为 |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431) | K2：禁止在导入中使用类型别名作为限定符 |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520) | K1/K2：对在较低级别具有歧义的类型引用，其解析塔工作不正确 |

#### 可见性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [将不可访问类型的使用声明为未指定行为](#forbidden-use-of-inaccessible-generic-types) |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179) | 在从内部内联函数调用私有类伴生对象成员时误报 PRIVATE_CLASS_MEMBER_FROM_INLINE |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042) | 如果等效的访问器不可见，即使重写的声明可见，也要使合成属性不可见 |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255) | 禁止从另一个模块中的派生类访问内部 Setter |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917) | 禁止从私有内联函数中暴露匿名类型 |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997) | 禁止从公共 API 内联函数进行隐式非公共 API 访问 |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310) | 智能转换不应影响受保护成员的可见性 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494) | 禁止从公共内联函数访问被忽视的私有运算符函数 |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004) | K1：重写受保护 val 的 var 的 Setter 被生成为 public |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972) | 禁止在 Kotlin/Native 的链接时通过私有成员进行重写 |

#### 注解 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 如果注解没有 EXPRESSION 目标，禁止使用该注解为语句添加注解 |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 `REPEATED_ANNOTATION` 检查期间忽略圆括号表达式 |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2：禁止在属性访问器上使用使用处 'get' 目标的注解 |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 where 子句中的类型形参上使用注解 |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 在解析伴生对象上的注解时忽略伴生作用域 |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2：在用户和编译器要求的注解之间引入了歧义 |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 枚举值上的注解不应复制到枚举值类 |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2：在包装在 `()?` 中的类型的兼容注解上报告 `WRONG_ANNOTATION_TARGET` |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2：在 catch 形参类型的注解上报告 `WRONG_ANNOTATION_TARGET` |

#### Null 安全性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [弃用在 Java 中注解为 Nullable 的数组类型的不安全用法](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034) | K2：更改安全调用和约定运算符组合的求值语义 |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850) | 超类型的顺序定义了继承函数的为 null 性形参 |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982) | 在公共签名中近似局部类型时保持为 null 性 |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998) | 禁止将可为 null 的值分配给非 null Java 字段作为不安全赋值的选择器 |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209) | 针对警告级别 Java 类型的错误级别可为 null 的实参报告遗漏的错误 |

#### Java 互操作性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止源代码中具有相同 FQ 名称的 Java 和 Kotlin 类 |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 继承自 Java 集合的类根据超类型的顺序具有不一致的行为 |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2：Java 类继承自 Kotlin 私有类时的未指定行为 |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 将 Java 可变实参方法传递给内联函数会导致运行时的数组之数组，而不仅仅是数组 |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允许在 K-J-K 层次结构中重写内部成员 |

#### 属性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止对带有支持字段的 open 属性进行延迟初始化](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 当没有提供主构造函数或类是局部类时，弃用遗漏的 MUST_BE_INITIALIZED |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 在对属性进行潜在调用时禁止递归解析 |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 如果基类来自另一个模块，弃用对来自不可见派生类的基类属性的智能转换 |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2：针对数据类属性遗漏了 OPT_IN_USAGE_ERROR |

#### 控制流 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|--------------------------------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之间类初始化块中 CFA 规则不一致 |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | K1/K2 对圆括号中没有 else 分支的 if 条件语句的不一致 |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 在具有作用域函数初始化的 try/catch 块中误报 "VAL_REASSIGNMENT" |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 将数据流信息从 try 块传递到 catch 和 finally 块 |

#### 枚举类 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 禁止在枚举项初始化期间访问枚举类的伴生对象 |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 报告枚举类中遗漏的虚拟内联方法错误 |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 报告属性/字段和枚举项之间解析的歧义 |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 当伴生属性相对于枚举项被首选时，更改限定符解析行为 |

#### 函数式 (SAM) 接口 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 弃用在没有注解的情况下需要 OptIn 的 SAM 构造函数用法 |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止从 JDK 函数接口的 SAM 构造函数的 lambda 返回具有不正确为 null 性的值 |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可 callable 引用（可调用引用）的形参类型的 SAM 转换会导致 CCE |

#### 伴生对象 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|-----------------------------------------------------------|--------------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 伴生对象成员的调用外引用具有无效签名 |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 当 V 有伴生对象时更改 (V)::foo 引用解析 |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID | 标题 |
|------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | 当实现在实际对应部分中时，K2/MPP 为公共代码中的继承者报告 [ABSTRACT_MEMBER_NOT_IMPLEMENTED] |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 限定的 this：在潜在标签冲突的情况下更改行为 |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | 修复 Java 子类中意外冲突重载时 JVM 后端中错误的函数修饰 |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 问题] 禁止在语句位置使用带有 suspend 标记的匿名函数声明 |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn：禁止在标记下进行具有默认实参（具有默认值的形参）的构造函数调用 |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 意外地允许 Unit 转换用于变量上的表达式 + 调用解析 |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 禁止将带有自适应的可调用引用提升为 KFunction |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2 破坏了 `false && ...` 和 `false || ...` |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] 弃用 `header`/`impl` 关键字 |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 默认通过 invokedynamic + LambdaMetafactory 生成所有 Kotlin lambda |

## 与 Kotlin 版本的兼容性

以下 Kotlin 版本支持新的 K2 编译器：

| Kotlin 版本 | 稳定性级别 |
|-----------------------|-----------------|
| 2.0.0–%kotlinVersion% | 稳定 |
| 1.9.20–1.9.25 | Beta |
| 1.9.0–1.9.10 | JVM 为 Beta |
| 1.7.0–1.8.22 | Alpha |

## 与 Kotlin 库的兼容性

如果您使用 Kotlin/JVM，K2 编译器可与使用任何版本的 Kotlin 编译的库配合使用。

如果您使用 Kotlin Multiplatform，K2 编译器保证可与使用 Kotlin 1.9.20 及更高版本编译的库配合使用。

## 编译器插件支持

目前，Kotlin K2 编译器支持以下 Kotlin 编译器插件：

* [`all-open`](all-open-plugin.md)
* [AtomicFU](https://github.com/Kotlin/kotlinx-atomicfu)
* [`jvm-abi-gen`](https://github.com/JetBrains/kotlin/tree/master/plugins/jvm-abi-gen)
* [`js-plain-objects`](https://github.com/JetBrains/kotlin/tree/master/plugins/js-plain-objects)
* [kapt](whatsnew1920.md#preview-kapt-compiler-plugin-with-k2)
* [Lombok](lombok.md)
* [`no-arg`](no-arg-plugin.md)
* [Parcelize](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)
* [Power-assert](power-assert.md)
* [SAM with receiver](sam-with-receiver-plugin.md)
* [Serialization](serialization.md)

此外，Kotlin K2 编译器还支持：

* [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 编译器插件及更高版本。
* 自 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 起的 [Kotlin Symbol Processing (KSP)](ksp-overview.md)。

> 如果您使用任何其他编译器插件，请检查其文档以查看它们是否与 K2 兼容。
>
{style="tip"}

### 升级您的自定义编译器插件

> 自定义编译器插件使用的是插件 API，该 API 是[实验性的](components-stability.md#stability-levels-explained)。因此，API 随时可能发生变化，我们无法保证向后兼容性。
>
{style="warning"}

根据您的自定义插件类型，升级过程有两条路线。

#### 仅限后端的编译器插件

如果您的插件仅实现 `IrGenerationExtension` 扩展点，则其升级过程与任何其他新的编译器版本相同。检查您使用的 API 是否有任何更改，并在必要时进行更改。

#### 后端和前端编译器插件

如果您的插件使用与前端相关的扩展点，则需要使用新的 K2 编译器 API 重写该插件。有关新 API 的介绍，请参阅 [FIR 插件 API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果您对升级自定义编译器插件有疑问，请加入我们的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 频道，我们将尽力为您提供帮助。
>
{style="note"}

## 分享您对新 K2 编译器的反馈

我们将不胜感激您提供的任何反馈！

* 在 [我们的问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration) 中报告您在迁移到新 K2 编译器时遇到的任何问题。
* [启用“Send usage statistics”选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html) 以允许 JetBrains 收集有关 K2 使用情况的匿名数据。