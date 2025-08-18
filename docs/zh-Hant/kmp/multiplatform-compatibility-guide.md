[//]: # (title: Kotlin Multiplatform 相容性指南)

<show-structure depth="1"/>

本指南總結了您在使用 Kotlin Multiplatform 開發專案時可能會遇到的[不相容變更](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)。

Kotlin 目前的穩定版本是 %kotlinVersion%。請注意特定變更的棄用週期與您專案中 Kotlin 版本的關係，例如：

*   從 Kotlin 1.7.0 升級到 Kotlin 1.9.0 時，請檢查在 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不相容變更。
*   從 Kotlin 1.9.0 升級到 Kotlin 2.0.0 時，請檢查在 [Kotlin 2.0.0 及更高版本](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不相容變更。

## 版本相容性

設定專案時，請檢查特定版本的 Kotlin Multiplatform Gradle 外掛程式（與您專案中的 Kotlin 版本相同）與 Gradle、Xcode 和 Android Gradle 外掛程式版本的相容性：

| Kotlin Multiplatform 外掛程式版本 | Gradle                                | Android Gradle 外掛程式                               | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0-2.2.10                        | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全相容於 Gradle 8.6 及更早版本。
> Gradle 8.7–8.10 版本也受支援，但只有一個例外：如果您在 JVM 目標中使用 `withJava()` 函數呼叫 Kotlin Multiplatform Gradle 外掛程式，您可能會在您的多平台專案中看到棄用警告。
> 更多資訊請參閱 [預設建立的 Java 來源集](#java-source-sets-created-by-default)。
>
{style="warning"}

## Kotlin 2.0.0 及更高版本

本節涵蓋了在 Kotlin 2.0.0−%kotlinVersion% 中結束棄用週期並生效的不相容變更。

### 位元碼嵌入已棄用

**有什麼變更？**

Bitcode embedding 在 Xcode 14 中被棄用，並在 Xcode 15 中針對所有 Apple 目標移除。因此，框架組態的 `embedBitcode` 參數，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列參數在 Kotlin 中已棄用。

**現在的最佳實踐是什麼？**

如果您仍在使用較早版本的 Xcode 但想要升級到 Kotlin 2.0.20 或更高版本，請在您的 Xcode 專案中禁用 bitcode embedding。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   2.0.20: Kotlin/Native 編譯器不再支援位元碼嵌入
*   2.1.0: 在 Kotlin Multiplatform Gradle 外掛程式中，`embedBitcode` DSL 被棄用並發出警告
*   2.2.0: 警告提升為錯誤
*   2.3.0: `embedBitcode` DSL 被移除

### 預設建立的 Java 來源集

**有什麼變更？**

為了使 Kotlin Multiplatform 與 Gradle 即將進行的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。`withJava()` 函數透過建立必要的 Java 來源集來實現與 Gradle Java 外掛程式的整合。從 Kotlin 2.1.20 開始，這些 Java 來源集將預設建立。

**現在的最佳實踐是什麼？**

以前，您必須明確使用 `withJava()` 函數來建立 `src/jvmMain/java` 和 `src/jvmTest/java` 來源集：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
```

從 Kotlin 2.1.20 開始，您可以從建置腳本中移除 `withJava()` 函數。

此外，Gradle 現在只有在存在 Java 來源時才會執行 Java 編譯任務，這會觸發以前未執行的 JVM 驗證診斷。如果您為 `KotlinJvmCompile` 任務或在 `compilerOptions` 內部明確配置了不相容的 JVM 目標，此診斷將會失敗。有關確保 JVM 目標相容性的指南，請參閱 [檢查相關編譯任務的 JVM 目標相容性](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果您的專案使用的 Gradle 版本高於 8.7 且不依賴 Gradle Java 外掛程式，例如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)，或依賴於 Gradle Java 外掛程式的第三方 Gradle 外掛程式，您可以移除 `withJava()` 函數。

如果您的專案使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 外掛程式，我們建議遷移到 [新的實驗性 DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。從 Gradle 8.7 開始，Application 外掛程式將不再與 Kotlin Multiplatform Gradle 外掛程式一起使用。

如果您想在多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和其他 Gradle Java 外掛程式，請參閱 [棄用 Kotlin Multiplatform Gradle 外掛程式與 Gradle Java 外掛程式的相容性](#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果您在 Kotlin 2.1.20 和高於 8.7 的 Gradle 版本中使用 [Java 測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 外掛程式，則該外掛程式將無法運作。此問題已在 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details) 中解決，請升級到該版本。

如果您遇到任何問題，請在我們的 [問題追蹤器](https://kotl.in/issue) 中回報，或在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 尋求協助。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   Gradle >8.6: 在使用 `withJava()` 函數的多平台專案中，針對任何先前版本的 Kotlin 引入棄用警告。
*   Gradle 9.0: 將此警告提升為錯誤。
*   2.1.20: 在任何版本的 Gradle 中使用 `withJava()` 函數時引入棄用警告。

### 將 `android` 目標重新命名為 `androidTarget`

**有什麼變更？**

我們持續努力使 Kotlin Multiplatform 更穩定。朝此方向邁出的重要一步是為 Android 目標提供一流支援。未來，這項支援將透過由 Google 的 Android 團隊開發的獨立外掛程式提供。

為了為新的解決方案鋪平道路，我們在目前的 Kotlin DSL 中將 `android` 區塊重新命名為 `androidTarget`。這是一個臨時變更，是為了釋放 `android` 這個簡短名稱以供 Google 即將推出的 DSL 使用。

**現在的最佳實踐是什麼？**

將所有出現 `android` 區塊的地方重新命名為 `androidTarget`。當 Android 目標支援的新外掛程式可用時，請遷移到 Google 的 DSL。這將是在 Kotlin Multiplatform 專案中使用 Android 的首選選項。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.0: 在 Kotlin Multiplatform 專案中使用 `android` 名稱時引入棄用警告
*   2.1.0: 將此警告提升為錯誤
*   2.2.0: 從 Kotlin Multiplatform Gradle 外掛程式中移除 `android` 目標 DSL

### 宣告多個相似目標

**有什麼變更？**

我們不鼓勵在單一 Gradle 專案中宣告多個相似目標。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 不建議且會產生棄用警告
}
```

一個常見的案例是將兩個相關的程式碼片段放在一起。例如，您可能希望在您的 `:shared` Gradle 專案中使用 `jvm("jvmKtor")` 和 `jvm("jvmOkHttp")` 來實作使用 Ktor 或 OkHttp 程式庫的網路功能：

```kotlin
// shared/build.gradle.kts:
kotlin {
    jvm("jvmKtor") {
        attributes.attribute(/* ... */)
    }
    jvm("jvmOkHttp") {
        attributes.attribute(/* ... */)
    }

    sourceSets {
        val commonMain by getting
        val commonJvmMain by sourceSets.creating {
            dependsOn(commonMain)
            dependencies {
                // 共享依賴項
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor 依賴項
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp 依賴項
            }
        }
    }
}
```

此實作帶來了非平凡的組態複雜性：

*   您必須在 `:shared` 端和每個消費者端設定 Gradle 屬性。否則，Gradle 無法在此類專案中解析依賴項，因為沒有額外資訊，不清楚消費者應該接收基於 Ktor 還是基於 OkHttp 的實作。
*   您必須手動設定 `commonJvmMain` 來源集。
*   組態涉及許多低階 Gradle 和 Kotlin Gradle 外掛程式的抽象概念和 API。

**現在的最佳實踐是什麼？**

組態之所以複雜，是因為基於 Ktor 和基於 OkHttp 的實作位於**同一個 Gradle 專案**中。在許多情況下，可以將這些部分提取到獨立的 Gradle 專案中。以下是此類重構的一般概述：

1.  將原始專案中的兩個重複目標替換為單一目標。如果您在這些目標之間有共享來源集，請將其來源和組態移至新建立目標的預設來源集：

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 在此複製 jvmCommonMain 的組態
            }
        }
    }
    ```

2.  新增兩個新的 Gradle 專案，通常透過在您的 `settings.gradle.kts` 檔案中呼叫 `include`。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  組態每個新的 Gradle 專案：

    *   您很可能不需要套用 `kotlin("multiplatform")` 外掛程式，因為這些專案只編譯到一個目標。在此範例中，您可以套用 `kotlin("jvm")`。
    *   將原始目標特定來源集的內容移至其各自的專案，例如，從 `jvmKtorMain` 移至 `ktor-impl/src`。
    *   複製來源集的組態：依賴項、編譯器選項等等。
    *   從新 Gradle 專案新增對原始專案的依賴項。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 新增對原始專案的依賴項
        // 在此複製 jvmKtorMain 的依賴項
    }
    
    kotlin {
        compilerOptions {
            // 在此複製 jvmKtorMain 的編譯器選項
        }
    }
    ```

