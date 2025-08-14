[//]: # (title: HTMX 集成)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>所需依赖项</b>：`io.ktor:ktor-htmx`、`io.ktor:ktor-htmx-html`、
`io.ktor:ktor-server-htmx`
</p>
<var name="example_name" value="htmx-integration"/>

    <p>
        <b>代码示例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HTMX](https://htmx.org/) 是一个轻量级 JavaScript 库，它通过 HTML 属性支持动态客户端行为。它支持 AJAX、CSS 过渡、WebSockets 和 Server-Sent Events 等特性，而无需编写 JavaScript。

Ktor 通过一组共享模块为 HTMX 提供了实验性的、一流的支持，这些模块简化了在服务器和客户端上下文中的集成。它们提供了处理 HTMX 头部、使用 Kotlin DSL 定义 HTML 属性以及在服务器上处理 HTMX 特有的路由逻辑的工具。

## 模块概览

Ktor 对 HTMX 的支持通过以下三个实验性模块提供：

| 模块             | 描述                                |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | 核心定义和头部常量      |
| `ktor-htmx-html`   | 与 Kotlin HTML DSL 的集成       |
| `ktor-server-htmx` | 对 HTMX 特定请求的路由支持 |

所有 API 都标记为 `@ExperimentalKtorApi`，并需要通过 `@OptIn(ExperimentalKtorApi::class)` 显式选择启用。

## HTMX 头部

你可以使用核心 `ktor-htmx` 模块中预定义的常量，以类型安全的方式访问或设置 HTMX 头部。这些常量可以帮助你在检测 HTMX 行为（例如触发器、历史恢复或内容交换）时避免使用硬编码字符串。

### 请求头部

使用 `HxRequestHeaders` 对象来读取或匹配应用程序中的 HTMX 请求头部：

<deflist type="wide">
<def title="HxRequestHeaders.Request">对于 HTMX 请求始终为 <code>true</code></def>
<def title="HxRequestHeaders.Target">目标元素的 ID</def>
<def title="HxRequestHeaders.Trigger">触发元素的 ID</def>
<def title="HxRequestHeaders.TriggerName">触发元素的名称</def>
<def title="HxRequestHeaders.Boosted">指示是否通过 hx-boost 发起请求</def>
<def title="HxRequestHeaders.CurrentUrl">当前浏览器 URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">用于历史恢复</def>
<def title="HxRequestHeaders.Prompt">用户对 hx-prompt 的响应</def>
</deflist>

### 响应头部

你可以使用 `HxResponseHeaders` 对象来访问 HTMX 响应头部的常量：

<deflist type="wide">
<def title="HxResponseHeaders.Location">客户端重定向，不重新加载页面</def>
<def title="HxResponseHeaders.PushUrl">将 URL 推入历史堆栈</def>
<def title="HxResponseHeaders.Redirect">客户端重定向</def>
<def title="HxResponseHeaders.Refresh">强制完全页面刷新</def>
<def title="HxResponseHeaders.ReplaceUrl">替换当前 URL</def>
<def title="HxResponseHeaders.Reswap">控制响应的交换方式</def>
<def title="HxResponseHeaders.Retarget">更新内容更新的目标</def>
<def title="HxResponseHeaders.Reselect">选择响应的哪一部分进行交换</def>
<def title="HxResponseHeaders.Trigger">触发客户端事件</def>
<def title="HxResponseHeaders.TriggerAfterSettle">在页面稳定后触发事件</def>
<def title="HxResponseHeaders.TriggerAfterSwap">在交换后触发事件</def>
</deflist>

## 交换模式

你可以使用核心 `ktor-htmx` 模块中的 `HxSwap` 对象来访问不同 HTMX 交换模式的常量。

<deflist type="medium">
<def title="HxSwap.innerHtml">替换内部 HTML（默认）</def>
<def title="HxSwap.outerHtml ">替换整个元素</def>
<def title="HxSwap.textContent">仅替换文本内容</def>
<def title="HxSwap.beforeBegin">在目标元素之前插入</def>
<def title="HxSwap.afterBegin">作为第一个子元素插入</def>
<def title="HxSwap.beforeEnd">作为最后一个子元素插入</def>
<def title="HxSwap.afterEnd">在目标元素之后插入</def>
<def title="HxSwap.delete">删除目标元素</def>
<def title="HxSwap.none">不追加内容</def>
</deflist>

## HTML DSL 扩展

`ktor-htmx-html` 模块为 Kotlin 的 HTML DSL 添加了扩展函数，允许你直接将 HTMX 属性添加到 HTML 元素：

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

上述示例将生成包含 HTMX 属性的 HTML：

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## 服务端路由

`ktor-server-htmx` 模块通过 `hx` DSL 代码块提供了 HTMX 感知的路由：

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 常规路由（HTMX 和非 HTMX 请求都匹配）
        get {
            call.respondText("Regular response")
        }
        
        // 仅匹配 HTMX 请求（存在 HX-Request 头部）
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 匹配具有特定目标的 HTMX 请求
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 匹配具有特定触发器的 HTMX 请求
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

这些特性允许你的应用程序根据客户端发送的 HTMX 头部信息做出不同响应。