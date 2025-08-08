[//]: # (title: Kotlin 2.2 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計的根本原則。前者指出應移除阻礙語言演進的建構，後者則要求在移除前充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）發布，但本文件將它們全部總結，為從 Kotlin 2.1 遷移到 Kotlin 2.2 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

-   _原始碼_：原始碼不相容變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再次編譯。
-   _二進位_：如果兩個二進位成品在互換時不會導致載入或連結錯誤，則稱它們為二進位相容。
-   _行為_：如果同一程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如 Java）來看的 Kotlin 程式碼相容性不在本文件範圍內。

## 語言

### 預設為帶註解的 Lambda 啟用 invokedynamic

> **問題**：[KTLC-278](https://youtrack.jetbrains.com/issue/KTLC-278)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要總結**：帶註解的 Lambda 運算式現在預設透過 `LambdaMetafactory` 使用 `invokedynamic`，使其行為與 Java Lambda 運算式保持一致。這會影響依賴於從生成的 Lambda 類別中檢索註解的基於反射的程式碼。要恢復舊行為，請使用 `-Xindy-allow-annotated-lambdas=false` 編譯器選項。
>
> **棄用週期**：
>
> -   2.2.0：預設啟用帶註解 Lambda 運算式的 `invokedynamic`

### 禁止在 K2 中對展開型別包含變數的型別別名進行建構函數呼叫和繼承

> **問題**：[KTLC-4](https://youtrack.jetbrains.com/issue/KTLC-4)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：K2 編譯器不再支援使用展開為帶有變數修飾符（例如 `out`）的型別別名進行建構函數呼叫和繼承。這解決了原始型別不被允許使用，但透過型別別名卻允許相同用法的不一致問題。若要遷移，請在需要時明確使用原始型別。
>
> **棄用週期**：
>
> -   2.0.0：報告對展開為帶有變數修飾符的型別別名進行建構函數呼叫或超型別使用時的警告
> -   2.2.0：將警告升級為錯誤

### 禁止從 Kotlin 的 getter 產生合成屬性

> **問題**：[KTLC-272](https://youtrack.jetbrains.com/issue/KTLC-272)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin 中定義的 getter 不再允許使用合成屬性。這會影響 Java 類別繼承 Kotlin 類別以及處理諸如 `java.util.LinkedHashSet` 等映射型別的情況。若要遷移，請將屬性存取替換為直接呼叫對應的 getter 函數。
>
> **棄用週期**：
>
> -   2.0.0：報告從 Kotlin getter 建立的合成屬性存取警告
> -   2.2.0：將警告升級為錯誤

### 變更 JVM 介面函數的預設方法產生方式

> **問題**：[KTLC-269](https://youtrack.jetbrains.com/issue/KTLC-269)
>
> **組件**：核心語言
>
> **不相容變更類型**：二進位
>
> **簡要總結**：在介面中宣告的函數現在編譯為 JVM 預設方法，除非另有配置。這可能導致 Java 程式碼在不相關的超型別定義衝突實作時出現編譯錯誤。此行為由穩定的 `-jvm-default` 編譯器選項控制，該選項取代了現在已棄用的 `-Xjvm-default` 選項。若要恢復之前的行為（預設實作僅在 `DefaultImpls` 類別和子類別中產生），請使用 `-jvm-default=disable`。
>
> **棄用週期**：
>
> -   2.2.0：`-jvm-default` 編譯器選項預設設定為 `enable`

### 禁止在註解屬性上使用欄位目標註解

> **問題**：[KTLC-7](https://youtrack.jetbrains.com/issue/KTLC-7)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：欄位目標註解不再允許用於註解屬性。儘管這些註解沒有可觀察到的效果，但此變更可能會影響依賴於它們的客製化 IR 外掛程式。若要遷移，請從屬性中移除欄位目標註解。
>
> **棄用週期**：
>
> -   2.1.0：`@JvmField` 註解在註解屬性上被棄用並發出警告
> -   2.1.20：報告對註解屬性上所有欄位目標註解的警告
> -   2.2.0：將警告升級為錯誤

### 禁止在型別別名中使用實體化型別參數

> **問題**：[KTLC-5](https://youtrack.jetbrains.com/issue/KTLC-5)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：型別別名中的型別參數不再允許使用 `reified` 修飾符。實體化型別參數僅在內聯函數中有效，因此在型別別名中使用它們沒有任何效果。若要遷移，請從 `typealias` 宣告中移除 `reified` 修飾符。
>
> **棄用週期**：
>
> -   2.1.0：報告型別別名中實體化型別參數的警告
> -   2.2.0：將警告升級為錯誤

### 針對 `Number` 和 `Comparable` 正確檢查內聯值類別的型別

> **問題**：[KTLC-21](https://youtrack.jetbrains.com/issue/KTLC-21)
>
> **組件**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡要總結**：內聯值類別在 `is` 和 `as` 檢查中不再被視為 `java.lang.Number` 或 `java.lang.Comparable` 的實作者。這些檢查以前在套用於裝箱的內聯類別時會返回不正確的結果。現在，此最佳化僅適用於基本型別及其包裝類。
>
> **棄用週期**：
>
> -   2.2.0：啟用新行為

### 禁止從間接依賴項中存取不可存取的泛型型別

> **問題**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：K2 編譯器現在在使用編譯器不可見的間接依賴項中的型別時會報告錯誤。這會影響諸如 Lambda 參數或泛型型別引數等情況，其中由於缺少依賴項而無法使用引用的型別。
>
> **棄用週期**：
>
> -   2.0.0：報告 Lambda 運算式中不可存取的泛型型別和所選用的不可存取泛型型別引數的錯誤；報告 Lambda 運算式中不可存取的非泛型型別和運算式和超型別中不可存取型別引數的警告
> -   2.1.0：將 Lambda 運算式中不可存取的非泛型型別的警告升級為錯誤
> -   2.2.0：將運算式型別中不可存取型別引數的警告升級為錯誤

### 強制執行型別參數邊界的可見性檢查

> **問題**：[KTLC-274](https://youtrack.jetbrains.com/issue/KTLC-274)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：函數和屬性不再可以使用比宣告本身具有更嚴格可見性的型別參數邊界。這會阻止間接暴露不可存取型別，之前編譯時沒有錯誤，但在某些情況下會導致執行時失敗或 IR 驗證錯誤。
>
> **棄用週期**：
>
> -   2.1.0：當型別參數具有從宣告的可見性範圍不可見的邊界時報告警告
> -   2.2.0：將警告升級為錯誤

### 在非私有內聯函數中暴露私有型別時報告錯誤

> **問題**：[KT-70916](https://youtrack.jetbrains.com/issue/KT-70916)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：不再允許從非私有內聯函數存取私有型別、函數或屬性。若要遷移，請避免引用私有實體，或者將函數設定為私有，或者移除 `inline` 修飾符。請注意，移除 `inline` 會破壞二進位相容性。
>
> **棄用週期**：
>
> -   2.2.0：在從非私有內聯函數存取私有型別或成員時報告錯誤

### 禁止在用作參數預設值的 Lambda 中進行非局部返回

> **問題**：[KTLC-286](https://youtrack.jetbrains.com/issue/KTLC-286)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：不再允許在用作參數預設值的 Lambda 運算式中使用非局部返回語句。這種模式之前可以編譯，但會導致執行時崩潰。若要遷移，請重寫 Lambda 運算式以避免非局部返回，或將邏輯移至預設值之外。
>
> **棄用週期**：
>
> -   2.2.0：報告在用作參數預設值的 Lambda 運算式中進行非局部返回的錯誤

## 標準函式庫

### 棄用 `kotlin.native.Throws`

> **問題**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **組件**：Kotlin/Native
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`kotlin.native.Throws` 已棄用；請改用通用的 [`kotlin.Throws`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-throws/) 註解。
>
> **棄用週期**：
>
> -   1.9.0：使用 `kotlin.native.Throws` 時報告警告
> -   2.2.0：將警告升級為錯誤

### 棄用 `AbstractDoubleTimeSource`

> **問題**：[KT-72137](https://youtrack.jetbrains.com/issue/KT-72137)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`AbstractDoubleTimeSource` 已棄用；請改用 [`AbstractLongTimeSource`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/-abstract-long-time-source/)。
>
> **棄用週期**：
>
> -   1.8.20：使用 `AbstractDoubleTimeSource` 時報告警告
> -   2.2.0：將警告升級為錯誤

## 工具

### 更正 `KotlinCompileTool` 中的 `setSource()` 函數以替換原始碼

> **問題**：[KT-59632](https://youtrack.jetbrains.com/issue/KT-59632)
>
> **組件**：Gradle
>
> **不相容變更類型**：行為
>
> **簡要總結**：[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 介面中的 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 函數現在會替換已配置的原始碼，而不是將其新增到現有原始碼。如果您想在不替換現有原始碼的情況下新增原始碼，請使用 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 函數。
>
> **棄用週期**：
>
> -   2.2.0：啟用新行為

### 棄用 `KotlinCompilationOutput#resourcesDirProvider` 屬性

> **問題**：[KT-70620](https://youtrack.jetbrains.com/issue/KT-70620)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`KotlinCompilationOutput#resourcesDirProvider` 屬性已棄用。請改用 Gradle 建構指令碼中的 [`KotlinSourceSet.resources`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/resources.html) 來新增額外的資源目錄。
>
> **棄用週期**：
>
> -   2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 被棄用並發出警告
> -   2.2.0：將警告升級為錯誤

### 棄用 `BaseKapt.annotationProcessorOptionProviders` 屬性

> **問題**：[KT-58009](https://youtrack.jetbrains.com/issue/KT-58009)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：[`BaseKapt.annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 屬性已棄用，取而代之的是 `BaseKapt.annotationProcessorOptionsProviders`，後者接受 `ListProperty<CommandLineArgumentProvider>` 而不是 `MutableList<Any>`。這明確定義了預期的元素型別，並防止由於新增不正確的元素（例如巢狀列表）而導致的執行時失敗。如果您目前的程式碼將列表作為單個元素新增，請將 `add()` 函數替換為 `addAll()` 函數。
>
> **棄用週期**：
>
> -   2.2.0：在 API 中強制執行新類型

### 棄用 `kotlin-android-extensions` 外掛程式

> **問題**：[KT-72341](https://youtrack.jetbrains.com/issue/KT-72341/)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`kotlin-android-extensions` 外掛程式已棄用。請針對 `Parcelable` 實作生成器使用單獨的外掛程式 [`kotlin-parcelize`](https://plugins.gradle.org/plugin/org.jetbrains.kotlin.plugin.parcelize)，並針對合成視圖使用 Android Jetpack 的 [視圖綁定](https://developer.android.com/topic/libraries/view-binding)。
>
> **棄用週期**：
>
> -   1.4.20：外掛程式已棄用
> -   2.1.20：引入配置錯誤，不執行外掛程式碼
> -   2.2.0：外掛程式碼已移除

### 棄用 `kotlinOptions` DSL

> **問題**：[KT-54110](https://youtrack.jetbrains.com/issue/KT-54110)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：透過 `kotlinOptions` DSL 和相關的 `KotlinCompile<KotlinOptions>` 任務介面配置編譯器選項的功能已棄用，取而代之的是新的 `compilerOptions` DSL。作為此次棄用的一部分，`kotlinOptions` 介面中的所有屬性現在也都被單獨標記為已棄用。若要遷移，請使用 `compilerOptions` DSL 配置編譯器選項。有關遷移指南，請參閱[從 `kotlinOptions {}` 遷移到 `compilerOptions {}`](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)。
>
> **棄用週期**：
>
> -   2.0.0：報告 `kotlinOptions` DSL 的警告
> -   2.2.0：將警告升級為錯誤並棄用 `kotlinOptions` 中的所有屬性

### 移除 `kotlin.incremental.useClasspathSnapshot` 屬性

> **問題**：[KT-62963](https://youtrack.jetbrains.com/issue/KT-62963)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`kotlin.incremental.useClasspathSnapshot` Gradle 屬性已移除。此屬性控制著已棄用的基於 JVM 歷史的增量編譯模式，該模式已被 Kotlin 1.8.20 以來預設啟用的基於類別路徑的方法所取代。
>
> **棄用週期**：
>
> -   2.0.20：棄用 `kotlin.incremental.useClasspathSnapshot` 屬性並發出警告
> -   2.2.0：移除該屬性

### Kotlin 指令碼棄用

> **問題**：[KT-71685](https://youtrack.jetbrains.com/issue/KT-71685)、[KT-75632](https://youtrack.jetbrains.com/issue/KT-75632/)、[KT-76196](https://youtrack.jetbrains.com/issue/KT-76196/)。
>
> **組件**：指令碼
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin 2.2.0 棄用以下支援：
>
> *   REPL：要繼續透過 `kotlinc` 使用 REPL，請使用 `-Xrepl` 編譯器選項選擇啟用。
> *   JSR-223：由於 [JSR](https://jcp.org/en/jsr/detail?id=223) 處於 **Withdrawn (已撤回)** 狀態。JSR-223 實作繼續適用於語言版本 1.9，但未來沒有計畫遷移到 K2 編譯器。
> *   `KotlinScriptMojo` Maven 外掛程式。如果您繼續使用它，將會看到編譯器警告。
>
> 更多資訊請參閱我們的[部落格文章](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)。
>
> **棄用週期**：
>
> -   2.1.0：棄用 `kotlinc` 中 REPL 的使用並發出警告
> -   2.2.0：要透過 `kotlinc` 使用 REPL，請使用 `-Xrepl` 編譯器選項選擇啟用；棄用 JSR-223，可透過切換到語言版本 1.9 恢復支援；棄用 `KotlinScriptMojo` Maven 外掛程式

### 棄用消歧義分類器屬性

> **問題**：[KT-58231](https://youtrack.jetbrains.com/issue/KT-58231)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：用於控制 Kotlin Gradle 外掛程式如何消除原始碼集名稱和 IDE 匯入歧義的選項已過時。因此，`KotlinTarget` 介面中的以下屬性現在已棄用：
>
> *   `useDisambiguationClassifierAsSourceSetNamePrefix`
> *   `overrideDisambiguationClassifierOnIdeImport`
>
> **棄用週期**：
>
> -   2.0.0：使用 Gradle 屬性時報告警告
> -   2.1.0：將此警告升級為錯誤
> -   2.2.0：移除 Gradle 屬性

### 棄用共通化參數

> **問題**：[KT-75161](https://youtrack.jetbrains.com/issue/KT-75161)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin Gradle 外掛程式中的實驗性共通化模式參數已棄用。這些參數可能產生無效的編譯成品，然後這些成品會被快取。若要刪除受影響的成品：
>
> 1.  從您的 `gradle.properties` 檔案中移除以下選項：
>
>     ```none
>     kotlin.mpp.enableOptimisticNumberCommonization
>     kotlin.mpp.enablePlatformIntegerCommonization
>     ```
>
> 2.  清除 `~/.konan/*/klib/commonized` 目錄中的共通化快取，或執行以下指令：
>
>     ```bash
>     ./gradlew cleanNativeDistributionCommonization
>     ```
>
> **棄用週期**：
>
> -   2.2.0：棄用共通化參數並發出錯誤
> -   2.2.20：移除共通化參數

### 棄用對傳統中繼資料編譯的支援

> **問題**：[KT-61817](https://youtrack.jetbrains.com/issue/KT-61817)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：用於設定分層結構並在通用原始碼集和中間原始碼集之間建立中間原始碼集的選項已過時。以下編譯器選項已移除：
>
> *   `isCompatibilityMetadataVariantEnabled`
> *   `withGranularMetadata`
> *   `isKotlinGranularMetadataEnabled`
>
> **棄用週期**：
>
> -   2.2.0：從 Kotlin Gradle 外掛程式中移除編譯器選項

### 棄用 `KotlinCompilation.source` API

> **問題**：[KT-64991](https://youtrack.jetbrains.com/issue/KT-64991)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：允許將 Kotlin 原始碼集直接新增到 Kotlin 編譯的 `KotlinCompilation.source` API 存取已被棄用。
>
> **棄用週期**：
>
> -   1.9.0：使用 `KotlinCompilation.source` 時報告警告
> -   1.9.20：將此警告升級為錯誤
> -   2.2.0：從 Kotlin Gradle 外掛程式中移除 `KotlinCompilation.source`；嘗試使用它會導致建構指令碼編譯期間的「unresolved reference (未解析的引用)」錯誤

### 棄用目標預設 API

> **問題**：[KT-71698](https://youtrack.jetbrains.com/issue/KT-71698)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin Multiplatform 目標的目標預設已過時；`jvm()` 或 `iosSimulatorArm64()` 等目標 DSL 函數現在涵蓋相同的用例。所有與預設相關的 API 均已棄用：
>
> *   `org.jetbrains.kotlin.gradle.dsl.KotlinMultiplatformExtension` 中的 `presets` 屬性
> *   `org.jetbrains.kotlin.gradle.plugin.KotlinTargetPreset` 介面及其所有繼承者
> *   `fromPreset` 的多載
>
> **棄用週期**：
>
> -   1.9.20：報告任何預設相關 API 使用的警告
> -   2.0.0：將此警告升級為錯誤
> -   2.2.0：從 Kotlin Gradle 外掛程式的公共 API 中移除預設相關 API；仍在使用它的原始碼會因「unresolved reference (未解析的引用)」錯誤而失敗，而二進位檔（例如 Gradle 外掛程式）則可能因連結錯誤而失敗，除非針對最新版本的 Kotlin Gradle 外掛程式重新編譯

### 棄用 Apple 目標捷徑

> **問題**：[KT-70615](https://youtrack.jetbrains.com/issue/KT-70615)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：Kotlin Multiplatform DSL 中的 `ios()`、`watchos()` 和 `tvos()` 目標捷徑已棄用。這些捷徑旨在為 Apple 目標部分建立原始碼集層次結構。Kotlin Multiplatform Gradle 外掛程式現在提供了一個內建的層次結構範本。您可以指定目標列表，然後外掛程式會自動為其設定中間原始碼集，而不是使用捷徑。
>
> **棄用週期**：
>
> -   1.9.20：使用目標捷徑時報告警告；預設情況下啟用預設層次結構範本
> -   2.1.0：使用目標捷徑時報告錯誤
> -   2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除目標捷徑 DSL

### 棄用 `publishAllLibraryVariants()` 函數

> **問題**：[KT-60623](https://youtrack.jetbrains.com/issue/KT-60623)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`publishAllLibraryVariants()` 函數已棄用。它旨在發布 Android 目標的所有建構變體。現在不建議使用此方法，因為它可能導致變體解析問題，尤其是在使用多個 Flavor 和建構類型時。請改用指定建構變體的 `publishLibraryVariants()` 函數。
>
> **棄用週期**：
>
> -   2.2.0：`publishAllLibraryVariants()` 已棄用

### 棄用 `android` 目標

> **問題**：[KT-71608](https://youtrack.jetbrains.com/issue/KT-71608)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`android` 目標名稱在目前的 Kotlin DSL 中已棄用。請改用 `androidTarget`。
>
> **棄用週期**：
>
> -   1.9.0：在 Kotlin Multiplatform 專案中使用 `android` 名稱時引入棄用警告
> -   2.1.0：將此警告升級為錯誤
> -   2.2.0：從 Kotlin Multiplatform Gradle 外掛程式中移除 `android` 目標 DSL

### 棄用 `CInteropProcess` 中的 `konanVersion`

> **問題**：[KT-71069](https://youtrack.jetbrains.com/issue/KT-71069)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`CInteropProcess` 任務中的 `konanVersion` 屬性已棄用。請改用 `CInteropProcess.kotlinNativeVersion`。
>
> **棄用週期**：
>
> -   2.1.0：使用 `konanVersion` 屬性時報告警告
> -   2.2.0：將此警告升級為錯誤
> -   2.3.0：從 Kotlin Gradle 外掛程式中移除 `konanVersion` 屬性

### 棄用 `CInteropProcess` 中的 `destinationDir`

> **問題**：[KT-71068](https://youtrack.jetbrains.com/issue/KT-71068)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：`CInteropProcess` 任務中的 `destinationDir` 屬性已棄用。請改用 `CInteropProcess.destinationDirectory.set()` 函數。
>
> **棄用週期**：
>
> -   2.1.0：使用 `destinationDir` 屬性時報告警告
> -   2.2.0：將此警告升級為錯誤
> -   2.3.0：從 Kotlin Gradle 外掛程式中移除 `destinationDir` 屬性

### 棄用 `kotlinArtifacts` API

> **問題**：[KT-74953](https://youtrack.jetbrains.com/issue/KT-74953)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要總結**：實驗性的 `kotlinArtifacts` API 已棄用。請使用 Kotlin Gradle 外掛程式中現有的 DSL 來[建構最終的原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。如果這不足以進行遷移，請在[此 YT 問題](https://youtrack.jetbrains.com/issue/KT-74953)中留言。
>
> **棄用週期**：
>
> -   2.2.0：使用 `kotlinArtifacts` API 時報告警告
> -   2.3.0：將此警告升級為錯誤