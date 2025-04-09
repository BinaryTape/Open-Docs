---
title: "Android Instrumented Testing"
---
## 사용자 정의 Application 클래스에서 프로덕션 모듈 오버라이드하기

각 테스트 클래스에서 효과적으로 Koin을 시작하는 [유닛 테스트](/reference/koin-test/testing.md) (예: `startKoin` 또는 `KoinTestExtension`)와 달리, Instrumented 테스트에서는 Koin이 `Application` 클래스에 의해 시작됩니다.

프로덕션 Koin 모듈을 오버라이드하기 위해 `loadModules` 및 `unloadModules`는 변경 사항이 즉시 적용되지 않기 때문에 종종 안전하지 않습니다. 대신, 권장되는 방법은 `Application` 클래스에서 `startKoin`이 사용하는 `modules`에 오버라이드 `module`을 추가하는 것입니다. 애플리케이션의 `Application`을 확장하는 클래스를 변경하지 않고 유지하려면 다음과 같이 `AndroidTest` 패키지 내부에 다른 클래스를 만들 수 있습니다.
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
Instrumentation 테스트에서 이 사용자 정의 `Application`을 사용하려면 다음과 같은 사용자 정의 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)를 만들어야 할 수 있습니다.
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
그런 다음 gradle 파일 내부에 다음과 같이 등록합니다.
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 테스트 규칙으로 프로덕션 모듈 오버라이드하기

더 많은 유연성을 원하면 사용자 정의 `AndroidJUnitRunner`를 계속 만들어야 하지만 사용자 정의 애플리케이션 내부에 `startKoin { ... }`를 사용하는 대신 다음과 같은 사용자 정의 테스트 규칙 내부에 넣을 수 있습니다.
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
이러한 방식으로 다음과 같이 테스트 클래스에서 직접 정의를 오버라이드할 수 있습니다.
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```