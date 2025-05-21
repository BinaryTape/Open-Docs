---
title: "添加 iOS 依赖项"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Apple SDK 的依赖项（例如 Foundation 或 Core Bluetooth）在 Kotlin Multiplatform 项目中以一组预构建库的形式提供。它们不需要任何额外的配置。

你还可以在你的 iOS 源码集中重用来自 iOS 生态系统的其他库和框架。Kotlin 支持与 Objective-C 的依赖项以及 Swift 的依赖项的互操作性，如果它们的 API 使用 `@objc` 属性导出到 Objective-C。目前尚不支持纯 Swift 依赖项。

要在 Kotlin Multiplatform 项目中处理 iOS 依赖项，你可以使用 [cinterop 工具](#with-cinterop)来管理它们，或者使用 [CocoaPods 依赖项管理器](#with-cocoapods)（不支持纯 Swift pods）。

### 使用 cinterop

你可以使用 cinterop 工具为 Objective-C 或 Swift 声明创建 Kotlin 绑定。这将允许你从 Kotlin 代码中调用它们。

对于[库](#add-a-library)和[框架](#add-a-framework)，步骤略有不同，但总体工作流程如下所示：

1. 下载你的依赖项。
2. 构建它以获取其二进制文件。
3. 创建一个特殊的 `.def` [定义文件](native-definition-file)，向 cinterop 描述此依赖项。
4. 调整你的构建脚本以在构建期间生成绑定。

#### 添加库

1. 下载库的源代码，并将其放置在你可以从项目中引用的位置。
2. 构建库（库作者通常会提供有关如何执行此操作的指南）并获取二进制文件的路径。
3. 在你的项目中，创建一个 `.def` 文件，例如 `DateTools.def`。
4. 将第一个字符串添加到此文件：`language = Objective-C`。如果要使用纯 C 依赖项，请省略 language 属性。
5. 为两个强制属性提供值：

    * `headers` 描述将由 cinterop 处理的头文件。
    * `package` 设置这些声明应放入的包的名称。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 将有关与此库互操作性的信息添加到构建脚本：

    * 传递 `.def` 文件的路径。如果你的 `.def` 文件与 cinterop 同名，并且位于 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `includeDirs` 选项告诉 cinterop 在哪里查找头文件。
    * 配置与库二进制文件的链接。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件的路径
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 用于头文件搜索的目录（类似于 -I<path> 编译器选项）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 链接器选项，需要链接到库。
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件的路径
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 用于头文件搜索的目录（类似于 -I<path> 编译器选项）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 链接器选项，需要链接到库。
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在你可以在 Kotlin 代码中使用此依赖项。为此，请导入你在 `.def` 文件中的 `package` 属性中设置的包。对于上面的例子，这将是：

```kotlin
import DateTools.*
```

#### 添加框架

1. 下载框架源代码，并将其放置在你可以从项目中引用的位置。
2. 构建框架（框架作者通常会提供有关如何执行此操作的指南）并获取二进制文件的路径。
3. 在你的项目中，创建一个 `.def` 文件，例如 `MyFramework.def`。
4. 将第一个字符串添加到此文件：`language = Objective-C`。如果要使用纯 C 依赖项，请省略 language 属性。
5. 为这两个强制属性提供值：

    * `modules` – 应该由 cinterop 处理的框架的名称。
    * `package` – 这些声明应放入的包的名称。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 将有关与框架互操作性的信息添加到构建脚本：

    * 传递 .def 文件的路径。如果你的 .def 文件与 cinterop 同名，并且位于 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `-framework` 选项将框架名称传递给编译器和链接器。使用 `-F` 选项将框架源和二进制文件的路径传递给编译器和链接器。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件的路径
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 告诉链接器框架的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件的路径
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 告诉链接器框架的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在你可以在 Kotlin 代码中使用此依赖项。为此，请导入你在 package 属性中设置的包。对于上面的例子，这将是：

```kotlin
import MyFramework.*
```

了解更多关于 [Objective-C 和 Swift 互操作](native-objc-interop)和 [从 Gradle 配置 cinterop](multiplatform-dsl-reference#cinterops)。

### 使用 CocoaPods

1. 执行 [初始 CocoaPods 集成设置](native-cocoapods#set-up-an-environment-to-work-with-cocoapods)。
2. 通过在项目的 `build.gradle(.kts)` 中包含 `pod()` 函数调用，添加对你要使用的 CocoaPods 仓库中的 Pod 库的依赖。

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            //..
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            //..
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

   你可以添加以下对 Pod 库的依赖：

   * [从 CocoaPods 仓库](native-cocoapods-libraries#from-the-cocoapods-repository)
   * [在本地存储的库上](native-cocoapods-libraries#on-a-locally-stored-library)
   * [从自定义 Git 仓库](native-cocoapods-libraries#from-a-custom-git-repository)
   * [从自定义 Podspec 仓库](native-cocoapods-libraries#from-a-custom-podspec-repository)
   * [使用自定义 cinterop 选项](native-cocoapods-libraries#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中运行 **Reload All Gradle Projects**（或在 Android Studio 中运行 **Sync Project with Gradle Files**）以重新导入项目。

要在你的 Kotlin 代码中使用依赖项，请导入包 `cocoapods.<library-name>`。对于上面的例子，它是：

```kotlin
import cocoapods.SDWebImage.*
```

## 接下来做什么？

查看有关在多平台项目中添加依赖项的其他资源，并了解更多信息：

* [连接平台库](native-platform-libs)
* [添加对多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies)
* [添加 Android 依赖项](multiplatform-android-dependencies)