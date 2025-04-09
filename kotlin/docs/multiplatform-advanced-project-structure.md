---
title: 多平台项目结构的高级概念
---
本文介绍了 Kotlin Multiplatform 项目结构的高级概念，以及它们如何映射到 Gradle 的实现。如果您需要使用 Gradle 构建的底层抽象（配置、任务、发布等），或者正在为 Kotlin Multiplatform 构建创建 Gradle 插件，那么这些信息将非常有用。

以下情况，此页面将对您有所帮助：

* 需要在一组 Kotlin 没有为其创建源集的 target（目标平台）之间共享代码。
* 想要为 Kotlin Multiplatform 构建创建一个 Gradle 插件，或者需要使用 Gradle 构建的底层抽象，例如配置、任务、发布等。

理解多平台项目中依赖管理的一个关键点是 Gradle 风格的项目或库依赖，与 Kotlin 特有的源集之间的 `dependsOn` 关系之间的区别：

* `dependsOn` 是 common（通用）源集和 platform-specific（平台特定）源集之间的一种关系，它启用了 [源集层级结构](#dependson-and-source-set-hierarchies)，并支持在多平台项目中共享代码。对于默认源集，层级结构是自动管理的，但在特定情况下可能需要更改它。
* 通常，库和项目依赖的工作方式与往常一样，但为了在多平台项目中正确管理它们，您应该了解 [Gradle 依赖是如何解析的](#dependencies-on-other-libraries-or-projects)，最终成为用于编译的细粒度的 **源集 → 源集** 依赖。

:::note
在深入研究高级概念之前，我们建议您学习 [多平台项目结构的基础知识](multiplatform-discover-project)。

## dependsOn 和源集层级结构

通常，您将使用 _dependencies（依赖）_ 而不是 _`dependsOn`_ 关系。但是，检查 `dependsOn` 对于理解 Kotlin Multiplatform 项目在底层是如何工作的至关重要。

`dependsOn` 是两个 Kotlin 源集之间的一种 Kotlin 特定的关系。这可能是 common（通用）源集和 platform-specific（平台特定）源集之间的连接，例如，当 `jvmMain` 源集依赖于 `commonMain`，`iosArm64Main` 依赖于 `iosMain`，等等。

考虑一个带有 Kotlin 源集 `A` 和 `B` 的通用示例。表达式 `A.dependsOn(B)` 指示 Kotlin：

1. `A` 观察来自 `B` 的 API，包括 internal 声明。
2. `A` 可以为来自 `B` 的 expected 声明提供 actual 实现。这是一个必要且充分的条件，因为当且仅当 `A.dependsOn(B)` 直接或间接地存在时，`A` 才能为 `B` 提供 `actuals`。
3. 除了其自身的 target（目标平台）之外，`B` 应该编译到 `A` 编译到的所有 target（目标平台）。
4. `A` 继承 `B` 的所有常规依赖。

`dependsOn` 关系创建一个类似树的结构，称为源集层级结构。这是一个典型的移动开发项目的示例，其中包含 `androidTarget`、`iosArm64` (iPhone 设备) 和 `iosSimulatorArm64` (适用于 Apple Silicon Mac 的 iPhone 模拟器)：

<img src="/img/dependson-tree-diagram.svg" alt="DependsOn tree structure" width="700" style={{verticalAlign: 'middle'}}/>

箭头表示 `dependsOn` 关系。
这些关系在平台二进制文件的编译过程中得以保留。这就是 Kotlin 了解 `iosMain` 应该看到来自 `commonMain` 而不是来自 `iosArm64Main` 的 API 的方式：

<img src="/img/dependson-relations-diagram.svg" alt="DependsOn relations during compilation" width="700" style={{verticalAlign: 'middle'}}/>

`dependsOn` 关系使用 `KotlinSourceSet.dependsOn(KotlinSourceSet)` 调用进行配置，例如：

```kotlin
kotlin {
    // Targets declaration
    sourceSets {
        // Example of configuring the dependsOn relation 
        iosArm64Main.dependsOn(commonMain)
    }
}
```

* 此示例显示了如何在构建脚本中定义 `dependsOn` 关系。但是，Kotlin Gradle 插件默认创建源集并设置这些关系，因此您无需手动执行此操作。
* `dependsOn` 关系与构建脚本中的 `dependencies {}` 块分开声明。
  这是因为 `dependsOn` 不是常规依赖；相反，它是 Kotlin 源集之间的一种特定关系，对于跨不同 target（目标平台）共享代码是必需的。

您不能使用 `dependsOn` 来声明对已发布库或另一个 Gradle 项目的常规依赖。
例如，您不能设置 `commonMain` 以依赖于 `kotlinx-coroutines-core` 库的 `commonMain`，或者调用 `commonTest.dependsOn(commonMain)`。

### 声明自定义源集

在某些情况下，您可能需要在项目中拥有一个自定义的中间源集。
考虑一个编译为 JVM、JS 和 Linux 的项目，并且您只想在 JVM 和 JS 之间共享一些源。
在这种情况下，您应该为此 target（目标平台）对找到一个特定的源集，如 [多平台项目结构的基础知识](multiplatform-discover-project) 中所述。

Kotlin 不会自动创建这样的源集。这意味着您应该使用 `by creating` 构造手动创建它：

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

但是，Kotlin 仍然不知道如何处理或编译此源集。如果绘制一个图表，则此源集将被隔离，并且没有任何 target（目标平台）标签：

<img src="/img/missing-dependson-diagram.svg" alt="Missing dependsOn relation" width="700" style={{verticalAlign: 'middle'}}/>

为了解决这个问题，请通过添加几个 `dependsOn` 关系将 `jvmAndJsMain` 包含在层级结构中：

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

在此，`jvmMain.dependsOn(jvmAndJsMain)` 将 JVM target（目标平台）添加到 `jvmAndJsMain`，`jsMain.dependsOn(jvmAndJsMain)` 将 JS target（目标平台）添加到 `jvmAndJsMain`。

最终的项目结构将如下所示：

<img src="/img/final-structure-diagram.svg" alt="Final project structure" width="700" style={{verticalAlign: 'middle'}}/>

手动配置 `dependsOn` 关系会禁用默认层级结构模板的自动应用。
有关此类情况以及如何处理它们的更多信息，请参见 [其他配置](multiplatform-hierarchy#additional-configuration)。

:::

## 依赖于其他库或项目

在多平台项目中，您可以设置对已发布库或另一个 Gradle 项目的常规依赖。

Kotlin Multiplatform 通常以典型的 Gradle 方式声明依赖。与 Gradle 类似，您可以：

* 在构建脚本中使用 `dependencies {}` 块。
* 为依赖选择适当的作用域，例如 `implementation` 或 `api`。
* 通过指定其坐标（如果已在 repo 中发布，如 `"com.google.guava:guava:32.1.2-jre"`）或其路径（如果是同一构建中的 Gradle 项目，如 `project(":utils:concurrency")`）来引用依赖。

多平台项目中的依赖配置有一些特殊功能。每个 Kotlin 源集都有自己的 `dependencies {}` 块。这允许您在 platform-specific（平台特定）源集中声明 platform-specific（平台特定）依赖：

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

Common（通用）依赖更棘手。考虑一个声明对多平台库（例如 `kotlinx.coroutines`）的依赖的多平台项目：

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

依赖解析有三个重要的概念：

1. 多平台依赖会沿着 `dependsOn` 结构向下传播。当您向 `commonMain` 添加依赖时，它将自动添加到所有直接或间接在 `commonMain` 中声明 `dependsOn` 关系的源集。

   在这种情况下，该依赖实际上已自动添加到所有 `*Main` 源集：`iosMain`、`jvmMain`、`iosSimulatorArm64Main` 和 `iosX64Main`。所有这些源集都从 `commonMain` 源集继承了 `kotlin-coroutines-core` 依赖，因此您不必手动将它复制并粘贴到所有源集中：

   <img src="/img/dependency-propagation-diagram.svg" alt="Propagation of multiplatform dependencies" width="700" style={{verticalAlign: 'middle'}}/>

   > 传播机制允许您通过选择特定的源集来选择将接收声明的依赖的作用域。
   > 例如，如果您想在 iOS 上使用 `kotlinx.coroutines` 但不在 Android 上使用，则可以仅将此依赖添加到 `iosMain`。

2. _源集 → 多平台库_ 依赖，如上面的 `commonMain` 到 `org.jetbrians.kotlinx:kotlinx-coroutines-core:1.7.3`，表示依赖解析的中间状态。解析的最终状态始终由 _源集 → 源集_ 依赖表示。

   > 最终的 _源集 → 源集_ 依赖不是 `dependsOn` 关系。

   为了推断细粒度的 _源集 → 源集_ 依赖，Kotlin 读取与每个多平台库一起发布的源集结构。在此步骤之后，每个库将在内部表示为一个源集集合，而不是作为一个整体。请参阅 `kotlinx-coroutines-core` 的以下示例：

   <img src="/img/structure-serialization-diagram.svg" alt="Serialization of the source set structure" width="700" style={{verticalAlign: 'middle'}}/>

3. Kotlin 获取每个依赖关系，并将其解析为来自依赖的源集集合。
   该集合中的每个依赖源集必须具有 _兼容的 target（目标平台）_。如果依赖源集编译为 _至少与使用者源集相同的 target（目标平台）_，则它具有兼容的 target（目标平台）。

   考虑一个示例，其中示例项目中的 `commonMain` 编译为 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`：

    * 首先，它解析对 `kotlinx-coroutines-core.commonMain` 的依赖。发生这种情况是因为 `kotlinx-coroutines-core` 编译为所有可能的 Kotlin target（目标平台）。因此，它的 `commonMain` 编译为所有可能的 target（目标平台），包括所需的 `androidTarget`、`iosX64` 和 `iosSimulatorArm64`。
    * 其次，`commonMain` 依赖于 `kotlinx-coroutines-core.concurrentMain`。
      由于 `kotlinx-coroutines-core` 中的 `concurrentMain` 编译为除 JS 之外的所有 target（目标平台），因此它与使用者项目的 `commonMain` 的 target（目标平台）匹配。

   但是，来自协程的 `iosX64Main` 等源集与使用者的 `commonMain` 不兼容。
   即使 `iosX64Main` 编译为 `commonMain` 的 target（目标平台）之一，即 `iosX64`，
   它也不会编译为 `androidTarget` 或 `iosSimulatorArm64`。

   依赖解析的结果直接影响 `kotlinx-coroutines-core` 中哪些代码是可见的：

   <img src="/img/dependency-resolution-error.png" alt="Error on JVM-specific API in common code" width="700" style={{verticalAlign: 'middle'}}/>

### 对齐跨源集的 common（通用）依赖的版本

在 Kotlin Multiplatform 项目中，common（通用）源集会被编译多次，以生成 klib，并作为每个配置的 [编译](multiplatform-configure-compilations) 的一部分。为了生成一致的二进制文件，common（通用）代码应该每次都针对相同版本的多平台依赖进行编译。Kotlin Gradle 插件有助于对齐这些依赖，确保有效的依赖版本对于每个源集都是相同的。

在上面的示例中，假设您想将 `androidx.navigation:navigation-compose:2.7.7` 依赖添加到您的 `androidMain` 源集。您的项目显式声明了 `commonMain` 源集的 `kotlinx-coroutines-core:1.7.3` 依赖，但 2.7.7 版本的 Compose Navigation 库需要 Kotlin 协程 1.8.0 或更高版本。

由于 `commonMain` 和 `androidMain` 是共同编译的，因此 Kotlin Gradle 插件会在两个版本的协程库之间进行选择，并将 `kotlinx-coroutines-core:1.8.0` 应用于 `commonMain` 源集。但是为了使 common（通用）代码在所有配置的 target（目标平台）上编译一致，iOS 源集也需要约束到相同的依赖版本。因此，Gradle 会将 `kotlinx.coroutines-*:1.8.0` 依赖传播到 `iosMain` 源集。

<img src="/img/multiplatform-source-set-dependency-alignment.svg" alt="Alignment of dependencies among *Main source sets" width="700" style={{verticalAlign: 'middle'}}/>

依赖在 `*Main` 源集和 [`*Test` 源集](multiplatform-discover-project#integration-with-tests) 之间分别对齐。
`*Test` 源集的 Gradle 配置包括 `*Main` 源集的所有依赖，但反之则不然。
因此，您可以使用较新的库版本测试您的项目，而不会影响您的主代码。

例如，您的 `*Main` 源集中有 Kotlin 协程 1.7.3 依赖，该依赖传播到项目中的每个源集。
但是，在 `iosTest` 源集中，您决定将版本升级到 1.8.0 以测试新的库版本。
根据相同的算法，此依赖将传播到 `*Test` 源集的树中，因此每个 `*Test` 源集都将使用 `kotlinx.coroutines-*:1.8.0` 依赖进行编译。

<img src="/img/test-main-source-set-dependency-alignment.svg" alt="Test source sets resolving dependencies separately from the main source sets" style={{verticalAlign: 'middle'}}/>

## 编译

与单平台项目相反，Kotlin Multiplatform 项目需要多次编译器启动才能构建所有 artifacts（产物）。
每次编译器启动都是一次 _Kotlin 编译_。

例如，以下是在之前提到的 Kotlin 编译期间为 iPhone 设备生成二进制文件的方式：

<img src="/img/ios-compilation-diagram.svg" alt="Kotlin compilation for iOS" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin 编译在 target（目标平台）下分组。默认情况下，Kotlin 为每个 target（目标平台）创建两个编译，一个用于生产源的 `main` 编译，一个用于测试源的 `test` 编译。

在构建脚本中以类似的方式访问编译。首先选择一个 Kotlin target（目标平台），然后访问内部的 `compilations` 容器，最后按名称选择必要的编译：

```kotlin
kotlin {
    // Declare and configure the JVM target
    jvm {
        val mainCompilation: KotlinJvmCompilation = compilations.getByName("main")
    }
}
```