---
title: "Kotlin 1.3 相容性指南"
---
_[保持語言現代化](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則。前者指出，應移除阻礙語言演進的結構，而後者指出，應事先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）宣布，但本文總結了所有這些變更，為從 Kotlin 1.2 遷移到 Kotlin 1.3 提供了完整的參考。

## 基本術語

在本文中，我們介紹了幾種相容性：

- *原始碼 (Source)*：原始碼不相容的變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再也無法編譯
- *二進位 (Binary)*：如果交換兩個二進位成品不會導致載入或連結錯誤，則稱它們是二進位相容的
- *行為 (Behavioral)*：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純 Kotlin。從其他語言（例如 Java）的角度來看，Kotlin 程式碼的相容性不在本文的範圍之內。

## 不相容變更

### 關於 &lt;clinit&gt; 呼叫的建構函式參數的評估順序

> **問題**：[KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型**：行為 (behavioral)
>
> **簡短摘要**：1.3 中類別初始化的評估順序已變更
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：舊行為（請參閱問題中的詳細資訊）
> - &gt;= 1.3：行為已變更，可以使用 `-Xnormalize-constructor-calls=disable` 暫時恢復到 1.3 之前的行為。下一個主要版本將移除對此標誌的支援。

### 註解建構函式參數上缺少 getter 目標的註解

> **問題**：[KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型**：行為 (behavioral)
>
> **簡短摘要**：1.3 中，註解建構函式參數上的 getter 目標註解將正確寫入 classfiles
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：未應用註解建構函式參數上的 getter 目標註解
> - &gt;=1.3：正確應用註解建構函式參數上的 getter 目標註解，並將其寫入產生的程式碼

### 類別建構函式的 @get: 註解中缺少錯誤

> **問題**：[KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：1.3 中將正確報告 getter 目標註解中的錯誤
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：未報告 getter 目標註解中的編譯錯誤，導致錯誤的程式碼可以正常編譯。
> - 1.2.x：僅由工具報告錯誤，編譯器仍然編譯此類程式碼，沒有任何警告
> - &gt;=1.3：編譯器也會報告錯誤，導致拒絕錯誤的程式碼

### 對使用 @NotNull 註解的 Java 類型進行空值斷言

> **問題**：[KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型**：行為 (Behavioral)
>
> **簡短摘要**：將更積極地產生使用 not-null 註解註解的 Java 類型的空值斷言，導致在此處傳遞 `null` 的程式碼更快地失敗。
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：當涉及類型推斷時，編譯器可能會遺漏此類斷言，從而允許在針對二進位檔進行編譯期間潛在的 `null` 傳播（請參閱問題以獲取詳細資訊）。
> - &gt;=1.3：編譯器產生遺漏的斷言。這可能會導致（錯誤地）在此處傳遞 `null` 的程式碼更快地失敗。可以使用 `-XXLanguage:-StrictJavaNullabilityAssertions` 暫時恢復到 1.3 之前的行為。下一個主要版本將移除對此標誌的支援。

### 列舉成員上不健全的智慧轉換

> **問題**：[KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：一個列舉條目的成員上的智慧轉換將正確地僅應用於此列舉條目
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：一個列舉條目的成員上的智慧轉換可能導致在其他列舉條目的相同成員上進行不健全的智慧轉換。
> - &gt;=1.3：智慧轉換將僅正確地應用於一個列舉條目的成員。`-XXLanguage:-SoundSmartcastForEnumEntries` 將暫時恢復舊行為。下一個主要版本將移除對此標誌的支援。

### getter 中 val 後端欄位的重新賦值

> **問題**：[KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **元件 (Components)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：現在禁止在其 getter 中重新賦值 `val` 屬性的後端欄位
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：Kotlin 編譯器允許修改其 getter 中 `val` 的後端欄位。這不僅違反了 Kotlin 語義，還產生了行為不佳的 JVM 位元組碼，該位元組碼重新賦值了 `final` 欄位。
> - 1.2.X：在重新賦值 `val` 的後端欄位的程式碼上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 在 for 迴圈迭代之前捕獲陣列

> **問題**：[KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **元件 (Component)**：Kotlin/JVM
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：如果 for 迴圈範圍中的表達式是在迴圈主體中更新的區域變數，則此變更會影響迴圈執行。這與迭代其他容器（例如範圍、字元序列和集合）不一致。
>
> **棄用週期 (Deprecation cycle)**：
> 
> - &lt;1.2：描述的程式碼模式可以正常編譯，但對區域變數的更新會影響迴圈執行
> - 1.2.X：如果 for 迴圈中的範圍表達式是在迴圈主體中賦值的陣列類型區域變數，則報告棄用警告
> - 1.3：在這種情況下變更行為，使其與其他容器一致

### 列舉條目中的巢狀分類器

> **問題**：[KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，禁止列舉條目中的巢狀分類器（類別、物件、介面、註解類別、列舉類別）
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：列舉條目中的巢狀分類器可以正常編譯，但可能在執行時因例外而失敗
> - 1.2.X：在巢狀分類器上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 資料類別覆寫 copy

> **問題**：[KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **元件 (Components)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，禁止資料類別覆寫 `copy()`
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：覆寫 `copy()` 的資料類別可以正常編譯，但可能在執行時失敗/暴露出奇怪的行為
> - 1.2.X：在覆寫 `copy()` 的資料類別上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 從外部類別捕獲泛型參數的繼承 Throwable 的內部類別

> **問題**：[KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，不允許內部類別繼承 `Throwable`
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：繼承 `Throwable` 的內部類別可以正常編譯。如果此類內部類別恰好捕獲泛型參數，則可能導致在執行時失敗的奇怪程式碼模式。
> - 1.2.X：在繼承 `Throwable` 的內部類別上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 關於具有伴生物件的複雜類別層次結構的可見性規則

> **問題**：[KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，對於涉及伴生物件和巢狀分類器的複雜類別層次結構，按簡短名稱的可見性規則更加嚴格。
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：舊的可見性規則（請參閱問題以獲取詳細資訊）
> - 1.2.X：在將不再可訪問的簡短名稱上報告棄用警告。工具建議透過新增完整名稱來自動遷移。
> - &gt;=1.3：棄用警告提升為錯誤。違規程式碼應新增完整限定符或顯式匯入

### 非常數 vararg 註解參數

> **問題**：[KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，禁止將非常數值設定為 vararg 註解參數
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：編譯器允許為 vararg 註解參數傳遞非常數值，但實際上會在位元組碼產生期間丟棄該值，從而導致不明顯的行為
> - 1.2.X：在此類程式碼模式上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 區域註解類別

> **問題**：[KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，不支援區域註解類別
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：編譯器可以正常編譯區域註解類別
> - 1.2.X：在區域註解類別上報告棄用警告
> - &gt;=1.3：棄用警告提升為錯誤

### 區域委託屬性的智慧轉換

> **問題**：[KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，不允許對區域委託屬性進行智慧轉換
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：編譯器允許對區域委託屬性進行智慧轉換，如果委託行為不佳，可能會導致不健全的智慧轉換
> - 1.2.X：區域委託屬性的智慧轉換被報告為已棄用（編譯器發出警告）
> - &gt;=1.3：棄用警告提升為錯誤

### mod 運算符慣例

> **問題**：[KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，禁止宣告 `mod` 運算符，以及解析為此類宣告的呼叫
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.1.X, 1.2.X：報告 `operator mod` 宣告的警告，以及解析為它的呼叫
> - 1.3.X：將警告提升為錯誤，但仍然允許解析為 `operator mod` 宣告
> - 1.4.X：不再解析對 `operator mod` 的呼叫

### 以命名形式將單個元素傳遞給 vararg

> **問題**：[KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). 另請參閱 [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：在 Kotlin 1.3 中，將單個元素賦值給 vararg 已棄用，應替換為連續展開和陣列建構。
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：以命名形式將一個值元素賦值給 vararg 可以正常編譯，並被視為將 *單個* 元素賦值給陣列，從而在將陣列賦值給 vararg 時導致不明顯的行為
> - 1.2.X：在此類賦值上報告棄用警告，建議使用者切換到連續展開和陣列建構。
> - 1.3.X：警告提升為錯誤
> - &gt;= 1.4：變更將單個元素賦值給 vararg 的語義，使陣列的賦值等效於陣列的展開的賦值

### 具有目標 EXPRESSION 的註解的保留

> **問題**：[KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，對於具有目標 `EXPRESSION` 的註解，僅允許 `SOURCE` 保留
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：允許具有目標 `EXPRESSION` 且保留不是 `SOURCE` 的註解，但在使用位置上被靜默忽略
> - 1.2.X：在此類註解的宣告上報告棄用警告
> - &gt;=1.3：警告提升為錯誤

### 具有目標 PARAMETER 的註解不應適用於參數的類型

> **問題**：[KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **元件 (Component)**：核心語言 (Core language)
>
> **不相容變更類型**：原始碼 (Source)
>
> **簡短摘要**：自 Kotlin 1.3 起，當具有目標 `PARAMETER` 的註解應用於參數的類型時，將正確報告關於錯誤註解目標的錯誤
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.2：上述程式碼模式可以正常編譯；註解被靜默忽略並且不存在於位元組碼中
> - 1.2.X：在此類用法上報告棄用警告
> - &gt;=1.3：警告提升為錯誤

### 當索引超出範圍時，Array.copyOfRange 拋出例外，而不是擴大返回的陣列

> **問題**：[KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **元件 (Component)**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為 (Behavioral)
>
> **簡短摘要**：自 Kotlin 1.3 起，確保 `Array.copyOfRange` 的 `toIndex` 參數（表示正在複製的範圍的獨佔結尾）不大於陣列大小，如果是，則拋出 `IllegalArgumentException`。
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：如果 `Array.copyOfRange` 調用中的 `toIndex` 大於陣列大小，則範圍中缺少的元素將填充 `null`，從而違反 Kotlin 類型系統的健全性。
> - &gt;=1.3：檢查 `toIndex` 是否在陣列邊界內，如果不是，則拋出例外

### 禁止使用 Int.MIN_VALUE 和 Long.MIN_VALUE 的步長的 int 和 long 級數，並且不允許實例化

> **問題**：[KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **元件 (Component)**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為 (Behavioral)
>
> **簡短摘要**：自 Kotlin 1.3 起，禁止整數級數的步長值為其整數類型的最小負值（`Long` 或 `Int`），因此呼叫 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 將拋出 `IllegalArgumentException`
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：可以建立具有 `Int.MIN_VALUE` 步長的 `IntProgression`，它產生兩個值 `[0, -2147483648]`，這是不明顯的行為
> - &gt;=1.3：如果步長是其整數類型的最小負值，則拋出 `IllegalArgumentException`

### 檢查非常長序列上的操作中的索引溢位

> **問題**：[KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **元件 (Component)**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為 (Behavioral)
>
> **簡短摘要**：自 Kotlin 1.3 起，確保 `index`、`count` 和類似方法對於長序列不會溢位。 請參閱問題以獲取受影響方法的完整列表。
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：在非常長的序列上呼叫此類方法可能會由於整數溢位而產生負數結果
> - &gt;=1.3：檢測此類方法中的溢位並立即拋出例外

### 統一跨平台的空匹配 regex 結果分割

> **問題**：[KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **元件 (Component)**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：行為 (Behavioral)
>
> **簡短摘要**：自 Kotlin 1.3 起，統一跨所有平台的空匹配 regex 的 `split` 方法的行為
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：比較 JS、JRE 6、JRE 7 與 JRE 8+ 時，所描述的呼叫的行為不同
> - &gt;=1.3：統一跨平台的行為

### 編譯器發行版中已停止使用的棄用成品

> **問題**：[KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **元件 (Component)**：其他 (other)
>
> **不相容變更類型**：二進位 (Binary)
>
> **簡短摘要**：Kotlin 1.3 停止使用以下已棄用的二進位成品：
> - `kotlin-runtime`：請改用 `kotlin-stdlib`
> - `kotlin-stdlib-jre7/8`：請改用 `kotlin-stdlib-jdk7/8`
> - 編譯器發行版中的 `kotlin-jslib`：請改用 `kotlin-stdlib-js`
>
> **棄用週期 (Deprecation cycle)**：
>
> - 1.2.X：這些成品被標記為已棄用，編譯器報告了使用這些成品的警告
> - &gt;=1.3：這些成品已停止使用

### stdlib 中的註解

> **問題**：[KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **元件 (Component)**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：二進位 (Binary)
>
> **簡短摘要**：Kotlin 1.3 從 stdlib 中移除套件 `org.jetbrains.annotations` 中的註解，並將其移動到與編譯器一起發布的單獨成品：`annotations-13.0.jar` 和 `mutability-annotations-compat.jar`
>
> **棄用週期 (Deprecation cycle)**：
>
> - &lt;1.3：註解與 stdlib 成品一起發布
> - &gt;=1.3：註解在單獨的成品中發布