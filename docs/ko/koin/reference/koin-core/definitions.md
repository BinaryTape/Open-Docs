---
title: 정의
---

Koin을 사용하면 모듈 내에 정의(definitions)를 기술합니다. 이 섹션에서는 모듈을 선언, 구성 및 연결하는 방법을 살펴봅니다.

## 모듈 작성하기

Koin 모듈은 *모든 컴포넌트를 선언하는 공간*입니다. `module` 함수를 사용하여 Koin 모듈을 선언하세요.

```kotlin
val myModule = module {
   // 여기에 의존성을 작성하세요
}
```

이 모듈 내에서는 아래에 설명된 대로 컴포넌트를 선언할 수 있습니다.

## 싱글톤 정의하기

싱글톤(singleton) 컴포넌트를 선언한다는 것은 Koin 컨테이너가 선언된 컴포넌트의 *고유한 인스턴스(unique instance)*를 유지한다는 것을 의미합니다. 모듈에서 `single` 함수를 사용하여 싱글톤을 선언하세요.

```kotlin
class MyService()

val myModule = module {

    // MyService 클래스에 대한 싱글 인스턴스 선언
    single { MyService() }
}
```

## 람다 내에서 컴포넌트 정의하기

`single`, `factory`, `scoped` 키워드는 람다 식을 통해 컴포넌트를 선언할 수 있게 해줍니다. 이 람다는 컴포넌트를 빌드하는 방법을 기술합니다. 보통 생성자를 통해 컴포넌트를 인스턴스화하지만, 어떠한 표현식도 사용할 수 있습니다.

`single { Class constructor // Kotlin expression }`

람다의 결과 타입이 컴포넌트의 메인 타입이 됩니다.

## 팩토리 정의하기

팩토리(factory) 컴포넌트 선언은 해당 정의를 요청할 때마다 *매번 새로운 인스턴스*를 제공하는 정의입니다 (이 인스턴스는 Koin 컨테이너에 의해 유지되지 않으며, 나중에 다른 정의에 이 인스턴스를 주입하지 않습니다). 컴포넌트를 빌드하려면 람다 식과 함께 `factory` 함수를 사용하세요.

```kotlin
class Controller()

val myModule = module {

    // Controller 클래스에 대한 팩토리 인스턴스 선언
    factory { Controller() }
}
```

:::info
 Koin 컨테이너는 정의가 요청될 때마다 새로운 인스턴스를 제공하므로 팩토리 인스턴스를 유지하지 않습니다.
:::

## 의존성 해결 및 주입

이제 컴포넌트 정의를 선언할 수 있으므로, 의존성 주입으로 인스턴스들을 연결하고자 합니다. Koin 모듈에서 *인스턴스를 해결(resolve)*하려면, `get()` 함수를 사용하여 필요한 컴포넌트 인스턴스를 요청하기만 하면 됩니다. 이 `get()` 함수는 보통 생성자 값을 주입하기 위해 생성자 내부에서 사용됩니다.

:::info
 Koin 컨테이너로 의존성 주입을 하려면 *생성자 주입(constructor injection)* 스타일로 작성해야 합니다. 즉, 클래스 생성자에서 의존성을 해결해야 합니다. 이렇게 하면 Koin에서 주입된 인스턴스들로 해당 인스턴스가 생성됩니다.
:::

여러 클래스가 있는 예제를 살펴보겠습니다.

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // Service를 싱글 인스턴스로 선언
    single { Service() }
    // Controller를 싱글 인스턴스로 선언하고, get()을 통해 View 인스턴스를 해결
    single { Controller(get()) }
}
```

## 정의: 인터페이스 바인딩

`single` 또는 `factory` 정의는 제공된 람다 정의의 타입을 사용합니다. (예: `single { T }`)
해당 정의와 매칭되는 타입은 이 표현식에서 유일하게 매칭되는 타입입니다.

클래스와 구현된 인터페이스를 예로 들어 보겠습니다.

```kotlin
// Service 인터페이스
interface Service{

    fun doSomething()
}

// Service 구현체
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koin 모듈에서는 다음과 같이 Kotlin의 `as` 캐스트 연산자를 사용할 수 있습니다.

```kotlin
val myModule = module {

    // ServiceImp 타입만 매칭됨
    single { ServiceImp() }

    // Service 타입만 매칭됨
    single { ServiceImp() as Service }

}
```

