[//]: # (title: Kotlin 1.8 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出，阻礙語言演進的結構應被移除，而後者則說明，此移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）宣布，但本文總結了所有變更，為從 Kotlin 1.7 遷移到 Kotlin 1.8 提供了完整的參考。

## 基本術語

本文中我們介紹了幾種相容性：

- _原始碼_：原始碼不相容變更會使過去正常編譯（沒有錯誤或警告）的程式碼不再能夠編譯
- _二進位_：如果互換兩個二進位成品不會導致載入或連結錯誤，則稱其為二進位相容
- _行為_：如果相同的程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅針對純 Kotlin 程式碼。從其他語言（例如 Java）的角度來看 Kotlin 程式碼的相容性不在本文的範圍之內。

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

### 禁止將父類別呼叫委派給抽象父類別成員

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
> 
> **Short summary**: Kotlin 將會報告編譯錯誤，當明確或隱式的父類別呼叫被委派給父類別的 _抽象_ 成員時，即使父介面中有預設實作
>
> **Deprecation cycle**:
>
> - 1.5.20: 當使用未覆寫所有抽象成員的非抽象類別時，報告警告
> - 1.7.0: 如果父類別呼叫實際上存取了父類別中的抽象成員，則報告警告
> - 1.7.0: 如果啟用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則在所有受影響的情況下報告錯誤；在漸進模式下報告錯誤
> - 1.8.0: 在宣告一個具體類別，其中包含來自父類別的未覆寫抽象方法，以及 `Any` 方法的父類別呼叫在父類別中被覆寫為抽象的情況下報告錯誤
> - 1.9.0: 在所有受影響的情況下報告錯誤，包括明確的父類別呼叫一個來自父類別的抽象方法

### 在 when 帶主題的語句中棄用令人困惑的語法

> **Issue**: [KT-48385](https://youtrack.com/issue/KT-48385)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.6 棄用了一些在 `when` 條件表達式中令人困惑的語法結構
>
> **Deprecation cycle**:
>
> - 1.6.20: 對受影響的表達式引入棄用警告
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時恢復到 1.8 之前的行為
> - &gt;= 1.9: 將一些棄用的結構重新用於新的語言功能

### 防止不同數值型別之間的隱式強制轉換

> **Issue**: [KT-48645](https://youtrack.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為
>
> **Short summary**: Kotlin 將避免自動將數值轉換為基本數值型別，在語義上只需要將其向下轉換為該型別的情況
>
> **Deprecation cycle**:
>
> - < 1.5.30: 在所有受影響的情況下採用舊行為
> - 1.5.30: 修復生成屬性委派存取器中的向下轉換行為，可使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 之前的修復行為
> - &gt;= 1.9: 在其他受影響的情況下修復向下轉換行為

### 讓密封類別的私有建構子真正私有化

> **Issue**: [KT-44866](https://youtrack.com/issue/KT-44866)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 在放寬密封類別的繼承者在專案結構中宣告位置的限制後，密封類別建構子的預設可見性變為 protected。然而，直到 1.8 版本，Kotlin 仍然允許在這些類別的範圍之外呼叫明確宣告的密封類別私有建構子
>
> **Deprecation cycle**:
>
> - 1.6.20: 當密封類別的私有建構子在該類別外部被呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 對私有建構子使用預設可見性規則（對私有建構子的呼叫只能在對應的類別內部解析），可透過指定 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 編譯器參數暫時恢復舊行為

### 在建構器推斷上下文中使用操作符 == 於不相容數值型別上時禁止

> **Issue**: [KT-45508](https://youtrack.com/issue/KT-45508)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止在建構器推斷 lambda 函式的範圍內，對不相容的數值型別（例如 `Int` 和 `Long`）使用操作符 `==`，這與其目前在其他上下文中的處理方式相同
>
> **Deprecation cycle**:
>
> - 1.6.20: 當操作符 `==` 用於不相容數值型別時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暫時恢復到 1.8 之前的行為

### 禁止在 Elvis 操作符右側使用沒有 else 的 if 和非窮盡的 when

> **Issue**: [KT-44705](https://youtrack.com/issue/KT-44705)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止在 Elvis 操作符（`?:`）的右側使用非窮盡的 `when` 或沒有 `else` 分支的 `if` 表達式。以前，如果 Elvis 操作符的結果未用作表達式，則允許這樣做
>
> **Deprecation cycle**:
>
> - 1.6.20: 對於此類非窮盡的 if 和 when 表達式報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暫時恢復到 1.8 之前的行為

### 禁止泛型型別別名使用中違反上限（一個型別參數用於別名型別的多個型別引數中）

> **Issues**: [KT-29168](https://youtrack.com/issue/KT-29168)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止使用帶有型別引數的型別別名，這些型別引數違反了別名型別的相應型別參數的上限限制，其情況是一個型別別名型別參數在別名型別的多個型別引數中使用，例如 `typealias Alias<T> = Base<T, T>`
>
> **Deprecation cycle**:
>
> - 1.7.0: 對於使用帶有型別引數的型別別名，且這些型別引數違反了別名型別的相應型別參數的上限限制時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暫時恢復到 1.8 之前的行為

### 禁止泛型型別別名使用中違反上限（型別參數用於別名型別的型別引數的泛型型別引數中）

> **Issue**: [KT-54066](https://youtrack.com/issue/KT-54066)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 將禁止使用帶有型別引數的型別別名，這些型別引數違反了別名型別的相應型別參數的上限限制，其情況是型別別名型別參數用作別名型別的型別引數的泛型型別引數，例如 `typealias Alias<T> = Base<List<T>>`
>
> **Deprecation cycle**:
>
> - 1.8.0: 當泛型型別別名使用中，其型別引數違反了別名型別的相應型別參數的上限限制時，報告警告
> - &gt;=1.10: 將警告提升為錯誤

### 禁止在委託內部使用為擴展屬性宣告的型別參數

> **Issue**: [KT-24643](https://youtrack.com/issue/KT-24643)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止在泛型型別上將擴展屬性不安全地委託給使用接收者型別參數的泛型型別
>
> **Deprecation cycle**:
>
> - 1.6.0: 當將擴展屬性委託給以特定方式使用從委託屬性的型別引數推斷出的型別參數的型別時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暫時恢復到 1.8 之前的行為

### 禁止在 suspend 函式上使用 @Synchronized 註解

> **Issue**: [KT-48516](https://youtrack.com/issue/KT-48516)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止在 suspend 函式上放置 `@Synchronized` 註解，因為不應允許在同步區塊內部發生 suspend 呼叫
>
> **Deprecation cycle**:
>
> - 1.6.0: 對於帶有 `@Synchronized` 註解的 suspend 函式報告警告，在漸進模式下將警告報告為錯誤
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-SynchronizedSuspendError` 暫時恢復到 1.8 之前的行為

### 禁止使用展開運算符將參數傳遞給非可變引數（non-vararg）參數

> **Issue**: [KT-48162](https://youtrack.com/issue/KT-48162)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 曾經允許在某些條件下使用展開運算符（`*`）將陣列傳遞給非可變引數陣列參數。從 Kotlin 1.8 開始，這將被禁止
>
> **Deprecation cycle**:
>
> - 1.6.0: 當預期為非可變引數陣列參數時，使用展開運算符報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暫時恢復到 1.8 之前的行為

### 禁止在傳遞給透過 lambda 回傳型別重載的函式的 lambda 中違反 null 安全性

> **Issue**: [KT-49658](https://youtrack.com/issue/KT-49658)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.8 將禁止從傳遞給透過 lambda 回傳型別重載的函式的 lambda 中回傳 `null`，如果重載不允許可空的回傳型別。以前，當從 `when` 運算符的一個分支回傳 `null` 時，這是允許的
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告型別不匹配警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暫時恢復到 1.8 之前的行為

### 在公開簽名中近似本地型別時保留可空性

> **Issue**: [KT-53982](https://youtrack.com/issue/KT-53982)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼, 二進位
>
> **Short summary**: 當本地或匿名型別從沒有明確指定回傳型別的表達式主體函式中回傳時，Kotlin 編譯器會使用該型別的已知超型別推斷（或近似）回傳型別。在此過程中，編譯器可能會推斷出非可空型別，而實際上可能會回傳 `null` 值
>
> **Deprecation cycle**:
>
> - 1.8.0: 透過彈性超型別近似彈性型別
> - 1.8.0: 當推斷出的宣告具有非可空型別而實際上應該是可空型別時，報告警告，提示使用者明確指定型別
> - 1.9.0: 透過可空超型別近似可空型別，可使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時恢復到 1.9 之前的行為

### 不透過覆寫傳播棄用

> **Issue**: [KT-47902](https://youtrack.com/issue/KT-47902)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將不再將棄用從父類別中的已棄用成員傳播到子類別中覆寫該成員的成員，從而提供一種明確的機制，用於棄用父類別的成員，同時在子類別中保留其非棄用狀態
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告警告，其中包含未來行為變更的訊息，並提示使用者抑制此警告或在已棄用成員的覆寫上明確寫入 `@Deprecated` 註解
> - 1.9.0: 停止將棄用狀態傳播到被覆寫的成員。此變更在漸進模式下也立即生效

### 禁止在建構器推斷上下文中的上限中隱式推斷型別變數

> **Issue**: [KT-47986](https://youtrack.com/issue/KT-47986)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止在建構器推斷 lambda 函式的範圍內，在沒有任何使用現場型別資訊的情況下，將型別變數推斷為相應型別參數的上限，這與其目前在其他上下文中的處理方式相同
>
> **Deprecation cycle**:
>
> - 1.7.20: 在沒有使用現場型別資訊的情況下，當型別參數被推斷為宣告的上限時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暫時恢復到 1.9 之前的行為

### 禁止在註解類別中除參數宣告以外的任何地方使用集合字面值

> **Issue**: [KT-39041](https://youtrack.com/issue/KT-39041)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 允許以受限制的方式使用集合字面值——用於將陣列傳遞給註解類別的參數或為這些參數指定預設值。然而除此之外，Kotlin 允許在註解類別中的任何其他地方使用集合字面值，例如在其巢狀物件中。Kotlin 1.9 將禁止在註解類別中除參數的預設值以外的任何地方使用集合字面值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 對於註解類別中巢狀物件中的陣列字面值報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止在預設值表達式中向前引用帶有預設值的參數

> **Issue**: [KT-25694](https://youtrack.com/issue/KT-25694)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止在其他參數的預設值表達式中向前引用帶有預設值的參數。這確保了在預設值表達式中存取參數時，它將已經具有傳遞給函式的值或由其自身的預設值表達式初始化的值
>
> **Deprecation cycle**:
>
> - 1.7.0: 當帶有預設值的參數在位於其之前的另一個參數的預設值中被引用時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時恢復到 1.9 之前的行為

### 禁止在 inline 函式參數上進行擴展呼叫

> **Issue**: [KT-52502](https://youtrack.com/issue/KT-52502)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 雖然 Kotlin 允許將 inline 函式參數作為接收者傳遞給另一個 inline 函式，但在編譯此類程式碼時總是會導致編譯器異常。Kotlin 1.9 將禁止這樣做，從而報告錯誤而不是使編譯器崩潰
>
> **Deprecation cycle**:
>
> - 1.7.20: 對於在 inline 函式參數上的 inline 擴展呼叫報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤

### 禁止呼叫以匿名函式引數命名的 infix 函式 suspend

> **Issue**: [KT-49264](https://youtrack.com/issue/KT-49264)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將不再允許呼叫名稱為 `suspend` 且帶有單個函式型別引數作為匿名函式字面值的 infix 函式
>
> **Deprecation cycle**:
>
> - 1.7.20: 對於帶有匿名函式字面值的 suspend infix 呼叫報告警告
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時恢復到 1.9 之前的行為
> - &gt;=1.10: 變更解析器對 `suspend fun` 詞元序列的解釋方式

### 禁止在內部類別中使用捕獲的型別參數，違反其型變

> **Issue**: [KT-50947](https://youtrack.com/issue/KT-50947)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止在外部類別的內部類別中，在違反該型別參數宣告型變的位置上使用帶有 `in` 或 `out` 型變的外部類別的型別參數
>
> **Deprecation cycle**:
>
> - 1.7.0: 當外部類別的型別參數使用位置違反該參數的型變規則時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時恢復到 1.9 之前的行為

### 禁止在複合賦值運算符中遞迴呼叫沒有明確回傳型別的函式

> **Issue**: [KT-48546](https://youtrack.com/issue/KT-48546)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止在函式體內部，複合賦值運算符的引數中呼叫沒有明確指定回傳型別的函式，這與其目前在該函式體內部的其他表達式中的處理方式相同
>
> **Deprecation cycle**:
>
> - 1.7.0: 當沒有明確指定回傳型別的函式在其函式體內部的複合賦值運算符引數中被遞迴呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤

### 禁止對預期為 @NotNull T 而給定帶有可空邊界的 Kotlin 泛型參數進行不健全的呼叫

> **Issue**: [KT-36770](https://youtrack.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止方法呼叫，其中將潛在可空泛型型別的值傳遞給 Java 方法的 `@NotNull` 註解參數
>
> **Deprecation cycle**:
>
> - 1.5.20: 當在預期非空型別的位置傳遞未受約束的泛型型別參數時，報告警告
> - 1.9.0: 報告型別不匹配錯誤而非上述警告，可使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時恢復到 1.8 之前的行為

### 禁止從列舉的條目初始化器中存取列舉類別伴侶的成員

> **Issue**: [KT-49110](https://youtrack.com/issue/KT-49110)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.9 將禁止從列舉條目初始化器中對列舉的伴侶物件進行所有形式的存取
>
> **Deprecation cycle**:
>
> - 1.6.20: 對於此類伴侶成員存取報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時恢復到 1.8 之前的行為

### 棄用並移除 Enum.declaringClass 合成屬性

> **Issue**: [KT-49653](https://youtrack.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 曾經允許在從底層 Java 類別 `java.lang.Enum` 的 `getDeclaringClass()` 方法產生的 `Enum` 值上使用合成屬性 `declaringClass`，儘管此方法對 Kotlin 的 `Enum` 型別不可用。Kotlin 1.9 將禁止使用此屬性，建議改用擴展屬性 `declaringJavaClass`
>
> **Deprecation cycle**:
>
> - 1.7.0: 對於 `declaringClass` 屬性使用報告警告（或在漸進模式下報告錯誤），建議遷移到 `declaringJavaClass` 擴展
> - 1.9.0: 將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時恢復到 1.9 之前的行為
> - &gt;=1.10: 移除 `declaringClass` 合成屬性

### 棄用編譯器選項 -Xjvm-default 的啟用和相容性模式

> **Issue**: [KT-46329](https://youtrack.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.6.20 針對使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式發出警告
>
> **Deprecation cycle**:
>
> - 1.6.20: 對於 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.9: 將此警告提升為錯誤

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，警告潛在的重載解析變更

> **Issue**: [KT-49276](https://youtrack.com/issue/KT-49276)
>
> **Component**: 核心語言 / kotlin-stdlib
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 計劃在 Kotlin 1.9 中讓標準進程和從它們繼承的具體範圍實作 `Collection` 介面。如果某個方法有兩個重載，一個接受元素而另一個接受集合，這可能會導致不同的重載被選中進行重載解析。當此類重載方法與範圍或進程引數一起呼叫時，Kotlin 將透過報告警告或錯誤來使這種情況可見
>
> **Deprecation cycle**:
>
> - 1.6.20: 當重載方法以標準進程或其範圍繼承者作為引數呼叫時，如果此進程/範圍實作 `Collection` 介面將來會導致在這次呼叫中選擇另一個重載，則報告警告
> - 1.8.0: 將此警告提升為錯誤
> - 1.9.0: 停止報告錯誤，在進程中實作 `Collection` 介面，從而改變受影響情況下的重載解析結果

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 為了從 stdlib 中提取它們，`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至相應的 `kotlinx.*` 套件
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議上述新 API 作為替代
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.8.20: 從 stdlib 中為 JS-IR 目標移除已棄用的函式
> - &gt;= 1.9: 將 kotlinx.* 套件中的 API 移至單獨的函式庫

### 棄用部分僅適用於 JS 的 API

> **Issue**: [KT-48587](https://youtrack.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: stdlib 中的一些僅適用於 JS 的函式已被棄用並將被移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及陣列中接受比較函式的 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0: 帶有警告地棄用受影響的函式
> - 1.9.0: 將棄用級別提升為錯誤
> - &gt;=1.10.0: 從公共 API 中移除已棄用的函式

## 工具

### 提升 KotlinCompile 任務的 classpath 屬性的棄用級別

> **Issue**: [KT-51679](https://youtrack.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: `KotlinCompile` 任務的 `classpath` 屬性已棄用
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 屬性已棄用
> - 1.8.0: 將棄用級別提升為錯誤
> - &gt;=1.9.0: 從公共 API 中移除已棄用的函式

### 移除 kapt.use.worker.api Gradle 屬性

> **Issue**: [KT-48827](https://youtrack.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: 行為
>
> **Short summary**: 移除允許透過 Gradle Workers API 執行 kapt 的 `kapt.use.worker.api` 屬性（預設：true）
>
> **Deprecation cycle**:
>
> - 1.6.20: 將棄用級別提升為警告
> - 1.8.0: 移除此屬性

### 移除 kotlin.compiler.execution.strategy 系統屬性

> **Issue**: [KT-51831](https://youtrack.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: 行為
>
> **Short summary**: 移除用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`
>
> **Deprecation cycle:**
>
> - 1.7.0: 將棄用級別提升為警告
> - 1.8.0: 移除此屬性

### 編譯器選項的變更

> **Issues**: [KT-27301](https://youtrack.com/issue/KT-27301), [KT-48532](https://youtrack.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼, 二進位
>
> **Short summary**: 此變更可能會影響 Gradle 外掛程式作者。在 `kotlin-gradle-plugin` 中，一些內部型別有額外的泛型參數（您應該添加泛型型別或 `*`）。 `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。 `KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。`kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在即將發布的版本中棄用。`compilerOptions` 和 `kotlinOptions` 無法在任務執行階段更改（請參閱 [What's new in Kotlin 1.8](whatsnew18.md#limitations) 中的一個例外）。`freeCompilerArgs` 回傳一個不可變的 `List<String>` – `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。允許使用舊版 JVM 後端的 `useOldBackend` 屬性已移除
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。允許使用舊版 JVM 後端的 `useOldBackend` 屬性已移除。

### 棄用 kotlin.internal.single.build.metrics.file 屬性

> **Issue**: [KT-53357](https://youtrack.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 棄用用於定義單一檔案用於建置報告的 `kotlin.internal.single.build.metrics.file` 屬性。請改用 `kotlin.build.report.single_file` 屬性與 `kotlin.build.report.output=single_file` 
>
> **Deprecation cycle:**
>
> - 1.8.0: 將棄用級別提升為警告
> &gt;= 1.9: 刪除此屬性