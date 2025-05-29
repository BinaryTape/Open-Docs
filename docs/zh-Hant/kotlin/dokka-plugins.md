[//]: # (title: Dokka 外掛程式)

Dokka 從底層建構，旨在實現易於擴充和高度可自訂，這使得社群能夠為開箱即用不提供的缺少或非常特定的功能實作外掛程式。

Dokka 外掛程式的範圍從支援其他程式語言原始碼到特殊輸出格式。您可以添加對您自己的 KDoc 標籤或註解的支援，教 Dokka 如何渲染 KDoc 描述中找到的不同 DSL，視覺上重新設計 Dokka 的頁面以無縫整合到您公司的網站中，將其與其他工具整合等等。

如果您想學習如何建立 Dokka 外掛程式，請參閱 [開發者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 應用 Dokka 外掛程式

Dokka 外掛程式以獨立的 artifact 發佈，因此要應用 Dokka 外掛程式，您只需將其添加為依賴項即可。從那裡開始，外掛程式會自行擴展 Dokka — 無需進一步操作。

> 使用相同擴展點或以相似方式運作的外掛程式可能會相互干擾。這可能導致視覺錯誤、一般未定義行為甚至建構失敗。然而，它不應導致並發問題，因為 Dokka 不會暴露任何可變資料結構或物件。
>
> 如果您發現此類問題，最好檢查應用了哪些外掛程式以及它們的功能。
>
{style="note"}

讓我們看看如何將 [mathjax 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) 應用到您的專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Dokka 的 Gradle 外掛程式會建立方便的依賴項配置，讓您可以普遍應用外掛程式或僅針對特定輸出格式應用。

```kotlin
dependencies {
    // Is applied universally
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%")

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin("org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%")
}
```

> 在文件化 [多專案](dokka-gradle.md#multi-project-builds) 建構時，您需要在子專案及其父專案中應用 Dokka 外掛程式。
>
{style="note"}

</tab>
<tab title="Groovy" group-key="groovy">

Dokka 的 Gradle 外掛程式會建立方便的依賴項配置，讓您可以普遍應用 Dokka 外掛程式或僅針對特定輸出格式應用。

```groovy
dependencies {
    // Is applied universally
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin:%dokkaVersion%'

    // Is applied for the single-module dokkaHtml task only
    dokkaHtmlPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'

    // Is applied for HTML format in multi-project builds
    dokkaHtmlPartialPlugin 'org.jetbrains.dokka:kotlin-as-java-plugin:%dokkaVersion%'
}
```

> 在文件化 [多專案](dokka-gradle.md#multi-project-builds) 建構時，您需要在子專案及其父專案中應用 Dokka 外掛程式。
>
{style="note"}

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>mathjax-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

如果您使用帶有 [命令列選項](dokka-cli.md#run-with-command-line-options) 的 [CLI](dokka-cli.md) 執行器，Dokka 外掛程式應作為 `.jar` 檔案傳遞給 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，Dokka 外掛程式應在 `pluginsClasspath` 下指定。

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./mathjax-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

</tab>
</tabs>

## 配置 Dokka 外掛程式

Dokka 外掛程式也可以有自己的配置選項。要查看哪些選項可用，請查閱您正在使用的外掛程式文件。

讓我們看看如何配置 `DokkaBase` 外掛程式，該外掛程式負責生成 [HTML](dokka-html.md) 文件，透過將自訂圖片添加到資源檔 (`customAssets` 選項)、添加自訂樣式表 (`customStyleSheets` 選項)，以及修改頁腳訊息 (`footerMessage` 選項)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

Gradle 的 Kotlin DSL 允許型別安全的(Type-safe)外掛程式配置。這可透過將外掛程式的 artifact 添加到 `buildscript` 區塊中的類別路徑依賴項，然後導入外掛程式和配置類別來實現：

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
    }
}
```

或者，外掛程式可以透過 JSON 配置。使用此方法，無需額外的依賴項。

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
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
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

如果您使用帶有 [命令列選項](dokka-cli.md#run-with-command-line-options) 的 [CLI](dokka-cli.md) 執行器，請使用 `-pluginsConfiguration` 選項，該選項接受 `fullyQualifiedPluginName=json` 形式的 JSON 配置。

如果您需要配置多個外掛程式，可以傳遞多個值，並使用 `^^` 分隔。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，則存在一個類似的 `pluginsConfiguration` 陣列，它在 `values` 中接受 JSON 配置。

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\"}"
    }
  ]
}
```

</tab>
</tabs>

## 值得注意的外掛程式

以下是一些您可能會覺得有用的值得注意的 Dokka 外掛程式：

| **名稱** | **描述** |
|---|---|
| [Android documentation plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 改進 Android 上的文件體驗 |
| [Versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning) | 添加版本選擇器並有助於組織應用程式/函式庫不同版本的文件 |
| [MermaidJS HTML plugin](https://github.com/glureau/dokka-mermaid) | 渲染 KDocs 中找到的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 圖表和視覺化內容 |
| [Mathjax HTML plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) | 美化 KDocs 中找到的數學公式 |
| [Kotlin as Java plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) | 從 Java 的視角渲染 Kotlin 簽名 |

如果您是 Dokka 外掛程式作者，並希望將您的外掛程式添加到此清單，請透過 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 與維護者聯繫。