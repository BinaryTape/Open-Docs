---
title: Android 스코프 관리
---

## Android 생명주기 작업

안드로이드 컴포넌트는 주로 생명주기에 의해 관리됩니다. Activity나 Fragment를 직접 인스턴스화할 수 없으며, 시스템이 모든 생성 및 관리를 담당하고 `onCreate`, `onStart`와 같은 메서드를 통해 콜백을 제공합니다.

그렇기 때문에 Koin 모듈에서 Activity/Fragment/Service를 직접 정의할 수 없습니다. 대신 속성에 의존성을 주입해야 하며, 생명주기를 존중해야 합니다. UI 부분과 관련된 컴포넌트는 더 이상 필요하지 않을 때 즉시 해제되어야 합니다.

다음과 같이 나눌 수 있습니다.

*   장기 생명주기 컴포넌트(서비스, 데이터 리포지토리 등) - 여러 화면에서 사용되며, 결코 해제되지 않습니다.
*   중기 생명주기 컴포넌트(사용자 세션 등) - 여러 화면에서 사용되며, 일정 시간 후 해제되어야 합니다.
*   단기 생명주기 컴포넌트(뷰 등) - 단일 화면에서만 사용되며, 화면 종료 시 해제되어야 합니다.

장기 생명주기 컴포넌트는 `single` 정의로 쉽게 기술할 수 있습니다. 중기 및 단기 생명주기 컴포넌트에는 여러 가지 접근 방식이 있습니다.

MVP 아키텍처 스타일의 경우, `Presenter`는 UI를 돕거나 지원하는 단기 생명주기 컴포넌트입니다. Presenter는 화면이 표시될 때마다 생성되어야 하며, 화면이 사라지면 해제되어야 합니다.

매번 새로운 Presenter가 생성됩니다.

```kotlin
class DetailActivity : AppCompatActivity() {

    // injected Presenter
    override val presenter : Presenter by inject()
```

모듈에서 다음과 같이 정의할 수 있습니다.

*   `factory`로 - `by inject()` 또는 `get()`이 호출될 때마다 새 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    // Factory instance of Presenter
    factory { Presenter() }
}
```

*   `scope`로 - 스코프에 바인딩된 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
대부분의 안드로이드 메모리 누수는 비안드로이드 컴포넌트에서 UI/안드로이드 컴포넌트를 참조할 때 발생합니다. 시스템이 해당 컴포넌트에 대한 참조를 유지하므로 가비지 컬렉션을 통해 완전히 해제할 수 없습니다.
:::

## Android 컴포넌트용 스코프 (3.2.1부터)

### Android 스코프 선언

안드로이드 컴포넌트에 의존성을 스코프하려면, 다음과 같이 `scope` 블록으로 스코프 섹션을 선언해야 합니다.

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // Declare scope for MyActivity
  scope<MyActivity> {
    // get MyPresenter instance from current scope 
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Android 스코프 클래스

Koin은 Activity 또는 Fragment에 대해 선언된 스코프를 직접 사용할 수 있도록 `ScopeActivity`, `RetainedScopeActivity`, `ScopeFragment` 클래스를 제공합니다.

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter is resolved from MyActivity's scope 
    val presenter : MyPresenter by inject()
}
```

내부적으로 안드로이드 스코프는 `AndroidScopeComponent` 인터페이스와 함께 사용되어 다음과 같이 `scope` 필드를 구현해야 합니다.

```kotlin
abstract class ScopeActivity(
    @LayoutRes contentLayoutId: Int = 0,
) : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkNotNull(scope)
    }
}
```

`AndroidScopeComponent` 인터페이스를 사용하고 `scope` 속성을 구현해야 합니다. 이는 클래스에서 사용되는 기본 스코프를 설정합니다.

### Android 스코프 API

안드로이드 컴포넌트에 바인딩된 Koin 스코프를 생성하려면 다음 함수들을 사용하면 됩니다.
- `createActivityScope()` - 현재 Activity에 대한 스코프 생성 (스코프 섹션이 선언되어야 함)
- `createActivityRetainedScope()` - 현재 Activity에 대한 유지되는 스코프 생성 (ViewModel 생명주기에 의해 지원됨, 스코프 섹션이 선언되어야 함)
- `createFragmentScope()` - 현재 Fragment에 대한 스코프를 생성하고 상위 Activity 스코프에 연결

이 함수들은 다른 종류의 스코프를 구현하기 위한 델리게이트로도 사용할 수 있습니다.

