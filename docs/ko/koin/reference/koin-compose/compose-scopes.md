---
title: Compose에서의 스코프 (Scopes in Compose)
---

# Compose에서의 스코프 (Scopes in Compose)

Koin은 단순한 Composable 바인딩 스코프부터 네비게이션과 통합된 스코프까지, Compose 애플리케이션 내에서 스코프를 관리하기 위한 여러 API를 제공합니다.

## KoinScope

Composable의 생명주기(lifecycle)에 연결된 Koin 스코프를 생성합니다.

```kotlin
val featureModule = module {
    scope<FeatureScope> {
        scoped<FeatureCache>()
        scoped<FeatureRepository>()
    }
}

@Composable
fun FeatureScreen() {
    KoinScope(scopeOf<FeatureScope>()) {
        // 모든 하위 요소는 스코프가 지정된 의존성에 접근할 수 있습니다.
        FeatureContent()
    }
}

@Composable
fun FeatureContent() {
    // 부모 KoinScope로부터 의존성을 해결합니다.
    val cache = koinInject<FeatureCache>()
}
```

Composable이 컴포지션을 벗어날 때(`onForgotten` 또는 `onAbandoned` 시) 스코프는 자동으로 닫힙니다.

## KoinNavigationScope

네비게이션 백 스택 항목(navigation back stack entry)에 연결된 스코프를 생성합니다.

```kotlin
val appModule = module {
    // 네비게이션 스코프 의존성 정의
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenCache>()
        viewModel<ScreenViewModel>()
    }
}

// NavHost 내부
NavHost(navController, startDestination = "home") {
    composable("detail/{id}") { backStackEntry ->
        KoinNavigationScope(backStackEntry) {
            DetailScreen()
        }
    }
}

@Composable
fun DetailScreen() {
    // 이 네비게이션 목적지에 스코프가 지정된 의존성들
    val repository = koinInject<ScreenRepository>()
    val viewModel = koinViewModel<ScreenViewModel>()
}
```

**주요 특징:**
- `NavBackStackEntry.id`에서 파생된 스코프 ID를 사용합니다.
- 네비게이션이 완전히 제거될 때만 스코프가 닫힙니다 (리컴포지션 시에는 닫히지 않음).
- 화면별 의존성 관리에 매우 적합합니다.

:::info
`koin-compose-viewmodel-navigation` 패키지가 필요합니다.
:::

### navigationScope DSL

모듈에서 네비게이션 스코프가 지정된 의존성을 정의합니다.

```kotlin
val appModule = module {
    // 네비게이션 목적지에 스코프가 지정된 의존성들
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}
```

이 방식은 `KoinNavigationScope()`와 함께 사용하기 위해 `NavBackStackEntry`로 한정된(qualified) 스코프를 생성합니다.

## UnboundKoinScope

생명주기 바인딩 없이 외부에서 관리되는 스코프를 제공합니다.

```kotlin
@Composable
fun MyFeature(externalScope: Scope) {
    UnboundKoinScope(scope = externalScope) {
        // 하위 요소들이 해당 스코프에 접근할 수 있습니다.
        val service = koinInject<MyService>()
        FeatureContent()
    }
}
```

:::warning
**주의가 필요한 API** - 스코프가 자동으로 닫히지 않습니다. 메모리 누수를 방지하려면 스코프 생명주기를 수동으로 직접 관리해야 합니다.
:::

**사용 사례:**
- 외부 시스템에 의해 관리되는 스코프
- 여러 Composable 트리에서 공유되는 스코프
- 스코프의 생명주기가 Composable의 생명주기와 일치하지 않는 경우

```kotlin
@Composable
fun MyFeature(externalScope: Scope, onClose: () -> Unit) {
    UnboundKoinScope(scope = externalScope) {
        FeatureContent()

        // 필요한 경우 수동으로 정리
        DisposableEffect(Unit) {
            onDispose { onClose() }
        }
    }
}
```

## currentKoinScope

컴포지션에서 현재 Koin 스코프를 가져옵니다.

```kotlin
@Composable
fun MyScreen() {
    val scope = currentKoinScope()

    // 스코프 직접 사용
    val service = scope.get<MyService>()
}
```

이는 `LocalKoinScopeContext`에서 스코프를 검색합니다. `koinInject()`가 사용하는 기본 스코프이기도 합니다.

## rememberKoinScope

자동 생명주기 관리와 함께 리컴포지션 전반에 걸쳐 Koin 스코프를 기억(remember)합니다.

```kotlin
@Composable
fun FeatureScreen() {
    val scope = rememberKoinScope(scopeOf<FeatureScope>())

    // 주입을 위해 스코프 사용
    val repository = scope.get<FeatureRepository>()

    // FeatureScreen이 컴포지션을 벗어나면 스코프가 닫힙니다.
}
```

## Android 전용 스코프 (Android-Specific Scopes)

### KoinActivityScope

Composable 계층 구조에 Activity 스코프를 제공합니다.

