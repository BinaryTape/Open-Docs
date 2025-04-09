---
title: "Kotlin Multiplatform 项目结构基础"
---
使用 Kotlin Multiplatform，你可以在不同的平台之间共享代码。本文解释了共享代码的约束、如何区分代码中的共享部分和平台特定部分，以及如何指定此共享代码适用的平台。

你还将学习 Kotlin Multiplatform 项目设置的核心概念，例如通用代码（common code）、目标平台（targets）、平台特定（platform-specific）和中间（intermediate）的源集（source sets）以及测试集成。这将帮助你在未来设置你的多平台项目。

这里介绍的模型与 Kotlin 使用的模型相比有所简化。但是，对于大多数情况，此基本模型应该足够了。

## 通用代码（Common code）

_通用代码（Common code）_ 是在不同平台之间共享的 Kotlin 代码。

考虑一下简单的“Hello, World”示例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

平台之间共享的 Kotlin 代码通常位于 `commonMain` 目录中。代码文件的位置很重要，因为它会影响编译此代码的平台列表。

Kotlin 编译器将源代码作为输入，并生成一组平台特定的二进制文件作为结果。编译多平台项目时，它可以从同一段代码生成多个二进制文件。例如，编译器可以从同一个 Kotlin 文件生成 JVM `.class` 文件和原生可执行文件：

<img src="/img/common-code-diagram.svg" alt="通用代码（Common code）" width="700" style={{verticalAlign: 'middle'}}/>

并非每个 Kotlin 代码都可以编译到所有平台。Kotlin 编译器会阻止你在通用代码（common code）中使用平台特定的函数或类，因为此代码无法编译到其他平台。

例如，你不能在通用代码（common code）中使用 `java.io.File` 依赖项。它是 JDK 的一部分，而通用代码（common code）也会编译为原生代码，而 JDK 类在原生代码中不可用：

<img src="/img/unresolved-java-reference.png" alt="未解析的 Java 引用" width="500" style={{verticalAlign: 'middle'}}/>

在通用代码（common code）中，你可以使用 Kotlin Multiplatform 库。这些库提供了一个通用的 API，可以在不同的平台上以不同的方式实现。在这种情况下，平台特定的 API 作为额外的部分，尝试在通用代码（common code）中使用这样的 API 会导致错误。

例如，`kotlinx.coroutines` 是一个支持所有目标平台（targets）的 Kotlin Multiplatform 库，但它也有一个平台特定的部分，可以将 `kotlinx.coroutines` 并发原语转换为 JDK 并发原语，例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。API 的这个额外部分在 `commonMain` 中不可用。

## 目标平台（Targets）

目标平台（Targets）定义了 Kotlin 将通用代码（common code）编译到的平台。这些平台可以是 JVM、JS、Android、iOS 或 Linux。前面的示例将通用代码（common code）编译为 JVM 和原生目标平台（targets）。

_Kotlin 目标平台（target）_ 是一个描述编译目标平台的标识符。它定义了生成的二进制文件的格式、可用的语言结构和允许的依赖项。

