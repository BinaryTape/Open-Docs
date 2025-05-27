---
title: Koin 어노테이션에서의 스코프
---

정의(definition)와 모듈(module)을 사용할 때, 특정 영역과 시점의 의존성 해결을 위해 스코프를 정의해야 할 수 있습니다.

## @Scope로 스코프 정의하기

Koin은 스코프를 사용할 수 있도록 합니다. 기본 개념에 대한 자세한 내용은 [Koin 스코프](/docs/reference/koin-core/scopes.md) 섹션을 참조하세요.

어노테이션으로 스코프를 선언하려면 다음처럼 클래스에 `@Scope` 어노테이션을 사용하면 됩니다.

```kotlin
@Scope
class MyScopeClass
```

> 이는 다음 스코프 섹션과 동일합니다.
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

또는 타입 대신 스코프 이름이 더 필요한 경우, `name` 파라미터를 사용하여 클래스에 `@Scope(name = )` 어노테이션을 지정해야 합니다.

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 이는 다음 코드와 동일합니다.
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scoped로 스코프에 정의 추가하기

스코프 내부에 정의를 선언하려면(어노테이션으로 정의되었든 아니든), 클래스에 `@Scope` 및 `@Scoped` 어노테이션을 지정하기만 하면 됩니다.

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

이는 스코프 섹션 내부에 적절한 정의를 생성합니다.

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
필요한 스코프 공간(`@Scope` 사용)과 정의할 컴포넌트의 종류(`@Scoped` 사용)를 나타내기 위해 두 어노테이션이 모두 필요합니다.
:::

## 스코프로부터의 의존성 해결

스코프가 지정된 정의에서 내부 스코프와 상위 스코프의 어떤 정의든 해결할 수 있습니다.

예를 들어, 다음 경우는 작동합니다.

```kotlin
@Single
class MySingle

@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent(
  val mySingle : MySingle,
  val myOtherScopedComponent :MyOtherScopedComponent
)

@Scope(name = "my_scope_name")
@Scoped
class MyOtherScopedComponent(
  val mySingle : MySingle
)
```

`MySingle` 컴포넌트는 루트(root)에 `single` 정의로 선언되어 있습니다. `MyScopedComponent`와 `MyOtherScopedComponent`는 "my_scope_name" 스코프에 정의되어 있습니다.
`MyScopedComponent`로부터의 의존성 해결은 `MySingle` 인스턴스를 통해 Koin 루트에 접근하며, 현재 "my_scope_name" 스코프에서 `MyOtherScopedComponent` 스코프 내 인스턴스에 접근합니다.

## @ScopeId로 스코프 외부에서 해결하기 (1.3.0부터)

현재 스코프에서 직접 접근할 수 없는 다른 스코프에서 컴포넌트를 해결해야 할 수 있습니다. 이를 위해 의존성에 `@ScopeId` 어노테이션을 지정하여 Koin에게 주어진 스코프 ID를 가진 스코프에서 이 의존성을 찾도록 지시해야 합니다.

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

위 코드는 다음 생성된 코드와 동일합니다.

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

이 예제는 `MyFactory` 컴포넌트가 "my_scope_id" ID를 가진 스코프 인스턴스에서 `MyScopedComponent` 컴포넌트를 해결할 것임을 보여줍니다. 이 "my_scope_id" ID로 생성된 스코프는 올바른 스코프 정의로 생성되어야 합니다.

:::info
`MyScopedComponent` 컴포넌트는 스코프 섹션에 정의되어야 하며, 스코프 인스턴스는 "my_scope_id" ID로 생성되어야 합니다.
:::