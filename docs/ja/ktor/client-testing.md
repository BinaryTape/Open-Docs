[//]: # (title: Ktor Clientでのテスト)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>必須依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
Ktorは、エンドポイントに接続せずにHTTP呼び出しをシミュレートするMockEngineを提供します。
</web-summary>

<link-summary>
MockEngineを使用してHTTP呼び出しをシミュレートし、クライアントをテストする方法を学びます。
</link-summary>

Ktorは、エンドポイントに接続せずにHTTP呼び出しをシミュレートする[MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)を提供します。

## 依存関係の追加 {id="add_dependencies"}
`MockEngine`を使用する前に、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact_testing"/>

## 使用方法 {id="usage"}

### クライアント設定の共有 {id="share-config"}

`MockEngine`を使用してクライアントをテストする方法を見てみましょう。クライアントが以下の設定を持っているとします。
* リクエストの作成には`CIO` [エンジン](client-engines.md)が使用されます。
* 受信JSONデータを逆シリアル化するために、[Json](client-serialization.md)プラグインがインストールされています。

このクライアントをテストするには、その設定を`MockEngine`を使用するテストクライアントと共有する必要があります。設定を共有するには、エンジンをコンストラクターパラメーターとして受け取り、クライアント設定を含むクライアントラッパークラスを作成できます。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="13-15,24-32"}

その後、`ApiClient`を次のように使用して、`CIO`エンジンでHTTPクライアントを作成し、リクエストを行うことができます。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="16-22"}

### クライアントのテスト {id="test-client"}

クライアントをテストするには、リクエストパラメーターをチェックし、必要なコンテンツ（この場合はJSONオブジェクト）で応答できるハンドラーを持つ`MockEngine`インスタンスを作成する必要があります。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="14-20"}

その後、作成した`MockEngine`を`ApiClient`の初期化に渡し、必要なアサーションを行うことができます。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="10-26"}

完全な例は以下で確認できます: [client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。