---
title: "Kotlin 1.6 的相容性指南"
---
_[保持語言現代性](kotlin-evolution-principles)_和_[舒適的更新](kotlin-evolution-principles)_是 Kotlin 語言設計的基本原則。前者表示應移除阻礙語言發展的結構，後者表示應事先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（如更新日誌或編譯器警告）宣布，但本文總結了所有這些變更，為從 Kotlin 1.5 遷移到 Kotlin 1.6 提供了完整的參考。

## 基本術語

在本文中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再也無法編譯
- _二進位 (binary)_：如果交換兩個二進位構件不會導致載入或連結錯誤，則稱它們是二進位相容的
- _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更是行為不相容的

請記住，這些定義僅適用於純 Kotlin。從其他語言的角度來看，Kotlin 程式碼的相容性（例如，從 Java）不在本文的範圍內。

## 語言

### 預設情況下，使具有 enum、sealed 和 Boolean 主體的 when 語句詳盡無遺

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將針對具有 enum、sealed 或 Boolean 主體的 `when` 語句未詳盡無遺發出警告
>
> **Deprecation cycle**:
>
> - 1.6.0：當具有 enum、sealed 或 Boolean 主體的 `when` 語句未詳盡無遺時，引入警告（在 progressive 模式下為錯誤）
> - 1.7.0：將此警告升級為錯誤

### 棄用 when-with-subject 中令人困惑的語法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將棄用 `when` 條件表達式中的幾個令人困惑的語法結構
>
> **Deprecation cycle**:
>
> - 1.6.20：在受影響的表達式上引入棄用警告
> - 1.8.0：將此警告升級為錯誤
> - &gt;= 1.8：將一些已棄用的結構重新用於新的語言功能

### 禁止在其伴生物件 (companion object) 和巢狀物件 (nested object) 的 super 建構子呼叫中存取類別成員

