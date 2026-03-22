---
title: Ktor 및 어노테이션(Annotations)
---

> Ktor는 강력한 Kotlin 프로그래밍 언어를 사용하여 연결된 시스템에서 비동기 서버와 클라이언트를 구축하기 위한 프레임워크입니다. 여기서는 Ktor를 사용하여 간단한 웹 애플리케이션을 빌드해 보겠습니다.

시작해 봅시다 🚀

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 설정

먼저, 다음과 같이 Koin 의존성을 추가합니다:

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Kotlin 앱을 위한 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 애플리케이션 개요

이 애플리케이션의 컨셉은 사용자 목록을 관리하고 이를 `UserApplication` 클래스에 표시하는 것입니다:

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다:

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 찾기)하기 위해 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

## Koin 모듈

지정된 Kotlin 클래스에서 Koin 모듈을 선언하려면 `@Module` 어노테이션을 사용합니다. Koin 모듈은 주입할 모든 컴포넌트를 정의하는 곳입니다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 이 클래스를 Koin 모듈로 선언합니다.
* `@ComponentScan("org.koin.sample")` - 해당 패키지에서 어노테이션이 달린 클래스들을 스캔하고 등록합니다.
* `@Configuration` - `@KoinApplication`과 함께 자동 모듈 검색(automatic module discovery)을 활성화합니다.

:::note
이 프로젝트는 싱글톤(singleton) 컴포넌트를 선언하기 위해 Koin의 `@Singleton` 어노테이션(`org.koin.core.annotation` 패키지)을 사용합니다.
:::

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤을 만들고자 합니다. 이를 위해 `@Singleton` 태그를 붙입니다.

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository
```

## UserService 컴포넌트

사용자 작업을 관리하기 위한 `UserService` 컴포넌트를 작성해 보겠습니다:

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

> UserRepository는 UserServiceImpl의 생성자에서 참조됩니다.

`@Singleton` 어노테이션을 사용하여 `UserService`를 선언합니다.

## HTTP 컨트롤러 및 Koin 애플리케이션

마지막으로, `@KoinApplication` 객체를 생성하고 HTTP 루트(Route)를 구성해야 합니다.

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 어노테이션은 이 객체를 Koin의 어노테이션 기반 설정의 진입점(entry point)으로 표시합니다. KSP 프로세서는 Koin을 초기화할 때 `withConfiguration<T>()`와 함께 사용할 수 있는 구성을 생성합니다.

## 시작 및 주입

이제 생성된 설정을 사용하여 Ktor 애플리케이션에서 Koin을 구성해 봅시다:

```kotlin
fun Application.main() {
    // 생성된 구성을 사용하여 Koin을 설치합니다.
    install(Koin) {
        slf4jLogger()
        withConfiguration<KoinUserApplication>()
    }

    // UserService를 지연 주입(Lazy inject)합니다.
    val service by inject<UserService>()
    service.loadUsers()

    // 라우팅 섹션
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

**주요 사항:**
* `withConfiguration<KoinUserApplication>()` - 어노테이션이 달린 애플리케이션 객체로부터 생성된 Koin 설정을 사용합니다.
* 수동으로 `modules(AppModule().module)`을 호출할 필요가 없습니다. 자동으로 포함됩니다!
* `/hello` 엔드포인트는 선택 사항으로 `name` 쿼리 파라미터를 받습니다.

Ktor를 시작해 봅시다:

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

끝났습니다! 이제 준비가 되었습니다. 아래 URL들을 확인해 보세요:
- `http://localhost:8080/hello` - Alice(기본 사용자)에게 인사합니다.
- `http://localhost:8080/hello?name=Bob` - Bob에게 인사합니다.

:::info
모듈에 `@Configuration`과 함께 사용된 `@KoinApplication` 어노테이션은 컴파일 타임에 어노테이션이 달린 모든 의존성을 자동으로 검색하고 로드합니다.
:::