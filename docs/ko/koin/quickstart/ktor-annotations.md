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
data class User(val name : String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 찾기)하기 위해 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

지정된 Kotlin 클래스에서 Koin 모듈을 선언하려면 `@Module` 어노테이션을 사용합니다. Koin 모듈은 주입할 모든 컴포넌트를 정의하는 곳입니다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")`은 대상 패키지에서 어노테이션이 달린 클래스들을 스캔하도록 도와줍니다.

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 만들고자 합니다. 이를 위해 `@Single` 태그를 붙입니다.

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 컴포넌트

기본 사용자를 요청하기 위한 UserService 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository는 UserPresenter의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. `@Single` 어노테이션을 붙입니다:

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 컨트롤러

마지막으로, HTTP 루트(Route)를 생성하기 위한 HTTP 컨트롤러가 필요합니다. Ktor에서는 Ktor 확장 함수(extension function)를 통해 이를 표현합니다:

```kotlin
fun Application.main() {

    // UserService를 지연 주입(Lazy inject)합니다.
    val service by inject<UserService>()

    // 라우팅 섹션
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

        // 개발 용도
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 시작 및 주입

마지막으로 Ktor에서 Koin을 시작해 봅시다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(AppModule().module)
    }

    // UserService를 지연 주입합니다.
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // 라우팅 섹션
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`AppModule().module`을 작성함으로써 `AppModule` 클래스에 생성된 확장 속성을 사용하게 됩니다.

Ktor를 시작해 봅시다:

```kotlin
fun main(args: Array<String>) {
    // Ktor 시작
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

끝났습니다! 이제 준비가 되었습니다. `http://localhost:8080/hello` URL을 확인해 보세요!