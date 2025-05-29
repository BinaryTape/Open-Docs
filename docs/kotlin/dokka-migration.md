[//]: # (title: 迁移到 Dokka Gradle 插件 v2)

> Dokka Gradle 插件 v2 是一项 [实验性](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 功能。
> 它可能随时发生变化。欢迎您在 [GitHub](https://github.com/Kotlin/dokka/issues) 上提出反馈。
>
{style="warning"}

Dokka Gradle 插件 (DGP) 是一个用于为使用 Gradle 构建的 Kotlin 项目生成全面 API 文档的工具。

DGP 无缝处理 Kotlin 的 KDoc 注释和 Java 的 Javadoc 注释，以提取信息并以 [HTML 或 Javadoc](#select-documentation-output-format) 格式创建结构化文档。

从 Dokka 2.0.0 开始，您可以尝试 Dokka Gradle 插件 v2，它是 DGP 的新版本。使用 Dokka 2.0.0，您可以在 v1 或 v2 模式下使用 Dokka Gradle 插件。

DGP v2 引入了对 DGP 的重大改进，更紧密地与 Gradle 最佳实践对齐：

* 采用 Gradle 类型，从而带来更好的性能。
* 使用直观的顶层 DSL 配置，而不是低级基于任务的设置，这简化了构建脚本及其可读性。
* 采取更声明式的方法进行文档聚合，这使得多项目文档更容易管理。
* 使用类型安全的插件配置，这提高了构建脚本的可靠性和可维护性。
* 完全支持 Gradle [配置缓存](https://docs.gradle.org/current/userguide/configuration_cache.html) 和 [构建缓存](https://docs.gradle.org/current/userguide/build_cache.html)，这提高了性能并简化了构建工作。

## 开始之前

在开始迁移之前，请完成以下步骤。

### 验证支持版本

确保您的项目满足最低版本要求：

| **工具**                                                                          | **版本**      |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 或更高     |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高     |
| [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高     |

### 启用 DGP v2

在项目的 `build.gradle.kts` 文件的 `plugins {}` 块中，将 Dokka 版本更新到 2.0.0：

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "2.0.0"
}
```

或者，您可以使用 [版本目录 (version catalog)](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog) 来启用 Dokka Gradle 插件 v2。

> 默认情况下，DGP v2 以 HTML 格式生成文档。要生成 Javadoc 或同时生成 HTML 和 Javadoc 格式，请添加相应的插件。有关插件的更多信息，请参阅 [选择文档输出格式](#select-documentation-output-format)。
>
{style="tip"}

### 启用迁移助手

在项目的 `gradle.properties` 文件中，设置以下 Gradle 属性以激活带助手的 DGP v2：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 如果您的项目没有 `gradle.properties` 文件，请在项目的根目录中创建一个。
>
{style="tip"}

此属性会激活带迁移助手的 DGP v2 插件。当构建脚本引用 DGP v1 中不再可用的任务时，这些助手可以防止编译错误。

> 迁移助手不会主动协助迁移。它们只会在您过渡到新 API 时，防止构建脚本中断。
>
{style="note"}

完成迁移后，[禁用迁移助手](#set-the-opt-in-flag)。

### 将项目与 Gradle 同步

启用 DGP v2 和迁移助手后，将项目与 Gradle 同步，以确保 DGP v2 正确应用：

* 如果您使用 IntelliJ IDEA，请在 Gradle 工具窗口中单击 **重新加载所有 Gradle 项目** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} 按钮。
* 如果您使用 Android Studio，请选择 **文件** | **将项目与 Gradle 文件同步**。

## 迁移您的项目

将 Dokka Gradle 插件更新到 v2 后，请按照适用于您项目的迁移步骤进行操作。

### 调整配置选项

DGP v2 在 [Gradle 配置选项](dokka-gradle.md#configuration-options) 中引入了一些更改。在 `build.gradle.kts` 文件中，根据您的项目设置调整配置选项。

#### DGP v2 中的顶层 DSL 配置

用 DGP v2 的顶层 `dokka {}` DSL 配置替换 DGP v1 的配置语法：

DGP v1 中的配置：

```kotlin
tasks.withType<DokkaTask>().configureEach {
    suppressInheritedMembers.set(true)
    failOnWarning.set(true)
    dokkaSourceSets {
        named("main") {
            moduleName.set("Project Name")
            includes.from("README.md")
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}

tasks.dokkaHtml {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customStyleSheets.set(listOf("styles.css"))
        customAssets.set(listOf("logo.png"))
        footerMessage.set("(c) Your Company")
    }
}
```

DGP v2 中的配置：

`build.gradle.kts` 文件的语法与常规 `.kt` 文件（例如用于自定义 Gradle 插件的文件）不同，因为 Gradle 的 Kotlin DSL 使用类型安全的访问器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置文件" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    moduleName.set("Project Name")
    dokkaPublications.html {
        suppressInheritedMembers.set(true)
        failOnWarning.set(true)
    }
    dokkaSourceSets.main {
        includes.from("README.md")
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://example.com/src")
            remoteLineSuffix.set("#L")
        }
    }
    pluginsConfiguration.html {
        customStyleSheets.from("styles.css")
        customAssets.from("logo.png")
        footerMessage.set("(c) Your Company")
    }
}
```

</tab>
<tab title="Kotlin 文件" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension
import org.jetbrains.dokka.gradle.engine.plugins.DokkaHtmlPluginParameters

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->

            dokka.dokkaPublications.named("html") { publication ->
                publication.suppressInheritedMembers.set(true)
                publication.failOnWarning.set(true)
            }

            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }

            dokka.pluginsConfiguration.named("html", DokkaHtmlPluginParameters::class.java) { html ->
                html.customStyleSheets.from("styles.css")
                html.customAssets.from("logo.png")
                html.footerMessage.set("(c) Your Company")
            }
        }
    }
}
```

</tab>
</tabs>

#### 可见性设置

将 `documentedVisibilities` 属性从 `Visibility.PUBLIC` 设置为 `VisibilityModifier.Public`。

DGP v1 中的配置：

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility

// ...
documentedVisibilities.set(
    setOf(Visibility.PUBLIC)
) 
```

DGP v2 中的配置：

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

// ...
documentedVisibilities.set(
    setOf(VisibilityModifier.Public)
)

// OR

documentedVisibilities(VisibilityModifier.Public)
```

此外，使用 DGP v2 的 [工具函数 (utility function)](https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16) 来添加文档化的可见性：

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### 源链接

配置源链接以允许从生成的文档导航到远程仓库中的相应源代码。使用 `dokkaSourceSets.main{}` 块进行此配置。

DGP v1 中的配置：

```kotlin
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

DGP v2 中的配置：

`build.gradle.kts` 文件的语法与常规 `.kt` 文件（例如用于自定义 Gradle 插件的文件）不同，因为 Gradle 的 Kotlin DSL 使用类型安全的访问器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置文件" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://github.com/your-repo")
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Kotlin 文件" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }
        }
    }
}
```

</tab>
</tabs>

由于源链接配置已 [更改](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)，请使用 `URI` 类而不是 `URL` 来指定远程 URL。

DGP v1 中的配置：

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2 中的配置：

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// or

remoteUrl("https://github.com/your-repo")
```

