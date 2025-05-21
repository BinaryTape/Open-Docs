---
title: "Kotlin 1.7 的相容性指南"
---
_[保持語言現代化](kotlin-evolution-principles)_ 和 _[舒適的更新](kotlin-evolution-principles)_ 是 Kotlin 語言設計的基本原則。 前者表示應該移除阻礙語言演進的結構，而後者表示應該預先充分溝通此移除，以使程式碼遷移盡可能順暢。

雖然大多數語言變更已透過其他管道 (例如更新變更日誌或編譯器警告) 宣布，但本文總結了所有這些變更，為從 Kotlin 1.6 遷移到 Kotlin 1.7 提供了完整的參考。

## 基本術語

在本文中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容的變更會阻止原本可以正常編譯（沒有錯誤或警告）的程式碼再進行編譯。
- _二進位 (binary)_：如果交換兩個二進位構件不會導致載入或連結錯誤，則稱它們是二進位相容的。
- _行為 (behavioral)_：如果同一程式在應用變更前後表現出不同的行為，則稱該變更在行為上不相容。

請記住，這些定義僅適用於純 Kotlin。 從其他語言的角度來看，Kotlin 程式碼的相容性（例如，從 Java）不在本文的範圍內。

## 語言

<!--
### 標題

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 使安全呼叫結果始終可為空 (nullable)

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 將始終認為安全呼叫結果的類型可為空 (nullable)，即使安全呼叫的接收者不可為空 (non-nullable)
>
> **Deprecation cycle**:
>
> - &lt;1.3：在非可空接收器上不必要的安全呼叫時報告警告
> - 1.6.20：額外警告說，不必要的安全呼叫的結果將在下一個版本中更改其類型
> - 1.7.0：將安全呼叫結果的類型更改為可空 (nullable)，
>   `-XXLanguage:-SafeCallsAreAlwaysNullable` 可用於暫時恢復到 1.7 之前的行為

### 禁止將超級呼叫 (super call) 委託給抽象超類別成員

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當顯式或隱式超級呼叫 (super call) 委託給超類別的 _abstract_ 成員時，即使超介面中存在預設實現，Kotlin 也會報告編譯錯誤
>
> **Deprecation cycle**:
>
> - 1.5.20：引入在使用未覆寫所有抽象成員的非抽象類別時發出警告
> - 1.7.0：如果超級呼叫 (super call) 實際上存取了超類別中的抽象成員，則報告錯誤
> - 1.7.0：如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容性模式，則報告錯誤；
>   在漸進模式下報告錯誤
> - &gt;=1.8.0：在所有情況下報告錯誤

### 禁止透過在非公開主建構函式中宣告的公開屬性公開非公開類型

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 將阻止在私有主建構函式中宣告具有非公開類型的公開屬性。
> 從另一個套件存取此類屬性可能會導致 `IllegalAccessError`
>
> **Deprecation cycle**:
>
> - 1.3.20：在具有非公開類型並在非公開建構函式中宣告的公開屬性上報告警告
> - 1.6.20：在漸進模式下將此警告提升為錯誤
> - 1.7.0：將此警告提升為錯誤

### 禁止存取使用枚舉名稱限定的未初始化枚舉條目

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 當這些條目使用枚舉名稱限定時，Kotlin 1.7 將禁止從枚舉靜態初始化器區塊存取未初始化的枚舉條目
>
> **Deprecation cycle**:
>
> - 1.7.0：從枚舉靜態初始化器區塊存取未初始化的枚舉條目時報告錯誤

### 禁止在 `when` 條件分支和迴圈條件中計算複雜布林表達式的常數值

> **Issue**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 將不再基於文字 `true` 和 `false` 以外的常數布林表達式進行詳盡性和控制流程假設
>
> **Deprecation cycle**:
>
> - 1.5.30：當 `when` 或控制流程可達性的詳盡性
>   基於 `when` 分支或迴圈條件中的複雜常數布林表達式確定時報告警告
> - 1.7.0：將此警告提升為錯誤

### 預設情況下，使具有枚舉、密封 (sealed) 和布林主體的 `when` 語句詳盡

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 將報告具有枚舉、密封 (sealed) 或布林主體的 `when` 語句非詳盡的錯誤
>
> **Deprecation cycle**:
>
> - 1.6.0：當具有枚舉、密封 (sealed) 或布林主體的 `when` 語句非詳盡時引入警告（在漸進模式下為錯誤）
> - 1.7.0：將此警告提升為錯誤

