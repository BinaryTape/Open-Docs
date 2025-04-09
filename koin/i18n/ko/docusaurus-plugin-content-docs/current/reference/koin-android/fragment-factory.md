---
title: "Fragment Factory"
---
AndroidX에서 Android `Fragment` 관련 기능을 확장하기 위해 `androidx.fragment` 패키지 모음을 출시했습니다.

https://developer.android.com/jetpack/androidx/releases/fragment

## Fragment Factory

`2.1.0-alpha-3` 버전부터 `FragmentFactory`가 도입되었습니다. 이 클래스는 `Fragment` 클래스의 인스턴스를 생성하는 데 사용됩니다.

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin은 `KoinFragmentFactory`를 제공하여 `Fragment` 인스턴스를 직접 주입할 수 있도록 도와줍니다.

## Fragment Factory 설정

시작 시 KoinApplication 선언에서 `fragmentFactory()` 키워드를 사용하여 기본 `KoinFragmentFactory` 인스턴스를 설정합니다.

```kotlin
 startKoin {
    // setup a KoinFragmentFactory instance
    fragmentFactory()

    modules(...)
}
```

## Fragment 선언 및 주입

`Fragment` 인스턴스를 선언하려면 Koin 모듈에서 `fragment`로 선언하고 *constructor injection(생성자 주입)*을 사용합니다.

다음과 같은 `Fragment` 클래스가 있다고 가정합니다.

```kotlin
class MyFragment(val myService: MyService) : Fragment() {

}
```

```kotlin
val appModule = module {
    single { MyService() }
    fragment { MyFragment(get()) }
}
```

## Fragment 가져오기

호스트 `Activity` 클래스에서 `setupKoinFragmentFactory()`를 사용하여 fragment factory를 설정합니다.

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        //...
    }
}
```

`supportFragmentManager`를 사용하여 `Fragment`를 검색합니다.

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

오버로드된 선택적 매개변수를 사용하여 `bundle` 또는 `tag`를 넣습니다.

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## Fragment Factory & Koin Scopes

Koin Activity의 Scope를 사용하려면 스코프 내에서 fragment를 `scoped` 정의로 선언해야 합니다.

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

스코프를 사용하여 Koin Fragment Factory를 설정합니다. `setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin Fragment Factory
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}
```