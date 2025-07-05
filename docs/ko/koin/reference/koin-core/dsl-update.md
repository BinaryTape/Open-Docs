---
title: 생성자 DSL
---

Koin은 이제 클래스 생성자를 직접 대상으로 지정하고 람다 표현식 내에서 정의를 직접 입력할 필요가 없는 새로운 종류의 DSL 키워드를 제공합니다.

다음 의존성을 가진 `ClassA` 클래스의 경우:

```kotlin
class ClassA(val b : ClassB, val c : ClassC)
class ClassB()
class ClassC()
```

이제 `클래스 생성자`를 직접 대상으로 하여 해당 컴포넌트를 선언할 수 있습니다.

```kotlin
module {
    singleOf(::ClassA)
    singleOf(::ClassB)
    singleOf(::ClassC)
}
```

이제 `get()` 함수로 생성자에 의존성을 지정할 필요가 없습니다! 🎉

:::info
클래스 생성자를 대상으로 지정하려면 클래스 이름 앞에 `::`를 사용해야 합니다.
:::

:::note
생성자는 모든 `get()`으로 자동으로 채워집니다. Koin이 현재 그래프에서 값을 찾으려고 시도하므로 기본값을 사용하지 마세요.
:::

:::note
"이름이 지정된" 정의를 검색해야 하는 경우, 한정자(qualifier)를 지정하기 위해 람다와 `get()`을 사용하는 표준 DSL을 사용해야 합니다.
:::

## 사용 가능한 키워드

생성자로부터 정의를 빌드하는 데 사용할 수 있는 키워드는 다음과 같습니다.

*   `factoryOf` - `factory { }`와 동일 - 팩토리 정의
*   `singleOf` - `single { }`와 동일 - 싱글턴 정의
*   `scopedOf` - `scoped { }`와 동일 - 스코프 정의

:::info
Koin이 모든 매개변수를 해당 값으로 채우려고 시도하므로, 생성자에 기본값을 사용하지 않도록 주의하세요.
:::

## DSL 옵션

모든 생성자 DSL 정의는 람다 내에서 일부 옵션을 열 수도 있습니다.

```kotlin
module {
    singleOf(::ClassA) { 
        // definition options
        named("my_qualifier")
        bind<InterfaceA>()
        createdAtStart()
    }
}
```

일반적인 옵션 및 DSL 키워드는 이 람다에서 사용할 수 있습니다.

*   `named("a_qualifier")` - 정의에 String 한정자를 부여합니다.
*   `named<MyType>()` - 정의에 Type 한정자를 부여합니다.
*   `bind<MyInterface>()` - 주어진 빈 정의에 바인딩할 타입을 추가합니다.
*   `binds(listOf(...))` - 주어진 빈 정의에 바인딩할 타입 목록을 추가합니다.
*   `createdAtStart()` - Koin 시작 시 싱글턴 인스턴스를 생성합니다.

또한 람다 없이 `bind` 또는 `binds` 연산자를 사용할 수도 있습니다.

```kotlin
module {
    singleOf(::ClassA) bind InterfaceA::class
}
```

## 주입된 매개변수

이러한 종류의 선언으로도 주입된 매개변수를 사용할 수 있습니다. Koin은 생성자를 주입하기 위해 주입된 매개변수와 현재 의존성을 찾아볼 것입니다.

다음과 같습니다.

```kotlin
class MyFactory(val id : String)
```

생성자 DSL로 선언된 경우:

```kotlin
module {
    factoryOf(::MyFactory)
}
```

다음과 같이 주입될 수 있습니다.

```kotlin
val id = "a_factory_id"
val factory = koin.get<MyFactory> { parametersOf(id)}
```

## 리플렉션 기반 DSL (3.2부터 사용 중단)

:::caution
Koin 리플렉션 DSL은 현재 사용 중단되었습니다. 위에 있는 Koin 생성자 DSL을 사용하십시오.
:::