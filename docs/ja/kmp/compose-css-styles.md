[//]: # (title: ビューポートの設定)
<show-structure for="none"/>

Compose Multiplatform for Webは、`ComposeViewport` 関数を使用してUIをHTMLキャンバス上にレンダリングします。
これはグローバルなCSSスタイルを注入しないため、アプリケーションをHTML構造にどのように統合するかを完全に制御できます。

コンテンツをブラウザウィンドウに正しく収めるには、ホストコンテナに対して明示的なCSSを適用してください。
CSSが指定されていない場合、キャンバスが正しくリサイズされなかったり、意図したスペースを埋められなかったりすることがあります。

以下は、コンテンツを画面全体に表示させるための標準的な `styles.css` の例です：

```css
html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
```

次に、Webソースセットの `main` 関数でエントリーポイントを初期化します：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "composeApp") {
        App()
    }
}
```

> 以前使用されていた `CanvasBasedWindow` は現在非推奨（deprecated）になっています。これは、キャンバスがブラウザウィンドウを埋めるように強制するために、ページのHTML要素にCSSスタイルを直接自動的に挿入していました。
> スタンドアロンアプリにとってはより単純でしたが、このアプローチでは既存のWebレイアウトにComposeを埋め込むことが困難でした。
> `ComposeViewport` は、標準的なCSSベースのレイアウト管理に依存する、より柔軟なアプローチです。

## 次のステップ

* [Web固有のリソースの処理方法](compose-web-resources.md)について学ぶ。
* [Kotlin/Wasm と Compose Multiplatform](https://kotlinlang.org/docs/wasm-get-started.html) について詳しく読む。