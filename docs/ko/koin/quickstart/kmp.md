---
title: Kotlin 멀티플랫폼 - 공유 UI 없음
---

> 이 튜토리얼을 통해 Android 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 가져올 수 있습니다.
> 튜토리얼을 완료하는 데 약 __15분__이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 이용할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, 공유 Presenter를 사용하여 네이티브 UI에 표시하는 것입니다:

`Users -> UserRepository -> Shared Presenter -> Native UI`

## `User` 데이터

> 모든 공통/공유 코드는 `shared` Gradle 프로젝트에 있습니다.

우리는 사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하기 위해 (`User`를 추가하거나 이름으로 찾기) "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

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

`module` 함수를 사용하여 Koin 모듈을 선언하세요. Koin 모듈은 주입할 모든 컴포넌트를 정의하는 곳입니다.

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤을 원합니다.

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 공유 Presenter

사용자를 표시하기 위한 프레젠터 컴포넌트를 작성해 봅시다:

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserPresenter`의 생성자에서 `UserRepository`가 참조됩니다.

Koin 모듈에 `UserPresenter`를 선언합니다. 메모리에 인스턴스를 유지하지 않고 네이티브 시스템이 이를 보유하도록 `factoryOf` 정의로 선언합니다.

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 모듈은 (여기서 `appModule`과 같이) 실행 가능한 함수로 제공되어, `initKoin()` 함수를 사용하여 iOS 측에서 쉽게 실행될 수 있습니다.
:::

## 네이티브 컴포넌트

다음 네이티브 컴포넌트는 Android와 iOS에 정의되어 있습니다:

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

둘 다 로컬 플랫폼 구현을 가져옵니다.

## Android에서 주입하기

> 모든 Android 앱은 `androidApp` Gradle 프로젝트에 있습니다.

`UserPresenter` 컴포넌트가 생성될 것이며, 이와 함께 `UserRepository` 인스턴스를 해결합니다. 액티비티에서 이를 얻으려면, `koinInject` Compose 함수로 이를 주입해 봅시다:

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

이제 앱이 준비되었습니다.

:::info
`koinInject()` 함수는 Android Compose 런타임에서 Koin 인스턴스를 가져올 수 있게 합니다.
:::

Android 애플리케이션과 함께 Koin을 시작해야 합니다. `App` Compose 애플리케이션 함수에서 `KoinApplication()` 함수를 호출하기만 하면 됩니다:

```kotlin
fun App() {

    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

공유 KMP 구성에서 Koin Android 구성을 수집합니다:

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
`LocalContext.current`를 사용하여 Compose에서 현재 Android 컨텍스트를 가져옵니다.
:::

그리고 공유 KMP 구성은 다음과 같습니다:

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## iOS에서 주입하기

> 모든 iOS 앱은 `iosApp` 폴더에 있습니다.

`UserPresenter` 컴포넌트가 생성될 것이며, 이와 함께 `UserRepository` 인스턴스를 해결합니다. `ContentView`에서 이를 얻으려면, iOS용 Koin 의존성을 가져오는 함수를 생성해야 합니다:

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

이제 `KoinKt.getUserPresenter().sayHello()` 함수를 iOS 부분에서 호출하기만 하면 됩니다.

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

iOS 애플리케이션과 함께 Koin을 시작해야 합니다. Kotlin 공유 코드에서는 `initKoin()` 함수를 사용하여 공유 구성을 사용할 수 있습니다. 마지막으로 iOS 메인 진입점에서 위에서 언급된 헬퍼 함수를 호출하는 `KoinAppKt.doInitKoin()` 함수를 호출할 수 있습니다.

```swift
@main
struct iOSApp: App {

    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}