[//]: # (title: 多平台 Gradle DSL 参考)

Kotlin Multiplatform Gradle 插件是用于创建 Kotlin 多平台项目的工具。
在此，我们提供其内容的参考；在为 Kotlin 多平台项目编写 Gradle 构建脚本时，可将其作为备忘录。了解 [Kotlin 多平台项目的概念，以及如何创建和配置它们](multiplatform-discover-project.md)。

## ID 和版本

Kotlin Multiplatform Gradle 插件的完全限定名为 `org.jetbrains.kotlin.multiplatform`。
如果使用 Kotlin Gradle DSL，可以使用 `kotlin("multiplatform")` 应用该插件。
插件版本与 Kotlin 发布版本匹配。最新版本是 %kotlinVersion%。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</TabItem>
</Tabs>

## 顶层代码块

`kotlin {}` 是 Gradle 构建脚本中用于多平台项目配置的顶层代码块。
在 `kotlin {}` 中，可以编写以下代码块：

| **代码块**           | **描述**                                                                                                                                     |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 声明项目的特定目标平台。可用目标平台的名称列于 [目标平台](#targets) 部分。                                                                 |
| `targets`            | 列出项目的所有目标平台。                                                                                                                   |
| `sourceSets`         | 配置项目的预定义和声明自定义 [源代码集](#source-sets)。                                                                                   |
| `compilerOptions`    | 指定通用的扩展级别 [编译器选项](#compiler-options)，它们用作所有目标平台和共享源代码集的默认值。                                              |
| `dependencies`       | 配置 [公共依赖项](#configure-dependencies-at-the-top-level)。 (实验性的)                                                              |

## 目标平台

_目标平台_ 是构建的一部分，负责编译、测试和打包面向受支持平台之一的软件。Kotlin 为每个平台提供目标平台，因此可以指示 Kotlin 为该特定目标平台编译代码。关于[设置目标平台](multiplatform-discover-project.md#targets)的更多信息。

每个目标平台可以有一个或多个[编译项](#compilations)。除了用于测试和生产目的的默认编译项外，还可以[创建自定义编译项](multiplatform-configure-compilations.md#create-a-custom-compilation)。

多平台项目的目标平台在 `kotlin {}` 内部的相应代码块中描述，例如 `jvm`、`android`、`iosArm64`。
可用目标平台的完整列表如下：

<table>
    
<tr>
<th>目标平台</th>
        <th>目标</th>
        <th>注释</th>
</tr>

    
<tr>
<td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
</tr>

    
<tr>
<td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>如果计划在 JavaScript 运行时中运行项目，请使用此选项。</td>
</tr>

    
<tr>
<td><code>wasmWasi</code></td>
        <td>如果需要支持 <a href="https://github.com/WebAssembly/WASI">WASI</a> 系统接口，请使用此选项。</td>
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
            <p>更多信息请参见 <a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">设置 Kotlin/JS 项目</a>。</p>
        </td>
</tr>

    
<tr>
<td>Kotlin/Native</td>
        <td></td>
        <td>
            <p>了解目前 macOS、Linux 和 Windows 主机支持的目标平台，请参见 <a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 目标平台支持</a>。</p>
        </td>
</tr>

    
<tr>
<td>Android 应用程序和库</td>
        <td><code>android</code></td>
        <td>
            <p>手动应用 Android Gradle 插件：<code>com.android.application</code> 或 <code>com.android.kotlin.multiplatform.library</code>。</p>
            <p>每个 Gradle 子项目只能创建一个 Android 目标。</p>
        </td>
</tr>

</table>

> 当前主机不支持的目标平台在构建期间会被忽略，因此不会发布。
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

目标平台的配置可以包括两部分：

*   所有目标平台都可用的 [通用目标配置](#common-target-configuration)。
*   目标平台特定的配置。

每个目标平台可以有一个或多个[编译项](#compilations)。

### 通用目标平台配置

在任何目标代码块中，可以使用以下声明：

| **名称**            | **描述**                                                                                                                                                                   |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 此目标平台的 Kotlin 平台。可用值：`jvm`、`androidJvm`、`js`、`wasm`、`native`、`common`。                                                                                 |
| `artifactsTaskName` | 构建此目标平台最终构件的任务名称。                                                                                                                                         |
| `components`        | 用于设置 Gradle 发布的组件。                                                                                                                                               |
| `compilerOptions`   | 用于目标平台的 [编译器选项](#compiler-options)。此声明会覆盖在 [顶层](multiplatform-dsl-reference.md#top-level-blocks) 配置的任何 `compilerOptions {}`。 |

### Web 目标平台

`js {}` 代码块描述 Kotlin/JS 目标平台的配置，而 `wasmJs {}` 代码块描述与 JavaScript 互操作的 Kotlin/Wasm 目标平台的配置。它们可以包含以下两个代码块之一，具体取决于目标执行环境：

| **名称**              | **描述**                  |
|-----------------------|---------------------------|
| [`browser`](#browser) | 浏览器目标平台的配置。    |
| [`nodejs`](#node-js)  | Node.js 目标平台的配置。  |

关于[配置 Kotlin/JS 项目](https://kotlinlang.org/docs/js-project-setup.html)的更多信息。

一个单独的 `wasmWasi {}` 代码块描述了支持 WASI 系统接口的 Kotlin/Wasm 目标平台的配置。
在此，只有 [`nodejs`](#node-js) 执行环境可用：

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

所有 web 目标平台，`js`、`wasmJs` 和 `wasmWasi`，也都支持 `binaries.executable()` 调用。它显式指示 Kotlin 编译器发出可执行文件。有关更多信息，请参见 Kotlin/JS 文档中的 [执行环境](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)。

#### 浏览器

`browser {}` 可以包含以下配置代码块：

| **名称**       | **描述**                                                                 |
|----------------|--------------------------------------------------------------------------|
| `testRuns`     | 测试执行的配置。                                                         |
| `runTask`      | 项目运行的配置。                                                         |
| `webpackTask`  | 使用 [Webpack](https://webpack.js.org/) 进行项目打包的配置。             |
| `distribution` | 输出文件的路径。                                                         |

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

| **名称**   | **描述**          |
|------------|-------------------|
| `testRuns` | 测试执行的配置。  |
| `runTask`  | 项目运行的配置。  |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 原生目标平台

对于原生目标平台，以下特定代码块可用：

| **名称**    | **描述**                                 |
|-------------|------------------------------------------|
| `binaries`  | 要生成的 [二进制文件](#binaries) 的配置。  |
| `cinterops` | [与 C 库互操作](#cinterops) 的配置。    |

#### 二进制文件

二进制文件有以下几种：

| **名称**     | **描述**          |
|--------------|-------------------|
| `executable` | 产品可执行文件。  |
| `test`       | 测试可执行文件。  |
| `sharedLib`  | 共享库。          |
| `staticLib`  | 静态库。          |
| `framework`  | Objective-C framework。 |

```kotlin
kotlin {
    linuxX64 { // 请使用你的目标平台。
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

对于二进制配置，以下参数可用：

| **名称**      | **描述**                                                                                                                                                                                                                                         |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 构建二进制文件的编译项。默认情况下，`test` 二进制文件基于 `test` 编译项，而其他二进制文件基于 `main` 编译项。                                                                                                                                    |
| `linkerOpts`  | 在构建二进制文件期间传递给系统链接器的选项。                                                                                                                                                                                                   |
| `baseName`    | 输出文件的自定义基础名称。最终文件名将通过在此基础名称前添加系统依赖的前缀和后缀来形成。                                                                                                                                                         |
| `entryPoint`  | 可执行二进制文件的入口函数。默认情况下，它是根包中的 `main()`。                                                                                                                                                                                |
| `outputFile`  | 访问输出文件。                                                                                                                                                                                                                                   |
| `linkTask`    | 访问链接任务。                                                                                                                                                                                                                                   |
| `runTask`     | 访问可执行二进制文件的运行任务。对于 `linuxX64`、`macosX64` 或 `mingwX64` 以外的目标平台，该值为 `null`。                                                                                                                                         |
| `isStatic`    | 对于 Objective-C framework。包含静态库而非动态库。                                                                                                                                                                                             |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 构建一个基于测试编译项的二进制文件。
        compilation = compilations["test"]

        // 链接器的自定义命令行选项。
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 输出文件的基础名称。
        baseName = "foo"

        // 自定义入口函数。
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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 构建一个基于测试编译项的二进制文件。
        compilation = compilations.test

        // 链接器的自定义命令行选项。
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 输出文件的基础名称。
        baseName = 'foo'

        // 自定义入口函数。
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

</TabItem>
</Tabs>

关于[构建原生二进制文件](multiplatform-build-native-binaries.md)的更多信息。

#### Cinterops

`cinterops` 是用于与原生库互操作的描述集合。
要提供与库的互操作，请向 `cinterops` 添加条目并定义其参数：

| **名称**         | **描述**                                 |
|------------------|------------------------------------------|
| `definitionFile` | 描述原生 API 的 `.def` 文件。            |
| `packageName`    | 生成的 Kotlin API 的包前缀。             |
| `compilerOpts`   | cinterop 工具要传递给编译器的选项。      |
| `includeDirs`    | 查找头文件的目录。                       |
| `header`         | 要包含在绑定中的头文件。                 |
| `headers`        | 要包含在绑定中的头文件列表。             |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 请使用你的目标平台。
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 描述原生 API 的定义文件。
                // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                definitionFile.set(project.file("def-file.def"))

                // 用于放置生成的 Kotlin API 的包。
                packageName("org.sample")

                // cinterop 工具要传递给编译器的选项。
                compilerOpts("-Ipath/to/headers")

                // 查找头文件的目录（类似于 -I<path> 编译器选项）。
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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 请使用你的目标平台。
        compilations.main {
            cinterops {
                myInterop {
                    // 描述原生 API 的定义文件。
                    // 默认路径是 src/nativeInterop/cinterop/<interop-name>.def
                    definitionFile = project.file("def-file.def")

                    // 用于放置生成的 Kotlin API 的包。
                    packageName 'org.sample'

                    // cinterop 工具要传递给编译器的选项。
                    compilerOpts '-Ipath/to/headers'

                    // 查找头文件的目录（类似于 -I<path> 编译器选项）。
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

</TabItem>
</Tabs>

有关更多 cinterop 属性，请参见 [定义文件](https://kotlinlang.org/docs/native-definition-file.html#properties)。

### Android 目标平台

Kotlin Multiplatform Gradle 插件有一个特定函数，可帮助你配置 Android 目标平台的 [构建变体](https://developer.android.com/studio/build/build-variants)：

| **名称**                      | **描述**                                                                                                   |
|-------------------------------|------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 指定要发布的构建变体。有关 [发布 Android 库](multiplatform-publish-lib-setup.md#publish-an-android-library) 的更多信息。 |

```kotlin
kotlin {
    android {
        publishLibraryVariants("release")
    }
}
```

关于 [Android 编译](multiplatform-configure-compilations.md#compilation-for-android) 的更多信息。

> `kotlin {}` 代码块内部的 `android` 配置不会替换任何 Android 项目的构建配置。
> 有关为 Android 项目编写构建脚本的更多信息，请参见 [Android 开发者文档](https://developer.android.com/studio/build)。
>
{style="note"}

## 源代码集

`sourceSets {}` 代码块描述项目的源代码集。源代码集包含共同参与编译的 Kotlin 源文件，以及它们的资源和依赖项。

多平台项目包含为其目标平台[预定义](#predefined-source-sets)的源代码集；
开发者还可以根据需要创建[自定义](#custom-source-sets)源代码集。

### 预定义的源代码集

预定义的源代码集在创建多平台项目时会自动设置。
可用的预定义源代码集如下：

| **名称**                                    | **描述**                                                                                                                                                                   |
|---------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 所有平台共享的代码和资源。在所有多平台项目中都可用。用于项目的所有 `main` [编译项](#compilations)。                                                                         |
| `commonTest`                                | 所有平台共享的测试代码和资源。在所有多平台项目中都可用。用于项目的所有测试编译项。                                                                                         |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 编译项的目标平台特定源。_&lt;targetName&gt;_ 是预定义目标平台的名称，_&lt;compilationName&gt;_ 是此目标平台的编译项名称。示例：`jsTest`、`jvmMain`。 |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        commonMain { /* ... */ }
    }
}
```

</TabItem>
</Tabs>

关于[源代码集](multiplatform-discover-project.md#source-sets)的更多信息。

### 自定义源代码集

自定义源代码集由项目开发者手动创建。
要创建自定义源代码集，请在 `sourceSets` 部分内部添加一个包含其名称的段落。
如果使用 Kotlin Gradle DSL，请使用 `by creating` 标记自定义源代码集。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets { 
        val myMain by creating { /* ... */ } // 创建一个名为 'MyMain' 的新源代码集
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets { 
        myMain { /* ... */ } // 创建或配置一个名为 'myMain' 的源代码集
    }
}
```

</TabItem>
</Tabs>

请注意，新创建的源代码集未与其他源代码集连接。要在项目的编译项中使用它，请[将其与其他源代码集连接](multiplatform-hierarchy.md#manual-configuration)。

### 源代码集参数

源代码集的配置存储在 `sourceSets {}` 的相应代码块中。源代码集具有以下参数：

| **名称**           | **描述**                                                       |
|--------------------|----------------------------------------------------------------|
| `kotlin.srcDir`    | 源代码集目录中 Kotlin 源文件的位置。                           |
| `resources.srcDir` | 源代码集目录中资源的位置。                                     |
| `dependsOn`        | [与另一个源代码集的连接](multiplatform-hierarchy.md#manual-configuration)。 |
| `dependencies`     | 源代码集的[依赖项](#dependencies)。                            |
| `languageSettings` | 应用于共享源代码集的[语言设置](#language-settings)。          |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## 编译项

目标平台可以有一个或多个编译项，例如用于生产或测试。有[预定义的编译项](#predefined-compilations)，它们在创建目标平台时会自动添加。此外，还可以创建[自定义编译项](#custom-compilations)。

要引用目标平台的所有或某些特定编译项，请使用 `compilations` 对象集合。
从 `compilations` 中，可以按名称引用编译项。

关于[配置编译项](multiplatform-configure-compilations.md)的更多信息。

### 预定义的编译项

预定义的编译项是为项目中的每个目标平台自动创建的，Android 目标平台除外。
可用的预定义编译项如下：

| **名称** | **描述**            |
|----------|---------------------|
| `main`   | 用于生产源的编译项。|
| `test`   | 用于测试的编译项。  |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 获取 main 编译项输出
        }

        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 获取 main 编译项输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }
}
```

</TabItem>
</Tabs>

### 自定义编译项

除了预定义的编译项外，还可以创建自己的自定义编译项。
为此，请在新编译项和 `main` 编译项之间设置 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 关系。如果使用 Kotlin Gradle DSL，请使用 `by creating` 标记自定义编译项：

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

通过关联编译项，将主编译项输出添加为依赖项，并在编译项之间建立 `internal` 可见性。

关于创建[自定义编译项](multiplatform-configure-compilations.md#create-a-custom-compilation)的更多信息。

### 编译项参数

编译项具有以下参数：

| **名称**                 | **描述**                                                                                                                                                                                                        |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 编译项的默认源代码集。                                                                                                                                                                                          |
| `kotlinSourceSets`       | 参与编译的源代码集。                                                                                                                                                                                            |
| `allKotlinSourceSets`    | 参与编译的源代码集及其通过 `dependsOn()` 的连接。                                                                                                                                                               |
| `compilerOptions`        | 应用于编译项的编译器选项。有关可用选项列表，请参见 [编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)。                                                                                        |
| `compileKotlinTask`      | 用于编译 Kotlin 源的 Gradle 任务。                                                                                                                                                                              |
| `compileKotlinTaskName`  | `compileKotlinTask` 的名称。                                                                                                                                                                                    |
| `compileAllTaskName`     | 用于编译编译项所有源的 Gradle 任务名称。                                                                                                                                                                        |
| `output`                 | 编译项输出。                                                                                                                                                                                                    |
| `compileDependencyFiles` | 编译项的编译期依赖项文件（类路径）。对于所有 Kotlin/Native 编译项，这会自动包含标准库和平台依赖项。                                                                                                              |
| `runtimeDependencyFiles` | 编译项的运行时依赖项文件（类路径）。                                                                                                                                                                            |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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
            output // 获取 main 编译项输出
        }
        
        compilations["test"].runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有目标平台的所有编译项：
    compilerOptions {
        allWarningsAsErrors.set(true)
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
                // 为 'main' 编译项设置 Kotlin 编译器选项：
                jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // 获取 Kotlin 任务 'compileKotlinJvm' 
        compilations.main.output // 获取 main 编译项输出
        compilations.test.runtimeDependencyFiles // 获取测试运行时类路径
    }

    // 配置所有目标平台的所有编译项：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 编译器选项

可以在项目的三个不同级别配置编译器选项：

*   **扩展级别**，在 `kotlin {}` 代码块中。
*   **目标平台级别**，在目标代码块中。
*   **编译单元级别**，通常在特定的编译任务中。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

较高级别的设置作为较低级别的默认值：

*   在扩展级别设置的编译器选项是目标平台级别选项的默认值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享源代码集。
*   在目标平台级别设置的编译器选项是编译单元（任务）级别选项的默认值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任务。

在较低级别进行的配置会覆盖较高级别的类似设置：

*   任务级别的编译器选项会覆盖目标平台或扩展级别的类似设置。
*   目标平台级别的编译器选项会覆盖扩展级别的类似设置。

有关可能编译器选项的列表，请参见 [所有编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)。

### 扩展级别

要为项目中的所有目标平台配置编译器选项，请在顶层使用 `compilerOptions {}` 代码块：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 配置所有目标平台的所有编译项
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 配置所有目标平台的所有编译项：
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### 目标平台级别

要为项目中的特定目标平台配置编译器选项，请在目标代码块中使用 `compilerOptions {}` 代码块：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // 配置 JVM 目标平台的所有编译项
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // 配置 JVM 目标平台的所有编译项
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### 编译单元级别

要为特定任务配置编译器选项，请在任务内部使用 `compilerOptions {}` 代码块：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

要为特定编译项配置编译器选项，请在编译项的任务提供器中，使用 `compilerOptions {}` 代码块：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

### 从 `kotlinOptions {}` 迁移到 `compilerOptions {}` {collapsible="true"}

在 Kotlin 2.2.0 之前，可以使用 `kotlinOptions {}` 代码块配置编译器选项。由于 `kotlinOptions {}`
代码块在 Kotlin 2.2.0 中已弃用，因此需要在构建脚本中使用 `compilerOptions {}` 代码块。
更多信息请参见 [从 `kotlinOptions{}` 迁移到 `compilerOptions{}`](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)。

## 依赖项

源代码集声明的 `dependencies {}` 代码块包含此源代码集的依赖项。

关于[配置依赖项](https://kotlinlang.org/docs/gradle-configure-project.html)的更多信息。

依赖项有四种类型：

| **名称**         | **描述**                                           |
|------------------|----------------------------------------------------|
| `api`            | 当前模块 API 中使用的依赖项。                      |
| `implementation` | 模块中使用的、但未向外部公开的依赖项。           |
| `compileOnly`    | 仅用于当前模块编译的依赖项。                       |
| `runtimeOnly`    | 运行时可用、但在任何模块编译期间不可见的依赖项。 |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

此外，源代码集可以相互依赖并形成层级结构。
在这种情况下，使用 [`dependsOn()`](#source-set-parameters) 关系。

### 配置顶层公共依赖项
<primary-label ref="Experimental"/>

可以使用顶层 `dependencies {}` 代码块配置公共依赖项。在此处声明的依赖项，其行为如同被添加到了 `commonMain` 或 `commonTest` 源代码集。

要使用顶层 `dependencies {}` 代码块，请在代码块前添加 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 注解以选择启用：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
    }
}
```

</TabItem>
</Tabs>

请在相应目标平台的 `sourceSets {}` 代码块中添加平台特有的依赖项。

你可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 上分享你对此特性的反馈。

## 语言设置

源代码集中的 `languageSettings {}` 代码块定义项目分析和编译的某些方面。仅使用 `languageSettings {}` 代码块来配置专门应用于共享源代码集的设置。对于所有其他情况，使用 `compilerOptions {}` 代码块在扩展或目标平台级别[配置编译器选项](#compiler-options)。

以下语言设置可用：

| **名称**                | **描述**                                                                                                                                                                                                     |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 提供与指定 Kotlin 版本的源兼容性。                                                                                                                                                                          |
| `apiVersion`            | 仅允许使用指定 Kotlin 版本捆绑库中的声明。                                                                                                                                                                  |
| `enableLanguageFeature` | 启用指定的语言特性。可用值与当前[实验性的](https://kotlinlang.org/docs/experimental-features.html)或在某个时间点作为实验性引入的语言特性相对应。 |
| `optIn`                 | 允许使用指定的 [选择性加入注解](https://kotlinlang.org/docs/opt-in-requirements.html)。                                                                                                                      |
| `progressiveMode`       | 启用 [渐进模式](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)。                                                                                                                              |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 可能值："2.0", "2.1", "2.2", "2.3", "2.4" (实验性的)
            apiVersion = "%apiVersion%" // 可能值："2.0", "2.1", "2.2", "2.3", "2.4" (实验性的)
            enableLanguageFeature("InlineClasses") // 语言特性名称
            optIn("kotlin.ExperimentalUnsignedTypes") // 注解完全限定名
            progressiveMode = true // 默认为 false
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 可能值：'2.0', '2.1', '2.2', '2.3', '2.4' (实验性的)
            apiVersion = '%apiVersion%' // 可能值：'2.0', '2.1', '2.2', '2.3', '2.4' (实验性的)
            enableLanguageFeature('InlineClasses') // 语言特性名称
            optIn('kotlin.ExperimentalUnsignedTypes') // 注解完全限定名
            progressiveMode = true // 默认为 false
        }
    }
}
```

</TabItem>
</Tabs>