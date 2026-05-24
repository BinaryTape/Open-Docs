---
title: JUnit 테스트
---

> 이 튜토리얼에서는 Kotlin 애플리케이션을 테스트하고 Koin을 사용하여 컴포넌트를 주입(inject) 및 검색(retrieve)하는 방법을 알아봅니다.

:::note
업데이트 - 2025-01-28
:::

## 코드 가져오기

:::info
[소스 코드는 GitHub에서 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle 설정

먼저, 아래와 같이 Koin 의존성을 추가합니다:

```groovy
dependencies {
    // Koin 테스트 도구
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 필요한 JUnit 버전
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 의존성 선언

`koin-core` 시작하기 프로젝트를 재사용하여 koin 모듈을 사용합니다:

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 모듈 검증하기

:::tip
Koin 컴파일러 플러그인은 이제 컴파일 타임 의존성 검증을 제공하여, 테스트 코드를 작성하지 않고도 빌드 타임에 누락된 의존성을 찾아냅니다. [컴파일 타임 안전성(Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety)을 참조하세요.
:::

컴파일러 플러그인을 사용하지 않는 경우, 런타임에 모듈을 검증할 수 있습니다. `verify()` 함수는 모든 의존성이 해결(resolve)될 수 있는지 확인하는 드라이 런(dry-run) 체크를 수행합니다:

```kotlin
class ModuleVerificationTest : AutoCloseKoinTest() {

    @Test
    fun verifyModules() {
        appModule.verify()
    }
}
```

이 테스트는 의존성 정의가 유효하지 않거나 필요한 의존성이 누락된 경우 실패합니다.

## KoinTestRule로 테스트 작성하기

의존성을 주입하는 테스트를 작성하려면, `KoinTest`를 상속받고 `KoinTestRule`을 사용하세요:

```kotlin
class UserAppTest : KoinTest {

    val userService by inject<UserService>()
    val userRepository by inject<UserRepository>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger()
        modules(appModule)
    }

    @Test
    fun `test user service`() {
        // 서비스를 통한 사용자 로드
        userService.loadUsers()

        // 사용자를 찾을 수 있는지 확인
        val user = userService.getUserOrNull("Alice")
        assertNotNull(user)
        assertEquals("Alice", user?.name)
    }
}
```

> KoinTestRule을 사용하여 각 테스트에 대해 Koin 컨텍스트를 시작하고 중지합니다.

## 의존성 모킹(Mocking)

`declareMock`을 사용하여 테스트에서 의존성을 모킹할 수 있습니다. 이는 실제 구현을 모의 객체(mock)로 대체합니다:

```kotlin
class UserMockTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger(Level.DEBUG)
        modules(appModule)
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `mock test`() {
        // UserRepository에 대한 모의 객체 선언
        val repository = declareMock<UserRepository> {
            given(findUserOrNull(anyString())).willReturn(
                User("Mock", "mock@example.com")
            )
        }

        // 모킹된 저장소를 사용하는 애플리케이션 사용
        getKoin().get<UserApplication>().sayHello("Mock")

        // 모의 객체가 호출되었는지 확인
        Mockito.verify(repository, times(1)).findUserOrNull(anyString())
    }
}
```

`MockProviderRule`은 Mockito를 모킹 프레임워크로 설정하며, `declareMock`은 실제 `UserRepository`를 제어된 데이터를 반환하는 모의 객체로 대체합니다.

## 주요 테스트 개념

| 개념 | 설명 |
|---------|-------------|
| `KoinTest` | Koin 테스트 지원을 위해 상속받는 인터페이스 |
| `AutoCloseKoinTest` | 각 테스트 후에 Koin을 자동으로 종료 |
| `KoinTestRule` | Koin 컨텍스트를 시작/중지하는 JUnit 규칙 |
| `MockProviderRule` | 모킹 프레임워크를 설정 |
| `verify()` | 실행하지 않고 모듈 설정을 검증 |
| `declareMock<T>()` | 정의를 모의 객체로 대체 |
| `by inject<T>()` | 테스트에서 의존성을 지연 주입(lazy inject) |

## 참고 항목

- **[테스트 레퍼런스](/docs/reference/koin-test/testing)** - 전체 테스트 문서
- **[모듈 검증](/docs/reference/koin-test/verify)** - verify() 및 checkModules() 상세 내용