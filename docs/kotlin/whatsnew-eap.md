[//]: # (title: Kotlin %kotlinEapVersion% 有哪些新变化)

_[发布时间：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验预览 (EAP) 版本的所有特性，
> 但它突出介绍了一些主要的改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub changelog](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！
以下是该 EAP 版本的一些详细信息：

* Kotlin Multiplatform：[Swift export 默认可用](#swift-export-available-by-default)，[js 和 wasmJs 目标的共享源代码集](#shared-source-set-for-js-and-wasmjs-targets)，[Kotlin 库的稳定跨平台编译](#stable-cross-platform-compilation-for-kotlin-libraries)，以及[声明公共依赖项的新方法](#new-approach-for-declaring-common-dependencies)。
* 语言：[传递 lambda 到挂起函数类型重载时改进的重载解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)。
* Kotlin/Native：[支持二进制文件中的栈金丝雀](#support-for-stack-canaries-in-binaries) 和 [更小的 iOS 目标二进制文件大小](#smaller-binary-size-for-ios-targets)。
* Kotlin/Wasm：[改进的 Kotlin/Wasm 和 JavaScript 互操作异常处理](#improved-exception-handling-in-kotlin-wasm-and-javascript-interop)。
* Kotlin/JS：[`Long` 值编译为 JavaScript `BigInt`](#usage-of-bigint-type-to-represent-kotlin-s-long-type)。

## IDE 支持

支持 Kotlin %kotlinEapVersion% 的 Kotlin 插件已与最新版本的 IntelliJ IDEA 和 Android Studio 捆绑。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap.md) 为 %kotlinEapVersion% 即可。

关于详细信息，请参阅 [更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 语言

在 Kotlin %kotlinEapVersion% 中，您可以尝试 Kotlin 2.3.0 计划推出的一些语言特性，包括
[传递 lambda 到挂起函数类型重载时改进的重载解析](#improved-overload-resolution-for-lambdas-with-suspend-function-types)
以及 [支持在带有显式返回类型的表达式体中使用 return 语句](#support-for-return-statements-in-expression-bodies-with-explicit-return-types)。

### 传递 lambda 到挂起函数类型重载时改进的重载解析

以前，当 lambda 传递给同时具有常规函数类型和 `suspend` 函数类型的函数重载时，会导致歧义错误。您可以通过显式类型转换来解决此错误，但编译器会错误地报告 `No cast needed` 警告：

```kotlin
// Defines two overloads
fun transform(block: () -> Int) {}
fun transform(block: suspend () -> Int) {}

fun test() {
    // Fails with overload resolution ambiguity
    transform({ 42 })

    // Uses an explicit cast, but compiler incorrectly reports a "No cast needed" warning
    transform({ 42 } as () -> Int)
}
```

进行此更改后，当您同时定义常规函数类型重载和 `suspend` 函数类型重载时，不带类型转换的 lambda 将解析为常规重载。使用 `suspend` 关键字可显式解析为挂起重载：

```kotlin
// Resolves to transform(() -> Int)
transform({ 42 })

// Resolves to transform(suspend () -> Int)
transform(suspend { 42 })
```

此行为将在 Kotlin 2.3.0 中默认启用。要立即测试此特性，请使用以下编译器选项将语言版本设置为 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 文件中配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-23610) 中提供反馈。

### 支持在带有显式返回类型的表达式体中使用 return 语句

以前，在表达式体中使用 `return` 会导致编译器错误，因为它可能导致函数的返回类型被推断为 `Nothing`。

```kotlin
fun example() = return 42
// Error: Returns are prohibited for functions with an expression body
```

进行此更改后，只要显式编写返回类型，您现在就可以在表达式体中使用 `return`：

```kotlin
// Specifies the return type explicitly
fun getDisplayNameOrDefault(userId: String?): String = getDisplayName(userId ?: return "default")

// Fails because it doesn't specify the return type explicitly
fun getDisplayNameOrDefault(userId: String?) = getDisplayName(userId ?: return "default")
```

同样，在表达式函数体中，lambda 和嵌套表达式内部的 `return` 语句过去会被意外编译。Kotlin 现在支持这些情况，只要显式指定返回类型即可。没有显式返回类型的情况将在 Kotlin 2.3.0 中弃用：

```kotlin
// Return type isn't explicitly specified, and the return statement is inside a lambda
// which will be deprecated
fun returnInsideLambda() = run { return 42 }

// Return type isn't explicitly specified, and the return statement is inside the initializer
// of a local variable, which will be deprecated
fun returnInsideIf() = when {
    else -> {
        val result = if (someCondition()) return "" else "value"
        result
    }
}
```

此行为将在 Kotlin 2.3.0 中默认启用。要立即测试此特性，请使用以下编译器选项将语言版本设置为 `2.3`：

```kotlin
-language-version 2.3
```

或者在您的 `build.gradle(.kts)` 文件中配置：

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_3)
    }
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76926) 中提供反馈。

## Kotlin/JVM：支持 `when` 表达式的 invokedynamic
<primary-label ref="experimental-opt-in"/> 

在 Kotlin %kotlinEapVersion% 中，您现在可以使用 `invokedynamic` 编译 `when` 表达式。
以前，具有多个类型检测的 `when` 表达式会编译成字节码中一长串的 `instanceof` 检测。

现在，您可以在 `when` 表达式中使用 `invokedynamic` 来生成更小的字节码，类似于 Java `switch` 语句生成的字节码，前提是满足以下条件：

* 除了 `else` 之外的所有条件都是 `is` 或 `null` 检测。
* 表达式不包含 [守卫条件 (`if`)](control-flow.md#guard-conditions-in-when-expressions)。
* 条件不包含无法直接进行类型检测的类型，例如可变 Kotlin 集合 (`MutableList`) 或函数类型 (`kotlin.Function1`、`kotlin.Function2` 等)。
* 除了 `else` 之外，至少有两个条件。
* 所有分支都检测 `when` 表达式的相同主题。

例如：

```kotlin
open class Example

class A : Example()
class B : Example()
class C : Example()

fun test(e: Example) = when (e) {
    // Uses invokedynamic with SwitchBootstraps.typeSwitch
    is A -> 1
    is B -> 2
    is C -> 3
    else -> 0
}
```

启用此新特性后，此示例中的 `when` 表达式会编译为一个 `invokedynamic` 类型切换，而不是多个 `instanceof` 检测。

要启用此特性，请使用 JVM 目标 21 或更高版本编译您的 Kotlin 代码，并添加以下编译器选项：

```bash
-Xwhen-expressions=indy
```

或者将其添加到 `build.gradle(.kts)` 文件的 `compilerOptions {}` 代码块中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xwhen-expressions=indy")
    }
}
```

此特性是[实验性的](components-stability.md#stability-levels-explained)。如果您有任何反馈或问题，请在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-65688) 中分享。

## Kotlin Multiplatform

Kotlin %kotlinEapVersion% 为 Kotlin Multiplatform 带来了重大更改：Swift export 默认可用，引入了新的共享源代码集，并且您可以尝试一种管理公共依赖项的新方法。

### Swift export 默认可用
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% 引入了 Swift export 的实验性支持。它允许您直接导出 Kotlin 源代码并以地道的 Swift 方式调用 Kotlin 代码，从而无需 Objective-C 头文件。

这应该会显著改进 Apple 目标平台的跨平台开发。例如，如果您有一个包含顶层函数的 Kotlin 模块，Swift export 可以实现干净的、模块特有的导入，从而消除令人困惑的 Objective-C 下划线和名字修饰。

主要特性包括：

* **多模块支持**。每个 Kotlin 模块都作为一个单独的 Swift 模块导出，从而简化了函数调用。
* **包支持**。Kotlin 包在导出期间会显式保留，从而避免生成的 Swift 代码中出现命名冲突。
* **类型别名**。Kotlin 类型别名在 Swift 中被导出并保留，提高了可读性。
* **增强的原语可空性**。与 Objective-C 互操作（需要将 `Int?` 等类型装箱到 `KotlinInt` 等包装类以保留可空性）不同，Swift export 直接转换可空性信息。
* **重载**。您可以在 Swift 中调用 Kotlin 的重载函数而不会出现歧义。
* **扁平化包结构**。您可以将 Kotlin 包转换为 Swift 枚举，从而从生成的 Swift 代码中删除包前缀。
* **模块名称自定义**。您可以在 Kotlin 项目的 Gradle 配置中自定义生成的 Swift 模块名称。

#### 如何启用 Swift export

此特性目前是[实验性的](components-stability.md#stability-levels-explained)，并且仅适用于使用[直接集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html) 将 iOS framework 连接到 Xcode 项目的项目。这是使用 IntelliJ IDEA 中的 Kotlin Multiplatform 插件或通过 [web wizard](https://kmp.jetbrains.com/) 创建的 Kotlin Multiplatform 项目的标准配置。

要试用 Swift export，请配置您的 Xcode 项目：

1. 在 Xcode 中，打开项目设置。
2. 在 **Build Phases** 选项卡中，找到包含 `embedAndSignAppleFrameworkForXcode` 任务的 **Run Script** 阶段。
3. 调整脚本，使其在运行脚本阶段使用 `embedSwiftExportForXcode` 任务：

  ```bash
  ./gradlew :<Shared module name>:embedSwiftExportForXcode
  ```

  ![Add the Swift export script](xcode-swift-export-run-script-phase.png){width=700}

4. 构建项目。Swift 模块在构建输出目录中生成。

此特性默认可用。如果您在以前的版本中已启用此特性，则现在可以从 `gradle.properties` 文件中移除 `kotlin.experimental.swift-export.enabled`。

> 为了节省时间，请克隆我们已设置好 Swift export 的 [公共示例](https://github.com/Kotlin/swift-export-sample)。
>
{style="tip"}

关于 Swift export 的更多信息，请参阅其 [README](https://github.com/JetBrains/kotlin/tree/master/docs/swift-export#readme)。

#### 留下反馈

我们计划在未来的 Kotlin 版本中扩展并逐步稳定 Swift export 支持。在 Kotlin 2.2.20 之后，我们将专注于改进 Kotlin 和 Swift 之间的互操作性，尤其是在协程和流方面。

对 Swift export 的支持是 Kotlin Multiplatform 的一项重大更改。我们非常感谢您的反馈：

* 直接在 Kotlin Slack 中联系开发团队 – [获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_gl=1*ju6cbn*_ga*MTA3MTk5NDkzMC4xNjQ2MDY3MDU4*_ga_9J976DJZ68*MTY1ODMzNzA3OS4xMDAuMS4xNjU4MzQwODEwLjYw) 并加入 [#swift-export](https://kotlinlang.slack.com/archives/C073GUW6WN9) 频道。
* 在 [YouTrack](https://kotl.in/issue) 中报告您在使用 Swift export 时遇到的任何问题。

### js 和 wasmJs 目标的共享源代码集

以前，Kotlin Multiplatform 默认不包含 JavaScript (`js`) 和 WebAssembly (`wasmJs`) web 目标的共享源代码集。为了在 `js` 和 `wasmJs` 之间共享代码，您必须手动配置自定义源代码集或在两个地方编写代码，一个版本用于 `js`，另一个版本用于 `wasmJs`。例如：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// jsMain
external interface Navigator { val clipboard: Clipboard }
// Different interop in JS and Wasm
external interface Clipboard { fun readText(): Promise<String> } 
external val navigator: Navigator

suspend fun readCopiedText(): String {
  // Different interop in JS and Wasm
    return navigator.clipboard.readText().await() 
}

// wasmJsMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString() 
}
```

从该版本开始，当使用默认层级模板时，Kotlin Gradle 插件会为 web 添加一个新的共享源代码集（包含 `webMain` 和 `webTest`）。

进行此更改后，`web` 源代码集将成为 `js` 和 `wasmJs` 源代码集的父级。更新后的源代码集层级结构如下所示：

![An example of using the default hierarchy template with web](default-hierarchy-example-with-web.svg)

新的源代码集允许您为 `js` 和 `wasmJs` 目标编写一份代码。您可以将共享代码放在 `webMain` 中，它会自动适用于这两个目标：

```kotlin
// commonMain
expect suspend fun readCopiedText(): String

// webMain
external interface Navigator { val clipboard: Clipboard }
external interface Clipboard { fun readText(): Promise<JsString> }
external val navigator: Navigator

suspend fun readCopiedText(): String {
    return navigator.clipboard.readText().await().toString()
}
```

此更新简化了 `js` 和 `wasmJs` 目标之间的代码共享。它在两种情况下特别有用：

* 对于希望添加对 `js` 和 `wasmJs` 目标的支持而无需复制代码的库作者。
* 对于构建面向 Web 的 Compose Multiplatform 应用程序的开发者，它支持跨编译到 `js` 和 `wasmJs` 目标，以实现更广泛的浏览器兼容性。有了这种回退模式，当您创建网站时，它将开箱即用地在所有浏览器上运行：现代浏览器使用 `wasmJs`，而旧浏览器使用 `js`。

要试用此特性，请在 `build.gradle(.kts)` 文件的 `kotlin {}` 代码块中使用 [默认层级模板](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#default-hierarchy-template)。

在使用默认层级之前，如果您有包含自定义共享源代码集或已重命名 `js("web")` 目标的项目，请仔细考虑任何潜在冲突。要解决这些冲突，请重命名冲突的源代码集或目标，或者不使用默认层级。

### Kotlin 库的稳定跨平台编译

Kotlin %kotlinEapVersion% 完成了一项重要的[路线图项目](https://youtrack.jetbrains.com/issue/KT-71290)，稳定了 Kotlin 库的跨平台编译。

您现在可以使用任何宿主来生成 `.klib` artifact，用于发布 Kotlin 库。这显著简化了发布过程，特别是对于以前需要 Mac 机器的 Apple 目标平台。

此特性默认可用。如果您已通过 `kotlin.native.enableKlibsCrossCompilation=true` 启用跨编译，则现在可以从您的 `gradle.properties` 文件中移除它。

不幸的是，仍然存在一些限制。在以下情况下，您仍然需要使用 Mac 机器：

* 您的库具有 [cinterop 依赖项](native-c-interop.md)。
* 您在项目中设置了 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)。
* 您需要为 Apple 目标平台构建或测试 [最终二进制文件](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。

关于多平台库的发布信息，请参阅我们的[文档](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html)。

### 声明公共依赖项的新方法
<primary-label ref="experimental-opt-in"/>

为了简化使用 Gradle 设置多平台项目，Kotlin %kotlinEapVersion% 现在允许您通过使用顶层 `dependencies {}` 代码块在 `kotlin {}` 代码块中声明公共依赖项。这些依赖项的行为就像它们在 `commonMain` 源代码集中声明一样。此特性与您用于 Kotlin/JVM 和仅限 Android 项目的依赖项代码块类似，现在在 Kotlin Multiplatform 中是[实验性的](components-stability.md#stability-levels-explained)。在项目级别声明公共依赖项可以减少跨源代码集的重复配置，并有助于简化您的构建设置。您仍然可以根据需要在每个源代码集中添加平台特有的依赖项。

要试用此特性，请在顶层 `dependencies {}` 代码块之前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解来选择启用。例如：

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 中对该特性提供反馈。

## Kotlin/Native

Kotlin %kotlinEapVersion% 为 Kotlin/Native 二进制文件和调试带来了改进。

### 支持二进制文件中的栈金丝雀

从 %kotlinEapVersion% 开始，Kotlin 在生成的 Kotlin/Native 二进制文件中添加了对栈金丝雀的支持。作为栈保护的一部分，此安全特性可防止栈溢出攻击，从而减轻一些常见的应用程序漏洞。它已在 Swift 和 Objective-C 中可用，现在 Kotlin 也支持它。

#### 如何启用栈金丝雀

Kotlin/Native 中栈保护的实现遵循 [Clang](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fstack-protector) 中栈保护器的行为。

要启用栈金丝雀，请将以下属性添加到您的 `gradle.properties` 文件中：

```none
kotlin.native.binary.stackProtector=yes
```

此属性为所有易受栈溢出攻击的 Kotlin 函数启用此特性。替代模式包括：

* `kotlin.native.binary.stackProtector=strong`，它对易受栈溢出攻击的函数使用更强的启发式方法。
* `kotlin.native.binary.stackProtector=all`，它为所有函数启用栈保护器。

请注意，在某些情况下，栈保护可能会带来性能开销。

### 更小的 iOS 目标二进制文件大小
<primary-label ref="experimental-general"/> 

Kotlin %kotlinEapVersion% 引入了 `smallBinary` 选项，可以帮助您减小 iOS 目标的二进制文件大小。新选项有效地将 `-Oz` 设置为 LLVM 编译阶段编译器默认的优化实参。

启用 `smallBinary` 选项后，可以使发布二进制文件更小并改善构建时间。但是，在某些情况下，它可能会影响运行时性能。

#### 如何启用更小的二进制文件大小

此新特性目前是[实验性的](components-stability.md#stability-levels-explained)。要在您的项目中试用它，请使用 `-Xbinary=smallBinary=true` 编译器选项或更新您的 `gradle.properties` 文件：

```none
kotlin.native.binary.smallBinary=true
```

对于特定的二进制文件，请在您的 `build.gradle(.kts)` 文件中设置 `binaryOption("smallBinary", "true")`。例如：

```kotlin
kotlin {
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64(),
    ).forEach {
        it.binaries.framework {
            binaryOption("smallBinary", "true")
        }
    }
}
```

Kotlin 团队感谢 [Troels Lund](https://github.com/troelsbjerre) 在实现此特性方面提供的帮助。

关于 Kotlin/Native 中调试的更多信息，请参阅[文档](native-debugging.md)。

### 改进的调试器对象摘要

Kotlin/Native 现在为 LLDB 和 GDB 等调试器工具生成更清晰的对象摘要。这提高了生成的调试信息的可读性并简化了您的调试体验。

以前，如果您探查一个对象，例如：

```kotlin
class Point(val x: Int, val y: Int)
val point = Point(1, 2)
```

您会看到有限的信息，包括指向内存地址的指针：

```none
(lldb) v point
(ObjHeader *) point = [x: ..., y: ...]
(lldb) v point->x
(int32_t *) x = 0x0000000100274048
```

使用 Kotlin %kotlinEapVersion% 后，调试器会显示更丰富的信息，包括实际值：

```none
(lldb) v point
(ObjHeader *) point = Point(x=1, y=2)
(lldb) v point->x
(int32_t) point->x = 1
```

Kotlin 团队感谢 [Nikita Nazarov](https://github.com/nikita-nazarov) 在实现此特性方面提供的帮助。

关于 Kotlin/Native 中调试的更多信息，请参阅[文档](native-debugging.md)。

## Kotlin/Wasm

Kotlin/Wasm 获得了一些质量改进，包括分离的 npm 依赖项和改进的 JavaScript 互操作异常处理。

### 分离的 npm 依赖项

以前，在您的 Kotlin/Wasm 项目中，所有 [npm](https://www.npmjs.com/) 依赖项都一起安装在您的项目文件夹中。它包括您自己的依赖项和 Kotlin 工具依赖项。这些依赖项也一起记录在您项目的锁定文件（`package-lock.json` 或 `yarn.lock`）中。

因此，每当 Kotlin 工具依赖项更新时，即使您没有添加或更改任何内容，也必须更新您的锁定文件。

从 Kotlin %kotlinEapVersion% 开始，Kotlin 工具 npm 依赖项安装在您的项目之外。现在，工具和用户依赖项具有单独的目录：

* **工具依赖项目录：**

  `<kotlin-user-home>/kotlin-npm-tooling/<yarn|npm>/hash/node_modules`

* **用户依赖项目录：**

  `build/wasm/node_modules`

此外，项目目录中的锁定文件只包含用户定义的依赖项。

此改进使您的锁定文件仅关注您自己的依赖项，有助于维护更整洁的项目，并减少对文件的非必要更改。

此更改默认对 `wasm-js` 目标启用。此更改尚未针对 `js` 目标实现。虽然计划在未来的版本中实现它，但在 Kotlin %kotlinEapVersion% 中，`js` 目标的 npm 依赖项行为保持不变。

### 改进的 Kotlin/Wasm 和 JavaScript 互操作异常处理

以前，Kotlin 难以理解在 JavaScript (JS) 中抛出并跨越到 Kotlin/Wasm 代码的异常（错误）。

在某些情况下，当异常通过 Wasm 代码抛出或传递到 JS 并被包装到 `WebAssembly.Exception` 中而没有任何详细信息时，也会出现相反方向的问题。这些 Kotlin 异常处理问题使调试变得困难。

从 Kotlin %kotlinEapVersion% 开始，异常的开发者体验在两个方向上都得到了改进：

* 当 JavaScript 抛出异常时：您可以在 Kotlin 端看到更多信息。当此类异常通过 Kotlin 传播回 JS 时，它不再包装到 WebAssembly 中。
* 当 Kotlin 抛出异常时：它们现在可以作为 JS 错误在 JavaScript 端被捕获。

新的异常处理在支持 [`WebAssembly.JSTag`](https://webassembly.github.io/exception-handling/js-api/#dom-webassembly-jstag) 特性的现代浏览器中自动工作：

* Chrome 115+
* Firefox 129+
* Safari 18.4+

在旧浏览器中，异常处理行为保持不变。

## Kotlin/JS

Kotlin %kotlinEapVersion% 支持使用 `BigInt` 类型来表示 Kotlin 的 `Long` 类型，从而在导出的声明中启用 `Long`。此外，此版本还添加了一个 DSL 函数来清理 Node.js 实参。

### 使用 BigInt 类型表示 Kotlin 的 Long 类型
<primary-label ref="experimental-opt-in"/>

在 ES2020 标准之前，JavaScript (JS) 不支持用于表示大于 53 位的精确整数的原语类型。

因此，Kotlin/JS 过去将 `Long` 值（64 位宽）表示为包含两个 `number` 属性的 JavaScript 对象。这种自定义实现使得 Kotlin 和 JavaScript 之间的互操作性更加复杂。

从 Kotlin %kotlinEapVersion% 开始，Kotlin/JS 现在在编译到现代 JavaScript (ES2020) 时，使用 JavaScript 的内置 `BigInt` 类型来表示 Kotlin 的 `Long` 值。

此更改支持 [将 `Long` 类型导出到 JavaScript](#usage-of-long-in-exported-declarations)，这也是 %kotlinEapVersion% 中引入的一项特性。因此，此更改简化了 Kotlin 和 JavaScript 之间的互操作性。

要启用它，请将以下编译器选项添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
// build.gradle.kts
kotlin {
    js {
        ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此特性仍是[实验性的](components-stability.md#stability-levels-explained)。请在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57128) 中报告任何问题。

#### Long 在导出声明中的用法

由于 Kotlin/JS 使用自定义的 `Long` 表示，因此很难提供一种直接的方式来从 JavaScript 与 Kotlin 的 `Long` 进行交互。因此，您无法将使用 `Long` 类型的 Kotlin 代码导出到 JavaScript。此问题影响了所有使用 `Long` 的代码，例如函数形参、类属性或构造函数。

现在 Kotlin 的 `Long` 类型可以编译为 JavaScript 的 `BigInt` 类型，Kotlin/JS 支持将 `Long` 值导出到 JavaScript，从而简化了 Kotlin 和 JavaScript 代码之间的互操作性。

要启用此特性：

1. 允许在 Kotlin/JS 中导出 `Long`。将以下编译器实参添加到您的 `build.gradle(.kts)` 文件中的 `freeCompilerArgs` 属性：

    ```kotlin
    // build.gradle.kts
    kotlin {
        js {
            ...
            compilerOptions {                   
                freeCompilerArgs.add("-XXLanguage:+JsAllowLongInExportedDeclarations")
            }
        }
    }
    ```

2. 启用 `BigInt` 类型。关于如何启用它，请参见 [使用 `BigInt` 类型表示 Kotlin 的 `Long` 类型](#usage-of-bigint-type-to-represent-kotlin-s-long-type)。

### 用于清理实参的新 DSL 函数

使用 Node.js 运行 Kotlin/JS 应用程序时，传递给程序的实参（`args`）通常包含：

* 可执行文件 `Node` 的路径。
* 脚本的路径。
* 您提供的实际命令行实参。

然而，`args` 的预期行为是仅包含命令行实参。为此，您必须在 `build.gradle(.kts)` 文件或 Kotlin 代码中使用 `drop()` 函数手动跳过前两个实参：

```kotlin
fun main(args: Array<String>) {
    println(args.drop(2).joinToString(", "))
}
```

这种变通方法重复、容易出错，并且在跨平台共享代码时效果不佳。

为了解决此问题，Kotlin %kotlinEapVersion% 引入了一个名为 `passCliArgumentsToMainFunction()` 的新 DSL 函数。

使用此函数，实参将仅包含命令行实参，并排除 `Node` 和脚本路径：

```kotlin
fun main(args: Array<String>) {
    // No need for drop() and only your custom arguments are included 
    println(args.joinToString(", "))
}
```

此更改减少了样板代码，避免了手动删除实参导致的错误，并提高了跨平台兼容性。

要启用此特性，请将以下 DSL 函数添加到您的 `build.gradle(.kts)` 文件中：

```kotlin
kotlin {
    js {
        nodejs {
            passCliArgumentsToMainFunction()
        }
    }
}
```

## Gradle：Kotlin/Native 任务的构建报告中新增编译器性能指标

在 Kotlin 1.7.0 中，我们引入了[构建报告](gradle-compilation-and-caches.md#build-reports) 来帮助跟踪编译器性能。从那时起，我们添加了更多指标，使这些报告更加详细，对于调查性能问题也更有用。

在 Kotlin %kotlinEapVersion% 中，构建报告现在包含 Kotlin/Native 任务的编译器性能指标。

要了解有关构建报告以及如何配置它们的更多信息，请参阅[启用构建报告](gradle-compilation-and-caches.md#enabling-build-reports)。

## Maven：kotlin-maven-plugin 中对 Kotlin daemon 的支持

随着 [Kotlin 2.2.0 中构建工具 API](whatsnew22.md#new-experimental-build-tools-api) 的引入，Kotlin %kotlinEapVersion% 通过在 `kotlin-maven-plugin` 中添加对 Kotlin daemon 的支持，更进一步。使用 Kotlin daemon 时，Kotlin 编译器在独立的进程中运行，这可以防止其他 Maven 插件覆盖系统属性。您可以在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-43894/Maven-Windows-error-RuntimeException-Could-not-find-installation-home-path) 中查看示例。

从 Kotlin %kotlinEapVersion% 开始，Kotlin daemon 默认启用。这为您带来了[增量编译](maven.md#enable-incremental-compilation) 的额外好处，有助于加快构建时间。如果您想恢复到以前的行为，请通过在 `pom.xml` 文件中将以下属性设置为 `false` 来选择停用：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

Kotlin %kotlinEapVersion% 还引入了一个新的 `jvmArgs` 属性，您可以使用它来自定义 Kotlin daemon 的默认 JVM 实参。例如，要覆盖 `-Xmx` 和 `-Xms` 选项，请将以下内容添加到您的 `pom.xml` 文件中：

```xml
<properties>
    <kotlin.compiler.daemon.jvmArgs>Xmx1500m,Xms500m</kotlin.compiler.daemon.jvmArgs>
</properties>
```

## 标准库：支持通过反射在 Kotlin/JS 中识别接口类型
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 向 Kotlin/JS 标准库添加了实验性的 `KClass.isInterface` 属性。

使用此属性，您现在可以检测类引用是否表示 Kotlin 接口。这使 Kotlin/JS 更接近与 Kotlin/JVM 的对等状态，在 Kotlin/JVM 中，您可以使用 `KClass.java.isInterface` 来检测类是否表示接口。

要选择启用，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun inspect(klass: KClass<*>) {
    // Prints true for interfaces
    println(klass.isInterface)
}
```

我们非常感谢您在我们的问题跟踪器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-78581) 中提供反馈。