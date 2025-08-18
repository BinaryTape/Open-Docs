[//]: # (title: 쿠키)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-cookies"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCookies 플러그인은 쿠키를 자동으로 처리하며, 호출 간에 저장소에 보관합니다.
</link-summary>

Ktor 클라이언트는 다음과 같은 방법으로 쿠키를 수동으로 처리할 수 있도록 합니다:
* `cookie` 함수를 사용하여 [특정 요청](client-requests.md#cookies)에 쿠키를 추가할 수 있습니다.
* `setCookie` 함수를 사용하면 [응답](client-responses.md#headers)으로 받은 `Set-Cookie` 헤더 값을 파싱할 수 있습니다.

[HttpCookies](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-http-cookies/index.html) 플러그인은 쿠키를 자동으로 처리하며, 호출 간에 저장소에 보관합니다.
기본적으로 인메모리 저장소를 사용하지만, [CookiesStorage](#custom_storage)를 사용하여 영구 저장소를 구현할 수도 있습니다.

## 의존성 추가 {id="add_dependencies"}
`HttpCookies`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며, 특정 의존성은 필요하지 않습니다.

## HttpCookies 설치 및 구성 {id="install_plugin"}

`HttpCookies`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내의 `install` 함수에 전달하세요:
```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies)
}
```

이것으로 Ktor 클라이언트가 요청 간에 쿠키를 유지할 수 있도록 하는 데 충분합니다. 전체 예시는 여기에서 찾을 수 있습니다: [client-cookies](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-cookies).

`HttpCookies` 플러그인은 `ConstantCookiesStorage`를 사용하여 각 요청에 특정 쿠키 세트를 추가할 수도 있습니다. 이는 서버 응답을 검증하는 테스트 케이스에서 유용할 수 있습니다. 아래 예시는 특정 도메인에 대한 모든 요청에 지정된 쿠키를 추가하는 방법을 보여줍니다:

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = ConstantCookiesStorage(Cookie(name = "user_name", value = "jetbrains", domain = "0.0.0.0"))
    }
}
```

## 쿠키 가져오기 {id="get_cookies"}

클라이언트는 지정된 URL에 대한 모든 쿠키를 얻기 위해 `cookies` 함수를 제공합니다:

```kotlin
client.cookies("http://0.0.0.0:8080/")
```

## 사용자 지정 쿠키 저장소 {id="custom_storage"}

필요한 경우, [CookiesStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cookies/-cookies-storage/index.html) 인터페이스를 구현하여 사용자 지정 쿠키 저장소를 생성할 수 있습니다:

```kotlin
val client = HttpClient(CIO) {
    install(HttpCookies) {
        storage = CustomCookiesStorage()
    }
}

public class CustomCookiesStorage : CookiesStorage {
    // ...
}
```

[AcceptAllCookiesStorage](https://github.com/ktorio/ktor/blob/main/ktor-client/ktor-client-core/common/src/io/ktor/client/plugins/cookies/AcceptAllCookiesStorage.kt)를 참고 자료로 사용할 수 있습니다.