---
title: 안드로이드(Android)
---

> 이 튜토리얼에서는 안드로이드 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 튜토리얼을 완료하는 데 약 **10분** 정도 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다.](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 설정

아래와 같이 Koin 안드로이드 의존성을 추가하세요:

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 애플리케이션 개요

이 애플리케이션은 사용자 목록을 관리하고, `MainActivity` 클래스에서 Presenter 또는 ViewModel과 함께 이를 표시하는 구조입니다.

> Users -> UserRepository -> UserService -> (Presenter 또는 ViewModel) -> MainActivity

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다:

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

## UserService 컴포넌트

사용자 작업을 관리하기 위한 서비스 컴포넌트를 작성해 봅시다:

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

## Koin 모듈

Koin 모듈을 선언하려면 `module` 함수를 사용하세요. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 장소입니다.

```kotlin
val appModule = module {

}
```

컴포넌트를 선언해 봅시다. `UserRepository`와 `UserService`를 싱글톤(singleton)으로 만들고자 합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
이 튜토리얼은 컴파일 타임에 자동 연결(auto-wiring)을 제공하는 **Koin 컴파일러 플러그인 DSL(Koin Compiler Plugin DSL)**(`single<T>()`, `factory<T>()`)을 사용합니다. 설정 방법은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.
:::

## Presenter로 사용자 표시하기

사용자를 표시하기 위한 presenter 컴포넌트를 작성해 봅시다:

```kotlin
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> `UserService`는 `UserPresenter`의 생성자에서 참조됩니다.

Koin 모듈에 `UserPresenter`를 선언합니다. 메모리에 인스턴스를 유지하지 않도록(안드로이드 생명주기에 따른 메모리 누수 방지) `factory` 정의로 선언합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

## 안드로이드에서 의존성 주입하기

`UserPresenter` 컴포넌트가 생성되면서 `UserService` 인스턴스가 함께 해결(resolve)됩니다. 이를 Activity에서 가져오기 위해 `by inject()` 대리자(delegate) 함수를 사용하여 주입해 보겠습니다: 

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

이제 앱 준비가 완료되었습니다.

:::info
`by inject()` 함수를 사용하면 안드로이드 컴포넌트 런타임(Activity, Fragment, Service 등)에서 Koin 인스턴스를 검색할 수 있습니다.
:::

## Koin 시작하기

안드로이드 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하면 됩니다:

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
`startKoin` 내부의 `modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## Koin 모듈: DSL 비교

**Classic DSL**(수동 연결)을 사용한 Koin 모듈 선언은 다음과 같습니다:

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    factory { UserPresenter(get()) }
}
```

**컴파일러 플러그인 DSL(Compiler Plugin DSL)**(컴파일 타임 자동 연결)을 사용한 경우입니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

:::tip
컴파일러 플러그인 DSL을 사용하려면 [Koin 컴파일러 플러그인](/docs/setup/compiler-plugin)이 필요합니다. 이는 컴파일 타임 의존성 해결(dependency resolution)과 더 깔끔한 문법을 제공합니다.
:::