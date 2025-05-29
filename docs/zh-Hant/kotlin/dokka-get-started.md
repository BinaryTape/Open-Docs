[//]: # (title: 開始使用 Dokka)

您可以在下方找到簡單的說明，以幫助您開始使用 Dokka。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

在專案的根建置腳本中套用 Dokka 的 Gradle 外掛程式：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

當文件化 [多專案](https://docs.gradle.org/current/userguide/multi_project_builds.html) 建置時，您也需要在子專案中套用 Gradle 外掛程式：

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

若要產生文件，請執行以下 Gradle 任務：

* `dokkaHtml` 適用於單一專案建置
* `dokkaHtmlMultiModule` 適用於多專案建置

依預設，輸出目錄設定為 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在專案的根建置腳本中套用 Dokka 的 Gradle 外掛程式：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

當文件化 [多專案](https://docs.gradle.org/current/userguide/multi_project_builds.html) 建置時，您也需要在子專案中套用 Gradle 外掛程式：

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

若要產生文件，請執行以下 Gradle 任務：

* `dokkaHtml` 適用於單一專案建置
* `dokkaHtmlMultiModule` 適用於多專案建置

依預設，輸出目錄設定為 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Maven" group-key="mvn">

將 Dokka 的 Maven 外掛程式新增至 POM 檔案的 `plugins` 區塊：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

若要產生文件，請執行 `dokka:dokka` 目標。

依預設，輸出目錄設定為 `target/dokka`。

若要進一步了解如何在 Maven 中使用 Dokka，請參閱 [Maven](dokka-maven.md)。

</tab>
</tabs>

> 在 Dokka 2.0.0 中，許多入門步驟和任務已更新，包括：
>
> * [設定多專案建置](dokka-migration.md#share-dokka-configuration-across-modules)
> * [使用更新後的任務產生文件](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [指定輸出目錄](dokka-migration.md#output-directory)
>
> 如需更多詳細資訊和完整的變更清單，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}