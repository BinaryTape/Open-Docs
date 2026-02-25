[//]: # (title: Kotlin 2.1.x 相容性指南)

「[保持語言現代化](kotlin-evolution-principles.md)」與「[舒適更新](kotlin-evolution-principles.md)」是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則強調移除前應進行充分溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（如更新日誌或編譯器警告）發佈，但本文檔對其進行了全面總結，為從 Kotlin 2.0 遷移至 Kotlin 2.1 提供完整參考。

## 基本術語

在本文檔中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本可以正常編譯（無錯誤或警告）的程式碼無法再編譯。
- _二進位 (binary)_：如果兩個二進位構件互換後不會導致載入或連結錯誤，則稱它們為二進位相容。
- _行為 (behavioral)_：如果同一程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文檔的討論範圍之內。

## 語言

### 移除語言版本 1.4 和 1.5

> **問題**：[KT-60521](https://youtrack.jetbrains.com/issue/KT-60521)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 2.1 引入了語言版本 2.1，並移除了對語言版本 1.4 和 1.5 的支援。語言版本 1.6 和 1.7 已棄用。
>
> **棄用週期**：
>
> - 1.6.0：針對語言版本 1.4 回報警告
> - 1.9.0：針對語言版本 1.5 回報警告
> - 2.1.0：針對語言版本 1.6 和 1.7 回報警告；將語言版本 1.4 和 1.5 的警告提升為錯誤

### 變更 Kotlin/Native 上的 typeOf() 函式行為

> **問題**：[KT-70754](https://youtrack.jetbrains.com/issue/KT-70754)
>
> **元件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin/Native 上的 `typeOf()` 函式行為現在與 Kotlin/JVM 對齊，以確保各平台間的一致性。
>
> **棄用週期**：
>
> - 2.1.0：對齊 Kotlin/Native 上的 `typeOf()` 函式行為

### 禁止透過型別參數約束公開型別

> **問題**：[KT-69653](https://youtrack.jetbrains.com/issue/KT-69653)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：現在禁止透過型別參數約束公開可見性較低的型別，以解決型別可見性規則中的不一致問題。此變更確保型別參數的約束遵循與類別相同的可見性規則，防止出現如 JVM 中的 IR 驗證錯誤等問題。
>
> **棄用週期**：
>
> - 2.1.0：針對透過可見性較低的型別參數約束公開型別的情況回報警告
> - 2.2.0：將警告提升為錯誤

### 禁止同時繼承同名的抽象 var 屬性與 val 屬性

> **問題**：[KT-58659](https://youtrack.jetbrains.com/issue/KT-58659)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：如果一個類別從介面繼承了一個抽象 `var` 屬性，並從基底類別繼承了一個同名的 `val` 屬性，現在會觸發編譯錯誤。這解決了在此類情況下因缺少 setter 而導致的執行時崩潰。
>
> **棄用週期**：
>
> - 2.1.0：當類別從介面繼承抽象 `var` 屬性且從基底類別繼承同名 `val` 屬性時，回報警告（或在漸進模式下回報錯誤）
> - 2.2.0：將警告提升為錯誤

### 存取未初始化的列舉項目時回報錯誤

> **問題**：[KT-68451](https://youtrack.jetbrains.com/issue/KT-68451)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：編譯器現在會在列舉類別或項目初始化期間，若存取了未初始化的列舉項目 (enum entries) 時回報錯誤。這使行為與成員屬性初始化規則一致，防止執行時例外並確保邏輯一致。
>
> **棄用週期**：
>
> - 2.1.0：存取未初始化的列舉項目時回報錯誤

### K2 智慧轉換傳遞的變更

> **問題**：[KTLC-34](https://youtrack.jetbrains.com/issue/KTLC-34)
>
> **元件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡短摘要**：K2 編譯器變更了智慧轉換傳遞的行為，為推論變數（如 `val x = y`）引入了型別資訊的雙向傳遞。顯式型別變數（如 `val x: T = y`）不再傳遞型別資訊，以確保更嚴格地遵循宣告型別。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 修正 Java 子類別中成員擴充屬性覆寫的處理

> **問題**：[KTLC-35](https://youtrack.jetbrains.com/issue/KTLC-35)
>
> **元件**：核心語言
>
> **不相容變更類型**：行為
>
> **簡短摘要**：被 Java 子類別覆寫的成員擴充屬性，其 getter 現在會在子類別的作用域中隱藏，使其行為與一般 Kotlin 屬性一致。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 修正覆寫 protected val 的 var 屬性之 getter 與 setter 可見性對齊

> **問題**：[KTLC-36](https://youtrack.jetbrains.com/issue/KTLC-36)
>
> **元件**：核心語言
>
> **不相容變更類型**：二進位
> 
> **簡短摘要**：覆寫 `protected val` 屬性的 `var` 屬性，其 getter 與 setter 的可見性現在保持一致，兩者均繼承被覆寫 `val` 屬性的可見性。
>
> **棄用週期**：
>
> - 2.1.0：在 K2 中強制要求 getter 與 setter 的可見性一致；K1 不受影響

### 將 JSpecify 可 null 性不匹配診斷的嚴重程度提升為錯誤

> **問題**：[KTLC-11](https://youtrack.jetbrains.com/issue/KTLC-11)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：來自 `org.jspecify.annotations` 的可 null 性不匹配（如 `@NonNull`、`@Nullable` 和 `@NullMarked`）現在被視為錯誤而非警告，從而對 Java 互通性強制執行更嚴格的型別安全。若要調整這些診斷的嚴重程度，請使用 `-Xnullability-annotations` 編譯器選項。
>
> **棄用週期**：
>
> - 1.6.0：針對潛在的可 null 性不匹配回報警告
> - 1.8.20：將警告範圍擴展到特定的 JSpecify 註解，包括：`@Nullable`、`@NullnessUnspecified`、`@NullMarked`，以及 `org.jspecify.nullness` 中的舊版註解（JSpecify 0.2 及更早版本）
> - 2.0.0：增加對 `@NonNull` 註解的支援
> - 2.1.0：將 JSpecify 註解的預設模式變更為 `strict`，將警告轉換為錯誤；使用 `-Xnullability-annotations=@org.jspecify.annotations:warning` 或 `-Xnullability-annotations=@org.jspecify.annotations:ignore` 可覆寫預設行為

### 變更多載解析，在模糊情況下優先選擇擴充函式而非 invoke 呼叫

> **問題**：[KTLC-37](https://youtrack.jetbrains.com/issue/KTLC-37)
>
> **元件**：核心語言
>
> **不相容變更類型**：行為
> 
> **簡短摘要**：多載解析現在在模糊情況下會一致地優先選擇擴充函式而非 `invoke` 呼叫。這解決了區域函式與屬性解析邏輯中的不一致問題。此變更僅在重新編譯後生效，不影響預先編譯的二進位檔。
>
> **棄用週期**：
>
> - 2.1.0：變更多載解析，針對具有匹配簽章的擴充函式，一致地優先選擇擴充函式而非 `invoke` 呼叫；此變更僅在重新編譯後生效，不影響預先編譯的二進位檔

### 禁止在 JDK 函式介面的 SAM 建構函式中從 Lambda 回傳可為 null 的值

> **問題**：[KTLC-42](https://youtrack.jetbrains.com/issue/KTLC-42)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
> 
> **簡短摘要**：如果在 JDK 函式介面的 SAM 建構函式中，指定的型別引數為不可為 null，則從 Lambda 回傳可為 null 的值現在會觸發編譯錯誤。這解決了可 null 性不匹配可能導致執行時例外的問題，確保更嚴格的型別安全。
>
> **棄用週期**：
>
> - 2.0.0：針對 JDK 函式介面 SAM 建構函式中的可為 null 回傳值回報棄用警告
> - 2.1.0：預設啟用新行為

### 修正 Kotlin/Native 中私有成員與公有成員衝突的處理

> **問題**：[KTLC-43](https://youtrack.jetbrains.com/issue/KTLC-43)
>
> **元件**：核心語言
>
> **不相容變更類型**：行為
> 
> **簡短摘要**：在 Kotlin/Native 中，私有成員不再覆寫或與基底類別中的公有成員發生衝突，使其行為與 Kotlin/JVM 一致。這解決了覆寫解析中的不一致，並消除了由單獨編譯引起的不預期行為。
>
> **棄用週期**：
>
> - 2.1.0：Kotlin/Native 中的私有函式與屬性不再覆寫或影響基底類別中的公有成員，與 JVM 行為一致

### 禁止在公有內嵌函式中存取私有運算子函式

> **問題**：[KTLC-71](https://youtrack.jetbrains.com/issue/KTLC-71)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：私有運算子函式（如 `getValue()`、`setValue()`、`provideDelegate()`、`hasNext()` 和 `next()`）不再能在公有內嵌函式中存取。
>
> **棄用週期**：
>
> - 2.0.0：針對在公有內嵌函式中存取私有運算子函式的行為回報棄用警告
> - 2.1.0：將警告提升為錯誤

### 禁止向帶有 @UnsafeVariance 註解的不變性參數傳遞無效引數

> **問題**：[KTLC-72](https://youtrack.jetbrains.com/issue/KTLC-72)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：編譯器現在在型別檢查期間會忽略 `@UnsafeVariance` 註解，對不變性型別參數強制執行更嚴格的型別安全。這可以防止依賴 `@UnsafeVariance` 來繞過預期型別檢查的無效呼叫。
>
> **棄用週期**：
>
> - 2.1.0：啟用新行為

### 針對警告等級 Java 型別的錯誤等級可為 null 引數回報可 null 性錯誤

> **問題**：[KTLC-100](https://youtrack.jetbrains.com/issue/KTLC-100)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：編譯器現在會偵測 Java 方法中的可 null 性不匹配，即警告等級的可為 null 型別中包含具有更嚴格錯誤等級可 null 性的型別引數。這確保了先前被忽略的型別引數錯誤能被正確回報。
>
> **棄用週期**：
>
> - 2.0.0：針對具有更嚴格型別引數的 Java 方法中的可 null 性不匹配回報棄用警告
> - 2.1.0：將警告提升為錯誤

### 回報無法存取型別的隱式用法

> **問題**：[KTLC-3](https://youtrack.jetbrains.com/issue/KTLC-3)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：編譯器現在會回報函式常值和型別引數中無法存取型別的用法，防止因型別資訊不完整而導致的編譯和執行時失敗。
>
> **棄用週期**：
>
> - 2.0.0：針對具有無法存取之非泛型型別參數或接收者的函式常值，以及具有無法存取型別引數的型別回報警告；針對特定場景下具有無法存取之泛型參數或接收者的函式常值，以及具有無法存取泛型型別引數的型別回報錯誤
> - 2.1.0：針對具有無法存取之非泛型參數或接收者的函式常值，將警告提升為錯誤
> - 2.2.0：針對具有無法存取型別引數的型別，將警告提升為錯誤

## 標準函式庫

### 棄用 Char 和 String 的區域設定敏感大小寫轉換函式

> **問題**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：在其他 Kotlin 標準函式庫 API 中，`Char` 和 `String` 的區域設定敏感大小寫轉換函式（如 `Char.toUpperCase()` 和 `String.toLowerCase()`）已被棄用。請將它們替換為與區域設定無關的替代方案（如 `String.lowercase()`），或顯式指定區域設定以實現區域設定敏感行為（如 `String.lowercase(Locale.getDefault())`）。
>
> 有關 Kotlin 2.1.0 中棄用的 Kotlin 標準函式庫 API 的完整列表，請參閱 [KT-71628](https://youtrack.jetbrains.com/issue/KT-71628)。
>
> **棄用週期**：
>
> - 1.4.30：引入與區域設定無關的替代方案作為實驗性 API
> - 1.5.0：回報警告以棄用區域設定敏感的大小寫轉換函式
> - 2.1.0：將警告提升為錯誤

### 移除 kotlin-stdlib-common JAR 構件

> **問題**：[KT-62159](https://youtrack.jetbrains.com/issue/KT-62159)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：二進位
>
> **簡短摘要**：`kotlin-stdlib-common.jar` 構件先前用於舊版多平台宣告元資料，現已棄用，並由 `.klib` 檔案取代作為通用多平台宣告元資料的標準格式。此變更不影響主要的 `kotlin-stdlib.jar` 或 `kotlin-stdlib-all.jar` 構件。
>
> **棄用週期**：
>
> - 2.1.0：棄用並移除 `kotlin-stdlib-common.jar` 構件

### 棄用 appendln() 以改用 appendLine()

> **問題**：[KTLC-27](https://youtrack.jetbrains.com/issue/KTLC-27)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`StringBuilder.appendln()` 已棄用，改用 `StringBuilder.appendLine()`。
>
> **棄用週期**：
>
> - 1.4.0：`appendln()` 函式已棄用；使用時回報警告
> - 2.1.0：將警告提升為錯誤

### 棄用 Kotlin/Native 中與凍結相關的 API

> **問題**：[KT-69545](https://youtrack.jetbrains.com/issue/KT-69545)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin/Native 中與凍結 (freezing) 相關的 API（先前標記有 `@FreezingIsDeprecated` 註解）現已棄用。這與引入新的記憶體管理器一致，新管理器消除了為了執行緒共享而凍結物件的需求。有關遷移詳細資訊，請參閱 [Kotlin/Native 遷移指南](native-migration-guide.md#update-your-code)。
>
> **棄用週期**：
>
> - 1.7.20：回報警告以棄用凍結相關 API
> - 2.1.0：將警告提升為錯誤

### 變更 Map.Entry 行為，在結構性修改時快速失敗

> **問題**：[KTLC-23](https://youtrack.jetbrains.com/issue/KTLC-23)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡短摘要**：在其關聯的 Map 發生結構性修改後存取 `Map.Entry` 鍵值對，現在會拋出 `ConcurrentModificationException`。
>
> **棄用週期**：
>
> - 2.1.0：偵測到 Map 結構性修改時拋出例外

## 工具

### 棄用 KotlinCompilationOutput#resourcesDirProvider

> **問題**：[KT-69255](https://youtrack.jetbrains.com/issue/KT-69255)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`KotlinCompilationOutput#resourcesDirProvider` 欄位已棄用。請改在 Gradle 組建指令碼中使用 `KotlinSourceSet.resources` 來新增額外的資源目錄。
> 
> **棄用週期**：
>
> - 2.1.0：`KotlinCompilationOutput#resourcesDirProvider` 已棄用

### 棄用 registerKotlinJvmCompileTask(taskName, moduleName) 函式

> **問題**：[KT-69927](https://youtrack.jetbrains.com/issue/KT-69927)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`registerKotlinJvmCompileTask(taskName, moduleName)` 函式已棄用，改用新的 `registerKotlinJvmCompileTask(taskName, compilerOptions, explicitApiMode)` 函式，後者現在接受 `KotlinJvmCompilerOptions`。這允許您傳遞 `compilerOptions` 執行個體（通常來自擴充功能或目標），並將其值作為任務選項的慣例。
>
> **棄用週期**：
>
> - 2.1.0：`registerKotlinJvmCompileTask(taskName, moduleName)` 函式已棄用

### 棄用 registerKaptGenerateStubsTask(taskName) 函式

> **問題**：[KT-70383](https://youtrack.jetbrains.com/issue/KT-70383)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`registerKaptGenerateStubsTask(taskName)` 函式已棄用。請改用新的 `registerKaptGenerateStubsTask(compileTask, kaptExtension, explicitApiMode)` 函式。新版本允許您從相關的 `KotlinJvmCompile` 任務連結值作為慣例，確保兩個任務使用相同的選項集。
>
> **棄用週期**：
>
> - 2.1.0：`registerKaptGenerateStubsTask(taskName)` 函式已棄用

### 棄用 KotlinTopLevelExtension 和 KotlinTopLevelExtensionConfig 介面

> **問題**：[KT-71602](https://youtrack.jetbrains.com/issue/KT-71602)
>
> **元件**：Gradle
>
> **不相容變更類型**：行為
>
> **簡短摘要**：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用，改用新的 `KotlinTopLevelExtension` 介面。此介面合併了 `KotlinTopLevelExtensionConfig`、`KotlinTopLevelExtension` 和 `KotlinProjectExtension` 以簡化 API 階層，並提供對 JVM 工具鏈和編譯器屬性的官方存取。
>
> **棄用週期**：
>
> - 2.1.0：`KotlinTopLevelExtension` 和 `KotlinTopLevelExtensionConfig` 介面已棄用

### 從組建執行階段相依性中移除 kotlin-compiler-embeddable

> **問題**：[KT-61706](https://youtrack.jetbrains.com/issue/KT-61706)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin Gradle 外掛程式 (KGP) 的執行階段中移除了 `kotlin-compiler-embeddable` 相依性。所需的模組現在直接包含在 KGP 構件中，且 Kotlin 語言版本限制為 2.0，以支援與 8.2 以下版本的 Gradle Kotlin 執行階段的相容性。
>
> **棄用週期**：
>
> - 2.1.0：針對使用 `kotlin-compiler-embeddable` 的情況回報警告
> - 2.2.0：將警告提升為錯誤

### 從 Kotlin Gradle 外掛程式 API 中隱藏編譯器符號

> **問題**：[KT-70251](https://youtrack.jetbrains.com/issue/KT-70251)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：捆綁在 Kotlin Gradle 外掛程式 (KGP) 內的編譯器模組符號（如 `KotlinCompilerVersion`）已從公有 API 中隱藏，以防止組建指令碼中發生非預期的存取。
>
> **棄用週期**：
>
> - 2.1.0：針對存取這些符號的情況回報警告
> - 2.2.0：將警告提升為錯誤

### 新增對多個穩定性組態檔案的支援

> **問題**：[KT-68345](https://youtrack.jetbrains.com/issue/KT-68345)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Compose 擴充功能中的 `stabilityConfigurationFile` 屬性已棄用，改用新的 `stabilityConfigurationFiles` 屬性，後者允許指定多個組態檔案。
>
> **棄用週期**：
>
> - 2.1.0：`stabilityConfigurationFile` 屬性已棄用

### 移除已棄用的平台外掛程式 ID

> **問題**：[KT-65565](https://youtrack.jetbrains.com/issue/KT-65565)
>
> **元件**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：已移除對以下平台外掛程式 ID 的支援：
> * `kotlin-platform-common`
> * `org.jetbrains.kotlin.platform.common`
>
> **棄用週期**：
>
> - 1.3：平台外掛程式 ID 已棄用
> - 2.1.0：不再支援這些平台外掛程式 ID