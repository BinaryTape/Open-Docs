[//]: # (title: Kotlin %kotlinEapVersion% 有什麼新功能)

_[發佈日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文件不涵蓋搶先體驗預覽版 (EAP) 的所有功能，
> 但它強調了一些主要改進。
>
> 請參閱 [GitHub 變更日誌](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%) 中的完整變更列表。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已發佈！以下是此 EAP 版本的一些詳細資訊：

* [功能穩定化：巢狀型別別名、詳盡的 `when`、新時間追蹤功能](#stable-features)
* [語言：新的未使用回傳值檢查器，以及上下文感知解析的變更](#language)
* [Kotlin/Native：預設啟用泛型型別邊界上的型別檢查（偵錯模式）](#kotlin-native-type-checks-on-generic-type-boundaries-in-debug-mode)

## IDE 支援

支援 Kotlin %kotlinEapVersion% 的 Kotlin 插件已捆綁在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您無需更新 IDE 中的 Kotlin 插件。
您只需在建置腳本中將 [Kotlin 版本變更](configure-build-for-eap.md) 為 %kotlinEapVersion%。

有關詳細資訊，請參閱[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## 穩定功能

在先前的 Kotlin 版本中，一些新的語言和標準函式庫功能以實驗性 (Experimental) 和 Beta 階段推出。
我們很高興地宣布，在此版本中，以下功能已成為[穩定版](components-stability.md#stability-levels-explained)：

* [支援巢狀型別別名](whatsnew22.md#support-for-nested-type-aliases)
* [基於資料流的 `when` 表達式詳盡性檢查](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)
* [新時間追蹤功能：`kotlin.time.Clock` 和 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)

[請參閱 Kotlin 語言設計功能和提案的完整列表](kotlin-language-features-and-proposals.md)。

## 語言

Kotlin %kotlinEapVersion% 引入了新的未使用回傳值檢查機制，並專注於改進上下文感知解析。

### 未使用回傳值檢查器
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion% 引入了一項新功能：未使用回傳值檢查器。
當表達式回傳的值不是 `Unit` 或 `Nothing`，且未傳遞給函式、未在條件中檢查或未以其他方式使用時，此功能會發出警告。

您可以使用它來捕獲錯誤，例如函式呼叫產生有意義的結果，但結果卻被默默丟棄，這可能導致意外行為或難以追蹤的問題。

> 檢查器會忽略來自遞增操作（例如 `++` 和 `--`）的回傳值。
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

此功能為[實驗性](components-stability.md#stability-levels-explained)。
若要啟用，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

使用此選項，檢查器僅報告來自已標記表達式的被忽略結果，就像 Kotlin 標準函式庫中的大多數函式一樣。

若要標記您的函式，請使用 `@MustUseReturnValues` 註解來標記您希望檢查器報告被忽略回傳值的範圍。

例如，您可以標記整個檔案：

```kotlin
// 標記此檔案中的所有函式和類別，以便檢查器報告未使用回傳值
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

或特定類別：

```kotlin
// 標記此類別中的所有函式，以便檢查器報告未使用回傳值
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

您也可以使用 `full` 模式標記您的整個專案。
為此，請將以下編譯器選項新增至您的 `build.gradle.kts` 檔案：

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

在此模式下，Kotlin 會自動將您編譯的檔案視為已使用 `@MustUseReturnValues` 註解標記，因此檢查器會套用到您專案函式的所有回傳值。

您可以透過使用 `@IgnorableReturnValue` 註解標記特定函式來抑制警告。
註解那些忽略結果很常見且預期的函式，例如 `MutableList.add`：

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```
您可以抑制警告，而無需將函式本身標記為可忽略。
為此，請將結果指定給一個帶有底線語法 (`_`) 的特殊匿名變數：

```kotlin
// 不可忽略的函式
fun computeValue(): Int = 42

fun main() {

    // 報告警告：結果被忽略
    computeValue()

    // 僅在此呼叫點使用特殊未使用變數抑制警告
    val _ = computeValue()
}
```

我們非常感謝您在 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719) 中提供回饋。有關更多資訊，請參閱該功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)。

### 上下文感知解析的變更
<primary-label ref="experimental-general"/>

> 目前，IntelliJ IDEA 中對此功能的程式碼分析、程式碼補齊和語法突顯支援僅在 [2025.3 EAP 版本](https://www.jetbrains.com/idea/nextversion/)中提供。
>
{style = "note"}

上下文感知解析仍為[實驗性](components-stability.md#stability-levels-explained)，但我們將根據使用者回饋持續改進此功能：

* 現在將目前型別的 sealed 和封閉超型別視為搜尋上下文範圍的一部分。不考慮其他超型別範圍。
* 在涉及型別運算符和相等性的情況下，如果使用上下文感知解析導致解析模糊，編譯器現在會報告警告。例如，當匯入類別的衝突宣告時，可能會發生這種情況。

有關詳細資訊，請參閱 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md) 中當前提案的完整文字。

## Kotlin/Native：預設啟用泛型型別邊界上的型別檢查（偵錯模式）

從 Kotlin %kotlinEapVersion% 開始，在偵錯模式中，預設啟用泛型型別邊界上的型別檢查，協助您更早發現與未經檢查的型別轉換相關的錯誤。此變更提高了安全性，並使跨平台的無效泛型型別轉換偵錯更具可預測性。

以前，在 Kotlin/Native 中，未經檢查的型別轉換可能導致堆污染和記憶體安全違規，而這些問題可能不會被注意到。
現在，這些情況會像 Kotlin/JVM 或 Kotlin/JS 一樣，穩定地以運行時型別轉換錯誤失敗。例如：

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // 現在會拋出 ClassCastException 錯誤
}
```

此程式碼以前會列印 `6`；現在它在偵錯模式中會如預期地拋出 `ClassCastException` 錯誤。

有關更多資訊，請參閱[型別檢查與型別轉換](typecasts.md)。

## Gradle：Kotlin/JVM 編譯預設使用建置工具 API
<primary-label ref="experimental-general"/>

在 Kotlin 2.3.0-Beta1 中，Kotlin Gradle 插件中的 Kotlin/JVM 編譯預設使用[建置工具 API](build-tools-api.md) (BTA)。這是內部編譯基礎設施的一項重大變更。

我們在此版本中將 BTA 設定為預設值，以爭取測試時間。我們預計一切都會像以前一樣正常運作。如果您發現任何問題，請在我們的[問題追蹤器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)中分享您的回饋。

我們計劃在 2.3.0-Beta2 中再次停用 Kotlin/JVM 編譯的 BTA，並從 Kotlin 2.3.20 開始為所有使用者完全啟用它。