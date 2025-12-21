[//]: # (title: Gradle)

> 本指南適用於 Dokka Gradle 外掛程式 (DGP) v2 模式。先前的 DGP v1 模式已不再支援。
> 如果您要從 v1 模式升級到 v2 模式，請參閱 [遷移指南](dokka-migration.md)。
>
{style="note"}

若要為基於 Gradle 的專案產生文件，您可以使用 [Dokka 的 Gradle 外掛程式](https://plugins.gradle.org/plugin/org.jetbrains.dokka)。

Dokka Gradle 外掛程式 (DGP) 為您的專案提供了基本的自動配置，包含用於產生文件的 [Gradle 任務](#generate-documentation)，並提供了 [配置選項](dokka-gradle-configuration-options.md) 來客製化輸出。

您可以透過瀏覽我們的 [Gradle 範例專案](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2) 來試用 Dokka，並探索如何為各種專案配置它。

## 支援的版本

請確保您的專案符合最低版本要求：

| **工具**                                                                          | **版本**   |
|-----------------------------------------------------------------------------------|---------------|
| [Gradle](https://docs.gradle.org/current/userguide/upgrading_version_8.html)      | 7.6 或更高 |
| [Android Gradle plugin](https://developer.android.com/build/agp-upgrade-assistant) | 7.0 或更高 |
| [Kotlin Gradle plugin](https://kotlinlang.org/docs/gradle-configure-project.html) | 1.9 或更高 |

## 套用 Dokka

套用 Dokka 的 Gradle 外掛程式的建議方式是使用 [plugins 區塊](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)。將其新增到您專案的 `build.gradle.kts` 檔案中的 `plugins {}` 區塊：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}
```

</tab>
</tabs>

在文件化多專案建構時，您需要將此外掛程式明確套用至每個要文件化的子專案。您可以在每個子專案中直接配置 Dokka，或者使用慣例外掛程式在子專案之間共用 Dokka 配置。如需更多資訊，請參閱如何配置 [單一專案](#single-project-configuration) 和 [多專案](#multi-project-configuration) 建構。

> * 在底層，
> Dokka 使用 [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)
> 來自動配置將產生文件的 [原始碼集](https://kotlinlang.org/docs/multiplatform-discover-project.html#source-sets)。請務必套用 Kotlin Gradle 外掛程式或
> 手動 [配置原始碼集](dokka-gradle-configuration-options.md#source-set-configuration)。
>
> * 如果您在
> [預編譯腳本外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins) 中使用 Dokka，
> 請將 [Kotlin Gradle 外掛程式](https://kotlinlang.org/docs/gradle-configure-project.html#apply-the-plugin)
> 作為依賴項新增，以確保其正常運作。
>
{style="tip"}

## 啟用建構快取與配置快取

DGP 支援 Gradle 建構快取和配置快取，提升建構效能。

* 若要啟用建構快取，請遵循 [Gradle 建構快取文件](https://docs.gradle.org/current/userguide/build_cache.html#sec:build_cache_enable) 中的指示。
* 若要啟用配置快取，請遵循 [Gradle 配置快取文件](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage:enable) 中的指示。

## 產生文件

Dokka Gradle 外掛程式內建了 [HTML](dokka-html.md) 和 [Javadoc](dokka-javadoc.md) 輸出格式。

使用以下 Gradle 任務來產生文件：

```shell
./gradlew :dokkaGenerate
```

`dokkaGenerate` Gradle 任務的主要行為是：

* 此任務為 [單一專案](#single-project-configuration) 和 [多專案](#multi-project-configuration) 建構產生文件。
* 預設情況下，文件輸出格式為 HTML。您也可以透過 [新增適當的外掛程式](#configure-documentation-output-format) 來產生 Javadoc 或同時產生 HTML 和 Javadoc 格式。
* 產生的文件會自動放置在 `build/dokka/html` 目錄中，適用於單一專案和多專案建構。您可以 [變更位置 (`outputDirectory`)](dokka-gradle-configuration-options.md#general-configuration)。

### 配置文件輸出格式

> Javadoc 輸出格式處於 [Alpha 階段](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)。
> 使用時可能會發現錯誤並遇到遷移問題。
> 不保證與接受 Javadoc 作為輸入的工具成功整合。
> 請自行承擔風險使用。
>
{style="warning"}

您可以選擇同時產生 HTML、Javadoc 或兩種格式的 API 文件：

1. 將對應的外掛程式 `id` 放置在您專案的 `build.gradle.kts` 檔案中的 `plugins {}` 區塊：

   ```kotlin
   plugins {
       // 產生 HTML 文件
       id("org.jetbrains.dokka") version "%dokkaVersion%"

       // 產生 Javadoc 文件
       id("org.jetbrains.dokka-javadoc") version "%dokkaVersion%"

       // 同時保留這兩個外掛程式 ID 會產生兩種格式
   }
   ```

2. 執行對應的 Gradle 任務。

   以下是外掛程式 `id` 與對應 Gradle 任務的列表，適用於每種格式：

   |             | **HTML**                                  | **Javadoc**                                  | **兩者**                          |
   |-------------|-------------------------------------------|----------------------------------------------|-----------------------------------|
   | 外掛程式 `id` | `id("org.jetbrains.dokka")`               | `id("org.jetbrains.dokka-javadoc")`          | 使用 HTML 和 Javadoc 兩種外掛程式 |
   | Gradle 任務 | `./gradlew :dokkaGeneratePublicationHtml` | `./gradlew :dokkaGeneratePublicationJavadoc` | `./gradlew :dokkaGenerate`        |

    > * `dokkaGenerate` 任務根據套用的外掛程式，產生所有可用格式的文件。
    > 如果同時套用 HTML 和 Javadoc 外掛程式，
    > 您可以透過執行 `dokkaGeneratePublicationHtml` 任務來選擇僅產生 HTML，
    > 或者透過執行 `dokkaGeneratePublicationJavadoc` 任務來選擇僅產生 Javadoc。
    >
    {style="tip"}

如果您使用 IntelliJ IDEA，您可能會看到 `dokkaGenerateHtml` Gradle 任務。此任務只是 `dokkaGeneratePublicationHtml` 的別名。兩個任務執行完全相同的操作。

### 在多專案建構中彙總文件輸出

Dokka 可以將多個子專案的文件彙總到單一輸出或發布中。

在彙總文件之前，您必須將 [Dokka 外掛程式](#apply-the-convention-plugin-to-your-subprojects) 套用至所有可文件化的子專案。

若要彙總多個子專案的文件，請在根專案的 `build.gradle.kts` 檔案中新增 `dependencies {}` 區塊：

```kotlin
dependencies {
    dokka(project(":childProjectA:"))
    dokka(project(":childProjectB:"))
}
```

假設專案結構如下：

```text
.
└── parentProject/
    ├── childProjectA/
    │   └── demo/
    │       └── ChildProjectAClass.kt
    └── childProjectB/
        └── demo/
            └── ChildProjectBClass.kt
```

產生的文件彙總如下：

![Screenshot for output of dokkaHtmlMultiModule task](dokkaHtmlMultiModule-example.png){width=600}

請參閱我們的 [多專案範例](https://github.com/Kotlin/dokka/tree/2.0.0/examples/gradle-v2/multimodule-example) 以獲取更多詳細資訊。

#### 彙總文件目錄

當 DGP 彙總子專案時，每個子專案在彙總文件中都有自己的子目錄。DGP 透過保留完整的專案結構來確保每個子專案都擁有唯一的目錄。

例如，假設一個專案在 `:turbo-lib` 中進行彙總，並有一個巢狀子專案 `:turbo-lib:maths`，則產生文件會放置在：

```text
turbo-lib/build/dokka/html/turbo-lib/maths/
```

您可以透過手動指定子專案目錄來還原此行為。將以下配置新增到每個子專案的 `build.gradle.kts` 檔案中：

```kotlin
// /turbo-lib/maths/build.gradle.kts

plugins {
    id("org.jetbrains.dokka")
}

dokka {
    // 覆寫子專案目錄
    modulePath.set("maths")
}
```

此配置會變更所產生文件，使其產生到 `:turbo-lib:maths` 模組的 `turbo-lib/build/dokka/html/maths/` 目錄中。

## 建構 javadoc.jar

如果您想將您的函式庫發布到儲存庫，您可能需要提供一個包含您的函式庫 API 參考文件的 `javadoc.jar` 檔案。

例如，如果您想發布到 [Maven Central](https://central.sonatype.org/)，您 [必須](https://central.sonatype.org/publish/requirements/) 在您的專案旁提供一個 `javadoc.jar`。然而，並非所有儲存庫都有此規則。

Dokka 的 Gradle 外掛程式並未開箱即用地提供執行此操作的方法，但可以透過自訂 Gradle 任務達成。一個用於產生 [HTML](dokka-html.md) 格式的文件，另一個用於產生 [Javadoc](dokka-javadoc.md) 格式的文件：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
// 若要產生 HTML 文件
val dokkaHtmlJar by tasks.registering(Jar::class) {
    description = "一個包含 Dokka HTML 的 HTML 文件 JAR"
    from(tasks.dokkaGeneratePublicationHtml.flatMap { it.outputDirectory })
    archiveClassifier.set("html-doc")
}

// 若要產生 Javadoc 文件
val dokkaJavadocJar by tasks.registering(Jar::class) {
    description = "一個包含 Dokka Javadoc 的 Javadoc JAR"
    from(tasks.dokkaGeneratePublicationJavadoc.flatMap { it.outputDirectory })
    archiveClassifier.set("javadoc")
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

```groovy
// 若要產生 HTML 文件
tasks.register('dokkaHtmlJar', Jar) {
    description = '一個包含 Dokka HTML 的 HTML 文件 JAR'
    from(tasks.named('dokkaGeneratePublicationHtml').flatMap { it.outputDirectory })
    archiveClassifier.set('html-doc')
}

// 若要產生 Javadoc 文件
tasks.register('dokkaJavadocJar', Jar) {
    description = '一個包含 Dokka Javadoc 的 Javadoc JAR'
    from(tasks.named('dokkaGeneratePublicationJavadoc').flatMap { it.outputDirectory })
    archiveClassifier.set('javadoc')
}
```

</tab>
</tabs>

> 如果您將您的函式庫發布到 Maven Central，您可以使用諸如 [javadoc.io](https://javadoc.io/) 的服務，免費且無需任何設定地託管您函式庫的 API 文件。它直接從 `javadoc.jar` 中取得文件頁面。與 HTML 格式搭配良好，如 [此範例](https://javadoc.io/doc/com.trib3/server/latest/index.html) 所示。
>
{style="tip"}

## 配置範例

根據您擁有的專案類型，套用和配置 Dokka 的方式略有不同。然而，[配置選項](dokka-gradle-configuration-options.md) 本身是相同的，無論您的專案類型為何。

對於專案根目錄中包含單一 `build.gradle.kts` 或 `build.gradle` 檔案的簡單扁平專案，請參閱 [單一專案配置](#single-project-configuration)。

對於具有子專案和多個巢狀 `build.gradle.kts` 或 `build.gradle` 檔案的更複雜建構，請參閱 [多專案配置](#multi-project-configuration)。

### 單一專案配置

單一專案建構通常在專案根目錄中只有一個 `build.gradle.kts` 或 `build.gradle` 檔案。它們可以是單一平台或多平台，並且通常具有以下結構：

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

在您的根 `build.gradle.kts` 檔案中套用 Dokka Gradle 外掛程式，並使用頂層的 `dokka {}` DSL 進行配置：

<tabs group="build-script">
<tab title="Gradle Kotlin DSL" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    dokkaPublications.html {
        moduleName.set("我的專案")
        outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
        includes.from("README.md")
   }

    dokkaSourceSets.main {
        sourceLink {
            localDirectory.set(file("src/main/kotlin"))
            remoteUrl.set(URI("https://github.com/your-repo"))
            remoteLineSuffix.set("#L")
        }
    }
}
```

</tab>
<tab title="Gradle Groovy DSL" group-key="groovy">

在 `./build.gradle` 內部：

```groovy
plugins {
    id 'org.jetbrains.dokka' version '%dokkaVersion%'
}

dokka {
    dokkaPublications {
        html {
            moduleName.set("我的專案")
            outputDirectory.set(layout.buildDirectory.dir("documentation/html"))
            includes.from("README.md")
        }
    }

    dokkaSourceSets {
        named("main") {
            sourceLink {
                localDirectory.set(file("src/main/kotlin"))
                remoteUrl.set(new URI("https://github.com/your-repo"))
                remoteLineSuffix.set("#L")
            }
        }
    }
}
```

</tab>
</tabs>

此配置將 Dokka 套用至您的專案，設定文件輸出目錄，並定義主要原始碼集。您可以在相同的 `dokka {}` 區塊內透過新增自訂資產、可見性過濾器或外掛程式配置來進一步擴展它。如需更多資訊，請參閱 [配置選項](dokka-gradle-configuration-options.md)。

### 多專案配置

[多專案建構](https://docs.gradle.org/current/userguide/multi_project_builds.html) 通常包含多個巢狀的 `build.gradle.kts` 檔案，並具有類似以下結構：

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

單一專案和多專案文件共用相同的 [配置模型，使用頂層的 `dokka {}` DSL](#single-project-configuration)。

在多專案建構中配置 Dokka 有兩種方式：

* **[透過慣例外掛程式共用配置](#shared-configuration-via-a-convention-plugin) (首選)**：定義一個慣例外掛程式並將其套用至所有子專案。這會集中您的 Dokka 設定。

* **[手動配置](#manual-configuration)**：套用 Dokka 外掛程式並在每個子專案中重複相同的 `dokka {}` 區塊。您不需要慣例外掛程式。

配置您的子專案後，您可以將多個子專案的文件彙總到單一輸出中。如需更多資訊，請參閱 [在多專案建構中彙總文件輸出](#aggregate-documentation-output-in-multi-project-builds)。

> 如需多專案範例，請參閱 [Dokka GitHub 儲存庫](https://github.com/Kotlin/dokka/tree/master/examples/gradle-v2/multimodule-example)。
>
{style="tip"}

#### 透過慣例外掛程式共用配置

請依照以下步驟設定慣例外掛程式並將其套用至您的子專案。

##### 設定 buildSrc 目錄

1. 在您的專案根目錄中，建立一個 `buildSrc` 目錄，其中包含兩個檔案：

    * `settings.gradle.kts`
    * `build.gradle.kts`

2. 在 `buildSrc/settings.gradle.kts` 檔案中，新增以下片段：

   ```kotlin
   rootProject.name = "buildSrc"
   ```

3. 在 `buildSrc/build.gradle.kts` 檔案中，新增以下片段：

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

設定 `buildSrc` 目錄後，請設定 Dokka 慣例外掛程式：

1. 建立一個 `buildSrc/src/main/kotlin/dokka-convention.gradle.kts` 檔案以託管 [慣例外掛程式](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:convention_plugins)。
2. 在 `dokka-convention.gradle.kts` 檔案中，新增以下片段：

    ```kotlin
    plugins {
        id("org.jetbrains.dokka") 
    }

    dokka {
        // 共用配置在此處
    }
    ```

   您需要在 `dokka {}` 區塊內新增所有子專案共用的 Dokka [配置](dokka-gradle-configuration-options.md)。此外，您不需要指定 Dokka 版本。該版本已在 `buildSrc/build.gradle.kts` 檔案中設定。

##### 將慣例外掛程式套用至您的子專案

透過將 Dokka 慣例外掛程式新增至每個子專案的 `build.gradle.kts` 檔案，將其套用至您的所有子專案：

```kotlin
plugins {
    id("dokka-convention")
}
```

#### 手動配置

如果您的專案不使用慣例外掛程式，您可以透過手動將相同的 `dokka {}` 區塊複製到每個子專案中來重複使用相同的 Dokka 配置模式：

1. 在每個子專案的 `build.gradle.kts` 檔案中套用 Dokka 外掛程式：

   ```kotlin
   plugins {
       id("org.jetbrains.dokka") version "%dokkaVersion%"
   }
   ```

2. 在每個子專案的 `dokka {}` 區塊中宣告共用配置。由於沒有慣例外掛程式來集中配置，您需要複製任何想要在子專案之間共用的配置。如需更多資訊，請參閱 [配置選項](dokka-gradle-configuration-options.md)。

#### 父專案配置

在多專案建構中，您可以在根專案中配置適用於整個文件的設定。這可以包括定義輸出格式、輸出目錄、文件子專案名稱、彙總所有子專案的文件，以及其他 [配置選項](dokka-gradle-configuration-options.md)：

```kotlin
plugins {
    id("org.jetbrains.dokka") version "%dokkaVersion%"
}

dokka {
    // 設定整個專案的屬性
    dokkaPublications.html {
        moduleName.set("我的專案")
        outputDirectory.set(layout.buildDirectory.dir("docs/html"))
        includes.from("README.md")
    }

    dokkaSourceSets.configureEach {
        documentedVisibilities.set(setOf(VisibilityModifier.Public)) // 或 documentedVisibilities(VisibilityModifier.Public)    
    }
}

// 彙總子專案文件
dependencies {
    dokka(project(":childProjectA"))
    dokka(project(":childProjectB"))
}
```

此外，每個子專案都可以有自己的 `dokka {}` 區塊，如果它需要自訂配置。在以下範例中，子專案套用 Dokka 外掛程式，設定自訂子專案名稱，並包含其 `README.md` 檔案中的額外文件：

```kotlin
// subproject/build.gradle.kts
plugins {
    id("org.jetbrains.dokka")
}

dokka {
    dokkaPublications.html {
        moduleName.set("子專案 A")
        includes.from("README.md")
    }
}
```