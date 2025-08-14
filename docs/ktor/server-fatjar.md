[//]: # (title: 使用 Ktor Gradle 插件创建胖 JAR)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>了解如何使用 Ktor Gradle 插件创建并运行可执行的胖 JAR。</link-summary>

[Ktor Gradle plugin](https://github.com/ktorio/ktor-build-plugins) 允许您创建并运行一个包含所有代码依赖项的可执行 JAR（胖 JAR）。

## 配置 Ktor 插件 {id="configure-plugin"}

要构建胖 JAR，您需要首先配置 Ktor 插件：

1. 打开 `build.gradle.kts` 文件，并将该插件添加到 `plugins` 代码块：
   [object Promise]

2. 确保已配置 [主应用程序类](server-dependencies.topic#create-entry-point)：
   [object Promise]

3. （可选）您可以配置要生成的胖 JAR 的名称，使用 `ktor.fatJar` 扩展：
   [object Promise]

> 如果您同时应用 Ktor Gradle 插件和 Kotlin Multiplatform Gradle 插件，则胖 JAR 创建特性会自动禁用。
> 要能够将它们一起使用：
> 1. 创建一个仅限 JVM 的项目，并按照上述方式应用 Ktor Gradle 插件。
> 2. 将 Kotlin Multiplatform 项目添加为该仅限 JVM 的项目的依赖项。
> 
> 如果此替代方案未能解决您的问题，请在 [KTOR-8464](https://youtrack.jetbrains.com/issue/KTOR-8464) 中留言告知我们。
>
{style="warning"}

## 构建并运行胖 JAR {id="build"}

Ktor 插件提供了以下任务，用于创建和运行胖 JAR：
- `buildFatJar`：构建一个包含项目和运行时依赖项的组合 JAR。此构建完成后，您将在 `build/libs` 目录中看到 `***-all.jar` 文件。
- `runFatJar`：构建一个项目的胖 JAR 并运行它。

> 要了解如何使用 ProGuard 最小化生成的 JAR，请参考 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 示例。