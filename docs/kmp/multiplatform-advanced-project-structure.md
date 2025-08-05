[//]: # (title: Kotlin 多平台项目结构的高级概念)

本文解释了 Kotlin Multiplatform 项目结构的高级概念，以及它们如何映射到 Gradle 实现。如果您需要处理 Gradle 构建的低级抽象（配置项、任务、发布项等），或者正在为 Kotlin Multiplatform 构建创建 Gradle 插件，这些信息将非常有用。

本页面在以下情况下对您有所帮助：

*   您需要在 Kotlin 未创建源代码集的 **set** 目标平台之间共享代码。
*   您希望为 Kotlin Multiplatform 构建创建 Gradle 插件，或需要处理 Gradle 构建的低级抽象，例如配置项、任务、发布项等。

在多平台项目中理解依赖项管理的关键之一，是 Gradle 风格的项目或库依赖项与 Kotlin 特有的源代码集之间 `dependsOn` 关系的区别：

*   `dependsOn` 是通用源代码集和平台特有的源代码集之间的一种关系，它能够实现[源代码集层级结构](#dependson-and-source-set-hierarchies)并通常在多平台项目中共享代码。对于默认源代码集，层级结构是自动管理的，但在特定情况下您可能需要更改它。
*   库和项目依赖项通常像往常一样工作，但在多平台项目中正确管理它们时，您应该了解[Gradle 依赖项如何解析](#dependencies-on-other-libraries-or-projects)为用于编译的细粒度 **源代码集 → 源代码集** 依赖项。

> 在深入了解高级概念之前，我们建议您学习[多平台项目结构的基础知识](multiplatform-discover-project.md)。
>
{style="tip"}

## `dependsOn` 和源代码集层级结构

通常，您将处理的是 _依赖项_，而不是 _`dependsOn`_ 关系。然而，检查 `dependsOn` 对于理解 Kotlin Multiplatform 项目的底层原理至关重要。

`dependsOn` 是两个 Kotlin 源代码集之间 Kotlin 特有的关系。这可能是通用源代码集和平台特有的源代码集之间的连接，例如，当 `jvmMain` 源代码集依赖于 `commonMain` 时，`iosArm64Main` 依赖于 `iosMain`，等等。

考虑一个包含 Kotlin 源代码集 `A` 和 `B` 的通用示例。表达式 `A.dependsOn(B)` 指示 Kotlin：

1.  `A` 观察 `B` 的 API，包括内部声明。
2.  `A` 可以为 `B` 中的 expected 声明提供 actual 实现。这是一个必要且充分的条件，因为当且仅当 `A.dependsOn(B)` 直接或间接存在时，`A` 才能为 `B` 提供 `actuals`。
3.  除了 `B` 自己的目标平台外，`B` 还应编译到 `A` 编译到的所有目标平台。
4.  `A` 继承 `B` 的所有常规依赖项。

`dependsOn` 关系创建了一种树状结构，称为源代码集层级结构。以下是典型的移动开发项目的示例，其中包含 `androidTarget`、`iosArm64`（iPhone 设备）和 `iosSimulatorArm64`（Apple Silicon Mac 上的 iPhone 模拟器）：

![DependsOn tree structure](dependson-tree-diagram.svg){width=700}

箭头表示 `dependsOn` 关系。
这些关系在平台二进制文件的编译过程中得以保留。这就是 Kotlin 如何理解 `iosMain` 应该能看到 `commonMain` 的 API，而不是 `iosArm64Main` 的 API：

![DependsOn relations during compilation](dependson-relations-diagram.svg){width=700}

`dependsOn` 关系通过 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 调用进行配置，例如：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

*   此示例展示了如何在构建脚本中定义 `dependsOn` 关系。然而，Kotlin Gradle 插件默认会创建源代码集并设置这些关系，因此您无需手动执行此操作。
*   `dependsOn` 关系与构建脚本中的 `dependencies {}` 代码块是分开声明的。
    这是因为 `dependsOn` 不是常规依赖项；相反，它是 Kotlin 源代码集之间的一种特定关系，对于跨不同目标平台共享代码是必需的。

您不能使用 `dependsOn` 来声明对已发布的库或另一个 Gradle 项目的常规依赖项。
例如，您不能将 `commonMain` 设置为依赖于 `kotlinx-coroutines-core` 库的 `commonMain`，也不能调用 `commonTest.dependsOn(commonMain)`。

### 声明自定义源代码集

在某些情况下，您可能需要在项目中拥有一个自定义的中间源代码集。
考虑一个编译到 JVM、JS 和 Linux 的项目，并且您只想在 JVM 和 JS 之间共享一些源代码。
在这种情况下，您应该为这对目标平台找到一个特定的源代码集，如[多平台项目结构的基础知识](multiplatform-discover-project.md)中所述。

Kotlin 不会自动创建这样的源代码集。这意味着您应该使用 `by creating` 结构手动创建它：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // Create a source set named "jvmAndJs"
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

然而，Kotlin 仍然不知道如何处理或编译此源代码集。如果您绘制一张图表，此源代码集将是独立的，并且没有任何目标平台标签：

![Missing dependsOn relation](missing-dependson-diagram.svg){width=700}

要解决此问题，请通过添加几个 `dependsOn` 关系将 `jvmAndJsMain` 包含在层级结构中：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // Don't forget to add dependsOn to commonMain
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

在这里，`jvmMain.dependsOn(jvmAndJsMain)` 将 JVM 目标平台添加到 `jvmAndJsMain`，而 `jsMain.dependsOn(jvmAndJsMain)` 将 JS 目标平台添加到 `jvmAndJsMain`。

最终的项目结构将如下所示：

![Final project structure](final-structure-diagram.svg){width=700}

> 手动配置 `dependsOn` 关系会禁用默认层级结构模板的自动应用。
> 有关此类情况以及如何处理的更多信息，请参见[额外配置](multiplatform-hierarchy.md#additional-configuration)。
>
{style="note"}

## 对其他库或项目的依赖项

在多平台项目中，您可以设置对已发布的库或另一个 Gradle 项目的常规依赖项。

Kotlin Multiplatform 通常以典型的 Gradle 方式声明依赖项。与 Gradle 类似，您：

*   在构建脚本中使用 `dependencies {}` 代码块。
*   为依赖项选择适当的作用域，例如 `implementation` 或 `api`。
*   如果依赖项发布在版本库中，则通过指定其坐标来引用它，例如 `"com.google.guava:guava:32.1.2-jre"`，或者如果它是同一构建中的 Gradle 项目，则通过其路径来引用它，例如 `project(":utils:concurrency")`。

多平台项目中的依赖项配置有一些特殊特性。每个 Kotlin 源代码集都有自己的 `dependencies {}` 代码块。这允许您在平台特有的源代码集中声明平台特有的依赖项：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        jvmMain.dependencies {
            // This is jvmMain's dependencies, so it's OK to add a JVM-specific dependency
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

通用依赖项则更复杂。考虑一个声明对多平台库（例如 `kotlinx.coroutines`）存在依赖项的多平台项目：

```kotlin
kotlin {
    androidTarget()     // Android
    iosArm64()          // iPhone devices 
    iosSimulatorArm64() // iPhone simulator on Apple Silicon Mac

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

依赖项解析中有三个重要概念：

1.  多平台依赖项会沿着 `dependsOn` 结构向下传播。当您向 `commonMain` 添加依赖项时，它将自动添加到直接或间接在 `commonMain` 中声明 `dependsOn` 关系的所有源代码集。

    在这种情况下，依赖项确实已自动添加到所有 `*Main` 源代码集：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有这些源代码集都从 `commonMain` 源代码集继承 `kotlin-coroutines-core` 依赖项，因此您无需手动将它复制粘贴到所有这些源代码集中：

    ![Propagation of multiplatform dependencies](dependency-propagation-diagram.svg){width=700}

    > 传播机制允许您通过选择特定的源代码集来选择接收声明依赖项的作用域。
    > 例如，如果您想在 iOS 上使用 `kotlinx.coroutines` 但不在 Android 上使用，则只能将此依赖项添加到 `iosMain`。
    >
    {style="tip"}

2.  源代码集 → 多平台库依赖项，例如上面 `commonMain` 对 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3` 的依赖项，表示依赖项解析的中间状态。解析的最终状态始终由源代码集 → 源代码集依赖项表示。

    > 最终的源代码集 → 源代码集依赖项不是 `dependsOn` 关系。
    >
    {style="note"}

    为了推断细粒度的源代码集 → 源代码集依赖项，Kotlin 会读取与每个多平台库一起发布的源代码集结构。在此步骤之后，每个库在内部将不再表示为一个整体，而是表示为其源代码集的集合。请参见 `kotlinx-coroutines-core` 的此示例：

    ![Serialization of the source set structure](structure-serialization-diagram.svg){width=700}

3.  Kotlin 获取每个依赖项关系并将其解析为来自依赖项的源代码集集合。该集合中的每个依赖项源代码集都必须具有 _兼容的目标平台_。如果依赖项源代码集编译到 _至少与消费源代码集相同的目标平台_，则它具有兼容的目标平台。

    考虑一个示例，其中示例项目中的 `commonMain` 编译到 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`：

    *   首先，它解析对 `kotlinx-coroutines-core.commonMain` 的依赖项。这之所以发生，是因为 `kotlinx-coroutines-core` 编译到所有可能的 Kotlin 目标平台。因此，它的 `commonMain` 编译到所有可能的目标平台，包括所需的 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`。
    *   其次，`commonMain` 依赖于 `kotlinx-coroutines-core.concurrentMain`。
        由于 `kotlinx-coroutines-core` 中的 `concurrentMain` 编译到除 JS 之外的所有目标平台，
        它与消费项目的 `commonMain` 的目标平台匹配。

    然而，来自协程的 `iosX64Main` 等源代码集与消费者的 `commonMain` 不兼容。
    尽管 `iosX64Main` 编译到 `commonMain` 的一个目标平台，即 `iosX64`，
    但它既不编译到 `androidTarget` 也不编译到 `iosSimulatorArm64`。

    依赖项解析的结果直接影响 `kotlinx-coroutines-core` 中哪些代码是可见的：

    ![Error on JVM-specific API in common code](dependency-resolution-error.png){width=700}

### 对齐通用依赖项在源代码集中的版本

在 Kotlin Multiplatform 项目中，通用源代码集会多次编译以生成 klib 并作为每个配置的[编译项](multiplatform-configure-compilations.md)的一部分。为了生成一致的二进制文件，通用代码每次都应针对相同版本的多平台依赖项进行编译。
Kotlin Gradle 插件有助于对齐这些依赖项，确保每个源代码集的实际生效依赖项版本相同。

在上面的示例中，假设您想将 `androidx.navigation:navigation-compose:2.7.7` 依赖项添加到 `androidMain` 源代码集。您的项目为 `commonMain` 源代码集显式声明了 `kotlinx-coroutines-core:1.7.3` 依赖项，但 Compose Navigation 库 2.7.7 版本需要 Kotlin coroutines 1.8.0 或更高版本。

由于 `commonMain` 和 `androidMain` 是同时编译的，Kotlin Gradle 插件会在两个版本的 coroutines 库之间进行选择，并将 `kotlinx-coroutines-core:1.8.0` 应用于 `commonMain` 源代码集。但是，为了使通用代码在所有配置的目标平台中保持一致地编译，iOS 源代码集也需要被限制为相同的依赖项版本。因此 Gradle 会将 `kotlinx.coroutines-*:1.8.0` 依赖项也传播到 `iosMain` 源代码集。

![Alignment of dependencies among *Main source sets](multiplatform-source-set-dependency-alignment.svg){width=700}

依赖项在 `*Main` 源代码集和 [`*Test` 源代码集](multiplatform-discover-project.md#integration-with-tests)之间分别对齐。
`*Test` 源代码集的 Gradle 配置包含 `*Main` 源代码集的所有依赖项，反之则不然。
因此，您可以使用更新的库版本测试您的项目，而不会影响您的主代码。

例如，您的 `*Main` 源代码集中有 Kotlin coroutines 1.7.3 依赖项，并传播到项目中的每个源代码集。
然而，在 `iosTest` 源代码集中，您决定将版本升级到 1.8.0 以测试新库版本。
根据相同的算法，此依赖项将通过 `*Test` 源代码集树传播，因此每个 `*Test` 源代码集都将使用 `kotlinx.coroutines-*:1.8.0` 依赖项进行编译。

![Test source sets resolving dependencies separately from the main source sets](test-main-source-set-dependency-alignment.svg)

## 编译项

与单平台项目不同，Kotlin Multiplatform 项目需要多次启动编译器才能构建所有 **artifact**。每次编译器启动都是一个 _Kotlin 编译项_。

例如，早先提到的 Kotlin 编译项如何生成 iPhone 设备的二进制文件：

![Kotlin compilation for iOS](ios-compilation-diagram.svg){width=700}

Kotlin 编译项按目标平台分组。默认情况下，Kotlin 为每个目标平台创建两个编译项：用于生产源代码的 `main` 编译项和用于测试源代码的 `test` 编译项。

构建脚本中的编译项以类似的方式访问。您首先选择一个 Kotlin 目标平台，然后访问其中的 `compilations` 容器，最后按其名称选择所需的编译项：

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}