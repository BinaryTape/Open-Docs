[//]: # (title: Dokka 外掛程式)

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。不再支援 DGP v1 模式。
> 若要從 v1 遷移至 v2 模式，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

Dokka 從底層設計之初就考慮到易擴充性與高度自定義，這讓社群能夠針對開箱即用功能未提供的缺失或特定需求來實作外掛程式。

Dokka 外掛程式的範圍涵蓋了支援其他程式語言原始碼到奇特的輸出格式。您可以增加對自定義 KDoc 標籤或註解的支援、教導 Dokka 如何渲染 KDoc 描述中的不同 DSL、視覺上重新設計 Dokka 頁面以無縫整合至公司的網站、將其與其他工具整合等等。

如果您想學習如何建立 Dokka 外掛程式，請參閱 [開發者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 套用 Dokka 外掛程式

Dokka 外掛程式是以獨立的構件形式發佈，因此要套用 Dokka 外掛程式，您只需將其新增為相依性即可。之後，外掛程式會自行擴充 Dokka——無需進一步的操作。

> 使用相同擴充點或以類似方式運作的外掛程式可能會互相干擾。這可能導致視覺錯誤、一般的未定義行為，甚至是建置失敗。然而，這不應導致並行問題，因為 Dokka 不會公開任何可變的資料結構或物件。
>
> 如果您注意到此類問題，建議檢查已套用了哪些外掛程式及其功能。
> 
{style="note"}

讓我們看看如何將 [mathjax 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) 套用到您的專案：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dependencies {
    dokkaPlugin("org.jetbrains.dokka:mathjax-plugin")
}
```

> * 內建外掛程式（如 HTML 和 Javadoc）一律自動套用。您只需配置它們，無需宣告對其的相依性。
>
> * 在為多模組專案（多專案建置）編寫文件時，您需要 [在子專案之間共享 Dokka 配置和外掛程式](dokka-gradle.md#multi-project-configuration)。
> 
{style="note"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dependencies {
    dokkaPlugin 'org.jetbrains.dokka:mathjax-plugin'
}
```

> 在為 [多專案](dokka-gradle.md#multi-project-configuration) 建置編寫文件時，您需要 [在子專案之間共享 Dokka 配置](dokka-gradle.md#multi-project-configuration)。
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

如果您使用具有 [命令列選項](dokka-cli.md#run-with-command-line-options) 的 [命令列](dokka-cli.md) 執行器，Dokka 外掛程式應作為 `.jar` 檔案傳遞給 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，則應在 `pluginsClasspath` 下指定 Dokka 外掛程式。

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

Dokka 外掛程式也可以有自己的配置選項。要查看有哪些可用選項，請諮詢您正在使用的外掛程式文件。

讓我們看看如何配置內建的 HTML 外掛程式，方法是將自定義圖片新增至資源（`customAssets` 選項）、自定義樣式表（`customStyleSheets` 選項），以及修改後的頁尾訊息（`footerMessage` 選項）：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

若要以型別安全的方式配置 Dokka 外掛程式，請使用 `dokka.pluginsConfiguration {}` 區塊：

```kotlin
dokka {
    pluginsConfiguration.html {
        customAssets.from("logo.png")
        customStyleSheets.from("styles.css")
        footerMessage.set("(c) Your Company")
    }
}
```

關於 Dokka 外掛程式配置的範例，請參閱 [Dokka 的版本控制外掛程式](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 允許您透過 [配置自定義外掛程式](https://github.com/Kotlin/dokka/blob/v2.2.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts) 來擴充其功能並修改文件產生成程序。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
dokka {
    pluginsConfiguration {
        html {
            customAssets.from("logo.png")
            customStyleSheets.from("styles.css")
            footerMessage.set("(c) Your Company")
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
            <!-- 完全限定外掛程式名稱 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 按名稱排列的選項 -->
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

如果您使用具有 [命令列選項](dokka-cli.md#run-with-command-line-options) 的 [命令列](dokka-cli.md) 執行器，請使用 `-pluginsConfiguration` 選項，該選項接受格式為 `fullyQualifiedPluginName=json` 的 JSON 配置。

如果您需要配置多個外掛程式，可以傳遞多個以 `^^` 分隔的值。

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

以下是一些您可能會覺得有用的著名 Dokka 外掛程式：

| **名稱**                                                                                                                           | **描述**                                                                                              |
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android 文件外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 改善 Android 上的文件體驗                                                             |
| [版本控制外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning)                       | 新增版本選擇器並協助組織應用程式/程式庫不同版本的文件 |
| [MermaidJS HTML 外掛程式](https://github.com/glureau/dokka-mermaid)                                                                  | 渲染 KDoc 中的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 圖表與視覺化內容      |
| [Mathjax HTML 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)                        | 美化列印 KDoc 中的數學公式                                                                     |
| [Kotlin 作為 Java 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java)               | 從 Java 的視角渲染 Kotlin 簽章                                                    |
| [GFM 外掛程式](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm)                                                                                                                     | 增加產生 GitHub Flavoured Markdown 格式文件的能力                               |
| [Jekyll 外掛程式](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll)                                                                                                                                                                                                           | 增加產生 Jekyll Flavoured Markdown 格式文件的能力                               |

如果您是 Dokka 外掛程式作者，並希望將您的外掛程式新增到此清單，請透過 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 與維護者聯絡。