[//]: # (title: 多平台项目结构的高级概念)

本文解释了 Kotlin Multiplatform 项目结构的高级概念，以及它们如何映射到 Gradle 实现。如果你需要使用 Gradle 构建（配置、任务、发布项等）的低层抽象，或者正在创建用于 Kotlin Multiplatform 构建的 Gradle 插件，这些信息将很有用。

如果你遇到以下情况，本页可能会有帮助：

*   需要在一组目标平台之间共享代码，而 Kotlin 没有为其创建源代码集。
*   希望为 Kotlin Multiplatform 构建创建 Gradle 插件，或需要使用 Gradle 构建的低层抽象，例如配置、任务、发布项等。

在多平台项目中理解依赖管理的关键点之一是，Gradle 风格的项目或库依赖项与 Kotlin 特有的源代码集之间的 `dependsOn` 关系之间的区别：

*   `dependsOn` 是公共源代码集和平台特有的源代码集之间的一种关系，它能够实现[源代码集层级结构](#dependson-and-source-set-hierarchies)并普遍实现在多平台项目中共享代码。对于默认源代码集，层级结构是自动管理的，但在特定情况下你可能需要修改它。
*   库和项目依赖项通常照常工作，但为了在多平台项目中正确管理它们，你应该理解 [Gradle 依赖项如何解析](#dependencies-on-other-libraries-or-projects)为用于编译的细粒度 **源代码集 → 源代码集** 依赖项。

> 在深入了解高级概念之前，我们建议你先学习[多平台项目结构的基础知识](multiplatform-discover-project.md)。
>
{style="tip"}

## dependsOn 和源代码集层级结构

通常，你会使用*依赖项*而不是 *`dependsOn`* 关系。然而，探究 `dependsOn` 对于理解 Kotlin Multiplatform 项目的底层工作原理至关重要。

`dependsOn` 是两个 Kotlin 源代码集之间 Kotlin 特有的关系。这可能是公共源代码集和平台特有的源代码集之间的连接，例如，当 `jvmMain` 源代码集依赖于 `commonMain` 时，`iosArm64Main` 依赖于 `iosMain`，依此类推。

考虑一个包含 Kotlin 源代码集 `A` 和 `B` 的一般示例。表达式 `A.dependsOn(B)` 告知 Kotlin：

1.  `A` 观测 `B` 的 API，包括内部声明。
2.  `A` 可以为 `B` 中的 `expected` 声明提供实际实现。这是一个必要且充分的条件，因为 `A` 仅在 `A.dependsOn(B)` 直接或间接存在时，才能为 `B` 提供 `actuals`。
3.  `B` 除了其自身的目标平台外，还应该编译到 `A` 编译到的所有目标平台。
4.  `A` 继承 `B` 的所有常规依赖项。

`dependsOn` 关系创建了一个树状结构，称为源代码集层级结构。以下是一个典型的移动开发项目示例，包含 `android`、`iosArm64`（iPhone 设备）和 `iosSimulatorArm64`（Apple Silicon Mac 上的 iPhone 模拟器）：

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

箭头表示 `dependsOn` 关系。这些关系在平台二进制文件的编译期间得以保留。这是 Kotlin 理解 `iosMain` 应该看到 `commonMain` 的 API 而不是 `iosArm64Main` 的方式：

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn` 关系通过 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 调用进行配置，例如：

```kotlin
kotlin {
    // 目标平台声明
    sourceSets {
        // 配置 dependsOn 关系的示例
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   此示例展示了如何在构建脚本中定义 `dependsOn` 关系。然而，Kotlin Gradle 插件默认会创建源代码集并设置这些关系，因此你无需手动操作。
*   `dependsOn` 关系在构建脚本中与 `dependencies {}` 代码块分开声明。这是因为 `dependsOn` 不是一个常规依赖项；相反，它是 Kotlin 源代码集之间的一种特定关系，对于在不同目标平台之间共享代码是必要的。

你不能使用 `dependsOn` 来声明对已发布的库或另一个 Gradle 项目的常规依赖项。例如，你不能设置 `commonMain` 来依赖 `kotlinx-coroutines-core` 库的 `commonMain`，也不能调用 `commonTest.dependsOn(commonMain)`。

### 声明自定义源代码集

在某些情况下，你可能需要在项目中拥有一个自定义的中间源代码集。考虑一个编译到 JVM、JS 和 Linux 的项目，并且你只想在 JVM 和 JS 之间共享一些源代码。在这种情况下，你应该找到这对目标平台特有的源代码集，如[多平台项目结构的基础知识](multiplatform-discover-project.md)中所述。

Kotlin 不会自动创建这样的源代码集。这意味着你应该使用 `by creating` 构造手动创建它：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // 创建名为 "jvmAndJs" 的源代码集
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

然而，Kotlin 仍然不知道如何处理或编译此源代码集。如果你绘制图表，此源代码集将是隔离的，并且不会带有任何目标平台标签：

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

要解决此问题，请通过添加多个 `dependsOn` 关系将 `jvmAndJsMain` 包含到层级结构中：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // 不要忘记将 commonMain 添加到 dependsOn
            dependsOn(commonMain.get())
        }

        jvmMain {
            dependsOn(jvmAndJsMain)
        }

        jsMain {
            dependsOn(jvmAndJsMain)
        }
    }
}
```

这里，`jvmMain.dependsOn(jvmAndJsMain)` 将 JVM 目标平台添加到 `jvmAndJsMain`，而 `jsMain.dependsOn(jvmAndJsMain)` 将 JS 目标平台添加到 `jvmAndJsMain`。

最终的项目结构将如下所示：

![Final project structure](final-structure-diagram.svg){width=700}

> 手动配置 `dependsOn` 关系会禁用默认层级结构模板的自动应用。关于此类情况以及如何处理它们，请参见[额外配置](multiplatform-hierarchy.md#additional-configuration)。
>
{style="note"}

## 对其他库或项目的依赖项

在多平台项目中，你可以设置对已发布的库或另一个 Gradle 项目的常规依赖项。

Kotlin Multiplatform 通常以典型的 Gradle 方式声明依赖项。与 Gradle 类似，你：

*   在构建脚本中使用 `dependencies {}` 代码块。
*   为依赖项选择适当的作用域，例如，`implementation` 或 `api`。
*   通过指定其坐标（如果它已在版本库中发布，例如 `"com.google.guava:guava:32.1.2-jre"`），或其路径（如果它是同一构建中的 Gradle 项目，例如 `project(":utils:concurrency")`）来引用依赖项。

多平台项目中的依赖项配置有一些特殊特性。每个 Kotlin 源代码集都有其自身的 `dependencies {}` 代码块。这允许你在平台特有的源代码集中声明平台特有的依赖项：

```kotlin
kotlin {
    // 目标平台声明
    sourceSets {
        jvmMain.dependencies {
            // 这是 jvmMain 的依赖项，因此添加 JVM 特有的依赖项是允许的
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

公共依赖项更复杂。考虑一个多平台项目，它声明了对多平台库的依赖项，例如 `kotlinx.coroutines`：

```kotlin
kotlin {
    android()     // Android
    iosArm64()          // iPhone 设备
    iosSimulatorArm64() // Apple Silicon Mac 上的 iPhone 模拟器

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依赖项解析中有三个重要概念：

1.  多平台依赖项会向下传播到 `dependsOn` 结构。当你将依赖项添加到 `commonMain` 时，它将自动添加到所有直接或间接在 `commonMain` 中声明 `dependsOn` 关系的源代码集。

    在这种情况下，该依赖项确实已自动添加到所有 `*Main` 源代码集：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有这些源代码集都从 `commonMain` 源代码集继承了 `kotlin-coroutines-core` 依赖项，因此你无需手动在所有这些源代码集中复制粘贴它：

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > 传播机制允许你通过选择特定的源代码集来选择将接收声明依赖项的作用域。例如，如果你只想在 iOS 上使用 `kotlinx.coroutines` 而不在 Android 上使用，则可以仅将此依赖项添加到 `iosMain`。
    >
    {style="tip"}

2.  _源代码集 → 多平台库_ 依赖项，例如上面 `commonMain` 到 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`，表示依赖项解析的中间状态。解析的最终状态始终由 _源代码集 → 源代码集_ 依赖项表示。

    > 最终的 _源代码集 → 源代码集_ 依赖项不是 `dependsOn` 关系。
    >
    {style="note"}

    为了推断细粒度的 _源代码集 → 源代码集_ 依赖项，Kotlin 读取与每个多平台库一同发布的源代码集结构。在此步骤之后，每个库在内部将不作为一个整体表示，而作为其源代码集的集合表示。请参见 `kotlinx-coroutines-core` 的此示例：

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  Kotlin 获取每个依赖关系并将其解析为来自依赖项的源代码集集合。该集合中的每个依赖源代码集必须具有_兼容的目标平台_。如果依赖源代码集编译到_至少与消费者源代码集相同_的目标平台，则它具有兼容的目标平台。

    考虑一个示例，其中示例项目中的 `commonMain` 编译到 `android`、`iosX64` 和 `iosSimulatorArm64`：

    *   首先，它解析对 `kotlinx-coroutines-core.commonMain` 的依赖项。发生这种情况是因为 `kotlinx-coroutines-core` 编译到所有可能的 Kotlin 目标平台。因此，它的 `commonMain` 编译到所有可能的目标平台，包括所需的 `android`、`iosX64` 和 `iosSimulatorArm64`。
    *   其次，`commonMain` 依赖于 `kotlinx-coroutines-core.concurrentMain`。由于 `kotlinx-coroutines-core` 中的 `concurrentMain` 编译到除 JS 之外的所有目标平台，因此它匹配消费者项目的 `commonMain` 的目标平台。

    然而，来自 coroutines 的 `iosX64Main` 等源代码集与消费者的 `commonMain` 不兼容。即使 `iosX64Main` 编译到 `commonMain` 的其中一个目标平台，即 `iosX64`，它既不编译到 `android` 也不编译到 `iosSimulatorArm64`。

    依赖项解析的结果直接影响 `kotlinx-coroutines-core` 中哪些代码可见：

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### 在源代码集之间对齐公共依赖项的版本

在 Kotlin Multiplatform 项目中，公共源代码集会多次编译以生成 klib，并作为每个已配置[编译项](multiplatform-configure-compilations.md)的一部分。为了生成一致的二进制文件，公共代码每次都应该针对相同版本的多平台依赖项进行编译。Kotlin Gradle 插件有助于对齐这些依赖项，确保每个源代码集的有效依赖项版本相同。

在上面的示例中，假设你想将 `androidx.navigation:navigation-compose:2.7.7` 依赖项添加到你的 `androidMain` 源代码集。你的项目显式声明了 `kotlinx-coroutines-core:1.7.3` 依赖项用于 `commonMain` 源代码集，但 Compose Navigation 库 2.7.7 版本需要 Kotlin coroutines 1.8.0 或更高版本。

由于 `commonMain` 和 `androidMain` 是一同编译的，Kotlin Gradle 插件会在两个版本的 coroutines 库之间进行选择，并将 `kotlinx-coroutines-core:1.8.0` 应用于 `commonMain` 源代码集。但为了使公共代码在所有已配置目标平台之间一致地编译，iOS 源代码集也需要被约束到相同的依赖项版本。因此 Gradle 也将 `kotlinx.coroutines-*:1.8.0` 依赖项传播到 `iosMain` 源代码集。

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

依赖项在 `*Main` 源代码集和 [`*Test` 源代码集](multiplatform-discover-project.md#integration-with-tests)之间单独对齐。`*Test` 源代码集的 Gradle 配置包含 `*Main` 源代码集的所有依赖项，但反之则不然。因此，你可以使用更新的库版本测试你的项目，而不会影响你的主代码。

例如，你的 `*Main` 源代码集中有 Kotlin coroutines 1.7.3 依赖项，它已传播到项目中的每个源代码集。然而，在 `iosTest` 源代码集中，你决定将版本升级到 1.8.0 以测试新的库发布。根据相同的算法，此依赖项将传播到 `*Test` 源代码集树的整个部分，因此每个 `*Test` 源代码集都将使用 `kotlinx.coroutines-*:1.8.0` 依赖项进行编译。

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## 编译项

与单平台项目相反，Kotlin Multiplatform 项目需要多次启动编译器来构建所有 artifact。每次编译器启动都是一次 *Kotlin 编译项*。

例如，下面是前面提到的此 Kotlin 编译项期间如何生成适用于 iPhone 设备的二进制文件：

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlin 编译项归类在目标平台下。默认情况下，Kotlin 为每个目标平台创建两个编译项，即用于生产源代码的 `main` 编译项和用于测试源代码的 `test` 编译项。

构建脚本中的编译项以类似的方式访问。你首先选择一个 Kotlin 目标平台，然后访问其中的 `compilations` 容器，最后根据其名称选择所需的编译项：

```kotlin
kotlin {
    // 声明并配置 JVM 目标平台
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}