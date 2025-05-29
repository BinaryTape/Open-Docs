[//]: # (title: Kotlin 1.5 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出應該移除阻礙語言演進的結構，而後者則表示此類移除應該提前充分溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道發布，例如更新日誌或編譯器警告，但本文總結了所有這些變更，為從 Kotlin 1.4 遷移到 Kotlin 1.5 提供了完整的參考。

## 基本術語

本文中介紹了幾種相容性類型：

- _來源 (source)_：來源不相容變更會使過去能正常編譯（無錯誤或警告）的程式碼不再能編譯
- _二進位 (binary)_：如果兩個二進位構件 (binary artifacts) 的相互替換不會導致載入或連結錯誤，則稱它們為二進位相容
- _行為 (behavioral)_：如果同一程式在應用變更前後展現出不同行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如 Java）來看 Kotlin 程式碼的相容性，超出本文的範疇。

## 語言與標準函式庫 (stdlib)

### 禁止在簽章多型呼叫 (signature-polymorphic calls) 中使用展開運算子 (spread operator)

> **問題**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止在簽章多型呼叫中使用展開運算子 (*)。
>
> **棄用週期**:
>
> - < 1.5: 針對呼叫站點 (call-site) 有問題的運算子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用於暫時還原為 1.5 版本之前的行為

### 禁止非抽象類別包含從該類別不可見的抽象成員 (internal/package-private)

> **問題**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止非抽象類別包含從該類別不可見的抽象成員 (internal/package-private)。
>
> **棄用週期**:
>
> - < 1.5: 針對有問題的類別引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 可用於暫時還原為 1.5 版本之前的行為

### 禁止在 JVM 上使用基於非具體化 (non-reified) 型別參數的陣列作為具體化型別引數

> **問題**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止在 JVM 上使用基於非具體化 (non-reified) 型別參數的陣列作為具體化型別引數。
>
> **棄用週期**:
>
> - < 1.5: 針對有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 可用於暫時還原為 1.5 版本之前的行為

### 禁止未委派給主要建構函式的次要列舉類別建構函式

> **問題**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止未委派給主要建構函式的次要列舉類別建構函式。
>
> **棄用週期**:
>
> - < 1.5: 針對有問題的建構函式引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 可用於暫時還原為 1.5 版本之前的行為

### 禁止私有內聯函式 (private inline functions) 暴露匿名型別

> **問題**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止私有內聯函式暴露匿名型別。
>
> **棄用週期**:
>
> - < 1.5: 針對有問題的建構函式引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 可用於暫時還原為 1.5 版本之前的行為

### 禁止在帶有 SAM 轉換 (SAM-conversion) 的引數之後傳遞非展開陣列

> **問題**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止在帶有 SAM 轉換的引數之後傳遞非展開陣列。
>
> **棄用週期**:
>
> - 1.3.70: 針對有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 可用於暫時還原為 1.5 版本之前的行為

### 支援底線命名 (underscore-named) 捕捉區塊參數的特殊語意

> **問題**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止引用用於省略捕捉區塊中例外參數名稱的底線符號 (`_`)。
>
> **棄用週期**:
>
> - 1.4.20: 針對有問題的引用引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 可用於暫時還原為 1.5 版本之前的行為

### 將 SAM 轉換的實作策略從基於匿名類別變更為 invokedynamic

> **問題**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 從 Kotlin 1.5 開始，SAM (單一抽象方法) 轉換的實作策略將從生成匿名類別變更為使用 `invokedynamic` JVM 指令。
>
> **棄用週期**:
>
> - 1.5: 變更 SAM 轉換的實作策略，
>  `-Xsam-conversions=class` 可用於還原實作方案至先前使用的方案

### JVM IR-based 後端 (backend) 的效能問題

> **問題**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: Kotlin 1.5 預設使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) 作為 Kotlin/JVM 編譯器。對於較早的語言版本，舊的後端仍然是預設使用的。
>
> 在使用 Kotlin 1.5 中的新編譯器時，您可能會遇到一些效能下降的問題。我們正在努力修復這些情況。
>
> **棄用週期**:
>
> - < 1.5: 預設情況下，使用舊的 JVM 後端
> - &gt;= 1.5: 預設情況下，使用基於 IR 的後端。如果您需要在 Kotlin 1.5 中使用舊後端，請將以下行新增到專案的組態檔中，以暫時還原為 1.5 版本之前的行為：
>
> 在 Gradle 中：
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> 在 Maven 中：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 對此旗標的支援將在未來某個版本中移除。

