[//]: # (title: CocoaPods 概览与设置)

<tldr>
   这是一种本地集成方法。如果满足以下条件，它可能适合您：<br/>

   * 您拥有一个使用 CocoaPods 的 iOS 项目的单仓库 (mono repository) 设置。
   * 您的 Kotlin Multiplatform 项目具有 CocoaPods 依赖项。<br/>

   [选择最适合您的集成方式](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供了与 [CocoaPods 依赖管理器](https://cocoapods.org/) 的集成。您可以添加对 Pod 库的依赖，也可以将 Kotlin 项目作为 CocoaPods 依赖项使用。

您可以直接在 IntelliJ IDEA 或 Android Studio 中管理 Pod 依赖项，并享受代码高亮显示和补全等所有附加功能。您可以使用 Gradle 构建整个 Kotlin 项目，而无需切换到 Xcode。

只有当您想要更改 Swift/Objective-C 代码或在 Apple 模拟器或设备上运行应用程序时，才需要 Xcode。若要配合 Xcode 工作，请先[更新您的 Podfile](#update-podfile-for-xcode)。

## 设置 CocoaPods 工作环境

使用您选择的安装工具安装 [CocoaPods 依赖管理器](https://cocoapods.org/)：

<Tabs>
<TabItem title="RVM">

1. 如果您尚未安装 [RVM](https://rvm.io/rvm/install)，请先安装。
2. 安装 Ruby。您可以选择特定版本：

    ```bash
    rvm install ruby %rubyVersion%
    ```

3. 安装 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="Rbenv">

1. 如果您尚未安装 [来自 GitHub 的 rbenv](https://github.com/rbenv/rbenv#installation)，请先安装。
2. 安装 Ruby。您可以选择特定版本：

    ```bash
    rbenv install %rubyVersion%
    ```

3. 将 Ruby 版本设置为特定目录的本地版本或整台计算机的全局版本：

    ```bash
    rbenv global %rubyVersion%
    ```
    
4. 安装 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</TabItem>
<TabItem title="默认 Ruby">

> 这种安装方式在配备 Apple M 芯片的设备上无法正常工作。请使用其他工具设置 CocoaPods 工作环境。
>
{style="note"}

您可以使用 macOS 上默认提供的 Ruby 安装 CocoaPods 依赖管理器：

```bash
sudo gem install cocoapods
```

</TabItem>
<TabItem title="Homebrew">

> 使用 Homebrew 安装 CocoaPods 可能会导致兼容性问题。
>
> 在安装 CocoaPods 时，Homebrew 还会安装 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，这是配合 Xcode 工作所必需的。
> 然而，它无法通过 Homebrew 更新，如果安装的 Xcodeproj 尚不支持最新的 Xcode 版本，您在安装 Pod 时会遇到错误。如果是这种情况，请尝试使用其他工具安装 CocoaPods。
>
{style="warning"}

1. 如果您尚未安装 [Homebrew](https://brew.sh/)，请先安装。
2. 安装 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</TabItem>
</Tabs>

如果您在安装过程中遇到问题，请查看[可能的问题与解决方案](#possible-issues-and-solutions)章节。

## 创建项目

设置好 CocoaPods 环境后，您可以配置 Kotlin Multiplatform 项目以配合 Pod 工作。以下步骤展示了在全新生成的项目上的配置过程：

1. 使用 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)或 [Kotlin Multiplatform 网络向导](https://kmp.jetbrains.com)生成一个新的 Android 和 iOS 项目。
   如果使用网络向导，请解压缩存档并在您的 IDE 中导入项目。
2. 在 `gradle/libs.versions.toml` 文件中，将 Kotlin CocoaPods Gradle 插件添加到 `[plugins]` 块中：

   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```

3. 导航到项目的根 `build.gradle.kts` 文件，并将以下别名添加到 `plugins {}` 块中：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

4. 打开您想要集成 CocoaPods 的模块（例如 `composeApp` 模块），并将以下别名添加到该模块 `build.gradle.kts` 文件的 `plugins {}` 块中：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

现在您已准备好[在 Kotlin Multiplatform 项目中配置 CocoaPods](#configure-the-project)。

## 配置项目

要在您的多平台项目中配置 Kotlin CocoaPods Gradle 插件：

1. 在项目的共享模块的 `build.gradle(.kts)` 中，应用 CocoaPods 插件以及 Kotlin Multiplatform 插件。

   > 如果您是[使用 IDE 插件或网络向导](#create-a-project)创建的项目，请跳过此步骤。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. 在 `cocoapods` 块中配置 Podspec 文件的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 必需属性
            // 在此处指定所需的 Pod 版本
            // 否则将使用 Gradle 项目版本
            version = "1.0"
            summary = "Kotlin/Native 模块的一些描述"
            homepage = "指向 Kotlin/Native 模块主页的链接"
   
            // 可选属性
            // 在此处配置 Pod 名称，而不是更改 Gradle 项目名称
            name = "MyCocoaPod"

            framework {
                // 必需属性              
                // 框架名称配置。使用此属性代替已弃用的 'frameworkName'
                baseName = "MyFramework"
                
                // 可选属性
                // 指定框架链接类型。默认为动态链接。 
                isStatic = false
                // 依赖项导出
                // 如果您有另一个项目模块，请取消注释并指定它：
                // export(project(":<您的另一个 KMP 模块>"))
                transitiveExport = false // 这是默认值。
            }

            // 将自定义 Xcode 配置映射到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 在 [Kotlin Gradle 插件仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)中查看 Kotlin DSL 的完整语法。
    >
    {style="note"}
    
3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。
4. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免在 Xcode 构建期间出现兼容性问题。

应用后，CocoaPods 插件会执行以下操作：

* 为所有 macOS、iOS、tvOS 和 watchOS 目标添加 `debug` 和 `release` 框架作为输出二进制文件。
* 创建一个 `podspec` 任务，为项目生成一个 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件。

`Podspec` 文件包含指向输出框架的路径，以及在 Xcode 项目构建过程中自动构建此框架的脚本阶段。

## 为 Xcode 更新 Podfile

如果您想将 Kotlin 项目导入到 Xcode 项目中：

1. 在 Kotlin 项目的 iOS 部分，对 Podfile 进行更改：

   * 如果您的项目有任何 Git、HTTP 或自定义 Podspec 仓库依赖项，请在 Podfile 中指定 Podspec 的路径。

     例如，如果您添加了对 `podspecWithFilesExample` 的依赖，请在 Podfile 中声明 Podspec 的路径：

     ```ruby
     target 'ios-app' do
        # ... 其他依赖项 ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     `:path` 应包含指向 Pod 的文件路径。

   * 如果您从自定义 Podspec 仓库添加库，请在 Podfile 的开头指定 spec 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... 其他依赖项 ...
         pod 'example'
     end
     ```

2. 在您的项目目录中运行 `pod install`。

   当您第一次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。该文件包含您原始的 `.xcodeproj` 和 CocoaPods 项目。
3. 关闭您的 `.xcodeproj` 并改为打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项出现问题。
4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

如果您未在 Podfile 中进行这些更改，`podInstall` 任务将失败，并且 CocoaPods 插件将在日志中显示错误消息。

## 可能的问题与解决方案

### CocoaPods 安装 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安装

CocoaPods 是用 Ruby 构建的，您可以使用 macOS 上默认提供的 Ruby 安装它。
Ruby 1.9 或更高版本内置了 RubyGems 软件包管理框架，可帮助您安装 [CocoaPods 依赖管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果您在安装和运行 CocoaPods 时遇到问题，请按照[此指南](https://www.ruby-lang.org/en/documentation/installation/)安装 Ruby，或参考 [RubyGems 网站](https://rubygems.org/pages/download/)安装该框架。

#### 版本兼容性

我们建议使用最新的 Kotlin 版本。
此 CocoaPods 设置所需的最低版本为 1.7.0。

### 使用 Xcode 时的构建错误 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 安装的某些变体可能会导致 Xcode 中的构建错误。
通常，Kotlin Gradle 插件会在 `PATH` 中寻找 `pod` 可执行文件，但这可能会因您的环境而异，从而导致不一致。

要显式设置 CocoaPods 安装路径，您可以手动或使用 shell 命令将其添加到项目的 `local.properties` 文件中：

* 如果使用代码编辑器，请将以下行添加到 `local.properties` 文件：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用终端，请运行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 未找到模块或框架 {initial-collapse-state="collapsed" collapsible="true"}

安装 Pod 时，您可能会遇到与 [C 互操作 (C interop)](https://kotlinlang.org/docs/native-c-interop.html) 问题相关的 `module 'SomeSDK' not found` 或 `framework 'SomeFramework' not found` 错误。要解决此类错误，请尝试以下解决方案：

#### 更新软件包

更新您的安装工具和已安装的软件包 (gems)：

<Tabs>
<TabItem title="RVM">

1. 更新 RVM：

   ```bash
   rvm get stable
   ```

2. 更新 Ruby 的软件包管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gems 升级到最新版本：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Rbenv">

1. 更新 Rbenv：

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. 更新 Ruby 的软件包管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gems 升级到最新版本：

    ```bash
    gem update
    ```

</TabItem>
<TabItem title="Homebrew">

1. 更新 Homebrew 软件包管理器： 

   ```bash
   brew update
   ```

2. 将所有已安装的软件包升级到最新版本：

   ```bash
   brew upgrade
   ````

</TabItem>
</Tabs>

#### 指定框架名称 

1. 在下载的 Pod 目录 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...` 中查找 `module.modulemap` 文件。
2. 检查模块内的框架名称，例如 `SDWebImageMapKit {}`。如果框架名称与 Pod 名称不匹配，请显式指定：

    ```kotlin
    pod("SDWebImage/MapKit") {
        moduleName = "SDWebImageMapKit"
    }
    ```

#### 指定头文件

如果 Pod 不包含 `.modulemap` 文件（例如 `pod("NearbyMessages")`），请显式指定主头文件：

```kotlin
pod("NearbyMessages") {
    version = "1.1.1"
    headers = "GNSMessages.h"
}
```

查看 [CocoaPods 文档](https://guides.cocoapods.org/)了解更多信息。如果这些方法都不起作用，并且您仍然遇到此错误，请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告问题。

### Rsync 错误 {initial-collapse-state="collapsed" collapsible="true"}

您可能会遇到 `rsync error: some files could not be transferred` 错误。这是一个[已知问题](https://github.com/CocoaPods/CocoaPods/issues/11946)，如果 Xcode 中的应用程序目标启用了用户脚本沙箱化 (sandboxing)，就会发生此问题。

要解决此问题：

1. 在应用程序目标中禁用用户脚本沙箱化：

   ![禁用 CocoaPods 沙箱化](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已被沙箱化的 Gradle daemon 进程：

    ```shell
    ./gradlew --stop
    ```

## 后续步骤

* [在您的 Kotlin 项目中添加对 Pod 库的依赖](multiplatform-cocoapods-libraries.md)
* [设置 Kotlin 项目与 Xcode 项目之间的依赖关系](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)