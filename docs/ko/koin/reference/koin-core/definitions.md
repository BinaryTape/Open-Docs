---
title: "정의 (Definitions)"
---
Koin을 사용하면 모듈에서 정의를 설명할 수 있습니다. 이 섹션에서는 모듈을 선언, 구성 및 연결하는 방법을 알아봅니다.

## 모듈 작성하기

Koin 모듈은 *모든 구성 요소를 선언하는 공간*입니다. `module` 함수를 사용하여 Koin 모듈을 선언합니다.

```kotlin
val myModule = module {
   // 여기에 종속성을 넣으세요
}
```

이 모듈에서는 아래 설명된 대로 컴포넌트를 선언할 수 있습니다.

## 싱글톤 정의하기

싱글톤 컴포넌트를 선언한다는 것은 Koin 컨테이너가 선언된 컴포넌트의 *고유한 인스턴스*를 유지한다는 의미입니다. 모듈에서 `single` 함수를 사용하여 싱글톤을 선언합니다.

```kotlin
class MyService()

val myModule = module {

    // MyService 클래스에 대한 단일 인스턴스 선언
    single { MyService() }
}
```

## 람다 내에서 컴포넌트 정의하기

`single`, `factory` 및 `scoped` 키워드를 사용하면 람다 표현식을 통해 컴포넌트를 선언할 수 있습니다. 이 람다는 컴포넌트를 빌드하는 방법을 설명합니다. 일반적으로 생성자를 통해 컴포넌트를 인스턴스화하지만, 모든 표현식을 사용할 수도 있습니다.

`single { Class constructor // Kotlin 표현식 }`

람다의 결과 유형은 컴포넌트의 기본 유형입니다.

## 팩토리 정의하기

팩토리 컴포넌트 선언은 이 정의를 요청할 때마다 *새 인스턴스를 제공하는* 정의입니다 (이 인스턴스는 Koin 컨테이너에 의해 보관되지 않으며, 나중에 다른 정의에서 이 인스턴스를 주입하지 않음). 컴포넌트를 빌드하려면 람다 표현식과 함께 `factory` 함수를 사용합니다.

```kotlin
class Controller()

val myModule = module {

    // Controller 클래스에 대한 팩토리 인스턴스 선언
    factory { Controller() }
}
```

:::info
 Koin 컨테이너는 정의가 요청될 때마다 새 인스턴스를 제공하므로 팩토리 인스턴스를 보관하지 않습니다.
:::

## 종속성 확인 및 주입하기

이제 컴포넌트 정의를 선언할 수 있으므로 종속성 주입을 통해 인스턴스를 연결하려고 합니다. Koin 모듈에서 *인스턴스를 확인*하려면 요청된 필요한 컴포넌트 인스턴스에 대해 `get()` 함수를 사용하십시오. 이 `get()` 함수는 일반적으로 생성자 값을 주입하기 위해 생성자에 사용됩니다.

:::info
 Koin 컨테이너를 사용하여 종속성 주입을 수행하려면 *생성자 주입* 스타일로 작성해야 합니다. 즉, 클래스 생성자에서 종속성을 확인합니다. 이렇게 하면 Koin에서 주입된 인스턴스로 인스턴스가 생성됩니다.
:::

여러 클래스를 사용하는 예를 들어 보겠습니다.

```kotlin
// Presenter <- Service
class Service()
class Controller(val view : View)

val myModule = module {

    // Service를 단일 인스턴스로 선언
    single { Service() }
    // Controller를 단일 인스턴스로 선언하고, get()으로 View 인스턴스 확인
    single { Controller(get()) }
}
```

## 정의: 인터페이스 바인딩

`single` 또는 `factory` 정의는 주어진 람다 정의에서 유형을 사용합니다. 즉, `single { T }`
정의의 일치하는 유형은 이 표현식에서 일치하는 유일한 유형입니다.

클래스 및 구현된 인터페이스의 예를 들어 보겠습니다.

```kotlin
// Service 인터페이스
interface Service{

    fun doSomething()
}

// Service 구현
class ServiceImp() : Service {

    fun doSomething() { ... }
}
```

Koin 모듈에서 다음과 같이 `as` 캐스트 Kotlin 연산자를 사용할 수 있습니다.

```kotlin
val myModule = module {

    // ServiceImp 유형만 일치합니다.
    single { ServiceImp() }

    // Service 유형만 일치합니다.
    single { ServiceImp() as Service }

}
```

유추된 유형 표현식을 사용할 수도 있습니다.

```kotlin
val myModule = module {

    // ServiceImp 유형만 일치합니다.
    single { ServiceImp() }

    // Service 유형만 일치합니다.
    single<Service> { ServiceImp() }

}
```

:::note
 이 두 번째 스타일 선언 방법이 선호되며 나머지 문서에 사용됩니다.
:::

## 추가 유형 바인딩

경우에 따라 하나의 정의에서 여러 유형을 일치시키려고 합니다.

