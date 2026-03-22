---
title: 다이나믹 모듈
---

# Compose의 다이나믹 모듈 (Dynamic Modules)

Koin은 Composable 생명주기에 연결된 모듈을 동적으로 로드하고 언로드할 수 있는 API를 제공합니다. 이는 기능 모듈(feature modules), 지연 로딩(lazy loading), 그리고 온디맨드(on-demand) 의존성을 처리할 때 유용합니다.

## rememberKoinModules

Composable이 컴포지션(composition)에 진입할 때 Koin 모듈을 로드합니다:

```kotlin
val featureModule = module {
    factory<FeatureRepository>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    // 이 Composable이 컴포지션에 진입할 때 모듈 로드
    rememberKoinModules(featureModule)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

### 여러 모듈 사용

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureDataModule,
        featureDomainModule,
        featureUiModule
    )
}
```

### 모듈 언로드

모듈이 언로드되는 시점을 제어할 수 있습니다:

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureModule,
        unloadOnForgotten = true,  // Composable이 컴포지션을 떠날 때 언로드
        unloadOnAbandoned = true   // 컴포지션이 실패하거나 중단될 때 언로드
    )
}
```

| 옵션 | 트리거 시점 |
|--------|----------------|
| `unloadOnForgotten` | Composable이 컴포지션에서 제거될 때 |
| `unloadOnAbandoned` | 컴포지션이 실패하거나 중단(abandoned)될 때 |

## 활용 사례 (Use Cases)

### 기능 모듈 (Feature Modules)

기능별 의존성을 필요에 따라 로드합니다:

```kotlin
// 별도의 Gradle 모듈에 정의된 기능 모듈
val checkoutModule = module {
    factory<PaymentProcessor>()
    factory<CheckoutRepository>()
    viewModel<CheckoutViewModel>()
}

@Composable
fun CheckoutScreen() {
    rememberKoinModules(checkoutModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<CheckoutViewModel>()
    CheckoutContent(viewModel)
}
```

### 지연 기능 로딩 (Lazy Feature Loading)

네비게이션과 결합하여 기능을 지연 로딩할 수 있습니다:

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen()  // 추가 모듈이 필요 없음
    }
    composable("checkout") {
        // "checkout" 화면으로 이동할 때만 모듈 로드
        rememberKoinModules(checkoutModule, unloadOnForgotten = true)
        CheckoutScreen()
    }
    composable("profile") {
        // "profile" 화면으로 이동할 때만 모듈 로드
        rememberKoinModules(profileModule, unloadOnForgotten = true)
        ProfileScreen()
    }
}
```

### 디버그/프리뷰 모듈 (Debug/Preview Modules)

프리뷰를 위해 구현체를 교체할 수 있습니다:

```kotlin
val debugModule = module {
    single<ApiClient> { MockApiClient() }
}

@Preview
@Composable
fun FeatureScreenPreview() {
    rememberKoinModules(debugModule)
    FeatureScreen()
}
```

### 조건부 모듈 (Conditional Modules)

조건에 따라 모듈을 로드합니다:

```kotlin
@Composable
fun App(isDebug: Boolean) {
    if (isDebug) {
        rememberKoinModules(debugModule)
    }

    MainScreen()
}
```

## Lazy Modules와 함께 사용

더 나은 성능을 위해 Koin의 `lazyModule` 로딩과 결합할 수 있습니다:

```kotlin
val featureModule = lazyModule {
    // 모듈이 로드될 때 정의가 지연 파싱(lazy parse)됨
    factory<HeavyService>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    rememberKoinModules(featureModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

## 권장 사항 (Best Practices)

1. **`unloadOnForgotten = true` 사용** - 메모리 누수를 방지합니다.
   ```kotlin
   rememberKoinModules(featureModule, unloadOnForgotten = true)
   ```

2. **기능당 하나의 모듈 구성** - 모듈을 집중되고 독립적으로 유지하세요.

3. **지연 모듈(lazy modules)과 결합** - 기능이 많은 대규모 앱에 적합합니다.
   ```kotlin
   val featureModule = lazyModule { /* ... */ }
   ```

4. **네비게이션 수준에서 로드** - `NavHost` 컴포저블 내에서 모듈을 로드하세요.

5. **순환 의존성 방지** - 기능 모듈끼리는 서로 의존하지 않아야 합니다.

## 다음 단계

- **[Compose의 Scope](/docs/reference/koin-compose/compose-scopes)** - Scope API
- **[Compose 개요](/docs/reference/koin-compose/compose)** - 설정 및 기본 주입
- **[격리된 컨텍스트 (Isolated Context)](/docs/reference/koin-compose/isolated-context)** - SDK 격리