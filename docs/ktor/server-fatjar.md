[//]: # (title: 使用 Ktor Gradle 插件创建 fat JARs)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>了解如何使用 Ktor Gradle 插件创建和运行可执行的 fat JAR。</link-summary>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins)允许你创建并运行一个包含所有代码依赖项（fat JAR）的可执行 JAR。

## 配置 Ktor 插件 {id="configure-plugin"}

要构建 fat JAR，你需要首先配置 Ktor 插件：

1.  打开 `build.gradle.kts` 文件并将插件添加到 `plugins` 代码块中：
    ```kotlin
    plugins {
        id("io.ktor.plugin") version "3.2.3"
    }
    ```

2.  确保 [主应用程序类](server-dependencies.topic#create-entry-point) 已配置：
    ```kotlin
    application {
        mainClass.set("com.example.ApplicationKt")
    }
    ```

3.  可选地，你可以使用 `ktor.fatJar` 扩展配置要生成的 fat JAR 的名称：
    ```kotlin
    ktor {
        fatJar {
            archiveFileName.set("fat.jar")
        }
    }
    ```

> 如果你同时应用 Ktor Gradle 插件和 Kotlin 多平台 Gradle 插件，fat JAR 创建特性会自动禁用。
> 若要能够同时使用它们：
> 1.  创建一个仅限 JVM 的项目并应用 Ktor Gradle 插件，如上所示。
> 2.  将 Kotlin 多平台项目作为依赖项添加到该仅限 JVM 的项目中。
>
> 如果此变通方法无法解决你的问题，请在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我们。
>
{style="warning"}

## 构建并运行 fat JAR {id="build"}

Ktor 插件提供了以下任务用于创建和运行 fat JAR：
-   `buildFatJar`：构建一个项目和运行时依赖项的组合 JAR。当此构建完成后，你会在 `build/libs` 目录下看到 `***-all.jar` 文件。
-   `runFatJar`：构建一个项目的 fat JAR 并运行它。

> 要了解如何使用 ProGuard 最小化生成的 JAR，请参考 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 示例。