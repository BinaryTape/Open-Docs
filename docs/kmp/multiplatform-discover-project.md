[//]: # (title: Kotlin Multiplatform 项目结构基础)

使用 Kotlin Multiplatform，您可以在不同平台之间共享代码。本文将解释共享代码的约束、如何区分代码中的共享部分和平台特有部分，以及如何指定此共享代码所适用的平台。

您还将学习 Kotlin Multiplatform 项目设置的核心概念，例如共同代码、目标、平台特有和中间源代码集，以及测试集成。这将有助于您将来设置您的多平台项目。

此处介绍的模型相较于 Kotlin 所使用的模型有所简化。然而，这个基本模型应该足以应对大多数情况。

## 共同代码

_共同代码_ 是在不同平台之间共享的 Kotlin 代码。

考虑一个简单的“Hello, World”示例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

在平台之间共享的 Kotlin 代码通常位于 `commonMain` 目录中。代码文件的位置很重要，因为它会影响此代码将被编译到的平台列表。

Kotlin 编译器接收源代码作为输入，并生成一组平台特有的二进制文件。在编译多平台项目时，它可以从相同的代码生成多个二进制文件。例如，编译器可以从同一个 Kotlin 文件生成 JVM `.class` 文件和原生可执行文件：

![Common code](common-code-diagram.svg){width=700}

并非所有 Kotlin 代码都可以编译到所有平台。Kotlin 编译器会阻止您在共同代码中使用平台特有函数或类，因为此代码无法编译到不同的平台。

例如，您不能在共同代码中使用 `java.io.File` 依赖项。它是 JDK 的一部分，而共同代码也会被编译为原生代码，在该环境中，JDK 类不可用：

![Unresolved Java reference](unresolved-java-reference.png){width=500}

在共同代码中，您可以使用 Kotlin Multiplatform 库。这些库提供了一个共同的 API，可以在不同平台以不同方式实现。在这种情况下，平台特有的 API 充当额外部分，尝试在共同代码中使用此类 API 会导致错误。

例如，`kotlinx.coroutines` 是一个支持所有目标的 Kotlin Multiplatform 库，但它也有一个平台特有的部分，可将 `kotlinx.coroutines` 并发原语转换为 JDK 并发原语，例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。API 的此附加部分在 `commonMain` 中不可用。

## 目标

目标定义了 Kotlin 将共同代码编译到的平台。例如，这些可以是 JVM、JS、Android、iOS 或 Linux。前面的示例将共同代码编译到了 JVM 和原生目标。

_Kotlin 目标_ 是一个描述编译目标的标识符。它定义了生成二进制文件的格式、可用的语言构造和允许的依赖项。

> 目标也可以被称为平台。有关完整[支持的目标列表](multiplatform-dsl-reference.md#targets)，请参见。
>
> {style="note"}

您应该首先_声明_一个目标，以指示 Kotlin 为该特定目标编译代码。在 Gradle 中，您可以在 `kotlin {}` 代码块中使用预定义的 DSL 调用来声明目标：

```kotlin
kotlin {
    jvm() // 声明一个 JVM 目标
    iosArm64() // 声明一个对应于 64 位 iPhone 的目标
}
```

这样，每个多平台项目都定义了一组支持的目标。关于在构建脚本中声明目标的更多信息，请参见[分层项目结构](multiplatform-hierarchy.md)部分。

声明了 `jvm` 和 `iosArm64` 目标后，`commonMain` 中的共同代码将被编译到这些目标：

![Targets](target-diagram.svg){width=700}

为了理解哪些代码将被编译到特定目标，您可以将目标视为附加到 Kotlin 源代码文件上的标签。Kotlin 使用这些标签来确定如何编译您的代码、生成哪些二进制文件以及该代码中允许使用哪些语言构造和依赖项。

如果您也想将 `greeting.kt` 文件编译到 `.js`，您只需声明 JS 目标。然后，`commonMain` 中的代码会收到一个额外的 `js` 标签，对应于 JS 目标，指示 Kotlin 生成 `.js` 文件：

![Target labels](target-labels-diagram.svg){width=700}

这就是 Kotlin 编译器处理编译到所有已声明目标的共同代码的方式。关于如何编写平台特有代码，请参见[源代码集](#source-sets)。

## 源代码集

_Kotlin 源代码集_ 是一组源代码文件，拥有自己的目标、依赖项和编译器选项。它是多平台项目中共享代码的主要方式。

多平台项目中的每个源代码集：

*   具有在给定项目中唯一的名称。
*   包含一组源代码文件和资源，通常存储在以源代码集名称命名的目录中。
*   指定此源代码集中的代码将编译到的一组目标。这些目标会影响此源代码集中可用的语言构造和依赖项。
*   定义自己的依赖项和编译器选项。

Kotlin 提供了一系列预定义的源代码集。其中之一是 `commonMain`，它存在于所有多平台项目中，并编译到所有已声明的目标。

在 Kotlin Multiplatform 项目中，您将源代码集作为 `src` 内部的目录进行交互。例如，一个包含 `commonMain`、`iosMain` 和 `jvmMain` 源代码集的项目具有以下结构：

![Shared sources](src-directory-diagram.png){width=350}

在 Gradle 脚本中，您可以通过名称在 `kotlin.sourceSets {}` 代码块中访问源代码集：

```kotlin
kotlin {
    // 目标声明：
    // …

    // 源代码集声明：
    sourceSets {
        commonMain {
            // 配置 commonMain 源代码集
        }
    }
}
```

除了 `commonMain` 之外，其他源代码集可以是平台特有或中间的。

### 平台特有源代码集

尽管只有共同代码很方便，但并非总是可行。`commonMain` 中的代码会编译到所有已声明的目标，并且 Kotlin 不允许您在那里使用任何平台特有的 API。

在一个包含原生和 JS 目标的多平台项目中，`commonMain` 中的以下代码无法编译：

```kotlin
// commonMain/kotlin/common.kt
// 无法在共同代码中编译
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作为解决方案，Kotlin 会创建平台特有源代码集，也称为平台源代码集。每个目标都有一个对应的平台源代码集，仅为该目标进行编译。例如，`jvm` 目标具有对应的 `jvmMain` 源代码集，仅编译到 JVM。Kotlin 允许在这些源代码集使用平台特有依赖项，例如在 `jvmMain` 中使用 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 您可以在 `jvmMain` 源代码集中使用 Java 依赖项
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 编译到特定目标

编译到特定目标涉及多个源代码集。当 Kotlin 将多平台项目编译到特定目标时，它会收集所有标记有该目标的源代码集，并从中生成二进制文件。

考虑一个包含 `jvm`、`iosArm64` 和 `js` 目标的示例。Kotlin 会为共同代码创建 `commonMain` 源代码集，并为特定目标创建对应的 `jvmMain`、`iosArm64Main` 和 `jsMain` 源代码集：

![Compilation to a specific target](specific-target-diagram.svg){width=700}

在编译到 JVM 期间，Kotlin 会选择所有标记有“JVM”的源代码集，即 `jvmMain` 和 `commonMain`。然后它将它们一起编译为 JVM 类文件：

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

由于 Kotlin 将 `commonMain` 和 `jvmMain` 一起编译，因此生成的二进制文件包含来自 `commonMain` 和 `jvmMain` 的声明。

在使用多平台项目时，请记住：

*   如果您希望 Kotlin 将您的代码编译到特定平台，请声明一个对应的目标。
*   要选择存储代码的目录或源文件，请首先决定您希望在哪些目标之间共享代码：
    *   如果代码在所有目标之间共享，则应在 `commonMain` 中声明。
    *   如果代码仅用于一个目标，则应在该目标的平台特有源代码集中定义（例如，JVM 的 `jvmMain`）。
*   在平台特有源代码集中编写的代码可以访问共同源代码集中的声明。例如，`jvmMain` 中的代码可以使用 `commonMain` 中的代码。然而，反之则不成立：`commonMain` 不能使用 `jvmMain` 中的代码。
*   在平台特有源代码集中编写的代码可以使用对应的平台依赖项。例如，`jvmMain` 中的代码可以使用仅限 Java 的库，例如 [Guava](https://github.com/google/guava) 或 [Spring](https://spring.io/)。

### 中间源代码集

简单的多平台项目通常只包含共同代码和平台特有代码。`commonMain` 源代码集代表在所有已声明目标之间共享的共同代码。平台特有源代码集，例如 `jvmMain`，代表仅编译到相应目标的平台特有代码。

实际上，您通常需要更细粒度的代码共享。

考虑一个您需要面向所有现代 Apple 设备和 Android 设备的示例：

```kotlin
kotlin {
    android()
    iosArm64()   // 64 位 iPhone 设备
    macosArm64() // 基于现代 Apple 芯片的 Mac
    watchosX64() // 现代 64 位 Apple Watch 设备
    tvosArm64()  // 现代 Apple TV 设备  
}
```

您需要一个源代码集来添加一个为所有 Apple 设备生成 UUID 的函数：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 您希望访问 Apple 特有的 API
    return NSUUID().UUIDString()
}
```

您不能将此函数添加到 `commonMain` 中。`commonMain` 会编译到所有已声明的目标，包括 Android，但 `platform.Foundation.NSUUID` 是一个 Apple 特有的 API，在 Android 上不可用。如果您尝试在 `commonMain` 中引用 `NSUUID`，Kotlin 会显示错误。

您可以将此代码复制并粘贴到每个 Apple 特有源代码集：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main` 中。但这种方法不推荐，因为像这样重复代码容易出错。

为了解决这个问题，您可以使用_中间源代码集_。中间源代码集是一个 Kotlin 源代码集，它编译到项目中的部分目标，但不是全部目标。您也可以看到中间源代码集被称为分层源代码集或简称层次结构。

Kotlin 默认创建一些中间源代码集。在这种特定情况下，生成的项目结构将如下所示：

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

此处，底部的多色块是平台特有源代码集。为清晰起见，省略了目标标签。

`appleMain` 代码块是 Kotlin 创建的一个中间源代码集，用于共享编译到 Apple 特有目标的代码。`appleMain` 源代码集仅编译到 Apple 目标。因此，Kotlin 允许在 `appleMain` 中使用 Apple 特有 API，您可以在此处添加 `randomUUID()` 函数。

> 关于查找 Kotlin 默认创建和设置的所有中间源代码集，以及如果 Kotlin 默认不提供您所需的中间源代码集时应如何操作，请参见[分层项目结构](multiplatform-hierarchy.md)。
>
{style="tip"}

在编译到特定目标期间，Kotlin 会获取所有标记有此目标的源代码集，包括中间源代码集。因此，在编译到 `iosArm64` 平台目标时，`commonMain`、`appleMain` 和 `iosArm64Main` 源代码集中编写的所有代码都会被组合。

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 如果某些源代码集没有源代码，这也没关系。例如，在 iOS 开发中，通常不需要提供仅适用于 iOS 设备但不适用于 iOS 模拟器的代码。因此，`iosArm64Main` 很少使用。
>
{style="tip"}

#### Apple 设备和模拟器目标 {initial-collapse-state="collapsed" collapsible="true"}

当您使用 Kotlin Multiplatform 开发 iOS 移动应用程序时，您通常会使用 `iosMain` 源代码集。尽管您可能认为它是 `ios` 目标的平台特有源代码集，但并没有单一的 `ios` 目标。大多数移动项目至少需要两个目标：

*   **设备目标** 用于生成可在 iOS 设备上执行的二进制文件。目前 iOS 只有一个设备目标：`iosArm64`。
*   **模拟器目标** 用于生成在您机器上启动的 iOS 模拟器所需的二进制文件。如果您有基于 Apple 芯片的 Mac 电脑，请选择 `iosSimulatorArm64` 作为模拟器目标。如果您有基于 Intel 的 Mac 电脑，请使用 `iosX64`。

如果您只声明 `iosArm64` 设备目标，您将无法在本地机器上运行和调试您的应用程序和测试。

平台特有源代码集，例如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main` 通常是空的，因为用于 iOS 设备和模拟器的 Kotlin 代码通常是相同的。您可以使用 `iosMain` 中间源代码集在它们之间共享代码。

同样适用于其他非 Mac 的 Apple 目标。例如，如果您有用于 Apple TV 的 `tvosArm64` 设备目标，以及分别用于基于 Apple 芯片和 Intel 设备的 Apple TV 模拟器的 `tvosSimulatorArm64` 和 `tvosX64` 模拟器目标，您可以使用 `tvosMain` 中间源代码集来共享所有这些目标的代码。

## 测试集成

实际项目除了主要的生产代码外，还需要测试。这就是为什么所有默认创建的源代码集都带有 `Main` 和 `Test` 后缀的原因。`Main` 包含生产代码，而 `Test` 包含此代码的测试。它们之间的连接是自动建立的，测试可以在无需额外配置的情况下使用 `Main` 代码提供的 API。

`Test` 对应部分也是类似于 `Main` 的源代码集。例如，`commonTest` 是 `commonMain` 的对应部分，并编译到所有已声明的目标，允许您编写共同测试。平台特有测试源代码集，例如 `jvmTest`，用于编写平台特有测试，例如 JVM 特有测试或需要 JVM API 的测试。

除了拥有一个用于编写共同测试的源代码集之外，您还需要一个多平台测试框架。Kotlin 提供了一个默认的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库，它带有 `@kotlin.Test` 注解和各种断言方法，例如 `assertEquals` 和 `assertTrue`。

您可以在各自的源代码集中为每个平台编写平台特有测试，就像常规测试一样。与主代码类似，您可以为每个源代码集设置平台特有依赖项，例如 JVM 的 `JUnit` 和 iOS 的 `XCTest`。要为特定目标运行测试，请使用 `<targetName>Test` 任务。

有关如何创建和运行多平台测试，请参阅[测试您的多平台应用教程](multiplatform-run-tests.md)。

## 接下来是什么？

*   [了解有关在 Gradle 脚本中声明和使用预定义源代码集的更多信息](multiplatform-hierarchy.md)
*   [探索多平台项目结构的高级概念](multiplatform-advanced-project-structure.md)
*   [了解有关目标编译和创建自定义编译的更多信息](multiplatform-configure-compilations.md)