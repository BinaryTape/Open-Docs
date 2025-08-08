[//]: # (title: Kotlin 1.7 相容性指南)

_讓語言保持現代 (Keeping the Language Modern)_ 和 _舒適的更新 (Comfortable Updates)_ 是 Kotlin 語言設計的根本原則之一。前者指出應移除阻礙語言演進的結構，後者則表示此類移除應事先充分溝通，以使程式碼遷移盡可能順暢。

儘管大多數語言變更已透過其他管道（例如更新變更日誌或編譯器警告）宣佈，但本文總結了所有這些變更，為從 Kotlin 1.6 遷移到 Kotlin 1.7 提供了完整的參考。

## 基本術語

在本文中，我們引入了幾種相容性：

- _原始碼 (source)_：原始碼不相容變更會阻止過去可以正常編譯（沒有錯誤或警告）的程式碼再次編譯。
- _二進位碼 (binary)_：如果交換兩個二進位碼構件不會導致載入或連結錯誤，則稱它們為二進位碼相容。
- _行為 (behavioral)_：如果同一程式在應用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純粹的 Kotlin。從其他語言角度（例如，從 Java）來看的 Kotlin 程式碼相容性超出本文的範圍。

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

### 使安全呼叫結果始終為可空

> **問題 (Issue)**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.7 將始終把安全呼叫的結果型別視為可空，即使安全呼叫的接收者是不可空的。
>
> **棄用週期 (Deprecation cycle)**:
>
> - <1.3: 對於不可空接收者的不必要安全呼叫報告警告
> - 1.6.20: 額外警告不必要安全呼叫的結果型別將在下一版本中變更
> - 1.7.0: 將安全呼叫結果的型別變更為可空，
>   `-XXLanguage:-SafeCallsAreAlwaysNullable` 可用於暫時恢復到 1.7 之前的行為

### 禁止將 super 呼叫委派給抽象超類別成員

> **問題 (Issues)**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-49017), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 將在顯式或隱式 `super` 呼叫委派給超類別的 _抽象_ 成員時報告編譯錯誤，即使超介面中存在預設實作。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.20: 在使用未覆寫所有抽象成員的非抽象類別時引入警告
> - 1.7.0: 如果 `super` 呼叫實際上存取了超類別中的抽象成員，則報告錯誤
> - 1.7.0: 如果啟用 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則報告錯誤；
>   在漸進模式下報告錯誤
> - >=1.8.0: 在所有情況下報告錯誤

### 禁止透過在非公開主要建構子中宣告的公開屬性暴露非公開型別

> **問題 (Issue)**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 將阻止在私有主要建構子中宣告具有非公開型別的公開屬性。
> 從另一個套件存取此類屬性可能導致 `IllegalAccessError`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.3.20: 對於在非公開建構子中宣告的具有非公開型別的公開屬性報告警告
> - 1.6.20: 在漸進模式下將此警告提升為錯誤
> - 1.7.0: 將此警告提升為錯誤

### 禁止存取以列舉名稱限定的未初始化列舉項目

> **問題 (Issue)**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.7 將禁止在列舉靜態初始化區塊中存取未初始化列舉項目，
> 且這些項目以列舉名稱限定。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.7.0: 當未初始化列舉項目從列舉靜態初始化區塊中存取時報告錯誤

### 禁止在 when 條件分支和迴圈條件中計算複雜布林運算式的常數值

