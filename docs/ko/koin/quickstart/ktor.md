---
title: Ktor
---

> Ktor는 강력한 Kotlin 프로그래밍 언어를 사용하여 연결된 시스템에서 비동기 서버 및 클라이언트를 구축하기 위한 프레임워크입니다. 여기서는 Ktor를 사용하여 간단한 웹 애플리케이션을 빌드해 보겠습니다.

시작해 봅시다 🚀

:::note
업데이트 - 2024-10-21
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
data class User(val name : String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 만듭니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

Koin 모듈을 선언하려면 `module` 함수를 사용하세요. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 장소입니다.

```kotlin
val appModule = module {
    
}
```

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 정의하고자 합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserService 컴포넌트

기본 사용자를 요청하기 위한 `UserService` 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository`는 `UserService`의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. `singleOf` 정의를 사용하여 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTP 컨트롤러

마지막으로, HTTP 경로(Route)를 생성하기 위한 HTTP 컨트롤러가 필요합니다. Ktor에서는 이를 Ktor 확장 함수를 통해 표현합니다:

```kotlin
fun Application.main() {

    // UserService를 지연 주입(Lazy inject)
    val service by inject<UserService>()

    // 라우팅 섹션
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`Application.main` 함수가 시작될 수 있도록 `application.conf`가 아래와 같이 구성되어 있는지 확인하세요:

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

## 의존성 선언

Koin 모듈로 컴포넌트들을 조립해 보겠습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 시작 및 주입

마지막으로, Ktor에서 Koin을 시작해 봅시다:

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    // UserService를 지연 주입
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

Ktor를 실행합니다:

```kotlin
fun main(args: Array<String>) {
    // Ktor 시작
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

완성되었습니다! 이제 모든 준비가 끝났습니다. `http://localhost:8080/hello` URL을 확인해 보세요!