---
title: Koin Annotations의 Scope
---

정의(definition)와 모듈을 사용하는 동안, 특정 공간과 시간 해상도(resolution)를 위해 스코프(scope)를 정의해야 할 수도 있습니다.

## @Scope로 스코프 정의하기

Koin은 스코프 사용을 허용합니다. 기본 사항에 대한 자세한 내용은 [Koin Scopes](/docs/reference/koin-core/scopes) 섹션을 참조하세요. 

어노테이션으로 스코프를 선언하려면, 다음과 같이 클래스에 `@Scope` 어노테이션을 사용하면 됩니다.

```kotlin
@Scope
class MyScopeClass
```

> 이는 다음 스코프 섹션과 동일합니다:
> ```kotlin
> scope<MyScopeClass> {
> 
>}
> ```

그 외에 타입보다 스코프 이름이 더 필요한 경우, `name` 파라미터를 사용하여 클래스에 `@Scope(name = )` 어노테이션을 태그해야 합니다:

```kotlin
@Scope(name = "my_scope_name")
class MyScopeClass
```

> 이는 다음과 동일합니다:
>
>```kotlin
>scope<named("my_scope_name")> {
>
>}
>```

## @Scoped로 스코프 안에 정의 추가하기

스코프(어노테이션으로 정의되었든 아니든) 내부에 정의를 선언하려면, 클래스에 `@Scope`와 `@Scoped` 어노테이션을 함께 태그하면 됩니다:

```kotlin
@Scope(name = "my_scope_name")
@Scoped
class MyScopedComponent
```

이렇게 하면 스코프 섹션 내에 올바른 정의가 생성됩니다:

```kotlin
scope<named("my_scope_name")> {
  scoped { MyScopedComponent() }
}
```

:::info
  필요한 스코프 공간을 나타내기 위한 어노테이션(`@Scope`)과 정의할 컴포넌트의 종류를 나타내기 위한 어노테이션(`@Scoped`)이 모두 필요합니다.
:::

## 스코프에서의 의존성 해결(Dependency resolution)

스코프가 지정된 정의(scoped definition) 내에서, 내부 스코프 및 부모 스코프의 모든 정의를 해결(resolve)할 수 있습니다.

예를 들어, 다음과 같은 경우가 작동합니다:

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

`MySingle` 컴포넌트는 루트(root)에 `single` 정의로 정의되어 있습니다. `MyScopedComponent`와 `MyOtherScopedComponent`는 "my_scope_name" 스코프에 정의되어 있습니다.
`MyScopedComponent`에서의 의존성 해결은 `MySingle` 인스턴스를 위해 Koin 루트에 접근하고, 현재 "my_scope_name" 스코프에서 `MyOtherScopedComponent` 스코프 인스턴스에 접근합니다.

## @ScopeId로 스코프 외부에서 해결하기 (1.3.0부터)

자신의 스코프에서 직접 접근할 수 없는 다른 스코프의 컴포넌트를 해결해야 할 수도 있습니다. 이를 위해 의존성에 `@ScopeId` 어노테이션을 태그하여 Koin이 지정된 스코프 ID의 스코프에서 이 의존성을 찾도록 지시해야 합니다.

```kotlin
@Factory
class MyFactory(
  @ScopeId("my_scope_id") val myScopedComponent :MyScopedComponent
)
```

위의 코드는 다음과 같이 생성된 것과 동일합니다:

```kotlin
factory { Myfactory(getScope("my_scope_id").get()) }
```

이 예시는 `MyFactory` 컴포넌트가 ID가 "my_scope_id"인 스코프 인스턴스에서 `MyScopedComponent` 컴포넌트를 해결함을 보여줍니다. "my_scope_id" ID로 생성된 이 스코프는 올바른 스코프 정의와 함께 생성되어야 합니다.

:::info
  `MyScopedComponent` 컴포넌트는 Scope 섹션에 정의되어 있어야 하며, 스코프 인스턴스는 "my_scope_id" ID로 생성되어야 합니다. 
