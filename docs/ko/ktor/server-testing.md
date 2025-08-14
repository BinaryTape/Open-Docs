[//]: # (title: Ktor 서버에서 테스트하기)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
특별한 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.
</link-summary>

Ktor는 웹 서버를 생성하지 않고, 소켓에 바인딩하지 않으며, 실제 HTTP 요청을 만들지 않는 특별한 테스트 엔진을 제공합니다. 대신, 이 엔진은 내부 메커니즘에 직접 연결되어 애플리케이션 호출을 직접 처리합니다. 이는 테스트를 위해 완전한 웹 서버를 실행하는 것보다 더 빠른 테스트 실행을 가능하게 합니다. 

## 의존성 추가 {id="add-dependencies"}
Ktor 서버 애플리케이션을 테스트하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다.
* `ktor-server-test-host` 의존성을 추가합니다:

   <var name="artifact_name" value="ktor-server-test-host"/>
   
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
    

* 테스트에서 어설션(assertion)을 수행하기 위한 유틸리티 함수 세트를 제공하는 `kotlin-test` 의존성을 추가합니다:

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  
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
    

> [네이티브 서버](server-native.md#add-dependencies)를 테스트하려면 `nativeTest` 소스 세트에 테스트 아티팩트를 추가하세요.

  

## 테스트 개요 {id="overview"}

테스트 엔진을 사용하려면 다음 단계를 따르세요:
1. JUnit 테스트 클래스와 테스트 함수를 생성합니다.
2. [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 함수를 사용하여 로컬에서 실행되는 구성된 테스트 애플리케이션 인스턴스를 설정합니다.
3. 테스트 애플리케이션 내에서 [Ktor HTTP 클라이언트](client-create-and-configure.md) 인스턴스를 사용하여 서버에 요청을 보내고, 응답을 받으며, 어설션을 수행합니다.

아래 코드는 `/` 경로로 전송된 GET 요청을 수락하고 일반 텍스트 응답으로 응답하는 가장 간단한 Ktor 애플리케이션을 테스트하는 방법을 보여줍니다.

<tabs>
<tab title="Test">

[object Promise]

</tab>

<tab title="Application">

[object Promise]

</tab>
</tabs>

실행 가능한 코드 예제는 다음에서 확인할 수 있습니다: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main).

## 애플리케이션 테스트 {id="test-app"}

### 1단계: 테스트 애플리케이션 구성 {id="configure-test-app"}

테스트 애플리케이션 구성에는 다음 단계가 포함될 수 있습니다:
- [애플리케이션 모듈 추가](#add-modules)
- [(선택 사항) 라우트 추가](#add-routing)
- [(선택 사항) 환경 사용자 정의](#environment)
- [(선택 사항) 외부 서비스 모의(Mocking)](#external-services)

> 기본적으로 구성된 테스트 애플리케이션은 [첫 번째 클라이언트 호출](#make-request) 시 시작됩니다.
> 선택적으로 `startApplication` 함수를 호출하여 애플리케이션을 수동으로 시작할 수 있습니다.
> 이는 애플리케이션의 [수명 주기 이벤트](server-events.md#predefined-events)를 테스트해야 하는 경우 유용할 수 있습니다.

#### 애플리케이션 모듈 추가 {id="add-modules"}

애플리케이션을 테스트하려면 [모듈](server-modules.md)이 `testApplication`에 로드되어야 합니다. 이를 위해 [명시적으로 모듈을 로드](#explicit-module-loading)하거나, 구성 파일에서 로드하도록 [환경을 구성](#configure-env)해야 합니다.

##### 모듈 명시적 로드 {id="explicit-module-loading"}

테스트 애플리케이션에 모듈을 수동으로 추가하려면 `application` 함수를 사용합니다:

[object Promise]

#### 구성 파일에서 모듈 로드 {id="configure-env"}

구성 파일에서 모듈을 로드하려면 `environment` 함수를 사용하여 테스트용 구성 파일을 지정합니다:

[object Promise]

이 방법은 테스트 중에 다른 환경을 모방하거나 사용자 정의 구성 설정을 사용해야 할 때 유용합니다.

> `application` 블록 내에서 `Application` 인스턴스에 접근할 수도 있습니다.

#### 라우트 추가 {id="add-routing"}

`routing` 함수를 사용하여 테스트 애플리케이션에 라우트를 추가할 수 있습니다.
이는 다음 사용 사례에 유용할 수 있습니다:
- 테스트 애플리케이션에 [모듈을 추가](#add-modules)하는 대신, 테스트해야 할 [특정 라우트](server-routing.md#route_extension_function)를 추가할 수 있습니다. 
- 테스트 애플리케이션에서만 필요한 라우트를 추가할 수 있습니다. 아래 예시는 테스트에서 사용자 [세션](server-sessions.md)을 초기화하는 데 사용되는 `/login-test` 엔드포인트를 추가하는 방법을 보여줍니다:
   [object Promise]
   
   전체 예제는 다음에서 테스트와 함께 확인할 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

#### 환경 사용자 정의 {id="environment"}

테스트 애플리케이션을 위한 사용자 정의 환경을 구축하려면 `environment` 함수를 사용합니다.
예를 들어, 테스트를 위한 사용자 정의 구성을 사용하려면 `test/resources` 폴더에 구성 파일을 생성하고 `config` 속성을 사용하여 로드할 수 있습니다:

[object Promise]

구성 속성을 지정하는 또 다른 방법은 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)를 사용하는 것입니다. 이는 애플리케이션이 시작되기 전에 애플리케이션 구성에 접근하려는 경우 유용할 수 있습니다. 아래 예시는 `config` 속성을 사용하여 `MapApplicationConfig`를 `testApplication` 함수에 전달하는 방법을 보여줍니다:

[object Promise]

#### 외부 서비스 모의(Mocking) {id="external-services"}

Ktor는 `externalServices` 함수를 사용하여 외부 서비스를 모의(mock)할 수 있도록 합니다.
이 함수 안에서 두 가지 매개변수를 받는 `hosts` 함수를 호출해야 합니다:
- `hosts` 매개변수는 외부 서비스의 URL을 받습니다.
- `block` 매개변수는 외부 서비스의 모의(mock) 역할을 하는 `Application`을 구성할 수 있도록 합니다. 이 `Application`에 대해 라우팅을 구성하고 플러그인을 설치할 수 있습니다.

아래 샘플은 `externalServices`를 사용하여 Google API에서 반환되는 JSON 응답을 시뮬레이션하는 방법을 보여줍니다:

[object Promise]

전체 예제는 다음에서 테스트와 함께 확인할 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

### 2단계: (선택 사항) 클라이언트 구성 {id="configure-client"}

`testApplication`은 `client` 속성을 사용하여 기본 구성의 HTTP 클라이언트에 접근할 수 있도록 합니다. 
클라이언트를 사용자 정의하고 추가 플러그인을 설치해야 하는 경우 `createClient` 함수를 사용할 수 있습니다. 예를 들어, 테스트 POST/PUT 요청에서 [JSON 데이터를 전송](#json-data)하려면 [ContentNegotiation](client-serialization.md) 플러그인을 설치할 수 있습니다:
[object Promise]

### 3단계: 요청 보내기 {id="make-request"}

애플리케이션을 테스트하려면 [구성된 클라이언트](#configure-client)를 사용하여 [요청](client-requests.md)을 보내고 [응답](client-responses.md)을 받습니다. [아래 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다:

[object Promise]

### 4단계: 결과 어설션 {id="assert"}

[응답](#make-request)을 받은 후, [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리에서 제공하는 어설션(assertion)을 통해 결과를 확인할 수 있습니다:

[object Promise]

## POST/PUT 요청 테스트 {id="test-post-put"}

### 폼 데이터 전송 {id="form-data"}

테스트 POST/PUT 요청에서 폼 데이터를 전송하려면 `Content-Type` 헤더를 설정하고 요청 본문(body)을 지정해야 합니다. 이를 위해 각각 [header](client-requests.md#headers) 및 [setBody](client-requests.md#body) 함수를 사용할 수 있습니다. 아래 예제는 `x-www-form-urlencoded` 및 `multipart/form-data` 타입 모두를 사용하여 폼 데이터를 전송하는 방법을 보여줍니다.

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 예제의 아래 테스트는 `x-www-form-urlencoded` 콘텐츠 타입을 사용하여 폼 파라미터를 전송하는 테스트 요청을 만드는 방법을 보여줍니다. [formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 함수는 키/값 쌍 목록에서 폼 파라미터를 인코딩하는 데 사용됩니다.

<tabs>
<tab title="Test">

[object Promise]

</tab>

<tab title="Application">

[object Promise]

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

아래 코드는 `multipart/form-data`를 구축하고 파일 업로드를 테스트하는 방법을 보여줍니다. 전체 예제는 다음에서 확인할 수 있습니다: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file).

<tabs>
<tab title="Test">

[object Promise]

</tab>

<tab title="Application">

[object Promise]

</tab>
</tabs>

### JSON 데이터 전송 {id="json-data"}

테스트 POST/PUT 요청에서 JSON 데이터를 전송하려면 새 클라이언트를 생성하고 특정 형식으로 콘텐츠를 직렬화/역직렬화할 수 있는 [ContentNegotiation](client-serialization.md) 플러그인을 설치해야 합니다. 요청 내에서 `contentType` 함수를 사용하여 `Content-Type` 헤더를 지정하고 [setBody](client-requests.md#body)를 사용하여 요청 본문(body)을 지정할 수 있습니다. [아래 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다.

<tabs>
<tab title="Test">

[object Promise]

</tab>

<tab title="Application">

[object Promise]

</tab>
</tabs>

## 테스트 중 쿠키 유지 {id="preserving-cookies"}

테스트 시 요청 간에 쿠키를 유지해야 하는 경우, 새 클라이언트를 생성하고 [HttpCookies](client-cookies.md) 플러그인을 설치해야 합니다. [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 예제의 아래 테스트에서, 쿠키가 유지되므로 각 요청 후 새로 고침 횟수가 증가합니다.

<tabs>
<tab title="Test">

[object Promise]

</tab>

<tab title="Application">

[object Promise]

</tab>
</tabs>

## HTTPS 테스트 {id="https"}

[HTTPS 엔드포인트](server-ssl.md)를 테스트해야 하는 경우, [URLBuilder.protocol](client-requests.md#url) 속성을 사용하여 요청을 만드는 데 사용되는 프로토콜을 변경합니다:

[object Promise]

전체 예제는 다음에서 확인할 수 있습니다: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main).

## WebSocket 테스트 {id="testing-ws"}

클라이언트가 제공하는 [WebSockets](client-websockets.topic) 플러그인을 사용하여 [WebSocket 대화](server-websockets.md)를 테스트할 수 있습니다:

[object Promise]

## HttpClient를 사용한 종단 간(End-to-end) 테스트 {id="end-to-end"}
테스트 엔진 외에도 [Ktor HTTP 클라이언트](client-create-and-configure.md)를 사용하여 서버 애플리케이션의 종단 간(end-to-end) 테스트를 수행할 수 있습니다.
아래 예제에서 HTTP 클라이언트는 `TestServer`에 테스트 요청을 보냅니다:

[object Promise]

완전한 예제는 다음 샘플을 참조하세요:
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): 테스트할 샘플 서버.
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): 테스트 서버 설정을 위한 헬퍼 클래스 및 함수를 포함합니다.