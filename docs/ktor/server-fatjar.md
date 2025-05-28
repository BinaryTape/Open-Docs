[//]: # (title: 使用 Ktor Gradle 插件创建 Fat JAR)

<tldr>
<var name="example_name" value="deployment-ktor-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>了解如何使用 Ktor Gradle 插件创建并运行可执行的 Fat JAR。</link-summary>

[Ktor Gradle 插件](https://github.com/ktorio/ktor-build-plugins) 允许你创建并运行一个包含所有代码依赖的可执行 JAR (Fat JAR)。

## 配置 Ktor 插件 {id="configure-plugin"}
要构建一个 Fat JAR，你需要首先配置 Ktor 插件：
1. 打开 `build.gradle.kts` 文件并将插件添加到 `plugins` 代码块中：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="4,7-8"}

2. 确保 [主应用程序类](server-dependencies.topic#create-entry-point) 已配置：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="10-12"}

3. 你还可以选择使用 `ktor.fatJar` 扩展配置要生成的 Fat JAR 的名称：
   ```kotlin
   ```
   {src="snippets/deployment-ktor-plugin/build.gradle.kts" include-lines="28-31,53"}

## 构建并运行 Fat JAR {id="build"}

Ktor 插件提供了以下用于创建和运行 Fat JAR 的任务：
- `buildFatJar`: 构建项目和运行时依赖的组合 JAR。此构建完成后，你将在 `build/libs` 目录下看到 `***-all.jar` 文件。
- `runFatJar`: 构建项目的 Fat JAR 并运行它。

> 要了解如何使用 ProGuard 最小化生成的 JAR，请参阅 [proguard](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/proguard) 示例。