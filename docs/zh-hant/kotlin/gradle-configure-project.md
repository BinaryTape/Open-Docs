---
title: "設定 Gradle 專案"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

要使用 [Gradle](https://docs.gradle.org/current/userguide/userguide.html) 構建 Kotlin 專案，您需要在構建腳本檔案 `build.gradle(.kts)` 中 [新增 Kotlin Gradle 插件](#apply-the-plugin) 並在那裡 [設定專案的依賴項](#configure-dependencies)。

:::note
要了解關於構建腳本內容的更多資訊，
請訪問 [探索構建腳本](get-started-with-jvm-gradle-project#explore-the-build-script) 區段。

:::

## 套用插件 (Apply the plugin)

要套用 Kotlin Gradle 插件 (Kotlin Gradle plugin)，請使用來自 Gradle 插件 DSL 的 [`plugins{}` 區塊](https://docs.gradle.org/current/userguide/plugins.html#sec:plugins_block)：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // 將 `<...>` 替換為適用於您的目標環境的插件名稱
    kotlin("<...>") version "2.1.20"
    // 例如，如果您的目標環境是 JVM：
    // kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // 將 `<...>` 替換為適用於您的目標環境的插件名稱
    id 'org.jetbrains.kotlin.<...>' version '2.1.20'
    // 例如，如果您的目標環境是 JVM： 
    // id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}
```

</TabItem>
</Tabs>

:::note
Kotlin Gradle 插件 (KGP) 和 Kotlin 共享相同的版本編號。

:::

在設定您的專案時，請檢查 Kotlin Gradle 插件 (KGP) 與可用的 Gradle 版本的相容性。
在下表中，列出了 Gradle 和 Android Gradle 插件 (AGP) 的最小和最大**完全支援**版本：

| KGP version   | Gradle min and max versions           | AGP min and max versions                            |
|---------------|---------------------------------------|-----------------------------------------------------|
| 2.1.20        | 7.6.3–8.11 | 7.3.1–8.7.2 |
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
:::note
*Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全相容於最高至 8.6 的 Gradle。
Gradle 版本 8.7–8.10 也受支援，但只有一個例外：如果您使用 Kotlin Multiplatform Gradle 插件，
您可能會在您的多平台專案中看到在 JVM 目標中呼叫 `withJava()` 函數的棄用警告。
有關更多資訊，請參閱 [預設建立的 Java 原始碼集](multiplatform-compatibility-guide#java-source-sets-created-by-default)。

您也可以使用最高至最新版本的 Gradle 和 AGP 版本，但如果您這樣做，請記住您可能會遇到
棄用警告或某些新功能可能無法正常工作。

例如，Kotlin Gradle 插件和 `kotlin-multiplatform` 插件 2.1.20 需要您的專案編譯的 Gradle
最低版本為 7.6.3。

同樣，完全支援的最大版本是 8.11。它沒有棄用的 Gradle
方法和屬性，並支援所有目前的 Gradle 功能。

### 專案中的 Kotlin Gradle 插件資料 (Kotlin Gradle plugin data)

預設情況下，Kotlin Gradle 插件將持久性專案特定資料儲存在專案的根目錄下，
在 `.kotlin` 目錄中。

不要將 `.kotlin` 目錄提交到版本控制。
例如，如果您使用 Git，請將 `.kotlin` 新增到您專案的 `.gitignore` 檔案中。

您可以將屬性新增到您專案的 `gradle.properties` 檔案中以設定此行為：

| Gradle property                                     | Description                                                                                                                                       |
|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `kotlin.project.persistent.dir`                     | 設定儲存您的專案層級資料的位置。預設值：`<project-root-directory>/.kotlin`                                      |
| `kotlin.project.persistent.dir.gradle.disableWrite` | 控制是否停用將 Kotlin 資料寫入 `.gradle` 目錄（為了與較舊的 IDEA 版本向後相容）。預設值：false |

## 以 JVM 為目標 (Targeting the JVM)

要以 JVM 為目標，請套用 Kotlin JVM 插件 (Kotlin JVM plugin)。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

`version` 應在此區塊中為文字，且不能從另一個構建腳本套用。

### Kotlin 和 Java 原始碼 (Kotlin and Java sources)

Kotlin 原始碼和 Java 原始碼可以儲存在同一個目錄中，或者它們可以放置在不同的目錄中。

預設慣例是使用不同的目錄：

```text
project
    - src
        - main (root)
            - kotlin
            - java
```

請勿將 Java `.java` 檔案儲存在 `src/*/kotlin` 目錄中，因為 `.java` 檔案將不會被編譯。

相反地，您可以使用 `src/main/java`。

 

如果您未使用預設慣例，則應更新相應的 `sourceSets` 屬性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
sourceSets.main {
    java.srcDirs("src/main/myJava", "src/main/myKotlin")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

</TabItem>
</Tabs>

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 檢查相關編譯任務的 JVM 目標相容性 (Check for JVM target compatibility of related compile tasks)

在構建模組中，您可能具有相關的編譯任務，例如：
* `compileKotlin` 和 `compileJava`
* `compileTestKotlin` 和 `compileTestJava`

`main` 和 `test` 原始碼集編譯任務不相關。

:::

對於像這些相關的任務，Kotlin Gradle 插件檢查 JVM 目標相容性。在 `kotlin` 擴展或任務中的 
[`jvmTarget` 屬性](gradle-compiler-options#attributes-specific-to-jvm) 和在 `java` 擴展或任務中的
[`targetCompatibility`](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)
的不同值會導致 JVM 目標不相容。例如：
`compileKotlin` 任務具有 `jvmTarget=1.8`，且
`compileJava` 任務具有（或 [繼承](https://docs.gradle.org/current/userguide/java_plugin.html#sec:java-extension)）`targetCompatibility=15`。

通過在 `build.gradle(.kts)` 檔案中將 `kotlin.jvm.target.validation.mode` 屬性設定為以下值，來設定對整個專案的此檢查的行為：

* `error` – 插件會使構建失敗；在 Gradle 8.0+ 上的專案的預設值。
* `warning` – 插件會列印警告訊息；在 Gradle 小於 8.0 的專案的預設值。
* `ignore` – 插件跳過檢查且不產生任何訊息。

您也可以在您的 `build.gradle(.kts)` 檔案中的任務層級設定它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile>().configureEach {
    jvmTargetValidationMode.set(org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile.class).configureEach {
    jvmTargetValidationMode = org.jetbrains.kotlin.gradle.dsl.jvm.JvmTargetValidationMode.WARNING
}
```

</TabItem>
</Tabs>

要避免 JVM 目標不相容，[設定工具鏈](#gradle-java-toolchains-support) 或手動對齊 JVM 版本。

#### 如果目標不相容會發生什麼錯誤 (What can go wrong if targets are incompatible)

有兩種手動設定 Kotlin 和 Java 原始碼集的 JVM 目標的方法：
* 通過 [設定 Java 工具鏈](#gradle-java-toolchains-support) 的隱式方法。
* 通過在 `kotlin` 擴展或任務中設定 `jvmTarget` 屬性，以及在 `java` 擴展或任務中設定 `targetCompatibility`
  的顯式方法。

如果您執行以下操作，則會發生 JVM 目標不相容：
* 顯式設定 `jvmTarget` 和 `targetCompatibility` 的不同值。
* 具有預設設定，且您的 JDK 不等於 `1.8`。

讓我們考慮當您的構建腳本中只有 Kotlin JVM 插件且
沒有 JVM 目標的額外設定時，JVM 目標的預設設定：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.jvm" version "2.1.20"
}
```

</TabItem>
</Tabs>

當構建腳本中沒有關於 `jvmTarget` 值的顯式資訊時，其預設值為 `null`，
且編譯器將其轉換為預設值 `1.8`。`targetCompatibility` 等於
當前 Gradle 的 JDK 版本，該版本等於您的 JDK 版本（除非您使用
[Java 工具鏈方法](gradle-configure-project#gradle-java-toolchains-support)）。假設您的 JDK 版本為
`17`，您發佈的程式庫成品將 [宣告自身相容](https://docs.gradle.org/current/userguide/publishing_gradle_module_metadata.html)
於 JDK 17+：`org.gradle.jvm.version=17`，這是錯誤的。
在這種情況下，即使位元組碼的版本為 `1.8`，您也必須在您的主專案中使用 Java 17 才能新增此程式庫。[設定工具鏈](gradle-configure-project#gradle-java-toolchains-support)
以解決此問題。

### Gradle Java 工具鏈支援 (Gradle Java toolchains support)

:::note
Android 用戶的警告。要使用 Gradle 工具鏈支援，請使用 Android Gradle 插件 (AGP) 版本 8.1.0-alpha09 或更高版本。

Gradle Java 工具鏈支援僅從 AGP 7.4.0 [可用](https://issuetracker.google.com/issues/194113162)。
儘管如此，由於 [此問題](https://issuetracker.google.com/issues/260059413)，AGP 並未將 `targetCompatibility`
設定為等於工具鏈的 JDK，直到 8.1.0-alpha09 版本。
如果您使用的版本低於 8.1.0-alpha09，您需要通過 `compileOptions` 手動設定 `targetCompatibility`。
用您想要使用的 JDK 版本替換佔位符 `<MAJOR_JDK_VERSION>`：

```kotlin
android {
    compileOptions {
        sourceCompatibility = <MAJOR_JDK_VERSION>
        targetCompatibility = <MAJOR_JDK_VERSION>
    }
}
```

 

Gradle 6.7 引入了 [Java 工具鏈支援](https://docs.gradle.org/current/userguide/toolchains.html)。
使用此功能，您可以：
* 使用與 Gradle 中不同的 JDK 和 JRE 來執行編譯、測試和可執行檔案。
* 使用尚未發布的語言版本編譯和測試程式碼。

通過工具鏈支援，Gradle 可以自動檢測本地 JDK 並安裝 Gradle 構建所需的缺失 JDK。
現在 Gradle 本身可以在任何 JDK 上執行，並且仍然可以重用 [遠程構建快取功能](gradle-compilation-and-caches#gradle-build-cache-support)
來執行依賴於主要 JDK 版本的任務。

Kotlin Gradle 插件支援用於 Kotlin/JVM 編譯任務的 Java 工具鏈。JS 和 Native 任務不使用工具鏈。
Kotlin 編譯器始終在 Gradle 守護程式運行的 JDK 上運行。
Java 工具鏈：
* 設定可用於 JVM 目標的 [`-jdk-home` 選項](compiler-reference#jdk-home-path)。
* 如果使用者未顯式設定 `jvmTarget` 選項，則將 [`compilerOptions.jvmTarget`](gradle-compiler-options#attributes-specific-to-jvm) 設定為工具鏈的 JDK 版本。
  如果使用者未設定工具鏈，則 `jvmTarget` 欄位使用預設值。
  了解更多關於 [JVM 目標相容性](#check-for-jvm-target-compatibility-of-related-compile-tasks) 的資訊。
* 設定要由任何 Java 編譯、測試和 javadoc 任務使用的工具鏈。
* 影響 [`kapt` workers](kapt#run-kapt-tasks-in-parallel) 在其上運行的 JDK。

使用以下程式碼來設定工具鏈。用您想要使用的 JDK 版本替換佔位符 `<MAJOR_JDK_VERSION>`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvmToolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvmToolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
    // Or shorter:
    jvmToolchain(<MAJOR_JDK_VERSION>)
    // For example:
    jvmToolchain(17)
}
```

</TabItem>
</Tabs>

請注意，通過 `kotlin` 擴展設定工具鏈也會更新 Java 編譯任務的工具鏈。

您可以通過 `java` 擴展設定工具鏈，且 Kotlin 編譯任務將使用它：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
    }
}
```

</TabItem>
</Tabs>

如果您使用 Gradle 8.0.2 或更高版本，您還需要新增一個 [工具鏈解析器插件](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories)。
此類型的插件管理從哪些儲存庫下載工具鏈。作為一個範例，將以下插件新增到您的 `settings.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version("0.9.0")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.gradle.toolchains.foojay-resolver-convention' version '0.9.0'
}
```

</TabItem>
</Tabs>

檢查 `foojay-resolver-convention` 的版本是否與 [Gradle 網站](https://docs.gradle.org/current/userguide/toolchains.html#sub:download_repositories) 上的 Gradle 版本相對應。

要了解 Gradle 使用哪個工具鏈，請使用 [日誌層級 `--info`](https://docs.gradle.org/current/userguide/logging.html#sec:choosing_a_log_level)
運行您的 Gradle 構建，並在輸出中找到以 `[KOTLIN] Kotlin compilation 'jdkHome' argument:` 開頭的字串。
冒號後面的部分將是來自工具鏈的 JDK 版本。

:::

要為特定任務設定任何 JDK（甚至是本地的），請使用 [Task DSL](#set-jdk-version-with-the-task-dsl)。

了解更多關於 [Kotlin 插件中的 Gradle JVM 工具鏈支援](https://blog.jetbrains.com/kotlin/2021/11/gradle-jvm-toolchain-support-in-the-kotlin-plugin/) 的資訊。

### 使用 Task DSL 設定 JDK 版本 (Set JDK version with the Task DSL)

Task DSL 允許為任何實現 `UsesKotlinJavaToolchain` 介面的任務設定任何 JDK 版本。
目前，這些任務是 `KotlinCompile` 和 `KaptTask`。
如果您希望 Gradle 搜尋主要的 JDK 版本，請在您的構建腳本中替換 `<MAJOR_JDK_VERSION>` 佔位符：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val service = project.extensions.getByType<JavaToolchainService>()
val customLauncher = service.launcherFor {
    languageVersion.set(JavaLanguageVersion.of(<MAJOR_JDK_VERSION>))
}
project.tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
JavaToolchainService service = project.getExtensions().getByType(JavaToolchainService.class)
Provider<JavaLauncher> customLauncher = service.launcherFor {
    it.languageVersion = JavaLanguageVersion.of(<MAJOR_JDK_VERSION>)
}
tasks.withType(UsesKotlinJavaToolchain.class).configureEach { task `->`
    task.kotlinJavaToolchain.toolchain.use(customLauncher)
}
```

</TabItem>
</Tabs>

或者您可以指定到您的本地 JDK 的路徑，並用此 JDK 版本替換佔位符 `<LOCAL_JDK_VERSION>`：

```kotlin
tasks.withType<UsesKotlinJavaToolchain>().configureEach {
    kotlinJavaToolchain.jdk.use(
        "/path/to/local/jdk", // 放入到您的 JDK 的路徑
        JavaVersion.<LOCAL_JDK_VERSION> // 例如，JavaVersion.17
    )
}
```

### 關聯編譯器任務 (Associate compiler tasks)

您可以通過設定編譯之間的這種關係來_關聯_編譯，以使一個編譯使用另一個編譯的編譯輸出。關聯編譯會在它們之間建立 `internal` 可見性。

Kotlin 編譯器預設會關聯一些編譯，例如每個目標的 `test` 和 `main` 編譯。
如果您需要表達您的自定義編譯之一已連接到另一個編譯，請建立您自己的關聯編譯。

為了使 IDE 支援用於推斷原始碼集之間的可見性的關聯編譯，請將以下程式碼新增到
您的 `build.gradle(.kts)`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
val integrationTestCompilation = kotlin.target.compilations.create("integrationTest") {
    associateWith(kotlin.target.compilations.getByName("main"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
integrationTestCompilation {
    kotlin.target.compilations.create("integrationTest") {
        associateWith(kotlin.target.compilations.getByName("main"))
    }
}
```

</TabItem>
</Tabs>

在這裡，`integrationTest` 編譯與 `main` 編譯相關聯，從而可以從功能測試中訪問 `internal`
物件。

### 設定啟用 Java 模組 (JPMS) (Configure with Java Modules (JPMS) enabled)

為了使 Kotlin Gradle 插件與 [Java 模組](https://www.oracle.com/corporate/features/understanding-java-9-modules.html) 一起使用，
將以下行新增到您的構建腳本，並用對您的 JPMS 模組的引用替換 `YOUR_MODULE_NAME`，例如
`org.company.module`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>
        
```kotlin
// 如果您使用的 Gradle 版本低於 7.0，則新增以下三行
java {
    modularity.inferModulePath.set(true)
}

tasks.named("compileJava", JavaCompile::class.java) {
    options.compilerArgumentProviders.add(CommandLineArgumentProvider {
        // 將已編譯的 Kotlin 類別提供給 javac – 混合 Java/Kotlin 原始碼才能運作所必需的
        listOf("--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}")
    })
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果您使用的 Gradle 版本低於 7.0，則新增以下三行
java {
    modularity.inferModulePath = true
}

tasks.named("compileJava", JavaCompile.class) {
    options.compilerArgumentProviders.add(new CommandLineArgumentProvider() {
        @Override
        Iterable<String> asArguments() {
            // 將已編譯的 Kotlin 類別提供給 javac – 混合 Java/Kotlin 原始碼才能運作所必需的
            return ["--patch-module", "YOUR_MODULE_NAME=${sourceSets["main"].output.asPath}"]
        }
    })
}
```

</TabItem>
</Tabs>

:::note
像往常一樣將 `module-info.java` 放入 `src/main/java` 目錄中。

對於模組，Kotlin 檔案中的包名稱應等於 `module-info.java` 中的包名稱，以避免
「包是空的或不存在」構建失敗。

:::

了解更多關於：
* [為 Java 模組系統構建模組](https://docs.gradle.org/current/userguide/java_library_plugin.html#sec:java_library_modular)
* [使用 Java 模組系統構建應用程式](https://docs.gradle.org/current/userguide/application_plugin.html#sec:application_modular)
* [「模組」在 Kotlin 中是什麼意思](visibility-modifiers#modules)

### 其他詳細資訊 (Other details)

了解更多關於 [Kotlin/JVM](jvm-get-started) 的資訊。

#### 停用在編譯任務中使用成品 (Disable use of artifact in compilation task)

在某些罕見的情況下，您可能會遇到由循環依賴錯誤引起的構建失敗。例如，當您
有多個編譯，其中一個編譯可以看到另一個編譯的所有內部宣告，且生成的成品
依賴於兩個編譯任務的輸出時：

```none
FAILURE: Build failed with an exception.

What went wrong:
Circular dependency between the following tasks:
:lib:compileKotlinJvm
--- :lib:jvmJar
     \--- :lib:compileKotlinJvm (*)
(*) - details omitted (listed previously)
```

為了修復此循環依賴錯誤，我們新增了一個 Gradle 屬性：`archivesTaskOutputAsFriendModule`。
此屬性控制在編譯任務中使用成品輸入，並確定是否由於
結果而建立任務依賴性。

預設情況下，此屬性設定為 `true` 以追蹤任務依賴性。如果您遇到循環依賴錯誤，
您可以停用在編譯任務中使用成品，以移除任務依賴性並避免循環
依賴錯誤。

要停用在編譯任務中使用成品，請將以下內容新增到您的 `gradle.properties` 檔案中：

```kotlin
kotlin.build.archivesTaskOutputAsFriendModule=false
```

#### 惰性 Kotlin/JVM 任務建立 (Lazy Kotlin/JVM task creation)

從 Kotlin 1.8.20 開始，Kotlin Gradle 插件註冊所有任務，且不在試運行時設定它們。

#### 編譯任務的 destinationDirectory 的非預設位置 (Non-default location of compile tasks' destinationDirectory)

如果您覆蓋 Kotlin/JVM `KotlinJvmCompile`/`KotlinCompile` 任務的 `destinationDirectory` 位置，
請更新您的構建腳本。您需要顯式將 `sourceSets.main.kotlin.classesDirectories` 新增到 `sourceSets.main.outputs`
在您的 JAR 檔案中：

```kotlin
tasks.jar(type: Jar) {
    from sourceSets.main.outputs
    from sourceSets.main.kotlin.classesDirectories
}
```

## 以多個平台為目標 (Targeting multiple platforms)

以 [多個平台](multiplatform-dsl-reference#targets) 為目標的專案，稱為 [多平台專案](multiplatform-intro)，
需要 `kotlin-multiplatform` 插件。

:::note
`kotlin-multiplatform` 插件適用於 Gradle 7.6.3 或更高版本。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

了解更多關於 [適用於不同平台的 Kotlin Multiplatform](multiplatform-intro) 和
[適用於 iOS 和 Android 的 Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html) 的資訊。

## 以 Android 為目標 (Targeting Android)

建議使用 Android Studio 來建立 Android 應用程式。[了解如何使用 Android Gradle 插件](https://developer.android.com/studio/releases/gradle-plugin)。

## 以 JavaScript 為目標 (Targeting JavaScript)

以 JavaScript 為目標時，也請使用 `kotlin-multiplatform` 插件。[了解更多關於設定 Kotlin/JS 專案的資訊](js-project-setup)

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

### 適用於 JavaScript 的 Kotlin 和 Java 原始碼 (Kotlin and Java sources for JavaScript)

此插件僅適用於 Kotlin 檔案，因此建議您將 Kotlin 和 Java 檔案分開（如果
專案包含 Java 檔案）。如果您不將它們分開儲存，請在 `sourceSets{}` 區塊中指定原始碼資料夾：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets["main"].apply {
        kotlin.srcDir("src/main/myKotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'src/main/myKotlin'
    }
}
```

</TabItem>
</Tabs>

## 使用 KotlinBasePlugin 介面觸發設定動作 (Triggering configuration actions with the KotlinBasePlugin interface)

要觸發某些設定動作，只要套用任何 Kotlin Gradle 插件（JVM、JS、Multiplatform、Native 和其他），
請使用所有 Kotlin 插件都繼承的 `KotlinBasePlugin` 介面：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType<KotlinBasePlugin>() {
    // 在此設定您的動作
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.KotlinBasePlugin

// ...

project.plugins.withType(KotlinBasePlugin.class) {
    // 在此設定您的動作
}
```

</TabItem>
</Tabs>

## 設定依賴項 (Configure dependencies)

要新增對程式庫的依賴項，請在原始碼集的 DSL 的 `dependencies{}` 區塊中設定所需 [類型](#dependency-types)（例如，`implementation`）的依賴項。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

或者，您可以 [在頂層設定依賴項](#set-dependencies-at-top-level)。

### 依賴項類型 (Dependency types)

根據您的需求選擇依賴項類型。
<table>
<tr>
        <th>類型 (Type)</th>
        <th>描述 (Description)</th>
        <th>何時使用 (When to use)</th>
</tr>
<tr>
<td>
`api`
</td>
<td>
在編譯時和運行時都使用，並且匯出到程式庫使用者。
</td>
<td>
如果在目前模組的公共 API 中使用了依賴項中的任何類型，請使用 `api` 依賴項。
</td>
</tr>
<tr>
<td>
`implementation`
</td>
<td>
在目前模組的編譯時和運行時使用，但不暴露於其他模組的編譯，
            具體取決於具有 `implementation` 依賴項的模組。
</td>
<td>

<p>
   用於模組的內部邏輯所需的依賴項。
</p>
<p>
   如果模組是不發佈的端點應用程式，請使用 `implementation` 依賴項，而不是
                `api` 依賴項。
</p>
</td>
</tr>
<tr>
<td>
`compileOnly`
</td>
<td>
用於目前模組的編譯，且在運行時或其他模組的編譯期間不可用。
</td>
<td>
用於在運行時具有可用的第三方實作的 API。
</td>
</tr>
<tr>
<td>
`runtimeOnly`
</td>
<td>
在運行時可用，但在任何模組的編譯期間都不可見。
</td>
<td>
</td>
</tr>
</table>

### 關於標準程式庫的依賴項 (Dependency on the standard library)

對標準程式庫 (`stdlib`) 的依賴項會自動新增到每個原始碼集。標準程式庫的版本
與 Kotlin Gradle 插件的版本相同。

對於平台特定的原始碼集，使用該程式庫的相應平台特定的變體，同時將通用的標準
程式庫新增到其餘部分。Kotlin Gradle 插件根據您的 Gradle 構建腳本的
`compilerOptions.jvmTarget` [編譯器選項](gradle-compiler-options) 選擇適當的 JVM 標準程式庫。

如果您顯式宣告標準程式庫依賴項（例如，如果您需要不同的版本），則 Kotlin Gradle
插件不會覆蓋它或新增第二個標準程式庫。

如果您根本不需要標準程式庫，您可以將以下 Gradle 屬性新增到您的 `gradle.properties` 檔案中：

```none
kotlin.stdlib.default.dependency=false
```

#### 轉移依賴項的版本對齊 (Versions alignment of transitive dependencies)

從 Kotlin 標準程式庫版本 1.9.2