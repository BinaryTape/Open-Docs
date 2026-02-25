---
title: Android에서의 여러 Koin 모듈
---

Koin을 사용하면 모듈에 정의(definitions)를 기술합니다. 이 섹션에서는 모듈을 선언하고, 구성하고, 연결하는 방법을 살펴봅니다.

## 여러 모듈 사용하기

컴포넌트들이 반드시 동일한 모듈에 있을 필요는 없습니다. 모듈은 정의를 정리하는 데 도움이 되는 논리적 공간이며, 다른 모듈의 정의에 의존할 수 있습니다. 정의는 지연(lazy) 방식으로 처리되며, 컴포넌트가 요청될 때만 해석(resolved)됩니다.

별도의 모듈에 있는 컴포넌트들이 서로 연결된 예를 살펴보겠습니다:

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // ComponentA 싱글톤
    single { ComponentA() }
}

val moduleB = module {
    // ComponentA 인스턴스가 연결된 ComponentB 싱글톤
    single { ComponentB(get()) }
}
```

Koin 컨테이너를 시작할 때 사용할 모듈 목록을 선언하기만 하면 됩니다:

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 모듈 로드
            modules(moduleA, moduleB)
        }
        
    }
}
```

Gradle 모듈별로 직접 구성하고 여러 Koin 모듈을 한데 모으는 것은 여러분의 선택입니다.

> 자세한 내용은 [Koin 모듈 섹션](/docs/reference/koin-core/modules)을 확인하세요.

## 모듈 포함 (3.2 버전부터)

`Module` 클래스에서 새로운 함수인 `includes()`를 사용할 수 있습니다. 이를 통해 다른 모듈을 포함하여 체계적이고 구조적인 방식으로 모듈을 구성할 수 있습니다.

이 새로운 기능의 주요 두 가지 사용 사례는 다음과 같습니다:
- 큰 모듈을 더 작고 집중된 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈의 가시성(visibility)을 더욱 세밀하게 제어할 수 있습니다(아래 예시 참조).

어떻게 작동할까요? 몇 개의 모듈을 예로 들어 `parentModule`에 모듈들을 포함해 보겠습니다:

```kotlin
// `:feature` 모듈
val childModule1 = module {
    /* 기타 정의 */
}
val childModule2 = module {
    /* 기타 정의 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 모듈
startKoin { modules(parentModule) }
```

모든 모듈을 명시적으로 설정할 필요가 없다는 점에 유의하세요. `parentModule`을 포함하면, `includes`에 선언된 모든 모듈(`childModule1`과 `childModule2`)이 자동으로 로드됩니다. 즉, Koin은 결과적으로 `parentModule`, `childModule1`, `childModule2`를 모두 로드하게 됩니다.

주목해야 할 중요한 세부 사항은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 점입니다. 이는 모듈화된 프로젝트에서 외부에 노출할 항목에 대한 유연성을 제공합니다.

:::info
모듈 로딩은 이제 모든 모듈 그래프를 평탄화(flatten)하고 모듈의 중복 정의를 방지하도록 최적화되었습니다.
:::

마지막으로, 여러 개의 중첩되거나 중복된 모듈을 포함할 수 있으며, Koin은 모든 포함된 모듈을 평탄화하여 중복을 제거합니다:

```kotlin
// :feature 모듈
val dataModule = module {
    /* 기타 정의 */
}
val domainModule = module {
    /* 기타 정의 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` 모듈
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 모듈 로드
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

이 경우 모든 모듈은 한 번씩만 포함됩니다: `dataModule`, `domainModule`, `featureModule1`, `featureModule2`.

## 백그라운드 모듈 로딩으로 시작 시간 단축하기

이제 "지연(lazy)" Koin 모듈을 선언하여 리소스의 사전 할당을 방지하고 Koin 시작과 함께 백그라운드에서 로드할 수 있습니다. 이는 백그라운드에서 로드될 지연 모듈을 전달함으로써 Android 시작 프로세스가 차단되는 것을 방지하는 데 도움이 됩니다.

- `lazyModule` - 지연 로딩되는 Kotlin 버전의 Koin 모듈을 선언합니다.
- `Module.includes` - 지연 모듈을 포함할 수 있도록 합니다.
- `KoinApplication.lazyModules` - 플랫폼의 기본 디스패처(Dispatchers)를 사용하여 코루틴으로 백그라운드에서 지연 모듈을 로드합니다.
- `Koin.waitAllStartJobs` - 시작 작업이 완료될 때까지 기다립니다.
- `Koin.runOnKoinStarted` - 시작이 완료된 후 코드 블록을 실행합니다.

이해를 돕기 위한 예제는 다음과 같습니다:

```kotlin

// 지연 로드되는 모듈
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 동기 모듈 로딩
    modules(m1)
    // 백그라운드에서 지연 모듈 로딩
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 시작 완료까지 대기
koin.waitAllStartJobs()

// 또는 시작 후 코드 실행
koin.runOnKoinStarted { koin ->
    // 백그라운드 로드가 완료된 후 실행됨
}