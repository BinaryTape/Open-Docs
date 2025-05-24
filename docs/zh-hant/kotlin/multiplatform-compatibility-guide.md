---
title: "Kotlin Multiplatform 相容性指南"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<show-structure depth="1"/>

本指南總結了您在使用 Kotlin Multiplatform 開發專案時可能遇到的[不相容變更](kotlin-evolution-principles#incompatible-changes)。

目前 Kotlin 的穩定版本是 2.1.20。請注意特定變更與您專案中 Kotlin 版本的棄用週期，例如：

* 從 Kotlin 1.7.0 升級到 Kotlin 1.9.0 時，請檢查在 [Kotlin 1.9.0](#kotlin-1-9-0-1-9-25) 和 [Kotlin 1.7.0−1.8.22](#kotlin-1-7-0-1-8-22) 中生效的不相容變更。
* 從 Kotlin 1.9.0 升級到 Kotlin 2.0.0 時，請檢查在 [Kotlin 2.0.0](#kotlin-2-0-0-and-later) 和 [Kotlin 1.9.0−1.9.25](#kotlin-1-9-0-1-9-25) 中生效的不相容變更。

## 版本相容性

配置專案時，請檢查特定版本的 Kotlin Multiplatform Gradle 外掛程式（與專案中的 Kotlin 版本相同）與 Gradle、Xcode 和 Android Gradle 外掛程式版本的相容性：

| Kotlin Multiplatform 外掛程式版本 | Gradle                                | Android Gradle 外掛程式           | Xcode   |
|-------------------------------------|---------------------------------------|---------------------------------|---------|
| 2.1.20                              | 7.6.3–8.11 | 7.4.2–8.7.2 | 16.0 |
| 2.1.0–2.1.10                        | 7.6.3-8.10*                           | 7.4.2–8.7.2                     | 16.0    |
| 2.0.21                              | 7.5-8.8*                              | 7.4.2–8.5                       | 16.0    |
| 2.0.20                              | 7.5-8.8*                              | 7.4.2–8.5                       | 15.3    |
| 2.0.0                               | 7.5-8.5                               | 7.4.2–8.3                       | 15.3    |
| 1.9.20                              | 7.5-8.1.1                             | 7.4.2–8.2                       | 15.0    |
:::note
*Kotlin 2.0.20–2.0.21 和 Kotlin 2.1.0–2.1.10 完全相容於最高到 8.6 的 Gradle。
也支援 Gradle 版本 8.7–8.10，但只有一個例外：如果您使用 Kotlin Multiplatform Gradle 外掛程式，
您可能會在多平台專案中看到棄用警告，呼叫 JVM 目標中的 `withJava()` 函數。
如需更多資訊，請參閱[預設建立的 Java 原始碼集](#java-source-sets-created-by-default)。

## Kotlin 2.0.0 及更高版本

本節涵蓋在 Kotlin 2.0.0−2.1.20 中結束棄用週期並生效的不相容變更。

<anchor name="java-source-set-created-by-default"/>
### 預設建立的 Java 原始碼集

**變更了什麼？**

為了使 Kotlin Multiplatform 與 Gradle 即將發生的變更保持一致，我們正在逐步淘汰 `withJava()` 函數。`withJava()`
函數透過建立必要的 Java 原始碼集來啟用與 Gradle 的 Java 外掛程式的整合。從 Kotlin 2.1.20 開始，
這些 Java 原始碼集預設為建立。

**現在的最佳做法是什麼？**

先前，您必須明確使用 `withJava()` 函數來建立 `src/jvmMain/java` 和 `src/jvmTest/java` 原始碼集：

```kotlin
kotlin {
    jvm {
        withJava()
    }
}
``` 

從 Kotlin 2.1.20 開始，您可以從您的建置腳本中移除 `withJava()` 函數。

此外，Gradle 現在僅在存在 Java 原始碼時才執行 Java 編譯任務，觸發先前未執行的 JVM 驗證
診斷。如果您明確為 `KotlinJvmCompile` 任務或在 `compilerOptions` 內部配置不相容的 JVM 目標，此診斷會失敗。如需確保 JVM 目標相容性的指南，請參閱
[檢查相關編譯任務的 JVM 目標相容性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)。

如果您的專案使用高於 8.7 的 Gradle 版本，且不依賴 Gradle Java 外掛程式，例如 [Java](https://docs.gradle.org/current/userguide/java_plugin.html)、
[Java Library](https://docs.gradle.org/current/userguide/java_library_plugin.html) 或 [Application](https://docs.gradle.org/current/userguide/application_plugin.html)，
或具有 Gradle Java 外掛程式相依性的協力廠商 Gradle 外掛程式，您可以移除 `withJava()` 函數。

如果您的專案使用 [Application](https://docs.gradle.org/current/userguide/application_plugin.html) Gradle Java 外掛程式，
我們建議遷移到 [新的實驗性 DSL](whatsnew2120#kotlin-multiplatform-new-dsl-to-replace-gradle-s-application-plugin)。
從 Gradle 8.7 開始，Application 外掛程式將不再與 Kotlin Multiplatform Gradle 外掛程式搭配使用。

如果您想在您的多平台專案中同時使用 Kotlin Multiplatform Gradle 外掛程式和其他 Gradle Java 外掛程式，請參閱[已棄用的 Kotlin Multiplatform Gradle 外掛程式與 Java 外掛程式的相容性](multiplatform-compatibility-guide#deprecated-compatibility-with-kotlin-multiplatform-gradle-plugin-and-gradle-java-plugins)。

如果您遇到任何問題，請在我們的 [issue tracker](https://kotl.in/issue) 中報告，或在我們的 [public Slack channel](https://kotlinlang.slack.com/archives/C19FD9681) 中尋求協助。

**變更何時生效？**

以下是計劃的棄用週期：

* Gradle >8.6：在多平台專案中使用 `withJava()` 函數的任何先前 Kotlin 版本引入棄用警告。
* Gradle 9.0：將此警告提升為錯誤。
* 2.1.20：在使用任何 Gradle 版本上的 `withJava()` 函數時引入棄用警告。

<anchor name="android-target-rename"/>
### 將 `android` 目標重新命名為 `androidTarget`

**變更了什麼？**

我們將繼續努力使 Kotlin Multiplatform 更加穩定。朝這個方向邁出的重要一步是為 Android 目標提供一流的
支援。將來，此支援將透過 Google 的 Android 團隊開發的單獨外掛程式提供。

為了開啟新解決方案的道路，我們正在目前的 Kotlin DSL 中將 `android` 區塊重新命名為 `androidTarget`。
這是一個臨時變更，對於從 Google 提供的即將推出的 DSL 釋放簡短的 `android` 名稱是必要的。

**現在的最佳做法是什麼？**

將所有出現的 `android` 區塊重新命名為 `androidTarget`。當新的 Android 目標支援外掛程式
可用時，從 Google 遷移到 DSL。這將是在 Kotlin Multiplatform 專案中使用 Android 的首選選項。

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9.0：在 Kotlin Multiplatform 專案中使用 `android` 名稱時引入棄用警告
* 2.1.0：將此警告提升為錯誤
* 2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除 `android` 目標 DSL

<anchor name="declaring-multiple-targets"/>
### 宣告多個類似的目標

**變更了什麼？**

我們不鼓勵在單一 Gradle 專案中宣告多個類似的目標。例如：

```kotlin
kotlin {
    jvm("jvmKtor")
    jvm("jvmOkHttp") // 不建議，並產生棄用警告
}
```

一個常見的情況是將兩個相關的程式碼片段放在一起。例如，您可能想在您的 `:shared` Gradle 專案中使用
`jvm("jvmKtor")` 和 `jvm("jvmOkHttp")`，以使用 Ktor 或 OkHttp 庫實作網路功能：

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
                // Shared dependencies
            }
        }
        val jvmKtorMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // Ktor dependencies
            }
        }
        val jvmOkHttpMain by getting {
            dependsOn(commonJvmMain)
            dependencies {
                // OkHttp dependencies
            }
        }
    }
}
```

此實作帶來了非同小可的配置複雜性：

* 您必須在 `:shared` 端和每個消費者端設定 Gradle 屬性。否則，Gradle 無法
  解析此類專案中的相依性，因為沒有額外的資訊，不清楚消費者
  應該接收基於 Ktor 的實作還是基於 OkHttp 的實作。
* 您必須手動設定 `commonJvmMain` 原始碼集。
* 此配置涉及一些低階的 Gradle 和 Kotlin Gradle 外掛程式抽象和 API。

**現在的最佳做法是什麼？**

配置很複雜，因為基於 Ktor 的和基於 OkHttp 的實作
_在同一個 Gradle 專案中_。在許多情況下，可以將這些部分提取到單獨的 Gradle 專案中。
以下是此類重構的一般概述：

1. 將原始專案中的兩個重複目標替換為單一目標。如果您在
   這些目標之間有一個共用的原始碼集，請將其原始碼和配置移至新建立目標的預設原始碼集：

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

2. 新增兩個新的 Gradle 專案，通常透過在您的 `settings.gradle.kts` 檔案中呼叫 `include`。例如：

    ```kotlin
    include(":okhttp-impl")
    include(":ktor-impl")
    ```

3. 配置每個新的 Gradle 專案：

    * 很可能，您不需要套用 `kotlin("multiplatform")` 外掛程式，因為這些專案僅編譯為一個
      目標。在此範例中，您可以套用 `kotlin("jvm")`。
    * 將原始目標特定原始碼集的內容移至其各自的專案，例如，
      從 `jvmKtorMain` 到 `ktor-impl/src`。
    * 複製原始碼集的配置：相依性、編譯器選項等等。
    * 從新的 Gradle 專案新增到原始專案的相依性。

    ```kotlin
    // ktor-impl/build.gradle.kts:
    plugins {
        kotlin("jvm")
    }
    
    dependencies {
        project(":shared") // 新增到原始專案的相依性
        // 在此處複製 jvmKtorMain 的相依性
    }
    
    kotlin {
        compilerOptions {
            // 在此處複製 jvmKtorMain 的編譯器選項
        }
    }
    ```

雖然此方法需要在初始設定上做更多的工作，但它不使用 Gradle 的任何低階實體和
Kotlin Gradle 外掛程式，使其更容易使用和維護產生的建置。

不幸的是，我們無法為每種情況提供詳細的遷移步驟。如果以上說明對您不起作用
，請在此 [YouTrack issue](https://youtrack.jetbrains.com/issue/KT-59316) 中描述您的使用案例。

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9.20：在 Kotlin Multiplatform 專案中使用多個類似目標時引入棄用警告
* 2.1.0：在此類情況下報告錯誤，Kotlin/JS 目標除外；若要了解有關此例外的更多資訊，請參閱 [YouTrack](https://youtrack.jetbrains.com/issue/KT-47038/KJS-MPP-Split-JS-target-into-JsBrowser-and-JsNode) 中的問題

<anchor name="deprecate-pre-hmpp-dependencies"/>
### 已棄用在舊版模式中發佈的多平台庫的支援

**變更了什麼？**

先前，我們[已棄用
舊版模式](#deprecated-gradle-properties-for-hierarchical-structure-support)，在 Kotlin Multiplatform 專案中
阻止發佈「舊版」二進位檔案，並鼓勵您將專案遷移到[階層式結構](multiplatform-hierarchy)。

為了繼續從生態系統中逐步淘汰「舊版」二進位檔案，從 Kotlin 1.9.0 開始，也不鼓勵使用舊版庫。如果您的專案使用舊版庫的相依性，您將看到以下警告：

```none
The dependency group:artifact:1.0 was published in the legacy mode. Support for such dependencies will be removed in the future
```

**現在的最佳做法是什麼？**

_如果您使用多平台庫_，它們中的大多數已遷移到「階層式結構」模式，
因此您只需要更新庫版本。有關詳細資訊，請參閱各個庫的文件。

如果該庫尚不支援非舊版二進位檔案，您可以聯絡維護者並告知他們有關此
相容性問題。

_如果您是庫作者_，請將 Kotlin Gradle 外掛程式更新到最新版本，並確保您已修復[已棄用的 Gradle 屬性](#deprecated-gradle-properties-for-hierarchical-structure-support)。

Kotlin 團隊渴望協助生態系統遷移，因此如果您遇到任何問題，請隨時在 [YouTrack 中建立一個 issue](https://kotl.in/issue)。

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9：針對舊版庫的相依性引入棄用警告
* 2.0：將針對舊版庫的相依性的警告提升為錯誤
* &gt;2.0：移除對舊版庫的相依性的支援；使用此類相依性可能會導致建置失敗

<anchor name="deprecate-hmpp-properties"/>
### 用於階層式結構支援的已棄用 Gradle 屬性

**變更了什麼？**

在它的演變過程中，Kotlin 逐步引入了對[階層式結構](multiplatform-hierarchy)的支援，
在多平台專案中，一種在共用原始碼集 `commonMain` 和
任何平台特定原始碼集（例如 `jvmMain`）之間具有中間原始碼集的能力。

對於過渡期間，當工具鏈不夠穩定時，引入了幾個 Gradle 屬性，
允許進行細微的選擇加入和選擇退出。

自 Kotlin 1.6.20 以來，預設情況下已啟用階層式專案結構支援。但是，為了在發生封鎖問題時選擇退出，這些屬性
被保留下來。在處理完所有回饋之後，我們現在開始完全逐步淘汰
這些屬性。

以下屬性現在已棄用：

* `kotlin.internal.mpp.hierarchicalStructureByDefault`
* `kotlin.mpp.enableCompatibilityMetadataVariant`
* `kotlin.mpp.hierarchicalStructureSupport`
* `kotlin.mpp.enableGranularSourceSetsMetadata`
* `kotlin.native.enableDependencyPropagation`

**現在的最佳做法是什麼？**

* 從您的 `gradle.properties` 和 `local.properties` 檔案中移除這些屬性。
* 避免以程式設計方式在 Gradle 建置腳本或您的 Gradle 外掛程式中設定它們。
* 如果已棄用的屬性是由您建置中使用的某些協力廠商 Gradle 外掛程式設定的，請要求外掛程式維護者
  不要設定這些屬性。

由於 Kotlin 工具鏈的預設行為自 1.6.20 以來不包含此類屬性，因此我們預期
移除它們不會產生任何嚴重的影響。大多數可能的後果將在專案重建後立即顯示。

如果您是庫作者並且想要更加安全，請檢查消費者是否可以使用您的庫。

**變更何時生效？**

以下是計劃的棄用週期：

* 1.8.20：在使用這些屬性時報告警告
* 1.9.20：將此警告提升為錯誤
* 2.0：移除這些屬性；Kotlin Gradle 外掛程式會忽略它們的用法

在不太可能的情況下，您在移除這些屬性後遇到一些問題，請在 [YouTrack 中建立一個 issue](https://kotl.in/issue)。

<anchor name="target-presets-deprecation"/>
### 已棄用目標預設 API

**變更了什麼？**

在非常早期的開發階段，Kotlin Multiplatform 引入了一個用於處理所謂的 _目標預設_ 的 API。
每個目標預設本質上代表 Kotlin Multiplatform 目標的工廠。這個 API 最終在很大程度上變得
多餘，因為像 `jvm()` 或 `iosSimulatorArm64()` 這樣的 DSL 函數涵蓋了相同的使用案例，同時更加
直接和簡潔。

為了減少混淆並提供更清晰的指導方針，所有與預設相關的 API 現在都已棄用，並且將從
未來版本中的 Kotlin Gradle 外掛程式的公共 API 中移除。這包括：

* `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 屬性
* `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 介面及其所有繼承者
* `fromPreset` 多載

**現在的最佳做法是什麼？**

改為使用各自的 [Kotlin 目標](multiplatform-dsl-reference#targets)，例如：
<table>
<tr>
<td>
之前
</td>
<td>
現在
</td>
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

以下是計劃的棄用週期：

* 1.9.20：報告在任何與預設相關的 API 的用法上的警告
* 2.0：將此警告提升為錯誤
* &gt;2.0：從 Kotlin Gradle 外掛程式的公共 API 中移除與預設相關的 API；仍然使用它的來源會因「未解析的參考」錯誤而失敗，並且二進位檔案（例如，Gradle 外掛程式）可能會因連結錯誤而失敗，除非針對最新版本的 Kotlin Gradle 外掛程式重新編譯

<anchor name="target-shortcuts-deprecation"/>
### 已棄用 Apple 目標捷徑

**變更了什麼？**

我們正在 Kotlin Multiplatform DSL 中棄用 `ios()`、`watchos()` 和 `tvos()` 目標捷徑。它們旨在
部分建立 Apple 目標的原始碼集階層。但是，它們被證明很難擴展，有時會造成混淆。

例如，`ios()` 捷徑同時建立了 `iosArm64` 和 `iosX64` 目標，但不包含 `iosSimulatorArm64`
目標，這在使用具有 Apple M 晶片的主機時是必要的。但是，更改此捷徑很難實作，並且可能會導致現有使用者專案中出現問題。

**現在的最佳做法是什麼？**

Kotlin Gradle 外掛程式現在提供了一個內建的階層範本。自 Kotlin 1.9.20 以來，預設情況下已啟用
，並且包含預先定義的常用案例的中間原始碼集。

您應該指定目標清單，而不是捷徑，然後外掛程式會根據此清單自動設定中間
原始碼集。

例如，如果您的專案中有 `iosArm64` 和 `iosSimulatorArm64` 目標，則外掛程式會自動建立
`iosMain` 和 `iosTest` 中間原始碼集。如果您有 `iosArm64` 和 `macosArm64` 目標，則會建立 `appleMain` 和
`appleTest` 原始碼集。

如需更多資訊，請參閱 [階層式專案結構](multiplatform-hierarchy)

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9.20：報告在使用 `ios()`、`watchos()` 和 `tvos()` 目標捷徑時的警告；
  預設情況下已啟用預設階層範本
* 2.1.0：報告在使用目標捷徑時的錯誤
* 2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除目標捷徑 DSL

### Kotlin 升級後 iOS 框架的版本不正確

**問題是什麼？**

當使用直接整合時，Kotlin 程式碼中的變更可能不會反映在 Xcode 中的 iOS 應用程式中。直接整合是透過 `embedAndSignAppleFrameworkForXcode` 任務設定的，該任務將來自您的多平台專案的 iOS
框架連接到 Xcode 中的 iOS 應用程式。

當您將 Kotlin 版本從 1.9.2x 升級到 2.0.0（或從 2.0.0 降級到 1.9.2x）時，可能會發生這種情況
，然後在 Kotlin 檔案中進行變更並嘗試建置應用程式，Xcode 可能會錯誤地使用先前版本的 iOS 框架。因此，這些變更在 Xcode 中的 iOS 應用程式中將不可見。

**解決方法是什麼？**

1. 在 Xcode 中，使用 **Product** | **Clean Build Folder** 清除建置目錄。
2. 在終端中，執行以下命令：

   ```none
   ./gradlew clean
   ```

3. 再次建置應用程式，以確保使用新版本的 iOS 框架。

**問題何時修復？**

我們計劃在 Kotlin 2.0.10 中修復此問題。您可以檢查 [參與 Kotlin 搶先體驗預覽](eap) 區段中是否已提供 Kotlin 2.0.10 的任何預覽版本。

如需更多資訊，請參閱 [YouTrack 中的相應問題](https://youtrack.jetbrains.com/issue/KT-68257)。

## Kotlin 1.9.0−1.9.25

本節涵蓋在 Kotlin 1.9.0−1.9.25 中結束棄用週期並生效的不相容變更。

<anchor name="compilation-source-deprecation"/>
### 已棄用用於將 Kotlin 原始碼集直接新增到 Kotlin 編譯的 API 

**變更了什麼？**

已棄用對 `KotlinCompilation.source` 的存取。像這樣的程式碼會產生棄用警告：

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

**現在的最佳做法是什麼？**

若要取代 `KotlinCompilation.source(someSourceSet)`，請從
`KotlinCompilation` 的預設原始碼集到 `someSourceSet` 新增 `dependsOn` 關係。我們建議使用 `by getting` 直接參考該來源，
這更簡短且更具可讀性。但是，您也可以使用 `KotlinCompilation.defaultSourceSet.dependsOn(someSourceSet)`，
這適用於所有情況。

您可以使用以下其中一種方式來變更上面的程式碼：

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
        
        // 選項 #1. 更簡短且更具可讀性，盡可能使用它。 
        // 通常，預設原始碼集的名稱
        // 是目標名稱和編譯名稱的簡單串連：
        val jvmMain by getting {
            dependsOn(myCustomIntermediateSourceSet)
        }
        
        // 選項 #2. 通用解決方案，如果您的建置腳本需要更進階的方法，請使用它：
        targets["jvm"].compilations["main"].defaultSourceSet.dependsOn(myCustomIntermediateSourceSet)
    }
}
```

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9.0：在使用 `KotlinComplation.source` 時引入棄用警告
* 1.9.20：將此警告提升為錯誤
* &gt;1.9.20：從 Kotlin Gradle 外掛程式中移除 `KotlinComplation.source`，嘗試使用它會導致建置腳本編譯期間出現「未解析的參考」錯誤

<anchor name="kotlin-js-plugin-deprecation"/>
### 從 `kotlin-js` Gradle 外掛程式遷移到 `kotlin-multiplatform` Gradle 外掛程式

**變更了什麼？**

從 Kotlin 1.9.0 開始，`kotlin-js` Gradle 外掛程式已
棄用。基本上，它複製了 `kotlin-multiplatform` 外掛程式的功能，並帶有 `js()` 目標，
並且在幕後共用相同的實作。這種重疊造成了混淆，並增加了 Kotlin 團隊的維護
負擔。我們鼓勵您遷移到帶有 `js()` 目標的 `kotlin-multiplatform` Gradle 外掛程式。

**現在的最佳做法是什麼？**

1. 從您的專案中移除 `kotlin-js` Gradle 外掛程式，如果您使用的是 `pluginManagement {}` 區塊，請在 `settings.gradle.kts` 檔案中套用 `kotlin-multiplatform`：

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 移除以下程式碼行：
           kotlin("js") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // settings.gradle.kts:
   pluginManagement {
       plugins {
           // 改為新增以下程式碼行：
           kotlin("multiplatform") version "1.9.0"
       }
       
       repositories {
           // ...
       }
   }
   ```

   </TabItem>
   </Tabs>

   如果您使用的是不同的套用外掛程式的方式，
   請參閱 [Gradle 文件](https://docs.gradle.org/current/userguide/plugins.html) 取得遷移說明。

2. 將您的原始碼檔案從 `main` 和 `test` 資料夾移至同一目錄中的 `jsMain` 和 `jsTest` 資料夾。
3. 調整相依性宣告：

   * 我們建議使用 `sourceSets {}` 區塊並配置各個原始碼集的相依性，
     `jsMain {}` 用於生產相依性，`jsTest {}` 用於測試相依性。
     請參閱 [新增相依性](multiplatform-add-dependencies) 取得更多詳細資訊。
   * 但是，如果您想在頂層區塊中宣告您的相依性，
     請將宣告從 `api("group:artifact:1.0")` 變更為 `add("jsMainApi", "group:artifact:1.0")`，依此類推。

      在這種情況下，請確保頂層 `dependencies {}` 區塊位於 `kotlin {}` 區塊**之後**。否則，您將收到錯誤「找不到配置」。
     
     

   您可以使用以下其中一種方式變更 `build.gradle.kts` 檔案中的程式碼：

   <Tabs>
   <TabItem value="kotlin-js" label="kotlin-js">

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
   <TabItem value="kotlin-multiplatform" label="kotlin-multiplatform">

   ```kotlin
   // build.gradle.kts:
   plugins {
       kotlin("multiplatform") version "1.9.0"
   }
   
   kotlin {
       js {
           // ...
       }
       
       // 選項 #1. 在 sourceSets {} 區塊中宣告相依性：
       sourceSets {
           val jsMain by getting {
               dependencies {
                   // 此處不需要 js 前綴，您可以直接從頂層區塊複製並貼上它
                   implementation("org.jetbrains.kotlinx:kotlinx-html:0.8.0")
               }
          }
       }
   }
   
   dependencies {
       // 選項 #2. 將 js 前綴新增到相依性宣告：
       add("jsTestImplementation", kotlin("test"))
   }
   ```

   </TabItem>
   </Tabs>

4. 在大多數情況下，Kotlin Gradle 外掛程式在 `kotlin {}` 區塊內提供的 DSL 保持不變。但是，
   如果您透過名稱參考低階 Gradle 實體（例如，任務和配置），您現在需要調整它們，
   通常透過新增 `js` 前綴。例如，您可以在名稱 `jsBrowserTest` 下找到 `browserTest` 任務。

**變更何時生效？**

在 1.9.0 中，使用 `kotlin-js` Gradle 外掛程式會產生棄用警告。

<anchor name="jvmWithJava-preset-deprecation"/>
### 已棄用 `jvmWithJava` 預設

**變更了什麼？**

`targetPresets.jvmWithJava` 已棄用，不鼓勵使用。

**現在的最佳做法是什麼？**

改為使用 `jvm { withJava() }` 目標。請注意，在切換到 `jvm { withJava() }` 後，您需要調整
具有 `.java` 來源的原始碼目錄的路徑。

例如，如果您使用具有預設名稱 "jvm" 的 `jvm` 目標：

| 之前          | 現在                |
|-----------------|--------------------|
| `src/main/java` | `src/jvmMain/java` |
| `src/test/java` | `src/jvmTest/java` |

**變更何時生效？**

以下是計劃的棄用週期：

* 1.3.40：在使用 `targetPresets.jvmWithJava` 時引入警告
* 1.9.20：將此警告提升為錯誤
* >1.9.20：移除 `targetPresets.jvmWithJava` API；嘗試使用它會導致建置腳本編譯失敗

即使整個 `targetPresets` API 已棄用，`jvmWithJava` 預設也有不同的棄用時間表。

:::

<anchor name="android-sourceset-layout-v1-deprecation"/>
### 已棄用舊版 Android 原始碼集版面配置

**變更了什麼？**

自 Kotlin 1.9.0 以來，預設使用[新的 Android 原始碼集版面配置](multiplatform-android-layout)。
已棄用對舊版版面配置的支援，並且現在使用 `kotlin.mpp.androidSourceSetLayoutVersion` Gradle 屬性
會觸發棄用診斷。

**變更何時生效？**

以下是計劃的棄用週期：

* &lt;=1.9.0：在使用 `kotlin.mpp.androidSourceSetLayoutVersion=1` 時報告警告；可以使用
  `kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true` Gradle 屬性來隱藏警告
* 1.9.20：將此警告提升為錯誤；**無法** 隱藏錯誤
* &gt;1.9.20：移除對 `kotlin.mpp.androidSourceSetLayoutVersion=1` 的支援；Kotlin Gradle 外掛程式會忽略該屬性

<anchor name="common-sourceset-with-dependson-deprecation"/>
### 已棄用具有自訂 `dependsOn` 的 `commonMain` 和 `commonTest`

**變更了什麼？**

`commonMain` 和 `commonTest` 原始碼集通常分別代表 `main` 和 `test` 原始碼集階層的根。但是，可以透過手動配置這些原始碼集的 `dependsOn` 關係來覆寫它。

維護此類配置需要額外的努力和對多平台建置內部的了解。此外，
它降低了程式碼的可讀性和程式碼的重複使用性，因為您需要閱讀特定的建置腳本，
以確保 `commonMain` 是否是 `main` 原始碼集階層的根。

因此，現在已棄用在 `commonMain` 和 `commonTest` 上存取 `dependsOn`。

**現在的最佳做法是什麼？**

假設您需要將使用 `commonMain.dependsOn(customCommonMain)` 的 `customCommonMain` 原始碼集遷移到 1.9.20。
在大多數情況下，`customCommonMain` 參與與 `commonMain` 相同的編譯，因此您可以將
`customCommonMain` 合併到 `commonMain` 中：

1. 將 `customCommonMain` 的來源複製到 `commonMain` 中。
2. 將 `customCommonMain` 的所有相依性新增到 `commonMain`。
3. 將 `customCommonMain` 的所有編譯器選項設定新增到 `commonMain`。

在極少數情況下，`customCommonMain` 可能參與比 `commonMain` 更多的編譯。
此類配置需要對建置腳本進行額外的低階配置。如果您不確定這是否是您的
使用案例，那很可能不是。

如果是您的使用案例，請透過將 `customCommonMain` 的來源和設定
移至 `commonMain`，反之亦然，來「交換」這兩個原始碼集。

**變更何時生效？**

以下是計劃的棄用週期：

* 1.9.0：在 `commonMain` 中使用 `dependsOn` 時報告警告
* &gt;=1.9.20：在 `