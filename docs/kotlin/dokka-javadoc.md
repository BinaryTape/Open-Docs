[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。不再支持 DGP v1 模式。
> 要从 v1 模式升级到 v2 模式，请参阅[迁移指南](dokka-migration.md)。
>
{style="note"}

Dokka 的 Javadoc 输出格式是 Java [Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html)的仿制品。

它尝试在视觉上模仿 Javadoc 工具生成的 HTML 页面，但它不是直接实现或完全复制。

![Javadoc 输出格式的屏幕截图](javadoc-format-example.png){width=706}

所有 Kotlin 代码和签名都从 Java 的视角进行渲染。这是通过我们的 [Kotlin as Java Dokka 插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)实现的，该插件针对此格式已捆绑并默认应用。

Javadoc 输出格式是以 [Dokka 插件](dokka-plugins.md)的形式实现的，由 Dokka 团队维护。它是开源的，您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc) 上找到其源代码。

## 生成 Javadoc 文档

> Dokka 不支持多项目构建或 Kotlin 多平台项目的 Javadoc 格式。
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka Gradle 插件](dokka-gradle.md)已包含 Javadoc 输出格式。您需要在项目的 `build.gradle.kts` 文件的 `plugins {}` 块中应用相应的插件 ID：

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

应用插件后，您可以运行以下任务：

* `dokkaGenerate` 以[根据应用插件生成所有可用格式](dokka-gradle.md#configure-documentation-output-format)的文档。
* `dokkaGeneratePublicationJavadoc` 仅生成 Javadoc 格式的文档。

`javadoc.jar` 文件可以单独生成。有关更多信息，请参阅[构建 `javadoc.jar`](dokka-gradle.md#build-javadoc-jar)。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka Maven 插件](dokka-maven.md)内置了 Javadoc 输出格式。您可以使用以下目标生成文档：

| **目标**           | **描述**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | 生成 Javadoc 格式的文档                                    |
| `dokka:javadocJar` | 生成包含 Javadoc 格式文档的 `javadoc.jar` 文件 |

</tab>
<tab title="CLI" group-key="cli">

由于 Javadoc 输出格式是一个 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins)，您需要[下载插件的 JAR 文件](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)。

Javadoc 输出格式有两个依赖项，您需要以额外的 JAR 文件形式提供：

* [kotlin-as-java 插件](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin-%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

通过[命令行选项](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

通过[JSON 配置](dokka-cli.md#run-with-json-configuration)：

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

要了解更多信息，请参阅 CLI 运行程序文档中的[其他输出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>