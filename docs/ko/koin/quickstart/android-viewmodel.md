---
title: Android - ViewModel
---

> 이 튜토리얼에서는 안드로이드 애플리케이션을 작성하고 Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 이 튜토리얼을 마치는 데 약 **10분**이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인하실 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
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

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, Presenter 또는 ViewModel을 사용하여 `MainActivity` 클래스에 이를 표시하는 것입니다.

> Users -> UserRepository -> (Presenter 또는 ViewModel) -> MainActivity

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다: 

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

첫 번째 컴포넌트를 선언해 보겠습니다. `UserRepositoryImpl`의 인스턴스를 생성하여 `UserRepository`의 싱글톤(singleton)을 만들고자 합니다.

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## ViewModel로 사용자 표시하기

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 봅시다:

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`는 `UserViewModel`의 생성자에서 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 메모리에 인스턴스를 유지하지 않도록(안드로이드 생명주기로 인한 누수 방지) `viewModelOf` 정의로 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 안드로이드에서 ViewModel 주입하기

`UserViewModel` 컴포넌트가 생성될 때 `UserRepository` 인스턴스가 함께 해결(resolve)됩니다. 이를 액티비티로 가져오기 위해 `by viewModel()` 위임(delegate) 함수를 사용하여 주입해 보겠습니다: 

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

이제 앱이 준비되었습니다.

:::info
`by viewModel()` 함수를 사용하면 ViewModel 인스턴스를 검색하고, 관련 ViewModel Factory를 생성하며, 이를 생명주기(lifecycle)에 바인딩할 수 있습니다.
:::

## Koin 시작하기

안드로이드 애플리케이션과 함께 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

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

## Koin 모듈: 클래식 또는 생성자 DSL?

우리 앱을 위한 Koin 모듈 선언은 다음과 같습니다:

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

생성자를 사용하여 더 간결한 방식으로 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 앱 검증하기!

단순한 JUnit 테스트를 통해 Koin 구성을 검증함으로써, 앱을 실행하기 전에 Koin 설정이 올바른지 확인할 수 있습니다.

### Gradle 설정

아래와 같이 Koin 안드로이드 테스트 의존성을 추가하세요:

```groovy
// 필요한 경우 저장소에 Maven Central을 추가하세요
repositories {
	mavenCentral()    
}

dependencies {
    
    // 테스트용 Koin
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

JUnit 테스트만으로 정의 구성에서 누락된 것이 없는지 확인할 수 있습니다!