---
title: Kotlin
---

> 이 튜토리얼에서는 Kotlin 애플리케이션을 작성하고, Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 이 튜토리얼을 완료하는 데 약 __10분__ 정도 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

:::tip
이 튜토리얼의 **어노테이션 버전(annotations version)**을 찾고 계신가요? 컴파일 타임 검증과 자동 모듈 검색을 위해 Koin 어노테이션을 사용하는 [Kotlin & Annotations](./kotlin-annotations.md)를 확인해 보세요.
:::

## 코드 가져오기

:::info
[소스 코드는 Github에서 확인하실 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 설정

먼저, 아래와 같이 `koin-core` 의존성이 추가되었는지 확인하세요.

```groovy
dependencies {
    
    // Kotlin 앱을 위한 Koin
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 이를 `UserApplication` 클래스에서 표시하는 것입니다.

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다.

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 만듭니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다.

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

## Koin 모듈

`module` 함수를 사용하여 Koin 모듈을 선언합니다. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 공간입니다.

```kotlin
val appModule = module {

}
```

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl` 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 만들고자 합니다.

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
이 튜토리얼은 컴파일 타임에 자동 연결(auto-wiring)을 제공하는 **Koin 컴파일러 플러그인 DSL**(`single<T>()`)을 사용합니다. 구성 방법은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.
:::

## UserService 컴포넌트

사용자 작업을 관리하기 위한 `UserService` 컴포넌트를 작성해 봅시다.

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

> UserRepository는 UserServiceImpl의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. 이를 `single` 정의로 선언합니다.

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## UserApplication에서 의존성 주입하기

`UserApplication` 클래스는 Koin에서 인스턴스를 부트스트랩(bootstrap)하는 데 도움이 됩니다. 생성자 주입(constructor injection)을 통해 `UserService`를 해결(resolve)합니다.

```kotlin
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    // 데이터 표시
    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

이제 애플리케이션이 준비되었습니다.

:::info
생성자 주입은 Kotlin 애플리케이션에서 의존성을 주입하는 권장되는 방법입니다. Koin은 `UserApplication`을 생성할 때 `UserService`를 자동으로 해결하고 주입합니다.
:::

## Koin 시작하기

애플리케이션과 함께 Koin을 시작하고 `UserApplication`을 모듈에 추가해야 합니다. 애플리케이션의 메인 진입점인 `main` 함수에서 `startKoin()` 함수를 호출하기만 하면 됩니다.

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}

fun main() {
    startKoin {
        modules(appModule)
    }

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

:::info
`startKoin`의 `modules()` 함수는 주어진 모듈 목록을 로드합니다. `KoinPlatform.getKoin().get<UserApplication>()`을 사용하여 Koin에서 `UserApplication` 인스턴스를 가져옵니다.
:::

## Koin 모듈: DSL 비교

다음은 **클래식 DSL(Classic DSL)**(수동 연결)을 사용한 Koin 모듈 선언입니다.

```kotlin
val appModule = module {
    single { UserApplication(get()) }
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
}
```

**컴파일러 플러그인 DSL(Compiler Plugin DSL)**(컴파일 타임 자동 연결) 사용 시:

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::tip
컴파일러 플러그인 DSL을 사용하려면 [Koin 컴파일러 플러그인](/docs/setup/compiler-plugin)이 필요합니다. 이는 컴파일 타임 의존성 해결과 더 깔끔한 구문을 제공합니다.
:::