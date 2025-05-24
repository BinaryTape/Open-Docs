---
title: "Kotlin Multiplatform 兼容性指南"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<show-structure depth="1"/>

本指南总结了在使用 Kotlin Multiplatform 开发项目时可能遇到的[不兼容变更](kotlin-evolution-principles#incompatible-changes)。

当前 Kotlin 的稳定版本是 2.1.20。请注意特定变更的弃用周期与你项目中 Kotlin 版本之间的关系，例如：

* 当从 Kotlin 1.7.0 升级到 Kotlin 1.9.0 时，请检查在 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不兼容变更。
* 当从 Kotlin 1.9.0 升级到 Kotlin 2.0.0 时，请检查在 [Kotlin 2.0.0](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不兼容变更。

## 版本兼容性

配置项目时，请检查特定版本的 Kotlin Multiplatform Gradle 插件（与项目中 Kotlin 版本相同）与 Gradle、Xcode 和 Android Gradle 插件版本的兼容性：

| Kotlin Multiplatform 插件版本 | Gradle                                | Android Gradle 插件           | Xcode   |
|-------------------------------------|---------------------------------------|---------------------------------|---------|
| 2.1.20                              | 7.6.3–8.11 | 7.4.2–8.7.2 | 16.0 |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                     | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                       | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                       | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                       | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                       | 15.0    |
:::note
*Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全兼容 Gradle 8.6 及以下版本。
Gradle 8.7–8.10 版本也受支持，但只有一个例外：如果你使用 Kotlin Multiplatform Gradle 插件，
你可能会在多平台项目中调用 JVM 目标中的 `withJava()` 函数时看到弃用警告。
更多信息，请参阅[默认创建的 Java source set](#java-source-sets-created-by-default)。

## Kotlin 2.0.0 及更高版本

本节涵盖 Kotlin 2.0.0−2.1.20 中结束弃用周期并生效的不兼容变更。

<anchor name="java-source-set-created-by-default"/>
### 默认创建的 Java source set

**发生了什么变化？**

为了使 Kotlin Multiplatform 与 Gradle 即将到来的更改保持一致，我们正在逐步淘汰 `withJava()` 函数。`withJava()`
函数通过创建必要的 Java source set 来实现与 Gradle Java 插件的集成。从 Kotlin 2.1.20 开始，
这些 Java source set 将默认创建。

**现在最佳实践是什么？**

之前，你必须显式使用 `withJava()` 函数来创建 `src/jvmMain/java` 和 `src/jvmTest/java` source set：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

从 Kotlin 2.1.20 开始，你可以从构建脚本中删除 `withJava()` 函数。

此外，Gradle 现在仅在存在 Java 源代码时才运行 Java 编译任务，从而触发以前未运行的 JVM 验证
诊断。如果你为 `KotlinJvmCompile` 任务或在 `compilerOptions` 中显式配置不兼容的 JVM 目标，此诊断会失败。
有关确保 JVM 目标兼容性的指南，请参阅
[检查相关编译任务的 JVM 目标兼容性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果你的项目使用的 Gradle 版本高于 8.7，并且不依赖 Gradle Java 插件，如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)，
或者依赖于 Gradle Java 插件的第三方 Gradle 插件，则可以删除 `withJava()` 函数。

如果你的项目使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 插件，
我们建议迁移到 [新的实验性 DSL](whatsnew2120#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。
从 Gradle 8.7 开始，Application 插件将不再与 Kotlin Multiplatform Gradle 插件一起使用。

如果你想在多平台项目中同时使用 Kotlin Multiplatform Gradle 插件和其他 Gradle Java 插件，请参阅
[与 Kotlin Multiplatform Gradle 插件和 Java 插件的已弃用兼容性](multiplatform-compatibility-guide#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果你遇到任何问题，请在我们的 [issue tracker](https://kotl.in/issue) 中报告，或在我们的 [公共 Slack 频道](https://kotlinlang.slack.com/archives/C19FD9681) 中寻求帮助。

**变更何时生效？**

以下是计划的弃用周期：

* Gradle >8.6：在使用 `withJava()` 函数的多平台项目中，为任何先前版本的 Kotlin 引入弃用警告。
* Gradle 9.0：将此警告提升为错误。
* 2.1.20：在使用任何版本的 Gradle 的情况下使用 `withJava()` 函数时引入弃用警告。

<anchor name="android-target-rename"/>
### 将 `android` 目标重命名为 `androidTarget`

**发生了什么变化？**

我们继续努力使 Kotlin Multiplatform 更加稳定。朝这个方向迈出的重要一步是为 Android 目标提供一流的
支持。将来，此支持将通过 Google 的 Android 团队开发的单独插件提供。

为了给新的解决方案让路，我们正在当前的 Kotlin DSL 中将 `android` 代码块重命名为 `androidTarget`。
这是一个临时更改，对于即将到来的 Google 的 DSL 来说，必须释放简短的 `android` 名称。

**现在最佳实践是什么？**

将所有出现的 `android` 代码块重命名为 `androidTarget`。当新的 Android 目标支持插件
可用时，迁移到 Google 的 DSL。这将是在 Kotlin Multiplatform 项目中使用 Android 的首选选项。

**变更何时生效？**

以下是计划的弃用周期：

* 1.9.0：在 Kotlin Multiplatform 项目中使用 `android` 名称时引入弃用警告
* 2.1.0：将此警告提升为错误
* 2.2.0：从 Kotlin Multiplatform Gradle 插件中删除 `android` 目标 DSL

<anchor name="declaring-multiple-targets"/>
### 声明多个相似的目标

**发生了什么变化？**

我们不鼓励在单个 Gradle 项目中声明多个相似的目标。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 不推荐，并产生弃用警告
}
```

一种常见的情况是将两个相关的代码片段放在一起。例如，你可能想在你的 `:shared` Gradle 项目中使用
`jvm("jvmKtor")` 和 `jvm("jvmOkHttp")` 来使用 Ktor 或 OkHttp 库实现网络：

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

该实现带来了非常复杂的配置：

* 你必须在 `:shared` 端和每个使用者端设置 Gradle 属性（attribute）。否则，Gradle 无法
  在此类项目中解析依赖项，因为如果没有其他信息，则不清楚使用者应接收基于 Ktor 的实现还是基于 OkHttp 的实现。
* 你必须手动设置 `commonJvmMain` source set。
* 该配置涉及一些低级别的 Gradle 和 Kotlin Gradle 插件抽象和 API。

**现在最佳实践是什么？**

配置很复杂，因为基于 Ktor 的实现和基于 OkHttp 的实现
*在同一个 Gradle 项目中*。在许多情况下，可以将这些部分提取到单独的 Gradle 项目中。
以下是此类重构的一般概述：

1. 将原始项目中的两个重复目标替换为单个目标。如果这些目标之间有共享的 source set，
   请将其源代码和配置移动到新创建目标的默认 source set：

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 在此处复制 jvmCommonMain 的配置
            }
        }
    }
    ```

2. 添加两个新的 Gradle 项目，通常通过在 `settings.gradle.kts` 文件中调用 `include`。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3. 配置每个新的 Gradle 项目：

    * 很可能你不需要应用 `kotlin("multiplatform")` 插件，因为这些项目仅编译为一个
      目标。在此示例中，你可以应用 `kotlin("jvm")`。
    * 将特定于原始目标 source set 的内容移动到它们各自的项目，例如，
      从 `jvmKtorMain` 到 `ktor-impl/src`。
    * 复制 source set 的配置：依赖项、编译器选项等。
    * 添加从新 Gradle 项目到原始项目的依赖项。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 添加对原始项目的依赖项
        // 在此处复制 jvmKtorMain 的依赖项
    }
    
    kotlin {
        compilerOptions {
            // 在此处复制 jvmKtorMain 的编译器选项
        }
    }
    ```

虽然此方法需要在初始设置上进行更多工作，但它不使用 Gradle 的任何低级实体和
Kotlin Gradle 插件，从而使其更易于使用和维护生成的构建。

不幸的是，我们无法为每种情况提供详细的迁移步骤。如果以上说明对你不起作用，请在此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-59316) 中描述你的用例。

**变更何时生效？**

以下是计划的弃用周期：

* 1.9.20：在 Kotlin Multiplatform 项目中使用多个相似目标时引入弃用警告
* 2.1.0：在此类情况下报告错误，Kotlin/JS 目标除外；要了解有关此例外的更多信息，请参阅 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的 issue

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 弃用对以旧模式发布的 multiplatform 库的支持

**发生了什么变化？**

之前，我们[已弃用旧模式](deprecated-gradle-properties-for-hierarchical-structure-support)
在 Kotlin Multiplatform 项目中，阻止发布“旧版”二进制文件，并鼓励你将项目迁移到 [分层结构](multiplatform-hierarchy)。

为了继续从生态系统中逐步淘汰“旧版”二进制文件，从 Kotlin 1.9.0 开始，也不鼓励使用旧版库。
如果你的项目使用对旧版库的依赖项，你将看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**现在最佳实践是什么？**

*如果你使用 multiplatform 库*，则大多数库已经迁移到“分层结构”模式，因此你只需要更新库版本即可。
有关详细信息，请参阅相应库的文档。

如果该库尚不支持非旧版二进制文件，你可以联系维护者并告知他们此兼容性问题。

*如果你是库作者*，请将 Kotlin Gradle 插件更新到最新版本，并确保已修复 [已弃用的 Gradle 属性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 团队渴望帮助生态系统迁移，因此如果你遇到任何问题，请随时在 [YouTrack 中创建一个 issue](https://kotl.in/issue)。

**变更何时生效？**

以下是计划的弃用周期：

* 1.9：引入对旧版库的依赖项的弃用警告
* 2.0：将对旧版库的依赖项的警告提升为错误
* &gt;2.0：删除对旧版库的依赖项的支持；使用此类依赖项可能会导致构建失败

<anchor name="deprecate-hmpp-properties"/>
### 已弃用的 Gradle 属性，用于分层结构支持

**发生了什么变化？**

在其发展过程中，Kotlin 逐渐引入了对 [分层结构](multiplatform-hierarchy) 的支持，
在 multiplatform 项目中，能够在公共 source set `commonMain` 和
任何特定于平台的 source set 之间拥有中间 source set，例如 `jvmMain`。

在过渡期间，虽然工具链不够稳定，但引入了一些 Gradle 属性，
允许进行细粒度的选择加入和选择退出。

自 Kotlin 1.6.20 以来，默认情况下已启用分层项目结构支持。但是，这些属性
被保留下来，以便在出现阻塞问题时选择退出。在处理完所有反馈后，我们现在开始逐步淘汰
这些属性。

以下属性现已弃用：

* `kotlin.internal.mpp.hierarchicalStructureByDefault`
* `kotlin.mpp.enableCompatibilityMetadataVariant`
* `kotlin.mpp.hierarchicalStructureSupport`
* `kotlin.mpp.enableGranularSourceSetsMetadata`
* `kotlin.native.enableDependencyPropagation`

**现在最佳实践是什么？**

* 从你的 `gradle.properties` 和 `local.properties` 文件中删除这些属性。
* 避免在 Gradle 构建脚本或 Gradle 插件中以编程方式设置它们。
* 如果已弃用的属性由你的构建中使用的某些第三方 Gradle 插件设置，请要求插件维护者
  不要设置这些属性。

由于 Kotlin 工具链的默认行为自 1.6.20 以来不包含此类属性，因此我们预计
删除它们不会产生任何严重影响。大多数可能产生的影响将在项目重建后立即显现。

如果你是库作者，并且想要格外安全，请检查使用者是否可以使用你的库。

**变更何时生效？**

以下是计划的弃用周期：

* 1.8.20：使用这些属性时报告警告
* 1.9.20：将此警告提升为错误
* 2.0：删除这些属性；Kotlin Gradle 插件忽略它们的使用

在极少数情况下，如果在删除这些属性后遇到一些问题，请在 [YouTrack 中创建一个 issue](https://kotl.in/issue)。

<anchor name="target-presets-deprecation"/>
### 已弃用的目标预设 API

**发生了什么变化？**

在非常早期的开发阶段，Kotlin Multiplatform 引入了一个用于处理所谓的*目标预设*的 API。
每个目标预设本质上代表 Kotlin Multiplatform 目标的工厂。事实证明，此 API 在很大程度上是
多余的，因为像 `jvm()` 或 `iosSimulatorArm64()` 这样的 DSL 函数涵盖了相同的用例，同时更加
简单明了。

为了减少混淆并提供更清晰的指南，现在已弃用所有与预设相关的 API，并将从
Kotlin Gradle 插件的公共 API 中删除。这包括：

* `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 属性
* `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 接口及其所有继承者
* `fromPreset` 重载

**现在最佳实践是什么？**

请改用相应的 [Kotlin 目标](multiplatform-dsl-reference#targets)，例如：
<table>
<tr>
<td>
之前
</td>
<td>
现在
</td>
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

以下是计划的弃用周期：

* 1.9.20：报告任何与预设相关的 API 的使用情况的警告
* 2.0：将此警告提升为错误
* &gt;2.0：从 Kotlin Gradle 插件的公共 API 中删除与预设相关的 API；仍然使用它的源文件将失败
  并显示“无法解析引用”错误，并且二进制文件（例如，Gradle 插件）可能会失败并显示链接错误，
  除非针对最新版本的 Kotlin Gradle 插件重新编译

<anchor name="target-shortcuts-deprecation"/>
### 已弃用的 Apple 目标快捷方式

**发生了什么变化？**

我们正在弃用 Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目标快捷方式。它们旨在
部分创建 Apple 目标的 source set 层次结构。但是，事实证明它们难以扩展，有时会造成混淆。

例如，`ios()` 快捷方式创建了 `iosArm64` 和 `iosX64` 目标，但不包括 `iosSimulatorArm64`
目标，这在使用带有 Apple M 芯片的主机时是必需的。但是，更改此快捷方式很难实现
并且可能会在现有用户项目中引起问题。

**现在最佳实践是什么？**

Kotlin Gradle 插件现在提供了一个内置的层次结构模板。自 Kotlin 1.9.20 以来，默认情况下已启用
并包含针对常见用例的预定义中间 source set。

你应该指定目标列表，而不是使用快捷方式，然后插件会自动设置基于此列表的中间
source set。

例如，如果你的项目中有 `iosArm64` 和 `iosSimulatorArm64` 目标，则插件会自动创建
`iosMain` 和 `iosTest` 中间 source set。如果你有 `iosArm64` 和 `macosArm64` 目标，则会创建 `appleMain` 和
`appleTest` source set。

有关更多信息，请参阅 [分层项目结构](multiplatform-hierarchy)

**变更何时生效？**

以下是计划的弃用周期：

* 1.9.20：报告何时使用 `ios()`、`watchos()` 和 `tvos()` 目标快捷方式；
  默认情况下，启用默认层次结构模板
* 2.1.0：报告何时使用目标快捷方式的错误
* 2.2.0：从 Kotlin Multiplatform Gradle 插件中删除目标快捷方式 DSL

### Kotlin 升级后 iOS 框架的版本不正确

**是什么问题？**

当使用直接集成时，Kotlin 代码的更改可能不会反映在 Xcode 的 iOS 应用程序中。直接集成是使用 `embedAndSignAppleFrameworkForXcode` 任务设置的，该任务将来自你的多平台项目的 iOS
框架连接到 Xcode 中的 iOS 应用程序。

当你将 Kotlin 版本从 1.9.2x 升级到 2.0.0（或从 2.0.0 降级到 1.9.2x）时，可能会发生这种情况，然后在 Kotlin 文件中进行更改并尝试构建应用程序，Xcode 可能会错误地使用 iOS 框架的先前版本。因此，这些更改不会在 Xcode 的 iOS 应用程序中可见。

**解决方法是什么？**

1. 在 Xcode 中，使用**Product** | **Clean Build Folder**清理构建目录。
2. 在终端中，运行以下命令：

   ```none
   ./gradlew clean
   ```

3. 再次构建应用程序，以确保使用新版本的 iOS 框架。

**问题何时修复？**

我们计划在 Kotlin 2.0.10 中修复此问题。你可以在 [参与 Kotlin 抢先体验预览](eap) 部分中查看是否有任何 Kotlin 2.0.10 的预览版本可用。

有关更多信息，请参见 [YouTrack 中的相应问题](https://youtrack.jetbrains.com/issue/KT-68257)。

## Kotlin 1.9.0−1.9.25

本节涵盖 Kotlin 1.9.0−1.9.25 中结束弃用周期并生效的不兼容变更。

<anchor name="compilation-source-deprecation"/>
### 用于将 Kotlin source set 直接添加到 Kotlin 编译的已弃用 API

**发生了什么变化？**

对 `KotlinCompilation.source` 的访问已被弃用。像这样的代码会产生弃用警告：

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

要替换 `KotlinCompilation.source(someSourceSet)`，请添加从
`KotlinCompilation` 的默认 source set 到 `someSourceSet` 的 `dependsOn` 关系。
我们建议使用 `by getting` 直接引用 source set，这更短且更易读。
但是，你也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，
它适用于所有情况。

你可以通过以下方式之一更改上面的代码：

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
        
        // 选项 #1. 更短且更易读，尽可能使用它。
        // 通常，默认 source set 的名称
        // 是目标名称和编译名称的简单连接：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 选项 #2. 通用解决方案，如果你的构建脚本需要更高级的方法，请使用它：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**变更何时生效？**

以下是计划的弃用周期：

* 1.9.0：使用 `KotlinComplation.source` 时引入弃用警告
* 1.9.20：将此警告提升为错误
* &gt;1.9.20：从 Kotlin Gradle 插件中删除 `KotlinComplation.source`，尝试使用它会导致构建脚本编译期间出现“无法解析
  引用”错误

<anchor name="kotlin-js-plugin-deprecation"/>
### 从 `kotlin-js` Gradle 插件迁移到 `kotlin-multiplatform` Gradle 插件

**发生了什么变化？**

从 Kotlin 1.9.0 开始，`kotlin-js` Gradle 插件已
弃用。基本上，它使用 `js()` 目标复制了 `kotlin-multiplatform` 插件的功能，
并在底层共享相同的实现。这种重叠造成了混淆，并增加了 Kotlin 团队的维护
负担。我们鼓励你迁移到具有 `js()` 目标的 `kotlin-multiplatform` Gradle 插件。

**现在最佳实践是什么？**

1. 从你的项目中删除 `kotlin-js` Gradle 插件，并在 `settings.gradle.kts` 文件中应用 `kotlin-multiplatform`，
   如果你使用的是 `pluginManagement {}` 代码块：

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 删除以下行：
           kotlin("js") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 改为添加以下行：
           kotlin("multiplatform") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   </Tabs>

   如果你使用的是其他应用插件的方式，
   请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/plugins.html) 以获取迁移说明。

2. 将你的源文件从 `main` 和 `test` 文件夹移动到同一目录中的 `jsMain` 和 `jsTest` 文件夹。
3. 调整依赖项声明：

   * 我们建议使用 `sourceSets {}` 代码块并配置各个 source set 的依赖项，
     `jsMain {}` 用于生产依赖项，`jsTest {}` 用于测试依赖项。
     有关更多详细信息，请参阅 [添加依赖项](multiplatform-add-dependencies)。
   * 但是，如果你想在顶级代码块中声明你的依赖项，
     请将声明从 `api("group:artifact:1.0")` 更改为 `add("jsMainApi", "group:artifact:1.0")`，依此类推。

      在这种情况下，请确保顶级 `dependencies {}` 代码块位于 `kotlin {}` 代码块**之后**。否则，你将收到错误“未找到配置”。
     
     

   你可以通过以下方式之一更改 `build.gradle.kts` 文件中的代码：

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

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
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

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
                   // 此处不需要 js 前缀，你可以直接从顶级代码块复制并粘贴它
                   implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
               }
          }
       }
   }
   
   dependencies {
       // 选项 #2. 将 js 前缀添加到依赖项声明：
       add("jsTestImplementation", kotlin("test"))
   }
   ```

   </TabItem>
   </Tabs>

4. 在大多数情况下，Kotlin Gradle 插件在 `kotlin {}` 代码块中提供的 DSL 保持不变。但是，
   如果你通过名称引用了低级别的 Gradle 实体（如任务和配置），则现在需要调整它们，
   通常通过添加 `js` 前缀。例如，你可以在名称 `jsBrowserTest` 下找到 `browserTest` 任务。

**变更何时生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 插件会产生弃用警告。

<anchor name="jvmWithJava-preset-deprecation"/>
### 已弃用 `jvmWithJava` 预设

**发生了什么变化？**

`targetPresets.jvmWithJava` 已弃用，不鼓励使用。

**现在最佳实践是什么？**

改用 `jvm { withJava() }` 目标。请注意，在切换到 `jvm { withJava() }` 后，你需要调整
带有 `.java` 源的源目录的路径。

例如，如果你使用带有默认名称“jvm”的 `jvm` 目标：

| 之前          | 现在                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**变更何时生效？**

以下是计划的弃用周期：

* 1.3.40：使用 `targetPresets.jvmWithJava` 时引入警告
* 1.9.20：将此警告提升为错误
* >1.9.20：删除 `targetPresets.jvmWithJava` API；尝试使用它会导致构建脚本编译失败

即使整个 `targetPresets` API 已弃用，`jvmWithJava` 预设也具有不同的弃用时间表。

:::

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 已弃用旧版 Android source set 布局

**发生了什么变化？**

自 Kotlin 1.9.0 以来，默认使用[新的 Android source set 布局](multiplatform-android-layout)。
对旧版布局的支持已弃用，并且使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 属性
现在会触发弃用诊断。

**变更何时生效？**

以下是计划的弃用周期：

* &lt;=1.9.0：使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 时报告警告；该警告可以使用
  `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 属性来禁止显示
* 1.9.20：将此警告提升为错误；该错误*无法*被禁止显示
* &gt;1.9.20：删除对 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支持；Kotlin Gradle 插件忽略该属性

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 已弃用具有自定义 `dependsOn` 的 `commonMain` 和 `commonTest`

**发生了什么变化？**

`commonMain` 和 `commonTest` source set 通常分别表示 `main` 和 `test` source set 层次结构的根。
但是，可以通过手动配置这些 source set 的 `dependsOn` 关系来覆盖它。

维护此类配置需要额外的努力和有关 multiplatform 构建内部结构的知识。此外，
它降低了代码的可读性和代码的可重用性，因为你需要阅读特定的构建脚本
以确保 `commonMain` 是否是 `main` source set 层次结构的根。

因此，现在已弃用访问 `commonMain` 和 `commonTest` 上的 `dependsOn`。

**现在最佳实践是什么？**

假设你需要将使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` source set 迁移到 1.9.20。
在大多数情况下，`customCommonMain` 参与与 `commonMain` 相同的编译，因此你可以将
`customCommonMain` 合并到 `commonMain` 中：

1. 将 `customCommonMain` 的源复制到 `commonMain` 中。
2. 将 `customCommonMain` 的所有依赖项添加到 `commonMain` 中。
3. 将 `customCommonMain` 的所有编译器选项设置添加到 `commonMain` 中。

在极少数情况下，`customCommonMain` 可能参与比 `commonMain` 更多的编译。
此类配置需要对构建脚本进行额外的低级别配置。如果你不确定这是否是你的
用例，则很可能不是。

如果是你的用例，请通过将 `customCommonMain` 的源和设置移动到
`commonMain` 并反之亦然来“交换”这两个 source set。

**变更何时生效？**

以下是计划的弃用周期：

* 1.9.0：在 `commonMain` 中使用 `dependsOn` 时报告警告
* &gt;=1.9.20：在 `commonMain` 或 `commonTest` 中使用 `dependsOn` 时报告错误

### 前向声明的新方法

**发生了什么变化？**

JetBrains 团队改进了 Kotlin 中前向声明的方法，以使其行为更可预测：

* 你只能使用 `cnames` 或 `objcnames` 包导入前向声明。
* 你需要显式地进行与相应的 C 和 Objective-C 前向声明之间的转换。

**现在最佳实践是什么？**

* 考虑一个具有 `library.package` 的 C 库，该库声明了一个 `cstructName` 前向声明。
  以前，可以直接从库中使用 `import library.package.cstructName` 导入它。
  现在，你只能为此使用特殊的前向声明包：`import cnames.structs.cstructName`。
  `objcnames` 也是如此。

* 考虑两个 objcinterop 库：一个使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一个
  具有实际定义：

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

  以前，可以在它们之间无缝传输对象。现在，对于前向声明，需要显式的 `as` 转换：

  ```kotlin
  // Kotlin 代码：
  fun test() {
      consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
  }
  ```

  > 你只能从相应的真实类转换为 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。
  > 否则，你将收到错误。
  >
  

**变更何时生效？**

从 Kotlin 1.9.20 开始，你需要显式地进行与相应的 C 和 Objective-C 前向
声明之间的转换。此外，现在只能通过使用特殊包来导入前向声明。

## Kotlin 1.7.0