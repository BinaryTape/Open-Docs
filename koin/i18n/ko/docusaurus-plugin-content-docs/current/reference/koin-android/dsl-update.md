---
title: "Android용 생성자 DSL"
---
## 새로운 생성자 DSL (3.2부터)

Koin은 이제 클래스 생성자를 직접 타겟팅하고 람다 표현식 내에서 정의를 입력하지 않아도 되는 새로운 종류의 DSL 키워드를 제공합니다.

자세한 내용은 새로운 [생성자 DSL](/reference/koin-core/dsl-update.md) 섹션을 확인하세요.

Android의 경우, 이는 다음과 같은 새로운 생성자 DSL 키워드를 의미합니다.

* `viewModelOf()` - `viewModel { }`과 동일
* `fragmentOf()` - `fragment { }`과 동일
* `workerOf()` - `worker { }`과 동일

:::info
클래스 생성자를 타겟팅하려면 클래스 이름 앞에 `::`을 사용해야 합니다.
:::

### Android 예제

다음 구성 요소가 있는 Android 애플리케이션이 주어졌을 때:

```kotlin
// 간단한 서비스
class SimpleServiceImpl() : SimpleService

// SimpleService를 사용하고 "id" 주입 파라미터를 받을 수 있는 Presenter
class FactoryPresenter(val id: String, val service: SimpleService)

// "id" 주입 파라미터를 받을 수 있고, SimpleService를 사용하고 SavedStateHandle을 가져오는 ViewModel
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// MyActivity (스코프에서)에 대한 링크를 받을 수 있는 스코프된 Session
class Session(val activity: MyActivity)

// SimpleService를 사용하고 Context & WorkerParameters를 가져오는 Worker
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

## Android Reflection DSL (3.2부터 지원 중단됨)

:::caution
Koin Reflection DSL은 더 이상 사용되지 않습니다. 위의 Koin 생성자 DSL을 사용하십시오.
:::