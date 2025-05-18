---
title: "Ktor & Koin 격리된 컨텍스트 (Isolated Context)"
---
`koin-ktor` 모듈은 Ktor에 대한 의존성 주입을 제공하기 위해 만들어졌습니다.

## Isolated Koin Context 플러그인

Ktor에서 독립된 Koin 컨테이너를 시작하려면 다음과 같이 `KoinIsolated` 플러그인을 설치하십시오.

```kotlin
fun Application.main() {
    // Install Koin plugin
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
 독립된 Koin 컨텍스트를 사용하면 Ktor 서버 인스턴스 외부에서 Koin을 사용할 수 없습니다 (예: `GlobalContext` 사용).
:::