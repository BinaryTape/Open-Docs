[//]: # (title: HTML)

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再支援。
> 若要從 v1 升級至 v2 模式，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

HTML 是 Dokka 預設且建議的輸出格式。
它提供對 Kotlin Multiplatform、Android 及 Java 專案的支援。
此外，您可以使用 HTML 格式為單一及多專案組建編寫文件。

如需 HTML 輸出格式的範例，請查看以下文件：
* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)
* [Gradle](https://docs.gradle.org/current/kotlin-dsl/index.html)

## 產生 HTML 文件

所有執行器都支援 HTML 作為輸出格式。要產生 HTML 文件，請根據您的建置工具或執行器遵循以下步驟：

* 對於 [Gradle](dokka-gradle.md#generate-documentation)，您可以執行以下任務：
  * `dokkaGenerate`：根據 [已套用的外掛程式，以所有可用的格式產生文件](dokka-gradle.md#configure-documentation-output-format)。
      這是對大多數使用者建議的任務。在 IntelliJ IDEA 中使用此任務時，它會記錄一個可點擊的輸出連結。
  * `dokkaGeneratePublicationHtml`：僅以 HTML 格式產生文件。此任務將輸出目錄公開為 `@OutputDirectory`。
    當您需要在其他 Gradle 任務中使用產生的檔案時（例如將它們上傳到伺服器、移動到 GitHub Pages 目錄或將它們封裝到 `javadoc.jar` 中），請使用此任務。
    此任務刻意未列在 Gradle 任務群組中，因為它不適合日常使用。

    > 如果您使用的是 IntelliJ IDEA，您可能會看到 `dokkaGenerateHtml` Gradle 任務。
    > 此任務只是 `dokkaGeneratePublicationHtml` 的別名。這兩個任務執行的操作完全相同。
    >
    {style="tip"}

* 對於 [Maven](dokka-maven.md#generate-documentation)，執行 `dokka:dokka` 目標。
* 對於 [CLI 執行器](dokka-cli.md#generate-documentation)，請在設定 HTML 相依性的情況下執行。

> 透過此格式產生的 HTML 頁面需要託管在 Web 伺服器上，才能正確渲染所有內容。
>
> 您可以使用任何免費的靜態網站代管服務，例如
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)。
>
> 在本機，您可以使用 [內建的 IntelliJ Web 伺服器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html)。
>
{style="note"}

## 配置

HTML 格式是 Dokka 的基本格式。您可以使用以下選項進行配置：

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

下表包含了所有可能的配置選項及其用途：

| **選項**                              | **描述**                                                                                                                                                                                                                                                                               |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 要與文件綑綁的圖片資源路徑清單。圖片資源可以有任何副檔名。如需更多資訊，請參閱 [自訂資源](#customize-assets)。                                                                                                             |
| `customStyleSheets`                     | 要與文件綑綁並用於渲染的 `.css` 樣式表路徑清單。如需更多資訊，請參閱 [自訂樣式](#customize-styles)。                                                                                                                              |
| `templatesDir`                          | 包含自訂 HTML 範本的目錄路徑。如需更多資訊，請參閱 [範本](#templates)。                                                                                                                                                                                    |
| `footerMessage`                         | 顯示在頁尾的文字。                                                                                                                                                                                                                                                             |
| `separateInheritedMembers`              | 這是一個布林選項。如果設定為 `true`，Dokka 會分別渲染屬性／函式以及繼承的屬性／繼承的函式。此選項預設為停用。                                                                                                                          |
| `mergeImplicitExpectActualDeclarations` | 這是一個布林選項。如果設定為 `true`，Dokka 會合併那些未被宣告為 [expect/actual](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)，但具有相同完全限定名稱的宣告。這對於舊有程式碼庫非常有用。此選項預設為停用。 |

如需更多關於配置 Dokka 外掛程式的資訊，請參閱 [配置 Dokka 外掛程式](dokka-plugins.md#configure-dokka-plugins)。

## 自訂

為了協助您為文件添加自己的外觀與風格，HTML 格式支援多種自訂選項。

### 自訂樣式

您可以使用 `customStyleSheets` [配置選項](#configuration) 來使用自己的樣式表。這些樣式表會套用到每個頁面。

也可以透過提供同名檔案來覆蓋 Dokka 的預設樣式表：

| **樣式表名稱**  | **描述**                                                    |
|----------------------|--------------------------------------------------------------------|
| `style.css`          | 主要樣式表，包含跨所有頁面使用的大部分樣式 |
| `logo-styles.css`    | 頁首標誌樣式                                                |
| `prism.css`          | [PrismJS](https://prismjs.com/) 語法高亮顯示的樣式      |

所有 Dokka 樣式表的原始碼都可以在 [GitHub 上取得](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles)。

### 自訂資源

您可以使用 `customAssets` [配置選項](#configuration) 來提供要與文件綑綁的自有圖片。

這些檔案會被複製到 `<output>/images` 目錄中。

您可以將 `customAssets` 屬性與檔案集合 ([`FileCollection`](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)) 一起使用：

```kotlin
customAssets.from("example.png", "example2.png")
```

可以透過提供同名檔案來覆蓋 Dokka 的圖片和圖示。其中最有用且最相關的是 `logo-icon.svg`，它是頁首中使用的圖片。其餘的大多是圖示。

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images) 上找到 Dokka 使用的所有圖片。

### 更改標誌

要自訂標誌，您可以從為 `logo-icon.svg` [提供您自己的資源](#customize-assets) 開始。

如果您不喜歡它的外觀，或者想使用 `.png` 檔案而不是預設的 `.svg` 檔案，您可以 [覆蓋 `logo-styles.css` 樣式表](#customize-styles) 來對其進行自訂。

有關如何執行此操作的範例，請參閱我們的 [自訂格式範例專案](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example)。

支援的最大標誌尺寸為寬度 120 像素，高度 36 像素。如果您使用更大的圖片，它將被自動調整大小。

### 修改頁尾

您可以使用 `footerMessage` [配置選項](#configuration) 來修改頁尾中的文字。

### 範本

Dokka 提供了修改用於產生文件頁面的 [FreeMarker](https://freemarker.apache.org/) 範本的功能。

您可以完全更改頁首、添加自己的橫幅／功能表／搜尋、載入分析、更改主體樣式等等。

Dokka 使用以下範本：

| **範本**                       | **描述**                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| `base.ftl`                         | 定義要渲染之所有頁面的一般設計。                                                               |
| `includes/header.ftl`              | 頁面頁首，預設包含標誌、版本、原始碼集選擇器、淺色／深色主題切換及搜尋。 |
| `includes/footer.ftl`              | 頁面頁尾，包含 `footerMessage` [配置選項](#configuration) 及版權。               |
| `includes/page_metadata.ftl`       | 在 `<head>` 容器內使用的元資料。                                                                              |
| `includes/source_set_selector.ftl` | 頁首中的 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 選擇器。 |

基本範本是 `base.ftl`，它包含所有其餘列出的範本。
您可以在 [GitHub 上](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates) 找到所有 Dokka 範本的原始碼。

您可以使用 `templatesDir` [配置選項](#configuration) 覆蓋任何範本。Dokka 會在指定的目錄中搜尋確切的範本名稱。如果找不到使用者定義的範本，它將使用預設範本。

#### 變數

以下變數在所有範本中都可用：

| **變數**       | **描述**                                                                                                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 頁面名稱                                                                                                                                                                                      |
| `${footerMessage}` | 由 `footerMessage` [配置選項](#configuration) 設定的文字                                                                                                                |
| `${sourceSets}`    | 多平台頁面之 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 的可為 null 清單。每個項目都有 `name`、`platform` 及 `filter` 屬性。 |
| `${projectName}`   | 專案名稱。它僅在 `template_cmd` 指示詞內可用。                                                                                                                         |
| `${pathToRoot}`    | 從當前頁面到根目錄的路徑。它對於定位資源非常有用，且僅在 `template_cmd` 指示詞內可用。                                                                                                 |

變數 `projectName` 和 `pathToRoot` 僅在 `template_cmd` 指示詞內可用，因為它們需要更多上下文，因此需要在後續階段進行解析：

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### 指示詞

您還可以使用以下 Dokka 定義的 [指示詞](https://freemarker.apache.org/docs/ref_directive_userDefined.html)：

| **變數**    | **描述**                                                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 頁面主要內容。                                                                                                                                                                                                |
| `<@resources/>` | 資源，例如指令碼和樣式表。                                                                                                                                                                            |
| `<@version/>`   | 從配置中取得的子專案版本。如果套用了 [版本控制外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)，它會被版本導覽器取代。 |