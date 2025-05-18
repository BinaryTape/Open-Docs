---
title: "Android 스코프 관리"
---
## Android 라이프사이클 작업

Android 컴포넌트는 주로 해당 라이프사이클에 의해 관리됩니다. Activity나 Fragment를 직접 인스턴스화할 수 없습니다. 시스템이 모든 생성 및 관리를 대신 처리하고 onCreate, onStart 등의 메서드에 대한 콜백을 수행합니다.

그렇기 때문에 Koin 모듈에서 Activity/Fragment/Service를 기술할 수 없습니다. 속성에 의존성을 주입하고 라이프사이클을 준수해야 합니다. UI 파트와 관련된 컴포넌트는 더 이상 필요하지 않게 되면 즉시 해제해야 합니다.

따라서 다음과 같은 컴포넌트가 있습니다.

* 오래 지속되는 컴포넌트 (Services, Data Repository ...) - 여러 화면에서 사용되며 삭제되지 않음
* 중간 정도 지속되는 컴포넌트 (user sessions ...) - 여러 화면에서 사용되며 일정 시간이 지나면 삭제해야 함
* 짧게 지속되는 컴포넌트 (views) - 하나의 화면에서만 사용되며 화면이 종료될 때 삭제해야 함

오래 지속되는 컴포넌트는 `single` 정의로 쉽게 기술할 수 있습니다. 중간 및 짧게 지속되는 컴포넌트의 경우 여러 가지 접근 방식이 있습니다.

MVP 아키텍처 스타일의 경우 `Presenter`는 UI를 지원/돕는 짧게 지속되는 컴포넌트입니다. Presenter는 화면이 표시될 때마다 생성되어야 하고 화면이 사라지면 삭제되어야 합니다.

새로운 Presenter는 매번 생성됩니다.

```kotlin
class DetailActivity : AppCompatActivity() {

    // 주입된 Presenter
    override val presenter : Presenter by inject()
```

모듈에서 다음과 같이 기술할 수 있습니다.

* `factory` - `by inject()` 또는 `get()`이 호출될 때마다 새로운 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    // Presenter의 Factory 인스턴스
    factory { Presenter() }
}
```

* `scope` - 스코프에 연결된 인스턴스를 생성합니다.

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
대부분의 Android 메모리 누수는 UI/Android 컴포넌트를 Android 컴포넌트가 아닌 것에서 참조할 때 발생합니다. 시스템은 해당 컴포넌트에 대한 참조를 유지하고 가비지 컬렉션을 통해 완전히 삭제할 수 없습니다.
:::

## Android 컴포넌트용 스코프 (3.2.1부터)

### Android 스코프 선언

Android 컴포넌트에 대한 의존성의 범위를 지정하려면 다음과 같이 `scope` 블록으로 스코프 섹션을 선언해야 합니다.

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // MyActivity에 대한 스코프 선언
  scope<MyActivity> {
    // 현재 스코프에서 MyPresenter 인스턴스 가져오기
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Android 스코프 클래스

Koin은 Activity 또는 Fragment에 대해 선언된 스코프를 직접 사용할 수 있도록 `ScopeActivity`, `RetainedScopeActivity` 및 `ScopeFragment` 클래스를 제공합니다.

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter는 MyActivity의 스코프에서 확인됩니다.
    val presenter : MyPresenter by inject()
}
```

내부적으로 Android 스코프는 다음과 같이 `scope` 필드를 구현하기 위해 `AndroidScopeComponent` 인터페이스와 함께 사용해야 합니다.

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

`AndroidScopeComponent` 인터페이스를 사용하고 `scope` 속성을 구현해야 합니다. 이렇게 하면 클래스에서 사용하는 기본 스코프가 설정됩니다.

### Android 스코프 API

Android 컴포넌트에 바인딩된 Koin 스코프를 만들려면 다음 함수를 사용하십시오.
- `createActivityScope()` - 현재 Activity에 대한 스코프 생성 (스코프 섹션이 선언되어야 함)
- `createActivityRetainedScope()` - 현재 Activity에 대한 유지된 스코프 생성 (ViewModel 라이프사이클로 백업됨) (스코프 섹션이 선언되어야 함)
- `createFragmentScope()` - 현재 Fragment에 대한 스코프 생성 및 부모 Activity 스코프에 연결

이러한 함수는 다양한 종류의 스코프를 구현하기 위해 대리자로 사용할 수 있습니다.

- `activityScope()` - 현재 Activity에 대한 스코프 생성 (스코프 섹션이 선언되어야 함)
- `activityRetainedScope()` - 현재 Activity에 대한 유지된 스코프 생성 (ViewModel 라이프사이클로 백업됨) (스코프 섹션이 선언되어야 함)
- `fragmentScope()` - 현재 Fragment에 대한 스코프 생성 및 부모 Activity 스코프에 연결

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

