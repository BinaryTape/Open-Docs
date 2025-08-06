[//]: # (title: CocoaPods 概述与设置)

<tldr>
   这是一种本地集成方法。如果符合以下情况，它将适用：<br/>

   * 你有一个使用 CocoaPods 的 iOS 项目的单版本库设置。
   * 你的 Kotlin Multiplatform 项目具有 CocoaPods 依赖项。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

Kotlin/Native 提供了与 [CocoaPods 依赖项管理器](https://cocoapods.org/) 的集成。你可以添加对 Pod 库的依赖项，也可以将 Kotlin 项目用作 CocoaPods 依赖项。

你可以在 IntelliJ IDEA 或 Android Studio 中直接管理 Pod 依赖项，并享受所有额外特性，例如代码高亮和补全。你可以使用 Gradle 构建整个 Kotlin 项目，而无需切换到 Xcode。

你只在需要更改 Swift/Objective-C 代码或在 Apple 模拟器或设备上运行应用程序时才需要 Xcode。要使用 Xcode，请首先[更新你的 Podfile](#update-podfile-for-xcode)。

## 设置使用 CocoaPods 的环境

使用你选择的安装工具安装 [CocoaPods 依赖项管理器](https://cocoapods.org/)：

<tabs>
<tab title="RVM">

1. 如果你尚未安装 [RVM](https://rvm.io/rvm/install)，请先安装。
2. 安装 Ruby。你可以选择特定版本：

    ```bash
    rvm install ruby 3.0.0
    ```

3. 安装 CocoaPods：

    ```bash
    sudo gem install -n /usr/local/bin cocoapods
    ```

</tab>
<tab title="Rbenv">

1. 如果你尚未安装 [GitHub 上的 rbenv](https://github.com/rbenv/rbenv#installation)，请先安装。
2. 安装 Ruby。你可以选择特定版本：

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

</tab>
<tab title="默认 Ruby">

> 这种安装方式不适用于配备 Apple M 芯片的设备。请使用其他工具设置使用 CocoaPods 的环境。
>
{style="note"}

你可以使用 macOS 上应默认可用的 Ruby 来安装 CocoaPods 依赖项管理器：

```bash
sudo gem install cocoapods
```

</tab>
<tab title="Homebrew">

> 使用 Homebrew 安装 CocoaPods 可能会导致兼容性问题。
>
> 安装 CocoaPods 时，Homebrew 还会安装 [Xcodeproj](https://github.com/CocoaPods/Xcodeproj) gem，它在使用 Xcode 时是必需的。
> 然而，它无法通过 Homebrew 更新，如果安装的 Xcodeproj 尚不支持最新的 Xcode 版本，你将会遇到 Pod 安装错误。如果出现这种情况，请尝试使用其他工具安装 CocoaPods。
>
{style="warning"}

1. 如果你尚未安装 [Homebrew](https://brew.sh/)，请先安装。
2. 安装 CocoaPods：

    ```bash
    brew install cocoapods
    ```

</tab>
</tabs>

如果在安装过程中遇到问题，请查看[可能的问题与解决方案](#possible-issues-and-solutions)部分。

## 创建项目

当你的环境设置完成后，你可以创建一个新的 Kotlin Multiplatform 项目。为此，请使用 Kotlin Multiplatform 网页向导或 Android Studio 的 Kotlin Multiplatform 插件。

### 使用网页向导

要使用网页向导创建项目并配置 CocoaPods 集成：

1. 打开 [Kotlin Multiplatform 向导](https://kmp.jetbrains.com) 并为你的项目选择目标平台。
2. 点击 **Download** 按钮并解压下载的归档文件。
3. 在 Android Studio 中，在菜单中选择 **File | Open**。
4. 导航到已解压的项目文件夹，然后点击 **Open**。
5. 将 Kotlin CocoaPods Gradle 插件添加到版本目录。在 `gradle/libs.versions.toml` 文件中，将以下声明添加到 `[plugins]` 代码块：
 
   ```text
   kotlinCocoapods = { id = "org.jetbrains.kotlin.native.cocoapods", version.ref = "kotlin" }
   ```
   
6. 导航到项目根目录下的 `build.gradle.kts` 文件，并将以下别名添加到 `plugins {}` 代码块：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods) apply false
   ```

7. 打开你希望集成 CocoaPods 的模块，例如 `composeApp` 模块，并将以下别名添加到 `plugins {}` 代码块：

   ```kotlin
   alias(libs.plugins.kotlinCocoapods)
   ```

现在你已准备好[在你的 Kotlin Multiplatform 项目中配置 CocoaPods](#configure-the-project)。

### 在 Android Studio 中

要在 Android Studio 中创建项目并集成 CocoaPods：

1. 在 Android Studio 中安装 [Kotlin Multiplatform 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)。
2. 在 Android Studio 中，在菜单中选择 **File** | **New** | **New Project**。
3. 在项目模板列表中，选择 **Kotlin Multiplatform App**，然后点击 **Next**。
4. 为你的应用程序命名并点击 **Next**。
5. 选择 **CocoaPods Dependency Manager** 作为 iOS framework 分发选项。

   ![Android Studio wizard with the Kotlin Multiplatform plugin](as-project-wizard.png){width=700}

6. 保持所有其他选项默认。点击 **Finish**。

   该插件将自动生成项目并设置好 CocoaPods 集成。

## 配置项目

要在你的多平台项目中配置 Kotlin CocoaPods Gradle 插件：

1. 在项目的共享模块的 `build.gradle(.kts)` 文件中，应用 CocoaPods 插件以及 Kotlin Multiplatform 插件。

   > 如果你已使用 [网页向导](#using-web-wizard) 或 [Android Studio 的 Kotlin Multiplatform 插件](#in-android-studio) 创建了项目，请跳过此步骤。
   > 
   {style="note"}
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
    ```

2. 在 `cocoapods` 代码块中配置 Podspec 文件的 `version`、`summary`、`homepage` 和 `baseName`：
    
    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
        kotlin("native.cocoapods") version "%kotlinVersion%"
    }
 
    kotlin {
        cocoapods {
            // 必需属性
            // 在此处指定所需的 Pod 版本
            // 否则，将使用 Gradle 项目版本
            version = "1.0"
            summary = "Kotlin/Native 模块的一些描述"
            homepage = "Kotlin/Native 模块主页链接"
   
            // 可选属性
            // 在此处配置 Pod 名称，而不是更改 Gradle 项目名称
            name = "MyCocoaPod"

            framework {
                // 必需属性              
                // framework 名称配置。请使用此属性而不是已弃用的 'frameworkName'
                baseName = "MyFramework"
                
                // 可选属性
                // 指定 framework 链接类型。默认情况下是动态的。 
                isStatic = false
                // 依赖项导出
                // 如果你有一个其他项目模块，请取消注释并指定：
                // export(project(":<your other KMP module>"))
                transitiveExport = false // 这是默认值。
            }

            // 将自定义 Xcode 配置映射到 NativeBuildType
            xcodeConfigurationToNativeBuildType["CUSTOM_DEBUG"] = NativeBuildType.DEBUG
            xcodeConfigurationToNativeBuildType["CUSTOM_RELEASE"] = NativeBuildType.RELEASE
        }
    }
    ```

    > 关于 Kotlin DSL 的完整语法，请参见 [Kotlin Gradle 插件版本库](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/native/cocoapods/CocoapodsExtension.kt)。
    >
    {style="note"}
    
3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。
4. 生成 [Gradle wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html) 以避免在 Xcode 构建期间出现兼容性问题。

应用后，CocoaPods 插件将执行以下操作：

* 为所有 macOS、iOS、tvOS 和 watchOS 目标平台添加 `debug` 和 `release` framework 作为输出二进制文件。
* 创建一个 `podspec` 任务，该任务将生成项目的 [Podspec](https://guides.cocoapods.org/syntax/podspec.html) 文件。

`Podspec` 文件包含一个指向输出 framework 的路径以及在 Xcode 项目的构建过程中自动构建此 framework 的脚本阶段。

## 更新 Xcode 的 Podfile

如果你想将你的 Kotlin 项目导入到 Xcode 项目：

1. 在 Kotlin 项目的 iOS 部分，对 Podfile 进行更改：

   * 如果你的项目有任何 Git、HTTP 或自定义 Podspec 版本库依赖项，请在 Podfile 中指定 Podspec 的路径。

     例如，如果你添加对 `podspecWithFilesExample` 的依赖项，请在 Podfile 中声明 Podspec 的路径：

     ```ruby
     target 'ios-app' do
        # ... other dependencies ...
        pod 'podspecWithFilesExample', :path => 'cocoapods/externalSources/url/podspecWithFilesExample' 
     end
     ```

     **:path** 应该包含 Pod 的文件路径。

   * 如果你从自定义 Podspec 版本库添加库，请在 Podfile 的开头指定 specs 的[位置](https://guides.cocoapods.org/syntax/podfile.html#source)：

     ```ruby
     source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'

     target 'kotlin-cocoapods-xcproj' do
         # ... other dependencies ...
         pod 'example'
     end
     ```

2. 在你的项目目录中运行 `pod install`。

   当你首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含你原始的 `.xcodeproj` 和 CocoaPods 项目。
3. 关闭你的 `.xcodeproj` 并转而打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项问题。
4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

如果你不在 Podfile 中进行这些更改，`podInstall` 任务将失败，并且 CocoaPods 插件将在日志中显示错误消息。

## 可能的问题与解决方案

### CocoaPods 安装 {initial-collapse-state="collapsed" collapsible="true"}

#### Ruby 安装

CocoaPods 是使用 Ruby 构建的，你可以使用 macOS 上应默认可用的 Ruby 来安装它。Ruby 1.9 或更高版本具有内置的 RubyGems 包管理框架，可帮助你安装 [CocoaPods 依赖项管理器](https://guides.cocoapods.org/using/getting-started.html#installation)。

如果你在安装 CocoaPods 并使其正常工作时遇到问题，请遵循[此指南](https://www.ruby-lang.org/en/documentation/installation/)安装 Ruby，或参考 [RubyGems 网站](https://rubygems.org/pages/download/)安装此框架。

#### 版本兼容性

我们推荐使用最新 Kotlin 版本。如果你的当前版本早于 1.7.0，你将需要额外安装 [`cocoapods-generate`](https://github.com/square/cocoapods-generate#installation") 插件。

然而，`cocoapods-generate` 与 Ruby 3.0.0 或更高版本不兼容。在这种情况下，请降级 Ruby 或将 Kotlin 升级到 1.7.0 或更高版本。

### 使用 Xcode 时的构建错误 {initial-collapse-state="collapsed" collapsible="true"}

CocoaPods 安装的一些变体可能会导致 Xcode 中的构建错误。通常，Kotlin Gradle 插件会在 `PATH` 中发现 `pod` 可执行文件，但这可能因你的环境而异，从而导致不一致。

要显式设置 CocoaPods 安装路径，你可以手动将其添加到项目的 `local.properties` 文件中，或使用 shell 命令：

* 如果使用代码编辑器，请将以下行添加到 `local.properties` 文件：

    ```text
    kotlin.apple.cocoapods.bin=/Users/Jane.Doe/.rbenv/shims/pod
    ```

* 如果使用终端，请运行以下命令：

    ```shell
    echo -e "kotlin.apple.cocoapods.bin=$(which pod)" >> local.properties
    ```

### 找不到模块或 framework {initial-collapse-state="collapsed" collapsible="true"}

安装 Pods 时，你可能会遇到与 [C 互操作](https://kotlinlang.org/docs/native-c-interop.html) 问题相关的 `module 'SomeSDK' not found` 或 `framework 'SomeFramework' not found` 错误。要解决此类错误，请尝试以下解决方案：

#### 更新软件包

更新你的安装工具和已安装的软件包 (gems)：

<tabs>
<tab title="RVM">

1. 更新 RVM：

   ```bash
   rvm get stable
   ```

2. 更新 Ruby 的包管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gem 升级到最新版本：

    ```bash
    gem update
    ```

</tab>
<tab title="Rbenv">

1. 更新 Rbenv：

    ```bash
    cd ~/.rbenv
    git pull
    ```

2. 更新 Ruby 的包管理器 RubyGems：

    ```bash
    gem update --system
    ```

3. 将所有已安装的 gem 升级到最新版本：

    ```bash
    gem update
    ```

</tab>
<tab title="Homebrew">

1. 更新 Homebrew 包管理器： 

   ```bash
   brew update
   ```

2. 将所有已安装的软件包升级到最新版本：

   ```bash
   brew upgrade
   ````

</tab>
</tabs>

#### 指定 framework 名称 

1. 查看已下载的 Pod 目录 `[shared_module_name]/build/cocoapods/synthetic/IOS/Pods/...`，查找 `module.modulemap` 文件。
2. 检查模块内的 framework 名称，例如 `SDWebImageMapKit {}`。如果 framework 名称与 Pod 名称不匹配，请显式指定它：

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

关于更多信息，请查看 [CocoaPods 文档](https://guides.cocoapods.org/)。如果所有方法都无效，并且你仍然遇到此错误，请在 [YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) 中报告问题。

### Rsync 错误 {initial-collapse-state="collapsed" collapsible="true"}

你可能会遇到 `rsync error: some files could not be transferred` 错误。这是一个[已知问题](https://github.com/CocoaPods/CocoaPods/issues/11946)，如果 Xcode 中的应用程序目标启用了用户脚本的沙盒化，则会发生此问题。

要解决此问题：

1. 在应用程序目标中禁用用户脚本的沙盒化：

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png){width=700}

2. 停止可能已被沙盒化的 Gradle 守护进程：

    ```shell
    ./gradlew --stop
    ```

## 下一步

* [在你的 Kotlin 项目中添加对 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [设置 Kotlin 项目和 Xcode 项目之间的依赖项](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)