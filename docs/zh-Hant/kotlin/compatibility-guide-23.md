[//]: # (title: Kotlin 2.3 相容性指南)

_保持語言現代化 (Keeping the Language Modern)_ 和 _舒適的更新 (Comfortable Updates)_ 是 Kotlin 語言設計的_核心原則_。前者指出應移除阻礙語言演進的建構，後者則要求此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）發布，本文件將它們全部彙整，為從 Kotlin 2.2 遷移到 Kotlin 2.3 提供完整的參考。本文件也包含工具相關變更的資訊。

## 基本術語

在本文件中，我們引入了幾種相容性：

-   _原始碼 (source)_：原始碼不相容變更會使過去能正常編譯（沒有錯誤或警告）的程式碼不再編譯成功。
-   _二進位 (binary)_：如果兩個二進位構件在互換時不會導致載入或連結錯誤，則稱它們是二進位相容的。
-   _行為 (behavioral)_：如果同一程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如，從 Java）來看的 Kotlin 程式碼相容性，不在本文件的討論範圍內。

## 語言

### 移除對 `-language-version` 中 1.8 和 1.9 的支援

> **問題編號**: [KT-76343](https://youtrack.jetbrains.com/issue/KT-76343), [KT-76344](https://youtrack.jetbrains.com/issue/KT-76344).
>
> **元件**: 編譯器 (Compiler)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 從 Kotlin 2.3 開始，編譯器不再支援 [`-language-version=1.8`](compiler-reference.md#language-version-version)。對於非 JVM 平台，也移除了對 `-language-version=1.9` 的支援。
>
> **棄用週期**:
>
> -   2.2.0: 當 `-language-version` 與 1.8 和 1.9 版本一起使用時，報告警告。
> -   2.3.0: 將 `-language-version` 與 1.8 版本在所有平台上，以及與 1.9 版本在非 JVM 平台上使用的警告提升為錯誤。

### 針對帶有 typealias 的推斷型別報告上限約束違規錯誤

> **問題編號**: [KTLC-287](https://youtrack.jetbrains.com/issue/KTLC-287)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 過去，編譯器從未報告關於推斷型別的上限約束違規錯誤。這已在 Kotlin 2.3.0 中修復，以確保在所有型別參數中一致地報告錯誤。
>
> **棄用週期**:
>
> -   2.2.20: 針對隱式型別參數的邊界違規報告棄用警告。
> -   2.3.0: 將 `UPPER_BOUND_VIOLATED` 的警告提升為針對隱式型別參數的錯誤。

### 禁止在 `inline` 和 `crossinline` lambdas 上使用 `@JvmSerializableLambda` 註解

> **問題編號**: [KTLC-9](https://youtrack.jetbrains.com/issue/KTLC-9)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 您不再能將 `@JvmSerializableLambda` 註解應用於 `inline` 或 `crossinline` lambdas。這些 lambdas 不可序列化，因此應用 `@JvmSerializableLambda` 沒有任何作用。
>
> **棄用週期**:
>
> -   2.1.20: 當 `@JvmSerializableLambda` 應用於 `inline` 和 `crossinline` lambdas 時，報告警告。
> -   2.3.0: 將警告提升為錯誤；此變更可在 progressive 模式下啟用。

### 禁止將 Kotlin 介面委派給通用簽章不匹配的 Java 類別

> **問題編號**: [KTLC-267](https://youtrack.jetbrains.com/issue/KTLC-267)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 禁止委派給實現通用介面方法但帶有非通用覆寫的 Java 類別。此前，允許此行為會導致型別不匹配和在執行時報告 `ClassCastException`。此變更將錯誤從執行時移至編譯時。
>
> **棄用週期**:
>
> -   2.1.20: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用在沒有顯式回傳型別的表達式函式中使用 `return`

> **問題編號**: [KTLC-288](https://youtrack.jetbrains.com/issue/KTLC-288)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 當函式的回傳型別未顯式宣告時，Kotlin 現在棄用在表達式主體內部使用 `return`。
>
> **棄用週期**:
>
> -   2.3.0: 報告警告。
> -   2.4.0: 將警告提升為錯誤。

### 禁止從透過 typealias 引入的可空超型別繼承

> **問題編號**: [KTLC-279](https://youtrack.jetbrains.com/issue/KTLC-279)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 現在在嘗試從可空 typealias 繼承時報告錯誤，這與它處理直接可空超型別的方式保持一致。
>
> **棄用週期**:
>
> -   2.2.0: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 統一頂層 lambdas 和呼叫參數的通用簽章生成

> **問題編號**: [KTLC-277](https://youtrack.jetbrains.com/issue/KTLC-277)
>
> **元件**: 反射 (Reflection)
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要概述**: Kotlin 2.3.0 對頂層 lambdas 使用與作為呼叫參數傳遞的 lambdas 相同的型別檢查邏輯，確保在兩種情況下都能產生一致的通用簽章。
>
> **棄用週期**:
>
> -   2.3.0: 引入新行為；不適用於 progressive 模式。

### 禁止將 reified 型別參數推斷為交集型別

> **問題編號**: [KTLC-13](https://youtrack.jetbrains.com/issue/KTLC-13)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 禁止將 reified 型別參數推斷為交集型別的情況，因為這可能導致不正確的執行時行為。
>
> **棄用週期**:
>
> -   2.1.0: 當 reified 型別參數被推斷為交集型別時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 禁止透過型別參數邊界公開可見性較低的型別

> **問題編號**: [KTLC-275](https://youtrack.jetbrains.com/issue/KTLC-275)
>
> **元件**: 核心語言 (Core language)
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 禁止使用型別參數邊界來公開可見性比函式或宣告本身更具限制性的型別，這使得函式規則與已應用於類別的規則保持一致。
>
> **棄用週期**:
>
> -   2.1.0: 在有問題的型別參數邊界上報告警告。
> -   2.3.0: 將警告提升為錯誤。

## 標準函式庫

### 棄用 Char 到數字的轉換並引入明確的數字和程式碼 API

> **問題編號**: [KTLC-321](https://youtrack.jetbrains.com/issue/KTLC-321)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 棄用了用於數值型別的 `Char.toX()` 和 `X.toChar()` 轉換，並引入了新的、明確的 API 以存取字元的程式碼和數字值。
>
> **棄用週期**:
>
> -   1.4.30: 作為實驗性功能引入新函式。
> -   1.5.0: 將新函式提升為穩定版；針對舊函式報告警告並提供替換建議。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `Number.toChar()` 函式

> **問題編號**: [KT-56822](https://youtrack.jetbrains.com/issue/KT-56822)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `Number.toChar()` 函式已被棄用。請改用 `toInt().toChar()` 或 `Char` 建構函式。
>
> **棄用週期**:
>
> -   1.9.0: 當使用 `Number.toChar()` 函式時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `String.subSequence(start, end)` 函式

> **問題編號**: [KTLC-282](https://youtrack.jetbrains.com/issue/KTLC-282)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `String.subSequence(start, end)` 函式已被棄用。請改用 [`String.subSequence(startIndex, endIndex)`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-string/sub-sequence.html) 函式。
>
> **棄用週期**:
>
> -   1.0: 當使用 `String.subSequence(start, end)` 時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函式

> **問題編號**: [KTLC-281](https://youtrack.jetbrains.com/issue/KTLC-281)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函式已被棄用。請改用 [`kotlin.io.path.createTempDirectory()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-directory.html) 和 [`kotlin.io.path.createTempFile()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.path/create-temp-file.html) 函式。
>
> **棄用週期**:
>
> -   1.4.20: 當使用 `kotlin.io.createTempDirectory()` 和 `kotlin.io.createTempFile()` 函式時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 隱藏 `InputStream.readBytes(Int)` 函式

> **問題編號**: [KTLC-280](https://youtrack.jetbrains.com/issue/KTLC-280)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `InputStream.readBytes(estimatedSize: Int = DEFAULT_BUFFER_SIZE): ByteArray` 函式在棄用很久之後，現在被隱藏了。
>
> **棄用週期**:
>
> -   1.3.0: 報告警告。
> -   1.5.0: 將警告提升為錯誤。
> -   2.3.0: 隱藏此函式。

### 統一 Kotlin/Native 堆疊追蹤列印與其他平台

> **問題編號**: [KT-81431](https://youtrack.jetbrains.com/issue/KT-81431)
>
> **元件**: Kotlin/Native
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要概述**: 在格式化例外堆疊追蹤時，如果相同的例外原因已經列印過，則不會列印額外的原因。
>
> **棄用週期**:
>
> -   2.3.20: 統一 Kotlin/Native 例外堆疊追蹤格式與其他 Kotlin 平台。

### 修正 `Iterable<T>.intersect()` 和 `Iterable<T>.subtract()` 行為

> **問題編號**: [KTLC-268](https://youtrack.jetbrains.com/issue/KTLC-268)
>
> **元件**: kotlin-stdlib
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要概述**: [`Iterable<T>.intersect()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/intersect.html) 和 [`Iterable<T>.subtract()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/subtract.html) 函式現在會先測試每個接收者元素是否為成員，然後再將其新增到結果集中。結果集使用 `Any::equals` 比較元素，即使參數集合使用參考相等性（例如 `IdentityHashMap.keys`），也能確保結果正確。
>
> **棄用週期**:
>
> -   2.3.0: 啟用新行為。

## 工具

### 使用 `kotlin-dsl` 和 `kotlin("jvm")` 外掛程式時出現不支援的 KGP 版本警告

> **問題編號**: [KT-79851](https://youtrack.jetbrains.com/issue/KT-79851)
>
> **元件**: Gradle
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要概述**: 在 Kotlin 2.3 中，如果您的 Gradle 專案同時使用 `kotlin-dsl` **和** `kotlin("jvm")` 外掛程式，您可能會看到關於不支援的 Kotlin Gradle 外掛程式 (KGP) 版本的 Gradle 警告。
>
> **遷移步驟**:
>
> 一般來說，我們不建議在同一個 Gradle 專案中同時使用 `kotlin-dsl` 和 `kotlin("jvm")` 外掛程式。此設定不支援。
>
> 對於慣例外掛程式、預編譯腳本外掛程式或任何其他形式的未發布建構邏輯，您有三個選擇：
>
> 1.  不要顯式應用 `kotlin("jvm")` 外掛程式。改為讓 `kotlin-dsl` 外掛程式自動提供相容的 KGP 版本。
> 2.  如果您想顯式應用 `kotlin("jvm")` 外掛程式，請使用 [`embeddedKotlinVersion`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.kotlin.dsl/embedded-kotlin-version.html) 常數來指定嵌入的 Kotlin 版本。
>
>     要升級嵌入的 Kotlin 和語言版本，請更新您的 Gradle 版本。您可以在 Gradle 的 [Kotlin 相容性說明 (Compatibility Notes for Kotlin)](https://docs.gradle.org/current/userguide/compatibility.html#kotlin) 中找到相容的 Gradle 版本。
>
> 3.  不要使用 `kotlin-dsl` 外掛程式。這可能更適用於不綁定特定 Gradle 版本的二進位外掛程式。
>
> 作為最後的手段，您可以將專案設定為使用 2.1 或更高版本的語言版本，這將覆寫 `kotlin-dsl` 外掛程式的衝突行為。但是，我們強烈建議不要這樣做。
>
> 如果您在遷移過程中遇到困難，請在我們的 [Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中的 #gradle 頻道尋求支援。
>
> **棄用週期**:
>
> -   2.3.0: 引入一種診斷，用於偵測 `kotlin-dsl` 外掛程式與不相容的語言或編譯器 API 版本一起使用時的情況。

### 棄用 AGP 9.0.0 及更高版本的 `kotlin-android` 外掛程式

> **問題編號**: [KT-81199](https://youtrack.jetbrains.com/issue/KT-81199)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 在 Kotlin 2.3.0 中，當使用 Android Gradle 外掛程式 (AGP) 9.0.0 或更高版本時，`org.jetbrains.kotlin.android` 外掛程式已被棄用。從 AGP 9.0.0 開始，[AGP 提供了對 Kotlin 的內建支援](https://kotl.in/gradle/agp-built-in-kotlin)，因此不再需要 `kotlin-android` 外掛程式。
>
> **棄用週期**:
>
> -   2.3.0: 當 `kotlin-android` 外掛程式與 AGP 9.0.0 或更高版本一起使用，並且 `android.builtInKotlin` 和 `android.newDsl=false` 這兩個 Gradle 屬性都設定為 `false` 時，報告警告。

### 棄用 `testApi` 組態

> **問題編號**: [KT-63285](https://youtrack.jetbrains.com/issue/KT-63285)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 棄用了 `testApi` 組態。此組態曾將測試依賴項和原始碼公開給其他模組，但 Gradle 不支援此行為。
>
> **遷移選項**:
> 將所有 `testApi()` 實例替換為 `testImplementation()`，並對其他變體執行相同操作。例如，將 `kotlin.sourceSets.commonTest.dependencies.api()` 替換為 `kotlin.sourceSets.commonTest.dependencies.implementation()`。
>
> 對於 Kotlin/JVM 專案，請考慮改用 Gradle 的 [測試夾具 (test fixtures)](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures)。
> 如果您希望在多平台專案中支援測試夾具，請在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-63142) 中分享您的使用案例。
>
> **棄用週期**:
>
> -   2.3.0: 報告警告。

### 棄用 `createTestExecutionSpec()` 函式

> **問題編號**: [KT-75449](https://youtrack.jetbrains.com/issue/KT-75449)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 棄用了 `KotlinJsTestFramework` 介面中的 `createTestExecutionSpec()` 函式，因為它不再被使用。
>
> **棄用週期**:
>
> -   2.2.20: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 移除 `closureTo()`, `createResultSet()` 和 `KotlinToolingVersionOrNull()` 函式

> **問題編號**: [KT-64273](https://youtrack.com/issue/KT-64273)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 從 `closure` DSL 中移除了 `closureTo()` 和 `createResultSet()` 函式，因為它們不再使用。此外，`KotlinToolingVersionOrNull()` 函式也被移除。請改用 `KotlinToolingVersion()` 函式。
>
> **棄用週期**:
>
> -   1.7.20: 報告錯誤。
> -   2.3.0: 移除函式。

### 棄用 `ExtrasProperty` API

> **問題編號**: [KT-74915](https://youtrack.com/issue/KT-74915)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `ExtrasProperty` API 自 Kotlin 2.0.0 起已被棄用，現在在 Kotlin 2.3.0 中已被內部化。請改用 Gradle 的 [`ExtraPropertiesExtension`](https://docs.gradle.org/current/dsl/org.gradle.api.plugins.ExtraPropertiesExtension.html) API 作為替代方案。
>
> **棄用週期**:
>
> -   2.0.0: 報告警告。
> -   2.1.0: 將警告提升為錯誤。
> -   2.3.0: 使 API 成為內部。

### 棄用 `KotlinCompilation` 中的 `HasKotlinDependencies`

> **問題編號**: [KT-67290](https://youtrack.com/issue/KT-67290)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 棄用了 [`KotlinCompilation`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compilation/) 中的 `HasKotlinDependencies` 介面。依賴項相關的 API 現在透過 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 介面公開。
>
> **棄用週期**:
>
> -   2.3.0: 報告警告。

### 棄用 npm 和 Yarn 套件管理器的內部函式和屬性

> **問題編號**: [KT-81009](https://youtrack.com/issue/KT-81009)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 以下與 npm 和 Yarn 套件管理器相關的函式和屬性已被棄用：
>
> *   `CompositeDependency.dependencyName`, `CompositeDependency.dependencyVersion`, `CompositeDependency.includedBuildDir`.
> *   `KotlinNpmInstallTask.Companion.NAME`.
> *   `LockCopyTask.Companion.STORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.RESTORE_PACKAGE_LOCK_NAME`, `LockCopyTask.Companion.UPGRADE_PACKAGE_LOCK`.
> *   `Npm.npmExec()`.
> *   `NpmProject.require()`, `NpmProject.useTool()`.
> *   `PublicPackageJsonTask.jsIrCompilation`.
> *   `YarnBasics.yarnExec()`.
> *   `YarnPlugin.Companion.STORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.RESTORE_YARN_LOCK_NAME`, `YarnPlugin.Companion.UPGRADE_YARN_LOCK`.
> *   `YarnSetupTask.Companion.NAME`.
>
> **棄用週期**:
>
> -   2.2.0 和 2.2.20: 當使用這些函式或屬性時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用對 PhantomJS 的支援

> **問題編號**: [KT-76019](https://youtrack.com/issue/KT-76019)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 由於 PhantomJS 不再維護，Kotlin 2.3.0 棄用了 `NpmVersions` API 中的 `karmaPhantomjsLauncher` 屬性。
>
> **棄用週期**:
>
> -   2.3.0: 報告警告。

### 禁止對設定測試執行或 JavaScript 執行時的類別進行子類化

> **問題編號**: [KT-75869](https://youtrack.com/issue/KT-75869), [KT-81007](https://youtrack.com/issue/KT-81007)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 2.3.0 禁止對以下類別進行子類化：
> *   `KotlinTest`
> *   `KotlinNativeTest`
> *   `KotlinJsTest`
> *   `KotlinJsIrTarget`
> *   `KotlinNodeJsIr`
> *   `KotlinD8Ir`
> *   `KotlinKarma`
> *   `KotlinMocha`
> *   `KotlinWebpack`
> *   `TypeScriptValidationTask`
> *   `YarnRootExtension`
>
> 這些類別從未打算被子類化。現在，所有子類化的使用案例都應由 Kotlin Gradle 外掛程式 DSL 提供的組態區塊涵蓋。
> 如果這些任務的現有 API 無法滿足您設定測試執行或 JavaScript 執行時的需求，請在 [YouTrack](https://youtrack.com/issue/KT-75869) 中留下您的回饋。
>
> **棄用週期**:
>
> -   2.2.0: 針對從這些類別建立子類別的程式碼報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `ExperimentalWasmDsl` 註解類別

> **問題編號**: [KT-81005](https://youtrack.com/issue/KT-81005)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `ExperimentalWasmDsl` 註解類別已被棄用，因為其功能已移至 `kotlin-plugin-annotations` 模組。
>
> **棄用週期**:
>
> -   2.0.20: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `ExperimentalDceDsl` 註解類別

> **問題編號**: [KT-81008](https://youtrack.com/issue/KT-81008)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `ExperimentalDceDsl` 註解類別不再使用，因此已被棄用。
>
> **棄用週期**:
>
> -   2.2.0: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 JavaScript 工具函式

> **問題編號**: [KT-81010](https://youtrack.com/issue/KT-81010)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 以下函式和屬性僅供內部使用，因此已被棄用：
> *   `JsIrBinary.generateTs`
> *   `KotlinJsIrLink.mode`
> *   `NodeJsSetupTask.Companion.NAME`
> *   `Appendable.appendConfigsFromDir()`
> *   `ByteArray.toHex()`
> *   `FileHasher.calculateDirHash()`
> *   `String.jsQuoted()`
>
> **棄用週期**:
>
> -   2.2.0: 當使用 `KotlinJsIrLink.mode` 屬性時，報告警告。
> -   2.2.0: 當使用 `NodeJsSetupTask.Companion.NAME` 屬性及函式時，報告警告。
> -   2.2.20: 當使用 `JsIrBinary.generateTs` 屬性時，報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用已遷移的 D8 和 Binaryen 屬性

> **問題編號**: [KT-81006](https://youtrack.com/issue/KT-81006)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 以下屬性已被棄用，因為它們已從 `org.jetbrains.kotlin.gradle.targets.js` 套件遷移到 `org.jetbrains.kotlin.gradle.targets.wasm` 套件：
>
> *   `binaryen.BinaryenEnvSpec`
> *   `binaryen.BinaryenExtension`
> *   `binaryen.BinaryenPlugin`
> *   `binaryen.BinaryenRootPlugin`
> *   `BinaryenSetupTask.Companion.NAME`
> *   `d8.D8EnvSpec`
> *   `d8.D8Plugin`
> *   `D8SetupTask.Companion.NAME`
>
> **棄用週期**:
>
> -   2.2.0: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `NodeJsExec` DSL 中的 `create()` 函式

> **問題編號**: [KT-81004](https://youtrack.com/issue/KT-81004)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `NodeJsExec` DSL 的伴隨物件中的 `create()` 函式已被棄用。請改用 `register()` 函式。
>
> **棄用週期**:
>
> -   2.1.20: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

### 棄用 `kotlinOptions` DSL 中的屬性

> **問題編號**: [KT-76720](https://youtrack.com/issue/KT-76720)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 從 Kotlin 2.2.0 起，透過 `kotlinOptions` DSL 和相關的 `KotlinCompile<KotlinOptions>` 任務介面來組態編譯器選項的功能已被棄用，轉而使用新的 `compilerOptions` DSL。Kotlin 2.3.0 繼續了 `kotlinOptions` 介面中所有屬性的棄用週期。
> 要遷移，請使用 `compilerOptions` DSL 來組態編譯器選項。有關遷移指南，請參閱[從 `kotlinOptions {}` 遷移到 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **棄用週期**:
>
> -   2.0.0: 針對 `kotlinOptions` DSL 報告警告。
> -   2.2.0: 將警告提升為錯誤，並棄用 `kotlinOptions` 中所有屬性。
> -   2.3.0: 針對 `kotlinOptions` 中所有屬性將警告提升為錯誤。

### 棄用 `kotlinArtifacts` API

> **問題編號**: [KT-77066](https://youtrack.com/issue/KT-77066)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 實驗性的 `kotlinArtifacts` API 已被棄用。請使用 Kotlin Gradle 外掛程式中可用的當前 DSL 來[建構最終的原生二進位檔](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。
> 如果這不足以進行遷移，請在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-74953)中留下評論。
>
> **棄用週期**:
>
> -   2.2.0: 當使用 `kotlinArtifacts` API 時，報告警告。
> -   2.3.0: 將此警告提升為錯誤。

### 移除 `kotlin.mpp.resourcesResolutionStrategy` Gradle 屬性

> **問題編號**: [KT-74955](https://youtrack.com/issue/KT-74955)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 此前，`kotlin.mpp.resourcesResolutionStrategy` Gradle 屬性因不再使用而被棄用。在 Kotlin 2.3.0 中，此 Gradle 屬性已被完全移除。
>
> **棄用週期**:
>
> -   2.2.0: 報告組態時診斷。
> -   2.3.0: 移除 Gradle 屬性。

### 棄用舊版的多平台 IDE 匯入模式

> **問題編號**: [KT-61127](https://youtrack.com/issue/KT-61127)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 在 Kotlin 2.3.0 之前，我們支援多種多平台 IDE 匯入模式。現在，舊模式已被棄用，只剩下一種模式可用。此前，舊模式是透過使用 `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 屬性啟用的。現在使用此屬性會觸發棄用警告。
>
> **棄用週期**:
>
> -   2.3.0: 當使用 `kotlin.mpp.import.enableKgpDependencyResolution=false` Gradle 屬性時，報告警告。

### 移除停用精確編譯備份的屬性

> **問題編號**: [KT-81038](https://youtrack.com/issue/KT-81038)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: Kotlin 1.9.0 引入了一項用於增量編譯的實驗性最佳化，稱為精確編譯備份。經過成功測試後，此最佳化在 Kotlin 2.0.0 中預設啟用。Kotlin 2.3.0 移除了選擇退出此最佳化的 `kotlin.compiler.preciseCompilationResultsBackup` 和 `kotlin.compiler.keepIncrementalCompilationCachesInMemory` Gradle 屬性。
>
> **棄用週期**:
>
> -   2.1.20: 報告警告。
> -   2.3.0: 移除屬性。

### 棄用 `CInteropProcess` 中的 `destinationDir`

> **問題編號**: [KT-74910](https://youtrack.com/issue/KT-74910)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `CInteropProcess` 任務中的 `destinationDir` 屬性已被棄用。請改用 `CInteropProcess.destinationDirectory.set()` 函式。
>
> **棄用週期**:
>
> -   2.1.0: 當使用 `destinationDir` 屬性時，報告警告。
> -   2.2.0: 將此警告提升為錯誤。
> -   2.3.0: 隱藏 `destinationDir` 屬性。

### 棄用 `CInteropProcess` 中的 `konanVersion`

> **問題編號**: [KT-74911](https://youtrack.com/issue/KT-74911)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `CInteropProcess` 任務中的 `konanVersion` 屬性已被棄用。請改用 `CInteropProcess.kotlinNativeVersion`。
>
> **棄用週期**:
>
> -   2.1.0: 當使用 `konanVersion` 屬性時，報告警告。
> -   2.2.0: 將此警告提升為錯誤。
> -   2.3.0: 隱藏 `konanVersion` 屬性。

### 移除 `KotlinCompile.classpathSnapshotProperties` 屬性

> **問題編號**: [KT-76177](https://youtrack.com/issue/KT-76177)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: `kotlin.incremental.useClasspathSnapshot` Gradle 屬性已在 Kotlin 2.2.0 中移除。在 Kotlin 2.3.0 中，以下屬性也已移除：
> *   `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot`
> *   `KotlinCompile.classpathSnapshotProperties.classpath`
>
> **棄用週期**:
>
> -   2.0.20: 棄用 `kotlin.incremental.useClasspathSnapshot` 屬性並發出警告。
> -   2.2.0: 移除 `kotlin.incremental.useClasspathSnapshot` 屬性。
> -   2.3.0: 移除 `KotlinCompile.classpathSnapshotProperties.useClasspathSnapshot` 和 `KotlinCompile.classpathSnapshotProperties.classpath` 屬性。

### 棄用 `getPluginArtifactForNative()` 函式

> **問題編號**: [KT-78870](https://youtrack.com/issue/KT-78870)
>
> **元件**: Gradle
>
> **不相容變更類型**: 原始碼 (source)
>
> **簡要概述**: 在 Kotlin 2.2.20 中，[`getPluginArtifactForNative()` 函式已被棄用](whatsnew2220.md#reduced-size-of-kotlin-native-distribution)。請改用 [`getPluginArtifact()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-compiler-plugin-support-plugin/get-plugin-artifact.html) 函式。
>
> **棄用週期**:
>
> -   2.2.20: 報告警告。
> -   2.3.0: 將警告提升為錯誤。

## 建構工具移除

### 移除對 Ant 的支援

> **問題編號**: [KT-75875](https://youtrack.com/issue/KT-75875)
>
> **元件**: Ant
>
> **簡要概述**: Kotlin 2.3.0 移除了對 Ant 作為建構工具的支援。請改用 [Gradle](gradle.md) 或 [Maven](maven.md)。
>
> **棄用週期**:
>
> -   2.2.0: 報告警告。
> -   2.3.0: 移除支援。