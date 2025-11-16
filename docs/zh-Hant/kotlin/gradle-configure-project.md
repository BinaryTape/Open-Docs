[//]: # (title: 配置 Gradle 專案)

要使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 建構 Kotlin 專案，您需要在建構指令碼檔案 `build.gradle(.kts)` 中[新增 Kotlin Gradle 外掛程式](#apply-the-plugin)，並在其中[配置專案的依賴項](#configure-dependencies)。

> 要了解更多關於建構指令碼的內容，
> 請造訪 [探索建構指令碼](get-started-with-jvm-gradle-project.md#explore-the-build-script) 章節。
>
{style="note"}

## 應用外掛程式

要應用 Kotlin Gradle 外掛程式，請使用 Gradle 外掛程式 DSL 中的 [`plugins{}` 區塊](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    kotlin("<...>") version "%kotlinVersion%"
    // For example, if your target environment is JVM:
    // kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    // Replace `<...>` with the plugin name appropriate for your target environment
    id 'org.jetbrains.kotlin.<...>' version '%kotlinVersion%'
    // For example, if your target environment is JVM: 
    // id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}
```

</tab>
</tabs>

> Kotlin Gradle 外掛程式 (KGP) 與 Kotlin 共用相同的版本編號。
>
{style="note"}

配置專案時，請檢查 Kotlin Gradle 外掛程式 (KGP) 與可用 Gradle 版本的相容性。下表列出了 Gradle 和 Android Gradle 外掛程式 (AGP) 的最低和最高**完全支援**版本：

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.2.20        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% |
| 2.2.0-2.2.10  | 7.6.3-8.14                            | 7.3.1-8.10.0                                        |
| 2.1.20-2.1.21 | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         |
| 2.1.0–2.1.10  | 7.6.3–8.10*                           | 7.3.1–8.7.2                                         |
| 2.0.20–2.0.21 | 6.8.3–8.8*                            | 7.1.3–8.5                                           |
| 2.0.0         | 6.8.3–8.5                             | 7.1.3–8.3.1                                         |
| 1.9.20–1.9.25 | 6.8.3–8.1.1                           | 4.2.2–8.1.0                                         |
| 1.9.0–1.9.10  | 6.8.3–7.6.0                           | 4.2.2–7.4.0                                         |
| 1.8.20–1.8.22 | 6.8.3–7.6.0                           | 4.1.3–7.4.0                                         |      
| 1.8.0–1.8.11  | 6.8.3–7.3.3                           | 4.1.3–7.2.1                                         |   
| 1.7.20–1.7.22 | 6.7.1–7.1.1                           | 3.6.4–7.0.4                                         |
| 1.7.0–1.7.10  | 6.7.1–7.0.2                           | 3.4.3–7.0.2                                         |
| 1.6.20–1.6.21 | 6.1.1–7.0.2                           | 3.4.3–7.0.2                                         |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 與 Gradle 8.6 或更早版本完全相容。
> Gradle 8.7–8.10 版本也受支援，但只有一個例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，
> 您可能會在呼叫 JVM 目標中的 `withJava()` 函式的多平台專案中看到棄用警告。
> 如需更多資訊，請參閱 [依預設建立的 Java 原始碼集](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#java-source-sets-created-by-default)。
>
{style="warning"}

您也可以使用最新版本的 Gradle 和 AGP，但如果您這樣做，請記住您可能會遇到棄用警告或某些新功能可能無法運作。

例如，Kotlin Gradle 外掛程式和 `kotlin-multiplatform` 外掛程式 %kotlinVersion% 要求您的專案編譯的最低 Gradle 版本為 %minGradleVersion%。

同樣，最大完全支援版本為 %maxGradleVersion%。它沒有棄用的 Gradle 方法和屬性，並支援所有目前的 Gradle 功能。

### 專案中的 Kotlin Gradle 外掛程式資料

依預設，Kotlin Gradle 外掛程式將專案特定的持久性資料儲存在專案的根目錄中，即 `.kotlin` 目錄。

> 請勿將 `.kotlin` 目錄提交到版本控制。
> 例如，如果您使用 Git，請將 `.kotlin` 新增到專案的 `.gitignore` 檔案中。
>
{style="warning"}

您可以將屬性新增到專案的 `gradle.properties` 檔案中以配置此行為：

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 配置專案層級資料的儲存位置。預設值：`<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否禁用將 Kotlin 資料寫入 `.gradle` 目錄（為了與舊版 IDEA 相容）。預設值：false |

## 針對 JVM

要針對 JVM，請應用 Kotlin JVM 外掛程式。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

此區塊中的 `version` 應該是字面量，不能從另一個建構指令碼應用。

### Kotlin 和 Java 原始碼

Kotlin 原始碼和 Java 原始碼可以儲存在同一個目錄中，也可以放置在不同的目錄中。

預設慣例是使用不同的目錄：

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

> 請勿將 Java `.java` 檔案儲存在 `src/*/kotlin` 目錄中，因為 `.java` 檔案將不會被編譯。
> 
> 相反，您可以使用 `src/main/java`。
>
{style="warning"} 

如果您不使用預設慣例，則應更新對應的 `sourceSets` 屬性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</tab>
</tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 檢查相關編譯任務的 JVM 目標相容性

在建構模組中，您可能會有相關的編譯任務，例如：
* `compileKotlin` 和 `compileJava`
* `compileTestKotlin` 和 `compileTestJava`

> `main` 和 `test` 原始碼集編譯任務不相關。
>
{style="note"}

對於像這些相關的任務，Kotlin Gradle 外掛程式會檢查 JVM 目標相容性。`kotlin` 擴展或任務中的 [`jvmTarget` 屬性](gradle-compiler-options.md#attributes-specific-to-jvm) 和 `java` 擴展或任務中的 [`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension) 的不同值會導致 JVM 目標不相容。例如：
`compileKotlin` 任務的 `jvmTarget=1.8`，而
`compileJava` 任務的（或[繼承的](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）`targetCompatibility=15`。

透過在 `gradle.properties` 檔案中將 `kotlin.jvm.target.validation.mode` 屬性設定為以下值來配置此檢查的行為：

* `error` – 外掛程式使建構失敗；這是 Gradle 8.0+ 專案的預設值。
* `warning` – 外掛程式列印警告訊息；這是 Gradle 8.0 以下專案的預設值。
* `ignore` – 外掛程式跳過檢查，不產生任何訊息。

您也可以在 `build.gradle(.kts)` 檔案中的任務層級進行配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</tab>
</tabs>

為避免 JVM 目標不相容，請[配置工具鏈](#gradle-java-toolchains-support)或手動對齊 JVM 版本。

#### 如果目標不相容會發生什麼 {initial-collapse-state="collapsed" collapsible="true"}

有兩種手動設定 Kotlin 和 Java 原始碼集 JVM 目標的方法：
* 透過[設定 Java 工具鏈](#gradle-java-toolchains-support)的隱式方式。
* 透過在 `kotlin` 擴展或任務中設定 `jvmTarget` 屬性，以及在 `java` 擴展或任務中設定 `targetCompatibility` 的顯式方式。

如果發生以下情況，則會出現 JVM 目標不相容：
* 您明確設定了不同的 `jvmTarget` 和 `targetCompatibility` 值。
* 您有預設配置，並且您的 JDK 不等於 `1.8`。

讓我們考慮當您的建構指令碼中只有 Kotlin JVM 外掛程式且沒有額外 JVM 目標設定時的 JVM 目標預設配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "%kotlinVersion%"
}
```

</tab>
</tabs>

當建構指令碼中沒有關於 `jvmTarget` 值的明確資訊時，其預設值為 `null`，編譯器將其翻譯為預設值 `1.8`。`targetCompatibility` 等於當前 Gradle 的 JDK 版本，該版本等於您的 JDK 版本（除非您使用 [Java 工具鏈方法](gradle-configure-project.md#gradle-java-toolchains-support)）。假設您的 JDK 版本是 `%jvmLTSVersionSupportedByKotlin%`，您的已發布函式庫構件將[聲明其相容](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)於 JDK %jvmLTSVersionSupportedByKotlin%+：`org.gradle.jvm.version=%jvmLTSVersionSupportedByKotlin%`，這是錯誤的。在這種情況下，即使位元組碼版本是 `1.8`，您也必須在主專案中使用 Java %jvmLTSVersionSupportedByKotlin% 來新增此函式庫。請[配置工具鏈](gradle-configure-project.md#gradle-java-toolchains-support)以解決此問題。

### Gradle Java 工具鏈支援

> Android 使用者的警告。要使用 Gradle 工具鏈支援，請使用 Android Gradle 外掛程式 (AGP) 版本 8.1.0-alpha09 或更高版本。
> 
> Gradle Java 工具鏈支援[僅從 AGP 7.4.0 開始可用](https://issuetracker.google.com/issues/194113162)。
> 然而，由於[此問題](https://issuetracker.google.com/issues/260059413)，直到 8.1.0-alpha09 版本，AGP 才將 `targetCompatibility` 設定為與工具鏈的 JDK 相等。
> 如果您使用低於 8.1.0-alpha09 的版本，您需要透過 `compileOptions` 手動配置 `targetCompatibility`。
> 將佔位符 `<MAJOR_JDK_VERSION>` 替換為您要使用的 JDK 版本：
>
> ```kotlin
> android {
>     compileOptions {
>         sourceCompatibility = <MAJOR_JDK_VERSION>
>         targetCompatibility = <MAJOR_JDK_VERSION>
>     }
> }
> ```
>
{style="warning"} 

Gradle 6.7 引入了 [Java 工具鏈支援](https://docs.gradle.org/current/userguide/toolchains.html)。
使用此功能，您可以：
* 使用與 Gradle 中不同的 JDK 和 JRE 來執行編譯、測試和可執行檔。
* 使用尚未發布的語言版本編譯和測試程式碼。

藉助工具鏈支援，Gradle 可以自動偵測本地 JDK 並安裝 Gradle 建構所需的缺失 JDK。
現在 Gradle 本身可以在任何 JDK 上運行，並且仍然可以重複使用[遠端建構快取功能](gradle-compilation-and-caches.md#gradle-build-cache-support)，用於依賴主要 JDK 版本的任務。

Kotlin Gradle 外掛程式支援 Kotlin/JVM 編譯任務的 Java 工具鏈。JS 和 Native 任務不使用工具鏈。
Kotlin 編譯器始終在 Gradle 守護程式運行的 JDK 上運行。
Java 工具鏈：
* 設定 JVM 目標可用的 [`-jdk-home` 選項](compiler-reference.md#jdk-home-path)。
* 如果使用者沒有明確設定 `jvmTarget` 選項，則將 [`compilerOptions.jvmTarget`](gradle-compiler-options.md#attributes-specific-to-jvm) 設定為工具鏈的 JDK 版本。
  如果使用者沒有配置工具鏈，`jvmTarget` 欄位將使用預設值。
  了解更多關於 [JVM 目標相容性](#check-for-jvm-target-compatibility-of-related-compile-tasks)的資訊。
* 設定要由任何 Java 編譯、測試和 javadoc 任務使用的工具鏈。
* 影響 [`kapt` 工作者](kapt.md#run-kapt-tasks-in-parallel) 運行的 JDK。

使用以下程式碼設定工具鏈。將佔位符 `<MAJOR_JDK_VERSION>` 替換為您要使用的 JDK 版本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(%jvmLTSVersionSupportedByKotlin%)
}
```

</tab>
</tabs>

請注意，透過 `kotlin` 擴展設定工具鏈也會更新 Java 編譯任務的工具鏈。

您可以透過 `java` 擴展設定工具鏈，Kotlin 編譯任務將使用它：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</tab>
</tabs>

如果您使用 Gradle 8.0.2 或更高版本，您還需要新增一個[工具鏈解析器外掛程式](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)。
此類外掛程式管理從哪些儲存庫下載工具鏈。例如，將以下外掛程式新增到您的 `settings.gradle(.kts)`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("%foojayResolver%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '%foojayResolver%'
}
```

</tab>
</tabs>

請在 [Gradle 網站](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)上檢查 `foojay-resolver-convention` 的版本是否與您的 Gradle 版本對應。

> 要了解 Gradle 使用哪個工具鏈，請以 [日誌級別 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level) 運行您的 Gradle 建構，
> 並在輸出中尋找以 `[KOTLIN] Kotlin compilation 'jdkHome' argument:` 開頭的字串。
> 冒號後面的部分將是工具鏈的 JDK 版本。
>
{style="note"}

要為特定任務設定任何 JDK（甚至是本地的），請使用 [任務 DSL](#set-jdk-version-with-the-task-dsl)。

了解更多關於 [Kotlin 外掛程式中 Gradle JVM 工具鏈支援](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/)的資訊。

### 使用任務 DSL 設定 JDK 版本

任務 DSL 允許為任何實現 `UsesKotlinJavaToolchain` 介面的任務設定任何 JDK 版本。
目前，這些任務是 `KotlinCompile` 和 `KaptTask`。
如果您希望 Gradle 搜尋主要 JDK 版本，請在您的建構指令碼中替換 `<MAJOR_JDK_VERSION>` 佔位符：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain::class).configureEach { task ->
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</tab>
</tabs>

或者您可以指定本地 JDK 的路徑，並將佔位符 `<LOCAL_JDK_VERSION>` 替換為此 JDK 版本：

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // Put a path to your JDK
        JavaVersion.<LOCAL_JDK_VERSION> // For example, JavaVersion.17
    )
}
```

### 關聯編譯任務

您可以透過在編譯之間建立關係來_關聯_編譯，使得一個編譯可以使用另一個編譯的編譯輸出。關聯編譯會在它們之間建立 `internal` 可見性。

Kotlin 編譯器預設會關聯某些編譯，例如每個目標的 `test` 和 `main` 編譯。
如果您需要表達您的自訂編譯與另一個編譯相關聯，請建立您自己的關聯編譯。

為了讓 IDE 支援關聯編譯以推斷原始碼集之間的可見性，請將以下程式碼新增到您的 `build.gradle(.kts)`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</tab>
</tabs>

在這裡，`integrationTest` 編譯與 `main` 編譯相關聯，這允許從功能測試中存取 `internal` 物件。

### 啟用 Java 模組 (JPMS) 的配置

要使 Kotlin Gradle 外掛程式與 [Java 模組](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)一起工作，請將以下行添加到您的建構指令碼中，並將 `YOUR_MODULE_NAME` 替換為您的 JPMS 模組的引用，例如 `org.company.module`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">
        
```kotlin
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// Add the following three lines if you use a Gradle version less than 7.0
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // Provide compiled Kotlin classes to javac – needed for Java/Kotlin mixed sources to work
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</tab>
</tabs>

> 像往常一樣將 `module-info.java` 放到 `src/main/java` 目錄中。
> 
> 對於模組，Kotlin 檔案中的套件名稱應與 `module-info.java` 中的套件名稱相同，以避免「package is empty or does not exist」建構失敗。
>
{style="note"}

了解更多關於：
* [為 Java 模組系統建構模組](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [使用 Java 模組系統建構應用程式](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [Kotlin 中「模組」的含義](visibility-modifiers.md#modules)

### 其他詳細資訊

#### 禁用在編譯任務中使用構件

在某些罕見情況下，您可能會遇到由於循環依賴錯誤導致的建構失敗。例如，當您有多個編譯，其中一個編譯可以看到另一個編譯的所有內部聲明，並且生成的構件依賴於兩個編譯任務的輸出時：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

為了解決這個循環依賴錯誤，我們新增了一個 Gradle 屬性：`archivesTaskOutputAsFriendModule`。
此屬性控制在編譯任務中使用構件輸入，並決定是否因此建立任務依賴。

依預設，此屬性設定為 `true` 以追蹤任務依賴。如果您遇到循環依賴錯誤，
您可以禁用在編譯任務中使用構件以移除任務依賴並避免循環依賴錯誤。

要禁用在編譯任務中使用構件，請將以下內容新增到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 惰性 Kotlin/JVM 任務建立

從 Kotlin 1.8.20 開始，Kotlin Gradle 外掛程式會註冊所有任務，並且在試運行時不會配置它們。

#### 編譯任務 `destinationDirectory` 的非預設位置

如果您覆寫 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任務的 `destinationDirectory` 位置，
請更新您的建構指令碼。您需要將 `sourceSets.main.kotlin.classesDirectories` 明確新增到 JAR 檔案中的 `sourceSets.main.outputs`：

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 針對多個平台

針對[多個平台](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#targets)的專案，稱為[多平台專案](https://kotlinlang.org/docs/multiplatform/get-started.html)，
需要 `kotlin-multiplatform` 外掛程式。

> `kotlin-multiplatform` 外掛程式適用於 Gradle %minGradleVersion% 或更高版本。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

了解更多關於 [Kotlin Multiplatform 適用於不同平台](https://kotlinlang.org/docs/multiplatform/get-started.html)和 [Kotlin Multiplatform 適用於 iOS 和 Android](https://kotlinlang.org/docs/multiplatform/multiplatform-getting-started.html) 的資訊。

## 針對 Android

建議使用 Android Studio 建立 Android 應用程式。[了解如何使用 Android Gradle 外掛程式](https://developer.android.com/studio/releases/gradle-plugin)。

## 針對 Web

Kotlin 透過 Kotlin Multiplatform，為 Web 開發提供了兩種方法：

* 基於 JavaScript (使用 Kotlin/JS 編譯器)
* 基於 WebAssembly (使用 Kotlin/Wasm 編譯器)

這兩種方法都使用 Kotlin Multiplatform 外掛程式，但支援不同的使用情境。
以下章節說明如何在您的 Gradle 建構中配置每個目標以及何時使用它們。

### 針對 JavaScript

如果您的目標是以下情況，請使用 Kotlin/JS：

* 與 JavaScript/TypeScript 程式碼庫共用業務邏輯
* 使用 Kotlin 建構不可共用的 Web 應用程式

更多資訊請參閱 [為 Kotlin Multiplatform 專案選擇合適的 Web 目標](https://kotlinlang.org/docs/multiplatform/choosing-web-target.html)。

針對 JavaScript 時，請使用 `kotlin-multiplatform` 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

透過指定 JavaScript 目標應在瀏覽器還是 Node.js 環境中運行來配置它：

```kotlin
kotlin {
    js().browser {  // or js().nodejs
        /* ... */
    }
}
```

> 請參閱 [更多關於 JavaScript 的 Gradle 配置細節](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#web-targets) 並了解更多關於 [設定 Kotlin/JS 專案](js-project-setup.md) 的資訊。
>
{style="note"}

### 針對 WebAssembly

如果您想在多個平台之間共用邏輯和 UI，請使用 Kotlin/Wasm。更多資訊請參閱
[為 Kotlin Multiplatform 專案選擇合適的 Web 目標](https://kotlinlang.org/docs/multiplatform/choosing-web-target.html)。

與 JavaScript 一樣，針對 WebAssembly (Wasm) 時，請使用 `kotlin-multiplatform` 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

根據您的需求，您可以針對：

* **`wasmJs`**：用於在瀏覽器或 Node.js 中運行
* **`wasmWasi`**：用於在支援 [WASI (WebAssembly System Interface)](https://wasi.dev/) 的 Wasm 環境中運行，例如 Wasmtime、WasmEdge 等。

配置用於網頁瀏覽器或 Node.js 的 `wasmJs` 目標：

```kotlin
kotlin {
    wasmJs {
        browser { // or nodejs
            /* ... */
        }
    }
}
```

對於 WASI 環境，配置 `wasmWasi` 目標：

```kotlin
kotlin {
    wasmWasi {
        nodejs {
            /* ... */
        }
    }
}
```

> [請參閱更多關於 Wasm 的 Gradle 配置細節](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html#web-targets)。
>
{style="note"}

### 針對 Web 目標的 Kotlin 和 Java 原始碼

KGP 僅適用於 Kotlin 檔案，因此建議您將 Kotlin 和 Java 檔案分開存放（如果專案包含 Java 檔案）。如果您不將它們分開存放，請在 `sourceSets{}` 區塊中指定原始碼資料夾：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</tab>
</tabs>

## 使用 KotlinBasePlugin 介面觸發配置動作

要觸發任何 Kotlin Gradle 外掛程式（JVM、JS、Multiplatform、Native 等）應用時的配置動作，
請使用所有 Kotlin 外掛程式繼承的 `KotlinBasePlugin` 介面：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // Configure your action here
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // Configure your action here
}
```

</tab>
</tabs>

## 配置依賴項

要新增對函式庫的依賴項，請在原始碼集 DSL 的 `dependencies{}` 區塊中設定所需[類型](#dependency-types)的依賴項（例如，`implementation`）。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

### 在頂層配置依賴項
<primary-label ref="experimental-opt-in"/>

您可以使用頂層的 `dependencies {}` 區塊在多平台專案中配置通用依賴項。
此處聲明的依賴項其行為如同已新增到 `commonMain` 或 `commonTest` 原始碼集。

要使用頂層 `dependencies {}` 區塊，請在該區塊之前新增 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 註解以啟用選擇性加入：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
    }
}
```

</tab>
</tabs>

在對應目標的 `sourceSets {}` 區塊內新增平台特定依賴項。

您可以在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446) 上分享對此功能的回饋。

### 依賴項類型

根據您的需求選擇依賴項類型。

<table>
    <tr>
        <th>類型</th>
        <th>說明</th>
        <th>使用時機</th>
    </tr>
    <tr>
        <td><code>api</code></td>
        <td>在編譯和執行時使用，並匯出到函式庫的消費者。</td>
        <td>如果依賴項的任何類型在目前模組的公共 API 中使用，請使用 <code>api</code> 依賴項。
        </td>
    </tr>
    <tr>
        <td><code>implementation</code></td>
        <td>在目前模組的編譯和執行時使用，但不暴露給依賴於具有 <code>implementation</code> 依賴項的其他模組的編譯。</td>
        <td>
            <p>用於模組內部邏輯所需的依賴項。</p>
            <p>如果模組是一個不發布的終端應用程式，請使用 <code>implementation</code> 依賴項而不是 <code>api</code> 依賴項。</p>
        </td>
    </tr>
    <tr>
        <td><code>compileOnly</code></td>
        <td>用於目前模組的編譯，但在執行時或任何其他模組的編譯期間不可用。</td>
        <td>用於在執行時具有第三方實現的 API。</td>
    </tr>
    <tr>
        <td><code>runtimeOnly</code></td>
        <td>在執行時可用，但在任何模組的編譯期間不可見。</td>
        <td></td>
    </tr>
</table>

### 標準函式庫的依賴項

標準函式庫 (`stdlib`) 的依賴項會自動新增到每個原始碼集。所使用的標準函式庫版本與 Kotlin Gradle 外掛程式的版本相同。

對於特定平台的原始碼集，會使用對應的特定平台函式庫變體，而通用的標準函式庫會新增到其餘部分。Kotlin Gradle 外掛程式會根據您的 Gradle 建構指令碼的 `compilerOptions.jvmTarget` [編譯器選項](gradle-compiler-options.md)選擇適當的 JVM 標準函式庫。

如果您明確宣告標準函式庫依賴項（例如，如果您需要不同版本），Kotlin Gradle 外掛程式將不會覆寫它或新增第二個標準函式庫。

如果您根本不需要標準函式庫，您可以將以下 Gradle 屬性新增到您的 `gradle.properties` 檔案中：

```none
kotlin.stdlib.default.dependency=false
```

#### 傳遞性依賴項的版本對齊

從 Kotlin 標準函式庫版本 1.9.20 開始，Gradle 使用標準函式庫中包含的中繼資料自動對齊傳遞性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依賴項。

如果您為任何 Kotlin 標準函式庫版本（介於 1.8.0 – 1.9.10 之間）新增依賴項，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，則 Kotlin Gradle 外掛程式會將此 Kotlin 版本用於傳遞性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依賴項。這避免了來自不同標準函式庫版本的類別重複。[了解更多關於將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合併到 `kotlin-stdlib` 的資訊](whatsnew18.md#updated-jvm-compilation-target)。您可以使用 `gradle.properties` 檔案中的 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 屬性禁用此行為：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

##### 對齊版本的其他方法 {initial-collapse-state="collapsed" collapsible="true"}

* 如果您有版本對齊問題，可以透過 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 對齊所有版本。
  在您的建構指令碼中宣告對 `kotlin-bom` 的平台依賴項：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  implementation(platform("org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%"))
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  implementation platform('org.jetbrains.kotlin:kotlin-bom:%kotlinVersion%')
  ```

  </tab>
  </tabs>

* 如果您沒有為標準函式庫版本新增依賴項，但您有兩個不同的依賴項會傳遞性地引入不同舊版本的 Kotlin 標準函式庫，那麼您可以明確要求這些傳遞性函式庫的 `%kotlinVersion%` 版本：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      constraints {
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk7") {
              version {
                  require("%kotlinVersion%")
              }
          }
          add("implementation", "org.jetbrains.kotlin:kotlin-stdlib-jdk8") {
              version {
                  require("%kotlinVersion%")
              }
          }
      }
  }
  ```

  </tab>
  </tabs>
  
* 如果您新增 Kotlin 標準函式庫版本 `%kotlinVersion%` 的依賴項：`implementation("org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%")`，
  並且 Kotlin Gradle 外掛程式是舊版本（早於 `1.8.0`），請更新 Kotlin Gradle 外掛程式以符合標準函式庫版本：

  
  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  plugins {
      // replace `<...>` with the plugin name
      kotlin("<...>") version "%kotlinVersion%"
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  plugins {
      // replace `<...>` with the plugin name
      id "org.jetbrains.kotlin.<...>" version "%kotlinVersion%"
  }
  ```

  </tab>
  </tabs>

* 如果您使用早於 `1.8.0` 的 `kotlin-stdlib-jdk7`/`kotlin-stdlib-jdk8` 版本，例如，
  `implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk7:SOME_OLD_KOTLIN_VERSION")`，並且有一個依賴項會
  傳遞性地引入 `kotlin-stdlib:1.8+`，請將您的 `kotlin-stdlib-jdk<7/8>:SOME_OLD_KOTLIN_VERSION` 替換為
  [`kotlin-stdlib-jdk*:%kotlinVersion%`](whatsnew18.md#updated-jvm-compilation-target) 或
  [排除](https://docs.gradle.org/current/userguide/dependency_downgrade_and_exclude.html#sec:excluding-transitive-deps)
  引入該傳遞性 `kotlin-stdlib:1.8+` 的函式庫：

  <tabs group="build-script">
  <tab title="Kotlin" group-key="kotlin">

  ```kotlin
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude(group = "org.jetbrains.kotlin", module = "kotlin-stdlib")
      }
  }
  ```

  </tab>
  <tab title="Groovy" group-key="groovy">

  ```groovy
  dependencies {
      implementation("com.example:lib:1.0") {
          exclude group: "org.jetbrains.kotlin", module: "kotlin-stdlib"
      }
  }
  ```

  </tab>
  </tabs>

### 設定測試函式庫的依賴項

[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用於測試所有支援平台上的 Kotlin 專案。
將 `kotlin-test` 依賴項新增到 `commonTest` 原始碼集，以便 Gradle 外掛程式可以推斷每個測試原始碼集的相應測試依賴項。

Kotlin/Native 目標不需要額外的測試依賴項，並且 `kotlin.test` API 實作是內建的。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
         commonTest.dependencies {
             implementation(kotlin("test")) // This brings all the platform dependencies automatically
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // This brings all the platform dependencies automatically
            }
        }
    }
}
```

</tab>
</tabs>

> 您可以使用 Kotlin 模組的簡寫形式，例如 `kotlin("test")` 代表 "org.jetbrains.kotlin:kotlin-test"。
>
{style="note"}

您也可以在任何共享或平台特定的原始碼集中使用 `kotlin-test` 依賴項。

#### kotlin-test 的 JVM 變體

對於 Kotlin/JVM，Gradle 預設使用 JUnit 4。因此，`kotlin("test")` 依賴項解析為 JUnit 4 的變體，即 `kotlin-test-junit`。

您可以在建構指令碼的測試任務中呼叫 [`useJUnitPlatform()`]( https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useJUnitPlatform)
或 [`useTestNG()`](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/testing/Test.html#useTestNG) 來選擇 JUnit 5 或 TestNG。
以下範例適用於 Kotlin Multiplatform 專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test"))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        testRuns["test"].executionTask.configure {
            useJUnitPlatform()
        }
    }
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test")
            }
        }
    }
}
```

</tab>
</tabs>

以下範例適用於 JVM 專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    testImplementation(kotlin("test"))
}

tasks {
    test {
        useTestNG()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    testImplementation 'org.jetbrains.kotlin:kotlin-test'
}

test {
    useTestNG()
}
```

</tab>
</tabs>

[了解如何使用 JUnit 在 JVM 上測試程式碼](jvm-test-using-junit.md)。

自動 JVM 變體解析有時可能會導致您的配置出現問題。在這種情況下，您可以明確指定必要的框架，並透過在專案的 `gradle.properties` 檔案中新增此行來禁用自動解析：

```text
kotlin.test.infer.jvm.variant=false
```

如果您在建構指令碼中明確使用了 `kotlin("test")` 的變體，並且您的專案建構因相容性衝突而停止工作，
請參閱 [相容性指南中的此問題](compatibility-guide-15.md#do-not-mix-several-jvm-variants-of-kotlin-test-in-a-single-project)。

### 設定 kotlinx 函式庫的依賴項

如果您使用多平台函式庫並需要依賴共享程式碼，請在共享原始碼集中僅設定一次依賴項。使用函式庫的基本構件名稱，例如 `kotlinx-coroutines-core` 或 `ktor-client-core`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

如果您需要用於特定平台依賴項的 kotlinx 函式庫，您仍然可以在對應的平台原始碼集中使用函式庫的基本構件名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

## 宣告儲存庫

您可以宣告一個公開可用的儲存庫以使用其開源依賴項。在 `repositories{}` 區塊中，設定儲存庫的名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
repositories {
    mavenCentral()
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
repositories {
    mavenCentral()
}
```
</tab>
</tabs>

常見的儲存庫有 [Maven Central](https://central.sonatype.com/) 和 [Google 的 Maven 儲存庫](https://maven.google.com/web/index.html)。

> 如果您也使用 Maven 專案，我們建議避免將 `mavenLocal()` 作為儲存庫新增，因為在 Gradle 和 Maven 專案之間切換時可能會遇到問題。如果您必須新增 `mavenLocal()` 儲存庫，請將其新增到 `repositories{}` 區塊中的最後一個儲存庫。如需更多資訊，請參閱 [The case for mavenLocal()](https://docs.gradle.org/current/userguide/declaring_repositories.html#sec:case-for-maven-local)。
> 
{style="warning"}

如果您需要在多個子專案中宣告相同的儲存庫，請在您的 `settings.gradle(.kts)` 檔案中的 `dependencyResolutionManagement{}` 區塊中集中宣告儲存庫：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}
```
</tab>
</tabs>

子專案中任何宣告的儲存庫都會覆寫集中宣告的儲存庫。有關如何控制此行為以及可用選項的更多資訊，請參閱 [Gradle 的文件](https://docs.gradle.org/current/userguide/declaring_repositories.html#sub:centralized-repository-declaration)。

## 接下來是什麼？

了解更多關於：
* [編譯器選項以及如何傳遞它們](gradle-compiler-options.md)。
* [增量編譯、快取支援、建構報告和 Kotlin 守護程式](gradle-compilation-and-caches.md)。
* [Gradle 基本知識與細節](https://docs.gradle.org/current/userguide/userguide.html)。
* [支援 Gradle 外掛程式變體](gradle-plugin-variants.md)。