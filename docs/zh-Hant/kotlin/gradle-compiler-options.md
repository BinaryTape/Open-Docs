[//]: # (title: Kotlin Gradle 外掛中的編譯器選項)

每個 Kotlin 版本都包含對支援目標的編譯器：JVM、JavaScript 以及適用於[支援平台](native-overview.md#target-platforms)的原生二進位檔案。

這些編譯器會被以下工具使用：
* 當你點擊 Kotlin 專案的 **Compile** 或 **Run** 按鈕時，由 IDE 使用。
* 當你在命令列或 IDE 中呼叫 `gradle build` 時，由 Gradle 使用。
* 當你在命令列或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時，由 Maven 使用。

你也可以從命令列手動執行 Kotlin 編譯器，如[使用命令列編譯器](command-line.md)教學課程中所述。

## 如何定義選項

Kotlin 編譯器有許多選項可用於客製化編譯過程。

Gradle DSL 允許對編譯器選項進行全面性配置。它適用於 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#compiler-options) 和 [JVM/Android](#target-the-jvm) 專案。

透過 Gradle DSL，你可以在建構指令碼中的三個層級配置編譯器選項：
* **[擴充層級](#extension-level)**：在 `kotlin {}` 區塊中，適用於所有目標和共用原始碼集。
* **[目標層級](#target-level)**：在特定目標的區塊中。
* **[編譯單元層級](#compilation-unit-level)**：通常在特定的編譯任務中。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

較高層級的設定會作為較低層級的慣例 (預設值)：

* 在擴充層級設定的編譯器選項，是目標層級選項的預設值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共用原始碼集。
* 在目標層級設定的編譯器選項，是編譯單元（任務）層級選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

反之，較低層級的配置會覆蓋較高層級的相關設定：

* 任務層級的編譯器選項會覆蓋目標或擴充層級的相關配置。
* 目標層級的編譯器選項會覆蓋擴充層級的相關配置。

要找出哪些層級的編譯器引數應用於編譯，請使用 Gradle [記錄](https://docs.gradle.org/current/userguide/logging.html) 的 `DEBUG` 層級。
對於 JVM 和 JS/WASM 任務，在記錄中搜尋 `"Kotlin compiler args:"` 字串；對於原生任務，搜尋 `"Arguments ="` 字串。

> 如果你是第三方外掛作者，最好將你的配置應用於專案層級，以避免覆蓋問題。你可以使用新的 [Kotlin 外掛 DSL 擴充型別](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions) 來實現這一點。建議你明確地在你的文件中說明此配置。
>
{style="tip"}

### 擴充層級

你可以在頂層的 `compilerOptions {}` 區塊中，為所有目標和共用原始碼集配置通用編譯器選項：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

### 目標層級

你可以在 `target {}` 區塊內的 `compilerOptions {}` 區塊中，為 JVM/Android 目標配置編譯器選項：

```kotlin
kotlin {
    target {
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 專案中，你可以在特定目標內部配置編譯器選項。例如，`jvm { compilerOptions {}}`。有關更多資訊，請參閱 [Multiplatform Gradle DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 編譯單元層級

你可以在任務配置的 `compilerOptions {}` 區塊中，為特定的編譯單元或任務配置編譯器選項：

```kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

你也可以透過 `KotlinCompilation` 存取和配置編譯單元層級的編譯器選項：

```kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    optIn.add("kotlin.RequiresOptIn")
                }
            }
        }
    }
}
```

如果你想配置與 JVM/Android 和 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 不同的外掛，
請使用相應 Kotlin 編譯任務的 `compilerOptions {}` 屬性。以下範例顯示如何在 Kotlin 和 Groovy DSL 中設定此配置：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</tab>
</tabs>

### 從 `kotlinOptions {}` 遷移至 `compilerOptions {}` {initial-collapse-state="collapsed" collapsible="true"}

在 Kotlin 2.2.0 之前，你可以使用 `kotlinOptions {}` 區塊配置編譯器選項。由於 `kotlinOptions {}`
區塊已從 Kotlin 2.0.0 起棄用，本節提供了將你的建構指令碼遷移為使用 `compilerOptions {}` 區塊的指南和建議：

* [集中編譯器選項並使用型別](#centralize-compiler-options-and-use-types)
* [棄用 `android.kotlinOptions` 並遷移](#migrate-away-from-android-kotlinoptions)
* [遷移 `freeCompilerArgs`](#migrate-freecompilerargs)

#### 集中編譯器選項並使用型別

盡可能在[擴充層級](#extension-level)配置編譯器選項，並在[編譯單元層級](#compilation-unit-level)針對特定任務覆蓋它們。

你不能在 `compilerOptions {}` 區塊中使用原始字串，因此需要將它們轉換為型別化值。例如，如果你有：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

tasks.withType<KotlinCompile>().configureEach {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        languageVersion = "%languageVersion%"
        apiVersion = "%apiVersion%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

tasks.withType(KotlinCompile).configureEach {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
        languageVersion = '%languageVersion%'
        apiVersion = '%apiVersion%'
    }
}
```

</tab>
</tabs>

遷移後應為：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("jvm") version "%kotlinVersion%"
}

kotlin {
    // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

kotlin {
  // Extension level
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        languageVersion = KotlinVersion.fromVersion("%languageVersion%")
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}

// Example of overriding at compilation unit level
tasks.named("compileKotlin", KotlinJvmCompile).configure {
    compilerOptions {
        apiVersion = KotlinVersion.fromVersion("%apiVersion%")
    }
}
```

</tab>
</tabs>

#### 棄用 `android.kotlinOptions` 並遷移

如果你的建構指令碼先前使用了 `android.kotlinOptions`，請改為遷移至 `kotlin.compilerOptions`。可以在擴充層級或目標層級進行。

例如，如果你有一個 Android 專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.android.application")
    kotlin("android")
}

android {
    kotlinOptions {
        jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    kotlinOptions {
        jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
    }
}
```
</tab>
</tabs>

將其更新為：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
  id("com.android.application")
  kotlin("android")
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
    }
}
```

</tab>
</tabs>

舉例來說，如果你有一個帶有 Android 目標的 Kotlin Multiplatform 專案：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions.jvmTarget = "%jvmLTSVersionSupportedByKotlin%"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = '%jvmLTSVersionSupportedByKotlin%'
            }
        }
    }
}
```

</tab>
</tabs>

將其更新為：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.android.application")
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
plugins {
    id 'org.jetbrains.kotlin.multiplatform'
    id 'com.android.application'
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget = JvmTarget.fromTarget("%jvmLTSVersionSupportedByKotlin%")
        }
    }
}
```

</tab>
</tabs>

#### 遷移 `freeCompilerArgs`

* 將所有 `+=` 操作替換為 `add()` 或 `addAll()` 函數。
* 如果你使用 `-opt-in` 編譯器選項，請檢查 [KGP API 參考](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/) 中是否已有專用的 DSL，並使用它。
* 將所有使用 `-progressive` 編譯器選項的地方遷移為使用專用 DSL：`progressiveMode.set(true)`。
* 將所有使用 `-Xjvm-default` 編譯器選項的地方遷移為[使用專用 DSL](gradle-compiler-options.md#attributes-specific-to-jvm)：`jvmDefault.set()`。使用以下選項對應：

  | Before                            | After                                             |
  |-----------------------------------|---------------------------------------------------|
  | `-Xjvm-default=all-compatibility` | `jvmDefault.set(JvmDefaultMode.ENABLE)`           |
  | `-Xjvm-default=all`               | `jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)` | 
  | `-Xjvm-default=disable`           | `jvmDefault.set(JvmDefaultMode.DISABLE)`          |

例如，如果你有：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += listOf("-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlinOptions {
    freeCompilerArgs += "-opt-in=kotlin.RequiresOptIn"
    freeCompilerArgs += ["-Xcontext-receivers", "-Xinline-classes", "-progressive", "-Xjvm-default=all"]
}
```

</tab>
</tabs>

遷移至：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(listOf("-Xcontext-receivers", "-Xinline-classes"))
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
        freeCompilerArgs.addAll(["-Xcontext-receivers", "-Xinline-classes"])
        progressiveMode.set(true)
        jvmDefault.set(JvmDefaultMode.NO_COMPATIBILITY)
    }
}
```

</tab>
</tabs>

## 目標 JVM

[如前所述](#how-to-define-options)，你可以為 JVM/Android 專案在擴充、目標和編譯單元層級（任務）定義編譯器選項。

預設的 JVM 編譯任務，用於生產程式碼的稱為 `compileKotlin`，用於測試程式碼的稱為 `compileTestKotlin`。自訂原始碼集的任務根據其 `compile<Name>Kotlin` 模式命名。

你可以透過在終端機中執行 `gradlew tasks --all` 命令，並在 `Other tasks` 組中搜尋 `compile*Kotlin` 任務名稱來查看 Android 編譯任務列表。

需要注意的一些重要細節：

* `kotlin.compilerOptions` 配置專案中的每個 Kotlin 編譯任務。
* 你可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }` (或 `tasks.withType<KotlinJvmCompile>().configureEach { }`) 方法覆蓋 `kotlin.compilerOptions` DSL 所應用的配置。

## 目標 JavaScript

JavaScript 編譯任務，用於生產程式碼的稱為 `compileKotlinJs`，用於測試程式碼的稱為 `compileTestKotlinJs`，以及用於自訂原始碼集的 `compile<Name>KotlinJs`。

要配置單一任務，請使用其名稱：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</tab>
</tabs>

請注意，對於 Gradle Kotlin DSL，你應先從專案的 `tasks` 中取得任務。

JS 和通用目標分別使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 型別。

你可以透過在終端機中執行 `gradlew tasks --all` 命令，並在 `Other tasks` 組中搜尋 `compile*KotlinJS` 任務名稱來查看 JavaScript 編譯任務列表。

## 所有 Kotlin 編譯任務

也可以配置專案中的所有 Kotlin 編譯任務：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</tab>
</tabs>

## 所有編譯器選項

以下是 Gradle 編譯器選項的完整列表：

### 通用屬性

| 名稱              | 描述                                                                                                                              | 可能值                    | 預設值        |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | 用於配置[選擇啟用 (opt-in) 編譯器引數](opt-in-requirements.md)列表的屬性                                                                | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 啟用[漸進式 (progressive) 編譯器模式](whatsnew13.md#progressive-mode)                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | 啟用[額外的宣告、表達式和型別編譯器檢查](whatsnew21.md#extra-compiler-checks)，如果為 true 則會發出警告 | `true`, `false`           | `false`       |

### JVM 特有的屬性

| 名稱                      | 描述                                                                                                                                                                                                                                  | 可能值                                                                                         | 預設值                       |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 為方法參數產生 Java 1.8 反射的元資料                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTarget`               | 生成的 JVM 位元組碼的目標版本                                                                                                                                                                                                 | "1.8", "9", "10", ...,  "23", "24"。另請參閱 [編譯器選項的型別](#types-for-compiler-options) | "%defaultJvmTargetVersion%" |
| `noJdk`                   | 不要自動將 Java 執行時納入類別路徑                                                                                                                                                                              |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>Kotlin 和 Java 之間 [JVM 目標相容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) 的驗證</li><li>`KotlinCompile` 型別任務的屬性。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                            | `ERROR`                     |
| `jvmDefault`              | 控制介面中宣告的函數如何編譯為 JVM 上的預設方法                                                                                                                                                      | `ENABLE`, `NO_COMPATIBILITY`, `DISABLE`                                                                 | `ENABLE`                    |

### JVM 和 JavaScript 共有的屬性

| 名稱 | 描述 | 可能值                                                | 預設值 |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 如果有任何警告，則報告錯誤 |                                                                | false |
| `suppressWarnings` | 不要產生警告 |                                                                | false |
| `verbose` | 啟用詳細記錄輸出。僅在[啟用 Gradle 偵錯記錄層級](https://docs.gradle.org/current/userguide/logging.html)時有效 |                                                                | false |
| `freeCompilerArgs` | 附加編譯器引數的列表。你也可以在此處使用實驗性的 `-X` 引數。請參閱[使用 `freeCompilerArgs` 的附加引數範例](#example-of-additional-arguments-usage-via-freecompilerargs) |                                                                | [] |
| `apiVersion`      | 限制宣告的使用，僅限於指定版本捆綁程式庫中的宣告 | "1.8", "1.9", "2.0", "2.1", "2.2" (實驗性) |               |
| `languageVersion` | 提供與指定 Kotlin 版本的原始碼相容性                         | "1.8", "1.9", "2.0", "2.1", "2.2" (實驗性)  |               |

> 我們將在未來版本中棄用 `freeCompilerArgs` 屬性。如果你在 Kotlin Gradle DSL 中缺少某些選項，
> 請[提交問題](https://youtrack.jetbrains.com/newissue?project=kt)。
>
{style="warning"}

#### 使用 `freeCompilerArgs` 的附加引數範例 {initial-collapse-state="collapsed" collapsible="true"}

使用 `freeCompilerArgs` 屬性來提供附加（包括實驗性）編譯器引數。
你可以將單一引數或引數列表新增到此屬性：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion.set(KotlinVersion.%gradleLanguageVersion%)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target
        apiVersion = KotlinVersion.%gradleLanguageVersion%
        jvmTarget = JvmTarget.JVM_1_8
        
        // Single experimental argument
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // Single additional argument, can be a key-value pair
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // List of arguments
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</tab>
</tabs>

> `freeCompilerArgs` 屬性可在[擴充層級](#extension-level)、[目標層級](#target-level)和[編譯單元 (任務) 層級](#compilation-unit-level)使用。
>
{style="tip"} 

#### 設定 `languageVersion` 的範例 {initial-collapse-state="collapsed" collapsible="true"}

要設定語言版本，請使用以下語法：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.%gradleLanguageVersion%
    }
```

</tab>
</tabs>

另請參閱[編譯器選項的型別](#types-for-compiler-options)。

### JavaScript 特有的屬性

| 名稱 | 描述                                                                                                                                                                                                                              | 可能值                                                                                                                                                            | 預設值                       |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 禁用內部宣告匯出                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | 指定 `main` 函數是否應在執行時被呼叫                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 編譯器生成的 JS 模組類型                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | 產生原始碼映射                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | 將原始碼檔案嵌入原始碼映射中                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | 將你在 Kotlin 程式碼中宣告的變數和函數名稱新增到原始碼映射中。有關行為的更多資訊，請參閱我們的[編譯器參考](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | 將指定的字首新增到原始碼映射中的路徑                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 為特定 ECMA 版本生成 JS 檔案                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 讓生成的 JavaScript 程式碼使用 ES2015 類別。在 ES2015 目標使用情況下預設啟用                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### 編譯器選項的型別

一些 `compilerOptions` 使用新類型而非 `String` 型別：

| 選項                             | 型別                                                                                                                                                                                                              | 範例                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` 和 `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 接下來？

了解更多關於：
* [Kotlin Multiplatform DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* [增量編譯、快取支援、建構報告以及 Kotlin Daemon](gradle-compilation-and-caches.md)。
* [Gradle 基礎和細節](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradle 外掛變體支援](gradle-plugin-variants.md)。