[//]: # (title: 多平台项目结构的进阶概念)

本文介绍了 Kotlin 多平台项目结构的进阶概念，以及它们如何映射到 Gradle 实现。如果你需要处理 Gradle 构建的底层抽象（配置、任务、发布等），或者正在为 Kotlin 多平台构建创建 Gradle 插件，这些信息将非常有用。

如果你符合以下情况，本页面可能会对你有所帮助：

* 需要在一组 Kotlin 未为其创建源集的目标之间共享代码。
* 想要为 Kotlin 多平台构建创建 Gradle 插件，或者需要处理 Gradle 构建的底层抽象，例如配置、任务、发布等。

理解多平台项目依赖项管理的关键点之一，是理解 Gradle 风格的项目或库依赖项与 Kotlin 特有的源集之间的 `dependsOn` 关系之间的区别：

* `dependsOn` 是通用源集与平台特定源集之间的关系，它实现了[源集层次结构](#dependson-and-source-set-hierarchies)，并支持在多平台项目中共享代码。对于默认源集，层次结构是自动管理的，但在特定情况下你可能需要对其进行更改。
* 库和项目依赖项通常按常规方式工作，但为了在多平台项目中正确管理它们，你应该了解 [Gradle 依赖项是如何解析](#dependencies-on-other-libraries-or-projects)为用于编译的细粒度 **源集 → 源集** 依赖项的。

> 在深入研究进阶概念之前，我们建议先学习[多平台项目结构的基础知识](multiplatform-discover-project.md)。
>
{style="tip"}

## dependsOn 与源集层次结构

通常，你会处理的是 *依赖项 (dependencies)*，而不是 *`dependsOn`* 关系。然而，研究 `dependsOn` 对于理解 Kotlin 多平台项目在底层的运行机制至关重要。

`dependsOn` 是两个 Kotlin 源集之间特有的 Kotlin 关系。这可以是通用源集与平台特定源集之间的连接，例如，当 `jvmMain` 源集依赖于 `commonMain`，`iosArm64Main` 依赖于 `iosMain` 等。

以包含 Kotlin 源集 `A` 和 `B` 的通用示例为例。表达式 `A.dependsOn(B)` 告知 Kotlin：

1. `A` 可以观察到来自 `B` 的 API，包括内部（internal）声明。
2. `A` 可以为来自 `B` 的预期声明提供实际实现。这是一个必要且充分条件，因为当且仅当 `A.dependsOn(B)`（直接或间接）时，`A` 才能为 `B` 提供 `actuals`。
3. 除了自身的目标外，`B` 还应该编译到 `A` 所编译的所有目标。
4. `A` 继承 `B` 的所有常规依赖项。

`dependsOn` 关系创建了一个树状结构，称为源集层次结构。以下是一个典型的移动开发项目示例，包含 `android`、`iosArm64`（iPhone 设备）和 `iosSimulatorArm64`（适用于 Apple 芯片 Mac 的 iPhone 模拟器）：

![DependsOn 树状结构](dependson-tree-diagram.svg){width=700}

箭头表示 `dependsOn` 关系。
这些关系在编译平台二进制文件期间会被保留。这就是 Kotlin 如何理解 `iosMain` 应该看到来自 `commonMain` 的 API，但不应看到来自 `iosArm64Main` 的 API 的方式：

![编译期间的 DependsOn 关系](dependson-relations-diagram.svg){width=700}

`dependsOn` 关系通过 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 调用进行配置，例如：

```kotlin
kotlin {
    // 目标声明
    sourceSets {
        // 配置 dependsOn 关系的示例 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* 此示例展示了如何在构建脚本中定义 `dependsOn` 关系。但是，Kotlin Gradle 插件默认会创建源集并建立这些关系，因此你无需手动执行此操作。
* `dependsOn` 关系的声明与构建脚本中的 `dependencies {}` 块是分开的。这是因为 `dependsOn` 不是普通的依赖项；相反，它是 Kotlin 源集之间的一种特定关系，是在不同目标之间共享代码所必需的。

你不能使用 `dependsOn` 来声明对已发布的库或另一个 Gradle 项目的常规依赖项。例如，你不能将 `commonMain` 设置为依赖于 `kotlinx-coroutines-core` 库的 `commonMain`，也不能调用 `commonTest.dependsOn(commonMain)`。

### 声明自定义源集

在某些情况下，你可能需要在项目中拥有自定义的中间源集。
假设一个项目要编译到 JVM、JS 和 Linux，而你只想在 JVM 和 JS 之间共享某些源代码。在这种情况下，你应该为这对目标寻找一个特定的源集，如[多平台项目结构的基础知识](multiplatform-discover-project.md)中所述。

Kotlin 不会自动创建此类源集。这意味着你应该使用 `by creating` 结构手动创建它：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        // 创建一个名为 "jvmAndJs" 的源集
        val jvmAndJsMain by creating {
            // …
        }
    }
}
```

但是，Kotlin 仍然不知道如何处理或编译此源集。如果你画一个图，这个源集将是孤立的，没有任何目标标签：

![缺失 dependsOn 关系](missing-dependson-diagram.svg){width=700}

要修复此问题，请通过添加多个 `dependsOn` 关系将 `jvmAndJsMain` 纳入层次结构：

```kotlin
kotlin {
    jvm()
    js()
    linuxX64()

    sourceSets {
        val jvmAndJsMain by creating {
            // 不要忘记添加对 commonMain 的 dependsOn
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

在这里，`jvmMain.dependsOn(jvmAndJsMain)` 将 JVM 目标添加到 `jvmAndJsMain` 中，而 `jsMain.dependsOn(jvmAndJsMain)` 将 JS 目标添加到 `jvmAndJsMain` 中。

最终的项目结构将如下所示：

![最终项目结构](final-structure-diagram.svg){width=700}

> 手动配置 `dependsOn` 关系会禁用默认层次结构模板的自动应用。请参阅[附加配置](multiplatform-hierarchy.md#additional-configuration)以了解更多关于此类情况及处理方法的信息。
>
{style="note"}

## 对其他库或项目的依赖项

在多平台项目中，你可以设置对已发布库或另一个 Gradle 项目的常规依赖项。

Kotlin 多平台通常以典型的 Gradle 方式声明依赖项。与 Gradle 类似，你可以：

* 在构建脚本中使用 `dependencies {}` 块。
* 为依赖项选择合适的范围，例如 `implementation` 或 `api`。
* 如果依赖项发布在仓库中，通过指定其坐标来引用，例如 `"com.google.guava:guava:32.1.2-jre"`；如果它是同一构建中的 Gradle 项目，则通过其路径引用，例如 `project(":utils:concurrency")`。

多平台项目中的依赖项配置具有一些特殊功能。每个 Kotlin 源集都有自己的 `dependencies {}` 块。这允许你在平台特定的源集中声明平台特定的依赖项：

```kotlin
kotlin {
    // 目标声明
    sourceSets {
        jvmMain.dependencies {
            // 这是 jvmMain 的依赖项，因此可以添加 JVM 特定的依赖项
            implementation("com.google.guava:guava:32.1.2-jre")
        }
    }
}
```

通用的依赖项则更为复杂。考虑一个多平台项目，它声明了对多平台库的依赖，例如 `kotlinx.coroutines`：

```kotlin
kotlin {
    android()     // Android
    iosArm64()          // iPhone 设备 
    iosSimulatorArm64() // 适用于 Apple 芯片 Mac 的 iPhone 模拟器

    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
        }
    }
}
```

在依赖项解析中有三个重要的概念：

1. 多平台依赖项会沿着 `dependsOn` 结构向下传播。当你向 `commonMain` 添加依赖项时，它将自动添加到所有直接或间接在 `commonMain` 中声明 `dependsOn` 关系的源集中。

   在本例中，依赖项确实被自动添加到了所有 `*Main` 源集中：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有这些源集都继承了来自 `commonMain` 源集的 `kotlin-coroutines-core` 依赖项，因此你无需在所有源集中手动复制粘贴它：

   ![多平台依赖项的传播](dependency-propagation-diagram.svg){width=700}

   > 传播机制允许你通过选择特定的源集来选择将接收声明依赖项的范围。例如，如果你想在 iOS 上使用 `kotlinx.coroutines` 而不在 Android 上使用，你可以仅将此依赖项添加到 `iosMain`。
   >
   {style="tip"}

2. *源集 → 多平台库* 的依赖项（如上文的 `commonMain` 到 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`）代表了依赖项解析的中间状态。解析的最终状态始终由 *源集 → 源集* 依赖项表示。

   > 最终的 *源集 → 源集* 依赖项不是 `dependsOn` 关系。
   >
   {style="note"}

   为了推断细粒度的 *源集 → 源集* 依赖项，Kotlin 会读取与每个多平台库一同发布的源集结构。完成此步骤后，每个库在内部将不再作为一个整体表示，而是作为其源集的集合来表示。请看 `kotlinx-coroutines-core` 的示例：

   ![源集结构的序列化](structure-serialization-diagram.svg){width=700}

3. Kotlin 获取每个依赖项关系，并将其解析为来自依赖项的源集集合。该集合中的每个依赖源集必须具有 *兼容目标*。如果一个依赖源集编译到的目标 *至少包含* 消费源集所编译的目标，则该依赖源集具有兼容目标。

   考虑一个示例，其中示例项目中的 `commonMain` 编译到 `android`、`iosX64` 和 `iosSimulatorArm64`：

    * 首先，它解析对 `kotlinx-coroutines-core.commonMain` 的依赖。这是因为 `kotlinx-coroutines-core` 编译到所有可能的 Kotlin 目标。因此，它的 `commonMain` 编译到所有可能的目标，包括所需的 `android`、`iosX64` 和 `iosSimulatorArm64`。
    * 其次，`commonMain` 依赖于 `kotlinx-coroutines-core.concurrentMain`。由于 `kotlinx-coroutines-core` 中的 `concurrentMain` 编译到除 JS 之外的所有目标，它与消费项目的 `commonMain` 的目标相匹配。

   然而，来自协程库的 `iosX64Main` 等源集与消费者的 `commonMain` 不兼容。即使 `iosX64Main` 编译到 `commonMain` 的其中一个目标（即 `iosX64`），它也不编译到 `android` 或 `iosSimulatorArm64`。

   依赖项解析的结果直接影响 `kotlinx-coroutines-core` 中哪些代码是可见的：

   ![通用代码中 JVM 特定 API 的错误](dependency-resolution-error.png){width=700}

### 对齐跨源集的通用依赖项版本

在 Kotlin 多平台项目中，通用源集会被编译多次以生成 klib，并作为每个配置的[编译](multiplatform-configure-compilations.md)的一部分。为了产生一致的二进制文件，每次编译通用代码时都应使用相同版本的多平台依赖项。Kotlin Gradle 插件有助于对齐这些依赖项，确保每个源集的有效依赖项版本相同。

在上面的例子中，假设你想将 `androidx.navigation:navigation-compose:2.7.7` 依赖项添加到 `androidMain` 源集。你的项目为 `commonMain` 源集显式声明了 `kotlinx-coroutines-core:1.7.3` 依赖项，但版本为 2.7.7 的 Compose Navigation 库需要 Kotlin 协程 1.8.0 或更高版本。

由于 `commonMain` 和 `androidMain` 是在一起编译的，Kotlin Gradle 插件会在两个版本的协程库之间进行选择，并将 `kotlinx-coroutines-core:1.8.0` 应用于 `commonMain` 源集。但为了使通用代码在所有配置的目标上保持一致的编译，iOS 源集也需要被约束到相同的依赖项版本。因此，Gradle 也会将 `kotlinx.coroutines-*:1.8.0` 依赖项传播到 `iosMain` 源集。

![在 *Main 源集之间对齐依赖项](multiplatform-source-set-dependency-alignment.svg){width=700}

依赖项在 `*Main` 源集和 [`*Test` 源集](multiplatform-discover-project.md#integration-with-tests)之间是分别对齐的。`*Test` 源集的 Gradle 配置包含 `*Main` 源集的所有依赖项，反之则不然。因此，你可以使用较新版本的库测试你的项目，而不会影响你的主代码。

例如，你在 `*Main` 源集中拥有 Kotlin 协程 1.7.3 依赖项，它已传播到项目中的每个源集。
然而，在 `iosTest` 源集中，你决定将版本升级到 1.8.0 以测试新的库发布。根据相同的算法，此依赖项将传播到整个 `*Test` 源集树，因此每个 `*Test` 源集都将使用 `kotlinx.coroutines-*:1.8.0` 依赖项进行编译。

![测试源集的依赖项解析与主源集分开进行](test-main-source-set-dependency-alignment.svg)

## 编译 (Compilations)

与单平台项目不同，Kotlin 多平台项目需要多次启动编译器来构建所有工件。每次编译器启动都是一次 *Kotlin 编译*。

例如，以下是前文提到的 Kotlin 编译期间如何生成 iPhone 设备二进制文件的过程：

![iOS 的 Kotlin 编译](ios-compilation-diagram.svg){width=700}

Kotlin 编译被分组在目标下。默认情况下，Kotlin 为每个目标创建两个编译：用于生产源码的 `main` 编译和用于测试源码的 `test` 编译。

在构建脚本中访问编译的方式类似。你首先选择一个 Kotlin 目标，然后访问其内部的 `compilations` 容器，最后根据名称选择所需的编译：

```kotlin
kotlin {
    // 声明并配置 JVM 目标
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}