---
title: "添加对 Pod 库的依赖"
---
要在 Kotlin 项目和 Pod 库之间添加依赖项，请[完成初始配置](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。然后，您可以添加对不同类型的 Pod 库的依赖项。

当您添加新的依赖项并在 IDE 中重新导入项目时，新的依赖项将自动添加。无需其他步骤。

要将 Kotlin 项目与 Xcode 结合使用，您应该[在项目的 Podfile 中进行更改](native-cocoapods#update-podfile-for-xcode)。

Kotlin 项目需要在 `build.gradle(.kts)` 中调用 `pod()` 函数来添加 Pod 依赖项。每个依赖项都需要单独的函数调用。您可以在该函数的配置块中指定依赖项的参数。

:::note
如果您未指定最低部署目标版本，并且依赖项 Pod 需要更高的部署目标，则会收到错误。

:::

您可以在[此处](https://github.com/Kotlin/kmm-with-cocoapods-sample)找到示例项目。

## 来自 CocoaPods 仓库

1. 在 `pod()` 函数中指定 Pod 库的名称。
   
   在配置块中，您可以使用 `version` 参数指定库的版本。要使用库的最新版本，您可以完全省略此参数。

   > 您可以添加对子规格 (subspecs) 的依赖。
   >
   

2. 指定 Pod 库的最低部署目标版本。

    ```kotlin
    kotlin {
        iosArm64()

        cocoapods {
            version = "2.0"
            ios.deploymentTarget = "16.0"

            summary = "CocoaPods test library"
            homepage = "https://github.com/JetBrains/kotlin"

            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

3. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects** (重新加载所有 Gradle 项目)（或在 Android Studio 中运行 **Sync Project with Gradle Files** (使用 Gradle 文件同步项目)）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`:

```kotlin
import cocoapods.SDWebImage.*
```

## 在本地存储的库上

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定本地 Pod 库的路径：在 `source` 参数值中使用 `path()` 函数。

   > 您也可以添加对子规格 (subspecs) 的本地依赖。
   > `cocoapods` 块可以同时包含对本地存储的 Pod 和来自 CocoaPods 仓库的 Pod 的依赖。
   >
   

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

   > 您还可以使用配置块中的 `version` 参数指定库的版本。
   > 要使用库的最新版本，请省略该参数。
   >
   

3. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects** (重新加载所有 Gradle 项目)（或在 Android Studio 中运行 **Sync Project with Gradle Files** (使用 Gradle 文件同步项目)）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`:

```kotlin
import cocoapods.pod_dependency.*
import cocoapods.subspec_dependency.*
import cocoapods.SDWebImage.*
```

## 来自自定义 Git 仓库

1. 在 `pod()` 函数中指定 Pod 库的名称。

   在配置块中，指定到 git 仓库的路径：在 `source` 参数值中使用 `git()` 函数。

   此外，您可以在 `git()` 之后的块中指定以下参数：
    * `commit` – 使用仓库中的特定提交
    * `tag` – 使用仓库中的特定标签
    * `branch` – 使用仓库中的特定分支

   `git()` 函数按以下顺序优先处理传递的参数：`commit`、`tag`、`branch`。如果您未指定参数，则 Kotlin 插件使用 `master` 分支中的 `HEAD`。

   > 您可以组合 `branch`、`commit` 和 `tag` 参数来获取 Pod 的特定版本。
   >
   

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

3. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects** (重新加载所有 Gradle 项目)（或在 Android Studio 中运行 **Sync Project with Gradle Files** (使用 Gradle 文件同步项目)）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`:

```kotlin
import cocoapods.Alamofire.*
import cocoapods.JSONModel.*
import cocoapods.CocoaLumberjack.*
```

## 来自自定义 Podspec 仓库

1. 使用 `specRepos` 块内的 `url()` 指定自定义 Podspec 仓库的 HTTP 地址。
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

4. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects** (重新加载所有 Gradle 项目)（或在 Android Studio 中运行 **Sync Project with Gradle Files** (使用 Gradle 文件同步项目)）以重新导入项目。

:::note
为了与 Xcode 正确配合使用，您应该在 Podfile 的开头指定 specs 的位置。
例如：
```ruby
source 'https://github.com/Kotlin/kotlin-cocoapods-spec.git'
```

:::

要从 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`:

```kotlin
import cocoapods.example.*
```

## 使用自定义 cinterop 选项

1. 在 `pod()` 函数中指定 Pod 库的名称。
2. 在配置块中，添加以下选项：

   * `extraOpts` – 指定 Pod 库的选项列表。例如，`extraOpts = listOf("-compiler-option")`。
      
      > 如果您遇到 clang 模块的问题，也请添加 `-fmodules` 选项。
      >
     

   * `packageName` – 使用 `import <packageName>` 通过包名直接导入库。

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

4. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects** (重新加载所有 Gradle 项目)（或在 Android Studio 中运行 **Sync Project with Gradle Files** (使用 Gradle 文件同步项目)）以重新导入项目。

要从 Kotlin 代码中使用这些依赖项，请导入包 `cocoapods.<library-name>`:
   
```kotlin
import cocoapods.FirebaseAuth.*
```
   
如果您使用 `packageName` 参数，则可以使用包名 `import <packageName>` 导入库：
   
```kotlin
import FirebaseAuthWrapper.Auth
import FirebaseAuthWrapper.User
```

### 支持带有 @import 指令的 Objective-C 头文件

:::caution
此功能为 [Experimental (实验性)](components-stability#stability-levels-explained)。
它可能随时被删除或更改。 仅用于评估目的。
我们欢迎您在 [YouTrack](https://kotl.in/issue) 中提供有关它的反馈。

:::

一些 Objective-C 库，特别是那些充当 Swift 库包装器的库，在其头文件中具有 `@import` 指令。 默认情况下，cinterop 不提供对这些指令的支持。

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

如果您使用 `pod()` 函数添加对 Pod 的多个依赖项，则当 Pod 的 API 之间存在依赖关系时，可能会遇到问题。

为了使代码在这种情况下能够编译，请使用 `useInteropBindingFrom()` 函数。它在为新 Pod 构建绑定时，利用为另一个 Pod 生成的 cinterop 绑定。

您应该在设置依赖关系之前声明依赖的 Pod：

```kotlin
// pod("WebImage") 的 cinterop:
fun loadImage(): WebImage

// pod("Info") 的 cinterop:
fun printImageInfo(image: WebImage)

// 您的代码:
printImageInfo(loadImage())
```

如果您在这种情况下没有配置正确的 cinterop 之间的依赖关系，则代码将无效，因为 `WebImage` 类型将来自不同的 cinterop 文件，因此来自不同的包。