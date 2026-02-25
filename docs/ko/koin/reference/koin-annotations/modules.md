---
title: 애플리케이션, 설정 및 모듈
---

## @KoinApplication을 이용한 애플리케이션 부트스트랩

완전한 Koin 애플리케이션 부트스트랩(bootstrap)을 생성하려면, 엔트리 포인트(entry point) 클래스에 `@KoinApplication` 어노테이션을 사용할 수 있습니다. 이 어노테이션은 Koin 애플리케이션 부트스트랩 함수를 생성하는 데 도움을 줍니다:

```kotlin
@KoinApplication // 기본 설정을 로드합니다
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

이는 Koin 애플리케이션을 시작하기 위한 **두 가지** 함수를 생성합니다:

```kotlin
// 아래의 import를 통해 생성된 확장 함수에 접근할 수 있습니다
import org.koin.ksp.generated.*

fun main() {
    // 옵션 1: Koin 직접 시작
    MyApp.startKoin()
    
    // 옵션 2: KoinApplication 인스턴스 가져오기
    val koinApp = MyApp.koinApplication()
}
```

생성된 두 함수 모두 사용자 정의 설정을 지원합니다:

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // 기타 Koin 설정 추가
    }
    
    // 또는 koinApplication 사용
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` 어노테이션은 다음을 지원합니다:
- `configurations`: 스캔하고 로드할 설정 이름의 배열
- `modules`: 직접 포함할 모듈 클래스의 배열 (설정 외에 추가로 포함할 항목)

:::info
설정이 지정되지 않은 경우, 자동으로 "default" 설정을 로드합니다.
:::

## @Configuration을 이용한 설정 관리

`@Configuration` 어노테이션을 사용하면 모듈을 다양한 설정(환경, flavor 등)으로 구성할 수 있습니다. 이는 배포 환경이나 기능 세트별로 모듈을 정리하는 데 유용합니다.

### 기본적인 설정 사용법

```kotlin
// 모듈을 기본(default) 설정에 배치합니다
@Module
@Configuration
class CoreModule
```

:::info
기본 설정의 이름은 "default"이며, `@Configuration` 또는 `@Configuration("default")`로 사용할 수 있습니다.
:::

설정에서 모듈을 스캔하려면 `@KoinApplication`을 사용해야 합니다:

```kotlin
// 모듈 A
@Module
@Configuration
class ModuleA

// 모듈 B
@Module
@Configuration
class ModuleB

// 모듈 App, 모든 @Configuration 모듈을 스캔합니다
@KoinApplication
object MyApp
```

### 다중 설정 지원

하나의 모듈을 여러 설정과 연결할 수 있습니다:

```kotlin
// 이 모듈은 "prod" 및 "test" 설정 모두에서 사용할 수 있습니다
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// 이 모듈은 default, test, development에서 사용할 수 있습니다
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 환경별 설정

```kotlin
// 개발 전용 설정
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// 운영 전용 설정  
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

### @KoinApplication과 함께 설정 사용하기

기본적으로 `@KoinApplication`은 모든 기본 설정(`@Configuration`이 태그된 모듈)을 로드합니다.

애플리케이션 부트스트랩에서 이러한 설정을 다음과 같이 참조할 수도 있습니다:

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// 기본 설정만 로드 (파라미터가 없는 @KoinApplication과 동일)
@KoinApplication
class SimpleApp
```

:::info
- 빈 `@Configuration`은 `@Configuration("default")`와 동일합니다.
- 특정 설정이 지정되지 않은 경우 "default" 설정이 자동으로 로드됩니다.
- 어노테이션에 목록을 나열하여 모듈을 여러 설정에 속하게 할 수 있습니다.
:::

## 기본 모듈 (1.3.0부터 권장되지 않음)

:::warning
기본 모듈(default module) 방식은 Annotations 1.3.0부터 지원이 중단(deprecated)되었습니다. 더 나은 구성과 명확성을 위해 `@Module` 및 `@Configuration` 어노테이션을 사용하는 명시적 모듈 방식을 권장합니다.
:::

정의(definitions)를 사용하는 동안, 이를 모듈로 구성할지 여부를 결정해야 할 수 있습니다. 이전에는 명시적인 모듈 없이도 정의를 포함하기 위해 생성된 "default" 모듈을 사용할 수 있었습니다.

어떤 모듈도 지정하고 싶지 않은 경우, Koin은 모든 정의를 담을 수 있는 기본 모듈을 제공합니다. `defaultModule`은 즉시 사용할 수 있습니다:

```kotlin
// 아래의 import를 통해 생성된 확장 함수에 접근할 수 있습니다
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

**권장되는 방식**: 기본 모듈을 사용하는 대신, 명시적인 모듈에 정의를 구성하십시오:

```kotlin
@Module
@Configuration
class MyModule {
    // 여기에 정의 작성
}

// 그런 다음 @KoinApplication 사용
@KoinApplication
object MyApp
```

:::info
`org.koin.ksp.generated.*` 임포트를 잊지 마세요.
:::

## @Module을 이용한 클래스 모듈

모듈을 선언하려면 클래스에 `@Module` 어노테이션을 태그하기만 하면 됩니다:

```kotlin
@Module
class MyModule
```

Koin에서 모듈을 로드하려면, 모든 `@Module` 클래스에 대해 생성된 `.module` 확장 속성을 사용하면 됩니다. 모듈의 새 인스턴스를 생성하여 `MyModule().module`과 같이 사용하세요:

```kotlin
// Koin Generation 사용
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> `org.koin.ksp.generated.*` 임포트를 잊지 마세요.

## @ComponentScan을 이용한 컴포넌트 스캔

어노테이션이 달린 컴포넌트들을 스캔하여 모듈로 모으려면, 모듈에 `@ComponentScan` 어노테이션을 사용하면 됩니다:

```kotlin
@Module
@ComponentScan
class MyModule
```

이렇게 하면 현재 패키지와 하위 패키지에서 어노테이션이 달린 컴포넌트들을 스캔합니다. `@ComponentScan("com.my.package")`와 같이 특정 패키지를 지정하여 스캔할 수도 있습니다.

:::info
`@ComponentScan` 어노테이션을 사용하면, KSP는 동일한 패키지에 대해 모든 Gradle 모듈을 가로질러 탐색합니다. (1.4 버전부터 지원)
:::

## 클래스 모듈 내의 정의

코드 내에서 직접 정의(definition)를 선언하려면, 함수에 정의 어노테이션을 달아주면 됩니다:

```kotlin
// 예시 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **참고**: `@InjectedParam` (startKoin에서 주입된 파라미터용) 및 `@Property` (프로퍼티 주입용)도 함수 멤버에 사용할 수 있습니다. 이러한 어노테이션에 대한 자세한 내용은 정의(definitions) 문서를 참조하세요.

## 모듈 포함하기

다른 클래스 모듈을 현재 모듈에 포함하려면, `@Module` 어노테이션의 `includes` 속성을 사용하세요:

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

이 방식을 통해 루트(root) 모듈만 실행할 수 있습니다:

```kotlin
// Koin Generation 사용
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // ModuleB와 ModuleA를 모두 로드합니다
          ModuleB().module
        )
    }
}