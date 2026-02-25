---
title: 안드로이드 스코프(Android Scopes)
---

## 안드로이드 생명주기(Lifecycle)와 함께 작업하기

안드로이드 컴포넌트는 주로 생명주기에 의해 관리됩니다. 액티비티(Activity)나 프래그먼트(Fragment)를 직접 인스턴스화할 수 없으며, 시스템이 우리를 대신해 모든 생성과 관리를 수행하고 `onCreate`, `onStart` 등과 같은 메서드에 콜백을 호출합니다.

이것이 Koin 모듈에 액티비티/프래그먼트/서비스를 정의할 수 없는 이유입니다. 따라서 프로퍼티에 의존성을 주입해야 하며 생명주기도 준수해야 합니다. UI 파트와 관련된 컴포넌트들은 더 이상 필요하지 않게 되는 즉시 해제되어야 합니다.

컴포넌트는 다음과 같이 분류할 수 있습니다:

*   **긴 수명의 컴포넌트(Long live components)** (서비스, 데이터 레포지토리 등) - 여러 화면에서 사용되며 절대 폐기되지 않습니다.
*   **중간 수명의 컴포넌트(Medium live components)** (사용자 세션 등) - 여러 화면에서 사용되지만 일정 시간 후에 폐기되어야 합니다.
*   **짧은 수명의 컴포넌트(Short live components)** (뷰) - 단 하나의 화면에서만 사용되며 화면이 끝날 때 폐기되어야 합니다.

긴 수명의 컴포넌트는 `single` 정의로 쉽게 설명할 수 있습니다. 중간 및 짧은 수명의 컴포넌트에 대해서는 여러 가지 접근 방식을 취할 수 있습니다.

MVP 아키텍처 스타일의 경우, `Presenter`는 UI를 돕고 지원하기 위한 짧은 수명의 컴포넌트입니다. 프레젠터는 화면이 나타날 때마다 생성되어야 하며, 화면이 사라지면 폐기되어야 합니다.

매번 새로운 프레젠터가 생성됩니다:

```kotlin
class DetailActivity : AppCompatActivity() {

    // 주입된 Presenter
    override val presenter : Presenter by inject()
```

모듈에서 다음과 같이 정의할 수 있습니다:

*   `factory`로 정의 - `by inject()` 또는 `get()`이 호출될 때마다 새로운 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    // Presenter의 Factory 인스턴스
    factory { Presenter() }
}
```

*   `scope`로 정의 - 특정 스코프에 결합된 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
안드로이드 메모리 누수의 대부분은 안드로이드 컴포넌트가 아닌 곳에서 UI/안드로이드 컴포넌트를 참조할 때 발생합니다. 시스템이 해당 참조를 계속 유지하게 되어 가비지 컬렉션(GC)을 통해 완전히 폐기할 수 없게 됩니다.
:::

## 안드로이드 컴포넌트를 위한 스코프 (3.2.1 버전부터)

### 안드로이드 스코프 선언하기

안드로이드 컴포넌트에 의존성 스코프를 지정하려면, 다음과 같이 `scope` 블록을 사용하여 스코프 섹션을 선언해야 합니다:

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // MyActivity를 위한 스코프 선언
  scope<MyActivity> {
   // 현재 스코프에서 MyPresenter 인스턴스를 가져옴
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
 
  // 또는
  activityScope {
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
}
```

### 안드로이드 스코프 클래스들

