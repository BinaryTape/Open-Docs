[//]: # (title: 构建工具 API)

<primary-label ref="experimental-general"/>

<tldr>目前，BTA 仅支持 Kotlin/JVM。</tldr>

Kotlin 拥有实验性的构建工具 API (BTA)，它简化了构建系统与 Kotlin 编译器的集成方式。

要在构建系统中添加完整的 Kotlin 支持（例如增量编译、Kotlin 编译器插件、守护进程以及 Kotlin 多平台），需要付出巨大的努力。BTA 旨在通过在构建系统与 Kotlin 编译器生态系统之间提供统一的 API 来降低这种复杂性。

BTA 定义了一个构建系统可以实现的单一入口点。这消除了与编译器内部细节深度集成的需求。

> BTA 本身尚未公开发布，无法在您自己的构建工具集成中直接使用。
> 如果您对该提议感兴趣或想分享反馈，请参阅 [KEEP](https://github.com/Kotlin/KEEP/issues/421)。
> 在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76255) 中关注其实现状态。
> 
{style="warning"}

## 与 Gradle 集成

Kotlin Gradle 插件 (KGP) 对 BTA 具有实验性支持。KGP 默认使用 BTA 进行 Kotlin/JVM 编译。

> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56574) 中反馈您使用 KGP 的体验。
> 
{style="note"}

### 配置不同的编译器版本

借助 BTA，您现在可以使用与 KGP 使用的版本不同的 Kotlin 编译器版本。这在以下情况下非常有用：

* 您想尝试新的 Kotlin 功能，但尚未更新您的构建脚本。
* 您需要最新的插件修复，但目前想保留在旧的编译器版本上。

以下是在 `build.gradle.kts` 文件中配置此项的示例：

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

* 之前的三个主要 Kotlin 编译器版本。
* 向前一个主要版本。

例如，在 KGP 2.2.0 中，支持的 Kotlin 编译器版本为：

* 1.9.25
* 2.0.x
* 2.1.x
* 2.2.x
* 2.3.x

#### 局限性

将不同的编译器版本与编译器插件一起使用可能会导致 Kotlin 编译器异常。Kotlin 团队计划在未来的 Kotlin 版本中解决此问题。

### 启用使用 "in process" 策略的增量编译

KGP 支持三种 [编译器执行策略](compiler-execution-strategy.md)。
通常情况下，"in-process" 策略（在 Gradle 守护进程中运行编译器）不支持增量编译。

借助 BTA，"in-process" 策略现在支持增量编译。要启用它，请在您的 `gradle.properties` 文件中添加以下属性：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

## 与 Maven 集成

BTA 使 [`kotlin-maven-plugin`](maven.md) 能够支持 [Kotlin 守护进程](kotlin-daemon.md)，这是默认的 [编译器执行策略](maven-compile-package.md#choose-execution-strategy)。`kotlin-maven-plugin` 默认使用 BTA，因此无需进行任何配置。

BTA 使得在未来交付更多功能（如 [增量编译稳定性](https://youtrack.jetbrains.com/issue/KT-77086)）成为可能。