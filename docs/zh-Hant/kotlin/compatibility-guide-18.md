[//]: # (title: Kotlin 1.8.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_與 _[舒適的更新](kotlin-evolution-principles.md)_是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則強調這種移除應事先進行充分溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道宣布（如更新日誌或編譯器警告），本文件對其進行了全面總結，為從 Kotlin 1.7 遷移到 Kotlin 1.8 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再通過編譯。
- _二進位 (binary)_：如果交換兩個二進位構件不會導致載入或連結錯誤，則稱它們為二進位相容。
- _行為 (behavioral)_：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅針對純 Kotlin。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文件討論範圍內。

## 語言

<!--
### 標題

> **問題**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**:
>
> **棄用週期**:
>
> - 1.6.20: 報告警告
> - 1.8.0: 將警告升級為錯誤
-->

### 禁止將 super 呼叫委託給抽象父類別成員

> **問題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
> 
> **簡短摘要**: 當明確或隱式的 super 呼叫被委託給父類別的「抽象」成員時，即使父介面中存在預設實作，Kotlin 也會報告編譯錯誤。
>
> **棄用週期**:
>
> - 1.5.20: 當使用未覆寫所有抽象成員的非抽象類別時，引入警告。
> - 1.7.0: 如果 super 呼叫實際上存取了來自父類別的抽象成員，則報告警告。
> - 1.7.0: 如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則在所有受影響的情況下報告錯誤；在漸進模式下報告錯誤。
> - 1.8.0: 在宣告包含來自父類別且未覆寫之抽象方法的具體類別，以及 `Any` 的方法在父類別中被覆寫為抽象且被 super 呼叫的情況下，報告錯誤。
> - 1.9.0: 在所有受影響的情況下報告錯誤，包括對父類別抽象方法的明確 super 呼叫。

### 棄用 when-with-subject 中令人困惑的語法

> **問題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.6 棄用了 `when` 條件運算式中幾種令人困惑的語法結構。
>
> **棄用週期**:
>
> - 1.6.20: 對受影響的運算式引入棄用警告。
> - 1.8.0: 將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時恢復到 1.8 之前的行為。
> - &gt;= 1.9: 將某些棄用的結構重新用於新的語言特性。

### 防止不同數值型別之間的隱式強制轉換

> **問題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **組建**: Kotlin/JVM
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: 在語義上僅需要向下轉型 (downcast) 為基本數值型別的情況下，Kotlin 將避免自動將數值轉換為該型別。
>
> **棄用週期**:
>
> - < 1.5.30: 在所有受影響情況下維持舊行為。
> - 1.5.30: 修正產生的屬性委託存取子中的向下轉型行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 修正之前的行為。
> - &gt;= 1.9: 修正其他受影響情況下的向下轉型行為。

### 使密封類別的私有建構函式真正私有

> **問題**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 在放寬了專案結構中密封類別繼承者宣告位置的限制後，密封類別建構函式的預設可見性變成了 protected。然而，直到 1.8 版本，Kotlin 仍允許在這些類別的作用域之外呼叫明確宣告為 private 的密封類別建構函式。
>
> **棄用週期**:
>
> - 1.6.20: 在類別外部呼叫密封類別的私有建構函式時報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 對私有建構函式使用預設可見性規則（僅當呼叫位於對應類別內部時，才能解析對私有建構函式的呼叫），可以透過指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 編譯器引數暫時恢復舊行為。

### 禁止在產生器推論上下文中的不相容數值型別上使用運算子 ==

> **問題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.8 將禁止在產生器推論 (builder inference) Lambda 函式的作用域中，對不相容的數值型別（例如 `Int` 和 `Long`）使用運算子 `==`，這與目前在其他上下文中的做法一致。
>
> **棄用週期**:
>
> - 1.6.20: 當在不相容的數值型別上使用運算子 `==` 時報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暫時恢復到 1.8 之前的行為。

### 禁止在 Elvis 運算子右側使用沒有 else 的 if 以及非窮舉式的 when

> **問題**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.8 將禁止在 Elvis 運算子 (`?:`) 的右側使用非窮舉式的 `when` 或沒有 `else` 分支的 `if` 運算式。以前，如果 Elvis 運算子的結果不作為運算式使用，則是允許的。
>
> **棄用週期**:
>
> - 1.6.20: 對此類非窮舉式的 if 和 when 運算式報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將此警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暫時恢復到 1.8 之前的行為。

### 禁止在泛型型別別名用法中違反上限（一個型別參數用於別名型別的多個型別引數）

> **問題**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 在一個型別別名參數用於別名型別的多個型別引數的情況下（例如 `typealias Alias<T> = Base<T, T>`），Kotlin 1.8 將禁止使用違反別名型別對應型別參數上限 (upper bound) 限制的型別引數。
>
> **棄用週期**:
>
> - 1.7.0: 當型別別名的用法中，型別引數違反了別名型別對應型別參數的上限約束時，報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將此警告升級為錯誤，可以使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暫時恢復到 1.8 之前的行為。

### 禁止在泛型型別別名用法中違反上限（型別參數用於別名型別之型別引數的泛型型別引數）

> **問題**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 當型別別名參數用作別名型別之型別引數的泛型型別引數時（例如 `typealias Alias<T> = Base<List<T>>`），Kotlin 將禁止使用違反別名型別對應型別參數上限限制的型別引數。
>
> **棄用週期**:
>
> - 1.8.0: 當泛型型別別名用法中的型別引數違反了別名型別對應型別參數的上限約束時，報告警告。
> - &gt;=1.10: 將警告升級為錯誤。

### 禁止在委託內部使用為擴充屬性宣告的型別參數

> **問題**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.8 將禁止將泛型型別上的擴充屬性委託給以不安全方式使用接收端型別參數的泛型型別。
>
> **棄用週期**:
>
> - 1.6.0: 當將擴充屬性委託給以特定方式使用從委託屬性型別引數推斷出的型別參數的型別時，報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暫時恢復到 1.8 之前的行為。

### 禁止在 suspend 函式上使用 @Synchronized 註解

> **問題**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.8 將禁止在 suspend 函式上放置 `@Synchronized` 註解，因為不應允許在同步區塊內發生掛起呼叫。
>
> **棄用週期**:
>
> - 1.6.0: 對標有 `@Synchronized` 註解的 suspend 函式報告警告，在漸進模式下該警告會被報告為錯誤。
> - 1.8.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-SynchronizedSuspendError` 暫時恢復到 1.8 之前的行為。

### 禁止使用展開運算子將引數傳遞給非變數參數

> **問題**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 曾在特定條件下允許使用展開運算子 (`*`) 將陣列傳遞給非變數 (non-vararg) 陣列參數。自 Kotlin 1.8 起，這將被禁止。
>
> **棄用週期**:
>
> - 1.6.0: 在預期為非變數陣列參數的地方使用展開運算子時報告警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暫時恢復到 1.8 之前的行為。

### 禁止在傳遞給按 Lambda 回傳型別多載之函式的 Lambda 中違反 null 安全性

> **問題**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 當多載不允許可為 null 的回傳型別時，Kotlin 1.8 將禁止從傳遞給按這些 Lambda 回傳型別多載之函式的 Lambda 中回傳 `null`。以前，如果 `null` 是從 `when` 運算子的其中一個分支回傳的，則是允許的。
>
> **棄用週期**:
>
> - 1.6.20: 報告型別不相符警告（或在漸進模式下報告錯誤）。
> - 1.8.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暫時恢復到 1.8 之前的行為。

### 在公開簽章中近似區域型別時保持可 null 性

> **問題**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼, 二進位
>
> **簡短摘要**: 當從沒有明確指定回傳型別的運算式主體函式回傳區域或匿名型別時，Kotlin 編譯器會使用該型別的已知父型別來推斷（或近似）回傳型別。在此過程中，編譯器可能會在實際上可能回傳 null 值的情況下推斷出不可為 null 的型別。
>
> **棄用週期**:
>
> - 1.8.0: 使用靈活 (flexible) 父型別來近似靈活型別。
> - 1.8.0: 當宣告被推斷為應為可為 null 但卻為不可為 null 的型別時報告警告，提示使用者明確指定型別。
> - 1.9.0: 使用可為 null 的父型別來近似可為 null 的型別，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時恢復到 1.9 之前的行為。

### 不透過覆寫傳播棄用狀態

> **問題**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將不再把父類別中已棄用成員的棄用狀態傳播到子類別中的覆寫成員，從而提供一種明確的機制來棄用父類別成員，同時保持子類別中的成員不被棄用。
>
> **棄用週期**:
>
> - 1.6.20: 報告警告，內容包含未來行為變更的訊息，並提示隱藏此警告或在覆寫已棄用成員時明確寫上 `@Deprecated` 註解。
> - 1.9.0: 停止向覆寫成員傳播棄用狀態。此變更在漸進模式下也會立即生效。

### 禁止在產生器推論上下文中將型別變數隱式推斷為上限

> **問題**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止在產生器推論 Lambda 函式的作用域中，於缺乏任何使用點型別資訊的情況下將型別變數推斷為對應型別參數的上限，這與目前在其他上下文中的做法一致。
>
> **棄用週期**:
>
> - 1.7.20: 在缺乏使用點型別資訊的情況下，當型別參數被推斷為宣告的上限時，報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暫時恢復到 1.9 之前的行為。

### 禁止在註解類別中除參數宣告以外的任何地方使用集合常值

> **問題**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 允許以受限的方式使用集合常值——用於將陣列傳遞給註解類別的參數，或為這些參數指定預設值。然而除此之外，Kotlin 曾允許在註解類別內部的任何其他地方使用集合常值，例如在其巢狀物件中。Kotlin 1.9 將禁止在註解類別中除參數預設值以外的任何地方使用集合常值。
>
> **棄用週期**:
>
> - 1.7.0: 對註解類別巢狀物件中的陣列常值報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤。

### 禁止在預設值運算式中前向引用具有預設值的參數

> **問題**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止在其他參數的預設值運算式中前向引用具有預設值的參數。這確保了當在預設值運算式中存取參數時，該參數已經具有傳遞給函式的值或由其自身的預設值運算式初始化的值。
>
> **棄用週期**:
>
> - 1.7.0: 當一個具有預設值的參數在另一個位於其之前的參數預設值中被引用時，報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時恢復到 1.9 之前的行為。

### 禁止對內聯功能參數進行擴充呼叫

> **問題**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 雖然 Kotlin 允許將內聯 (inline) 功能參數作為接收端傳遞給另一個內聯函式，但在編譯此類程式碼時總是會導致編譯器異常。Kotlin 1.9 將禁止這種做法，從而報告錯誤而不是導致編譯器崩潰。
>
> **棄用週期**:
>
> - 1.7.20: 對內聯功能參數上的內聯擴充呼叫報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤。

### 禁止使用匿名函式引數呼叫名為 suspend 的中綴函式

> **問題**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將不再允許呼叫名為 `suspend` 且具有單個以匿名函式常值形式傳遞的功能型別引數的中綴 (infix) 函式。
>
> **棄用週期**:
>
> - 1.7.20: 對帶有匿名函式常值的 suspend 中綴呼叫報告警告。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時恢復到 1.9 之前的行為。
> - &gt;=1.10: 變更剖析器解釋 `suspend fun` 標記序列的方式。

### 禁止在內部類別中違反型別參數差異性地使用擷取的型別參數

> **問題**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止在外部類別的內部類別中，於違反型別參數宣告差異性的位置使用具有 `in` 或 `out` 差異性 (variance) 的外部類別型別參數。
>
> **棄用週期**:
>
> - 1.7.0: 當外部類別型別參數的使用位置違反該參數的差異性規則時，報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時恢復到 1.9 之前的行為。

### 禁止在複合指派運算子中遞迴呼叫沒有明確回傳型別的函式

> **問題**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止在函式體內的複合指派運算子引數中呼叫沒有明確指定回傳型別的函式，這與目前在該函式體內其他運算式中的做法一致。
>
> **棄用週期**:
>
> - 1.7.0: 當沒有明確指定回傳型別的函式在該函式體的複合指派運算子引數中被遞迴呼叫時，報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤。

### 禁止在預期為 @NotNull T 但給定具有可為 null 邊界的 Kotlin 泛型參數時進行不健全的呼叫

> **問題**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **組建**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止在 Java 方法的 `@NotNull` 註解參數中傳遞潛在可為 null 泛型型別值的微調方法呼叫。
>
> **棄用週期**:
>
> - 1.5.20: 當在預期為不可為 null 型別的地方傳遞無約束的泛型型別參數時，報告警告。
> - 1.9.0: 報告型別不相符錯誤而不是上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時恢復到 1.8 之前的行為。

### 禁止從列舉項目初始設定式存取列舉類別之伴隨物件的成員

> **問題**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **組建**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.9 將禁止從列舉項目初始設定式對列舉伴隨物件進行各種形式的存取。
>
> **棄用週期**:
>
> - 1.6.20: 對此類伴隨成員存取報告警告（或在漸進模式下報告錯誤）。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時恢復到 1.8 之前的行為。

### 棄用並移除 Enum.declaringClass 虛擬屬性

> **問題**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **組建**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 儘管 `java.lang.Enum` 的 `getDeclaringClass()` 方法在 Kotlin `Enum` 型別中不可用，但 Kotlin 曾允許在 `Enum` 值上使用該方法產生的虛擬屬性 `declaringClass`。Kotlin 1.9 將禁止使用此屬性，建議遷移到擴充屬性 `declaringJavaClass`。
>
> **棄用週期**:
>
> - 1.7.0: 對 `declaringClass` 屬性的使用報告警告（或在漸進模式下報告錯誤），並建議遷移到 `declaringJavaClass` 擴充。
> - 1.9.0: 將警告升級為錯誤，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時恢復到 1.9 之前的行為。
> - &gt;=1.10: 移除 `declaringClass` 虛擬屬性。

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **問題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **組建**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.6.20 警告關於使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式。
>
> **棄用週期**:
>
> - 1.6.20: 對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告。
> - &gt;= 1.9: 將此警告升級為錯誤。

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，警告潛在的多載解析變更

> **問題**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **組建**: 核心語言 / kotlin-stdlib
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 計劃在 Kotlin 1.9 的標準數列 (progression) 和從中繼承的具體範圍 (range) 中實作 `Collection` 介面。如果某個方法有兩個多載，一個接受元素而另一個接受集合，這可能會導致多載解析中選擇不同的多載。Kotlin 將透過在以範圍或數列引數呼叫此類多載方法時報告警告或錯誤，來使這種情況透明化。
>
> **棄用週期**:
>
> - 1.6.20: 當以標準數列或其範圍繼承者作為引數呼叫多載方法時，如果該數列/範圍實作 `Collection` 介面會導致未來在該呼叫中選擇另一個多載，則報告警告。
> - 1.8.0: 將此警告升級為錯誤。
> - 1.9.0: 停止報告錯誤，在數列中實作 `Collection` 介面，從而變更受影響情況下的多載解析結果。

### 將宣告從 kotlin.dom 和 kotlin.browser 封裝遷移到 kotlinx.*

> **問題**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **組建**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: `kotlin.dom` 和 `kotlin.browser` 封裝中的宣告將移至對應的 `kotlinx.*` 封裝，以便準備將它們從 stdlib 中提取出來。
>
> **棄用週期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 封裝中引入替代 API。
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 封裝中的 API，並建議使用上述新 API 作為替代。
> - 1.6.0: 將棄用級別升級為錯誤。
> - 1.8.20: 從 stdlib 的 JS-IR 目標中移除棄用的函式。
> - &gt;= 1.9: 將 kotlinx.* 封裝中的 API 移至單獨的程式庫。

### 棄用某些僅限 JS 的 API

> **問題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組建**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: stdlib 中許多僅限 JS 的函式已被棄用並準備移除。包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及陣列上接受比較函式的 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期**:
>
> - 1.6.0: 對受影響的函式發出棄用警告。
> - 1.9.0: 將棄用級別升級為錯誤。
> - &gt;=1.10.0: 從公開 API 中移除棄用的函式。

## 工具

### 提高 KotlinCompile 任務之 classpath 屬性的棄用級別

> **問題**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **組建**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: `KotlinCompile` 任務的 `classpath` 屬性已被棄用。
>
> **棄用週期**:
>
> - 1.7.0: 棄用 `classpath` 屬性。
> - 1.8.0: 將棄用級別升級為錯誤。
> - &gt;=1.9.0: 從公開 API 中移除棄用的函式。

### 移除 kapt.use.worker.api Gradle 屬性

> **問題**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **組建**: Gradle
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: 移除允許透過 Gradle Workers API 執行 kapt 的 `kapt.use.worker.api` 屬性（預設值：true）。
>
> **棄用週期**:
>
> - 1.6.20: 將棄用級別升級為警告。
> - 1.8.0: 移除此屬性。

### 移除 kotlin.compiler.execution.strategy 系統屬性

> **問題**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **組建**: Gradle
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: 移除用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`。
>
> **棄用週期:**
>
> - 1.7.0: 將棄用級別升級為警告。
> - 1.8.0: 移除該屬性。

### 編譯器選項變更

> **問題**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **組建**: Gradle
>
> **不相容變更類型**: 原始碼, 二進位
>
> **簡短摘要**: 此變更可能會影響 Gradle 外掛程式作者。在 `kotlin-gradle-plugin` 中，某些內部型別增加了額外的泛型參數（您應該添加泛型型別或 `*`）。`KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。`KotlinJsCompilerOptions.outputFile` 及相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。`kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在未來的版本中棄用。`compilerOptions` 和 `kotlinOptions` 不能在任務執行階段更改（請參閱 [Kotlin 1.8 的新功能](whatsnew18.md#limitations)中的一個例外）。`freeCompilerArgs` 回傳一個不可變的 `List<String>` – `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。允許使用舊 JVM 後端的 `useOldBackend` 屬性已被移除。
>
> **棄用週期:**
>
> - 1.8.0: `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile` 及相關的 `KotlinJsOptions.outputFile` 選項已棄用。允許使用舊 JVM 後端的 `useOldBackend` 屬性已被移除。

### 棄用 kotlin.internal.single.build.metrics.file 屬性

> **問題**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **組建**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 棄用用於定義單個建置報告檔案的 `kotlin.internal.single.build.metrics.file` 屬性。請改用屬性 `kotlin.build.report.single_file` 並配合 `kotlin.build.report.output=single_file`。
>
> **棄用週期:**
>
> - 1.8.0: 將棄用級別升級為警告。
> &gt;= 1.9: 刪除該屬性。