추론된 타입(inferred type) 표현식을 사용할 수도 있습니다.

```kotlin
val myModule = module {

    // ServiceImp 타입만 매칭됨
    single { ServiceImp() }

    // Service 타입만 매칭됨
    single<Service> { ServiceImp() }

}
```

:::note
 이 두 번째 선언 스타일이 더 선호되며, 문서의 나머지 부분에서도 이 방식이 사용될 것입니다.
:::

## 추가 타입 바인딩

경우에 따라 하나의 정의에서 여러 타입을 매칭시키고 싶을 때가 있습니다.

클래스와 인터페이스를 예로 들어 보겠습니다.

```kotlin
// Service 인터페이스
interface Service{

    fun doSomething()
}

// Service 구현체
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

정의가 추가 타입을 바인딩하게 하려면 클래스와 함께 `bind` 연산자를 사용합니다.

```kotlin
val myModule = module {

    // ServiceImp 및 Service 타입과 매칭됨
    single { ServiceImp() } bind Service::class
}
```

여기서 `get()`을 통해 `Service` 타입을 직접 해결할 수 있다는 점에 유의하세요. 하지만 `Service`를 바인딩하는 정의가 여러 개 있는 경우 `bind<>()` 함수를 사용해야 합니다.

## 정의: 이름 지정 및 기본 바인딩

동일한 타입에 대한 두 정의를 구분하기 위해 정의에 이름을 지정할 수 있습니다.

이름으로 정의를 요청하기만 하면 됩니다.

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()`과 `by inject()` 함수를 사용하면 필요한 경우 정의 이름을 지정할 수 있습니다. 이 이름은 `named()` 함수에 의해 생성된 `qualifier`입니다.

기본적으로 Koin은 타입으로 정의를 바인딩하거나, 해당 타입이 이미 다른 정의에 바인딩된 경우 이름으로 바인딩합니다.

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

그 결과:

- `val service : Service by inject()`는 `ServiceImpl1` 정의를 트리거합니다.
- `val service : Service by inject(named("test"))`는 `ServiceImpl2` 정의를 트리거합니다.

## 주입 파라미터 선언하기

모든 정의에서 주입 파라미터(injection parameters)를 사용할 수 있습니다. 이는 주입되어 정의에서 사용될 파라미터입니다.

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

해결된 의존성(`get()`으로 해결됨)과 반대로, 주입 파라미터는 *해결 API를 통해 전달되는 파라미터*입니다. 즉, 이 파라미터들은 `get()` 및 `by inject()` 호출 시 `parametersOf` 함수와 함께 전달되는 값입니다.

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

자세한 내용은 [주입 파라미터 섹션](/docs/reference/koin-core/injection-parameters)을 참조하세요.

## 정의 종료 - OnClose

`onClose` 함수를 사용하면 정의에 콜백을 추가하여, 정의 종료(closing)가 호출될 때 실행되도록 할 수 있습니다.

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // 종료 콜백 - 대상은 Presenter입니다 }
}
```

## 정의 플래그 사용하기

Koin DSL은 몇 가지 플래그도 제공합니다.

### 시작 시 인스턴스 생성하기

정의나 모듈에 `CreatedAtStart` 플래그를 지정하여 시작 시(또는 원하는 시점) 생성되도록 할 수 있습니다. 먼저 모듈이나 정의에 `createdAtStart` 플래그를 설정하세요.

정의에서의 CreatedAtStart 플래그:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 이 정의에 대해 즉시 생성
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

모듈에서의 CreatedAtStart 플래그:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 함수는 `createdAtStart` 플래그가 설정된 정의 인스턴스들을 자동으로 생성합니다.

```kotlin
// Koin 모듈 시작
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
특정 시점(예: UI 대신 백그라운드 스레드)에 정의를 로드해야 하는 경우, 해당 컴포넌트를 get/inject 하기만 하면 됩니다.
:::

### 제네릭 처리하기

Koin 정의는 제네릭 타입 인자를 고려하지 않습니다. 예를 들어, 아래 모듈은 두 가지 타입의 `List` 정의를 시도합니다.

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin은 이러한 정의로는 시작되지 않으며, 사용자가 한 정의를 다른 정의로 오버라이드하려는 것으로 이해합니다.

두 정의를 모두 사용하려면 이름이나 위치(모듈)를 통해 구분해야 합니다. 예를 들어:

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}