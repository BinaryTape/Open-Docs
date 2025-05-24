---
title: "瀏覽器和 DOM API"
---
Kotlin/JS 標準函式庫讓你能夠使用 `kotlinx.browser` 套件來存取瀏覽器特定的功能，這個套件包含了典型的頂層物件，像是 `document` 和 `window`。標準函式庫為這些物件所公開的功能提供了類型安全的包裝 (typesafe wrappers)，盡可能地實現類型安全。 作為一種後備方案，`dynamic` 類型被用於提供與那些無法很好地對應到 Kotlin 類型系統的函式互動。

## 與 DOM 互動

對於與文件物件模型 (Document Object Model, DOM) 的互動，你可以使用變數 `document`。 例如，你可以透過這個物件來設定我們網站的背景顏色：

```kotlin
document.bgColor = "FFAA12" 
```

`document` 物件也提供了一種方法，讓你透過 ID、名稱、類別名稱、標籤名稱等等來檢索特定的元素。 所有回傳的元素都是 `Element?` 類型。 為了存取它們的屬性，你需要將它們轉換為它們對應的類型。 例如，假設你現在有一個帶有 email `<input>` 欄位的 HTML 頁面：

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

請注意，你的腳本 (script) 包含在 `body` 標籤的底部。 這樣可以確保在腳本載入之前，DOM 是完全可用的。

透過這樣的設定，你可以存取 DOM 的元素。 為了存取 `input` 欄位的屬性，調用 `getElementById` 並將其轉換為 `HTMLInputElement`。 這樣你就可以安全地存取它的屬性，像是 `value`：

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

就像你參考這個 `input` 元素一樣，你可以存取頁面上的其他元素，並將它們轉換為適當的類型。

若要了解如何以簡潔的方式在 DOM 中建立和組織元素，請查看 [Typesafe HTML DSL](typesafe-html-dsl)。