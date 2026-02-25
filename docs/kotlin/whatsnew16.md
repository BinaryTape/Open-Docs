[//]: # (title: Kotlin 1.6.0 的最新变化)

<web-summary>阅读 Kotlin 1.6.0 发行说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 的更新，以及对 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2021 年 11 月 16 日](releases.md#release-history)_

Kotlin 1.6.0 引入了新的语言功能、对现有功能的优化和改进，以及对 Kotlin 标准库的大量改进。

您还可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到这些变化的概览。

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 语言

Kotlin 1.6.0 为上一个 1.5.30 版本中引入预览的多个语言功能带来了稳定版：
* [适用于枚举、密封和布尔受体的稳定穷举 when 语句](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [稳定的挂起函数作为超类型](#stable-suspending-functions-as-supertypes)
* [稳定的挂起转换](#stable-suspend-conversions)
* [稳定的注解类实例化](#stable-instantiation-of-annotation-classes)

它还包括各种类型推断改进以及对类类型形参上注解的支持：
* [改进了递归泛型类型的类型推断](#improved-type-inference-for-recursive-generic-types)
* [构建器推断的变化](#changes-to-builder-inference)
* [支持类类型形参上的注解](#support-for-annotations-on-class-type-parameters)

### 稳定的穷举 when 语句（适用于枚举、密封和布尔受体）

一个 _穷举性_ (Exhaustive) [`when`](control-flow.md#when-expressions-and-statements) 语句包含其受体的所有可能类型或值的分支，或者包含某些类型加上一个 `else` 分支。它涵盖了所有可能的情况，使您的代码更安全。

我们很快将禁止非穷举的 `when` 语句，以使其行为与 `when` 表达式保持一致。为了确保平稳迁移，Kotlin 1.6.0 会针对带有枚举、密封或布尔受体的非穷举 `when` 语句报告警告。这些警告将在未来的版本中变为错误。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // 错误：'when' 表达式必须是穷举的
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // 从 1.6.0 开始

    // 警告：布尔值上的非穷举 'when' 语句将在 1.7 中被禁止，
    // 请改为添加 'false' 分支或 'else' 分支 
    when(message.isEmpty()) {
        true -> return
    }
    // 警告：密封类/接口上的非穷举 'when' 语句将在 1.7 中被禁止，
    // 请改为添加 'is TextMessage' 分支或 'else' 分支
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

有关此更改及其影响的更详细说明，请参阅[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-47709)。

### 稳定的挂起函数作为超类型

挂起函数类型的实现已在 Kotlin 1.6.0 中达到[稳定](components-stability.md)。预览版已在 [1.5.30 中提供](whatsnew1530.md#suspending-functions-as-supertypes)。

在设计使用 Kotlin 协程并接受挂起函数类型的 API 时，此功能非常有用。您现在可以通过将所需的行为封闭在实现挂起函数类型的单独类中来简化代码。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

您可以在以前仅允许 lambda 和挂起函数引用的地方使用此类的实例：`launchOnClick(MyClickAction())`。

目前由于实现细节存在两个限制：
* 您不能在超类型列表中混合使用普通函数类型和挂起函数类型。
* 您不能使用多个挂起函数超类型。

### 稳定的挂起转换

Kotlin 1.6.0 引入了从普通函数类型到挂起函数类型的[稳定](components-stability.md)转换。从 1.4.0 开始，该功能支持函数文字和可调用引用。在 1.6.0 中，它适用于任何形式的表达式。作为调用实参，您现在可以传递任何合适的普通函数类型的表达式，即使预期的是挂起函数。编译器将自动执行隐式转换。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // 确定
    getSuspending(::suspending) // 确定
    getSuspending(regular)      // 确定
}
```

### 稳定的注解类实例化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes)在 JVM 平台上实例化注解类的实验性支持。在 1.6.0 中，该功能在 Kotlin/JVM 和 Kotlin/JS 中均默认可用。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解有关注解类实例化的更多信息。

### 改进了递归泛型类型的类型推断

Kotlin 1.5.30 引入了对递归泛型类型推断的改进，允许仅根据相应类型形参的上界来推断其类型实参。该改进曾通过编译器选项提供。在 1.6.0 及更高版本中，它默认启用。

```kotlin
// 1.5.30 之前
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// 在 1.5.30 中使用编译器选项，或从 1.6.0 开始默认启用
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 构建器推断的变化

构建器推断是一种类型推断风格，在调用泛型构建器函数时非常有用。它可以借助其 lambda 实参内部调用的类型信息来推断调用的类型实参。

我们正在进行多项更改，使我们更接近完全稳定的构建器推断。从 1.6.0 开始：
* 您可以在构建器 lambda 内部进行返回尚未推断类型的实例的调用，而无需指定 [1.5.30 中引入的](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 编译器选项。
* 通过 `-Xenable-builder-inference`，您可以编写自己的构建器而无需应用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 注解。

    > 请注意，这些构建器的客户端将需要指定相同的 `-Xenable-builder-inference` 编译器选项。
    >
    {style="warning"}

* 通过 `-Xenable-builder-inference`，如果常规类型推断无法获得足够的类型信息，构建器推断将自动激活。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference.md)。

### 支持类类型形参上的注解

对类类型形参上注解的支持如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有类型形参上的注解都会被发射到 JVM 字节码中，以便注解处理器能够使用它们。

有关此用例的初衷，请阅读此 [YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-43714)。

了解有关[注解](annotations.md)的更多信息。

## 更长时间地支持之前的 API 版本

从 Kotlin 1.6.0 开始，我们将支持三个之前的 API 版本开发，而不是两个，同时支持当前的稳定版本。目前，我们支持 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

对于 Kotlin/JVM，从 1.6.0 开始，编译器可以生成对应于 JVM 17 字节码版本的类。新的语言版本还包括优化的委托属性和可重复注解，这些都在我们的路线图中：
* [针对 1.8 JVM 目标的具有运行时保留策略的可重复注解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [优化在给定 KProperty 实例上调用 get/set 的委托属性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 针对 1.8 JVM 目标的具有运行时保留策略的可重复注解

Java 8 引入了[可重复注解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，可以多次应用于单个代码元素。该功能要求 Java 代码中存在两个声明：标记有 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 的可重复注解本身，以及用于保存其值的包含注解。

Kotlin 也有可重复注解，但仅要求注解声明上存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重复。在 1.6.0 之前，该功能仅支持 `SOURCE` 保留策略，并且与 Java 的可重复注解不兼容。Kotlin 1.6.0 移除了这些限制。`@kotlin.annotation.Repeatable` 现在接受任何保留策略，并使注解在 Kotlin 和 Java 中都是可重复的。现在 Kotlin 侧也支持 Java 的可重复注解。

虽然您可以声明一个包含注解，但这不是必需的。例如：
* 如果注解 `@Tag` 标记有 `@kotlin.annotation.Repeatable`，Kotlin 编译器会自动以 `@Tag.Container` 的名称生成一个包含注解类：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // 编译器生成 @Tag.Container 包含注解
    ```

* 要为包含注解设置自定义名称，请应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解，并将显式声明的包含注解类作为实参传递：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射现在通过一个新函数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 同时支持 Kotlin 和 Java 的可重复注解。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解有关 Kotlin 可重复注解的更多信息。

### 优化在给定 KProperty 实例上调用 get/set 的委托属性

我们通过省略 `$delegate` 字段并生成对引用属性的即时访问，优化了生成的 JVM 字节码。

例如，在以下代码中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成 `content$delegate` 字段。`content` 变量的属性访问器直接调用 `impl` 变量，跳过委托属性的 `getValue`/`setValue` 运算符，从而避免了对 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 类型的属性引用对象的需求。

感谢我们的 Google 同事提供的实现！

了解有关[委托属性](delegated-properties.md)的更多信息。

## Kotlin/Native

Kotlin/Native 正在接受多项改进和组件更新，其中一些处于预览状态：
* [新内存管理器的预览](#preview-of-the-new-memory-manager)
* [对 Xcode 13 的支持](#support-for-xcode-13)
* [在任何主机上编译 Windows 目标](#compilation-of-windows-targets-on-any-host)
* [LLVM 和链接器更新](#llvm-and-linker-updates)
* [性能改进](#performance-improvements)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 链接失败的详细错误消息](#detailed-error-messages-for-klib-linkage-failures)
* [重新设计的未处理异常处理 API](#reworked-unhandled-exception-handling-api)

### 新内存管理器的预览

> 新的 Kotlin/Native 内存管理器是[实验性的](components-stability.md)。它可能随时被放弃或更改。需要选择性加入（详见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 上提供反馈。
>
{style="warning"}

在 Kotlin 1.6.0 中，您可以尝试新的 Kotlin/Native 内存管理器的开发预览版。它使我们更接近于消除 JVM 和 Native 平台之间的差异，从而在多平台项目中提供一致的开发者体验。

其中一个显著的变化是顶级属性的延迟初始化，就像在 Kotlin/JVM 中一样。当首次访问同一文件中的顶级属性或函数时，顶级属性会被初始化。此模式还包括全局过程间优化（仅为发布版二进制文件启用），它可以移除冗余的初始化检查。

我们最近发布了一篇关于新内存管理器的[博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。阅读它可以了解新内存管理器的当前状态并找到一些示例项目，或者直接跳转到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)亲自尝试。请检查新内存管理器在您的项目中的运行情况，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 对 Xcode 13 的支持

Kotlin/Native 1.6.0 支持 Xcode 13 —— Xcode 的最新版本。请随意更新您的 Xcode，并继续在您的 Apple 操作系统 Kotlin 项目上工作。

> Xcode 13 中添加的新库在 Kotlin 1.6.0 中不可用，但我们将在后续版本中添加对它们的支持。
>
{style="note"}

### 在任何主机上编译 Windows 目标

从 1.6.0 开始，您不需要 Windows 主机来编译 Windows 目标 `mingwX64` 和 `mingwX86`。它们可以在任何支持 Kotlin/Native 的主机上进行编译。

### LLVM 和链接器更新

我们重新设计了 Kotlin/Native 在后台使用的 LLVM 依赖项。这带来了各种好处，包括：
* 将 LLVM 版本更新为 11.1.0。
* 减小了依赖项大小。例如，在 macOS 上，它现在约为 300 MB，而上一个版本约为 1200 MB。
* [排除了对 `ncurses5` 库的依赖](https://youtrack.jetbrains.com/issue/KT-42693)，该库在现代 Linux 发行版中不可用。

除了 LLVM 更新外，Kotlin/Native 现在为 MingGW 目标使用 [LLD](https://lld.llvm.org/) 链接器（来自 LLVM 项目的链接器）。它比以前使用的 ld.bfd 链接器具有各种优势，并将允许我们提高生成的二进制文件的运行时性能，并支持 MinGW 目标的编译器缓存。请注意，LLD [要求 DLL 链接使用导入库](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在[此 Stack Overflow 线程](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)中了解更多信息。

### 性能改进

Kotlin/Native 1.6.0 提供了以下性能改进：

* 编译时间：`linuxX64` 和 `iosArm64` 目标默认启用编译器缓存。这加速了调试模式下的大多数编译（第一次除外）。测量显示，在我们的测试项目中速度提高了约 200%。自 Kotlin 1.5.0 以来，这些目标可以通过 [额外的 Gradle 属性](whatsnew15.md#performance-improvements) 使用编译器缓存；您现在可以删除它们了。 
* 运行时：由于生成的 LLVM 代码经过了优化，使用 `for` 循环遍历数组现在的速度提高了多达 12%。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

> 为 Kotlin/Native 使用通用 IR 编译器插件 ABI 的选项是[实验性的](components-stability.md)。它可能随时被放弃或更改。需要选择性加入（详见下文），且您应仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 上提供反馈。
>
{style="warning"}

在以前的版本中，由于 ABI 的差异，编译器插件的作者必须为 Kotlin/Native 提供单独的构件。

从 1.6.0 开始，Kotlin Multiplatform Gradle 插件能够为 Kotlin/Native 使用可嵌入的编译器 jar —— 即用于 JVM 和 JS IR 后端的那个。这是迈向统一编译器插件开发体验的一步，因为您现在可以为 Native 和其他受支持的平台使用相同的编译器插件构件。

这是此类支持的预览版本，需要选择性加入。要开始为 Kotlin/Native 使用通用的编译器插件构件，请将以下行添加到 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我们计划未来默认在 Kotlin/Native 中使用可嵌入的编译器 jar，因此听取预览版对您的运行情况对我们至关重要。

如果您是编译器插件的作者，请尝试此模式并检查它是否适用于您的插件。请注意，根据插件的结构，可能需要迁移步骤。请参阅[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48595)获取迁移说明，并在评论中留下您的反馈。

### klib 链接失败的详细错误消息

Kotlin/Native 编译器现在为 klib 链接错误提供详细的错误消息。这些消息现在具有清晰的错误描述，还包括有关可能原因和解决办法的信息。

例如：
* 1.5.30：

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0：

    ```text
    e: The symbol of unexpected type encountered during IR deserialization: IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    IrTypeAliasSymbol is expected.
    
    This could happen if there are two libraries, where one library was compiled against the different version of the other library than the one currently used in the project.
    Please check that the project configuration is correct and has consistent versions of dependencies.
    
    The list of libraries that depend on "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" and may lead to conflicts:
    <list of libraries and potential version mismatches>
    
    Project dependencies:
    <dependencies tree>
    ```

### 重新设计的未处理异常处理 API

我们统一了整个 Kotlin/Native 运行时中未处理异常的处理方式，并将默认处理作为 `processUnhandledException(throwable: Throwable)` 函数公开，供自定义执行环境（如 `kotlinx.coroutines`）使用。此处理也适用于从 `Worker.executeAfter()` 操作中逃逸的异常，但仅适用于新的 [内存管理器](#preview-of-the-new-memory-manager)。

API 改进也影响了由 `setUnhandledExceptionHook()` 设置的钩子。以前，此类钩子在 Kotlin/Native 运行时使用未处理异常调用钩子后会被重置，并且程序总是在之后立即终止。现在这些钩子可以多次使用，如果您希望程序始终在发生未处理异常时终止，请不要设置未处理异常钩子 (`setUnhandledExceptionHook()`)，或者确保在钩子末尾调用 `terminateWithUnhandledException()`。这将帮助您将异常发送给第三方崩溃报告服务（如 Firebase Crashlytics），然后终止程序。从 `main()` 逃逸的异常和跨越互操作边界的异常将始终终止程序，即使钩子没有调用 `terminateWithUnhandledException()`。

## Kotlin/JS

我们正继续致力于稳定 Kotlin/JS 编译器的 IR 后端。Kotlin/JS 现在具有一个 [禁用下载 Node.js 和 Yarn 的选项](#option-to-use-pre-installed-node-js-and-yarn)。

### 选项以使用预安装的 Node.js 和 Yarn

您现在可以在构建 Kotlin/JS 项目时禁用 Node.js 和 Yarn 的下载，并使用主机上已经安装的实例。这对于在没有互联网连接的服务器（如 CI 服务器）上进行构建非常有用。

要禁用下载外部组件，请将以下行添加到您的 `build.gradle(.kts)`：

* Yarn：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // 或 true 以使用默认行为
    }
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

* Node.js：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // 或 true 以使用默认行为
    }
     
    ```
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </tab>
    </tabs>

## Kotlin Gradle 插件

在 Kotlin 1.6.0 中，我们将 `KotlinGradleSubplugin` 类的弃用级别更改为 'ERROR'。该类曾用于编写编译器插件。在后续版本中，我们将删除此类。请改用 `KotlinCompilerPluginSupportPlugin` 类。

我们移除了 `kotlin.useFallbackCompilerSearch` 构建选项以及 `noReflect` 和 `includeRuntime` 编译器选项。`useIR` 编译器选项已被隐藏，并将在后续版本中移除。

详细了解 Kotlin Gradle 插件中 [当前支持的编译器选项](gradle-compiler-options.md)。

## 标准库

新的 1.6.0 版本标准库稳定了实验性功能，引入了新功能，并统一了其在各平台上的行为：

* [新的 readline 函数](#new-readline-functions)
* [稳定的 typeOf()](#stable-typeof)
* [稳定的集合构建器](#stable-collection-builders)
* [稳定的 Duration API](#stable-duration-api)
* [将 Regex 拆分为序列](#splitting-regex-into-a-sequence)
* [整数上的位旋转操作](#bit-rotation-operations-on-integers)
* [JS 中 replace() 和 replaceFirst() 的更改](#changes-for-replace-and-replacefirst-in-js)
* [对现有 API 的改进](#improvements-to-the-existing-api)
* [弃用](#deprecations)

### 新的 readline 函数

Kotlin 1.6.0 提供了处理标准输入的新函数：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函数仅适用于 JVM 和 Native 目标平台。
>
{style="note"}

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 从 stdin 读取一行并返回，如果已到达 EOF，则抛出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 从 stdin 读取一行并返回，如果已到达 EOF，则返回 `null`。 |

我们相信，在读取一行时消除使用 `!!` 的需求将改善新手的体验并简化 Kotlin 教学。为了使读取行操作的名称与其 `println()` 对应项保持一致，我们决定将新函数的名称缩短为 'ln'。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {
//sampleStart
    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

在 IDE 代码补全中，现有的 `readLine()` 函数的优先级将低于 `readln()` 和 `readlnOrNull()`。IDE 检查还将建议使用新函数而不是旧有的 `readLine()`。

我们计划在未来版本中逐步弃用 `readLine()` 函数。

### 稳定的 typeOf()

1.6.0 版本带来了[稳定的](components-stability.md) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数，完成了一项[主要的路线图项目](https://youtrack.jetbrains.com/issue/KT-45396)。

[自 1.3.40 起](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 已作为实验性 API 在 JVM 平台上提供。现在您可以在任何 Kotlin 平台中使用它，并获得编译器可以推断的任何 Kotlin 类型的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示：

```kotlin
inline fun <reified T> renderType(): String {
    val type = typeOf<T>()
    return type.toString()
}

fun main() {
    val fromExplicitType = typeOf<Int>()
    val fromReifiedType = renderType<List<Int>>()
}
```

### 稳定的集合构建器

在 Kotlin 1.6.0 中，集合构建器函数已提升为[稳定版](components-stability.md)。集合构建器返回的集合现在在其只读状态下是可序列化的。

您现在可以无需选择性加入注解即可使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)：

```kotlin
fun main() {
//sampleStart
    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 稳定的 Duration API

用于表示不同时间单位的时间量值的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类已提升为[稳定版](components-stability.md)。在 1.6.0 中，Duration API 进行了以下更改：

* [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的第一个组件（将持续时间分解为天、小时、分钟、秒和纳秒）现在采用 `Long` 类型而不是 `Int`。以前，如果值不符合 `Int` 范围，它会被强制转换为该范围。通过 `Long` 类型，您可以分解持续时间范围内的任何值，而不会截断不符合 `Int` 的值。

* `DurationUnit` 枚举现在是独立的，在 JVM 上不是 `java.util.concurrent.TimeUnit` 的类型别名。我们没有发现任何具有 `typealias DurationUnit = TimeUnit` 可能会有用的令人信服的案例。此外，通过类型别名暴露 `TimeUnit` API 可能会混淆 `DurationUnit` 用户。

* 响应社区反馈，我们将带回诸如 `Int.seconds` 之类的扩展属性。但我们希望限制它们的适用性，因此我们将它们放在 `Duration` 类的伴生对象中。虽然 IDE 仍可以在补全中提议扩展并自动从伴生对象中插入导入，但未来我们计划将此行为限制在预期 `Duration` 类型的情况下。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {
  //sampleStart
      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds
  //sampleEnd
  }
  ```
  {kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}
  
  我们建议使用 `Duration.Companion` 中的新扩展替换之前引入的伴生函数（如 `Duration.seconds(Int)`）和弃用的顶级扩展（如 `Int.seconds`）。

  > 此类替换可能会导致旧的顶级扩展和新的伴生扩展之间产生歧义。在进行自动迁移之前，请务必使用 kotlin.time 软件包的通配符导入 —— `import kotlin.time.*`。
  >
  {style="note"}

### 将 Regex 拆分为序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函数已提升为[稳定版](components-stability.md)。它们围绕给定正则表达式的匹配项拆分字符串，但将结果作为 [序列](sequences.md) 返回，以便对此结果的所有操作都是延迟执行的：

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // 或者
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整数上的位旋转操作

在 Kotlin 1.6.0 中，用于位操作的 `rotateLeft()` 和 `rotateRight()` 函数已变为[稳定版](components-stability.md)。这些函数将数字的二进制表示向左或向右旋转指定的位数：

```kotlin
fun main() {
//sampleStart
    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

### JS 中 replace() 和 replaceFirst() 的更改

在 Kotlin 1.6.0 之前，当替换字符串包含组引用时，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) 正则表达式函数在 Java 和 JS 中的行为不同。为了使行为在所有目标平台上保持一致，我们更改了它们在 JS 中的实现。

替换字符串中出现的 `${name}` 或 `$index` 将被替换为与具有指定索引或名称的捕获组相对应的子序列：
* `$index` – '后的第一个数字总是被视为组引用的一部分。后续数字只有在形成有效的组引用时才会并入 `index`。只有数字 '0'–'9' 被视为组引用的潜在组件。请注意，捕获组的索引从 '1' 开始。索引为 '0' 的组代表整个匹配。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或数字 '0'–'9' 组成。第一个字符必须是字母。

    > 替换模式中的命名组目前仅在 JVM 上受支持。
    >
    {style="note"}

* 要将后续字符作为字面量包含在替换字符串中，请使用反斜杠字符 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替换字符串必须被视为字面量字符串，您可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 对现有 API 的改进

* 1.6.0 版本为 `Comparable.compareTo()` 添加了中缀扩展函数。您现在可以使用中缀形式来比较两个对象的大小：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 现在也不是内联的，以统一其在所有平台上的实现。
* `compareTo()` 和 `equals()` String 函数，以及 `isBlank()` CharSequence 函数现在在 JS 中的行为与在 JVM 上的行为完全相同。以前在涉及非 ASCII 字符时存在偏差。

### 弃用

在 Kotlin 1.6.0 中，我们开始对一些仅限 JS 的标准库 API 进行带警告的弃用周期。

#### concat()、match() 和 matches() 字符串函数

* 要将字符串与给定其他对象的字符串表示形式连接，请使用 `plus()` 而不是 `concat()`。
* 要在输入中查找正则表达式的所有匹配项，请使用 Regex 类的 `findAll()` 而不是 `String.match(regex: String)`。
* 要检查正则表达式是否匹配整个输入，请使用 Regex 类的 `matches()` 而不是 `String.matches(regex: String)`。

#### 接受比较函数的数组 sort()

我们弃用了 `Array<out T>.sort()` 函数以及内联函数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，这些函数按照比较函数传递的顺序对数组进行排序。请使用其他标准库函数进行数组排序。

参考 [集合排序](collection-ordering.md) 部分。

## 工具

### Kover – 针对 Kotlin 的代码覆盖率工具

> Kover Gradle 插件是实验性的。我们欢迎您在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 上提供反馈。
>
{style="warning"}

在 Kotlin 1.6.0 中，我们引入了 Kover —— 一个针对 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 代码覆盖率代理的 Gradle 插件。它适用于所有语言结构，包括内联函数。

在 [GitHub 仓库](https://github.com/Kotlin/kotlinx-kover) 或此视频中了解有关 Kover 的更多信息：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – 代码覆盖率插件"/>

## 协程 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已经发布，具有多项功能和改进：

* 支持 [新的 Kotlin/Native 内存管理器](#preview-of-the-new-memory-manager)
* 引入了调度器 _视图_ API，允许在不创建额外线程的情况下限制并行性
* 从 Java 6 迁移到 Java 8 目标
* 具有全新重新设计的 API 和多平台支持的 `kotlinx-coroutines-test`
* 引入了 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它为协程提供了对 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 变量的线程安全写访问权

在 [更新日志](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 中了解更多信息。

## 迁移到 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 将在 Kotlin 插件 1.6.0 可用时建议更新。

要将现有项目迁移到 Kotlin 1.6.0，请将 Kotlin 版本更改为 `1.6.0` 并重新导入您的 Gradle 或 Maven 项目。[了解如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 启动新项目，请更新 Kotlin 插件并从 **文件 (File)** | **新建 (New)** | **项目 (Project)** 运行项目向导。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0) 下载。

Kotlin 1.6.0 是一个 [特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与您为早期语言版本编写的代码不兼容的更改。在 [Kotlin 1.6 兼容性指南](compatibility-guide-16.md) 中查找此类更改的详细列表。