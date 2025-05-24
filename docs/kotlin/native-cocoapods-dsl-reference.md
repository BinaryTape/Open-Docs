---
title: "CocoaPods Gradle 插件 DSL 参考"
---
Kotlin CocoaPods Gradle 插件是用于创建 Podspec 文件的工具。这些文件是将 Kotlin
项目与 [CocoaPods 依赖管理器](https://cocoapods.org/) 集成所必需的。

本文档包含 Kotlin CocoaPods Gradle 插件的完整块（block）、函数和属性列表，
您可以在使用 [CocoaPods 集成](native-cocoapods)时使用。

* 了解如何[设置环境并配置 Kotlin CocoaPods Gradle 插件](native-cocoapods)。
* 根据您的项目和目的，您可以在 [Kotlin 项目和 Pod 库](native-cocoapods-libraries) 以及 [Kotlin Gradle 项目和 Xcode 项目](native-cocoapods-xcode) 之间添加依赖项。

## 启用插件

要应用 CocoaPods 插件，请将以下行添加到 `build.gradle(.kts)` 文件中：

```kotlin
plugins {
   kotlin("multiplatform") version "2.1.20"
   kotlin("native.cocoapods") version "2.1.20"
}
```

插件版本与 [Kotlin 发布版本](releases) 匹配。最新的稳定版本是 2.1.20。

## cocoapods 块

`cocoapods` 块是 CocoaPods 配置的顶层块。它包含有关 Pod 的一般信息，
包括 Pod 版本、摘要（summary）和主页（homepage）等必需信息，以及可选功能。

您可以在其中使用以下块、函数和属性：

| **名称 (Name)**                             | **描述 (Description)**                                                                                                                                                                                                                  | 
|---------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                             | Pod 的版本。如果未指定，则使用 Gradle 项目版本。如果未配置这些属性，您将收到错误。                                                                                                                                           |
| `summary`                             | 从此项目构建的 Pod 的必需描述。                                                                                                                                                                       |
| `homepage`                            | 指向从此项目构建的 Pod 的主页的必需链接。                                                                                                                                                              |
| `authors`                             | 指定从此项目构建的 Pod 的作者。                                                                                                                                                                            |
| `podfile`                             | 配置现有的 `Podfile` 文件。                                                                                                                                                                                          |
| `noPodspec()`                         | 设置插件不为 `cocoapods` 部分生成 Podspec 文件。                                                                                                                                                    |
| `name`                                | 从此项目构建的 Pod 的名称。如果未提供，则使用项目名称。                                                                                                                                          |
| `license`                             | 从此项目构建的 Pod 的许可证，其类型和文本。                                                                                                                                                          |
| `framework`                           | `framework` 块配置插件生成的框架。                                                                                                                                                             |
| `source`                              | 从此项目构建的 Pod 的位置。                                                                                                                                                                                 |
| `extraSpecAttributes`                 | 配置其他 Podspec 属性，例如 `libraries` 或 `vendored_frameworks`。                                                                                                                                                   |
| `xcodeConfigurationToNativeBuildType` | 将自定义 Xcode 配置映射到 NativeBuildType：将 "Debug" 映射到 `NativeBuildType.DEBUG`，将 "Release" 映射到 `NativeBuildType.RELEASE`。                                                                                               |
| `publishDir`                          | 配置 Pod 发布的输出目录。                                                                                                                                                                              |
| `pods`                                | 返回 Pod 依赖项的列表。                                                                                                                                                                                              |
| `pod()`                               | 将 CocoaPods 依赖项添加到从此项目构建的 Pod。                                                                                                                                                                  |
| `specRepos`                           | 使用 `url()` 添加规范存储库。当私有 Pod 用作依赖项时，这是必需的。有关更多信息，请参见 [CocoaPods 文档](https://guides.cocoapods.org/making/private-cocoapods.html)。 |

### 目标平台（Targets）

| iOS                 | macOS        | tvOS                 | watchOS                 |
|---------------------|--------------|----------------------|-------------------------|
| `iosArm64`          | `macosArm64` | `tvosArm64`          | `watchosArm64`          |
| `iosX64`            | `macosX64`   | `tvosX64`            | `watchosX64`            |
| `iosSimulatorArm64` |              | `tvosSimulatorArm64` | `watchosSimulatorArm64` |
|                     |              |                      | `watchosArm32`          |
|                     |              |                      | `watchosDeviceArm64`    |

对于每个目标平台，使用 `deploymentTarget` 属性来指定 Pod 库的最低目标版本。

应用后，CocoaPods 会将 `debug` 和 `release` 框架作为所有目标的输出二进制文件添加。

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

### framework 块

`framework` 块嵌套在 `cocoapods` 中，并配置从此项目构建的 Pod 的框架属性。

:::note
请注意，`baseName` 是必填字段。

:::

| **名称 (Name)**           | **描述 (Description)**                                                                         | 
|--------------------|-----------------------------------------------------------------------------------------|
| `baseName`         | 必需的框架名称。使用此属性代替已弃用的 `frameworkName`。 |
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

## pod() 函数

`pod()` 函数调用将 CocoaPods 依赖项添加到从此项目构建的 Pod。每个依赖项都需要
单独的函数调用。

您可以在函数参数中指定 Pod 库的名称，并在其配置块中指定其他参数值，例如库的 `version`
和 `source`：

| **名称 (Name)**                     | **描述 (Description)**                                                                                                                                                                                                                                                                                    | 
|------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `version`                    | 库版本。要使用库的最新版本，请省略该参数。                                                                                                                                                                                                                 |
| `source`                     | 从以下位置配置 Pod：<list><li>使用 `git()` 的 Git 存储库。在 `git()` 之后的块中，您可以指定 `commit` 以使用特定的提交，`tag` 以使用特定的标签，以及 `branch` 以使用存储库中的特定分支</li><li>使用 `path()` 的本地存储库</li></list> |
| `packageName`                | 指定包名。                                                                                                                                                                                                                                                                        |
| `extraOpts`                  | 指定 Pod 库的选项列表。例如，特定标志： ```Kotlin
extraOpts = listOf("-compiler-option")
```                                                                                                                                        |
| `linkOnly`                   | 指示 CocoaPods 插件使用具有动态框架的 Pod 依赖项，而不生成 cinterop 绑定。如果与静态框架一起使用，则该选项将完全删除 Pod 依赖项。                                                                                           |
| `interopBindingDependencies` | 包含其他 Pod 的依赖项列表。在为新 Pod 构建 Kotlin 绑定时，将使用此列表。                                                                                                                                                                                   |
| `useInteropBindingFrom()`    | 指定用作依赖项的现有 Pod 的名称。应在函数执行之前声明此 Pod。该函数指示 CocoaPods 插件在为新 Pod 构建绑定时使用现有 Pod 的 Kotlin 绑定。                                     |

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