---
title: Android - ViewModel
---

> 이 튜토리얼에서는 Android 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 가져오는 방법을 설명합니다.
> 이 튜토리얼을 완료하는 데 약 __10분__이 소요됩니다.

:::note
update - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다.](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 설정

아래와 같이 Koin Android 의존성을 추가합니다:

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, `MainActivity` 클래스에서 Presenter 또는 ViewModel을 사용하여 이를 표시하는 것입니다:

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## "사용자" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하기 위해 ("사용자 추가" 또는 "이름으로 사용자 찾기") "Repository" 컴포넌트를 생성합니다. 다음은 `UserRepository` 인터페이스와 해당 구현입니다:

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
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## ViewModel로 사용자 표시하기

사용자를 표시하는 ViewModel 컴포넌트를 작성해 봅시다:

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`는 `UserViewModel`의 생성자에서 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 인스턴스를 메모리에 유지하지 않도록 (Android 라이프사이클에서 메모리 누수를 방지하기 위해) `viewModelOf` 정의로 선언합니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## Android에서 ViewModel 주입하기

`UserViewModel` 컴포넌트가 생성되면 `UserRepository` 인스턴스도 함께 해결됩니다. Activity에서 이를 사용하려면 `by viewModel()` 델리게이트 함수를 사용하여 주입해 봅시다:

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
`by viewModel()` 함수를 사용하면 ViewModel 인스턴스를 가져오고, 해당 ViewModel Factory를 생성하여 라이프사이클에 바인딩할 수 있습니다.
:::

## Koin 시작하기

Android 애플리케이션과 함께 Koin을 시작해야 합니다. 애플리케이션의 주 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

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
`startKoin`의 `modules()` 함수는 주어진 모듈 목록을 로드합니다.
:::

## Koin 모듈: classic 또는 constructor DSL?

다음은 우리 앱의 Koin 모듈 선언입니다:

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

생성자를 사용하여 더 간결하게 작성할 수 있습니다:

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 앱 검증하기!

앱을 실행하기 전에 Koin 구성이 올바른지 확인할 수 있습니다. 간단한 JUnit 테스트로 Koin 구성을 검증하는 방식입니다.

### Gradle 설정

아래와 같이 Koin Android 의존성을 추가합니다:

```groovy
// Add Maven Central to your repositories if needed
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 확인하기

`verify()` 함수는 주어진 Koin 모듈을 검증할 수 있도록 합니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

단 하나의 JUnit 테스트만으로도 정의 구성에 누락된 부분이 없는지 확인할 수 있습니다!