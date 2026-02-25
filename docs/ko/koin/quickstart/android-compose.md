---
title: Android - Jetpack Compose
---

> 이 튜토리얼에서는 Android 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 이 튜토리얼을 완료하는 데는 약 **10분**이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 설정

다음과 같이 Koin Android 의존성을 추가합니다:

```groovy
dependencies {

    // Android용 Koin
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, Presenter 또는 ViewModel을 사용하여 `MainActivity` 클래스에 표시하는 것입니다.

> Users -> UserRepository -> (Presenter 또는 ViewModel) -> Composable

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다: 

```kotlin
data class User(val name : String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

Koin 모듈을 선언하려면 `module` 함수를 사용합니다. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 공간입니다.

```kotlin
val appModule = module {
    
}
```

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 만들고자 합니다.

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## UserViewModel로 사용자 표시하기

### `UserViewModel` 클래스

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserViewModel의 생성자에서 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 메모리에 인스턴스를 유지하지 않도록(Android 생명주기에 따른 메모리 누수 방지) `viewModelOf` 정의로 선언합니다:

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 함수를 사용하면 Koin이 필요한 의존성을 해결(resolve)하도록 요청할 수 있습니다.

### Compose에서 ViewModel 주입하기

`UserViewModel` 컴포넌트가 생성될 때, `UserRepository` 인스턴스가 함께 해결됩니다. 이를 Activity에서 사용하기 위해 `koinViewModel()` 함수를 사용하여 주입해 보겠습니다: 

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 함수를 사용하면 ViewModel 인스턴스를 가져오고, 연관된 ViewModel Factory를 자동으로 생성하며, 이를 생명주기(lifecycle)에 바인딩할 수 있습니다.
:::

## UserStateHolder로 사용자 표시하기

### `UserStateHolder` 클래스

사용자를 표시하기 위한 State holder 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserViewModel의 생성자에서 참조됩니다.

Koin 모듈에 `UserStateHolder`를 선언합니다. 메모리에 인스턴스를 유지하지 않도록(Android 생명주기에 따른 메모리 누수 방지) `factoryOf` 정의로 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### Compose에서 UserStateHolder 주입하기

`UserStateHolder` 컴포넌트가 생성될 때, `UserRepository` 인스턴스가 함께 해결됩니다. 이를 Activity에서 사용하기 위해 `koinInject()` 함수를 사용하여 주입해 보겠습니다: 

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 함수를 사용하면 인스턴스를 가져오고, 필요한 경우 연관된 팩토리를 생성하며 생명주기에 바인딩할 수 있습니다.
:::

## Koin 시작하기

Android 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

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
`startKoin` 내부의 `modules()` 함수는 주어진 모듈 리스트를 로드합니다.
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

## Koin 모듈: 클래식 방식인가요, 생성자 DSL 방식인가요?

다음은 우리 앱을 위한 Koin 모듈 선언입니다:

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

생성자를 사용하면 다음과 같이 더 간결한 방식으로 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 앱 검증하기!

간단한 JUnit 테스트를 통해 Koin 설정을 검증함으로써, 앱을 실행하기 전에 Koin 구성이 올바른지 확인할 수 있습니다.

### Gradle 설정

다음과 같이 Koin 테스트 의존성을 추가합니다:

```groovy
dependencies {
    
    // 테스트용 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 확인하기

`verify()` 함수를 사용하면 주어진 Koin 모듈을 검증할 수 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

단순히 JUnit 테스트를 실행하는 것만으로 정의 구성에 누락된 것이 없는지 확인할 수 있습니다!