此外，DGP v2 有两个 [工具函数 (utility functions)](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96) 用于设置 URL：

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 外部文档链接

使用 `register()` 方法注册外部文档链接以定义每个链接。`externalDocumentationLinks` API 使用此方法以与 Gradle DSL 约定保持一致。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtml {
    dokkaSourceSets {
        configureEach {
            externalDocumentationLink {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }
        }
    }
}
```

DGP v2 中的配置：

```kotlin
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url("https://example.com/docs/")
            packageListUrl("https://example.com/docs/package-list")
        }
    }
}
```

#### 自定义资源

使用 [`customAssets`](dokka-html.md#customize-assets) 属性与文件集合 ([`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties) 而不是列表 (`var List<File>`)。

DGP v1 中的配置：

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2 中的配置：

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 输出目录

使用 `dokka {}` 块指定生成的 Dokka 文档的输出目录。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
}
```

DGP v2 中的配置：

```kotlin
dokka {
    dokkaPublications.html {
        outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
    }
}
```

#### 附加文件的输出目录

在 `dokka {}` 块内，为单模块和多模块项目指定输出目录并包含附加文件。

在 DGP v2 中，单模块和多模块项目的配置是统一的。您无需单独配置 `dokkaHtml` 和 `dokkaHtmlMultiModule` 任务，而是在 `dokka {}` 块内的 `dokkaPublications.html {}` 中指定设置。

对于多模块项目，请在根项目的配置中设置输出目录并包含附加文件（例如 `README.md`）。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2 中的配置：

`build.gradle.kts` 文件的语法与常规 `.kt` 文件（例如用于自定义 Gradle 插件的文件）不同，因为 Gradle 的 Kotlin DSL 使用类型安全的访问器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置文件" group-key="gradle">

```kotlin
// build.gradle.kts

