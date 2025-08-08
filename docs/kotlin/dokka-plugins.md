[//]: # (title: Dokka 插件)

Dokka 从零开始构建，旨在高度可扩展和高度可定制，这使得社区能够实现针对缺失或开箱即用未提供的非常特定特性的插件。

Dokka 插件的范围很广，从支持其他编程语言的源代码到不常见的输出格式，无所不包。你可以添加对自定义 KDoc 标签或注解的支持，教 Dokka 如何渲染 KDoc 描述中发现的不同 DSL，对 Dokka 页面进行视觉重新设计，使其无缝集成到公司网站，将其与其他工具集成，以及更多功能。

如果你想学习如何创建 Dokka 插件，请参见[开发者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 应用 Dokka 插件

Dokka 插件作为独立的构件发布，因此要应用 Dokka 插件，你只需将其添加为依赖项即可。此后，插件会自动扩展 Dokka - 无需进一步操作。

> 使用相同扩展点或以类似方式工作的插件可能会相互干扰。
> 这可能导致视觉 bug、普遍的未定义行为，甚至构建失败。然而，由于 Dokka 不暴露任何可变数据结构或对象，因此不应导致并发问题。
>
> 如果你注意到类似问题，最好检查一下应用了哪些插件以及它们的作用。
>
{style="note"}

让我们看看如何将 [mathjax 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)应用到你的项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Dokka 的 Gradle 插件会创建方便的依赖项配置，允许你通用地应用插件，或者仅针对特定输出格式应用插件。

```kotlin
dependencies {
    // 通用地应用
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // 仅应用于单模块 dokkaHtml 任务
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // 在多项目构建中应用于 HTML 格式
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> 在文档化[多项目](dokka-gradle.md#multi-project-builds)构建时，你需要在子项目及其父项目中都应用 Dokka 插件。
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Dokka 的 Gradle 插件会创建方便的依赖项配置，允许你通用地应用插件，或者仅针对特定输出格式应用插件。

```groovy
dependencies {
    // 通用地应用
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // 仅应用于单模块 dokkaHtml 任务
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // 在多项目构建中应用于 HTML 格式
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> 在文档化[多项目](dokka-gradle.md#multi-project-builds)构建时，你需要在子项目及其父项目中都应用 Dokka 插件。
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

让我们看看如何配置 `DokkaBase` 插件。该插件负责生成 [HTML](dokka-html.md) 文档，通过向资产添加自定义图片 (`customAssets` 选项)、添加自定义样式表 (`customStyleSheets` 选项) 以及修改页脚消息 (`footerMessage` 选项) 来进行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle 的 Kotlin DSL 允许进行类型安全的插件配置。这可以通过将插件的构件添加到 `buildscript` 块中的类路径依赖项，然后导入插件和配置类来实现：

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
    }
}
```

另外，插件也可以通过 JSON 配置。使用此方法，无需额外依赖项。

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // 完全限定插件名称到 JSON 配置
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
    }
    """
    pluginsMapConfiguration.set(
            // 完全限定插件名称到 JSON 配置
            ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
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
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)              | 渲染从 Java 角度看到的 Kotlin 签名                                                    |

如果你是 Dokka 插件作者，并且希望将你的插件添加到此列表，请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 联系维护者。