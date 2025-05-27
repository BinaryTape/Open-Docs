---
title: Compose 애플리케이션에서 격리된 컨텍스트
---

Compose 애플리케이션을 사용하면 Koin 정의가 최종 사용자의 정의와 섞이지 않도록 SDK 또는 화이트 라벨 애플리케이션을 처리하는 [격리된 컨텍스트](/docs/reference/koin-core/context-isolation.md)와 동일한 방식으로 작업할 수 있습니다.

## 격리된 컨텍스트 정의

먼저 격리된 Koin 인스턴스를 메모리에 저장하기 위해 격리된 컨텍스트 홀더를 선언합니다. 이는 다음과 같은 간단한 Object 클래스로 수행할 수 있습니다. `MyIsolatedKoinContext` 클래스는 Koin 인스턴스를 보관합니다.

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
`MyIsolatedKoinContext` 클래스를 초기화 요구 사항에 따라 조정하세요.
:::

## Compose와 함께 격리된 컨텍스트 설정

이제 격리된 Koin 컨텍스트를 정의했으므로, Compose에서 이를 사용하여 모든 API를 재정의하도록 설정할 수 있습니다. 루트 Compose 함수에서 `KoinIsolatedContext`를 사용하기만 하면 됩니다. 이는 모든 하위 컴포저블에 Koin 컨텍스트를 전파할 것입니다.

```kotlin
@Composable
fun App() {
    // Set current Koin instance to Compose context
    KoinIsolatedContext(context = MyIsolatedKoinContext.koinApp) {

        MyScreen()
    }
}
```

:::info
`KoinIsolatedContext`를 사용한 후에는 모든 Koin Compose API가 격리된 Koin 컨텍스트를 사용하게 됩니다.
:::