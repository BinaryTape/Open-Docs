---
title: 안드로이드 스코프(Android Scopes)
---

이 가이드는 안드로이드 전용 스코프(Scope) 구현에 대해 다룹니다.

:::info
코어 스코프 개념에 대해서는 [스코프(Scopes)](/docs/reference/koin-core/scopes)를 참조하십시오.
:::

## 개요

Koin의 스코프를 사용하면 의존성의 생명주기(lifecycle)를 안드로이드 컴포넌트 생명주기에 맞춰 관리할 수 있습니다. 이를 통해 메모리 누수를 방지하고 적절한 리소스 관리를 보장할 수 있습니다.

### 스코프 계층 구조 (Scope Hierarchy)

| 스코프 유형 | 수명 | 화면 회전 시 유지 여부 | DSL | 어노테이션 |
|------------|----------|-------------------|-----|------------|
| **Application** | 앱 전체 | ✅ Yes | `single { }` | `@Singleton` |
| **Activity** | 액티비티 생명주기 | ❌ No | `activityScope { }` | `@ActivityScope` |
| **Activity Retained** | finish() 호출 시까지 | ✅ Yes | `activityRetainedScope { }` | `@ActivityRetainedScope` |
| **Fragment** | 프래그먼트 생명주기 | ❌ No | `fragmentScope { }` | `@FragmentScope` |
| **ViewModel** | 뷰모델 생명주기 | ✅ Yes | `viewModelScope { }` | `@ViewModelScope` |

### 스코프 관계 (Scope Relationships)

```
Application Scope (single { })
    └── Activity Retained Scope (화면 회전 시 유지됨)
            └── Activity Scope
                    ├── Fragment Scope 1
                    └── Fragment Scope 2
            └── ViewModel Scope (액티비티/프래그먼트 스코프에 접근 불가)
```

:::info
**핵심 원칙:** 자식 스코프는 부모 스코프의 정의에 접근할 수 있지만, 반대는 불가능합니다.
:::

## 스코프 의존성 선언하기

### 컴파일러 플러그인 DSL

```kotlin
val appModule = module {
    // 액티비티 스코프
    activityScope {
        scoped<ActivityPresenter>()
        scoped<ActivityNavigator>()
    }

    // 프래그먼트 스코프
    fragmentScope {
        scoped<FragmentPresenter>()
    }

    // 뷰모델 스코프
    viewModelScope {
        scoped<UserCache>()
        viewModel<UserViewModel>()
    }
}
```

### 어노테이션

```kotlin
// 액티비티 스코프
@ActivityScope
class ActivityPresenter(private val repository: UserRepository)

@ActivityScope
class ActivityNavigator

// 액티비티 유지(retained) 스코프 (화면 회전 시 유지됨)
@ActivityRetainedScope
class RetainedPresenter

// 프래그먼트 스코프
@FragmentScope
class FragmentPresenter

// 뷰모델 스코프
@ViewModelScope
class UserCache

@KoinViewModel
@ViewModelScope
class UserViewModel(private val cache: UserCache) : ViewModel()
```

### 클래식 DSL

```kotlin
val appModule = module {
    activityScope {
        scoped { ActivityPresenter(get()) }
        scoped { ActivityNavigator() }
    }

    fragmentScope {
        scoped { FragmentPresenter(get()) }
    }

    viewModelScope {
        scoped { UserCache() }
        viewModel { UserViewModel(get()) }
    }
}
```

## 안드로이드 컴포넌트에서 스코프 사용하기

### 액티비티 스코프 (Activity Scope)

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 액티비티 생명주기에 결합된 스코프 생성
    override val scope: Scope by activityScope()

    // 스코프로부터 주입
    private val presenter: ActivityPresenter by inject()
}
```

또는 편의용 베이스 클래스를 사용할 수 있습니다:

```kotlin
class MyActivity : ScopeActivity() {

    // 스코프가 이미 설정되어 있음
    private val presenter: ActivityPresenter by inject()
}
```

### 액티비티 유지 스코프 (Activity Retained Scope)

구성 변경(화면 회전, 테마 변경 등) 시에도 유지됩니다:

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // 뷰모델 생명주기에 의해 지원됨 - 화면 회전 시 유지됨
    override val scope: Scope by activityRetainedScope()

    private val presenter: RetainedPresenter by inject()
}
```

또는 편의용 베이스 클래스를 사용할 수 있습니다:

```kotlin
class MyActivity : RetainedScopeActivity() {

    private val presenter: RetainedPresenter by inject()
}
```

### 프래그먼트 스코프 (Fragment Scope)

