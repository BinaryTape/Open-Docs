[//]: # (title: 多平台 Gradle DSL 参考)

Kotlin 多平台 Gradle 插件是用于创建 Kotlin 多平台项目的工具。本文提供了其内容的参考，可在编写 Kotlin 多平台项目的 Gradle 构建脚本时作为备忘录。了解 [Kotlin 多平台项目的概念、如何创建和配置它们](multiplatform-discover-project.md)。

## ID 和版本

Kotlin 多平台 Gradle 插件的完全限定名为 `org.jetbrains.kotlin.multiplatform`。如果你使用 Kotlin Gradle DSL，可以使用 `kotlin("multiplatform")` 应用该插件。该插件版本与 Kotlin 发布版本匹配。最新版本是 %kotlinVersion%。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## 顶层代码块

`kotlin {}` 是 Gradle 构建脚本中用于多平台项目配置的顶层代码块。在 `kotlin {}` 内部，你可以编写以下代码块：

| **代码块**            | **描述**                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;目标名&gt;_ | 声明项目的特定目标。可用目标名称列在 [目标](#targets) 部分。                                                                               |
| `targets`            | 列出项目的所有目标。                                                                                                        |
| `sourceSets`         | 配置项目预定义的和声明自定义的 [源代码集](#source-sets)。                                                                                   |
| `compilerOptions`    | 指定用于所有目标和共享源代码集的通用扩展层级 [编译器选项](#compiler-options) 作为默认值。 |

## 目标

_目标_ 是构建的一部分，负责编译、测试和打包针对受支持平台之一的软件片段。Kotlin 为每个平台提供目标，因此你可以指示 Kotlin 为该特定目标编译代码。了解更多关于 [设置目标](multiplatform-discover-project.md#targets) 的信息。

每个目标可以有一个或多个 [编译项](#compilations)。除了用于测试和生产目的的默认编译项外，你还可以 [创建自定义编译项](multiplatform-configure-compilations.md#create-a-custom-compilation)。

多平台项目的目标在 `kotlin {}` 内部的相应代码块中描述，例如 `jvm`、`androidTarget`、`iosArm64`。可用目标的完整列表如下：

<table>
    <tr>
        <th>目标平台</th>
        <th>目标</th>
        <th>备注</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>如果你计划在 JavaScript 运行时中运行项目，请使用它。</td>
    </tr>
    <tr>
        <td><code>wasmWasi</code></td>
        <td>如果你需要支持 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系统接口，请使用它。</td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>选择执行环境：</p>
            <list>
                <li><code>browser {}</code> 用于在浏览器中运行的应用程序。</li>
                <li><code>nodejs {}</code> 用于在 Node.js 上运行的应用程序。</li>
            </list>
            <p>了解更多信息请参阅 <a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">设置 Kotlin/JS 项目</a>。</p>
        </td>
    </tr>
    <tr>
        <td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>了解更多关于 macOS、Linux 和 Windows 主机当前支持的目标，请参见 <a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 目标支持</a>。</p>
        </td>
    </tr>
    <tr>
        <td>Android 应用程序和库</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>手动应用 Android Gradle 插件：<code>com.android.application</code> 或 <code>com.android.library</code>。</p>
            <p>每个 Gradle 子项目只能创建一个 Android 目标。</p>
        </td>
    </tr>
</table>

> 当前主机不支持的目标在构建期间将被忽略，因此不会发布。
>
{style="note"}

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

目标的配置可以包含两部分：

*   适用于所有目标的 [通用配置](#common-target-configuration)。
*   目标特有配置。

每个目标可以有一个或多个 [编译项](#compilations)。

### 通用目标配置

在任何目标代码块中，你可以使用以下声明：

| **名称**            | **描述**                                                                                                                                                                            |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此目标对应的 Kotlin 平台。可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | 构建此目标生成的构件的任务名称。                                                                                                                                                  |
| `components`        | 用于设置 Gradle 发布的功能组件。                                                                                                                                             |
| `compilerOptions`   | 用于目标的 [编译器选项](#compiler-options)。此声明会覆盖在 [顶层](multiplatform-dsl-reference.md#top-level-blocks) 配置的任何 `compilerOptions {}`。 |

### Web 目标

`js {}` 代码块描述了 Kotlin/JS 目标的配置，`wasmJs {}` 代码块描述了可与 JavaScript 互操作的 Kotlin/Wasm 目标的配置。它们可以根据目标执行环境包含以下两个代码块之一：

| **名称**              | **描述**                      |
|-----------------------|--------------------------------------|
| [`browser`](#browser) | 浏览器目标的配置。 |
| [`nodejs`](#node-js)  | Node.js 目标的配置。 |

了解更多关于 [配置 Kotlin/JS 项目](https://kotlinlang.org/docs/js-project-setup.html) 的信息。

单独的 `wasmWasi {}` 代码块描述了支持 WASI 系统接口的 Kotlin/Wasm 目标的配置。在这里，只有 [`nodejs`](#node-js) 执行环境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 Web 目标，`js`、`wasmJs` 和 `wasmWasi`，也支持 `binaries.executable()` 调用。它显式指示 Kotlin 编译器发出可执行文件。更多信息，请参见 Kotlin/JS 文档中的 [执行环境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)。

#### Browser

`browser {}` 可以包含以下配置代码块：

| **名称**       | **描述**                                                            |
|----------------|----------------------------------------------------------------------------|
| `testRuns`     | 测试执行的配置。                                           |
| `runTask`      | 项目运行的配置。                                          |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 进行项目打包的配置。 |
| `distribution` | 输出文件的路径。                                                      |

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        distribution {
            directory = File("$projectDir/customdir/")
        }
    }
}
```

#### Node.js

`nodejs {}` 可以包含测试和运行任务的配置：

| **名称**   | **描述**                   |
|------------|-----------------------------------|
| `testRuns` | 测试执行的配置。  |
| `runTask`  | 项目运行的配置。 |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 原生目标

对于原生目标，以下特定代码块可用：

| **名称**    | **描述**                                          |
|-------------|----------------------------------------------------------|
| `binaries`  | 要生成的 [二进制文件](#binaries) 的配置。       |
| `cinterops` | [与 C 库互操作](#cinterops) 的配置。 |

#### 二进制文件

二进制文件有以下几种类型：

| **名称**     | **描述**        |
|--------------|------------------------|
| `executable` | 产品可执行文件。    |
| `test`       | 测试可执行文件。       |
| `sharedLib`  | 共享库。        |
| `staticLib`  | 静态库。        |
| `framework`  | Objective-C framework。 |

```kotlin
kotlin {
    linuxX64 { // 请替换为你的目标。
        binaries {
            executable {
                // 二进制配置。
            }
        }
    }
}
```

对于二进制配置，以下参数可用：

| **名称**      | **描述**                                                                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 构建二进制文件的编译项。默认情况下，`test` 二进制文件基于 `test` 编译项，而其他二进制文件基于 `main` 编译项。 |
| `linkerOpts`  | 在二进制文件构建期间传递给系统链接器的选项。                                                                                                                                        |
| `baseName`    | 输出文件的自定义基础名称。最终文件名将通过向此基础名称添加系统相关的前缀和后缀来形成。                         |
| `entryPoint`  | 可执行二进制文件的入口点函数。默认情况下，它是根包中的 `main()`。                                                                  |
| `outputFile`  | 访问输出文件。                                                                                                                                        |
| `linkTask`    | 访问链接任务。                                                                                                                                          |
| `runTask`     | 访问可执行二进制文件的运行任务。对于除 `linuxX64`、`macosX64` 或 `mingwX64` 之外的目标，该值为 `null`。                                 |
| `isStatic`    | 适用于 Objective-C frameworks。包含静态库而非动态库。                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 基于测试编译项构建二进制文件。
        compilation = compilations["test"]

        // 链接器的自定义命令行选项。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 输出文件的基础名称。
        baseName = "foo"

        // 自定义入口点函数。
        entryPoint = "org.example.main"

        // 访问输出文件。
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务。
        // 请注意，对于非主机平台，runTask 为 null。
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 将静态库而非动态库包含到 framework 中。
        isStatic = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 基于测试编译项构建二进制文件。
        compilation = compilations.test

        // 链接器的自定义命令行选项。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 输出文件的基础名称。
        baseName = 'foo'

        // 自定义入口点函数。
        entryPoint = 'org.example.main'

        // 访问输出文件。
        println("Executable path: ${outputFile.absolutePath}")

        // 访问链接任务。
        linkTask.dependsOn(additionalPreprocessingTask)

        // 访问运行任务。
        // 请注意，对于非主机平台，runTask 为 null。
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 将静态库而非动态库包含到 framework 中。
        isStatic = true
    }
}
```

</tab>
</tabs>

了解更多关于 [构建原生二进制文件](multiplatform-build-native-binaries.md) 的信息。

#### Cinterops

`cinterops` 是用于与原生库互操作的描述集合。要与库互操作，请向 `cinterops` 添加条目并定义其参数：

| **名称**         | **描述**                                       |
|------------------|-------------------------------------------------------|
| `definitionFile` | 描述原生 API 的 `.def` 文件。            |
| `packageName`    | 生成的 Kotlin API 的包前缀。          |
| `compilerOpts`   | cinterop 工具传递给编译器的选项。 |
| `includeDirs`    | 查找头文件的目录。                      |
| `header`         | 要包含在绑定中的头文件。                |
| `headers`        | 要包含在绑定中的头文件列表。   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 请替换为所需的目标。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的定义文件。
                // 默认路径是 src/nativeInterop/cinterop/<互操作名称>.def
                definitionFile.set(project.file("def-file.def"))

                // 用于放置生成的 Kotlin API 的包。
                packageName("org.sample")

                // cinterop 工具传递给编译器的选项。
                compilerOpts("-Ipath/to/headers")

                // 头文件搜索目录（类似于 -I<path> 编译器选项）。
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的快捷方式。
                includeDirs("include/directory", "another/directory")

                // 要包含在绑定中的头文件。
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
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
    linuxX64 { // 请替换为所需的目标。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的定义文件。
                    // 默认路径是 src/nativeInterop/cinterop/<互操作名称>.def
                    definitionFile = project.file("def-file.def")

                    // 用于放置生成的 Kotlin API 的包。
                    packageName 'org.sample'

                    // cinterop 工具传递给编译器的选项。
                    compilerOpts '-Ipath/to/headers'

                    // 头文件搜索目录（类似于 -I<path> 编译器选项）。
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的快捷方式。
                    includeDirs("include/directory", "another/directory")

                    // 要包含在绑定中的头文件。
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

更多 cinterop 属性，请参见 [定义文件](https://kotlinlang.org/docs/native-definition-file.html#properties)。

### Android 目标

Kotlin 多平台插件有一个特定函数，可帮助你为 Android 目标配置 [构建变体](https://developer.android.com/studio/build/build-variants)：

| **名称**                      | **描述**                                                                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定要发布的构建变体。了解更多关于 [发布 Android 库](multiplatform-publish-lib-setup.md#publish-an-android-library) 的信息。 |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

了解更多关于 [Android 编译项](multiplatform-configure-compilations.md#compilation-for-android) 的信息。

> `kotlin {}` 代码块内的 `androidTarget` 配置不会替代任何 Android 项目的构建配置。了解更多关于编写 Android 项目构建脚本的信息，请参见 [Android 开发者文档](https://developer.android.com/studio/build)。
>
{style="note"}

## 源代码集

`sourceSets {}` 代码块描述了项目的源代码集。源代码集包含共同参与编译项的 Kotlin 源文件，以及它们的资源和依赖项。

多平台项目包含其目标的 [预定义](#predefined-source-sets) 源代码集；开发者还可以根据需要创建 [自定义](#custom-source-sets) 源代码集。

### 预定义源代码集

预定义源代码集在创建多平台项目时自动设置。可用的预定义源代码集如下：

| **名称**                                    | **描述**                                                                                                                                                                                               |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 在所有平台之间共享的代码和资源。在所有多平台项目中可用。用于项目的所有主要 [编译项](#compilations)。                                                        |
| `commonTest`                                | 在所有平台之间共享的测试代码和资源。在所有多平台项目中可用。用于项目的所有测试编译项。                                                                    |
| _&lt;目标名&gt;&lt;编译项名&gt;_ | 编译项的目标特有源代码。_&lt;目标名&gt;_ 是预定义目标的名称，_&lt;编译项名&gt;_ 是此目标的编译项名称。例如：`jsTest`、`jvmMain`。 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
</tabs>

了解更多关于 [源代码集](multiplatform-discover-project.md#source-sets) 的信息。

### 自定义源代码集

自定义源代码集由项目开发者手动创建。要创建自定义源代码集，请在 `sourceSets` 部分内部添加一个以其名称命名的部分。如果使用 Kotlin Gradle DSL，请将自定义源代码集标记为 `by creating`。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        val myMain by creating { /* ... */ } // 创建名为 'MyMain' 的新源代码集
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        myMain { /* ... */ } // 创建或配置名为 'myMain' 的源代码集
    }
}
```

</tab>
</tabs>

请注意，新创建的源代码集未连接到其他源代码集。要在项目的编译项中使用它，请 [将其与其他源代码集连接](multiplatform-hierarchy.md#manual-configuration)。

### 源代码集参数

源代码集的配置存储在 `sourceSets {}` 的相应代码块中。源代码集具有以下参数：

| **名称**           | **描述**                                                                        |
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 源代码集目录中 Kotlin 源文件的位置。                       |
| `resources.srcDir` | 源代码集目录中资源的位置。                                 |
| `dependsOn`        | [与另一个源代码集的连接](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | 源代码集的 [依赖项](#dependencies)。                                       |
| `languageSettings` | 应用于共享源代码集的 [语言设置](#language-settings)。              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')

            dependencies {
                /* ... */
            }
        }
    }
}
```

</tab>
</tabs>

## 编译项

一个目标可以有一个或多个编译项，例如，用于生产或测试。有些 [预定义编译项](#predefined-compilations) 会在目标创建时自动添加。你还可以另外创建 [自定义编译项](#custom-compilations)。

要引用目标的所有或某些特定编译项，请使用 `compilations` 对象集合。从 `compilations` 中，你可以通过其名称引用编译项。

了解更多关于 [配置编译项](multiplatform-configure-compilations.md) 的信息。

### 预定义编译项

预定义编译项是为项目的每个目标自动创建的，Android 目标除外。可用的预定义编译项如下：

| **名称** | **描述**                     |
|----------|-------------------------------------|
| `main`   | 用于生产源代码的编译项。 |
| `test`   | 用于测试的编译项。              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 获取主编译项输出
        }

        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 获取主编译项输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</tab>
</tabs>

### 自定义编译项

除了预定义编译项，你还可以创建自己的自定义编译项。为此，请在新编译项和 `main` 编译项之间设置 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关系。如果你正在使用 Kotlin Gradle DSL，请将自定义编译项标记为 `by creating`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // 将 main 及其类路径作为依赖项导入并建立内部可见性
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 创建一个测试任务来运行此编译项生成的测试
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
            // 将 main 及其类路径作为依赖项导入并建立内部可见性
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

通过关联编译项，你可以将主编译项输出作为依赖项添加，并在编译项之间建立 `internal` 可见性。

了解更多关于创建 [自定义编译项](multiplatform-configure-compilations.md#create-a-custom-compilation) 的信息。

### 编译项参数

编译项具有以下参数：

| **名称**                 | **描述**                                                                                                                                                           |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 编译项的默认源代码集。                                                                                                                                     |
| `kotlinSourceSets`       | 参与编译项的源代码集。                                                                                                                             |
| `allKotlinSourceSets`    | 参与编译项的源代码集及其通过 `dependsOn()` 的连接。                                                                                     |
| `compilerOptions`        | 应用于编译项的编译器选项。有关可用选项列表，请参见 [编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)。         |
| `compileKotlinTask`      | 用于编译 Kotlin 源文件的 Gradle 任务。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名称。                                                                                                                                              |
| `compileAllTaskName`     | 用于编译编译项所有源代码的 Gradle 任务名称。                                                                                                       |
| `output`                 | 编译项输出。                                                                                                                                                   |
| `compileDependencyFiles` | 编译项的编译期依赖文件（类路径）。对于所有 Kotlin/Native 编译项，这会自动包含标准库和平台依赖项。 |
| `runtimeDependencyFiles` | 编译项的运行时依赖文件（类路径）。                                                                                                                  |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 为 'main' 编译项设置 Kotlin 编译器选项：
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // 获取 Kotlin 任务 'compileKotlinJvm'
            output // 获取主编译项输出
        }

        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有目标的所有编译项：
    compilerOptions {
        allWarningsAsErrors.set(true)
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
                // 为 'main' 编译项设置 Kotlin 编译器选项：
                jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // 获取 Kotlin 任务 'compileKotlinJvm'
        compilations.main.output // 获取主编译项输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有目标的所有编译项：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 编译器选项

你可以在项目的三个不同级别配置编译器选项：

*   **扩展层级**，在 `kotlin {}` 代码块中。
*   **目标层级**，在目标代码块中。
*   **编译单元层级**，通常在特定的编译任务中。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

更高层级的设置作为下一层级的默认值：

*   在扩展层级设置的编译器选项是目标层级选项的默认值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享源代码集。
*   在目标层级设置的编译器选项是编译单元（任务）层级选项的默认值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务。

在较低层级进行的配置会覆盖更高层级的相似设置：

*   任务层级编译器选项会覆盖目标或扩展层级的相似设置。
*   目标层级编译器选项会覆盖扩展层级的相似设置。

有关可能的编译器选项列表，请参见 [所有编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)。

### 扩展层级

要为项目中的所有目标配置编译器选项，请在顶层使用 `compilerOptions {}` 代码块：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 配置所有目标的所有编译项
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 配置所有目标的所有编译项：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

### 目标层级

要为项目中的特定目标配置编译器选项，请在目标代码块内部使用 `compilerOptions {}` 代码块：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // 配置 JVM 目标的所有编译项
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // 配置 JVM 目标的所有编译项
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</tab>
</tabs>

### 编译单元层级

要为特定任务配置编译器选项，请在该任务内部使用 `compilerOptions {}` 代码块：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

要为特定编译项配置编译器选项，请在编译项的任务提供器中，使用 `compilerOptions {}` 代码块：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置 'main' 编译项：
                compilerOptions {
                    allWarningsAsErrors.set(true)
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
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置 'main' 编译项：
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</tab>
</tabs>

### 从 `kotlinOptions {}` 迁移到 `compilerOptions {}` {collapsible="true"}

在 Kotlin 2.2.0 之前，你可以使用 `kotlinOptions {}` 代码块配置编译器选项。由于 `kotlinOptions {}` 代码块在 Kotlin 2.2.0 中已弃用，你需要在构建脚本中使用 `compilerOptions {}` 代码块取而代之。更多信息，请参见 [从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)。

## 依赖项

源代码集声明的 `dependencies {}` 代码块包含此源代码集的依赖项。

了解更多关于 [配置依赖项](https://kotlinlang.org/docs/gradle-configure-project.html) 的信息。

依赖项有四种类型：

| **名称**         | **描述**                                                                     |
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 在当前模块 API 中使用的依赖项。                                 |
| `implementation` | 在模块中使用但未在其外部暴露的依赖项。                         |
| `compileOnly`    | 仅用于当前模块编译的依赖项。                       |
| `runtimeOnly`    | 在运行时可用但在任何模块编译期间不可见的依赖项。 |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        jvmMain {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvmMain {
            dependencies {
                implementation 'com.example:foo-jvm:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

此外，源代码集可以彼此依赖并形成层级结构。在这种情况下，使用 [`dependsOn()`](#source-set-parameters) 关系。

源代码集依赖项也可以在构建脚本的顶层 `dependencies {}` 代码块中声明。在这种情况下，它们的声明遵循 `<源代码集名称><依赖项类型>` 模式，例如 `commonMainApi`。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</tab>
</tabs>

## 语言设置

源代码集中的 `languageSettings {}` 代码块定义了项目分析和编译的某些方面。仅将 `languageSettings {}` 代码块用于配置特别适用于共享源代码集的设置。对于所有其他情况，请使用 `compilerOptions {}` 代码块在扩展或目标层级 [配置编译器选项](#compiler-options)。

以下语言设置可用：

| **名称**                | **描述**                                                                                                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 提供与指定 Kotlin 版本兼容的源代码。                                                                                                             |
| `apiVersion`            | 允许仅使用指定版本 Kotlin 捆绑库中的声明。                                                                                          |
| `enableLanguageFeature` | 启用指定的语言特性。可用值对应于当前是实验性的语言特性，或在某个时候以这种方式引入的语言特性。 |
| `optIn`                 | 允许使用指定的 [opt-in 注解](https://kotlinlang.org/docs/opt-in-requirements.html)。                                                                           |
| `progressiveMode`       | 启用 [渐进模式](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)。                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 可能的值："1.8"、"1.9"、"2.0"、"2.1"
            apiVersion = "%apiVersion%" // 可能的值："1.8"、"1.9"、"2.0"、"2.1"
            enableLanguageFeature("InlineClasses") // 语言特性名称
            optIn("kotlin.ExperimentalUnsignedTypes") // 注解的完全限定名
            progressiveMode = true // 默认为 false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 可能的值："1.8"、"1.9"、"2.0"、"2.1"
            apiVersion = '%apiVersion%' // 可能的值："1.8"、"1.9"、"2.0"、"2.1"
            enableLanguageFeature('InlineClasses') // 语言特性名称
            optIn('kotlin.ExperimentalUnsignedTypes') // 注解的完全限定名
            progressiveMode = true // 默认为 false
        }
    }
}
```

</tab>
</tabs>