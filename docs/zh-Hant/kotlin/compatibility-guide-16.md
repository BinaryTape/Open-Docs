[//]: # (title: Kotlin 1.6 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。
前者指出阻礙語言演進的結構應該被移除，後者則表示這種移除應提前妥善溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）發布，但本文件總結了所有這些變更，為從 Kotlin 1.5 遷移到 Kotlin 1.6 提供了完整的參考。

## 基本術語

本文介紹了幾種相容性類型：

- _原始碼_：原始碼不相容的變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼無法再編譯
- _二進位_：如果兩個二進位構件在互相替換時不會導致載入或連結錯誤，則稱它們為二進位相容
- _行為_：如果同一程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純 Kotlin。Kotlin 程式碼從其他語言角度（例如 Java）的相容性不在本文討論範圍內。

## 語言

### 使以列舉、密封類別和布林作為主體的 when 陳述式預設為窮盡式

> **課題**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將對使用列舉 (enum)、密封類別 (sealed class) 或布林 (Boolean) 作為主體的 `when` 陳述式，如果不是窮盡式 (non-exhaustive) 的情況發出警告。
>
> **棄用週期**:
>
> - 1.6.0: 當 `when` 陳述式以列舉、密封類別或布林作為主體且非窮盡式時引入警告（在漸進模式下為錯誤）
> - 1.7.0: 將此警告提升為錯誤

### 棄用 when-with-subject 中令人混淆的語法

> **課題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將棄用 `when` 條件表達式中幾個令人混淆的語法結構。
>
> **棄用週期**:
>
> - 1.6.20: 對受影響的表達式引入棄用警告
> - 1.8.0: 將此警告提升為錯誤
> - &gt;= 1.8: 將一些棄用的結構重新用於新的語言功能

### 禁止在伴生物件和巢狀物件的超類別建構式呼叫中存取類別成員

> **課題**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將報告針對伴生物件和正規物件的超類別建構式呼叫參數的錯誤，如果這些參數的接收者引用了包含宣告。
>
> **棄用週期**:
>
> - 1.5.20: 對有問題的參數引入警告
> - 1.6.0: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 可用於暫時恢復到 1.6 之前的行為

### 型別空值性增強改進

> **課題**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.7 將變更其載入和解釋 Java 程式碼中型別空值性註解的方式。
>
> **棄用週期**:
>
> - 1.4.30: 對更精確的型別空值性可能導致錯誤的情況引入警告
> - 1.7.0: 推斷更精確的 Java 型別空值性，
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用於暫時恢復到 1.7 之前的行為

### 禁止不同數值型別之間的隱式強制轉換

> **課題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為
>
> **簡述**: Kotlin 將避免在僅需向下轉型為原始數值型別時自動將數值轉換為該型別。
>
> **棄用週期**:
>
> - < 1.5.30: 在所有受影響的情況下採用舊行為
> - 1.5.30: 修正生成屬性委託存取器中的向下轉型行為，
>   `-Xuse-old-backend` 可用於暫時恢復到 1.5.30 之前的修正行為
> - &gt;= 1.6.20: 修正其他受影響情況下的向下轉型行為

### 禁止宣告其容器註解違反 JLS 的可重複註解類別

> **課題**: [KT-47928](https://youtrack.com/issue/KT-47928)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將檢查可重複註解的容器註解是否滿足 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中的相同要求：陣列型別的值方法、保留策略和目標。
>
> **棄用週期**:
>
> - 1.5.30: 對違反 JLS 要求可重複容器註解宣告引入警告（在漸進模式下為錯誤）
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用於暫時停用錯誤報告

### 禁止在可重複註解類別中宣告名為 Container 的巢狀類別

> **課題**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將檢查在 Kotlin 中宣告的可重複註解是否沒有預定義名稱 `Container` 的巢狀類別。
>
> **棄用週期**:
>
> - 1.5.30: 對 Kotlin 可重複註解類別中名為 `Container` 的巢狀類別引入警告（在漸進模式下為錯誤）
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用於暫時停用錯誤報告

### 禁止在主建構式中覆寫介面屬性的屬性上使用 @JvmField

> **課題**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將禁止在主建構式中宣告並覆寫介面屬性的屬性上註解 `@JvmField`。
>
> **棄用週期**:
>
> - 1.5.20: 對主建構式中此類屬性上的 `@JvmField` 註解引入警告
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 可用於暫時停用錯誤報告

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **課題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6.20 將對使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式發出警告。
>
> **棄用週期**:
>
> - 1.6.20: 對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0: 將此警告提升為錯誤

### 禁止從公開 ABI 內聯函式中呼叫 super

> **課題**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將禁止從公開或保護內聯函式和屬性中呼叫帶有 `super` 限定符的函式。
>
> **棄用週期**:
>
> - 1.5.0: 對從公開或保護內聯函式或屬性存取器中呼叫 super 引入警告
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 可用於暫時停用錯誤報告

### 禁止從公開內聯函式中呼叫保護建構式

> **課題**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將禁止從公開或保護內聯函式和屬性中呼叫保護建構式。
>
> **棄用週期**:
>
> - 1.4.30: 對從公開或保護內聯函式或屬性存取器中呼叫保護建構式引入警告
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 可用於暫時停用錯誤報告

### 禁止從檔案內私有型別中暴露私有巢狀型別

> **課題**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將禁止從檔案內私有型別中暴露私有巢狀型別和內部類別。
>
> **棄用週期**:
>
> - 1.5.0: 對從檔案內私有型別中暴露私有型別引入警告
> - 1.6.0: 將此警告提升為錯誤，
>   `-XXLanguage:-PrivateInFileEffectiveVisibility` 可用於暫時停用錯誤報告

### 在某些情況下，型別上的註解目標未被分析

> **課題**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將不再允許在不應適用於型別的型別上使用註解。
>
> **棄用週期**:
>
> - 1.5.20: 在漸進模式下引入錯誤
> - 1.6.0: 引入錯誤，
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 可用於暫時停用錯誤報告

### 禁止呼叫帶有尾隨 lambda 的名為 suspend 的函式

> **課題**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 1.6 將不再允許呼叫名為 `suspend` 且將單個函式型別參數作為尾隨 lambda 傳遞的函式。
>
> **棄用週期**:
>
> - 1.3.0: 對此類函式呼叫引入警告
> - 1.6.0: 將此警告提升為錯誤
> - &gt;= 1.7.0: 引入語言語法變更，以便 `suspend` 在 `{` 之前被解析為關鍵字

## 標準函式庫

### 移除 minus/removeAll/retainAll 中脆弱的 contains 優化

> **課題**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 行為
>
> **簡述**: Kotlin 1.6 將不再為從集合/迭代器/陣列/序列中移除多個元素的函式和運算子的參數執行轉換為集合的操作。
>
> **棄用週期**:
>
> - < 1.6: 舊行為：在某些情況下，參數會被轉換為集合
> - 1.6.0: 如果函式參數是一個集合，它不再轉換為 `Set`。如果它不是集合，它可以轉換為 `List`。
>   舊行為可以在 JVM 上透過設定系統屬性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 暫時啟用。
> - &gt;= 1.7: 上述系統屬性將不再有效

### 變更 Random.nextLong 中的數值生成演算法

> **課題**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 行為
>
> **簡述**: Kotlin 1.6 變更了 `Random.nextLong` 函式中的數值生成演算法，以避免產生超出指定範圍的數值。
>
> **棄用週期**:
>
> - 1.6.0: 行為立即被修正

### 逐步將集合 min 和 max 函式的回傳型別變更為非空值

> **課題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 集合 `min` 和 `max` 函式的回傳型別將在 Kotlin 1.7 中變更為非空值 (non-nullable)。
>
> **棄用週期**:
>
> - 1.4.0: 引入 `...OrNull` 函式作為同義詞並棄用受影響的 API（詳情見課題）
> - 1.5.0: 將受影響 API 的棄用級別提升為錯誤
> - 1.6.0: 從公開 API 中隱藏棄用的函式
> - &gt;= 1.7: 重新引入受影響的 API，但使用非空值回傳型別

### 棄用浮點陣列函式：contains、indexOf、lastIndexOf

> **課題**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin 棄用浮點陣列函式 `contains`、`indexOf`、`lastIndexOf`，這些函式使用 IEEE-754 順序而不是全序比較數值。
>
> **棄用週期**:
>
> - 1.4.0: 以警告形式棄用受影響的函式
> - 1.6.0: 將棄用級別提升為錯誤
> - &gt;= 1.7: 從公開 API 中隱藏棄用的函式

### 將 kotlin.dom 和 kotlin.browser 套件中的宣告遷移至 kotlinx.*

> **課題**: [KT-39330](https://youtrack.com/issue/KT-39330)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡述**: `kotlin.dom` 和 `kotlin.browser` 套件中的宣告被移動到對應的 `kotlinx.*` 套件，為從標準函式庫 (stdlib) 中提取它們做準備。
>
> **棄用週期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議使用上述新 API 作為替代
> - 1.6.0: 將棄用級別提升為錯誤
> - &gt;= 1.7: 從標準函式庫中移除棄用的函式
> - &gt;= 1.7: 將 `kotlinx.*` 套件中的 API 移至單獨的函式庫

### 使 Kotlin/JS 中的 Regex.replace 函式不再內聯

> **課題**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡述**: Kotlin/JS 中帶有函式 `transform` 參數的 `Regex.replace` 函式將不再是內聯 (inline)。
>
> **棄用週期**:
>
> - 1.6.0: 從受影響的函式中移除 `inline` 修飾符

### 當替換字串包含群組引用時，JVM 和 JS 中 Regex.replace 函式的行為不同

> **課題**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 行為
>
> **簡述**: Kotlin/JS 中帶有替換模式字串的 `Regex.replace` 函式將遵循與 Kotlin/JVM 中相同模式語法。
>
> **棄用週期**:
>
> - 1.6.0: 變更 Kotlin/JS 標準函式庫中 `Regex.replace` 的替換模式處理方式

### 在 JS Regex 中使用 Unicode 大小寫摺疊

> **課題**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 行為
>
> **簡述**: Kotlin/JS 中的 `Regex` 類別在呼叫底層 JS 正規表達式引擎時將使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 標誌，以根據 Unicode 規則搜尋和比較字元。
> 這帶來了 JS 環境的某些版本要求，並導致對正規表達式模式字串中不必要的跳脫符號進行更嚴格的驗證。
>
> **棄用週期**:
>
> - 1.5.0: 在 JS `Regex` 類別的大多數函式中啟用 Unicode 大小寫摺疊
> - 1.6.0: 在 `Regex.replaceFirst` 函式中啟用 Unicode 大小寫摺疊

### 棄用部分僅限 JS 的 API

> **課題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 標準函式庫中許多僅限 JS 的函式已被棄用以供移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函式的陣列 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期**:
>
> - 1.6.0: 以警告形式棄用受影響的函式
> - 1.7.0: 將棄用級別提升為錯誤
> - 1.8.0: 從公開 API 中移除棄用的函式

### 從 Kotlin/JS 類別的公開 API 中隱藏實作和互通性特定函式

> **課題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼, 二進位
>
> **簡述**: 函式 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 將其可見性變更為內部 (internal)。
>
> **棄用週期**:
>
> - 1.6.0: 使函式內部化，從而將它們從公開 API 中移除

## 工具

### 棄用 KotlinGradleSubplugin 類別

> **課題**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: `KotlinGradleSubplugin` 類別將被棄用，轉而使用 `KotlinCompilerPluginSupportPlugin`。
>
> **棄用週期**:
>
> - 1.6.0: 將棄用級別提升為錯誤
> - &gt;= 1.7.0: 移除棄用的類別

### 移除 kotlin.useFallbackCompilerSearch 建置選項

> **課題**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 移除已棄用的 `kotlin.useFallbackCompilerSearch` 建置選項。
>
> **棄用週期**:
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.6.0: 移除棄用的選項

### 移除多個編譯器選項

> **課題**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 移除已棄用的 `noReflect` 和 `includeRuntime` 編譯器選項。
>
> **棄用週期**:
>
> - 1.5.0: 將棄用級別提升為錯誤
> - 1.6.0: 移除棄用的選項

### 棄用 useIR 編譯器選項

> **課題**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 隱藏已棄用的 `useIR` 編譯器選項。
>
> **棄用週期**:
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.6.0: 隱藏該選項
> - &gt;= 1.7.0: 移除棄用的選項

### 棄用 kapt.use.worker.api Gradle 屬性

> **課題**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 棄用允許透過 Gradle Workers API 執行 kapt 的 `kapt.use.worker.api` 屬性（預設：true）。
>
> **棄用週期**:
>
> - 1.6.20: 將棄用級別提升為警告
> - &gt;= 1.8.0: 移除此屬性

### 移除 kotlin.parallel.tasks.in.project Gradle 屬性

> **課題**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 移除 `kotlin.parallel.tasks.in.project` 屬性。
>
> **棄用週期**:
>
> - 1.5.20: 將棄用級別提升為警告
> - 1.6.20: 移除此屬性

### 棄用 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **課題**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡述**: 棄用 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性。
>
> **棄用週期**:
>
> - 1.6.20: 將棄用級別提升為警告
> - &gt;= 1.7.0: 移除 DSL 選項和屬性