---
title: 안드로이드에서 주입하기
---

모듈을 선언하고 Koin을 시작한 후, 안드로이드 Activity, Fragment 또는 Service에서 인스턴스를 어떻게 가져올 수 있을까요?

## 안드로이드 클래스 준비

`Activity`, `Fragment`, `Service`는 `KoinComponents` 확장으로 확장됩니다. 모든 `ComponentCallbacks` 클래스는 Koin 확장 기능에 접근할 수 있습니다.

Kotlin 확장 기능에 접근할 수 있습니다:

*   `by inject()` - Koin 컨테이너에서 지연 평가된 인스턴스
*   `get()` - Koin 컨테이너에서 즉시 가져오는 인스턴스

프로퍼티를 지연 주입 방식으로 선언할 수 있습니다:

```kotlin
module {
    // definition of Presenter
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy inject Presenter
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

또는 인스턴스를 직접 가져올 수도 있습니다:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Retrieve a Presenter instance
    val presenter : Presenter = get()
}  
```

:::info
클래스에 확장이 없다면, `KoinComponent` 인터페이스를 구현하기만 하면 다른 클래스에서 인스턴스를 `inject()`하거나 `get()`할 수 있습니다.
:::

## 정의에서 안드로이드 컨텍스트 사용하기

`Application` 클래스가 Koin을 설정하면, `androidContext` 함수를 사용하여 안드로이드 컨텍스트를 주입함으로써 나중에 모듈에서 필요할 때 해결될 수 있도록 할 수 있습니다:

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // inject Android context
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

정의에서, `androidContext()` 및 `androidApplication()` 함수는 Koin 모듈에서 `Context` 인스턴스를 가져올 수 있게 하여 `Application` 인스턴스를 필요로 하는 표현식을 간단하게 작성하는 데 도움이 됩니다.

```kotlin
val appModule = module {

    // create a Presenter instance with injection of R.string.mystring resources from Android
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## 안드로이드 스코프 및 안드로이드 컨텍스트 해결

`Context` 타입을 바인딩하는 스코프가 있는 경우에도, 다른 레벨에서 `Context`를 해결해야 할 수 있습니다.

설정을 예로 들어보겠습니다:

```kotlin
class MyPresenter(val context : Context)

startKoin {
  androidContext(context)
  modules(
    module {
      scope<MyActivity> {
        scoped { MyPresenter( <get() ???> ) }
      }
    }
  )
}
```

`MyPresenter`에서 올바른 타입을 해결하려면 다음을 사용하세요:
*   `get()`는 가장 가까운 `Context` 정의를 해결합니다. 여기서 `MyActivity` 소스 스코프가 됩니다.
*   `androidContext()`도 가장 가까운 `Context` 정의를 해결합니다. 여기서 `MyActivity` 소스 스코프가 됩니다.
*   `androidApplication()`도 `Application` 정의를 해결합니다. 여기서 Koin 설정에 정의된 `context` 객체 소스 스코프가 됩니다.