### 棄用 `when-with-subject` 中令人困惑的文法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 棄用了 `when` 條件表達式中的幾個令人困惑的文法結構
>
> **Deprecation cycle**:
>
> - 1.6.20：在受影響的表達式上引入棄用警告
> - 1.8.0：將此警告提升為錯誤
> - &gt;= 1.8：將一些棄用的結構重新用於新的語言功能

### 類型可空性 (nullability) 增強改進

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.7 將更改它如何載入和解釋 Java 程式碼中的類型可空性 (nullability) 註解
>
> **Deprecation cycle**:
>
> - 1.4.30：為更精確的類型可空性 (nullability) 可能導致錯誤的情況引入警告
> - 1.7.0：推斷 Java 類型的更精確的可空性 (nullability)，
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用於暫時恢復到 1.7 之前的行為

### 避免不同數字類型之間的隱式強制轉換

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: behavioral
>
> **Short summary**: Kotlin 將避免自動將數值轉換為基本數字類型，而從語義上講只需要向下轉換為該類型
>
> **Deprecation cycle**:
>
> - < 1.5.30：所有受影響情況下的舊行為
> - 1.5.30：修復生成的屬性委託存取器中的向下轉換行為，
>   `-Xuse-old-backend` 可用於暫時恢復到 1.5.30 之前的修復行為
> - &gt;= 1.7.20：修復其他受影響情況下的向下轉換行為

### 棄用編譯器選項 `-Xjvm-default` 的啟用和相容性模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6.20 警告使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式
>
> **Deprecation cycle**:
>
> - 1.6.20：在 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式上引入警告
> - &gt;= 1.8.0：將此警告提升為錯誤

### 禁止呼叫名為 `suspend` 的函數，並帶有尾隨 lambda

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 1.6 不再允許呼叫名為 `suspend` 的使用者函數，該函數具有作為尾隨 lambda 傳遞的功能類型單一參數
>
> **Deprecation cycle**:
>
> - 1.3.0：在此類函數呼叫上引入警告
> - 1.6.0：將此警告提升為錯誤
> - 1.7.0：對語言文法進行變更，以便將 `{` 之前的 `suspend` 解析為關鍵字

### 如果基底類別來自另一個模組，則禁止對基底類別屬性進行智慧轉換 (smart cast)

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 如果基底類別位於另一個模組中，Kotlin 1.7 將不再允許對超類別的屬性進行智慧轉換 (smart cast)
>
> **Deprecation cycle**:
>
> - 1.6.0：在另一個模組中的超類別中宣告的屬性上報告智慧轉換 (smart cast) 的警告
> - 1.7.0：將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 可用於暫時恢復到 1.7 之前的行為

### 在類型推斷期間不要忽略有意義的約束

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: Core language
>
> **Incompatible change type**: source
>
> **Short summary**: 由於不正確的優化，Kotlin 1.4−1.6 在類型推斷期間忽略了一些類型約束。
> 它可能允許編寫不健全的程式碼，從而在運行時導致 `ClassCastException`。
> Kotlin 1.7 考慮了這些約束，因此禁止了不健全的程式碼
>
> **Deprecation cycle**:
>
> - 1.5.20：報告如果考慮所有類型推斷約束，則會發生類型不符的表達式的警告
> - 1.7.0：考慮所有約束，因此將此警告提升為錯誤，
>   `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 可用於暫時恢復到 1.7 之前的行為

## 標準函式庫

### 逐步將集合 `min` 和 `max` 函數的返回類型更改為不可空 (non-nullable)

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: 集合 `min` 和 `max` 函數的返回類型將在 Kotlin 1.7 中更改為不可空 (non-nullable)
>
> **Deprecation cycle**:
>
> - 1.4.0：引入 `...OrNull` 函數作為同義詞並棄用受影響的 API（請參閱 issue 中的詳細資訊）
> - 1.5.0：將受影響的 API 的棄用等級提升為錯誤
> - 1.6.0：從公共 API 隱藏棄用的函數
> - 1.7.0：重新引入受影響的 API，但使用不可空 (non-nullable) 返回類型

### 棄用浮點陣列函數：contains、indexOf、lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 棄用浮點陣列函數 `contains`、`indexOf`、`lastIndexOf`，這些函數使用 IEEE-754 順序而不是總順序來比較值
>
> **Deprecation cycle**:
>
> - 1.4.0：棄用受影響的函數並發出警告
> - 1.6.0：將棄用等級提升為錯誤
> - 1.7.0：從公共 API 隱藏棄用的函數

### 將宣告從 `kotlin.dom` 和 `kotlin.browser` 套件遷移到 `kotlinx.*`

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: 來自 `kotlin.dom` 和 `kotlin.browser` 套件的宣告已移動到相應的 `kotlinx.*` 套件，以準備將它們從 stdlib 中提取出來
>
> **Deprecation cycle**:
>
> - 1.4.0：在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替換 API
> - 1.4.0：棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議使用上面的新 API 作為替換
> - 1.6.0：將棄用等級提升為錯誤
> - &gt;= 1.8：從 stdlib 中移除棄用的函數
> - &gt;= 1.8：將 kotlinx.* 套件中的 API 移動到單獨的函式庫

### 棄用一些僅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: source
>
> **Short summary**: stdlib 中的許多僅限 JS 的函數已被棄用以供移除。 它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)` 和陣列上採用比較函數的 `sort` 函數，例如 `Array<out T>.sort(comparison: (a: T, b: T) `->` Int)`
>
> **Deprecation cycle**:
>
> - 1.6.0：棄用受影響的函數並發出警告
> - 1.8.0：將棄用等級提升為錯誤
> - 1.9.0：從公共 API 中移除棄用的函數

