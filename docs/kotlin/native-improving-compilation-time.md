---
title: 提升编译时间的技巧
---
<show-structure depth="1"/>

Kotlin/Native 编译器在不断接收更新，以提高其性能。使用最新的 Kotlin/Native 编译器和正确配置的构建环境，您可以显著缩短具有 Kotlin/Native 目标的项目的编译时间。

请继续阅读，了解我们关于如何加速 Kotlin/Native 编译过程的技巧。

## 一般建议

### 使用最新版本的 Kotlin

这样，您始终可以获得最新的性能改进。最新的 Kotlin 版本是 2.1.20。

### 避免创建巨大的类

尽量避免创建编译和加载执行需要很长时间的巨大类。

### 在构建之间保留下载和缓存的组件

在编译项目时，Kotlin/Native 会下载所需的组件，并将一些工作结果缓存到 `$USER_HOME/.konan` 目录中。编译器在后续编译中使用此目录，从而缩短完成时间。

在容器（如 Docker）中或使用持续集成系统构建时，编译器可能必须为每次构建从头开始创建 `~/.konan` 目录。为了避免这一步，请配置您的环境以在构建之间保留 `~/.konan`。例如，使用 `kotlin.data.dir` Gradle 属性重新定义其位置。

或者，您可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置到该目录的自定义路径。

## Gradle 配置

由于需要下载依赖项、构建缓存和执行其他步骤，因此使用 Gradle 的首次编译通常比后续编译花费更多时间。您应该至少构建两次项目才能准确读取实际编译时间。

以下是一些配置 Gradle 以获得更好编译性能的建议。

### 增加 Gradle 堆大小

要增加 [Gradle 堆大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，请将 `org.gradle.jvmargs=-Xmx3g` 添加到您的 `gradle.properties` 文件中。

如果您使用[并行构建](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，您可能需要使用 `org.gradle.workers.max` 属性或 `--max-workers` 命令行选项选择正确的工作进程数。默认值为 CPU 处理器的数量。

### 仅构建必要的二进制文件

除非您确实需要，否则不要运行构建整个项目的 Gradle 任务，例如 `build` 或 `assemble`。这些任务会多次构建相同的代码，从而增加编译时间。在典型情况下，例如从 IntelliJ IDEA 运行测试或从 Xcode 启动应用程序，Kotlin 工具会避免执行不必要的任务。

如果您有非典型情况或构建配置，您可能需要自己选择任务：

* `linkDebug*`。要在开发期间运行您的代码，您通常只需要一个二进制文件，因此运行相应的 `linkDebug*` 任务就足够了。
* `embedAndSignAppleFrameworkForXcode`。由于 iOS 模拟器和设备具有不同的处理器架构，因此通常的做法是将 Kotlin/Native 二进制文件作为通用（胖）框架分发。

  但是，在本地开发期间，仅为正在使用的平台构建 `.framework` 文件会更快。要构建特定于平台的框架，请使用 [embedAndSignAppleFrameworkForXcode](multiplatform-direct-integration#connect-the-framework-to-your-project) 任务。

### 仅为必要的目标构建

与上面的建议类似，不要一次为所有原生平台构建二进制文件。例如，编译一个 [XCFramework](multiplatform-build-native-binaries#build-xcframeworks)（使用 `*XCFramework` 任务）会为所有目标构建相同的代码，这比为单个目标构建花费的时间成比例地更多。

如果您确实需要 XCFrameworks 用于您的设置，您可以减少目标的数量。例如，如果您不在基于 Intel 的 Mac 上的 iOS 模拟器上运行此项目，则不需要 `iosX64`。

:::note
不同目标的二进制文件是使用 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任务构建的。您可以在构建日志或 [Gradle 构建扫描](https://docs.gradle.org/current/userguide/build_scans.html) 中查找已执行的任务，方法是使用 `--scan` 选项运行 Gradle 构建。
:::

### 不要构建不必要的 release 二进制文件

Kotlin/Native 支持两种构建模式，[debug 和 release](multiplatform-build-native-binaries#declare-binaries)。Release 是高度优化的，这需要大量时间：编译 release 二进制文件比 debug 二进制文件花费的时间多一个数量级。

除了实际的 release 之外，所有这些优化在典型的开发周期中可能都是不必要的。如果您在开发过程中使用名称中带有 `Release` 的任务，请考虑将其替换为 `Debug`。同样，例如，您可以运行 `assembleSharedDebugXCFramework` 而不是运行 `assembleXCFramework`。

Release 二进制文件是使用 `linkRelease*` Gradle 任务构建的。您可以在构建日志或 [Gradle 构建扫描](https://docs.gradle.org/current/userguide/build_scans.html) 中查找它们，方法是使用 `--scan` 选项运行 Gradle 构建。

### 不要禁用 Gradle daemon

不要在没有充分理由的情况下禁用 [Gradle daemon](https://docs.gradle.org/current/userguide/gradle_daemon.html)。默认情况下，[Kotlin/Native 从 Gradle daemon 运行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。启用后，将使用相同的 JVM 进程，并且无需为每次编译预热它。

### 不要使用传递导出

在许多情况下，使用 [`transitiveExport = true`](multiplatform-build-native-binaries#export-dependencies-to-binaries) 会禁用死代码消除，因此编译器必须处理大量未使用的代码。这会增加编译时间。相反，请显式使用 `export` 方法导出所需的项目和依赖项。

### 不要过度导出模块

尽量避免不必要的[模块导出](multiplatform-build-native-binaries#export-dependencies-to-binaries)。每个导出的模块都会对编译时间和二进制文件大小产生负面影响。

### 使用 Gradle 构建缓存

启用 Gradle [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 功能：

* **本地构建缓存 (Local build cache)**。对于本地缓存，请将 `org.gradle.caching=true` 添加到您的 `gradle.properties` 文件中，或者在命令行中使用 `--build-cache` 选项运行构建。
* **远程构建缓存 (Remote build cache)**。了解如何为持续集成环境[配置远程构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)。

### 使用 Gradle 配置缓存

要使用 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，请将 `org.gradle.configuration-cache=true` 添加到您的 `gradle.properties` 文件中。

配置缓存还支持并行运行 `link*` 任务，这可能会大量加载机器，尤其是在具有大量 CPU 核心的情况下。此问题将在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修复。

:::

### 启用以前禁用的功能

有一些 Kotlin/Native 属性会禁用 Gradle daemon 和编译器缓存：

* `kotlin.native.disableCompilerDaemon=true`
* `kotlin.native.cacheKind=none`
* `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 编译目标，例如 `iosSimulatorArm64`。

如果您之前遇到过这些功能的问题，并将这些行添加到您的 `gradle.properties` 文件或 Gradle 参数中，请删除它们并检查构建是否成功完成。可能是以前添加这些属性是为了解决已修复的问题。

### 尝试 klib 制品的增量编译

使用增量编译，如果仅更改项目模块生成的 `klib` 制品的一部分，则仅将 `klib` 的一部分进一步重新编译为二进制文件。

此功能是 [Experimental](components-stability#stability-levels-explained)。要启用它，请将 `kotlin.incremental.native=true` 选项添加到您的 `gradle.properties` 文件中。如果您遇到任何问题，请在 [YouTrack 中创建一个 issue](https://kotl.in/issue)。

## Windows 配置

Windows 安全中心可能会降低 Kotlin/Native 编译器的速度。您可以通过将 `.konan` 目录（默认位于 `%\USERPROFILE%` 中）添加到 Windows 安全中心的排除项来避免这种情况。了解如何[将排除项添加到 Windows 安全中心](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。