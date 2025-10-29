[//]: # (title: 开始使用 Dokka)

以下是帮助您开始使用 Dokka 的简单说明。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 这些说明反映了 Dokka Gradle 插件 v1 的配置和任务。自 Dokka 2.0.0 起，若干配置选项、Gradle 任务以及生成文档的步骤已更新，其中包括：
>
> * [调整配置选项](dokka-migration.md#adjust-configuration-options)
> * [处理多模块项目](dokka-migration.md#share-dokka-configuration-across-modules)
> * [使用更新后的任务生成文档](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [指定输出目录](dokka-migration.md#output-directory)
>
> 有关更多详细信息以及 Dokka Gradle 插件 v2 中的完整更改列表，请参见 [迁移指南](dokka-migration.md)。
>
{style="note"}

在您的项目的根构建脚本中应用 Dokka 的 Gradle 插件：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

当您为 [多项目](https://docs.gradle.org/current/userguide/multi_project_builds.html) 构建编写文档时，您还需要在子项目中应用 Gradle 插件：

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

要生成文档，请运行以下 Gradle 任务：

* `dokkaHtml`，用于单项目构建
* `dokkaHtmlMultiModule`，用于多项目构建

默认情况下，输出目录设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

要了解更多关于 Dokka 与 Gradle 的用法，请参见 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在您的项目的根构建脚本中应用 Dokka 的 Gradle 插件：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

当您为 [多项目](https://docs.gradle.org/current/userguide/multi_project_builds.html) 构建编写文档时，您还需要在子项目中应用 Gradle 插件：

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

要生成文档，请运行以下 Gradle 任务：

* `dokkaHtml`，用于单项目构建
* `dokkaHtmlMultiModule`，用于多项目构建

默认情况下，输出目录设置为 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

要了解更多关于 Dokka 与 Gradle 的用法，请参见 [Gradle](dokka-gradle.md)。

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