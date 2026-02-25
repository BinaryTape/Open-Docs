[//]: # (title: HTMX 整合)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:ktor-htmx</code>、<code>io.ktor:ktor-htmx-html</code>、
<code>io.ktor:ktor-server-htmx</code>
</p>
<var name="example_name" value="htmx-integration"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HTMX](https://htmx.org/) 是一個輕量級的 JavaScript 程式庫，可透過 HTML 屬性實現動態用戶端行為。它支援 AJAX、CSS 過渡、WebSockets 與伺服器傳送事件（Server-Sent Events），且無需撰寫 JavaScript。

Ktor 透過一組共享模組為 HTMX 提供實驗性的一等支援，簡化了伺服器與用戶端環境中的整合。這些模組提供了處理 HTMX 標頭、使用 Kotlin DSL 定義 HTML 屬性，以及在伺服器上處理 HTMX 特定路由邏輯的工具。

## 模組總覽

Ktor 的 HTMX 支援可在三個實驗性模組中使用：

| 模組 | 描述 |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定義與標頭常數 |
| `ktor-htmx-html`   | 與 Kotlin HTML DSL 整合 |
| `ktor-server-htmx` | HTMX 特定請求的路由支援 |

所有 API 均標記有 `@ExperimentalKtorApi`，且需要透過 `@OptIn(ExperimentalKtorApi::class)` 啟用。

## HTMX 標頭

您可以使用核心 `ktor-htmx` 模組中預定義的常數，以型別安全的方式存取或設定 HTMX 標頭。這些常數可協助您在偵測觸發器、歷程記錄還原或內容交換等 HTMX 行為時，避免使用魔術字串。

### 請求標頭

使用 `HxRequestHeaders` 物件在您的應用程式中讀取或比對 HTMX 請求標頭：

<deflist type="wide">
<def title="HxRequestHeaders.Request">對於 HTMX 請求始終為 <code>true</code></def>
<def title="HxRequestHeaders.Target">目標元素的 ID</def>
<def title="HxRequestHeaders.Trigger">觸發元素的 ID</def>
<def title="HxRequestHeaders.TriggerName">觸發元素的名稱</def>
<def title="HxRequestHeaders.Boosted">指示透過 hx-boost 發送的請求</def>
<def title="HxRequestHeaders.CurrentUrl">目前瀏覽器 URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">用於歷程記錄還原</def>
<def title="HxRequestHeaders.Prompt">使用者對 hx-prompt 的回應</def>
</deflist>

### 回應標頭

您可以使用 `HxResponseHeaders` 物件來存取 HTMX 回應標頭的常數：

<deflist type="wide">
<def title="HxResponseHeaders.Location">不重新載入頁面的用戶端重新導向</def>
<def title="HxResponseHeaders.PushUrl">將 URL 推送至歷程記錄堆疊</def>
<def title="HxResponseHeaders.Redirect">用戶端重新導向</def>
<def title="HxResponseHeaders.Refresh">強制全頁重新整理</def>
<def title="HxResponseHeaders.ReplaceUrl">取代目前 URL</def>
<def title="HxResponseHeaders.Reswap">控制回應的交換方式</def>
<def title="HxResponseHeaders.Retarget">更新內容更新的目標</def>
<def title="HxResponseHeaders.Reselect">選擇回應中要交換的部分</def>
<def title="HxResponseHeaders.Trigger">觸發用戶端事件</def>
<def title="HxResponseHeaders.TriggerAfterSettle">在安定（settle）後觸發事件</def>
<def title="HxResponseHeaders.TriggerAfterSwap">在交換（swap）後觸發事件</def>
</deflist>

## 交換模式

您可以使用核心 `ktor-htmx` 模組中的 `HxSwap` 物件來存取不同 HTMX 交換模式的常數。

<deflist type="medium">
<def title="HxSwap.innerHtml">取代內部 HTML（預設）</def>
<def title="HxSwap.outerHtml ">取代整個元素</def>
<def title="HxSwap.textContent">僅取代文字內容</def>
<def title="HxSwap.beforeBegin">插入至目標元素之前</def>
<def title="HxSwap.afterBegin">插入作為第一個子項目</def>
<def title="HxSwap.beforeEnd">插入作為最後一個子項目</def>
<def title="HxSwap.afterEnd">插入至目標元素之後</def>
<def title="HxSwap.delete">刪除目標元素</def>
<def title="HxSwap.none">不附加內容</def>
</deflist>

## HTML DSL 擴充

`ktor-htmx-html` 模組為 Kotlin 的 HTML DSL 增加了擴充函式，讓您可以直接將 HTMX 屬性新增至 HTML 元素：

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

上述範例會產生帶有 HTMX 屬性的 HTML：

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 伺服器端路由

`ktor-server-htmx` 模組透過 `hx` DSL 區塊提供感知 HTMX 的路由：

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 一般路由（HTMX 與非 HTMX 請求皆適用）
        get {
            call.respondText("Regular response")
        }
        
        // 僅比對 HTMX 請求（存在 HX-Request 標頭）
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 比對具有特定目標的 HTMX 請求
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 比對具有特定觸發器的 HTMX 請求
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

這些功能允許您的應用程式根據用戶端傳送的 HTMX 標頭做出不同的回應。