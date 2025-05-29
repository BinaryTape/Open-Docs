---
title: 프래그먼트 팩토리
---

AndroidX는 Android `Fragment`와 관련된 기능을 확장하기 위해 `androidx.fragment` 패키지 모음을 출시했습니다.

https://developer.android.com/jetpack/androidx/releases/fragment

## 프래그먼트 팩토리

`2.1.0-alpha-3` 버전부터 `Fragment` 클래스의 인스턴스 생성을 전담하는 클래스인 `FragmentFactory`가 도입되었습니다:

https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory

Koin은 `Fragment` 인스턴스를 직접 주입(inject)하는 데 도움이 되는 `KoinFragmentFactory`를 제공합니다.

## 프래그먼트 팩토리 설정

시작 시, KoinApplication 선언에서 `fragmentFactory()` 키워드를 사용하여 기본 `KoinFragmentFactory` 인스턴스를 설정하세요:

```kotlin
 startKoin {
    // KoinFragmentFactory 인스턴스 설정
    fragmentFactory()

    modules(...)
}
```

## 프래그먼트 선언 및 주입

`Fragment` 인스턴스를 선언하려면 Koin 모듈에서 `fragment`로 선언하고 *생성자 주입*을 사용하면 됩니다.

다음 `Fragment` 클래스를 예시로 듭니다:

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

## 프래그먼트 가져오기

호스트 `Activity` 클래스에서 `setupKoinFragmentFactory()`를 사용하여 프래그먼트 팩토리를 설정합니다:

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin 프래그먼트 팩토리
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        //...
    }
}
```

그리고 `supportFragmentManager`를 통해 `Fragment`를 가져옵니다:

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(R.id.mvvm_frame)
            .commit()
```

오버로드된 선택적 매개변수를 사용하여 `bundle` 또는 `tag`를 추가하세요:

```kotlin
supportFragmentManager.beginTransaction()
            .replace<MyFragment>(
                containerViewId = R.id.mvvm_frame,
                args = MyBundle(),
                tag = MyString()
            )
```

## 프래그먼트 팩토리 및 Koin 스코프

Koin Activity의 스코프를 사용하려면 스코프 내에서 프래그먼트를 `scoped` 정의로 선언해야 합니다:

```kotlin
val appModule = module {
    scope<MyActivity> {
        fragment { MyFragment(get()) }
    }
}
```

그리고 스코프와 함께 Koin 프래그먼트 팩토리를 설정합니다: `setupKoinFragmentFactory(lifecycleScope)`

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Koin 프래그먼트 팩토리
        setupKoinFragmentFactory(lifecycleScope)

        super.onCreate(savedInstanceState)
        //...
    }
}