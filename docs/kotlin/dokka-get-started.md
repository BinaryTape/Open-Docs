[//]: # (title: Dokka 入门)

以下是帮助您开始使用 Dokka 的简单说明。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

在项目的根构建脚本中应用 Dokka 的 Gradle 插件：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

在为[多项目](https://docs.gradle.org/current/userguide/multi_project_builds.html)构建编写文档时，您还需要在子项目中应用 Gradle 插件：

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

要生成文档，请运行以下 Gradle 任务：

* `dokkaHtml` 用于单项目构建
* `dokkaHtmlMultiModule` 用于多项目构建

默认情况下，输出目录设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

要了解更多关于 Dokka 与 Gradle 的用法，请参阅 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在项目的根构建脚本中应用 Dokka 的 Gradle 插件：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

在为[多项目](https://docs.gradle.org/current/userguide/multi_project_builds.html)构建编写文档时，您还需要在子项目中应用 Gradle 插件：

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

要生成文档，请运行以下 Gradle 任务：

* `dokkaHtml` 用于单项目构建
* `dokkaHtmlMultiModule` 用于多项目构建

默认情况下，输出目录设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

要了解更多关于 Dokka 与 Gradle 的用法，请参阅 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Maven" group-key="mvn">

将 Dokka 的 Maven 插件添加到您的 POM 文件中的 `plugins` 部分：

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

要了解更多关于 Dokka 与 Maven 的用法，请参阅 [Maven](dokka-maven.md)。

</tab>
</tabs>

> 在 Dokka 2.0.0 中，入门的几个步骤和任务已更新，包括：
>
> * [配置多项目构建](dokka-migration.md#share-dokka-configuration-across-modules)
> * [使用更新后的任务生成文档](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [指定输出目录](dokka-migration.md#output-directory)
>
> 有关更多详细信息和完整更改列表，请参阅[迁移指南](dokka-migration.md)。
>
{style="note"}