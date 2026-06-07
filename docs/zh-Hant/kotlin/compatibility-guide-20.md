[//]: # (title: Kotlin 2.0.x 相容性指南)

_「[保持語言現代化](kotlin-evolution-principles.md)」_與_「[舒適的更新](kotlin-evolution-principles.md)」_是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則要求應事先對此類移除進行充分溝通，以確保程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道宣布（如更新的變更記錄或編譯器警告），本文件為從 Kotlin 1.9 遷移到 Kotlin 2.0 提供完整的參考。

> Kotlin 2.0 引入了 Kotlin K2 編譯器。有關新編譯器的優點、遷移過程中可能遇到的變更，以及如何回復到之前的編譯器，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。
>
{style="note"}

## 基本術語

在本文件中，我們介紹了幾種相容性：

- *原始碼 (source)*：原始碼不相容的變更會導致原本可正常編譯的程式碼（無錯誤或警告）無法再編譯。
- *二進制 (binary)*：若兩個二進制構件互換不會導致載入或連結錯誤，則稱其為二進制相容。
- *行為 (behavioral)*：若同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin。從其他語言（例如 Java）的角度來看 Kotlin 程式碼的相容性不在本文件討論範圍內。

## 語言 (Language)

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

### 棄用在投影接收者上使用合成 setter

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果您使用 Java 類別的合成 setter 來指派一個與該類別投影型別衝突的型別，則會觸發錯誤。
>
> **Deprecation cycle**:
>
> - 1.8.20：當合成屬性 setter 在逆變位置具有投影參數型別，導致呼叫點引數型別不相容時，報告警告。
> - 2.0.0：將警告提升為錯誤。

### 在呼叫具有在 Java 子類別中多載的內嵌類別參數的函式時，修正 mangling 行為

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0：在函式調用中使用正確的 mangling 行為；若要回復到先前的行為，請使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 編譯器選項。

### 為逆變捕獲型別修正型別近似演算法

> **Issue**: [KT-49404](https://youtrack.jetbrains.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20：對有問題的呼叫報告警告。
> - 2.0.0：將警告提升為錯誤。

### 禁止在屬性初始化前存取屬性值

> **Issue**: [KT-56408](https://youtrack.jetbrains.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：在受影響的上下文中，若屬性在初始化前被存取，則報告錯誤。

### 當匯入具有相同名稱的類別存在歧義時報告錯誤

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：當解析的類別名稱同時存在於多個透過星號匯入的套件中時，報告錯誤。

### 預設透過 invokedynamic 與 LambdaMetafactory 產生 Kotlin Lambda

> **Issue**: [KT-45375](https://youtrack.jetbrains.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；Lambda 預設使用 `invokedynamic` 與 `LambdaMetafactory` 產生。

### 當需要運算式時，禁止只有一個分支的 if 條件

> **Issue**: [KT-57871](https://youtrack.jetbrains.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：若 `if` 條件只有一個分支時報告錯誤。

### 禁止透過傳遞泛型型別的星號投影來違反自我上限約束

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：當透過傳遞泛型型別的星號投影而違反自我上限約束時，報告錯誤。

### 在私有內嵌函式的傳回型別中近似匿名型別

> **Issue**: [KT-54862](https://youtrack.jetbrains.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0：如果推論出的傳回型別包含匿名型別，則在私有內嵌函式上報告警告。
> - 2.0.0：將此類私有內嵌函式的傳回型別近似為其基底型別。

### 變更多載解析行為，優先於區域擴充方法呼叫而非區域功能型別屬性的 invoke 慣例

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0：新的多載解析行為；函式呼叫會一致地優先於 invoke 慣例。

### 當因二進制相依性的基底型別變更而導致繼承成員衝突時報告錯誤

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0：在二進制相依性的基底型別發生繼承成員衝突的宣告上報告警告 CONFLICTING_INHERITED_MEMBERS_WARNING。
> - 2.0.0：將警告提升為錯誤：CONFLICTING_INHERITED_MEMBERS。

### 忽略不變型別參數上的 @UnsafeVariance 註解

> **Issue**: [KT-57609](https://youtrack.jetbrains.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；在報告型別不相符錯誤時，忽略 `@UnsafeVariance` 註解。

### 變更伴隨物件成員在呼叫外參考的型別

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20：當伴隨物件函式參考型別被推論為未繫結參考時，報告警告。
> - 2.0.0：變更行為，使伴隨物件函式參考在所有使用上下文中均被推論為已繫結參考。

### 禁止透過私有內嵌函式公開匿名型別

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0：對從私有內嵌函式回傳的匿名物件成員呼叫報告警告。
> - 2.0.0：將此類私有內嵌函式的傳回型別近似為其基底型別，且不解析對匿名物件成員的呼叫。

### 對 while 迴圈 break 後不合理的智慧轉型報告錯誤

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；可透過切換到語言版本 1.9 來恢復舊行為。

### 當交集型別的變數被指派一個非該交集型別子型別的值時，報告錯誤

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：當具有交集型別的變數被指派一個不是該交集型別子型別的值時，報告錯誤。

### 當使用 SAM 建構函式建構的介面包含需要 opt-in 的方法時，要求 opt-in

> **Issue**: [KT-52628](https://youtrack.jetbrains.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20：對透過 SAM 建構函式使用的 `OptIn` 報告警告。
> - 2.0.0：對透過 SAM 建構函式使用的 `OptIn` 將警告提升為錯誤（或者若 `OptIn` 標記嚴重級別為警告，則保持報告警告）。

### 禁止在型別別名建構函式中違反上限約束

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0：針對型別別名建構函式中違反上限約束的情況引入警告。
> - 2.0.0：在 K2 編譯器中將警告提升為錯誤。

### 使解構變數的實際型別與明確指定的型別保持一致

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；解構變數的實際型別現在與明確指定的型別（若有）保持一致。

### 呼叫具有需要 opt-in 的預設值參數型別的建構函式時，要求 opt-in

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20：對參數型別需要 opt-in 的建構函式呼叫報告警告。
> - 2.0.0：將警告提升為錯誤（或者若 `OptIn` 標記嚴重級別為警告，則保持報告警告）。

### 當同一作用域層級中存在同名的屬性與列舉成員時報告歧義

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20：當編譯器在同一作用域層級解析為屬性而非列舉成員時，報告警告。
> - 2.0.0：在 K2 編譯器中，當編譯器在同一作用域層級同時遇到同名的屬性與列舉成員時報告歧義（在舊編譯器中保持警告不變）。

### 變更限定詞解析行為，優先選擇伴隨屬性而非列舉成員

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新的解析行為；優先選擇伴隨屬性而非列舉成員。

### 依照去語法糖的形式解析 invoke 呼叫接收者型別與 invoke 函式型別

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：獨立解析 invoke 呼叫接收者型別與 invoke 函式型別，如同它們是以去語法糖的形式撰寫。

### 禁止透過非私有內嵌函式公開私有類別成員

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0：從內部內嵌函式呼叫私有類別伴隨物件成員時，報告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告。
> - 2.0.0：將此警告提升為 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 錯誤。

### 在投影泛型型別中修正明確非 null 型別的可 null 性

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；投影型別會考慮所有就地的非 null 型別。

### 變更前置遞增的推論型別，以符合 getter 的傳回型別而非 inc() 運算子的傳回型別

> **Issue**: [KT-57178](https://youtrack.jetbrains.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；前置遞增的推論型別改為符合 getter 的傳回型別，而非 `inc()` 運算子的傳回型別。

### 繼承宣告於基底類別中的泛型內部類別時，強制執行邊界檢查

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：當違反泛型內部基底類別型別參數的上限時，報告錯誤。

### 當預期型別是具有函式型別參數的函式型別時，禁止指派具有 SAM 型別的可呼叫參考

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：當預期型別是具有函式型別參數的函式型別時，對具有 SAM 型別的可呼叫參考報告編譯錯誤。

### 在伴隨物件的註解解析中考慮伴隨物件作用域

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；在伴隨物件的註解解析期間不再忽略伴隨物件作用域。

### 變更安全呼叫與慣例運算子組合的求值語意

> **Issue**: [KT-41034](https://youtrack.jetbrains.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0：對每個錯誤的呼叫報告警告。
> - 2.0.0：實作新的解析行為。

### 要求具有支援欄位與自訂 setter 的屬性必須立即初始化

> **Issue**: [KT-58589](https://youtrack.jetbrains.com/issue/KT-58589)
> 
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20：針對沒有主建構函數的情況引入 `MUST_BE_INITIALIZED` 警告。
> - 2.0.0：將警告提升為錯誤。

### 禁止在 invoke 運算子慣例呼叫中對任意運算式進行 Unit 轉換

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0：當 Unit 轉換應用於變數及 invoke 解析上的任意運算式時，報告錯誤；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 編譯器選項可針對受影響的運算式保持先前的行為。

### 當透過安全呼叫存取非 null Java 欄位時，禁止對其進行可 null 指派

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：若將可 null 值指派給非 null Java 欄位，則報告錯誤。

### 覆寫包含原始型別參數的 Java 方法時要求星號投影型別

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；禁止對原始型別參數進行覆寫。

### 當 V 具有伴隨物件時變更 (V)::foo 參考解析

> **Issue**: [KT-47313](https://youtrack.jetbrains.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0：對目前繫結至伴隨物件執行個體的可呼叫參考報告警告。
> - 2.0.0：實作新行為；在型別周圍加上圓括號不再使其成為對該型別伴隨物件執行個體的參考。

### 禁止在實質上公開的內嵌函式中隱式存取非公開 API

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20：在公開內嵌函式中存取隱式非公開 API 時報告編譯警告。
> - 2.0.0：將警告提升為錯誤。

### 禁止在屬性 getter 上使用使用點 get 註解

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0：在 getter 上的使用點 `get` 註解報告警告（在進步模式下為錯誤）。
> - 2.0.0：將警告提升為 `INAPPLICABLE_TARGET_ON_PROPERTY` 錯誤；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 可回復為警告。

### 防止在產生器推論 lambda 函式中將型別參數隱式推論為上限

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20：當型別引數的型別參數無法推論為宣告的上限時，報告警告（或在進步模式下為錯誤）。
> - 2.0.0：將警告提升為錯誤。

### 在公有簽章中近似區域型別時保留可 null 性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0：平台型別由平台基底型別近似；當宣告被推論為應為可 null 的非 null 型別時報告警告，提示明確指定型別以避免 NPE。
> - 2.0.0：可 null 型別由可 null 基底型別近似。

### 為了智慧轉型的目的，移除對 false && ... 與 false || ... 的特殊處理

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0：實作新行為；不再對 `false && ...` 與 `false || ...` 進行特殊處理。

### 禁止在列舉中定義內嵌開放函式

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0：在列舉中的內嵌開放函式上報告警告。
> - 2.0.0：將警告提升為錯誤。

## 工具 (Tools)

### Gradle 中的可見性變更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 先前，某些專用於特定 DSL 上下文的 Kotlin DSL 函式與屬性會意外洩漏到其他 DSL 上下文中。我們新增了 `@KotlinGradlePluginDsl` 註解，這能防止 Kotlin Gradle 外掛程式 DSL 函式與屬性暴露在非預期的層級。以下層級彼此隔離：
> * Kotlin 擴充套件 (extension)
> * Kotlin 目標 (target)
> * Kotlin 編譯 (compilation)
> * Kotlin 編譯任務 (compilation task)
>
> **Deprecation cycle**:
>
> - 2.0.0：對於大多數常見情況，如果您的組建指令碼設定不正確，編譯器會報告警告並提供修復建議；否則，編譯器會報告錯誤。

### 棄用 kotlinOptions DSL

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 透過 `kotlinOptions` DSL 與相關的 `KotlinCompile<KotlinOptions>` 任務介面設定編譯器選項的功能已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0：報告警告。

### 棄用 KotlinCompilation DSL 中的 compilerOptions

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 在 `KotlinCompilation` DSL 中設定 `compilerOptions` 屬性的功能已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0：報告警告。

### 棄用舊的 CInteropProcess 處理方式

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` 任務與 `CInteropSettings` 類別現在使用 `definitionFile` 屬性，而非 `defFile` 與 `defFileProperty`。
> 
> 這消除了在 `defFile` 是動態產生的情況下，於 `CInteropProcess` 任務與產生 `defFile` 的任務之間手動新增額外 `dependsOn` 關係的需求。
> 
> 在 Kotlin/Native 專案中，Gradle 現在會在組建過程中較晚執行的相關任務完成後，才延遲驗證 `definitionFile` 屬性的存在。
>
> **Deprecation cycle**:
>
> - 2.0.0：`defFile` 與 `defFileProperty` 參數已被棄用。
> - 2.4.0：[對已過時的 `defFile` 屬性報告錯誤](compatibility-guide-24.md#report-errors-for-obsolete-kotlin-native-gradle-task-apis)。

### 移除 kotlin.useK2 Gradle 屬性

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradle 屬性已被移除。在 Kotlin 1.9.* 中，它可用於啟用 K2 編譯器。在 Kotlin 2.0.0 及更高版本中，K2 編譯器預設為啟用，因此該屬性沒有作用，且無法用於切換回先前的編譯器。
>
> **Deprecation cycle**:
>
> - 1.8.20：`kotlin.useK2` Gradle 屬性被棄用。
> - 2.0.0：`kotlin.useK2` Gradle 屬性被移除。

### 移除已棄用的平台外掛程式 ID

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 已移除對下列平台外掛程式 ID 的支援：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3：平台外掛程式 ID 被棄用。
> - 2.0.0：平台外掛程式 ID 不再受支援。

### 移除 outputFile JavaScript 編譯器選項

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScript 編譯器選項已被移除。相反地，您可以使用 `Kotlin2JsCompile` 任務的 `destinationDirectory` 屬性來指定編譯後的 JavaScript 輸出檔案撰寫目錄。
>
> **Deprecation cycle**:
>
> - 1.9.25：`outputFile` 編譯器選項被棄用。
> - 2.0.0：`outputFile` 編譯器選項被移除。