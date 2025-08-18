[//]: # (title: ディープリンク)

ディープリンクは、オペレーティングシステムがカスタムリンクを処理し、ユーザーを対応するアプリ内の特定の宛先に誘導できるようにするナビゲーションメカニズムです。

ディープリンクは、アプリリンク（Androidでの呼び方）やユニバーサルリンク（iOSの用語）のより一般的なケースです。これらは、アプリと特定のWebアドレスとの間の検証済み接続です。これらについて具体的に学ぶには、[Androidアプリリンク](https://developer.android.com/training/app-links)および[iOSユニバーサルリンク](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/)に関するドキュメントを参照してください。

ディープリンクは、アプリに外部入力を取得するためにも役立ちます。たとえば、OAuth認証の場合です。ユーザーを視覚的にナビゲートすることなく、ディープリンクを解析してOAuthトークンを取得できます。

> 外部入力は悪意のあるものである可能性があるため、生のディープリンクURIの処理に関連するリスクを適切に軽減するために、[セキュリティガイドライン](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)に必ず従ってください。
> 
{style="warning"}

Compose Multiplatformでディープリンクを実装するには：

1.  [アプリ構成でディープリンクスキーマを登録する](#register-deep-links-schemas-in-the-operating-system)
2.  [ナビゲーショングラフ内の宛先に特定のディープリンクを割り当てる](#assign-deep-links-to-destinations)
3.  [アプリが受信したディープリンクを処理する](#handle-received-deep-links)

## セットアップ

Compose Multiplatformでディープリンクを使用するには、以下のように依存関係を設定します。

これらのバージョン、ライブラリ、およびプラグインをGradleカタログにリストアップします。

```ini
[versions]
compose-multiplatform = "%org.jetbrains.compose%"
agp = "8.9.0"

# The multiplatform Navigation library version with deep link support 
androidx-navigation = "%org.jetbrains.androidx.navigation%"

# Minimum Kotlin version to use with Compose Multiplatform 1.8.0
kotlin = "2.1.0"

# Serialization library necessary to implement type-safe routes
kotlinx-serialization = "1.7.3"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "androidx-navigation" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinx-serialization" }

[plugins]
multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
compose = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
kotlinx-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
android-application = { id = "com.android.application", version.ref = "agp" }
```

`build.gradle.kts` の共有モジュールに以下の追加依存関係を追加します。

```kotlin
plugins {
    // ...
    alias(libs.plugins.kotlinx.serialization)
}

// ...

kotlin {
    // ...
    sourceSets {
        commonMain.dependencies {
            // ...
            implementation(libs.androidx.navigation.compose)
            implementation(libs.kotlinx.serialization.json)
        }
    }
}
```

## オペレーティングシステムにディープリンクスキーマを登録する

各オペレーティングシステムには、ディープリンクを処理する方法が独自にあります。特定のターゲットに関するドキュメントを参照するのがより確実です。

*   Androidアプリの場合、ディープリンクスキーマは `AndroidManifest.xml` ファイルのインテントフィルターとして宣言されます。インテントフィルターを適切に設定する方法については、[Androidドキュメント](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters)を参照してください。
*   iOSおよびmacOSアプリの場合、ディープリンクスキーマは `Info.plist` ファイルの[`CFBundleURLTypes`](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes)キー内に宣言されます。

    > Compose Multiplatformは、macOSアプリの `Info.plist` に値を追加するための[Gradle DSL](compose-native-distribution.md#information-property-list-on-macos)を提供します。iOSの場合、KMPプロジェクトでファイルを直接編集するか、[Xcode GUIを使用してスキーマを登録](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)できます。
    >
    {style="note"}
*   Windowsアプリの場合、ディープリンクスキーマは、[必要な情報をWindowsレジストリに追加するキー](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))（Windows 8以前の場合）または[パッケージマニフェストで拡張機能を指定する](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)（Windows 10および11の場合）ことによって宣言できます。これは、インストールスクリプトまたは[Hydraulic Conveyor](https://conveyor.hydraulic.dev/)などのサードパーティの配布パッケージジェネレーターを使用して実行できます。Compose Multiplatformは、プロジェクト自体内でこれを構成することをサポートしていません。
    
    > [Windowsによって予約されているスキーマ](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names)のいずれかを使用していないことを確認してください。
    >
    {style="tip"}
*   Linuxの場合、ディープリンクスキーマは配布物に含まれる `.desktop` ファイルに登録できます。

## 宛先にディープリンクを割り当てる

ナビゲーショングラフの一部として宣言された宛先には、対応する `NavDeepLink` オブジェクトのリストを保持できるオプションの `deepLinks` パラメーターがあります。各 `NavDeepLink` は、宛先に一致するURIパターンを記述します。同じ画面につながる複数のURIパターンを定義できます。

ルートに対して定義できるディープリンクの数に制限はありません。

### ディープリンクの一般的なURIパターン

一般的なURIパターンは、URI全体に一致する必要があります。宛先内で受信したURIからパラメーターを抽出するために、パラメーターのプレースホルダーを使用できます。

一般的なURIパターンのルール：

*   スキームのないURIは、`http://` または `https://` で始まると見なされます。そのため、`uriPattern = "example.com"` は `http://example.com` および `https://example.com` に一致します。
*   `{placeholder}` は1文字以上に一致します（`example.com/name={name}` は `https://example.com/name=Bob` に一致します）。0文字以上に一致させるには、`.*` ワイルドカードを使用します（`example.com/name={.*}` は `https://example.com/name=` および任意の `name` の値に一致します）。
*   パスプレースホルダーのパラメーターは必須ですが、クエリプレースホルダーのマッチングはオプションです。たとえば、パターン `example.com/users/{id}?arg1={arg1}&arg2={arg2}` は：
    *   必須のパスの一部（`id`）が不足しているため、`http://www.example.com/users?arg1=one&arg2=two` には一致しません。
    *   `http://www.example.com/users/4?arg2=two` と `http://www.example.com/users/4?arg1=one` の両方に一致します。
    *   余分なクエリパラメーターはマッチングに影響しないため、`http://www.example.com/users/4?other=random` にも一致します。
*   複数のコンポーザブルが受信したURIに一致する `navDeepLink` を持っている場合、動作は不定です。ディープリンクパターンが交差しないようにしてください。同じディープリンクパターンを複数のコンポーザブルで処理する必要がある場合は、パスまたはクエリパラメーターを追加するか、中間宛先を使用してユーザーを予測可能にルーティングすることを検討してください。

### ルートタイプの生成されたURIパターン

URIパターンを完全に記述するのを避けることができます。Navigationライブラリは、ルートのパラメーターに基づいてURIパターンを自動的に生成できます。

このアプローチを使用するには、次のようにディープリンクを定義します。

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

ここで `PlantDetail` は宛先に使用しているルートタイプであり、`basePath` の "plant" は `PlantDetail` データクラスのシリアル名です。

URIの残りの部分は、次のように生成されます。

*   必須パラメーターはパスパラメーターとして追加されます（例：`/{id}`)
*   デフォルト値を持つパラメーター（オプションパラメーター）はクエリパラメーターとして追加されます（例：`?name={name}`)
*   コレクションはクエリパラメーターとして追加されます（例：`?items={value1}&items={value2}`)
*   パラメーターの順序は、ルート定義のフィールドの順序と一致します。

したがって、たとえばこのルートタイプ：

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

は、ライブラリによって以下の生成されたURIパターンを持ちます。

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 宛先にディープリンクを追加する例

この例では、複数のディープリンクを宛先に割り当て、受信したURIからパラメーター値を抽出します。

```kotlin
@Serializable @SerialName("dlscreen") data class DeepLinkScreen(val name: String)

// ...

val firstBasePath = "demo://example1.org"

NavHost(
    navController = navController,
    startDestination = FirstScreen
) {
    // ...
    
    composable<DeepLinkScreen>(
        deepLinks = listOf(
            // This composable should handle links both for demo://example1.org and demo://example2.org
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // The generated pattern only handles the parameters,
            // so we add the serial name for the route type
            navDeepLink<Screen3>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // If the app receives the URI `demo://example1.org/dlscreen/Jane/`,
        // it matches the generated URI pattern (name is a required parameter and is given in the path),
        // and you can map it to the route type automatically
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name
        
        // If the app receives a URI matching only a general pattern,
        // like `demo://example1.com/?name=Jane`
        // you need to parse the URI directly
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }
        
        // Composable content
    }
}
```

ウェブの場合、ディープリンクは少し異なります。Compose Multiplatform for Webはシングルページアプリを作成するため、ディープリンクURIパターンのすべてのパラメーターをURLフラグメント（`#` 文字の後）に配置し、すべてのパラメーターがURLエンコードされていることを確認する必要があります。