:::

## 스코프 아키타입(Archetype) 어노테이션

Koin Annotations는 일반적인 스코프 패턴을 위해 미리 정의된 스코프 아키타입 어노테이션을 제공하여, 스코프 타입을 수동으로 선언할 필요가 없게 해줍니다. 이러한 어노테이션은 스코프 선언과 컴포넌트 정의를 하나의 어노테이션으로 결합합니다.

### Android 스코프 아키타입

Android 개발의 경우, 다음과 같이 미리 정의된 스코프 어노테이션을 사용할 수 있습니다:

#### @ActivityScope

Activity 스코프에 컴포넌트를 선언합니다:

```kotlin
@ActivityScope
class ActivityScopedComponent(val dependency: MyDependency)
```

다음과 같이 생성됩니다:
```kotlin
activityScope {
    scoped { ActivityScopedComponent(get()) }
}
```

**사용법:** 태그된 클래스는 Activity 및 `activityScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

#### @ActivityRetainedScope

Activity Retained 스코프(구성 변경 시에도 유지됨)에 컴포넌트를 선언합니다:

```kotlin
@ActivityRetainedScope
class RetainedComponent(val repository: MyRepository)
```

다음과 같이 생성됩니다:
```kotlin
activityRetainedScope {
    scoped { RetainedComponent(get()) }
}
```

**사용법:** 태그된 클래스는 Activity 및 `activityRetainedScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

#### @FragmentScope

Fragment 스코프에 컴포넌트를 선언합니다:

```kotlin
@FragmentScope
class FragmentScopedComponent(val service: MyService)
```

다음과 같이 생성됩니다:
```kotlin
fragmentScope {
    scoped { FragmentScopedComponent(get()) }
}
```

**사용법:** 태그된 클래스는 Fragment 및 `fragmentScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

### Core 스코프 아키타입

#### @ViewModelScope

ViewModel 스코프에 컴포넌트를 선언합니다. 이 어노테이션은 **Kotlin Multiplatform (KMP) 호환**되며 Android ViewModel 및 Compose Multiplatform ViewModel 모두에서 작동합니다:

```kotlin
@ViewModelScope
class ViewModelScopedRepository(val apiService: ApiService)

@ViewModelScope  
class ViewModelScopedUseCase(
    val repository: ViewModelScopedRepository,
    val analytics: AnalyticsService
)
```

다음과 같이 생성됩니다:
```kotlin
viewModelScope {
    scoped { ViewModelScopedRepository(get()) }
    scoped { ViewModelScopedUseCase(get(), get()) }
}
```

**사용법:** 태그된 클래스는 ViewModel 및 `viewModelScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

**KMP 지원:** ViewModel이 사용되는 Android, iOS, Desktop, Web 플랫폼을 포함한 모든 Kotlin Multiplatform 대상에서 원활하게 작동합니다.

### 스코프 아키타입 사용하기

스코프 아키타입 어노테이션은 일반적인 Koin 스코핑과 원활하게 작동합니다:

```kotlin
// 일반 컴포넌트
@Single
class GlobalService

// 아키타입을 사용한 스코프 컴포넌트
@ActivityScope
class ActivityService(val global: GlobalService)

@FragmentScope  
class FragmentService(
    val global: GlobalService,
    val activity: ActivityService
)
```

### 함수 정의와 결합하기

스코프 아키타입은 모듈 내의 함수에도 사용할 수 있습니다:

```kotlin
@Module
class MyModule {
    
    @ActivityScope
    fun activityComponent(dep: MyDependency) = MyActivityComponent(dep)
    
    @FragmentScope
    fun fragmentComponent(dep: MyDependency) = MyFragmentComponent(dep)
}
```

:::info
스코프 아키타입 어노테이션은 적절한 스코프 정의와 스코프 컴포넌트 선언을 자동으로 생성하여, 일반적인 스코프 패턴에 대한 보일러플레이트 코드를 줄여줍니다.
:::