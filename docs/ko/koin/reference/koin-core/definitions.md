---
title: 정의
---

Koin을 사용하면 모듈에서 정의를 선언합니다. 이 섹션에서는 모듈을 선언하고, 구성하며, 연결하는 방법을 살펴보겠습니다.

## 모듈 작성하기

Koin 모듈은 *모든 컴포넌트를 선언하는 공간*입니다. Koin 모듈을 선언하려면 `module` 함수를 사용하세요:

```kotlin
val myModule = module {
   // your dependencies here
}
```

이 모듈에서는 아래에 설명된 대로 컴포넌트를 선언할 수 있습니다.

## 싱글톤 정의하기

싱글톤 컴포넌트를 선언한다는 것은 Koin 컨테이너가 선언된 컴포넌트의 *고유한 인스턴스를 유지*한다는 의미입니다. 모듈에서 `single` 함수를 사용하여 싱글톤을 선언합니다:

```kotlin
class MyService()

val myModule = module {

    // declare single instance for MyService class
    single { MyService() }
}
```

## 람다 내에서 컴포넌트 정의하기

`single`, `factory`, `scoped` 키워드는 람다 표현식을 통해 컴포넌트를 선언하는 데 도움을 줍니다. 이 람다는 컴포넌트를 빌드하는 방식을 설명합니다. 일반적으로는 생성자를 통해 컴포넌트를 인스턴스화하지만, 어떤 표현식이든 사용할 수 있습니다.

`single { Class constructor // Kotlin 표현식 }`

람다의 결과 타입은 컴포넌트의 주요 타입입니다.

## 팩토리 정의하기

팩토리 컴포넌트 선언은 해당 정의를 요청할 때마다 *새로운 인스턴스를 제공*하는 정의입니다 (이 인스턴스는 나중에 다른 정의에 주입되지 않으므로 Koin 컨테이너에 의해 유지되지 않습니다). 람다 표현식과 함께 `factory` 함수를 사용하여 컴포넌트를 빌드합니다.

```kotlin
class Controller()

val myModule = module {

    // declare factory instance for Controller class
    factory { Controller() }
}
```

:::info
Koin 컨테이너는 팩토리 인스턴스를 유지하지 않습니다. 정의가 요청될 때마다 새로운 인스턴스를 제공하기 때문입니다.
:::

## 의존성 해결 및 주입

이제 컴포넌트 정의를 선언할 수 있으므로, 의존성 주입을 통해 인스턴스를 연결하고자 합니다. Koin 모듈에서 *인스턴스를 해결*하려면, 필요한 컴포넌트 인스턴스를 요청하기 위해 `get()` 함수를 사용하기만 하면 됩니다. 이 `get()` 함수는 일반적으로 생성자에 사용되어 생성자 값을 주입합니다.

:::info
Koin 컨테이너로 의존성 주입을 하려면, *생성자 주입* 스타일로 작성해야 합니다. 즉, 클래스 생성자에서 의존성을 해결해야 합니다. 이렇게 하면 Koin으로부터 주입된 인스턴스와 함께 인스턴스가 생성됩니다.
:::

몇 가지 클래스를 사용한 예시를 살펴보겠습니다:

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // declare Service as single instance
    single { Service() }
    // declare Controller as single instance, resolving View instance with get()
    single { Controller(get()) }
}
```

## 정의: 인터페이스 바인딩

`single` 또는 `factory` 정의는 주어진 람다 정의로부터 타입을 사용합니다. 즉: `single { T }`
정의의 일치하는 타입은 이 표현식에서 유일하게 일치하는 타입입니다.

클래스와 구현된 인터페이스를 사용한 예시를 살펴보겠습니다:

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koin 모듈에서는 다음과 같이 `as` 캐스트 Kotlin 연산자를 사용할 수 있습니다:

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single { ServiceImp() as Service }

}
```

추론된 타입 표현식을 사용할 수도 있습니다:

```kotlin
val myModule = module {

    // Will match type ServiceImp only
    single { ServiceImp() }

    // Will match type Service only
    single<Service> { ServiceImp() }

}
```

