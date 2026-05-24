---
title: Android & 어노테이션
---

> 이 튜토리얼에서는 안드로이드 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 튜토리얼을 완료하는 데 약 __10분__이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 설정

다음과 같이 KSP 플러그인과 의존성을 설정합니다.

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 컴파일 타임 체크
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
현재 버전은 `libs.versions.toml`을 참조하세요.
:::

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, Presenter 또는 ViewModel을 사용하여 `MainActivity` 클래스에 표시하는 것입니다.

> Users -> UserRepository -> UserService -> (Presenter 또는 ViewModel) -> MainActivity

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다.

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 찾기)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다.

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

## UserService 컴포넌트

사용자 작업을 관리하기 위한 서비스 컴포넌트를 작성해 봅시다.

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

    init {
        loadUsers()
    }

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

## Koin 모듈

아래와 같이 `AppModule` 모듈 클래스를 선언해 봅시다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 이 클래스를 Koin 모듈로 선언합니다.
* `@ComponentScan("org.koin.sample")` - `"org.koin.sample"` 패키지에 있는 모든 Koin 정의를 자동으로 스캔하고 등록합니다.
* `@Configuration` - `@KoinApplication`과 함께 사용될 때 자동 모듈 검색을 활성화합니다.

컴포넌트 스캔이 활성화되었으므로, 클래스에 어노테이션을 추가하기만 하면 됩니다.

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService {
    // ...
}
```

`@Singleton` 어노테이션은 이 클래스들을 Koin의 싱글톤으로 선언합니다.

## Presenter로 사용자 표시하기

사용자를 표시하기 위한 Presenter 컴포넌트를 작성해 봅시다.

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> UserService는 UserPresenter의 생성자에서 참조됩니다.

`UserPresenter`를 요청할 때마다 새로운 인스턴스를 생성하도록(안드로이드 생명주기에 따른 메모리 누수 방지) `@Factory` 어노테이션으로 선언합니다.

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {
    // ...
}
```

## Android에서 의존성 주입하기

`UserPresenter` 컴포넌트가 생성될 때 `UserService` 인스턴스를 함께 해결(resolve)합니다. 이를 Activity에서 가져오기 위해 `by inject()` 위임 함수를 사용하여 주입해 봅시다.

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

이제 앱이 준비되었습니다.

:::info
`by inject()` 함수를 사용하면 안드로이드 컴포넌트 런타임(Activity, fragment, Service 등)에서 Koin 인스턴스를 가져올 수 있습니다.
:::

## Koin 시작하기

안드로이드 애플리케이션에서 Koin을 시작해야 합니다. `@KoinApplication` 어노테이션을 사용하면 Koin은 `@Configuration`이 표시된 모든 모듈을 자동으로 검색하고 로드합니다.

```kotlin
import org.koin.android.ext.koin.androidContext
import org.koin.core.annotation.KoinApplication
import org.koin.ksp.generated.*

@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MainApplication)
        }
    }
}
```

**주요 포인트:**
* `@KoinApplication` - `@Module` 및 `@Configuration` 어노테이션이 붙은 모든 모듈을 자동으로 검색합니다.
* `modules(AppModule().module)`을 수동으로 호출할 필요가 없습니다 - 모듈이 자동으로 로드됩니다!
* 생성된 Koin 콘텐츠를 사용하려면 `import org.koin.ksp.generated.*` 임포트가 필요합니다.
* `androidContext`와 같은 안드로이드 전용 설정만 구성하면 됩니다.

:::info
`@KoinApplication` 어노테이션은 모듈의 `@Configuration`과 함께 작동하여 KSP를 통해 컴파일 타임에 모든 의존성을 자동으로 검색하고 로드합니다.
:::

## ViewModel로 사용자 표시하기

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 봅시다.

```kotlin
@KoinViewModel
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> UserService는 UserViewModel의 생성자에서 참조됩니다.

`UserViewModel`에는 `@KoinViewModel` 어노테이션을 붙여 Koin ViewModel 정의로 선언합니다. 이는 적절한 생명주기 관리를 보장하고 메모리 누수를 방지합니다.

## Android에서 ViewModel 주입하기

`UserViewModel` 컴포넌트가 생성될 때 `UserService` 인스턴스를 함께 해결합니다. 이를 Activity에서 가져오기 위해 `by viewModel()` 위임 함수를 사용하여 주입해 봅시다.

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 컴파일 타임 체크

Koin 어노테이션을 사용하면 컴파일 타임에 Koin 설정을 확인할 수 있습니다. 다음 Gradle 옵션을 사용하여 이 기능을 사용할 수 있습니다.

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::tip
이 KSP 기반 옵션은 네이티브 컴파일 타임 안정성을 제공하는 **Koin Compiler Plugin**으로 대체되었습니다. [Compile-Time Safety](/docs/reference/koin-compiler/compile-safety) 및 [Compiler Plugin Setup](/docs/setup/compiler-plugin)을 참조하세요.
:::