[//]: # (title: Gradle)

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。之前的 DGP v1 模式已不再受支持。
> 如果你正在从 v1 模式升级到 v2 模式，请参见[迁移指南](dokka-migration.md)。
>
{style="note"}

要为基于 Gradle 的项目生成文档，你可以使用 [Dokka 的 Gradle 插件](https://plugins.gradle.org/plugin/org.jetbrains.dokka)。

Dokka Gradle 插件 (DGP) 为你的项目提供了基本的自动配置，包含用于生成文档的 [Gradle 任务](#generate-documentation)，并提供了 [配置选项](dokka-gradle-configuration-options.md) 来定制输出。

你可以在我们的 [Gradle 示例项目](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2) 中使用 Dokka 并探索如何为各种项目配置它。

## 支持的版本

请确保你的项目满足最低版本要求：

| **工具**                                                                          | **版本**      |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 或更高     |
| [Android Gradle 插件](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高     |
| [Kotlin Gradle 插件](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高     |

## 应用 Dokka

推荐的应用 Dokka Gradle 插件的方式是使用 [plugins 代码块](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)。将其添加到你项目的 `build.gradle.kts` 文件的 `plugins {}` 代码块中：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

在文档化多项目构建时，你需要将插件显式地应用到每个你想文档化的子项目。你可以在每个子项目中直接配置 Dokka，或者使用约定插件在子项目之间共享 Dokka 配置。
有关更多信息，请参阅如何配置[单一项目](#single-project-configuration)和[多项目](#multi-project-configuration)构建。

> *   在底层，
> Dokka 使用 [Kotlin Gradle 插件](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)
> 来自动配置需要生成文档的[源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)。
> 请确保应用 Kotlin Gradle 插件或手动[配置源代码集](dokka-gradle-configuration-options.md#source-set-configuration)。
>
> *   如果你在
> [预编译脚本插件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)
> 中使用 Dokka，请将 [Kotlin Gradle 插件](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)
> 添加为它的依赖项，以确保其正常工作。
>
{style="tip"}

## 启用构建缓存和配置缓存

DGP 支持 Gradle 构建缓存和配置缓存，可提高构建性能。

*   要启用构建缓存，请遵循 [Gradle 构建缓存文档](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable) 中的说明。
*   要启用配置缓存，请遵循 [Gradle 配置缓存文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable) 中的说明。

## 生成文档

Dokka Gradle 插件内置了 [HTML](dokka-html.md) 和 [Javadoc](dokka-javadoc.md) 输出格式。

使用以下 Gradle 任务来生成文档：

```shell
./gradlew :dokkaGenerate
```

`dokkaGenerate` Gradle 任务的关键行为是：

*   此任务可为[单一项目](#single-project-configuration)和[多项目](#multi-project-configuration)构建生成文档。
*   默认情况下，文档输出格式为 HTML。你也可以通过[添加相应的插件](#configure-documentation-output-format)来生成 Javadoc 格式，或者同时生成 HTML 和 Javadoc 格式。
*   生成的文档会自动放置在 `build/dokka/html` 目录中，适用于单一项目和多项目构建。
    你可以[更改位置 (`outputDirectory`)](dokka-gradle-configuration-options.md#general-configuration)。

### 配置文档输出格式

> Javadoc 输出格式处于 [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 阶段。
> 使用时可能会遇到 bug 并出现迁移问题。
> 不保证与接受 Javadoc 作为输入的工具成功集成。
> 请自行承担风险使用。
>
{style="warning"}

你可以选择以 HTML、Javadoc 或同时以这两种格式生成 API 文档：

1.  将相应的插件 `id` 放在你项目的 `build.gradle.kts` 文件的 `plugins {}` 代码块中：

    ```kotlin
    plugins {
        // 生成 HTML 文档
        id("org.jetbrains.dokka") version "%dokkaVersion%"

        // 生成 Javadoc 文档
        id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

        // 同时保留这两个插件 ID 会生成两种格式
    }
    ```

2.  运行相应的 Gradle 任务。

    以下是与每种格式对应的插件 `id` 和 Gradle 任务列表：

    |             | **HTML**                                  | **Javadoc**                                  | **两种**                          |
    |-------------|-------------------------------------------|----------------------------------------------|-----------------------------------|
    | 插件 `id`   | `id("org.jetbrains.dokka")`               | `id("org.jetbrains.dokka-javadoc")`          | 同时使用 HTML 和 Javadoc 插件 |
    | Gradle 任务 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`        |

    > *   `dokkaGenerate` 任务会根据已应用的插件生成所有可用格式的文档。
    > 如果同时应用了 HTML 和 Javadoc 插件，
    > 你可以选择只运行 `dokkaGeneratePublicationHtml` 任务来生成 HTML，
    > 或者只运行 `dokkaGeneratePublicationJavadoc` 任务来生成 Javadoc。
    >
    {style="tip"}

如果你正在使用 IntelliJ IDEA，你可能会看到 `dokkaGenerateHtml` Gradle 任务。
此任务仅仅是 `dokkaGeneratePublicationHtml` 的别名。这两个任务执行的操作完全相同。

### 在多项目构建中聚合文档输出

Dokka 可以将来自多个子项目的文档聚合到单一输出或出版物中。

在聚合文档之前，你必须将 [Dokka 插件应用](#apply-the-convention-plugin-to-your-subprojects) 到所有可文档化的子项目。

要聚合来自多个子项目的文档，请在根项目的 `build.gradle.kts` 文件中添加 `dependencies {}` 代码块：

```kotlin
dependencies {
    dokka(project(":childProjectA:"))
    dokka(project(":childProjectB:"))
}
```

给定一个具有以下结构的项目：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass.kt
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass.kt
```

生成的文档聚合如下：

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

有关更多详细信息，请参阅我们的[多项目示例](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2/multimodule-example)。

#### 聚合文档的目录

当 DGP 聚合子项目时，每个子项目在聚合文档中都有自己的子目录。
DGP 通过保留完整的项目结构来确保每个子项目都有唯一的目录。

例如，给定一个在 `:turbo-lib` 中聚合且包含嵌套子项目 `:turbo-lib:maths` 的项目，
生成的文档放置在：

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

你可以通过手动指定子项目目录来恢复此行为。
将以下配置添加到每个子项目的 `build.gradle.kts` 文件中：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 覆盖子项目目录
    modulePath.set("maths")
}
```

此配置将 `:turbo-lib:maths` 模块的生成文档更改为放置在 `turbo-lib/build/dokka/html/maths/`。

## 构建 javadoc.jar

如果你想将你的库发布到版本库，你可能需要提供一个 `javadoc.jar` 文件，其中包含你库的 API 参考文档。

例如，如果你想发布到 [Maven Central](https://central.sonatype.org/)，你[必须](https://central.sonatype.org/publish/requirements/)随项目提供一个 `javadoc.jar`。然而，并非所有版本库都有此规则。

Dokka 的 Gradle 插件不提供开箱即用的方法，但这可以通过自定义 Gradle 任务实现。一个用于生成 [HTML](dokka-html.md) 格式文档，另一个用于生成 [Javadoc](dokka-javadoc.md) 格式文档：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// 生成 HTML 文档
val dokkaHtmlJar by tasks.registering(Jar::class) {
    description = "A HTML Documentation JAR containing Dokka HTML"
    from(tasks.dokkaGeneratePublicationHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-doc")
}

// 生成 Javadoc 文档
val dokkaJavadocJar by tasks.registering(Jar::class) {
    description = "A Javadoc JAR containing Dokka Javadoc"
    from(tasks.dokkaGeneratePublicationJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// 生成 HTML 文档
tasks.register('dokkaHtmlJar', Jar) {
    description = 'A HTML Documentation JAR containing Dokka HTML'
    from(tasks.named('dokkaGeneratePublicationHtml').flatMap { it.outputDirectory })
    archiveClassifier.set('html-doc')
}

// 生成 Javadoc 文档
tasks.register('dokkaJavadocJar', Jar) {
    description = 'A Javadoc JAR containing Dokka Javadoc'
    from(tasks.named('dokkaGeneratePublicationJavadoc').flatMap { it.outputDirectory })
    archiveClassifier.set('javadoc')
}
```

</tab>
</tabs>

> 如果你将库发布到 Maven Central，你可以使用 [javadoc.io](https://javadoc.io/) 等服务免费托管你的库的 API 文档，无需任何设置。它直接从 `javadoc.jar` 中获取文档页面。这与 HTML 格式配合良好，如 [此示例](https://javadoc.io/doc/com.trib3/server/latest/index.html)所示。
>
{style="tip"}

## 配置示例

根据你的项目类型，应用和配置 Dokka 的方式略有不同。然而，[配置选项](dokka-gradle-configuration-options.md) 本身是相同的，无论你的项目类型如何。

对于项目根目录中只有一个 `build.gradle.kts` 或 `build.gradle` 文件的简单扁平项目，请参阅[单一项目配置](#single-project-configuration)。

对于具有子项目和多个嵌套 `build.gradle.kts` 或 `build.gradle` 文件的更复杂构建，请参阅[多项目配置](#multi-project-configuration)。

### 单一项目配置

单一项目构建通常在项目根目录中只有一个 `build.gradle.kts` 或 `build.gradle` 文件。
它们可以是单一平台或多平台，并且通常具有以下结构：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

单一平台：

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

多平台：

```text
.
├── build.gradle.kts
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

单一平台：

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

多平台：

```text
.
├── build.gradle
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
</tabs>

在根 `build.gradle.kts` 文件中应用 Dokka Gradle 插件，并使用顶层 `dokka {}` DSL 进行配置：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set("MyProject")
        outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
        includes.from("README.md")
   }

    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(URI("https://github.com/your-repo"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在 `./build.gradle` 中：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set("MyProject")
            outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
            includes.from("README.md")
        }
    }

    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

</tab>
</tabs>

此配置将 Dokka 应用到你的项目，
设置文档输出目录，并定义主源代码集。
你可以通过在同一个 `dokka {}` 代码块中添加自定义资源、可见性过滤器或插件配置来进一步扩展它。
有关更多信息，请参阅[配置选项](dokka-gradle-configuration-options.md)。

### 多项目配置

[多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)
通常包含多个嵌套的 `build.gradle.kts` 文件，并且具有类似于以下内容的结构：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle.kts
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A/
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
</tabs>

单一项目和多项目文档使用相同的[顶层 `dokka {}` DSL 共享相同的配置模型](#single-project-configuration)。

在多项目构建中配置 Dokka 有两种方法：

*   **[通过约定插件共享配置](#shared-configuration-via-a-convention-plugin)（首选）**：定义约定插件并将其应用到所有子项目。
    这会集中管理你的 Dokka 设置。

*   **[手动配置](#manual-configuration)**：在每个子项目中应用 Dokka 插件并重复相同的 `dokka {}` 代码块。
    你不需要约定插件。

配置子项目后，你可以将来自多个子项目的文档聚合到一个输出中。
有关更多信息，请参阅
[在多项目构建中聚合文档输出](#aggregate-documentation-output-in-multi-project-builds)。

> 有关多项目示例，请参阅 [Dokka GitHub 版本库](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 通过约定插件共享配置

请按照以下步骤设置约定插件并将其应用到你的子项目。

##### 设置 buildSrc 目录

1.  在你的项目根目录中，创建 `buildSrc` 目录，其中包含两个文件：

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  在 `buildSrc/settings.gradle.kts` 文件中，添加以下代码片段：

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  在 `buildSrc/build.gradle.kts` 文件中，添加以下代码片段：

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:%dokkaVersion%")
    }   
    ```

##### 设置 Dokka 约定插件

设置 `buildSrc` 目录后，设置 Dokka 约定插件：

1.  创建 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 文件来[托管约定插件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2.  在 `dokka-convention.gradle.kts` 文件中，添加以下代码片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // 共享配置在此处
    }
    ```

    你需要在 `dokka {}` 代码块中添加所有子项目通用的共享 Dokka [配置](dokka-gradle-configuration-options.md)。
    此外，你不需要指定 Dokka 版本。
    版本已在 `buildSrc/build.gradle.kts` 文件中设置。

##### 将约定插件应用到你的子项目

通过将其添加到每个子项目的 `build.gradle.kts` 文件中，将 Dokka 约定插件应用到你的子项目：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 手动配置

如果你的项目不使用约定插件，你可以通过手动将相同的 `dokka {}` 代码块复制到每个子项目中来复用相同的 Dokka 配置模式：

1.  在每个子项目的 `build.gradle.kts` 文件中应用 Dokka 插件：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") version "%dokkaVersion%"
    }
    ```

2.  在每个子项目的 `dokka {}` 代码块中声明共享配置。因为没有集中管理配置的约定插件，你需要复制任何你想在子项目之间共享的配置。有关更多信息，请参见[配置选项](dokka-gradle-configuration-options.md)。

#### 父项目配置

在多项目构建中，你可以在根项目中配置适用于整个文档的设置。
这可以包括定义输出格式、输出目录、文档子项目名称，聚合来自所有
子项目的文档以及其他[配置选项](dokka-gradle-configuration-options.md)：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    // 设置整个项目的属性
    dokkaPublications.html {
        moduleName.set("My Project")
        outputDirectory.set(layout.buildDirectory.dir("docs/html"))
        includes.from("README.md")
    }

    dokkaSourceSets.configureEach {
        documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或者 documentedVisibilities(VisibilityModifier.Public)    
    }
}

// 聚合子项目文档
dependencies {
    dokka(project(":childProjectA"))
    dokka(project(":childProjectB"))
}
```

此外，如果需要自定义配置，每个子项目都可以有自己的 `dokka {}` 代码块。
在以下示例中，子项目应用 Dokka 插件，设置自定义子项目名称，
并包含来自其 `README.md` 文件的额外文档：

```kotlin
// subproject/build.gradle.kts
plugins {
    id("org.jetbrains.dokka")
}

dokka {
    dokkaPublications.html {
        moduleName.set("Child Project A")
        includes.from("README.md")
    }
}