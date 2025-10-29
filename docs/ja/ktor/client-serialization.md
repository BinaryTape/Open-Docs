[//]: # (title: Ktorクライアントにおけるコンテンツネゴシエーションとシリアライズ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
ContentNegotiationプラグインは、主に2つの目的を果たします。クライアントとサーバー間でメディアタイプをネゴシエートすること、そしてリクエスト送信時およびレスポンス受信時にコンテンツを特定の形式でシリアライズ/デシリアライズすることです。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation)プラグインは、主に2つの目的を果たします。
* クライアントとサーバー間でメディアタイプをネゴシエートすること。これには`Accept`および`Content-Type`ヘッダーを使用します。
* [リクエスト](client-requests.md)送信時および[レスポンス](client-responses.md)受信時に、コンテンツを特定の形式でシリアライズ/デシリアライズすること。Ktorは、JSON、XML、CBOR、ProtoBufといった形式をすぐに使用できるようにサポートしています。

> サーバー側では、Ktorはコンテンツのシリアライズ/デシリアライズのために[ContentNegotiation](server-serialization.md)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

<p>
    <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
<p>
    Ktorクライアントに必要なアーティファクトの詳細については、「<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアント依存関係の追加</Links>」を参照してください。
</p>

特定の形式のシリアライザーには追加のアーティファクトが必要であることに注意してください。例えば、kotlinx.serializationはJSONのために`ktor-serialization-kotlinx-json`依存関係を必要とします。含まれるアーティファクトに応じて、Ktorはデフォルトのシリアライザーを自動的に選択します。必要であれば、[シリアライザーを明示的に指定](#configure_serializer)して設定できます。

### シリアライズ {id="serialization_dependency"}

kotlinx.serializationコンバーターを使用する前に、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin serializationプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jacksonのいずれかのライブラリを選択できます。

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに`ktor-serialization-kotlinx-json`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
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

</TabItem>
<TabItem title="Gson" group-key="gson">

ビルドスクリプトに`ktor-serialization-gson`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-gson"/>
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

</TabItem>
<TabItem title="Jackson" group-key="jackson">

ビルドスクリプトに`ktor-serialization-jackson`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-jackson"/>
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

</TabItem>
</Tabs>

#### XML {id="add_xml_dependency"}

XMLをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-xml`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
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

> `jsNode`ターゲットではXMLシリアライズがサポートされていないことに注意してください。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
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

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
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

## ContentNegotiationのインストール {id="install_plugin"}

`ContentNegotiation`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
これで、必要なJSONシリアライザーを[設定](#configure_serializer)できます。

## シリアライザーの設定 {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

アプリケーションにJSONシリアライザーを登録するには、`json`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

`json`コンストラクターでは、例えば以下のように[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) APIにアクセスできます。
```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

完全な例は[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)にあります。

</TabItem>
<TabItem title="Gson" group-key="gson">

アプリケーションにGsonシリアライザーを登録するには、[gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html)メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson`メソッドを使用すると、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)によって提供されるシリアライズ設定を調整することもできます。

</TabItem>
<TabItem title="Jackson" group-key="jackson">

アプリケーションにJacksonシリアライザーを登録するには、[jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html)メソッドを呼び出します。

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson`メソッドを使用すると、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)によって提供されるシリアライズ設定を調整することもできます。

</TabItem>
</Tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションにXMLシリアライザーを登録するには、`xml`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml`メソッドを使用すると、例えば以下のようにXMLシリアライズ設定にアクセスすることもできます。

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*
import nl.adaptivity.xmlutil.*
import nl.adaptivity.xmlutil.serialization.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml(format = XML {
            xmlDeclMode = XmlDeclMode.Charset
        })
    }
}
```

### CBORシリアライザー {id="register_cbor"}
アプリケーションにCBORシリアライザーを登録するには、`cbor`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor`メソッドを使用すると、例えば以下のように[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)によって提供されるCBORシリアライズ設定にアクセスすることもできます。

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*
import kotlinx.serialization.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor(Cbor {
            ignoreUnknownKeys = true
        })
    }
}
```

### ProtoBufシリアライザー {id="register_protobuf"}
アプリケーションにProtoBufシリアライザーを登録するには、`protobuf`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf`メソッドを使用すると、例えば以下のように[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)によって提供されるProtoBufシリアライズ設定にアクセスすることもできます。

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*
import kotlinx.serialization.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf(ProtoBuf {
            encodeDefaults = true
        })
    }
}
```

## データの送受信 {id="receive_send_data"}
### データクラスの作成 {id="create_data_class"}

データの送受信を行うには、例えば以下のようなデータクラスが必要です。
```kotlin
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください。
```kotlin
@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

kotlinx.serializationライブラリは、以下の型のシリアライズ/デシリアライズをサポートしています。

- [組み込みクラス](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [シーケンス](https://kotlinlang.org/docs/sequences.html)のデシリアライズ
- [フロー](https://kotlinlang.org/docs/flow.html)のシリアライズ

### データの送信 {id="send_data"}

[リクエスト](client-requests.md)ボディ内で[クラスインスタンス](#create_data_class)をJSONとして送信するには、`setBody`関数を使ってこのインスタンスを割り当て、`contentType`を呼び出すことでコンテンツタイプを`application/json`に設定します。

```kotlin
val response: HttpResponse = client.post("http://localhost:8080/customer") {
    contentType(ContentType.Application.Json)
    setBody(Customer(3, "Jet", "Brains"))
}
```

データをXMLまたはCBORとして送信するには、`contentType`を`ContentType.Application.Xml`または`ContentType.Application.Cbor`にそれぞれ設定します。

### データの受信 {id="receive_data"}

サーバーが`application/json`、`application/xml`、または`application/cbor`コンテンツを含む[レスポンス](client-responses.md)を送信した場合、レスポンスペイロードを受信する関数（以下の例では`body`）のパラメータとして[データクラス](#create_data_class)を指定することでデシリアライズできます。
```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

完全な例は[client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)にあります。