---
title: 스코프
---

Koin은 제한된 수명에 묶인 인스턴스를 정의할 수 있는 간단한 API를 제공합니다.

## 스코프란 무엇인가요?

스코프는 객체가 존재하는 고정된 시간 기간 또는 메서드 호출을 의미합니다.
다른 관점에서 보면, 스코프는 객체의 상태가 지속되는 기간으로 생각할 수 있습니다.
스코프 컨텍스트가 끝나면, 해당 스코프에 묶인 객체들은 다시 주입될 수 없으며 (컨테이너에서 제거됩니다).

## 스코프 정의

기본적으로 Koin에는 다음 세 가지 종류의 스코프가 있습니다:

- `single` 정의: 전체 컨테이너 수명과 함께 지속되는 객체를 생성합니다 (제거될 수 없습니다).
- `factory` 정의: 매번 새로운 객체를 생성합니다. 수명이 짧으며, 컨테이너에 지속되지 않습니다 (공유될 수 없습니다).
- `scoped` 정의: 연결된 스코프 수명에 묶여 지속되는 객체를 생성합니다.

`scoped` 정의를 선언하려면 다음과 같이 `scoped` 함수를 사용합니다. 스코프는 `scoped` 정의들을 시간의 논리적 단위로 묶습니다.

주어진 타입에 대한 스코프를 선언하려면 `scope` 키워드를 사용해야 합니다:

```kotlin
module {
    scope<MyType>{
        scoped { Presenter() }
        // ...
    }
}
```

### 스코프 ID & 스코프 이름

Koin 스코프는 다음으로 정의됩니다: 

- 스코프 이름 - 스코프의 한정자(qualifier)
- 스코프 ID - 스코프 인스턴스의 고유 식별자

:::note
 `scope<A> { }`는 `scope(named<A>()){ }`와 동일하지만, 작성하기에 더 편리합니다. 참고로 `scope(named("SCOPE_NAME")) { }`와 같이 문자열 한정자(qualifier)를 사용할 수도 있습니다.
:::

`Koin` 인스턴스로부터 다음 함수에 접근할 수 있습니다:

- `createScope(id : ScopeID, scopeName : Qualifier)` - 주어진 ID와 스코프 이름으로 닫힌 스코프 인스턴스를 생성합니다
- `getScope(id : ScopeID)` - 주어진 ID로 이전에 생성된 스코프를 검색합니다
- `getOrCreateScope(id : ScopeID, scopeName : Qualifier)` - 주어진 ID와 스코프 이름으로 닫힌 스코프 인스턴스를 생성하거나, 이미 생성된 경우 검색합니다

:::note
 기본적으로 객체에 `createScope`를 호출할 때 스코프의 "소스(source)"가 전달되지 않습니다. `T.createScope(<source>)`와 같이 파라미터로 전달해야 합니다.
:::

### 스코프 컴포넌트: 컴포넌트에 스코프 연결 [2.2.0]

Koin은 클래스에 스코프 인스턴스를 가져올 수 있도록 `KoinScopeComponent` 개념을 제공합니다:

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { createScope(this) }
}

class B
```

`KoinScopeComponent` 인터페이스는 몇 가지 확장 함수를 제공합니다:
- `createScope`: 현재 컴포넌트의 스코프 ID 및 이름으로부터 스코프를 생성
- `get`, `inject`: 스코프로부터 인스턴스를 주입 ( `scope.get()` 및 `scope.inject()`와 동일)

이제 B를 주입하기 위해 A에 대한 스코프를 정의해 봅시다:

```kotlin
module {
    scope<A> {
        scoped { B() } // A의 스코프에 묶임
    }
}
```

그러면 `org.koin.core.scope`의 `get` 및 `inject` 확장 함수 덕분에 `B` 인스턴스를 직접 주입할 수 있습니다:

```kotlin
class A : KoinScopeComponent {
    override val scope: Scope by lazy { newScope(this) }

    // B를 주입으로 해결
    val b : B by inject() // 스코프로부터 주입

    // B 해결
    fun doSomething(){
        val b = get<B>()
    }

    fun close(){
        scope.close() // 현재 스코프 닫는 것을 잊지 마세요
    }
}
```

### 스코프 내에서 의존성 주입

스코프의 `get` 및 `inject` 함수를 사용하여 의존성을 주입합니다: `val presenter = scope.get<Presenter>()` 

스코프의 이점은 `scoped` 정의를 위한 공통된 논리적 시간 단위를 정의하는 것입니다. 또한 주어진 스코프 내에서 정의를 주입할 수 있도록 합니다.

```kotlin
// 주어진 클래스
class ComponentA
class ComponentB(val a : ComponentA)