儘管這種方法在初始設定上需要更多工作，但它不使用任何 Gradle 和 Kotlin Gradle 外掛程式的低階實體，從而使結果建置更易於使用和維護。

> 遺憾的是，我們無法為每個案例提供詳細的遷移步驟。如果上述說明不適用於您，請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-59316) 中描述您的使用案例。
>
{style="tip"}

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.20: 在 Kotlin Multiplatform 專案中使用多個相似目標時引入棄用警告
*   2.1.0: 在此類情況下報告錯誤，除了 Kotlin/JS 目標；要了解有關此例外的更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的問題

### 棄用對以舊版模式發佈的多平台程式庫的支援

**有什麼變更？**

此前，我們[已棄用多平台專案中的舊版模式](#deprecated-gradle-properties-for-hierarchical-structure-support)，以防止發佈「舊版」二進位檔，並鼓勵您將專案遷移到[分層結構](multiplatform-hierarchy.md)。

為了繼續逐步淘汰生態系統中的「舊版」二進位檔，從 Kotlin 1.9.0 開始，也不鼓勵使用舊版程式庫。如果您的專案使用對舊版程式庫的依賴項，您將會看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**現在的最佳實踐是什麼？**

*如果您使用多平台程式庫*，其中大多數都已遷移到「分層結構」模式，因此您只需要更新程式庫版本。有關詳細資訊，請參閱相應程式庫的文件。

如果該程式庫尚不支援非舊版二進位檔，您可以聯繫維護者並告知他們此相容性問題。

*如果您是程式庫作者*，請將 Kotlin Gradle 外掛程式更新到最新版本，並確保您已修復[已棄用的 Gradle 屬性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 團隊熱衷於幫助生態系統遷移，因此如果您遇到任何問題，請隨時在 [YouTrack 中建立一個問題](https://kotl.in/issue)。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.0: 針對對舊版程式庫的依賴項引入棄用警告
*   2.0.0: 將對舊版程式庫的依賴項警告提升為錯誤
*   >2.0.0: 移除對舊版程式庫的依賴項支援；使用此類依賴項可能導致建置失敗

### 棄用對分層結構支援的 Gradle 屬性

**有什麼變更？**

在其演進過程中，Kotlin 逐漸引入了對多平台專案中[分層結構](multiplatform-hierarchy.md)的支援，這是一種在通用來源集 `commonMain` 和任何特定平台來源集（例如 `jvmMain`）之間擁有中間來源集的能力。

在工具鏈不夠穩定的過渡期間，引入了一些 Gradle 屬性，允許細粒度選擇加入和選擇退出。

自 Kotlin 1.6.20 起，分層專案結構支援已預設啟用。然而，這些屬性在出現阻擋性問題時仍保留用於選擇退出。在處理完所有回饋後，我們現在開始完全淘汰這些屬性。

以下屬性現已棄用：

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**現在的最佳實踐是什麼？**

*   從您的 `gradle.properties` 和 `local.properties` 檔案中移除這些屬性。
*   避免在 Gradle 建置腳本或您的 Gradle 外掛程式中以程式設計方式設定它們。
*   如果棄用屬性是由您的建置中使用的某些第三方 Gradle 外掛程式設定的，請要求外掛程式維護者不要設定這些屬性。

由於 Kotlin 工具鏈的預設行為自 Kotlin 1.6.20 起不包含此類屬性，我們預計不會產生任何嚴重影響。大多數後果將在專案重建後立即顯示。

如果您是程式庫作者，並希望格外安全，請檢查消費者是否可以使用您的程式庫。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.8.20: 在使用已棄用的 Gradle 屬性時報告警告
*   1.9.20: 將此警告提升為錯誤
*   2.0.0: 移除已棄用屬性；Kotlin Gradle 外掛程式將忽略其用法

萬一您在移除這些屬性後遇到問題，請在 [YouTrack 中建立一個問題](https://kotl.in/issue)。

### 棄用目標預設 API

**有什麼變更？**

在非常早期的開發階段，Kotlin Multiplatform 引入了用於處理所謂「目標預設」（target presets）的 API。每個目標預設本質上都代表了 Kotlin Multiplatform 目標的工廠。這個 API 結果證明大部分是多餘的，因為像 `jvm()` 或 `iosSimulatorArm64()` 這樣的 DSL 函數涵蓋了相同的使用案例，同時更直接和簡潔。

為了減少混淆並提供更清晰的指南，所有與預設相關的 API 現已在 Kotlin Gradle 外掛程式的公共 API 中棄用。這包括：

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 屬性
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 介面及其所有繼承者
*   `fromPreset` 多載

**現在的最佳實踐是什麼？**

改用相應的 [Kotlin 目標](multiplatform-dsl-reference.md#targets)，例如：

<table>
    
<tr>
<td>之前</td>
        <td>現在</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        fromPreset(presets.iosArm64, 'ios')&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    iosArm64()&#10;}"/>
</td>
</tr>

</table>

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.20: 報告任何預設相關 API 用法上的警告
*   2.0.0: 將此警告提升為錯誤
*   2.2.0: 從 Kotlin Gradle 外掛程式的公共 API 中移除預設相關 API；仍然使用它的來源將因「未解析的引用」錯誤而失敗，而二進位檔（例如 Gradle 外掛程式）則可能因連結錯誤而失敗，除非針對最新版本的 Kotlin Gradle 外掛程式重新編譯

### 棄用 Apple 目標捷徑

**有什麼變更？**

我們正在棄用 Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目標捷徑。它們旨在部分建立 Apple 目標的來源集階層。然而，它們被證明難以擴展，有時令人困惑。

例如，`ios()` 捷徑同時建立 `iosArm64` 和 `iosX64` 目標，但沒有包含 `iosSimulatorArm64` 目標，而這在具有 Apple M 晶片的主機上工作時是必需的。然而，改變這個捷徑很難實作，並可能在現有的使用者專案中引起問題。

**現在的最佳實踐是什麼？**

Kotlin Gradle 外掛程式現在提供了一個內建的階層範本。自 Kotlin 1.9.20 起，它預設啟用，並包含適用於常見使用案例的預定義中間來源集。

您應該指定目標列表，而不是使用捷徑，然後外掛程式會根據此列表自動設定中間來源集。

例如，如果您的專案中有 `iosArm64` 和 `iosSimulatorArm64` 目標，外掛程式會自動建立 `iosMain` 和 `iosTest` 中間來源集。如果您的專案中有 `iosArm64` 和 `macosArm64` 目標，則會建立 `appleMain` 和 `appleTest` 來源集。

更多資訊請參閱 [分層專案結構](multiplatform-hierarchy.md)

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.20: 在使用 `ios()`、`watchos()` 和 `tvos()` 目標捷徑時報告警告；預設階層範本改為預設啟用
*   2.1.0: 在使用目標捷徑時報告錯誤
*   2.2.0: 從 Kotlin Multiplatform Gradle 外掛程式中移除目標捷徑 DSL

### Kotlin 升級後 iOS 框架版本不正確

**問題是什麼？**

當使用直接整合時，Kotlin 程式碼的變更可能不會反映在 Xcode 中的 iOS 應用程式中。直接整合是透過 `embedAndSignAppleFrameworkForXcode` 任務設定的，該任務將您的多平台專案中的 iOS 框架連接到 Xcode 中的 iOS 應用程式。

當您將多平台專案中的 Kotlin 版本從 1.9.2x 升級到 2.0.0（或從 2.0.0 降級到 1.9.2x），然後在 Kotlin 檔案中進行變更並嘗試建置應用程式時，Xcode 可能會錯誤地使用舊版本的 iOS 框架。因此，變更將不會在 Xcode 的 iOS 應用程式中可見。

**解決方案是什麼？**

1.  在 Xcode 中，使用 **Product** | **Clean Build Folder** 清理建置目錄。
2.  在終端機中，執行以下命令：

    ```none
    ./gradlew clean
    ```

3.  再次建置應用程式以確保使用新版本的 iOS 框架。

**問題何時會修復？**

我們計劃在 Kotlin 2.0.10 中修復此問題。您可以查看 [參與 Kotlin 搶先體驗預覽](https://kotlinlang.org/docs/eap.html) 部分是否有 Kotlin 2.0.10 的任何預覽版本可用。

更多資訊請參閱 [YouTrack 中的對應問題](https://youtrack.jetbrains.com/issue/KT-68257)。

## Kotlin 1.9.0−1.9.25

本節涵蓋了在 Kotlin 1.9.0−1.9.25 中結束棄用週期並生效的不相容變更。

### 棄用直接將 Kotlin 來源集新增到 Kotlin 編譯的 API {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

對 `KotlinCompilation.source` 的訪問已棄用。以下程式碼將產生棄用警告：

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()
    
    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        targets["jvm"].compilations["main"].source(myCustomIntermediateSourceSet)
    }
}
```

**現在的最佳實踐是什麼？**

要替換 `KotlinCompilation.source(someSourceSet)`，請從 `KotlinCompilation` 的預設來源集新增 `dependsOn` 關係到 `someSourceSet`。我們建議使用 `by getting` 直接引用來源，這樣更短且更具可讀性。但是，您也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，這適用於所有情況。

您可以透過以下方式之一變更上述程式碼：

```kotlin
kotlin {
    jvm()
    js()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting
        val myCustomIntermediateSourceSet by creating {
            dependsOn(commonMain)
        }
        
        // 選項 #1。更短且更具可讀性，盡可能使用。 
        // 通常，預設來源集的名稱 
        // 是目標名稱和編譯名稱的簡單串聯：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 選項 #2。通用解決方案，如果您的建置腳本需要更進階的方法，請使用它：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.0: 在使用 `KotlinComplation.source` 時引入棄用警告
*   1.9.20: 將此警告提升為錯誤
*   2.2.0: 從 Kotlin Gradle 外掛程式中移除 `KotlinComplation.source`，嘗試使用它會導致建置腳本編譯期間出現「未解析的引用」錯誤

### 從 `kotlin-js` Gradle 外掛程式遷移到 `kotlin-multiplatform` Gradle 外掛程式 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已棄用。基本上，它重複了 `kotlin-multiplatform` 外掛程式的功能，帶有 `js()` 目標並在底層共用相同的實作。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護負擔。我們鼓勵您改用帶有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

**現在的最佳實踐是什麼？**

1.  從您的專案中移除 `kotlin-js` Gradle 外掛程式，並在 `settings.gradle.kts` 檔案中套用 `kotlin-multiplatform`，如果您使用的是 `pluginManagement {}` 區塊：

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 移除以下行：
            kotlin("js") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // settings.gradle.kts:
    pluginManagement {
        plugins {
            // 改為新增以下行：
            kotlin("multiplatform") version "1.9.0"
        }
        
        repositories {
            // ...
        }
    }
    ```

    </TabItem>
    </Tabs>

    如果您使用不同的方式套用外掛程式，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/plugins.html) 以獲取遷移說明。

2.  將您的來源檔案從 `main` 和 `test` 資料夾移動到同一目錄中的 `jsMain` 和 `jsTest` 資料夾。
3.  調整依賴項宣告：

    *   我們建議使用 `sourceSets {}` 區塊並配置相應來源集的依賴項，`jsMain {}` 用於生產依賴項，`jsTest {}` 用於測試依賴項。有關更多詳細資訊，請參閱 [新增依賴項](multiplatform-add-dependencies.md)。
    *   但是，如果您想在頂層區塊中宣告依賴項，請將宣告從 `api("group:artifact:1.0")` 變更為 `add("jsMainApi", "group:artifact:1.0")` 等等。

      > 在這種情況下，請確保頂層的 `dependencies {}` 區塊位於 `kotlin {}` 區塊**之後**。否則，您將收到「Configuration not found」錯誤。
      >
      {style="note"}

    您可以透過以下方式之一變更 `build.gradle.kts` 檔案中的程式碼：

    <Tabs>
    <TabItem title="kotlin-js">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("js") version "1.9.0"
    }
    
    dependencies {
        testImplementation(kotlin("test"))
        implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
    }
    
    kotlin {
        js {
            // ...
        }
    }
    ```

    </TabItem>
    <TabItem title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 選項 #1。在 sourceSets {} 區塊中宣告依賴項：
        sourceSets {
            val jsMain by getting {
                dependencies {
                    // 此處不需要 js 前綴，您可以直接從頂層區塊複製貼上
                    implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
                }
           }
        }
    }
    
    dependencies {
        // 選項 #2。在依賴項宣告中新增 js 前綴：
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </TabItem>
    </Tabs>

4.  Kotlin Gradle 外掛程式在 `kotlin {}` 區塊中提供的 DSL 在大多數情況下保持不變。但是，如果您按名稱引用低階 Gradle 實體，例如任務和配置，您現在需要調整它們，通常是透過新增 `js` 前綴。例如，您可以在 `jsBrowserTest` 名稱下找到 `browserTest` 任務。

**這些變更何時生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 外掛程式會產生棄用警告。

### 棄用 `jvmWithJava` 預設 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

`targetPresets.jvmWithJava` 已棄用，不鼓勵使用。

**現在的最佳實踐是什麼？**

改用 `jvm { withJava() }` 目標。請注意，切換到 `jvm { withJava() }` 後，您需要調整帶有 `.java` 來源的來源目錄路徑。

例如，如果您使用名稱為「jvm」的 `jvm` 目標：

| 之前          | 現在                |
|---------------|---------------------|
| `src/main/java` | `src/jvmMain/java`  |
| `src/test/java` | `src/jvmTest/java`  |

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.3.40: 在使用 `targetPresets.jvmWithJava` 時引入警告
*   1.9.20: 將此警告提升為錯誤
*   >1.9.20: 移除 `targetPresets.jvmWithJava` API；嘗試使用它會導致建置腳本編譯失敗

> 儘管整個 `targetPresets` API 已棄用，但 `jvmWithJava` 預設有不同的棄用時間表。
>
{style="note"}

### 棄用舊版 Android 來源集佈局 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

[新的 Android 來源集佈局](multiplatform-android-layout.md) 自 Kotlin 1.9.0 起預設啟用。對舊版佈局的支援已棄用，使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 屬性現在會觸發棄用診斷。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   <=1.9.0: 在使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 時報告警告；警告可以透過 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 屬性抑制
*   1.9.20: 將此警告提升為錯誤；此錯誤**無法**抑制
*   >1.9.20: 移除對 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支援；Kotlin Gradle 外掛程式將忽略該屬性

### 棄用帶有自定義 `dependsOn` 的 `commonMain` 和 `commonTest` {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

`commonMain` 和 `commonTest` 來源集通常分別代表 `main` 和 `test` 來源集階層的根。但是，可以透過手動配置這些來源集的 `dependsOn` 關係來覆蓋此行為。

維護此類配置需要額外的努力和有關多平台建置內部的知識。此外，它會降低程式碼的可讀性和可重用性，因為您需要閱讀特定的建置腳本才能確定 `commonMain` 是否為 `main` 來源集階層的根。

因此，訪問 `commonMain` 和 `commonTest` 上的 `dependsOn` 現已棄用。

**現在的最佳實踐是什麼？**

假設您需要將使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` 來源集遷移到 1.9.20。在大多數情況下，`customCommonMain` 參與與 `commonMain` 相同的編譯，因此您可以將 `customCommonMain` 合併到 `commonMain` 中：

1.  將 `customCommonMain` 的來源複製到 `commonMain` 中。
2.  將 `customCommonMain` 的所有依賴項新增到 `commonMain` 中。
3.  將 `customCommonMain` 的所有編譯器選項設定新增到 `commonMain` 中。

在極少數情況下，`customCommonMain` 可能會參與比 `commonMain` 更多的編譯。此類配置需要建置腳本的額外低階組態。如果您不確定這是否是您的使用案例，那麼它很可能不是。

如果是您的使用案例，請透過將 `customCommonMain` 的來源和設定移動到 `commonMain`，反之亦然，來「交換」這兩個來源集。

**這些變更何時生效？**

以下是計劃的棄用週期：

*   1.9.0: 在 `commonMain` 中使用 `dependsOn` 時報告警告
*   >=1.9.20: 在 `commonMain` 或 `commonTest` 中使用 `dependsOn` 時報告錯誤

### 轉發宣告的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

JetBrains 團隊改進了 Kotlin 中轉發宣告的方法，使其行為更可預測：

*   您只能使用 `cnames` 或 `objcnames` 套件匯入轉發宣告。
*   您需要明確地對應的 C 和 Objective-C 轉發宣告進行轉換（`cast`）。

**現在的最佳實踐是什麼？**

*   考慮一個帶有 `library.package` 並宣告 `cstructName` 轉發宣告的 C 程式庫。以前，可以直接從程式庫匯入：`import library.package.cstructName`。現在，您只能為此使用一個特殊的轉發宣告套件：`import cnames.structs.cstructName`。對於 `objcnames` 也是如此。

*   考慮兩個 `objcinterop` 程式庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一個具有實際定義：

    ```ObjC
    // 第一個 objcinterop 程式庫
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // 第二個 objcinterop 程式庫
    // 標頭：
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // 實作：
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前，可以在它們之間無縫傳輸物件。現在，對於轉發宣告，需要明確的 `as` 轉換：

    ```kotlin
    // Kotlin 程式碼：
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > 您只能將 `objcnames.protocols.ForwardDeclaredProtocolProtocol` 轉換為對應的真實類別。否則，您將收到錯誤。
    >
    {style="note"}

**這些變更何時生效？**

從 Kotlin 1.9.20 開始，您需要明確地對應的 C 和 Objective-C 轉發宣告進行轉換。此外，現在只能透過使用特殊套件來匯入轉發宣告。

## Kotlin 1.7.0−1.8.22

本節涵蓋了在 Kotlin 1.7.0−1.8.22 中結束棄用週期並生效的不相容變更。

### 棄用 Kotlin Multiplatform Gradle 外掛程式與 Gradle Java 外掛程式的相容性 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

由於 Kotlin Multiplatform Gradle 外掛程式與 Gradle 外掛程式 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 之間存在相容性問題，現在當您將這些外掛程式套用至同一個專案時，會出現棄用警告。當您的多平台專案中的另一個 Gradle 外掛程式套用 Gradle Java 外掛程式時，也會出現此警告。例如，[Spring Boot Gradle 外掛程式](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 會自動套用 Application 外掛程式。

我們新增此棄用警告是為了應對 Kotlin Multiplatform 的專案模型與 Gradle 的 Java 生態系統外掛程式之間存在的根本相容性問題。Gradle 的 Java 生態系統外掛程式目前沒有考量到其他外掛程式可能：

*   也以與 Java 生態系統外掛程式不同的方式發佈或編譯 JVM 目標。
*   在同一個專案中有兩個不同的 JVM 目標，例如 JVM 和 Android。
*   具有複雜的多平台專案結構，可能有多個非 JVM 目標。

遺憾的是，Gradle 目前沒有提供任何 API 來解決這些問題。

我們以前在 Kotlin Multiplatform 中使用了一些變通方法來幫助整合 Java 生態系統外掛程式。然而，這些變通方法從未真正解決相容性問題，而且自 Gradle 8.8 發佈以來，這些變通方法已不再可能。更多資訊請參閱我們的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

雖然我們尚不清楚如何確切解決此相容性問題，但我們仍致力於繼續支援您的 Kotlin Multiplatform 專案中某些形式的 Java 來源編譯。至少，我們將支援 Java 來源的編譯以及在您的多平台專案中使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 外掛程式。

**現在的最佳實踐是什麼？**

如果您的多平台專案中出現此棄用警告，我們建議您：
1.  判斷您是否實際需要在專案中使用 Gradle Java 外掛程式。如果不需要，請考慮移除它。
2.  檢查 Gradle Java 外掛程式是否僅用於單個任務。如果是這樣，您可能可以在不費太多力氣的情況下移除該外掛程式。例如，如果任務使用 Gradle Java 外掛程式來建立 Javadoc JAR 檔案，您可以手動定義 Javadoc 任務。

否則，如果您想在您的多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和這些 Gradle Java 外掛程式，我們建議您：

1.  在您的 Gradle 專案中建立一個獨立的子專案。
2.  在獨立的子專案中，套用 Gradle Java 外掛程式。
3.  在獨立的子專案中，新增對父多平台專案的依賴項。

> 獨立子專案**不得**是多平台專案，且您只能使用它來設定對多平台專案的依賴項。
>
{style="warning"}

例如，您有一個名為 `my-main-project` 的多平台專案，並且您想使用 [Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) Gradle 外掛程式。

一旦您建立了一個子專案，我們稱之為 `subproject-A`，您的父專案結構應如下所示：

```text
.
├── build.gradle
├── settings.gradle.kts
├── subproject-A
    └── build.gradle.kts
    └── src
        └── Main.java
```

在您的子專案的 `build.gradle.kts` 檔案中，在 `plugins {}` 區塊中套用 Java Library 外掛程式：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</TabItem>
</Tabs>

在您的子專案的 `build.gradle.kts` 檔案中，新增對父多平台專案的依賴項：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 您的父多平台專案的名稱
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 您的父多平台專案的名稱
}
```

</TabItem>
</Tabs>

您的父專案現在已設定為可與兩個外掛程式一起使用。

### 自動生成目標的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

由 Gradle 自動生成的目標存取器在 `kotlin.targets {}` 區塊內部不再可用。請改用 `findByName("targetName")` 方法。

請注意，此類存取器在 `kotlin.targets {}` 情況下仍然可用，例如 `kotlin.targets.linuxX64`。

**現在的最佳實踐是什麼？**

<table>
    
<tr>
<td>之前</td>
        <td>現在</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure(['windows',&#10;            'linux']) {&#10;        }&#10;    }&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="kotlin {&#10;    targets {&#10;        configure([findByName('windows'),&#10;            findByName('linux')]) {&#10;        }&#10;    }&#10;}"/>
</td>
</tr>

</table>

**這些變更何時生效？**

在 Kotlin 1.7.20 中，當在 `kotlin.targets {}` 區塊中使用目標存取器時，會引入錯誤。

更多資訊請參閱 [YouTrack 中的對應問題](https://youtrack.jetbrains.com/issue/KT-47047)。

### Gradle 輸入和輸出編譯任務的變更 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

Kotlin 編譯任務不再繼承具有 `sourceCompatibility` 和 `targetCompatibility` 輸入的 Gradle `AbstractCompile` 任務，使其在 Kotlin 使用者腳本中不可用。

編譯任務中的其他破壞性變更：

**現在的最佳實踐是什麼？**

| 之前                                                              | 現在                                                                                                            |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 輸入不再可用。        | 改用 `sources` 輸入。此外，`setSource()` 方法仍然可用。                          |
| `sourceFilesExtensions` 輸入已移除。                      | 編譯任務仍實作 `PatternFilterable` 介面。使用其方法篩選 Kotlin 來源。 |
| `Gradle destinationDir: File` 輸出已棄用。            | 改用 `destinationDirectory: DirectoryProperty` 輸出。                                              |
| `KotlinCompile` 任務的 `classpath` 屬性已棄用。 | 所有編譯任務現在都使用 `libraries` 輸入來取得編譯所需的程式庫列表。              |

**這些變更何時生效？**

在 Kotlin 1.7.20 中，輸入不可用，輸出被替換，並且 `classpath` 屬性已棄用。

更多資訊請參閱 [YouTrack 中的對應問題](https://youtrack.jetbrains.com/issue/KT-32805)。

### 編譯依賴項的新配置名稱 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

Kotlin Multiplatform Gradle 外掛程式建立的編譯配置獲得了新名稱。

Kotlin Multiplatform 專案中的目標有兩個預設編譯：`main` 和 `test`。這些編譯中的每一個都有自己的預設來源集，例如 `jvmMain` 和 `jvmTest`。以前，測試編譯及其預設來源集的配置名稱相同，這可能導致名稱衝突，進而導致當標記有平台特定屬性的配置包含在另一個配置中時出現問題。

現在，編譯配置帶有額外的 `Compilation` 後綴，而使用舊硬編碼配置名稱的專案和外掛程式將不再編譯。

對應來源集依賴項的配置名稱保持不變。

**現在的最佳實踐是什麼？**

<table>
    
<tr>
<td></td>
        <td>之前</td>
        <td>現在</td>
</tr>

    
<tr>
<td rowspan="2"><code>jvmMain</code> 編譯的依賴項</td>
<td>
<code-block lang="kotlin" code="jvm&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
<td>
<code-block lang="kotlin" code="dependencies {&#10;    add(&quot;jvmCompilationImplementation&quot;,&#10;        &quot;foo.bar.baz:1.2.3&quot;)&#10;}"/>
</td>
</tr>

    
<tr>
<td><code>jvmMain</code> 來源集的依賴項</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmMain&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 編譯的依賴項</td>
<td>
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
<td>
<code-block lang="kotlin" code="jvmTestCompilation&lt;Scope&gt;"/>
</td>
</tr>

    
<tr>
<td><code>jvmTest</code> 來源集的依賴項</td>
<td colspan="2">
<code-block lang="kotlin" code="jvmTest&lt;Scope&gt;"/>
</td>
</tr>

</table>

可用範圍為 `Api`、`Implementation`、`CompileOnly` 和 `RuntimeOnly`。

**這些變更何時生效？**

在 Kotlin 1.8.0 中，當在硬編碼字串中使用舊配置名稱時，會引入錯誤。

更多資訊請參閱 [YouTrack 中的對應問題](https://youtrack.jetbrains.com/issue/KT-35916/)。