[//]: # (title: Kotlin 1.6.0 新特性)

[发布日期：2021 年 11 月 16 日](releases.md#release-details)

Kotlin 1.6.0 引入了新的语言特性、对现有特性的优化和改进，以及对 Kotlin 标准库的诸多改进。

你也可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到这些变更的概述。

## 语言

Kotlin 1.6.0 将在上一个 1.5.30 版本中作为预览引入的若干语言特性提升至稳定版：
* [枚举、密封类和布尔类型主体的稳定穷尽式 when 语句](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [作为超类型的稳定挂起函数](#stable-suspending-functions-as-supertypes)
* [稳定的挂起转换](#stable-suspend-conversions)
* [注解类的稳定实例化](#stable-instantiation-of-annotation-classes)

它还包括各种类型推断改进以及对类类型形参的注解支持：
* [递归泛型类型的改进类型推断](#improved-type-inference-for-recursive-generic-types)
* [构建器推断的变更](#changes-to-builder-inference)
* [类类型形参的注解支持](#support-for-annotations-on-class-type-parameters)

### 枚举、密封类和布尔类型主体的稳定穷尽式 when 语句

一个_穷尽式_ [`when`](control-flow.md#when-expressions-and-statements) 语句包含针对其主体所有可能的类型或值的分支，或者针对某些类型加上一个 `else` 分支。它涵盖了所有可能的情况，使你的代码更安全。

我们很快将禁止非穷尽式 `when` 语句，以使其行为与 `when` 表达式保持一致。为确保平稳迁移，Kotlin 1.6.0 会对使用枚举、密封类或布尔类型主体的非穷尽式 `when` 语句报告警告。这些警告将在未来版本中变为错误。

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

    // 警告：针对布尔类型的非穷尽式 'when' 语句将在 1.7 中被禁止，请添加 'false' 分支或 'else' 分支
    when(message.isEmpty()) {
        true -> return
    }
    // 警告：针对密封类/接口的非穷尽式 'when' 语句将在 1.7 中被禁止，请添加 'is TextMessage' 分支或 'else' 分支
    when(contact) {
        is Contact.PhoneCall -> TODO()
    }
}
```

关于此变更及其影响的更详细解释，请参见[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-47709)。

### 作为超类型的稳定挂起函数

挂起函数类型的实现已在 Kotlin 1.6.0 中[稳定](components-stability.md)。[1.5.30](whatsnew1530.md#suspending-functions-as-supertypes) 中提供了预览版。

此特性在设计使用 Kotlin 协程并接受挂起函数类型的 API 时非常有用。你现在可以将所需行为封装在一个实现挂起函数类型的单独类中，从而简化代码。

```kotlin
class MyClickAction : suspend () -> Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () -> Unit) {}
```

你可以在之前只允许 lambda 表达式和挂起函数引用的地方使用此类的实例：`launchOnClick(MyClickAction())`。

目前，由于实现细节，存在两个限制：
* 你不能在超类型列表中混合使用普通函数类型和挂起函数类型。
* 你不能使用多个挂起函数超类型。

### 稳定的挂起转换

Kotlin 1.6.0 引入了从普通函数类型到挂起函数类型的[稳定](components-stability.md)转换。从 1.4.0 开始，此特性支持函数字面量和可调用引用。在 1.6.0 中，它适用于任何形式的表达式。现在，你可以将合适普通函数类型的任何表达式作为调用实参传递给需要挂起类型的地方。编译器将自动执行隐式转换。

```kotlin
fun getSuspending(suspending: suspend () -> Unit) {}

fun suspending() {}

fun test(regular: () -> Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 注解类的稳定实例化

Kotlin 1.5.30 [引入了](whatsnew1530.md#instantiation-of-annotation-classes)在 JVM 平台上注解类实例化的实验性支持。在 1.6.0 中，此特性默认在 Kotlin/JVM 和 Kotlin/JS 上都可用。

关于注解类实例化的更多信息，请参见[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation.md)。

### 递归泛型类型的改进类型推断

Kotlin 1.5.30 引入了一项针对递归泛型类型的类型推断改进，该改进允许仅根据相应类型形参的上界来推断其类型实参。此改进之前需要通过编译器选项启用。在 1.6.0 及更高版本中，它默认启用。

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

构建器推断是一种类型推断形式，在调用泛型构建器函数时很有用。它可以借助其 lambda 表达式实参内部调用中的类型信息来推断调用的类型实参。

我们正在进行多项变更，使我们更接近完全稳定的构建器推断。从 1.6.0 开始：
* 你可以在构建器 lambda 表达式中调用返回尚未推断类型实例的函数，而无需指定 [1.5.30 中引入的](whatsnew1530.md#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 编译器选项。
* 通过 `-Xenable-builder-inference`，你可以编写自己的构建器而无需应用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 注解。

    > 请注意，这些构建器的客户端将需要指定相同的 `-Xenable-builder-inference` 编译器选项。
    >
    {style="warning"}

* 通过 `-Xenable-builder-inference`，如果常规类型推断无法获得足够关于类型的信息，构建器推断将自动激活。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference.md)。

### 类类型形参的注解支持

对类类型形参的注解支持如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有类型形参上的注解都会被生成到 JVM 字节码中，以便注解处理器能够使用它们。

关于促成此功能的用例，请参阅[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-43714)。

了解更多关于[注解](annotations.md)的信息。

## 更长时间地支持旧 API 版本

从 Kotlin 1.6.0 开始，我们将支持针对三个而非两个旧 API 版本的开发，并同时支持当前稳定版本。目前，我们支持 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

对于 Kotlin/JVM，从 1.6.0 开始，编译器可以生成对应 JVM 17 字节码版本的类。新语言版本还包括优化的委托属性和可重复注解，这些都已列入我们的路线图：
* [用于 1.8 JVM 目标的具有运行时保留策略的可重复注解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [优化对给定 KProperty 实例调用 getter/setter 的委托属性](#optimize-delegated-properties-which-call-get-set-on-the-given-kproperty-instance)

### 用于 1.8 JVM 目标的具有运行时保留策略的可重复注解

Java 8 引入了[可重复注解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，它们可以多次应用于单个代码元素。此特性要求 Java 代码中存在两个声明：标记有 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 的可重复注解本身，以及用于存储其值的包含注解。

Kotlin 也有可重复注解，但只要求在注解声明上存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重复。在 1.6.0 之前，此特性仅支持 `SOURCE` 保留策略，并且与 Java 的可重复注解不兼容。Kotlin 1.6.0 移除了这些限制。`@kotlin.annotation.Repeatable` 现在接受任何保留策略，并使注解在 Kotlin 和 Java 中都可重复。Java 的可重复注解现在也得到了 Kotlin 侧的支持。

虽然你可以声明包含注解，但这并非必需。例如：
* 如果注解 `@Tag` 标记有 `@kotlin.annotation.Repeatable`，Kotlin 编译器会自动生成一个名为 `@Tag.Container` 的包含注解类：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 要为包含注解设置自定义名称，请应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解，并传递显式声明的包含注解类作为实参：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射现在通过一个新函数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 同时支持 Kotlin 和 Java 的可重复注解。

关于 Kotlin 可重复注解的更多信息，请参见[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations.md)。

### 优化对给定 KProperty 实例调用 getter/setter 的委托属性

我们通过省略 `$delegate` 字段并生成对引用属性的直接访问，优化了生成的 JVM 字节码。

例如，在以下代码中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成 `content$delegate` 字段。`content` 变量的属性访问器直接调用 `impl` 变量，跳过了委托属性的 `getValue`/`setValue` 操作符，从而避免了对 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 类型的属性引用对象的需求。

感谢我们的 Google 同事提供了此实现！

了解更多关于[委托属性](delegated-properties.md)的信息。

## Kotlin/Native

Kotlin/Native 获得了多项改进和组件更新，其中一些处于预览状态：
* [新内存管理器的预览](#preview-of-the-new-memory-manager)
* [支持 Xcode 13](#support-for-xcode-13)
* [在任何主机上编译 Windows 目标](#compilation-of-windows-targets-on-any-host)
* [LLVM 和链接器更新](#llvm-and-linker-updates)
* [性能改进](#performance-improvements)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 链接失败的详细错误消息](#detailed-error-messages-for-klib-linkage-failures)
* [重新设计的未处理异常处理 API](#reworked-unhandled-exception-handling-api)

### 新内存管理器的预览

> 新的 Kotlin/Native 内存管理器是[实验性的](components-stability.md)。
> 它可能在任何时候被移除或更改。需要选择启用（详情见下文），并且你只能将其用于评估目的。
> 如果你能就此在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中提供反馈，我们将不胜感激。
>
{style="warning"}

通过 Kotlin 1.6.0，你可以试用新的 Kotlin/Native 内存管理器的开发预览版。这使我们更接近于消除 JVM 和原生平台之间的差异，以便在多平台项目中提供一致的开发者体验。

其中一个显著变更与 Kotlin/JVM 中类似，是顶层属性的惰性初始化。当首次访问同一文件中的顶层属性或函数时，顶层属性会被初始化。此模式还包括全局过程间优化（仅针对发布二进制文件启用），它会移除冗余的初始化检测。

我们最近发布了一篇关于新内存管理器的[博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。参阅它以了解新内存管理器的当前状态并找到一些演示项目，或者直接跳转到[迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md)亲自试用。请检查新内存管理器在你的项目中的工作情况，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 支持 Xcode 13

Kotlin/Native 1.6.0 支持 Xcode 13 – Xcode 的最新版本。你可以随意更新 Xcode 并继续开发针对苹果操作系统的 Kotlin 项目。

> Xcode 13 中添加的新库在 Kotlin 1.6.0 中尚不可用，但我们将在即将推出的版本中添加对它们的支持。
>
{style="note"}

### 在任何主机上编译 Windows 目标

从 1.6.0 开始，你不再需要 Windows 主机来编译 Windows 目标 `mingwX64` 和 `mingwX86`。它们可以在任何支持 Kotlin/Native 的主机上编译。

### LLVM 和链接器更新

我们重新设计了 Kotlin/Native 底层使用的 LLVM 依赖项。这带来了多项好处，包括：
* LLVM 版本更新到 11.1.0。
* 依赖项大小减小。例如，在 macOS 上，它现在约为 300 MB，而之前版本为 1200 MB。
* [排除了对 `ncurses5` 库的依赖](https://youtrack.jetbrains.com/issue/KT-42693)，该库在现代 Linux 发行版中不可用。

除了 LLVM 更新之外，Kotlin/Native 现在为 MinGW 目标使用了 [LLD](https://lld.llvm.org/) 链接器（一个来自 LLVM 项目的链接器）。与之前使用的 ld.bfd 链接器相比，它提供了多项好处，并将使我们能够改进生成二进制文件的运行时性能，并支持 MinGW 目标的编译器缓存。请注意，LLD [要求 DLL 链接导入库](whatsnew1530.md#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在[此 Stack Overflow 帖子](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527)中了解更多信息。

### 性能改进

Kotlin/Native 1.6.0 带来了以下性能改进：

* 编译时间：编译器缓存默认对 `linuxX64` 和 `iosArm64` 目标启用。这加速了调试模式下的大多数编译（第一次除外）。测量显示我们的测试项目速度提升了约 200%。编译器缓存从 Kotlin 1.5.0 开始已可用于这些目标，但当时需要[额外的 Gradle 属性](whatsnew15.md#performance-improvements)；现在你可以移除这些属性了。
* 运行时：由于生成的 LLVM 代码中的优化，使用 `for` 循环遍历数组现在快了高达 12%。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

> 为 Kotlin/Native 使用通用 IR 编译器插件 ABI 的选项是[实验性的](components-stability.md)。
> 它可能在任何时候被移除或更改。需要选择启用（详情见下文），并且你只能将其用于评估目的。
> 如果你能就此在 [YouTrack](https://youtrack.com/issue/KT-48595) 中提供反馈，我们将不胜感激。
>
{style="warning"}

在之前版本中，编译器插件的作者必须为 Kotlin/Native 提供单独的 artifact，因为 ABI 存在差异。

从 1.6.0 开始，Kotlin 多平台 Gradle 插件能够为 Kotlin/Native 使用可嵌入式编译器 jar — 这是用于 JVM 和 JS IR 后端的 jar。这是迈向统一编译器插件开发体验的一步，因为你现在可以为 Native 和其他支持的平台使用相同的编译器插件 artifact。

这是此类支持的预览版本，并且需要选择启用。
要开始为 Kotlin/Native 使用通用编译器插件 artifact，请将以下行添加到你的 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我们计划未来默认使用可嵌入式编译器 jar 用于 Kotlin/Native，因此听取你关于预览版工作情况的反馈对我们至关重要。

如果你是编译器插件的作者，请尝试此模式并检查它是否适用于你的插件。请注意，根据你的插件结构，可能需要迁移步骤。关于迁移说明，请参见[此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48595)，并在评论中留下你的反馈。

### klib 链接失败的详细错误消息

Kotlin/Native 编译器现在为 klib 链接错误提供详细的错误消息。这些消息现在具有清晰的错误描述，并且还包括有关可能原因和修复方法的信息。

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

我们统一了 Kotlin/Native 运行时中未处理异常的处理，并将默认处理暴露为 `processUnhandledException(throwable: Throwable)` 函数，供 `kotlinx.coroutines` 等自定义执行环境使用。此处理也适用于在 `Worker.executeAfter()` 操作中逃逸的异常，但仅适用于新的[内存管理器](#preview-of-the-new-memory-manager)。

API 改进也影响了通过 `setUnhandledExceptionHook()` 设置的 hook。以前，当 Kotlin/Native 运行时使用未处理异常调用 hook 后，这些 hook 会被重置，并且程序会立即终止。现在，这些 hook 可以多次使用，如果你希望程序在未处理异常时始终终止，那么要么不设置未处理异常 hook (`setUnhandledExceptionHook()`)，要么确保在 hook 结束时调用 `terminateWithUnhandledException()`。这将帮助你将异常发送到第三方崩溃报告服务（如 Firebase Crashlytics），然后终止程序。从 `main()` 逃逸的异常和跨越互操作边界的异常将始终终止程序，即使 hook 没有调用 `terminateWithUnhandledException()`。

## Kotlin/JS

我们正在继续致力于 Kotlin/JS 编译器的 IR 后端稳定化。
Kotlin/JS 现在有一个[禁用下载 Node.js 和 Yarn 的选项](#option-to-use-pre-installed-node-js-and-yarn)。

### 禁用下载 Node.js 和 Yarn 的选项

你现在可以在构建 Kotlin/JS 项目时禁用 Node.js 和 Yarn 的下载，并使用主机上已安装的实例。这对于在没有互联网连接的服务器上进行构建非常有用，例如 CI 服务器。

要禁用外部组件下载，请将以下行添加到你的 `build.gradle(.kts)` 中：

* Yarn：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
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
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
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

在 Kotlin 1.6.0 中，我们将 `KotlinGradleSubplugin` 类的弃用级别更改为 'ERROR'。此类曾用于编写编译器插件。在随后的版本中，我们将移除此，请改用 `KotlinCompilerPluginSupportPlugin` 类。

我们移除了 `kotlin.useFallbackCompilerSearch` 构建选项以及 `noReflect` 和 `includeRuntime` 编译器选项。`useIR` 编译器选项已被隐藏，并将在即将推出的版本中移除。

了解更多关于 Kotlin Gradle 插件中[当前支持的编译器选项](gradle-compiler-options.md)的信息。

## 标准库

标准库的新 1.6.0 版本稳定化了实验性特性，引入了新特性，并统一了其在不同平台上的行为：

* [新的 readline 函数](#new-readline-functions)
* [稳定的 typeOf()](#stable-typeof)
* [稳定的集合构建器](#stable-collection-builders)
* [稳定的 Duration API](#stable-duration-api)
* [将 Regex 拆分为序列](#splitting-regex-into-a-sequence)
* [整数上的位旋转操作](#bit-rotation-operations-on-integers)
* [JS 中 replace() 和 replaceFirst() 的变更](#changes-for-replace-and-replacefirst-in-js)
* [现有 API 的改进](#improvements-to-the-existing-api)
* [弃用](#deprecations)

### 新的 readline 函数

Kotlin 1.6.0 提供了用于处理标准输入的新函数：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

> 目前，新函数仅适用于 JVM 和 Native 目标平台。
>
{style="note"}

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 从标准输入读取一行并返回，如果已到达文件末尾（EOF）则抛出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 从标准输入读取一行并返回，如果已到达文件末尾（EOF）则返回 `null`。 |

我们相信消除读取行时使用 `!!` 的需要将改善新手的体验并简化 Kotlin 的教学。为了使读行操作的名称与其 `println()` 对应物保持一致，我们决定将新函数名称缩短为 'ln'。

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

现有 `readLine()` 函数在你的 IDE 代码补全中将获得比 `readln()` 和 `readlnOrNull()` 更低的优先级。IDE 检查也将推荐使用新函数而非旧版 `readLine()`。

我们计划在未来版本中逐步弃用 `readLine()` 函数。

### 稳定的 typeOf()

1.6.0 版本带来了[稳定](components-stability.md)的 [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数，完成了[路线图上](https://youtrack.jetbrains.com/issue/KT-45396)的一个主要项目。

[自 1.3.40 版起](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台作为实验性 API 提供。现在你可以在任何 Kotlin 平台中使用它，并获取编译器可以推断的任何 Kotlin 类型的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示形式：

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

在 Kotlin 1.6.0 中，集合构建器函数已提升为[稳定](components-stability.md)版。集合构建器返回的集合现在在其只读状态下可序列化。

你现在可以无需选择启用注解即可使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)：

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

用于表示不同时间单位持续时间量的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类已提升为[稳定](components-stability.md)版。在 1.6.0 中，Duration API 获得了以下变更：

* [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的第一个组件（将持续时间分解为天、小时、分钟、秒和纳秒）现在是 `Long` 类型而不是 `Int`。之前，如果值不适合 `Int` 范围，它会被强制转换为该范围。使用 `Long` 类型，你可以在持续时间范围内分解任何值，而不会截断不适合 `Int` 的值。

* `DurationUnit` 枚举现在是独立的，而不是 JVM 上 `java.util.concurrent.TimeUnit` 的类型别名。我们没有发现任何有说服力的案例表明 `typealias DurationUnit = TimeUnit` 会有用。此外，通过类型别名暴露 `TimeUnit` API 可能会混淆 `DurationUnit` 用户。

* 响应社区反馈，我们重新引入了 `Int.seconds` 等扩展属性。但我们希望限制它们的适用性，因此我们将它们放入了 `Duration` 类的伴生对象中。虽然 IDE 仍然可以在补全中建议扩展并自动从伴生对象插入导入，但未来我们计划将此行为限制在预期 `Duration` 类型的情况下。

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
  
  我们建议使用 `Duration.Companion` 中的新扩展来替换之前引入的伴生函数（例如 `Duration.seconds(Int)）以及已弃用的顶层扩展（例如 `Int.seconds`）。

  > 这种替换可能会在旧的顶层扩展和新的伴生扩展之间造成歧义。
  > 在进行自动化迁移之前，请务必使用 `kotlin.time` 包的通配符导入 — `import kotlin.time.*`。
  >
  {style="note"}

### 将 Regex 拆分为序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函数已提升为[稳定](components-stability.md)。它们根据给定正则表达式的匹配项拆分字符串，但将结果作为[序列](sequences.md)返回，以便对该结果的所有操作都惰性执行：

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

### 整数上的位旋转操作

在 Kotlin 1.6.0 中，用于位操作的 `rotateLeft()` 和 `rotateRight()` 函数已变得[稳定](components-stability.md)。这些函数将数字的二进制表示向左或向右旋转指定的位数：

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

### JS 中 replace() 和 replaceFirst() 的变更

在 Kotlin 1.6.0 之前，当替换字符串包含组引用时，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函数在 Java 和 JS 中的行为不同。为了使行为在所有目标平台保持一致，我们更改了它们在 JS 中的实现。

替换字符串中 `${name}` 或 `$index` 的出现会被替换为与指定索引或名称的捕获组对应的子序列：
* `$index` – 字符 '
    ```
    后的第一个数字始终被视为组引用的一部分。随后的数字仅在其形成有效组引用时才被合并到 `index` 中。只有数字 '0'–'9' 被认为是组引用的潜在组成部分。请注意，捕获组的索引从 '1' 开始。
  索引为 '0' 的组代表整个匹配项。
* `${name}` – `name` 可以由拉丁字母 'a'–'z'、'A'–'Z' 或数字 '0'–'9' 组成。第一个字符必须是字母。

    > 命名组在替换模式中目前仅在 JVM 上支持。
    >
    {style="note"}

* 要在替换字符串中将后续字符作为字面量包含，请使用反斜杠字符 `\`：

    ```kotlin
    fun main() {
    //sampleStart
        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

    如果替换字符串必须被视为字面字符串，你可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 现有 API 的改进

* 1.6.0 版本为 `Comparable.compareTo()` 添加了中缀扩展函数。你现在可以使用中缀形式来比较两个对象的顺序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 现在也变为非内联的，以统一其在所有平台上的实现。
* `compareTo()` 和 `equals()` String 函数，以及 `isBlank()` CharSequence 函数现在在 JS 中的行为与它们在 JVM 上的行为完全相同。以前，在处理非 ASCII 字符时存在偏差。

### 弃用

在 Kotlin 1.6.0 中，我们开始对一些仅限 JS 的标准库 API 进行弃用，并发出警告。

#### concat()、match() 和 matches() 字符串函数

* 要将字符串与给定其他对象的字符串表示拼接，请使用 `plus()` 代替 `concat()`。
* 要在输入中查找正则表达式的所有出现，请使用 Regex 类的 `findAll()` 代替 `String.match(regex: String)`。
* 要检测正则表达式是否匹配整个输入，请使用 Regex 类的 `matches()` 代替 `String.matches(regex: String)`。

#### 接受比较函数的数组 sort()

我们弃用了 `Array<out T>.sort()` 函数以及内联函数 `ByteArray.sort()`、`ShortArray.sort()`、`IntArray.sort()`、`LongArray.sort()`、`FloatArray.sort()`、`DoubleArray.sort()` 和 `CharArray.sort()`，它们根据比较函数传递的顺序对数组进行排序。请使用其他标准库函数进行数组排序。

关于集合排序，请参见[集合排序](collection-ordering.md)章节。

## 工具

### Kover – Kotlin 的代码覆盖率工具

> Kover Gradle 插件是实验性的。如果你能就此在 [GitHub](https://github.com/Kotlin/kotlinx-kover/issues) 中提供反馈，我们将不胜感激。
>
{style="warning"}

通过 Kotlin 1.6.0，我们引入了 Kover – 一个用于 [IntelliJ](https://github.com/JetBrains/intellij-coverage) 和 [JaCoCo](https://github.com/jacoco/jacoco) Kotlin 代码覆盖率代理的 Gradle 插件。它适用于所有语言构造，包括内联函数。

关于 Kover 的更多信息，请在其 [GitHub 版本库](https://github.com/Kotlin/kotlinx-kover) 或此视频中了解：

<video src="https://www.youtube.com/v/jNu5LY9HIbw" title="Kover – The Code Coverage Plugin"/>

## Coroutines 1.6.0-RC

`kotlinx.coroutines` [1.6.0-RC](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC) 已发布，带来了多项特性和改进：

* [支持新的 Kotlin/Native 内存管理器](#preview-of-the-new-memory-manager)
* 引入 dispatcher _视图_ API，它允许限制并行性而无需创建额外线程
* 从 Java 6 迁移到 Java 8 目标
* 具有新重新设计 API 和多平台支持的 `kotlinx-coroutines-test`
* 引入 [`CopyableThreadContextElement`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-copyable-thread-context-element/index.html)，它为协程提供了对 [`ThreadLocal`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ThreadLocal.html) 变量的线程安全写入访问

在[变更日志](https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.6.0-RC)中了解更多。

## 迁移到 Kotlin 1.6.0

IntelliJ IDEA 和 Android Studio 一旦可用，将建议将 Kotlin 插件更新到 1.6.0。

要将现有项目迁移到 Kotlin 1.6.0，请将 Kotlin 版本更改为 `1.6.0` 并重新导入你的 Gradle 或 Maven 项目。[了解如何更新到 Kotlin 1.6.0](releases.md#update-to-a-new-kotlin-version)。

要使用 Kotlin 1.6.0 启动新项目，请更新 Kotlin 插件并从 **File** | **New** | **Project** 运行项目向导。

新的命令行编译器可在 [GitHub 发布页面](https://github.com/JetBrains/kotlin/releases/tag/v1.6.0)下载。

Kotlin 1.6.0 是一个[特性发布](kotlin-evolution-principles.md#language-and-tooling-releases)版本，因此可能带来与你为早期语言版本编写的代码不兼容的变更。在 [Kotlin 1.6 兼容性指南](compatibility-guide-16.md)中查找此类变更的详细列表。