[//]: # (title: Dokka 插件)

Dokka 从零开始构建，旨在易于扩展且高度可定制，这使得社区能够为那些缺失或非常特定的、未直接提供的功能实现插件。

Dokka 插件的功能范围广泛，从支持其他编程语言源文件到异构输出格式。您可以为自己的 KDoc 标签或注解添加支持，教 Dokka 如何渲染 KDoc 描述中发现的不同 DSL，从视觉上重新设计 Dokka 的页面以无缝集成到您公司的网站，将其与其他工具集成等等。

如果您想了解如何创建 Dokka 插件，请参阅 [开发者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 应用 Dokka 插件

Dokka 插件作为独立的构建产物 (artifacts) 发布，因此要应用 Dokka 插件，您只需将其添加为依赖项即可。此后，插件将自行扩展 Dokka，无需进一步操作。

> 使用相同扩展点或以类似方式工作的插件可能会相互干扰。
> 这可能导致视觉 Bug、一般未定义行为甚至构建失败。然而，由于 Dokka 不会暴露任何可变数据结构或对象，因此不应导致并发问题。
>
> 如果您发现此类问题，最好检查已应用了哪些插件以及它们的作用。
>
{style="note"}

让我们看看如何在您的项目中应用 [mathjax 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Dokka 的 Gradle 插件创建了方便的依赖配置，允许您全局应用插件或仅针对特定的输出格式应用。

```kotlin
dependencies {
    // Is applied universally
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> 在文档化 [多项目](dokka-gradle.md#multi-project-builds) 构建时，您需要在子项目及其父项目中应用 Dokka 插件。
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Dokka 的 Gradle 插件创建了方便的依赖配置，允许您全局应用 Dokka 插件或仅针对特定的输出格式应用。

```groovy
dependencies {
    // Is applied universally
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> 在文档化 [多项目](dokka-gradle.md#multi-project-builds) 构建时，您需要在子项目及其父项目中应用 Dokka 插件。
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

如果您使用 [CLI](dokka-cli.md) 运行器并附带 [命令行选项](dokka-cli.md#run-with-command-line-options)，Dokka 插件应作为 `.jar` 文件传递给 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，Dokka 插件应在 `pluginsClasspath` 下指定。

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

Dokka 插件也可以拥有自己的配置选项。要查看哪些选项可用，请查阅您正在使用的插件的文档。

让我们看看如何配置 `DokkaBase` 插件，该插件负责生成 [HTML](dokka-html.md) 文档，通过向资产 (`customAssets` 选项) 添加自定义图片，通过添加自定义样式表 (`customStyleSheets` 选项)，以及通过修改页脚消息 (`footerMessage` 选项)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle 的 Kotlin DSL 允许进行类型安全的插件配置。这可以通过将插件的构建产物 (artifact) 添加到 `buildscript` 块中的 classpath 依赖项，然后导入插件和配置类来实现：

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

或者，插件可以通过 JSON 配置。使用此方法，无需额外依赖。

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
            // fully qualified plugin name to json configuration
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
            // fully qualified plugin name to json configuration
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
            <!-- Fully qualified plugin name -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- Options by name -->
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

如果您使用 [CLI](dokka-cli.md) 运行器并附带 [命令行选项](dokka-cli.md#run-with-command-line-options)，请使用 `-pluginsConfiguration` 选项，该选项接受 `fullyQualifiedPluginName=json` 形式的 JSON 配置。

如果您需要配置多个插件，可以传递多个由 `^^` 分隔的值。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，则存在一个类似的 `pluginsConfiguration` 数组，它在 `values` 中接受 JSON 配置。

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

## 值得注意的插件

以下是一些您可能会觉得有用的 Dokka 插件：

| **名称**                                                                                                                           | **描述**                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 提升 Android 上的文档体验                                                             |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 添加版本选择器并帮助组织应用程序/库不同版本的文档 |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid)                                                                  | 渲染 KDocs 中发现的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 图表和可视化内容      |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | 优美地打印 KDocs 中的数学公式                                                                     |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)              | 渲染从 Java 视角看到的 Kotlin 签名                                                    |

如果您是 Dokka 插件作者，并且希望将您的插件添加到此列表中，请通过 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 联系维护者。