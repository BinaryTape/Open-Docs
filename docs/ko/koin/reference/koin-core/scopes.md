---
title: 스코프 (Scopes)
---

Koin은 제한된 수명(lifetime)에 연결된 인스턴스를 정의할 수 있는 간단한 API를 제공합니다.

## 스코프란 무엇인가요?

스코프는 객체가 존재하는 고정된 시간 또는 메서드 호출 주기입니다.
다른 관점으로는 스코프를 객체의 상태가 유지되는 시간으로 생각할 수 있습니다.
스코프 컨텍스트가 종료되면, 해당 스코프에 바인딩된 모든 객체는 더 이상 주입될 수 없습니다(컨테이너에서 제거됩니다).

## 스코프 정의 (Scope definition)

기본적으로 Koin에는 세 가지 종류의 스코프가 있습니다.

- `single` 정의: 컨테이너의 전체 수명 동안 유지되는 객체를 생성합니다(삭제할 수 없음).
- `factory` 정의: 매번 새로운 객체를 생성합니다. 수명이 짧으며 컨테이너에 유지되지 않습니다(공유할 수 없음).
- `scoped` 정의: 연결된 스코프의 수명 동안 유지되는 객체를 생성합니다.

스코프 정의(scoped definition)를 선언하려면 다음과 같이 `scoped` 함수를 사용합니다. 스코프는 스코프 정의들을 하나의 논리적 시간 단위로 묶어줍니다.

특정 타입에 대한 스코프를 선언하려면 `scope` 키워드를 사용해야 합니다.

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 스코프 ID 및 스코프 이름 (Scope Id & Scope Name)

Koin 스코프는 다음 요소들로 정의됩니다. 

- 스코프 이름(scope name) - 스코프의 한정자(qualifier)
- 스코프 ID(scope id) - 스코프 인스턴스의 고유 식별자

:::note
 `scope<A> { }`는 `scope(named<A>()){ }`와 동일하지만 작성하기 더 편리합니다. `scope(named("SCOPE_NAME")) { }`과 같이 문자열 한정자를 사용할 수도 있습니다.
:::

`Koin` 인스턴스에서 다음 메서드에 접근할 수 있습니다.

- `createScope(id : ScopeID, scopeName : Qualifier)` - 주어진 ID와 스코프 이름으로 닫힌(closed) 스코프 인스턴스를 생성합니다.
- `getScope(id : ScopeID)` - 이전에 생성된 주어진 ID의 스코프를 검색합니다.
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 주어진 ID와 스코프 이름으로 닫힌 스코프 인스턴스를 생성하거나, 이미 생성된 경우 검색합니다.

:::note
기본적으로 객체에서 `createScope`를 호출할 때 스코프의 "소스(source)"를 전달하지 않습니다. 파라미터로 전달해야 합니다: `T.createScope(<source>)`
:::

### 스코프 컴포넌트: 컴포넌트에 스코프 연결 [2.2.0]

Koin에는 클래스에 스코프 인스턴스를 가져오는 것을 돕기 위한 `KoinScopeComponent` 개념이 있습니다.

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 인터페이스는 여러 확장 기능을 제공합니다.
- `createScope`: 현재 컴포넌트의 스코프 ID 및 이름을 사용하여 스코프를 생성합니다.
- `get`, `inject`: 스코프에서 인스턴스를 해결(resolve)합니다 (`scope.get()` 및 `scope.inject()`와 동일).

B를 해결하기 위해 A에 대한 스코프를 정의해 보겠습니다.

```kotlin
module {
    scope<A> {
        scoped { B() } // A의 스코프에 연결됨
    }
}
```

그런 다음 `org.koin.core.scope`의 `get` 및 `inject` 확장 기능을 사용하여 `B`의 인스턴스를 직접 해결할 수 있습니다.

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // inject로 B를 해결
    val b : B by inject() // 스코프에서 주입

    // B 해결
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 현재 스코프를 닫는 것을 잊지 마세요
    }
}
```

### 스코프 내에서 의존성 해결하기 (Resolving dependencies within a scope)

스코프의 `get` 및 `inject` 함수를 사용하여 의존성을 해결하려면 다음과 같이 합니다: `val presenter = scope.get<Presenter>()` 

스코프의 이점은 스코프 정의들을 위한 공통된 논리적 시간 단위를 정의하는 것입니다. 또한 주어진 스코프 내에서 정의들을 해결할 수 있게 해줍니다.

```kotlin
// 클래스 예시
class ComponentA
class ComponentB(val a : ComponentA)

