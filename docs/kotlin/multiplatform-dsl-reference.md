---
title: "多平台 Gradle DSL 参考"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 插件是一个用于创建 Kotlin Multiplatform 项目的工具。
在此，我们提供了其内容的参考；在为 Kotlin Multiplatform 项目编写 Gradle 构建脚本时，可将其用作提醒。 了解 [Kotlin Multiplatform 项目的概念，如何创建和配置它们](multiplatform-intro)。

## ID 和版本

Kotlin Multiplatform Gradle 插件的完整限定名称是 `org.jetbrains.kotlin.multiplatform`。
如果使用 Kotlin Gradle DSL，可以使用 `kotlin("multiplatform")` 应用该插件。
插件版本与 Kotlin 发布版本匹配。 最新版本是 2.1.20。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

## 顶层块

`kotlin {}` 是 Gradle 构建脚本中用于多平台项目配置的顶层块。
在 `kotlin {}` 内部，可以编写以下块：

| **块**            | **描述**                                                                                                                                |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 声明项目的特定 target。 可用 target 的名称在 [Targets](#targets) 部分列出。                                                                   |
| `targets`            | 列出项目的所有 target。                                                                                                                  |
| `sourceSets`         | 配置预定义的并声明项目的自定义 [source set](#source-sets)。                                                                              |
| `compilerOptions`    | 指定通用的扩展级别 [compiler option](#compiler-options)，这些选项用作所有 target 和共享 source set 的默认值。 |

## Target

_target_ 是构建的一部分，负责编译、测试和打包面向受支持平台之一的软件。 Kotlin 为每个平台提供 target，因此可以指示 Kotlin 为该特定 target 编译代码。 了解有关 [设置 target](multiplatform-discover-project#targets) 的更多信息。

每个 target 可以有一个或多个 [编译 (compilation)](#compilations)。 除了用于测试和生产目的的默认编译外，还可以 [创建自定义编译](multiplatform-configure-compilations#create-a-custom-compilation)。

多平台项目的 target 在 `kotlin {}` 内部的相应块中描述，例如 `jvm`、`androidTarget`、`iosArm64`。
可用 target 的完整列表如下：
<table>
<tr>
        <th>Target 平台</th>
        <th>Target</th>
        <th>备注</th>
</tr>
<tr>
<td>
Kotlin/JVM
</td>
<td>
`jvm`
</td>
<td>
</td>
</tr>
<tr>
<td rowspan="2">
Kotlin/Wasm
</td>
<td>
`wasmJs`
</td>
<td>
如果计划在 JavaScript 运行时中运行项目，请使用它。
</td>
</tr>
<tr>
<td>
`wasmWasi`
</td>
<td>
如果需要支持 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系统接口，请使用它。
</td>
</tr>
<tr>
<td>
Kotlin/JS
</td>
<td>
`js`
</td>
<td>

<p>
   选择执行环境：
</p>
<list>
<li>`browser {}` 用于在浏览器中运行的应用程序。</li>
<li>`nodejs {}` 用于在 Node.js 上运行的应用程序。</li>
</list>
<p>
   在 <a href="js-project-setup#execution-environments">设置 Kotlin/JS 项目</a> 中了解更多信息。
</p>
</td>
</tr>
<tr>
<td>
Kotlin/Native
</td>
<td>
</td>
<td>

<p>
   在 <a href="native-target-support">Kotlin/Native target 支持</a> 中了解有关 macOS、Linux 和 Windows 主机当前支持的 target。
</p>
</td>
</tr>
<tr>
<td>
Android 应用程序和库
</td>
<td>
`androidTarget`
</td>
<td>

<p>
   手动应用 Android Gradle 插件：`com.android.application` 或 `com.android.library`。
</p>
<p>
   每个 Gradle 子项目只能创建一个 Android target。
</p>
</td>
</tr>
</table>
:::note
在构建期间，将忽略当前主机不支持的 target，因此不会发布该 target。

:::

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

target 的配置可以包括两部分：

* [所有 target 都可用的通用配置](#common-target-configuration)。
* Target 特定的配置。

每个 target 可以有一个或多个 [编译](#compilations)。

### 通用 Target 配置

在任何 target 块中，可以使用以下声明：

| **名称**            | **描述**                                                                                                                                                                            | 
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此 target 的 Kotlin 平台。 可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                              |
| `artifactsTaskName` | 构建此 target 的结果产物的任务名称。                                                                                                                   |
| `components`        | 用于设置 Gradle 发布 (publication) 的组件。                                                                                                                                             |
| `compilerOptions`   | 用于 target 的 [compiler option](#compiler-options)。 此声明将覆盖在 [顶层](multiplatform-dsl-reference#top-level-blocks) 配置的任何 `compilerOptions {}`。 |

### Web Target

`js {}` 块描述了 Kotlin/JS target 的配置，`wasmJs {}` 块描述了与 JavaScript 互操作的 Kotlin/Wasm target 的配置。 它们可以包含两个块之一，具体取决于 target 执行环境：

| **名称**              | **描述**                      | 
|-----------------------|--------------------------------------|
| [`browser`](#browser) | 浏览器 target 的配置。 |
| [`nodejs`](#node-js)  | Node.js target 的配置。 |

了解有关 [配置 Kotlin/JS 项目](js-project-setup) 的更多信息。

单独的 `wasmWasi {}` 块描述了支持 WASI 系统接口的 Kotlin/Wasm target 的配置。
在这里，只有 [`nodejs`](#node-js) 执行环境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 Web target（`js`、`wasmJs` 和 `wasmWasi`）也都支持 `binaries.executable()` 调用。 它显式指示 Kotlin 编译器发出可执行文件。 有关更多信息，请参见 Kotlin/JS 文档中的 [执行环境](js-project-setup#execution-environments)。

#### Browser

`browser {}` 可以包含以下配置块：

| **名称**       | **描述**                                                         | 
|----------------|-------------------------------------------------------------------------|
| `testRuns`     | 测试执行的配置。                                        |
| `runTask`      | 项目运行的配置。                                       |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 进行项目捆绑的配置。 |
| `distribution` | 输出文件的路径。                                                   |

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

### Native Target

对于 Native target，可以使用以下特定块：

| **名称**    | **描述**                                          | 
|-------------|----------------------------------------------------------|
| `binaries`  | 要生成的 [二进制文件 (binary)](#binaries) 的配置。       |
| `cinterops` | 与 [C 库互操作](#cinterops) 的配置。 |

#### 二进制文件 (Binaries)

有以下几种二进制文件 (binary)：

| **名称**     | **描述**        | 
|--------------|------------------------|
| `executable` | 产品可执行文件。    |
| `test`       | 测试可执行文件。       |
| `sharedLib`  | 共享库。        |
| `staticLib`  | 静态库。        |
| `framework`  | Objective-C 框架。 |

```kotlin
kotlin {
    linuxX64 { // 使用您的 target 代替。
        binaries {
            executable {
                // 二进制文件配置。
            }
        }
    }
}
```

对于二进制文件 (binary) 配置，可以使用以下参数：

| **名称**      | **描述**                                                                                                                                                   | 
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 构建二进制文件 (binary) 所依据的编译 (compilation)。 默认情况下，`test` 二进制文件 (binary) 基于 `test` 编译 (compilation)，而其他二进制文件 (binary) 基于 `main` 编译 (compilation)。 |
| `linkerOpts`  | 在二进制文件 (binary) 构建期间传递给系统链接器的选项。                                                                                                         |
| `baseName`    | 输出文件的自定义基本名称。 最终文件名将通过向此外加系统相关的前缀和后缀来构成。                         |
| `entryPoint`  | 可执行二进制文件 (binary) 的入口点函数。 默认情况下，它是根程序包中的 `main()`。                                                                  |
| `outputFile`  | 访问输出文件。                                                                                                                                        |
| `linkTask`    | 访问链接任务。                                                                                                                                          |
| `runTask`     | 访问可执行二进制文件 (binary) 的运行任务。 对于 `linuxX64`、`macosX64` 或 `mingwX64` 以外的 target，该值为 `null`。                                 |
| `isStatic`    | 适用于 Objective-C 框架。 包括静态库而不是动态库。                                                                                   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 在测试编译的基础上构建二进制文件。
        compilation = compilations["test"]

        // 链接器的自定义命令行选项。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 输出文件的基本名称。
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
        // 将静态库而不是动态库包含到框架中。
        isStatic = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 在测试编译的基础上构建二进制文件。
        compilation = compilations.test

        // 链接器的自定义命令行选项。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 输出文件的基本名称。
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
        // 将静态库而不是动态库包含到框架中。
        isStatic = true
    }
}
```

</TabItem>
</Tabs>

了解有关 [构建 Native 二进制文件](multiplatform-build-native-binaries) 的更多信息。

#### CInterops

`cinterops` 是与 Native 库互操作的描述集合。
要提供与库的互操作，请向 `cinterops` 添加一个条目并定义其参数：

| **名称**         | **描述**                                       | 
|------------------|-------------------------------------------------------|
| `definitionFile` | 描述 Native API 的 `.def` 文件。            |
| `packageName`    | 生成的 Kotlin API 的程序包前缀。          |
| `compilerOpts`   | 要由 cinterop 工具传递给编译器的选项。 |
| `includeDirs`    | 查找标头的目录。                      |
| `header`         | 要包含在绑定中的标头。                |
| `headers`        | 要包含在绑定中的标头列表。   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // 替换为您需要的 target。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // Def 文件描述 Native API。
                // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 用于放置生成的 Kotlin API 的程序包。
                packageName("org.sample")

                // 要通过 cinterop 工具传递给编译器的选项。
                compilerOpts("-Ipath/to/headers")

                // 用于标头搜索的目录（类似于 -I<path> 编译器选项）。
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders 的快捷方式。
                includeDirs("include/directory", "another/directory")

                // 要包含在绑定中的标头文件。
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
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
    linuxX64 { // 替换为您需要的 target。
        compilations.main {
            cinterops {
                myInterop {
                    // Def 文件描述 Native API。
                    // 默认路径为 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 用于放置生成的 Kotlin API 的程序包。
                    packageName 'org.sample'

                    // 要通过 cinterop 工具传递给编译器的选项。
                    compilerOpts '-Ipath/to/headers'

                    // 用于标头搜索的目录（类似于 -I<path> 编译器选项）。
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders 的快捷方式。
                    includeDirs("include/directory", "another/directory")

                    // 要包含在绑定中的标头文件。
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

有关更多 cinterop 属性，请参见 [定义文件](native-definition-file#properties)。

### Android Target

Kotlin Multiplatform 插件包含两个用于 Android target 的特定函数。
两个函数可帮助您配置 [构建变体 (build variant)](https://developer.android.com/studio/build/build-variants)：

| **名称**                      | **描述**                                                                                                                                | 
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定要发布的构建变体 (build variant)。 了解有关 [发布 Android 库](multiplatform-publish-lib#publish-an-android-library) 的更多信息。 |
| `publishAllLibraryVariants()` | 发布所有构建变体 (build variant)。                                                                                                                  |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

了解有关 [Android 编译](multiplatform-configure-compilations#compilation-for-android) 的更多信息。

:::note
`kotlin {}` 块中的 `androidTarget` 配置不会替换任何 Android 项目的构建配置。
在 [Android 开发者文档](https://developer.android.com/studio/build) 中了解有关为 Android 项目编写构建脚本的更多信息。

:::

## Source Set

`sourceSets {}` 块描述了项目的 source set。 source set 包含一起参与编译的 Kotlin 源文件及其资源、依赖项和语言设置。

多平台项目包含其 target 的 [预定义](#predefined-source-sets) source set；
开发人员还可以根据自己的需要创建 [自定义](#custom-source-sets) source set。

### 预定义的 Source Set

在创建多平台项目时，会自动设置预定义的 source set。
可用的预定义 source set 如下：

| **名称**                                    | **描述**                                                                                                                                                                                               | 
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 所有平台之间共享的代码和资源。 在所有多平台项目中可用。 在项目的所有主要 [编译](#compilations) 中使用。                                                        |
| `commonTest`                                | 所有平台之间共享的测试代码和资源。 在所有多平台项目中可用。 在项目的所有测试编译中使用。                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 用于编译的特定于 target 的源。 _&lt;targetName&gt;_ 是预定义 target 的名称，_&lt;compilationName&gt;_ 是此 target 的编译名称。 示例：`jsTest`、`jvmMain`。 |

使用 Kotlin Gradle DSL 时，预定义 source set 的部分应标记为 `by getting`。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ } 
    }
}
```

</TabItem>
</Tabs>

了解有关 [source set](multiplatform-discover-project#source-sets) 的更多信息。

### 自定义的 Source Set

自定义 source set 由项目开发人员手动创建。
要创建自定义 source set，请在 `sourceSets` 部分中添加一个包含其名称的部分。
如果使用 Kotlin Gradle DSL，请将自定义 source set 标记为 `by creating`。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val myMain by creating { /* ... */ } // 创建一个名为“MyMain”的新 source set
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        myMain { /* ... */ } // 创建或配置一个名为“myMain”的 source set
    }
}
```

</TabItem>
</Tabs>

请注意，新创建的 source set 未与其他 source set 连接。 要在项目的编译中使用它，
[将其与其他 source set 连接](multiplatform-hierarchy#manual-configuration)。

### Source Set 参数

source set 的配置存储在 `sourceSets {}` 的相应块中。 source set 具有以下参数：

| **名称**           | **描述**                                                                        | 
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | source set 目录中 Kotlin 源文件的位置。                       |
| `resources.srcDir` | source set 目录中资源的位置。                                 |
| `dependsOn`        | 与另一个 [source set 的连接](multiplatform-hierarchy#manual-configuration)。 |
| `dependencies`     | source set 的 [依赖项](#dependencies)。                                       |
| `languageSettings` | 应用于 source set 的 [语言设置](#language-settings)。 |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
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

</TabItem>
</Tabs>

## 编译 (Compilations)

一个 target 可以有一个或多个编译 (compilation)，例如，用于生产或测试。 有 [预定义的编译](#predefined-compilations)
在创建 target 时会自动添加。 此外，可以创建 [自定义编译](#custom-compilations)。

要引用 target 的所有或某些特定编译 (compilation)，请使用 `compilations` 对象集合。
从 `compilations`，可以通过其名称引用编译 (compilation)。

了解有关 [配置编译](multiplatform-configure-compilations) 的更多信息。

### 预定义的编译 (Compilations)

除了 Android target 之外，还会为项目的每个 target 自动创建预定义的编译 (compilation)。
可用的预定义编译 (compilation) 如下：

| **名称** | **描述**                     | 
|----------|-------------------------------------|
| `main`   | 用于生产源的编译 (compilation)。 |
| `test`   | 用于测试的编译 (compilation)。              |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 获取 main 编译输出
        }

        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main.output // 获取 main 编译输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</TabItem>
</Tabs>

### 自定义编译 (Compilations)

除了预定义的编译 (compilation) 之外，还可以创建自己的自定义编译 (compilation)。
要创建自定义编译 (compilation)，请将新项添加到 `compilations` 集合中。
如果使用 Kotlin Gradle DSL，请将自定义编译 (compilation) 标记为 `by creating`。

了解有关创建 [自定义编译](multiplatform-configure-compilations#create-a-custom-compilation) 的更多信息。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        /* ... */
                    }
                }

                // 创建一个测试任务来运行此编译生成的测试：
                tasks.register<Test>("integrationTest") {
                    /* ... */
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
                    /* ... */
                }
            }

            // 创建一个测试任务来运行此编译生成的测试：
            tasks.register('jvmIntegrationTest', Test) {
                /* ... */
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 编译 (Compilation) 参数

编译 (compilation) 具有以下参数：

| **名称**                 | **描述**                                                                                                                                                           | 
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 编译的默认 source set。                                                                                                                                     |
| `kotlinSourceSets`       | 参与编译的 source set。                                                                                                                             |
| `allKotlinSourceSets`    | 通过 `dependsOn()` 参与编译及其连接的 source set。                                                                                     |
| `compilerOptions`        | 应用于编译的编译器选项。 有关可用选项的列表，请参见 [编译器选项](gradle-compiler-options)。                                       |
| `compileKotlinTask`      | 用于编译 Kotlin 源的 Gradle 任务。                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名称。                                                                                                                                              |
| `compileAllTaskName`     | 用于编译编译所有源的 Gradle 任务的名称。                                                                                                       |
| `output`                 | 编译输出。                                                                                                                                                   |
| `compileDependencyFiles` | 编译的编译时依赖项文件（类路径）。 对于所有 Kotlin/Native 编译，这会自动包含标准库和平台依赖项。 |
| `runtimeDependencyFiles` | 编译的运行时依赖项文件（类路径）。                                                                                                                  |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 设置“main”编译的 Kotlin 编译器选项：
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // 获取 Kotlin 任务“compileKotlinJvm”
            output // 获取 main 编译输出
        }
        
        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有 target 的所有编译：
    compilerOptions {
        allWarningsAsErrors.set(true)
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
                    // 设置“main”编译的 Kotlin 编译器选项：
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // 获取 Kotlin 任务“compileKotlinJvm”
        compilations.main.output // 获取 main 编译输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有 target 的所有编译：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 编译器选项 (Compiler Option)

可以在项目的三个不同级别配置编译器选项 (compiler option)：

* **扩展级别**，在 `kotlin {}` 块中。
* **Target 级别**，在 target 块中。
* **编译单元级别**，通常在特定的编译任务中。

<img src="/img/compiler-options-levels.svg" alt="Kotlin 编译器选项级别" width="700" style={{verticalAlign: 'middle'}}/>

较高级别的设置用作较低级别的默认设置：

* 在扩展级别设置的编译器选项 (compiler option) 是 target 级别选项（包括共享 source set，如 `commonMain`、`nativeMain` 和 `commonTest`）的默认选项。
* 在 target 级别设置的编译器选项 (compiler option) 是编译单元（任务）级别选项（如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务）的默认选项。

在较低级别进行的配置会覆盖在较高级别进行的类似设置：

* 任务级别的编译器选项 (compiler option) 会覆盖 target 级别或扩展级别的类似设置。
* Target 级别的编译器选项 (compiler option) 会覆盖扩展级别的类似设置。

有关可能的编译器选项 (compiler option) 列表，请参见 [所有编译器选项](gradle-compiler-options#all-compiler-options)。

### 扩展级别

要配置项目中所有 target 的编译器选项 (compiler option)，请在顶层使用 `compilerOptions {}` 块：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    // 配置所有 target 的所有编译
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    // 配置所有 target 的所有编译：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### Target 级别

要配置项目中特定 target 的编译器选项 (compiler option)，请在 target 块中使用 `compilerOptions {}` 块：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        // 配置 JVM target 的所有编译
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        // 配置 JVM target 的所有编译
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### 编译单元级别

要配置特定任务的编译器选项 (compiler option)，请在该任务中使用 `compilerOptions {}` 块：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

要配置特定编译 (compilation) 的编译器选项 (compiler option)，请在编译的任务提供程序中使用 `compilerOptions {}` 块：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置“main”编译：
                compilerOptions {
                    allWarningsAsErrors.set(true)
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
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 配置“main”编译：
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 依赖项 (Dependencies)

source set 声明的 `dependencies {}` 块包含此 source set 的依赖项。

了解有关 [配置依赖项](gradle-configure-project) 的更多信息。

有四种类型的依赖项：

| **名称**         | **描述**                                                                     | 
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 当前模块的 API 中使用的依赖项。                                 |
| `implementation` | 在模块中使用但不暴露于模块外部的依赖项。                         |
| `compileOnly`    | 仅用于编译当前模块的依赖项。                       |
| `runtimeOnly`    | 在运行时可用但在任何模块的编译期间都不可见的依赖项。 |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        val jvmMain by getting {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

</TabItem>
</Tabs>

此外，source set 可以相互依赖并形成层次结构。
在这种情况下，使用 [`dependsOn()`](#source-set-parameters) 关系。

source set 依赖项也可以在构建脚本的顶层 `dependencies {}` 块中声明。
在这种情况下，它们的声明遵循模式 `<sourceSetName><DependencyKind>`，例如，`commonMainApi`。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</TabItem>
</Tabs>

## 语言设置

source set 的 `languageSettings {}` 块定义了项目分析和构建的某些方面。 以下语言设置可用：

| **名称**                |