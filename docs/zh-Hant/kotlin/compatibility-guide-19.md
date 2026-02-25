[//]: # (title: Kotlin 1.9.x 相容性指南)

_「[保持語言現代性](kotlin-evolution-principles.md)」_與_「[舒適更新](kotlin-evolution-principles.md)」_是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則強調這種移除應事先進行良好的溝通，以使程式碼遷移儘可能平滑。

雖然大多數語言變更已透過其他管道宣布（例如更新日誌或編譯器警告），但本文件彙整了所有變更，為從 Kotlin 1.8 遷移至 Kotlin 1.9 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
- _二進位 (binary)_：如果交換兩個二進位產物不會導致載入或連結錯誤，則稱這兩個產物為二進位相容。
- _行為 (behavioral)_：如果同一程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請注意，這些定義僅針對純 Kotlin。從其他語言角度（例如從 Java）來看 Kotlin 程式碼的相容性不在本文件討論範圍內。

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

> **問題**：[KT-61111](https://youtrack.jetbrains.com/issue/KT-61111/Remove-language-version-1.3)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 引入了語言版本 1.9，並移除了對語言版本 1.3 的支援。
>
> **棄用週期**：
>
> - 1.6.0：回報警告
> - 1.9.0：將警告提升為錯誤

### 當父介面型別為函式常值時，禁止呼叫父類別建構函式

> **問題**：[KT-46344](https://youtrack.jetbrains.com/issue/KT-46344)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：如果介面繼承自函式常值型別，Kotlin 1.9 會禁止呼叫父類別建構函式，因為不存在此類建構函式。
>
> **棄用週期**：
> * 1.7.0：回報警告（或在漸進模式下回報錯誤）
> * 1.9.0：將警告提升為錯誤

### 禁止註解參數型別中的循環

> **問題**：[KT-47932](https://youtrack.jetbrains.com/issue/KT-47932)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 禁止將註解型別直接或間接用作其參數型別之一。這可以防止產生循環。然而，您允許使用註解型別的 `Array` 或 `vararg` 作為參數型別。
>
> **棄用週期**：
> * 1.7.0：針對註解參數型別中的循環回報警告（或在漸進模式下回報錯誤）
> * 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ProhibitCyclesInAnnotations` 暫時還原為 1.9 之前的行為

### 禁止在無參數的函式型別上使用 @ExtensionFunctionType 註解

> **問題**：[KT-43527](https://youtrack.jetbrains.com/issue/KT-43527)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 禁止在無參數的函式型別或非函式型別上使用 `@ExtensionFunctionType` 註解。
>
> **棄用週期**：
> * 1.7.0：針對非函式型別上的註解回報警告，針對**是**函式型別上的註解回報錯誤
> * 1.9.0：將函式型別的警告提升為錯誤

### 禁止指派時的 Java 欄位型別不符

> **問題**：[KT-48994](https://youtrack.jetbrains.com/issue/KT-48994)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：如果 Kotlin 1.9 偵測到指派給 Java 欄位的值之型別與 Java 欄位的投影型別不符，編譯器會回報錯誤。
>
> **棄用週期**：
> * 1.6.0：當投影的 Java 欄位型別與指派的值型別不符時，回報警告（或在漸進模式下回報錯誤）
> * 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-RefineTypeCheckingOnAssignmentsToJavaFields` 暫時還原為 1.9 之前的行為

### 平台型別可 null 性斷言例外中不包含原始碼摘錄

> **問題**：[KT-57570](https://youtrack.jetbrains.com/issue/KT-57570)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：在 Kotlin 1.9 中，運算式 null 檢查的例外訊息不包含原始碼摘錄。取而代之的是顯示方法或欄位的名稱。如果運算式並非方法或欄位，則訊息中不會提供額外資訊。
>
> **棄用週期**：
>  * < 1.9.0：由運算式 null 檢查產生的例外訊息包含原始碼摘錄
>  * 1.9.0：由運算式 null 檢查產生的例外訊息僅包含方法或欄位名稱，可使用 `-XXLanguage:-NoSourceCodeInNotNullAssertionExceptions` 暫時還原為 1.9 之前的行為

### 禁止將父類別呼叫委派給抽象父類別成員

> **問題**：[KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
> 
> **簡短摘要**：當顯式或隱式父類別呼叫被委派給父類別的 _抽象 (abstract)_ 成員時，即使父介面中存在預設實作，Kotlin 也會回報編譯錯誤。
>
> **棄用週期**：
>
> - 1.5.20：當使用未覆寫所有抽象成員的非抽象類別時，引入警告
> - 1.7.0：如果父類別呼叫實際上存取了父類別中的抽象成員，回報警告
> - 1.7.0：如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則在所有受影響的情況下回報錯誤；在漸進模式下回報錯誤
> - 1.8.0：在宣告具有來自父類別且未覆寫之抽象方法的具體類別，以及 `Any` 方法的父類別呼叫在父類別中被覆寫為抽象的情況下，回報錯誤
> - 1.9.0：在所有受影響的情況下回報錯誤，包括對父類別抽象方法的顯式父類別呼叫

### 棄用 when-with-subject 中容易混淆的語法

> **問題**：[KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.6 棄用了 `when` 條件運算式中幾種容易混淆的語法結構。
>
> **棄用週期**：
>
> - 1.6.20：在受影響的運算式上引入棄用警告
> - 1.8.0：將此警告提升為錯誤，可使用 `-XXLanguage:-ProhibitConfusingSyntaxInWhenBranches` 暫時還原為 1.8 之前的行為
> - &gt;= 2.1：將某些棄用的結構重新用於新的語言特性

### 防止不同數值型別之間的隱式強制轉換

> **問題**：[KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：在語義上僅需要向下轉換為該型別的情況下，Kotlin 將避免自動將數值轉換為原始數值型別。
>
> **棄用週期**：
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修正產生的屬性委派存取子中的向下轉換行為，可使用 `-Xuse-old-backend` 暫時還原為 1.5.30 之前的修正行為
> - &gt;= 2.0：修正其他受影響情況下的向下轉換行為

### 禁止在泛型型別別名使用中違反上限約束（在別名型別的型別引數之型別引數中使用型別參數）

> **問題**：[KT-54066](https://youtrack.jetbrains.com/issue/KT-54066)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：當型別別名的型別參數被用作別名型別之型別引數的泛型型別引數時（例如 `typealias Alias<T> = Base<List<T>>`），Kotlin 將禁止使用違反別名型別相對應型別參數之上限約束的型別引數。
>
> **棄用週期**：
>
> - 1.8.0：當泛型型別別名使用的型別引數違反別名型別相對應型別參數的上限約束時，回報警告
> - 2.0.0：將警告提升為錯誤

### 在公開簽章中估算區域型別時保留可 null 性

> **問題**：[KT-53982](https://youtrack.jetbrains.com/issue/KT-53982)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼、二進位
>
> **簡短摘要**：當區域或匿名型別從未顯式指定傳回型別的運算式主體函式傳回時，Kotlin 編譯器會使用該型別已知的父型別來推論（或估算）傳回型別。在此過程中，編譯器可能會推論出一個非 null 型別，但實際上可能傳回 null 值。
>
> **棄用週期**：
>
> - 1.8.0：使用靈活父型別來估算靈活型別
> - 1.8.0：當宣告被推論為應為可 null 的非 null 型別時回報警告，提示使用者顯式指定型別
> - 2.0.0：使用可 null 父型別來估算可 null 型別，可使用 `-XXLanguage:-KeepNullabilityWhenApproximatingLocalType` 暫時還原為 2.0 之前的行為

### 棄用狀態不透過覆寫進行傳遞

> **問題**：[KT-47902](https://youtrack.jetbrains.com/issue/KT-47902)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將不再把父類別中棄用成員的棄用狀態傳遞給子類別中的覆寫成員，從而提供了一種顯式機制，可以在棄用父類別成員的同時，讓子類別中的該成員保持非棄用狀態。
>
> **棄用週期**：
>
> - 1.6.20：回報包含未來行為變更訊息的警告，並提示隱藏此警告或在棄用成員的覆寫上顯式撰寫 `@Deprecated` 註解
> - 1.9.0：停止將棄用狀態傳遞給被覆寫的成員。此變更在漸進模式下也會立即生效

### 除參數宣告外，禁止在註解類別中的任何地方使用集合常值

> **問題**：[KT-39041](https://youtrack.jetbrains.com/issue/KT-39041)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 允許以受限的方式使用集合常值——用於將陣列傳遞給註解類別的參數或為這些參數指定預設值。然而除此之外，Kotlin 曾允許在註解類別內的任何其他地方使用集合常值（例如在其巢狀物件中）。Kotlin 1.9 將禁止在註解類別中除參數預設值以外的任何地方使用集合常值。
>
> **棄用週期**：
>
> - 1.7.0：針對註解類別中巢狀物件內的陣列常值回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止在預設值運算式中向前引用參數

> **問題**：[KT-25694](https://youtrack.jetbrains.com/issue/KT-25694)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將禁止在其他參數的預設值運算式中向前引用參數。這確保了在預設值運算式中存取該參數時，它已經具備了傳遞給函式的值或由其自身的預設值運算式初始化的值。
>
> **棄用週期**：
>
> - 1.7.0：當具有預設值的參數在其之前的另一個參數預設值中被引用時，回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ProhibitIllegalValueParameterUsageInDefaultArguments` 暫時還原為 1.9 之前的行為

### 禁止對內聯功能參數進行擴充呼叫

> **問題**：[KT-52502](https://youtrack.jetbrains.com/issue/KT-52502)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：雖然 Kotlin 允許將內聯功能參數作為接收者傳遞給另一個內聯函式，但在編譯此類程式碼時總是會導致編譯器異常。Kotlin 1.9 將禁止此行為，改為回報錯誤而非導致編譯器當機。
>
> **棄用週期**：
>
> - 1.7.20：針對內聯功能參數上的內聯擴充呼叫回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止呼叫名為 suspend 且帶有匿名函式引數的中綴函式

> **問題**：[KT-49264](https://youtrack.jetbrains.com/issue/KT-49264)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將不再允許呼叫名為 `suspend` 且具有以匿名函式常值形式傳遞之單一功能型別引數的中綴函式。
>
> **棄用週期**：
>
> - 1.7.20：針對帶有匿名函式常值的 suspend 中綴呼叫回報警告
> - 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ModifierNonBuiltinSuspendFunError` 暫時還原為 1.9 之前的行為
> - 待辦事項：變更剖析器解釋 `suspend fun` 標記序列的方式

### 禁止在內部類別中使用違反其差異性的擷取型別參數

> **問題**：[KT-50947](https://youtrack.jetbrains.com/issue/KT-50947)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將禁止在內部類別中，於違反型別參數宣告差異性的位置上，使用具有 `in` 或 `out` 差異性的外部類別型別參數。
>
> **棄用週期**：
>
> - 1.7.0：當外部類別型別參數的使用位置違反該參數的差異性規則時，回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ReportTypeVarianceConflictOnQualifierArguments` 暫時還原為 1.9 之前的行為

### 在複合指派運算子中，禁止遞迴呼叫無顯式傳回型別的函式

> **問題**：[KT-48546](https://youtrack.jetbrains.com/issue/KT-48546)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將禁止在該函式主體內的複合指派運算子之引數中，呼叫未顯式指定傳回型別的函式，這與目前在該函式主體內其他運算式中的處理方式一致。
>
> **棄用週期**：
>
> - 1.7.0：當未顯式指定傳回型別的函式在該函式主體的複合指派運算子引數中被遞迴呼叫時，回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤

### 禁止在預期為 @NotNull T 但提供具備可 null 邊界之 Kotlin 泛型參數時進行不安全的呼叫

> **問題**：[KT-36770](https://youtrack.jetbrains.com/issue/KT-36770)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將禁止在 Java 方法的 `@NotNull` 標記參數中傳遞可能為 null 的泛型型別值之方法呼叫。
>
> **棄用週期**：
>
> - 1.5.20：當在預期非 null 型別之處傳遞不受約束的泛型型別參數時，回報警告
> - 1.9.0：回報型別不符錯誤而非上述警告，可使用 `-XXLanguage:-ProhibitUsingNullableTypeParameterAgainstNotNullAnnotated` 暫時還原為 1.8 之前的行為

### 禁止從列舉項目的初始設定式存取列舉類別之隨伴物件成員

> **問題**：[KT-49110](https://youtrack.jetbrains.com/issue/KT-49110)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 將禁止從列舉項目初始設定式對列舉隨伴物件的所有各類存取。
>
> **棄用週期**：
>
> - 1.6.20：針對此類隨伴物件成員存取回報警告（或在漸進模式下回報錯誤）
> - 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ProhibitAccessToEnumCompanionMembersInEnumConstructorCall` 暫時還原為 1.8 之前的行為

### 棄用並移除 Enum.declaringClass 合成屬性

> **問題**：[KT-49653](https://youtrack.jetbrains.com/issue/KT-49653)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 曾允許在從底層 Java 類別 `java.lang.Enum` 的方法 `getDeclaringClass()` 產生的 `Enum` 值上使用合成屬性 `declaringClass`，儘管此方法對 Kotlin `Enum` 型別並不可用。Kotlin 1.9 將禁止使用此屬性，建議遷移至擴充屬性 `declaringJavaClass`。
>
> **棄用週期**：
>
> - 1.7.0：針對 `declaringClass` 屬性的使用回報警告（或在漸進模式下回報錯誤），並建議遷移至 `declaringJavaClass` 擴充
> - 1.9.0：將警告提升為錯誤，可使用 `-XXLanguage:-ProhibitEnumDeclaringClass` 暫時還原為 1.9 之前的行為
> - 2.0.0：移除 `declaringClass` 合成屬性

### 棄用編譯器選項 -Xjvm-default 的 enable 與 compatibility 模式

> **問題**：[KT-46329](https://youtrack.jetbrains.com/issue/KT-46329), [KT-54746](https://youtrack.jetbrains.com/issue/KT-54746)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.9 禁止使用 `-Xjvm-default` 編譯器選項的 `enable` 與 `compatibility` 模式。
>
> **棄用週期**：
>
> - 1.6.20：在 `-Xjvm-default` 編譯器選項的 `enable` 與 `compatibility` 模式上引入警告
> - 1.9.0：將此警告提升為錯誤

### 在建置器推論上下文中，禁止將型別變數隱式推論為上限

> **問題**：[KT-47986](https://youtrack.jetbrains.com/issue/KT-47986)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 2.0 將禁止在建置器推論 Lambda 函式範圍內缺少任何使用點型別資訊的情況下，將型別變數推論為相對應型別參數的上限，這與目前在其他上下文中的處理方式一致。
>
> **棄用週期**：
>
> - 1.7.20：在缺少使用點型別資訊的情況下，當型別參數被推論為宣告的上限時，回報警告（或在漸進模式下回報錯誤）
> - 2.0.0：將警告提升為錯誤

## 標準函式庫

### 當 Range/Progression 開始實作 Collection 時，針對潛在的多載解析變化發出警告

> **問題**：[KT-49276](https://youtrack.jetbrains.com/issue/KT-49276)
>
> **組建**：核心語言 / kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：計劃在 Kotlin 1.9 的標準級數 (progression) 和從其繼承的具體範圍中實作 `Collection` 介面。如果某個方法有兩個多載，一個接受元素而另一個接受集合，這可能會導致多載解析中選擇不同的多載。Kotlin 將在以範圍或級數作為引數呼叫此類多載方法時回報警告或錯誤，使這種情況變得明顯。
>
> **棄用週期**：
>
> - 1.6.20：如果未來由該級數/範圍實作 `Collection` 介面會導致呼叫中選擇另一個多載，則在以標準級數或其範圍繼承者作為引數呼叫多載方法時回報警告
> - 1.8.0：將此警告提升為錯誤
> - 2.1.0：停止回報錯誤，在級數中實作 `Collection` 介面，從而變更受影響情況下的多載解析結果

### 將宣告從 kotlin.dom 與 kotlin.browser 套件遷移至 kotlinx.*

> **問題**：[KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：來自 `kotlin.dom` 和 `kotlin.browser` 套件的宣告已移動到相對應的 `kotlinx.*` 套件，以便準備將它們從標準函式庫中分離。
>
> **棄用週期**：
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議將上述新 API 作為替代方案
> - 1.6.0：將棄用層級提升為錯誤
> - 1.8.20：從 JS-IR 目標的標準函式庫中移除棄用的函式
> - &gt;= 2.0：將 kotlinx.* 套件中的 API 移動到獨立的程式庫

### 棄用某些僅限 JS 的 API

> **問題**：[KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組建**：kotlin-stdlib (JS)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：標準函式庫中的一些僅限 JS 的函式已被棄用並將移除。其中包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及陣列上接受比較函式的 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期**：
>
> - 1.6.0：發出警告並棄用受影響的函式
> - 1.9.0：將棄用層級提升為錯誤
> - &gt;=2.0：從公開 API 中移除棄用的函式

## 工具

### 從 Gradle 設定中移除 enableEndorsedLibs 旗標

> **問題**：[KT-54098](https://youtrack.jetbrains.com/issue/KT-54098)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Gradle 設定中不再支援 `enableEndorsedLibs` 旗標。
>
> **棄用週期**：
>
> - < 1.9.0：Gradle 設定支援 `enableEndorsedLibs` 旗標
> - 1.9.0：Gradle 設定**不**支援 `enableEndorsedLibs` 旗標

### 移除 Gradle 慣例

> **問題**：[KT-52976](https://youtrack.jetbrains.com/issue/KT-52976)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Gradle 慣例 (conventions) 已在 Gradle 7.1 中棄用，並在 Gradle 8 中移除。
>
> **棄用週期**：
>
> - 1.7.20：棄用 Gradle 慣例
> - 1.9.0：移除 Gradle 慣例

### 移除 KotlinCompile 任務的 classpath 屬性

> **問題**：[KT-53748](https://youtrack.jetbrains.com/issue/KT-53748)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：移除了 `KotlinCompile` 任務的 `classpath` 屬性。
>
> **棄用週期**：
>
> - 1.7.0：棄用 `classpath` 屬性
> - 1.8.0：將棄用層級提升為錯誤
> - 1.9.0：從公開 API 中移除棄用的函式

### 棄用 kotlin.internal.single.build.metrics.file 屬性

> **問題**：[KT-53357](https://youtrack.jetbrains.com/issue/KT-53357)
>
> **組建**：Gradle
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：棄用用於定義建置報告單一檔案的 `kotlin.internal.single.build.metrics.file` 屬性。請改用屬性 `kotlin.build.report.single_file` 並搭配 `kotlin.build.report.output=single_file`。
>
> **棄用週期：**
>
> * 1.8.0：將棄用層級提升為警告
> * &gt;= 1.9：刪除該屬性