:::note
이 두 번째 스타일 선언 방식이 선호되며, 이 문서의 나머지 부분에서 사용될 것입니다.
:::

## 추가 타입 바인딩

어떤 경우에는 단 하나의 정의에서 여러 타입과 일치시키고자 합니다.

클래스와 인터페이스를 사용한 예시를 살펴보겠습니다:

```kotlin
// Service interface
interface Service{

    fun doSomething()
}

// Service Implementation
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

정의가 추가 타입을 바인딩하도록 하려면, 클래스와 함께 `bind` 연산자를 사용합니다:

```kotlin
val myModule = module {

    // Will match types ServiceImp & Service
    single { ServiceImp() } bind Service::class
}
```

여기서 주목할 점은, `Service` 타입을 `get()`으로 직접 해결할 수 있다는 것입니다. 하지만 `Service`를 바인딩하는 여러 정의가 있는 경우, `bind<>()` 함수를 사용해야 합니다.

## 정의: 이름 지정 및 기본 바인딩

동일한 타입에 대한 두 가지 정의를 구분하는 데 도움이 되도록 정의에 이름을 지정할 수 있습니다:

정의를 이름으로 요청하면 됩니다:

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` 및 `by inject()` 함수를 통해 필요한 경우 정의 이름을 지정할 수 있습니다. 이 이름은 `named()` 함수로 생성된 한정자(qualifier)입니다.

기본적으로 Koin은 정의가 이미 타입에 바인딩되어 있다면, 해당 타입 또는 이름으로 정의를 바인딩합니다.

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

이어서:

- `val service : Service by inject()`는 `ServiceImpl1` 정의를 트리거합니다.
- `val service : Service by inject(named("test"))`는 `ServiceImpl2` 정의를 트리거합니다.

## 주입 파라미터 선언하기

어떤 정의에서든 주입 파라미터를 사용할 수 있습니다: 정의에 의해 주입되고 사용될 파라미터들입니다.

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

`get()`으로 해결된 의존성과는 달리, 주입 파라미터는 *해결(resolution) API를 통해 전달되는 파라미터*입니다.
이는 해당 파라미터가 `parametersOf` 함수를 사용하여 `get()` 및 `by inject()`로 전달되는 값임을 의미합니다:

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

더 자세한 내용은 [주입 파라미터 섹션](/docs/reference/koin-core/injection-parameters)에서 확인할 수 있습니다.

## 정의 종료 - OnClose

`onClose` 함수를 사용하여, 정의 종료가 호출될 때 정의에 콜백을 추가할 수 있습니다:

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 정의 플래그 사용하기

Koin DSL은 몇 가지 플래그도 제공합니다.

### 시작 시 인스턴스 생성

정의 또는 모듈은 `CreatedAtStart`로 플래그를 지정하여 시작 시 (또는 원하는 시점에) 생성될 수 있습니다. 먼저 모듈 또는 정의에 `createdAtStart` 플래그를 설정합니다.

정의에 `createdAtStart` 플래그 사용

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // eager creation for this definition
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

모듈에 `createdAtStart` 플래그 사용:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 함수는 `createdAtStart` 플래그가 지정된 정의 인스턴스를 자동으로 생성합니다.

```kotlin
// Start Koin modules
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
특정 시간에 (예를 들어 UI 대신 백그라운드 스레드에서) 일부 정의를 로드해야 하는 경우, 원하는 컴포넌트를 가져오거나 주입하기만 하면 됩니다.
:::

### 제네릭스 다루기

Koin 정의는 제네릭 타입 인수를 고려하지 않습니다. 예를 들어, 아래 모듈은 두 개의 List 정의를 시도합니다:

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin은 이러한 정의로는 시작되지 않을 것입니다. 이는 하나의 정의가 다른 정의를 오버라이드(override)하려는 것으로 이해하기 때문입니다.

두 정의를 사용하려면 이름이나 위치(모듈)를 통해 구분해야 합니다. 예를 들어:

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}