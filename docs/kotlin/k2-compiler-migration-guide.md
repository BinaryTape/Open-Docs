[//]: # (title: K2 compiler 迁移指南)

随着 Kotlin 语言和生态系统的持续演进，Kotlin 编译器也在不断发展。第一步是引入了新的 JVM 和 JS IR（中间表示）后端，它们共享逻辑，从而简化了针对不同平台目标的代码生成。现在，其演进的下一阶段带来了名为 K2 的新前端。

![Kotlin K2 compiler architecture](k2-compiler-architecture.svg){width=700}

随着 K2 编译器的到来，Kotlin 前端已完全重写，并采用了全新、更高效的架构。新编译器带来的根本性变化是使用了统一的数据结构，其中包含更多语义信息。此前端负责执行语义分析、调用解析和类型推断。

新的架构和丰富的数据结构使 K2 编译器能够提供以下优势：

*   **改进的调用解析和类型推断**。编译器行为更一致，更能理解您的代码。
*   **更容易为新语言特性引入语法糖**。未来，在引入新特性时，您将能够使用更简洁、可读性更高的代码。
*   **更快的编译时间**。编译时间可以[显著加快](#performance-improvements)。
*   **增强的 IDE 性能**。从 2025.1 版本开始，IntelliJ IDEA 使用 K2 模式分析您的 Kotlin 代码，从而提高稳定性和性能。更多信息请参阅[IDE 支持](#support-in-ides)。

本指南：

*   解释新 K2 编译器的优势。
*   强调您在迁移过程中可能遇到的变化，以及如何相应地调整代码。
*   描述如何回滚到以前的版本。

> 新 K2 编译器从 2.0.0 版本开始默认启用。有关 Kotlin 2.0.0 中提供的新特性以及新 K2 编译器的更多信息，请参阅 [Kotlin 2.0.0 中的新功能](whatsnew20.md)。
>
{style="note"}

## 性能改进

为了评估 K2 编译器的性能，我们对两个开源项目运行了性能测试：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我们发现的关键性能改进：

*   K2 编译器可将编译速度提升高达 94%。例如，在 Anki-Android 项目中，干净构建时间从 Kotlin 1.9.23 的 57.7 秒缩短到 Kotlin 2.0.0 的 29.7 秒。
*   使用 K2 编译器，初始化阶段速度提升高达 488%。例如，在 Anki-Android 项目中，增量构建的初始化阶段从 Kotlin 1.9.23 的 0.126 秒缩短到 Kotlin 2.0.0 的仅 0.022 秒。
*   与之前的编译器相比，Kotlin K2 编译器在分析阶段速度提升高达 376%。例如，在 Anki-Android 项目中，增量构建的分析时间从 Kotlin 1.9.23 的 0.581 秒大幅缩短到 Kotlin 2.0.0 的仅 0.122 秒。

有关这些改进的更多详细信息，以及了解我们如何分析 K2 编译器性能的更多信息，请参阅我们的[博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 语言特性改进

Kotlin K2 编译器改进了与[智能类型转换](#smart-casts)和 [Kotlin 多平台](#kotlin-multiplatform)相关的语言特性。

### 智能类型转换

Kotlin 编译器可以在特定情况下自动将对象转换为某种类型，省去了您手动明确指定的麻烦。这称为[智能类型转换 (smart-casting)](typecasts.md#smart-casts)。Kotlin K2 编译器现在可以在比以往更多的场景中执行智能类型转换。

在 Kotlin 2.0.0 中，我们对以下方面的智能类型转换进行了改进：

*   [局部变量和更深的作用域](#local-variables-and-further-scopes)
*   [使用逻辑或 (`or`) 运算符进行类型检查](#type-checks-with-the-logical-or-operator)
*   [内联函数](#inline-functions)
*   [函数类型的属性](#properties-with-function-types)
*   [异常处理](#exception-handling)
*   [递增和递减运算符](#increment-and-decrement-operators)

#### 局部变量和更深的作用域

以前，如果变量在 `if` 条件中被评估为非 `null`，则该变量将被智能类型转换。有关此变量的信息随后将在 `if` 块的作用域内进一步共享。

但是，如果您在 `if` 条件**之外**声明了变量，那么在 `if` 条件中将无法获得有关该变量的任何信息，因此无法进行智能类型转换。这种行为也出现在 `when` 表达式和 `while` 循环中。

从 Kotlin 2.0.0 开始，如果您在 `if`、`when` 或 `while` 条件中使用变量之前声明它，那么编译器收集到的有关该变量的任何信息都将在相应的块中可用于智能类型转换。

当您想将布尔条件提取到变量中时，这会很有用。然后，您可以为变量命名一个有意义的名称，这将提高代码可读性，并且可以在代码中后续复用该变量。例如：

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
        // animal 已被智能类型转换为 Cat 类型。
        // 因此，可以调用 purr() 函数。
        // 在 Kotlin 1.9.20 中，编译器不知道
        // 有关智能类型转换的信息，因此调用 purr()
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

#### 使用逻辑或运算符进行类型检查

在 Kotlin 2.0.0 中，如果您使用 `or` 运算符 (`||`) 组合对象的类型检查，将进行智能类型转换，转换为它们最接近的共同超类型。在此更改之前，智能类型转换总是转换为 `Any` 类型。

在这种情况下，您仍然必须在此之后手动检查对象类型，然后才能访问其任何属性或调用其函数。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换为共同超类型 Status
        signalStatus.signal()
        // 在 Kotlin 2.0.0 之前，signalStatus 被智能类型转换
        // 为 Any 类型，因此调用 signal() 函数会触发
        // 未解析引用错误。signal() 函数只能在
        // 另一次类型检查后才能成功调用：
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同超类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似值**。联合类型[目前在 Kotlin 中不受支持](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types)。
>
{style="note"}

#### 内联函数

在 Kotlin 2.0.0 中，K2 编译器对内联函数进行不同处理，允许其结合其他编译器分析，判断进行智能类型转换是否安全。

具体来说，内联函数现在被视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html) 契约。这意味着传递给内联函数的任何 lambda 函数都在原地调用。由于 lambda 函数在原地调用，编译器知道 lambda 函数不会泄漏其函数体内包含的任何变量的引用。

编译器利用此知识以及其他编译器分析来决定对任何捕获的变量进行智能类型转换是否安全。例如：

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
        // 对 processor 的引用不会被泄露。因此，可以安全地
        // 对 processor 进行智能类型转换。
      
        // 如果 processor 不为 null，则 processor 被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不为 null，因此不需要安全调用
            //
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

在以前的 Kotlin 版本中，存在一个错误，导致函数类型的类属性无法进行智能类型转换。我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // 在 Kotlin 2.0.0 中，如果 provider 不为 null，
        // 则会进行智能类型转换
        if (provider != null) {
            // 编译器知道 provider 不为 null
            provider()

            // 在 1.9.20 中，编译器不知道 provider 不为
            // null，因此它会触发一个错误：
            // 引用具有可空类型 '(() -> Unit)?'，请改用显式 '?.invoke()' 进行函数式调用
        }
    }
}
```

此更改也适用于您重载 `invoke` 运算符的情况。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // 在 1.9.20 中，编译器会触发一个错误：
            // 引用具有可空类型 'Provider?'，请改用显式 '?.invoke()' 进行函数式调用
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
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 0

        // 编译器拒绝了 stringInput 之前的智能类型转换信息。
        // 现在 stringInput 具有 String? 类型。
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 在 Kotlin 2.0.0 中，编译器知道 stringInput
        // 可能为 null，因此 stringInput 保持可空。
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

在 Kotlin 2.0.0 之前，编译器不明白使用递增或递减运算符后对象的类型可能会改变。由于编译器无法准确跟踪对象类型，您的代码可能会导致未解析引用错误。在 Kotlin 2.0.0 中，此问题已修复：

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
        // 在 Kotlin 2.0.0 中，unknownObject 的类型被智能类型转换为
        // Sigma。
        ++unknownObject

        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型为
        // Sigma，因此可以成功调用 sigma() 函数。
        unknownObject.sigma()

        // 在 Kotlin 1.9.20 中，编译器在调用 inc() 时不执行智能类型转换，
        // 因此编译器仍然认为 unknownObject 的类型为 Tau。
        // 调用 sigma() 函数会抛出编译时错误。
        
        // 在 Kotlin 2.0.0 中，编译器知道 unknownObject 的类型为
        // Sigma，因此调用 tau() 函数会抛出编译时错误。
        unknownObject.tau()
        // 未解析引用 'tau'

        // 在 Kotlin 1.9.20 中，由于编译器错误地认为
        // unknownObject 的类型为 Tau，因此可以调用 tau() 函数，
        // 但它会抛出 ClassCastException。
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin 多平台

K2 编译器在 Kotlin 多平台方面有以下改进：

*   [编译时通用和平台源的分离](#separation-of-common-and-platform-sources-during-compilation)
*   [预期 (expected) 和实际 (actual) 声明的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### 编译时通用和平台源的分离

以前，Kotlin 编译器的设计阻止其在编译时保持通用和平台源集的分离。结果是，通用代码可以访问平台代码，导致平台之间行为不一致。此外，一些来自通用代码的编译器设置和依赖项会泄漏到平台代码中。

在 Kotlin 2.0.0 中，我们在实现新 Kotlin K2 编译器时重新设计了编译方案，以确保通用和平台源集之间严格分离。当您使用[预期 (expected) 和实际 (actual) 函数](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)时，此更改最为明显。以前，您的通用代码中的函数调用可能会解析到平台代码中的函数。例如：

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
// 在 JavaScript 平台上没有 foo() 函数的重载
```

</td>
</tr>
</table>

在此示例中，通用代码根据其运行的平台而有不同的行为：

*   在 JVM 平台上，调用通用代码中的 `foo()` 函数会导致平台代码中的 `foo()` 函数被调用为 `platform foo`。
*   在 JavaScript 平台上，调用通用代码中的 `foo()` 函数会导致通用代码中的 `foo()` 函数被调用为 `common foo`，因为平台代码中没有这样的函数。

在 Kotlin 2.0.0 中，通用代码无法访问平台代码，因此两个平台都成功地将 `foo()` 函数解析为通用代码中的 `foo()` 函数：`common foo`。

除了跨平台行为的一致性提高之外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间行为冲突的情况。例如，当您使用[预期 (expected) 和实际 (actual) 类](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)时，以下情况会发生：

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
    // 在 2.0.0 之前，它会触发仅 IDE 的错误
    Identity().confirmIdentity()
    // RESOLUTION_TO_CLASSIFIER : 预期类 Identity 没有默认构造函数。
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

在此示例中，预期类 `Identity` 没有默认构造函数，因此无法在通用代码中成功调用。以前，只有 IDE 会报告错误，但代码仍然在 JVM 上成功编译。但是，现在编译器会正确地报告错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 解析行为何时不变

我们仍在向新编译方案迁移的过程中，因此当您调用不在同一源集中的函数时，解析行为仍然相同。当您在通用代码中使用多平台库中的重载时，您会主要注意到这种差异。

假设您有一个库，它有两个具有不同签名的 `whichFun()` 函数：

```kotlin
// 示例库

// 模块：common
fun whichFun(x: Any) = println("common function") 

// 模块：JVM
fun whichFun(x: Int) = println("platform function")
```

如果您在通用代码中调用 `whichFun()` 函数，库中具有最相关参数类型的函数将被解析：

```kotlin
// 一个在 JVM 目标上使用示例库的项目

// 模块：common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果您在同一源集中声明 `whichFun()` 的重载，通用代码中的函数将被解析，因为您的代码无法访问特定于平台的版本：

```kotlin
// 示例库未使用

// 模块：common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// 模块：JVM
fun whichFun(x: Int) = println("platform function")
```

类似于多平台库，由于 `commonTest` 模块位于单独的源集中，它仍然可以访问平台特定的代码。因此，对 `commonTest` 模块中函数的调用解析表现出与旧编译方案相同的行为。

将来，这些剩余的情况将与新编译方案更加一致。

#### 预期 (expected) 和实际 (actual) 声明的不同可见性级别

在 Kotlin 2.0.0 之前，如果您在 Kotlin 多平台项目中使用[预期 (expected) 和实际 (actual) 声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它们必须具有相同的[可见性级别](visibility-modifiers.md)。Kotlin 2.0.0 现在也支持不同的可见性级别，但**仅当**实际声明比预期声明_更宽松_时。例如：

```kotlin
expect internal class Attribute // 可见性为 internal
actual class Attribute          // 默认可见性为 public，
                                // 这更宽松
```

类似地，如果您在实际声明中使用[类型别名](type-aliases.md)，**基础类型**的可见性应与预期声明相同或更宽松。例如：

```kotlin
expect internal class Attribute                 // 可见性为 internal
internal actual typealias Attribute = Expanded

class Expanded                                  // 默认可见性为 public，
                                                // 这更宽松
```

## 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，Kotlin K2 编译器默认启用。

要升级 Kotlin 版本，请在您的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven.md#configure-and-enable-the-plugin) 构建脚本中将其更改为 2.0.0 或更高版本。

为了在 IntelliJ IDEA 或 Android Studio 中获得最佳体验，请考虑在您的 IDE 中[启用 K2 模式](#support-in-ides)。

### 将 Kotlin 构建报告与 Gradle 结合使用

Kotlin [构建报告](gradle-compilation-and-caches.md#build-reports)提供有关 Kotlin 编译器任务在不同编译阶段所花费时间的信息，以及使用了哪个编译器和 Kotlin 版本，以及编译是否是增量的。这些构建报告对于评估您的构建性能很有用。它们比 [Gradle 构建扫描](https://scans.gradle.com/)更能深入了解 Kotlin 编译管道，因为它们提供了所有 Gradle 任务性能的概览。

#### 如何启用构建报告

要启用构建报告，请在您的 `gradle.properties` 文件中声明您希望将构建报告输出保存到何处：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| 选项 | 描述 |
|---|---|
| `file` | 将构建报告以人类可读的格式保存到本地文件。默认情况下，它位于 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 将构建报告以对象格式保存到指定的本地文件。 |
| `build_scan` | 将构建报告保存到[构建扫描](https://scans.gradle.com/)的 `custom values` 部分。请注意，Gradle Enterprise 插件限制了自定义值的数量和长度。在大型项目中，一些值可能会丢失。 |
| `http` | 使用 HTTP(S) 发布构建报告。POST 方法以 JSON 格式发送指标。您可以在 [Kotlin 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt)中查看发送数据的当前版本。您可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端点示例 |
| `json` | 将构建报告以 JSON 格式保存到本地文件。在 `kotlin.build.report.json.directory` 中设置构建报告的位置。默认情况下，文件名为 `${project_name}-build-<date-time>-<index>.json`。 |

有关构建报告的更多功能，请参阅[构建报告](gradle-compilation-and-caches.md#build-reports)。

## 在 IDE 中的支持

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 编译器来改进代码分析、代码补全和高亮显示。

从 IntelliJ IDEA 2025.1 开始，K2 模式[默认启用](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

在 Android Studio 中，从 2024.1 版本开始，您可以按照以下步骤启用 K2 模式：

1.  转到 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  选择 **Enable K2 mode** 选项。

### 以前的 IDE 行为 {initial-collapse-state="collapsed" collapsible="true"}

如果您想恢复到以前的 IDE 行为，您可以禁用 K2 模式：

1.  转到 **Settings** | **Languages & Frameworks** | **Kotlin**。
2.  取消选择 **Enable K2 mode** 选项。

> 我们计划在 Kotlin 2.1.0 之后引入[稳定 (Stable)](components-stability.md#stability-levels-explained)语言特性。在此之前，您可以继续使用以前的 IDE 功能进行代码分析，您不会遇到由于无法识别的语言特性导致的代码高亮问题。
>
{style="note"}

## 在 Kotlin Playground 中尝试 Kotlin K2 编译器

Kotlin Playground 支持 Kotlin 2.0.0 及更高版本。[立即体验！](https://pl.kotl.in/czuoQprce)

## 如何回滚到以前的编译器

要在 Kotlin 2.0.0 及更高版本中使用以前的编译器，您可以：

*   在您的 `build.gradle.kts` 文件中，将[语言版本](gradle-compiler-options.md#example-of-setting-languageversion)设置为 `1.9`。

    或
*   使用以下编译器选项：`-language-version 1.9`。

## 变更

随着新前端的引入，Kotlin 编译器经历了一些变化。让我们首先强调影响您代码的最重要的修改，解释发生了什么变化并详细说明未来的最佳实践。如果您想了解更多信息，我们已将这些更改组织成[主题领域](#per-subject-area)，以便您进一步阅读。

本节重点介绍以下修改：

*   [立即初始化带有支持字段的开放 (open) 属性](#immediate-initialization-of-open-properties-with-backing-fields)
*   [投影接收器上的已弃用合成 setter](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [禁止使用不可访问的泛型类型](#forbidden-use-of-inaccessible-generic-types)
*   [Kotlin 属性与同名 Java 字段的一致解析顺序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [改进 Java 基本类型数组的空安全](#improved-null-safety-for-java-primitive-arrays)
*   [预期 (expected) 类中抽象成员的更严格规则](#stricter-rules-for-abstract-members-in-expected-classes)

### 立即初始化带有支持字段的开放 (open) 属性

**有什么变化？**

在 Kotlin 2.0 中，所有带有支持字段的 `open` 属性都必须立即初始化；否则，您将收到编译错误。以前，只有 `open var` 属性需要立即初始化，但现在这也扩展到带有支持字段的 `open val` 属性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // 从 Kotlin 2.0 开始报错，之前可以成功编译 
        this.a = 1 //Error: open val must have initializer
        // 始终报错
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

此更改使编译器的行为更具可预测性。考虑一个示例，其中 `open val` 属性被带有自定义 setter 的 `var` 属性覆盖。

如果使用了自定义 setter，延迟初始化可能导致混淆，因为不清楚您是想初始化支持字段还是调用 setter。在过去，如果您想调用 setter，旧编译器无法保证 setter 会随后初始化支持字段。

**现在的最佳实践是什么？**

我们鼓励您始终初始化带有支持字段的开放属性，因为我们认为这种做法更高效且不易出错。

但是，如果您不想立即初始化属性，您可以：

*   将属性设为 `final`。
*   使用允许延迟初始化的私有支持属性。

更多信息请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-57555)。

### 投影接收器上的已弃用合成 setter

**有什么变化？**

如果您使用 Java 类的合成 setter 分配与类的投影类型冲突的类型，会触发错误。

假设您有一个名为 `Container` 的 Java 类，其中包含 `getFoo()` 和 `setFoo()` 方法：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果您有以下 Kotlin 代码，其中 `Container` 类的实例具有投影类型，使用 `setFoo()` 方法将始终生成错误。但只有从 Kotlin 2.0.0 开始，合成属性 `foo` 才会触发错误：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // 从 Kotlin 1.0 开始报错

    // 合成 setter `foo` 解析为 `setFoo()` 方法
    starProjected.foo = sampleString
    // 从 Kotlin 2.0.0 开始报错

    inProjected.setFoo(sampleString)
    // 从 Kotlin 1.0 开始报错

    // 合成 setter `foo` 解析为 `setFoo()` 方法
    inProjected.foo = sampleString
    // 从 Kotlin 2.0.0 开始报错
}
```

**现在的最佳实践是什么？**

如果您发现此更改导致代码中出现错误，您可能需要重新考虑如何组织类型声明。可能是您不需要使用类型投影，或者您需要从代码中删除任何赋值操作。

更多信息请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-54309)。

### 禁止使用不可访问的泛型类型

**有什么变化？**

由于我们 K2 编译器的新架构，我们改变了处理不可访问泛型类型的方式。通常，您不应在代码中依赖不可访问的泛型类型，因为这表明您的项目构建配置存在错误，阻止编译器访问编译所需的必要信息。在 Kotlin 2.0.0 中，您不能声明或调用带有不可访问泛型类型的函数字面量，也不能使用带有不可访问泛型类型参数的泛型类型。此限制有助于您避免稍后代码中出现的编译器错误。

例如，假设您在一个模块中声明了一个泛型类：

```kotlin
// 模块一
class Node<V>(val value: V)
```

如果您有另一个模块（模块二），并且它配置了对模块一的依赖，您的代码可以访问 `Node<V>` 类并将其用作函数类型中的类型：

```kotlin
// 模块二
fun execute(func: (Node<Int>) -> Unit) {}
// 函数编译成功
```

但是，如果您的项目配置错误，导致您有一个第三个模块（模块三）仅依赖于模块二，Kotlin 编译器在编译第三个模块时将无法访问**模块一**中的 `Node<V>` 类。现在，模块三中任何使用 `Node<V>` 类型的 lambda 或匿名函数都会在 Kotlin 2.0.0 中触发错误，从而防止了代码中稍后可能出现的编译器错误、崩溃和运行时异常：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为隐式
    // lambda 参数 (it) 的类型解析为 Node，而 Node 不可访问
    execute {}

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的
    // lambda 参数 (_) 的类型解析为 Node，而 Node 不可访问
    execute { _ -> }

    // 在 Kotlin 2.0.0 中触发错误，因为未使用的
    // 匿名函数参数 (_) 的类型解析为 Node，而 Node 不可访问
    execute(fun (_) {})
}
```

除了函数字面量在包含不可访问泛型类型的值参数时触发错误之外，当类型具有不可访问的泛型类型参数时也会发生错误。

例如，您在模块一中拥有相同的泛型类声明。在模块二中，您声明了另一个泛型类：`Container<C>`。此外，您在模块二中声明了使用 `Container<C>` 并以泛型类 `Node<V>` 作为类型参数的函数：

<table>
   <tr>
       <td>模块一</td>
       <td>模块二</td>
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

// 具有泛型类类型且
// 也具有泛型类类型参数的函数
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

如果您尝试在模块三中调用这些函数，Kotlin 2.0.0 中会触发错误，因为泛型类 `Node<V>` 无法从模块三访问：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发错误，因为泛型类 Node<V> 不可访问
    consume(produce())
}
```

在未来的版本中，我们将继续弃用不可访问类型的使用。我们已从 Kotlin 2.0.0 开始，针对某些不可访问类型（包括非泛型类型）的场景添加了警告。

例如，让我们使用与前面示例相同的模块设置，但将泛型类 `Node<V>` 转换为非泛型类 `IntNode`，所有函数都在模块二中声明：

<table>
   <tr>
       <td>模块一</td>
       <td>模块二</td>
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
// 参数且类型为 `IntNode` 的函数
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// 具有泛型类类型
// 且以 `IntNode` 作为类型参数的函数
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

如果您在模块三中调用这些函数，会触发一些警告：

```kotlin
// 模块三
fun test() {
    // 在 Kotlin 2.0.0 中触发警告，因为类 IntNode 不可访问。

    execute {}
    // 参数 'it' 的类 'IntNode' 不可访问。

    execute { _ -> }
    execute(fun (_) {})
    // 参数 '_' 的类 'IntNode' 不可访问。

    // 在未来的 Kotlin 版本中将触发警告，因为 IntNode 不可访问。
    consume(produce())
}
```

**现在的最佳实践是什么？**

如果您遇到有关不可访问泛型类型的新警告，您的构建系统配置很可能存在问题。我们建议您检查您的构建脚本和配置。

作为最后的手段，您可以为模块三配置对模块一的直接依赖。或者，您可以修改代码以使类型在同一模块内可访问。

更多信息请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-64474)。

### Kotlin 属性与同名 Java 字段的一致解析顺序

**有什么变化？**

在 Kotlin 2.0.0 之前，如果您使用相互继承并包含同名 Kotlin 属性和 Java 字段的 Java 和 Kotlin 类，重复名称的解析行为不一致。IntelliJ IDEA 和编译器之间也存在冲突行为。在开发 Kotlin 2.0.0 的新解析行为时，我们旨在对用户造成最小影响。

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

在 Kotlin 2.0.0 中，示例中的解析行为是一致的，确保 Kotlin 属性取代同名的 Java 字段。现在，`b` 解析为：`Derived.b`。

> 在 Kotlin 2.0.0 之前，如果您使用 IntelliJ IDEA 跳转到 `a` 的声明或使用位置，它会错误地导航到 Java 字段，而实际上应该导航到 Kotlin 属性。
>
> 从 Kotlin 2.0.0 开始，IntelliJ IDEA 会正确导航到与编译器相同的位置。
>
{style="note"}

一般规则是子类优先。上一个示例证明了这一点，因为 `Derived` 是 `Base` Java 类的子类，所以解析为 `Derived` 类中的 Kotlin 属性 `a`。

如果继承关系颠倒，并且 Java 类继承自 Kotlin 类，子类中的 Java 字段优先于同名的 Kotlin 属性。

考虑这个例子：

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

**现在的最佳实践是什么？**

如果此更改影响您的代码，考虑您是否真的需要使用重复的名称。如果您希望 Java 或 Kotlin 类都包含同名字段或属性，并且它们相互继承，请记住子类中的字段或属性将优先。

更多信息请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-55017)。

### 改进 Java 基本类型数组的空安全

**有什么变化？**

从 Kotlin 2.0.0 开始，编译器正确推断导入到 Kotlin 的 Java 基本类型数组的可空性。现在，它保留了与 Java 基本类型数组一起使用的 `TYPE_USE` 注解中的原生可空性，并在其值未按注解使用时发出错误。

通常，当从 Kotlin 调用带有 `@Nullable` 和 `@NotNull` 注解的 Java 类型时，它们会获得相应的原生可空性：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

然而，以前，当 Java 基本类型数组导入到 Kotlin 时，所有 `TYPE_USE` 注解都丢失了，导致平台可空性和可能不安全的代码：

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// 没有错误，即使根据注解 `dataService.fetchData()` 可能为 `null`
// 这可能导致 NullPointerException
dataService.fetchData()[0]
```
请注意，此问题从未影响声明本身的可空性注解，仅影响 `TYPE_USE` 注解。

**现在的最佳实践是什么？**

在 Kotlin 2.0.0 中，Java 基本类型数组的空安全现在在 Kotlin 中是标准配置，因此如果您使用它们，请检查您的代码是否有新的警告和错误：

*   任何使用 `@Nullable` Java 基本类型数组而没有显式空性检查，或尝试将 `null` 传递给期望非空基本类型数组的 Java 方法的代码，现在都将无法编译。
*   使用 `@NotNull` 基本类型数组进行空性检查现在会发出“不必要的安全调用 (Unnecessary safe call)”或“与 null 比较始终为 false (Comparison with null always false)”警告。

更多信息请参阅 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-54521)。

### 预期 (expected) 类中抽象成员的更严格规则

> 预期 (expected) 和实际 (actual) 类处于 [Beta](components-stability.md#stability-levels-explained) 阶段。它们几乎稳定，但您将来可能需要执行迁移步骤。我们将尽力减少您需要进行的任何进一步更改。
>
{style="warning"}

**有什么变化？**

由于 K2 编译器在编译时对通用和平台源进行了分离，我们对预期 (expected) 类中的抽象成员实施了更严格的规则。

使用以前的编译器，预期非抽象类可以继承抽象函数而无需[覆盖该函数](inheritance.md#overriding-rules)。由于编译器可以同时访问通用和平台代码，编译器可以看到抽象函数在实际类中是否有相应的覆盖和定义。

既然通用和平台源是单独编译的，继承的函数必须在预期类中显式覆盖，以便编译器知道该函数不是抽象的。否则，编译器会报告 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 错误。

例如，假设您有一个通用源集，其中声明了一个名为 `FileSystem` 的抽象类，它有一个抽象函数 `listFiles()`。您在平台源集中将 `listFiles()` 函数定义为实际声明的一部分。

在您的通用代码中，如果您有一个名为 `PlatformFileSystem` 的预期非抽象类，它继承自 `FileSystem` 类，`PlatformFileSystem` 类继承了抽象函数 `listFiles()`。但是，在 Kotlin 中，非抽象类中不能有抽象函数。要使 `listFiles()` 函数变为非抽象，您必须将其声明为覆盖，而不使用 `abstract` 关键字：

<table>
   <tr>
       <td>通用代码</td>
       <td>平台代码</td>
   </tr>
   <tr>
<td>

```kotlin
abstract class FileSystem {
    abstract fun listFiles()
}
expect open class PlatformFileSystem() : FileSystem {
    // 在 Kotlin 2.0.0 中，需要显式覆盖
    expect override fun listFiles()
    // 在 Kotlin 2.0.0 之前，不需要覆盖
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

**现在的最佳实践是什么？**

如果您在预期非抽象类中继承抽象函数，添加非抽象覆盖。

更多信息请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual) 中的相应问题。

### 按主题领域

这些主题领域列出了不太可能影响您的代码的更改，但提供了相关 YouTrack 问题的链接以供进一步阅读。Issue ID 旁边带有星号 (*) 的更改在本节开头进行了说明。

#### 类型推断 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                                      |
|:----------------------------------------------------------|:---------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 编译后的属性引用函数签名中类型不正确，如果该类型是 Normal 显式类型           |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 在构建器推断上下文中禁止将类型变量隐式推断为上限                             |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2：数组字面量中的泛型注解调用需要显式类型参数                               |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 交叉类型缺少子类型检查                                                       |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 更改 Kotlin 中基于 Java 类型参数的类型的默认表示                             |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 更改前缀递增的推断类型，使其返回 getter 的返回类型而不是 inc() 运算符的返回类型 |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2：停止依赖于使用 @UnsafeVariance 进行逆变参数的存在                      |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2：禁止解析为原始类型中的从属成员                                           |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2：正确推断可调用引用到带有扩展函数参数的可调用对象的类型                   |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 使解构变量的实际类型与指定时的显式类型保持一致                               |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2：修复整数字面量溢出导致的不一致行为                                       |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名类型可以从类型参数的匿名函数中暴露                                       |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 带有 break 的 while 循环条件可能产生不健全的智能类型转换                     |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2：在通用代码中禁止对预期/实际顶级属性进行智能类型转换                      |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 改变返回类型的递增和加号运算符必须影响智能类型转换                           |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2：显式指定变量类型在某些情况下会破坏 K1 中可用的绑定智能类型转换      |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | Title                                                                                         |
|:-----------------------------------------------------------|:----------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [弃用投影接收器上合成 setter 的使用](#deprecated-synthetics-setter-on-a-projected-receiver)   |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 禁止用泛型类型参数覆盖带有原始类型参数的 Java 方法                                            |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | 禁止将可能为空的类型参数传递给 \`in\` 投影 DNN 参数                                           |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 弃用类型别名构造函数中的上限违规                                                              |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | 修复基于 Java 类的逆变捕获类型造成的类型不健全问题                                            |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 禁止使用自上限和捕获类型的不健全代码                                                          |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 禁止泛型外部类的泛型内部类中不健全的绑定违规                                                  |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2：为内部类的外部超类型投影引入 PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE                 |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 当从原始集合继承时，如果另一个超类型有额外的专用实现，则报告 MANY_IMPL_MEMBER_NOT_IMPLEMENTED |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2：禁止对扩展类型中具有协变修饰符的类型别名进行构造函数调用和继承                          |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 修复由于不正确处理具有自上限的捕获类型而导致的类型漏洞                                        |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 禁止带有错误泛型参数类型的泛型委托构造函数调用                                                |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 当上限是捕获类型时报告缺少上限违规                                                            |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | Title                                                                                              |
|:-----------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在重载解析时，从派生类中选择 Kotlin 属性，而不是基类中的 Java 字段](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | 使 invoke 约定与预期的语法糖一致                                                                   |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2：当伴生对象优先于静态作用域时，更改限定符解析行为                                               |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 在解析类型和星号导入同名类时报告歧义错误                                                           |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2：迁移 COMPATIBILITY_WARNING 周围的解析                                                          |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 当依赖类包含在同一依赖项的两个不同版本中时，错误地报告 CONFLICTING_INHERITED_MEMBERS             |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 带有接收者的函数类型属性的 invoke 优先于扩展函数 invoke                                            |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | 限定 this：引入/优先处理带有类型大小写限定的 this                                                 |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 确认类路径中 FQ 名称冲突情况下的未指定行为                                                         |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2：禁止在导入中使用类型别名作为限定符                                                             |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2：在较低级别存在歧义时，类型引用的解析器塔工作不正确                                          |

#### 可见性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                    | Title                                                                        |
|:------------------------------------------------------------|:-----------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474)* | [将不可访问类型的使用声明为未指定行为](#forbidden-use-of-inaccessible-generic-types) |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 从内部内联函数调用私有类伴生对象成员时，报告 PRIVATE_CLASS_MEMBER_FROM_INLINE 假阴性 |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | 如果等效的 getter 不可见，即使被覆盖的声明可见，也要使合成属性不可见           |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 禁止从另一个模块的派生类访问内部 setter                                      |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | 禁止从私有内联函数中暴露匿名类型                                             |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | 禁止公共 API 内联函数隐式访问非公共 API                                      |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | 智能类型转换不应影响受保护成员的可见性                                       |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | 禁止从公共内联函数访问被忽略的私有运算符函数                                 |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1：var 的 Setter（覆盖 protected val）被生成为 public                       |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | Kotlin/Native 在链接时禁止通过私有成员覆盖                                   |

#### 注解 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                              |
|:----------------------------------------------------------|:-------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 禁止语句使用不含 EXPRESSION 目标的注解进行注解                       |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 REPEATED_ANNOTATION 检查期间忽略括号表达式                        |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2：禁止在属性 getter 上使用 use-site 'get' 目标注解                 |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 where 子句中注解类型参数                                      |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 伴生对象范围在伴生对象注解解析中被忽略                               |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2：用户和编译器所需注解之间引入歧义                                 |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 枚举值上的注解不应复制到枚举值类                                     |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2：\`WRONG_ANNOTATION_TARGET\` 报告包装在 \`()?\` 中的类型的不兼容注解 |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2：\`WRONG_ANNOTATION_TARGET\` 报告 catch 参数类型的注解            |

#### 空安全 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | Title                                                                 |
|:-----------------------------------------------------------|:----------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [弃用 Java 中注解为 Nullable 的数组类型的不安全用法](#improved-null-safety-for-java-primitive-arrays) |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2：更改安全调用和约定运算符组合的评估语义                            |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 超类型顺序定义继承函数的空性参数                                      |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | 在公共签名中近似局部类型时保持空性                                    |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 禁止将可空类型赋值给不可空 Java 字段作为不安全赋值的选择器            |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 报告缺少错误级别的可空参数在警告级别的 Java 类型中                    |

#### Java 互操作性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                                       |
|:----------------------------------------------------------|:----------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止源文件中出现同 FQ 名称的 Java 和 Kotlin 类                            |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | 从 Java 集合继承的类，其行为不一致，取决于超类型的顺序                        |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2：Java 类从 Kotlin 私有类继承时的未指定行为                               |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 将 Java 可变参数方法传递给内联函数导致运行时出现数组的数组而不是单个数组      |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允许在 K-J-K 层次结构中覆盖内部成员                                         |

#### 属性 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | Title                                                                         |
|:-----------------------------------------------------------|:------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止延迟初始化带有支持字段的开放属性](#immediate-initialization-of-open-properties-with-backing-fields) |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 当没有主构造函数或类是局部时，弃用缺少 MUST_BE_INITIALIZED 的情况             |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 禁止在属性上潜在调用 invoke 时进行递归解析                                    |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 弃用对来自另一个模块的不可见派生类的基类属性的智能类型转换                    |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2：数据类属性缺少 OPT_IN_USAGE_ERROR                                         |

#### 控制流 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                            |
|:----------------------------------------------------------|:-----------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之间类初始化块中 CFA 规则不一致                         |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | K1/K2 在括号中没有 else 分支的 if 条件语句中不一致               |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | 在带有初始化作用域函数的 try/catch 块中出现 VAL_REASSIGNMENT 假阴性 |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 将数据流信息从 try 块传播到 catch 和 finally 块                |

#### 枚举类 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                          |
|:----------------------------------------------------------|:---------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 禁止在枚举条目初始化期间访问枚举类的伴生对象                   |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 报告枚举类中虚拟内联方法缺少错误                               |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 报告属性/字段与枚举条目之间解析歧义                            |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 当伴生属性优先于枚举条目时，更改限定符解析行为                   |

#### 函数式 (SAM) 接口 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                                                 |
|:----------------------------------------------------------|:----------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 弃用需要 OptIn 但没有注解的 SAM 构造函数用法                          |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止从 JDK 函数接口的 SAM 构造函数的 lambda 返回具有不正确空性的值      |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可调用引用参数类型的 SAM 转换导致 CCE                                 |

#### 伴生对象 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                  | Title                                     |
|:----------------------------------------------------------|:------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 伴生对象成员的非调用引用具有无效签名        |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 当 V 具有伴生对象时，更改 (V)::foo 引用解析 |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| Issue ID                                                   | Title                                                                                          |
|:-----------------------------------------------------------|:-----------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP 报告 [ABSTRACT_MEMBER_NOT_IMPLEMENTED] 用于通用代码中的继承者，而实现位于实际对应方        |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | 限定 this：在潜在标签冲突情况下的行为更改                                                      |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | 修复 JVM 后端中函数名混淆不正确的问题，以防 Java 子类中意外出现冲突重载                        |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 问题] 禁止在语句位置声明带有 suspend 标记的匿名函数                                        |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn：禁止使用标记下的默认参数调用构造函数                                                    |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | Unit 转换被意外地允许用于变量表达式 + invoke 解析                                              |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 禁止将带有适配的可调用引用提升为 KFunction                                                     |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2 破坏 \`false && ...\` 和 \`false \|\| ...\`                                             |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] 弃用 \`header\`/\`impl\` 关键字                                                           |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 默认情况下通过 invokedynamic + LambdaMetafactory 生成所有 Kotlin lambdas                       |

## 与 Kotlin 版本的兼容性

以下 Kotlin 版本支持新的 K2 编译器：

| Kotlin 版本           | 稳定性级别 |
|:----------------------|:-----------|
| 2.0.0–%kotlinVersion% | 稳定       |
| 1.9.20–1.9.25         | Beta       |
| 1.9.0–1.9.10          | JVM 为 Beta |
| 1.7.0–1.8.22          | Alpha      |

## 与 Kotlin 库的兼容性

如果您使用 Kotlin/JVM，K2 编译器可与使用任何 Kotlin 版本编译的库配合使用。

如果您使用 Kotlin 多平台，K2 编译器保证与使用 Kotlin 1.9.20 及更高版本编译的库兼容。

## 编译器插件支持

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
*   [Serialization](serialization.md)

此外，Kotlin K2 编译器支持：

*   [Jetpack Compose](https://developer.android.com/jetpack/compose) 1.5.0 编译器插件及更高版本。
*   [Kotlin 符号处理 (KSP)](ksp-overview.md)，从 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 开始。

> 如果您使用任何其他编译器插件，请查阅其文档以确认它们是否与 K2 兼容。
>
{style="tip"}

### 升级您的自定义编译器插件

> 自定义编译器插件使用 [实验性 (Experimental)](components-stability.md#stability-levels-explained) 插件 API。因此，API 可能随时更改，所以我们无法保证向后兼容性。
>
{style="warning"}

升级过程根据您拥有的自定义插件类型有两种路径。

#### 仅后端编译器插件

如果您的插件仅实现 `IrGenerationExtension` 扩展点，过程与任何其他新编译器版本相同。检查您使用的 API 是否有任何更改，并在必要时进行更改。

#### 后端和前端编译器插件

如果您的插件使用与前端相关的扩展点，您需要使用新的 K2 编译器 API 重写插件。有关新 API 的介绍，请参阅 [FIR 插件 API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果您对升级自定义编译器插件有疑问，请加入我们的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack 频道，我们将尽力帮助您。
>
{style="note"}

## 分享您对新 K2 编译器的反馈

我们将不胜感激您的任何反馈！

*   在[我们的问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)中报告您在迁移到新 K2 编译器时遇到的任何问题。
*   [启用发送使用统计信息选项](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，允许 JetBrains 收集有关 K2 使用情况的匿名数据。