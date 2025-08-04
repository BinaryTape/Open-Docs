[//]: # (title: Kotlin 2.1 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計的根本原則。前者指出，阻礙語言演進的建構應予移除，後者則要求此類移除必須事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道發布，例如更新變更日誌或編譯器警告，本文檔將所有變更彙總，為從 Kotlin 2.0 遷移至 Kotlin 2.1 提供完整參考。

## 基本術語

本文檔介紹了幾種相容性：

- _原始碼_：原始碼不相容變更會導致原本能順利編譯（無錯誤或警告）的程式碼無法再編譯。
- _二進位檔_：如果兩個二進位構件在互換後不會導致載入或連結錯誤，則稱它們為二進位檔相容。
- _行為_：如果同一程式在應用變更前後表現出不同行為，則稱該變更為行為不相容。

請注意，這些定義僅適用於純 Kotlin。從其他語言（例如 Java）角度來看的 Kotlin 程式碼相容性不在本文檔的範圍內。

## 語言

### 移除語言版本 1.4 和 1.5

> **問題**：[KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：Kotlin 2.1 引入語言版本 2.1，並移除對語言版本 1.4 和 1.5 的支援。語言版本 1.6 和 1.7 已棄用。
>
> **棄用週期**：
>
> - 1.6.0：針對語言版本 1.4 報告警告
> - 1.9.0：針對語言版本 1.5 報告警告
> - 2.1.0：針對語言版本 1.6 和 1.7 報告警告；將語言版本 1.4 和 1.5 的警告提升為錯誤

### 變更 Kotlin/Native 上 `typeOf()` 函數的行為

> **問題**：[KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要摘要**：Kotlin/Native 上 `typeOf()` 函數的行為與 Kotlin/JVM 對齊，以確保跨平台的一致性。
>
> **棄用週期**：
>
> - 2.1.0：對齊 Kotlin/Native 上 `typeOf()` 函數的行為

### 禁止透過類型參數的約束暴露類型

> **問題**：[KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：現在禁止透過類型參數約束暴露具有較低可見性的類型，以解決類型可見性規則中的不一致問題。此變更確保類型參數的約束遵循與類別相同的可見性規則，防止 JVM 中 IR 驗證錯誤等問題。
>
> **棄用週期**：
>
> - 2.1.0：針對透過類型參數約束暴露具有較低可見性的類型報告警告
> - 2.2.0：將警告提升為錯誤

### 禁止繼承具有相同名稱的抽象 `var` 屬性和 `val` 屬性

> **問題**：[KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：如果一個類別從介面繼承了一個抽象 `var` 屬性，同時從父類別繼承了一個具有相同名稱的 `val` 屬性，現在會觸發編譯錯誤。這解決了此類情況下因缺少 setter 引起的執行時崩潰。
>
> **棄用週期**：
>
> - 2.1.0：當一個類別從介面繼承抽象 `var` 屬性，同時從父類別繼承具有相同名稱的 `val` 屬性時，報告警告（或在漸進模式下報告錯誤）
> - 2.2.0：將警告提升為錯誤

### 報告存取未初始化的列舉項目時的錯誤

> **問題**：[KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：編譯器現在在列舉類別或項目初始化期間存取未初始化的列舉項目時會報告錯誤。這使行為與成員屬性初始化規則對齊，防止執行時異常並確保邏輯一致性。
>
> **棄用週期**：
>
> - 2.1.0：在存取未初始化的列舉項目時報告錯誤

### K2 智慧型轉型傳播的變更

> **問題**：[KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要摘要**：K2 編譯器透過引入推斷變數（例如 `val x = y`）的類型資訊雙向傳播，變更了其智慧型轉型傳播的行為。明確型別變數（例如 `val x: T = y`）不再傳播類型資訊，確保更嚴格地遵守聲明的類型。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 更正 Java 子類別中成員擴充屬性覆寫的處理方式

> **問題**：[KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要摘要**：由 Java 子類別覆寫的成員擴充屬性的 getter 現在在子類別範圍內被隱藏，使其行為與常規 Kotlin 屬性對齊。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 更正覆寫 `protected val` 的 `var` 屬性之 getter 和 setter 的可見性對齊

> **問題**：[KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **組件**：核心語言
>
> **不相容變更類型**：二進位檔
>
> **簡要摘要**：覆寫 `protected val` 屬性的 `var` 屬性之 getter 和 setter 的可見性現在一致，兩者都繼承了被覆寫 `val` 屬性的可見性。
>
> **棄用週期**：
>
> - 2.1.0：在 K2 中強制執行 getter 和 setter 的一致可見性；K1 不受影響

### 將 JSpecify 空值性不匹配診斷的嚴重程度提升為錯誤

> **問題**：[KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：來自 `org.jspecify.annotations` 的空值性不匹配，例如 `@NonNull`、`@Nullable` 和 `@NullMarked`，現在被視為錯誤而非警告，強制執行更嚴格的 Java 互操作性類型安全。要調整這些診斷的嚴重程度，請使用 `-Xnullability-annotations` 編譯器選項。
>
> **棄用週期**：
>
> - 1.6.0：報告潛在空值性不匹配的警告
> - 1.8.20：將警告擴展到特定的 JSpecify 註解，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked`，以及 `org.jspecify.nullness` 中已棄用的註解（JSpecify 0.2 及更早版本）
> - 2.0.0：增加對 `@NonNull` 註解的支援
> - 2.1.0：將 JSpecify 註解的預設模式變更為 `strict`，將警告轉換為錯誤；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 以覆寫預設行為

### 變更多載解析以在模糊情況下優先考慮擴充函數而非 `invoke` 呼叫

> **問題**：[KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要摘要**：在模糊情況下，多載解析現在始終優先考慮擴充函數而非 `invoke` 呼叫。這解決了局部函數和屬性解析邏輯中的不一致問題。此變更僅在重新編譯後生效，不影響預編譯的二進位檔。
>
> **棄用週期**：
>
> - 2.1.0：變更多載解析以對於簽名匹配的擴充函數，始終優先考慮擴充函數而非 `invoke` 呼叫；此變更僅在重新編譯後生效，不影響預編譯的二進位檔

### 禁止在 JDK 函數介面的 SAM 建構函式中從 Lambda 表達式返回可空值

> **問題**：[KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：在 JDK 函數介面的 SAM 建構函式中從 Lambda 表達式返回可空值，如果指定的類型引數是不可空的，現在會觸發編譯錯誤。這解決了空值性不匹配可能導致執行時異常的問題，確保更嚴格的類型安全。
>
> **棄用週期**：
>
> - 2.0.0：針對 JDK 函數介面 SAM 建構函式中的可空返回值報告棄用警告
> - 2.1.0：預設啟用新行為

### 更正 Kotlin/Native 中私有成員與公有成員衝突的處理方式

> **問題**：[KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **組件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡要摘要**：在 Kotlin/Native 中，私有成員不再覆寫或與父類別中的公有成員衝突，使其行為與 Kotlin/JVM 對齊。這解決了覆寫解析中的不一致性，並消除了單獨編譯引起的意外行為。
>
> **棄用週期**：
>
> - 2.1.0：Kotlin/Native 中的私有函數和屬性不再覆寫或影響父類別中的公有成員，與 JVM 行為對齊

### 禁止在公有 inline 函數中存取私有運算子函數

> **問題**：[KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：私有運算子函數，例如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`，不能再在公有 inline 函數中存取。
>
> **棄用週期**：
>
> - 2.0.0：針對在公有 inline 函數中存取私有運算子函數報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 禁止向帶有 `@UnsafeVariance` 註解的不變參數傳遞無效引數

> **問題**：[KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：編譯器現在在類型檢查期間會忽略 `@UnsafeVariance` 註解，對不變類型參數強制執行更嚴格的類型安全。這防止了依賴 `@UnsafeVariance` 繞過預期類型檢查的無效呼叫。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 報告警告級別 Java 類型中錯誤級別可空引數的空值性錯誤

> **問題**：[KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：編譯器現在會檢測 Java 方法中的空值性不匹配，其中警告級別的可空類型包含具有更嚴格、錯誤級別空值性的類型引數。這確保了先前在類型引數中被忽略的錯誤能夠正確報告。
>
> **棄用週期**：
>
> - 2.0.0：針對 Java 方法中具有更嚴格類型引數的空值性不匹配報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 報告不可存取類型的隱式使用

> **問題**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **組件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：編譯器現在會報告函數字面值和類型引數中不可存取類型的使用，防止因類型資訊不完整而導致的編譯和執行時失敗。
>
> **棄用週期**：
>
> - 2.0.0：針對參數或接收者為不可存取非泛型類型的函數字面值以及具有不可存取類型引數的類型報告警告；在特定情況下，針對參數或接收者為不可存取泛型類型的函數字面值以及具有不可存取泛型類型引數的類型報告錯誤
> - 2.1.0：將參數和接收者為不可存取非泛型類型的函數字面值的警告提升為錯誤
> - 2.2.0：將具有不可存取類型引數的類型的警告提升為錯誤

## 標準函式庫

### 棄用 Char 和 String 的區域設定敏感大小寫轉換函數

> **問題**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：在其他 Kotlin 標準函式庫 API 中，針對 `Char` 和 `String` 的區域設定敏感大小寫轉換函數，例如 `Char.toUpperCase()` 和 `String.toLowerCase()`，已被棄用。請將它們替換為區域設定無關的替代方案，如 `String.lowercase()`，或明確指定區域設定以實現區域設定敏感行為，例如 `String.lowercase(Locale.getDefault())`。
>
> 有關 Kotlin 2.1.0 中已棄用的 Kotlin 標準函式庫 API 的完整列表，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **棄用週期**：
>
> - 1.4.30：引入區域設定無關的替代方案作為實驗性 API
> - 1.5.0：棄用區域設定敏感大小寫轉換函數並發出警告
> - 2.1.0：將警告提升為錯誤

### 移除 `kotlin-stdlib-common.jar` 構件

> **問題**：[KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：二進位檔
>
> **簡要摘要**：先前用於遺留多平台聲明元數據的 `kotlin-stdlib-common.jar` 構件已棄用，並由 `.klib` 檔案取代，作為通用多平台聲明元數據的標準格式。此變更不影響主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 構件。
>
> **棄用週期**：
>
> - 2.1.0：棄用並移除 `kotlin-stdlib-common.jar` 構件

### 棄用 `appendln()`，改用 `appendLine()`

> **問題**：[KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：`StringBuilder.appendln()` 已棄用，改用 `StringBuilder.appendLine()`。
>
> **棄用週期**：
>
> - 1.4.0：`appendln()` 函數已棄用；使用時報告警告
> - 2.1.0：將警告提升為錯誤

### 棄用 Kotlin/Native 中的凍結相關 API

> **問題**：[KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：Kotlin/Native 中先前標記為 `@FreezingIsDeprecated` 註解的凍結相關 API 現在已棄用。這與引入新記憶體管理器對齊，該管理器消除了執行緒共用時凍結物件的需要。有關遷移的詳細資訊，請參閱 [Kotlin/Native 遷移指南](native-migration-guide.md#update-your-code)。
>
> **棄用週期**：
>
> - 1.7.20：棄用凍結相關 API 並發出警告
> - 2.1.0：將警告提升為錯誤

### 變更 `Map.Entry` 行為以在結構修改時快速失敗

> **問題**：[KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **組件**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡要摘要**：在其關聯映射被結構修改後，存取 `Map.Entry` 鍵值對現在會拋出 `ConcurrentModificationException`。
>
> **棄用週期**：
>
> - 2.1.0：當檢測到映射結構修改時拋出異常

## 工具

### 棄用 `KotlinCompilationOutput#resourcesDirProvider`

> **問題**：[KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：`KotlinCompilationOutput#resourcesDirProvider` 欄位已棄用。請改用 Gradle 建置腳本中的 `KotlinSourceSet.resources` 來添加額外的資源目錄。
>
> **棄用週期**：
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已棄用

### 棄用 `registerKotlinJvmCompileTask(taskName, moduleName)` 函數

> **問題**：[KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：`registerKotlinJvmCompileTask(taskName, moduleName)` 函數已棄用，改用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函數，該函數現在接受 `KotlinJvmCompilerOptions`。這允許您傳遞 `compilerOptions` 實例（通常來自擴充功能或目標），其值將用作任務選項的約定。
>
> **棄用週期**：
>
> - 2.1.0：`registerKotlinJvmCompileTask(taskName, moduleName)` 函數已棄用

### 棄用 `registerKaptGenerateStubsTask(taskName)` 函數

> **問題**：[KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：`registerKaptGenerateStubsTask(taskName)` 函數已棄用。請改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函數。這個新版本允許您將相關 `KotlinJvmCompile` 任務的值連結為約定，確保兩個任務使用相同的選項集。
>
> **棄用週期**：
>
> - 2.1.0：`registerKaptGenerateStubsTask(taskName)` 函數已棄用

### 棄用 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面

> **問題**：[KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **組件**：Gradle
>
> **不相容變更類型**：行為
>
> **簡要摘要**：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用，改用新的 `KotlinTopLevelExtension` 介面。此介面合併了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`，以簡化 API 階層，並提供對 JVM 工具鏈和編譯器屬性的官方存取。
>
> **棄用週期**：
>
> - 2.1.0：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用

### 從建置執行時依賴項中移除 `kotlin-compiler-embeddable`

> **問題**：[KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：`kotlin-compiler-embeddable` 依賴項已從 Kotlin Gradle 外掛程式 (KGP) 的執行時中移除。所需的模組現在直接包含在 KGP 構件中，Kotlin 語言版本限制為 2.0，以支援與 8.2 以下版本 Gradle Kotlin 執行時的相容性。
>
> **棄用週期**：
>
> - 2.1.0：使用 `kotlin-compiler-embeddable` 時報告警告
> - 2.2.0：將警告提升為錯誤

### 從 Kotlin Gradle 外掛程式 API 隱藏編譯器符號

> **問題**：[KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：捆綁在 Kotlin Gradle 外掛程式 (KGP) 中的編譯器模組符號，例如 `KotlinCompilerVersion`，已從公共 API 中隱藏，以防止在建置腳本中意外存取。
>
> **棄用週期**：
>
> - 2.1.0：存取這些符號時報告警告
> - 2.2.0：將警告提升為錯誤

### 增加對多個穩定性設定檔的支援

> **問題**：[KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：Compose 擴充功能中的 `stabilityConfigurationFile` 屬性已棄用，改用新的 `stabilityConfigurationFiles` 屬性，該屬性允許指定多個設定檔。
>
> **棄用週期**：
>
> - 2.1.0：`stabilityConfigurationFile` 屬性已棄用

### 移除已棄用的平台外掛程式 ID

> **問題**：[KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **組件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：已移除對以下平台外掛程式 ID 的支援：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **棄用週期**：
>
> - 1.3：平台外掛程式 ID 已棄用
> - 2.1.0：平台外掛程式 ID 不再支援