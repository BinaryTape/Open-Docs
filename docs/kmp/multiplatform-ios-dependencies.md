[//]: # (title: 添加 iOS 依赖项)

Apple SDK 依赖项（例如 Foundation 或 Core Bluetooth）作为一组预构建库在 Kotlin
多平台项目中可用。它们不需要任何额外配置。

你还可以在 iOS 源代码集中复用 iOS 生态系统中的其他库和 framework。如果它们的 API 通过
`@objc` 属性导出到 Objective-C，Kotlin 支持与 Objective-C 依赖项和 Swift
依赖项的互操作性。纯 Swift 依赖项尚不支持。

要在 Kotlin 多平台项目中处理 iOS 依赖项，你可以使用 [cinterop 工具](#with-cinterop) 管理它们，
或使用 [CocoaPods 依赖项管理器](#with-cocoapods)（不支持纯 Swift Pod）。

### 使用 cinterop

你可以使用 cinterop 工具为 Objective-C 或 Swift 声明创建 Kotlin 绑定。这将允许你从 Kotlin 代码中调用它们。

针对 [库](#add-a-library) 和 [framework](#add-a-framework)，步骤略有不同，
但通用工作流程如下：

1. 下载你的依赖项。
2. 构建它以获取其二进制文件。
3. 创建一个特殊的 `.def` [定义文件](https://kotlinlang.org/docs/native-definition-file.html)，
   该文件会向 cinterop 描述此依赖项。
4. 调整你的构建脚本以在构建期间生成绑定。

#### 添加库

1. 下载库源代码并将其放置在你项目中可引用的位置。
2. 构建库（库作者通常会提供关于如何执行此操作的指南）并获取二进制文件的路径。
3. 在你的项目中，创建一个 `.def` 文件，例如 `DateTools.def`。
4. 将第一行字符串添加到此文件：`language = Objective-C`。如果你想使用纯 C 依赖项，
   请省略 language 属性。
5. 为两个强制属性提供值：

    * `headers` 描述哪些头文件将由 cinterop 处理。
    * `package` 设置这些声明应该放入的包的名称。

   例如：

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 将有关与此库互操作性的信息添加到构建脚本：

    * 传递 `.def` 文件的路径。如果你的 `.def` 文件与 cinterop 同名且放置在
      `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `includeDirs` 选项告诉 cinterop 在哪里查找头文件。
    * 配置链接到库二进制文件。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
                // 链接到库所需的链接器选项
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
                        // .def 文件的路径
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 用于头文件搜索的目录（类似于 -I<path> 编译器选项）
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 链接到库所需的链接器选项
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在你可以在 Kotlin 代码中使用此依赖项了。为此，请导入你在 `.def` 文件中
`package` 属性中设置的包。对于上述示例，它将是：

```kotlin
import DateTools.*
```

> 请参见 [使用 cinterop 工具和 libcurl 库](https://github.com/Kotlin/kotlin-hands-on-intro-kotlin-native) 的示例项目。
>
{style="tip"}

#### 添加 framework

1. 下载 framework 源代码并将其放置在你项目中可引用的位置。
2. 构建 framework（framework 作者通常会提供关于如何执行此操作的指南）并获取二进制文件的路径。
3. 在你的项目中，创建一个 `.def` 文件，例如 `MyFramework.def`。
4. 将第一行字符串添加到此文件：`language = Objective-C`。如果你想使用纯 C 依赖项，
   请省略 language 属性。
5. 为这两个强制属性提供值：

    * `modules` – 应该由 cinterop 处理的 framework 的名称。
    * `package` – 这些声明应该放入的包的名称。

    例如：
    
    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 将有关与 framework 互操作性的信息添加到构建脚本：

    * 传递 `.def` 文件的路径。如果你的 `.def` 文件与 cinterop 同名且放置在
      `src/nativeInterop/cinterop/` 目录中，则可以省略此路径。
    * 使用 `-framework` 选项将 framework 名称传递给编译器和链接器。
      使用 `-F` 选项将 framework 源代码和二进制文件的路径传递给编译器和链接器。

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

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
                // 告诉链接器 framework 所在的位置。
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
                        // .def 文件的路径
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 告诉链接器 framework 所在的位置。
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </TabItem>
    </Tabs>

7. 构建项目。

现在你可以在 Kotlin 代码中使用此依赖项了。为此，请导入你在 `.def` 文件中
`package` 属性中设置的包。对于上述示例，它将是：

```kotlin
import MyFramework.*
```

了解更多关于 [Swift/Objective-C 互操作](https://kotlinlang.org/docs/native-objc-interop.html) 和
[从 Gradle 配置 cinterop](multiplatform-dsl-reference.md#cinterops) 的信息。

### 使用 CocoaPods

1. 执行 [CocoaPods 初始集成设置](multiplatform-cocoapods-overview.md#set-up-an-environment-to-work-with-cocoapods)。
2. 通过在项目 `build.gradle(.kts)` 文件中包含 `pod()` 函数调用，
   添加对你要使用的 CocoaPods 版本库中 Pod 库的依赖项。

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

   你可以添加以下对 Pod 库的依赖项：

   * [来自 CocoaPods 版本库](multiplatform-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [对本地存储的库](multiplatform-cocoapods-libraries.md#on-a-locally-stored-library)
   * [来自自定义 Git 版本库](multiplatform-cocoapods-libraries.md#from-a-custom-git-repository)
   * [来自自定义 Podspec 版本库](multiplatform-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [使用自定义 cinterop 选项](multiplatform-cocoapods-libraries.md#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中运行 **构建** | **重新加载所有 Gradle 项目**
   （或在 Android Studio 中运行 **文件** | **将项目与 Gradle 文件同步**）以重新导入项目。

要在 Kotlin 代码中使用此依赖项，请导入 `cocoapods.<library-name>` 包。对于上述示例，它是：

```kotlin
import cocoapods.SDWebImage.*
```

> * 请参见包含 [在 Kotlin 项目中设置的不同 Pod 依赖项](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample) 的示例项目。
> * 查看示例项目，其中 [一个包含多个目标的 Xcode 项目依赖于 Kotlin 库](https://github.com/Kotlin/kmp-with-cocoapods-multitarget-xcode-sample)。
>
{style="tip"}

## 下一步是什么？

查看有关在多平台项目中添加依赖项的其他资源，并了解更多信息：

* [连接平台库](https://kotlinlang.org/docs/native-platform-libs.html)
* [添加对多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies.md)
* [添加 Android 依赖项](multiplatform-android-dependencies.md)