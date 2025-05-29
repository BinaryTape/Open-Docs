[//]: # (title: Kotlin 1.4 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出應移除阻礙語言演進的結構，後者則表示此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）發布，但本文件將其全部總結，為從 Kotlin 1.3 遷移到 Kotlin 1.4 提供完整的參考。

## 基本術語

本文件介紹了幾種相容性類型：

-   _原始碼 (source)_：原始碼不相容的變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
-   _二進位 (binary)_：如果兩個二進位 (binary) 構件 (artifacts) 交換使用不會導致載入或連結錯誤，則稱它們是二進位相容的。
-   _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更是行為不相容的。

請記住，這些定義僅適用於純 Kotlin。從其他語言（例如 Java）的角度來看 Kotlin 程式碼的相容性，不在本文件的討論範圍內。

## 語言與標準庫 (stdlib)

### `in` 中綴運算子與 `ConcurrentHashMap` 的意外行為

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止從 Java 編寫的 `java.util.Map` 實作器自動生成 `contains` 運算子。
>
> **Deprecation cycle**:
>
> -   < 1.4：在呼叫點為有問題的運算子引入警告
> -   `>= 1.4`：將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitConcurrentHashMapContains` 暫時恢復到 1.4 之前的行為

### 禁止在公開的內聯成員 (public inline members) 中存取受保護成員

> **Issue**: [KT-21178](https://youtrack.com/issue/KT-21178)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止從公開的內聯成員 (public inline members) 存取受保護成員 (protected members)。
>
> **Deprecation cycle**:
>
> -   < 1.4：在呼叫點為有問題的案例引入警告
> -   `1.4`：將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitProtectedCallFromInline` 暫時恢復到 1.4 之前的行為

### 帶有隱式接收器 (implicit receivers) 呼叫上的契約 (Contracts)

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
>
> **Component**: Core Language
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 1.4 開始，契約 (contracts) 的智慧型轉型 (smart casts) 將適用於帶有隱式接收器 (implicit receivers) 的呼叫。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 暫時恢復到 1.4 之前的行為

### 浮點數比較行為不一致

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
>
> **Component**: Core language
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，Kotlin 編譯器將使用 IEEE 754 標準比較浮點數。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-ProperIeee754Comparisons` 暫時恢復到 1.4 之前的行為

### 泛型 lambda 中最後一個表達式沒有智慧型轉型 (smart cast)

> **Issue**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
>
> **Component**: Core Language
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 1.4 起，lambda 中最後一個表達式的智慧型轉型 (smart casts) 將被正確套用。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 不依賴 lambda 參數的順序來強制轉換結果為 `Unit`

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，lambda 參數將獨立解析，而不會隱式強制轉換為 `Unit`。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 原始 `Comparable` 類型與整數字面量類型之間錯誤的共同超類型導致不健全的程式碼

> **Issue**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
>
> **Components**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，原始 `Comparable` 類型 (raw `Comparable` type) 與整數字面量類型 (integer literal type) 之間的共同超類型將更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 由於多個相同類型變數以不同類型實例化導致的類型安全問題

> **Issue**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，Kotlin 編譯器將禁止將相同類型變數實例化為不同類型。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 由於交集類型 (intersection types) 子類型化不正確導致的類型安全問題

> **Issues**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 在 Kotlin 1.4 中，交集類型 (intersection types) 的子類型化將經過改進以更正確地運作。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### lambda 內部空 `when` 表達式沒有類型不匹配

> **Issue**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果空 `when` 表達式用作 lambda 中的最後一個表達式，則會出現類型不匹配。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 在可能返回值之一中帶有整數字面量的早期返回 lambda 的返回類型 `Any` 推斷

> **Issue**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，在有早期返回的情況下，從 lambda 返回的整數類型將更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 遞迴類型 (recursive types) 的星號投影 (star projections) 的正確捕獲

> **Issue**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，由於遞迴類型 (recursive types) 的捕獲將更正確地運作，因此更多候選者將變得適用。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 非規範類型 (non-proper type) 與彈性類型 (flexible type) 的共同超類型計算導致不正確的結果

> **Issue**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
>
> **Component**: Core language
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，彈性類型 (flexible types) 之間的共同超類型將更具體，以防止運行時錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 由於缺少對可空類型參數 (nullable type argument) 的捕獲轉換而導致的類型安全問題

> **Issue**: [KT-35487](https://youtrack.com/issue/KT-35487)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，捕獲類型 (captured types) 和可空類型 (nullable types) 之間的子類型化將更正確，以防止運行時錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 在未檢查轉型 (unchecked cast) 後為協變類型 (covariant types) 保留交集類型 (intersection type)

> **Issue**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，協變類型 (covariant types) 的未檢查轉型 (unchecked casts) 將為智慧型轉型 (smart casts) 生成交集類型 (intersection type)，而非未檢查轉型本身的類型。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 由於使用 `this` 表達式，類型變數從建造器推斷 (builder inference) 中洩漏

> **Issue**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果在建造器函式 (builder functions)（例如 `sequence {}`）內部使用 `this` 且沒有其他適當的約束，則該行為將被禁止。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 帶有可空類型參數 (nullable type arguments) 的逆變類型 (contravariant types) 的錯誤多載解析 (overload resolution)

> **Issue**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果接受逆變類型參數 (contravariant type arguments) 的函式有兩個多載，且它們僅在類型的可空性上不同（例如 `In<T>` 和 `In<T?>`），則可空類型被認為更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 帶有非巢狀遞迴約束 (recursive constraints) 的建造器推斷 (Builder inference)

> **Issue**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，建造器函式 (builder functions)（例如 `sequence {}`）的類型若依賴於傳遞的 lambda 內部的一個遞迴約束 (recursive constraint)，將導致編譯器錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 急切的類型變數固定導致矛盾的約束系統 (constraint system)

> **Issue**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，類型推斷 (type inference) 在某些情況下將不那麼急切地運作，從而允許找到一個不矛盾的約束系統 (constraint system)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NewInference` 暫時恢復到 1.4 之前的行為。請注意，此旗標也會停用幾個新的語言功能。

### 禁止在 `open` 函式上使用 `tailrec` 修飾符

> **Issue**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
>
> **Component**: Core language
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，函式不能同時具有 `open` 和 `tailrec` 修飾符。
>
> **Deprecation cycle**:
>
> -   < 1.4：對同時具有 `open` 和 `tailrec` 修飾符的函式報告警告（在漸進模式下為錯誤）。
> -   `>= 1.4`：將此警告提升為錯誤。

### 伴生物件 (companion object) 的 `INSTANCE` 欄位比伴生物件類別本身更可見

> **Issue**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果一個伴生物件 (companion object) 是私有的，那麼它的 `INSTANCE` 欄位也將是私有的。
>
> **Deprecation cycle**:
>
> -   < 1.4：編譯器產生帶有棄用標誌的物件 `INSTANCE`
> -   `>= 1.4`：伴生物件 (companion object) 的 `INSTANCE` 欄位具有正確的可見性

### 在返回前插入的外部 `finally` 區塊未從內部不帶 `finally` 的 `try` 區塊的捕獲區間 (catch interval) 中排除

> **Issue**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，捕獲區間 (catch interval) 將為巢狀 `try/catch` 區塊正確計算。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-ProperFinally` 暫時恢復到 1.4 之前的行為

### 對於協變 (covariant) 和泛型特化 (generic-specialized) 的覆寫，在返回類型位置使用內聯類 (inline class) 的裝箱版本 (boxed version)

> **Issues**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，使用協變 (covariant) 和泛型特化 (generic-specialized) 覆寫的函式將返回內聯類 (inline classes) 的裝箱值 (boxed values)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 當委託給 Kotlin 介面時，不在 JVM 位元組碼中宣告受檢查異常 (checked exceptions)

> **Issue**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將在介面委託給 Kotlin 介面時，不再生成受檢查異常 (checked exceptions)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 暫時恢復到 1.4 之前的行為

### 更改帶有單個可變參數 (vararg parameter) 的方法簽章多態呼叫 (signature-polymorphic calls) 的行為，以避免將參數包裝到另一個陣列中

> **Issue**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將在簽章多態呼叫 (signature-polymorphic call) 中不將參數包裝到另一個陣列中。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 當 `KClass` 用作泛型參數時，註解中的泛型簽章不正確

> **Issue**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將修復當 `KClass` 用作泛型參數時，註解中不正確的類型映射。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 禁止在簽章多態呼叫 (signature-polymorphic calls) 中使用展開運算子 (*)

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止在簽章多態呼叫 (signature-polymorphic calls) 中使用展開運算子 (*)。
>
> **Deprecation cycle**:
>
> -   < 1.4：在簽章多態呼叫 (signature-polymorphic calls) 中使用展開運算子時報告警告
> -   `>= 1.5`：將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暫時恢復到 1.4 之前的行為

### 更改尾遞迴優化函式 (tail-recursive optimized functions) 預設值的初始化順序

> **Issue**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，尾遞迴函式 (tail-recursive functions) 的初始化順序將與常規函式相同。
>
> **Deprecation cycle**:
>
> -   < 1.4：對於有問題的函式，在宣告點報告警告
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 暫時恢復到 1.4 之前的行為

### 不為非 `const` 的 `val` 生成 `ConstantValue` 屬性

> **Issue**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，編譯器將不為非 `const` 的 `val` 生成 `ConstantValue` 屬性。
>
> **Deprecation cycle**:
>
> -   < 1.4：透過 IntelliJ IDEA 檢查報告警告
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 暫時恢復到 1.4 之前的行為

### `open` 方法上 `@JvmOverloads` 生成的多載應該是 `final`

> **Issue**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
>
> **Components**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 帶有 `@JvmOverloads` 的函式多載將生成為 `final`。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變，可以使用 `-XXLanguage:-GenerateJvmOverloadsAsFinal` 暫時恢復到 1.4 之前的行為

### 返回 `kotlin.Result` 的 lambda 現在返回裝箱值 (boxed value) 而非未裝箱值 (unboxed)

> **Issue**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，返回 `kotlin.Result` 類型值的 lambda 將返回裝箱值 (boxed value) 而非未裝箱值 (unboxed)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 統一空檢查 (null checks) 拋出的異常

> **Issue**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 Kotlin 1.4 開始，所有運行時空檢查 (runtime null checks) 都將拋出 `java.lang.NullPointerException`。
>
> **Deprecation cycle**:
>
> -   < 1.4：運行時空檢查會拋出不同的異常，例如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`
> -   `>= 1.4`：所有運行時空檢查都將拋出 `java.lang.NullPointerException`。可以使用 `-Xno-unified-null-checks` 暫時恢復到 1.4 之前的行為

### 陣列/列表操作 `contains`、`indexOf`、`lastIndexOf` 中浮點數的比較：IEEE 754 或全序相等性 (total order equality)

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 `Double/FloatArray.asList()` 返回的 `List` 實作將實作 `contains`、`indexOf` 和 `lastIndexOf`，使其使用全序相等性 (total order equality)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 逐步將集合 `min` 和 `max` 函式的返回類型更改為非空 (non-nullable)

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 集合 `min` 和 `max` 函式的返回類型將在 1.6 中更改為非空 (non-nullable)。
>
> **Deprecation cycle**:
>
> -   `1.4`：引入 `...OrNull` 函式作為同義詞並棄用受影響的 API（詳情見問題）
> -   `1.5.x`：將受影響 API 的棄用級別提升為錯誤
> -   `>=1.6`：重新引入受影響的 API，但返回類型為非空 (non-nullable)

### 棄用 `appendln` 轉而使用 `appendLine`

> **Issue**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `StringBuilder.appendln()` 將被棄用，轉而使用 `StringBuilder.appendLine()`。
>
> **Deprecation cycle**:
>
> -   `1.4`：引入 `appendLine` 函式作為 `appendln` 的替代，並棄用 `appendln`
> -   `>=1.5`：將棄用級別提升為錯誤

### 棄用浮點類型到 `Short` 和 `Byte` 的轉換

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，浮點類型到 `Short` 和 `Byte` 的轉換將被棄用。
>
> **Deprecation cycle**:
>
> -   `1.4`：棄用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 並提出替代方案
> -   `>=1.5`：將棄用級別提升為錯誤

### `Regex.findAll` 在無效的 `startIndex` 時快速失敗

> **Issue**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，`findAll` 將得到改進，以檢查在進入 `findAll` 時 `startIndex` 是否在輸入字元序列的有效位置索引範圍內，如果不是，則拋出 `IndexOutOfBoundsException`。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### 移除已棄用的 `kotlin.coroutines.experimental`

> **Issue**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，已棄用的 `kotlin.coroutines.experimental` API 已從標準庫 (stdlib) 中移除。
>
> **Deprecation cycle**:
>
> -   < 1.4：`kotlin.coroutines.experimental` 已被棄用，級別為 `ERROR`
> -   `>= 1.4`：`kotlin.coroutines.experimental` 已從標準庫 (stdlib) 中移除。在 JVM 上，提供了單獨的相容性構件 (compatibility artifact)（詳情見問題）。

### 移除已棄用的 `mod` 運算子

> **Issue**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，數字類型上的 `mod` 運算子已從標準庫 (stdlib) 中移除。
>
> **Deprecation cycle**:
>
> -   < 1.4：`mod` 已被棄用，級別為 `ERROR`
> -   `>= 1.4`：`mod` 已從標準庫 (stdlib) 中移除

### 隱藏 `Throwable.addSuppressed` 成員並優先使用擴展函式 (extension function)

> **Issue**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `Throwable.addSuppressed()` 擴展函式 (extension function) 現在優先於 `Throwable.addSuppressed()` 成員函式 (member function)。
>
> **Deprecation cycle**:
>
> -   < 1.4：舊行為（詳情見問題）
> -   `>= 1.4`：行為已改變

### `capitalize` 應將二合字母 (digraphs) 轉換為首字母大寫形式 (title case)

> **Issue**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `String.capitalize()` 函式現在將 [塞爾維亞-克羅埃西亞語蓋伊拉丁字母](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的二合字母 (digraphs) 大寫為首字母大寫形式 (title case)（`ǅ` 而不是 `Ǆ`）。
>
> **Deprecation cycle**:
>
> -   < 1.4：二合字母以大寫形式表示（`Ǆ`）
> -   `>= 1.4`：二合字母以首字母大寫形式表示（`ǅ`）

## 工具

### 帶有分隔符號 (delimiter characters) 的編譯器參數在 Windows 上必須用雙引號傳遞

> **Issue**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
>
> **Component**: CLI
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 在 Windows 上，`kotlinc.bat` 的參數如果包含分隔符號（空白、`=`、`;`、`,`），現在需要雙引號 (`"`)。
>
> **Deprecation cycle**:
>
> -   < 1.4：所有編譯器參數都無需引號傳遞
> -   `>= 1.4`：包含分隔符號（空白、`=`、`;`、`,`）的編譯器參數需要雙引號 (`"`)

### KAPT：為屬性生成的合成 `$annotations()` 方法名稱已更改

> **Issue**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
>
> **Component**: KAPT
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: KAPT 為屬性生成的合成 `$annotations()` 方法名稱在 1.4 中已更改。
>
> **Deprecation cycle**:
>
> -   < 1.4：屬性的合成 `$annotations()` 方法名稱遵循 `<propertyName>@annotations()` 模板
> -   `>= 1.4`：屬性的合成 `$annotations()` 方法名稱包含 `get` 前綴：`get<PropertyName>@annotations()`