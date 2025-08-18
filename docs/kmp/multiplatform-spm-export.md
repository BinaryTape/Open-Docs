[//]: # (title: Swift 包导出设置)

<tldr>
   这是一个远程集成方法。它适用于以下情况：<br/>

   * 你希望将最终应用程序的代码库与公共代码库分开。
   * 你已经在本地机器上设置了一个面向 iOS 的 Kotlin Multiplatform 项目。
   * 你在 iOS 项目中使用 Swift 包管理器来处理依赖项。<br/>

   [选择最适合你的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

你可以将 Kotlin/Native 为 Apple 目标平台生成的输出设置为 Swift 包管理器 (SPM) 依赖项进行使用。

假设有一个包含 iOS 目标平台的 Kotlin Multiplatform 项目。你可能希望将此 iOS 二进制文件作为依赖项提供给从事原生 Swift 项目的 iOS 开发者。使用 Kotlin Multiplatform 工具，你可以提供一个能够与他们的 Xcode 项目无缝集成的构件。

本教程展示了如何使用 Kotlin Gradle 插件构建 [XCFramework](multiplatform-build-native-binaries.md#build-xcframeworks) 来实现此目的。

## 设置远程集成

为了使你的 framework 可用，你需要上传两个文件：

* 一个包含 XCFramework 的 ZIP 归档。你需要将其上传到具有直接访问权限的便捷文件存储（例如，通过附加归档创建 GitHub release，使用 Amazon S3 或 Maven）。
  选择最容易集成到你的工作流程中的选项。
* 描述包的 `Package.swift` 文件。你需要将其推送到一个单独的 Git 版本库。

#### 项目配置选项 {initial-collapse-state="collapsed" collapsible="true"}

在本教程中，你将把 XCFramework 作为二进制文件存储在你首选的文件存储中，并将 `Package.swift` 文件存储在一个单独的 Git 版本库中。

但是，你可以以不同的方式配置你的项目。考虑以下组织 Git 版本库的选项：

* 将 `Package.swift` 文件和应打包到 XCFramework 中的代码存储在不同的 Git 版本库中。
  这允许 Swift manifest 与文件所描述的项目分开进行版本控制。这是推荐的方法：它允许可伸缩性，并且通常更容易维护。
* 将 `Package.swift` 文件放在你的 Kotlin Multiplatform 代码旁边。这是一种更直接的方法，但请记住，在这种情况下，Swift 包和代码将使用相同的版本控制。SPM 使用 Git 标签进行包版本控制，这可能与你的项目使用的标签冲突。
* 将 `Package.swift` 文件存储在消费者项目的版本库中。这有助于避免版本控制和维护问题。
  然而，这种方法可能会导致消费者项目在多版本库 SPM 设置和进一步自动化方面的某些问题：

  * 在一个多包项目中，只有一个消费者包可以依赖外部模块（以避免项目内的依赖项冲突）。因此，所有依赖于你的 Kotlin Multiplatform 模块的逻辑都应该封装在一个特定的消费者包中。
  * 如果你使用自动化 CI 流程发布 Kotlin Multiplatform 项目，则此流程需要包含将更新的 `Package.swift` 文件发布到消费者版本库。这可能导致消费者版本库的更新冲突，因此 CI 中的此阶段可能难以维护。

### 配置你的 Multiplatform 项目

在以下示例中，Kotlin Multiplatform 项目的共享代码存储在本地的 `shared` 模块中。
如果你的项目结构不同，请在代码和路径示例中将 “shared” 替换为你的模块名称。

要设置 XCFramework 的发布：

1. 在 iOS 目标平台列表中，使用 `XCFramework` 调用更新你的 `shared/build.gradle.kts` 配置文件：

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
  
   生成的 framework 将作为 `shared/build/XCFrameworks/release/Shared.xcframework` 文件夹创建在你的项目目录中。

   > 如果你正在使用 Compose Multiplatform 项目，请使用以下 Gradle 任务：
   >
   > ```shell
   > ./gradlew :composeApp:assembleSharedXCFramework
   > ```
   >
   > 然后你可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 文件夹中找到生成的 framework。
   >
   {style="tip"}

### 准备 XCFramework 和 Swift 包 manifest

1. 将 `Shared.xcframework` 文件夹压缩为 ZIP 文件，并计算生成归档的校验和，例如：
   
   `swift package compute-checksum Shared.xcframework.zip`

2. 将 ZIP 文件上传到你选择的文件存储。该文件应可通过直接链接访问。例如，以下是使用 GitHub release 的操作方法：
   
   <deflist collapsible="true">
       <def title="上传到 GitHub release">
           <list type="decimal">
               <li>访问 <a href="https://github.com">GitHub</a> 并登录你的账户。</li>
               <li>导航到你希望创建 release 的版本库。</li>
               <li>在右侧的 <b>Releases</b> 部分，点击 <b>Create a new release</b> 链接。</li>
               <li>填写 release 信息，添加或创建新标签，指定 release 标题并撰写描述。</li>
               <li>
                   <p>通过底部的 <b>Attach binaries by dropping them here or selecting them</b> 字段上传包含 XCFramework 的 ZIP 文件：</p>
                   <img src="github-release-description.png" alt="Fill in the release information" width="700"/>
               </li>
               <li>点击 <b>Publish release</b>。</li>
               <li>
                   <p>在 release 的 <b>Assets</b> 部分，右键点击 ZIP 文件并选择 <b>Copy link address</b> 或浏览器中类似选项：</p>
                   <img src="github-release-link.png" alt="Copy the link to the uploaded file" width="500"/>
               </li>
         </list>
       </def>
   </deflist>

3. [推荐] 检测链接是否有效以及文件是否可下载。在终端中，运行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4. 选择任意目录，并在本地创建一个包含以下代码的 `Package.swift` 文件：

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
   
5. 在 `url` 字段中，指定包含 XCFramework 的 ZIP 归档链接。
6. [推荐] 为了验证生成的 manifest，你可以在包含 `Package.swift` 文件的目录中运行以下 shell 命令：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```
    
    如果 manifest 正确，输出将描述发现的任何错误，或显示成功的下载和解析结果。

7. 将 `Package.swift` 文件推送到你的远程版本库。确保创建并推送一个带有包语义版本的 Git 标签。

### 添加包依赖项

现在这两个文件都可访问，你可以将你创建的包的依赖项添加到现有的客户端 iOS 项目中，或者创建一个新项目。要添加包依赖项：

1. 在 Xcode 中，选择 **File | Add Package Dependencies**。
2. 在搜索字段中，输入包含 `Package.swift` 文件的 Git 版本库的 URL：

   ![Specify repo with the package file](multiplatform-spm-url.png)

3. 点击 **Add package** 按钮，然后选择包的产品和相应的目标平台。

   > 如果你正在创建一个 Swift 包，对话框会有所不同。在这种情况下，点击 **Copy package** 按钮。
   > 这会将 `.package` 行复制到你的剪贴板。将此行粘贴到你自己的 `Package.swift` 文件的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 代码块中，并将必要的产品添加到相应的 `Target.Dependency` 代码块中。
   >
   {style="tip"}

### 检测你的设置

为了检测所有设置是否正确，请在 Xcode 中测试导入：

1. 在你的项目中，导航到你的 UI 视图文件，例如 `ContentView.swift`。
2. 用以下代码片段替换现有代码：
   
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
   
    在这里，你导入 `Shared` XCFramework，然后使用它在 `Text` 字段中获取平台名称。

3. 确保预览已更新为新文本。

## 导出多个模块作为 XCFramework

要将来自多个 Kotlin Multiplatform 模块的代码作为 iOS 二进制文件提供，请将这些模块组合到一个单独的伞形模块中。然后，构建并导出此伞形模块的 XCFramework。

例如，你有一个 `network` 模块和一个 `database` 模块，你将它们组合到一个 `together` 模块中：

1. 在 `together/build.gradle.kts` 文件中，指定依赖项和 framework 配置：

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // 与上面的示例相同，增加了依赖项的导出调用
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // 将依赖项设置为 "api"（而非 "implementation"）以导出底层模块
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2. 每个包含的模块都应该配置其 iOS 目标平台，例如：

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
   这是一个临时解决方案，因为如果导出的模块不包含任何源代码，Gradle 脚本目前无法组装 framework。

4. 运行组装 framework 的 Gradle 任务：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5. 按照[上一节](#prepare-the-xcframework-and-the-swift-package-manifest)中的步骤准备 `together.xcframework`：将其归档，计算校验和，将归档的 XCFramework 上传到文件存储，创建并推送 `Package.swift` 文件。

现在，你可以将依赖项导入到 Xcode 项目中。添加 `import together` 指令后，你应该能够从 `network` 和 `database` 模块中导入类，并在 Swift 代码中使用。