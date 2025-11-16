[//]: # (title: 配置编译项)

Kotlin 多平台项目使用编译项来生成构件。每个目标平台可以有一个或多个编译项，例如用于生产环境和测试目的。

对于每个目标平台，默认编译项包括：

*   `main` 和 `test` 编译项适用于 JVM、JS 和 Native 目标平台。
*   每个 [Android 构建变体](https://developer.android.com/build/build-variants)都有一个 [编译项](#compilation-for-android)，适用于 Android 目标平台。

![Compilations](compilations.svg)

如果你需要编译生产代码和单元测试以外的内容，例如集成测试或性能测试，你可以[创建一个自定义编译项](#create-a-custom-compilation)。

你可以配置构件的生成方式：

*   一次性配置项目中[所有编译项](#configure-all-compilations)。
*   配置[单个目标平台](##configure-compilations-for-one-target)的编译项，因为一个目标平台可以有多个编译项。
*   配置[特定编译项](#configure-one-compilation)。

关于适用于所有或特定目标平台的[编译参数列表](multiplatform-dsl-reference.md#compilation-parameters)和[编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)，请参见相关文档。

## 配置所有编译项

此示例配置了一个在所有目标平台中通用的编译器选项：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 配置单个目标平台的编译项

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</TabItem>
</Tabs>

## 配置特定编译项

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 创建一个自定义编译项

如果你需要编译生产代码和单元测试以外的内容，例如集成测试或性能测试，请创建一个自定义编译项。

对于自定义编译项，你需要手动设置所有依赖项。自定义编译项的默认源代码集不依赖于 `commonMain` 和 `commonTest` 源代码集。

例如，要为 `jvm` 目标平台创建集成测试的自定义编译项，请在 `integrationTest` 和 `main` 编译项之间建立 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关联：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 导入 main 及其类路径作为依赖项并建立内部可见性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // 创建一个测试任务来运行此编译项生成的测试：
                testRuns.create("integration") {
                    // 配置测试任务
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // 导入 main 及其类路径作为依赖项并建立内部可见性
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 创建一个测试任务来运行此编译项生成的测试
            testRuns.create('integration') {
                // 配置测试任务
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</TabItem>
</Tabs>

通过关联编译项，你可以将主编译项的输出添加为依赖项，并在编译项之间建立 `internal` 可见性。

自定义编译项在其他情况下也是必需的。例如，如果你想在最终构件中合并不同 JVM 版本的编译项，或者你已经配置了 Gradle 中的源代码集并希望迁移到多平台项目。

> 要为 [`androidTarget`](#compilation-for-android) 创建自定义编译项，请通过 [Android Gradle plugin](https://developer.android.com/build/build-variants) 设置构建变体。
> 
{style="tip"}

## JVM 编译项

当你在多平台项目中声明 `jvm` 目标平台时，Kotlin Multiplatform Gradle 插件会自动创建 Java 源代码集，并将其包含在 JVM 目标平台的编译项中。

公共源代码集不能包含 Java 资源，因此你应该将它们放在多平台项目的相应子目录中。例如：

![Java source files](java-source-paths.png){width=200}

目前，Kotlin Multiplatform Gradle 插件会替换 Java 插件配置的一些任务：

*   JAR 任务：它不使用标准的 `jar` 任务，而是使用基于构件名称的目标平台特有任务，例如，`jvm()` 目标声明的 `jvmJar` 和 `jvm("desktop")` 的 `desktopJar`。
*   测试任务：它不使用标准的 `test` 任务，而是使用基于构件名称的目标平台特有任务，例如 `jvmTest`。
*   资源处理：资源不再由 `*ProcessResources` 任务处理，而是由相应的编译任务处理。

这些任务在目标平台声明时自动创建。但是，你可以手动定义 JAR 任务并在必要时对其进行配置：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 共享模块的 `build.gradle.kts` 文件
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // 指定 JVM 目标平台
    jvm {
        // 添加用于生成 JAR 的任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任务
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 添加 JVM 特有的依赖项
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
// 共享模块的 `build.gradle` 文件
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // 指定 JVM 目标平台
    jvm {
        // 添加用于生成 JAR 的任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任务
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 添加 JVM 特有的依赖项
            }
        }
    }
}
```

</TabItem>
</Tabs>

此目标平台由 Kotlin Multiplatform Gradle 插件发布，无需 Java 插件特有的步骤。

## 配置与原生语言的互操作

Kotlin 提供[与原生语言的互操作性](https://kotlinlang.org/docs/native-overview.html)以及用于为特定编译项配置此功能的 DSL。

| 原生语言              | 支持的平台                                   | 备注                                                                  |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| C                   | 所有平台                                     |                                                                     |
| Objective-C         | Apple 平台 (macOS, iOS, watchOS, tvOS) |                                                                     |
| 通过 Objective-C 的 Swift | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用带有 `@objc` 属性标记的 Swift 声明。 |

一个编译项可以与多个原生库交互。在[定义文件](https://kotlinlang.org/docs/native-definition-file.html)或构建文件的 [`cinterops` 代码块](multiplatform-dsl-reference.md#cinterops)中配置互操作性，通过可用的属性进行设置：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替换为你所需的目标平台。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 Def 文件。
                // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // 用于放置生成的 Kotlin API 的包。
                packageName("org.sample")
                
                // 通过 cinterop 工具传递给编译器的选项。
                compilerOpts("-Ipath/to/headers")
              
                // 查找头文件的目录。
                includeDirs.apply {
                    // 用于头文件搜索的目录（相当于 -I<path> 编译器选项）。
                    allHeaders("path1", "path2")
                    
                    // 搜索 'headerFilter' def 文件选项中列出的头文件的附加目录。
                    // 相当于 -headerFilterAdditionalSearchPrefix 命令行选项。
                    headerFilterOnly("path1", "path2")
                }
                // includeDirs.allHeaders 的快捷方式。
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 替换为你所需的目标平台。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 Def 文件。
                    // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // 用于放置生成的 Kotlin API 的包。
                    packageName 'org.sample'
                    
                    // 通过 cinterop 工具传递给编译器的选项。
                    compilerOpts '-Ipath/to/headers'
                    
                    // 用于头文件搜索的目录（相当于 -I<path> 编译器选项）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 搜索 'headerFilter' def 文件选项中列出的头文件的附加目录。
                    // 相当于 -headerFilterAdditionalSearchPrefix 命令行选项。
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // includeDirs.allHeaders 的快捷方式。
                    includeDirs("include/directory", "another/directory")
                }
                
                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Android 编译项

为 Android 目标平台创建的默认编译项与 [Android 构建变体](https://developer.android.com/build/build-variants)绑定：每个构建变体都会创建一个同名的 Kotlin 编译项。

然后，对于为每个变体编译的每个 [Android 源代码集](https://developer.android.com/build/build-variants#sourcesets)，会创建一个以目标平台名称作为前缀的 Kotlin 源代码集，例如 Android 源代码集 `debug` 和名为 `androidTarget` 的 Kotlin 目标平台会创建 Kotlin 源代码集 `androidDebug`。这些 Kotlin 源代码集会相应地添加到变体的编译项中。

默认源代码集 `commonMain` 会添加到每个生产环境（应用程序或库）变体的编译项中。`commonTest` 源代码集同样会添加到单元测试和插桩测试变体的编译项中。

也支持使用 [`kapt`](https://kotlinlang.org/docs/kapt.html) 进行注解处理，但由于当前的限制，它要求在配置 `kapt` 依赖项之前创建 Android 目标平台，并且这些依赖项需要在顶层 `dependencies {}` 代码块中配置，而不是在 Kotlin 源代码集依赖项中配置。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 源代码集层级结构的编译

Kotlin 可以使用 `dependsOn` 关系构建[源代码集层级结构](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)。

![Source set hierarchy](jvm-js-main.svg)

如果源代码集 `jvmMain` 依赖于源代码集 `commonMain`，则：

*   无论何时为某个目标平台编译 `jvmMain`，`commonMain` 也会参与该编译，并被编译成相同的目标平台二进制形式，例如 JVM 类文件。
*   `jvmMain` 的源代码可以“看到”`commonMain` 的声明，包括内部声明，并且也可以看到 `commonMain` 的[依赖项](multiplatform-add-dependencies.md)，即使是那些指定为 `implementation` 依赖项的。
*   `jvmMain` 可以包含 `commonMain` [预期声明](multiplatform-expect-actual.md)的平台特有实现。
*   `commonMain` 的资源总是与 `jvmMain` 的资源一起处理和复制。
*   `jvmMain` 和 `commonMain` 的[语言设置](multiplatform-dsl-reference.md#language-settings)应该保持一致。

语言设置的一致性通过以下方式进行检测：
*   `jvmMain` 应该设置一个大于或等于 `commonMain` 的 `languageVersion`。
*   `jvmMain` 应该启用 `commonMain` 启用的所有不稳定语言特性（对于 bugfix 特性没有此要求）。
*   `jvmMain` 应该使用 `commonMain` 使用的所有实验性的注解。
*   `apiVersion`、bugfix 语言特性和 `progressiveMode` 可以任意设置。

## 配置 Gradle 中的 Isolated Projects 特性

> 此[特性](supported-platforms.md#general-kotlin-stability-levels)是实验性的，目前在 Gradle 中处于 pre-alpha 状态。仅在 Gradle 8.10 或更高版本中使用此特性，且仅用于求值目的。此特性可能随时被废弃或更改。我们非常感谢你通过 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 提供反馈。需要显式选择启用（详情参见下文）。
> 
{style="warning"}

Gradle 提供了 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 特性，通过“隔离”各个项目来提高构建性能。此特性将不同项目之间的构建脚本和插件分开，使其可以安全地并行运行。

要启用此特性，请按照 Gradle 的说明[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

关于 Isolated Projects 特性的更多信息，请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/isolated_projects.html)。