[//]: # (title: HTML)

HTML 是 Dokka 預設且推薦的輸出格式。它目前處於 Beta 版，並正接近穩定版發佈。

您可以透過瀏覽 [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/) 的文件來查看輸出範例。

## 生成 HTML 文件

HTML 作為輸出格式受到所有執行器支援。要生成 HTML 文件，請根據您的建構工具或執行器遵循以下步驟：

*   對於 [Gradle](dokka-gradle.md#generate-documentation)，執行 `dokkaHtml` 或 `dokkaHtmlMultiModule` 任務。

    > 這些指示反映了 Dokka Gradle 外掛程式 v1 的配置和任務。從 Dokka 2.0.0 開始，[用於生成文件的 Gradle 任務已變更](dokka-migration.md#generate-documentation-with-the-updated-task)。
    >
    > 如需更多詳細資訊和 Dokka Gradle 外掛程式 v2 中的完整變更清單，請參閱[遷移指南](dokka-migration.md)。
    >
    {style="note"}

*   對於 [Maven](dokka-maven.md#generate-documentation)，執行 `dokka:dokka` 目標。
*   對於 [CLI 執行器](dokka-cli.md#generate-documentation)，設定 HTML 依賴項後執行。

> 透過此格式生成的 HTML 頁面需要託管在網頁伺服器上，才能正確呈現所有內容。
>
> 您可以使用任何免費的靜態網站託管服務，例如
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
>
> 在本機上，您可以使用 [IntelliJ 內建的網頁伺服器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)。
>
{style="note"}

## 配置

HTML 格式是 Dokka 的基礎格式，因此可以透過 `DokkaBase` 和 `DokkaBaseConfiguration` 類別進行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

透過型別安全 Kotlin DSL：

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

透過 JSON：

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

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

透過 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

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

### 配置選項

下表包含所有可能的配置選項及其用途。

| **選項**                              | **描述**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 文件中要捆綁的圖像資產路徑列表。圖像資產可以具有任何檔案擴展名。更多資訊請參閱 [自訂資產](#customize-assets)。                                                                                                             |
| `customStyleSheets`                     | 文件中要捆綁並用於渲染的 `.css` 樣式表路徑列表。更多資訊請參閱 [自訂樣式](#customize-styles)。                                                                                                                              |
| `templatesDir`                          | 包含自訂 HTML 模板的目錄路徑。更多資訊請參閱 [模板](#templates)。                                                                                                                                                     |
| `footerMessage`                         | 顯示在頁尾的文字。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 這是一個布林選項。如果設定為 `true`，Dokka 會將屬性/函數和繼承的屬性/繼承的函數分開渲染。此選項預設為停用。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 這是一個布林選項。如果設定為 `true`，Dokka 會合併未宣告為 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html) 但具有相同完整限定名稱的宣告。這對於舊版程式碼庫可能很有用。此選項預設為停用。 |

有關配置 Dokka 外掛程式的更多資訊，請參閱 [配置 Dokka 外掛程式](dokka-plugins.md#configure-dokka-plugins)。

## 自訂

為了幫助您為文件添加自己的外觀和風格，HTML 格式支援多種自訂選項。

### 自訂樣式

您可以使用 `customStyleSheets` [配置選項](#configuration) 來使用您自己的樣式表。這些樣式表會應用於每個頁面。

也可以透過提供同名檔案來覆寫 Dokka 的預設樣式表：

| **樣式表名稱**  | **描述**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 主要樣式表，包含所有頁面中使用的大部分樣式 |
| `logo-styles.css`    | 頁首標誌樣式設定                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 語法高亮器的樣式      |

所有 Dokka 樣式表的原始碼都可以在 [GitHub 上找到](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)。

### 自訂資產

您可以使用 `customAssets` [配置選項](#configuration) 來提供您自己的圖像以捆綁到文件中。

這些檔案會被複製到 `<output>/images` 目錄。

可以透過提供同名檔案來覆寫 Dokka 的圖像和圖示。其中最有用且相關的是 `logo-icon.svg`，這是頁首中使用的圖像。其餘大部分是圖示。

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images) 上找到 Dokka 使用的所有圖像。

### 更改標誌

要自訂標誌，您可以從為 `logo-icon.svg` [提供您自己的資產](#customize-assets) 開始。

如果您不喜歡它的外觀，或者想使用 `.png` 檔案而不是預設的 `.svg` 檔案，您可以 [覆寫 `logo-styles.css` 樣式表](#customize-styles) 來進行自訂。

有關如何執行此操作的範例，請參閱我們的 [自訂格式範例專案](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)。

支援的最大標誌尺寸為寬 120 像素、高 36 像素。如果您使用更大的圖像，它將會自動調整大小。

### 修改頁尾

您可以使用 `footerMessage` [配置選項](#configuration) 來修改頁尾的文字。

### 模板

Dokka 提供了修改用於生成文件頁面的 [FreeMarker](https://freemarker.apache.org/) 模板的功能。

您可以完全更改頁首、添加您自己的橫幅/菜單/搜尋、載入分析、更改主體樣式等等。

Dokka 使用以下模板：

| **模板**                       | **描述**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 定義所有要渲染頁面的總體設計。                                                               |
| `includes/header.ftl`              | 頁面頁首，預設包含標誌、版本、原始碼集選擇器、淺色/深色主題切換和搜尋。 |
| `includes/footer.ftl`              | 頁面頁尾，包含 `footerMessage` [配置選項](#configuration) 和版權資訊。               |
| `includes/page_metadata.ftl`       | 用於 `<head>` 容器內的元資料。                                                                              |
| `includes/source_set_selector.ftl` | 頁首中的 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 選擇器。 |

基礎模板是 `base.ftl`，它包含所有列出的其餘模板。您可以在 [GitHub 上找到](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates) 所有 Dokka 模板的原始碼。

您可以使用 `templatesDir` [配置選項](#configuration) 覆寫任何模板。Dokka 會在給定目錄中搜尋確切的模板名稱。如果找不到使用者定義的模板，它將使用預設模板。

#### 變數

以下變數在所有模板中可用：

| **變數**       | **描述**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 頁面名稱                                                                                                                                                                                      |
| `${footerMessage}` | 由 `footerMessage` [配置選項](#configuration) 設定的文字                                                                                                                                               |
| `${sourceSets}`    | 用於多平台頁面的 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 可空列表。每個項目都有 `name`、`platform` 和 `filter` 屬性。 |
| `${projectName}`   | 專案名稱。它僅在 `template_cmd` 指令內可用。                                                                                                                         |
| `${pathToRoot}`    | 從當前頁面到根目錄的路徑。這對於定位資產很有用，並且僅在 `template_cmd` 指令內可用。                                                                                                                               |

變數 `projectName` 和 `pathToRoot` 僅在 `template_cmd` 指令內可用，因為它們需要更多上下文，因此需要由 [MultiModule](dokka-gradle.md#multi-project-builds) 任務在稍後階段解析：

```html
<@template_cmd name="projectName">
   <span>${projectName}</span>
</@template_cmd>
```

#### 指令

您還可以使用以下 Dokka 定義的 [指令](https://freemarker.apache.org/docs/ref_directive_userDefined.html)：

| **變數**    | **描述**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 主要頁面內容。                                                                                                                                                                                                |
| `<@resources/>` | 資源，例如腳本和樣式表。                                                                                                                                                                            |
| `<@version/>`   | 從配置中獲取的模組版本。如果應用了 [版本控制外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning) 是被版本導覽器替換。 |