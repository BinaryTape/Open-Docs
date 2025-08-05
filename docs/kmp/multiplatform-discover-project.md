[//]: # (title: Kotlin Multiplatform 项目结构基础)

通过 Kotlin Multiplatform，您可以在不同平台之间共享代码。本文将解释共享代码的约束、
如何区分代码中的共享部分和平台特有部分，以及如何指定共享代码所适用的平台。

您还将学习 Kotlin Multiplatform 项目设置的核心概念，例如公共代码、目标平台（targets）、
平台特有和中间源代码集（source sets），以及测试集成。这将有助于您在将来设置多平台项目。

这里介绍的模型与 Kotlin 使用的模型相比有所简化。然而，这个基本模型应该足以满足大多数情况。

## 公共代码

_公共代码_ 是在不同平台之间共享的 Kotlin 代码。

考虑一个简单的“Hello, World”示例：

```kotlin
fun greeting() {
    println("Hello, Kotlin Multiplatform!")
}
```

平台之间共享的 Kotlin 代码通常位于 `commonMain` 目录中。代码文件的位置非常重要，
因为它会影响此代码将要编译到的平台列表。

Kotlin 编译器将源代码作为输入，并生成一组平台特有的二进制构件作为结果。当编译多平台项目时，
它可以从相同的代码生成多个二进制构件。例如，编译器可以从相同的 Kotlin 文件生成 JVM `.class` 文件和原生可执行文件：

![Common code](common-code-diagram.svg){width=700}

并非所有 Kotlin 代码都可以编译到所有平台。Kotlin 编译器会阻止您在公共代码中使用平台特有的函数或类，
因为这些代码无法编译到不同的平台。

例如，您不能在公共代码中使用 `java.io.File` 依赖项。它是 JDK 的一部分，
而公共代码也会编译为原生代码，在原生代码中 JDK 类是不可用的：

![Unresolved Java reference](unresolved-java-reference.png){width=500}

在公共代码中，您可以使用 Kotlin Multiplatform 库。这些库提供了可在不同平台上以不同方式实现的公共 API。
在这种情况下，平台特有 API 作为额外部分，尝试在公共代码中使用此类 API 会导致错误。

例如，`kotlinx.coroutines` 是一个支持所有目标平台的 Kotlin Multiplatform 库，
但它也有一个平台特有部分，可以将 `kotlinx.coroutines` 的并发原语转换为 JDK 并发原语，
例如 `fun CoroutinesDispatcher.asExecutor(): Executor`。API 的这一额外部分在 `commonMain` 中不可用。

## 目标平台

目标平台（Targets）定义了 Kotlin 将公共代码编译到的平台。例如，这些可以是 JVM、JS、
Android、iOS 或 Linux。前面的示例将公共代码编译到 JVM 和原生目标平台。

一个 _Kotlin 目标平台_ 是一个描述编译目标的标识符。它定义了生成的二进制构件的格式、
可用的语言结构以及允许的依赖项。

> 目标平台也可以被称为平台。关于支持的目标平台的完整列表，请参见
> [此处](multiplatform-dsl-reference.md#targets)。
>
> {style="note"}

您应该首先 _声明_ 一个目标平台，以指示 Kotlin 为该特定目标平台编译代码。在 Gradle 中，您可以使用预定义的 DSL 调用
在 `kotlin {}` 代码块中声明目标平台：

```kotlin
kotlin {
    jvm() // 声明一个 JVM 目标平台
    iosArm64() // 声明一个对应 64 位 iPhone 的目标平台
}
```

通过这种方式，每个多平台项目都定义了一组支持的目标平台。关于如何在构建脚本中声明目标平台，
请参见 [分层项目结构](multiplatform-hierarchy.md) 部分。

声明 `jvm` 和 `iosArm64` 目标平台后，`commonMain` 中的公共代码将编译到这些目标平台：

![Targets](target-diagram.svg){width=700}

为了理解哪些代码将被编译到特定目标平台，您可以将目标平台视为附加到 Kotlin 源代码文件上的标签。
Kotlin 使用这些标签来确定如何编译您的代码，生成哪些二进制构件，以及该代码中允许使用哪些语言结构和依赖项。

如果您也想将 `greeting.kt` 文件编译到 `.js`，您只需声明 JS 目标平台。
`commonMain` 中的代码将获得一个额外的 `js` 标签，对应于 JS 目标平台，
该标签指示 Kotlin 生成 `.js` 文件：

![Target labels](target-labels-diagram.svg){width=700}

这就是 Kotlin 编译器处理编译到所有已声明目标平台的公共代码的方式。
关于如何编写平台特有代码，请参见 [源代码集](#source-sets)。

## 源代码集

一个 _Kotlin 源代码集_ 是一组具有自己的目标平台、依赖项和编译器选项的源文件。
它是多平台项目中共享代码的主要方式。

多平台项目中的每个源代码集：

*   具有在该给定项目中唯一的名称。
*   包含一组源文件和资源，通常存储在以源代码集名称命名的目录中。
*   指定了一组此源代码集中的代码将要编译到的目标平台。这些目标平台会影响此源代码集中可用的语言结构和依赖项。
*   定义了自己的依赖项和编译器选项。

Kotlin 提供了许多预定义的源代码集。其中之一是 `commonMain`，它存在于所有多平台项目中，并编译到所有已声明的目标平台。

在 Kotlin Multiplatform 项目中，您可以将源代码集作为 `src` 目录下的子目录进行交互。
例如，一个包含 `commonMain`、`iosMain` 和 `jvmMain` 源代码集的项目具有以下结构：

![Shared sources](src-directory-diagram.png){width=350}

在 Gradle 脚本中，您可以在 `kotlin.sourceSets {}` 代码块内按名称访问源代码集：

```kotlin
kotlin {
    // 目标平台声明：
    // …

    // 源代码集声明：
    sourceSets {
        commonMain {
            // 配置 commonMain 源代码集
        }
    }
}
```

除了 `commonMain`，其他源代码集可以是平台特有的或中间的。

### 平台特有源代码集

虽然只有公共代码很方便，但这并非总是可行。`commonMain` 中的代码会编译到所有已声明的目标平台，
Kotlin 不允许您在那里使用任何平台特有 API。

在一个包含原生和 JS 目标平台的多平台项目中，以下 `commonMain` 中的代码无法编译：

```kotlin
// commonMain/kotlin/common.kt
// 无法在公共代码中编译
fun greeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

作为解决方案，Kotlin 创建了平台特有源代码集，也称为平台源代码集。每个目标平台都有一个
相应的平台源代码集，它仅为该目标平台编译。例如，一个 `jvm` 目标平台具有
相应的 `jvmMain` 源代码集，它仅编译到 JVM。Kotlin 允许在这些源代码集中使用平台特有依赖项，
例如，在 `jvmMain` 中使用 JDK：

```kotlin
// jvmMain/kotlin/jvm.kt
// 您可以在 `jvmMain` 源代码集中使用 Java 依赖项
fun jvmGreeting() {
    java.io.File("greeting.txt").writeText("Hello, Multiplatform!")
}
```

### 编译到特定目标平台

编译到特定目标平台涉及多个源代码集。当 Kotlin 将多平台项目编译到特定目标平台时，
它会收集所有标记有此目标平台的源代码集，并从它们生成二进制构件。

考虑一个包含 `jvm`、`iosArm64` 和 `js` 目标平台的示例。Kotlin 为公共代码创建了 `commonMain` 源代码集，
并为特定目标平台创建了相应的 `jvmMain`、`iosArm64Main` 和 `jsMain` 源代码集：

![Compilation to a specific target](specific-target-diagram.svg){width=700}

在编译到 JVM 期间，Kotlin 会选择所有标记有“JVM”的源代码集，即 `jvmMain` 和 `commonMain`。
然后，它将它们一起编译为 JVM 类文件：

![Compilation to JVM](compilation-jvm-diagram.svg){width=700}

由于 Kotlin 将 `commonMain` 和 `jvmMain` 一起编译，因此生成的二进制构件包含来自
`commonMain` 和 `jvmMain` 的声明。

使用多平台项目时，请记住：

*   如果您希望 Kotlin 将您的代码编译到特定平台，请声明相应的目标平台。
*   要选择用于存储代码的目录或源文件，首先决定要在哪些目标平台之间共享代码：

    *   如果代码在所有目标平台之间共享，则应在 `commonMain` 中声明。
    *   如果代码仅用于一个目标平台，则应在该目标平台的平台特有源代码集中定义（例如，JVM 的 `jvmMain`）。
*   在平台特有源代码集中编写的代码可以访问公共源代码集中的声明。例如，`jvmMain` 中的代码可以使用 `commonMain` 中的代码。
    然而，反过来则不然：`commonMain` 不能使用 `jvmMain` 中的代码。
*   在平台特有源代码集中编写的代码可以使用相应的平台依赖项。例如，`jvmMain` 中的代码可以使用仅限 Java 的库，
    例如 [Guava](https://github.com/google/guava) 或 [Spring](https://spring.io/)。

### 中间源代码集

简单的多平台项目通常只有公共代码和平台特有代码。
`commonMain` 源代码集表示在所有已声明目标平台之间共享的公共代码。平台特有
源代码集（例如 `jvmMain`）表示仅编译到各自目标平台的平台特有代码。

在实践中，您通常需要更细粒度的代码共享。

考虑一个您需要面向所有现代 Apple 设备和 Android 设备的示例：

```kotlin
kotlin {
    androidTarget()
    iosArm64()   // 64 位 iPhone 设备
    macosArm64() // 现代 Apple 芯片 Mac
    watchosX64() // 现代 64 位 Apple Watch 设备
    tvosArm64()  // 现代 Apple TV 设备  
}
```

您需要一个源代码集来添加一个为所有 Apple 设备生成 UUID 的函数：

```kotlin
import platform.Foundation.NSUUID

fun randomUuidString(): String {
    // 您想要访问 Apple 特有 API
    return NSUUID().UUIDString()
}
```

您不能将此函数添加到 `commonMain`。`commonMain` 编译到所有已声明的目标平台，包括 Android，
但 `platform.Foundation.NSUUID` 是一个 Apple 特有 API，在 Android 上不可用。如果您尝试在 `commonMain` 中引用 `NSUUID`，Kotlin 会显示错误。

您可以将此代码复制并粘贴到每个 Apple 特有源代码集中：`iosArm64Main`、`macosArm64Main`、`watchosX64Main` 和 `tvosArm64Main`。
但不推荐这种方法，因为像这样重复代码容易出错。

为了解决这个问题，您可以使用 _中间源代码集_。中间源代码集是一个 Kotlin 源代码集，
它编译到项目中的部分而不是所有目标平台。您也可以将中间源代码集称为分层源代码集或简称层级。

Kotlin 默认会创建一些中间源代码集。在这个特定情况下，生成的项目结构将如下所示：

![Intermediate source sets](intermediate-source-sets-diagram.svg){width=700}

这里，底部多色块是平台特有源代码集。为清晰起见，省略了目标平台标签。

`appleMain` 代码块是 Kotlin 创建的一个中间源代码集，用于共享编译到 Apple 特有目标平台的代码。
`appleMain` 源代码集仅编译到 Apple 目标平台。因此，Kotlin 允许在 `appleMain` 中使用 Apple 特有 API，
您可以在这里添加 `randomUUID()` 函数。

> 关于 Kotlin 默认创建和设置的所有中间源代码集，以及如果 Kotlin 没有默认提供您需要的中间源代码集时应如何操作，
> 请参见 [分层项目结构](multiplatform-hierarchy.md)。
>
{style="tip"}

在编译到特定目标平台期间，Kotlin 会获取所有标记有此目标平台的源代码集，包括中间源代码集。
因此，`commonMain`、`appleMain` 和 `iosArm64Main` 源代码集中编写的所有代码将在编译到 `iosArm64` 平台目标平台时合并：

![Native executables](multiplatform-executables-diagram.svg){width=700}

> 某些源代码集没有源文件也没关系。例如，在 iOS 开发中，通常不需要提供仅适用于 iOS 设备而不适用于 iOS 模拟器的代码。
> 因此，`iosArm64Main` 很少使用。
>
{style="tip"}

#### Apple 设备和模拟器目标平台 {initial-collapse-state="collapsed" collapsible="true"}

当您使用 Kotlin Multiplatform 开发 iOS 移动应用程序时，通常会使用 `iosMain` 源代码集。
虽然您可能认为它是 `ios` 目标平台的平台特有源代码集，但并没有单一的 `ios` 目标平台。
大多数移动项目至少需要两个目标平台：

*   **设备目标平台** 用于生成可在 iOS 设备上执行的二进制构件。目前 iOS 只有一个设备目标平台：`iosArm64`。
*   **模拟器目标平台** 用于生成在您的机器上启动的 iOS 模拟器的二进制构件。如果您有 Apple 芯片 Mac 电脑，
    请选择 `iosSimulatorArm64` 作为模拟器目标平台。如果您有 Intel 芯片 Mac 电脑，请使用 `iosX64`。

如果您只声明 `iosArm64` 设备目标平台，将无法在本地机器上运行和调试您的应用程序和测试。

平台特有源代码集（如 `iosArm64Main`、`iosSimulatorArm64Main` 和 `iosX64Main`）通常是空的，
因为 iOS 设备和模拟器的 Kotlin 代码通常是相同的。您可以使用 `iosMain` 中间源代码集来在它们之间共享代码。

这同样适用于其他非 Mac 的 Apple 目标平台。例如，如果您有一个用于 Apple TV 的 `tvosArm64` 设备目标平台，
以及分别用于 Apple 芯片和 Intel 芯片设备上 Apple TV 模拟器的 `tvosSimulatorArm64` 和 `tvosX64` 模拟器目标平台，
您可以使用 `tvosMain` 中间源代码集来共享它们之间的所有代码。

## 与测试集成

实际项目除了主要的生产代码外，还需要测试。这就是为什么所有默认创建的源代码集都带有 `Main` 和 `Test` 后缀。
`Main` 包含生产代码，而 `Test` 包含此代码的测试。它们之间的连接是自动建立的，测试可以在不进行额外配置的情况下使用 `Main` 代码提供的 API。

`Test` 对应的源代码集也与 `Main` 类似。例如，`commonTest` 是 `commonMain` 的对应部分，
并编译到所有已声明的目标平台，允许您编写公共测试。平台特有测试源代码集（例如 `jvmTest`）
用于编写平台特有测试，例如 JVM 特有测试或需要 JVM API 的测试。

除了拥有一个源代码集来编写您的公共测试之外，您还需要一个多平台测试框架。
Kotlin 提供了一个默认的 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) 库，
该库带有 `@kotlin.Test` 注解和各种断言方法，例如 `assertEquals` 和 `assertTrue`。

您可以像为每个平台编写常规测试一样编写平台特有测试，并将其放入各自的源代码集中。
与主代码一样，每个源代码集可以拥有平台特有依赖项，例如 JVM 的 `JUnit` 和 iOS 的 `XCTest`。
要运行特定目标平台的测试，请使用 `<targetName>Test` 任务。

关于如何创建和运行多平台测试，请参见 [测试您的多平台应用教程](multiplatform-run-tests.md)。

## 后续步骤？

*   [了解更多关于在 Gradle 脚本中声明和使用预定义源代码集的信息](multiplatform-hierarchy.md)
*   [探索多平台项目结构的高级概念](multiplatform-advanced-project-structure.md)
*   [了解更多关于目标平台编译和创建自定义编译的信息](multiplatform-configure-compilations.md)