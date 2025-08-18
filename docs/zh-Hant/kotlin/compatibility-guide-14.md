[//]: # (title: Kotlin 1.4 相容性指南)

_保持語言現代化 (Keeping the Language Modern)_ 和 _舒適的更新 (Comfortable Updates)_ 是 Kotlin 語言設計的根本原則。前者指出阻礙語言演進的建構應予移除，後者則要求此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道發布，例如更新變更日誌或編譯器警告，但本文檔將它們全部總結，為從 Kotlin 1.3 遷移到 Kotlin 1.4 提供完整的參考。

## 基本術語

在本文檔中，我們介紹了幾種相容性：

-   _source_：原始碼不相容變更會導致原本能正常編譯（無錯誤或警告）的程式碼不再編譯。
-   _binary_：如果兩個二進位檔案相互替換不會導致載入或連結錯誤，則稱它們為二進位相容。
-   _behavioral_：如果相同的程式在應用變更前後表現出不同的行為，則稱此變更為行為不相容。

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言（例如 Java）角度來看的 Kotlin 程式碼相容性不在本文檔的範圍內。

## 語言與標準函式庫 (stdlib)

### `in` 中綴運算子與 ConcurrentHashMap 的意外行為

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止自動運算子 `contains` 來自於用 Java 編寫的 `java.util.Map` 實作。
>
> **Deprecation cycle**:
>
> -   < 1.4: 在呼叫端為問題運算子引入警告。
> -   &gt;= 1.4: 將此警告提升為錯誤，
>     `-XXLanguage:-ProhibitConcurrentHashMapContains` 可用於暫時恢復到 1.4 之前的行為。

### 禁止在公開 `inline` 成員內部存取受保護成員

> **Issue**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止從公開的 `inline` 成員內部存取受保護成員。
>
> **Deprecation cycle**:
>
> -   < 1.4: 在呼叫端為問題案例引入警告。
> -   1.4: 將此警告提升為錯誤，
>     `-XXLanguage:-ProhibitProtectedCallFromInline` 可用於暫時恢復到 1.4 之前的行為。

### 隱式接收者的呼叫上的契約

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
>
> **Component**: 核心語言 (Core Language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 1.4 開始，來自契約的智慧型轉換將適用於帶有隱式接收者的呼叫。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 可用於暫時恢復到 1.4 之前的行為。

### 浮點數比較的不一致行為

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，Kotlin 編譯器將使用 IEEE 754 標準來比較浮點數。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-ProperIeee754Comparisons` 可用於暫時恢復到 1.4 之前的行為。

### 泛型 Lambda 中最後一個表達式沒有智慧型轉換

> **Issue**: [KT-15020](https://youtrack.com/issue/KT-15020)
>
> **Component**: 核心語言 (Core Language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 1.4 開始，Lambda 中最後一個表達式的智慧型轉換將被正確應用。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 不依賴 Lambda 引數順序來強制結果轉換為 Unit

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，Lambda 引數將獨立解析，不再隱式強制轉換為 `Unit`。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 原始型別與整數常值型別之間錯誤的共同父型別導致不健全的程式碼

> **Issue**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
>
> **Components**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，原始 `Comparable` 型別與整數常值型別之間的共同父型別將更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 型別安全問題：多個相等型別變數以不同型別實例化

> **Issue**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，Kotlin 編譯器將禁止以不同型別實例化相等型別變數。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 型別安全問題：交集型別不正確的子型別化

> **Issues**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 在 Kotlin 1.4 中，交集型別的子型別化將被完善以更正確地運作。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### Lambda 內空 `when` 表達式不會產生型別不匹配

> **Issue**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果空的 `when` 表達式用作 Lambda 中的最後一個表達式，將會出現型別不匹配。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 針對 Lambda 中帶有整數常值提前返回的情況推斷出 `Any` 返回型別

> **Issue**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，當存在提前返回時，從 Lambda 返回的整數型別將更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 正確捕捉帶有遞迴型別的星號投影

> **Issue**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，將會有更多候選型別適用，因為遞迴型別的捕捉將更正確地運作。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 非適切型別與彈性型別的共同父型別計算導致不正確的結果

> **Issue**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，彈性型別之間的共同父型別將更具體，以防止執行時錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 型別安全問題：缺少針對可空值型別引數的捕捉轉換

> **Issue**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，捕捉型別與可空值型別之間的子型別化將更正確，以防止執行時錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 在未經檢查的轉型後保留協變型別的交集型別

> **Issue**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，協變型別的未經檢查轉型將產生智慧型轉換的交集型別，而非未經檢查轉型的型別。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 型別變數因使用 `this` 表達式從建構器推斷中洩漏

> **Issue**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果沒有其他適當的約束，則禁止在 `sequence {}` 等建構器函式內部使用 `this`。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 帶有可空值型別引數的逆變型別錯誤的多載解析

> **Issue**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果接受逆變型別引數的函式的兩個多載僅因型別的可空性而異（例如 `In<T>` 和 `In<T?>`），則可空值型別被認為更具體。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 帶有非巢狀遞迴約束的建構器推斷

> **Issue**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，`sequence {}` 等建構器函式如果其型別依賴於傳入的 Lambda 內的遞迴約束，將導致編譯器錯誤。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 急切的型別變數固定導致矛盾的約束系統

> **Issue**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，在某些情況下，型別推斷的工作會減少急切性，從而允許找到一個不矛盾的約束系統。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NewInference` 可用於暫時恢復到 1.4 之前的行為。請注意，此標誌也將禁用一些新的語言功能。

### 禁止在 `open` 函式上使用 `tailrec` 修飾符

> **Issue**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，函式不能同時擁有 `open` 和 `tailrec` 修飾符。
>
> **Deprecation cycle**:
>
> -   < 1.4: 對同時具有 `open` 和 `tailrec` 修飾符的函式報告警告（在漸進模式下為錯誤）。
> -   &gt;= 1.4: 將此警告提升為錯誤。

### 伴隨物件的 `INSTANCE` 欄位比伴隨物件類別本身更可見

> **Issue**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，如果伴隨物件是 `private` 的，那麼它的 `INSTANCE` 欄位也將是 `private` 的。
>
> **Deprecation cycle**:
>
> -   < 1.4: 編譯器生成帶有已廢棄標誌的物件 `INSTANCE`。
> -   &gt;= 1.4: 伴隨物件的 `INSTANCE` 欄位具有正確的可見性。

### 外部 `finally` 區塊插入在 `return` 之前，未被內部不帶 `finally` 的 `try` 區塊的捕獲區間排除

> **Issue**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，嵌套 `try/catch` 區塊的捕獲區間將被正確計算。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-ProperFinally` 可用於暫時恢復到 1.4 之前的行為。

### 在協變和泛型特化覆寫中，在返回型別位置使用 `inline` 類別的裝箱版本

> **Issues**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，使用協變和泛型特化覆寫的函式將返回 `inline` 類別的裝箱值。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### 在委派給 Kotlin 介面時，不在 JVM 位元碼中聲明已檢查例外

> **Issue**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將不會在介面委派給 Kotlin 介面期間生成已檢查例外。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 可用於暫時恢復到 1.4 之前的行為。

### 更改帶有單個 `vararg` 參數的簽名多態呼叫行為，以避免將引數包裝到另一個陣列中

> **Issue**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將不會在簽名多態呼叫上將引數包裝到另一個陣列中。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### KClass 用作泛型參數時註解中不正確的泛型簽名

> **Issue**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將修復 KClass 用作泛型參數時註解中不正確的型別映射。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### 禁止在簽名多態呼叫中使用展開運算子

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.4 將禁止在簽名多態呼叫上使用展開運算子 (`*`)。
>
> **Deprecation cycle**:
>
> -   < 1.4: 對於在簽名多態呼叫中使用展開運算子報告警告。
> -   &gt;= 1.5: 將此警告提升為錯誤，
>     `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用於暫時恢復到 1.4 之前的行為。

### 改變尾遞迴優化函式預設值的初始化順序

> **Issue**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，尾遞迴函式的初始化順序將與常規函式相同。
>
> **Deprecation cycle**:
>
> -   < 1.4: 對於有問題的函式，在宣告位置報告警告。
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 可用於暫時恢復到 1.4 之前的行為。

### 不為非 `const` 的 `val`s 生成 `ConstantValue` 屬性

> **Issue**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，編譯器將不會為非 `const` 的 `val`s 生成 `ConstantValue` 屬性。
>
> **Deprecation cycle**:
>
> -   < 1.4: 透過 IntelliJ IDEA 檢查報告警告。
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 可用於暫時恢復到 1.4 之前的行為。

### 對於 `open` 方法上的 `@JvmOverloads` 生成的多載應為 `final`

> **Issue**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
>
> **Components**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 帶有 `@JvmOverloads` 的函式的多載將生成為 `final`。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更，
>     `-XXLanguage:-GenerateJvmOverloadsAsFinal` 可用於暫時恢復到 1.4 之前的行為。

### 返回 `kotlin.Result` 的 Lambda 現在返回裝箱值而非未裝箱值

> **Issue**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，返回 `kotlin.Result` 型別值的 Lambda 將返回裝箱值而非未裝箱值。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### 統一空值檢查的例外

> **Issue**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavior)
>
> **Short summary**: 從 Kotlin 1.4 開始，所有執行時空值檢查都將拋出 `java.lang.NullPointerException`。
>
> **Deprecation cycle**:
>
> -   < 1.4: 執行時空值檢查拋出不同的例外，例如 `KotlinNullPointerException`、`IllegalStateException`、`IllegalArgumentException` 和 `TypeCastException`。
> -   &gt;= 1.4: 所有執行時空值檢查都拋出 `java.lang.NullPointerException`。
>     `-Xno-unified-null-checks` 可用於暫時恢復到 1.4 之前的行為。

### 在陣列/列表操作 `contains`、`indexOf`、`lastIndexOf` 中比較浮點值：IEEE 754 或全序

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 `Double/FloatArray.asList()` 返回的 `List` 實作將實現 `contains`、`indexOf` 和 `lastIndexOf`，使其使用全序相等性。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### 逐步將集合 `min` 和 `max` 函式的返回型別變更為非可空值

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 集合 `min` 和 `max` 函式的返回型別將在 1.6 中變更為非可空值。
>
> **Deprecation cycle**:
>
> -   1.4: 引入 `...OrNull` 函式作為同義詞並廢棄受影響的 API（詳情請參閱 Issue）。
> -   1.5.x: 將受影響 API 的廢棄級別提升為錯誤。
> -   &gt;=1.6: 重新引入受影響的 API，但返回型別為非可空值。

### 廢棄 `appendln` 轉而使用 `appendLine`

> **Issue**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `StringBuilder.appendln()` 將被廢棄，轉而使用 `StringBuilder.appendLine()`。
>
> **Deprecation cycle**:
>
> -   1.4: 引入 `appendLine` 函式作為 `appendln` 的替代並廢棄 `appendln`。
> -   &gt;=1.5: 將廢棄級別提升為錯誤。

### 廢棄浮點型別轉換為 `Short` 和 `Byte`

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，浮點型別轉換為 `Short` 和 `Byte` 將被廢棄。
>
> **Deprecation cycle**:
>
> -   1.4: 廢棄 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 並建議替代方案。
> -   &gt;=1.5: 將廢棄級別提升為錯誤。

### 在 `Regex.findAll` 遇到無效 `startIndex` 時快速失敗

> **Issue**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 自 Kotlin 1.4 起，`findAll` 將進行改進，檢查 `startIndex` 在進入 `findAll` 時是否在輸入字元序列的有效位置索引範圍內，如果不在則拋出 `IndexOutOfBoundsException`。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### 移除已廢棄的 `kotlin.coroutines.experimental`

> **Issue**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，已廢棄的 `kotlin.coroutines.experimental` API 將從標準函式庫中移除。
>
> **Deprecation cycle**:
>
> -   < 1.4: `kotlin.coroutines.experimental` 以 `ERROR` 級別廢棄。
> -   &gt;= 1.4: `kotlin.coroutines.experimental` 從標準函式庫中移除。在 JVM 上，提供了單獨的相容性二進位檔案（詳情請參閱 Issue）。

### 移除已廢棄的 `mod` 運算子

> **Issue**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 自 Kotlin 1.4 起，數值型別上的 `mod` 運算子將從標準函式庫中移除。
>
> **Deprecation cycle**:
>
> -   < 1.4: `mod` 以 `ERROR` 級別廢棄。
> -   &gt;= 1.4: `mod` 從標準函式庫中移除。

### 隱藏 `Throwable.addSuppressed` 成員並傾向於使用擴充函式

> **Issue**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `Throwable.addSuppressed()` 擴充函式現在比 `Throwable.addSuppressed()` 成員函式更受推薦。
>
> **Deprecation cycle**:
>
> -   < 1.4: 舊行為（詳情請參閱 Issue）
> -   &gt;= 1.4: 行為變更

### `capitalize` 應將雙字母組合轉換為標題大小寫

> **Issue**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `String.capitalize()` 函式現在將塞爾維亞-克羅埃西亞語蓋伊拉丁字母 (Serbo-Croatian Gaj's Latin alphabet) 中的雙字母組合大寫為標題大小寫（`ǅ` 而非 `Ǆ`）。
>
> **Deprecation cycle**:
>
> -   < 1.4: 雙字母組合以大寫形式大寫（`Ǆ`）。
> -   &gt;= 1.4: 雙字母組合以標題大小寫形式大寫（`ǅ`）。

## 工具 (Tools)

### 在 Windows 上，帶有分隔符號的編譯器引數必須用雙引號傳遞

> **Issue**: [KT-41309](https://youtrack.jetbrains.com/issue/KT-41309)
>
> **Component**: CLI
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 在 Windows 上，包含分隔符號（空白、`=`、`;`、`,`）的 `kotlinc.bat` 引數現在需要雙引號 (`"`)。
>
> **Deprecation cycle**:
>
> -   < 1.4: 所有編譯器引數無需引號傳遞。
> -   &gt;= 1.4: 包含分隔符號（空白、`=`、`;`、`,`）的編譯器引數需要雙引號 (`"`)。

### KAPT：屬性的合成 `$annotations()` 方法名稱已更改

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
> -   < 1.4: 屬性的合成 `$annotations()` 方法名稱遵循 `<propertyName>@annotations()` 範本。
> -   &gt;= 1.4: 屬性的合成 `$annotations()` 方法名稱包含 `get` 字首：`get<PropertyName>@annotations()`。