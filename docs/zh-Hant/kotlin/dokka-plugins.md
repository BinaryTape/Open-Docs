[//]: # (title: Dokka 外掛程式)

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再支援。
> 若要從 v1 模式升級至 v2 模式，請遵循[遷移指南](dokka-migration.md)。
>
{style="note"}

Dokka 從頭打造，旨在易於擴展和高度客製化，這使得社群能夠為那些開箱即用功能所欠缺或非常特定的功能實作外掛程式。

Dokka 外掛程式的範圍涵蓋從支援其他程式語言原始碼到各種不尋常的輸出格式。您可以添加對您自己的 KDoc 標籤或註解的支援，教導 Dokka 如何呈現 KDoc 描述中發現的不同 DSLs，視覺上重新設計 Dokka 頁面使其無縫整合到您公司的網站，將其與其他工具整合等等。

如果您想了解如何建立 Dokka 外掛程式，請參閱
[開發者指南](https://kotlin.github.io/dokka/%dokkaVersion%/developer_guide/introduction/)。

## 套用 Dokka 外掛程式

Dokka 外掛程式以獨立構件的形式發布，因此要套用 Dokka 外掛程式，您只需要將其添加為依賴項即可。從那之後，該外掛程式會自行擴展 Dokka — 無需進一步操作。

> 使用相同擴展點或以相似方式運作的外掛程式可能會彼此干擾。
> 這可能導致視覺錯誤、一般未定義行為，甚至建置失敗。然而，這不應導致並發問題，因為 Dokka 不會暴露任何可變資料結構或物件。
>
> 如果您發現此類問題，最好檢查哪些外掛程式已套用以及它們的功能。
>
{style="note"}

讓我們看看如何將 [mathjax 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax)
套用到您的專案：

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

> * 內建外掛程式（例如 HTML 和 Javadoc）總是會自動套用。您只需配置它們，而無需宣告對它們的依賴項。
>
> * 在文件化多模組專案（多專案建置）時，您需要在子專案之間[共用 Dokka 配置與外掛程式](dokka-gradle.md#multi-project-configuration)。
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

> 在文件化[多專案](dokka-gradle.md#multi-project-configuration)建置時，
> 您需要在子專案之間[共用 Dokka 配置](dokka-gradle.md#multi-project-configuration)。
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

如果您使用帶有[命令列選項](dokka-cli.md#run-with-command-line-options)的 [CLI](dokka-cli.md) 執行器，
Dokka 外掛程式應作為 `.jar` 檔案傳遞給 `-pluginsClasspath`：

```Shell
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./mathjax-plugin-%dokkaVersion%.jar" \
     ...
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，Dokka 外掛程式應在
`pluginsClasspath` 下指定。

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

Dokka 外掛程式也可以有自己的配置選項。要查看哪些選項可用，請查閱您正在使用的外掛程式的文件。

讓我們看看如何配置內建的 HTML 外掛程式，方法是將自訂圖片添加到資產（`customAssets` 選項）、
自訂樣式表（`customStyleSheets` 選項），並修改頁腳訊息（`footerMessage` 選項）：

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

有關 Dokka 外掛程式配置的範例，請參閱
[Dokka 的版本控制外掛程式](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 允許您透過[配置自訂外掛程式](https://github.com/Kotlin/dokka/blob/v2.1.0/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)
來擴展其功能並修改文件生成過程。

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
            <!-- 完全限定的外掛程式名稱 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 按名稱指定選項 -->
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

如果您使用帶有[命令列選項](dokka-cli.md#run-with-command-line-options)的 [CLI](dokka-cli.md) 執行器，
請使用 `-pluginsConfiguration` 選項，它接受形式為 `fullyQualifiedPluginName=json` 的 JSON 配置。

如果您需要配置多個外掛程式，可以傳遞多個值，以 `^^` 分隔。

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg CLI\"}"
```

如果您使用 [JSON 配置](dokka-cli.md#run-with-json-configuration)，則存在一個類似的
`pluginsConfiguration` 陣列，它在 `values` 中接受 JSON 配置。

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
|------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [Android 文件外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-android-documentation) | 改善 Android 上的文件編寫體驗 |
| [版本控制外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning) | 添加版本選擇器並有助於組織應用程式/函式庫不同版本的文件 |
| [MermaidJS HTML 外掛程式](https://github.com/glureau/dokka-mermaid) | 呈現 KDocs 中找到的 [MermaidJS](https://mermaid-js.github.io/mermaid/#/) 圖表和視覺化內容 |
| [Mathjax HTML 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-mathjax) | 美化 KDocs 中找到的數學公式 |
| [Kotlin 作為 Java 外掛程式](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) | 從 Java 的視角呈現 Kotlin 簽章 |
| [GFM 外掛程式](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-gfm) | 新增以 GitHub Flavoured Markdown 格式生成文件的能力 |
| [Jekyll 外掛程式](https://github.com/Kotlin/dokka/tree/master/dokka-subprojects/plugin-jekyll) | 新增以 Jekyll Flavoured Markdown 格式生成文件的能力 |

如果您是 Dokka 外掛程式作者，並希望將您的外掛程式添加到此列表，請透過 [Slack](dokka-introduction.md#community) 或 [GitHub](https://github.com/Kotlin/dokka/) 與維護者聯繫。