프래그먼트 스코프는 자동으로 부모 액티비티 스코프에 연결됩니다:

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {

    override val scope: Scope by fragmentScope()

    // 프래그먼트 스코프로부터 주입
    private val presenter: FragmentPresenter by inject()

    // 액티비티 스코프의 의존성에도 접근 가능
    private val activityPresenter: ActivityPresenter by inject()
}
```

또는 편의용 베이스 클래스를 사용할 수 있습니다:

```kotlin
class MyFragment : ScopeFragment() {

    private val presenter: FragmentPresenter by inject()
}
```

## 타입 기반 vs 아키타입 스코프 (Type-Based vs Archetype Scopes)

### 아키타입 스코프 (권장)

어떤 액티비티나 프래그먼트와도 작동하는 범용적인 스코프입니다:

```kotlin
module {
    activityScope {
        scoped<MyPresenter>()
    }
}

// 어떤 액티비티에서든 작동함
class ActivityA : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}

class ActivityB : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}
```

### 타입 기반 스코프 (Type-Based Scope)

특정 클래스에 결합된 스코프입니다:

```kotlin
module {
    scope<MyActivity> {
        scoped<MyPresenter>()
    }
}

// MyActivity에서만 작동함
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()
    private val presenter: MyPresenter by inject()
}
```

## 뷰모델 스코프 (ViewModel Scope)

뷰모델은 (메모리 누수를 방지하기 위해) 액티비티나 프래그먼트 스코프에 접근할 수 없습니다. 스코프가 지정된 의존성을 위해서는 뷰모델 스코프를 사용하십시오:

```kotlin
module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

상세한 뷰모델 스코프 사용법은 [스코프 - 뷰모델 스코프](/docs/reference/koin-core/scopes#viewmodel-scope)를 참조하십시오.

## 스코프 생명주기 (Scope Lifecycle)

### 스코프 종료 처리

스코프가 파괴되기 전에 정리 작업을 수행하려면 `onCloseScope()`를 오버라이드하십시오:

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // scope.close() 호출 직전에 실행됨
        // 여기서 여전히 스코프에 접근 가능함
    }
}
```

:::warning
`onDestroy()`에서 스코프에 접근하지 마십시오. 해당 시점에 스코프는 이미 닫혀 있습니다.
:::

## 스코프 링크 (Scope Links)

커스텀 스코프를 사용하여 컴포넌트 간에 인스턴스를 공유할 수 있습니다:

```kotlin
module {
    scope(named("session")) {
        scoped<UserSession>()
    }
}
```

```kotlin
class MyActivity : ScopeActivity() {

    fun startSession() {
        val sessionScope = getKoin().createScope("session", named("session"))

        // 현재 스코프에 링크
        scope.linkTo(sessionScope)

        // 이제 UserSession에 접근 가능
        val session: UserSession = get()
    }
}
```

## 빠른 참조 (Quick Reference)

| 컴포넌트 | 델리게이트 | 베이스 클래스 |
|-----------|----------|------------|
| Activity | `by activityScope()` | `ScopeActivity` |
| Activity (유지됨) | `by activityRetainedScope()` | `RetainedScopeActivity` |
| Fragment | `by fragmentScope()` | `ScopeFragment` |

| 스코프 | 화면 회전 시 유지 여부 | 사용 사례 |
|-------|-------------------|----------|
| `activityScope` | ❌ No | UI 상태, 프레젠터(Presenter) |
| `activityRetainedScope` | ✅ Yes | 폼(Form) 상태, 대기 중인 요청 |
| `fragmentScope` | ❌ No | 프래그먼트 전용 프레젠터 |
| `viewModelScope` | ✅ Yes | 뷰모델 의존성 |

## 베스트 프랙티스 (Best Practices)

1. **아키타입(Archetype) 사용** - 재사용성을 위해 `scope<MyActivity> { }`보다는 `activityScope { }`를 우선적으로 사용하십시오.
2. **화면 회전 시 유지(Retained)** - 화면 회전 시에도 유지되어야 하는 상태에는 `activityRetainedScope`를 사용하십시오.
3. **누수 방지** - 싱글톤(Singleton)에 액티비티나 프래그먼트를 절대 주입하지 마십시오.
4. **커스텀 스코프 닫기** - 수동으로 생성한 스코프는 항상 직접 닫아주어야 합니다.
5. **onCloseScope 활용** - 스코프가 파괴되기 전 정리 작업에 사용하십시오.

## 다음 단계

- **[코어 스코프(Core Scopes)](/docs/reference/koin-core/scopes)** - 스코프 기초 및 뷰모델 스코프
- **[뷰모델(ViewModel)](/docs/reference/koin-android/viewmodel)** - 뷰모델 주입
- **[테스팅(Testing)](/docs/reference/koin-test/testing)** - 스코프가 지정된 의존성 테스트하기