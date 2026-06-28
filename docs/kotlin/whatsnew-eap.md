[//]: # (title: Kotlin %kotlinEapVersion% 最新变化)

<primary-label ref="eap"/>

<web-summary>阅读 Kotlin 抢先体验预览发布说明，并在最新的实验性 Kotlin 功能正式发布之前进行试用。</web-summary>

_[发布日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验计划 (EAP) 版本的所有功能，
> 但它重点介绍了其中的一些重大改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！以下是此 EAP 版本的一些详细信息：

* **标准库：** [支持协程堆栈跟踪恢复](#standard-library-support-for-coroutine-stack-trace-recovery)
* **Kotlin/Native：** [默认启用 `klib` 构件的增量编译](#kotlin-native-incremental-compilation-enabled-by-default)
* **Kotlin/Wasm：** [顶层 `require()` 调用更改以及改进的伴生对象初始化顺序](#kotlin-wasm)
* **Kotlin/JS：** [用于浏览器测试的新 DSL](#kotlin-js-new-dsl-for-browser-testing)
* **构建工具 API：** [支持新目标：Kotlin/JS、Kotlin/Wasm 和 Kotlin 元数据](#build-tools-api-support-for-kotlin-js-kotlin-wasm-and-kotlin-metadata)

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## 更新到 Kotlin %kotlinEapVersion%

最新版本的 Kotlin 已包含在最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/studio) 中。

要更新到新的 Kotlin 版本，请确保您的 IDE 已更新至最新版本，并在您的构建脚本中将 [Kotlin 版本更改](releases.md#update-to-a-new-kotlin-version)为 %kotlinEapVersion%。

## 标准库：支持协程堆栈跟踪恢复
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 在标准库中添加了 `StackTraceRecoverable` 接口。
这改进了与 `kotlinx.coroutines` 库的集成，因为它允许您定义如何为堆栈跟踪恢复创建新的异常实例，而无需添加对 `kotlinx.coroutines` 的依赖。

当一个协程抛出异常而另一个协程重新抛出该异常时，堆栈跟踪恢复有助于调试。
它可以让您看到异常源自何处以及另一个协程在何处重新抛出了它。

`kotlinx.coroutines` 库通过创建一个包含额外协程堆栈跟踪信息的新异常实例来执行堆栈跟踪恢复。
对于构造函数仅接受异常消息、原因 (cause)、两者皆有或不带参数的异常，这是自动发生的。

如果异常构造函数具有额外的必需参数（例如行号或错误代码），请实现 `StackTraceRecoverable` 接口以定义 `kotlinx.coroutines` 库如何创建该异常的新实例。

为此，请重写 `copyForStackTraceRecovery()` 函数。此函数返回用于堆栈跟踪恢复的新异常实例，如果您不希望 `kotlinx.coroutines` 库复制该异常，则返回 `null`。

> `StackTraceRecoverable` 接口在所有目标平台上都可用，但 `kotlinx.coroutines` 库仅在 JVM 上将其用于堆栈跟踪恢复。
>
{style="note"}

这些 API 处于[实验性](components-stability.md#stability-levels-explained)阶段，需要使用 `@OptIn(ExperimentalStdlibCoroutineSupportApi::class)` 注解进行显式启用。

以下是一个自定义异常示例，它在为堆栈跟踪恢复创建新实例时保留了 `line` 属性：

```kotlin
import kotlin.coroutines.ExperimentalStdlibCoroutineSupportApi
import kotlin.coroutines.StackTraceRecoverable

@OptIn(ExperimentalStdlibCoroutineSupportApi::class)
class FileEditException
// 实现需要一个私有构造函数
// 以将 cause 传递给 IllegalStateException 构造函数
private constructor(
    val line: Int,
    private val detail: String,
    cause: Throwable?,
) : IllegalStateException("When editing line $line: $detail", cause),
    // 实现 StackTraceRecoverable 以进行堆栈跟踪恢复
    StackTraceRecoverable<FileEditException> {

    constructor(line: Int, detail: String) : this(line, detail, null)

    // 复制行号和消息详情
    override fun copyForStackTraceRecovery(): FileEditException =
        FileEditException(line, detail, this)
}

@OptIn(ExperimentalStdlibCoroutineSupportApi::class) 
fun main() {
    val original = FileEditException(15, "Unexpected token")
    val copy = original.copyForStackTraceRecovery()

    println(copy.message)
    // When editing line 15: Unexpected token

    println(copy.cause == original)
    // true
}
```

欲了解更多信息，请参阅该功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/stdlib/KEEP-0461-stacktrace-recoverable.md)。
我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-86595) 中提供反馈。

## Kotlin/Native：默认启用增量编译

从 %kotlinEapVersion% 开始，默认启用 `klib` 构件的增量编译。

通过增量编译，如果项目模块生成的 `klib` 构件只有一部分发生变化，则只有 `klib` 中受影响的部分会被进一步重新编译为二进制文件。

此优化最初在 [Kotlin 1.9.20](whatsnew1920.md#incremental-compilation-of-klib-artifacts) 中引入，并已证明能显著减少调试构建的编译时间。

请注意，在某些情况下，此优化可能会给全新构建带来性能开销。

如果您遇到此功能的意外问题，可以手动将其禁用。为此，请在您的 `gradle.properties` 文件中设置以下选项：

```none
kotlin.incremental.native=false
```

请在我们的问题跟踪器 [YouTrack](https://kotl.in/issue) 中报告任何问题。有关缩短编译时间的更多提示，请参阅我们的[文档](native-improving-compilation-time.md)。

## Kotlin/Wasm

Kotlin %kotlinEapVersion% 更改了 Kotlin/Wasm 处理 `@JsFun` 声明中顶层 `require()` 调用方式，并将伴生对象初始化顺序与 JVM 行为对齐。

### `@JsFun` 声明中顶层 `require()` 调用的更改

当 `@JsFun` 声明使用顶层 `require()` 函数时，Kotlin/Wasm 现在会报告错误。

此前，编译器在 `import-object.mjs` 文件中生成一个 `require` 变量，允许 `@JsFun` 声明调用 `require()`。

这种行为无意中暴露了编译器的实现细节。为了支持从此行为迁移，Kotlin/Wasm 移除了这个生成的 `require` 声明，且编译器现在会针对此类调用报告错误。例如：

```kotlin
// 报告错误
@JsFun("(mod) => require(mod)")
external fun loadModule(mod: String): JsAny
```

要为此更改做好准备，请将 `@JsFun` 声明中的顶层 `require()` 调用替换为 `@JsModule` 注解：

```kotlin
@JsModule("module")
external val module: Module

external interface Module {
    // 定义预期的模块成员
}
```

对于动态模块加载，请改用 `import()` 表达式。
添加 `/* webpackIgnore: true */` 魔法注释以防止 webpack 解析动态导入：

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        await import(/* webpackIgnore: true */ "module")
    )
"""
)
private external fun loadModuleDynamically(): JsAny?
```

您还可以有条件地使用 `import()` 表达式。例如，您可以仅在 Node.js 中运行时加载模块：

```kotlin
@JsFun(
    """
    ((module) => () => module)(
        ((typeof process !== "undefined") && (process.release.name === "node"))
            ? await import(/* webpackIgnore: true */ "module")
            : null
    )
"""
)
private external fun loadNodeModule(): JsAny?
```

如果您的项目依赖于需要顶层 `require()` 函数的依赖项，请将其添加为 `globalThis` 的属性作为权宜之计：

```kotlin
@JsFun(
    """
    ((module) => {
        globalThis.require = module.default.createRequire(import.meta.url)
        return () => {}
    })(await import("node:module"))
"""
)
external fun defineRequire()
```

如果您遇到任何问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/projects/KT/issues/KT-86192)中分享您的反馈。

### 改进的伴生对象初始化顺序

Kotlin/Wasm 现在在子类伴生对象之前初始化超类伴生对象，这与 JVM 行为一致。
此前，初始化顺序可能会颠倒，导致不同平台之间的行为不一致。

此更新提高了跨平台的一致性，并减少了类初始化行为中平台特定的差异。
它还能够正确处理更深层继承层次结构中的伴生对象初始化，包括中间类未声明伴生对象的情况。

## Kotlin/JS：用于浏览器测试的新 DSL
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 引入了一个新的实验性 DSL，用于在浏览器环境中运行 Kotlin/JS 测试。

目前，Kotlin Gradle 插件使用 [Karma](https://github.com/karma-runner/karma) 作为浏览器启动器，以在不同浏览器中运行 JavaScript 测试。Karma 项目已经弃用 2 年了，这促使我们探索支持浏览器测试的其他方式。

新的 DSL 旨在取代 Karma 作为底层不同工具的管理器，包括：

* [Mocha](https://mochajs.org/) 作为测试运行程序。
* [Webpack](https://webpack.js.org/) 作为捆绑器（在[未来版本](https://youtrack.jetbrains.com/issue/KT-48308/)中将被 [Vite](https://vite.dev/) 取代）。
* [Playwright](https://playwright.dev/) 作为浏览器驱动程序和分发管理器，支持 Chromium、Firefox 和 WebKit (Safari) 浏览器引擎。

要试用新的测试 DSL，请在 Kotlin/JS 目标的 `browser{}` 块内添加显式启用的 `test{}` 块：

```kotlin
kotlin {
    js {
        browser {
            @OptIn(ExperimentalJsTestDsl::class)
            // 添加并配置新的 test{} 块
            test {
                // 设置适用于所有浏览器的通用选项
                browserDefaults {
                    timeout = Duration.ofSeconds(2)
                    headless = true
                }
                // 启用 Chromium 测试运行程序
                chromium {
                    // 重写通用超时选项
                    timeout = Duration.ofSeconds(5)
                    launchArgs.add("--no-sandbox")
                }
                // 启用 Firefox 测试运行程序
                firefox()
                // 启用 WebKit 测试运行程序
                webkit { }
                // 启用并配置额外的 WebKit 测试运行程序
                webkit("noheadless") {
                    // 设置自定义选项
                    headless = false
                }
            }
        }
    }
}
```

新的 DSL 正在积极开发中。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-66897) 中提供反馈。

## 构建工具 API：支持 Kotlin/JS、Kotlin/Wasm 和 Kotlin 元数据
<primary-label ref="experimental-general"/>

在 [Kotlin 2.2.0](whatsnew22.md#new-experimental-build-tools-api) 中，构建工具 API (BTA) 已可用于 Kotlin/JVM。Kotlin 2.4.20-Beta1 通过添加对新目标的支持，迈出了 BTA 稳定的下一步：Kotlin/JS、Kotlin/Wasm 和 Kotlin 元数据。

这使得 Kotlin Gradle 插件与编译器的交互更加一致。在某些情况下，您还可以从更快、更稳定的编译中受益。

BTA 是一个通用 API，充当构建系统与 Kotlin 编译器生态系统之间的抽象层。
它有助于支持构建工具中可用的 Kotlin 功能以及与 Kotlin 编译器的兼容性。

我们计划在 Kotlin Gradle 插件中逐步推出对新目标的 BTA 支持：

* 在 Kotlin 2.4.20-Beta1 中，BTA 在 Kotlin/JS、Kotlin/Wasm 和 Kotlin 元数据中默认启用，以收集反馈。
  无需在项目中进行额外更改。
* 在 Kotlin 2.4.20-Beta2 与 Kotlin 2.4.20 正式版之间，新目标中的 BTA 将作为显式启用功能提供。
  要试用它，请将相应的属性添加到您的 `gradle.properties` 文件中：

  ```kotlin
  kotlin.wasm.runViaBuildToolsApi = true
  kotlin.js.runViaBuildToolsApi = true
  kotlin.metadata.runViaBuildToolsApi = true
  ```

* 从 Kotlin 2.5.0 开始，BTA 将再次在 Kotlin/JS、Kotlin/Wasm 和 Kotlin 元数据中默认启用。

如果您对 BTA 提案感兴趣或想分享反馈，请参阅此 [KEEP](https://github.com/Kotlin/KEEP/blob/build-tools-api/proposals/extensions/build-tools-api.md)。