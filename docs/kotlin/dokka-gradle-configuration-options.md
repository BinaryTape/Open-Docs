[//]: # (title: Dokka Gradle 配置选项)

Dokka 提供了许多配置选项，可用于定制你和你的读者的体验。

下面是每个配置部分及其一些示例的详细描述。你还可以找到一个应用了[所有配置选项](#complete-configuration)的示例。

关于如何为单项目和多项目构建应用配置块的更多细节，请参见[配置示例](dokka-gradle.md#configuration-examples)。

### 通用配置

以下是 Dokka Gradle 插件通用配置的一个示例：

*   使用顶层 `dokka {}` DSL 配置。
*   在 DGP 中，你可以在 `dokkaPublications{}` 代码块中声明 Dokka 发布配置。
*   默认的发布项是 [`html`](dokka-html.md) 和 [`javadoc`](dokka-javadoc.md)。

*   `build.gradle.kts` 文件的语法与常规的 `.kt` 文件（例如用于 Kotlin 自定义插件的文件）不同，因为 Gradle 的 Kotlin DSL 使用类型安全的访问器。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        // HTML 文档的标准输出目录
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
        
        // 附加文件的输出目录
        // 当你想要更改输出目录并包含附加文件时，
        // 使用此代码块而不是标准代码块。
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        
        // 使用 fileTree 添加多个文件
        includes.from(
            fileTree("docs") {
                include("**/*.md")
            }
        )
    }
}
```

关于文件操作的更多信息，请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/working_with_files.html#sec:file_trees)。

</tab>
<tab title="Kotlin 自定义插件" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            
            dokka.moduleName.set(project.name)
            dokka.moduleVersion.set(project.version.toString())

            dokka.dokkaPublications.named("html") { publication ->
                // HTML 文档的标准输出目录
                publication.outputDirectory.set(project.layout.buildDirectory.dir("dokka/html"))
                publication.failOnWarning.set(true)
                publication.suppressInheritedMembers.set(true)
                publication.offlineMode.set(false)
                publication.suppressObviousFunctions.set(true)
                publication.includes.from("packages.md", "extra.md")

                // 附加文件的输出目录
                // 当你想要更改输出目录并包含附加文件时，
                // 使用此代码块而不是标准代码块。
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            // 设置通用模块信息
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())

            // HTML 文档的标准输出目录
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))

            // Dokka 核心选项
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from(files("packages.md", "extra.md"))

            // 附加文件的输出目录
            // 当你想要更改输出目录并包含附加文件时，
            // 使用此代码块而不是标准代码块。
            outputDirectory.set(file("$rootDir/docs/api/0.x"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>
           项目的文档显示名称。它出现在目录、导航、标题和日志消息中。在多项目构建中，每个子项目的 <code>moduleName</code> 用作聚合文档中的章节标题。
        </p>
        <p>默认值：Gradle 项目名称</p>
    </def>
    <def title="moduleVersion">
        <p>
            生成文档中显示的子项目版本。在单项目构建中，它用作项目版本。在多项目构建中，聚合文档时会使用每个子项目的 <code>moduleVersion</code>。
        </p>
        <p>默认值：Gradle 项目版本</p>
    </def>
    <def title="outputDirectory">
        <p>生成文档的存储目录。</p>
        <p>此设置适用于 <code>dokkaGenerate</code> 任务生成的所有文档格式（HTML、Javadoc 等）。</p>
        <p>默认值：<code>build/dokka/html</code></p>
        <p><b>附加文件的输出目录</b></p>
        <p>你可以为单项目和多项目构建指定输出目录并包含附加文件。对于多项目构建，请在根项目的配置中设置输出目录并包含附加文件。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            确定 Dokka 是否应在文档生成期间出现警告时使构建失败。此过程会先等待所有错误和警告发出完毕。
        </p>
        <p>此设置与 <code>reportUndocumented</code> 配合良好。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制在给定类中未显式覆盖的继承成员。</p>
        <p>
            注意：
            这会抑制诸如 <code>equals</code>、<code>hashCode</code> 和 <code>toString</code> 之类的函数，
            但不会抑制诸如 <code>dataClass.componentN</code> 和 
            <code>dataClass.copy</code> 之类的合成函数。为此，请使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制显而易见的函数。</p>
        <p>
            如果函数满足以下条件，则被认为是显而易见的：</p>
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成的（由编译器生成）且没有任何文档，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="offlineMode">
        <p>是否通过网络解析远程文件和链接。</p>
        <p>
            这包括用于生成外部文档链接的 package-list。
            例如，这使得标准库中的类可以在你的文档中点击。
        </p>
        <p>
            在某些情况下，将其设置为 <code>true</code> 可以显著加快构建时间，
            但也可能降低用户体验。例如，不
            解析来自你的依赖项（包括标准库）的类和成员链接。
        </p>
        <p>注意：你可以本地缓存获取的文件，并将其作为本地路径提供给 Dokka。请参见
           <code><a href="#external-documentation-links-configuration">externalDocumentationLinks</a></code> 部分。</p>
        <p>默认值：<code>false</code></p>
    </def>
     <def title="includes">
        <p>
            包含[子项目和包文档](dokka-module-and-package-docs.md)的 Markdown 文件列表。Markdown 文件必须
            符合[所需格式](dokka-module-and-package-docs.md#file-format)。
        </p>
        <p>指定文件的内容会被解析并嵌入到文档中，作为子项目和包的描述。</p>
        <p>
            关于其外观和用法示例，请参见 <a href="https://github.com/Kotlin/dokka/blob/master/examples/gradle-v2/basic-gradle-example/build.gradle.kts">Dokka Gradle 示例</a>。
        </p>
    </def>
</deflist>

### 源代码集配置

Dokka 允许为 [Kotlin 源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 配置一些选项：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // 通用配置部分
    // ..

    // 源代码集配置
    dokkaSourceSets {
        // 示例：'linux' 源代码集特有的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")
           
            sourceLink {
                // 源代码链接部分
            }
            perPackageOption {
                // 包选项部分
            }
            externalDocumentationLinks {
                // 外部文档链接部分
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    // ..
    // 通用配置部分
    // ..

    dokkaSourceSets {
        // 示例：'linux' 源代码集特有的配置
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 源代码链接部分
            }
            perPackageOption {
                // 包选项部分
            }
            externalDocumentationLinks {
                // 外部文档链接部分
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
            此名称既用于外部（例如，文档读者可见的源代码集名称），也用于内部（例如，<code>reportUndocumented</code> 的日志消息）。
        </p>
        <p>默认情况下，该值从 Kotlin Gradle 插件提供的信息中推断得出。</p>
    </def>
    <def title="documentedVisibilities">
        <p>定义 Dokka 应在生成文档中包含哪些可见性修饰符。</p>
        <p>
            如果你想文档化 <code>protected</code>、<code>internal</code> 和 <code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明而只文档化内部 API，请使用它们。
        </p>
        <p>
            此外，你可以使用 Dokka 的 
            <a href="https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt"><code>documentedVisibilities() 函数</code></a> 
            来添加文档化的可见性。
        </p>
        <p>这可以为每个单独的包配置。</p>
        <p>默认值：<code>VisibilityModifier.Public</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的未文档化声明发出警告，即在被 <code>documentedVisibilities</code> 和其他过滤器过滤后没有 KDocs 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以为每个单独的包配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            在应用各种过滤器后，是否跳过不包含任何可见声明的包。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 设置为 <code>true</code>，并且你的包只包含已弃用的声明，则该包被认为是空的。
        </p>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文档化用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以为每个单独的包配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>是否文档化生成的文件。</p>
        <p>
            生成的文件预计位于 <code>{project}/{buildDir}/generated</code> 目录下。
        </p>
        <p>
            如果设置为 <code>true</code>，它实际上会将该目录中的所有文件添加到
            <code>suppressedFiles</code> 选项中，因此你可以手动配置它。
        </p>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>为 Java 类型生成外部文档链接时使用的 JDK 版本。</p>
        <p>
            例如，如果你在某个公共声明签名中使用了 <code>java.util.UUID</code>，
            并且此选项设置为 <code>8</code>，Dokka 会为其生成一个指向 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a> 的外部文档链接。
        </p>
        <p>默认值：`8`</p>
    </def>
    <def title="languageVersion">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 语言版本</a>。
        </p>
        <p>默认情况下，Dokka 嵌入式编译器可用的最新语言版本会被使用。</p>
    </def>
    <def title="apiVersion">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>。
        </p>
        <p>默认情况下，它从 <code>languageVersion</code> 中推断得出。</p>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和文档化的源代码根。
            可接受的输入是目录以及单个 <code>.kt</code> 和 <code>.java</code> 文件。
        </p>
        <p>默认情况下，源代码根从 Kotlin Gradle 插件提供的信息中推断得出。</p>
    </def>
    <def title="classpath">
        <p>用于分析和交互式示例的 classpath。</p>
        <p>如果某些来自依赖项的类型未被自动解析或识别，这会很有用。</p>
        <p>此选项接受 <code>.jar</code> 和 <code>.klib</code> 文件。</p>
        <p>默认情况下，classpath 从 Kotlin Gradle 插件提供的信息中推断得出。</p>
    </def>
    <def title="samples">
        <p>
            包含示例函数（通过
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 标签引用）的目录或文件列表。
        </p>
    </def>
</deflist>

### 源代码链接配置

配置源代码链接以帮助读者在远程版本库中找到每个声明的源代码。使用 `dokkaSourceSets.main {}` 代码块进行此配置。

`sourceLinks {}` 配置代码块允许你为每个签名添加一个 `source` 链接，该链接指向带有特定行号的 `remoteUrl`。通过设置 `remoteLineSuffix` 可以配置行号。

有关示例，请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函数的文档。

`build.gradle.kts` 文件的语法与常规的 `.kt` 文件（例如用于自定义 Gradle 插件的文件）不同，因为 Gradle 的 Kotlin DSL 使用类型安全的访问器：

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

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
<tab title="Kotlin 自定义插件" group-key="kotlin custom">

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
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets {
        main {
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

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地源代码目录的路径。该路径必须是相对于当前项目根目录的相对路径。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            文档读者可以访问的源代码托管服务的 URL，例如 GitHub、GitLab、Bitbucket 或任何提供源代码文件的稳定 URL 的托管服务。
            此 URL 用于生成声明的源代码链接。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用于将源代码行号附加到 URL 的后缀。这有助于读者不仅导航到文件，还可以导航到声明的特定行号。
        </p>
        <p>
            数字本身会附加到指定的后缀。例如，
            如果此选项设置为 <code>#L</code> 且行号为 10，则结果 URL 后缀
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

`perPackageOption` 配置代码块允许为 `matchingRegex` 匹配的特定包设置一些选项：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications.html {
        dokkaSourceSets.configureEach {
            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

dokka {
    dokkaPublications {
        html {
            dokkaSourceSets.configureEach {
                perPackageOption {
                    matchingRegex.set(".*api.*")
                    suppress.set(false)
                    skipDeprecated.set(false)
                    reportUndocumented.set(false)
                    documentedVisibilities.set([VisibilityModifier.Public] as Set)
                }
            }
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
        <p>是否文档化用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的未文档化声明发出警告，即在被 <code>documentedVisibilities</code> 和其他过滤器过滤后没有 KDocs 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>定义 Dokka 应在生成文档中包含哪些可见性修饰符。</p>
        <p>
            如果你想文档化此包内的 <code>protected</code>、<code>internal</code> 和 <code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明而只文档化内部 API，请使用它们。
        </p>
        <p>
            此外，你可以使用 Dokka 的 
            <a href="https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16"><code>documentedVisibilities() 函数</code></a> 
            来添加文档化的可见性。
        </p>
        <p>这可以在源代码集级别进行配置。</p>
        <p>默认值：<code>VisibilityModifier.Public</code></p>
    </def>
</deflist>

### 外部文档链接配置

`externalDocumentationLinks {}`
代码块允许创建指向你的依赖项的外部托管文档的链接。

例如，如果你使用了 `kotlinx.serialization` 中的类型，默认情况下它们在你的文档中是不可点击的，就像它们未解析一样。然而，由于 `kotlinx.serialization` 的 API 参考文档是由 Dokka 构建并[发布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，你可以为其配置外部文档链接。这使得 Dokka 可以为来自该库的类型生成链接，使它们成功解析并可点击。

默认情况下，Kotlin 标准库、JDK、Android SDK 和 AndroidX 的外部文档链接已配置。

使用 `register()` 方法注册外部文档链接以定义每个链接。`externalDocumentationLinks` API 使用此方法，与 Gradle DSL 约定保持一致：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

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

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url.set(new URI("https://example.com/docs/"))
            packageListUrl.set(new URI("https://example.com/docs/package-list"))
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>要链接的文档根 URL。它<b>必须</b>包含尾部斜杠。</p>
        <p>
            Dokka 会尽力自动查找给定 URL 的 <code>package-list</code>，
            并将声明链接在一起。
        </p>
        <p>
            如果自动解析失败，或者你想使用本地缓存文件，
            请考虑设置 <code>packageListUrl</code> 选项。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置。这是替代 Dokka 自动解析它的方法。
        </p>
        <p>
            包列表包含关于文档和项目本身的信息，
            例如子项目和包名称。
        </p>
        <p>这也可以是本地缓存的文件，以避免网络调用。</p>
    </def>
</deflist>

### 完整配置

下面你可以看到所有可能的配置选项同时应用的情况：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set(project.name)
        moduleVersion.set(project.version.toString())
        outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
        failOnWarning.set(false)
        suppressInheritedMembers.set(false)
        suppressObviousFunctions.set(true)
        offlineMode.set(false)
        includes.from("packages.md", "extra.md")
   }

    dokkaSourceSets {
        // 示例：'linux' 源代码集特有的配置
        named("linux") {
            dependentSourceSets{named("native")}
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(VisibilityModifier.Public)) // OR documentedVisibilities(VisibilityModifier.Public)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl("https://example.com/src")
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set(project.name)
            moduleVersion.set(project.version.toString())
            outputDirectory.set(layout.buildDirectory.dir("dokka/html"))
            failOnWarning.set(false)
            suppressInheritedMembers.set(false)
            suppressObviousFunctions.set(true)
            offlineMode.set(false)
            includes.from("packages.md", "extra.md")
        }
    }

    dokkaSourceSets {
        // 示例：'linux' 源代码集特有的配置
        named("linux") {
            dependentSourceSets { named("native") }
            sourceRoots.from(file("linux/src"))
        }

        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([VisibilityModifier.Public] as Set)
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            sourceRoots.from(file("src"))
            classpath.from(file("libs/dependency.jar"))
            samples.from("samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLinks {
                url.set(new URI("https://example.com/docs/"))
                packageListUrl.set(new File("/path/to/package-list").toURI().toURL())
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([
                        VisibilityModifier.Public,
                        VisibilityModifier.Private,
                        VisibilityModifier.Protected,
                        VisibilityModifier.Internal,
                        VisibilityModifier.Package
                ] as Set)
            }
        }
    }
}
```

</tab>
</tabs>