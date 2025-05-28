[//]: # (title: Ktorサーバーにおけるコンテンツネゴシエーションとシリアライゼーション)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
ContentNegotiationプラグインは、クライアントとサーバー間のメディアタイプをネゴシエートすることと、特定のフォーマットでコンテンツをシリアライズ/デシリアライズすることの2つの主な目的を果たします。
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html)プラグインは、主に以下の2つの目的を果たします。
* クライアントとサーバー間でメディアタイプをネゴシエートします。これには、`Accept`および`Content-Type`ヘッダーを使用します。
* 特定のフォーマットでコンテンツをシリアライズ/デシリアライズします。Ktorは、JSON、XML、CBOR、ProtoBufといったフォーマットを標準でサポートしています。

> クライアント側では、Ktorはコンテンツのシリアライズ/デシリアライズのために[ContentNegotiation](client-serialization.md)プラグインを提供しています。

## 依存関係の追加 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

特定のフォーマットのシリアライザーには、追加のアーティファクトが必要であることに注意してください。例えば、kotlinx.serializationでJSONを使用するには、`ktor-serialization-kotlinx-json`の依存関係が必要です。

### シリアライズ {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

kotlinx.serializationコンバーターを使用する前に、[Setup](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlin serializationプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、以下のいずれかのライブラリを選択できます：kotlinx.serialization、Gson、またはJackson。

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

> XMLシリアライズは`jsNode`ターゲットではサポートされていないことに注意してください ([詳細はこちら](https://github.com/pdvrieze/xmlutil/issues/83))。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</snippet>

## ContentNegotiationのインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## シリアライザーの構成 {id="configure_serializer"}

Ktorは、[JSON](#register_json)、[XML](#register_xml)、[CBOR](#register_cbor)といったフォーマットを標準でサポートしています。また、独自のカスタムシリアライザーを実装することも可能です。

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

アプリケーションでJSONシリアライザーを登録するには、`json`メソッドを呼び出します。
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json`メソッドでは、[JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/)によって提供されるシリアライズ設定を調整することもできます。例えば:

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="25-30"}

</tab>
<tab title="Gson" group-key="gson">

アプリケーションでGsonシリアライザーを登録するには、`gson`メソッドを呼び出します。
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson`メソッドでは、[GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)によって提供されるシリアライズ設定を調整することもできます。例えば:

```kotlin
```
{src="snippets/gson/src/main/kotlin/com/example/GsonApplication.kt" include-lines="24-29"}

</tab>
<tab title="Jackson" group-key="jackson">

アプリケーションでJacksonシリアライザーを登録するには、`jackson`メソッドを呼び出します。

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson`メソッドでは、[ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)によって提供されるシリアライズ設定を調整することもできます。例えば:

```kotlin
```
{src="snippets/jackson/src/main/kotlin/com/example/JacksonApplication.kt" include-lines="26-35"}

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

アプリケーションでXMLシリアライザーを登録するには、`xml`メソッドを呼び出します。
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml`メソッドでは、XMLシリアライズ設定にアクセスすることもできます。例えば:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*
import nl.adaptivity.xmlutil.*
import nl.adaptivity.xmlutil.serialization.*

install(ContentNegotiation) {
    xml(format = XML {
        xmlDeclMode = XmlDeclMode.Charset
    })
}
```

### CBORシリアライザー {id="register_cbor"}
アプリケーションでCBORシリアライザーを登録するには、`cbor`メソッドを呼び出します。
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor`メソッドでは、[CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)によって提供されるCBORシリアライズ設定にアクセスすることもできます。例えば:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*
import kotlinx.serialization.cbor.*

install(ContentNegotiation) {
    cbor(Cbor {
        ignoreUnknownKeys = true
    })
}
```

### ProtoBufシリアライザー {id="register_protobuf"}
アプリケーションでProtoBufシリアライザーを登録するには、`protobuf`メソッドを呼び出します。
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf`メソッドでは、[ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)によって提供されるProtoBufシリアライズ設定にアクセスすることもできます。例えば:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*
import kotlinx.serialization.protobuf.*

install(ContentNegotiation) {
    protobuf(ProtoBuf {
        encodeDefaults = true
    })
}
```

### カスタムシリアライザー {id="register_custom"}

指定された`Content-Type`に対応するカスタムシリアライザーを登録するには、`register`メソッドを呼び出す必要があります。以下の例では、`application/json`と`application/xml`データをデシリアライズするために、2つの[カスタムシリアライザー](#implement_custom_serializer)が登録されています:

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## データの受信と送信 {id="receive_send_data"}

### データクラスの作成 {id="create_data_class"}
受信したデータをオブジェクトにデシリアライズするには、データクラスを作成する必要があります。例えば:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="14"}

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="10,12-14"}

<snippet id="serialization_types">

kotlinx.serializationライブラリは、以下のタイプのシリアライズ/デシリアライズをサポートしています:

- [組み込みクラス](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [シーケンス](https://kotlinlang.org/docs/sequences.html)のデシリアライズ
- [Flow](https://kotlinlang.org/docs/flow.html)のシリアライズ

</snippet>

### データの受信 {id="receive_data"}
リクエストのコンテンツを受信して変換するには、データクラスをパラメーターとして受け取る`receive`メソッドを呼び出します。
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="38-42"}

リクエストの`Content-Type`は、リクエストを処理するための[シリアライザー](#configure_serializer)を選択するために使用されます。以下の例は、JSONまたはXMLデータを含むサンプル[HTTPクライアント](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)リクエストがサーバー側で`Customer`オブジェクトに変換される様子を示しています:

<tabs>
<tab title="JSON">

```HTTP
```
{src="snippets/json-kotlinx/post.http" include-lines="1-9"}

</tab>
<tab title="XML">

```HTTP
```
{src="snippets/json-kotlinx/post.http" include-lines="12-15"}

</tab>
</tabs>

完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

### データの送信 {id="send_data"}
レスポンスでデータオブジェクトを渡すには、`respond`メソッドを使用できます:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="32-36"}

この場合、Ktorは必要な[シリアライザー](#configure_serializer)を選択するために`Accept`ヘッダーを使用します。完全な例はこちらで確認できます: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)。

## カスタムシリアライザーの実装 {id="implement_custom_serializer"}

Ktorでは、データをシリアライズ/デシリアライズするための独自の[シリアライザー](#configure_serializer)を作成できます。これを行うには、[ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html)インターフェースを実装する必要があります:
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
実装例として、[GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt)クラスを参照してください。