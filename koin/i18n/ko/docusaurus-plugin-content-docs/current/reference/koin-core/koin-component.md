---
title: "Koin 컴포넌트"
---
Koin은 모듈과 정의를 설명하는 DSL이자 정의 확인을 수행하는 컨테이너입니다. 이제 필요한 것은 컨테이너 외부에서 인스턴스를 검색하는 API입니다. 이것이 Koin 컴포넌트의 목표입니다.

:::info
`KoinComponent` 인터페이스는 Koin에서 직접 인스턴스를 검색하는 데 도움을 주기 위해 존재합니다. 하지만 이 인터페이스를 사용하면 클래스가 Koin 컨테이너 API에 연결되므로 주의해야 합니다. `modules`에서 선언할 수 있는 클래스에서는 사용을 피하고 생성자 주입(constructor injection)을 사용하는 것이 좋습니다.
:::

## Koin 컴포넌트 생성

클래스에 Koin 기능을 사용할 수 있는 기능을 부여하려면 `KoinComponent` 인터페이스로 *태그 지정*해야 합니다. 예를 들어보겠습니다.

MyService 인스턴스를 정의하는 모듈
```kotlin
class MyService

val myModule = module {
    // MyService에 대한 싱글톤(singleton) 정의
    single { MyService() }
}
```

정의를 사용하기 전에 Koin을 시작합니다.

myModule을 사용하여 Koin 시작

```kotlin
fun main(vararg args : String){
    // Koin 시작
    startKoin {
        modules(myModule)
    }

    // MyComponent 인스턴스 생성 및 Koin 컨테이너에서 주입
    MyComponent()
}
```

다음은 `MyComponent`를 작성하여 Koin 컨테이너에서 인스턴스를 검색하는 방법입니다.

get() 및 by inject()를 사용하여 MyService 인스턴스 주입

```kotlin
class MyComponent : KoinComponent {

    // Koin 인스턴스를 lazy 주입
    val myService : MyService by inject()

    // 또는
    // Koin 인스턴스를 eager 주입
    val myService : MyService = get()
}
```

## KoinComponents로 Koin API 잠금 해제

클래스를 `KoinComponent`로 태그 지정하면 다음 기능에 액세스할 수 있습니다.

* `by inject()` - Koin 컨테이너에서 lazy 평가된 인스턴스
* `get()` - Koin 컨테이너에서 eager하게 가져온 인스턴스
* `getProperty()`/`setProperty()` - 속성 가져오기/설정

## get 및 inject로 정의 검색

Koin은 Koin 컨테이너에서 인스턴스를 검색하는 두 가지 방법을 제공합니다.

* `val t : T by inject()` - lazy 평가된 delegated 인스턴스
* `val t : T = get()` - 인스턴스에 대한 eager 액세스

```kotlin
// lazy 평가됩니다.
val myService : MyService by inject()

// 인스턴스를 직접 검색합니다.
val myService : MyService = get()
```

:::note
lazy 주입 형태는 lazy 평가가 필요한 속성을 정의하는 데 더 좋습니다.
:::

## 이름으로 인스턴스 확인

필요한 경우 `get()` 또는 `by inject()`에 다음 매개변수를 지정할 수 있습니다.

* `qualifier` - 정의 이름 (정의에서 이름 매개변수를 지정한 경우)

정의 이름을 사용하는 모듈의 예:

```kotlin
val module = module {
    single(named("A")) { ComponentA() }
    single(named("B")) { ComponentB(get()) }
}

class ComponentA
class ComponentB(val componentA: ComponentA)
```

다음과 같은 확인을 수행할 수 있습니다.

```kotlin
// 주어진 모듈에서 검색
val a = get<ComponentA>(named("A"))
```
```