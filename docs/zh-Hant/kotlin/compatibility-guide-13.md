[//]: # (title: Kotlin 1.3 的相容性指南)

_保持語言現代化 (Keeping the Language Modern)_ 和 _舒適的更新 (Comfortable Updates)_ 是 Kotlin 語言設計中的基本原則之一。前者指出，應移除阻礙語言演進的結構，而後者則表示，這種移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）發布，但本文件將其全部總結，為從 Kotlin 1.2 遷移到 Kotlin 1.3 提供完整參考。

## 基本術語

本文件介紹了幾種相容性：

- *來源 (Source)*：來源不相容的變更會導致原本編譯正常（無錯誤或警告）的程式碼無法再編譯。
- *二進制 (Binary)*：如果兩個二進制產物可以互換而不會導致載入或連結錯誤，則稱它們為二進制相容。
- *行為 (Behavioral)*：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純粹的 Kotlin。Kotlin 程式碼與其他語言（例如 Java）的相容性不在本文件討論範圍內。

## 不相容變更

### 建構子引數關於 `<clinit>` 呼叫的求值順序

> **問題 (Issue)**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **組件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: 行為 (behavioral)
>
> **簡要摘要 (Short summary)**: 1.3 版中，與類別初始化相關的求值順序已變更。
>
> **棄用週期 (Deprecation cycle)**: 
>
> - <1.3: 舊行為（詳見問題說明）
> - &gt;= 1.3: 行為已變更，
> `-Xnormalize-constructor-calls=disable` 可用於暫時恢復到 1.3 之前的行為。此標誌的支援將在下一個主要版本中移除。

### 註解建構子參數上缺少 getter 定位註解

> **問題 (Issue)**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **組件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: 行為 (behavioral)
>
> **簡要摘要 (Short summary)**: 針對註解建構子參數的 getter 定位註解將在 1.3 版中正確寫入到類別檔案。
>
> **棄用週期 (Deprecation cycle)**: 
>
> - <1.3: 針對註解建構子參數的 getter 定位註解未套用。
> - &gt;=1.3: 針對註解建構子參數的 getter 定位註解已正確套用並寫入到生成的程式碼中。

### 類別建構子的 `@get:` 註解中缺少錯誤

> **問題 (Issue)**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: getter 定位註解中的錯誤將在 1.3 版中正確報告。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: getter 定位註解中的編譯錯誤未報告，導致不正確的程式碼也能正常編譯。
> - 1.2.x: 錯誤僅由工具報告，編譯器仍然在沒有任何警告的情況下編譯此類程式碼。
> - &gt;=1.3: 編譯器也報告錯誤，導致錯誤程式碼被拒絕。

### 存取使用 @NotNull 註解的 Java 類型時的可空性斷言

> **問題 (Issue)**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **組件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: 行為 (Behavioral)
>
> **簡要摘要 (Short summary)**: 對於使用非空註解標記的 Java 類型，將更積極地生成可空性斷言，導致在此處傳遞 `null` 的程式碼更快失敗。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 當涉及類型推斷時，編譯器可能會遺漏此類斷言，允許在針對二進制檔案編譯期間潛在的 `null` 傳播（詳情請見問題說明）。
> - &gt;=1.3: 編譯器生成遺漏的斷言。這可能會導致原本（錯誤地）在此處傳遞 `null` 的程式碼更快失敗。
> `-XXLanguage:-StrictJavaNullabilityAssertions` 可用於暫時恢復到 1.3 之前的行為。此標誌的支援將在下一個主要版本中移除。

### 列舉成員上不健全的智能轉換

> **問題 (Issue)**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 對於一個列舉條目成員的智能轉換將正確地只套用至此列舉條目。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 對於一個列舉條目成員的智能轉換可能導致對其他列舉條目相同成員的不健全智能轉換。
> - &gt;=1.3: 智能轉換將正確地只套用至一個列舉條目成員。
> `-XXLanguage:-SoundSmartcastForEnumEntries` 將暫時恢復舊行為。此標誌的支援將在下一個主要版本中移除。

### 在 getter 中重新賦值 `val` 支援欄位

> **問題 (Issue)**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **組件 (Components)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止在其 getter 中重新賦值 `val` 屬性的支援欄位。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: Kotlin 編譯器允許在其 getter 中修改 `val` 的支援欄位。這不僅違反 Kotlin 語義，還會生成行為不端的 JVM 位元組碼，重新賦值 `final` 欄位。
> - 1.2.X: 對於重新賦值 `val` 支援欄位的程式碼會報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 在 for 迴圈迭代之前捕獲陣列

> **問題 (Issue)**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **組件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 如果 for 迴圈範圍中的表達式是在迴圈主體中更新的局部變數，此變更會影響迴圈執行。這與迭代其他容器（例如範圍、字元序列和集合）不一致。
>
> **棄用週期 (Deprecation cycle)**:
> 
> - <1.2: 描述的程式碼模式編譯正常，但對局部變數的更新會影響迴圈執行。
> - 1.2.X: 如果 for 迴圈中的範圍表達式是在迴圈主體中賦值的陣列類型局部變數，則會報告棄用警告。
> - 1.3: 在此類情況下改變行為以與其他容器保持一致。

### 列舉條目中的巢狀分類器

> **問題 (Issue)**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止在列舉條目中包含巢狀分類器（類別、物件、介面、註解類別、列舉類別）。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 列舉條目中的巢狀分類器編譯正常，但在執行時可能會因異常失敗。
> - 1.2.X: 對於巢狀分類器報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 資料類別覆寫 `copy`

> **問題 (Issue)**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **組件 (Components)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止資料類別覆寫 `copy()`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 覆寫 `copy()` 的資料類別編譯正常，但在執行時可能會失敗/暴露奇怪行為。
> - 1.2.X: 對於覆寫 `copy()` 的資料類別報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 繼承 `Throwable` 並從外部類別捕獲泛型參數的內部類別

> **問題 (Issue)**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，內部類別不允許繼承 `Throwable`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 繼承 `Throwable` 的內部類別編譯正常。如果此類內部類別碰巧捕獲泛型參數，可能導致在執行時失敗的奇怪程式碼模式。
> - 1.2.X: 對於繼承 `Throwable` 的內部類別報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 關於包含伴生物件的複雜類別階層的可見性規則

> **問題 (Issues)**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，對於涉及伴生物件和巢狀分類器的複雜類別階層，短名稱的可見性規則更嚴格。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 舊的可見性規則（詳情請見問題說明）。
> - 1.2.X: 對於將不再可存取的短名稱報告棄用警告。工具建議透過添加完整名稱進行自動遷移。
> - &gt;=1.3: 棄用警告提升為錯誤。有問題的程式碼應添加完整限定符或顯式導入。

### 非常數變長引數註解參數

> **問題 (Issue)**: [KT-23153](https://youtrack.com/issue/KT-23153)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止設定非常數值作為變長引數註解參數。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 編譯器允許為變長引數註解參數傳遞非常數值，但實際上在位元組碼生成過程中會丟棄該值，導致不明顯的行為。
> - 1.2.X: 對於此類程式碼模式報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 局部註解類別

> **問題 (Issue)**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，不支援局部註解類別。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 編譯器正常編譯局部註解類別。
> - 1.2.X: 對於局部註解類別報告棄用警告。
> - &gt;=1.3: 棄用警告提升為錯誤。

### 對局部委託屬性的智能轉換

> **問題 (Issue)**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，不允許對局部委託屬性進行智能轉換。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 編譯器允許對局部委託屬性進行智能轉換，這在行為不端的委託情況下可能導致不健全的智能轉換。
> - 1.2.X: 對於局部委託屬性的智能轉換會報告為棄用（編譯器發出警告）。
> - &gt;=1.3: 棄用警告提升為錯誤。

### `mod` 運算子慣例

> **問題 (Issues)**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止聲明 `mod` 運算子，以及解析為此類聲明的呼叫。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.1.X, 1.2.X: 對於 `operator mod` 的聲明以及解析為它的呼叫報告警告。
> - 1.3.X: 將警告提升為錯誤，但仍允許解析為 `operator mod` 聲明。
> - 1.4.X: 不再解析對 `operator mod` 的呼叫。

### 以命名形式將單一元素傳遞給變長引數

> **問題 (Issues)**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589)。另見 [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 在 Kotlin 1.3 中，將單一元素賦值給變長引數已被棄用，應替換為連續的展開和陣列建構。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 以命名形式將一個值元素賦值給變長引數編譯正常，並被視為將*單一*元素賦值給陣列，這在將陣列賦值給變長引數時導致不明顯的行為。
> - 1.2.X: 對於此類賦值報告棄用警告，建議使用者切換到連續的展開和陣列建構。
> - 1.3.X: 警告提升為錯誤。
> - &gt;= 1.4: 改變將單一元素賦值給變長引數的語義，使陣列的賦值等同於陣列展開的賦值。

### 目標為 `EXPRESSION` 的註解的保留

> **問題 (Issue)**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，對於目標為 `EXPRESSION` 的註解，只允許 `SOURCE` 保留。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 目標為 `EXPRESSION` 且保留非 `SOURCE` 的註解被允許，但在使用時靜默忽略。
> - 1.2.X: 對於此類註解的聲明報告棄用警告。
> - &gt;=1.3: 警告提升為錯誤。

### 目標為 `PARAMETER` 的註解不應適用於參數類型

> **問題 (Issue)**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **組件 (Component)**: 核心語言 (Core language)
>
> **不相容變更類型 (Incompatible change type)**: 來源 (Source)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，當目標為 `PARAMETER` 的註解套用至參數類型時，關於錯誤註解目標的錯誤將被正確報告。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.2: 前述程式碼模式編譯正常；註解被靜默忽略且不存在於位元組碼中。
> - 1.2.X: 對於此類用法報告棄用警告。
> - &gt;=1.3: 警告提升為錯誤。

### `Array.copyOfRange` 在索引超出範圍時拋出異常，而不是擴大返回的陣列

> **問題 (Issue)**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **組件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: 行為 (Behavioral)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，確保 `Array.copyOfRange` 的 `toIndex` 引數（代表複製範圍的獨佔結束）不大於陣列大小，如果大於則拋出 `IllegalArgumentException`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 在呼叫 `Array.copyOfRange` 時，如果 `toIndex` 大於陣列大小，範圍中缺失的元素將填充 `null`，這違反了 Kotlin 類型系統的健全性。
> - &gt;=1.3: 檢查 `toIndex` 是否在陣列邊界內，如果不在則拋出異常。

### 步長為 `Int.MIN_VALUE` 和 `Long.MIN_VALUE` 的 `Int` 和 `Long` 進程被禁止且不允許被實例化

> **問題 (Issue)**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **組件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: 行為 (Behavioral)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，禁止整數進程的步長值為其整數類型（`Long` 或 `Int`）的最小負值，因此呼叫 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 將拋出 `IllegalArgumentException`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 可以創建一個步長為 `Int.MIN_VALUE` 的 `IntProgression`，這會產生兩個值 `[0, -2147483648]`，這是一個不明顯的行為。
> - &gt;=1.3: 如果步長是其整數類型的最小負值，則拋出 `IllegalArgumentException`。

### 檢查超長序列操作中的索引溢位

> **問題 (Issue)**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **組件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: 行為 (Behavioral)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，確保 `index`、`count` 和類似方法不會在長序列中溢位。受影響方法的完整列表請參見問題說明。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 在超長序列上呼叫此類方法可能由於整數溢位而產生負結果。
> - &gt;=1.3: 在此類方法中檢測溢位並立即拋出異常。

### 統一跨平台空匹配正則表達式的 `split` 結果

> **問題 (Issue)**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **組件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: 行為 (Behavioral)
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.3 起，統一 `split` 方法透過空匹配正則表達式在所有平台上的行為。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 描述的呼叫行為在比較 JS、JRE 6、JRE 7 與 JRE 8+ 時不同。
> - &gt;=1.3: 統一跨平台行為。

### 編譯器發行版中已停用的棄用產物

> **問題 (Issue)**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **組件 (Component)**: 其他 (other)
>
> **不相容變更類型 (Incompatible change type)**: 二進制 (Binary)
>
> **簡要摘要 (Short summary)**: Kotlin 1.3 停用以下已棄用的二進制產物：
> - `kotlin-runtime`: 改用 `kotlin-stdlib`
> - `kotlin-stdlib-jre7/8`: 改用 `kotlin-stdlib-jdk7/8`
> - 編譯器發行版中的 `kotlin-jslib`: 改用 `kotlin-stdlib-js`
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.2.X: 產物被標記為已棄用，編譯器在使用這些產物時報告警告。
> - &gt;=1.3: 產物已停用。

### 標準庫中的註解

> **問題 (Issue)**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **組件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: 二進制 (Binary)
>
> **簡要摘要 (Short summary)**: Kotlin 1.3 從標準庫中移除 `org.jetbrains.annotations` 套件中的註解，並將它們移動到隨編譯器發行的獨立產物：`annotations-13.0.jar` 和 `mutability-annotations-compat.jar`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 註解隨標準庫產物一起發行。
> - &gt;=1.3: 註解在獨立產物中發行。