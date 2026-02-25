[//]: # (title: 添加对 Pod 库的依赖项)

<tldr>

   * 在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
   * 您可以在我们的 [GitHub 仓库](https://github.com/Kotlin/kmp-with-cocoapods-sample)中找到示例项目。

</tldr>

您可以在 Kotlin 项目的不同位置添加对 Pod 库的依赖项。

要添加 Pod 依赖项，请在共享模块的 `build.gradle(.kts)` 文件中调用 `pod()` 函数。每个依赖项都需要单独的函数调用。您可以在该函数的配置块中指定依赖项的参数。

* 当您添加新的依赖项并在 IDE 中重新导入项目时，该库将自动连接。
* 要在 Xcode 中使用您的 Kotlin 项目，请先[修改项目的 Podfile](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)。

> 如果您未指定最低部署目标版本，而某个依赖的 Pod 需要更高的部署目标版本，将会产生错误。
>
{style="note"}

## 来自 CocoaPods 仓库

要添加对位于 CocoaPods 仓库中的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。
   
   在配置块中，您可以使用 `version` 参数指定库的版本。要使用库的最新版本，可以完全省略此参数。

   > 您也可以添加对 subspec 的依赖项。
   >
   {style="note"}

2. 指定 Pod 库的最低部署目标版本。

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
        }
    }
    ```

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

要在 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`：

```kotlin
import cocoapods.SDWebImage.*
```

## 来自本地存储的库

要添加对本地存储的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定本地 Pod 库的路径：在 `source` 参数值中使用 `path()` 函数。

   > 您也可以添加对 subspec 的本地依赖项。
   > `cocoapods {}` 块可以同时包含指向本地存储的 Pod 和来自 CocoaPods 仓库的 Pod 的依赖项。
   >
   {style="note"}

2. 指定 Pod 库的最低部署目标版本。

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
                source = path(project.file("../pod_dependency"))
            }
            pod("subspec_dependency/Core") {
                version = "1.0"
                extraOpts += listOf("-compiler-option")
                source = path(project.file("../subspec_dependency"))
            }
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

   > 您还可以在配置块中使用 `version` 参数指定库的版本。要使用库的最新版本，请省略该参数。
   >
   {style="note"}

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

要在 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 来自自定义 Git 仓库

要添加对位于自定义 Git 仓库中的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定 Git 仓库的路径：在 `source` 参数值中使用 `git()` 函数。

   此外，您可以在 `git()` 之后的块中指定以下参数：
    * `commit` – 使用仓库中的特定提交
    * `tag` – 使用仓库中的特定标签
    * `branch` – 使用仓库中的特定分支

   `git()` 函数按以下顺序优先处理传入的参数：`commit`、`tag`、`branch`。如果您没有指定参数，Kotlin 插件将使用 `master` 分支的 `HEAD`。

   > 您可以结合使用 `branch`、`commit` 和 `tag` 参数来获取特定版本的 Pod。
   >
   {style="note"}

2. 指定 Pod 库的最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("SDWebImage") {
                source = git("https://github.com/SDWebImage/SDWebImage") {
                    tag = "5.20.0"
                }
            }

            pod("JSONModel") {
                source = git("https://github.com/jsonmodel/jsonmodel.git") {
                    branch = "key-mapper-class"
                }
            }

            pod("CocoaLumberjack") {
                source = git("https://github.com/CocoaLumberjack/CocoaLumberjack.git") {
                    commit = "3e7f595e3a459c39b917aacf9856cd2a48c4dbf3"
                }
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

要在 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 来自自定义 Podspec 仓库

要添加对位于自定义 Podspec 仓库中的 Pod 库的依赖项：

1. 在 `specRepos {}` 块中使用 `url()` 调用指定自定义 Podspec 仓库的地址。
2. 在 `pod()` 函数中指定 Pod 库的名称。
3. 指定 Pod 库的最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            specRepos {
                url("https://github.com/Kotlin/kotlin-cocoapods-spec.git")
            }
            pod("example")
        }
    }
    ```

4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

> 要配合 Xcode 使用，请在 Podfile 的开头指定 spec 的位置：
> 
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

要在 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`：

```kotlin
import cocoapods.example.*
```

## 使用自定义 cinterop 选项

要使用自定义 cinterop 选项添加对 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。
2. 在配置块中，添加以下选项：

   * `extraOpts` – 为 Pod 库指定选项列表。例如，`extraOpts = listOf("-compiler-option")`。
      
      > 如果遇到 clang 模块问题，请同时添加 `-fmodules` 选项。
      >
     {style="note"}

   * `packageName` – 直接使用包名通过 `import <packageName>` 导入库。

3. 指定 Pod 库的最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"
            ios.deploymentTarget = "16.0"

            pod("FirebaseAuth") {
                packageName = "FirebaseAuthWrapper"
                version = "11.7.0"
                extraOpts += listOf("-compiler-option", "-fmodules")
            }
        }
    }
    ```

4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

要在 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`：
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
如果使用了 `packageName` 参数，则可以使用包名 `import <packageName>` 导入库：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支持带有 @import 指令的 Objective-C 头文件

> 此功能为[实验性](supported-platforms.md#general-kotlin-stability-levels)功能。它可能随时被删除或更改。请仅将其用于评估目的。我们感谢您在 [YouTrack](https://kotl.in/issue) 上提供的反馈。
>
{style="warning"}

一些 Objective-C 库，特别是作为 Swift 库包装器的库，在其头文件中含有 `@import` 指令。默认情况下，cinterop 不提供对这些指令的支持。

要启用对 `@import` 指令的支持，请在 `pod()` 函数的配置块中指定 `-fmodules` 选项：

```kotlin
kotlin {
    iosArm64()

    cocoapods {
        version = "2.0"
        summary = "CocoaPods test library"
        homepage = "https://github.com/JetBrains/kotlin"
        ios.deploymentTarget = "16.0"

        pod("PodName") {
            version = "1.0.0"
            extraOpts = listOf("-compiler-option", "-fmodules")
        }
    }
}
```

### 在相互依赖的 Pod 之间共享 Kotlin cinterop

如果您使用 `pod()` 函数添加了多个对 Pod 的依赖项，当这些 Pod 的 API 之间存在依赖关系时，您可能会遇到问题。

为了让代码在此类情况下能够编译，请使用 `useInteropBindingFrom()` 函数。它在为新 Pod 构建绑定时，会利用为另一个 Pod 生成的 cinterop 绑定。

您应该在设置依赖关系之前声明被依赖的 Pod：

```kotlin
// pod("WebImage") 的 cinterop：
fun loadImage(): WebImage

// pod("Info") 的 cinterop：
fun printImageInfo(image: WebImage)

// 您的代码：
printImageInfo(loadImage())
```

在这种情况下，如果您没有在 cinterop 之间配置正确的依赖关系，代码将无效，因为 `WebImage` 类型将源自不同的 cinterop 文件，从而属于不同的包。

## 下一步

* [设置 Kotlin 项目与 Xcode 项目之间的依赖关系](multiplatform-cocoapods-xcode.md)
* [参阅完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)