```kotlin
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KoinActivityScope {
                // 모든 하위 요소가 Activity 스코프에 접근할 수 있습니다.
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    // Activity 스코프에서 의존성을 해결합니다.
    val presenter = koinInject<ActivityPresenter>()
}
```

### KoinFragmentScope

Composable 계층 구조에 Fragment 스코프를 제공합니다.

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {
    override val scope: Scope by fragmentScope()

    override fun onCreateView(...): View {
        return ComposeView(requireContext()).apply {
            setContent {
                KoinFragmentScope {
                    FragmentScreen()
                }
            }
        }
    }
}
```

### koinActivityInject

어떤 Composable 내에서든 Activity 스코프의 의존성을 주입받습니다.

```kotlin
val appModule = module {
    scope<MainActivity> {
        scoped<SessionManager>()
    }
}

@Composable
fun DeepNestedScreen() {
    // 트리 어디에서나 Activity 스코프에서 의존성을 해결합니다.
    val sessionManager: SessionManager = koinActivityInject()
}
```

## 스코프 비교 (Scope Comparison)

| API | 생명주기 (Lifecycle) | 사용 사례 (Use Case) |
|-----|-----------|----------|
| `KoinScope` | Composable | 커스텀 스코프가 지정된 Composable |
| `KoinNavigationScope` | NavBackStackEntry | 목적지(Destination)별 스코프 |
| `UnboundKoinScope` | 수동 관리 | 외부 스코프 제공자 |
| `KoinActivityScope` | Activity | Activity 전체 범위 의존성 |
| `KoinFragmentScope` | Fragment | Fragment 전체 범위 의존성 |

## 사용 사례 (Use Cases)

### 화면별 네비게이션 스코프 (Per-Screen Navigation Scopes)

각 화면이 자신만의 스코프를 가집니다.

```kotlin
val appModule = module {
    navigationScope {
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}

NavHost(navController, startDestination = "list") {
    composable("list") { entry ->
        KoinNavigationScope(entry) {
            ListScreen() // 자신만의 ScreenStateHolder를 가짐
        }
    }
    composable("detail/{id}") { entry ->
        KoinNavigationScope(entry) {
            DetailScreen() // 자신만의 ScreenStateHolder를 가짐
        }
    }
}
```

### 세션 스코프 데이터 (Session-Scoped Data)

세션 내의 여러 화면에서 데이터를 공유합니다.

```kotlin
val sessionModule = module {
    scope<UserSession> {
        scoped { ShoppingCart() }
        scoped { UserPreferences() }
    }
}

@Composable
fun ShopApp() {
    KoinScope(scopeOf<UserSession>()) {
        NavHost(/*...*/) {
            composable("catalog") { CatalogScreen() }
            composable("cart") { CartScreen() }
        }
    }
}

@Composable
fun CartScreen() {
    // 세션 내의 모든 화면에서 동일한 장바구니(ShoppingCart) 인스턴스 사용
    val cart = koinInject<ShoppingCart>()
}
```

### 공유 ViewModel 스코프 (Shared ViewModel Scope)

관련된 여러 화면에서 ViewModel과 그 의존성을 공유합니다.

```kotlin
val appModule = module {
    scope<CheckoutFlow> {
        scoped<CheckoutState>()
        viewModel<CheckoutViewModel>()
    }
}

@Composable
fun CheckoutFlow() {
    KoinScope(scopeOf<CheckoutFlow>()) {
        NavHost(/*...*/) {
            composable("cart") { CartScreen() }
            composable("shipping") { ShippingScreen() }
            composable("payment") { PaymentScreen() }
            composable("confirmation") { ConfirmationScreen() }
        }
    }
}

// 모든 화면이 동일한 CheckoutViewModel 인스턴스를 공유합니다.
@Composable
fun CartScreen() {
    val viewModel = koinViewModel<CheckoutViewModel>()
}
```

## 권장 사항 (Best Practices)

1. **화면별 의존성에는 `KoinNavigationScope`를 사용하세요** - 네비게이션과 함께 생명주기가 자동으로 관리됩니다.

2. **`UnboundKoinScope`보다 관리형 스코프를 우선하세요** - 수동 정리를 피할 수 있습니다.

3. **모듈에서 네비게이션 스코프를 정의하세요** - 인라인 스코프 생성보다 더 깔끔합니다.
   ```kotlin
   module {
       navigationScope {
           scoped<MyRepository>()
       }
   }
   ```

4. **다중 화면 플로우에는 `KoinScope`를 사용하세요** - 결제 단계(checkout), 온보딩, 위저드(wizard) 등에 적합합니다.

5. **복잡한 상태 관리를 위해 ViewModel과 결합하세요** - 스코프는 공유 상태를 보유하고, ViewModel은 UI 로직을 처리합니다.

## 다음 단계

- **[동적 모듈 (Dynamic Modules)](/docs/reference/koin-compose/compose-modules)** - 모듈을 동적으로 로드하기
- **[Compose 개요 (Compose Overview)](/docs/reference/koin-compose/compose)** - 설정 및 기본 주입
- **[코어 스코프 (Core Scopes)](/docs/reference/koin-core/scopes)** - 스코프 개념 이해하기