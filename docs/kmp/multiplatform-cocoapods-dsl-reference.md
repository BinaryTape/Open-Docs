[//]: # (title: CocoaPods Gradle 插件 DSL 参考)

<tldr>

* 在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 关于[在 Kotlin 项目中设置不同 Pod 依赖项](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的示例项目，请参见。
* 关于[包含多个 target 的 Xcode 项目如何依赖 Kotlin 库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的示例项目，请查看。

</tldr>
<show-structure for="chapter,procedure" depth="2"/>

Kotlin CocoaPods Gradle 插件是一个用于创建 Podspec 文件的工具。这些文件是将你的 Kotlin 项目与 [CocoaPods 依赖项管理器](https://cocoapods.org/)集成所必需的。

本 DSL 参考列出了 Kotlin CocoaPods Gradle 插件中的主要块、函数和属性，你可以在设置 CocoaPods 集成时使用它们。

## 启用插件

要应用 CocoaPods 插件，请将以下行添加到 `build.gradle(.kts)` 文件中：

```kotlin
plugins {
   kotlin("multiplatform") version "%kotlinVersion%"
   kotlin("native.cocoapods") version "%kotlinVersion%"
}
```

插件版本与 [Kotlin 发布版本](https://kotlinlang.org/docs/releases.html)匹配。最新稳定版本为 %kotlinVersion%。

## `cocoapods {}` 块

`cocoapods {}` 块是 CocoaPods 配置的顶层块。它包含有关 Pod 的通用信息，包括必需信息（例如 Pod 版本、摘要和主页）以及可选特性。

你可以在其中使用以下块、函数和属性：

| **名称**                              | **描述**                                                                                                                                                                                                                  |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod 的版本。如果未指定此项，将使用 Gradle 项目版本。如果未配置这些属性中的任何一个，将收到错误。                                                                                                                                           |
| `summary`                             | 从此项目构建的 Pod 的必需描述。                                                                                                                                                                                                      |
| `homepage`                            | 从此项目构建的 Pod 的主页的必需链接。                                                                                                                                                                                             |
| `authors`                             | 指定从此项目构建的 Pod 的作者。                                                                                                                                                                            |
| `podfile`                             | 配置现有的 Podfile。                                                                                                                                                                                                 |
| `noPodspec()`                         | 配置插件不生成用于 `cocoapods` 部分的 Podspec 文件。                                                                                                                                                    |
| `name`                                | 从此项目构建的 Pod 的名称。如果未提供，则使用项目名称。                                                                                                                                          |
| `license`                             | 从此项目构建的 Pod 的许可证、其类型和文本。                                                                                                                                                          |
| `framework`                           | `framework` 块配置了由插件生成的框架。                                                                                                                                                                                            |
| `source`                              | 从此项目构建的 Pod 的位置。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | 配置其他 Podspec 属性，例如 `libraries` 或 `vendored_frameworks`。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | 将自定义 Xcode 配置映射到 NativeBuildType：将 "Debug" 映射到 `NativeBuildType.DEBUG`，将 "Release" 映射到 `NativeBuildType.RELEASE`。                                                                                               |
| `publishDir`                          | 配置 Pod 发布到输出目录。                                                                                                                                                                              |
| `pods`                                | 返回 Pod 依赖项的列表。                                                                                                                                                                                              |
| `pod()`                               | 添加 CocoaPods 依赖项到从此项目构建的 Pod。                                                                                                                                                                                                 |
| `specRepos`                           | 使用 `url()` 添加规范版本库。当私有 Pod 用作依赖项时，此项是必需的。关于更多信息，请参见 [CocoaPods 文档](https://guides.cocoapods.org/making/private-cocoapods.html)。 |

### 目标

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

对于每个目标，使用 `deploymentTarget` 属性指定 Pod 库的最低目标版本。

应用后，CocoaPods 会为所有目标添加 `debug` 和 `release` 框架作为输出二进制文件。

```kotlin
kotlin {
    iosArm64()
   
    cocoapods {
        version = "2.0"
        name = "MyCocoaPod"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        
        extraSpecAttributes["vendored_frameworks"] = 'CustomFramework.xcframework'
        license = "{ :type => 'MIT', :text => 'License text'}"
        source = "{ :git => 'git@github.com:vkormushkin/kmmpodlibrary.git', :tag => '$version' }"
        authors = "Kotlin Dev"
        
        specRepos {
            url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
        }
        pod("example")
        
        xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
   }
}
```

### `framework {}` 块

`framework {}` 块嵌套在 `cocoapods` 内部，配置了从项目构建的 Pod 的框架属性。

> 请注意 `baseName` 是一个必需字段。
>
{style="note"}

| **名称**           | **描述**                                                                         |
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 必需的框架名称。请使用此属性代替已弃用的 `frameworkName`。 |
| `isStatic`         | 定义框架链接类型。默认情况下是动态的。                            |
| `transitiveExport` | 启用依赖项导出。                                                              |

```kotlin
kotlin {
    cocoapods {
        version = "2.0"
        framework {
            baseName = "MyFramework"
            isStatic = false
            export(project(":anotherKMMModule"))
            transitiveExport = true
        }
    }
}
```

## `pod()` 函数

`pod()` 函数调用会添加 CocoaPods 依赖项到从此项目构建的 Pod。每个依赖项都需要单独的函数调用。

你可以在函数形参中指定 Pod 库的名称，并在其配置块中指定附加形参值，例如库的 `version` 和 `source`：

| **名称**                     | **描述**                                                                                                                                                                                                                                                                                    |
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 库版本。要使用库的最新版本，请省略形参。                                                                                                                                                                                                                                                                               |
| `source`                     | 配置 Pod 的来源：<list><li>使用 `git()` 的 Git 版本库。在 `git()` 之后的块中，你可以指定 `commit` 以使用特定提交、`tag` 以使用特定标签，以及 `branch` 以使用版本库中的特定分支</li><li>使用 `path()` 的本地版本库</li></list> |
| `packageName`                | 指定包名称。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | 指定 Pod 库的选项的列表。例如，特定标志：<code-block lang="Kotlin" code="extraOpts = listOf(&quot;-compiler-option&quot;)"/>                                                                                                                                                                       |
| `linkOnly`                   | 指示 CocoaPods 插件使用动态框架的 Pod 依赖项，而不生成 cinterop 绑定。如果与静态框架一起使用，该选项将完全移除 Pod 依赖项。                                                                                           |
| `interopBindingDependencies` | 包含其他 Pod 的依赖项列表。当为新 Pod 构建 Kotlin 绑定时，将使用此列表。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 指定用作依赖项的现有 Pod 的名称。此 Pod 应在函数执行前声明。该函数指示 CocoaPods 插件在为新 Pod 构建绑定时使用现有 Pod 的 Kotlin 绑定。                                     |

```kotlin
kotlin {
    iosArm64()
    
    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "16.0"
      
        pod("pod_dependency") {
            version = "1.0"
            extraOpts += listOf("-compiler-option")
            linkOnly = true
            source = path(project.file("../pod_dependency"))
        }
    }
}
```

## 接下来

* 关于 Kotlin DSL 的完整语法，请参见 [Kotlin Gradle 插件版本库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)
* [在你的 Kotlin 项目中添加对 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [设置 Kotlin 项目和 Xcode 项目之间的依赖项](multiplatform-cocoapods-xcode.md)