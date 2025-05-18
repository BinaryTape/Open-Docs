---
title: "Compose 애플리케이션을 사용한 격리된 컨텍스트"
---
Compose 애플리케이션을 사용하면 SDK 또는 화이트 라벨(white label) 애플리케이션을 처리하기 위해 [격리된 컨텍스트](/reference/koin-core/context-isolation.md)와 동일한 방식으로 작업하여 Koin 정의를 최종 사용자 정의와 혼합하지 않도록 할 수 있습니다.

## 격리된 컨텍스트 정의

먼저 격리된 Koin 인스턴스를 메모리에 저장하기 위해 격리된 컨텍스트 홀더를 선언합니다. 이는 다음과 같은 간단한 Object 클래스로 수행할 수 있습니다. `MyIsolatedKoinContext` 클래스는 Koin 인스턴스를 보유합니다.

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // 사용할 모듈 선언
        modules(sdkAppModule)
    }
}
```

:::note
`MyIsolatedKoinContext` 클래스를 초기화 필요에 따라 조정하십시오.
:::

## Compose를 사용하여 격리된 컨텍스트 설정

이제 격리된 Koin 컨텍스트를 정의했으므로 Compose에서 이를 설정하여 사용하고 모든 API를 오버라이드(override)할 수 있습니다. 루트 Compose 함수에서 `KoinIsolatedContext`를 사용하십시오. 이렇게 하면 Koin 컨텍스트가 모든 하위 컴포저블(composable)로 전파됩니다.

```kotlin
@Composable
fun App() {
    // 현재 Koin 인스턴스를 Compose 컨텍스트로 설정
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
모든 Koin Compose API는 `KoinIsolatedContext`를 사용한 후 Koi 격리된 컨텍스트를 사용합니다.
:::