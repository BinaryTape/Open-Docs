---
title: "@Module을 사용한 모듈"
---
정의(definitions)를 사용할 때 모듈에 정리해야 할 수도 있고, 그렇지 않을 수도 있습니다. 심지어 어떤 모듈도 사용하지 않고 생성된 "기본(default)" 모듈을 사용할 수도 있습니다.

## 모듈 없음 - 생성된 기본 모듈 사용

모듈을 지정하고 싶지 않다면 Koin은 모든 정의를 호스팅할 기본 모듈을 제공합니다. `defaultModule`은 바로 사용할 수 있습니다.

```kotlin
// Koin Generation 사용
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

:::info
  `org.koin.ksp.generated.*` 임포트(import)를 잊지 마세요.
:::

## @Module을 이용한 클래스 모듈

모듈을 선언하려면 클래스에 `@Module` 어노테이션(annotation)을 태그(tag)하기만 하면 됩니다.

```kotlin
@Module
class MyModule
```

Koin에서 모듈을 로드(load)하려면 `@Module` 클래스에 대해 생성된 `.module` 확장(extension)을 사용하기만 하면 됩니다. 모듈의 새 인스턴스(instance)인 `MyModule().module`을 생성합니다.

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

> `org.koin.ksp.generated.*` 임포트(import)를 잊지 마세요.

## @ComponentScan을 이용한 컴포넌트 스캔(scan)

모듈로 어노테이션이 달린 컴포넌트(component)를 스캔하고 수집하려면 모듈에서 `@ComponentScan` 어노테이션(annotation)을 사용하기만 하면 됩니다.

```kotlin
@Module
@ComponentScan
class MyModule
```

그러면 현재 패키지(package)와 하위 패키지(subpackage)에서 어노테이션이 달린 컴포넌트(component)를 스캔합니다. 특정 패키지(package)를 스캔하도록 지정할 수 있습니다. `@ComponentScan("com.my.package")`

:::info
  `@ComponentScan` 어노테이션(annotation)을 사용할 때 KSP는 동일한 패키지(package)에 대해 모든 Gradle 모듈을 탐색합니다. (1.4부터)
:::

## 클래스 모듈의 정의(definitions)

정의(definition)를 클래스에서 직접 정의하려면 함수에 정의(definition) 어노테이션(annotation)을 달 수 있습니다.

```kotlin
// given
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> @InjectedParam, @Property 또한 함수 멤버(member)에서 사용할 수 있습니다.

## 모듈 포함하기(Including Modules)

다른 클래스 모듈을 모듈에 포함하려면 `@Module` 어노테이션(annotation)의 `includes` 속성(attribute)을 사용하기만 하면 됩니다.

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

이러한 방식으로 루트 모듈을 실행할 수 있습니다.

```kotlin
// Koin Generation 사용
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // ModuleB & ModuleA를 로드합니다.
          ModuleB().module
        )
    }
}
```