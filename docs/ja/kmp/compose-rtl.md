# RTL 言語への対応

Compose Multiplatform は、アラビア語、ヘブライ語、ペルシャ語などの右から左（RTL: Right-to-Left）に記述する言語をサポートしています。
フレームワークは、RTL 言語が使用されている場合、システムのロケール設定に従って、ほとんどの RTL 要件を自動的に処理し、レイアウト、アライメント、およびテキスト入力の動作を調整します。

## レイアウトのミラーリング

システムロケールが RTL 言語に設定されている場合、Compose Multiplatform はほとんどの UI コンポーネントを自動的にミラーリング（反転）します。
調整には、パディング、アライメント、およびコンポーネントの位置の変更が含まれます。

* **パディング、マージン、およびアライメント**  
   デフォルトのパディングとアライメントが反転します。例えば、`Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` では、
   LTR（左から右）の場合、`start` パディングは左側、`end` パディングは右側に対応しますが、
   RTL 言語では、`start` は右側、`end` は左側に対応します。

* **コンポーネントのアライメント**  
   テキスト、ナビゲーション項目、アイコンなどの UI 要素において、RTL モードではデフォルトの `Start` アライメントが `End` になります。

* **横方向にスクロール可能なリスト**  
   水平方向のリストは、項目の配置とスクロール方向が反転します。

* **ボタンの配置**  
   **キャンセル**ボタンと**確定**ボタンの位置など、一般的な UI パターンは RTL の慣習に合わせて調整されます。

## レイアウト方向の強制

レイアウト方向に関係なく、ロゴやアイコンなど、一部の UI 要素の元の向きを維持する必要がある場合があります。
アプリ全体または個々のコンポーネントに対してレイアウト方向を明示的に設定し、システムのデフォルトのロケールに基づくレイアウト動作をオーバーライドできます。

要素を自動ミラーリングから除外し、特定の向きを強制するには、`LayoutDirection.Rtl` または `LayoutDirection.Ltr` を使用します。
スコープ内でレイアウト方向を指定するには、`CompositionLocalProvider()` を使用します。これにより、コンポジション内のすべての下位コンポーネントにそのレイアウト方向が適用されるようになります。

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // このブロック内のコンポーネントは左から右（LTR）にレイアウトされます
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## RTL レイアウトでのテキスト入力の処理

Compose Multiplatform は、方向が混在したコンテンツ、特殊文字、数字、絵文字など、RTL レイアウトにおけるテキスト入力のさまざまなシナリオをサポートしています。

RTL レイアウトをサポートするアプリケーションを設計する際は、以下の点に注意してください。これらをテストすることで、潜在的なローカライズの問題を特定するのに役立ちます。

### カーソルの挙動

カーソルは RTL レイアウト内で直感的に動作し、文字の論理的な方向に合わせる必要があります。例：

* アラビア語で入力する場合、カーソルは右から左に移動しますが、LTR コンテンツを挿入する場合は左から右の動作に従います。
* テキストの選択、削除、挿入などの操作は、テキストの自然な方向の流れを尊重します。

### 双方向（BiDi）テキスト

Compose Multiplatform は [Unicode 双方向アルゴリズム (Unicode Bidirectional Algorithm)](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics) を使用して、双方向（BiDi）テキストを管理およびレンダリングし、句読点や数字を整列させます。

テキストは期待される視覚的順序で表示される必要があります。句読点と数字が正しく整列され、アラビア文字は右から左へ、英語は左から右へと流れます。

以下のテストサンプルには、ラテン文字とアラビア文字、およびそれらの双方向の組み合わせを含むテキストが含まれています。

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview

// アラビア語の「Hello World」
private val helloWorldArabic = "مرحبا بالعالم"

// 双方向テキスト
private val bidiText = "Hello $helloWorldArabic world"

@Composable
@Preview
fun App() {
    MaterialTheme {
        LazyColumn(
            Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Latin and BiDi in LTR")
                        TextField("Hello world")
                        TextField(bidiText)
                    }
                }
            }
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Text("Arabic and BiDi in RTL")
                        TextField(helloWorldArabic)
                        TextField(bidiText)
                    }
                }
            }
        }
    }
}

