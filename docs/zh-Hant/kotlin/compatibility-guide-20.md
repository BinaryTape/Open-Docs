[//]: # (title: Kotlin 2.0 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出，阻礙語言演進的建構應予移除，後者則要求此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新的變更日誌或編譯器警告）公佈，本文仍為從 Kotlin 1.9 遷移到 Kotlin 2.0 提供了完整的參考文件。

> Kotlin K2 編譯器作為 Kotlin 2.0 的一部分引入。有關新編譯器的優點、您在遷移期間可能遇到的變更以及如何回溯到先前編譯器的資訊，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。
>
{style="note"}

## 基本術語

本文中我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本能正常編譯（無錯誤或警告）的程式碼不再能編譯。
- _二進位 (binary)_：如果兩個二進位檔案之間互換不會導致載入或連結錯誤，則稱它們是二進位相容的。
- _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更是行為不相容的。

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言角度（例如 Java）來看 Kotlin 程式碼的相容性，不在本文討論範圍之內。

## 語言

<!--
### Title

> **Issue**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**:
>
> **Deprecation cycle**:
>
> - 1.6.20: report a warning
> - 1.8.0: raise the warning to an error
-->

### 棄用在投影接收器上使用合成 setter

> **問題**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: 如果您使用 Java 類別的合成 setter 來指派與該類別的投影類型衝突的類型，則會觸發錯誤。
>
> **棄用週期**:
>
> - 1.8.20: 當合成屬性 setter 在逆變位置具有投影參數類型，導致呼叫點引數類型不相容時，報告警告
> - 2.0.0: 將警告提升為錯誤

### 修正當呼叫具有內聯類別參數且在 Java 子類別中重載的函式時的名稱修飾

> **問題**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 2.0.0: 在函式調用中採用正確的名稱修飾行為；要恢復到先前的行為，請使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 編譯器選項。

### 修正逆變捕獲類型 (contravariant captured types) 的類型近似演算法

> **問題**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.20: 對有問題的呼叫報告警告
> - 2.0.0: 將警告提升為錯誤

### 禁止在屬性初始化之前存取屬性值

> **問題**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 在受影響的上下文中，當屬性在初始化之前被存取時報告錯誤

### 當匯入的類別名稱相同時報告歧義錯誤

> **問題**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當解析透過星號匯入 (star import) 存在於多個套件中的類別名稱時報告錯誤

### 預設透過 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda

> **問題**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；lambda 函式預設使用 `invokedynamic` 和 `LambdaMetafactory` 生成

### 禁止 if 條件只有一個分支但需要表達式的情況

> **問題**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 如果 `if` 條件只有一個分支，則報告錯誤

### 禁止透過傳遞泛型類型的星號投影來違反自身上限

> **問題**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當透過傳遞泛型類型的星號投影 (star-projection) 違反自身上限時報告錯誤

### 在私有內聯函式回傳類型中近似匿名類型

> **問題**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.9.0: 對於推斷回傳類型包含匿名類型的私有內聯函式報告警告
> - 2.0.0: 將此類私有內聯函式的回傳類型近似為其超類型

### 更改重載解析行為，優先處理本地擴展函式呼叫而非本地函式類型屬性的 invoke 約定

> **問題**: [KT-37592](https://youtrack.com/issue/KT-37592)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 2.0.0: 新的重載解析行為；函式呼叫會一致地優先於 invoke 約定

### 當繼承成員衝突由於二進位依賴的超類型變更而發生時報告錯誤

> **問題**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.7.0: 對於因二進位依賴的超類型中發生繼承成員衝突的聲明，報告 `CONFLICTING_INHERITED_MEMBERS_WARNING` 警告
> - 2.0.0: 將警告提升為錯誤：`CONFLICTING_INHERITED_MEMBERS`

### 忽略不變類型 (invariant types) 參數上的 `@UnsafeVariance` 註解

> **問題**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；在報告逆變參數中的類型不匹配錯誤時，會忽略 `@UnsafeVariance` 註解

### 更改伴生物件成員的外部呼叫引用類型

> **問題**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.20: 對於推斷為非綁定參考的伴生物件函式參考類型報告警告
> - 2.0.0: 更改行為，使伴生物件函式參考在所有使用上下文中均推斷為綁定參考

### 禁止私有內聯函式暴露匿名類型

> **問題**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.3.0: 對於呼叫從私有內聯函式返回的匿名物件的自身成員報告警告
> - 2.0.0: 將此類私有內聯函式的回傳類型近似為其超類型，並且不解析對匿名物件成員的呼叫

### 在 while 迴圈中斷後，對不健全的智能轉換 (smart cast) 報告錯誤

> **問題**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；舊行為可以透過切換到語言版本 1.9 來恢復

### 當交集類型 (intersection type) 的變數被賦值一個不是該交集類型子類型的值時報告錯誤

> **問題**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當具有交集類型的變數被賦值一個不是該交集類型子類型的值時報告錯誤

### 當使用 SAM 構造函式構建的介面包含需要選擇加入 (opt-in) 的方法時，要求選擇加入

> **問題**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.7.20: 對於透過 SAM 構造函式的 `OptIn` 使用報告警告
> - 2.0.0: 對於透過 SAM 構造函式的 `OptIn` 使用將警告提升為錯誤（如果 `OptIn` 標記嚴重性是警告，則保持報告警告）

### 禁止類型別名 (typealias) 構造函式中的上限違反

> **問題**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.0: 對於類型別名構造函式中違反上限的情況引入警告
> - 2.0.0: 在 K2 編譯器中將警告提升為錯誤

### 使解構變數的實際類型與指定時的顯式類型保持一致

> **問題**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；當指定時，解構變數的實際類型現在與顯式類型保持一致

### 當呼叫的構造函式具有預設值且需要選擇加入 (opt-in) 的參數類型時，要求選擇加入

> **問題**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.20: 對於具有預設值且需要選擇加入的參數類型的構造函式呼叫報告警告
> - 2.0.0: 將警告提升為錯誤（如果 `OptIn` 標記嚴重性是警告，則保持報告警告）

### 在相同作用域級別，當屬性與列舉成員同名時報告歧義

> **問題**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.7.20: 當編譯器在相同作用域級別解析為屬性而非列舉成員時報告警告
> - 2.0.0: 在 K2 編譯器中，當編譯器在相同作用域級別遇到同名的屬性與列舉成員時報告歧義（在舊編譯器中保持警告不變）

### 更改限定符解析行為，優先選擇伴生屬性而非列舉成員

> **問題**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新的解析行為；伴生屬性優先於列舉成員

### 解析 invoke 呼叫的接收器類型和 invoke 函式類型，如同它們以解糖形式 (desugared form) 撰寫一樣

> **問題**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 獨立解析 invoke 呼叫接收器類型和 invoke 函式類型，如同它們以解糖形式撰寫一樣

### 禁止透過非私有內聯函式暴露私有類別成員

> **問題**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.9.0: 當從內部內聯函式呼叫私有類別伴生物件成員時，報告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告
> - 2.0.0: 將此警告提升為 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 錯誤

### 修正投影泛型類型中確定非空類型 (definitely non-null types) 的可空性

> **問題**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；投影類型會考慮所有就地非空類型

### 更改前綴遞增的推斷類型以匹配 getter 的回傳類型，而非 `inc()` 運算子的回傳類型

> **問題**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；前綴遞增的推斷類型已更改為匹配 getter 的回傳類型，而非 `inc()` 運算子的回傳類型

### 當從超類別中聲明的泛型內部類別繼承內部類別時，強制執行邊界檢查

> **問題**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當泛型內部超類別的類型參數的上限被違反時報告錯誤

### 當預期類型是帶有函式類型參數的函式類型時，禁止將具有 SAM 類型 (SAM types) 的可呼叫引用 (callable references) 賦值

> **問題**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當預期類型是帶有函式類型參數的函式類型時，對具有 SAM 類型的可呼叫引用報告編譯錯誤

### 在伴生物件的註解解析中考慮伴生物件作用域

> **問題**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；現在在伴生物件的註解解析期間，伴生物件作用域不再被忽略

### 更改安全呼叫和約定運算子組合的求值語義

> **問題**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 1.4.0: 對每個不正確的呼叫報告警告
> - 2.0.0: 實施新的解析行為

### 要求具有後備欄位 (backing field) 和自定義 setter 的屬性立即初始化

> **問題**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 1.9.20: 對於沒有主要構造函式的情況引入 `MUST_BE_INITIALIZED` 警告
> - 2.0.0: 將警告提升為錯誤

### 禁止在 invoke 運算子約定呼叫中對任意表達式進行 Unit 轉換

> **問題**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 2.0.0: 當 Unit 轉換應用於變數和 invoke 解析上的任意表達式時報告錯誤；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 編譯器選項可保留受影響表達式的先前行為。

### 當以安全呼叫存取欄位時，禁止將可空值賦值給非空 Java 欄位

> **問題**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 當將可空值賦值給非空 Java 欄位時報告錯誤

### 當覆寫包含原始類型參數的 Java 方法時，要求星號投影類型

> **問題**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；禁止對原始類型參數進行覆寫

### 更改當 V 具有伴生物件時 `(V)::foo` 參考的解析

> **問題**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 行為
>
> **棄用週期**:
>
> - 1.6.0: 對於目前綁定到伴生物件實例的可呼叫引用報告警告
> - 2.0.0: 實施新行為；在類型周圍添加括號不再使其成為該類型伴生物件實例的引用

### 禁止在實質上的公開內聯函式中隱式存取非公開 API

> **問題**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.20: 當在公開內聯函式中隱式存取非公開 API 時報告編譯警告
> - 2.0.0: 將警告提升為錯誤

### 禁止在屬性 getter 上使用站點的 `get` 註解

> **問題**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.9.0: 對於 getter 上使用站點的 `get` 註解報告警告（在漸進模式下為錯誤）
> - 2.0.0: 將警告提升為 `INAPPLICABLE_TARGET_ON_PROPERTY` 錯誤；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 可恢復為警告

### 防止在建構器推斷 (builder inference) lambda 函式中將類型參數隱式推斷為上限

> **問題**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.7.20: 當類型引數無法推斷到聲明的上限中時報告警告（或在漸進模式下為錯誤）
> - 2.0.0: 將警告提升為錯誤

### 在公開簽章中近似本地類型時保留可空性

> **問題**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.0: 彈性類型由彈性超類型近似；當聲明推斷為非空類型但實際上應為可空時，報告警告，提示明確指定類型以避免 NPEs (NullPointerException)
> - 2.0.0: 可空類型由可空超類型近似

### 移除為智能轉換 (smart-casting) 目的而對 `false && ...` 和 `false || ...` 的特殊處理

> **問題**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 2.0.0: 實施新行為；對 `false && ...` 和 `false || ...` 不再有特殊處理

### 禁止在列舉中內聯開放函式

> **問題**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **棄用週期**:
>
> - 1.8.0: 對於列舉中的內聯開放函式報告警告
> - 2.0.0: 將警告提升為錯誤

## 工具

### Gradle 中的可見性變更

> **問題**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: 以前，某些用於特定 DSL 上下文的 Kotlin DSL 函式和屬性會意外地洩漏到其他 DSL 上下文中。我們新增了 `@KotlinGradlePluginDsl` 註解，它阻止 Kotlin Gradle 外掛程式 DSL 函式和屬性暴露到不應提供的層級。以下層級彼此獨立：
> * Kotlin 擴展
> * Kotlin 目標
> * Kotlin 編譯
> * Kotlin 編譯任務
>
> **棄用週期**:
>
> - 2.0.0: 對於大多數常見情況，如果您的構建腳本配置不正確，編譯器會報告警告並提供修復建議；否則，編譯器會報告錯誤

### 棄用 `kotlinOptions` DSL

> **問題**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: 透過 `kotlinOptions` DSL 和相關的 `KotlinCompile<KotlinOptions>` 任務介面配置編譯器選項的功能已棄用。
>
> **棄用週期**:
>
> - 2.0.0: 報告警告

### 棄用 KotlinCompilation DSL 中的 `compilerOptions`

> **問題**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: 在 `KotlinCompilation` DSL 中配置 `compilerOptions` 屬性的功能已棄用。
>
> **棄用週期**:
>
> - 2.0.0: 報告警告

### 棄用 CInteropProcess 處理的舊方式

> **問題**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: `CInteropProcess` 任務和 `CInteropSettings` 類別現在使用 `definitionFile` 屬性，而不是 `defFile` 和 `defFileProperty`。
>
> 當 `defFile` 動態生成時，這消除了在 `CInteropProcess` 任務與生成 `defFile` 的任務之間添加額外 `dependsOn` 關聯的需求。
>
> 在 Kotlin/Native 專案中，Gradle 現在會在構建過程後期相關任務運行後，延遲驗證 `definitionFile` 屬性的存在性。
>
> **棄用週期**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 參數已棄用

### 移除 `kotlin.useK2` Gradle 屬性

> **問題**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **組件**: Gradle
>
> **不相容變更類型**: 行為
>
> **簡要總結**: `kotlin.useK2` Gradle 屬性已移除。在 Kotlin 1.9.* 中，它可以用來啟用 K2 編譯器。在 Kotlin 2.0.0 及更高版本中，K2 編譯器預設啟用，因此該屬性不再有任何效果，也無法用於切換回先前的編譯器。
>
> **棄用週期**:
>
> - 1.8.20: `kotlin.useK2` Gradle 屬性已棄用
> - 2.0.0: `kotlin.useK2` Gradle 屬性已移除

### 移除已棄用的平台外掛程式 ID

> **問題**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: 對這些平台外掛程式 ID 的支持已移除：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **棄用週期**:
>
> - 1.3: 平台外掛程式 ID 已棄用
> - 2.0.0: 平台外掛程式 ID 不再支援

### 移除 `outputFile` JavaScript 編譯器選項

> **問題**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡要總結**: `outputFile` JavaScript 編譯器選項已移除。取而代之，您可以使用 `Kotlin2JsCompile` 任務的 `destinationDirectory` 屬性來指定編譯後的 JavaScript 輸出檔案的寫入目錄。
>
> **棄用週期**:
>
> - 1.9.25: `outputFile` 編譯器選項已棄用
> - 2.0.0: `outputFile` 編譯器選項已移除