// 스코프가 있는 모듈
module {
    
    scope<A> {
        scoped { ComponentA() }
        // 현재 스코프 인스턴스로부터 주입됩니다
        scoped { ComponentB(get()) }
    }
}
```

의존성 주입은 다음처럼 간단합니다:

```kotlin
// 스코프 생성
val myScope = koin.createScope<A>()

// 동일한 스코프로부터
val componentA = myScope.get<ComponentA>()
val componentB = myScope.get<ComponentB>()
```

:::info
 기본적으로, 현재 스코프에서 정의를 찾을 수 없는 경우 모든 스코프는 메인 스코프에서 주입을 시도합니다.
:::

### 스코프 닫기

스코프 인스턴스 사용이 끝나면 `close()` 함수로 닫으면 됩니다:

```kotlin
// KoinComponent로부터
val scope = getKoin().createScope<A>()

// 사용 ...

// 닫기
scope.close()
```

:::info
 닫힌 스코프로부터는 더 이상 인스턴스를 주입할 수 없다는 점에 유의하십시오.
:::

### 스코프의 소스(Source) 값 가져오기

Koin 2.1.4의 스코프 API를 사용하면 스코프의 원본 소스(source)를 정의에 전달할 수 있습니다. 아래 예시를 살펴보겠습니다.
싱글톤 인스턴스 `A`가 있다고 가정해 봅시다:

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

A의 스코프를 생성함으로써, 스코프의 소스(A 인스턴스) 참조를 `scoped { BofA(getSource()) }` 또는 `scoped { BofA(get()) }`와 같이 스코프의 하위 정의로 전달할 수 있습니다.

이는 연쇄적인 파라미터 주입을 피하고, `scoped` 정의에서 소스 값을 직접 가져오기 위함입니다.

```kotlin
val a = koin.get<A>()
val b = a.scope.get<BofA>()
assertTrue(b.a == a)
```

:::note
 `getSource()`와 `get()`의 차이점: `getSource()`는 소스 값을 직접 가져옵니다. `get()`은 모든 정의를 주입하려 시도하고, 가능한 경우 소스 값으로 폴백(fallback)합니다. 따라서 `getSource()`가 성능 면에서 더 효율적입니다.
:::

### 스코프 연결

Koin 2.1의 스코프 API를 사용하면 한 스코프를 다른 스코프에 연결하여 결합된 정의 공간을 주입할 수 있습니다. 예시를 살펴보겠습니다.
여기서는 두 개의 스코프 공간, 즉 A를 위한 스코프와 B를 위한 스코프를 정의합니다. A의 스코프에서는 (B의 스코프에 정의된) C에 접근할 수 없습니다.

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

스코프 연결 API를 사용하면 B의 스코프 인스턴스 C를 A의 스코프에서 직접 주입할 수 있습니다. 이를 위해 스코프 인스턴스에서 `linkTo()`를 사용합니다:

```kotlin
val a = koin.get<A>()
// A의 스코프로부터 B를 가져옵시다
val b = a.scope.get<B>()
// A의 스코프를 B의 스코프에 연결합시다
a.scope.linkTo(b.scope)
// A 또는 B 스코프로부터 동일한 C 인스턴스를 얻습니다
assertTrue(a.scope.get<C>() == b.scope.get<C>())
```

### 스코프 아키타입(Archetypes)

스코프 "아키타입"은 일반적인 종류의 클래스를 위한 스코프 공간입니다. 예를 들어, 안드로이드(Android) (Activity, Fragment, ViewModel) 또는 Ktor (RequestScope)를 위한 스코프 아키타입을 가질 수 있습니다.
스코프 아키타입은 주어진 타입에 대한 스코프 공간을 요청하기 위해 다양한 API에 전달되는 Koin의 `TypeQualifier`입니다.

아키타입은 다음으로 구성됩니다:
- 모듈 DSL 확장: 주어진 타입에 대한 스코프를 선언하기 위한
```kotlin
// ActivityScopeArchetype (TypeQualifier(AppCompatActivity::class))에 대한 스코프 아키타입 선언
fun Module.activityScope(scopeSet: ScopeDSL.() -> Unit) {
    val qualifier = ActivityScopeArchetype
    ScopeDSL(qualifier, this).apply(scopeSet)
}
```
- 주어진 특정 스코프 아키타입 `TypeQualifier`로 스코프를 요청하는 API:
```kotlin
// ActivityScopeArchetype 아키타입으로 스코프 생성
val scope = getKoin().createScope(getScopeId(), getScopeName(), this, ActivityScopeArchetype)
```