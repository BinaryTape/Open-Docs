[//]: # (title: Dokka 插件)

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。DGP v1 模式已不再受支持。
> 要从 v1 升级到 v2 模式，请参考 [迁移指南](dokka-migration.md)。
>
{style="note"}

Dokka 从设计之初就考虑到了易扩展性和高度可定制性，这使得社区能够针对开箱即用功能未提供的缺失或特定功能实现插件。

Dokka 插件的应用范围非常广泛，从支持其他编程语言源码到奇特的输出格式。您可以为自己的 KDoc 标记或注解添加支持，教会 Dokka 如何渲染 KDoc 描述中出现的不同 DSL，视觉上重新设计 Dokka 页面以便无缝集成到公司网站中，或者将其与其他工具集成等等。

如果您想了解如何创建 Dokka 插件，请参阅 [开发者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 应用 Dokka 插件

Dokka 插件作为独立的构件发布，因此要应用 Dokka 插件，您只需将其添加为依赖项。随后，插件会自行扩展 Dokka —— 无需进一步操作。

> 使用相同扩展点或以类似方式工作的插件可能会相互干扰。这可能会导致视觉错误、常规的未定义行为，甚至导致构建失败。不过，由于 Dokka 不会暴露任何可变数据结构或对象，因此这不应导致并发问题。
>
> 如果您注意到此类问题，建议检查已应用了哪些插件以及它们的功能。
> 
{style="note"}

让我们看看如何将 [mathjax 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) 应用于您的项目：

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

> * 内置插件（如 HTML 和 Javadoc）始终会自动应用。您只需对其进行配置，无需声明对它们的依赖。
>
> * 当为多模块项目（多项目构建）生成文档时，您需要[在子项目之间共享 Dokka 配置和插件](dokka-gradle.md#multi-project-configuration)。
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

> 当记录 [多项目](dokka-gradle.md#multi-project-configuration) 构建时，您需要 [在子项目间共享 Dokka 配置](dokka-gradle.md#multi-project-configuration)。
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

如果您使用带有 [命令行选项](dokka-cli.md#run-with-command-line-options) 的 [命令行](dokka-cli.md) 运行程序，Dokka 插件应作为 `.jar` 文件传递给 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，则应在 `pluginsClasspath` 下指定 Dokka 插件。

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

Dokka 插件也可以拥有自己的配置选项。要查看哪些选项可用，请参考您正在使用的插件的文档。

让我们看看如何配置内置的 HTML 插件，通过向资源添加自定义图像（`customAssets` 选项）、自定义样式表（`customStyleSheets` 选项）以及修改页脚消息（`footerMessage` 选项）：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

要以类型安全的方式配置 Dokka 插件，请使用 `dokka.pluginsConfiguration {}` 块：

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

有关 Dokka 插件配置的示例，请参阅 [Dokka 的版本控制插件](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 允许您通过 [配置自定义插件](https://github.com/Kotlin/dokka/blob/v2.1.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts) 来扩展其功能并修改文档生成过程。

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
                <!-- 按名称列出的选项 -->
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

如果您使用带有 [命令行选项](dokka-cli.md#run-with-command-line-options) 的 [命令行](dokka-cli.md) 运行程序，请使用 `-pluginsConfiguration` 选项，该选项接受格式为 `fullyQualifiedPluginName=json` 的 JSON 配置。

如果您需要配置多个插件，可以传递多个值，并用 `^^` 分隔。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，则存在类似的 `pluginsConfiguration` 数组，它在 `values` 中接受 JSON 配置。

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

以下是一些您可能会发现有用的值得关注的 Dokka 插件：

| **名称**                                                                                                                           | **描述**                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android 文档插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 提升 Android 上的文档体验                                                             |
| [版本控制插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 添加版本选择器，并帮助组织应用程序/库不同版本的文档 |
| [MermaidJS HTML 插件](https://github.com/glureau/dokka-mermaid)                                                                  | 渲染 KDoc 中发现的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 图表和可视化内容      |
| [Mathjax HTML 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | 美化输出 KDoc 中发现的数学公式                                                                     |
| [Kotlin as Java 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | 渲染从 Java 角度看到的 Kotlin 签名                                                    |
| [GFM 插件](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                                                                                                     | 增加以 GitHub Flavoured Markdown 格式生成文档的能力                               |
| [Jekyll 插件](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                                                                                                                                                                                           | 增加以 Jekyll Flavoured Markdown 格式生成文档的能力                               |

如果您是 Dokka 插件作者并希望将您的插件添加到此列表中，请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 与维护者联系。