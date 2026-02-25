[//]: # (title: Kotlin 1.6.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_與_[舒適的更新](kotlin-evolution-principles.md)_是 Kotlin 語言設計的基本原則。前者指出應該移除阻礙語言演進的建構，後者則要求此類移除應事先進行良好的溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道宣布（例如更新日誌或編譯器警告），本文件彙整了所有變更，為從 Kotlin 1.5 遷移到 Kotlin 1.6 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼_：原始碼不相容的變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再通過編譯
- _二進制_：如果交換兩個二進制構件不會導致載入或連結錯誤，則稱它們為二進制相容
- _行為_：如果在套用變更前後，相同的程式展現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅針對純 Kotlin 給出。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文件的討論範圍之內。

## 語言

### 預設使以 enum、sealed 以及 Boolean 為主體的 when 陳述式完備

> **問題**：[KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將對以 enum、sealed 或 Boolean 為主體但不完備的 `when` 陳述式發出警告
>
> **棄用週期**：
>
> - 1.6.0：當以 enum、sealed 或 Boolean 為主體的 `when` 陳述式不完備時，引入警告（在漸進模式下為錯誤）
> - 1.7.0：將此警告提升為錯誤

### 棄用帶主體的 when 中易混淆的語法

> **問題**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將棄用 `when` 條件表達式中幾種易混淆的語法建構
>
> **棄用週期**：
>
> - 1.6.20：對受影響的表達式引入棄用警告
> - 1.8.0：將此警告提升為錯誤
> - &gt;= 1.8：將某些棄用的建構重新用於新的語言特性

### 禁止在其伴生與巢狀物件的父類別建構函式呼叫中存取類別成員

> **問題**：[KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：在 Kotlin 1.6 中，如果伴生與一般物件的父類別建構函式呼叫的引數之接收者指向包含該物件的宣告，編譯器將回報錯誤
>
> **棄用週期**：
>
> - 1.5.20：對有問題的引數引入警告
> - 1.6.0：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 暫時恢復為 1.6 之前的行為

### 型別可 null 性增強改進

> **問題**：[KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.7 將變更載入和解釋 Java 程式碼中可 null 性註解的方式
>
> **棄用週期**：
>
> - 1.4.30：針對更精確的型別可 null 性可能導致錯誤的情況引入警告
> - 1.7.0：推論出更精確的 Java 型別可 null 性，
>   可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暫時恢復為 1.7 之前的行為

### 防止不同數值型別之間的隱式強制轉換

> **問題**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 將避免在語意上只需要向下轉換至該型別的地方，自動將數值常值轉換為原始數值型別
>
> **棄用週期**：
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修正產生的屬性委派存取子中的向下轉換行為，
>   可以使用 `-Xuse-old-backend` 暫時恢復為 1.5.30 修正之前的行為
> - &gt;= 1.6.20：修正其他受影響情況下的向下轉換行為

### 禁止宣告其容器註解違反 JLS 的可重複註解類別

> **問題**：[KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將檢查可重複註解的容器註解是否符合 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中的相同需求：陣列型別的值方法、保留策略 (retention) 以及目標 (target)
>
> **棄用週期**：
>
> - 1.5.30：對違反 JLS 需求的可重複容器註解宣告引入警告（在漸進模式下為錯誤）
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暫時停用錯誤回報

### 禁止在可重複註解類別中宣告名為 Container 的巢狀類別

> **問題**：[KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將檢查在 Kotlin 中宣告的可重複註解是否具有預定義名稱為 `Container` 的巢狀類別
>
> **棄用週期**：
>
> - 1.5.30：對 Kotlin 可重複註解類別中名稱為 `Container` 的巢狀類別引入警告（在漸進模式下為錯誤）
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暫時停用錯誤回報

### 禁止在主建構函數中覆寫介面屬性的屬性上使用 @JvmField

> **問題**：[KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將禁止在主建構函數中宣告且覆寫介面屬性的屬性上使用 `@JvmField` 註解
>
> **棄用週期**：
>
> - 1.5.20：對主建構函數中此類屬性上的 `@JvmField` 註解引入警告
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 暫時停用錯誤回報

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **問題**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6.20 將針對使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式發出警告
>
> **棄用週期**：
>
> - 1.6.20：針對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0：將此警告提升為錯誤

### 禁止從 public-abi 內嵌函式進行 super 呼叫

> **問題**：[KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將禁止從公開 (public) 或受保護 (protected) 的內嵌函式與屬性中呼叫帶有 `super` 限定詞的函式
>
> **棄用週期**：
>
> - 1.5.0：對從公開或受保護的內嵌函式或屬性存取子進行的 super 呼叫引入警告
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 暫時停用錯誤回報

### 禁止從公開內嵌函式呼叫受保護的建構函式

> **問題**：[KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將禁止從公開或受保護的內嵌函式與屬性中呼叫受保護的建構函式
>
> **棄用週期**：
>
> - 1.4.30：對從公開或受保護的內嵌函式或屬性存取子進行的受保護建構函式呼叫引入警告
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 暫時停用錯誤回報

### 禁止從檔案私有型別暴露私有巢狀型別

> **問題**：[KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將禁止從檔案私有 (private-in-file) 型別中暴露私有巢狀型別和內部類別
>
> **棄用週期**：
>
> - 1.5.0：對從檔案私有型別中暴露的私有型別引入警告
> - 1.6.0：將此警告提升為錯誤，
>   可以使用 `-XXLanguage:-PrivateInFileEffectiveVisibility` 暫時停用錯誤回報

### 在數種情況下未對型別上的註解進行註解目標分析

> **問題**：[KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將不再允許在不應適用於型別的型別上使用註解
>
> **棄用週期**：
>
> - 1.5.20：在漸進模式下引入錯誤
> - 1.6.0：引入錯誤，
>   可以使用 `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 暫時停用錯誤回報

### 禁止呼叫名為 suspend 且帶有尾隨 Lambda 的函式

> **問題**：[KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 將不再允許呼叫名為 `suspend` 且將單一功能型別引數作為尾隨 Lambda 傳遞的函式
>
> **棄用週期**：
>
> - 1.3.0：對此類函式呼叫引入警告
> - 1.6.0：將此警告提升為錯誤
> - &gt;= 1.7.0：對語言語法進行變更，使得 `{` 之前的 `suspend` 被解析為關鍵字

## 標準庫

### 移除 minus/removeAll/retainAll 中脆弱的 contains 最佳化

> **問題**：[KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 1.6 在從集合 (collection)/可迭代對象 (iterable)/陣列 (array)/序列 (sequence) 中移除多個元素的函式和運算子中，將不再對其引數執行轉換為 set 的操作。
>
> **棄用週期**：
>
> - < 1.6：舊行為：在某些情況下，引數會被轉換為 set
> - 1.6.0：如果函式引數是集合，則不再轉換為 `Set`。如果它不是集合，則可能改為轉換為 `List`。  
> 舊行為可以在 JVM 上透過設定系統屬性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 來暫時恢復
> - &gt;= 1.7：上述系統屬性將不再生效

### 變更 Random.nextLong 中的值產生演算法

> **問題**：[KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 1.6 變更了 `Random.nextLong` 函式中的值產生演算法，以避免產生超出指定範圍的值。
>
> **棄用週期**：
>
> - 1.6.0：該行為立即修正

### 逐步將集合 min 和 max 函式的回傳型別變更為非空

> **問題**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：集合 `min` 和 `max` 函式的回傳型別將在 Kotlin 1.7 中變更為非空 (non-nullable)
>
> **棄用週期**：
>
> - 1.4.0：引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳情見該問題）
> - 1.5.0：將受影響 API 的棄用級別提升為錯誤
> - 1.6.0：從公開 API 中隱藏棄用的函式
> - &gt;= 1.7：重新引入受影響的 API，但具有非空回傳型別

### 棄用浮點數陣列函式：contains、indexOf、lastIndexOf

> **問題**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 棄用了使用 IEEE-754 順序而非全序 (total order) 比較值的浮點數陣列函式 `contains`、`indexOf`、`lastIndexOf`
>
> **棄用週期**：
>
> - 1.4.0：對受影響的函式發出棄用警告
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7：從公開 API 中隱藏棄用的函式

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移至 kotlinx.*

> **問題**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至對應的 `kotlinx.*` 套件，以為從 stdlib 中提取它們做準備
>
> **棄用週期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議使用上述新 API 作為替代
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7：從 stdlib 中移除棄用的函式
> - &gt;= 1.7：將 kotlinx.* 套件中的 API 移至獨立程式庫

### 使 Kotlin/JS 中的 Regex.replace 函式不再是內嵌的

> **問題**：[KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：在 Kotlin/JS 中，帶有功能性 `transform` 參數的 `Regex.replace` 函式將不再是內嵌的
>
> **棄用週期**：
>
> - 1.6.0：從受影響的函式中移除 `inline` 修飾符

### 當替換字串包含群組參考時，Regex.replace 函式在 JVM 和 JS 中的不同行為

> **問題**：[KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin/JS 中帶有替換模式字串的 `Regex.replace` 函式將遵循與 Kotlin/JVM 中相同的模式語法
>
> **棄用週期**：
>
> - 1.6.0：變更 Kotlin/JS stdlib 中 `Regex.replace` 的替換模式處理方式

### 在 JS Regex 中使用 Unicode 大小寫摺疊

> **問題**：[KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin/JS 中的 `Regex` 類別在呼叫底層 JS 正規表示式引擎時將使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 標記，以便根據 Unicode 規則搜尋和比較字元。
> 這帶來了對 JS 環境的某些版本要求，並導致對正規表示式模式字串中不必要轉義的更嚴格驗證。
>
> **棄用週期**：
>
> - 1.5.0：在 JS `Regex` 類別的大多數函式中啟用 Unicode 大小寫摺疊
> - 1.6.0：在 `Regex.replaceFirst` 函式中啟用 Unicode 大小寫摺疊

### 棄用某些僅限 JS 的 API

> **問題**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：stdlib 中許多僅限 JS 的函式已被棄用並將移除。其中包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及陣列上接受比較函式的 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **棄用週期**：
>
> - 1.6.0：對受影響的函式發出棄用警告
> - 1.7.0：將棄用級別提升為錯誤
> - 1.8.0：從公開 API 中移除棄用的函式

### 從 Kotlin/JS 類別的公開 API 中隱藏實作和互通特定函式

> **問題**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼、二進制
>
> **簡短摘要**：函式 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 將其可見性變更為 internal
>
> **棄用週期**：
>
> - 1.6.0：將這些函式設為 internal，進而從公開 API 中移除

## 工具

### 棄用 KotlinGradleSubplugin 類別

> **問題**：[KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：`KotlinGradleSubplugin` 類別將被棄用，取而代之的是 `KotlinCompilerPluginSupportPlugin`
>
> **棄用週期**：
>
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7.0：移除棄用的類別

### 移除 kotlin.useFallbackCompilerSearch 組建選項

> **問題**：[KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：移除棄用的 'kotlin.useFallbackCompilerSearch' 組建選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為警告
> - 1.6.0：移除棄用的選項

### 移除數個編譯器選項

> **問題**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：移除棄用的 `noReflect` 和 `includeRuntime` 編譯器選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為錯誤
> - 1.6.0：移除棄用的選項

### 棄用 useIR 編譯器選項

> **問題**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：隱藏棄用的 `useIR` 編譯器選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為警告
> - 1.6.0：隱藏該選項
> - &gt;= 1.7.0：移除棄用的選項

### 棄用 kapt.use.worker.api Gradle 屬性

> **問題**：[KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `kapt.use.worker.api` 屬性，該屬性曾允許透過 Gradle Workers API 執行 kapt（預設值：true）
>
> **棄用週期**：
>
> - 1.6.20：將棄用級別提升為警告
> - &gt;= 1.8.0：移除此屬性

### 移除 kotlin.parallel.tasks.in.project Gradle 屬性

> **問題**：[KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：移除 `kotlin.parallel.tasks.in.project` 屬性
>
> **棄用週期**：
>
> - 1.5.20：將棄用級別提升為警告
> - 1.6.20：移除此屬性

### 棄用 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **問題**：[KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性
>
> **棄用週期**：
>
> - 1.6.20：將棄用級別提升為警告
> - &gt;= 1.7.0：移除該 DSL 選項和屬性