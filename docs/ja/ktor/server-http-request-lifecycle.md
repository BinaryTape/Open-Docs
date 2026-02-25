[//]: # (title: HTTPリクエストのライフサイクル)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpRequestLifecycle"/>
<var name="example_name" value="server-http-request-lifecycle"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-core</code>
</p>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>サポートされているエンジン</b>: <code>Netty</code>, <code>CIO</code>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Nativeサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

デフォルトでは、Ktorはクライアントが切断された場合でもリクエストの処理を継続します。[`%plugin_name%`](https://api.ktor.io/ktor-http/io.ktor.http/-http-request-lifecycle.html)プラグインを使用すると、クライアントが切断されるとすぐにリクエスト処理をキャンセルできます。

これは、クライアントが応答を待たなくなったときに実行を停止すべき、長時間実行されるリクエストやリソースを大量に消費するリクエストに役立ちます。

## %plugin_name%のインストールと設定 {id="install_plugin"}

`HttpRequestLifecycle`プラグインを有効にするには、`install`関数を使用してアプリケーションモジュールにインストールし、`cancelCallOnClose`プロパティを設定します。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.http.HttpRequestLifecycle

fun Application.module() {
    install(HttpRequestLifecycle) {
        cancelCallOnClose = true
    }
}
```

`cancelCallOnClose`プロパティが有効になると、`%plugin_name%`プラグインはリクエストごとにキャンセルハンドラーをインストールします。クライアントが切断されると、その特定のルートを処理しているコルーチンのみがキャンセルされます。

キャンセルは構造化された並行性（structured concurrency）を通じて伝播するため、リクエストコルーチンから開始されたすべての子コルーチン（たとえば、`launch`や`async`を使用したもの）もキャンセルされます。次のサスペンションポイント（中断点）で`CancellationException`がスローされます。

## キャンセルの処理 {id="handle_cancellation"}

`CancellationException`をキャッチして、リソースの解放やバックグラウンド作業の停止などのクリーンアップ操作を実行できます。

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

> コルーチンのキャンセルは協調的（cooperative）です。ブロッキングコードやCPU負荷の高いコードは自動的には中断されません。リクエスト処理で長時間実行される作業を行う場合は、`call.coroutineContext.ensureActive()`を呼び出してキャンセルに対応してください。
>
> 詳細については、[コルーチンのキャンセル](https://kotlinlang.org/docs/cancellation-and-timeouts.html)を参照してください。
{style="note"}

> 完全な例については、[%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)を参照してください。

## 制限事項

このプラグインは、`CIO`および`Netty`エンジンでのみ完全にサポートされています。サーブレットベースのエンジン（またはその他のサポートされていないエンジン）では、クライアントの切断を確実に検出できません。キャンセルは、サーバーがレスポンスを書き込もうとしたときにのみ検出されます。