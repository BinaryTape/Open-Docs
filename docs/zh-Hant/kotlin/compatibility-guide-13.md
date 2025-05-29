[//]: # (title: Kotlin 1.3 相容性指南)

_「保持語言現代化」_ 與 _「舒適的更新」_ 是 Kotlin 語言設計中的基本原則。前者表示應移除阻礙語言演進的結構，後者則表示此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）發布，但本文件將其全部彙整，為從 Kotlin 1.2 遷移到 Kotlin 1.3 提供完整的參考。

## 基本術語

本文件介紹了幾種相容性類型：

- *原始碼不相容 (Source)*：原始碼不相容變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼不再能編譯。
- *二進位碼不相容 (Binary)*：如果兩個二進位程式碼組件互相替換不會導致載入或連結錯誤，則稱它們為二進位碼相容。
- *行為不相容 (Behavioral)*：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin 而言。從其他語言（例如 Java）角度看 Kotlin 程式碼的相容性不在本文件範圍內。

## 不相容變更

### 建構函式引數關於 `<clinit>` 呼叫的評估順序

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **Component**: Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡要摘要**：在 1.3 版中，關於類別初始化的評估順序已變更。
>
> **Deprecation cycle**：
>
> - <1.3：舊有行為（詳情請參閱 Issue）
> - >= 1.3：行為已變更，
> ` -Xnormalize-constructor-calls=disable` 可以暫時恢復到 1.3 版之前的行為。對此標誌的支援將在下一個主要版本中移除。

### 註解建構函式參數上缺少 getter 目標註解

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **Component**: Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡要摘要**：在 1.3 版中，註解建構函式參數上的 getter 目標註解將正確寫入類別檔案。
>
> **Deprecation cycle**：
>
> - <1.3：註解建構函式參數上的 getter 目標註解未被套用
> - >=1.3：註解建構函式參數上的 getter 目標註解已正確套用並寫入生成的程式碼

### 類別建構函式的 @get: 註解中缺少錯誤報告

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：在 1.3 版中，getter 目標註解中的錯誤將被正確報告。
>
> **Deprecation cycle**：
>
> - <1.2：getter 目標註解中的編譯錯誤未被報告，導致不正確的程式碼也能正常編譯。
> - 1.2.x：錯誤僅由工具報告，編譯器仍會編譯此類程式碼而沒有任何警告。
> - >=1.3：編譯器也會報告錯誤，導致錯誤的程式碼被拒絕。

### 存取帶有 @NotNull 註解的 Java 類型時的空值斷言

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **Component**: Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡要摘要**：對於帶有非空註解的 Java 類型，空值斷言將更積極地生成，導致在此處傳遞 `null` 的程式碼更快地失敗。
>
> **Deprecation cycle**：
>
> - <1.3：當涉及類型推斷時，編譯器可能會遺漏此類斷言，允許在針對二進位碼編譯期間潛在的 `null` 傳播（詳情請參閱 Issue）。
> - >=1.3：編譯器會生成遺漏的斷言。這可能導致在此處（錯誤地）傳遞 `null` 的程式碼更快地失敗。
> ` -XXLanguage:-StrictJavaNullabilityAssertions` 可以暫時恢復到 1.3 版之前的行為。對此標誌的支援將在下一個主要版本中移除。

### 列舉成員上的不健全智慧型轉換

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：對一個列舉項目成員的智慧型轉換將僅正確地套用至該列舉項目。
>
> **Deprecation cycle**：
>
> - <1.3：對一個列舉項目成員的智慧型轉換可能導致對其他列舉項目的相同成員進行不健全的智慧型轉換。
> - >=1.3：智慧型轉換將僅正確地套用至一個列舉項目的成員。
> ` -XXLanguage:-SoundSmartcastForEnumEntries` 將暫時恢復舊有行為。對此標誌的支援將在下一個主要版本中移除。

### getter 中 `val` 支援欄位的重新賦值

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：現在禁止在 getter 中重新賦值 `val` 屬性的支援欄位。
>
> **Deprecation cycle**：
>
> - <1.2：Kotlin 編譯器允許在 getter 中修改 `val` 的支援欄位。這不僅違反 Kotlin 語義，還會生成表現不佳的 JVM 位元組碼，重新賦值 `final` 欄位。
> - 1.2.X：針對重新賦值 `val` 支援欄位的程式碼報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 在 for 迴圈迭代之前捕獲陣列

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **Component**: Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：如果 for 迴圈範圍中的表達式是在迴圈體中更新的局部變數，此變更會影響迴圈執行。這與迭代其他容器（例如範圍、字元序列和集合）的行為不一致。
>
> **Deprecation cycle**：
>
> - <1.2：所述程式碼模式能正常編譯，但對局部變數的更新會影響迴圈執行。
> - 1.2.X：如果 for 迴圈中的範圍表達式是陣列類型的局部變數，且在迴圈體中被賦值，則報告棄用警告。
> - 1.3：在這種情況下改變行為，使其與其他容器保持一致。

### 列舉項目中的巢狀分類器

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，列舉項目中的巢狀分類器（類別、物件、介面、註解類別、列舉類別）被禁止。
>
> **Deprecation cycle**：
>
> - <1.2：列舉項目中的巢狀分類器能正常編譯，但可能會在執行時因例外而失敗。
> - 1.2.X：針對巢狀分類器報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 資料類別覆寫 `copy`

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，禁止資料類別覆寫 `copy()`。
>
> **Deprecation cycle**：
>
> - <1.2：覆寫 `copy()` 的資料類別能正常編譯，但可能會在執行時失敗或表現出奇怪的行為。
> - 1.2.X：針對覆寫 `copy()` 的資料類別報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 繼承 Throwable 並從外部類別捕獲泛型參數的內部類別

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，不允許內部類別繼承 `Throwable`。
>
> **Deprecation cycle**：
>
> - <1.2：繼承 `Throwable` 的內部類別能正常編譯。如果此類內部類別碰巧捕獲泛型參數，可能導致在執行時失敗的奇怪程式碼模式。
> - 1.2.X：針對繼承 `Throwable` 的內部類別報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 關於帶有伴生物件的複雜類別繼承結構的可見性規則

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，對於涉及伴生物件和巢狀分類器的複雜類別繼承結構，短名稱的可見性規則變得更嚴格。
>
> **Deprecation cycle**：
>
> - <1.2：舊有可見性規則（詳情請參閱 Issue）
> - 1.2.X：針對不再可存取的短名稱報告棄用警告。工具建議透過添加完整名稱進行自動遷移。
> - >=1.3：棄用警告升級為錯誤。違規程式碼應添加完整的限定符或明確的匯入。

### 非常數的變長引數註解參數

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，禁止將非常數值設定為變長引數註解參數。
>
> **Deprecation cycle**：
>
> - <1.2：編譯器允許為變長引數註解參數傳遞非常數值，但實際上在位元組碼生成期間會丟棄該值，導致不明顯的行為。
> - 1.2.X：針對此類程式碼模式報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 局部註解類別

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，不再支援局部註解類別。
>
> **Deprecation cycle**：
>
> - <1.2：編譯器能正常編譯局部註解類別。
> - 1.2.X：針對局部註解類別報告棄用警告。
> - >=1.3：棄用警告升級為錯誤。

### 局部委託屬性上的智慧型轉換

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，不允許對局部委託屬性進行智慧型轉換。
>
> **Deprecation cycle**：
>
> - <1.2：編譯器允許對局部委託屬性進行智慧型轉換，這在委託表現不佳的情況下可能導致不健全的智慧型轉換。
> - 1.2.X：局部委託屬性上的智慧型轉換被報告為已棄用（編譯器發出警告）。
> - >=1.3：棄用警告升級為錯誤。

### `mod` 運算子慣例

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，禁止宣告 `mod` 運算子，以及解析為此類宣告的呼叫。
>
> **Deprecation cycle**：
>
> - 1.1.X, 1.2.X：針對 `operator mod` 的宣告以及解析為它的呼叫報告警告。
> - 1.3.X：將警告升級為錯誤，但仍允許解析到 `operator mod` 宣告。
> - 1.4.X：不再解析對 `operator mod` 的呼叫。

### 以具名形式將單一元素傳遞給變長引數

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589)。另請參閱 [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：在 Kotlin 1.3 中，將單一元素賦值給變長引數已被棄用，應替換為連續的展開運算子和陣列建構。
>
> **Deprecation cycle**：
>
> - <1.2：以具名形式將單一值元素賦值給變長引數能正常編譯，並被視為將*單一*元素賦值給陣列，導致在將陣列賦值給變長引數時出現不明顯的行為。
> - 1.2.X：針對此類賦值報告棄用警告，建議使用者切換到連續的展開運算子和陣列建構。
> - 1.3.X：警告升級為錯誤。
> - >= 1.4：變更將單一元素賦值給變長引數的語義，使陣列的賦值等同於陣列展開運算子的賦值。

### 目標為 EXPRESSION 的註解的保留策略

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，對於目標為 `EXPRESSION` 的註解，僅允許使用 `SOURCE` 保留策略。
>
> **Deprecation cycle**：
>
> - <1.2：允許目標為 `EXPRESSION` 且保留策略非 `SOURCE` 的註解，但在使用處會被靜默忽略。
> - 1.2.X：針對此類註解的宣告報告棄用警告。
> - >=1.3：警告升級為錯誤。

### 目標為 PARAMETER 的註解不應適用於參數的類型

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **元件**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡要摘要**：自 Kotlin 1.3 起，當目標為 `PARAMETER` 的註解應用於參數類型時，將正確報告有關錯誤註解目標的錯誤。
>
> **Deprecation cycle**：
>
> - <1.2：上述程式碼模式能正常編譯；註解會被靜默忽略，並且不存在於位元組碼中。
> - 1.2.X：針對此類用法報告棄用警告。
> - >=1.3：警告升級為錯誤。

### 當索引超出範圍時，`Array.copyOfRange` 會拋出例外，而不是擴大返回的陣列

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **Component**: kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為
>
> **簡要摘要**：自 Kotlin 1.3 起，確保 `Array.copyOfRange` 的 `toIndex` 引數（表示要複製範圍的獨佔結束索引）不大於陣列大小，如果大於則拋出 `IllegalArgumentException`。
>
> **Deprecation cycle**：
>
> - <1.3：如果在呼叫 `Array.copyOfRange` 時，`toIndex` 大於陣列大小，則範圍中缺少的元素將用 `null` 填充，這違反了 Kotlin 類型系統的健全性。
> - >=1.3：檢查 `toIndex` 是否在陣列邊界內，如果不在則拋出例外。

### 禁止使用步長為 `Int.MIN_VALUE` 和 `Long.MIN_VALUE` 的整數和長整數進程，也不允許其被實例化

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **Component**: kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為
>
> **簡要摘要**：自 Kotlin 1.3 起，禁止整數進程的步長值為其整數類型（`Long` 或 `Int`）的最小負值，因此呼叫 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 將會拋出 `IllegalArgumentException`。
>
> **Deprecation cycle**：
>
> - <1.3：可以創建一個步長為 `Int.MIN_VALUE` 的 `IntProgression`，它會產生兩個值 `[0, -2147483648]`，這是一種不明顯的行為。
> - >=1.3：如果步長是其整數類型的最小負值，則拋出 `IllegalArgumentException`。

### 檢查非常長序列操作中的索引溢位

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **Component**: kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為
>
> **簡要摘要**：自 Kotlin 1.3 起，確保 `index`、`count` 和類似方法不會在長序列中溢位。受影響方法的完整列表請參閱 Issue。
>
> **Deprecation cycle**：
>
> - <1.3：在非常長的序列上呼叫此類方法可能由於整數溢位而產生負數結果。
> - >=1.3：在此類方法中檢測溢位並立即拋出例外。

### 統一在各平台下以空匹配正規表達式進行分割的結果

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **Component**: kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為
>
> **簡要摘要**：自 Kotlin 1.3 起，統一在所有平台下以空匹配正規表達式進行 `split` 方法的行為。
>
> **Deprecation cycle**：
>
> - <1.3：當比較 JS、JRE 6、JRE 7 與 JRE 8+ 時，所述呼叫的行為不同。
> - >=1.3：統一跨平台的行為。

### 編譯器發行版中已棄用的組件已停止支援

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **元件**：其他
>
> **不相容變更類型**：二進位碼
>
> **簡要摘要**：Kotlin 1.3 停止支援以下已棄用的二進位組件：
> - `kotlin-runtime`：請改用 `kotlin-stdlib`
> - `kotlin-stdlib-jre7/8`：請改用 `kotlin-stdlib-jdk7/8`
> - 編譯器發行版中的 `kotlin-jslib`：請改用 `kotlin-stdlib-js`
>
> **Deprecation cycle**：
>
> - 1.2.X：這些組件被標記為已棄用，編譯器在使用這些組件時會報告警告。
> - >=1.3：這些組件已停止支援。

### 標準庫中的註解

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **Component**: kotlin-stdlib (JVM)
>
> **不相容變更類型**：二進位碼
>
> **簡要摘要**：Kotlin 1.3 從標準庫中移除了 `org.jetbrains.annotations` 套件中的註解，並將它們移動到編譯器附帶的獨立組件中：`annotations-13.0.jar` 和 `mutability-annotations-compat.jar`。
>
> **Deprecation cycle**：
>
> - <1.3：註解隨標準庫組件一起發布。
> - >=1.3：註解以獨立組件形式發布。