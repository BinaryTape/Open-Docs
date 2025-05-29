[//]: # (title: 模块文档)

整个模块以及该模块中的包的文档可以作为单独的 Markdown 文件提供。

## 文件格式

在 Markdown 文件中，整个模块和单个包的文档由相应的一级标题引入。模块的标题文本**必须**是**Module `<module name>`**，包的标题文本**必须**是**Package `<package qualified name>`**。

该文件不必同时包含模块和包的文档。你可以只包含包或模块文档的文件。你甚至可以为每个模块或包创建一个 Markdown 文件。

使用 [Markdown 语法](https://www.markdownguide.org/basic-syntax/)，你可以添加：
* 标题（最多六级）
* 粗体或斜体格式的强调
* 链接
* 内联代码
* 代码块
* 引用块

这是一个包含模块和包文档的示例文件：

```text
# Module kotlin-demo

This content appears under your module name.

# Package org.jetbrains.kotlin.demo

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo`

# Package org.jetbrains.kotlin.demo2

This content appears under your package name in the packages list.
It also appears under the first-level heading on your package's page.

## Level 2 heading for package org.jetbrains.kotlin.demo2

Content after this heading is also part of documentation for `org.jetbrains.kotlin.demo2`
```

要查看一个使用 Gradle 的示例项目，请参阅 [Dokka Gradle 示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)。

## 将文件传递给 Dokka

要将这些文件传递给 Dokka，你需要为 Gradle、Maven 或 CLI 使用相关的 **includes** 选项：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

使用 [Source set configuration](dokka-gradle.md#source-set-configuration) 中的 [includes](dokka-gradle.md#includes) 选项。

</tab>

<tab title="Maven" group-key="mvn">

使用 [General configuration](dokka-maven.md#general-configuration) 中的 [includes](dokka-maven.md#includes) 选项。

</tab>

<tab title="CLI" group-key="cli">

如果你使用命令行配置，请使用 [Source set options](dokka-cli.md#source-set-options) 中的 [includes](dokka-cli.md#includes-cli) 选项。

如果你使用 JSON 配置，请使用 [General configuration](dokka-cli.md#general-configuration) 中的 [includes](dokka-cli.md#includes-json) 选项。

</tab>
</tabs>