---
title: 配置编译
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin 多平台项目使用编译 (compilation) 来生成产物 (artifact)。每个目标 (target) 可以有一个或多个编译，例如，用于生产和测试目的。

对于每个目标，默认的编译包括：

* 用于 JVM、JS 和 Native 目标的 `main` 和 `test` 编译。
* 每个 [Android 构建变体](https://developer.android.com/studio/build/build-variants) 的 [编译](#compilation-for-android)，用于 Android 目标。

<img src="/img/compilations.svg" alt="Compilations" style={{verticalAlign: 'middle'}}/>

如果你需要编译除生产代码和单元测试之外的其他内容，例如，集成测试或性能测试，你可以[创建一个自定义编译](#create-a-custom-compilation)。

你可以配置如何在以下位置生成产物：

* 项目中的[所有编译](#configure-all-compilations)。
* [一个目标的编译](#configure-compilations-for-one-target)，因为一个目标可以有多个编译。
* [一个特定的编译](#configure-one-compilation)。

查看可用于所有或特定目标的[编译参数列表](multiplatform-dsl-reference#compilation-parameters)和[编译器选项](gradle-compiler-options)。

## 配置所有编译

此示例配置了一个跨所有目标通用的编译器选项：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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
<TabItem value="groovy" label="Groovy" default>

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

如果你需要编译除生产代码和单元测试之外的其他内容，例如，集成测试或性能测试，创建一个自定义编译。

例如，要为 `jvm()` 目标的集成测试创建一个自定义编译，请向 `compilations` 集合添加一个新条目。

:::note
对于自定义编译，你需要手动设置所有依赖项。自定义编译的默认源集不依赖于 `commonMain` 和 `commonTest` 源集。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val main by getting
            
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        // Compile against the main compilation's compile classpath and outputs:
                        implementation(main.compileDependencyFiles + main.output.classesDirs)
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }
                
                // Create a test task to run the tests produced by this compilation:
                tasks.register<Test>("integrationTest") {
                    // Run the tests with the classpath containing the compile dependencies (including 'main'),
                    // runtime dependencies, and the outputs of this compilation:
                    classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                    
                    // Run only the tests from this compilation's outputs:
                    testClassesDirs = output.classesDirs
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    def main = compilations.main
                    // Compile against the main compilation's compile classpath and outputs:
                    implementation(main.compileDependencyFiles + main.output.classesDirs)
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }
           
            // Create a test task to run the tests produced by this compilation:
            tasks.register('jvmIntegrationTest', Test) {
                // Run the tests with the classpath containing the compile dependencies (including 'main'),
                // runtime dependencies, and the outputs of this compilation:
                classpath = compileDependencyFiles + runtimeDependencyFiles + output.allOutputs
                
                // Run only the tests from this compilation's outputs:
                testClassesDirs = output.classesDirs
            }
        }
    }
}
```

</TabItem>
</Tabs>

在其他情况下，你也需要创建一个自定义编译，例如，如果你想在最终产物中组合用于不同 JVM 版本的编译，或者你已经在 Gradle 中设置了源集并想迁移到多平台项目。

## 在 JVM 编译中使用 Java 源码

当使用 [项目向导](https://kmp.jetbrains.com/) 创建项目时，默认会创建 Java 源码并将其包含在 JVM 目标的编译中。

Java 源码文件放置在 Kotlin 源码根目录的子目录中。例如，路径是：

<img src="/img/java-source-paths.png" alt="Java source files" width="200" style={{verticalAlign: 'middle'}}/>

公共源集不能包含 Java 源码。

由于当前的限制，Kotlin 插件替换了 Java 插件配置的一些任务：

* 目标的 JAR 任务代替 `jar`（例如，`jvmJar`）。
* 目标的测试任务代替 `test`（例如，`jvmTest`）。
* 资源由编译的等效任务处理，而不是 `*ProcessResources` 任务。

此目标的发布由 Kotlin 插件处理，不需要特定于 Java 插件的步骤。

## 配置与原生语言的互操作性

Kotlin 提供了[与原生语言的互操作性](native-c-interop)和 DSL 来为特定编译配置它。

| 原生语言 (Native language)       | 支持的平台 (Supported platforms)                         | 注释 (Comments)                                                                  |
|-----------------------|---------------------------------------------|---------------------------------------------------------------------------|
| C                     | 除 WebAssembly 之外的所有平台       |                                                                           |
| Objective-C           | Apple 平台 (macOS, iOS, watchOS, tvOS) |                                                                           |
| Swift via Objective-C | Apple 平台 (macOS, iOS, watchOS, tvOS) | Kotlin 只能使用标有 `@objc` 属性的 Swift 声明。 |

一个编译可以与多个原生库交互。使用[定义文件](native-definition-file)或构建文件的 [`cinterops` 块](multiplatform-dsl-reference#cinterops)中的可用属性配置互操作性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def-file describing the native API.
                // The default path is src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))
                
                // Package to place the Kotlin API generated.
                packageName("org.sample")
                
                // Options to be passed to compiler by cinterop tool.
                compilerOpts("-Ipath/to/headers")
              
                // Directories to look for headers.
                includeDirs.apply {
                    // Directories for header search (an equivalent of the -I<path> compiler option).
                    allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    headerFilterOnly("path1", "path2")
                }
                // A shortcut for includeDirs.allHeaders.
                includeDirs("include/directory", "another/directory")
            }
            
            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    linuxX64 { // Replace with a target you need.
        compilations.main {
            cinterops {
                myInterop {
                    // Def-file describing the native API.
                    // The default path is src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")
                    
                    // Package to place the Kotlin API generated.
                    packageName 'org.sample'
                    
                    // Options to be passed to compiler by cinterop tool.
                    compilerOpts '-Ipath/to/headers'
                    
                    // Directories for header search (an eqivalent of the -I<path> compiler option).
                    includeDirs.allHeaders("path1", "path2")
                    
                    // Additional directories to search headers listed in the 'headerFilter' def-file option.
                    // -headerFilterAdditionalSearchPrefix command line option equivalent.
                    includeDirs.headerFilterOnly("path1", "path2")
                    
                    // A shortcut for includeDirs.allHeaders.
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

默认情况下，为 Android 目标创建的编译与 [Android 构建变体](https://developer.android.com/studio/build/build-variants) 相关联：对于每个构建变体，都会创建一个具有相同名称的 Kotlin 编译。

然后，对于为每个变体编译的每个 [Android 源集](https://developer.android.com/studio/build/build-variants#sourcesets)，都会创建一个 Kotlin 源集，该源集名称以目标名称为前缀，例如，用于 Android 源集 `debug` 的 Kotlin 源集 `androidDebug` 和名为 `androidTarget` 的 Kotlin 目标。这些 Kotlin 源集会相应地添加到变体的编译中。

默认源集 `commonMain` 会添加到每个生产（应用程序或库）变体的编译中。`commonTest` 源集也会以类似的方式添加到单元测试和插桩测试变体的编译中。

[`kapt`](kapt) 的注解处理也受支持，但由于当前的限制，它要求在配置 `kapt` 依赖项之前创建 Android 目标，这需要在顶层的 `dependencies {}` 块中完成，而不是在 Kotlin 源集依赖项中完成。

```kotlin
kotlin {
    androidTarget { /* ... */ }
}

dependencies {
    kapt("com.my.annotation:processor:1.0.0")
}
```

## 源集层次结构的编译

Kotlin 可以使用 `dependsOn` 关系构建[源集层次结构](multiplatform-share-on-platforms#share-code-on-similar-platforms)。

<img src="/img/jvm-js-main.svg" alt="Source set hierarchy" style={{verticalAlign: 'middle'}}/>

如果源集 `jvmMain` 依赖于源集 `commonMain`，则：

* 只要为特定目标编译 `jvmMain`，`commonMain` 也会参与该编译，并被编译为相同的目标二进制形式，例如 JVM 类文件。
* `jvmMain` 的源文件“看到”`commonMain` 的声明，包括内部声明，并且还看到 `commonMain` 的 [依赖项](multiplatform-add-dependencies)，即使那些被指定为 `implementation` 依赖项。
* `jvmMain` 可以包含 `commonMain` 的 [expected 声明](multiplatform-expect-actual) 的平台特定实现。
* `commonMain` 的资源始终与 `jvmMain` 的资源一起处理和复制。
* `jvmMain` 和 `commonMain` 的 [语言设置](multiplatform-dsl-reference#language-settings) 应该一致。

语言设置的一致性检查方式如下：
* `jvmMain` 应设置大于或等于 `commonMain` 的 `languageVersion`。
* `jvmMain` 应启用 `commonMain` 启用的所有不稳定的语言特性（对缺陷修复特性没有这样的要求）。
* `jvmMain` 应使用 `commonMain` 使用的所有实验性注解。
* `apiVersion`、缺陷修复语言特性和 `progressiveMode` 可以任意设置。

## 在 Gradle 中配置 Isolated Projects 功能

:::caution
此功能是 [Experimental](components-stability#stability-levels-explained) 的，目前处于 Gradle 的 pre-alpha 状态。
仅将其与 Gradle 8.10 或更高版本一起使用，并且仅用于评估目的。该功能可能随时被删除或更改。
我们欢迎您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-57279/Support-Gradle-Project-Isolation-Feature-for-Kotlin-Multiplatform) 中提供有关此功能的反馈。
需要选择加入（请参阅下面的详细信息）。

:::

Gradle 提供了 [Isolated Projects](https://docs.gradle.org/current/userguide/isolated_projects.html) 功能，
通过将各个项目彼此“隔离”来提高构建性能。此功能分离了项目之间的构建脚本和插件，允许它们安全地并行运行。

要启用此功能，请按照 Gradle 的说明[设置系统属性](https://docs.gradle.org/current/userguide/isolated_projects.html#how_do_i_use_it)。

有关 Isolated Projects 功能的更多信息，请参阅 [Gradle 的文档](https://docs.gradle.org/current/userguide/isolated_projects.html)。