---
title: Ktor & Koin 격리된 컨텍스트
---

`koin-ktor` 모듈은 Ktor에 의존성 주입(dependency injection) 기능을 제공하기 위해 설계되었습니다.

## 격리된 Koin 컨텍스트 플러그인

Ktor에서 격리된 Koin 컨테이너를 시작하려면 다음과 같이 `KoinIsolated` 플러그인을 설치하면 됩니다:

```kotlin
fun Application.main() {
    // Koin 플러그인 설치
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
격리된 Koin 컨텍스트를 사용하면 Ktor 서버 인스턴스 외부(예: `GlobalContext`를 사용하는 경우 등)에서는 Koin을 사용할 수 없습니다.
:::