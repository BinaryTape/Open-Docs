---
title: "Swift 包导出设置"
---
:::info

   这是一种远程集成方法。如果以下情况，它可能适合你：<br/>

   * 你希望将最终应用程序的代码库与通用代码库分开。
   * 你已经在本地机器上设置了一个以 iOS 为目标的 Kotlin Multiplatform 项目。
   * 你使用 Swift 包管理器 (SPM, Swift Package Manager) 来处理 iOS 项目中的依赖项。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview)

:::

你可以设置 Kotlin/Native 的 Apple 目标输出，以便作为 Swift 包管理器 (SPM, Swift Package Manager) 依赖项使用。

考虑一个具有 iOS 目标的 Kotlin Multiplatform 项目。 你可能希望将此 iOS 二进制文件作为依赖项提供给从事原生 Swift 项目的 iOS 开发人员。 使用 Kotlin Multiplatform 工具，你可以提供一个可以与他们的 Xcode 项目无缝集成的工件 (artifact)。

本教程展示了如何通过使用 Kotlin Gradle 插件构建 [XCFrameworks](multiplatform-build-native-binaries#build-xcframeworks) 来实现这一点。

## 设置远程集成

为了使你的 framework 可用，你需要上传两个文件：

* 包含 XCFramework 的 ZIP 压缩包。 你需要将其上传到具有直接访问权限的便捷文件存储位置（例如，
  创建一个附加了压缩包的 GitHub 发布版本，使用 Amazon S3 或 Maven）。
  选择最容易集成到你的工作流程中的选项。
* 描述包的 `Package.swift` 文件。 你需要将其推送到单独的 Git 仓库。

#### 项目配置选项

在本教程中，你将 XCFramework 作为二进制文件存储在你喜欢的的文件存储中，并将 `Package.swift` 文件存储在单独的 Git 仓库中。

但是，你可以不同地配置你的项目。 考虑以下组织 Git 仓库的选项：

* 将 `Package.swift` 文件和应打包到 XCFramework 中的代码存储在单独的 Git 仓库中。
  这允许独立于文件描述的项目来对 Swift 清单进行版本控制。 这是推荐的方法：
  它允许扩展并且通常更容易维护。
* 将 `Package.swift` 文件放在 Kotlin Multiplatform 代码旁边。 这是一个更直接的方法，但
  请记住，在这种情况下，Swift 包和代码将使用相同的版本控制。 SPM 使用
  Git 标签来对包进行版本控制，这可能会与用于项目的标签冲突。
* 将 `Package.swift` 文件存储在消费者项目的仓库中。 这有助于避免版本控制和维护问题。
  但是，这种方法可能会导致消费者项目的多仓库 SPM 设置和进一步自动化的问题：

  * 在多包项目中，只有一个消费者包可以依赖于外部模块（以避免依赖冲突
    在项目内）。 因此，所有依赖于你的 Kotlin Multiplatform 模块的逻辑都应封装在
    特定的消费者包中。
  * 如果你使用自动化的 CI 流程发布 Kotlin Multiplatform 项目，则此流程需要包括
    将更新的 `Package.swift` 文件发布到消费者仓库。 这可能会导致消费者仓库的冲突更新，因此 CI 中的此类阶段可能难以维护。

### 配置你的 multiplatform 项目

在以下示例中，Kotlin Multiplatform 项目的共享代码本地存储在 `shared` 模块中。
如果你的项目结构不同，请在代码和路径示例中使用你的模块名称替换 "shared"。

要设置 XCFramework 的发布：

1. 使用 iOS 目标列表中的 `XCFramework` 调用更新你的 `shared/build.gradle.kts` 配置文件：

   ```kotlin
   import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
   
   kotlin {
       // Other Kotlin Multiplatform targets
       // ...
       // Name of the module to be imported in the consumer project
       val xcframeworkName = "Shared"
       val xcf = XCFramework(xcframeworkName)
   
       listOf(
           iosX64(),
           iosArm64(),
           iosSimulatorArm64(),
       ).forEach { 
           it.binaries.framework {
               baseName = xcframeworkName
               
               // Specify CFBundleIdentifier to uniquely identify the framework
               binaryOption("bundleId", "org.example.${xcframeworkName}")
               xcf.add(this)
               isStatic = true
           }
       }
       //...
   }
   ```
   
2. 运行 Gradle 任务以创建 framework：
   
   ```shell
   ./gradlew :shared:assembleSharedXCFramework
   ```
  
   生成的 framework 将在你的项目目录中创建为 `shared/build/XCFrameworks/release/Shared.xcframework` 文件夹。

   > 如果你使用 Compose Multiplatform 项目，请使用以下 Gradle 任务：
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 然后，你可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 文件夹中找到生成的 framework。
   >
   

### 准备 XCFramework 和 Swift 包清单

1. 将 `Shared.xcframework` 文件夹压缩到一个 ZIP 文件中，并计算生成的压缩包的校验和，例如：
   
   `swift package compute-checksum Shared.xcframework.zip`

2. 将 ZIP 文件上传到你选择的文件存储位置。 该文件应该是可以通过直接链接访问的。 例如，以下是如何使用 GitHub 中的发布版本来执行此操作：
<h3>上传到 GitHub 发布版本</h3>
<list type="decimal">
<li>转到 <a href="https://github.com">GitHub</a> 并登录到你的帐户。</li>
<li>导航到你要创建发布版本的仓库。</li>
<li>在右侧的 <b>Releases</b> 部分中，单击 <b>Create a new release</b> 链接。</li>
<li>填写发布信息，添加或创建一个新标签，指定发布标题并编写描述。</li>
<li>
<p>
   通过底部的 <b>Attach binaries by dropping them here or selecting them</b> 字段上传包含 XCFramework 的 ZIP 文件：
</p>
                   <img src="/img/github-release-description.png" alt="Fill in the release information" width="700"/>
               </li>
<li>单击 <b>Publish release</b>。</li>
<li>
<p>
   在发布的 <b>Assets</b> 部分下，右键单击 ZIP 文件，然后在浏览器中选择 <b>Copy link address</b> 或类似的选项：
</p>
                   <img src="/img/github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
               </li>
</list>
       
   

3. [推荐] 检查链接是否有效以及是否可以下载该文件。 在终端中，运行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4. 选择任何目录，并在本地创建一个包含以下代码的 `Package.swift` 文件：

   ```Swift
   // swift-tools-version:5.3
   import PackageDescription
    
   let package = Package(
      name: "Shared",
      platforms: [
        .iOS(.v14),
      ],
      products: [
         .library(name: "Shared", targets: ["Shared"])
      ],
      targets: [
         .binaryTarget(
            name: "Shared",
            url: "<link to the uploaded XCFramework ZIP file>",
            checksum:"<checksum calculated for the ZIP file>")
      ]
   )
   ```
   
5. 在 `url` 字段中，指定指向包含 XCFramework 的 ZIP 压缩包的链接。
6. [推荐] 为了验证生成的清单，你可以在带有 `Package.swift` 文件的目录中运行以下 shell 命令：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    该输出将描述找到的任何错误，或者如果清单正确，则显示成功的下载和解析结果。

7. 将 `Package.swift` 文件推送到你的远程仓库。 确保创建并推送带有
   包的语义版本的 Git 标签。

### 添加包依赖项

现在这两个文件都可以访问，你可以将对你创建的包的依赖项添加到现有的客户端 iOS
项目中，或创建一个新项目。 要添加包依赖项：

1. 在 Xcode 中，选择 **File | Add Package Dependencies**。
2. 在搜索字段中，输入 Git 仓库的 URL，其中包含 `Package.swift` 文件：

   <img src="/img/native-spm-url.png" alt="Specify repo with the package file" style={{verticalAlign: 'middle'}}/>

3. 按下 **Add package** 按钮，然后选择包的产品和相应的目标。

   > 如果你正在制作一个 Swift 包，则对话框会有所不同。 在这种情况下，按下 **Copy package** 按钮。
   > 这将在你的剪贴板中放入一个 `.package` 行。 将此行粘贴到你的 `Package.swift` 文件的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency)
   > 块中，并将必要的产品添加到相应的 `Target.Dependency` 块中。
   >
   

