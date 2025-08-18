# RTL言語の取り扱い

Compose Multiplatformは、アラビア語、ヘブライ語、ペルシャ語などの右から左へ記述する（RTL）言語をサポートしています。
このフレームワークは、RTL言語が使用される際に、システムのロケール設定に従って、ほとんどのRTL要件を自動的に処理し、レイアウト、配置、テキスト入力の動作を調整します。

## レイアウトのミラーリング

システムのロケールがRTL言語に設定されている場合、Compose MultiplatformはほとんどのUIコンポーネントを自動的にミラーリングします。
調整には、パディング、配置、コンポーネントの位置の変更が含まれます。

* **パディング、マージン、配置**  
  デフォルトのパディングと配置は反転します。例えば、`Modifier.padding(start: Dp, top: Dp, end: Dp, bottom: Dp)`では、
  LTRの`start`パディングは左側に、`end`パディングは右側に対応します。
  一方、RTL言語では、`start`は右側に、`end`は左側に対応します。

* **コンポーネントの配置**  
  テキスト、ナビゲーションアイテム、アイコンなどのUI要素では、デフォルトの`Start`配置はRTLモードでは`End`になります。

* **水平スクロール可能なリスト**  
  水平リストは、項目の配置とスクロール方向が反転します。

* **ボタンの配置**  
  **Cancel**ボタンと**Confirm**ボタンの位置など、一般的なUIパターンはRTLの慣習に合わせて調整されます。

## レイアウト方向の強制

ロゴやアイコンなど一部のUI要素では、レイアウト方向に関係なく、元の向きを維持する必要がある場合があります。
アプリ全体または個々のコンポーネントに対してレイアウト方向を明示的に設定し、
システムのデフォルトのロケールベースのレイアウト動作をオーバーライドできます。

要素を自動ミラーリングから除外し、特定の向きを強制するには、
`LayoutDirection.Rtl`または`LayoutDirection.Ltr`を使用できます。
スコープ内でレイアウト方向を指定するには`CompositionLocalProvider()`を使用します。これにより、レイアウト方向が
コンポジション内のすべての子コンポーネントに適用されることが保証されます。

```kotlin
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
    Column(modifier = Modifier.fillMaxWidth()) {
        // このブロック内のコンポーネントは左から右へレイアウトされます
        Text("LTR Latin")
        TextField("Hello world\nHello world")
    }
}
```

## RTLレイアウトにおけるテキスト入力の処理

Compose Multiplatformは、RTLレイアウトにおける様々なテキスト入力シナリオをサポートしており、
これには混合方向のコンテンツ、特殊文字、数字、絵文字などが含まれます。

RTLレイアウトをサポートするアプリケーションを設計する際には、以下の点を考慮してください。
これらをテストすることで、潜在的なローカリゼーションの問題を特定するのに役立ちます。

### カーソルの動作

カーソルはRTLレイアウト内で直感的に動作し、文字の論理的な方向と一致する必要があります。例：

* アラビア語を入力する際、カーソルは右から左に移動しますが、LTRコンテンツを挿入する場合は左から右への動作に従います。
* テキストの選択、削除、挿入などの操作は、テキストの自然な方向の流れを尊重します。

### 双方向テキスト

Compose Multiplatformは、[Unicode Bidirectional Algorithm](https://www.w3.org/International/articles/inline-bidi-markup/uba-basics)
を使用して双方向（BiDi）テキストを管理・レンダリングし、句読点や数字を整列させます。

テキストは期待される視覚的な順序で表示される必要があります。句読点と数字は正しく配置され、
アラビア語のスクリプトは右から左へ、英語は左から右へ流れます。

以下のテストサンプルには、ラテン文字とアラビア文字、そしてそれらの双方向の組み合わせが含まれています。

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

// "Hello World"のアラビア語テキスト
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

// コードの重複を減らすためのBasicTextField()のラップ関数
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

Compose Multiplatformは、複数行の折り返しやBiDiコンテンツのネストを含む、複雑なBiDiのケースにおいても適切な配置とスペーシングを保証します。

### 数字と絵文字

数字は、周囲のテキストの方向に基づいて一貫して表示される必要があります。
東アラビア数字はRTLテキスト内で自然に配置され、西アラビア数字は典型的なLTRの動作に従います。

絵文字はRTLとLTRの両方のコンテキストに適応し、テキスト内で適切な配置とスペーシングを維持する必要があります。

以下のテストサンプルには、絵文字、東アラビア数字と西アラビア数字、そして双方向テキストが含まれています。

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

// 絵文字付きの"Hello World"のアラビア語テキスト
private val helloWorldArabic = "مرحبا بالعالم 🌎👋"

// 数字と絵文字付きの双方向テキスト
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

// コードの重複を減らすためのBasicTextField()のラップ関数
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

## Webターゲット向けのフォント

Webターゲットには、アラビア語や中国語などの特定のロケールの文字をレンダリングするための組み込みフォントがありません。
これに対処するには、カスタムのフォールバックフォントをリソースに追加し、それらをプリロードする必要があります。これらは自動的には有効になりません。

フォールバックフォントをプリロードするには、`FontFamily.Resolver.preload()`メソッドを使用します。例：

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

Webターゲット向けのリソースのプリロードに関する詳細は、
[preload API](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)に関するセクションを参照してください。

## RTLレイアウトにおけるアクセシビリティ

Compose Multiplatformは、RTLレイアウトのアクセシビリティ機能をサポートしています。
これには、スクリーンリーダーのための適切なテキスト方向と順序、ジェスチャーの処理などが含まれます。

### スクリーンリーダー

スクリーンリーダーはRTLレイアウトに自動的に適応し、ユーザーにとって論理的な読み上げ順序を維持します。

* RTLテキストは右から左へ読み上げられ、混合方向のテキストは標準的なBiDiルールに従います。
* 句読点と数字は正しい順序で読み上げられます。

複雑なレイアウトでは、スクリーンリーダーが正しい順序で読み上げるように、トラバーサルのセマンティクスを定義する必要があります。

### フォーカスベースのナビゲーション

RTLレイアウトでのフォーカスナビゲーションは、レイアウトのミラーリングされた構造に従います。

* フォーカスは、RTLコンテンツの自然な流れに従い、右から左、上から下へと移動します。
* スワイプやタップのようなジェスチャーは、ミラーリングされたレイアウトに自動的に調整されます。

また、上スワイプまたは下スワイプのアクセシビリティジェスチャーで、異なるトラバーサルグループ間を正しくナビゲーションできるように、トラバーサルのセマンティクスを定義することもできます。

トラバーサルのセマンティクスの定義とトラバーサルインデックスの設定に関する詳細は、
[アクセシビリティ](compose-accessibility.md#traversal-order)のセクションを参照してください。

## 既知の問題

私たちはRTL言語のサポートを継続的に改善しており、以下の既知の問題に対処する予定です。

* RTLレイアウトで非RTL文字を入力する際のキャレット位置の修正 ([CMP-3096](https://youtrack.jetbrains.com/issue/CMP-3096))
* アラビア数字のキャレット位置の修正 ([CMP-2772](https://youtrack.jetbrains.com/issue/CMP-2772))
* `TextDirection.Content`の修正 ([CMP-2446](https://youtrack.jetbrains.com/issue/CMP-2446))