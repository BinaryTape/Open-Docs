---
title: Android - Jetpack Compose
---

> 이 튜토리얼은 Android 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 검색하는 방법을 알려줍니다.
> 튜토리얼을 완료하는 데 약 **10분**이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 이용 가능합니다.](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 설정

아래와 같이 Koin Android 의존성을 추가합니다:

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 애플리케이션 개요

애플리케이션의 아이디어는 사용자 목록을 관리하고, `MainActivity` 클래스에서 Presenter 또는 ViewModel을 사용하여 이를 표시하는 것입니다:

> Users -> UserRepository -> (Presenter or ViewModel) -> Composable

## "User" 데이터

우리는 사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하기 위한 "Repository" 컴포넌트(사용자 추가 또는 이름으로 찾기)를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현입니다:

```kotlin
interface UserRepository {
    fun findUser(name : String): User?
    fun addUsers(users : List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUser(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users : List<User>) {
        _users.addAll(users)
    }
}
```

## Koin 모듈

`module` 함수를 사용하여 Koin 모듈을 선언합니다. Koin 모듈은 주입할 모든 컴포넌트를 정의하는 곳입니다.

```kotlin
val appModule = module {
    
}
```

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤을 원합니다.

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## `UserViewModel`을 사용하여 사용자 표시

### `UserViewModel` 클래스

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 봅시다:

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`는 `UserViewModel`의 생성자에 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 이는 메모리에 어떠한 인스턴스도 유지하지 않도록 (`Android lifecycle`과의 메모리 누수를 방지하기 위해) `viewModelOf` 정의로 선언합니다:

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 함수는 Koin에게 필요한 의존성을 해결하도록 요청합니다.

### Compose에서 ViewModel 주입하기

`UserViewModel` 컴포넌트는 `UserRepository` 인스턴스를 함께 해결하면서 생성될 것입니다. 이를 `Activity`로 가져오려면 `koinViewModel()` 함수로 주입합시다:

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 함수를 사용하면 `ViewModel` 인스턴스를 검색하고, 관련 `ViewModel Factory`를 생성하며, 이를 생명주기에 바인딩할 수 있습니다.
:::

## `UserStateHolder`를 사용하여 사용자 표시

### `UserStateHolder` 클래스

사용자를 표시하기 위한 상태 홀더 컴포넌트를 작성해 봅시다:

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`는 `UserViewModel`의 생성자에 참조됩니다.

Koin 모듈에 `UserStateHolder`를 선언합니다. 이는 메모리에 어떠한 인스턴스도 유지하지 않도록 (`Android lifecycle`과의 메모리 누수를 방지하기 위해) `factoryOf` 정의로 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### Compose에서 UserStateHolder 주입하기

`UserStateHolder` 컴포넌트는 `UserRepository` 인스턴스를 함께 해결하면서 생성될 것입니다. 이를 `Activity`로 가져오려면 `koinInject()` 함수로 주입합시다:

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 함수를 사용하면 `ViewModel` 인스턴스를 검색하고, 관련 `ViewModel Factory`를 생성하며, 이를 생명주기에 바인딩할 수 있습니다.
:::

## Koin 시작하기

Android 애플리케이션과 함께 Koin을 시작해야 합니다. 애플리케이션의 주요 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin`의 `modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

Compose 애플리케이션을 시작하는 동안 `KoinAndroidContext`를 사용하여 Koin을 현재 Compose 애플리케이션에 연결해야 합니다:

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                KoinAndroidContext {
                    App()
                }
            }
        }
    }
}
```

## Koin 모듈: 클래식 방식 또는 생성자 DSL?

다음은 우리 앱을 위한 Koin 모듈 선언입니다:

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

생성자를 사용하여 더 간결하게 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 앱 확인하기!

간단한 JUnit 테스트로 Koin 구성을 확인하여 앱을 출시하기 전에 Koin 구성이 올바른지 확인할 수 있습니다.

### Gradle 설정

아래와 같이 Koin Android 의존성을 추가합니다:

```groovy
dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 확인하기

`verify()` 함수는 주어진 Koin 모듈을 확인할 수 있도록 합니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

JUnit 테스트만으로 정의 구성에 누락된 것이 없는지 확인할 수 있습니다!