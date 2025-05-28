[//]: # (title: リクエストのバリデーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-request-validation</code>
</p>
<var name="example_name" value="request-validation"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
RequestValidation は、受信リクエストのボディをバリデーションする機能を提供します。
</link-summary>

[RequestValidation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) プラグインは、受信リクエストのボディをバリデーションする機能を提供します。`ContentNegotiation` プラグインが [シリアライザー](server-serialization.md#configure_serializer) とともにインストールされている場合、生のリクエストボディ、または指定されたリクエストオブジェクトのプロパティをバリデーションできます。リクエストボディのバリデーションが失敗した場合、プラグインは `RequestValidationException` を発生させます。これは [StatusPages](server-status-pages.md) プラグインを使用して処理できます。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## RequestValidation のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## RequestValidation の設定 {id="configure"}

`RequestValidation` の設定には、主に3つのステップがあります。

1.  [ボディの内容の受信](#receive-body)。
2.  [バリデーション関数の設定](#validation-function)。
3.  [バリデーション例外の処理](#validation-exception)。

### 1. ボディの受信 {id="receive-body"}

`RequestValidation` プラグインは、**[receive](server-requests.md#body_contents)** 関数を型パラメータ付きで呼び出した場合に、リクエストのボディをバリデーションします。例えば、以下のコードスニペットは、ボディを `String` 値として受信する方法を示しています。

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="52-56,65"}

### 2. バリデーション関数の設定 {id="validation-function"}

リクエストボディをバリデーションするには、`validate` 関数を使用します。
この関数は、成功または失敗したバリデーション結果を表す `ValidationResult` オブジェクトを返します。
バリデーションが失敗した場合、**[RequestValidationException](#validation-exception)** が発生します。

`validate` 関数には2つのオーバーロードがあり、2つの方法でリクエストボディをバリデーションできます。

-   最初の `validate` オーバーロードは、指定された型のオブジェクトとしてリクエストボディにアクセスできます。
    以下の例は、`String` 値を表すリクエストボディをバリデーションする方法を示しています。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20-25,43"}

    `ContentNegotiation` プラグインが特定の [シリアライザー](server-serialization.md#configure_serializer) とともにインストールされ、設定されている場合、オブジェクトのプロパティをバリデーションできます。詳細は [オブジェクトのバリデーションの例](#example-object) を参照してください。

-   2番目の `validate` オーバーロードは `ValidatorBuilder` を受け入れ、カスタムバリデーションルールを提供できます。
    詳細は [バイト配列のバリデーションの例](#example-byte-array) を参照してください。

### 3. バリデーション例外の処理 {id="validation-exception"}

リクエストのバリデーションが失敗した場合、`RequestValidation` は `RequestValidationException` を発生させます。
この例外を使用すると、リクエストボディにアクセスし、このリクエストに対するすべてのバリデーション失敗の理由を取得できます。

`RequestValidationException` は、次のように [StatusPages](server-status-pages.md) プラグインを使用して処理できます。

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="44-48"}

完全な例は [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation) で確認できます。

## 例: オブジェクトのプロパティのバリデーション {id="example-object"}

この例では、`RequestValidation` プラグインを使用してオブジェクトのプロパティをバリデーションする方法について説明します。
サーバーが以下のJSONデータを含む `POST` リクエストを受信するとします。

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="7-14"}

`id` プロパティのバリデーションを追加するには、以下の手順に従います。

1.  上記のJSONオブジェクトを記述する `Customer` データクラスを作成します。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="14-15"}

2.  [JSON シリアライザー](server-serialization.md#register_json) とともに `ContentNegotiation` プラグインをインストールします。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="49-51"}

3.  サーバー側で `Customer` オブジェクトを次のように受信します。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="57-60"}
4.  `RequestValidation` プラグインの設定で、`id` プロパティが指定された範囲内にあることを確認するために、バリデーションを追加します。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,26-30,43"}

    この場合、`id` の値が `0` 以下の場合、`RequestValidation` は **[RequestValidationException](#validation-exception)** を発生させます。

## 例: バイト配列のバリデーション {id="example-byte-array"}

この例では、バイト配列として受信したリクエストボディをバリデーションする方法について説明します。
サーバーが以下のテキストデータを含む `POST` リクエストを受信するとします。

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="17-20"}

データをバイト配列として受信し、バリデーションを行うには、以下の手順を実行します。

1.  サーバー側でデータを次のように受信します。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="61-64"}
2.  受信したデータをバリデーションするために、`ValidatorBuilder` を受け入れ、カスタムバリデーションルールを提供できる2番目の `validate` [関数オーバーロード](#validation-function) を使用します。
    ```kotlin
    ```
    {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,31-43"}