---
title: "Koin Annotation에서의 스코프 (Scopes)"
---
정의 및 모듈을 사용하는 동안 특정 공간 및 시간 해상도에 대한 스코프를 정의해야 할 수 있습니다.

## @Scope로 스코프 정의하기

Koin은 스코프 사용을 지원합니다. 기본 사항에 대한 자세한 내용은 [Koin 스코프](/reference/koin-core/scopes.md) 섹션을 참조하십시오.

어노테이션으로 스코프를 선언하려면 다음과 같이 클래스에 `@Scope` 어노테이션을 사용하십시오.

```kotlin
@Scope
class MyScopeClass
```

> 이는 다음 스코프 섹션과 같습니다.
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

또는 타입보다 스코프 이름이 더 필요한 경우, `name` 매개변수를 사용하여 `@Scope(name = )` 어노테이션으로 클래스에 태그를 지정해야 합니다.

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 이는 다음과 같습니다.
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scoped로 스코프에 정의 추가하기

(어노테이션으로 정의되었든 아니든) 스코프 내부에 정의를 선언하려면 `@Scope` 및 `@Scoped` 어노테이션으로 클래스에 태그를 지정하십시오.

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

그러면 스코프 섹션 내부에 올바른 정의가 생성됩니다.

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
필요한 스코프 공간(with `@Scope`)과 정의할 컴포넌트 종류(with `@Scoped`)를 나타내려면 두 어노테이션이 모두 필요합니다.
:::

## 스코프에서 의존성 해결하기

스코프 정의에서 내부 스코프와 상위 스코프에서 정의를 해결할 수 있습니다.

예를 들어 다음 경우가 작동합니다.

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

`MySingle` 컴포넌트는 루트에서 `single` 정의로 정의됩니다. `MyScopedComponent` 및 `MyOtherScopedComponent`는 "my_scope_name" 스코프에서 정의됩니다.
`MyScopedComponent`에서 의존성 해결은 Koin 루트에 `MySingle` 인스턴스로 액세스하고, 현재 "my_scope_name" 스코프에서 `MyOtherScopedComponent` 스코프 인스턴스에 액세스합니다.

## @ScopeId로 스코프 외부에서 해결하기 (1.3.0부터)

스코프에 직접 액세스할 수 없는 다른 스코프에서 컴포넌트를 해결해야 할 수 있습니다. 이를 위해 `@ScopeId` 어노테이션으로 의존성에 태그를 지정하여 Koin에게 주어진 스코프 ID의 스코프에서 이 의존성을 찾도록 지시해야 합니다.

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

위의 코드는 생성된 코드와 같습니다.

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

이 예는 `MyFactory` 컴포넌트가 ID가 "my_scope_id"인 스코프 인스턴스에서 `MyScopedComponent` 컴포넌트를 해결할 것임을 보여줍니다. ID가 "my_scope_id"인 이 스코프는 올바른 스코프 정의로 생성되어야 합니다.

:::info
`MyScopedComponent` 컴포넌트는 스코프 섹션에 정의되어야 하며, 스코프 인스턴스는 ID "my_scope_id"로 생성되어야 합니다.
:::