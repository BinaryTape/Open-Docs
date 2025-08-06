[//]: # (title: 添加 iOS 依赖项)

Apple SDK 依赖项（例如 Foundation 或 Core Bluetooth）在 Kotlin Multiplatform 项目中作为一组预构建库提供。它们不需要任何额外配置。

你还可以在 iOS 源代码集中重用 iOS 生态系统中的其他库和 framework。如果 Objective-C 依赖项和 Swift 依赖项的 API 使用 `@objc` 属性导出到 Objective-C，Kotlin 支持与它们进行互操作。纯 Swift 依赖项尚不支持。

要在 Kotlin Multiplatform 项目中处理 iOS 依赖项，你可以使用 [cinterop 工具](#with-cinterop)来管理它们，或者使用 [CocoaPods 依赖项管理器](#with-cocoapods)（不支持纯 Swift pod）。

### 使用 cinterop

你可以使用 cinterop 工具为 Objective-C 或 Swift 声明创建 Kotlin 绑定。这将允许你从 Kotlin 代码中调用它们。

[库](#add-a-library)和 [framework](#add-a-framework) 的步骤略有不同，但通用工作流如下：

1.  下载你的依赖项。
2.  构建它以获取其二进制文件。
3.  创建一个特殊的 `.def` [定义文件](https://kotlinlang.org/docs/native-definition-file.html)，用于向 cinterop 描述此依赖项。
4.  调整你的构建脚本以在构建期间生成绑定。

#### 添加库

1.  下载库源代码，并将其放置在你可以从项目引用它的位置。
2.  构建库（库的作者通常会提供指导如何执行此操作），并获取二进制文件的路径。
3.  在你的项目中，创建一个 `.def` 文件，例如 `DateTools.def`。
4.  将以下字符串添加到此文件：`language = Objective-C`。如果你想使用纯 C 依赖项，请省略 language 属性。
5.  为两个强制性属性提供值：

    *   `headers` 描述了哪些头文件将由 cinterop 处理。
    *   `package` 设置了这些声明应放入的包名。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6.  将与此库的互操作性信息添加到构建脚本：

    *   传递 `.def` 文件的路径。如果你的 `.def` 文件与 cinterop 具有相同的名称并且放置在 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    *   使用 `includeDirs` 选项告知 cinterop 在哪里查找头文件。
    *   配置链接到库二进制文件。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件的路径
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 头文件搜索目录（类似于 -I<path> 编译器选项）
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 链接到库所需的链接器选项。
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件的路径
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 头文件搜索目录（类似于 -I<path> 编译器选项）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 链接到库所需的链接器选项。
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  构建项目。

现在你可以在 Kotlin 代码中使用此依赖项。为此，请导入你在 `.def` 文件的 `package` 属性中设置的包。对于上面的示例，这将是：

```kotlin
import DateTools.*
```

> 请参阅示例项目，该项目[使用了 cinterop 工具和 libcurl 库](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native)。
>
{style="tip"}

#### 添加 framework

1.  下载 framework 源代码，并将其放置在你可以从项目引用它的位置。
2.  构建 framework（framework 的作者通常会提供指导如何执行此操作），并获取二进制文件的路径。
3.  在你的项目中，创建一个 `.def` 文件，例如 `MyFramework.def`。
4.  将以下字符串添加到此文件：`language = Objective-C`。如果你想使用纯 C 依赖项，请省略 language 属性。
5.  为这些两个强制性属性提供值：

    *   `modules` – 应该由 cinterop 处理的 framework 的名称。
    *   `package` – 这些声明应放入的包名。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6.  将与 framework 的互操作性信息添加到构建脚本：

    *   传递 `.def` 文件的路径。如果你的 `.def` 文件与 cinterop 具有相同的名称并且放置在 `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    *   使用 `-framework` 选项将 framework 名称传递给编译器和链接器。使用 `-F` 选项将 framework 源代码和二进制文件的路径传递给编译器和链接器。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

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
                // 告知链接器 framework 的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

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
                // 告知链接器 framework 的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7.  构建项目。

现在你可以在 Kotlin 代码中使用此依赖项。为此，请导入你在 `.def` 文件的 package 属性中设置的包。对于上面的示例，这将是：

```kotlin
import MyFramework.*
```

了解更多关于 [Swift/Objective-C 互操作](https://kotlinlang.org/docs/native-objc-interop.html)和 [从 Gradle 配置 cinterop](multiplatform-dsl-reference.md#cinterops)。

### 使用 CocoaPods

1.  执行[初始 CocoaPods 集成设置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
2.  通过在项目的 `build.gradle(.kts)` 中包含 `pod()` 函数调用，添加对你想要使用的来自 CocoaPods 仓库的 Pod 库的依赖项。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

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

    </tab>
    <tab title="Groovy" group-key="groovy">

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

    </tab>
    </tabs>

   你可以添加以下 Pod 库的依赖项：

   *   [来自 CocoaPods 仓库](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   *   [本地存储的库](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   *   [来自自定义 Git 仓库](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   *   [来自自定义 Podspec 仓库](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   *   [使用自定义 cinterop 选项](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3.  在 IntelliJ IDEA 中运行 **Build** | **Reload All Gradle Projects**（或在 Android Studio 中运行 **File** | **Sync Project with Gradle Files**），以重新导入项目。

要在 Kotlin 代码中使用此依赖项，请导入 `cocoapods.<library-name>` 包。对于上面的示例，它是：

```kotlin
import cocoapods.SDWebImage.*
```

> *   请参阅示例项目，该项目[在 Kotlin 项目中设置了不同 Pod 依赖项](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。
> *   查看示例项目，其中[一个带有多个目标 (target) 的 Xcode 项目依赖于 Kotlin 库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。
> 
{style="tip"}

## 接下来？

查看其他关于在 multiplatform 项目中添加依赖项的资源，并了解更多关于：

*   [连接平台库](https://kotlinlang.org/docs/native-platform-libs.html)
*   [添加对 multiplatform 库或其他 multiplatform 项目的依赖项](multiplatform-add-dependencies.md)
*   [添加 Android 依赖项](multiplatform-android-dependencies.md)