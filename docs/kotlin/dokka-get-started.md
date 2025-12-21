[//]: # (title: 开始使用 Dokka)

以下是帮助您开始使用 Dokka 的简单说明。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。DGP v1 模式已不再支持。
> 要从 v1 模式升级到 v2 模式，请遵循 [迁移指南](dokka-migration.md)。
>
{style="note"}

**应用 Gradle Dokka 插件**

在您的项目的根构建脚本中应用 Dokka Gradle 插件 (DGP)：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**文档化多项目构建**

当您为 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 编写文档时，
请将插件应用于您想要文档化的每个子项目。通过使用以下方法之一，
在子项目之间共享 Dokka 配置：

*   约定插件
*   如果您不使用约定插件，则在每个子项目中直接配置

有关在多项目构建中共享 Dokka 配置的更多信息，
请参见 [多项目配置](dokka-gradle.md#multi-project-configuration)。

**生成文档**

要生成文档，请运行以下 Gradle 任务：

```bash
./gradlew :dokkaGenerate
```

此任务适用于单项目和多项目构建。

通过在任务前加上其项目路径（`:`），从聚合项目运行 `dokkaGenerate` 任务。例如：

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

避免运行 `./gradlew dokkaGenerate` 而不是 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。
如果任务没有项目路径（`:`）前缀，Gradle 将尝试在整个构建中运行所有 `dokkaGenerate` 任务，这可能会触发不必要的工作。

您可以使用不同的任务来生成 [HTML](dokka-html.md)、
[Javadoc](dokka-javadoc.md) 或 [HTML 和 Javadoc](dokka-gradle.md#configure-documentation-output-format) 格式的输出。

> 要了解更多关于 Dokka 与 Gradle 的用法，请参见 [Gradle](dokka-gradle.md)。
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。DGP v1 模式已不再支持。
> 要从 v1 模式升级到 v2 模式，请遵循 [迁移指南](dokka-migration.md)。
>
{style="note"}

**应用 Gradle Dokka 插件**

在您的项目的根构建脚本中应用 Dokka 的 Gradle 插件：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**文档化多项目构建**

当您为 [多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 编写文档时，
您需要将插件应用于您想要文档化的每个子项目。通过使用以下方法之一，
在子项目之间共享 Dokka 配置：

*   约定插件
*   如果您不使用约定插件，则在每个子项目中直接配置

有关在多项目构建中共享 Dokka 配置的更多信息，
请参见 [多项目配置](dokka-gradle.md#multi-project-configuration)。

**生成文档**

要生成文档，请运行以下 Gradle 任务：

```bash
./gradlew :dokkaGenerate
```

此任务适用于单项目和多项目构建。

通过在任务前加上其项目路径，从聚合项目运行 `dokkaGenerate` 任务。例如：

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

避免运行 `./gradlew dokkaGenerate` 而不是 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。
如果任务没有项目路径（`:`）前缀，Gradle 将尝试在整个构建中运行所有 `dokkaGenerate` 任务，这可能会触发不必要的工作。

您可以使用不同的任务来生成 [HTML](dokka-html.md)、
[Javadoc](dokka-javadoc.md) 或 [HTML 和 Javadoc](dokka-gradle.md#configure-documentation-output-format) 格式的输出。

> 要了解更多关于 Dokka 与 Gradle 的用法，请参见 [Gradle](dokka-gradle.md)。
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

将 Dokka 的 Maven 插件添加至您的 POM 文件的 `plugins` 部分：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

要生成文档，请运行 `dokka:dokka` 目标。

默认情况下，输出目录设置为 `target/dokka`。

要了解更多关于 Dokka 与 Maven 的用法，请参见 [Maven](dokka-maven.md)。

</tab>
</tabs>