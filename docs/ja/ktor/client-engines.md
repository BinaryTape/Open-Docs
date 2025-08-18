[//]: # (title: クライアントエンジン)

<show-structure for="chapter" depth="2"/>

<link-summary>
ネットワークリクエストを処理するエンジンについて学習します。
</link-summary>

[Ktor HTTPクライアント](client-create-and-configure.md)は、JVM、[Android](https://kotlinlang.org/docs/android-overview.html)、[JavaScript](https://kotlinlang.org/docs/js-overview.html)、[Native](https://kotlinlang.org/docs/native-overview.html)など、さまざまなプラットフォームで使用できます。特定のプラットフォームでは、ネットワークリクエストを処理する特定のエンジンが必要になる場合があります。
例えば、JVMアプリケーションには`Apache`または`Jetty`、Androidには`OkHttp`または`Android`、Kotlin/Nativeをターゲットとするデスクトップアプリケーションには`Curl`などを使用できます。異なるエンジンには特定の機能があり、異なる構成オプションが提供される場合があります。

## 要件と制限 {id="requirements"}

### サポートされるプラットフォーム {id="platforms"}

以下の表は、各エンジンがサポートする[プラットフォーム](client-supported-platforms.md)を示しています。

| エンジン  | プラットフォーム                                        |
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

### サポートされるAndroid/Javaバージョン {id="minimal-version"}

JVMまたはJVMとAndroidの両方をターゲットとするクライアントエンジンは、以下のAndroid/Javaバージョンをサポートします。

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
| Apache  | ✅️ _(Apache5の場合)_ | ✖️         |
| Java    | ✅                  | ✅️         |
| Jetty   | ✅                  | ✖️         |
| CIO     | ✖️                 | ✅          |
| Android | ✖️                 | ✖️         |
| OkHttp  | ✅                  | ✅          |
| Js      | ✅                  | ✅          |
| Darwin  | ✅                  | ✅          |
| WinHttp | ✅                  | ✅          |
| Curl    | ✅                  | ✅         |

また、一般的なクライアント構成や特定のプラグインの使用に影響する以下の制限事項も考慮する必要があります。
- エンジンがHTTP/2をサポートしている場合、エンジン構成をカスタマイズすることで有効にできます（[Java](#java)エンジンの例を参照）。
- Ktorクライアントで[SSL](client-ssl.md)を構成するには、選択したエンジンの構成をカスタマイズする必要があります。
- 一部のエンジンは[プロキシ](client-proxy.md#supported_engines)をサポートしていません。
- [Logging](client-logging.md)プラグインは、異なるプラットフォーム向けに異なるロガータイプを提供します。
- [HttpTimeout](client-timeout.md#limitations)プラグインには、特定のエンジンに対するいくつかの制限があります。

## エンジンの依存関係を追加する {id="dependencies"}

[ktor-client-core](client-dependencies.md)アーティファクトとは別に、Ktorクライアントは各エンジンに特定の依存関係を追加する必要があります。サポートされている各プラットフォームについて、利用可能なエンジンと必要な依存関係を対応するセクションで確認できます。
* [JVM](#jvm)
* [JVMとAndroid](#jvm-android)
* [JavaScript](#js)
* [Native](#native)

> 異なるエンジン向けに、Ktorは`-jvm`や`-js`などのサフィックスを持つプラットフォーム固有のアーティファクト（例: `ktor-client-cio-jvm`）を提供します。Gradleは指定されたプラットフォームに適したアーティファクトを解決しますが、Mavenはこの機能をサポートしていません。これは、Mavenの場合、プラットフォーム固有のサフィックスを手動で追加する必要があることを意味します。
>
{type="note"}

## 指定されたエンジンでクライアントを作成する {id="create"}
特定のエンジンでHTTPクライアントを作成するには、[HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)コンストラクターにエンジンクラスを引数として渡します。例えば、`CIO`エンジンでクライアントを作成するには、次のようにします。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*

val client = HttpClient(CIO)
```

### デフォルトエンジン {id="default"}
引数なしで`HttpClient`コンストラクターを呼び出すと、クライアントは[ビルドスクリプトで追加された](#dependencies)アーティファクトに応じてエンジンを自動的に選択します。
```kotlin
import io.ktor.client.*

val client = HttpClient()
```

これはマルチプラットフォームプロジェクトに役立ちます。例えば、[AndroidとiOS](client-create-multiplatform-application.md)の両方をターゲットとするプロジェクトの場合、`androidMain`ソースセットに[Android](#jvm-android)依存関係を、`iosMain`ソースセットに[Darwin](#darwin)依存関係を追加できます。必要な依存関係はコンパイル時に選択されます。

## エンジンを構成する {id="configure"}
`engine`メソッドを使用してエンジンを構成できます。すべてのエンジンは、[HttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.engine/-http-client-engine-config/index.html)によって公開されるいくつかの共通プロパティを共有しています。例:

```kotlin
HttpClient() {
    engine {
        // this: HttpClientEngineConfig
        threadsCount = 4
        pipelining = true
    }
}
```

特定のエンジンを構成する方法については、以下の対応するセクションを参照してください。

## JVM {id="jvm"}
このセクションでは、JVMで利用可能なエンジンについて見ていきます。

### Apache {id="apache"}
`Apache`エンジンはHTTP/1.1をサポートし、複数の構成オプションを提供します。
HTTP/2のサポートが必要な場合は`Apache5`エンジンも使用できます。`Apache5`はデフォルトでHTTP/2が有効になっています。

1. `ktor-client-apache5`または`ktor-client-apache`の依存関係を追加します。

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
2. `Apache5`/`Apache`クラスを`HttpClient`コンストラクターの引数として渡します。

   <Tabs group="apache_version">
   <TabItem title="Apache5">
   
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache5.*
   
   val client = HttpClient(Apache5)
   ```
   
   </TabItem>
   <TabItem title="Apache">
   
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache.*
   
   val client = HttpClient(Apache)
   ```
   
   </TabItem>
   </Tabs>

3. エンジンを構成するには、`Apache5EngineConfig`/`ApacheEngineConfig`によって公開される設定を`engine`メソッドに渡します。

   <Tabs group="apache_version">
   <TabItem title="Apache5">

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

   </TabItem>
   <TabItem title="Apache">

   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.apache.*
   import org.apache.http.HttpHost
   
   val client = HttpClient(Apache) {
       engine {
           // this: ApacheEngineConfig
           followRedirects = true
           socketTimeout = 10_000
           connectTimeout = 10_000
           connectionRequestTimeout = 20_000
           customizeClient {
               // this: HttpAsyncClientBuilder
               setProxy(HttpHost("127.0.0.1", 8080))
               setMaxConnTotal(1000)
               setMaxConnPerRoute(100)
               // ...
           }
           customizeRequest {
               // this: RequestConfig.Builder
           }
       }
   }
   ```

   </TabItem>
   </Tabs>

### Java {id="java"}
`Java`エンジンは、Java 11で導入された[Java HTTPクライアント](https://openjdk.java.net/groups/net/httpclient/intro.html)を使用します。これを使用するには、以下の手順に従います。
1. `ktor-client-java`の依存関係を追加します。

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
2. [Java](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.java.*
   
   val client = HttpClient(Java)
   ```
3. エンジンを構成するには、[JavaHttpConfig](https://api.ktor.io/ktor-client/ktor-client-java/io.ktor.client.engine.java/-java-http-config/index.html)によって公開される設定を`engine`メソッドに渡します。
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
1. `ktor-client-jetty-jakarta`の依存関係を追加します。

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
2. [Jetty](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.jetty.jakarta.*
   
   val client = HttpClient(Jetty)
   ```
3. エンジンを構成するには、[JettyEngineConfig](https://api.ktor.io/ktor-client/ktor-client-jetty-jakarta/io.ktor.client.engine.jetty.jakarta/-jetty-engine-config/index.html)によって公開される設定を`engine`メソッドに渡します。
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
1. `ktor-client-android`の依存関係を追加します。

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
2. [Android](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.android.*
   
   val client = HttpClient(Android)
   ```
3. エンジンを構成するには、[AndroidEngineConfig](https://api.ktor.io/ktor-client/ktor-client-android/io.ktor.client.engine.android/-android-engine-config/index.html)によって公開される設定を`engine`メソッドに渡します。
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
1. `ktor-client-okhttp`の依存関係を追加します。

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
2. [OkHttp](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.okhttp.*
   
   val client = HttpClient(OkHttp)
   ```
3. エンジンを構成するには、[OkHttpConfig](https://api.ktor.io/ktor-client/ktor-client-okhttp/io.ktor.client.engine.okhttp/-ok-http-config/index.html)によって公開される設定を`engine`メソッドに渡します。
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
このセクションでは、[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)をターゲットとするエンジンの構成方法について見ていきます。

> Kotlin/NativeプロジェクトでKtorを使用するには、[新しいメモリマネージャー](https://kotlinlang.org/docs/native-memory-manager.html)が必要です。これはKotlin 1.7.20以降でデフォルトで有効になっています。
>
{id="newmm-note"}

### Darwin {id="darwin"}
`Darwin`エンジンは[Darwinベース](https://en.wikipedia.org/wiki/Darwin_(operating_system))のオペレーティングシステム（macOS、iOS、tvOSなど）をターゲットとし、内部で[NSURLSession](https://developer.apple.com/documentation/foundation/nsurlsession)を使用します。`Darwin`エンジンを使用するには、以下の手順に従います。

1. `ktor-client-darwin`の依存関係を追加します。

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
2. `Darwin`クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.darwin.*
   
   val client = HttpClient(Darwin)
   ```
3. エンジンを構成するには、[DarwinClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-darwin/io.ktor.client.engine.darwin/-darwin-client-engine-config/index.html)によって公開される設定を`engine`関数に渡します。
   例えば、`configureRequest`関数を使用して`NSMutableURLRequest`にアクセスしたり、`configureSession`を使用してセッション構成をカスタマイズしたりできます。以下のコードスニペットは`configureRequest`の使用方法を示しています。
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

1. `ktor-client-winhttp`の依存関係を追加します。

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
2. `WinHttp`クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.winhttp.*
   
   val client = HttpClient(WinHttp)
   ```
3. エンジンを構成するには、[WinHttpClientEngineConfig](https://api.ktor.io/ktor-client/ktor-client-winhttp/io.ktor.client.engine.winhttp/-winhttp-client-engine-config/index.html)によって公開される設定を`engine`関数に渡します。
   例えば、`protocolVersion`プロパティを使用してHTTPバージョンを変更できます。
   ```kotlin
   val client = HttpClient(WinHttp) {
       engine {
           protocolVersion = HttpProtocolVersion.HTTP_1_1
       }
   }
   ```

   完全な例は[client-engine-winhttp](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-winhttp)で見つけることができます。

### Curl {id="curl"}

デスクトッププラットフォーム向けに、Ktorは`Curl`エンジンも提供しています。このエンジンは以下のプラットフォームでサポートされています: `linuxX64`、`linuxArm64`、`macosX64`、`macosArm64`、`mingwX64`。`Curl`エンジンを使用するには、以下の手順に従います。

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
3. `Curl`クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.curl.*
   
   val client = HttpClient(Curl)
   ```

4. エンジンを構成するには、`CurlClientEngineConfig`によって公開される設定を`engine`メソッドに渡します。
   以下のコードスニペットは、テスト目的でSSL検証を無効にする方法を示しています。
   ```kotlin
   val client = HttpClient(Curl) {
       engine {
           sslVerify = false
       }
   }
   ```

   完全な例は[client-engine-curl](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-curl)で見つけることができます。

## JVM、Android、Native {id="jvm-android-native"}

### CIO {id="cio"}
CIOは、JVM、Android、Nativeプラットフォームで使用できる完全に非同期のコルーチンベースのエンジンです。現在のところ、HTTP/1.xのみをサポートしています。これを使用するには、以下の手順に従います。
1. `ktor-client-cio`の依存関係を追加します。

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
2. [CIO](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o/index.html)クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.cio.*
   
   val client = HttpClient(CIO)
   ```

3. エンジンを構成するには、[CIOEngineConfig](https://api.ktor.io/ktor-client/ktor-client-cio/io.ktor.client.engine.cio/-c-i-o-engine-config/index.html)によって公開される設定を`engine`メソッドに渡します。
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

1. `ktor-client-js`の依存関係を追加します。

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
2. `Js`クラスを`HttpClient`コンストラクターの引数として渡します。
   ```kotlin
   import io.ktor.client.*
   import io.ktor.client.engine.js.*
   
   val client = HttpClient(Js)
   ```

   `JsClient`関数を呼び出して、`Js`エンジンのシングルトンを取得することもできます。
   ```kotlin
   import io.ktor.client.engine.js.*

   val client = JsClient()
   ```

完全な例は[client-engine-js](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-engine-js)で見つけることができます。

## 例: マルチプラットフォームモバイルプロジェクトでエンジンを構成する方法 {id="mpp-config"}

マルチプラットフォームモバイルプロジェクトでエンジン固有のオプションを構成するには、[expect/actual宣言](https://kotlinlang.org/docs/multiplatform-mobile-connect-to-platform-specific-apis.html)を使用できます。
[クロスプラットフォームモバイルアプリケーションの作成](client-create-multiplatform-application.md)チュートリアルで作成したプロジェクトを使用して、これを実現する方法を示します。

1. `shared/src/commonMain/kotlin/com/example/kmmktor/Platform.kt`ファイルを開き、クライアント構成を受け取り`HttpClient`を返すトップレベルの`httpClient`関数を追加します。
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
   この例では[OkHttp](#okhttp)エンジンの構成方法を示していますが、[Androidでサポートされている](#jvm-android)他のエンジンも使用できます。

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

4. 最後に、`shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt`を開き、`HttpClient()`コンストラクターを`httpClient`関数呼び出しに置き換えます。
   ```kotlin
   private val client = httpClient()