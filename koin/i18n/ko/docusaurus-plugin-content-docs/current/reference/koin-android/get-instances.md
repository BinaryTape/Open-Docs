---
title: "Android에서 주입하기"
---
모듈을 선언하고 Koin을 시작했다면 Android Activity, Fragment 또는 Service에서 인스턴스를 어떻게 검색할 수 있을까요?

## Android 클래스 준비

`Activity`, `Fragment` 및 `Service`는 KoinComponents 확장으로 확장됩니다. 모든 `ComponentCallbacks` 클래스는 Koin 확장에 액세스할 수 있습니다.

Kotlin 확장 기능에 대한 액세스 권한을 얻습니다.

* `by inject()` - Koin 컨테이너에서 지연 평가된 인스턴스
* `get()` - Koin 컨테이너에서 즉시 가져온 인스턴스

속성을 지연 주입으로 선언할 수 있습니다.

```kotlin
module {
    // Presenter 정의
    factory { Presenter() }
}
```

```kotlin
class DetailActivity : AppCompatActivity() {

    // Presenter를 Lazy 주입
    override val presenter : Presenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        //...
    }
}
```

또는 인스턴스를 직접 가져올 수도 있습니다.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Presenter 인스턴스 검색
    val presenter : Presenter = get()
}  
```

:::info
클래스에 확장 기능이 없다면 `KoinComponent` 인터페이스를 구현하여 다른 클래스에서 인스턴스를 `inject()`하거나 `get()`하세요.
:::

## 정의에서 Android Context 사용

`Application` 클래스가 Koin을 구성하면 `androidContext` 함수를 사용하여 Android Context를 주입하여 나중에 모듈에서 필요할 때 이를 확인할 수 있습니다.

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // Android context 주입
            androidContext(this@MainApplication)
            // ...
        }
        
    }
}
```

정의에서 `androidContext()` 및 `androidApplication()` 함수를 사용하면 Koin 모듈에서 `Context` 인스턴스를 가져와 `Application` 인스턴스가 필요한 표현식을 간단하게 작성할 수 있습니다.

```kotlin
val appModule = module {

    // Android에서 R.string.mystring 리소스 주입을 통해 Presenter 인스턴스 생성
    factory {
        MyPresenter(androidContext().resources.getString(R.string.mystring))
    }
}
```

## Android Scope & Android Context 확인

`Context` 유형을 바인딩하는 scope가 있는 동안에는 다른 수준에서 `Context`를 확인해야 할 수도 있습니다.

다음 구성을 살펴보겠습니다.

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

`MyPresenter`에서 올바른 유형을 확인하려면 다음을 사용하십시오.
- `get()`은 가장 가까운 `Context` 정의를 확인합니다. 여기서 소스 scope `MyActivity`가 됩니다.
- `androidContext()`도 가장 가까운 `Context` 정의를 확인합니다. 여기서 소스 scope `MyActivity`가 됩니다.
- `androidApplication()`도 `Application` 정의를 확인합니다. 여기서 Koin 설정에서 정의된 소스 scope `context` 객체가 됩니다.