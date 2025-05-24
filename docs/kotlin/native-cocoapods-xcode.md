---
title: "将 Kotlin Gradle 项目用作 CocoaPods 依赖项"
---
要将具有原生目标的 Kotlin Multiplatform 项目用作 CocoaPods 依赖项，请[完成初始配置](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
您可以通过其名称和包含生成的 Podspec 的项目目录的路径，将其包含在 Xcode 项目的 Podfile 中。

此依赖项将与此项目一起自动构建（和重新构建）。这种方法通过消除手动编写相应的 Gradle 任务和 Xcode 构建步骤的需求，简化了导入到 Xcode 的过程。

您可以在 Kotlin Gradle 项目和具有一个或多个目标的 Xcode 项目之间添加依赖项。也可以在 Gradle 项目和多个 Xcode 项目之间添加依赖项。但是，在这种情况下，您需要为每个 Xcode 项目手动调用 `pod install` 来添加依赖项。在其他情况下，这是自动完成的。

:::note
* 为了正确地将依赖项导入到 Kotlin/Native 模块，`Podfile` 必须包含
  [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或
  [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令。
* 如果您没有指定最低部署目标版本，并且依赖的 Pod 需要更高的部署目标，您会收到错误。

:::

## 具有一个目标的 Xcode 项目

1. 如果您尚未创建 Xcode 项目，请创建一个包含 `Podfile` 的 Xcode 项目。
2. 确保在应用程序目标的 **Build Options（构建选项）** 下禁用 **User Script Sandboxing（用户脚本沙箱）**：

   <img src="/img/disable-sandboxing-cocoapods.png" alt="Disable sandboxing CocoaPods" style={{verticalAlign: 'middle'}}/>

3. 在 Kotlin 项目的 `build.gradle(.kts)` 文件中使用 `podfile = project.file(..)` 添加到 Xcode 项目 `Podfile` 的路径。
   此步骤通过为您的 `Podfile` 调用 `pod install`，帮助同步您的 Xcode 项目与 Gradle 项目依赖项。
4. 为 Pod 库指定最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../ios-app/Podfile")
        }
    }
    ```

5. 将要包含在 Xcode 项目中的 Gradle 项目的名称和路径添加到 `Podfile`。

    ```ruby
    use_frameworks!

    platform :ios, '16.0'

    target 'ios-app' do
            pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 在您的项目目录中运行 `pod install`。

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含您的原始 `.xcodeproj` 和 CocoaPods 项目。
7. 关闭您的 `.xcodeproj` 并打开新的 `.xcworkspace` 文件。 这样可以避免项目依赖项问题。
8. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects（重新加载所有 Gradle 项目）**（或在 Android Studio 中运行 **Sync Project with Gradle Files（将项目与 Gradle 文件同步）**）以重新导入项目。

## 具有多个目标的 Xcode 项目

1. 如果您尚未创建 Xcode 项目，请创建一个包含 `Podfile` 的 Xcode 项目。
2. 使用 `podfile = project.file(..)` 将 Xcode 项目 `Podfile` 的路径添加到 Kotlin 项目的 `build.gradle(.kts)`。
   此步骤通过为您的 `Podfile` 调用 `pod install`，帮助同步您的 Xcode 项目与 Gradle 项目依赖项。
3. 将依赖项添加到您想在项目中使用的 Pod 库，使用 `pod()`。
4. 对于每个目标，为 Pod 库指定最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()
        tvosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"
            tvos.deploymentTarget = "16.0"

            pod("SDWebImage") {
                version = "5.20.0"
            }
            podfile = project.file("../severalTargetsXcodeProject/Podfile") // specify the path to the Podfile
        }
    }
    ```

5. 将要包含在 Xcode 项目中的 Gradle 项目的名称和路径添加到 `Podfile`。

    ```ruby
    target 'iosApp' do
      use_frameworks!
      platform :ios, '16.0'
      # Pods for iosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end

    target 'TVosApp' do
      use_frameworks!
      platform :tvos, '16.0'

      # Pods for TVosApp
      pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

6. 在您的项目目录中运行 `pod install`。

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含您的原始 `.xcodeproj` 和 CocoaPods 项目。
7. 关闭您的 `.xcodeproj` 并打开新的 `.xcworkspace` 文件。 这样可以避免项目依赖项问题。
8. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects（重新加载所有 Gradle 项目）**（或在 Android Studio 中运行 **Sync Project with Gradle Files（将项目与 Gradle 文件同步）**）以重新导入项目。

您可以在[这里](https://github.com/Kotlin/kmm-with-cocoapods-multitarget-xcode-sample)找到示例项目。

## 接下来做什么

请参阅[将框架连接到您的 iOS 项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-integrate-in-existing-app.html#connect-the-framework-to-your-ios-project)，了解如何在 Xcode 项目的构建阶段中添加自定义构建脚本。