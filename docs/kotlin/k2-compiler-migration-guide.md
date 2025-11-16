[//]: # (title: K2 编译器迁移指南)

随着 Kotlin 语言和生态系统的持续演进，Kotlin 编译器也随之发展。第一步是引入新的 JVM 和 JS IR (中间表示) 后端，它们共享逻辑，简化了针对不同平台**目标**的代码生成。现在，其演进的下一个阶段带来了名为 K2 的新前端。

![Kotlin K2 编译器架构](k2-compiler-architecture.svg){width=700}

随着 K2 编译器的到来，Kotlin 前端已被彻底重写，并采用了全新、更高效的架构。新编译器带来的根本性变化是使用了包含更多语义信息的统一数据结构。此前端负责执行语义分析、**调用解析**和**类型推断**。

新架构和丰富的数据结构使 K2 编译器能够提供以下益处：

*   **改进的调用解析和类型推断**。编译器行为更一致，对你的代码理解更深入。
*   **更容易引入新语言特性的语法糖**。未来，当新**特性**引入时，你将能够使用更简洁、更可读的代码。
*   **更快的编译期**。**编译项**时间可以[显著加快](#performance-improvements)。
*   **增强的 IDE 性能**。从 2025.1 开始，IntelliJ IDEA 使用 K2 模式分析你的 Kotlin 代码，提升了稳定性并提供了性能改进。有关更多信息，请参见[IDE 支持](#support-in-ides)。

本指南：

*   阐释了新 K2 编译器的益处。
*   强调你在迁移过程中可能遇到的变化，以及如何相应地调整代码。
*   描述了如何回滚到之前的版本。

> 新 K2 编译器从 2.0.0 开始默认启用。关于 Kotlin 2.0.0 中提供的新**特性**以及新 K2 编译器的更多信息，请参见 [Kotlin 2.0.0 的新增**特性**](whatsnew20.md)。
>
{style="note"}

## 性能改进

为了**求值** K2 编译器的性能，我们在两个开源**项目**上运行了性能测试：[Anki-Android](https://github.com/ankidroid/Anki-Android) 和 [Exposed](https://github.com/JetBrains/Exposed)。以下是我们发现的关键性能改进：

*   K2 编译器带来了高达 94% 的**编译项**速度提升。例如，在 Anki-Android **项目**中，纯净**构建**时间从 Kotlin 1.9.23 的 57.7 秒缩短到 Kotlin 2.0.0 的 29.7 秒。
*   使用 K2 编译器，初始化阶段速度提升高达 488%。例如，在 Anki-Android **项目**中，增量**构建**的初始化阶段从 Kotlin 1.9.23 的 0.126 秒削减到 Kotlin 2.0.0 的仅 0.022 秒。
*   与之前的编译器相比，Kotlin K2 编译器在分析阶段快了 376%。例如，在 Anki-Android **项目**中，增量**构建**的分析时间从 Kotlin 1.9.23 的 0.581 秒大幅减少到 Kotlin 2.0.0 的仅 0.122 秒。

关于这些改进的更多详细信息，以及了解我们如何分析 K2 编译器性能的更多信息，请参见我们的[博客文章](https://blog.jetbrains.com/kotlin/2024/04/k2-compiler-performance-benchmarks-and-how-to-measure-them-on-your-projects/)。

## 语言**特性**改进

Kotlin K2 编译器改进了与[**智能类型转换**](#smart-casts)和 [Kotlin Multiplatform](#kotlin-multiplatform) 相关的语言**特性**。

### **智能类型转换**

Kotlin 编译器可以在特定情况下自动将对象**类型转换**为某种类型，省去你手动**显式**指定的麻烦。这称为[**智能类型转换**](typecasts.md#smart-casts)。Kotlin K2 编译器现在在比以前更多的场景下执行**智能类型转换**。

在 Kotlin 2.0.0 中，我们在以下领域对**智能类型转换**进行了改进：

*   [局部变量和更深的作用域](#local-variables-and-further-scopes)
*   [使用逻辑 `or` **操作符**的类型**检测**](#type-checks-with-the-logical-or-operator)
*   [内联**函数**](#inline-functions)
*   [带有**函数**类型的属性](#properties-with-function-types)
*   [异常处理](#exception-handling)
*   [自增和自减**操作符**](#increment-and-decrement-operators)

#### 局部变量和更深的作用域

之前，如果变量在 `if` 条件中被**检测**为非 `null`，该变量会进行**智能类型转换**。然后，有关此变量的信息会在 `if` **代码块**的**作用域**内进一步共享。

然而，如果你在 `if` 条件**外部****声明**变量，则 `if` 条件内将没有关于该变量的信息，因此它无法进行**智能类型转换**。这种行为也出现在 `when` 表达式和 `while` 循环中。

从 Kotlin 2.0.0 开始，如果你**声明**一个变量，并在 `if`、`when` 或 `while` 条件中使用它，那么编译器收集到的关于该变量的任何信息都将可在相应的**代码块**中用于**智能类型转换**。

这在你想要做的事情上会很有用，例如将布尔条件提取到变量中。然后，你可以给变量一个有意义的名称，这将提高你的代码可读性，并使得稍后在代码中重用该变量成为可能。例如：

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // In Kotlin 2.0.0, the compiler can access
        // information about isCat, so it knows that
        // animal was smart-cast to the type Cat.
        // Therefore, the purr() function can be called.
        // In Kotlin 1.9.20, the compiler doesn't know
        // about the smart cast, so calling the purr()
        // function triggers an error.
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

#### 使用逻辑 `or` **操作符**的类型**检测**

在 Kotlin 2.0.0 中，如果你使用 `or` **操作符** (`||`) 组合对象的类型**检测**，**智能类型转换**会转换为它们最接近的共同父类型。在此更改之前，**智能类型转换**总是转换为 `Any` 类型。

在这种情况下，你之后仍然需要手动**检测**对象类型，然后才能访问其任何属性或调用其**函数**。例如：

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus is smart-cast to a common supertype Status
        signalStatus.signal()
        // Prior to Kotlin 2.0.0, signalStatus is smart cast 
        // to type Any, so calling the signal() function triggered an
        // Unresolved reference error. The signal() function can only 
        // be called successfully after another type check:
        
        // check(signalStatus is Status)
        // signalStatus.signal()
    }
}
```

> 共同父类型是[联合类型](https://en.wikipedia.org/wiki/Union_type)的**近似**。Kotlin **目前不支持联合类型**。
>
{style="note"}

#### 内联**函数**

在 Kotlin 2.0.0 中，K2 编译器对待内联**函数**的方式不同，使其能够结合其他编译器分析，判断是否可以安全地进行**智能类型转换**。

具体来说，内联**函数**现在被视为具有隐式 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)**契约**。这意味着传递给内联**函数**的任何 lambda **函数**都会在原位调用。由于 lambda **函数**在原位调用，编译器知道 lambda **函数**不会泄露对其**函数**体内任何变量的引用。

编译器将此知识与其它编译器分析结合使用，以决定是否可以安全地对任何捕获的变量进行**智能类型转换**。例如：

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // In Kotlin 2.0.0, the compiler knows that processor 
        // is a local variable and inlineAction() is an inline function, so 
        // references to processor can't be leaked. Therefore, it's safe 
        // to smart-cast processor.
      
        // If processor isn't null, processor is smart-cast
        if (processor != null) {
            // The compiler knows that processor isn't null, so no safe call 
            // is needed
            processor.process()

            // In Kotlin 1.9.20, you have to perform a safe call:
            // processor?.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

#### 带有**函数**类型的属性

在以前的 Kotlin 版本中，曾有一个 bug，导致带有**函数**类型的类属性无法进行**智能类型转换**。我们在 Kotlin 2.0.0 和 K2 编译器中修复了此行为。例如：

```kotlin
class Holder(val provider: (() -> Unit)?) {
    fun process() {
        // In Kotlin 2.0.0, if provider isn't null,
        // it is smart-cast
        if (provider != null) {
            // The compiler knows that provider isn't null
            provider()

            // In 1.9.20, the compiler doesn't know that provider isn't 
            // null, so it triggers an error:
            // Reference has a nullable type '(() -> Unit)?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

此更改也适用于你**重载** `invoke` **操作符**的情况。例如：

```kotlin
interface Provider {
    operator fun invoke()
}

interface Processor : () -> String

class Holder(val provider: Provider?, val processor: Processor?) {
    fun process() {
        if (provider != null) {
            provider() 
            // In 1.9.20, the compiler triggers an error: 
            // Reference has a nullable type 'Provider?', use explicit '?.invoke()' to make a function-like call instead
        }
    }
}
```

#### 异常处理

在 Kotlin 2.0.0 中，我们改进了异常处理，以便**智能类型转换**信息可以传递到 `catch` 和 `finally` **代码块**。此更改使你的代码更安全，因为编译器会跟踪你的对象是否是**可空的**类型。例如：

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput is smart-cast to String type
    stringInput = ""
    try {
        // The compiler knows that stringInput isn't null
        println(stringInput.length)
        // 0

        // The compiler rejects previous smart cast information for 
        // stringInput. Now stringInput has the String? type.
        stringInput = null

        // Trigger an exception
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // In Kotlin 2.0.0, the compiler knows stringInput 
        // can be null, so stringInput stays nullable.
        println(stringInput?.length)
        // null

        // In Kotlin 1.9.20, the compiler says that a safe call isn't
        // needed, but this is incorrect.
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-exception-handling"}

#### 自增和自减**操作符**

在 Kotlin 2.0.0 之前，编译器不明白对象类型在使用自增或自减**操作符**后可能会改变。由于编译器无法准确跟踪对象类型，你的代码可能导致未解析引用错误。在 Kotlin 2.0.0 中，此问题已修复：

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

    // Check if unknownObject inherits from the Tau interface
    // Note, it's possible that unknownObject inherits from both
    // Rho and Tau interfaces.
    if (unknownObject is Tau) {

        // Use the overloaded inc() operator from interface Rho.
        // In Kotlin 2.0.0, the type of unknownObject is smart-cast to
        // Sigma.
        ++unknownObject

        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so the sigma() function can be called successfully.
        unknownObject.sigma()

        // In Kotlin 1.9.20, the compiler doesn't perform a smart cast
        // when inc() is called so the compiler still thinks that 
        // unknownObject has type Tau. Calling the sigma() function 
        // throws a compile-time error.
        
        // In Kotlin 2.0.0, the compiler knows unknownObject has type
        // Sigma, so calling the tau() function throws a compile-time 
        // error.
        unknownObject.tau()
        // Unresolved reference 'tau'

        // In Kotlin 1.9.20, since the compiler mistakenly thinks that 
        // unknownObject has type Tau, the tau() function can be called,
        // but it throws a ClassCastException.
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-k2-increment-decrement-operators" validate="false"}

### Kotlin Multiplatform

K2 编译器在以下领域改进了 Kotlin Multiplatform 相关**特性**：

*   [**编译项**期间公共和平台源代码的分离](#separation-of-common-and-platform-sources-during-compilation)
*   [`expect` 和 `actual` **声明**的不同可见性级别](#different-visibility-levels-of-expected-and-actual-declarations)

#### **编译项**期间公共和平台源代码的分离

之前，Kotlin 编译器的设计阻止了它在**编译期**将公共和平台**源代码集**分开。因此，公共代码可以访问平台代码，导致平台之间行为不一致。此外，编译器设置和公共代码中的**依赖项**会泄露到平台代码中。

在 Kotlin 2.0.0 中，我们新 Kotlin K2 编译器的实现包含对**编译项**方案的重新设计，以确保公共和平台**源代码集**之间的严格分离。当你使用 [**expect** 和 **actual** **函数**](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-functions)时，此更改最为明显。之前，公共代码中的**函数调用**可能会解析为平台代码中的**函数**。例如：

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
// There is no foo() function overload on the JavaScript platform
```

</td>
</tr>
</table>

在此示例中，公共代码的行为因其运行的平台而异：

*   在 JVM 平台上，在公共代码中调用 `foo()` **函数**会导致平台代码中的 `foo()` **函数**被调用，作为 `platform foo`。
*   在 JavaScript 平台上，在公共代码中调用 `foo()` **函数**会导致公共代码中的 `foo()` **函数**被调用，作为 `common foo`，因为平台代码中没有这样的**函数**可用。

在 Kotlin 2.0.0 中，公共代码无法访问平台代码，因此两个平台都成功将 `foo()` **函数**解析为公共代码中的 `foo()` **函数**：`common foo`。

除了改进了跨平台行为的一致性之外，我们还努力修复了 IntelliJ IDEA 或 Android Studio 与编译器之间行为冲突的情况。例如，当你使用 [**expect** 和 **actual** 类](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html#expected-and-actual-classes)时，会发生以下情况：

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
    // Before 2.0.0, it triggers an IDE-only error
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

在此示例中，`expect` 类 `Identity` 没有默认**构造函数**，因此无法在公共代码中成功调用。之前，只有 IDE 报告错误，但代码在 JVM 上仍然成功**编译**。然而，现在编译器会正确报告错误：

```none
Expected class 'expect class Identity : Any' does not have default constructor
```

##### 何时解析行为不变

我们仍在向新的**编译项**方案迁移中，因此当你调用不在同一**源代码集**中的**函数**时，解析行为仍然相同。你主要会在公共代码中使用多平台**版本库**中的**重载**时注意到这种差异。

假设你有一个**版本库**，它有两个带有不同签名的 `whichFun()` **函数**：

```kotlin
// Example library

// MODULE: common
fun whichFun(x: Any) = println("common function") 

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

如果你在公共代码中调用 `whichFun()` **函数**，**版本库**中拥有最相关**实参**类型的**函数**将被解析：

```kotlin
// A project that uses the example library for the JVM target

// MODULE: common
fun main(){
    whichFun(2) 
    // platform function
}
```

相比之下，如果你在同一**源代码集**内**声明** `whichFun()` 的**重载**，则公共代码中的**函数**将被解析，因为你的代码无法访问**平台特有的**版本：

```kotlin
// Example library isn't used

// MODULE: common
fun whichFun(x: Any) = println("common function") 

fun main(){
    whichFun(2) 
    // common function
}

// MODULE: JVM
fun whichFun(x: Int) = println("platform function")
```

类似于多平台**版本库**，由于 `commonTest` **模块**位于单独的**源代码集**中，它仍然可以访问**平台特有的**代码。因此，调用 `commonTest` **模块**中**函数**的解析行为与旧的**编译项**方案相同。

未来，这些剩余情况将与新的**编译项**方案更加一致。

#### `expect` 和 `actual` **声明**的不同可见性级别

在 Kotlin 2.0.0 之前，如果你在 Kotlin Multiplatform **项目**中使用了 [**expect** 和 **actual** **声明**](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，它们必须具有相同的[可见性级别](visibility-modifiers.md)。Kotlin 2.0.0 现在也支持不同的可见性级别，但**仅限** `actual` **声明**比 `expect` **声明**更宽松的情况。例如：

```kotlin
expect internal class Attribute // Visibility is internal
actual class Attribute          // Visibility is public by default,
                                // which is more permissive
```

同样，如果你在 `actual` **声明**中使用了[类型别名](type-aliases.md)，则**底层类型**的可见性应与 `expect` **声明**相同或更宽松。例如：

```kotlin
expect internal class Attribute                 // Visibility is internal
internal actual typealias Attribute = Expanded

class Expanded                                  // Visibility is public by default,
                                                // which is more permissive
```

## 如何启用 Kotlin K2 编译器

从 Kotlin 2.0.0 开始，Kotlin K2 编译器默认启用。

要升级 Kotlin 版本，请在你的 [Gradle](gradle-configure-project.md#apply-the-plugin) 和 [Maven](maven.md#configure-and-enable-the-plugin)**构建脚本**中将其更改为 2.0.0 或更高版本。

为了在 IntelliJ IDEA 或 Android Studio 中获得最佳体验，请考虑在 IDE 中[启用 K2 模式](#support-in-ides)。

### 将 Kotlin **构建报告**与 Gradle 结合使用

Kotlin [**构建报告**](gradle-compilation-and-caches.md#build-reports)提供了关于 Kotlin 编译器**任务**在不同**编译项**阶段所花费时间的信息，以及使用了哪个编译器和 Kotlin 版本，以及**编译项**是否为增量**编译项**。这些**构建报告**对于**求值**你的**构建**性能有用。它们比 [Gradle **构建扫描**](https://scans.gradle.com/) 对 Kotlin **编译项流水线**有更多洞察，因为它们为你提供了所有 Gradle **任务**的性能概览。

#### 如何启用**构建报告**

要启用**构建报告**，请在你的 `gradle.properties` 文件中**声明**你希望将**构建报告**输出保存到何处：

```none
kotlin.build.report.output=file
```

以下值及其组合可用于输出：

| Option | Description |
|---|---|
| `file` | 将**构建报告**以人类可读格式保存到本地文件。默认情况下，它位于 `${project_folder}/build/reports/kotlin-build/${project_name}-timestamp.txt` |
| `single_file` | 将**构建报告**以对象格式保存到指定的本地文件。 |
| `build_scan` | 将**构建报告**保存到 [**构建扫描**](https://scans.gradle.com/) 的 `custom values` 部分。请注意，Gradle Enterprise 插件限制了自定义值的数量和长度。在大型**项目**中，某些值可能会丢失。 |
| `http` | 使用 HTTP(S) **发布构建报告**。POST **方法**以 JSON 格式发送指标。你可以在 [Kotlin **版本库**](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/report/data/GradleCompileStatisticsData.kt) 中查看已发送数据的当前版本。你可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2022/06/introducing-kotlin-build-reports/?_gl=1*1a7pghy*_ga*MTcxMjc1NzE5Ny4xNjY1NDAzNjkz*_ga_9J976DJZ68*MTcxNTA3NjA2NS4zNzcuMS4xNzE1MDc2MDc5LjQ2LjAuMA..&_ga=2.265800911.1124071296.1714976764-1712757197.1665403693#enable_build_reports)中找到 HTTP 端点示例。 |
| `json` | 将**构建报告**以 JSON 格式保存到本地文件。在 `kotlin.build.report.json.directory` 中设置**构建报告**的位置。默认情况下，其名称为 `${project_name}-build-<date-time>-<index>.json`。 |

关于**构建报告**可能性的更多信息，请参见 [**构建报告**](gradle-compilation-and-caches.md#build-reports)。

## IDE 支持

IntelliJ IDEA 和 Android Studio 中的 K2 模式使用 K2 编译器来改进代码分析、代码补全和高亮显示。

从 IntelliJ IDEA 2025.1 开始，K2 模式[默认启用](https://blog.jetbrains.com/idea/2025/04/k2-mode-in-intellij-idea-2025-1-current-state-and-faq/)。

在 Android Studio 中，你可以从 2024.1 开始按照以下步骤启用 K2 模式：

1.  转到 **设置** | **语言和框架** | **Kotlin**。
2.  选择**启用 K2 模式**选项。

### 之前的 IDE 行为 {initial-collapse-state="collapsed" collapsible="true"}

如果你想恢复之前的 IDE 行为，可以禁用 K2 模式：

1.  转到 **设置** | **语言和框架** | **Kotlin**。
2.  取消选择**启用 K2 模式**选项。

> 我们计划在 Kotlin 2.1.0 之后引入[稳定](components-stability.md#stability-levels-explained)语言**特性**。在此之前，你可以继续使用之前的 IDE **特性**进行代码分析，并且不会遇到因未识别的语言**特性**而导致的任何代码高亮问题。
>
{style="note"}

## 在 Kotlin Playground 中尝试 Kotlin K2 编译器

Kotlin Playground 支持 Kotlin 2.0.0 及更高版本。 [试试看吧！](https://pl.kotl.in/czuoQprce)

## 如何回滚到之前的编译器

要在 Kotlin 2.0.0 及更高版本中使用之前的编译器，你可以：

*   在你的 `build.gradle.kts` 文件中，将[你的语言版本设置为 `1.9`](gradle-compiler-options.md#example-of-setting-languageversion)。

    或者
*   使用以下编译器选项：`-language-version 1.9`。

## 更改

随着新前端的引入，Kotlin 编译器经历了几次更改。让我们首先重点介绍影响你代码的最重要修改，解释了哪些内容发生了变化，并详细说明了未来的最佳实践。如果你想了解更多信息，我们将这些更改归类到[主题领域](#per-subject-area)，以便你进一步阅读。

本节重点介绍以下修改：

*   [立即初始化带有**幕后字段**的 `open` 属性](#immediate-initialization-of-open-properties-with-backing-fields)
*   [弃用对**型变接收者**使用合成**setter**](#deprecated-synthetics-setter-on-a-projected-receiver)
*   [禁止使用无法访问的泛型类型](#forbidden-use-of-inaccessible-generic-types)
*   [Kotlin 属性与同名 Java 字段的一致解析顺序](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name)
*   [改进 Java **原语数组**的**空安全**](#improved-null-safety-for-java-primitive-arrays)
*   [`expect` 类中抽象成员的更严格规则](#stricter-rules-for-abstract-members-in-expected-classes)

### 立即初始化带有**幕后字段**的 `open` 属性

**更改了什么？**

在 Kotlin 2.0 中，所有带有**幕后字段**的 `open` 属性都必须立即初始化；否则，你将收到**编译错误**。之前，只有 `open var` 属性需要立即初始化，但现在这也扩展到带有**幕后字段**的 `open val` 属性：

```kotlin
open class Base {
    open val a: Int
    open var b: Int
    
    init {
        // Error starting with Kotlin 2.0 that earlier compiled successfully 
        this.a = 1 //Error: open val must have initializer
        // Always an error
        this.b = 1 // Error: open var must have initializer
    }
}

class Derived : Base() {
    override val a: Int = 2
    override var b = 2
}
```

此更改使编译器的行为更可预测。考虑一个示例，其中 `open val` 属性被带有自定义**setter**的 `var` 属性**覆盖**。

如果使用自定义**setter**，延迟初始化可能导致混淆，因为不清楚你是想初始化**幕后字段**还是调用**setter**。过去，如果你想调用**setter**，旧编译器无法保证**setter**会初始化**幕后字段**。

**现在最佳实践是什么？**

我们鼓励你始终初始化带有**幕后字段**的 `open` 属性，因为我们相信这种做法更高效且不易出错。

但是，如果你不想立即初始化属性，可以：

*   将属性设为 `final`。
*   使用允许延迟初始化的私有**幕后属性**。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57555) 中的相应问题。

### 弃用对**型变接收者**使用合成**setter**

**更改了什么？**

如果你使用 Java 类的合成**setter**来**赋值**一个与类**型变**类型冲突的类型，就会触发错误。

假设你有一个名为 `Container` 的 Java 类，它包含 `getFoo()` 和 `setFoo()` **方法**：

```java
public class Container<E> {
    public E getFoo() {
        return null;
    }
    public void setFoo(E foo) {}
}
```

如果你有以下 Kotlin 代码，其中 `Container` 类的实例具有**型变**类型，使用 `setFoo()` **方法**将总是生成错误。然而，只有从 Kotlin 2.0.0 开始，合成的 `foo` 属性才会触发错误：

```kotlin
fun exampleFunction(starProjected: Container<*>, inProjected: Container<in Number>, sampleString: String) {
    starProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    starProjected.foo = sampleString
    // Error since Kotlin 2.0.0

    inProjected.setFoo(sampleString)
    // Error since Kotlin 1.0

    // Synthetic setter `foo` is resolved to the `setFoo()` method
    inProjected.foo = sampleString
    // Error since Kotlin 2.0.0
}
```

**现在最佳实践是什么？**

如果你发现此更改导致代码中出现错误，你可能需要重新考虑如何**声明**你的类型。你可能不需要使用类型**型变**，或者你可能需要从代码中删除任何**赋值**。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54309) 中的相应问题。

### 禁止使用无法访问的泛型类型

**更改了什么？**

由于 K2 编译器的新架构，我们更改了处理无法访问的泛型类型的方式。通常，你不应该在代码中**依赖**无法访问的泛型类型，因为这表明你的**项目构建配置**存在配置错误，导致编译器无法访问**编译**所需的必要信息。在 Kotlin 2.0.0 中，你无法**声明**或调用带有无法访问的泛型类型的**函数字面量**，也无法使用带有无法访问的泛型类型**实参**的泛型类型。此限制有助于你避免代码后期出现编译器错误。

例如，假设你在一个**模块**中**声明**了一个泛型类：

```kotlin
// Module one
class Node<V>(val value: V)
```

如果你有另一个**模块**（**模块**二），其**依赖项配置**在**模块**一上，你的代码可以访问 `Node<V>` 类并将其用作**函数**类型中的类型：

```kotlin
// Module two
fun execute(func: (Node<Int>) -> Unit) {}
// Function compiles successfully
```

然而，如果你的**项目**配置错误，使得你有一个只**依赖****模块**二的第三方**模块**（**模块**三），那么 Kotlin 编译器在**编译****模块**三时将无法访问**模块**一中的 `Node<V>` 类。现在，**模块**三中任何使用 `Node<V>` 类型的 lambda 或匿名**函数**都会在 Kotlin 2.0.0 中触发错误，从而避免了代码后期可能出现的编译器错误、崩溃和**运行时**异常：

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as the type of the implicit 
    // lambda parameter (it) resolves to Node, which is inaccessible
    execute {}

    // Triggers an error in Kotlin 2.0.0, as the type of the unused 
    // lambda parameter (_) resolves to Node, which is inaccessible
    execute { _ -> }

    // Triggers an error in Kotlin 2.0.0, as the type of the unused
    // anonymous function parameter (_) resolves to Node, which is inaccessible
    execute(fun (_) {})
}
```

除了**函数字面量**在包含无法访问泛型类型的**值形参**时触发错误之外，当类型具有无法访问的泛型类型**实参**时也会发生错误。

例如，你在**模块**一中有相同的泛型类**声明**。在**模块**二中，你**声明**另一个泛型类：`Container<C>`。此外，你在**模块**二中**声明**使用 `Container<C>` 并以泛型类 `Node<V>` 作为类型**实参**的**函数**：

<table>
   <tr>
       <td>模块一</td>
       <td>模块二</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class Node<V>(val value: V)
```

</td>
<td>

```kotlin
// Module two
class Container<C>(vararg val content: C)

// Functions with generic class type that
// also have a generic class type argument
fun produce(): Container<Node<Int>> = Container(Node(42))
fun consume(arg: Container<Node<Int>>) {}
```

</td>
</tr>
</table>

如果你尝试在**模块**三中调用这些**函数**，Kotlin 2.0.0 会触发错误，因为泛型类 `Node<V>` 无法从**模块**三访问：

```kotlin
// Module three
fun test() {
    // Triggers an error in Kotlin 2.0.0, as generic class Node<V> is 
    // inaccessible
    consume(produce())
}
```

在未来的版本中，我们将继续弃用一般情况下无法访问的类型。我们已经在 Kotlin 2.0.0 中通过为某些无法访问的类型场景（包括非泛型类型）添加警告来开始这一工作。

例如，让我们使用与之前示例相同的**模块**设置，但将泛型类 `Node<V>` 转换为非泛型类 `IntNode`，所有**函数**都在**模块**二中**声明**：

<table>
   <tr>
       <td>模块一</td>
       <td>模块二</td>
   </tr>
   <tr>
<td>

```kotlin
// Module one
class IntNode(val value: Int)
```

</td>
<td>

```kotlin
// Module two
// A function that contains a lambda 
// parameter with `IntNode` type
fun execute(func: (IntNode) -> Unit) {}

class Container<C>(vararg val content: C)

// Functions with generic class type
// that has `IntNode` as a type argument
fun produce(): Container<IntNode> = Container(IntNode(42))
fun consume(arg: Container<IntNode>) {}
```

</td>
</tr>
</table>

如果你在**模块**三中调用这些**函数**时，会触发一些警告：

```kotlin
// Module three
fun test() {
    // Triggers warnings in Kotlin 2.0.0, as class IntNode is 
    // inaccessible.

    execute {}
    // Class 'IntNode' of the parameter 'it' is inaccessible.

    execute { _ -> }
    execute(fun (_) {})
    // Class 'IntNode' of the parameter '_' is inaccessible.

    // Will trigger a warning in future Kotlin releases, as IntNode is
    // inaccessible.
    consume(produce())
}
```

**现在最佳实践是什么？**

如果你遇到关于无法访问的泛型类型的新警告，极有可能你的**构建系统配置**存在问题。我们建议**检测**你的**构建脚本**和配置。

作为最后手段，你可以为**模块**三配置对**模块**一的直接**依赖项**。或者，你可以修改你的代码，使类型在同一**模块**内可访问。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-64474) 中的相应问题。

### Kotlin 属性与同名 Java 字段的一致解析顺序

**更改了什么？**

在 Kotlin 2.0.0 之前，如果你处理相互**继承**并包含相同名称的 Kotlin 属性和 Java 字段的 Java 和 Kotlin 类，重复名称的解析行为不一致。IntelliJ IDEA 和编译器之间也存在冲突行为。在开发 Kotlin 2.0.0 的新解析行为时，我们的**目标**是对用户造成最小影响。

例如，假设有一个 Java 类 `Base`：

```java
public class Base {
    public String a = "a";

    public String b = "b";
}
```

再假设有一个 Kotlin 类 `Derived` **继承**自上述 `Base` 类：

```kotlin
class Derived : Base() {
    val a = "aa"

    // Declares custom get() function
    val b get() = "bb"
}

fun main() {
    // Resolves Derived.a
    println(a)
    // aa

    // Resolves Base.b
    println(b)
    // b
}
```

在 Kotlin 2.0.0 之前，`a` 解析为 `Derived` Kotlin 类中的 Kotlin 属性，而 `b` 解析为 `Base` Java 类中的 Java 字段。

在 Kotlin 2.0.0 中，示例中的解析行为一致，确保 Kotlin 属性取代了同名 Java 字段。现在，`b` 解析为：`Derived.b`。

> 在 Kotlin 2.0.0 之前，如果你使用 IntelliJ IDEA 跳转到 `a` 的**声明**或使用处，它会错误地导航到 Java 字段，而它本应导航到 Kotlin 属性。
>
> 从 Kotlin 2.0.0 开始，IntelliJ IDEA 现在正确导航到与编译器相同的位置。
>
{style="note"}

一般规则是子类优先。前面的示例证明了这一点，因为 `Derived` 类中的 Kotlin 属性 `a` 被解析，因为 `Derived` 是 `Base` Java 类的子类。

如果**继承**被反转，并且 Java 类**继承**自 Kotlin 类，则子类中的 Java 字段优先于同名的 Kotlin 属性。

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
    // Resolves Derived.a
    println(a)
    // a
}
```

**现在最佳实践是什么？**

如果此更改影响了你的代码，请考虑你是否真的需要使用重复的名称。如果你想让 Java 或 Kotlin 类各自包含同名字段或属性，并且相互**继承**，请记住子类中的字段或属性将优先。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-55017) 中的相应问题。

### 改进 Java **原语数组**的**空安全**

**更改了什么？**

从 Kotlin 2.0.0 开始，编译器正确**推断**导入到 Kotlin 的 Java **原语数组**的**可空性**。现在，它保留了与 Java **原语数组**一起使用的 `TYPE_USE` 注解的**原生可空性**，并在其值未按注解使用时发出错误。

通常，当带有 `@Nullable` 和 `@NotNull` 注解的 Java 类型从 Kotlin 调用时，它们会获得相应的**原生可空性**：

```java
interface DataService {
    @NotNull ResultContainer<@Nullable String> fetchData();
}
```
```kotlin
val dataService: DataService = ... 
dataService.fetchData() // -> ResultContainer<String?>
```

然而，之前当 Java **原语数组**导入到 Kotlin 时，所有 `TYPE_USE` 注解都会丢失，导致平台**可空性**和可能不安全的代码：

```java
interface DataProvider {
    int @Nullable [] fetchData();
}
```

```kotlin
val dataService: DataProvider = ...
dataService.fetchData() // -> IntArray .. IntArray?
// No error, even though `dataService.fetchData()` might be `null` according to annotations
// This might result in a NullPointerException
dataService.fetchData()[0]
```
请注意，此问题从未影响**声明**本身的**可空性**注解，只影响 `TYPE_USE` 注解。

**现在最佳实践是什么？**

在 Kotlin 2.0.0 中，Java **原语数组**的**空安全**现在在 Kotlin 中是标准**特性**，因此如果你使用它们，请**检测**你的代码中是否有新的警告和错误：

*   任何在没有**显式可空性检测**的情况下使用 `@Nullable` Java **原语数组**，或尝试将 `null` 传递给预期**非空的****原语数组**的 Java **方法**的代码，现在都将无法**编译**。
*   使用带有**可空性检测**的 `@NotNull` **原语数组**现在会发出“不必要的安全调用”或“与 null 比较始终为 false”警告。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-54521) 中的相应问题。

### `expect` 类中抽象成员的更严格规则

> `expect` 和 `actual` 类处于 [Beta](components-stability.md#stability-levels-explained) 阶段。它们几乎稳定，但未来你可能需要执行迁移步骤。我们将尽力减少你未来需要进行的任何更改。
>
{style="warning"}

**更改了什么？**

由于 K2 编译器在**编译项**期间分离公共和平台源代码，我们对 `expect` 类中的抽象成员实施了更严格的规则。

使用之前的编译器，`expect` 非抽象类可以**继承**抽象**函数**而无需[**覆盖**该**函数**](inheritance.md#overriding-rules)。由于编译器可以同时访问公共和平台代码，编译器可以看到抽象**函数**在 `actual` 类中是否有相应的**覆盖**和**定义**。

既然公共和平台源代码是分开**编译**的，**继承**的**函数**必须在 `expect` 类中**显式覆盖**，这样编译器才能知道该**函数**不是抽象的。否则，编译器会报告 `ABSTRACT_MEMBER_NOT_IMPLEMENTED` 错误。

例如，假设你有一个公共**源代码集**，你**声明**了一个名为 `FileSystem` 的抽象类，它有一个抽象**函数** `listFiles()`。你在平台**源代码集**中将 `listFiles()` **函数****定义**为 `actual` **声明**的一部分。

在你的公共代码中，如果你有一个名为 `PlatformFileSystem` 的 `expect` 非抽象类，它**继承**自 `FileSystem` 类，那么 `PlatformFileSystem` 类**继承**了抽象**函数** `listFiles()`。然而，在 Kotlin 中，非抽象类不能有抽象**函数**。要使 `listFiles()` **函数**非抽象，你必须将其**声明**为不带 `abstract` 关键字的**覆盖**：

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
    // In Kotlin 2.0.0, an explicit override is needed
    expect override fun listFiles()
    // Before Kotlin 2.0.0, an override wasn't needed
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

**现在最佳实践是什么？**

如果你在 `expect` 非抽象类中**继承**抽象**函数**，请添加一个非抽象**覆盖**。

关于更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-59739/K2-MPP-reports-ABSTRACTMEMBERNOTIMPLEMENTED-for-inheritor-in-common-code-when-the-implementation-is-located-in-the-actual) 中的相应问题。

### 按主题领域

这些主题领域**列出**了不太可能影响你的代码的更改，但提供了相关 YouTrack 问题的链接，供进一步阅读。标记星号 (*) 的问题 ID 在本节开头已解释。

#### 类型**推断** {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                                                       |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| [KT-64189](https://youtrack.jetbrains.com/issue/KT-64189) | 如果类型**显式**为 `Normal`，则属性引用**编译****函数**签名中的类型不正确                                       |
| [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986) | 禁止在**构建器推断**上下文中将类型变量隐式**推断**为上限                                                       |
| [KT-59275](https://youtrack.jetbrains.com/issue/KT-59275) | K2：要求**圆括号****字面量**中泛型注解调用的**显式**类型**实参**                                                     |
| [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752) | 缺少对交集类型的子类型**检测**                                                                                 |
| [KT-59138](https://youtrack.jetbrains.com/issue/KT-59138) | 更改 Java 类型**形参**的类型默认表示                                                             |
| [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178) | 更改前缀自增的**推断**类型为**getter**的返回类型，而不是 `inc()` **操作符**的返回类型                          |
| [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609) | K2：停止**依赖** `@UnsafeVariance` 用于**逆变****形参**的存在                                                    |
| [KT-57620](https://youtrack.jetbrains.com/issue/KT-57620) | K2：禁止**解析**为**原始类型**中的**被包含成员**                                                               |
| [KT-64641](https://youtrack.jetbrains.com/issue/KT-64641) | K2：正确**推断**了带有**扩展****函数****形参**的**可调用引用**类型                                               |
| [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011) | 当**解构变量****显式**指定时，使其真实类型与**显式**类型一致                                                    |
| [KT-38895](https://youtrack.jetbrains.com/issue/KT-38895) | K2：修复整数字**字面量溢出**的不一致行为                                                                           |
| [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862) | 匿名类型可以从类型**实参**的匿名**函数**中暴露                                                                 |
| [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379) | 带有 `break` 的 `while` 循环条件可能产生不健全的**智能类型转换**                                                 |
| [KT-62507](https://youtrack.jetbrains.com/issue/KT-62507) | K2：禁止在公共代码中对 `expect`/`actual` **顶层**属性进行**智能类型转换**                                         |
| [KT-65750](https://youtrack.jetbrains.com/issue/KT-65750) | 更改返回类型的自增和加**操作符**必须影响**智能类型转换**                                                         |
| [KT-65349](https://youtrack.jetbrains.com/issue/KT-65349) | [LC] K2：**显式**指定变量类型在某些 K1 可用的情况下会破坏绑定**智能类型转换**                                     |

#### 泛型 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                    | 标题                                                                                                                                              |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)* | [弃用对**型变接收者**使用合成**setter**](#deprecated-synthetics-setter-on-a-projected-receiver)                                                    |
| [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)  | 禁止**覆盖**带有**原始类型****形参**的 Java **方法**，而使用带有泛型类型的**形参**                                                               |
| [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)  | 禁止将可能**可空**的类型**形参**传递给 `in` **型变**的 DNN **形参**                                                                                |
| [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)  | 弃用类型别名**构造函数**中的上限违反                                                                                                                |
| [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)  | 修复基于 Java 类的**逆变**捕获类型的类型不健全问题                                                                                                |
| [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)  | 禁止带有自**上限**和捕获类型的不健全代码                                                                                                            |
| [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)  | 禁止泛型外部类的泛型内部类中不健全的边界违反                                                                                                        |
| [KT-62923](https://youtrack.jetbrains.com/issue/KT-62923)  | K2：为内部类的外部父类型的**型变**引入 `PROJECTION_IN_IMMEDIATE_ARGUMENT_TO_SUPERTYPE`                                                          |
| [KT-63243](https://youtrack.jetbrains.com/issue/KT-63243)  | 当从**原语集合****继承**并从另一个父类型获得额外的**专用实现**时，报告 `MANY_IMPL_MEMBER_NOT_IMPLEMENTED`                                         |
| [KT-60305](https://youtrack.jetbrains.com/issue/KT-60305)  | K2：禁止在展开类型中具有**型变**修饰符的类型别名上进行**构造函数**调用和**继承**                                                                  |
| [KT-64965](https://youtrack.jetbrains.com/issue/KT-64965)  | 修复因不当处理带有自上限的捕获类型而导致的类型漏洞                                                                                                |
| [KT-64966](https://youtrack.jetbrains.com/issue/KT-64966)  | 禁止带有错误泛型**形参**类型的泛型**委托****构造函数**调用                                                                                        |
| [KT-65712](https://youtrack.jetbrains.com/issue/KT-65712)  | 当上限是捕获类型时，报告缺失的上限违反                                                                                                              |

#### 解析 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                    | 标题                                                                                                                                                                   |
|:-----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-55017](https://youtrack.jetbrains.com/issue/KT-55017)* | [在**重载解析**期间，选择派生类中的 Kotlin 属性而非基类中的 Java 字段](#consistent-resolution-order-of-kotlin-properties-and-java-fields-with-the-same-name) |
| [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)  | 使 `invoke` 约定与预期**解糖**一致地工作                                                                                                                        |
| [KT-62866](https://youtrack.jetbrains.com/issue/KT-62866)  | K2：当伴生对象优先于静态**作用域**时，更改**限定符**解析行为                                                                                                    |
| [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)  | 在解析类型并星形导入同名类时，报告**歧义错误**                                                                                                                  |
| [KT-63558](https://youtrack.jetbrains.com/issue/KT-63558)  | K2：迁移 `COMPATIBILITY_WARNING` 周围的解析                                                                                                                    |
| [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)  | 当**依赖类**包含在同一**依赖项**的两个不同版本中时，`CONFLICTING_INHERITED_MEMBERS` 误报                                                                        |
| [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)  | 带有**接收者**的**函数**类型的属性 `invoke` 优先于**扩展****函数** `invoke`                                                                                           |
| [KT-51666](https://youtrack.jetbrains.com/issue/KT-51666)  | **限定** `this`：引入/优先处理带有类型情况的**限定** `this`                                                                                                            |
| [KT-54166](https://youtrack.jetbrains.com/issue/KT-54166)  | 确认类路径中 FQ 名称冲突时的未指定行为                                                                                                                         |
| [KT-64431](https://youtrack.jetbrains.com/issue/KT-64431)  | K2：禁止在导入中使用类型别名作为**限定符**                                                                                                                     |
| [KT-56520](https://youtrack.jetbrains.com/issue/KT-56520)  | K1/K2：类型引用在低级别存在**歧义**时的解析塔工作不正确                                                                                                         |

#### 可见性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                    | 标题                                                                                                                          |
|:-----------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
| [KT-64474](https://youtrack.jetbrains.com/issue/KT-64474/)* | [将无法访问类型的用法**声明**为未指定行为](#forbidden-use-of-inaccessible-generic-types)                                   |
| [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)   | 从内部内联**函数**调用私有类伴生对象成员时，`PRIVATE_CLASS_MEMBER_FROM_INLINE` 误报                                      |
| [KT-58042](https://youtrack.jetbrains.com/issue/KT-58042)   | 如果等效**getter**不可见，即使**覆盖****声明**可见，也使合成属性不可见                                                    |
| [KT-64255](https://youtrack.jetbrains.com/issue/KT-64255)   | 禁止从另一个**模块**的派生类中访问内部**setter**                                                                               |
| [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)   | 禁止从私有内联**函数**中暴露匿名类型                                                                                       |
| [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)   | 禁止从公共 API 内联**函数**中进行隐式非公共 API 访问                                                                     |
| [KT-56310](https://youtrack.jetbrains.com/issue/KT-56310)   | **智能类型转换**不应影响受保护成员的可见性                                                                                 |
| [KT-65494](https://youtrack.jetbrains.com/issue/KT-65494)   | 禁止从公共内联**函数**访问被忽略的私有**操作符****函数**                                                                   |
| [KT-65004](https://youtrack.jetbrains.com/issue/KT-65004)   | K1：`var` 的**setter**（**覆盖**受保护的 `val`）生成为 `public`                                                            |
| [KT-64972](https://youtrack.jetbrains.com/issue/KT-64972)   | 在 Kotlin/**Native** 的链接**编译期**，禁止私有成员的**覆盖**                                                                  |

#### 注解 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                                                       |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| [KT-58723](https://youtrack.jetbrains.com/issue/KT-58723) | 如果注解没有 `EXPRESSION` **目标**，则禁止用该注解标注语句                                                 |
| [KT-49930](https://youtrack.jetbrains.com/issue/KT-49930) | 在 `REPEATED_ANNOTATION` **检测**期间忽略**圆括号**表达式                                                  |
| [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422) | K2：禁止在属性**getter**上使用以 'get' 为**目标**的**use-site**注解                                       |
| [KT-46483](https://youtrack.jetbrains.com/issue/KT-46483) | 禁止在 `where` 子句中的类型**形参**上使用注解                                                              |
| [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299) | 伴生对象注解的解析会忽略伴生**作用域**                                                                     |
| [KT-64654](https://youtrack.jetbrains.com/issue/KT-64654) | K2：引入了用户和编译器所需注解之间的**歧义**                                                              |
| [KT-64527](https://youtrack.jetbrains.com/issue/KT-64527) | 枚举值上的注解不应复制到枚举值类                                                                           |
| [KT-63389](https://youtrack.jetbrains.com/issue/KT-63389) | K2：对包装在 `()？` 中的类型的不兼容注解报告 `WRONG_ANNOTATION_TARGET`                                     |
| [KT-63388](https://youtrack.jetbrains.com/issue/KT-63388) | K2：对 `catch` **形参**类型的注解报告 `WRONG_ANNOTATION_TARGET`                                            |

#### **空安全** {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                   | 标题                                                                                                             |
|:----------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------|
| [KT-54521](https://youtrack.jetbrains.com/issue/KT-54521)* | [弃用 Java 中注解为 Nullable 的数组类型的不安全用法](#improved-null-safety-for-java-primitive-arrays)              |
| [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)  | K2：更改安全调用和约定**操作符**组合的**求值**语义                                                               |
| [KT-50850](https://youtrack.jetbrains.com/issue/KT-50850)  | 父类型顺序**定义**了**继承函数**的**可空性****形参**                                                               |
| [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)  | 在公共签名中近似局部类型时保持**可空性**                                                                         |
| [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)  | 禁止将**可空的****赋值**给非**非空的** Java 字段作为不安全**赋值**的**选择器**                                  |
| [KT-63209](https://youtrack.jetbrains.com/issue/KT-63209)  | 报告警告级别 Java 类型的错误级别**可空实参**缺失的错误                                                         |

#### Java **互操作**性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                                                             |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------|
| [KT-53061](https://youtrack.jetbrains.com/issue/KT-53061) | 禁止源中具有相同 FQ 名称的 Java 和 Kotlin 类                                                                     |
| [KT-49882](https://youtrack.jetbrains.com/issue/KT-49882) | **继承**自 Java **集合**的类根据父类型顺序具有不一致的行为                                                            |
| [KT-66324](https://youtrack.jetbrains.com/issue/KT-66324) | K2：Java 类**继承**自 Kotlin 私有类时的未指定行为                                                                |
| [KT-66220](https://youtrack.jetbrains.com/issue/KT-66220) | 将 Java `vararg` **方法**传递给内联**函数**在**运行时**导致**数组的数组**而不是单个**数组**                          |
| [KT-66204](https://youtrack.jetbrains.com/issue/KT-66204) | 允许在 K-J-K 层次结构中**覆盖**内部成员                                                                          |

#### 属性 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                    | 标题                                                                                                                                              |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-57555](https://youtrack.jetbrains.com/issue/KT-57555)* | [[LC] 禁止延迟初始化带有**幕后字段**的 `open` 属性](#immediate-initialization-of-open-properties-with-backing-fields)                         |
| [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)  | 当没有主**构造函数**或类为局部时，弃用缺失的 `MUST_BE_INITIALIZED`                                                                                |
| [KT-64295](https://youtrack.jetbrains.com/issue/KT-64295)  | 禁止属性上潜在 `invoke` 调用的递归解析                                                                                                              |
| [KT-57290](https://youtrack.jetbrains.com/issue/KT-57290)  | 如果基类来自另一个**模块**，则弃用对不可见派生类的基类属性的**智能类型转换**                                                                          |
| [KT-62661](https://youtrack.jetbrains.com/issue/KT-62661)  | K2：数据类属性缺失 `OPT_IN_USAGE_ERROR`                                                                                                           |

#### 控制流 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                               |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------|
| [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408) | K1 和 K2 之间类初始化**代码块**中 CFA 的规则不一致                                 |
| [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871) | K1/K2 在不带 `else` 分支的**圆括号**条件 `if` 上的不一致性                         |
| [KT-42995](https://youtrack.jetbrains.com/issue/KT-42995) | **作用域****函数**中带有初始化的 `try/catch` **代码块**中 `VAL_REASSIGNMENT` 误报 |
| [KT-65724](https://youtrack.jetbrains.com/issue/KT-65724) | 将数据流信息从 `try` **代码块**传播到 `catch` 和 `finally` **代码块**              |

#### 枚举类 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                                     |
|:---------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| [KT-57608](https://youtrack.jetbrains.com/issue/KT-57608) | 禁止在枚举条目初始化期间访问枚举类的伴生对象                                           |
| [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372) | 报告枚举类中虚内联**方法**的缺失错误                                                     |
| [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802) | 报告属性/字段与枚举条目之间解析的**歧义**                                               |
| [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310) | 伴生属性优先于枚举条目时，更改**限定符**解析行为                                         |

#### **函数式** (SAM) 接口 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                                                    |
|:---------------------------------------------------------|:--------------------------------------------------------------------------------------------------------|
| [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628) | 弃用无需注解便需要 `OptIn` 的 SAM **构造函数**用法                                                      |
| [KT-57014](https://youtrack.jetbrains.com/issue/KT-57014) | 禁止从 lambda 返回带有错误**可空性**的值，用于 JDK **函数**接口的 SAM **构造函数**                        |
| [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342) | 可调用引用**形参**类型的 SAM 转换导致 CCE                                                               |

#### 伴生对象 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                  | 标题                                                                     |
|:---------------------------------------------------------|:-------------------------------------------------------------------------|
| [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316) | 对伴生对象成员的外部调用引用签名无效                                     |
| [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313) | 更改 `(V)::foo` 引用解析，当 V 具有伴生对象时                           |

#### 其他 {initial-collapse-state="collapsed" collapsible="true"}

| 问题 ID                                                    | 标题                                                                                                                                      |
|:-----------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| [KT-59739](https://youtrack.jetbrains.com/issue/KT-59739)* | K2/MPP 在公共代码中的**继承者**的实现位于实际对应方时报告 [ABSTRACT_MEMBER_NOT_IMPLEMENTED]                                                         |
| [KT-49015](https://youtrack.jetbrains.com/issue/KT-49015)  | **限定** `this`：更改潜在标签冲突时的行为                                                                                                               |
| [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)  | 修复 JVM 后端中，Java 子类中意外冲突**重载**情况下的不正确**名字修饰**                                                                              |
| [KT-62019](https://youtrack.jetbrains.com/issue/KT-62019)  | [LC 问题] 禁止在语句位置**声明**带有 `suspend` 标记的匿名**函数**                                                                                    |
| [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)  | OptIn：禁止在标记下进行带有默认**实参**（带有默认值的**形参**）的**构造函数**调用                                                                |
| [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)  | 变量上的表达式和 `invoke` 解析意外允许使用 Unit 转换                                                                                                |
| [KT-55199](https://youtrack.jetbrains.com/issue/KT-55199)  | 禁止将带有适配的可调用引用提升为 `KFunction`                                                                                                        |
| [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)  | [LC] K2 破坏了 `false && ...` 和 `false || ...`                                                                                                     |
| [KT-65682](https://youtrack.jetbrains.com/issue/KT-65682)  | [LC] 弃用 `header`/`impl` 关键字                                                                                                                    |
| [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)  | 默认通过 `invokedynamic + LambdaMetafactory` 生成所有 Kotlin lambda                                                                                 |

## 与 Kotlin 版本的兼容性

以下 Kotlin 版本支持新的 K2 编译器：

| Kotlin release        | Stability level |
|-----------------------|-----------------|
| 2.0.0–%kotlinVersion% | 稳定            |
| 1.9.20–1.9.25         | Beta            |
| 1.9.0–1.9.10          | JVM 是 Beta     |
| 1.7.0–1.8.22          | Alpha           |

## 与 Kotlin **版本库**的兼容性

如果你正在使用 Kotlin/JVM，K2 编译器与使用任何 Kotlin 版本**编译**的**版本库**兼容。

如果你正在使用 Kotlin Multiplatform，K2 编译器保证与使用 Kotlin 版本 1.9.20 及更高版本**编译**的**版本库**兼容。

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

*   Jetpack Compose 1.5.0 编译器插件及更高版本。
*   从 [KSP2](https://android-developers.googleblog.com/2023/12/ksp2-preview-kotlin-k2-standalone.html) 开始支持 Kotlin 符号处理 (KSP)。

> 如果你使用任何其他编译器插件，请**检测**其文档以查看它们是否与 K2 兼容。
>
{style="tip"}

### 升级你的自定义编译器插件

> 自定义编译器插件使用 [**实验性的**](components-stability.md#stability-levels-explained) 插件 API。因此，API 随时可能更改，我们无法保证向后兼容性。
>
{style="warning"}

升级过程根据你拥有的自定义插件类型有两种路径。

#### 仅后端编译器插件

如果你的插件只实现了 `IrGenerationExtension` **扩展点**，则过程与任何其他新编译器版本相同。**检测**你使用的 API 是否有任何更改，并根据需要进行更改。

#### 后端和前端编译器插件

如果你的插件使用了前端相关的**扩展点**，你需要使用新的 K2 编译器 API 重写插件。关于新 API 的简介，请参见 [FIR Plugin API](https://github.com/JetBrains/kotlin/blob/master/docs/fir/fir-plugins.md)。

> 如果你对升级自定义编译器插件有疑问，请加入我们的 [#compiler](https://kotlinlang.slack.com/archives/C7L3JB43G) Slack **频道**，我们将尽力帮助你。
>
{style="note"}

## 分享你对新 K2 编译器的反馈

我们感谢你的任何反馈！

*   在我们的[问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=K2+release+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+k2-release-migration)中报告你在迁移到新 K2 编译器时遇到的任何问题。
*   [**启用发送使用情况统计信息选项**](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)，以允许 JetBrains 收集关于 K2 使用情况的匿名数据。