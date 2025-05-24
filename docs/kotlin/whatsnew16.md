---
title: "Kotlin 1.6.0 的新特性"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[发布日期：2021 年 11 月 16 日](releases#release-details)_

Kotlin 1.6.0 引入了新的语言特性，对现有特性进行了优化和改进，并对 Kotlin 标准库进行了大量改进。

你也可以在[发布博客文章](https://blog.jetbrains.com/kotlin/2021/11/kotlin-1-6-0-is-released/)中找到有关更改的概述。

## 语言

Kotlin 1.6.0 将之前 1.5.30 版本中引入的几个语言特性稳定化：
* [枚举、密封类和布尔类型的穷举 when 语句已稳定](#stable-exhaustive-when-statements-for-enum-sealed-and-boolean-subjects)
* [挂起函数作为超类型已稳定](#stable-suspending-functions-as-supertypes)
* [挂起转换已稳定](#stable-suspend-conversions)
* [注解类的实例化已稳定](#stable-instantiation-of-annotation-classes)

它还包括各种类型推断改进和对类类型参数的注解支持：
* [改进了递归泛型类型的类型推断](#improved-type-inference-for-recursive-generic-types)
* [构建器推断的更改](#changes-to-builder-inference)
* [支持类类型参数上的注解](#support-for-annotations-on-class-type-parameters)

### 枚举、密封类和布尔类型的穷举 when 语句已稳定

_穷举_ [`when`](control-flow#when-expressions-and-statements) 语句包含其主体的所有可能类型或值的分支，或者某些类型加上 `else` 分支。它涵盖了所有可能的用例，使你的代码更安全。

我们将很快禁止非穷举 `when` 语句，以使行为与 `when` 表达式保持一致。为了确保平滑迁移，Kotlin 1.6.0 会报告关于具有枚举、密封类或布尔类型主体的非穷举 `when` 语句的警告。这些警告将在未来的版本中变为错误。

```kotlin
sealed class Contact {
    data class PhoneCall(val number: String) : Contact()
    data class TextMessage(val number: String) : Contact()
}

fun Contact.messageCost(): Int =
    when(this) { // Error: 'when' expression must be exhaustive
        is Contact.PhoneCall `->` 42
    }

fun sendMessage(contact: Contact, message: String) {
    // Starting with 1.6.0

    // Warning: Non exhaustive 'when' statements on Boolean will be
    // prohibited in 1.7, add 'false' branch or 'else' branch instead 
    when(message.isEmpty()) {
        true `->` return
    }
    // Warning: Non exhaustive 'when' statements on sealed class/interface will be
    // prohibited in 1.7, add 'is TextMessage' branch or 'else' branch instead
    when(contact) {
        is Contact.PhoneCall `->` TODO()
    }
}
```

有关更改及其影响的更详细说明，请参见[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-47709)。

### 挂起函数作为超类型已稳定

挂起函数类型的实现已在 Kotlin 1.6.0 中变为[稳定](components-stability)。在 [1.5.30 中](whatsnew1530#suspending-functions-as-supertypes)提供了一个预览版。

当设计使用 Kotlin 协程并接受挂起函数类型的 API 时，此功能可能很有用。现在，你可以通过将所需的行为封装在一个实现挂起函数类型的单独类中来简化你的代码。

```kotlin
class MyClickAction : suspend () `->` Unit {
    override suspend fun invoke() { TODO() }
}

fun launchOnClick(action: suspend () `->` Unit) {}
```

你可以在以前只允许 lambda 表达式和挂起函数引用的地方使用此类的实例：`launchOnClick(MyClickAction())`。

目前，由于实现细节，存在两个限制：
* 你不能在超类型列表中混合普通函数类型和挂起函数类型。
* 你不能使用多个挂起函数超类型。

### 挂起转换已稳定

Kotlin 1.6.0 引入了从常规函数类型到挂起函数类型的[稳定](components-stability)转换。从 1.4.0 开始，该功能支持函数字面量和可调用引用。在 1.6.0 中，它适用于任何形式的表达式。作为调用参数，你现在可以传递任何合适的常规函数类型的表达式，其中需要挂起。编译器将自动执行隐式转换。

```kotlin
fun getSuspending(suspending: suspend () `->` Unit) {}

fun suspending() {}

fun test(regular: () `->` Unit) {
    getSuspending { }           // OK
    getSuspending(::suspending) // OK
    getSuspending(regular)      // OK
}
```

### 注解类的实例化已稳定

Kotlin 1.5.30 [引入了](whatsnew1530#instantiation-of-annotation-classes)在 JVM 平台上实例化注解类的实验性支持。在 1.6.0 中，该功能默认可用于 Kotlin/JVM 和 Kotlin/JS。

在[此 KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-instantiation) 中了解有关注解类实例化的更多信息。

### 改进了递归泛型类型的类型推断

Kotlin 1.5.30 引入了对递归泛型类型的类型推断的改进，它允许仅根据相应类型参数的上界来推断它们的类型参数。该改进可通过编译器选项获得。在 1.6.0 及更高版本中，默认启用它。

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

### 构建器推断的更改

构建器推断是一种类型推断，在调用泛型构建器函数时很有用。它可以借助来自其 lambda 参数内部调用的类型信息来推断调用的类型参数。

我们正在进行多项更改，使我们更接近完全稳定的构建器推断。从 1.6.0 开始：
* 你可以在构建器 lambda 内部进行返回尚未推断类型的实例的调用，而无需指定 [1.5.30 中引入的](whatsnew1530#eliminating-builder-inference-restrictions) `-Xunrestricted-builder-inference` 编译器选项。
* 使用 `-Xenable-builder-inference`，你可以编写自己的构建器，而无需应用 [`@BuilderInference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-builder-inference/) 注解。

    > 请注意，这些构建器的客户端将需要指定相同的 `-Xenable-builder-inference` 编译器选项。
    >
    

* 使用 `-Xenable-builder-inference`，如果常规类型推断无法获得有关类型的足够信息，则会自动激活构建器推断。

[了解如何编写自定义泛型构建器](using-builders-with-builder-inference)。

### 支持类类型参数上的注解

对类类型参数上的注解的支持如下所示：

```kotlin
@Target(AnnotationTarget.TYPE_PARAMETER)
annotation class BoxContent

class Box<@BoxContent T> {}
```

所有类型参数上的注解都会被发送到 JVM 字节码中，以便注解处理器可以使用它们。

有关动机用例，请阅读[此 YouTrack 工单](https://youtrack.jetbrains.com/issue/KT-43714)。

了解有关[注解](annotations)的更多信息。

## 更长时间地支持以前的 API 版本

从 Kotlin 1.6.0 开始，我们将支持对三个以前的 API 版本（而不是两个）以及当前稳定版本的开发。目前，我们支持 1.3、1.4、1.5 和 1.6 版本。

## Kotlin/JVM

对于 Kotlin/JVM，从 1.6.0 开始，编译器可以生成具有与 JVM 17 对应的字节码版本的类。新的语言版本还包括优化的委托属性和可重复注解，这些都在我们的路线图上：
* [适用于 1.8 JVM 目标的可重复运行时保留注解](#repeatable-annotations-with-runtime-retention-for-1-8-jvm-target)
* [优化在给定的 KProperty 实例上调用 get/set 的委托属性](#optimize-delegated-properties-which-call-get-set-on-the-given-k-property-instance)

### 适用于 1.8 JVM 目标的可重复运行时保留注解

Java 8 引入了[可重复注解](https://docs.oracle.com/javase/tutorial/java/annotations/repeating.html)，它可以多次应用于单个代码元素。该功能需要在 Java 代码中存在两个声明：可重复注解本身，用 [`@java.lang.annotation.Repeatable`](https://docs.oracle.com/javase/8/docs/api/java/lang/annotation/Repeatable.html) 标记，以及包含注解以保存其值。

Kotlin 也有可重复注解，但只需要在注解声明中存在 [`@kotlin.annotation.Repeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-repeatable/) 即可使其可重复。在 1.6.0 之前，该功能仅支持 `SOURCE` 保留，并且与 Java 的可重复注解不兼容。Kotlin 1.6.0 消除了这些限制。`@kotlin.annotation.Repeatable` 现在接受任何保留，并使注解在 Kotlin 和 Java 中都可重复。Kotlin 端现在也支持 Java 的可重复注解。

虽然你可以声明一个包含注解，但这不是必需的。例如：
* 如果注解 `@Tag` 用 `@kotlin.annotation.Repeatable` 标记，则 Kotlin 编译器会自动生成一个包含注解类，名称为 `@Tag.Container`：

    ```kotlin
    @Repeatable 
    annotation class Tag(val name: String)

    // The compiler generates @Tag.Container containing annotation
    ```

* 要为包含注解设置自定义名称，请应用 [`@kotlin.jvm.JvmRepeatable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/-jvmrepeatable/) 元注解，并将显式声明的包含注解类作为参数传递：

    ```kotlin
    @JvmRepeatable(Tags::class)
    annotation class Tag(val name: String)
    
    annotation class Tags(val value: Array<Tag>)
    ```

Kotlin 反射现在通过一个新函数 [`KAnnotatedElement.findAnnotations()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/find-annotations.html) 支持 Kotlin 和 Java 的可重复注解。

在此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/repeatable-annotations) 中了解有关 Kotlin 可重复注解的更多信息。

### 优化在给定的 KProperty 实例上调用 get/set 的委托属性

我们通过省略 `$delegate` 字段并生成对引用属性的直接访问来优化生成的 JVM 字节码。

例如，在以下代码中

```kotlin
class Box<T> {
    private var impl: T = ...

    var content: T by ::impl
}
```

Kotlin 不再生成字段 `content$delegate`。`content` 变量的属性访问器直接调用 `impl` 变量，跳过委托属性的 `getValue`/`setValue` 运算符，从而避免了对 [`KProperty`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-property/index.html) 类型的属性引用对象的需求。

感谢我们的 Google 同事的实现！

了解有关[委托属性](delegated-properties)的更多信息。

## Kotlin/Native

Kotlin/Native 正在接收多个改进和组件更新，其中一些处于预览状态：
* [新内存管理器的预览](#preview-of-the-new-memory-manager)
* [支持 Xcode 13](#support-for-xcode-13)
* [在任何主机上编译 Windows 目标](#compilation-of-windows-targets-on-any-host)
* [LLVM 和链接器更新](#llvm-and-linker-updates)
* [性能改进](#performance-improvements)
* [与 JVM 和 JS IR 后端统一的编译器插件 ABI](#unified-compiler-plugin-abi-with-jvm-and-js-ir-backends)
* [klib 链接失败的详细错误消息](#detailed-error-messages-for-klib-linkage-failures)
* [重新设计的未处理异常处理 API](#reworked-unhandled-exception-handling-api)

### 新内存管理器的预览

:::note
新的 Kotlin/Native 内存管理器是 [实验性的](components-stability)。
它可能随时被删除或更改。需要选择加入（请参见下面的详细信息），并且你应仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中对它的反馈。

使用 Kotlin 1.6.0，你可以尝试新的 Kotlin/Native 内存管理器的开发预览版。
它使我们更接近消除 JVM 和 Native 平台之间的差异，从而在多平台项目中提供一致的开发人员体验。

一个值得注意的更改是顶级属性的延迟初始化，就像在 Kotlin/JVM 中一样。当首次访问来自同一文件的顶级属性或函数时，将初始化顶级属性。
此模式还包括全局过程间优化（仅对发布二进制文件启用），该优化消除了冗余的初始化检查。

我们最近发布了一篇关于新内存管理器的 [博客文章](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/)。
阅读它以了解新内存管理器的当前状态并找到一些演示项目，或者直接跳转到 [迁移说明](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM) 以亲自尝试。
请检查新的内存管理器如何在你的项目中工作，并在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48525) 中分享反馈。

### 支持 Xcode 13

Kotlin/Native 1.6.0 支持 Xcode 13 – 最新版本的 Xcode。随意更新你的 Xcode 并继续在 Apple 操作系统上处理你的 Kotlin 项目。

在 Xcode 13 中添加的新库在 Kotlin 1.6.0 中不可用，但我们将在即将发布的版本中添加对它们的支持。

:::

### 在任何主机上编译 Windows 目标

从 1.6.0 开始，你不需要 Windows 主机来编译 Windows 目标 `mingwX64` 和 `mingwX86`。它们可以在支持 Kotlin/Native 的任何主机上编译。

### LLVM 和链接器更新

我们重新设计了 Kotlin/Native 在底层使用的 LLVM 依赖项。这带来了各种好处，包括：
* 将 LLVM 版本更新到 11.1.0。
* 减少了依赖项大小。例如，在 macOS 上，它现在约为 300 MB，而不是先前版本中的 1200 MB。
* [排除了对 `ncurses5` 库的依赖](https://youtrack.jetbrains.com/issue/KT-42693)，该库在现代 Linux 发行版中不可用。

除了 LLVM 更新之外，Kotlin/Native 现在还使用 [LLD](https://lld.llvm.org/) 链接器（来自 LLVM 项目的链接器）来处理 MingGW 目标。与先前使用的 ld.bfd 链接器相比，它提供了各种好处，并将使我们能够提高生成二进制文件的运行时性能并支持 MinGW 目标的编译器缓存。请注意，LLD [需要用于 DLL 链接的导入库](whatsnew1530#deprecation-of-linkage-against-dlls-without-import-libraries-for-mingw-targets)。在此 [Stack Overflow 线程](https://stackoverflow.com/questions/3573475/how-does-the-import-library-work-details/3573527/#3573527) 中了解更多信息。

### 性能改进

Kotlin/Native 1.6.0 提供了以下性能改进：

* 编译时间：编译器缓存默认情况下对 `linuxX64` 和 `iosArm64` 目标启用。
这加快了调试模式下的大多数编译（除了第一个编译）。测量表明，在我们的测试项目中，速度提高了约 200%。
自 Kotlin 1.5.0 以来，编译器缓存已可用于这些目标，并带有 [其他 Gradle 属性](whatsnew15#performance-improvements)；你现在可以删除它们。
* 运行时：由于生成的 LLVM 代码中的优化，使用 `for` 循环迭代数组现在速度提高了高达 12%。

### 与 JVM 和 JS IR 后端统一的编译器插件 ABI

:::note
对 Kotlin/Native 使用通用 IR 编译器插件 ABI 的选项是 [实验性的](components-stability)。
它可能随时被删除或更改。需要选择加入（请参见下面的详细信息），并且你应仅将其用于评估目的。
我们感谢你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-48595) 中对它的反馈。

在以前的版本中，由于 ABI 的差异，编译器插件的作者必须为 Kotlin/Native 提供单独的工件。

从 1.6.0 开始，Kotlin 多平台 Gradle 插件能够将嵌入式编译器 jar（用于 JVM 和 JS IR 后端）用于 Kotlin/Native。
这是统一编译器插件开发体验的一步，因为你现在可以为 Native 和其他受支持的平台使用相同的编译器插件工件。

这是对此类支持的预览版本，需要选择加入。
要开始对 Kotlin/Native 使用通用编译器插件工件，请将以下行添加到 `gradle.properties`：`kotlin.native.useEmbeddableCompilerJar=true`。

我们计划在将来默认情况下对 Kotlin/Native 使用嵌入式编译器 jar，因此对我们来说，了解预览版如何为你工作至关重要。

如果你是编译器插件的作者，请尝试此模式并检查它是否适用于你的插件。
请注意，根据你的插件的结构，可能需要迁移步骤。有关迁移说明，请参见 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-48595)，并在评论中留下你的反馈。

### klib 链接失败的详细错误消息

Kotlin/Native 编译器现在为 klib 链接错误提供详细的错误消息。
这些消息现在具有清晰的错误描述，并且还包括有关可能原因和修复方法的信息。

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

我们统一了整个 Kotlin/Native 运行时的未处理异常的处理，并将默认处理公开为函数 `processUnhandledException(throwable: Throwable)`，供自定义执行环境（如 `kotlinx.coroutines`）使用。
此处理也适用于在 `Worker.executeAfter()` 中转义操作的异常，但仅适用于新的 [内存管理器](#preview-of-the-new-memory-manager)。

API 改进也影响了由 `setUnhandledExceptionHook()` 设置的钩子。以前，在 Kotlin/Native 运行时使用未处理的异常调用钩子之后，将重置此类钩子，并且程序将在之后立即终止。
现在，这些钩子可以使用多次，并且如果你希望程序始终在未处理的异常时终止，请不要设置未处理的异常钩子 (`setUnhandledExceptionHook()`)，或者确保在钩子的末尾调用 `terminateWithUnhandledException()`。
这将帮助你将异常发送到第三方崩溃报告服务（如 Firebase Crashlytics），然后终止程序。
转义 `main()` 的异常和跨越互操作边界的异常将始终终止程序，即使钩子未调用 `terminateWithUnhandledException()`。

## Kotlin/JS

我们正在继续努力稳定 Kotlin/JS 编译器的 IR 后端。
Kotlin/JS 现在有一个 [禁用下载 Node.js 和 Yarn 的选项](#option-to-use-pre-installed-node-js-and-yarn)。

### 禁用下载 Node.js 和 Yarn 的选项

你现在可以在构建 Kotlin/JS 项目时禁用下载 Node.js 和 Yarn，并使用已安装在主机上的实例。
这对于在没有 Internet 连接的服务器（例如 CI 服务器）上构建很有用。

要禁用下载外部组件，请将以下行添加到你的 `build.gradle(.kts)`：

* Yarn：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false // or true for default behavior
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

* Node.js：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
        rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false // or true for default behavior
    }
     
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
        rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
    }
    ```
    
    </TabItem>
    </Tabs>

## Kotlin Gradle 插件

在 Kotlin 1.6.0 中，我们将 `KotlinGradleSubplugin` 类的弃用级别更改为“ERROR”。
此类用于编写编译器插件。在以下版本中，我们将删除此类。请改用类 `KotlinCompilerPluginSupportPlugin`。

我们删除了 `kotlin.useFallbackCompilerSearch` 构建选项以及 `noReflect` 和 `includeRuntime` 编译器选项。
`useIR` 编译器选项已被隐藏，将在即将发布的版本中删除。

在 Kotlin Gradle 插件中了解有关[当前支持的编译器选项](gradle-compiler-options)的更多信息。

## 标准库

新的 1.6.0 版本的标准库稳定了实验性功能，引入了新的功能，并统一了其在各个平台上的行为：

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

Kotlin 1.6.0 提供了用于处理标准输入的新函数：[`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 和 [`readlnOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln-or-null.html)。

目前，新函数仅适用于 JVM 和 Native 目标平台。

:::

|**早期版本**|**1.6.0 替代方案**|**用法**|
| --- | --- | --- |
|`readLine()!!`|`readln()`| 从标准输入读取一行并返回，如果已到达 EOF，则抛出 `RuntimeException`。 |
|`readLine()`|`readlnOrNull()`| 从标准输入读取一行并返回，如果已到达 EOF，则返回 `null`。 |

我们认为，消除在读取行时使用 `!!` 的需要将改善新手的体验并简化 Kotlin 的教学。
为了使 readline 操作名称与其 `println()` 对应项保持一致，我们决定将新函数的名称缩短为“ln”。

```kotlin
println("What is your nickname?")
val nickname = readln()
println("Hello, $nickname!")
```

```kotlin
fun main() {

    var sum = 0
    while (true) {
        val nextLine = readlnOrNull().takeUnless { 
            it.isNullOrEmpty() 
        } ?: break
        sum += nextLine.toInt()
    }
    println(sum)

}
```

现有的 `readLine()` 函数在你的 IDE 代码完成中将获得比 `readln()` 和 `readlnOrNull()` 更低的优先级。
IDE 检查还将建议使用新函数而不是旧版 `readLine()`。

我们计划在未来的版本中逐步弃用 `readLine()` 函数。

### 稳定的 typeOf()

1.6.0 版本带来了[稳定的](components-stability) [`typeOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数，从而关闭了 [主要路线图项目](https://youtrack.jetbrains.com/issue/KT-45396) 之一。

[自 1.3.40 以来](https://blog.jetbrains.com/kotlin/2019/06/kotlin-1-3-40-released/)，`typeOf()` 在 JVM 平台上作为实验性 API 提供。
现在，你可以在任何 Kotlin 平台上使用它，并获得编译器可以推断的任何 Kotlin 类型的 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/#kotlin.reflect.KType) 表示形式：

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

在 Kotlin 1.6.0 中，集合构建器函数已升级为[稳定](components-stability)。集合构建器返回的集合现在在其只读状态下是可序列化的。

你现在可以使用 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)、
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html) 和 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)，而无需选择加入注解：

```kotlin
fun main() {

    val x = listOf('b', 'c')
    val y = buildList {
        add('a')
        addAll(x)
        add('d')
    }
    println(y)  // [a, b, c, d]

}
```

### 稳定的 Duration API

用于表示不同时间单位的持续时间的 [Duration](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类已升级为[稳定](components-stability)。在 1.6.0 中，Duration API 收到了以下更改：

* 将持续时间分解为天、小时、分钟、秒和纳秒的 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的第一个组件现在具有 `Long` 类型，而不是 `Int`。
  以前，如果该值不适合 `Int` 范围，则会被强制转换为该范围。使用 `Long` 类型，你可以分解持续时间范围内的任何值，而无需截断不适合 `Int` 的值。

* `DurationUnit` 枚举现在是独立的，而不是 JVM 上的 `java.util.concurrent.TimeUnit` 的类型别名。
  我们没有发现任何令人信服的案例，其中拥有 `typealias DurationUnit = TimeUnit` 可能有用。此外，通过类型别名公开 `TimeUnit` API 可能会使 `DurationUnit` 用户感到困惑。

* 为了响应社区的反馈，我们正在恢复扩展属性，例如 `Int.seconds`。但是我们想限制它们的适用性，因此我们将它们放入 `Duration` 类的伴生对象中。
  虽然 IDE 仍然可以在完成时建议扩展并自动插入来自伴生对象的导入，但在将来，我们计划将此行为限制为预期 `Duration` 类型的情况。

  ```kotlin
  import kotlin.time.Duration.Companion.seconds
  
  fun main() {

      val duration = 10000
      println("There are ${duration.seconds.inWholeMinutes} minutes in $duration seconds")
      // There are 166 minutes in 10000 seconds

  }
  ```
  
  
  我们建议替换以前引入的伴生对象函数，例如 `Duration.seconds(Int)`，并使用 `Duration.Companion` 中的新扩展来替换已弃用的顶级扩展，例如 `Int.seconds`。

  > 这种替换可能会导致旧的顶级扩展和新的伴生对象扩展之间产生歧义。
  > 在执行自动迁移之前，请务必使用 kotlin.time 包的通配符导入 – `import kotlin.time.*`。
  >
  

### 将 Regex 拆分为序列

`Regex.splitToSequence(CharSequence)` 和 `CharSequence.splitToSequence(Regex)` 函数已升级为[稳定](components-stability)。
它们围绕给定正则表达式的匹配项拆分字符串，但以 [Sequence](sequences) 的形式返回结果，以便对该结果的所有操作都以惰性方式执行：

```kotlin
fun main() {

    val colorsText = "green, red, brown&blue, orange, pink&green"
    val regex = "[,\\s]+".toRegex()
    val mixedColor = regex.splitToSequence(colorsText)
    // or
    // val mixedColor = colorsText.splitToSequence(regex)
        .onEach { println(it) }
        .firstOrNull { it.contains('&') }
    println(mixedColor) // "brown&blue"

}
```

### 整数上的位旋转操作

在 Kotlin 1.6.0 中，用于位操作的 `rotateLeft()` 和 `rotateRight()` 函数已变为[稳定](components-stability)。
这些函数将数字的二进制表示形式向左或向右旋转指定的位数：

```kotlin
fun main() {

    val number: Short = 0b10001
    println(number
        .rotateRight(2)
        .toString(radix = 2)) // 100000000000100
    println(number
        .rotateLeft(2)
        .toString(radix = 2))  // 1000100

}
```

### JS 中 replace() 和 replaceFirst() 的更改

在 Kotlin 1.6.0 之前，当替换字符串包含组引用时，[`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace.html) 和 [`replaceFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/replace-first.html) Regex 函数在 Java 和 JS 中的行为有所不同。
为了使行为在所有目标平台上保持一致，我们更改了它们在 JS 中的实现。

替换字符串中出现的 `${name}` 或 `$index` 将替换为与具有指定索引或名称的捕获组相对应的子序列：
* `$index` – '$' 后的第一个数字始终被视为组引用的一部分。只有在后续数字构成有效的组引用时，才将其合并到 `index` 中。仅考虑数字“0”–“9”作为组引用的潜在组成部分。请注意，捕获组的索引从“1”开始。
  索引为“0”的组代表整个匹配项。
* `${name}` – `name` 可以包含拉丁字母“a”–“z”、“A”–“Z”或数字“0”–“9”。第一个字符必须是字母。

    > 替换模式中的命名组目前仅在 JVM 上受支持。
    >
    

* 要在替换字符串中包含后续字符作为文字，请使用反斜杠字符 `\`：

    ```kotlin
    fun main() {

        println(Regex("(.+)").replace("Kotlin", """\$ $1""")) // $ Kotlin
        println(Regex("(.+)").replaceFirst("1.6.0", """\\ $1""")) // \ 1.6.0

    }
    ```
    

    如果替换字符串必须被视为文字字符串，则可以使用 [`Regex.escapeReplacement()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/escape-replacement.html)。

### 对现有 API 的改进

* 1.6.0 版本为 `Comparable.compareTo()` 添加了中缀扩展函数。你现在可以使用中缀形式来比较两个对象的顺序：

    ```kotlin
     class WrappedText(val text: String) : Comparable<WrappedText> {
         override fun compareTo(other: WrappedText): Int =
             this.text compareTo other.text
    }
    ```

* JS 中的 `Regex.replace()` 现在也不是内联的，以统一其在所有