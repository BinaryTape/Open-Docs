[//]: # (title: 遷移至 Dokka Gradle 外掛程式 v2)

> 本頁面僅在您使用 DGPv1 並希望遷移至 DGPv2 時適用。從 Dokka 2.1.0 開始，預設啟用 DGP v2。
> 如果您使用的是 Dokka 2.1.0 或更高版本，
> 可以跳過此頁面並直接前往 [Dokka Gradle 文件](dokka-gradle.md)。
>
{style="note"}

Dokka Gradle 外掛程式 (DGP) 是一款用於為使用 Gradle 建置的 Kotlin 專案產生全面 API 文件的工具。

DGP 可順暢處理 Kotlin 的 KDoc 註解和 Java 的 Javadoc 註解，以提取資訊並建立 
[HTML 或 Javadoc](#select-documentation-output-format) 格式的結構化文件。

Dokka Gradle 外掛程式 v2 模式預設為啟用，且符合 Gradle 最佳實務：

* 採用 Gradle 型別，進而獲得更好的效能。
* 使用直觀的頂層 DSL 配置，而非低階的基於任務的設定，這簡化了建置指令碼及其可讀性。
* 採取更具宣告性的方式進行文件聚合，使多專案文件更易於管理。
* 使用型別安全的外掛程式配置，提高建置指令碼的可靠性和維護性。
* 全面支援 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html)與 
  [建置快取](https://docs.gradle.org/current/userguide/build_cache.html)，進而提升效能並簡化建置工作。

閱讀本指南以了解有關 DGP v1 到 v2 模式的變更和遷移的進一步資訊。

## 開始之前

在開始遷移之前，請完成以下步驟。

### 驗證支援的版本

確保您的專案符合最低版本需求：

| **工具**                                                                          | **版本**      |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 或更高版本 |
| [Android Gradle 外掛程式](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高版本 |
| [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高版本 |

### 啟用 DGP v2

在專案 `build.gradle.kts` 檔案的 `plugins {}` 區塊中，將 Dokka 版本更新為 %dokkaVersion%：

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

或者，
您可以使用[版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)
來啟用 Dokka Gradle 外掛程式 v2。

> 預設情況下，DGP v2 以 HTML 格式產生文件。要產生 Javadoc 或同時產生 HTML 和 Javadoc 格式，
> 請加入對應的外掛程式。有關外掛程式的更多資訊，請參閱[選取文件輸出格式](#select-documentation-output-format)。
>
{style="tip"}

### 啟用遷移幫助程式

在專案的 `gradle.properties` 檔案中，設定以下 Gradle 屬性以啟動帶有幫助程式的 DGP v2：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 如果您的專案沒有 `gradle.properties` 檔案，請在專案的根目錄中建立一個。
>
{style="tip"}

此屬性會啟動帶有遷移幫助程式的 DGP v2 外掛程式。當建置指令碼引用 DGP v1 中存在但在 DGP v2 中已不再提供的任務時，這些幫助程式可以防止編譯錯誤。

> 遷移幫助程式不會主動協助遷移。它們僅在您過渡到新 API 時，防止您的建置指令碼發生中斷。
>
{style="note"}

完成遷移後，[停用遷移幫助程式](#set-the-opt-in-flag)。

### 將您的專案與 Gradle 同步

啟用 DGP v2 和遷移幫助程式後， 
將您的專案與 Gradle 同步，以確保 DGP v2 已正確套用：

* 如果您使用 IntelliJ IDEA，請點擊 Gradle 工具視窗中的 **Reload All Gradle Projects** ![Reload button](gradle-reload-button.png){width=30}{type="joined"} 按鈕。
* 如果您使用 Android Studio，請選取 **File** | **Sync Project with Gradle Files**。

## 遷移您的專案

更新 Dokka Gradle 外掛程式至 v2 後，請遵循適用於您專案的遷移步驟。

### 調整配置選項

DGP v2 在 [Gradle 配置選項](dokka-gradle-configuration-options.md)中引入了一些變更。請在 `build.gradle.kts` 檔案中根據您的專案設定調整配置選項。

#### DGP v2 中的頂層 DSL 配置

將 DGP v1 的配置語法取代為 DGP v2 的頂層 `dokka {}` DSL 配置：

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

`build.gradle.kts` 檔案的語法與一般的 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全存取子。

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
<tab title="Kotlin 自訂外掛程式" group-key="kotlin custom">

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

將 `documentedVisibilities` 屬性從 `Visibility.PUBLIC` 改為 `VisibilityModifier.Public`。

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

// 或者

documentedVisibilities(VisibilityModifier.Public)
```

此外，使用 DGP v2 的[公用函式](https://github.com/Kotlin/dokka/blob/v2.2.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16)來加入已記錄的可見性：

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList()) 
```

#### 原始碼連結

配置原始碼連結，以允許從產生的文件導覽至遠端存儲庫中對應的原始碼。 
請使用 `dokkaSourceSets.main{}` 區塊進行此配置。

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

`build.gradle.kts` 檔案的語法與一般的 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全存取子。

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
<tab title="Kotlin 自訂外掛程式" group-key="kotlin custom">

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
請使用 `URI` 類別而非 `URL` 來指定遠端 URL。

DGP v1 中的配置：

```kotlin
remoteUrl.set(URL("https://github.com/your-repo"))
```

DGP v2 中的配置：

```kotlin
remoteUrl.set(URI("https://github.com/your-repo"))

// 或者

remoteUrl("https://github.com/your-repo")
```

此外，DGP v2 有兩個[公用函式](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)
用於設定 URL：

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// 以及

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 外部文件連結

使用 `register()` 方法註冊外部文件連結，以定義每個連結。
`externalDocumentationLinks` API 使用此方法，以符合 Gradle DSL 慣例。

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

#### 自訂資源

將 [`customAssets`](dokka-html.md#customize-assets) 屬性與檔案集合 [(`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties) 配合使用，而非列表 (`var List<File>`)。

DGP v1 中的配置：

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2 中的配置：

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 輸出目錄

使用 `dokka {}` 區塊指定產生的 Dokka 文件的輸出目錄。

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

#### 其他檔案的輸出目錄

在 `dokka {}` 區塊內為單模組和多模組專案指定輸出目錄並包含其他檔案。

在 DGP v2 中，單模組和多模組專案的配置是統一的。 
無需分別配置 `dokkaHtml` 和 `dokkaHtmlMultiModule` 任務，只需在 `dokka {}` 區塊內的 `dokkaPublications.html {}` 中指定設定即可。

對於多模組專案，請在根專案的配置中設定輸出目錄並包含其他檔案（例如 `README.md`）。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2 中的配置：

`build.gradle.kts` 檔案的語法與一般的 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全存取子。

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
<tab title="Kotlin 自訂外掛程式" group-key="kotlin custom">

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

### 配置 Dokka 外掛程式

棄用使用 JSON 配置內建的 Dokka 外掛程式，改用型別安全 DSL。此變更提高了與 Gradle 漸進式建置系統的相容性，並改善了任務輸入追蹤。

DGP v1 中的配置：

在 DGP v1 中，Dokka 外掛程式是使用 JSON 手動配置的。這種方法在 Gradle 的最新檢查中[註冊任務輸入](https://docs.gradle.org/current/userguide/incremental_build.html)時會產生問題。

以下是針對 [Dokka 版本控制外掛程式](https://kotl.in/dokka-versioning-plugin)被棄用的基於 JSON 的配置範例：

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

在 DGP v2 中，Dokka 外掛程式使用型別安全 DSL 進行配置。要以型別安全的方式配置 Dokka 外掛程式，請使用 `pluginsConfiguration{}` 區塊：

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
[Dokka 的版本控制外掛程式](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

DGP v2 允許您透過[配置自訂外掛程式](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts)來擴充其功能。
自訂外掛程式可在文件產生過程中進行額外的處理或修改。

### 跨子專案共用 Dokka 配置

DPG v2 不再使用 `subprojects {}` 或 `allprojects {}` 來跨子專案共用配置。在未來的 Gradle 版本中， 
使用這些方法將[導致錯誤](https://docs.gradle.org/current/userguide/isolated_projects.html)。

請依照以下步驟，在[具有現有慣例外掛程式](#multi-module-projects-with-convention-plugins)或[不具有慣例外掛程式](#multi-module-projects-without-convention-plugins)的多模組專案中正確共用 Dokka 配置。

共用 Dokka 配置後，您可以將多個子專案的文件聚合到單個輸出中。欲了解更多資訊，請參閱
[更新多模組專案中的文件聚合](#update-documentation-aggregation-in-multi-module-projects)。

> 有關多模組專案範例，請參閱 [Dokka GitHub 存儲庫](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 不具有慣例外掛程式的多模組專案

如果您的專案不使用慣例外掛程式，您仍可透過直接配置每個子專案來共用 Dokka 配置。 
這涉及在每個子專案的 `build.gradle.kts` 檔案中手動設定共用配置。雖然這種方法較不集中， 
但它避免了建立慣例外掛程式等額外設定的需求。

或者，如果您的專案使用慣例外掛程式，您也可以在多模組專案中， 
透過在 `buildSrc` 目錄中建立一個慣例外掛程式，然後將該外掛程式套用到子專案中來共用 Dokka 配置。

##### 設定 buildSrc 目錄

1. 在您的專案根目錄中，建立一個包含兩個檔案的 `buildSrc` 目錄：

   * `settings.gradle.kts`
   * `build.gradle.kts`

2. 在 `buildSrc/settings.gradle.kts` 檔案中，加入以下程式碼片段：

   ```kotlin
   rootProject.name = "buildSrc"
   ```

3. 在 `buildSrc/build.gradle.kts` 檔案中，加入以下程式碼片段：

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

##### 設定 Dokka 慣例外掛程式

設定 `buildSrc` 目錄後：

1. 建立一個 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 檔案來託管[慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2. 在 `dokka-convention.gradle.kts` 檔案中，加入以下程式碼片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // 共用配置寫在這裡
    }
    ```

   您需要在 `dokka {}` 區塊中加入所有子專案通用的共用 Dokka [配置](#adjust-configuration-options)。
   此外，您不需要指定 Dokka 版本。版本已經在 `buildSrc/build.gradle.kts` 檔案中設定。

##### 將慣例外掛程式套用至您的子專案

透過將 Dokka 慣例外掛程式加入每個子專案的 `build.gradle.kts` 檔案中，在您的子專案中套用該外掛程式：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 具有慣例外掛程式的多模組專案

如果您已有慣例外掛程式，請參考 [Gradle 的文件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)建立專用的 Dokka 慣例外掛程式。

然後，依照步驟[設定 Dokka 慣例外掛程式](#set-up-the-dokka-convention-plugin)並 
[在您的子專案中套用](#apply-the-convention-plugin-to-your-subprojects)。

### 更新多模組專案中的文件聚合

Dokka 可以將多個子專案的文件聚合到單個輸出或出版物中。

如[前文所述](#apply-the-convention-plugin-to-your-subprojects)，在聚合文件之前，請將 Dokka 外掛程式套用到所有可記錄的文件子專案。

DGP v2 中的聚合使用 `dependencies {}` 區塊而非任務，且可以加入到任何 `build.gradle.kts` 檔案中。 

在 DGP v1 中，聚合是隱式地在根專案中建立的。要在 DGP v2 中複製此行為，請在根專案的 `build.gradle.kts` 檔案中加入 `dependencies {}` 區塊。

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

當 DGP 聚合子專案時，每個子專案在聚合文件中都有其專屬的子目錄。

在 DGP v2 中，聚合機制已更新，以更符合 Gradle 慣例。 
DGP v2 現在會保留完整的子專案目錄，以防止在任何位置聚合文件時發生衝突。

DGP v1 中的聚合目錄：

在 DGP v1 中，聚合的文件被放置在收合的目錄結構中。 
例如，假設一個專案在 `:turbo-lib` 中進行聚合，且有一個巢狀子專案 `:turbo-lib:maths`， 
產生的文件被放置在：

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2 中的聚合目錄：

DGP v2 透過保留完整的專案結構，確保每個子專案都有唯一的目錄。相同的聚合文件現在遵循此結構：

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

此變更可防止同名的子專案發生衝突。但是，由於目錄結構已變更，外部連結 
可能會過時，並可能導致 `404` 錯誤。

#### 恢復為 DGP v1 的目錄行為

如果您的專案依賴 DGP v1 中使用的目錄結構，您可以透過手動指定子專案目錄來恢復此行為。
在每個子專案的 `build.gradle.kts` 檔案中加入以下配置：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 覆寫子專案目錄以符合 V1 結構
    modulePath.set("maths")
}
```

### 使用更新後的任務產生文件

DGP v2 已重新命名用於產生 API 文件的 Gradle 任務。

DGP v1 中的任務：

```text
./gradlew dokkaHtml

// 或者

./gradlew dokkaHtmlMultiModule
```

DGP v2 中的任務：

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 任務在 `build/dokka/` 目錄中產生 API 文件。

在 DGP v2 版本中，`dokkaGenerate` 任務名稱同時適用於單模組和多模組專案。您可以使用不同的任務
來以 HTML、Javadoc 或同時以 HTML 和 Javadoc 格式產生輸出。欲了解更多資訊，請參閱[選取文件輸出格式](#select-documentation-output-format)。

### 選取文件輸出格式

> Javadoc 輸出格式處於 [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 階段。
> 使用它時，您可能會遇到錯誤和遷移問題。不保證能與接受 Javadoc 作為輸入的工具成功整合。請自行承擔風險。
>
{style="warning"}

DGP v2 的預設輸出格式為 HTML。但是，您可以選擇以 HTML、Javadoc 
或同時以兩種格式產生 API 文件：

1. 在專案 `build.gradle.kts` 檔案的 `plugins {}` 區塊中放置對應的外掛程式 `id`：

   ```kotlin
   plugins {
       // 產生 HTML 文件
       id("org.jetbrains.dokka") version "%dokkaVersion%"

       // 產生 Javadoc 文件
       id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

       // 同時保留兩個外掛程式 ID 會產生兩種格式
   }
   ```

2. 執行對應的 Gradle 任務。

以下是每種格式對應的外掛程式 `id` 和 Gradle 任務列表：

|             | **HTML**                       | **Javadoc**                         | **兩者皆有**                          |
|-------------|--------------------------------|-------------------------------------|-----------------------------------|
| 外掛程式 `id` | `id("org.jetbrains.dokka")`    | `id("org.jetbrains.dokka-javadoc")` | 同時使用 HTML 和 Javadoc 外掛程式 |
| Gradle 任務 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc`   | `./gradlew :dokkaGenerate`        |

> `dokkaGenerate` 任務會根據套用的外掛程式，以所有可用的格式產生文件。 
> 如果同時套用了 HTML 和 Javadoc 外掛程式，您可以選擇僅透過執行 `dokkaGeneratePublicationHtml` 任務來產生 HTML， 
> 或僅透過執行 `dokkaGeneratePublicationJavadoc` 任務來產生 Javadoc。
> 
{style="tip"}

如果您使用的是 IntelliJ IDEA，您可能會看到 `dokkaGenerateHtml` Gradle 任務。
此任務僅為 `dokkaGeneratePublicationHtml` 的別名。兩個任務執行完全相同的操作。

### 處理棄用與移除事項

* **輸出格式支援：** DGP v2 僅支援 HTML 和 Javadoc 輸出。不再支援 Markdown 和 Jekyll 等實驗性格式。
* **收集器任務：** `DokkaCollectorTask` 已被移除。現在，您需要為每個子專案單獨產生文件，並在必要時[聚合文件](#update-documentation-aggregation-in-multi-module-projects)。

## 完成遷移

完成專案遷移後，請執行以下步驟以收尾並提升效能。

### 設定選入標記

成功遷移後，在專案的 `gradle.properties` 檔案中設定以下不含幫助程式的選入標記：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

如果您已移除對 DGP v1 中存在但在 DGP v2 中已不再提供的 Gradle 任務的引用， 
則不應看到與其相關的編譯錯誤。

### 啟用建置快取與配置快取

DGP v2 現在支援 Gradle 建置快取和配置快取，可提升建置效能。

* 要啟用建置快取，請遵循 [Gradle 建置快取文件](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable)中的說明。
* 要啟用配置快取，請遵循 [Gradle 配置快取文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable)中的說明。

## 下一步

* [探索更多 DGP v2 專案範例](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。 
* [開始使用 Dokka](dokka-get-started.md)。
* [了解更多關於 Dokka 外掛程式的資訊](dokka-plugins.md)。