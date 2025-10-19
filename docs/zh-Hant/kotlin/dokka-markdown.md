[//]: # (title: Markdown)

> Markdown 輸出格式仍處於 Alpha 階段，因此您在使用時可能會遇到錯誤並經歷遷移問題。
> **您需自行承擔使用風險。**
>
> 像 Markdown 和 Jekyll 這樣的實驗性格式在 Dokka 2.0.0 中預設不支援。
> 啟用這些格式的因應措施將很快加入。
{style="warning"}

Dokka 能夠產生文件，採用與 [GitHub Flavored](#gfm) 和 [Jekyll](#jekyll) 相容的 Markdown 格式。

這些格式為您提供了更大的自由度，在託管文件方面，因為輸出可以直接嵌入您的文件網站。例如，請參閱 [OkHttp 的 API 參考](https://square.github.io/okhttp/5.x/okhttp/okhttp3/) 頁面。

Markdown 輸出格式是作為 [Dokka 插件](dokka-plugins.md) 實作的，由 Dokka 團隊維護，並且是開源的。

## GFM

GFM 輸出格式會產生文件，採用 [GitHub Flavored Markdown](https://github.github.com/gfm/) 格式。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 插件](dokka-gradle.md) 隨附 GFM 輸出格式。您可以搭配其使用以下任務：

| **任務** | **描述** |
|---|---|
| `dokkaGfm` | 為單一專案產生 GFM 文件。 |
| `dokkaGfmMultiModule` | 一個 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任務，僅為多專案建置中的父專案建立。它會為子專案產生文件，並將所有輸出收集到一個具有共同的索引目錄的位置。 |
| `dokkaGfmCollector` | 一個 [`Collector`](dokka-gradle.md#collector-tasks) 任務，僅為多專案建置中的父專案建立。它會為每個子專案呼叫 `dokkaGfm`，並將所有輸出合併到單一虛擬專案中。 |

</tab>
<tab title="Maven" group-key="groovy">

由於 GFM 格式是作為 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins) 實作的，因此您需要將其作為插件依賴項應用：

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

設定後，執行 `dokka:dokka` 目標會以 GFM 格式產生文件。

如需更多資訊，請參閱 Maven 插件文件中關於 [其他輸出格式](dokka-maven.md#other-output-formats) 的說明。

</tab>
<tab title="CLI" group-key="cli">

由於 GFM 格式是作為 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins) 實作的，因此您需要 [下載 JAR 檔案](https://repo1.maven.org/maven2/org/jetbrains/dokka/gfm-plugin/%dokkaVersion%/gfm-plugin-%dokkaVersion%.jar) 並將其傳遞給 `pluginsClasspath`。

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar" \
     ...
```

透過 [JSON 設定](dokka-cli.md#run-with-json-configuration)：

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

如需更多資訊，請參閱 CLI 執行器文件中關於 [其他輸出格式](dokka-cli.md#other-output-formats) 的說明。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-gfm) 上找到原始碼。

## Jekyll

Jekyll 輸出格式會產生文件，採用與 [Jekyll](https://jekyllrb.com/) 相容的 Markdown 格式。

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 插件](dokka-gradle.md) 隨附 Jekyll 輸出格式。您可以搭配其使用以下任務：

| **任務** | **描述** |
|---|---|
| `dokkaJekyll` | 為單一專案產生 Jekyll 文件。 |
| `dokkaJekyllMultiModule` | 一個 [`MultiModule`](dokka-gradle.md#multi-project-builds) 任務，僅為多專案建置中的父專案建立。它會為子專案產生文件，並將所有輸出收集到一個具有共同的索引目錄的位置。 |
| `dokkaJekyllCollector` | 一個 [`Collector`](dokka-gradle.md#collector-tasks) 任務，僅為多專案建置中的父專案建立。它會為每個子專案呼叫 `dokkaJekyll`，並將所有輸出合併到單一虛擬專案中。 |

</tab>
<tab title="Maven" group-key="groovy">

由於 Jekyll 格式是作為 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins) 實作的，因此您需要將其作為插件依賴項應用：

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

設定後，執行 `dokka:dokka` 目標會以 GFM 格式產生文件。

如需更多資訊，請參閱 Maven 插件文件中關於 [其他輸出格式](dokka-maven.md#other-output-formats) 的說明。

</tab>
<tab title="CLI" group-key="cli">

由於 Jekyll 格式是作為 [Dokka 插件](dokka-plugins.md#apply-dokka-plugins) 實作的，因此您需要 [下載 JAR 檔案](https://repo1.maven.org/maven2/org/jetbrains/dokka/jekyll-plugin/%dokkaVersion%/jekyll-plugin-%dokkaVersion%.jar)。此格式也基於 [GFM](#gfm) 格式，因此您也需要將其作為依賴項提供。兩個 JAR 都需要傳遞給 `pluginsClasspath`：

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./gfm-plugin-%dokkaVersion%.jar;./jekyll-plugin-%dokkaVersion%.jar" \
     ...
```

透過 [JSON 設定](dokka-cli.md#run-with-json-configuration)：

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

如需更多資訊，請參閱 CLI 執行器文件中關於 [其他輸出格式](dokka-cli.md#other-output-formats) 的說明。

</tab>
</tabs>

您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-jekyll) 上找到原始碼。