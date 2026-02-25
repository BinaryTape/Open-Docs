[//]: # (title: Kotlin 1.4.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_與 _[舒適的更新](kotlin-evolution-principles.md)_是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則指出這種移除應事先進行良好的溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道宣布（如更新日誌或編譯器警告），本文件將對其進行總結，為從 Kotlin 1.3 遷移到 Kotlin 1.4 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本可以正常編譯（無錯誤或警告）的程式碼無法再編譯。
- _二進制 (binary)_：如果交換兩個二進制構件不會導致載入或連結錯誤，則稱它們為二進制相容。
- _行為 (behavioral)_：如果同一程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin。從其他語言（例如 Java）的角度來看 Kotlin 程式碼的相容性不在本文件的範圍內。

## 語言與 stdlib 

### infix 運算子與 ConcurrentHashMap 的意外行為

> **問題**：[KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：Kotlin 1.4 將禁止來自以 Java 編寫的 `java.util.Map` 實作者的自動 `contains` 運算子。
> 
> **棄用週期**：
> 
> - < 1.4：在呼叫點對有問題的運算子引入警告。
> - &gt;= 1.4：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitConcurrentHashMapContains` 暫時恢復到 1.4 之前的行為。

### 禁止在 public inline 成員內部存取 protected 成員

> **問題**：[KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：Kotlin 1.4 將禁止從 public inline 成員存取 protected 成員。
> 
> **棄用週期**：
> 
> - < 1.4：在呼叫點針對有問題的情況引入警告。
> - 1.4：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitProtectedCallFromInline` 暫時恢復到 1.4 之前的行為。

### 隱含接收者呼叫上的契約

> **問題**：[KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：來自契約 (contracts) 的智慧轉型將在 1.4 中的隱含接收者呼叫上可用。
> 
> **棄用週期**： 
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 暫時恢復到 1.4 之前的行為。

### 浮點數比較行為不一致

> **問題**：[KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，Kotlin 編譯器將使用 IEEE 754 標準來比較浮點數。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-ProperIeee754Comparisons` 暫時恢復到 1.4 之前的行為。

### 泛型 Lambda 中的最後一個運算式沒有智慧轉型

> **問題**：[KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 1.4 起，Lambda 中最後一個運算式的智慧轉型將被正確套用。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 不再依賴 Lambda 引數的順序來將結果強制轉換為 Unit

> **問題**：[KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，Lambda 引數將被獨立解析，而不會隱含強制轉換為 `Unit`。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### Raw 型別與整數常值型別之間錯誤的共同父型別導致不健全的程式碼

> **問題**：[KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，raw `Comparable` 型別與整數常值型別之間的共同父型別將更加明確。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 由於多個相等的型別變數被具現化為不同型別而導致的型別安全問題

> **問題**：[KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，Kotlin 編譯器將禁止將相等的型別變數具現化為不同的型別。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 由於交集型別的子型別化不正確而導致的型別安全問題

> **問題**：[KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：在 Kotlin 1.4 中，交集型別 (intersection types) 的子型別化將被最佳化以更正確地運作。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### Lambda 內部的空 when 表達式沒有型別不相符錯誤

> **問題**：[KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，如果空的 `when` 表達式被用作 Lambda 中的最後一個運算式，將會出現型別不相符錯誤。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 對於具有提前返回且其中一個可能傳回值為整數常值的 Lambda，推論出的傳回型別為 Any

> **問題**：[KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，在存在提前返回 (early return) 的情況下，Lambda 傳回的整數型別將更加明確。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 正確擷取具有遞迴型別的星號投影

> **問題**：[KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，由於遞迴型別的擷取將更正確地運作，更多候選者將變得適用。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 使用不當型別與彈性型別進行共同父型別計算導致錯誤結果

> **問題**：[KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，彈性型別之間的共同父型別將更加明確，以防止執行時期錯誤。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 由於缺乏針對可 null 型別引數的擷取轉換而導致的型別安全問題

> **問題**：[KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，擷取型別與可 null 型別之間的子型別化將更加正確，以防止執行時期錯誤。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 在未經檢查的轉換後保留共變型別的交集型別
 
> **問題**：[KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，共變型別的未經檢查的轉換 (unchecked casts) 會為智慧轉型產生交集型別，而不是未經檢查轉換的型別。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 由於使用 this 表達式導致型別變數從建置器推論中洩漏
 
> **問題**：[KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，如果沒有其他適當的約束，則禁止在 `sequence {}` 等建置器函式內部使用 `this`。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 具有可 null 型別引數的逆變型別的錯誤多載解析
 
> **問題**：[KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，如果接受逆變 (contravariant) 型別引數的兩個函式多載僅在型別的可 null 性（例如 `In<T>` 與 `In<T?>`）上有所不同，則可 null 型別被認為更加明確。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 具有非巢狀遞迴約束的建置器推論
 
> **問題**：[KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，如果傳遞的 Lambda 內部具有依賴於遞迴約束的型別，則 `sequence {}` 等建置器函式會導致編譯器錯誤。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 急切的型別變數固定導致矛盾的約束系統
 
> **問題**：[KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，某些情況下的型別推論不再那麼急切，從而允許找到非矛盾的約束系統。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
> 可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用多項新的語言特性。

### 禁止在 open 函式上使用 tailrec 修飾符

> **問題**：[KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
> 
> **組建**：核心語言
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，函式不能同時具有 `open` 與 `tailrec` 修飾符。
> 
> **棄用週期**：
> 
> - < 1.4：對同時具有 `open` 與 `tailrec` 修飾符的函式發佈警告（在漸進模式下為錯誤）。
> - &gt;= 1.4：將此警告提升為錯誤。

### 伴生物件的 INSTANCE 欄位比伴生物件類別本身更具可見性

> **問題**：[KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，如果伴生物件 (companion object) 是 private，則其 `INSTANCE` 欄位也將是 private。
> 
> **棄用週期**：
> 
> - < 1.4：編譯器產生帶有棄用標記的物件 `INSTANCE`。
> - &gt;= 1.4：伴生物件的 `INSTANCE` 欄位具有正確的可見性。

### 在 return 之前插入的外層 finally 區塊未從沒有 finally 的內層 try 區塊的 catch 區間中排除

> **問題**：[KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，巢狀 `try/catch` 區塊的 catch 區間將被正確計算。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-ProperFinally` 暫時恢復到 1.4 之前的行為。

### 在共變與泛型特化覆寫的傳回型別位置使用裝箱版本的內嵌類別

> **問題**：[KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，使用共變 (covariant) 與泛型特化覆寫的函式將傳回內嵌類別 (inline classes) 的裝箱 (boxed) 值。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更 

### 使用 Kotlin 介面委派時，不要在 JVM 位元組碼中宣告受檢例外

> **問題**：[KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：Kotlin 1.4 在將介面委派給 Kotlin 介面時，將不會產生受檢例外 (checked exceptions)。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 暫時恢復到 1.4 之前的行為。

### 變更了對具有單個 vararg 參數的方法進行簽章多型呼叫的行為，以避免將引數封裝到另一個陣列中

> **問題**：[KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：Kotlin 1.4 在簽章多型呼叫中，將不會將引數封裝到另一個陣列中。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### 當 KClass 用作泛型參數時，註解中的泛型簽章不正確

> **問題**：[KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：當 KClass 用作泛型參數時，Kotlin 1.4 將修正註解中不正確的型別對應。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### 禁止在簽章多型呼叫中使用展開運算子

> **問題**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：Kotlin 1.4 將禁止在簽章多型呼叫中使用展開運算子 (*)。
> 
> **棄用週期**：
> 
> - < 1.4：針對在簽章多型呼叫中使用展開運算子發佈警告。
> - &gt;= 1.5：將此警告提升為錯誤，
> 可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暫時恢復到 1.4 之前的行為。

### 變更尾遞迴最佳化函式的預設值初始化順序

> **問題**：[KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，尾遞迴函式的初始化順序將與一般函式相同。
> 
> **棄用週期**：
> 
> - < 1.4：在宣告點針對有問題的函式發佈警告。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 暫時恢復到 1.4 之前的行為。

### 不要為非 const val 產生 ConstantValue 屬性

> **問題**：[KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，編譯器將不會為非 `const` `val` 產生 `ConstantValue` 屬性。
> 
> **棄用週期**：
> 
> - < 1.4：透過 IntelliJ IDEA 檢查發佈警告。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 暫時恢復到 1.4 之前的行為。

### 為 open 方法上的 @JvmOverloads 產生的多載應為 final

> **問題**：[KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：帶有 `@JvmOverloads` 的函式的多載將產生為 `final`。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更，
>  可以使用 `-XXLanguage:-GenerateJvmOverloadsAsFinal` 暫時恢復到 1.4 之前的行為。

### 傳回 kotlin.Result 的 Lambda 現在傳回裝箱值而非拆箱值

> **問題**：[KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，傳回 `kotlin.Result` 型別值的 Lambda 將傳回裝箱 (boxed) 值，而不是拆箱 (unboxed) 值。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### 統一來自 null 檢查的例外

> **問題**：[KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
> 
> **組建**：Kotlin/JVM
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：從 Kotlin 1.4 開始，所有執行時期 null 檢查都將拋出 `java.lang.NullPointerException`。
> 
> **棄用週期**：
> 
> - < 1.4：執行時期 null 檢查會拋出不同的例外，例如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 以及 `TypeCastException`。
> - &gt;= 1.4：所有執行時期 null 檢查都拋出 `java.lang.NullPointerException`。
>   可以使用 `-Xno-unified-null-checks` 暫時恢復到 1.4 之前的行為。

### 在陣列/清單操作 contains、indexOf、lastIndexOf 中比較浮點值：IEEE 754 或全序

> **問題**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
> 
> **組建**：kotlin-stdlib (JVM)
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：從 `Double/FloatArray.asList()` 傳回的 `List` 實作將會實作 `contains`、`indexOf` 與 `lastIndexOf`，使它們使用全序相等性 (total order equality)。
> 
> **棄用週期**： 
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### 逐步將集合 min 與 max 函式的傳回型別變更為不可 null

> **問題**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
> 
> **組建**：kotlin-stdlib (JVM)
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：集合 `min` 與 `max` 函式的傳回型別將在 1.6 中變更為不可 null。
> 
> **棄用週期**：
> 
> - 1.4：引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳見問題描述）。
> - 1.5.x：將受影響 API 的棄用級別提升為錯誤。
> - &gt;=1.6：重新引入受影響的 API，但改為不可 null 的傳回型別。

### 棄用 appendln 並改用 appendLine

> **問題**：[KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
> 
> **組建**：kotlin-stdlib (JVM)
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：`StringBuilder.appendln()` 將被棄用，改用 `StringBuilder.appendLine()`。
> 
> **棄用週期**：
> 
> - 1.4：引入 `appendLine` 函式作為 `appendln` 的替代，並棄用 `appendln`。
> - &gt;=1.5：將棄用級別提升為錯誤。

### 棄用將浮點型別轉換為 Short 與 Byte

> **問題**：[KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
> 
> **組建**：kotlin-stdlib (JVM)
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，將浮點型別轉換為 `Short` 與 `Byte` 將被棄用。
> 
> **棄用週期**：
> 
> - 1.4：棄用 `Double.toShort()/toByte()` 與 `Float.toShort()/toByte()` 並提出替代方案。
> - &gt;=1.5：將棄用級別提升為錯誤。

### 在無效的 startIndex 下讓 Regex.findAll 快速失敗

> **問題**：[KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
> 
> **組建**：kotlin-stdlib
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：自 Kotlin 1.4 起，`findAll` 將被改良，在進入 `findAll` 時檢查 `startIndex` 是否在輸入字元序列的有效位置索引範圍內，如果不是則拋出 `IndexOutOfBoundsException`。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### 移除已棄用的 kotlin.coroutines.experimental

> **問題**：[KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
> 
> **組建**：kotlin-stdlib
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，已棄用的 `kotlin.coroutines.experimental` API 已從 stdlib 中移除。
> 
> **棄用週期**：
> 
> - < 1.4：`kotlin.coroutines.experimental` 被棄用，等級為 `ERROR`。
> - &gt;= 1.4：`kotlin.coroutines.experimental` 從 stdlib 中移除。在 JVM 上，提供了一個單獨的相容性構件（詳見問題描述）。

### 移除已棄用的 mod 運算子

> **問題**：[KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
> 
> **組建**：kotlin-stdlib
> 
> **不相容變更類型**：原始碼
> 
> **簡要摘要**：自 Kotlin 1.4 起，數值型別上的 `mod` 運算子已從 stdlib 中移除。
> 
> **棄用週期**：
> 
> - < 1.4：`mod` 被棄用，等級為 `ERROR`。
> - &gt;= 1.4：`mod` 從 stdlib 中移除。

### 隱藏 Throwable.addSuppressed 成員並優先使用擴充方法

> **問題**：[KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
> 
> **組建**：kotlin-stdlib
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：`Throwable.addSuppressed()` 擴充函式現在優於 `Throwable.addSuppressed()` 成員函式。
> 
> **棄用週期**：
> 
> - < 1.4：舊行為（詳見問題描述）。
> - &gt;= 1.4：行為已變更

### capitalize 應將雙合字母轉換為標題大小寫

> **問題**：[KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
> 
> **組建**：kotlin-stdlib
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：`String.capitalize()` 函式現在會將來自 [塞爾維亞-克羅埃西亞語蓋伊拉丁字母 (Serbo-Croatian Gaj's Latin alphabet)](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 的雙合字母 (digraphs) 轉換為標題大小寫 (title case)（`ǅ` 而非 `Ǆ`）。
> 
> **棄用週期**：
> 
> - < 1.4：雙合字母被轉換為大寫 (`Ǆ`)。
> - &gt;= 1.4：雙合字母被轉換為標題大小寫 (`ǅ`)。

## 工具

### 帶有分隔符號字元的編譯器引數在 Windows 上必須放在雙引號中

> **問題**：[KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
> 
> **組建**：CLI
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：在 Windows 上，包含分隔符號字元（空白、`=`、`;`、`,`）的 `kotlinc.bat` 引數現在需要雙引號 (`"`)。
> 
> **棄用週期**：
> 
> - < 1.4：所有編譯器引數都在不帶引號的情況下傳遞。
> - &gt;= 1.4：包含分隔符號字元（空白、`=`、`;`、`,`）的編譯器引數需要雙引號 (`"`)。

### KAPT：屬性的合成 $annotations() 方法名稱已變更

> **問題**：[KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
> 
> **組建**：KAPT
> 
> **不相容變更類型**：行為
> 
> **簡要摘要**：KAPT 為屬性產生的合成 `$annotations()` 方法名稱在 1.4 中已變更。
> 
> **棄用週期**：
> 
> - < 1.4：屬性的合成 `$annotations()` 方法名稱遵循範本 `<propertyName>@annotations()`。
> - &gt;= 1.4：屬性的合成 `$annotations()` 方法名稱包含 `get` 前綴：`get<PropertyName>@annotations()`