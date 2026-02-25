[//]: # (title: Kotlin 1.8.0 的新功能)

<web-summary>閱讀 Kotlin 1.8.0 版本說明，內容涵蓋新的語言特性、Kotlin Multiplatform、JVM、Native、JS 的更新，以及 Gradle 和 Maven 的建置工具支援。</web-summary>

_[發布日期：2022 年 12 月 28 日](releases.md#release-history)_

Kotlin 1.8.0 版本已發布，以下是一些重大亮點：

* [適用於 JVM 的新實驗性函式：遞迴複製或刪除目錄內容](#recursive-copying-or-deletion-of-directories)
* [提升 kotlin-reflect 效能](#improved-kotlin-reflect-performance)
* [新的 -Xdebug 編譯器選項，提供更好的偵錯體驗](#a-new-compiler-option-for-disabling-optimizations)
* [`kotlin-stdlib-jdk7` 與 `kotlin-stdlib-jdk8` 已併入 `kotlin-stdlib`](#updated-jvm-compilation-target)
* [提升 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
* [與 Gradle 7.3 相容](#gradle)

> 有關 Kotlin 發布週期的資訊，請參閱 [Kotlin 發布程序](releases.md)。
>
{style="tip"}

## IDE 支援

支援 1.8.0 的 Kotlin 外掛程式適用於：

| IDE            | 支援的版本                          |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 您可以在 IntelliJ IDEA 2022.3 中將專案更新至 Kotlin 1.8.0，而無需更新 IDE 外掛程式。
>
> 若要在 IntelliJ IDEA 2022.3 中將現有專案遷移至 Kotlin 1.8.0，請將 Kotlin 版本更改為 `1.8.0` 並重新匯入您的 Gradle 或 Maven 專案。
>
{style="note"}

## Kotlin/JVM

從 1.8.0 版本開始，編譯器可以產生對應於 JVM 19 位元組碼版本的類別。新的語言版本還包括：

* [用於關閉產生 JVM 註解目標的編譯器選項](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
* [用於停用最佳化以便偵錯的新 `-Xdebug` 編譯器選項](#a-new-compiler-option-for-disabling-optimizations)
* [移除舊版後端](#removal-of-the-old-backend)
* [支援 Lombok 的 @Builder 註解](#support-for-lombok-s-builder-annotation)

### 能夠不產生 TYPE_USE 和 TYPE_PARAMETER 註解目標

如果 Kotlin 註解的 Kotlin 目標中包含 `TYPE`，則該註解會在其 Java 註解目標清單中對應到 `java.lang.annotation.ElementType.TYPE_USE`。這就像 `TYPE_PARAMETER` Kotlin 目標對應到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。對於 API 層級低於 26 的 Android 用戶端來說，這是一個問題，因為這些目標在 API 中並不存在。

從 Kotlin 1.8.0 開始，您可以使用新的編譯器選項 `-Xno-new-java-annotation-targets` 來避免產生 `TYPE_USE` 與 `TYPE_PARAMETER` 註解目標。

### 用於停用最佳化的新編譯器選項

Kotlin 1.8.0 加入了新的 `-Xdebug` 編譯器選項，它可以停用最佳化以提供更好的偵錯體驗。目前，該選項會停用協同程式的「已最佳化（was optimized out）」功能。未來，在我們加入更多最佳化後，此選項也將一併停用它們。

當您使用掛起函式時，「已最佳化（was optimized out）」功能會最佳化變數。然而，偵錯具有最佳化變數的程式碼非常困難，因為您看不到它們的值。

> **切勿在生產環境中使用此選項**：透過 `-Xdebug` 停用此功能可能會[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 移除舊版後端

在 Kotlin 1.5.0 中，我們[宣布](whatsnew15.md#stable-jvm-ir-backend)以 IR 為基礎的後端已達到[穩定版](components-stability.md)。這意味著來自 Kotlin 1.4.* 的舊版後端已被棄用。在 Kotlin 1.8.0 中，我們已完全移除舊版後端。因此，我們也移除了編譯器選項 `-Xuse-old-backend` 與 Gradle 選項 `useOldBackend`。

### 支援 Lombok 的 @Builder 註解

社群為 [Kotlin Lombok: Support generated builders (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) 這個 YouTrack 問題投下了大量票數，因此我們決定支援 [@Builder 註解](https://projectlombok.org/features/Builder)。

我們目前尚無支援 `@SuperBuilder` 或 `@Tolerate` 註解的計畫，但如果有足夠的人為 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 問題投票，我們會重新考慮。

[了解如何配置 Lombok 編譯器外掛程式](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包含對 Objective-C 和 Swift 互通性的更改、對 Xcode 14.1 的支援，以及對 CocoaPods Gradle 外掛程式的改進：

* [支援 Xcode 14.1](#support-for-xcode-14-1)
* [提升 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
* [CocoaPods Gradle 外掛程式預設使用動態框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支援 Xcode 14.1

Kotlin/Native 編譯器現在支援最新的穩定 Xcode 版本 14.1。相容性改進包括以下更改：

* 為 watchOS 目標新增了 `watchosDeviceArm64` 預設設定，支援在 ARM64 平台上執行 Apple watchOS。
* Kotlin CocoaPods Gradle 外掛程式現在預設不再為 Apple 架構嵌入 bitcode。
* 更新了平台程式庫，以反映 Apple 目標中 Objective-C 架構的更改。

### 提升 Objective-C/Swift 互通性

為了讓 Kotlin 與 Objective-C 和 Swift 之間更具互通性，新增了三個註解：

* [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允許您在 Swift 或 Objective-C 中指定更具慣用性的名稱，而無需重新命名 Kotlin 宣告。

  此註解指示 Kotlin 編譯器為此類別、屬性、參數或函式使用自訂的 Objective-C 和 Swift 名稱：

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // 配合 ObjCName 註解的使用方式
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

* [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允許您對 Objective-C 隱藏 Kotlin 宣告。

  此註解指示 Kotlin 編譯器不要將函式或屬性匯出到 Objective-C，進而也不會匯出到 Swift。這可以讓您的 Kotlin 程式碼對 Objective-C/Swift 更友善。

* [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 用於將 Kotlin 宣告替換為以 Swift 編寫的包裝函式。

  此註解指示 Kotlin 編譯器在產生的 Objective-C API 中將函式或屬性標記為 `swift_private`。此類宣告會獲得 `__` 前綴，使其對 Swift 程式碼不可見。

  您仍可以在 Swift 程式碼中使用這些宣告來建立 Swift 友善的 API，但例如 Xcode 的自動補全將不會建議它們。

  有關在 Swift 中細化 Objective-C 宣告的更多資訊，請參閱 [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 使用這些新註解需要[選擇加入（opt-in）](opt-in-requirements.md)。
>
{style="note"}

Kotlin 團隊非常感謝 [Rick Clephas](https://github.com/rickclephas) 實作了這些註解。

### CocoaPods Gradle 外掛程式預設使用動態框架

從 Kotlin 1.8.0 開始，由 CocoaPods Gradle 外掛程式註冊的 Kotlin 架構預設為動態連結。先前的靜態實作與 Kotlin Gradle 外掛程式的行為不一致。

```kotlin
kotlin {
    cocoapods {
        framework {
            baseName = "MyFramework"
            isStatic = false // 現在預設為動態
        }
    }
}
```

如果您現有的專案使用靜態連結類型，並升級到 Kotlin 1.8.0（或明確更改連結類型），您在執行專案時可能會遇到錯誤。要修復此問題，請關閉您的 Xcode 專案，並在 Podfile 目錄中執行 `pod install`。

如需更多資訊，請參閱 [CocoaPods Gradle 外掛程式 DSL 參考](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin Multiplatform：新的 Android 原始碼集佈局

Kotlin 1.8.0 引入了新的 Android 原始碼集佈局，以取代先前的目錄命名架構，後者在多方面都令人混淆。

考慮目前佈局中建立兩個 `androidTest` 目錄的範例。一個用於 `KotlinSourceSets`，另一個用於 `AndroidSourceSets`：

* 它們具有不同的語意：Kotlin 的 `androidTest` 屬於 `unitTest` 類型，而 Android 的則屬於 `integrationTest` 類型。
* 它們建立了令人混淆的 `SourceDirectories` 佈局，因為 `src/androidTest/kotlin` 包含 `UnitTest` 而 `src/androidTest/java` 包含 `InstrumentedTest`。
* `KotlinSourceSets` 和 `AndroidSourceSets` 都為 Gradle 配置使用類似的命名架構，因此 Kotlin 和 Android 原始碼集的 `androidTest` 最終配置是相同的：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

為了解決這些及其他現有問題，我們引入了新的 Android 原始碼集佈局。以下是兩種佈局之間的一些關鍵差異：

#### KotlinSourceSet 命名架構

| 目前原始碼集佈局            | 新原始碼集佈局               |
|----------------------------|----------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 與 `{KotlinSourceSet.name}` 的對應關係如下：

|             | 目前原始碼集佈局           | 新原始碼集佈局                 |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android<b>Unit</b>Test         |
| androidTest | android<b>Android</b>Test | android<b>Instrumented</b>Test |

#### SourceDirectories

| 目前原始碼集佈局                                         | 新原始碼集佈局                                                               |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 佈局會增加額外的 `/kotlin` SourceDirectories            | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 與 `{包含的 SourceDirectories}` 的對應關係如下：

|             | 目前原始碼集佈局                                           | 新原始碼集佈局                                                                                  |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android<b>Unit</b>Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android<b>Android</b>Test/kotlin, src/androidTest/java | src/android<b>Instrumented</b>Test/kotlin, src/androidTest/java, <b>src/androidTest/kotlin</b> |

#### AndroidManifest.xml 檔案的位置

| 目前原始碼集佈局                                         | 新原始碼集佈局                                         |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{<b>Android</b>SourceSet.name}/AndroidManifest.xml | src/{<b>Kotlin</b>SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 與 `{AndroidManifest.xml 位置}` 的對應關係如下：

|       | 目前原始碼集佈局               | 新原始碼集佈局                              |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/<b>android</b>Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/<b>android</b>Debug/AndroidManifest.xml |

#### Android 測試與共通測試之間的關係

新的 Android 原始碼集佈局改變了 Android 檢測測試（在佈局中重新命名為 `androidInstrumentedTest`）與共通測試（common tests）之間的關係。

先前，`androidAndroidTest` 與 `commonTest` 之間預設存在 `dependsOn` 關係。在實務上，這意味著：

* `commonTest` 中的程式碼在 `androidAndroidTest` 中可用。
* `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中有對應的 `actual` 實作。
* 在 `commonTest` 中宣告的測試也會作為 Android 檢測測試執行。

在新的 Android 原始碼集佈局中，預設不會加入 `dependsOn` 關係。如果您偏好先前的行為，請在您的 `build.gradle.kts` 檔案中手動宣告此關係：

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

#### 支援 Android flavor

先前，Kotlin Gradle 外掛程式會預先建立對應於具備 `debug` 和 `release` 建置類型或自訂變體（flavor，如 `demo` 和 `full`）的 Android 原始碼集。這使得它們可以透過 `val androidDebug by getting { ... }` 之類的結構存取。

在新的 Android 原始碼集佈局中，這些原始碼集是在 `afterEvaluate` 階段建立的。這使得此類運算式失效，導致出現 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 等錯誤。

要解決此問題，請在您的 `build.gradle.kts` 檔案中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置與設定

新佈局將在未來的版本中成為預設設定。您現在可以透過以下 Gradle 選項啟用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並且 Android Studio 2022.3 或更高版本支援。
>
{style="note"}

現在不建議使用先前的 Android 風格目錄。Kotlin 1.8.0 標誌著棄用週期的開始，並為目前佈局引入了警告。您可以使用以下 Gradle 屬性隱藏該警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 使 JS IR 編譯器後端達到穩定版，並為 JavaScript 相關的 Gradle 建置腳本帶來了新功能：
* [穩定的 JS IR 編譯器後端](#stable-js-ir-compiler-backend)
* [報告 yarn.lock 已更新的新設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
* [透過 Gradle 屬性為瀏覽器加入測試目標](#add-test-targets-for-browsers-via-gradle-properties)
* [為專案加入 CSS 支援的新方法](#new-approach-to-adding-css-support-to-your-project)

### 穩定的 JS IR 編譯器後端

從此版本開始，[Kotlin/JS 中間表示（以 IR 為基礎）編譯器](js-ir-compiler.md)後端已達到穩定版（Stable）。統一所有三個後端的基礎結構花了一些時間，但現在它們都使用相同的 IR 處理 Kotlin 程式碼。

由於 JS IR 編譯器後端已穩定，舊版後端從現在起已被棄用。

增量編譯（incremental compilation）預設隨穩定的 JS IR 編譯器一同啟用。

如果您仍在使用舊版編譯器，請將您的專案切換到新後端。

### 報告 yarn.lock 已更新的新設定

如果您使用 `yarn` 封裝管理員，有三個新的特殊 Gradle 設定可以在 `yarn.lock` 檔案更新時通知您。當您希望在 CI 建置過程中獲知 `yarn.lock` 是否被靜默更改時，可以使用這些設定。

這三個新的 Gradle 屬性是：

* `YarnLockMismatchReport`：指定如何報告 `yarn.lock` 檔案的變更。您可以使用以下值之一：
    * `FAIL`：使對應的 Gradle 任務失敗。這是預設值。
    * `WARNING`：在警告日誌中寫入變更資訊。
    * `NONE`：停用報告。
* `reportNewYarnLock`：明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項是停用的：在首次啟動時產生新的 `yarn.lock` 檔案是常見做法。您可以使用此選項來確保該檔案已提交到您的存儲庫。
* `yarnLockAutoReplace`：每次執行 Gradle 任務時自動替換 `yarn.lock`。

要使用這些選項，請按照以下方式更新您的建置腳本檔案 `build.gradle.kts`：

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

### 透過 Gradle 屬性為瀏覽器加入測試目標

從 Kotlin 1.8.0 開始，您可以直接在 Gradle 屬性檔案中為不同瀏覽器設定測試目標。這樣做可以縮減建置腳本檔案的大小，因為您不再需要在 `build.gradle.kts` 中編寫所有目標。

您可以使用此屬性為所有模組定義瀏覽器清單，然後在特定模組的建置腳本中加入特定瀏覽器。

例如，在您的 Gradle 屬性檔案中加入以下行，將會在 Firefox 和 Safari 中為所有模組執行測試：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

請參閱 [GitHub 上該屬性可用值的完整清單](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 團隊非常感謝 [Martynas Petuška](https://github.com/mpetuska) 實作了此功能。

### 為專案加入 CSS 支援的新方法

此版本提供了一種為專案加入 CSS 支援的新方法。我們預期這會影響許多專案，因此請務必按照下述說明更新您的 Gradle 建置腳本檔案。

在 Kotlin 1.8.0 之前，使用 `cssSupport.enabled` 屬性來加入 CSS 支援：

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

Kotlin 1.8.0 **完全**支援 Gradle 版本 7.2 和 7.3。您也可以使用到最新發布版本為止的 Gradle 版本，但如果這麼做，請注意您可能會遇到棄用警告，或者某些新的 Gradle 功能可能無法運作。

此版本帶來了許多變更：
* [將 Kotlin 編譯器選項公開為 Gradle 延遲屬性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
* [提高最低支援版本](#bumping-the-minimum-supported-versions)
* [能夠停用 Kotlin 精靈程序回退策略](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
* [在傳遞相依性中使用最新的 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
* [強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性一致性](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
* [Kotlin Gradle 外掛程式傳遞相依性的解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
* [棄用與移除](#deprecations-and-removals)

### 將 Kotlin 編譯器選項公開為 Gradle 延遲屬性

為了將可用的 Kotlin 編譯器選項公開為 [Gradle 延遲屬性（lazy properties）](https://docs.gradle.org/current/userguide/lazy_configuration.html) 並使其更好地整合到 Kotlin 任務中，我們進行了許多變更：

* 編譯任務具有新的 `compilerOptions` 輸入，它與現有的 `kotlinOptions` 類似，但使用來自 Gradle Properties API 的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作為傳回型別：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

* Kotlin 工具任務 `KotlinJsDce` 與 `KotlinNativeLink` 具有新的 `toolOptions` 輸入，這與現有的 `kotlinOptions` 輸入類似。
* 新輸入具有 [`@Nested` Gradle 註解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。輸入內部的每個屬性都有相關的 Gradle 註解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
* Kotlin Gradle 外掛程式 API 構件有兩個新介面：
    * `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`：具有 `compilerOptions` 輸入與 `compileOptions()` 方法。所有 Kotlin 編譯任務都實作此介面。
    * `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`：具有 `toolOptions` 輸入與 `toolOptions()` 方法。所有 Kotlin 工具任務（`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`）都實作此介面。
* 部分 `compilerOptions` 使用新類型而非 `String` 類型：
    * [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    * [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)（用於 `apiVersion` 和 `languageVersion` 輸入）
    * [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    * [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    * [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，您可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 代替 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 類型沒有改變，它們在內部會被轉換為 `compilerOptions` 類型。
* Kotlin Gradle 外掛程式 API 與先前版本保持二進位碼相容。然而，`kotlin-gradle-plugin` 構件中存在一些源碼和 ABI 破壞性變更。這些變更大多涉及某些內部類型增加的泛型參數。一個重要的變化是 `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。
* `KotlinJsCompilerOptions.outputFile` 及相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。

> Kotlin Gradle 外掛程式仍將 `KotlinJvmOptions` DSL 加入 Android 擴充：
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 這將在 [此問題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options) 的範圍內進行更改，屆時 `compilerOptions` DSL 將被加入到模組層級。
>
{style="note"}

#### 限制

> `kotlinOptions` 任務輸入與 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在未來的版本中棄用。改進將僅針對 `compilerOptions` 與 `toolOptions` 進行。
>
{style="warning"}

在 `kotlinOptions` 上呼叫任何 setter 或 getter 都會委派給 `compilerOptions` 中的相關屬性。這引入了以下限制：
* `compilerOptions` 與 `kotlinOptions` 不能在任務執行階段更改（請參閱下段中的一個例外情況）。
* `freeCompilerArgs` 傳回一個不可變的 `List<String>`，這意味著例如 `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。

多個外掛程式，包括 `kotlin-dsl` 以及啟用了 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 外掛程式 (AGP)，會嘗試在任務執行階段修改 `freeCompilerArgs` 屬性。我們在 Kotlin 1.8.0 中為它們加入了一個臨時解決方案（workaround）。此解決方案允許任何建置腳本或外掛程式在執行階段修改 `kotlinOptions.freeCompilerArgs`，但在建置日誌中會產生警告。要停用此警告，請使用新的 Gradle 屬性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 將為 [`kotlin-dsl` 外掛程式](https://github.com/gradle/gradle/issues/22091) 和 [啟用了 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 加入修復。

### 提高最低支援版本

從 Kotlin 1.8.0 開始，最低支援的 Gradle 版本為 6.8.3，最低支援的 Android Gradle 外掛程式版本為 4.1.3。

請參閱我們文件中的 [Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### 能夠停用 Kotlin 精靈程序回退策略

新增了一個 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。當值為 `false` 時，如果精靈程序（daemon）的啟動或通訊出現問題，建置將會失敗。Kotlin 編譯任務中也有一個新的 `useDaemonFallbackStrategy` 屬性，如果您同時使用兩者，它比 Gradle 屬性具有更高優先級。如果記憶體不足以執行編譯，您可以在日誌中看到相關訊息。

Kotlin 編譯器的回退策略是，如果精靈程序因故失敗，則在精靈程序之外執行編譯。如果 Gradle 精靈程序已開啟，編譯器使用「進程內（In process）」策略。如果 Gradle 精靈程序已關閉，編譯器使用「進程外（Out of process）」策略。如需更多資訊，請參閱文件中的[執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。請注意，靜默回退到另一種策略可能會消耗大量系統資源或導致非決定性的建置；詳情請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在傳遞相依性中使用最新的 kotlin-stdlib 版本

如果您在相依性中明確編寫 Kotlin 版本 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那麼 Kotlin Gradle 外掛程式將為傳遞相依性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 使用該 Kotlin 版本。這樣做是為了避免來自不同 stdlib 版本的類別重複（進一步了解[將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 併入 `kotlin-stdlib`](#updated-jvm-compilation-target)）。您可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 屬性停用此行為：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果您遇到版本對齊問題，請透過 Kotlin [BOM (物料清單)](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 對齊所有版本，方法是在建置腳本中宣告對 `kotlin-bom` 的平台相依性：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

在[文件](gradle-configure-project.md#other-ways-to-align-versions)中了解其他案例及我們建議的解決方案。

### 強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性

> 本節適用於您的 JVM 專案，即使您的源碼檔案僅使用 Kotlin 且不使用 Java。
>
{style="note"}

[從此版本開始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，對於 Gradle 8.0+（此版本的 Gradle 尚未發布）上的專案，[`kotlin.jvm.target.validation.mode` 屬性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks) 的預設值為 `error`，如果 JVM 目標不相容，外掛程式將導致建置失敗。

預設值從 `warning` 轉變為 `error` 是為了能順利遷移到 Gradle 8.0。**我們建議您將此屬性設為 `error`** 並 [配置工具鏈](gradle-configure-project.md#gradle-java-toolchains-support) 或手動對齊 JVM 版本。

進一步了解 [如果您不檢查目標相容性可能會出什麼問題](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### Kotlin Gradle 外掛程式傳遞相依性的解析

在 Kotlin 1.7.0 中，我們引入了[對 Gradle 外掛程式變體的支援](whatsnew17.md#support-for-gradle-plugin-variants)。由於這些外掛程式變體，建置類別路徑（build classpath）可能會擁有不同版本的 [Kotlin Gradle 外掛程式](https://plugins.gradle.org/u/kotlin)，而這些外掛程式相依於某些相依性的不同版本，通常是 `kotlin-gradle-plugin-api`。這可能導致解析問題，我們建議採用以下臨時解決方案，以 `kotlin-dsl` 外掛程式為例。

Gradle 7.6 中的 `kotlin-dsl` 外掛程式相依於 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 外掛程式，後者相依於 `kotlin-gradle-plugin-api:1.7.10`。如果您加入 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 外掛程式，此 `kotlin-gradle-plugin-api:1.7.10` 傳遞相依性可能會因為版本不相符（`1.8.0` 與 `1.7.10`）以及變體屬性 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 的值不一致而導致相依性解析錯誤。作為臨時解決方案，請加入此 [約束（constraint）](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps) 以對齊版本。此解決方案可能需要使用到我們實作了 [Kotlin Gradle 外掛程式庫對齊平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform) 為止（該平台已在計劃中）：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此約束強制在建置類別路徑中為傳遞相依性使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本。在 [Gradle 問題追蹤器](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298) 中了解一個類似的案例。

### 棄用與移除

在 Kotlin 1.8.0 中，以下屬性與方法的棄用週期仍在繼續：

* [Kotlin 1.7.0 的說明](whatsnew17.md#changes-in-compile-tasks)中提到 `KotlinCompile` 任務仍具有棄用的 Kotlin 屬性 `classpath`，該屬性將在未來版本中移除。現在，我們已將 `KotlinCompile` 任務的 `classpath` 屬性的棄用層級更改為 `error`。所有編譯任務都使用 `libraries` 輸入作為編譯所需的程式庫清單。
* 我們移除了 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 [kapt](kapt.md)。預設情況下，自 Kotlin 1.3.70 起 [kapt 已一直在使用 Gradle 背景工作執行緒](kapt.md#run-kapt-tasks-in-parallel)，我們建議堅持使用此方法。
* 在 Kotlin 1.7.0 中，我們[宣布開始棄用 `kotlin.compiler.execution.strategy` 屬性](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。在此版本中，我們移除了此屬性。了解如何以其他方式[定義 Kotlin 編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 標準函式庫

Kotlin 1.8.0：
* 更新了 [JVM 編譯目標](#updated-jvm-compilation-target)。
* 穩定了許多函式 —— [Java 與 Kotlin 之間的 TimeUnit 轉換](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 擴充函式](#java-optionals-extension-functions)。
* 提供可比較與可相減 `TimeMarks` 的[預覽](#comparable-and-subtractable-timemarks)。
* 包含 [適用於 `java.nio.file.path` 的實驗性擴充函式](#recursive-copying-or-deletion-of-directories)。
* 展現了[提升後的 kotlin-reflect 效能](#improved-kotlin-reflect-performance)。

### 更新了 JVM 編譯目標

在 Kotlin 1.8.0 中，標準函式庫（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）是使用 JVM 目標 1.8 編譯的。先前，標準函式庫是使用 JVM 目標 1.6 編譯的。

Kotlin 1.8.0 不再支援 JVM 目標 1.6 和 1.7。因此，您不再需要在建置腳本中分別宣告 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，因為這些構件的內容已併入 `kotlin-stdlib`。

> 如果您在建置腳本中已明確將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 宣告為相依性，則應將它們替換為 `kotlin-stdlib`。
>
{style="note"}

請注意，混合不同版本的 stdlib 構件可能會導致類別重複或遺失類別。為了避免這種情況，Kotlin Gradle 外掛程式可以幫助您[對齊 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

### cbrt()

`cbrt()` 函式現在已達到穩定版，它允許您計算 `double` 或 `float` 的實數立方根。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("${num.toDouble()} 的立方根為： " +
            cbrt(num.toDouble()))
    println("${negNum.toDouble()} 的立方根為： " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java 與 Kotlin 之間的 TimeUnit 轉換

`kotlin.time` 中的 `toTimeUnit()` 與 `toDurationUnit()` 函式現在已達到穩定版。這些函式在 Kotlin 1.6.0 中作為實驗性引入，改進了 Kotlin 與 Java 之間的互通性。您現在可以輕鬆地在 Java 的 `java.util.concurrent.TimeUnit` 與 Kotlin 的 `kotlin.time.DurationUnit` 之間進行轉換。這些函式僅在 JVM 上受支援。

```kotlin
import kotlin.time.*

// 供 Java 使用
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比較與可相減的 TimeMarks

> `TimeMarks` 的新功能是 [實驗性的](components-stability.md#stability-levels-explained)，要使用它，您需要透過 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 進行選擇加入。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果您想計算多個 `TimeMarks` 與 **現在（now）** 之間的時間差，您一次只能在一個 `TimeMark` 上呼叫 `elapsedNow()`。這使得比較結果變得困難，因為兩次 `elapsedNow()` 函式呼叫無法在完全相同的時間執行。

為了解決這個問題，在 Kotlin 1.8.0 中，您可以對來自相同時間源的 `TimeMarks` 進行相減和比較。現在您可以建立一個新的 `TimeMark` 執行個體來代表 **現在（now）**，並從中減去其他的 `TimeMarks`。這樣，您從這些計算中收集到的結果保證是彼此相對的。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 睡眠 0.5 秒
    val mark2 = timeSource.markNow()

    // 在 1.8.0 之前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // elapsed1 和 elapsed2 之間的差異可能會根據 
        // 兩次 elapsedNow() 呼叫之間經過的時間而有所不同
        println("測量 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 自 1.8.0 起
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // 現在耗時是相對於固定值 mark3 計算的
        println("測量 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以互相比較時間標記
    // 這是 true，因為 mark2 是在 mark1 之後擷取的
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

這種新功能在動畫計算中特別有用，因為您可能想計算代表不同影格的多個 `TimeMarks` 之間的差異或進行比較。

### 遞迴複製或刪除目錄內容

> 這些適用於 `java.nio.file.path` 的新函式是 [實驗性的](components-stability.md#stability-levels-explained)。要使用它們，您需要透過 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 選擇加入。或者，您可以使用編譯器選項 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我們為 `java.nio.file.Path` 引入了兩個新的擴充函式：`copyToRecursively()` 與 `deleteRecursively()`，它們允許您遞迴地執行以下操作：

* 將目錄及其內容複製到另一個目的地。
* 刪除目錄及其內容。

這些函式作為備份程序的一部分非常有用。

#### 錯誤處理

使用 `copyToRecursively()` 時，您可以透過多載 `onError` Lambda 函式來定義複製過程中發生例外時應採取的動作：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "無法將 $source 複製到 $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

當您使用 `deleteRecursively()` 時，如果在刪除檔案或資料夾時發生例外，則該檔案或資料夾會被跳過。刪除完成後，`deleteRecursively()` 會拋出一個 `IOException`，其中包含所有發生的例外作為被抑制的例外（suppressed exceptions）。

#### 檔案覆寫

如果 `copyToRecursively()` 發現目的地目錄中已存在某個檔案，則會發生例外。如果您想改為覆寫該檔案，請使用將 `overwrite` 作為引數的多載版本並將其設為 `true`：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 修補共通夾具
}
```
{validate="false"}

#### 自訂複製動作

要為複製定義您自己的自訂邏輯，請使用將 `copyAction` 作為額外引數的多載版本。透過使用 `copyAction`，您可以提供一個 Lambda 函式，例如包含您偏好的動作：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false) { source, target ->
    if (source.name.startsWith(".")) {
        CopyActionResult.SKIP_SUBTREE
    } else {
        source.copyToIgnoringExistingDirectory(target, followLinks = false)
        CopyActionResult.CONTINUE
    }
}
```
{validate="false"}

有關這些擴充函式的更多資訊，請參閱 [我們的 API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)。

### Java Optionals 擴充函式

在 [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) 中引入的擴充函式現在已達到穩定版。這些函式簡化了在 Java 中處理 Optional 類別的工作。它們可用於在 JVM 上解包並轉換 `Optional` 物件，並使處理 Java API 的過程更加簡潔。如需更多資訊，請參閱 [Kotlin 1.7.0 的新功能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 提升 kotlin-reflect 效能

利用 `kotlin-reflect` 現在使用 JVM 目標 1.8 編譯的優勢，我們將內部快取機制遷移到了 Java 的 `ClassValue`。先前我們僅快取 `KClass`，但現在我們也會快取 `KType` 與 `KDeclarationContainer`。這些更改在呼叫 `typeOf()` 時顯著提升了效能。

## 文件更新

Kotlin 文件進行了一些值得注意的更改：

### 翻新與新增的頁面

* [Gradle 總覽](gradle.md) —— 了解如何使用 Gradle 建置系統配置和建置 Kotlin 專案、可用的編譯器選項、編譯以及 Kotlin Gradle 外掛程式中的快取。
* [Java 與 Kotlin 中的可為 Null 性](java-to-kotlin-nullability-guide.md) —— 查看 Java 與 Kotlin 處理可能為 null 變數之方法的差異。
* [Lincheck 指南](lincheck-guide.md) —— 了解如何設定並使用 Lincheck 架構來測試 JVM 上的並行演算法。

### 新增與更新的教學

* [Gradle 與 Kotlin/JVM 快速入門](get-started-with-jvm-gradle-project.md) —— 使用 IntelliJ IDEA 和 Gradle 建立一個主控台應用程式。
* [使用 Ktor 與 SQLDelight 建立多平台應用程式](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html) —— 使用 Kotlin Multiplatform Mobile 為 iOS 和 Android 建立行動應用程式。
* [Kotlin Multiplatform 快速入門](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html) —— 了解使用 Kotlin 進行跨平台行動開發，並建立一個可在 Android 和 iOS 上運行的應用程式。

## 安裝 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 會自動建議將 Kotlin 外掛程式更新至版本 1.8.0。IntelliJ IDEA 2022.3 將在即將發布的次要更新中內建 1.8.0 版本的 Kotlin 外掛程式。

> 若要在 IntelliJ IDEA 2022.3 中將現有專案遷移至 Kotlin 1.8.0，請將 Kotlin 版本更改為 `1.8.0` 並重新匯入您的 Gradle 或 Maven 專案。
>
{style="note"}

對於 Android Studio Electric Eel (221) 和 Flamingo (222)，Kotlin 外掛程式的 1.8.0 版本將隨即將到來的 Android Studio 更新一同提供。新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0) 下載。

## Kotlin 1.8.0 相容性指南

Kotlin 1.8.0 是一個[特性版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能會帶來與您為該語言早期版本編寫的程式碼不相容的變更。在 [Kotlin 1.8.0 相容性指南](compatibility-guide-18.md) 中可以找到這些變更的詳細清單。