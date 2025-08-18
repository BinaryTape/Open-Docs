[//]: # (title: HTMX 整合)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:ktor-htmx</code>, <code>io.ktor:ktor-htmx-html</code>,
<code>io.ktor:ktor-server-htmx</code>
</p>
<var name="example_name" value="htmx-integration"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

[HTMX](https://htmx.org/) 是一個輕量級的 JavaScript 函式庫，它使用 HTML 屬性來啟用動態的客戶端行為。它支援諸如 AJAX、CSS 轉場、WebSockets 和伺服器傳送事件等功能——無需編寫 JavaScript。

Ktor 透過一組共用模組為 HTMX 提供了實驗性的、一流的支援，這些模組簡化了在伺服器和客戶端環境中的整合。這些模組提供了用於處理 HTMX 標頭、使用 Kotlin DSL 定義 HTML 屬性以及在伺服器上處理 HTMX 特定路由邏輯的工具。

## 模組概述

Ktor 的 HTMX 支援可在三個實驗性模組中使用：

| 模組             | 描述                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定義和標頭常數                      |
| `ktor-htmx-html`   | 與 Kotlin HTML DSL 的整合       |
| `ktor-server-htmx` | 支援 HTMX 特定請求的路由 |

所有 API 都標記有 `@ExperimentalKtorApi`，並需要透過 `@OptIn(ExperimentalKtorApi::class)` 選擇加入。

## HTMX 標頭

您可以使用核心 `ktor-htmx` 模組中預定義的常數，以型別安全的方式存取或設定 HTMX 標頭。這些常數可幫助您在偵測諸如觸發器、歷史記錄還原或內容交換等 HTMX 行為時，避免使用魔術字串。

### 請求標頭

使用 `HxRequestHeaders` 物件在您的應用程式中讀取或匹配 HTMX 請求標頭：

<deflist type="wide">
<def title="HxRequestHeaders.Request">HTMX 請求始終為 <code>true</code></def>
<def title="HxRequestHeaders.Target">目標元素的 ID</def>
<def title="HxRequestHeaders.Trigger">被觸發元素的 ID</def>
<def title="HxRequestHeaders.TriggerName">被觸發元素的名稱</def>
<def title="HxRequestHeaders.Boosted">透過 hx-boost 發出的請求</def>
<def title="HxRequestHeaders.CurrentUrl">當前瀏覽器 URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">用於歷史記錄還原</def>
<def title="HxRequestHeaders.Prompt">使用者對 hx-prompt 的回應</def>
</deflist>

### 回應標頭

您可以使用 `HxResponseHeaders` 物件來存取 HTMX 回應標頭的常數：

<deflist type="wide">
<def title="HxResponseHeaders.Location">無需頁面重新載入的客戶端重新導向</def>
<def title="HxResponseHeaders.PushUrl">將 URL 推送到歷史堆疊</def>
<def title="HxResponseHeaders.Redirect">客戶端重新導向</def>
<def title="HxResponseHeaders.Refresh">強制完整頁面重新整理</def>
<def title="HxResponseHeaders.ReplaceUrl">替換當前 URL</def>
<def title="HxResponseHeaders.Reswap">控制回應如何交換</def>
<def title="HxResponseHeaders.Retarget">更新內容更新的目標</def>
<def title="HxResponseHeaders.Reselect">選擇回應中要交換的部分</def>
<def title="HxResponseHeaders.Trigger">觸發客戶端事件</def>
<def title="HxResponseHeaders.TriggerAfterSettle">在穩定後觸發事件</def>
<def title="HxResponseHeaders.TriggerAfterSwap">在交換後觸發事件</def>
</deflist>

## 交換模式

您可以使用核心 `ktor-htmx` 模組中的 `HxSwap` 物件來存取不同 HTMX 交換模式的常數。

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

`ktor-htmx-html` 模組為 Kotlin 的 HTML DSL 增加了擴充功能，讓您可以直接將 HTMX 屬性添加到 HTML 元素中：

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

上述範例生成了帶有 HTMX 屬性的 HTML：

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 伺服器端路由

`ktor-server-htmx` 模組透過 `hx` DSL 區塊提供支援 HTMX 的路由：

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // Regular route (both HTMX and non-HTMX requests)
        get {
            call.respondText("Regular response")
        }
        
        // Only matches HTMX requests (HX-Request header is present)
        hx.get {
            call.respondText("HTMX response")
        }
        
        // Matches HTMX requests with specific target
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // Matches HTMX requests with specific trigger
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

這些功能允許您的應用程式根據客戶端傳送的 HTMX 標頭做出不同的回應。