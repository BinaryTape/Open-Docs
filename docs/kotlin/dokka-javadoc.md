[//]: # (title: Javadoc)

> Javadoc 输出格式仍处于 Alpha 阶段，因此在使用时可能会遇到 bug 和迁移问题。
> 不保证能成功与接受 Java Javadoc HTML 作为输入的工具集成。
> **使用风险自负。**
>
{style="warning"}

Dokka 的 Javadoc 输出格式是 Java [Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)的仿制品。

它试图在视觉上模仿 Javadoc 工具生成的 HTML 页面，但它并非直接实现或精确复制。

![javadoc 输出格式截图](javadoc-format-example.png){width=706}

所有的 Kotlin 代码和签名都会从 Java 的视角进行渲染。这是通过我们的 [Kotlin as Java Dokka 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)实现的，该插件已默认与此格式捆绑并应用。

Javadoc 输出格式是作为一个 [Dokka 插件](dokka-plugins.md)实现的，并由 Dokka 团队进行维护。它是开源的，你可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc) 上找到其源代码。

## 生成 Javadoc 文档

> Javadoc 格式不支持多平台项目。
>
{style="warning"}


<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 插件](dokka-gradle.md)已包含 Javadoc 输出格式。你可以使用以下任务：

| **任务** | **描述** |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJavadoc` | 为单个项目生成 Javadoc 文档。 |
| `dokkaJavadocCollector` | 一个仅为多项目构建中的父项目创建的[`Collector`](dokka-gradle.md#collector-tasks) 任务。它会为每个子项目调用 `dokkaJavadoc`，并将所有输出合并到一个虚拟项目中。 |

`javadoc.jar` 文件可以单独生成。更多信息，请参阅[构建 `javadoc.jar`](dokka-gradle.md#build-javadoc-jar)。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka 的 Maven 插件](dokka-maven.md)内置了 Javadoc 输出格式。你可以通过使用以下目标来生成文档：

| **目标** | **描述** |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc` | 生成 Javadoc 格式的文档 |
| `dokka:javadocJar` | 生成一个包含 Javadoc 格式文档的 `javadoc.jar` 文件 |


</tab>
<tab title="CLI" group-key="cli">

由于 Javadoc 输出格式是一个 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)，你需要[下载该插件的 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)。

Javadoc 输出格式有两个依赖项，你需要作为额外的 JAR 文件来提供：

* [kotlin-as-java 插件](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

通过[命令行选项](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./kotlin-as-java-plugin-%dokkaVersion%.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

更多信息，请参阅 CLI 运行器文档中的[其他输出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>