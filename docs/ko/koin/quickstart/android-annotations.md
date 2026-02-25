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

> Users -> UserRepository -> (Presenter 또는 ViewModel) -> MainActivity

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다.

```kotlin
data class User(val name : String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 찾기)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다.

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

아래와 같이 `AppModule` 모듈 클래스를 선언해 봅시다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 클래스를 Koin 모듈로 선언하기 위해 `@Module`을 사용합니다.
* `@ComponentScan("org.koin.sample")`은 `"org.koin.sample"` 패키지에 있는 모든 Koin 정의를 스캔할 수 있게 해줍니다.

`UserRepositoryImpl` 클래스를 싱글톤(singleton)으로 선언하기 위해 `@Single`을 추가하기만 하면 됩니다.

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## Presenter로 사용자 표시하기

사용자를 표시하기 위한 Presenter 컴포넌트를 작성해 봅시다.

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserPresenter의 생성자에서 참조됩니다.

Koin 모듈에 `UserPresenter`를 선언합니다. 메모리에 인스턴스를 유지하지 않도록(안드로이드 생명주기에 따른 누수 방지) `@Factory` 어노테이션을 사용하여 `factory` 정의로 선언합니다.

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## Android에서 의존성 주입하기

`UserPresenter` 컴포넌트가 생성될 때 `UserRepository` 인스턴스를 함께 해결(resolve)합니다. 이를 Activity에서 가져오기 위해 `by inject()` 위임 함수를 사용하여 주입해 봅시다.

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

안드로이드 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 메인 엔트리 포인트인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다.

```kotlin
// generated
import org.koin.ksp.generated.*

class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(AppModule().module)
        }
    }
}
```

Koin 모듈은 `.module` 확장을 통해 `AppModule`에서 생성됩니다. `AppModule().module` 표현식을 사용하여 어노테이션으로부터 Koin 모듈을 가져옵니다.

:::info
생성된 Koin 모듈 콘텐츠를 사용하려면 `import org.koin.ksp.generated.*` 임포트가 필요합니다.
:::

## ViewModel로 사용자 표시하기

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 봅시다.

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserViewModel의 생성자에서 참조됩니다.

`UserViewModel`에는 `@KoinViewModel` 어노테이션을 붙여 Koin ViewModel 정의로 선언하며, 메모리에 인스턴스를 유지하지 않도록 합니다(안드로이드 생명주기에 따른 누수 방지).

## Android에서 ViewModel 주입하기

`UserViewModel` 컴포넌트가 생성될 때 `UserRepository` 인스턴스를 함께 해결합니다. 이를 Activity에서 가져오기 위해 `by viewModel()` 위임 함수를 사용하여 주입해 봅시다.

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

## 앱 검증하기!

간단한 JUnit 테스트를 통해 Koin 설정을 검증함으로써, 앱을 실행하기 전에 Koin 설정이 올바른지 확인할 수 있습니다.

### Gradle 설정

다음과 같이 Koin Android 의존성을 추가합니다.

```groovy
// 필요한 경우 리포지토리에 Maven Central을 추가하세요.
repositories {
	mavenCentral()    
}

dependencies {
    
    // 테스트용 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 체크하기

`androidVerify()` 함수를 사용하면 주어진 Koin 모듈을 검증할 수 있습니다.

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

JUnit 테스트만으로 정의된 설정에 누락된 것이 없는지 확인할 수 있습니다!