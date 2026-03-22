---
title: Fragment Factory
---

Koin은 Fragment에서 생성자 주입(constructor injection)을 가능하게 하기 위해 [AndroidX FragmentFactory](https://developer.android.com/reference/kotlin/androidx/fragment/app/FragmentFactory)와 통합됩니다.

:::info
Fragment Factory는 DSL만 사용합니다. 어노테이션(Annotation) 및 컴파일러 플러그인(Compiler Plugin) DSL 지원은 아직 제공되지 않습니다.
:::

## 설정

### 의존성 추가

```groovy
implementation "io.insert-koin:koin-android:$koin_version"
```

### Fragment Factory 설정

Koin 설정에서 프래그먼트 팩토리를 활성화합니다:

```kotlin
startKoin {
    androidContext(this@MainApplication)
    fragmentFactory()
    modules(appModule)
}
```

## Fragment 선언

`fragment` DSL 키워드와 함께 생성자 주입을 사용합니다:

```kotlin
class MyFragment(
    private val myService: MyService
) : Fragment()

val appModule = module {
    single { MyService() }
    fragment { MyFragment(get()) }
}
```

## Fragment 사용

### Activity에서 설정

`super.onCreate()`를 호출하기 **전**에 `setupKoinFragmentFactory()`를 호출하세요:

```kotlin
class MyActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // 반드시 super.onCreate() 호출 전에 호출해야 합니다.
        setupKoinFragmentFactory()

        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

### Fragment 추가

구체화된(reified) 확장 함수를 사용합니다:

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(R.id.container)
    .commit()
```

인자(arguments) 및 태그(tag)와 함께 사용할 경우:

```kotlin
supportFragmentManager.beginTransaction()
    .replace<MyFragment>(
        containerViewId = R.id.container,
        args = bundleOf("key" to "value"),
        tag = "my_fragment"
    )
    .commit()
```

## Scope와 함께 Fragment Factory 사용

Fragment에서 Activity 스코프(Activity-scoped) 의존성을 사용하려면 다음과 같이 합니다:

```kotlin
val appModule = module {
    scope<MyActivity> {
        scoped { ActivityService() }
        fragment { MyFragment(get()) }
    }
}
```

`setupKoinFragmentFactory()`에 스코프를 전달합니다:

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        // 프래그먼트 팩토리에 스코프 전달
        setupKoinFragmentFactory(scope)

        super.onCreate(savedInstanceState)
    }
}
```

## 빠른 참조

| 작업 | 코드 |
|--------|------|
| Fragment 선언 | `fragment { MyFragment(get()) }` |
| 전역 팩토리 설정 | `setupKoinFragmentFactory()` |
| 스코프와 함께 설정 | `setupKoinFragmentFactory(scope)` |
| Fragment 추가 | `.replace<MyFragment>(R.id.container)` |

## 다음 단계

- **[AndroidX Fragment](https://developer.android.com/guide/fragments)** - 공식 Fragment 문서
- **[Scopes](/docs/reference/koin-android/scope)** - Android 스코프
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 주입