- `activityScope()` - 현재 Activity에 대한 스코프 생성 (스코프 섹션이 선언되어야 함)
- `activityRetainedScope()` - 현재 Activity에 대한 유지되는 스코프 생성 (ViewModel 생명주기에 의해 지원됨, 스코프 섹션이 선언되어야 함)
- `fragmentScope()` - 현재 Fragment에 대한 스코프를 생성하고 상위 Activity 스코프에 연결

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

다음과 같이 유지되는 스코프(ViewModel 생명주기에 의해 지원됨)를 설정할 수도 있습니다.

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
안드로이드 스코프 클래스를 사용하고 싶지 않다면, 자신만의 클래스를 사용하여 `AndroidScopeComponent`와 스코프 생성 API를 함께 사용할 수 있습니다.
:::

### AndroidScopeComponent 및 스코프 닫기 처리

Koin 스코프가 파괴되기 전에 `AndroidScopeComponent`의 `onCloseScope` 함수를 오버라이드하여 일부 코드를 실행할 수 있습니다.

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // Called before closing the Scope
    }
}
```

:::note
`onDestroy()` 함수에서 스코프에 접근하려고 하면, 스코프는 이미 닫혀 있을 것입니다.
:::

### ViewModel 스코프 (3.5.4부터)

ViewModel은 메모리 누수(Activity 또는 Fragment 누수 등)를 방지하기 위해 루트 스코프에 대해서만 생성됩니다. 이는 ViewModel이 호환되지 않는 스코프에 접근할 수 있는 가시성 문제를 방지합니다.

:::warn
ViewModel은 Activity 또는 Fragment 스코프에 접근할 수 없습니다. 그 이유는 ViewModel이 Activity와 Fragment보다 오래 지속되기 때문에, 그렇게 되면 적절한 스코프 외부로 의존성이 누수될 수 있기 때문입니다.
:::

:::note
ViewModel 스코프 외부에서 의존성을 _정말로_ 연결해야 하는 경우, "주입된 매개변수"를 사용하여 일부 객체를 ViewModel에 전달할 수 있습니다: `viewModel { p -> }`
:::

`ScopeViewModel`은 ViewModel 스코프 작업을 돕는 새로운 클래스입니다. 이 클래스는 ViewModel의 스코프 생성을 처리하고, `by scope.inject()`를 통해 주입할 수 있도록 `scope` 속성을 제공합니다.

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // on onCleared, scope is closed
    
    // injected from current MyScopeViewModel's scope
    val session by scope.inject<Session>()

}
```

`ScopeViewModel`을 사용하면 `onCloseScope()` 함수를 오버라이드하여 스코프가 닫히기 전에 코드를 실행할 수도 있습니다.

:::note
ViewModel 스코프 내의 모든 인스턴스는 동일한 가시성을 가지며, ViewModel의 `onCleared` 함수가 호출될 때까지 ViewModel 인스턴스의 생명주기 동안 유지됩니다.
:::

예를 들어, Activity 또는 Fragment가 ViewModel을 생성하면 관련 스코프가 생성됩니다.

```kotlin
class MyActivity : AppCompatActivity() {

    // Create ViewModel and its scope
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

ViewModel이 생성되면, 이 스코프 내의 모든 관련 의존성을 생성하고 주입할 수 있습니다.

`ScopeViewModel` 클래스 없이 ViewModel 스코프를 수동으로 구현하려면 다음과 같이 진행합니다.

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // inject your dependency
    val session by scope.inject<Session>()

    // clear scope
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## 스코프 링크

스코프 링크는 사용자 정의 스코프를 가진 컴포넌트 간에 인스턴스를 공유할 수 있도록 합니다.

더 확장된 용법으로는, 여러 컴포넌트에서 `Scope` 인스턴스를 사용할 수 있습니다. 예를 들어, `UserSession` 인스턴스를 공유해야 하는 경우입니다.

먼저 스코프 정의를 선언합니다.

```kotlin
module {
    // Shared user session data
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession` 인스턴스 사용을 시작해야 할 때, 이를 위한 스코프를 생성합니다.

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
scope.linkTo(ourSession)
```

그런 다음 필요한 곳 어디에서든 사용합니다.

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity1's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // link ourSession scope to current `scope`, from ScopeActivity or ScopeFragment
        scope.linkTo(ourSession)

        // will look at MyActivity2's Scope + ourSession scope to resolve
        val userSession = get<UserSession>()
    }
}