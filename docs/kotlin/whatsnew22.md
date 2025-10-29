[//]: # (title: Kotlin 2.2.0 新特性)

发布日期：2025 年 6 月 23 日](releases.md#release-details)

Kotlin 2.2.0 版本现已发布！以下是主要亮点：

*   **语言**：预览版中包含新的语言特性，包括[上下文形参](#preview-of-context-parameters)。一些[以前的实验性特性现已稳定](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)，例如守卫条件、非局部 `break` 和 `continue`，以及多美元符号内插。
*   **Kotlin 编译器**：[统一管理编译器警告](#kotlin-compiler-unified-management-of-compiler-warnings)。
*   **Kotlin/JVM**：[接口函数默认方法生成的更改](#changes-to-default-method-generation-for-interface-functions)。
*   **Kotlin/Native**：[LLVM 19 以及用于跟踪和调整内存消耗的新特性](#kotlin-native)。
*   **Kotlin/Wasm**：[分离的 Wasm 目标平台](#build-infrastructure-for-wasm-target-separated-from-javascript-target)和[每项目 Binaryen 配置](per-project-binaryen-configuration)的能力。
*   **Kotlin/JS**：[修复了 `@JsPlainObject` 接口生成的 `copy()` 方法](#fix-for-copy-in-jsplainobject-interfaces)。
*   **Gradle**：[Kotlin Gradle 插件中包含二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
*   **标准库**：[稳定的 Base64 和 HexFormat API](#stable-base64-encoding-and-decoding)。
*   **文档**：我们的[文档调查已开放](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)，并且[Kotlin 文档已进行了显著改进](#documentation-updates)。

你也可以观看这段 Kotlin 语言演进团队讨论新特性和回答问题的视频：

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="What's new in Kotlin 2.2.0"/>

## IDE 支持

支持 2.2.0 的 Kotlin 插件已捆绑在最新版本的 IntelliJ IDEA 和 Android Studio 中。
你无需更新 IDE 中的 Kotlin 插件。
你只需在构建脚本中[将 Kotlin 版本](configure-build-for-eap.md#adjust-the-kotlin-version)更改为 2.2.0 即可。

有关详细信息，请参见[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

此版本[将](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)守卫条件、非局部 `break` 和 `continue`，以及多美元符号内插[提升为稳定版本](components-stability.md#stability-levels-explained)。
此外，[上下文形参](#preview-of-context-parameters)和[上下文敏感解析](#preview-of-context-sensitive-resolution)等特性已在预览版中引入。

### 上下文形参预览
<primary-label ref="experimental-general"/>

上下文形参允许函数和属性声明依赖项，这些依赖项在周围的上下文中隐式可用。

使用上下文形参，你无需手动传递在函数调用集中共享且很少更改的值，例如服务或依赖项。

上下文形参取代了旧的实验性特性，称为上下文接收者 (context receivers)。要从上下文接收者迁移到上下文形参，你可以使用 IntelliJ IDEA 中的辅助支持，如[博文](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)所述。

主要区别在于，上下文形参不会作为接收者引入函数体中。因此，你需要使用上下文形参的名称来访问其成员，这与上下文接收者不同，后者上下文是隐式可用的。

Kotlin 中的上下文形参在通过简化的依赖注入、改进的 DSL 设计和作用域操作来管理依赖项方面取得了显著改进。有关更多信息，请参见该特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 提案。

#### 如何声明上下文形参

你可以使用 `context` 关键字后跟形参列表（每个形参形式为 `name: Type`）来为属性和函数声明上下文形参。以下是依赖于 `UserService` 接口的示例：

```kotlin
// UserService 定义了上下文中所需的依赖项
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文形参的函数
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中的 log
    users.log("Log: $message")
}

// 声明一个带有上下文形参的属性
context(users: UserService)
val firstUser: String
    // 使用上下文中的 findUserById
    get() = users.findUserById(1)
```

你可以使用 `_` 作为上下文形参名称。在这种情况下，形参的值可用于解析，但不能在代码块内通过名称访问：

```kotlin
// 使用 "_" 作为上下文形参名称
context(_: UserService)
fun logWelcome() {
    // 从 UserService 中查找适当的 log 函数
    outputMessage("Welcome!")
}
```

#### 如何启用上下文形参

要在你的项目中启用上下文形参，请在命令行中使用以下编译器选项：

```Bash
-Xcontext-parameters
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> 同时指定 `-Xcontext-receivers` 和 `-Xcontext-parameters` 编译器选项会导致错误。
>
{style="warning"}

#### 留下反馈

此特性计划在未来的 Kotlin 版本中稳定并改进。
我们感谢你在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 上提供的反馈。

### 上下文敏感解析预览
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 在预览版中引入了上下文敏感解析的实现。

以前，即使可以从上下文中推断出类型，你也必须编写枚举条目或密封类成员的完整名称。
例如：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

现在，通过上下文敏感解析，你可以在已知预期类型的上下文中省略类型名称：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根据已知的 problem 类型解析枚举条目
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

编译器使用此上下文类型信息来解析正确的成员。此信息包括但不限于：

*   `when` 表达式的主语
*   显式返回类型
*   声明的变量类型
*   类型检测 (`is`) 和类型转换 (`as`)
*   密封类层次结构的已知类型
*   声明的形参类型

> 上下文敏感解析不适用于函数、带有形参的属性或带有接收者的扩展属性。
>
{style="note"}

要在你的项目中试用上下文敏感解析，请在命令行中使用以下编译器选项：

```bash
-Xcontext-sensitive-resolution
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

我们计划在未来的 Kotlin 版本中稳定并改进此特性，并感谢你在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 上提供的反馈。

### 注解使用点目标特性预览
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一些特性，使注解使用点目标 (annotation use-site targets) 的使用更加便捷。

#### 属性的 `@all` 元目标
<primary-label ref="experimental-general"/>

Kotlin 允许你将注解附加到声明的特定部分，称为[使用点目标](annotations.md#annotation-use-site-targets)。
然而，单独注解每个目标既复杂又容易出错：

```kotlin
data class User(
    val username: String,

    @param:Email      // 构造函数形参
    @field:Email      // 幕后字段
    @get:Email        // Getter 方法
    @property:Email   // Kotlin 属性引用
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

为了简化此过程，Kotlin 引入了新的属性 `@all` 元目标。
此特性指示编译器将注解应用于属性的所有相关部分。当你使用它时，
`@all` 尝试将注解应用于：

*   **`param`**：构造函数形参，如果声明在主构造函数中。
*   **`property`**：Kotlin 属性本身。
*   **`field`**：幕后字段（如果存在）。
*   **`get`**：getter 方法。
*   **`setparam`**：setter 方法的形参，如果属性定义为 `var`。
*   **`RECORD_COMPONENT`**：如果类是 `@JvmRecord`，则注解也应用于 [Java record 组件](#improved-support-for-annotating-jvm-records)。此行为模仿了 Java 处理 record 组件上注解的方式。

编译器仅将注解应用于给定属性的目标。

在以下示例中，`@Email` 注解应用于每个属性的所有相关目标：

```kotlin
data class User(
    val username: String,

    // 将 @Email 应用于 param、property、field、
    // get 和 setparam（如果是 var）
    @all:Email val email: String,
) {
    // 将 @Email 应用于 property、field 和 get
    // （没有 param，因为它不在构造函数中）
    @all:Email val secondaryEmail: String? = null
}
```

你可以将 `@all` 元目标与任何属性一起使用，无论是在主构造函数内部还是外部。但是，
你不能将 `@all` 元目标与[多个注解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)一起使用。

这项新特性简化了语法，确保了一致性，并改进了与 Java records 的互操作性。

要在你的项目中启用 `@all` 元目标，请在命令行中使用以下编译器选项：

```Bash
-Xannotation-target-all
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

此特性处于预览版。请将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。
有关 `@all` 元目标的更多信息，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

#### 注解使用点目标的新默认规则
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了将注解传播到形参、字段和属性的新默认规则。
以前，注解默认只应用于 `param`、`property` 或 `field` 之一，现在默认值更符合注解的预期行为。

如果存在多个适用目标，则按以下方式选择一个或多个：

*   如果构造函数形参目标 (`param`) 适用，则使用它。
*   如果属性目标 (`property`) 适用，则使用它。
*   如果 `field` 目标适用而 `property` 不适用，则使用 `field`。

如果存在多个目标，并且 `param`、`property` 或 `field` 均不适用，则注解将导致错误。

要启用此特性，请将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或者使用编译器的命令行实参：

```Bash
-Xannotation-default-target=param-property
```

如果你想使用旧行为，可以：

*   在特定情况下，显式定义所需的目标，例如，使用 `@param:Annotation` 而不是 `@Annotation`。
*   对于整个项目，在你的 Gradle 构建文件中使用此标志：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

此特性处于预览版。请将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。
有关注解使用点目标的新默认规则的更多信息，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

### 支持嵌套类型别名
<primary-label ref="beta"/>

以前，你只能在 Kotlin 文件的顶层声明[类型别名](type-aliases.md)。这意味着
即使是内部或领域特定的类型别名也必须存在于使用它们的类之外。

从 2.2.0 开始，你可以在其他声明中定义类型别名，只要它们不捕获其外部类的类型形参：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

嵌套类型别名有一些额外的限制，例如不能提及类型形参。关于所有规则，请查看[文档](type-aliases.md#nested-type-aliases)。

嵌套类型别名通过改进封装、减少包级别混乱和简化内部实现，实现更简洁、更易维护的代码。

#### 如何启用嵌套类型别名

要在你的项目中启用嵌套类型别名，请在命令行中使用以下编译器选项：

```bash
-Xnested-type-aliases
```

或者将其添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 分享你的反馈

嵌套类型别名目前处于 [Beta](components-stability.md#stability-levels-explained) 阶段。请将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。有关此特性的更多信息，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 提案。

### 稳定特性：守卫条件、非局部 `break` 和 `continue` 以及多美元符号内插

在 Kotlin 2.1.0 中，一些新的语言特性在预览版中引入。
我们很高兴地宣布，以下语言特性已在此版本中[稳定](components-stability.md#stability-levels-explained)：

*   [带有主语的 `when` 表达式中的守卫条件](control-flow.md#guard-conditions-in-when-expressions)
*   [非局部 `break` 和 `continue`](inline-functions.md#break-and-continue)
*   [多美元符号内插：改进了字符串字面值中 `$var` 表达式的处理](strings.md#multi-dollar-string-interpolation)

[请参见 Kotlin 语言设计特性和提案的完整列表](kotlin-language-features-and-proposals.md)。

## Kotlin 编译器：统一管理编译器警告
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的编译器选项 `-Xwarning-level`。它旨在提供一种统一管理 Kotlin 项目中编译器警告的方式。

以前，你只能应用通用的模块级规则，例如使用 `-nowarn` 禁用所有警告，使用 `-Werror` 将所有警告转换为编译错误，或者使用 `-Wextra` 启用额外的编译器检测。唯一可以针对特定警告进行调整的选项是 `-Xsuppress-warning`。

有了新的解决方案，你可以覆盖通用规则，并以一致的方式排除特定诊断信息。

### 如何应用

新的编译器选项具有以下语法：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`：将指定的警告提升为错误。
*   `warning`：发出警告，默认启用。
*   `disabled`：完全抑制指定警告在模块范围内。

请记住，你只能使用新的编译器选项配置**警告**的严重级别。

### 用例

通过新的解决方案，你可以通过将通用规则与特定规则相结合，更好地微调项目中的警告报告。
选择你的用例：

#### 抑制警告

| 命令                                           | 描述                                            |
|------------------------------------------------|-------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)      | 编译期间抑制所有警告。                        |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`     | 仅抑制指定警告。                              |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制所有警告，除了指定的警告。                |

#### 将警告提升为错误

| 命令                                           | 描述                                                    |
|------------------------------------------------|---------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)      | 将所有警告提升为编译错误。                            |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`        | 仅将指定警告提升为错误。                              |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将所有警告提升为错误，除了指定的警告。                |

#### 启用额外的编译器警告

| 命令                                            | 描述                                                                                              |
|-------------------------------------------------|---------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)       | 启用所有额外的声明、表达式和类型编译器检测，如果为 true 则发出警告。                                |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`       | 仅启用指定的额外编译器检测。                                                                    |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用所有额外检测，除了指定的检测。                                                              |

#### 警告列表

如果你有许多警告要从通用规则中排除，可以通过 [`@argfile`](compiler-reference.md#argfile) 将它们列在一个单独的文件中。

### 留下反馈

新的编译器选项仍处于[实验性](components-stability.md#stability-levels-explained)阶段。请
将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。

## Kotlin/JVM

Kotlin 2.2.0 为 JVM 带来了许多更新。编译器现在支持 Java 24 字节码，并引入了接口函数默认方法生成的更改。此版本还简化了 Kotlin 元数据中注解的处理，改进了与内联值类的 Java 互操作性，并包含了对注解 JVM records 的更好支持。

### 接口函数默认方法生成的更改

从 Kotlin 2.2.0 开始，除非另行配置，否则接口中声明的函数将编译为 JVM 默认方法。
此更改影响 Kotlin 接口中带有实现的函数如何编译为字节码。

此行为由新的稳定编译器选项 `-jvm-default` 控制，它取代了已弃用的 `-Xjvm-default` 选项。

你可以使用以下值控制 `-jvm-default` 选项的行为：

*   `enable`（默认）：在接口中生成默认实现，并在子类和 `DefaultImpls` 类中包含桥接函数。使用此模式可以与旧版 Kotlin 保持二进制兼容性。
*   `no-compatibility`：仅在接口中生成默认实现。此模式跳过兼容性桥接和 `DefaultImpls` 类，适用于新代码。
*   `disable`：禁用接口中的默认实现。仅生成桥接函数和 `DefaultImpls` 类，与 Kotlin 2.2.0 之前的行为匹配。

要配置 `-jvm-default` 编译器选项，请在 Gradle Kotlin DSL 中设置 `jvmDefault` 属性：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支持读取和写入 Kotlin 元数据中的注解
<primary-label ref="experimental-general"/>

以前，你必须使用反射或字节码分析从已编译的 JVM 类文件中读取注解，并根据签名手动将它们与元数据条目匹配。
此过程容易出错，特别是对于重载函数。

现在，在 Kotlin 2.2.0 中，[](metadata-jvm.md) 引入了对读取存储在 Kotlin 元数据中的注解的支持。

要使注解在已编译文件的元数据中可用，请添加以下编译器选项：

```kotlin
-Xannotations-in-metadata
```

或者，将其添加到 Gradle 构建文件的 `compilerOptions {}` 代码块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

启用此选项后，Kotlin 编译器会将注解与 JVM 字节码一起写入元数据中，使 `kotlin-metadata-jvm` 库可以访问它们。

该库提供了以下用于访问注解的 API：

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

这些 API 是[实验性的](components-stability.md#stability-levels-explained)。
要选择启用，请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解。

以下是从 Kotlin 元数据读取注解的示例：

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> 如果你在项目中使用 `kotlin-metadata-jvm` 库，我们建议测试和更新你的代码以支持注解。
> 否则，当元数据中的注解在未来的 Kotlin 版本中[默认启用](https://youtrack.jetbrains.com/issue/KT-75736)时，你的项目可能会
> 产生无效或不完整的元数据。
>
> 如果你遇到任何问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/issue/KT-31857)中报告。
>
{style="warning"}

### 改进了与内联值类的 Java 互操作性
<primary-label ref="experimental-general"/>

> 对 IntelliJ IDEA 中此特性的代码分析、代码补全和高亮显示目前仅在 [2025.3 EAP 构建](https://www.jetbrains.com/idea/nextversion/)中可用。
>
{style = "note"}

Kotlin 2.2.0 引入了一个新的实验性注解：[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)。此注解使得从 Java 中使用[内联值类](inline-classes.md)变得更容易。

默认情况下，Kotlin 将内联值类编译为使用**未装箱表示**，这更具性能，但通常
很难甚至不可能从 Java 中使用。例如：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在这种情况下，因为该类是未装箱的，所以 Java 没有可调用的构造函数。Java 也没有办法触发 `init` 代码块来确保 `number` 是正数。

当你使用 `@JvmExposeBoxed` 注解该类时，Kotlin 会生成一个公共构造函数，Java 可以直接调用它，
确保 `init` 代码块也运行。

你可以将 `@JvmExposeBoxed` 注解应用于类、构造函数或函数级别，以获得对哪些内容暴露给 Java 的细粒度控制。

例如，在以下代码中，扩展函数 `.timesTwoBoxed()` **无法**从 Java 中访问：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

为了能够创建 `MyInt` 类的实例并从 Java 代码中调用 `.timesTwoBoxed()` 函数，
请将 `@JvmExposeBoxed` 注解同时添加到类和函数中：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

使用这些注解，Kotlin 编译器会为 `MyInt` 类生成一个 Java 可访问的构造函数。它还会为使用值类的装箱形式的扩展函数生成一个重载。因此，以下 Java 代码可以成功运行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果你不想注解你想要暴露的内联值类的每个部分，你可以将注解有效地应用于整个模块。要将此行为应用于模块，请使用 `-Xjvm-expose-boxed` 选项编译它。使用此选项进行编译的效果与模块中的每个声明都具有 `@JvmExposeBoxed` 注解相同。

这项新注解不会改变 Kotlin 在内部编译或使用值类的方式，所有现有编译代码仍然有效。它只是增加了新的功能以改进 Java 互操作性。使用值类的 Kotlin 代码的性能不受影响。

`@JvmExposeBoxed` 注解对于希望暴露成员函数的装箱变体并接收装箱返回类型的库作者很有用。它消除了在内联值类（高效但仅限 Kotlin）和数据类（Java 兼容但始终装箱）之间进行选择的需要。

有关 `@JvmExposedBoxed` 注解如何工作以及它解决了哪些问题的更详细解释，
请参见此 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案。

### 改进了对注解 JVM records 的支持

Kotlin 自 Kotlin 1.5.0 起就支持 [JVM records](jvm-records.md)。现在，Kotlin 2.2.0 改进了 Kotlin 处理 record 组件上的注解的方式，特别是与 Java 的 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目标相关的部分。

首先，如果你想将 `RECORD_COMPONENT` 用作注解目标，你需要手动为 Kotlin (`@Target`) 和 Java 添加注解。这是因为 Kotlin 的 `@Target` 注解不支持 `RECORD_COMPONENT`。例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手动维护这两个列表容易出错，因此 Kotlin 2.2.0 引入了如果 Kotlin 和 Java 目标不匹配时的编译器警告。例如，如果你在 Java 目标列表中省略 `ElementType.CLASS`，编译器会报告：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

其次，Kotlin 在 record 中传播注解的行为与 Java 不同。在 Java 中，record 组件上的注解会自动应用于幕后字段、getter 和构造函数形参。Kotlin 默认不这样做，但你现在可以使用 [`@all:` 使用点目标](#all-meta-target-for-properties)来复制此行为。

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当你将 `@JvmRecord` 与 `@all:` 一起使用时，Kotlin 现在会：

*   将注解传播到属性、幕后字段、构造函数形参和 getter。
*   如果注解支持 Java 的 `RECORD_COMPONENT`，也会将其应用于 record 组件。

## Kotlin/Native

从 2.2.0 开始，Kotlin/Native 使用 LLVM 19。此版本还带来了几个实验性特性，旨在跟踪和调整内存消耗。

### 每对象内存分配
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的[内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)现在可以按对象预留内存。在某些情况下，这可以帮助你满足严格的内存限制或减少应用程序启动时的内存消耗。

这项新特性旨在取代 `-Xallocator=std` 编译器选项，该选项启用了系统内存分配器而不是默认的内存分配器。现在，你可以在不切换内存分配器的情况下禁用缓冲（分配分页）。

此特性目前处于[实验性](components-stability.md#stability-levels-explained)阶段。
要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.pagedAllocator=false
```

请将任何问题报告到我们的问题跟踪器 [YouTrack](https://kotl.in/issue)。

### 运行时支持 Latin-1 编码字符串
<primary-label ref="experimental-opt-in"/>

Kotlin 现在支持 Latin-1 编码字符串，类似于 [JVM](https://openjdk.org/jeps/254)。这应该有助于
减小应用程序的二进制大小并调整内存消耗。

默认情况下，Kotlin 中的字符串使用 UTF-16 编码存储，其中每个字符由两个字节表示。
在某些情况下，这会导致字符串在二进制文件中占用的空间是源代码的两倍，并且
从简单的 ASCII 文件读取数据可能占用磁盘存储文件的两倍内存。

而 [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 编码则用一个字节表示前 256 个 Unicode 字符中的每个字符。启用 Latin-1 支持后，只要所有字符都在其范围内，字符串就以 Latin-1 编码存储。否则，将使用默认的 UTF-16 编码。

#### 如何启用 Latin-1 支持

此特性目前处于[实验性](components-stability.md#stability-levels-explained)阶段。
要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.latin1Strings=true
```
#### 已知问题

只要此特性处于实验性阶段，cinterop 扩展函数 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率就会降低。每次调用它们都可能触发字符串自动转换为 UTF-16。

Kotlin 团队非常感谢 Google 的同事，特别是 [Sonya Valchuk](https://github.com/pyos) 实现了这项特性。

有关 Kotlin 中内存消耗的更多信息，请参见[文档](native-memory-manager.md#memory-consumption)。

### 改进了 Apple 平台上的内存消耗跟踪

从 Kotlin 2.2.0 开始，Kotlin 代码分配的内存现在会被标记。这可以帮助你调试 Apple 平台上的内存问题。

当你检查应用程序的高内存使用情况时，你现在可以识别 Kotlin 代码保留了多少内存。
Kotlin 的份额会被一个标识符标记，并可以通过 Xcode Instruments 中的 VM Tracker 等工具进行跟踪。

此特性默认启用，但仅在 Kotlin/Native 默认内存分配器满足**所有**以下条件时才可用：

*   **标记已启用**。内存应标记为有效的标识符。Apple 建议使用 240 到 255 之间的数字；默认值为 246。

    如果你设置了 `kotlin.native.binary.mmapTag=0` Gradle 属性，则禁用标记。

*   **使用 mmap 分配**。分配器应使用 `mmap` 系统调用将文件映射到内存中。

    如果你设置了 `kotlin.native.binary.disableMmap=true` Gradle 属性，则默认分配器使用 `malloc` 而不是 `mmap`。

*   **分页已启用**。分配的分页（缓冲）应启用。

    如果你设置了 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 属性，则内存将按对象预留。

有关 Kotlin 中内存消耗的更多信息，请参见[文档](native-memory-manager.md#memory-consumption)。

### LLVM 从 16 更新到 19

在 Kotlin 2.2.0 中，我们将 LLVM 从版本 16 更新到了 19。
新版本包括性能改进、错误修复和安全更新。

此更新不应影响你的代码，但如果你遇到任何问题，请将其报告到我们的[问题跟踪器](http://kotl.in/issue)。

### Windows 7 目标平台已弃用

从 Kotlin 2.2.0 开始，支持的最低 Windows 版本已从 Windows 7 提升到 Windows 10。由于
Microsoft 已于 2025 年 1 月终止对 Windows 7 的支持，我们也决定弃用此旧目标平台。

更多信息，请参见[](native-target-support.md)。

## Kotlin/Wasm

在此版本中，[Wasm 目标平台的构建基础设施已与 JavaScript 目标平台分离](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。此外，你现在可以[按项目或模块配置 Binaryen 工具](#per-project-binaryen-configuration)。

### Wasm 目标平台的构建基础设施已与 JavaScript 目标平台分离

以前，`wasmJs` 目标平台与 `js` 目标平台共享相同的基础设施。因此，两个目标平台都托管在相同的
目录 (`build/js`) 中，并使用相同的 NPM 任务和配置。

现在，`wasmJs` 目标平台拥有自己独立于 `js` 目标平台的基础设施。这使得
Wasm 任务和类型与 JavaScript 任务和类型区分开来，从而可以独立配置。

此外，Wasm 相关项目文件和 NPM 依赖项现在存储在单独的 `build/wasm` 目录中。

已为 Wasm 引入了新的 NPM 相关任务，而现有 JavaScript 任务现在仅专用于 JavaScript：

| **Wasm 任务**         | **JavaScript 任务** |
|-------------------------|-----------------------|
| `kotlinWasmNpmInstall`  | `kotlinNpmInstall`    |
| `wasmRootPackageJson`   | `rootPackageJson`     |

类似地，已添加了新的 Wasm 特定声明：

| **Wasm 声明**     | **JavaScript 声明** |
|---------------------|-----------------------|
| `WasmNodeJsRootPlugin` | `NodeJsRootPlugin`    |
| `WasmNodeJsPlugin`  | `NodeJsPlugin`        |
| `WasmYarnPlugin`    | `YarnPlugin`          |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension` |
| `WasmNodeJsEnvSpec` | `NodeJsEnvSpec`       |
| `WasmYarnRootEnvSpec` | `YarnRootEnvSpec`     |

你现在可以独立于 JavaScript 目标平台处理 Wasm 目标平台，这简化了配置过程。

此更改默认启用，无需额外设置。

### 每项目 Binaryen 配置

Binaryen 工具用于 Kotlin/Wasm [默认优化生产构建](whatsnew20.md#optimized-production-builds-by-default-using-binaryen)，
以前只能在根项目中配置一次。

现在，你可以按项目或模块配置 Binaryen 工具。此更改与 Gradle 的最佳实践保持一致，并
确保更好地支持[项目隔离](https://docs.gradle.org/current/userguide/isolated_projects.html)等特性，
从而提高复杂构建的构建性能和可靠性。

此外，如果需要，你现在可以为不同的模块配置不同版本的 Binaryen。

此特性默认启用。但是，如果你有自定义的 Binaryen 配置，
你现在需要按项目应用它，而不是仅在根项目中应用。

## Kotlin/JS

此版本改进了 [`@JsPlainObject` 接口中的 `copy()` 函数](#fix-for-copy-in-jsplainobject-interfaces)、
[带有 `@JsModule` 注解的文件中的类型别名](#support-for-type-aliases-in-files-with-jsmodule-annotation)以及其他 Kotlin/JS 特性。

### 修复了 `@JsPlainObject` 接口中的 `copy()`

Kotlin/JS 有一个实验性插件 `js-plain-objects`，它为用 `@JsPlainObject` 注解的接口引入了 `copy()` 函数。
你可以使用 `copy()` 函数来操作对象。

然而，`copy()` 的初始实现与继承不兼容，这在 `@JsPlainObject` 接口扩展其他接口时导致了问题。

为了避免对普通对象的限制，`copy()` 函数已从对象本身移动到其伴生对象：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 此语法不再有效
    val copy = user.copy(age = 35)      
    // 这是正确的语法
    val copy = User.copy(user, age = 35)
}
```

此更改解决了继承层级中的冲突并消除了歧义。
从 Kotlin 2.2.0 开始，此更改默认启用。

### 支持带有 `@JsModule` 注解的文件中的类型别名

以前，用 `@JsModule` 注解来从 JavaScript 模块导入声明的文件
仅限于外部声明。这意味着你无法在此类文件中声明 `typealias`。

从 Kotlin 2.2.0 开始，你可以在标记为 `@JsModule` 的文件中声明类型别名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

此更改减少了 Kotlin/JS 互操作性限制的一个方面，并且计划在未来的版本中进行更多改进。

带有 `@JsModule` 的文件中的类型别名支持默认启用。

### 支持在多平台 `expect` 声明中使用 `@JsExport`

在 Kotlin 多平台项目中处理 [`expect/actual` 机制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)时，
无法在公共代码中的 `expect` 声明中使用 `@JsExport` 注解。

从此版本开始，你可以直接将 `@JsExport` 应用于 `expect` 声明：

```kotlin
// commonMain

// 以前会报错，但现在可以正常工作
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

你还必须在 JavaScript 源代码集中使用 `@JsExport` 注解相应的 `actual` 实现，
并且它必须只使用可导出类型。

此修复允许 `commonMain` 中定义的共享代码正确导出到 JavaScript。你现在可以
将你的多平台代码暴露给 JavaScript 使用者，而无需使用手动变通方法。

此更改默认启用。

### 能够将 `@JsExport` 与 `Promise<Unit>` 类型一起使用

以前，当你尝试使用 `@JsExport` 注解导出返回 `Promise<Unit>` 类型的函数时，
Kotlin 编译器会产生错误。

虽然像 `Promise<Int>` 这样的返回类型可以正常工作，但使用 `Promise<Unit>` 会触发“不可导出类型”警告，
即使它在 TypeScript 中正确映射到 `Promise<void>`。

此限制已删除。现在，以下代码可以编译成功，没有错误：

```kotlin
// 以前可以正常工作
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 以前会报错，但现在可以正常工作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

此更改消除了 Kotlin/JS 互操作模型中不必要的限制。此修复默认启用。

## Gradle

Kotlin 2.2.0 完全兼容 Gradle 7.6.3 到 8.14。你也可以使用最新版本的 Gradle。
但是，请注意，这样做可能会导致弃用警告，并且一些新的 Gradle 特性可能无法工作。

在此版本中，Kotlin Gradle 插件对其诊断功能进行了一些改进。
它还引入了[二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)的实验性集成，使得使用库变得更加容易。

### Kotlin Gradle 插件中包含二进制兼容性验证
<primary-label ref="experimental-general"/>

为了更容易检查库版本之间的二进制兼容性，我们正在尝试将 [binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) 的功能集成到 Kotlin Gradle 插件 (KGP) 中。
你可以在玩具项目中尝试，但我们暂时不建议在生产环境中使用。

原始的 [binary compatibility validator](https://github.com/Kotlin/binary-compatibility-validator) 在此实验阶段将继续维护。

Kotlin 库可以使用两种二进制格式之一：JVM class files 或 `klib`。由于这些格式不兼容，
KGP 分别处理它们。

要启用二进制兼容性验证特性集，请在 `build.gradle.kts` 文件中的 `kotlin{}` 代码块中添加以下内容：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函数以确保与旧版 Gradle 兼容
        enabled.set(true)
    }
}
```

如果你的项目有多个模块需要检查二进制兼容性，请在每个模块中单独配置此特性。
每个模块都可以有自己的自定义配置。

启用后，运行 `checkLegacyAbi` Gradle 任务以检查二进制兼容性问题。你可以在
IntelliJ IDEA 中或在项目目录中的命令行中运行此任务：

```kotlin
./gradlew checkLegacyAbi
```

此任务从当前代码生成应用程序二进制接口 (ABI) 转储，作为 UTF-8 文本文件。
然后，该任务将新转储与先前版本的转储进行比较。如果任务发现任何差异，
它将报告为错误。在审阅错误后，如果你认为更改可以接受，你可以通过运行 `updateLegacyAbi` Gradle 任务来更新引用 ABI 转储。

#### 过滤类

此特性允许你在 ABI 转储中过滤类。你可以通过名称或部分名称，或通过标记它们的注解（或注解名称的一部分）显式包含或排除类。

例如，此示例排除了 `com.company` 包中的所有类：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

探索 [KGP API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/)以了解有关配置二进制兼容性验证器的更多信息。

#### 多平台限制

在多平台项目中，如果你的宿主机不支持所有目标平台的交叉编译，KGP 会尝试通过检查其他目标平台的 ABI 转储来推断不支持目标平台的 ABI 更改。这种方法有助于避免在你稍后切换到**可以**编译所有目标平台的宿主机时出现错误的验证失败。

你可以更改此默认行为，以便 KGP 不推断不支持目标平台的 ABI 更改，方法是将以下内容添加到你的 `build.gradle.kts` 文件中：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

但是，如果你的项目中有一个不支持的目标平台，运行 `checkLegacyAbi` 任务将失败，因为该任务无法创建 ABI 转储。如果你认为检查失败比因为从其他目标平台推断出的 ABI 更改而错过不兼容的更改更重要，那么这种行为可能是可取的。

### 支持 Kotlin Gradle 插件在控制台中输出富文本

在 Kotlin 2.2.0 中，我们支持 Gradle 构建过程中在控制台中输出颜色和其他富文本，从而
更容易阅读和理解报告的诊断信息。

富文本输出可在 Linux 和 macOS 上支持的终端模拟器中使用，我们正在努力为 Windows 添加支持。

![Gradle console](gradle-console-rich-output.png){width=600}

此特性默认启用，但如果你想覆盖它，请将以下 Gradle 属性添加到你的 `gradle.properties` 文件中：

```
org.gradle.console=plain
```

有关此属性及其选项的更多信息，请参见 Gradle 文档中关于[自定义日志格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)的部分。

### Problems API 与 KGP 诊断功能的集成

以前，Kotlin Gradle 插件 (KGP) 只能将警告和错误等诊断信息作为纯文本输出到控制台或日志。

从 2.2.0 开始，KGP 引入了一种额外的报告机制：它现在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，
这是一种在构建过程中报告丰富、结构化问题信息的标准化方式。

KGP 诊断信息现在更易于阅读，并且在不同的界面（例如 Gradle CLI 和 IntelliJ IDEA）中显示更一致。

此集成从 Gradle 8.6 或更高版本开始默认启用。
由于 API 仍在不断发展，请使用最新的 Gradle 版本以受益于最新的改进。

### KGP 与 `--warning-mode` 的兼容性

Kotlin Gradle 插件 (KGP) 诊断功能以前使用固定的严重级别报告问题，
这意味着 Gradle 的 [`--warning-mode` 命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)对 KGP 显示错误的方式没有影响。

现在，KGP 诊断功能与 `--warning-mode` 选项兼容，提供了更大的灵活性。例如，
你可以将所有警告转换为错误或完全禁用警告。

通过此更改，KGP 诊断功能会根据选择的警告模式调整输出：

*   当你设置 `--warning-mode=fail` 时，严重级别为 `Severity.Warning` 的诊断信息现在会升级为 `Severity.Error`。
*   当你设置 `--warning-mode=none` 时，严重级别为 `Severity.Warning` 的诊断信息不会被记录。

此行为从 2.2.0 开始默认启用。

要忽略 `--warning-mode` 选项，请在你的 `gradle.properties` 文件中设置以下 Gradle 属性：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的实验性构建工具 API
<primary-label ref="experimental-general"/>

你可以将 Kotlin 与各种构建系统（例如 Gradle、Maven、Amper 等）一起使用。然而，将 Kotlin 集成到每个系统中以支持完整的功能集（例如增量编译以及与 Kotlin 编译器插件、守护进程和 Kotlin Multiplatform 的兼容性）需要付出巨大的努力。

为了简化此过程，Kotlin 2.2.0 引入了一个新的实验性构建工具 API (BTA)。BTA 是一个通用 API，充当构建系统和 Kotlin 编译器生态系统之间的抽象层。通过这种方法，每个构建系统只需支持一个 BTA 入口点。

目前，BTA 仅支持 Kotlin/JVM。JetBrains 的 Kotlin 团队已在 Kotlin Gradle 插件 (KGP) 和 `kotlin-maven-plugin` 中使用它。你可以通过这些插件尝试 BTA，但 API 本身尚未准备好用于你自己的构建工具集成。如果你对 BTA 提案感到好奇或想分享你的反馈，请参见此 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案。

要尝试 BTA：

*   在 KGP 中，将以下属性添加到你的 `gradle.properties` 文件中：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

*   在 Maven 中，你无需执行任何操作。它默认启用。

BTA 目前对 Maven 插件没有直接好处，但它为更快地交付新特性奠定了坚实的基础，例如[支持 Kotlin 守护进程](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default)和[增量编译的稳定化](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)。

对于 KGP，使用 BTA 已经有以下好处：

*   [改进的“进程内”编译器执行策略](#improved-in-process-compiler-execution-strategy)
*   [更灵活地从 Kotlin 配置不同的编译器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改进的“进程内”编译器执行策略

KGP 支持三种 [Kotlin 编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。
以前，“进程内”策略（在 Gradle 守护进程中运行编译器）不支持增量编译。

现在，使用 BTA，“进程内”策略**确实**支持增量编译。要使用它，请将以下
属性添加到你的 `gradle.properties` 文件中：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### 灵活地从 Kotlin 配置不同的编译器版本

有时你可能希望在代码中使用较新的 Kotlin 编译器版本，同时将 KGP 保持在较旧的版本上——例如，在处理构建脚本弃用时尝试新的语言特性。或者你可能希望更新 KGP 的版本但保留较旧的 Kotlin 编译器版本。

BTA 使这成为可能。以下是你在 `build.gradle.kts` 文件中配置它的方法：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 与 2.2.0 版本不同
}

```

BTA 支持配置 KGP 和 Kotlin 编译器版本，支持前三个主要版本和一个后续主要版本。因此，在 KGP 2.2.0 中，Kotlin 编译器版本 2.1.x、2.0.x 和 1.9.25 均受支持。
KGP 2.2.0 也兼容未来的 Kotlin 编译器版本 2.2.x 和 2.3.x。

但是，请记住，将不同的编译器版本与编译器插件一起使用可能会导致 Kotlin 编译器异常。Kotlin 团队计划在未来的版本中解决此类问题。

通过这些插件尝试 BTA，并在[KGP](https://youtrack.jetbrains.com/issue/KT-56574) 和 [Maven 插件](https://youtrack.jetbrains.com/issue/KT-73012)的 YouTrack 专用工单中向我们发送你的反馈。

## Kotlin 标准库

在 Kotlin 2.2.0 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在已[稳定](components-stability.md#stability-levels-explained)。

### 稳定的 Base64 编码和解码

Kotlin 1.8.20 引入了 [Base64 编码和解码的实验性支持](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin 2.2.0 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 现在已[稳定](components-stability.md#stability-levels-explained)，并
包含四种编码方案，此版本新增了 `Base64.Pem`：

*   [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用标准 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

    > `Base64.Default` 是 `Base64` 类的伴生对象。
    > 因此，你可以使用 `Base64.encode()` 和 `Base64.decode()` 而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()` 来调用其函数。
    >
    {style="tip"}

*   [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用“URL 和文件名安全”编码方案。
*   [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8)
    编码方案，在编码期间每 76 个字符插入一个行分隔符，并在解码期间跳过非法字符。
*   `Base64.Pem` 以与 `Base64.Mime` 类似的方式编码数据，但将行长度限制为 64 个字符。

你可以使用 Base64 API 将二进制数据编码为 Base64 字符串，并将其解码回字节。

以下是一个示例：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 另一种方法：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 另一种方法：
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

在 JVM 上，使用 `.encodingWith()` 和 `.decodingWith()` 扩展函数通过输入和输出流进行 Base64 编码和解码：

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### 使用 `HexFormat` API 进行稳定的十六进制解析和格式化

在 [Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在已[稳定](components-stability.md#stability-levels-explained)。
你可以使用它在数值和十六进制字符串之间进行转换。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

更多信息，请参见[新的 HexFormat 类用于格式化和解析十六进制数](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。

## Compose 编译器

在此版本中，Compose 编译器引入了对可组合函数引用的支持，并更改了几个特性标志的默认值。

### 支持 `@Composable` 函数引用

从 Kotlin 2.2.0 版本开始，Compose 编译器支持声明和使用可组合函数引用：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

可组合函数引用在运行时与可组合 lambda 对象略有不同。特别是，可组合 lambda 允许通过扩展 `ComposableLambda` 类进行更细粒度的跳过控制。函数引用预计实现 `KCallable` 接口，因此相同的优化无法应用于它们。

### `PausableComposition` 特性标志默认启用

从 Kotlin 2.2.0 开始，`PausableComposition` 特性标志默认启用。此标志调整了
可重启函数的 Compose 编译器输出，允许运行时强制跳过行为，从而有效地
通过跳过每个函数来暂停组合。这允许在帧之间拆分繁重的组合，这将在未来的版本中用于预取。

要禁用此特性标志，请将以下内容添加到你的 Gradle 配置中：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 特性标志默认启用

从 Kotlin 2.2.0 开始，`OptimizeNonSkippingGroups` 特性标志默认启用。此优化
通过删除为不可跳过的可组合函数生成的组调用来提高运行时性能。
它不应导致运行时出现任何可观察到的行为更改。

如果你遇到任何问题，可以通过禁用此特性标志来验证此更改是否导致了问题。
请将任何问题报告到 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)。

要禁用 `OptimizeNonSkippingGroups` 标志，请将以下内容添加到你的 Gradle 配置中：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 已弃用的特性标志

`StrongSkipping` 和 `IntrinsicRemember` 特性标志现在已弃用，并将在未来的版本中删除。
如果你遇到任何导致你禁用这些特性标志的问题，请将其报告到 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126)。

## 破坏性变更与弃用

本节重点介绍了值得注意的重大破坏性变更和弃用。有关此版本中所有破坏性变更和弃用的完整概述，请参见我们的[兼容性指南](compatibility-guide-22.md)。

*   从 Kotlin 2.2.0 开始，对 [](ant.md) 构建系统的支持已弃用。Kotlin 对 Ant 的支持已长时间未进行活跃开发，并且由于其用户群相对较小，目前没有进一步维护的计划。
    
    我们计划在 2.3.0 中移除 Ant 支持。但是，Kotlin 仍然[欢迎贡献](contribute.md)。如果你
    有兴趣成为 Ant 的外部维护者，请在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-75875/)中留下评论，并将可见性设置为“jetbrains-team”。

*   Kotlin 2.2.0 将 [`kotlinOptions{}` Gradle 代码块的弃用级别提升为错误](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。
    请改用 `compilerOptions{}` 代码块。有关更新构建脚本的指导，请参见[从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
*   Kotlin 脚本仍然是 Kotlin 生态系统的重要组成部分，但我们正在专注于特定的用例，例如
    自定义脚本以及 `gradle.kts` 和 `main.kts` 脚本，以提供更好的体验。
    要了解更多信息，请参见我们更新的[博文](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。因此，Kotlin 2.2.0 弃用对以下功能的支持：
    
    *   REPL：要继续通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项选择启用。
    *   JSR-223：由于此 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于 **Withdrawn** 状态，JSR-223
        实现将继续与语言版本 1.9 配合使用，但将来不会迁移到使用 K2 编译器。
    *   `KotlinScriptMojo` Maven 插件：我们认为此插件没有足够的吸引力。如果你继续使用它，你将看到编译器警告。
*   
*   在 Kotlin 2.2.0 中，[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在[替换已配置的源而不是添加](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。
    如果你想添加源而不替换现有源，请使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函数。
*   `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的类型已从 `MutableList<Any>` [更改为 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。如果你的代码当前将列表作为单个元素添加，请使用 `addAll()` 函数而不是 `add()` 函数。
*   继传统 Kotlin/JS 后端中使用的无用代码消除 (DCE) 工具弃用之后，
    与 DCE 相关的其余 DSL 已从 Kotlin Gradle 插件中移除：
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 接口
    *   `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函数
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 接口
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 接口

    当前的 [JS IR 编译器](js-ir-compiler.md)开箱即用支持 DCE，并且 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解允许指定在 DCE 期间保留哪些 Kotlin 函数和类。

*   已弃用的 `kotlin-android-extensions` 插件[已在 Kotlin 2.2.0 中移除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。
    请使用 `kotlin-parcelize` 插件用于 `Parcelable` 实现生成器，并使用 Android Jetpack 的[视图绑定](https://developer.android.com/topic/libraries/view-binding)用于合成视图。
*   实验性的 `kotlinArtifacts` API [已在 Kotlin 2.2.0 中弃用](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。
    请使用 Kotlin Gradle 插件中现有的 DSL 来[构建最终的原生二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。如果不足以进行迁移，请在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953)中留下评论。
*   `KotlinCompilation.source`，在 Kotlin 1.9.0 中已弃用，现在已[从 Kotlin Gradle 插件中移除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
*   实验性通用化模式的参数[已在 Kotlin 2.2.0 中弃用](compatibility-guide-22.md#deprecate-commonization-parameters)。
    清除通用化缓存以删除无效的编译构件。
*   已弃用的 `konanVersion` 属性现在已[从 `CInteropProcess` 任务中移除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。
    请改用 `CInteropProcess.kotlinNativeVersion`。
*   使用已弃用的 `destinationDir` 属性现在将[导致错误](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。
    请改用 `CInteropProcess.destinationDirectory.set()`。

## 文档更新

此版本带来了显著的文档更改，包括将 Kotlin Multiplatform 文档迁移到 [KMP 门户](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)。

此外，我们启动了一项文档调查，创建了新页面和教程，并改进了现有页面。

### Kotlin 的文档调查

我们正在寻求真实的反馈，以改进 Kotlin 文档。

调查大约需要 15 分钟才能完成，你的意见将有助于塑造 Kotlin 文档的未来。

[在此处参与调查](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)。

### 新的和改进的教程

*   [Kotlin 中级教程](kotlin-tour-welcome.md) – 将你对 Kotlin 的理解提升到新的水平。了解何时使用扩展函数、接口、类等。
*   [构建使用 Spring AI 的 Kotlin 应用程序](spring-ai-guide.md) – 学习如何创建一个使用 OpenAI 和向量数据库回答问题的 Kotlin 应用程序。
*   [](jvm-create-project-with-spring-boot.md) – 学习如何使用 IntelliJ IDEA 的 **New Project** 向导通过 Gradle 创建 Spring Boot 项目。
*   [Kotlin 和 C 映射教程系列](mapping-primitive-data-types-from-c.md) – 了解不同类型和构造在 Kotlin 和 C 之间如何映射。
*   [使用 C 互操作和 libcurl 创建应用程序](native-app-with-c-and-libcurl.md) – 创建一个可以使用 libcurl C 库原生运行的简单 HTTP 客户端。
*   [创建你的 Kotlin Multiplatform 库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/create-kotlin-multiplatform-library.html) – 学习如何使用 IntelliJ IDEA 创建和发布多平台库。
*   [使用 Ktor 和 Kotlin Multiplatform 构建全栈应用程序](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 此教程现在使用 IntelliJ IDEA 而不是 Fleet，以及 Material 3 和最新版本的 Ktor 和 Kotlin。
*   [在你的 Compose Multiplatform 应用程序中管理本地资源环境](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-resource-environment.html) – 学习如何管理应用程序的资源环境，例如应用内主题和语言。

### 新的和改进的页面

*   [Kotlin 用于 AI 概述](kotlin-ai-apps-development-overview.md) – 探索 Kotlin 在构建 AI 驱动应用程序方面的能力。
*   [Dokka 迁移指南](https://kotlinlang.org/docs/dokka-migration.html) – 学习如何迁移到 Dokka Gradle 插件的 v2。
*   [](metadata-jvm.md) – 探索有关为 JVM 编译的 Kotlin 类读取、修改和生成元数据的指南。
*   [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) – 通过教程和示例项目了解如何设置环境、添加 Pod 依赖项或将 Kotlin 项目用作 CocoaPod 依赖项。
*   Compose Multiplatform 的新页面，以支持 iOS 稳定版本：
    *   特别是[导航](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation.html)和[深层链接](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-navigation-deep-links.html)。
    *   [在 Compose 中实现布局](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-layout.html)。
    *   [字符串本地化](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-localize-strings.html)和其他国际化页面，例如对 RTL 语言的支持。
*   [Compose 热重载](https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-hot-reload.html) – 学习如何将 Compose 热重载与桌面目标一起使用，以及如何将其添加到现有项目中。
*   [Exposed 迁移](https://www.jetbrains.com/help/exposed/migrations.html) – 了解 Exposed 为管理数据库模式更改提供的工具。

## 如何更新到 Kotlin 2.2.0

Kotlin 插件作为捆绑插件分发在 IntelliJ IDEA 和 Android Studio 中。

要更新到新的 Kotlin 版本，请在构建脚本中[将 Kotlin 版本](releases.md#update-to-a-new-kotlin-version)更改
为 2.2.0。