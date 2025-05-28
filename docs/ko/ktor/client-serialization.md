[//]: # (title: Ktor Client의 콘텐츠 협상 및 직렬화)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상과 요청을 보내고 응답을 받을 때 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다.
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation)
플러그인은 두 가지 주요 목적을 수행합니다:
*   클라이언트와 서버 간의 미디어 타입 협상. 이를 위해 `Accept` 및 `Content-Type` 헤더를 사용합니다.
*   [요청](client-requests.md)을 보내고 [응답](client-responses.md)을 받을 때 특정 형식으로 콘텐츠를 직렬화/역직렬화. Ktor는 JSON, XML, CBOR, ProtoBuf와 같은 형식을 기본으로 지원합니다. XML 직렬화는 [JVM](client-engines.md)에서만 지원됩니다.

> 서버에서는 Ktor가 콘텐츠 직렬화/역직렬화를 위한 [ContentNegotiation](server-serialization.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

특정 형식의 직렬 변환기는 추가 아티팩트가 필요합니다. 예를 들어, kotlinx.serialization은 JSON을 위해 `ktor-serialization-kotlinx-json` 의존성을 필요로 합니다. 포함된 아티팩트에 따라 Ktor는 기본 직렬 변환기를 자동으로 선택합니다. 필요한 경우 직렬 변환기를 명시적으로 [지정하고](#configure_serializer) 구성할 수 있습니다.

### 직렬화 {id="serialization_dependency"}

kotlinx.serialization 변환기를 사용하기 전에, [설정 (Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 kotlinx.serialization, Gson, Jackson 중 하나를 선택할 수 있습니다.

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

> XML 직렬화는 [`jsNode` 대상](https://github.com/pdvrieze/xmlutil/issues/83)에서 지원되지 않습니다.
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`를 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-cbor"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

#### ProtoBuf {id="add_protobuf_dependency"}

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`를 추가합니다:

<var name="artifact_name" value="ktor-serialization-kotlinx-protobuf"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## ContentNegotiation 설치 {id="install_plugin"}

`ContentNegotiation`을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달합니다:

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
이제 필요한 JSON 직렬 변환기를 [구성](#configure_serializer)할 수 있습니다.

## 직렬 변환기 구성 {id="configure_serializer"}

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

애플리케이션에 JSON 직렬 변환기를 등록하려면 `json` 메서드를 호출합니다:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

`json` 생성자에서 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) API에 접근할 수 있습니다. 예를 들어:
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="24-31"}

전체 예시는 [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)에서 찾을 수 있습니다.

</tab>
<tab title="Gson" group-key="gson">

애플리케이션에 Gson 직렬 변환기를 등록하려면 [gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html) 메서드를 호출합니다:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson` 메서드는 또한 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)에서 제공하는 직렬화 설정을 조정할 수 있도록 합니다.

</tab>
<tab title="Jackson" group-key="jackson">

애플리케이션에 Jackson 직렬 변환기를 등록하려면 [jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html) 메서드를 호출합니다:

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson` 메서드는 또한 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)에서 제공하는 직렬화 설정을 조정할 수 있도록 합니다.

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

애플리케이션에 XML 직렬 변환기를 등록하려면 `xml` 메서드를 호출합니다:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml` 메서드는 또한 XML 직렬화 설정에 접근할 수 있도록 합니다. 예를 들어:

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

### CBOR 직렬 변환기 {id="register_cbor"}
애플리케이션에 CBOR 직렬 변환기를 등록하려면 `cbor` 메서드를 호출합니다:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor` 메서드는 또한 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)에서 제공하는 CBOR 직렬화 설정에 접근할 수 있도록 합니다. 예를 들어:

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

### ProtoBuf 직렬 변환기 {id="register_protobuf"}
애플리케이션에 ProtoBuf 직렬 변환기를 등록하려면 `protobuf` 메서드를 호출합니다:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf` 메서드는 또한 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)에서 제공하는 ProtoBuf 직렬화 설정에 접근할 수 있도록 합니다. 예를 들어:

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

## 데이터 수신 및 전송 {id="receive_send_data"}
### 데이터 클래스 생성 {id="create_data_class"}

데이터를 수신하고 전송하려면 다음과 같은 데이터 클래스(data class)가 필요합니다:
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="19"}

kotlinx.serialization을 사용하는 경우, 이 클래스에 `@Serializable` 애너테이션이 붙어 있는지 확인하세요:
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="18-19"}

<include from="server-serialization.md" element-id="serialization_types"/>

### 데이터 전송 {id="send_data"}

[요청](client-requests.md) 본문 내에서 [클래스 인스턴스](#create_data_class)를 JSON으로 보내려면, `setBody` 함수를 사용하여 이 인스턴스를 할당하고 `contentType`을 호출하여 콘텐츠 타입을 `application/json`으로 설정합니다:

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

데이터를 XML 또는 CBOR로 보내려면 `contentType`을 각각 `ContentType.Application.Xml` 또는 `ContentType.Application.Cbor`로 설정합니다.

### 데이터 수신 {id="receive_data"}

서버가 `application/json`, `application/xml`, 또는 `application/cbor` 콘텐츠와 함께 [응답](client-responses.md)을 보내는 경우, 응답 페이로드를 수신하는 데 사용되는 함수의 매개변수(`body` 아래 예시)로 [데이터 클래스](#create_data_class)를 지정하여 역직렬화할 수 있습니다:
```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

전체 예시는 [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx)에서 찾을 수 있습니다.