[//]: # (title: Ktor 서버의 WebSockets 직렬화)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="server-websockets-serialization"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

[ContentNegotiation](server-serialization.md) 플러그인과 유사하게, WebSockets를 사용하면 텍스트 프레임을 특정 형식으로 직렬화/역직렬화할 수 있습니다. Ktor는 JSON, XML, CBOR, ProtoBuf를 포함한 다음 형식을 기본으로 제공합니다.

## 의존성 추가 {id="add_dependencies"}

<snippet id="add_serialization_dependency">

`kotlinx.serialization` 컨버터를 사용하기 전에, [설정(Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 다음 라이브러리 중 하나를 선택할 수 있습니다: `kotlinx.serialization`, `Gson`, 또는 `Jackson`.

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

빌드 스크립트에 `ktor-serialization-kotlinx-json` 아티팩트를 추가하세요:

<var name="artifact_name" value="ktor-serialization-kotlinx-json"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
<tab title="Gson" group-key="gson">

빌드 스크립트에 `ktor-serialization-gson` 아티팩트를 추가하세요:

<var name="artifact_name" value="ktor-serialization-gson"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
<tab title="Jackson" group-key="jackson">

빌드 스크립트에 `ktor-serialization-jackson` 아티팩트를 추가하세요:

<var name="artifact_name" value="ktor-serialization-jackson"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</tab>
</tabs>

#### XML {id="add_xml_dependency"}

XML을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-xml`을 추가하세요:

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

> 참고: XML 직렬화는 [`jsNode` 타겟에서 지원되지 않습니다](https://github.com/pdvrieze/xmlutil/issues/83).
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`를 추가하세요:

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`를 추가하세요:

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>

<tabs group="languages">
    <tab title="Gradle (Kotlin)" group-key="kotlin">
        [object Promise]
    </tab>
    <tab title="Gradle (Groovy)" group-key="groovy">
        [object Promise]
    </tab>
    <tab title="Maven" group-key="maven">
        [object Promise]
    </tab>
</tabs>
    

</snippet>

## 직렬 변환기 구성 {id="configure_serializer"}

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

WebSockets [구성(configuration)](server-websockets.md#configure)에 JSON 직렬 변환기를 등록하려면, `Json` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당하세요:

```kotlin
import io.ktor.serialization.kotlinx.*
import kotlinx.serialization.json.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Json)
}
```

</tab>
<tab title="Gson" group-key="gson">

Gson 직렬 변환기를 등록하려면, `GsonWebsocketContentConverter`를 `contentConverter` 속성에 할당하세요:
```kotlin
import io.ktor.serialization.gson.*

install(WebSockets) {
    contentConverter = GsonWebsocketContentConverter()
}
```

</tab>
<tab title="Jackson" group-key="jackson">

Jackson 직렬 변환기를 등록하려면, `JacksonWebsocketContentConverter`를 `contentConverter` 속성에 할당하세요:

```kotlin
import io.ktor.serialization.jackson.*

install(WebSockets) {
    contentConverter = JacksonWebsocketContentConverter()
}
```

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

WebSockets [구성(configuration)](server-websockets.md#configure)에 XML 직렬 변환기를 등록하려면, `XML` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당하세요:
```kotlin
import nl.adaptivity.xmlutil.serialization.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(XML)
}
```

### CBOR 직렬 변환기 {id="register_cbor"}
WebSockets [구성(configuration)](server-websockets.md#configure)에 CBOR 직렬 변환기를 등록하려면, `Cbor` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당하세요:

```kotlin
import io.ktor.serialization.kotlinx.cbor.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(Cbor)
}
```

### ProtoBuf 직렬 변환기 {id="register_protobuf"}
WebSockets [구성(configuration)](server-websockets.md#configure)에 ProtoBuf 직렬 변환기를 등록하려면, `ProtoBuf` 파라미터로 `KotlinxWebsocketSerializationConverter` 인스턴스를 생성하고 이 인스턴스를 `contentConverter` 속성에 할당하세요:

```kotlin
import kotlinx.serialization.protobuf.*

install(WebSockets) {
    contentConverter = KotlinxWebsocketSerializationConverter(ProtoBuf)
}
```

## 데이터 수신 및 전송 {id="receive_send_data"}

### 데이터 클래스 생성 {id="create_data_class"}
프레임을 객체로/로부터 직렬화/역직렬화하려면, 예를 들어 다음과 같은 데이터 클래스를 생성해야 합니다:
[object Promise]

`kotlinx.serialization`을 사용하는 경우, 이 클래스에 `@Serializable` 어노테이션이 있는지 확인하세요:
[object Promise]

### 데이터 수신 {id="receive_data"}
텍스트 프레임의 내용을 수신하고 변환하려면, 데이터 클래스를 파라미터로 받는 `receiveDeserialized` 함수를 호출하세요:
[object Promise]

[incoming](server-websockets.md#api-overview) 채널에서 역직렬화된 프레임을 수신하려면 `WebsocketContentConverter.deserialize` 함수를 사용하세요. `WebsocketContentConverter`는 `WebSocketServerSession.converter` 속성을 통해 사용할 수 있습니다.

### 데이터 전송 {id="send_data"}
[지정된 형식](#configure_serializer)을 사용하여 텍스트 프레임에 데이터 객체를 전달하려면 `sendSerialized` 함수를 사용할 수 있습니다:

[object Promise]

> 전체 예시는 다음에서 찾을 수 있습니다: [server-websockets-serialization](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/server-websockets-serialization).