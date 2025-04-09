---
title: "Constructor DSL"
---
Koin은 이제 클래스 생성자를 직접 타겟팅하고 람다 표현식 내에서 정의를 입력하지 않아도 되는 새로운 종류의 DSL 키워드를 제공합니다.

다음 종속성을 가진 주어진 클래스 `ClassA`의 경우:

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

이제 `class constructor`를 직접 타겟팅하여 이러한 컴포넌트를 선언할 수 있습니다.

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

더 이상 `get()` 함수를 사용하여 생성자에서 종속성을 지정할 필요가 없습니다! 🎉

:::info
클래스 생성자를 타겟팅하려면 클래스 이름 앞에 `::`를 사용해야 합니다.
:::

:::note
생성자는 모든 `get()`으로 자동 채워집니다. Koin이 현재 그래프에서 찾으려고 시도하므로 기본값을 사용하지 마십시오.
:::

:::note
"named" 정의를 검색해야 하는 경우 람다와 `get()`을 사용하여 qualifier를 지정해야 하는 표준 DSL을 사용해야 합니다.
:::

## 사용 가능한 키워드

다음 키워드를 사용하여 생성자에서 정의를 빌드할 수 있습니다.

* `factoryOf` - `factory { }`와 동일 - 팩토리 정의
* `singleOf` - `single { }`와 동일 - 싱글톤 정의
* `scopedOf` - `scoped { }`와 동일 - 스코프 정의

:::info
Koin이 모든 매개변수를 채우려고 시도하므로 생성자에서 기본값을 사용하지 마십시오.
:::

## DSL 옵션

모든 생성자 DSL 정의는 람다 내에서 일부 옵션을 열 수도 있습니다.

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

일반적인 옵션 및 DSL 키워드는 이 람다에서 사용할 수 있습니다.

* `named("a_qualifier")` - 정의에 String qualifier를 제공합니다.
* `named<MyType>()` - 정의에 Type qualifier를 제공합니다.
* `bind<MyInterface>()` - 주어진 bean 정의에 바인딩할 type을 추가합니다.
* `binds(listOf(...))` - 주어진 bean 정의에 바인딩할 type 목록을 추가합니다.
* `createdAtStart()` - Koin 시작 시 단일 인스턴스를 생성합니다.

람다가 필요 없이 `bind` 또는 `binds` 연산자를 사용할 수도 있습니다.

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 주입된 매개변수 (Injected Parameters)

이러한 종류의 선언을 사용하면 주입된 매개변수를 계속 사용할 수 있습니다. Koin은 주입된 매개변수와 현재 종속성에서 생성자를 주입하려고 시도합니다.

다음과 같이:

```kotlin
class MyFactory(val id : String)
```

생성자 DSL로 선언됨:

```kotlin
module {
    factoryOf(::MyFactory)
}
```

다음과 같이 주입할 수 있습니다.

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## Reflection 기반 DSL (3.2부터 더 이상 사용되지 않음)

:::caution
Koin Reflection DSL은 더 이상 사용되지 않습니다. 위의 Koin Constructor DSL을 사용하십시오.
:::