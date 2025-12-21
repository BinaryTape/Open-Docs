[//]: # (title: Dokka 插件)

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。DGP v1 模式不再受支持。要从 v1 模式升级到 v2 模式，请遵循[迁移指南](dokka-migration.md)。
>
{style="note"}

Dokka 从零开始构建，旨在高度可扩展和高度可定制，这使得社区能够实现针对缺失或开箱即用未提供的非常特定特性的插件。

Dokka 插件的范围很广，从支持其他编程语言的源代码到不常见的输出格式，无所不包。你可以添加对自定义 KDoc 标签或注解的支持，教 Dokka 如何渲染 KDoc 描述中发现的不同 DSL，对 Dokka 页面进行视觉重新设计，使其无缝集成到公司网站，将其与其他工具集成，以及更多功能。

如果你想学习如何创建 Dokka 插件，请参见[开发者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 应用 Dokka 插件

Dokka 插件作为单独的 artifact 发布，因此要应用 Dokka 插件，你只需将其添加为依赖项即可。此后，插件会自动扩展 Dokka - 无需进一步操作。

> 使用相同扩展点或以类似方式工作的插件可能会相互干扰。
> 这可能导致视觉 bug、普遍的未定义行为，甚至构建失败。然而，由于 Dokka 不暴露任何可变数据结构或对象，因此不应导致并发问题。
>
> 如果你注意到类似问题，最好检测一下应用了哪些插件以及它们的作用。
>
{style="note"}

让我们看看如何将 [mathjax 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)应用到你的项目：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dependencies {
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin")
}
```

> * 内置插件（如 HTML 和 Javadoc）始终自动应用。你只需配置它们，无需声明对它们的依赖项。
>
> * 在文档化多模块项目（多项目构建）时，你需要在[子项目之间共享 Dokka 配置和插件](dokka-gradle.md#multi-project-configuration)。
>
{style="note"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dependencies {
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin'
}
```

> 在文档化[多项目](dokka-gradle.md#multi-project-configuration)构建时，你需要在[子项目之间共享 Dokka 配置](dokka-gradle.md#multi-project-configuration)。
>
{style="note"}

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>mathjax-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

如果你正在使用带有[命令行选项](dokka-cli.md#run-with-command-line-options)的 [CLI](dokka-cli.md) 运行器，Dokka 插件应作为 `.jar` 文件传递给 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果你正在使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，Dokka 插件应在 `pluginsClasspath` 下指定。

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./mathjax-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

</tab>
</tabs>

## 配置 Dokka 插件

Dokka 插件也可以拥有自己的配置选项。要查看哪些选项可用，请查阅你正在使用的插件的文档。

让我们看看如何通过向资产添加自定义图片 (`customAssets` 选项)、自定义样式表 (`customStyleSheets` 选项) 以及修改页脚消息 (`footerMessage` 选项) 来配置内置的 HTML 插件：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

要以类型安全的方式配置 Dokka 插件，请使用 `dokka.pluginsConfiguration {}` 代码块：

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

有关 Dokka 插件配置的示例，请参见 [Dokka 的版本控制插件](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 允许你通过[配置自定义插件](https://github.com/Kotlin/dokka/blob/v2.1.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)来扩展其功能并修改文档生成过程。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
        }
    }
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- 完全限定插件名称 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 按名称设置选项 -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

如果你正在使用带有[命令行选项](dokka-cli.md#run-with-command-line-options)的 [CLI](dokka-cli.md) 运行器，请使用 `-pluginsConfiguration` 选项，它接受 `fullyQualifiedPluginName=json` 形式的 JSON 配置。

如果你需要配置多个插件，可以传递由 `^^` 分隔的多个值。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果你正在使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，则存在一个类似的 `pluginsConfiguration` 数组，它在 `values` 中接受 JSON 配置。

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\"}"
    }
  ]
}
```

</tab>
</tabs>

## 值得关注的插件

以下是一些你可能会觉得有用的值得关注的 Dokka 插件：

| **名称**                                                                                                                           | **描述**                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 改进 Android 上的文档体验                                                             |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 添加版本选择器并帮助组织应用程序/库不同版本的文档 |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | 渲染 KDocs 中发现的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 图表和可视化内容      |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | 美化打印 KDocs 中的数学公式                                                                     |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | 渲染从 Java 角度看到的 Kotlin 签名                                                    |
| [GFM plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                                                                                                     | 添加生成 GitHub Flavoured Markdown 格式文档的功能                               |
| [Jekyll plugin](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                                                                                                                                                                                           | 添加生成 Jekyll Flavoured Markdown 格式文档的功能                               |

如果你是 Dokka 插件作者，并且希望将你的插件添加到此列表，请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 联系维护者。