[//]: # (title: クライアントエンジン)

<show-structure for="chapter" depth="2"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学習します。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)はマルチプラットフォームであり、JVM、
[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)
(WebAssemblyを含む)、および[Native](https://kotlinlang.org/docs/native-overview.html)ターゲットで動作します。各プラットフォームでは、ネットワークリクエストを処理するために特定のエンジンが必要です。
例えば、JVMアプリケーションには`Apache`または`Jetty`、Androidには`OkHttp`または`Android`、Kotlin/Nativeをターゲットとするデスクトップアプリケーションには`Curl`を使用できます。各エンジンは機能と構成が若干異なるため、プラットフォームとユースケースのニーズに最適なものを選択できます。

## サポートされるプラットフォーム {id="platforms"}

以下の表は、各エンジンがサポートする[プラットフォーム](client-supported-platforms.md)を示しています。

| Engine    | Platforms                                                                                                         |
|-----------|-------------------------------------------------------------------------------------------------------------------|
| `Apache5` | [JVM](#jvm)                                                                                                       |
| `Java`    | [JVM](#jvm)                                                                                                       |
| `Jetty`   | [JVM](#jvm)                                                                                                       |
| `Android` | [JVM](#jvm), [Android](#jvm-android)                                                                              |
| `OkHttp`  | [JVM](#jvm), [Android](#jvm-android)                                                                              |
| `Darwin`  | [Native](#native)                                                                                                 |
| `WinHttp` | [Native](#native)                                                                                                 |
| `Curl`    | [Native](#native)                                                                                                 |
| `CIO`     | [JVM](#jvm), [Android](#jvm-android), [Native](#native), [JavaScript](#js), [WasmJs](#jvm-android-native-wasm-js) |
| `Js`      | [JavaScript](#js)                                                                                                 |

## サポートされるAndroid/Javaバージョン {id="minimum-version"}

JVMまたはJVMとAndroidの両方をターゲットとするクライアントエンジンは、以下のAndroid/Javaバージョンをサポートします。

| Engine    | Android version   | Java version |
|-----------|-------------------|--------------|
| `Apache5` |                   | 8+           |
| `Java`    |                   | 11+          |
| `Jetty`   |                   | 11+          |
| `CIO`     | 7.0+ <sup>*</sup> | 8+           |
| `Android` | 1.x+              | 8+           |
| `OkHttp`  | 5.0+              | 8+           |

_* 古いAndroidバージョンでCIOエンジンを使用するには、[Java 8 API desugaring](https://developer.android.com/studio/write/java8-support)を有効にする必要があります。_

## エンジンの依存関係を追加する {id="dependencies"}

[`ktor-client-core`](client-dependencies.md)アーティファクトに加えて、Ktorクライアントは特定のエンジンの依存関係を必要とします。サポートされている各プラットフォームには、対応するセクションで説明されている利用可能なエンジンのセットがあります。

*   [JVM](#jvm)
*   [JVMとAndroid](#jvm-android)
*   [JavaScript](#js)
*   [Native](#native)

> Ktorは、`-jvm`や`-js`などのサフィックスを持つプラットフォーム固有のアーティファクト（例: `ktor-client-cio-jvm`）を提供します。依存関係の解決はビルドツールによって異なります。Gradleは指定されたプラットフォームに適したアーティファクトを解決しますが、Mavenはこの機能をサポートしていません。これは、Mavenの場合、プラットフォームサフィックスを手動で指定する必要があることを意味します。
>
{type="note"}

## エンジンを指定する {id="create"}

特定のエンジンを使用するには、エンジンクラスを[
`HttpClient`](https://api.ktor.io/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクターに渡します。次の例は、`CIO`エンジンでクライアントを作成します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

## デフォルトエンジン {id="default"}

エンジン引数を省略した場合、クライアントは[ビルドスクリプト](#dependencies)内の依存関係に基づいてエンジンを自動的に選択します。

```kotlin
import io.ktor.client.*

val client = HttpClient()
```

これはマルチプラットフォームプロジェクトで特に便利です。例えば、[AndroidとiOS](client-create-multiplatform-application.md)の両方をターゲットとするプロジェクトの場合、`androidMain`ソースセットに[Android](#jvm-android)の依存関係を、`iosMain`ソースセットに[Darwin](#darwin)の依存関係を追加できます。`HttpClient`の作成時に、適切なエンジンが実行時に選択されます。

## エンジンを構成する {id="configure"}

エンジンを構成するには、`engine {}`関数を使用します。すべてのエンジンは、[
`HttpClientEngineConfig`](https://api.ktor.io/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html)からの共通オプションを使用して構成できます。

```kotlin
HttpClient() {
    engine {
        // this: HttpClientEngineConfig
        threadsCount = 4
        pipelining = true
    }
}
```

次のセクションでは、異なるプラットフォームで特定のエンジンを構成する方法について説明します。

## JVM {id="jvm"}

JVMターゲットは、[`Apache5`](#apache5)、[`Java`](#java)、および
[`Jetty`](#jetty)エンジンをサポートします。

### Apache5 {id="apache5"}

`Apache5`エンジンはHTTP/1.1とHTTP/2の両方をサポートし、HTTP/2はデフォルトで有効になっています。
これは新規プロジェクトに推奨されるApacheベースのエンジンです。

> 古い`Apache`エンジンはApache HttpClient 4に依存しており、これは非推奨です。
> 後方互換性のためだけに維持されています。すべての新規プロジェクトでは`Apache5`を使用してください。
>
{style="note"}

1.  `ktor-client-apache5`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-apache5"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>

2.  `Apache5`クラスを`HttpClient`コンストラクターの引数として渡します。

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.apache5.*
    
    val client = HttpClient(Apache5)
    ```

3.  `engine {}`ブロックを使用して、`Apache5EngineConfig`からプロパティにアクセスして設定します。

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.apache5.*
    import org.apache.hc.core5.http.*
    
    val client = HttpClient(Apache5) {
        engine {
            // this: Apache5EngineConfig
            followRedirects = true
            socketTimeout = 10_000
            connectTimeout = 10_000
            connectionRequestTimeout = 20_000
            customizeClient {
                // this: HttpAsyncClientBuilder
                setProxy(HttpHost("127.0.0.1", 8080))
                // ...
            }
            customizeRequest {
                // this: RequestConfig.Builder
            }
        }
    }
    ```

### Java {id="java"}

`Java`エンジンは、Java 11で導入された[Java HTTPクライアント](https://openjdk.java.net/groups/net/httpclient/intro.html)を使用します。これを使用するには、以下の手順に従います。

1.  `ktor-client-java`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-java"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  [Java](https://api.ktor.io/ktor-client-java/io.ktor.client.engine.java/-java/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.java.*
    
    val client = HttpClient(Java)
    ```
3.  エンジンを構成するには、`engine {}`ブロックで[
    `JavaHttpConfig`](https://api.ktor.io/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html)からプロパティを設定します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.*
    import io.ktor.client.engine.java.*
    
    val client = HttpClient(Java) {
        engine {
            // this: JavaHttpConfig
            threadsCount = 8
            pipelining = true
            proxy = ProxyBuilder.http("http://proxy-server.com/")
            protocolVersion = java.net.http.HttpClient.Version.HTTP_2
        }
    }
    ```

### Jetty {id="jetty"}

`Jetty`エンジンはHTTP/2のみをサポートし、以下の方法で構成できます。

1.  `ktor-client-jetty-jakarta`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-jetty-jakarta"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  [
    `Jetty`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.jetty.jakarta.*
    
    val client = HttpClient(Jetty)
    ```
3.  エンジンを構成するには、`engine {}`ブロックで
    [`JettyEngineConfig`](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html)からプロパティを設定します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.jetty.jakarta.*
    import org.eclipse.jetty.util.ssl.SslContextFactory
    
    val client = HttpClient(Jetty) {
        engine {
            // this: JettyEngineConfig
            sslContextFactory = SslContextFactory.Client()
            clientCacheSize = 12
        }
    }
    ```

## JVMとAndroid {id="jvm-android"}

このセクションでは、JVM/Androidで利用可能なエンジンとその構成について見ていきます。

### Android {id="android"}

`Android`エンジンはAndroidをターゲットとしており、以下の方法で構成できます。

1.  `ktor-client-android`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-android"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  [
    `Android`](https://api.ktor.io/ktor-client-android/io.ktor.client.engine.android/-android/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.android.*
    
    val client = HttpClient(Android)
    ```
3.  エンジンを構成するには、`engine {}`ブロックで[
    `AndroidEngineConfig`](https://api.ktor.io/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html)からプロパティを設定します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.android.*
    import java.net.Proxy
    import java.net.InetSocketAddress
    
    val client = HttpClient(Android) {
        engine {
            // this: AndroidEngineConfig
            connectTimeout = 100_000
            socketTimeout = 100_000
            proxy = Proxy(Proxy.Type.HTTP, InetSocketAddress("localhost", 8080))
        }
    }
    ```

### OkHttp {id="okhttp"}

`OkHttp`エンジンはOkHttpに基づいており、以下の方法で構成できます。

1.  `ktor-client-okhttp`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-okhttp"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  [
    `OkHttp`](https://api.ktor.io/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.okhttp.*
    
    val client = HttpClient(OkHttp)
    ```
3.  エンジンを構成するには、`engine {}`ブロックで[
    `OkHttpConfig`](https://api.ktor.io/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html)からプロパティを設定します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.okhttp.*
    
    val client = HttpClient(OkHttp) {
        engine {
            // this: OkHttpConfig
            config {
                // this: OkHttpClient.Builder
                followRedirects(true)
                // ...
            }
            addInterceptor(interceptor)
            addNetworkInterceptor(interceptor)
    
            preconfigured = okHttpClientInstance
        }
    }
    ```

## Native {id="native"}

Ktorは、[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)ターゲット向けに、[`Darwin`](#darwin)、[`WinHttp`](#winhttp)、および[`Curl`](#curl)エンジンを提供しています。

> Kotlin/NativeプロジェクトでKtorを使用するには、[新しいメモリマネージャー](https://kotlinlang.org/docs/native-memory-manager.html)が必要です。これはKotlin 1.7.20以降でデフォルトで有効になっています。
>
{id="newmm-note" style="note"}

### Darwin {id="darwin"}

`Darwin`エンジンは、macOS、iOS、tvOS、watchOSなどの[Darwinベース](https://en.wikipedia.org/wiki/Darwin_(operating_system))のオペレーティングシステムをターゲットとし、内部で[`NSURLSession`](https://developer.apple.com/documentation/foundation/nsurlsession)を使用します。`Darwin`エンジンを使用するには、以下の手順に従います。

1.  `ktor-client-darwin`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-darwin"/>
    <var name="target" value="-macosx64"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  `Darwin`クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.darwin.*
    
    val client = HttpClient(Darwin)
    ```
3.  `engine {}`ブロックで、[
    `DarwinClientEngineConfig`](https://api.ktor.io/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html)を使用してエンジンを構成します。例えば、`configureRequest`でリクエストを、または`configureSession`でセッションをカスタマイズできます。
    ```kotlin
    val client = HttpClient(Darwin) {
        engine {
            configureRequest {
                setAllowsCellularAccess(true)
            }
        }
    }
    ```

    完全な例は[client-engine-darwin](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-darwin)で見つけることができます。

### WinHttp {id="winhttp"}

`WinHttp`エンジンはWindowsベースのオペレーティングシステムをターゲットとしています。
`WinHttp`エンジンを使用するには、以下の手順に従います。

1.  `ktor-client-winhttp`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-winhttp"/>
    <var name="target" value="-mingwx64"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  `WinHttp`クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.winhttp.*
    
    val client = HttpClient(WinHttp)
    ```
3.  `engine {}`ブロックで、[
    `WinHttpClientEngineConfig`](https://api.ktor.io/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html)を使用してエンジンを構成します。例えば、`protocolVersion`プロパティを使用してHTTPバージョンを変更できます。
    ```kotlin
    val client = HttpClient(WinHttp) {
        engine {
            protocolVersion = HttpProtocolVersion.HTTP_1_1
        }
    }
    ```

    完全な例は[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)で見つけることができます。

### Curl {id="curl"}

デスクトッププラットフォーム向けに、Ktorは`Curl`エンジンを提供しています。このエンジンは`linuxX64`、`linuxArm64`、`macosX64`、`macosArm64`、および`mingwX64`でサポートされています。`Curl`エンジンを使用するには、以下の手順に従います。

1.  `ktor-client-curl`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-curl"/>
    <var name="target" value="-macosx64"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  `Curl`クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.curl.*
    
    val client = HttpClient(Curl)
    ```

3.  `engine {}`ブロックで`CurlClientEngineConfig`を使用してエンジンを構成します。
    例えば、テスト目的でSSL検証を無効にする方法を以下に示します。
    ```kotlin
    val client = HttpClient(Curl) {
        engine {
            sslVerify = false
        }
    }
    ```

    完全な例は[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)で見つけることができます。

## JVM、Android、Native、JS、およびWasmJs {id="jvm-android-native-wasm-js"}

### CIO {id="cio"}

CIOエンジンは、JVM、Android、Native、JavaScript、およびWebAssembly JavaScript (WasmJs) プラットフォームで利用できる完全に非同期のコルーチンベースのエンジンです。現在のところ、HTTP/1.xのみをサポートしています。これを使用するには、以下の手順に従います。

1.  `ktor-client-cio`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-cio"/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  [`CIO`](https://api.ktor.io/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)クラスを
    `HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.cio.*
    
    val client = HttpClient(CIO)
    ```

3.  `engine {}`ブロックで、[
    `CIOEngineConfig`](https://api.ktor.io/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html)を使用してエンジンを構成します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.cio.*
    import io.ktor.network.tls.*
    
    val client = HttpClient(CIO) {
        engine {
            // this: CIOEngineConfig
            maxConnectionsCount = 1000
            endpoint {
                // this: EndpointConfig
                maxConnectionsPerRoute = 100
                pipelineMaxSize = 20
                keepAliveTime = 5000
                connectTimeout = 5000
                connectAttempts = 5
            }
            https {
                // this: TLSConfigBuilder
                serverName = "api.ktor.io"
                cipherSuites = CIOCipherSuites.SupportedSuites
                trustManager = myCustomTrustManager
                random = mySecureRandom
                addKeyStore(myKeyStore, myKeyStorePassword)
            }
        }
    }
    ```

## JavaScript {id="js"}

`Js`エンジンは[JavaScriptプロジェクト](https://kotlinlang.org/docs/js-overview.html)で使用できます。このエンジンは、ブラウザアプリケーションには[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)を、Node.jsには`node-fetch`を使用します。これを使用するには、以下の手順に従います。

1.  `ktor-client-js`の依存関係を追加します。

    <var name="artifact_name" value="ktor-client-js"/>
    <var name="target" value=""/>
    <Tabs group="languages">
        <TabItem title="Gradle (Kotlin)" group-key="kotlin">
            <code-block lang="Kotlin" code="               implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
        </TabItem>
        <TabItem title="Gradle (Groovy)" group-key="groovy">
            <code-block lang="Groovy" code="               implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
        </TabItem>
        <TabItem title="Maven" group-key="maven">
            <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%%target%&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
        </TabItem>
    </Tabs>
2.  `Js`クラスを`HttpClient`コンストラクターの引数として渡します。
    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.engine.js.*
    
    val client = HttpClient(Js)
    ```

    `JsClient()`関数を呼び出して、`Js`エンジンのシングルトンを取得することもできます。
    ```kotlin
    import io.ktor.client.engine.js.*

    val client = JsClient()
    ```

完全な例は[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)で見つけることができます。

## 制限事項 {id="limitations"}

### HTTP/2とWebSockets

すべてのエンジンがHTTP/2プロトコルをサポートしているわけではありません。エンジンがHTTP/2をサポートしている場合、エンジンの構成で有効にできます。例えば、[Java](#java)エンジンを使用する場合などです。

以下の表は、特定のエンジンがHTTP/2と[WebSockets](client-websockets.topic)をサポートしているかどうかを示しています。

| Engine    | HTTP/2 | WebSockets |
|-----------|--------|------------|
| `Apache5` | ✅️     | ✖️         |
| `Java`    | ✅      | ✅️         |
| `Jetty`   | ✅      | ✖️         |
| `CIO`     | ✖️     | ✅          |
| `Android` | ✖️     | ✖️         |
| `OkHttp`  | ✅      | ✅          |
| `Js`      | ✅      | ✅          |
| `Darwin`  | ✅      | ✅          |
| `WinHttp` | ✅      | ✅          |
| `Curl`    | ✅      | ✅          |

### セキュリティ

[SSL](client-ssl.md)はエンジンごとに構成する必要があります。各エンジンは独自のSSL構成オプションを提供します。

### プロキシのサポート

一部のエンジンはプロキシをサポートしていません。完全なリストについては、[プロキシのドキュメント](client-proxy.md#supported_engines)を参照してください。

### ロギング

[Logging](client-logging.md)プラグインは、ターゲットプラットフォームに応じて異なるロガータイプを提供します。

### タイムアウト

[HttpTimeout](client-timeout.md)プラグインには、特定のエンジンに対するいくつかの制限があります。完全なリストについては、[タイムアウトの制限](client-timeout.md#limitations)を参照してください。

## 例: マルチプラットフォームモバイルプロジェクトでエンジンを構成する方法 {id="mpp-config"}

マルチプラットフォームプロジェクトを構築する際、各ターゲットプラットフォームのエンジンを選択および構成するために、[expect/actual宣言](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)を使用できます。これにより、ほとんどのクライアント構成を共通コードで共有しながら、プラットフォームコードでエンジン固有のオプションを適用できます。
[クロスプラットフォームモバイルアプリケーションの作成](client-create-multiplatform-application.md)チュートリアルで作成したプロジェクトを使用して、これを実現する方法を示します。

<procedure>

1.  **shared/src/commonMain/kotlin/com/example/kmpktor/Platform.kt**ファイルを開き、構成ブロックを受け取り`HttpClient`を返すトップレベルの`httpClient()`関数を追加します。
    ```kotlin
    expect fun httpClient(config: HttpClientConfig<*>.() -> Unit = {}): HttpClient
    ```

2.  **shared/src/androidMain/kotlin/com/example/kmpktor/Platform.kt**を開き、Androidモジュール用の`httpClient()`関数のactual宣言を追加します。
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

    > この例は[`OkHttp`](#okhttp)エンジンの構成方法を示していますが、[Androidでサポートされている](#jvm-android)他のエンジンも使用できます。
    >
    {style="tip"}

3.  **shared/src/iosMain/kotlin/com/example/kmpktor/Platform.kt**を開き、iOSモジュール用の`httpClient()`関数のactual宣言を追加します。
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
    これで、どのエンジンが使用されるかを気にすることなく、共通コードで`httpClient()`を呼び出すことができます。

4.  共通コードでクライアントを使用するには、**shared/src/commonMain/kotlin/com/example/kmpktor/Greeting.kt**を開き、`HttpClient()`コンストラクターを`httpClient()`関数呼び出しに置き換えます。
    ```kotlin
    private val client = httpClient()
    ```

</procedure>