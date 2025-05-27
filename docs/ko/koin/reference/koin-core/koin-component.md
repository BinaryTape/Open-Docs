---
title: Koin 컴포넌트
---

Koin은 모듈과 정의를 설명하는 데 도움이 되는 DSL이며, 정의 해결을 수행하는 컨테이너입니다. 이제 필요한 것은 컨테이너 외부에서 인스턴스를 가져올 API입니다. 이것이 Koin 컴포넌트의 목표입니다.

:::info
 `KoinComponent` 인터페이스는 Koin에서 직접 인스턴스를 가져오는 데 도움을 줍니다. 하지만 이 인터페이스는 클래스를 Koin 컨테이너 API에 연결하므로 주의해야 합니다. `modules`에 선언할 수 있는 클래스에는 사용을 피하고, 대신 생성자 주입을 선호하십시오.
:::

## Koin 컴포넌트 생성하기

어떤 클래스에 Koin 기능을 사용할 수 있는 능력을 부여하려면, `KoinComponent` 인터페이스로 *표시*해야 합니다. 예를 들어 봅시다.

MyService 인스턴스를 정의하는 모듈
```kotlin
class MyService

val myModule = module {
    // Define a singleton for MyService
    single { MyService() }
}
```

정의를 사용하기 전에 Koin을 시작합니다.

myModule로 Koin 시작하기

```kotlin
fun main(vararg args : String){
    // Start Koin
    startKoin {
        modules(myModule)
    }

    // Create MyComponent instance and inject from Koin container
    MyComponent()
}
```

다음은 Koin 컨테이너에서 인스턴스를 가져오도록 `MyComponent`를 작성하는 방법입니다.

get() 및 by inject()를 사용하여 MyService 인스턴스 주입하기

```kotlin
class MyComponent : KoinComponent {

    // lazy inject Koin instance
    val myService : MyService by inject()

    // or
    // eager inject Koin instance
    val myService : MyService = get()
}
```

## KoinComponents로 Koin API 활용하기

클래스에 `KoinComponent` 태그를 지정하면 다음 항목에 접근할 수 있습니다:

* `by inject()` - Koin 컨테이너에서 지연 평가된 인스턴스
* `get()` - Koin 컨테이너에서 즉시 가져오는 인스턴스
* `getProperty()`/`setProperty()` - 프로퍼티 가져오기/설정하기

## get & inject로 정의 검색하기

Koin은 Koin 컨테이너에서 인스턴스를 검색하는 두 가지 방법을 제공합니다:

* `val t : T by inject()` - 지연 평가된 위임 인스턴스
* `val t : T = get()` - 인스턴스에 대한 즉시 접근

```kotlin
// is lazy evaluated
val myService : MyService by inject()

// retrieve directly the instance
val myService : MyService = get()
```

:::note
 지연 주입 방식은 지연 평가가 필요한 프로퍼티를 정의하는 데 더 좋습니다.
:::

## 이름으로 인스턴스 해결하기

필요한 경우 `get()` 또는 `by inject()`와 함께 다음 매개변수를 지정할 수 있습니다.

* `qualifier` - 정의의 이름 (정의에서 이름 매개변수를 지정했을 때)

정의 이름을 사용하는 모듈 예시:

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

다음과 같은 해결을 수행할 수 있습니다:

```kotlin
// retrieve from given module
val a = get<ComponentA>(named("A"))
```