:::tip
目标平台（Targets）也可以称为平台。参见完整的[支持目标平台（targets）列表](multiplatform-dsl-reference#targets)。

你应该首先_声明_一个目标平台（target），以指示 Kotlin 为该特定目标平台（target）编译代码。在 Gradle 中，你可以使用 `kotlin {}` 代码块内的预定义 DSL 调用来声明目标平台（targets）：

```kotlin
kotlin {
    jvm() // 声明一个 JVM 目标平台（target）
    iosArm64() // 声明一个对应于 64 位 iPhone 的目标平台（target）
}
```

这样，每个多平台项目都定义了一组支持的目标平台（targets）。请参阅[分层项目结构](multiplatform-hierarchy)部分，以了解有关在构建脚本中声明目标平台（targets）的更多信息。

声明了 `jvm` 和 `iosArm64` 目标平台（targets）后，`commonMain` 中的通用代码（common code）将被编译为这些目标平台（targets）：

<img src="/img/target-diagram.svg" alt="目标平台（Targets）" width="700" style={{verticalAlign: 'middle'}}/>

为了理解哪些代码将被编译为特定的目标平台（target），你可以将目标平台（target）视为附加到 Kotlin 源文件的标签。Kotlin 使用这些标签来确定如何编译你的代码、生成哪些二进制文件，以及该代码中允许哪些语言结构和依赖项。

如果你还想将 `greeting.kt` 文件编译为 `.js`，你只需要声明 JS 目标平台（target）。然后，`commonMain` 中的代码会收到一个额外的 `js` 标签，对应于 JS 目标平台（target），这指示 Kotlin 生成 `.js` 文件：

<img src="/img/target-labels-diagram.svg" alt="目标平台（Target）标签" width="700" style={{verticalAlign: 'middle'}}/>

这就是 Kotlin 编译器如何处理编译到所有已声明目标平台（targets）的通用代码（common code）的方式。请参阅[源集（Source sets）](#source-sets)以了解如何编写平台特定的代码。

## 源集（Source sets）

_Kotlin 源集（source set）_ 是一组具有自己的目标平台（targets）、依赖项和编译器选项的源文件。它是多平台项目中共享代码的主要方式。

多平台项目中的每个源集（source set）：

* 都有一个给定项目唯一的名称。
* 包含一组源文件和资源，通常存储在具有源集（source set）名称的目录中。
* 指定一组目标平台（targets），此源集（source set）中的代码将编译到这些目标平台（targets）。这些目标平台（targets）会影响此源集（source set）中可用的语言结构和依赖项。
* 定义其自己的依赖项和编译器选项。

Kotlin 提供了许多预定义的源集（source sets）。其中之一是 `commonMain`，它存在于所有多平台项目中，并编译到所有已声明的目标平台（targets）。

你可以在 Kotlin Multiplatform 项目中以 `src` 目录内的目录的形式与源集（source sets）进行交互。例如，具有 `commonMain`、`iosMain` 和 `jvmMain` 源集（source sets）的项目具有以下结构：

<img src="/img/src-directory-diagram.png" alt="共享源" width="350" style={{verticalAlign: 'middle'}}/>

在 Gradle 脚本中，你可以通过 `kotlin.sourceSets {}` 代码块内的名称访问源集（source sets）：

```kotlin
kotlin {
    // 目标平台（Targets）声明：
    // …

    // 源集（Source set）声明：
    sourceSets {
        commonMain {
            // 配置 commonMain 源集（source set）
        }
    }
}
```

除了 `commonMain` 之外，其他源集（source sets）可以是平台特定的或中间的。

### 平台特定源集（Platform-specific source sets）

虽然只拥有通用代码（common code）很方便，但并非总是可行。`commonMain` 中的代码会编译到所有已声明的目标平台（targets），并且 Kotlin 不允许你在那里使用任何平台特定的 API。

在具有原生和 JS 目标平台（targets）的多平台项目中，`commonMain` 中的以下代码无法编译：

```kotlin
// commonMain/kotlin/common.kt
// 无法在通用代码（common code）中编译
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作为解决方案，Kotlin 创建了平台特定源集（platform-specific source sets），也称为平台源集（platform source sets）。每个目标平台（target）都有一个相应的平台源集（platform source set），该平台源集（platform source set）仅针对该目标平台（target）进行编译。例如，`jvm` 目标平台（target）具有相应的 `jvmMain` 源集（source set），该源集（source set）仅编译到 JVM。Kotlin 允许在这些源集（source sets）中使用平台特定的依赖项，例如 `jvmMain` 中的 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 你可以在 `jvmMain` 源集（source set）中使用 Java 依赖项
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 编译到特定目标平台（target）

编译到特定目标平台（target）需要多个源集（source sets）协同工作。当 Kotlin 将多平台项目编译为特定目标平台（target）时，它会收集所有标有此目标平台（target）的源集（source sets），并从中生成二进制文件。

考虑一个包含 `jvm`、`iosArm64` 和 `js` 目标平台（targets）的示例。Kotlin 创建 `commonMain` 源集（source set）用于通用代码（common code），并创建相应的 `jvmMain`、`iosArm64Main` 和 `jsMain` 源集（source sets）用于特定目标平台（targets）：

<img src="/img/specific-target-diagram.svg" alt="编译到特定目标平台（target）" width="700" style={{verticalAlign: 'middle'}}/>

在编译到 JVM 期间，Kotlin 选择所有标有“JVM”的源集（source sets），即 `jvmMain` 和 `commonMain`。然后，它将它们一起编译为 JVM 类文件：

<img src="/img/compilation-jvm-diagram.svg" alt="编译到 JVM" width="700" style={{verticalAlign: 'middle'}}/>

因为 Kotlin 将 `commonMain` 和 `jvmMain` 一起编译，所以生成的二进制文件包含来自 `commonMain` 和 `jvmMain` 的声明。

使用多平台项目时，请记住：

* 如果你希望 Kotlin 将你的代码编译到特定平台，请声明相应的目标平台（target）。
* 要选择存储代码的目录或源文件，请首先确定你希望在哪些目标平台（targets）之间共享你的代码：
    * 如果代码在所有目标平台（targets）之间共享，则应在 `commonMain` 中声明。
    * 如果代码仅用于一个目标平台（target），则应在该目标平台（target）的平台特定源集（platform-specific source set）中定义（例如，JVM 的 `jvmMain`）。
* 在平台特定源集（platform-specific source sets）中编写的代码可以访问来自通用源集（common source set）的声明。例如，`jvmMain` 中的代码可以使用来自 `commonMain` 的代码。但是，反之则不然：`commonMain` 无法使用来自 `jvmMain` 的代码。
* 在平台特定源集（platform-specific source sets）中编写的代码可以使用相应的平台依赖项。例如，`jvmMain` 中的代码可以使用仅 Java 的库，如 [Guava](https://github.com/google/guava) 或 [Spring](https://spring.io/)。

### 中间源集（Intermediate source sets）

简单的多平台项目通常只有通用代码（common code）和平台特定的代码。`commonMain` 源集（source set）表示在所有已声明的目标平台（targets）之间共享的通用代码（common code）。平台特定源集（platform-specific source sets），如 `jvmMain`，表示仅编译到相应目标平台（target）的平台特定的代码。

在实践中，你通常需要更细粒度的代码共享。

考虑一个你需要面向所有现代 Apple 设备和 Android 设备的示例：

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64 位 iPhone 设备
    macosArm64() // 基于 Apple Silicon 的现代 Mac
    watchosX64() // 现代 64 位 Apple Watch 设备
    tvosArm64()  // 现代 Apple TV 设备
}
```

并且你需要一个源集（source set）来添加一个为所有 Apple 设备生成 UUID 的函数：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 你想访问 Apple 特定的 API
    return NSUUID().UUIDString()
}
```

你不能将此函数添加到 `commonMain`。`commonMain` 会编译到所有已声明的目标平台（targets），包括 Android，但 `platform.Foundation.NSUUID` 是 Apple 特定的 API，在 Android 上不可用。如果你尝试在 `commonMain` 中引用 `NSUUID`，Kotlin 会显示一个错误。

你可以将此代码复制并粘贴到每个 Apple 特定的源集（source set）：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main`。但不建议使用这种方法，因为像这样复制代码很容易出错。

为了解决这个问题，你可以使用_中间源集（intermediate source sets）_。中间源集（intermediate source set）是一个 Kotlin 源集（source set），它编译到项目中的某些目标平台（targets），但不是全部。你也可以将中间源集（intermediate source sets）称为分层源集（hierarchical source sets）或简称为层次结构（hierarchies）。

Kotlin 默认会创建一些中间源集（intermediate source sets）。在这个特定示例中，生成的项目结构将如下所示：

<img src="/img/intermediate-source-sets-diagram.svg" alt="中间源集（Intermediate source sets）" width="700" style={{verticalAlign: 'middle'}}/>

在这里，底部的彩色块是平台特定源集（platform-specific source sets）。为清楚起见，省略了目标平台（target）标签。

`appleMain` 块是由 Kotlin 创建的中间源集（intermediate source set），用于共享编译到 Apple 特定目标平台（targets）的代码。`appleMain` 源集（source set）仅编译到 Apple 目标平台（targets）。因此，Kotlin 允许在 `appleMain` 中使用 Apple 特定的 API，你可以在此处添加 `randomUUID()` 函数。

参见[分层项目结构](multiplatform-hierarchy)以查找 Kotlin 默认创建和设置的所有中间源集（intermediate source sets），并了解如果 Kotlin 默认不提供你需要的中间源集（intermediate source set），你应该怎么做。

:::

在编译到特定目标平台（target）期间，Kotlin 会获取所有源集（source sets），包括标有此目标平台（target）的中间源集（intermediate source sets）。因此，在编译到 `iosArm64` 平台目标平台（target）期间，`commonMain`、`appleMain` 和 `iosArm64Main` 源集（source sets）中编写的所有代码都会被组合在一起：

<img src="/img/native-executables-diagram.svg" alt="原生可执行文件" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
如果某些源集（source sets）没有源文件，这没关系。例如，在 iOS 开发中，通常不需要提供特定于 iOS 设备但不特定于 iOS 模拟器的代码。因此，`iosArm64Main` 很少使用。

:::

#### Apple 设备和模拟器目标平台（targets）

当你使用 Kotlin Multiplatform 开发 iOS 移动应用程序时，你通常使用 `iosMain` 源集（source set）。虽然你可能认为它是 `ios` 目标平台（target）的平台特定源集（platform-specific source set），但没有单个 `ios` 目标平台（target）。大多数移动项目至少需要两个目标平台（targets）：

* **设备目标平台（Device target）** 用于生成可以在 iOS 设备上执行的二进制文件。目前，iOS 只有一个设备目标平台（device target）：`iosArm64`。
* **模拟器目标平台（Simulator target）** 用于为在你机器上启动的 iOS 模拟器生成二进制文件。如果你有 Apple silicon Mac 计算机，请选择 `iosSimulatorArm64` 作为模拟器目标平台（simulator target）。如果你有基于 Intel 的 Mac 计算机，请使用 `iosX64`。

如果你只声明 `iosArm64` 设备目标平台（device target），你将无法在本地机器上运行和调试你的应用程序和测试。

平台特定源集（platform-specific source sets），如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main` 通常是空的，因为 iOS 设备和模拟器的 Kotlin 代码通常是相同的。你可以只使用 `iosMain` 中间源集（intermediate source set）在它们之间共享代码。

同样适用于其他非 Mac Apple 目标平台（targets）。例如，如果你有用于 Apple TV 的 `tvosArm64` 设备目标平台（device target），以及分别用于 Apple silicon 和基于 Intel 的设备上的 Apple TV 模拟器的 `tvosSimulatorArm64` 和 `tvosX64` 模拟器目标平台（simulator targets），你可以将 `tvosMain` 中间源集（intermediate source set）用于所有这些目标平台（targets）。

## 与测试集成

实际的项目还需要与主要生产代码一起进行测试。这就是为什么默认创建的所有源集（source sets）都具有 `Main` 和 `Test` 后缀。`Main` 包含生产代码，而 `Test` 包含此代码的测试。它们之间的连接是自动建立的，并且测试可以使用 `Main` 代码提供的 API，而无需额外的配置。

`Test` 对应项也是类似于 `Main` 的源集（source sets）。例如，`commonTest` 是 `commonMain` 的对应项，并编译到所有已声明的目标平台（targets），允许你编写通用测试。平台特定测试源集（platform-specific test source sets），例如 `jvmTest`，用于编写平台特定测试，例如，JVM 特定的测试或需要 JVM API 的测试。

除了拥有一个编写通用测试的源集（source set）之外，你还需要一个多平台测试框架。Kotlin 提供了一个默认的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库，该库带有 `@kotlin.Test` 注释和各种断言方法，如 `assertEquals` 和 `assertTrue`。

你可以像为每个平台编写常规测试一样，在其各自的源集（source sets）中编写平台特定测试。与主代码一样，你可以为每个源集（source set）设置平台特定的依赖项，例如，JVM 的 `JUnit` 和 iOS 的 `XCTest`。要为特定目标平台（target）运行测试，请使用 `<targetName>Test` 任务。

在[测试你的多平台应用程序教程](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-run-tests.html)中了解如何创建和运行多平台测试。

## 接下来做什么？

* [详细了解如何在 Gradle 脚本中声明和使用预定义的源集（source sets）](multiplatform-hierarchy)
* [探索多平台项目结构的高级概念](multiplatform-advanced-project-structure)
* [详细了解目标平台（target）编译和创建自定义编译](multiplatform-configure-compilations)