[//]: # (title: Ktor Serverでのテスト)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
特別なテストエンジンを使用してサーバーアプリケーションをテストする方法を学びます。
</link-summary>

Ktorは、Webサーバーを作成したり、ソケットにバインドしたり、実際のHTTPリクエストを送信したりしない特別なテストエンジンを提供しています。代わりに、内部メカニズムに直接フックし、アプリケーションコールを直接処理します。これにより、テストのために完全なWebサーバーを実行する場合と比較して、テスト実行が高速化されます。

## 依存関係の追加 {id="add-dependencies"}
サーバーKtorアプリケーションをテストするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `ktor-server-test-host` の依存関係を追加します。

   <var name="artifact_name" value="ktor-server-test-host"/>
   <include from="lib.topic" element-id="add_ktor_artifact_testing"/>

* テストでアサーションを実行するための一連のユーティリティ関数を提供する `kotlin-test` の依存関係を追加します。

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  <include from="lib.topic" element-id="add_artifact_testing"/>

> [ネイティブサーバー](server-native.md#add-dependencies)をテストするには、テストアーティファクトを `nativeTest` ソースセットに追加します。

## テストの概要 {id="overview"}

テストエンジンを使用するには、以下の手順に従ってください。
1. JUnitテストクラスとテスト関数を作成します。
2. [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 関数を使用して、ローカルで実行されるテストアプリケーションの設定済みインスタンスをセットアップします。
3. テストアプリケーション内で [Ktor HTTPクライアント](client-create-and-configure.md) インスタンスを使用して、サーバーへのリクエストを作成し、レスポンスを受信し、アサーションを行います。

以下のコードは、`/` パスへのGETリクエストを受け入れ、プレーンテキストレスポンスで応答する最もシンプルなKtorアプリケーションをテストする方法を示しています。

<tabs>
<tab title="テスト">

```kotlin
```
{src="snippets/engine-main/src/test/kotlin/EngineMainTest.kt"}

</tab>

<tab title="アプリケーション">

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

実行可能なコード例は、こちらで入手できます: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## アプリケーションのテスト {id="test-app"}

### ステップ1: テストアプリケーションの設定 {id="configure-test-app"}

テストアプリケーションの設定には、以下のステップが含まれる場合があります。
- [アプリケーションモジュールの追加](#add-modules)
- [(オプション) ルーティングの追加](#add-routing)
- [(オプション) 環境のカスタマイズ](#environment)
- [(オプション) 外部サービスのモック](#external-services)

> デフォルトでは、設定されたテストアプリケーションは [最初のクライアントコール](#make-request) 時に起動します。
> オプションで、`startApplication` 関数を呼び出してアプリケーションを手動で起動できます。
> これは、アプリケーションの [ライフサイクルイベント](server-events.md#predefined-events) をテストする必要がある場合に役立つことがあります。

#### アプリケーションモジュールの追加 {id="add-modules"}

アプリケーションをテストするには、その [モジュール](server-modules.md) を `testApplication` にロードする必要があります。これを行うには、[モジュールを明示的にロードする](#explicit-module-loading) か、構成ファイルからロードするように [環境を設定する](#configure-env) 必要があります。

##### モジュールの明示的なロード {id="explicit-module-loading"}

テストアプリケーションにモジュールを手動で追加するには、`application` 関数を使用します。

```kotlin
```
{src="snippets/embedded-server-modules/src/test/kotlin/EmbeddedServerTest.kt" include-symbol="testModule1"}

#### 構成ファイルからモジュールをロードする {id="configure-env"}

構成ファイルからモジュールをロードしたい場合は、`environment` 関数を使用してテスト用の構成ファイルを指定します。

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

この方法は、テスト中に異なる環境を模倣したり、カスタム構成設定を使用したりする必要がある場合に役立ちます。

> `application` ブロック内で `Application` インスタンスにアクセスすることもできます。

#### ルーティングの追加 {id="add-routing"}

`routing` 関数を使用して、テストアプリケーションにルーティングを追加できます。
これは、以下のユースケースで便利です。
- テストアプリケーションに [モジュールを追加する](#add-modules) 代わりに、テストすべき [特定のルーティング](server-routing.md#route_extension_function) を追加できます。
- テストアプリケーションでのみ必要なルーティングを追加できます。以下の例は、テストでユーザー [セッション](server-sessions.md) を初期化するために使用される `/login-test` エンドポイントを追加する方法を示しています。
   ```kotlin
   ```
   {src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,31-35,51"}

   テストを含む完全な例は、こちらで入手できます: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 環境のカスタマイズ {id="environment"}

テストアプリケーション用のカスタム環境を構築するには、`environment` 関数を使用します。
例えば、テスト用のカスタム構成を使用するには、`test/resources` フォルダに構成ファイルを作成し、`config` プロパティを使用してそれをロードできます。

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

構成プロパティを指定するもう1つの方法は、[MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html) を使用することです。これは、アプリケーションが起動する前にアプリケーション構成にアクセスしたい場合に役立つことがあります。以下の例は、`config` プロパティを使用して `MapApplicationConfig` を `testApplication` 関数に渡す方法を示しています。

```kotlin
```
{src="snippets/engine-main-custom-environment/src/test/kotlin/ApplicationTest.kt" include-lines="10-14,21"}

#### 外部サービスのモック {id="external-services"}

Ktorでは、`externalServices` 関数を使用して外部サービスをモックできます。
この関数内で、2つのパラメータを受け入れる `hosts` 関数を呼び出す必要があります。
- `hosts` パラメータは、外部サービスのURLを受け入れます。
- `block` パラメータを使用すると、外部サービスのモックとして機能する `Application` を構成できます。
   この `Application` のルーティングを構成し、プラグインをインストールできます。

以下のサンプルは、`externalServices` を使用してGoogle APIから返されるJSONレスポンスをシミュレートする方法を示しています。

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,36-47,51"}

テストを含む完全な例は、こちらで入手できます: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### ステップ2: (オプション) クライアントの設定 {id="configure-client"}

`testApplication` は、`client` プロパティを使用してデフォルト構成のHTTPクライアントへのアクセスを提供します。
クライアントをカスタマイズして追加のプラグインをインストールする必要がある場合は、`createClient` 関数を使用できます。例えば、テストのPOST/PUTリクエストで [JSONデータを送信する](#json-data) には、[ContentNegotiation](client-serialization.md) プラグインをインストールできます。
```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-40,48"}

### ステップ3: リクエストの作成 {id="make-request"}

アプリケーションをテストするには、[設定済みのクライアント](#configure-client) を使用して [リクエスト](client-requests.md) を行い、[レスポンス](client-responses.md) を受信します。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) は、`POST` リクエストを処理する `/customer` エンドポイントをテストする方法を示しています。

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-44,48"}

### ステップ4: 結果のアサート {id="assert"}

[レスポンス](#make-request) を受信した後、[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) ライブラリが提供するアサーションを行うことで結果を検証できます。

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-48"}

## POST/PUTリクエストのテスト {id="test-post-put"}

### フォームデータの送信 {id="form-data"}

テストのPOST/PUTリクエストでフォームデータを送信するには、`Content-Type` ヘッダーを設定し、リクエストボディを指定する必要があります。これを行うには、それぞれ [header](client-requests.md#headers) 関数と [setBody](client-requests.md#body) 関数を使用できます。以下の例は、`x-www-form-urlencoded` と `multipart/form-data` の両方のタイプを使用してフォームデータを送信する方法を示しています。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) の例の以下のテストは、`x-www-form-urlencoded` コンテンツタイプを使用して送信されたフォームパラメータを持つテストリクエストを作成する方法を示しています。キー/値ペアのリストからフォームパラメータをエンコードするには、[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 関数が使用されることに注意してください。

<tabs>
<tab title="テスト">

```kotlin
```
{src="snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"}

</tab>

<tab title="アプリケーション">

```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="3-16,45-46"}

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

以下のコードは、`multipart/form-data` を構築し、ファイルアップロードをテストする方法を示しています。完全な例は、こちらで入手できます: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<tabs>
<tab title="テスト">

```kotlin
```
{src="snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt"}

</tab>

<tab title="アプリケーション">

```kotlin
```
{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt"}

</tab>
</tabs>

### JSONデータの送信 {id="json-data"}

テストのPOST/PUTリクエストでJSONデータを送信するには、新しいクライアントを作成し、特定の形式でコンテンツをシリアライズ/デシリアライズできる [ContentNegotiation](client-serialization.md) プラグインをインストールする必要があります。リクエスト内で、`contentType` 関数を使用して `Content-Type` ヘッダーを指定し、[setBody](client-requests.md#body) を使用してリクエストボディを指定できます。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) は、`POST` リクエストを処理する `/customer` エンドポイントをテストする方法を示しています。

<tabs>
<tab title="テスト">

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="3-11,31-48"}

</tab>

<tab title="アプリケーション">

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="3-16,25-31,38-44"}

</tab>
</tabs>

## テスト中のCookieの保持 {id="preserving-cookies"}

テスト時にリクエスト間でCookieを保持する必要がある場合は、新しいクライアントを作成し、[HttpCookies](client-cookies.md) プラグインをインストールする必要があります。[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) の例の以下のテストでは、Cookieが保持されるため、リロード回数は各リクエスト後に増加します。

<tabs>
<tab title="テスト">

```kotlin
```
{src="snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt"}

</tab>

<tab title="アプリケーション">

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="3-38"}

</tab>
</tabs>

## HTTPSのテスト {id="https"}

[HTTPSエンドポイント](server-ssl.md) をテストする必要がある場合は、[URLBuilder.protocol](client-requests.md#url) プロパティを使用してリクエストを行うために使用されるプロトコルを変更します。

```kotlin
```
{src="snippets/ssl-engine-main/src/test/kotlin/ApplicationTest.kt" include-lines="3-22"}

完全な例は、こちらで入手できます: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## WebSocketのテスト {id="testing-ws"}

クライアントが提供する [WebSockets](client-websockets.topic) プラグインを使用することで、[WebSocketのやり取り](server-websockets.md) をテストできます。

```kotlin
```
{src="snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"}

## HttpClientを使用したエンドツーエンドテスト {id="end-to-end"}
テストエンジンとは別に、サーバーアプリケーションのエンドツーエンドテストには [Ktor HTTPクライアント](client-create-and-configure.md) を使用できます。
以下の例では、HTTPクライアントが `TestServer` に対してテストリクエストを行っています。

```kotlin
```
{src="snippets/embedded-server/src/test/kotlin/EmbeddedServerTest.kt"}

完全な例については、以下のサンプルを参照してください。
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): テスト対象のサンプルサーバー。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): テストサーバーをセットアップするためのヘルパークラスと関数が含まれています。