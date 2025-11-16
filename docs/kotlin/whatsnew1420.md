[//]: # (title: Kotlin 1.4.20 新特性)

_[发布日期：2020 年 11 月 23 日](releases.md#release-details)_

Kotlin 1.4.20 提供了多项新的实验性特性，并为现有特性（包括 1.4.0 中添加的特性）提供了修复和改进。

你还可以在[这篇博客文章](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)中了解更多包含示例的新特性。

## Kotlin/JVM

Kotlin/JVM 的改进旨在使其与现代 Java 版本的特性保持同步：

- [Java 15 目标平台](#java-15-target)
- [invokedynamic 字符串连接](#invokedynamic-string-concatenation)

### Java 15 目标平台

现在 Java 15 可作为 Kotlin/JVM 的目标平台。

### invokedynamic 字符串连接

> `invokedynamic` 字符串连接是[实验性的](components-stability.md)。它可能随时被删除或更改。需要显式启用（详见下文）。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

Kotlin 1.4.20 可以在 JVM 9+ 目标平台下将字符串连接编译为 [动态调用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)，从而提升性能。

目前，此特性是实验性的，涵盖以下情况：
- `String.plus` 的操作符形式 (`a + b`)、显式形式 (`a.plus(b)`) 和引用形式 (`(a::plus)(b)`)。
- 内联类和数据类上的 `toString`。
- 字符串模板，但只有一个非常量实参的除外（请参阅 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)）。

要启用 `invokedynamic` 字符串连接，请添加 `-Xstring-concat` 编译器选项并选择以下值之一：
- `indy-with-constants`：使用 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 对字符串执行 `invokedynamic` 连接。
- `indy`：使用 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) 对字符串执行 `invokedynamic` 连接。
- `inline`：切换回通过 `StringBuilder.append()` 进行的经典连接。

## Kotlin/JS

Kotlin/JS 持续快速发展，在 1.4.20 中，你可以找到多项实验性特性和改进：

- [Gradle DSL 变更](#gradle-dsl-changes)
- [新向导模板](#new-wizard-templates)
- [IR 编译器忽略编译错误](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 变更

Kotlin/JS 的 Gradle DSL 收到多项更新，简化了项目设置和自定义。这包括 webpack 配置调整、自动生成的 `package.json` 文件修改，以及对传递性依赖项的改进控制。

#### webpack 配置的单一入口点

`browser` 目标平台现在提供一个新的配置块 `commonWebpackConfig`。在其中，你可以从单一入口点调整通用设置，而无需为 `webpackTask`、`runTask` 和 `testTask` 重复配置。

要为所有三个任务默认启用 CSS 支持，请在你的项目的 `build.gradle(.kts)` 文件中添加以下代码片段：

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

了解更多关于 [配置 webpack 打包](js-project-setup.md#webpack-bundling) 的信息。

#### `package.json` 通过 Gradle 自定义

为了更好地控制 Kotlin/JS 包管理和发布，你现在可以通过 Gradle DSL 将属性添加到项目文件 [`package.json`](https://nodejs.dev/learn/the-package-json-guide) 中。

要将自定义字段添加到 `package.json`，请在编译的 `packageJson` 代码块中使用 `customField` 函数：

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

了解更多关于 [`package.json` 自定义](js-project-setup.md#package-json-customization) 的信息。

#### Yarn 选择性依赖项解析

> Yarn 选择性依赖项解析的支持是[实验性的](components-stability.md)。它可能随时被删除或更改。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

Kotlin 1.4.20 提供了一种配置 Yarn [选择性依赖项解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) 的方式——这是用于覆盖你所依赖的包的依赖项的机制。

你可以在 Gradle 中通过 `YarnPlugin` 内部的 `YarnRootExtension` 来使用它。要影响项目解析的包版本，请使用 `resolution` 函数，并传入包名选择器（由 Yarn 指定）和应解析到的版本。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

这里，你所有需要 `react` 的 npm 依赖项都将收到版本 `16.0.0`，而 `processor` 将收到其依赖项 `decamelize` 的版本 `3.0.0`。

#### 禁用细粒度工作空间

> 禁用细粒度工作空间是[实验性的](components-stability.md)。它可能随时被删除或更改。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

为了加快构建时间，Kotlin/JS Gradle 插件只安装特定 Gradle 任务所需的依赖项。例如，`webpack-dev-server` 包只在你执行 `*Run` 任务之一时安装，而不在执行 assemble 任务时安装。这种行为在你并行运行多个 Gradle 进程时可能会带来问题。当依赖项要求冲突时，两次 npm 包安装可能会导致错误。

为了解决这个问题，Kotlin 1.4.20 包含一个选项来禁用这些所谓的“细粒度工作空间”。此特性目前通过 Gradle 中 `YarnPlugin` 内部的 `YarnRootExtension` 提供。要使用它，请将以下代码片段添加到你的 `build.gradle.kts` 文件中：

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新向导模板

为了在项目创建过程中为你提供更便捷的自定义方式，Kotlin 的项目向导提供了新的 Kotlin/JS 应用程序模板：
- **浏览器应用程序** – 一个在浏览器中运行的最小 Kotlin/JS Gradle 项目。
- **React 应用程序** – 一个使用相应 `kotlin-wrappers` 的 React 应用。它提供了启用样式表、导航组件或状态容器集成的选项。
- **Node.js 应用程序** – 一个用于在 Node.js 运行时中运行的最小项目。它附带了一个选项，可以直接包含实验性的 `kotlinx-nodejs` 包。

### IR 编译器忽略编译错误

> _忽略编译错误_ 模式是[实验性的](components-stability.md)。它可能随时被删除或更改。需要显式启用（详见下文）。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

Kotlin/JS 的 [IR 编译器](js-ir-compiler.md) 带有一个新的实验性模式——_带错误编译_。在此模式下，即使代码包含错误，你也可以运行代码，例如，当整个应用程序尚未准备好时，你希望尝试某些功能。

此模式有两种容错策略：
- `SEMANTIC`：编译器将接受语法正确但语义上不合理的代码，例如 `val x: String = 3`。

- `SYNTAX`：编译器将接受任何代码，即使它包含语法错误。

要允许带错误编译，请添加 `-Xerror-tolerance-policy=` 编译器选项并选择上述值之一。

[了解更多关于 Kotlin/JS IR 编译器](js-ir-compiler.md) 的信息。

## Kotlin/Native

Kotlin/Native 在 1.4.20 中的优先级是性能和完善现有特性。以下是显著改进：

- [逃逸分析](#escape-analysis)
- [性能改进和 Bug 修复](#performance-improvements-and-bug-fixes)
- [Objective-C 异常的显式包装](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 插件改进](#cocoapods-plugin-improvements)
- [支持 Xcode 12 库](#support-for-xcode-12-libraries)

### 逃逸分析

> 逃逸分析机制是[实验性的](components-stability.md)。它可能随时被删除或更改。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

Kotlin/Native 接收了一个新 [逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis) 机制的原型。它通过在栈而不是堆上分配特定对象来提高运行时性能。此机制在我们的基准测试中显示出平均 10% 的性能提升，我们将继续改进它，以使其进一步加速程序。

逃逸分析在发布构建（使用 `-opt` 编译器选项）的单独编译阶段运行。

如果你想禁用逃逸分析阶段，请使用 `-Xdisable-phases=EscapeAnalysis` 编译器选项。

### 性能改进和 Bug 修复

Kotlin/Native 在各个组件中都接收到性能改进和 Bug 修复，包括 1.4.0 中添加的组件，例如[代码共享机制](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)。

### Objective-C 异常的显式包装

> Objective-C 异常包装机制是[实验性的](components-stability.md)。它可能随时被删除或更改。需要显式启用（详见下文）。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

Kotlin/Native 现在可以在运行时处理从 Objective-C 代码抛出的异常，以避免程序崩溃。

你可以选择启用将 `NSException` 包装成 `ForeignException` 类型的 Kotlin 异常。它们持有原始 `NSException` 的引用。这使你能够获取根本原因的信息并妥善处理。

要启用 Objective-C 异常的包装，请在 `cinterop` 调用中指定 `-Xforeign-exception-mode objc-wrap` 选项，或将 `foreignExceptionMode = objc-wrap` 属性添加到 `.def` 文件中。如果你使用 [CocoaPods 集成](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)，请在依赖项的 `pod {}` 构建脚本块中指定该选项，如下所示：

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

默认行为保持不变：当从 Objective-C 代码抛出异常时，程序会终止。

### CocoaPods 插件改进

Kotlin 1.4.20 延续了 CocoaPods 集成的一系列改进。具体来说，你可以尝试以下新特性：

- [改进的任务执行](#improved-task-execution)
- [扩展的 DSL](#extended-dsl)
- [更新的 Xcode 集成](#updated-integration-with-xcode)

#### 改进的任务执行

CocoaPods 插件获得了改进的任务执行流。例如，如果你添加一个新的 CocoaPods 依赖项，现有依赖项不会重新构建。添加额外目标平台也不会影响现有依赖项的重新构建。

#### 扩展的 DSL

向 Kotlin 项目添加 [CocoaPods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html) 依赖项的 DSL 获得了新功能。

除了本地 Pods 和来自 CocoaPods 版本库的 Pods，你还可以添加对以下类型库的依赖项：
* 来自自定义 spec 版本库的库。
* 来自 Git 版本库的远程库。
* 来自归档（也可通过任意 HTTP 地址获取）的库。
* 静态库。
* 带有自定义 cinterop 选项的库。

了解更多关于在 Kotlin 项目中[添加 CocoaPods 依赖项](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html) 的信息。在 [Kotlin with CocoaPods 示例](https://github.com/Kotlin/kmm-with-cocoapods-sample) 中查找示例。

#### 更新的 Xcode 集成

为了与 Xcode 正常工作，Kotlin 需要对 Podfile 进行一些更改：

* 如果你的 Kotlin Pod 具有任何 Git、HTTP 或 specRepo Pod 依赖项，你也应该在 Podfile 中指定它。
* 当你从自定义 spec 添加库时，你还应该在 Podfile 的开头指定 specs 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)。

现在集成错误在 IDEA 中有详细的描述。因此，如果你的 Podfile 出现问题，你将立即知道如何修复它们。

了解更多关于[创建 Kotlin Pods](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-xcode.html) 的信息。

### 支持 Xcode 12 库

我们增加了对 Xcode 12 随附的新库的支持。现在你可以从 Kotlin 代码中使用它们。

## Kotlin 多平台

### 更新的多平台库发布结构

从 Kotlin 1.4.20 开始，不再有单独的元数据发布。元数据 artifact 现在包含在_根_发布中，根发布代表整个库，当作为依赖项添加到公共源代码集时，会自动解析为相应的平台特有 artifact。

了解更多关于[发布多平台库](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-publish-lib-setup.html) 的信息。

#### 与早期版本的兼容性

这种结构变化破坏了具有[分层项目结构](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms) 的项目之间的兼容性。如果一个多平台项目及其所依赖的库都具有分层项目结构，那么你需要将它们同时更新到 Kotlin 1.4.20 或更高版本。使用 Kotlin 1.4.20 发布的库无法用于更早版本发布的项目。

没有分层项目结构的项目和库保持兼容。

## 标准库

Kotlin 1.4.20 的标准库提供了用于处理文件的新扩展和更好的性能。

- [`java.nio.file.Path` 的扩展](#extensions-for-java-nio-file-path)
- [`String.replace` 函数性能改进](#improved-string-replace-function-performance)

### `java.nio.file.Path` 的扩展

> `java.nio.file.Path` 的扩展是[实验性的](components-stability.md)。它们可能随时被删除或更改。需要显式启用（详见下文）。仅用于求值目的。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 提供反馈。
>
{style="warning"}

现在标准库为 `java.nio.file.Path` 提供了实验性扩展。以惯用的 Kotlin 方式使用现代 JVM 文件 API 现在类似于使用 `kotlin.io` 包中的 `java.io.File` 扩展。

```kotlin
// construct path with the div (/) operator
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// list files in a directory
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

这些扩展在 `kotlin-stdlib-jdk7` 模块的 `kotlin.io.path` 包中提供。要使用这些扩展，请[显式启用](opt-in-requirements.md) 实验性注解 `@ExperimentalPathApi`。

### `String.replace` 函数性能改进

`String.replace()` 的新实现加速了函数执行。区分大小写的变体使用基于 `indexOf` 的手动替换循环，而不区分大小写的变体则使用正则表达式匹配。

## Kotlin Android Extensions

在 1.4.20 中，Kotlin Android Extensions 插件被废弃，`Parcelable` 实现生成器移至单独的插件。

- [废弃合成视图](#deprecation-of-synthetic-views)
- [`Parcelable` 实现生成器的新插件](#new-plugin-for-parcelable-implementation-generator)

### 废弃合成视图

_合成视图_ 是 Kotlin Android Extensions 插件在一段时间前引入的，旨在简化与 UI 元素的交互并减少样板代码。现在 Google 提供了一种实现相同功能的原生机制——Android Jetpack 的[视图绑定](https://developer.android.com/topic/libraries/view-binding)，我们正在废弃合成视图以支持后者。

我们将 `Parcelable` 实现生成器从 `kotlin-android-extensions` 中提取出来，并开始对其余部分（合成视图）的废弃周期。目前，它们仍会带着废弃警告继续工作。将来，你需要将项目切换到其他解决方案。以下是[指南](https://goo.gle/kotlin-android-extensions-deprecation)，它将帮助你将 Android 项目从合成视图迁移到视图绑定。

### `Parcelable` 实现生成器的新插件

`Parcelable` 实现生成器现在在新的 `kotlin-parcelize` 插件中可用。请应用此插件而非 `kotlin-android-extensions`。

>`kotlin-parcelize` 和 `kotlin-android-extensions` 不能在同一模块中同时应用。
>
{style="note"}

`@Parcelize` 注解已移至 `kotlinx.parcelize` 包。

了解更多关于 `Parcelable` 实现生成器在 [Android 文档](https://developer.android.com/kotlin/parcelize) 中的信息。