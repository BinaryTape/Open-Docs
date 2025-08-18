[//]: # (title: 添加对 Pod 库的依赖项)

<tldr>

   * 在添加 Pod 依赖项之前，请[完成初始配置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
   * 你可以在我们的 [GitHub 版本库](https://github.com/Kotlin/kmp-with-cocoapods-sample)中找到一个示例项目。

</tldr>

你可以在 Kotlin 项目中的不同位置添加对 Pod 库的依赖项。

要添加 Pod 依赖项，请在共享模块的 `build.gradle(.kts)` 文件中调用 `pod()` 函数。每个依赖项都需要单独的函数调用。你可以在函数的配置块中指定依赖项的形参。

* 当你添加新的依赖项并在 IDE 中重新导入项目时，库将自动连接。
* 要将你的 Kotlin 项目与 Xcode 配合使用，请先[在项目 Podfile 中进行更改](multiplatform-cocoapods-overview.md#update-podfile-for-xcode)。

> 如果你没有指定最低部署目标版本，并且某个依赖项 Pod 需要更高的部署目标，你将收到错误。
>
{style="note"}

## 来自 CocoaPods 版本库

要添加对位于 CocoaPods 版本库中的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，你可以使用 `version` 形参指定库的版本。要使用库的最新版本，你可以完全省略此形参。

   > 你也可以添加对 subspec 的依赖项。
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

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects** （或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files** ）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入 `cocoapods.<library-name>` 包：

```kotlin
import cocoapods.SDWebImage.*
```

## 基于本地存储的库

要添加对本地存储的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定本地 Pod 库的路径：在 `source` 形参值中使用 `path()` 函数。

   > 你也可以添加对 subspec 的本地依赖项。
   > `cocoapods {}` 块可以同时包含对本地存储的 Pod 和来自 CocoaPods 版本库的 Pod 的依赖项。
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

   > 你也可以在配置块中使用 `version` 形参指定库的版本。要使用库的最新版本，请省略该形参。
   >
   {style="note"}

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects** （或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files** ）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入 `cocoapods.<library-name>` 包：

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 来自自定义 Git 版本库

要添加对位于自定义 Git 版本库中的 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定 Git 版本库的路径：在 `source` 形参值中使用 `git()` 函数。

   此外，你可以在 `git()` 之后的块中指定以下形参：
    * `commit` – 使用版本库中的特定 commit
    * `tag` – 使用版本库中的特定 tag
    * `branch` – 使用版本库中的特定 branch

   `git()` 函数按以下顺序优先处理传入的形参：`commit`、`tag`、`branch`。如果你未指定形参，Kotlin 插件将使用 `master` 分支的 `HEAD`。

   > 你可以组合 `branch`、`commit` 和 `tag` 形参来获取 Pod 的特定版本。
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

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects** （或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files** ）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入 `cocoapods.<library-name>` 包：

```kotlin
import cocoapods.SDWebImage.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 来自自定义 Podspec 版本库

要添加对位于自定义 Podspec 版本库中的 Pod 库的依赖项：

1. 在 `specRepos {}` 块中调用 `url()` 来指定自定义 Podspec 版本库的地址。
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

4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects** （或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files** ）以重新导入项目。

> 要与 Xcode 配合使用，请在你的 Podfile 的开头指定 spec 的位置：
>
> ```ruby
> source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
> ```
>
{style="note"}

要从 Kotlin 代码中使用这些依赖项，请导入 `cocoapods.<library-name>` 包：

```kotlin
import cocoapods.example.*
```

## 使用自定义 cinterop 选项

要使用自定义 cinterop 选项添加对 Pod 库的依赖项：

1. 在 `pod()` 函数中指定 Pod 库的名称。
2. 在配置块中，添加以下选项：

   * `extraOpts` – 指定 Pod 库的选项列表。例如，`extraOpts = listOf("-compiler-option")`。

      > 如果你遇到 clang 模块的问题，也添加 `-fmodules` 选项。
      >
     {style="note"}

   * `packageName` – 使用 `import <packageName>` 直接导入库。

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

4. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects** （或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files** ）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入 `cocoapods.<library-name>` 包：

```kotlin
import cocoapods.FirebaseAuth.*
```

如果你使用 `packageName` 形参，你可以使用包名 `import <packageName>` 导入库：

```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支持带有 @import 指令的 Objective-C 头文件

> 此特性是[实验性的](supported-platforms.md#general-kotlin-stability-levels)。它可能随时被取消或更改。请仅用于评估目的。我们感谢你在 [YouTrack](https://kotl.in/issue) 上提供反馈。
>
{style="warning"}

一些 Objective-C 库，特别是那些充当 Swift 库包装器的库，在其头文件中包含 `@import` 指令。默认情况下，cinterop 不支持这些指令。

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

### 在依赖的 Pod 之间共享 Kotlin cinterop

如果你使用 `pod()` 函数添加了多个对 Pod 的依赖项，那么当你的 Pod 的 API 之间存在依赖关系时，你可能会遇到问题。

为了使代码在这种情况下能够编译，请使用 `useInteropBindingFrom()` 函数。它在为新 Pod 构建绑定时，会利用为另一个 Pod 生成的 cinterop 绑定。

在设置依赖项之前，你应该声明依赖的 Pod：

```kotlin
// The cinterop of pod("WebImage"):
fun loadImage(): WebImage

// The cinterop of pod("Info"):
fun printImageInfo(image: WebImage)

// Your code:
printImageInfo(loadImage())
```

如果在这种情况下你没有配置 cinterop 之间正确的依赖项，代码将无效，因为 `WebImage` 类型将源自不同的 cinterop 文件，因此也来自不同的包。

## 接下来

* [在 Kotlin 项目和 Xcode 项目之间设置依赖项](multiplatform-cocoapods-xcode.md)
* [查看完整的 CocoaPods Gradle 插件 DSL 参考](multiplatform-cocoapods-dsl-reference.md)