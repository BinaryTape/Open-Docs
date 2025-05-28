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

Ktor는 웹 서버를 생성하지 않고, 소켓에 바인딩하지 않으며, 실제 HTTP 요청을 만들지 않는 특별한 테스트 엔진을 제공합니다. 대신, 내부 메커니즘에 직접 연결하여 애플리케이션 호출을 바로 처리합니다. 이는 테스트를 위해 완전한 웹 서버를 실행하는 것에 비해 더 빠른 테스트 실행을 가능하게 합니다. 

## 의존성 추가 {id="add-dependencies"}
Ktor 서버 애플리케이션을 테스트하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다.
* `ktor-server-test-host` 의존성을 추가합니다:

   <var name="artifact_name" value="ktor-server-test-host"/>
   <include from="lib.topic" element-id="add_ktor_artifact_testing"/>

* 테스트에서 어설션(assertion)을 수행하기 위한 유틸리티 함수(utility function)를 제공하는 `kotlin-test` 의존성을 추가합니다:

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  <include from="lib.topic" element-id="add_artifact_testing"/>

> [네이티브 서버](server-native.md#add-dependencies)를 테스트하려면 `nativeTest` 소스 세트에 테스트 아티팩트를 추가하세요.

  

## 테스트 개요 {id="overview"}

테스트 엔진을 사용하려면 아래 단계를 따르세요:
1. JUnit 테스트 클래스와 테스트 함수를 생성합니다.
2. [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 함수를 사용하여 로컬에서 실행되는 테스트 애플리케이션의 구성된 인스턴스를 설정합니다.
3. 테스트 애플리케이션 내에서 [Ktor HTTP 클라이언트](client-create-and-configure.md) 인스턴스를 사용하여 서버에 요청을 보내고, 응답을 받으며, 어설션을 수행합니다.

아래 코드는 `/` 경로로 전송된 GET 요청을 수락하고 일반 텍스트 응답으로 회신하는 가장 간단한 Ktor 애플리케이션을 테스트하는 방법을 보여줍니다.

<tabs>
<tab title="테스트">

```kotlin
```
{src="snippets/engine-main/src/test/kotlin/EngineMainTest.kt"}

</tab>

<tab title="애플리케이션">

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

실행 가능한 코드 예시는 여기에서 확인할 수 있습니다: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main).

## 애플리케이션 테스트 {id="test-app"}

### 1단계: 테스트 애플리케이션 구성 {id="configure-test-app"}

테스트 애플리케이션 구성에는 다음 단계가 포함될 수 있습니다:
- [애플리케이션 모듈 추가](#add-modules)
- [(선택 사항) 라우트 추가](#add-routing)
- [(선택 사항) 환경 사용자 지정](#environment)
- [(선택 사항) 외부 서비스 모의(Mocking)](#external-services)

> 기본적으로 구성된 테스트 애플리케이션은 [첫 번째 클라이언트 호출](#make-request) 시 시작됩니다.
> 선택적으로, `startApplication` 함수를 호출하여 애플리케이션을 수동으로 시작할 수 있습니다.
> 이는 애플리케이션의 [수명 주기 이벤트](server-events.md#predefined-events)를 테스트해야 할 때 유용할 수 있습니다.

#### 애플리케이션 모듈 추가 {id="add-modules"}

애플리케이션을 테스트하려면 해당 [모듈](server-modules.md)이 `testApplication`에 로드되어야 합니다. 이를 위해서는 [명시적으로 모듈을 로드](#explicit-module-loading)하거나, 구성 파일에서 로드하도록 [환경을 구성](#configure-env)해야 합니다.

##### 모듈 명시적 로드 {id="explicit-module-loading"}

테스트 애플리케이션에 모듈을 수동으로 추가하려면 `application` 함수를 사용하세요:

```kotlin
```
{src="snippets/embedded-server-modules/src/test/kotlin/EmbeddedServerTest.kt" include-symbol="testModule1"}

#### 구성 파일에서 모듈 로드 {id="configure-env"}

구성 파일에서 모듈을 로드하려면 `environment` 함수를 사용하여 테스트를 위한 구성 파일을 지정하세요:

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

이 방법은 다양한 환경을 모방하거나 테스트 중에 사용자 지정 구성 설정을 사용해야 할 때 유용합니다.

> `application` 블록 내부에서 `Application` 인스턴스에 접근할 수도 있습니다.

#### 라우트 추가 {id="add-routing"}

`routing` 함수를 사용하여 테스트 애플리케이션에 라우트를 추가할 수 있습니다.
이는 다음 사용 사례에 유용할 수 있습니다:
- 테스트 애플리케이션에 [모듈을 추가](#add-modules)하는 대신, 테스트해야 할 [특정 라우트](server-routing.md#route_extension_function)를 추가할 수 있습니다. 
- 테스트 애플리케이션에서만 필요한 라우트를 추가할 수 있습니다. 아래 예시는 테스트에서 사용자 [세션](server-sessions.md)을 초기화하는 데 사용되는 `/login-test` 엔드포인트를 추가하는 방법을 보여줍니다:
   ```kotlin
   ```
   {src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,31-35,51"}
   
   테스트가 포함된 전체 예시는 여기에서 찾을 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

#### 환경 사용자 지정 {id="environment"}

테스트 애플리케이션을 위한 사용자 지정 환경을 구축하려면 `environment` 함수를 사용하세요.
예를 들어, 테스트를 위해 사용자 지정 구성을 사용하려면 `test/resources` 폴더에 구성 파일을 생성하고 `config` 속성을 사용하여 로드할 수 있습니다:

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

구성 속성을 지정하는 또 다른 방법은 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)를 사용하는 것입니다. 이는 애플리케이션이 시작되기 전에 애플리케이션 구성에 접근하려는 경우 유용할 수 있습니다. 아래 예시는 `config` 속성을 사용하여 `MapApplicationConfig`를 `testApplication` 함수에 전달하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/engine-main-custom-environment/src/test/kotlin/ApplicationTest.kt" include-lines="10-14,21"}

#### 외부 서비스 모의(Mocking) {id="external-services"}

Ktor는 `externalServices` 함수를 사용하여 외부 서비스를 모의할(mock) 수 있도록 합니다.
이 함수 내부에서 두 개의 파라미터를 받는 `hosts` 함수를 호출해야 합니다:
- `hosts` 파라미터는 외부 서비스의 URL을 받습니다.
- `block` 파라미터를 사용하면 외부 서비스의 모의(mock) 역할을 하는 `Application`을 구성할 수 있습니다. 이 `Application`에 대해 라우팅을 구성하고 플러그인을 설치할 수 있습니다.

아래 샘플은 `externalServices`를 사용하여 Google API가 반환하는 JSON 응답을 시뮬레이션하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,36-47,51"}

테스트가 포함된 전체 예시는 여기에서 찾을 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

### 2단계: (선택 사항) 클라이언트 구성 {id="configure-client"}

`testApplication`은 `client` 속성을 사용하여 기본 구성이 적용된 HTTP 클라이언트에 대한 접근을 제공합니다. 
클라이언트를 사용자 지정하고 추가 플러그인을 설치해야 하는 경우 `createClient` 함수를 사용할 수 있습니다. 예를 들어, 테스트 POST/PUT 요청에서 [JSON 데이터를 전송](#json-data)하려면 [ContentNegotiation](client-serialization.md) 플러그인을 설치할 수 있습니다:
```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-40,48"}

### 3단계: 요청하기 {id="make-request"}

애플리케이션을 테스트하려면 [구성된 클라이언트](#configure-client)를 사용하여 [요청](client-requests.md)을 보내고 [응답](client-responses.md)을 받으세요. [아래 예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-44,48"}

### 4단계: 결과 어설션 {id="assert"}

[응답](#make-request)을 받은 후, [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리에서 제공하는 어설션을 통해 결과를 확인할 수 있습니다:

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-48"}

## POST/PUT 요청 테스트 {id="test-post-put"}

### 폼(Form) 데이터 전송 {id="form-data"}

테스트 POST/PUT 요청에서 폼(Form) 데이터를 보내려면 `Content-Type` 헤더를 설정하고 요청 본문(body)을 지정해야 합니다. 이를 위해 각각 [header](client-requests.md#headers) 및 [setBody](client-requests.md#body) 함수를 사용할 수 있습니다. 아래 예시는 `x-www-form-urlencoded`와 `multipart/form-data` 타입 모두를 사용하여 폼 데이터를 전송하는 방법을 보여줍니다.

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 예시의 아래 테스트는 `x-www-form-urlencoded` 콘텐츠 타입을 사용하여 전송된 폼 파라미터로 테스트 요청을 만드는 방법을 보여줍니다. 키/값 쌍(pair) 목록에서 폼 파라미터를 인코딩하는 데 [formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 함수가 사용된다는 점에 유의하세요.

<tabs>
<tab title="테스트">

```kotlin
```
{src="snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"}

</tab>

<tab title="애플리케이션">

```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="3-16,45-46"}

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

아래 코드는 `multipart/form-data`를 구축하고 파일 업로드를 테스트하는 방법을 보여줍니다. 전체 예시는 여기에서 찾을 수 있습니다: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file).

<tabs>
<tab title="테스트">

```kotlin
```
{src="snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt"}

</tab>

<tab title="애플리케이션">

```kotlin
```
{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt"}

</tab>
</tabs>

### JSON 데이터 전송 {id="json-data"}

테스트 POST/PUT 요청에서 JSON 데이터를 보내려면 새로운 클라이언트를 생성하고 특정 형식으로 콘텐츠를 직렬화/역직렬화(serialize/deserialize)할 수 있는 [ContentNegotiation](client-serialization.md) 플러그인을 설치해야 합니다. 요청 내부에서 `contentType` 함수를 사용하여 `Content-Type` 헤더를 지정하고 [setBody](client-requests.md#body)를 사용하여 요청 본문(body)을 지정할 수 있습니다. [아래 예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다.

<tabs>
<tab title="테스트">

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="3-11,31-48"}

</tab>

<tab title="애플리케이션">

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="3-16,25-31,38-44"}

</tab>
</tabs>

## 테스트 중 쿠키 유지 {id="preserving-cookies"}

테스트 시 요청 간에 쿠키를 유지해야 하는 경우, 새로운 클라이언트를 생성하고 [HttpCookies](client-cookies.md) 플러그인을 설치해야 합니다. [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 예시의 아래 테스트에서는 쿠키가 유지되므로 각 요청 후 재로드(reload) 횟수가 증가합니다.

<tabs>
<tab title="테스트">

```kotlin
```
{src="snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt"}

</tab>

<tab title="애플리케이션">

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="3-38"}

</tab>
</tabs>

## HTTPS 테스트 {id="https"}

[HTTPS 엔드포인트](server-ssl.md)를 테스트해야 하는 경우, [URLBuilder.protocol](client-requests.md#url) 속성을 사용하여 요청을 만드는 데 사용되는 프로토콜을 변경하세요:

```kotlin
```
{src="snippets/ssl-engine-main/src/test/kotlin/ApplicationTest.kt" include-lines="3-22"}

전체 예시는 여기에서 찾을 수 있습니다: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main).

## 웹소켓(WebSocket) 테스트 {id="testing-ws"}

클라이언트에서 제공하는 [웹소켓(WebSockets)](client-websockets.topic) 플러그인을 사용하여 [웹소켓 대화(WebSocket conversations)](server-websockets.md)를 테스트할 수 있습니다:

```kotlin
```
{src="snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"}

## HttpClient를 사용한 종단 간(End-to-End) 테스트 {id="end-to-end"}
테스트 엔진 외에도, [Ktor HTTP 클라이언트](client-create-and-configure.md)를 사용하여 서버 애플리케이션의 종단 간 테스트를 수행할 수 있습니다.
아래 예시에서 HTTP 클라이언트는 `TestServer`로 테스트 요청을 보냅니다:

```kotlin
```
{src="snippets/embedded-server/src/test/kotlin/EmbeddedServerTest.kt"}

전체 예시는 다음 샘플을 참조하세요:
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): 테스트할 샘플 서버.
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): 테스트 서버 설정을 위한 헬퍼 클래스와 함수를 포함합니다.