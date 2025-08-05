[//]: # (title: Kotlin Multiplatform 相容性指南)

<show-structure depth="1"/>

本指南總結了您在使用 Kotlin Multiplatform 開發專案時可能會遇到的 [不相容變更](https://kotlinlang.org/docs/kotlin-evolution-principles.html#incompatible-changes)。

Kotlin 目前的穩定版本是 %kotlinVersion%。請注意特定變更的棄用週期與您專案中 Kotlin 版本的關係，例如：

*   從 Kotlin 1.7.0 升級到 Kotlin 1.9.0 時，請檢查在 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不相容變更。
*   從 Kotlin 1.9.0 升級到 Kotlin 2.0.0 時，請檢查在 [Kotlin 2.0.0 及更高版本](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不相容變更。 

## 版本相容性

設定您的專案時，請檢查特定版本的 Kotlin Multiplatform Gradle 外掛程式（與您專案中的 Kotlin 版本相同）與 Gradle、Xcode 和 Android Gradle 外掛程式版本的相容性：

| Kotlin Multiplatform 外掛程式版本 | Gradle                                | Android Gradle 外掛程式                             | Xcode   |
|-------------------------------------|---------------------------------------|-----------------------------------------------------|---------|
| 2.2.0                               | %minGradleVersion%–%maxGradleVersion% | %minAndroidGradleVersion%–%maxAndroidGradleVersion% | %xcode% |
| 2.1.21                              | 7.6.3–8.12.1                          | 7.3.1–8.7.2                                         | 16.3    |
| 2.1.20                              | 7.6.3–8.11                            | 7.4.2–8.7.2                                         | 16.0    |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                                         | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                                           | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                                           | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                                           | 15.0    |

> *Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 與 Gradle 8.6 及更早版本完全相容。
> Gradle 8.7–8.10 版本也支援，但有一個例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，在多平台專案的 JVM 目標中呼叫 `withJava()` 函式時，您可能會看到棄用警告。
> 更多資訊請參閱 [預設建立的 Java 原始碼集](#java-source-sets-created-by-default)。
>
{style="warning"}

## Kotlin 2.0.0 及更高版本

本節涵蓋在 Kotlin 2.0.0−%kotlinVersion% 中結束棄用週期並生效的不相容變更。

### 棄用位元碼嵌入

**有什麼變更？**

在 Xcode 14 中，位元碼嵌入已棄用，並在 Xcode 15 中針對所有 Apple 目標移除。相應地，框架配置的 `embedBitcode` 參數，以及 `-Xembed-bitcode` 和 `-Xembed-bitcode-marker` 命令列引數在 Kotlin 中也已棄用。

**現在的最佳實踐是什麼？**

如果您仍然使用較早版本的 Xcode，但希望升級到 Kotlin 2.0.20 或更高版本，請在您的 Xcode 專案中停用位元碼嵌入。

**變更何時生效？**

以下是規劃的棄用週期：

*   2.0.20: Kotlin/Native 編譯器不再支援位元碼嵌入
*   2.1.0: `embedBitcode` DSL 在 Kotlin Multiplatform Gradle 外掛程式中已棄用並發出警告
*   2.2.0: 警告升級為錯誤
*   2.3.0: `embedBitcode` DSL 被移除 

<anchor name="java-source-set-created-by-default"/>
### 預設建立的 Java 原始碼集

**有什麼變更？**

為了使 Kotlin Multiplatform 與 Gradle 即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函式。`withJava()` 函式透過建立必要的 Java 原始碼集來實現與 Gradle Java 外掛程式的整合。從 Kotlin 2.1.20 開始，這些 Java 原始碼集預設建立。

**現在的最佳實踐是什麼？**

以前，您必須明確使用 `withJava()` 函式來建立 `src/jvmMain/java` 和 `src/jvmTest/java` 原始碼集：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

從 Kotlin 2.1.20 開始，您可以從建置腳本中移除 `withJava()` 函式。

此外，Gradle 現在只有在 Java 原始碼存在時才執行 Java 編譯任務，這會觸發以前沒有執行的 JVM 驗證診斷。如果您明確為 `KotlinJvmCompile` 任務或 `compilerOptions` 內部配置了不相容的 JVM 目標，此診斷將會失敗。有關確保 JVM 目標相容性的指導，請參閱 [檢查相關編譯任務的 JVM 目標相容性](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果您的專案使用高於 8.7 的 Gradle 版本，且不依賴 Gradle Java 外掛程式（例如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)），或依賴於 Gradle Java 外掛程式的第三方 Gradle 外掛程式，您可以移除 `withJava()` 函式。

如果您的專案使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 外掛程式，我們建議遷移到 [新的實驗性 DSL](https://kotlinlang.org/docs/whatsnew2120.html#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。從 Gradle 8.7 開始，Application 外掛程式將不再與 Kotlin Multiplatform Gradle 外掛程式配合使用。

如果您想在多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和其他 Gradle Java 外掛程式，請參閱 [Kotlin Multiplatform Gradle 外掛程式與 Java 外掛程式的棄用相容性](multiplatform-compatibility-guide.md#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果您在 Kotlin 2.1.20 和高於 8.7 的 Gradle 版本中使用 [Java 測試夾具](https://docs.gradle.org/current/userguide/java_testing.html#sec:java_test_fixtures) Gradle 外掛程式，則該外掛程式將無法運作。相反，請升級到 [Kotlin 2.1.21](https://kotlinlang.org/docs/releases.html#release-details)，該問題已在此版本中解決。

如果您遇到任何問題，請在我們的 [問題追蹤器](https://kotl.in/issue) 中回報，或在我們的 [公開 Slack 頻道](https://kotlinlang.slack.com/archives/C19FD9681) 尋求協助。

**變更何時生效？**

以下是規劃的棄用週期：

*   Gradle >8.6：對於使用 `withJava()` 函式的多平台專案中任何以前版本的 Kotlin，引入棄用警告。
*   Gradle 9.0：將此警告提升為錯誤。
*   2.1.20：在使用任何版本的 Gradle 的情況下，使用 `withJava()` 函式時引入棄用警告。

<anchor name="android-target-rename"/>
### 將 `android` 目標重新命名為 `androidTarget`

**有什麼變更？**

我們持續努力使 Kotlin Multiplatform 更穩定。朝這個方向邁出的重要一步是為 Android 目標提供一流的支援。未來，這項支援將透過由 Google Android 團隊開發的獨立外掛程式提供。

為了開拓新解決方案的道路，我們正在將目前的 Kotlin DSL 中的 `android` 區塊重新命名為 `androidTarget`。這是一個臨時變更，目的是為了將簡短的 `android` 名稱釋放給 Google 即將推出的 DSL 使用。

**現在的最佳實踐是什麼？**

將所有 `android` 區塊的出現處重新命名為 `androidTarget`。當新的 Android 目標支援外掛程式可用時，請遷移到 Google 提供的 DSL。這將是 Kotlin Multiplatform 專案中處理 Android 的首選選項。

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.0：在 Kotlin Multiplatform 專案中使用 `android` 名稱時引入棄用警告
*   2.1.0：將此警告提升為錯誤
*   2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除 `android` 目標 DSL

<anchor name="declaring-multiple-targets"/>
### 宣告多個相似目標

**有什麼變更？**

我們不建議在單一 Gradle 專案中宣告多個相似目標。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 不建議使用，並會產生棄用警告
}
```

一個常見的案例是將兩個相關的程式碼放在一起。例如，您可能希望在您的 `:shared` Gradle 專案中使用 `jvm("jvmKtor")` 和 `jvm("jvmOkHttp")` 來使用 Ktor 或 OkHttp 函式庫實現網路功能：

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
                // 共享依賴
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor 依賴
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp 依賴
            }
        }
    }
}
```

這種實現帶來了不小的配置複雜度：

*   您必須在 `:shared` 端和每個消費者的端設定 Gradle 屬性。否則，Gradle 無法在此類專案中解析依賴關係，因為沒有額外資訊，不清楚消費者應該接收基於 Ktor 還是基於 OkHttp 的實現。
*   您必須手動設定 `commonJvmMain` 原始碼集。
*   該配置涉及大量的低層次 Gradle 和 Kotlin Gradle 外掛程式抽象和 API。

**現在的最佳實踐是什麼？**

配置之所以複雜，是因為基於 Ktor 和基於 OkHttp 的實現位於**同一個 Gradle 專案**中。在許多情況下，可以將這些部分提取到單獨的 Gradle 專案中。以下是此類重構的概括：

1.  將原始專案中的兩個重複目標替換為單一目標。如果您在這些目標之間有一個共享原始碼集，請將其原始碼和配置移動到新建立目標的預設原始碼集：

    ```kotlin
    // shared/build.gradle.kts:
    kotlin {
        jvm()
        
        sourceSets {
            jvmMain {
                // 在此處複製 jvmCommonMain 的配置
            }
        }
    }
    ```

2.  新增兩個新的 Gradle 專案，通常是透過在 `settings.gradle.kts` 檔案中呼叫 `include`。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3.  配置每個新的 Gradle 專案：

    *   最有可能的是，您不需要應用 `kotlin("multiplatform")` 外掛程式，因為這些專案只編譯到一個目標。在這個例子中，您可以應用 `kotlin("jvm")`。
    *   將原始目標特定原始碼集的內容移動到其各自的專案中，例如，從 `jvmKtorMain` 移動到 `ktor-impl/src`。
    *   複製原始碼集的配置：依賴關係、編譯器選項等。
    *   從新的 Gradle 專案新增對原始專案的依賴。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 新增對原始專案的依賴
        // 在此處複製 jvmKtorMain 的依賴
    }
    
    kotlin {
        compilerOptions {
            // 在此處複製 jvmKtorMain 的編譯器選項
        }
    }
    ```

雖然這種方法在初始設定上需要更多工作，但它不使用 Gradle 和 Kotlin Gradle 外掛程式的任何低層實體，使得結果建置更容易使用和維護。

> 遺憾的是，我們無法為每個案例提供詳細的遷移步驟。如果上述說明對您無效，請在此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-59316) 中描述您的用例。
>
{style="tip"}

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.20：在 Kotlin Multiplatform 專案中使用多個相似目標時引入棄用警告
*   2.1.0：在此類情況下報告錯誤，但 Kotlin/JS 目標除外；要了解此例外的更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的問題

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 棄用舊模式發布的多平台函式庫支援

**有什麼變更？**

以前，我們 [已棄用 Kotlin Multiplatform 專案中的舊模式](#deprecated-gradle-properties-for-hierarchical-structure-support)，阻止發布「舊式」二進位檔，並鼓勵您將專案遷移到 [階層式結構](multiplatform-hierarchy.md)。

為了繼續逐步淘汰生態系統中的「舊式」二進位檔，從 Kotlin 1.9.0 開始，也不鼓勵使用舊式函式庫。如果您的專案使用舊式函式庫的依賴關係，您將看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**現在的最佳實踐是什麼？**

_如果您使用多平台函式庫_，它們中的大多數已經遷移到「階層式結構」模式，因此您只需要更新函式庫版本。有關詳細資訊，請參閱各函式庫的文件。

如果該函式庫尚未支援非舊式二進位檔，您可以聯繫維護者並告知他們這個相容性問題。

_如果您是函式庫作者_，請將 Kotlin Gradle 外掛程式更新到最新版本，並確保您已修正 [棄用的 Gradle 屬性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 團隊渴望協助生態系統遷移，因此如果您遇到任何問題，請隨時在 [YouTrack 中建立問題](https://kotl.in/issue)。

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.0：對舊式函式庫的依賴關係引入棄用警告
*   2.0.0：將舊式函式庫依賴關係的警告升級為錯誤
*   >2.0.0：移除對舊式函式庫依賴關係的支援；使用此類依賴關係可能會導致建置失敗

<anchor name="deprecate-hmpp-properties"/>
### 棄用階層式結構支援的 Gradle 屬性

**有什麼變更？**

在其演進過程中，Kotlin 逐步引入了對多平台專案中 [階層式結構](multiplatform-hierarchy.md) 的支援，即在通用原始碼集 `commonMain` 和任何特定平台原始碼集（例如 `jvmMain`）之間擁有中間原始碼集的能力。

在過渡期間，當工具鏈不夠穩定時，引入了一些 Gradle 屬性，允許細粒度的選擇啟用和選擇停用。

自 Kotlin 1.6.20 起，階層式專案結構支援已預設啟用。然而，這些屬性被保留下來以備在遇到阻塞性問題時選擇停用。在處理所有回饋後，我們現在開始完全淘汰這些屬性。

以下屬性現在已棄用：

*   `kotlin.internal.mpp.hierarchicalStructureByDefault`
*   `kotlin.mpp.enableCompatibilityMetadataVariant`
*   `kotlin.mpp.hierarchicalStructureSupport`
*   `kotlin.mpp.enableGranularSourceSetsMetadata`
*   `kotlin.native.enableDependencyPropagation`

**現在的最佳實踐是什麼？**

*   從您的 `gradle.properties` 和 `local.properties` 檔案中移除這些屬性。
*   避免在 Gradle 建置腳本或您的 Gradle 外掛程式中以程式設計方式設定它們。
*   如果您建置中使用的某些第三方 Gradle 外掛程式設定了棄用屬性，請要求外掛程式維護者不要設定這些屬性。

由於 Kotlin 工具鏈的預設行為自 Kotlin 1.6.20 起不包含此類屬性，我們預計不會有任何嚴重影響。大多數後果將在專案重新建置後立即顯現。

如果您是函式庫作者並希望格外安全，請檢查消費者是否可以使用您的函式庫。

如果您在移除這些屬性後不幸遇到問題，請在 [YouTrack 中建立問題](https://kotl.in/issue)。

**變更何時生效？**

以下是規劃的棄用週期：

*   1.8.20：當使用棄用 Gradle 屬性時報告警告
*   1.9.20：將此警告提升為錯誤
*   2.0.0：移除棄用屬性；Kotlin Gradle 外掛程式將忽略其使用

<anchor name="target-presets-deprecation"/>
### 棄用目標預設 API

**有什麼變更？**

在非常早期的開發階段，Kotlin Multiplatform 引入了一個用於處理所謂「_目標預設_」的 API。每個目標預設本質上代表了 Kotlin Multiplatform 目標的工廠。事實證明，這個 API 大多是多餘的，因為像 `jvm()` 或 `iosSimulatorArm64()` 這樣的 DSL 函式以更直接簡潔的方式涵蓋了相同的用例。

為了減少混淆並提供更清晰的指導方針，所有與預設相關的 API 在 Kotlin Gradle 外掛程式的公開 API 中都已棄用。這包括：

*   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 屬性
*   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 介面及其所有繼承者
*   `fromPreset` 多載

**現在的最佳實踐是什麼？**

請改用相應的 [Kotlin 目標](multiplatform-dsl-reference.md#targets)，例如：

<table>
    <tr>
        <td>之前</td>
        <td>現在</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        fromPreset(presets.iosArm64, 'ios')
    }
}
```

</td>
<td>

```kotlin
kotlin {
    iosArm64()
}
```

</td>
</tr>
</table>

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.20：報告任何使用預設相關 API 的警告
*   2.0.0：將此警告提升為錯誤
*   2.2.0：從 Kotlin Gradle 外掛程式的公開 API 中移除與預設相關的 API；仍使用它的原始碼將因「未解析的參考」錯誤而失敗，二進位檔（例如 Gradle 外掛程式）則可能因為未針對最新版本的 Kotlin Gradle 外掛程式重新編譯而導致連結錯誤

<anchor name="target-shortcuts-deprecation"/>
### 棄用 Apple 目標捷徑

**有什麼變更？**

我們正在棄用 Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目標捷徑。它們旨在部分為 Apple 目標建立原始碼集階層。然而，事實證明它們難以擴展，有時會造成混淆。

例如，`ios()` 捷徑同時建立了 `iosArm64` 和 `iosX64` 目標，但沒有包含 `iosSimulatorArm64` 目標，這在 Apple M 晶片主機上工作時是必要的。然而，更改這個捷徑很難實現，並且可能在現有的使用者專案中引起問題。

**現在的最佳實踐是什麼？**

Kotlin Gradle 外掛程式現在提供了一個內建的階層模板。從 Kotlin 1.9.20 開始，它預設啟用，並包含針對常見用例預定義的中間原始碼集。

您應該指定目標清單，而不是使用捷徑，然後外掛程式會根據此清單自動設定中間原始碼集。

例如，如果您的專案中有 `iosArm64` 和 `iosSimulatorArm64` 目標，外掛程式會自動建立 `iosMain` 和 `iosTest` 中間原始碼集。如果您有 `iosArm64` 和 `macosArm64` 目標，則會建立 `appleMain` 和 `appleTest` 原始碼集。

更多資訊請參閱 [階層式專案結構](multiplatform-hierarchy.md)

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.20：當使用 `ios()`、`watchos()` 和 `tvos()` 目標捷徑時報告警告；預設啟用內建的階層模板
*   2.1.0：使用目標捷徑時報告錯誤
*   2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除目標捷徑 DSL

### Kotlin 升級後 iOS 框架版本不正確

**問題是什麼？**

當使用直接整合時，Kotlin 程式碼的變更可能不會反映在 Xcode 中的 iOS 應用程式中。直接整合是透過 `embedAndSignAppleFrameworkForXcode` 任務設定的，該任務將多平台專案中的 iOS 框架連接到 Xcode 中的 iOS 應用程式。

當您在多平台專案中將 Kotlin 版本從 1.9.2x 升級到 2.0.0（或從 2.0.0 降級到 1.9.2x），然後在 Kotlin 檔案中進行變更並嘗試建置應用程式時，Xcode 可能會錯誤地使用舊版本的 iOS 框架。因此，這些變更在 Xcode 中的 iOS 應用程式中將不可見。

**解決方法是什麼？**

1.  在 Xcode 中，使用 **Product** | **Clean Build Folder** 清理建置目錄。
2.  在終端機中，執行以下命令：

    ```none
    ./gradlew clean
    ```

3.  再次建置應用程式，以確保使用新版本的 iOS 框架。

**問題何時會修復？**

我們計劃在 Kotlin 2.0.10 中修復此問題。您可以在 [參與 Kotlin 搶先體驗預覽](https://kotlinlang.org/docs/eap.html) 部分中檢查是否有 Kotlin 2.0.10 的任何預覽版本可用。

更多資訊請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-68257)。

## Kotlin 1.9.0−1.9.25

本節涵蓋在 Kotlin 1.9.0−1.9.25 中結束棄用週期並生效的不相容變更。

<anchor name="compilation-source-deprecation"/>
### 直接將 Kotlin 原始碼集新增到 Kotlin 編譯的棄用 API {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

對 `KotlinCompilation.source` 的存取已棄用。類似這樣的程式碼會產生棄用警告：

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

要替換 `KotlinCompilation.source(someSourceSet)`，請從 `KotlinCompilation` 的預設原始碼集添加 `dependsOn` 關係到 `someSourceSet`。我們建議直接使用 `by getting` 引用原始碼，這樣更短且更具可讀性。然而，您也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，這適用於所有情況。

您可以透過以下其中一種方式更改上述程式碼：

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
        
        // 選項 #1. 更短且更具可讀性，盡可能使用。 
        // 通常，預設原始碼集的名稱 
        // 是目標名稱和編譯名稱的簡單連結：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 選項 #2. 通用解決方案，如果您的建置腳本需要更進階的方法，請使用它：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.0：當使用 `KotlinComplation.source` 時引入棄用警告
*   1.9.20：將此警告提升為錯誤
*   2.2.0：從 Kotlin Gradle 外掛程式中移除 `KotlinComplation.source`，嘗試使用它會在建置腳本編譯期間導致「未解析的參考」錯誤

<anchor name="kotlin-js-plugin-deprecation"/>
### 從 `kotlin-js` Gradle 外掛程式遷移到 `kotlin-multiplatform` Gradle 外掛程式 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已棄用。基本上，它複製了帶有 `js()` 目標的 `kotlin-multiplatform` 外掛程式的功能，並在底層共享相同的實現。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護負擔。我們鼓勵您改為遷移到帶有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

**現在的最佳實踐是什麼？**

1.  如果您使用 `pluginManagement {}` 區塊，請從您的專案中移除 `kotlin-js` Gradle 外掛程式，並在 `settings.gradle.kts` 檔案中套用 `kotlin-multiplatform`：

    <tabs>
    <tab title="kotlin-js">

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

    </tab>
    <tab title="kotlin-multiplatform">

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

    </tab>
    </tabs>

    如果您使用不同的方式套用外掛程式，請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/plugins.html) 以獲取遷移說明。

2.  將您的原始碼檔案從 `main` 和 `test` 資料夾移動到同一目錄下的 `jsMain` 和 `jsTest` 資料夾。
3.  調整依賴聲明：

    *   我們建議使用 `sourceSets {}` 區塊並配置各個原始碼集的依賴關係，`jsMain {}` 用於生產依賴，`jsTest {}` 用於測試依賴。
        更多詳細資訊請參閱 [新增依賴關係](multiplatform-add-dependencies.md)。
    *   然而，如果您想在頂層區塊中聲明您的依賴關係，請將聲明從 `api("group:artifact:1.0")` 更改為 `add("jsMainApi", "group:artifact:1.0")` 等。

      > 在這種情況下，請確保頂層的 `dependencies {}` 區塊位於 `kotlin {}` 區塊**之後**。否則，您將會收到「Configuration not found」錯誤。
      >
      {style="note"}

    您可以透過以下其中一種方式更改您的 `build.gradle.kts` 檔案中的程式碼：

    <tabs>
    <tab title="kotlin-js">

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

    </tab>
    <tab title="kotlin-multiplatform">

    ```kotlin
    // build.gradle.kts:
    plugins {
        kotlin("multiplatform") version "1.9.0"
    }
    
    kotlin {
        js {
            // ...
        }
        
        // 選項 #1. 在 sourceSets {} 區塊中宣告依賴：
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
        // 選項 #2. 為依賴宣告添加 js 前綴：
        add("jsTestImplementation", kotlin("test"))
    }
    ```

    </tab>
    </tabs>

4.  Kotlin Gradle 外掛程式在 `kotlin {}` 區塊中提供的 DSL 在大多數情況下保持不變。然而，如果您以前是透過名稱引用低層次 Gradle 實體，例如任務和配置，現在您需要調整它們，通常是透過添加 `js` 前綴。例如，您可以找到名為 `jsBrowserTest` 的 `browserTest` 任務。

**變更何時生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 外掛程式會產生棄用警告。

<anchor name="jvmWithJava-preset-deprecation"/>
### 棄用 `jvmWithJava` 預設 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

`targetPresets.jvmWithJava` 已棄用，不鼓勵使用。

**現在的最佳實踐是什麼？**

請改用 `jvm { withJava() }` 目標。請注意，切換到 `jvm { withJava() }` 後，您需要調整包含 `.java` 原始碼的原始碼目錄路徑。

例如，如果您使用預設名稱為「jvm」的 `jvm` 目標：

| 之前          | 現在                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**變更何時生效？**

以下是規劃的棄用週期：

*   1.3.40：當使用 `targetPresets.jvmWithJava` 時引入警告
*   1.9.20：將此警告提升為錯誤
*   >1.9.20：移除 `targetPresets.jvmWithJava` API；嘗試使用它會導致建置腳本編譯失敗

> 儘管整個 `targetPresets` API 已棄用，但 `jvmWithJava` 預設具有不同的棄用時間表。
>
{style="note"}

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 棄用舊版 Android 原始碼集佈局 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

[新的 Android 原始碼集佈局](multiplatform-android-layout.md) 自 Kotlin 1.9.0 起預設使用。對舊版佈局的支援已棄用，並且使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 屬性現在會觸發棄用診斷。

**變更何時生效？**

以下是規劃的棄用週期：

*   <=1.9.0：當使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 時報告警告；此警告可透過 `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 屬性抑制
*   1.9.20：將此警告提升為錯誤；此錯誤**無法**抑制
*   >1.9.20：移除對 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支援；Kotlin Gradle 外掛程式將忽略此屬性

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 棄用帶有自訂 `dependsOn` 的 `commonMain` 和 `commonTest` {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

`commonMain` 和 `commonTest` 原始碼集通常分別代表 `main` 和 `test` 原始碼集階層的根。然而，可以透過手動配置這些原始碼集的 `dependsOn` 關係來覆寫。

維護此類配置需要額外努力和對多平台建置內部結構的了解。此外，它降低了程式碼的可讀性和可重用性，因為您需要閱讀特定的建置腳本才能確定 `commonMain` 是否是 `main` 原始碼集階層的根。

因此，存取 `commonMain` 和 `commonTest` 上的 `dependsOn` 現已棄用。

**現在的最佳實踐是什麼？**

假設您需要將使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` 原始碼集遷移到 1.9.20。在大多數情況下，`customCommonMain` 參與的編譯與 `commonMain` 相同，因此您可以將 `customCommonMain` 合併到 `commonMain` 中：

1.  將 `customCommonMain` 的原始碼複製到 `commonMain` 中。
2.  將 `customCommonMain` 的所有依賴關係添加到 `commonMain` 中。
3.  將 `customCommonMain` 的所有編譯器選項設定添加到 `commonMain` 中。

在極少數情況下，`customCommonMain` 可能參與的編譯比 `commonMain` 更多。這種配置需要建置腳本的額外低層次配置。如果您不確定這是否是您的用例，那麼很可能不是。

如果這是您的用例，請透過將 `customCommonMain` 的原始碼和設定移動到 `commonMain`，反之亦然，來「交換」這兩個原始碼集。

**變更何時生效？**

以下是規劃的棄用週期：

*   1.9.0：當在 `commonMain` 中使用 `dependsOn` 時報告警告
*   >=1.9.20：當在 `commonMain` 或 `commonTest` 中使用 `dependsOn` 時報告錯誤

### 前向宣告的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

JetBrains 團隊已修改 Kotlin 中的前向宣告方法，使其行為更具可預測性：

*   您只能使用 `cnames` 或 `objcnames` 套件導入前向宣告。
*   您需要明確地將其轉換為相應的 C 和 Objective-C 前向宣告，反之亦然。

**現在的最佳實踐是什麼？**

*   考慮一個 C 函式庫，其中 `library.package` 宣告了一個 `cstructName` 前向宣告。以前，可以直接從函式庫中透過 `import library.package.cstructName` 導入它。現在，您只能為此使用一個特殊的前向宣告套件：`import cnames.structs.cstructName`。`objcnames` 也是如此。

*   考慮兩個 objcinterop 函式庫：一個使用 `objcnames.protocols.ForwardDeclaredProtocolProtocol`，另一個具有實際定義：

    ```ObjC
    // First objcinterop library
    #import <Foundation/Foundation.h>
    
    @protocol ForwardDeclaredProtocol;
    
    NSString* consumeProtocol(id<ForwardDeclaredProtocol> s) {
        return [NSString stringWithUTF8String:"Protocol"];
    }
    ```

    ```ObjC
    // Second objcinterop library
    // Header:
    #import <Foundation/Foundation.h>
    @protocol ForwardDeclaredProtocol
    @end
    // Implementation:
    @interface ForwardDeclaredProtocolImpl : NSObject <ForwardDeclaredProtocol>
    @end

    id<ForwardDeclaredProtocol> produceProtocol() {
        return [ForwardDeclaredProtocolImpl new];
    }
    ```

    以前，可以在它們之間無縫傳輸物件。現在，對於前向宣告，需要明確的 `as` 轉換：

    ```kotlin
    // Kotlin code:
    fun test() {
        consumeProtocol(produceProtocol() as objcnames.protocols.ForwardDeclaredProtocolProtocol)
    }
    ```

    > 您只能從相應的實際類別轉換為 `objcnames.protocols.ForwardDeclaredProtocolProtocol`。否則，您將會收到錯誤。
    >
    {style="note"}

**變更何時生效？**

從 Kotlin 1.9.20 開始，您需要明確地將其轉換為相應的 C 和 Objective-C 前向宣告，反之亦然。此外，現在只能透過使用特殊套件導入前向宣告。

## Kotlin 1.7.0−1.8.22

本節涵蓋在 Kotlin 1.7.0−1.8.22 中結束棄用週期並生效的不相容變更。

<anchor name="deprecated-compatibility-with-kmp-gradle-plugin-and-gradle-java-plugins"/>
### 棄用 Kotlin Multiplatform Gradle 外掛程式與 Gradle Java 外掛程式的相容性 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

由於 Kotlin Multiplatform Gradle 外掛程式與 Gradle 外掛程式 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 和 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) 之間存在相容性問題，現在當您將這些外掛程式應用於同一個專案時會發出棄用警告。當您的多平台專案中的另一個 Gradle 外掛程式應用了 Gradle Java 外掛程式時，也會出現此警告。例如，[Spring Boot Gradle 外掛程式](https://docs.spring.io/spring-boot/gradle-plugin/index.html) 會自動應用 Application 外掛程式。

我們新增此棄用警告是基於 Kotlin Multiplatform 專案模型與 Gradle 的 Java 生態系統外掛程式之間存在根本的相容性問題。Gradle 的 Java 生態系統外掛程式目前沒有考慮到其他外掛程式可能：

*   也以不同於 Java 生態系統外掛程式的方式發布或編譯 JVM 目標。
*   在同一個專案中有兩個不同的 JVM 目標，例如 JVM 和 Android。
*   具有複雜的多平台專案結構，可能包含多個非 JVM 目標。

遺憾的是，Gradle 目前沒有提供任何 API 來解決這些問題。

我們之前在 Kotlin Multiplatform 中使用了一些權宜之計來協助整合 Java 生態系統外掛程式。然而，這些權宜之計從未真正解決相容性問題，而且自 Gradle 8.8 發布以來，這些權宜之計已不再可行。更多資訊請參閱我們的 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-66542/Gradle-JVM-target-with-withJava-produces-a-deprecation-warning)。

儘管我們尚未確切知道如何解決這個相容性問題，但我們承諾將繼續支援您的 Kotlin Multiplatform 專案中某種形式的 Java 原始碼編譯。至少，我們將支援在您的多平台專案中編譯 Java 原始碼並使用 Gradle 的 [`java-base`](https://docs.gradle.org/current/javadoc/org/gradle/api/plugins/JavaBasePlugin.html) 外掛程式。

如果您在多平台專案中看到此棄用警告，我們建議您：
1.  確定您的專案中是否確實需要 Gradle Java 外掛程式。如果不需要，請考慮將其移除。
2.  檢查 Gradle Java 外掛程式是否僅用於單一任務。如果是，您可能可以毫不費力地移除該外掛程式。例如，如果該任務使用 Gradle Java 外掛程式來建立 Javadoc JAR 檔案，您可以手動定義 Javadoc 任務。

否則，如果您想在多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和這些 Gradle Java 外掛程式，我們建議您：

1.  在您的 Gradle 專案中建立一個獨立的子專案。
2.  在獨立的子專案中，應用 Gradle Java 外掛程式。
3.  在獨立的子專案中，新增對父多平台專案的依賴關係。

> 獨立的子專案**不能**是多平台專案，且您只能將其用於設定對多平台專案的依賴關係。
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

在您的子專案的 `build.gradle.kts` 檔案中，在 `plugins {}` 區塊中應用 Java Library 外掛程式：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("java-library")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id('java-library')
}
```

</tab>
</tabs>

在您的子專案的 `build.gradle.kts` 檔案中，新增對父多平台專案的依賴關係：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(project(":my-main-project")) // 您的父多平台專案名稱
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation project(':my-main-project') // 您的父多平台專案名稱
}
```

</tab>
</tabs>

您的父專案現在已設定為可與兩個外掛程式配合使用。

### 自動產生目標的新方法 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

Gradle 自動產生的目標存取器在 `kotlin.targets {}` 區塊中不再可用。請改用 `findByName("targetName")` 方法。

請注意，此類存取器在 `kotlin.targets {}` 情況下仍然可用，例如 `kotlin.targets.linuxX64`。

**現在的最佳實踐是什麼？**

<table>
    <tr>
        <td>之前</td>
        <td>現在</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

**變更何時生效？**

在 Kotlin 1.7.20 中，在 `kotlin.targets {}` 區塊中使用目標存取器會引入錯誤。

更多資訊請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-47047)。

### Gradle 輸入和輸出編譯任務的變更 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

Kotlin 編譯任務不再繼承具有 `sourceCompatibility` 和 `targetCompatibility` 輸入的 Gradle `AbstractCompile` 任務，使其在 Kotlin 使用者的腳本中不可用。

編譯任務中的其他重大變更：

**現在的最佳實踐是什麼？**

| 之前                                                              | 現在                                                                                                            |
|---------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| `SourceTask.stableSources` 輸入不再可用。        | 請改用 `sources` 輸入。此外，`setSource()` 方法仍然可用。                          |
| `sourceFilesExtensions` 輸入已移除。                      | 編譯任務仍實現 `PatternFilterable` 介面。使用其方法來過濾 Kotlin 原始碼。 |
| `Gradle destinationDir: File` 輸出已棄用。            | 請改用 `destinationDirectory: DirectoryProperty` 輸出。                                              |
| `KotlinCompile` 任務的 `classpath` 屬性已棄用。 | 所有編譯任務現在都使用 `libraries` 輸入來獲取編譯所需的函式庫清單。              |

**變更何時生效？**

在 Kotlin 1.7.20 中，輸入不可用，輸出已替換，`classpath` 屬性已棄用。

更多資訊請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-32805)。

### 編譯依賴項的新配置名稱 {initial-collapse-state="collapsed" collapsible="true"}

**有什麼變更？**

Kotlin Multiplatform Gradle 外掛程式建立的編譯配置已獲得新名稱。

Kotlin Multiplatform 專案中的目標有兩個預設編譯：`main` 和 `test`。每個編譯都有其自己的預設原始碼集，例如 `jvmMain` 和 `jvmTest`。以前，測試編譯及其預設原始碼集的配置名稱相同，這可能導致名稱衝突，進而在將帶有平台特定屬性的配置包含在另一個配置中時產生問題。

現在，編譯配置帶有額外的 `Compilation` 後綴，而使用舊版硬編碼配置名稱的專案和外掛程式將不再編譯。

對應原始碼集的依賴配置名稱保持不變。

**現在的最佳實踐是什麼？**

<table>
    <tr>
        <td></td>
        <td>之前</td>
        <td>現在</td>
    </tr>
    <tr>
        <td rowspan="2">`jvmMain` 編譯的依賴項</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td>`jvmMain` 原始碼集的依賴項</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td>`jvmTest` 編譯的依賴項</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td>`jvmTest` 原始碼集的依賴項</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

可用的作用域是 `Api`、`Implementation`、`CompileOnly` 和 `RuntimeOnly`。

**變更何時生效？**

在 Kotlin 1.8.0 中，在硬編碼字串中使用舊配置名稱會引入錯誤。

更多資訊請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-35916/)。