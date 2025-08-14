[//]: # (title: Ktor 서버의 콘텐츠 협상 및 직렬화)

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

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
ContentNegotiation 플러그인은 클라이언트와 서버 간의 미디어 타입 협상 및 특정 형식으로 콘텐츠를 직렬화/역직렬화하는 두 가지 주요 목적을 수행합니다.
</link-summary>

[ContentNegotiation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-content-negotiation/io.ktor.server.plugins.contentnegotiation/-content-negotiation.html) 플러그인은 두 가지 주요 목적을 수행합니다.
*   클라이언트와 서버 간 미디어 타입 협상. 이를 위해 `Accept` 및 `Content-Type` 헤더를 사용합니다.
*   특정 형식으로 콘텐츠 직렬화/역직렬화. Ktor는 JSON, XML, CBOR, ProtoBuf와 같은 형식을 기본으로 지원합니다.

> 클라이언트 측에서 Ktor는 콘텐츠 직렬화/역직렬화를 위한 [ContentNegotiation](client-serialization.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### ContentNegotiation {id="add_content_negotiation_dependency"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
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
    

특정 형식에 대한 직렬 변환기는 추가 아티팩트가 필요합니다. 예를 들어, kotlinx.serialization은 JSON을 위해 `ktor-serialization-kotlinx-json` 의존성을 필요로 합니다.

### 직렬화 {id="serialization_dependency"}

<snippet id="add_serialization_dependency">

kotlinx.serialization 변환기를 사용하기 전에, [설정 (Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin 직렬화 플러그인을 추가해야 합니다.

#### JSON {id="add_json_dependency"}

JSON 데이터를 직렬화/역직렬화하려면 다음 라이브러리 중 하나를 선택할 수 있습니다: kotlinx.serialization, Gson, 또는 Jackson.

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

빌드 스크립트에 `ktor-serialization-kotlinx-json` 아티팩트를 추가합니다.

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

빌드 스크립트에 `ktor-serialization-gson` 아티팩트를 추가합니다.

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

빌드 스크립트에 `ktor-serialization-jackson` 아티팩트를 추가합니다.

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

XML을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-xml`을(를) 추가합니다.

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
    

> XML 직렬화는 `jsNode` 대상에서는 지원되지 않습니다([https://github.com/pdvrieze/xmlutil/issues/83](https://github.com/pdvrieze/xmlutil/issues/83) 참조).
{style="note"}

#### CBOR {id="add_cbor_dependency"}

CBOR을 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-cbor`을(를) 추가합니다.

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

ProtoBuf를 직렬화/역직렬화하려면 빌드 스크립트에 `ktor-serialization-kotlinx-protobuf`을(를) 추가합니다.

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

## ContentNegotiation 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">모듈</Links>에서 <code>install</code> 함수에 플러그인을 전달합니다.
        아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다.
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내에서.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 직렬 변환기 구성 {id="configure_serializer"}

Ktor는 [JSON](#register_json), [XML](#register_xml), [CBOR](#register_cbor)과 같은 형식을 기본으로 지원합니다. 사용자 지정 직렬 변환기를 직접 구현할 수도 있습니다.

### JSON 직렬 변환기 {id="register_json"}

<tabs group="json-libraries">
<tab title="kotlinx.serialization" group-key="kotlinx">

애플리케이션에 JSON 직렬 변환기를 등록하려면 `json` 메서드를 호출합니다.
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.json.*

install(ContentNegotiation) {
    json()
}
```

`json` 메서드는 또한 [JsonBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-json/kotlinx.serialization.json/-json-builder/)에서 제공하는 직렬화 설정을 조정할 수 있도록 합니다. 예를 들면 다음과 같습니다.

[object Promise]

</tab>
<tab title="Gson" group-key="gson">

애플리케이션에 Gson 직렬 변환기를 등록하려면 `gson` 메서드를 호출합니다.
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.gson.*

install(ContentNegotiation) {
    gson()
}
```

`gson` 메서드는 또한 [GsonBuilder](https://www.javadoc.io/doc/com.google.code.gson/gson/latest/com.google.gson/com/google/gson/GsonBuilder.html)에서 제공하는 직렬화 설정을 조정할 수 있도록 합니다. 예를 들면 다음과 같습니다.

[object Promise]

</tab>
<tab title="Jackson" group-key="jackson">

애플리케이션에 Jackson 직렬 변환기를 등록하려면 `jackson` 메서드를 호출합니다.

```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*

install(ContentNegotiation) {
    jackson()
}
```

`jackson` 메서드는 또한 [ObjectMapper](https://fasterxml.github.io/jackson-databind/javadoc/2.9/com/fasterxml/jackson/databind/ObjectMapper.html)에서 제공하는 직렬화 설정을 조정할 수 있도록 합니다. 예를 들면 다음과 같습니다.

[object Promise]

</tab>
</tabs>

### XML 직렬 변환기 {id="register_xml"}

애플리케이션에 XML 직렬 변환기를 등록하려면 `xml` 메서드를 호출합니다.
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.xml.*

install(ContentNegotiation) {
    xml()
}
```

`xml` 메서드는 또한 XML 직렬화 설정에 접근할 수 있도록 합니다. 예를 들면 다음과 같습니다.

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
애플리케이션에 CBOR 직렬 변환기를 등록하려면 `cbor` 메서드를 호출합니다.
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.cbor.*

install(ContentNegotiation) {
    cbor()
}
```

`cbor` 메서드는 또한 [CborBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-cbor/kotlinx.serialization.cbor/-cbor-builder/)에서 제공하는 CBOR 직렬화 설정에 접근할 수 있도록 합니다. 예를 들면 다음과 같습니다.

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
애플리케이션에 ProtoBuf 직렬 변환기를 등록하려면 `protobuf` 메서드를 호출합니다.
```kotlin
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.serialization.kotlinx.protobuf.*

install(ContentNegotiation) {
    protobuf()
}
```

`protobuf` 메서드는 또한 [ProtoBufBuilder](https://kotlinlang.org/api/kotlinx.serialization/kotlinx-serialization-protobuf/kotlinx.serialization.protobuf/-proto-buf-builder/)에서 제공하는 ProtoBuf 직렬화 설정에 접근할 수 있도록 합니다. 예를 들면 다음과 같습니다.

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

### 사용자 지정 직렬 변환기 {id="register_custom"}

지정된 `Content-Type`에 대한 사용자 지정 직렬 변환기를 등록하려면 `register` 메서드를 호출해야 합니다. 아래 예시에서는 `application/json` 및 `application/xml` 데이터를 역직렬화하기 위해 두 개의 [사용자 지정 직렬 변환기](#implement_custom_serializer)가 등록됩니다.

```kotlin
install(ContentNegotiation) {
    register(ContentType.Application.Json, CustomJsonConverter())
    register(ContentType.Application.Xml, CustomXmlConverter())
}
```

## 데이터 수신 및 전송 {id="receive_send_data"}

### 데이터 클래스 생성 {id="create_data_class"}
수신된 데이터를 객체로 역직렬화하려면 데이터 클래스를 생성해야 합니다. 예를 들면 다음과 같습니다.
[object Promise]

kotlinx.serialization을 사용하는 경우, 이 클래스에 `@Serializable` 애너테이션이 있는지 확인하세요.
[object Promise]

<snippet id="serialization_types">

다음 유형의 직렬화/역직렬화는 kotlinx.serialization 라이브러리에서 지원됩니다.

-   [내장 클래스 (Builtin classes)](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
-   [시퀀스 (Sequences)](https://kotlinlang.org/docs/sequences.html) 역직렬화
-   [플로우 (Flows)](https://kotlinlang.org/docs/flow.html) 직렬화

</snippet>

### 데이터 수신 {id="receive_data"}
요청 콘텐츠를 수신하고 변환하려면 데이터 클래스를 매개변수로 받는 `receive` 메서드를 호출합니다.
[object Promise]

요청의 `Content-Type`은 요청 처리를 위한 [직렬 변환기](#configure_serializer)를 선택하는 데 사용됩니다. 아래 예시는 JSON 또는 XML 데이터를 포함하며 서버 측에서 `Customer` 객체로 변환되는 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) 요청 샘플을 보여줍니다.

<tabs>
<tab title="JSON">

[object Promise]

</tab>
<tab title="XML">

[object Promise]

</tab>
</tabs>

전체 예시는 여기에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

### 데이터 전송 {id="send_data"}
응답으로 데이터 객체를 전달하려면 `respond` 메서드를 사용할 수 있습니다.
[object Promise]

이 경우, Ktor는 필요한 [직렬 변환기](#configure_serializer)를 선택하기 위해 `Accept` 헤더를 사용합니다. 전체 예시는 여기에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

## 사용자 지정 직렬 변환기 구현 {id="implement_custom_serializer"}

Ktor에서는 데이터 직렬화/역직렬화를 위해 자신만의 [직렬 변환기](#configure_serializer)를 작성할 수 있습니다. 이를 위해서는 [ContentConverter](https://api.ktor.io/ktor-shared/ktor-serialization/io.ktor.serialization/-content-converter/index.html) 인터페이스를 구현해야 합니다.
```kotlin
interface ContentConverter {
    suspend fun serialize(contentType: ContentType, charset: Charset, typeInfo: TypeInfo, value: Any): OutgoingContent?
    suspend fun deserialize(charset: Charset, typeInfo: TypeInfo, content: ByteReadChannel): Any?
}
```
구현 예시로 [GsonConverter](https://github.com/ktorio/ktor/blob/main/ktor-shared/ktor-serialization/ktor-serialization-gson/jvm/src/GsonConverter.kt) 클래스를 살펴보세요.