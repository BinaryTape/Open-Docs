[//]: # (title: HTMX 整合)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>必備依賴</b>：`io.ktor:ktor-htmx`、`io.ktor:ktor-htmx-html`、
`io.ktor:ktor-server-htmx`
</p>
<var name="example_name" value="htmx-integration"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HTMX](https://htmx.org/) 是一個輕量級的 JavaScript 函式庫，它允許您透過 HTML 屬性啟用動態客戶端行為。它支援例如 AJAX、CSS 過渡效果、WebSockets 和 Server-Sent Events 等功能，而無需編寫 JavaScript。

Ktor 透過一組共用模組為 HTMX 提供了實驗性的一流支援，這些模組簡化了在伺服器和客戶端環境中的整合。這些模組提供了用於處理 HTMX 標頭、使用 Kotlin DSL 定義 HTML 屬性以及處理伺服器上 HTMX 特定路由邏輯的工具。

## 模組概覽

Ktor 對 HTMX 的支援可透過三個實驗性模組取得：

| 模組             | 說明                               |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定義和標頭常數                 |
| `ktor-htmx-html`   | 與 Kotlin HTML DSL 的整合          |
| `ktor-server-htmx` | 對 HTMX 特定請求的路由支援       |

所有 API 都標記為 `@ExperimentalKtorApi`，並且需要透過 `@OptIn(ExperimentalKtorApi::class)` 啟用。

## HTMX 標頭

您可以從核心 `ktor-htmx` 模組中使用預定義常數，以類型安全的方式存取或設定 HTMX 標頭。這些常數可幫助您在檢測 HTMX 行為（例如觸發器、歷史記錄還原或內容交換）時避免魔術字串。

### 請求標頭

使用 `HxRequestHeaders` 物件在您的應用程式中讀取或匹配 HTMX 請求標頭：

<deflist type="wide">
<def title="HxRequestHeaders.Request">對於 HTMX 請求始終為 `true`</def>
<def title="HxRequestHeaders.Target">目標元素的 ID</def>
<def title="HxRequestHeaders.Trigger">被觸發元素的 ID</def>
<def title="HxRequestHeaders.TriggerName">被觸發元素的名稱</def>
<def title="HxRequestHeaders.Boosted">指示透過 hx-boost 發出的請求</def>
<def title="HxRequestHeaders.CurrentUrl">當前瀏覽器 URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">用於歷史記錄還原</def>
<def title="HxRequestHeaders.Prompt">使用者對 hx-prompt 的回應</def>
</deflist>

### 回應標頭

您可以使用 `HxResponseHeaders` 物件存取 HTMX 回應標頭的常數：

<deflist type="wide">
<def title="HxResponseHeaders.Location">無需頁面重新載入的客戶端重新導向</def>
<def title="HxResponseHeaders.PushUrl">將 URL 推送到歷史堆疊</def>
<def title="HxResponseHeaders.Redirect">客戶端重新導向</def>
<def title="HxResponseHeaders.Refresh">強制完整頁面重新整理</def>
<def title="HxResponseHeaders.ReplaceUrl">替換當前 URL</def>
<def title="HxResponseHeaders.Reswap">控制回應的交換方式</def>
<def title="HxResponseHeaders.Retarget">更新內容更新的目標</def>
<def title="HxResponseHeaders.Reselect">選擇回應的一部分進行交換</def>
<def title="HxResponseHeaders.Trigger">觸發客戶端事件</def>
<def title="HxResponseHeaders.TriggerAfterSettle">在穩定後觸發事件</def>
<def title="HxResponseHeaders.TriggerAfterSwap">在交換後觸發事件</def>
</deflist>

## 交換模式

您可以從核心 `ktor-htmx` 模組中使用 `HxSwap` 物件來存取不同 HTMX 交換模式的常數。

<deflist type="medium">
<def title="HxSwap.innerHtml">替換內部 HTML (預設)</def>
<def title="HxSwap.outerHtml ">替換整個元素</def>
<def title="HxSwap.textContent">僅替換文字內容</def>
<def title="HxSwap.beforeBegin">在目標元素之前插入</def>
<def title="HxSwap.afterBegin">作為第一個子項插入</def>
<def title="HxSwap.beforeEnd">作為最後一個子項插入</def>
<def title="HxSwap.afterEnd">在目標元素之後插入</def>
<def title="HxSwap.delete">刪除目標元素</def>
<def title="HxSwap.none">不追加內容</def>
</deflist>

## HTML DSL 擴充功能

`ktor-htmx-html` 模組向 Kotlin 的 HTML DSL 添加了擴充函式，允許您直接將 HTMX 屬性添加到 HTML 元素：

```kotlin
@OptIn(ExperimentalKtorApi::class)
html {
    body {
        button {
            attributes.hx {
                get = "/data"
                target = "#result"
                swap = HxSwap.outerHtml
                trigger = "click"
            }
            +"Load Data"
        }
    }
}
```

上述範例會生成帶有 HTMX 屬性的 HTML：

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 伺服器端路由

`ktor-server-htmx` 模組透過 `hx` DSL 區塊提供了 HTMX 感知的路由：

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 常規路由 (HTMX 和非 HTMX 請求)
        get {
            call.respondText("Regular response")
        }
        
        // 僅匹配 HTMX 請求 (存在 HX-Request 標頭)
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 匹配具有特定目標的 HTMX 請求
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 匹配具有特定觸發器的 HTMX 請求
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

這些功能允許您的應用程式根據客戶端發送的 HTMX 標頭以不同方式回應。