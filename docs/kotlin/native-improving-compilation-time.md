[//]: # (title: 编译时间优化技巧)

<show-structure depth="1"/>

Kotlin/Native 编译器持续获得更新，以提升其性能。借助最新的 Kotlin/Native 编译器和配置得当的构建环境，您可以显著缩短 Kotlin/Native 目标项目的编译时间。

请继续阅读我们的技巧，了解如何加速 Kotlin/Native 编译过程。

## 一般建议

### 使用最新版 Kotlin

这样，您总能获得最新的性能改进。最新的 Kotlin 版本是 %kotlinVersion%。

### 避免创建大型类

尽量避免创建编译和运行时加载耗时较长的大型类。

### 在构建之间保留下载和缓存的组件

编译项目时，Kotlin/Native 会将所需组件下载并将其部分工作结果缓存到 `$USER_HOME/.konan` 目录。编译器会利用此目录进行后续编译，从而缩短编译完成时间。

在容器（例如 Docker）或持续集成系统中进行构建时，编译器可能需要在每次构建时从头开始创建 `~/.konan` 目录。为避免此步骤，请配置您的环境以在构建之间保留 `~/.konan`。例如，使用 `kotlin.data.dir` Gradle 属性重新定义其位置。

另外，您也可以使用 `-Xkonan-data-dir` 编译器选项，通过 `cinterop` 和 `konanc` 工具配置到该目录的自定义路径。

## Gradle 配置

首次使用 Gradle 编译通常会比后续编译花费更多时间，因为需要下载依赖项、构建缓存并执行其他步骤。您应该至少构建项目两次，以准确读取实际编译时间。

以下是一些配置 Gradle 以获得更好编译性能的建议。

### 增加 Gradle 堆大小

要增加 [Gradle 堆大小](https://docs.gradle.org/current/userguide/performance.html#adjust_the_daemons_heap_size)，请在您的 `gradle.properties` 文件中添加 `org.gradle.jvmargs=-Xmx3g`。

如果您使用 [并行构建](https://docs.gradle.org/current/userguide/performance.html#parallel_execution)，您可能需要使用 `org.gradle.workers.max` 属性或 `--max-workers` 命令行选项来选择合适的 worker 数量。默认值是 CPU 处理器数量。

### 仅构建必要的二进制文件

除非您确实需要，否则不要运行构建整个项目的 Gradle 任务，例如 `build` 或 `assemble`。这些任务会多次构建相同的代码，从而增加编译时间。在典型情况下，例如从 IntelliJ IDEA 运行测试或从 Xcode 启动应用程序，Kotlin 工具会避免执行不必要的任务。

如果您遇到非典型情况或构建配置，您可能需要自己选择任务：

*   `linkDebug*`。在开发过程中运行代码时，您通常只需要一个二进制文件，因此运行相应的 `linkDebug*` 任务就足够了。
*   `embedAndSignAppleFrameworkForXcode`。由于 iOS 模拟器和设备具有不同的处理器架构，因此将 Kotlin/Native 二进制文件分发为通用（fat）框架是一种常见方法。

    然而，在本地开发期间，仅为您正在使用的平台构建 `.framework` 文件会更快。要构建特定于平台的框架，请使用 [embedAndSignAppleFrameworkForXcode](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-direct-integration.html#connect-the-framework-to-your-project) 任务。

### 仅为必要目标构建

与上述建议类似，不要一次性为所有原生平台构建二进制文件。例如，编译 [XCFramework](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#build-xcframeworks)（使用 `*XCFramework` 任务）会为所有目标构建相同的代码，这比为单个目标构建花费的时间按比例更多。

如果您的设置确实需要 XCFramework，可以减少目标数量。例如，如果您不在基于 Intel 的 Mac 上的 iOS 模拟器上运行此项目，则不需要 `iosX64`。

> 不同目标的二进制文件是通过 `linkDebug*$Target` 和 `linkRelease*$Target` Gradle 任务构建的。您可以通过使用 `--scan` 选项运行 Gradle 构建，在构建日志或 [Gradle 构建扫描](https://docs.gradle.org/current/userguide/build_scans.html) 中查找已执行的任务。
>
{style="tip"}

### 不要构建不必要的发布二进制文件

Kotlin/Native 支持两种构建模式：[Debug 和 Release](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#declare-binaries)。Release 模式经过高度优化，这会花费大量时间：编译 Release 二进制文件所需的时间比 Debug 二进制文件多一个数量级。

除了实际发布之外，所有这些优化在典型的开发周期中可能是不必要的。如果您在开发过程中使用名称中包含 `Release` 的任务，请考虑将其替换为 `Debug`。同样，例如，您可以使用 `assembleSharedDebugXCFramework` 代替 `assembleXCFramework`。

> Release 二进制文件是通过 `linkRelease*` Gradle 任务构建的。您可以通过使用 `--scan` 选项运行 Gradle 构建，在构建日志或 [Gradle 构建扫描](https://docs.gradle.com/current/userguide/build_scans.html) 中检查它们。
>
{style="tip"}

### 不要禁用 Gradle 守护进程

如果没有充分的理由，请勿禁用 [Gradle 守护进程](https://docs.gradle.org/current/userguide/gradle_daemon.html)。默认情况下，[Kotlin/Native 从 Gradle 守护进程运行](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)。启用后，会使用相同的 JVM 进程，并且无需为每次编译预热。

### 不要使用传递性导出

使用 [`transitiveExport = true`](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries) 在许多情况下会禁用死代码消除，因此编译器必须处理大量未使用的代码。这会增加编译时间。相反，请明确使用 `export` 方法导出所需的项目和依赖项。

### 不要过度导出模块

尽量避免不必要的[模块导出](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html#export-dependencies-to-binaries)。每个导出的模块都会对编译时间和二进制文件大小产生负面影响。

### 使用 Gradle 构建缓存

启用 Gradle [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html) 功能：

*   **本地构建缓存**。对于本地缓存，请在您的 `gradle.properties` 文件中添加 `org.gradle.caching=true`，或在命令行中使用 `--build-cache` 选项运行构建。
*   **远程构建缓存**。了解如何为持续集成环境[配置远程构建缓存](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_configure_remote)。

### 使用 Gradle 配置缓存

要使用 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html)，请在您的 `gradle.properties` 文件中添加 `org.gradle.configuration-cache=true`。

> 配置缓存还支持并行运行 `link*` 任务，这可能会严重加重机器负载，尤其是在 CPU 核心数量较多的情况下。此问题将在 [KT-70915](https://youtrack.jetbrains.com/issue/KT-70915) 中修复。
>
{style="note"}

### 启用先前禁用的功能

存在禁用 Gradle 守护进程和编译器缓存的 Kotlin/Native 属性：

*   `kotlin.native.disableCompilerDaemon=true`
*   `kotlin.native.cacheKind=none`
*   `kotlin.native.cacheKind.$target=none`，其中 `$target` 是 Kotlin/Native 编译目标，例如 `iosSimulatorArm64`。

如果您之前遇到过这些功能的问题，并在 `gradle.properties` 文件或 Gradle 参数中添加了这些行，请将其删除并检查构建是否成功完成。这些属性可能是在过去为了解决已修复的问题而添加的。

### 尝试对 klib 产物进行增量编译

借助增量编译，如果项目模块生成的 `klib` 产物仅发生部分更改，则 `klib` 的一部分会进一步重新编译为二进制文件。

此功能是[实验性的](components-stability.md#stability-levels-explained)。要启用它，请在您的 `gradle.properties` 文件中添加 `kotlin.incremental.native=true` 选项。如果您遇到任何问题，请在 [YouTrack](https://kotl.in/issue) 中创建问题。

## Windows 配置

Windows 安全中心可能会减慢 Kotlin/Native 编译器的速度。您可以通过将默认位于 `%\USERPROFILE%` 的 `.konan` 目录添加到 Windows 安全排除项来避免这种情况。了解如何[将排除项添加到 Windows 安全中心](https://support.microsoft.com/en-us/windows/add-an-exclusion-to-windows-security-811816c0-4dfd-af4a-47e4-c301afe13b26)。