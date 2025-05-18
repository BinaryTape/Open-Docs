---
title: "Kotlin Multiplatform - 공유 UI 없음"
---
> 이 튜토리얼에서는 Android 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 검색하는 방법을 알아봅니다.
> 튜토리얼을 완료하는 데 약 __15분__이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 Github에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 애플리케이션 개요

애플리케이션의 아이디어는 사용자 목록을 관리하고 공유 프레젠터(Shared Presenter)를 사용하여 네이티브 UI에 표시하는 것입니다.

`Users -> UserRepository -> Shared Presenter -> Native UI`

## "User" 데이터

> 모든 공통/공유 코드는 `shared` Gradle 프로젝트에 있습니다.

사용자 컬렉션을 관리합니다. 다음은 데이터 클래스입니다.

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하는 "Repository" 컴포넌트를 만듭니다(사용자 추가 또는 이름으로 찾기). 아래는 `UserRepository` 인터페이스와 구현입니다.

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

`module` 함수를 사용하여 Koin 모듈을 선언합니다. Koin 모듈은 주입할 모든 컴포넌트를 정의하는 곳입니다.

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl` 인스턴스를 생성하여 `UserRepository`의 싱글톤을 원합니다.

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 공유 프레젠터

사용자를 표시하는 프레젠터 컴포넌트를 작성해 보겠습니다.

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserPresenter의 생성자에서 참조됩니다.

Koin 모듈에서 `UserPresenter`를 선언합니다. 메모리에 인스턴스를 유지하지 않고 네이티브 시스템에서 유지하도록 `factoryOf` 정의로 선언합니다.

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 모듈은 iOS 측에서 `initKoin()` 함수를 사용하여 쉽게 실행할 수 있도록 실행할 함수(`appModule` 여기서는)로 사용할 수 있습니다.
:::

## 네이티브 컴포넌트

다음 네이티브 컴포넌트는 Android 및 iOS에서 정의됩니다.

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

둘 다 로컬 플랫폼 구현을 가져옵니다.

## Android에서 주입

> 모든 Android 앱은 `androidApp` Gradle 프로젝트에 있습니다.

`UserPresenter` 컴포넌트가 생성되어 `UserRepository` 인스턴스를 사용하여 해결됩니다. Activity에 가져오려면 `koinInject` 컴포즈 함수를 사용하여 주입합니다.

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
`koinInject()` 함수를 사용하면 Android Compose 런타임에서 Koin 인스턴스를 검색할 수 있습니다.
:::

Android 애플리케이션으로 Koin을 시작해야 합니다. 컴포즈 애플리케이션 함수 `App`에서 `KoinApplication()` 함수를 호출하기만 하면 됩니다.

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

공유 KMP 구성에서 Koin android 구성을 수집합니다.

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

공유 KMP 구성:

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## iOS에서 주입

> 모든 iOS 앱은 `iosApp` 폴더에 있습니다.

`UserPresenter` 컴포넌트가 생성되어 `UserRepository` 인스턴스를 사용하여 해결됩니다. `ContentView`에 가져오려면 iOS에 대한 Koin 의존성을 검색하는 함수를 만들어야 합니다.

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

이제 iOS 부분에서 `KoinKt.getUserPresenter().sayHello()` 함수를 호출할 수 있습니다.

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

iOS 애플리케이션으로 Koin을 시작해야 합니다. Kotlin 공유 코드에서 `initKoin()` 함수를 사용하여 공유 구성을 사용할 수 있습니다.
마지막으로 iOS 메인 엔트리에서 위의 헬퍼 함수를 호출하는 `KoinAppKt.doInitKoin()` 함수를 호출할 수 있습니다.

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}
```