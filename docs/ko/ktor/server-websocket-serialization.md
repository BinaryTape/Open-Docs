[//]: # (title: Ktor 서버에서 웹소켓 직렬화)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

`[ContentNegotiation](server-serialization.md)` 플러그인과 유사하게, 웹소켓을 사용하면 특정 형식으로 텍스트 프레임을 직렬화/역직렬화할 수 있습니다. Ktor는 JSON, XML, CBOR, ProtoBuf와 같은 형식을 기본으로 지원합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="server-serialization.md" element-id="add_serialization_dependency"/>

## 직렬 변환기 구성 {id="configure_serializer"}

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

웹소켓 `[configuration](server-websockets.md#configure)`에 JSON 직렬 변환기를 등록하려면, `Json` 매개변수로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다.

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

Gson 직렬 변환기를 등록하려면 `GsonWebsocketContentConverter`를 `contentConverter` 속성에 할당합니다.
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jackson 직렬 변환기를 등록하려면 `JacksonWebsocketContentConverter`를 `contentConverter` 속성에 할당합니다.

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

웹소켓 `[configuration](server-websockets.md#configure)`에 XML 직렬 변환기를 등록하려면, `XML` 매개변수로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다.
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 직렬 변환기 {id="register_cbor"}

웹소켓 `[configuration](server-websockets.md#configure)`에 CBOR 직렬 변환기를 등록하려면, `Cbor` 매개변수로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다.

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 직렬 변환기 {id="register_protobuf"}

웹소켓 `[configuration](server-websockets.md#configure)`에 ProtoBuf 직렬 변환기를 등록하려면, `ProtoBuf` 매개변수로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다.

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 데이터 수신 및 전송 {id="receive_send_data"}

### 데이터 클래스 생성 {id="create_data_class"}

프레임을 객체로/객체에서 직렬화/역직렬화하려면 데이터 클래스를 생성해야 합니다. 예를 들어 다음과 같습니다.
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="11"}

kotlinx.serialization을 사용하는 경우, 이 클래스에 `@Serializable` 어노테이션이 있는지 확인하세요.
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="10-11"}

### 데이터 수신 {id="receive_data"}

텍스트 프레임의 내용을 수신하고 변환하려면 데이터 클래스를 매개변수로 받는 `receiveDeserialized` 함수를 호출하세요.
```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="23-26"}

`[incoming](server-websockets.md#api-overview)` 채널에서 역직렬화된 프레임을 수신하려면 `[WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html)` 함수를 사용하세요. `WebsocketContentConverter`는 `WebSocketServerSession.converter` 속성을 통해 사용할 수 있습니다.

### 데이터 전송 {id="send_data"}

`[지정된 형식](#configure_serializer)`을 사용하여 텍스트 프레임에 데이터 객체를 전달하려면 `sendSerialized` 함수를 사용할 수 있습니다.

```kotlin
```
{src="snippets/server-websockets-serialization/src/main/kotlin/com/example/Application.kt" include-lines="20-22"}

> 전체 예제는 다음에서 찾을 수 있습니다: [server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization).