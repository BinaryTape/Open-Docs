[//]: # (title: Dokka 入門)

您可以在下方找到簡單的說明，協助您開始使用 Dokka。

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再支援。若要從 v1 模式升級到 v2 模式，請遵循[遷移指南](dokka-migration.md)。
>
{style="note"}

**應用 Gradle Dokka 外掛程式** 

在專案的根構建腳本中應用 Dokka Gradle 外掛程式 (DGP)：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

**文件化多專案建構**

在文件化[多專案建構](https://docs.gradle.org/current/userguide/multi_project_builds.html)時，
將此外掛程式應用於您要文件化的每個子專案。可透過以下其中一種方法在子專案之間共用 Dokka 配置：

* 慣例外掛程式
* 若您未使用慣例外掛程式，則在每個子專案中直接配置

有關在多專案建構中共用 Dokka 配置的更多資訊，請參閱[多專案配置](dokka-gradle.md#multi-project-configuration)。

**產生文件**

若要產生文件，請執行以下 Gradle 任務：

```bash
./gradlew :dokkaGenerate
```

此任務適用於單一和多專案建構。

從聚合專案執行 `dokkaGenerate` 任務，在任務前加上其專案路徑 (：)。例如：

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

避免執行 `./gradlew dokkaGenerate` 而非 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。
若任務前沒有專案路徑 (：)，Gradle 會嘗試在整個建構中執行所有 `dokkaGenerate` 任務，這可能會觸發不必要的工作。

您可以使用不同的任務來產生 [HTML](dokka-html.md)、
[Javadoc](dokka-javadoc.md) 或同時產生 [HTML 和 Javadoc](dokka-gradle.md#configure-documentation-output-format) 格式的輸出。

> 若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。
{style="tip"}

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。DGP v1 模式已不再支援。若要從 v1 模式升級到 v2 模式，請遵循[遷移指南](dokka-migration.md)。
>
{style="note"}

**應用 Gradle Dokka 外掛程式**

在專案的根構建腳本中應用 Dokka 的 Gradle 外掛程式：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

**文件化多專案建構**

在文件化[多專案建構](https://docs.gradle.org/current/userguide/multi_project_builds.html)時，
您需要將此外掛程式應用於您要文件化的每個子專案。可透過以下其中一種方法在子專案之間共用 Dokka 配置：

* 慣例外掛程式
* 若您未使用慣例外掛程式，則在每個子專案中直接配置

有關在多專案建構中共用 Dokka 配置的更多資訊，請參閱[多專案配置](dokka-gradle.md#multi-project-configuration)。

**產生文件**

若要產生文件，請執行以下 Gradle 任務：

```bash
./gradlew :dokkaGenerate
```

此任務適用於單一和多專案建構。

從聚合專案執行 `dokkaGenerate` 任務，在任務前加上其專案路徑。例如：

```bash
./gradlew :dokkaGenerate

// OR

./gradlew :aggregatingProject:dokkaGenerate
```

避免執行 `./gradlew dokkaGenerate` 而非 `./gradlew :dokkaGenerate` 或 `./gradlew :aggregatingProject:dokkaGenerate`。
若任務前沒有專案路徑 (：)，Gradle 會嘗試在整個建構中執行所有 `dokkaGenerate` 任務，這可能會觸發不必要的工作。

您可以使用不同的任務來產生 [HTML](dokka-html.md)、
[Javadoc](dokka-javadoc.md) 或同時產生 [HTML 和 Javadoc](dokka-gradle.md#configure-documentation-output-format) 格式的輸出。

> 若要進一步了解如何在 Gradle 中使用 Dokka，請參閱 [Gradle](dokka-gradle.md)。
{style="tip"}

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