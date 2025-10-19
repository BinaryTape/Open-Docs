[//]: # (title: Gradle)

> 從 Dokka 2.0.0 開始，一些配置選項、Gradle 任務以及產生文件的步驟已更新，包括：
>
> * [調整配置選項](dokka-migration.md#adjust-configuration-options)
> * [使用多模組專案](dokka-migration.md#share-dokka-configuration-across-modules)
> * [使用更新後的任務產生文件](dokka-migration.md#generate-documentation-with-the-updated-task)
> * [指定輸出目錄](dokka-migration.md#output-directory)
>
> 更多詳細資訊和完整的變更清單，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

若要為基於 Gradle 的專案產生文件，您可以使用 [Dokka 的 Gradle 外掛程式](https://plugins.gradle.org/plugin/org.jetbrains.dokka)。

它為您的專案提供了基本的自動配置，包含用於產生文件的便利 [Gradle 任務](#generate-documentation)，並提供了大量的 [配置選項](#configuration-options) 來客製化輸出。

您可以透過瀏覽我們的 [Gradle 範例專案](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle) 來試用 Dokka，並了解如何為各種專案配置它。

## 套用 Dokka

套用 Dokka 的 Gradle 外掛程式的建議方式是使用 [外掛程式 DSL](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

為 [多專案](#multi-project-builds) 建構建立文件時，您也需要在子專案中套用 Dokka 的 Gradle 外掛程式。您可以使用 `allprojects {}` 或 `subprojects {}` Gradle 配置來達成此目的：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
subprojects {
    apply(plugin = "org.jetbrains.dokka")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
subprojects {
    apply plugin: 'org.jetbrains.dokka'
}
```

</tab>
</tabs>

如果您不確定要在哪裡套用 Dokka，請參閱 [配置範例](#configuration-examples)。

> 在底層，Dokka 使用 [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin) 來對要產生文件的 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 執行自動配置。請務必套用 Kotlin Gradle 外掛程式或手動 [配置原始碼集](#source-set-configuration)。
>
{style="note"}

> 如果您在 [預編譯腳本外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins) 中使用 Dokka，您需要將 [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin) 作為依賴項新增，以便其正常運作。
>
{style="note"}

如果由於某些原因您無法使用外掛程式 DSL，您可以使用套用外掛程式的 [傳統方法](https://docs.gradle.org/current/userguide/plugins.html#sec:old_plugin_application)。

## 產生文件

Dokka 的 Gradle 外掛程式內建了 [HTML](dokka-html.md)、[Markdown](dokka-markdown.md) 和 [Javadoc](dokka-javadoc.md) 輸出格式。它增加了多個用於產生文件的任務，適用於 [單一專案](#single-project-builds) 和 [多專案](#multi-project-builds) 建構。

### 單一專案建構

使用以下任務為簡單的單一專案應用程式和函式庫建構文件：

| **任務**    | **描述**                                          |
|-------------|----------------------------------------------------------|
| `dokkaHtml` | 以 [HTML](dokka-html.md) 格式產生文件。 |

#### 實驗格式

| **任務**       | **描述**                                                                           |
|----------------|-------------------------------------------------------------------------------------------|
| `dokkaGfm`     | 以 [GitHub Flavored Markdown](dokka-markdown.md#gfm) 格式產生文件。      |
| `dokkaJavadoc` | 以 [Javadoc](dokka-javadoc.md) 格式產生文件。                            |
| `dokkaJekyll`  | 以 [Jekyll 相容的 Markdown](dokka-markdown.md#jekyll) 格式產生文件。 |

預設情況下，產生的文件位於您專案的 `build/dokka/{format}` 目錄中。輸出位置及其他事項可以進行 [配置](#configuration-examples)。

### 多專案建構

若要為 [多專案建構](https://docs.gradle.org/current/userguide/multi_project_builds.html) 建立文件，請務必在您要產生文件的子專案及其父專案中都 [套用 Dokka 的 Gradle 外掛程式](#apply-dokka)。

#### MultiModule 任務

`MultiModule` 任務透過 [`Partial`](#partial-tasks) 任務為每個子專案單獨產生文件，收集並處理所有輸出，並產生包含共同目錄和已解析跨專案參考的完整文件。

Dokka 會自動為**父**專案建立以下任務：

| **任務**               | **描述**                                                              |
|------------------------|------------------------------------------------------------------------------|
| `dokkaHtmlMultiModule` | 以 [HTML](dokka-html.md) 輸出格式產生多模組文件。 |

#### 實驗格式 (多模組)

| **任務**                 | **描述**                                                                                               |
|--------------------------|---------------------------------------------------------------------------------------------------------------|
| `dokkaGfmMultiModule`    | 以 [GitHub Flavored Markdown](dokka-markdown.md#gfm) 輸出格式產生多模組文件。      |
| `dokkaJekyllMultiModule` | 以 [Jekyll 相容的 Markdown](dokka-markdown.md#jekyll) 輸出格式產生多模組文件。 |

> [Javadoc](dokka-javadoc.md) 輸出格式沒有 `MultiModule` 任務，但可以改用 [`Collector`](#collector-tasks) 任務。
>
{style="note"}

預設情況下，您可以在 `{parentProject}/build/dokka/{format}MultiModule` 目錄下找到可立即使用的文件。

#### MultiModule 結果

假設專案結構如下：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

執行 `dokkaHtmlMultiModule` 後會產生這些頁面：

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

有關更多詳細資訊，請參閱我們的 [多模組專案範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)。

#### Collector 任務

類似於 `MultiModule` 任務，Dokka 會為每個父專案建立 `Collector` 任務：`dokkaHtmlCollector`、`dokkaGfmCollector`、`dokkaJavadocCollector` 和 `dokkaJekyllCollector`。

一個 `Collector` 任務會為每個子專案執行對應的 [單一專案任務](#single-project-builds) (例如，`dokkaHtml`)，並將所有輸出合併到一個單一的虛擬專案中。

產生的文件看起來就像您擁有一個包含所有子專案宣告的單一專案建構。

> 如果您需要為多專案建構建立 Javadoc 文件，請使用 `dokkaJavadocCollector` 任務。
>
{style="tip"}

#### Collector 結果

假設專案結構如下：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass
```

執行 `dokkaHtmlCollector` 後會產生這些頁面：

![Screenshot for output of dokkaHtmlCollector task](dokkaHtmlCollector-example.png){width=706}

有關更多詳細資訊，請參閱我們的 [多模組專案範例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-multimodule-example)。

#### Partial 任務

每個子專案都有為其建立的 `Partial` 任務：`dokkaHtmlPartial`、`dokkaGfmPartial` 和 `dokkaJekyllPartial`。

這些任務不打算獨立執行，它們由父級的 [MultiModule](#multimodule-tasks) 任務呼叫。

但是，您可以 [配置](#subproject-configuration) `Partial` 任務以自訂您的子專案的 Dokka。

> 由 `Partial` 任務產生的輸出包含未解析的 HTML 模板和參考，因此若無父級 [`MultiModule`](#multimodule-tasks) 任務進行後處理，它無法單獨使用。
>
{style="warning"}

> 如果您只想為單一子專案產生文件，請使用 [單一專案任務](#single-project-builds)。例如，`:subprojectName:dokkaHtml`。
>
{style="note"}

## 建構 javadoc.jar

如果您想將您的函式庫發布到儲存庫，您可能需要提供一個包含您的函式庫 API 參考文件的 `javadoc.jar` 檔案。

例如，如果您想發布到 [Maven Central](https://central.sonatype.org/)，您 [必須](https://central.sonatype.org/publish/requirements/) 在您的專案旁提供一個 `javadoc.jar`。然而，並非所有儲存庫都有此規則。

Dokka 的 Gradle 外掛程式並未開箱即用地提供執行此操作的方法，但可以透過自訂 Gradle 任務達成。一個用於以 [HTML](dokka-html.md) 格式產生文件，另一個用於以 [Javadoc](dokka-javadoc.md) 格式產生文件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.register<Jar>("dokkaHtmlJar") {
    dependsOn(tasks.dokkaHtml)
    from(tasks.dokkaHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-docs")
}

tasks.register<Jar>("dokkaJavadocJar") {
    dependsOn(tasks.dokkaJavadoc)
    from(tasks.dokkaJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.register('dokkaHtmlJar', Jar.class) {
    dependsOn(dokkaHtml)
    from(dokkaHtml)
    archiveClassifier.set("html-docs")
}

tasks.register('dokkaJavadocJar', Jar.class) {
    dependsOn(dokkaJavadoc)
    from(dokkaJavadoc)
    archiveClassifier.set("javadoc")
}
```

</tab>
</tabs>

> 如果您將您的函式庫發布到 Maven Central，您可以使用諸如 [javadoc.io](https://javadoc.io/) 的服務，免費且無需任何設定地託管您函式庫的 API 文件。它直接從 `javadoc.jar` 中取得文件頁面。與 HTML 格式搭配良好，如 [此範例](https://javadoc.io/doc/com.trib3/server/latest/index.html) 所示。
>
{style="tip"}

## 配置範例

根據您擁有的專案類型，套用和配置 Dokka 的方式略有不同。然而，[配置選項](#configuration-options) 本身是相同的，無論您的專案類型為何。

對於專案根目錄中包含單一 `build.gradle.kts` 或 `build.gradle` 檔案的簡單扁平專案，請參閱 [單一專案配置](#single-project-configuration)。

對於具有子專案和多個巢狀 `build.gradle.kts` 或 `build.gradle` 檔案的更複雜建構，請參閱 [多專案配置](#multi-project-configuration)。

### 單一專案配置

單一專案建構通常在專案根目錄中只有一個 `build.gradle.kts` 或 `build.gradle` 檔案，並且通常具有以下結構：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

單一平台：

```text
.
├── build.gradle.kts
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

多平台：

```text
.
├── build.gradle.kts
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

單一平台：

```text
.
├── build.gradle
└── src/
    └── main/
        └── kotlin/
            └── HelloWorld.kt
```

多平台：

```text
.
├── build.gradle
└── src/
    ├── commonMain/
    │   └── kotlin/
    │       └── Common.kt
    ├── jvmMain/
    │   └── kotlin/
    │       └── JvmUtils.kt
    └── nativeMain/
        └── kotlin/
            └── NativeUtils.kt
```

</tab>
</tabs>

在此類專案中，您需要在根 `build.gradle.kts` 或 `build.gradle` 檔案中套用 Dokka 及其配置。

您可以單獨配置任務和輸出格式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 內部：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
}

tasks.dokkaGfm {
    outputDirectory.set(layout.buildDirectory.dir("documentation/markdown"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 內部：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtml {
    outputDirectory.set(file("build/documentation/html"))
}

dokkaGfm {
    outputDirectory.set(file("build/documentation/markdown"))
}
```

</tab>
</tabs>

或者您可以同時配置所有任務和輸出格式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./build.gradle.kts` 內部：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

// 同時配置所有單一專案 Dokka 任務，例如 dokkaHtml、dokkaJavadoc 和 dokkaGfm。
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set(
            setOf(
                Visibility.PUBLIC,
                Visibility.PROTECTED,
            )
        )

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./build.gradle` 內部：

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.gradle.DokkaTaskPartial
import org.jetbrains.dokka.DokkaConfiguration.Visibility

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

// 同時配置所有單一專案 Dokka 任務，例如 dokkaHtml、dokkaJavadoc 和 dokkaGfm。
tasks.withType(DokkaTask.class) {
    dokkaSourceSets.configureEach {
        documentedVisibilities.set([
                Visibility.PUBLIC,
                Visibility.PROTECTED
        ])

        perPackageOption {
            matchingRegex.set(".*internal.*")
            suppress.set(true)
        }
    }
}
```

</tab>
</tabs>

### 多專案配置

Gradle 的 [多專案建構](https://docs.gradle.org/current/userguide/multi_project_builds.html) 在結構和配置上更複雜。它們通常有許多巢狀的 `build.gradle.kts` 或 `build.gradle` 檔案，並且通常具有以下結構：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```text
.
├── build.gradle.kts
├── settings.gradle.kts
├── subproject-A/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle.kts
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
<tab title="Groovy" group-key="groovy">

```text
.
├── build.gradle
├── settings.gradle
├── subproject-A/
│   ├── build.gradle
│   └── src/
│       └── main/
│           └── kotlin/
│               └── HelloFromA.kt
└── subproject-B/
    ├── build.gradle
    └── src/
        └── main/
            └── kotlin/
                └── HelloFromB.kt
```

</tab>
</tabs>

在這種情況下，套用和配置 Dokka 有多種方式。

#### 子專案配置

若要在多專案建構中配置子專案，您需要配置 [`Partial`](#partial-tasks) 任務。

您可以使用 Gradle 的 `allprojects {}` 或 `subprojects {}` 配置區塊，在根 `build.gradle.kts` 或 `build.gradle` 檔案中同時配置所有子專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根 `./build.gradle.kts` 檔案中：

```kotlin
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

subprojects {
    apply(plugin = "org.jetbrains.dokka")

    // 只配置 HTML 任務
    tasks.dokkaHtmlPartial {
        outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
    }

    // 一次配置所有格式任務
    tasks.withType<DokkaTaskPartial>().configureEach {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根 `./build.gradle` 檔案中：

```groovy
import org.jetbrains.dokka.gradle.DokkaTaskPartial

plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

subprojects {
    apply plugin: 'org.jetbrains.dokka'

    // 只配置 HTML 任務
    dokkaHtmlPartial {
        outputDirectory.set(file("build/docs/partial"))
    }

    // 一次配置所有格式任務
    tasks.withType(DokkaTaskPartial.class) {
        dokkaSourceSets.configureEach {
            includes.from("README.md")
        }
    }
}
```

</tab>
</tabs>

或者，您可以在子專案中單獨套用和配置 Dokka。

例如，若要只為 `subproject-A` 子專案設定特定配置，您需要在 `./subproject-A/build.gradle.kts` 內部套用以下程式碼：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在 `./subproject-A/build.gradle.kts` 內部：

```kotlin
apply(plugin = "org.jetbrains.dokka")

// 僅針對 subproject-A 的配置。
tasks.dokkaHtmlPartial {
    outputDirectory.set(layout.buildDirectory.dir("docs/partial"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在 `./subproject-A/build.gradle` 內部：

```groovy
apply plugin: 'org.jetbrains.dokka'

// 僅針對 subproject-A 的配置。
dokkaHtmlPartial {
    outputDirectory.set(file("build/docs/partial"))
}
```

</tab>
</tabs>

#### 父專案配置

如果您想配置一些在所有文件中通用且不屬於子專案的內容——換句話說，它是父專案的一個屬性——您需要配置 [`MultiModule`](#multimodule-tasks) 任務。

例如，如果您想變更在 HTML 文件標頭中使用的專案名稱，您需要在根 `build.gradle.kts` 或 `build.gradle` 檔案中套用以下內容：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

在根 `./build.gradle.kts` 檔案中：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

tasks.dokkaHtmlMultiModule {
    moduleName.set("標頭中使用的整個專案名稱")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

在根 `./build.gradle` 檔案中：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokkaHtmlMultiModule {
    moduleName.set("標頭中使用的整個專案名稱")
}
```

</tab>
</tabs>

## 配置選項

Dokka 有許多配置選項可以客製化您和讀者的體驗。

以下是每個配置區塊的一些範例和詳細描述。您也可以在頁面底部找到一個 [已套用所有配置選項](#complete-configuration) 的範例。

有關在哪裡以及如何套用配置區塊的更多詳細資訊，請參閱 [配置範例](#configuration-examples)。

### 一般配置

以下是任何 Dokka 任務的一般配置範例，無論原始碼集或套件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)
    
    // ..
    // 原始碼集配置區塊
    // ..
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    // ..
    // 原始碼集配置區塊
    // ..
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="moduleName">
        <p>用於指稱模組的顯示名稱。它用於目錄、導覽、日誌記錄等。</p>
        <p>如果為單一專案建構或 <code>MultiModule</code> 任務設定，則會用作專案名稱。</p>
        <p>預設值：Gradle 專案名稱</p>
    </def>
    <def title="moduleVersion">
        <p>
            模組版本。如果為單一專案建構或 <code>MultiModule</code> 任務設定，則會用作專案版本。
        </p>
        <p>預設值：Gradle 專案版本</p>
    </def>
    <def title="outputDirectory">
        <p>無論格式為何，產生文件所到的目錄。它可以根據每個任務進行設定。</p>
        <p>
            預設值為 <code>{project}/{buildDir}/{format}</code>，其中 <code>{format}</code> 是移除了「dokka」前綴的任務名稱。對於 <code>dokkaHtmlMultiModule</code> 任務，它是 
            <code>project/buildDir/htmlMultiModule</code>。
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 發出警告或錯誤，是否要使文件產生失敗。此程序會等到所有錯誤和警告都發出後才繼續。
        </p>
        <p>此設定與 <code>reportUndocumented</code> 搭配良好。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressObviousFunctions">
        <p>是否抑制明顯的函式。</p>
        <p>
            如果函式符合以下條件，則被視為明顯：</p>
            <list>
                <li>
                    繼承自 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或
                    <code>java.lang.Enum</code>，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成 (由編譯器產生) 且沒有任何文件，例如
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="suppressInheritedMembers">
        <p>是否抑制在給定類別中未明確覆寫的繼承成員。</p>
        <p>
            注意：這可以抑制 <code>equals</code> / <code>hashCode</code> / <code>toString</code> 等函式，
            但不能抑制 <code>dataClass.componentN</code> 和
            <code>dataClass.copy</code> 等合成函式。為此請使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="offlineMode">
        <p>是否透過您的網路解析遠端檔案/連結。</p>
        <p>
            這包括用於產生外部文件連結的套件清單。 
            例如，使標準函式庫中的類別可點擊。 
        </p>
        <p>
            將此設定為 <code>true</code> 在某些情況下可以顯著加快建構時間，
            但也可能降低文件品質和使用者體驗。例如，
            不解析來自您的依賴項（包括標準函式庫）的類別/成員連結。
        </p>
        <p>
            注意：您可以將獲取的檔案快取在本地，並將它們作為本地路徑提供給
            Dokka。請參閱 <code>externalDocumentationLinks</code> 部分。
        </p>
        <p>預設值：<code>false</code></p>
    </def>
</deflist>

### 原始碼集配置

Dokka 允許為 [Kotlin 原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets) 配置一些選項：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置區塊
    // ..

    dokkaSourceSets {
        // 「linux」原始碼集專用的配置
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 原始碼連結區塊
            }
            externalDocumentationLink {
                // 外部文件連結區塊
            }
            perPackageOption {
                // 套件選項區塊
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets {
        // 「linux」原始碼集專用的配置 
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                // 原始碼連結區塊
            }
            externalDocumentationLink {
                // 外部文件連結區塊
            }
            perPackageOption {
                // 套件選項區塊
            }
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="suppress">
        <p>產生文件時是否應跳過此原始碼集。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="displayName">
        <p>用於指稱此原始碼集的顯示名稱。</p>
        <p>
            此名稱同時用於外部 (例如，作為文件讀者可見的原始碼集名稱) 和內部 (例如，用於 <code>reportUndocumented</code> 的日誌訊息)。
        </p>
        <p>預設情況下，該值是根據 Kotlin Gradle 外掛程式提供的信息推斷出來的。</p>
    </def>
    <def title="documentedVisibilities">
        <p>應記錄的可見性修飾符集。</p>
        <p>
            如果您想記錄 <code>protected</code> / <code>internal</code> / <code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並只記錄內部 API，則可以使用此選項。
        </p>
        <p>這可以根據每個套件進行配置。</p>
        <p>預設值：<code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未記錄宣告的警告，即經過 <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配良好。</p>
        <p>這可以根據每個套件進行配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            在套用各種過濾器後，是否跳過不包含任何可見宣告的套件。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 設定為 <code>true</code> 且您的套件只包含已淘汰的宣告，
            則該套件被視為空。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否記錄帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以根據每個套件進行配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="suppressGeneratedFiles">
        <p>是否文件化/分析產生檔案。</p>
        <p>
            產生檔案預期位於 <code>{project}/{buildDir}/generated</code> 目錄下。
        </p>
        <p>
            如果設定為 <code>true</code>，它會將該目錄中的所有檔案有效地新增到
            <code>suppressedFiles</code> 選項中，以便您可以手動配置它。
        </p>
        <p>預設值：<code>true</code></p>
    </def>
    <def title="jdkVersion">
        <p>產生 Java 類型外部文件連結時使用的 JDK 版本。</p>
        <p>
            例如，如果您在某些公開宣告簽名中使用 <code>java.util.UUID</code>，
            並且此選項設定為 <code>8</code>，Dokka 會為其產生一個連結到
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a> 的外部文件連結。
        </p>
        <p>預設值：JDK 8</p>
    </def>
    <def title="languageVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 語言版本</a>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境。
        </p>
        <p>預設情況下，會使用 Dokka 嵌入式編譯器可用的最新語言版本。</p>
    </def>
    <def title="apiVersion">
        <p>
            <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>
            用於設定分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            環境。
        </p>
        <p>預設情況下，它是從 <code>languageVersion</code> 推導出來的。</p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否產生引導至 Kotlin 標準函式庫 API 參考文件的外部文件連結。
        </p>
        <p>注意：當 <code>noStdLibLink</code> 設定為 <code>false</code> 時，連結**會**產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="noJdkLink">
        <p>是否產生連結到 JDK Javadoc 的外部文件連結。</p>
        <p>JDK Javadoc 的版本由 <code>jdkVersion</code> 選項決定。</p>
        <p>注意：當 <code>noJdkLink</code> 設定為 <code>false</code> 時，連結**會**產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="noAndroidSdkLink">
        <anchor name="includes"/>
        <p>是否產生連結到 Android SDK API 參考的外部文件連結。</p>
        <p>這僅與 Android 專案相關，否則會被忽略。</p>
        <p>注意：當 <code>noAndroidSdkLink</code> 設定為 <code>false</code> 時，連結**會**產生。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="includes">
        <p>
            包含
            <a href="dokka-module-and-package-docs.md">模組和套件文件</a>的 Markdown 檔案列表。
        </p>
        <p>指定檔案的內容將被解析並嵌入文件中作為模組和套件描述。</p>
        <p>
            有關其外觀和使用方式的範例，請參閱<a href="https://github.com/Kotlin/dokka/tree/master/examples/gradle/dokka-gradle-example">Dokka gradle 範例</a>。
        </p>
    </def>
    <def title="platform">
        <p>
            用於設定程式碼分析和 
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> 環境的平台。
        </p>
        <p>預設值是從 Kotlin Gradle 外掛程式提供的信息推導出來的。</p>
    </def>
    <def title="sourceRoots">
        <p>
            要分析和記錄的原始碼根目錄。
            可接受的輸入是目錄和單獨的 <code>.kt</code> / <code>.java</code> 檔案。
        </p>
        <p>預設情況下，原始碼根目錄是根據 Kotlin Gradle 外掛程式提供的信息推導出來的。</p>
    </def>
    <def title="classpath">
        <p>用於分析和互動式範例的類別路徑。</p>
        <p>如果某些來自依賴項的類型未自動解析/選取，這會很有用。</p>
        <p>此選項接受 <code>.jar</code> 和 <code>.klib</code> 檔案。</p>
        <p>預設情況下，類別路徑是根據 Kotlin Gradle 外掛程式提供的信息推導出來的。</p>
    </def>
    <def title="samples">
        <p>
            包含範例函式的目錄或檔案列表，這些函式透過
            <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a> KDoc 標籤引用。
        </p>
    </def>
</deflist>

### 原始碼連結配置

`sourceLinks` 配置區塊允許您為每個簽名新增一個 `source` 連結，該連結會帶有特定行號導向 `remoteUrl`。(行號可以透過設定 `remoteLineSuffix` 來配置)。

這有助於讀者找到每個宣告的原始碼。

例如，請參閱 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函式的文件。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        sourceLink {
            localDirectory.set(projectDir.resolve("src"))
            remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        sourceLink {
            localDirectory.set(file("src"))
            remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="localDirectory">
        <p>
            本地原始碼目錄的路徑。路徑必須相對於
            當前專案的根目錄。
        </p>
    </def>
    <def title="remoteUrl">
        <p>
            可供文件讀者存取的原始碼託管服務的 URL，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用於產生
            宣告的原始碼連結。
        </p>
    </def>
    <def title="remoteLineSuffix">
        <p>
            用於將原始碼行號附加到 URL 的後綴。這有助於讀者不僅導航
            到檔案，還導航到宣告的特定行號。
        </p>
        <p>
            數字本身會附加到指定的後綴。例如，
            如果此選項設定為 <code>#L</code> 且行號為 10，則產生的 URL 後綴
            為 <code>#L10</code>。
        </p>
        <p>
            常用服務使用的後綴：</p>
            <list>
                <li>GitHub: <code>#L</code></li>
                <li>GitLab: <code>#L</code></li>
                <li>Bitbucket: <code>#lines-</code></li>
            </list>
        <p>預設值：<code>#L</code></p>
    </def>
</deflist>

### 套件選項

`perPackageOption` 配置區塊允許為由 `matchingRegex` 匹配的特定套件設定一些選項。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        perPackageOption {
            matchingRegex.set(".*api.*")
            suppress.set(false)
            skipDeprecated.set(false)
            reportUndocumented.set(false)
            documentedVisibilities.set([Visibility.PUBLIC])
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>用於匹配套件的正則表達式。</p>
        <p>預設值：<code>.*</code></p>
    </def>
    <def title="suppress">
        <p>產生文件時是否應跳過此套件。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>是否記錄帶有 <code>@Deprecated</code> 註解的宣告。</p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否發出關於可見的未記錄宣告的警告，即經過 <code>documentedVisibilities</code> 和其他過濾器過濾後沒有 KDoc 的宣告。
        </p>
        <p>此設定與 <code>failOnWarning</code> 搭配良好。</p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>false</code></p>
    </def>
    <def title="documentedVisibilities">
        <p>應記錄的可見性修飾符集。</p>
        <p>
            如果您想記錄此套件中的 <code>protected</code> / <code>internal</code> / <code>private</code> 宣告，
            以及如果您想排除 <code>public</code> 宣告並只記錄內部 API，則可以使用此選項。
        </p>
        <p>這可以在原始碼集層級配置。</p>
        <p>預設值：<code>DokkaConfiguration.Visibility.PUBLIC</code></p>
    </def>
</deflist>

### 外部文件連結配置

`externalDocumentationLink` 區塊允許建立連結，導向您依賴項的外部託管文件。

例如，如果您正在使用 `kotlinx.serialization` 中的類型，預設情況下，它們在您的文件中是不可點擊的，就好像它們未解析一樣。然而，由於 `kotlinx.serialization` 的 API 參考文件由 Dokka 建構並 [發布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上，您可以為其配置外部文件連結。因此允許 Dokka 為函式庫中的類型產生連結，使其成功解析並可點擊。

預設情況下，Kotlin 標準函式庫、JDK、Android SDK 和 AndroidX 的外部文件連結已配置。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        externalDocumentationLink {
            url.set(URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                rootProject.projectDir.resolve("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    // ..
    // 一般配置區塊
    // ..
    
    dokkaSourceSets.configureEach {
        // ..
        // 原始碼集配置區塊
        // ..
        
        externalDocumentationLink {
            url.set(new URL("https://kotlinlang.org/api/kotlinx.serialization/"))
            packageListUrl.set(
                file("serialization.package.list").toURL()
            )
        }
    }
}
```

</tab>
</tabs>

<deflist collapsible="true">
    <def title="url">
        <p>要連結的文件根 URL。它**必須**包含尾隨斜線。</p>
        <p>
            Dokka 會盡力自動尋找 <code>package-list</code> 針對給定的 URL，
            並將宣告連結在一起。
        </p>
        <p>
            如果自動解析失敗或者您想改用本地快取檔案，
            請考慮設定 <code>packageListUrl</code> 選項。
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的確切位置。這是依賴 Dokka
            自動解析的替代方案。
        </p>
        <p>
            套件列表包含有關文件和專案本身的信息，
            例如模組和套件名稱。
        </p>
        <p>這也可以是一個本地快取檔案，以避免網路呼叫。</p>
    </def>
</deflist>

### 完整配置

您可以在下面看到同時套用所有可能的配置選項。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType<DokkaTask>().configureEach {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(layout.buildDirectory.dir("dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set(setOf(Visibility.PUBLIC))
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")
            
            sourceLink {
                localDirectory.set(projectDir.resolve("src"))
                remoteUrl.set(URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                    rootProject.projectDir.resolve("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set(
                    setOf(
                        Visibility.PUBLIC,
                        Visibility.PRIVATE,
                        Visibility.PROTECTED,
                        Visibility.INTERNAL,
                        Visibility.PACKAGE
                    )
                )
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.DokkaConfiguration.Visibility
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.Platform
import java.net.URL

// 注意：若要配置多專案建構，您需要 
//       配置子專案的 Partial 任務。
//       請參閱文件中的「配置範例」部分。
tasks.withType(DokkaTask.class) {
    moduleName.set(project.name)
    moduleVersion.set(project.version.toString())
    outputDirectory.set(file("build/dokka/$name"))
    failOnWarning.set(false)
    suppressObviousFunctions.set(true)
    suppressInheritedMembers.set(false)
    offlineMode.set(false)

    dokkaSourceSets {
        named("linux") {
            dependsOn("native")
            sourceRoots.from(file("linux/src"))
        }
        configureEach {
            suppress.set(false)
            displayName.set(name)
            documentedVisibilities.set([Visibility.PUBLIC])
            reportUndocumented.set(false)
            skipEmptyPackages.set(true)
            skipDeprecated.set(false)
            suppressGeneratedFiles.set(true)
            jdkVersion.set(8)
            languageVersion.set("1.7")
            apiVersion.set("1.7")
            noStdlibLink.set(false)
            noJdkLink.set(false)
            noAndroidSdkLink.set(false)
            includes.from(project.files(), "packages.md", "extra.md")
            platform.set(Platform.DEFAULT)
            sourceRoots.from(file("src"))
            classpath.from(project.files(), file("libs/dependency.jar"))
            samples.from(project.files(), "samples/Basic.kt", "samples/Advanced.kt")

            sourceLink {
                localDirectory.set(file("src"))
                remoteUrl.set(new URL("https://github.com/kotlin/dokka/tree/master/src"))
                remoteLineSuffix.set("#L")
            }

            externalDocumentationLink {
                url.set(new URL("https://kotlinlang.org/api/core/kotlin-stdlib/"))
                packageListUrl.set(
                        file("stdlib.package.list").toURL()
                )
            }

            perPackageOption {
                matchingRegex.set(".*api.*")
                suppress.set(false)
                skipDeprecated.set(false)
                reportUndocumented.set(false)
                documentedVisibilities.set([Visibility.PUBLIC])
            }
        }
    }
}
```

</tab>
</tabs>