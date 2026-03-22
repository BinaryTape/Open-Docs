---
title: Autowire DSL
---

Koin은 클래스 생성자를 직접 대상으로 삼아 의존성을 자동으로 연결할 수 있는 Autowire DSL을 제공합니다.

:::tip
**Koin 컴파일러 플러그인(Koin Compiler Plugin)**을 사용하는 경우, 추가적인 컴파일 타임 안정성과 함께 유사한 자동 연결 기능을 제공하는 [컴파일러 플러그인 DSL](/docs/setup/compiler-plugin) 사용을 고려해 보세요.
:::

## 기존 Autowire DSL (Classic Autowire DSL)

의존성을 가진 `ClassA` 클래스가 다음과 같을 때:

```kotlin
class ClassA(val b: ClassB, val c: ClassC)
class ClassB()
class ClassC()
```

클래스 생성자를 대상으로 컴포넌트를 선언합니다:

```kotlin
import org.koin.dsl.*

module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

더 이상 `get()` 함수를 사용하여 의존성을 일일이 명시할 필요가 없습니다!

:::info
생성자를 지정하려면 클래스 이름 앞에 `::`를 사용하세요.
:::

:::note
생성자는 필요한 모든 의존성으로 자동 채워집니다. Koin이 모든 매개변수를 해결(resolve)하려고 시도하므로 기본값(default value)을 사용하는 것은 피하십시오.
:::

## 컴파일러 플러그인 DSL과의 비교

| 기존 Autowire | 컴파일러 플러그인 |
|------------------|-----------------|
| `singleOf(::ClassA)` | `single<ClassA>()` |
| `factoryOf(::ClassA)` | `factory<ClassA>()` |
| `scopedOf(::ClassA)` | `scoped<ClassA>()` |
| 패키지: `org.koin.dsl` | 패키지: `org.koin.plugin.module.dsl` |

컴파일러 플러그인 DSL은 추가적인 컴파일 타임 검증과 함께 동일한 자동 연결 기능을 제공합니다.

## 사용 가능한 키워드

생성자를 통해 정의를 생성할 때 다음 Autowire 키워드들을 사용할 수 있습니다:

* `factoryOf` - `factory { }`와 동일 - 팩토리 정의
* `singleOf` - `single { }`와 동일 - 싱글톤 정의
* `scopedOf` - `scoped { }`와 동일 - 스코프 정의

:::info
Koin은 모든 매개변수를 채우려고 시도하므로, 생성자에서 기본값을 사용하지 않도록 주의하십시오.
:::

## DSL 옵션

모든 Autowire DSL 정의는 람다를 통해 옵션을 설정할 수 있습니다:

```kotlin
module {
    singleOf(::ClassA) {
        // 정의 옵션
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

해당 람다에서는 일반적인 옵션 및 DSL 키워드를 사용할 수 있습니다:

* `named("a_qualifier")` - 정의에 문자열 한정자(qualifier)를 부여합니다.
* `named<MyType>()` - 정의에 타입 한정자를 부여합니다.
* `bind<MyInterface>()` - 해당 정의에 바인딩할 타입을 추가합니다.
* `binds(listOf(...))` - 해당 정의에 바인딩할 타입 목록을 추가합니다.
* `createdAtStart()` - Koin 시작 시 싱글톤 인스턴스를 생성합니다.

또한, 람다를 사용하지 않고 `bind` 또는 `binds` 연산자를 직접 사용할 수도 있습니다:

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 주입 매개변수 (Injected Parameters)

Autowire DSL 선언에서도 여전히 주입 매개변수(injected parameters)를 사용할 수 있습니다. Koin은 생성자 주입을 위해 주입된 매개변수와 현재 의존성 그래프를 함께 확인합니다.

다음과 같은 경우를 예로 들 수 있습니다:

```kotlin
class MyFactory(val id : String)
```

Autowire DSL로 다음과 같이 선언하면:

```kotlin
module {
    factoryOf(::MyFactory)
}
```

다음과 같이 주입할 수 있습니다:

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## 리플렉션 기반 DSL (3.2부터 지원 중단)

:::caution
Koin 리플렉션 DSL은 이제 지원 중단(deprecated)되었습니다. 위에 설명된 Koin Autowire DSL을 사용해 주세요.
:::