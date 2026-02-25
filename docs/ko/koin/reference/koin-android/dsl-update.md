---
title: Android용 생성자 DSL
---

## 새로운 생성자 DSL (3.2 버전부터)

Koin은 이제 클래스 생성자를 직접 대상으로 지정하여 람다 표현식 내에 정의를 작성하지 않아도 되는 새로운 종류의 DSL 키워드를 제공합니다.

더 자세한 내용은 새로운 [생성자 DSL (Constructor DSL)](/docs/reference/koin-core/dsl-update.md#constructor-dsl-since-32) 섹션을 확인하세요.

Android의 경우, 다음과 같은 새로운 생성자 DSL 키워드가 추가되었습니다:

* `viewModelOf()` - `viewModel { }`과 동일
* `fragmentOf()` - `fragment { }`와 동일
* `workerOf()` - `worker { }`와 동일

:::info
클래스 생성자를 지정하려면 클래스 이름 앞에 `::`를 반드시 사용해야 합니다.
:::

### Android 예시

다음과 같은 컴포넌트로 구성된 Android 애플리케이션이 있다고 가정해 보겠습니다:

```kotlin
// 단순한 서비스
class SimpleServiceImpl() : SimpleService

// SimpleService를 사용하며 "id" 주입 파라미터를 받을 수 있는 Presenter
class FactoryPresenter(val id: String, val service: SimpleService)

// "id" 주입 파라미터를 받을 수 있고, SimpleService를 사용하며 SavedStateHandle을 가져오는 ViewModel
class SimpleViewModel(val id: String, val service: SimpleService, val handle: SavedStateHandle) : ViewModel()

// MyActivity(스코프에서 제공)에 대한 링크를 받을 수 있는 스코프 세션
class Session(val activity: MyActivity)

// SimpleService를 사용하며 Context 및 WorkerParameters를 가져오는 Worker
class SimpleWorker(
    private val simpleService: SimpleService,
    appContext: Context,
    private val params: WorkerParameters
) : CoroutineWorker(appContext, params)
```

이러한 컴포넌트들을 다음과 같이 선언할 수 있습니다:

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

## Android 리플렉션 DSL (3.2 버전부터 권장되지 않음)

:::caution
Koin 리플렉션(Reflection) DSL은 이제 권장되지 않습니다(deprecated). 위에 설명된 Koin 생성자 DSL을 사용해 주세요.
:::