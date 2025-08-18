[//]: # (title: リクエストのバリデーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name% は、受信リクエストのボディをバリデートする機能を提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html)プラグインは、受信リクエストのボディをバリデートする機能を提供します。[シリアライザー](server-serialization.md#configure_serializer)が設定された`ContentNegotiation`プラグインがインストールされている場合、生のRequestBodyまたは指定されたリクエストオブジェクトのプロパティをバリデートできます。RequestBodyのバリデーションに失敗した場合、このプラグインは`RequestValidationException`をスローします。この例外は、[StatusPages](server-status-pages.md)プラグインを使用して処理できます。

## 依存関係の追加 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name%のインストール {id="install_plugin"}

<p>
    アプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>の<code>install</code>関数に<code>%plugin_name%</code>プラグインを渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出しの内部。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>の内部。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立ちます。
</p>

## %plugin_name%の設定 {id="configure"}

<code>%plugin_name%</code>の設定には、主に3つのステップがあります。

1. [ボディコンテンツの受信](#receive-body)。
2. [バリデーション関数の設定](#validation-function)。
3. [バリデーション例外の処理](#validation-exception)。

### 1. ボディの受信 {id="receive-body"}

<code>%plugin_name%</code>プラグインは、型パラメータを指定して**[receive](server-requests.md#body_contents)**関数を呼び出すと、リクエストのボディをバリデートします。例えば、以下のコードスニペットは、ボディを<code>String</code>値として受け取る方法を示しています:

```kotlin
routing {
    post("/text") {
        val body = call.receive<String>()
        call.respond(body)
    }
}
```

### 2. バリデーション関数の設定 {id="validation-function"}

リクエストボディをバリデートするには、<code>validate</code>関数を使用します。
この関数は、成功または失敗したバリデーション結果を表す<code>ValidationResult</code>オブジェクトを返します。
失敗した結果の場合、**[RequestValidationException](#validation-exception)**がスローされます。

<code>validate</code>関数には、リクエストボディを2つの方法でバリデートできる2つのオーバーロードがあります:

- 最初の<code>validate</code>オーバーロードは、指定された型のオブジェクトとしてリクエストボディにアクセスすることを可能にします。
   以下の例は、<code>String</code>値を表すリクエストボディをバリデートする方法を示しています:
   ```kotlin
   install(RequestValidation) {
       validate<String> { bodyText ->
           if (!bodyText.startsWith("Hello"))
               ValidationResult.Invalid("Body text should start with 'Hello'")
           else ValidationResult.Valid
       }
   }
   ```

   特定の[シリアライザー](server-serialization.md#configure_serializer)が設定された<code>ContentNegotiation</code>プラグインがインストールされている場合、オブジェクトのプロパティをバリデートできます。[例：オブジェクトプロパティのバリデーション](#example-object)から詳細を確認してください。

- 2番目の<code>validate</code>オーバーロードは<code>ValidatorBuilder</code>を受け入れ、カスタムバリデーションルールを提供できます。
   [例：バイト配列のバリデーション](#example-byte-array)から詳細を確認してください。

### 3. バリデーション例外の処理 {id="validation-exception"}

リクエストのバリデーションが失敗した場合、<code>%plugin_name%</code>は<code>RequestValidationException</code>をスローします。
この例外を使用すると、リクエストボディにアクセスし、このリクエストに対するすべてのバリデーション失敗の理由を取得できます。

<code>RequestValidationException</code>は、[StatusPages](server-status-pages.md)プラグインを使用して次のように処理できます:

```kotlin
install(StatusPages) {
    exception<RequestValidationException> { call, cause ->
        call.respond(HttpStatusCode.BadRequest, cause.reasons.joinToString())
    }
}
```

完全な例はこちらから確認できます: [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 例：オブジェクトプロパティのバリデーション {id="example-object"}

この例では、<code>%plugin_name%</code>プラグインを使用してオブジェクトプロパティをバリデートする方法を見ていきます。
サーバーが以下のJSONデータを含む<code>POST</code>リクエストを受信すると仮定します:

```HTTP
POST http://0.0.0.0:8080/json
Content-Type: application/json

{
  "id": -1,
  "firstName": "Jet",
  "lastName": "Brains"
}
```

<code>id</code>プロパティのバリデーションを追加するには、以下の手順に従ってください:

1. 上記のJSONオブジェクトを記述する<code>Customer</code>データクラスを作成します:
   ```kotlin
   @Serializable
   data class Customer(val id: Int, val firstName: String, val lastName: String)
   ```

2. [JSONシリアライザー](server-serialization.md#register_json)を使用して<code>ContentNegotiation</code>プラグインをインストールします:
   ```kotlin
   install(ContentNegotiation) {
       json()
   }
   ```

3. サーバー側で<code>Customer</code>オブジェクトを次のように受信します:
   ```kotlin
   post("/json") {
       val customer = call.receive<Customer>()
       call.respond(customer)
   }
   ```
4. <code>%plugin_name%</code>プラグインの設定で、<code>id</code>プロパティが指定された範囲内にあることを確認するためのバリデーションを追加します:
   ```kotlin
   install(RequestValidation) {
       validate<Customer> { customer ->
           if (customer.id <= 0)
               ValidationResult.Invalid("A customer ID should be greater than 0")
           else ValidationResult.Valid
       }
   }
   ```
   
   この場合、<code>id</code>の値が<code>0</code>以下の場合、<code>%plugin_name%</code>は**[RequestValidationException](#validation-exception)**をスローします。

## 例：バイト配列のバリデーション {id="example-byte-array"}

この例では、バイト配列として受信したリクエストボディをバリデートする方法を見ていきます。
サーバーが以下のテキストデータを含む<code>POST</code>リクエストを受信すると仮定します:

```HTTP
POST http://localhost:8080/array
Content-Type: text/plain

-1
```

バイト配列としてデータを受信し、バリデートするには、以下の手順を実行します:

1. サーバー側でデータを次のように受信します:
   ```kotlin
   post("/array") {
       val body = call.receive<ByteArray>()
       call.respond(String(body))
   }
   ```
2. 受信したデータをバリデートするには、<code>ValidatorBuilder</code>を受け入れ、カスタムバリデーションルールを提供できる、2番目の<code>validate</code>[関数オーバーロード](#validation-function)を使用します:
   ```kotlin
   install(RequestValidation) {
       validate {
           filter { body ->
               body is ByteArray
           }
           validation { body ->
               check(body is ByteArray)
               val intValue = String(body).toInt()
               if (intValue <= 0)
                   ValidationResult.Invalid("A value should be greater than 0")
               else ValidationResult.Valid
           }
       }
   }
   ```