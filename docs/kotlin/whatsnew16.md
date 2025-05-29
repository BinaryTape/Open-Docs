[//]: # (title: Kotlin 1.6.0 有什么新特性)

_[发布日期：2021年11月16日](releases.md#release-details)_

Kotlin 1.6.0 引入了新的语言特性，对现有特性进行了优化和改进，并对 Kotlin 标准库进行了大量改进。

你还可以在[发布博文](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到这些更改的概览。

## 语言

Kotlin 1.6.0 稳定化了在之前的 1.5.30 版本中引入的几个预览语言特性：
* [针对枚举、密封类和布尔类型主体的稳定穷举 `when` 语句](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [稳定支持挂起函数作为超类型](#stable-suspending-functions-as-supertypes)
* [稳定支持挂起转换](#stable-suspend-conversions)
* [稳定支持注解类的实例化](#stable-instantiation-of-annotation-classes)

它还包括各种类型推断改进和支持对类类型参数进行注解：
* [改进了递归泛型类型的类型推断](#improved-type-inference-for-recursive-generic-types)
* [构建器推断的变更](#changes-to-builder-inference)
* [支持对类类型参数进行注解](#support-for-annotations-on-class-type-parameters)

### 针对枚举、密封类和布尔类型主体的稳定穷举 `when` 语句

一个 _穷举_ [`when`](control-flow.md#when-expressions-and-statements) 语句包含其主体所有可能的类型或值的分支，或者包含某些类型分支以及一个 `else` 分支。它涵盖了所有可能的情况，使你的代码更安全。

我们很快将禁止非穷举的 `when` 语句，以使其行为与 `when` 表达式保持一致。为了确保平滑迁移，Kotlin 1.6.0 会对以枚举、密封类或布尔类型作为主体的非穷举 `when` 语句报告警告。这些警告将在未来版本中变为错误。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall -> 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead 
    when(message.isEmpty()) {
        true -> return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

有关此更改及其影响的更详细解释，请参阅[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-47709)。

### 稳定支持挂起函数作为超类型

挂起函数类型（suspending functional types）的实现已在 Kotlin 1.6.0 中达到[稳定](components-stability.md)。[在 1.5.30 中](whatsnew1530.md#suspending-functions-as-supertypes)提供了预览。

此特性在设计使用 Kotlin 协程并接受挂起函数类型的 API 时非常有用。你现在可以通过将所需行为封装在一个实现挂起函数类型的单独类中来简化代码。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

你现在可以在之前只允许使用 lambda 和挂起函数引用的地方使用此类的实例：`launchOnClick(MyClickAction())`。

目前，由于实现细节，存在两个限制：
* 你不能在超类型列表中混合普通函数类型和挂起函数类型。
* 你不能使用多个挂起函数超类型。

### 稳定支持挂起转换

Kotlin 1.6.0 引入了从常规函数类型到挂起函数类型的[稳定](components-stability.md)转换。从 1.4.0 开始，此特性支持函数字面量和可调用引用。在 1.6.0 中，它适用于任何形式的表达式。作为调用参数，你现在可以将任何适合的常规函数类型表达式作为挂起函数所期望的参数传递。编译器将自动执行隐式转换。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 稳定支持注解类的实例化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes)对 JVM 平台上注解类实例化的实验性支持。在 1.6.0 中，此特性默认适用于 Kotlin/JVM 和 Kotlin/JS。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md) 中了解有关注解类实例化的更多信息。

### 改进了递归泛型类型的类型推断

Kotlin 1.5.30 引入了对递归泛型类型（recursive generic types）的类型推断改进，允许仅根据相应类型参数的上限来推断它们的类型参数。此改进可通过编译器选项启用。在 1.6.0 及更高版本中，此改进默认启用。

```kotlin
// Before 1.5.30
val containerA = PostgreSQLContainer<Nothing>(DockerImageName.parse("postgres:13-alpine")).apply {
  withDatabaseName("db")
  withUsername("user")
  withPassword("password")
  withInitScript("sql/schema.sql")
}

// With compiler option in 1.5.30 or by default starting with 1.6.0
val containerB = PostgreSQLContainer(DockerImageName.parse("postgres:13-alpine"))
  .withDatabaseName("db")
  .withUsername("user")
  .withPassword("password")
  .withInitScript("sql/schema.sql")
```

### 构建器推断的变更

构建器推断（Builder inference）是一种类型推断机制，在调用泛型构建器函数时非常有用。它可以借助其 lambda 参数内调用的类型信息来推断调用的类型参数。

我们正在进行多项更改，使我们更接近于完全稳定的构建器推断。从 1.6.0 开始：
* 你可以在构建器 lambda 内部调用返回尚未推断类型的实例，而无需指定[在 1.5.30 中引入的](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 编译器选项。
* 通过 `-Xenable-builder-inference` 选项，你可以编写自己的构建器而无需应用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 注解。

    > 请注意，这些构建器的客户端需要指定相同的 `-Xenable-builder-inference` 编译器选项。
    >
    {style="warning"}

* 通过 `-Xenable-builder-inference` 选项，如果常规类型推断无法获得关于某个类型的足够信息，构建器推断将自动激活。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference.md)。

### 支持对类类型参数进行注解

对类类型参数进行注解的支持如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有类型参数上的注解都会被发出到 JVM 字节码中，以便注解处理器能够使用它们。

有关其主要用例，请阅读[此 YouTrack 任务](https://youtrack.jetbrains.com/issue/KT-43714)。

了解更多关于[注解](annotations.md)的信息。

## 支持更长时间的旧版 API

从 Kotlin 1.6.0 开始，我们将支持针对三个而非两个之前的 API 版本进行开发，以及当前稳定的版本。目前，我们支持 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

对于 Kotlin/JVM，从 1.6.0 开始，编译器可以生成与 JVM 17 对应的字节码版本的类。新的语言版本还包括优化的委托属性和可重复注解，这些都已在我们的路线图中：
* [针对 1.8 JVM 目标的具有运行时保留策略的可重复注解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [优化调用给定 `KProperty` 实例上的 `get`/`set` 的委托属性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 针对 1.8 JVM 目标的具有运行时保留策略的可重复注解

Java 8 引入了[可重复注解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，它们可以多次应用于单个代码元素。此特性要求 Java 代码中存在两个声明：用 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 标记的可重复注解本身，以及用于保存其值的包含注解。

Kotlin 也有可重复注解，但只需在注解声明上存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重复。在 1.6.0 之前，此特性仅支持 `SOURCE` 保留策略，并且与 Java 的可重复注解不兼容。Kotlin 1.6.0 移除了这些限制。[`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 现在接受任何保留策略，并使该注解在 Kotlin 和 Java 中都可重复。Java 的可重复注解现在也从 Kotlin 侧得到支持。

虽然你可以声明一个包含注解，但这不是必需的。例如：
* 如果一个注解 `@Tag` 被标记为 `@kotlin.annotation.Repeatable`，Kotlin 编译器会自动生成一个名为 `@Tag.Container` 的包含注解类：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 要为包含注解设置自定义名称，请应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解，并传递显式声明的包含注解类作为参数：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射现在通过一个新函数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支持 Kotlin 和 Java 的可重复注解。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md) 中了解有关 Kotlin 可重复注解的更多信息。

### 优化调用给定 `KProperty` 实例上的 `get`/`set` 的委托属性

我们通过省略 `$delegate` 字段并生成对引用属性的直接访问来优化生成的 JVM 字节码。

例如，在以下代码中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成字段 `content$delegate`。`content` 变量的属性访问器直接调用 `impl` 变量，跳过了委托属性的 `getValue`/`setValue` 运算符，从而避免了对 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 类型属性引用对象的需要。

感谢我们的 Google 同事们实现了此功能！

了解更多关于[委托属性](delegated-properties.md)的信息。

## Kotlin/Native

Kotlin/Native 正在获得多项改进和组件更新，其中一些处于预览阶段：
* [新内存管理器的预览](#preview-of-the-new-memory-manager)
* [支持 Xcode 13](#support-for-xcode-13)
* [在任何主机上编译 Windows 目标](#compilation-of-windows-targets-on-any-host)
* [LLVM 和链接器更新](#llvm-and-linker-updates)
* [性能改进](#performance-improvements)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 链接失败的详细错误消息](#detailed-error-messages-for-klib-linkage-failures)
* [重做后的未处理异常处理 API](#reworked-unhandled-exception-handling-api)

### 新内存管理器的预览

> 新的 Kotlin/Native 内存管理器是[实验性](components-stability.md)的。它可能随时被放弃或更改。需要选择启用（详见下文），且仅应将其用于评估目的。我们欢迎你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 提供反馈。
>
{style="warning"}

在 Kotlin 1.6.0 中，你可以尝试新的 Kotlin/Native 内存管理器的开发预览版。这使我们更接近于消除 JVM 和 Native 平台之间的差异，从而在多平台项目中提供一致的开发者体验。

其中一个显著变化是顶层属性的惰性初始化，与 Kotlin/JVM 中类似。当首次访问同一文件中的顶层属性或函数时，顶层属性会被初始化。此模式还包括全局过程间优化（仅针对发布二进制文件启用），它消除了冗余的初始化检查。

我们最近发布了一篇关于新内存管理器的[博文](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。阅读该博文可以了解新内存管理器的当前状态并找到一些演示项目，或者直接跳到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)自行尝试。请检查新内存管理器在你的项目中的工作情况，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 支持 Xcode 13

Kotlin/Native 1.6.0 支持 Xcode 13 —— 最新版本的 Xcode。请随意更新你的 Xcode 并继续为 Apple 操作系统上的 Kotlin 项目工作。

> Xcode 13 中新增的库在 Kotlin 1.6.0 中尚不可用，但我们将在未来的版本中添加对它们的支持。
>
{style="note"}

### 在任何主机上编译 Windows 目标

从 1.6.0 开始，你不再需要 Windows 主机来编译 Windows 目标 `mingwX64` 和 `mingwX86`。它们可以在任何支持 Kotlin/Native 的主机上编译。

### LLVM 和链接器更新

我们重构了 Kotlin/Native 底层使用的 LLVM 依赖。这带来了诸多好处，包括：
* LLVM 版本更新到 11.1.0。
* 依赖大小减小。例如，在 macOS 上，它现在大约是 300 MB，而不是之前版本的 1200 MB。
* [排除了对 `ncurses5` 库的依赖](https://youtrack.jetbrains.com/issue/KT-42693)，该库在现代 Linux 发行版中不可用。

除了 LLVM 更新之外，Kotlin/Native 现在还为 MingGW 目标使用 [LLD](https://lld.llvm.org/) 链接器（一个来自 LLVM 项目的链接器）。与之前使用的 ld.bfd 链接器相比，它提供了各种优势，并将使我们能够提高生成二进制文件的运行时性能，并支持 MinGW 目标的编译器缓存。请注意，LLD [需要用于 DLL 链接的导入库](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在[此 Stack Overflow 帖子](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)中了解更多信息。

### 性能改进

Kotlin/Native 1.6.0 带来了以下性能改进：

* 编译时间：对于 `linuxX64` 和 `iosArm64` 目标，编译器缓存默认启用。这加快了调试模式下的大多数编译（除了第一次）。测量结果显示，在我们的测试项目中，速度提高了约 200%。自 Kotlin 1.5.0 起，这些目标就通过[额外的 Gradle 属性](whatsnew15.md#performance-improvements)提供了编译器缓存；你现在可以移除它们了。
* 运行时：得益于生成的 LLVM 代码中的优化，使用 `for` 循环迭代数组现在快了多达 12%。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

> 将通用 IR 编译器插件 ABI 用于 Kotlin/Native 的选项是[实验性](components-stability.md)的。它可能随时被放弃或更改。需要选择启用（详见下文），且仅应将其用于评估目的。我们欢迎你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 提供反馈。
>
{style="warning"}

在之前的版本中，由于 ABI 的差异，编译器插件的作者必须为 Kotlin/Native 提供单独的制品。

从 1.6.0 开始，Kotlin Multiplatform Gradle 插件能够为 Kotlin/Native 使用可嵌入式编译器 JAR —— 即用于 JVM 和 JS IR 后端的那个。这是朝着统一编译器插件开发体验迈出的一步，因为你现在可以为 Native 和其他受支持的平台使用相同的编译器插件制品。

这是此类支持的预览版本，需要选择启用。要开始为 Kotlin/Native 使用通用编译器插件制品，请将以下行添加到 `gradle.properties` 中：`kotlin.native.useEmbeddableCompilerJar=true`。

我们计划在未来默认使用可嵌入式编译器 JAR 用于 Kotlin/Native，因此我们非常需要了解此预览版本对你的使用情况如何。

如果你是编译器插件的作者，请尝试此模式并检查它是否适用于你的插件。请注意，根据你的插件结构，可能需要迁移步骤。有关迁移说明，请参阅[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48595)，并在评论中留下你的反馈。

### klib 链接失败的详细错误消息

Kotlin/Native 编译器现在为 klib 链接错误提供了详细的错误消息。这些消息现在具有清晰的错误描述，并且还包含了有关可能原因和解决方法的信息。

例如：
* 1.5.30：

    ```text
    e: java.lang.IllegalStateException: IrTypeAliasSymbol expected: Unbound public symbol for public kotlinx.coroutines/CancellationException|null[0]
    <stack trace>
    ```

* 1.6.0：

    ```text
    e: 在 IR 反序列化期间遇到意外类型的符号：IrClassPublicSymbolImpl, kotlinx.coroutines/CancellationException|null[0].
    预期为 IrTypeAliasSymbol。
    
    如果存在两个库，其中一个库是针对另一个库的不同版本编译的，而不是当前项目中使用的版本，则可能会发生这种情况。
    请检查项目配置是否正确并且依赖项版本一致。
    
    依赖于 "org.jetbrains.kotlinx:kotlinx-coroutines-core (org.jetbrains.kotlinx:kotlinx-coroutines-core-macosx64)" 并可能导致冲突的库列表：
    <list of libraries and potential version mismatches>
    
    项目依赖项：
    <dependencies tree>
    ```

### 重做后的未处理异常处理 API

我们统一了 Kotlin/Native 运行时中未处理异常的处理方式，并将默认处理暴露为函数 `processUnhandledException(throwable: Throwable)`，供自定义执行环境（如 `kotlinx.coroutines`）使用。此处理也适用于在 `Worker.executeAfter()` 操作中逸出的异常，但仅限于[新的内存管理器](#preview-of-the-new-memory-manager)。

API 改进也影响了通过 `setUnhandledExceptionHook()` 设置的钩子。以前，当 Kotlin/Native 运行时使用未处理的异常调用钩子后，此类钩子会被重置，并且程序会立即终止。现在这些钩子可以多次使用，如果你希望程序在出现未处理异常时始终终止，则要么不设置未处理异常钩子 (`setUnhandledExceptionHook()`)，要么确保在钩子结束时调用 `terminateWithUnhandledException()`。这将帮助你将异常发送到第三方崩溃报告服务（例如 Firebase Crashlytics），然后终止程序。逸出 `main()` 函数和跨越互操作边界的异常将始终终止程序，即使钩子没有调用 `terminateWithUnhandledException()` 也是如此。

## Kotlin/JS

我们正在继续努力稳定 Kotlin/JS 编译器的 IR 后端。Kotlin/JS 现在具有[禁用下载 Node.js 和 Yarn 的选项](#option-to-use-pre-installed-node-js-and-yarn)。

### 禁用下载 Node.js 和 Yarn 的选项

现在你可以在构建 Kotlin/JS 项目时禁用 Node.js 和 Yarn 的下载，并使用主机上已安装的实例。这对于在没有互联网连接的服务器（例如 CI 服务器）上进行构建非常有用。

要禁用外部组件下载，请将以下行添加到你的 `build.gradle(.kts)` 中：

* Yarn：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // 或者 true 表示默认行为
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
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // 或者 true 表示默认行为
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

在 Kotlin 1.6.0 中，我们将 `KotlinGradleSubplugin` 类的弃用级别更改为 'ERROR'。此类用于编写编译器插件。在接下来的版本中，我们将移除此类。请改用 `KotlinCompilerPluginSupportPlugin` 类。

我们移除了 `kotlin.useFallbackCompilerSearch` 构建选项以及 `noReflect` 和 `includeRuntime` 编译器选项。`useIR` 编译器选项已隐藏，并将在即将发布的版本中移除。

在 Kotlin Gradle 插件中了解更多关于[当前支持的编译器选项](gradle-compiler-options.md)的信息。

## 标准库

新的 1.6.0 标准库版本稳定了实验性特性，引入了新特性，并统一了其在各个平台上的行为：

* [新的 `readline` 函数](#new-readline-functions)
* [稳定的 `typeOf()`](#stable-typeof)
* [稳定的集合构建器](#stable-collection-builders)
* [稳定的 Duration API](#stable-duration-api)
* [将 Regex 拆分为序列](#splitting-regex-into-a-sequence)
* [整数的位旋转操作](#bit-rotation-operations-on-integers)
* [JS 中 `replace()` 和 `replaceFirst()` 的变更](#changes-for-replace-and-replacefirst-in-js)
* [对现有 API 的改进](#improvements-to-the-existing-api)
* [弃用](#deprecations)

### 新的 `readline` 函数

Kotlin 1.6.0 提供了用于处理标准输入的新函数：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函数仅适用于 JVM 和 Native 目标平台。
>
{style="note"}

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 从标准输入读取一行并返回，如果已到达文件末尾，则抛出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 从标准输入读取一行并返回，如果已到达文件末尾，则返回 `null`。 |

我们相信，消除在读取一行时使用 `!!` 的需求将改善新手体验并简化 Kotlin 教学。为了使读取行操作的名称与其 `println()` 对应项保持一致，我们决定将新函数的名称缩短为 'ln'。

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

在你的 IDE 代码补全中，现有的 `readLine()` 函数的优先级将低于 `readln()` 和 `readlnOrNull()`。IDE 检查也将建议使用新函数而不是旧版 `readLine()`。

我们计划在未来版本中逐步弃用 `readLine()` 函数。

### 稳定的 `typeOf()`

1.6.0 版本带来了[稳定](components-stability.md)的 [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数，完成了[主要路线图项目](https://youtrack.jetbrains.com/issue/KT-45396)之一。

[自 1.3.40 起](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台上作为实验性 API 提供。现在你可以在任何 Kotlin 平台上使用它，并获取编译器可以推断的任何 Kotlin 类型的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示形式：

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

在 Kotlin 1.6.0 中，集合构建器函数已升级为[稳定](components-stability.md)。集合构建器返回的集合现在在其只读状态下是可序列化的。

你现在可以不使用选择启用注解就使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)：

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

用于表示不同时间单位时长数量的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类已升级为[稳定](components-stability.md)。在 1.6.0 中，Duration API 进行了以下更改：

* 将时长分解为天、小时、分钟、秒和纳秒的 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的第一个组件现在是 `Long` 类型而不是 `Int`。以前，如果值不适合 `Int` 范围，它会被强制转换为该范围。使用 `Long` 类型，你可以分解时长范围内的任何值，而不会截断不适合 `Int` 的值。

* `DurationUnit` 枚举现在是独立的，而不是 JVM 上的 `java.util.concurrent.TimeUnit` 的类型别名。我们没有发现任何令人信服的案例表明 `typealias DurationUnit = TimeUnit` 可能有用。此外，通过类型别名暴露 `TimeUnit` API 可能会使 `DurationUnit` 用户感到困惑。

* 为了响应社区反馈，我们正在重新引入 `Int.seconds` 这样的扩展属性。但我们希望限制它们的适用性，因此我们将它们放入 `Duration` 伴生对象中。虽然 IDE 仍然可以在完成时建议扩展并自动从伴生对象插入导入，但将来我们计划将此行为限制在预期 `Duration` 类型的情况下。

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
  
  我们建议用 `Duration.Companion` 中的新扩展替换之前引入的伴生函数（例如 `Duration.seconds(Int)`）和已弃用的顶层扩展（例如 `Int.seconds`）。

  > 此类替换可能会导致旧的顶层扩展与新的伴生扩展之间产生歧义。
  > 在进行自动化迁移之前，请务必使用 `kotlin.time` 包的通配符导入——`import kotlin.time.*`。
  >
  {style="note"}

### 将 Regex 拆分为序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函数已升级为[稳定](components-stability.md)。它们根据给定正则表达式的匹配项来拆分字符串，但将结果作为[序列](sequences.md)返回，以便对此结果的所有操作都延迟执行：

```kotlin
fun main() {
//sampleStart
    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5" validate="false"}

### 整数的位旋转操作

在 Kotlin 1.6.0 中，用于位操作的 `rotateLeft()` 和 `rotateRight()` 函数已达到[稳定](components-stability.md)。这些函数将数字的二进制表示向左或向右旋转指定的位数：

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

### JS 中 `replace()` 和 `replaceFirst()` 的变更

在 Kotlin 1.6.0 之前，当替换字符串包含组引用时，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函数在 Java 和 JS 中的行为有所不同。为了使所有目标平台上的行为保持一致，我们更改了它们在 JS 中的实现。

替换字符串中 `${name}` 或 `$index` 的出现会被替换为与具有指定索引或名称的捕获组对应的子序列：
* `$index` – '`$`' 后的第一个数字始终被视为组引用的一部分。只有当后续数字形成有效的组引用时，它们才会被纳入 `index`。只有数字 '0'-'9' 被视为组引用的潜在组成部分。请注意，捕获组的索引从 '1' 开始。索引为 '0' 的组代表整个匹配项。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或数字 '0'–'9' 组成。第一个字符必须是字母。

    > 替换模式中的命名组目前仅在 JVM 上支持。
    >
    {style="note"}

* 要在替换字符串中包含后续字符作为字面量，请使用反斜杠字符 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替换字符串必须被视为字面量字符串，你可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 对现有 API 的改进

* 1.6.0 版本为 `Comparable.compareTo()` 添加了中缀扩展函数。你现在可以使用中缀形式来比较两个对象的顺序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 现在也变为非内联（non-inline）以统一其在所有平台上的实现。
* `String` 类的 `compareTo()` 和 `equals()` 函数，以及 `CharSequence` 类的 `isBlank()` 函数现在在 JS 中的行为与在 JVM 中的行为完全一致。之前，在处理非 ASCII 字符时存在偏差。

### 弃用

在 Kotlin 1.6.0 中，我们开始对一些仅限 JS 的标准库 API 发出警告，启动弃用周期。

#### `concat()`、`match()` 和 `matches()` 字符串函数

* 要将字符串与给定其他对象的字符串表示形式连接起来，请使用 `plus()` 而不是 `concat()`。
* 要在输入中查找正则表达式的所有出现项，请使用 Regex 类的 `findAll()` 而不是 `String.match(regex: String)`。
* 要检查正则表达式是否匹配整个输入，请使用 Regex 类的 `matches()` 而不是 `String.matches(regex: String)`。

#### 数组上接受比较函数的 `sort()`

我们已弃用 `Array<out T>.sort()` 函数以及内联函数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，这些函数按照比较函数传递的顺序对数组进行排序。请使用其他标准库函数进行数组排序。

请参阅[集合排序](collection-ordering.md)部分以供参考。

## 工具

### Kover – 一个 Kotlin 代码覆盖工具

> Kover Gradle 插件是实验性的。我们欢迎你通过 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 提供反馈。
>
{style="warning"}

在 Kotlin 1.6.0 中，我们引入了 Kover —— 一个用于 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 代码覆盖代理的 Gradle 插件。它适用于所有语言结构，包括内联函数。

在 Kover 的 [GitHub 仓库](https://github.com/Kotlin/kotlinx-kover)或此视频中了解更多信息：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已发布，包含多项特性和改进：

* 支持[新的 Kotlin/Native 内存管理器](#preview-of-the-new-memory-manager)
* 引入了调度器 _视图_ API，它允许限制并行性而无需创建额外的线程
* 从 Java 6 迁移到 Java 8 目标
* `kotlinx-coroutines-test` 具有新的重做 API 和多平台支持
* 引入了 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它为协程提供了对 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 变量的线程安全写入访问

在[更新日志](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)中了解更多信息。

## 迁移到 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 一旦可用，将建议将 Kotlin 插件更新到 1.6.0。

要将现有项目迁移到 Kotlin 1.6.0，请将 Kotlin 版本更改为 `1.6.0` 并重新导入你的 Gradle 或 Maven 项目。[了解如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 开始新项目，请更新 Kotlin 插件并从 **File** | **New** | **Project** 运行项目向导。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)下载。

Kotlin 1.6.0 是一个[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能会带来与你为早期语言版本编写的代码不兼容的更改。在 [Kotlin 1.6 兼容性指南](compatibility-guide-16.md)中查找此类更改的详细列表。