### JVM IR-based 後端中的新欄位排序

> **問題**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 從 1.5 版開始，Kotlin 使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，它以不同的方式排序 JVM 位元碼 (bytecode)：在建構函式中宣告的欄位會在類別主體中宣告的欄位之前產生，而對於舊後端則相反。新的排序方式可能會改變使用依賴欄位順序的序列化框架（例如 Java 序列化）的程式行為。
>
> **棄用週期**:
>
> - < 1.5: 預設情況下，使用舊的 JVM 後端。它將在類別主體中宣告的欄位放在在建構函式中宣告的欄位之前。
> - &gt;= 1.5: 預設情況下，使用新的基於 IR 的後端。在建構函式中宣告的欄位會在類別主體中宣告的欄位之前產生。作為權宜之計 (workaround)，您可以暫時切換到 Kotlin 1.5 中的舊後端。為此，請將以下行新增到專案的組態檔中：
>
> 在 Gradle 中：
>
> <tabs>
>
> ```kotlin
> tasks.withType<org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile> {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> ```groovy
> tasks.withType(org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile) {
>   kotlinOptions.useOldBackend = true
> }
> ```
>
> </tabs>
>
> 在 Maven 中：
>
> ```xml
> <configuration>
>     <args>
>         <arg>-Xuse-old-backend</arg>
>     </args>
> </configuration>
> ```
>
> 對此旗標的支援將在未來某個版本中移除。

### 為委託屬性 (delegated properties) 在委託表達式中包含泛型呼叫時產生可空性斷言 (nullability assertion)

> **問題**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 從 Kotlin 1.5 開始，Kotlin 編譯器將為委託屬性在委託表達式中包含泛型呼叫時發出可空性斷言。
>
> **棄用週期**:
>
> - 1.5: 為委託屬性發出可空性斷言（詳情請參閱問題），
>  `-Xuse-old-backend` 或 `-language-version 1.4` 可用於暫時還原為 1.5 版本之前的行為

### 將帶有 `@OnlyInputTypes` 註解的型別參數的呼叫警告轉為錯誤

> **問題**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: Kotlin 1.5 將禁止 `contains`、`indexOf` 和 `assertEquals` 等呼叫中使用無意義的引數，以提高型別安全。
>
> **棄用週期**:
>
> - 1.4.0: 針對有問題的建構函式引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-StrictOnlyInputTypesChecks` 可用於暫時還原為 1.5 版本之前的行為

### 在帶有具名變長引數 (named vararg) 的呼叫中採用正確的引數執行順序

> **問題**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: Kotlin 1.5 將變更帶有具名變長引數的呼叫中引數的執行順序。
>
> **棄用週期**:
>
> - < 1.5: 針對有問題的建構函式引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 可用於暫時還原為 1.5 版本之前的行為

### 在運算子函式呼叫中使用參數的預設值

> **問題**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: Kotlin 1.5 將在運算子呼叫中使用參數的預設值。
>
> **棄用週期**:
>
> - < 1.5: 舊行為（詳情請參閱問題）
> - &gt;= 1.5: 行為已變更，
>  `-XXLanguage:-JvmIrEnabledByDefault` 可用於暫時還原為 1.5 版本之前的行為

### 如果常規進程 (regular progression) 為空，則在 for 迴圈中產生空的逆序進程 (reversed progressions)

