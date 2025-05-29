[//]: # (title: Markdown)

> Markdown 输出格式仍处于 Alpha 阶段，因此您在使用它们时可能会遇到错误和迁移问题。
> **您需要自行承担使用风险。**
>
{style="warning"}

Dokka 能够生成与 [GitHub Flavored](#gfm) 和 [Jekyll](#jekyll) 兼容的 Markdown 文档。

这些格式在托管文档方面为您提供了更大的自由度，因为输出可以直接嵌入到您的文档网站中。例如，请参见 [OkHttp 的 API 参考](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)页面。

Markdown 输出格式作为 [Dokka 插件](dokka-plugins.md)实现，由 Dokka 团队维护，并且它们是开源的。

## GFM

GFM 输出格式生成 [GitHub Flavored Markdown](https://github.github.com/gfm/) 格式的文档。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 插件](dokka-gradle.md)包含了 GFM 输出格式。您可以配合它使用以下任务：

| **任务**              | **描述**                                                                                                                                                                                                                         |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 为单个项目生成 GFM 文档。                                                                                                                                                                                       |
| `dokkaGfmMultiModule` | 仅为多项目构建中的父项目创建的 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任务。它为子项目生成文档，并将所有输出收集到一个具有通用目录的单一位置。 |
| `dokkaGfmCollector`   | 仅为多项目构建中的父项目创建的 [`Collector`](dokka-gradle.md#collector-tasks) 任务。它为每个子项目调用 `dokkaGfm`，并将所有输出合并到一个单一的虚拟项目中。                                |

</tab>
<tab title="Maven" group-key="groovy">

由于 GFM 格式是作为 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)实现的，因此您需要将其作为插件依赖项引入：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

配置完成后，运行 `dokka:dokka` 目标将生成 GFM 格式的文档。

更多信息，请参阅 Maven 插件文档中的 [其他输出格式](dokka-maven.md#other-output-formats)。

</tab>
<tab title="CLI" group-key="cli">

由于 GFM 格式是作为 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)实现的，您需要[下载 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)并将其传递给 `pluginsClasspath`。

通过[命令行选项](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

更多信息，请参阅 CLI 运行器文档中的 [其他输出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm) 上找到源代码。

## Jekyll

Jekyll 输出格式生成与 [Jekyll](https://jekyllrb.com/) 兼容的 Markdown 文档。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 插件](dokka-gradle.md)包含了 Jekyll 输出格式。您可以配合它使用以下任务：

| **任务**                 | **描述**                                                                                                                                                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 为单个项目生成 Jekyll 文档。                                                                                                                                                                                    |
| `dokkaJekyllMultiModule` | 仅为多项目构建中的父项目创建的 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任务。它为子项目生成文档，并将所有输出收集到一个具有通用目录的单一位置。 |
| `dokkaJekyllCollector`   | 仅为多项目构建中的父项目创建的 [`Collector`](dokka-gradle.md#collector-tasks) 任务。它为每个子项目调用 `dokkaJekyll`，并将所有输出合并到一个单一的虚拟项目中。                             |

</tab>
<tab title="Maven" group-key="groovy">

由于 Jekyll 格式是作为 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)实现的，因此您需要将其作为插件依赖项引入：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>jekyll-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

配置完成后，运行 `dokka:dokka` 目标将生成 GFM 格式的文档。

更多信息，请参阅 Maven 插件文档中的 [其他输出格式](dokka-maven.md#other-output-formats)。

</tab>
<tab title="CLI" group-key="cli">

由于 Jekyll 格式是作为 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)实现的，您需要[下载 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)。此格式也基于 [GFM](#gfm) 格式，因此您也需要将其作为依赖项提供。两个 JAR 都需要传递给 `pluginsClasspath`：

通过[命令行选项](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar",
    "./jekyll-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

更多信息，请参阅 CLI 运行器文档中的 [其他输出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll) 上找到源代码。