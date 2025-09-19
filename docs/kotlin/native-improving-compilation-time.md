`[//]: # (title: 提高编译时间的建议)`

<show-structure depth="1"/>

Kotlin/Native 编译器持续接收更新，以提升其性能。借助于最新的 Kotlin/Native 编译器和正确配置的构建环境，你可以显著提升采用 Kotlin/Native 目标平台的项目的编译时间。

请继续阅读我们提供的建议，了解如何加速 Kotlin/Native 编译过程。

## 一般建议

### 使用最新版本的 Kotlin

这样你总能获得最新的性能改进。最新的 Kotlin 版本是 %kotlinVersion%。

### 避免创建大型类

尽量避免创建编译和执行加载耗时较长的巨型类。

### 在构建之间保留已下载和缓存的组件

编译项目时，Kotlin/Native 会下载所需组件并缓存部分工作成果到 `$USER_HOME/.konan` 目录。编译器会利用此目录进行后续编译，从而缩短编译完成时间。

在容器（例如 Docker）中或使用持续集成系统进行构建时，编译器可能需要在每次构建时从头创建 `~/.konan` 目录。为避免此步骤，请配置你的环境，以在构建之间保留 `~/.konan`。例如，可以使用 `kotlin.data.dir` Gradle 属性重新定义其位置。

另外，你也可以通过 `cinterop` 和 `konanc` 工具，使用 `-Xkonan-data-dir` 编译器选项配置目录的自定义路径。

## Gradle 配置

由于需要下载依赖项、构建缓存以及执行额外步骤，Gradle 的首次编译通常比后续编译耗时更长。你应该至少构建两次项目，才能准确读取实际编译时间。

以下是关于配置 Gradle 以获得更好编译性能的一些建议。

### 增加 Gradle 堆大小

要增加 [Gradle 堆大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，请将 `org.gradle.jvmargs=-Xmx3g` 添加到你的 `gradle.properties` 文件中。

如果你使用[并行构建](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，你可能需要使用 `org.gradle.workers.max` 属性或 `--max-workers` 命令行选项选择合适的工作进程数量。默认值是 CPU 处理器数量。

### 仅构建必要的二进制文件

除非你确实需要，否则不要运行构建整个项目的 Gradle 任务，例如 `build` 或 `assemble`。这些任务会多次构建相同的代码，从而增加编译时间。在典型情况下，例如从 IntelliJ IDEA 运行测试或从 Xcode 启动应用，Kotlin 工具链会避免执行不必要的任务。

如果你有非典型情况或构建配置，可能需要自行选择任务：

*   `linkDebug*`。为了在开发过程中运行代码，你通常只需要一个二进制文件，因此运行相应的 `linkDebug*` 任务就足够了。
*   `embedAndSignAppleFrameworkForXcode`。由于 iOS 模拟器和设备具有不同的处理器架构，将 Kotlin/Native 二进制文件作为通用 (fat) framework 分发是一种常见方法。

    然而，在本地开发期间，仅为你正在使用的平台构建 `.framework` 文件会更快。要构建平台特有的 framework，请使用 [embedAndSignAppleFrameworkForXcode](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 任务。

### 仅为必要的目标平台构建

与上述建议类似，不要一次性为所有原生平台构建二进制文件。例如，编译 [XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)（使用 `*XCFramework` 任务）会为所有目标平台构建相同的代码，这比为单个目标平台构建耗时按比例更长。

如果你的设置确实需要 XCFrameworks，可以减少目标平台数量。例如，如果你不在基于 Intel 的 Mac 上运行此项目，则不需要 `iosX64`。

> 二进制文件是使用 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任务为不同目标平台构建的。
> 你可以在构建日志中或通过使用 `--scan` 选项运行 Gradle 构建来在 [Gradle 构建扫描](https://docs.gradle.org/current/userguide/build_scans.html) 中查找已执行的任务。
>
{style="tip"}

### 不要构建不必要的发布二进制文件

Kotlin/Native 支持两种构建模式：[调试和发布](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)。发布模式经过高度优化，这会耗费大量时间：发布二进制文件的编译时间比调试二进制文件长一个数量级。

除了实际发布之外，所有这些优化在典型开发周期中可能是不必要的。如果在开发过程中使用了名称中包含 `Release` 的任务，请考虑将其替换为 `Debug`。类似地，你可以运行 `assembleSharedDebugXCFramework`，而不是运行 `assembleXCFramework`。

> 发布二进制文件是使用 `linkRelease*` Gradle 任务构建的。你可以在构建日志中或通过使用 `--scan` 选项运行 Gradle 构建来在 [Gradle 构建扫描](https://docs.gradle.org/current/userguide/build_scans.html) 中检查它们。
>
{style="tip"}

### 不要禁用 Gradle 守护进程

除非有充分理由，否则不要禁用 [Gradle 守护进程](https://docs.gradle.org/current/userguide/gradle_daemon.html)。默认情况下，[Kotlin/Native 会从 Gradle 守护进程运行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。启用后，会使用相同的 JVM 进程，每次编译时无需对其进行预热。

### 不要使用传递性导出

使用 [`transitiveExport = true`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries) 在许多情况下会禁用无用代码消除，因此编译器必须处理大量未使用的代码。这会增加编译时间。相反，请明确使用 `export` 方法导出所需的项目和依赖项。

### 不要过度导出模块

尽量避免不必要的[模块导出](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)。每个导出的模块都会对编译时间与二进制文件大小产生负面影响。

### 使用 Gradle 构建缓存

启用 Gradle [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 特性：

*   **本地构建缓存**。对于本地缓存，请将 `org.gradle.caching=true` 添加到你的 `gradle.properties` 文件中，或在命令行中使用 `--build-cache` 选项运行构建。
*   **远程构建缓存**。了解如何为持续集成环境[配置远程构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)。

### 使用 Gradle 配置缓存

要使用 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，请将 `org.gradle.configuration-cache=true` 添加到你的 `gradle.properties` 文件中。

> 配置缓存还允许并行运行 `link*` 任务，这可能会严重加载机器，尤其是在 CPU 核心数量很多的情况下。此问题将在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修复。
>
{style="note"}

### 启用以前禁用的特性

有一些 Kotlin/Native 属性会禁用 Gradle 守护进程和编译器缓存：

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 编译目标，例如 `iosSimulatorArm64`。

如果你之前遇到这些特性导致的问题，并将这些行添加到你的 `gradle.properties` 文件或 Gradle 实参中，请删除它们并检查构建是否成功完成。这些属性可能是在解决已修复的问题时添加的。

### 尝试 klib 构件的增量编译

通过增量编译，如果项目模块生成的 `klib` 构件只有一部分发生变化，那么只有 `klib` 的一部分会被进一步重新编译成二进制文件。

此特性为[实验性的](components-stability.md#stability-levels-explained)。要启用它，请将 `kotlin.incremental.native=true` 选项添加到你的 `gradle.properties` 文件中。如果遇到任何问题，请在 [YouTrack 中创建问题](https://kotl.in/issue)。

## Windows 配置

Windows 安全中心可能会减慢 Kotlin/Native 编译器。你可以通过将默认位于 `%\USERPROFILE%` 的 `.konan` 目录添加到 Windows 安全中心排除项来避免这种情况。了解如何[将排除项添加到 Windows 安全中心](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。

## LLVM 配置
<primary-label ref="advanced"/>

如果上述建议未能帮助你提升编译时间，请考虑[自定义 LLVM 后端](native-llvm-passes.md)。