### 检查你的设置

要检查所有设置是否正确，请在 Xcode 中测试导入：

1. 在你的项目中，导航到你的 UI 视图文件，例如 `ContentView.swift`。
2. 将代码替换为以下代码段：
   
    ```Swift
    import SwiftUI
    import Shared
    
    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)
                Text("Hello, world! \(Shared.Platform_iosKt.getPlatform().name)")
            }
            .padding()
        }
    }
    
    #Preview {
        ContentView()
    }
    ```
   
    在这里，你导入 `Shared` XCFramework，然后使用它来获取 `Text` 字段中的平台名称。

3. 确保使用新文本更新预览。

## 将多个模块导出为一个 XCFramework

要使来自多个 Kotlin Multiplatform 模块的代码可以作为 iOS 二进制文件使用，请将这些模块组合在一个
伞状模块中。 然后，构建和导出此伞状模块的 XCFramework。

例如，你有一个 `network` 和一个 `database` 模块，你将它们组合在一个 `together` 模块中：

1. 在 `together/build.gradle.kts` 文件中，指定依赖项和 framework 配置：

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget `->`
            // Same as in the example above,
            // with added export calls for dependencies
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // Dependencies set as "api" (as opposed to "implementation") to export underlying modules
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2. 每个包含的模块都应配置其 iOS 目标，例如：

    ```kotlin
    kotlin {
        androidTarget {
            //...
        }
        
        iosX64()
        iosArm64()
        iosSimulatorArm64()
        
        //...
    }
    ```

3. 在 `together` 文件夹中创建一个空的 Kotlin 文件，例如 `together/src/commonMain/kotlin/Together.kt`。
   这是一个解决方法，因为如果导出的模块不包含任何源代码，则 Gradle 脚本当前无法组装 framework。

4. 运行组装 framework 的 Gradle 任务：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. 按照[上一节](#prepare-the-xcframework-and-the-swift-package-manifest)中的步骤准备
   `together.xcframework`：将其归档，计算校验和，将归档的 XCFramework 上传到文件存储，
   创建并推送 `Package.swift` 文件。

现在，你可以将依赖项导入到 Xcode 项目中。 添加 `import together` 指令后，
你应该可以使用来自 `network` 和 `database` 模块的类在 Swift 代码中进行导入。