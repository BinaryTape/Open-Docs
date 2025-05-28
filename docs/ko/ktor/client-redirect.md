[//]: # (title: 리디렉션)

기본적으로 Ktor 클라이언트는 `Location` 헤더에 제공된 URL로 리디렉션합니다. 필요한 경우, 리디렉션을 비활성화할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}
`HttpRedirect`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며, 다른 특정 의존성은 필요하지 않습니다.

## 리디렉션 비활성화 {id="disable"}

리디렉션을 비활성화하려면, [클라이언트 구성 블록](client-create-and-configure.md#configure-client)에서 `followRedirects` 속성을 `false`로 설정합니다:

```kotlin
val client = HttpClient(CIO) {
    followRedirects = false
}
```