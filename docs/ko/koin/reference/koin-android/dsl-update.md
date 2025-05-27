---
title: Android용 생성자 DSL
---

## 새로운 생성자 DSL (버전 3.2부터)

Koin은 이제 클래스 생성자를 직접 지정하고 람다 표현식 내에서 정의를 작성할 필요가 없는 새로운 종류의 DSL 키워드를 제공합니다.

자세한 내용은 새로운 [생성자 DSL](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 섹션을 참조하십시오.

Android의 경우, 이는 다음 새로운 생성자 DSL 키워드를 의미합니다:

*   `viewModelOf()` - `viewModel { }`와 동일
*   `fragmentOf()` - `fragment { }`와 동일
*   `workerOf()` - `worker { }`와 동일

:::info
클래스 생성자를 지정하려면 클래스 이름 앞에 `::`를 사용해야 합니다.
:::

### Android 예시

다음 구성 요소를 가진 Android 애플리케이션을 가정합니다:

```kotlin
// A simple service
class SimpleServiceImpl() : SimpleService

// a Presenter, using SimpleService and can receive "id" injected param
class FactoryPresenter(val id: String, val service: SimpleService)

// a ViewModel that can receive "id" injected param, use SimpleService and get SavedStateHandle
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// a scoped Session, that can received link to the MyActivity (from scope)
class Session(val activity: MyActivity)

// a Worker, using SimpleService and getting Context & WorkerParameters
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

다음과 같이 선언할 수 있습니다:

```kotlin
module {
    singleOf(::SimpleServiceImpl){ bind<SimpleService>() }

    factoryOf(::FactoryPresenter)

    viewModelOf(::SimpleViewModel)

    scope<MyActivity>(){
        scopedOf(::Session) 
    }

    workerOf(::SimpleWorker)
}
```

## Android 리플렉션 DSL (버전 3.2부터 사용 중단됨)

:::caution
Koin 리플렉션 DSL은 이제 사용 중단되었습니다. 위에 있는 Koin 생성자 DSL을 사용하십시오.
:::