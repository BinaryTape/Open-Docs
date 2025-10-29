[//]: # (title: Dokka 入門)

以下是一些簡單的說明，協助您開始使用 Dokka。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 這些說明反映了 Dokka Gradle 外掛程式 v1 的配置和任務。從 Dokka 2.0.0 開始，一些設定選項、Gradle 任務以及產生文件的步驟已更新，其中包括：
>
> * [調整設定選項](dokka-migration.md#adjust-configuration-options)
> * [處理多模組專案](dokka-migration.md#share-dokka-configuration-across-modules)
> * [使用更新的任務產生文件](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [指定輸出目錄](dokka-migration.md#output-directory)
>
> 有關 Dokka Gradle 外掛程式 v2 的更多詳細資訊和完整的變更列表，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

在專案的根構建腳本中應用 Dokka 的 Gradle 外掛程式：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

當為 [多專案](https://docs.gradle.org/current/userguide/multi_project_builds.html) 構建建立文件時，您也需要在子專案中應用 Gradle 外掛程式：

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

若要產生文件，請執行以下 Gradle 任務：

* `dokkaHtml` 用於單一專案構建
* `dokkaHtmlMultiModule` 用於多專案構建

預設情況下，輸出目錄設定為 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在專案的根構建腳本中應用 Dokka 的 Gradle 外掛程式：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

當為 [多專案](https://docs.gradle.org/current/userguide/multi_project_builds.html) 構建建立文件時，您也需要在子專案中應用 Gradle 外掛程式：

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

若要產生文件，請執行以下 Gradle 任務：

* `dokkaHtml` 用於單一專案構建
* `dokkaHtmlMultiModule` 用於多專案構建

預設情況下，輸出目錄設定為 `/build/dokka/html` 和 `/build/dokka/htmlMultiModule`。

若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。

</tab>
<tab title="Maven" group-key="mvn">

將 Dokka 的 Maven 外掛程式新增至 POM 檔案的 `plugins` 區段：

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

預設情況下，輸出目錄設定為 `target/dokka`。

若要進一步了解如何在 Maven 中使用 Dokka，請參閱 [Maven](dokka-maven.md)。

</tab>
</tabs>