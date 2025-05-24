---
title: "Kotlin 1.8.0 的新特性"
---
_[發布時間：2022 年 12 月 28 日](releases#release-details)_

Kotlin 1.8.0 版本已推出，以下是其一些主要亮點：

* [JVM 的新實驗性函式：遞迴複製或刪除目錄內容](#recursive-copying-or-deletion-of-directories)
* [改善 kotlin-reflect 效能](#improved-kotlin-reflect-performance)
* [用於改善偵錯體驗的新 -Xdebug 編譯器選項](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合併到 `kotlin-stdlib`](#updated-jvm-compilation-target)
* [改善 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
* [與 Gradle 7.3 的相容性](#gradle)

## IDE 支援

支援 1.8.0 的 Kotlin 外掛程式可用於：

| IDE            | 支援的版本                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3、2022.1、2022.2             |
| Android Studio | Electric Eel (221)、Flamingo (222) |
:::note
您可以在 IntelliJ IDEA 2022.3 中將專案更新到 Kotlin 1.8.0，而無需更新 IDE 外掛程式。

若要在 IntelliJ IDEA 2022.3 中將現有專案移轉到 Kotlin 1.8.0，請將 Kotlin 版本變更為 `1.8.0` 並重新匯入您的 Gradle 或 Maven 專案。

:::

## Kotlin/JVM

從 1.8.0 版開始，編譯器可以產生具有對應於 JVM 19 的位元組碼版本的類別。新的語言版本還包括：

* [用於關閉 JVM 註解目標產生的編譯器選項](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [用於停用最佳化的新 `-Xdebug` 編譯器選項](#a-new-compiler-option-for-disabling-optimizations)
* [移除舊後端](#removal-of-the-old-backend)
* [支援 Lombok 的 @Builder 註解](#support-for-lombok-s-builder-annotation)

### 能夠不產生 TYPE_USE 和 TYPE_PARAMETER 註解目標

如果 Kotlin 註解在其 Kotlin 目標中具有 `TYPE`，則該註解會對應到其 Java 註解目標清單中的 `java.lang.annotation.ElementType.TYPE_USE`。這就像 `TYPE_PARAMETER` Kotlin 目標如何對應到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。對於 API 層級低於 26 的 Android 用戶端來說，這是一個問題，因為他們的 API 中沒有這些目標。

從 Kotlin 1.8.0 開始，您可以使用新的編譯器選項 `-Xno-new-java-annotation-targets` 來避免產生 `TYPE_USE` 和 `TYPE_PARAMETER` 註解目標。

### 用於停用最佳化的新編譯器選項

Kotlin 1.8.0 新增了一個新的 `-Xdebug` 編譯器選項，該選項會停用最佳化以獲得更好的偵錯體驗。目前，該選項會停用協同程式的「已最佳化」功能。將來，在我們新增更多最佳化後，此選項也會停用它們。

當您使用暫停函式時，「已最佳化」功能會最佳化變數。但是，使用已最佳化變數偵錯程式碼很困難，因為您看不到它們的值。

:::note
**切勿在生產環境中使用此選項**：透過 `-Xdebug` 停用此功能可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。

### 移除舊後端

在 Kotlin 1.5.0 中，我們[宣布](whatsnew15#stable-jvm-ir-backend)基於 IR 的後端已成為 [Stable](components-stability)。這意味著 Kotlin 1.4.* 中的舊後端已被棄用。在 Kotlin 1.8.0 中，我們已完全移除舊後端。因此，我們也移除了編譯器選項 `-Xuse-old-backend` 和 Gradle `useOldBackend` 選項。

### 支援 Lombok 的 @Builder 註解

社群已為 [Kotlin Lombok：支援產生的建構器 (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 問題新增了許多投票，因此我們必須支援 [@Builder 註解](https://projectlombok.org/features/Builder)。

我們尚未計劃支援 `@SuperBuilder` 或 `@Tolerate` 註解，但如果夠多人投票給 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 問題，我們會重新考慮。

[了解如何設定 Lombok 編譯器外掛程式](lombok#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包括對 Objective-C 和 Swift 互通性的變更、對 Xcode 14.1 的支援以及對 CocoaPods Gradle 外掛程式的改進：

* [支援 Xcode 14.1](#support-for-xcode-14-1)
* [改善 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
* [預設情況下，CocoaPods Gradle 外掛程式中的動態框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支援 Xcode 14.1

Kotlin/Native 編譯器現在支援最新的穩定 Xcode 版本 14.1。相容性改進包括以下變更：

* 有一個新的 `watchosDeviceArm64` 預設值，適用於支援 ARM64 平台上 Apple watchOS 的 watchOS 目標。
* 預設情況下，Kotlin CocoaPods Gradle 外掛程式不再具有 Apple 框架的位元碼嵌入。
* 平台程式庫已更新，以反映 Apple 目標的 Objective-C 框架的變更。

### 改善 Objective-C/Swift 互通性

為了使 Kotlin 更容易與 Objective-C 和 Swift 互通，新增了三個新的註解：

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允許您在 Swift 或 Objective-C 中指定更慣用的名稱，而不是重新命名 Kotlin 宣告。

  該註解指示 Kotlin 編譯器對此類別、屬性、參數或函式使用自訂 Objective-C 和 Swift 名稱：

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // Usage with the ObjCName annotations
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允許您從 Objective-C 隱藏 Kotlin 宣告。

  該註解指示 Kotlin 編譯器不要將函式或屬性匯出到 Objective-C，因此也不匯出到 Swift。這可以使您的 Kotlin 程式碼更易於 Objective-C/Swift 使用。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 對於用 Swift 撰寫的包裝函式取代 Kotlin 宣告很有用。

  該註解指示 Kotlin 編譯器在產生的 Objective-C API 中將函式或屬性標記為 `swift_private`。此類宣告會取得 `__` 前綴，這使得它們對 Swift 程式碼不可見。

  您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友善的 API，但例如，Xcode 的自動完成功能不會建議它們。

  有關在 Swift 中精簡 Objective-C 宣告的更多資訊，請參閱[官方 Apple 文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

新的註解需要 [選擇加入](opt-in-requirements)。

:::

Kotlin 團隊非常感謝 [Rick Clephas](https://github.com/rickclephas) 實作這些註解。

### 預設情況下，CocoaPods Gradle 外掛程式中的動態框架

從 Kotlin 1.8.0 開始，由 CocoaPods Gradle 外掛程式註冊的 Kotlin 框架預設會動態連結。先前的靜態實作與 Kotlin Gradle 外掛程式的行為不一致。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // Now dynamic by default
        }
    }
}
```

如果您有具有靜態連結類型的現有專案，並且您升級到 Kotlin 1.8.0 (或明確變更連結類型)，則可能會遇到專案執行錯誤。若要修正此錯誤，請關閉您的 Xcode 專案，然後在 Podfile 目錄中執行 `pod install`。

如需更多資訊，請參閱 [CocoaPods Gradle 外掛程式 DSL 參考](native-cocoapods-dsl-reference)。

## Kotlin Multiplatform：新的 Android 原始碼集佈局

Kotlin 1.8.0 引入了一個新的 Android 原始碼集佈局，取代了先前目錄的命名架構，該架構在多個方面令人困惑。

考慮一個在目前佈局中建立的兩個 `androidTest` 目錄的範例。一個用於 `KotlinSourceSets`，另一個用於 `AndroidSourceSets`：

* 它們具有不同的語意：Kotlin 的 `androidTest` 屬於 `unitTest` 類型，而 Android 的屬於 `integrationTest` 類型。
* 它們建立了一個令人困惑的 `SourceDirectories` 佈局，因為 `src/androidTest/kotlin` 具有 `UnitTest`，而 `src/androidTest/java` 具有 `InstrumentedTest`。
* `KotlinSourceSets` 和 `AndroidSourceSets` 都對 Gradle 設定使用類似的命名架構，因此 Kotlin 和 Android 原始碼集的 `androidTest` 的產生的設定是相同的：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

為了處理這些和其他現有問題，我們引入了一個新的 Android 原始碼集佈局。以下是兩個佈局之間的一些主要差異：

#### KotlinSourceSet 命名架構

| 目前原始碼集佈局              | 新的原始碼集佈局               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 如下列方式對應到 `{KotlinSourceSet.name}`：

|             | 目前原始碼集佈局 | 新的原始碼集佈局          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 目前原始碼集佈局                               | 新的原始碼集佈局                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 該佈局新增了額外的 `/kotlin` SourceDirectories  | `src/{AndroidSourceSet.name}/kotlin`、`src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 如下列方式對應到 `{SourceDirectories included}`：

|             | 目前原始碼集佈局                                  | 新的原始碼集佈局                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 檔案的位置

| 目前原始碼集佈局                              | 新的原始碼集佈局                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` 如下列方式對應到`{AndroidManifest.xml location}`：

|       | 目前原始碼集佈局     | 新的原始碼集佈局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 和通用測試之間的關係

新的 Android 原始碼集佈局變更了 Android instrumentation 測試 (在新佈局中重新命名為 `androidInstrumentedTest`) 和通用測試之間的關係。

先前，`androidAndroidTest` 和 `commonTest` 之間存在預設的 `dependsOn` 關係。實際上，這意味著：

* `commonTest` 中的程式碼在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中具有對應的 `actual` 實作。
* 在 `commonTest` 中宣告的測試也會作為 Android instrumentation 測試執行。

在新的 Android 原始碼集佈局中，預設不會新增 `dependsOn` 關係。如果您喜歡先前的行為，請在您的 `build.gradle.kts` 檔案中手動宣告此關係：

```kotlin
kotlin {
    // ...
    sourceSets {
        val commonTest by getting
        val androidInstrumentedTest by getting {
            dependsOn(commonTest)
        }
    }
}
```

#### 支援 Android 風味

先前，Kotlin Gradle 外掛程式會急切地建立對應於具有 `debug` 和 `release` 建置類型或自訂風味 (例如 `demo` 和 `full`) 的 Android 原始碼集的原始碼集。它使它們可以透過類似 `val androidDebug by getting { ... }` 的建構來存取。

在新的 Android 原始碼集佈局中，這些原始碼集是在 `afterEvaluate` 階段中建立的。這使得此類運算式無效，從而導致類似 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 的錯誤。

若要解決此問題，請在您的 `build.gradle.kts` 檔案中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 設定

新的佈局將在未來版本中成為預設佈局。您現在可以使用下列 Gradle 選項來啟用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

:::note
新的佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並且在 Android Studio 2022.3 及更高版本中支援。

:::

現在不鼓勵使用先前的 Android 樣式目錄。Kotlin 1.8.0 標誌著棄用週期的開始，並引入了對目前佈局的警告。您可以使用下列 Gradle 屬性來隱藏該警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 穩定了 JS IR 編譯器後端，並為與 JavaScript 相關的 Gradle 建置指令碼帶來了新功能：
* [穩定 JS IR 編譯器後端](#stable-js-ir-compiler-backend)
* [用於報告 yarn.lock 已更新的新設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [透過 Gradle 屬性新增瀏覽器的測試目標](#add-test-targets-for-browsers-via-gradle-properties)
* [將 CSS 支援新增到專案的新方法](#new-approach-to-adding-css-support-to-your-project)

### 穩定 JS IR 編譯器後端

從此版本開始，[Kotlin/JS 中繼表示法 (基於 IR 的) 編譯器](js-ir-compiler)後端是 Stable。統一所有三個後端的基礎架構花了一些時間，但它們現在使用相同的 IR 來處理 Kotlin 程式碼。

作為穩定 JS IR 編譯器後端的結果，舊的編譯器現在已被棄用。

增量編譯預設會與穩定 JS IR 編譯器一起啟用。

如果您仍然使用舊的編譯器，請在我們的 [移轉指南](js-ir-migration) 的協助下將您的專案切換到新的後端。

### 用於報告 yarn.lock 已更新的新設定

如果您使用 `yarn` 套件管理員，則有三個新的特殊 Gradle 設定可以在 `yarn.lock` 檔案已更新時通知您。當您想要在 CI 建置過程中靜默變更 `yarn.lock` 時收到通知時，可以使用這些設定。

這三個新的 Gradle 屬性是：

* `YarnLockMismatchReport`，指定如何報告對 `yarn.lock` 檔案的變更。您可以使用下列其中一個值：
    * `FAIL` 會使對應的 Gradle 任務失敗。這是預設值。
    * `WARNING` 會在警告記錄中寫入有關變更的資訊。
    * `NONE` 會停用報告。
* `reportNewYarnLock`，明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項已停用：在第一次啟動時產生新的 `yarn.lock` 檔案是一種常見的做法。您可以使用此選項來確保該檔案已提交到您的儲存庫。
* `yarnLockAutoReplace`，每次執行 Gradle 任務時都會自動取代 `yarn.lock`。

若要使用這些選項，請如下列方式更新您的建置指令碼檔案 `build.gradle.kts`：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) \{
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
\}
```

### 透過 Gradle 屬性新增瀏覽器的測試目標

從 Kotlin 1.8.0 開始，您可以直接在 Gradle 屬性檔案中為不同的瀏覽器設定測試目標。這樣做可以縮小建置指令碼檔案的大小，因為您不再需要在 `build.gradle.kts` 中撰寫所有目標。

您可以使用此屬性來定義所有模組的瀏覽器清單，然後在特定模組的建置指令碼中新增特定瀏覽器。

例如，Gradle 屬性檔案中的下列行將在 Firefox 和 Safari 中執行所有模組的測試：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

請參閱 [GitHub 上屬性的可用值的完整清單](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 團隊非常感謝 [Martynas Petuška](https://github.com/mpetuska) 實作此功能。

### 將 CSS 支援新增到專案的新方法

此版本提供了一種將 CSS 支援新增到專案的新方法。我們假設這會影響許多專案，因此請不要忘記如下所述更新您的 Gradle 建置指令碼檔案。

在 Kotlin 1.8.0 之前，`cssSupport.enabled` 屬性用於新增 CSS 支援：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
}
```

現在您應該在 `cssSupport {}` 區塊中使用 `enabled.set()` 方法：

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

## Gradle

Kotlin 1.8.0 **完全**支援 Gradle 7.2 和 7.3 版本。您也可以使用 Gradle 版本直到最新的 Gradle 版本，但是，如果您這樣做，請記住，您可能會遇到棄用警告，或者某些新的 Gradle 功能可能無法運作。

此版本帶來了許多變更：
* [將 Kotlin 編譯器選項公開為 Gradle 惰性屬性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提高最低支援版本](#bumping-the-minimum-supported-versions)
* [能夠停用 Kotlin 守護程式後援策略](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [在可轉換相依性中使用最新的 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性相等性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [解決 Kotlin Gradle 外掛程式的可轉換相依性](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [棄用和移除](#deprecations-and-removals)

### 將 Kotlin 編譯器選項公開為 Gradle 惰性屬性

為了將可用的 Kotlin 編譯器選項公開為 [Gradle 惰性屬性](https://docs.gradle.org/current/userguide/lazy_configuration.html) 並將它們更好地整合到 Kotlin 任務中，我們進行了許多變更：

* 編譯任務具有新的 `compilerOptions` 輸入，它類似於現有的 `kotlinOptions`，但使用來自 Gradle Properties API 的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作為傳回類型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具任務 `KotlinJsDce` 和 `KotlinNativeLink` 具有新的 `toolOptions` 輸入，它類似於現有的 `kotlinOptions` 輸入。
* 新的輸入具有 [`@Nested` Gradle 註解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。輸入中的每個屬性都具有相關的 Gradle 註解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
* Kotlin Gradle 外掛程式 API 成品具有兩個新的介面：
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 輸入和 `compileOptions()` 方法。所有 Kotlin 編譯任務都實作此介面。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 輸入和 `toolOptions()` 方法。所有 Kotlin 工具任務 (`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`) 都實作此介面。
* 某些 `compilerOptions` 使用新的類型而不是 `String` 類型：
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
      (適用於 `apiVersion` 和 `languageVersion` 輸入)
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，您可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 類型沒有變更，它們會在內部轉換為 `compilerOptions` 類型。
* Kotlin Gradle 外掛程式 API 與先前的版本二進位相容。但是，`kotlin-gradle-plugin` 成品中存在一些原始碼和 ABI 破壞性變更。這些變更大多涉及將額外的泛型參數新增到某些內部類型。一個重要的變更是 `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。
* `KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。

:::note
Kotlin Gradle 外掛程式仍然將 `KotlinJvmOptions` DSL 新增到 Android 擴充功能：

```kotlin
android { 
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

當 `compilerOptions` DSL 將新增到模組層級時，這將在本[此問題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)的範圍內變更。

:::

#### 限制

:::note
`kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在即將發布的版本中棄用。改進將僅針對 `compilerOptions` 和 `toolOptions` 進行。

在 `kotlinOptions` 上呼叫任何 setter 或 getter 會委派給 `compilerOptions` 中的相關屬性。這引入了以下限制：
* 無法在任務執行階段變更 `compilerOptions` 和 `kotlinOptions` (請參閱下文段落中的一個例外)。
* `freeCompilerArgs` 傳回不可變的 `List<String>`，這意味著，例如，`kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。

包括 `kotlin-dsl` 和啟用 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 外掛程式 (AGP) 在內的多個外掛程式嘗試在任務執行階段修改 `freeCompilerArgs` 屬性。我們已在 Kotlin 1.8.0 中為它們新增了一個因應措施。此因應措施允許任何建置指令碼或外掛程式在執行階段修改 `kotlinOptions.freeCompilerArgs`，但在建置記錄中產生警告。若要停用此警告，請使用新的 Gradle 屬性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 將會新增針對 [`kotlin-dsl` 外掛程式](https://github.com/gradle/gradle/issues/22091) 和[啟用 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 的修正。

### 提高最低支援版本

從 Kotlin 1.8.0 開始，最低支援的 Gradle 版本是 6.8.3，最低支援的 Android Gradle 外掛程式版本是 4.1.3。

請參閱 [我們的文件中 Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project#apply-the-plugin)

### 能夠停用 Kotlin 守護程式後援策略

有一個新的 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。當該值為 `false` 時，如果守護程式的啟動或通訊出現問題，建置將會失敗。Kotlin 編譯任務中也有一個新的 `useDaemonFallbackStrategy` 屬性，如果您同時使用兩者，則該屬性會優先於 Gradle 屬性。如果沒有足夠的記憶體來執行編譯，您可以在記錄中看到有關它的訊息。

如果 Kotlin 守護程式以某種方式失敗，Kotlin 編譯器的後援策略是在 Kotlin 守護程式之外執行編譯。如果 Gradle 守護程式已開啟，則編譯器會使用「處理中」策略。如果 Gradle 守護程式已關閉，則編譯器會使用「處理外」策略。如需更多有關這些[文件中執行策略的資訊](gradle-compilation-and-caches#defining-kotlin-compiler-execution-strategy)。請注意，靜默後援到另一種策略可能會消耗大量系統資源或導致不確定的建置；請參閱本[YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)以了解更多詳細資訊。

### 在可轉換相依性中使用最新的 kotlin-stdlib 版本

如果您在您的相依性中明確撰寫 Kotlin 版本 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，則 Kotlin Gradle 外掛程式將會對可轉換的 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 相依性使用該 Kotlin 版本。這樣做的目的是避免來自不同 stdlib 版本的類別重複 (如需更多有關[將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合併到 `kotlin-stdlib`](#updated-jvm-compilation-target)的資訊)。您可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 屬性來停用此行為：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果您遇到版本對齊問題，請透過在您的建置指令碼中宣告對 `kotlin-bom` 的平台相依性，透過 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 來對齊所有版本：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

如需更多有關其他案例和我們建議的解決方案的資訊，請參閱[文件](gradle-configure-project#other-ways-to-align-versions)。

### 強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性

即使您的原始碼檔案僅在 Kotlin 中且您不使用 Java，本節也適用於您的 JVM 專案。

:::

[從此版本開始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，對於 Gradle 8.0+ 上的專案 (此版本的 Gradle 尚未發布)，[`kotlin.jvm.target.validation.mode` 屬性](gradle-configure-project#check-for-jvm-target-compatibility-of-related-compile-tasks)的預設值為 `error`，並且如果 JVM 目標不相容，外掛程式將會使建置失敗。

將預設值從 `warning` 變更為 `error` 是為了順利移轉到 Gradle 8.0 所做的準備步驟。**我們鼓勵您將此屬性設定為 `error`** 並[設定工具鏈](gradle-configure-project#gradle-java-toolchains-support)或手動對齊 JVM 版本。

如需更多有關[如果您不檢查目標的相容性，可能會出現什麼問題的資訊](gradle-configure-project#what-can-go-wrong-if-targets-are-incompatible)。

### 解決 Kotlin Gradle 外掛程式的可轉換相依性

在 Kotlin 1.7.0 中，我們引入了[對 Gradle 外掛程式變體的支援](whatsnew17#support-for-gradle-plugin-variants)。由於這些外掛程式變體，建置類別路徑可以具有不同版本的 [Kotlin Gradle 外掛程式](https://plugins.gradle.org/u/kotlin)，這些外掛程式依賴於某些相依性的不同版本，通常是 `kotlin-gradle-plugin-api`。這可能會導致解決問題，我們想提出以下因應措施，以 `kotlin-dsl` 外掛程式為例。

Gradle 7.6 中的 `kotlin-dsl` 外掛程式依賴於 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 外掛程式，該外掛程式依賴於 `kotlin-gradle-plugin-api:1.7.10`。如果您新增 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 外掛程式，則此 `kotlin-gradle-plugin-api:1.7.10` 可轉換相依性可能會由於版本 (`1.8.0` 和 `1.7.10`) 和變體屬性的 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值之間的不符而導致相依性解決錯誤。作為因應措施，請新增此[約束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)以對齊版本。在我們實作 [Kotlin Gradle 外掛程式程式庫對齊平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) (已在計劃中) 之前，可能需要此因應措施：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-