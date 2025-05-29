[//]: # (title: Kotlin 1.7 相容性指南)

_[保持語言現代化](kotlin-evolution-principles.md)_ 和 _[舒適的更新](kotlin-evolution-principles.md)_ 是 Kotlin 語言設計中的基本原則。前者指出，阻礙語言演進的結構應被移除；後者則表示，此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）宣布，但本文總結了所有這些變更，為從 Kotlin 1.6 遷移到 Kotlin 1.7 提供了完整的參考資料。

## 基本術語

本文中，我們介紹了幾種相容性類型：

- _原始碼_：原始碼不相容的變更會導致原本能正常編譯（沒有錯誤或警告）的程式碼不再能編譯。
- _二進位_：如果兩個二進位構件（binary artifacts）之間可以互相替換，而不會導致載入或連結錯誤，則稱它們為二進位相容。
- _行為_：如果同一個程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言的角度來看，Kotlin 程式碼的相容性（例如，從 Java 來看）超出本文的範圍。

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
> - 1.5.20: warning
> - 1.7.0: report an error
-->

### 使安全呼叫結果總是可為空

> **Issue**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.7 將使安全呼叫結果的類型總是可為空 (nullable)，即使安全呼叫的接收者是不可為空 (non-nullable) 的。
>
> **Deprecation cycle**:
>
> - &lt;1.3: 對於非空接收者上不必要的安全呼叫回報警告
> - 1.6.20: 額外警告不必要的安全呼叫結果類型將在下一個版本中改變
> - 1.7.0: 將安全呼叫結果的類型變更為可為空，可以使用 `-XXLanguage:-SafeCallsAreAlwaysNullable` 暫時恢復到 1.7 之前的行為

### 禁止將超類呼叫委託給抽象超類成員

> **Issues**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 當明確或隱式超類呼叫被委託給超類的_抽象_成員時，Kotlin 將會回報編譯錯誤，即使超介面中存在預設實作。
>
> **Deprecation cycle**:
>
> - 1.5.20: 引入警告，當使用未覆寫所有抽象成員的非抽象類別時
> - 1.7.0: 如果超類呼叫實際上存取了超類中的抽象成員，則回報錯誤
> - 1.7.0: 如果啟用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容性模式，則回報錯誤；在漸進模式下回報錯誤
> - &gt;=1.8.0: 在所有情況下回報錯誤

### 禁止透過非公開主要建構子中宣告的公開屬性暴露非公開類型

> **Issue**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 將阻止在私有主要建構子中宣告具有非公開類型的公開屬性。從另一個套件存取此類屬性可能導致 `IllegalAccessError`。
>
> **Deprecation cycle**:
>
> - 1.3.20: 對於在非公開建構子中宣告的、具有非公開類型的公開屬性回報警告
> - 1.6.20: 在漸進模式下將此警告提升為錯誤
> - 1.7.0: 將此警告提升為錯誤

### 禁止存取以列舉名稱限定的未初始化列舉條目

> **Issue**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.7 將禁止從列舉的靜態初始化器區塊中存取以列舉名稱限定的未初始化列舉條目。
>
> **Deprecation cycle**:
>
> - 1.7.0: 當從列舉的靜態初始化器區塊存取未初始化列舉條目時回報錯誤

### 禁止在 when 條件分支和迴圈條件中計算複雜布林運算式的常數值

> **Issue**: [KT-39883](https://youtrack.com/issue/KT-39883)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 將不再根據除文字 `true` 和 `false` 以外的常數布林運算式做出窮盡性和控制流假設。
>
> **Deprecation cycle**:
>
> - 1.5.30: 當 `when` 的窮盡性或控制流可達性是根據 `when` 分支或迴圈條件中複雜的常數布林運算式決定時，回報警告
> - 1.7.0: 將此警告提升為錯誤

### 預設使帶有列舉、密封類和布林主題的 when 語句窮盡

> **Issue**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.7 將對帶有列舉、密封類 (sealed) 或布林 (Boolean) 主題的 `when` 語句非窮盡情況回報錯誤。
>
> **Deprecation cycle**:
>
> - 1.6.0: 引入警告，當帶有列舉、密封類或布林主題的 `when` 語句非窮盡時（漸進模式下為錯誤）
> - 1.7.0: 將此警告提升為錯誤

### 棄用帶主題 when 語句中的混淆文法

> **Issue**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.6 棄用 (deprecated) 了 `when` 條件運算式中一些混淆的文法結構。
>
> **Deprecation cycle**:
>
> - 1.6.20: 對受影響的運算式引入棄用警告
> - 1.8.0: 將此警告提升為錯誤
> - &gt;= 1.8: 將一些棄用結構重新用於新的語言功能

### 類型可為空性增強改進

> **Issue**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.7 將改變其載入和解釋 Java 程式碼中類型可為空性註解的方式。
>
> **Deprecation cycle**:
>
> - 1.4.30: 引入警告，針對更精確的類型可為空性可能導致錯誤的情況
> - 1.7.0: 推斷更精確的 Java 類型可為空性，可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暫時恢復到 1.7 之前的行為

### 阻止不同數字類型之間的隱式強制轉換

> **Issue**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 行為
>
> **Short summary**: Kotlin 將避免自動將數值轉換為原始數字類型，在語義上僅需要向下轉型到該類型的情況。
>
> **Deprecation cycle**:
>
> - &lt; 1.5.30: 所有受影響情況下的舊行為
> - 1.5.30: 修正生成屬性委託存取器中的向下轉型行為，可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 修正前的行為
> - &gt;= 1.7.20: 修正其他受影響情況下的向下轉型行為

### 棄用編譯器選項 -Xjvm-default 的啟用和相容性模式

> **Issue**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **Component**: Kotlin/JVM
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.6.20 針對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式的使用發出警告。
>
> **Deprecation cycle**:
>
> - 1.6.20: 對於 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - &gt;= 1.8.0: 將此警告提升為錯誤

### 禁止呼叫帶有尾隨 lambda 且名為 suspend 的函數

> **Issue**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 1.6 不再允許呼叫名為 `suspend` 且單一參數為函數類型並以尾隨 lambda 形式傳遞的使用者函數。
>
> **Deprecation cycle**:
>
> - 1.3.0: 對此類函數呼叫引入警告
> - 1.6.0: 將此警告提升為錯誤
> - 1.7.0: 引入語言文法變更，使 `{` 前的 `suspend` 被解析為關鍵字

### 禁止在基礎類別屬性上進行智慧型轉型，如果基礎類別來自另一個模組

> **Issue**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 如果超類 (superclass) 位於另一個模組中，Kotlin 1.7 將不再允許對其屬性進行智慧型轉型 (smart casts)。
>
> **Deprecation cycle**:
>
> - 1.6.0: 對於在另一個模組中定義的超類屬性上的智慧型轉型回報警告
> - 1.7.0: 將此警告提升為錯誤，可以使用 `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 暫時恢復到 1.7 之前的行為

### 類型推斷期間不應忽略有意義的約束

> **Issue**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **Component**: 核心語言
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 由於不正確的最佳化，Kotlin 1.4-1.6 在類型推斷期間忽略了一些類型約束。這可能允許編寫不健全的程式碼，導致執行時 `ClassCastException`。Kotlin 1.7 將這些約束納入考量，從而禁止不健全的程式碼。
>
> **Deprecation cycle**:
>
> - 1.5.20: 對於如果考慮所有類型推斷約束將發生類型不匹配的運算式回報警告
> - 1.7.0: 將所有約束納入考量，從而將此警告提升為錯誤，可以使用 `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 暫時恢復到 1.7 之前的行為

## 標準函式庫

### 逐步將集合 min 和 max 函數的回傳類型變更為不可為空

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 集合 `min` 和 `max` 函數的回傳類型將在 Kotlin 1.7 中變更為不可為空。
>
> **Deprecation cycle**:
>
> - 1.4.0: 引入 `...OrNull` 函數作為同義詞並棄用受影響的 API（詳情請參閱問題）
> - 1.5.0: 將受影響 API 的棄用級別提升為錯誤
> - 1.6.0: 從公共 API 隱藏棄用的函數
> - 1.7.0: 重新引入受影響的 API 但帶有不可為空的回傳類型

### 棄用浮點數陣列函數：contains, indexOf, lastIndexOf

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **Component**: kotlin-stdlib
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 棄用使用 IEEE-754 順序而非總順序（total order）比較值的浮點數陣列函數 `contains`、`indexOf`、`lastIndexOf`。
>
> **Deprecation cycle**:
>
> - 1.4.0: 以警告方式棄用受影響的函數
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.7.0: 從公共 API 隱藏棄用的函數

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **Issue**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 為了準備從標準庫中提取，`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至對應的 `kotlinx.*` 套件。
>
> **Deprecation cycle**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並提議上述新 API 作為替代
> - 1.6.0: 將棄用級別提升為錯誤
> - &gt;= 1.8: 從標準庫中移除棄用的函數
> - &gt;= 1.8: 將 kotlinx.* 套件中的 API 移至單獨的函式庫

### 棄用部分僅限 JS 的 API

> **Issue**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **Component**: kotlin-stdlib (JS)
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 標準庫中一些僅限 JS 的函數已被棄用並將被移除。其中包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函數的陣列 `sort` 函數，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **Deprecation cycle**:
>
> - 1.6.0: 以警告方式棄用受影響的函數
> - 1.8.0: 將棄用級別提升為錯誤
> - 1.9.0: 從公共 API 移除棄用的函數

## 工具

### 移除 KotlinGradleSubplugin 類別

> **Issue**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除 `KotlinGradleSubplugin` 類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。
>
> **Deprecation cycle**:
>
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.7.0: 移除棄用的類別

### 移除 useIR 編譯器選項

> **Issue**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除已棄用和隱藏的 `useIR` 編譯器選項。
>
> **Deprecation cycle**:
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.6.0: 隱藏此選項
> - 1.7.0: 移除棄用的選項

### 棄用 kapt.use.worker.api Gradle 屬性

> **Issue**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 kapt（預設：true）。
>
> **Deprecation cycle**:
>
> - 1.6.20: 將棄用級別提升為警告
> - &gt;= 1.8.0: 移除此屬性

### 移除 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **Issue**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性。
>
> **Deprecation cycle**:
>
> - 1.6.20: 將棄用級別提升為警告
> - 1.7.0: 移除此 DSL 選項、其封裝的 `experimental` 區塊和該屬性

### 棄用 useExperimentalAnnotation 編譯器選項

> **Issue**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除隱藏的 `useExperimentalAnnotation()` Gradle 函數，該函數用於選擇在模組中使用 API。可以使用 `optIn()` 函數代替。
>
> **Deprecation cycle:**
>
> - 1.6.0: 隱藏已棄用的選項
> - 1.7.0: 移除棄用的選項

### 棄用 kotlin.compiler.execution.strategy 系統屬性

> **Issue**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 棄用 `kotlin.compiler.execution.strategy` 系統屬性，該屬性用於選擇編譯器執行策略。請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`。
>
> **Deprecation cycle:**
>
> - 1.7.0: 將棄用級別提升為警告
> - &gt; 1.7.0: 移除該屬性

### 移除 kotlinOptions.jdkHome 編譯器選項

> **Issue**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除 `kotlinOptions.jdkHome` 編譯器選項，該選項用於將指定位置的自訂 JDK 包含到類別路徑中，而非預設的 `JAVA_HOME`。請改用 [Java 工具鏈](gradle-configure-project.md#gradle-java-toolchains-support)。
>
> **Deprecation cycle:**
>
> - 1.5.30: 將棄用級別提升為警告
> - &gt; 1.7.0: 移除該選項

### 移除 noStdlib 編譯器選項

> **Issue**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除 `noStdlib` 編譯器選項。Gradle 插件使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在。
>
> **Deprecation cycle:**
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.7.0: 移除該選項

### 移除 kotlin2js 和 kotlin-dce-plugin 插件

> **Issue**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: 移除 `kotlin2js` 和 `kotlin-dce-plugin` 插件。請改用新的 `org.jetbrains.kotlin.js` 插件來替代 `kotlin2js`。當 Kotlin/JS Gradle 插件[配置正確](http://javascript-dce.md)時，死碼消除 (DCE) 將會運作。
>
> **Deprecation cycle:**
>
> - 1.4.0: 將棄用級別提升為警告
> - 1.7.0: 移除這些插件

### 編譯任務中的變更

> **Issue**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **Component**: Gradle
>
> **Incompatible change type**: 原始碼
>
> **Short summary**: Kotlin 編譯任務不再繼承 Gradle 的 `AbstractCompile` 任務，因此 `sourceCompatibility` 和 `targetCompatibility` 輸入在 Kotlin 使用者腳本中不再可用。`SourceTask.stableSources` 輸入不再可用。`sourceFilesExtensions` 輸入已移除。已棄用的 `Gradle destinationDir: File` 輸出已由 `destinationDirectory: DirectoryProperty` 輸出取代。`KotlinCompile` 任務的 `classpath` 屬性已棄用。
>
> **Deprecation cycle:**
>
> - 1.7.0: 輸入不再可用，輸出已被取代，`classpath` 屬性已棄用