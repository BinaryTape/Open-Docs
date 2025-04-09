---
title: "Kotlin Gradle 外掛程式中的編譯器選項"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

每個 Kotlin 版本都包含支援目標的編譯器：
JVM、JavaScript 和 [支援平台](native-overview#target-platforms) 的原生二進制檔案。

這些編譯器被以下項目使用：
* IDE，當您點擊 Kotlin 專案的 __Compile__（編譯）或 __Run__（執行）按鈕時。
* Gradle，當您在控制台或 IDE 中呼叫 `gradle build` 時。
* Maven，當您在控制台或 IDE 中呼叫 `mvn compile` 或 `mvn test-compile` 時。

您也可以從命令行手動執行 Kotlin 編譯器，如[使用命令行編譯器](command-line)教學課程中所述。

## 如何定義選項

Kotlin 編譯器有多個選項，可用於客製化編譯過程。

Gradle DSL 允許對編譯器選項進行全面的配置。它適用於 [Kotlin Multiplatform](multiplatform-dsl-reference) 和 [JVM/Android](#target-the-jvm) 專案。

透過 Gradle DSL，您可以在建構腳本中的三個層級配置編譯器選項：
* **[Extension level](#extension-level)（擴展層級）**，在適用於所有目標和共享原始碼集的 `kotlin {}` 區塊中。
* **[Target level](#target-level)（目標層級）**，在特定目標的區塊中。
* **[Compilation unit level](#compilation-unit-level)（編譯單元層級）**，通常在特定的編譯任務中。

<img src="/img/compiler-options-levels.svg" alt="Kotlin 編譯器選項層級" width="700" style={{verticalAlign: 'middle'}}/>

較高層級的設定將被用作較低層級的慣例（預設值）：

* 在擴展層級設定的編譯器選項是目標層級選項（包括共享原始碼集，如 `commonMain`、`nativeMain` 和 `commonTest`）的預設值。
* 在目標層級設定的編譯器選項是編譯單元（任務）層級選項（如 `compileKotlinJvm` 和 `compileTestKotlinJvm` 任務）的預設值。

反過來，在較低層級所做的配置會覆蓋較高層級的相關設定：

* 任務層級的編譯器選項會覆蓋目標層級或擴展層級的相關配置。
* 目標層級的編譯器選項會覆蓋擴展層級的相關配置。

要了解哪個層級的編譯器參數應用於編譯，請使用 Gradle [logging](https://docs.gradle.org/current/userguide/logging.html) 的 `DEBUG` 層級。
對於 JVM 和 JS/WASM 任務，請在日誌中搜尋 `"Kotlin compiler args:"` 字串；對於 Native 任務，
請搜尋 `"Arguments ="` 字串。

:::tip
如果您是第三方外掛程式作者，最好的方式是在專案層級應用您的配置，以避免覆蓋問題。您可以為此使用新的 [Kotlin plugin DSL extension types](whatsnew21#new-api-for-kotlin-gradle-plugin-extensions)。建議您在您這一側明確記錄此配置。

:::

### Extension level（擴展層級）

您可以為所有目標和共享原始碼集在最上層的 `compilerOptions {}` 區塊中配置通用的編譯器選項：

```kotlin
kotlin {
    compilerOptions {
        optIn.add("kotlin.RequiresOptIn")
    }
}    
```

### Target level（目標層級）

您可以在 `target {}` 區塊內的 `compilerOptions {}` 區塊中配置 JVM/Android 目標的編譯器選項：

```kotlin
kotlin {
    target { 
        compilerOptions {
            optIn.add("kotlin.RequiresOptIn")
        }
    }
}
```

在 Kotlin Multiplatform 專案中，您可以在特定的目標內配置編譯器選項。例如，`jvm { compilerOptions {}}`。更多資訊，請參閱 [Multiplatform Gradle DSL reference](multiplatform-dsl-reference)。

### Compilation unit level（編譯單元層級）

您可以在任務配置內的 `compilerOptions {}` 區塊中為特定的編譯單元或任務配置編譯器選項：

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

如果您想配置與 JVM/Android 和 [Kotlin Multiplatform](multiplatform-dsl-reference) 不同的目標的外掛程式，
請使用相應 Kotlin 編譯任務的 `compilerOptions {}` 屬性。以下範例
展示瞭如何在 Kotlin 和 Groovy DSL 中設定此配置：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask::class.java) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks.named('compileKotlin', org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class) {
    compilerOptions {
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_0)
    }
}
```

</TabItem>
</Tabs>

## Target the JVM（以 JVM 為目標）

[如先前所述](#how-to-define-options)，您可以在擴展、目標和編譯單元層級（任務）為您的 JVM/Android 專案定義編譯器選項。

預設的 JVM 編譯任務對於生產程式碼稱為 `compileKotlin`，對於測試程式碼稱為 `compileTestKotlin`。
自定義原始碼集的任務根據其 `compile<Name>Kotlin` 模式命名。

您可以透過在終端機中執行 `gradlew tasks --all` 命令，並在 `Other tasks`（其他任務）群組中搜尋 `compile*Kotlin` 任務名稱來查看 Android 編譯任務的列表。

需要注意的一些重要細節：

* `android.kotlinOptions` 和 `kotlin.compilerOptions` 配置區塊會互相覆蓋。最後（最低）的區塊生效。
* `kotlin.compilerOptions` 配置專案中的每個 Kotlin 編譯任務。
* 您可以使用 `tasks.named<KotlinJvmCompile>("compileKotlin") { }`（或 `tasks.withType<KotlinJvmCompile>().configureEach { }`）方法覆蓋 `kotlin.compilerOptions` DSL 所應用的配置。

## Target JavaScript（以 JavaScript 為目標）

JavaScript 編譯任務對於生產程式碼稱為 `compileKotlinJs`，對於測試程式碼稱為 `compileTestKotlinJs`，對於自定義原始碼集稱為 `compile<Name>KotlinJs`。

要配置單個任務，請使用其名稱：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

val compileKotlin: KotlinCompilationTask<*> by tasks

compileKotlin.compilerOptions.suppressWarnings.set(true)
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        suppressWarnings = true
    }
}
```

</TabItem>
</Tabs>

請注意，使用 Gradle Kotlin DSL，您應該首先從專案的 `tasks` 中取得任務。

分別為 JS 和通用目標使用 `Kotlin2JsCompile` 和 `KotlinCompileCommon` 類型。

您可以透過在終端機中執行 `gradlew tasks --all` 命令，並在 `Other tasks`（其他任務）群組中搜尋 `compile*KotlinJS` 任務名稱來查看 JavaScript 編譯任務的列表。

## All Kotlin compilation tasks（所有 Kotlin 編譯任務）

也可以配置專案中的所有 Kotlin 編譯任務：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions { /*...*/ }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions { /*...*/ }
}
```

</TabItem>
</Tabs>

## All compiler options（所有編譯器選項）

以下是 Gradle 編譯器的完整選項列表：

### Common attributes（通用屬性）

| Name（名稱）              | Description（描述）                                                                                                                              | Possible values（可能的值）           | Default value（預設值） |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|---------------|
| `optIn`           | 用於配置 [opt-in compiler arguments](opt-in-requirements)（選擇加入編譯器參數）列表的屬性                                                 | `listOf( /* opt-ins */ )` | `emptyList()` |
| `progressiveMode` | 啟用 [progressive compiler mode](whatsnew13#progressive-mode)（漸進式編譯器模式）                                                                  | `true`, `false`           | `false`       |
| `extraWarnings`   | 如果為 true，啟用 [additional declaration, expression, and type compiler checks](whatsnew21#extra-compiler-checks)（額外的宣告、表達式和類型編譯器檢查），這些檢查會發出警告 | `true`, `false`           | `false`       |

### Attributes specific to JVM（特定於 JVM 的屬性）

| Name（名稱）                      | Description（描述）                                                                                                                                                                                                                                   | Possible values（可能的值）                                                                                         | Default value（預設值）               |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------|
| `javaParameters`          | 為 Java 1.8 反射生成方法參數的元資料                                                                                                                                                                                |                                                                                                         | false                       |
| `jvmTarget`               | 生成的 JVM 位元組碼的目標版本                                                                                                                                                                                                  | "1.8", "9", "10", ...,  "22", "23"。另請參閱 [Types for compiler options](#types-for-compiler-options)（編譯器選項的類型） | "1.8" |
| `noJdk`                   | 不要自動將 Java 運行時包含到類別路徑中                                                                                                                                                                               |                                                                                                         | false                       |
| `jvmTargetValidationMode` | <list><li>驗證 Kotlin 和 Java 之間的 [JVM target compatibility](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)（JVM 目標兼容性）</li><li>`KotlinCompile` 類型的任務的屬性。</li></list> | `WARNING`, `ERROR`, `IGNORE`                                                                              | `ERROR`                     |

### Attributes common to JVM and JavaScript（JVM 和 JavaScript 共有的屬性）

| Name（名稱） | Description（描述） | Possible values（可能的值）                                                |Default value（預設值） |
|------|-------------|----------------------------------------------------------------|--------------|
| `allWarningsAsErrors` | 如果有任何警告，報告錯誤 |                                                                | false |
| `suppressWarnings` | 不要產生警告 |                                                                | false |
| `verbose` | 啟用詳細記錄輸出。僅當啟用 [Gradle debug log level enabled](https://docs.gradle.org/current/userguide/logging.html)（Gradle 偵錯記錄層級）時才有效 |                                                                | false |
| `freeCompilerArgs` | 額外的編譯器參數列表。您也可以在此處使用實驗性的 `-X` 參數。請參閱 [example](#example-of-additional-arguments-usage-via-freecompilerargs)（範例） |                                                                | [] |
| `apiVersion`      | 將宣告的使用限制為來自指定版本的捆綁庫的宣告 | "1.8", "1.9", "2.0", "2.1", "2.2" (實驗性) |               |
| `languageVersion` | 提供與指定版本的 Kotlin 的原始碼相容性                         | "1.8", "1.9", "2.0", "2.1", "2.2" (實驗性)  |               |
:::tip
我們將在未來的版本中棄用 `freeCompilerArgs` 屬性。如果您在 Kotlin Gradle DSL 中遺漏了一些選項，
請[提交 issue](https://youtrack.jetbrains.com/newissue?project=kt)。

#### Example of additional arguments usage via freeCompilerArgs （透過 freeCompilerArgs 使用其他參數的範例）

使用 `freeCompilerArgs` 屬性來提供額外的（包括實驗性的）編譯器參數。
您可以將單個參數或參數列表新增到此屬性：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

kotlin {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target（指定 Kotlin API 和 JVM 目標的版本）
        apiVersion.set(KotlinVersion.KOTLIN_2_1)
        jvmTarget.set(JvmTarget.JVM_1_8)
        
        // Single experimental argument（單個實驗性參數）
        freeCompilerArgs.add("-Xexport-kdoc")

        // Single additional argument（單個額外參數）
        freeCompilerArgs.add("-Xno-param-assertions")

        // List of arguments（參數列表）
        freeCompilerArgs.addAll(
            listOf(
                "-Xno-receiver-assertions",
                "-Xno-call-assertions"
            )
        ) 
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // Specifies the version of the Kotlin API and the JVM target（指定 Kotlin API 和 JVM 目標的版本）
        apiVersion = KotlinVersion.KOTLIN_2_1
        jvmTarget = JvmTarget.JVM_1_8
        
        // Single experimental argument（單個實驗性參數）
        freeCompilerArgs.add("-Xexport-kdoc")
        
        // Single additional argument, can be a key-value pair（單個額外參數，可以是鍵值對）
        freeCompilerArgs.add("-Xno-param-assertions")
        
        // List of arguments（參數列表）
        freeCompilerArgs.addAll(["-Xno-receiver-assertions", "-Xno-call-assertions"])
    }
}
```

</TabItem>
</Tabs>

`freeCompilerArgs` 屬性在 [extension](#extension-level)（擴展層級）、[target](#target-level)（目標層級）和 [compilation unit (task)](#compilation-unit-level)（編譯單元（任務）層級）可用。

::: 

#### Example of setting languageVersion （設定 languageVersion 的範例）

要設定語言版本，請使用以下語法：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
tasks
    .withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask.class)
    .configureEach {
        compilerOptions.languageVersion =
            org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_2_1
    }
```

</TabItem>
</Tabs>

另請參閱 [Types for compiler options](#types-for-compiler-options)（編譯器選項的類型）。

### Attributes specific to JavaScript（特定於 JavaScript 的屬性）

| Name（名稱） | Description（描述）                                                                                                                                                                                                                              | Possible values（可能的值）                                                                                                                                                            | Default value（預設值）                      |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| `friendModulesDisabled` | 禁用內部宣告匯出                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `main` | 指定是否應在執行時呼叫 `main` 函數                                                                                                                                                                       | `JsMainFunctionExecutionMode.CALL`, `JsMainFunctionExecutionMode.NO_CALL`                                                                                                  | `JsMainFunctionExecutionMode.CALL` |
| `moduleKind` | 編譯器產生的 JS 模組種類                                                                                                                                                                                          | `JsModuleKind.MODULE_AMD`, `JsModuleKind.MODULE_PLAIN`, `JsModuleKind.MODULE_ES`, `JsModuleKind.MODULE_COMMONJS`, `JsModuleKind.MODULE_UMD`                                | `null`                               |
| `sourceMap` | 產生源地圖（source map）                                                                                                                                                                                                                      |                                                                                                                                                                            | `false`                              |
| `sourceMapEmbedSources` | 將源文件嵌入到源地圖中                                                                                                                                                                                                   | `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_NEVER`, `JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_ALWAYS` | `null`                               |
| `sourceMapNamesPolicy` | 將您在 Kotlin 程式碼中宣告的變數和函數名稱新增到源地圖中。有關行為的更多資訊，請參閱我們的 [compiler reference](compiler-reference#source-map-names-policy-simple-names-fully-qualified-names-no)（編譯器參考） | `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_SIMPLE_NAMES`, `JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_NO` | `null`                               |
| `sourceMapPrefix` | 將指定的字首新增到源地圖中的路徑                                                                                                                                                                                      |                                                                                                                                                                            | `null`                               |
| `target` | 為特定的 ECMA 版本生成 JS 文件                                                                                                                                                                                              | `"es5"`, `"es2015"`                                                                                                                                                            | `"es5"`                              |
| `useEsClasses` | 讓生成的 JavaScript 程式碼使用 ES2015 類別。在使用 ES2015 目標時預設啟用                                                                                                                                                                                              |                                                                                                                                                                            | `null`                               |

### Types for compiler options（編譯器選項的類型）

某些 `compilerOptions` 使用新的類型而不是 `String` 類型：

| Option（選項）                             | Type（類型）                                                                                                                                                                                                              | Example（範例）                                                                                              |
|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| `jvmTarget`                        | [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)                                     | `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)`                                                    |
| `apiVersion` and `languageVersion` | [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)                             | `compilerOptions.languageVersion.set(KotlinVersion.KOTLIN_2_1)`                         |
| `main`                             | [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt) | `compilerOptions.main.set(JsMainFunctionExecutionMode.NO_CALL)`                                      |
| `moduleKind`                       | [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)                               | `compilerOptions.moduleKind.set(JsModuleKind.MODULE_ES)`                                             |
| `sourceMapEmbedSources`            | [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)               | `compilerOptions.sourceMapEmbedSources.set(JsSourceMapEmbedMode.SOURCE_MAP_SOURCE_CONTENT_INLINING)` |
| `sourceMapNamesPolicy`             | [`JsSourceMapNamesPolicy`](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapNamesPolicy.kt)           | `compilerOptions.sourceMapNamesPolicy.set(JsSourceMapNamesPolicy.SOURCE_MAP_NAMES_POLICY_FQ_NAMES)`  |

## What's next?（下一步是什麼？）

瞭解更多關於：
* [Kotlin Multiplatform DSL reference](multiplatform-dsl-reference)（Kotlin 多平台 DSL 參考）。
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches)（增量編譯、快取支援、建構報告和 Kotlin 後台程式）。
* [Gradle basics and specifics](https://docs.gradle.org/current/userguide/userguide.html)（Gradle 基礎知識和細節）。
* [Support for Gradle plugin variants](gradle-plugin-variants)（對 Gradle 外掛程式變體的支援）。