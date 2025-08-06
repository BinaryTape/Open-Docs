[//]: # (title: 瀏覽器與 DOM API)

Kotlin/JS 標準函式庫讓您可以使用 `kotlinx.browser` 軟體包存取瀏覽器特定的功能，該軟體包包含諸如 `document` 和 `window` 等典型的頂層物件。標準函式庫盡可能為這些物件公開的功能提供型別安全的包裝器。作為備用方案，`dynamic` 型別用於提供與無法很好地映射到 Kotlin 型別系統中的函式互動。

## 與 DOM 互動

若要與文件物件模型 (DOM) 互動，您可以使用變數 `document`。例如，您可以透過此物件設定我們網站的背景顏色：

```kotlin
document.bgColor = "FFAA12" 
```

`document` 物件也提供了透過 ID、名稱、類別名稱、標籤名稱等方式檢索特定元素的方法。所有回傳的元素型別都是 `Element?`。若要存取其屬性，您需要將其轉換為其適當的型別。例如，假設您有一個帶有電子郵件 `<input>` 欄位的 HTML 頁面：

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

請注意，您的腳本包含在 `<body>` 標籤的底部。這確保了 DOM 在腳本載入之前完全可用。

透過這種設定，您可以存取 DOM 的元素。若要存取 `input` 欄位的屬性，請呼叫 `getElementById` 並將其轉換為 `HTMLInputElement`。您就可以安全地存取其屬性，例如 `value`：

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

就像您參考這個 `input` 元素一樣，您可以存取頁面上的其他元素，並將它們轉換為適當的型別。

若要了解如何以簡潔的方式在 DOM 中建立和組織元素，請查閱 [型別安全 HTML DSL](typesafe-html-dsl.md)。