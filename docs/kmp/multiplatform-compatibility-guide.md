[//]: # (title: Kotlin Multiplatform 兼容性指南)

<show-structure depth="1"/>

本指南总结了您在使用 Kotlin Multiplatform 开发项目时可能会遇到的[不兼容变更](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)。

Kotlin 的当前稳定版本是 %kotlinVersion%。请注意特定变更的弃用周期与您项目中 Kotlin 版本的关系，例如：

*   从 Kotlin 1.7.0 升级到 Kotlin 1.9.0 时，请检查在 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不兼容变更。
*   从 Kotlin 1.9.0 升级到 Kotlin 2.0.0 时，请检查在 [Kotlin 2.0.0](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不兼容变更。

## 版本兼容性

配置项目时，请检查特定版本的 Kotlin Multiplatform Gradle 插件（与您项目中的 Kotlin 版本相同）与 Gradle、Xcode 和 Android Gradle 插件版本的兼容性：

| Kotlin Multiplatform 插件版本 | Gradle                                | Android Gradle 插件                               | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0-2.2.10                        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 及更早版本。
> Gradle 8.7–8.10 版本也受支持，但有一个例外：如果您使用 Kotlin Multiplatform Gradle 插件，
> 您可能会在多平台项目中看到调用 JVM 目标中的 `withJava()` 函数的弃用警告。
> 有关更多信息，请参阅[默认创建的 Java 源代码集](#java-source-sets-created-by-default)。
>
{style="warning"}

## Kotlin 2.0.0 及更高版本

本节涵盖了在 Kotlin 2.0.0−%kotlinVersion% 中结束弃用周期并生效的不兼容变更。

### 已弃用 bitcode 嵌入

**有何变更？**

Bitcode 嵌入在 Xcode 14 中已弃用，并在 Xcode 15 中针对所有 Apple 目标移除。相应地，framework 配置的 `embedBitcode` 形参，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行实参在 Kotlin 中也已弃用。

**最佳实践是什么？**

如果您仍使用更早版本的 Xcode 但想升级到 Kotlin 2.0.20 或更高版本，请在您的 Xcode 项目中禁用 bitcode 嵌入。

**变更何时生效？**

以下是计划的弃用周期：

*   2.0.20: Kotlin/Native 编译器不再支持 bitcode 嵌入
*   2.1.0: Kotlin Multiplatform Gradle 插件中的 `embedBitcode` DSL 已弃用并发出警告
*   2.2.0: 警告将升级为错误
*   2.3.0: `embedBitcode` DSL 将被移除

### 默认创建的 Java 源代码集

**有何变更？**

为使 Kotlin Multiplatform 与 Gradle 的即将到来的变更保持一致，我们正在逐步淘汰 `withJava()` 函数。 `withJava()` 函数通过创建必要的 Java 源代码集来启用与 Gradle 的 Java 插件的集成。从 Kotlin 2.1.20 起，这些 Java 源代码集将默认创建。

**最佳实践是什么？**

以前，您必须显式使用 `withJava()` 函数来创建 `src/jvmMain/java` 和 `src/jvmTest/java` 源代码集：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

从 Kotlin 2.1.20 起，您可以从构建脚本中移除 `withJava()` 函数。

此外，Gradle 现在仅在存在 Java 源代码时才运行 Java 编译任务，这会触发以前未运行的 JVM 验证诊断。如果您为 `KotlinJvmCompile` 任务或 `compilerOptions` 内部显式配置不兼容的 JVM 目标，此诊断将失败。有关确保 JVM 目标兼容性的指导，请参阅[检查相关编译任务的 JVM 目标兼容性](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果您的项目使用高于 8.7 的 Gradle 版本，并且不依赖于 Gradle Java 插件，例如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)，或者依赖于带有 Gradle Java 插件依赖项的第三方 Gradle 插件，则可以移除 `withJava()` 函数。

如果您的项目使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 插件，我们建议迁移到[新的实验性 DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。从 Gradle 8.7 开始，Application 插件将不再与 Kotlin Multiplatform Gradle 插件一起工作。

如果您想在多平台项目中使用 Kotlin Multiplatform Gradle 插件和其他用于 Java 的 Gradle 插件，请参阅[与 Kotlin Multiplatform Gradle 插件和 Gradle Java 插件已弃用的兼容性](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果您在 Kotlin 2.1.20 中使用 [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 插件且 Gradle 版本高于 8.7，则该插件将无法工作。请升级到 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details) 来解决此问题。

如果您遇到任何问题，请在我们的[问题跟踪器](https://kotl.in/issue)中报告，或在我们的[公共 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)中寻求帮助。

**变更何时生效？**

以下是计划的弃用周期：

*   Gradle >8.6: 对于使用 `withJava()` 函数的多平台项目中任何以前的 Kotlin 版本，引入弃用警告。
*   Gradle 9.0: 将此警告升级为错误。
*   2.1.20: 使用任何 Gradle 版本时，使用 `withJava()` 函数将引入弃用警告。

### 将 `android` 目标重命名为 `androidTarget`

**有何变更？**

我们继续努力使 Kotlin Multiplatform 更加稳定。朝着这个方向迈出的重要一步是为 Android 目标提供一等支持。将来，此支持将通过由 Google 的 Android 团队开发的单独插件提供。

为了给新的解决方案铺平道路，我们正在当前的 Kotlin DSL 中将 `android` 代码块重命名为 `androidTarget`。这是一个临时变更，旨在为 Google 即将推出的 DSL 释放简短的 `android` 名称。

**最佳实践是什么？**

将所有出现的 `android` 代码块重命名为 `androidTarget`。当用于 Android 目标支持的新插件可用时，请迁移到 Google 的 DSL。这将是在 Kotlin Multiplatform 项目中使用 Android 的首选选项。

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.0: 在 Kotlin Multiplatform 项目中使用 `android` 名称时引入弃用警告
*   2.1.0: 将此警告升级为错误
*   2.2.0: 从 Kotlin Multiplatform Gradle 插件中移除 `android` 目标 DSL

### 声明多个类似目标

**有何变更？**

我们不鼓励在单个 Gradle 项目中声明多个类似目标。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // Not recommended and produces a deprecation warning
}
```

一个常见情况是将两个相关的代码片段放在一起。例如，您可能希望在您的 `:shared` Gradle 项目中使用 `jvm("jvmKtor")` 和 `jvm("jvmOkHttp")` 来使用 Ktor 或 OkHttp 库实现网络：

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

此实现带来了非简单的配置复杂性：

*   您必须在 `:shared` 侧和每个消费方设置 Gradle 属性。否则，Gradle 无法在此类项目中解析依赖项，因为没有额外信息，不清楚消费方应该接收基于 Ktor 还是基于 OkHttp 的实现。
*   您必须手动设置 `commonJvmMain` 源代码集。
*   该配置涉及一些低层 Gradle 和 Kotlin Gradle 插件的抽象和 API。

**最佳实践是什么？**

配置之所以复杂，是因为基于 Ktor 和基于 OkHttp 的实现位于**同一个 Gradle 项目**中。在许多情况下，可以将这些部分提取到单独的 Gradle 项目中。以下是此类重构的概述：

1.  将原始项目中的两个重复目标替换为单个目标。如果您在这些目标之间有共享源代码集，请将其源代码和配置移到新创建的目标的默认源代码集：

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // Copy the configuration of jvmCommonMain here
            }
        }
    }
    ```

2.  添加两个新的 Gradle 项目，通常通过在 `settings.gradle.kts` 文件中调用 `include` 来实现。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  配置每个新的 Gradle 项目：

    *   最有可能的是，您不需要应用 `kotlin("multiplatform")` 插件，因为这些项目仅编译到一个目标。在此示例中，您可以应用 `kotlin("jvm")`。
    *   将原始目标特有的源代码集的内容移动到其各自的项目，例如，从 `jvmKtorMain` 移动到 `ktor-impl/src`。
    *   复制源代码集的配置：依赖项、编译器选项等。
    *   从新的 Gradle 项目向原始项目添加依赖项。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // Add dependency on the original project
        // Copy dependencies of jvmKtorMain here
    }
    
    kotlin {
        compilerOptions {
            // Copy compiler options of jvmKtorMain here
        }
    }
    ```

虽然此方法在初始设置上需要更多工作，但它不使用 Gradle 和 Kotlin Gradle 插件的任何低层实体，从而使结果构建更易于使用和维护。

> 遗憾的是，我们无法为每个案例提供详细的迁移步骤。如果上述说明不适用于您，请在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-59316)中描述您的用例。
>
{style="tip"}

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.20: 在 Kotlin Multiplatform 项目中使用多个类似目标时引入弃用警告
*   2.1.0: 在此类情况下报告错误，Kotlin/JS 目标除外；要了解有关此例外的更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的问题

### 已弃用对以传统模式发布的多平台库的支持

**有何变更？**

以前，我们[已弃用](#deprecated-gradle-properties-for-hierarchical-structure-support) Kotlin Multiplatform 项目中的传统模式，阻止了“传统”二进制文件的发布，并鼓励您将项目迁移到[分层结构](multiplatform-hierarchy.md)。

为了继续逐步淘汰生态系统中的“传统”二进制文件，从 Kotlin 1.9.0 开始，也不鼓励使用传统库。如果您的项目依赖于传统库，您将看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**最佳实践是什么？**

_如果您使用多平台库_，它们中的大多数已经迁移到“分层结构”模式，因此您只需更新库版本即可。有关详细信息，请参阅相应库的文档。

如果该库尚不支持非传统二进制文件，您可以联系维护者并告知他们此兼容性问题。

_如果您是库作者_，请将 Kotlin Gradle 插件更新到最新版本，并确保您已修复[已弃用的 Gradle 属性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 团队乐于帮助生态系统迁移，因此如果您遇到任何问题，请随时在 [YouTrack](https://kotl.in/issue) 中创建问题。

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.0: 对传统库的依赖项引入弃用警告
*   2.0.0: 将对传统库的依赖项的警告升级为错误
*   >2.0.0: 移除对传统库依赖项的支持；使用此类依赖项可能导致构建失败

### 已弃用用于分层结构支持的 Gradle 属性

**有何变更？**

在其发展过程中，Kotlin 逐步引入了多平台项目中的[分层结构](multiplatform-hierarchy.md)支持，即在公共源代码集 `commonMain` 和任何平台特有的源代码集（例如 `jvmMain`）之间拥有中间源代码集的能力。

在过渡期，当工具链不够稳定时，引入了一些 Gradle 属性，允许细粒度的选择加入和选择退出。

自 Kotlin 1.6.20 以来，分层项目结构支持已默认启用。然而，为了在出现阻碍性问题时选择退出，这些属性被保留了下来。在处理所有反馈后，我们现在开始完全逐步淘汰这些属性。

以下属性现已弃用：

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**最佳实践是什么？**

*   从您的 `gradle.properties` 和 `local.properties` 文件中移除这些属性。
*   避免在 Gradle 构建脚本或您的 Gradle 插件中编程式地设置它们。
*   如果您您的构建中使用的某些第三方 Gradle 插件设置了已弃用的属性，请要求插件维护者不要设置这些属性。

由于 Kotlin 工具链的默认行为自 Kotlin 1.6.20 以来不包含此类属性，我们不预期会有任何严重影响。大多数后果将在项目重建后立即显现。

如果您是库作者并希望确保额外安全，请检查消费方是否可以使用您的库。

**变更何时生效？**

以下是计划的弃用周期：

*   1.8.20: 当使用已弃用的 Gradle 属性时报告警告
*   1.9.20: 将此警告升级为错误
*   2.0.0: 移除已弃用的属性；Kotlin Gradle 插件将忽略它们的用法

在极不可能的情况下，如果您在移除这些属性后遇到一些问题，请在 [YouTrack](https://kotl.in/issue) 中创建问题。

### 已弃用目标预设 API

**有何变更？**

在非常早期的开发阶段，Kotlin Multiplatform 引入了一个用于处理所谓**目标预设**的 API。每个目标预设本质上代表了 Kotlin Multiplatform 目标的工厂。此 API 结果在很大程度上是多余的，因为像 `jvm()` 或 `iosSimulatorArm64()` 这样的 DSL 函数涵盖了相同的用例，同时更直接和简洁。

为了减少混淆并提供更清晰的指导，所有与预设相关的 API 现已在 Kotlin Gradle 插件的公共 API 中弃用。这包括：

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 属性
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 接口及其所有继承者
*   `fromPreset` 重载

**最佳实践是什么？**

请改用相应的 [Kotlin 目标](multiplatform-dsl-reference.md#targets)，例如：

<table>
    
<tr>
<td>之前</td>
        <td>现在</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        fromPreset(presets.iosArm64, 'ios')&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    iosArm64()&#10;}"/>
</td>
</tr>

</table>

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.20: 对任何使用预设相关 API 的情况报告警告
*   2.0.0: 将此警告升级为错误
*   2.2.0: 从 Kotlin Gradle 插件的公共 API 中移除预设相关 API；仍然使用它的源代码将因“未解析引用”错误而失败，并且二进制文件（例如，Gradle 插件）除非针对最新版本的 Kotlin Gradle 插件重新编译，否则可能会因链接错误而失败

### 已弃用 Apple 目标快捷方式

**有何变更？**

我们正在弃用 Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目标快捷方式。它们旨在部分创建 Apple 目标的源代码集层级。然而，它们被证明难以扩展，有时令人困惑。

例如，`ios()` 快捷方式创建了 `iosArm64` 和 `iosX64` 目标，但没有包含 `iosSimulatorArm64` 目标，这在使用 Apple M 芯片的主机上工作时是必要的。然而，更改此快捷方式难以实现，并可能在现有用户项目中导致问题。

**最佳实践是什么？**

Kotlin Gradle 插件现在提供了一个内置层级模板。自 Kotlin 1.9.20 以来，它默认启用，并包含针对常见用例的预定义中间源代码集。

您应该指定目标列表而不是快捷方式，然后插件将根据此列表自动设置中间源代码集。

例如，如果您的项目中包含 `iosArm64` 和 `iosSimulatorArm64` 目标，插件将自动创建 `iosMain` 和 `iosTest` 中间源代码集。如果您的项目中包含 `iosArm64` 和 `macosArm64` 目标，则会创建 `appleMain` 和 `appleTest` 源代码集。

有关更多信息，请参阅[分层项目结构](multiplatform-hierarchy.md)

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.20: 当使用 `ios()`、`watchos()` 和 `tvos()` 目标快捷方式时报告警告；默认层级模板将默认启用以替代它们
*   2.1.0: 当使用目标快捷方式时报告错误
*   2.2.0: 从 Kotlin Multiplatform Gradle 插件中移除目标快捷方式 DSL

### Kotlin 升级后 iOS framework 版本不正确

**问题是什么？**

当使用直接集成时，Kotlin 代码中的变更可能不会反映在 Xcode 中的 iOS 应用中。直接集成通过 `embedAndSignAppleFrameworkForXcode` 任务设置，该任务将您的多平台项目中的 iOS framework 连接到 Xcode 中的 iOS 应用。

当您将多平台项目中的 Kotlin 版本从 1.9.2x 升级到 2.0.0（或从 2.0.0 降级到 1.9.2x）时，然后更改 Kotlin 文件并尝试构建应用，Xcode 可能会错误地使用 iOS framework 的旧版本。因此，这些变更在 Xcode 中的 iOS 应用中将不可见。

**有什么临时解决方案？**

1.  在 Xcode 中，使用 **Product** | **Clean Build Folder** 清理构建目录。
2.  在终端中，运行以下命令：

    ```none
    ./gradlew clean
    ```

3.  再次构建应用以确保使用新版本的 iOS framework。

**问题何时修复？**

我们计划在 Kotlin 2.0.10 中修复此问题。您可以查看 [参与 Kotlin 抢先体验预览](https://kotlinlang.org/docs/eap.html) 部分中是否有任何 Kotlin 2.0.10 的预览版本。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68257) 中的相应问题。

## Kotlin 1.9.0−1.9.25

本节涵盖了在 Kotlin 1.9.0−1.9.25 中结束弃用周期并生效的不兼容变更。

### 已弃用用于将 Kotlin 源代码集直接添加到 Kotlin 编译项的 API {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

对 `KotlinCompilation.source` 的访问已弃用。以下代码将产生弃用警告：

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**最佳实践是什么？**

要替换 `KotlinCompilation.source(someSourceSet)`，请从 `KotlinCompilation` 的默认源代码集添加 `dependsOn` 关系到 `someSourceSet`。我们建议使用 `by getting` 直接引用源代码，这样更短且更具可读性。但是，您也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，这适用于所有情况。

您可以通过以下方式之一更改上述代码：

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        // 选项 #1. 更短且更具可读性，尽可能使用。
        // 通常，默认源代码集的名称
        // 是目标名称和编译项名称的简单拼接：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 选项 #2. 通用解决方案，如果您的构建脚本需要更高级的方法，请使用它：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.0: 当使用 `KotlinComplation.source` 时引入弃用警告
*   1.9.20: 将此警告升级为错误
*   2.2.0: 从 Kotlin Gradle 插件中移除 `KotlinComplation.source`，尝试使用它将在构建脚本编译项期间导致“未解析引用”错误

### 从 `kotlin-js` Gradle 插件迁移到 `kotlin-multiplatform` Gradle 插件 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件已弃用。基本上，它复制了带有 `js()` 目标的 `kotlin-multiplatform` 插件的功能性，并内部共享相同的实现。这种重叠造成了混淆，并增加了 Kotlin 团队的维护负担。我们鼓励您迁移到带有 `js()` 目标的 `kotlin-multiplatform` Gradle 插件。

**最佳实践是什么？**

1.  如果您使用 `pluginManagement {}` 代码块，请从项目中移除 `kotlin-js` Gradle 插件并在 `settings.gradle.kts` 文件中应用 `kotlin-multiplatform`：

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // Remove the following line:
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // Add the following line instead:
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    </Tabs>

    如果您使用不同的应用插件方式，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html)获取迁移说明。

2.  将您的源代码文件从 `main` 和 `test` 文件夹移动到相同目录中的 `jsMain` 和 `jsTest` 文件夹。
3.  调整依赖项声明：

    *   我们建议使用 `sourceSets {}` 代码块并配置相应源代码集的依赖项，`jsMain {}` 用于生产依赖项，`jsTest {}` 用于测试依赖项。有关更多详细信息，请参阅[添加依赖项](multiplatform-add-dependencies.md)。
    *   但是，如果您想在顶层代码块中声明依赖项，请将声明从 `api("group:artifact:1.0")` 更改为 `add("jsMainApi", "group:artifact:1.0")` 等。

    > 在这种情况下，请确保顶层 `dependencies {}` 代码块位于 `kotlin {}` 代码块**之后**。否则，您将收到“未找到配置”错误。
    >
    {style="note"}

    您可以通过以下方式之一更改您的 `build.gradle.kts` 文件中的代码：

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("js") version "1.9.0"
    }
    
    dependencies {
        testImplementation(kotlin("test"))
        implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
    }
    
    kotlin {
        js {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 选项 #1. 在 sourceSets {} 代码块中声明依赖项：
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // 此处不需要 js 前缀，您可以直接从顶层代码块复制粘贴
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // 选项 #2. 为依赖项声明添加 js 前缀：
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </TabItem>
    </Tabs>

4.  在大多数情况下，`kotlin {}` 代码块中由 Kotlin Gradle 插件提供的 DSL 保持不变。但是，如果您以前通过名称引用低层 Gradle 实体（如任务和配置），您现在需要调整它们，通常通过添加 `js` 前缀。例如，您可以在 `jsBrowserTest` 名称下找到 `browserTest` 任务。

**变更何时生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 插件会产生弃用警告。

### 已弃用 `jvmWithJava` 预设 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

`targetPresets.jvmWithJava` 已弃用，不鼓励使用它。

**最佳实践是什么？**

请改用 `jvm { withJava() }` 目标。请注意，切换到 `jvm { withJava() }` 后，您需要调整包含 `.java` 源代码的目录路径。

例如，如果您使用名为“jvm”的 `jvm` 目标：

| 之前          | 现在                |
|---------------|---------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**变更何时生效？**

以下是计划的弃用周期：

*   1.3.40: 当使用 `targetPresets.jvmWithJava` 时引入警告
*   1.9.20: 将此警告升级为错误
*   >1.9.20: 移除 `targetPresets.jvmWithJava` API；尝试使用它将导致构建脚本编译项失败

> 尽管整个 `targetPresets` API 已弃用，但 `jvmWithJava` 预设具有不同的弃用时间线。
>
{style="note"}

### 已弃用传统 Android 源代码集布局 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

[新的 Android 源代码集布局](multiplatform-android-layout.md)自 Kotlin 1.9.0 起默认使用。对传统布局的支持已弃用，并且使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 属性现在会触发弃用诊断。

**变更何时生效？**

以下是计划的弃用周期：

*   <=1.9.0: 当使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 时报告警告；此警告可以通过 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 属性抑制
*   1.9.20: 将此警告升级为错误；该错误**无法**抑制
*   >1.9.20: 移除对 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支持；Kotlin Gradle 插件将忽略该属性

### 已弃用带有自定义 `dependsOn` 的 `commonMain` 和 `commonTest` {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

`commonMain` 和 `commonTest` 源代码集通常分别代表 `main` 和 `test` 源代码集层级的根。然而，通过手动配置这些源代码集的 `dependsOn` 关系，可以覆盖这一点。

维护此类配置需要额外精力以及多平台构建内部知识。此外，它会降低代码可读性和可重用性，因为您需要阅读特定的构建脚本才能确定 `commonMain` 是否是 `main` 源代码集层级的根。

因此，对 `commonMain` 和 `commonTest` 上的 `dependsOn` 的访问现已弃用。

**最佳实践是什么？**

假设您需要将使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` 源代码集迁移到 1.9.20。在大多数情况下，`customCommonMain` 参与的编译项与 `commonMain` 相同，因此您可以将 `customCommonMain` 合并到 `commonMain`：

1.  将 `customCommonMain` 的源代码复制到 `commonMain` 中。
2.  将 `customCommonMain` 的所有依赖项添加到 `commonMain`。
3.  将 `customCommonMain` 的所有编译器选项设置添加到 `commonMain`。

在少数情况下，`customCommonMain` 可能参与比 `commonMain` 更多的编译项。这样的配置需要额外的低层构建脚本配置。如果您不确定这是否是您的用例，那么它很可能不是。

如果是您的用例，请通过将 `customCommonMain` 的源代码和设置移动到 `commonMain`，反之亦然，来“交换”这两个源代码集。

**变更何时生效？**

以下是计划的弃用周期：

*   1.9.0: 在 `commonMain` 中使用 `dependsOn` 时报告警告
*   >=1.9.20: 当在 `commonMain` 或 `commonTest` 中使用 `dependsOn` 时报告错误

### 前向声明的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

JetBrains 团队改进了 Kotlin 中前向声明的方法，以使其行为更可预测：

*   您只能使用 `cnames` 或 `objcnames` 包导入前向声明。
*   您需要显式进行到和从相应的 C 和 Objective-C 前向声明的类型转换。

**最佳实践是什么？**

*   考虑一个带有 `library.package` 的 C 库，它声明了一个 `cstructName` 前向声明。以前，可以直接从库中导入它，使用 `import library.package.cstructName`。现在，您只能为此使用一个特殊的前向声明包：`import cnames.structs.cstructName`。对于 `objcnames` 也是如此。

*   考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一个具有实际定义：

    ```ObjC
    // First objcinterop library
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // Second objcinterop library
    // Header:
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // Implementation:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前，可以在它们之间无缝地传输对象。现在，对于前向声明，需要显式 `as` 类型转换：

    ```kotlin
    // Kotlin code:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > 您只能从相应的实际类转换为 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
    > 否则，您将收到错误。
    >
    {style="note"}

**变更何时生效？**

从 Kotlin 1.9.20 开始，您需要显式进行到和从相应的 C 和 Objective-C 前向声明的类型转换。此外，现在只能通过使用特殊包来导入前向声明。

## Kotlin 1.7.0−1.8.22

本节涵盖了在 Kotlin 1.7.0−1.8.22 中结束弃用周期并生效的不兼容变更。

### 已弃用与 Kotlin Multiplatform Gradle 插件和 Gradle Java 插件的兼容性 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

由于 Kotlin Multiplatform Gradle 插件与 Gradle 插件 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 之间的兼容性问题，当您将这些插件应用到同一个项目时，现在会收到弃用警告。当您的多平台项目中的另一个 Gradle 插件应用了 Gradle Java 插件时，也会出现此警告。例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动应用 Application 插件。

我们添加此弃用警告是由于 Kotlin Multiplatform 的项目模型与 Gradle 的 Java 生态系统插件之间存在根本性的兼容性问题。Gradle 的 Java 生态系统插件目前未考虑到其他插件可能：

*   也以与 Java 生态系统插件不同的方式为 JVM 目标发布或编译。
*   在同一个项目中有两个不同的 JVM 目标，例如 JVM 和 Android。
*   拥有复杂的多平台项目结构，可能包含多个非 JVM 目标。

不幸的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们以前在 Kotlin Multiplatform 中使用了一些临时解决方案来帮助集成 Java 生态系统插件。然而，这些临时解决方案从未真正解决兼容性问题，并且自 Gradle 8.8 发布以来，这些临时解决方案已不再可能。有关更多信息，请参阅我们的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们尚不清楚如何精确解决此兼容性问题，但我们致力于继续支持您的 Kotlin Multiplatform 项目中某种形式的 Java 源代码编译。至少，我们将支持 Java 源代码的编译以及在您的多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

**最佳实践是什么？**

如果您在多平台项目中看到此弃用警告，我们建议您：
1.  确定您的项目中是否实际需要 Gradle Java 插件。如果不需要，请考虑移除它。
2.  检查 Gradle Java 插件是否仅用于单个任务。如果是，您可能可以不费太多力气就移除该插件。例如，如果任务使用 Gradle Java 插件创建 Javadoc JAR 文件，您可以手动定义 Javadoc 任务。

否则，如果您想在多平台项目中使用 Kotlin Multiplatform Gradle 插件和这些用于 Java 的 Gradle 插件，我们建议您：

1.  在您的 Gradle 项目中创建一个单独的子项目。
2.  在单独的子项目中，应用 Gradle Java 插件。
3.  在单独的子项目中，添加对父多平台项目的依赖项。

> 单独的子项目**不得**是多平台项目，并且您只能使用它来设置对您的多平台项目的依赖项。
>
{style="warning"}

例如，您有一个名为 `my-main-project` 的多平台项目，并且您想使用 [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle 插件。

一旦您创建了一个子项目，我们称之为 `subproject-A`，您的父项目结构应该像这样：

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在您子项目的 `build.gradle.kts` 文件中，在 `plugins {}` 代码块中应用 Java Library 插件：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</TabItem>
</Tabs>

在您子项目的 `build.gradle.kts` 文件中，添加对父多平台项目的依赖项：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // The name of your parent multiplatform project
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // The name of your parent multiplatform project
}
```

</TabItem>
</Tabs>

您的父项目现在已设置为与这两个插件一起工作。

### 自动生成目标的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

由 Gradle 自动生成的目标访问器在 `kotlin.targets {}` 代码块内不再可用。请改用 `findByName("targetName")` 方法。

请注意，此类访问器在 `kotlin.targets {}` 情况下仍然可用，例如 `kotlin.targets.linuxX64`。

**最佳实践是什么？**

<table>
    
<tr>
<td>之前</td>
        <td>现在</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure(['windows',&#10;            'linux']) {&#10;        }&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure([findByName('windows'),&#10;            findByName('linux')]) {&#10;        }&#10;    }&#10;}"/>
</td>
</tr>

</table>

**变更何时生效？**

在 Kotlin 1.7.20 中，当在 `kotlin.targets {}` 代码块中使用目标访问器时，会引入错误。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47047) 中的相应问题。

### Gradle 输入和输出编译任务的变更 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

Kotlin 编译任务不再继承具有 `sourceCompatibility` 和 `targetCompatibility` 输入的 Gradle `AbstractCompile` 任务，导致它们在 Kotlin 用户脚本中不可用。

编译任务中的其他破坏性变更：

**最佳实践是什么？**

| 之前                                                              | 现在                                                                                                           |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 输入不再可用。        | 请改用 `sources` 输入。此外，`setSource()` 方法仍然可用。                          |
| `sourceFilesExtensions` 输入已移除。                      | 编译任务仍然实现了 `PatternFilterable` 接口。请使用其方法过滤 Kotlin 源代码。 |
| `Gradle destinationDir: File` 输出已弃用。            | 请改用 `destinationDirectory: DirectoryProperty` 输出。                                              |
| `KotlinCompile` 任务的 `classpath` 属性已弃用。 | 所有编译任务现在都使用 `libraries` 输入来获取编译所需的库列表。              |

**变更何时生效？**

在 Kotlin 1.7.20 中，输入不可用，输出已替换，并且 `classpath` 属性已弃用。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-32805) 中的相应问题。

### 编译项依赖项的新配置名称 {initial-collapse-state="collapsed" collapsible="true"}

**有何变更？**

由 Kotlin Multiplatform Gradle 插件创建的编译项配置获得了新名称。

Kotlin Multiplatform 项目中的一个目标有两个默认编译项：`main` 和 `test`。每个编译项都有其自身的默认源代码集，例如 `jvmMain` 和 `jvmTest`。以前，测试编译项及其默认源代码集的配置名称相同，这可能导致名称冲突，从而在标记有平台特有属性的配置包含在另一个配置中时产生问题。

现在编译项配置有一个额外的 `Compilation` 后缀，而使用旧的硬编码配置名称的项目和插件将不再编译。

相应源代码集的依赖项配置名称保持不变。

**最佳实践是什么？**

<table>
    
<tr>
<td></td>
        <td>之前</td>
        <td>现在</td>
</tr>

    
<tr>
<td rowspan="2"><code>jvmMain</code> 编译项的依赖项</td>
<td>
<code-block lang="kotlin" code="jvm&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmCompilationImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
</tr>

    
<tr>
<td><code>jvmMain</code> 源代码集的依赖项</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmMain&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 编译项的依赖项</td>
<td>
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmTestCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 源代码集的依赖项</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
</tr>

</table>

可用的作用域包括 `Api`、`Implementation`、`CompileOnly` 和 `RuntimeOnly`。

**变更何时生效？**

在 Kotlin 1.8.0 中，当在硬编码字符串中使用旧配置名称时，会引入错误。

有关更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-35916/) 中的相应问题。