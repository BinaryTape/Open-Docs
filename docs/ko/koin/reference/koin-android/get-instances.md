---
title: Android에서 주입하기
---

모듈을 선언하고 Koin을 시작한 후, Android의 Activity, Fragment 또는 Service에서 인스턴스를 어떻게 가져올 수 있을까요?

## Android 클래스를 위한 준비

`Activity`, `Fragment`, `Service`는 Koin 확장 기능으로 확장되었습니다. 모든 `ComponentCallbacks` 클래스에서 다음 기능을 사용할 수 있습니다:

* `by inject()` - Koin 컨테이너에서 지연 평가(lazy evaluated)되는 인스턴스
* `get()` - Koin 컨테이너에서 즉시 가져오는(eager fetch) 인스턴스
* `by viewModel()` - 지연 주입되는 ViewModel 인스턴스
* `getViewModel()` - 즉시 주입되는 ViewModel 인스턴스

## 의존성 정의하기

### 컴파일러 플러그인 DSL

```kotlin
val appModule = module {
    factory<Presenter>()
    viewModel<UserViewModel>()
}
```

### 어노테이션

```kotlin
@Factory
class Presenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    factory { Presenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## Activity에서 주입하기

```kotlin
class DetailActivity : AppCompatActivity() {

    // Presenter 지연 주입
    private val presenter: Presenter by inject()

    // ViewModel 지연 주입
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // presenter 및 viewModel 사용
    }
}
```

## Fragment에서 주입하기

```kotlin
class UserFragment : Fragment() {

    // Fragment 자체의 ViewModel
    private val viewModel: UserViewModel by viewModel()

    // Activity와 공유하는 ViewModel
    private val sharedViewModel: SharedViewModel by activityViewModel()

    // 일반 의존성
    private val presenter: Presenter by inject()
}
```

## Service에서 주입하기

```kotlin
class MyService : Service() {

    private val repository: UserRepository by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        repository.doSomething()
        return START_STICKY
    }
}
```

## 즉시 주입(Eager) vs 지연 주입(Lazy)

```kotlin
class DetailActivity : AppCompatActivity() {

    // 지연 주입 - 첫 접근 시 생성
    private val presenter: Presenter by inject()

    // 즉시 주입 - 즉시 생성
    private val service: MyService = get()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 또는 함수 내에서 즉시 가져오기
        val anotherPresenter: Presenter = get()
    }
}
```

| 메서드 | 생성 시점 | 사용 사례 |
|--------|--------------|----------|
| `by inject()` | 첫 접근 시 | 대부분의 경우 사용하며, 불필요한 생성을 방지함 |
| `get()` | 즉시 | 인스턴스가 즉시 필요한 경우 |

:::info
클래스에 Koin 확장 기능이 없는 경우, `KoinComponent` 인터페이스를 구현하여 `inject()` 또는 `get()`에 접근하세요.
:::

## 파라미터를 사용한 주입

주입 시점에 파라미터를 전달할 수 있습니다:

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository
)
```

```kotlin
class UserActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject { parametersOf("user_123") }
}
```

## 한정자(Qualifiers)를 사용한 주입

동일한 타입에 대해 여러 정의가 있는 경우:

```kotlin
val appModule = module {
    single<Database>(named("local")) { LocalDatabase() }
    single<Database>(named("remote")) { RemoteDatabase() }
}
```

```kotlin
class MyActivity : AppCompatActivity() {

    private val localDb: Database by inject(named("local"))
    private val remoteDb: Database by inject(named("remote"))
}
```

## 정의부에서 Android Context 사용하기

`Application` 클래스에서 `androidContext`를 사용하여 Koin을 설정하고 나면, 정의부에서 이를 해석(resolve)할 수 있습니다.

### 어노테이션

어노테이션을 사용하는 경우, `Context` 또는 `Application` 파라미터를 선언하기만 하면 자동으로 주입됩니다:

```kotlin
@Factory
class MyPresenter(private val context: Context)

@Singleton
class MyRepository(private val application: Application)
```

### DSL

모듈에서 `androidContext()` 또는 `androidApplication()` 함수를 사용하세요:

```kotlin
val appModule = module {
    factory {
        MyPresenter(androidContext())
    }
    single {
        MyRepository(androidApplication())
    }
}
```

## Android 스코프 및 Context 해석(resolution)

`Context` 타입을 바인딩하는 스코프(scope)가 있는 경우, 서로 다른 레벨의 `Context`를 해석(resolve)해야 할 때가 있습니다:

```kotlin
class MyPresenter(val context: Context)

val appModule = module {
    scope<MyActivity> {
        scoped { MyPresenter(get()) }
    }
}
```

Context 해석:
- `get()` - 가장 가까운 `Context`를 해석하며, 여기서는 `MyActivity`가 됩니다.
- `androidContext()` - 가장 가까운 `Context`를 해석하며, 여기서는 `MyActivity`가 됩니다.
- `androidApplication()` - Koin 설정 시 정의된 `Application`을 해석합니다.