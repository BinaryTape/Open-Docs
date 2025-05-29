---
title: Koin Annotations 시작하기
---

Koin Annotations 프로젝트의 목표는 Koin 정의를 매우 빠르고 직관적인 방식으로 선언하고, 기저의 모든 Koin DSL을 자동으로 생성하는 것입니다. 이 목표는 Kotlin 컴파일러 덕분에 개발자 경험을 확장하고 빠르게 진행할 수 있도록 돕는 것입니다 🚀.

## 시작하기

Koin에 익숙하지 않으신가요? 먼저 [Koin 시작하기](https://insert-koin.io/docs/quickstart/kotlin)를 살펴보세요.

컴포넌트에 정의 및 모듈 애너테이션을 태그하고, 일반 Koin API를 사용하세요.

```kotlin
// 컴포넌트에 태그를 지정하여 정의를 선언합니다.
@Single
class MyComponent
```

```kotlin
// 모듈을 선언하고 애너테이션을 스캔합니다.
@Module
@ComponentScan
class MyModule
```

생성된 코드를 사용하려면 `org.koin.ksp.generated.*` 임포트를 다음과 같이 사용하세요:

```kotlin
// Koin 생성 기능을 사용합니다.
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 여기서 생성된 ".module" 확장 프로퍼티가 있는 모듈 클래스를 사용합니다.
          MyModule().module
        )
    }

    // 평소처럼 Koin API를 사용하면 됩니다.
    koin.get<MyComponent>()
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

### 기본 모듈 비활성화 (1.3.0 버전부터)

기본적으로 Koin 컴파일러는 모듈에 바인딩되지 않은 모든 정의를 감지하여 프로젝트 루트에 생성되는 "기본 모듈(default module)"에 포함시킵니다. 다음 옵션을 사용하여 기본 모듈의 사용 및 생성을 비활성화할 수 있습니다:

```groovy
// build.gradle 또는 build.gradle.kts 파일에서

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 설정

공식 문서에 설명된 대로 KSP 설정을 따르세요: [KSP with Kotlin Multiplatform](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotations의 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트도 확인할 수 있습니다.