[//]: # (title: 開始使用 Dokka)

以下您可以找到協助您開始使用 Dokka 的簡單說明。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再受支援。
> 若要從 v1 升級至 v2 模式，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

**套用 Gradle Dokka 外掛程式** 

在您專案的根組建指令碼中套用 Dokka Gradle 外掛程式 (DGP)：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**為多專案組建產生文件**

當為 [多專案組建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 產生文件時，請將外掛程式套用至每個您想要產生文件的子專案。透過以下其中一種方式在子專案之間共用 Dokka 配置：

* 慣例外掛程式
* 若不使用慣例外掛程式，則在每個子專案中直接配置

有關在多專案組建中共用 Dokka 配置的更多資訊，請參閱 [多專案配置](dokka-gradle.md#multi-project-configuration)。

**產生文件**

要產生文件，請執行以下 Gradle 任務：

```bash
./gradlew :dokkaGenerate
```

此任務適用於單一專案和多專案組建。

從聚合專案執行 `dokkaGenerate` 任務時，請在任務前加上其專案路徑（`:`）作為字首。例如：

```bash
./gradlew :dokkaGenerate

// 或

./gradlew :aggregatingProject:dokkaGenerate
```

避免執行 `./gradlew dokkaGenerate`，而應使用 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。若任務沒有加上專案路徑（`:`）字首，Gradle 會嘗試執行整個組建中的所有 `dokkaGenerate` 任務，這可能會觸發不必要的工作。

您可以使用不同的任務來產生 [HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md) 或同時產生 [HTML 與 Javadoc](dokka-gradle.md#configure-documentation-output-format) 的輸出。

> 若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再受支援。
> 若要從 v1 升級至 v2 模式，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

**套用 Gradle Dokka 外掛程式**

在您專案的根組建指令碼中套用 Dokka 的 Gradle 外掛程式：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**為多專案組建產生文件**

當為 [多專案組建](https://docs.gradle.org/current/userguide/multi_project_builds.html) 產生文件時，您需要將外掛程式套用至每個您想要產生文件的子專案。透過以下其中一種方式在子專案之間共用 Dokka 配置：

* 慣例外掛程式
* 若不使用慣例外掛程式，則在每個子專案中直接配置

有關在多專案組建中共用 Dokka 配置的更多資訊，請參閱 [多專案配置](dokka-gradle.md#multi-project-configuration)。

**產生文件**

要產生文件，請執行以下 Gradle 任務：

```bash
./gradlew :dokkaGenerate
```

此任務適用於單一專案和多專案組建。

從聚合專案執行 `dokkaGenerate` 任務時，請在任務前加上其專案路徑作為字首。例如：

```bash
./gradlew :dokkaGenerate

// 或

./gradlew :aggregatingProject:dokkaGenerate
```

避免執行 `./gradlew dokkaGenerate`，而應使用 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。若任務沒有加上專案路徑（`:`）字首，Gradle 會嘗試執行整個組建中的所有 `dokkaGenerate` 任務，這可能會觸發不必要的工作。

您可以使用不同的任務來產生 [HTML](dokka-html.md)、[Javadoc](dokka-javadoc.md) 或同時產生 [HTML 與 Javadoc](dokka-gradle.md#configure-documentation-output-format) 的輸出。

> 若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。
{style="tip"}

</tab>
<tab title="Maven" group-key="mvn">

在您 POM 檔案的 `plugins` 區段中加入 Dokka 的 Maven 外掛程式：

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

若要產生文件，請執行 `dokka:dokka` 目標 (goal)。

預設情況下，輸出目錄會設定為 `target/dokka`。

若要進一步了解如何在 Maven 中使用 Dokka，請參閱 [Maven](dokka-maven.md)。

</tab>
</tabs>