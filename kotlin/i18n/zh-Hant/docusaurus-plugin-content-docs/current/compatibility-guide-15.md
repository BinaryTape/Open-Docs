---
title: "Kotlin 1.5 的相容性指南"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[保持語言現代化](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則之一。 前者表示應該移除阻礙語言發展的結構，而後者表示應該事先充分溝通這種移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已經透過其他管道宣布，例如更新日誌或編譯器警告，但本文檔總結了所有這些變更，為從 Kotlin 1.4 遷移到 Kotlin 1.5 提供了完整的參考。

## 基本術語

在本文檔中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再也無法編譯
- _二進制檔 (binary)_：如果交換兩個二進制檔不會導致載入或連結錯誤，則稱它們是二進制檔相容的
- _行為 (behavioral)_：如果同一個程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容

請記住，這些定義僅適用於純 Kotlin。 從其他語言角度來看，Kotlin 程式碼的相容性
（例如，從 Java）不在本文檔的範圍內。

## 語言和標準函式庫 (stdlib)

### 禁止在簽名多態呼叫 (signature-polymorphic calls) 中使用展開運算符

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止在簽名多態呼叫中使用展開運算符 (*)
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的運算符在呼叫點引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 可用於暫時恢復到 1.5 之前的行為

### 禁止包含對該類別不可見的抽象成員（internal/package-private）的非抽象類別

> **Issue**: [KT-27825](https://youtrack.jetbrains.com/issue/KT-27825)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止包含對該類別不可見的抽象成員（internal/package-private）的非抽象類別
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的類別引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitInvisibleAbstractMethodsInSuperclasses` 可用於暫時恢復到 1.5 之前的行為

### 禁止在 JVM 上使用基於非具體化型別參數 (non-reified type parameters) 的陣列作為具體化型別參數 (reified type arguments)

> **Issue**: [KT-31227](https://youtrack.jetbrains.com/issue/KT-31227)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止在 JVM 上使用基於非具體化型別參數的陣列作為具體化型別參數
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitNonReifiedArraysAsReifiedTypeArguments` 可用於暫時恢復到 1.5 之前的行為

### 禁止不委託給主構造函數的次要列舉類別構造函數 (secondary enum class constructors)

> **Issue**: [KT-35870](https://youtrack.jetbrains.com/issue/KT-35870)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止不委託給主構造函數的次要列舉類別構造函數
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的構造函數引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-RequiredPrimaryConstructorDelegationCallInEnums` 可用於暫時恢復到 1.5 之前的行為

### 禁止從私有內聯函數 (private inline functions) 暴露匿名類型 (anonymous types)

> **Issue**: [KT-33917](https://youtrack.jetbrains.com/issue/KT-33917)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止從私有內聯函數暴露匿名類型
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的構造函數引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ApproximateAnonymousReturnTypesInPrivateInlineFunctions` 可用於暫時恢復到 1.5 之前的行為

### 禁止在使用 SAM 轉換 (SAM-conversion) 的引數之後傳遞非展開陣列 (non-spread arrays)

> **Issue**: [KT-35224](https://youtrack.jetbrains.com/issue/KT-35224)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止在使用 SAM 轉換的引數之後傳遞非展開陣列
>
> **Deprecation cycle**:
>
> - 1.3.70: 為有問題的呼叫引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ProhibitVarargAsArrayAfterSamArgument` 可用於暫時恢復到 1.5 之前的行為

### 支援底線命名 (underscore-named) 的 catch 區塊參數的特殊語義

> **Issue**: [KT-31567](https://youtrack.jetbrains.com/issue/KT-31567)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止引用底線符號 (`_`)，該符號用於省略 catch 區塊中異常的參數名稱
>
> **Deprecation cycle**:
>
> - 1.4.20: 為有問題的引用引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-ForbidReferencingToUnderscoreNamedParameterOfCatchBlock` 可用於暫時恢復到 1.5 之前的行為

### 將 SAM 轉換的實現策略從基於匿名類別 (anonymous class-based) 更改為 invokedynamic

> **Issue**: [KT-44912](https://youtrack.jetbrains.com/issue/KT-44912)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 Kotlin 1.5 開始，SAM（單一抽象方法 (single abstract method)）轉換的實現策略將從生成匿名類別更改為使用 `invokedynamic` JVM 指令
>
> **Deprecation cycle**:
>
> - 1.5: 更改 SAM 轉換的實現策略，
>  `-Xsam-conversions=class` 可用於將實現方案恢復為之前的方案

### 基於 JVM IR 的後端 (backend) 的效能問題

> **Issue**: [KT-48233](https://youtrack.jetbrains.com/issue/KT-48233)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 1.5 預設使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)
> 用於 Kotlin/JVM 編譯器。 舊的後端仍然預設用於較早的語言版本。
>
> 在 Kotlin 1.5 中使用新的編譯器時，您可能會遇到一些效能下降問題。 我們正在努力修復
> 這些情況。
>
> **Deprecation cycle**:
>
> - < 1.5: 預設情況下，使用舊的 JVM 後端
> - &gt;= 1.5: 預設情況下，使用基於 IR 的後端。 如果您需要在 Kotlin 1.5 中使用舊的後端，
> 將以下程式碼行新增到專案的組態檔中，以暫時恢復到 1.5 之前的行為：
>
> 在 Gradle 中：
>
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
> 對於此標誌的支援將在未來的版本中移除。

### 基於 JVM IR 的後端中的新欄位排序 (new field sorting)

> **Issue**: [KT-46378](https://youtrack.jetbrains.com/issue/KT-46378)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 1.5 版開始，Kotlin 使用 [基於 IR 的後端](https://blog.jetbrains.com/kotlin/2021/02/the-jvm-backend-is-in-beta-let-s-make-it-stable-together/)
> 它以不同的方式對 JVM 位元組碼進行排序：它在主體中聲明的欄位之前生成在構造函數中聲明的欄位，
> 而對於舊的後端則相反。 新的排序可能會更改使用以下程式的行為
> 依賴於欄位順序的序列化框架 (serialization frameworks)，例如 Java 序列化。
>
> **Deprecation cycle**:
>
> - < 1.5: 預設情況下，使用舊的 JVM 後端。 它在構造函數中聲明的欄位之前具有在主體中聲明的欄位。
> - &gt;= 1.5: 預設情況下，使用新的基於 IR 的後端。 在主體中聲明的欄位之前生成在構造函數中聲明的欄位。 作為一種解決方法，您可以暫時切換到 Kotlin 1.5 中的舊後端。 為此，
> 將以下程式碼行新增到專案的組態檔中：
>
> 在 Gradle 中：
>
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
> 對於此標誌的支援將在未來的版本中移除。

### 為委託表達式 (delegate expression) 中具有泛型呼叫 (generic call) 的委託屬性 (delegated properties) 生成可空性斷言 (nullability assertion)

> **Issue**: [KT-44304](https://youtrack.jetbrains.com/issue/KT-44304)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 Kotlin 1.5 開始，Kotlin 編譯器將為委託表達式中具有泛型呼叫的委託屬性發出可空性斷言
>
> **Deprecation cycle**:
>
> - 1.5: 為委託屬性發出可空性斷言（請參閱 issue 中的詳細資訊），
>  `-Xuse-old-backend` 或 `-language-version 1.4` 可用於暫時恢復到 1.5 之前的行為

### 將使用 @OnlyInputTypes 註釋的型別參數的呼叫的警告轉換為錯誤

> **Issue**: [KT-45861](https://youtrack.jetbrains.com/issue/KT-45861)
>
> **Component**: 核心語言 (Core language)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: Kotlin 1.5 將禁止使用無意義的引數進行 `contains`、`indexOf` 和 `assertEquals` 等呼叫，以提高型別安全性
>
> **Deprecation cycle**:
>
> - 1.4.0: 為有問題的構造函數引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-StrictOnlyInputTypesChecks` 可用於暫時恢復到 1.5 之前的行為

### 在具有命名 vararg (named vararg) 的呼叫中使用正確的引數執行順序

> **Issue**: [KT-17691](https://youtrack.jetbrains.com/issue/KT-17691)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 1.5 將更改具有命名 vararg 的呼叫中的引數執行順序
>
> **Deprecation cycle**:
>
> - < 1.5: 為有問題的構造函數引入警告
> - &gt;= 1.5: 將此警告提升為錯誤，
>  `-XXLanguage:-UseCorrectExecutionOrderForVarargArguments` 可用於暫時恢復到 1.5 之前的行為

### 在運算符函式呼叫 (operator functional calls) 中使用參數的預設值

> **Issue**: [KT-42064](https://youtrack.jetbrains.com/issue/KT-42064)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: Kotlin 1.5 將在運算符呼叫中使用參數的預設值
>
> **Deprecation cycle**:
>
> - < 1.5: 舊的行為（請參閱 issue 中的詳細資訊）
> - &gt;= 1.5: 行為已更改，
>  `-XXLanguage:-JvmIrEnabledByDefault` 可用於暫時恢復到 1.5 之前的行為

### 如果常規級數 (regular progression) 也為空，則在 for 迴圈中產生空的反向級數 (reversed progressions)

> **Issue**: [KT-42533](https://youtrack.jetbrains.com/issue/KT-42533)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 如果常規級數也為空，則 Kotlin 1.5 將在 for 迴圈中產生空的反向級數
>
> **Deprecation cycle**:
>
> - < 1.5: 舊的行為（請參閱 issue 中的詳細資訊）
> - &gt;= 1.5: 行為已更改，
>  `-XXLanguage:-JvmIrEnabledByDefault` 可用於暫時恢復到 1.5 之前的行為

### 理順 Char 到程式碼 (Char-to-code) 和 Char 到數字 (Char-to-digit) 的轉換

> **Issue**: [KT-23451](https://youtrack.jetbrains.com/issue/KT-23451)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 從 Kotlin 1.5 開始，將棄用 Char 到數字類型的轉換
>
> **Deprecation cycle**:
>
> - 1.5: 棄用 `Char.toInt()/toShort()/toLong()/toByte()/toDouble()/toFloat()` 和反向函數，例如 `Long.toChar()`，並提出替換方案

### kotlin.text 函數中不一致的不區分大小寫的字元比較 (case-insensitive comparison)

> **Issue**: [KT-45496](https://youtrack.jetbrains.com/issue/KT-45496)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 從 Kotlin 1.5 開始，`Char.equals` 將在不區分大小寫的情況下得到改進，首先比較字元的大寫變體是否相等，然後比較這些大寫變體的 小寫變體（而不是字元本身）是否相等
>
> **Deprecation cycle**:
>
> - < 1.5: 舊的行為（請參閱 issue 中的詳細資訊）
> - 1.5: 更改 `Char.equals` 函數的行為

### 移除預設的區分地區設定的大小寫轉換 API (locale-sensitive case conversion API)

> **Issue**: [KT-43023](https://youtrack.jetbrains.com/issue/KT-43023)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 從 Kotlin 1.5 開始，預設的區分地區設定的大小寫轉換函數（如 `String.toUpperCase()`）將被棄用
>
> **Deprecation cycle**:
>
> - 1.5: 棄用具有預設地區設定的大小寫轉換函數（請參閱 issue 中的詳細資訊），並提出替換方案

### 逐步將集合 min 和 max 函數的返回類型更改為不可為空 (non-nullable)

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 集合 `min` 和 `max` 函數的返回類型將在 1.6 中更改為不可為空
>
> **Deprecation cycle**:
>
> - 1.4: 引入 `...OrNull` 函數作為同義詞，並棄用受影響的 API（請參閱 issue 中的詳細資訊）
> - 1.5.0: 將受影響的 API 的棄用級別提高到錯誤
> - &gt;=1.6: 重新引入受影響的 API，但具有不可為空的返回類型

### 提高浮點類型 (floating-point types) 到 Short 和 Byte 的轉換的棄用級別 (deprecation level)

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **Component**: kotlin-stdlib (JVM)
>
> **Incompatible change type**: 原始碼 (source)
>
> **Short summary**: 在 Kotlin 1.4 中棄用的浮點類型到 `Short` 和 `Byte` 的轉換，其 `WARNING`
> 級別將從 Kotlin 1.5.0 開始導致錯誤。
>
> **Deprecation cycle**:
>
> - 1.4: 棄用 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()` 並提出替換方案
> - 1.5.0: 將棄用級別提高到錯誤

## 工具

### 不要在單個專案中混合 kotlin-test 的多個 JVM 變體

> **Issue**: [KT-40225](https://youtrack.jetbrains.com/issue/KT-40225)
>
> **Component**: Gradle
>
> **Incompatible change type**: 行為 (behavioral)
>
> **Short summary**: 如果其中一個是透過傳遞依賴項引入的，則不同的測試框架的多個互斥的 `kotlin-test` 變體可能位於一個專案中。 從 1.5.0 開始，Gradle 不允許具有不同的測試框架的多個互斥的 `kotlin-test`
> 變體。
>
> **Deprecation cycle**:
>
> - < 1.5: 允許具有不同的測試框架的多個互斥的 `kotlin-test` 變體
> - &gt;= 1.5: 行為已更改，
> Gradle 拋出一個異常，如 "Cannot select module with conflict on capability..."。 可能的解決方案：
>    * 使用與傳遞依賴項引入的相同的 `kotlin-test` 變體和相應的測試框架。
>    * 找到該依賴項的另一個變體，該變體不會傳遞地引入 `kotlin-test` 變體，因此您可以使用您想要使用的測試框架。
>    * 找到該依賴項的另一個變體，該變體傳遞地引入另一個 `kotlin-test` 變體，該變體使用您想要使用的相同測試框架。
>    * 排除傳遞引入的測試框架。 以下範例用於排除 JUnit 4：
>      ```groovy
>      configurations { 
>          testImplementation.get().exclude("org.jetbrains.kotlin", "kotlin-test-junit")
>      }
>      ```
>      排除測試框架後，測試您的應用程式。 如果它停止工作，則回滾排除更改，
> 使用與程式庫相同的測試框架，並排除您的測試框架。