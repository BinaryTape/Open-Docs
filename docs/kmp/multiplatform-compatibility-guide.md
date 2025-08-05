[//]: # (title: Kotlin Multiplatform 兼容性指南)

<show-structure depth="1"/>

本指南总结了您在开发 Kotlin Multiplatform 项目时可能遇到的[不兼容变更](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)。

当前 Kotlin 的稳定版本是 %kotlinVersion%。请注意特定变更的废弃周期与您项目中 Kotlin 版本的关系，例如：

*   从 Kotlin 1.7.0 升级到 Kotlin 1.9.0 时，请同时检查在 [Kotlin 1.9.0–1.9.25](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0–1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不兼容变更。
*   从 Kotlin 1.9.0 升级到 Kotlin 2.0.0 时，请同时检查在 [Kotlin 2.0.0 及更高版本](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0–1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不兼容变更。

## 版本兼容性

配置项目时，请检查特定版本的 Kotlin Multiplatform Gradle 插件（与您项目中的 Kotlin 版本相同）与 Gradle、Xcode 和 Android Gradle 插件版本的兼容性：

| Kotlin Multiplatform 插件版本 | Gradle                                | Android Gradle 插件                               | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0                               | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 及更早版本。
> Gradle 版本 8.7–8.10 也受支持，但有一个例外：如果您在 JVM 目标平台中调用 `withJava()` 函数时使用 Kotlin Multiplatform Gradle 插件，您可能会在多平台项目中看到废弃警告。
> 关于更多信息，请参见 [默认创建的 Java 源代码集](#java-source-sets-created-by-default)。
>
{style="warning"}

## Kotlin 2.0.0 及更高版本

本节涵盖了结束废弃周期并在 Kotlin 2.0.0−%kotlinVersion% 中生效的不兼容变更。

### 废弃的 Bitcode 嵌入

**有哪些变更？**

在 Xcode 14 中，Bitcode 嵌入已被废弃，并在 Xcode 15 中针对所有 Apple 目标平台移除。相应地，用于 framework 配置的 `embedBitcode` 形参，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令行实参在 Kotlin 中被废弃。

**现在最佳实践是什么？**

如果您仍使用早期版本的 Xcode 但想升级到 Kotlin 2.0.20 或更高版本，请在 Xcode 项目中禁用 Bitcode 嵌入。

**变更何时生效？**

以下是计划的废弃周期：

*   2.0.20：Kotlin/Native 编译器不再支持 Bitcode 嵌入
*   2.1.0：Kotlin Multiplatform Gradle 插件中的 `embedBitcode` DSL 被废弃并发出警告
*   2.2.0：警告升级为错误
*   2.3.0：`embedBitcode` DSL 被移除

<anchor name="java-source-set-created-by-default"/>
### 默认创建的 Java 源代码集

**有哪些变更？**

为了使 Kotlin Multiplatform 与 Gradle 即将到来的变更保持一致，我们正在逐步淘汰 `withJava()` 函数。`withJava()` 函数通过创建必要的 Java 源代码集来启用与 Gradle Java 插件的集成。从 Kotlin 2.1.20 开始，这些 Java 源代码集默认创建。

**现在最佳实践是什么？**

以前，您必须显式使用 `withJava()` 函数来创建 `src/jvmMain/java` 和 `src/jvmTest/java` 源代码集：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

从 Kotlin 2.1.20 开始，您可以从构建脚本中移除 `withJava()` 函数。

此外，Gradle 现在只有在 Java 源代码存在时才会运行 Java 编译任务，这会触发以前未运行的 JVM 验证诊断。如果您为 `KotlinJvmCompile` 任务或在 `compilerOptions` 内部显式配置了不兼容的 JVM 目标平台，此诊断将失败。有关确保 JVM 目标平台兼容性的指导，请参见 [检测相关编译任务的 JVM 目标平台兼容性](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果您的项目使用高于 8.7 的 Gradle 版本，并且不依赖于 Gradle Java 插件，例如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)，或者依赖于 Gradle Java 插件的第三方 Gradle 插件，您可以移除 `withJava()` 函数。

如果您的项目使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 插件，我们建议迁移到[新的实验性 DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。从 Gradle 8.7 开始，Application 插件将不再与 Kotlin Multiplatform Gradle 插件一起工作。

如果您想在多平台项目中使用 Kotlin Multiplatform Gradle 插件和其他 Gradle Java 插件，请参见 [Kotlin Multiplatform Gradle 插件与 Gradle Java 插件的兼容性已废弃](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果您在 Kotlin 2.1.20 和高于 8.7 的 Gradle 版本中使用 [Java test fixtures](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 插件，该插件将无法工作。请升级到 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)，该问题已在此版本中解决。

如果您遇到任何问题，请在我们的[问题跟踪器](https://kotl.in/issue)中报告，或在我们的[公共 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681)中寻求帮助。

**变更何时生效？**

以下是计划的废弃周期：

*   Gradle >8.6：在使用 `withJava()` 函数的多平台项目中，为任何先前版本的 Kotlin 引入废弃警告。
*   Gradle 9.0：将此警告升级为错误。
*   2.1.20：在使用 `withJava()` 函数时，针对任何 Gradle 版本引入废弃警告。

<anchor name="android-target-rename"/>
### 将 `android` 目标平台重命名为 `androidTarget`

**有哪些变更？**

我们继续致力于使 Kotlin Multiplatform 更加稳定。朝着这个方向迈出的重要一步是为 Android 目标平台提供一等公民支持。未来，这种支持将通过 Google Android 团队开发的独立插件提供。

为了为新方案铺平道路，我们正在当前 Kotlin DSL 中将 `android` 代码块重命名为 `androidTarget`。这是一个临时变更，为了即将到来的 Google DSL 能够使用 `android` 这个简短名称。

**现在最佳实践是什么？**

将所有 `android` 代码块的出现重命名为 `androidTarget`。当 Android 目标平台支持的新插件可用时，请迁移到 Google 的 DSL。这将是 Kotlin Multiplatform 项目中与 Android 协作的首选选项。

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.0：在 Kotlin Multiplatform 项目中使用 `android` 名称时引入废弃警告
*   2.1.0：将此警告升级为错误
*   2.2.0：从 Kotlin Multiplatform Gradle 插件中移除 `android` 目标平台 DSL

<anchor name="declaring-multiple-targets"/>
### 声明多个类似目标平台

**有哪些变更？**

我们不鼓励在单个 Gradle 项目中声明多个类似目标平台。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 不推荐，并会产生废弃警告
}
```

一个常见的情况是同时拥有两段相关的代码。例如，您可能希望在 `:shared` Gradle 项目中使用 `jvm("jvmKtor")` 和 `jvm("jvmOkHttp")`，以使用 Ktor 或 OkHttp 库实现网络功能：

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
                // 共享依赖项
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor 依赖项
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp 依赖项
            }
        }
    }
}
```

该实现带来了不小的配置复杂性：

*   您必须在 `:shared` 端和每个消费者的端设置 Gradle 属性。否则，Gradle 无法在此类项目中解析依赖项，因为没有额外信息，不清楚消费者应该接收基于 Ktor 还是基于 OkHttp 的实现。
*   您必须手动设置 `commonJvmMain` 源代码集。
*   配置涉及大量底层 Gradle 和 Kotlin Gradle 插件的抽象和 API。

**现在最佳实践是什么？**

配置之所以复杂，是因为基于 Ktor 和基于 OkHttp 的实现位于**同一个 Gradle 项目**中。在许多情况下，可以将这些部分提取到独立的 Gradle 项目中。以下是此类重构的一般概述：

1.  用单个目标平台替换原始项目中的两个重复目标平台。如果这些目标平台之间有共享源代码集，请将其源代码和配置移动到新创建目标平台的默认源代码集：

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 将 jvmCommonMain 的配置复制到此处
            }
        }
    }
    ```

2.  添加两个新的 Gradle 项目，通常通过在 `settings.gradle.kts` 文件中调用 `include` 来完成。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  配置每个新的 Gradle 项目：

    *   您很可能不需要应用 `kotlin("multiplatform")` 插件，因为这些项目只编译到一个目标平台。在此示例中，您可以应用 `kotlin("jvm")`。
    *   将原始目标平台特有源代码集的内容移动到其各自的项目中，例如，从 `jvmKtorMain` 移动到 `ktor-impl/src`。
    *   复制源代码集的配置：依赖项、编译选项等。
    *   从新 Gradle 项目向原始项目添加依赖项。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 添加对原始项目的依赖项
        // 将 jvmKtorMain 的依赖项复制到此处
    }
    
    kotlin {
        compilerOptions {
            // 将 jvmKtorMain 的编译选项复制到此处
        }
    }
    ```

尽管这种方法在初始设置时需要更多工作，但它不使用任何 Gradle 和 Kotlin Gradle 插件的底层实体，从而使生成的构建更易于使用和维护。

> 遗憾的是，我们无法为每种情况提供详细的迁移步骤。如果以上说明对您不起作用，请在此 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-59316) 中描述您的用例。
>
{style="tip"}

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.20：在 Kotlin Multiplatform 项目中使用多个类似目标平台时引入废弃警告
*   2.1.0：在此类情况下报告错误，Kotlin/JS 目标平台除外；有关此例外的更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的问题

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 废弃对以传统模式发布的跨平台库的支持

**有哪些变更？**

此前，我们[已废弃](#deprecated-gradle-properties-for-hierarchical-structure-support) Kotlin Multiplatform 项目中的传统模式，阻止发布“传统”二进制文件，并鼓励您将项目迁移到[分层结构](multiplatform-hierarchy.md)。

为了继续淘汰生态系统中的“传统”二进制文件，从 Kotlin 1.9.0 开始，也不鼓励使用传统库。如果您的项目依赖于传统库，您将看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**现在最佳实践是什么？**

_如果您使用多平台库_，其中大多数已迁移到“分层结构”模式，因此您只需要更新库版本。有关详细信息，请参见相应库的文档。

如果库尚未支持非传统二进制文件，您可以联系维护者并告知他们此兼容性问题。

_如果您是库作者_，请将 Kotlin Gradle 插件更新到最新版本，并确保已修复[废弃的 Gradle 属性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 团队渴望帮助生态系统进行迁移，因此如果您遇到任何问题，请随时在 [YouTrack](https://kotl.in/issue) 中创建问题。

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.0：为传统库的依赖项引入废弃警告
*   2.0.0：将传统库依赖项的警告升级为错误
*   >2.0.0：移除对传统库依赖项的支持；使用此类依赖项可能导致构建失败

<anchor name="deprecate-hmpp-properties"/>
### 废弃用于支持分层结构的 Gradle 属性

**有哪些变更？**

在 Kotlin Multiplatform 发展的早期阶段，逐步引入了对多平台项目中[分层结构](multiplatform-hierarchy.md)的支持，即在公共源代码集 `commonMain` 和任何平台特有源代码集（例如 `jvmMain`）之间拥有中间源代码集的能力。

在过渡期间，当工具链不够稳定时，引入了几个 Gradle 属性，允许进行细粒度的选用和弃用。

自 Kotlin 1.6.20 以来，分层项目结构支持已默认启用。然而，这些属性仍然保留，以便在出现阻塞性问题时进行选择退出。在处理完所有反馈后，我们现在开始完全淘汰这些属性。

以下属性现已废弃：

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**现在最佳实践是什么？**

*   从您的 `gradle.properties` 和 `local.properties` 文件中移除这些属性。
*   避免在 Gradle 构建脚本或 Gradle 插件中以编程方式设置它们。
*   如果废弃属性是由您构建中使用的某些第三方 Gradle 插件设置的，请要求插件维护者不要设置这些属性。

由于自 Kotlin 1.6.20 以来，Kotlin 工具链的默认行为不包含此类属性，因此我们预计不会产生任何严重影响。大多数后果将在项目重建后立即显现。

如果您是库作者并希望格外安全，请检测消费者是否可以与您的库一起工作。

**变更何时生效？**

以下是计划的废弃周期：

*   1.8.20：在使用废弃的 Gradle 属性时报告警告
*   1.9.20：将此警告升级为错误
*   2.0.0：移除废弃属性；Kotlin Gradle 插件将忽略其使用

万一您在移除这些属性后遇到问题，请在 [YouTrack](https://kotl.in/issue) 中创建问题。

<anchor name="target-presets-deprecation"/>
### 废弃的目标平台预设 API

**有哪些变更？**

在 Kotlin Multiplatform 发展的早期阶段，引入了一个用于处理所谓 _目标平台预设_ 的 API。每个目标平台预设本质上代表了 Kotlin Multiplatform 目标平台的工厂。事实证明，这个 API 在很大程度上是多余的，因为 `jvm()` 或 `iosSimulatorArm64()` 等 DSL 函数涵盖了相同的用例，同时更直接和简洁。

为了减少混淆并提供更清晰的指导，所有与预设相关的 API 现已在 Kotlin Gradle 插件的公共 API 中废弃。这包括：

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 属性
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 接口及其所有继承者
*   `fromPreset` 重载

**现在最佳实践是什么？**

请改用相应的 [Kotlin 目标平台](multiplatform-dsl-reference.md#targets)，例如：

<table>
    <tr>
        <td>之前</td>
        <td>现在</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```

</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```

</td>
</tr>
</table>

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.20：报告任何与预设相关的 API 用法警告
*   2.0.0：将此警告升级为错误
*   2.2.0：从 Kotlin Gradle 插件的公共 API 中移除与预设相关的 API；仍然使用它的源代码将因“未解析引用”错误而失败，而二进制文件（例如 Gradle 插件）可能会因链接错误而失败，除非针对最新版本的 Kotlin Gradle 插件重新编译

<anchor name="target-shortcuts-deprecation"/>
### 废弃 Apple 目标平台快捷方式

**有哪些变更？**

我们正在废弃 Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目标平台快捷方式。它们旨在部分创建 Apple 目标平台的源代码集层次结构。然而，它们被证明难以扩展，有时会令人困惑。

例如，`ios()` 快捷方式同时创建了 `iosArm64` 和 `iosX64` 目标平台，但未包含 `iosSimulatorArm64` 目标平台，这在使用 Apple M 芯片的主机上是必需的。然而，更改此快捷方式难以实现，并可能导致现有用户项目出现问题。

**现在最佳实践是什么？**

Kotlin Gradle 插件现在提供了一个内置的层次结构模板。自 Kotlin 1.9.20 起，它默认启用，并包含用于常见用例的预定义中间源代码集。

您应该指定目标平台的列表而不是快捷方式，然后插件会根据此列表自动设置中间源代码集。

例如，如果您的项目中有 `iosArm64` 和 `iosSimulatorArm64` 目标平台，插件会自动创建 `iosMain` 和 `iosTest` 中间源代码集。如果您的项目中有 `iosArm64` 和 `macosArm64` 目标平台，则会创建 `appleMain` 和 `appleTest` 源代码集。

有关更多信息，请参见 [分层项目结构](multiplatform-hierarchy.md)

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.20：在使用 `ios()`、`watchos()` 和 `tvos()` 目标平台快捷方式时报告警告；
    默认的层次结构模板将默认启用
*   2.1.0：在使用目标平台快捷方式时报告错误
*   2.2.0：从 Kotlin Multiplatform Gradle 插件中移除目标平台快捷方式 DSL

### Kotlin 升级后 iOS framework 版本不正确

**问题是什么？**

当使用直接集成时，Kotlin 代码中的变更可能不会反映在 Xcode 中的 iOS 应用中。直接集成是通过 `embedAndSignAppleFrameworkForXcode` 任务设置的，该任务将多平台项目中的 iOS framework 连接到 Xcode 中的 iOS 应用。

当您将多平台项目中的 Kotlin 版本从 1.9.2x 升级到 2.0.0（或从 2.0.0 降级到 1.9.2x）时，然后更改 Kotlin 文件并尝试构建应用，Xcode 可能会错误地使用旧版本的 iOS framework。因此，这些变更在 Xcode 的 iOS 应用中将不可见。

**变通方法是什么？**

1.  在 Xcode 中，使用 **Product** | **Clean Build Folder** 清理构建目录。
2.  在终端中，运行以下命令：

    ```none
    ./gradlew clean
    ```

3.  再次构建应用，以确保使用了新版本的 iOS framework。

**问题何时会修复？**

我们计划在 Kotlin 2.0.10 中修复此问题。您可以在 [参与 Kotlin 抢先体验预览](https://kotlinlang.org/docs/eap.html) 部分检测 Kotlin 2.0.10 的任何预览版是否已可用。

有关更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-68257) 中的相应问题。

## Kotlin 1.9.0−1.9.25

本节涵盖了结束废弃周期并在 Kotlin 1.9.0−1.9.25 中生效的不兼容变更。

<anchor name="compilation-source-deprecation"/>
### 废弃了直接向 Kotlin 编译项添加 Kotlin 源代码集的 API {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

`KotlinCompilation.source` 的访问已被废弃。以下代码会产生废弃警告：

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

**现在最佳实践是什么？**

要替换 `KotlinCompilation.source(someSourceSet)`，请从 `KotlinCompilation` 的默认源代码集添加 `dependsOn` 关系到 `someSourceSet`。我们建议直接使用 `by getting` 来引用源代码，这样更短且更具可读性。但是，您也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，它适用于所有情况。

您可以按以下方式之一更改上述代码：

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
        
        // 选项 #1。更短且更具可读性，尽可能使用。
        // 通常，默认源代码集的名称
        // 是目标平台名称和编译项名称的简单连接：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 选项 #2。通用解决方案，如果您的构建脚本需要更高级的方法，请使用：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.0：在使用 `KotlinCompilation.source` 时引入废弃警告
*   1.9.20：将此警告升级为错误
*   2.2.0：从 Kotlin Gradle 插件中移除 `KotlinCompilation.source`，尝试使用它会导致构建脚本编译期间的“未解析引用”错误

<anchor name="kotlin-js-plugin-deprecation"/>
### 从 `kotlin-js` Gradle 插件迁移到 `kotlin-multiplatform` Gradle 插件 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件已废弃。它本质上是复制了带有 `js()` 目标平台的 `kotlin-multiplatform` 插件的功能，并在底层共享相同的实现。这种重叠造成了混淆，并增加了 Kotlin 团队的维护负担。我们鼓励您迁移到带有 `js()` 目标平台的 `kotlin-multiplatform` Gradle 插件。

**现在最佳实践是什么？**

1.  从项目中移除 `kotlin-js` Gradle 插件，并在 `settings.gradle.kts` 文件中应用 `kotlin-multiplatform`，如果您使用的是 `pluginManagement {}` 代码块：

    <tabs>
    <tab title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 移除以下行：
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 代替添加以下行：
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </tab>
    </tabs>

    如果您使用不同的方式应用插件，请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html) 获取迁移说明。

2.  将源文件从 `main` 和 `test` 文件夹移动到同一目录下的 `jsMain` 和 `jsTest` 文件夹。
3.  调整依赖项声明：

    *   我们建议使用 `sourceSets {}` 代码块并配置相应源代码集的依赖项，`jsMain {}` 用于生产依赖项，`jsTest {}` 用于测试依赖项。
        有关更多详细信息，请参见 [添加依赖项](multiplatform-add-dependencies.md)。
    *   但是，如果您想在顶层代码块中声明依赖项，请将声明从 `api("group:artifact:1.0")` 更改为 `add("jsMainApi", "group:artifact:1.0")` 等。

        > 在这种情况下，请确保顶层 `dependencies {}` 代码块位于 `kotlin {}` 代码块**之后**。否则，您将收到“Configuration not found”错误。
        >
        {style="note"}

    您可以按以下方式之一更改 `build.gradle.kts` 文件中的代码：

    <tabs>
    <tab title="kotlin-js">

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

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 选项 #1。在 sourceSets {} 代码块中声明依赖项：
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // 这里不需要 js 前缀，您可以直接从顶层代码块复制粘贴
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // 选项 #2。为依赖项声明添加 js 前缀：
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </tab>
    </tabs>

4.  Kotlin Gradle 插件在 `kotlin {}` 代码块中提供的 DSL 在大多数情况下保持不变。但是，如果您通过名称引用了底层 Gradle 实体，例如任务和配置，您现在需要调整它们，通常通过添加 `js` 前缀。例如，您可以在 `jsBrowserTest` 名称下找到 `browserTest` 任务。

**变更何时生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 插件会产生废弃警告。

<anchor name="jvmWithJava-preset-deprecation"/>
### 废弃的 `jvmWithJava` 预设 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

`targetPresets.jvmWithJava` 已废弃，不鼓励使用。

**现在最佳实践是什么？**

请改用 `jvm { withJava() }` 目标平台。请注意，切换到 `jvm { withJava() }` 后，您需要调整 `.java` 源文件的路径。

例如，如果您使用默认名称为“jvm”的 `jvm` 目标平台：

| 之前          | 现在                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**变更何时生效？**

以下是计划的废弃周期：

*   1.3.40：在使用 `targetPresets.jvmWithJava` 时引入警告
*   1.9.20：将此警告升级为错误
*   >1.9.20：移除 `targetPresets.jvmWithJava` API；尝试使用它会导致构建脚本编译失败

> 尽管整个 `targetPresets` API 都已废弃，但 `jvmWithJava` 预设具有不同的废弃时间线。
>
{style="note"}

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 废弃的传统 Android 源代码集布局 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

自 Kotlin 1.9.0 起，[新的 Android 源代码集布局](multiplatform-android-layout.md) 默认使用。对传统布局的支持已废弃，使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 属性现在会触发废弃诊断。

**变更何时生效？**

以下是计划的废弃周期：

*   <=1.9.0：在使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 时报告警告；可以通过 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 属性抑制警告
*   1.9.20：将此警告升级为错误；该错误**无法**抑制
*   >1.9.20：移除对 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支持；Kotlin Gradle 插件将忽略该属性

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 废弃带有自定义 `dependsOn` 的 `commonMain` 和 `commonTest` {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

`commonMain` 和 `commonTest` 源代码集通常分别代表 `main` 和 `test` 源代码集层次结构的根。然而，可以通过手动配置这些源代码集的 `dependsOn` 关系来覆盖这一点。

维护此类配置需要额外的精力和对多平台构建内部机制的了解。此外，它降低了代码的可读性和可重用性，因为您需要阅读特定的构建脚本才能确定 `commonMain` 是否是 `main` 源代码集层次结构的根。

因此，访问 `commonMain` 和 `commonTest` 上的 `dependsOn` 现已废弃。

**现在最佳实践是什么？**

假设您需要将使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` 源代码集迁移到 1.9.20。在大多数情况下，`customCommonMain` 参与的编译项与 `commonMain` 相同，因此您可以将 `customCommonMain` 合并到 `commonMain` 中：

1.  将 `customCommonMain` 的源代码复制到 `commonMain` 中。
2.  将 `customCommonMain` 的所有依赖项添加到 `commonMain` 中。
3.  将 `customCommonMain` 的所有编译选项设置添加到 `commonMain` 中。

在极少数情况下，`customCommonMain` 可能参与的编译项比 `commonMain` 更多。
这种配置需要构建脚本的额外底层配置。如果您不确定这是否是您的用例，那么很可能不是。

如果是您的用例，请通过将 `customCommonMain` 的源代码和设置移动到 `commonMain`，反之亦然，来“交换”这两个源代码集。

**变更何时生效？**

以下是计划的废弃周期：

*   1.9.0：在使用 `commonMain` 中的 `dependsOn` 时报告警告
*   >=1.9.20：在使用 `commonMain` 或 `commonTest` 中的 `dependsOn` 时报告错误

### 前向声明的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

JetBrains 团队改进了 Kotlin 中前向声明的方法，以使其行为更可预测：

*   您只能使用 `cnames` 或 `objcnames` 包导入前向声明。
*   您需要显式地向相应的 C 和 Objective-C 前向声明进行转换。

**现在最佳实践是什么？**

*   考虑一个带有 `library.package` 并声明 `cstructName` 前向声明的 C 库。
    以前，可以直接从库中导入它：`import library.package.cstructName`。
    现在，您只能为此使用特殊的前向声明包：`import cnames.structs.cstructName`。
    `objcnames` 也是如此。

*   考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一个具有实际定义：

    ```ObjC
    // 第一个 objcinterop 库
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // 第二个 objcinterop 库
    // 头文件:
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // 实现:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前，可以无缝地在它们之间传输对象。现在，前向声明需要显式 `as` 转换：

    ```kotlin
    // Kotlin 代码:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > 您只能将 `objcnames.protocols.ForwardDeclaredProtocolProtocol` 转换成相应的真实类。
    > 否则，您将收到错误。
    >
    {style="note"}

**变更何时生效？**

从 Kotlin 1.9.20 开始，您需要显式地向相应的 C 和 Objective-C 前向声明进行转换。此外，现在只能通过使用特殊包来导入前向声明。

## Kotlin 1.7.0−1.8.22

本节涵盖了结束废弃周期并在 Kotlin 1.7.0−1.8.22 中生效的不兼容变更。

<anchor name="deprecated-compatibility-with-kmp-gradle-plugin-and-gradle-java-plugins"/>
### 废弃 Kotlin Multiplatform Gradle 插件与 Gradle Java 插件的兼容性 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

由于 Kotlin Multiplatform Gradle 插件与 Gradle 插件 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 之间存在兼容性问题，当您将这些插件应用于同一个项目时，现在会显示废弃警告。当多平台项目中的另一个 Gradle 插件应用 Gradle Java 插件时，警告也会出现。例如，[Spring Boot Gradle Plugin](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 会自动应用 Application 插件。

我们添加此废弃警告是由于 Kotlin Multiplatform 的项目模型与 Gradle 的 Java 生态系统插件之间存在根本性的兼容性问题。Gradle 的 Java 生态系统插件目前没有考虑到其他插件可能：

*   也以与 Java 生态系统插件不同的方式发布或编译 JVM 目标平台。
*   在同一个项目中有两个不同的 JVM 目标平台，例如 JVM 和 Android。
*   具有复杂的多平台项目结构，可能包含多个非 JVM 目标平台。

不幸的是，Gradle 目前没有提供任何 API 来解决这些问题。

我们之前在 Kotlin Multiplatform 中使用了一些变通方法来帮助集成 Java 生态系统插件。然而，这些变通方法从未真正解决兼容性问题，自 Gradle 8.8 发布以来，这些变通方法已不再可能。有关更多信息，请参见我们的 [YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

虽然我们尚不清楚确切如何解决此兼容性问题，但我们致力于继续支持在 Kotlin Multiplatform 项目中某种形式的 Java 源文件编译。至少，我们将支持 Java 源文件的编译以及在多平台项目中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 插件。

**现在最佳实践是什么？**

如果您的多平台项目出现此废弃警告，我们建议您：
1.  确定您是否确实需要在项目中使用 Gradle Java 插件。如果不需要，请考虑将其移除。
2.  检测 Gradle Java 插件是否仅用于单个任务。如果是这样，您可能无需太多精力即可移除该插件。例如，如果任务使用 Gradle Java 插件来创建 Javadoc JAR 文件，您可以手动定义 Javadoc 任务。

否则，如果您想在多平台项目中使用 Kotlin Multiplatform Gradle 插件和这些 Gradle Java 插件，我们建议您：

1.  在 Gradle 项目中创建一个单独的子项目。
2.  在单独的子项目中，应用 Gradle Java 插件。
3.  在单独的子项目中，添加对父级多平台项目的依赖项。

> 单独的子项目**不得**是多平台项目，您只能使用它来设置对多平台项目的依赖项。
>
{style="warning"}

例如，您有一个名为 `my-main-project` 的多平台项目，并且您想使用 [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle 插件。

创建子项目后，我们将其命名为 `subproject-A`，您的父级项目结构应如下所示：

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在子项目的 `build.gradle.kts` 文件中，在 `plugins {}` 代码块中应用 Java Library 插件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</tab>
</tabs>

在子项目的 `build.gradle.kts` 文件中，添加对父级多平台项目的依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 您的父级多平台项目的名称
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 您的父级多平台项目的名称
}
```

</tab>
</tabs>

您的父级项目现在已设置为可以同时使用这两个插件。

### 自动生成目标平台的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

Gradle 自动生成的目标平台访问器在 `kotlin.targets {}` 代码块中不再可用。请改用 `findByName("targetName")` 方法。

请注意，此类访问器在 `kotlin.targets {}` 情况下仍然可用，例如 `kotlin.targets.linuxX64`。

**现在最佳实践是什么？**

<table>
    <tr>
        <td>之前</td>
        <td>现在</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

**变更何时生效？**

在 Kotlin 1.7.20 中，在使用 `kotlin.targets {}` 代码块中的目标平台访问器时会引入错误。

有关更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47047) 中的相应问题。

### Gradle 输入和输出编译任务的变更 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

Kotlin 编译任务不再继承具有 `sourceCompatibility` 和 `targetCompatibility` 输入的 Gradle `AbstractCompile` 任务，使其在 Kotlin 用户脚本中不可用。

编译任务中的其他破坏性变更：

**现在最佳实践是什么？**

| 之前                                                              | 现在                                                                                                           |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 输入不再可用。        | 请改用 `sources` 输入。此外，`setSource()` 方法仍然可用。                         |
| `sourceFilesExtensions` 输入已移除。                      | 编译任务仍实现 `PatternFilterable` 接口。使用其方法过滤 Kotlin 源代码。 |
| `Gradle destinationDir: File` 输出已废弃。            | 请改用 `destinationDirectory: DirectoryProperty` 输出。                                             |
| `KotlinCompile` 任务的 `classpath` 属性已废弃。 | 所有编译任务现在都使用 `libraries` 输入作为编译所需的库列表。              |

**变更何时生效？**

在 Kotlin 1.7.20 中，输入不可用，输出被替换，并且 `classpath` 属性被废弃。

有关更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-32805) 中的相应问题。

### 编译项依赖项的新配置名称 {initial-collapse-state="collapsed" collapsible="true"}

**有哪些变更？**

Kotlin Multiplatform Gradle 插件创建的编译项配置接收了新名称。

Kotlin Multiplatform 项目中的目标平台有两个默认编译项：`main` 和 `test`。每个编译项都有自己的默认源代码集，例如 `jvmMain` 和 `jvmTest`。以前，测试编译项及其默认源代码集的配置名称相同，这可能导致名称冲突，从而在将带有平台特有属性的配置包含到另一个配置中时引发问题。

现在，编译项配置具有额外的 `Compilation` 后缀，而使用旧硬编码配置名称的项目和插件将不再编译。

对应源代码集依赖项的配置名称保持不变。

**现在最佳实践是什么？**

<table>
    <tr>
        <td></td>
        <td>之前</td>
        <td>现在</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code> 编译项的依赖项</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td><code>jvmMain</code> 源代码集的依赖项</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 编译项的依赖项</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 源代码集的依赖项</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

可用作用域包括 `Api`、`Implementation`、`CompileOnly` 和 `RuntimeOnly`。

**变更何时生效？**

在 Kotlin 1.8.0 中，在使用硬编码字符串中的旧配置名称时会引入错误。

有关更多信息，请参见 [YouTrack](https://youtrack.jetbrains.com/issue/KT-35916/) 中的相应问题。