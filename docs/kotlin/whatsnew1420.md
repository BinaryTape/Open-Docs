---
title: "Kotlin 1.4.20 新特性"
---
_[发布时间：2020 年 11 月 23 日](releases#release-details)_

Kotlin 1.4.20 提供了一些新的实验性功能，并为现有功能提供了修复和改进，包括 1.4.0 中添加的功能。

您还可以在[这篇博文中](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)通过更多示例了解新功能。

## Kotlin/JVM

Kotlin/JVM 的改进旨在使其与现代 Java 版本的功能保持同步：

- [Java 15 目标](#java-15-target)
- [`invokedynamic` 字符串连接](#invokedynamic-string-concatenation)

### Java 15 目标

现在 Java 15 可用作 Kotlin/JVM 目标。

### `invokedynamic` 字符串连接

:::note
`invokedynamic` 字符串连接是[实验性](components-stability)的。它可能随时被删除或更改。需要选择启用（opt-in）（参见下面的详细信息）。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

Kotlin 1.4.20 可以将字符串连接编译为 JVM 9+ 目标上的[动态调用](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)，从而提高性能。

目前，此功能是实验性的，涵盖以下情况：
- 操作符（`a + b`）、显式（`a.plus(b)`）和引用（`(a::plus)(b)`）形式的 `String.plus`。
- 内联类和数据类上的 `toString`。
- 字符串模板，但具有单个非常量参数的模板除外（请参阅 [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)）。

要启用 `invokedynamic` 字符串连接，请添加带有以下值之一的 `-Xstring-concat` 编译器选项：
- `indy-with-constants`：对带有 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-) 的字符串执行 `invokedynamic` 连接。
- `indy`：对带有 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-) 的字符串执行 `invokedynamic` 连接。
- `inline`：切换回通过 `StringBuilder.append()` 进行的经典连接。

## Kotlin/JS

Kotlin/JS 发展迅速，在 1.4.20 中，您可以找到许多实验性功能和改进：

- [Gradle DSL 更改](#gradle-dsl-changes)
- [新的 Wizard 模板](#new-wizard-templates)
- [使用 IR 编译器忽略编译错误](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 更改

Kotlin/JS 的 Gradle DSL 收到了一些更新，这些更新简化了项目设置和自定义。这包括 webpack 配置调整、对自动生成的 `package.json` 文件的修改以及对传递依赖项的改进控制。

#### webpack 配置的单点

一个新的配置块 `commonWebpackConfig` 可用于浏览器目标。在其中，您可以从一个点调整通用设置，而不必为 `webpackTask`、`runTask` 和 `testTask` 复制配置。

要默认对所有三个任务启用 CSS 支持，请在项目的 `build.gradle(.kts)` 中添加以下代码段：

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

了解更多关于[配置 webpack 打包](js-project-setup#webpack-bundling)。

#### 从 Gradle 自定义 package.json

为了更好地控制 Kotlin/JS 包管理和分发，您现在可以通过 Gradle DSL 向项目文件 [`package.json`](https://nodejs.dev/learn/the-package-json-guide) 添加属性。

要将自定义字段添加到 `package.json`，请在编译的 `packageJson` 块中使用 `customField` 函数：

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

了解更多关于 [`package.json` 自定义](js-project-setup#package-json-customization)。

#### 选择性 yarn 依赖项解析

选择性 yarn 依赖项解析是[实验性](components-stability)的。它可能随时被删除或更改。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

Kotlin 1.4.20 提供了一种配置 Yarn 的[选择性依赖项解析](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)的方法，该机制用于覆盖您所依赖的包的依赖项。

您可以通过 Gradle 中 `YarnPlugin` 内的 `YarnRootExtension` 使用它。要影响项目中包的已解析版本，请使用 `resolution` 函数传入包名称选择器（如 Yarn 所指定）以及应解析到的版本。

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

在这里，所有需要 `react` 的 npm 依赖项都将接收版本 `16.0.0`，并且 `processor` 将接收其依赖项 `decamelize` 作为版本 `3.0.0`。

#### 禁用精细工作区

禁用精细工作区是[实验性](components-stability)的。它可能随时被删除或更改。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

为了加快构建时间，Kotlin/JS Gradle 插件仅安装特定 Gradle 任务所需的依赖项。例如，仅当您执行其中一个 `*Run` 任务时才安装 `webpack-dev-server` 包，而不是在执行 assemble 任务时安装。当您并行运行多个 Gradle 进程时，这种行为可能会带来问题。当依赖项要求冲突时，npm 包的两个安装可能会导致错误。

为了解决这个问题，Kotlin 1.4.20 包括一个禁用这些所谓的*精细工作区*的选项。此功能目前可通过 Gradle 中 `YarnPlugin` 内的 `YarnRootExtension` 获得。要使用它，请将以下代码段添加到您的 `build.gradle.kts` 文件中：

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 新的 Wizard 模板

为了给您提供更方便的方式在创建期间自定义项目，Kotlin 的项目向导提供了用于 Kotlin/JS 应用程序的新模板：
- **浏览器应用程序（Browser Application）** - 在浏览器中运行的最小 Kotlin/JS Gradle 项目。
- **React 应用程序（React Application）** - 使用适当的 `kotlin-wrappers` 的 React 应用程序。
    它提供了启用样式表、导航组件或状态容器集成的选项。
- **Node.js 应用程序（Node.js Application）** - 用于在 Node.js 运行时中运行的最小项目。它提供了直接
    包含实验性 `kotlinx-nodejs` 包的选项。

### 使用 IR 编译器忽略编译错误

_忽略编译错误_ 模式是[实验性](components-stability)的。它可能随时被删除或更改。需要选择启用（opt-in）（参见下面的详细信息）。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

Kotlin/JS 的 [IR 编译器](js-ir-compiler) 具有一种新的实验模式 - _带错误的编译_。在这种模式下，即使您的代码包含错误，您也可以运行您的代码，例如，如果您想在整个应用程序尚未准备好时尝试某些操作。

此模式有两种容错策略：
- `SEMANTIC`：编译器将接受语法上正确但语义上没有意义的代码，例如 `val x: String = 3`。

- `SYNTAX`：编译器将接受任何代码，即使它包含语法错误。

要允许使用错误进行编译，请添加带有上面列出的值之一的 `-Xerror-tolerance-policy=` 编译器选项。

[了解更多关于 Kotlin/JS IR 编译器](js-ir-compiler)。

## Kotlin/Native

Kotlin/Native 在 1.4.20 中的优先级是性能和完善现有功能。以下是值得注意的改进：

- [逃逸分析](#escape-analysis)
- [性能改进和错误修复](#performance-improvements-and-bug-fixes)
- [选择启用 Objective-C 异常的包装](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 插件改进](#cocoapods-plugin-improvements)
- [支持 Xcode 12 库](#support-for-xcode-12-libraries)

### 逃逸分析

逃逸分析机制是[实验性](components-stability)的。它可能随时被删除或更改。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

Kotlin/Native 接收了新的[逃逸分析](https://en.wikipedia.org/wiki/Escape_analysis)机制的原型。它通过在堆栈而不是堆上分配某些对象来提高运行时性能。这种机制在我们的基准测试中显示出 10% 的平均性能提升，并且我们不断改进它，以便它能够更快地加速程序。

逃逸分析在发布版本的单独编译阶段运行（使用 `-opt` 编译器选项）。

如果要禁用逃逸分析阶段，请使用 `-Xdisable-phases=EscapeAnalysis` 编译器选项。

### 性能改进和错误修复

Kotlin/Native 在各种组件中获得了性能改进和错误修复，包括 1.4.0 中添加的组件，例如[代码共享机制](multiplatform-share-on-platforms#share-code-on-similar-platforms)。

### 选择启用 Objective-C 异常的包装

Objective-C 异常包装机制是[实验性](components-stability)的。它可能随时被删除或更改。需要选择启用（opt-in）（参见下面的详细信息）。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

Kotlin/Native 现在可以在运行时处理从 Objective-C 代码抛出的异常，以避免程序崩溃。

您可以选择将 `NSException` 包装到 `ForeignException` 类型的 Kotlin 异常中。它们保存对原始 `NSException` 的引用。这使您可以获取有关根本原因的信息并正确处理它。

要启用 Objective-C 异常的包装，请在 `cinterop` 调用中指定 `-Xforeign-exception-mode objc-wrap` 选项，或将 `foreignExceptionMode = objc-wrap` 属性添加到 `.def` 文件。如果您使用 [CocoaPods 集成](native-cocoapods)，请在依赖项的 `pod {}` 构建脚本块中指定该选项，如下所示：

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

默认行为保持不变：当从 Objective-C 代码抛出异常时，程序终止。

### CocoaPods 插件改进

Kotlin 1.4.20 继续改进 CocoaPods 集成。您可以尝试以下新功能：

- [改进的任务执行](#improved-task-execution)
- [扩展的 DSL](#extended-dsl)
- [更新的与 Xcode 的集成](#updated-integration-with-xcode)

#### 改进的任务执行

CocoaPods 插件获得了改进的任务执行流程。例如，如果您添加了一个新的 CocoaPods 依赖项，则不会重建现有的依赖项。添加额外的目标也不会影响重建现有目标的依赖项。

#### 扩展的 DSL

将 [CocoaPods](native-cocoapods) 依赖项添加到 Kotlin 项目的 DSL 获得了新的功能。

除了本地 Pod 和来自 CocoaPods 存储库的 Pod 之外，您还可以添加对以下类型的库的依赖项：
* 来自自定义 spec 存储库的库。
* 来自 Git 存储库的远程库。
* 来自存档的库（也可以通过任意 HTTP 地址获得）。
* 静态库。
* 具有自定义 cinterop 选项的库。

了解更多关于在 Kotlin 项目中[添加 CocoaPods 依赖项](native-cocoapods-libraries)。在 [Kotlin with CocoaPods 示例](https://github.com/Kotlin/kmm-with-cocoapods-sample) 中查找示例。

#### 更新的与 Xcode 的集成

为了与 Xcode 正确配合使用，Kotlin 需要一些 Podfile 更改：

* 如果您的 Kotlin Pod 具有任何 Git、HTTP 或 specRepo Pod 依赖项，您还应该在 Podfile 中指定它。
* 当您从自定义 spec 添加库时，您还应该在 Podfile 的开头指定 spec 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)。

现在，集成错误在 IDEA 中有详细的描述。因此，如果您的 Podfile 存在问题，您将立即知道如何修复它们。

了解更多关于[创建 Kotlin pods](native-cocoapods-xcode)。

### 支持 Xcode 12 库

我们添加了对 Xcode 12 随附的新库的支持。现在您可以从 Kotlin 代码中使用它们。

## Kotlin Multiplatform

### 更新的多平台库发布结构

从 Kotlin 1.4.20 开始，不再有单独的元数据发布。元数据工件现在包含在*根（root）*发布中，该发布代表整个库，并且在作为依赖项添加到通用源集时会自动解析为适当的平台特定工件。

了解更多关于[发布多平台库](multiplatform-publish-lib)。

#### 与早期版本的兼容性

此结构更改破坏了具有[分层项目结构](multiplatform-share-on-platforms#share-code-on-similar-platforms)的项目的兼容性。如果一个多平台项目和它所依赖的库都具有分层项目结构，那么您需要同时将它们更新到 Kotlin 1.4.20 或更高版本。使用 Kotlin 1.4.20 发布的库不能从使用早期版本发布的项目中使用。

没有分层项目结构的项目和库保持兼容。

## 标准库

Kotlin 1.4.20 的标准库提供了用于处理文件的新扩展，并具有更好的性能。

- [java.nio.file.Path 的扩展](#extensions-for-java-nio-file-path)
- [改进的 String.replace 函数性能](#improved-string-replace-function-performance)

### java.nio.file.Path 的扩展

`java.nio.file.Path` 的扩展是[实验性](components-stability)的。它们可能随时被删除或更改。需要选择启用（opt-in）（参见下面的详细信息）。仅将其用于评估目的。我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issues/KT) 上提供反馈。

现在，标准库为 `java.nio.file.Path` 提供了实验性扩展。以惯用的 Kotlin 方式使用现代 JVM 文件 API 现在类似于使用 `kotlin.io` 包中的 `java.io.File` 扩展。

```kotlin
// 使用除法 (/) 运算符构造路径
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// 列出目录中的文件
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

这些扩展在 `kotlin-stdlib-jdk7` 模块的 `kotlin.io.path` 包中可用。要使用这些扩展，请[选择启用（opt-in）](opt-in-requirements)实验性注解 `@ExperimentalPathApi`。

### 改进的 String.replace 函数性能

`String.replace()` 的新实现加快了函数执行速度。区分大小写的变体使用基于 `indexOf` 的手动替换循环，而不区分大小写的变体使用正则表达式匹配。

## Kotlin Android Extensions

在 1.4.20 中，Kotlin Android Extensions 插件已弃用，并且 `Parcelable` 实现生成器移至单独的插件。

- [不建议使用合成视图](#deprecation-of-synthetic-views)
- [用于 Parcelable 实现生成器的新插件](#new-plugin-for-parcelable-implementation-generator)

### 不建议使用合成视图

_合成视图（Synthetic views）_ 很久以前在 Kotlin Android Extensions 插件中引入，旨在简化与 UI 元素的交互并减少样板代码。现在，Google 提供了一种执行相同操作的本机机制 - Android Jetpack 的 [视图绑定](https://developer.android.com/topic/libraries/view-binding)，并且我们正在弃用合成视图以支持这些视图绑定。

我们从 `kotlin-android-extensions` 中提取 Parcelable 实现生成器，并开始弃用其余部分 - 合成视图的周期。目前，它们将继续使用弃用警告来工作。将来，您需要将您的项目切换到另一个解决方案。以下是[指南](https://goo.gle/kotlin-android-extensions-deprecation)，可帮助您将 Android 项目从合成视图迁移到视图绑定。

### 用于 Parcelable 实现生成器的新插件

`Parcelable` 实现生成器现在可在新的 `kotlin-parcelize` 插件中使用。应用此插件代替 `kotlin-android-extensions`。

`kotlin-parcelize` 和 `kotlin-android-extensions` 不能在同一个模块中一起应用。

:::

`@Parcelize` 注解已移至 `kotlinx.parcelize` 包。

了解更多关于 [Android 文档](https://developer.android.com/kotlin/parcelize) 中的 `Parcelable` 实现生成器。