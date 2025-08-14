[//]: # (title: HTMX連携)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-htmx</code>, <code>io.ktor:ktor-htmx-html</code>,
<code>io.ktor:ktor-server-htmx</code>
</p>
<var name="example_name" value="htmx-integration"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[HTMX](https://htmx.org/)は、HTML属性を使用して動的なクライアントサイドの動作を可能にする軽量なJavaScriptライブラリです。JavaScriptを記述することなく、AJAX、CSSトランジション、WebSocket、Server-Sent Eventsなどの機能に対応しています。

Ktorは、HTMXに対する実験的なファーストクラスのサポートを、サーバーとクライアントの両方のコンテキストでの統合を簡素化する一連の共有モジュールを介して提供します。これらのモジュールは、HTMXヘッダーの操作、Kotlin DSLを使用したHTML属性の定義、サーバー上でのHTMX固有のルーティングロジックの処理のためのツールを提供します。

## モジュールの概要

KtorのHTMXサポートは、以下の3つの実験的モジュールで利用できます。

| モジュール             | 説明                                    |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | コアの定義とヘッダー定数                     |
| `ktor-htmx-html`   | Kotlin HTML DSLとの統合                  |
| `ktor-server-htmx` | HTMX固有のリクエストに対するルーティングサポート |

すべてのAPIは`@ExperimentalKtorApi`としてマークされており、`@OptIn(ExperimentalKtorApi::class)`を介したオプトインが必要です。

## HTMXヘッダー

コアの`ktor-htmx`モジュールから事前定義された定数を使用して、型安全な方法でHTMXヘッダーにアクセスしたり設定したりできます。これらの定数を使用すると、トリガー、履歴復元、コンテンツスワッピングなどのHTMXの動作を検出する際に、マジックストリングを使用することを避けられます。

### リクエストヘッダー

`HxRequestHeaders`オブジェクトを使用して、アプリケーション内のHTMXリクエストヘッダーを読み取ったり、照合したりできます。

<deflist type="wide">
<def title="HxRequestHeaders.Request">HTMXリクエストの場合、常に<code>true</code></def>
<def title="HxRequestHeaders.Target">ターゲット要素のID</def>
<def title="HxRequestHeaders.Trigger">トリガーされた要素のID</def>
<def title="HxRequestHeaders.TriggerName">トリガーされた要素の名前</def>
<def title="HxRequestHeaders.Boosted"><code>hx-boost</code>を介したリクエストを示す</def>
<def title="HxRequestHeaders.CurrentUrl">現在のブラウザのURL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">履歴復元用</def>
<def title="HxRequestHeaders.Prompt"><code>hx-prompt</code>に対するユーザーの応答</def>
</deflist>

### レスポンスヘッダー

`HxResponseHeaders`オブジェクトを使用して、HTMXレスポンスヘッダーの定数にアクセスできます。

<deflist type="wide">
<def title="HxResponseHeaders.Location">ページを再読み込みせずにクライアントサイドでリダイレクト</def>
<def title="HxResponseHeaders.PushUrl">URLを履歴スタックにプッシュ</def>
<def title="HxResponseHeaders.Redirect">クライアントサイドのリダイレクト</def>
<def title="HxResponseHeaders.Refresh">フルページのリフレッシュを強制</def>
<def title="HxResponseHeaders.ReplaceUrl">現在のURLを置き換える</def>
<def title="HxResponseHeaders.Reswap">レスポンスの交換方法を制御</def>
<def title="HxResponseHeaders.Retarget">コンテンツ更新のターゲットを更新</def>
<def title="HxResponseHeaders.Reselect">交換するレスポンスの一部を選択</def>
<def title="HxResponseHeaders.Trigger">クライアントサイドのイベントをトリガー</def>
<def title="HxResponseHeaders.TriggerAfterSettle">settle後にイベントをトリガー</def>
<def title="HxResponseHeaders.TriggerAfterSwap">swap後にイベントをトリガー</def>
</deflist>

## スワップモード

コアの`ktor-htmx`モジュールから`HxSwap`オブジェクトを使用して、異なるHTMXスワップモードの定数にアクセスできます。

<deflist type="medium">
<def title="HxSwap.innerHtml">内部HTMLを置換（デフォルト）</def>
<def title="HxSwap.outerHtml ">要素全体を置換</def>
<def title="HxSwap.textContent">テキストコンテンツのみを置換</def>
<def title="HxSwap.beforeBegin">ターゲット要素の前に挿入</def>
<def title="HxSwap.afterBegin">最初の子要素として挿入</def>
<def title="HxSwap.beforeEnd">最後の子要素として挿入</def>
<def title="HxSwap.afterEnd">ターゲット要素の後に挿入</def>
<def title="HxSwap.delete">ターゲット要素を削除</def>
<def title="HxSwap.none">コンテンツの追加なし</def>
</deflist>

## HTML DSL拡張

`ktor-htmx-html`モジュールはKotlinのHTML DSLに拡張関数を追加し、HTMX属性をHTML要素に直接追加できるようにします。

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

上記の例では、HTMX属性を持つHTMLが生成されます。

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## サーバーサイドルーティング

`ktor-server-htmx`モジュールは、`hx` DSLブロックを介してHTMX対応のルーティングを提供します。

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 通常のルート（HTMXおよび非HTMXリクエストの両方）
        get {
            call.respondText("Regular response")
        }
        
        // HTMXリクエストのみにマッチ（HX-Requestヘッダーが存在する場合）
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 特定のターゲットを持つHTMXリクエストにマッチ
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 特定のトリガーを持つHTMXリクエストにマッチ
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

これらの機能により、アプリケーションはクライアントから送信されたHTMXヘッダーに応じて異なる応答を返すことができます。