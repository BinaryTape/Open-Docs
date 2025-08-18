[//]: # (title: 原生分发包)

本部分你将了解原生分发包：如何为所有支持的系统创建安装程序和软件包，以及如何在本地以与分发包相同的设置运行应用程序。

请阅读以下内容的详细信息：

*   [Compose Multiplatform Gradle 插件是什么](#gradle-plugin)？
*   关于[基本任务](#basic-tasks)（例如在本地运行应用程序）和[高级任务](#minification-and-obfuscation)（例如代码精简和混淆）的详细信息。
*   [如何包含 JDK 模块](#including-jdk-modules)以及处理 `ClassNotFoundException`。
*   [如何指定分发包属性](#specifying-distribution-properties)：包版本、JDK 版本、输出目录、启动器属性和元数据。
*   [如何管理资源](#managing-resources)：使用资源库、JVM 资源加载或将文件添加到打包的应用程序。
*   [如何自定义源代码集](#custom-source-sets)：使用 Gradle 源代码集、Kotlin JVM 目标或手动配置。
*   [如何为每个操作系统指定应用程序图标](#application-icon)。
*   [平台特有选项](#platform-specific-options)，例如 Linux 上软件包维护者的电子邮件以及 macOS 上 Apple App Store 的应用类别。
*   [macOS 特有配置](#macos-specific-configuration)：签名、公证和 `Info.plist`。

## Gradle 插件

本指南主要关注使用 Compose Multiplatform Gradle 插件打包 Compose 应用程序。
`org.jetbrains.compose` 插件提供了用于基本打包、混淆和 macOS 代码签名的任务。

该插件简化了使用 `jpackage` 将应用程序打包成原生分发包并在本地运行应用程序的过程。
可分发的应用程序是自包含的、可安装的二进制文件，包含所有必要的 Java 运行时组件，无需在目标系统上安装 JDK。

为了最小化软件包大小，Gradle 插件使用了 [jlink](https://openjdk.org/jeps/282) 工具，该工具确保在可分发包中只捆绑必要的 Java 模块。
但是，你仍然必须配置 Gradle 插件以指定你需要哪些模块。
有关更多信息，请参见 [undefined](#including-jdk-modules) 部分。

作为替代方案，你可以使用 [Conveyor](https://www.hydraulic.software)，这是一个不由 JetBrains 开发的外部工具。
Conveyor 支持在线更新、交叉构建和各种其他特性，但非开源项目需要[许可证](https://hydraulic.software/pricing.html)。
有关更多信息，请参考 [Conveyor 文档](https://conveyor.hydraulic.dev/latest/tutorial/hare/jvm)。

## 基本任务

Compose Multiplatform Gradle 插件中可配置的基本单元是 `application`（不要与已弃用的 [Gradle application](https://docs.gradle.org/current/userguide/application_plugin.html) 插件混淆）。

`application` DSL 方法定义了一组最终二进制文件的共享配置，这意味着
它允许你将一组文件以及 JDK 分发包打包成各种格式的压缩二进制安装程序。

支持的操作系统有以下可用格式：

*   **macOS**: `.dmg` (`TargetFormat.Dmg`), `.pkg` (`TargetFormat.Pkg`)
*   **Windows**: `.exe` (`TargetFormat.Exe`), `.msi` (`TargetFormat.Msi`)
*   **Linux**: `.deb` (`TargetFormat.Deb`), `.rpm` (`TargetFormat.Rpm`)

以下是包含基本桌面配置的 `build.gradle.kts` 文件示例：

```kotlin
import org.jetbrains.compose.desktop.application.dsl.TargetFormat

plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}

dependencies {
    implementation(compose.desktop.currentOs)
}

compose.desktop {
    application {
        mainClass = "example.MainKt"

        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Exe)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { mainClass = "}

当你构建项目时，插件会创建以下任务：

<table>

<tr>
<td>Gradle 任务</td>
        <td>描述</td>
</tr>

<tr>
<td><code>package&lt;FormatName&gt;</code></td>
        <td>将应用程序打包成相应的 <code>FormatName</code> 二进制文件。目前不支持交叉编译，
            这意味着你只能使用相应的兼容操作系统来构建特定格式。
            例如，要构建 <code>.dmg</code> 二进制文件，你必须在 macOS 上运行 <code>packageDmg</code> 任务。
            如果任何任务与当前操作系统不兼容，它们默认会被跳过。</td>
</tr>

<tr>
<td><code>packageDistributionForCurrentOS</code></td>
        <td>聚合应用程序的所有打包任务。这是一个 <a href="https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:task_categories">生命周期任务</a>。</td>
</tr>

<tr>
<td><code>packageUberJarForCurrentOS</code></td>
        <td>为当前操作系统创建一个包含所有依赖项的单个 JAR 文件。
        该任务要求将 <code>compose.desktop.currentOS</code> 用作 <code>compile</code>、<code>implementation</code> 或 <code>runtime</code> 依赖项。</td>
</tr>

<tr>
<td><code>run</code></td>
        <td>从 <code>mainClass</code> 中指定的入口点在本地运行应用程序。<code>run</code> 任务启动一个未打包的 JVM 应用程序，带有完整的运行时。
        与使用精简运行时创建紧凑二进制镜像相比，此方法更快且更易于调试。
        要运行最终二进制镜像，请改用 <code>runDistributable</code> 任务。</td>
</tr>

<tr>
<td><code>createDistributable</code></td>
        <td>创建最终应用程序镜像而不创建安装程序。</td>
</tr>

<tr>
<td><code>runDistributable</code></td>
        <td>运行预打包的应用程序镜像。</td>
</tr>

</table>

所有可用任务都列在 Gradle 工具窗口中。执行任务后，Gradle 会在 `${project.buildDir}/compose/binaries` 目录中生成输出二进制文件。

## 包含 JDK 模块

为了减小分发包大小，Gradle 插件使用 [jlink](https://openjdk.org/jeps/282) 来帮助只捆绑必要的 JDK 模块。

目前，Gradle 插件不会自动确定必要的 JDK 模块。虽然这不会导致编译问题，
但未能提供必要的模块可能导致运行时出现 `ClassNotFoundException`。

如果你在运行打包应用程序或 `runDistributable` 任务时遇到 `ClassNotFoundException`，
你可以使用 `modules` DSL 方法包含额外的 JDK 模块：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("java.sql")
            // Alternatively: includeAllModules = true
        }
    }
}
```

你可以手动指定所需的模块，或运行 `suggestModules`。`suggestModules` 任务使用 [jdeps](https://docs.oracle.com/javase/9/tools/jdeps.htm) 静态分析工具来确定可能缺失的模块。
请注意，该工具的输出可能不完整或列出不必要的模块。

如果分发包的大小不是关键因素并且可以忽略，你可以选择使用 `includeAllModules` DSL 属性包含所有运行时模块。

## 指定分发包属性

### 包版本

原生分发包必须具有特定的包版本。
要指定包版本，你可以使用以下 DSL 属性，按优先级从高到低列出：

*   `nativeDistributions.<os>.<packageFormat>PackageVersion` 为单个包格式指定版本。
*   `nativeDistributions.<os>.packageVersion` 为单个目标操作系统指定版本。
*   `nativeDistributions.packageVersion` 为所有包指定版本。

在 macOS 上，你还可以使用以下 DSL 属性指定构建版本，同样按优先级从高到低列出：

*   `nativeDistributions.macOS.<packageFormat>PackageBuildVersion` 为单个包格式指定构建版本。
*   `nativeDistributions.macOS.packageBuildVersion` 为所有 macOS 包指定构建版本。

如果你未指定构建版本，Gradle 会改用包版本。有关 macOS 上版本控制的更多信息，
请参见 [`CFBundleShortVersionString`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring)
和 [`CFBundleVersion`](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion) 文档。

以下是按优先级顺序指定包版本的模板：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            // Version for all packages
            packageVersion = "..." 
          
            macOS {
              // Version for all macOS packages
              packageVersion = "..."
              // Version for the dmg package only
              dmgPackageVersion = "..." 
              // Version for the pkg package only
              pkgPackageVersion = "..." 
              
              // Build version for all macOS packages
              packageBuildVersion = "..."
              // Build version for the dmg package only
              dmgPackageBuildVersion = "..." 
              // Build version for the pkg package only
              pkgPackageBuildVersion = "..." 
            }
            windows {
              // Version for all Windows packages
              packageVersion = "..."  
              // Version for the msi package only
              msiPackageVersion = "..."
              // Version for the exe package only
              exePackageVersion = "..." 
            }
            linux {
              // Version for all Linux packages
              packageVersion = "..."
              // Version for the deb package only
              debPackageVersion = "..."
              // Version for the rpm package only
              rpmPackageVersion = "..."
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="compose.desktop { application { nativeDistributions { packageVersion ="}

要定义包版本，请遵循以下规则：

<table>

<tr>
<td>文件类型</td>
        <td>版本格式</td>
        <td>详情</td>
</tr>

<tr>
<td><code>dmg</code>, <code>pkg</code></td>
        <td><code>MAJOR[.MINOR][.PATCH]</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code> 是一个大于 0 的整数</li>
                <li><code>MINOR</code> 是一个可选的非负整数</li>
                <li><code>PATCH</code> 是一个可选的非负整数</li>
            </ul>
        </td>
</tr>

<tr>
<td><code>msi</code>, <code>exe</code></td>
        <td><code>MAJOR.MINOR.BUILD</code></td>
        <td>
            <ul>
                <li><code>MAJOR</code> 是一个最大值为 255 的非负整数</li>
                <li><code>MINOR</code> 是一个最大值为 255 的非负整数</li>
                <li><code>BUILD</code> 是一个最大值为 65535 的非负整数</li>
            </ul>
        </td>
</tr>

<tr>
<td><code>deb</code></td>
        <td><code>[EPOCH:]UPSTREAM_VERSION[-DEBIAN_REVISION]</code></td>
        <td>
            <ul>
                <li><code>EPOCH</code> 是一个可选的非负整数</li>
                <li><code>UPSTREAM_VERSION</code>:
                    <ul>
                        <li>只能包含字母数字字符以及 <code>.</code>、<code>+</code>、<code>-</code>、<code>~</code> 字符</li>
                        <li>必须以数字开头</li>
                    </ul>
                </li>
                <li><code>DEBIAN_REVISION</code>:
                    <ul>
                        <li>可选</li>
                        <li>只能包含字母数字字符以及 <code>.</code>、<code>+</code>、<code>~</code> 字符</li>
                    </ul>
                </li>
            </ul>
            有关更多详情，请参见 <a href="https://www.debian.org/doc/debian-policy/ch-controlfields.html#version">Debian 文档</a>。
        </td>
</tr>

<tr>
<td><code>rpm</code></td>
        <td>任何格式</td>
        <td>版本不得包含 <code>-</code>（破折号）字符。</td>
</tr>

</table>

### JDK 版本

该插件使用 `jpackage`，它要求 JDK 版本不低于 [JDK 17](https://openjdk.java.net/projects/jdk/17/)。
在指定 JDK 版本时，请确保你满足以下至少一项要求：

*   `JAVA_HOME` 环境变量指向兼容的 JDK 版本。
*   通过 DSL 设置 `javaHome` 属性：

    ```kotlin
    compose.desktop {
        application {
            javaHome = System.getenv("JDK_17")
        }
    }
    ```

### 输出目录

要为原生分发包使用自定义输出目录，请按如下所示配置 `outputBaseDir` 属性：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            outputBaseDir.set(project.layout.buildDirectory.dir("customOutputDir"))
        }
    }
}
```

### 启动器属性

要调整应用程序启动过程，你可以自定义以下属性：

<table>

<tr>
<td>属性</td>
    <td>描述</td>
</tr>

<tr>
<td><code>mainClass</code></td>
    <td>包含 <code>main</code> 方法的类的完全限定名称。</td>
</tr>

<tr>
<td><code>args</code></td>
    <td>应用程序 <code>main</code> 方法的实参。</td>
</tr>

<tr>
<td><code>jvmArgs</code></td>
    <td>应用程序 JVM 的实参。</td>
</tr>

</table>

以下是一个配置示例：

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        args += listOf("-customArgument")
        jvmArgs += listOf("-Xmx2G")
    }
}
```

### 元数据

在 `nativeDistributions` DSL 代码块中，你可以配置以下属性：

<table>

<tr>
<td>属性</td>
    <td>描述</td>
    <td>默认值</td>
</tr>

<tr>
<td><code>packageName</code></td>
    <td>应用程序的名称。</td>
    <td>Gradle 项目的 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getName--">名称</a></td>
</tr>

<tr>
<td><code>packageVersion</code></td>
    <td>应用程序的版本。</td>
    <td>Gradle 项目的 <a href="https://docs.gradle.org/current/javadoc/org/gradle/api/Project.html#getVersion--">版本</a></td>
</tr>

<tr>
<td><code>description</code></td>
    <td>应用程序的描述。</td>
    <td>无</td>
</tr>

<tr>
<td><code>copyright</code></td>
    <td>应用程序的版权信息。</td>
    <td>无</td>
</tr>

<tr>
<td><code>vendor</code></td>
    <td>应用程序的供应商。</td>
    <td>无</td>
</tr>

<tr>
<td><code>licenseFile</code></td>
    <td>应用程序的许可证文件。</td>
    <td>无</td>
</tr>

</table>

以下是一个配置示例：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            packageName = "ExampleApp"
            packageVersion = "0.1-SNAPSHOT"
            description = "Compose Multiplatform App"
            copyright = "© 2024 My Name. All rights reserved."
            vendor = "Example vendor"
            licenseFile.set(project.file("LICENSE.txt"))
        }
    }
}
```

## 资源管理

要打包和加载资源，你可以使用 Compose Multiplatform 资源库、JVM 资源加载或将文件添加到打包的应用程序。

### 资源库

为项目设置资源最直接的方法是使用资源库。
通过资源库，你可以在所有支持的平台上的通用代码中访问资源。
详情请参见[多平台资源](compose-multiplatform-resources.md)。

### JVM 资源加载

Compose Multiplatform for desktop 在 JVM 平台上运行，这意味着你可以使用 `java.lang.Class` API 从 `.jar` 文件加载资源。你可以通过
[`Class::getResource`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResource(java.lang.String))
或 [`Class::getResourceAsStream`](https://docs.oracle.com/en/java/javase/15/docs/api/java.base/java/lang/Class.html#getResourceAsStream(java.lang.String))
访问 `src/main/resources` 目录中的文件。

### 将文件添加到打包的应用程序

在某些情况下，从 `.jar` 文件加载资源可能不那么实用，例如，当你有特定于目标的资产并且需要只将文件包含在 macOS 包中而不包含在 Windows 包中时。

在这些情况下，你可以配置 Gradle 插件以在安装目录中包含额外的资源文件。
按如下所示使用 DSL 指定根资源目录：

```kotlin
compose.desktop {
    application {
        mainClass = "MainKt"
        nativeDistributions {
            targetFormats(TargetFormat.Dmg, TargetFormat.Msi, TargetFormat.Deb)
            packageVersion = "1.0.0"

            appResourcesRootDir.set(project.layout.projectDirectory.dir("resources"))
        }
    }
}
```

在上述示例中，根资源目录被定义为 `<PROJECT_DIR>/resources`。

Gradle 插件将按如下方式包含资源子目录中的文件：

1.  **通用资源：**
    位于 `<RESOURCES_ROOT_DIR>/common` 中的文件将包含在所有包中，无论目标操作系统或架构如何。

2.  **操作系统特有资源：**
    位于 `<RESOURCES_ROOT_DIR>/<OS_NAME>` 中的文件将只包含在为特定操作系统构建的包中。
    `<OS_NAME>` 的有效值为：`windows`、`macos` 和 `linux`。

3.  **操作系统和架构特有资源：**
    位于 `<RESOURCES_ROOT_DIR>/<OS_NAME>-<ARCH_NAME>` 中的文件将只包含在为操作系统和 CPU 架构的特定组合构建的包中。
    `<ARCH_NAME>` 的有效值为：`x64` 和 `arm64`。
    例如，`<RESOURCES_ROOT_DIR>/macos-arm64` 中的文件将只包含在用于 Apple Silicon Mac 的包中。

你可以使用 `compose.application.resources.dir` 系统属性访问包含的资源：

```kotlin
import java.io.File

val resourcesDir = File(System.getProperty("compose.application.resources.dir"))

fun main() {
    println(resourcesDir.resolve("resource.txt").readText())
}
```

## 自定义源代码集

如果你使用 `org.jetbrains.kotlin.jvm` 或
`org.jetbrains.kotlin.multiplatform` 插件，你可以依赖默认配置：

*   使用 `org.jetbrains.kotlin.jvm` 的配置包含来自 `main` [源代码集](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)的内容。
*   使用 `org.jetbrains.kotlin.multiplatform` 的配置包含来自单个 [JVM 目标](multiplatform-dsl-reference.md#targets)的内容。
    如果你定义了多个 JVM 目标，则默认配置会被禁用。在这种情况下，你需要手动配置插件，
    或指定单个目标（参见下文）。

如果默认配置模糊或不充分，你可以通过以下几种方式进行自定义：

使用 Gradle [源代码集](https://docs.gradle.org/current/userguide/java_plugin.html#source_sets)：

```kotlin
plugins {
    kotlin("jvm")
    id("org.jetbrains.compose")
}
val customSourceSet = sourceSets.create("customSourceSet")
compose.desktop {
    application {
        from(customSourceSet)
    }
}
```

使用 Kotlin [JVM 目标](multiplatform-dsl-reference.md#targets)：

```kotlin
plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
} 
kotlin {
    jvm("customJvmTarget") {}
}
compose.desktop {
    application {
        from(kotlin.targets["customJvmTarget"])
    }
}
```

手动：

*   使用 `disableDefaultConfiguration` 禁用默认设置。
*   使用 `fromFiles` 指定要包含的文件。
*   指定 `mainJar` 文件属性以指向包含主类的 `.jar` 文件。
*   使用 `dependsOn` 将任务依赖项添加到所有插件任务。
```kotlin
compose.desktop {
    application {
        disableDefaultConfiguration()
        fromFiles(project.fileTree("libs/") { include("**/*.jar") })
        mainJar.set(project.file("main.jar"))
        dependsOn("mainJarTask")
    }
}
```

## 应用程序图标

确保你的应用程序图标以以下操作系统特有格式提供：

*   `.icns` 用于 macOS
*   `.ico` 用于 Windows
*   `.png` 用于 Linux

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                iconFile.set(project.file("icon.icns"))
            }
            windows {
                iconFile.set(project.file("icon.ico"))
            }
            linux {
                iconFile.set(project.file("icon.png"))
            }
        }
    }
}
```

## 平台特有选项

平台特有设置可以使用相应的 DSL 代码块进行配置：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            macOS {
                // Options for macOS
            }
            windows {
                // Options for Windows
            }
            linux {
                // Options for Linux
            }
        }
    }
}
```

下表描述了所有支持的平台特有选项。**不推荐**使用未文档化的属性。

<table>

<tr>
<td>平台</td>
        <td>选项</td>
        <td width="500">描述</td>
</tr>

<tr>
<td rowspan="3">所有平台</td>
        <td><code>iconFile.set(File("PATH_TO_ICON"))</code></td>
        <td>指定应用程序平台特有图标的路径。详情请参见<a href="#application-icon">应用程序图标</a>部分。</td>
</tr>

<tr>
<td><code>packageVersion = "1.0.0"</code></td>
        <td>设置平台特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。</td>
</tr>

<tr>
<td><code>installationPath = "PATH_TO_INST_DIR"</code></td>
        <td>指定默认安装目录的绝对或相对路径。
            在 Windows 上，你还可以使用 <code>dirChooser = true</code> 来在安装过程中启用自定义路径。</td>
</tr>

<tr>
<td rowspan="8">Linux</td>
        <td><code>packageName = "custom-package-name"</code></td>
        <td>覆盖默认应用程序名称。</td>
</tr>

<tr>
<td><code>debMaintainer = "maintainer@example.com"</code></td>
        <td>指定包维护者的电子邮件。</td>
</tr>

<tr>
<td><code>menuGroup = "my-example-menu-group"</code></td>
        <td>为应用程序定义菜单组。</td>
</tr>

<tr>
<td><code>appRelease = "1"</code></td>
        <td>为 rpm 包设置发布值，或为 deb 包设置修订值。</td>
</tr>

<tr>
<td><code>appCategory = "CATEGORY"</code></td>
        <td>为 rpm 包分配组值，或为 deb 包分配节值。</td>
</tr>

<tr>
<td><code>rpmLicenseType = "TYPE_OF_LICENSE"</code></td>
        <td>指示 rpm 包的许可证类型。</td>
</tr>

<tr>
<td><code>debPackageVersion = "DEB_VERSION"</code></td>
        <td>设置 deb 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。</td>
</tr>

<tr>
<td><code>rpmPackageVersion = "RPM_VERSION"</code></td>
        <td>设置 rpm 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。</td>
</tr>

<tr>
<td rowspan="15">macOS</td>
        <td><code>bundleID</code></td>
        <td>
            指定唯一的应用程序标识符，只能包含字母数字字符
            (<code>A-Z</code>, <code>a-z</code>, <code>0-9</code>)、连字符 (<code>-</code>) 和
            句点 (<code>.</code>)。建议使用反向 DNS 表示法 (<code>com.mycompany.myapp</code>)。
        </td>
</tr>

<tr>
<td><code>packageName</code></td>
        <td>应用程序的名称。</td>
</tr>

<tr>
<td><code>dockName</code></td>
        <td>
            在菜单栏、"关于 &lt;App&gt;" 菜单项和 Dock 中显示的应用程序名称。默认值为 <code>packageName</code>。
        </td>
</tr>

<tr>
<td><code>minimumSystemVersion</code></td>
        <td>
            运行应用程序所需的最低 macOS 版本。详情请参见
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsminimumsystemversion">
                <code>LSMinimumSystemVersion</code></a>。
        </td>
</tr>

<tr>
<td><code>signing</code>, <code>notarization</code>, <code>provisioningProfile</code>, <code>runtimeProvisioningProfile</code></td>
        <td>
            请参见
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS 上的分发包签名与公证</a> 教程。
        </td>
</tr>

<tr>
<td><code>appStore = true</code></td>
        <td>指定是否为 Apple App Store 构建和签名应用程序。要求至少 JDK 17。</td>
</tr>

<tr>
<td><code>appCategory</code></td>
        <td>
            Apple App Store 的应用类别。为 App Store 构建时，默认值为
            <code>public.app-category.utilities</code>，否则为 <code>Unknown</code>。
            有效类别列表请参见
            <a href="https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype">
                <code>LSApplicationCategoryType</code>
            </a>。
        </td>
</tr>

<tr>
<td><code>entitlementsFile.set(File("PATH_ENT"))</code></td>
        <td>
            指定包含签名时使用的授权文件的路径。当你提供自定义文件时，
            请确保添加 Java 应用程序所需的授权。有关为 App Store 构建时使用的默认文件，请参见
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>。请注意，此默认文件可能因你的 JDK 版本而异。
            如果未指定文件，插件将使用 <code>jpackage</code> 提供的默认授权。
            详情请参见
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS 上的分发包签名与公证</a> 教程。
        </td>
</tr>

<tr>
<td><code>runtimeEntitlementsFile.set(File("PATH_R_ENT"))</code></td>
        <td>
            指定包含签名 JVM 运行时时使用的授权文件的路径。当你提供自定义文件时，
            请确保添加 Java 应用程序所需的授权。有关为 App Store 构建时使用的默认文件，请参见
            <a href="https://github.com/openjdk/jdk/blob/master/src/jdk.jpackage/macosx/classes/jdk/jpackage/internal/resources/sandbox.plist">
                sandbox.plist</a>。请注意，此默认文件可能因你的 JDK 版本而异。
            如果未指定文件，插件将使用 <code>jpackage</code> 提供的默认授权。
            详情请参见
            <a href="https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Signing_and_notarization_on_macOS">
               macOS 上的分发包签名与公证</a> 教程。
        </td>
</tr>

<tr>
<td><code>dmgPackageVersion = "DMG_VERSION"</code></td>
        <td>
            设置 DMG 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。
        </td>
</tr>

<tr>
<td><code>pkgPackageVersion = "PKG_VERSION"</code></td>
        <td>
            设置 PKG 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。
        </td>
</tr>

<tr>
<td><code>packageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            设置包构建版本。详情请参见<a href="#package-version">包版本</a>部分。
        </td>
</tr>

<tr>
<td><code>dmgPackageBuildVersion = "DMG_VERSION"</code></td>
        <td>
            设置 DMG 特有的包构建版本。详情请参见<a href="#package-version">包版本</a>部分。
        </td>
</tr>

<tr>
<td><code>pkgPackageBuildVersion = "PKG_VERSION"</code></td>
        <td>
            设置 PKG 特有的包构建版本。详情请参见<a href="#package-version">包版本</a>部分。
        </td>
</tr>

<tr>
<td><code>infoPlist</code></td>
        <td>请参见<a href="#information-property-list-on-macos">macOS 上的 <code>Info.plist</code></a> 部分。</td>
</tr>

<tr>
<td rowspan="7">Windows</td>
            <td><code>console = true</code></td>
            <td>为应用程序添加控制台启动器。</td>
</tr>

<tr>
<td><code>dirChooser = true</code></td>
            <td>在安装过程中启用自定义安装路径。</td>
</tr>

<tr>
<td><code>perUserInstall = true</code></td>
            <td>启用按用户安装应用程序。</td>
</tr>

<tr>
<td><code>menuGroup = "start-menu-group"</code></td>
            <td>将应用程序添加到指定的开始菜单组。</td>
</tr>

<tr>
<td><code>upgradeUuid = "UUID"</code></td>
            <td>指定一个唯一 ID，该 ID 允许用户通过安装程序更新应用程序，
            当有比已安装版本更新的版本时。该值对于单个应用程序必须保持不变。
            详情请参见 <a href="https://wixtoolset.org/documentation/manual/v3/howtos/general/generate_guids.html">How To: Generate a GUID</a>。</td>
</tr>

<tr>
<td><code>msiPackageVersion = "MSI_VERSION"</code></td>
            <td>设置 MSI 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。</td>
</tr>

<tr>
<td><code>exePackageVersion = "EXE_VERSION"</code></td>
            <td>设置 EXE 特有的包版本。详情请参见<a href="#package-version">包版本</a>部分。</td>
</tr>

</table>

## macOS 特有配置

### macOS 上的签名与公证

现代 macOS 版本不允许用户执行从互联网下载的未签名应用程序。如果你尝试运行此类应用程序，你将遇到
以下错误：“YourApp is damaged and can't be open. You should eject the disk image”（你的应用已损坏，无法打开。你应该弹出磁盘镜像）。

要了解如何签名和公证你的应用程序，请参见我们的[教程](https://github.com/JetBrains/compose-multiplatform/blob/master/tutorials/Signing_and_notarization_on_macOS/README.md)。

### macOS 上的信息属性列表

虽然 DSL 支持基本的平台特有自定义，但仍可能存在超出所提供功能的情况。
如果你需要指定 DSL 中未表示的 `Info.plist` 值，
你可以包含一段原始 XML 作为变通方法。此 XML 将附加到应用程序的 `Info.plist` 中。

#### 示例：深度链接

1.  在 `build.gradle.kts` 文件中定义一个自定义 URL 方案：

    ```kotlin
    compose.desktop {
        application {
            mainClass = "MainKt"
            nativeDistributions {
                targetFormats(TargetFormat.Dmg)
                packageName = "Deep Linking Example App"
                macOS {
                    bundleID = "org.jetbrains.compose.examples.deeplinking"
                    infoPlist {
                        extraKeysRawXml = macExtraPlistKeys
                    }
                }
            }
        }
    }
    
    val macExtraPlistKeys: String
        get() = """
          <key>CFBundleURLTypes</key>
          <array>
            <dict>
              <key>CFBundleURLName</key>
              <string>Example deep link</string>
              <key>CFBundleURLSchemes</key>
              <array>
                <string>compose</string>
              </array>
            </dict>
          </array>
        """
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="infoPlist { extraKeysRawXml = macExtraPlistKeys"}

2.  在 `src/main/main.kt` 文件中使用 `java.awt.Desktop` 类设置 URI 处理程序：

    ```kotlin 
    import androidx.compose.material.MaterialTheme
    import androidx.compose.material.Text
    import androidx.compose.runtime.getValue
    import androidx.compose.runtime.mutableStateOf
    import androidx.compose.runtime.setValue
    import androidx.compose.ui.window.singleWindowApplication
    import java.awt.Desktop
    
    fun main() {
        var text by mutableStateOf("Hello, World!")
    
        try {
            Desktop.getDesktop().setOpenURIHandler { event ->
                text = "Open URI: " + event.uri
            }
        } catch (e: UnsupportedOperationException) {
            println("setOpenURIHandler is unsupported")
        }
    
        singleWindowApplication {
            MaterialTheme {
                Text(text)
            }
        }
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="Desktop.getDesktop().setOpenURIHandler { event ->"}

3.  执行 `runDistributable` 任务：`./gradlew runDistributable`。

结果是，像 `compose://foo/bar` 这样的链接现在可以从浏览器重定向到你的应用程序。

## 精简与混淆

Compose Multiplatform Gradle 插件内置支持 [ProGuard](https://www.guardsquare.com/proguard)。
ProGuard 是一个用于代码精简和混淆的[开源工具](https://github.com/Guardsquare/proguard)。

对于每个*默认*（不带 ProGuard）打包任务，Gradle 插件提供一个*发布*任务（带 ProGuard）：

<table>

<tr>
<td width="400">Gradle 任务</td>
    <td>描述</td>
</tr>

<tr>
<td>
        <p>默认: <code>createDistributable</code></p>
        <p>发布: <code>createReleaseDistributable</code></p>
    </td>
    <td>创建捆绑了 JDK 和资源的应用程序镜像。</td>
</tr>

<tr>
<td>
        <p>默认: <code>runDistributable</code></p>
        <p>发布: <code>runReleaseDistributable</code></p>
    </td>
    <td>运行捆绑了 JDK 和资源的应用程序镜像。</td>
</tr>

<tr>
<td>
        <p>默认: <code>run</code></p>
        <p>发布: <code>runRelease</code></p>
    </td>
    <td>使用 Gradle JDK 运行非打包应用程序 <code>.jar</code>。</td>
</tr>

<tr>
<td>
        <p>默认: <code>package&lt;FORMAT_NAME&gt;</code></p>
        <p>发布: <code>packageRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>将应用程序镜像打包成 <code>&lt;FORMAT_NAME&gt;</code> 文件。</td>
</tr>

<tr>
<td>
        <p>默认: <code>packageDistributionForCurrentOS</code></p>
        <p>发布: <code>packageReleaseDistributionForCurrentOS</code></p>
    </td>
    <td>将应用程序镜像打包成与当前操作系统兼容的格式。</td>
</tr>

<tr>
<td>
        <p>默认: <code>packageUberJarForCurrentOS</code></p>
        <p>发布: <code>packageReleaseUberJarForCurrentOS</code></p>
    </td>
    <td>将应用程序镜像打包成一个超级 (胖) <code>.jar</code>。</td>
</tr>

<tr>
<td>
        <p>默认: <code>notarize&lt;FORMAT_NAME&gt;</code></p>
        <p>发布: <code>notarizeRelease&lt;FORMAT_NAME&gt;</code></p>
    </td>
    <td>上传 <code>&lt;FORMAT_NAME&gt;</code> 应用程序镜像以进行公证（仅限 macOS）。</td>
</tr>

<tr>
<td>
        <p>默认: <code>checkNotarizationStatus</code></p>
        <p>发布: <code>checkReleaseNotarizationStatus</code></p>
    </td>
    <td>检测公证是否成功（仅限 macOS）。</td>
</tr>

</table>

默认配置启用了一些预定义 ProGuard 规则：

*   应用程序镜像被精简，即移除了未使用的类。
*   `compose.desktop.application.mainClass` 用作入口点。
*   包含多条 `keep` 规则以确保 Compose 运行时保持功能性。

在大多数情况下，你不需要任何额外的配置即可获得精简的应用程序。
然而，ProGuard 可能不会跟踪字节码中的某些用法，例如，当一个类通过反射使用时。
如果你遇到只在 ProGuard 处理后出现的问题，你可能需要添加自定义规则。

要指定自定义配置文件，请按如下所示使用 DSL：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            configurationFiles.from(project.file("compose-desktop.pro"))
        }
    }
}
```

有关 ProGuard 规则和配置选项的更多信息，请参阅 Guardsquare [手册](https://www.guardsquare.com/manual/configuration/usage)。

混淆默认禁用。要启用它，请通过 Gradle DSL 设置以下属性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            obfuscate.set(true)
        }
    }
}
```

ProGuard 的优化默认启用。要禁用它们，请通过 Gradle DSL 设置以下属性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            optimize.set(false)
        }
    }
}
```

生成超级 JAR 默认禁用，ProGuard 会为每个输入 `.jar` 生成相应的 `.jar` 文件。要启用它，请通过 Gradle DSL 设置以下属性：

```kotlin
compose.desktop {
    application {
        buildTypes.release.proguard {
            joinOutputJars.set(true)
        }
    }
}
```

## 下一步？

探索关于[桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)的教程。