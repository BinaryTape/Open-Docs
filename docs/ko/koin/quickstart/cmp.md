---
title: Compose Multiplatform - 공유 UI
---

> 이 튜토리얼에서는 Android 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 튜토리얼을 완료하는 데 약 __15분__ 정도 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 공유 ViewModel을 사용하여 네이티브 UI에 표시하는 것입니다.

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## "User" 데이터

> 모든 공통/공유 코드는 `shared` Gradle 프로젝트에 위치합니다.

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

## 공유 Koin 모듈

Koin 모듈을 선언하려면 `module` 함수를 사용하세요. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 곳입니다.

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`를 싱글톤(singleton)으로 정의하고자 합니다.

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 공유 ViewModel

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserPresenter의 생성자에서 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 메모리에 인스턴스를 유지하지 않고 네이티브 시스템이 이를 관리하도록 `viewModelOf` 정의를 사용하여 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koin 모듈은 `initKoin()` 함수를 통해 iOS 측에서 쉽게 실행할 수 있도록 실행 가능한 함수(여기서는 `appModule`)로 제공됩니다.
:::

## 네이티브 컴포넌트

다음 네이티브 컴포넌트는 Android와 iOS에 정의되어 있습니다:

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

두 플랫폼 모두 로컬 플랫폼 구현을 가져옵니다.

## Compose에서 주입하기

> 모든 공통 Compose 앱은 `composeApp` Gradle 모듈의 `commonMain`에 위치합니다.

`UserRepository` 인스턴스를 해결(resolve)하면서 `UserViewModel` 컴포넌트가 생성됩니다. 이를 Activity에서 사용하기 위해 `koinViewModel` 또는 `koinNavViewModel` Compose 함수를 사용하여 주입해 보겠습니다: 

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

이것으로 앱이 준비되었습니다.

Android 애플리케이션에서 Koin을 시작해야 합니다. Compose 애플리케이션 함수 `App`에서 `KoinApplication()` 함수를 호출하기만 하면 됩니다:

```kotlin
fun App() {
    
    KoinApplication(
        application = {
            modules(appModule)
        }
    )
{
// Compose content
}
}
```

:::info
`modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## iOS에서의 Compose 앱

> 모든 iOS 앱은 `iosMain` 폴더에 위치합니다.

`MainViewController.kt`에서 iOS용 Compose를 시작할 준비가 되었습니다:

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }