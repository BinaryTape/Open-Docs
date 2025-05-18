---
title: "지연 모듈 및 백그라운드 로딩"
---
이 섹션에서는 지연 로딩 방식으로 모듈을 구성하는 방법을 알아봅니다.

## 지연 모듈 정의 [Experimental]

이제 지연 (Lazy) Koin 모듈을 선언하여 리소스의 사전 할당을 방지하고 Koin 시작과 함께 백그라운드에서 로드할 수 있습니다.

- `lazyModule` - Koin 모듈의 Lazy Kotlin 버전을 선언합니다.
- `Module.includes` - Lazy 모듈을 포함할 수 있습니다.

이해를 돕기 위해 좋은 예제를 제공합니다.

```kotlin
// 몇 가지 지연 모듈
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
    LazyModule은 다음 API에 의해 로드될 때까지 리소스를 트리거하지 않습니다.
:::

## Kotlin 코루틴을 사용한 백그라운드 로딩 [Experimental]

일부 Lazy 모듈을 선언한 후 Koin 구성에서 백그라운드로 로드할 수 있습니다.

- `KoinApplication.lazyModules` - 플랫폼 기본 디스패처를 사용하여 코루틴으로 백그라운드에서 Lazy 모듈을 로드합니다.
- `Koin.waitAllStartJobs` - 시작 작업이 완료될 때까지 기다립니다.
- `Koin.runOnKoinStarted` - 시작 완료 후 블록 코드를 실행합니다.

이해를 돕기 위해 좋은 예제를 제공합니다.

```kotlin
startKoin {
    // 백그라운드에서 Lazy 모듈 로드
    lazyModules(m1)
}

val koin = KoinPlatform.getKoin()

// 로딩 작업이 완료될 때까지 기다립니다.
koin.waitAllStartJobs()

// 또는 로딩이 완료된 후 코드 실행
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

### 제한 사항 - 모듈/Lazy 모듈 혼합

현재 시작 시 모듈과 Lazy 모듈을 혼합하지 않는 것이 좋습니다. `lazyReporter`에서 종속성이 필요한 `mainModule`을 갖지 않도록 하십시오.

```kotlin
startKoin {
    androidLogger()
    androidContext(this@TestApp)
    modules(mainModule)
    lazyModules(lazyReporter)
}
```

:::warning
현재 Koin은 모듈이 Lazy 모듈에 의존하는지 여부를 확인하지 않습니다.
:::