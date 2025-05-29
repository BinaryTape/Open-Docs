[//]: # (title: 移轉至 Dokka Gradle 外掛程式 v2)

> Dokka Gradle 外掛程式 v2 是一個 [實驗性](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 功能。
> 它可能隨時變更。我們感謝您在 [GitHub](https://github.com/Kotlin/dokka/issues) 上提供意見回饋。
>
{style="warning"}

Dokka Gradle 外掛程式 (DGP) 是一個用於為使用 Gradle 建構的 Kotlin 專案生成完整 API 文件的工具。

DGP 無縫處理 Kotlin 的 KDoc 註解和 Java 的 Javadoc 註解，以提取資訊並以 [HTML 或 Javadoc](#select-documentation-output-format) 格式建立結構化文件。

從 Dokka 2.0.0 開始，您可以嘗試 Dokka Gradle 外掛程式 v2，這是 DGP 的新版本。使用 Dokka 2.0.0，您可以在 v1 或 v2 模式下使用 Dokka Gradle 外掛程式。

DGP v2 對 DGP 引入了顯著改進，使其更接近 Gradle 的最佳實踐：

*   採用 Gradle 類型，這會帶來更好的效能。
*   使用直觀的頂層 DSL 配置，而不是低階基於任務的設定，這簡化了建構指令碼及其可讀性。
*   對文件聚合採取更具宣告式的方法，這使得多專案文件更容易管理。
*   使用型別安全的(型別安全)外掛程式配置，這提高了建構指令碼的可靠性和可維護性。
*   完全支援 Gradle [配置快取](https://docs.gradle.org/current/userguide/configuration_cache.html) 和
    [建構快取](https://docs.gradle.org/current/userguide/build_cache.html)，這提高了效能並簡化了建構工作。

## 開始之前

在開始移轉之前，請完成以下步驟。

### 驗證支援版本

確保您的專案符合最低版本要求：

| **工具**                                                                          | **版本**      |
|:----------------------------------------------------------------------------------|:--------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 或更高版本 |
| [Android Gradle 外掛程式](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高版本 |
| [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高版本 |

### 啟用 DGP v2

在您專案的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中，將 Dokka 版本更新到 2.0.0：

```kotlin
plugins {
    kotlin("jvm") version "2.1.10"
    id("org.jetbrains.dokka") version "2.0.0"
}
```

或者，
您可以使用 [版本目錄](https://docs.gradle.org/current/userguide/platforms.html#sub:version-catalog)
來啟用 Dokka Gradle 外掛程式 v2。

> 預設情況下，DGP v2 以 HTML 格式生成文件。要生成 Javadoc 或同時生成 HTML 和 Javadoc 格式，
> 請添加適當的外掛程式。有關外掛程式的更多資訊，請參閱 [選擇文件輸出格式](#select-documentation-output-format)。
>
{style="tip"}

### 啟用移轉輔助程式

在專案的 `gradle.properties` 檔案中，設定以下 Gradle 屬性以啟動帶有輔助程式的 DGP v2：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2EnabledWithHelpers
```

> 如果您的專案沒有 `gradle.properties` 檔案，請在專案的根目錄中建立一個。
>
{style="tip"}

此屬性會啟用帶有移轉輔助程式的 DGP v2 外掛程式。這些輔助程式可防止建構指令碼參照 DGP v1 中不再可用的任務時發生編譯錯誤。

> 移轉輔助程式不會主動協助移轉。它們只會在您過渡到新 API 時，防止您的建構指令碼中斷。
>
{style="note"}

完成移轉後，請 [禁用移轉輔助程式](#set-the-opt-in-flag)。

### 將您的專案與 Gradle 同步

啟用 DGP v2 和移轉輔助程式後，
將您的專案與 Gradle 同步以確保 DGP v2 已正確應用：

*   如果您使用 IntelliJ IDEA，請點擊 Gradle 工具視窗中的「重新載入所有 Gradle 專案」![重新載入按鈕](gradle-reload-button.png){width=30}{type="joined"} 按鈕。
*   如果您使用 Android Studio，請選擇「檔案」|「將專案與 Gradle 檔案同步」。

## 移轉您的專案

將 Dokka Gradle 外掛程式更新到 v2 後，請按照適用於您專案的移轉步驟進行操作。

### 調整配置選項

DGP v2 在 [Gradle 配置選項](dokka-gradle.md#configuration-options) 中引入了一些變更。在 `build.gradle.kts` 檔案中，根據您的專案設定調整配置選項。

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

`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全的存取器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置檔案" group-key="gradle">

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
<tab title="Kotlin 檔案" group-key="kotlin">

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

#### 可見度設定

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

此外，使用 DGP v2 的 [公用程式函式](https://github.com/Kotlin/dokka/blob/v2.0.0/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/HasConfigurableVisibilityModifiers.kt#L14-L16) 來添加文件化可見度：

```kotlin
fun documentedVisibilities(vararg visibilities: VisibilityModifier): Unit =
    documentedVisibilities.set(visibilities.asList())
```

#### 原始碼連結

配置原始碼連結以允許從生成的文檔導航到遠端儲存庫中對應的原始碼。
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

`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全的存取器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置檔案" group-key="gradle">

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
<tab title="Kotlin 檔案" group-key="kotlin">

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

由於原始碼連結配置已 [變更](https://docs.gradle.org/current/userguide/upgrading_version_8.html#deprecated_invalid_url_decoding)，
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

此外，DGP v2 有兩個用於設定 URL 的 [公用程式函式](https://github.com/Kotlin/dokka/blob/220922378e6c68eb148fda2ec80528a1b81478c9/dokka-runners/dokka-gradle-plugin/src/main/kotlin/engine/parameters/DokkaSourceLinkSpec.kt#L82-L96)：

```kotlin
fun remoteUrl(@Language("http-url-reference") value: String): Unit =
    remoteUrl.set(URI(value))

// and

fun remoteUrl(value: Provider<String>): Unit =
    remoteUrl.set(value.map(::URI))
```

#### 外部文件連結

使用 `register()` 方法註冊外部文件連結以定義每個連結。
`externalDocumentationLinks` API 使用此方法以與 Gradle DSL 慣例保持一致。

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

使用 [`customAssets`](dokka-html.md#customize-assets) 屬性與檔案集合 [(`FileCollection`)](https://docs.gradle.org/8.10/userguide/lazy_configuration.html#working_with_files_in_lazy_properties) 而不是清單 (`var List<File>`)。

DGP v1 中的配置：

```kotlin
customAssets = listOf(file("example.png"), file("example2.png"))
```

DGP v2 中的配置：

```kotlin
customAssets.from("example.png", "example2.png")
```

#### 輸出目錄

使用 `dokka {}` 區塊指定生成的 Dokka 文件的輸出目錄。

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

#### 額外檔案的輸出目錄

在 `dokka {}` 區塊內為單模組和多模組專案指定輸出目錄並包含額外檔案（例如 `README.md`）。

在 DGP v2 中，單模組和多模組專案的配置是統一的。
不再需要單獨配置 `dokkaHtml` 和 `dokkaHtmlMultiModule` 任務，而是在 `dokka {}` 區塊內的 `dokkaPublications.html {}` 中指定設定。

對於多模組專案，請在根專案的配置中設定輸出目錄並包含額外檔案（例如 `README.md`）。

DGP v1 中的配置：

```kotlin
tasks.dokkaHtmlMultiModule {
    outputDirectory.set(rootDir.resolve("docs/api/0.x"))
    includes.from(project.layout.projectDirectory.file("README.md"))
}
```

DGP v2 中的配置：

`build.gradle.kts` 檔案的語法與常規 `.kt` 檔案（例如用於自訂 Gradle 外掛程式的檔案）不同，因為 Gradle 的 Kotlin DSL 使用型別安全的存取器。

<tabs group="dokka-configuration">
<tab title="Gradle 配置檔案" group-key="gradle">

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
<tab title="Kotlin 檔案" group-key="kotlin">

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

使用 JSON 配置內建 Dokka 外掛程式已被棄用，改用型別安全 DSL。此變更提高了與 Gradle 增量建構系統的相容性，並改進了任務輸入追蹤。

DGP v1 中的配置：

在 DGP v1 中，Dokka 外掛程式是手動使用 JSON 配置的。這種方法導致了 [註冊任務輸入](https://docs.gradle.org/current/userguide/incremental_build.html) 以進行 Gradle 最新檢查的問題。

以下是 [Dokka 版本控制外掛程式](https://kotl.in/dokka-versioning-plugin) 的已棄用基於 JSON 的配置範例：

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

有關 DGP v2 配置的範例，請參閱 [Dokka 的版本控制外掛程式](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/versioning-multimodule-example)。

Dokka 2.0.0 允許您透過 [配置自訂外掛程式](https://github.com/Kotlin/dokka/blob/ae3840edb4e4afd7b3e3768a5fddfe8ec0e08f31/examples/gradle-v2/custom-dokka-plugin-example/demo-library/build.gradle.kts) 來擴展其功能。
自訂外掛程式可以對文件生成過程進行額外處理或修改。

### 跨模組共用 Dokka 配置

DPG v2 不再使用 `subprojects {}` 或 `allprojects {}` 來跨模組共用配置。在未來的 Gradle 版本中，
使用這些方法將 [導致錯誤](https://docs.gradle.org/current/userguide/isolated_projects.html)。

請按照以下步驟在 [帶有現有慣例外掛程式](#multi-module-projects-with-convention-plugins) 的多模組專案中或
[不帶慣例外掛程式](#multi-module-projects-without-convention-plugins) 的多模組專案中正確共用 Dokka 配置。

共用 Dokka 配置後，您可以將來自多個模組的文件聚合到單一輸出中。有關更多資訊，請參閱
[更新多模組專案中的文件聚合](#update-documentation-aggregation-in-multi-module-projects)。

> 有關多模組專案範例，請參閱 [Dokka GitHub 儲存庫](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 不帶慣例外掛程式的多模組專案

如果您的專案不使用慣例外掛程式，您仍然可以透過直接配置每個模組來共用 Dokka 配置。
這涉及在每個模組的 `build.gradle.kts` 檔案中手動設定共用配置。雖然這種方法集中性較低，
但它避免了對慣例外掛程式等額外設定的需求。

否則，如果您的專案使用慣例外掛程式，您也可以透過在 `buildSrc` 目錄中建立一個慣例外掛程式，然後將該外掛程式應用於您的模組（子專案）來在多模組專案中共用 Dokka 配置。

##### 設定 buildSrc 目錄

1.  在您的專案根目錄中，建立一個 `buildSrc` 目錄，其中包含兩個檔案：

    *   `settings.gradle.kts`
    *   `build.gradle.kts`

2.  在 `buildSrc/settings.gradle.kts` 檔案中，添加以下程式碼片段：

    ```kotlin
    rootProject.name = "buildSrc"
    ```

3.  在 `buildSrc/build.gradle.kts` 檔案中，添加以下程式碼片段：

    ```kotlin
    plugins {
        `kotlin-dsl`
    }
    
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
    
    dependencies {
        implementation("org.jetbrains.dokka:dokka-gradle-plugin:2.0.0")
    }   
    ```

##### 設定 Dokka 慣例外掛程式

設定 `buildSrc` 目錄後：

1.  建立 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 檔案以託管 [慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2.  在 `dokka-convention.gradle.kts` 檔案中，添加以下程式碼片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // 共用配置在此處
    }
    ```

    您需要在 `dokka {}` 區塊內添加所有子專案共用的 Dokka [配置](#adjust-configuration-options)。
    此外，您無需指定 Dokka 版本。該版本已在 `buildSrc/build.gradle.kts` 檔案中設定。

##### 將慣例外掛程式應用於您的模組

將 Dokka 慣例外掛程式應用於您的模組（子專案），方法是將其添加到每個子專案的 `build.gradle.kts` 檔案中：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 帶有慣例外掛程式的多模組專案

如果您已經有慣例外掛程式，請按照 [Gradle 的文件](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins) 建立專用的 Dokka 慣例外掛程式。

然後，請按照 [設定 Dokka 慣例外掛程式](#set-up-the-dokka-convention-plugin) 和
[將其應用於您的模組](#apply-the-convention-plugin-to-your-modules) 的步驟進行操作。

### 更新多模組專案中的文件聚合

Dokka 可以將來自多個模組（子專案）的文件聚合到單一輸出或發布中。

如 [所解釋](#apply-the-convention-plugin-to-your-modules)，在聚合文件之前，請將 Dokka 外掛程式應用於所有可文件化子專案。

DGP v2 中的聚合使用 `dependencies {}` 區塊而不是任務，並且可以添加到任何 `build.gradle.kts` 檔案中。

在 DGP v1 中，聚合是在根專案中隱式建立的。為了在 DGP v2 中複製此行為，請在根專案的 `build.gradle.kts` 檔案中添加 `dependencies {}` 區塊。

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

### 更改聚合文件目錄

當 DGP 聚合模組時，每個子專案在聚合文件中都有自己的子目錄。

在 DGP v2 中，聚合機制已更新，以更好地與 Gradle 慣例保持一致。
DGP v2 現在保留完整的子專案目錄，以防止在任何位置聚合文件時發生衝突。

DGP v1 中的聚合目錄：

在 DGP v1 中，聚合文件放置在摺疊的目錄結構中。
例如，給定一個在 `:turbo-lib` 中進行聚合的專案和一個嵌套子專案 `:turbo-lib:maths`，
生成的文件放置在：

```text
turbo-lib/build/dokka/html/maths/
```

DGP v2 中的聚合目錄：

DGP v2 透過保留完整的專案結構來確保每個子專案都有一個唯一的目錄。相同的聚合文件
現在遵循此結構：

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

此變更可防止同名子專案發生衝突。但是，由於目錄結構已更改，外部連結可能過時，
可能導致 `404` 錯誤。

#### 恢復 DGP v1 目錄行為

如果您的專案依賴於 DGP v1 中使用的目錄結構，您可以透過手動指定模組目錄來恢復此行為。
將以下配置添加到每個子專案的 `build.gradle.kts` 檔案中：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 覆寫模組目錄以符合 V1 結構
    modulePath.set("maths")
}
```

### 使用更新後的任務生成文件

DGP v2 已重新命名生成 API 文件的 Gradle 任務。

DGP v1 中的任務：

```text
./gradlew dokkaHtml

// 或

./gradlew dokkaHtmlMultiModule
```

DGP v2 中的任務：

```text
./gradlew :dokkaGenerate
```

`dokkaGenerate` 任務在 `build/dokka/` 目錄中生成 API 文件。

在 DGP v2 版本中，`dokkaGenerate` 任務名稱適用於單模組和多模組專案。您可以使用不同的任務
來生成 HTML、Javadoc 或同時生成 HTML 和 Javadoc 格式的輸出。有關更多資訊，請參閱 [選擇文件輸出格式](#select-documentation-output-format)。

### 選擇文件輸出格式

> Javadoc 輸出格式處於 [Alpha](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained) 階段。
> 您在使用時可能會發現錯誤並遇到移轉問題。不保證與接受 Javadoc 作為輸入的工具成功整合。
> 請自行承擔風險使用。
>
{style="note"}

DGP v2 的預設輸出格式是 HTML。但是，您可以選擇同時生成 HTML、Javadoc 或兩種格式的 API 文件：

1.  將對應的 `id` 外掛程式放在您專案的 `build.gradle.kts` 檔案的 `plugins {}` 區塊中：

    ```kotlin
    plugins {
        // 生成 HTML 文件
        id("org.jetbrains.dokka") version "2.0.0"

        // 生成 Javadoc 文件
        id("org.jetbrains.dokka-javadoc") version "2.0.0"

        // 保留兩個外掛程式 ID 會生成兩種格式
    }
    ```

2.  執行相應的 Gradle 任務。

以下是與每種格式對應的外掛程式 `id` 和 Gradle 任務列表：

|             | **HTML**                        | **Javadoc**                          | **兩種**                            |
|:------------|:--------------------------------|:-------------------------------------|:------------------------------------|
| 外掛程式 `id` | `id("org.jetbrains.dokka")`     | `id("org.jetbrains.dokka-javadoc")`  | 同時使用 HTML 和 Javadoc 外掛程式 |
| Gradle 任務 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc`    | `./gradlew :dokkaGenerate`          |

> `dokkaGenerate` 任務會根據應用的外掛程式生成所有可用格式的文件。
> 如果同時應用了 HTML 和 Javadoc 外掛程式，您可以選擇僅執行 `dokkaGeneratePublicationHtml` 任務來生成 HTML，
> 或僅執行 `dokkaGeneratePublicationJavadoc` 任務來生成 Javadoc。
>
{style="tip"}

### 處理棄用和移除

*   **輸出格式支援：** Dokka 2.0.0 僅支援 HTML 和 Javadoc 輸出。Markdown 和 Jekyll 等實驗性格式不再受支援。
*   **收集器任務：** `DokkaCollectorTask` 已被移除。現在，您需要為
    每個子專案單獨生成文件，然後在必要時 [聚合文件](#update-documentation-aggregation-in-multi-module-projects)。

## 完成您的移轉

移轉專案後，執行這些步驟以完成並提高效能。

### 設定選擇加入旗標

成功移轉後，在專案的 `gradle.properties` 檔案中設定以下不帶輔助程式的選擇加入旗標：

```text
org.jetbrains.dokka.experimental.gradle.pluginMode=V2Enabled
```

如果您移除了對 DGP v1 中不再可用的 Gradle 任務的參照，
您不應看到與其相關的編譯錯誤。

### 啟用建構快取和配置快取

DGP v2 現在支援 Gradle 建構快取和配置快取，從而提高建構效能。

*   要啟用建構快取，請按照 [Gradle 建構快取文件](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable) 中的說明進行操作。
*   要啟用配置快取，請按照 [Gradle 配置快取文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable) 中的說明進行操作。

## 疑難排解

在大型專案中，Dokka 可能會消耗大量記憶體來生成文件。
這可能會超出 Gradle 的記憶體限制，尤其是在處理大量資料時。

當 Dokka 生成時記憶體不足，建構會失敗，Gradle 可能會拋出 `java.lang.OutOfMemoryError: Metaspace` 等異常。

目前正在積極努力改進 Dokka 的效能，儘管一些限制源於 Gradle。

如果您遇到記憶體問題，請嘗試以下解決方法：

*   [增加堆空間](#increase-heap-space)
*   [在 Gradle 程序內執行 Dokka](#run-dokka-within-the-gradle-process)

### 增加堆空間

解決記憶體問題的一種方法是增加 Dokka 生成器程序的 Java 堆記憶體量。
在 `build.gradle.kts` 檔案中，調整以下配置選項：

```kotlin
    dokka {
        // Dokka 生成一個由 Gradle 管理的新程序
        dokkaGeneratorIsolation = ProcessIsolation {
            // 配置堆大小
            maxHeapSize = "4g"
        }
    }
```

在此範例中，最大堆大小設定為 4 GB (`"4g"`)。調整並測試該值以找到適合您建構的最佳設定。

如果您發現 Dokka 需要顯著擴展的堆大小，例如，顯著高於 Gradle 自身的記憶體使用量，
請 [在 Dokka 的 GitHub 儲存庫上建立一個問題](https://kotl.in/dokka-issues)。

> 您必須將此配置應用於每個子專案。建議您在應用於所有子專案的慣例外掛程式中配置 Dokka。
>
{style="note"}

### 在 Gradle 程序內執行 Dokka

當 Gradle 建構和 Dokka 生成都需要大量記憶體時，它們可能作為單獨的程序執行，
在單一機器上消耗大量記憶體。

為了優化記憶體使用，您可以在相同的 Gradle 程序中執行 Dokka，而不是作為單獨的程序。這樣
您只需配置一次 Gradle 的記憶體，而無需為每個程序單獨分配。

要在相同的 Gradle 程序中執行 Dokka，請在 `build.gradle.kts` 檔案中調整以下配置選項：

```kotlin
    dokka {
        // 在目前的 Gradle 程序中執行 Dokka
        dokkaGeneratorIsolation = ClassLoaderIsolation()
    }
```

與 [增加堆空間](#increase-heap-space) 一樣，請測試此配置以確認它適用於您的專案。

有關配置 Gradle JVM 記憶體的更多詳細資訊，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/config_gradle.html#sec:configuring_jvm_memory)。

> 更改 Gradle 啟動的 Java 選項會啟動一個新的 Gradle Daemon，它可能會長時間保持活動。您可以 [手動停止任何其他 Gradle 程序](https://docs.gradle.org/current/userguide/gradle_daemon.html#sec:stopping_an_existing_daemon)。
>
> 此外，帶有 `ClassLoaderIsolation()` 配置的 Gradle 問題可能 [導致記憶體洩漏](https://github.com/gradle/gradle/issues/18313)。
>
{style="note"}

## 下一步

*   [探索更多 DGP v2 專案範例](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2)。
*   [Dokka 入門](dokka-get-started.md)。
*   [了解更多關於 Dokka 外掛程式的資訊](dokka-plugins.md)。