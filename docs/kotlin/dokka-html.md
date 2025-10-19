[//]: # (title: HTML)

HTML 是 Dokka 的默认推荐输出格式。它目前处于 Beta 版，并且正在接近稳定版发布。

你可以浏览 [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/) 的文档来查看输出示例。

## 生成 HTML 文档

HTML 作为输出格式受到所有运行器的支持。要生成 HTML 文档，请根据你使用的构建工具或运行器执行以下步骤：

* 对于 [Gradle](dokka-gradle.md#generate-documentation)，运行 `dokkaHtml` 或 `dokkaHtmlMultiModule` 任务。

  > 从 Dokka 2.0.0 开始，[生成文档的 Gradle 任务已更改](dokka-migration.md#generate-documentation-with-the-updated-task)。
  >
  > 有关更多详细信息和完整更改列表，请参见[迁移指南](dokka-migration.md)。
  >
  {style="note"}

* 对于 [Maven](dokka-maven.md#generate-documentation)，运行 `dokka:dokka` 目标。
* 对于 [CLI runner](dokka-cli.md#generate-documentation)，运行并设置 HTML 依赖项。

> 通过此格式生成的 HTML 页面需要托管在 Web 服务器上才能正确渲染所有内容。
>
> 你可以使用任何免费的静态网站托管服务，例如 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
>
> 在本地，你可以使用 [IntelliJ 内置 Web 服务器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)。
>
{style="note"}

## 配置

HTML 格式是 Dokka 的基础格式，因此可以通过 `DokkaBase` 和 `DokkaBaseConfiguration` 类进行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

通过类型安全的 Kotlin DSL：

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
        separateInheritedMembers = false
        templatesDir = file("dokka/templates")
        mergeImplicitExpectActualDeclarations = false
    }
}
```

通过 JSON：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg",
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // fully qualified plugin name to json configuration
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
            // fully qualified plugin name to json configuration
            ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- Fully qualified plugin name -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- Options by name -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
                <separateInheritedMembers>false</separateInheritedMembers>
                <templatesDir>${project.basedir}/dokka/templates</templatesDir>
                <mergeImplicitExpectActualDeclarations>false</mergeImplicitExpectActualDeclarations>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

通过[命令行选项](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

通过[JSON 配置](dokka-cli.md#run-with-json-configuration)：

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}"
    }
  ]
}
```

</tab>
</tabs>

### 配置选项

下表包含所有可能的配置选项及其用途。

| **选项**                              | **描述**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 要与文档捆绑的图像资源路径列表。图像资源可以有任何文件扩展名。有关更多信息，请参阅[自定义资源](#customize-assets)。                                                                                                             |
| `customStyleSheets`                     | 要与文档捆绑并用于渲染的 `.css` 样式表的路径列表。有关更多信息，请参阅[自定义样式](#customize-styles)。                                                                                                                              |
| `templatesDir`                          | 包含自定义 HTML 模板的目录路径。有关更多信息，请参阅[模板](#templates)。                                                                                                                                                     |
| `footerMessage`                         | 显示在页脚中的文本。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 这是一个布尔选项。如果设置为 `true`，Dokka 会单独渲染属性/函数和继承的属性/继承的函数。默认情况下此选项禁用。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 这是一个布尔选项。如果设置为 `true`，Dokka 会合并那些未声明为 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html) 但具有相同完全限定名的声明。这对于遗留代码库可能很有用。默认情况下此选项禁用。 |

关于配置 Dokka 插件，请参见[配置 Dokka 插件](dokka-plugins.md#configure-dokka-plugins)。

## 自定义

为了帮助你为文档添加自己的外观和风格，HTML 格式支持多种自定义选项。

### 自定义样式

你可以使用 `customStyleSheets` [配置选项](#configuration)来使用你自己的样式表。这些样式会应用于每个页面。

也可以通过提供同名文件来覆盖 Dokka 的默认样式表：

| **样式表名称**  | **描述**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 主样式表，包含所有页面中使用的大部分样式 |
| `logo-styles.css`    | 页眉 Logo 样式                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 语法高亮器的样式      |

Dokka 所有样式表的源代码[在 GitHub 上可用](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)。

### 自定义资源

你可以使用 `customAssets` [配置选项](#configuration)来提供你自己的图片以与文档捆绑。

这些文件会复制到 `<output>/images` 目录。

也可以通过提供同名文件来覆盖 Dokka 的图片和图标。其中最有用和相关的是 `logo-icon.svg`，它是页眉中使用的图片。其余大部分是图标。

你可以在[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images)上找到 Dokka 使用的所有图片。

### 更改 Logo

要自定义 Logo，你可以首先为 `logo-icon.svg` [提供你自己的资源](#customize-assets)。

如果你不喜欢它的外观，或者你想使用 `.png` 文件而不是默认的 `.svg` 文件，你可以[覆盖 `logo-styles.css` 样式表](#customize-styles)来对其进行自定义。

关于如何执行此操作的示例，请参见我们的[自定义格式示例项目](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)。

支持的最大 Logo 尺寸为宽度 120 像素，高度 36 像素。如果你使用更大的图片，它将自动调整大小。

### 修改页脚

你可以使用 `footerMessage` [配置选项](#configuration)来修改页脚中的文本。

### 模板

Dokka 提供了修改用于生成文档页面的 [FreeMarker](https://freemarker.apache.org/) 模板的能力。

你可以完全更改页眉，添加你自己的横幅/菜单/搜索，加载分析，更改正文样式等等。

Dokka 使用以下模板：

| **模板**                       | **描述**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 定义所有要渲染页面的总体设计。                                                               |
| `includes/header.ftl`              | 默认包含 Logo、版本、源代码集选择器、亮/暗主题切换和搜索的页面页眉。 |
| `includes/footer.ftl`              | 包含 `footerMessage` [配置选项](#configuration)和版权的页面页脚。               |
| `includes/page_metadata.ftl`       | `<head>` 容器中使用的元数据。                                                                              |
| `includes/source_set_selector.ftl` | 页眉中的[源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)选择器。 |

基础模板是 `base.ftl`，它包含了所有剩余的列出的模板。你可以在[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates)上找到 Dokka 所有模板的源代码。

你可以使用 `templatesDir` [配置选项](#configuration)来覆盖任何模板。Dokka 会在给定目录中搜索完全匹配的模板名称。如果未能找到用户定义的模板，它将使用默认模板。

#### 变量

所有模板中都可以使用以下变量：

| **变量**       | **描述**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 页面名称                                                                                                                                                                                      |
| `${footerMessage}` | 由 `footerMessage` [配置选项](#configuration)设置的文本                                                                                                                |
| `${sourceSets}`    | 用于多平台页面的[源代码集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)的可空 list。每个项都具有 `name`、`platform` 和 `filter` 属性。 |
| `${projectName}`   | 项目名称。它仅在 `template_cmd` 指令中可用。                                                                                                                         |
| `${pathToRoot}`    | 从当前页面到根目录的路径。它对于定位资源很有用，并且仅在 `template_cmd` 指令中可用。                                                                 |

变量 `projectName` 和 `pathToRoot` 仅在 `template_cmd` 指令中可用，因为它们需要更多上下文，因此需要由 [MultiModule](dokka-gradle.md#multi-project-builds) 任务在后期阶段解析：

```html
<@template_cmd name="projectName">
   <span>${projectName}</span>
</@template_cmd>
```

#### 指令

你还可以使用以下 Dokka 定义的[指令](https://freemarker.apache.org/docs/ref_directive_userDefined.html)：

| **变量**    | **描述**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 主要页面内容。                                                                                                                                                                                                |
| `<@resources/>` | 脚本和样式表等资源。                                                                                                                                                                            |
| `<@version/>`   | 从配置中获取的模块版本。如果应用了[版本化插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)，它将被版本导航器替换。 |