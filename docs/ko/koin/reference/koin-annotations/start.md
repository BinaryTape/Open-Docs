---
title: Koin Annotations 시작하기
---

Koin Annotations 프로젝트의 목표는 Koin 정의를 빠르고 직관적인 방식으로 선언하고, 모든 기저 Koin DSL을 자동으로 생성하는 데 도움을 주는 것입니다. Kotlin 컴파일러 덕분에 개발자들이 확장을 경험하고 빠르게 나아갈 수 있도록 돕는 것이 목표입니다 🚀.

## 시작하기

Koin에 익숙하지 않으신가요? 먼저 [Koin 시작하기](https://insert-koin.io/docs/quickstart/kotlin/)를 살펴보세요.

컴포넌트에 정의 및 모듈 애너테이션을 태그하고, 일반 Koin API를 사용하세요.

```kotlin
// 컴포넌트에 태그를 지정하여 정의를 선언합니다.
@Single
class MyComponent
```

### 기본 모듈 설정

```kotlin
// 모듈을 선언하고 애너테이션을 스캔합니다.
@Module
class MyModule
```

이제 `@KoinApplication`을 사용하여 Koin 애플리케이션을 시작하고 사용할 모듈을 명시적으로 지정할 수 있습니다:

```kotlin
// 아래 임포트는 생성된 확장 함수에 접근할 수 있도록 해줍니다
// MyModule.module 및 MyApp.startKoin()와 같은
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 평소처럼 Koin API를 사용하면 됩니다.
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 구성 기반 모듈 설정

또는 `@Configuration`을 사용하여 자동으로 로드되는 모듈을 생성할 수 있습니다:

```kotlin
// 구성이 있는 모듈 - 기본 구성에 자동으로 포함됩니다
@Module
@Configuration
class MyModule
```

구성을 사용하면 모듈을 명시적으로 지정할 필요가 없습니다:

```kotlin
// 아래 임포트는 생성된 확장 함수에 접근할 수 있도록 해줍니다
// 이 접근 방식은 @Configuration으로 표시된 모든 모듈을 자동으로 로드합니다
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 평소처럼 Koin API를 사용하면 됩니다.
    KoinPlatform.getKoin().get<MyComponent>()
}
```

이게 전부입니다. [일반 Koin API](https://insert-koin.io/docs/reference/introduction)를 사용하여 Koin에서 새로운 정의를 사용할 수 있습니다.

## KSP 옵션

Koin 컴파일러는 몇 가지 구성 옵션을 제공합니다. 공식 문서에 따라 프로젝트에 다음 옵션을 추가할 수 있습니다: [Ksp Quickstart Doc](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 컴파일 안정성 - 컴파일 시점에 Koin 구성 확인 (1.3.0 버전부터)

Koin Annotations를 사용하면 컴파일러 플러그인이 컴파일 시점에 Koin 구성을 검증할 수 있습니다. 이 기능은 Gradle 모듈에 추가할 다음 Ksp 옵션으로 활성화할 수 있습니다:

```groovy
// build.gradle 또는 build.gradle.kts 파일에서

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

컴파일러는 구성에 사용된 모든 의존성이 선언되었는지, 그리고 사용된 모든 모듈에 접근 가능한지 확인합니다.

### @Provided를 사용하여 컴파일 안정성 우회하기 (1.4.0 버전부터)

컴파일러가 무시하는 타입(Android 공통 타입 등) 외에도, 컴파일러 플러그인은 컴파일 시점에 Koin 구성을 검증할 수 있습니다. 매개변수를 검사 대상에서 제외하고 싶다면, 해당 타입이 현재 Koin Annotations 구성에 외부에서 제공된다는 것을 나타내기 위해 매개변수에 `@Provided`를 사용할 수 있습니다.

다음은 `MyProvidedComponent`가 Koin에 이미 선언되어 있다는 것을 나타냅니다:

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 기본 모듈 (1.3.0 버전부터 사용 중단됨)

:::warning
기본 모듈 접근 방식은 Annotations 1.3.0부터 사용 중단되었습니다. 더 나은 구성과 명확성을 위해 `@Module` 및 `@Configuration` 애너테이션을 사용하여 명시적인 모듈을 사용하는 것을 권장합니다.
:::

이전에는 Koin 컴파일러가 모듈에 바인딩되지 않은 모든 정의를 감지하여 "기본 모듈"에 포함시켰습니다. 이 접근 방식은 이제 `@Configuration` 및 `@KoinApplication` 애너테이션을 사용하는 방식으로 사용 중단되었습니다.

**사용 중단된 접근 방식** (사용 자제):
```groovy
// build.gradle 또는 build.gradle.kts 파일에서

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**권장되는 접근 방식**: 위 예시에서 `@Configuration` 및 `@KoinApplication`을 사용하여 보여진 것처럼 명시적인 모듈 구성을 사용하세요.

### Kotlin KMP 설정

공식 문서에 설명된 대로 KSP 설정을 따르세요: [KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotations의 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트도 확인할 수 있습니다.

### Pro-Guard

Koin Annotations 애플리케이션을 SDK로 임베드하려는 경우, 다음 Pro-Guard 규칙을 살펴보세요:

```
# 애너테이션 정의 유지
-keep class org.koin.core.annotation.** { *; }

# Koin 애너테이션이 붙은 클래스 유지
-keep @org.koin.core.annotation.* class * { *; }
```