---
title: "CocoaPods 概述和设置"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info

   这是一种本地集成方法。如果满足以下条件，它可能对您有效：<br/>

   * 您有一个使用 CocoaPods 的 iOS 项目的单体仓库 (mono repository) 设置。
   * 您的 Kotlin Multiplatform 项目具有 CocoaPods 依赖项。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview)

:::

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/)的集成。您可以添加对 Pod 库的依赖，以及将具有原生目标的多平台项目用作 CocoaPods 依赖项。

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依赖项，并享受所有附加功能，例如代码高亮和补全。您可以使用 Gradle 构建整个 Kotlin 项目，而无需切换到 Xcode。

只有当您想更改 Swift/Objective-C 代码或在 Apple 模拟器或设备上运行您的应用程序时，才需要 Xcode。为了与 Xcode 正确协同工作，您应该[更新您的 Podfile](#update-podfile-for-xcode)。

根据您的项目和目的，您可以在 [Kotlin 项目和 Pod 库](native-cocoapods-libraries)以及[Kotlin Gradle 项目和 Xcode 项目](native-cocoapods-xcode)之间添加依赖关系。

## 设置使用 CocoaPods 的环境

使用您选择的安装工具安装 [CocoaPods 依赖管理器](https://cocoapods.org/)：

<Tabs>
<TabItem value="RVM" label="RVM">

1. 如果您还没有安装 [Ruby 版本管理器](https://rvm.io/rvm/install)，请先安装。
2. 安装 Ruby。您可以选择一个特定的版本：

    ```bash
    rvm install ruby 3.0.0
    ```

3. 安装 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Rbenv" label="Rbenv">

1. 如果您还没有安装 [GitHub 上的 rbenv](https://github.com/rbenv/rbenv#installation)，请先安装。
2. 安装 Ruby。您可以选择一个特定的版本：

    ```bash
    rbenv install 3.0.0
    ```

3. 将 Ruby 版本设置为特定目录的本地版本或整个机器的全局版本：

    ```bash
    rbenv global 3.0.0
    ```
    
4. 安装 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem value="Default Ruby" label="Default Ruby">

:::note
这种安装方式在带有 Apple M 芯片的设备上不起作用。请使用其他工具来设置使用 CocoaPods 的环境。

:::

您可以使用 macOS 上应该可用的默认 Ruby 安装 CocoaPods 依赖管理器：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem value="Homebrew" label="Homebrew">

:::caution
使用 Homebrew 安装 CocoaPods 可能会导致兼容性问题。

当安装 CocoaPods 时，Homebrew 还会安装 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，这对于使用 Xcode 是必要的。
但是，它无法通过 Homebrew 更新，如果安装的 Xcodeproj 尚不支持最新的 Xcode 版本，您将在 Pod 安装时遇到错误。如果是这种情况，请尝试其他工具来安装 CocoaPods。

:::

1. 如果您还没有安装 [Homebrew](https://brew.sh/)，请先安装。
2. 安装 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

如果在安装过程中遇到问题，请查看[可能的问题和解决方案](#possible-issues-and-solutions)部分。

## 创建一个项目

当您的环境设置好后，您可以创建一个新的 Kotlin Multiplatform 项目。为此，请使用 Kotlin Multiplatform web wizard 或 Android Studio 的 Kotlin Multiplatform 插件。

### 使用 web wizard

要使用 web wizard 创建项目并配置 CocoaPods 集成：

1. 打开 [Kotlin Multiplatform wizard](https://kmp.jetbrains.com) 并为您的项目选择目标平台。
2. 点击 **Download** 按钮并解压缩下载的存档。
3. 在 Android Studio 中，选择菜单中的 **File | Open**。
4. 导航到解压缩的项目文件夹，然后点击 **Open**。
5. 将 Kotlin CocoaPods Gradle 插件添加到版本编目 (version catalog)。在 `gradle/libs.versions.toml` 文件中，将以下声明添加到 `[plugins]` 块：
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. 导航到项目的根 `build.gradle.kts` 文件，并将以下别名添加到 `plugins {}` 块：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. 打开您想要集成 CocoaPods 的模块，例如 `composeApp` 模块，并将以下别名添加到 `plugins {}` 块：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

现在您可以在 Kotlin Multiplatform 项目中使用 CocoaPods 了。

### 在 Android Studio 中

要在 Android Studio 中创建一个带有 CocoaPods 集成的项目：

1. 将 [Kotlin Multiplatform 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 安装到 Android Studio。
2. 在 Android Studio 中，选择菜单中的 **File** | **New** | **New Project**。
3. 在项目模板列表中，选择 **Kotlin Multiplatform App**，然后点击 **Next**。
4. 命名您的应用程序并点击 **Next**。
5. 选择 **CocoaPods Dependency Manager** 作为 iOS 框架分发选项。

   <img src="/img/as-project-wizard.png" alt="带有 Kotlin Multiplatform 插件的 Android Studio 向导" width="700" style={{verticalAlign: 'middle'}}/>

6. 保持所有其他选项为默认值。点击 **Finish**。

   该插件将自动生成设置了 CocoaPods 集成的项目。

## 配置现有项目

如果您已经有一个项目，您可以手动添加和配置 Kotlin CocoaPods Gradle 插件：

1. 在您的项目的 `build.gradle(.kts)` 中，应用 CocoaPods 插件以及 Kotlin Multiplatform 插件：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
    ```

2. 在 `cocoapods` 块中配置 Podspec 文件的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
        kotlin("native.cocoapods") version "2.1.20"
    }
 
    kotlin {
        cocoapods {
            // Required properties
            // Specify the required Pod version here
            // Otherwise, the Gradle project version is used
            version = "1.0"
            summary = "Some description for a Kotlin/Native module"
            homepage = "Link to a Kotlin/Native module homepage"
   
            // Optional properties
            // Configure the Pod name here instead of changing the Gradle project name
            name = "MyCocoaPod"

            framework {
                // Required properties              
                // Framework name configuration. Use this property instead of deprecated 'frameworkName'
                baseName = "MyFramework"
                
                // Optional properties
                // Specify the framework linking type. It's dynamic by default. 
                isStatic = false
                // Dependency export
                // Uncomment and specify another project module if you have one:
                // export(project(":<your other KMP module>"))
                transitiveExport = false // This is default.
            }

            // Maps custom Xcode configuration to NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 在 [Kotlin Gradle 插件仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt) 中查看 Kotlin DSL 的完整语法。
    >
    
    
3. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects**（或在 Android Studio 中运行 **Sync Project with Gradle Files**）以重新导入项目。
4. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免 Xcode 构建期间的兼容性问题。

应用后，CocoaPods 插件执行以下操作：

* 为所有 macOS、iOS、tvOS 和 watchOS 目标添加 `debug` 和 `release` 框架作为输出二进制文件。
* 创建一个 `podspec` 任务，该任务为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件。

`Podspec` 文件包括一个指向输出框架的路径和脚本阶段，这些阶段自动化了 Xcode 项目构建过程中的框架构建。

## 更新 Xcode 的 Podfile

如果您想将您的 Kotlin 项目导入到 Xcode 项目：

1. 在您的 Podfile 中进行更改：

   * 如果您的项目有任何 Git、HTTP 或自定义 Podspec 仓库依赖项，您应该在 Podfile 中指定 Podspec 的路径。

     例如，如果您添加对 `podspecWithFilesExample` 的依赖项，请在 Podfile 中声明 Podspec 的路径：

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `：path` 应该包含 Pod 的文件路径。

   * 当您从自定义 Podspec 仓库添加库时，您还应该在 Podfile 的开头指定规范的 [位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 在您的项目目录中运行 `pod install`。

   当您第一次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包括您的原始 `.xcodeproj` 和 CocoaPods 项目。
3. 关闭您的 `.xcodeproj` 并打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项出现问题。
4. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects**（或在 Android Studio 中运行 **Sync Project with Gradle Files**）以重新导入项目。

如果您不在 Podfile 中进行这些更改，则 `podInstall` 任务将失败，并且 CocoaPods 插件将在日志中显示错误消息。

## 可能的问题和解决方案

### CocoaPods 安装

#### Ruby 安装

CocoaPods 是用 Ruby 构建的，您可以使用 macOS 上应该可用的默认 Ruby 安装它。
Ruby 1.9 或更高版本有一个内置的 RubyGems 包管理框架，可以帮助您安装 [CocoaPods 依赖管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安装 CocoaPods 并使其正常工作时遇到问题，请按照[本指南](https://www.ruby-lang.org/en/documentation/installation/)安装 Ruby 或参考 [RubyGems 网站](https://rubygems.org/pages/download/) 安装该框架。

#### 版本兼容性

我们建议使用最新的 Kotlin 版本。如果您的当前版本早于 1.7.0，您还需要额外安装 [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 插件。

但是，`cocoapods-generate` 与 Ruby 3.0.0 或更高版本不兼容。在这种情况下，请降级 Ruby 或将 Kotlin 升级到 1.7.0 或更高版本。

### 使用 Xcode 时出现构建错误

CocoaPods 安装的一些变体可能会导致 Xcode 中出现构建错误。
通常，Kotlin Gradle 插件会在 `PATH` 中发现 `pod` 可执行文件，但这可能会因您的环境而异。

要显式设置 CocoaPods 安装路径，您可以手动或使用 shell 命令将其添加到项目的 `local.properties` 文件中：

* 如果使用代码编辑器，请将以下行添加到 `local.properties` 文件中：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用终端，请运行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模块

您可能会遇到与 [C 互操作](native-c-interop) 问题相关的 `module 'SomeSDK' not found` 错误。
尝试以下解决方法以避免此错误：

#### 指定框架名称

1. 查找下载的 Pod 目录 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中的 `module.modulemap` 文件。
2. 检查模块内的框架名称，例如 `SDWebImageMapKit {}`。如果框架名称与 Pod 名称不匹配，请显式指定它：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```
#### 指定头文件

如果 Pod 不包含 `.modulemap` 文件，例如 `pod("NearbyMessages")`，请显式指定主头文件：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

查看 [CocoaPods 文档](https://guides.cocoapods.org/) 以获取更多信息。如果没有任何效果，并且您仍然遇到此错误，请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告问题。

### Rsync 错误

您可能会遇到 `rsync error: some files could not be transferred` 错误。这是一个 [已知问题](https://github.com/CocoaPods/CocoaPods/issues/11946)，如果 Xcode 中的应用程序目标启用了用户脚本的沙盒，则会发生此错误。

要解决此问题：

1. 在应用程序目标中禁用用户脚本的沙盒：

   <img src="/img/disable-sandboxing-cocoapods.png" alt="禁用沙盒 CocoaPods" width="700" style={{verticalAlign: 'middle'}}/>

2. 停止可能已被沙盒化的 Gradle 守护进程进程：

    ```shell
    ./gradlew --stop
    ```