URLフラグメントがURIパターンルールに準拠している場合でも、`backStackEntry.toRoute()` メソッドを使用してパラメーターを解析できます。WebアプリでURLにアクセスして解析する方法、およびブラウザでのナビゲーションの詳細については、[未定義](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)を参照してください。

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // For the default Compose Multiplatform setup, localhost:8080
            // is the local dev endpoint that runs with the wasmJsBrowserDevelopmentRun Gradle task
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 他のシングルページWebアプリと同様に、Web上でURLフラグメントの使用を避けることができます。そのためには、Webサーバーを構成して適切なリクエストをアプリにリダイレクトさせ、[ナビゲーションルートのブラウザアドレスへのデフォルトマッピング](compose-navigation-routing.md#full-url-customization)を書き換える必要があります。
>
{style="tip"}

## 受信したディープリンクを処理する

Androidでは、アプリに送信されるディープリンクURIは、ディープリンクをトリガーした `Intent` の一部として利用できます。クロスプラットフォームの実装には、ディープリンクをリッスンするための普遍的な方法が必要です。

最小限の実装を作成しましょう：

1.  共通コードで、URIの保存とキャッシュを行うシングルトンと、外部URIのリスナーを宣言します。
2.  必要に応じて、オペレーティングシステムから受信したURIを送信するプラットフォーム固有の呼び出しを実装します。
3.  メインのコンポーザブルで新しいディープリンクのリスナーをセットアップします。

### URIリスナーを持つシングルトンを宣言する

`commonMain` で、トップレベルにシングルトンオブジェクトを宣言します。

```kotlin
object ExternalUriHandler {
    // Storage for when a URI arrives before the listener is set up
    private var cached: String? = null
    
    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // When a listener is set and `cached` is not empty,
                // immediately invoke the listener with the cached URI
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // When a new URI arrives, cache it.
    // If the listener is already set, invoke it and clear the cache immediately.
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### シングルトンへのプラットフォーム固有の呼び出しを実装する

デスクトップJVMとiOSの両方で、システムから受信したURIを明示的に渡す必要があります。

`jvmMain/.../main.kt` で、必要な各オペレーティングシステムのコマンドライン引数を解析し、受信したURIをシングルトンに渡します。

```kotlin
// Import the singleton
import org.company.app.ExternalUriHandler

fun main() {
    if(System.getProperty("os.name").indexOf("Mac") > -1) {
        Desktop.getDesktop().setOpenURIHandler { uri ->
            ExternalUriHandler.onNewUri(uri.uri.toString())
        }
    }
    else {
        ExternalUriHandler.onNewUri(args.getOrNull(0).toString())
    }

    application {
         // ...
    }
}
```

iOSでは、Swiftコードで、受信URIを処理する `application()` バリアントを追加します。

```swift
// Imports the KMP module to access the singleton
import ComposeApp

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // Sends the full URI on to the singleton
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)    
        return true
    }
