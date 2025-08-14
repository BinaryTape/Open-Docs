[//]: # (title: 세션)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Sessions"/>
<var name="package_name" value="io.ktor.server.sessions"/>
<var name="artifact_name" value="ktor-server-sessions"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p><b>코드 예제</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client">session-cookie-client</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server">session-cookie-server</a>,
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server">session-header-server</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있도록 합니다.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
Sessions 플러그인은 다른 HTTP 요청 간에 데이터를 지속시키는 메커니즘을 제공합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-sessions.html) 플러그인은 다른 HTTP 요청 간에 데이터를 지속시키는 메커니즘을 제공합니다. 일반적인 사용 사례로는 로그인한 사용자 ID, 장바구니 내용 저장 또는 클라이언트의 사용자 기본 설정 유지가 포함됩니다. Ktor에서는 쿠키나 커스텀 헤더를 사용하여 세션을 구현하고, 세션 데이터를 서버에 저장할지 클라이언트에 전달할지 선택하며, 세션 데이터를 서명하고 암호화하는 등의 작업을 수행할 수 있습니다.

이 토픽에서는 `%plugin_name%` 플러그인을 설치하고, 구성하며, [라우트 핸들러](server-routing.md#define_route) 내부에서 세션 데이터에 액세스하는 방법을 살펴보겠습니다.

## 의존성 추가 {id="add_dependencies"}
세션 지원을 활성화하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다.

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
    

## 세션 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
        지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>에서 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부.
        </li>
        <li>
            ... 명시적으로 정의된 <code>module</code> 내부, 이는 <code>Application</code> 클래스의 확장 함수입니다.
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
        <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 라우트에도 설치</a>할 수 있습니다.
        이는 다른 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
    </p>
    

## 세션 구성 개요 {id="configuration_overview"}
`%plugin_name%` 플러그인을 구성하려면 다음 단계를 수행해야 합니다.
1. *[데이터 클래스 생성](#data_class)*: 세션을 구성하기 전에 세션 데이터를 저장하기 위한 [데이터 클래스](https://kotlinlang.org/docs/data-classes.html)를 생성해야 합니다.
2. *[서버와 클라이언트 간 데이터 전달 방식 선택](#cookie_header)*: 쿠키 또는 커스텀 헤더를 사용합니다. 쿠키는 일반 HTML 애플리케이션에 더 적합하며, 커스텀 헤더는 API용으로 의도되었습니다.
3. *[세션 페이로드 저장 위치 선택](#client_server)*: 클라이언트 또는 서버에 저장합니다. 직렬화된 세션 데이터를 쿠키/헤더 값을 사용하여 클라이언트에 전달하거나, 페이로드를 서버에 저장하고 세션 식별자만 전달할 수 있습니다.

   세션 페이로드를 서버에 저장하려면 *[저장 방식 선택](#storages)*: 서버 메모리 또는 폴더에 저장할 수 있습니다. 세션 데이터 유지를 위한 커스텀 스토리지를 구현할 수도 있습니다.
4. *[세션 데이터 보호](#protect_session)*: 클라이언트에 전달되는 민감한 세션 데이터를 보호하려면 세션 페이로드를 서명하고 암호화해야 합니다.

`%plugin_name%` 구성 후, [라우트 핸들러](server-routing.md#define_route) 내부에서 [세션 데이터를 가져오고 설정](#use_sessions)할 수 있습니다.

## 데이터 클래스 생성 {id="data_class"}

세션을 구성하기 전에 세션 데이터를 저장하기 위한 [데이터 클래스](https://kotlinlang.org/docs/data-classes.html)를 생성해야 합니다.
예를 들어, 아래 `UserSession` 클래스는 세션 ID와 페이지 뷰 수를 저장하는 데 사용됩니다.

[object Promise]

여러 세션을 사용할 경우 여러 데이터 클래스를 생성해야 합니다.

## 세션 데이터 전달: 쿠키 vs 헤더 {id="cookie_header"}

### 쿠키 {id="cookie"}
쿠키를 사용하여 세션 데이터를 전달하려면, `install(Sessions)` 블록 내에서 지정된 이름과 데이터 클래스를 사용하여 `cookie` 함수를 호출합니다.
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session")
}
```
위 예제에서 세션 데이터는 `Set-Cookie` 헤더에 추가된 `user_session` 속성을 사용하여 클라이언트에 전달됩니다. `cookie` 블록 내에서 다른 쿠키 속성을 전달하여 구성할 수 있습니다. 예를 들어, 아래 코드 스니펫은 쿠키의 경로와 만료 시간을 지정하는 방법을 보여줍니다.

[object Promise]

필요한 속성이 명시적으로 노출되지 않은 경우 `extensions` 속성을 사용합니다. 예를 들어, `SameSite` 속성은 다음과 같이 전달할 수 있습니다.
```kotlin
install(Sessions) {
    cookie<UserSession>("user_session") {
        cookie.extensions["SameSite"] = "lax"
    }
}
```
사용 가능한 구성 설정에 대해 더 자세히 알아보려면 [CookieConfiguration](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-cookie-configuration/index.html)을 참조하세요.

> 애플리케이션을 프로덕션 환경에 [배포](server-deployment.md)하기 전에, `secure` 속성이 `true`로 설정되어 있는지 확인하세요. 이는 [보안 연결](server-ssl.md)을 통해서만 쿠키를 전송할 수 있도록 하여 HTTPS 다운그레이드 공격으로부터 세션 데이터를 보호합니다.
>
{type="warning"}

### 헤더 {id="header"}
커스텀 헤더를 사용하여 세션 데이터를 전달하려면, `install(Sessions)` 블록 내에서 지정된 이름과 데이터 클래스를 사용하여 `header` 함수를 호출합니다.

```kotlin
install(Sessions) {
    header<CartSession>("cart_session")
}
```

위 예제에서 세션 데이터는 `cart_session` 커스텀 헤더를 사용하여 클라이언트에 전달됩니다.
클라이언트 측에서는 세션 데이터를 얻기 위해 이 헤더를 각 요청에 추가해야 합니다.

> 교차 출처 요청을 처리하기 위해 [CORS](server-cors.md) 플러그인을 사용하는 경우, 다음과 같이 커스텀 헤더를 `CORS` 구성에 추가하세요.
> ```kotlin
> install(CORS) {
>     allowHeader("cart_session")
>     exposeHeader("cart_session")
> }
> ```

## 세션 페이로드 저장: 클라이언트 vs 서버 {id="client_server"}

Ktor에서는 세션 데이터를 두 가지 방식으로 관리할 수 있습니다.
- _클라이언트와 서버 간에 세션 데이터 전달_.
   
  [쿠키 또는 헤더](#cookie_header) 함수에 세션 이름만 전달하면 세션 데이터가 클라이언트와 서버 간에 전달됩니다. 이 경우 클라이언트에 전달되는 민감한 세션 데이터를 보호하기 위해 세션 페이로드를 [서명하고 암호화](#protect_session)해야 합니다.
- _세션 데이터를 서버에 저장하고 클라이언트와 서버 간에 세션 ID만 전달_.
   
  이 경우 서버에 [페이로드를 저장할 위치](#storages)를 선택할 수 있습니다. 예를 들어, 세션 데이터를 메모리나 지정된 폴더에 저장할 수 있으며, 자신만의 커스텀 스토리지를 구현할 수도 있습니다.

## 서버에 세션 페이로드 저장 {id="storages"}

Ktor를 사용하면 세션 데이터를 [서버에](#client_server) 저장하고 서버와 클라이언트 간에 세션 ID만 전달할 수 있습니다. 이 경우 서버에 페이로드를 유지할 위치를 선택할 수 있습니다.

### 인메모리 스토리지 {id="in_memory_storage"}
[SessionStorageMemory](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage-memory/index.html)는 세션 콘텐츠를 메모리에 저장할 수 있도록 합니다. 이 스토리지는 서버가 실행되는 동안 데이터를 유지하고 서버가 중지되면 정보를 삭제합니다. 예를 들어, 다음과 같이 서버 메모리에 쿠키를 저장할 수 있습니다.

[object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server).

> `SessionStorageMemory`는 개발 목적으로만 사용됩니다.

### 디렉토리 스토리지 {id="directory_storage"}

[directorySessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/directory-session-storage.html)는 지정된 디렉토리 아래 파일에 세션 데이터를 저장하는 데 사용될 수 있습니다. 예를 들어, `build/.sessions` 디렉토리 아래 파일에 세션 데이터를 저장하려면 다음과 같이 `directorySessionStorage`를 생성합니다.
[object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server).

### 커스텀 스토리지 {id="custom_storage"}

Ktor는 커스텀 스토리지를 구현할 수 있는 [SessionStorage](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-sessions/io.ktor.server.sessions/-session-storage/index.html) 인터페이스를 제공합니다.
```kotlin
interface SessionStorage {
    suspend fun invalidate(id: String)
    suspend fun write(id: String, value: String)
    suspend fun read(id: String): String
}
```
세 함수는 모두 [suspend 함수](https://kotlinlang.org/docs/composing-suspending-functions.html)입니다. [SessionStorageMemory](https://github.com/ktorio/ktor/blob/main/ktor-server/ktor-server-plugins/ktor-server-sessions/common/src/io/ktor/server/sessions/SessionStorageMemory.kt)를 참조로 사용할 수 있습니다.

## 세션 데이터 보호 {id="protect_session"}

### 세션 데이터 서명 {id="sign_session"}

세션 데이터를 서명하면 세션 콘텐츠가 수정되는 것을 방지하지만 사용자가 이 콘텐츠를 볼 수 있도록 합니다.
세션을 서명하려면 `SessionTransportTransformerMessageAuthentication` 생성자에 서명 키를 전달하고 이 인스턴스를 `transform` 함수에 전달합니다.

[object Promise]

`SessionTransportTransformerMessageAuthentication`은 기본 인증 알고리즘으로 `HmacSHA256`을 사용하며, 이는 변경할 수 있습니다.

### 세션 데이터 서명 및 암호화 {id="sign_encrypt_session"}

세션 데이터를 서명하고 암호화하면 세션 콘텐츠를 읽고 수정하는 것을 방지합니다.
세션을 서명하고 암호화하려면 `SessionTransportTransformerEncrypt` 생성자에 서명/암호화 키를 전달하고 이 인스턴스를 `transform` 함수에 전달합니다.

[object Promise]

> Ktor 버전 `3.0.0`에서 [암호화 방식이 업데이트](migrating-3.md#session-encryption-method-update)되었습니다.
> 이전 버전에서 마이그레이션하는 경우, 기존 세션과의 호환성을 보장하기 위해
> `SessionTransportTransformerEncrypt`의 생성자에서 `backwardCompatibleRead` 속성을 사용하세요.
>
{style="note"}

기본적으로 `SessionTransportTransformerEncrypt`는 `AES` 및 `HmacSHA256` 알고리즘을 사용하며, 이는 변경할 수 있습니다.

> 서명/암호화 키는 코드에 명시적으로 지정되어서는 안 됩니다. [구성 파일](server-configuration-file.topic#configuration-file-overview)에서 커스텀 그룹을 사용하여 서명/암호화 키를 저장하고 [환경 변수](server-configuration-file.topic#environment-variables)를 사용하여 초기화할 수 있습니다.
>
{type="warning"}

## 세션 콘텐츠 가져오기 및 설정 {id="use_sessions"}
특정 [라우트](server-routing.md)에 대한 세션 콘텐츠를 설정하려면 `call.sessions` 속성을 사용합니다. `set` 메서드를 사용하면 새 세션 인스턴스를 생성할 수 있습니다.

[object Promise]

세션 콘텐츠를 가져오려면 등록된 세션 타입 중 하나를 타입 매개변수로 받아 `get`을 호출할 수 있습니다.

[object Promise]

세션을 수정하려면, 예를 들어 카운터를 증가시키려면 데이터 클래스의 `copy` 메서드를 호출해야 합니다.

[object Promise]

어떤 이유로든 세션을 초기화해야 할 때(예: 사용자 로그아웃 시) `clear` 함수를 호출합니다.

[object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client).

## 지연된 세션 검색

기본적으로 Ktor는 세션을 포함하는 모든 요청에 대해 스토리지에서 세션을 읽으려고 시도합니다. 라우트가 실제로 세션을 필요로 하는지 여부와 관계없이 말입니다. 이 동작은 특히 커스텀 세션 스토리지를 사용하는 애플리케이션에서 불필요한 오버헤드를 유발할 수 있습니다.

`io.ktor.server.sessions.deferred` 시스템 속성을 활성화하여 세션 로딩을 지연시킬 수 있습니다.

```kotlin
System.setProperty("io.ktor.server.sessions.deferred", "true")
```

## 예제 {id="examples"}

아래 실행 가능한 예제는 `%plugin_name%` 플러그인을 사용하는 방법을 보여줍니다.

- [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)는 [쿠키](#cookie)를 사용하여 [서명되고 암호화된](#sign_encrypt_session) 세션 페이로드를 [클라이언트](#client_server)에 전달하는 방법을 보여줍니다.
- [session-cookie-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-server)는 [서버 메모리](#in_memory_storage)에 세션 페이로드를 유지하고 [쿠키](#cookie)를 사용하여 [서명된](#sign_session) 세션 ID를 클라이언트에 전달하는 방법을 보여줍니다.
- [session-header-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-header-server)는 [디렉토리 스토리지](#directory_storage)에 서버의 세션 페이로드를 유지하고 [커스텀 헤더](#header)를 사용하여 [서명된](#sign_session) 세션 ID를 클라이언트에 전달하는 방법을 보여줍니다.