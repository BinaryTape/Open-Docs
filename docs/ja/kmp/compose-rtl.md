# RTL言語での作業

Compose Multiplatform は、アラビア語、ヘブライ語、ペルシャ語などの右から左へ記述する言語（RTL言語）をサポートしています。
フレームワークは、RTL言語が使用される際に、システムのロケール設定に基づいてほとんどのRTL要件を自動的に処理し、レイアウト、配置、およびテキスト入力の動作を調整します。

## レイアウトのミラーリング

システムのロケールがRTL言語に設定されている場合、Compose Multiplatform はほとんどのUIコンポーネントを自動的にミラーリングします。
調整には、パディング、配置、およびコンポーネントの位置の変更が含まれます。

*   **パディング、マージン、配置**  
    デフォルトのパディングと配置は反転します。例えば、`Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)` の場合、
    LTR（左から右）では `start` パディングが左側に対応し、`end` パディングが右側に対応しますが、
    RTL言語では `start` が右側、`end` が左側に対応します。

*   **コンポーネントの配置**  
    テキスト、ナビゲーションアイテム、アイコンなどのUI要素の場合、デフォルトの `Start` 配置はRTLモードでは `End` になります。

*   **水平スクロール可能なリスト**  
    水平リストは、アイテムの配置とスクロール方向を反転させます。

*   **ボタンの位置決め**  
    **キャンセル**や**確認**ボタンの位置など、一般的なUIパターンはRTLの期待に合わせて調整されます。

## レイアウト方向の指定

レイアウトの方向に関わらず、ロゴやアイコンなど一部のUI要素の元の向きを保持する必要がある場合があります。
アプリ全体または個々のコンポーネントに対してレイアウト方向を明示的に設定することで、システムのデフォルトのロケールベースのレイアウト動作をオーバーライドできます。

要素を自動ミラーリングから除外し、特定の向きを強制するには、`LayoutDirection.Rtl` または `LayoutDirection.Ltr` を使用します。
スコープ内でレイアウト方向を指定するには、`CompositionLocalProvider()` を使用します。これにより、レイアウト方向がコンポジション内のすべての子コンポーネントに適用されます。

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // Components in this block will be laid out left-to-right
        Text("LTR Latin")
        TextField("Hello world
Hello world")
    }
}
```

## RTLレイアウトでのテキスト入力の処理

Compose Multiplatform は、RTLレイアウトでのテキスト入力のさまざまなシナリオ（混在する方向のコンテンツ、特殊文字、数字、絵文字など）をサポートしています。 

RTLレイアウトをサポートするアプリケーションを設計する際には、以下の点を考慮してください。これらをテストすることで、潜在的なローカライズの問題を特定するのに役立ちます。

### カーソルの動作

カーソルはRTLレイアウト内で直感的に動作し、文字の論理的な方向と一致する必要があります。例えば：

*   アラビア語で入力する場合、カーソルは右から左に移動しますが、LTRコンテンツを挿入する場合は左から右の動作に従います。
*   テキストの選択、削除、挿入などの操作は、テキストの自然な方向の流れを尊重します。

### 双方向テキスト (BiDi Text)

Compose Multiplatform は、句読点や数字を配置しながら、双方向（BiDi）テキストを管理およびレンダリングするために、[Unicode 双方向アルゴリズム](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics)を使用します。

テキストは期待される視覚的な順序で表示されるべきです。句読点や数字は正しく配置され、アラビア文字は右から左へ、英語は左から右へ流れます。

以下のテストサンプルには、ラテン文字とアラビア文字、およびそれらの双方向の組み合わせが含まれています。

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

// Arabic text for "Hello World"
private val helloWorldArabic = "مرحبا بالعالم"

// Bidirectional text
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

// Wrap function for BasicTextField() to reduce code duplication
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

Compose Multiplatform はまた、複数行の折り返しやBiDiコンテンツのネストを含む複雑なBiDiケースにおいて、適切な配置と間隔を保証します。

### 数字と絵文字

数字は、周囲のテキストの方向に基づいて一貫して表示されるべきです。
東アラビア数字はRTLテキスト内で自然に配置され、西洋アラビア数字は一般的なLTRの動作に従います。

絵文字はRTLとLTRの両方のコンテキストに適応し、テキスト内で適切な配置と間隔を維持する必要があります。

以下のテストサンプルには、絵文字、東アラビア数字と西洋アラビア数字、および双方向テキストが含まれています。

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

// Arabic text for "Hello World" with emojis
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// Bidirectional text with numbers and emojis
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

// Wrap function for BasicTextField() to reduce code duplication
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

## Webターゲット用のフォント

Webターゲットには、アラビア語や中国語などの特定のロケールの文字をレンダリングするための組み込みフォントがありません。
これに対処するには、カスタムのフォールバックフォントをリソースに追加してプリロードする必要があります。これらは自動的に有効にはなりません。

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

Webターゲットのリソースのプリロードに関する詳細は、[preload API](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)に関するセクションを参照してください。

## RTLレイアウトにおけるアクセシビリティ

Compose Multiplatform は、スクリーンリーダーのための適切なテキスト方向と順序、およびジェスチャーの処理を含む、RTLレイアウトのアクセシビリティ機能をサポートしています。

### スクリーンリーダー

スクリーンリーダーはRTLレイアウトに自動的に適応し、ユーザーのために論理的な読み上げ順序を維持します。

*   RTLテキストは右から左に読み上げられ、混在する方向のテキストは標準のBiDiルールに従います。
*   句読点と数字は正しい順序で読み上げられます。

複雑なレイアウトでは、スクリーンリーダーの正しい読み上げ順序を確保するために、トラバーサルセマンティクスを定義する必要があります。

### フォーカスベースのナビゲーション

RTLレイアウトでのフォーカスナビゲーションは、レイアウトのミラーリングされた構造に従います。

*   フォーカスは、RTLコンテンツの自然な流れに従って、右から左、上から下へと移動します。
*   スワイプやタップなどのジェスチャーは、ミラーリングされたレイアウトに自動的に調整されます。

また、スワイプアップまたはスワイプダウンのアクセシビリティジェスチャーによって、異なるトラバーサルグループ間での正しいナビゲーションを確実にするために、トラバーサルセマンティクスを定義することもできます。

トラバーサルセマンティクスの定義方法およびトラバーサルインデックスの設定に関する詳細は、[アクセシビリティ](compose-accessibility.md#traversal-order)セクションを参照してください。

## 既知の問題

RTL言語のサポートを継続的に改善しており、以下の既知の問題に対処する予定です。

*   RTLレイアウトで非RTL文字を入力する際のキャレット位置の修正 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
*   アラビア数字のキャレット位置の修正 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
*   `TextDirection.Content` の修正 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))