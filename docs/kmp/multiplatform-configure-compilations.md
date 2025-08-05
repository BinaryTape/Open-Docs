[//]: # (title: 配置编译项)

Kotlin 多平台项目使用编译项来生成构件。每个目标可以有一个或多个编译项，例如用于生产和测试目的。

对于每个目标，默认编译项包括：

* `main` 和 `test` 编译项（用于 JVM、JS 和 Native 目标）。
* 每个 [Android 构建变体](https://developer.android.com/build/build-variants) 一个 [编译项](#compilation-for-android)（用于 Android 目标）。

![编译项](compilations.svg)

如果你需要编译生产代码和单元测试之外的内容，例如集成测试或性能测试，你可以[创建自定义编译项](#create-a-custom-compilation)。

你可以配置构件的生成方式，在：

* 一次性配置项目中的[所有编译项](#configure-all-compilations)。
* [单个目标的编译项](#configure-compilations-for-one-target)，因为一个目标可以有多个编译项。
* [特定编译项](#configure-one-compilation)。

关于[编译参数列表](multiplatform-dsl-reference.md#compilation-parameters)和适用于所有目标或特定目标的[编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)，请参见相应文档。

## 配置所有编译项

此示例配置一个适用于所有目标的编译器选项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 配置单个目标的编译项

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilerOptions {
            jvmTarget.set(JvmTarget.JVM_1_8)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilerOptions {
            jvmTarget = JvmTarget.JVM_1_8
        }
    }
}
```

</tab>
</tabs>

## 配置特定编译项

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 创建自定义编译项

如果你需要编译生产代码和单元测试之外的内容，例如集成测试或性能测试，请创建自定义编译项。

对于自定义编译项，你需要手动设置所有依赖项。自定义编译项的默认源代码集不依赖于 `commonMain` 和 `commonTest` 源代码集。
 
例如，要为 `jvm` 目标的集成测试创建自定义编译项，请在 `integrationTest` 和 `main` 编译项之间建立 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关系：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

通过关联编译项，你将主编译项的输出添加为依赖项，并在编译项之间建立 `internal` 可见性。

在其他情况下，自定义编译项也是必要的。例如，如果你想在最终构件中组合不同 JVM 版本的编译项，或者你已经在 Gradle 中设置了源代码集并想迁移到多平台项目。

> 要为 [`androidTarget`](#compilation-for-android) 创建自定义编译项，请通过 [Android Gradle 插件](https://developer.android.com/build/build-variants) 设置构建变体。
> 
{style="tip"}

## JVM 编译

当你在多平台项目中声明 `jvm` 目标时，Kotlin Multiplatform 插件会自动创建 Java 源代码集，并将其包含在 JVM 目标的编译项中。

公共源代码集不能包含 Java 资源，因此你应该将它们放置在多平台项目的相应子目录中。例如：

![Java 源代码文件](java-source-paths.png){width=200}

目前，Kotlin Multiplatform 插件会替换一些由 Java 插件配置的任务：

* JAR 任务：它不是使用标准的 `jar` 任务，而是使用基于构件名称的目标特有的任务，例如，`jvm()` 目标声明对应 `jvmJar`，`jvm("desktop")` 对应 `desktopJar`。
* 测试任务：它不是使用标准的 `test` 任务，而是使用基于构件名称的目标特有的任务，例如 `jvmTest`。
* 资源处理：资源不是由 `*ProcessResources` 任务处理，而是由相应的编译任务处理。

当目标被声明时，这些任务会自动创建。然而，你可以手动定义 JAR 任务，并在必要时进行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 共享模块的 `build.gradle.kts` 文件
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}

kotlin {
    // 指定 JVM 目标
    jvm {
        // 添加 JAR 生成任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置该任务
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 共享模块的 `build.gradle` 文件
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}

kotlin {
    // 指定 JVM 目标
    jvm {
        // 添加 JAR 生成任务
        tasks.named<Jar>(artifactsTaskName).configure {
            // 配置该任务
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

</tab>
</tabs>

此目标由 Kotlin Multiplatform 插件发布，不需要 Java 插件特有的步骤。

## 配置与原生语言的互操作

Kotlin 提供了[与原生语言的互操作性](https://kotlinlang.org/docs/native-overview.html)以及用于为特定编译项配置此功能的 DSL。

| 原生语言 | 支持的平台 | 备注 |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | 所有平台                                  |                                                                           |
| Objective-C           | Apple 平台 (macOS, iOS, watchOS, tvOS)    |                                                                           |
| Swift via Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS)    | Kotlin 只能使用带有 `@objc` 属性标记的 Swift 声明。 |

一个编译项可以与多个原生库交互。你可以在[定义文件](https://kotlinlang.org/docs/native-definition-file.html)或构建文件的 [`cinterops` 代码块](multiplatform-dsl-reference.md#cinterops) 中配置与可用属性的互操作性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 替换为你所需的目标。
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
                    // 用于头文件搜索的目录（等同于 -I<path> 编译器选项）。
                    allHeaders("path1", "path2")
                    
                    // 附加目录，用于搜索“headerFilter”def 文件选项中列出的头文件。
                    // 等同于 -headerFilterAdditionalSearchPrefix 命令行选项。
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 替换为你所需的目标。
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
                    
                    // 用于头文件搜索的目录（等同于 -I<path> 编译器选项）。
                    includeDirs.allHeaders("path1", "path2")
                    
                    // 附加目录，用于搜索“headerFilter”def 文件选项中列出的头文件。
                    // 等同于 -headerFilterAdditionalSearchPrefix 命令行选项。
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

</tab>
</tabs>

## Android 编译
 
默认情况下为 Android 目标创建的编译项会绑定到 [Android 构建变体](https://developer.android.com/build/build-variants)：对于每个构建变体，都会创建一个同名的 Kotlin 编译项。

然后，对于为每个变体编译的每个 [Android 源代码集](https://developer.android.com/build/build-variants#sourcesets)，会创建一个 Kotlin 源代码集，其名称以目标名称为前缀，例如 `debug` Android 源代码集和名为 `androidTarget` 的 Kotlin 目标会创建 `androidDebug` Kotlin 源代码集。
这些 Kotlin 源代码集会相应地添加到变体的编译项中。

默认源代码集 `commonMain` 会添加到每个生产（应用程序或库）变体的编译项中。`commonTest` 源代码集也会类似地添加到单元测试和插桩测试变体的编译项中。

也支持使用 [`kapt`](https://kotlinlang.org/docs/kapt.html) 进行注解处理，但由于目前的限制，它要求在配置 `kapt` 依赖项之前创建 Android 目标，并且 `kapt` 依赖项需要在顶层 `dependencies {}` 代码块中完成，而不是在 Kotlin 源代码集依赖项中。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 源代码集层级结构编译

Kotlin 可以通过 `dependsOn` 关系构建[源代码集层级结构](multiplatform-share-on-platforms.md#share-code-on-similar-platforms)。

![源代码集层级结构](jvm-js-main.svg)

如果源代码集 `jvmMain` 依赖于源代码集 `commonMain`，则：

* 每当 `jvmMain` 为某个目标编译时，`commonMain` 也会参与该编译，并同样被编译成相同的目标二进制形式，例如 JVM 类文件。
* `jvmMain` 的源文件“看到” `commonMain` 的声明，包括内部声明，并且也看到 `commonMain` 的[依赖项](multiplatform-add-dependencies.md)，即使是那些指定为 `implementation` 依赖项的。
* `jvmMain` 可以包含 `commonMain` [预期声明](multiplatform-expect-actual.md)的平台特有实现。
* `commonMain` 的资源总是与 `jvmMain` 的资源一起被处理和复制。
* `jvmMain` 和 `commonMain` 的[语言设置](multiplatform-dsl-reference.md#language-settings)应该一致。

语言设置通过以下方式检查一致性：
* `jvmMain` 设置的 `languageVersion` 应大于或等于 `commonMain` 的 `languageVersion`。
* `jvmMain` 应该启用 `commonMain` 启用的所有不稳定语言特性（对错误修复特性没有此要求）。
* `jvmMain` 应该使用 `commonMain` 使用的所有实验性注解。
* `apiVersion`、错误修复语言特性和 `progressiveMode` 可以任意设置。

## 配置 Gradle 中的 Isolated Projects 特性

> 此特性是[实验性的](supported-platforms.md#general-kotlin-stability-levels)，目前在 Gradle 中处于预 Alpha 状态。
> 仅与 Gradle 8.10 或更高版本一起使用，并且仅用于评估目的。该特性可能随时被移除或更改。
> 我们非常感谢您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供关于它的反馈。
> 需要选择启用（参见以下详情）。
> 
{style="warning"}

Gradle 提供了 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 特性，它通过“隔离”各个项目来提高构建性能。该特性将项目间的构建脚本和插件分离，使它们能够安全地并行运行。

要启用此特性，请遵循 Gradle 的说明来[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

关于 Isolated Projects 特性的更多信息，请参见 [Gradle 的文档](https://docs.gradle.org/current/userguide/isolated_projects.html)。