Koin은 액티비티나 프래그먼트에서 선언된 스코프를 직접 사용할 수 있도록 `ScopeActivity`, `RetainedScopeActivity`, `ScopeFragment` 클래스를 제공합니다:

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter는 MyActivity의 스코프에서 해결됩니다.
    val presenter : MyPresenter by inject()
}
```

내부적으로 안드로이드 스코프는 다음과 같이 `scope` 필드를 구현하기 위해 `AndroidScopeComponent` 인터페이스와 함께 사용되어야 합니다:

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

우리는 `AndroidScopeComponent` 인터페이스를 사용하고 `scope` 프로퍼티를 구현해야 합니다. 이렇게 하면 클래스에서 사용되는 기본 스코프가 설정됩니다.

### 안드로이드 스코프 API

안드로이드 컴포넌트에 바인딩된 Koin 스코프를 생성하려면 다음 함수들을 사용하십시오:
- `createActivityScope()` - 현재 액티비티를 위한 스코프 생성 (스코프 섹션이 선언되어 있어야 함)
- `createActivityRetainedScope()` - 현재 액티비티를 위해 유지되는(retained) 스코프(ViewModel 생명주기에 의해 뒷받침됨) 생성 (스코프 섹션이 선언되어 있어야 함)
- `createFragmentScope()` - 현재 프래그먼트를 위한 스코프를 생성하고 부모 액티비티 스코프에 연결

이 함수들은 서로 다른 종류의 스코프를 구현하기 위해 델리게이트(delegate)로 제공됩니다:

- `activityScope()` - 현재 액티비티를 위한 스코프 생성 (스코프 섹션이 선언되어 있어야 함)
- `activityRetainedScope()` - 현재 액티비티를 위해 유지되는(retained) 스코프(ViewModel 생명주기에 의해 뒷받침됨) 생성 (스코프 섹션이 선언되어 있어야 함)
- `fragmentScope()` - 현재 프래그먼트를 위한 스코프를 생성하고 부모 액티비티 스코프에 연결

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

또한 다음과 같이 유지되는(retained) 스코프(ViewModel 생명주기에 의해 뒷받침됨)를 설정할 수도 있습니다:

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
안드로이드 스코프 전용 클래스를 사용하고 싶지 않다면, 직접 만든 클래스에서 `AndroidScopeComponent`를 사용하고 스코프 생성 API를 활용할 수 있습니다.
:::

### AndroidScopeComponent 및 스코프 닫기 처리

`AndroidScopeComponent`의 `onCloseScope` 함수를 오버라이드하여 Koin 스코프가 파괴되기 전에 코드를 실행할 수 있습니다:

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 스코프가 닫히기 전에 호출됨
    }
}
```

:::note
`onDestroy()` 함수에서 스코프에 접근하려고 하면, 스코프는 이미 닫혀 있을 것입니다.
:::

### 스코프 아키타입 (Scope Archetypes, 4.1.0)

새로운 기능으로, 이제 **아키타입(archetype)**별로 스코프를 선언할 수 있습니다. 특정 타입을 대상으로 스코프를 정의할 필요 없이, "아키타입"(일종의 스코프 클래스 종류)에 대해 정의하면 됩니다. "Activity", "Fragment" 또는 "ViewModel"에 대한 스코프를 선언할 수 있습니다.
이제 다음 DSL 섹션들을 사용할 수 있습니다:

```kotlin
module {
 activityScope {
  // 액티비티를 위한 스코프 인스턴스들
 }

 activityRetainedScope {
  // 유지되는(retained) 스코프인 액티비티를 위한 스코프 인스턴스들
 }

 fragmentScope {
  // 프래그먼트를 위한 스코프 인스턴스들
 }

 viewModelScope {
  // 뷰모델을 위한 스코프 인스턴스들
 }
}
```

이를 통해 스코프 간에 정의를 훨씬 쉽게 재사용할 수 있습니다. 정밀한 객체에 스코프가 필요한 경우가 아니라면 `scope<>{ }`와 같은 특정 타입을 사용할 필요가 없습니다.

