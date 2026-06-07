[//]: # (title: Kotlin 2.2.x 相容性指南)

_[「保持語言現代化」](kotlin-evolution-principles.md)_與 _「舒適的更新」_ (kotlin-evolution-principles.md) 是 Kotlin 語言設計的核心原則。前者指出應該移除阻礙語言演進的結構，後者則強調這類移除應事先進行充分溝通，以確保程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（如更新日誌或編譯器警告）發布，但本文件總結了所有變更，為從 Kotlin 2.1 遷移至 Kotlin 2.2 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼_：原始碼不相容的變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
- _二進位_：如果更換兩個二進位產物不會導致載入或連結錯誤，則稱這兩個二進位產物為二進位相容。
- _行為_：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請注意，這些定義僅針對純 Kotlin。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文件討論範圍內。

## 語言

### 停止在 `-language-version` 中對 1.6 與 1.7 的支援

> **問題**：[KT-71793](https://youtrack.jetbrains.com/issue/KT-71793)
>
> **組件**：編譯器
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：從 Kotlin 2.2 開始，編譯器不再支援 [`-language-version=1.6`](compiler-reference.md#language-version-version) 或 `-language-version=1.7`。這意味著不再支援早於 1.8 的語言特性集。然而，語言本身仍然與 Kotlin 1.0 完全向後相容。
>
> **棄用週期**：
>
> - 2.1.0：在使用 `-language-version` 為 1.6 與 1.7 時發出警告
> - 2.2.0：在使用 `-language-version` 為 1.8 與 1.9 時發出警告；將 1.6 與 1.7 版本的警告提升為錯誤

### 預設為有註解的 Lambda 啟用 invokedynamic

> **問題**：[KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡短摘要**：帶有註解的 Lambda 現在預設透過 `LambdaMetafactory` 使用 `invokedynamic`，使其行為與 Java Lambda 一致。這會影響依賴於從產生的 Lambda 類別中獲取註解的反射程式碼。要恢復舊有行為，請使用 `-Xindy-allow-annotated-lambdas=false` 編譯器選項。
>
> **棄用週期**：
>
> - 2.2.0：預設為有註解的 Lambda 啟用 `invokedynamic`

### 在 K2 中禁止對具有差異（variance）擴展型別的型別別名進行建構函式呼叫與繼承

> **問題**：[KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：K2 編譯器不再支援對擴展為使用 `out` 等差異修飾符型別的型別別名進行建構函式呼叫與繼承。這解決了原先不允許使用原始型別，但允許透過型別別名進行相同操作的不一致問題。要進行遷移，請在需要的地方明確使用原始型別。
>
> **棄用週期**：
>
> - 2.0.0：針對擴展為具有差異修飾符型別的型別別名，在其建構函式呼叫或父型別使用時發出警告
> - 2.2.0：將警告提升為錯誤

### 禁止從 Kotlin getter 產生合成屬性

> **問題**：[KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：不再允許為 Kotlin 中定義的 getter 提供合成屬性。這會影響 Java 類別繼承 Kotlin 類別的情況，以及處理 `java.util.LinkedHashSet` 等對應型別的情況。要進行遷移，請將屬性存取替換為直接呼叫對應的 getter 函式。
>
> **棄用週期**：
>
> - 2.0.0：針對存取從 Kotlin getter 建立的合成屬性發出警告
> - 2.2.0：將警告提升為錯誤

### 更改 JVM 上介面函式的預設方法產生方式

> **問題**：[KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **組件**：核心語言
>
> **不相容變更類型**：二進位
>
> **簡短摘要**：除非另有配置，否則介面中宣告的函式現在會編譯為 JVM 預設方法。當不相關的父型別定義了衝突的實作時，這可能會導致 Java 程式碼中的編譯錯誤。此行為受穩定的 `-jvm-default` 編譯器選項控制，該選項取代了現已棄用的 `-Xjvm-default` 選項。要恢復以前的行為（即僅在 `DefaultImpls` 類別和子類別中產生預設實作），請使用 `-jvm-default=disable`。
>
> **棄用週期**：
>
> - 2.2.0：`-jvm-default` 編譯器選項預設設定為 `enable`

### 禁止在註解屬性上使用針對欄位（field-targeted）的註解

> **問題**：[KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：不再允許在註解屬性上使用針對欄位的註解。雖然這些註解沒有可觀察到的效果，但此變更可能會影響依賴於它們的自訂 IR 外掛程式。要進行遷移，請從屬性中移除針對欄位的註解。
>
> **棄用週期**：
>
> - 2.1.0：棄用註解屬性上的 `@JvmField` 註解並發出警告
> - 2.1.20：針對註解屬性上所有針對欄位的註解發出警告
> - 2.2.0：將警告提升為錯誤

### 禁止在型別別名中使用具體化（reified）型別參數

> **問題**：[KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：不再允許在型別別名中的型別參數上使用 `reified` 修飾符。具體化型別參數僅在內嵌函式中有效，因此在型別別名中使用它們沒有任何效果。要進行遷移，請從 `typealias` 宣告中移除 `reified` 修飾符。
>
> **棄用週期**：
>
> - 2.1.0：針對型別別名中的具體化型別參數發出警告
> - 2.2.0：將警告提升為錯誤

### 修正針對 `Number` 與 `Comparable` 的內嵌值類別型別檢查

> **問題**：[KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **組件**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：在 `is` 與 `as` 檢查中，內嵌值類別不再被視為 `java.lang.Number` 或 `java.lang.Comparable` 的實作者。這些檢查先前在應用於裝箱的內嵌類別時會傳回錯誤結果。最佳化現在僅適用於原始型別及其包裝函式。
>
> **棄用週期**：
>
> - 2.2.0：啟用新行為

### 禁止來自間接相依性且無法存取的泛型型別

> **問題**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：當使用來自編譯器不可見的間接相依性型別時，K2 編譯器現在會回報錯誤。這會影響 Lambda 參數或泛型型別引數等情況，其中引用的型別因缺少相依性而無法使用。
>
> **棄用週期**：
>
> - 2.0.0：針對 Lambda 中無法存取的泛型型別以及某些無法存取的泛型型別引數使用回報錯誤；針對 Lambda 中無法存取的非泛型型別以及運算式與父型別中無法存取的型別引數發出警告
> - 2.1.0：將 Lambda 中無法存取的非泛型型別警告提升為錯誤
> - 2.2.0：將運算式型別中無法存取的型別引數警告提升為錯誤

### 強制執行型別參數邊界的可見性檢查

> **問題**：[KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：函式與屬性不再能使用比宣告本身具有更嚴格可見性的型別參數邊界。這防止了間接公開無法存取的型別，這種情況以前可以編譯而不會出錯，但在某些情況下會導致執行階段失敗或 IR 驗證錯誤。
>
> **棄用週期**：
>
> - 2.1.0：當型別參數的邊界在宣告的可見性範圍內不可見時發出警告
> - 2.2.0：將警告提升為錯誤

### 在非私有內嵌函式中公開私有型別時回報錯誤

> **問題**：[KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：不再允許從非私有內嵌函式存取私有型別、函式或屬性。要進行遷移，請避免引用私有實體、將函式設為私有，或移除 `inline` 修飾符。請注意，移除 `inline` 會破壞二進位相容性。
>
> **棄用週期**：
>
> - 2.2.0：從非私有內嵌函式存取私有型別或成員時回報錯誤

### 禁止在作為參數預設值的 Lambda 中使用非區域回傳（non-local returns）

> **問題**：[KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：不再允許在作為參數預設值的 Lambda 中使用非區域 return 陳述式。此模式先前可以編譯，但會導致執行階段崩潰。要進行遷移，請重寫 Lambda 以避免非區域回傳，或將邏輯移至預設值之外。
>
> **棄用週期**：
>
> - 2.2.0：針對作為參數預設值的 Lambda 中的非區域回傳回報錯誤

## 標準函式庫

### 棄用 `kotlin.native.Throws`

> **問題**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **組件**：Kotlin/Native
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `kotlin.native.Throws`；請改用通用的 [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) 註解。
>
> **棄用週期**：
>
> - 1.9.0：使用 `kotlin.native.Throws` 時發出警告
> - 2.2.0：將警告提升為錯誤

### 棄用 `AbstractDoubleTimeSource`

> **問題**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **組件**：kotlin-stdlib
>
> **不相容變改類型**：原始碼
>
> **簡短摘要**：棄用 `AbstractDoubleTimeSource`；請改用 [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/)。
>
> **棄用週期**：
>
> - 1.8.20：使用 `AbstractDoubleTimeSource` 時發出警告
> - 2.2.0：將警告提升為錯誤

## 工具

### 修正 `KotlinCompileTool` 中的 `setSource()` 函式以替換原始碼

> **問題**：[KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **組件**：Gradle
>
> **不相容變更類型**：行為
>
> **簡短摘要**：[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 介面中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函式現在會替換已配置的原始碼，而非將其加入。如果您想在不替換現有原始碼的情況下新增原始碼，請使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函式。
>
> **棄用週期**：
>
> - 2.2.0：啟用新行為

### 棄用 `KotlinCompilationOutput#resourcesDirProvider` 屬性

> **問題**：[KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `KotlinCompilationOutput#resourcesDirProvider` 屬性。請在您的 Gradle 組建指令碼中改用 [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) 來新增額外的資源目錄。
>
> **棄用週期**：
>
> - 2.1.0：棄用 `KotlinCompilationOutput#resourcesDirProvider` 並發出警告
> - 2.2.0：將警告提升為錯誤

### 棄用 `BaseKapt.annotationProcessorOptionProviders` 屬性

> **問題**：[KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 [`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 屬性，改用 `BaseKapt.annotationProcessorOptionsProviders`，後者接受 `ListProperty<CommandLineArgumentProvider>` 而非 `MutableList<Any>`。這明確定義了預期的元素型別，並防止了因新增錯誤元素（如巢狀清單）而導致的執行階段失敗。如果您目前的程式碼將清單作為單個元素新增，請將 `add()` 函式替換為 `addAll()` 函式。
>
> **棄用週期**：
>
> - 2.2.0：在 API 中強制執行新型別

### 棄用 `kotlin-android-extensions` 外掛程式

> **問題**：[KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `kotlin-android-extensions` 外掛程式。請改用獨立外掛程式 [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize) 來產生 `Parcelable` 實作，並使用 Android Jetpack 的 [view bindings](https://developer.android.com/topic/libraries/view-binding) 取代合成視圖。
>
> **棄用週期**：
>
> - 1.4.20：棄用此外掛程式
> - 2.1.20：引入配置錯誤，且不再執行外掛程式程式碼
> - 2.2.0：移除外掛程式程式碼
> - 2.4.0：移除外掛程式 ID

### 棄用 `kotlinOptions` DSL

> **問題**：[KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：透過 `kotlinOptions` DSL 以及相關的 `KotlinCompile<KotlinOptions>` 任務介面配置編譯器選項的功能已被棄用，改用新的 `compilerOptions` DSL。作為此棄用的一部分，`kotlinOptions` 介面中的所有屬性現在也分別標記為棄用。要進行遷移，請使用 `compilerOptions` DSL 來配置編譯器選項。有關遷移指南，請參閱 [從 `kotlinOptions {}` 遷移至 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **棄用週期**：
>
> - 2.0.0：針對 `kotlinOptions` DSL 發出警告
> - 2.2.0：將警告提升為錯誤，並棄用 `kotlinOptions` 中的所有屬性

### 移除 `kotlin.incremental.useClasspathSnapshot` 屬性

> **問題**：[KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：移除 `kotlin.incremental.useClasspathSnapshot` Gradle 屬性。此屬性控制現已棄用的 JVM 基於歷程記錄的累加編譯模式，該模式已被 Kotlin 1.8.20 起預設啟用的基於類別路徑的方法取代。
>
> **棄用週期**：
>
> - 2.0.20：棄用 `kotlin.incremental.useClasspathSnapshot` 屬性並發出警告
> - 2.2.0：移除該屬性

### Kotlin 指令碼棄用項

> **問題**：[KT-71685](https://youtrack.jetbrains.com/issue/KT-71685), [KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/), [KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/)。
>
> **組件**：指令碼
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 2.2.0 棄用對以下內容的支援：
>   * REPL：要繼續透過 `kotlinc` 使用 REPL，請使用 `-Xrepl` 編譯器選項進行加入。
>   * JSR-223：由於 [JSR](https://jcp.org/en/jsr/detail?id=223) 處於 **Withdrawn**（撤回）狀態。JSR-223 實作在語言版本 1.9 中仍可繼續運作，但目前沒有計劃在未來遷移至 K2 編譯器。
>   * `KotlinScriptMojo` Maven 外掛程式。如果您繼續使用它，將會看到編譯器警告。
>
> 欲了解更多資訊，請參閱我們的 [部落格文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。
>
> **棄用週期**：
>
> - 2.1.0：針對在 `kotlinc` 中使用 REPL 發出警告
> - 2.2.0：要透過 `kotlinc` 使用 REPL，請使用 `-Xrepl` 編譯器選項進行加入；棄用 JSR-223，可透過切換至語言版本 1.9 恢復支援；棄用 `KotlinScriptMojo` Maven 外掛程式
> - 2.4.0：移除透過 `KotlinScriptMojo` Maven 外掛程式執行的 Kotlin 指令碼

### 棄用消除歧義的分類器屬性

> **問題**：[KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：曾用於控制 Kotlin Gradle 外掛程式如何消除原始碼集名稱歧義與 IDE 匯入歧義的選項已過時。因此，`KotlinTarget` 介面中的下列屬性現已棄用：
>
> * `useDisambiguationClassifierAsSourceSetNamePrefix`
> * `overrideDisambiguationClassifierOnIdeImport`
>
> **棄用週期**：
>
> - 2.0.0：當使用這些 Gradle 屬性時發出警告
> - 2.1.0：將此警告提升為錯誤
> - 2.2.0：移除 Gradle 屬性

### 棄用共通化（commonization）參數

> **問題**：[KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin Gradle 外掛程式中實驗性共通化模式的參數已被棄用。這些參數可能會產生無效的編譯產物並被快取。要刪除受影響的產物：
>
> 1. 從您的 `gradle.properties` 檔案中移除下列選項：
>
>    ```none
>    kotlin.mpp.enableOptimisticNumberCommonization
>    kotlin.mpp.enablePlatformIntegerCommonization
>    ```
>
> 2. 清除 `~/.konan/*/klib/commonized` 目錄中的共通化快取，或執行下列指令：
>
>    ```bash
>    ./gradlew cleanNativeDistributionCommonization
>    ```
>
> **棄用週期**：
>
> - 2.2.0：棄用共通化參數並回報錯誤
> - 2.2.20：移除共通化參數

### 棄用對舊版元資料編譯的支援

> **問題**：[KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：用於設定階層結構以及在通用與中間原始碼集之間建立中間原始碼集的選項已過時。移除下列編譯器選項：
> 
> * `isCompatibilityMetadataVariantEnabled`
> * `withGranularMetadata`
> * `isKotlinGranularMetadataEnabled`
>
> **棄用週期**：
>
> - 2.2.0：從 Kotlin Gradle 外掛程式中移除編譯器選項

### 棄用 `KotlinCompilation.source` API

> **問題**：[KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：允許將 Kotlin 原始碼集直接加入 Kotlin 編譯的 `KotlinCompilation.source` API 已被棄用。
>
> **棄用週期**：
>
> - 1.9.0：使用 `KotlinCompilation.source` 時發出警告
> - 1.9.20：將此警告提升為錯誤
> - 2.2.0：從 Kotlin Gradle 外掛程式中移除 `KotlinCompilation.source`；在編譯組建指令碼時，嘗試使用它會導致「無法辨識的引用（unresolved reference）」錯誤

### 棄用目標預設（target presets）API

> **問題**：[KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 多平台目標的目標預設已過時；`jvm()` 或 `iosSimulatorArm64()` 等目標 DSL 函式現在涵蓋了相同的使用案例。所有與預設相關的 API 均已棄用：
> 
> * `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 屬性
> * `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 介面及其所有繼承者
> * `fromPreset` 多載
>
> **棄用週期**：
>
> - 1.9.20：針對任何預設相關 API 的使用發出警告
> - 2.0.0：將此警告提升為錯誤
> - 2.2.0：從 Kotlin Gradle 外掛程式的公開 API 中移除預設相關 API；仍在使用它的原始碼將因「無法辨識的引用」錯誤而失敗，且二進位產物（例如 Gradle 外掛程式）除非針對最新版本的 Kotlin Gradle 外掛程式重新編譯，否則可能會因連結錯誤而失敗

### 棄用 Apple 目標捷徑

> **問題**：[KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 多平台 DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目標捷徑已被棄用。這些捷徑原本設計用於為 Apple 目標建立部分原始碼集階層。Kotlin 多平台 Gradle 外掛程式現在提供內建的階層範本。請改為指定目標列表，外掛程式會自動為其設定中間原始碼集。
>
> **棄用週期**：
>
> - 1.9.20：使用目標捷徑時發出警告；預設改為啟用預設階層範本
> - 2.1.0：使用目標捷徑時回報錯誤
> - 2.2.0：從 Kotlin 多平台 Gradle 外掛程式中移除目標捷徑 DSL

### 棄用 `publishAllLibraryVariants()` 函式

> **問題**：[KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `publishAllLibraryVariants()` 函式。它原本設計用於發布 Android 目標的所有組建變體。現在不建議使用此方法，因為它可能會導致變體解析問題，尤其是在使用多種 flavor 和組建類型時。請改用指定組建變體的 `publishLibraryVariants()` 函式。
>
> **棄用週期**：
>
> - 2.2.0：`publishAllLibraryVariants()` 已棄用

### 棄用 `android` 目標

> **問題**：[KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：目前 Kotlin DSL 中的 `android` 目標名稱已被棄用。請改用 `androidTarget`。
>
> **棄用週期**：
>
> - 1.9.0：當在 Kotlin 多平台專案中使用 `android` 名稱時，引入棄用警告
> - 2.1.0：將此警告提升為錯誤
> - 2.2.0：從 Kotlin 多平台 Gradle 外掛程式中移除 `android` 目標 DSL

### 棄用 `konanVersion` 在 `CInteropProcess` 中

> **問題**：[KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `CInteropProcess` 任務中的 `konanVersion` 屬性。請改用 `CInteropProcess.kotlinNativeVersion`。
>
> **棄用週期**：
>
> - 2.1.0：使用 `konanVersion` 屬性時發出警告
> - 2.2.0：將此警告提升為錯誤
> - 2.3.0：從 Kotlin Gradle 外掛程式中移除 `konanVersion` 屬性

### 棄用 `destinationDir` 在 `CInteropProcess` 中

> **問題**：[KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `CInteropProcess` 任務中的 `destinationDir` 屬性。請改用 `CInteropProcess.destinationDirectory.set()` 函式。
>
> **棄用週期**：
>
> - 2.1.0：使用 `destinationDir` 屬性時發出警告
> - 2.2.0：將此警告提升為錯誤
> - 2.3.0：從 Kotlin Gradle 外掛程式中移除 `destinationDir` 屬性

### 棄用 `kotlinArtifacts` API

> **問題**：[KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用實驗性 `kotlinArtifacts` API。請使用 Kotlin Gradle 外掛程式中現有的 DSL 來[建置最終原生二進位檔](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。如果這不足以支援遷移，請在[此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-74953)中留言。
>
> **棄用週期**：
>
> - 2.2.0：使用 `kotlinArtifacts` API 時發出警告
> - 2.3.0：將此警告提升為錯誤