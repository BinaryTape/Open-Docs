[//]: # (title: Kotlin 1.5.x 相容性指南)

「[保持語言現代化](kotlin-evolution-principles.md)」與「[舒適的更新](kotlin-evolution-principles.md)」是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則強調這類移除應事先進行良好溝通，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道（如更新變更記錄或編譯器警告）發佈，但本文彙整了所有變更，為從 Kotlin 1.4 遷移到 Kotlin 1.5 提供完整的參考。

## 基本術語

在本文中，我們介紹了幾種相容性：

- **原始碼 (source)**：原始碼不相容的變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再編譯
- **二進制 (binary)**：如果交換兩個二進制產物不會導致載入或連結錯誤，則稱它們為二進制相容
- **行為 (behavioral)**：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅針對純 Kotlin 給出。從其他語言視角（例如 Java）看 Kotlin 程式碼的相容性不在本文討論範圍內。

## 語言與標準函式庫 (stdlib)

### 禁止在簽章多型 (signature-polymorphic) 呼叫中使用展開運算子

> **問題**：[KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止在簽章多型呼叫中使用展開運算子 (*)
>
> **棄用週期**：
>
> - < 1.5：在呼叫點針對有問題的運算子引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暫時恢復為 1.5 之前的行為

### 禁止非抽象類別包含對該類別不可見（internal/套件私有）的抽象成員

> **問題**：[KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止非抽象類別包含對該類別不可見（internal/套件私有）的抽象成員
>
> **棄用週期**：
>
> - < 1.5：針對有問題的類別引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 暫時恢復為 1.5 之前的行為

### 禁止在 JVM 上將基於非 reified 型別參數的陣列用作 reified 型別引數

> **問題**：[KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止在 JVM 上將基於非 reified 型別參數的陣列用作 reified 型別引數
>
> **棄用週期**：
>
> - < 1.5：針對有問題的呼叫引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 暫時恢復為 1.5 之前的行為

### 禁止不委派給主建構函數的列舉類別次要建構函式

> **問題**：[KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止不委派給主建構函數的列舉類別次要建構函式
>
> **棄用週期**：
>
> - < 1.5：針對有問題的建構函式引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 暫時恢復為 1.5 之前的行為

### 禁止從私有 inline 函式中暴露匿名型別

> **問題**：[KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止從私有 inline 函式中暴露匿名型別
>
> **棄用週期**：
>
> - < 1.5：針對有問題的建構函式引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 暫時恢復為 1.5 之前的行為

### 禁止在具有 SAM 轉換的引數之後傳遞非展開陣列

> **問題**：[KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止在具有 SAM 轉換的引數之後傳遞非展開陣列
>
> **棄用週期**：
>
> - 1.3.70：針對有問題的呼叫引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 暫時恢復為 1.5 之前的行為

### 支援以底線命名的 catch 區塊參數之特殊語意

> **問題**：[KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止引用在 catch 區塊中用於省略例外參數名稱的底線符號 (`_`)
>
> **棄用週期**：
>
> - 1.4.20：針對有問題的引用引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 暫時恢復為 1.5 之前的行為

### 將 SAM 轉換的實作策略從基於匿名類別更改為 invokedynamic

> **問題**：[KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：自 Kotlin 1.5 起，SAM (單一抽象方法) 轉換的實作策略將從產生匿名類別變更為使用 `invokedynamic` JVM 指令
>
> **棄用週期**：
>
> - 1.5：變更 SAM 轉換的實作策略，
>  可以使用 `-Xsam-conversions=class` 將實作方案還原為以前使用的方案

### JVM 基於 IR 的後端效能問題

> **問題**：[KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 1.5 預設將 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) 用於 Kotlin/JVM 編譯器。舊後端在較早的語言版本中仍預設使用。
>
> 在 Kotlin 1.5 中使用新編譯器時，您可能會遇到一些效能下降的問題。我們正致力於修正此類情況。
>
> **棄用週期**：
>
> - < 1.5：預設使用舊的 JVM 後端
> - &gt;= 1.5：預設使用基於 IR 的後端。如果您需要在 Kotlin 1.5 中使用舊後端，請將以下行新增到專案的組建組態檔案中，以暫時恢復為 1.5 之前的行為：
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
> 對此標記的支援將在未來的某個版本中移除。

### JVM 基於 IR 的後端中的新欄位排序

> **問題**：[KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：自版本 1.5 起，Kotlin 使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，其對 JVM Bytecode 的排序方式有所不同：它會在產生成員變數時，先產生在建構函式中宣告的欄位，然後才產生在主體中宣告的欄位，而舊後端則相反。新的排序可能會改變使用依賴欄位順序之序列化架構（如 Java 序列化）的程式行為。
>
> **棄用週期**：
>
> - < 1.5：預設使用舊的 JVM 後端。它會先產生在主體中宣告的欄位，然後才產生在建構函式中宣告的欄位。
> - &gt;= 1.5：預設使用新的基於 IR 的後端。在建構函式中宣告的欄位會先於在主體中宣告的欄位產生。作為規避措施，您可以在 Kotlin 1.5 中暫時切換回舊後端。為此，請將以下行新增到專案的組建組態檔案中：
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
> 對此標記的支援將在未來的某個版本中移除。

### 為委派運算式中具有泛型呼叫的委派屬性產生可 null 性斷言

> **問題**：[KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：自 Kotlin 1.5 起，Kotlin 編譯器將為委派運算式中具有泛型呼叫的委派屬性發出可 null 性斷言
>
> **棄用週期**：
>
> - 1.5：為委派屬性發出可 null 性斷言（詳情見該問題），
>  可以使用 `-Xuse-old-backend` 或 `-language-version 1.4` 暫時恢復為 1.5 之前的行為

### 針對使用 @OnlyInputTypes 註解型別參數的呼叫，將警告轉為錯誤

> **問題**：[KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **組建**：核心語言
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：Kotlin 1.5 將禁止使用無意義引數呼叫 `contains`、`indexOf` 和 `assertEquals` 等函式，以提高型別安全性
>
> **棄用週期**：
>
> - 1.4.0：針對有問題的建構函式引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 暫時恢復為 1.5 之前的行為

### 在具有具名可變參數 (vararg) 的呼叫中使用正確的引數執行順序

> **問題**：[KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 1.5 將變更具有具名可變參數 (vararg) 呼叫中的引數執行順序
>
> **棄用週期**：
>
> - < 1.5：針對有問題的建構函式引入警告
> - &gt;= 1.5：將此警告提升為錯誤，
>  可以使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 暫時恢復為 1.5 之前的行為

### 在運算子功能性呼叫中使用參數的預設值

> **問題**：[KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：Kotlin 1.5 將在運算子呼叫中使用參數的預設值
>
> **棄用週期**：
>
> - < 1.5：舊行為（詳情見該問題）
> - &gt;= 1.5：行為已變更，
>  可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暫時恢復為 1.5 之前的行為

### 如果一般數列為空，則在 for 迴圈中產生空的反向數列

> **問題**：[KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **組建**：Kotlin/JVM
>
> **不相容變更類型**：行為
>
> **簡短摘要**：如果一般數列為空，Kotlin 1.5 將在 for 迴圈中產生空的反向數列 (reversed progression)
>
> **棄用週期**：
>
> - < 1.5：舊行為（詳情見該問題）
> - &gt;= 1.5：行為已變更，
>  可以使用 `-XXLanguage:-JvmIrEnabledByDefault` 暫時恢復為 1.5 之前的行為

### 理順 Char 到代碼 (Char-to-code) 與 Char 到數字 (Char-to-digit) 的轉換

> **問題**：[KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：自 Kotlin 1.5 起，Char 到數字型別的轉換將被棄用
>
> **棄用週期**：
>
> - 1.5：棄用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 以及反向函式如 `Long.toChar()`，並提供替代方案 

### kotlin.text 函式中字元的大小寫不區分比較不一致

> **問題**：[KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：行為
>
> **簡短摘要**：自 Kotlin 1.5 起，`Char.equals` 在不區分大小寫的情況下將得到改進：先比較字元的大寫變體是否相等，然後再比較這些大寫變體的小寫變體（而非字元本身）是否相等
>
> **棄用週期**：
>
> - < 1.5：舊行為（詳情見該問題）
> - 1.5：變更 `Char.equals` 函式的行為 

### 移除預設區域設定敏感 (locale-sensitive) 的大小寫轉換 API

> **問題**：[KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **組建**：kotlin-stdlib
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：自 Kotlin 1.5 起，預設區域設定敏感的大小寫轉換函式（如 `String.toUpperCase()`）將被棄用
>
> **棄用週期**：
>
> - 1.5：棄用使用預設區域設定的大小寫轉換函式（詳情見該問題），並提供替代方案 

### 逐漸將集合 min 與 max 函式的傳回型別更改為不可為 null

> **問題**：[KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **組建**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：集合 `min` 與 `max` 函式的傳回型別將在 1.6 中更改為不可為 null
>
> **棄用週期**：
>
> - 1.4：引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳情見該問題）
> - 1.5.0：將受影響 API 的棄用層級提高到錯誤
> - &gt;=1.6：重新引入受影響的 API，但具有不可為 null 的傳回型別

### 提高浮點型別轉換為 Short 與 Byte 的棄用層級

> **問題**：[KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **組建**：kotlin-stdlib (JVM)
>
> **不相容變更類型**：原始碼
>
> **簡短摘要**：在 Kotlin 1.4 中以 `WARNING` 層級棄用的浮點型別轉換為 `Short` 與 `Byte` 的操作，自 Kotlin 1.5.0 起將導致錯誤。
>
> **棄用週期**：
>
> - 1.4：棄用 `Double.toShort()/toByte()` 與 `Float.toShort()/toByte()` 並提供替代方案
> - 1.5.0：將棄用層級提高到錯誤

## 工具

### 不要在單個專案中混合多個 JVM 變體的 kotlin-test

> **問題**：[KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **組建**：Gradle
>
> **不相容變更類型**：行為
>
> **簡短摘要**：如果其中一個是由遞移相依性引入的，專案中可能會存在多個用於不同測試框架且互斥的 `kotlin-test` 變體。自 1.5.0 起，Gradle 將不允許針對不同測試框架擁有互斥的 `kotlin-test` 變體。
>
> **棄用週期**：
>
> - < 1.5：允許針對不同測試框架擁有數個互斥的 `kotlin-test` 變體
> - &gt;= 1.5：行為已變更，  
> Gradle 會拋出類似 「Cannot select module with conflict on capability...」 的例外。可能的解決方案：
>    * 使用與遞移相依性引入的相同的 `kotlin-test` 變體及相應的測試框架。
>    * 尋找該相依性的另一個不遞移引入 `kotlin-test` 變體的變體，以便您可以使用想要使用的測試框架。
>    * 尋找該相依性的另一個遞移引入另一個 `kotlin-test` 變體的變體，且該變體使用您想要使用的相同測試框架。
>    * 排除被遞移引入的測試框架。以下範例用於排除 JUnit 4：
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除測試框架後，請測試您的應用程式。如果停止運作，請還原排除變更，使用與該程式庫相同的測試框架，並排除您原本使用的測試框架。