클래스 및 인터페이스의 예를 들어 보겠습니다.

```kotlin
// Service 인터페이스
interface Service{

    fun doSomething()
}

// Service 구현
class ServiceImp() : Service{

    fun doSomething() { ... }
}
```

정의가 추가 유형을 바인딩하도록 하려면 클래스와 함께 `bind` 연산자를 사용합니다.

```kotlin
val myModule = module {

    // ServiceImp 및 Service 유형과 일치합니다.
    single { ServiceImp() } bind Service::class
}
```

여기서 `get()`을 사용하여 `Service` 유형을 직접 확인할 수 있습니다. 그러나 `Service`를 바인딩하는 여러 정의가 있는 경우 `bind<>()` 함수를 사용해야 합니다.

## 정의: 이름 지정 및 기본 바인딩

동일한 유형에 대한 두 정의를 구별하는 데 도움이 되도록 정의에 이름을 지정할 수 있습니다.

이름으로 정의를 요청하십시오.

```kotlin
val myModule = module {
    single<Service>(named("default")) { ServiceImpl() }
    single<Service>(named("test")) { ServiceImpl() }
}

val service : Service by inject(qualifier = named("default"))
```

`get()` 및 `by inject()` 함수를 사용하면 필요한 경우 정의 이름을 지정할 수 있습니다. 이 이름은 `named()` 함수에서 생성된 `qualifier`입니다.

기본적으로 Koin은 유형별로 또는 유형이 이미 정의에 바인딩된 경우 이름별로 정의를 바인딩합니다.

```kotlin
val myModule = module {
    single<Service> { ServiceImpl1() }
    single<Service>(named("test")) { ServiceImpl2() }
}
```

그러면:

- `val service : Service by inject()`는 `ServiceImpl1` 정의를 트리거합니다.
- `val service : Service by inject(named("test"))`는 `ServiceImpl2` 정의를 트리거합니다.

## 주입 매개변수 선언하기

모든 정의에서 주입 매개변수를 사용할 수 있습니다. 즉, 정의에서 주입되고 사용될 매개변수입니다.

```kotlin
class Presenter(val view : View)

val myModule = module {
    single{ (view : View) -> Presenter(view) }
}
```

해결된 종속성(`get()`으로 해결됨)과 달리 주입 매개변수는 *해결 API를 통해 전달되는 매개변수*입니다.
즉, 이러한 매개변수는 `parametersOf` 함수를 사용하여 `get()` 및 `by inject()`로 전달되는 값입니다.

```kotlin
val presenter : Presenter by inject { parametersOf(view) }
```

자세한 내용은 [주입 매개변수 섹션](/reference/koin-core/injection-parameters.md)에서 참조하십시오.

## 정의 종료 - OnClose

`onClose` 함수를 사용하여 정의 종료가 호출되면 정의에 콜백을 추가할 수 있습니다.

```kotlin
class Presenter(val view : View)

val myModule = module {
    factory { (view : View) -> Presenter(view) } onClose { // closing callback - it is Presenter }
}
```

## 정의 플래그 사용하기

Koin DSL은 몇 가지 플래그도 제안합니다.

### 시작 시 인스턴스 생성

정의 또는 모듈은 시작 시 (또는 원하는 시점에) 생성되도록 `CreatedAtStart`로 플래그를 지정할 수 있습니다. 먼저 모듈 또는 정의에 `createdAtStart` 플래그를 설정하십시오.

정의에 대한 CreatedAtStart 플래그

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 이 정의에 대한 즉시 생성
    single<Service>(createdAtStart=true) { TestServiceImp() }
}
```

모듈에 대한 CreatedAtStart 플래그:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module(createdAtStart=true) {

    single<Service>{ TestServiceImp() }
}
```

`startKoin` 함수는 `createdAtStart`로 플래그가 지정된 정의 인스턴스를 자동으로 생성합니다.

```kotlin
// Koin 모듈 시작
startKoin {
    modules(myModuleA,myModuleB)
}
```

:::info
특정 시간에 일부 정의를 로드해야 하는 경우 (예: UI 대신 백그라운드 스레드에서) 원하는 컴포넌트를 가져오거나 주입하십시오.
:::

### 제네릭 처리

Koin 정의는 제네릭 유형 인수를 고려하지 않습니다. 예를 들어 아래 모듈은 List의 두 정의를 정의하려고 시도합니다.

```kotlin
module {
    single { ArrayList<Int>() }
    single { ArrayList<String>() }
}
```

Koin은 이러한 정의로 시작하지 않으며, 하나의 정의를 다른 정의로 재정의하려고 한다는 것을 이해합니다.

이를 허용하려면 2개의 정의를 이름 또는 위치 (모듈)를 통해 구별해야 합니다. 예를 들어:

```kotlin
module {
    single(named("Ints")) { ArrayList<Int>() }
    single(named("Strings")) { ArrayList<String>() }
}
```