:::info
안드로이드 스코프를 활성화하기 위해 `by activityScope()`, `by activityRetainedScope()`, `by fragmentScope()` 함수를 사용하는 방법은 [안드로이드 스코프 API](#android-scope-api)를 참조하십시오. 이 함수들은 스코프 아키타입을 트리거합니다.
:::

예를 들어, 스코프 아키타입을 사용하여 다음과 같이 액티비티에 정의를 쉽게 스코프 지정할 수 있습니다:

```kotlin
// Activity 스코프에 Session 클래스 선언
module {
 activityScope {
    scopedOf(::Session)
 }
}

// 스코프가 지정된 Session 객체를 액티비티에 주입:
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // 액티비티 스코프 생성
    val scope: Scope by activityScope() 
    
    // 위 스코프에서 주입
    val session: Session by inject()
}
```

### 뷰모델 스코프 (ViewModel Scope, 4.1.0 업데이트)

뷰모델(ViewModel)은 누수(액티비티나 프래그먼트 누수 등)를 방지하기 위해 루트(root) 스코프에 대해서만 생성됩니다. 이는 뷰모델이 호환되지 않는 스코프에 접근할 수 있는 가시성 문제를 방지합니다.

:::warn
뷰모델은 액티비티나 프래그먼트 스코프에 접근할 수 없습니다. 왜일까요? 뷰모델은 액티비티나 프래그먼트보다 오래 지속되기 때문에, 적절한 스코프 외부로 의존성을 유출할 수 있기 때문입니다.
뷰모델 스코프 외부의 의존성을 연결해야 하는 경우, "주입된 매개변수(injected parameters)"를 사용하여 뷰모델에 객체를 전달할 수 있습니다: `viewModel { p -> }`
:::

다음과 같이 뷰모델 클래스에 결합하거나 `viewModelScope` DSL 섹션을 사용하여 뷰모델 스코프를 선언하십시오:

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // MyScopeViewModel만을 위한 스코프
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModel 아키타입 스코프 - 모든 ViewModel을 위한 스코프
    viewModelScope {
        scopedOf(::Session)
    }
}
```

뷰모델과 스코프 컴포넌트를 선언했다면, 다음 중 _선택_할 수 있습니다:
- **수동 API (Manual API)** - `KoinScopeComponent`와 `viewModelScope` 함수를 수동으로 사용합니다. 이는 생성된 뷰모델 스코프의 생성과 파괴를 처리합니다. 하지만 스코프 정의를 주입하기 위해 `scope` 프로퍼티에 의존해야 하므로 필드로 주입해야 합니다:
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // 뷰모델 스코프 생성
    override val scope: Scope = viewModelScope()
    
    // 위 스코프를 사용하여 session 주입
    val session: Session by inject()
}
```
- **자동 스코프 생성 (Automatic Scope Creation)**
    - `viewModelScopeFactory` 옵션([Koin 옵션](../koin-core/start-koin.md#koin-options---feature-flagging) 참조)을 활성화하여 뷰모델 스코프를 즉석에서 자동으로 생성합니다.
    - 이를 통해 생성자 주입을 사용할 수 있습니다.
```kotlin
// ViewModel Scope 팩토리 활성화
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// 팩토리 레벨에서 주입 전 자동으로 생성되는 스코프
class MyScopeViewModel(val session: Session) : ViewModel()
```

이제 액티비티나 프래그먼트에서 뷰모델을 호출하기만 하면 됩니다:

```kotlin
class MyActivity : AppCompatActivity() {
    
    // MyScopeViewModel 인스턴스를 생성하고 MyScopeViewModel의 스코프를 할당합니다.
    val vieModel: MyScopeViewModel by viewModel()
}
```

## 스코프 링크 (Scope Links)

스코프 링크를 사용하면 커스텀 스코프를 가진 컴포넌트 간에 인스턴스를 공유할 수 있습니다. 기본적으로 프래그먼트의 스코프는 부모 액티비티 스코프에 링크됩니다.

더 확장된 사용 사례에서는 컴포넌트 전체에서 `Scope` 인스턴스를 사용할 수 있습니다. 예를 들어, `UserSession` 인스턴스를 공유해야 하는 경우가 있습니다.

먼저, 스코프 정의를 선언합니다:

```kotlin
module {
    // 공유 사용자 세션 데이터
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession` 인스턴스 사용을 시작해야 할 때, 해당 인스턴스를 위한 스코프를 생성합니다:

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// ourSession 스코프를 ScopeActivity 또는 ScopeFragment의 현재 `scope`에 링크합니다.
scope.linkTo(ourSession)
```

그런 다음 필요한 곳 어디에서나 사용하십시오:

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ourSession 스코프를 ScopeActivity 또는 ScopeFragment의 현재 `scope`에 링크합니다.
        scope.linkTo(ourSession)

        // 해결을 위해 MyActivity1의 Scope + ourSession 스코프를 살펴봅니다.
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ourSession 스코프를 ScopeActivity 또는 ScopeFragment의 현재 `scope`에 링크합니다.
        scope.linkTo(ourSession)

        // 해결을 위해 MyActivity2의 Scope + ourSession 스코프를 살펴봅니다.
        val userSession = get<UserSession>()
    }
}