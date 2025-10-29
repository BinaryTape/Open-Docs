[//]: # (title: Javadoc)

> Javadoc 輸出格式仍處於 Alpha 階段，因此您在使用時可能會發現錯誤並遇到遷移問題。
> 不保證與接受 Java Javadoc HTML 作為輸入的工具成功整合。
> **您需自行承擔使用風險。**
>
{style="warning"}

Dokka 的 Javadoc 輸出格式是 Java
[Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html) 的模擬。

它嘗試在視覺上模仿 Javadoc 工具產生的 HTML 頁面，但它並非直接實作或完全拷貝。

![Screenshot of javadoc output format](javadoc-format-example.png){width=706}

所有 Kotlin 程式碼和簽章都從 Java 的視角呈現。這是透過我們的
[Kotlin as Java Dokka 外掛](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) 實現的，該外掛預設已捆綁並套用於此格式。

Javadoc 輸出格式作為 [Dokka 外掛](dokka-plugins.md) 實作，並由 Dokka 團隊維護。
它是開源的，您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc) 上找到原始碼。

## 產生 Javadoc 文件

> 這些說明反映了 Dokka Gradle 外掛 v1 的配置和任務。從 Dokka 2.0.0 開始，[產生文件的 Gradle 任務已變更](dokka-migration.md#select-documentation-output-format)。
> 有關 Dokka Gradle 外掛 v2 的更多詳細資訊和完整的變更清單，請參閱[遷移指南](dokka-migration.md)。
>
> Javadoc 格式不支援多平台專案。
>
{style="warning"}

<tabs group="build-script">
<tab title="Gradle" group-key="kotlin">

[Dokka 的 Gradle 外掛](dokka-gradle.md) 隨附 Javadoc 輸出格式。您可以使用以下任務：

| **任務**                | **說明**                                                                                                                                                                                              |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dokkaJavadoc`          | 為單一專案產生 Javadoc 文件。                                                                                                                                                        |
| `dokkaJavadocCollector` | 僅為多專案建構中的父專案建立的 [`Collector`](dokka-gradle.md#collector-tasks) 任務。它會為每個子專案呼叫 `dokkaJavadoc` 並將所有輸出合併到一個單一的虛擬專案中。 |

`javadoc.jar` 檔案可以單獨產生。如需更多資訊，請參閱 [建置 `javadoc.jar`](dokka-gradle.md#build-javadoc-jar)。

</tab>
<tab title="Maven" group-key="groovy">

[Dokka 的 Maven 外掛](dokka-maven.md) 內建 Javadoc 輸出格式。您可以使用以下目標來產生文件：

| **目標**           | **說明**                                                              |
|--------------------|------------------------------------------------------------------------------|
| `dokka:javadoc`    | 產生 Javadoc 格式的文件                                    |
| `dokka:javadocJar` | 產生包含 Javadoc 格式文件的 `javadoc.jar` 檔案 |

</tab>
<tab title="CLI" group-key="cli">

由於 Javadoc 輸出格式是一個 [Dokka 外掛](dokka-plugins.md#apply-dokka-plugins)，因此您需要
[下載該外掛的 JAR 檔案](https://repo1.maven.org/maven2/org/jetbrains/dokka/javadoc-plugin/%dokkaVersion%/javadoc-plugin-%dokkaVersion%.jar)。

Javadoc 輸出格式有兩個相依性，您需要將它們作為額外的 JAR 檔案提供：

* [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin/%dokkaVersion%.jar)
* [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

透過 [命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

透過 [JSON 設定](dokka-cli.md#run-with-json-configuration)：

```json
{
  ...
  "pluginsClasspath": [
    "./dokka-base-%dokkaVersion%.jar",
    "...",
    "./kotlin-as-java-plugin-%dokkaVersion%.jar",
    "./korte-jvm-3.3.0.jar",
    "./javadoc-plugin-%dokkaVersion%.jar"
  ],
  ...
}
```

如需更多資訊，請參閱 CLI 執行器文件中的 [其他輸出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>