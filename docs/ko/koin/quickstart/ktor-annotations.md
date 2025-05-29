---
title: Ktor 및 어노테이션
---

> Ktor는 강력한 Kotlin 프로그래밍 언어를 사용하여 연결된 시스템에서 비동기 서버와 클라이언트를 구축하기 위한 프레임워크입니다. 여기서는 Ktor를 사용하여 간단한 웹 애플리케이션을 구축할 것입니다.

시작해 봅시다 🚀

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 설정

먼저, 아래와 같이 Koin 의존성을 추가하세요:

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 이를 `UserApplication` 클래스에 표시하는 것입니다:

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하기 위해 ("사용자 추가 또는 이름으로 찾기") "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 해당 구현입니다:

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

`@Module` 어노테이션을 사용하여 주어진 Kotlin 클래스로부터 Koin 모듈을 선언합니다. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 곳입니다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")`은 지정된 패키지에서 어노테이션이 지정된 클래스를 스캔하는 데 도움이 됩니다.

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl` 인스턴스를 생성하여 `UserRepository`의 싱글톤을 원합니다. `@Single` 태그를 지정합니다.

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 컴포넌트

기본 사용자를 요청하는 UserService 컴포넌트를 작성해 봅시다:

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository`는 `UserService`의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. `@Single` 어노테이션으로 태그를 지정합니다:

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 컨트롤러

마지막으로, HTTP 라우트를 생성하기 위해 HTTP 컨트롤러가 필요합니다. Ktor에서는 Ktor 확장 함수를 통해 표현됩니다:

```kotlin
fun Application.main() {

    // Lazy inject HelloService
    val service by inject<UserService>()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`Application.main` 함수를 시작할 수 있도록 `application.conf`가 아래와 같이 구성되어 있는지 확인하세요:

```kotlin
ktor {
    deployment {
        port = 8080

        // For dev purpose
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 시작 및 주입

마지막으로, Ktor에서 Koin을 시작해 봅시다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(AppModule().module)
    }

    // Lazy inject HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`AppModule().module`을 작성함으로써 `AppModule` 클래스에 생성된 확장을 사용합니다.

Ktor를 시작해 봅시다:

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

완료되었습니다! 이제 시작할 준비가 되었습니다. `http://localhost:8080/hello` URL을 확인하세요!