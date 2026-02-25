---
title: 안드로이드(Android)
---

> 이 튜토리얼에서는 안드로이드 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 튜토리얼을 완료하는 데 약 **10분** 정도 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다.](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 설정

아래와 같이 Koin 안드로이드 의존성을 추가하세요:

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 애플리케이션 개요

이 애플리케이션은 사용자 목록을 관리하고, `MainActivity` 클래스에서 Presenter 또는 ViewModel과 함께 이를 표시하는 구조입니다.

> Users -> UserRepository -> (Presenter 또는 ViewModel) -> MainActivity

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다: 

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

## Koin 모듈

Koin 모듈을 선언하려면 `module` 함수를 사용하세요. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 장소입니다.

```kotlin
val appModule = module {
    
}
```

첫 번째 컴포넌트를 선언해 봅시다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 만들고자 합니다.

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## Presenter로 사용자 표시하기

사용자를 표시하기 위한 presenter 컴포넌트를 작성해 봅시다:

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`는 `UserPresenter`의 생성자에서 참조됩니다.

Koin 모듈에 `UserPresenter`를 선언합니다. 메모리에 인스턴스를 유지하지 않도록(안드로이드 생명주기에 따른 메모리 누수 방지) `factoryOf` 정의로 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()` 함수를 사용하면 Koin이 필요한 의존성을 해결(resolve)하도록 요청할 수 있습니다.

## 안드로이드에서 의존성 주입하기

`UserPresenter` 컴포넌트가 생성되면서 `UserRepository` 인스턴스가 함께 해결됩니다. 이를 Activity에서 가져오기 위해 `by inject()` 대리자(delegate) 함수를 사용하여 주입해 보겠습니다: 

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

이제 앱 준비가 완료되었습니다.

:::info
`by inject()` 함수를 사용하면 안드로이드 컴포넌트 런타임(Activity, Fragment, Service 등)에서 Koin 인스턴스를 검색할 수 있습니다.
:::

## Koin 시작하기

안드로이드 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하면 됩니다:

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin` 내부의 `modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## Koin 모듈: 클래식 방식 또는 생성자 DSL 방식?

우리 앱을 위한 Koin 모듈 선언은 다음과 같습니다:

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

생성자를 사용하면 더 간결하게 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## 앱 검증하기!

단순한 JUnit 테스트로 Koin 구성을 확인하여 앱을 실행하기 전에 Koin 설정이 올바른지 확인할 수 있습니다.

### Gradle 설정

아래와 같이 Koin 안드로이드 테스트 의존성을 추가하세요:

```groovy
// 필요한 경우 repositories에 Maven Central을 추가하세요.
repositories {
	mavenCentral()    
}

dependencies {
    
    // 테스트를 위한 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 확인하기

`verify()` 함수를 사용하면 주어진 Koin 모듈을 검증할 수 있습니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

단순한 JUnit 테스트만으로 정의된 구성에 누락된 것이 없는지 확인할 수 있습니다!