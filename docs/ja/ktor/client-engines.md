[//]: # (title: クライアントエンジン)

<show-structure for="chapter" depth="2"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学びます。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)は、JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)、[Native](https://kotlinlang.org/docs/native-overview.html)など、さまざまなプラットフォームで使用できます。特定のプラットフォームでは、ネットワークリクエストを処理する特定のエンジンが必要になる場合があります。
例えば、JVMアプリケーションには`Apache`や`Jetty`、Androidには`OkHttp`や`Android`、Kotlin/Nativeをターゲットとするデスクトップアプリケーションには`Curl`などを使用できます。エンジンごとに特定の機能や異なる設定オプションがあります。

## 要件と制限事項 {id="requirements"}

### サポートされているプラットフォーム {id="platforms"}

以下の表は、各エンジンによってサポートされている[プラットフォーム](client-supported-platforms.md)を示します。

| エンジン  | プラットフォーム                                               |
|---------|---------------------------------------------------------|
| Apache  | [JVM](#jvm)                                             |
| Java    | [JVM](#jvm)                                             |
| Jetty   | [JVM](#jvm)                                             |
| Android | [JVM](#jvm), [Android](#jvm-android)                    |
| OkHttp  | [JVM](#jvm), [Android](#jvm-android)                    |
| Darwin  | [Native](#native)                                       |
| WinHttp | [Native](#native)                                       |
| Curl    | [Native](#native)                                       |
| CIO     | [JVM](#jvm), [Android](#jvm-android), [Native](#native) |
| Js      | [JavaScript](#js)                                       |

### サポートされているAndroid/Javaバージョン {id="minimal-version"}

JVMまたはJVMとAndroidの両方をターゲットとするクライアントエンジンは、以下のAndroid/Javaバージョンをサポートしています。

| エンジン  | Androidバージョン   | Javaバージョン |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 古いAndroidバージョンでCIOエンジンを使用するには、[Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)を有効にする必要があります。_

### 制限事項 {id="limitations"}

以下の表は、特定のエンジンがHTTP/2と[WebSockets](client-websockets.topic)をサポートしているかどうかを示しています。

| エンジン  | HTTP/2             | WebSockets |
|---------|--------------------|------------|
| Apache  | ✅️ _(for Apache5)_ | ✖️         |
| Java    | ✅                  | ✅️         |
| Jetty   | ✅                  | ✖️         |
| CIO     | ✖️                 | ✅          |
| Android | ✖️                 | ✖️         |
| OkHttp  | ✅                  | ✅          |
| Js      | ✅                  | ✅          |
| Darwin  | ✅                  | ✅          |
| WinHttp | ✅                  | ✅          |
| Curl    | ✅                  | ✅         |

一般的なクライアント設定や特定のプラグインの使用に影響する以下の制限事項も考慮する必要があります。
- エンジンがHTTP/2をサポートしている場合、エンジン設定をカスタマイズすることで有効にできます（[](#java)エンジンの例を参照）。
- Ktorクライアントで[SSL](client-ssl.md)を設定するには、選択したエンジンの設定をカスタマイズする必要があります。
- 一部のエンジンは[プロキシ](client-proxy.md#supported_engines)をサポートしていません。
- [Logging](client-logging.md)プラグインは、プラットフォームごとに異なるロガータイプを提供します。
- [HttpTimeout](client-timeout.md#limitations)プラグインには、特定のエンジンに対するいくつかの制限があります。

## エンジンの依存関係を追加する {id="dependencies"}

[ktor-client-core](client-dependencies.md)アーティファクトとは別に、Ktorクライアントは各エンジンに特定の依存関係を追加する必要があります。サポートされている各プラットフォームについて、利用可能なエンジンと必要な依存関係は対応するセクションで確認できます。
* [JVM](#jvm)
* [JVMとAndroid](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> 異なるエンジン向けに、Ktorは`-jvm`や`-js`のようなサフィックスを持つプラットフォーム固有のアーティファクト（例: `ktor-client-cio-jvm`）を提供します。Gradleは指定されたプラットフォームに適したアーティファクトを解決しますが、Mavenはこの機能をサポートしていません。これは、Mavenの場合、プラットフォーム固有のサフィックスを手動で追加する必要があることを意味します。
>
{type="note"}

## 指定したエンジンでクライアントを作成する {id="create"}
特定のエンジンでHTTPクライアントを作成するには、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクタにエンジンクラスを引数として渡します。例えば、`CIO`エンジンでクライアントを作成するには以下のようにします。
[object Promise]

### デフォルトエンジン {id="default"}
引数なしで`HttpClient`コンストラクタを呼び出すと、クライアントは[ビルドスクリプトで追加された](#dependencies)アーティファクトに応じてエンジンを自動的に選択します。
[object Promise]

これはマルチプラットフォームプロジェクトで役立ちます。例えば、[AndroidとiOS](client-create-multiplatform-application.md)の両方をターゲットとするプロジェクトの場合、`androidMain`ソースセットに[Android](#jvm-android)依存関係を、`iosMain`ソースセットに[Darwin](#darwin)依存関係を追加できます。必要な依存関係はコンパイル時に選択されます。

## エンジンを設定する {id="configure"}
`engine`メソッドを使用してエンジンを設定できます。すべてのエンジンは、[HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html)によって公開されているいくつかの共通プロパティを共有します。例えば、次のとおりです。

[object Promise]

特定のエンジンの設定方法については、以下の対応するセクションを参照してください。

## JVM {id="jvm"}
このセクションでは、JVMで利用可能なエンジンについて見ていきます。

### Apache {id="apache"}
`Apache`エンジンはHTTP/1.1をサポートし、複数の設定オプションを提供します。
HTTP/2のサポートが必要な場合は`Apache5`エンジンも使用できます。`Apache5`はHTTP/2がデフォルトで有効になっています。

1. `ktor-client-apache5`または`ktor-client-apache`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-apache5"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに`Apache5`/`Apache`クラスを引数として渡します。

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">
   
   [object Promise]
   
   </tab>
   <tab title="Apache" group-key="4">
   
   [object Promise]
   
   </tab>
   </tabs>

3. エンジンを設定するには、`Apache5EngineConfig`/`ApacheEngineConfig`によって公開されている設定を`engine`メソッドに渡します。

   <tabs group="apache_version">
   <tab title="Apache5" group-key="5">

   [object Promise]

   </tab>
   <tab title="Apache" group-key="4">

   [object Promise]

   </tab>
   </tabs>

### Java {id="java"}
`Java`エンジンは、Java 11で導入された[Java HTTPクライアント](https://openjdk.java.net/groups/net/httpclient/intro.html)を使用します。これを使用するには、以下の手順に従います。
1. `ktor-client-java`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-java"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに[Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html)クラスを引数として渡します。
   [object Promise]
3. エンジンを設定するには、[JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
   [object Promise]

### Jetty {id="jetty"}
`Jetty`エンジンはHTTP/2のみをサポートしており、以下の方法で設定できます。
1. `ktor-client-jetty-jakarta`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに[Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)クラスを引数として渡します。
   [object Promise]
3. エンジンを設定するには、[JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
   [object Promise]

## JVMとAndroid {id="jvm-android"}

このセクションでは、JVM/Androidで利用可能なエンジンとその設定について見ていきます。

### Android {id="android"}
`Android`エンジンはAndroidをターゲットとしており、以下の方法で設定できます。
1. `ktor-client-android`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-android"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに[Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html)クラスを引数として渡します。
   [object Promise]
3. エンジンを設定するには、[AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
   [object Promise]

### OkHttp {id="okhttp"}
`OkHttp`エンジンはOkHttpをベースにしており、以下の方法で設定できます。
1. `ktor-client-okhttp`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-okhttp"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに[OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)クラスを引数として渡します。
   [object Promise]
3. エンジンを設定するには、[OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
   [object Promise]

## Native {id="native"}
このセクションでは、[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をターゲットとするエンジンの設定方法について見ていきます。

> Kotlin/NativeプロジェクトでKtorを使用するには、[新しいメモリマネージャー](https://kotlinlang.org/docs/native-memory-manager.html)が必要です。これはKotlin 1.7.20以降でデフォルトで有効になっています。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin`エンジンは[Darwinベース](https://en.wikipedia.org/wiki/Darwin_(operating_system))のオペレーティングシステム（macOS、iOS、tvOSなど）をターゲットとし、内部では[NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)を使用します。`Darwin`エンジンを使用するには、以下の手順に従います。

1. `ktor-client-darwin`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-darwin"/>
   <var name="target" value="-macosx64"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに`Darwin`クラスを引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. エンジンを設定するには、[DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html)によって公開されている設定を`engine`関数に渡します。
   例えば、`configureRequest`関数を使用して`NSMutableURLRequest`にアクセスしたり、`configureSession`を使用してセッション設定をカスタマイズしたりできます。以下のコードスニペットは`configureRequest`の使用方法を示しています。
   [object Promise]

   完全な例は以下で確認できます: [client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}
`WinHttp`エンジンはWindowsベースのオペレーティングシステムをターゲットとしています。
`WinHttp`エンジンを使用するには、以下の手順に従います。

1. `ktor-client-winhttp`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-winhttp"/>
   <var name="target" value="-mingwx64"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに`WinHttp`クラスを引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. エンジンを設定するには、[WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html)によって公開されている設定を`engine`関数に渡します。
   例えば、`protocolVersion`プロパティを使用してHTTPバージョンを変更できます。
   [object Promise]

   完全な例は以下で確認できます: [client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

デスクトッププラットフォーム向けに、Ktorは`Curl`エンジンも提供しています。このエンジンは以下のプラットフォームでサポートされています: `linuxX64`、`macosX64`、`macosArm64`、`mingwX64`。`Curl`エンジンを使用するには、以下の手順に従います。

1. [libcurlライブラリ](https://curl.se/libcurl/)をインストールします。
   > Linuxでは、libcurlの`gnutls`バージョンをインストールする必要があります。
   > Ubuntuにこのバージョンをインストールするには、以下を実行します。
   ```bash
   sudo apt-get install libcurl4-gnutls-dev
   ```

   > Windowsでは、[MinGW/MSYS2](FAQ.topic#native-curl)の`curl`バイナリを検討すると良いでしょう。
2. `ktor-client-curl`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-curl"/>
   <var name="target" value="-macosx64"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
3. `HttpClient`コンストラクタに`Curl`クラスを引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

4. エンジンを設定するには、`CurlClientEngineConfig`によって公開されている設定を`engine`メソッドに渡します。
   以下のコードスニペットは、テスト目的でSSL検証を無効にする方法を示しています。
   [object Promise]

   完全な例は以下で確認できます: [client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android、およびNative {id="jvm-android-native"}

### CIO {id="cio"}
CIOは、JVM、Android、およびNativeプラットフォームで使用できる完全に非同期なコルーチンベースのエンジンです。現在のところ、HTTP/1.xのみをサポートしています。これを使用するには、以下の手順に従います。
1. `ktor-client-cio`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-cio"/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに[CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)クラスを引数として渡します。
   [object Promise]

3. エンジンを設定するには、[CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
   [object Promise]

## JavaScript {id="js"}

`Js`エンジンは[JavaScriptプロジェクト](https://kotlinlang.org/docs/js-overview.html)で使用できます。このエンジンは、ブラウザアプリケーションには[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)を、Node.jsには`node-fetch`を使用します。これを使用するには、以下の手順に従います。

1. `ktor-client-js`の依存関係を追加します。

   <var name="artifact_name" value="ktor-client-js"/>
   <var name="target" value=""/>
   
    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    
2. `HttpClient`コンストラクタに`Js`クラスを引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   `Js`エンジンのシングルトンを取得するために`JsClient`関数を呼び出すこともできます。
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

完全な例は以下で確認できます: [client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 例: マルチプラットフォームモバイルプロジェクトでエンジンを設定する方法 {id="mpp-config"}

マルチプラットフォームモバイルプロジェクトでエンジン固有のオプションを設定するには、[expect/actual宣言](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)を使用できます。
[](client-create-multiplatform-application.md)チュートリアルで作成されたプロジェクトを使用して、これを実現する方法を説明します。

1. `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt`ファイルを開き、クライアント設定を受け取り`HttpClient`を返すトップレベルの`httpClient`関数を追加します。
   ```kotlin
   expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
   ```
   
2. `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt`を開き、Androidモジュール用の`httpClient`関数のactual宣言を追加します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   import java.util.concurrent.TimeUnit
   
   actual fun httpClient(config: HttpClientConfig<*>.() -> Unit) = HttpClient(OkHttp) {
      config(this)
   
      engine {
         config {
            retryOnConnectionFailure(true)
            connectTimeout(0, TimeUnit.SECONDS)
         }
      }
   }
   ```
   この例は[OkHttp](#okhttp)エンジンの設定方法を示していますが、[Androidでサポートされている](#jvm-android)他のエンジンも使用できます。

3. `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt`を開き、iOSモジュール用の`httpClient`関数のactual宣言を追加します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   actual fun httpClient(config: HttpClientConfig<*>.() -> Unit) = HttpClient(Darwin) {
      config(this)
      engine {
         configureRequest {
            setAllowsCellularAccess(true)
         }
      }
   }
   ```

4. 最後に、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`を開き、`HttpClient()`コンストラクタを`httpClient`関数呼び出しに置き換えます。
   ```kotlin
   private val client = httpClient()
   ```