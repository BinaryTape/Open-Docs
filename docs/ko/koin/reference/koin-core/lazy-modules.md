---
title: 지연 모듈 및 백그라운드 로딩
---

이 섹션에서는 지연 로딩 방식을 사용하여 모듈을 구성하는 방법을 살펴봅니다.

## 지연 모듈 정의 [실험적]

이제 지연 Koin 모듈을 선언하여 리소스의 사전 할당을 방지하고 Koin 시작 시 백그라운드에서 로드할 수 있습니다.

- `lazyModule` - Koin 모듈의 지연(Lazy) Kotlin 버전 선언
- `Module.includes` - 지연 모듈 포함 허용

좋은 예시를 보면 항상 더 잘 이해할 수 있습니다.

```kotlin
// 일부 지연 모듈
val m2 = lazyModule {
    singleOf(::ClassB)
}

// m2 지연 모듈 포함
val m1 = lazyModule {
    includes(m2)
    singleOf(::ClassA) { bind<IClassA>() }
}
```

:::info
    LazyModule은 다음 API에 의해 로드될 때까지 어떤 리소스도 트리거하지 않습니다.
:::

## Kotlin 코루틴을 이용한 백그라운드 로딩 [실험적]

지연 모듈을 선언한 후에는 Koin 구성에서 해당 모듈을 백그라운드로 로드할 수 있으며, 그 외에도 더 많은 작업을 수행할 수 있습니다.

- `KoinApplication.lazyModules` - 플랫폼 기본 Dispatcher를 사용하여 코루틴으로 백그라운드에서 지연 모듈 로드
- `Koin.waitAllStartJobs` - 시작 작업이 완료될 때까지 대기
- `Koin.runOnKoinStarted` - 시작 완료 후 코드 블록 실행

좋은 예시를 보면 항상 더 잘 이해할 수 있습니다.

```kotlin
startKoin {
    // 백그라운드에서 지연 모듈 로드
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// 로딩 작업이 완료될 때까지 대기
koin.waitAllStartJobs()

// 또는 로딩 완료 후 코드 실행
koin.runOnKoinStarted { koin ->
    // 백그라운드 로드 완료 후 실행
}
```

:::note
    `lazyModules` 함수를 사용하면 디스패처를 지정할 수 있습니다: `lazyModules(modules, dispatcher = Dispatcher.IO)`
:::

:::info
    코루틴 엔진의 기본 디스패처는 `Dispatchers.Default`입니다.
:::

### 제한 사항 - 모듈/지연 모듈 혼합

현재로서는 시작 시 일반 모듈과 지연 모듈을 혼합하는 것을 피하는 것이 좋습니다. `mainModule`이 `lazyReporter`에 대한 의존성을 가지도록 하지 마십시오.

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
현재 Koin은 모듈이 지연 모듈에 의존하는지 확인하지 않습니다.
:::