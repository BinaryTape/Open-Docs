[//]: # (title: Gradle)

> 这些说明反映了 Dokka Gradle 插件 v1 的配置和任务。从 Dokka 2.0.0 开始，一些配置选项、Gradle 任务以及生成文档的步骤已更新，包括：
>
> *   [调整配置选项](dokka-migration.md#adjust-configuration-options)
> *   [使用多模块项目](dokka-migration.md#share-dokka-configuration-across-modules)
> *   [使用更新的任务生成文档](dokka-migration.md#generate-documentation-with-the-updated-task)
> *   [指定输出目录](dokka-migration.md#output-directory)
>
> 有关 Dokka Gradle 插件 v2 中更多详细信息和完整的变更列表，请参阅[迁移指南](dokka-migration.md)。
>
{style="note"}

要为基于 Gradle 的项目生成文档，你可以使用 [Dokka 的 Gradle 插件](https://plugins.gradle.org/plugin/org.jetbrains.dokka)。

它为你的项目提供了基本的自动配置，拥有方便的 [Gradle 任务](#generate-documentation)用于生成文档，并提供了大量的 [配置选项](#configuration-options)以定制输出。

你可以通过访问我们的 [Gradle 示例项目](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle)来试用 Dokka，看看它如何为各种项目进行配置。

## 应用 Dokka

推荐的 Dokka Gradle 插件应用方式是使用 [plugins DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

当为[多项目](#multi-project-builds)构建生成文档时，你还需要在子项目中应用 Dokka 的 Gradle 插件。你可以使用 `allprojects {}` 或 `subprojects {}` Gradle 配置来实现：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</tab>
</tabs>

如果你不确定在哪里应用 Dokka，请参阅[配置示例](#configuration-examples)。

> Dokka 在底层使用 [Kotlin Gradle 插件](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)来自动配置需要生成文档的[源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)。请确保应用 Kotlin Gradle 插件或手动[配置源代码集](#source-set-configuration)。
>
{style="note"}

> 如果你在[预编译脚本插件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins)中使用 Dokka，你需要将 [Kotlin Gradle 插件](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)添加为它的依赖项，以使其正常工作。
>
{style="note"}

如果由于某些原因你无法使用 plugins DSL，你可以使用[传统方法](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)应用插件。

## 生成文档

Dokka 的 Gradle 插件内置了 [HTML](dokka-html.md)、[Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md) 输出格式。它添加了许多用于生成文档的任务，适用于[单一项目](#single-project-builds)和[多项目](#multi-project-builds)构建。

### 单一项目构建

使用以下任务为简单的单一项目应用程序和库构建文档：

| **任务**     | **描述**                                             |
|--------------|------------------------------------------------------|
| `dokkaHtml` | 以 [HTML](dokka-html.md) 格式生成文档。 |

#### 实验性格式

| **任务**       | **描述**                                                                                  |
|----------------|-------------------------------------------------------------------------------------------|
| `dokkaGfm`     | 以 [GitHub Flavored Markdown](dokka-markdown.md#gfm) 格式生成文档。      |
| `dokkaJavadoc` | 以 [Javadoc](dokka-javadoc.md) 格式生成文档。                            |
| `dokkaJekyll`  | 以 [Jekyll 兼容的 Markdown](dokka-markdown.md#jekyll) 格式生成文档。 |

默认情况下，生成的文档位于项目的 `build/dokka/{format}` 目录中。输出位置等可以[配置](#configuration-examples)。

### 多项目构建

为[多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)生成文档时，请确保在要生成文档的子项目及其父项目中都[应用 Dokka 的 Gradle 插件](#apply-dokka)。

#### MultiModule 任务

`MultiModule` 任务通过 [`Partial`](#partial-tasks) 任务单独为每个子项目生成文档，收集并处理所有输出，并生成带有通用目录和已解析的跨项目引用的完整文档。

Dokka 会自动为 **父** 项目创建以下任务：

| **任务**                | **描述**                                                                 |
|-------------------------|--------------------------------------------------------------------------|
| `dokkaHtmlMultiModule` | 以 [HTML](dokka-html.md) 输出格式生成多模块文档。 |

#### 实验性格式（多模块）

| **任务**                 | **描述**                                                                                                        |
|--------------------------|-----------------------------------------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`    | 以 [GitHub Flavored Markdown](dokka-markdown.md#gfm) 输出格式生成多模块文档。      |
| `dokkaJekyllMultiModule` | 以 [Jekyll 兼容的 Markdown](dokka-markdown.md#jekyll) 输出格式生成多模块文档。 |

> [Javadoc](dokka-javadoc.md) 输出格式没有 `MultiModule` 任务，但可以使用 [`Collector`](#collector-tasks) 任务代替。
>
{style="note"}

默认情况下，你可以在 `{parentProject}/build/dokka/{format}MultiModule` 目录下找到即用型文档。

#### MultiModule 结果

给定一个具有以下结构的项目：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

运行 `dokkaHtmlMultiModule` 后会生成以下页面：

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

有关更多详细信息，请参阅我们的[多模块项目示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)。

#### Collector 任务

与 `MultiModule` 任务类似，`Collector` 任务会为每个父项目创建：`dokkaHtmlCollector`、`dokkaGfmCollector`、`dokkaJavadocCollector` 和 `dokkaJekyllCollector`。

`Collector` 任务为每个子项目执行相应的[单一项目任务](#single-project-builds)（例如，`dokkaHtml`），并将所有输出合并到一个虚拟项目中。

生成的文档看起来就像你有一个包含所有子项目声明的单一项目构建。

> 如果你需要为多项目构建创建 Javadoc 文档，请使用 `dokkaJavadocCollector` 任务。
>
{style="tip"}

#### Collector 结果

给定一个具有以下结构的项目：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

运行 `dokkaHtmlCollector` 后会生成以下页面：

![Screenshot for output of dokkaHtmlCollector task](dokkaHtmlCollector-example.png){width=706}

有关更多详细信息，请参阅我们的[多模块项目示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)。

#### Partial 任务

每个子项目都会为其创建 `Partial` 任务：`dokkaHtmlPartial`、`dokkaGfmPartial` 和 `dokkaJekyllPartial`。

这些任务并非旨在独立运行，它们由父级的 [`MultiModule`](#multimodule-tasks) 任务调用。

但是，你可以[配置](#subproject-configuration) `Partial` 任务以定制子项目的 Dokka。

> `Partial` 任务生成的输出包含未解析的 HTML 模板和引用，因此在没有父级 [`MultiModule`](#multimodule-tasks) 任务进行后处理的情况下，它不能单独使用。
>
{style="warning"}

> 如果你只想为单一子项目生成文档，请使用[单一项目任务](#single-project-builds)。例如，`:subprojectName:dokkaHtml`。
>
{style="note"}

## 构建 javadoc.jar

如果你想将你的库发布到版本库，你可能需要提供一个 `javadoc.jar` 文件，其中包含你库的 API 参考文档。

例如，如果你想发布到 [Maven Central](https://central.sonatype.org/)，你[必须](https://central.sonatype.org/publish/requirements/)随项目提供一个 `javadoc.jar`。但是，并非所有版本库都有此规则。

Dokka 的 Gradle 插件不提供开箱即用的方法，但这可以通过自定义 Gradle 任务实现。一个用于生成 [HTML](dokka-html.md) 格式文档，另一个用于生成 [Javadoc](dokka-javadoc.md) 格式文档：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.register('dokkaHtmlJar', Jar.class) {
    dependsOn(dokkaHtml)
    from(dokkaHtml)
    archiveClassifier.set("html-docs")
}

tasks.register('dokkaJavadocJar', Jar.class) {
    dependsOn(dokkaJavadoc)
    from(dokkaJavadoc)
    archiveClassifier.set("javadoc")
}
```

</tab>
</tabs>

> 如果你将库发布到 Maven Central，你可以使用 [javadoc.io](https://javadoc.io/) 等服务免费托管你的库的 API 文档，无需任何设置。它直接从 `javadoc.jar` 中获取文档页面。这与 HTML 格式配合良好，如 [此示例](https://javadoc.io/doc/com.trib3/server/latest/index.html)所示。
>
{style="tip"}

## 配置示例

根据你的项目类型，应用和配置 Dokka 的方式略有不同。但是，无论你的项目类型如何，[配置选项](#configuration-options)本身都是相同的。

对于根目录中只有一个 `build.gradle.kts` 或 `build.gradle` 文件的简单扁平项目，请参阅[单一项目配置](#single-project-configuration)。

对于具有子项目和多个嵌套的 `build.gradle.kts` 或 `build.gradle` 文件的更复杂的构建，请参阅[多项目配置](#multi-project-configuration)。

### 单一项目配置

单一项目构建通常在项目根目录中只有一个 `build.gradle.kts` 或 `build.gradle` 文件，并且通常具有以下结构：

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

在此类项目中，你需要在根 `build.gradle.kts` 或 `build.gradle` 文件中应用 Dokka 及其配置。

你可以单独配置任务和输出格式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 中：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 中：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</tab>
</tabs>

或者你可以同时配置所有任务和输出格式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 中：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// 同时配置所有单一项目 Dokka 任务，
// 例如 dokkaHtml, dokkaJavadoc 和 dokkaGfm。
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set(
            setOf(
                Visibility.PUBLIC,
                Visibility.PROTECTED,
            )
        )

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 中：

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// 同时配置所有单一项目 Dokka 任务，
// 例如 dokkaHtml, dokkaJavadoc 和 dokkaGfm。
tasks.withType(DokkaTask.class) {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set([
                Visibility.PUBLIC,
                Visibility.PROTECTED
        ])

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
</tabs>

### 多项目配置

Gradle 的[多项目构建](https://docs.gradle.org/current/userguide/multi_project_builds.html)在结构和配置上更为复杂。它们通常有多个嵌套的 `build.gradle.kts` 或 `build.gradle` 文件，并且通常具有以下结构：

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

在这种情况下，有多种应用和配置 Dokka 的方法。

#### 子项目配置

要在多项目构建中配置子项目，你需要配置 [`Partial`](#partial-tasks) 任务。

你可以使用 Gradle 的 `allprojects {}` 或 `subprojects {}` 配置块，在根 `build.gradle.kts` 或 `build.gradle` 文件中同时配置所有子项目：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根 `./build.gradle.kts` 中：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // 仅配置 HTML 任务
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

    // 同时配置所有格式任务
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根 `./build.gradle` 中：

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // 仅配置 HTML 任务
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

    // 同时配置所有格式任务
    tasks.withType(DokkaTaskPartial.class) {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
</tabs>

或者，你也可以在子项目中单独应用和配置 Dokka。

例如，如果只想为 `subproject-A` 子项目设置特定配置，你需要在 `./subproject-A/build.gradle.kts` 中应用以下代码：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./subproject-A/build.gradle.kts` 中：

```kotlin
apply(plugin = "org.jetbrains.dokka")

// 仅适用于 subproject-A 的配置。
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./subproject-A/build.gradle` 中：

```groovy
apply plugin: 'org.jetbrains.dokka'

// 仅适用于 subproject-A 的配置。
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 父项目配置

如果你想配置一些在所有文档中通用且不属于子项目的设置——换句话说，它是父项目的属性——你需要配置 [`MultiModule`](#multimodule-tasks) 任务。

例如，如果你想更改 HTML 文档页眉中使用的项目名称，你需要在根 `build.gradle.kts` 或 `build.gradle` 文件中应用以下代码：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根 `./build.gradle.kts` 文件中：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根 `./build.gradle` 文件中：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtmlMultiModule {
    moduleName.set("WHOLE PROJECT NAME USED IN THE HEADER")
}
```

</tab>
</tabs>

## 配置选项

Dokka 有许多配置选项可以定制你和你的读者的体验。

下面是一些示例和每个配置部分的详细描述。你还可以在页面底部找到一个应用了[所有配置选项](#complete-configuration)的示例。

有关在哪里以及如何应用配置块的更多详细信息，请参阅[配置示例](#configuration-examples)。

### 一般配置

以下是任何 Dokka 任务的一般配置示例，无论源代码集或包如何：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)
    
    // ..
    // 源代码集配置部分
    // ..
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // 源代码集配置部分
    // ..
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>用于指代模块的显示名称。它用于目录、导航、日志等。</p>
        <p>如果为单一项目构建或 <code>MultiModule</code> 任务设置，则用作项目名称。</p>
        <p>默认值：Gradle 项目名称</p>
    </def>
    <def title="moduleVersion">
        <p>
            模块版本。如果为单一项目构建或 <code>MultiModule</code> 任务设置，则用作项目版本。
        </p>
        <p>默认值：Gradle 项目版本</p>
    </def>
    <def title="outputDirectory">
        <p>生成文档的目录，与格式无关。可以按任务设置。</p>
        <p>
            默认值是 <code>{project}/{buildDir}/{format}</code>，其中 <code>{format}</code> 是去除了“dokka”前缀的任务名称。对于 <code>dokkaHtmlMultiModule</code> 任务，它是
            <code>project/buildDir/htmlMultiModule</code>。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 发出警告或错误，是否使文档生成失败。
            该过程会等待所有错误和警告都发出后才失败。
        </p>
        <p>此设置与 <code>reportUndocumented</code> 配合良好。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制显而易见的函数。</p>
        <p>
            如果一个函数符合以下条件，则被认为是显而易见的：</p>
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    由编译器合成（生成）且没有任何文档，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制在给定类中未显式覆盖的继承成员。</p>
        <p>
            注意：这可以抑制诸如 <code>equals</code> / <code>hashCode</code> / <code>toString</code> 等函数，
            但不能抑制诸如 <code>dataClass.componentN</code> 和
            <code>dataClass.copy</code> 等合成函数。为此请使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>是否通过网络解析远程文件/链接。</p>
        <p>
            这包括用于生成外部文档链接的包列表。
            例如，使标准库中的类可点击。
        </p>
        <p>
            将此设置为 <code>true</code> 在某些情况下可以显著加快构建时间，
            但也可能降低文档质量和用户体验。例如，不解析来自你的依赖项（包括标准库）的类/成员链接。
        </p>
        <p>
            注意：你可以将获取的文件缓存到本地，并以本地路径提供给
            Dokka。请参阅 <code>externalDocumentationLinks</code> 部分。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
</deflist>

### 源代码集配置

Dokka 允许为 [Kotlin 源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)配置一些选项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置部分
    // ..

    dokkaSourceSets {
        // 'linux' 源代码集专属配置
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 源链接部分
            }
            externalDocumentationLink {
                // 外部文档链接部分
            }
            perPackageOption {
                // 包选项部分
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets {
        // 'linux' 源代码集专属配置
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 源链接部分
            }
            externalDocumentationLink {
                // 外部文档链接部分
            }
            perPackageOption {
                // 包选项部分
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>生成文档时是否应跳过此源代码集。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="displayName">
        <p>用于指代此源代码集的显示名称。</p>
        <p>
            此名称在外部（例如，文档阅读器可见的源代码集名称）和
            内部（例如，<code>reportUndocumented</code> 的日志消息）都使用。
        </p>
        <p>默认情况下，该值根据 Kotlin Gradle 插件提供的信息推断。</p>
    </def>
    <def title="documentedVisibilities">
        <p>应进行文档化的可见性修饰符集。</p>
        <p>
            这可用于文档化 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明并仅文档化内部 API。
        </p>
        <p>这可以按包进行配置。</p>
        <p>默认值：<code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否发出关于可见的未文档化声明的警告，即在经过 <code>documentedVisibilities</code> 和其他过滤器过滤后没有 KDoc 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以按包进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            在应用各种过滤器后，是否跳过不包含任何可见声明的包。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 设置为 <code>true</code> 并且你的包只包含
            已弃用的声明，则该包被认为是空的。
        </p>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文档化使用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>是否文档化/分析生成的文件。</p>
        <p>
            生成的文件预计位于 <code>{project}/{buildDir}/generated</code> 目录下。
        </p>
        <p>
            如果设置为 <code>true</code>，它会有效地将该目录中的所有文件添加到
            <code>suppressedFiles</code> 选项中，因此你可以手动配置它。
        </p>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>为 Java 类型生成外部文档链接时使用的 JDK 版本。</p>
        <p>
            例如，如果你在某个公共声明签名中使用了 <code>java.util.UUID</code>，
            并且此选项设置为 <code>8</code>，Dokka 会为此生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a> 的外部文档链接。
        </p>
        <p>默认值：JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 语言版本</a>。
        </p>
        <p>默认情况下，使用 Dokka 嵌入式编译器可用的最新语言版本。</p>
    </def>
    <def title="apiVersion">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>。
        </p>
        <p>默认情况下，它从 <code>languageVersion</code> 推断。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否生成指向 Kotlin 标准库 API 参考文档的外部文档链接。
        </p>
        <p>注意：当 <code>noStdLibLink</code> 设置为 <code>false</code> 时，链接<b>会</b>生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>是否生成指向 JDK Javadoc 的外部文档链接。</p>
        <p>JDK Javadoc 的版本由 <code>jdkVersion</code> 选项决定。</p>
        <p>注意：当 <code>noJdkLink</code> 设置为 <code>false</code> 时，链接<b>会</b>生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="noAndroidSdkLink">
        <anchor name="includes"/>
        <p>是否生成指向 Android SDK API 参考的外部文档链接。</p>
        <p>这仅在 Android 项目中相关，否则会被忽略。</p>
        <p>注意：当 <code>noAndroidSdkLink</code> 设置为 <code>false</code> 时，链接<b>会</b>生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含<a href="dokka-module-and-package-docs.md">模块和包文档</a>的 Markdown 文件列表。
        </p>
        <p>指定文件的内容将被解析并嵌入到文档中作为模块和包描述。</p>
        <p>
            请参阅<a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka gradle 示例</a>
            了解其外观和使用方法。
        </p>
    </def>
    <def title="platform">
        <p>
            用于设置代码分析和
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 环境的平台。
        </p>
        <p>默认值根据 Kotlin Gradle 插件提供的信息推断。</p>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和文档化的源代码根。
            可接受的输入是目录和单独的 <code>.kt</code> / <code>.java</code> 文件。
        </p>
        <p>默认情况下，源代码根从 Kotlin Gradle 插件提供的信息中推断。</p>
    </def>
    <def title="classpath">
        <p>用于分析和交互式示例的类路径。</p>
        <p>如果某些来自依赖项的类型未自动解析/拾取，则此功能很有用。</p>
        <p>此选项接受 <code>.jar</code> 和 <code>.klib</code> 文件。</p>
        <p>默认情况下，类路径从 Kotlin Gradle 插件提供的信息中推断。</p>
    </def>
    <def title="samples">
        <p>
            包含通过 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 标签引用的示例函数的目录或文件列表。
        </p>
    </def>
</deflist>

### 源链接配置

`sourceLinks` 配置块允许你为每个签名添加一个 `source` 链接，该链接指向具有特定行号的 `remoteUrl`。（行号可通过设置 `remoteLineSuffix` 配置）。

这有助于读者查找每个声明的源代码。

例如，请参阅 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函数的文档。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        sourceLink {
            localDirectory.set(projectDir.resolve("src"))
            remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        sourceLink {
            localDirectory.set(file("src"))
            remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地源代码目录的路径。该路径必须是相对于当前项目根目录的。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            源代码托管服务的 URL，文档阅读器可以访问该服务，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用于生成
            声明的源代码链接。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用于在 URL 后附加源代码行号的后缀。这有助于读者不仅导航到文件，
            还导航到声明的具体行号。
        </p>
        <p>
            数字本身会附加到指定的后缀。例如，
            如果此选项设置为 <code>#L</code> 且行号为 10，则生成的 URL 后缀
            为 <code>#L10</code>。
        </p>
        <p>
            常用服务使用的后缀：</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>默认值：<code>#L</code></p>
    </def>
</deflist>

### 包选项

`perPackageOption` 配置块允许为由 `matchingRegex` 匹配的特定包设置一些选项。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set([Visibility.PUBLIC])
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用于匹配包的正则表达式。</p>
        <p>默认值：<code>.*</code></p>
    </def>
    <def title="suppress">
        <p>生成文档时是否应跳过此包。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文档化使用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否发出关于可见的未文档化声明的警告，即在经过 <code>documentedVisibilities</code> 和其他过滤器过滤后没有 KDoc 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>应进行文档化的可见性修饰符集。</p>
        <p>
            这可用于文档化此包中的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明并仅文档化内部 API。
        </p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
</deflist>

### 外部文档链接配置

`externalDocumentationLink` 块允许创建指向你的依赖项的外部托管文档的链接。

例如，如果你正在使用 `kotlinx.serialization` 中的类型，默认情况下它们在你的文档中是不可点击的，就像它们未解析一样。然而，由于 `kotlinx.serialization` 的 API 参考文档是由 Dokka 构建并[发布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，你可以为其配置外部文档链接。因此，Dokka 能够为库中的类型生成链接，使它们成功解析并可点击。

默认情况下，Kotlin 标准库、JDK、Android SDK 和 AndroidX 的外部文档链接已配置。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        externalDocumentationLink {
            url.set(URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                rootProject.projectDir.resolve("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置部分
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 源代码集配置部分
        // ..
        
        externalDocumentationLink {
            url.set(new URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                file("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>要链接到的文档的根 URL。它<b>必须</b>包含尾部斜杠。</p>
        <p>
            Dokka 会尽力自动查找给定 URL 的 <code>package-list</code>，
            并将声明链接在一起。
        </p>
        <p>
            如果自动解析失败或你想使用本地缓存文件，请考虑设置 <code>packageListUrl</code> 选项。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置。这是不依赖 Dokka
            自动解析它的替代方法。
        </p>
        <p>
            包列表包含有关文档和项目本身的信息，
            例如模块和包名称。
        </p>
        <p>这也可以是本地缓存的文件，以避免网络调用。</p>
    </def>
</deflist>

### 完整配置

下面你可以看到同时应用的所有可能配置选项。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")
            
            sourceLink {
                localDirectory.set(projectDir.resolve("src"))
                remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                    rootProject.projectDir.resolve("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        Visibility.PUBLIC,
                        Visibility.PRIVATE,
                        Visibility.PROTECTED,
                        Visibility.INTERNAL,
                        Visibility.PACKAGE
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：要配置多项目构建，你需要
//       配置子项目的 Partial 任务。
//       请参阅文档的“配置示例”部分。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src"))
                remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(new URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                        file("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([Visibility.PUBLIC])
            }
        }
    }
}
```

</tab>
</tabs>