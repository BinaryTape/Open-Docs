[//]: # (title: HTML)

HTML 是 Dokka 預設且推薦的輸出格式。它目前處於 Beta 階段，即將迎來穩定版發布。

您可以透過瀏覽 [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/) 的文件來查看輸出範例。

## 產生 HTML 文件

HTML 作為一種輸出格式，所有執行器 (runners) 都支援。要產生 HTML 文件，請根據您的建置工具或執行器遵循以下步驟：

*   對於 [Gradle](dokka-gradle.md#generate-documentation)，執行 `dokkaHtml` 或 `dokkaHtmlMultiModule` 任務。
*   對於 [Maven](dokka-maven.md#generate-documentation)，執行 `dokka:dokka` 目標。
*   對於 [CLI 執行器](dokka-cli.md#generate-documentation)，在設定 HTML 依賴項 (dependencies) 的情況下執行。

> 由此格式產生的 HTML 頁面需要託管在網頁伺服器上，才能正確呈現所有內容。
>
> 您可以使用任何免費的靜態網站託管服務，例如 [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
>
> 在本地，您可以使用 [IntelliJ 內建的網頁伺服器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)。
>
{style="note"}

## 配置

HTML 格式是 Dokka 的基本格式，因此可以透過 `DokkaBase` 和 `DokkaBaseConfiguration` 類別進行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

透過型別安全的 Kotlin DSL：

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
| `customAssets`                          | 用於與文件捆綁的影像資產路徑清單。影像資產可以具有任何檔案副檔名。如需更多資訊，請參閱[自訂資產](#customize-assets)。                                                                                                             |
| `customStyleSheets`                     | 用於與文件捆綁並用於呈現的 `.css` 樣式表路徑清單。如需更多資訊，請參閱[自訂樣式](#customize-styles)。                                                                                                                              |
| `templatesDir`                          | 包含自訂 HTML 範本的目錄路徑。如需更多資訊，請參閱[範本](#templates)。                                                                                                                                                     |
| `footerMessage`                         | 顯示在頁腳的文字。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 這是一個布林選項。如果設定為 `true`，Dokka 會分別呈現屬性/函式 (properties/functions) 和繼承屬性/繼承函式 (inherited properties/inherited functions)。此選項預設為停用。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 這是一個布林選項。如果設定為 `true`，Dokka 會合併那些未宣告為 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)，但具有相同完整限定名稱的宣告。這對於傳統程式碼庫 (legacy codebases) 可能很有用。此選項預設為停用。 |

如需更多關於配置 Dokka 外掛的資訊，請參閱[配置 Dokka 外掛](dokka-plugins.md#configure-dokka-plugins)。

## 自訂

為了幫助您為文件加入獨特的外觀和風格，HTML 格式支援多種自訂選項。

### 自訂樣式

您可以透過使用 `customStyleSheets` [配置選項](#configuration) 來使用自己的樣式表。這些樣式表會應用於每個頁面。

也可以透過提供同名檔案來覆寫 Dokka 的預設樣式表：

| **樣式表名稱**  | **描述**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 主要樣式表，包含所有頁面使用的大部分樣式。 |
| `logo-styles.css`    | 頁首標誌樣式。                                                |
| `prism.css`          | 用於 [PrismJS](https://prismjs.com/) 語法高亮器的樣式。      |

所有 Dokka 樣式表的原始碼都可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles) 上找到。

### 自訂資產

您可以透過使用 `customAssets` [配置選項](#configuration) 來提供自己的影像以與文件捆綁。

這些檔案會複製到 `<output>/images` 目錄。

可以透過提供同名檔案來覆寫 Dokka 的影像和圖示。其中最有用且相關的是 `logo-icon.svg`，這是頁首使用的影像。其餘大部分是圖示。

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images) 上找到 Dokka 使用的所有影像。

### 更改標誌

要自訂標誌，您可以從為 `logo-icon.svg` [提供自己的資產](#customize-assets) 開始。

如果您不喜歡它的外觀，或者想使用 `.png` 檔案而不是預設的 `.svg` 檔案，您可以[覆寫 `logo-styles.css` 樣式表](#customize-styles) 來進行自訂。

有關如何操作的範例，請參閱我們的[自訂格式範例專案](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)。

支援的最大標誌尺寸為寬度 120 像素、高度 36 像素。如果您使用更大的影像，它將會自動調整大小。

### 修改頁腳

您可以透過使用 `footerMessage` [配置選項](#configuration) 來修改頁腳中的文字。

### 範本

Dokka 提供了修改用於產生文件頁面的 [FreeMarker](https://freemarker.apache.org/) 範本的能力。

您可以完全更改頁首、添加自己的橫幅/選單/搜尋、載入分析、更改主體樣式等等。

Dokka 使用以下範本：

| **範本**                       | **描述**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 定義所有要呈現頁面的通用設計。                                                               |
| `includes/header.ftl`              | 頁面標頭，預設包含標誌、版本、來源集選取器、淺色/深色主題切換以及搜尋。 |
| `includes/footer.ftl`              | 頁面頁腳，包含 `footerMessage` [配置選項](#configuration) 和版權。               |
| `includes/page_metadata.ftl`       | 在 `<head>` 容器中使用的中繼資料。                                                                              |
| `includes/source_set_selector.ftl` | 頁首中的[來源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)選取器。 |

基礎範本是 `base.ftl`，它包含了所有其餘列出的範本。您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates) 上找到所有 Dokka 範本的原始碼。

您可以透過使用 `templatesDir` [配置選項](#configuration) 來覆寫任何範本。Dokka 會在給定目錄中搜尋確切的範本名稱。如果找不到使用者定義的範本，它會使用預設範本。

#### 變數

以下變數在所有範本中都可用：

| **變數**       | **描述**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 頁面名稱。                                                                                                                                                                                      |
| `${footerMessage}` | 由 `footerMessage` [配置選項](#configuration) 設定的文字。                                                                                                                |
| `${sourceSets}`    | 多平台頁面的[來源集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 可空列表。每個項目都具有 `name`、`platform` 和 `filter` 屬性。 |
| `${projectName}`   | 專案名稱。它僅在 `template_cmd` 指令內可用。                                                                                                                         |
| `${pathToRoot}`    | 從目前頁面到根目錄的路徑。這對於定位資產很有用，並且僅在 `template_cmd` 指令內可用。                                                                                                                               |

變數 `projectName` 和 `pathToRoot` 僅在 `template_cmd` 指令內可用，因為它們需要更多上下文，因此需要在稍後階段由 [MultiModule](dokka-gradle.md#multi-project-builds) 任務解析：

```html
<@template_cmd name="projectName">
   <span>${projectName}</span>
</@template_cmd>
```

#### 指令

您還可以使用以下 Dokka 定義的[指令](https://freemarker.apache.org/docs/ref_directive_userDefined.html)：

| **變數**    | **描述**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 主要頁面內容。                                                                                                                                                                                                |
| `<@resources/>` | 資源，例如腳本和樣式表。                                                                                                                                                                            |
| `<@version/>`   | 從配置中取得的模組版本。如果應用了[版本控制外掛](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)，它將被版本導航器取代。 |