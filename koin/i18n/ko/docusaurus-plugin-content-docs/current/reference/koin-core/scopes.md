---
title: "스코프 (Scopes)"
---
Koin은 제한된 수명과 연결된 인스턴스를 정의할 수 있는 간단한 API를 제공합니다.

## 스코프란 무엇인가?

스코프(Scope)는 객체가 존재하는 고정된 기간 또는 메서드 호출입니다.
또 다른 관점은 스코프를 객체의 상태가 유지되는 시간으로 생각하는 것입니다.
스코프 컨텍스트가 종료되면 해당 스코프에 바인딩된 객체는 더 이상 주입될 수 없습니다 (컨테이너에서 삭제됨).

## 스코프 정의

기본적으로 Koin에는 세 가지 종류의 스코프가 있습니다.

- `single` 정의: 컨테이너 전체 수명 동안 유지되는 객체를 생성합니다 (삭제할 수 없음).
- `factory` 정의: 매번 새로운 객체를 생성합니다. 수명이 짧습니다. 컨테이너에 지속성이 없습니다 (공유할 수 없음).
- `scoped` 정의: 연결된 스코프 수명과 연결된 객체를 생성합니다.

스코프 정의를 선언하려면 다음과 같이 `scoped` 함수를 사용합니다. 스코프는 스코프 정의를 논리적 시간 단위로 수집합니다.

특정 유형에 대한 스코프를 선언하려면 `scope` 키워드를 사용해야 합니다.

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 스코프 Id & 스코프 이름

Koin 스코프는 다음으로 정의됩니다.

- 스코프 이름 - 스코프의 qualifier
- 스코프 id - 스코프 인스턴스의 고유 식별자

:::note
`scope<A> { }`는 `scope(named<A>()){ }`와 동일하지만 작성하기가 더 편리합니다. `scope(named("SCOPE_NAME")) { }`와 같이 문자열 qualifier를 사용할 수도 있습니다.
:::

`Koin` 인스턴스에서 다음을 액세스할 수 있습니다.

- `createScope(id : ScopeID, scopeName : Qualifier)` - 지정된 id 및 scopeName으로 닫힌 스코프 인스턴스를 생성합니다.
- `getScope(id : ScopeID)` - 지정된 id로 이전에 생성된 스코프를 검색합니다.
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 지정된 id 및 scopeName으로 닫힌 스코프 인스턴스를 생성하거나 이미 생성된 경우 검색합니다.

:::note
기본적으로 객체에서 `createScope`를 호출하면 스코프의 "소스"를 전달하지 않습니다. 매개변수로 전달해야 합니다. `T.createScope(<source>)`
:::

### 스코프 컴포넌트: 컴포넌트에 스코프 연결 [2.2.0]

Koin은 스코프 인스턴스를 해당 클래스에 가져오는 데 도움이 되는 `KoinScopeComponent` 개념을 가지고 있습니다.

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 인터페이스는 다음과 같은 여러 확장을 제공합니다.
- 현재 컴포넌트의 스코프 Id & 이름으로 스코프를 생성하는 `createScope`
- `get`, `inject` - 스코프에서 인스턴스를 resolve합니다 (`scope.get()` & `scope.inject()`와 동일).

A에 대한 스코프를 정의하여 B를 resolve해 보겠습니다.

```kotlin
module {
    scope<A> {
        scoped { B() } // A의 스코프에 연결됨
    }
}
```

그런 다음 `org.koin.core.scope` `get` & `inject` 확장을 통해 `B`의 인스턴스를 직접 resolve할 수 있습니다.

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // B를 inject로 resolve
    val b : B by inject() // 스코프에서 inject

    // B Resolve
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 현재 스코프를 닫는 것을 잊지 마세요
    }
}
```

### 스코프 내에서 종속성 Resolve

스코프의 `get` & `inject` 함수를 사용하여 종속성을 resolve하려면: `val presenter = scope.get<Presenter>()`

스코프의 장점은 스코프 정의에 대한 공통 논리적 시간 단위를 정의하는 것입니다. 또한 지정된 스코프 내에서 정의를 resolve할 수 있습니다.

```kotlin
// 클래스가 주어짐
class ComponentA
class ComponentB(val a : ComponentA)

// 스코프가 있는 모듈
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 현재 스코프 인스턴스에서 resolve됩니다.
        scoped { ComponentB(get()) }
    }
}
```

종속성 Resolve는 간단합니다.

```kotlin
// 스코프 생성
val myScope = koin.createScope<A>()

// 동일한 스코프에서
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
기본적으로 모든 스코프는 현재 스코프에서 정의를 찾을 수 없는 경우 메인 스코프에서 resolve하도록 폴백합니다.
:::

### 스코프 닫기

스코프 인스턴스가 완료되면 `close()` 함수로 닫습니다.

```kotlin
// KoinComponent에서
val scope = getKoin().createScope<A>()

// 사용 ...

// 닫기
scope.close()
```

:::info
닫힌 스코프에서 더 이상 인스턴스를 inject할 수 없습니다.
:::

### 스코프의 소스 값 가져오기

2.1.4의 Koin 스코프 API를 사용하면 정의에서 스코프의 원래 소스를 전달할 수 있습니다. 아래 예제를 살펴보겠습니다.
싱글톤 인스턴스 `A`가 있다고 가정합니다.

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* 또는 get() */) }

    }
}
```

A의 스코프를 생성하면 스코프의 소스(A 인스턴스)에 대한 참조를 스코프의 기본 정의로 전달할 수 있습니다. `scoped { BofA(getSource()) }` 또는 `scoped { BofA(get()) }`

이를 통해 계단식 매개변수 주입을 피하고 스코프 정의에서 소스 값을 직접 검색할 수 있습니다.

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
`getSource()`와 `get()`의 차이점: getSource는 소스 값을 직접 가져옵니다. Get은 모든 정의를 resolve하려고 시도하고 가능한 경우 소스 값으로 폴백합니다. `getSource()`는 성능 면에서 더 효율적입니다.
:::

### 스코프 연결

2.1의 Koin 스코프 API를 사용하면 스코프를 다른 스코프에 연결하여 결합된 정의 공간을 resolve할 수 있습니다. 예를 들어 보겠습니다.
여기서는 A에 대한 스코프와 B에 대한 스코프라는 두 개의 스코프 공간을 정의합니다. A의 스코프에서는 C(B의 스코프에 정의됨)에 액세스할 수 없습니다.

```kotlin
module {
    single { A() }
    scope<A> {
        scoped { B() }
    }
    scope<B> {
        scoped { C() }
    }
}
```

스코프 연결 API를 사용하면 A의 스코프에서 직접 B의 스코프 인스턴스 C를 resolve할 수 있습니다. 이를 위해 스코프 인스턴스에서 `linkTo()`를 사용합니다.

```kotlin
val a = koin.get<A>()
// A의 스코프에서 B를 가져오겠습니다.
val b = a.scope.get<B>()
// A의 스코프를 B의 스코프에 연결하겠습니다.
a.scope.linkTo(b.scope)
// A 또는 B 스코프에서 동일한 C 인스턴스를 얻었습니다.
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```