[//]: # (title: 添加 iOS 依赖项)

Apple SDK 依赖项（例如 Foundation 或 Core Bluetooth）在 Kotlin 多平台项目中作为一组预构建库提供。它们不需要任何额外配置。

您还可以在 iOS 源集中复用 iOS 生态系统中的其他库和框架。如果 Swift 依赖项的 API 已通过 `@objc` 特性导出到 Objective-C，则 Kotlin 支持与 Objective-C 依赖项和 Swift 依赖项的互操作性。目前尚不支持纯 Swift 依赖项。

要处理 Kotlin 多平台项目中的 iOS 依赖项，您可以使用 [cinterop 工具](#with-cinterop)进行管理，或者使用 [CocoaPods 依赖管理器](#with-cocoapods)（不支持纯 Swift Pod）。

### 使用 cinterop

您可以使用 cinterop 工具为 Objective-C 或 Swift 声明创建 Kotlin 绑定。这将允许您从 Kotlin 代码中调用它们。

[库](#add-a-library)和[框架](#add-a-framework)的步骤略有不同，但总体工作流如下：

1. 下载您的依赖项。
2. 构建它以获取其二进制文件。
3. 创建一个特殊的 `.def` [定义文件](https://kotlinlang.org/docs/native-definition-file.html)，向 cinterop 描述该依赖项。
4. 调整构建脚本以在构建期间生成绑定。

#### 添加库

1. 下载库源代码并将其放置在可以从项目中引用到的位置。
2. 构建库（库作者通常会提供关于如何执行此操作的指南）并获取二进制文件的路径。
3. 在您的项目中，创建一个 `.def` 文件，例如 `DateTools.def`。
4. 在该文件中添加第一行：`language = Objective-C`。如果您想使用纯 C 依赖项，请省略 `language` 属性。
5. 为两个强制属性提供值：

    * `headers` 描述哪些头文件将由 cinterop 处理。
    * `package` 设置应将这些声明放入的软件包名称。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 在构建脚本中添加关于与该库互操作的信息：

    * 传递 `.def` 文件的路径。如果您的 `.def` 文件与 cinterop 同名且放置在 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `includeDirs` 选项告诉 cinterop 在何处查找头文件。
    * 配置与库二进制文件的链接。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // Directories for header search (an analogue of the -I<path> compiler option)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // Directories for header search (an analogue of the -I<path> compiler option)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Linker options required to link to the library.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在您可以在 Kotlin 代码中使用该依赖项。为此，请导入您在 `.def` 文件的 `package` 属性中设置的软件包。对于上述示例，它将是：

```kotlin
import DateTools.*
```

> 请参阅[使用 cinterop 工具和 libcurl 库](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)的示例项目。
>
{style="tip"}

#### 添加框架

1. 下载框架源代码并将其放置在可以从项目中引用到的位置。
2. 构建框架（框架作者通常会提供关于如何执行此操作的指南）并获取二进制文件的路径。
3. 在您的项目中，创建一个 `.def` 文件，例如 `MyFramework.def`。
4. 在该文件中添加第一行：`language = Objective-C`。如果您想使用纯 C 依赖项，请省略 `language` 属性。
5. 为这两个强制属性提供值：

    * `modules` – 应由 cinterop 处理的框架名称。
    * `package` – 应将这些声明放入的软件包名称。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 在构建脚本中添加关于与框架互操作的信息：

    * 传递 .def 文件的路径。如果您的 `.def` 文件与 cinterop 同名且放置在 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `-framework` 选项将框架名称传递给编译器和链接器。使用 `-F` 选项将框架源文件和二进制文件的路径传递给编译器和链接器。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // Path to the .def file
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // Path to the .def file
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // Tell the linker where the framework is located.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在您可以在 Kotlin 代码中使用该依赖项。为此，请导入您在 `.def` 文件的 `package` 属性中设置的软件包。对于上述示例，它将是：

```kotlin
import MyFramework.*
```

详细了解 [Swift/Objective-C 互操作性](https://kotlinlang.org/docs/native-objc-interop.html)以及[从 Gradle 配置 cinterop](multiplatform-dsl-reference.md#cinterops)。

### 使用 CocoaPods

1. 执行[初始 CocoaPods 集成设置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
2. 通过在项目的 `build.gradle(.kts)` 中包含 `pod()` 函数调用，添加对您想要使用的 CocoaPods 仓库中 Pod 库的依赖。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
    <TabItem title="Groovy" group-key="groovy">

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

   您可以添加以下对 Pod 库的依赖：

   * [来自 CocoaPods 仓库](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [针对本地存储的库](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   * [来自自定义 Git 仓库](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   * [来自自定义 Podspec 仓库](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [带有自定义 cinterop 选项](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**）以重新导入项目。

要在 Kotlin 代码中使用该依赖项，请导入软件包 `cocoapods.<library-name>`。对于上述示例，它是：

```kotlin
import cocoapods.SDWebImage.*
```

> * 请参阅[在 Kotlin 项目中设置了不同 Pod 依赖项](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的示例项目。
> * 查看[带有多个目标的 Xcode 项目依赖于 Kotlin 库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)的示例项目。
> 
{style="tip"}

## 后续步骤

查看关于在多平台项目中添加依赖项的其他资源，并详细了解：

* [连接平台库](https://kotlinlang.org/docs/native-platform-libs.html)
* [添加多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies.md)
* [添加 Android 依赖项](multiplatform-android-dependencies.md)