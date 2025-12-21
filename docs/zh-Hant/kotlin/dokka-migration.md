[//]: # (title: 遷移至 Dokka Gradle 外掛 v2)

> 此頁面僅與您正在使用 DGPv1 並希望遷移至 DGPv2 有關。從 Dokka 2.1.0 開始，DGP v2 預設為啟用。
> 如果您正在使用 Dokka 2.1.0 或更高版本，
> 您可以跳過此頁面，直接前往 [Dokka Gradle 文件](dokka-gradle.md)。
>
{style="note"}

Dokka Gradle 外掛（DGP）是一款用於為使用 Gradle 建置的 Kotlin 專案產生全面 API 文件的工具。

DGP 無縫地處理 Kotlin 的 KDoc 註解和 Java 的 Javadoc 註解，以提取資訊並以 [HTML 或 Javadoc](#select-documentation-output-format) 格式建立結構化文件。

Dokka Gradle 外掛 v2 模式預設為啟用，並與 Gradle 最佳實踐保持一致：

*   採用 Gradle 型別，從而帶來更好的效能。
*   使用直觀的頂層 DSL 配置，而不是低階的基於任務的設定，這簡化了建置腳本及其可讀性。
*   對於文件聚合採用更具宣告性的方法，這使得多專案文件更易於管理。
*   使用型別安全的外掛配置，這提高了建置腳本的可靠性和可維護性。
*   完全支援 Gradle 的[配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)和[建置快取](https://docs.gradle.org/current/userguide/build_cache.html)，這提高了效能並簡化了建置工作。

請閱讀本指南，以了解有關從 DGP v1 模式變更和遷移至 v2 模式的更多資訊。

## 開始之前

在開始遷移之前，請完成以下步驟。

### 驗證支援版本

請確保您的專案符合最低版本要求：

| **工具** | **版本** |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html) | 7.6 或更高版本 |
| [Android Gradle 外掛](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高版本 |
| [Kotlin Gradle 外掛](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高版本 |

### 啟用 DGP v2

在您專案的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中，將 Dokka 版本更新為 %dokkaVersion%：

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

或者，
您可以使用 [version catalog](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)
來啟用 Dokka Gradle 外掛 v2。

> 預設情況下，DGP v2 會以 HTML 格式產生文件。若要產生 Javadoc 或同時產生 HTML 和 Javadoc 格式，
> 請新增相應的外掛。有關外掛的更多資訊，請參閱[選擇文件輸出格式](#select-documentation-output-format)。
>
{style="tip"}

### 啟用遷移輔助工具

在專案的 `gradle.properties` 檔案中，設定以下 Gradle 屬性以啟用帶有輔助工具的 DGP v2：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 如果您的專案沒有 `gradle.properties` 檔案，請在專案的根目錄中建立一個。
>
{style="tip"}

此屬性會啟用帶有遷移輔助工具的 DGP v2 外掛。這些輔助工具可以防止建置腳本引用 DGP v1 中不再可用的任務時出現編譯錯誤。

> 遷移輔助工具不會主動協助遷移。它們只會在您轉換到新 API 時防止您的建置腳本損壞。
>
{style="note"}

完成遷移後，[停用遷移輔助工具](#set-the-opt-in-flag)。

### 將您的專案與 Gradle 同步

啟用 DGP v2 和遷移輔助工具後，
將您的專案與 Gradle 同步，以確保 DGP v2 已正確應用：

*   如果您使用 IntelliJ IDEA，請點擊 Gradle 工具視窗中的**重新載入所有 Gradle 專案** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} 按鈕。
*   如果您使用 Android Studio，請選擇 **File** | **Sync Project with Gradle Files**。

## 遷移您的專案

將 Dokka Gradle 外掛更新到 v2 後，請按照適用於您專案的遷移步驟進行操作。

### 調整配置選項

DGP v2 在 [Gradle 配置選項](dokka-gradle-configuration-options.md)中引入了一些變更。在 `build.gradle.kts` 檔案中，根據您的專案設定調整配置選項。

#### DGP v2 中的頂層 DSL 配置

將 DGP v1 的配置語法替換為 DGP v2 的頂層 `dokka {}` DSL 配置：

DGP v1 中的配置：

```kotlin
tasks.withType<DokkaTask>().configureEach {
    suppressInheritedMembers.set(true)
    failOnWarning.set(true)
    dokkaSourceSets {
        named("main") {
            moduleName.set("Project Name")
            includes.from("README.md")
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://example.com/src"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}

tasks.dokkaHtml {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customStyleSheets.set(listOf("styles.css"))
        customAssets.set(listOf("logo.png"))
        footerMessage.set("(c) Your Company")
    }
}
```

DGP v2 中的配置：

由於 Gradle 的 Kotlin DSL 使用型別安全的存取器，`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛的檔案）不同。

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    moduleName.set("Project Name")
    dokkaPublications.html {
        suppressInheritedMembers.set(true)
        failOnWarning.set(true)
    }
    dokkaSourceSets.main {
        includes.from("README.md")
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://example.com/src")
            remoteLineSuffix.set("#L")
        }
    }
    pluginsConfiguration.html {
        customStyleSheets.from("styles.css")
        customAssets.from("logo.png")
        footerMessage.set("(c) Your Company")
    }
}
```

</tab>
<tab title="Kotlin 自訂外掛" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension
import org.jetbrains.dokka.gradle.engine.plugins.DokkaHtmlPluginParameters

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")

        project.extensions.configure(DokkaExtension::class.java) { dokka ->

            dokka.dokkaPublications.named("html") { publication ->
                publication.suppressInheritedMembers.set(true)
                publication.failOnWarning.set(true)
            }

            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }

            dokka.pluginsConfiguration.named("html", DokkaHtmlPluginParameters::class.java) { html ->
                html.customStyleSheets.from("styles.css")
                html.customAssets.from("logo.png")
                html.footerMessage.set("(c) Your Company")
            }
        }
    }
}
```

</tab>
</tabs>

#### 可見性設定

將 `documentedVisibilities` 屬性從 `Visibility.PUBLIC` 設定為 `VisibilityModifier.Public`。

DGP v1 中的配置：

```kotlin
import org.jetbrains.dokka.DokkaConfiguration.Visibility

// ...
documentedVisibilities.set(
    setOf(Visibility.PUBLIC)
) 
```

DGP v2 中的配置：

```kotlin
import org.jetbrains.dokka.gradle.engine.parameters.VisibilityModifier

// ...
documentedVisibilities.set(
    setOf(VisibilityModifier.Public)
)

// OR

documentedVisibilities(VisibilityModifier.Public)
```

此外，使用 DGP v2 的[公用函式](https://github.com/Kotlin/dokka/blob/v2.1.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)來新增文件可見性：

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### 原始碼連結

配置原始碼連結以允許從產生出的文件導航至遠端儲存庫中對應的原始碼。
使用 `dokkaSourceSets.main{}` 區塊進行此配置。

DGP v1 中的配置：

```kotlin
tasks.withType<DokkaTask>().configureEach {
    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(URL("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

DGP v2 中的配置：

由於 Gradle 的 Kotlin DSL 使用型別安全的存取器，`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛的檔案）不同。

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl("https://github.com/your-repo")
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Kotlin 自訂外掛" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaSourceSets.named("main") { dss ->
                dss.includes.from("README.md")
                dss.sourceLink {
                    it.localDirectory.set(project.file("src/main/kotlin"))
                    it.remoteUrl("https://example.com/src")
                    it.remoteLineSuffix.set("#L")
                }
            }
        }
    }
}
```

</tab>
</tabs>

由於原始碼連結配置已[變更](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)，
請使用 `URI` 類別而不是 `URL` 來指定遠端 URL。

DGP v1 中的配置：

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2 中的配置：

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// or

remoteUrl("https://github.com/your-repo")
```

此外，DGP v2 有兩個用於設定 URL 的[公用函式](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)：

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 外部文件連結

使用 `register()` 方法註冊外部文件連結以定義每個連結。
`externalDocumentationLinks` API 採用此方法，與 Gradle DSL 慣例保持一致。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtml {
    dokkaSourceSets {
        configureEach {
            externalDocumentationLink {
                url = URL("https://example.com/docs/")
                packageListUrl = File("/path/to/package-list").toURI().toURL()
            }
        }
    }
}
```

DGP v2 中的配置：

```kotlin
dokka {
    dokkaSourceSets.configureEach {
        externalDocumentationLinks.register("example-docs") {
            url("https://example.com/docs/")
            packageListUrl("https://example.com/docs/package-list")
        }
    }
}
```

#### 自訂資產

使用 [`customAssets`](dokka-html.md#customize-assets) 屬性與檔案集合 [(`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)，而不是列表 [(`var List<File>`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties)。

DGP v1 中的配置：

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2 中的配置：

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 輸出目錄

使用 `dokka {}` 區塊來指定產生 Dokka 文件的輸出目錄。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtml {
    outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
}
```

DGP v2 中的配置：

```kotlin
dokka {
    dokkaPublications.html {
        outputDirectory.set(layout.buildDirectory.dir("dokkaDir"))
    }
}
```

#### 附加檔案的輸出目錄

在 `dokka {}` 區塊內指定輸出目錄並包含單模組和多模組專案的附加檔案。

在 DGP v2 中，單模組和多模組專案的配置已統一。
不再需要單獨配置 `dokkaHtml` 和 `dokkaHtmlMultiModule` 任務，而是在 `dokka {}` 區塊內的 `dokkaPublications.html {}` 中指定設定。

對於多模組專案，請在根專案的配置中設定輸出目錄並包含附加檔案（例如 `README.md`）。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2 中的配置：

由於 Gradle 的 Kotlin DSL 使用型別安全的存取器，`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛的檔案）不同。

<tabs group="dokka-configuration">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// build.gradle.kts

dokka {
    dokkaPublications.html {
        outputDirectory.set(rootDir.resolve("docs/api/0.x"))
        includes.from(project.layout.projectDirectory.file("README.md"))
    }
}
```

</tab>
<tab title="Kotlin 自訂外掛" group-key="kotlin custom">

```kotlin
// CustomPlugin.kt

import org.gradle.api.Plugin
import org.gradle.api.Project
import org.jetbrains.dokka.gradle.DokkaExtension

abstract class CustomPlugin : Plugin<Project> {
    override fun apply(project: Project) {
        project.plugins.apply("org.jetbrains.dokka")
        project.extensions.configure(DokkaExtension::class.java) { dokka ->
            dokka.dokkaPublications.named("html") { html ->
                html.outputDirectory.set(project.rootDir.resolve("docs/api/0.x"))
                html.includes.from(project.layout.projectDirectory.file("README.md"))
            }
        }
    }
}
```

</tab>
</tabs>

### 配置 Dokka 外掛

使用 JSON 配置內建 Dokka 外掛的方式已被棄用，取而代之的是型別安全的 DSL。此更改提高了與 Gradle 增量建置系統的兼容性，並改進了任務輸入追蹤。

DGP v1 中的配置：

在 DGP v1 中，Dokka 外掛是手動使用 JSON 配置的。這種方法在 Gradle 最新檢查的[註冊任務輸入](https://docs.gradle.org/current/userguide/incremental_build.html)時造成了問題。

以下是針對 [Dokka 版本控制外掛](https://kotl.in/dokka-versioning-plugin)的已棄用 JSON 式配置範例：

```kotlin
tasks.dokkaHtmlMultiModule {
    pluginsMapConfiguration.set(
        mapOf(
            "org.jetbrains.dokka.versioning.VersioningPlugin" to """
                { "version": "1.2", "olderVersionsDir": "$projectDir/dokka-docs" }
                """.trimIndent()
        )
    )
}
```

DGP v2 中的配置：

在 DGP v2 中，Dokka 外掛使用型別安全的 DSL 進行配置。若要以型別安全的方式配置 Dokka 外掛，請使用 `pluginsConfiguration{}` 區塊：

```kotlin
dokka {
    pluginsConfiguration {
        versioning {
            version.set("1.2")
            olderVersionsDir.set(projectDir.resolve("dokka-docs"))
        }
    }
}
```

有關 DGP v2 配置的範例，請參閱
[Dokka 的版本控制外掛](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

DGP v2 允許您透過[配置自訂外掛](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)來擴展其功能。
自訂外掛可啟用對文件產生過程的額外處理或修改。

### 跨模組共用 Dokka 配置

DPG v2 不再使用 `subprojects {}` 或 `allprojects {}` 來跨模組共用配置。在未來的 Gradle 版本中，
使用這些方法將[導致錯誤](https://docs.gradle.org/current/userguide/isolated_projects.html)。

請按照以下步驟，在[具有現有慣例外掛的多模組專案](#multi-module-projects-with-convention-plugins)
或[沒有慣例外掛的多模組專案](#multi-module-projects-without-convention-plugins)中正確共用 Dokka 配置。

共用 Dokka 配置後，您可以將多個模組的文件聚合到單一輸出中。有關更多資訊，請參閱
[更新多模組專案中的文件聚合](#update-documentation-aggregation-in-multi-module-projects)。

> 有關多模組專案範例，請參閱 [Dokka GitHub 儲存庫](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 沒有慣例外掛的多模組專案

如果您的專案未使用慣例外掛，您仍然可以透過直接配置每個模組來共用 Dokka 配置。
這涉及在每個模組的 `build.gradle.kts` 檔案中手動設定共用配置。雖然這種方法集中性較低，
但它避免了對慣例外掛等額外設定的需求。

否則，如果您的專案使用慣例外掛，您也可以透過在 `buildSrc` 目錄中建立一個慣例外掛，然後將該外掛應用於您的模組（子專案）來在多模組專案中共用 Dokka 配置。

##### 設定 buildSrc 目錄

1.  在您的專案根目錄中，建立一個 `buildSrc` 目錄，其中包含兩個檔案：

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  在 `buildSrc/settings.gradle.kts` 檔案中，新增以下片段：

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  在 `buildSrc/build.gradle.kts` 檔案中，新增以下片段：

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:%dokkaVersion%")
    }   
    ```

##### 設定 Dokka 慣例外掛

設定 `buildSrc` 目錄後：

1.  建立一個 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 檔案來存放[慣例外掛](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2.  在 `dokka-convention.gradle.kts` 檔案中，新增以下片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // The shared configuration goes here
    }
    ```

    您需要將所有子專案通用的共用 Dokka [配置](#adjust-configuration-options)新增到 `dokka {}` 區塊中。
    此外，您無需指定 Dokka 版本。版本已在 `buildSrc/build.gradle.kts` 檔案中設定。

##### 將慣例外掛應用於您的模組

將 Dokka 慣例外掛應用於您的模組（子專案），方法是將其新增到每個子專案的 `build.gradle.kts` 檔案中：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 具有慣例外掛的多模組專案

如果您已經有慣例外掛，請按照 [Gradle 的文件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)建立一個專用的 Dokka 慣例外掛。

然後，請按照步驟[設定 Dokka 慣例外掛](#set-up-the-dokka-convention-plugin)並
[將其應用於您的模組](#apply-the-convention-plugin-to-your-subprojects)。

### 更新多模組專案中的文件聚合

Dokka 可以將多個模組（子專案）的文件聚合到單一輸出或發佈中。

如[解釋](#apply-the-convention-plugin-to-your-subprojects)所述，在聚合文件之前，請將 Dokka 外掛應用於所有可建立文件的子專案。

DGP v2 中的聚合使用 `dependencies {}` 區塊而不是任務，並且可以添加到任何 `build.gradle.kts` 檔案中。

在 DGP v1 中，聚合是隱式地在根專案中建立的。為了在 DGP v2 中重現此行為，請在根專案的 `build.gradle.kts` 檔案中新增 `dependencies {}` 區塊。

DGP v1 中的聚合：

```kotlin
    tasks.dokkaHtmlMultiModule {
        // ...
    }
```

DGP v2 中的聚合：

```kotlin
dependencies {
    dokka(project(":some-subproject:"))
    dokka(project(":another-subproject:"))
}
```

### 變更聚合文件的目錄

當 DGP 聚合模組時，每個子專案在聚合文件內都有自己的子目錄。

在 DGP v2 中，聚合機制已更新，以更好地與 Gradle 慣例保持一致。
DGP v2 現在保留完整的子專案目錄，以防止在任何位置聚合文件時發生衝突。

DGP v1 中的聚合目錄：

在 DGP v1 中，聚合文件被放置在一個折疊的目錄結構中。
例如，對於一個在 `:turbo-lib` 中進行聚合的專案和一個巢狀子專案 `:turbo-lib:maths`，
產生出的文件會放置在：

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2 中的聚合目錄：

DGP v2 透過保留完整的專案結構來確保每個子專案都有一個唯一的目錄。現在相同的聚合文件遵循此結構：

```text

turbo-lib/build/dokka/html/turbo-lib/maths/
```

此變更可防止同名子專案的衝突。然而，由於目錄結構已變更，外部連結可能會過時，潛在導致 `404` 錯誤。

#### 恢復到 DGP v1 的目錄行為

如果您的專案依賴於 DGP v1 中使用的目錄結構，您可以透過手動指定模組目錄來恢復此行為。
將以下配置新增到每個子專案的 `build.gradle.kts` 檔案中：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // Overrides the subproject directory to match the V1 structure
    modulePath.set("maths")
}
```

### 使用更新後的任務產生文件

DGP v2 已重新命名了產生 API 文件的 Gradle 任務。

DGP v1 中的任務：

```text
./gradlew dokkaHtml

// or

./gradlew dokkaHtmlMultiModule
```

DGP v2 中的任務：

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 任務會在 `build/dokka/` 目錄中產生 API 文件。

在 DGP v2 版本中，`dokkaGenerate` 任務名稱適用於單模組和多模組專案。您可以使用不同的任務
以 HTML、Javadoc 或同時以 HTML 和 Javadoc 格式產生輸出。有關更多資訊，請參閱[選擇文件輸出格式](#select-documentation-output-format)。

### 選擇文件輸出格式

> Javadoc 輸出格式處於 [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 階段。
> 使用它時，您可能會遇到錯誤和遷移問題。不保證能成功與接受 Javadoc 作為輸入的工具整合。請自行承擔風險使用。
>
{style="warning"}

DGP v2 的預設輸出格式是 HTML。然而，您可以選擇同時產生 HTML、Javadoc 或兩種格式的 API 文件：

1.  將對應的外掛 `id` 放置在您專案的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中：

    ```kotlin
    plugins {
        // Generates HTML documentation
        id("org.jetbrains.dokka") version "%dokkaVersion%"

        // Generates Javadoc documentation
        id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

        // Keeping both plugin IDs generates both formats
    }
    ```

2.  執行對應的 Gradle 任務。

以下是與每種格式相對應的外掛 `id` 和 Gradle 任務列表：

|             | **HTML** | **Javadoc** | **兩者** |
|-------------|--------------------------------|-------------------------------------|-----------------------------------|
| 外掛 `id` | `id("org.jetbrains.dokka")` | `id("org.jetbrains.dokka-javadoc")` | 使用 HTML 和 Javadoc 外掛 |
| Gradle 任務 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate` |

> `dokkaGenerate` 任務會根據已應用的外掛產生所有可用格式的文件。
> 如果同時應用了 HTML 和 Javadoc 外掛，您可以選擇僅透過執行 `dokkaGeneratePublicationHtml` 任務來產生 HTML，
> 或僅透過執行 `dokkaGeneratePublicationJavadoc` 任務來產生 Javadoc。
>
{style="tip"}

如果您使用 IntelliJ IDEA，您可能會看到 `dokkaGenerateHtml` Gradle 任務。此任務只是 `dokkaGeneratePublicationHtml` 的別名。兩個任務執行完全相同的操作。

### 處理棄用和移除

*   **輸出格式支援：** DGP v2 僅支援 HTML 和 Javadoc 輸出。Markdown 和 Jekyll 等實驗性格式不再支援。
*   **Collector 任務：** `DokkaCollectorTask` 已被移除。現在，您需要為每個子專案單獨產生文件，
    然後在必要時[聚合文件](#update-documentation-aggregation-in-multi-module-projects)。

## 完成遷移

遷移專案後，執行這些步驟以完成並改善效能。

### 設定選用標誌

成功遷移後，在專案的 `gradle.properties` 檔案中設定以下不帶輔助工具的選用標誌：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

如果您移除了對 DGP v1 中不再可用於 DGP v2 的 Gradle 任務的引用，
您應該不會看到相關的編譯錯誤。

### 啟用建置快取和配置快取

DGP v2 現在支援 Gradle 建置快取和配置快取，從而提高建置效能。

*   若要啟用建置快取，請遵循 [Gradle 建置快取文件](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)中的說明。
*   若要啟用配置快取，請遵循 [Gradle 配置快取文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable )中的說明。

## 疑難排解

在大型專案中，Dokka 在產生文件時會消耗大量記憶體。
這可能會超出 Gradle 的記憶體限制，尤其是在處理大量資料時。

當 Dokka 產生記憶體不足時，建置會失敗，Gradle 可能會拋出例如 `java.lang.OutOfMemoryError: Metaspace` 的例外。

目前正積極努力改進 Dokka 的效能，儘管某些限制源於 Gradle。

如果您遇到記憶體問題，請嘗試以下變通方法：

*   [增加堆積空間](#increase-heap-space)
*   [在 Gradle 流程中執行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆積空間

解決記憶體問題的一種方法是增加 Dokka 產生器流程的 Java 堆積記憶體量。
在 `build.gradle.kts` 檔案中，調整
以下配置選項：

```kotlin
    dokka {
        // Dokka generates a new process managed by Gradle
        dokkaGeneratorIsolation = ProcessIsolation {
            // Configures heap size
            maxHeapSize = "4g"
        }
    }
```

在此範例中，最大堆積大小設定為 4 GB (`"4g"`)。請調整並測試該值，以找到您建置的最佳設定。

如果您發現 Dokka 需要顯著擴展的堆積大小，例如遠高於 Gradle 本身的記憶體使用量，
請[在 Dokka 的 GitHub 儲存庫上建立一個問題](https://kotl.in/dokka-issues)。

> 您必須將此配置應用於每個子專案。建議您在應用於所有子專案的慣例外掛中配置 Dokka。
>
{style="note"}

### 在 Gradle 流程中執行 Dokka

當 Gradle 建置和 Dokka 產生都需要大量記憶體時，它們可能會作為單獨的流程執行，
在單一機器上消耗大量記憶體。

為了最佳化記憶體使用，您可以在相同的 Gradle 流程中執行 Dokka，而不是作為單獨的流程。這
讓您只需配置一次 Gradle 的記憶體，而無需為每個流程單獨分配記憶體。

若要在相同的 Gradle 流程中執行 Dokka，請在 `build.gradle.kts` 檔案中調整以下配置選項：

```kotlin
    dokka {
        // Runs Dokka in the current Gradle process
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

與[增加堆積空間](#increase-heap-space)一樣，請測試此配置以確認其對您的專案運作良好。

有關配置 Gradle JVM 記憶體的更多詳細資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 更改 Gradle 的 Java 選項會啟動一個新的 Gradle 常駐程式，它可能會長時間保持活動狀態。您可以[手動停止任何其他 Gradle 流程](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，`ClassLoaderIsolation()` 配置的 Gradle 問題可能會[導致記憶體洩漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}

## 接下來是什麼

*   [探索更多 DGP v2 專案範例](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。
*   [開始使用 Dokka](dokka-get-started.md)。
*   [了解更多關於 Dokka 外掛的資訊](dokka-plugins.md)。