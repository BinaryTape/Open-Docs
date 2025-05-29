[//]: # (title: Markdown)

> Markdown 輸出格式仍處於 Alpha 階段，因此您在使用時可能會發現錯誤並遇到遷移問題。
> **您需自行承擔使用風險。**
>
{style="warning"}

Dokka 能夠產生 [GitHub Flavored](#gfm) 和 [Jekyll](#jekyll) 相容的 Markdown 文件。

這些格式讓您在託管文件方面有更大的彈性，因為輸出內容可直接嵌入您的文件網站。例如，請參閱 [OkHttp 的 API 參考](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)頁面。

Markdown 輸出格式是實作為 [Dokka 外掛程式](dokka-plugins.md)，由 Dokka 團隊維護，並且它們是開源的。

## GFM

GFM 輸出格式會產生 [GitHub Flavored Markdown](https://github.github.com/gfm/) 文件。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 外掛程式](dokka-gradle.md) 內含 GFM 輸出格式。您可以搭配它使用以下任務：

| **任務**              | **說明**                                                                                                                                                                                                                                                        |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaGfm`            | 為單一專案產生 GFM 文件。                                                                                                                                                                                                                                         |
| `dokkaGfmMultiModule` | 僅為多專案建置中的父專案建立的 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任務。它會為子專案產生文件，並將所有輸出收集到單一位置，並附帶共同目錄。                                                                                                                |
| `dokkaGfmCollector`   | 僅為多專案建置中的父專案建立的 [`Collector`](dokka-gradle.md#collector-tasks) 任務。它會對每個子專案呼叫 `dokkaGfm`，並將所有輸出合併到單一虛擬專案中。                                                                                                                        |

</tab>
<tab title="Maven" group-key="groovy">

由於 GFM 格式是實作為 [Dokka 外掛程式](dokka-plugins.md#apply-dokka-plugins)，因此您需要將其作為外掛程式依賴項套用：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

配置完成後，執行 `dokka:dokka` 目標會產生 GFM 格式的文件。

欲了解更多資訊，請參閱 Maven 外掛程式文件中的 [其他輸出格式](dokka-maven.md#other-output-formats)。

</tab>
<tab title="CLI" group-key="cli">

由於 GFM 格式是實作為 [Dokka 外掛程式](dokka-plugins.md#apply-dokka-plugins)，因此您需要 [下載 JAR 檔案](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar) 並將其傳遞給 `pluginsClasspath`。

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

透過 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

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

欲了解更多資訊，請參閱 CLI 執行器的文件中的 [其他輸出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm) 上找到原始碼。

## Jekyll

Jekyll 輸出格式會產生 [Jekyll](https://jekyllrb.com/) 相容的 Markdown 文件。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 外掛程式](dokka-gradle.md) 內含 Jekyll 輸出格式。您可以搭配它使用以下任務：

| **任務**                 | **說明**                                                                                                                                                                                                                                                        |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJekyll`            | 為單一專案產生 Jekyll 文件。                                                                                                                                                                                                                                      |
| `dokkaJekyllMultiModule` | 僅為多專案建置中的父專案建立的 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任務。它會為子專案產生文件，並將所有輸出收集到單一位置，並附帶共同目錄。                                                                                                              |
| `dokkaJekyllCollector`   | 僅為多專案建置中的父專案建立的 [`Collector`](dokka-gradle.md#collector-tasks) 任務。它會對每個子專案呼叫 `dokkaJekyll`，並將所有輸出合併到單一虛擬專案中。                                                                                                                      |

</tab>
<tab title="Maven" group-key="groovy">

由於 Jekyll 格式是實作為 [Dokka 外掛程式](dokka-plugins.md#apply-dokka-plugins)，因此您需要將其作為外掛程式依賴項套用：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>jekyll-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

配置完成後，執行 `dokka:dokka` 目標會產生 GFM 格式的文件。

欲了解更多資訊，請參閱 Maven 外掛程式文件中的 [其他輸出格式](dokka-maven.md#other-output-formats)。

</tab>
<tab title="CLI" group-key="cli">

由於 Jekyll 格式是實作為 [Dokka 外掛程式](dokka-plugins.md#apply-dokka-plugins)，因此您需要 [下載 JAR 檔案](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)。此格式也基於 [GFM](#gfm) 格式，因此您也需要將其作為依賴項提供。兩個 JAR 檔案都需要傳遞給 `pluginsClasspath`：

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

透過 [JSON 配置](dokka-cli.md#run-with-json-configuration)：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./gfm-plugin-%dokkaVersion%.jar",
    "./jekyll-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

欲了解更多資訊，請參閱 CLI 執行器的文件中的 [其他輸出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll) 上找到原始碼。