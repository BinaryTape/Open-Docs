[//]: # (title: Kotlin 1.8.0 有什麼新功能)

_[發佈日期：2022 年 12 月 28 日](releases.md#release-details)_

Kotlin 1.8.0 版本已發佈，以下是一些主要亮點：

*   [JVM 的新實驗性函式：遞迴複製或刪除目錄內容](#recursive-copying-or-deletion-of-directories)
*   [提升 kotlin-reflect 效能](#improved-kotlin-reflect-performance)
*   [用於更好偵錯體驗的新 -Xdebug 編譯器選項](#a-new-compiler-option-for-disabling-optimizations)
*   [`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合併至 `kotlin-stdlib`](#updated-jvm-compilation-target)
*   [改進 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
*   [相容於 Gradle 7.3](#gradle)

## IDE 支援

支援 1.8.0 的 Kotlin 外掛程式適用於：

| IDE            | 支援版本                 |
|----------------|------------------------------------|
| IntelliJ IDEA  | 2021.3, 2022.1, 2022.2             |
| Android Studio | Electric Eel (221), Flamingo (222) |

> 您可以在 IntelliJ IDEA 2022.3 中將您的專案更新至 Kotlin 1.8.0，而無需更新 IDE 外掛程式。
>
> 要在 IntelliJ IDEA 2022.3 中將現有專案遷移到 Kotlin 1.8.0，請將 Kotlin 版本變更為 `1.8.0` 並重新匯入
> 您的 Gradle 或 Maven 專案。
>
{style="note"}

## Kotlin/JVM

從 1.8.0 版開始，編譯器可以產生對應於 JVM 19 的位元碼版本的類別。
新的語言版本還包括：

*   [用於關閉 JVM 註釋目標生成的編譯器選項](#ability-to-not-generate-type-use-and-type-parameter-annotation-targets)
*   [用於停用最佳化的新 `-Xdebug` 編譯器選項](#a-new-compiler-option-for-disabling-optimizations)
*   [移除舊的後端](#removal-of-the-old-backend)
*   [支援 Lombok 的 @Builder 註釋](#support-for-lombok-s-builder-annotation)

### 不生成 TYPE_USE 和 TYPE_PARAMETER 註釋目標的能力

如果 Kotlin 註釋在其 Kotlin 目標中包含 `TYPE`，則該註釋會映射到其 Java 註釋目標列表中的 `java.lang.annotation.ElementType.TYPE_USE`。
這就像 `TYPE_PARAMETER` Kotlin 目標映射到
`java.lang.annotation.ElementType.TYPE_PARAMETER` Java 目標一樣。這對於 API 等級
低於 26 的 Android 用戶端是個問題，因為它們的 API 中沒有這些目標。

從 Kotlin 1.8.0 開始，您可以使用新的編譯器選項 `-Xno-new-java-annotation-targets` 來避免生成
`TYPE_USE` 和 `TYPE_PARAMETER` 註釋目標。

### 用於停用最佳化的新編譯器選項

Kotlin 1.8.0 新增了新的 `-Xdebug` 編譯器選項，它停用最佳化以提供更好的偵錯體驗。
目前，此選項停用協程的「已最佳化」功能。未來，在我們添加更多最佳化後，
此選項也會停用它們。

「已最佳化」功能在您使用暫停函式時最佳化變數。然而，偵錯具有最佳化變數的程式碼很困難，
因為您看不到它們的值。

> **切勿在生產環境中使用此選項**：透過 `-Xdebug` 停用此功能可能會
> [導致記憶體洩漏](https://youtrack.jetbrains.com/issue/KT-48678/Coroutine-debugger-disable-was-optimised-out-compiler-feature#focus=Comments-27-6015585.0-0)。
>
{style="warning"}

### 移除舊的後端

在 Kotlin 1.5.0 中，我們[宣布](whatsnew15.md#stable-jvm-ir-backend)基於 IR 的後端已[穩定](components-stability.md)。
這意味著 Kotlin 1.4.* 的舊後端已棄用。在 Kotlin 1.8.0 中，我們已完全移除了舊後端。
因此，我們也移除了編譯器選項 `-Xuse-old-backend` 和 Gradle 選項 `useOldBackend`。

### 支援 Lombok 的 @Builder 註釋

社群已為 [Kotlin Lombok: 支援生成的 Builder (@Builder)](https://youtrack.jetbrains.com/issue/KT-46959)
YouTrack 問題添加了如此多的票數，以至於我們不得不支援 [@Builder 註釋](https://projectlombok.org/features/Builder)。

我們目前尚無計劃支援 `@SuperBuilder` 或 `@Tolerate` 註釋，但如果足夠多的人
投票給 [@SuperBuilder](https://youtrack.jetbrains.com/issue/KT-53563/Kotlin-Lombok-Support-SuperBuilder) 和
[@Tolerate](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate) 問題，我們將重新考慮。

[了解如何配置 Lombok 編譯器外掛程式](lombok.md#gradle)。

## Kotlin/Native

Kotlin 1.8.0 包含了 Objective-C 和 Swift 互通性的變更、對 Xcode 14.1 的支援以及 CocoaPods Gradle 外掛程式的改進：

*   [支援 Xcode 14.1](#support-for-xcode-14-1)
*   [改進 Objective-C/Swift 互通性](#improved-objective-c-swift-interoperability)
*   [CocoaPods Gradle 外掛程式中預設為動態框架](#dynamic-frameworks-by-default-in-the-cocoapods-gradle-plugin)

### 支援 Xcode 14.1

Kotlin/Native 編譯器現在支援最新的穩定 Xcode 版本 14.1。相容性改進包括
以下變更：

*   為 watchOS 目標新增了 `watchosDeviceArm64` 預設，支援 ARM64 平台上的 Apple watchOS。
*   Kotlin CocoaPods Gradle 外掛程式預設不再包含 Apple 框架的位元碼嵌入。
*   平台函式庫已更新，以反映 Apple 目標的 Objective-C 框架變更。

### 改進 Objective-C/Swift 互通性

為了使 Kotlin 與 Objective-C 和 Swift 更具互通性，新增了三個註釋：

*   [`@ObjCName`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-obj-c-name/) 允許您在 Swift 或 Objective-C 中指定更
    符合慣例的名稱，而不是重新命名 Kotlin 宣告。

    此註釋指示 Kotlin 編譯器為此類別、屬性、參數或函式使用自訂的 Objective-C 和 Swift 名稱：

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

*   [`@HiddenFromObjC`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-hidden-from-obj-c/) 允許您從 Objective-C 隱藏
    Kotlin 宣告。

    此註釋指示 Kotlin 編譯器不將函式或屬性匯出到 Objective-C，因此也不匯出到 Swift。
    這可以使您的 Kotlin 程式碼更符合 Objective-C/Swift 習慣。

*   [`@ShouldRefineInSwift`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-should-refine-in-swift/) 有助於
    用 Swift 編寫的包裝器替換 Kotlin 宣告。

    此註釋指示 Kotlin 編譯器將函式或屬性標記為生成
    Objective-C API 中的 `swift_private`。這類宣告會獲得 `__` 前綴，這使得它們對 Swift 程式碼不可見。

    您仍然可以在 Swift 程式碼中使用這些宣告來建立 Swift 友善的 API，但它們不會被
    Xcode 的自動完成建議，例如。

    有關在 Swift 中精煉 Objective-C 宣告的更多資訊，請參閱
    [Apple 官方文件](https://developer.apple.com/documentation/swift/improving-objective-c-api-declarations-for-swift)。

> 新的註釋[需要選擇性加入](opt-in-requirements.md)。
>
{style="note"}

Kotlin 團隊非常感謝 [Rick Clephas](https://github.com/rickclephas) 實作這些註釋。

### CocoaPods Gradle 外掛程式中預設為動態框架

從 Kotlin 1.8.0 開始，由 CocoaPods Gradle 外掛程式註冊的 Kotlin 框架預設動態連結。
先前的靜態實作與 Kotlin Gradle 外掛程式的行為不一致。

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

如果您有現有的專案使用靜態連結類型，並且您升級到 Kotlin 1.8.0（或明確變更連結類型），
您可能會遇到專案執行錯誤。要解決此問題，請關閉您的 Xcode 專案並
在 Podfile 目錄中執行 `pod install`。

有關更多資訊，請參閱 [CocoaPods Gradle 外掛程式 DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-dsl-reference.html)。

## Kotlin Multiplatform：新的 Android 原始碼集佈局

Kotlin 1.8.0 引入了新的 Android 原始碼集佈局，取代了先前令人困惑的目錄命名模式。

考慮目前佈局中建立的兩個 `androidTest` 目錄的範例。一個用於 `KotlinSourceSets`，
另一個用於 `AndroidSourceSets`：

*   它們有不同的語義：Kotlin 的 `androidTest` 屬於 `unitTest` 類型，而 Android 的則屬於
    `integrationTest` 類型。
*   它們會建立一個令人困惑的 `SourceDirectories` 佈局，因為
    `src/androidTest/kotlin` 有一個 `UnitTest` 而 `src/androidTest/java` 有一個 `InstrumentedTest`。
*   `KotlinSourceSets` 和 `AndroidSourceSets` 都對 Gradle 配置使用類似的命名模式，因此
    兩個 `androidTest` 的結果配置都是相同的：`androidTestImplementation`、
    `androidTestApi`、`androidTestRuntimeOnly` 和 `androidTestCompileOnly`。

為了解決這些及其他現有問題，我們引入了新的 Android 原始碼集佈局。
以下是兩種佈局之間的一些主要區別：

#### KotlinSourceSet 命名模式

| 目前原始碼集佈局              | 新原始碼集佈局               |
|-------------------------------|----------------------------------|
| `targetName` + `AndroidSourceSet.name` | `targetName` + `AndroidVariantType` |

`{AndroidSourceSet.name}` 映射至 `{KotlinSourceSet.name}` 如下：

|             | 目前原始碼集佈局 | 新原始碼集佈局          |
|-------------|-------------------|--------------------------------|
| main        | androidMain       | androidMain                    |
| test        | androidTest       | android**Unit**Test         |
| androidTest | android**Android**Test | android**Instrumented**Test |

#### SourceDirectories

| 目前原始碼集佈局                               | 新原始碼集佈局                                                     |
|------------------------------------------------|------------------------------------------------------------------------------------------------|
| 佈局添加了額外的 `/kotlin` SourceDirectories  | `src/{AndroidSourceSet.name}/kotlin`、`src/{KotlinSourceSet.name}/kotlin` |

`{AndroidSourceSet.name}` 映射至 `{SourceDirectories included}` 如下：

|             | 目前原始碼集佈局                                  | 新原始碼集佈局                                                                          |
|-------------|---------------------------------------------------|------------------------------------------------------------------------------------------------|
| main        | src/androidMain/kotlin、src/main/kotlin、src/main/java     | src/androidMain/kotlin、src/main/kotlin、src/main/java                                         |
| test        | src/androidTest/kotlin、src/test/kotlin、src/test/java     | src/android**Unit**Test/kotlin、src/test/kotlin、src/test/java                              |
| androidTest | src/android**Android**Test/kotlin、src/androidTest/java | src/android**Instrumented**Test/kotlin、src/androidTest/java、**src/androidTest/kotlin** |

#### AndroidManifest.xml 檔案的位置

| 目前原始碼集佈局                              | 新原始碼集佈局                                 |
|-----------------------------------------------|------------------------------------------------|
| src/**Android**SourceSet.name/AndroidManifest.xml | src/**Kotlin**SourceSet.name/AndroidManifest.xml |

`{AndroidSourceSet.name}` 映射至`{AndroidManifest.xml location}` 如下：

|       | 目前原始碼集佈局     | 新原始碼集佈局                       |
|-------|-----------------------|---------------------------------------------|
| main  | src/main/AndroidManifest.xml  | src/**android**Main/AndroidManifest.xml  |
| debug | src/debug/AndroidManifest.xml | src/**android**Debug/AndroidManifest.xml |

#### Android 與通用測試之間的關係

新的 Android 原始碼集佈局改變了 Android 儀器測試（在新佈局中重新命名為 `androidInstrumentedTest`）
與通用測試之間的關係。

以前，`androidAndroidTest` 和 `commonTest` 之間存在預設的 `dependsOn` 關係。實際上，這意味著：

*   `commonTest` 中的程式碼在 `androidAndroidTest` 中可用。
*   `commonTest` 中的 `expect` 宣告必須在 `androidAndroidTest` 中有對應的 `actual` 實作。
*   在 `commonTest` 中宣告的測試也作為 Android 儀器測試執行。

在新的 Android 原始碼集佈局中，預設不添加 `dependsOn` 關係。如果您偏好先前的行為，
請在您的 `build.gradle.kts` 檔案中手動宣告此關係：

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

以前，Kotlin Gradle 外掛程式會主動建立對應於帶有 `debug` 和
`release` 建構類型或自訂風味（如 `demo` 和 `full`）的 Android 原始碼集。
它使它們可透過 `val androidDebug by getting { ... }` 這樣的結構存取。

在新的 Android 原始碼集佈局中，這些原始碼集是在 `afterEvaluate` 階段建立的。這使得此類表達式無效，
導致像 `org.gradle.api.UnknownDomainObjectException: KotlinSourceSet with name 'androidDebug' not found` 這樣的錯誤。

為了解決這個問題，請在您的 `build.gradle.kts` 檔案中使用新的 `invokeWhenCreated()` API：

```kotlin
kotlin {
    // ...
    sourceSets.invokeWhenCreated("androidFreeDebug") {
        // ...
    }
}
```

### 配置與設定

新佈局將在未來版本中成為預設值。您現在可以使用以下 Gradle 選項啟用它：

```none
kotlin.mpp.androidSourceSetLayoutVersion=2
```

> 新佈局需要 Android Gradle 外掛程式 7.0 或更高版本，並支援 Android Studio 2022.3 及更高版本。
>
{style="note"}

現在不鼓勵使用先前的 Android 樣式目錄。Kotlin 1.8.0 標誌著棄用週期的開始，
引入了對目前佈局的警告。您可以使用以下 Gradle 屬性抑制警告：

```none
kotlin.mpp.androidSourceSetLayoutVersion1.nowarn=true
```

## Kotlin/JS

Kotlin 1.8.0 穩定化了 JS IR 編譯器後端，並為 JavaScript 相關的 Gradle 建構腳本帶來了新功能：
*   [穩定的 JS IR 編譯器後端](#stable-js-ir-compiler-backend)
*   [用於報告 `yarn.lock` 已更新的新設定](#new-settings-for-reporting-that-yarn-lock-has-been-updated)
*   [透過 Gradle 屬性為瀏覽器添加測試目標](#add-test-targets-for-browsers-via-gradle-properties)
*   [將 CSS 支援添加到專案的新方法](#new-approach-to-adding-css-support-to-your-project)

### 穩定的 JS IR 編譯器後端

從此版本開始，[Kotlin/JS 中間表示 (IR) 編譯器](js-ir-compiler.md)後端已穩定。
統一所有三個後端的基礎設施花費了一些時間，但它們現在都使用相同的 IR 處理 Kotlin 程式碼。

由於穩定的 JS IR 編譯器後端，舊的從現在開始棄用。

增量編譯預設啟用，並與穩定的 JS IR 編譯器一起。

如果您仍在使用舊編譯器，請借助我們的[遷移指南](js-ir-migration.md)將您的專案切換到新後端。

### 用於報告 `yarn.lock` 已更新的新設定

如果您使用 `yarn` 套件管理器，有三個新的特殊 Gradle 設定可以通知您
`yarn.lock` 檔案是否已更新。當您希望在 CI 建構過程中 `yarn.lock` 被靜默更改時收到通知時，
您可以使用這些設定。

這三個新的 Gradle 屬性是：

*   `YarnLockMismatchReport`，指定如何報告 `yarn.lock` 檔案的變更。您可以使用以下其中一個值：
    *   `FAIL` 使對應的 Gradle 任務失敗。這是預設值。
    *   `WARNING` 將有關變更的資訊寫入警告日誌。
    *   `NONE` 停用報告。
*   `reportNewYarnLock`，明確報告最近建立的 `yarn.lock` 檔案。預設情況下，此選項已停用：
    首次啟動時生成新的 `yarn.lock` 檔案是常見做法。您可以使用此選項來
    確保該檔案已提交到您的儲存庫。
*   `yarnLockAutoReplace`，每次運行 Gradle 任務時自動替換 `yarn.lock`。

要使用這些選項，請更新您的建構腳本檔案 `build.gradle.kts` 如下：

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

### 透過 Gradle 屬性為瀏覽器添加測試目標

從 Kotlin 1.8.0 開始，您可以直接在 Gradle 屬性檔案中為不同的瀏覽器設定測試目標。這樣做
可以縮小建構腳本檔案的大小，因為您不再需要將所有目標寫入 `build.gradle.kts`。

您可以使用此屬性為所有模組定義瀏覽器列表，然後在特定模組的建構腳本中添加特定瀏覽器。

例如，您的 Gradle 屬性檔案中的以下行將在所有模組的 Firefox 和 Safari 中執行測試：

```none
kotlin.js.browser.karma.browsers=firefox,safari
```

請參閱 [GitHub 上的屬性可用值的完整列表](https://github.com/JetBrains/kotlin/blob/master/libraries/tools/kotlin-gradle-plugin/src/common/kotlin/org/jetbrains/kotlin/gradle/targets/js/testing/karma/KotlinKarma.kt#L106)。

Kotlin 團隊非常感謝 [Martynas Petuška](https://github.com/mpetuska) 實作此功能。

### 將 CSS 支援添加到專案的新方法

此版本提供了將 CSS 支援添加到專案的新方法。我們假設這將影響許多專案，
所以別忘了按照以下說明更新您的 Gradle 建構腳本檔案。

在 Kotlin 1.8.0 之前，`cssSupport.enabled` 屬性用於添加 CSS 支援：

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

Kotlin 1.8.0 **完全**支援 Gradle 7.2 和 7.3 版本。您也可以使用最新 Gradle 版本之前的 Gradle 版本，
但如果這樣做，請記住您可能會遇到棄用警告或某些新的 Gradle 功能可能無法運作。

此版本帶來了許多變更：
*   [將 Kotlin 編譯器選項公開為 Gradle 延遲屬性](#exposing-kotlin-compiler-options-as-gradle-lazy-properties)
*   [提升最低支援版本](#bumping-the-minimum-supported-versions)
*   [停用 Kotlin 守護行程回退策略的能力](#ability-to-disable-the-kotlin-daemon-fallback-strategy)
*   [在傳遞性依賴項中使用最新 kotlin-stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)
*   [相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性平等性強制檢查](#obligatory-check-for-jvm-targets-of-related-kotlin-and-java-compile-tasks)
*   [Kotlin Gradle 外掛程式傳遞性依賴項的解析](#resolution-of-kotlin-gradle-plugins-transitive-dependencies)
*   [棄用與移除](#deprecations-and-removals)

### 將 Kotlin 編譯器選項公開為 Gradle 延遲屬性

為了將可用的 Kotlin 編譯器選項公開為 [Gradle 延遲屬性](https://docs.gradle.org/current/userguide/lazy_configuration.html)
並將它們更好地整合到 Kotlin 任務中，我們進行了許多變更：

*   編譯任務具有新的 `compilerOptions` 輸入，它類似於現有的 `kotlinOptions`，但使用
    Gradle Properties API 中的 [`Property`](https://docs.gradle.org/current/javadoc/org/gradle/api/provider/Property.html) 作為回傳類型：

    ```kotlin
    tasks.named("compileKotlin", org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile::class.java) {
        compilerOptions {
            useK2.set(true)
        }
    }
    ```

*   Kotlin 工具任務 `KotlinJsDce` 和 `KotlinNativeLink` 具有新的 `toolOptions` 輸入，它類似於
    現有的 `kotlinOptions` 輸入。
*   新的輸入具有 [`@Nested` Gradle 註釋](https://docs.gradle.org/current/javadoc/org/gradle/api/tasks/Nested.html)。
    輸入中的每個屬性都有一個相關的 Gradle 註釋，例如
    [`@Input` 或 `@Internal`](https://docs.gradle.org/current/userguide/more_about_tasks.html#sec:up_to_date_checks)。
*   Kotlin Gradle 外掛程式 API 構件有兩個新介面：
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask`，它具有 `compilerOptions` 輸入和 `compileOptions()`
        方法。所有 Kotlin 編譯任務都實作此介面。
    *   `org.jetbrains.kotlin.gradle.tasks.KotlinToolTask`，它具有 `toolOptions` 輸入和 `toolOptions()` 方法。
        所有 Kotlin 工具任務——`KotlinJsDce`、`KotlinNativeLink` 和 `KotlinNativeLinkArtifactTask`——都實作此介面。
*   某些 `compilerOptions` 使用新類型而非 `String` 類型：
    *   [`JvmTarget`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JvmTarget.kt)
    *   [`KotlinVersion`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/KotlinVersion.kt)
        （用於 `apiVersion` 和 `languageVersion` 輸入）
    *   [`JsMainFunctionExecutionMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsMainFunctionExecutionMode.kt)
    *   [`JsModuleKind`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsModuleKind.kt)
    *   [`JsSourceMapEmbedMode`](https://github.com/JetBrains/kotlin/blob/1.8.0/libraries/tools/kotlin-gradle-compiler-types/src/generated/kotlin/org/jetbrains/kotlin/gradle/dsl/JsSourceMapEmbedMode.kt)

    例如，您可以使用 `compilerOptions.jvmTarget.set(JvmTarget.JVM_11)` 而不是 `kotlinOptions.jvmTarget = "11"`。

    `kotlinOptions` 類型沒有改變，它們在內部轉換為 `compilerOptions` 類型。
*   Kotlin Gradle 外掛程式 API 與先前的版本二進位相容。然而，`kotlin-gradle-plugin` 構件中有一些原始碼和 ABI 破壞性變更。這些變更大多涉及某些內部類型的額外泛型參數。一個重要的變更是 `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。
*   `KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。

> Kotlin Gradle 外掛程式仍然將 `KotlinJvmOptions` DSL 添加到 Android 擴展：
>
> ```kotlin
> android { 
>     kotlinOptions {
>         jvmTarget = "11"
>     }
> }
> ```
>
> 這將在[此問題](https://youtrack.jetbrains.com/issue/KT-15370/Gradle-DSL-add-module-level-kotlin-options)的範圍內更改，
> 當 `compilerOptions` DSL 將被添加到模組層級時。
>
{style="note"}

#### 限制

> `kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在
> 即將發布的版本中棄用。改進將僅限於 `compilerOptions` 和 `toolOptions`。
>
{style="warning"}

呼叫 `kotlinOptions` 上的任何 setter 或 getter 都會委託給 `compilerOptions` 中相關的屬性。
這引入了以下限制：
*   `compilerOptions` 和 `kotlinOptions` 無法在任務執行階段更改（下方段落中有一項例外）。
*   `freeCompilerArgs` 返回一個不可變的 `List<String>`，這意味著，例如，
    `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。

包括 `kotlin-dsl` 和啟用 [Jetpack Compose](https://developer.android.com/jetpack/compose) 的 Android Gradle 外掛程式 (AGP) 在內的幾個外掛程式，
嘗試在任務執行階段修改 `freeCompilerArgs` 屬性。我們已在 Kotlin 1.8.0 中為它們添加了解決方案。
此解決方案允許任何建構腳本或外掛程式在執行階段修改 `kotlinOptions.freeCompilerArgs`，
但在建構日誌中產生警告。要停用此警告，請使用新的 Gradle 屬性 `kotlin.options.suppressFreeCompilerArgsModificationWarning=true`。
Gradle 將為 [`kotlin-dsl` 外掛程式](https://github.com/gradle/gradle/issues/22091) 和
[啟用 Jetpack Compose 的 AGP](https://issuetracker.google.com/u/1/issues/247544167) 添加修復。

### 提升最低支援版本

從 Kotlin 1.8.0 開始，最低支援的 Gradle 版本是 6.8.3，最低支援的 Android Gradle 外掛程式
版本是 4.1.3。

請參閱[我們的文件中 Kotlin Gradle 外掛程式與可用 Gradle 版本的相容性](gradle-configure-project.md#apply-the-plugin)。

### 停用 Kotlin 守護行程回退策略的能力

有一個新的 Gradle 屬性 `kotlin.daemon.useFallbackStrategy`，其預設值為 `true`。當值為 `false` 時，
如果守護行程啟動或通訊出現問題，建構將會失敗。Kotlin 編譯任務中還有一個新的
`useDaemonFallbackStrategy` 屬性，如果您同時使用兩者，該屬性會優先於 Gradle 屬性。
如果記憶體不足以執行編譯，您可以在日誌中看到相關訊息。

Kotlin 編譯器的回退策略是，如果守護行程因故失敗，則在 Kotlin 守護行程之外運行編譯。
如果 Gradle 守護行程開啟，編譯器使用「程序內」策略。如果 Gradle 守護行程關閉，編譯器使用
「程序外」策略。了解更多關於這些[執行策略的資訊](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。
請注意，靜默回退到另一種策略可能會消耗大量系統資源或導致非確定性建構；
有關更多詳細資訊，請參閱此 [YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-48843/Add-ability-to-disable-Kotlin-daemon-fallback-strategy)。

### 在傳遞性依賴項中使用最新 kotlin-stdlib 版本

如果您在依賴項中明確寫入 Kotlin 1.8.0 或更高版本，例如：
`implementation("org.jetbrains.kotlin:kotlin-stdlib:1.8.0")`，那麼 Kotlin Gradle 外掛程式將使用該 Kotlin 版本
處理傳遞性 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 依賴項。這樣做是為了避免不同 stdlib 版本導致的類別重複
（了解更多關於[將 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 合併到 `kotlin-stdlib`](#updated-jvm-compilation-target)）。
您可以使用 `kotlin.stdlib.jdk.variants.version.alignment` Gradle 屬性停用此行為：

```none
kotlin.stdlib.jdk.variants.version.alignment=false
```

如果您遇到版本對齊問題，請透過 Kotlin [BOM](https://docs.gradle.org/current/userguide/platforms.html#sub:bom_import)
對齊所有版本，在您的建構腳本中宣告對 `kotlin-bom` 的平台依賴：

```kotlin
implementation(platform("org.jetbrains.kotlin:kotlin-bom:1.8.0"))
```

了解其他情況和我們建議的解決方案，請參閱[文件](gradle-configure-project.md#other-ways-to-align-versions)。

### 相關 Kotlin 和 Java 編譯任務的 JVM 目標相容性平等性強制檢查

> 即使您的原始碼檔案僅為 Kotlin 且不使用 Java，本節也適用於您的 JVM 專案。
>
{style="note"}

[從此版本開始](https://youtrack.jetbrains.com/issue/KT-54993/Raise-kotlin.jvm.target.validation.mode-check-default-level-to-error-when-build-is-running-on-Gradle-8)，
對於 Gradle 8.0+ 上的專案（此版本 Gradle 尚未發布），[`kotlin.jvm.target.validation.mode` 屬性](gradle-configure-project.md#check-for-jvm-target-compatibility-of-related-compile-tasks)的預設值為 `error`，
如果 JVM 目標不相容，外掛程式將導致建構失敗。

預設值從 `warning` 轉變為 `error` 是平穩遷移到 Gradle 8.0 的準備步驟。
**我們鼓勵您將此屬性設定為 `error`** 並[配置工具鏈](gradle-configure-project.md#gradle-java-toolchains-support)
或手動對齊 JVM 版本。

了解更多關於[如果不檢查目標相容性可能出什麼問題](gradle-configure-project.md#what-can-go-wrong-if-targets-are-incompatible)。

### Kotlin Gradle 外掛程式傳遞性依賴項的解析

在 Kotlin 1.7.0 中，我們引入了[對 Gradle 外掛程式變體的支援](whatsnew17.md#support-for-gradle-plugin-variants)。
由於這些外掛程式變體，建構類別路徑可能具有不同版本的 [Kotlin Gradle 外掛程式](https://plugins.gradle.org/u/kotlin)，
它們依賴於某些依賴項的不同版本，通常是 `kotlin-gradle-plugin-api`。這可能導致
解析問題，我們建議以下解決方案，以 `kotlin-dsl` 外掛程式為例。

Gradle 7.6 中的 `kotlin-dsl` 外掛程式依賴於 `org.jetbrains.kotlin.plugin.sam.with.receiver:1.7.10` 外掛程式，
該外掛程式又依賴於 `kotlin-gradle-plugin-api:1.7.10`。如果您添加 `org.jetbrains.kotlin.gradle.jvm:1.8.0` 外掛程式，
這個 `kotlin-gradle-plugin-api:1.7.10` 傳遞性依賴項可能由於版本（`1.8.0` 和 `1.7.10`）和變體屬性
[`org.gradle.plugin.api-version`](https://docs.gradle.org/current/javadoc/org/gradle/api/attributes/plugin/GradlePluginApiVersion.html) 值之間的不匹配而導致依賴解析錯誤。
作為解決方案，添加此[約束](https://docs.gradle.org/current/userguide/dependency_constraints.html#sec:adding-constraints-transitive-deps)以對齊版本。
此解決方案可能在我們實作[Kotlin Gradle 外掛程式函式庫對齊平台](https://youtrack.jetbrains.com/issue/KT-54691/Kotlin-Gradle-Plugin-libraries-alignment-platform)之前是必需的，
這在計劃中：

```kotlin
dependencies {
    constraints {
        implementation("org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0")
    }
}
```

此約束強制在建構類別路徑中對傳遞性依賴項使用 `org.jetbrains.kotlin:kotlin-sam-with-receiver:1.8.0` 版本。
了解更多關於 [Gradle 問題追蹤器中一個類似的情況](https://github.com/gradle/gradle/issues/22510#issuecomment-1292259298)。

### 棄用與移除

在 Kotlin 1.8.0 中，以下屬性和方法的棄用週期仍在繼續：

*   [在 Kotlin 1.7.0 的備註中](whatsnew17.md#changes-in-compile-tasks)，`KotlinCompile` 任務仍然具有
    已棄用的 Kotlin 屬性 `classpath`，該屬性將在未來版本中移除。現在，我們已將
    `KotlinCompile` 任務的 `classpath` 屬性的棄用級別更改為 `error`。所有編譯任務都使用
    `libraries` 輸入作為編譯所需的函式庫列表。
*   我們移除了 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 [kapt](kapt.md)。
    預設情況下，[kapt 自 Kotlin 1.3.70 起就一直在使用 Gradle workers](kapt.md#run-kapt-tasks-in-parallel)，
    我們建議堅持使用此方法。
*   在 Kotlin 1.7.0 中，我們[宣布了 `kotlin.compiler.execution.strategy` 系統屬性棄用週期的開始](whatsnew17.md#deprecation-of-the-kotlin-compiler-execution-strategy-system-property)。
    在此版本中，我們移除了此屬性。了解如何[以其他方式定義 Kotlin 編譯器執行策略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)。

## 標準函式庫

Kotlin 1.8.0：
*   更新 [JVM 編譯目標](#updated-jvm-compilation-target)。
*   穩定化多個函式——[Java 和 Kotlin 之間的 TimeUnit 轉換](#timeunit-conversion-between-java-and-kotlin)、
    [`cbrt()`](#cbrt)、[Java `Optionals` 擴展函式](#java-optionals-extension-functions)。
*   提供[可比較和可相減 `TimeMarks` 的預覽](#comparable-and-subtractable-timemarks)。
*   包含 [ `java.nio.file.path` 的實驗性擴展函式](#recursive-copying-or-deletion-of-directories)。
*   呈現[提升的 kotlin-reflect 效能](#improved-kotlin-reflect-performance)。

### 更新 JVM 編譯目標

在 Kotlin 1.8.0 中，標準函式庫（`kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-script-*`）以
JVM 目標 1.8 編譯。此前，標準函式庫以 JVM 目標 1.6 編譯。

Kotlin 1.8.0 不再支援 JVM 目標 1.6 和 1.7。因此，您不再需要單獨在建構腳本中宣告
`kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8`，因為這些構件的內容已合併到 `kotlin-stdlib` 中。

> 如果您已明確宣告 `kotlin-stdlib-jdk7` 和 `kotlin-stdlib-jdk8` 為您的依賴項，
> 那麼您應該將它們替換為 `kotlin-stdlib`。
>
{style="note"}

請注意，混用不同版本的 stdlib 構件可能導致類別重複或缺少類別。
為避免這種情況，Kotlin Gradle 外掛程式可以幫助您[對齊 stdlib 版本](#usage-of-the-latest-kotlin-stdlib-version-in-transitive-dependencies)。

### cbrt()

`cbrt()` 函式，它允許您計算 `double` 或 `float` 的實數立方根，現已穩定。

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

### Java 和 Kotlin 之間的 TimeUnit 轉換

`kotlin.time` 中的 `toTimeUnit()` 和 `toDurationUnit()` 函式現已穩定。
這些函式在 Kotlin 1.6.0 中作為實驗性功能引入，改善了 Kotlin 和 Java 之間的互通性。
您現在可以輕鬆地在 Java `java.util.concurrent.TimeUnit` 和 Kotlin `kotlin.time.DurationUnit` 之間轉換。
這些函式僅在 JVM 上支援。

```kotlin
import kotlin.time.*

// For use from Java
fun wait(timeout: Long, unit: TimeUnit) {
    val duration: Duration = timeout.toDuration(unit.toDurationUnit())
    ...
}
```

### 可比較和可相減的 TimeMarks

> `TimeMarks` 的新功能是[實驗性](components-stability.md#stability-levels-explained)的，要使用它
> 您需要透過使用 `@OptIn(ExperimentalTime::class)` 或 `@ExperimentalTime` 選擇性加入。
>
{style="warning"}

在 Kotlin 1.8.0 之前，如果您想計算多個 `TimeMarks` 和**現在**之間的時間差，您
一次只能在一個 `TimeMark` 上呼叫 `elapsedNow()`。這使得比較結果變得困難，
因為兩個 `elapsedNow()` 函式呼叫無法在完全相同的時間執行。

為了解決這個問題，在 Kotlin 1.8.0 中，您可以從相同的時間來源相減和比較 `TimeMarks`。
現在您可以建立一個新的 `TimeMark` 實例來表示**現在**，並從中減去其他 `TimeMarks`。
這樣，您從這些計算中收集到的結果保證是彼此相對的。

```kotlin
import kotlin.time.*
fun main() {
//sampleStart
    val timeSource = TimeSource.Monotonic
    val mark1 = timeSource.markNow()
    Thread.sleep(500) // Sleep 0.5 秒
    val mark2 = timeSource.markNow()

    // Before 1.8.0
    repeat(4) { n ->
        val elapsed1 = mark1.elapsedNow()
        val elapsed2 = mark2.elapsedNow()

        // Difference between elapsed1 and elapsed2 can vary depending 
        // on how much time passes between the two elapsedNow() calls
        println("Measurement 1.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    println()

    // Since 1.8.0
    repeat(4) { n ->
        val mark3 = timeSource.markNow()
        val elapsed1 = mark3 - mark1
        val elapsed2 = mark3 - mark2

        // Now the elapsed times are calculated relative to mark3, 
        // which is a fixed value
        println("Measurement 2.${n + 1}: elapsed1=$elapsed1, " +
                "elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
    }
    // It's also possible to compare time marks with each other
    // This is true, as mark2 was captured later than mark1
    println(mark2 > mark1)
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.8"}

此新功能在動畫計算中特別有用，您可以計算或比較代表不同影格的多個 `TimeMarks` 之間的差異。

### 遞迴複製或刪除目錄

> 這些用於 `java.nio.file.Path` 的新函式是[實驗性](components-stability.md#stability-levels-explained)的。
> 要使用它們，您需要透過 `@OptIn(kotlin.io.path.ExperimentalPathApi::class)` 或 `@kotlin.io.path.ExperimentalPathApi` 選擇性加入。
> 或者，您可以使用編譯器選項 `-opt-in=kotlin.io.path.ExperimentalPathApi`。
>
{style="warning"}

我們引入了兩個新的 `java.nio.file.Path` 擴展函式，`copyToRecursively()` 和 `deleteRecursively()`，
它們允許您遞迴地：

*   將目錄及其內容複製到另一個目的地。
*   刪除目錄及其內容。

這些函式作為備份過程的一部分非常有用。

#### 錯誤處理

使用 `copyToRecursively()`，您可以透過重載 `onError` lambda 函式來定義在複製時發生例外情況應如何處理：

```kotlin
sourceRoot.copyToRecursively(destinationRoot, followLinks = false,
    onError = { source, target, exception ->
        logger.logError(exception, "無法將 $source 複製到 $target")
        OnErrorResult.TERMINATE
    })
```
{validate="false"}

當您使用 `deleteRecursively()` 時，如果刪除檔案或資料夾時發生例外，則該檔案或資料夾將被跳過。
一旦刪除完成，`deleteRecursively()` 會拋出一個 `IOException`，其中包含所有發生的例外作為被抑制的例外。

#### 檔案覆寫

如果 `copyToRecursively()` 發現目標目錄中已存在檔案，則會發生例外。
如果您想覆寫檔案，請使用帶有 `overwrite` 作為參數的重載並將其設定為 `true`：

```kotlin
fun setUpEnvironment(projectDirectory: Path, fixtureName: String) {
    fixturesRoot.resolve(COMMON_FIXTURE_NAME)
        .copyToRecursively(projectDirectory, followLinks = false)
    fixturesRoot.resolve(fixtureName)
        .copyToRecursively(projectDirectory, followLinks = false,
            overwrite = true) // 修補通用夾具
}
```
{validate="false"}

#### 自訂複製操作

要定義您自己的自訂複製邏輯，請使用帶有 `copyAction` 作為額外參數的重載。
透過使用 `copyAction`，您可以提供一個 lambda 函式，例如，包含您偏好的操作：

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

有關這些擴展函式的更多資訊，請參閱我們的 [API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io.path/java.nio.file.-path/copy-to-recursively.html)。

### Java Optionals 擴展函式

在 [Kotlin 1.7.0](whatsnew17.md#new-experimental-extension-functions-for-java-optionals) 中引入的擴展函式現已穩定。
這些函式簡化了 Java 中 Optional 類別的使用。它們可用於在 JVM 上解包和轉換
`Optional` 物件，並使使用 Java API 更簡潔。有關更多資訊，
請參閱 [Kotlin 1.7.0 有什麼新功能](whatsnew17.md#new-experimental-extension-functions-for-java-optionals)。

### 提升 kotlin-reflect 效能

利用 `kotlin-reflect` 現在以 JVM 目標 1.8 編譯的事實，我們將內部
快取機制遷移到 Java 的 `ClassValue`。之前我們只快取 `KClass`，但我們現在也快取 `KType` 和
`KDeclarationContainer`。這些變更在調用 `typeOf()` 時顯著提升了效能。

## 文件更新

Kotlin 文件收到了一些顯著的變更：

### 改版與新頁面

*   [Gradle 概覽](gradle.md) – 了解如何使用 Gradle 建構系統配置和建構 Kotlin 專案，
    Kotlin Gradle 外掛程式中可用的編譯器選項、編譯和快取。
*   [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md) – 了解 Java 和 Kotlin 處理可能可空變數方法的差異。
*   [Lincheck 指南](lincheck-guide.md) – 了解如何設定和使用 Lincheck 框架來測試 JVM 上的並發演算法。

### 新與更新的教學

*   [開始使用 Gradle 和 Kotlin/JVM](get-started-with-jvm-gradle-project.md) – 使用 IntelliJ IDEA 和 Gradle 建立控制台應用程式。
*   [使用 Ktor 和 SQLDelight 建立多平台應用程式](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html) – 使用 Kotlin Multiplatform Mobile 建立適用於 iOS 和 Android 的行動應用程式。
*   [開始使用 Kotlin 多平台](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html) – 了解使用 Kotlin 進行跨平台行動開發，並建立一個同時適用於 Android 和 iOS 的應用程式。

## 安裝 Kotlin 1.8.0

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 2021.3、2022.1 和 2022.2 自動建議將
Kotlin 外掛程式更新到 1.8.0 版本。IntelliJ IDEA 2022.3 將在即將到來的小型更新中捆綁 1.8.0 版本的 Kotlin 外掛程式。

> 要在 IntelliJ IDEA 2022.3 中將現有專案遷移到 Kotlin 1.8.0，請將 Kotlin 版本變更為 `1.8.0` 並重新匯入
> 您的 Gradle 或 Maven 專案。
>
{style="note"}

對於 Android Studio Electric Eel (221) 和 Flamingo (222)，1.8.0 版本的 Kotlin 外掛程式將隨即將到來的 Android Studios 更新一起交付。新的命令列編譯器可在 [GitHub 發布頁面](https://github.com/JetBrains/kotlin/releases/tag/v1.8.0)下載。

## Kotlin 1.8.0 相容性指南

Kotlin 1.8.0 是一個[功能發布版本](kotlin-evolution-principles.md#language-and-tooling-releases)，因此，
它可能帶來與您為早期語言版本編寫的程式碼不相容的變更。請在 [Kotlin 1.8.0 相容性指南](compatibility-guide-18.md)中找到這些變更的詳細列表。