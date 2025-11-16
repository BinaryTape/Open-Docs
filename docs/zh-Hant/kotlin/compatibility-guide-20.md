[//]: # (title: Kotlin 2.0.x 兼容性指南)

_[讓語言保持現代化 (Keeping the Language Modern)](kotlin-evolution-principles.md)_ 和 _[舒適的更新 (Comfortable Updates)](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出阻礙語言演進的結構應被移除，後者則要求此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新的變更日誌或編譯器警告）發布，但本文件提供了一份從 Kotlin 1.9 遷移至 Kotlin 2.0 的完整參考。

> Kotlin K2 編譯器作為 Kotlin 2.0 的一部分被引入。有關新編譯器的好處、遷移過程中可能遇到的變更以及如何回溯到舊版編譯器的資訊，請參閱 [K2 編譯器遷移指南](k2-compiler-migration-guide.md)。
>
{style="note"}

## 基本術語

在本文件中，我們介紹了幾種兼容性：

- _源 (source)_：源不兼容變更會導致原本能正常編譯（無錯誤或警告）的程式碼不再編譯。
- _二進制 (binary)_：如果兩個二進制工件在互換後不會導致加載或連結錯誤，則稱它們為二進制兼容。
- _行為 (behavioral)_：如果同一程式在應用變更前後展現出不同的行為，則稱該變更為行為不兼容。

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如，從 Java）來看的 Kotlin 程式碼兼容性不在本文檔的範圍內。

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

### 棄用對投射接收者使用合成設定器

> **Issue**: [KT-54309](https://youtrack.jetbrains.com/issue/KT-54309)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果您使用 Java 類別的合成設定器來賦值一個與該類別的投射類型衝突的類型，將觸發錯誤。
>
> **Deprecation cycle**:
>
> - 1.8.20: 當合成屬性設定器在逆變位置具有投射參數類型，導致呼叫點引數類型不兼容時，報告警告。
> - 2.0.0: 將警告提升為錯誤。

### 在 Java 子類中重載的函式，當呼叫帶有內聯類別參數的函式時，修正名稱修飾

> **Issue**: [KT-56545](https://youtrack.jetbrains.com/issue/KT-56545)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 在函式調用中使用正確的名稱修飾行為；要恢復到之前的行為，請使用 `-XXLanguage:-MangleCallsToJavaMethodsWithValueClasses` 編譯器選項。

### 修正逆變捕獲類型的類型近似演算法

> **Issue**: [KT-49404](https://youtrack.com/issue/KT-49404)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 對有問題的呼叫報告警告。
> - 2.0.0: 將警告提升為錯誤。

### 禁止在屬性初始化前存取屬性值

> **Issue**: [KT-56408](https://youtrack.com/issue/KT-56408)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當屬性在受影響的上下文中初始化前被存取時，報告錯誤。

### 報告導入類別中名稱相同時的歧義錯誤

> **Issue**: [KT-57750](https://youtrack.jetbrains.com/issue/KT-57750)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當解析一個在多個透過星號導入的套件中存在的類別名稱時，報告錯誤。

### 預設透過 invokedynamic 和 LambdaMetafactory 生成 Kotlin lambda 表達式

> **Issue**: [KT-45375](https://youtrack.com/issue/KT-45375)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；lambda 表達式預設使用 `invokedynamic` 和 `LambdaMetafactory` 生成。

### 當需要表達式時，禁止 if 條件只有一個分支

> **Issue**: [KT-57871](https://youtrack.com/issue/KT-57871)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 在 `if` 條件只有一個分支的情況下報告錯誤。

### 禁止透過傳遞泛型類型的星號投射來違反自身上界

> **Issue**: [KT-61718](https://youtrack.jetbrains.com/issue/KT-61718)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當透過傳遞泛型類型的星號投射違反自身上界時，報告錯誤。

### 近似私有內聯函式返回類型中的匿名類型

> **Issue**: [KT-54862](https://youtrack.com/issue/KT-54862)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 當推斷的返回類型包含匿名類型時，對私有內聯函式報告警告。
> - 2.0.0: 將此類私有內聯函式的返回類型近似為超類型。

### 變更重載解析行為，優先考慮局部擴展函式呼叫而非局部函式類型屬性的調用慣例

> **Issue**: [KT-37592](https://youtrack.jetbrains.com/issue/KT-37592)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 新的重載解析行為；函式呼叫始終優先於調用慣例。

### 當由於二進制依賴中的超類型變更而導致繼承成員衝突時，報告錯誤

> **Issue**: [KT-51194](https://youtrack.jetbrains.com/issue/KT-51194)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.0: 當二進制依賴中的超類型發生繼承成員衝突時，對聲明報告警告 CONFLICTING_INHERITED_MEMBERS_WARNING。
> - 2.0.0: 將警告提升為錯誤：CONFLICTING_INHERITED_MEMBERS。

### 忽略不變類型中參數上的 @UnsafeVariance 註解

> **Issue**: [KT-57609](https://youtrack.com/issue/KT-57609)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；當報告逆變參數中類型不匹配的錯誤時，`@UnsafeVariance` 註解將被忽略。

### 變更伴隨物件成員的外部呼叫引用的類型

> **Issue**: [KT-54316](https://youtrack.jetbrains.com/issue/KT-54316)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 當伴隨物件函式引用類型被推斷為未綁定引用時，報告警告。
> - 2.0.0: 變更行為，使伴隨物件函式引用在所有使用上下文中被推斷為綁定引用。

### 禁止從私有內聯函式暴露匿名類型

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.3.0: 對於從私有內聯函式返回的匿名物件的自身成員呼叫報告警告。
> - 2.0.0: 將此類私有內聯函式的返回類型近似為超類型，且不解析對匿名物件成員的呼叫。

### 在 while 循環中斷後，對不健全的智能轉換報告錯誤

> **Issue**: [KT-22379](https://youtrack.jetbrains.com/issue/KT-22379)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；舊行為可以透過切換到語言版本 1.9 來恢復。

### 當交集類型的變數被賦予的值不是該交集類型的子類型時，報告錯誤

> **Issue**: [KT-53752](https://youtrack.jetbrains.com/issue/KT-53752)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當具有交集類型的變數被賦予的值不是該交集類型的子類型時，報告錯誤。

### 當透過 SAM 構造函數構建的介面包含需要選擇啟用的方法時，要求選擇啟用

> **Issue**: [KT-52628](https://youtrack.com/issue/KT-52628)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 對於透過 SAM 構造函數使用 `OptIn` 的情況報告警告。
> - 2.0.0: 對於透過 SAM 構造函數使用 `OptIn` 的情況，將警告提升為錯誤（如果 `OptIn` 標記嚴重性為警告，則保持報告警告）。

### 禁止類型別名構造函數中的上界違反

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 對於類型別名構造函數中違反上界的情況引入警告。
> - 2.0.0: 在 K2 編譯器中將警告提升為錯誤。

### 使解構變數的實際類型與指定時的顯式類型保持一致

> **Issue**: [KT-57011](https://youtrack.jetbrains.com/issue/KT-57011)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；當指定時，解構變數的實際類型現在與顯式類型保持一致。

### 當呼叫的構造函數具有需要選擇啟用的預設值參數類型時，要求選擇啟用

> **Issue**: [KT-55111](https://youtrack.jetbrains.com/issue/KT-55111)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 對於具有需要選擇啟用參數類型的構造函數呼叫報告警告。
> - 2.0.0: 將警告提升為錯誤（如果 `OptIn` 標記嚴重性為警告，則保持報告警告）。

### 在相同作用域級別下，當屬性和列舉條目同名時，報告歧義錯誤

> **Issue**: [KT-52802](https://youtrack.jetbrains.com/issue/KT-52802)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 當編譯器解析到屬性而非相同作用域級別的列舉條目時，報告警告。
> - 2.0.0: 在 K2 編譯器中，當編譯器在相同作用域級別遇到同名的屬性和列舉條目時，報告歧義（在舊版編譯器中保持警告不變）。

### 變更限定符解析行為，優先選擇伴隨屬性而非列舉條目

> **Issue**: [KT-47310](https://youtrack.jetbrains.com/issue/KT-47310)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新的解析行為；伴隨屬性優先於列舉條目。

### 解析調用接收者類型和調用函式類型，如同它們以去糖化形式編寫一樣

> **Issue**: [KT-58260](https://youtrack.jetbrains.com/issue/KT-58260)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 獨立解析調用呼叫接收者類型和調用函式類型，如同它們以去糖化形式編寫一樣。

### 禁止透過非私有內聯函式暴露私有類別成員

> **Issue**: [KT-55179](https://youtrack.jetbrains.com/issue/KT-55179)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 當從內部內聯函式呼叫私有類別伴隨物件成員時，報告 `PRIVATE_CLASS_MEMBER_FROM_INLINE_WARNING` 警告。
> - 2.0.0: 將此警告提升為 `PRIVATE_CLASS_MEMBER_FROM_INLINE` 錯誤。

### 修正投射泛型類型中確定非空類型的可空性

> **Issue**: [KT-54663](https://youtrack.jetbrains.com/issue/KT-54663)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；投射類型將考慮所有就地非空類型。

### 變更前綴遞增的推斷類型，使其與 getter 的返回類型匹配，而非 inc() 運算子的返回類型

> **Issue**: [KT-57178](https://youtrack.com/issue/KT-57178)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；前綴遞增的推斷類型已變更為匹配 getter 的返回類型，而非 `inc()` 運算子的返回類型。

### 繼承超類中聲明的泛型內部類別時，強制執行邊界檢查

> **Issue**: [KT-61749](https://youtrack.jetbrains.com/issue/KT-61749)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當違反泛型內部超類別的類型參數上界時，報告錯誤。

### 禁止將帶有 SAM 類型的可呼叫引用賦值給預期類型為帶有函式類型參數的函式類型

> **Issue**: [KT-64342](https://youtrack.jetbrains.com/issue/KT-64342)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當帶有 SAM 類型的可呼叫引用，而預期類型為帶有函式類型參數的函式類型時，報告編譯錯誤。

### 在伴隨物件上的註解解析中考慮伴隨物件作用域

> **Issue**: [KT-64299](https://youtrack.jetbrains.com/issue/KT-64299)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；在伴隨物件上的註解解析期間，伴隨物件作用域將不再被忽略。

### 變更安全呼叫和慣例運算子組合的求值語義

> **Issue**: [KT-41034](https://youtrack.com/issue/KT-41034)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.4.0: 對每個不正確的呼叫報告警告。
> - 2.0.0: 實施新的解析行為。

### 要求帶有支持欄位和自定義設定器的屬性立即初始化

> **Issue**: [KT-58589](https://youtrack.com/issue/KT-58589)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.9.20: 對於沒有主構造函數的情況引入 `MUST_BE_INITIALIZED` 警告。
> - 2.0.0: 將警告提升為錯誤。

### 禁止在調用運算子慣例呼叫中對任意表達式進行 Unit 轉換

> **Issue**: [KT-61182](https://youtrack.jetbrains.com/issue/KT-61182)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 2.0.0: 當 Unit 轉換應用於變數和調用解析中的任意表達式時，報告錯誤；使用 `-XXLanguage:+UnitConversionsOnArbitraryExpressions` 編譯器選項可保留受影響表達式的先前行為。

### 禁止在安全呼叫存取 Java 欄位時，將可空值賦值給非空 Java 欄位

> **Issue**: [KT-62998](https://youtrack.jetbrains.com/issue/KT-62998)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 當將可空值賦值給非空 Java 欄位時，報告錯誤。

### 覆寫包含原始類型參數的 Java 方法時，要求星號投射類型

> **Issue**: [KT-57600](https://youtrack.jetbrains.com/issue/KT-57600)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；對於原始類型參數禁止覆寫。

### 變更 (V)::foo 引用解析，當 V 具有伴隨物件時

> **Issue**: [KT-47313](https://youtrack.com/issue/KT-47313)
>
> **Component**: Core language
>
> **Incompatible change type**: behavioral
>
> **Deprecation cycle**:
>
> - 1.6.0: 對於目前綁定到伴隨物件實例的可呼叫引用報告警告。
> - 2.0.0: 實施新行為；在類型周圍添加圓括號不再使其成為該類型伴隨物件實例的引用。

### 禁止在實際上的公共內聯函式中隱式存取非公共 API

> **Issue**: [KT-54997](https://youtrack.jetbrains.com/issue/KT-54997)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.20: 當在公共內聯函式中隱式存取非公共 API 時，報告編譯警告。
> - 2.0.0: 將警告提升為錯誤。

### 禁止在屬性 getter 上使用點 get 註解

> **Issue**: [KT-57422](https://youtrack.jetbrains.com/issue/KT-57422)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.9.0: 在 getter 上使用點 `get` 註解時報告警告（在漸進模式下為錯誤）。
> - 2.0.0: 將警告提升為 `INAPPLICABLE_TARGET_ON_PROPERTY` 錯誤；使用 `-XXLanguage:-ProhibitUseSiteGetTargetAnnotations` 可恢復為警告。

### 防止在構建器推斷 lambda 函式中將類型參數隱式推斷為上界

> **Issue**: [KT-47986](https://youtack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.7.20: 當類型引數的類型參數無法推斷為聲明的上界時，報告警告（或在漸進模式下為錯誤）。
> - 2.0.0: 將警告提升為錯誤。

### 在公共簽名中近似局部類型時保持可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 彈性類型由彈性超類型近似；當聲明被推斷為非空類型但應為可空類型時，報告警告，提示明確指定類型以避免 NPEs。
> - 2.0.0: 可空類型由可空超類型近似。

### 移除 `false && ...` 和 `false || ...` 在智能轉換目的中的特殊處理

> **Issue**: [KT-65776](https://youtrack.jetbrains.com/issue/KT-65776)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 2.0.0: 實施新行為；對 `false && ...` 和 `false || ...` 沒有特殊處理。

### 禁止列舉中的內聯開放函式

> **Issue**: [KT-34372](https://youtrack.jetbrains.com/issue/KT-34372)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Deprecation cycle**:
>
> - 1.8.0: 對列舉中的內聯開放函式報告警告。
> - 2.0.0: 將警告提升為錯誤。

## 工具

### Gradle 中的可見性變更

> **Issue**: [KT-64653](https://youtrack.jetbrains.com/issue/KT-64653)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 以前，某些原本用於特定 DSL 上下文的 Kotlin DSL 函式和屬性會無意中洩漏到其他 DSL 上下文。我們添加了 `@KotlinGradlePluginDsl` 註解，它阻止了 Kotlin Gradle 外掛程式 DSL 函式和屬性暴露到它們不應可用的層級。以下層級彼此獨立：
> * Kotlin extension
> * Kotlin target
> * Kotlin compilation
> * Kotlin compilation task
>
> **Deprecation cycle**:
>
> - 2.0.0: 對於大多數常見情況，如果您的建置腳本配置不正確，編譯器會報告警告並提供修復建議；否則，編譯器會報告錯誤。

### 棄用 kotlinOptions DSL

> **Issue**: [KT-63419](https://youtrack.jetbrains.com/issue/KT-63419)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 透過 `kotlinOptions` DSL 和相關的 `KotlinCompile<KotlinOptions>` 任務介面配置編譯器選項的功能已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 報告警告。

### 棄用 compilerOptions 在 KotlinCompilation DSL 中的使用

> **Issue**: [KT-65568](https://youtrack.jetbrains.com/issue/KT-65568)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 在 `KotlinCompilation` DSL 中配置 `compilerOptions` 屬性的功能已被棄用。
>
> **Deprecation cycle**:
>
> - 2.0.0: 報告警告。

### 棄用 CInteropProcess 處理的舊方法

> **Issue**: [KT-62795](https://youtrack.jetbrains.com/issue/KT-62795)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `CInteropProcess` 任務和 `CInteropSettings` 類別現在使用 `definitionFile` 屬性而非 `defFile` 和 `defFileProperty`。
>
> 這消除了當 `defFile` 動態生成時，需要在 `CInteropProcess` 任務和生成 `defFile` 的任務之間添加額外的 `dependsOn` 關係。
>
> 在 Kotlin/Native 專案中，Gradle 現在會在連接任務在建置過程後期運行後，延遲驗證 `definitionFile` 屬性的存在。
>
> **Deprecation cycle**:
>
> - 2.0.0: `defFile` 和 `defFileProperty` 參數已棄用。

### 移除 kotlin.useK2 Gradle 屬性

> **Issue**: [KT-64379](https://youtrack.jetbrains.com/issue/KT-64379)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: `kotlin.useK2` Gradle 屬性已被移除。在 Kotlin 1.9.* 中，它可以用來啟用 K2 編譯器。在 Kotlin 2.0.0 及更高版本中，K2 編譯器預設啟用，因此該屬性無效，也不能用於切換回舊版編譯器。
>
> **Deprecation cycle**:
>
> - 1.8.20: `kotlin.useK2` Gradle 屬性已棄用。
> - 2.0.0: `kotlin.useK2` Gradle 屬性已移除。

### 移除棄用的平台外掛程式 ID

> **Issue**: [KT-65187](https://youtrack.jetbrains.com/issue/KT-65187)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 對這些平台外掛程式 ID 的支持已被移除：
> * `kotlin-platform-android`
> * `kotlin-platform-jvm`
> * `kotlin-platform-js`
> * `org.jetbrains.kotlin.platform.android`
> * `org.jetbrains.kotlin.platform.jvm`
> * `org.jetbrains.kotlin.platform.js`
>
> **Deprecation cycle**:
>
> - 1.3: 平台外掛程式 ID 已棄用。
> - 2.0.0: 平台外掛程式 ID 不再受支持。

### 移除 outputFile JavaScript 編譯器選項

> **Issue**: [KT-61116](https://youtrack.jetbrains.com/issue/KT-61116)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `outputFile` JavaScript 編譯器選項已被移除。您可以改用 `Kotlin2JsCompile` 任務的 `destinationDirectory` 屬性來指定編譯後的 JavaScript 輸出檔案寫入的目錄。
>
> **Deprecation cycle**:
>
> - 1.9.25: `outputFile` 編譯器選項已棄用。
> - 2.0.0: `outputFile` 編譯器選項已移除。