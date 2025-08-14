[//]: # (title: KtorクライアントにおけるWebSocketsのシリアライズ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ContentNegotiation](client-serialization.md)プラグインと同様に、WebSocketsではテキストフレームを特定のフォーマットでシリアライズ/デシリアライズできます。Ktorクライアントは、JSON、XML、CBOR、ProtoBufといった以下のフォーマットをそのままサポートしています。

## 依存関係の追加 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

kotlinx.serializationコンバーターを使用する前に、[Setup](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlinシリアライズプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、kotlinx.serialization、Gson、Jacksonのいずれかのライブラリを選択できます。

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

`ktor-serialization-kotlinx-json`アーティファクトをビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

`ktor-serialization-gson`アーティファクトをビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

`ktor-serialization-jackson`アーティファクトをビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

XMLをシリアライズ/デシリアライズするには、`ktor-serialization-kotlinx-xml`をビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> XMLシリアライズは`jsNode`ターゲットでサポートされていないことに注意してください ([詳細はこちら](https://github.com/pdvrieze/xmlutil/issues/83))。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、`ktor-serialization-kotlinx-cbor`をビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBufをシリアライズ/デシリアライズするには、`ktor-serialization-kotlinx-protobuf`をビルドスクリプトに追加します。

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</snippet>

## シリアライザーの設定 {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSocketsの[設定](client-websockets.topic#install_plugin)にJSONシリアライザーを登録するには、`Json`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

val client = HttpClient(CIO) {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
    }
}
```

</tab>
<tab title="Gson" group-key="gson">

Gsonシリアライザーを登録するには、`GsonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jacksonシリアライザーを登録するには、`JacksonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

WebSocketsの[設定](client-websockets.topic#install_plugin)にXMLシリアライザーを登録するには、`XML`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBORシリアライザー {id="register_cbor"}
WebSocketsの[設定](client-websockets.topic#install_plugin)にCBORシリアライザーを登録するには、`Cbor`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBufシリアライザー {id="register_protobuf"}
WebSocketsの[設定](client-websockets.topic#install_plugin)にProtoBufシリアライザーを登録するには、`ProtoBuf`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## データの送受信 {id="receive_send_data"}
### データクラスの作成 {id="create_data_class"}

テキストフレームをオブジェクトに/オブジェクトからシリアライズ/デシリアライズするには、たとえば次のようなデータクラスを作成する必要があります。

[object Promise]

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください。

[object Promise]

`kotlinx.serialization`について詳しくは、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)を参照してください。

### データの送信 {id="send_data"}

[指定されたフォーマット](#configure_serializer)でテキストフレーム内に[クラスインスタンス](#create_data_class)を送信するには、`sendSerialized`関数を使用します。

[object Promise]

### データの受信 {id="receive_data"}

テキストフレームのコンテンツを受信して変換するには、データクラスをパラメータとして受け取る`receiveDeserialized`関数を呼び出します。

[object Promise]

[incoming](client-websockets.topic#incoming)チャネルからデシリアライズされたフレームを受信するには、[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html)関数を使用します。`WebsocketContentConverter`は`DefaultClientWebSocketSession.converter`プロパティを介して利用できます。

> 完全な例はこちらで確認できます: [client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。