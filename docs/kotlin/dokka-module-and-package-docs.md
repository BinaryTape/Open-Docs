[//]: # (title: 模块文档)

模块的整体文档以及该模块中的包的文档可以作为独立的 Markdown 文件提供。

## 文件格式

在 Markdown 文件中，整个模块和各个包的文档由相应的一级标题引入。标题文本**必须**是模块的 **Module `<module name>`**，以及包的 **Package `<package qualified name>`**。

文件不必同时包含模块和包文档。您可以拥有只包含包或模块文档的文件。甚至可以为每个模块或包提供一个 Markdown 文件。

使用 [Markdown 语法](https://www.markdownguide.org/basic-syntax/)，您可以添加：
* 标题，最高可达 6 级
* 使用粗体或斜体格式进行强调
* 链接
* 内联代码
* 代码块
* 引用块

这是一个包含模块和包文档的示例文件：

```text
# Module kotlin-demo

此内容将显示在您的模块名称下方。

# Package org.jetbrains.kotlin.demo

此内容将显示在包列表中您的包名称下方。
它还会显示在包页面的*一级标题*下方。

## Level 2 heading for package org.jetbrains.kotlin.demo

此标题之后的内容也是 `org.jetbrains.kotlin.demo` 文档的一部分。

# Package org.jetbrains.kotlin.demo2

此内容将显示在包列表中您的包名称下方。
它还会显示在包页面的*一级标题*下方。

## Level 2 heading for package org.jetbrains.kotlin.demo2

此标题之后的内容也是 `org.jetbrains.kotlin.demo2` 文档的一部分。
```

要查看一个使用 Gradle 的示例项目，请参见 [Dokka gradle example](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)。

## 将文件传递给 Dokka

要将这些文件传递给 Dokka，您需要为 Gradle、Maven 或 CLI 使用相关的 **includes** 选项：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

请使用 [Source set configuration](dokka-gradle.md#source-set-configuration) 中的 [includes](dokka-gradle.md#includes) 选项。

</tab>

<tab title="Maven" group-key="mvn">

请使用 [General configuration](dokka-maven.md#general-configuration) 中的 [includes](dokka-maven.md#includes) 选项。

</tab>

<tab title="CLI" group-key="cli">

如果您正在使用命令行配置，请使用 [Source set options](dokka-cli.md#source-set-options) 中的 [includes](dokka-cli.md#includes-cli) 选项。

如果您正在使用 JSON 配置，请使用 [General configuration](dokka-cli.md#general-configuration) 中的 [includes](dokka-cli.md#includes-json) 选项。

</tab>
</tabs>