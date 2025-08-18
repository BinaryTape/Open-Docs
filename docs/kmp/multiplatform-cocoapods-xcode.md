[//]: # (title: 使用 Kotlin 项目作为 CocoaPods 依赖项)

<tldr>

* 在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 您可以在我们的 [GitHub 版本库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample) 中找到一个示例项目。

</tldr>

您可以将整个 Kotlin 项目用作 Pod 依赖项。为此，您需要在项目的 Podfile 中包含此依赖项，并指定其名称以及生成 Podspec 的项目目录路径。

此依赖项将随此项目一起自动构建（并重新构建）。这种方法简化了导入 Xcode 的过程，无需手动编写相应的 Gradle 任务和 Xcode 构建步骤。

您可以在 Kotlin 项目和带有一个或多个目标的 Xcode 项目之间添加依赖项。还可以在 Kotlin 项目和多个 Xcode 项目之间添加依赖项。但是，在这种情况下，您需要为每个 Xcode 项目手动运行 `pod install`。对于单个 Xcode 项目，此操作是自动完成的。

> * 为了正确导入依赖项到 Kotlin/Native 模块中，Podfile 必须包含 `use_modular_headers!` 或 `use_frameworks!` 指令之一。
> * 如果您未指定最低部署目标版本，并且某个依赖项 Pod 需要更高的部署目标，则会收到错误。
>
{style="note"}

## 带单个目标的 Xcode 项目

要在带单个目标的 Xcode 项目中将 Kotlin 项目用作 Pod 依赖项：

1. 如果您还没有 Xcode 项目，请创建一个。
2. 在 Xcode 中，确保在应用程序目标的 **Build Options** 下禁用 **User Script Sandboxing**：

   ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3. 在 Kotlin 项目的 iOS 部分，创建一个 Podfile。
4. 在共享模块的 `build.gradle(.kts)` 文件中，使用 `podfile = project.file()` 添加 Podfile 的路径。

   此步骤通过为您的 Podfile 运行 `pod install`，有助于同步您的 Xcode 项目与 Kotlin 项目的依赖项。
5. 为 Pod 库指定最低部署目标版本：

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

6. 在 Podfile 中，添加要包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在您的项目目录中运行 `pod install`。

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含您原始的 `.xcodeproj` 和 CocoaPods 项目。
8. 关闭您的 `.xcodeproj`，而是打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项问题。
9. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**），以重新导入项目。

## 带多个目标的 Xcode 项目

要在带多个目标的 Xcode 项目中将 Kotlin 项目用作 Pod 依赖项：

1. 如果您还没有 Xcode 项目，请创建一个。
2. 在 Kotlin 项目的 iOS 部分，创建一个 Podfile。
3. 在共享模块的 `build.gradle(.kts)` 文件中，使用 `podfile = project.file()` 添加您项目的 Podfile 路径。

   此步骤通过为您的 Podfile 运行 `pod install`，有助于同步您的 Xcode 项目与 Kotlin 项目的依赖项。
4. 添加您项目中要使用的 Pod 库的依赖项，使用 `pod()`。
5. 对于每个目标，为 Pod 库指定最低部署目标版本：

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
            // Specify the path to the Podfile
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. 在 Podfile 中，添加要包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

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

7. 在您的项目目录中运行 `pod install`。

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含您原始的 `.xcodeproj` 和 CocoaPods 项目。
8. 关闭您的 `.xcodeproj`，而是打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项问题。
9. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**），以重新导入项目。

## 下一步

* [在您的 Kotlin 项目中添加对 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [了解如何将 framework 连接到您的 iOS 项目](multiplatform-direct-integration.md)
* [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)