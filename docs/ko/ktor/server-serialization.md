[//]: # (title: Ktor 서버에서 콘텐츠 협상 및 직렬화)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="package_name" value="io.ktor.server.plugins.contentnegotiation"/>
<var name="artifact_name" value="ktor-server-content-negotiation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
ContentNegotiation 플러그인은 클라이언트와 서버 간 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다.
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html) 플러그인은 두 가지 주요 목적을 수행합니다.
* 클라이언트와 서버 간 미디어 타입 협상. 이를 위해 `Accept` 및 `Content-Type` 헤더를 사용합니다.
* 특정 형식으로 콘텐츠 직렬화/역직렬화. Ktor는 JSON, XML, CBOR, ProtoBuf를 즉시 지원합니다.

> 클라이언트에서 Ktor는 콘텐츠를 직렬화/역직렬화하기 위한 [ContentNegotiation](client-serialization.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

특정 형식의 직렬 변환기는 추가 아티팩트(artifact)를 필요로 합니다. 예를 들어, `kotlinx.serialization`은 JSON을 위해 `ktor-serialization-kotlinx-json` 의존성을 필요로 합니다.

### 직렬화 {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

`kotlinx.serialization` 변환기를 사용하기 전에, [설정](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin 직렬화 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 `kotlinx.serialization`, Gson 또는 Jackson 라이브러리 중 하나를 선택할 수 있습니다.

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

XML을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-xml`을 추가합니다.

<var name="artifact_name" value="ktor-serialization-kotlinx-xml"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

> XML 직렬화는 [`jsNode` 타겟에서 지원되지 않습니다](https://github.com/pdvrieze/xmlutil/issues/83).
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`을 추가합니다.

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`를 추가합니다.

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

</snippet>

## ContentNegotiation 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 직렬 변환기 구성 {id="configure_serializer"}

Ktor는 [JSON](#register_json), [XML](#register_xml), [CBOR](#register_cbor)과 같은 형식을 즉시 지원합니다. 또한 자신만의 커스텀 직렬 변환기를 구현할 수도 있습니다.

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

애플리케이션에 JSON 직렬 변환기를 등록하려면 `json` 메서드를 호출합니다:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json` 메서드를 사용하면 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/)가 제공하는 직렬화 설정을 조정할 수도 있습니다. 예를 들어:

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="25-30"}

</tab>
<tab title="Gson" group-key="gson">

애플리케이션에 Gson 직렬 변환기를 등록하려면 `gson` 메서드를 호출합니다:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson` 메서드를 사용하면 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)가 제공하는 직렬화 설정을 조정할 수도 있습니다. 예를 들어:

```kotlin
```
{src="snippets/gson/src/main/kotlin/com/example/GsonApplication.kt" include-lines="24-29"}

</tab>
<tab title="Jackson" group-key="jackson">

애플리케이션에 Jackson 직렬 변환기를 등록하려면 `jackson` 메서드를 호출합니다:

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson` 메서드를 사용하면 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)가 제공하는 직렬화 설정을 조정할 수도 있습니다. 예를 들어:

```kotlin
```
{src="snippets/jackson/src/main/kotlin/com/example/JacksonApplication.kt" include-lines="26-35"}

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

애플리케이션에 XML 직렬 변환기를 등록하려면 `xml` 메서드를 호출합니다:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml` 메서드를 사용하면 XML 직렬화 설정에 접근할 수도 있습니다. 예를 들어:

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

### CBOR 직렬 변환기 {id="register_cbor"}
애플리케이션에 CBOR 직렬 변환기를 등록하려면 `cbor` 메서드를 호출합니다:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor` 메서드를 사용하면 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)가 제공하는 CBOR 직렬화 설정에 접근할 수도 있습니다. 예를 들어:

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

### ProtoBuf 직렬 변환기 {id="register_protobuf"}
애플리케이션에 ProtoBuf 직렬 변환기를 등록하려면 `protobuf` 메서드를 호출합니다:
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf` 메서드를 사용하면 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)가 제공하는 ProtoBuf 직렬화 설정에 접근할 수도 있습니다. 예를 들어:

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

### 커스텀 직렬 변환기 {id="register_custom"}

지정된 `Content-Type`에 대한 커스텀 직렬 변환기를 등록하려면 `register` 메서드를 호출해야 합니다. 아래 예시에서는 `application/json` 및 `application/xml` 데이터를 역직렬화하기 위해 두 개의 [커스텀 직렬 변환기](#implement_custom_serializer)가 등록됩니다:

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## 데이터 수신 및 전송 {id="receive_send_data"}

### 데이터 클래스 생성 {id="create_data_class"}
수신된 데이터를 객체로 역직렬화하려면 데이터 클래스를 생성해야 합니다. 예를 들어:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="14"}

`kotlinx.serialization`을 사용하는 경우, 이 클래스에 `@Serializable` 어노테이션이 있는지 확인하십시오:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="10,12-14"}

<snippet id="serialization_types">

다음 타입의 직렬화/역직렬화는 `kotlinx.serialization` 라이브러리에서 지원됩니다:

- [내장 클래스](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [시퀀스](https://kotlinlang.org/docs/sequences.html)의 역직렬화
- [플로우](https://kotlinlang.org/docs/flow.html)의 직렬화

</snippet>

### 데이터 수신 {id="receive_data"}
요청 콘텐츠를 수신하고 변환하려면 데이터 클래스를 매개변수로 받는 `receive` 메서드를 호출합니다:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="38-42"}

요청의 `Content-Type`은 요청을 처리할 [직렬 변환기](#configure_serializer)를 선택하는 데 사용됩니다. 아래 예시는 JSON 또는 XML 데이터를 포함하며 서버 측에서 `Customer` 객체로 변환되는 샘플 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) 요청을 보여줍니다:

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

전체 예시는 다음에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

### 데이터 전송 {id="send_data"}
응답으로 데이터 객체를 전달하려면 `respond` 메서드를 사용할 수 있습니다:
```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="32-36"}

이 경우 Ktor는 `Accept` 헤더를 사용하여 필요한 [직렬 변환기](#configure_serializer)를 선택합니다. 전체 예시는 다음에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

## 커스텀 직렬 변환기 구현 {id="implement_custom_serializer"}

Ktor에서는 데이터를 직렬화/역직렬화하기 위해 자신만의 [직렬 변환기](#configure_serializer)를 작성할 수 있습니다. 이를 위해 [ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html) 인터페이스를 구현해야 합니다:
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
구현 예시는 [GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt) 클래스를 참조하십시오.