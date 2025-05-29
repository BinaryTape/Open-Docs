[//]: # (title: 適用於 Kotlin 1.9 的相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出應移除阻礙語言演進的結構，後者則表示此類移除應提前充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）發布，但本文件將其全部彙總，為從 Kotlin 1.8 遷移到 Kotlin 1.9 提供完整參考。

## 基本術語

本文件中介紹了幾種相容性：

- _來源 (source)_：來源不相容的變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
- _二進位 (binary)_：兩個二進位成品如果在互換後不會導致載入或連結錯誤，則稱它們是二進位相容的。
- _行為 (behavioral)_：如果同一程式在應用變更前後展現出不同行為，則稱該變更是行為不相容的。

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言角度（例如 Java）來看的 Kotlin 程式碼相容性不在本文件討論範圍內。

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

### 移除語言版本 1.3

> **問題**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 引入了語言版本 1.9 並移除了對語言版本 1.3 的支援。
>
> **棄用週期**:
>
> - 1.6.0：報告警告
> - 1.9.0：將警告提升為錯誤

### 禁止當超級介面型別為函式常值時的超級建構函式呼叫

> **問題**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: 如果介面繼承自函式常值型別，Kotlin 1.9 會禁止超級建構函式呼叫，因為此類建構函式不存在。
>
> **棄用週期**:
> * 1.7.0：報告警告（或在漸進模式下報告錯誤）
> * 1.9.0：將警告提升為錯誤

### 禁止註解參數型別中的循環

> **問題**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 禁止註解的型別被直接或間接地用作其參數型別之一。這可以防止產生循環。
> 然而，允許將註解型別的 `Array` 或 `vararg` 作為參數型別。
>
> **棄用週期**:
> * 1.7.0：在註解參數型別中的循環上報告警告（或在漸進模式下報告錯誤）
> * 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暫時恢復到 1.9 版之前的行為。

### 禁止在沒有參數的函式型別上使用 @ExtensionFunctionType 註解

> **問題**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 禁止在沒有參數的函式型別上，或在非函式型別上使用 `@ExtensionFunctionType` 註解。
>
> **棄用週期**:
> * 1.7.0：在非函式型別上的註解報告警告，在**是**函式型別上的註解報告錯誤
> * 1.9.0：將函式型別的警告提升為錯誤

### 禁止 Java 欄位型別在賦值時不匹配

> **問題**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 會在偵測到賦值給 Java 欄位的值的型別與該 Java 欄位的投影型別不匹配時，報告編譯器錯誤。
>
> **棄用週期**:
> * 1.6.0：當投影的 Java 欄位型別與賦值型別不匹配時，報告警告（或在漸進模式下報告錯誤）
> * 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暫時恢復到 1.9 版之前的行為。

### 平台型別空值斷言例外中不包含原始碼摘錄

> **問題**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: 在 Kotlin 1.9 中，表達式空值檢查所產生的例外訊息不包含原始碼摘錄。取而代之的是，會顯示方法或欄位的名稱。
> 如果表達式不是方法或欄位，訊息中不會提供額外資訊。
>
> **棄用週期**:
> * < 1.9.0：表達式空值檢查所產生的例外訊息包含原始碼摘錄
> * 1.9.0：表達式空值檢查所產生的例外訊息僅包含方法或欄位名稱，可以使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暫時恢復到 1.9 版之前的行為。

### 禁止將超級呼叫委派給抽象父類別成員

> **問題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)、[KT-49017](https://youtrack.jetbrains.com/issue/KT-49017)、[KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
> 
> **簡短摘要**: 當明確或隱式的超級呼叫被委派給父類別的 _抽象_ 成員時，即使超級介面中存在預設實作，Kotlin 也會報告編譯錯誤。
>
> **棄用週期**:
>
> - 1.5.20：當使用未覆寫所有抽象成員的非抽象類別時引入警告
> - 1.7.0：如果超級呼叫實際上存取了父類別的抽象成員，則報告警告
> - 1.7.0：如果啟用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則在所有受影響的情況下報告錯誤；在漸進模式下報告錯誤
> - 1.8.0：在宣告具體類別時，如果父類別中有未覆寫的抽象方法，以及 `Any` 方法的超級呼叫在父類別中被覆寫為抽象時，報告錯誤
> - 1.9.0：在所有受影響的情況下報告錯誤，包括對父類別抽象方法的明確超級呼叫

### 棄用帶主語 `when` 語句中令人困惑的語法

> **問題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.6 棄用（deprecated）了 `when` 條件表達式中幾個令人困惑的語法結構。
>
> **棄用週期**:
>
> - 1.6.20：對受影響的表達式引入棄用警告
> - 1.8.0：將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時恢復到 1.8 版之前的行為
> - &gt;= 2.1：將一些棄用的結構重新用於新的語言功能

### 防止不同數值型別之間的隱式強制轉換

> **問題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: Kotlin 將避免自動將數值轉換為基本數值型別，在語義上僅需要對該型別進行向下轉型（downcast）的情況下。
>
> **棄用週期**:
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修正生成的屬性委派存取器中的向下轉型行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 版之前的修正行為
> - &gt;= 2.0：修正其他受影響情況下的向下轉型行為

### 禁止泛型型別別名使用中的上界違規（型別參數用於別名型別的型別引數的泛型型別引數中）

> **問題**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: 在型別別名（typealias）的型別參數被用作別名型別的型別引數的泛型型別引數的情況下，例如 `typealias Alias<T> = Base<List<T>>`，Kotlin 將禁止使用其型別引數違反別名型別的對應型別參數上界限制的型別別名。
>
> **棄用週期**:
>
> - 1.8.0：當泛型型別別名使用中的型別引數違反別名型別對應型別參數的上界約束時，報告警告
> - 2.0.0：將警告提升為錯誤

### 在公開簽章中近似本地型別時保留空值性

> **問題**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源、二進位
>
> **簡短摘要**: 當本地型別或匿名型別從未明確指定返回型別的表達式主體函式中返回時，Kotlin 編譯器會使用該型別的已知超級型別來推斷（或近似）返回型別。
> 在此過程中，編譯器可能會推斷出非空型別，而實際上可以返回空值。
>
> **棄用週期**:
>
> - 1.8.0：以彈性超級型別近似彈性型別
> - 1.8.0：當宣告被推斷為非空型別但應為可空型別時，報告警告，提示使用者明確指定型別
> - 2.0.0：以可空超級型別近似可空型別，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時恢復到 2.0 版之前的行為

### 不透過覆寫傳播棄用

> **問題**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將不再把父類別中棄用成員的棄用狀態傳播到子類別中的覆寫成員，從而提供一種明確機制，允許棄用父類別中的成員，同時使其在子類別中保持未棄用狀態。
>
> **棄用週期**:
>
> - 1.6.20：報告一個警告，其中包含未來行為變更的訊息，並提示使用者選擇抑制此警告，或在棄用成員的覆寫上明確寫入 `@Deprecated` 註解
> - 1.9.0：停止將棄用狀態傳播到被覆寫的成員。此變更在漸進模式下也會立即生效。

### 禁止在註解類別中除參數宣告以外的任何地方使用集合常值

> **問題**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 允許以受限方式使用集合常值——用於將陣列傳遞給註解類別的參數或為這些參數指定預設值。
> 然而，除此之外，Kotlin 過去允許在註解類別內部的任何其他地方使用集合常值，例如在其巢狀物件中。Kotlin 1.9 將禁止在註解類別中除參數預設值以外的任何地方使用集合常值。
>
> **棄用週期**:
>
> - 1.7.0：在註解類別的巢狀物件中的陣列常值上報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止在預設值表達式中向前引用參數

> **問題**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將禁止在其他參數的預設值表達式中向前引用參數。這確保了當參數在預設值表達式中被存取時，它已經具有一個值，該值或是傳遞給函式，或是由其自身的預設值表達式初始化。
>
> **棄用週期**:
>
> - 1.7.0：當帶有預設值的參數在位於其之前的另一個參數的預設值中被引用時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時恢復到 1.9 版之前的行為

### 禁止對內聯函式參數的擴充呼叫

> **問題**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: 儘管 Kotlin 允許將內聯函式參數作為接收者傳遞給另一個內聯函式，但在編譯此類程式碼時總是會導致編譯器例外。
> Kotlin 1.9 將禁止這種行為，從而報告錯誤而不是使編譯器崩潰。
>
> **棄用週期**:
>
> - 1.7.20：對內聯函式參數上的內聯擴充呼叫報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止對名為 `suspend` 且帶有匿名函式引數的中綴函式進行呼叫

> **問題**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將不再允許呼叫名為 `suspend` 的中綴函式，該函式將函式型別的單一引數作為匿名函式常值傳遞。
>
> **棄用週期**:
>
> - 1.7.20：對帶有匿名函式常值的 `suspend` 中綴呼叫報告警告
> - 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時恢復到 1.9 版之前的行為
> - TODO：變更解析器解釋 `suspend fun` 符記序列的方式

### 禁止在內部類別中使用捕獲的型別參數，違背其變異性

> **問題**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將禁止在內部類別中，於違反外部類別具有 `in` 或 `out` 變異性之型別參數宣告變異性的位置上使用該型別參數。
>
> **棄用週期**:
>
> - 1.7.0：當外部類別的型別參數使用位置違反該參數的變異性規則時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時恢復到 1.9 版之前的行為

### 禁止在複合賦值運算子中對沒有明確返回型別的函式進行遞迴呼叫

> **問題**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將禁止在函式體內部，於複合賦值運算子的引數中呼叫沒有明確指定返回型別的函式，這與目前在函式體內其他表達式中的處理方式相同。
>
> **棄用週期**:
>
> - 1.7.0：當沒有明確指定返回型別的函式在函式體內，於複合賦值運算子引數中被遞迴呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止預期為 @NotNull T 而給定為帶可空綁定的 Kotlin 泛型參數的不健全呼叫

> **問題**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將禁止方法呼叫，其中可能為可空泛型型別的值被傳遞給 Java 方法中帶有 `@NotNull` 註解的參數。
>
> **棄用週期**:
>
> - 1.5.20：當未受約束的泛型型別參數被傳遞到預期為非空型別的位置時，報告警告
> - 1.9.0：報告型別不匹配錯誤，而非上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時恢復到 1.8 版之前的行為

### 禁止從列舉的項目初始化器中存取列舉類別伴生物件的成員

> **問題**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 將禁止從列舉項目初始化器中對列舉伴生物件的所有形式的存取。
>
> **棄用週期**:
>
> - 1.6.20：對此類伴生成員存取報告警告（或在漸進模式下報告錯誤）
> - 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時恢復到 1.8 版之前的行為

### 棄用並移除 Enum.declaringClass 合成屬性

> **問題**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 曾允許在從底層 Java 類別 `java.lang.Enum` 的 `getDeclaringClass()` 方法產生的 `Enum` 值上使用合成屬性 `declaringClass`，儘管此方法不適用於 Kotlin 的 `Enum` 型別。Kotlin 1.9 將禁止使用此屬性，建議改為遷移到擴充屬性 `declaringJavaClass`。
>
> **棄用週期**:
>
> - 1.7.0：對 `declaringClass` 屬性用法報告警告（或在漸進模式下報告錯誤），建議遷移到 `declaringJavaClass` 擴充
> - 1.9.0：將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時恢復到 1.9 版之前的行為
> - 2.0.0：移除 `declaringClass` 合成屬性

### 棄用編譯器選項 -Xjvm-default 的 `enable` 和 `compatibility` 模式

> **問題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)、[KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **元件**: Kotlin/JVM
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 1.9 禁止使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式。
>
> **棄用週期**:
>
> - 1.6.20：對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - 1.9.0：將此警告提升為錯誤

### 禁止在建構器推斷情境中隱式將型別變數推斷為上界

> **問題**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **元件**: 核心語言
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Kotlin 2.0 將禁止在建構器推斷 lambda 函式作用域中，於缺少任何使用點型別資訊的情況下，將型別變數推斷為對應型別參數的上界，這與目前在其他情境中的處理方式相同。
>
> **棄用週期**:
>
> - 1.7.20：當型別參數在缺少使用點型別資訊的情況下被推斷為宣告的上界時，報告警告（或在漸進模式下報告錯誤）
> - 2.0.0：將警告提升為錯誤

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，警告潛在的重載解析變更

> **問題**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **元件**: 核心語言 / kotlin-stdlib
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: 預計在 Kotlin 1.9 中，標準進度（progressions）及其繼承的具體範圍（ranges）將實作 `Collection` 介面。如果某個方法有兩個重載，一個接受元素而另一個接受集合，這可能會導致重載解析時選取不同的重載。
> 當此類重載方法以範圍或進度引數呼叫時，Kotlin 將透過報告警告或錯誤來使此情況顯現。
>
> **棄用週期**:
>
> - 1.6.20：當重載方法以標準進度或其範圍繼承者作為引數呼叫時，如果此進度/範圍未來實作 `Collection` 介面會導致在此呼叫中選取另一個重載，則報告警告
> - 1.8.0：將此警告提升為錯誤
> - 2.1.0：停止報告錯誤，在進度中實作 `Collection` 介面，從而改變受影響情況下的重載解析結果

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **問題**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **元件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: `kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至對應的 `kotlinx.*` 套件，以準備將其從 stdlib 中提取。
>
> **棄用週期**:
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議將上述新 API 作為替代品
> - 1.6.0：將棄用級別提升為錯誤
> - 1.8.20：從 stdlib 中移除針對 JS-IR 目標的棄用函式
> - &gt;= 2.0：將 kotlinx.* 套件中的 API 移至單獨的函式庫

### 棄用部分僅限 JS 的 API

> **問題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **元件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: stdlib 中一些僅限 JS 的函式已被棄用並將被移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函式的陣列 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期**:
>
> - 1.6.0：對受影響的函式發出警告並將其棄用
> - 1.9.0：將棄用級別提升為錯誤
> - &gt;=2.0：從公共 API 中移除棄用函式

## 工具

### 從 Gradle 設定中移除 enableEndorsedLibs 標誌

> **問題**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **元件**: Gradle
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: `enableEndorsedLibs` 標誌在 Gradle 設定中不再受支援。
>
> **棄用週期**:
>
> - < 1.9.0：`enableEndorsedLibs` 標誌在 Gradle 設定中受支援
> - 1.9.0：`enableEndorsedLibs` 標誌在 Gradle 設定中**不**受支援

### 移除 Gradle 慣例

> **問題**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **元件**: Gradle
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: Gradle 慣例在 Gradle 7.1 中被棄用，並已在 Gradle 8 中移除。
>
> **棄用週期**:
>
> - 1.7.20：Gradle 慣例被棄用
> - 1.9.0：Gradle 慣例被移除

### 移除 KotlinCompile 任務的 classpath 屬性

> **問題**: [KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **元件**: Gradle
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: `KotlinCompile` 任務的 `classpath` 屬性已移除。
>
> **棄用週期**:
>
> - 1.7.0：`classpath` 屬性被棄用
> - 1.8.0：將棄用級別提升為錯誤
> - 1.9.0：從公共 API 中移除棄用函式

### 棄用 kotlin.internal.single.build.metrics.file 屬性

> **問題**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **元件**: Gradle
>
> **不相容變更類型**: 來源
>
> **簡短摘要**: 棄用用於定義建構報告單一檔案的 `kotlin.internal.single.build.metrics.file` 屬性。
> 請改用 `kotlin.build.report.single_file` 屬性，並搭配 `kotlin.build.report.output=single_file`。
>
> **棄用週期**:
>
> * 1.8.0：將棄用級別提升為警告
> * &gt;= 1.9：刪除該屬性