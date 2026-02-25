[//]: # (title: 模块文档)

整个子项目以及该子项目中软件包的文档可以作为单独的 Markdown 文件提供。

## 文件格式

在 Markdown 文件中，整个子项目和各个软件包的文档由相应的一级标题引入。标题文本对于子项目**必须**为 **Module `<module name>`**，对于软件包**必须**为 **Package `<package qualified name>`**。

该文件不必同时包含子项目和软件包文档。您可以拥有仅包含软件包或子项目文档的文件。您甚至可以为每个子项目或软件包创建一个 Markdown 文件。

使用 [Markdown 语法](https://www.markdownguide.org/basic-syntax/)，您可以添加：
* 最高 6 级标题
* 加粗或斜体格式的强调
* 链接
* 内联代码
* 代码块
* 引用块

以下是一个同时包含子项目和软件包文档的示例文件：

```text
# Module kotlin-demo

此内容将显示在您的子项目名称下。

# Package org.jetbrains.kotlin.demo

此内容将显示在软件包列表中的软件包名称下。
它还会显示在软件包页面的一级标题下。

## org.jetbrains.kotlin.demo 软件包的 2 级标题

此标题后的内容也是 `org.jetbrains.kotlin.demo` 文档的一部分。

# Package org.jetbrains.kotlin.demo2

此内容将显示在软件包列表中的软件包名称下。
它还会显示在软件包页面的一级标题下。

## org.jetbrains.kotlin.demo2 软件包的 2 级标题

此标题后的内容也是 `org.jetbrains.kotlin.demo2` 文档的一部分。
```

要探索使用 Gradle 的示例项目，请参阅 [Dokka Gradle 示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-gradle-example)。

## 将文件传递给 Dokka

要将这些文件传递给 Dokka，您需要为 Gradle、Maven 或命令行使用相关的 **includes** 选项：

<tabs group="build-script">
<tab title="Gradle" group-key="gradle">

使用[通用配置](dokka-gradle-configuration-options.md)中的 `includes` 选项。

</tab>

<tab title="Maven" group-key="mvn">

使用[通用配置](dokka-maven.md#general-configuration)中的 `includes` 选项。

</tab>

<tab title="CLI" group-key="cli">

如果您使用的是命令行配置，请使用[源集选项](dokka-cli.md#source-set-options)中的 `includes` 选项。

如果您使用的是 JSON 配置，请使用[通用配置](dokka-cli.md#general-configuration)中的 `includes` 选项。

</tab>
</tabs>