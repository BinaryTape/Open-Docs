[//]: # (title: Ktor Clientにおけるコンテンツネゴシエーションとシリアライゼーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentNegotiationプラグインには主に2つの目的があります。クライアントとサーバー間のメディアタイプをネゴシエートすることと、リクエストの送信時およびレスポンスの受信時にコンテンツを特定のフォーマットでシリアライズ/デシリアライズすることです。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation)プラグインには主に2つの目的があります。
* クライアントとサーバー間のメディアタイプをネゴシエートします。これには`Accept`ヘッダーと`Content-Type`ヘッダーを使用します。
* [リクエスト](client-requests.md)の送信時および[レスポンス](client-responses.md)の受信時に、コンテンツを特定のフォーマットでシリアライズ/デシリアライズします。KtorはJSON、XML、CBOR、ProtoBufといったフォーマットを標準でサポートしています。XMLシリアライザーは[JVM](client-engines.md)のみでサポートされていることに注意してください。

> サーバー側では、Ktorはコンテンツのシリアライズ/デシリアライズのために[ContentNegotiation](server-serialization.md)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

特定のフォーマット用のシリアライザーには追加のアーティファクトが必要であることに注意してください。例えば、kotlinx.serializationではJSON用に`ktor-serialization-kotlinx-json`依存関係が必要です。含まれるアーティファクトに応じて、Ktorは自動的にデフォルトのシリアライザーを選択します。必要であれば、[シリアライザーを明示的に指定](#configure_serializer)して設定できます。

### シリアライゼーション {id="serialization_dependency"}

kotlinx.serializationコンバーターを使用する前に、[セットアップ](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されている通りにKotlinシリアライゼーションプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、以下のライブラリのいずれかを選択できます。kotlinx.serialization、Gson、またはJackson。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに`ktor-serialization-kotlinx-json`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

ビルドスクリプトに`ktor-serialization-gson`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

ビルドスクリプトに`ktor-serialization-jackson`アーティファクトを追加します。

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

XMLをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-xml`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> XMLシリアライゼーションは[`jsNode`ターゲットでサポートされていない](https://github.com/pdvrieze/xmlutil/issues/83)ことに注意してください。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## ContentNegotiationのインストール {id="install_plugin"}

`ContentNegotiation`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
これで必要なJSONシリアライザーを[設定](#configure_serializer)できます。

## シリアライザーの設定 {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

アプリケーションでJSONシリアライザーを登録するには、`json`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

`json`コンストラクターでは、例えば、[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) APIにアクセスできます。
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="24-31"}

完全な例はこちらで確認できます: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。

</tab>
<tab title="Gson" group-key="gson">

アプリケーションでGsonシリアライザーを登録するには、[gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html)メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson`メソッドでは、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)によって提供されるシリアライゼーション設定を調整することもできます。

</tab>
<tab title="Jackson" group-key="jackson">

アプリケーションでJacksonシリアライザーを登録するには、[jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html)メソッドを呼び出します。

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson`メソッドでは、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)によって提供されるシリアライゼーション設定を調整することもできます。

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションでXMLシリアライザーを登録するには、`xml`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml`メソッドでは、例えば、XMLシリアライゼーション設定にアクセスすることもできます。

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
アプリケーションでCBORシリアライザーを登録するには、`cbor`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor`メソッドでは、例えば、[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)によって提供されるCBORシリアライゼーション設定にアクセスすることもできます。

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
アプリケーションでProtoBufシリアライザーを登録するには、`protobuf`メソッドを呼び出します。
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf`メソッドでは、例えば、[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)によって提供されるProtoBufシリアライゼーション設定にアクセスすることもできます。

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

データの送受信を行うには、例えば、データクラスが必要です。
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="19"}

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください。
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="18-19"}

<include from="server-serialization.md" element-id="serialization_types"/>

### データ送信 {id="send_data"}

[リクエスト](client-requests.md)ボディ内で[クラスインスタンス](#create_data_class)をJSONとして送信するには、`setBody`関数を使ってこのインスタンスを割り当て、`contentType`を呼び出してコンテンツタイプを`application/json`に設定します。

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

XMLまたはCBORとしてデータを送信するには、`contentType`をそれぞれ`ContentType.Application.Xml`または`ContentType.Application.Cbor`に設定します。

### データ受信 {id="receive_data"}

サーバーが`application/json`、`application/xml`、または`application/cbor`コンテンツを含む[レスポンス](client-responses.md)を送信する場合、レスポンスペイロードを受信するために使用される関数（以下の例では`body`）に[データクラス](#create_data_class)をパラメータとして指定することで、それをデシリアライズできます。
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

完全な例はこちらで確認できます: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)。