---
title: "Kotlin 2.1 的相容性指南"
---
_[保持語言現代化](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則。前者表示應移除阻礙語言發展的結構，後者表示應事先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）宣布，但本文總結了所有這些變更，為從 Kotlin 2.0 遷移到 Kotlin 2.1 提供了完整的參考。

## 基本術語

在本文中，我們介紹了幾種類型的相容性：

- _原始碼 (source)_：原始碼不相容變更會阻止過去可以正常編譯（沒有錯誤或警告）的程式碼再也無法編譯
- _二進制 (binary)_：如果交換兩個二進制構件不會導致加載或連結錯誤，則稱它們是二進制相容的
- _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更是行為不相容的

請記住，這些定義僅適用於純 Kotlin。從其他語言角度來看 Kotlin 程式碼的相容性
（例如，從 Java）不在本文範圍內。

## 語言

### 移除語言版本 1.4 和 1.5

> **Issue**: [KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 2.1 引入了語言版本 2.1，並移除了對語言版本 1.4 和 1.5 的支援。語言版本 1.6 和 1.7 已棄用。
>
> **Deprecation cycle**:
>
> - 1.6.0：針對語言版本 1.4 報告警告
> - 1.9.0：針對語言版本 1.5 報告警告
> - 2.1.0：針對語言版本 1.6 和 1.7 報告警告；針對語言版本 1.4 和 1.5 將警告提升為錯誤

### 變更 Kotlin/Native 上 `typeOf()` 函數的行為

> **Issue**: [KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin/Native 上 `typeOf()` 函數的行為與 Kotlin/JVM 對齊，以確保跨平台一致性。
>
> **Deprecation cycle**:
>
> - 2.1.0：對齊 Kotlin/Native 上 `typeOf()` 函數的行為

### 禁止透過類型參數的邊界暴露類型

> **Issue**: [KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 現在禁止透過類型參數邊界暴露具有較低可見性的類型，從而解決類型可見性規則中的不一致問題。
> 此變更確保類型參數的邊界遵循與類別相同的可見性規則，從而防止 JVM 中出現 IR 驗證錯誤等問題。
>
> **Deprecation cycle**:
>
> - 2.1.0：針對透過具有較低可見性的類型參數邊界暴露類型報告警告
> - 2.2.0：將警告提升為錯誤

### 禁止繼承具有相同名稱的抽象 var 屬性和 val 屬性

> **Issue**: [KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 如果一個類別從介面繼承一個抽象 `var` 屬性，並從父類別繼承一個具有相同名稱的 `val` 屬性，則現在會觸發編譯錯誤。這解決了此類情況下由於缺少 setter 導致的運行時崩潰。
>
> **Deprecation cycle**:
>
> - 2.1.0：當一個類別從介面繼承一個抽象 `var` 屬性，並從父類別繼承一個具有相同名稱的 `val` 屬性時，報告警告（或在漸進模式下報告錯誤）
> - 2.2.0：將警告提升為錯誤

### 報告存取未初始化的 enum 條目時的錯誤

> **Issue**: [KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 編譯器現在會在枚舉類別或條目初始化期間存取未初始化的枚舉條目時報告錯誤。
> 這使行為與成員屬性初始化規則保持一致，防止運行時異常並確保一致的邏輯。
>
> **Deprecation cycle**:
>
> - 2.1.0：報告存取未初始化的 enum 條目時的錯誤

### K2 智能轉換傳播的變更

> **Issue**: [KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: K2 編譯器透過引入推斷變數（例如 `val x = y`）的類型信息的雙向傳播來變更其智能轉換傳播的行為。顯式類型變數（例如 `val x: T = y`）
> 不再傳播類型信息，確保更嚴格地遵守宣告的類型。
>
> **Deprecation cycle**:
>
> - 2.1.0：啟用新行為

### 更正 Java 子類別中成員擴展屬性覆寫的處理方式

> **Issue**: [KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 由 Java 子類別覆寫的成員擴展屬性的 getter 現在在子類別的範圍內被隱藏，使其行為與常規 Kotlin 屬性保持一致。
>
> **Deprecation cycle**:
>
> - 2.1.0：啟用新行為

### 更正覆寫受保護的 val 的 var 屬性的 getter 和 setter 的可見性對齊

> **Issue**: [KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 二進制 (binary)
>
> **Short summary**: 覆寫受保護的 `val` 屬性的 `var` 屬性的 getter 和 setter 的可見性現在是一致的，兩者都繼承了被覆寫的 `val` 屬性的可見性。
>
> **Deprecation cycle**:
>
> - 2.1.0：在 K2 中強制執行 getter 和 setter 的一致可見性；K1 保持不受影響

### 將 JSpecify 可空性不匹配診斷的嚴重性提高到錯誤

> **Issue**: [KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 來自 `org.jspecify.annotations` 的可空性不匹配（例如 `@NonNull`、`@Nullable` 和 `@NullMarked`）現在被視為錯誤而不是警告，
> 從而對 Java 互操作性強制執行更嚴格的類型安全。若要調整這些診斷的嚴重性，請使用 `-Xnullability-annotations` 編譯器選項。
>
> **Deprecation cycle**:
>
> - 1.6.0：針對潛在的可空性不匹配報告警告
> - 1.8.20：將警告擴展到特定的 JSpecify 註釋，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked` 以及 `org.jspecify.nullness` 中的舊版註釋（JSpecify 0.2 及更早版本）
> - 2.0.0：新增對 `@NonNull` 註釋的支援
> - 2.1.0：將 JSpecify 註釋的預設模式變更為 `strict`，將警告轉換為錯誤；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 來覆寫預設行為

### 變更重載解析以在不明確的情況下優先考慮擴展函數而不是 invoke 呼叫

> **Issue**: [KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 重載解析現在在不明確的情況下始終優先考慮擴展函數而不是 invoke 呼叫。
> 這解決了本機函數和屬性的解析邏輯中的不一致問題。此變更僅在重新編譯後生效，不會影響預編譯的二進制檔案。
>
> **Deprecation cycle**:
>
> - 2.1.0：變更重載解析以始終優先考慮擴展函數而不是具有匹配簽名的擴展函數的 `invoke` 呼叫；此變更僅在重新編譯後生效，不會影響預編譯的二進制檔案

### 禁止從 JDK 函數介面的 SAM 建構函數中的 lambda 傳回可空值

> **Issue**: [KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 如果指定的類型參數不可為空，則現在從 JDK 函數介面的 SAM 建構函數中的 lambda 傳回可空值會觸發編譯錯誤。
> 這解決了可空性不匹配可能導致運行時異常的問題，從而確保更嚴格的類型安全。
>
> **Deprecation cycle**:
>
> - 2.0.0：針對 JDK 函數介面的 SAM 建構函數中的可空傳回值報告棄用警告
> - 2.1.0：預設啟用新行為

### 更正在 Kotlin/Native 中與公有成員衝突的私有成員的處理方式

> **Issue**: [KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 在 Kotlin/Native 中，私有成員不再覆寫或與父類別中的公有成員衝突，使其行為與 Kotlin/JVM 保持一致。
> 這解決了覆寫解析中的不一致問題，並消除了由單獨編譯導致的意外行為。
>
> **Deprecation cycle**:
>
> - 2.1.0：Kotlin/Native 中的私有函數和屬性不再覆寫或影響父類別中的公有成員，使其行為與 JVM 保持一致

### 禁止在公有內聯函數中存取私有運算符函數

> **Issue**: [KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 私有運算符函數（例如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`）無法再在公有內聯函數中存取。
>
> **Deprecation cycle**:
>
> - 2.0.0：針對在公有內聯函數中存取私有運算符函數報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 禁止將無效參數傳遞給使用 @UnsafeVariance 註釋的不變參數

> **Issue**: [KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 編譯器現在在類型檢查期間忽略 `@UnsafeVariance` 註釋，從而對不變類型參數強制執行更嚴格的類型安全。
> 這可以防止依賴 `@UnsafeVariance` 繞過預期類型檢查的無效呼叫。
>
> **Deprecation cycle**:
>
> - 2.1.0：啟用新行為

### 針對警告級別 Java 類型的錯誤級別可空參數報告可空性錯誤

> **Issue**: [KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 編譯器現在可以偵測 Java 方法中的可空性不匹配，其中警告級別
> 可空類型包含具有更嚴格的錯誤級別可空性的類型參數。
> 這確保了先前在類型參數中忽略的錯誤得到正確報告。
>
> **Deprecation cycle**:
>
> - 2.0.0：針對具有更嚴格類型參數的 Java 方法中的可空性不匹配報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 報告無法存取的類型的隱式用法

> **Issue**: [KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 編譯器現在會報告函數字面量和類型參數中無法存取的類型的用法，
> 從而防止由於不完整的類型信息而導致的編譯和運行時失敗。
>
> **Deprecation cycle**:
>
> - 2.0.0：針對具有無法存取的非泛型類型的參數或接收者的函數字面量以及具有無法存取的類型參數的類型報告警告；針對具有無法存取的泛型類型的參數或接收者的函數字面量以及特定情況下具有無法存取的泛型類型參數的類型報告錯誤
> - 2.1.0：針對具有無法存取的非泛型類型的參數和接收者的函數字面量將警告提升為錯誤
> - 2.2.0：針對具有無法存取的類型參數的類型將警告提升為錯誤

## 標準函式庫 (Standard library)

### 棄用 Char 和 String 的區分地區設定的大小寫轉換函數

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 在其他 Kotlin 標準函式庫 API 中，已棄用 `Char` 和 `String` 的區分地區設定的大小寫轉換函數，例如 `Char.toUpperCase()` 和 `String.toLowerCase()`。
> 將它們替換為不區分地區設定的替代方案（例如 `String.lowercase()`），或者明確指定區分地區設定的行為的地區設定（例如 `String.lowercase(Locale.getDefault())`）。
>
> 有關 Kotlin 2.1.0 中已棄用的 Kotlin 標準函式庫 API 的完整清單，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **Deprecation cycle**:
>
> - 1.4.30：以實驗性 API 形式引入不區分地區設定的替代方案
> - 1.5.0：棄用區分地區設定的大小寫轉換函數並發出警告
> - 2.1.0：將警告提升為錯誤

### 移除 kotlin-stdlib-common JAR 構件

> **Issue**: [KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 二進制 (binary)
>
> **Short summary**:  `kotlin-stdlib-common.jar` 構件以前用於舊版多平台宣告元數據，現已棄用，並由 `.klib` 檔案取代，作為通用多平台宣告元數據的標準格式。
> 此變更不會影響主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 構件。
>
> **Deprecation cycle**:
>
> - 2.1.0：棄用並移除 `kotlin-stdlib-common.jar` 構件

### 棄用 appendln()，改用 appendLine()

> **Issue**: [KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 棄用 `StringBuilder.appendln()`，改用 `StringBuilder.appendLine()`。
>
> **Deprecation cycle**:
>
> - 1.4.0：已棄用 `appendln()` 函數；在使用時報告警告
> - 2.1.0：將警告提升為錯誤

### 棄用 Kotlin/Native 中與凍結相關的 API

> **Issue**: [KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin/Native 中先前使用 `@FreezingIsDeprecated` 註釋標記的與凍結相關的 API 現在已棄用。
> 這與引入新的記憶體管理器一致，該記憶體管理器消除了凍結物件以進行線程共享的需要。
> 有關遷移詳細信息，請參閱 [Kotlin/Native 遷移指南](native-migration-guide#update-your-code)。
>
> **Deprecation cycle**:
>
> - 1.7.20：棄用與凍結相關的 API 並發出警告
> - 2.1.0：將警告提升為錯誤

### 變更 Map.Entry 行為以在結構修改時快速失敗

> **Issue**: [KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 在其關聯的映射已進行結構修改後存取 `Map.Entry` 鍵值對現在會拋出 `ConcurrentModificationException`。
>
> **Deprecation cycle**:
>
> - 2.1.0：在偵測到映射結構修改時拋出異常

## 工具

### 棄用 KotlinCompilationOutput#resourcesDirProvider

> **Issue**: [KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `KotlinCompilationOutput#resourcesDirProvider` 欄位已棄用。
> 請在 Gradle 組建腳本中使用 `KotlinSourceSet.resources` 來添加其他資源目錄。
>
> **Deprecation cycle**:
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已棄用

### 棄用 registerKotlinJvmCompileTask(taskName, moduleName) 函數

> **Issue**: [KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `registerKotlinJvmCompileTask(taskName, moduleName)` 函數已棄用，
> 取而代之的是新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函數，該函數現在接受 `KotlinJvmCompilerOptions`。
> 這允許您傳遞一個 `compilerOptions` 實例，通常來自擴展或目標，其值用作任務選項的約定。
>
> **Deprecation cycle**:
>
> - 2.1.0：`registerKotlinJvmCompileTask(taskName, moduleName)` 函數已棄用

### 棄用 registerKaptGenerateStubsTask(taskName) 函數

> **Issue**: [KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `registerKaptGenerateStubsTask(taskName)` 函數已棄用。
> 請改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函數。
> 這個新版本允許您從相關的 `KotlinJvmCompile` 任務連結值作為約定，從而確保兩個任務都使用相同的選項集。
>
> **Deprecation cycle**:
>
> - 2.1.0：`registerKaptGenerateStubsTask(taskName)` 函數已棄用

### 棄用 KotlinTopLevelExtension 和 KotlinTopLevelExtensionConfig 介面

> **Issue**: [KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **Component**: Gradle
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用，改用新的 `KotlinTopLevelExtension` 介面。
> 此介面合併了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`
> 以簡化 API 層次結構，並提供對 JVM 工具鏈和編譯器屬性的官方存取權限。
>
> **Deprecation cycle**:
>
> - 2.1.0：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用

### 從組建運行時依賴項中移除 kotlin-compiler-embeddable

> **Issue**: [KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `kotlin-compiler-embeddable` 依賴項已從 Kotlin Gradle Plugin (KGP) 的運行時中移除。
> 現在，所需的模組直接包含在 KGP 構件中，Kotlin 語言版本限制為 2.0，以支援與低於 8.2 的版本中的 Gradle Kotlin 運行時的相容性。
>
> **Deprecation cycle**:
>
> - 2.1.0：報告使用 `kotlin-compiler-embeddable` 時的警告
> - 2.2.0：將警告提升為錯誤

### 從 Kotlin Gradle Plugin API 中隱藏編譯器符號

> **Issue**: [KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 捆綁在 Kotlin Gradle Plugin (KGP) 中的編譯器模組符號（例如 `KotlinCompilerVersion`）
> 從公有 API 中隱藏，以防止在組建腳本中進行非預期的存取。
>
> **Deprecation cycle**:
>
> - 2.1.0：報告存取這些符號時的警告
> - 2.2.0：將警告提升為錯誤

### 新增對多個穩定性配置檔案的支援

> **Issue**: [KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Compose 擴展中的 `stabilityConfigurationFile` 屬性已棄用，
> 改用新的 `stabilityConfigurationFiles` 屬性，該屬性允許指定多個配置檔案。
>
> **Deprecation cycle**:
>
> - 2.1.0：`stabilityConfigurationFile` 屬性已棄用

### 移除已棄用的平台外掛程式 ID

> **Issue**: [KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 已移除對這些平台外掛程式 ID 的支援：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **Deprecation cycle**:
>
> - 1.3：平台外掛程式 ID 已棄用
> - 2.1.0：不再支援平台外掛程式 ID