[//]: # (title: Kotlin 1.8 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出，阻礙語言演進的結構應被移除；後者則表示，此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）宣佈，但本文件總結了所有變更，為從 Kotlin 1.7 遷移到 Kotlin 1.8 提供了完整的參考資料。

## 基本術語

本文件介紹了幾種相容性：

-   _原始碼相容性_：原始碼不相容的變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
-   _二進位相容性_：如果兩個二進位成品在互相替換時不會導致載入或連結錯誤，則稱它們是二進位相容的。
-   _行為相容性_：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更是行為不相容的。

請記住，這些定義僅適用於純 Kotlin。Kotlin 程式碼從其他語言角度（例如，從 Java）的相容性不在本文件討論範圍內。

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
> **Component**: Core language
>
> **Incompatible change type**: source
> 
> **Short summary**: 當顯式或隱式父類別呼叫被委派給父類別的_抽象_成員時，Kotlin 將報告編譯錯誤，即使父介面中存在預設實作。
>
> **Deprecation cycle**:
>
> - 1.5.20: 當使用未覆寫所有抽象成員的非抽象類別時，發出警告
> - 1.7.0: 如果父類別呼叫實際上存取了父類別的抽象成員，則報告警告
> - 1.7.0: 如果在啟用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容性模式的情況下，在所有受影響的情況下報告錯誤；在漸進模式下報告錯誤
> - 1.8.0: 在宣告具有父類別中未覆寫的抽象方法的具體類別，以及 `Any` 方法的父類別呼叫在父類別中被覆寫為抽象的情況下，報告錯誤
> - 1.9.0: 在所有受影響的情況下報告錯誤，包括對父類別中抽象方法的顯式父類別呼叫

### 棄用 when-with-subject 中令人困惑的語法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 棄用 `when` 條件表達式中一些令人困惑的語法結構
>
> **Deprecation cycle**:
>
> - 1.6.20: 對受影響的表達式引入棄用警告
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時恢復到 1.8 之前的行為
> - `>= 1.9`: 重新利用一些棄用的結構用於新的語言功能

### 防止不同數值類型之間的隱式強制轉換

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 將避免在只需要向下轉型為原始數值類型時，自動將數值轉換為該原始數值類型。
>
> **Deprecation cycle**:
>
> - `< 1.5.30`: 在所有受影響情況下的舊行為
> - 1.5.30: 修正生成屬性委派存取器中的向下轉型行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 修正之前的行為
> - `>= 1.9`: 修正其他受影響情況下的向下轉型行為

### 使密封類別的私有建構函數真正私有

> **Issue**: [KT-44866](https://youtrack.jetbrains.com/issue/KT-44866)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 在放寬密封類別的繼承者可在專案結構中宣告的位置限制後，密封類別建構函數的預設可見性變為 protected。然而，直到 1.8 版，Kotlin 仍然允許在這些類別的範圍之外呼叫顯式宣告的密封類別私有建構函數
>
> **Deprecation cycle**:
>
> - 1.6.20: 當密封類別的私有建構函數在該類別外部被呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 對私有建構函數使用預設可見性規則（私有建構函數的呼叫僅在其對應類別內部才能解析），可以透過指定編譯器參數 `-XXLanguage:-UseConsistentRulesForPrivateConstructorsOfSealedClasses` 暫時恢復舊行為

### 禁止在構建器推斷（builder inference）上下文中使用不相容數值類型上的運算子 ==

> **Issue**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 將禁止在構建器推斷 lambda 函數範圍內，在不相容的數值類型（例如 `Int` 和 `Long`）上使用運算子 `==`，與目前在其他上下文中的處理方式相同
>
> **Deprecation cycle**:
>
> - 1.6.20: 當在不相容的數值類型上使用運算子 `==` 時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProperEqualityChecksInBuilderInferenceCalls` 暫時恢復到 1.8 之前的行為

### 禁止在 Elvis 運算子右側使用沒有 else 的 if 和非窮舉的 when

> **Issue**: [KT-44705](https://youtrack.jetbrains.com/issue/KT-44705)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 將禁止在 Elvis 運算子 (`?:`) 的右側使用非窮舉的 `when` 或沒有 `else` 分支的 `if` 表達式。以前，如果 Elvis 運算子的結果未用作表達式，則允許這樣做
>
> **Deprecation cycle**:
>
> - 1.6.20: 對此類非窮舉的 if 和 when 表達式報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitNonExhaustiveIfInRhsOfElvis` 暫時恢復到 1.8 之前的行為

### 禁止泛型類型別名用法中的上界違規（一個類型參數用於別名類型的多個類型實參）

> **Issues**: [KT-29168](https://youtrack.jetbrains.com/issue/KT-29168)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當一個類型別名類型參數被用於別名類型的多個類型實參時，例如 `typealias Alias<T> = Base<T, T>`，Kotlin 1.8 將禁止使用其類型實參違反相應別名類型參數上界限制的類型別名
>
> **Deprecation cycle**:
>
> - 1.7.0: 對其類型實參違反相應別名類型參數上界約束的類型別名用法報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ReportMissingUpperBoundsViolatedErrorOnAbbreviationAtSupertypes` 暫時恢復到 1.8 之前的行為

### 禁止泛型類型別名用法中的上界違規（一個類型參數用於別名類型的一個類型實參的泛型類型實參）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當類型別名類型參數被用作別名類型的一個類型實參的泛型類型實參時，例如 `typealias Alias<T> = Base<List<T>>`，Kotlin 將禁止使用其類型實參違反相應別名類型參數上界限制的類型別名
>
> **Deprecation cycle**:
>
> - 1.8.0: 當泛型類型別名用法中的類型實參違反相應別名類型參數的上界約束時，報告警告
> - `>=1.10`: 將警告提升為錯誤

### 禁止在委派內使用為擴充屬性宣告的類型參數

> **Issue**: [KT-24643](https://youtrack.jetbrains.com/issue/KT-24643)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 將禁止將泛型類型上的擴充屬性委派給以不安全方式使用接收者類型參數的泛型類型
>
> **Deprecation cycle**:
>
> - 1.6.0: 當將擴充屬性委派給以特定方式使用從委派屬性的類型實參推斷出的類型參數的類型時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ForbidUsingExtensionPropertyTypeParameterInDelegate` 暫時恢復到 1.8 之前的行為

### 禁止在掛起函數上使用 @Synchronized 註解

> **Issue**: [KT-48516](https://youtrack.jetbrains.com/issue/KT-48516)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.8 將禁止在掛起函數上放置 `@Synchronized` 註解，因為不應允許在同步區塊內發生掛起呼叫
>
> **Deprecation cycle**:
>
> - 1.6.0: 對使用 `@Synchronized` 註解的掛起函數報告警告，在漸進模式下將警告報告為錯誤
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-SynchronizedSuspendError` 暫時恢復到 1.8 之前的行為

### 禁止使用展開運算子將參數傳遞給非變長參數

> **Issue**: [KT-48162](https://youtrack.jetbrains.com/issue/KT-48162)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 曾經允許在某些條件下，使用展開運算子 (`*`) 將陣列傳遞給非變長陣列參數。自 Kotlin 1.8 起，這將被禁止
>
> **Deprecation cycle**:
>
> - 1.6.0: 當預期為非變長陣列參數時使用展開運算子時，報告警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ReportNonVarargSpreadOnGenericCalls` 暫時恢復到 1.8 之前的行為

### 禁止將 lambda 傳遞給由 lambda 回傳類型重載的函數時，發生空安全違規

> **Issue**: [KT-49658](https://youtrack.jetbrains.com/issue/KT-49658)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當重載不允許可空回傳類型時，Kotlin 1.8 將禁止從傳遞給由 lambda 回傳類型重載的 lambda 中回傳 `null`。以前，當從 `when` 運算子的一個分支回傳 `null` 時，這是允許的
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告類型不匹配警告（或在漸進模式下報告錯誤）
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-DontLoseDiagnosticsDuringOverloadResolutionByReturnType` 暫時恢復到 1.8 之前的行為

### 在公開簽名中近似本地類型時保留可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 當從沒有明確指定回傳類型的表達式主體函數回傳本地或匿名類型時，Kotlin 編譯器會使用該類型的已知父類型推斷（或近似）回傳類型。在此過程中，編譯器可能會推斷出一個不可空類型，而實際上該函數可能會回傳 `null` 值
>
> **Deprecation cycle**:
>
> - 1.8.0: 透過彈性父類型近似彈性類型
> - 1.8.0: 當一個宣告被推斷為不可空類型但應該是可空類型時，報告警告，提示用戶明確指定類型
> - 1.9.0: 透過可空父類型近似可空類型，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時恢復到 1.9 之前的行為

### 不透過覆寫傳播棄用

> **Issue**: [KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將不再從父類別中的已棄用成員將棄用狀態傳播到子類別中覆寫它的成員，從而提供一種明確的機制來棄用父類別中的成員，同時使其在子類別中保持未棄用狀態
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告一個警告，其中包含未來行為變更的訊息，並提示要麼抑制此警告，要麼在已棄用成員的覆寫上明確寫入 `@Deprecated` 註解
> - 1.9.0: 停止將棄用狀態傳播到被覆寫的成員。此變更在漸進模式下也立即生效

### 禁止在構建器推斷（builder inference）上下文中將類型變量隱式推斷為上界

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 在構建器推斷 lambda 函數範圍內缺少任何使用點類型資訊的情況下，Kotlin 1.9 將禁止將類型變量推斷為相應類型參數的上界，與目前在其他上下文中的處理方式相同
>
> **Deprecation cycle**:
>
> - 1.7.20: 在缺少使用點類型資訊的情況下，當類型參數被推斷為宣告的上界時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ForbidInferringPostponedTypeVariableIntoDeclaredUpperBound` 暫時恢復到 1.9 之前的行為

### 禁止在註解類別中除參數宣告以外的任何地方使用集合字面值

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允許以受限方式使用集合字面值——用於將陣列傳遞給註解類別的參數或為這些參數指定預設值。然而除此之外，Kotlin 曾經允許在註解類別內部的任何其他地方使用集合字面值，例如在其嵌套對象中。Kotlin 1.9 將禁止在註解類別中除其參數預設值以外的任何地方使用集合字面值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 對註解類別中嵌套對象中的陣列字面值報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止在預設值表達式中向前引用帶有預設值的參數

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在其他參數的預設值表達式中向前引用帶有預設值的參數。這確保了當參數在預設值表達式中被存取時，它已經有了值，無論是傳遞給函數的還是由其自身的預設值表達式初始化的
>
> **Deprecation cycle**:
>
> - 1.7.0: 當帶有預設值的參數在位於其之前的另一個參數的預設值中被引用時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時恢復到 1.9 之前的行為

### 禁止對內聯函數參數進行擴充呼叫

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 雖然 Kotlin 曾經允許將內聯函數參數作為接收者傳遞給另一個內聯函數，但在編譯此類程式碼時總是導致編譯器異常。Kotlin 1.9 將禁止這種行為，從而報告錯誤而不是使編譯器崩潰
>
> **Deprecation cycle**:
>
> - 1.7.20: 對內聯函數參數上的內聯擴充呼叫報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止呼叫名為 suspend 且帶有匿名函數實參的中綴函數

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將不再允許呼叫名為 `suspend` 的中綴函數，該函數帶有單個函數類型參數，並作為匿名函數字面值傳遞
>
> **Deprecation cycle**:
>
> - 1.7.20: 對帶有匿名函數字面值的 suspend 中綴呼叫報告警告
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時恢復到 1.9 之前的行為
> - `>=1.10`: 更改解析器解釋 `suspend fun` 詞元序列的方式

### 禁止內部類別中違反變體規則地使用捕獲的類型參數

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在內部類別中，在違反外部類別類型參數所宣告變體規則的位置上，使用該外部類別具有 `in` 或 `out` 變體的類型參數
>
> **Deprecation cycle**:
>
> - 1.7.0: 當外部類別的類型參數使用位置違反該參數的變體規則時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時恢復到 1.9 之前的行為

### 禁止在複合賦值運算子中遞迴呼叫沒有顯式回傳類型的函數

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在函數體內複合賦值運算子的參數中呼叫沒有明確指定回傳類型的函數，就像目前在該函數體內的其他表達式中一樣
>
> **Deprecation cycle**:
>
> - 1.7.0: 當一個沒有明確指定回傳類型的函數在該函數體內的複合賦值運算子參數中被遞迴呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止在預期 @NotNull T 且給定具有可空邊界的 Kotlin 泛型參數時進行不健全呼叫

> **Issue**: [KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止將潛在可空泛型類型的值傳遞給 Java 方法中帶有 `@NotNull` 註解的參數的呼叫
>
> **Deprecation cycle**:
>
> - 1.5.20: 當在預期非空類型時傳遞未約束的泛型類型參數時，報告警告
> - 1.9.0: 報告類型不匹配錯誤而不是上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時恢復到 1.8 之前的行為

### 禁止從列舉類別的條目初始器中存取該列舉的伴隨對象成員

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止從列舉條目初始器中對列舉的伴隨對象進行任何形式的存取
>
> **Deprecation cycle**:
>
> - 1.6.20: 對此類伴隨成員存取報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時恢復到 1.8 之前的行為

### 棄用並移除 Enum.declaringClass 合成屬性

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 曾經允許在從底層 Java 類別 `java.lang.Enum` 的 `getDeclaringClass()` 方法產生的 `Enum` 值上使用合成屬性 `declaringClass`，儘管此方法不適用於 Kotlin `Enum` 類型。Kotlin 1.9 將禁止使用此屬性，建議改為遷移到擴充屬性 `declaringJavaClass`
>
> **Deprecation cycle**:
>
> - 1.7.0: 對 `declaringClass` 屬性使用報告警告（或在漸進模式下報告錯誤），建議遷移到 `declaringJavaClass` 擴充
> - 1.9.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時恢復到 1.9 之前的行為
> - `>=1.10`: 移除 `declaringClass` 合成屬性

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 會對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式的使用發出警告
>
> **Deprecation cycle**:
>
> - 1.6.20: 對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - `>= 1.9`: 將此警告提升為錯誤

## 標準函式庫

### 警告 Range/Progression 開始實作 Collection 時潛在的重載解析變更

> **Issue**: [KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 計劃在標準進程（progression）和從其繼承的具體範圍（range）中實作 `Collection` 介面。如果某個方法有兩個重載，一個接受元素，另一個接受集合，這可能會導致重載解析選擇不同的重載。當使用範圍或進程參數呼叫此類重載方法時，Kotlin 將透過報告警告或錯誤來使這種情況可見
>
> **Deprecation cycle**:
>
> - 1.6.20: 當使用標準進程或其範圍繼承者作為參數呼叫重載方法時，如果此進程/範圍實作 `Collection` 介面導致將來在此呼叫中選擇另一個重載，則報告警告
> - 1.8.0: 將此警告提升為錯誤
> - 1.9.0: 停止報告錯誤，在進程中實作 `Collection` 介面，從而改變受影響情況下的重載解析結果

### 將 kotlin.dom 和 kotlin.browser 套件中的宣告遷移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至相應的 `kotlinx.*` 套件，以準備將它們從標準函式庫中提取出來
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替換 API
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議上述新 API 作為替換
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.8.20: 從 JS-IR 目標的標準函式庫中移除已棄用函數
> - `>= 1.9`: 將 kotlinx.* 套件中的 API 移至單獨的函式庫

### 棄用一些僅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 標準函式庫中許多僅限 JS 的函數已被棄用並將被移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函數的陣列 `sort` 函數，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0: 帶警告地棄用受影響的函數
> - 1.9.0: 將棄用級別提升為錯誤
> - `>=1.10.0`: 從公開 API 中移除已棄用函數

## 工具

### 提升 KotlinCompile 任務的 classpath 屬性的棄用級別

> **Issue**: [KT-51679](https://youtrack.jetbrains.com/issue/KT-51679)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` 任務的 `classpath` 屬性已被棄用
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 屬性已被棄用
> - 1.8.0: 將棄用級別提升為錯誤
> - `>=1.9.0`: 從公開 API 中移除已棄用函數

### 移除 kapt.use.worker.api Gradle 屬性

> **Issue**: [KT-48827](https://youtrack.jetbrains.com/issue/KT-48827)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 移除 `kapt.use.worker.api` 屬性，該屬性曾經允許透過 Gradle Workers API 執行 kapt（預設：true）
>
> **Deprecation cycle**:
>
> - 1.6.20: 將棄用級別提升為警告
> - 1.8.0: 移除此屬性

### 移除 kotlin.compiler.execution.strategy 系統屬性

> **Issue**: [KT-51831](https://youtrack.jetbrains.com/issue/KT-51831)
>
> **Component**: Gradle
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 移除用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`
>
> **Deprecation cycle:**
>
> - 1.7.0: 將棄用級別提升為警告
> - 1.8.0: 移除此屬性

### 編譯器選項的變更

> **Issues**: [KT-27301](https://youtrack.jetbrains.com/issue/KT-27301), [KT-48532](https://youtrack.jetbrains.com/issue/KT-48532)
>
> **Component**: Gradle
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 此變更可能會影響 Gradle 外掛程式的作者。在 `kotlin-gradle-plugin` 中，一些內部類型新增了泛型參數（您應該新增泛型類型或 `*`）。`KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile` 任務。`KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。請改用 `Kotlin2JsCompile.outputFileProperty` 任務輸入。`kotlinOptions` 任務輸入和 `kotlinOptions{...}` 任務 DSL 處於支援模式，並將在即將發布的版本中棄用。`compilerOptions` 和 `kotlinOptions` 不能在任務執行階段更改（請參閱 [Kotlin 1.8 有什麼新功能](whatsnew18.md#limitations) 中的一個例外）。`freeCompilerArgs` 回傳一個不可變的 `List<String>` – `kotlinOptions.freeCompilerArgs.remove("something")` 將會失敗。允許使用舊 JVM 後端的 `useOldBackend` 屬性已移除
>
> **Deprecation cycle:**
>
> - 1.8.0: `KotlinNativeLink` 任務不再繼承 `AbstractKotlinNativeCompile`。`KotlinJsCompilerOptions.outputFile` 和相關的 `KotlinJsOptions.outputFile` 選項已棄用。允許使用舊 JVM 後端的 `useOldBackend` 屬性已移除。

### 棄用 kotlin.internal.single.build.metrics.file 屬性

> **Issue**: [KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 棄用用於定義單一建置報告檔案的 `kotlin.internal.single.build.metrics.file` 屬性。請改用 `kotlin.build.report.single_file` 屬性，並搭配 `kotlin.build.report.output=single_file`
>
> **Deprecation cycle:**
>
> - 1.8.0: 將棄用級別提升為警告
> `>= 1.9`: 刪除該屬性