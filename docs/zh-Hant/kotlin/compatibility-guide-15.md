[//]: # (title: Kotlin 1.5.x 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出，阻礙語言演進的建構應該被移除；後者則表示，此類移除應事先充分溝通，以確保程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新日誌或編譯器警告）進行發佈，本文件仍將其全部總結，為從 Kotlin 1.4 遷移到 Kotlin 1.5 提供完整的參考資料。

## 基本術語

本文件介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容變更會導致原本能正常編譯（無錯誤或警告）的程式碼不再能編譯。
- _二進位碼 (binary)_：如果兩個二進位碼構件（artifacts）在相互替換後不會導致載入或連結錯誤，則稱它們為二進位碼相容。
- _行為 (behavioral)_：如果同一程式在應用變更前後展現不同行為，則稱該變更為行為不相容。

請注意，這些定義僅適用於純 Kotlin。Kotlin 程式碼與其他語言（例如 Java）的相容性不在本文件討論範圍之內。

## 語言與標準函式庫 (stdlib)

### 禁止在簽章多型呼叫中使用展開運算子

> **問題 (Issue)**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止在簽章多型呼叫中使用展開運算子 (`*`)
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 在呼叫點為有問題的運算子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 暫時恢復到 1.5 之前的行為

### 禁止包含從該類別不可見（internal/package-private）的抽象成員之非抽象類別

> **問題 (Issue)**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止包含從該類別不可見（internal/package-private）的抽象成員之非抽象類別
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 為有問題的類別引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 暫時恢復到 1.5 之前的行為

### 禁止在 JVM 上使用基於非實化型別參數的陣列作為實化型別引數

> **問題 (Issue)**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止在 JVM 上使用基於非實化型別參數的陣列作為實化型別引數
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 為有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 暫時恢復到 1.5 之前的行為

### 禁止不委託給主要建構子的次級列舉類別建構子

> **問題 (Issue)**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止不委託給主要建構子的次級列舉類別建構子
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 為有問題的建構子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 暫時恢復到 1.5 之前的行為

### 禁止從私有內聯函式暴露匿名型別

> **問題 (Issue)**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止從私有內聯函式暴露匿名型別
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 為有問題的建構子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 暫時恢復到 1.5 之前的行為

### 禁止在帶有 SAM 轉換的引數後傳遞非展開陣列

> **問題 (Issue)**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止在帶有 SAM 轉換的引數後傳遞非展開陣列
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.3.70: 為有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 暫時恢復到 1.5 之前的行為

### 支援下劃線命名的 catch 區塊參數的特殊語義

> **問題 (Issue)**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止引用用於在 catch 區塊中省略例外參數名稱的下劃線符號 (`_`)
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.20: 為有問題的引用引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 暫時恢復到 1.5 之前的行為

### 將 SAM 轉換的實作策略從基於匿名類別變更為 invokedynamic

> **問題 (Issue)**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.5 起，SAM (Single Abstract Method) 轉換的實作策略將從生成匿名類別變更為使用 `invokedynamic` JVM 指令
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5: 變更 SAM 轉換的實作策略，
>  可使用 `-Xsam-conversions=class` 將實作方案恢復到以前使用的方案

### JVM IR-based 後端的效能問題

> **問題 (Issue)**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 預設使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/) 作為 Kotlin/JVM 編譯器。舊後端仍預設用於較早的語言版本。
>
> 在 Kotlin 1.5 中使用新編譯器時，您可能會遇到一些效能下降問題。我們正在努力修復這些情況。
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 預設使用舊的 JVM 後端
> - &gt;= 1.5: 預設使用基於 IR 的後端。如果需要在 Kotlin 1.5 中使用舊後端，
> 請在專案的設定檔中新增以下行，以暫時恢復到 1.5 之前的行為：
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
> 對此旗標的支援將在未來版本中移除。

### JVM IR-based 後端中新的欄位排序

> **問題 (Issue)**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 自 1.5 版起，Kotlin 使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)，其對 JVM 位元組碼的排序方式不同：它會先生成在建構子中宣告的欄位，然後再生成在主體中宣告的欄位，而舊後端則是反之。新的排序可能會改變依賴於欄位順序的序列化框架（例如 Java 序列化）的程式行為。
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 預設使用舊的 JVM 後端。它會先生成在主體中宣告的欄位，然後再生成在建構子中宣告的欄位。
> - &gt;= 1.5: 預設使用新的基於 IR 的後端。在建構子中宣告的欄位會在在主體中宣告的欄位之前生成。作為解決方法，您可以暫時切換回 Kotlin 1.5 中的舊後端。為此，請在專案的設定檔中新增以下行：
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
> 對此旗標的支援將在未來版本中移除。

### 為委託屬性在委託表達式中生成泛型呼叫的可空性斷言

> **問題 (Issue)**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.5 起，Kotlin 編譯器將為在委託表達式中包含泛型呼叫的委託屬性發出可空性斷言
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5: 為委託屬性發出可空性斷言（詳情見問題），
>  可使用 `-Xuse-old-backend` 或 `-language-version 1.4` 暫時恢復到 1.5 之前的行為

