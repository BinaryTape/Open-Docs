[//]: # (title: 将 Kotlin 项目用作 CocoaPods 依赖项)

<tldr>

*   在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
*   在我们的 [GitHub 版本库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)中可以找到一个示例项目。

</tldr>

你可以将整个 Kotlin 项目用作 Pod 依赖项。为此，你需要将此依赖项包含在项目的 Podfile 中，指定其名称以及包含生成的 Podspec 的项目目录的路径。

此依赖项将随此项目自动构建（和重新构建）。这种方法通过省去手动编写相应的 Gradle 任务和 Xcode 构建步骤的需要，简化了导入到 Xcode 的过程。

你可以在 Kotlin 项目与一个或多个目标 (target) 的 Xcode 项目之间添加依赖项。在 Kotlin 项目与多个 Xcode 项目之间添加依赖项也是可行的。但是，在这种情况下，你需要为每个 Xcode 项目手动调用 `pod install`。对于单个 Xcode 项目，这会自动完成。

> *   为了将依赖项正确导入到 Kotlin/Native 模块，Podfile 必须包含 `use_modular_headers!` 或 `use_frameworks!` 指令。
> *   如果你未指定最低部署目标版本，而某个依赖项 Pod 需要更高的部署目标，你将收到一个错误。
>
{style="note"}

## 带有单个目标的 Xcode 项目

要在带有单个目标的 Xcode 项目中使用 Kotlin 项目作为 Pod 依赖项：

1.  如果你还没有 Xcode 项目，请创建一个。
2.  在 Xcode 中，在应用程序目标 (application target) 的 **Build Options**（构建选项）下，确保禁用 **User Script Sandboxing**（用户脚本沙箱）：

    ![Disable sandboxing CocoaPods](disable-sandboxing-cocoapods.png)

3.  在 Kotlin 项目的 iOS 部分，创建一个 Podfile。
4.  在共享模块的 `build.gradle(.kts)` 文件中，通过 `podfile = project.file()` 添加 Podfile 的路径。

    此步骤通过为你的 Podfile 调用 `pod install` 来帮助你的 Xcode 项目与 Kotlin 项目依赖项同步。
5.  为 Pod 库指定最低部署目标版本：

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

6.  在 Podfile 中，添加你希望包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7.  在项目目录中运行 `pod install`。

    当你首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含你原始的 `.xcodeproj` 文件和 CocoaPods 项目。
8.  关闭 `.xcodeproj` 文件，转而打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项问题。
9.  在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

## 带有多个目标的 Xcode 项目

要在带有多个目标的 Xcode 项目中使用 Kotlin 项目作为 Pod 依赖项：

1.  如果你还没有 Xcode 项目，请创建一个。
2.  在 Kotlin 项目的 iOS 部分，创建一个 Podfile。
3.  在共享模块的 `build.gradle(.kts)` 文件中，通过 `podfile = project.file()` 添加你项目 Podfile 的路径。

    此步骤通过为你的 Podfile 调用 `pod install` 来帮助你的 Xcode 项目与 Kotlin 项目依赖项同步。
4.  使用 `pod()` 添加你希望在项目中使用的 Pod 库的依赖项。
5.  对于每个目标，指定 Pod 库的最低部署目标版本：

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

6.  在 Podfile 中，添加你希望包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

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

7.  在项目目录中运行 `pod install`。

    当你首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。此文件包含你原始的 `.xcodeproj` 文件和 CocoaPods 项目。
8.  关闭 `.xcodeproj` 文件，转而打开新的 `.xcworkspace` 文件。这样可以避免项目依赖项问题。
9.  在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

## 接下来

*   [在 Kotlin 项目中添加对 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
*   [了解如何将 framework 连接到你的 iOS 项目](multiplatform-direct-integration.md)
*   [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)