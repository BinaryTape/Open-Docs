[//]: # (title: Kotlin 1.7.0 相容性指南)

「[保持語言的現代化](kotlin-evolution-principles.md)」與「[舒適的更新](kotlin-evolution-principles.md)」是 Kotlin 語言設計的基本原則。前者指出應移除阻礙語言演進的結構，後者則要求在移除前應進行充分的溝通，以使程式碼遷移儘可能平滑。

雖然大多數語言變更已透過其他管道宣布（如更新日誌或編譯器警告），本文件彙總了所有變更，為從 Kotlin 1.6 遷移到 Kotlin 1.7 提供完整的參考。

## 基本術語

在本文件中，我們介紹了幾種相容性：

- _原始碼 (source)_：原始碼不相容變更會導致原本可以正常編譯（沒有錯誤或警告）的程式碼無法再編譯。
- _二進制 (binary)_：如果交換兩個二進制產物不會導致載入或連結錯誤，則稱它們為二進制相容。
- _行為 (behavioral)_：如果同一程式在套用變更前後表現出不同的行為，則稱該變更為行為不相容。

請記住，這些定義僅適用於純 Kotlin。從其他語言角度（例如 Java）看 Kotlin 程式碼的相容性不在本文件的討論範圍內。

## 語言

<!--
### 標題

> **問題**: [KT-NNNNN](https://youtrack.jetbrains.com/issue/KT-NNNNN)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**:
>
> **棄用週期**:
>
> - 1.5.20: 警告
> - 1.7.0: 回報錯誤
-->

### 將安全呼叫結果始終視為可為 null

> **問題**: [KT-46860](https://youtrack.jetbrains.com/issue/KT-46860)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.7 將安全呼叫結果的型別始終視為可為 null，即使安全呼叫的接收者是非 null。
>
> **棄用週期**:
>
> - &lt;1.3: 對非 null 接收者上不必要的安全呼叫回報警告。
> - 1.6.20: 額外警告不必要的安全呼叫結果將在下一個版本中變更其型別。
> - 1.7.0: 將安全呼叫結果的型別變更為可為 null。  
> 可以使用 `-XXLanguage:-SafeCallsAreAlwaysNullable` 暫時恢復到 1.7 之前的行為。

### 禁止將 super 呼叫委派給抽象超類別成員

> **問題**: [KT-45508](https://youtrack.jetbrains.com/issue/KT-45508), [KT-49017](https://youtrack.jetbrains.com/issue/KT-49017), [KT-38078](https://youtrack.jetbrains.com/issue/KT-38078)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
> 
> **簡短摘要**: 當顯式或隱式 super 呼叫委派給超類別的「抽象 (abstract)」成員時，即使超介面中有預設實作，Kotlin 也會回報編譯錯誤。
>
> **棄用週期**:
>
> - 1.5.20: 當使用未覆寫所有抽象成員的非抽象類別時，引入警告。
> - 1.7.0: 如果 super 呼叫實際上存取了來自超類別的抽象成員，則回報錯誤。
> - 1.7.0: 如果啟用了 `-Xjvm-default=all` 或 `-Xjvm-default=all-compatibility` 相容模式，則回報錯誤；在漸進模式 (progressive mode) 下回報錯誤。
> - &gt;=1.8.0: 在所有情況下均回報錯誤。

### 禁止透過在非公開主建構函式中宣告的公開屬性公開非公開型別

> **問題**: [KT-28078](https://youtrack.jetbrains.com/issue/KT-28078)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 將禁止在私有主建構函式中宣告具有非公開型別的公開屬性。從另一個套件存取此類屬性可能會導致 `IllegalAccessError`。
>
> **棄用週期**:
>
> - 1.3.20: 對在非公開建構函式中宣告且具有非公開型別的公開屬性回報警告。
> - 1.6.20: 在漸進模式下將此警告提升為錯誤。
> - 1.7.0: 將此警告提升為錯誤。

### 禁止存取以列舉名稱限定的未初始化列舉項目

> **問題**: [KT-41124](https://youtrack.jetbrains.com/issue/KT-41124)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.7 將禁止在列舉靜態初始化區塊中存取未初始化的列舉項目（當這些項目是以列舉名稱限定時）。
>
> **棄用週期**:
>
> - 1.7.0: 當從列舉靜態初始化區塊存取未初始化的列舉項目時回報錯誤。

### 禁止在 when 條件分支和迴圈條件中計算複雜布林運算式的常數值

> **問題**: [KT-39883](https://youtrack.jetbrains.com/issue/KT-39883)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 將不再根據字面值 `true` 和 `false` 以外的常數布林運算式進行窮舉性和控制流假設。
>
> **棄用週期**:
>
> - 1.5.30: 當根據 `when` 分支或迴圈條件中的複雜常數布林運算式判斷 `when` 的窮舉性或控制流可達性時，回報警告。
> - 1.7.0: 將此警告提升為錯誤。

### 讓以列舉、密封類別及布林為對象的 when 陳述式預設為窮舉性

> **問題**: [KT-47709](https://youtrack.jetbrains.com/issue/KT-47709)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.7 將對以列舉、密封類別或布林為對象且非窮舉性的 `when` 陳述式回報錯誤。
>
> **棄用週期**:
>
> - 1.6.0: 當以列舉、密封類別或布林為對象的 `when` 陳述式非窮舉時引入警告（在漸進模式下為錯誤）。
> - 1.7.0: 將此警告提升為錯誤。

### 棄用 when-with-subject 中令人困惑的語法

> **問題**: [KT-48385](https://youtrack.jetbrains.com/issue/KT-48385)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.6 棄用了 `when` 條件運算式中幾種令人困惑的語法結構。
>
> **棄用週期**:
>
> - 1.6.20: 對受影響的運算式引入棄用警告。
> - 1.8.0: 將此警告提升為錯誤。
> - &gt;= 1.8: 將某些棄用的結構重新用於新的語言特性。

### 型別可 null 性增強改進

> **問題**: [KT-48623](https://youtrack.jetbrains.com/issue/KT-48623)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.7 將變更其載入和解釋 Java 程式碼中型別可 null 性註解的方式。
>
> **棄用週期**:
>
> - 1.4.30: 針對更精確的型別可 null 性可能導致錯誤的情況引入警告。
> - 1.7.0: 推論出更精確的 Java 型別可 null 性。  
> 可以使用 `-XXLanguage:-TypeEnhancementImprovementsInStrictMode` 暫時恢復到 1.7 之前的行為。

### 防止不同數值型別之間的隱式強制轉換

> **問題**: [KT-48645](https://youtrack.jetbrains.com/issue/KT-48645)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 行為
>
> **簡短摘要**: Kotlin 將避免在語義上僅需要向下轉換 (downcast) 為該型別的地方，自動將數值轉換為原始數值型別。
>
> **棄用週期**:
>
> - < 1.5.30: 所有受影響案例中的舊行為。
> - 1.5.30: 修正產生的屬性委派存取子中的向下轉換行為。  
> 可以使用 `-Xuse-old-backend` 暫時恢復到 1.5.30 修正之前的行為。
> - &gt;= 1.7.20: 修正其他受影響案例中的向下轉換行為。

### 棄用編譯器選項 -Xjvm-default 的 enable 和 compatibility 模式

> **問題**: [KT-46329](https://youtrack.jetbrains.com/issue/KT-46329)
>
> **組件**: Kotlin/JVM
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.6.20 針對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式的使用發出警告。
>
> **棄用週期**:
>
> - 1.6.20: 對 `-Xjvm-default` 編譯器選項的 `enable` 和 `compatibility` 模式引入警告。
> - &gt;= 1.8.0: 將此警告提升為錯誤。

### 禁止呼叫名為 suspend 且帶有尾隨 Lambda 的函式

> **問題**: [KT-22562](https://youtrack.jetbrains.com/issue/KT-22562)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 1.6 不再允許呼叫名為 `suspend` 且將單個函式型別參數作為尾隨 Lambda 傳遞的使用者定義函式。
>
> **棄用週期**:
>
> - 1.3.0: 對此類函式呼叫引入警告。
> - 1.6.0: 將此警告提升為錯誤。
> - 1.7.0: 對語言語法進行更改，使 `{` 之前的 `suspend` 被解析為關鍵字。

### 如果基底類別來自另一個模組，則禁止對該基底類別屬性進行智慧轉換

> **問題**: [KT-52629](https://youtrack.jetbrains.com/issue/KT-52629)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 如果某個類別位於另一個模組中，Kotlin 1.7 將不再允許對該超類別的屬性進行智慧轉換 (Smart cast)。
>
> **棄用週期**:
>
> - 1.6.0: 對宣告在另一個模組超類別中的屬性進行智慧轉換時回報警告。
> - 1.7.0: 將此警告提升為錯誤。  
> 可以使用 `-XXLanguage:-ProhibitSmartcastsOnPropertyFromAlienBaseClass` 暫時恢復到 1.7 之前的行為。

### 在型別推論期間不忽視有意義的約束

> **問題**: [KT-52668](https://youtrack.jetbrains.com/issue/KT-52668)
>
> **組件**: 核心語言
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 由於錯誤的優化，Kotlin 1.4−1.6 在型別推論期間忽視了一些型別約束。這可能允許編寫不健全的程式碼，從而在執行時導致 `ClassCastException`。Kotlin 1.7 會考慮這些約束，從而禁止不健全的程式碼。
>
> **棄用週期**:
>
> - 1.5.20: 如果考慮所有型別推論約束會發生型別不符，則在該運算式上回報警告。
> - 1.7.0: 考慮所有約束，從而將此警告提升為錯誤。  
> 可以使用 `-XXLanguage:-ProperTypeInferenceConstraintsProcessing` 暫時恢復到 1.7 之前的行為。

## 標準函式庫

### 逐步將集合 min 和 max 函式的傳回型別變更為非 null

> **問題**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 集合的 `min` 和 `max` 函式的傳回型別將在 Kotlin 1.7 中變更為非 null。
>
> **棄用週期**:
>
> - 1.4.0: 引入 `...OrNull` 函式作為同義詞，並棄用受影響的 API（詳見問題說明）。
> - 1.5.0: 將受影響 API 的棄用層級提升為錯誤。
> - 1.6.0: 從公開 API 中隱藏棄用的函式。
> - 1.7.0: 重新引入受影響的 API，但傳回型別為非 null。

### 棄用浮點數陣列函式：contains, indexOf, lastIndexOf

> **問題**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **組件**: kotlin-stdlib
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 棄用了浮點數陣列函式 `contains`、`indexOf`、`lastIndexOf`，因為這些函式使用 IEEE-754 順序而非全序 (total order) 來比較值。
>
> **棄用週期**:
>
> - 1.4.0: 帶警告地棄用受影響的函式。
> - 1.6.0: 將棄用層級提升為錯誤。
> - 1.7.0: 從公開 API 中隱藏棄用的函式。

### 將宣告從 kotlin.dom 和 kotlin.browser 套件遷移到 kotlinx.*

> **問題**: [KT-39330](https://youtrack.jetbrains.com/issue/KT-39330)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 為了準備將其從 stdlib 中提取出來，`kotlin.dom` 和 `kotlin.browser` 套件中的宣告已移至對應的 `kotlinx.*` 套件。
>
> **棄用週期**:
>
> - 1.4.0: 在 `kotlinx.dom` 和 `kotlinx.browser` 套件中引入替代 API。
> - 1.4.0: 棄用 `kotlin.dom` 和 `kotlin.browser` 套件中的 API，並建議使用上述新 API 作為替代。
> - 1.6.0: 將棄用層級提升為錯誤。
> - &gt;= 1.8: 從 stdlib 中移除棄用的函式。
> - &gt;= 1.8: 將 kotlinx.* 套件中的 API 移至獨立的程式庫。

### 棄用某些僅限 JS 的 API

> **問題**: [KT-48587](https://youtrack.jetbrains.com/issue/KT-48587)
>
> **組件**: kotlin-stdlib (JS)
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: stdlib 中許多僅限 JS 的函式已被棄用並準備移除。包括：`String.concat(String)`、`String.match(regex: String)`、`String.matches(regex: String)`，以及陣列上接收比較函式的 `sort` 函式，例如 `Array<out T>.sort(comparison: (a: T, b: T) -> Int)`。
>
> **棄用週期**:
>
> - 1.6.0: 帶警告地棄用受影響的函式。
> - 1.8.0: 將棄用層級提升為錯誤。
> - 1.9.0: 從公開 API 中移除棄用的函式。

## 工具

### 移除 KotlinGradleSubplugin 類別

> **問題**: [KT-48831](https://youtrack.jetbrains.com/issue/KT-48831)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除 `KotlinGradleSubplugin` 類別。請改用 `KotlinCompilerPluginSupportPlugin` 類別。
>
> **棄用週期**:
>
> - 1.6.0: 將棄用層級提升為錯誤。
> - 1.7.0: 移除棄用的類別。

### 移除 useIR 編譯器選項

> **問題**: [KT-48847](https://youtrack.jetbrains.com/issue/KT-48847)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除已棄用且隱藏的 `useIR` 編譯器選項。
>
> **棄用週期**:
>
> - 1.5.0: 將棄用層級提升為警告。
> - 1.6.0: 隱藏該選項。
> - 1.7.0: 移除棄用的選項。

### 棄用 kapt.use.worker.api Gradle 屬性

> **問題**: [KT-48826](https://youtrack.jetbrains.com/issue/KT-48826)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 棄用 `kapt.use.worker.api` 屬性，該屬性允許透過 Gradle Workers API 執行 kapt（預設值為 true）。
>
> **棄用週期**:
>
> - 1.6.20: 將棄用層級提升為警告。
> - &gt;= 1.8.0: 移除此屬性。

### 移除 kotlin.experimental.coroutines Gradle DSL 選項和 kotlin.coroutines Gradle 屬性

> **問題**: [KT-50494](https://youtrack.jetbrains.com/issue/KT-50494)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除 `kotlin.experimental.coroutines` Gradle DSL 選項和 `kotlin.coroutines` 屬性。
>
> **棄用週期**:
>
> - 1.6.20: 將棄用層級提升為警告。
> - 1.7.0: 移除 DSL 選項、其所屬的 `experimental` 區塊以及該屬性。

### 棄用 useExperimentalAnnotation 編譯器選項

> **問題**: [KT-47763](https://youtrack.jetbrains.com/issue/KT-47763)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除用於在模組中啟用某個 API 的隱藏 `useExperimentalAnnotation()` Gradle 函式。可以使用 `optIn()` 函式替代。
> 
> **棄用週期:**
> 
> - 1.6.0: 隱藏棄用選項。
> - 1.7.0: 移除棄用的選項。

### 棄用 kotlin.compiler.execution.strategy 系統屬性

> **問題**: [KT-51830](https://youtrack.jetbrains.com/issue/KT-51830)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 棄用用於選擇編譯器執行策略的 `kotlin.compiler.execution.strategy` 系統屬性。請改用 Gradle 屬性 `kotlin.compiler.execution.strategy` 或編譯任務屬性 `compilerExecutionStrategy`。
>
> **棄用週期:**
>
> - 1.7.0: 將棄用層級提升為警告。
> - &gt; 1.7.0: 移除該屬性。

### 移除 kotlinOptions.jdkHome 編譯器選項

> **問題**: [KT-46541](https://youtrack.jetbrains.com/issue/KT-46541)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除用於將指定位置的自訂 JDK（而非預設 `JAVA_HOME`）包含進 classpath 的 `kotlinOptions.jdkHome` 編譯器選項。請改用 [Java toolchains](gradle-configure-project.md#gradle-java-toolchains-support)。
>
> **棄用週期:**
>
> - 1.5.30: 將棄用層級提升為警告。
> - &gt; 1.7.0: 移除該選項。

### 移除 noStdlib 編譯器選項

> **問題**: [KT-49011](https://youtrack.jetbrains.com/issue/KT-49011)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除 `noStdlib` 編譯器選項。Gradle 外掛程式使用 `kotlin.stdlib.default.dependency=true` 屬性來控制 Kotlin 標準函式庫是否存在。
>
> **棄用週期:**
>
> - 1.5.0: 將棄用層級提升為警告。
> - 1.7.0: 移除該選項。

### 移除 kotlin2js 和 kotlin-dce-plugin 外掛程式

> **問題**: [KT-48276](https://youtrack.jetbrains.com/issue/KT-48276)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: 移除 `kotlin2js` 和 `kotlin-dce-plugin` 外掛程式。請使用新的 `org.jetbrains.kotlin.js` 外掛程式替代 `kotlin2js`。當 Kotlin/JS Gradle 外掛程式配置正確時，無效程式碼偵測 (DCE) 即可運作。
>
> **棄用週期:**
>
> - 1.4.0: 將棄用層級提升為警告。
> - 1.7.0: 移除這些外掛程式。

### 編譯任務的變更

> **問題**: [KT-32805](https://youtrack.jetbrains.com/issue/KT-32805)
>
> **組件**: Gradle
>
> **不相容變更類型**: 原始碼
>
> **簡短摘要**: Kotlin 編譯任務不再繼承 Gradle 的 `AbstractCompile` 任務，因此 `sourceCompatibility` 和 `targetCompatibility` 輸入在 Kotlin 使用者的指令碼中不再可用。`SourceTask.stableSources` 輸入不再可用。`sourceFilesExtensions` 輸入已移除。棄用的 `Gradle destinationDir: File` 輸出已替換為 `destinationDirectory: DirectoryProperty` 輸出。`KotlinCompile` 任務的 `classpath` 屬性已棄用。
>
> **棄用週期:**
>
> - 1.7.0: 輸入不可用、輸出被替換、`classpath` 屬性被棄用。