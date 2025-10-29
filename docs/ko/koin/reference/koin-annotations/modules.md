---
title: 애플리케이션, 구성 및 모듈
---

## @KoinApplication을 사용한 애플리케이션 부트스트랩

완전한 Koin 애플리케이션 부트스트랩을 생성하려면, 진입점 클래스에 `@KoinApplication` 어노테이션을 사용할 수 있습니다. 이 어노테이션은 Koin 애플리케이션 부트스트랩 함수를 생성하는 데 도움이 됩니다:

```kotlin
@KoinApplication // load default configuration
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

이는 Koin 애플리케이션 시작을 위한 **두 가지** 함수를 생성합니다:

```kotlin
// 아래 임포트는 생성된 확장 함수에 접근할 수 있도록 합니다.
import org.koin.ksp.generated.*

fun main() {
    // 옵션 1: Koin 직접 시작
    MyApp.startKoin()
    
    // 옵션 2: KoinApplication 인스턴스 가져오기
    val koinApp = MyApp.koinApplication()
}
```

두 생성 함수 모두 사용자 지정 구성을 지원합니다:

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 다른 Koin 구성 추가
    }
    
    // 또는 koinApplication 사용
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 어노테이션은 다음을 지원합니다:
- `configurations`: 스캔하고 로드할 구성 이름 배열
- `modules`: 직접 포함할 모듈 클래스 배열 (구성에 추가로)

:::info
구성이 지정되지 않으면 자동으로 "default" 구성을 로드합니다.
:::

## @Configuration을 사용한 구성 관리

`@Configuration` 어노테이션을 사용하면 모듈을 여러 구성(환경, 플레이버 등)으로 구성할 수 있습니다. 이는 배포 환경이나 기능 집합별로 모듈을 구성하는 데 유용합니다.

### 기본 구성 사용

```kotlin
// 모듈을 기본 구성에 배치
@Module
@Configuration
class CoreModule
```

:::info
기본 구성은 "default"로 명명되며, `@Configuration` 또는 `@Configuration("default")`와 함께 사용할 수 있습니다.
:::

구성에서 모듈을 스캔하려면 `@KoinApplication`을 사용해야 합니다:

```kotlin
// 모듈 A
@Module
@Configuration
class ModuleA

// 모듈 B
@Module
@Configuration
class ModuleB

// 앱 모듈, 모든 @Configuration 모듈 스캔
@KoinApplication
object MyApp
```

### 여러 구성 지원

하나의 모듈은 여러 구성과 연관될 수 있습니다:

```kotlin
// 이 모듈은 "prod" 및 "test" 구성 모두에서 사용 가능합니다.
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 이 모듈은 default, test, development에서 사용 가능합니다.
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 환경별 구성

```kotlin
// 개발 전용 구성
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 프로덕션 전용 구성  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 여러 환경에서 사용 가능
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### @KoinApplication과 함께 구성 사용

기본적으로 `@KoinApplication`은 모든 기본 구성(@Configuration으로 태그된 모듈)을 로드합니다.

애플리케이션 부트스트랩에서 이러한 구성을 참조할 수도 있습니다:

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 기본 구성만 로드 (매개변수 없는 @KoinApplication과 동일)
@KoinApplication
class SimpleApp
```

:::info
- 비어 있는 `@Configuration`은 `@Configuration("default")`와 동일합니다.
- 특정 구성이 지정되지 않으면 "default" 구성이 자동으로 로드됩니다.
- 모듈은 어노테이션에 나열하여 여러 구성에 속할 수 있습니다.
:::

## 기본 모듈 (1.3.0부터 더 이상 사용되지 않음)

:::warning
기본 모듈 접근 방식은 Annotations 1.3.0부터 더 이상 사용되지 않습니다. 더 나은 구성과 명확성을 위해 `@Module` 및 `@Configuration` 어노테이션을 사용하는 명시적 모듈을 사용하는 것을 권장합니다.
:::

정의를 사용할 때, 이를 모듈로 구성하거나 구성하지 않을 수 있습니다. 이전에는 명시적 모듈 없이 정의를 호스팅하기 위해 "default" 생성 모듈을 사용할 수 있었습니다.

어떤 모듈도 지정하고 싶지 않다면, Koin은 모든 정의를 담을 기본 모듈을 제공합니다. `defaultModule`은 바로 사용할 수 있습니다:

```kotlin
// 아래 임포트는 생성된 확장 함수에 접근할 수 있도록 합니다.
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// 또는 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**권장 접근 방식**: 기본 모듈을 사용하는 대신, 정의를 명시적 모듈로 구성하세요:

```kotlin
@Module
@Configuration
class MyModule {
    // 여기에 정의
}

// 그 다음 @KoinApplication 사용
@KoinApplication
object MyApp
```

:::info
`org.koin.ksp.generated.*` 임포트를 사용하는 것을 잊지 마세요.
:::

## @Module을 사용한 클래스 모듈

모듈을 선언하려면, `@Module` 어노테이션으로 클래스에 태그를 지정하세요:

```kotlin
@Module
class MyModule
```

Koin에 모듈을 로드하려면, 모든 `@Module` 클래스에 대해 생성되는 `.module` 확장 함수를 사용하세요. `MyModule().module`과 같이 모듈의 새 인스턴스를 생성하기만 하면 됩니다:

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> `org.koin.ksp.generated.*` 임포트를 사용하는 것을 잊지 마세요.

## @ComponentScan을 사용한 컴포넌트 스캔

어노테이션이 지정된 컴포넌트를 스캔하여 모듈로 수집하려면, 모듈에 `@ComponentScan` 어노테이션을 사용하세요:

```kotlin
@Module
@ComponentScan
class MyModule
```

이는 현재 패키지와 하위 패키지에서 어노테이션이 지정된 컴포넌트를 스캔합니다. `@ComponentScan("com.my.package")`와 같이 특정 패키지를 스캔하도록 지정할 수 있습니다.

:::info
`@ComponentScan` 어노테이션을 사용할 때, KSP는 동일한 패키지에 대해 모든 Gradle 모듈을 가로질러 탐색합니다. (1.4부터)
:::

## 클래스 모듈 내 정의

자신의 코드에 직접 정의를 하려면, 정의 어노테이션으로 함수에 어노테이션을 지정할 수 있습니다:

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **참고**: `@InjectedParam` (startKoin에서 주입된 매개변수용) 및 `@Property` (속성 주입용)는 함수 멤버에서도 사용할 수 있습니다. 이러한 어노테이션에 대한 자세한 내용은 정의 문서를 참조하세요.

## 모듈 포함하기

다른 클래스 모듈을 자신의 모듈에 포함하려면, `@Module` 어노테이션의 `includes` 속성을 사용하세요:

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

이런 식으로 루트 모듈을 실행하기만 하면 됩니다:

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // ModuleB 및 ModuleA를 로드합니다.
          ModuleB().module
        )
    }
}