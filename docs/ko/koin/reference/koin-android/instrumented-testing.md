---
title: Android 계측 테스트
---

## 커스텀 Application 클래스에서 프로덕션 모듈 재정의

[유닛 테스트](/docs/reference/koin-test/testing.md)와 달리(각 테스트 클래스에서 `startKoin` 또는 `KoinTestExtension`을 호출하여 Koin을 시작하는 방식) 계측 테스트(Instrumented tests)에서는 Koin이 `Application` 클래스에 의해 시작됩니다.

프로덕션 Koin 모듈을 재정의하는 경우, `loadModules`와 `unloadModules`는 변경 사항이 즉시 적용되지 않기 때문에 종종 안전하지 않습니다. 대신 권장되는 접근 방식은 `Application` 클래스에서 `startKoin`이 사용하는 `modules`에 재정의할 `module`을 추가하는 것입니다.
애플리케이션의 `Application`을 확장하는 클래스를 그대로 유지하고 싶다면, `AndroidTest` 패키지 안에 다음과 같이 다른 클래스를 생성할 수 있습니다:
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
그런 다음 Gradle 파일에 다음과 같이 등록합니다:
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 테스트 규칙을 사용하여 프로덕션 모듈 재정의

더 많은 유연성을 원한다면, 여전히 커스텀 `AndroidJUnitRunner`를 생성해야 하지만 커스텀 애플리케이션 내에 `startKoin { ... }`을 두는 대신 다음과 같이 커스텀 테스트 규칙 안에 넣을 수 있습니다:
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
이러한 방식으로 다음과 같이 테스트 클래스에서 직접 정의를 재정의할 수 있습니다:
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)