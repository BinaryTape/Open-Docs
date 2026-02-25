---
title: Koin Annotations 시작하기
---

Koin Annotations 프로젝트의 목표는 Koin 정의(definitions)를 빠르고 직관적인 방식으로 선언할 수 있도록 돕고, 모든 기반 Koin DSL을 자동으로 생성하는 것입니다. Kotlin 컴파일러를 통해 개발자가 서비스 규모를 확장하고 빠르게 개발(go fast 🚀)할 수 있도록 돕는 것이 이 프로젝트의 목적입니다.

## 시작하기

Koin이 처음이신가요? 먼저 [Koin 시작하기](https://insert-koin.io/docs/quickstart/kotlin/)를 살펴보세요.

컴포넌트에 정의 및 모듈 어노테이션을 추가하고, 일반적인 Koin API를 사용하세요.

```kotlin
// 컴포넌트에 태그를 지정하여 정의를 선언합니다
@Single
class MyComponent
```

### 기본 모듈 설정

```kotlin
// 모듈을 선언하고 어노테이션을 스캔합니다
@Module
class MyModule
```

이제 `@KoinApplication`을 사용하여 Koin 애플리케이션을 시작하고 사용할 모듈을 명시적으로 지정할 수 있습니다:

```kotlin
// 아래의 import를 통해 생성된 확장 함수들에 접근할 수 있습니다
// 예: MyModule.module 및 MyApp.startKoin() 
import org.koin.ksp.generated.*

@KoinApplication(modules = [MyModule::class])
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 일반적인 Koin API를 그대로 사용합니다
    KoinPlatform.getKoin().get<MyComponent>()
}
```

### 구성(Configuration) 기반 모듈 설정

또는 `@Configuration`을 사용하여 자동으로 로드되는 모듈을 생성할 수 있습니다:

```kotlin
// 구성을 포함한 모듈 - 기본 설정에 자동으로 포함됩니다
@Module
@Configuration
class MyModule
```

구성(configuration) 방식을 사용하면 모듈을 명시적으로 지정할 필요가 없습니다:

```kotlin
// 아래의 import를 통해 생성된 확장 함수들에 접근할 수 있습니다
// 이 방식은 @Configuration으로 표시된 모든 모듈을 자동으로 로드합니다
import org.koin.ksp.generated.*

@KoinApplication
object MyApp

fun main() {
    MyApp.startKoin {
        printLogger()
    }

    // 일반적인 Koin API를 그대로 사용합니다
    KoinPlatform.getKoin().get<MyComponent>()
}
```

이제 [일반 Koin API](https://insert-koin.io/docs/reference/introduction)를 사용하여 Koin에서 새로운 정의들을 사용할 수 있습니다.

## KSP 옵션

Koin 컴파일러는 몇 가지 구성 옵션을 제공합니다. 공식 문서를 따라 프로젝트에 다음 옵션들을 추가할 수 있습니다: [KSP 퀵스타트 문서](https://kotlinlang.org/docs/ksp-quickstart.html#pass-options-to-processors)

### 컴파일 안전성(Compile Safety) - 컴파일 시점에 Koin 구성 확인 (1.3.0부터 지원)

Koin Annotations를 사용하면 컴파일러 플러그인이 컴파일 시점에 Koin 구성을 검증할 수 있습니다. Gradle 모듈에 다음 KSP 옵션을 추가하여 활성화할 수 있습니다:

```groovy
// build.gradle 또는 build.gradle.kts에서

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

컴파일러는 구성에 사용된 모든 의존성이 선언되었는지, 사용된 모든 모듈에 접근 가능한지 확인합니다.

### @Provided를 사용한 컴파일 안전성 우회 (1.4.0부터 지원)

컴파일러에서 무시되는 타입(Android 공통 타입 등) 외에도, 컴파일러 플러그인은 컴파일 시점에 Koin 구성을 검증할 수 있습니다. 특정 파라미터를 검사에서 제외하려면 해당 파라미터에 `@Provided`를 사용하여 이 타입이 현재 Koin Annotations 구성 외부에서 제공됨을 나타낼 수 있습니다.

다음은 `MyProvidedComponent`가 이미 Koin에 선언되어 있음을 나타냅니다:

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 기본 모듈 (1.3.0부터 사용 중단)

:::warning
기본 모듈(default module) 방식은 Annotations 1.3.0 버전부터 더 이상 사용되지 않습니다(deprecated). 더 나은 구조와 명확성을 위해 `@Module` 및 `@Configuration` 어노테이션이 있는 명시적 모듈을 사용하는 것을 권장합니다.
:::

이전에는 Koin 컴파일러가 모듈에 바인딩되지 않은 모든 정의를 감지하여 "기본 모듈(default module)"에 넣었습니다. 이 방식은 이제 `@Configuration` 및 `@KoinApplication` 어노테이션을 사용하는 방식으로 대체되어 더 이상 권장되지 않습니다.

**사용 중단된 방식** (사용 자제):
```groovy
// build.gradle 또는 build.gradle.kts에서

ksp {
    arg("KOIN_DEFAULT_MODULE","true")
}
```

**권장 방식**: 위 예제들에서 보여준 것처럼 `@Configuration` 및 `@KoinApplication`을 사용한 명시적 모듈 구조를 사용하세요.

### Kotlin KMP 설정

공식 문서에 설명된 대로 KSP 설정을 따라주세요: [KSP와 Kotlin 멀티플랫폼](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotations의 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트도 확인해 보실 수 있습니다.

### Pro-Guard

Koin Annotations 애플리케이션을 SDK로 포함하려는 경우, 다음 Pro-Guard 규칙을 확인하세요:

```
# 어노테이션 정의 유지
-keep class org.koin.core.annotation.** { *; }

# Koin 어노테이션이 지정된 클래스 유지
-keep @org.koin.core.annotation.* class * { *; }