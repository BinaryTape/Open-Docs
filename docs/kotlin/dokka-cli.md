[//]: # (title: CLI)

如果由于某些原因您无法使用 [Gradle](dokka-gradle.md) 或 [Maven](dokka-maven.md) 构建工具，Dokka 提供了命令行 (CLI) 运行器来生成文档。

相比之下，它拥有与 Dokka 的 Gradle 插件相同（甚至更多）的功能。尽管设置起来要困难得多，因为没有自动配置，尤其是在多平台和多模块环境中。

## 开始使用

CLI 运行器作为一个独立的可运行 Artifact 发布到 Maven Central。

您可以在 [Maven Central](https://central.sonatype.com/artifact/org.jetbrains.dokka/dokka-cli) 上找到它，或者 [直接下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-cli/%dokkaVersion%/dokka-cli-%dokkaVersion%.jar)。

将 `dokka-cli-%dokkaVersion%.jar` 文件保存到您的计算机后，使用 `-help` 选项运行它以查看所有可用的配置选项及其描述：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

它也适用于一些嵌套选项，例如 `-sourceSet`：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

## 生成文档

### 前提条件

由于没有构建工具来管理依赖项，您必须自己提供依赖项的 `.jar` 文件。

以下是您为任何输出格式所需的依赖项：

| **组**                  | **Artifact**                  | **版本**         | **链接**                                                                                                                                                 |
|-------------------------|-------------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.dokka`   | `dokka-base`                  | %dokkaVersion%   | [下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/dokka-base/%dokkaVersion%/dokka-base-%dokkaVersion%.jar)                                   |
| `org.jetbrains.dokka`   | `analysis-kotlin-descriptors` | %dokkaVersion%   | [下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/analysis-kotlin-descriptors/%dokkaVersion%/analysis-kotlin-descriptors-%dokkaVersion%.jar) |

以下是 [HTML](dokka-html.md) 输出格式所需的额外依赖项：

| **组**                    | **Artifact**       | **版本** | **链接**                                                                                                           |
|---------------------------|--------------------|----------|--------------------------------------------------------------------------------------------------------------------|
| `org.jetbrains.kotlinx`   | `kotlinx-html-jvm` | 0.8.0    | [下载](https://repo1.maven.org/maven2/org/jetbrains/kotlinx/kotlinx-html-jvm/0.8.0/kotlinx-html-jvm-0.8.0.jar) |
| `org.freemarker`          | `freemarker`       | 2.3.31   | [下载](https://repo1.maven.org/maven2/org/freemarker/freemarker/2.3.31/freemarker-2.3.31.jar)                  |

### 使用命令行选项运行

您可以传递命令行选项来配置 CLI 运行器。

至少需要提供以下选项：

*   `-pluginsClasspath` - 下载的依赖项的绝对/相对路径列表，用分号 `;` 分隔
*   `-sourceSet` - 要生成文档的源代码的绝对路径
*   `-outputDir` - 文档输出目录的绝对/相对路径

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;./analysis-kotlin-descriptors-%dokkaVersion%.jar;./kotlinx-html-jvm-0.8.0.jar;./freemarker-2.3.31.jar" \
     -sourceSet "-src /home/myCoolProject/src/main/kotlin" \
     -outputDir "./dokka/html"
```

执行上述示例将在 [HTML](dokka-html.md) 输出格式中生成文档。

更多配置详情，请参阅 [命令行选项](#command-line-options)。

### 使用 JSON 配置运行

可以通过 JSON 配置 CLI 运行器。在这种情况下，您需要将 JSON 配置文件作为第一个也是唯一的参数提供绝对/相对路径。所有其他配置选项都将从中解析。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar dokka-configuration.json
```

至少，您需要以下 JSON 配置文件：

```json
{
  "outputDir": "./dokka/html",
  "sourceSets": [
    {
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "sourceRoots": [
        "/home/myCoolProject/src/main/kotlin"
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

更多详情，请参阅 [JSON 配置选项](#json-configuration)。

### 其他输出格式

默认情况下，`dokka-base` Artifact 只包含 [HTML](dokka-html.md) 输出格式。

所有其他输出格式都作为 [Dokka 插件](dokka-plugins.md) 实现。为了使用它们，您必须将它们放到插件类路径中。

例如，如果您想以实验性的 [GFM](dokka-markdown.md#gfm) 输出格式生成文档，您需要下载并传递 gfm-plugin 的 JAR（[下载](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar)）到 `pluginsClasspath` 配置选项中。

通过命令行选项：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

通过 JSON 配置：

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

将 GFM 插件传递到 `pluginsClasspath` 后，CLI 运行器将以 GFM 输出格式生成文档。

更多信息，请参阅 [Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md#generate-javadoc-documentation) 页面。

## 命令行选项

要查看所有可能的命令行选项及其详细描述，请运行：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -help
```

简要概述：

| 选项                         | 描述                                                                                                                                                                                                   |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `moduleName`                 | 项目/模块的名称。                                                                                                                                                                                      |
| `moduleVersion`              | 文档化版本。                                                                                                                                                                                           |
| `outputDir`                  | 输出目录路径，默认为 `./dokka`。                                                                                                                                                                     |
| `sourceSet`                  | Dokka 源集的配置。包含嵌套配置选项。                                                                                                                                                                 |
| `pluginsConfiguration`       | Dokka 插件的配置。                                                                                                                                                                                     |
| `pluginsClasspath`           | 包含 Dokka 插件及其依赖项的 JAR 列表。接受用分号分隔的多个路径。                                                                                                                                       |
| `offlineMode`                | 是否通过网络解析远程文件/链接。                                                                                                                                                                        |
| `failOnWarning`              | 如果 Dokka 发出警告或错误，是否使文档生成失败。                                                                                                                                                       |
| `delayTemplateSubstitution`  | 是否延迟某些元素的替换。用于多模块项目的增量构建。                                                                                                                                                    |
| `noSuppressObviousFunctions` | 是否抑制从 `kotlin.Any` 和 `java.lang.Object` 继承的明显函数。                                                                                                                                        |
| `includes`                   | 包含模块和包文档的 Markdown 文件。接受用分号分隔的多个值。                                                                                                                                            |
| `suppressInheritedMembers`   | 是否抑制给定类中未显式重写的继承成员。                                                                                                                                                                |
| `globalPackageOptions`       | 全局包配置选项列表，格式为 `"matchingRegex,-deprecated,-privateApi,+warnUndocumented,+suppress;+visibility:PUBLIC;..."`。接受用分号分隔的多个值。                                                     |
| `globalLinks`                | 全局外部文档链接，格式为 `{url}^{packageListUrl}`。接受用 `^^` 分隔的多个值。                                                                                                                          |
| `globalSrcLink`              | 源代码目录与用于浏览代码的 Web 服务之间的全局映射。接受用分号分隔的多个路径。                                                                                                                           |
| `helpSourceSet`              | 打印嵌套 `-sourceSet` 配置的帮助信息。                                                                                                                                                               |
| `loggingLevel`               | 日志级别，可能的值：`DEBUG, PROGRESS, INFO, WARN, ERROR`。                                                                                                                                             |
| `help, h`                    | 使用信息。                                                                                                                                                                                             |

#### 源集选项

要查看嵌套 `-sourceSet` 配置的命令行选项列表，请运行：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar -sourceSet -help
```

简要概述：

| 选项                         | 描述                                                                                                                                                                    |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceSetName`              | 源集的名称。                                                                                                                                                            |
| `displayName`                | 源集的显示名称，内部和外部都使用。                                                                                                                                      |
| `classpath`                  | 用于分析和交互式示例的类路径。接受用分号分隔的多个路径。                                                                                                                |
| `src`                        | 要分析和文档化的源代码根目录。接受用分号分隔的多个路径。                                                                                                                |
| `dependentSourceSets`        | 依赖源集的名称，格式为 `moduleName/sourceSetName`。接受用分号分隔的多个值。                                                                                             |
| `samples`                    | 包含示例函数的目录或文件列表。接受用分号分隔的多个路径。<anchor name="includes-cli"/>                                                                                 |
| `includes`                   | 包含 [模块和包文档](dokka-module-and-package-docs.md) 的 Markdown 文件。接受用分号分隔的多个路径。                                                                       |
| `documentedVisibilities`     | 应被文档化的可见性。接受用分号分隔的多个值。可能的值：`PUBLIC`、`PRIVATE`、`PROTECTED`、`INTERNAL`、`PACKAGE`。                                                           |
| `reportUndocumented`         | 是否报告未文档化声明。                                                                                                                                                  |
| `noSkipEmptyPackages`        | 是否为空包创建页面。                                                                                                                                                    |
| `skipDeprecated`             | 是否跳过已废弃声明。                                                                                                                                                    |
| `jdkVersion`                 | 用于链接到 JDK Javadoc 的 JDK 版本。                                                                                                                                    |
| `languageVersion`            | 用于设置分析和示例的 Kotlin 语言版本。                                                                                                                                  |
| `apiVersion`                 | 用于设置分析和示例的 Kotlin API 版本。                                                                                                                                  |
| `noStdlibLink`               | 是否生成指向 Kotlin 标准库的链接。                                                                                                                                      |
| `noJdkLink`                  | 是否生成指向 JDK Javadoc 的链接。                                                                                                                                       |
| `suppressedFiles`            | 要抑制的文件路径。接受用分号分隔的多个路径。                                                                                                                            |
| `analysisPlatform`           | 用于设置分析的平台。                                                                                                                                                    |
| `perPackageOptions`          | 包源集配置列表，格式为 `matchingRegexp,-deprecated,-privateApi,+warnUndocumented,+suppress;...`。接受用分号分隔的多个值。                                                 |
| `externalDocumentationLinks` | 外部文档链接，格式为 `{url}^{packageListUrl}`。接受用 `^^` 分隔的多个值。                                                                                                 |
| `srcLink`                    | 源代码目录与用于浏览代码的 Web 服务之间的映射。接受用分号分隔的多个路径。                                                                                               |

## JSON 配置

以下是每个配置部分的一些示例和详细描述。您还可以在页面底部找到应用了 [所有配置选项](#complete-configuration) 的示例。

### 通用配置

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "includes": [
    "module.md"
  ],
  "sourceLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "perPackageOptions": [
    { "_comment": "Options are described in a separate section" }
  ],
  "externalDocumentationLinks":  [
    { "_comment": "Options are described in a separate section" }
  ],
  "sourceSets": [
    { "_comment": "Options are described in a separate section" }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ]
}
```

<deflist collapsible="true">
    <def title="moduleName">
        <p>用于指代模块的显示名称。它用于目录、导航、日志等。</p>
        <p>默认值：<code>root</code></p>
    </def>
    <def title="moduleVersion">
        <p>模块版本。</p>
        <p>默认值：空</p>
    </def>
    <def title="outputDirectory">
        <p>生成文档的目录，无论输出格式如何。</p>
        <p>默认值：<code>./dokka</code></p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 发出警告或错误，是否使文档生成失败。
            进程会先等待所有错误和警告发出。
        </p>
        <p>此设置与 <code>reportUndocumented</code> 配合良好</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制明显函数。</p>
            如果函数符合以下条件，则被视为明显函数：
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成（由编译器生成）且没有任何文档，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制给定类中未显式重写的继承成员。</p>
        <p>
            注意：这可以抑制诸如 <code>equals</code> / <code>hashCode</code> / <code>toString</code> 之类的函数，
            但无法抑制诸如 <code>dataClass.componentN</code> 和 
            <code>dataClass.copy</code> 之类的合成函数。请使用 <code>suppressObviousFunctions</code>
            来处理。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <anchor name="includes-json"/>
        <p>是否通过您的网络解析远程文件/链接。</p>
        <p>
            这包括用于生成外部文档链接的 package-lists。 
            例如，为了使标准库中的类可点击。 
        </p>
        <p>
            将此设置为 <code>true</code> 在某些情况下可以显著加快构建时间，
            但也可能降低文档质量和用户体验。例如，通过
            不解析来自您的依赖项（包括标准库）的类/成员链接。
        </p>
        <p>
            注意：您可以在本地缓存获取的文件，并将其作为本地路径提供给
            Dokka。请参阅 <code>externalDocumentationLinks</code> 部分。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模块和包文档</a>的 Markdown 文件列表。
        </p>
        <p>指定文件的内容将被解析并嵌入到文档中作为模块和包的描述。</p>
        <p>这可以按包进行配置。</p>
    </def>
    <def title="sourceSets">
        <p>
          Kotlin 
          <a href="https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets">源集</a>的单独和额外配置。
        </p>
        <p>有关可能选项的列表，请参阅 <a href="#source-set-configuration">源集配置</a>。</p>
    </def>
    <def title="sourceLinks">
        <p>适用于所有源集的源码链接的全局配置。</p>
        <p>有关可能选项的列表，请参阅 <a href="#source-link-configuration">源码链接配置</a>。</p>
    </def>
    <def title="perPackageOptions">
        <p>无论包所在的源集如何，适用于匹配包的全局配置。</p>
        <p>有关可能选项的列表，请参阅 <a href="#per-package-configuration">每包配置</a>。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>无论其使用的源集如何，适用于外部文档链接的全局配置。</p>
        <p>有关可能选项的列表，请参阅 <a href="#external-documentation-links-configuration">外部文档链接配置</a>。</p>
    </def>
    <def title="pluginsClasspath">
        <p>包含 Dokka 插件及其依赖项的 JAR 文件列表。</p>
    </def>
</deflist>

### 源集配置

如何配置 Kotlin
[源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)：

```json
{
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks":  [
        { "_comment": "Options are described in a separate section" }
      ],
      "perPackageOptions": [
        { "_comment": "Options are described in a separate section" }
      ],
      "externalDocumentationLinks":  [
        { "_comment": "Options are described in a separate section" }
      ]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="displayName">
        <p>用于指代此源集的显示名称。</p>
        <p>
            该名称既用于外部（例如，源集名称对文档读者可见），也用于内部（例如，用于 <code>reportUndocumented</code> 的日志消息）。
        </p>
        <p>如果没有更好的替代方案，可以使用平台名称。</p>
    </def>
    <def title="sourceSetID">
        <p>源集的技术 ID</p>
    </def>
    <def title="documentedVisibilities">
        <p>应被文档化的可见性修饰符集合。</p>
        <p>
            如果想文档化 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            或者想排除 <code>public</code> 声明并只文档化内部 API，都可以使用此选项。
        </p>
        <p>这可以按包进行配置。</p>
        <p>
            可能的值：</p>
            <list>
                <li><code>PUBLIC</code></li>
                <li><code>PRIVATE</code></li>
                <li><code>PROTECTED</code></li>
                <li><code>INTERNAL</code></li>
                <li><code>PACKAGE</code></li>
            </list>
        <p>默认值：<code>PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否发出关于可见的未文档化声明的警告，即经过 <code>documentedVisibilities</code> 和其他过滤器筛选后，没有 KDoc 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以按包进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳过在应用各种过滤器后不包含任何可见声明的包。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 设置为 <code>true</code>，并且您的包只包含已废弃声明，则该包被认为是空的。
        </p>
        <p>CLI 运行器的默认值为 <code>false</code>。</p>
    </def>
    <def title="skipDeprecated">
        <p>是否文档化用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以按包进行配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="jdkVersion">
        <p>为 Java 类型生成外部文档链接时使用的 JDK 版本。</p>
        <p>
            例如，如果您在某个公共声明签名中使用 <code>java.util.UUID</code>，
            并且此选项设置为 <code>8</code>，Dokka 会为其生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a> 的外部文档链接。
        </p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 语言版本</a>，
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境。
        </p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>，
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境。
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否生成指向 Kotlin 标准库 API 参考文档的外部文档链接。
        </p>
        <p>注意：当 <code>noStdLibLink</code> 设置为 <code>false</code> 时，<b>会</b>生成链接。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>是否生成指向 JDK Javadoc 的外部文档链接。</p>
        <p>JDK Javadoc 的版本由 <code>jdkVersion</code> 选项决定。</p>
        <p>注意：当 <code>noJdkLink</code> 设置为 <code>false</code> 时，<b>会</b>生成链接。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模块和包文档</a>的 Markdown 文件列表。
        </p>
        <p>指定文件的内容将被解析并嵌入到文档中作为模块和包的描述。</p>
    </def>
    <def title="analysisPlatform">
        <p>
            用于设置代码分析和 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 环境的平台。
        </p>
        <p>
            可能的值：</p>
            <list>
                <li><code>jvm</code></li>
                <li><code>common</code></li>
                <li><code>js</code></li>
                <li><code>native</code></li>
            </list>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和文档化的源代码根目录。
            可接受的输入是目录和单个 <code>.kt</code> / <code>.java</code> 文件。
        </p>
    </def>
    <def title="classpath">
        <p>用于分析和交互式示例的类路径。</p>
        <p>如果来自依赖项的某些类型未自动解析/识别，此选项很有用。</p>
        <p>此选项接受 <code>.jar</code> 和 <code>.klib</code> 文件。</p>
    </def>
    <def title="samples">
        <p>
            包含示例函数（通过 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 标签引用）的目录或文件列表。
        </p>
    </def>
    <def title="suppressedFiles">
        <p>生成文档时要抑制的文件。</p>
    </def>
    <def title="sourceLinks">
        <p>一组仅适用于此源集的源码链接参数。</p>
        <p>有关可能选项的列表，请参阅 <a href="#source-link-configuration">源码链接配置</a>。</p>
    </def>
    <def title="perPackageOptions">
        <p>一组特定于此源集内匹配包的参数。</p>
        <p>有关可能选项的列表，请参阅 <a href="#per-package-configuration">每包配置</a>。</p>
    </def>
    <def title="externalDocumentationLinks">
        <p>一组仅适用于此源集的外部文档链接参数。</p>
        <p>有关可能选项的列表，请参阅 <a href="#external-documentation-links-configuration">外部文档链接配置</a>。</p>
    </def>
</deflist>

### 源码链接配置

`sourceLinks` 配置块允许您为每个签名添加一个 `source` 链接，该链接指向具有特定行号的 `remoteUrl`。（行号可以通过设置 `remoteLineSuffix` 来配置）。

这有助于读者找到每个声明的源代码。

例如，请参阅 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函数的文档。

您可以同时为所有源集配置源码链接，或者 [单独配置](#source-set-configuration)：

```json
{
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="localDirectory">
        <p>本地源代码目录的路径。</p>
    </def>
    <def title="remoteUrl">
        <p>
            源代码托管服务的 URL，可供文档读者访问，
            如 GitHub、GitLab、Bitbucket 等。此 URL 用于生成
            声明的源代码链接。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用于将源代码行号附加到 URL 的后缀。这有助于读者不仅导航到文件，
            还导航到声明的特定行号。
        </p>
        <p>
            数字本身将附加到指定的后缀。例如，
            如果此选项设置为 <code>#L</code> 且行号为 10，则结果 URL 后缀
            为 <code>#L10</code>。
        </p>
        <p>
            常用服务使用的后缀：</p>
            <list>
                <li>GitHub：<code>#L</code></li>
                <li>GitLab：<code>#L</code></li>
                <li>Bitbucket：<code>#lines-</code></li>
            </list>
        <p>默认值：空（无后缀）</p>
    </def>
</deflist>

### 每包配置

`perPackageOptions` 配置块允许为通过 `matchingRegex` 匹配的特定包设置一些选项。

您可以同时为所有源集添加包配置，或者 [单独添加](#source-set-configuration)：

```json
{
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "skipDeprecated": false,
      "reportUndocumented": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ]
}
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用于匹配包的正则表达式。</p>
    </def>
    <def title="suppress">
        <p>生成文档时是否应跳过此包。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否文档化用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在项目/模块级别设置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否发出关于可见的未文档化声明的警告，即经过 <code>documentedVisibilities</code> 和其他过滤器筛选后，没有 KDoc 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以在源集级别配置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>应被文档化的可见性修饰符集合。</p>
        <p>
            如果想文档化此包内的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            或者想排除 <code>public</code> 声明并只文档化内部 API，都可以使用此选项。
        </p>
        <p>可以在源集级别配置。</p>
        <p>默认值：<code>PUBLIC</code></p>
    </def>
</deflist>

### 外部文档链接配置

`externalDocumentationLinks` 块允许创建指向您的依赖项的外部托管文档的链接。

例如，如果您正在使用来自 `kotlinx.serialization` 的类型，默认情况下它们在您的文档中是不可点击的，如同未解析一样。然而，由于 `kotlinx.serialization` 的 API 参考文档是由 Dokka 构建并 [发布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，您可以为其配置外部文档链接。这样，Dokka 就可以为库中的类型生成链接，使它们成功解析并可点击。

您可以同时为所有源集配置外部文档链接，或者 [单独配置](#source-set-configuration)：

```json
{
  "externalDocumentationLinks": [
    {
      "url": "https://kotlinlang.org/api/kotlinx.serialization/",
      "packageListUrl": "https://kotlinlang.org/api/kotlinx.serialization/package-list"
    }
  ]
}
```

<deflist collapsible="true">
    <def title="url">
        <p>要链接的文档的根 URL。它<b>必须</b>包含一个尾部斜杠。</p>
        <p>
            Dokka 会尽力自动查找给定 URL 的 <code>package-list</code>，
            并将声明链接在一起。
        </p>
        <p>
            如果自动解析失败，或者您想改用本地缓存的文件，
            请考虑设置 <code>packageListUrl</code> 选项。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置。这是替代依赖 Dokka
            自动解析它的一种方式。
        </p>
        <p>
            包列表包含有关文档和项目本身的信息，
            例如模块和包名称。
        </p>
        <p>这也可以是本地缓存文件，以避免网络调用。</p>
    </def>
</deflist>

### 完整配置

下面您可以看到同时应用了所有可能配置选项的示例。

```json
{
  "moduleName": "Dokka Example",
  "moduleVersion": null,
  "outputDir": "./build/dokka/html",
  "failOnWarning": false,
  "suppressObviousFunctions": true,
  "suppressInheritedMembers": false,
  "offlineMode": false,
  "sourceLinks": [
    {
      "localDirectory": "src/main/kotlin",
      "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
      "remoteLineSuffix": "#L"
    }
  ],
  "externalDocumentationLinks": [
    {
      "url": "https://docs.oracle.com/javase/8/docs/api/",
      "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
    },
    {
      "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
      "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
    }
  ],
  "perPackageOptions": [
    {
      "matchingRegex": ".*internal.*",
      "suppress": false,
      "reportUndocumented": false,
      "skipDeprecated": false,
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
    }
  ],
  "sourceSets": [
    {
      "displayName": "jvm",
      "sourceSetID": {
        "scopeId": "moduleName",
        "sourceSetName": "main"
      },
      "dependentSourceSets": [
        {
          "scopeId": "dependentSourceSetScopeId",
          "sourceSetName": "dependentSourceSetName"
        }
      ],
      "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"],
      "reportUndocumented": false,
      "skipEmptyPackages": true,
      "skipDeprecated": false,
      "jdkVersion": 8,
      "languageVersion": "1.7",
      "apiVersion": "1.7",
      "noStdlibLink": false,
      "noJdkLink": false,
      "includes": [
        "module.md"
      ],
      "analysisPlatform": "jvm",
      "sourceRoots": [
        "/home/ignat/IdeaProjects/dokka-debug-mvn/src/main/kotlin"
      ],
      "classpath": [
        "libs/kotlin-stdlib-%kotlinVersion%.jar",
        "libs/kotlin-stdlib-common-%kotlinVersion%.jar"
      ],
      "samples": [
        "samples/basic.kt"
      ],
      "suppressedFiles": [
        "src/main/kotlin/org/jetbrains/dokka/Suppressed.kt"
      ],
      "sourceLinks": [
        {
          "localDirectory": "src/main/kotlin",
          "remoteUrl": "https://github.com/Kotlin/dokka/tree/master/src/main/kotlin",
          "remoteLineSuffix": "#L"
        }
      ],
      "externalDocumentationLinks": [
        {
          "url": "https://docs.oracle.com/javase/8/docs/api/",
          "packageListUrl": "https://docs.oracle.com/javase/8/docs/api/package-list"
        },
        {
          "url": "https://kotlinlang.org/api/core/kotlin-stdlib/",
          "packageListUrl": "https://kotlinlang.org/api/core/kotlin-stdlib/package-list"
        }
      ],
      "perPackageOptions": [
        {
          "matchingRegex": ".*internal.*",
          "suppress": false,
          "reportUndocumented": false,
          "skipDeprecated": false,
          "documentedVisibilities": ["PUBLIC", "PRIVATE", "PROTECTED", "INTERNAL", "PACKAGE"]
        }
      ]
    }
  ],
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "./kotlinx-html-jvm-0.8.0.jar",
    "./analysis-kotlin-descriptors-%dokkaVersion%.jar",
    "./freemarker-2.3.31.jar"
  ],
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"separateInheritedMembers\":false,\"footerMessage\":\"© 2021 pretty good Copyright\"}"
    }
  ],
  "includes": [
    "module.md"
  ]
}
```