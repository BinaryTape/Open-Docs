[//]: # (title: Kotlin 2.3.0 的新功能)

_[發佈日期：2025 年 12 月 16 日](releases.md#release-details)_

Kotlin 2.3.0 版本已發佈！以下是主要亮點：

*   **語言**: [更穩定的預設功能、未使用的傳回值檢查器、明確的幕後欄位，以及對情境感知解析度的變更](#language)。
*   **Kotlin/JVM**: [支援 Java 25](#kotlin-jvm-support-for-java-25)。
*   **Kotlin/Native**: [透過 Swift 匯出改進互通性、更快的發佈任務建置時間、C 和 Objective-C 函式庫匯入處於 Beta 階段](#kotlin-native)。
*   **Kotlin/Wasm**: [預設啟用完整限定名稱和新的例外處理提案，以及針對 Latin-1 字元的新緊湊儲存方式](#kotlin-wasm)。
*   **Kotlin/JS**: [新的實驗性 suspend 函式匯出、`LongArray` 表示、統一的伴生物件存取，以及更多功能](#kotlin-js)。
*   **Gradle**: [與 Gradle 9.0 的相容性，以及用於註冊產生來源的新 API](#gradle)。
*   **Compose compiler**: [用於縮減版 Android 應用程式的堆疊追蹤](#compose-compiler-stack-traces-for-minified-android-applications)。
*   **標準函式庫**: [穩定的時間追蹤功能，以及改進的 UUID 產生和解析](#standard-library)。

## IDE 支援

支援 2.3.0 的 Kotlin 外掛程式已捆綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 外掛程式。
您只需在建置指令碼中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version)變更為 2.3.0 即可。

有關詳細資訊，請參閱 [更新至新版本](releases.md#update-to-a-new-kotlin-version)。

## 語言

Kotlin 2.3.0 專注於功能穩定化，引入了一種新的機制來偵測未使用的傳回值，並改進了情境感知解析度。

### 穩定功能

在之前的 Kotlin 版本中，一些新的語言功能以 Experimental 和 Beta 狀態引入。
以下功能已在 Kotlin 2.3.0 中升級為 [穩定版](components-stability.md#stability-levels-explained)：

*   [支援巢狀型別別名](whatsnew22.md#support-for-nested-type-aliases)
*   [基於資料流的 `when` 運算式窮舉檢查](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)

### 預設啟用功能

在 Kotlin 2.3.0 中，[`return` 陳述式在具有明確傳回型別的運算式主體中](whatsnew2220.md#support-for-return-statements-in-expression-bodies-with-explicit-return-types)的支援現已預設啟用。

[查看 Kotlin 語言功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

### 未使用的傳回值檢查器
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 引入了未使用的傳回值檢查器，以幫助防止結果被忽略。
每當運算式傳回 `Unit` 或 `Nothing` 以外的值，且未傳遞給函式、未在條件中檢查或未以其他方式使用時，它會發出警告。

此檢查器有助於捕捉函式呼叫產生有意義結果卻被靜默丟棄的錯誤，這可能導致意外行為或難以追蹤的問題。

> 檢查器會忽略增量操作（例如 `++` 和 `--`）傳回的值。
>
{style="note"}

請考慮以下範例：

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 檢查器會報告此結果被忽略的警告
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

在此範例中，建立了一個字串但從未使用，因此檢查器將其報告為被忽略的結果。

此功能為 [實驗性](components-stability.md#stability-levels-explained)。
若要選擇啟用，請將以下編譯器選項新增至您的建置檔案中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-checker=check</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

使用此選項，檢查器僅報告來自已標記運算式（例如 Kotlin 標準函式庫中的大多數函式）的被忽略結果。

若要標記您的函式，請使用 `@MustUseReturnValues` 註解來標記您希望檢查器報告被忽略傳回值的範圍。

例如，您可以標記整個檔案：

```kotlin
// 標記此檔案中的所有函式和類別，以便檢查器報告未使用的傳回值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或者，您可以標記特定的類別：

```kotlin
// 標記此類別中的所有函式，以便檢查器報告未使用的傳回值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

您也可以透過將以下編譯器選項新增至您的建置檔案來標記整個專案：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xreturn-value-value-checker=full</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

透過此設定，Kotlin 會自動將您編譯的檔案視為已使用 `@MustUseReturnValues` 註解，並且檢查器會報告您專案函式的所有傳回值。

您可以透過使用 `@IgnorableReturnValue` 註解來標記特定函式以抑制警告。
請註解那些忽略傳回值是常見且預期的函式，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

您可以在不將函式本身標記為可忽略的情況下抑制警告。
若要執行此操作，請將結果指派給一個帶有底線 (`_`) 的特殊未命名變數：

```kotlin
// 不可忽略的函式
fun computeValue(): Int = 42

fun main() {
    // 報告警告：結果被忽略
    computeValue()

    // 僅在此呼叫站點使用特殊未使用的變數來抑制警告
    val _ = computeValue()
}
```
{kotlin-runnable="true"}

有關詳細資訊，請參閱此功能的 [KEEP]( https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供回饋意見。

### 明確的幕後欄位
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 引入了明確的幕後欄位 — 一種新的語法，用於明確宣告儲存屬性值的底層欄位，這與現有的隱式幕後欄位形成對比。

新的明確語法簡化了常見的幕後屬性模式，其中屬性的內部型別與其公開的 API 型別不同。
例如，您可能會使用 `ArrayList`，同時將其公開為唯讀的 `List` 或 `MutableList`。
以前，這需要額外的私有屬性。

透過明確的幕後欄位，`field` 的實作型別直接定義在屬性的範圍內。
這消除了對單獨私有屬性的需求，並允許編譯器在相同的私有範圍內自動對幕後欄位的型別執行智慧轉型（smart casting）。

之前：

```kotlin
private val _city = MutableStateFlow<String>("")
val city: StateFlow<String> get() = _city

fun updateCity(newCity: String) {
    _city.value = newCity
}
```

之後：

```kotlin
val city: StateFlow<String>
    field = MutableStateFlow("")

fun updateCity(newCity: String) {
    // 智慧轉型自動生效
    city.value = newCity
}
```

此功能為 [實驗性](components-stability.md#stability-levels-explained)。
若要選擇啟用，請將以下編譯器選項新增至您的建置檔案中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xexplicit-backing-fields")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xexplicit-backing-fields</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

有關詳細資訊，請參閱此功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields/proposals/explicit-backing-fields.md)。

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-14663) 中提供回饋意見。

### 情境感知解析度的變更
<primary-label ref="experimental-general"/>

情境感知解析度仍處於 [實驗性](components-stability.md#stability-levels-explained) 階段，但我們正在根據使用者回饋持續改進此功能：

*   目前型別的密封（sealed）和封閉（enclosing）超型別現在被視為搜尋的情境範圍的一部分。
    不考慮其他超型別範圍。請參閱 [KT-77823](https://youtrack.jetbrains.com/issue/KT-77823) YouTrack 問題以了解動機和範例。
*   當涉及型別運算子和相等性時，如果使用情境感知解析度導致解析模糊，編譯器現在會報告警告。
    例如，當匯入類別的衝突宣告時，可能會發生這種情況。
    請參閱 [KT-77821](https://youtrack.jetbrains.com/issue/KT-77821) YouTrack 問題以了解動機和範例。

請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中當前提案的全文。

## Kotlin/JVM：支援 Java 25

從 Kotlin 2.3.0 開始，編譯器可以產生包含 Java 25 位元碼的類別。

## Kotlin/Native

Kotlin 2.3.0 引入了對 Swift 匯出支援和 C 與 Objective-C 函式庫匯入的改進，以及發佈任務的建置時間優化。

### 透過 Swift 匯出改進互通性
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 透過 Swift 匯出進一步改進了 Kotlin 與 Swift 的互通性，增加了對原生列舉類別和可變參數函式（variadic function）的支援。

以前，Kotlin 列舉會匯出為普通的 Swift 類別。現在映射是直接的，您可以直接使用常規的原生 Swift 列舉。例如：

```kotlin
// Kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}

val color = Color.RED
```

```Swift
// Swift
public enum Color: Swift.CaseIterable, Swift.LosslessStringConvertible, Swift.RawRepresentable {
    case RED, GREEN, BLUE

    var rgb: Int { get }
}
```

此外，Kotlin 的 [`vararg`](functions.md#variable-number-of-arguments-varargs) 函式現在直接映射到 Swift 的可變參數函式（variadic function parameters）。

這類函式允許您傳遞可變數量的引數。這在您不提前知道引數數量或想要建立或傳遞集合而無需指定其型別時非常有用。例如：

```kotlin
// Kotlin
fun log(vararg messages: String)
```

```Swift
// Swift
public func log(messages: Swift.String...)
```

> 可變參數函式中的泛型型別尚未支援。
>
{style="note"}

### C 和 Objective-C 函式庫匯入處於 Beta 階段
<primary-label ref="beta"/>

[將 C](native-c-interop.md) 和 [Objective-C](native-objc-interop.md) 函式庫匯入 Kotlin/Native 專案的支援處於 [Beta](components-stability.md#stability-levels-explained) 階段。

與不同版本的 Kotlin、依賴項和 Xcode 的完全相容性仍未保證，但編譯器現在在發生二進位相容性問題時會發出更好的診斷資訊。

匯入功能尚未穩定，在使用 C 和 Objective-C 函式庫處理某些與 C 和 Objective-C 互通性相關的事項時，您的專案仍需 `@ExperimentalForeignApi` 選擇啟用註解，包括：

*   `kotlinx.cinterop.*` 套件中的一些 API，在使用原生函式庫或記憶體時需要。
*   原生函式庫中的所有宣告，除了 [平台函式庫](native-platform-libs.md)。

為了相容性並避免您需要更改原始碼，新的穩定性狀態並未反映在註解名稱中。

有關詳細資訊，請參閱 [C 和 Objective-C 函式庫匯入的穩定性](native-lib-import-stability.md)。

### Objective-C 標頭中區塊型別的預設明確名稱

Kotlin 函式型別中的明確參數名稱（[在 Kotlin 2.2.20 中引入](whatsnew2220.md#explicit-names-in-block-types-for-objective-c-headers)）現在已成為從 Kotlin/Native 專案匯出的 Objective-C 標頭的預設設定。
這些參數名稱改進了 Xcode 中的自動完成建議，並有助於避免 Clang 警告。

請考慮以下 Kotlin 程式碼：

```kotlin
// Kotlin:
fun greetUser(block: (name: String) -> Unit) = block("John")
```

Kotlin 將參數名稱從 Kotlin 函式型別轉發到 Objective-C 區塊型別，允許 Xcode 在建議中使用它們：

```ObjC
// Objective-C:
greetUserBlock:^(NSString *name) {
    // ...
};
```

如果您遇到問題，可以停用明確參數名稱。
若要執行此操作，請將以下 [二進位選項](native-binary-options.md) 新增至您的 `gradle.properties` 檔案中：

```none
kotlin.native.binary.objcExportBlockExplicitParameterNames=false
```

請在 [YouTrack](https://kotl.in/issue) 中報告任何問題。

### 加速發佈任務的建置時間

Kotlin/Native 在 2.3.0 中獲得了多項效能改進。這些改進使得 `linkRelease*` 等發佈任務（例如 `linkReleaseFrameworkIosArm64`）的建置時間更快。

根據我們的基準測試，發佈版本可以快上 40%，具體取決於專案大小。這些改進在針對 iOS 的 Kotlin Multiplatform 專案中最為顯著。

有關改進專案編譯時間的更多提示，請參閱[文件](native-improving-compilation-time.md)。

### Apple 目標支援的變更

Kotlin 2.3.0 提高了 Apple 目標的最低支援版本：

*   對於 iOS 和 tvOS，從 12.0 提高到 14.0。
*   對於 watchOS，從 5.0 提高到 7.0。

根據公開資料，舊版本的用量已經非常有限。此變更簡化了我們對 Apple 目標的整體維護，並為在 Kotlin/Native 中支援 [Mac Catalyst](https://developer.apple.com/documentation/uikit/mac-catalyst) 提供了機會。

如果您的專案必須保留舊版本，請將以下行新增至您的建置檔案中：

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
        binaries.configureEach {
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.ios=12.0"
            freeCompilerArgs += "-Xoverride-konan-properties=minVersion.tvos=12.0"
        }
    }
}
```

請注意，此類設定不保證能成功編譯，並可能在建置或執行時破壞您的應用程式。

此版本也推進了 [基於 Intel 晶片的 Apple 目標的淘汰週期](whatsnew2220.md#deprecation-of-x86-64-apple-targets) 的下一步。

從 Kotlin 2.3.0 開始，`macosX64`、`iosX64`、`tvosX64` 和 `watchosX64` 目標被降級為支援層級 3。
這表示它們不保證在 CI 上進行測試，並且可能不提供不同編譯器版本之間的原始碼和二進位相容性。我們計劃最終在 Kotlin 2.4.0 中移除對 `x86_64` Apple 目標的支援。

有關詳細資訊，請參閱 [Kotlin/Native 目標支援](native-target-support.md)。

## Kotlin/Wasm

Kotlin 2.3.0 預設啟用了 Kotlin/Wasm 目標的完整限定名稱、`wasmWasi` 目標的新例外處理提案，並引入了針對 Latin-1 字元的緊湊儲存方式。

### 預設啟用完整限定名稱

在 Kotlin/Wasm 目標上，完整限定名稱（FQNs）在執行時並非預設啟用。
您必須手動啟用對 `KClass.qualifiedName` 屬性的支援才能使用 FQN。

只有類別名稱（不含套件）可供存取，這對從 JVM 移植到 Wasm 目標的程式碼或期望在執行時使用完整限定名稱的函式庫造成了問題。

在 Kotlin 2.3.0 中，`KClass.qualifiedName` 屬性在 Kotlin/Wasm 目標上預設啟用。
這表示 FQN 在執行時無需任何額外配置即可使用。

預設啟用 FQN 提高了程式碼可攜性，並透過顯示完整限定名稱使執行時錯誤更具資訊性。

由於編譯器最佳化透過使用緊湊儲存（compact storage）來處理 Latin-1 字串常值（string literals）從而減少了中繼資料，此變更不會增加編譯後的 Wasm 二進位檔案大小。

### Latin-1 字元的緊湊儲存

以前，Kotlin/Wasm 會按原樣儲存字串常值資料，這表示每個字元都以 UTF-16 編碼。這對於只包含或主要包含 Latin-1 字元的文字來說並非最佳方案。

從 Kotlin 2.3.0 開始，Kotlin/Wasm 編譯器會將只包含 Latin-1 字元的字串常值以 UTF-8 格式儲存。

此最佳化顯著減少了中繼資料，正如 JetBrains 的 [KotlinConf 應用程式](https://github.com/JetBrains/kotlinconf-app) 實驗所顯示。它導致：

*   與未經最佳化的建置相比，Wasm 二進位檔案最多可縮小 13%。
*   即使啟用完整限定名稱，Wasm 二進位檔案仍可縮小最多 8%，相較於未儲存它們的早期版本。

這種緊湊儲存對於下載和啟動時間很重要的網路環境至關重要。此外，此最佳化消除了以前阻礙儲存[類別的完整限定名稱並預設啟用 `KClass.qualifiedName`](#fully-qualified-names-enabled-by-default) 的大小限制。

此變更預設啟用，無需採取進一步行動。

### `wasmWasi` 預設啟用新的例外處理提案

以前，Kotlin/Wasm 對所有目標（包括 [`wasmWasi`](wasm-overview.md#kotlin-wasm-and-wasi)）都使用 [舊版例外處理提案](https://github.com/WebAssembly/exception-handling/blob/master/proposals/exception-handling/legacy/Exceptions.md)。然而，大多數獨立的 WebAssembly 虛擬機器（VM）正在與 [新版例外處理提案](https://github.com/WebAssembly/exception-handling/blob/main/proposals/exception-handling/Exceptions.md) 對齊。

從 Kotlin 2.3.0 開始，新的 WebAssembly 例外處理提案預設為 `wasmWasi` 目標啟用，確保與現代 WebAssembly 執行時有更好的相容性。

對於 `wasmWasi` 目標，此變更可以安全地提前引入，因為針對它的應用程式通常在較不複雜的執行時環境中運行（通常在單一特定 VM 上運行），這通常由使用者控制，從而降低了相容性問題的風險。

新的例外處理提案對於 [`wasmJs` 目標](wasm-overview.md#kotlin-wasm-and-compose-multiplatform) 預設仍為關閉。您可以透過使用 `-Xwasm-use-new-exception-proposal` 編譯器選項手動啟用它。

## Kotlin/JS

Kotlin 2.3.0 帶來了將 suspend 函式匯出到 JavaScript 的實驗性支援，以及使用 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 型別。

在此版本中，您現在可以以統一的方式存取介面內的伴生物件，在帶有伴生物件的介面中使用 `@JsStatic` 註解，在個別函式和類別中使用 `@JsQualifier` 註解，並透過新的註解 `@JsExport.Default` 進行預設匯出。

### 使用 `JsExport` 匯出 suspend 函式的新功能
<primary-label ref="experimental-opt-in"/>

以前，`@JsExport` 註解不允許將 suspend 函式（或包含此類函式的類別和介面）匯出到 JavaScript。您必須手動包裝每個 suspend 函式，這既麻煩又容易出錯。

從 Kotlin 2.3.0 開始，suspend 函式可以使用 `@JsExport` 註解直接匯出到 JavaScript。

啟用 suspend 函式匯出減少了樣板程式碼，並改進了 Kotlin/JS 與 JavaScript/TypeScript (JS/TS) 之間的互通性。Kotlin 的非同步函式現在可以直接從 JS/TS 呼叫，無需額外程式碼。

若要啟用此功能，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案中：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xenable-suspend-function-exporting")
    }
}
```

啟用後，標記有 `@JsExport` 註解的類別和函式可以包含 suspend 函式，無需額外的包裝器。

它們可以作為常規 JavaScript 非同步函式使用，也可以作為非同步函式被覆寫（override）：

```kotlin
@JsExport
open class Foo {
    suspend fun foo() = "Foo"
}
```

```typescript
class Bar extends Foo {
    override async foo(): Promise<string> {
        return "Bar"
    }
}
```

此功能為 [實驗性](components-stability.md#stability-levels-explained)。我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-56281/KJS-Cant-export-suspend-functions) 中提供回饋意見。

### 使用 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 型別
<primary-label ref="experimental-opt-in"/>

以前，Kotlin/JS 將其 `LongArray` 表示為 JavaScript 的 `Array<bigint>`。這種方法可行，但對於與期望型別化陣列（typed arrays）的 JavaScript API 互通性而言並不理想。

從此版本開始，當編譯為 JavaScript 時，Kotlin/JS 現在使用 JavaScript 的內建 `BigInt64Array` 型別來表示 Kotlin 的 `LongArray` 值。

使用 `BigInt64Array` 簡化了與使用型別化陣列的 JavaScript API 的互通性。它還允許接受或傳回 `LongArray` 的 API 更自然地從 Kotlin 匯出到 JavaScript。

若要啟用此功能，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案中：

```kotlin
kotlin {
    js {
        // ...
        compilerOptions {
            freeCompilerArgs.add("-Xes-long-as-bigint")
        }
    }
}
```

此功能為 [實驗性](components-stability.md#stability-levels-explained)。我們非常感謝您在我們的問題追蹤器 [YouTrack](https://youtrack.jetbrains.com/issue/KT-79284/Use-BigInt64Array-for-LongArray) 中提供回饋意見。

### JS 模組系統間統一的伴生物件存取

以前，當您使用 `@JsExport` 註解將帶有伴生物件的 Kotlin 介面匯出到 JavaScript/TypeScript 時，在 TypeScript 中使用該介面對於 ES 模組與其他模組系統的工作方式有所不同。

因此，您必須根據模組系統，調整 TypeScript 端的輸出使用方式。

請考慮以下 Kotlin 程式碼：

```kotlin
@JsExport
interface Foo {
    companion object {
        fun bar() = "OK"
    }
}
```

您必須根據模組系統以不同的方式呼叫它：

```kotlin
// 適用於 CommonJS、AMD、UMD 和無模組
Foo.bar()

// 適用於 ES 模組
Foo.getInstance().bar()
```

在此版本中，Kotlin 統一了所有 JavaScript 模組系統中的伴生物件匯出。

現在，對於每個模組系統（ES 模組、CommonJS、AMD、UMD、無模組），介面內的伴生物件總是透過相同的方式存取（就像類別中的伴生物件一樣）：

```kotlin
// 適用於所有模組系統
Foo.Companion.bar()
```

此改進還修復了集合的互通性。以前，集合工廠函式必須根據模組系統以不同的方式存取：

```kotlin
// 適用於 CommonJS、AMD、UMD 和無模組
KtList.fromJsArray([1, 2, 3])

// 適用於 ES 模組
KtList.getInstance().fromJsArray([1, 2, 3])
```

現在，跨所有模組系統存取集合工廠函式的方式是相似的：

```kotlin
// 適用於所有模組系統
KtList.fromJsArray([1, 2, 3])
```

此變更減少了模組系統之間的不一致行為，並避免了錯誤和互通性問題。

此功能預設啟用。

### 支援在帶有伴生物件的介面中使用 `@JsStatic` 註解

以前，`@JsStatic` 註解不允許在帶有伴生物件的匯出介面中使用。

例如，以下程式碼會產生錯誤，因為只有類別伴生物件的成員才能使用 `@JsStatic` 註解：

```kotlin
@JsExport
interface Foo {
    companion object {
        @JsStatic // 錯誤
        fun bar() = "OK"
    }
}
```

在此情況下，您必須移除 `@JsStatic` 註解並透過以下方式從 JavaScript (JS) 存取伴生物件：

```kotlin
// 適用於所有模組系統
Foo.Companion.bar()
```

現在，`@JsStatic` 註解在帶有伴生物件的介面中受支援。
您可以在此類伴生物件上使用此註解，並直接從 JS 呼叫函式，就像您對類別所做的那樣：

```kotlin
// 適用於所有模組系統
Foo.bar()
```

此變更簡化了 JS 中的 API 使用，允許在介面上使用靜態工廠方法，並消除了類別和介面之間的不一致性。

此功能預設啟用。

### `@JsQualifier` 註解允許用於個別函式和類別

以前，`@JsQualifier` 註解只能應用於檔案層級，要求所有外部 JavaScript (JS) 宣告都放置在單獨的檔案中。

從 Kotlin 2.3.0 開始，您可以將 `@JsQualifier` 註解直接應用於個別函式和類別，就像 `@JsModule` 和 `@JsNonModule` 註解一樣。

例如，您現在可以在同一檔案中，將以下外部函式程式碼寫在常規 Kotlin 宣告旁邊：

```kotlin
@JsQualifier("jsPackage")
private external fun jsFun()
```

此變更簡化了 Kotlin/JS 互通性，使您的專案結構更清晰，並使 Kotlin/JS 與其他平台處理外部宣告的方式保持一致。

此功能預設啟用。

### 支援 JavaScript 預設匯出

以前，Kotlin/JS 無法從 Kotlin 程式碼產生 JavaScript 的預設匯出。相反，Kotlin/JS 只產生具名匯出，例如：

```javascript
export { SomeDeclaration };
```

如果您需要預設匯出，則必須在編譯器內部使用變通方法，例如放置帶有 `default` 和一個空格作為引數的 `@JsName` 註解：

```kotlin
@JsExport
@JsName("default ")
class SomeDeclaration
```

Kotlin/JS 現在透過一個新的註解直接支援預設匯出：

```kotlin
@JsExport.Default
```

當您將此註解應用於 Kotlin 宣告（類別、物件、函式或屬性）時，生成的 JavaScript 會自動為 ES 模組包含 `export default` 陳述式：

```javascript
export default HelloWorker;
```

> 對於與 ES 模組不同的模組系統，新的 `@JsExport.Default` 註解與常規的 `@JsExport` 註解功能相似。
>
{style="note"}

此變更使 Kotlin 程式碼能夠符合 JavaScript 慣例，對於像 Cloudflare Workers 或 `React.lazy` 等框架的平台尤其重要。

此功能預設啟用。您只需使用 `@JsExport.Default` 註解即可。

## Gradle

Kotlin 2.3.0 與 Gradle 7.6.3 到 9.0.0 完全相容。您也可以使用最新的 Gradle 版本。但是，請注意，這樣做可能會導致淘汰警告，並且一些新的 Gradle 功能可能無法正常工作。

此外，最低支援的 Android Gradle 外掛程式版本現在是 8.2.2，最高支援版本是 8.13.0。

Kotlin 2.3.0 還引入了一個新 API，用於在您的 Gradle 專案中註冊產生來源。

### 用於在 Gradle 專案中註冊產生來源的新 API
<primary-label ref="experimental-general"/>

Kotlin 2.3.0 在 [`KotlinSourceSet`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.plugin/-kotlin-source-set/) 介面中引入了一個新的 [實驗性](components-stability.md#stability-levels-explained) API，您可以使用它在您的 Gradle 專案中註冊產生來源。

這個新 API 是一種生活品質（quality-of-life）的改進，可幫助 IDE 區分產生程式碼和常規原始碼檔案。
此 API 允許 IDE 在 UI 中以不同方式高亮顯示產生程式碼，並在匯入專案時觸發產生任務。我們目前正在努力在 IntelliJ IDEA 中添加此支援。此 API 對於產生程式碼的第三方外掛程式或工具（例如 [KSP](ksp-overview.md) (Kotlin Symbol Processing)）也特別有用。

有關詳細資訊，請參閱 [註冊產生來源](gradle-configure-project.md#register-generated-sources)。

## 標準函式庫

Kotlin 2.3.0 穩定化了新的時間追蹤功能，[`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)，並對實驗性 UUID API 進行了多項改進。

### 改進的 UUID 產生和解析
<primary-label ref="experimental-opt-in"/>

Kotlin 2.3.0 針對 UUID API 引入了多項改進，包括：

*   [解析無效 UUID 時支援傳回 `null`](#support-for-returning-null-when-parsing-invalid-uuids)
*   [產生 v4 和 v7 UUID 的新函式](#new-functions-to-generate-v4-and-v7-uuids)
*   [支援為特定時間戳產生 v7 UUID](#support-for-generating-v7-uuids-for-specific-timestamps)

標準函式庫中的 UUID 支援是 [實驗性](components-stability.md#stability-levels-explained) 的，但[計劃在未來穩定化](https://youtrack.jetbrains.com/issue/KT-81395)。
若要選擇啟用，請使用 `@OptIn(ExperimentalUuidApi::class)` 註解或將以下編譯器選項新增至您的建置檔案中：

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=kotlin.uuid.ExperimentalUuidApi")
    }
}
```

</tab>
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-opt-in=kotlin.uuid.ExperimentalUuidApi</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-81395) 或[相關的 Slack 頻道](https://slack-chats.kotlinlang.org/c/uuid) 中提供回饋意見。

#### 解析無效 UUID 時支援傳回 `null`

Kotlin 2.3.0 引入了新函式，可從字串建立 `Uuid` 實例，如果字串不是有效的 UUID，則傳回 `null` 而不是拋出例外。

這些函式包括以下內容：

*   `Uuid.parseOrNull()` – 以十六進制和破折號或十六進制格式解析 UUID。
*   `Uuid.parseHexDashOrNull()` – 僅以十六進制和破折號格式解析 UUID，否則傳回 `null`。
*   `Uuid.parseHexOrNull()` – 僅以純十六進制格式解析 UUID，否則傳回 `null`。

以下是範例：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    val valid = Uuid.parseOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(valid)
    // 550e8400-e29b-41d4-a716-446655440000

    val invalid = Uuid.parseOrNull("not-a-uuid")
    println(invalid)
    // null

    val hexDashValid = Uuid.parseHexDashOrNull("550e8400-e29b-41d4-a716-446655440000")
    println(hexDashValid)
    // 550e8400-e29b-41d4-a716-446655440000

    val hexDashInvalid = Uuid.parseHexDashOrNull("550e8400e29b41d4a716446655440000")
    println(hexDashInvalid)
    // null
}
```
{kotlin-runnable="true"}

#### 產生 v4 和 v7 UUID 的新函式

Kotlin 2.3.0 引入了兩個用於產生 UUID 的新函式：`Uuid.generateV4()` 和 `Uuid.generateV7()`。

使用 `Uuid.generateV4()` 函式產生第 4 版 UUID，或使用 `Uuid.generateV7()` 函式產生第 7 版 UUID。

> `Uuid.random()` 函式保持不變，仍像 `Uuid.generateV4()` 一樣產生第 4 版 UUID。
>
{style="note"}

以下是範例：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid

@OptIn(ExperimentalUuidApi::class)
fun main() {
    // 產生一個 v4 UUID
    val v4 = Uuid.generateV4()
    println(v4)

    // 產生一個 v7 UUID
    val v7 = Uuid.generateV7()
    println(v7)

    // 產生一個 v4 UUID
    val random = Uuid.random()
    println(random)
}
```
{kotlin-runnable="true"}

#### 支援為特定時間戳產生 v7 UUID

Kotlin 2.3.0 引入了新的 `Uuid.generateV7NonMonotonicAt()` 函式，您可以使用它來為特定的時間點產生第 7 版 UUID。

> 與 `Uuid.generateV7()` 不同，`Uuid.generateV7NonMonotonicAt()` 不保證單調排序，因此為相同時間戳建立的多個 UUID 可能不是順序的。
>
{style="note"}

當您需要與已知時間戳相關聯的識別碼時，例如重新建立事件 ID 或產生反映事物原始發生時間的資料庫條目時，請使用此函式。

例如，若要為特定時刻建立第 7 版 UUID，請使用以下程式碼：

```kotlin
import kotlin.uuid.ExperimentalUuidApi
import kotlin.uuid.Uuid
import kotlin.time.ExperimentalTime
import kotlin.time.Instant

@OptIn(ExperimentalUuidApi::class, ExperimentalTime::class)
fun main() {
    val timestamp = Instant.fromEpochMilliseconds(1577836800000) // 2020-01-01T00:00:00Z

    // 為指定時間戳產生一個 v7 UUID（不保證單調性）
    val v7AtTimestamp = Uuid.generateV7NonMonotonicAt(timestamp)
    println(v7AtTimestamp)
}
```
{kotlin-runnable="true"}

## Compose 編譯器：用於縮減版 Android 應用程式的堆疊追蹤

從 Kotlin 2.3.0 開始，當應用程式由 R8 縮減（minified）時，編譯器會為 Compose 堆疊追蹤輸出 ProGuard 映射。這擴展了以前僅在可偵錯版本中可用的實驗性堆疊追蹤功能。

堆疊追蹤的發佈版本包含群組鍵（group keys），可用於在縮減版應用程式中識別可組合函式，而無需在執行時記錄原始碼資訊的開銷。群組鍵堆疊追蹤要求您的應用程式使用 Compose 執行時 1.10 或更新版本建置。

若要啟用群組鍵堆疊追蹤，請在初始化任何 `@Composable` 內容之前新增以下行：

```kotlin
Composer.setDiagnosticStackTraceMode(ComposeStackTraceMode.GroupKeys)
```

啟用這些堆疊追蹤後，即使應用程式已縮減，Compose 執行時仍會在合成（composition）、測量（measure）或繪製（draw）階段捕獲崩潰後附加其自己的堆疊追蹤：

```text
java.lang.IllegalStateException: <message>
        at <original trace>
    Suppressed: androidx.compose.runtime.DiagnosticComposeException: Composition stack when thrown:
        at $compose.m$123(SourceFile:1)
        at $compose.m$234(SourceFile:1)
        ...
```

Jetpack Compose 1.10 在此模式下產生的堆疊追蹤僅包含仍需反混淆（deobfuscated）的群組鍵。
這已在 Kotlin 2.3.0 版本中透過 Compose Compiler Gradle 外掛程式解決，該外掛程式現在將群組鍵條目附加到 R8 產生的 ProGuard 映射檔案中。如果您在編譯器未能為某些函式建立映射的情況下看到新的警告，請向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 報告。

> 由於依賴 R8 映射檔案，Compose Compiler Gradle 外掛程式僅在建置啟用 R8 時為群組鍵堆疊追蹤建立反混淆映射。
>
{style="note"}

預設情況下，映射檔案 Gradle 任務無論您是否啟用追蹤都會運行。如果它們在您的建置中造成問題，您可以完全停用此功能。在您的 Gradle 配置的 `composeCompiler {}` 區塊中新增以下屬性：

```kotlin
composeCompiler {
    includeComposeMappingFile.set(false)
}
```

> 存在一個已知問題，即 Android Gradle 外掛程式提供的專案檔案中有些程式碼未顯示在堆疊追蹤中：[KT-83099](https://youtrack.jetbrains.com/issue/KT-83099)。
>
{style="warning"}

請向 [Google IssueTracker](https://issuetracker.google.com/issues/new?component=610764&template=1424126) 報告遇到的任何問題。

## 破壞性變更與淘汰

本節重點介紹重要的破壞性變更與淘汰。
有關完整概覽，請參閱我們的 [相容性指南](compatibility-guide-23.md)。

*   從 Kotlin 2.3.0 開始，編譯器[不再支援 `-language-version=1.8`](compatibility-guide-23.md#drop-support-in-language-version-for-1-8-and-1-9)。
    在非 JVM 平台上也不支援 `-language-version=1.9`。
*   早於 2.0 的語言功能集（JVM 平台上的 1.9 除外）不受支援，但語言本身與 Kotlin 1.0 完全向後相容。

    如果您的 Gradle 專案同時使用 `kotlin-dsl` **和** `kotlin("jvm")` 外掛程式，您可能會看到 Gradle 關於不支援的 Kotlin 外掛程式版本的警告。請參閱我們的 [相容性指南](compatibility-guide-23.md#unsupported-kgp-version-warning-when-using-kotlin-dsl-and-kotlin-jvm-plugins) 以獲取遷移步驟的指導。

*   在 Kotlin Multiplatform 中，現在透過 Google 的 [`com.android.kotlin.multiplatform.library` 外掛程式](https://developer.android.com/kotlin/multiplatform/plugin) 提供對 Android 目標的支援。
    將您帶有 Android 目標的專案遷移到新外掛程式，並將您的 `androidTarget` 區塊重新命名為 `android`。

*   如果您繼續將 Kotlin Multiplatform Gradle 外掛程式用於 Android 目標，且搭配 Android Gradle 外掛程式 (AGP) 9.0.0 或更高版本，則在使用 `androidTarget` 區塊時會看到配置錯誤，並附帶提供如何遷移的診斷訊息。有關詳細資訊，請參閱 [遷移到 Google 的 Android 目標外掛程式](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html#migrate-to-google-s-plugin-for-android-targets)。

*   AGP 9.0.0 包含[對 Kotlin 的內建支援](https://developer.android.com/build/releases/agp-preview#android-gradle-plugin-built-in-kotlin)。
    從 Kotlin 2.3.0 開始，如果您將此版本的 AGP 與 `kotlin-android` 外掛程式一起使用，您會看到[配置錯誤](compatibility-guide-23.md#deprecate-kotlin-android-plugin-for-agp-versions-9-0-0-and-later)，因為該外掛程式不再是必需的。提供了新的診斷訊息以幫助您遷移。
    如果您使用較舊的 AGP 版本，您會看到淘汰警告。

*   不再支援 Ant 建置系統。

## 文件更新

Kotlin Multiplatform 文件已遷移至 kotlinlang.org。現在您可以在一個地方切換 Kotlin 和 KMP 文件。
我們還更新了語言指南的目錄並引入了新的導航功能。

自上次 Kotlin 發佈以來的其他值得注意的變更：

*   [KMP 概覽](https://kotlinlang.org/docs/multiplatform/kmp-overview.html) – 在單一頁面上探索 Kotlin Multiplatform 生態系統。
*   [Kotlin Multiplatform 快速入門](https://kotlinlang.org/docs/multiplatform/quickstart.html) – 了解如何使用 KMP IDE 外掛程式設定環境。
*   [Compose Multiplatform 1.9.3 的新功能](https://kotlinlang.org/docs/multiplatform/whats-new-compose-190.html) – 了解最新版本的亮點。
*   [Kotlin/JS 入門](js-get-started.md) – 使用 Kotlin/JavaScript 為瀏覽器建立 Web 應用程式。
*   [類別](classes.md) – 了解在 Kotlin 中使用類別的基礎知識和最佳實踐。
*   [擴充功能](extensions.md) – 了解如何在 Kotlin 中擴充類別和介面。
*   [協程基礎](coroutines-basics.md) – 探索關鍵的協程概念並學習如何建立您的第一個協程。
*   [取消與逾時](cancellation-and-timeouts.md) – 了解協程取消的工作原理以及如何讓協程響應取消。
*   [Kotlin/Native 函式庫](native-libraries.md) – 了解如何產生 `klib` 函式庫構件。
*   [Kotlin Notebook 概覽](kotlin-notebook-overview.md) – 使用 Kotlin Notebook 外掛程式建立互動式筆記本文件。
*   [將 Kotlin 加入 Java 專案](mixing-java-kotlin-intellij.md) – 配置 Java 專案以同時使用 Kotlin 和 Java。
*   [使用 Kotlin 測試 Java 程式碼](jvm-test-using-junit.md) – 使用 JUnit 測試混合 Java-Kotlin 專案。
*   [新案例研究頁面](https://kotlinlang.org/case-studies/) – 探索不同公司如何應用 Kotlin。

## 如何更新到 Kotlin 2.3.0

Kotlin 外掛程式作為捆綁外掛程式分發在 IntelliJ IDEA 和 Android Studio 中。

若要更新到新的 Kotlin 版本，請在您的建置指令碼中將 [Kotlin 版本](releases.md#update-to-a-new-kotlin-version) 變更為 2.3.0。