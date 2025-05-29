---
title: 안드로이드 & 애노테이션
---

> 이 튜토리얼은 안드로이드 애플리케이션을 작성하고 Koin 의존성 주입을 사용하여 컴포넌트를 검색하는 방법을 설명합니다.
> 이 튜토리얼을 완료하는 데는 __약 10분__이 소요됩니다.

:::note
업데이트 - 2024-10-21
:::

## 코드 가져오기

:::info
[소스 코드는 Github에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle 설정

KSP 플러그인을 다음과 같이 구성하고, 다음 의존성들을 추가해 봅시다:

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// 컴파일 시점 검사
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
현재 버전에 대한 내용은 `libs.versions.toml`을(를) 참조하세요.
:::

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, Presenter 또는 ViewModel을 사용하여 `MainActivity` 클래스에 표시하는 것입니다:

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## "User" 데이터

우리는 사용자 컬렉션을 관리할 것입니다. 데이터 클래스는 다음과 같습니다:

```kotlin
data class User(val name : String)
```

사용자 목록을 관리하기 위한 리포지토리 컴포넌트(사용자 추가 또는 이름으로 사용자 찾기)를 생성합니다. 아래는 `UserRepository` 인터페이스와 해당 구현체입니다:

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

`AppModule` 모듈 클래스를 다음과 같이 선언해 봅시다.

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* 클래스를 Koin 모듈로 선언하기 위해 `@Module`을(를) 사용합니다.
* `@ComponentScan("org.koin.sample")`은(는) `"org.koin.sample"` 패키지 내의 모든 Koin 정의를 스캔할 수 있게 합니다.

`UserRepositoryImpl` 클래스에 `@Single`을(를) 추가하여 싱글톤으로 선언해 봅시다:

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## Presenter를 사용하여 사용자 표시

사용자를 표시하는 Presenter 컴포넌트를 작성해 봅시다:

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository는 UserPresenter의 생성자에서 참조됩니다.

Koin 모듈에 `UserPresenter`를 선언합니다. `@Factory` 애노테이션을 사용하여 이를 `factory` 정의로 선언하는데, 이는 메모리에 인스턴스를 유지하지 않아(안드로이드 라이프사이클에 의한 메모리 누수 방지) 메모리 누수를 방지하기 위함입니다:

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## 안드로이드에서 의존성 주입하기

`UserPresenter` 컴포넌트는 `UserRepository` 인스턴스와 함께 생성됩니다. 이를 Activity에 가져오려면, `by inject()` 델리게이트 함수를 사용하여 주입해 봅시다:

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
`by inject()` 함수는 안드로이드 컴포넌트 런타임(Activity, fragment, Service 등)에서 Koin 인스턴스를 검색할 수 있게 해줍니다.
:::

## Koin 시작하기

안드로이드 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 주요 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

```kotlin
// 생성됨
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

Koin 모듈은 `.module` 확장 함수를 사용하여 `AppModule`에서 생성됩니다. 애노테이션에서 Koin 모듈을 얻으려면 `AppModule().module` 표현식을 사용하기만 하면 됩니다.

:::info
생성된 Koin 모듈 콘텐츠를 사용하려면 `import org.koin.ksp.generated.*` 임포트가 필요합니다.
:::

## ViewModel을 사용하여 사용자 표시

사용자를 표시하는 ViewModel 컴포넌트를 작성해 봅시다:

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

`UserViewModel`은 `@KoinViewModel` 애노테이션으로 태그되어 Koin ViewModel 정의를 선언합니다. 이는 메모리에 인스턴스를 유지하지 않아(안드로이드 라이프사이클에 의한 메모리 누수 방지) 메모리 누수를 방지하기 위함입니다.

## 안드로이드에서 ViewModel 주입하기

`UserViewModel` 컴포넌트는 `UserRepository` 인스턴스와 함께 생성됩니다. 이를 Activity에 가져오려면, `by viewModel()` 델리게이트 함수를 사용하여 주입해 봅시다:

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## 컴파일 시점 검사

Koin 애노테이션은 컴파일 시점에 Koin 구성을 확인할 수 있게 해줍니다. 이는 다음 Gradle 옵션을 사용하여 가능합니다:

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## 앱 검증하기!

앱을 실행하기 전에 간단한 JUnit 테스트로 Koin 구성을 검증하여 Koin 구성이 올바른지 확인할 수 있습니다.

### Gradle 설정

아래와 같이 Koin 안드로이드 의존성을 추가하세요:

```groovy
// 필요한 경우 Maven Central을(를) 리포지토리에 추가하세요.
repositories {
	mavenCentral()    
}

dependencies {
    
    // 테스트용 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 모듈 확인하기

`androidVerify()` 함수는 주어진 Koin 모듈을 검증할 수 있게 해줍니다:

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

단 하나의 JUnit 테스트로 정의 구성에 누락된 것이 없는지 확인할 수 있습니다!