### 將帶有 @OnlyInputTypes 註解的型別參數之呼叫警告轉為錯誤

> **問題 (Issue)**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **元件 (Component)**: Core language
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將禁止帶有無意義引數的 `contains`、`indexOf` 和 `assertEquals` 等呼叫，以改善型別安全
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.0: 為有問題的建構子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-StrictOnlyInputTypesChecks` 暫時恢復到 1.5 之前的行為

### 在具名變長引數的呼叫中，使用正確的引數執行順序

> **問題 (Issue)**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將改變具名變長引數呼叫中的引數執行順序
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 為有問題的建構子引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  可使用 `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 暫時恢復到 1.5 之前的行為

### 在運算子函數呼叫中使用參數的預設值

> **問題 (Issue)**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: Kotlin 1.5 將在運算子呼叫中使用參數的預設值
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 舊行為（詳情見問題）
> - &gt;= 1.5: 行為已變更，
>  可使用 `-XXLanguage:-JvmIrEnabledByDefault` 暫時恢復到 1.5 之前的行為

### 如果常規進程為空，則在 for 迴圈中產生空的逆向進程

> **問題 (Issue)**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 如果常規進程為空，Kotlin 1.5 將在 for 迴圈中產生空的逆向進程
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 舊行為（詳情見問題）
> - &gt;= 1.5: 行為已變更，
>  可使用 `-XXLanguage:-JvmIrEnabledByDefault` 暫時恢復到 1.5 之前的行為

### 釐清 Char 到程式碼和 Char 到數字的轉換

> **問題 (Issue)**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **元件 (Component)**: kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.5 起，Char 到數字型別的轉換將被棄用
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5: 棄用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 以及 `Long.toChar()` 等反向函數，並建議替代方案

### kotlin.text 函數中字元大小寫不敏感比較的不一致性

> **問題 (Issue)**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **元件 (Component)**: kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.5 起，`Char.equals` 在大小寫不敏感的情況下將得到改進，方法是首先比較字元的大寫變體是否相等，然後比較這些大寫變體的小寫變體（而不是字元本身）是否相等
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 舊行為（詳情見問題）
> - 1.5: 變更 `Char.equals` 函數的行為

### 移除預設區域設定敏感的大小寫轉換 API

> **問題 (Issue)**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **元件 (Component)**: kotlin-stdlib
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: 自 Kotlin 1.5 起，`String.toUpperCase()` 等預設區域設定敏感的大小寫轉換函數將被棄用
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5: 棄用帶有預設區域設定的大小寫轉換函數（詳情見問題），並建議替代方案

### 逐步將集合 min 和 max 函數的回傳型別變更為非可空

> **問題 (Issue)**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **元件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: 集合 `min` 和 `max` 函數的回傳型別將在 1.6 中變更為非可空
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4: 引入 `...OrNull` 函數作為同義詞並棄用受影響的 API（詳情見問題）
> - 1.5.0: 將受影響 API 的棄用級別提升為錯誤
> - &gt;=1.6: 重新引入受影響的 API 但回傳型別為非可空

### 提升浮點型別轉換為 Short 和 Byte 的棄用級別

> **問題 (Issue)**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **元件 (Component)**: kotlin-stdlib (JVM)
>
> **不相容變更類型 (Incompatible change type)**: source
>
> **簡要摘要 (Short summary)**: Kotlin 1.4 中以 `WARNING` 級別棄用的浮點型別轉換為 `Short` 和 `Byte`，自 Kotlin 1.5.0 起將導致錯誤。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4: 棄用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 並建議替代方案
> - 1.5.0: 將棄用級別提升為錯誤

## 工具 (Tools)

### 不要在單一專案中混用多個 kotlin-test 的 JVM 變體

> **問題 (Issue)**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **元件 (Component)**: Gradle
>
> **不相容變更類型 (Incompatible change type)**: behavioral
>
> **簡要摘要 (Short summary)**: 如果其中一個 `kotlin-test` 變體是由傳遞性依賴引入，則專案中可能會存在針對不同測試框架的多個互斥 `kotlin-test` 變體。從 1.5.0 起，Gradle 將不允許存在針對不同測試框架的互斥 `kotlin-test` 變體。
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5: 允許存在針對不同測試框架的多個互斥 `kotlin-test` 變體
> - &gt;= 1.5: 行為已變更，
>  Gradle 會拋出類似「無法選取與功能衝突的模組...」的例外。可能的解決方案：
>    * 使用與傳遞性依賴所引入的相同的 `kotlin-test` 變體和對應的測試框架。
>    * 尋找不傳遞性引入 `kotlin-test` 變體的依賴項的另一個變體，這樣您就可以使用您想使用的測試框架。
>    * 尋找傳遞性引入另一個 `kotlin-test` 變體（該變體使用您想使用的相同測試框架）的依賴項的另一個變體。
>    * 排除傳遞性引入的測試框架。以下是排除 JUnit 4 的範例：
>      ```groovy
>      configurations {
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除測試框架後，測試您的應用程式。如果它停止運作，請回溯排除的變更，
> 使用庫所使用的相同測試框架，並排除您自己的測試框架。