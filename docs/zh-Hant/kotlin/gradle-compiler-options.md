[//]: # (title: Kotlin Gradle 插件中的編譯器選項)

每個 Kotlin 版本都包含對應支援目標的編譯器：JVM、JavaScript 以及適用於[支援平台](native-overview.md#target-platforms)的原生二進位檔。

這些編譯器會被以下情境使用：
* 當您在 Kotlin 專案中點擊 IDE 的「__編譯__」或「__執行__」按鈕時。
* 當您在控制台或 IDE 中呼叫 `gradle build` 時，Gradle 會使用。
* 當您在控制台或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時，Maven 會使用。

您也可以按照[使用命令列編譯器](command-line.md)教學中所述，手動從命令列執行 Kotlin 編譯器。

## 如何定義選項

Kotlin 編譯器有許多選項可用於調整編譯過程。

Gradle DSL 允許對編譯器選項進行全面的配置。它適用於 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 和 [JVM/Android](#target-the-jvm) 專案。

透過 Gradle DSL，您可以在建置腳本中於三個層級配置編譯器選項：
* **[擴充功能層級](#extension-level)**：在 `kotlin {}` 區塊中為所有目標和共享來源集配置。
* **[目標層級](#target-level)**：在特定目標的區塊中配置。
* **[編譯單元層級](#compilation-unit-level)**：通常在特定的編譯任務中配置。

![Kotlin compiler options levels](compiler-options-levels.svg){width=700}

較高層級的設定會作為較低層級的慣例（預設值）：

* 在擴充功能層級設定的編譯器選項是目標層級選項的預設值，包括 `commonMain`、`nativeMain` 和 `commonTest` 等共享來源集。
* 在目標層級設定的編譯器選項是編譯單元（任務）層級選項的預設值，例如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務。

反過來，在較低層級進行的配置會覆寫較高層級的相關設定：

* 任務層級的編譯器選項會覆寫目標層級或擴充功能層級的相關配置。
* 目標層級的編譯器選項會覆寫擴充功能層級的相關配置。

若要找出哪一層級的編譯器引數適用於編譯，請使用 Gradle [日誌](https://docs.gradle.org/current/userguide/logging.html)的 `DEBUG` 層級。
對於 JVM 和 JS/WASM 任務，請在日誌中搜尋 `"Kotlin compiler args:"` 字串；對於 Native 任務，請搜尋 `"Arguments ="` 字串。

> 如果您是第三方外掛程式作者，最好在專案層級應用您的配置，以避免覆寫問題。您可以為此使用新的 [Kotlin 外掛程式 DSL 擴充功能類型](whatsnew21.md#new-api-for-kotlin-gradle-plugin-extensions)。建議您明確地記錄此配置。
>
{style="tip"}

### 擴充功能層級

您可以在頂層的 `compilerOptions {}` 區塊中，為所有目標和共享來源集配置通用編譯器選項：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### 目標層級

您可以在 `target {}` 區塊內的 `compilerOptions {}` 區塊中，為 JVM/Android 目標配置編譯器選項：

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 專案中，您可以在特定的目標內部配置編譯器選項。例如，`jvm { compilerOptions {}}`。欲了解更多資訊，請參閱 [Multiplatform Gradle DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 編譯單元層級

您可以在任務配置內部，透過 `compilerOptions {}` 區塊為特定的編譯單元或任務配置編譯器選項：

```Kotlin
tasks.named<KotlinJvmCompile>("compileKotlin"){
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}
```

您也可以透過 `KotlinCompilation` 在編譯單元層級存取和配置編譯器選項：

```Kotlin
kotlin {
    target {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {

                }
            }
        }
    }
}
```

如果您想配置一個與 JVM/Android 和 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 不同目標的外掛程式，請使用對應 Kotlin 編譯任務的 `compilerOptions {}` 屬性。以下範例展示了如何在 Kotlin 和 Groovy DSL 中設定此配置：

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

## 目標 JVM

[如前所述](#how-to-define-options)，您可以為 JVM/Android 專案在擴充功能、目標和編譯單元層級（任務）定義編譯器選項。

預設的 JVM 編譯任務，生產程式碼稱為 `compileKotlin`，測試程式碼稱為 `compileTestKotlin`。自訂來源集的任務會根據其 `compile<Name>Kotlin` 模式命名。

您可以透過在終端機中執行 `gradlew tasks --all` 命令，並在「`Other tasks`」群組中搜尋 `compile*Kotlin` 任務名稱，來查看 Android 編譯任務的列表。

需要注意的一些重要細節：

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置區塊會相互覆寫。最後（最低）的區塊會生效。
* `kotlin.compilerOptions` 會配置專案中的每個 Kotlin 編譯任務。
* 您可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`（或 `tasks.withType<KotlinJvmCompile>().configureEach { }`）方法來覆寫 `kotlin.compilerOptions` DSL 所應用的配置。

## 目標 JavaScript

JavaScript 編譯任務，生產程式碼稱為 `compileKotlinJs`，測試程式碼稱為 `compileTestKotlinJs`，而自訂來源集稱為 `compile<Name>KotlinJs`。

若要配置單一任務，請使用其名稱：

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

請注意，使用 Gradle Kotlin DSL 時，您應首先從專案的 `tasks` 中取得該任務。

JS 目標和通用目標分別使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 類型。

您可以透過在終端機中執行 `gradlew tasks --all` 命令，並在「`Other tasks`」群組中搜尋 `compile*KotlinJS` 任務名稱，來查看 JavaScript 編譯任務的列表。

## 所有 Kotlin 編譯任務

也可以配置專案中所有的 Kotlin 編譯任務：

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

以下是 Gradle 編譯器的所有選項列表：

### 通用屬性

| 名稱              | 描述                                                                           | 可能值           | 預設值        |
|-------------------|--------------------------------------------------------------------------------|-------------------|---------------|
| `optIn`           | 用於配置[選擇加入編譯器引數](opt-in-requirements.md)列表的屬性                     | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 啟用[漸進式編譯器模式](whatsnew13.md#progressive-mode)                           | `true`、`false`   | `false`       |
| `extraWarnings`   | 啟用[額外的宣告、表達式和類型編譯器檢查](whatsnew21.md#extra-compiler-checks)，若為 true 則發出警告 | `true`、`false`   | `false`       |

### JVM 專屬屬性

| 名稱                      | 描述                                                                                                                                                                                                            | 可能值                                                                                         | 預設值                     |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 為 Java 1.8 方法參數上的反射生成中繼資料                                                                                                                                                                      |                                                                                                | false                       |
| `jvmTarget`               | 生成 JVM 位元碼的目標版本                                                                                                                                                                                       | "1.8", "9", "10", ..., "22", "23"。另請參閱[編譯器選項的類型](#types-for-compiler-options)       | "%defaultJvmTargetVersion%" |
| `noJdk`                   | 不要自動將 Java 執行時加入到類別路徑                                                                                                                                                                      |                                                                                                | false                       |
| `jvmTargetValidationMode` | <list><li>驗證 Kotlin 和 Java 之間的 [JVM 目標相容性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)</li><li>`KotlinCompile` 類型任務的屬性。</li></list> | `WARNING`、`ERROR`、`IGNORE`                                                                   | `ERROR`                     |

### JVM 和 JavaScript 通用屬性

| 名稱              | 描述                                                                                                                                                                                                  | 可能值                                       | 預設值        |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------|--------------|
| `allWarningsAsErrors` | 如果有任何警告，則報告錯誤                                                                                                                                                                            |                                              | false        |
| `suppressWarnings` | 不生成警告                                                                                                                                                                                              |                                              | false        |
| `verbose`         | 啟用詳細日誌輸出。僅當[啟用 Gradle 調試日誌級別](https://docs.gradle.org/current/userguide/logging.html)時有效                                                                                               |                                              | false        |
| `freeCompilerArgs` | 額外編譯器引數的列表。您也可以在此處使用實驗性 `-X` 引數。請參閱[額外引數透過 freeCompilerArgs 使用的範例](#example-of-additional-arguments-usage-via-freecompilerargs) |                                              | []           |
| `apiVersion`      | 將宣告的使用限制為指定版本捆綁函式庫中的宣告                                                                                                                                                            | "1.8"、"1.9"、"2.0"、"2.1"、"2.2" (EXPERIMENTAL) |              |
| `languageVersion` | 提供與指定 Kotlin 版本相容的原始碼                                                                                                                                                                    | "1.8"、"1.9"、"2.0"、"2.1"、"2.2" (EXPERIMENTAL)  |              |

> 我們將在未來的版本中棄用 `freeCompilerArgs` 屬性。如果您在 Kotlin Gradle DSL 中缺少某些選項，請[提出問題](https://youtrack.jetbrains.com/newissue?project=kt)。
>
{style="warning"}

#### 透過 freeCompilerArgs 使用額外引數的範例 {initial-collapse-state="collapsed" collapsible="true"}

使用 `freeCompilerArgs` 屬性提供額外（包括實驗性）的編譯器引數。
您可以向此屬性新增單一引數或引數列表：

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

> `freeCompilerArgs` 屬性在[擴充功能](#extension-level)、[目標](#target-level)和[編譯單元（任務）](#compilation-unit-level)層級都可用。
>
{style="tip"} 

#### 設定 languageVersion 的範例 {initial-collapse-state="collapsed" collapsible="true"}

若要設定語言版本，請使用以下語法：

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

另請參閱[編譯器選項的類型](#types-for-compiler-options)。

### JavaScript 專屬屬性

| 名稱                    | 描述                                                                                                                                                                                                           | 可能值                                                                                                                                                                                                | 預設值                           |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `friendModulesDisabled` | 禁用內部宣告匯出                                                                                                                                                                                               |                                                                                                                                                                                                       | `false`                          |
| `main`                  | 指定 `main` 函式是否應在執行時被呼叫                                                                                                                                                                         | `JsMainFunctionExecutionMode.CALL`、`JsMainFunctionExecutionMode.NO_CALL`                                                                                                                             | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind`            | 編譯器生成的 JS 模組類型                                                                                                                                                                                     | `JsModuleKind.MODULE_AMD`、`JsModuleKind.MODULE_PLAIN`、`JsModuleKind.MODULE_ES`、`JsModuleKind.MODULE_COMMONJS`、`JsModuleKind.MODULE_UMD`                                                               | `null`                           |
| `sourceMap`             | 生成原始碼對應 (Source Map)                                                                                                                                                                                  |                                                                                                                                                                                                       | `false`                          |
| `sourceMapEmbedSources` | 將原始碼檔案嵌入到原始碼對應中                                                                                                                                                                               | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`、`JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`、`JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS`                                | `null`                           |
| `sourceMapNamesPolicy`  | 將您在 Kotlin 程式碼中宣告的變數和函式名稱加入到原始碼對應中。有關其行為的更多資訊，請參閱我們的[編譯器參考](compiler-reference.md#source-map-names-policy-simple-names-fully-qualified-names-no) | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`、`JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`、`JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                           |
| `sourceMapPrefix`       | 將指定的字首新增到原始碼對應中的路徑                                                                                                                                                                         |                                                                                                                                                                                                       | `null`                           |
| `target`                | 為特定 ECMA 版本生成 JS 檔案                                                                                                                                                                               | `"es5"`、`"es2015"`                                                                                                                                                                                   | `"es5"`                          |
| `useEsClasses`          | 讓生成的 JavaScript 程式碼使用 ES2015 類別。若使用 ES2015 目標，則預設啟用                                                                                                                                                                                                                                                                                                            | `null`                           |

### 編譯器選項的類型

一些 `compilerOptions` 使用新類型而非 `String` 類型：

| 選項                             | 類型                                                                                                                                                                                                              | 範例                                                                                              |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.%gradleLanguageVersion%)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## 接下來呢？

了解更多關於：
* [Kotlin Multiplatform DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
* [增量編譯、快取支援、建置報告和 Kotlin 守護程式](gradle-compilation-and-caches.md)。
* [Gradle 基礎知識和細節](https://docs.gradle.org/current/userguide/userguide.html)。
* [Gradle 外掛程式變體的支援](gradle-plugin-variants.md)。