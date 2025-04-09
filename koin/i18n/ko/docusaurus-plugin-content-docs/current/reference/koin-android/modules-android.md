---
title: "Android에서 여러 Koin 모듈 사용하기"
---
Koin을 사용하면 모듈에서 정의를 설명할 수 있습니다. 이 섹션에서는 모듈을 선언, 구성 및 연결하는 방법을 살펴봅니다.

## 여러 모듈 사용하기

컴포넌트가 반드시 동일한 모듈에 있을 필요는 없습니다. 모듈은 정의를 구성하는 데 도움이 되는 논리적 공간이며 다른 모듈의 정의에 의존할 수 있습니다. 정의는 지연(Lazy)되며 컴포넌트가 요청할 때만 확인됩니다.

별도의 모듈에서 연결된 컴포넌트의 예를 들어 보겠습니다.

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

Koin 컨테이너를 시작할 때 사용된 모듈 목록을 선언하기만 하면 됩니다.

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

Gradle 모듈별로 자체적으로 구성하고 여러 Koin 모듈을 수집하는 것은 사용자에게 달려 있습니다.

> 자세한 내용은 [Koin 모듈 섹션](/reference/koin-core/modules.md)을 확인하세요.

## 모듈 포함 (Module Includes) (3.2부터)

`Module` 클래스에서 새로운 함수 `includes()`를 사용할 수 있습니다. 이 함수를 사용하면 구성된 방식으로 다른 모듈을 포함하여 모듈을 구성할 수 있습니다.

새로운 기능의 두 가지 주요 사용 사례는 다음과 같습니다.
- 큰 모듈을 더 작고 집중적인 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈 가시성을 보다 세밀하게 제어할 수 있습니다 (아래 예제 참조).

어떻게 작동합니까? 몇 가지 모듈을 가져와서 `parentModule`에 모듈을 포함합니다.

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

모든 모듈을 명시적으로 설정할 필요는 없습니다. `parentModule`을 포함하면 `includes`에 선언된 모든 모듈이 자동으로 로드됩니다 (`childModule1` 및 `childModule2`). 즉, Koin은 `parentModule`, `childModule1` 및 `childModule2`를 효과적으로 로드합니다.

관찰해야 할 중요한 세부 사항은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 것입니다. 이를 통해 모듈화된 프로젝트에서 노출할 항목에 대한 유연성을 얻을 수 있습니다.

:::info
모듈 로딩은 이제 모든 모듈 그래프를 평면화하고 모듈의 중복 정의를 방지하도록 최적화되었습니다.
:::

마지막으로 여러 중첩되거나 중복된 모듈을 포함할 수 있으며 Koin은 중복을 제거하여 포함된 모든 모듈을 평면화합니다.

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

모든 모듈은 한 번만 포함됩니다: `dataModule`, `domainModule`, `featureModule1`, `featureModule2`.

## 백그라운드 모듈 로딩으로 시작 시간 단축

이제 "lazy" Koin 모듈을 선언하여 리소스의 사전 할당을 방지하고 Koin 시작과 함께 백그라운드에서 로드할 수 있습니다. 이렇게 하면 백그라운드에서 로드될 lazy 모듈을 전달하여 Android 시작 프로세스를 차단하지 않도록 할 수 있습니다.

- `lazyModule` - Koin 모듈의 Lazy Kotlin 버전을 선언합니다.
- `Module.includes` - lazy 모듈을 포함할 수 있습니다.
- `KoinApplication.lazyModules` - 플랫폼 기본 `Dispatchers`를 기준으로 코루틴을 사용하여 백그라운드에서 lazy 모듈을 로드합니다.
- `Koin.waitAllStartJobs` - 시작 작업이 완료될 때까지 기다립니다.
- `Koin.runOnKoinStarted` - 시작이 완료된 후 블록 코드를 실행합니다.

이해를 돕기 위해 좋은 예가 항상 더 좋습니다.

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
```