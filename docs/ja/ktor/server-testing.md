[//]: # (title: Ktorサーバーでのテスト)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。
</link-summary>

Ktorは、Webサーバーを作成せず、ソケットにバインドせず、実際のHTTPリクエストを行わない特別なテストエンジンを提供します。代わりに、内部メカニズムに直接フックし、アプリケーション呼び出しを直接処理します。これにより、テストのために完全なWebサーバーを実行するよりも、テストの実行が高速になります。

## 依存関係の追加 {id="add-dependencies"}
サーバーKtorアプリケーションをテストするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `ktor-server-test-host` 依存関係を追加します。

   <var name="artifact_name" value="ktor-server-test-host"/>
   
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
    

* テストでアサーションを実行するための一連のユーティリティ関数を提供する`kotlin-test`依存関係を追加します。

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  
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
    

> [Nativeサーバー](server-native.md#add-dependencies)をテストするには、テストアーティファクトを`nativeTest`ソースセットに追加します。

## テストの概要 {id="overview"}

テストエンジンを使用するには、以下の手順に従います。
1. JUnitテストクラスとテスト関数を作成します。
2. [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html)関数を使用して、ローカルで実行される設定済みのテストアプリケーションインスタンスをセットアップします。
3. テストアプリケーション内で[Ktor HTTPクライアント](client-create-and-configure.md)インスタンスを使用してサーバーにリクエストを行い、レスポンスを受け取り、アサーションを行います。

以下のコードは、`/`パスへのGETリクエストを受け入れ、プレーンテキストレスポンスを返す最もシンプルなKtorアプリケーションをテストする方法を示しています。

<tabs>
<tab title="テスト">

[object Promise]

</tab>

<tab title="アプリケーション">

[object Promise]

</tab>
</tabs>

実行可能なコード例は以下で利用できます: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## アプリケーションのテスト {id="test-app"}

### ステップ1: テストアプリケーションの設定 {id="configure-test-app"}

テストアプリケーションの設定には、以下のステップが含まれる場合があります。
- [アプリケーションモジュールの追加](#add-modules)
- [(オプション) ルートの追加](#add-routing)
- [(オプション) 環境のカスタマイズ](#environment)
- [(オプション) 外部サービスのモック](#external-services)

> デフォルトでは、設定されたテストアプリケーションは[最初のクライアント呼び出し](#make-request)で起動します。
> オプションで、`startApplication`関数を呼び出してアプリケーションを手動で起動することもできます。
> これは、アプリケーションの[ライフサイクルイベント](server-events.md#predefined-events)をテストする必要がある場合に役立つかもしれません。

#### アプリケーションモジュールの追加 {id="add-modules"}

アプリケーションをテストするには、その[モジュール](server-modules.md)を`testApplication`にロードする必要があります。そのためには、[モジュールを明示的にロードする](#explicit-module-loading)か、[環境を設定](#configure-env)して設定ファイルからロードする必要があります。

##### モジュールの明示的なロード {id="explicit-module-loading"}

テストアプリケーションにモジュールを手動で追加するには、`application`関数を使用します。

[object Promise]

#### 設定ファイルからのモジュールのロード {id="configure-env"}

設定ファイルからモジュールをロードしたい場合は、`environment`関数を使用してテスト用の設定ファイルを指定します。

[object Promise]

この方法は、異なる環境を模倣したり、テスト中にカスタム設定を使用したりする必要がある場合に便利です。

> `application`ブロック内で`Application`インスタンスにアクセスすることもできます。

#### ルートの追加 {id="add-routing"}

`routing`関数を使用して、テストアプリケーションにルートを追加できます。
これは、以下のユースケースで便利かもしれません。
- テストアプリケーションに[モジュールを追加する](#add-modules)代わりに、テストすべき[特定のルート](server-routing.md#route_extension_function)を追加できます。
- テストアプリケーションでのみ必要なルートを追加できます。以下の例は、テストでユーザー[セッション](server-sessions.md)を初期化するために使用される`/login-test`エンドポイントを追加する方法を示しています。
   [object Promise]
   
   テストを含む完全な例は以下で見つけることができます: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 環境のカスタマイズ {id="environment"}

テストアプリケーション用のカスタム環境を構築するには、`environment`関数を使用します。
例えば、テスト用のカスタム設定を使用するには、`test/resources`フォルダーに設定ファイルを作成し、`config`プロパティを使用してロードできます。

[object Promise]

設定プロパティを指定するもう1つの方法は、[MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)を使用することです。これは、アプリケーションが起動する前にアプリケーション設定にアクセスしたい場合に役立つかもしれません。以下の例は、`config`プロパティを使用して`MapApplicationConfig`を`testApplication`関数に渡す方法を示しています。

[object Promise]

#### 外部サービスのモック {id="external-services"}

Ktorでは、`externalServices`関数を使用して外部サービスをモックできます。
この関数内で、2つのパラメーターを受け入れる`hosts`関数を呼び出す必要があります。
- `hosts`パラメーターは外部サービスのURLを受け入れます。
- `block`パラメーターは、外部サービスのモックとして機能する`Application`を設定することを可能にします。この`Application`にルーティングを設定したり、プラグインをインストールしたりできます。

以下のサンプルは、Google APIによって返されるJSONレスポンスをシミュレートするために`externalServices`を使用する方法を示しています。

[object Promise]

テストを含む完全な例は以下で見つけることができます: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### ステップ2: (オプション) クライアントの設定 {id="configure-client"}

`testApplication`は、`client`プロパティを使用してデフォルト設定のHTTPクライアントへのアクセスを提供します。
クライアントをカスタマイズして追加のプラグインをインストールする必要がある場合は、`createClient`関数を使用できます。例えば、テストのPOST/PUTリクエストで[JSONデータ](#json-data)を送信するには、[ContentNegotiation](client-serialization.md)プラグインをインストールできます。
[object Promise]

### ステップ3: リクエストの作成 {id="make-request"}

アプリケーションをテストするには、[設定済みのクライアント](#configure-client)を使用して[リクエスト](client-requests.md)を行い、[レスポンス](client-responses.md)を受け取ります。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)は、`POST`リクエストを処理する`/customer`エンドポイントをテストする方法を示しています。

[object Promise]

### ステップ4: 結果のアサート {id="assert"}

[レスポンス](#make-request)を受け取った後、[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/)ライブラリが提供するアサーションを使用して結果を検証できます。

[object Promise]

## POST/PUTリクエストのテスト {id="test-post-put"}

### フォームデータの送信 {id="form-data"}

テストのPOST/PUTリクエストでフォームデータを送信するには、`Content-Type`ヘッダーを設定し、リクエストボディを指定する必要があります。これを行うには、それぞれ[header](client-requests.md#headers)関数と[setBody](client-requests.md#body)関数を使用できます。以下の例は、`x-www-form-urlencoded`と`multipart/form-data`の両方のタイプを使用してフォームデータを送信する方法を示しています。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)の例からの以下のテストは、`x-www-form-urlencoded`コンテンツタイプを使用して送信されたフォームパラメーターを含むテストリクエストを作成する方法を示しています。[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html)関数がキー/値ペアのリストからフォームパラメーターをエンコードするために使用されることに注意してください。

<tabs>
<tab title="テスト">

[object Promise]

</tab>

<tab title="アプリケーション">

[object Promise]

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

以下のコードは、`multipart/form-data`を構築し、ファイルアップロードをテストする方法を示しています。完全な例は以下で見つけることができます: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<tabs>
<tab title="テスト">

[object Promise]

</tab>

<tab title="アプリケーション">

[object Promise]

</tab>
</tabs>

### JSONデータの送信 {id="json-data"}

テストのPOST/PUTリクエストでJSONデータを送信するには、新しいクライアントを作成し、特定の形式でコンテンツをシリアライズ/デシリアライズできる[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。リクエスト内で、`contentType`関数を使用して`Content-Type`ヘッダーを指定し、[setBody](client-requests.md#body)を使用してリクエストボディを指定できます。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)は、`POST`リクエストを処理する`/customer`エンドポイントをテストする方法を示しています。

<tabs>
<tab title="テスト">

[object Promise]

</tab>

<tab title="アプリケーション">

[object Promise]

</tab>
</tabs>

## テスト中のクッキーの保持 {id="preserving-cookies"}

テスト中にリクエスト間でクッキーを保持する必要がある場合は、新しいクライアントを作成し、[HttpCookies](client-cookies.md)プラグインをインストールする必要があります。[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)の例からの以下のテストでは、クッキーが保持されるため、各リクエスト後にリロード回数が増加します。

<tabs>
<tab title="テスト">

[object Promise]

</tab>

<tab title="アプリケーション">

[object Promise]

</tab>
</tabs>

## HTTPSのテスト {id="https"}

[HTTPSエンドポイント](server-ssl.md)をテストする必要がある場合は、[URLBuilder.protocol](client-requests.md#url)プロパティを使用してリクエストを行うために使用されるプロトコルを変更します。

[object Promise]

完全な例は以下で見つけることができます: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## WebSocketsのテスト {id="testing-ws"}

クライアントが提供する[WebSockets](client-websockets.topic)プラグインを使用することで、[WebSocket通信](server-websockets.md)をテストできます。

[object Promise]

## HttpClientを使用したエンドツーエンドテスト {id="end-to-end"}
テストエンジンとは別に、サーバーアプリケーションのエンドツーエンドテストには[Ktor HTTPクライアント](client-create-and-configure.md)を使用できます。
以下の例では、HTTPクライアントが`TestServer`に対してテストリクエストを行います。

[object Promise]

完全な例については、これらのサンプルを参照してください。
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): テスト対象のサンプルサーバーです。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): テストサーバーをセットアップするためのヘルパークラスと関数が含まれています。