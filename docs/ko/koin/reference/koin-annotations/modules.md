---
title: @Module을 사용한 모듈
---

정의를 사용할 때, 이를 모듈로 구성하거나 구성하지 않을 수 있습니다. 심지어 모듈을 전혀 사용하지 않고 "기본"으로 생성된 모듈을 사용할 수도 있습니다.

## 모듈 없음 - 생성된 기본 모듈 사용

어떤 모듈도 지정하고 싶지 않다면, Koin은 모든 정의를 담을 기본 모듈을 제공합니다. `defaultModule`은 바로 사용할 수 있습니다:

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// or 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
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

클래스 모듈 내에 직접 정의를 하려면, 정의 어노테이션으로 함수에 어노테이션을 지정할 수 있습니다:

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> @InjectedParam, @Property는 함수 멤버에서도 사용할 수 있습니다.

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
          // will load ModuleB & ModuleA
          ModuleB().module
        )
    }
}