다음과 같이 ViewModel 라이프사이클로 백업된 유지된 스코프를 설정할 수도 있습니다.

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
Android 스코프 클래스를 사용하지 않으려면 사용자 정의 클래스를 사용하고 스코프 생성 API와 함께 `AndroidScopeComponent`를 사용할 수 있습니다.
:::

### AndroidScopeComponent 및 스코프 닫기 처리

`AndroidScopeComponent`에서 `onCloseScope` 함수를 오버라이드하여 Koin 스코프가 소멸되기 전에 일부 코드를 실행할 수 있습니다.

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // 스코프를 닫기 전에 호출됩니다.
    }
}
```

:::note
`onDestroy()` 함수에서 스코프에 액세스하려고 하면 스코프가 이미 닫혀 있습니다.
:::

### ViewModel 스코프 (3.5.4부터)

ViewModel은 누수 (Activity 또는 Fragment 누수 ...)를 방지하기 위해 루트 스코프에 대해서만 생성됩니다. 이는 ViewModel이 호환되지 않는 스코프에 액세스할 수 있는 가시성 문제를 방지합니다.

:::warn
ViewModel은 Activity 또는 Fragment 스코프에 액세스할 수 없습니다. 왜? ViewModel은 Activity 및 Fragment보다 오래 지속되므로 적절한 스코프 외부로 의존성을 누출하기 때문입니다.
:::

:::note
ViewModel 스코프 외부에서 의존성을 브리징해야 하는 경우 "주입된 매개변수 (injected parameters)"를 사용하여 일부 객체를 ViewModel에 전달할 수 있습니다: `viewModel { p ->  }`
:::

`ScopeViewModel`은 ViewModel 스코프에서 작업을 수행하는 데 도움이 되는 새로운 클래스입니다. ViewModel의 스코프 생성을 처리하고 `scope` 속성을 제공하여 `by scope.inject()`로 주입할 수 있습니다.

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // onCleared에서 스코프가 닫힙니다.
    
    // 현재 MyScopeViewModel의 스코프에서 주입됨
    val session by scope.inject<Session>()

}
```

`ScopeViewModel`을 사용하여 스코프가 닫히기 전에 코드를 실행하기 위해 `onCloseScope()` 함수를 오버라이드할 수도 있습니다.

:::note
ViewModel 스코프 내의 모든 인스턴스는 동일한 가시성을 가지며 ViewModel 인스턴스의 수명 동안 유지되며 ViewModel의 onCleared 함수가 호출될 때까지 유지됩니다.
:::

예를 들어 Activity 또는 fragment가 ViewModel을 생성하면 연결된 스코프가 생성됩니다.

```kotlin
class MyActivity : AppCompatActivity() {

    // ViewModel 및 해당 스코프 생성
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

ViewModel이 생성되면 이 스코프 내의 모든 관련 의존성을 생성하고 주입할 수 있습니다.

`ScopeViewModel` 클래스 없이 ViewModel 스코프를 수동으로 구현하려면 다음과 같이 진행하십시오.

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // 의존성 주입
    val session by scope.inject<Session>()

    // 스코프 지우기
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## 스코프 링크 (Scope Links)

스코프 링크를 사용하면 사용자 정의 스코프를 가진 컴포넌트 간에 인스턴스를 공유할 수 있습니다.

보다 확장된 사용법에서는 컴포넌트 간에 `Scope` 인스턴스를 사용할 수 있습니다. 예를 들어 `UserSession` 인스턴스를 공유해야 하는 경우입니다.

먼저 스코프 정의를 선언합니다.

```kotlin
module {
    // 공유 사용자 세션 데이터
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession` 인스턴스 사용을 시작해야 할 때 해당 인스턴스에 대한 스코프를 만듭니다.

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// ScopeActivity 또는 ScopeFragment에서 현재 `scope`에 ourSession 스코프를 연결합니다.
scope.linkTo(ourSession)
```

그런 다음 필요한 모든 곳에서 사용합니다.

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ScopeActivity 또는 ScopeFragment에서 현재 `scope`에 ourSession 스코프를 연결합니다.
        scope.linkTo(ourSession)

        // MyActivity1의 스코프 + ourSession 스코프에서 확인합니다.
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ScopeActivity 또는 ScopeFragment에서 현재 `scope`에 ourSession 스코프를 연결합니다.
        scope.linkTo(ourSession)

        // MyActivity2의 스코프 + ourSession 스코프에서 확인합니다.
        val userSession = get<UserSession>()
    }
}
```