> **Issue**: [KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 如果 super 建構子呼叫的引數引用包含的宣告，則 Kotlin 1.6 將報告伴生物件和常規物件的 super 建構子呼叫的引數的錯誤
>
> **Deprecation cycle**:
>
> - 1.5.20：在有問題的引數上引入警告
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 暫時恢復到 1.6 之前的行為

### 類型可空性 (type nullability) 增強改進

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.7 將變更它在 Java 程式碼中載入和解釋類型可空性註解的方式
>
> **Deprecation cycle**:
>
> - 1.4.30：針對更精確的類型可空性可能導致錯誤的情況引入警告
> - 1.7.0：推斷 Java 類型的更精確的可空性，可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暫時恢復到 1.7 之前的行為

### 防止不同數字類型之間的隱式強制轉換

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 將避免自動將數值轉換為原始數字類型，在語義上只需要向下轉換 (downcast) 為該類型
>
> **Deprecation cycle**:
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修復產生的屬性委託存取器中的向下轉換行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 之前的修復行為
> - &gt;= 1.6.20：修復其他受影響情況下的向下轉換行為

### 禁止宣告其容器註解違反 JLS 的可重複註解類別

> **Issue**: [KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將檢查可重複註解的容器註解是否滿足與 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中相同的要求：陣列類型的值方法、保留和目標
>
> **Deprecation cycle**:
>
> - 1.5.30：在違反 JLS 要求的可重複容器註解宣告上引入警告（在 progressive 模式下為錯誤）
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暫時停用錯誤報告

### 禁止在可重複註解類別中宣告名為 Container 的巢狀類別

> **Issue**: [KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將檢查在 Kotlin 中宣告的可重複註解是否沒有具有預定義名稱 `Container` 的巢狀類別
>
> **Deprecation cycle**:
>
> - 1.5.30：在 Kotlin 可重複註解類別中名稱為 `Container` 的巢狀類別上引入警告（在 progressive 模式下為錯誤）
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-RepeatableAnnotationContainerConstraints` 暫時停用錯誤報告

### 禁止在覆寫介面屬性的主要建構子中的屬性上使用 @JvmField

> **Issue**: [KT-32753](https://youtrack.jetbrains.com/issue/KT-32753)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將禁止使用 `@JvmField` 註解來註解在覆寫介面屬性的主要建構子中宣告的屬性
>
> **Deprecation cycle**:
>
> - 1.5.20：在此類主要建構子中的屬性上的 `@JvmField` 註解上引入警告
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 暫時停用錯誤報告

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6.20 將警告有關使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式
>
> **Deprecation cycle**:
>
> - 1.6.20：在 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式上引入警告
> - &gt;= 1.8.0：將此警告升級為錯誤

### 禁止從 public-abi inline 函數進行 super 呼叫

> **Issue**: [KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將禁止從 public 或 protected inline 函數和屬性中呼叫具有 `super` 限定符的函數
>
> **Deprecation cycle**:
>
> - 1.5.0：在從 public 或 protected inline 函數或屬性存取器進行的 super 呼叫上引入警告
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 暫時停用錯誤報告

### 禁止從 public inline 函數進行 protected 建構子呼叫

> **Issue**: [KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將禁止從 public 或 protected inline 函數和屬性中呼叫 protected 建構子
>
> **Deprecation cycle**:
>
> - 1.4.30：在從 public 或 protected inline 函數或屬性存取器進行的 protected 建構子呼叫上引入警告
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 暫時停用錯誤報告

### 禁止從 file-private 類型公開 private 巢狀類型

> **Issue**: [KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將禁止從 file-private 類型公開 private 巢狀類型和內部類別
>
> **Deprecation cycle**:
>
> - 1.5.0：在從 file-private 類型公開的 private 類型上引入警告
> - 1.6.0：將此警告升級為錯誤，可以使用 `-XXLanguage:-PrivateInFileEffectiveVisibility` 暫時停用錯誤報告

### 在類型的註解中，註解目標在多種情況下未被分析

> **Issue**: [KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將不再允許類型上不應適用的註解
>
> **Deprecation cycle**:
>
> - 1.5.20：在 progressive 模式下引入錯誤
> - 1.6.0：引入錯誤，可以使用 `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 暫時停用錯誤報告

### 禁止呼叫名為 suspend 的函數，且該函數帶有尾隨 lambda

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.6 將不再允許呼叫名為 `suspend` 的函數，該函數具有作為尾隨 lambda 傳遞的功能類型單個引數
>
> **Deprecation cycle**:
>
> - 1.3.0：在此類函數呼叫上引入警告
> - 1.6.0：將此警告升級為錯誤
> - &gt;= 1.7.0：引入對語言語法的變更，以便將 `{` 之前的 `suspend` 解析為關鍵字

## 標準函式庫 (Standard library)

### 移除 minus/removeAll/retainAll 中脆弱的 contains 優化

> **Issue**: [KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 1.6 將不再對從 collection/iterable/array/sequence 中移除多個元素的函數和運算子的引數執行轉換為 set 的操作。
>
> **Deprecation cycle**:
>
> - < 1.6：舊行為：在某些情況下，引數會轉換為 set
> - 1.6.0：如果函數引數是 collection，則不再轉換為 `Set`。如果它不是 collection，則可以轉換為 `List`。  
> 可以透過設定系統屬性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 在 JVM 上暫時恢復舊行為
> - &gt;= 1.7：上面的系統屬性將不再有效

### 變更 Random.nextLong 中的值生成演算法

> **Issue**: [KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 1.6 變更了 `Random.nextLong` 函數中的值生成演算法，以避免產生超出指定範圍的值。
>
> **Deprecation cycle**:
>
> - 1.6.0：立即修復該行為

### 逐步將 collection min 和 max 函數的回傳類型變更為不可為空

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: collection `min` 和 `max` 函數的回傳類型將在 Kotlin 1.7 中變更為不可為空
>
> **Deprecation cycle**:
>
> - 1.4.0：引入 `...OrNull` 函數作為同義詞，並棄用受影響的 API（請參閱 issue 中的詳細資訊）
> - 1.5.0：將受影響的 API 的棄用等級提高到錯誤
> - 1.6.0：從 public API 中隱藏已棄用的函數
> - &gt;= 1.7：重新引入受影響的 API，但回傳類型不可為空

### 棄用浮點陣列函數：contains、indexOf、lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 棄用了浮點陣列函數 `contains`、`indexOf`、`lastIndexOf`，這些函數使用 IEEE-754 順序而不是總順序來比較值
>
> **Deprecation cycle**:
>
> - 1.4.0：棄用受影響的函數並發出警告
> - 1.6.0：將棄用等級提高到錯誤
> - &gt;= 1.7：從 public API 中隱藏已棄用的函數

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 來自 `kotlin.dom` 和 `kotlin.browser` 套件的宣告已移動到相應的 `kotlinx.*` 套件，以為將它們從 stdlib 中提取出來做準備
>
> **Deprecation cycle**:
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替換 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議將上面的新 API 作為替換
> - 1.6.0：將棄用等級提高到錯誤
> - &gt;= 1.7：從 stdlib 中移除已棄用的函數
> - &gt;= 1.7：將 kotlinx.* 套件中的 API 移動到單獨的函式庫

### 使 Regex.replace 函數在 Kotlin/JS 中不是 inline

> **Issue**: [KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 具有 functional `transform` 參數的 `Regex.replace` 函數在 Kotlin/JS 中將不再是 inline
>
> **Deprecation cycle**:
>
> - 1.6.0：從受影響的函數中移除 `inline` 修飾符

### 當替換字串包含群組參考時，Regex.replace 函數在 JVM 和 JS 中的行為不同

> **Issue**: [KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin/JS 中具有替換模式字串的函數 `Regex.replace` 將遵循與 Kotlin/JVM 中相同的模式語法
>
> **Deprecation cycle**:
>
> - 1.6.0：變更 Kotlin/JS stdlib 的 `Regex.replace` 中的替換模式處理

### 在 JS Regex 中使用 Unicode 大小寫摺疊

> **Issue**: [KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin/JS 中的 `Regex` 類別將在使用底層 JS 正規表示式引擎來根據 Unicode 規則搜尋和比較字元時使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 標誌。
> 這帶來了 JS 環境的某些版本要求，並導致對 regex 模式字串中不必要的逸出進行更嚴格的驗證。
>
> **Deprecation cycle**:
>
> - 1.5.0：在 JS `Regex` 類別的大多數函數中啟用 Unicode 大小寫摺疊
> - 1.6.0：在 `Regex.replaceFirst` 函數中啟用 Unicode 大小寫摺疊

### 棄用一些僅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: stdlib 中的許多僅限 JS 的函數已被棄用以供移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及在陣列上採用比較函數的 `sort` 函數，例如，`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0：棄用受影響的函數並發出警告
> - 1.7.0：將棄用等級提高到錯誤
> - 1.8.0：從 public API 中移除已棄用的函數

### 從 Kotlin/JS 中類別的 public API 中隱藏實作和 interop 特定的函數

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼 (source), 二進位 (binary)
>
> **Short summary**: 函數 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 將它們的可見性變更為 internal
>
> **Deprecation cycle**:
>
> - 1.6.0：使函數成為 internal，從而將它們從 public API 中移除

## 工具

### 棄用 KotlinGradleSubplugin 類別

> **Issue**: [KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 類別 `KotlinGradleSubplugin` 將被棄用，取而代之的是 `KotlinCompilerPluginSupportPlugin`
>
> **Deprecation cycle**:
>
> - 1.6.0：將棄用等級提高到錯誤
> - &gt;= 1.7.0：移除已棄用的類別

### 移除 kotlin.useFallbackCompilerSearch 建置選項

> **Issue**: [KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 移除已棄用的 'kotlin.useFallbackCompilerSearch' 建置選項
>
> **Deprecation cycle**:
>
> - 1.5.0：將棄用等級提高到警告
> - 1.6.0：移除已棄用的選項

### 移除多個編譯器選項

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 移除已棄用的 `noReflect` 和 `includeRuntime` 編譯器選項
>
> **Deprecation cycle**:
>
> - 1.5.0：將棄用等級提高到錯誤
> - 1.6.0：移除已棄用的選項

### 棄用 useIR 編譯器選項

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 隱藏已棄用的 `useIR` 編譯器選項
>
> **Deprecation cycle**:
>
> - 1.5.0：將棄用等級提高到警告
> - 1.6.0：隱藏該選項
> - &gt;= 1.7.0：移除已棄用的選項

### 棄用 kapt.use.worker.api Gradle 屬性

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 kapt（預設值：true）
>
> **Deprecation cycle**:
>
> - 1.6.20：將棄用等級提高到警告
> - &gt;= 1.8.0：移除此屬性

### 移除 kotlin.parallel.tasks.in.project Gradle 屬性

> **Issue**: [KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 移除 `kotlin.parallel.tasks.in.project` 屬性
>
> **Deprecation cycle**:
>
> - 1.5.20：將棄用等級提高到警告
> - 1.6.20：移除此屬性

### 棄用 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **Issue**: [KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 棄用 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性
>
> **Deprecation cycle**:
>
> - 1.6.20：將棄用等級提高到警告
> - &gt;= 1.7.0：移除 DSL 選項和屬性