[//]: # (title: HTTP 請求生命週期)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpRequestLifecycle"/>
<var name="example_name" value="server-http-request-lifecycle"/>

<tldr>
<p>
<b>必要相依性</b>：<code>io.ktor:ktor-server-core</code>
</p>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>支援的引擎</b>：<code>Netty</code>, <code>CIO</code>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不使用額外執行階段或虛擬機的情況下執行伺服器。">原生伺服器</Links> 支援</b>：✖️
</p>
</tldr>

預設情況下，即使用戶端斷開連線，Ktor 仍會繼續處理請求。
[`%plugin_name%`](https://api.ktor.io/ktor-http/io.ktor.http/-http-request-lifecycle.html)
外掛程式可讓您在用戶端斷開連線時立即取消請求處理。

這對於長時間執行或資源密集型的請求非常有用，因為當用戶端不再等待回應時，這些請求應該停止執行。

## 安裝與設定 %plugin_name% {id="install_plugin"}

要啟用 `HttpRequestLifecycle` 外掛程式，請在您的應用程式模組中使用 `install` 函式進行安裝，並設定 `cancelCallOnClose` 屬性：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.HttpRequestLifecycle

fun Application.module() {
    install(HttpRequestLifecycle) {
        cancelCallOnClose = true
    }
}
```

當 `cancelCallOnClose` 屬性啟用時，`%plugin_name%` 外掛程式會為每個請求安裝一個取消處理常式。當用戶端斷開連線時，只有處理該特定路由的協同程式會被取消。

取消會透過結構化並行進行傳遞，因此從請求協同程式啟動的所有子協同程式（例如：使用 `launch` 或 `async`）也會被取消。在下一個暫停點會拋出 `CancellationException`。

## 處理取消 {id="handle_cancellation"}

您可以捕捉 `CancellationException` 來執行清理作業，例如釋放資源或停止背景工作：

```kotlin
fun Application.module() {
    install(HttpRequestLifecycle) {
        cancelCallOnClose = true
    }

    routing {
        get("/long-process") {
            try {
                while (isActive) {
                    delay(10_000)
                    log.info("Very important work.")
                }
                call.respond("Completed")
            } catch (e: CancellationException) {
                log.info("Cleaning up resources.")
            }
        }
    }
}
```

> 協同程式取消是協作式的。阻塞或 CPU 密集型程式碼不會自動中斷。
> 如果請求處理執行長時間運行的工作，請呼叫
> `call.coroutineContext.ensureActive()` 以回應取消。
>
> 若要了解更多，請參閱
> [協同程式取消](https://kotlinlang.org/docs/cancellation-and-timeouts.html)。
{style="note"}

> 如需完整範例，請參閱 [%example_name%](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%)。

## 限制

此外掛程式僅在 `CIO` 和 `Netty` 引擎上受到完整支援。基於 servlet 的引擎（或其他不支援的引擎）無法可靠地偵測用戶端斷開連線。取消只能在伺服器嘗試寫入回應時被偵測到。