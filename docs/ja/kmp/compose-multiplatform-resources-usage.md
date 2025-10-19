[//]: # (title: アプリでのマルチプラットフォームリソースの使用)

<show-structure depth="2"/>

プロジェクトの[リソースを設定](compose-multiplatform-resources-setup.md)したら、プロジェクトをビルドして、リソースへのアクセスを提供する特別な`Res`クラスを生成します。`Res`クラスとすべてのリソースアクセサーを再生成するには、プロジェクトを再度ビルドするか、IDEでプロジェクトを再インポートします。

その後、生成されたクラスを使用して、設定されたマルチプラットフォームリソースをコードまたは外部ライブラリからアクセスできます。

## 生成されたクラスのインポート

準備されたリソースを使用するには、生成されたクラスをインポートします。例：

```kotlin
import project.composeapp.generated.resources.Res
import project.composeapp.generated.resources.example_image
```

ここでは：
*   `project` はプロジェクト名です
*   `composeapp` はリソースディレクトリを配置したモジュールです
*   `Res` は生成されるクラスのデフォルト名です
*   `example_image` は `composeResources/drawable` ディレクトリ内の画像ファイル名です（例: `example_image.png`）。

## アクセサークラスの生成をカスタマイズする

Gradle設定を使用して、生成される `Res` クラスをニーズに合わせてカスタマイズできます。

`build.gradle.kts` ファイルの `compose.resources {}` ブロック内で、`Res` クラスがプロジェクト用に生成される方法に影響を与えるいくつかの設定を指定できます。
設定例は次のようになります。

```kotlin
compose.resources {
    publicResClass = false
    packageOfResClass = "me.sample.library.resources"
    generateResClass = auto
}
```

*   `publicResClass` を `true` に設定すると、生成される `Res` クラスが公開されます。デフォルトでは、生成されるクラスは [internal](https://kotlinlang.org/docs/visibility-modifiers.html) です。
*   `packageOfResClass` を使用すると、生成される `Res` クラスを特定のパッケージに割り当てることができます（コード内からのアクセス、および最終的な成果物での分離のため）。デフォルトでは、Compose Multiplatform は `{group name}.{module name}.generated.resources` パッケージをクラスに割り当てます。
*   `generateResClass` を `always` に設定すると、プロジェクトは無条件に `Res` クラスを生成します。これは、リソースライブラリが推移的にのみ利用可能な場合に役立つ場合があります。デフォルトでは、Compose Multiplatform は `auto` 値を使用して、現在のプロジェクトがリソースライブラリに対する明示的な `implementation` または `api` 依存関係を持つ場合にのみ `Res` クラスを生成します。

## リソースの使用法

### 画像

ドロウアブルリソースは、シンプルな画像、ラスタライズ画像、またはXMLベクターとしてアクセスできます。
SVG画像はAndroidを除くすべてのプラットフォームでサポートされています。

*   ドロウアブルリソースを `Painter` 画像としてアクセスするには、`painterResource()` 関数を使用します。

  ```kotlin
  @Composable
  fun painterResource(resource: DrawableResource): Painter {...}
  ```

  `painterResource()` 関数はリソースパスを受け取り、`Painter` 値を返します。この関数は、Webターゲットを除くすべてのターゲットで同期的に動作します。Webターゲットの場合、最初の再コンポジションでは空の `Painter` を返し、その後の再コンポジションで読み込まれた画像に置き換えられます。

  *   `painterResource()` は、`.png`、`.jpg`、`.bmp`、`.webp` などのラスタライズ画像形式の場合は `BitmapPainter` を、Android XMLベクタードロウアブル形式の場合は `VectorPainter` をロードします。
  *   XMLベクタードロウアブルは、[Android](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable) と同じ形式ですが、Androidリソースへの外部参照はサポートしていません。

*   ドロウアブルリソースを `ImageBitmap` ラスタライズ画像としてアクセスするには、`imageResource()` 関数を使用します。

  ```kotlin
  @Composable
  fun imageResource(resource: DrawableResource): ImageBitmap {...}
  ```

*   ドロウアブルリソースを `ImageVector` XMLベクターとしてアクセスするには、`vectorResource()` 関数を使用します。

  ```kotlin
  @Composable
  fun vectorResource(resource: DrawableResource): ImageVector {...}
  ```

Compose Multiplatform コードで画像にアクセスする例を次に示します。

```kotlin
Image(
    painter = painterResource(Res.drawable.my_image),
    contentDescription = null
)
```

### アイコン

Material SymbolsライブラリのベクターAndroid XMLアイコンを使用できます。

1.  [Google Fonts Icons](https://fonts.google.com/icons) ギャラリーを開き、アイコンを選択し、Androidタブに移動して**ダウンロード**をクリックします。

2.  ダウンロードしたXMLアイコンファイルをマルチプラットフォームリソースの `drawable` ディレクトリに追加します。

3.  XMLアイコンファイルを開き、`android:fillColor` を `#00000000` に設定します。`android:tint` など、色の調整のための他のAndroid固有の属性はすべて削除します。

   変更前：

   ```xml
   <vector xmlns:android="http://schemas.android.com/apk/res/android"
        android:width="24dp"
        android:height="24dp"
        android:viewportWidth="960"
        android:viewportHeight="960"
        android:tint="?attr/colorControlNormal">
        <path
            android:fillColor="@android:color/white"
            android:pathData="..."/>
    </vector>
   ```

   変更後：

   ```xml
   <vector xmlns:android="http://schemas.android.com/apk/res/android"
        android:width="24dp"
        android:height="24dp"
        android:viewportWidth="960"
        android:viewportHeight="960">
        <path
            android:fillColor="#00000000"
            android:pathData="..."/>
   </vector>
   ```

4.  プロジェクトをビルドしてリソースアクセサーを生成するか、[Kotlin Multiplatformプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)に自動的に処理させます。

Compose Multiplatformコードでアイコンにアクセスし、`colorFilter` パラメータを使用して色を調整する例を次に示します。

```kotlin
Image(
    painter = painterResource(Res.drawable.ic_sample_icon),
    contentDescription = "Sample icon",
    modifier = Modifier.size(24.dp),
    colorFilter = ColorFilter.tint(Color.Blue)
)
```

### 文字列

すべての文字列リソースは、`composeResources/values` ディレクトリ内のXMLファイルに保存します。
各ファイル内の各項目に対して、静的アクセサーが生成されます。

異なるロケール用に文字列をローカライズする方法の詳細については、[文字列のローカライズに関するガイド](compose-localize-strings.md)を参照してください。

#### シンプルな文字列

シンプルな文字列を保存するには、XMLに `<string>` 要素を追加します。

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
</resources>
```

文字列リソースを `String` として取得するには、次のコードを使用します。

<Tabs>
<TabItem title= "コンポーザブルコードから">

```kotlin
@Composable
fun stringResource(resource: StringResource): String {...}

@Composable
fun stringResource(resource: StringResource, vararg formatArgs: Any): String {...}
```

例：

```kotlin
Text(stringResource(Res.string.app_name))
```

</TabItem>
<TabItem title= "非コンポーザブルコードから">

```kotlin
suspend fun getString(resource: StringResource): String

suspend fun getString(resource: StringResource, vararg formatArgs: Any): String
```

例：

```kotlin
coroutineScope.launch {
    val appName = getString(Res.string.app_name)
}
```

</TabItem>
</Tabs>

文字列リソースでは特殊文字を使用できます。

*   `
` – 改行のため
*   `\t` – タブ記号のため
*   `\uXXXX` – 特定のUnicode文字のため

[Android文字列の場合](https://developer.android.com/guide/topics/resources/string-resource#escaping_quotes)のように、"`@" や "?" のような特殊なXML文字をエスケープする必要はありません。

#### 文字列テンプレート

現在、引数は文字列リソースの基本的なサポートを持っています。
テンプレートを作成する際は、`%<number>` 形式を使用して文字列内に引数を配置し、これが変数プレースホルダーであり、単純なテキストではないことを示すために `$d` または `$s` の接尾辞を含めます。
例：

```XML
<resources>
    <string name="str_template">Hello, %2$s! You have %1$d new messages.</string>
</resources>
```

文字列テンプレートリソースを作成しインポートした後、正しい順序でプレースホルダーの引数を渡しながら参照できます。

```kotlin
Text(stringResource(Res.string.str_template, 100, "User_name"))
```

`$s` と `$d` の接尾辞に違いはなく、他のものはサポートされていません。
リソース文字列に `%1$s` プレースホルダーを配置し、それを使用して小数値を表示することもできます。例：

```kotlin
Text(stringResource(Res.string.str_template, "User_name", 100.1f))
```

#### 文字列配列

関連する文字列を配列にグループ化し、`List<String>` オブジェクトとして自動的にアクセスできます。

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <string-array name="str_arr">
        <item>item \u2605</item>
        <item>item \u2318</item>
        <item>item \u00BD</item>
    </string-array>
</resources>
```

対応するリストを取得するには、次のコードを使用します。

<Tabs>
<TabItem title= "コンポーザブルコードから">

```kotlin
@Composable
fun stringArrayResource(resource: StringArrayResource): List<String> {...}
```

例：

```kotlin
val arr = stringArrayResource(Res.array.str_arr)
if (arr.isNotEmpty()) Text(arr[0])
```

</TabItem>
<TabItem title= "非コンポーザブルコードから">

```kotlin
suspend fun getStringArray(resource: StringArrayResource): List<String>
```

例：

```kotlin
coroutineScope.launch {
    val appName = getStringArray(Res.array.str_arr)
}
```

</TabItem>
</Tabs>

#### 複数形

UIが数量を表示する場合、同じものの異なる数（1冊の_本_、多数の_本_など）に対して文法的な一致をサポートしたい場合があります。これは、プログラム上で無関係な文字列を作成することなく実現できます。

Compose Multiplatformにおけるコンセプトと基本的な実装は、Androidの数量指定文字列と同じです。
プロジェクトで複数形を使用するためのベストプラクティスとニュアンスの詳細については、[Androidドキュメント](https://developer.android.com/guide/topics/resources/string-resource#Plurals)を参照してください。

*   サポートされているバリアントは、`zero`、`one`、`two`、`few`、`many`、`other` です。ただし、すべての言語でこれらのバリアントが考慮されるわけではないことに注意してください。たとえば、英語では `zero` は1以外は他の複数形と同じであるため無視されます。言語が実際にどのような区別を要求するかは、言語の専門家に依存してください。
*   「書籍: 1」のような数量に依存しない表現を使用することで、数量指定文字列を避けることがしばしば可能です。これがユーザーエクスペリエンスを悪化させない場合、

複数形を定義するには、`composeResources/values` ディレクトリ内の任意の `.xml` ファイルに `<plurals>` 要素を追加します。
`plurals` コレクションは、`name` 属性（XMLファイルの名前ではない）を使用して参照されるシンプルなリソースです。
そのため、`plurals` リソースを他のシンプルなリソースと1つのXMLファイル内の1つの `<resources>` 要素の下に結合できます。

```xml
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <plurals name="new_message">
        <item quantity="one">%1$d new message</item>
        <item quantity="other">%1$d new messages</item>
    </plurals>
</resources>
```

複数形を `String` としてアクセスするには、次のコードを使用します。

<Tabs>
<TabItem title= "コンポーザブルコードから">

```kotlin
@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int): String {...}

@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String {...}
```

例：

```kotlin
Text(pluralStringResource(Res.plurals.new_message, 1, 1))
```

</TabItem>
<TabItem title= "非コンポーザブルコードから">

```kotlin
suspend fun getPluralString(resource: PluralStringResource, quantity: Int): String

suspend fun getPluralString(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String
```

例：

```kotlin
coroutineScope.launch {
    val appName = getPluralString(Res.plurals.new_message, 1, 1)
}
```

</TabItem>
</Tabs>

### フォント

カスタムフォントは `composeResources/font` ディレクトリに `*.ttf` または `*.otf` ファイルとして保存します。

フォントを `Font` タイプとしてロードするには、`Font()` コンポーザブル関数を使用します。

```kotlin
@Composable
fun Font(
    resource: FontResource,
    weight: FontWeight = FontWeight.Normal,
    style: FontStyle = FontStyle.Normal
): Font
```

例：

```kotlin
@Composable
private fun InterTypography(): Typography {
    val interFont = FontFamily(
        Font(Res.font.Inter_24pt_Regular, FontWeight.Normal),
        Font(Res.font.Inter_24pt_SemiBold, FontWeight.Bold),
    )

    return with(MaterialTheme.typography) {
        copy(
            displayLarge = displayLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displayMedium = displayMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displaySmall = displaySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineLarge = headlineLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineMedium = headlineMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineSmall = headlineSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleLarge = titleLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleMedium = titleMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleSmall = titleSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            labelLarge = labelLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelMedium = labelMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelSmall = labelSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyLarge = bodyLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyMedium = bodyMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodySmall = bodySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
        )
    }
}
```

{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@Composable private fun InterTypography(): Typography { val interFont = FontFamily("}

> `Font` がコンポーザブルである場合、その依存コンポーネント（`TextStyle` や `Typography` など）もコンポーザブルであることを確認してください。
>
{style="note"}

Webターゲットで絵文字やアラビア語スクリプトなどの特殊文字をサポートするには、対応するフォントをリソースに追加し、[Compose MultiplatformプリロードAPIを使用してフォールバックフォントをプリロード](#preload-resources-using-the-compose-multiplatform-preload-api)する必要があります。

### 生ファイル

生ファイルをバイト配列としてロードするには、`Res.readBytes(path)` 関数を使用します。

```kotlin
suspend fun readBytes(path: String): ByteArray
```

生ファイルを `composeResources/files` ディレクトリに配置し、その中に任意の階層を作成できます。

例として、生ファイルにアクセスするには、次のコードを使用します。

<Tabs>
<TabItem title= "コンポーザブルコードから">

```kotlin
var bytes by remember {
    mutableStateOf(ByteArray(0))
}
LaunchedEffect(Unit) {
    bytes = Res.readBytes("files/myDir/someFile.bin")
}
Text(bytes.decodeToString())
```

</TabItem>
<TabItem title= "非コンポーザブルコードから">

```kotlin
coroutineScope.launch {
    val bytes = Res.readBytes("files/myDir/someFile.bin")
}
```

</TabItem>
</Tabs>

#### バイト配列を画像に変換する

読み込むファイルがビットマップ（JPEG、PNG、BMP、WEBP）またはXMLベクター画像の場合、それらを `Image()` コンポーザブルに適した `ImageBitmap` または `ImageVector` オブジェクトに変換するために、以下の関数を使用できます。

[生ファイル](#raw-files)セクションで示されているように生ファイルにアクセスし、結果をコンポーザブルに渡します。

```kotlin
// bytes = Res.readBytes("files/example.png")
Image(bytes.decodeToImageBitmap(), null)

// bytes = Res.readBytes("files/example.xml")
Image(bytes.decodeToImageVector(LocalDensity.current), null)
```

Androidを除くすべてのプラットフォームでは、SVGファイルを `Painter` オブジェクトに変換することもできます。

```kotlin
// bytes = Res.readBytes("files/example.svg")
Image(bytes.decodeToSvgPainter(LocalDensity.current), null)
```

### リソースと文字列IDの生成されたマップ

アクセスを容易にするために、Compose Multiplatformはリソースを文字列IDにもマップします。ファイル名をキーとして使用してアクセスできます。

```kotlin
val Res.allDrawableResources: Map<String, DrawableResource>
val Res.allStringResources: Map<String, StringResource>
val Res.allStringArrayResources: Map<String, StringArrayResource>
val Res.allPluralStringResources: Map<String, PluralStringResource>
val Res.allFontResources: Map<String, FontResource>
```

マップされたリソースをコンポーザブルに渡す例：

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

### AndroidアセットとしてのCompose Multiplatformリソース

Compose Multiplatform 1.7.0以降、すべてのマルチプラットフォームリソースはAndroidアセットにパッケージ化されます。
これにより、Android StudioはAndroidソースセット内のCompose Multiplatformコンポーザブルのプレビューを生成できます。

> Android Studioのプレビューは、Androidソースセット内のコンポーザブルでのみ利用可能です。
> また、最新のAGPバージョン（8.5.2、8.6.0-rc01、または8.7.0-alpha04）のいずれかが必要です。
>
{style="warning"}

マルチプラットフォームリソースをAndroidアセットとして使用することで、WebViewsやメディアプレイヤーコンポーネントから直接Androidでアクセスすることも可能になります。これは、`Res.getUri("files/index.html")` のような単純なパスでリソースに到達できるためです。

リソースHTMLページとリソース画像へのリンクを表示するAndroidコンポーザブルの例：

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="AndroidView(factory = { WebView(it).apply"}

この例は、以下のシンプルなHTMLファイルで動作します。

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>Cat Resource</title>"}

この例の2つのリソースファイルは、`commonMain` ソースセットに配置されています。

![File structure of the composeResources directory](compose-resources-android-webview.png){width="230"}

## Webターゲットのリソースのプリロード

フォントや画像などのWebリソースは、`fetch` APIを使用して非同期にロードされます。初回ロード時やネットワーク接続が遅い場合、リソースの取得が原因で、[FOUT](https://fonts.google.com/knowledge/glossary/fout) や、画像ではなくプレースホルダーが表示されるなどの視覚的な不具合が発生する可能性があります。

この問題の典型的な例は、`Text()` コンポーネントにカスタムフォントのテキストが含まれているものの、必要なグリフを持つフォントがまだロードされていない場合です。この場合、ユーザーは一時的にデフォルトフォントでテキストが表示されたり、文字の代わりに空白のボックスや疑問符が表示されたりすることがあります。同様に、画像やドロウアブルの場合、リソースが完全にロードされるまで、空白または黒いボックスのようなプレースホルダーが表示されることがあります。

視覚的な不具合を防ぐために、ブラウザの組み込み機能によるリソースのプリロード、Compose MultiplatformのプリロードAPI、またはその両方を組み合わせて使用できます。

### ブラウザ機能を使用してリソースをプリロードする

最新のブラウザでは、[`rel="preload"` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)を持つ `<link>` タグを使用してリソースをプリロードできます。
この属性は、アプリケーションが起動する前にフォントや画像などのリソースのダウンロードとキャッシュを優先するようブラウザに指示し、これらのリソースが早期に利用可能であることを保証します。

たとえば、ブラウザ内でのフォントのプリロードを有効にするには：

1.  アプリケーションのウェブディストリビューションをビルドします。

```console
   ./gradlew :composeApp:wasmJsBrowserDistribution
```

2.  生成された `dist` ディレクトリから必要なリソースを見つけてパスを保存します。
3.  `wasmJsMain/resources/index.html` ファイルを開き、`<head>` 要素内に `<link>` タグを追加します。
4.  `href` 属性をリソースパスに設定します。

```html
<link rel="preload" href="./composeResources/username.composeapp.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### Compose MultiplatformプリロードAPIを使用してリソースをプリロードする
<primary-label ref="Experimental"/>

ブラウザでリソースをプリロードした場合でも、それらは生バイトとしてキャッシュされ、`FontResource` や `DrawableResource` のようなレンダリングに適した形式に変換する必要があります。アプリケーションがリソースを初めて要求するとき、この変換は非同期で行われるため、再びちらつきが発生する可能性があります。エクスペリエンスをさらに最適化するために、Compose Multiplatformリソースには、リソースのより高レベルな表現のための独自の内部キャッシュがあり、これもプリロードできます。

Compose Multiplatform 1.8.0 では、Webターゲットでのフォントおよび画像リソースのプリロードのための実験的API (`preloadFont()`、`preloadImageBitmap()`、および `preloadImageVector()`) が導入されました。

さらに、絵文字のような特殊文字が必要な場合、デフォルトのバンドルされたオプションとは異なるフォールバックフォントを設定できます。
フォールバックフォントを指定するには、`FontFamily.Resolver.preload()` メソッドを使用します。

以下の例は、プリロードとフォールバックフォントの使用方法を示しています。

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
import androidx.compose.ui.window.CanvasBasedWindow
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
        // Overrides the resource location
        resourcePathMapping { path -> "./$path" }
    }
    CanvasBasedWindow("Resources + K/Wasm") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // Uses the preloaded resource for the app's content
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // Displays the progress indicator to address a FOUT or the app being temporarily non-functional during loading
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // Preloads a fallback font with emojis to render missing glyphs that are not supported by the bundled font
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## 他のライブラリやリソースとの連携

### 外部ライブラリからのマルチプラットフォームリソースへのアクセス

プロジェクトに含まれる他のライブラリを使用してマルチプラットフォームリソースを処理したい場合は、プラットフォーム固有のファイルパスをこれらの他のAPIに渡すことができます。
プラットフォーム固有のパスを取得するには、`Res.getUri()` 関数をリソースへのプロジェクトパスとともに呼び出します。

```kotlin
val uri = Res.getUri("files/my_video.mp4")
```

これで `uri` 変数にファイルの絶対パスが含まれるため、外部ライブラリは、そのパスを使用してファイルにアクセスできるようになります。

Android固有の用途では、マルチプラットフォームリソースは[Androidアセットとしてもパッケージ化](#compose-multiplatform-resources-as-android-assets)されます。

### リモートファイル

リソースライブラリのコンテキストでは、アプリケーションの一部であるファイルのみがリソースと見なされます。

インターネット上のリモートファイルは、以下の特殊なライブラリを使用してURLでロードできます。

*   [Compose ImageLoader](https://github.com/qdsfdhvh/compose-imageloader)
*   [Kamel](https://github.com/Kamel-Media/Kamel)
*   [Ktor client](https://ktor.io/)

### Javaリソースの使用

JavaリソースをCompose Multiplatformで使用することは可能ですが、フレームワークが提供する拡張機能（生成されたアクセサー、マルチモジュールサポート、ローカライゼーションなど）の恩恵を受けることはできません。
その可能性を最大限に引き出すために、マルチプラットフォームリソースライブラリに完全に移行することを検討してください。

Compose Multiplatform 1.7.0以降、`compose.ui` パッケージで利用可能なリソースAPIは非推奨になりました。
引き続きJavaリソースを扱う必要がある場合は、Compose Multiplatform 1.7.0以降にアップグレードした後でもコードが動作するように、以下の実装をプロジェクトにコピーしてください。

```kotlin
@Composable
internal fun painterResource(
    resourcePath: String
): Painter = when (resourcePath.substringAfterLast(".")) {
    "svg" -> rememberSvgResource(resourcePath)
    "xml" -> rememberVectorXmlResource(resourcePath)
    else -> rememberBitmapResource(resourcePath)
}

@Composable
internal fun rememberBitmapResource(path: String): Painter {
    return remember(path) { BitmapPainter(readResourceBytes(path).decodeToImageBitmap()) }
}

@Composable
internal fun rememberVectorXmlResource(path: String): Painter {
    val density = LocalDensity.current
    val imageVector = remember(density, path) { readResourceBytes(path).decodeToImageVector(density) }
    return rememberVectorPainter(imageVector)
}

@Composable
internal fun rememberSvgResource(path: String): Painter {
    val density = LocalDensity.current
    return remember(density, path) { readResourceBytes(path).decodeToSvgPainter(density) }
}

private object ResourceLoader
private fun readResourceBytes(resourcePath: String) =
    ResourceLoader.javaClass.classLoader.getResourceAsStream(resourcePath).readAllBytes()
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="internal fun painterResource(resourcePath: String): Painter"}

## 次のステップ

*   iOS、Android、デスクトップをターゲットとするCompose Multiplatformプロジェクトでリソースを処理する方法を示す公式の[デモプロジェクト](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)をチェックしてください。
*   アプリ内テーマや言語など、アプリケーションの[リソース環境](compose-resource-environment.md)を管理する方法を学びます。