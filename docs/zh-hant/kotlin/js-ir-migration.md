---
title: "將 Kotlin/JS 專案遷移到 IR 編譯器"
---
我們為了統一 Kotlin 在所有平台上的行為，並使其能夠實現新的 JS 專用優化等原因，以 [基於 IR 的編譯器](js-ir-compiler) 取代了舊的 Kotlin/JS 編譯器。
您可以透過 Sebastian Aigner 的部落格文章 [將我們的 Kotlin/JS 應用程式遷移到新的 IR 編譯器](https://dev.to/kotlin/migrating-our-kotlin-js-app-to-the-new-ir-compiler-3o6i) 瞭解更多關於這兩個編譯器內部差異的資訊。

由於編譯器之間存在顯著差異，因此將您的 Kotlin/JS 專案從舊的後端切換到新的後端可能需要調整您的程式碼。在本頁面中，我們編譯了一份已知的遷移問題清單，以及建議的解決方案。

:::tip
安裝 [Kotlin/JS Inspection pack](https://plugins.jetbrains.com/plugin/17183-kotlin-js-inspection-pack/) 插件，以取得關於如何修復遷移期間發生的一些問題的寶貴提示。

:::

請注意，隨著我們修復問題並發現新問題，本指南可能會隨時間變化。請幫助我們保持其完整性 – 透過將您在切換到 IR 編譯器時遇到的任何問題提交到我們的問題追蹤器 [YouTrack](https://kotl.in/issue) 或填寫 [此表單](https://surveys.jetbrains.com/s3/ir-be-migration-issue) 來回報。

## 將與 JS 和 React 相關的類別和介面轉換為外部介面 (external interfaces)

**問題**：使用衍生自純 JS 類別 (例如 React 的 `State` 和 `Props`) 的 Kotlin 介面和類別 (包括資料類別) 可能會導致 `ClassCastException`。出現此類例外情況的原因是編譯器嘗試將這些類別的實例視為 Kotlin 物件來處理，但它們實際上來自 JS。

**解決方案**：將所有衍生自純 JS 類別的類別和介面轉換為 [外部介面 (external interfaces)](js-interop#external-interfaces)：

```kotlin
// Replace this
interface AppState : State { }
interface AppProps : Props { }
data class CustomComponentState(var name: String) : State
```

```kotlin
// With this
external interface AppState : State { }
external interface AppProps : Props { }
external interface CustomComponentState : State {
   var name: String
}
```

在 IntelliJ IDEA 中，您可以使用這些 [結構性搜尋和替換](https://www.jetbrains.com/help/idea/structural-search-and-replace.html) 範本自動將介面標記為 `external`：
* [`State` 的範本](https://gist.github.com/SebastianAigner/62119536f24597e630acfdbd14001b98)
* [`Props` 的範本](https://gist.github.com/SebastianAigner/a47a77f5e519fc74185c077ba12624f9)

## 將外部介面 (external interfaces) 的屬性轉換為 var

**問題**：Kotlin/JS 程式碼中外部介面 (external interfaces) 的屬性不能是唯讀 (`val`) 屬性，因為它們的值只能在使用 `js()` 或 `jso()` (來自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的輔助函數) 建立物件後才能賦值：

```kotlin
import kotlinx.js.jso

val myState = jso<CustomComponentState>()
myState.name = "name"
```

**解決方案**：將外部介面 (external interfaces) 的所有屬性轉換為 `var`：

```kotlin
// Replace this
external interface CustomComponentState : State {
   val name: String
}
```

```kotlin
// With this
external interface CustomComponentState : State {
   var name: String
}
```

## 將外部介面 (external interfaces) 中帶接收者 (receiver) 的函數轉換為常規函數

**問題**：外部宣告不能包含帶接收者 (receiver) 的函數，例如擴展函數或具有相應函數類型的屬性。

**解決方案**：透過將接收者物件作為參數新增，將此類函數和屬性轉換為常規函數：

```kotlin
// Replace this
external interface ButtonProps : Props {
   var inside: StyledDOMBuilder<BUTTON>.() `->` Unit
}
```

```kotlin
external interface ButtonProps : Props {
   var inside: (StyledDOMBuilder<BUTTON>) `->` Unit
}
```

## 建立用於互通性的純 JS 物件

**問題**：實現外部介面 (external interfaces) 的 Kotlin 物件的屬性不是 _可列舉的 (enumerable)_。這表示它們對於疊代物件屬性的操作不可見，例如：
* `for (var name in obj)`
* `console.log(obj)`
* `JSON.stringify(obj)`

儘管它們仍然可以通過名稱訪問：`obj.myProperty`

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
fun main() {
   val jsApp = js("{name: 'App1'}") as AppProps // plain JS object
   println("Kotlin sees: ${jsApp.name}") // "App1"
   println("JSON.stringify sees:" + JSON.stringify(jsApp)) // {"name":"App1"} - OK

   val ktApp = AppPropsImpl("App2") // Kotlin object
   println("Kotlin sees: ${ktApp.name}") // "App2"
   // JSON sees only the backing field, not the property
   println("JSON.stringify sees:" + JSON.stringify(ktApp)) // {"_name_3":"App2"}
}
```

**解決方案 1**：使用 `js()` 或 `jso()` (來自 [`kotlin-wrappers`](https://github.com/JetBrains/kotlin-wrappers) 的輔助函數) 建立純 JavaScript 物件：

```kotlin
external interface AppProps { var name: String }
data class AppPropsImpl(override var name: String) : AppProps
```

```kotlin
// Replace this
val ktApp = AppPropsImpl("App1") // Kotlin object
```

```kotlin
// With this
val jsApp = js("{name: 'App1'}") as AppProps // or jso {}
```

**解決方案 2**：使用 `kotlin.js.json()` 建立物件：

```kotlin
// or with this
val jsonApp = kotlin.js.json(Pair("name", "App1")) as AppProps
```

## 將函數引用的 toString() 呼叫替換為 .name

**問題**：在 IR 後端中，呼叫函數引用的 `toString()` 不會產生唯一值。

**解決方案**：使用 `name` 屬性而不是 `toString()`。

## 在建置腳本中明確指定 binaries.executable()

**問題**：編譯器不會產生可執行 `.js` 檔案。

發生這種情況的原因可能是預設編譯器預設會產生 JavaScript 可執行檔，而 IR 編譯器需要明確的指令才能執行此操作。在 [Kotlin/JS 專案設定說明](js-project-setup#execution-environments) 中瞭解更多資訊。

**解決方案**：將 `binaries.executable()` 行新增到專案的 `build.gradle(.kts)`。

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

這些提示可能有助於您在使用 Kotlin/JS IR 編譯器的專案中進行疑難排解。

### 使外部介面 (external interfaces) 中的布林屬性可為空 (nullable)

**問題**：當您從外部介面 (external interfaces) 呼叫 `Boolean` 上的 `toString` 時，您會收到類似 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')` 的錯誤。JavaScript 將布林變數的 `null` 或 `undefined` 值視為 `false`。如果您依賴於呼叫可能為 `null` 或 `undefined` 的 `Boolean` 上的 `toString`（例如，當您的程式碼從您無法控制的 JavaScript 程式碼中呼叫時），請注意這一點：

```kotlin
external interface SomeExternal {
    var visible: Boolean
}

fun main() {
    val empty: SomeExternal = js("{}")
    println(empty.visible.toString()) // Uncaught TypeError: Cannot read properties of undefined (reading 'toString')
}
```

**解決方案**：您可以使外部介面 (external interfaces) 的 `Boolean` 屬性可為空 (`Boolean?`)：

```kotlin
// Replace this
external interface SomeExternal {
    var visible: Boolean
}
```

```kotlin
// With this
external interface SomeExternal {
    var visible: Boolean?
}
```