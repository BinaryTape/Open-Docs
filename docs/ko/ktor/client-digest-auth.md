[//]: # (title: Ktor 클라이언트의 다이제스트 인증)

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-client-auth</code>
</p>
<var name="example_name" value="client-auth-digest"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

다이제스트 인증 방식(Digest authentication scheme)에서, 사용자 이름과 비밀번호는 네트워크를 통해 전송되기 전에 해시 함수가 적용됩니다.

> 서버 측에서는 Ktor가 다이제스트 인증 처리를 위한 [Authentication](server-digest-auth.md) 플러그인을 제공합니다.

## 다이제스트 인증 흐름 {id="flow"}

다이제스트 인증 흐름은 다음과 같습니다:

1.  클라이언트는 서버 애플리케이션 내의 특정 리소스에 `Authorization` 헤더 없이 요청을 보냅니다.
2.  서버는 클라이언트에 `401` (권한 없음) 응답 상태로 응답하며, `WWW-Authenticate` 응답 헤더를 사용하여 다이제스트 인증 방식이 라우트를 보호하는 데 사용된다는 정보를 제공합니다. 일반적인 `WWW-Authenticate` 헤더는 다음과 같습니다:

    ```
    WWW-Authenticate: Digest
            realm="Access to the '/' path",
            nonce="e4549c0548886bc2",
            algorithm="MD5"
    ```
    {style="block"}

3.  일반적으로 클라이언트는 사용자가 자격 증명을 입력할 수 있는 로그인 대화 상자를 표시합니다. 그런 다음, 클라이언트는 다음 `Authorization` 헤더와 함께 요청을 보냅니다:

    ```
    Authorization: Digest username="jetbrains",
            realm="Access to the '/' path",
            nonce="e4549c0548886bc2",
            uri="/",
            algorithm=MD5,
            response="6299988bb4f05c0d8ad44295873858cf"
    ```
    {style="block"}

    `response` 값은 다음 방식으로 생성됩니다:

    a. `HA1 = MD5(username:realm:password)`

    b. `HA2 = MD5(method:digestURI)`

    c. `response = MD5(HA1:nonce:HA2)`

4.  서버는 클라이언트가 보낸 자격 증명을 검증하고 요청된 콘텐츠로 응답합니다.

## 다이제스트 인증 구성 {id="configure"}

`Digest` 방식을 사용하여 `Authorization` 헤더에 사용자 자격 증명을 보내려면, `digest` 인증 제공자(provider)를 다음과 같이 구성해야 합니다:

1.  `install` 블록 내에서 [digest](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/digest.html) 함수를 호출합니다.
2.  [DigestAuthCredentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-credentials/index.html)를 사용하여 필요한 자격 증명을 제공하고, 이 객체를 [credentials](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-auth/io.ktor.client.plugins.auth.providers/-digest-auth-config/credentials.html) 함수에 전달합니다.
3.  선택적으로, `realm` 속성을 사용하여 realm을 구성합니다.

```kotlin
val client = HttpClient(CIO) {
    install(Auth) {
        digest {
            credentials {
                DigestAuthCredentials(username = "jetbrains", password = "foobar")
            }
            realm = "Access to the '/' path"
        }
    }
}
```

> 전체 예시는 여기에서 찾을 수 있습니다: [client-auth-digest](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-auth-digest).