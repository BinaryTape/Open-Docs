---
title: Compose 애플리케이션에서 격리된 컨텍스트(Isolated Context)
---

Compose 애플리케이션에서는 [격리된 컨텍스트(isolated context)](/docs/reference/koin-core/context-isolation.md)를 사용하여 SDK나 화이트 라벨(white label) 애플리케이션을 동일한 방식으로 처리할 수 있으며, 이를 통해 Koin 정의가 최종 사용자의 정의와 섞이지 않도록 할 수 있습니다.

## 격리된 컨텍스트 정의하기

먼저, 격리된 Koin 인스턴스를 메모리에 저장하기 위해 격리된 컨텍스트 홀더(isolated context holder)를 선언해 보겠습니다. 이는 다음과 같이 간단한 `object` 클래스로 작성할 수 있습니다. `MyIsolatedKoinContext` 클래스가 Koin 인스턴스를 유지합니다:

```kotlin
object MyIsolatedKoinContext {

    val koinApp = koinApplication {
        // declare used modules
        modules(sdkAppModule)
    }
}
```

:::note
초기화 요구 사항에 맞춰 `MyIsolatedKoinContext` 클래스를 조정하세요.
:::

## Compose에서 격리된 컨텍스트 설정하기

격리된 Koin 컨텍스트를 정의했으므로, 이제 Compose에서 이를 사용하고 모든 API를 오버라이드하도록 설정할 수 있습니다. 루트(root) 컴포저블 함수에서 `KoinIsolatedContext`를 사용하기만 하면 됩니다. 이렇게 하면 Koin 컨텍스트가 모든 자식 컴포저블로 전파됩니다.

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
`KoinIsolatedContext`를 사용한 이후부터 모든 Koin Compose API는 격리된 Koin 컨텍스트를 사용하게 됩니다.
:::