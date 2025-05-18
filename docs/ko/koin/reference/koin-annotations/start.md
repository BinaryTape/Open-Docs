---
title: "Koin 어노테이션으로 시작하기"
---
Koin Annotations 프로젝트의 목표는 Koin 정의를 매우 빠르고 직관적인 방식으로 선언하고, 모든 기반 Koin DSL을 생성하는 데 도움을 주는 것입니다. Kotlin 컴파일러 덕분에 개발자 경험을 확장하고 빠르게 진행할 수 있도록 돕는 것이 목표입니다 🚀.

## 시작하기

Koin에 익숙하지 않으신가요? 먼저 [Koin 시작하기](https://insert-koin.io/docs/quickstart/kotlin)를 살펴보세요.

정의 (definition) 및 모듈 (module) 어노테이션으로 컴포넌트에 태그를 지정하고, 일반적인 Koin API를 사용하세요.

```kotlin
// 정의를 선언하기 위해 컴포넌트에 태그 지정
@Single
class MyComponent
```

```kotlin
// 모듈을 선언하고 어노테이션을 검색
@Module
@ComponentScan
class MyModule
```

생성된 코드를 사용하려면 다음과 같이 `org.koin.ksp.generated.*` 임포트 (import)를 사용하세요.

```kotlin
// Koin 생성 사용
import org.koin.ksp.generated.*

fun main() {
    val koin = startKoin {
        printLogger()
        modules(
          // 여기에 모듈을 사용하고, Module 클래스에서 생성된 ".module" 확장자를 사용합니다.
          MyModule().module
        )
    }

    // 일반적인 Koin API처럼 사용하세요.
    koin.get<MyComponent>()
}
```

이제 [일반적인 Koin API](https://insert-koin.io/docs/reference/introduction)를 사용하여 Koin에서 새로운 정의를 사용할 수 있습니다.

## KSP 옵션

Koin 컴파일러는 구성할 수 있는 몇 가지 옵션을 제공합니다. 공식 문서에 따라 프로젝트에 다음 옵션을 추가할 수 있습니다. [Ksp 빠른 시작 문서](https://kotlinlang.org/docs/ksp-quickstart.html)

### 컴파일 안전성 - 컴파일 시 Koin 구성 확인 (1.3.0부터)

Koin Annotations는 컴파일러 플러그인이 컴파일 시 Koin 구성을 확인할 수 있도록 합니다. Gradle 모듈에 추가할 다음 Ksp 옵션을 사용하여 활성화할 수 있습니다.

```groovy
// build.gradle 또는 build.gradle.kts에서

ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

컴파일러는 구성에 사용된 모든 종속성이 선언되었는지, 사용된 모든 모듈에 접근할 수 있는지 확인합니다.

### @Provided를 사용하여 컴파일 안전성 우회 (1.4.0부터)

컴파일러에서 무시되는 유형 (Android 공통 유형) 중에서 컴파일러 플러그인은 컴파일 시 Koin 구성을 확인할 수 있습니다. 확인하지 않으려는 매개변수를 제외하려면 매개변수에 `@Provided`를 사용하여 이 유형이 현재 Koin Annotations 구성에 외부적으로 제공됨을 나타낼 수 있습니다.

다음은 `MyProvidedComponent`가 Koin에 이미 선언되었음을 나타냅니다.

```kotlin
class MyProvidedComponent

@Factory
class MyPresenter(@Provided val provided : MyProvidedComponent)
```

### 기본 모듈 비활성화 (1.3.0부터)

기본적으로 Koin 컴파일러는 모듈에 바인딩되지 않은 모든 정의를 감지하여 프로젝트의 루트에 생성된 Koin 모듈인 "기본 모듈"에 넣습니다. 다음 옵션을 사용하여 기본 모듈의 사용 및 생성을 비활성화할 수 있습니다.

```groovy
// build.gradle 또는 build.gradle.kts에서

ksp {
    arg("KOIN_DEFAULT_MODULE","false")
}
```

### Kotlin KMP 설정

공식 문서에 설명된 대로 KSP 설정을 따르세요. [Kotlin Multiplatform을 사용한 KSP](https://kotlinlang.org/docs/ksp-multiplatform.html)

Koin Annotations에 대한 기본 설정이 포함된 [Hello Koin KMP](https://github.com/InsertKoinIO/hello-kmp/tree/annotations) 프로젝트를 확인할 수도 있습니다.