[//]: # (title: クライアントエンジン)

<show-structure for="chapter" depth="2"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学習します。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)は、JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)、[Native](https://kotlinlang.org/docs/native-overview.html)を含むさまざまなプラットフォームで使用できます。特定のプラットフォームでは、ネットワークリクエストを処理するための特定のエンジンが必要となる場合があります。
例えば、JVMアプリケーションには`Apache`または`Jetty`を、Androidには`OkHttp`または`Android`を、Kotlin/Nativeをターゲットとするデスクトップアプリケーションには`Curl`などを使用できます。異なるエンジンは特定の機能を持っていたり、異なる設定オプションを提供したりする場合があります。

## 要件と制限 {id="requirements"}

### サポートされているプラットフォーム {id="platforms"}

以下の表は、各エンジンによってサポートされている[プラットフォーム](client-supported-platforms.md)を示しています。

| Engine  | Platforms                                               |
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

| Engine  | Android version   | Java version |
|---------|-------------------|--------------|
| Apache  |                   | 8+           |
| Java    |                   | 11+          |
| Jetty   |                   | 11+          |
| CIO     | 7.0+ <sup>*</sup> | 8+           |
| Android | 1.x+              | 8+           |
| OkHttp  | 5.0+              | 8+           |

_* 古いAndroidバージョンでCIOエンジンを使用するには、[Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)を有効にする必要があります。_

### 制限 {id="limitations"}

以下の表は、特定のエンジンがHTTP/2と[WebSockets](client-websockets.topic)をサポートしているかどうかを示しています。

| Engine  | HTTP/2             | WebSockets |
|---------|--------------------|------------|
| Apache  | ✅️ _(Apache5の場合)_ | ✖️         |
| Java    | ✅                  | ✅️         |
| Jetty   | ✅                  | ✖️         |
| CIO     | ✖️                 | ✅          |
| Android | ✖️                 | ✖️         |
| OkHttp  | ✅                  | ✅          |
| Js      | ✅                  | ✅          |
| Darwin  | ✅                  | ✅          |
| WinHttp | ✅                  | ✅          |
| Curl    | ✅                  | ✖️         |

また、一般的なクライアント構成や特定のプラグインの使用に影響する以下の制限を考慮する必要があります。
- エンジンがHTTP/2をサポートしている場合、エンジン構成をカスタマイズすることで有効にできます（[](#java)エンジンの例を参照）。
- Ktorクライアントで[SSL](client-ssl.md)を構成するには、選択したエンジンの構成をカスタマイズする必要があります。
- 一部のエンジンは[プロキシ](client-proxy.md#supported_engines)をサポートしていません。
- [Logging](client-logging.md)プラグインは、異なるプラットフォーム向けに異なるロガータイプを提供します。
- [HttpTimeout](client-timeout.md#limitations)プラグインには、特定のエンジンに対するいくつかの制限があります。

## エンジンの依存関係を追加する {id="dependencies"}

[ktor-client-core](client-dependencies.md)アーティファクトとは別に、Ktorクライアントは各エンジンに特定の依存関係を追加する必要があります。サポートされている各プラットフォームについて、利用可能なエンジンと必要な依存関係は、対応するセクションで確認できます。
* [JVM](#jvm)
* [JVMとAndroid](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> 異なるエンジンには、Ktorは`-jvm`や`-js`のようなサフィックスを持つプラットフォーム固有のアーティファクト（例: `ktor-client-cio-jvm`）を提供します。Gradleは与えられたプラットフォームに適したアーティファクトを解決しますが、Mavenはこの機能をサポートしていません。つまり、Mavenの場合、プラットフォーム固有のサフィックスを手動で追加する必要があります。
>
{type="note"}

## 指定したエンジンでクライアントを作成する {id="create"}
特定のエンジンでHTTPクライアントを作成するには、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクタにエンジンクラスを引数として渡します。例えば、`CIO`エンジンでクライアントを作成するには次のようにします。
```kotlin
```
{src="snippets/_misc_client/CioCreate.kt"}

### デフォルトエンジン {id="default"}
引数なしで`HttpClient`コンストラクタを呼び出すと、クライアントは[ビルドスクリプト](#dependencies)で追加されたアーティファクトに応じて自動的にエンジンを選択します。
```kotlin
```
{src="snippets/_misc_client/DefaultEngineCreate.kt"}

これはマルチプラットフォームプロジェクトに役立ちます。例えば、[AndroidとiOS](client-create-multiplatform-application.md)の両方をターゲットとするプロジェクトの場合、`androidMain`ソースセットに[Android](#jvm-android)の依存関係を、`iosMain`ソースセットに[Darwin](#darwin)の依存関係を追加できます。必要な依存関係はコンパイル時に選択されます。

## エンジンを構成する {id="configure"}
`engine`メソッドを使用してエンジンを構成できます。すべてのエンジンは、[HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html)によって公開されているいくつかの共通プロパティを共有しています。例えば、

```kotlin
```
{src="snippets/_misc_client/BasicEngineConfigExample.kt" interpolate-variables="true" disable-links="false"}

特定のエンジンの構成方法については、以下の対応するセクションを参照してください。

## JVM {id="jvm"}
このセクションでは、JVMで利用可能なエンジンについて見ていきます。

### Apache {id="apache"}
`Apache`エンジンはHTTP/1.1をサポートし、複数の構成オプションを提供します。HTTP/2のサポートが必要な場合は`Apache5`エンジンも使用でき、`Apache5`はHTTP/2がデフォルトで有効になっています。

1.  `ktor-client-apache5`または`ktor-client-apache`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-apache5"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに`Apache5`/`Apache`クラスを引数として渡します。

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    ```kotlin
    ```
    {src="snippets/_misc_client/Apache5Create.kt" include-lines="1-2,4-5"}

    </tab>
    <tab title="Apache" group-key="4">

    ```kotlin
    ```
    {src="snippets/_misc_client/ApacheCreate.kt"}

    </tab>
    </tabs>

3.  エンジンを構成するには、`Apache5EngineConfig`/`ApacheEngineConfig`によって公開されている設定を`engine`メソッドに渡します。

    <tabs group="apache_version">
    <tab title="Apache5" group-key="5">

    ```kotlin
    ```
    {src="snippets/_misc_client/Apache5Create.kt" include-lines="1-4,7-23"}

    </tab>
    <tab title="Apache" group-key="4">

    ```kotlin
    ```
    {src="snippets/_misc_client/ApacheConfig.kt" interpolate-variables="true" disable-links="false"}

    </tab>
    </tabs>

### Java {id="java"}
`Java`エンジンは、Java 11で導入された[Java HTTPクライアント](https://openjdk.java.net/groups/net/httpclient/intro.html)を使用します。使用するには、以下の手順に従ってください。
1.  `ktor-client-java`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-java"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに[Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html)クラスを引数として渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/JavaCreate.kt"}
3.  エンジンを構成するには、[JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/JavaConfig.kt" interpolate-variables="true" disable-links="false"}

### Jetty {id="jetty"}
`Jetty`エンジンはHTTP/2のみをサポートしており、次のように構成できます。
1.  `ktor-client-jetty-jakarta`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに[Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)クラスを引数として渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/JettyCreate.kt"}
3.  エンジンを構成するには、[JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/JettyConfig.kt" interpolate-variables="true" disable-links="false"}

## JVMとAndroid {id="jvm-android"}

このセクションでは、JVM/Androidで利用可能なエンジンとその構成について見ていきます。

### Android {id="android"}
`Android`エンジンはAndroidをターゲットとしており、次のように構成できます。
1.  `ktor-client-android`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-android"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに[Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html)クラスを引数として渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/AndroidCreate.kt"}
3.  エンジンを構成するには、[AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/AndroidConfig.kt" interpolate-variables="true" disable-links="false"}

### OkHttp {id="okhttp"}
`OkHttp`エンジンはOkHttpに基づいており、次のように構成できます。
1.  `ktor-client-okhttp`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-okhttp"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに[OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)クラスを引数として渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/OkHttpCreate.kt"}
3.  エンジンを構成するには、[OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/OkHttpConfig.kt" interpolate-variables="true" disable-links="false"}

## Native {id="native"}
このセクションでは、[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をターゲットとするエンジンの構成方法について見ていきます。

> Kotlin/NativeプロジェクトでKtorを使用するには、[新しいメモリマネージャー](https://kotlinlang.org/docs/native-memory-manager.html)が必要です。これはKotlin 1.7.20以降でデフォルトで有効になっています。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin`エンジンは、[Darwinベース](https://en.wikipedia.org/wiki/Darwin_(operating_system))のオペレーティングシステム（macOS、iOS、tvOSなど）をターゲットとしており、内部で[NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)を使用します。`Darwin`エンジンを使用するには、以下の手順に従ってください。

1.  `ktor-client-darwin`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-darwin"/>
    <var name="target" value="-macosx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  `HttpClient`コンストラクタに`Darwin`クラスを引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.darwin.*

    val client = HttpClient(Darwin)
    ```
3.  エンジンを構成するには、[DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html)によって公開されている設定を`engine`関数に渡します。
    例えば、`configureRequest`関数を使用して`NSMutableURLRequest`にアクセスしたり、`configureSession`を使用してセッション構成をカスタマイズしたりできます。以下のコードスニペットは、`configureRequest`の使用方法を示しています。
    ```kotlin
    ```
    {src="snippets/client-engine-darwin/src/nativeMain/kotlin/Main.kt" include-lines="8-14"}

    完全な例は以下で確認できます: [client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)。

### WinHttp {id="winhttp"}
`WinHttp`エンジンはWindowsベースのオペレーティングシステムをターゲットとしています。`WinHttp`エンジンを使用するには、以下の手順に従ってください。

1.  `ktor-client-winhttp`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-winhttp"/>
    <var name="target" value="-mingwx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  `HttpClient`コンストラクタに`WinHttp`クラスを引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.winhttp.*

    val client = HttpClient(WinHttp)
    ```
3.  エンジンを構成するには、[WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html)によって公開されている設定を`engine`関数に渡します。
    例えば、`protocolVersion`プロパティを使用してHTTPバージョンを変更できます。
    ```kotlin
    ```
    {src="snippets/client-engine-winhttp/src/nativeMain/kotlin/Main.kt" include-lines="9-13"}

    完全な例は以下で確認できます: [client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)。

### Curl {id="curl"}

デスクトッププラットフォーム向けに、Ktorは`Curl`エンジンも提供しています。このエンジンは以下のプラットフォームでサポートされています: `linuxX64`、`macosX64`、`macosArm64`、`mingwX64`。`Curl`エンジンを使用するには、以下の手順に従ってください。

1.  [libcurlライブラリ](https://curl.se/libcurl/)をインストールします。
    > Linuxでは、libcurlの`gnutls`バージョンをインストールする必要があります。
    > このバージョンをUbuntuにインストールするには、以下を実行します。
    ```bash
    sudo apt-get install libcurl4-gnutls-dev
    ```

    > Windowsでは、[MinGW/MSYS2](FAQ.topic#native-curl)の`curl`バイナリを検討するとよいでしょう。
2.  `ktor-client-curl`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-curl"/>
    <var name="target" value="-macosx64"/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
3.  `HttpClient`コンストラクタに`Curl`クラスを引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.curl.*

    val client = HttpClient(Curl)
    ```

4.  エンジンを構成するには、`CurlClientEngineConfig`によって公開されている設定を`engine`メソッドに渡します。
    以下のコードスニペットは、テスト目的でSSL検証を無効にする方法を示しています。
    ```kotlin
    ```
    {src="snippets/client-engine-curl/src/nativeMain/kotlin/Main.kt" include-lines="8-12"}

    完全な例は以下で確認できます: [client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)。

## JVM、Android、およびNative {id="jvm-android-native"}

### CIO {id="cio"}
CIOは、JVM、Android、およびNativeプラットフォームで使用できる完全に非同期のコルーチンベースのエンジンです。現在のところ、HTTP/1.xのみをサポートしています。使用するには、以下の手順に従ってください。
1.  `ktor-client-cio`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-cio"/>
    <include from="lib.topic" element-id="add_ktor_artifact"/>
2.  `HttpClient`コンストラクタに[CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)クラスを引数として渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/CioCreate.kt"}

3.  エンジンを構成するには、[CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html)によって公開されている設定を`engine`メソッドに渡します。
    ```kotlin
    ```
    {src="snippets/_misc_client/CioConfig.kt" interpolate-variables="true" disable-links="false"}

## JavaScript {id="js"}

`Js`エンジンは[JavaScriptプロジェクト](https://kotlinlang.org/docs/js-overview.html)で使用できます。このエンジンはブラウザアプリケーションには[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)を、Node.jsには`node-fetch`を使用します。使用するには、以下の手順に従ってください。

1.  `ktor-client-js`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-js"/>
    <var name="target" value=""/>
    <include from="lib.topic" element-id="add_ktor_artifact_mpp"/>
2.  `HttpClient`コンストラクタに`Js`クラスを引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.js.*

    val client = HttpClient(Js)
    ```

    また、`JsClient`関数を呼び出して`Js`エンジンのシングルトンを取得することもできます。
    ```kotlin
    import io.ktor.client.engine.js.*

    val client = JsClient()
    ```

完全な例は以下で確認できます: [client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)。

## 例: マルチプラットフォームモバイルプロジェクトでエンジンを構成する方法 {id="mpp-config"}

マルチプラットフォームモバイルプロジェクトでエンジン固有のオプションを構成するには、[expect/actual宣言](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)を使用できます。
[](client-create-multiplatform-application.md)チュートリアルで作成されたプロジェクトを使用して、これを実現する方法をデモンストレーションしましょう。

1.  `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt`ファイルを開き、クライアント構成を受け取り`HttpClient`を返すトップレベル関数`httpClient`を追加します。
    ```kotlin
    expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
    ```

2.  `shared/src/androidMain/kotlin/com/example/kmmktor/Platform.kt`を開き、Androidモジュール用の`httpClient`関数の`actual`宣言を追加します。
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
    この例は、[OkHttp](#okhttp)エンジンの構成方法を示していますが、[Androidでサポートされている](#jvm-android)他のエンジンを使用することもできます。

3.  `shared/src/iosMain/kotlin/com/example/kmmktor/Platform.kt`を開き、iOSモジュール用の`httpClient`関数の`actual`宣言を追加します。
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

4.  最後に、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`を開き、`HttpClient()`コンストラクタを`httpClient`関数の呼び出しに置き換えます。
    ```kotlin
    private val client = httpClient()