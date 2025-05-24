---
title: "Kotlin 1.4 的相容性指南"
---
_[保持語言現代化](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計中的基本原則。 前者表示，應移除阻礙語言發展的結構，而後者表示，應事先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（如更新日誌或編譯器警告）發布，但本文檔總結了所有這些變更，為從 Kotlin 1.3 遷移到 Kotlin 1.4 提供了完整的參考。

## 基本術語

在本文檔中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會阻止過去編譯良好的程式碼（沒有錯誤或警告）再也無法編譯
- _二進位檔 (binary)_：如果交換兩個二進位檔不會導致載入或連結錯誤，則稱它們是二進位檔相容的
- _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容的

請記住，這些定義僅適用於純 Kotlin。 從其他語言的角度來看（例如，從 Java），Kotlin 程式碼的相容性不在本文檔的範圍之內。

## 語言和標準函式庫 (stdlib)

### 使用 `in` 中綴運算符和 ConcurrentHashMap 時出現意外行為

> **問題 (Issue)**：[KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：Kotlin 1.4 將禁止來自 Java 中編寫的 `java.util.Map` 實現者的自動運算符 `contains`
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：在呼叫點 (call-site) 引入有問題的運算符的警告
> - &gt;= 1.4：將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitConcurrentHashMapContains` 可用於暫時恢復到 1.4 之前的行為

### 禁止從公開的 (public) 內聯成員 (inline members) 內部存取受保護的 (protected) 成員

> **問題 (Issue)**：[KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：Kotlin 1.4 將禁止從公開的 (public) 內聯成員 (inline members) 存取受保護的 (protected) 成員。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：在呼叫點 (call-site) 引入有問題情況的警告
> - 1.4：將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitProtectedCallFromInline` 可用於暫時恢復到 1.4 之前的行為

### 具有隱式接收器 (implicit receivers) 的呼叫上的合約 (Contracts)

> **問題 (Issue)**：[KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：來自合約 (contracts) 的智能轉換 (smart casts) 將在 1.4 中對具有隱式接收器 (implicit receivers) 的呼叫可用
> 
> **棄用週期 (Deprecation cycle)**： 
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 可用於暫時恢復到 1.4 之前的行為

### 浮點數比較的不一致行為

> **問題 (Issues)**：[KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：從 Kotlin 1.4 開始，Kotlin 編譯器將使用 IEEE 754 標準來比較浮點數
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-ProperIeee754Comparisons` 可用於暫時恢復到 1.4 之前的行為

### 對於泛型 (generic) Lambda 中的最後一個表達式沒有智能轉換 (smart cast)

> **問題 (Issue)**：[KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 1.4 起，將正確應用 Lambda 中最後一個表達式的智能轉換 (smart casts)
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 不要依賴 Lambda 參數的順序來強制將結果轉換為 Unit

> **問題 (Issue)**：[KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，Lambda 參數將獨立解析，而不會隱式強制轉換為 `Unit`
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 原始類型 (raw type) 和整數文字類型 (integer literal type) 之間的錯誤通用超類型 (common supertype) 導致不健全的程式碼

> **問題 (Issue)**：[KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **組件 (Components)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，原始 `Comparable` 類型和整數文字類型之間的通用超類型將更具體
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 由於使用不同的類型實例化了幾個相等的類型變數，因此出現了類型安全問題

> **問題 (Issue)**：[KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，Kotlin 編譯器將禁止使用不同的類型實例化相等的類型變數
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 由於交集類型 (intersection types) 的不正確子類型 (subtyping) 導致的類型安全問題

> **問題 (Issues)**：[KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：在 Kotlin 1.4 中，將改進交集類型 (intersection types) 的子類型 (subtyping)，使其更正確地工作
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### Lambda 內的空 `when` 表達式沒有類型不匹配

> **問題 (Issue)**：[KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，如果空 `when` 表達式用作 Lambda 中的最後一個表達式，則會出現類型不匹配
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 為具有早期返回 (early return) 的 Lambda 推斷返回類型 Any，其中一個可能的返回值是整數文字 (integer literal)

> **問題 (Issue)**：[KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，從 Lambda 返回的整數類型對於存在早期返回 (early return) 的情況將更具體
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 正確捕獲具有遞迴類型 (recursive types) 的星號投影 (star projections)

> **問題 (Issue)**：[KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，由於遞迴類型 (recursive types) 的捕獲將更正確地工作，因此更多候選者將變得適用
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 具有非正確類型 (non-proper type) 和彈性類型 (flexible one) 的通用超類型 (common supertype) 計算會導致不正確的結果

> **問題 (Issue)**：[KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，彈性類型 (flexible types) 之間的通用超類型將更具體，從而防止運行時錯誤
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 由於缺少針對可空類型參數 (nullable type argument) 的捕獲轉換 (captured conversion) 導致的類型安全問題

> **問題 (Issue)**：[KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，捕獲類型 (captured types) 和可空類型 (nullable types) 之間的子類型 (subtyping) 將更正確，從而防止運行時錯誤
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 在未檢查的 (unchecked) 轉換之後，為協變類型 (covariant types) 保留交集類型 (intersection type)
 
> **問題 (Issue)**：[KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，協變類型 (covariant types) 的未檢查轉換 (uchecked casts) 會為智能轉換 (smart casts) 產生交集類型 (intersection type)，
>  而不是未檢查轉換的類型 (the type of the unchecked cast)。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 由於使用此表達式 (this expression)，類型變數從構建器推斷 (builder inference) 中洩漏
 
> **問題 (Issue)**：[KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，如果沒有其他正確的約束，則禁止在 `sequence {}` 等構建器函數 (builder functions) 內部使用 `this`
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 具有可空類型參數 (nullable type arguments) 的逆變類型 (contravariant types) 的錯誤重載解析 (Wrong overload resolution)
 
> **問題 (Issue)**：[KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，如果接受逆變類型參數 (contravariant type arguments) 的函數的兩個重載 (overloads) 僅通過類型的可空性 (nullability) 不同（例如 `In<T>` 和 `In<T?>`），則可空類型被認為更具體。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 具有非嵌套遞迴約束 (non-nested recursive constraints) 的構建器推斷 (Builder inference)
 
> **問題 (Issue)**：[KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，構建器函數 (builder functions)（例如 `sequence {}`），其類型依賴於傳遞的 Lambda 內部的遞迴約束 (recursive constraint) 會導致編譯器錯誤。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 急切的類型變數修復 (Eager type variable fixation) 導致矛盾的約束系統 (contradictory constraint system)
 
> **問題 (Issue)**：[KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，某些情況下的類型推斷 (type inference) 工作不太積極，允許找到不矛盾的約束系統。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
> `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。 請注意，此標誌也將
> 停用幾個新的語言功能。

### 禁止在 open 函數上使用 tailrec 修飾符

> **問題 (Issue)**：[KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **組件 (Component)**：核心語言 (Core language)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，函數不能同時具有 `open` 和 `tailrec` 修飾符。
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：報告同時具有 `open` 和 `tailrec` 修飾符的函數的警告（在漸進模式下為錯誤）。
> - &gt;= 1.4：將此警告提升為錯誤。

### 伴生對象 (companion object) 的 INSTANCE 字段比伴生對象類別本身更可見

> **問題 (Issue)**：[KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，如果伴生對象 (companion object) 是私有的，則其字段 `INSTANCE` 也將是私有的
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：編譯器生成帶有已棄用標誌的對象 `INSTANCE`
> - &gt;= 1.4：伴生對象 (companion object) `INSTANCE` 字段具有適當的可見性

### 插入在返回之前的外部 finally 塊不會從沒有 finally 的內部 try 塊的 catch 間隔中排除

> **問題 (Issue)**：[KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，將為嵌套的 `try/catch` 塊正確計算 catch 間隔
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-ProperFinally` 可用於暫時恢復到 1.4 之前的行為

### 在協變和泛型特殊化的覆蓋中使用內聯類別 (inline class) 的 boxed 版本作為返回類型位置

> **問題 (Issues)**：[KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，使用協變和泛型特殊化的覆蓋的函數將返回內聯類別 (inline classes) 的 boxed 值
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更

### 使用委託給 Kotlin 介面時，不要在 JVM 位元組碼中聲明已檢查的異常 (checked exceptions)

> **問題 (Issue)**：[KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：Kotlin 1.4 在介面委託給 Kotlin 介面期間將不會生成已檢查的異常 (checked exceptions)
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 可用於暫時恢復到 1.4 之前的行為

### 變更對具有單個 vararg 參數的方法的簽名多態 (signature-polymorphic) 呼叫的行為，以避免將參數包裝到另一個陣列中

> **問題 (Issue)**：[KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：Kotlin 1.4 將不會在簽名多態 (signature-polymorphic) 呼叫上將參數包裝到另一個陣列中
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更

### 當 KClass 用作泛型參數時，註釋 (annotations) 中的泛型簽名 (generic signature) 不正確

> **問題 (Issue)**：[KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：當 KClass 用作泛型參數時，Kotlin 1.4 將修復註釋 (annotations) 中不正確的類型映射
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更

### 禁止在簽名多態 (signature-polymorphic) 呼叫中使用 spread 運算符

> **問題 (Issue)**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：Kotlin 1.4 將禁止在簽名多態 (signature-polymorphic) 呼叫上使用 spread 運算符 (*)
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：報告在簽名多態 (signature-polymorphic) 呼叫中使用 spread 運算符的警告
> - &gt;= 1.5：將此警告提升為錯誤，
> `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用於暫時恢復到 1.4 之前的行為

### 變更尾遞迴 (tail-recursive) 優化函數的默認值的初始化順序

> **問題 (Issue)**：[KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，尾遞迴函數 (tail-recursive functions) 的初始化順序將與常規函數相同
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：在有問題的函數的聲明點 (declaration-site) 報告警告
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 可用於暫時恢復到 1.4 之前的行為

### 不要為非 const val 生成 ConstantValue 屬性

> **問題 (Issue)**：[KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，編譯器將不會為非 `const` `val` 生成 `ConstantValue` 屬性
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：通過 IntelliJ IDEA 檢查報告警告
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 可用於暫時恢復到 1.4 之前的行為

### 在 open 方法上為 @JvmOverloads 生成的重載應為 final

> **問題 (Issue)**：[KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **組件 (Components)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：具有 `@JvmOverloads` 的函數的重載將生成為 `final`
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更，
>  `-XXLanguage:-GenerateJvmOverloadsAsFinal` 可用於暫時恢復到 1.4 之前的行為

### 返回 kotlin.Result 的 Lambda 現在返回 boxed 值而不是 unboxed 值

> **問題 (Issue)**：[KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：自 Kotlin 1.4 起，返回 `kotlin.Result` 類型值的 Lambda 將返回 boxed 值而不是 unboxed 值
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更

### 統一來自空值檢查 (null checks) 的異常

> **問題 (Issue)**：[KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **組件 (Component)**：Kotlin/JVM
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavior)
> 
> **簡短摘要 (Short summary)**：從 Kotlin 1.4 開始，所有運行時空值檢查 (runtime null checks) 都將拋出 `java.lang.NullPointerException`
> 
> **棄用週期 (Deprecation cycle)**：
> 
> - < 1.4：運行時空值檢查 (runtime null checks) 拋出不同的異常，例如 `KotlinNullPointerException`、`IllegalStateException`、
> `IllegalArgumentException` 和 `TypeCastException`
> - &gt;= 1.4：所有運行時空值檢查 (runtime null checks) 都拋出 `java.lang.NullPointerException`。
>   `-Xno-unified-null-checks` 可用於暫時恢復到 1.4 之前的行為

### 在陣列/列表操作 contains、indexOf、lastIndexOf 中比較浮點值：IEEE 754 或總順序 (total order)

> **問題 (Issue)**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **組件 (Component)**：kotlin-stdlib (JVM)
> 
> **不相容變更類型 (Incompatible change type)**：行為 (behavioral)
> 
> **簡短摘要 (Short summary)**：從 `Double/FloatArray.asList()` 返回的 `List` 實現將實現 `contains`、`indexOf` 和 `lastIndexOf`，以便它們使用總順序 (total order) 相等性
> 
> **棄用週期 (Deprecation cycle)**： 
> 
> - < 1.4：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.4：行為已變更

### 逐步將集合 min 和 max 函數的返回類型變更為非可空

> **問題 (Issue)**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **組件 (Component)**：kotlin-stdlib (JVM)
> 
> **不相容變更類型 (Incompatible change type)**：原始碼 (source)
> 
> **簡短摘要 (Short summary)**：集合 `min` 和 `max` 函數的返回類型將在 1.6