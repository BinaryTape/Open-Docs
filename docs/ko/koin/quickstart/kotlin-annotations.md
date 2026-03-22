---
title: Kotlin & 어노테이션
---

> 이 튜토리얼에서는 Kotlin 애플리케이션을 작성하고, 어노테이션(annotations)과 함께 Koin 의존성 주입을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 이 튜토리얼을 완료하는 데는 약 **10분**이 소요됩니다.

:::note
업데이트 - 2024-11-12
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin-annotations)
:::

## 설정

먼저, 다음과 같이 Koin 어노테이션 의존성이 추가되었는지 확인하세요:

```groovy
plugins {
    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-core:$koin_version")

    // Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고 이를 `UserApplication` 클래스에 표시하는 것입니다:

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

@Singleton
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

:::note
이 프로젝트는 싱글톤(singleton) 컴포넌트를 선언하기 위해 Koin의 `@Singleton` 어노테이션(`org.koin.core.annotation` 패키지)을 사용합니다.
:::

## Koin 모듈

Koin 모듈을 선언하려면 `@Module` 어노테이션을 사용하세요:

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 이를 Koin 모듈로 선언합니다.
* `@ComponentScan("org.koin.sample")` - 해당 패키지에서 어노테이션이 달린 클래스들을 스캔하고 등록합니다.
* `@Configuration` - `@KoinApplication`과 함께 자동 모듈 탐색(automatic module discovery)을 활성화합니다.

`@Singleton` 어노테이션을 추가하여 컴포넌트를 선언해 봅시다:

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## UserService 컴포넌트

사용자 작업을 관리하는 `UserService` 컴포넌트를 작성해 봅시다:

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

@Singleton
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

> `UserRepository`는 `UserServiceImpl`의 생성자에서 참조됩니다.

`@Singleton` 어노테이션으로 `UserService`를 선언합니다.

## UserApplication

`UserApplication` 클래스는 생성자 주입(constructor injection)을 사용하여 `UserService`를 전달받습니다:

```kotlin
@Singleton
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

:::info
생성자 주입은 의존성을 주입하는 권장되는 방법입니다. Koin은 `UserApplication`을 생성할 때 `UserService`를 자동으로 해결(resolve)하고 주입합니다.
:::

## Koin Application 객체

Koin의 어노테이션 기반 구성을 위한 진입점(entry point)을 표시하기 위해 `@KoinApplication` 객체를 생성합니다:

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 어노테이션은 KSP 프로세서와 함께 작동하여 이 객체에 대한 `startKoin()` 확장 함수를 생성합니다.

## Koin 시작하기

애플리케이션과 함께 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점에서 생성된 `startKoin()` 함수를 호출하기만 하면 됩니다:

```kotlin
fun main() {
    KoinUserApplication.startKoin()

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

**주요 포인트:**
* `KoinUserApplication.startKoin()` - 모든 모듈을 자동으로 탐색하고 로드하는 생성된 함수입니다.
* `modules()`를 수동으로 호출할 필요가 없습니다. 어노테이션이 달린 모든 의존성은 컴파일 타임에 탐색됩니다!
* `KoinPlatform.getKoin().get<UserApplication>()`을 사용하여 Koin에서 `UserApplication` 인스턴스를 가져옵니다.

:::info
모듈의 `@Configuration`과 함께 사용된 `@KoinApplication` 어노테이션은 KSP를 통해 컴파일 타임에 어노테이션이 달린 모든 의존성을 자동으로 탐색하고 로드합니다.
:::

## 어노테이션 vs 컴파일러 플러그인 DSL

어노테이션 기반 구성과 컴파일러 플러그인(Compiler Plugin) DSL을 비교하면 다음과 같습니다:

**어노테이션 사용 시:**
```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule

@Singleton
class UserApplication(private val userService: UserService)

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService
```

**컴파일러 플러그인 DSL (`kotlin.md`의 내용):**
```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

두 접근 방식 모두 동일한 결과를 얻습니다:
- **어노테이션 (Annotations)**: KSP를 통한 컴파일 타임 검증, 자동 모듈 탐색.
- **컴파일러 플러그인 DSL (Compiler Plugin DSL)**: 컴파일 타임 자동 연결(Auto-wiring), 더 깔끔한 `single<T>()` 문법.