[//]: # (title: HTML)

> 本指南适用于 Dokka Gradle 插件 (DGP) v2 模式。不再支持 DGP v1 模式。
> 如需从 v1 升级到 v2 模式，请参阅[迁移指南](dokka-migration.md)。
>
{style="note"}

HTML 是 Dokka 默认且推荐的输出格式。
它提供对 Kotlin 多平台、Android 和 Java 项目的支持。
此外，您可以使用 HTML 格式为单项目和多项目构建编写文档。

有关 HTML 输出格式的示例，请查看以下文档：
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## 生成 HTML 文档

所有运行器都支持将 HTML 作为输出格式。要生成 HTML 文档，请根据您的构建工具或运行器执行以下步骤：

* 对于 [Gradle](dokka-gradle.md#generate-documentation)，您可以运行以下任务： 
  * `dokkaGenerate`：[基于所应用的插件](dokka-gradle.md#configure-documentation-output-format)以所有可用格式生成文档。这是大多数用户的推荐任务。在 IntelliJ IDEA 中使用此任务时，它会记录一个指向输出的可点击链接。
  * `dokkaGeneratePublicationHtml`：仅以 HTML 格式生成文档。此任务将输出目录公开为 `@OutputDirectory`。当您需要在其他 Gradle 任务中使用生成的文档时（例如将其上传到服务器、移动到 GitHub Pages 目录或打包到 `javadoc.jar` 中），请使用此任务。此任务故意未列在 Gradle 任务组中，因为它不适用于日常使用。

    > 如果您使用的是 IntelliJ IDEA，您可能会看到 `dokkaGenerateHtml` Gradle 任务。此任务只是 `dokkaGeneratePublicationHtml` 的别名。这两个任务执行的操作完全相同。
    >
    {style="tip"}

* 对于 [Maven](dokka-maven.md#generate-documentation)，请运行 `dokka:dokka` 目标。
* 对于 [CLI 运行器](dokka-cli.md#generate-documentation)，请在设置 HTML 依赖项的情况下运行。

> 此格式生成的 HTML 页面需要托管在 Web 服务器上才能正确渲染所有内容。
>
> 您可以使用任何免费的静态网站托管服务，例如 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
>
> 在本地，您可以使用[内置的 IntelliJ Web 服务器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)。
>
{style="note"}

## 配置

HTML 格式是 Dokka 的基础格式。您可以使用以下选项对其进行配置：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
        separateInheritedMembers.set(false)
        templatesDir.set(file("dokka/templates"))
        mergeImplicitExpectActualDeclarations.set(false)
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// build.gradle

dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
            separateInheritedMembers.set(false)
            templatesDir.set(file("dokka/templates"))
            mergeImplicitExpectActualDeclarations.set(false)
        }
    }
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
            <!-- 完全限定插件名称 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 按名称排列的选项 -->
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

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

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

下表包含了所有可能的配置选项及其用途：

| **选项**                              | **描述**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 要随文档一起打包的图像资源路径列表。图像资源可以具有任何文件扩展名。有关更多信息，请参阅[自定义资源](#customize-assets)。                                                                                                             |
| `customStyleSheets`                     | 要随文档一起打包并用于渲染的 `.css` 样式表路径列表。有关更多信息，请参阅[自定义样式](#customize-styles)。                                                                                                                              |
| `templatesDir`                          | 包含自定义 HTML 模板的目录路径。有关更多信息，请参阅[模板](#templates)。                                                                                                                                                                                    |
| `footerMessage`                         | 页脚中显示的文本。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 这是一个布尔选项。如果设置为 `true`，Dokka 将分别渲染属性/函数和继承的属性/继承的函数。默认情况下此选项已禁用。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 这是一个布尔选项。如果设置为 `true`，Dokka 将合并未声明为 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html) 但具有相同完全限定名称的声明。这对于旧代码库很有用。默认情况下此选项已禁用。 |

有关配置 Dokka 插件的更多信息，请参阅[配置 Dokka 插件](dokka-plugins.md#configure-dokka-plugins)。

## 自定义

为了帮助您为文档添加自己的视觉风格，HTML 格式支持许多自定义选项。

### 自定义样式

您可以通过使用 `customStyleSheets` [配置选项](#configuration)来使用自己的样式表。这些样式表将应用于每个页面。

还可以通过提供同名文件来覆盖 Dokka 的默认样式表：

| **样式表名称**  | **描述**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 主样式表，包含所有页面中使用的大部分样式 |
| `logo-styles.css`    | 页眉徽标样式                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 语法高亮程序的样式      |

Dokka 所有样式表的源代码都可以在 [GitHub 上找到](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)。

### 自定义资源

您可以通过使用 `customAssets` [配置选项](#configuration)来提供随文档一起打包的自定义图像。

这些文件将被复制到 `<output>/images` 目录。

您可以将 `customAssets` 属性与文件集合 ([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)) 一起使用：

```kotlin
customAssets.from("example.png", "example2.png")
```

可以通过提供同名文件来覆盖 Dokka 的图像和图标。其中最有用且相关的是 `logo-icon.svg`，它是页眉中使用的图像。其余大部分是图标。

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images) 上找到 Dokka 使用的所有图像。

### 更改徽标

要自定义徽标，您可以首先为 `logo-icon.svg` [提供您自己的资源](#customize-assets)。

如果您不喜欢它的外观，或者想使用 `.png` 文件而不是默认的 `.svg` 文件，您可以[覆盖 `logo-styles.css` 样式表](#customize-styles)来对其进行自定义。

有关如何执行此操作的示例，请参阅我们的[自定义格式示例项目](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)。

支持的最大徽标尺寸为宽度 120 像素，高度 36 像素。如果您使用更大的图像，它将被自动调整大小。

### 修改页脚

您可以通过使用 `footerMessage` [配置选项](#configuration)来修改页脚中的文本。

### 模板

Dokka 提供了修改用于生成文档页面的 [FreeMarker](https://freemarker.apache.org/) 模板的能力。

您可以完全更改页眉、添加自己的横幅/菜单/搜索、加载分析、更改主体样式等。

Dokka 使用以下模板：

| **模板**                       | **描述**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 定义要渲染的所有页面的通用设计。                                                               |
| `includes/header.ftl`              | 默认包含徽标、版本、源集选择器、亮/暗主题切换和搜索的页面页眉。 |
| `includes/footer.ftl`              | 包含 `footerMessage` [配置选项](#configuration)和版权信息的页面页脚。               |
| `includes/page_metadata.ftl`       | 在 `<head>` 容器中使用的元数据。                                                                              |
| `includes/source_set_selector.ftl` | 页眉中的[源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)选择器。 |

基础模板是 `base.ftl`，它包含了所有列出的其余模板。
您可以在 [GitHub 上](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates)找到 Dokka 所有模板的源代码。

您可以使用 `templatesDir` [配置选项](#configuration)覆盖任何模板。Dokka 会在给定目录中搜索确切的模板名称。如果找不到用户定义的模板，它将使用默认模板。

#### 变量

以下变量在所有模板中均可用：

| **变量**       | **描述**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 页面名称                                                                                                                                                                                      |
| `${footerMessage}` | 由 `footerMessage` [配置选项](#configuration)设置的文本                                                                                                                |
| `${sourceSets}`    | 用于多平台页面的[源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)的可空列表。每个项目都具有 `name`、`platform` 和 `filter` 属性。 |
| `${projectName}`   | 项目名称。它仅在 `template_cmd` 指令中可用。                                                                                                                         |
| `${pathToRoot}`    | 从当前页面到根目录的路径。它对于定位资源非常有用，且仅在 `template_cmd` 指令中可用。                                                                 |

变量 `projectName` 和 `pathToRoot` 仅在 `template_cmd` 指令中可用，因为它们需要更多上下文，因此需要在后期阶段进行解析：

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### 指令

您还可以使用以下 Dokka 定义的[指令](https://freemarker.apache.org/docs/ref_directive_userDefined.html)：

| **变量**    | **描述**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 页面主体内容。                                                                                                                                                                                                |
| `<@resources/>` | 脚本和样式表等资源。                                                                                                                                                                            |
| `<@version/>`   | 从配置中获取的子项目版本。如果应用了[版本控制插件](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)，它将被替换为版本导航器。 |