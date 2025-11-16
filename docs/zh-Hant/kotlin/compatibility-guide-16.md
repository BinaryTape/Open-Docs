[//]: # (title: Kotlin 1.6.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計的基本原則。前者指出，阻礙語言演進的建構應予移除；後者則說明，此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）公佈，但本文總結了所有變更，為從 Kotlin 1.5 遷移至 Kotlin 1.6 提供了完整的參考資料。

## 基本術語

本文中，我們介紹了幾種相容性類型：

- _來源_：來源不相容變更會使原本可正常編譯（無錯誤或警告）的程式碼不再能編譯
- _二進位_：如果兩個二進位構件互相替換不會導致載入或連結錯誤，則稱它們具有二進位相容性
- _行為_：如果同一程式在套用變更前後展現出不同行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純 Kotlin。從其他語言（例如 Java）的角度來看的 Kotlin 程式碼相容性超出本文範圍。

## 語言

### 預設情況下，當 `when` 陳述式以 enum、sealed 和 Boolean 型別為主題時，要求窮舉完備

> **議題**：[KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將針對以 enum、sealed 或 Boolean 型別為主題的非窮舉完備 `when` 陳述式發出警告
>
> **棄用週期**：
>
> - 1.6.0：當以 enum、sealed 或 Boolean 型別為主題的 `when` 陳述式非窮舉完備時，引入警告（在漸進模式下為錯誤）
> - 1.7.0：將此警告提升為錯誤

### 棄用 `when-with-subject` 中易混淆的語法

> **議題**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將棄用 `when` 條件表達式中幾個易混淆的語法建構
>
> **棄用週期**：
>
> - 1.6.20：對受影響的表達式引入棄用警告
> - 1.8.0：將此警告提升為錯誤
> - &gt;= 1.8：將一些棄用的建構重新用於新的語言功能

### 禁止在伴生物件和巢狀物件的父類別建構函式呼叫中存取類別成員

> **議題**：[KT-25289](https://youtrack.jetbrains.com/issue/KT-25289)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將對伴生物件和常規物件的父類別建構函式呼叫引數報告錯誤，如果此類引數的接收者指向包含宣告
>
> **棄用週期**：
>
> - 1.5.20：對有問題的引數引入警告
> - 1.6.0：將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitSelfCallsInNestedObjects` 可用於暫時恢復到 1.6 之前的行為

### 型別空值可否性增強改進

> **議題**：[KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.7 將改變其載入和解釋 Java 程式碼中型別空值可否性註釋的方式
>
> **棄用週期**：
>
> - 1.4.30：針對更精確的型別空值可否性可能導致錯誤的情況引入警告
> - 1.7.0：推斷 Java 型別更精確的空值可否性，
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用於暫時恢復到 1.7 之前的行為

### 防止不同數字型別之間的隱式強制轉型

> **議題**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡述**：當語義上只需要將數值向下轉型為原始數字型別時，Kotlin 將避免自動將其轉換為該型別
>
> **棄用週期**：
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修復生成的屬性委託存取器中的向下轉型行為，
>   `-Xuse-old-backend` 可用於暫時恢復到 1.5.30 之前修復的行為
> - &gt;= 1.6.20：修復其他受影響情況下的向下轉型行為

### 禁止宣告其容器註釋違反 JLS 的可重複註釋類別

> **議題**：[KT-47928](https://youtrack.jetbrains.com/issue/KT-47928)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將檢查可重複註釋的容器註釋是否滿足 [JLS 9.6.3](https://docs.oracle.com/javase/specs/jls/se16/html/jls-9.html#jls-9.6.3) 中的相同要求：陣列型別值方法、保留策略和目標
>
> **棄用週期**：
>
> - 1.5.30：對違反 JLS 要求的可重複容器註釋宣告引入警告（在漸進模式下為錯誤）
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用於暫時禁用錯誤報告

### 禁止在可重複註釋類別中宣告名為 `Container` 的巢狀類別

> **議題**：[KT-47971](https://youtrack.jetbrains.com/issue/KT-47971)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將檢查在 Kotlin 中宣告的可重複註釋是否沒有名為 `Container` 的巢狀類別
>
> **棄用週期**：
>
> - 1.5.30：對 Kotlin 可重複註釋類別中名為 `Container` 的巢狀類別引入警告（在漸進模式下為錯誤）
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-RepeatableAnnotationContainerConstraints` 可用於暫時禁用錯誤報告

### 禁止在覆寫介面屬性的主建構函式中的屬性上使用 `@JvmField`

> **議題**：[KT-32753](https://youtack.jetbrains.com/issue/KT-32753)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將禁止在覆寫介面屬性的主建構函式中宣告的屬性上註釋 `@JvmField`
>
> **棄用週期**：
>
> - 1.5.20：對主建構函式中此類屬性上的 `@JvmField` 註釋引入警告
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitJvmFieldOnOverrideFromInterfaceInPrimaryConstructor` 可用於暫時禁用錯誤報告

### 棄用編譯器選項 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式

> **議題**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **元件**：Kotlin/JVM
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6.20 將對使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式發出警告
>
> **棄用週期**：
>
> - 1.6.20：對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0：將此警告提升為錯誤

### 禁止從公開 ABI 內聯函式呼叫 `super`

> **議題**：[KT-45379](https://youtrack.jetbrains.com/issue/KT-45379)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將禁止從公開或受保護的內聯函式和屬性呼叫帶有 `super` 限定符的函式
>
> **棄用週期**：
>
> - 1.5.0：對從公開或受保護的內聯函式或屬性存取器呼叫 `super` 引入警告
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitSuperCallsFromPublicInline` 可用於暫時禁用錯誤報告

### 禁止從公開內聯函式呼叫受保護建構函式

> **議題**：[KT-48860](https://youtrack.jetbrains.com/issue/KT-48860)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將禁止從公開或受保護的內聯函式和屬性呼叫受保護的建構函式
>
> **棄用週期**：
>
> - 1.4.30：對從公開或受保護的內聯函式或屬性存取器呼叫受保護建構函式引入警告
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitProtectedConstructorCallFromPublicInline` 可用於暫時禁用錯誤報告

### 禁止從檔案內私有型別公開私有巢狀型別

> **議題**：[KT-20094](https://youtrack.jetbrains.com/issue/KT-20094)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將禁止從檔案內私有型別公開私有巢狀型別和內部類別
>
> **棄用週期**：
>
> - 1.5.0：對從檔案內私有型別公開的私有型別引入警告
> - 1.6.0：將此警告提升為錯誤，
>   `-XXLanguage:-PrivateInFileEffectiveVisibility` 可用於暫時禁用錯誤報告

### 在多種情況下，不對型別上的註釋進行註釋目標分析

> **議題**：[KT-28449](https://youtrack.jetbrains.com/issue/KT-28449)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將不再允許對不應適用於型別的註釋進行型別註釋
>
> **棄用週期**：
>
> - 1.5.20：在漸進模式下引入錯誤
> - 1.6.0：引入錯誤，
>   `-XXLanguage:-ProperCheckAnnotationsTargetInTypeUsePositions` 可用於暫時禁用錯誤報告

### 禁止呼叫帶有尾隨 lambda 的 `suspend` 函式

> **議題**：[KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **元件**：核心語言
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 1.6 將不再允許呼叫名為 `suspend` 且將單一函式型別引數作為尾隨 lambda 傳遞的函式
>
> **棄用週期**：
>
> - 1.3.0：對此類函式呼叫引入警告
> - 1.6.0：將此警告提升為錯誤
> - &gt;= 1.7.0：引入語言語法變更，以便將 `{` 之前的 `suspend` 解析為關鍵字

## 標準函式庫

### 移除 `minus`/`removeAll`/`retainAll` 中脆弱的 `contains` 優化

> **議題**：[KT-45438](https://youtrack.jetbrains.com/issue/KT-45438)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡述**：Kotlin 1.6 將不再對從集合/迭代器/陣列/序列中移除多個元素的函式和運算符的引數執行轉換為 `Set` 的操作。
>
> **棄用週期**：
>
> - < 1.6：舊行為：在某些情況下將引數轉換為 `Set`
> - 1.6.0：如果函式引數是集合，則不再將其轉換為 `Set`。如果不是集合，則可以將其轉換為 `List`。
>   舊行為可在 JVM 上透過設定系統屬性 `kotlin.collections.convert_arg_to_set_in_removeAll=true` 暫時重新啟用
> - &gt;= 1.7：上述系統屬性將不再有效

### 變更 `Random.nextLong` 中的值生成演算法

> **議題**：[KT-47304](https://youtrack.jetbrains.com/issue/KT-47304)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡述**：Kotlin 1.6 變更了 `Random.nextLong` 函式中的值生成演算法，以避免產生超出指定範圍的值。
>
> **棄用週期**：
>
> - 1.6.0：行為立即修復

### 逐步將集合 `min` 和 `max` 函式的回傳型別變更為不可為空

> **議題**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：來源
>
> **簡述**：集合 `min` 和 `max` 函式的回傳型別將在 Kotlin 1.7 中變更為不可為空
>
> **棄用週期**：
>
> - 1.4.0：引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳情請參閱議題）
> - 1.5.0：將受影響 API 的棄用級別提升為錯誤
> - 1.6.0：從公共 API 隱藏已棄用的函式
> - &gt;= 1.7：重新引入受影響的 API，但回傳型別為不可為空

### 棄用浮點陣列函式：`contains`、`indexOf`、`lastIndexOf`

> **議題**：[KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **元件**：kotlin-stdlib
>
> **不相容變更類型**：來源
>
> **簡述**：Kotlin 棄用浮點陣列函式 `contains`、`indexOf`、`lastIndexOf`，這些函式使用 IEEE-754 順序而非總順序比較值
>
> **棄用週期**：
>
> - 1.4.0：以警告棄用受影響的函式
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7：從公共 API 隱藏已棄用的函式

### 將宣告從 `kotlin.dom` 和 `kotlin.browser` 套件遷移到 `kotlinx.*`

> **議題**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：來源
>
> **簡述**：`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移動到對應的 `kotlinx.*` 套件，為從 stdlib 中提取它們做準備
>
> **棄用週期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議以上新 API 作為替代方案
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7：從 stdlib 移除已棄用的函式
> - &gt;= 1.7：將 `kotlinx.*` 套件中的 API 移動到單獨的函式庫

### 使 Kotlin/JS 中的 `Regex.replace` 函式不再是內聯函式

> **議題**：[KT-27738](https://youtrack.jetbrains.com/issue/KT-27738)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：來源
>
> **簡述**：帶有函式 `transform` 參數的 `Regex.replace` 函式將不再是 Kotlin/JS 中的內聯函式
>
> **棄用週期**：
>
> - 1.6.0：從受影響的函式中移除 `inline` 修飾符

### 當替換字串包含群組參考時，JVM 和 JS 中 `Regex.replace` 函式的行為不同

> **議題**：[KT-28378](https://youtrack.jetbrains.com/issue/KT-28378)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：行為
>
> **簡述**：Kotlin/JS 中帶有替換模式字串的 `Regex.replace` 函式將遵循與 Kotlin/JVM 中相同的模式語法
>
> **棄用週期**：
>
> - 1.6.0：變更 Kotlin/JS stdlib 中 `Regex.replace` 的替換模式處理方式

### 在 JS `Regex` 中使用 Unicode 大小寫摺疊

> **議題**：[KT-45928](https://youtrack.jetbrains.com/issue/KT-45928)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：行為
>
> **簡述**：Kotlin/JS 中的 `Regex` 類別在呼叫底層 JS 正規表達式引擎以根據 Unicode 規則搜尋和比較字元時，將使用 [`unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode) 標誌。這會帶來 JS 環境的某些版本要求，並導致對正規表達式模式字串中不必要的轉義進行更嚴格的驗證。
>
> **棄用週期**：
>
> - 1.5.0：在 JS `Regex` 類別的大多數函式中啟用 Unicode 大小寫摺疊
> - 1.6.0：在 `Regex.replaceFirst` 函式中啟用 Unicode 大小寫摺疊

### 棄用部分僅限 JS 的 API

> **議題**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：來源
>
> **簡述**：stdlib 中許多僅限 JS 的函式已棄用並將移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函式的陣列 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **棄用週期**：
>
> - 1.6.0：以警告棄用受影響的函式
> - 1.7.0：將棄用級別提升為錯誤
> - 1.8.0：從公共 API 移除已棄用的函式

### 從 Kotlin/JS 類別的公共 API 隱藏實作和互通性特定函式

> **議題**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **元件**：kotlin-stdlib (JS)
>
> **不相容變更類型**：來源、二進位
>
> **簡述**：函式 `HashMap.createEntrySet` 和 `AbstactMutableCollection.toJSON` 將其可見性變更為 `internal`
>
> **棄用週期**：
>
> - 1.6.0：將函式設為 `internal`，從而將其從公共 API 中移除

## 工具

### 棄用 `KotlinGradleSubplugin` 類別

> **議題**：[KT-48830](https://youtrack.jetbrains.com/issue/KT-48830)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：`KotlinGradleSubplugin` 類別將被棄用，以 `KotlinCompilerPluginSupportPlugin` 取代
>
> **棄用週期**：
>
> - 1.6.0：將棄用級別提升為錯誤
> - &gt;= 1.7.0：移除已棄用的類別

### 移除 `kotlin.useFallbackCompilerSearch` 建置選項

> **議題**：[KT-46719](https://youtrack.jetbrains.com/issue/KT-46719)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：移除已棄用的 `kotlin.useFallbackCompilerSearch` 建置選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為警告
> - 1.6.0：移除已棄用的選項

### 移除多個編譯器選項

> **議題**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：移除已棄用的 `noReflect` 和 `includeRuntime` 編譯器選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為錯誤
> - 1.6.0：移除已棄用的選項

### 棄用 `useIR` 編譯器選項

> **議題**：[KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：隱藏已棄用的 `useIR` 編譯器選項
>
> **棄用週期**：
>
> - 1.5.0：將棄用級別提升為警告
> - 1.6.0：隱藏選項
> - &gt;= 1.7.0：移除已棄用的選項

### 棄用 `kapt.use.worker.api` Gradle 屬性

> **議題**：[KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 kapt（預設：true）
>
> **棄用週期**：
>
> - 1.6.20：將棄用級別提升為警告
> - &gt;= 1.8.0：移除此屬性

### 移除 `kotlin.parallel.tasks.in.project` Gradle 屬性

> **議題**：[KT-46406](https://youtrack.jetbrains.com/issue/KT-46406)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：移除 `kotlin.parallel.tasks.in.project` 屬性
>
> **棄用週期**：
>
> - 1.5.20：將棄用級別提升為警告
> - 1.6.20：移除此屬性

### 棄用 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` Gradle 屬性

> **議題**：[KT-50369](https://youtrack.jetbrains.com/issue/KT-50369)
>
> **元件**：Gradle
>
> **不相容變更類型**：來源
>
> **簡述**：棄用 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性
>
> **棄用週期**：
>
> - 1.6.20：將棄用級別提升為警告
> - &gt;= 1.7.0：移除 DSL 選項和屬性