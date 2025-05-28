[//]: # (title: Ktor 클라이언트에서 기본 인증)

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-basic"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

기본(Basic) [인증 스키마](client-auth.md)는 사용자를 로그인하는 데 사용될 수 있습니다. 이 스키마에서는 사용자 자격 증명이 Base64로 인코딩된 사용자 이름/비밀번호 쌍으로 전송됩니다.

> 서버 측에서 Ktor는 기본 인증을 처리하기 위한 [인증](server-basic-auth.md) 플러그인을 제공합니다.

## 기본 인증 흐름 {id="flow"}

기본 인증 흐름은 다음과 같습니다:

1.  클라이언트가 `Authorization` 헤더 없이 서버 애플리케이션의 특정 리소스에 요청을 보냅니다.
2.  서버는 클라이언트에 `401` (Unauthorized) 응답 상태로 응답하고, `WWW-Authenticate` 응답 헤더를 사용하여 기본 인증 스키마가 경로를 보호하는 데 사용됨을 알립니다. 일반적인 `WWW-Authenticate` 헤더는 다음과 같습니다:

    ```
    WWW-Authenticate: Basic realm="Access to the '/' path", charset="UTF-8"
    ```
    {style="block"}

    Ktor 클라이언트는 `sendWithoutRequest` [함수](#configure)를 사용하여 `WWW-Authenticate` 헤더를 기다리지 않고 자격 증명을 전송할 수 있도록 합니다.

3.  일반적으로 클라이언트는 사용자가 자격 증명을 입력할 수 있는 로그인 대화 상자를 표시합니다. 그런 다음 클라이언트는 Base64로 인코딩된 사용자 이름과 비밀번호 쌍을 포함하는 `Authorization` 헤더와 함께 요청을 보냅니다. 예를 들어:

    ```
    Authorization: Basic amV0YnJhaW5zOmZvb2Jhcg
    ```
    {style="block"}

4.  서버는 클라이언트가 보낸 자격 증명을 검증하고 요청된 콘텐츠로 응답합니다.

## 기본 인증 구성 {id="configure"}

`Basic` 스키마를 사용하여 `Authorization` 헤더에 사용자 자격 증명을 보내려면 `basic` 인증 프로바이더를 다음과 같이 구성해야 합니다:

1.  `install` 블록 내에서 [basic](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/basic.html) 함수를 호출합니다.
2.  [BasicAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-credentials/index.html)를 사용하여 필요한 자격 증명을 제공하고, 이 객체를 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-basic-auth-config/credentials.html) 함수에 전달합니다.
3.  `realm` 프로퍼티를 사용하여 realm을 구성합니다.

    ```kotlin
    ```
    {src="snippets/client-auth-basic/src/main/kotlin/com/example/Application.kt" include-lines="17-26"}

4.  선택적으로 `WWW-Authenticate` 헤더를 포함하는 `401` (Unauthorized) 응답을 기다리지 않고 초기 요청에서 자격 증명 전송을 활성화합니다. 불리언(boolean)을 반환하는 `sendWithoutRequest` 함수를 호출하고 요청 매개변수를 확인해야 합니다.

    ```kotlin
    install(Auth) {
        basic {
            // ...
            sendWithoutRequest { request ->
                request.url.host == "0.0.0.0"
            }
        }
    }
    ```

> 전체 예제는 여기에서 찾을 수 있습니다: [client-auth-basic](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-basic).