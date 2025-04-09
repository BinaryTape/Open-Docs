---
title: "Kotlin 1.8 相容性指南"
---
_[保持語言現代性](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則。前者表示應移除阻礙語言演進的結構，後者表示應事先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）發布，但本文檔總結了所有這些變更，為從 Kotlin 1.7 遷移到 Kotlin 1.8 提供了完整的參考。

## 基本術語

在本文檔中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再也無法編譯
- _二進位 (binary)_：如果交換兩個二進位工件不會導致載入或連結錯誤，則稱它們是二進位相容的
- _行為 (behavioral)_：如果同一程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容的

請記住，這些定義僅適用於純 Kotlin。 Kotlin 程式碼從其他語言的角度來看的相容性
（例如，從 Java）不在本文檔的範圍內。

## 語言

<!--
### 標題

> **議題 (Issue)**：[KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：報告警告 (report a warning)
> - 1.8.0：將警告提升為錯誤 (raise the warning to an error)
-->

### 禁止將 super 呼叫委託給抽象超類別成員

> **議題 (Issues)**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：當顯式或隱式 super 呼叫被委託給超類別的 _抽象_ 成員時，Kotlin 將報告編譯錯誤，即使超介面中存在預設實作
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.5.20：引入一個警告，當使用未覆寫所有抽象成員的非抽象類別時
> - 1.7.0：如果 super 呼叫實際上存取了超類別的抽象成員，則報告警告
> - 1.7.0：如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容性模式，則在所有受影響的情況下報告錯誤；
>   在漸進模式下報告錯誤
> - 1.8.0：在宣告具有來自超類別的未覆寫抽象方法的具體類別的情況下報告錯誤，並且
>   `Any` 方法的 super 呼叫在超類別中被覆寫為抽象
> - 1.9.0：在所有受影響的情況下報告錯誤，包括對來自超類別的抽象方法的顯式 super 呼叫

### 棄用 when-with-subject 中令人困惑的文法

> **議題 (Issue)**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.6 棄用了 `when` 條件表達式中的幾個令人困惑的文法結構
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：在受影響的表達式上引入棄用警告
> - 1.8.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 可用於暫時恢復到 1.8 之前的行為
> - &gt;= 1.9：將一些已棄用的結構重新用於新的語言功能

### 阻止不同數字類型之間的隱式強制轉換

> **議題 (Issue)**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
>
> **簡短摘要 (Short summary)**：Kotlin 將避免自動將數字值轉換為基本數字類型，如果只需要在語義上下轉換為該類型
>
> **棄用週期 (Deprecation cycle)**：
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修復產生的屬性委託存取器中的下轉換行為，
>   `-Xuse-old-backend` 可用於暫時恢復到 1.5.30 之前的修復行為
> - &gt;= 1.9：修復其他受影響情況下的下轉換行為

### 使 sealed 類別的 private 建構子真正成為 private

> **議題 (Issue)**：[KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：在放寬對 sealed 類別的繼承者可以在專案結構中宣告的位置的限制後，
> sealed 類別建構子的預設可見性變為 protected。但是，在 1.8 之前，Kotlin 仍然允許呼叫
> 在這些類別範圍之外顯式宣告的 sealed 類別的 private 建構子
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：當在該類別之外呼叫 sealed 類別的 private 建構子時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0：對 private 建構子使用預設可見性規則（只有當呼叫位於相應類別內部時，才能解析對 private 建構子的呼叫），
>   可以透過指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 編譯器參數來暫時恢復舊行為

### 禁止在 builder 推斷上下文中對不相容的數字類型使用運算子 ==

> **議題 (Issue)**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.8 將禁止對不相容的數字類型使用運算子 `==`，例如 `Int` 和 `Long`，
> 在 builder 推斷 lambda 函數的範圍內，與目前在其他上下文中一樣
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：當對不相容的數字類型使用運算子 `==` 時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0：將警告提升為錯誤，
>   `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 可用於暫時恢復到 1.8 之前的行為

### 禁止在 Elvis 運算子的右側使用沒有 else 的 if 和非詳盡的 when

> **議題 (Issue)**：[KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.8 將禁止在 Elvis 運算子 (`?:`) 的右側使用非詳盡的 `when` 或沒有 `else` 分支的 `if` 表達式。先前，如果 Elvis 運算子的結果未用作表達式，則允許這樣做
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：在此類非詳盡的 if 和 when 表達式上報告警告（或在漸進模式下報告錯誤）
> - 1.8.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 可用於暫時恢復到 1.8 之前的行為

### 禁止在泛型型別別名用法中違反上限（一個型別參數用於別名型別的多個型別引數中）

> **議題 (Issues)**：[KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.8 將禁止使用具有型別引數的型別別名，這些型別引數違反了
> 別名型別的相應型別參數的上限限制，如果一個型別別名型別參數用於
> 別名型別的多個型別引數中，例如 `typealias Alias<T> = Base<T, T>`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：在使用具有違反的型別引數的型別別名時，報告警告（或在漸進模式下報告錯誤）
>   別名型別的相應型別參數的上限約束
> - 1.8.0：將此警告提升為錯誤，
>  `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 可用於暫時恢復到 1.8 之前的行為

### 禁止在泛型型別別名用法中違反上限（在別名型別的型別引數的泛型型別引數中使用型別參數）

> **議題 (Issue)**：[KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 將禁止使用具有型別引數的型別別名，這些型別引數違反了
> 別名型別的相應型別參數的上限限制，如果型別別名型別參數用作
> 別名型別的型別引數的泛型型別引數，例如 `typealias Alias<T> = Base<List<T>>`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.8.0：當泛型型別別名用法具有違反上限約束的型別引數時，報告警告
>   別名型別的相應型別參數
> - &gt;=1.10：將警告提升為錯誤

### 禁止在委託中使用為擴充屬性宣告的型別參數

> **議題 (Issue)**：[KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.8 將禁止將泛型型別上的擴充屬性委託
> 以不安全的方式使用接收者的型別參數的泛型型別
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：當將擴充屬性委託給以特定方式使用從委託屬性的型別引數推斷的型別參數的型別時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0：將警告提升為錯誤，
>  `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 可用於暫時恢復到 1.8 之前的行為

### 禁止在 suspend 函數上使用 @Synchronized 註解

> **議題 (Issue)**：[KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.8 將禁止在 suspend 函數上放置 `@Synchronized` 註解
> 因為不應允許在同步區塊內發生掛起呼叫
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：在用 `@Synchronized` 註解註解的 suspend 函數上報告警告，
>   在漸進模式下，該警告報告為錯誤
> - 1.8.0：將警告提升為錯誤，
>   `-XXLanguage:-SynchronizedSuspendError` 可用於暫時恢復到 1.8 之前的行為

### 禁止使用展開運算子將引數傳遞給非 vararg 參數

> **議題 (Issue)**：[KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 允許在某些條件下使用展開運算子 (`*`) 將陣列傳遞給非 vararg 陣列參數。
> 從 Kotlin 1.8 開始，這將被禁止
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：在使用展開運算子但預期使用非 vararg 陣列參數時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0：將警告提升為錯誤，
>   `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 可用於暫時恢復到 1.8 之前的行為

### 禁止在透過 lambda 傳回型別多載的函數中傳遞的 lambda 中違反 null 安全性

> **議題 (Issue)**：[KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：當多載不允許可為 null 傳回型別時，Kotlin 1.8 將禁止從傳遞給那些 lambda 的傳回型別多載的函數的 lambda 傳回 `null`。
> 先前，當從 `when` 運算子的其中一個分支傳回 `null` 時，允許這樣做
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：報告型別不符警告（或在漸進模式下報告錯誤）
> - 1.8.0：將警告提升為錯誤，
>   `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 可用於暫時恢復到 1.8 之前的行為

### 在公用簽名中近似本機型別時保留可空性

> **議題 (Issue)**：[KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source), 二進位 (binary)
>
> **簡短摘要 (Short summary)**：當從沒有明確指定傳回型別的表達式主體函數傳回本機或匿名型別時，
> Kotlin 編譯器使用該型別的已知超型別推斷（或近似）傳回型別。
> 在此期間，編譯器可以推斷一個不可為 null 的型別，而實際上可以傳回 null 值
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.8.0：透過彈性超型別近似彈性型別
> - 1.8.0：當宣告被推斷為具有不應為 null 的不可為 null 型別時，報告警告，提示使用者明確指定型別
> - 1.9.0：透過可為 null 的超型別近似可為 null 的型別，
>   `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 可用於暫時恢復到 1.9 之前的行為

### 不要透過覆寫傳播棄用

> **議題 (Issue)**：[KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將不再將棄用從超類別中的已棄用成員傳播到子類別中的覆寫成員，
> 這樣就提供了一種顯式機制來棄用超類別的成員，同時使其在子類別中保持非棄用狀態
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：報告一則警告，其中包含未來行為變更的訊息，並提示要麼抑制此警告，要麼在已棄用成員的覆寫上明確寫入 `@Deprecated` 註解
> - 1.9.0：停止將棄用狀態傳播到已覆寫的成員。此變更也會立即在漸進模式下生效

### 禁止在 builder 推斷上下文中將型別變數隱式推斷為上限

> **議題 (Issue)**：[KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：在 builder 推斷 lambda 函數的範圍內，如果沒有任何使用位置型別資訊，Kotlin 1.9 將禁止將型別變數推斷為相應型別參數的上限，與目前在其他上下文中一樣
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.20：當在沒有使用位置型別資訊的情況下將型別參數推斷為宣告的上限時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 可用於暫時恢復到 1.9 之前的行為

### 禁止在註解類別中使用集合文字，除非在其參數宣告中

> **議題 (Issue)**：[KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 允許以受限制的方式使用集合文字 - 用於將陣列傳遞給註解類別的參數
> 或為這些參數指定預設值。
> 然而除此之外，Kotlin 允許在註解類別中的其他任何地方使用集合文字，例如，
> 在其巢狀物件中。Kotlin 1.9 將禁止在註解類別中使用集合文字，除非在其參數的預設值中。
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：在註解類別的巢狀物件中的陣列文字上報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止在預設值表達式中轉發引用具有預設值的參數

> **議題 (Issue)**：[KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將禁止在其他參數的預設值表達式中轉發引用具有預設值的參數。
> 這樣可以確保在預設值表達式中存取參數時，
> 它已經有一個傳遞給函數的值或由其自身的預設值表達式初始化
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：當在先於它的另一個參數的預設值中引用具有預設值的參數時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 可用於暫時恢復到 1.9 之前的行為

### 禁止在內聯函數參數上進行擴充呼叫

> **議題 (Issue)**：[KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：雖然 Kotlin 允許將內聯函數參數作為接收者傳遞給另一個內聯函數，
> 但在編譯此類程式碼時總是會導致編譯器例外。
> Kotlin 1.9 將禁止此操作，因此會報告錯誤而不是使編譯器崩潰
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.20：針對內聯函數參數上的內聯擴充呼叫報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止使用匿名函數引數呼叫名為 suspend 的中綴函數

> **議題 (Issue)**：[KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將不再允許呼叫名為 `suspend` 的中綴函數，這些函數具有作為匿名函數文字傳遞的函數型別的單個引數
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.20：針對具有匿名函數文字的 suspend 中綴呼叫報告警告
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 可用於暫時恢復到 1.9 之前的行為
> - &gt;=1.10：變更剖析器解釋 `suspend fun` 符記序列的方式

### 禁止根據其變異數在內部類別中使用捕獲的型別參數

> **議題 (Issue)**：[KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將禁止在
> 該類別的內部類別中，以外部類別的型別參數違反該型別參數宣告的變異數的位置使用具有 `in` 或 `out` 變異數的型別參數
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：當外部類別的型別參數使用位置違反該參數的變異數規則時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 可用於暫時恢復到 1.9 之前的行為

### 禁止在複合賦值運算子中遞迴呼叫沒有明確傳回型別的函數

> **議題 (Issue)**：[KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將禁止在複合賦值運算子的引數中呼叫沒有明確指定傳回型別的函數
> 在該函數的主體內，與目前在該函數主體內的其他表達式中一樣
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：當沒有明確指定傳回型別的函數在該函數主體中，以複合賦值運算子引數遞迴呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止使用預期的 @NotNull T 和給定的具有可空邊界的 Kotlin 泛型參數的不健全呼叫

> **議題 (Issue)**：[KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將禁止將潛在可為 null 的泛型型別的值傳遞給
> Java 方法的 `@NotNull` 註解的參數的方法呼叫
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.5.20：當傳遞沒有限制的泛型型別參數但預期使用不可為 null 的型別時，報告警告
> - 1.9.0：報告型別不符錯誤而不是上述警告，
>   `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 可用於暫時恢復到 1.8 之前的行為

### 禁止從此列舉的項目初始化程式存取列舉類別的伴生物件的成員

> **議題 (Issue)**：[KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.9 將禁止從列舉項目初始化程式存取列舉的伴生物件的各種存取
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：在此類伴生成員存取上報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 可用於暫時恢復到 1.8 之前的行為

### 棄用並移除 Enum.declaringClass 合成屬性

> **議題 (Issue)**：[KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 允許在從基礎 Java 類別 `java.lang.Enum` 的方法 `getDeclaringClass()` 產生的 `Enum` 值上使用合成屬性 `declaringClass`，即使此方法不適用於 Kotlin `Enum` 型別。Kotlin 1.9 將禁止使用此屬性，建議遷移到擴充屬性 `declaringJavaClass`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.7.0：針對 `declaringClass` 屬性使用情況報告警告（或在漸進模式下報告錯誤），
>   建議遷移到 `declaringJavaClass` 擴充
> - 1.9.0：將警告提升為錯誤，
>   `-XXLanguage:-ProhibitEnumDeclaringClass` 可用於暫時恢復到 1.9 之前的行為
> - &gt;=1.10：移除 `declaringClass` 合成屬性

### 棄用編譯器選項 -Xjvm-default 的 enable 和相容性模式

> **議題 (Issue)**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：Kotlin 1.6.20 警告使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：在 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式上引入警告
> - &gt;= 1.9：將此警告提升為錯誤

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，警告潛在的多載解析變更

> **議題 (Issue)**：[KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **元件 (Component)**：核心語言 (Core language) / kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：計劃在 Kotlin 1.9 中在標準進度及其繼承的具體範圍中實作 `Collection` 介面。
> 如果某些方法有兩個多載，一個接受元素，另一個接受集合，這可能會使在多載解析中選擇不同的多載。
> Kotlin 將透過在以範圍或進度引數呼叫此類多載方法時報告警告或錯誤來使這種情況可見
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.20：當以標準進度或其範圍繼承者作為引數呼叫多載方法時報告警告
>   如果由此進度/範圍實作 `Collection` 介面會導致未來在此呼叫中選擇另一個多載
> - 1.8.0：將此警告提升為錯誤
> - 1.9.0：停止報告錯誤，在進度中實作 `Collection` 介面，從而變更
>   受影響情況下的多載解析結果

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **議題 (Issue)**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **元件 (Component)**：kotlin-stdlib (JS)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至相應的 `kotlinx.*` 套件，以準備將它們從 stdlib 中提取出來
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替換 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議使用上述新 API 作為替代
> - 1.6.0：將棄用等級提升為錯誤
> - 1.8.20：從 stdlib 中移除 JS-IR 目標的已棄用函數
> - &gt;= 1.9：將 kotlinx.* 套件中的 API 移至單獨的函式庫

### 棄用一些僅限 JS 的 API

> **議題 (Issue)**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **元件 (Component)**：kotlin-stdlib (JS)
>
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
>
> **簡短摘要 (Short summary)**：stdlib 中的許多僅限 JS 的函數已棄用以供移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)` 和在陣列上採用比較函數的 `sort` 函數，例如，`Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.6.0：棄用受影響的函數並發出警告
> - 1.9.0：將棄用等級提升為錯誤
> - &gt;=1.10.0：從公用 API 中移除已棄用的函數

## 工具

### 提高 KotlinCompile 任務的 classpath 屬性的棄用等級

> **議題 (Issue)**：[KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **元件 (Component)**：Gradle
>
> **不相容變更