## 工具

### 移除 KotlinGradleSubplugin 類別

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `KotlinGradleSubplugin` 類別。 請改用 `KotlinCompilerPluginSupportPlugin` 類別
>
> **Deprecation cycle**:
>
> - 1.6.0：將棄用等級提升為錯誤
> - 1.7.0：移除棄用的類別

### 移除 useIR 編譯器選項

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除棄用且隱藏的 `useIR` 編譯器選項
>
> **Deprecation cycle**:
>
> - 1.5.0：將棄用等級提升為警告
> - 1.6.0：隱藏選項
> - 1.7.0：移除棄用的選項

### 棄用 kapt.use.worker.api Gradle 屬性

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 運行 kapt（預設值：true）
>
> **Deprecation cycle**:
>
> - 1.6.20：將棄用等級提升為警告
> - &gt;= 1.8.0：移除此屬性

### 移除 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性
>
> **Deprecation cycle**:
>
> - 1.6.20：將棄用等級提升為警告
> - 1.7.0：移除 DSL 選項、其封閉的 `experimental` 區塊和屬性

### 棄用 useExperimentalAnnotation 編譯器選項

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除隱藏的 `useExperimentalAnnotation()` Gradle 函數，該函數用於選擇加入在模組中使用 API。
> 可以改用 `optIn()` 函數
>
> **Deprecation cycle:**
>
> - 1.6.0：隱藏棄用選項
> - 1.7.0：移除棄用的選項

### 棄用 kotlin.compiler.execution.strategy 系統屬性

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 棄用用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。
> 請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`
>
> **Deprecation cycle:**
>
> - 1.7.0：將棄用等級提升為警告
> - &gt; 1.7.0：移除屬性

### 移除 kotlinOptions.jdkHome 編譯器選項

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除用於將來自指定位置的自訂 JDK 包含到類別路徑中而不是預設 `JAVA_HOME` 的 `kotlinOptions.jdkHome` 編譯器選項。 請改用 [Java 工具鏈](gradle-configure-project#gradle-java-toolchains-support)
>
> **Deprecation cycle:**
>
> - 1.5.30：將棄用等級提升為警告
> - &gt; 1.7.0：移除選項

### 移除 noStdlib 編譯器選項

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `noStdlib` 編譯器選項。 Gradle 外掛程式使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在
>
> **Deprecation cycle:**
>
> - 1.5.0：將棄用等級提升為警告
> - 1.7.0：移除選項

### 移除 kotlin2js 和 kotlin-dce-plugin 外掛程式

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: 移除 `kotlin2js` 和 `kotlin-dce-plugin` 外掛程式。 使用新的 `org.jetbrains.kotlin.js` 外掛程式而不是 `kotlin2js`。
> 當 Kotlin/JS Gradle 外掛程式[正確配置](http://javascript-dce)時，無效程式碼消除 (DCE) 才有效

>
> **Deprecation cycle:**
>
> - 1.4.0：將棄用等級提升為警告
> - 1.7.0：移除外掛程式

### 編譯任務中的變更

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: source
>
> **Short summary**: Kotlin 編譯任務不再繼承 Gradle `AbstractCompile` 任務，這就是為什麼 `sourceCompatibility` 和 `targetCompatibility` 輸入在 Kotlin 使用者的腳本中不再可用的原因。
> `SourceTask.stableSources` 輸入不再可用。 `sourceFilesExtensions` 輸入已移除。
> 棄用的 `Gradle destinationDir: File` 輸出已替換為 `destinationDirectory: DirectoryProperty` 輸出。
> `KotlinCompile` 任務的 `classpath` 屬性已棄用
>
> **Deprecation cycle:**
>
> - 1.7.0：輸入不可用，輸出已替換，`classpath` 屬性已棄用