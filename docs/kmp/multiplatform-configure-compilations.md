[//]: # (title: 配置编译)

Kotlin 多平台项目使用编译来产出构件。每个目标可以有一个或多个编译，例如，用于生产和测试目的。

对于每个目标，默认编译包括：

* JVM、JS 和 Native 目标的 `main` 和 `test` 编译。
* 对于 Android 目标，每个 [Android 构建变体](https://developer.android.com/build/build-variants) 对应一个 [编译](#compilation-for-android)。

![编译](compilations.svg)

如果你需要编译生产代码和单元测试之外的内容，例如集成测试或性能测试，可以[创建一个自定义编译](#create-a-custom-compilation)。

你可以配置如何在以下范围内产出构件：

* 一次性配置项目中的[所有编译](#configure-all-compilations)。
* [针对一个目标的编译](#configure-compilations-for-one-target)，因为一个目标可以有多个编译。
* [一个特定的编译](#configure-one-compilation)。

请参阅适用于所有或特定目标的[编译参数列表](multiplatform-dsl-reference.md#compilation-parameters)和[编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)。

## 配置所有编译

此示例配置了一个在所有目标中通用的编译器选项：

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

## 配置一个目标的编译

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

## 配置一个特定的编译

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

## 创建一个自定义编译

如果你需要编译生产代码和单元测试之外的内容，例如集成测试或性能测试，请创建自定义编译。

对于自定义编译，你需要手动设置所有依赖项。自定义编译的默认源集不依赖于 `commonMain` 和 `commonTest` 源集。
 
例如，要为 `jvm` 目标的集成测试创建一个自定义编译，请在 `integrationTest` 和 `main` 编译之间设置 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关系：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 将 main 及其类路径作为依赖项导入，并建立内部可见性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
            }

            // 创建一个测试任务来运行由此编译产生的测试：
            testRuns.create("integration") {
                // 配置测试任务
                setExecutionSourceFrom(integrationTest)
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
            // 将 main 及其类路径作为依赖项导入，并建立内部可见性
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
        }

        // 创建一个测试任务来运行由此编译产生的测试
        testRuns.create('integration') {
            // 配置测试任务
            setExecutionSourceFrom(compilations.integrationTest)
        }
    }
}
```

</TabItem>
</Tabs>

通过关联编译，你可以将 main 编译的输出添加为依赖项，并在编译之间建立 `internal` 可见性。

在其他情况下也需要自定义编译。例如，如果你想在最终构件中合并不同 JVM 版本的编译，或者你已经在 Gradle 中设置了源集并希望迁移到多平台项目。

> 要为 [`android`](#compilation-for-android) 创建自定义编译，请通过 [Android Gradle 插件](https://developer.android.com/build/build-variants)设置构建变体。
> 
{style="tip"}

## JVM 编译

当你在多平台项目中声明 `jvm` 目标时，Kotlin Multiplatform Gradle 插件会自动创建 Java 源集并将其包含在 JVM 目标的编译中。

通用源集不能包含 Java 资源，因此你应该将它们放在多平台项目相应的子目录中。例如：

![Java 源文件](java-source-paths.png){width=200}

目前，Kotlin Multiplatform Gradle 插件替换了 Java 插件配置的一些任务：

* JAR 任务：不使用标准的 `jar`，而是根据构件的名称使用特定于目标的任务，例如，`jvm()` 目标声明对应 `jvmJar`，而 `jvm("desktop")` 对应 `desktopJar`。
* 测试任务：不使用标准的 `test`，而是使用根据构件名称确定的特定于目标的任务，例如 `jvmTest`。
* 资源处理：资源由相应的编译任务处理，而不是通过 `*ProcessResources` 任务。

这些任务在声明目标时会自动创建。但是，如果需要，你可以手动定义 JAR 任务并对其进行配置：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
// 共享模块的 `build.gradle.kts` 文件
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // 指定 JVM 目标
    jvm {
        // 添加用于生成 JAR 的任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任务
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 添加特定于 JVM 的依赖项
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
    // 指定 JVM 目标
    jvm {
        // 添加用于生成 JAR 的任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置任务
        }
    }

    sourceSets {
        jvmMain {
            dependencies {
                // 添加特定于 JVM 的依赖项
            }
        }
    }
}
```

</TabItem>
</Tabs>

此目标由 Kotlin Multiplatform Gradle 插件发布，不需要特定于 Java 插件的步骤。

## 配置与原生语言的互操作性

Kotlin 提供了[与原生语言的互操作性](https://kotlinlang.org/docs/native-overview.html)以及用于为特定编译进行配置的 DSL。

| 原生语言 | 支持的平台 | 备注 |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C | 所有平台 | |
| Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | |
| 通过 Objective-C 使用 Swift | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用标记了 `@objc` 特性的 Swift 声明。 |

一个编译可以与多个原生库进行交互。在[定义文件](https://kotlinlang.org/docs/native-definition-file.html)中或在构建文件的 [`cinterops` 块](multiplatform-dsl-reference.md#cinterops)中配置可用属性的互操作性：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替换为你需要的目标。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的 def 文件。
                // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // 放置生成的 Kotlin API 的软件包。
                packageName("org.sample")
                
                // cinterop 工具传递给编译器的选项。
                compilerOpts("-Ipath/to/headers")
              
                // 查找头文件的目录。
                includeDirs.apply {
                    // 头文件搜索目录（相当于 -I<path> 编译器选项）。
                    allHeaders("path1", "path2")
                    
                    // 搜索 'headerFilter' def 文件选项中列出的头文件的额外目录。
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
    linuxX64 { // 替换为你需要的目标。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的 def 文件。
                    // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // 放置生成的 Kotlin API 的软件包。
                    packageName 'org.sample'
                    
                    // cinterop 工具传递给编译器的选项。
                    compilerOpts '-Ipath/to/headers'
                    
                    // 头文件搜索目录（相当于 -I<path> 编译器选项）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 搜索 'headerFilter' def 文件选项中列出的头文件的额外目录。
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

## Android 编译 
 
默认情况下，为 Android 目标创建的编译与 [Android 构建变体](https://developer.android.com/build/build-variants)绑定：对于每个构建变体，都会创建一个同名的 Kotlin 编译。

然后，对于为每个变体编译的每个 [Android 源集](https://developer.android.com/build/build-variants#sourcesets)，都会创建一个 Kotlin 源集，其名称为目标名称前缀加上该源集名称，例如 Android 源集 `debug` 对应 Kotlin 源集 `androidDebug`（假设 Kotlin 目标名为 `android`）。这些 Kotlin 源集会相应地添加到变体的编译中。

默认源集 `commonMain` 会被添加到每个生产（应用或库）变体的编译中。`commonTest` 源集类似地被添加到单元测试和检测测试变体的编译中。

也支持使用 [`kapt`](https://kotlinlang.org/docs/kapt.html) 进行注解处理，但由于目前的限制，它要求在配置 `kapt` 依赖项之前创建 Android 目标，且必须在顶层 `dependencies {}` 块中完成，而不是在 Kotlin 源集依赖项中。

```kotlin
kotlin {
    android { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 源集层次结构的编译 

Kotlin 可以通过 `dependsOn` 关系构建[源集层次结构](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)。

![源集层次结构](jvm-js-main.svg)

如果源集 `jvmMain` 依赖于源集 `commonMain`，那么：

* 每当为特定目标编译 `jvmMain` 时，`commonMain` 也会参与该编译，并被编译成相同的目标二进制形式，例如 JVM 类文件。
* `jvmMain` 的源码可以“看到” `commonMain` 的声明，包括内部声明，还可以看到 `commonMain` 的[依赖项](multiplatform-add-dependencies.md)，甚至是那些被指定为 `implementation` 的依赖项。
* `jvmMain` 可以包含 `commonMain` 的[预期声明](multiplatform-expect-actual.md)的平台特定实现。
* `commonMain` 的资源总是与 `jvmMain` 的资源一起被处理和复制。
* `jvmMain` 和 `commonMain` 的[语言设置](multiplatform-dsl-reference.md#language-settings)应该保持一致。

语言设置通过以下方式检查一致性：
* `jvmMain` 设置的 `languageVersion` 应该大于或等于 `commonMain` 的版本。
* `jvmMain` 应该启用 `commonMain` 启用的所有不稳定语言功能（对错误修复功能没有此类要求）。
* `jvmMain` 应该使用 `commonMain` 使用的所有实验性注解。
* `apiVersion`、错误修复语言功能和 `progressiveMode` 可以任意设置。

## 在 Gradle 中配置隔离项目（Isolated Projects）功能

> 此功能是[实验性功能](supported-platforms.md#general-kotlin-stability-levels)，目前在 Gradle 中处于 pre-alpha 状态。仅在 Gradle 8.10 或更高版本中使用它，且仅用于评估目的。该功能随时可能被删除或更改。我们欢迎你在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 上提供反馈。需要选择加入（详情见下文）。
> 
{style="warning"}

Gradle 提供了[隔离项目](https://docs.gradle.org/current/userguide/isolated_projects.html)功能，通过将各个项目相互“隔离”来提高构建性能。该功能分离了项目之间的构建脚本和插件，允许它们安全地并行运行。

要启用此功能，请按照 Gradle 的说明[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

有关隔离项目功能的更多信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/isolated_projects.html)。