```

> Swiftからシングルトンにアクセスするための命名規則については、[Kotlin/Nativeドキュメント](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)を参照してください。
> 
{style="tip"}

### リスナーをセットアップする

`DisposableEffect(Unit)` を使用してリスナーをセットアップし、コンポーザブルがアクティブでなくなった後にクリーンアップできます。例：

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // The effect is produced only once, as `Unit` never changes
    DisposableEffect(Unit) {
        // Sets up the listener to call `NavController.navigate()`
        // for the composable that has a matching `navDeepLink` listed
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // Removes the listener when the composable is no longer active
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // Reusing the example from earlier in this article
    NavHost(
        navController = navController,
        startDestination = FirstScreen
    ) {
        // ...

        composable<DeepLinkScreen>(
            deepLinks = listOf(
                navDeepLink { uriPattern = "$firstBasePath?name={name}" },
                navDeepLink { uriPattern = "demo://example2.com/name={name}" },
            )
        ) {
            // Composable content
        }
    }
}
```

## 結果

これで、完全なワークフローを確認できます。ユーザーが `demo://` URIを開くと、オペレーティングシステムはそれを登録されたスキーマと照合します。その後：
  *   ディープリンクを処理するアプリが閉じている場合、シングルトンはURIを受信してキャッシュします。メインのコンポーザブル関数が開始すると、シングルトンを呼び出し、キャッシュされたURIに一致するディープリンクにナビゲートします。
  *   ディープリンクを処理するアプリが開いている場合、リスナーはすでにセットアップされているため、シングルトンがURIを受信すると、アプリは直ちにそれにナビゲートします。