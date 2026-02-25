---
title: Koin 컴포넌트
---

Koin은 모듈과 정의(definition)를 기술하는 데 도움을 주는 DSL이자, 정의 해결(resolution)을 수행하는 컨테이너입니다. 이제 우리에게 필요한 것은 컨테이너 외부에서 인스턴스를 가져오기 위한 API입니다. 이것이 바로 Koin 컴포넌트의 목적입니다.

:::info
 `KoinComponent` 인터페이스는 Koin에서 인스턴스를 직접 가져올 수 있도록 도와줍니다. 주의할 점은, 이 인터페이스를 사용하면 클래스가 Koin 컨테이너 API와 연결된다는 것입니다. `modules`에 선언할 수 있는 클래스에서는 이를 사용하지 않는 것이 좋으며, 생성자 주입(constructor injection)을 권장합니다.
:::

## Koin 컴포넌트 생성하기

클래스에 Koin 기능을 사용할 수 있는 능력을 부여하려면, `KoinComponent` 인터페이스로 해당 클래스를 *태깅(tag)*해야 합니다. 예를 들어보겠습니다.

MyService 인스턴스를 정의하는 모듈:

```kotlin
class MyService

val myModule = module {
    // MyService에 대한 싱글톤 정의
    single { MyService() }
}
```

정의를 사용하기 전에 Koin을 시작합니다.

myModule과 함께 Koin 시작하기:

```kotlin
fun main(vararg args : String){
    // Koin 시작
    startKoin {
        modules(myModule)
    }

    // MyComponent 인스턴스를 생성하고 Koin 컨테이너에서 주입
    MyComponent()
}
```

Koin 컨테이너에서 인스턴스를 가져오도록 `MyComponent`를 작성하는 방법은 다음과 같습니다.

MyService 인스턴스를 주입하기 위해 get() 및 by inject() 사용:

```kotlin
class MyComponent : KoinComponent {

    // Koin 인스턴스 지연 주입(lazy inject)
    val myService : MyService by inject()

    // 또는
    // Koin 인스턴스 즉시 주입(eager inject)
    val myService : MyService = get()
}
```

## KoinComponents로 Koin API 활용하기

클래스를 `KoinComponent`로 태깅하고 나면 다음에 접근할 수 있습니다.

* `by inject()` - Koin 컨테이너에서 지연 평가(lazy evaluated)된 인스턴스
* `get()` - Koin 컨테이너에서 즉시(eager) 인스턴스 가져오기
* `getProperty()`/`setProperty()` - 프로퍼티 가져오기/설정

## get 및 inject를 사용하여 정의 가져오기

Koin은 Koin 컨테이너에서 인스턴스를 가져오는 두 가지 방법을 제공합니다.

* `val t : T by inject()` - 지연 평가되는 위임된(delegated) 인스턴스
* `val t : T = get()` - 인스턴스에 즉시 접근

```kotlin
// 지연 평가됨
val myService : MyService by inject()

// 인스턴스를 직접 가져옴
val myService : MyService = get()
```

:::note
 지연 평가가 필요한 프로퍼티를 정의할 때는 지연 주입(lazy inject) 형식이 더 적합합니다.
:::

## 이름으로 인스턴스 해결하기

필요한 경우 `get()` 또는 `by inject()`에 다음 파라미터를 지정할 수 있습니다.

* `qualifier` - 정의의 이름 (정의 시 name 파라미터를 지정한 경우)

정의 이름을 사용하는 모듈의 예:

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

다음과 같이 해결(resolution)할 수 있습니다.

```kotlin
// 주어진 모듈에서 가져오기
val a = get<ComponentA>(named("A"))