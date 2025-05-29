---
title: Android에서 여러 Koin 모듈 사용하기
---

Koin을 사용하면 모듈에 정의를 기술합니다. 이 섹션에서는 모듈을 선언하고, 구성하며, 연결하는 방법을 살펴봅니다.

## 여러 모듈 사용하기

컴포넌트들이 반드시 동일한 모듈에 있을 필요는 없습니다. 모듈은 정의를 구성하는 데 도움이 되는 논리적인 공간이며, 다른 모듈의 정의에 의존할 수 있습니다. 정의는 지연(lazy)되며, 컴포넌트가 요청할 때만 해결됩니다.

별도의 모듈에 연결된 컴포넌트들을 예시로 들어보겠습니다.

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

Koin 컨테이너를 시작할 때 사용되는 모듈 목록을 선언하기만 하면 됩니다.

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // Load modules
            modules(moduleA, moduleB)
        }
        
    }
}
```
Gradle 모듈별로 직접 구성하고 여러 Koin 모듈을 모으는 것은 사용자에게 달려 있습니다.

> 자세한 내용은 [Koin 모듈 섹션](/docs/reference/koin-core/modules)을 확인하세요.

## 모듈 포함 (3.2부터)

`Module` 클래스에 새로운 함수 `includes()`가 도입되어, 다른 모듈들을 포함하여 모듈을 체계적이고 구조화된 방식으로 구성할 수 있습니다.

이 새로운 기능의 두 가지 주요 사용 사례는 다음과 같습니다.
- 대규모 모듈을 더 작고 집중적인 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈 가시성에 대한 더 세밀한 제어(아래 예시 참조)를 가능하게 합니다.

어떻게 작동할까요? 몇 가지 모듈을 예로 들고, `parentModule`에 모듈을 포함시켜 보겠습니다.

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

모든 모듈을 명시적으로 설정할 필요가 없다는 점에 유의하세요. `parentModule`을 포함함으로써 `includes`에 선언된 모든 모듈(`childModule1` 및 `childModule2`)이 자동으로 로드됩니다. 다시 말해, Koin은 `parentModule`, `childModule1`, `childModule2`를 효과적으로 로드하는 것입니다.

한 가지 중요한 세부 사항은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 것입니다. 이는 모듈화된 프로젝트에서 무엇을 노출할지에 대한 유연성을 제공합니다.

:::info
모듈 로딩은 이제 모든 모듈 그래프를 평탄화하고 모듈의 중복 정의를 방지하도록 최적화되었습니다.
:::

마지막으로, 여러 중첩되거나 중복된 모듈을 포함할 수 있으며, Koin은 포함된 모든 모듈을 평탄화하여 중복을 제거합니다.

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` module
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // Load modules
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

`dataModule`, `domainModule`, `featureModule1`, `featureModule2`와 같이 모든 모듈은 한 번만 포함된다는 점에 유의하세요.

## 백그라운드 모듈 로딩으로 시작 시간 단축

이제 "지연(lazy)" Koin 모듈을 선언하여 리소스 사전 할당을 트리거하지 않고 Koin 시작과 함께 백그라운드에서 로드할 수 있습니다. 이는 지연 모듈을 백그라운드에서 로드하도록 전달하여 Android 시작 프로세스가 차단되는 것을 방지하는 데 도움이 될 수 있습니다.

- `lazyModule` - Koin 모듈의 지연(Lazy) Kotlin 버전을 선언합니다.
- `Module.includes` - 지연 모듈을 포함할 수 있도록 허용합니다.
- `KoinApplication.lazyModules` - 플랫폼 기본 Dispatcher를 사용하여 코루틴으로 백그라운드에서 지연 모듈을 로드합니다.
- `Koin.waitAllStartJobs` - 시작 작업이 완료될 때까지 기다립니다.
- `Koin.runOnKoinStarted` - 시작 완료 후 코드 블록을 실행합니다.

좋은 예시가 이해에 항상 더 도움이 됩니다.

```kotlin

// Lazy loaded module
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // sync module loading
    modules(m1)
    // load lazy Modules in background
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// wait for start completion
koin.waitAllStartJobs()

// or run code after start
koin.runOnKoinStarted { koin ->
    // run after background load complete
}