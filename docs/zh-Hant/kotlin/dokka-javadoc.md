[//]: # (title: Javadoc)
<primary-label ref="alpha"/>

> 本指南適用於 Dokka Gradle 外掛 (DGP) v2 模式。DGP v1 模式已不再支援。
> 若要從 v1 升級到 v2 模式，請遵循[遷移指南](dokka-migration.md)。
>
{style="note"}

Dokka 的 Javadoc 輸出格式是 Java
[Javadoc HTML 格式](https://docs.oracle.com/en/java/javase/19/docs/api/index.html) 的模擬。

它嘗試在視覺上模仿 Javadoc 工具產生的 HTML 頁面，但它並非直接實作或完全拷貝。

![Javadoc 輸出格式截圖](javadoc-format-example.png){width=706}

所有 Kotlin 程式碼和簽章都從 Java 的視角呈現。這是透過我們的
[Kotlin as Java Dokka 外掛](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-kotlin-as-java) 實現的，該外掛預設已捆綁並套用於此格式。

Javadoc 輸出格式作為一個 [Dokka 外掛](dokka-plugins.md) 實作，並由 Dokka 團隊維護。
它是開源的，
您可以在 [GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-javadoc) 上找到原始碼。

## 產生 Javadoc 文件

> Dokka 不支援多專案建構或 Kotlin 多平台專案的 Javadoc 格式。
>
{style="tip"}

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

[Dokka 的 Gradle 外掛](dokka-gradle.md) 隨附 Javadoc 輸出格式。
您需要將對應的外掛 ID 套用於專案的 `build.gradle.kts` 檔案中的 `plugins {}` 區塊：

```kotlin
plugins {
    id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"
}
```

套用此外掛後，您可以執行以下任務：

*   `dokkaGenerate`：依據已套用的外掛，產生[所有可用格式的文件](dokka-gradle.md#configure-documentation-output-format)。
*   `dokkaGeneratePublicationJavadoc`：僅以 Javadoc 格式產生文件。

`javadoc.jar` 檔案可以單獨產生。如需更多資訊，請參閱[建置 `javadoc.jar`](dokka-gradle.md#build-javadoc-jar)。

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

*   [kotlin-as-java plugin](https://repo1.maven.org/maven2/org/jetbrains/dokka/kotlin-as-java-plugin/%dokkaVersion%/kotlin-as-java-plugin/%dokkaVersion%.jar)
*   [korte-jvm](https://repo1.maven.org/maven2/com/soywiz/korlibs/korte/korte-jvm/3.3.0/korte-jvm-3.3.0.jar)

透過[命令列選項](dokka-cli.md#run-with-command-line-options)：

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     -pluginsClasspath "./dokka-base-%dokkaVersion%.jar;...;./javadoc-plugin-%dokkaVersion%.jar" \
     ...
```

透過[JSON 設定](dokka-cli.md#run-with-json-configuration)：

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

如需更多資訊，請參閱 CLI 執行器文件中的[其他輸出格式](dokka-cli.md#other-output-formats)。

</tab>
</tabs>