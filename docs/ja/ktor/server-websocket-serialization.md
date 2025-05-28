[//]: # (title: Ktor ServerにおけるWebSocketsのシリアライズ)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[ContentNegotiation](server-serialization.md)プラグインと同様に、WebSocketsでは、特定の形式でテキストフレームをシリアライズ/デシリアライズできます。Ktorは、JSON、XML、CBOR、ProtoBufといった形式をすぐに利用できる形でサポートしています。

## 依存関係を追加する {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## シリアライザーを設定する {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSocketsの[設定](server-websockets.md#configure)でJSONシリアライザーを登録するには、`Json` パラメーターを持つ `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

Gsonシリアライザーを登録するには、`GsonWebsocketContentConverter` を `contentConverter` プロパティに割り当てます。
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jacksonシリアライザーを登録するには、`JacksonWebsocketContentConverter` を `contentConverter` プロパティに割り当てます。

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XMLシリアライザー {id="register_xml"}

WebSocketsの[設定](server-websockets.md#configure)でXMLシリアライザーを登録するには、`XML` パラメーターを持つ `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます。
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBORシリアライザー {id="register_cbor"}

WebSocketsの[設定](server-websockets.md#configure)でCBORシリアライザーを登録するには、`Cbor` パラメーターを持つ `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます。

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBufシリアライザー {id="register_protobuf"}

WebSocketsの[設定](server-websockets.md#configure)でProtoBufシリアライザーを登録するには、`ProtoBuf` パラメーターを持つ `KotlinxWebsocketSerializationConverter` インスタンスを作成し、このインスタンスを `contentConverter` プロパティに割り当てます。

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## データの受信と送信 {id="receive_send_data"}

### データクラスを作成する {id="create_data_class"}

フレームをオブジェクトにシリアライズ/デシリアライズするには、データクラスを作成する必要があります。例えば次のようになります。
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="11"}

kotlinx.serializationを使用する場合、このクラスに `@Serializable` アノテーションが付与されていることを確認してください。
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

### データを受信する {id="receive_data"}

テキストフレームのコンテンツを受信して変換するには、データクラスをパラメーターとして受け取る `receiveDeserialized` 関数を呼び出します。
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="23-26"}

[incoming](server-websockets.md#api-overview) チャネルからデシリアライズされたフレームを受信するには、[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 関数を使用します。`WebsocketContentConverter` は `WebSocketServerSession.converter` プロパティから利用可能です。

### データを送信する {id="send_data"}

[指定されたフォーマット](#configure_serializer)を使用してテキストフレームにデータオブジェクトを渡すには、`sendSerialized` 関数を使用できます。

```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="20-22"}

> 完全な例は以下で確認できます: [server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization)。