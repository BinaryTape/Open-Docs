---
title: "Kotlin 2.0 相容性指南"
---
_[保持語言的現代性](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則。前者表示應移除阻礙語言演進的結構，而後者表示應預先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新的變更日誌或編譯器警告）宣布，但本文檔提供了從 Kotlin 1.9 遷移到 Kotlin 2.0 的完整參考。

:::note
Kotlin K2 編譯器是 Kotlin 2.0 的一部分。 有關新編譯器的優點、遷移期間可能遇到的變更以及如何回滾到先前的編譯器的資訊，請參閱[K2 編譯器遷移指南](k2-compiler-migration-guide)。

:::

## 基本術語 (Basic terms)

在本文檔中，我們介紹了幾種相容性：

- _source (原始碼)_：原始碼不相容的變更會阻止過去可以正常編譯（沒有錯誤或警告）的程式碼再進行編譯
- _binary (二進位)_：如果交換兩個二進位工件 (binary artifacts) 不會導致載入或鏈接錯誤，則稱它們是二進位相容的
- _behavioral (行為)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更在行為上不相容

請記住，這些定義僅適用於純 Kotlin。 Kotlin 程式碼從其他語言的角度來看的相容性
（例如，從 Java）不在本文檔的範圍內。

## 語言 (Language)

<!--
### 標題 (Title)

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告警告 (report a warning)
> - 1.8.0: 將警告提升為錯誤 (raise the warning to an error)
-->

### 棄用在 projected receiver 上使用合成 setter

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 如果您使用 Java 類別的合成 setter (synthetic setter) 來賦予與該類別的 projected type (投射類型) 衝突的類型，則會觸發錯誤。
>
> **Deprecation cycle**:
>
> - 1.8.20: 當合成屬性 (synthetic property) setter 在逆變 (contravariant) 位置具有投射參數類型，從而導致呼叫點 (call-site) 引數類型不相容時，報告警告
> - 2.0.0: 將警告提升為錯誤 (raise the warning to an error)

### 在 Java 子類別中重載的具有 inline class 參數的函式在呼叫時，更正名稱修飾 (mangling)

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 2.0.0: 在函式調用中使用正確的名稱修飾行為；若要恢復到先前的行為，請使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 編譯器選項。

### 更正 contravariant captured types 的類型近似演算法 (type approximation algorithm)

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.20: 在有問題的呼叫上報告警告
> - 2.0.0: 將警告提升為錯誤 (raise the warning to an error)

### 禁止在屬性初始化之前存取屬性值

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 在受影響的上下文中，當屬性在初始化之前被存取時，報告錯誤

### 當匯入的類別具有相同的名稱時，報告錯誤

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當解析的類別名稱存在於使用星號匯入 (star import) 的多個套件 (package) 中時，報告錯誤

### 預設透過 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；預設使用 `invokedynamic` 和 `LambdaMetafactory` 生成 lambda

### 當需要表達式時，禁止使用只有一個分支的 if 條件

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 如果 `if` 條件只有一個分支，則報告錯誤

### 禁止透過傳遞泛型類型 (generic type) 的星號投影 (star-projection) 來違反 self upper bounds

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當透過傳遞泛型類型 (generic type) 的星號投影 (star-projection) 來違反 self upper bounds 時，報告錯誤

### 近似私有 inline 函式回傳類型中的匿名類型

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.9.0: 如果推斷的回傳類型包含匿名類型，則在私有 inline 函式上報告警告
> - 2.0.0: 將此類私有 inline 函式的回傳類型近似為超類型

### 變更重載解析行為，以優先處理本機擴充函式 (local extension function) 呼叫，而不是本機函式類型屬性 (local functional type properties) 的 invoke 慣例

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 2.0.0: 新的重載解析行為；函式呼叫始終優先於 invoke 慣例

### 由於二進位依賴項 (binary dependency) 中超類型的變更而發生繼承成員衝突時，報告錯誤

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.7.0: 在二進位依賴項 (binary dependency) 中超類型發生繼承成員衝突的宣告中，報告 CONFLICTING_INHERITED_MEMBERS_WARNING 警告
> - 2.0.0: 將警告提升為錯誤：CONFLICTING_INHERITED_MEMBERS

### 忽略 invariant type 中參數上的 @UnsafeVariance 註解

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；在報告有關逆變參數中類型不匹配的錯誤時，將忽略 `@UnsafeVariance` 註解

### 變更對伴生物件 (companion object) 成員的 call 外部參考的類型

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.20: 在推斷為未綁定參考的伴生物件 (companion object) 函式參考類型上報告警告
> - 2.0.0: 變更行為，以便在所有使用上下文中將伴生物件 (companion object) 函式參考推斷為已綁定參考

### 禁止從私有 inline 函式公開匿名類型

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.3.0: 在從私有 inline 函式回傳的匿名物件的自身成員的呼叫上報告警告
> - 2.0.0: 將此類私有 inline 函式的回傳類型近似為超類型，並且不解析對匿名物件成員的呼叫

### 在 while 迴圈中斷後，報告不健全的智能轉換 (smart cast) 錯誤

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；可以透過切換到語言版本 1.9 來恢復舊的行為

### 當將一個不是該交集類型 (intersection type) 的子類型的值分配給交集類型的變數時，報告錯誤

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當將一個具有交集類型 (intersection type) 的變數分配給一個不是該交集類型 (intersection type) 的子類型的值時，報告錯誤

### 當使用包含需要選擇加入 (opt-in) 的方法的 SAM 建構函式 (SAM constructor) 建立介面時，需要選擇加入 (opt-in)

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.7.20: 報告透過 SAM 建構函式 (SAM constructor) 使用 `OptIn` 的警告
> - 2.0.0: 將透過 SAM 建構函式 (SAM constructor) 使用 `OptIn` 的警告提升為錯誤 (或如果 `OptIn` 標記嚴重性為警告，則保持報告警告)

### 禁止 typealias 建構函式中違反 upper bound

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.0: 針對在 typealias 建構函式中違反 upper bound 的情況引入警告
> - 2.0.0: 在 K2 編譯器中將警告提升為錯誤

### 使析構變數 (destructuring variable) 的實際類型與指定時的顯式類型保持一致

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；現在，析構變數 (destructuring variable) 的實際類型與指定時的顯式類型保持一致

### 當呼叫具有預設值的參數類型需要選擇加入 (opt-in) 的建構函式時，需要選擇加入 (opt-in)

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.20: 報告具有需要選擇加入 (opt-in) 的參數類型的建構函式呼叫的警告
> - 2.0.0: 將警告提升為錯誤 (或如果 `OptIn` 標記嚴重性為警告，則保持報告警告)

### 在同一作用域級別上，報告具有相同名稱的屬性和 enum 條目之間的歧義

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.7.20: 當編譯器在同一作用域級別解析為屬性而不是 enum 條目時，報告警告
> - 2.0.0: 當編譯器在 K2 編譯器中遇到同一作用域級別上具有相同名稱的屬性和 enum 條目時，報告歧義 (在舊編譯器中保持警告不變)

### 變更限定詞解析 (qualifier resolution) 行為，以優先選擇伴生物件屬性 (companion property) 而不是 enum 條目

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的解析行為；伴生物件屬性 (companion property) 優先於 enum 條目

### 解析 invoke 呼叫接收器類型 (receiver type) 和 invoke 函式類型，就好像是以 desugared 形式編寫一樣

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 獨立解析 invoke 呼叫接收器類型 (receiver type) 和 invoke 函式類型，就好像它們是以 desugared 形式編寫的一樣

### 禁止透過非私有 inline 函式公開私有類別成員

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.9.0: 從內部 inline 函式呼叫私有類別伴生物件 (companion object) 成員時，報告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告
> - 2.0.0: 將此警告提升為 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 錯誤

### 更正 projected generic types 中 definitely non-null 類型的可空性 (nullability)

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；投射類型 (projected types) 會考慮所有 in-place 的 not-null 類型

### 變更前綴遞增 (prefix increment) 的推斷類型以匹配 getter 的回傳類型，而不是 inc() 運算子的回傳類型

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；前綴遞增 (prefix increment) 的推斷類型已變更為匹配 getter 的回傳類型，而不是 `inc()` 運算子的回傳類型

### 在從超類別中宣告的泛型內部類別繼承內部類別時，強制執行 bound 檢查

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當違反泛型內部超類別的類型參數的 upper bound 時，報告錯誤

### 當預期類型是具有函式類型參數的函式類型時，禁止分配具有 SAM 類型的可呼叫參考 (callable references)

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當預期類型是具有函式類型參數的函式類型時，報告具有 SAM 類型的可呼叫參考 (callable references) 的編譯錯誤

### 考慮伴生物件 (companion object) 作用域以解析伴生物件 (companion object) 上的註解

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；現在在伴生物件 (companion object) 上解析註解時，不再忽略伴生物件 (companion object) 作用域

### 變更安全呼叫 (safe calls) 和慣例運算子 (convention operators) 組合的評估語義

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 1.4.0: 在每個不正確的呼叫上報告警告
> - 2.0.0: 實作新的解析行為

### 要求具有 backing field 和自訂 setter 的屬性立即初始化

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 1.9.20: 針對沒有主要建構函式 (primary constructor) 的情況引入 `MUST_BE_INITIALIZED` 警告
> - 2.0.0: 將警告提升為錯誤

### 禁止在 invoke 運算子慣例呼叫 (invoke operator convention call) 中對任意表達式進行 Unit 轉換

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 2.0.0: 當 Unit 轉換應用於變數和 invoke 解析上的任意表達式時，報告錯誤；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 編譯器選項來保持先前受影響表達式的行為。

### 當使用安全呼叫 (safe call) 存取欄位時，禁止將可空值 (nullable) 分配給 non-null Java 欄位

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 在將可空值 (nullable) 分配給 non-null Java 欄位的情況下，報告錯誤

### 覆寫包含 raw-type 參數的 Java 方法時，需要星號投射類型 (star-projected type)

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；禁止覆寫 raw type 參數

### 當 V 具有伴生物件 (companion) 時，變更 (V)::foo 參考解析

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Deprecation cycle**:
>
> - 1.6.0: 報告目前綁定到伴生物件 (companion object) 實例的可呼叫參考 (callable references) 的警告
> - 2.0.0: 實作新的行為；在類型周圍添加括號不再使其成為對類型伴生物件 (companion object) 實例的參考

### 禁止在有效公開的 inline 函式中隱式存取非公開 API

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.20: 在公開的 inline 函式中隱式存取非公開 API 時，報告編譯警告
> - 2.0.0: 將警告提升為錯誤

### 禁止在屬性 getter 上使用 use-site get 註解

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.9.0: 在 getter 上報告 use-site `get` 註解的警告 (在 progressive mode 中為錯誤)
> - 2.0.0: 將警告提升為 `INAPPLICABLE_TARGET_ON_PROPERTY` 錯誤；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 恢復為警告

### 阻止將類型參數隱式推斷到 builder inference lambda 函式的 upper bounds 中

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.7.20: 當無法將類型參數推斷到宣告的 upper bounds 中時，報告警告 (或 progressive mode 中的錯誤)
> - 2.0.0: 將警告提升為錯誤

### 在公開簽名中近似本機類型時，保留可空性 (nullability)

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.0: 彈性類型 (flexible types) 由彈性超類型 (flexible supertypes) 近似；當推斷宣告具有應為可空值的 non-nullable 類型時，報告警告，提示明確指定類型以避免 NPE
> - 2.0.0: 可空類型 (nullable types) 由可空超類型 (nullable supertypes) 近似

### 移除對 false && ... 和 false || ... 進行智能轉換的特殊處理

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 2.0.0: 實作新的行為；對 `false && ...` 和 `false || ...` 不進行特殊處理

### 禁止枚舉中的 inline open 函式

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Deprecation cycle**:
>
> - 1.8.0: 報告枚舉中的 inline open 函式的警告
> - 2.0.0: 將警告提升為錯誤

## 工具 (Tools)

### Gradle 中的可見性變更 (Visibility changes)

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 以前，某些 Kotlin DSL 函式和屬性 (properties) 旨在用於特定的 DSL 上下文，但會不慎洩漏到其他 DSL 上下文。 我們新增了 `@KotlinGradlePluginDsl` 註解，
> 這可以防止 Kotlin Gradle 外掛程式 DSL 函式和屬性公開到不應該可用的級別。 以下級別彼此分離：
> * Kotlin 擴充功能 (Kotlin extension)
> * Kotlin 目標 (Kotlin target)
> * Kotlin 編譯 (Kotlin compilation)
> * Kotlin 編譯任務 (Kotlin compilation task)
>
> **Deprecation cycle**:
>
> - 2.0.0: 對於大多數常見情況，如果您的建置腳本配置不正確，編譯器會報告警告，並提供有關如何修復它們的建議；否則，編譯器會報告錯誤

### 棄用 kotlinOptions DSL

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 透過 `kotlinOptions` DSL 和相關的 `KotlinCompile<KotlinOptions>` 任務介面配置編譯器選項的能力已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 報告警告

### 棄用 KotlinCompilation DSL 中的 compilerOptions

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 配置 `KotlinCompilation` DSL 中的 `compilerOptions` 屬性 (property) 的能力已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 報告警告

### 棄用 CInteropProcess 處理的舊方法

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: `CInteropProcess` 任務和 `CInteropSettings` 類別現在使用 `definitionFile` 屬性 (property)
> 而不是 `defFile` 和 `defFileProperty`。
> 
> 這消除了在動態生成 `defFile` 時，在 `CInteropProcess` 任務和生成 `defFile` 的任務之間新增額外的 `dependsOn` 關係的需求。
> 
> 在 Kotlin/Native 專案中，Gradle 現在會在建置過程中稍後連接的任務執行後，延遲驗證 `definitionFile` 屬性 (property) 的存在。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 參數已被棄用

### 移除 kotlin.useK2 Gradle 屬性 (property)

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: `kotlin.useK2` Gradle 屬性 (property) 已被移除。 在 Kotlin 1.9.* 中，它可用於啟用 K2 編譯器。 在 Kotlin 2.0.0 及更高版本中，預設啟用 K2 編譯器，因此該屬性 (property) 無效，
> 並且不能用於切換回先前的編譯器。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradle 屬性 (property) 已被棄用
> - 2.0.0: 已移除 `kotlin.useK2` Gradle 屬性 (property)

### 移除已棄用的平台外掛程式 ID (platform plugin IDs)

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 已移除對這些平台外掛程式 ID (platform plugin IDs) 的支援：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: 平台外掛程式 ID (platform plugin IDs) 已被棄用
> - 2.0.0: 不再支援平台外掛程式 ID (platform plugin IDs)

### 移除 outputFile JavaScript 編譯器選項

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 已移除 `outputFile` JavaScript 編譯器選項。 相反，您可以使用 `Kotlin2JsCompile` 任務的 `destinationDirectory` 屬性 (property) 來指定編譯後的 JavaScript 輸出檔案的寫入目錄。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` 編譯器選項已被棄用
> - 2.0.0: 已移除 `outputFile` 編譯器選項