[//]: # (title: Ktor Client에서 WebSocket 직렬화)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-websockets-serialization"/>

    <p>
        <b>코드 예제</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ContentNegotiation](client-serialization.md) 플러그인과 유사하게, WebSockets를 사용하면 특정 형식으로 텍스트 프레임을 직렬화/역직렬화할 수 있습니다. Ktor 클라이언트는 JSON, XML, CBOR, ProtoBuf와 같은 형식을 기본적으로 지원합니다.

## 의존성 추가 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

kotlinx.serialization 컨버터를 사용하기 전에, [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin 직렬화 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 다음 라이브러리 중 하나를 선택할 수 있습니다: kotlinx.serialization, Gson, 또는 Jackson. 

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

빌드 스크립트에 `ktor-serialization-kotlinx-json` 아티팩트를 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Gson" group-key="gson">

빌드 스크립트에 `ktor-serialization-gson` 아티팩트를 추가합니다:

<var name="artifact_name" value="ktor-serialization-gson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
<tab title="Jackson" group-key="jackson">

빌드 스크립트에 `ktor-serialization-jackson` 아티팩트를 추가합니다:

<var name="artifact_name" value="ktor-serialization-jackson"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

XML을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-xml`을 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> XML 직렬화는 [`jsNode` 타겟에서 지원되지 않음](https://github.com/pdvrieze/xmlutil/issues/83)에 유의하세요.
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`를 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`를 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</snippet>

## 직렬 변환기 구성 {id="configure_serializer"}

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSockets [설정](client-websockets.topic#install_plugin)에 JSON 직렬 변환기를 등록하려면, `Json` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다:

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

Gson 직렬 변환기를 등록하려면, `GsonWebsocketContentConverter`를 `contentConverter` 속성에 할당합니다:

```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jackson 직렬 변환기를 등록하려면, `JacksonWebsocketContentConverter`를 `contentConverter` 속성에 할당합니다:

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

WebSockets [설정](client-websockets.topic#install_plugin)에 XML 직렬 변환기를 등록하려면, `XML` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다:

```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 직렬 변환기 {id="register_cbor"}
WebSockets [설정](client-websockets.topic#install_plugin)에 CBOR 직렬 변환기를 등록하려면, `Cbor` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다:

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 직렬 변환기 {id="register_protobuf"}
WebSockets [설정](client-websockets.topic#install_plugin)에 ProtoBuf 직렬 변환기를 등록하려면, `ProtoBuf` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당합니다:

```kotlin
import io.ktor.serialization.kotlinx.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 데이터 수신 및 전송 {id="receive_send_data"}
### 데이터 클래스 생성 {id="create_data_class"}

텍스트 프레임을 객체로/객체에서 직렬화/역직렬화하려면 데이터 클래스를 생성해야 합니다. 예를 들면 다음과 같습니다:

[object Promise]

kotlinx.serialization을 사용하는 경우, 이 클래스에 `@Serializable` 어노테이션이 있는지 확인하세요:

[object Promise]

`kotlinx.serialization`에 대해 더 자세히 알아보려면, [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)를 참조하세요.

### 데이터 전송 {id="send_data"}

[지정된 형식](#configure_serializer)의 텍스트 프레임 내에서 [클래스 인스턴스](#create_data_class)를 전송하려면 `sendSerialized` 함수를 사용합니다:

[object Promise]

### 데이터 수신 {id="receive_data"}

텍스트 프레임의 내용을 수신하고 변환하려면, 데이터 클래스를 파라미터로 받는 `receiveDeserialized` 함수를 호출합니다:

[object Promise]

[incoming](client-websockets.topic#incoming) 채널에서 역직렬화된 프레임을 수신하려면 [WebsocketContentConverter.deserialize](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-websocket-content-converter/deserialize.html) 함수를 사용하세요. `WebsocketContentConverter`는 `DefaultClientWebSocketSession.converter` 속성을 통해 사용할 수 있습니다.

> 전체 예제는 여기에서 찾을 수 있습니다: [client-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-websockets-serialization).