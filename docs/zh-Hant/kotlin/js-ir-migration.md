[//]: # (title: 將 Kotlin/JS 專案遷移至 IR 編譯器)

為了統一 Kotlin 在所有平台上的行為，並實作新的 JS 特有最佳化，我們已將舊的 Kotlin/JS 編譯器替換為 [基於 IR 的編譯器](js-ir-compiler.md)。您可以透過 Sebastian Aigner 的部落格文章 [將我們的 Kotlin/JS 應用程式遷移至新的 IR 編譯器](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i) 深入了解兩種編譯器之間的內部差異。

由於編譯器之間存在顯著差異，將您的 Kotlin/JS 專案從舊後端切換到新後端可能需要調整您的程式碼。在本頁面，我們編譯了一份已知遷移問題清單以及建議的解決方案。

> 安裝 [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 外掛程式，以取得有關如何解決遷移過程中發生的一些問題的寶貴提示。
>
{style="tip"}

請注意，本指南可能會隨時間變化，因為我們會修正問題並發現新問題。請幫助我們保持其完整性——透過將您在切換到 IR 編譯器時遇到的任何問題提交到我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 或填寫 [此表單](https://surveys.jetbrains.com/s3/ir-be-migration-issue) 來報告。

## 將 JS 和 React 相關的類別和介面轉換為外部介面

**問題**：使用衍生自純 JS 類別的 Kotlin 介面和類別（包括資料類別），例如 React 的 `State` 和 `Props`，可能會導致 `ClassCastException`。這些例外會出現，因為編譯器嘗試將這些類別的實例視為 Kotlin 物件來處理，但它們實際上來自 JS。

**解決方案**：將所有衍生自純 JS 類別的類別和介面轉換為 [外部介面](js-interop.md#external-interfaces)：

```kotlin
// 替換為此
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// 改為此
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

在 IntelliJ IDEA 中，您可以使用這些 [結構化搜尋與取代](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) 範本來自動將介面標記為 `external`：
* [`State` 的範本](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props` 的範本](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 將外部介面的屬性轉換為 var

**問題**：Kotlin/JS 程式碼中外部介面的屬性不能是唯讀 (`val`) 屬性，因為它們的值只能在物件透過 `js()` 或 `jso()`（來自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的輔助函式）建立後才能賦值：

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解決方案**：將外部介面的所有屬性轉換為 `var`：

```kotlin
// 替換為此
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// 改為此
external interface CustomComponentState : State {
   var name: String
}
```

## 將外部介面中帶有接收者的函式轉換為常規函式

**問題**：外部宣告不能包含帶有接收者的函式，例如擴充函式或具有相應函式類型的屬性。

**解決方案**：透過將接收者物件作為參數新增，將這些函式和屬性轉換為常規函式：

```kotlin
// 替換為此
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() -> Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) -> Unit
}
```

## 建立純 JS 物件以實現互通性

**問題**：實作外部介面的 Kotlin 物件的屬性是不可列舉的。這意味著它們對於遍歷物件屬性的操作不可見，例如：
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

儘管它們仍可透過名稱存取：`obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // 純 JS 物件
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin 物件
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON 只看到後備欄位，而不是屬性
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解決方案 1**：使用 `js()` 或 `jso()`（來自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的輔助函式）建立純 JavaScript 物件：

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// 替換為此
val ktApp = AppPropsImpl("App1") // Kotlin 物件
```

```kotlin
// 改為此
val jsApp = js("{name: 'App1'}") as AppProps // 或 jso {}
```

**解決方案 2**：使用 `kotlin.js.json()` 建立物件：

```kotlin
// 或使用此方法
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 將 toString() 對函式引用的呼叫替換為 .name

**問題**：在 IR 後端，對函式引用呼叫 `toString()` 不會產生唯一值。

**解決方案**：使用 `name` 屬性而非 `toString()`。

## 在建構指令碼中明確指定 binaries.executable()

**問題**：編譯器不會產生可執行 `.js` 檔案。

這可能是因為預設編譯器預設會產生 JavaScript 可執行檔，而 IR 編譯器需要明確指示才能執行此操作。您可以在 [Kotlin/JS 專案設定說明](js-project-setup.md#execution-environments) 中了解更多有關執行環境的資訊。

**解決方案**：將 `binaries.executable()` 行新增至專案的 `build.gradle(.kts)`。

```kotlin
kotlin {
    js(IR) {
        browser {
        }
        binaries.executable()
    }
}
```

## 使用 Kotlin/JS IR 編譯器時的其他疑難排解提示

這些提示可能會在您使用 Kotlin/JS IR 編譯器排解專案問題時提供幫助。

### 將外部介面中的布林屬性設為可空

**問題**：當您在外部介面中的 `Boolean` 上呼叫 `toString` 時，您會收到類似 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` 的錯誤。JavaScript 將布林變數的 `null` 或 `undefined` 值視為 `false`。如果您依賴對可能為 `null` 或 `undefined` 的 `Boolean` 呼叫 `toString`（例如，當您的程式碼從您無法控制的 JavaScript 程式碼中呼叫時），請注意這一點：

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解決方案**：您可以將外部介面中的 `Boolean` 屬性設為可空 (`Boolean?`)：

```kotlin
// 替換為此
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// 改為此
external interface SomeExternal {
    var visible: Boolean?
}
```