[//]: # (title: Kotlin 2.2.0 最新变化)

<web-summary>阅读 Kotlin 2.2.0 发布说明，涵盖新的语言功能、Kotlin Multiplatform、JVM、Native、JS 和 Wasm 的更新，以及 Gradle 和 Maven 的构建工具支持。</web-summary>

_[发布日期：2025 年 6 月 23 日](releases.md#release-history)_

Kotlin 2.2.0 正式发布！以下是主要亮点：

* **语言**：预览版中引入了新的语言功能，包括 [上下文参数](#preview-of-context-parameters)。
  几个[此前处于实验性的功能现已稳定](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)，例如守卫条件 (guard conditions)、非局部 break 与 continue 以及多美元符插值 (multi-dollar interpolation)。
* **Kotlin 编译器**：[统一管理编译器警告](#kotlin-compiler-unified-management-of-compiler-warnings)。
* **Kotlin/JVM**：[接口函数默认方法生成的更改](#changes-to-default-method-generation-for-interface-functions)。
* **Kotlin/Native**：[LLVM 19 以及用于跟踪和调整内存消耗的新功能](#kotlin-native)。
* **Kotlin/Wasm**：[分离的 Wasm 目标](#build-infrastructure-for-wasm-target-separated-from-javascript-target)以及[针对每个项目配置 Binaryen](#per-project-binaryen-configuration) 的能力。
* **Kotlin/JS**：[修复了为 `@JsPlainObject` 接口生成的 `copy()` 方法](#fix-for-copy-in-jsplainobject-interfaces)。
* **Gradle**：[Kotlin Gradle 插件中包含二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)。
* **标准库**：[稳定的 Base64 和 HexFormat API](#stable-base64-encoding-and-decoding)。
* **文档**：[对 Kotlin 文档进行了重要改进](#documentation-updates)。

你还可以观看 Kotlin 语言演进团队讨论新功能并回答问题的视频：

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="Kotlin 2.2.0 最新变化"/>

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布过程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 2.2.0 的 Kotlin 插件已捆绑在最新版本的 IntelliJ IDEA 和 Android Studio 中。
你无需在 IDE 中更新 Kotlin 插件。
你只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap.md#adjust-the-kotlin-version)为 2.2.0 即可。

有关详情，请参阅[更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

此版本将守卫条件 (guard conditions)、非局部 `break` 与 `continue` 以及多美元符插值[提升](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)至[稳定 (Stable)](components-stability.md#stability-levels-explained) 阶段。
此外，还有多项功能以预览版形式引入，例如 [上下文参数 (context parameters)](#preview-of-context-parameters) 和 [上下文感知解析 (context-sensitive resolution)](#preview-of-context-sensitive-resolution)。

### 上下文参数预览
<primary-label ref="experimental-general"/> 

上下文参数允许函数和属性声明在周围上下文中隐式可用的依赖项。

通过上下文参数，你无需手动传递诸如服务或依赖项之类的值，这些值在多组函数调用之间共享且很少更改。

上下文参数取代了名为上下文接收器 (context receivers) 的旧实验性功能。要从上下文接收器迁移到上下文参数，你可以使用 IntelliJ IDEA 中的辅助支持，如 [博客文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/) 中所述。

主要区别在于上下文参数不会作为接收器引入到函数体中。因此，你需要使用上下文参数的名称来访问它们的成员，这与上下文接收器不同，后者的上下文是隐式可用的。

Kotlin 中的上下文参数代表了在管理依赖项方面的重大改进，它通过简化的依赖注入、改进的 DSL 设计和作用域操作来实现。有关更多信息，请参阅该功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

#### 如何声明上下文参数

你可以使用 `context` 关键字后跟参数列表（格式均为 `name: Type`）来为属性和函数声明上下文参数。以下是一个依赖于 `UserService` 接口的示例：

```kotlin
// UserService 定义了上下文中所需的依赖项 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文参数的函数
context(users: UserService)
fun outputMessage(message: String) {
    // 使用来自上下文的 log
    users.log("Log: $message")
}

// 声明一个带有上下文参数的属性
context(users: UserService)
val firstUser: String
    // 使用来自上下文的 findUserById    
    get() = users.findUserById(1)
```

你可以使用 `_` 作为上下文参数名称。在这种情况下，参数的值可用于解析，但不能在块内部通过名称访问：

```kotlin
// 使用 "_" 作为上下文参数名称
context(_: UserService)
fun logWelcome() {
    // 从 UserService 中找到合适的 log 函数
    outputMessage("Welcome!")
}
```

#### 如何启用上下文参数

要在项目中启用上下文参数，请在命令行中使用以下编译器选项：

```Bash
-Xcontext-parameters
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

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

#### 留下你的反馈

此功能计划在未来的 Kotlin 版本中进行稳定和改进。
我们非常感谢你在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 上提供的反馈。

### 上下文感知解析预览
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0 在预览版中引入了上下文感知解析 (context-sensitive resolution) 的实现。

你可以在此视频中找到该功能的概述：

<video src="https://www.youtube.com/v/aF8RYQrJI8Q" title="Kotlin 2.2.0 中的上下文感知解析"/>

此前，即使可以从上下文中推断出类型，你也必须写出枚举成员或密封类成员的全名。
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

现在，通过上下文感知解析，你可以在预期类型已知的上下文中省略类型名称：

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 根据已知的 problem 类型解析枚举成员
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

编译器使用此类上下文类型信息来解析正确的成员。这些信息包括（但不限于）：

* `when` 表达式的主体
* 显式返回值类型
* 声明的变量类型
* 类型检查 (`is`) 和转换 (`as`)
* 密封类层次结构的已知类型
* 参数的声明类型

> 上下文感知解析不适用于函数、带参数的属性或带接收器的扩展属性。
>
{style="note"}

要在项目中试用上下文感知解析，请在命令行中使用以下编译器选项：

```bash
-Xcontext-sensitive-resolution
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

我们计划在未来的 Kotlin 版本中稳定并改进此功能，并感谢你在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution) 上提供的反馈。

### 注解使用点目标功能预览
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了几项功能，使处理注解使用点目标 (annotation use-site targets) 更加方便。

#### 属性的 `@all` 元目标
<primary-label ref="experimental-general"/>

Kotlin 允许你将注解附加到声明的特定部分，这被称为 [使用点目标](annotations.md#annotation-use-site-targets)。
然而，逐个为每个目标添加注解既复杂又容易出错：

```kotlin
data class User(
    val username: String,

    @param:Email      // 构造函数形参
    @field:Email      // 支持字段
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

为了简化这一点，Kotlin 为属性引入了新的 `@all` 元目标 (meta-target)。
此功能告诉编译器将注解应用于属性的所有相关部分。当你使用它时，
`@all` 会尝试将注解应用于：

* **`param`**：构造函数形参，如果在主构造函数中声明。

* **`property`**：Kotlin 属性本身。

* **`field`**：支持字段（如果存在）。

* **`get`**：getter 方法。

* **`setparam`**：setter 方法的形参，如果属性定义为 `var`。

* **`RECORD_COMPONENT`**：如果该类是一个 `@JvmRecord`，则注解应用于 [Java record 组件](#improved-support-for-annotating-jvm-records)。此行为模仿了 Java 处理 record 组件上注解的方式。

编译器仅将注解应用于给定属性的目标。

在下面的示例中，`@Email` 注解被应用于每个属性的所有相关目标：

```kotlin
data class User(
    val username: String,

    // 将 @Email 应用于 param、property、field、
    // get 和 setparam (如果是 var)
    @all:Email val email: String,
) {
    // 将 @Email 应用于 property、field 和 get
    // (没有 param，因为它不在构造函数中)
    @all:Email val secondaryEmail: String? = null
}
```

你可以对任何属性使用 `@all` 元目标，无论是在主构造函数内部还是外部。但是，
你不能将 `@all` 元目标与 [多重注解](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation) 一起使用。

这一新功能简化了语法，确保了一致性，并改进了与 Java record 的互操作性。

要在项目中启用 `@all` 元目标，请在命令行中使用以下编译器选项：

```Bash
-Xannotation-target-all
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

此功能处于预览阶段。请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。
有关 `@all` 元目标的更多信息，请阅读此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

#### 使用点注解目标的新默认规则
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了将注解传播到形参、字段和属性的新默认规则。 
以前，注解默认仅应用于 `param`、`property` 或 `field` 中的一个，而现在的默认规则更符合对注解的预期。

如果存在多个适用的目标，将按如下方式选择一个或多个：

* 如果构造函数形参目标 (`param`) 适用，则使用它。
* 如果属性目标 (`property`) 适用，则使用它。
* 如果字段目标 (`field`) 适用而 `property` 不适用，则使用 `field`。

如果存在多个目标，且 `param`、`property` 或 `field` 均不适用，则注解会导致错误。

要启用此功能，请将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

或者为编译器使用命令行参数：

```Bash
-Xannotation-default-target=param-property
```

每当你想要使用旧行为时，你可以：

* 在特定情况下，显式定义所需的目标，例如，使用 `@param:Annotation` 而不是 `@Annotation`。
* 对于整个项目，在 Gradle 构建文件中使用此标志：

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

此功能处于预览阶段。请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。
有关使用点注解目标新默认规则的更多信息，请阅读此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 提案。

### 嵌套类型别名支持
<primary-label ref="beta"/>

Kotlin 2.2.0 增加了在其他声明内部定义类型别名的支持。

你可以在此视频中找到该功能的概述：

<video src="https://www.youtube.com/v/1W6d45IOwWk" title="Kotlin 2.2.0 中的嵌套类型别名"/>

此前，你只能在 Kotlin 文件的顶层声明 [类型别名](type-aliases.md)。这意味着 
即使是内部的或特定领域的类型别名也必须存在于使用它们的类之外。

从 2.2.0 开始，你可以在其他声明内部定义类型别名，只要它们 
不捕获其外部类的类型形参即可：

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

嵌套类型别名有一些额外的约束，例如不能提及类型形参。请查看 [文档](type-aliases.md#nested-type-aliases) 以获取完整的规则集。

嵌套类型别名通过改进封装、减少软件包级的混乱以及简化内部实现，使代码更加整洁、更易于维护。

#### 如何启用嵌套类型别名

要在项目中启用嵌套类型别名，请在命令行中使用以下编译器选项：

```bash
-Xnested-type-aliases
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 分享你的反馈

嵌套类型别名目前处于 [Beta](components-stability.md#stability-levels-explained) 阶段。请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。有关此功能的更多信息， 
请阅读此 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 提案。

### 稳定功能：守卫条件、非局部 `break` 与 `continue` 以及多美元符插值

在 Kotlin 2.1.0 中，有几项新的语言功能以预览版形式引入。
我们很高兴地宣布，以下语言功能在此版本中现已 [稳定 (Stable)](components-stability.md#stability-levels-explained)：

* [带主体的 `when` 中的守卫条件](control-flow.md#guard-conditions-in-when-expressions)
* [非局部 `break` 与 `continue`](inline-functions.md#break-and-continue)
* [多美元符插值：改进了对字符串文字中 `$` 的处理](strings.md#multi-dollar-string-interpolation)

[查看 Kotlin 语言设计功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

## Kotlin 编译器：统一管理编译器警告
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的编译器选项 `-Xwarning-level`。它旨在提供一种 
在 Kotlin 项目中统一管理编译器警告的方法。

以前，你只能应用通用的模块范围规则，例如使用 `-nowarn` 禁用所有警告，使用 `-Werror` 将所有警告转为编译错误，或者使用 `-Wextra` 启用额外的编译器检查。 
针对特定警告调整它们的唯一选项是 `-Xsuppress-warning` 选项。

通过新方案，你可以覆盖通用规则并以一致的方式排除特定的诊断信息。

### 如何应用

新的编译器选项语法如下：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：将指定的警告提升为错误。
* `warning`：发出警告，这是默认启用的。
* `disabled`：在模块范围内完全抑制指定的警告。

请记住，你只能使用新的编译器选项配置 _警告_ 的严重级别。

### 使用场景

通过新方案，你可以通过结合通用规则和特定规则，更好地微调项目中的警告报告。
选择你的使用场景：

#### 抑制警告

| 命令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | 在编译期间抑制所有警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 仅抑制指定的警告。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制除指定警告外的所有警告。 |

#### 将警告提升为错误

| 命令 | 描述 |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | 将所有警告提升为编译错误。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 仅将指定的警告提升为错误。 |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将除指定警告外的所有警告提升为错误。 |

#### 启用额外的编译器警告

| 命令 | 描述 |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | 启用所有额外的声明、表达式和类型编译器检查（如果为真则发出警告）。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 仅启用指定的额外编译器检查。 |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用除指定检查外的所有额外检查。 |

#### 警告列表

如果你有许多想要从通用规则中排除的警告，可以通过 [`@argfile`](compiler-reference.md#argfile) 在单独的文件中列出它们。

### 留下反馈

新的编译器选项仍处于 [实验性 (Experimental)](components-stability.md#stability-levels-explained) 阶段。请 
向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

## Kotlin/JVM

Kotlin 2.2.0 为 JVM 带来了许多更新。编译器现在支持 Java 24 字节码，并引入了 
接口函数默认方法生成的更改。此版本还简化了 Kotlin 元数据中注解的处理， 
改进了内联值类与 Java 的互操作性，并包含了对 JVM record 注解的更好支持。

### 接口函数默认方法生成的更改

从 Kotlin 2.2.0 开始，除非另有配置，否则接口中声明的函数将编译为 JVM 默认方法。 
此更改会影响带有实现的 Kotlin 接口函数编译为字节码的方式。

此行为由新的稳定编译器选项 `-jvm-default` 控制，它取代了已弃用的 `-Xjvm-default` 选项。

你可以使用以下值控制 `-jvm-default` 选项的行为：

* `enable`（默认）：在接口中生成默认实现，并在子类 
   和 `DefaultImpls` 类中包含桥接函数。使用此模式可以保持与旧版本 Kotlin 的二进制兼容性。
* `no-compatibility`：仅在接口中生成默认实现。此模式跳过兼容性桥接 
   和 `DefaultImpls` 类，使其适用于新代码。
* `disable`：在接口中禁用默认实现。仅生成桥接函数 
   和 `DefaultImpls` 类，与 Kotlin 2.2.0 之前的行为一致。

要配置 `-jvm-default` 编译器选项，请在 Gradle Kotlin DSL 中设置 `jvmDefault` 属性：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### 支持在 Kotlin 元数据中读取和写入注解
<primary-label ref="experimental-general"/>

以前，你必须使用反射或字节码分析从编译后的 JVM 类文件中读取注解，并根据签名 
手动将它们与元数据条目匹配。 
这个过程很容易出错，尤其是对于重载函数。

现在，在 Kotlin 2.2.0 中，[](metadata-jvm.md) 引入了对读取存储在 Kotlin 元数据中的注解的支持。

要使注解在编译文件的元数据中可用，请添加以下编译器选项：

```kotlin
-Xannotations-in-metadata
```

或者将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

启用此选项后，Kotlin 编译器会将注解与 JVM 字节码一起写入元数据， 
从而使 `kotlin-metadata-jvm` 库可以访问它们。

该库提供了以下用于访问注解的 API：

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

这些 API 处于 [实验性 (Experimental)](components-stability.md#stability-levels-explained) 阶段。 
要选择使用，请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解。

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

> 如果你在项目中使用 `kotlin-metadata-jvm` 库，我们建议测试并更新你的代码以支持注解。 
> 否则，当元数据中的注解在未来的 Kotlin 版本中变为 [默认启用](https://youtrack.jetbrains.com/issue/KT-75736) 时，你的项目可能会 
> 产生无效或不完整的元数据。
>
> 如果你遇到任何问题，请在我们的 [问题跟踪器](https://youtrack.jetbrains.com/issue/KT-31857) 中报告。
>
{style="warning"}

### 改进内联值类与 Java 的互操作性
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 引入了一个新的实验性注解：[`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)。此注解使从 Java 调用 [内联值类](inline-classes.md) 变得更加容易。

你可以在此视频中找到该功能的概述：

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Kotlin 2.2.0 中面向 Java 暴露的内联值类"/>

默认情况下，Kotlin 编译内联值类时会使用 **未装箱表示 (unboxed representations)**，这种表示性能更高，但从 Java 中调用往往 
很困难甚至不可能。例如：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

在这种情况下，由于类是未装箱的，Java 无法调用构造函数。Java 也无法 
触发 `init` 块来确保 `number` 是正数。 

当你使用 `@JvmExposeBoxed` 为该类添加注解时，Kotlin 会生成一个 Java 可以直接调用的公共构造函数， 
确保 `init` 块也会运行。

你可以将 `@JvmExposeBoxed` 注解应用于类、构造函数或方法级别，以实现对 
暴露给 Java 的内容的精细控制。

例如，在以下代码中，扩展函数 `.timesTwoBoxed()` **不能**从 Java 访问：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

为了能够创建 `MyInt` 类的实例并从 Java 代码调用 `.timesTwoBoxed()` 函数， 
请将 `@JvmExposeBoxed` 注解同时添加到类和函数中：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

有了这些注解，Kotlin 编译器将为 `MyInt` 类生成一个可供 Java 访问的构造函数。它还生成了 
该扩展函数的一个重载，使用了值类的装箱形式。因此，以下 Java 代码可以成功运行：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

如果你不想为你想要暴露的内联值类的每个部分都添加注解，你可以将该注解有效地应用于 
整个模块。要将此行为应用于模块，请使用 `-Xjvm-expose-boxed` 选项对其进行编译。 
使用此选项编译的效果等同于模块中的每个声明都带有 `@JvmExposeBoxed` 注解。

这一新注解不会改变 Kotlin 内部编译或使用值类的方式，所有现有的已编译代码 
仍然有效。它只是增加了提高 Java 互操作性的新能力。使用值类的 Kotlin 代码的性能不受影响。

`@JvmExposeBoxed` 注解对于想要暴露成员函数的装箱变体 
并接收装箱返回值类型的库作者非常有用。它消除了在内联值类（高效但仅限 Kotlin） 
和数据类（兼容 Java 但始终装箱）之间进行选择的需要。

有关 `@JvmExposedBoxed` 注解工作原理及其解决问题的更详细说明， 
请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 提案。

### 对 JVM record 注解的改进支持

Kotlin 自 Kotlin 1.5.0 起就已支持 [JVM record](jvm-records.md)。现在，Kotlin 2.2.0 改进了 Kotlin 处理 
record 组件注解的方式，特别是与 Java 的 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 目标相关的处理。

首先，如果你想将 `RECORD_COMPONENT` 用作注解目标，你需要手动为 
Kotlin (`@Target`) 和 Java 添加注解。这是因为 Kotlin 的 `@Target` 注解不支持 `RECORD_COMPONENT`。例如：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

手动维护这两个列表很容易出错，因此 Kotlin 2.2.0 在 Kotlin 和 
Java 目标不匹配时引入了编译器警告。例如，如果你在 Java 目标列表中省略了 `ElementType.CLASS`，编译器会报告：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

其次，在 record 中传播注解时，Kotlin 的行为与 Java 不同。在 Java 中， 
record 组件上的注解会自动应用于支持字段、getter 和构造函数形参。 
Kotlin 默认情况下不会这样做，但你现在可以使用 [`@all:` 使用点目标](#all-meta-target-for-properties)来复制该行为。

例如：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

当你将 `@JvmRecord` 与 `@all:` 一起使用时，Kotlin 现在：

* 将注解传播到属性、支持字段、构造函数形参和 getter。
* 如果该注解支持 Java 的 `RECORD_COMPONENT`，也会将该注解应用于 record 组件。

## Kotlin/Native

从 2.2.0 开始，Kotlin/Native 使用 LLVM 19。此版本还带来了几个旨在 
跟踪和调整内存消耗的实验性功能。

### 基于对象的内存分配
<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的 [内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 
现在可以基于对象预留内存。在某些情况下，它可以帮助你满足严格的内存限制或 
减少应用程序启动时的内存消耗。

新功能旨在取代 `-Xallocator=std` 编译器选项，该选项启用了系统内存分配器 
而不是默认的分配器。现在，你可以在不切换内存分配器的情况下禁用缓冲（分配的分页）。

该功能目前处于 [实验性 (Experimental)](components-stability.md#stability-levels-explained) 阶段。 
要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.pagedAllocator=false
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

### 运行时支持 Latin-1 编码的字符串
<primary-label ref="experimental-opt-in"/>

Kotlin 现在支持 Latin-1 编码的字符串，类似于 [JVM](https://openjdk.org/jeps/254)。这应该有助于 
减小应用程序的二进制文件大小并调整内存消耗。

默认情况下，Kotlin 中的字符串使用 UTF-16 编码存储，其中每个字符由两个字节表示。 
在某些情况下，这会导致字符串在二进制文件中占用的空间是源代码的两倍，并且 
从简单的 ASCII 文件读取数据占用的内存是磁盘存储文件的两倍。

反之，[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 编码仅用一个字节表示前 
256 个 Unicode 字符。在启用 Latin-1 支持的情况下，只要所有字符都在其范围内， 
字符串就会以 Latin-1 编码存储。否则，将使用默认的 UTF-16 编码。

#### 如何启用 Latin-1 支持

该功能目前处于 [实验性 (Experimental)](components-stability.md#stability-levels-explained) 阶段。 
要启用它，请在你的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.latin1Strings=true
```
#### 已知问题

只要该功能处于实验性阶段，cinterop 扩展函数 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html) 和 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) 的效率就会降低。每次调用它们都可能触发字符串自动转换为 UTF-16。

Kotlin 团队非常感谢我们在 Google 的同事，特别是 [Sonya Valchuk](https://github.com/pyos) 
实现了这一功能。

有关 Kotlin 中内存消耗的更多信息，请参阅 [文档](native-memory-manager.md#memory-consumption)。

### 改进 Apple 平台上的内存消耗跟踪

从 Kotlin 2.2.0 开始，由 Kotlin 代码分配的内存现在会被标记。这可以帮助你调试 Apple 平台上的内存问题。

在检查应用程序的高内存使用情况时，你现在可以识别出 Kotlin 代码预留了多少内存。 
Kotlin 的份额标记有一个标识符，可以通过 Xcode Instruments 中的 VM Tracker 等工具进行跟踪。

此功能默认启用，但仅在满足以下 _所有_ 
条件时才在 Kotlin/Native 默认内存分配器中可用：

* **标记已启用**。内存应使用有效的标识符进行标记。Apple 建议使用 240 到 255 之间的数字； 
  默认值为 246。

  如果你设置了 `kotlin.native.binary.mmapTag=0` Gradle 属性，则标记将被禁用。

* **使用 mmap 分配**。分配器应使用 `mmap` 系统调用将文件映射到内存中。

  如果你设置了 `kotlin.native.binary.disableMmap=true` Gradle 属性，则默认分配器使用 `malloc` 而不是 `mmap`。

* **分页已启用**。分配的分页（缓冲）应启用。

  如果你设置了 [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 属性，则内存将 
  基于对象进行预留。

有关 Kotlin 中内存消耗的更多信息，请参阅 [文档](native-memory-manager.md#memory-consumption)。

### LLVM 从 16 更新至 19

在 Kotlin 2.2.0 中，我们将 LLVM 从版本 16 更新到了 19。 
新版本包含性能改进、错误修复和安全更新。

此更新不应影响你的代码，但如果你遇到任何问题，请向我们的 [问题跟踪器](http://kotl.in/issue) 报告。

### Windows 7 目标已弃用

从 Kotlin 2.2.0 开始，支持的最低 Windows 版本已从 Windows 7 提高到 Windows 10。由于 
Microsoft 已于 2025 年 1 月停止支持 Windows 7，我们也决定弃用此旧版目标。

欲了解更多信息，请参阅 [](native-target-support.md)。

## Kotlin/Wasm

在此版本中，[Wasm 目标的构建基础架构已与 JavaScript 目标分离](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。此外，你现在可以 
[针对每个项目或模块配置 Binaryen 工具](#per-project-binaryen-configuration)。

### Wasm 目标的构建基础架构已与 JavaScript 目标分离

以前，`wasmJs` 目标与 `js` 目标共享相同的基础架构。因此，两个目标都托管在同一个 
目录 (`build/js`) 中，并使用相同的 NPM 任务和配置。

现在，`wasmJs` 目标拥有独立于 `js` 目标的基础架构。这使得 
Wasm 任务和类型能够与 JavaScript 区分开来，从而实现独立配置。

此外，Wasm 相关的项目文件和 NPM 依赖项现在存储在单独的 `build/wasm` 目录中。

为 Wasm 引入了新的 NPM 相关任务，而现有的 JavaScript 任务现在仅专用于 JavaScript：

| **Wasm 任务** | **JavaScript 任务** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同样，增加了新的 Wasm 特有声明：

| **Wasm 声明** | **JavaScript 声明** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

你现在可以独立于 JavaScript 目标来处理 Wasm 目标，这简化了配置过程。

此更改默认启用，无需额外设置。

### 针对每个项目的 Binaryen 配置

在 Kotlin/Wasm 中用于 [优化生产构建](whatsnew20.md#optimized-production-builds-by-default-using-binaryen) 的 Binaryen 工具，此前是在根项目中统一配置的。

现在，你可以针对每个项目或模块配置 Binaryen 工具。这一更改符合 Gradle 的最佳实践，并 
确保更好地支持 [项目隔离 (project isolation)](https://docs.gradle.org/current/userguide/isolated_projects.html) 等功能， 
从而在复杂构建中提高构建性能和可靠性。

此外，如果需要，你现在可以为不同的模块配置不同版本的 Binaryen。

此功能默认启用。但是，如果你有 Binaryen 的自定义配置， 
现在需要针对每个项目应用，而不是仅在根项目中应用。

## Kotlin/JS

此版本改进了 [`@JsPlainObject` 接口中的 `copy()` 函数](#fix-for-copy-in-jsplainobject-interfaces)、 
[带有 `@JsModule` 注解文件中的类型别名](#support-for-type-aliases-in-files-with-jsmodule-annotation)以及其他 Kotlin/JS 功能。

### 修复 `@JsPlainObject` 接口中的 `copy()`

Kotlin/JS 有一个名为 `js-plain-objects` 的实验性插件，它为带 `@JsPlainObject` 注解的接口引入了 `copy()` 函数。 
你可以使用 `copy()` 函数来操作对象。

然而，`copy()` 的初始实现与继承不兼容， 
这在 `@JsPlainObject` 接口扩展其他接口时会导致问题。

为了避免对普通对象的限制，`copy()` 函数已从对象本身移动到了它的伴生对象中：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 这种语法不再有效
    val copy = user.copy(age = 35)      
    // 这是正确的语法
    val copy = User.copy(user, age = 35)
}
```

此更改解决了继承层次结构中的冲突并消除了歧义。 
从 Kotlin 2.2.0 开始默认启用。

### 在带有 `@JsModule` 注解的文件中支持类型别名

以前，为了从 JavaScript 模块导入声明而使用 `@JsModule` 注解的文件 
被限制为只能包含外部声明。这意味着你不能在这些文件中声明 `typealias`。

从 Kotlin 2.2.0 开始，你可以在标记有 `@JsModule` 的文件中声明类型别名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

这一更改减少了 Kotlin/JS 互操作性限制的一个方面，未来版本还计划进行更多改进。

带有 `@JsModule` 的文件中对类型别名的支持默认启用。

### 在多平台 `expect` 声明中支持 `@JsExport`

在 Kotlin Multiplatform 项目中使用 [`expect/actual` 机制](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)时， 
无法在通用代码中为 `expect` 声明使用 `@JsExport` 注解。

从该版本开始，你可以直接对 `expect` 声明应用 `@JsExport`：

```kotlin
// commonMain

// 此前会报错，但现在可以正常工作 
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

你还必须在 JavaScript 源集中为对应的 `actual` 实现添加 `@JsExport` 注解， 
并且它必须仅使用可导出的类型。

此修复允许在 `commonMain` 中定义的共享代码被正确导出到 JavaScript。你现在可以将你的 
多平台代码暴露给 JavaScript 消费者，而无需使用手动变通方案。

此更改默认启用。

### 在 `Promise<Unit>` 类型中使用 `@JsExport` 的能力

以前，当你尝试使用 `@JsExport` 注解导出返回 `Promise<Unit>` 类型的函数时， 
Kotlin 编译器会产生错误。

虽然像 `Promise<Int>` 这样的返回类型可以正常工作，但使用 `Promise<Unit>` 会触发“不可导出类型”警告， 
尽管它在 TypeScript 中可以正确映射到 `Promise<void>`。

这一限制已被移除。现在，以下代码可以编译且不会报错：

```kotlin
// 此前可以正常工作
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 此前会报错，但现在可以正常工作
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

此更改移除了 Kotlin/JS 互操作模型中不必要的限制。此修复默认启用。

## Gradle

Kotlin 2.2.0 与 Gradle 7.6.3 到 8.14 完全兼容。你也可以使用最新 Gradle 
版本。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 功能可能无法工作。

在此版本中，Kotlin Gradle 插件对其诊断功能进行了多项改进。 
它还引入了 [二进制兼容性验证](#binary-compatibility-validation-included-in-kotlin-gradle-plugin) 的实验性集成，使得开发库变得更加容易。

### Kotlin Gradle 插件中包含二进制兼容性验证
<primary-label ref="experimental-general"/>

为了更轻松地检查库版本之间的二进制兼容性，我们正在尝试将 
[二进制兼容性验证器 (binary compatibility validator)](https://github.com/Kotlin/binary-compatibility-validator) 的功能移动到 Kotlin Gradle 插件 (KGP) 中。 
你可以在练手项目中试用它，但我们还不建议在生产环境中使用它。 

原来的 [二进制兼容性验证器](https://github.com/Kotlin/binary-compatibility-validator) 在 
此实验阶段将继续维护。

Kotlin 库可以使用两种二进制格式之一：JVM 类文件或 `klib`。由于这些格式不兼容， 
KGP 分别处理它们。

要启用二进制兼容性验证功能集，请在 `build.gradle.kts` 文件的 `kotlin{}` 块中添加以下内容：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 使用 set() 函数以确保与旧版本 Gradle 的兼容性
        enabled.set(true)
    }
}
```

如果你的项目中有多个模块想要检查二进制兼容性，请在每个 
模块中单独配置该功能。每个模块都可以有自己的自定义配置。

启用后，运行 `checkLegacyAbi` Gradle 任务来检查二进制兼容性问题。你可以在 
IntelliJ IDEA 中或在项目目录的命令行中运行该任务：

```kotlin
./gradlew checkLegacyAbi
```

此任务会将当前代码的应用程序二进制接口 (ABI) 转储生成为一个 UTF-8 文本文件。 
然后，该任务会将新的转储与上一个版本的转储进行比较。如果任务发现任何差异， 
它会将其报告为错误。在审查错误后，如果你认为更改是可以接受的，可以 
通过运行 `updateLegacyAbi` Gradle 任务来更新参考 ABI 转储。

#### 过滤类

该功能允许你在 ABI 转储中过滤类。你可以通过名称或部分 
名称，或者通过标记它们的注解（或注解名称的一部分）来显式包含或排除类。

例如，此示例排除了 `com.company` 软件包中的所有类：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

探索 [KGP API 参考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/) 以了解有关配置二进制兼容性验证器的更多信息。

#### 多平台限制

在多平台项目中，如果你的宿主环境不支持所有目标的交叉编译，KGP 会尝试通过 
检查其他目标的 ABI 转储来推断不支持目标的 ABI 更改。如果你稍后切换到 
**可以** 编译所有目标的宿主环境，这种方法有助于避免错误的验证失败。

你可以通过在 `build.gradle.kts` 文件中添加 
以下内容来更改此默认行为，以便 KGP 不会为不支持的目标推断 ABI 更改：

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

但是，如果你的项目中有一个不支持的目标，运行 `checkLegacyAbi` 任务将会失败，因为该任务 
无法创建 ABI 转储。如果任务失败比因为推断 ABI 更改而错过 
不兼容的更改更重要，那么这种行为可能是理想的。

### Kotlin Gradle 插件控制台支持富媒体输出

在 Kotlin 2.2.0 中，我们支持在 Gradle 构建过程中控制台输出颜色和其他富媒体输出， 
这使得阅读和理解报告的诊断信息变得更加容易。

Linux 和 macOS 上支持的终端模拟器中提供富媒体输出，我们正在努力增加对 Windows 的支持。

![Gradle 控制台](gradle-console-rich-output.png){width=600}

此功能默认启用，但如果你想覆盖它，请在 `gradle.properties` 文件中添加以下 Gradle 属性：

```
org.gradle.console=plain
```

有关此属性及其选项的更多信息，请参阅 Gradle 有关 [自定义日志格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) 的文档。

### KGP 诊断中集成 Problems API

以前，Kotlin Gradle 插件 (KGP) 仅能将警告和错误等诊断信息作为纯文本输出到控制台或日志。

从 2.2.0 开始，KGP 引入了额外的报告机制：它现在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)， 
这是一种在构建过程中报告丰富的、结构化的问题信息的标准化方式。

KGP 诊断信息现在更容易阅读，并且在 Gradle CLI 和 IntelliJ IDEA 等不同界面中显示得更加一致。

从 Gradle 8.6 或更高版本开始，此集成默认启用。 
由于 API 仍在演变中，请使用最新的 Gradle 版本以受益于最新的改进。

### KGP 与 `--warning-mode` 的兼容性

此前，Kotlin Gradle 插件 (KGP) 诊断报告的问题使用固定的严重级别， 
这意味着 Gradle 的 [`--warning-mode` 命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 对 KGP 显示错误的方式没有影响。

现在，KGP 诊断与 `--warning-mode` 选项兼容，提供了更多的灵活性。例如， 
你可以将所有警告转换为错误，或者完全禁用警告。

通过此更改，KGP 诊断会根据所选的警告模式调整输出：

* 当你设置 `--warning-mode=fail` 时，严重级别为 `Severity.Warning` 的诊断信息现在会提升为 `Severity.Error`。
* 当你设置 `--warning-mode=none` 时，严重级别为 `Severity.Warning` 的诊断信息将不再记录。

此行为从 2.2.0 开始默认启用。

要忽略 `--warning-mode` 选项，请在 `gradle.properties` 文件中设置以下 Gradle 属性：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新的实验性构建工具 API
<primary-label ref="experimental-general"/>

你可以在各种构建系统中使用 Kotlin，例如 Gradle、Maven、Amper 等。然而，将 Kotlin 
集成到每个系统中以支持完整的功能集（例如增量编译以及与 Kotlin 编译器 
插件、守护进程和 Kotlin Multiplatform 的兼容性）需要付出巨大的努力。

为了简化此过程，Kotlin 2.2.0 引入了一个新的实验性构建工具 API (BTA)。BTA 是一个通用 API， 
充当构建系统与 Kotlin 编译器生态系统之间的抽象层。通过这种方法，每个 
构建系统只需支持单个 BTA 入口点。

目前，BTA 仅支持 Kotlin/JVM。JetBrains 的 Kotlin 团队已经在 Kotlin Gradle 插件 
(KGP) 和 `kotlin-maven-plugin` 中使用它。你可以通过这些插件尝试 BTA，但该 API 本身尚未准备好 
在你自己的构建工具集成中普遍使用。如果你对 BTA 提案感到好奇或想分享你的反馈， 
请参阅此 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 提案。

要在以下插件中试用 BTA：

* 在 KGP 中，在你的 `gradle.properties` 文件中添加以下属性：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* 在 Maven 中，你不需要做任何事情。它默认启用。

BTA 目前对 Maven 插件没有直接的好处，但它为更快交付 
新功能奠定了坚实的基础，例如 [对 Kotlin 守护进程的支持](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) 和 [增量编译的稳定 (stabilization of incremental compilation)](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)。

对于 KGP，使用 BTA 已经带来了以下好处：

* [改进的“进程内 (in process)”编译器执行策略](#improved-in-process-compiler-execution-strategy)
* [更灵活地从 Kotlin 配置不同的编译器版本](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改进的“进程内 (in process)”编译器执行策略

KGP 支持三种 [Kotlin 编译器执行策略](compiler-execution-strategy.md)。 
此前的“进程内 (in process)”策略（在 Gradle 守护进程中运行编译器）不支持增量编译。

现在，通过使用 BTA，“进程内”策略 **确实** 支持增量编译。要使用它，请在 
`gradle.properties` 文件中添加以下属性：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### 灵活地从 Kotlin 配置不同的编译器版本

有时你可能想在代码中使用较新的 Kotlin 编译器版本，同时让 KGP 保持在旧版本上 
—— 例如，在尝试新语言功能的同时仍然在处理构建脚本弃用。或者你可能 
想更新 KGP 的版本但保留旧的 Kotlin 编译器版本。

BTA 使这成为可能。以下是你在 `build.gradle.kts` 文件中配置它的方式：

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
    compilerVersion.set("2.1.21") // 使用与 2.2.0 不同的版本
}

```

BTA 支持配置 KGP 和 Kotlin 编译器版本，包含之前的三个主要版本和 
一个后续主要版本。因此在 KGP 2.2.0 中，支持 Kotlin 编译器版本 2.1.x、2.0.x 和 1.9.25。 
KGP 2.2.0 也与未来的 Kotlin 编译器版本 2.2.x 和 2.3.x 兼容。

但是，请记住，将不同的编译器版本与编译器插件一起使用可能会导致 Kotlin 编译器 
异常。Kotlin 团队计划在未来版本中解决此类问题。

在这些插件中尝试 BTA，并在专门的 YouTrack 工单中向我们发送你的反馈：[KGP](https://youtrack.jetbrains.com/issue/KT-56574) 和 [Maven 插件](https://youtrack.jetbrains.com/issue/KT-73012)。

## 标准库

在 Kotlin 2.2.0 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现已 [稳定 (Stable)](components-stability.md#stability-levels-explained)。

### 稳定的 Base64 编码与解码

Kotlin 1.8.20 引入了 [对 Base64 编码与解码的实验性支持](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin 2.2.0 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 现已 [稳定 (Stable)](components-stability.md#stability-levels-explained)，并且 
包含四种编码方案，此版本增加了新的 `Base64.Pem`：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用标准的 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

  > `Base64.Default` 是 `Base64` 类的伴生对象。 
  > 因此，你可以使用 `Base64.encode()` 和 `Base64.decode()` 来调用其函数，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用 [“URL 和文件名安全”](https://www.rfc-editor.org/rfc/rfc4648#section-5) 编码方案。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 
  编码方案，在编码期间每 76 个字符插入一个行分隔符，并在解码期间跳过非法字符。
* `Base64.Pem` 编码数据类似于 `Base64.Mime`，但将行长度限制为 64 个字符。

你可以使用 Base64 API 将二进制数据编码为 Base64 字符串，并将其解码回字节。

示例如下：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 或者：
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 或者：
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

### 使用 `HexFormat` API 进行稳定的十六进制解析与格式设置

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现已 [稳定 (Stable)](components-stability.md#stability-levels-explained)。 
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

有关更多信息，请参阅 [用于格式设置和解析十六进制的新 HexFormat 类](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。

## Compose 编译器

在此版本中，Compose 编译器引入了对可组合函数引用的支持，并更改了多个功能标志的默认值。

### 支持 `@Composable` 函数引用

从 Kotlin 2.2.0 版本开始，Compose 编译器支持可组合函数引用的声明和使用：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

可组合函数引用在运行时的行为与可组合 lambda 对象略有不同。 
特别是，可组合 lambda 通过扩展 `ComposableLambda` 类允许对跳过 (skipping) 进行更精细的控制。函数引用预期实现 `KCallable` 接口，因此同样的优化无法应用于它们。

### `PausableComposition` 功能标志默认启用

从 Kotlin 2.2.0 开始，`PausableComposition` 功能标志默认启用。此标志调整了 
Compose 编译器对可重启函数的输出，允许运行时强制跳过行为，从而有效地 
通过跳过每个函数来暂停重组 (composition)。这允许重型重组在帧之间拆分，这将在未来的发布中通过预取 (prefetching) 功能使用。

要禁用此功能标志，请在你的 Gradle 配置中添加以下内容：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 功能标志默认启用

从 Kotlin 2.2.0 开始，`OptimizeNonSkippingGroups` 功能标志默认启用。此优化 
通过删除为不可跳过的可组合函数生成的组调用来提高运行时性能。 
它不应导致运行时出现任何可观察的行为变化。

如果你遇到任何问题，可以通过禁用该功能标志来验证是否是此更改导致的。 
请向 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告任何问题。

要禁用 `OptimizeNonSkippingGroups` 标志，请在你的 Gradle 配置中添加以下内容：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 已弃用的功能标志

`StrongSkipping` 和 `IntrinsicRemember` 功能标志现已弃用，并将于未来版本移除。 
如果你遇到任何导致你必须禁用这些功能标志的问题，请向 [Jetpack Compose 问题跟踪器](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 报告。

## 重大变更与弃用

本节重点介绍值得注意的重要重大变更和弃用。请参阅我们的 [兼容性指南](compatibility-guide-22.md) 
以获取此版本中所有重大变更和弃用的完整概述。

* 从 Kotlin 2.2.0 开始，编译器 [不再支持 `-language-version=1.6` 或 `-language-version=1.7`](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7)。 
  早于 1.8 的语言功能集不再受支持，但语言本身仍然与 Kotlin 1.0 完全向后兼容。
* 对 Ant 构建系统的支持已弃用。Kotlin 对 Ant 的支持 
  已经很长时间没有活跃开发了，且由于其用户群相对较小，没有计划进一步维护。 
  我们计划在 2.3.0 中移除 Ant 支持。
* Kotlin 2.2.0 将 Gradle 中 [`kotlinOptions{}` 块的弃用级别提升为错误](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。 
  请改用 `compilerOptions{}` 块。有关更新构建脚本的指导，请参阅 [从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
* Kotlin 脚本编写 (scripting) 仍然是 Kotlin 生态系统的重要组成部分，但我们正专注于特定的使用场景，例如 
  自定义脚本，以及 `gradle.kts` 和 `main.kts` 脚本，以提供更好的体验。 
  要了解更多信息，请参阅我们更新后的 [博客文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。因此，Kotlin 2.2.0 弃用了对以下内容的支持：
  
  * REPL：要继续通过 `kotlinc` 使用 REPL，请使用 `-Xrepl` 编译器选项进行选择加入。
  * JSR-223：由于此 [JSR](https://jcp.org/en/jsr/detail?id=223) 处于 **撤回 (Withdrawn)** 状态，JSR-223 
    实现将继续在语言版本 1.9 下工作，但未来不会迁移到 K2 编译器。
  * `KotlinScriptMojo` Maven 插件：我们认为该插件没有足够的吸引力。如果你继续使用它，将会看到编译器警告。
* 
* 在 Kotlin 2.2.0 中，[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函数现在 [会替换已配置的源，而不是向其添加](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)。 
  如果你想在不替换现有源的情况下添加源，请使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函数。
* `BaseKapt` 中 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 的类型已 [从 `MutableList<Any>` 更改为 `MutableList<CommandLineArgumentProvider>`](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。如果你的代码目前将列表作为单个元素添加，请改用 `addAll()` 函数而不是 `add()` 函数。
* 继旧版 Kotlin/JS 后端中使用的死代码消除 (DCE) 工具弃用之后， 
  DCE 相关的剩余 DSL 现已从 Kotlin Gradle 插件中移除：
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 接口
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 函数
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 接口
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 接口

  目前的 [JS IR 编译器](js-ir-compiler.md)开箱即用地支持 DCE，且 [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 注解允许指定在 DCE 期间要保留哪些 Kotlin 函数和类。

* 弃用的 `kotlin-android-extensions` 插件在 [Kotlin 2.2.0 中被移除](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。 
  请使用 `kotlin-parcelize` 插件作为 `Parcelable` 实现生成器，并使用 Android Jetpack 的 [视图绑定 (view bindings)](https://developer.android.com/topic/libraries/view-binding) 代替合成视图 (synthetic views)。
* 实验性的 `kotlinArtifacts` API 在 [Kotlin 2.2.0 中已弃用](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。 
  请使用 Kotlin Gradle 插件中当前的 DSL 来 [构建最终的原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。如果这不足以支持迁移，请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-74953) 中留言。
* 在 Kotlin 1.9.0 中弃用的 `KotlinCompilation.source` 现已 [从 Kotlin Gradle 插件中移除](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
* 实验性公共化 (commonization) 模式的参数在 [Kotlin 2.2.0 中已弃用](compatibility-guide-22.md#deprecate-commonization-parameters)。 
  清除公共化缓存以删除无效的编译产物。
* 弃用的 `konanVersion` 属性现已 [从 `CInteropProcess` 任务中移除](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。 
  请改用 `CInteropProcess.kotlinNativeVersion`。
* 使用弃用的 `destinationDir` 属性现在 [会导致错误](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。 
  请改用 `CInteropProcess.destinationDirectory.set()`。

## 文档更新

此版本带来了显著的文档变更，包括将 Kotlin Multiplatform 文档迁移到 [KMP 门户](https://kotlinlang.org/docs/multiplatform/get-started.html)。 

此外，我们创建了新的页面和教程，并翻新了现有内容。 

### 新增及翻新教程

* [Kotlin 中级之旅](kotlin-tour-welcome.md) – 提升你对 Kotlin 的理解。了解何时使用扩展函数、接口、类等。
* [构建使用 Spring AI 的 Kotlin 应用](spring-ai-guide.md) – 了解如何使用 OpenAI 和向量数据库创建一个能够回答问题的 Kotlin 应用。
* [](jvm-create-project-with-spring-boot.md) – 了解如何使用 IntelliJ IDEA 的 **New Project** 向导通过 Gradle 创建 Spring Boot 项目。
* [映射 Kotlin 和 C 教程系列](mapping-primitive-data-types-from-c.md) – 了解如何在 Kotlin 和 C 之间映射不同的类型和构造。
* [使用 C 互操作和 libcurl 创建应用](native-app-with-c-and-libcurl.md) – 创建一个简单的 HTTP 客户端，可以使用 libcurl C 库在原生环境下运行。
* [创建你的 Kotlin Multiplatform 库](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – 了解如何使用 IntelliJ IDEA 创建和发布多平台库。
* [使用 Ktor 和 Kotlin Multiplatform 构建全栈应用程序](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 此教程现在使用 IntelliJ IDEA 代替 Fleet，并结合 Material 3 以及最新版本的 Ktor 和 Kotlin。
* [在 Compose Multiplatform 应用中管理本地资源环境](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – 了解如何管理应用程序的资源环境，例如应用内主题和语言。

### 新增及翻新页面

* [Kotlin 用于 AI 概述](kotlin-ai-apps-development-overview.md) – 探索 Kotlin 构建 AI 驱动应用程序的能力。
* [Dokka 迁移指南](https://kotlinlang.org/docs/dokka-migration.html) – 了解如何迁移到 Dokka Gradle 插件的 v2 版本。
* [](metadata-jvm.md) – 探索关于读取、修改和生成针对 JVM 编译的 Kotlin 类元数据的指导。
* [CocoaPods 集成](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 了解如何通过教程和示例项目设置环境、添加 Pod 依赖项，或将 Kotlin 项目作为 CocoaPod 依赖项使用。
* 支持 iOS 稳定版发布的 Compose Multiplatform 新页面：
    * 尤其是 [导航](https://kotlinlang.org/docs/multiplatform/compose-navigation.html) 和 [深层链接 (Deep linking)](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html)。
    * [在 Compose 中实现布局](https://kotlinlang.org/docs/multiplatform/compose-layout.html)。
    * [本地化字符串](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html) 以及其他 i18n 页面（如对 RTL 语言的支持）。
* [Compose 热重载 (Hot Reload)](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – 了解如何针对桌面目标使用 Compose 热重载，以及如何将其添加到现有项目中。
* [Exposed 迁移](https://www.jetbrains.com/help/exposed/migrations.html) – 了解 Exposed 提供的用于管理数据库架构更改的工具。

## 如何更新至 Kotlin 2.2.0

Kotlin 插件作为捆绑插件随 IntelliJ IDEA 和 Android Studio 一起分发。

要更新到新的 Kotlin 版本，请在构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 2.2.0。