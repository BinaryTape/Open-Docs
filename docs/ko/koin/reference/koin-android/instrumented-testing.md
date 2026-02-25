---
title: 안드로이드 계측 테스트
---

## 커스텀 Application 클래스에서 프로덕션 모듈 오버라이드하기

각 테스트 클래스에서 `startKoin` 또는 `KoinTestExtension`을 호출하여 실제로 Koin을 시작하는 [단위 테스트(unit tests)](/docs/reference/koin-test/testing.md)와 달리, 계측 테스트(Instrumented tests)에서 Koin은 `Application` 클래스에 의해 시작됩니다.

프로덕션 Koin 모듈을 오버라이드할 때 `loadModules` 및 `unloadModules`는 변경 사항이 즉시 적용되지 않을 수 있어 안전하지 않은 경우가 많습니다. 대신, `Application` 클래스의 `startKoin`에서 사용하는 `modules`에 오버라이드할 `module`을 추가하는 방식이 권장됩니다.
기존 애플리케이션의 `Application` 확장 클래스를 수정하지 않으려면, 다음과 같이 `AndroidTest` 패키지 안에 별도의 클래스를 생성할 수 있습니다:

```kotlin
class TestApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(productionModule, instrumentedTestModule)
        }
    }
}
```

계측 테스트에서 이 커스텀 `Application`을 사용하려면 다음과 같이 커스텀 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)를 생성해야 할 수도 있습니다:

```kotlin
class InstrumentationTestRunner : AndroidJUnitRunner() {
    override fun newApplication(
        classLoader: ClassLoader?,
        className: String?,
        context: Context?
    ): Application {
        return super.newApplication(classLoader, TestApplication::class.java.name, context)
    }
}
```

그런 다음 gradle 파일 내에 다음과 같이 등록합니다:

```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 테스트 규칙(test rule)으로 프로덕션 모듈 오버라이드하기

더 많은 유연성이 필요한 경우, 여전히 커스텀 `AndroidJUnitRunner`를 생성해야 하지만 커스텀 애플리케이션 내부에 `startKoin { ... }`을 두는 대신 다음과 같이 커스텀 테스트 규칙 내부에 둘 수 있습니다:

```kotlin
class KoinTestRule(
    private val modules: List<Module>
) : TestWatcher() {
    override fun starting(description: Description) {

        if (getKoinApplicationOrNull() == null) {
            startKoin {
                androidContext(InstrumentationRegistry.getInstrumentation().targetContext.applicationContext)
                modules(modules)
            }
        } else {
            loadKoinModules(modules)
        }
    }

    override fun finished(description: Description) {
        unloadKoinModules(modules)
    }
}
```

이 방식을 사용하면 다음과 같이 테스트 클래스에서 직접 정의(definition)를 오버라이드할 수 있습니다:

```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)