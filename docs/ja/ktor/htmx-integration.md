[//]: # (title: HTMX の統合)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>

<tldr>
<p>
<b>必要とされる依存関係</b>: <code>io.ktor:ktor-htmx</code>, <code>io.ktor:ktor-htmx-html</code>,
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

[HTMX](https://htmx.org/) は、HTML 属性を使用して動的なクライアント側の動作を可能にする軽量な JavaScript ライブラリです。JavaScript を記述することなく、AJAX、CSS トランジション、WebSocket、Server-Sent Events などの機能をサポートします。

Ktor は、サーバーとクライアントの両方のコンテキストでの統合を簡素化する一連の共有モジュールを通じて、HTMX に対する実験的な第一級（first-class）のサポートを提供します。これらのモジュールは、HTMX ヘッダーの操作、Kotlin DSL を使用した HTML 属性の定義、サーバー上での HTMX 固有のルーティングロジックの処理のためのツールを提供します。

## モジュールの概要

Ktor の HTMX サポートは、以下の 3 つの実験的モジュールで利用可能です。

| モジュール | 説明 |
|--------------------|--------------------------------------------|
| `ktor-htmx`        | コアの定義とヘッダー定数 |
| `ktor-htmx-html`   | Kotlin HTML DSL との統合 |
| `ktor-server-htmx` | HTMX 固有のリクエストに対するルーティングのサポート |

すべての API は `@ExperimentalKtorApi` でマークされており、`@OptIn(ExperimentalKtorApi::class)` によるオプトインが必要です。

## HTMX ヘッダー

コアの `ktor-htmx` モジュールにある定義済みの定数を使用して、型安全な方法で HTMX ヘッダーにアクセスしたり、設定したりできます。これらの定数は、トリガー、履歴の復元、コンテンツのスワップなどの HTMX の動作を検出する際に、マジック文字列を避けるのに役立ちます。

### リクエストヘッダー

アプリケーションで HTMX リクエストヘッダーを読み取ったり、一致させたりするには、`HxRequestHeaders` オブジェクトを使用します。

<deflist type="wide">
<def title="HxRequestHeaders.Request">HTMX リクエストの場合は常に <code>true</code></def>
<def title="HxRequestHeaders.Target">ターゲット要素の ID</def>
<def title="HxRequestHeaders.Trigger">トリガーされた要素の ID</def>
<def title="HxRequestHeaders.TriggerName">トリガーされた要素の名前</def>
<def title="HxRequestHeaders.Boosted">hx-boost によるリクエストであることを示す</def>
<def title="HxRequestHeaders.CurrentUrl">現在のブラウザ URL</def>
<def title="HxRequestHeaders.HistoryRestoreRequest">履歴復元用</def>
<def title="HxRequestHeaders.Prompt">hx-prompt に対するユーザーのレスポンス</def>
</deflist>

### レスポンスヘッダー

`HxResponseHeaders` オブジェクトを使用して、HTMX レスポンスヘッダーの定数にアクセスできます。

<deflist type="wide">
<def title="HxResponseHeaders.Location">ページのリロードを伴わないクライアント側のリダイレクト</def>
<def title="HxResponseHeaders.PushUrl">履歴スタックに URL をプッシュする</def>
<def title="HxResponseHeaders.Redirect">クライアント側のリダイレクト</def>
<def title="HxResponseHeaders.Refresh">ページのフルリフレッシュを強制する</def>
<def title="HxResponseHeaders.ReplaceUrl">現在の URL を置換する</def>
<def title="HxResponseHeaders.Reswap">レスポンスのスワップ方法を制御する</def>
<def title="HxResponseHeaders.Retarget">コンテンツ更新のターゲットを更新する</def>
<def title="HxResponseHeaders.Reselect">スワップするレスポンスの一部を選択する</def>
<def title="HxResponseHeaders.Trigger">クライアント側のイベントをトリガーする</def>
<def title="HxResponseHeaders.TriggerAfterSettle">定着（settle）後にイベントをトリガーする</def>
<def title="HxResponseHeaders.TriggerAfterSwap">スワップ後にイベントをトリガーする</def>
</deflist>

## スワップモード

コアの `ktor-htmx` モジュールにある `HxSwap` オブジェクトを使用して、さまざまな HTMX スワップモードの定数にアクセスできます。

<deflist type="medium">
<def title="HxSwap.innerHtml">内部の HTML を置換する (デフォルト)</def>
<def title="HxSwap.outerHtml ">要素全体を置換する</def>
<def title="HxSwap.textContent">テキストコンテンツのみを置換する</def>
<def title="HxSwap.beforeBegin">ターゲット要素の前に挿入する</def>
<def title="HxSwap.afterBegin">最初の要素として挿入する</def>
<def title="HxSwap.beforeEnd">最後の要素として挿入する</def>
<def title="HxSwap.afterEnd">ターゲット要素の後に挿入する</def>
<def title="HxSwap.delete">ターゲット要素を削除する</def>
<def title="HxSwap.none">コンテンツを追加しない</def>
</deflist>

## HTML DSL 拡張

`ktor-htmx-html` モジュールは、Kotlin の HTML DSL に拡張関数を追加し、HTML 要素に HTMX 属性を直接追加できるようにします。

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

上記の例は、HTMX 属性を持つ HTML を生成します。

```html
<button hx-get="/api/data" hx-target="#result-div" hx-swap="outerHTML" hx-trigger="click">Load Data</button>
```

## サーバーサイドのルーティング

`ktor-server-htmx` モジュールは、`hx` DSL ブロックを介して HTMX を認識するルーティングを提供します。

```kotlin
@OptIn(ExperimentalKtorApi::class)
routing {
    route("api") {
        // 通常のルート (HTMX リクエストと非 HTMX リクエストの両方)
        get {
            call.respondText("Regular response")
        }
        
        // HTMX リクエストのみに一致 (HX-Request ヘッダーが存在する場合)
        hx.get {
            call.respondText("HTMX response")
        }
        
        // 特定のターゲットを持つ HTMX リクエストに一致
        hx {
            target("#result-div") {
                get {
                    call.respondText("Response for #result-div")
                }
            }
            
            // 特定のトリガーを持つ HTMX リクエストに一致
            trigger("#load-button") {
                get {
                    call.respondText("Response for #load-button clicks")
                }
            }
        }
    }
}
```

これらの機能により、クライアントから送信された HTMX ヘッダーに応じて、アプリケーションが異なるレスポンスを返すことができます。