[//]: # (title: Kotlin %kotlinEapVersion% 的新特性)

_[发布日期: %kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验版 (EAP) 发布的所有功能，
> 但重点介绍了一些重大改进。
>
> 请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整变更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 发布了！
以下是此 EAP 版本的详细信息：

* [语言：上下文参数预览](#preview-of-context-parameters)
* [Kotlin 编译器：统一管理编译器警告](#kotlin-compiler-unified-management-of-compiler-warnings)
* [Kotlin/JVM：接口函数默认方法生成的变更](#changes-to-default-method-generation-for-interface-functions)
* [Gradle：KGP 诊断中集成 Problems API](#integration-of-problems-api-within-kgp-diagnostics)
  以及 [KGP 与 '--warning-mode' 的兼容性](#kgp-compatibility-with-warning-mode)

## IDE 支持

支持 Kotlin %kotlinEapVersion% 的 Kotlin 插件已捆绑在最新版 IntelliJ IDEA 和 Android Studio 中。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本](configure-build-for-eap.md) 更改为 %kotlinEapVersion%。

有关详细信息，请参阅[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

此版本将一些语言特性提升为稳定版，并带来了上下文参数的预览版。

### 稳定特性：守卫条件、非局部 break 和 continue，以及多美元符号插值

在 Kotlin 2.1.0 中，引入了一些新的语言特性作为预览版。
我们很高兴地宣布，这些语言特性在此版本中变为 [稳定](components-stability.md#stability-levels-explained)：

* [`when` 表达式中带主语的守卫条件](whatsnew21.md#guard-conditions-in-when-with-a-subject)
* [非局部 `break` 和 `continue`](whatsnew21.md#non-local-break-and-continue)
* [多美元符号插值：改进了字符串字面量中 $ 的处理](whatsnew21.md#multi-dollar-string-interpolation)

[查看 Kotlin 语言设计特性和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 上下文参数预览

<primary-label ref="experimental-general"/>

在此版本中，上下文参数作为预览版引入。
上下文参数允许函数和属性声明在周围上下文中隐式可用的依赖项。

此特性取代了早期实验性特性上下文接收器。要从上下文接收器迁移到上下文参数，您可以使用 IntelliJ IDEA 中的辅助支持，正如 [这篇博客文章](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/) 中所述。

#### 如何声明上下文参数

您可以使用 `context` 关键字为属性和函数声明上下文参数，
后跟参数列表，每个参数的形式为 `name: Type`。以下是一个依赖于 `UserService` 接口的示例：

```kotlin
// `UserService` 定义了上下文中所需的依赖 
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 声明一个带有上下文参数的函数
context(users: UserService)
fun outputMessage(message: String) {
    // 使用上下文中的 `log`
    users.log("Log: $message")
}

// 声明一个带有上下文参数的属性
context(users: UserService)
val firstUser: String
    // 使用上下文中的 `findUserById`    
    get() = users.findUserById(1)
```

您可以使用 `_` 作为上下文参数名称。在这种情况下，参数的值可用于解析，但在块内无法通过名称访问：

```kotlin
// 使用 `_` 作为上下文参数名称
context(_: UserService)
fun logWelcome() {
    // 解析仍能从 UserService 中找到相应的 `log` 函数
    outputMessage("Welcome!")
}
```

#### 上下文参数解析

Kotlin 在调用站点通过搜索当前作用域中匹配的上下文值来解析上下文参数。Kotlin 根据其类型进行匹配。
如果在相同作用域级别存在多个兼容值，编译器会报告歧义：

```kotlin
// `UserService` 定义了上下文中所需的依赖
interface UserService {
    fun log(message: String)
}

// 声明一个带有上下文参数的函数
context(users: UserService)
fun outputMessage(message: String) {
    users.log("Log: $message")
}

fun main() {
    // 实现 `UserService` 
    val serviceA = object : UserService {
        override fun log(message: String) = println("A: $message")
    }

    // 实现 `UserService`
    val serviceB = object : UserService {
        override fun log(message: String) = println("B: $message")
    }

    // `serviceA` 和 `serviceB` 都与调用站点期望的 `UserService` 类型匹配
    context(serviceA, serviceB) {
        outputMessage("This will not compile")
        // 歧义错误
    }
}
```

#### 限制

上下文参数正在持续改进中；当前的一些限制包括：

* 构造函数不能声明上下文参数
* 带有上下文参数的属性不能有幕后字段或初始化器
* 带有上下文参数的属性不能使用委托

然而，Kotlin 中的上下文参数通过简化的依赖注入、改进的 DSL 设计和作用域操作，代表了管理依赖项的重大改进。有关更多信息，请参阅此特性的 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)。

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

#### 留下您的反馈

此特性计划在未来的 Kotlin 版本中稳定并改进。
我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes) 中提供反馈。

## Kotlin 编译器：统一管理编译器警告

<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 引入了一个新的编译器选项 `-Xwarning-level`。它旨在提供一种统一的方式来管理 Kotlin 项目中的编译器警告。

以前，您只能应用通用的模块范围规则，例如使用
`-nowarn` 禁用所有警告，使用 `-Werror` 将所有警告转换为编译错误，或者使用 `-Wextra` 启用额外的编译器检查。唯一用于调整特定警告的选项是 `-Xsuppress-warning`。

通过新解决方案，您可以覆盖通用规则并以一致的方式排除特定诊断。

### 如何应用

新的编译器选项具有以下语法：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`：将指定的警告提升为错误。
* `warning`：发出警告并默认启用。
* `disabled`：完全抑制指定警告在模块范围内。

请记住，您只能使用新的编译器选项配置 _警告_ 的严重性级别。

### 用例

通过新解决方案，您可以通过将通用规则与特定规则相结合，更好地微调项目中的警告报告。选择您的用例：

#### 抑制警告

| 命令                                           | 描述                                                                                                             |
|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | 在编译期间抑制所有警告。                                                                             |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 仅抑制指定警告。与 [`-Xsuppress-warning`](compiler-reference.md#xsuppress-warning) 的作用相同。 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 抑制除指定警告之外的所有警告。                                                                  |

#### 将警告提升为错误

| 命令                                           | 描述                                                  |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | 将所有警告提升为编译错误。                   |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 仅将指定警告提升为错误。                    |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 将所有警告提升为错误，除了指定的警告。 |

#### 启用额外的编译器警告

| 命令                                            | 描述                                                                                          |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | 启用所有额外的声明、表达式和类型编译器检查，如果为 true 则发出警告。 |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 仅启用指定的额外编译器检查。                                                   |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 启用所有额外检查，除了指定的检查。                                         |

#### 警告列表

如果您有许多要从通用规则中排除的警告，可以通过 [`@argfile`](compiler-reference.md#argfile) 将它们列在单独的文件中。

### 留下反馈

新的编译器选项仍处于 [实验性](components-stability.md#stability-levels-explained) 阶段。请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

## Kotlin/JVM

### 接口函数默认方法生成的变更

从 Kotlin %kotlinEapVersion% 开始，除非另有配置，接口中声明的函数将被编译为 JVM 默认方法。
此更改影响了 Kotlin 带有实现的接口函数如何编译为字节码。
此行为由新的稳定编译器选项 `-jvm-default` 控制，取代了已弃用的 `-Xjvm-default` 选项。

您可以使用以下值控制 `-jvm-default` 选项的行为：

* `enable` (默认值)：在接口中生成默认实现，并在子类和 `DefaultImpls` 类中包含桥接函数。使用此模式可保持与旧版 Kotlin 的二进制兼容性。
* `no-compatibility`：仅在接口中生成默认实现。此模式跳过兼容性桥接和 `DefaultImpls` 类，使其适用于新代码。
* `disable`：禁用接口中的默认实现。仅生成桥接函数和 `DefaultImpls` 类，与 Kotlin %kotlinEapVersion% 之前的行为匹配。

要配置 `-jvm-default` 编译器选项，请在 Gradle Kotlin DSL 中设置 `jvmDefault` 属性：

```kotlin
kotlin {
  compilerOptions {
    jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
  }
}
```

### 支持在 Kotlin 元数据中读写注解

<primary-label ref="experimental-general"/>

以前，您必须使用反射或字节码分析从已编译的 JVM 类文件中读取注解，并根据签名手动将它们与元数据条目匹配。
此过程容易出错，特别是对于重载函数。

现在，在 Kotlin %kotlinEapVersion% 中，[Kotlin 元数据 JVM 库](metadata-jvm.md) 引入了对读取存储在 Kotlin 元数据中的注解的支持。

要使注解在已编译文件的元数据中可用，请添加以下编译器选项：

```kotlin
-Xannotations-in-metadata
```

或者，将其添加到 Gradle 构建文件的 `compilerOptions {}` 块中：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

启用此选项后，Kotlin 编译器会将注解与 JVM 字节码一同写入元数据中，从而使 `kotlin-metadata-jvm` 库能够访问它们。

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

这些 API 仍处于 [实验性](components-stability.md#stability-levels-explained) 阶段。
要选择启用，请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解。

以下是从 Kotlin 元数据中读取注解的示例：

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

> 如果您在项目中使用 `kotlin-metadata-jvm` 库，我们建议您测试并更新代码以支持注解。
> 否则，当元数据中的注解在未来的 Kotlin 版本中变为 [默认启用](https://youtrack.jetbrains.com/issue/KT-75736) 时，您的项目可能会生成无效或不完整的元数据。
>
> 如果您遇到任何问题，请在我们的 [问题跟踪器](https://youtrack.jetbrains.com/issue/KT-31857) 中报告。
>
{style="warning"}

## Kotlin/Native

### 基于对象的内存分配

<primary-label ref="experimental-opt-in"/>

Kotlin/Native 的 [内存分配器](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) 现在可以基于对象分配内存。在某些情况下，这可能有助于您避免严格的内存限制或应用程序启动时的高内存消耗。

此新特性旨在取代 `-Xallocator=std` 编译器选项，该选项曾用于启用系统内存分配器而非默认分配器。现在，您无需切换内存分配器即可禁用缓冲（内存分配分页）。

此特性目前处于 [实验性](components-stability.md#stability-levels-explained) 阶段。
要启用它，请在 `gradle.properties` 文件中设置以下选项：

```none
kotlin.native.binary.pagedAllocator=false
```

请向我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 报告任何问题。

### LLVM 从 16 更新到 19

在 Kotlin %kotlinEapVersion% 中，我们将 LLVM 从版本 16 更新到 19。
新版本包含了性能改进、错误修复和安全更新。

此次更新不应影响您的代码，但如果您遇到任何问题，请向我们的 [问题跟踪器](http://kotl.in/issue) 报告。

## Kotlin/Wasm：wasmJs 目标与 js 目标分离

以前，`wasmJs` 目标与 `js` 目标共享相同的基础设施。因此，这两个目标都托管在相同的
目录 (`build/js`) 中，并使用相同的 NPM 任务和配置。

现在，`wasmJs` 目标拥有独立于 `js` 目标的基础设施。这使得
Wasm 任务和类型可以与 JavaScript 任务和类型区分开来，从而实现独立配置。

此外，Wasm 相关项目文件和 NPM 依赖项现在位于独立的 `build/wasm` 目录中。

已为 Wasm 引入了新的 NPM 相关任务，而现有的 JavaScript 任务现在仅专用于 JavaScript：

| **Wasm 任务**         | **JavaScript 任务** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同样，引入了新的 Wasm 特定声明：

| **Wasm 声明**     | **JavaScript 声明** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

您现在可以独立于 JavaScript 目标使用 Wasm 目标，这简化了配置。

此更改默认启用，无需额外配置。

## Kotlin/JS

### 修复 @JsPlainObject 接口中的 copy()

Kotlin/JS 有一个名为 `js-plain-objects` 的实验性插件，它为带有 `@JsPlainObject` 注解的接口引入了 `copy()` 函数。
您可以使用 `copy()` 函数来操作对象。

然而，`copy()` 的初始实现与继承不兼容，当
`@JsPlainObject` 接口扩展其他接口时，这导致了问题。

为了避免对普通对象的限制，`copy()` 函数已从对象本身移至其伴生对象：

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
它从 Kotlin %kotlinEapVersion% 开始默认启用。

### 支持在带有 @JsModule 注解的文件中使用类型别名

以前，带有 `@JsModule` 注解以从 JavaScript 模块导入声明的文件
仅限于外部声明。这意味着，您无法在此类文件中声明 `typealias`。

从 Kotlin %kotlinEapVersion% 开始，您可以在带有 `@JsModule` 标记的文件中声明类型别名：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

此更改减少了 Kotlin/JS 互操作性限制的一个方面，更多改进计划在未来版本中推出。

在带有 `@JsModule` 的文件中支持类型别名是默认启用的。

## Gradle

Kotlin %kotlinEapVersion% 完全兼容 Gradle 7.6.3 到 8.14 版本。您也可以使用直到最新 Gradle 版本的 Gradle 版本。但是，请注意，这样做可能会导致弃用警告，并且某些新的 Gradle 特性可能无法正常工作。

### Kotlin Gradle 插件控制台支持富文本输出

在 Kotlin %kotlinEapVersion% 中，我们支持在 Gradle 构建过程中在控制台中显示颜色和其他富文本输出，从而使报告的诊断信息更易于阅读和理解。
富文本输出适用于 Linux 和 macOS 上受支持的终端模拟器。我们正在努力添加对 Windows 的支持。

![Gradle console](gradle-console-rich-output.png){width=600}

此特性默认启用，但如果您想覆盖它，请将以下 Gradle 属性添加到您的 `gradle.properties` 文件中：

```
org.gradle.console=plain
```

有关此属性及其选项的更多信息，请参阅 Gradle 关于 [自定义日志格式](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) 的文档。

### KGP 诊断中集成 Problems API

以前，Kotlin Gradle 插件 (KGP) 仅以纯文本形式向控制台或日志输出诊断信息（例如警告和错误）。

从 %kotlinEapVersion% 开始，KGP 引入了一种额外的报告机制：它现在使用 [Gradle 的 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)，
这是一种在构建过程中报告丰富、结构化疑难信息的标准化方式。

KGP 诊断信息现在更易于阅读，并且在 Gradle 命令行界面 (CLI) 和 IntelliJ IDEA 等不同界面中显示得更一致。

此集成默认启用，从 Gradle 8.6 或更高版本开始。
由于该 API 仍在不断发展，请使用最新的 Gradle 版本以受益于最新的改进。

### KGP 与 '--warning-mode' 的兼容性

Kotlin Gradle 插件 (KGP) 诊断信息以前使用固定严重性级别报告问题，这意味着 Gradle 的 [`--warning-mode` 命令行选项](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) 对 KGP 显示错误的方式没有影响。

现在，KGP 诊断信息与 `--warning-mode` 选项兼容，提供了更大的灵活性。例如，
您可以将所有警告转换为错误，或完全禁用警告。

通过此更改，KGP 诊断信息将根据选定的警告模式调整输出：

* 当您设置 `--warning-mode=fail` 时，具有 `Severity.Warning` 的诊断信息现在会提升为 `Severity.Error`。
* 当您设置 `--warning-mode=none` 时，具有 `Severity.Warning` 的诊断信息不会记录。

此行为从 %kotlinEapVersion% 开始默认启用。

要忽略 `--warning-mode` 选项，请在您的 Gradle 属性中设置 `kotlin.internal.diagnostics.ignoreWarningMode=true`。

## Kotlin 标准库：稳定的 Base64 和 HexFormat API

在 Kotlin %kotlinEapVersion% 中，[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 和 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在已 [稳定](components-stability.md#stability-levels-explained)。

### Base64 编码和解码

Kotlin 1.8.20 引入了 [Base64 编码和解码的实验性支持](whatsnew1820.md#support-for-base64-encoding)。
在 Kotlin %kotlinEapVersion% 中，[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 现在已稳定，并
包含四种编码方案，此版本中新增了 `Base64.Pem`：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) 使用标准 [Base64 编码方案](https://www.rfc-editor.org/rfc/rfc4648#section-4)。

  > `Base64.Default` 是 `Base64` 类的伴生对象。
  > 因此，您可以使用 `Base64.encode()` 和 `Base64.decode()` 调用其函数，而不是 `Base64.Default.encode()` 和 `Base64.Default.decode()`。
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) 使用 [“URL 和文件名安全”](https://www.rfc-editor.org/rfc/rfc4648#section-5) 编码方案。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) 使用 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 编码方案，在编码期间每 76 个字符插入一个行分隔符，并在解码期间跳过非法字符。
* `Base64.Pem` 的数据编码方式与 `Base64.Mime` 类似，但将行长度限制为 64 个字符。

您可以使用 Base64 API 将二进制数据编码为 Base64 字符串，并将其解码回字节。

以下是一个示例：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

在 JVM 上，使用 `.encodingWith()` 和 `.decodingWith()` 扩展函数通过输入输出流进行 Base64 编码和解码：

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

### 使用 HexFormat API 进行十六进制解析和格式化

在 [Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) 中引入的 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) 现在已 [稳定](components-stability.md#stability-levels-explained)。
您可以使用它在数值和十六进制字符串之间进行转换。

例如：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

有关更多信息，请参阅[新的 HexFormat 类用于格式化和解析十六进制](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)。