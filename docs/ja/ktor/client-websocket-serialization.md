[//]: # (title: Ktor ClientにおけるWebSocketsシリアライゼーション)

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

[ContentNegotiation](client-serialization.md)プラグインと同様に、WebSocketsはテキストフレームを特定の形式でシリアライズ/デシリアライズできます。Ktorクライアントは、以下の形式を標準でサポートしています: JSON、XML、CBOR、およびProtoBuf。

## 依存関係を追加する {id="add_dependencies"}

kotlinx.serializationコンバーターを使用する前に、[Setup](https://github.com/Kotlin/kotlinx.serialization#setup)セクションで説明されているように、Kotlinシリアライゼーションプラグインを追加する必要があります。

#### JSON {id="add_json_dependency"}

JSONデータをシリアライズ/デシリアライズするには、以下のいずれかのライブラリを選択できます: kotlinx.serialization、Gson、またはJackson。

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

ビルドスクリプトに`ktor-serialization-kotlinx-json`アーティファクトを追加します:

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

ビルドスクリプトに`ktor-serialization-gson`アーティファクトを追加します:

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

ビルドスクリプトに`ktor-serialization-jackson`アーティファクトを追加します:

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

XMLをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-xml`を追加します:

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

> 注意: XMLシリアライゼーションは[`jsNode`ターゲットではサポートされていません](https://github.com/pdvrieze/xmlutil/issues/83)。
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBORをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-cbor`を追加します:

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

ProtoBufをシリアライズ/デシリアライズするには、ビルドスクリプトに`ktor-serialization-kotlinx-protobuf`を追加します:

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

## シリアライザーを構成する {id="configure_serializer"}

### JSONシリアライザー {id="register_json"}

<Tabs group="json-libraries">
<TabItem title="kotlinx.serialization" group-key="kotlinx">

WebSocketsの[設定](client-websockets.topic#install_plugin)でJSONシリアライザーを登録するには、`Json`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます:

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

val client = HttpClient(CIO) {
    install(WebSockets) {
        contentConverter = KotlinxWebsocketSerializationConverter(Json)
    }
}
```

</TabItem>
<TabItem title="Gson" group-key="gson">

Gsonシリアライザーを登録するには、`GsonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます:

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</TabItem>
<TabItem title="Jackson" group-key="jackson">

Jacksonシリアライザーを登録するには、`JacksonWebsocketContentConverter`を`contentConverter`プロパティに割り当てます:

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</TabItem>
</Tabs>

### XMLシリアライザー {id="register_xml"}

WebSocketsの[設定](client-websockets.topic#install_plugin)でXMLシリアライザーを登録するには、`XML`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます:

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBORシリアライザー {id="register_cbor"}
WebSocketsの[設定](client-websockets.topic#install_plugin)でCBORシリアライザーを登録するには、`Cbor`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます:

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBufシリアライザー {id="register_protobuf"}
WebSocketsの[設定](client-websockets.topic#install_plugin)でProtoBufシリアライザーを登録するには、`ProtoBuf`パラメータを指定して`KotlinxWebsocketSerializationConverter`インスタンスを作成し、このインスタンスを`contentConverter`プロパティに割り当てます:

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## データの送受信 {id="receive_send_data"}
### データクラスを作成する {id="create_data_class"}

テキストフレームをオブジェクトにシリアライズ/デシリアライズするには、データクラスを作成する必要があります。例:

```kotlin
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

kotlinx.serializationを使用する場合、このクラスに`@Serializable`アノテーションが付いていることを確認してください:

```kotlin
@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)
```

`kotlinx.serialization`の詳細については、[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)を参照してください。

### データを送信する {id="send_data"}

[指定された形式](#configure_serializer)でテキストフレーム内に[クラスインスタンス](#create_data_class)を送信するには、`sendSerialized`関数を使用します:

```kotlin
client.webSocket(method = HttpMethod.Get, host = "127.0.0.1", port = 8080, path = "/customer") {
    sendSerialized(Customer(1, "Jane", "Smith"))
}
```

### データを受信する {id="receive_data"}

テキストフレームのコンテンツを受信して変換するには、データクラスをパラメータとして受け取る`receiveDeserialized`関数を呼び出します:

```kotlin
client.webSocket(method = HttpMethod.Get, host = "127.0.0.1", port = 8080, path = "/customer/1") {
    val customer = receiveDeserialized<Customer>()
    println("A customer with id ${customer.id} is received by the client.")
}
```

[incoming](client-websockets.topic#incoming)チャネルからデシリアライズされたフレームを受信するには、[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html)関数を使用します。`WebsocketContentConverter`は`DefaultClientWebSocketSession.converter`プロパティを介して利用可能です。

> 完全な例はこちらで見つけることができます: [client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization)。