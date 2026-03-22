---
title: Ktor
---

> Ktor는 강력한 Kotlin 프로그래밍 언어를 사용하여 연결된 시스템에서 비동기 서버 및 클라이언트를 구축하기 위한 프레임워크입니다. 여기서는 Ktor를 사용하여 간단한 웹 애플리케이션을 빌드해 보겠습니다.

시작해 봅시다 🚀

:::note
업데이트 - 2024-10-21
:::

:::tip
이 튜토리얼의 **어노테이션 버전**을 찾고 계신가요? 컴파일 타임 검증을 위해 Jakarta `@Singleton`과 함께 Koin 어노테이션을 사용하는 [Ktor & Annotations](./ktor-annotations.md)를 확인해 보세요.
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradle 설정

먼저, 다음과 같이 Koin 의존성을 추가합니다:

```kotlin
dependencies {
    // Kotlin 앱용 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 이를 `UserApplication` 클래스에 표시하는 것입니다:

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 만듭니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

Koin 모듈을 선언하려면 `module` 함수를 사용하세요. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 장소입니다.

```kotlin
val appModule = module {

}
```

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 정의하고자 합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
이 튜토리얼은 컴파일 타임에 자동 연결(auto-wiring)을 제공하는 **Koin Compiler Plugin DSL** (`single<T>()`)을 사용합니다. 구성 방법은 [Compiler Plugin Setup](/docs/setup/compiler-plugin)을 참조하세요.
:::

## UserService 컴포넌트

사용자 작업을 관리하기 위한 `UserService` 컴포넌트를 작성해 보겠습니다:

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

> `UserRepository`는 `UserServiceImpl`의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. `single` 정의를 사용하여 선언합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## HTTP 컨트롤러

마지막으로, HTTP 경로(Route)를 생성하기 위한 HTTP 컨트롤러가 필요합니다. Ktor에서는 이를 Ktor 확장 함수를 통해 표현합니다:

```kotlin
fun Application.main() {

    // UserService를 지연 주입(Lazy inject)
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

`/hello` 엔드포인트는 선택적 `name` 쿼리 파라미터를 허용합니다. 파라미터가 제공되지 않으면 기본값으로 "Alice"를 사용합니다.

요청 예시:
- `http://localhost:8080/hello` - Alice에게 인사 (기본값)
- `http://localhost:8080/hello?name=Bob` - Bob에게 인사

## 의존성 선언

Koin 모듈로 컴포넌트들을 조립해 보겠습니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 시작 및 주입

마지막으로, Ktor에서 Koin을 시작해 봅시다:

```kotlin
fun Application.main() {
    // Koin 설치
    install(Koin) {
        modules(appModule)
    }

    // UserService를 지연 주입
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

Ktor를 시작합니다:

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

완성되었습니다! 이제 모든 준비가 끝났습니다. 다음 URL들을 확인해 보세요:
- `http://localhost:8080/hello` - Alice에게 인사 (기본 사용자)
- `http://localhost:8080/hello?name=Bob` - Bob에게 인사