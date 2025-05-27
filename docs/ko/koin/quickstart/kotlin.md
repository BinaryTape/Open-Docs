---
title: Kotlin
---

> 이 튜토리얼에서는 Kotlin 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 가져오는 방법을 설명합니다.
> 이 튜토리얼을 완료하는 데 약 __10분__이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 Github에서 확인할 수 있습니다.](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 설정

먼저, 아래와 같이 `koin-core` 의존성이 추가되었는지 확인하세요.

```groovy
dependencies {
    
    // Koin for Kotlin apps
    compile "io.insert-koin:koin-core:$koin_version"
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 이를 `UserApplication` 클래스에 표시하는 것입니다.

> Users -> UserRepository -> UserService -> UserApplication

## "User" 데이터

우리는 사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하는 "리포지토리" 컴포넌트를 생성합니다 (사용자 추가 또는 이름으로 사용자 찾기). 아래는 `UserRepository` 인터페이스와 그 구현입니다:

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
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserService 컴포넌트

기본 사용자를 요청하는 UserService 컴포넌트를 작성해 봅시다:

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository`는 `UserPresenter`의 생성자에서 참조됩니다.

Koin 모듈에 `UserService`를 선언합니다. `single` 정의로 선언합니다:

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 함수를 사용하면 Koin에게 필요한 의존성을 해결하도록 요청할 수 있습니다.

## UserApplication에 의존성 주입하기

`UserApplication` 클래스는 Koin으로부터 인스턴스를 부트스트랩하는 데 도움을 줄 것입니다. `KoinComponent` 인터페이스 덕분에 `UserService`를 해결(resolve)할 것입니다. 이를 통해 `by inject()` 위임 함수(delegate function)로 주입할 수 있습니다:

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // display our data
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

이제 앱이 준비되었습니다.

:::info
`by inject()` 함수를 사용하면 `KoinComponent`를 확장하는 모든 클래스에서 Koin 인스턴스를 가져올 수 있습니다.
:::

## Koin 시작하기

애플리케이션과 함께 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `main` 함수에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin`의 `modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## Koin 모듈: 클래식 방식 또는 생성자 DSL?

다음은 우리 앱을 위한 Koin 모듈 선언입니다:

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

생성자를 사용하여 더 간결하게 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}