> **問題 (Issue)**: [KT-39883](https://youtrack.com/issue/KT-39883)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 將不再根據除了字面值 `true` 和 `false` 之外的複雜布林運算式做出窮盡性 (exhaustiveness) 和控制流程假設。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.30: 當 `when` 的窮盡性或控制流程可達性是根據 `when` 分支或迴圈條件中的複雜常數布林運算式決定時，報告警告。
> - 1.7.0: 將此警告提升為錯誤。

### 預設情況下，使帶有列舉、密封和布林主體的 when 語句窮盡

> **問題 (Issue)**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.7 將報告關於帶有列舉、密封或布林主體的 `when` 語句非窮盡的錯誤。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.0: 當帶有列舉、密封或布林主體的 `when` 語句非窮盡時引入警告（漸進模式下為錯誤）。
> - 1.7.0: 將此警告提升為錯誤。

### 在帶主體的 when 中棄用混淆語法

> **問題 (Issue)**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.6 棄用了 `when` 條件運算式中的幾個混淆語法結構。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.20: 對受影響的運算式引入棄用警告
> - 1.8.0: 將此警告提升為錯誤
> - >= 1.8: 將一些棄用結構重新用於新的語言功能

### 型別可空性增強改進

> **問題 (Issue)**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.7 將變更其載入和解釋 Java 程式碼中型別可空性註解的方式。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.30: 對於更精確的型別可空性可能導致錯誤的情況引入警告
> - 1.7.0: 推斷更精確的 Java 型別可空性，
>   `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 可用於暫時恢復到 1.7 之前的行為

### 防止不同數字型別之間的隱式強制轉型

> **問題 (Issue)**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更型別 (Incompatible change type)**: 行為 (behavioral)
>
> **簡要概述 (Short summary)**: Kotlin 將避免自動將數字值轉換為基本數字型別，在語義上僅需要向下轉型為該型別的情況。
>
> **棄用週期 (Deprecation cycle)**:
>
> - < 1.5.30: 在所有受影響的情況下都是舊行為
> - 1.5.30: 修正生成的屬性委託存取器中的向下轉型行為，
>   `-Xuse-old-backend` 可用於暫時恢復到 1.5.30 之前的修正行為
> - >= 1.7.20: 修正其他受影響情況下的向下轉型行為

### 棄用編譯器選項 -Xjvm-default 的啟用和相容模式

> **問題 (Issue)**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **元件 (Component)**: Kotlin/JVM
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.6.20 警告使用 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.20: 對於 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告
> - >= 1.8.0: 將此警告提升為錯誤

### 禁止呼叫帶有 trailing lambda 的 `suspend` 函數

> **問題 (Issue)**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.6 不再允許呼叫名為 `suspend` 且單一參數為函數型別並作為 trailing lambda 傳遞的使用者函數。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.3.0: 對此類函數呼叫引入警告
> - 1.6.0: 將此警告提升為錯誤
> - 1.7.0: 引入語言語法變更，使 `{` 之前的 `suspend` 被解析為關鍵字

### 禁止對基類屬性進行智能轉型，如果基類來自另一個模組

> **問題 (Issue)**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.7 將不再允許對父類別的屬性進行智能轉型，
> 如果該類別位於另一個模組中。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.0: 對於在另一個模組中的父類別中宣告的屬性進行智能轉型時報告警告
> - 1.7.0: 將此警告提升為錯誤，
>   `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 可用於暫時恢復到 1.7 之前的行為

### 型別推斷時不要忽略有意義的約束

> **問題 (Issue)**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **元件 (Component)**: 核心語言 (Core language)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 1.4−1.6 由於不正確的優化，在型別推斷期間忽略了一些型別約束。
> 這可能導致撰寫不健全的程式碼，在執行時導致 `ClassCastException`。
> Kotlin 1.7 將這些約束納入考量，從而禁止不健全的程式碼。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.20: 對於如果考慮所有型別推斷約束將發生型別不匹配的表達式報告警告
> - 1.7.0: 考慮所有約束，從而將此警告提升為錯誤，
>   `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 可用於暫時恢復到 1.7 之前的行為

## 標準函式庫

### 逐步將集合的 min 和 max 函數的回傳型別改為不可空

> **問題 (Issue)**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **元件 (Component)**: kotlin-stdlib
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 集合 `min` 和 `max` 函數的回傳型別將在 Kotlin 1.7 中變更為不可空。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.0: 引入 `...OrNull` 函數作為同義詞並棄用受影響的 API（詳情請參閱問題）
> - 1.5.0: 將受影響 API 的棄用級別提升為錯誤
> - 1.6.0: 將棄用函數從公共 API 中隱藏
> - 1.7.0: 重新引入受影響的 API 但回傳型別為不可空

### 棄用浮點數陣列函數：contains, indexOf, lastIndexOf

> **問題 (Issue)**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **元件 (Component)**: kotlin-stdlib
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 棄用了浮點數陣列函數 `contains`、`indexOf`、`lastIndexOf`，這些函數使用 IEEE-754 順序而非全序比較值。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.0: 帶有警告地棄用受影響的函數
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.7.0: 將棄用函數從公共 API 中隱藏

### 將 `kotlin.dom` 和 `kotlin.browser` 套件中的宣告遷移到 `kotlinx.*`

> **問題 (Issue)**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **元件 (Component)**: kotlin-stdlib (JS)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: `kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至對應的 `kotlinx.*` 套件，以準備將其從標準函式庫中提取。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替換 API
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API 並提出上述新 API 作為替換
> - 1.6.0: 將棄用級別提升為錯誤
> - >= 1.8: 從標準函式庫中移除棄用函數
> - >= 1.8: 將 `kotlinx.*` 套件中的 API 移至獨立函式庫

### 棄用部分僅限 JS 的 API

> **問題 (Issue)**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **元件 (Component)**: kotlin-stdlib (JS)
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 標準函式庫中一些僅限 JS 的函數已被棄用以供移除。它們包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及接受比較函數的陣列 `sort` 函數，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.0: 帶有警告地棄用受影響的函數
> - 1.8.0: 將棄用級別提升為錯誤
> - 1.9.0: 從公共 API 中移除棄用函數

## 工具

### 移除 `KotlinGradleSubplugin` 類別

> **問題 (Issue)**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除 `KotlinGradleSubplugin` 類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.0: 將棄用級別提升為錯誤
> - 1.7.0: 移除棄用類別

### 移除 `useIR` 編譯器選項

> **問題 (Issue)**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除已棄用且隱藏的 `useIR` 編譯器選項。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.6.0: 隱藏此選項
> - 1.7.0: 移除棄用選項

### 棄用 `kapt.use.worker.api` Gradle 屬性

> **問題 (Issue)**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 kapt（預設值：`true`）。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.20: 將棄用級別提升為警告
> - >= 1.8.0: 移除此屬性

### 移除 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` Gradle 屬性

> **問題 (Issue)**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.20: 將棄用級別提升為警告
> - 1.7.0: 移除 DSL 選項、其包含的 `experimental` 區塊和屬性

### 棄用 `useExperimentalAnnotation` 編譯器選項

> **問題 (Issue)**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除用於選擇在模組中使用 API 的隱藏 `useExperimentalAnnotation()` Gradle 函數。
> 可以改用 `optIn()` 函數。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.6.0: 隱藏棄用選項
> - 1.7.0: 移除棄用選項

### 棄用 `kotlin.compiler.execution.strategy` 系統屬性

> **問題 (Issue)**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 棄用用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。
> 請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.7.0: 將棄用級別提升為警告
> - > 1.7.0: 移除此屬性

### 移除 `kotlinOptions.jdkHome` 編譯器選項

> **問題 (Issue)**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除 `kotlinOptions.jdkHome` 編譯器選項，該選項用於將指定位置的自訂 JDK 包含到類別路徑中，而非預設的 `JAVA_HOME`。
> 請改用 [Java 工具鏈](gradle-configure-project.md#gradle-java-toolchains-support)。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.30: 將棄用級別提升為警告
> - > 1.7.0: 移除此選項

### 移除 `noStdlib` 編譯器選項

> **問題 (Issue)**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除 `noStdlib` 編譯器選項。Gradle 外掛使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.5.0: 將棄用級別提升為警告
> - 1.7.0: 移除此選項

### 移除 `kotlin2js` 和 `kotlin-dce-plugin` 外掛

> **問題 (Issue)**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: 移除 `kotlin2js` 和 `kotlin-dce-plugin` 外掛。請改用新的 `org.jetbrains.kotlin.js` 外掛。
> 當 Kotlin/JS Gradle 外掛配置正確時，死程式碼消除 (DCE) 將會運作。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.4.0: 將棄用級別提升為警告
> - 1.7.0: 移除外掛

### 編譯任務的變更

> **問題 (Issue)**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **元件 (Component)**: Gradle
>
> **不相容變更型別 (Incompatible change type)**: 原始碼 (source)
>
> **簡要概述 (Short summary)**: Kotlin 編譯任務不再繼承 Gradle `AbstractCompile` 任務，因此 `sourceCompatibility` 和 `targetCompatibility` 輸入在 Kotlin 使用者的腳本中不再可用。
> `SourceTask.stableSources` 輸入不再可用。`sourceFilesExtensions` 輸入已移除。
> 已棄用的 `Gradle destinationDir: File` 輸出已替換為 `destinationDirectory: DirectoryProperty` 輸出。
> `KotlinCompile` 任務的 `classpath` 屬性已棄用。
>
> **棄用週期 (Deprecation cycle)**:
>
> - 1.7.0: 輸入不可用，輸出已替換，`classpath` 屬性已棄用