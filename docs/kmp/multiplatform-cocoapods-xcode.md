[//]: # (title: 将 Kotlin 项目作为 CocoaPods 依赖项使用)

<tldr>

* 在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
* 您可以在我们的 [GitHub 仓库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)中找到示例项目。

</tldr>

您可以将整个 Kotlin 项目作为一个 Pod 依赖项使用。为此，您需要在项目的 Podfile 中包含该依赖项，并指定其名称以及包含生成的 Podspec 的项目目录路径。

该依赖项将随此项目一起自动构建（及重新构建）。这种方法简化了向 Xcode 的导入，不再需要手动编写相应的 Gradle 任务和 Xcode 构建步骤。

您可以在一个 Kotlin 项目与具有一个或多个目标的 Xcode 项目之间添加依赖项。也可以在 Kotlin 项目与多个 Xcode 项目之间添加依赖项。但在这种情况下，您需要为每个 Xcode 项目手动调用 `pod install`。对于单个 Xcode 项目，这是自动完成的。

> * 为了正确地将依赖项导入 Kotlin/Native 模块，Podfile 必须包含 [`use_modular_headers!`](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang) 或 [`use_frameworks!`](https://guides.cocoapods.org/syntax/podfile.html#use_frameworks_bang) 指令。
> * 如果您没有指定最低部署目标版本，而依赖项 Pod 需要更高的部署目标，则会产生错误。
>
{style="note"}

## 具有一个目标的 Xcode 项目

要在具有一个目标的 Xcode 项目中将 Kotlin 项目作为 Pod 依赖项使用：

1. 如果您还没有 Xcode 项目，请创建一个。
2. 在 Xcode 中，确保在应用目标中的 **Build Options** 下禁用 **User Script Sandboxing**：

   ![禁用 CocoaPods 沙盒](disable-sandboxing-cocoapods.png)

3. 在 Kotlin 项目的 iOS 部分，创建一个 Podfile。 
4. 在共享模块的 `build.gradle(.kts)` 文件中，使用 `podfile = project.file()` 添加 Podfile 的路径。

   此步骤通过为您的 Podfile 调用 `pod install`，帮助您的 Xcode 项目与 Kotlin 项目依赖项保持同步。
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

6. 在 Podfile 中，添加您想要包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

    ```ruby
    target 'ios-app' do
        use_frameworks!
        platform :ios, '16.0'
    
        # Pods for iosApp
        pod 'kotlin_library', :path => '../kotlin-library'
    end
    ```

7. 在您的项目目录中运行 `pod install`。

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。该文件包含您原始的 `.xcodeproj` 和 CocoaPods 项目。
8. 关闭您的 `.xcodeproj` 并改为打开新的 `.xcworkspace` 文件。通过这种方式，您可以避免项目依赖项的问题。
9. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

## 具有多个目标的 Xcode 项目

要在具有多个目标的 Xcode 项目中将 Kotlin 项目作为 Pod 依赖项使用：

1. 如果您还没有 Xcode 项目，请创建一个。
2. 在 Kotlin 项目的 iOS 部分，创建一个 Podfile。
3. 在共享模块的 `build.gradle(.kts)` 文件中，使用 `podfile = project.file()` 添加项目的 Podfile 路径。

   此步骤通过为您的 Podfile 调用 `pod install`，帮助您的 Xcode 项目与 Kotlin 项目依赖项保持同步。
4. 使用 `pod()` 向您想要在项目中使用的 Pod 库添加依赖项。
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
            // 指定 Podfile 的路径
            podfile = project.file("../severalTargetsXcodeProject/Podfile")
        }
    }
    ```

6. 在 Podfile 中，添加您想要包含在 Xcode 项目中的 Kotlin 项目的名称和路径：

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

   首次运行 `pod install` 时，它会创建 `.xcworkspace` 文件。该文件包含您原始的 `.xcodeproj` 和 CocoaPods 项目。
8. 关闭您的 `.xcodeproj` 并改为打开新的 `.xcworkspace` 文件。通过这种方式，您可以避免项目依赖项的问题。
9. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

## 下一步

* [在您的 Kotlin 项目中添加对 Pod 库的依赖项](multiplatform-cocoapods-libraries.md)
* [查看如何将框架连接到您的 iOS 项目](multiplatform-direct-integration.md)
* [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)