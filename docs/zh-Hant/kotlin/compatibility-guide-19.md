[//]: # (title: Kotlin 1.9.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出應移除阻礙語言演進的結構，後者則表示此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（如更新日誌或編譯器警告）公佈，但本文件將所有變更彙總，為從 Kotlin 1.8 遷移到 Kotlin 1.9 提供了完整的參考資料。

## 基本術語

本文件介紹了幾種相容性：

- _原始碼_：原始碼不相容變更會使原本能正常編譯（沒有錯誤或警告）的程式碼不再能編譯
- _二進位_：如果互相替換兩個二進位構件不會導致載入或連結錯誤，則稱它們為二進位相容
- _行為_：如果同一程式在應用變更前後展現不同的行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言角度來看的 Kotlin 程式碼相容性（例如，從 Java 的角度）不在本文件範圍內。

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

> **Issue**: [KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 引入了語言版本 1.9 並移除了對語言版本 1.3 的支援。
>
> **Deprecation cycle**:
>
> - 1.6.0: 報告警告
> - 1.9.0: 將警告提升為錯誤

### 禁止父類別建構函式呼叫，當父介面型別為函式字面量時

> **Issue**: [KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果介面繼承自函式字面量型別，Kotlin 1.9 將禁止呼叫父類別建構函式，因為不存在這樣的建構函式。
>
> **Deprecation cycle**:
> * 1.7.0: 報告警告（或在漸進模式下報告錯誤）
> * 1.9.0: 將警告提升為錯誤

### 禁止註解參數型別中的循環

> **Issue**: [KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止將註解的型別直接或間接用作其參數型別之一。這可以防止產生循環。然而，參數型別可以是註解型別的 `Array` 或 `vararg`。
>
> **Deprecation cycle**:
> * 1.7.0: 在註解參數型別中的循環上報告警告（或在漸進模式下報告錯誤）
> * 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暫時恢復到 1.9 之前的行為

### 禁止在沒有參數的函式型別上使用 @ExtensionFunctionType 註解

> **Issue**: [KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止在沒有參數的函式型別或非函式型別上使用 `@ExtensionFunctionType` 註解。
>
> **Deprecation cycle**:
> * 1.7.0: 對非函式型別上的註解報告警告，對**是**函式型別上的註解報告錯誤
> * 1.9.0: 將函式型別的警告提升為錯誤

### 禁止 Java 欄位型別不匹配賦值

> **Issue**: [KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: 如果 Kotlin 1.9 檢測到賦予 Java 欄位的值型別與 Java 欄位的投影型別不匹配，它將報告編譯器錯誤。
>
> **Deprecation cycle**:
> * 1.6.0: 當投影的 Java 欄位型別與賦予的值型別不匹配時，報告警告（或在漸進模式下報告錯誤）
> * 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暫時恢復到 1.9 之前的行為

### 平台型別可空性斷言例外中不包含原始碼摘錄

> **Issue**: [KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 在 Kotlin 1.9 中，表達式空值檢查的例外訊息不包含原始碼摘錄。取而代之的是顯示方法或欄位的名稱。如果表達式不是方法或欄位，則訊息中不提供額外資訊。
>
> **Deprecation cycle**:
> * < 1.9.0: 表達式空值檢查產生的例外訊息包含原始碼摘錄
> * 1.9.0: 表達式空值檢查產生的例外訊息僅包含方法或欄位名稱，可以使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暫時恢復到 1.9 之前的行為

### 禁止將 super 呼叫委派給抽象父類別成員

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當顯式或隱式 `super` 呼叫被委派給父類別的**抽象**成員時，即使超介面中有預設實作，Kotlin 也將報告編譯錯誤。
>
> **Deprecation cycle**:
>
> - 1.5.20: 當使用未覆寫所有抽象成員的非抽象類別時引入警告
> - 1.7.0: 如果 `super` 呼叫實際上存取了父類別的抽象成員，則報告警告
> - 1.7.0: 如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容性模式，則在所有受影響的情況下報告錯誤；在漸進模式下報告錯誤
> - 1.8.0: 在以下情況下報告錯誤：宣告了具有來自父類別的未覆寫抽象方法的具體類別，以及 `Any` 方法的 `super` 呼叫在父類別中被覆寫為抽象
> - 1.9.0: 在所有受影響的情況下報告錯誤，包括對父類別抽象方法的顯式 `super` 呼叫

### 廢棄帶主詞的 when 中容易混淆的語法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 廢棄了 `when` 條件表達式中幾個容易混淆的語法結構。
>
> **Deprecation cycle**:
>
> - 1.6.20: 對受影響的表達式引入廢棄警告
> - 1.8.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時恢復到 1.8 之前的行為
> - &gt;= 2.1: 將一些廢棄的結構重新用於新的語言功能

### 防止不同數值型別之間的隱式強制轉型

> **Issue**: [KT-48645](https://youtrack.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: 當語義上只需要向下轉換為某個原始數值型別時，Kotlin 將避免自動將數值轉換為該型別。
>
> **Deprecation cycle**:
>
> - < 1.5.30: 所有受影響情況下的舊行為
> - 1.5.30: 修復生成的屬性委託存取器中的向下轉換行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 之前的修復行為
> - &gt;= 2.0: 修復其他受影響情況下的向下轉換行為

### 禁止泛型型別別名使用中的上限違規（在別名型別的型別引數的泛型型別引數中使用的型別參數）

> **Issue**: [KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當型別別名 (type alias) 的型別參數被用作別名型別 (aliased type) 的型別引數的泛型型別引數時（例如 `typealias Alias<T> = Base<List<T>>`），Kotlin 將禁止使用具有違反相應別名型別參數上限限制的型別引數的型別別名。
>
> **Deprecation cycle**:
>
> - 1.8.0: 當泛型型別別名使用具有違反相應別名型別參數上限約束的型別引數時，報告警告
> - 2.0.0: 將警告提升為錯誤

### 在公共簽名中近似局部型別時保持可空性

> **Issue**: [KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **Component**: Core language
>
> **Incompatible change type**: source, binary
>
> **Short summary**: 當局部或匿名型別從沒有明確指定返回型別的表達式主體函式返回時，Kotlin 編譯器會使用該型別的已知超型別來推斷（或近似）返回型別。在此過程中，編譯器可能會推斷出一個非空型別，而實際上可能返回空值。
>
> **Deprecation cycle**:
>
> - 1.8.0: 使用彈性超型別近似彈性型別
> - 1.8.0: 當宣告被推斷為應為可空型別而卻是非空型別時報告警告，提示使用者明確指定型別
> - 2.0.0: 使用可空超型別近似可空型別，可以使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時恢復到 2.0 之前的行為

### 不透過覆寫傳播廢棄狀態

> **Issue**: [KT-47902](https://youtrack.com/issue/KT-47902)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將不再將父類別中已廢棄成員的廢棄狀態傳播到子類別中覆寫它的成員，從而提供一種明確的機制，可以在廢棄父類別成員的同時，使其在子類別中保持非廢棄狀態。
>
> **Deprecation cycle**:
>
> - 1.6.20: 報告一個警告，內容為未來行為變更的訊息，並提示使用者要麼抑制此警告，要麼在已廢棄成員的覆寫上明確寫上 `@Deprecated` 註解
> - 1.9.0: 停止將廢棄狀態傳播到被覆寫的成員。此變更也會在漸進模式下立即生效

### 禁止在註解類別中除其參數宣告以外的任何地方使用集合字面量

> **Issue**: [KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允許以受限制的方式使用集合字面量——用於將陣列傳遞給註解類別的參數或為這些參數指定預設值。然而，除此之外，Kotlin 還允許在註解類別的任何其他地方使用集合字面量，例如在其巢狀物件中。Kotlin 1.9 將禁止在註解類別中除其參數預設值之外的任何地方使用集合字面量。
>
> **Deprecation cycle**:
>
> - 1.7.0: 對註解類別中巢狀物件裡的陣列字面量報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止在預設值表達式中向前引用參數

> **Issue**: [KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在其他參數的預設值表達式中向前引用參數。這確保了在參數於預設值表達式中被存取時，它已經具有值，要麼是傳遞給函式的值，要麼是透過其自身的預設值表達式初始化的值。
>
> **Deprecation cycle**:
>
> - 1.7.0: 當帶有預設值的參數在位於其之前的另一個參數的預設值中被引用時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時恢復到 1.9 之前的行為

### 禁止在內聯函式參數上進行擴充呼叫

> **Issue**: [KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 儘管 Kotlin 允許將內聯函式參數作為接收者傳遞給另一個內聯函式，但在編譯此類程式碼時總是會導致編譯器例外。Kotlin 1.9 將禁止這種行為，從而報告錯誤而不是使編譯器崩潰。
>
> **Deprecation cycle**:
>
> - 1.7.20: 對內聯函式參數上的內聯擴充呼叫報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止呼叫名稱為 suspend 且帶有匿名函式引數的中綴函式

> **Issue**: [KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將不再允許呼叫名稱為 `suspend` 且將函式型別的單個參數作為匿名函式字面量傳遞的中綴函式。
>
> **Deprecation cycle**:
>
> - 1.7.20: 對帶有匿名函式字面量的 `suspend` 中綴呼叫報告警告
> - 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時恢復到 1.9 之前的行為
> - TODO: 變更解析器解釋 `suspend fun` 詞元序列的方式

### 禁止在內部類別中使用捕獲的型別參數，以防其變異性衝突

> **Issue**: [KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在內部類別中使用外部類別具有 `in` 或 `out` 變異的型別參數，當這些參數在違反其宣告變異的位置時。
>
> **Deprecation cycle**:
>
> - 1.7.0: 當外部類別的型別參數使用位置違反該參數的變異規則時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時恢復到 1.9 之前的行為

### 禁止在複合賦值運算子中遞歸呼叫沒有明確返回型別的函式

> **Issue**: [KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止在函式體內，於複合賦值運算子 (compound assignment operator) 的引數中呼叫沒有明確指定返回型別的函式，就像它目前在該函式體內的其它表達式中所做的那樣。
>
> **Deprecation cycle**:
>
> - 1.7.0: 當沒有明確指定返回型別的函式在其函式體內於複合賦值運算子引數中遞歸呼叫時，報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤

### 禁止將具有可空邊界的 Kotlin 泛型參數傳遞給預期為 @NotNull T 的不健全呼叫

> **Issue**: [KT-36770](https://youtrack.com/issue/KT-36770)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止方法呼叫中，將可能為空值的泛型型別值傳遞給 Java 方法的 `@NotNull` 註解參數。
>
> **Deprecation cycle**:
>
> - 1.5.20: 當預期非空型別時傳遞了無約束的泛型型別參數，則報告警告
> - 1.9.0: 報告型別不匹配錯誤而不是上述警告，可以使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時恢復到 1.8 之前的行為

### 禁止從列舉條目初始化器存取該列舉的伴生物件成員

> **Issue**: [KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 將禁止從列舉條目初始化器中對列舉的伴生物件進行所有類型的存取。
>
> **Deprecation cycle**:
>
> - 1.6.20: 對此類伴生成員存取報告警告（或在漸進模式下報告錯誤）
> - 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時恢復到 1.8 之前的行為

### 廢棄並移除 Enum.declaringClass 合成屬性

> **Issue**: [KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 允許在由底層 Java 類別 `java.lang.Enum` 的 `getDeclaringClass()` 方法產生的 `Enum` 值上使用合成屬性 `declaringClass`，儘管此方法不適用於 Kotlin 的 `Enum` 型別。Kotlin 1.9 將禁止使用此屬性，建議改用擴充屬性 `declaringJavaClass`。
>
> **Deprecation cycle**:
>
> - 1.7.0: 對 `declaringClass` 屬性使用報告警告（或在漸進模式下報告錯誤），建議遷移到 `declaringJavaClass` 擴充
> - 1.9.0: 將警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時恢復到 1.9 之前的行為
> - 2.0.0: 移除 `declaringClass` 合成屬性

### 廢棄編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **Issues**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.9 禁止使用編譯器選項 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式。
>
> **Deprecation cycle**:
>
> - 1.6.20: 對編譯器選項 `-Xjvm-default` 的 `enable` 和 `compatibility` 模式引入警告
> - 1.9.0: 將此警告提升為錯誤

### 禁止在建構器推斷上下文下隱式將型別變數推斷為上限

> **Issue**: [KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 在建構器推斷 lambda 函式的範圍內，如果沒有任何使用點型別資訊，Kotlin 2.0 將禁止將型別變數推斷為相應型別參數的上限，就像它目前在其他上下文中那樣。
>
> **Deprecation cycle**:
>
> - 1.7.20: 當在沒有使用點型別資訊的情況下將型別參數推斷為宣告的上限時，報告警告（或在漸進模式下報告錯誤）
> - 2.0.0: 將警告提升為錯誤

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，警告潛在的重載解析變更

> **Issue**: [KT-49276](https://youtrack.com/issue/KT-49276)
>
> **Component**: Core language / kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 計劃在 Kotlin 1.9 中讓標準進程 (progressions) 及其繼承的具體範圍 (concrete ranges) 實作 `Collection` 介面。如果某個方法有兩個重載，一個接受元素而另一個接受集合，這可能會導致重載解析時選擇不同的重載。當使用範圍或進程引數呼叫此類重載方法時，Kotlin 將透過報告警告或錯誤來使此情況可見。
>
> **Deprecation cycle**:
>
> - 1.6.20: 當使用標準進程或其範圍繼承者作為引數呼叫重載方法時報告警告，如果此進程/範圍實作 `Collection` 介面導致未來在此呼叫中選擇另一個重載
> - 1.8.0: 將此警告提升為錯誤
> - 2.1.0: 停止報告錯誤，在進程中實作 `Collection` 介面，從而改變受影響情況下的重載解析結果

### 將宣告從 kotlin.dom 和 kotlin.browser 封裝遷移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: `kotlin.dom` 和 `kotlin.browser` 封裝中的宣告已移至相應的 `kotlinx.*` 封裝，以準備將它們從標準函式庫 (stdlib) 中提取。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 封裝中引入替換 API
> - 1.4.0: 廢棄 `kotlin.dom` 和 `kotlin.browser` 封裝中的 API 並建議使用上述新 API 作為替換
> - 1.6.0: 將廢棄等級提升為錯誤
> - 1.8.20: 從適用於 JS-IR 目標的標準函式庫中移除廢棄函式
> - &gt;= 2.0: 將 `kotlinx.*` 封裝中的 API 移至單獨的函式庫

### 廢棄部分僅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 標準函式庫中的一些僅限 JS 的函式已被廢棄以供移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函式的陣列 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 以警告方式廢棄受影響的函式
> - 1.9.0: 將廢棄等級提升為錯誤
> - &gt;=2.0: 從公共 API 中移除廢棄函式

## 工具

### 從 Gradle 設定中移除 enableEndorsedLibs 標誌

> **Issue**: [KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `enableEndorsedLibs` 標誌在 Gradle 設定中不再受支援。
>
> **Deprecation cycle**:
>
> - < 1.9.0: `enableEndorsedLibs` 標誌在 Gradle 設定中受支援
> - 1.9.0: `enableEndorsedLibs` 標誌在 Gradle 設定中**不**受支援

### 移除 Gradle 慣例

> **Issue**: [KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Gradle 慣例已在 Gradle 7.1 中廢棄，並在 Gradle 8 中移除。
>
> **Deprecation cycle**:
>
> - 1.7.20: Gradle 慣例已廢棄
> - 1.9.0: Gradle 慣例已移除

### 移除 KotlinCompile 任務的 classpath 屬性

> **Issue**: [KT-53748](https://youtrack.com/issue/KT-53748)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: `KotlinCompile` 任務的 `classpath` 屬性已移除。
>
> **Deprecation cycle**:
>
> - 1.7.0: `classpath` 屬性已廢棄
> - 1.8.0: 將廢棄等級提升為錯誤
> - 1.9.0: 從公共 API 中移除廢棄函式

### 廢棄 kotlin.internal.single.build.metrics.file 屬性

> **Issue**: [KT-53357](https://youtrack.com/issue/KT-53357)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 廢棄用於定義單一檔案以產生建置報告的 `kotlin.internal.single.build.metrics.file` 屬性。請改用 `kotlin.build.report.single_file` 屬性並配合 `kotlin.build.report.output=single_file`。
>
> **Deprecation cycle:**
>
> * 1.8.0: 將廢棄等級提升為警告
> * &gt;= 1.9: 刪除該屬性