// コードの重複を減らすための BasicTextField() のラップ関数
@Composable
internal fun TextField(
    text: String = ""
) {
    val state = rememberSaveable { mutableStateOf(text) }

    BasicTextField(
        modifier = Modifier
            .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
            .padding(8.dp),
        value = state.value,
        singleLine = false,
        onValueChange = { state.value = it },
    )
}
```
{default-state="collapsed" collapsible="true" collapsed-title="item { CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {"}

<img src="compose-rtl-bidi.png" alt="BiDi text" width="600"/>

Compose Multiplatform は、複数行の折り返しや BiDi コンテンツのネストなど、複雑な BiDi ケースにおいても適切なアライメントと間隔を保証します。

### 数字と絵文字

数字は、周囲のテキストの方向に基づいて一貫して表示される必要があります。
東アラビア数字（インド数字）は RTL テキスト内で自然に整列し、西アラビア数字は標準的な LTR の挙動に従います。

絵文字は RTL と LTR の両方のコンテキストに適応し、テキスト内での適切なアライメントと間隔を維持する必要があります。

以下のテストサンプルには、絵文字、東アラビア数字と西アラビア数字、および双方向テキストが含まれています。

```kotlin
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.ui.tooling.preview.Preview

// 絵文字を含むアラビア語の「Hello World」
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 数字と絵文字を含む双方向テキスト
private val bidiText = "67890 Hello $helloWorldArabic 🎉"

@Composable
@Preview
fun App() {
    MaterialTheme {
        LazyColumn(
            Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        TextField("Hello world 👋🌎")
                        TextField("Numbers: 🔢12345")
                        TextField(bidiText)
                    }
                }
            }
            item {
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        TextField(helloWorldArabic)
                        TextField("الأرقام: 🔢١٢٣٤٥")
                        TextField(bidiText)
                    }
                }
            }
        }
    }
}

// コードの重複を減らすための BasicTextField() のラップ関数
@Composable
internal fun TextField(
    text: String = ""
) {
    val state = rememberSaveable { mutableStateOf(text) }

    BasicTextField(
        modifier = Modifier
            .border(1.dp, Color.LightGray, RoundedCornerShape(8.dp))
            .padding(8.dp),
        value = state.value,
        singleLine = false,
        onValueChange = { state.value = it },
    )
}
```
{default-state="collapsed" collapsible="true" collapsed-title="item { CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {"}

<img src="compose-rtl-emoji.png" alt="Numbers and emojis" width="600"/>

## Web ターゲットのフォント

Web ターゲットには、アラビア語や中国語などの特定のロケールの文字をレンダリングするための組み込みフォントがありません。これを解決するには、カスタムのフォールバックフォントをリソースに追加し、それらをプリロードする必要があります。これらは自動的には有効になりません。

フォールバックフォントをプリロードするには、`FontFamily.Resolver.preload()` メソッドを使用します。例：

```kotlin
val fontFamilyResolver = LocalFontFamilyResolver.current
val fontsLoaded = remember { mutableStateOf(false) }

if (fontsLoaded.value) {
   app.Content()
}

LaunchedEffect(Unit) {
   val notoEmojisBytes = loadEmojisFontAsBytes()
   val fontFamily = FontFamily(listOf(Font("NotoColorEmoji", notoEmojisBytes)))
   fontFamilyResolver.preload(fontFamily)
   fontsLoaded.value = true
}
```

Web ターゲットのリソースのプリロードに関する詳細は、[プリロード API](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api) のセクションを参照してください。

## RTL レイアウトのアクセシビリティ

Compose Multiplatform は、スクリーンリーダー向けの適切なテキスト方向と順序、およびジェスチャの処理を含む、RTL レイアウトのアクセシビリティ機能をサポートしています。

### スクリーンリーダー

スクリーンリーダーは自動的に RTL レイアウトに適応し、ユーザーにとって論理的な読書順序を維持します。

* RTL テキストは右から左に読み上げられ、方向が混在したテキストは標準の BiDi ルールに従います。
* 句読点と数字は正しいシーケンスで読み上げられます。

複雑なレイアウトでは、スクリーンリーダーに対して正しい読書順序を保証するために、トラバーサル セマンティクスを定義する必要があります。

### フォーカスベースのナビゲーション

RTL レイアウトでのフォーカスナビゲーションは、ミラーリングされたレイアウト構造に従います。

* フォーカスは RTL コンテンツの自然な流れに従い、右から左、上から下へと移動します。
* スワイプやタップなどのジェスチャは、ミラーリングされたレイアウトに合わせて自動的に調整されます。

また、上スワイプや下スワイプのアクセシビリティジェスチャを使用して、異なるトラバーサルグループ間での正しいナビゲーションを保証するために、トラバーサル セマンティクスを定義することもできます。

トラバーサル セマンティクスの定義方法およびトラバーサル インデックスの設定方法の詳細については、[アクセシビリティ](compose-accessibility.md#traversal-order) セクションを参照してください。

## 既知の問題

RTL 言語のサポートは継続的に改善されており、以下の既知の問題に対処する予定です。

* RTL レイアウトで非 RTL 文字を入力中のキャレット位置の修正 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
* アラビア数字のキャレット位置の修正 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
* `TextDirection.Content` の修正 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))