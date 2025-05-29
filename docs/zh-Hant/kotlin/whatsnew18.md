[//]: # (title: Kotlin 1.8.0 的新功能)

_[發佈日期：2022 年 12 月 28 日](releases.md#release-details)_

Kotlin 1.8.0 版本已發佈，以下是其中一些主要亮點：

*   [JVM 新增實驗性函數：遞迴複製或刪除目錄內容](#recursive-copying-or-deletion-of-directories)
*   [改進 `kotlin-reflect` 效能](#improved-kotlin-reflect-performance)
*   [新增 `-Xdebug` 編譯器選項，改善偵錯體驗](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7` 與 `kotlin-stdlib-jdk8` 合併至 `kotlin-stdlib`](#updated-jvm-compilation-target)
*   [改進 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
*   [相容於 Gradle 7.3](#gradle)

## IDE 支援

支援 1.8.0 的 Kotlin 外掛程式適用於：

| IDE            | 支援版本                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 您可以在 IntelliJ IDEA 2022.3 中將專案更新至 Kotlin 1.8.0，而無需更新 IDE 外掛程式。
>
> 要將現有專案遷移至 IntelliJ IDEA 2022.3 中的 Kotlin 1.8.0，請將 Kotlin 版本更改為 `1.8.0` 並重新匯入您的 Gradle 或 Maven 專案。
>
{style="note"}

## Kotlin/JVM

從 1.8.0 版本開始，編譯器可以生成與 JVM 19 位元碼版本相對應的類別。新語言版本還包括：

*   [一個編譯器選項，用於關閉 JVM 註解目標的生成](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [一個新的 `-Xdebug` 編譯器選項，用於禁用最佳化](#a-new-compiler-option-for-disabling-optimizations)
*   [移除舊後端](#removal-of-the-old-backend)
*   [支援 Lombok 的 @Builder 註解](#support-for-lombok-s-builder-annotation)

### 能夠不生成 TYPE_USE 和 TYPE_PARAMETER 註解目標

如果 Kotlin 註解在其 Kotlin 目標中包含 `TYPE`，則該註解會在其 Java 註解目標列表中對應到 `java.lang.annotation.ElementType.TYPE_USE`。這就像 `TYPE_PARAMETER` Kotlin 目標對應到 `java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。這對於 API 等級低於 26 的 Android 用戶端來說是一個問題，因為這些 API 中不包含這些目標。

從 Kotlin 1.8.0 開始，您可以使用新的編譯器選項 `-Xno-new-java-annotation-targets` 來避免生成 `TYPE_USE` 和 `TYPE_PARAMETER` 註解目標。

### 一個新的編譯器選項，用於禁用最佳化

Kotlin 1.8.0 新增了一個新的 `-Xdebug` 編譯器選項，它可以禁用最佳化以提供更好的偵錯體驗。目前，該選項會禁用協程的「was optimized out (已最佳化)」功能。未來，在我們新增更多最佳化後，此選項也將禁用它們。

「was optimized out (已最佳化)」功能在使用 suspend 函數時會最佳化變數。然而，偵錯帶有已最佳化變數的程式碼很困難，因為您看不到它們的值。

> **切勿在生產環境中使用此選項**：透過 `-Xdebug` 禁用此功能可能[導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 移除舊後端

在 Kotlin 1.5.0 中，我們[宣布](whatsnew15.md#stable-jvm-ir-backend)基於 IR 的後端已成為[穩定版本](components-stability.md)。這表示 Kotlin 1.4.* 的舊後端已被棄用。在 Kotlin 1.8.0 中，我們已完全移除舊後端。因此，我們已移除編譯器選項 `-Xuse-old-backend` 和 Gradle `useOldBackend` 選項。

### 支援 Lombok 的 @Builder 註解

社群為 [Kotlin Lombok: 支援生成的 Builder (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959) YouTrack 問題增加了如此多的投票，我們不得不支援 [@Builder 註解](https://projectlombok.org/features/Builder)。

我們目前還沒有支援 `@SuperBuilder` 或 `@Tolerate` 註解的計畫，但如果足夠多的人投票支援 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和 [@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 問題，我們將重新考慮。

[了解如何配置 Lombok 編譯器外掛程式](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包含了對 Objective-C 和 Swift 互通性的更改，支援 Xcode 14.1，以及對 CocoaPods Gradle 外掛程式的改進：

*   [支援 Xcode 14.1](#support-for-xcode-14-1)
*   [改進 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradle 外掛程式預設使用動態框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支援 Xcode 14.1

Kotlin/Native 編譯器現在支援最新的穩定 Xcode 版本 14.1。相容性改進包括以下更改：

*   watchOS 目標新增了一個 `watchosDeviceArm64` 預設配置，支援 ARM64 平台上的 Apple watchOS。
*   Kotlin CocoaPods Gradle 外掛程式預設不再為 Apple 框架內嵌位元碼 (bitcode)。
*   平台函式庫已更新，以反映 Apple 目標的 Objective-C 框架的變更。

### 改進 Objective-C/Swift 互通性

為了讓 Kotlin 與 Objective-C 和 Swift 更好地互通，新增了三個註解：

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允許您在 Swift 或 Objective-C 中指定一個更符合慣用語法的名稱，而不是重新命名 Kotlin 宣告。

    該註解指示 Kotlin 編譯器為此類別、屬性、參數或函數使用自訂的 Objective-C 和 Swift 名稱：

   ```kotlin
   @ObjCName(swiftName = "MySwiftArray")
   class MyKotlinArray {
       @ObjCName("index")
       fun indexOf(@ObjCName("of") element: String): Int = TODO()
   }

   // 使用 ObjCName 註解的範例
   let array = MySwiftArray()
   let index = array.index(of: "element")
   ```

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允許您從 Objective-C 中隱藏一個 Kotlin 宣告。

    該註解指示 Kotlin 編譯器不將函數或屬性匯出到 Objective-C，因此也無法匯出到 Swift。這可以使您的 Kotlin 程式碼更符合 Objective-C/Swift 的習慣。

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 可用於將 Kotlin 宣告替換為用 Swift 編寫的包裝器。

    該註解指示 Kotlin 編譯器在生成的 Objective-C API 中將函數或屬性標記為 `swift_private`。這類宣告會獲得 `__` 前綴，使其在 Swift 程式碼中不可見。

    您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友好的 API，但例如 Xcode 的自動完成功能將不會建議它們。

    有關在 Swift 中精煉 Objective-C 宣告的更多資訊，請參閱 [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 新註解需要[選擇啟用 (opt-in)](opt-in-requirements.md)。
>
{style="note"}

Kotlin 團隊非常感謝 [Rick Clephas](https://github.com/rickclephas) 實作了這些註解。

### CocoaPods Gradle 外掛程式預設為動態框架

從 Kotlin 1.8.0 開始，由 CocoaPods Gradle 外掛程式註冊的 Kotlin 框架預設會動態連結。先前的靜態實作與 Kotlin Gradle 外掛程式的行為不一致。

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

如果您現有專案的連結類型為靜態，並且您升級到 Kotlin 1.8.0（或明確更改連結類型），您可能會在專案執行時遇到錯誤。要解決此問題，請關閉您的 Xcode 專案並在 Podfile 目錄中執行 `pod install`。

欲了解更多資訊，請參閱 [CocoaPods Gradle 外掛程式 DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin 多平台：新的 Android 原始碼集佈局

Kotlin 1.8.0 引入了新的 Android 原始碼集佈局，取代了先前令人困惑的目錄命名方案。

考慮一個在目前佈局中建立的兩個 `androidTest` 目錄的範例。一個用於 `KotlinSourceSets`，另一個用於 `AndroidSourceSets`：

*   它們具有不同的語義：Kotlin 的 `androidTest` 屬於 `unitTest` 類型，而 Android 的則屬於 `integrationTest` 類型。
*   它們建立了令人困惑的 `SourceDirectories` 佈局，因為 `src/androidTest/kotlin` 具有 `UnitTest`，而 `src/androidTest/java` 具有 `InstrumentedTest`。
*   `KotlinSourceSets` 和 `AndroidSourceSets` 都使用相似的 Gradle 配置命名方案，因此 Kotlin 和 Android 原始碼集產生出的 `androidTest` 配置都是相同的：`androidTestImplementation`、`androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

為了解決這些及其他現有問題，我們引入了新的 Android 原始碼集佈局。以下是兩種佈局之間的一些主要差異：

#### KotlinSourceSet 命名方案

| 目前的原始碼集佈局              | 新的原始碼集佈局               |
|----------------------------------------|-------------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 與 `{KotlinSourceSet.name}` 的映射關係如下：

|             | 目前的原始碼集佈局 | 新的原始碼集佈局          |
|-------------|---------------------------|--------------------------------|
| main        | androidMain               | androidMain                    |
| test        | androidTest               | android**Unit**Test         |
| androidTest | android**Android**Test | android**Instrumented**Test |

#### 原始碼目錄

| 目前的原始碼集佈局                               | 新的原始碼集佈局                                                     |
|---------------------------------------------------------|---------------------------------------------------------------------------|
| 佈局新增了額外的 `/kotlin` 原始碼目錄  | `src/{AndroidSourceSet.name}/kotlin`, `src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 與 `{SourceDirectories 包含}` 的映射關係如下：

|             | 目前的原始碼集佈局                                  | 新的原始碼集佈局                                                                          |
|-------------|------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin, src/main/kotlin, src/main/java     | src/androidMain/kotlin, src/main/kotlin, src/main/java                                         |
| test        | src/androidTest/kotlin, src/test/kotlin, src/test/java     | src/android**Unit**Test/kotlin, src/test/kotlin, src/test/java                              |
| androidTest | src/android**Android**Test/kotlin, src/androidTest/java | src/android**Instrumented**Test/kotlin, src/androidTest/java, **src/androidTest/kotlin** |

#### AndroidManifest.xml 檔案的位置

| 目前的原始碼集佈局                              | 新的原始碼集佈局                                 |
|--------------------------------------------------------|-------------------------------------------------------|
| src/{**Android**SourceSet.name}/AndroidManifest.xml | src/{**Kotlin**SourceSet.name}/AndroidManifest.xml |

`{AndroidSourceSet.name}` 與 `{AndroidManifest.xml 位置}` 的映射關係如下：

|       | 目前的原始碼集佈局     | 新的原始碼集佈局                       |
|-------|-------------------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/**android**Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/**android**Debug/AndroidManifest.xml |

#### Android 與通用測試之間的關係

新的 Android 原始碼集佈局改變了 Android 儀器化測試（在新佈局中重新命名為 `androidInstrumentedTest`）與通用測試之間的關係。

此前，`androidAndroidTest` 和 `commonTest` 之間存在預設的 `dependsOn` 關係。實際上，這意味著：

*   `commonTest` 中的程式碼可在 `androidAndroidTest` 中使用。
*   `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中有對應的 `actual` 實作。
*   在 `commonTest` 中宣告的測試也作為 Android 儀器化測試運行。

在新的 Android 原始碼集佈局中，`dependsOn` 關係預設不會新增。如果您偏好先前的行為，請在您的 `build.gradle.kts` 檔案中手動宣告此關係：

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

#### 支援 Android 風味 (flavors)

此前，Kotlin Gradle 外掛程式會預先建立與 Android 原始碼集（帶有 `debug` 和 `release` 建構類型或 `demo` 和 `full` 等自訂風味）相對應的原始碼集。它使得這些原始碼集可透過 `val androidDebug by getting { ... }` 之類的結構存取。

在新的 Android 原始碼集佈局中，這些原始碼集是在 `afterEvaluate` 階段建立的。這使得此類表達式無效，導致諸如 `org.gradle.api.UnknownDomainObjectException: 未找到名稱為 'androidDebug' 的 KotlinSourceSet` 等錯誤。

為了解決此問題，請在您的 `build.gradle.kts` 檔案中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置與設定

新佈局將在未來版本中成為預設。您現在可以使用以下 Gradle 選項啟用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並支援 Android Studio 2022.3 及更高版本。
>
{style="note"}

現在不鼓勵使用先前的 Android 風格目錄。Kotlin 1.8.0 標誌著棄用週期的開始，並為目前的佈局引入了警告。您可以使用以下 Gradle 屬性來抑制警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 穩定化了 JS IR 編譯器後端，並為 JavaScript 相關的 Gradle 建構腳本帶來了新功能：
*   [穩定的 JS IR 編譯器後端](#stable-js-ir-compiler-backend)
*   [用於報告 `yarn.lock` 已更新的新設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [透過 Gradle 屬性為瀏覽器新增測試目標](#add-test-targets-for-browsers-via-gradle-properties)
*   [向您的專案新增 CSS 支援的新方法](#new-approach-to-adding-css-support-to-your-project)

### 穩定的 JS IR 編譯器後端

從此版本開始，[Kotlin/JS 中間表示 (IR-based) 編譯器](js-ir-compiler.md) 後端已穩定。雖然花費了一些時間統一所有三個後端的基礎設施，但它們現在都使用相同的 IR 處理 Kotlin 程式碼。

由於穩定的 JS IR 編譯器後端，舊版後端從現在開始已被棄用。

增量編譯與穩定的 JS IR 編譯器一起預設啟用。

如果您仍在使用舊編譯器，請藉助我們的[遷移指南](js-ir-migration.md)將您的專案切換到新的後端。

### 用於報告 `yarn.lock` 已更新的新設定

如果您使用 `yarn` 套件管理器，有三個新的特殊 Gradle 設定可以通知您 `yarn.lock` 檔案是否已更新。當您希望在 CI 建構過程中，`yarn.lock` 檔案被靜默更改時收到通知，您可以使用這些設定。

這三個新的 Gradle 屬性是：

*   `YarnLockMismatchReport`，指定如何報告 `yarn.lock` 檔案的更改。您可以使用以下值之一：
    *   `FAIL` 使對應的 Gradle 任務失敗。這是預設值。
    *   `WARNING` 將更改資訊寫入警告日誌。
    *   `NONE` 禁用報告。
*   `reportNewYarnLock`，明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項是禁用的：在首次啟動時生成新的 `yarn.lock` 檔案是常見做法。您可以使用此選項來確保檔案已提交到您的儲存庫。
*   `yarnLockAutoReplace`，每次 Gradle 任務執行時自動替換 `yarn.lock`。

要使用這些選項，請按如下方式更新您的建構腳本檔案 `build.gradle.kts`：

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

### 透過 Gradle 屬性為瀏覽器新增測試目標

從 Kotlin 1.8.0 開始，您可以在 Gradle 屬性檔案中直接為不同的瀏覽器設定測試目標。這樣做可以縮小建構腳本檔案的大小，因為您不再需要在 `build.gradle.kts` 中寫入所有目標。

您可以使用此屬性為所有模組定義瀏覽器列表，然後在特定模組的建構腳本中添加特定的瀏覽器。

例如，您的 Gradle 屬性檔案中的以下行將在 Firefox 和 Safari 中運行所有模組的測試：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

有關該屬性的[可用值的完整列表，請參閱 GitHub](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 團隊非常感謝 [Martynas Petuška](https://github.com/mpetuska) 實作了此功能。

### 向您的專案新增 CSS 支援的新方法

此版本提供了一種向您的專案新增 CSS 支援的新方法。我們假設這將影響許多專案，因此請不要忘記按照以下說明更新您的 Gradle 建構腳本檔案。

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

Kotlin 1.8.0 **完全**支援 Gradle 7.2 和 7.3 版本。您也可以使用直到最新 Gradle 版本的 Gradle，但如果您這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法正常運作。

此版本帶來了許多變更：
*   [將 Kotlin 編譯器選項公開為 Gradle 延遲屬性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [提高最低支援版本](#bumping-the-minimum-supported-versions)
*   [禁用 Kotlin 守護程序 (daemon) 備援策略的能力](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [在轉移性依賴中使用最新 `kotlin-stdlib` 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性是否一致](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [解決 Kotlin Gradle 外掛程式的轉移性依賴](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [棄用與移除](#deprecations-and-removals)

### 將 Kotlin 編譯器選項公開為 Gradle 延遲屬性

為了將可用的 Kotlin 編譯器選項公開為 [Gradle 延遲屬性](https://docs.gradle.org/current/userguide/lazy_configuration.html) 並更好地將它們整合到 Kotlin 任務中，我們進行了許多更改：

*   編譯任務具有新的 `compilerOptions` 輸入，它與現有的 `kotlinOptions` 類似，但使用 Gradle Properties API 中的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作為回傳類型：

  ```kotlin
  tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
      compilerOptions {
          useK2.set(true)
      }
  }
  ```

*   Kotlin 工具任務 `KotlinJsDce` 和 `KotlinNativeLink` 具有新的 `toolOptions` 輸入，它與現有的 `kotlinOptions` 輸入類似。
*   新的輸入具有 [`@Nested` Gradle 註解](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。
*   輸入中的每個屬性都具有相關的 Gradle 註解，例如 [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
*   Kotlin Gradle 外掛程式 API artifact 具有兩個新的介面：
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 輸入和 `compileOptions()` 方法。所有 Kotlin 編譯任務都實作此介面。
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 輸入和 `toolOptions()` 方法。所有 Kotlin 工具任務——`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`——都實作此介面。
*   某些 `compilerOptions` 使用新類型而不是 `String` 類型：
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt) (用於 `apiVersion` 和 `languageVersion` 輸入)
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/kotlin/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

  例如，您可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

  `kotlinOptions` 類型沒有改變，它們在內部轉換為 `compilerOptions` 類型。
*   Kotlin Gradle 外掛程式 API 與先前的版本是二進位相容的。然而，`kotlin-gradle-plugin` artifact 中存在一些原始碼和 ABI 破壞性變更。這些變更大多涉及對某些內部類型添加額外的泛型參數。一個重要的變化是 `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。
*   `KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。

> Kotlin Gradle 外掛程式仍會將 `KotlinJvmOptions` DSL 添加到 Android 擴充套件中：
>
> ```kotlin
> android {
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 當 `compilerOptions` DSL 添加到模組層級時，這將在[此問題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)的範圍內進行更改。
>
{style="note"}

#### 限制

> `kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在未來版本中棄用。改進將僅針對 `compilerOptions` 和 `toolOptions`。
>
{style="warning"}

對 `kotlinOptions` 調用任何 setter 或 getter 都會委派給 `compilerOptions` 中相關的屬性。這引入了以下限制：
*   `compilerOptions` 和 `kotlinOptions` 不能在任務執行階段更改（請參閱以下段落中的一個例外情況）。
*   `freeCompilerArgs` 回傳一個不可變的 `List<String>`，這意味著例如 `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。

一些外掛程式，包括 `kotlin-dsl` 和啟用 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 外掛程式 (AGP)，嘗試在任務執行階段修改 `freeCompilerArgs` 屬性。我們已在 Kotlin 1.8.0 中為它們添加了一個解決方案。此解決方案允許任何建構腳本或外掛程式在執行階段修改 `kotlinOptions.freeCompilerArgs`，但會在建構日誌中產生警告。要禁用此警告，請使用新的 Gradle 屬性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。Gradle 將為 [`kotlin-dsl` 外掛程式](https://github.com/gradle/gradle/issues/22091) 和[啟用 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修復。

### 提高最低支援版本

從 Kotlin 1.8.0 開始，最低支援的 Gradle 版本為 6.8.3，最低支援的 Android Gradle 外掛程式版本為 4.1.3。

請參閱我們文件中的 [Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### 禁用 Kotlin 守護程序 (daemon) 備援策略的能力

有一個新的 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。當值為 `false` 時，建構會在守護程序啟動或通訊問題時失敗。Kotlin 編譯任務中還有一個新的 `useDaemonFallbackStrategy` 屬性，如果您同時使用兩者，它將優先於 Gradle 屬性。如果沒有足夠的記憶體來執行編譯，您可以在日誌中看到相關訊息。

Kotlin 編譯器的備援策略是，如果守護程序因某種原因失敗，則在 Kotlin 守護程序外部執行編譯。如果 Gradle 守護程序已開啟，編譯器將使用「In process (進程內)」策略。如果 Gradle 守護程序已關閉，編譯器將使用「Out of process (進程外)」策略。在[文件中](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)了解更多關於這些執行策略的資訊。請注意，靜默備援到另一種策略可能會消耗大量系統資源或導致非確定性建構；有關更多詳細資訊，請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在轉移性依賴中使用最新 `kotlin-stdlib` 版本

如果您在依賴項中明確寫入 Kotlin 1.8.0 或更高版本，例如：`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那麼 Kotlin Gradle 外掛程式將使用該 Kotlin 版本來處理轉移性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依賴項。這樣做是為了避免不同 stdlib 版本導致的類別重複（了解更多關於將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` [合併到 `kotlin-stdlib` 中的資訊](#updated-jvm-compilation-target)）。您可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 屬性禁用此行為：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果您遇到版本對齊問題，請透過在建構腳本中宣告對 `kotlin-bom` 的平台依賴項，透過 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import) 對齊所有版本：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

在[文件中](gradle-configure-project.md#other-ways-to-align-versions)了解其他情況和我們建議的解決方案。

### 強制檢查相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性是否一致

> 即使您的原始碼檔案僅為 Kotlin 且您不使用 Java，本節也適用於您的 JVM 專案。
>
{style="note"}

[從此版本開始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，對於 Gradle 8.0+（此版本的 Gradle 尚未發布）上的專案，[`kotlin.jvm.target.validation.mode` 屬性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的預設值為 `error`，並且在 JVM 目標不相容的情況下，外掛程式將導致建構失敗。

將預設值從 `warning` 更改為 `error` 是平穩遷移到 Gradle 8.0 的準備步驟。**我們鼓勵您將此屬性設定為 `error`** 並[配置工具鏈](gradle-configure-project.md#gradle-java-toolchains-support)或手動對齊 JVM 版本。

了解更多關於[不檢查目標相容性可能出錯的情況](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### 解決 Kotlin Gradle 外掛程式的轉移性依賴

在 Kotlin 1.7.0 中，我們引入了[對 Gradle 外掛程式變體的支援](whatsnew17.md#support-for-gradle-plugin-variants)。由於這些外掛程式變體，建構類別路徑中可能包含不同版本的 [Kotlin Gradle 外掛程式](https://plugins.gradle.org/u/kotlin)，這些外掛程式又依賴於某個依賴項（通常是 `kotlin-gradle-plugin-api`）的不同版本。這可能會導致解析問題，我們想提出以下解決方案，以 `kotlin-dsl` 外掛程式為例。

Gradle 7.6 中的 `kotlin-dsl` 外掛程式依賴於 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 外掛程式，而後者又依賴於 `kotlin-gradle-plugin-api:1.7.10`。如果您添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 外掛程式，此 `kotlin-gradle-plugin-api:1.7.10` 轉移性依賴項可能因版本不匹配（`1.8.0` 和 `1.7.10`）以及變體屬性 [`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值而導致依賴項解析錯誤。作為一個解決方案，請添加此[約束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)以對齊版本。在我們實作[ Kotlin Gradle 外掛程式函式庫對齊平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)之前，可能需要此解決方案，該平台已在計畫中：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此約束強制在建構類別路徑中為轉移性依賴項使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本。在 [Gradle 問題追蹤器](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)中了解一個類似的案例。

### 棄用與移除

在 Kotlin 1.8.0 中，以下屬性和方法的棄用週期仍在繼續：

*   [在 Kotlin 1.7.0 的註釋中](whatsnew17.md#changes-in-compile-tasks)，`KotlinCompile` 任務仍然有已棄用的 Kotlin 屬性 `classpath`，該屬性將在未來版本中移除。現在，我們已將 `KotlinCompile` 任務的 `classpath` 屬性的棄用級別更改為 `error`。所有編譯任務都使用 `libraries` 輸入來獲取編譯所需的函式庫列表。
*   我們移除了 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 [kapt](kapt.md)。預設情況下，[kapt 從 Kotlin 1.3.70 開始就一直在使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，我們建議堅持使用此方法。
*   在 Kotlin 1.7.0 中，我們[宣布啟動 `kotlin.compiler.execution.strategy` 屬性的棄用週期](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。在此版本中，我們移除了此屬性。了解如何透過其他方式[定義 Kotlin 編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 標準函式庫

Kotlin 1.8.0：
*   [更新 JVM 編譯目標](#updated-jvm-compilation-target)。
*   穩定化了多個函數——[Java 與 Kotlin 之間的 TimeUnit 轉換](#timeunit-conversion-between-java-and-kotlin)、[`cbrt()`](#cbrt)、[Java `Optionals` 擴充函數](#java-optionals-extension-functions)。
*   提供[可比較和可減去的 `TimeMarks` 預覽](#comparable-and-subtractable-timemarks)。
*   包含 [`java.nio.file.path` 的實驗性擴充函數](#recursive-copying-or-deletion-of-directories)。
*   展現了[改進的 `kotlin-reflect` 效能](#improved-kotlin-reflect-performance)。

### 更新 JVM 編譯目標

在 Kotlin 1.8.0 中，標準函式庫（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）是使用 JVM 目標 1.8 編譯的。此前，標準函式庫是使用 JVM 目標 1.6 編譯的。

Kotlin 1.8.0 不再支援 JVM 目標 1.6 和 1.7。因此，您不再需要在建構腳本中單獨宣告 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，因為這些 artifact 的內容已合併到 `kotlin-stdlib` 中。

> 如果您在建構腳本中明確宣告了 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 作為依賴項，那麼您應該將它們替換為 `kotlin-stdlib`。
>
{style="note"}

請注意，混合不同版本的 stdlib artifact 可能會導致類別重複或類別遺失。為避免這種情況，Kotlin Gradle 外掛程式可以幫助您[對齊 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

### cbrt()

`cbrt()` 函數現在已穩定，它允許您計算 `double` 或 `float` 的實數立方根。

```kotlin
import kotlin.math.*

fun main() {
    val num = 27
    val negNum = -num

    println("The cube root of ${num.toDouble()} is: " +
            cbrt(num.toDouble()))
    println("The cube root of ${negNum.toDouble()} is: " +
            cbrt(negNum.toDouble()))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

### Java 與 Kotlin 之間的 TimeUnit 轉換

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函數現在已穩定。這些函數在 Kotlin 1.6.0 中作為實驗性功能引入，改善了 Kotlin 和 Java 之間的互通性。您現在可以輕鬆地在 Java `java.util.concurrent.TimeUnit` 和 Kotlin `kotlin.time.DurationUnit` 之間進行轉換。這些函數僅在 JVM 上支援。

```kotlin
import kotlin.time.*

// 供 Java 使用
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比較和可減去的 TimeMarks

> `TimeMarks` 的新功能是[實驗性的](components-stability.md#stability-levels-explained)，要使用它，您需要透過 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 選擇啟用。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果您想計算多個 `TimeMarks` 與**現在**之間的時間差，您一次只能在一個 `TimeMark` 上呼叫 `elapsedNow()`。這使得比較結果變得困難，因為兩個 `elapsedNow()` 函數呼叫無法同時執行。

為了解決這個問題，在 Kotlin 1.8.0 中，您可以從相同的時間來源減去和比較 `TimeMarks`。現在您可以建立一個新的 `TimeMark` 實例來表示**現在**，並從中減去其他 `TimeMarks`。透過這種方式，您從這些計算中收集到的結果保證是彼此相對的。

```kotlin
import kotlin.time.*
fun main() {
// 範例開始
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // 暫停 0.5 秒
    val mark2 = timeSource.markNow()

    // 1.8.0 之前
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // elapsed1 和 elapsed2 之間的差異會因
        // 兩個 elapsedNow() 呼叫之間經過的時間而異
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // 1.8.0 之後
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // 現在，經過的時間是相對於 mark3 計算的，
        // 這是一個固定值
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // 也可以互相比較時間標記
    // 這是真的，因為 mark2 是在 mark1 之後捕獲的
    println(mark2 > mark1)
// 範例結束
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

這項新功能在動畫計算中特別有用，您可以計算或比較代表不同影格的多個 `TimeMarks` 之間的差異。

### 遞迴複製或刪除目錄

> 這些新的 `java.nio.file.Path` 函數是[實驗性的](components-stability.md#stability-levels-explained)。要使用它們，您需要透過 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 選擇啟用。或者，您可以使用編譯器選項 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我們為 `java.nio.file.Path` 引入了兩個新的擴充函數：`copyToRecursively()` 和 `deleteRecursively()`，它們允許您遞迴地：

*   將目錄及其內容複製到另一個目的地。
*   刪除目錄及其內容。

這些函數作為備份過程的一部分非常有用。

#### 錯誤處理

使用 `copyToRecursively()`，您可以透過重載 `onError` lambda 函數來定義在複製時發生異常應如何處理：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "Failed to copy $source to $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

當您使用 `deleteRecursively()` 時，如果在刪除檔案或資料夾時發生異常，則會跳過該檔案或資料夾。一旦刪除完成，`deleteRecursively()` 會拋出一個 `IOException`，其中包含所有作為被抑制異常發生的異常。

#### 檔案覆寫

如果 `copyToRecursively()` 發現目的目錄中已存在檔案，則會發生異常。如果您想覆寫該檔案，請改用以 `overwrite` 作為參數並將其設定為 `true` 的重載：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 修補通用裝置 (fixture)
}
```
{validate="false"}

#### 自訂複製操作

要定義您自己的自訂複製邏輯，請使用以 `copyAction` 作為附加參數的重載。透過使用 `copyAction`，您可以提供一個 lambda 函數，例如包含您偏好的操作：

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

有關這些擴充函數的更多資訊，請參閱[我們的 API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)。

### Java Optionals 擴充函數

[Kotlin 1.7.0 中引入的](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)擴充函數現在已穩定。這些函數簡化了在 Java 中處理 Optional 類別的方式。它們可用於解包和轉換 JVM 上的 `Optional` 物件，並使 Java API 的操作更加簡潔。欲了解更多資訊，請參閱 [Kotlin 1.7.0 的新功能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 改進 `kotlin-reflect` 效能

利用 `kotlin-reflect` 現在使用 JVM 目標 1.8 編譯的事實，我們將內部快取機制遷移到 Java 的 `ClassValue`。以前我們只快取 `KClass`，但現在我們也快取 `KType` 和 `KDeclarationContainer`。這些變化導致在呼叫 `typeOf()` 時效能顯著提升。

## 文件更新

Kotlin 文件已收到一些值得注意的變更：

### 翻新與新增頁面

*   [Gradle 概述](gradle.md) – 了解如何使用 Gradle 建構系統配置和建構 Kotlin 專案，Kotlin Gradle 外掛程式中可用的編譯器選項、編譯和快取。
*   [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md) – 查看 Java 和 Kotlin 處理可能可空變數的方法差異。
*   [Lincheck 指南](lincheck-guide.md) – 了解如何設定和使用 Lincheck 框架在 JVM 上測試並行演算法。

### 新增與更新教學

*   [開始使用 Gradle 和 Kotlin/JVM](get-started-with-jvm-gradle-project.md) – 使用 IntelliJ IDEA 和 Gradle 建立一個控制台應用程式。
*   [使用 Ktor 和 SQLDelight 建立多平台應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – 使用 Kotlin 多平台行動開發 (Kotlin Multiplatform Mobile) 建立一個適用於 iOS 和 Android 的行動應用程式。
*   [開始使用 Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 進行跨平台行動開發，並建立一個同時適用於 Android 和 iOS 的應用程式。

## 安裝 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 會自動建議將 Kotlin 外掛程式更新到 1.8.0 版本。IntelliJ IDEA 2022.3 將在即將到來的小版本更新中捆綁 Kotlin 外掛程式的 1.8.0 版本。

> 要將現有專案遷移至 IntelliJ IDEA 2022.3 中的 Kotlin 1.8.0，請將 Kotlin 版本更改為 `1.8.0` 並重新匯入您的 Gradle 或 Maven 專案。
>
{style="note"}

對於 Android Studio Electric Eel (221) 和 Flamingo (222)，Kotlin 外掛程式的 1.8.0 版本將隨即將到來的 Android Studio 更新一起交付。新的命令列編譯器可從 [GitHub 發佈頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)下載。

## Kotlin 1.8.0 相容性指南

Kotlin 1.8.0 是一個[功能發佈版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此可能帶來與您為早期語言版本編寫的程式碼不相容的變更。這些變更的詳細列表可在 [Kotlin 1.8.0 相容性指南](compatibility-guide-18.md)中找到。