[//]: # (title: Kotlin 2.1 相容性指南)

在 Kotlin 語言設計中，_維持語言現代化 (Keeping the Language Modern)_ 和 _舒適的更新 (Comfortable Updates)_ 是其基本原則之一。前者指出，阻礙語言演進的結構應該被移除；後者則表示，此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）發布，但本文件將其全部彙整，為從 Kotlin 2.0 遷移至 Kotlin 2.1 提供完整參考。

## 基本術語

本文件引入了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本能順利編譯的程式碼（無錯誤或警告）不再編譯通過。
- _二進位碼 (binary)_：如果兩個二進位產物互換不會導致載入或連結錯誤，則稱它們為二進位碼相容。
- _行為 (behavioral)_：如果同一程式在應用變更前後展現不同行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純 Kotlin。從其他語言（例如 Java）角度來看的 Kotlin 程式碼相容性不在本文件討論範圍內。

## 語言

### 移除語言版本 1.4 和 1.5

> **問題 (Issue)**：[KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：Kotlin 2.1 引入了語言版本 2.1，並移除了對語言版本 1.4 和 1.5 的支援。語言版本 1.6 和 1.7 已棄用。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：對語言版本 1.4 報告警告
> - 1.9.0：對語言版本 1.5 報告警告
> - 2.1.0：對語言版本 1.6 和 1.7 報告警告；將語言版本 1.4 和 1.5 的警告提升為錯誤

### 變更 Kotlin/Native 上 `typeOf()` 函式的行為

> **問題 (Issue)**：[KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：Kotlin/Native 上 `typeOf()` 函式的行為已與 Kotlin/JVM 對齊，以確保跨平台一致性。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：對齊 Kotlin/Native 上 `typeOf()` 函式的行為

### 禁止透過類型參數的界限暴露類型

> **問題 (Issue)**：[KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：現在禁止透過類型參數界限暴露具有較低可見度的類型，以解決類型可見度規則中的不一致問題。此變更確保類型參數上的界限遵循與類別相同的可見度規則，從而防止 JVM 中 IR 驗證錯誤等問題。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：針對透過類型參數界限暴露具有較低可見度的類型報告警告
> - 2.2.0：將警告提升為錯誤

### 禁止繼承具有相同名稱的抽象 `var` 屬性和 `val` 屬性

> **問題 (Issue)**：[KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：如果一個類別從介面繼承了一個抽象 `var` 屬性，同時從超類別繼承了一個具有相同名稱的 `val` 屬性，現在將觸發編譯錯誤。這解決了在這種情況下因缺少設定器而導致的執行時崩潰問題。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：當一個類別從介面繼承了抽象 `var` 屬性並從超類別繼承了具有相同名稱的 `val` 屬性時，報告警告（或在漸進模式下報告錯誤）
> - 2.2.0：將警告提升為錯誤

### 報告存取未初始化列舉條目的錯誤

> **問題 (Issue)**：[KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：當在列舉類別或條目初始化期間存取未初始化的列舉條目時，編譯器現在會報告錯誤。這使行為與成員屬性初始化規則保持一致，防止執行時例外並確保邏輯一致性。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：在存取未初始化列舉條目時報告錯誤

### K2 智慧型轉型傳播的變更

> **問題 (Issue)**：[KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：K2 編譯器透過引入推斷變數（例如 `val x = y`）的類型資訊雙向傳播，變更了其智慧型轉型傳播的行為。明確類型變數（例如 `val x: T = y`）不再傳播類型資訊，確保更嚴格地遵循宣告的類型。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：啟用新行為

### 更正 Java 子類別中成員擴充屬性覆寫的處理

> **問題 (Issue)**：[KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：現在，Java 子類別覆寫的成員擴充屬性的取得器 (getter) 在子類別範圍中被隱藏，使其行為與常規 Kotlin 屬性保持一致。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：啟用新行為

### 更正覆寫 `protected val` 的 `var` 屬性的取得器和設定器的可見度對齊

> **問題 (Issue)**：[KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：二進位碼
>
> **簡要摘要 (Short summary)**：現在，覆寫 `protected val` 屬性的 `var` 屬性的取得器和設定器的可見度保持一致，兩者都繼承被覆寫 `val` 屬性的可見度。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：在 K2 中強制取得器和設定器保持一致的可見度；K1 不受影響

### 將 JSpecify 可空性不匹配診斷的嚴重程度提升為錯誤

> **問題 (Issue)**：[KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：來自 `org.jspecify.annotations` 的可空性不匹配（例如 `@NonNull`、`@Nullable` 和 `@NullMarked`）現在被視為錯誤而非警告，從而為 Java 互通性強制執行更嚴格的類型安全。要調整這些診斷的嚴重程度，請使用 `-Xnullability-annotations` 編譯器選項。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：報告潛在可空性不匹配的警告
> - 1.8.20：將警告擴展到特定的 JSpecify 註解，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked` 以及 `org.jspecify.nullness` 中的傳統註解（JSpecify 0.2 及更早版本）
> - 2.0.0：新增對 `@NonNull` 註解的支援
> - 2.1.0：將 JSpecify 註解的預設模式變更為 `strict`，將警告轉換為錯誤；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 以覆寫預設行為

### 變更多載解析以在模糊情況下優先考慮擴充函式而非調用 (invoke) 呼叫

> **問題 (Issue)**：[KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：在模糊情況下，多載解析現在始終優先考慮擴充函式而非調用 (invoke) 呼叫。這解決了局部函式和屬性解析邏輯中的不一致問題。此變更僅在重新編譯後生效，不影響預編譯二進位檔案。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：變更多載解析以在具有匹配簽章的擴充函式中始終優先考慮擴充函式而非 `invoke` 呼叫；此變更僅在重新編譯後生效，不影響預編譯二進位檔案

### 禁止在 JDK 函式介面的 SAM 建構子中從 Lambda 傳回可為空值 (nullable) 的值

> **問題 (Issue)**：[KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：如果在 JDK 函式介面的 SAM 建構子中從 Lambda 傳回可為空值，並且指定的類型引數是不可為空值 (non-nullable) 的，現在將觸發編譯錯誤。這解決了可空性不匹配可能導致執行時例外 (runtime exceptions) 的問題，確保更嚴格的類型安全。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.0.0：對於 JDK 函式介面 SAM 建構子中的可為空值傳回值報告棄用警告
> - 2.1.0：預設啟用新行為

### 更正 Kotlin/Native 中私有成員與公開成員衝突的處理方式

> **問題 (Issue)**：[KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：在 Kotlin/Native 中，私有成員不再覆寫或與超類別中的公開成員衝突，使其行為與 Kotlin/JVM 保持一致。這解決了覆寫解析中的不一致問題，並消除了由於分開編譯引起的意外行為。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：Kotlin/Native 中的私有函式和屬性不再覆寫或影響超類別中的公開成員，與 JVM 行為保持一致

### 禁止在公開內聯函式中存取私有運算子函式

> **問題 (Issue)**：[KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：私有運算子函式，例如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`，在公開內聯函式中不再可存取。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.0.0：在公開內聯函式中存取私有運算子函式時報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 禁止向帶有 `@UnsafeVariance` 註解的不變參數傳遞無效引數

> **問題 (Issue)**：[KTLC-72](https://youtrack.com/issue/KTLC-72)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：編譯器現在在類型檢查期間會忽略 `@UnsafeVariance` 註解，從而對不變類型參數強制執行更嚴格的類型安全。這可以防止依賴 `@UnsafeVariance` 繞過預期類型檢查的無效呼叫。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：啟用新行為

### 報告警告級別 Java 類型中錯誤級別可為空值引數的可空性錯誤

> **問題 (Issue)**：[KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：編譯器現在會偵測 Java 方法中的可空性不匹配問題，其中警告級別的可為空值類型包含具有更嚴格、錯誤級別可空性的類型引數。這確保了先前在類型引數中被忽略的錯誤能夠被正確報告。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.0.0：針對具有更嚴格類型引數的 Java 方法中的可空性不匹配報告棄用警告
> - 2.1.0：將警告提升為錯誤

### 報告不可存取類型的隱式用法

> **問題 (Issue)**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **元件 (Component)**：核心語言
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：編譯器現在會報告函式字面值和類型引數中不可存取類型的用法，從而防止因類型資訊不完整導致的編譯和執行時失敗。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.0.0：針對參數或接收者為不可存取非泛型類型的函式字面值，以及具有不可存取類型引數的類型報告警告；在特定情況下，針對參數或接收者為不可存取泛型類型的函式字面值，以及具有不可存取泛型類型引數的類型報告錯誤
> - 2.1.0：將參數和接收者為不可存取非泛型類型的函式字面值的警告提升為錯誤
> - 2.2.0：將具有不可存取類型引數的類型的警告提升為錯誤

## 標準函式庫

### 棄用 `Char` 和 `String` 的地區設定敏感大小寫轉換函式

> **問題 (Issue)**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **元件 (Component)**：kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：在其他 Kotlin 標準函式庫 API 中，`Char` 和 `String` 的地區設定敏感大小寫轉換函式，例如 `Char.toUpperCase()` 和 `String.toLowerCase()`，已棄用。請將它們替換為地區設定無關的替代方案，如 `String.lowercase()`，或明確指定地區設定以實現地區設定敏感行為，如 `String.lowercase(Locale.getDefault())`。
>
> 有關 Kotlin 2.1.0 中棄用的 Kotlin 標準函式庫 API 的完整清單，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.4.30：引入地區設定無關的替代方案作為實驗性 API
> - 1.5.0：棄用地區設定敏感大小寫轉換函式並發出警告
> - 2.1.0：將警告提升為錯誤

### 移除 kotlin-stdlib-common JAR 產物

> **問題 (Issue)**：[KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **元件 (Component)**：kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：二進位碼
>
> **簡要摘要 (Short summary)**：`kotlin-stdlib-common.jar` 產物，先前用於傳統多平台宣告中繼資料，現已棄用並由 `.klib` 檔案取代，作為通用多平台宣告中繼資料的標準格式。此變更不影響主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 產物。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：棄用並移除 `kotlin-stdlib-common.jar` 產物

### 棄用 `appendln()`，改用 `appendLine()`

> **問題 (Issue)**：[KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **元件 (Component)**：kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：`StringBuilder.appendln()` 已棄用，改用 `StringBuilder.appendLine()`。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.4.0：`appendln()` 函式已棄用；在使用時報告警告
> - 2.1.0：將警告提升為錯誤

### 棄用 Kotlin/Native 中與凍結相關的 API

> **問題 (Issue)**：[KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **元件 (Component)**：kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：Kotlin/Native 中與凍結相關的 API，先前標記有 `@FreezingIsDeprecated` 註解，現已棄用。這與引入新記憶體管理器一致，新記憶體管理器消除了為執行緒共享而凍結物件的需求。有關遷移詳細資訊，請參閱 [Kotlin/Native 遷移指南](native-migration-guide.md#update-your-code)。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.20：棄用與凍結相關的 API 並發出警告
> - 2.1.0：將警告提升為錯誤

### 變更 `Map.Entry` 行為以在結構性修改時快速失敗

> **問題 (Issue)**：[KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **元件 (Component)**：kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：在相關聯的映射 (map) 進行結構性修改後存取 `Map.Entry` 鍵值對，現在將拋出 `ConcurrentModificationException`。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：偵測到映射結構性修改時拋出例外

## 工具

### 棄用 KotlinCompilationOutput#resourcesDirProvider

> **問題 (Issue)**：[KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：`KotlinCompilationOutput#resourcesDirProvider` 欄位已棄用。請改用 Gradle 建置腳本中的 `KotlinSourceSet.resources` 來新增額外資源目錄。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已棄用

### 棄用 `registerKotlinJvmCompileTask(taskName, moduleName)` 函式

> **問題 (Issue)**：[KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：`registerKotlinJvmCompileTask(taskName, moduleName)` 函式已棄用，改用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函式，該函式現在接受 `KotlinJvmCompilerOptions`。這允許您傳遞 `compilerOptions` 實例（通常來自擴充功能或目標），其值用作任務選項的慣例。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：`registerKotlinJvmCompileTask(taskName, moduleName)` 函式已棄用

### 棄用 `registerKaptGenerateStubsTask(taskName)` 函式

> **問題 (Issue)**：[KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：`registerKaptGenerateStubsTask(taskName)` 函式已棄用。請改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函式。這個新版本允許您將相關 `KotlinJvmCompile` 任務的值連結為慣例，確保兩個任務使用相同的選項集。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：`registerKaptGenerateStubsTask(taskName)` 函式已棄用

### 棄用 `KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面

> **問題 (Issue)**：[KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：行為
>
> **簡要摘要 (Short summary)**：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用，改用新的 `KotlinTopLevelExtension` 介面。此介面合併了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension`，以精簡 API 階層，並提供對 JVM 工具鏈和編譯器屬性的官方存取。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用

### 從建置執行時依賴中移除 `kotlin-compiler-embeddable`

> **問題 (Issue)**：[KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：`kotlin-compiler-embeddable` 依賴項已從 Kotlin Gradle 外掛程式 (KGP) 的執行時中移除。所需模組現在直接包含在 KGP 產物中，Kotlin 語言版本限制為 2.0，以支援與 8.2 以下版本 Gradle Kotlin 執行時的相容性。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：在使用 `kotlin-compiler-embeddable` 時報告警告
> - 2.2.0：將警告提升為錯誤

### 從 Kotlin Gradle 外掛程式 API 隱藏編譯器符號

> **問題 (Issue)**：[KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：捆綁在 Kotlin Gradle 外掛程式 (KGP) 中的編譯器模組符號，例如 `KotlinCompilerVersion`，已從公開 API 中隱藏，以防止在建置腳本中意外存取。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：在存取這些符號時報告警告
> - 2.2.0：將警告提升為錯誤

### 新增對多個穩定性設定檔的支援

> **問題 (Issue)**：[KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：Compose 擴充功能中的 `stabilityConfigurationFile` 屬性已棄用，改用新的 `stabilityConfigurationFiles` 屬性，該屬性允許指定多個設定檔。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 2.1.0：`stabilityConfigurationFile` 屬性已棄用

### 移除已棄用的平台外掛程式 ID

> **問題 (Issue)**：[KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **元件 (Component)**：Gradle
>
> **不相容變更類型 (Incompatible change type)**：原始碼
>
> **簡要摘要 (Short summary)**：對這些平台外掛程式 ID 的支援已移除：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.3：平台外掛程式 ID 已棄用
> - 2.1.0：平台外掛程式 ID 不再支援