[//]: # (title: Swift 包导出设置)

<tldr>
   这是一种远程集成方法。如果满足以下条件，它可能适合您：<br/>

   * 您希望将最终应用程序的代码库与公共代码库分离。
   * 您已在本地机器上设置了一个面向 iOS 的 Kotlin Multiplatform 项目。
   * 您在 iOS 项目中使用 Swift 包管理器来处理依赖项。<br/>

   [选择最适合您的集成方法](multiplatform-ios-integration-overview.md)
</tldr>

您可以将面向 Apple 目标的 Kotlin/Native 输出配置为可被 Swift 包管理器 (SPM) 依赖项使用。

考虑一个包含 iOS 目标的 Kotlin Multiplatform 项目。您可能希望将此 iOS 二进制文件作为依赖项提供给从事原生 Swift 项目的 iOS 开发者。使用 Kotlin Multiplatform 工具，您可以提供一个构件，使其能够无缝集成到他们的 Xcode 项目中。

本教程将展示如何通过 Kotlin Gradle 插件构建 [XCFrameworks](multiplatform-build-native-binaries.md#build-xcframeworks) 来实现这一点。

## 设置远程集成

为了使您的 framework 可用，您需要上传两个文件：

* 一个包含 XCFramework 的 ZIP 归档文件。您需要将其上传到方便且可直接访问的文件存储（例如，通过附加归档文件创建 GitHub 版本发布，使用 Amazon S3 或 Maven）。
  选择最容易集成到您工作流程中的选项。
* 描述该包的 `Package.swift` 文件。您需要将其推送到一个单独的 Git 仓库。

#### 项目配置选项 {initial-collapse-state="collapsed" collapsible="true"}

在本教程中，您将把 XCFramework 以二进制形式存储在您首选的文件存储中，并将 `Package.swift` 文件存储在一个单独的 Git 仓库中。

然而，您可以以不同的方式配置您的项目。考虑以下组织 Git 仓库的选项：

* 将 `Package.swift` 文件和应打包成 XCFramework 的代码存储在不同的 Git 仓库中。
  这允许 Swift 清单与文件所描述的项目分开进行版本控制。这是推荐的方法：它允许伸缩并通常更易于维护。
* 将 `Package.swift` 文件放在您的 Kotlin Multiplatform 代码旁边。这是一种更直接的方法，但请记住，在这种情况下，Swift 包和代码将使用相同的版本控制。SPM 使用 Git 标签进行包的版本控制，这可能与您的项目使用的标签冲突。
* 将 `Package.swift` 文件存储在消费者项目的仓库中。这有助于避免版本控制和维护问题。
  然而，这种方法可能会导致消费者项目中的多仓库 SPM 设置以及进一步自动化的问题：

  * 在多包项目中，只有一个消费者包可以依赖外部模块（以避免项目内的依赖冲突）。因此，所有依赖于您的 Kotlin Multiplatform 模块的逻辑都应封装在一个特定的消费者包中。
  * 如果您使用自动化 CI 流程发布 Kotlin Multiplatform 项目，此流程将需要包含将更新的 `Package.swift` 文件发布到消费者仓库中。这可能导致消费者仓库的更新冲突，因此 CI 中的此类阶段可能难以维护。

### 配置您的 Multiplatform 项目

在以下示例中，Kotlin Multiplatform 项目的共享代码本地存储在 `shared` 模块中。如果您的项目结构不同，请将代码和路径示例中的“shared”替换为您的模块名称。

要设置 XCFramework 的发布：

1.  在 iOS 目标列表中，使用 `XCFramework` 调用更新 `shared/build.gradle.kts` 配置文件：

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework
    
    kotlin {
        // Other Kotlin Multiplatform targets
        // ...
        // 在消费者项目中导入的模块名称
        val xcframeworkName = "Shared"
        val xcf = XCFramework(xcframeworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64(),
        ).forEach { 
            it.binaries.framework {
                baseName = xcframeworkName
                
                // 指定 CFBundleIdentifier 以唯一标识 framework
                binaryOption("bundleId", "org.example.${xcframeworkName}")
                xcf.add(this)
                isStatic = true
            }
        }
        //...
    }
    ```

2.  运行 Gradle 任务以创建 framework：

    ```shell
    ./gradlew :shared:assembleSharedXCFramework
    ```

    生成的 framework 将在您的项目目录下创建为 `shared/build/XCFrameworks/release/Shared.xcframework` 文件夹。

    > 如果您正在使用 Compose Multiplatform 项目，请使用以下 Gradle 任务：
    >
    > ```shell
    > ./gradlew :composeApp:assembleSharedXCFramework
    > ```
    >
    > 然后您可以在 `composeApp/build/XCFrameworks/release/Shared.xcframework` 文件夹中找到生成的 framework。
    >
    {style="tip"}

### 准备 XCFramework 和 Swift 包清单

1.  将 `Shared.xcframework` 文件夹压缩为 ZIP 文件，并计算生成归档文件的校验和，例如：

    `swift package compute-checksum Shared.xcframework.zip`

2.  将 ZIP 文件上传到您选择的文件存储。该文件应可通过直接链接访问。例如，以下是如何在 GitHub 中使用版本发布来完成此操作：

    <deflist collapsible="true">
        <def title="上传到 GitHub 版本发布">
            <list type="decimal">
                <li>访问 <a href="https://github.com">GitHub</a> 并登录您的账户。</li>
                <li>导航到您要创建版本发布的仓库。</li>
                <li>在右侧的 <b>Releases</b>（版本发布）部分，点击 <b>Create a new release</b>（创建新版本发布）链接。</li>
                <li>填写版本发布信息，添加或创建一个新标签，指定版本发布标题并编写描述。</li>
                <li>
                    <p>通过底部的 <b>Attach binaries by dropping them here or selecting them</b>（将二进制文件拖放到此处或选择它们）字段上传包含 XCFramework 的 ZIP 文件：</p>
                    <img src="github-release-description.png" alt="填写版本发布信息" width="700"/>
                </li>
                <li>点击 <b>Publish release</b>（发布版本）。</li>
                <li>
                    <p>在版本发布的 <b>Assets</b>（资产）部分下，右键点击 ZIP 文件并选择 <b>Copy link address</b>（复制链接地址）或您浏览器中的类似选项：</p>
                    <img src="github-release-link.png" alt="复制上传文件的链接" width="500"/>
                </li>
          </list>
        </def>
    </deflist>

3.  [推荐] 检测链接是否可用以及文件是否可以下载。在终端中，运行以下命令：

    ```none
    curl <downloadable link to the uploaded XCFramework ZIP file>
    ```

4.  选择任意目录并在本地创建一个包含以下代码的 `Package.swift` 文件：

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

5.  在 `url` 字段中，指定包含 XCFramework 的 ZIP 归档文件的链接。
6.  [推荐] 要验证生成的清单，您可以在 `Package.swift` 文件所在的目录中运行以下 shell 命令：

    ```shell
    swift package reset && swift package show-dependencies --format json
    ```

    如果清单正确，输出将描述发现的任何错误，或者显示成功下载和解析的结果。

7.  将 `Package.swift` 文件推送到您的远程仓库。确保创建并推送一个带有包的语义版本的 Git 标签。

### 添加包依赖项

现在两个文件都可访问了，您可以将您创建的包的依赖项添加到现有客户端 iOS 项目或创建一个新项目。要添加包依赖项：

1.  在 Xcode 中，选择 **File | Add Package Dependencies**（文件 | 添加包依赖项）。
2.  在搜索字段中，输入包含 `Package.swift` 文件的 Git 仓库的 URL：

    ![指定包含包文件的仓库](multiplatform-spm-url.png)

3.  点击 **Add package**（添加包）按钮，然后为该包选择产品和相应的目标。

    > 如果您正在制作 Swift 包，对话框会有所不同。在这种情况下，点击 **Copy package**（复制包）按钮。
    > 这会将 `.package` 行复制到您的剪贴板中。将此行粘贴到您自己的 `Package.swift` 文件的 [Package.Dependency](https://developer.apple.com/documentation/packagedescription/package/dependency) 代码块中，并将所需产品添加到相应的 `Target.Dependency` 代码块中。
    >
    {style="tip"}

### 检测您的设置

要检测一切是否设置正确，请在 Xcode 中测试导入：

1.  在您的项目中，导航到您的 UI 视图文件，例如 `ContentView.swift`。
2.  用以下代码片段替换现有代码：

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

    在这里，您导入了 `Shared` XCFramework，然后使用它在 `Text` 字段中获取平台名称。

3.  确保预览已更新为新文本。

## 将多个模块导出为 XCFramework

为了使来自多个 Kotlin Multiplatform 模块的代码可用作 iOS 二进制文件，请将这些模块组合到一个单独的伞形模块中。然后，构建并导出此伞形模块的 XCFramework。

例如，您有一个 `network` 模块和一个 `database` 模块，您将它们组合到一个 `together` 模块中：

1.  在 `together/build.gradle.kts` 文件中，指定依赖项和 framework 配置：

    ```kotlin
    kotlin {
        val frameworkName = "together"
        val xcf = XCFramework(frameworkName)
    
        listOf(
            iosX64(),
            iosArm64(),
            iosSimulatorArm64()
        ).forEach { iosTarget ->
            // 与上述示例相同，增加了依赖项的导出调用
            iosTarget.binaries.framework {
                export(projects.network)
                export(projects.database)
    
                baseName = frameworkName
                xcf.add(this)
            }
        }
    
        // 将依赖项设置为“api”（而非“implementation”）以导出底层模块
        sourceSets {
            commonMain.dependencies {
                api(projects.network)
                api(projects.database)
            }
        }
    }
    ```

2.  每个包含的模块都应配置其 iOS 目标，例如：

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

3.  在 `together` 文件夹内创建一个空的 Kotlin 文件，例如 `together/src/commonMain/kotlin/Together.kt`。这是一个变通方案，因为如果导出的模块不包含任何源代码，Gradle 脚本目前无法组装 framework。

4.  运行组装 framework 的 Gradle 任务：

    ```shell
    ./gradlew :together:assembleTogetherReleaseXCFramework
    ```

5.  按照 [上一节](#prepare-the-xcframework-and-the-swift-package-manifest) 中的步骤准备 `together.xcframework`：将其归档，计算校验和，将归档的 XCFramework 上传到文件存储，创建并推送 `Package.swift` 文件。

现在，您可以将依赖项导入 Xcode 项目中。添加 `import together` 指令后，您应该在 Swift 代码中可以导入来自 `network` 和 `database` 模块的类。