[//]: # (title: Webリソースの取り扱い)

ここでは、ブラウザ機能や `preload` API を使用したリソースのプリロード、および Web リソースのキャッシュに関する情報について説明します。

## Web ターゲット向けリソースのプリロード

フォントや画像などの Web リソースは、[Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) を使用して非同期に読み込まれます。
初回の読み込み時やネットワーク接続が遅い場合、リソースの取得によって [FOUT](https://fonts.google.com/knowledge/glossary/fout)（読み込み前の代替フォントによるちらつき）が発生したり、画像の代わりにプレースホルダーが表示されたりするなど、視覚的な不具合が生じることがあります。

この問題の典型的な例は、`Text()` コンポーネントにカスタムフォントのテキストが含まれているものの、必要なグリフを含むフォントがまだ読み込み中の場合です。この場合、ユーザーには一時的にデフォルトのフォントでテキストが表示されたり、文字の代わりに空のボックスや疑問符が表示されたりすることがあります。同様に、画像やドローアブルの場合も、リソースが完全に読み込まれるまで、空白や黒いボックスなどのプレースホルダーが表示されることがあります。

視覚的な不具合を防ぐために、ブラウザに組み込まれたリソースのプリロード機能、Compose Multiplatform のプリロード API、またはその両方の組み合わせを使用できます。

### ブラウザ機能を使用したリソースのプリロード

モダンなブラウザでは、`<link>` タグに [`rel="preload"` 属性](https://developer.mozilla.org/ja/docs/Web/HTML/Attributes/rel/preload) を指定することでリソースをプリロードできます。
この属性は、アプリケーションが開始される前にフォントや画像などのリソースのダウンロードとキャッシュを優先的に行うようブラウザに指示し、これらのリソースを早期に利用可能にします。

例えば、ブラウザ内でのフォントのプリロードを有効にするには、以下の手順に従います：

1. アプリケーションの Web 配布物をビルドします：

```console
   ./gradlew :shared:wasmJsBrowserDistribution
```

2. 生成された `dist` ディレクトリから必要なリソースを見つけ、そのパスを保存します。
3. `wasmJsMain/resources/index.html` ファイルを開き、`<head>` 要素内に `<link>` タグを追加します。
4. `href` 属性にリソースのパスを設定します：

```html
<link rel="preload" href="./composeResources/username.shared.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### Compose Multiplatform プリロード API を使用したリソースのプリロード
<primary-label ref="Experimental"/>

ブラウザでリソースをプリロードした場合でも、それらは生のバイトデータとしてキャッシュされており、`FontResource` や `DrawableResource` などのレンダリングに適した形式に変換する必要があります。アプリケーションが初めてリソースを要求したときにこの変換が非同期で行われるため、再びちらつきが発生する可能性があります。ユーザー体験をさらに最適化するために、Compose Multiplatform リソースには、より高レベルな表現のリソースのための独自の内部キャッシュがあり、これもプリロードすることが可能です。

Compose Multiplatform 1.8.0 では、Web ターゲットでフォントおよび画像リソースをプリロードするための実験的な API である `preloadFont()`、`preloadImageBitmap()`、および `preloadImageVector()` が導入されました。

さらに、絵文字などの特殊な文字が必要な場合に、デフォルトのバンドルオプションとは異なるフォールバックフォントを設定できます。フォールバックフォントを指定するには、`FontFamily.Resolver.preload()` メソッドを使用します。

以下の例は、プリロードとフォールバックフォントの使用方法を示しています：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFontFamilyResolver
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.window.ComposeViewport
import components.resources.demo.shared.generated.resources.*
import components.resources.demo.shared.generated.resources.NotoColorEmoji
import components.resources.demo.shared.generated.resources.Res
import components.resources.demo.shared.generated.resources.Workbench_Regular
import components.resources.demo.shared.generated.resources.font_awesome
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.configureWebResources
import org.jetbrains.compose.resources.demo.shared.UseResources
import org.jetbrains.compose.resources.preloadFont

@OptIn(ExperimentalComposeUiApi::class, ExperimentalResourceApi::class, InternalComposeUiApi::class)
fun main() {
    configureWebResources {
        // リソースの場所を上書きします
        resourcePathMapping { path -> "./$path" }
    }
    ComposeViewport(viewportContainerId = "composeApplication") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // アプリのコンテンツにプリロードされたリソースを使用します
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // 読み込み中に FOUT が発生したり、アプリが一時的に動作しなくなったりすることに対応するため、プログレスインジケーターを表示します
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // バンドルされたフォントでサポートされていない不足しているグリフをレンダリングするために、絵文字を含むフォールバックフォントをプリロードします
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## Web リソースのキャッシュ
<primary-label ref="Experimental"/>

Compose Multiplatform は [Web Cache API](https://developer.mozilla.org/ja/docs/Web/API/Cache) を使用して、成功したレスポンスをキャッシュし、ブラウザのデフォルトのキャッシュメカニズムによって通常実行される冗長な HTTP 再検証を回避します。

キャッシュは、アプリの起動およびページの更新ごとにグローバルにクリアされます。
この段階でキャッシュをリセットすることで、リソースの整合性が確保されます。
複数のセッションにわたってキャッシュを再利用すると、古くなったリソースや互換性のないリソースが原因で、アプリケーションのクラッシュや論理的な不整合が発生する可能性があるためです。

同じリソースに対する冗長な同時フェッチを防ぐために、実装ではリソース固有のロックを使用しています。
各リクエストはリソースごとのミューテックス（mutex）によって保護されており、異なるリソースへの並列リクエストを許可しつつ、同じパスへの重複リクエストをシリアル化します。
この設計により、不要なネットワークトラフィックが最小限に抑えられ、キャッシュへの格納中のレースコンディションが排除されます。

## 次のステップ

* [リソースのセットアップ](compose-multiplatform-resources-setup.md)および[アプリでの使用方法](compose-multiplatform-resources-usage.md)について詳しく読む。
* アプリ内のテーマや言語などのアプリケーションの[リソース環境](compose-resource-environment.md)を管理する方法を学ぶ。