// 스코프가 있는 모듈
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 현재 스코프 인스턴스에서 해결됨
        scoped { ComponentB(get()) }
    }
}
```

그러면 의존성 해결이 매우 간단해집니다.

```kotlin
// 스코프 생성
val myScope = koin.createScope<A>()

// 동일한 스코프에서 가져오기
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 기본적으로 현재 스코프에서 정의를 찾을 수 없는 경우, 모든 스코프는 메인 스코프에서 해결을 시도하도록 폴백(fallback)됩니다.
:::

### 스코프 닫기 (Close a scope)

스코프 인스턴스 사용이 끝나면 `close()` 함수를 호출하여 닫아주기만 하면 됩니다.

```kotlin
// KoinComponent에서
val scope = getKoin().createScope<A>()

// 사용 ...

// 닫기
scope.close()
```

:::info
 닫힌 스코프에서는 더 이상 인스턴스를 주입할 수 없으므로 주의하세요.
:::

### 스코프의 소스 값 가져오기 (Getting scope's source value)

2.1.4 버전의 Koin 스코프 API를 사용하면 정의 내에서 스코프의 원래 소스(source)를 전달할 수 있습니다. 아래 예를 살펴보겠습니다.
싱글톤 인스턴스 `A`가 있다고 가정해 봅시다.

```kotlin
class A
class BofA(val a : A)

module {
    single { A() }
    scope<A> {
        scoped { BofA(getSource() /* 또는 get()도 가능 */) }

    }
}
```

A의 스코프를 생성함으로써, 스코프 소스(A 인스턴스)의 참조를 스코프의 하위 정의로 전달할 수 있습니다: `scoped { BofA(getSource()) }` 또는 `scoped { BofA(get()) }`

이는 파라미터 주입이 연쇄적으로 일어나는 것을 방지하고, 스코프 정의에서 직접 소스 값을 검색하기 위함입니다.

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()`와 `get()`의 차이점: `getSource`는 소스 값을 직접 가져옵니다. `get`은 정의를 해결하려고 시도하며 가능한 경우 소스 값으로 폴백합니다. 따라서 성능 면에서는 `getSource()`가 더 효율적입니다.
:::

### 스코프 연결 (Scope Linking)

Koin 2.1 스코프 API를 사용하면 한 스코프를 다른 스코프에 연결하여 결합된 정의 공간을 해결할 수 있습니다. 예를 들어보겠습니다.
여기서는 A를 위한 스코프와 B를 위한 스코프라는 두 가지 스코프 공간을 정의하고 있습니다. A의 스코프에서는 B의 스코프에 정의된 C에 접근할 수 없습니다.

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

스코프 연결(scope linking) API를 사용하면 A의 스코프에서 직접 B의 스코프 인스턴스 C를 해결할 수 있습니다. 이를 위해 스코프 인스턴스에서 `linkTo()`를 사용합니다.

```kotlin
val a = koin.get<A>()
// A의 스코프에서 B를 가져옴
val b = a.scope.get<B>()
// A의 스코프를 B의 스코프에 연결
a.scope.linkTo(b.scope)
// 이제 A 또는 B 스코프에서 동일한 C 인스턴스를 얻을 수 있음
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### 스코프 아키타입 (Scope Archetypes)

스코프 "아키타입(Archetypes)"은 일반적인 클래스 종류들을 위한 스코프 공간입니다. 예를 들어, Android(Activity, Fragment, ViewModel) 또는 Ktor(RequestScope)를 위한 스코프 아키타입을 가질 수 있습니다.
스코프 아키타입은 특정 스코프 공간을 요청하기 위해 다양한 API에 전달되는 Koin의 `TypeQualifier`입니다.

아키타입은 다음으로 구성됩니다.
- 주어진 타입에 대한 스코프를 선언하기 위한 모듈 DSL 확장:
```kotlin
// ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class))에 대한 스코프 아키타입 선언
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 특정 스코프 아키타입 `TypeQualifier`를 사용하여 스코프를 요청하는 API:
```kotlin
// ActivityScopeArchetype 아키타입으로 스코프 생성
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)