> **問題**: [KT-42533](https://youtrack.com/issue/KT-42533)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 如果常規進程為空，Kotlin 1.5 將在 for 迴圈中產生空的逆序進程。
>
> **棄用週期**:
>
> - < 1.5: 舊行為（詳情請參閱問題）
> - &gt;= 1.5: 行為已變更，
>  `-XXLanguage:-JvmIrEnabledByDefault` 可用於暫時還原為 1.5 版本之前的行為

### 釐清字元轉程式碼 (Char-to-code) 和字元轉數字 (Char-to-digit) 的轉換

> **問題**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: 從 Kotlin 1.5 開始，字元轉換為數字型別將被棄用。
>
> **棄用週期**:
>
> - 1.5: 棄用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 和反向函式如 `Long.toChar()`，並提出替代方案

### kotlin.text 函式中字元不區分大小寫比較的行為不一致

> **問題**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 從 Kotlin 1.5 開始，`Char.equals` 在不區分大小寫的情況下將得到改進，方法是首先比較字元的大寫變體是否相等，然後再比較這些大寫變體的「小寫變體」（而不是字元本身）是否相等。
>
> **棄用週期**:
>
> - < 1.5: 舊行為（詳情請參閱問題）
> - 1.5: 變更 `Char.equals` 函式的行為

### 移除預設區域設定敏感 (locale-sensitive) 的大小寫轉換 API

> **問題**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: 從 Kotlin 1.5 開始，預設區域設定敏感的大小寫轉換函式，例如 `String.toUpperCase()`，將被棄用。
>
> **棄用週期**:
>
> - 1.5: 棄用使用預設區域設定的大小寫轉換函式（詳情請參閱問題），並提出替代方案

### 逐步將集合的 `min` 和 `max` 函式的回傳型別變更為不可空 (non-nullable)

> **問題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **組件**: kotlin-stdlib (JVM)
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: 集合的 `min` 和 `max` 函式的回傳型別將在 1.6 版中變更為不可空。
>
> **棄用週期**:
>
> - 1.4: 引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳情請參閱問題）
> - 1.5.0: 將受影響 API 的棄用級別提升為錯誤
> - &gt;=1.6: 重新引入受影響的 API，但回傳型別為不可空

### 提升浮點型別轉換為 Short 和 Byte 的棄用級別

> **問題**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **組件**: kotlin-stdlib (JVM)
>
> **不相容變更類型**: 來源 (source)
>
> **簡要總結**: 在 Kotlin 1.4 中以 `WARNING` 級別棄用的浮點型別到 `Short` 和 `Byte` 的轉換將從 Kotlin 1.5.0 起導致錯誤。
>
> **棄用週期**:
>
> - 1.4: 棄用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()`，並提出替代方案
> - 1.5.0: 將棄用級別提升為錯誤

## 工具

### 不要在單一專案中混用多個 `kotlin-test` 的 JVM 變體

> **問題**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **組件**: Gradle
>
> **不相容變更類型**: 行為 (behavioral)
>
> **簡要總結**: 如果其中一個 `kotlin-test` 變體是由傳遞依賴 (transitive dependency) 引入的，那麼專案中可能會存在多個針對不同測試框架的互斥 `kotlin-test` 變體。從 1.5.0 版開始，Gradle 將不允許存在針對不同測試框架的互斥 `kotlin-test` 變體。
>
> **棄用週期**:
>
> - < 1.5: 允許存在針對不同測試框架的多個互斥 `kotlin-test` 變體
> - &gt;= 1.5: 行為已變更，
> Gradle 會拋出諸如「無法選擇與功能衝突的模組...」的例外。可能的解決方案：
>    * 使用與傳遞依賴引入的 `kotlin-test` 變體和對應測試框架。
>    * 尋找不通過傳遞方式引入 `kotlin-test` 變體的其他依賴變體，這樣您就可以使用您想用的測試框架。
>    * 尋找通過傳遞方式引入另一個 `kotlin-test` 變體的依賴變體，且該變體使用您想用的測試框架。
>    * 排除通過傳遞方式引入的測試框架。以下範例用於排除 JUnit 4：
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除測試框架後，測試您的應用程式。如果它停止工作，請還原排除的變更，使用與函式庫相同的測試框架，並排除您自己的測試框架。