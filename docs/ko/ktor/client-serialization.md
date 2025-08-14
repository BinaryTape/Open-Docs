[//]: # (title: Ktor 클라이언트의 콘텐츠 협상 및 직렬화)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="ContentNegotiation"/>
<var name="artifact_name" value="ktor-client-content-negotiation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-json-kotlinx"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
ContentNegotiation 플러그인은 크게 두 가지 목적을 수행합니다. 클라이언트와 서버 간 미디어 타입 협상 및 요청 전송과 응답 수신 시 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 것입니다.
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-content-negotiation/io.ktor.client.plugins.contentnegotiation/-content-negotiation) 플러그인은 크게 두 가지 목적을 수행합니다.
* 클라이언트와 서버 간 미디어 타입을 협상합니다. 이를 위해 `Accept` 및 `Content-Type` 헤더를 사용합니다.
* [요청](client-requests.md) 전송 및 [응답](client-responses.md) 수신 시 특정 형식으로 콘텐츠를 직렬화/역직렬화합니다. Ktor는 JSON, XML, CBOR, ProtoBuf와 같은 형식을 기본으로 지원합니다. XML 직렬화 도구는 [JVM](client-engines.md)에서만 지원됩니다.

> 서버 측에서 Ktor는 콘텐츠 직렬화/역직렬화를 위한 [ContentNegotiation](server-serialization.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}
### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
    </p>
    

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
    

    <p>
        Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아보세요.">클라이언트 의존성 추가</Links>에서 확인할 수 있습니다.
    </p>
    

특정 형식에 대한 직렬화 도구는 추가 아티팩트를 필요로 합니다. 예를 들어, kotlinx.serialization은 JSON을 위해 `ktor-serialization-kotlinx-json` 의존성이 필요합니다. 포함된 아티팩트에 따라 Ktor는 기본 직렬화 도구를 자동으로 선택합니다. 필요한 경우 직렬화 도구를 명시적으로 [지정](#configure_serializer)하고 구성할 수 있습니다.

### 직렬화 {id="serialization_dependency"}

kotlinx.serialization 컨버터를 사용하기 전에 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin 직렬화 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 다음 라이브러리 중 하나를 선택할 수 있습니다: kotlinx.serialization, Gson, 또는 Jackson.

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
    

> XML 직렬화는 `jsNode` 타겟에서 지원되지 않습니다.
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`을 추가하세요:

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

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`을 추가하세요:

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
    

## ContentNegotiation 설치 {id="install_plugin"}

`ContentNegotiation`을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달하세요:

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation)
}
```
이제 필요한 JSON 직렬화 도구를 [구성](#configure_serializer)할 수 있습니다.

## 직렬화 도구 구성 {id="configure_serializer"}

### JSON 직렬화 도구 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

애플리케이션에 JSON 직렬화 도구를 등록하려면 `json` 메서드를 호출하세요:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}
```

`json` 생성자에서 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/) API에 접근할 수 있습니다. 예를 들면 다음과 같습니다:
[object Promise]

전체 예시는 여기에서 확인할 수 있습니다: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx).

</tab>
<tab title="Gson" group-key="gson">

애플리케이션에 Gson 직렬화 도구를 등록하려면 [gson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-gson/io.ktor.serialization.gson/gson.html) 메서드를 호출하세요:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        gson()
    }
}
```

`gson` 메서드는 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)에서 제공하는 직렬화 설정을 조정할 수도 있습니다.

</tab>
<tab title="Jackson" group-key="jackson">

애플리케이션에 Jackson 직렬화 도구를 등록하려면 [jackson](https://api.ktor.io/ktor-shared/ktor-serialization/ktor-serialization-jackson/io.ktor.serialization.jackson/jackson.html) 메서드를 호출하세요:

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        jackson()
    }
}
```

`jackson` 메서드는 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)에서 제공하는 직렬화 설정을 조정할 수도 있습니다.

</tab>
</tabs>

### XML 직렬화 도구 {id="register_xml"}

애플리케이션에 XML 직렬화 도구를 등록하려면 `xml` 메서드를 호출하세요:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        xml()
    }
}
```

`xml` 메서드는 XML 직렬화 설정에 접근할 수도 있습니다. 예를 들면 다음과 같습니다:

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

### CBOR 직렬화 도구 {id="register_cbor"}
애플리케이션에 CBOR 직렬화 도구를 등록하려면 `cbor` 메서드를 호출하세요:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        cbor()
    }
}
```

`cbor` 메서드는 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)에서 제공하는 CBOR 직렬화 설정에 접근할 수도 있습니다. 예를 들면 다음과 같습니다:

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

### ProtoBuf 직렬화 도구 {id="register_protobuf"}
애플리케이션에 ProtoBuf 직렬화 도구를 등록하려면 `protobuf` 메서드를 호출하세요:
```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        protobuf()
    }
}
```

`protobuf` 메서드는 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)에서 제공하는 ProtoBuf 직렬화 설정에 접근할 수도 있습니다. 예를 들면 다음과 같습니다:

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

## 데이터 송수신 {id="receive_send_data"}
### 데이터 클래스 생성 {id="create_data_class"}

데이터를 송수신하려면 다음과 같은 데이터 클래스가 필요합니다:
[object Promise]

kotlinx.serialization을 사용하는 경우, 이 클래스에 `@Serializable` 어노테이션이 있는지 확인하세요:
[object Promise]

<snippet id="serialization_types">

다음 타입의 직렬화/역직렬화는 kotlinx.serialization 라이브러리에서 지원됩니다:

- [내장 클래스](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
- [시퀀스](https://kotlinlang.org/docs/sequences.html) 역직렬화
- [플로우](https://kotlinlang.org/docs/flow.html) 직렬화

</snippet>

### 데이터 전송 {id="send_data"}

JSON 형식으로 [요청](client-requests.md) 본문에 [클래스 인스턴스](#create_data_class)를 전송하려면, `setBody` 함수를 사용하여 이 인스턴스를 할당하고 `contentType`을 호출하여 콘텐츠 타입을 `application/json`으로 설정하세요:

[object Promise]

XML 또는 CBOR로 데이터를 전송하려면 `contentType`을 각각 `ContentType.Application.Xml` 또는 `ContentType.Application.Cbor`로 설정하세요.

### 데이터 수신 {id="receive_data"}

서버가 `application/json`, `application/xml`, 또는 `application/cbor` 콘텐츠가 포함된 [응답](client-responses.md)을 보낼 때, 응답 페이로드를 수신하는 데 사용되는 함수의 매개변수로 [데이터 클래스](#create_data_class)를 지정하여 역직렬화할 수 있습니다 (아래 예시에서는 `body`):
[object Promise]

전체 예시는 여기에서 확인할 수 있습니다: [client-json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-json-kotlinx).