dokka {
    dokkaPublications.html {
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        includes.from(project.layout.projectDirectory.file("README.md"))
    }
}
```

</tab>
<tab title="Kotlin 文件" group-key="kotlin">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaPublications.named("html") { html ->
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
                html.includes.from(project.layout.projectDirectory.file("README.md"))
            }
        }
    }
}
```

</tab>
</tabs>

### 配置 Dokka 插件

使用 JSON 配置内置 Dokka 插件已被弃用，取而代之的是类型安全的 DSL。此更改提高了与 Gradle 增量构建系统的兼容性，并改进了任务输入跟踪。

DGP v1 中的配置：

在 DGP v1 中，Dokka 插件是手动使用 JSON 配置的。这种方法导致了 Gradle 最新检查的 [注册任务输入](https://docs.gradle.org/current/userguide/incremental_build.html) 问题。

以下是 [Dokka 版本控制插件 (Dokka Versioning plugin)](https://kotl.in/dokka-versioning-plugin) 的已弃用基于 JSON 的配置示例：

```kotlin
tasks.dokkaHtmlMultiModule {
    pluginsMapConfiguration.set(
        mapOf(
            "org.jetbrains.dokka.versioning.VersioningPlugin" to """
                { "version": "1.2", "olderVersionsDir": "$projectDir/dokka-docs" }
                """.trimIndent()
        )
    )
}
```

DGP v2 中的配置：

在 DGP v2 中，Dokka 插件使用类型安全的 DSL 进行配置。要以类型安全的方式配置 Dokka 插件，请使用 `pluginsConfiguration{}` 块：

```kotlin
dokka {
    pluginsConfiguration {
        versioning {
            version.set("1.2")
            olderVersionsDir.set(projectDir.resolve("dokka-docs"))
        }
    }
}
```

有关 DGP v2 配置的示例，请参阅 [Dokka 的版本控制插件 (Dokka's versioning plugin)](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 2.0.0 允许您通过 [配置自定义插件 (configuring custom plugins)](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts) 来扩展其功能。自定义插件可以对文档生成过程进行额外的处理或修改。

### 在模块之间共享 Dokka 配置

DGP v2 不再使用 `subprojects {}` 或 `allprojects {}` 来在模块之间共享配置。在未来的 Gradle 版本中，使用这些方法将 [导致错误](https://docs.gradle.org/current/userguide/isolated_projects.html)。

请按照以下步骤，在 [具有现有约定插件](#multi-module-projects-with-convention-plugins) 或 [没有约定插件](#multi-module-projects-without-convention-plugins) 的多模块项目中正确共享 Dokka 配置。

共享 Dokka 配置后，您可以将多个模块的文档聚合到一个输出中。有关更多信息，请参阅 [更新多模块项目中的文档聚合](#update-documentation-aggregation-in-multi-module-projects)。

> 对于多模块项目示例，请参阅 [Dokka GitHub 仓库](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 没有约定插件的多模块项目

如果您的项目不使用约定插件，您仍然可以通过直接配置每个模块来共享 Dokka 配置。这涉及手动在每个模块的 `build.gradle.kts` 文件中设置共享配置。尽管这种方法集中程度较低，但它避免了额外设置（例如约定插件）的需要。

否则，如果您的项目使用约定插件，您还可以通过在 `buildSrc` 目录中创建约定插件，然后将该插件应用于您的模块（子项目），来在多模块项目中共享 Dokka 配置。

##### 设置 buildSrc 目录

1. 在项目根目录中，创建一个 `buildSrc` 目录，其中包含两个文件：

   * `settings.gradle.kts`
   * `build.gradle.kts`

2. 在 `buildSrc/settings.gradle.kts` 文件中，添加以下代码片段：

   ```kotlin
   rootProject.name = "buildSrc"
   ```

3. 在 `buildSrc/build.gradle.kts` 文件中，添加以下代码片段：

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:2.0.0")
    }   
    ```

##### 设置 Dokka 约定插件

设置 `buildSrc` 目录后：

1. 创建 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 文件以托管 [约定插件 (convention plugin)](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2. 在 `dokka-convention.gradle.kts` 文件中，添加以下代码片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // The shared configuration goes here
    }
    ```

   您需要将所有子项目共有的共享 Dokka [配置](#adjust-configuration-options) 添加到 `dokka {}` 块中。
   此外，您无需指定 Dokka 版本。版本已在 `buildSrc/build.gradle.kts` 文件中设置。

##### 将约定插件应用于您的模块

通过将 Dokka 约定插件添加到每个子项目的 `build.gradle.kts` 文件中，将该插件应用于您的模块（子项目）：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 具有约定插件的多模块项目

如果您已经有约定插件，请按照 [Gradle 的文档](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins) 创建一个专用的 Dokka 约定插件。

然后，按照 [设置 Dokka 约定插件](#set-up-the-dokka-convention-plugin) 和 [将其应用于您的模块](#apply-the-convention-plugin-to-your-modules) 的步骤进行操作。

### 更新多模块项目中的文档聚合

Dokka 可以将来自多个模块（子项目）的文档聚合到一个输出或发布中。

如 [所解释](#apply-the-convention-plugin-to-your-modules)，在聚合文档之前，将 Dokka 插件应用于所有可文档化的子项目。

DGP v2 中的聚合使用 `dependencies {}` 块而不是任务，并且可以添加到任何 `build.gradle.kts` 文件中。

在 DGP v1 中，聚合是隐式在根项目中创建的。为了在 DGP v2 中复制此行为，请在根项目的 `build.gradle.kts` 文件中添加 `dependencies {}` 块。

DGP v1 中的聚合：

```kotlin
    tasks.dokkaHtmlMultiModule {
        // ...
    }
```

DGP v2 中的聚合：

```kotlin
dependencies {
    dokka(project(":some-subproject:"))
    dokka(project(":another-subproject:"))
}
```

### 更改聚合文档的目录

当 DGP 聚合模块时，每个子项目在聚合文档中都有自己的子目录。

在 DGP v2 中，聚合机制已更新，以更好地与 Gradle 约定对齐。DGP v2 现在保留完整的子项目目录，以防止在任何位置聚合文档时发生冲突。

DGP v1 中的聚合目录：

在 DGP v1 中，聚合文档被放置在折叠的目录结构中。例如，给定一个在 `:turbo-lib` 中进行聚合的项目以及一个嵌套的子项目 `:turbo-lib:maths`，生成的文档将被放置在：

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2 中的聚合目录：

DGP v2 通过保留完整的项目结构，确保每个子项目都有一个唯一的目录。现在，相同的聚合文档遵循以下结构：

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

此更改可防止具有相同名称的子项目发生冲突。然而，由于目录结构已更改，外部链接可能会过时，从而可能导致 `404` 错误。

#### 恢复到 DGP v1 目录行为

如果您的项目依赖于 DGP v1 中使用的目录结构，您可以通过手动指定模块目录来恢复此行为。将以下配置添加到每个子项目的 `build.gradle.kts` 文件中：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the module directory to match the V1 structure
    modulePath.set("maths")
}
```

### 使用更新后的任务生成文档

DGP v2 已重命名生成 API 文档的 Gradle 任务。

DGP v1 中的任务：

```text
./gradlew dokkaHtml

// or

./gradlew dokkaHtmlMultiModule
```

DGP v2 中的任务：

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 任务在 `build/dokka/` 目录中生成 API 文档。

在 DGP v2 版本中，`dokkaGenerate` 任务名称适用于单模块和多模块项目。您可以使用不同的任务以 HTML、Javadoc 或同时以 HTML 和 Javadoc 格式生成输出。有关更多信息，请参阅 [选择文档输出格式](#select-documentation-output-format)。

### 选择文档输出格式

> Javadoc 输出格式处于 [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 阶段。
> 使用时可能会发现错误并遇到迁移问题。不保证与接受 Javadoc 作为输入的工具成功集成。请自行承担风险使用。
>
{style="note"}

DGP v2 的默认输出格式是 HTML。但是，您可以选择同时以 HTML、Javadoc 或两种格式生成 API 文档：

1. 将相应的插件 `id` 放在项目的 `build.gradle.kts` 文件的 `plugins {}` 块中：

   ```kotlin
   plugins {
       // Generates HTML documentation
       id("org.jetbrains.dokka") version "2.0.0"

       // Generates Javadoc documentation
       id("org.jetbrains.dokka-javadoc") version "2.0.0"

       // Keeping both plugin IDs generates both formats
   }
   ```

2. 运行相应的 Gradle 任务。

以下是与每种格式对应的插件 `id` 和 Gradle 任务列表：

|             | **HTML**                         | **Javadoc**                          | **两者**                            |
|-------------|----------------------------------|--------------------------------------|-------------------------------------|
| 插件 `id`   | `id("org.jetbrains.dokka")`      | `id("org.jetbrains.dokka-javadoc")`  | 同时使用 HTML 和 Javadoc 插件           |
| Gradle 任务 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`          |

> `dokkaGenerate` 任务根据已应用的插件生成所有可用格式的文档。
> 如果同时应用了 HTML 和 Javadoc 插件，您可以选择只生成 HTML，方法是运行 `dokkaGeneratePublicationHtml` 任务；或者只生成 Javadoc，方法是运行 `dokkaGeneratePublicationJavadoc` 任务。
>
{style="tip"}

### 解决弃用和移除

*   **输出格式支持：** Dokka 2.0.0 仅支持 HTML 和 Javadoc 输出。Markdown 和 Jekyll 等实验性格式不再受支持。
*   **收集器任务：** `DokkaCollectorTask` 已移除。现在，您需要为每个子项目单独生成文档，如果需要，再 [聚合文档](#update-documentation-aggregation-in-multi-module-projects)。

## 完成迁移

迁移项目后，执行以下步骤以完成并提高性能。

### 设置选择启用标志

成功迁移后，在项目的 `gradle.properties` 文件中设置以下不带助手的选择启用标志：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

如果您移除了对 DGP v1 中不再可用的 Gradle 任务的引用，您应该不会看到相关的编译错误。

### 启用构建缓存和配置缓存

DGP v2 现在支持 Gradle 构建缓存和配置缓存，从而提高了构建性能。

*   要启用构建缓存，请按照 [Gradle 构建缓存文档](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable) 中的说明进行操作。
*   要启用配置缓存，请按照 [Gradle 配置缓存文档](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable) 中的说明进行操作。

## 故障排除

在大型项目中，Dokka 在生成文档时会消耗大量内存。这可能会超出 Gradle 的内存限制，尤其是在处理大量数据时。

当 Dokka 生成耗尽内存时，构建会失败，Gradle 可能会抛出诸如 `java.lang.OutOfMemoryError: Metaspace` 之类的异常。

目前正在积极努力改进 Dokka 的性能，尽管一些限制源于 Gradle。

如果遇到内存问题，请尝试以下变通方法：

*   [增加堆空间](#increase-heap-space)
*   [在 Gradle 进程内运行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆空间

解决内存问题的一种方法是增加 Dokka 生成器进程的 Java 堆内存量。在 `build.gradle.kts` 文件中，调整以下配置选项：

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

在此示例中，最大堆大小设置为 4 GB (`"4g"`)。调整并测试该值，以找到适合您构建的最佳设置。

如果您发现 Dokka 需要相当大的堆空间，例如，明显高于 Gradle 自身的内存使用量，请在 [Dokka 的 GitHub 仓库](https://kotl.in/dokka-issues) 上创建一个 issue。

> 您必须将此配置应用于每个子项目。建议您在一个约定插件中配置 Dokka，并将其应用于所有子项目。
>
{style="note"}

### 在 Gradle 进程内运行 Dokka

当 Gradle 构建和 Dokka 生成都需要大量内存时，它们可能会作为单独的进程运行，从而在一台机器上消耗大量内存。

为了优化内存使用，您可以在相同的 Gradle 进程内运行 Dokka，而不是作为单独的进程运行。这允许您一次性配置 Gradle 的内存，而不是为每个进程单独分配。

要在相同的 Gradle 进程内运行 Dokka，请在 `build.gradle.kts` 文件中调整以下配置选项：

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

与 [增加堆空间](#increase-heap-space) 一样，测试此配置以确认它对您的项目运行良好。

有关配置 Gradle JVM 内存的更多详细信息，请参阅 [Gradle 文档](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 更改 Gradle 启动的 Java 选项会启动一个新的 Gradle 守护进程，该守护进程可能会长时间保持活动状态。您可以 [手动停止任何其他 Gradle 进程](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，`ClassLoaderIsolation()` 配置的 Gradle 问题可能 [导致内存泄漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}

## 接下来

*   [探索更多 DGP v2 项目示例](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。
*   [开始使用 Dokka](dokka-get-started.md)。
*   [了解有关 Dokka 插件的更多信息](dokka-plugins.md)。