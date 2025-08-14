[//]: # (title: 요청 유효성 검사)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%은(는) 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다.
</link-summary>

`[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html)` 플러그인은 들어오는 요청의 본문을 유효성 검사하는 기능을 제공합니다. [직렬 변환기](server-serialization.md#configure_serializer)가 포함된 `ContentNegotiation` 플러그인이 설치된 경우, 원시 요청 본문 또는 지정된 요청 객체 속성을 유효성 검사할 수 있습니다. 요청 본문 유효성 검사에 실패하면 플러그인은 `RequestValidationException`을 발생시키며, 이 예외는 [StatusPages](server-status-pages.md) 플러그인을 사용하여 처리할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치하려면</a>, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다 ...
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
    

    <p>
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 경로에</a> 설치할 수도 있습니다.
        이는 애플리케이션의 다른 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
    </p>
    

## %plugin_name% 구성 {id="configure"}

`%plugin_name%`을 구성하는 데는 세 가지 주요 단계가 포함됩니다:

1. [본문 내용 수신](#receive-body).
2. [유효성 검사 함수 구성](#validation-function).
3. [유효성 검사 예외 처리](#validation-exception).

### 1. 본문 수신 {id="receive-body"}

`%plugin_name%</code> 플러그인은 타입 파라미터와 함께 **[receive](server-requests.md#body_contents)** 함수를 호출할 경우 요청 본문을 유효성 검사합니다. 예를 들어, 아래 코드 스니펫은 본문을 `String` 값으로 수신하는 방법을 보여줍니다:

[object Promise]

### 2. 유효성 검사 함수 구성 {id="validation-function"}

요청 본문을 유효성 검사하려면 `validate` 함수를 사용하세요.
이 함수는 성공 또는 실패한 유효성 검사 결과를 나타내는 `ValidationResult` 객체를 반환합니다.
실패한 결과의 경우, **[RequestValidationException](#validation-exception)**이 발생합니다.

`validate` 함수에는 요청 본문을 두 가지 방식으로 유효성 검사할 수 있는 두 가지 오버로드가 있습니다:

- 첫 번째 `validate` 오버로드는 요청 본문에 지정된 타입의 객체로 접근할 수 있게 합니다.
   아래 예시는 `String` 값을 나타내는 요청 본문을 유효성 검사하는 방법을 보여줍니다:
   [object Promise]

   특정 [직렬 변환기](server-serialization.md#configure_serializer)로 `ContentNegotiation` 플러그인이 설치 및 구성된 경우, 객체 속성을 유효성 검사할 수 있습니다. [](#example-object)에서 더 자세히 알아보세요.

- 두 번째 `validate` 오버로드는 `ValidatorBuilder`를 허용하며 사용자 정의 유효성 검사 규칙을 제공할 수 있게 합니다.
   [](#example-byte-array)에서 더 자세히 알아보세요.

### 3. 유효성 검사 예외 처리 {id="validation-exception"}

요청 유효성 검사가 실패하면, `%plugin_name%`은(는) `RequestValidationException`을 발생시킵니다.
이 예외를 통해 요청 본문에 접근하고 이 요청에 대한 모든 유효성 검사 실패의 원인을 얻을 수 있습니다.

다음과 같이 [StatusPages](server-status-pages.md) 플러그인을 사용하여 `RequestValidationException`을 처리할 수 있습니다:

[object Promise]

전체 예시는 여기에서 찾을 수 있습니다: [request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation).

## 예시: 객체 속성 유효성 검사 {id="example-object"}

이 예시에서는 `%plugin_name%` 플러그인을 사용하여 객체 속성을 유효성 검사하는 방법을 살펴보겠습니다.
서버가 다음 JSON 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

[object Promise]

`id` 속성의 유효성 검사를 추가하려면 아래 단계를 따르세요:

1. 위 JSON 객체를 설명하는 `Customer` 데이터 클래스를 생성하세요:
   [object Promise]

2. [JSON 직렬 변환기](server-serialization.md#register_json)와 함께 `ContentNegotiation` 플러그인을 설치하세요:
   [object Promise]

3. 다음과 같이 서버 측에서 `Customer` 객체를 수신하세요:
   [object Promise]
4. `%plugin_name%` 플러그인 구성에서 `id` 속성의 유효성 검사를 추가하여 지정된 범위 내에 있는지 확인하세요:
   [object Promise]
   
   이 경우, `id` 값이 `0`보다 작거나 같으면 `%plugin_name%`은(는) **[RequestValidationException](#validation-exception)**을 발생시킬 것입니다.

## 예시: 바이트 배열 유효성 검사 {id="example-byte-array"}

이 예시에서는 바이트 배열로 수신된 요청 본문을 유효성 검사하는 방법을 살펴보겠습니다.
서버가 다음 텍스트 데이터를 포함하는 `POST` 요청을 수신한다고 가정해 봅시다:

[object Promise]

데이터를 바이트 배열로 수신하고 유효성 검사를 수행하려면 다음 단계를 따르세요:

1. 다음과 같이 서버 측에서 데이터를 수신하세요:
   [object Promise]
2. 수신된 데이터를 유효성 검사하기 위해, `ValidatorBuilder`를 허용하고 사용자 정의 유효성 검사 규칙을 제공할 수 있는 두 번째 `validate` [함수 오버로드](#validation-function)를 사용하겠습니다:
   [object Promise]