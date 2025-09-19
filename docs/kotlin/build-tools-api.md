[//]: # (title: 构建工具 API)

<primary-label ref="experimental-general"/>

<tldr>目前，BTA 仅支持 Kotlin/JVM。</tldr>

Kotlin 2.2.0 引入了实验性的构建工具 API (BTA)，它简化了构建系统与 Kotlin 编译器集成的方式。

此前，要为构建系统添加完整的 Kotlin 支持（例如增量编译、Kotlin 编译器插件、守护进程以及 Kotlin Multiplatform）需要付出大量工作。BTA 旨在通过在构建系统与 Kotlin 编译器生态系统之间提供统一的 API 来降低这种复杂性。

BTA 定义了一个单一入口点，构建系统可以实现该入口点。这消除了深度集成内部编译器细节的必要性。

> BTA 本身尚未公开可用，无法直接用于您自己的构建工具集成。
> 如果您对该提案感兴趣或想分享反馈，请参阅 [KEEP](https://github.com/Kotlin/KEEP/issues/421)。
> 关注其实现状态请访问 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255)。
> 
{style="warning"}

## 与 Gradle 集成

Kotlin Gradle 插件 (KGP) 对 BTA 具有实验性支持，您需要选择启用才能使用它。

> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574) 上分享 KGP 的使用体验反馈。
> 
{style="note"}

### 如何启用

将以下属性添加到您的 `gradle.properties` 文件中：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```

### 配置不同的编译器版本

使用 BTA，您现在可以使用与 KGP 使用版本不同的 Kotlin 编译器版本。这在以下情况很有用：

*   您想尝试新的 Kotlin 特性，但尚未更新构建脚本。
*   您需要最新的插件修复，但暂时想停留在旧的编译器版本。

以下是如何在您的 `build.gradle.kts` 文件中配置的示例：

```kotlin
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
    compilerVersion.set("2.1.21") // <-- 与 2.2.0 不同的版本
}
```

#### 兼容的 Kotlin 编译器与 KGP 版本

BTA 支持：

*   前三个主要 Kotlin 编译器版本。
*   一个主要版本向前。

例如，在 KGP 2.2.0 中，支持的 Kotlin 编译器版本是：

*   1.9.25
*   2.0.x
*   2.1.x
*   2.2.x
*   2.3.x

#### 限制

将不同的编译器版本与编译器插件一起使用，可能导致 Kotlin 编译器异常。Kotlin 团队计划在未来的 Kotlin 发布中解决此问题。

### 启用“进程内”策略的增量编译

KGP 支持三种[编译器执行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。通常，“进程内”策略（在 Gradle 守护进程中运行编译器）不支持增量编译。

通过 BTA，“进程内”策略现在支持增量编译。要启用它，请将以下属性添加到您的 `gradle.properties` 文件中：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## 与 Maven 集成

BTA 使得 [`kotlin-maven-plugin`](maven.md) 能够支持 [Kotlin 守护进程](kotlin-daemon.md)，这是默认的 [编译器执行策略](maven.md#configure-kotlin-compiler-execution-strategy)。`kotlin-maven-plugin` 默认使用 BTA，因此无需进行任何配置。

BTA 将使得将来能够提供更多特性，例如[增量编译稳定性](https://youtrack.jetbrains.com/issue/KT-77086)。